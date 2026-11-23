// Teilschritt 3, Aufgaben 3 und 5: die gemeinsame Stufe auf der Wissenskarte.
// - Die Stufenwahl steht über „Rate mal!“; die Karte zeigt die Frage, die ersteFrage für diese Stufe wählt.
// - Umstellen auf der offenen Karte wechselt die Frage; die Stufe übersteht Neuladen.
// - Hat die Karte die Stufe nicht, sagt ein Satz, welche Stufe das Kind spielt (E3).
// - Vorschläge (E8): nach drei richtigen ersten Antworten „Willst du Profi probieren?“, nach zwei falschen auf Profi
//   „Willst du eine Stufe leichter spielen?“; „Nein, ich bleibe“ stellt nichts um, „Ja“ stellt um.
// Welche Frage erscheint, rechnen die Tests mit den Bausteinen aus karte-hilfen.mjs aus (wie die App).
import assert from 'node:assert/strict';
import {ready} from './harness.mjs';
import {angezeigteFrage, antwortKnopf, ersteFrageAufStufe, falscheAntworten, fragenAufStufe, fragenDerKarte, hauptfrage, karteDa, rateMal, richtigeAntwort, stufenWahl, stufeWaehlen, zeigtFrage} from './karte-hilfen.mjs';
import catalog from '../../app/world-catalog.json' with {type: 'json'};

const SAVE_KEY = 'erde-entdecken:save:v3';
const WARTEN = {timeout: 10000};
const stufeImPass = page => page.evaluate(key => JSON.parse(localStorage.getItem(key))?.progress.gameSessions['kern:stufe']?.stufe ?? null, SAVE_KEY);
const hatStufe = (t, stufe) => fragenDerKarte(t).some(f => f.level === stufe);
// Karten für die Fälle, aus den Daten gewählt (die Einstufung kann sich ändern, der Test nicht).
const MIT_PROFI = catalog.find(t => hatStufe(t, 'profi') && fragenAufStufe(t, 'entdecker').length >= 1);
const OHNE_ZUSATZ = catalog.find(t => fragenDerKarte(t).length === 1);
const DREI_LEICHTE = catalog.find(t => fragenAufStufe(t, 'entdecker').length >= 3);
const ZWEI_AUF_PROFI = catalog.find(t => hatStufe(t, 'profi') && fragenAufStufe(t, 'profi').length >= 2);

async function mitKarte(ctx, {width, height, touch = false}, id, fn) {
  const context = await ctx.browser.newContext({viewport: {width, height}, reducedMotion: 'reduce', ...(touch ? {hasTouch: true} : {}), ...(touch && ctx.engine === 'chromium' ? {isMobile: true} : {})});
  try {
    const page = await context.newPage();
    ctx.monitor(page);
    page.setDefaultTimeout(20000);
    await page.goto(new URL('#world/topic/' + id, ctx.base).href);
    await ready(page);
    await karteDa(page, id);
    return await fn(page, {touch});
  } finally {
    await context.close();
  }
}

const tippe = (knopf, touch) => (touch ? knopf.tap() : knopf.click());

