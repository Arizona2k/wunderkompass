// WebKit lässt höchstens 200 Navigationen in etwa 10 Sekunden zu, auch Sprünge innerhalb der Seite.
// Danach blockiert es weitere („Excessive navigation attempts blocked.“): Enter auf einem Link bewirkt
// nichts mehr, und page.goBack wartet vergeblich. Gemessen am 21.11.2026 (Playwright 1.65.1, WebKit 27.2);
// Chromium und Firefox haben für Sprünge innerhalb der Seite keine solche Grenze.
// Ein Kind kommt nie in diese Nähe, schnelle Testabläufe schon. Deshalb:
// - zaehleNavigationen(page) merkt sich jede Navigation der Hauptseite. monitorBrowserErrors ruft es auf.
// - navigationsTempo(page) wartet in WebKit vor einem gewollten Seitenwechsel, bis in den letzten
//   10 Sekunden weniger als 100 Navigationen stattfanden. Der Rest bleibt Puffer für Abläufe danach.
//   Geprüft wird weiter jede Navigation, nur das Tempo sinkt.
export const NAVIGATION_FENSTER_MS = 10000;
export const NAVIGATION_GRENZE = 100;
const zeiten = new WeakMap();

export function zaehleNavigationen(page) {
  if (zeiten.has(page)) return;
  const liste = [];
  zeiten.set(page, liste);
  page.on('framenavigated', frame => { if (frame === page.mainFrame()) liste.push(Date.now()); });
}

export async function navigationsTempo(page) {
  if (page.context().browser()?.browserType().name() !== 'webkit') return;
  zaehleNavigationen(page);
  const liste = zeiten.get(page);
  for (;;) {
    const jetzt = Date.now();
    while (liste.length && liste[0] <= jetzt - NAVIGATION_FENSTER_MS) liste.shift();
    if (liste.length < NAVIGATION_GRENZE) return;
    await page.waitForTimeout(liste[0] + NAVIGATION_FENSTER_MS - jetzt + 20);
  }
}
