import assert from 'node:assert/strict';
import {createSave, SAVE_KEY} from '../../app/progress-storage.ts';
import {bereich, ladeanfragen} from './harness.mjs';
await import('../../scripts/test-runtime.mjs');
const {worldGameBank} = await import('../../app/world-game-bank.ts');
const {CHALLENGE_BANK} = await import('../../app/knowledge-challenge.ts');
const {CLASSIC_QUESTIONS} = await import('../../app/classic-learning.ts');

// Nach einer Antwort rollt die Rückmeldung ins Bild (app/kern/spiel-fokus.ts, zurRueckmeldung; Spieltest Personen-Rätsel, Muss 1):
// Nach „Noch nicht ganz“ steht der Kasten ganz über der Leiste, und der Fokus springt nicht in den Kasten. Nach „Richtig!“
// steht der Kasten im Bild und „Nächste Aufgabe“ hat den Fokus. Ist der Kasten höher als der freie Platz (kleines Handy, große
// Schrift, lange Erklärung), steht sein Anfang oben und der Fokus liegt auf „Richtig!“ (code-pruefer, Soll 3).
// Der Test spielt in der ersten Aufgabe erst eine falsche, dann die richtige Antwort; welche richtig ist, liest er aus der
// gespeicherten Runde und den Fragebänken (so hängt nichts von der zufälligen Reihenfolge der Antworten ab).
// Vor jedem Klick rollt er nach oben, damit der Kasten erst einmal außer Sicht liegt.
const welt = id => (sitzungen) => {
  const s = sitzungen['world:' + id], q = worldGameBank(id).find(q => q.id === s?.items?.[s.index ?? 0]);
  return q && q.answers[q.correct];
};
const SPIELE = {
  personen: {key: 'world:people', kasten: '.world-game-room .lab-feedback', richtig: welt('people')},
  kreuz: {key: 'world:knowledge-challenge', kasten: '.knowledge-challenge .lab-feedback', richtig: sitzungen => {
    const s = sitzungen['world:knowledge-challenge']?.challenge, q = CHALLENGE_BANK.find(q => q.id === s?.ids?.[s.index]);
    return q && q.answers[q.correct];
  }},
  detektiv: {key: 'classic:detective', kasten: '.classic-learning .game-feedback', richtig: sitzungen => {
    const s = sitzungen.detective?.learningRound;
    return CLASSIC_QUESTIONS.find(q => q.id === s?.ids?.[s.index])?.correct;
  }},
  technik: {key: 'world:technology', kasten: '.world-game-room .lab-feedback', richtig: welt('technology')},
};
// Für den hohen Kasten beginnt die Technik-Runde mit der längsten Erklärung (Kühlschrank, über 500 Zeichen).
const LANGE_RUNDE = {'world:technology': {items: ['invention-refrigerator', 'invention-elevator', 'invention-battery', 'invention-airplane', 'invention-light']}};
const GERAETE = [
  {name: '360 px', viewport: {width: 360, height: 640}, hasTouch: true, spiele: ['personen', 'kreuz', 'detektiv']},
  // Am Rechner mit weichem Rollen (html { scroll-behavior: smooth }): Der Test wartet, bis das Rollen fertig ist.
  {name: '1280 px', viewport: {width: 1280, height: 600}, bewegung: 'no-preference', spiele: ['personen', 'kreuz', 'detektiv']},
  {name: '320 px, große Schrift', viewport: {width: 320, height: 568}, hasTouch: true, grosseSchrift: true, sitzungen: LANGE_RUNDE, spiele: ['technik'], hoch: true},
];

// Lage des Kastens im freien Teil des Fensters (ohne feste Leisten oben und unten); im Browser ausgewertet. Der Rand des
// Kastens (scroll-margin) zählt beim Platz mit, wie in der App.
function lageImBrowser(sel) {
  const k = document.querySelector(sel);
  if (!k) return null;
  let oben = 0;
  for (const el of document.querySelectorAll('.kern-kopf, .kern-leiste')) {
    const s = getComputedStyle(el), r = el.getBoundingClientRect();
    if ((s.position === 'fixed' || s.position === 'sticky') && r.top <= 1 && r.bottom < innerHeight / 2) oben = Math.max(oben, r.bottom);
  }
  const unten = innerHeight - (parseFloat(getComputedStyle(document.documentElement).scrollPaddingBottom) || 0);
  const rand = getComputedStyle(k), luft = (parseFloat(rand.scrollMarginTop) || 0) + (parseFloat(rand.scrollMarginBottom) || 0);
  const r = k.getBoundingClientRect(), f = document.activeElement;
  const passt = r.height + luft <= unten - oben;
  const imBild = passt ? r.top >= oben - 1 && r.bottom <= unten + 1 : r.top >= oben - 1 && r.top <= oben + 40;
  return {
    titel: k.querySelector('strong')?.textContent ?? '', imBild, passt,
    kasten: [Math.round(r.top), Math.round(r.bottom)], frei: [Math.round(oben), Math.round(unten)],
    weiterHatFokus: k.contains(f) && f.classList.contains('primary-button'),
    titelHatFokus: f === k.querySelector('strong'), fokusImKasten: k.contains(f),
  };
}