// Stufenwahl über „Rate mal!“, Umstellen auf der offenen Karte, Neuladen, „Zurück zu Entdecker“.
async function stufenAufDerKarte(page, {touch}) {
  const t = MIT_PROFI;
  const wahl = stufenWahl(page);
  await wahl.locator('.stufen-zeile').filter({hasText: 'Stufe: Entdecker'}).waitFor(WARTEN);
  assert.equal(await wahl.evaluate(el => {
    const frage = document.querySelector('section.rate-mal .rate-mal-frage');
    return !!frage && !!(el.compareDocumentPosition(frage) & Node.DOCUMENT_POSITION_FOLLOWING);
  }), true, 'die Stufenwahl steht im Kopf von „Rate mal!“, über der Frage');
  await zeigtFrage(page, t, ersteFrageAufStufe(t, 'entdecker'));
  await stufeWaehlen(page, 'profi', {touch});
  const profi = await zeigtFrage(page, t, ersteFrageAufStufe(t, 'profi'));
  assert.equal(profi.level, 'profi', 'auf Profi zuerst eine neue Profi-Frage');
  assert.equal(await rateMal(page).locator('.quiz-answer').count(), profi.question.answers.length, 'alle Antworten der Frage stehen da');
  assert.equal(await stufeImPass(page), 'profi');
  await wahl.getByRole('button', {name: 'Zu schwer? Zurück zu Entdecker', exact: true}).waitFor();
  // Experte: eigene Frage oder der ehrliche Satz (E3).
  await stufeWaehlen(page, 'experte', {touch});
  if (hatStufe(t, 'experte')) await zeigtFrage(page, t, ersteFrageAufStufe(t, 'experte'));
  else await wahl.getByText('Experte gibt es hier noch nicht. Du spielst Profi.', {exact: true}).waitFor();
  await page.reload();
  await ready(page);
  await karteDa(page, t.id);
  await stufenWahl(page).locator('.stufen-zeile').filter({hasText: 'Stufe: Experte'}).waitFor(WARTEN);
  await tippe(stufenWahl(page).getByRole('button', {name: 'Zu schwer? Zurück zu Entdecker', exact: true}), touch);
  await stufenWahl(page).locator('.stufen-zeile').filter({hasText: 'Stufe: Entdecker'}).waitFor(WARTEN);
  await zeigtFrage(page, t, ersteFrageAufStufe(t, 'entdecker'));
  assert.equal(await stufeImPass(page), 'entdecker');
  return t.id;
}

// Karte nur mit der Hauptfrage, auf Profi: Hauptfrage und der Satz „Profi gibt es hier noch nicht …“.
async function profiOhneProfiFragen(page, {touch}) {
  const t = OHNE_ZUSATZ;
  await stufeWaehlen(page, 'profi', {touch});
  await stufenWahl(page).getByText('Profi gibt es hier noch nicht. Du spielst Entdecker.', {exact: true}).waitFor(WARTEN);
  await zeigtFrage(page, t, hauptfrage(t));
  return t.id;
}

// Drei richtige erste Antworten hintereinander auf Entdecker: Vorschlag Profi. „Nein, ich bleibe“ ändert nichts.
async function vorschlagSchwerer(page, {touch}, annehmen = false) {
  const t = DREI_LEICHTE;
  for (let i = 0; i < 3; i++) {
    const frage = await angezeigteFrage(page, t);
    await tippe(antwortKnopf(page, richtigeAntwort(frage)), touch);
    await rateMal(page).getByText(frage.question.why, {exact: true}).waitFor(WARTEN);
    const vorschlag = rateMal(page).locator('.stufen-vorschlag');
    if (i < 2) {
      assert.equal(await vorschlag.count(), 0, 'noch kein Vorschlag nach ' + (i + 1) + ' richtigen');
      await tippe(rateMal(page).getByRole('button', {name: 'Noch eine Frage', exact: true}), touch);
    }
  }
  const vorschlag = rateMal(page).locator('.stufen-vorschlag');
  await vorschlag.getByText('Das war leicht für dich. Willst du Profi probieren?', {exact: true}).waitFor(WARTEN);
  assert.equal(await stufeImPass(page), null, 'der Vorschlag stellt nichts von selbst um');
  if (annehmen) {
    await tippe(vorschlag.getByRole('button', {name: 'Ja, Profi probieren', exact: true}), touch);
    await stufenWahl(page).locator('.stufen-zeile').filter({hasText: 'Stufe: Profi'}).waitFor(WARTEN);
    assert.equal(await stufeImPass(page), 'profi');
  } else {
    await tippe(vorschlag.getByRole('button', {name: 'Nein, ich bleibe', exact: true}), touch);
    await vorschlag.waitFor({state: 'detached'});
    assert.equal(await stufeImPass(page), null, '„Nein, ich bleibe“ stellt nichts um');
    await stufenWahl(page).locator('.stufen-zeile').filter({hasText: 'Stufe: Entdecker'}).waitFor();
  }
  return t.id;
}

