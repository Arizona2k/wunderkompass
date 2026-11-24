import assert from 'node:assert/strict';

// Die Globus-Knöpfe (Ortssuche, Kartenauswahl, Tag-Regler, Quizthema) kommen als eigener Programmteil nach
// (app/globus-bedienung.tsx). Scheitert das Laden (kein Netz vor der Offline-Vorbereitung, neue Version
// ausgeliefert), zeigt die Stelle „… braucht noch einen Versuch“ mit „Seite neu laden“, und der Rest des Globus
// bleibt bedienbar. Ohne Fehlergrenze wurde die ganze Seite weiß (Code-Prüfung 24.11.2026).
export async function globusBedienungFehlt({browser, base, ready, report, shots}) {
  // Ohne Service Worker, damit das Abfangen sicher greift. Die Seite wird absichtlich nicht überwacht:
  // Die abgebrochene Anfrage ist gewollt.
  const context = await browser.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'reduce', serviceWorkers: 'block'});
  const page = await context.newPage();
  let gesperrt = true, abgefangen = 0;
  await context.route('**/globus-bedienung-*.js', async route => {
    if (gesperrt) { abgefangen++; await route.abort('failed'); return; }
    await route.continue();
  });
  try {
    await page.goto(base + '#globe');
    await ready(page);
    const ortssuche = page.locator('.place-picker .learning-status[data-tone=error]');
    await ortssuche.waitFor();
    assert.ok(abgefangen > 0, 'das Laden der Globus-Knöpfe muss wirklich gescheitert sein');
    assert.match(await ortssuche.textContent(), /Die Ortssuche braucht noch einen Versuch/);
    assert.equal(await ortssuche.getAttribute('role'), 'alert');
    // Der Rest bleibt: Globus-Bühne und Bereichsknöpfe sind da, das letzte Auffangnetz der ganzen Seite nicht.
    await page.locator('.globe-stage').waitFor();
    await page.getByRole('button', {name: 'Länder', exact: true}).waitFor();
    assert.equal(await page.getByText('WunderKompass braucht noch einen Versuch').count(), 0);
    if (shots) await page.screenshot({path: shots + '/globus-bedienung-fehlt-390.png'});
    // Wieder Netz: „Seite neu laden“ bringt die Ortssuche zurück.
    gesperrt = false;
    await ortssuche.getByRole('button', {name: 'Seite neu laden', exact: true}).click();
    await page.getByRole('combobox', {name: 'Wohin möchtest du reisen?', exact: true}).waitFor();
    report.checks.push('Globus-Knöpfe laden nicht: Hinweis mit „Seite neu laden“ an der Stelle, Globus bleibt, nach dem Neuladen ist die Ortssuche wieder da');
  } finally {
    gesperrt = false;
    await context.close();
  }
}
