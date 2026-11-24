// Gewollte Seitenwechsel im Browser-Test: Neuladen, eine neue Adresse, Schließen der Seite oder des Kontexts.
// Bricht so ein Wechsel eine Anfrage ab, die noch lädt (Chromium: net::ERR_ABORTED, Firefox: NS_BINDING_ABORTED,
// WebKit: Load request cancelled), schlägt die Fehlerüberwachung an. Ein Kind merkt davon nichts; im Test verdeckt
// das Rauschen echte Fehler. Bis zum 24.11.2026 fünf späte Funde dieser Art (BACKLOG „Seitenwechsel im Test“).
//
// Darum merkt sich die Überwachung (monitorBrowserErrors) je Seite die offenen Anfragen, und Playwrights page.reload,
// page.goto, page.close und context.close warten vorher, bis die Seite ruhig ist. Kein Test muss mehr daran denken.
// Jede Anfrage, die dabei fertig wird, bleibt voll überwacht (auch ein 404).
// Ausgenommen sind Anfragen, die ein Test selbst in einem route-Handler festhält, etwa um einen Ladezustand zu
// prüfen: Auf die wartet niemand, sonst hinge der Test.
// Für Wechsel innerhalb der App (Klick auf einen Bereich, goBack) gibt es weiter ladeanfragen(page) in harness.mjs.

// Fertig erst nach einer Ruhezeit ohne Anfrage. Sie beginnt nach jeder Anfrage neu (Start oder Ende).
// React 19 hält das Einblenden nachgeladener Teile (lazy + Suspense) bis zu 300 ms nach dem Platzhalter
// zurück; erst danach starten deren Bilder. Vom Ende des Programmteils an sind das höchstens 300 ms, dazu
// kommt das Rendern auf einem langsamen Rechner. 500 ms lassen dafür Reserve. Gezählt wird ab dem Aufruf:
// Ein Klick kurz davor kann noch Anfragen auslösen, die erst nach Reacts Sammelzeit starten.
export const RUHEZEIT = 500;
export const WARTEZEIT_MS = 20000;

const staende = new WeakMap();
// Anfrage → wie viele route-Handler sie gerade festhalten (ein Handler kann mit route.fallback() weiterreichen).
const gehalten = new WeakMap();

// Merkt sich ab jetzt die offenen Anfragen der Seite (außer Seitenaufrufen). Mehrfach aufrufbar.
// `proof`: Bericht der Suite; dorthin schreiben die automatischen Wartepunkte, wenn die Seite nicht zur Ruhe kommt.
// `timeout`: Zeitlimit der automatischen Wartepunkte (nur für den Unit-Test kürzer).
export function beobachteAnfragen(page, {proof, tag = '', timeout = WARTEZEIT_MS} = {}) {
  let stand = staende.get(page);
  if (stand) {
    stand.proof ??= proof;
    return stand;
  }
  stand = {offen: new Set(), zuletzt: 0, proof, tag, timeout};
  staende.set(page, stand);
  page.on('request', request => {
    if (request.isNavigationRequest()) return;
    stand.offen.add(request);
    stand.zuletzt = Date.now();
  });
  const fertig = request => { if (stand.offen.delete(request)) stand.zuletzt = Date.now(); };
  page.on('requestfinished', fertig);
  page.on('requestfailed', fertig);
  return stand;
}

// Wartet, bis keine Anfrage der Seite mehr läuft, `ruhezeit` (ab Aufruf und ab der letzten Anfrage) vergangen ist
// und die Seite zweimal gezeichnet hat. Wirft nach `timeout` und nennt die offenen Anfragen.
export async function warteAufRuhe(page, {timeout = WARTEZEIT_MS, ruhezeit = RUHEZEIT} = {}) {
  const stand = beobachteAnfragen(page);
  const offen = () => [...stand.offen].filter(request => !gehalten.get(request));
  const aufruf = Date.now(), ende = aufruf + timeout;
  for (;;) {
    if (Date.now() > ende) {
      const rest = offen();
      throw Error(rest.length
        ? 'Anfragen laufen noch vor dem gewollten Seitenwechsel: ' + rest.map(request => request.url()).join(', ')
        : 'Seite vor dem gewollten Seitenwechsel nicht zur Ruhe gekommen: immer neue Anfragen, oder sie zeichnet nicht mehr');
    }
    if (offen().length || Date.now() - Math.max(aufruf, stand.zuletzt) < ruhezeit) { await page.waitForTimeout(50); continue; }
    // Zum Schluss zwei Bildwechsel der Seite abwarten: Erst beim Zeichnen entscheidet der Browser, ob ein
    // Bild mit loading="lazy" jetzt lädt. Ist die Seite gerade beschäftigt, wartet dieser Schritt auf sie.
    const vorher = stand.zuletzt;
    const gezeichnet = await zweiBildwechsel(page, ende - Date.now());
    if (gezeichnet && !offen().length && stand.zuletzt === vorher) return;
    if (!gezeichnet) await page.waitForTimeout(50);
  }
}