// Zwei falsche erste Antworten hintereinander auf Profi: Vorschlag „eine Stufe leichter“.
async function vorschlagLeichter(page, {touch}) {
  const t = ZWEI_AUF_PROFI;
  await stufeWaehlen(page, 'profi', {touch});
  for (let i = 0; i < 2; i++) {
    const frage = await angezeigteFrage(page, t);
    await tippe(antwortKnopf(page, falscheAntworten(frage)[0]), touch);
    await rateMal(page).getByText('Noch nicht ganz. Versuch es noch einmal!', {exact: true}).waitFor(WARTEN);
    if (i === 0) {
      // Erst richtig (zählt nicht mehr), dann weiter zur nächsten Frage der Stufe.
      await tippe(antwortKnopf(page, richtigeAntwort(frage)), touch);
      await tippe(rateMal(page).getByRole('button', {name: 'Noch eine Frage', exact: true}), touch);
    }
  }
  const vorschlag = rateMal(page).locator('.stufen-vorschlag');
  await vorschlag.getByText('Ganz schön knifflig. Willst du eine Stufe leichter spielen?', {exact: true}).waitFor(WARTEN);
  await tippe(vorschlag.getByRole('button', {name: 'Ja, leichter spielen', exact: true}), touch);
  await stufenWahl(page).locator('.stufen-zeile').filter({hasText: 'Stufe: Entdecker'}).waitFor(WARTEN);
  assert.equal(await stufeImPass(page), 'entdecker');
  return t.id;
}

// „Fast richtig“ (E11): Auf Experte nach „Stimmt nicht“ zuerst das falsche Wort wählen, die Erklärung kommt danach.
const MIT_FAST = catalog.find(t => t.claims?.[0]?.fastRichtig);
async function fastRichtig(page, {touch}) {
  const t = MIT_FAST, b = t.claims[0], f = b.fastRichtig;
  const bereich = page.locator('section.stimmt-das');
  const erklaerung = bereich.getByText(b.explanation, {exact: true});
  await stufeWaehlen(page, 'experte', {touch});
  await tippe(bereich.getByRole('button', {name: 'Stimmt nicht', exact: true}), touch);
  await bereich.getByText('Welches Wort ist falsch?').waitFor(WARTEN);
  assert.equal(await erklaerung.count(), 0, 'die Erklärung verrät das Wort nicht vorher');
  const falsch = f.woerter.find(w => w !== f.wort);
  await tippe(bereich.locator('.stimmt-das-woerter').getByRole('button', {name: falsch, exact: true}), touch);
  await bereich.getByText('Noch nicht ganz. Versuch es noch einmal!', {exact: true}).waitFor(WARTEN);
  await tippe(bereich.locator('.stimmt-das-woerter').getByRole('button', {name: f.wort, exact: true}), touch);
  await bereich.getByText('Richtig wäre „' + f.ersatz + '“.', {exact: false}).waitFor(WARTEN);
  await erklaerung.waitFor(WARTEN);
  await page.reload();
  await ready(page);
  await karteDa(page, t.id);
  await page.locator('section.stimmt-das').getByText(b.explanation, {exact: true}).waitFor(WARTEN);
  return t.id;
}
// Auf Entdecker bleibt „Stimmt das?“ wie bisher: Die Erklärung kommt sofort, ohne Wortfrage.
async function fastRichtigNurExperte(page, {touch}) {
  const b = MIT_FAST.claims[0];
  const bereich = page.locator('section.stimmt-das');
  await tippe(bereich.getByRole('button', {name: 'Stimmt nicht', exact: true}), touch);
  await bereich.getByText(b.explanation, {exact: true}).waitFor(WARTEN);
  assert.equal(await bereich.getByText('Welches Wort ist falsch?').count(), 0);
  return MIT_FAST.id;
}
// „Ordne richtig“ (E11): erst ab seiner Stufe; ordnen mit „nach oben“, „Prüfen“, übersteht Neuladen.
const MIT_ORDNEN = catalog.find(t => t.ordnen);
async function ordneRichtig(page, {touch}) {
  const t = MIT_ORDNEN, o = t.ordnen;
  const bereich = page.locator('section.ordne-richtig');
  assert.equal(await bereich.count(), 0, '„Ordne richtig“ fehlt unter der Stufe ' + o.level);
  await stufeWaehlen(page, o.level, {touch});
  await bereich.waitFor(WARTEN);
  const reihe = () => bereich.locator('.ordne-richtig-text').allInnerTexts();
  assert.notDeepEqual(await reihe(), o.teile, 'die Teile stehen am Anfang nicht schon richtig');
  for (let ziel = 0; ziel < o.teile.length; ziel++) {
    for (let jetzt = (await reihe()).indexOf(o.teile[ziel]); jetzt > ziel; jetzt--) {
      await tippe(bereich.getByRole('button', {name: '„' + o.teile[ziel] + '“ nach oben', exact: true}), touch);
    }
  }
  assert.deepEqual(await reihe(), o.teile);
  await tippe(bereich.getByRole('button', {name: 'Prüfen', exact: true}), touch);
  await bereich.getByText(o.aufloesung, {exact: true}).waitFor(WARTEN);
  await page.reload();
  await ready(page);
  await karteDa(page, t.id);
  await page.locator('section.ordne-richtig').getByText(o.aufloesung, {exact: true}).waitFor(WARTEN);
  return t.id;
}