async function antworte(page, antworten, text, wo) {
  const i = await antworten.evaluateAll((knoepfe, text) => knoepfe.findIndex(b => b.querySelector('span:not([class])')?.textContent === text), text);
  assert.ok(i >= 0, `${wo}: Antwort „${text}“ steht nicht unter den Knöpfen`);
  await page.evaluate(() => scrollTo({top: 0, behavior: 'instant'}));
  await antworten.nth(i).click();
}

async function spiele(page, spiel, geraet) {
  await ladeanfragen(page)();
  await bereich(page, 'games').click();
  await page.locator(`[data-game-key="${spiel.key}"]`).click();
  const antworten = page.locator('.quiz-answers .quiz-answer');
  await antworten.first().waitFor();
  const sitzungen = () => page.evaluate(key => JSON.parse(localStorage.getItem(key))?.progress.gameSessions ?? {}, SAVE_KEY);
  // Die Runde landet gleich nach dem Öffnen im Pass; der Test fragt bis zu 5 s lang nach.
  let richtig;
  for (let i = 0; i < 50 && !richtig; i++) {
    richtig = spiel.richtig(await sitzungen());
    if (!richtig) await page.waitForTimeout(100);
  }
  assert.ok(richtig, `${spiel.key}, ${geraet.name}: gespeicherte Runde nicht gefunden`);
  const texte = await antworten.evaluateAll(knoepfe => knoepfe.map(b => b.querySelector('span:not([class])')?.textContent));
  const falsch = texte.find(t => t && t !== richtig);
  let lage;
  for (const [text, istRichtig] of [[falsch, false], [richtig, true]]) {
    const wo = `${spiel.key}, ${geraet.name}, ${istRichtig ? 'richtige' : 'falsche'} Antwort`;
    await antworte(page, antworten, text, wo);
    const erwartet = !istRichtig ? 'falsch' : geraet.hoch ? 'hoch' : 'richtig';
    const fertig = await page.waitForFunction(({sel, erwartet}) => {
      const l = window.__lage(sel);
      if (!l || !l.imBild) return false;
      const fokus = erwartet === 'falsch' ? !l.fokusImKasten : erwartet === 'hoch' ? !l.passt && l.titelHatFokus : l.passt && l.weiterHatFokus;
      return fokus && l;
    }, {sel: spiel.kasten, erwartet}, {timeout: 4000}).then(h => h.jsonValue(), () => null);
    if (!fertig) assert.fail(`${wo}: Rückmeldung nicht im Bild oder Fokus falsch: ${JSON.stringify(await page.evaluate(sel => window.__lage(sel), spiel.kasten))}`);
    assert.equal(fertig.titel, istRichtig ? 'Richtig!' : 'Noch nicht ganz. Versuch es noch einmal!', wo);
    lage = fertig;
  }
  if (geraet.hoch) {
    // Mit Tab geht es von „Richtig!“ weiter zu „Erklärung vorlesen“ und dann zu „Nächste Aufgabe“. Jeder Knopf steht danach
    // samt Fokusrahmen über der unteren Leiste (imKastenSichtbar; Spieltest-Nachprüfung, Muss 1). Liegt ein Knopf weit unter
    // dem Fensterrand, holt ihn der Browser selbst ins Bild. Kaputt war der Fall dazwischen: Knopf im Fenster, aber hinter der
    // Leiste oder so knapp darüber, dass sein Rahmen dahinter liegt (Firefox, PR #118). Darum rollt der Test die Seite vor jedem
    // Tab genau so, dass der Knopf `abstand` px über der Leiste endet: an der Grenze des scroll-margin (13 und 12 px), knapp
    // darüber (6 und 0 px) und halb dahinter (−30 px). So trifft er die Grenzfälle in jedem Browser und bei jeder Schrift
    // (technik-pruefer, M1). Gegenprobe ohne den scroll-margin in imKastenSichtbar: Firefox ist beim Fall 0 px rot, Chromium
    // und WebKit rollen dort selbst (25.11.2026).
    for (const [nr, name] of [[1, /Erklärung vorlesen/u], [2, /Nächste Aufgabe/u]]) {
      for (const abstand of [13, 12, 6, 0, -30]) {
        const wo = `${spiel.key}, ${geraet.name}: Tab zu ${name.source}, ${abstand} px über der Leiste`;
        // Fokus auf den Vorgänger im Kasten (Überschrift oder Vorlesen-Knopf), dann rollen; beides ohne weiches Rollen.
        const aufbau = await page.evaluate(({sel, nr, abstand}) => {
          const k = document.querySelector(sel), reihe = [k.querySelector('strong'), ...k.querySelectorAll(':scope > button')];
          reihe[nr - 1].focus({preventScroll: true});
          const unten = innerHeight - (parseFloat(getComputedStyle(document.documentElement).scrollPaddingBottom) || 0);
          scrollTo({top: scrollY + reihe[nr].getBoundingClientRect().bottom - (unten - abstand), behavior: 'instant'});
          return {fehler: Math.round(reihe[nr].getBoundingClientRect().bottom - (unten - abstand)), vorgaenger: document.activeElement === reihe[nr - 1], ziel: reihe[nr].textContent};
        }, {sel: spiel.kasten, nr, abstand});
        assert.ok(aufbau.vorgaenger && Math.abs(aufbau.fehler) <= 1 && name.test(aufbau.ziel), `${wo}: Testaufbau stimmt nicht (${JSON.stringify(aufbau)})`);
        await page.keyboard.press('Tab');
        assert.match(await page.evaluate(() => document.activeElement?.textContent ?? ''), name, wo);
        // Der Rahmen reicht so weit über den Knopf hinaus, wie outline und outline-offset zusammen breit sind (kern.css).
        const sichtbar = await page.waitForFunction(() => {
          const unten = innerHeight - (parseFloat(getComputedStyle(document.documentElement).scrollPaddingBottom) || 0);
          const f = document.activeElement, s = getComputedStyle(f), r = f.getBoundingClientRect();
          const rahmen = (parseFloat(s.outlineWidth) || 0) + (parseFloat(s.outlineOffset) || 0);
          return rahmen > 0 && r.top - rahmen >= 0 && r.bottom + rahmen <= unten;
        }, null, {timeout: 2000}).then(() => true, () => false);
        if (!sichtbar) assert.fail(`${wo}: Fokusrahmen liegt hinter der unteren Leiste (${JSON.stringify(await page.evaluate(() => {
          const s = getComputedStyle(document.activeElement), r = document.activeElement.getBoundingClientRect();
          return {oben: r.top, unten: r.bottom, fenster: innerHeight, leiste: getComputedStyle(document.documentElement).scrollPaddingBottom, rahmen: [s.outlineWidth, s.outlineOffset]};
        }))})`);
      }
    }
  }
  return lage;
}

