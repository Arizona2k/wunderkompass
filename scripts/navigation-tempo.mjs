// WebKit lässt höchstens 200 Navigationen in etwa 10 Sekunden zu, auch Sprünge innerhalb der Seite.
// Danach blockiert es weitere („Excessive navigation attempts blocked.“): Enter auf einem Link bewirkt
// nichts mehr, und page.goBack wartet vergeblich. Gemessen am 21.11.2026 (Playwright 1.65.1, WebKit 27.2).
// In den Testbrowsern greift so eine Sperre nur in WebKit: Playwright schaltet den Schutz in Chromium ab,
// und Firefox würde mit einem sichtbaren SecurityError antworten.
// Ein Kind kommt nie in diese Nähe, schnelle Testabläufe schon. Deshalb:
// - zaehleNavigationen(page) merkt sich jede Navigation der Hauptseite, auch history.replaceState der App.
//   monitorBrowserErrors ruft es auf. navigationen(page) nennt die Zahl seit dem Start.
// - navigationsTempo(page, engine) wartet in WebKit vor einem gewollten Seitenwechsel, bis in den letzten
//   10 Sekunden weniger als 100 Navigationen stattfanden. Der Rest bleibt Puffer für Abläufe danach.
//   Nur das Tempo des Tests sinkt. Wie oft die App selbst navigiert, prüft der Test mit navigationen(page)
//   je Schritt; sonst würde das Bremsen eine App verdecken, die den Verlauf zu oft beschreibt.
export const NAVIGATION_FENSTER_MS = 10000;
export const NAVIGATION_GRENZE = 100;
// Länger als ein Fenster plus Puffer: Wer so lange warten müsste, navigiert ohne Zutun des Tests weiter.
const LAENGSTE_WARTEZEIT_MS = 15000;
const staende = new WeakMap();

export function zaehleNavigationen(page) {
  if (staende.has(page)) return staende.get(page);
  const stand = {zeiten: [], gesamt: 0};
  staende.set(page, stand);
  page.on('framenavigated', frame => {
    if (frame !== page.mainFrame()) return;
    const jetzt = Date.now();
    stand.gesamt++;
    stand.zeiten.push(jetzt);
    while (stand.zeiten[0] <= jetzt - NAVIGATION_FENSTER_MS) stand.zeiten.shift();
  });
  return stand;
}

export const navigationen = page => zaehleNavigationen(page).gesamt;

// `engine` gilt nur, wenn Playwright keinen Browser nennt (dauerhafte Kontexte).
export async function navigationsTempo(page, engine) {
  if ((page.context().browser()?.browserType().name() ?? engine) !== 'webkit') return;
  const stand = zaehleNavigationen(page);
  const ende = Date.now() + LAENGSTE_WARTEZEIT_MS;
  for (;;) {
    const jetzt = Date.now();
    while (stand.zeiten.length && stand.zeiten[0] <= jetzt - NAVIGATION_FENSTER_MS) stand.zeiten.shift();
    if (stand.zeiten.length < NAVIGATION_GRENZE) return;
    if (jetzt > ende) throw Error(`Die Seite navigiert ohne Zutun des Tests weiter: ${stand.zeiten.length} Navigationen in ${NAVIGATION_FENSTER_MS / 1000} s.`);
    await page.waitForTimeout(Math.min(stand.zeiten[0] + NAVIGATION_FENSTER_MS - jetzt + 20, ende - jetzt + 20));
  }
}