export async function karteStufen(ctx) {
  for (const [name, karte] of [['MIT_PROFI', MIT_PROFI], ['OHNE_ZUSATZ', OHNE_ZUSATZ], ['DREI_LEICHTE', DREI_LEICHTE], ['ZWEI_AUF_PROFI', ZWEI_AUF_PROFI]]) assert.ok(karte, 'Testvoraussetzung: eine Karte für ' + name);
  const handy = {width: 390, height: 844, touch: true}, breit = {width: 1440, height: 900};
  const a = await mitKarte(ctx, handy, MIT_PROFI.id, stufenAufDerKarte);
  await mitKarte(ctx, breit, MIT_PROFI.id, stufenAufDerKarte);
  const b = await mitKarte(ctx, handy, OHNE_ZUSATZ.id, profiOhneProfiFragen);
  const c = await mitKarte(ctx, handy, DREI_LEICHTE.id, page => vorschlagSchwerer(page, {touch: true}));
  await mitKarte(ctx, breit, DREI_LEICHTE.id, page => vorschlagSchwerer(page, {touch: false}, true));
  const d = await mitKarte(ctx, handy, ZWEI_AUF_PROFI.id, vorschlagLeichter);
  assert.ok(MIT_FAST && MIT_ORDNEN, 'Testvoraussetzung: eine Karte mit „Fast richtig“ und eine mit „Ordne richtig“');
  const e = await mitKarte(ctx, handy, MIT_FAST.id, fastRichtig);
  await mitKarte(ctx, breit, MIT_FAST.id, fastRichtigNurExperte);
  const f = await mitKarte(ctx, handy, MIT_ORDNEN.id, ordneRichtig);
  await mitKarte(ctx, breit, MIT_ORDNEN.id, ordneRichtig);
  ctx.report.checks.push(`Stufen auf der Karte: Wahl über „Rate mal!“, Umstellen wechselt die Frage, übersteht Neuladen, „Zurück zu Entdecker“ (${a}); `
    + `Profi ohne Profi-Fragen sagt „Du spielst Entdecker“ (${b}); Vorschlag nach drei richtigen, „Nein, ich bleibe“ und „Ja“ (${c}); Vorschlag leichter nach zwei falschen auf Profi (${d}); „Fast richtig“ nur auf Experte, Erklärung erst nach dem Wort (${e}); „Ordne richtig“ ab seiner Stufe, ordnen, prüfen, Neuladen (${f})`);
}
