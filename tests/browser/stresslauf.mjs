// Stresslauf: QA_FRAME_DELAY_MS=150 node tests/browser/run.mjs … lässt jedes Bild der Seite (requestAnimationFrame)
// so viele Millisekunden später kommen. So fallen Fehler, bei denen die Seite etwas erst im nächsten Bild setzt und
// der Test sofort fragt, schon hier auf statt erst auf dem ausgelasteten CI-Rechner (BACKLOG „Fokus oder Zustand erst
// im nächsten Bild“; Entscheidung des Nutzers vom 24.11.2026: als Schritt in /pruefen).
// Gebremst wird in jedem Kontext, den die Suiten öffnen: über browser.newContext (newPage läuft in Playwright darüber)
// und über launchPersistentContext. Darum greift die Bremse an den Browser-Typen selbst, nicht nur am Hauptbrowser.
// Grenze: Jedes Bild wartet für sich. Zwei Rückrufe, die die Seite im selben Bild anmeldet, landen darum nicht sicher
// wieder im selben Bild. Rot im Stresslauf heißt also erst: Ursache klären (Seite, Test oder Bremse), dann beheben.

export function bremseBilder(playwright, ms) {
  if (!Number.isFinite(ms) || ms <= 0) throw new Error('QA_FRAME_DELAY_MS muss eine Zahl über 0 sein (Millisekunden, ohne Einheit), nicht ' + JSON.stringify(process.env.QA_FRAME_DELAY_MS ?? ms));
  for (const name of ['chromium', 'firefox', 'webkit']) {
    const type = playwright[name];
    const launch = type.launch.bind(type);
    const launchPersistentContext = type.launchPersistentContext.bind(type);
    type.launch = async (...args) => {
      const browser = await launch(...args);
      const newContext = browser.newContext.bind(browser);
      browser.newContext = async (...settings) => bremse(await newContext(...settings), ms);
      return browser;
    };
    type.launchPersistentContext = async (...args) => bremse(await launchPersistentContext(...args), ms);
  }
}

async function bremse(context, ms) {
  await context.addInitScript(bildVerzoegerung, ms);
  return context;
}

// Läuft in der Seite, vor deren eigenen Skripten. Erst warten, dann auf das echte nächste Bild: So bekommt der
// Rückruf weiter die Zeit eines echten Bildes. Abbrechen wirkt in beiden Phasen.
function bildVerzoegerung(ms) {
  const raf = window.requestAnimationFrame.bind(window);
  const caf = window.cancelAnimationFrame.bind(window);
  const offen = new Map();
  let naechste = 0;
  window.requestAnimationFrame = callback => {
    const id = ++naechste;
    const eintrag = {timer: 0, bild: 0};
    eintrag.timer = setTimeout(() => {
      eintrag.bild = raf(zeit => {
        offen.delete(id);
        callback(zeit);
      });
    }, ms);
    offen.set(id, eintrag);
    return id;
  };
  window.cancelAnimationFrame = id => {
    const eintrag = offen.get(id);
    if (!eintrag) return;
    offen.delete(id);
    clearTimeout(eintrag.timer);
    if (eintrag.bild) caf(eintrag.bild);
  };
}