// true, wenn die Seite zweimal gezeichnet hat. false, wenn sie gerade das Dokument wechselt oder bis zum
// Zeitlimit nicht zeichnet (z. B. offener Dialog): Dann versucht es die nächste Runde noch einmal.
async function zweiBildwechsel(page, rest) {
  let uhr;
  const zuSpaet = new Promise(fertig => { uhr = setTimeout(fertig, Math.max(0, Math.min(3000, rest)) + 50, false); });
  try {
    const gezeichnet = page.evaluate(() => new Promise(fertig => {
      const notfalls = setTimeout(fertig, 1000);
      requestAnimationFrame(() => requestAnimationFrame(() => { clearTimeout(notfalls); fertig(); }));
    })).then(() => true);
    return await Promise.race([gezeichnet, zuSpaet]);
  } catch (error) {
    if (page.isClosed()) throw error;
    return false;
  } finally {
    clearTimeout(uhr);
  }
}

// Automatischer Wartepunkt vor reload, goto und close. Nur für überwachte Seiten.
// Kommt die Seite nicht zur Ruhe, steht das als Browserfehler im Bericht, und der Wechsel geschieht trotzdem:
// So verdeckt ein Wartepunkt im finally nie den eigentlichen Fehler eines Tests.
// Vor reload und goto zählt die Ruhezeit ab dem Aufruf: Dort war oft gerade ein Klick, dessen Anfragen noch nicht
// gestartet sind. Beim Schließen (`ruhezeit` 0) reichen laufende Anfragen und zwei Bildwechsel: Am Ende eines Tests hat
// der letzte Schritt meist auf seinen Inhalt gewartet. Gemessen am 24.11.2026 (Suite wissenskarte): 74 Schließen
// warteten mit Ruhezeit zusammen 36 s, fast nur wegen der Ruhezeit.
async function vorWechsel(page, wie, {ruhezeit} = {}) {
  const stand = staende.get(page);
  if (!stand || page.isClosed()) return;
  const zaehler = WARTEZEITEN[wie] ??= {anzahl: 0, ms: 0};
  zaehler.anzahl++;
  const beginn = Date.now();
  try {
    await warteAufRuhe(page, {timeout: stand.timeout, ruhezeit});
  } catch (error) {
    if (page.isClosed()) return;
    if (!stand.proof) throw error;
    stand.proof.errors.push(`${stand.tag}Vor dem gewollten Seitenwechsel (${wie}): ${error.message}`);
  } finally {
    zaehler.ms += Date.now() - beginn;
  }
}

// Wie oft und wie lange die automatischen Wartepunkte gewartet haben (je Art). Der Runner schreibt es ins Log,
// damit sichtbar bleibt, was die Wartehilfe an Zeit kostet.
export const WARTEZEITEN = {};

// Einmal je Lauf, bevor die erste Suite startet (tests/browser/run.mjs). Greift an den Klassen von Playwright,
// damit jede Seite und jeder Kontext dabei ist, auch die, die Suiten selbst öffnen.
export async function installiereSeitenwechsel(browser) {
  const probe = await browser.newContext();
  try {
    const seite = await probe.newPage();
    installiere(Object.getPrototypeOf(probe), Object.getPrototypeOf(seite));
  } finally {
    await probe.close();
  }
}

const INSTALLIERT = Symbol('seitenwechsel');
export function installiere(kontextKlasse, seitenKlasse) {
  if (seitenKlasse[INSTALLIERT]) return;
  seitenKlasse[INSTALLIERT] = true;
  const {reload, goto, close} = seitenKlasse;
  seitenKlasse.reload = async function (...args) { await vorWechsel(this, 'Neuladen'); return reload.apply(this, args); };
  // Der erste Aufruf auf einer frischen Seite verlässt kein Dokument.
  seitenKlasse.goto = async function (...args) { if (this.url() !== 'about:blank') await vorWechsel(this, 'neue Adresse'); return goto.apply(this, args); };
  seitenKlasse.close = async function (...args) { await vorWechsel(this, 'Schließen', {ruhezeit: 0}); return close.apply(this, args); };
  const kontextClose = kontextKlasse.close;
  kontextKlasse.close = async function (...args) {
    await Promise.all(this.pages().map(page => vorWechsel(page, 'Schließen', {ruhezeit: 0})));
    return kontextClose.apply(this, args);
  };
  festhaltenErkennen(kontextKlasse);
  festhaltenErkennen(seitenKlasse);
}

// Merkt sich, welche Anfrage gerade in einem route-Handler des Tests steckt. unroute bekommt dieselbe Hülle,
// damit es den Handler weiter findet.
function festhaltenErkennen(klasse) {
  const {route, unroute} = klasse;
  const huellen = new WeakMap();
  const huelle = handler => {
    if (typeof handler !== 'function') return handler;
    let gehuellt = huellen.get(handler);
    if (!gehuellt) {
      gehuellt = async function (eingriff, ...rest) {
        const anfrage = eingriff.request();
        gehalten.set(anfrage, (gehalten.get(anfrage) ?? 0) + 1);
        try {
          return await handler.call(this, eingriff, ...rest);
        } finally {
          gehalten.set(anfrage, gehalten.get(anfrage) - 1);
        }
      };
      huellen.set(handler, gehuellt);
    }
    return gehuellt;
  };
  klasse.route = function (url, handler, ...rest) { return route.call(this, url, huelle(handler), ...rest); };
  klasse.unroute = function (url, handler, ...rest) {
    return unroute.call(this, url, typeof handler === 'function' ? huellen.get(handler) ?? handler : handler, ...rest);
  };
}