export async function spielFokus({browser, base, ready, monitor}) {
  for (const geraet of GERAETE) {
    const save = createSave();
    if (geraet.grosseSchrift) save.progress.settings.largeText = true;
    Object.assign(save.progress.gameSessions, geraet.sitzungen ?? {});
    const context = await browser.newContext({viewport: geraet.viewport, hasTouch: geraet.hasTouch ?? false, reducedMotion: geraet.bewegung ?? 'reduce'});
    await context.addInitScript({content: `window.__lage = ${lageImBrowser.toString()};`});
    await context.addInitScript(({key, save}) => { if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(save)); }, {key: SAVE_KEY, save});
    const page = await context.newPage();
    monitor(page);
    try {
      for (const name of geraet.spiele) {
        const spiel = SPIELE[name];
        await page.goto(base);
        await ready(page);
        const lage = await spiele(page, spiel, geraet);
        // Gemessene Lage ins Log, damit auch ein grüner Lauf zeigt, wie viel Abstand bleibt (code-pruefer, Kann 1).
        const mass = `Kasten ${lage.kasten[1] - lage.kasten[0]} px, frei ${lage.frei[1] - lage.frei[0]} px`;
        console.log(geraet.hoch
          ? `${spiel.key} (${geraet.name}): hoher Kasten beginnt oben, Fokus auf „Richtig!“, mit Tab zu „Nächste Aufgabe“, Rahmen an jeder Grenze über der Leiste (${mass})`
          : `${spiel.key} (${geraet.name}): Rückmeldung nach falscher und richtiger Antwort im Bild, „Nächste Aufgabe“ mit Fokus (${mass})`);
      }
    } finally {
      await context.close();
    }
  }
}
