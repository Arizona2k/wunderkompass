// Teilschritt 3, Aufgaben 3 und 5: die gemeinsame Stufe auf der Wissenskarte.
// - Die Stufenwahl steht über „Rate mal!“; die Karte zeigt die Frage, die ersteFrage für diese Stufe wählt.
// - Umstellen auf der offenen Karte wechselt die Frage; die Stufe übersteht Neuladen.
// - Hat die Karte die Stufe nicht, sagt ein Satz, welche Stufe das Kind spielt (E3).
// - Vorschläge (E8): nach drei richtigen ersten Antworten „Willst du Profi probieren?“, nach zwei falschen auf Profi
//   „Willst du eine Stufe leichter spielen?“; „Nein, ich bleibe“ stellt nichts um, „Ja“ stellt um.
// - Stufen-Feinschliff aus dem ersten Spieltest (24.11.2026, BACKLOG Phase 1, Punkt 12): Nach dem Wechsel kommt eine Frage
//   der neuen Stufe (a), „Zurück zu Entdecker“ fehlt, wo die Karte ohnehin Entdecker spielt (b), und nach den Fragen der
//   Stufe steht ein klarer Schluss mit dem Weg zur nächsten Karte (c, d).
// Welche Frage erscheint, rechnen die Tests mit den Bausteinen aus karte-hilfen.mjs aus (wie die App).
import assert from 'node:assert/strict';
import {FOKUS_NACH_KLICK, ladeanfragen, ready} from './harness.mjs';
import {angezeigteFrage, antwortKnopf, ersteFrageAufStufe, ersteNachbarkarte, falscheAntworten, fragenAufStufe, fragenDerKarte, hauptfrage, karteDa, rateMal, richtigeAntwort, stufenWahl, stufeWaehlen, zeigtFrage} from './karte-hilfen.mjs';
import catalog from '../../app/world-catalog.json' with {type: 'json'};
await import('../../scripts/test-runtime.mjs');
const {createSave, emptyProgress} = await import('../../app/progress-storage.ts');

const SAVE_KEY = 'erde-entdecken:save:v3';
const WARTEN = {timeout: 10000};
const stufeImPass = page => page.evaluate(key => JSON.parse(localStorage.getItem(key))?.progress.gameSessions['kern:stufe']?.stufe ?? null, SAVE_KEY);
const passLesen = page => page.evaluate(key => JSON.parse(localStorage.getItem(key)).progress, SAVE_KEY);
const ZURUECK = 'Zu schwer? Zurück zu Entdecker';
const SCHLUSS_PROFI = 'Geschafft! Mehr Profi-Fragen hat diese Karte nicht.';
const NOCH_NICHT = 'Noch nicht ganz. Versuch es noch einmal!';
const hatStufe = (t, stufe) => fragenDerKarte(t).some(f => f.level === stufe);
// Karten für die Fälle, aus den Daten gewählt (die Einstufung kann sich ändern, der Test nicht).
const MIT_PROFI = catalog.find(t => hatStufe(t, 'profi') && fragenAufStufe(t, 'entdecker').length >= 1);
const OHNE_ZUSATZ = catalog.find(t => fragenDerKarte(t).length === 1);
const DREI_LEICHTE = catalog.find(t => fragenAufStufe(t, 'entdecker').length >= 3);
// Für die Vorschläge zählen nur Fragen genau der gewählten Stufe (Code-Prüfung Teil A, Befund 1): zwei echte Profi-Fragen.
const ZWEI_AUF_PROFI = catalog.find(t => fragenDerKarte(t).filter(f => f.level === 'profi').length >= 2);
// Für den Schluss: mindestens zwei Profi-Fragen und eine erklärte Nachbarkarte.
const SCHLUSS_AUF_PROFI = catalog.find(t => fragenAufStufe(t, 'profi').length >= 2 && hatStufe(t, 'profi') && ersteNachbarkarte(t.id));

// pass: ein ausgedachter Pass, nur beim ersten Laden abgelegt (danach gilt, was die App speichert).
async function mitKarte(ctx, {width, height, touch = false}, id, fn, pass) {
  const context = await ctx.browser.newContext({viewport: {width, height}, reducedMotion: 'reduce', ...(touch ? {hasTouch: true} : {}), ...(touch && ctx.engine === 'chromium' ? {isMobile: true} : {})});
  try {
    await context.addInitScript(FOKUS_NACH_KLICK);
    if (pass) await context.addInitScript(({key, save}) => { if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(save)); }, {key: SAVE_KEY, save: pass});
    const page = await context.newPage();
    ctx.monitor(page);
    // Vor jedem gewollten Neuladen warten, bis die Ladeanfragen fertig sind (harness.mjs, ladeanfragen).
    const anfragenFertig = ladeanfragen(page);
    page.setDefaultTimeout(20000);
    await page.goto(new URL('#world/topic/' + id, ctx.base).href);
    await ready(page);
    await karteDa(page, id);
    return await fn(page, {touch, anfragenFertig});
  } finally {
    await context.close();
  }
}

const tippe = (knopf, touch) => (touch ? knopf.tap() : knopf.click());
// Nach einem Stufenwechsel baut die Karte „Rate mal!“ oft neu auf. Der Fokus muss trotzdem auf der Karte bleiben,
// nicht auf <body> fallen (Code-Prüfung Teil A, Befund 2). Die Seite setzt ihn noch im Klick. Darum zählt, wo er am Ende
// des letzten Klicks lag (FOKUS_NACH_KLICK), und wo er jetzt liegt. Ein Warten verdeckte, wenn er erst im nächsten Bild
// kommt und so lange auf <body> liegt (CI WebKit 24.11.2026); ein schneller Rechner verdeckte es auch ohne Warten
// (Code-Prüfung flushSync, Befund 1).
const AENDERN = '.wissenskarte .stufen-wahl .stufen-aendern';
async function fokusAuf(page, selektor, was) {
  const fokus = await page.evaluate(sel => {
    const wo = el => el ? el.tagName + ' ' + el.className + (el.isConnected ? '' : ' (nicht mehr auf der Seite)') : 'nichts';
    const klick = window.__fokusNachKlick;
    return {klick: !!klick?.isConnected && klick.matches(sel), woKlick: wo(klick), jetzt: !!document.activeElement?.matches(sel), woJetzt: wo(document.activeElement)};
  }, selektor);
  assert.ok(fokus.klick, was + ' (am Ende des Klicks); der Fokus lag auf ' + fokus.woKlick);
  assert.ok(fokus.jetzt, was + '; der Fokus liegt auf ' + fokus.woJetzt);
}

// Stufenwahl über „Rate mal!“, Umstellen auf der offenen Karte, Neuladen, „Zurück zu Entdecker“.
async function stufenAufDerKarte(page, {touch, anfragenFertig}) {
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
  await fokusAuf(page, AENDERN, 'nach dem Umstellen (neue Frage) steht der Fokus auf „Ändern“');
  assert.equal(profi.level, 'profi', 'auf Profi zuerst eine neue Profi-Frage');
  assert.equal(await rateMal(page).locator('.quiz-answer').count(), profi.question.answers.length, 'alle Antworten der Frage stehen da');
  assert.equal(await stufeImPass(page), 'profi');
  await wahl.getByRole('button', {name: ZURUECK, exact: true}).waitFor();
  // Experte: eigene Frage oder der ehrliche Satz (E3).
  await stufeWaehlen(page, 'experte', {touch});
  if (hatStufe(t, 'experte')) await zeigtFrage(page, t, ersteFrageAufStufe(t, 'experte'));
  else await wahl.getByText('Experte gibt es hier noch nicht. Du spielst Profi.', {exact: true}).waitFor();
  await fokusAuf(page, AENDERN, 'nach dem Umstellen auf Experte steht der Fokus auf „Ändern“');
  await anfragenFertig();
  await page.reload();
  await ready(page);
  await karteDa(page, t.id);
  await stufenWahl(page).locator('.stufen-zeile').filter({hasText: 'Stufe: Experte'}).waitFor(WARTEN);
  await tippe(stufenWahl(page).getByRole('button', {name: ZURUECK, exact: true}), touch);
  await stufenWahl(page).locator('.stufen-zeile').filter({hasText: 'Stufe: Entdecker'}).waitFor(WARTEN);
  await zeigtFrage(page, t, ersteFrageAufStufe(t, 'entdecker'));
  await fokusAuf(page, AENDERN, 'nach „Zurück zu Entdecker“ steht der Fokus auf „Ändern“');
  assert.equal(await stufeImPass(page), 'entdecker');
  return t.id;
}

// Karte nur mit der Hauptfrage, auf Profi: Hauptfrage und der Satz „Profi gibt es hier noch nicht …“.
async function profiOhneProfiFragen(page, {touch}) {
  const t = OHNE_ZUSATZ;
  await stufeWaehlen(page, 'profi', {touch});
  await stufenWahl(page).getByText('Profi gibt es hier noch nicht. Du spielst Entdecker.', {exact: true}).waitFor(WARTEN);
  await zeigtFrage(page, t, hauptfrage(t));
  // Die Frage bleibt, „Rate mal!“ baut nicht neu auf; der Fokus bleibt auf „Ändern“ (Code-Prüfung flushSync, Befund 3).
  await fokusAuf(page, AENDERN, 'auf Profi ohne Profi-Fragen bleibt der Fokus auf „Ändern“');
  // Fehler (b): Die Karte spielt ohnehin Entdecker, also kein „Zurück zu Entdecker“ (Spieltest 24.11.2026, Befund 2).
  assert.equal(await stufenWahl(page).getByRole('button', {name: ZURUECK, exact: true}).count(), 0, 'auf Profi ohne Profi-Fragen kein „Zurück zu Entdecker“');
  await stufeWaehlen(page, 'experte', {touch});
  await stufenWahl(page).getByText('Experte gibt es hier noch nicht. Du spielst Entdecker.', {exact: true}).waitFor(WARTEN);
  assert.equal(await stufenWahl(page).getByRole('button', {name: ZURUECK, exact: true}).count(), 0, 'auf Experte ohne Profi- und Experten-Fragen kein „Zurück zu Entdecker“');
  return t.id;
}

// Fehler (a): Entdecker-Frage falsch beantworten, dann auf Profi wechseln. Die Karte zeigt eine Profi-Frage, nicht die
// alte Entdecker-Frage (Spieltest 24.11.2026, Befund 1). Auch wer später wiederkommt (Neuladen), bekommt auf Profi eine
// Profi-Frage: Die falsche Entdecker-Frage wartet, bis das Kind wieder Entdecker spielt; dort kommt sie zuerst
// (Spieltest Feinschliff 24.11.2026; entschieden vom Nutzer am 24.11.2026). Ausnahme: „Noch einmal nachdenken“ im
// Wissensbuch zeigt genau diese Frage, auch auf Profi. Am Handy ist der Weltbereich dabei schon geladen, breit wird er
// nach einem Neuladen im Wissensbuch zum ersten Mal geöffnet.
async function wechselNachFalscherAntwort(page, {touch, anfragenFertig}) {
  const t = MIT_PROFI;
  const haupt = await zeigtFrage(page, t, ersteFrageAufStufe(t, 'entdecker'));
  await tippe(antwortKnopf(page, falscheAntworten(haupt)[0]), touch);
  await rateMal(page).getByText(NOCH_NICHT, {exact: true}).waitFor(WARTEN);
  // Die falsche Antwort bleibt orange, auch wenn der Finger oder die Maus noch darauf ist. Vorher färbte die Regel für
  // „Maus darüber“ sie grünlich wie eine richtige (Spieltest 24.11.2026, Befunde 6 und 7; am Handy bleibt :hover nach dem Tippen).
  const falschKnopf = antwortKnopf(page, falscheAntworten(haupt)[0]);
  // Testvoraussetzung: Zeiger auf der falschen Antwort. Ausdrücklich darüberfahren: Ob ein Browser nach einem Tippen :hover setzt,
  // unterscheidet sich (Chromium ja, Firefox und WebKit nicht belegt; Code-Nachprüfung Feinschliff, W1).
  await falschKnopf.hover();
  await page.waitForFunction(() => document.querySelector('section.rate-mal .quiz-answer.is-incorrect')?.matches(':hover'), null, {timeout: 5000});
  assert.equal(await falschKnopf.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(255, 243, 228)', 'die falsche Antwort ist orange hinterlegt, nicht grün');
  await page.waitForFunction(([key, id]) => JSON.parse(localStorage.getItem(key)).progress.review[id]?.correct === false, [SAVE_KEY, haupt.reviewId], WARTEN);
  const pass = await passLesen(page);
  const stand = pass.gameSessions['topic:' + t.id];
  assert.equal(stand?.[haupt.answerKey], falscheAntworten(haupt)[0], 'Testvoraussetzung: die falsche Antwort steht im Pass');
  await stufeWaehlen(page, 'profi', {touch});
  const frage = await zeigtFrage(page, t, ersteFrageAufStufe(t, 'profi', pass.review, stand));
  assert.equal(frage.level, 'profi', 'nach dem Wechsel auf Profi eine Profi-Frage');
  await fokusAuf(page, AENDERN, 'nach dem Wechsel (neue Frage) steht der Fokus auf „Ändern“');
  // Später wiederkommen: Neuladen auf Profi. Weiter eine Profi-Frage, ohne „Noch nicht ganz“ der alten Entdecker-Frage.
  await anfragenFertig();
  await page.reload();
  await ready(page);
  await karteDa(page, t.id);
  await stufenWahl(page).locator('.stufen-zeile').filter({hasText: 'Stufe: Profi'}).waitFor(WARTEN);
  const nachher = await passLesen(page);
  const wieder = await zeigtFrage(page, t, ersteFrageAufStufe(t, 'profi', nachher.review, nachher.gameSessions['topic:' + t.id]));
  assert.equal(wieder.level, 'profi', 'nach dem Neuladen auf Profi eine Profi-Frage, nicht die falsch beantwortete Entdecker-Frage');
  assert.equal(await rateMal(page).getByText(NOCH_NICHT, {exact: true}).count(), 0, 'nach dem Neuladen auf Profi kein „Noch nicht ganz“');
  // Zurück auf Entdecker: Dort wartet die falsch beantwortete Frage, mit „Noch nicht ganz“.
  await tippe(stufenWahl(page).getByRole('button', {name: ZURUECK, exact: true}), touch);
  await stufenWahl(page).locator('.stufen-zeile').filter({hasText: 'Stufe: Entdecker'}).waitFor(WARTEN);
  await zeigtFrage(page, t, haupt);
  await rateMal(page).getByText(NOCH_NICHT, {exact: true}).waitFor(WARTEN);
  // Wieder Profi, dann über das Wissensbuch: „Noch einmal nachdenken“ zeigt die wartende Entdecker-Frage.
  await stufeWaehlen(page, 'profi', {touch});
  assert.equal((await angezeigteFrage(page, t)).level, 'profi', 'wieder auf Profi eine Profi-Frage');
  await page.evaluate(() => { location.hash = 'book/notes'; });
  if (!touch) {
    await anfragenFertig();
    await page.reload();
    await ready(page);
  }
  const eintrag = page.locator('.knowledge-book article', {has: page.getByRole('heading', {name: t.title, exact: true})});
  await tippe(eintrag.getByRole('button', {name: 'Noch einmal nachdenken', exact: true}), touch);
  await page.waitForFunction(x => document.getElementById('world-topic-title')?.getAttribute('aria-label') === x, t.title, WARTEN);
  await stufenWahl(page).locator('.stufen-zeile').filter({hasText: 'Stufe: Profi'}).waitFor(WARTEN);
  await zeigtFrage(page, t, haupt);
  await rateMal(page).getByText(NOCH_NICHT, {exact: true}).waitFor(WARTEN);
  // Der Merker gilt nur für dieses Öffnen; Neuladen und Zurück wählen danach wieder wie beim Öffnen (Code-Prüfung „Nachdenken“, H3).
  assert.equal(await page.evaluate(() => history.state?.wunderNachdenken), undefined, 'nach dem Öffnen ist der Merker gelöscht');
  // Richtig beantworten: Danach bleibt „Noch eine Frage“ in der Stufe Profi.
  await tippe(antwortKnopf(page, richtigeAntwort(haupt)), touch);
  await rateMal(page).getByText(haupt.question.why, {exact: true}).waitFor(WARTEN);
  await tippe(rateMal(page).getByRole('button', {name: 'Noch eine Frage', exact: true}), touch);
  await page.waitForFunction(id => document.querySelector('section.rate-mal')?.getAttribute('aria-labelledby') !== 'rate-mal-' + id, haupt.id, WARTEN);
  assert.equal((await angezeigteFrage(page, t)).level, 'profi', 'nach dem Nachdenken weiter mit einer Profi-Frage');
  return t.id;
}

// Ein ausgedachter Pass: Hauptfrage richtig beantwortet, aber wieder fällig; Stufe Profi.
function passMitFaelligerHauptfrage(t) {
  const haupt = hauptfrage(t);
  const progress = emptyProgress();
  progress.review = {[haupt.reviewId]: {correct: true, seen: 1, due: '2000-01-01'}};
  progress.gameSessions = {'kern:stufe': {stufe: 'profi', seit: '2026-11-23'}, ['topic:' + t.id]: {[haupt.answerKey]: richtigeAntwort(haupt)}};
  return createSave(progress);
}

// Code-Prüfung „Nachdenken“, W1: Ist die Hauptfrage nur wieder fällig, zeigt „Noch einmal nachdenken“ sie ohne die alte
// Lösung, auch auf Profi; die gespeicherte Antwort bleibt im Pass. Wer sie wieder richtig beantwortet, ist fertig: Der
// Eintrag im Wissensbuch verschwindet.
async function faelligNachdenken(page, {touch}) {
  const t = MIT_PROFI;
  const haupt = hauptfrage(t);
  await page.evaluate(() => { location.hash = 'book/notes'; });
  const eintrag = page.locator('.knowledge-book article', {has: page.getByRole('heading', {name: t.title, exact: true})});
  await tippe(eintrag.getByRole('button', {name: 'Noch einmal nachdenken', exact: true}), touch);
  await page.waitForFunction(x => document.getElementById('world-topic-title')?.getAttribute('aria-label') === x, t.title, WARTEN);
  await stufenWahl(page).locator('.stufen-zeile').filter({hasText: 'Stufe: Profi'}).waitFor(WARTEN);
  await zeigtFrage(page, t, haupt);
  assert.equal(await rateMal(page).getByText(haupt.question.why, {exact: true}).count(), 0, 'beim Nachdenken über eine fällige Frage steht nicht sofort die Lösung da');
  assert.equal(await antwortKnopf(page, richtigeAntwort(haupt)).isEnabled(), true, 'die Antworten sind wählbar');
  assert.equal((await passLesen(page)).gameSessions['topic:' + t.id]?.[haupt.answerKey], richtigeAntwort(haupt), 'die gespeicherte Antwort bleibt im Pass');
  await tippe(antwortKnopf(page, richtigeAntwort(haupt)), touch);
  await rateMal(page).getByText(haupt.question.why, {exact: true}).waitFor(WARTEN);
  const heute = new Date().toISOString().slice(0, 10);
  await page.waitForFunction(([key, id, tag]) => JSON.parse(localStorage.getItem(key)).progress.review[id]?.due > tag, [SAVE_KEY, haupt.reviewId, heute], WARTEN);
  await page.evaluate(() => { location.hash = 'book/notes'; });
  await page.locator('.knowledge-book').waitFor({state: 'visible', ...WARTEN});
  await eintrag.waitFor({state: 'detached', ...WARTEN});
  return t.id;
}

// (c, d): Auf Profi zeigt „Noch eine Frage“ jede Profi-Frage einmal und keine leichtere; danach steht der Schluss mit
// „Weiter zu: <Titel>“, und der Knopf führt zur ersten erklärten Nachbarkarte.
async function schlussNachDerStufe(page, {touch}) {
  const t = SCHLUSS_AUF_PROFI;
  const runde = fragenAufStufe(t, 'profi');
  await stufeWaehlen(page, 'profi', {touch});
  const gezeigt = [];
  for (let i = 0; i < runde.length; i++) {
    const frage = await angezeigteFrage(page, t);
    assert.equal(frage.level, 'profi', 'auf Profi nur Profi-Fragen, auch nach „Noch eine Frage“: ' + frage.id);
    assert.ok(!gezeigt.includes(frage.id), 'jede Frage nur einmal je Runde: ' + frage.id);
    gezeigt.push(frage.id);
    await tippe(antwortKnopf(page, richtigeAntwort(frage)), touch);
    await rateMal(page).getByText(frage.question.why, {exact: true}).waitFor(WARTEN);
    if (i < runde.length - 1) {
      assert.equal(await rateMal(page).getByText(SCHLUSS_PROFI, {exact: true}).count(), 0, 'noch kein Schluss nach ' + (i + 1) + ' Fragen');
      await tippe(rateMal(page).getByRole('button', {name: 'Noch eine Frage', exact: true}), touch);
      await page.waitForFunction(id => document.querySelector('section.rate-mal')?.getAttribute('aria-labelledby') !== 'rate-mal-' + id, frage.id, WARTEN);
    }
  }
  await rateMal(page).getByText(SCHLUSS_PROFI, {exact: true}).waitFor(WARTEN);
  assert.equal(await rateMal(page).getByRole('button', {name: 'Noch eine Frage', exact: true}).count(), 0, 'nach der letzten Profi-Frage kein „Noch eine Frage“');
  await rateMal(page).getByRole('button', {name: 'Noch einmal raten', exact: true}).waitFor();
  const ziel = ersteNachbarkarte(t.id);
  const knopf = rateMal(page).locator('.rate-mal-naechste-karte');
  const aufschrift = (await knopf.innerText()).replace(/\u00ad/g, '').replace(/\s+/g, ' ').trim();
  assert.equal(aufschrift, 'Weiter zu: ' + catalog.find(k => k.id === ziel).title, 'der Knopf sagt, wohin er führt');
  // Am Handy ragt der Knopf nicht über den Rand (lange Titel brechen um).
  const rand = await knopf.evaluate(el => ({rechts: el.getBoundingClientRect().right, breite: document.documentElement.clientWidth}));
  assert.ok(rand.rechts <= rand.breite + 0.5, 'der Knopf „Weiter zu“ passt in die Breite: ' + JSON.stringify(rand));
  await tippe(knopf, touch);
  await page.waitForFunction(id => decodeURIComponent(location.hash) === '#world/topic/' + id, ziel, WARTEN);
  await karteDa(page, ziel);
  // „← Zurück“: Die Karte wählt neu (der Knopf ist dann nicht mehr da); der Fokus liegt wieder auf „Rate mal!“, sichtbar
  // im Fenster, nicht auf dem Titel oben (Code-Prüfung Feinschliff, Befund 1).
  await tippe(page.locator('nav.karten-rueckweg').getByRole('link', {name: 'Zurück', exact: true}), touch);
  await karteDa(page, t.id);
  await page.waitForFunction(() => document.activeElement?.matches('section.rate-mal'), null, WARTEN);
  // Die Karte wählt neu, aber in der Stufe: Nach allen Profi-Fragen kam vorher die leichte Entdecker-Frage (Spieltest Feinschliff).
  assert.equal((await angezeigteFrage(page, t)).level, 'profi', 'nach „Zurück“ eine Profi-Frage');
  const lage = await rateMal(page).evaluate(el => { const r = el.getBoundingClientRect(); return {oben: r.top, unten: r.bottom, hoehe: innerHeight}; });
  assert.ok(lage.unten > 0 && lage.oben < lage.hoehe, 'nach „Zurück“ ist „Rate mal!“ im Fenster: ' + JSON.stringify(lage));
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
  // Der Vorschlag steht in der Rückmeldung vor den Knöpfen („Noch eine Frage“ oder, nach der letzten Frage der Stufe,
  // „Weiter zu“), nach einem Schluss-Satz; darunter übersahen ihn Kinder (Design-Prüfung Teil A, Befund 2).
  assert.equal(await rateMal(page).getByRole('status').locator('.stufen-vorschlag').count(), 1, 'der Vorschlag steht in der Rückmeldung');
  assert.equal(await rateMal(page).evaluate(bereich => {
    const hinweis = bereich.querySelector('.stufen-vorschlag');
    const weiter = bereich.querySelector('.rate-mal-weiter');
    const schluss = bereich.querySelector('.rate-mal-schluss');
    const davor = (a, b) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    return Boolean(hinweis && weiter && davor(hinweis, weiter) && (!schluss || davor(schluss, hinweis)));
  }), true, 'der Vorschlag steht nach einem Schluss-Satz und vor den Knöpfen');
  // Danach je nach Zahl der Entdecker-Fragen ausdrücklich „Noch eine Frage“ oder der Schluss (Code-Prüfung Feinschliff, Befund 6).
  if (fragenAufStufe(t, 'entdecker').length > 3) await rateMal(page).getByRole('button', {name: 'Noch eine Frage', exact: true}).waitFor();
  else {
    await rateMal(page).getByText('Geschafft! Mehr Entdecker-Fragen hat diese Karte nicht.', {exact: true}).waitFor();
    assert.equal(await rateMal(page).getByRole('button', {name: 'Noch eine Frage', exact: true}).count(), 0, 'nach der letzten Entdecker-Frage kein „Noch eine Frage“');
  }
  assert.equal(await stufeImPass(page), null, 'der Vorschlag stellt nichts von selbst um');
  if (annehmen) {
    await tippe(vorschlag.getByRole('button', {name: 'Ja, Profi probieren', exact: true}), touch);
    await stufenWahl(page).locator('.stufen-zeile').filter({hasText: 'Stufe: Profi'}).waitFor(WARTEN);
    await fokusAuf(page, AENDERN, 'nach „Ja, Profi probieren“ steht der Fokus auf „Ändern“');
    assert.equal(await stufeImPass(page), 'profi');
  } else {
    await tippe(vorschlag.getByRole('button', {name: 'Nein, ich bleibe', exact: true}), touch);
    await vorschlag.waitFor({state: 'detached'});
    await fokusAuf(page, '.wissenskarte section.rate-mal', 'nach „Nein, ich bleibe“ steht der Fokus auf „Rate mal!“');
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
    assert.equal(frage.level, 'profi', 'Profi zeigt zuerst seine eigenen Fragen');
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
  assert.equal(await rateMal(page).getByRole('status').locator('.stufen-vorschlag').count(), 1, 'der Vorschlag steht in der Rückmeldung zu „Noch nicht ganz“');
  await tippe(vorschlag.getByRole('button', {name: 'Ja, leichter spielen', exact: true}), touch);
  await stufenWahl(page).locator('.stufen-zeile').filter({hasText: 'Stufe: Entdecker'}).waitFor(WARTEN);
  await fokusAuf(page, AENDERN, 'nach „Ja, leichter spielen“ steht der Fokus auf „Ändern“');
  assert.equal(await stufeImPass(page), 'entdecker');
  return t.id;
}

// „Fast richtig“ (E11): Auf Experte nach „Stimmt nicht“ zuerst das falsche Wort wählen, die Erklärung kommt danach.
const MIT_FAST = catalog.find(t => t.claims?.[0]?.fastRichtig);
async function fastRichtig(page, {touch, anfragenFertig}) {
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
  await anfragenFertig();
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
async function ordneRichtig(page, {touch, anfragenFertig}) {
  const t = MIT_ORDNEN, o = t.ordnen;
  const bereich = page.locator('section.ordne-richtig');
  assert.equal(await bereich.count(), 0, '„Ordne richtig“ fehlt unter der Stufe ' + o.level);
  await stufeWaehlen(page, o.level, {touch});
  await bereich.waitFor(WARTEN);
  const reihe = () => bereich.locator('.ordne-richtig-text').allInnerTexts();
  assert.notDeepEqual(await reihe(), o.teile, 'die Teile stehen am Anfang nicht schon richtig');
  // Einmal nach unten: Dabei verschiebt React genau das fokussierte Teil im DOM, und der Browser nimmt ihm den Fokus.
  // Der Fokus kommt trotzdem zurück, und der neue Platz wird angesagt (Code-Nachprüfung Teil A, N2).
  assert.ok(o.teile.length > 2, 'Testvoraussetzung: Platz 2 ist nicht der letzte');
  const erstes = (await reihe())[0];
  await tippe(bereich.getByRole('button', {name: '„' + erstes + '“ nach unten', exact: true}), touch);
  await bereich.locator('[aria-live="polite"]').getByText('„' + erstes + '“ steht jetzt an Platz 2.', {exact: true}).waitFor({state: 'attached', ...WARTEN});
  await page.waitForFunction(n => document.activeElement?.getAttribute('aria-label') === n, '„' + erstes + '“ nach unten', WARTEN);
  for (let ziel = 0; ziel < o.teile.length; ziel++) {
    for (let jetzt = (await reihe()).indexOf(o.teile[ziel]); jetzt > ziel; jetzt--) {
      await tippe(bereich.getByRole('button', {name: '„' + o.teile[ziel] + '“ nach oben', exact: true}), touch);
      // Der neue Platz wird angesagt, und der Fokus bleibt beim verschobenen Teil (Code-Prüfung Teil A, Befund 8).
      await bereich.locator('[aria-live="polite"]').getByText('„' + o.teile[ziel] + '“ steht jetzt an Platz ' + jetzt + '.', {exact: true}).waitFor({state: 'attached', ...WARTEN});
      const name = '„' + o.teile[ziel] + '“ nach ' + (jetzt - 1 === 0 ? 'unten' : 'oben');
      await page.waitForFunction(n => document.activeElement?.getAttribute('aria-label') === n, name, WARTEN);
    }
  }
  assert.deepEqual(await reihe(), o.teile);
  await tippe(bereich.getByRole('button', {name: 'Prüfen', exact: true}), touch);
  await bereich.getByText(o.aufloesung, {exact: true}).waitFor(WARTEN);
  await anfragenFertig();
  await page.reload();
  await ready(page);
  await karteDa(page, t.id);
  await page.locator('section.ordne-richtig').getByText(o.aufloesung, {exact: true}).waitFor(WARTEN);
  return t.id;
}

export async function karteStufen(ctx) {
  for (const [name, karte] of [['MIT_PROFI', MIT_PROFI], ['OHNE_ZUSATZ', OHNE_ZUSATZ], ['DREI_LEICHTE', DREI_LEICHTE], ['ZWEI_AUF_PROFI', ZWEI_AUF_PROFI], ['SCHLUSS_AUF_PROFI', SCHLUSS_AUF_PROFI]]) assert.ok(karte, 'Testvoraussetzung: eine Karte für ' + name);
  const handy = {width: 390, height: 844, touch: true}, breit = {width: 1440, height: 900};
  const a = await mitKarte(ctx, handy, MIT_PROFI.id, stufenAufDerKarte);
  await mitKarte(ctx, breit, MIT_PROFI.id, stufenAufDerKarte);
  const b = await mitKarte(ctx, handy, OHNE_ZUSATZ.id, profiOhneProfiFragen);
  const g = await mitKarte(ctx, handy, MIT_PROFI.id, wechselNachFalscherAntwort);
  await mitKarte(ctx, breit, MIT_PROFI.id, wechselNachFalscherAntwort);
  const i = await mitKarte(ctx, handy, MIT_PROFI.id, faelligNachdenken, passMitFaelligerHauptfrage(MIT_PROFI));
  await mitKarte(ctx, breit, MIT_PROFI.id, faelligNachdenken, passMitFaelligerHauptfrage(MIT_PROFI));
  const h = await mitKarte(ctx, handy, SCHLUSS_AUF_PROFI.id, schlussNachDerStufe);
  await mitKarte(ctx, breit, SCHLUSS_AUF_PROFI.id, schlussNachDerStufe);
  const c = await mitKarte(ctx, handy, DREI_LEICHTE.id, page => vorschlagSchwerer(page, {touch: true}));
  await mitKarte(ctx, breit, DREI_LEICHTE.id, page => vorschlagSchwerer(page, {touch: false}, true));
  const d = await mitKarte(ctx, handy, ZWEI_AUF_PROFI.id, vorschlagLeichter);
  assert.ok(MIT_FAST && MIT_ORDNEN, 'Testvoraussetzung: eine Karte mit „Fast richtig“ und eine mit „Ordne richtig“');
  const e = await mitKarte(ctx, handy, MIT_FAST.id, fastRichtig);
  await mitKarte(ctx, breit, MIT_FAST.id, fastRichtigNurExperte);
  const f = await mitKarte(ctx, handy, MIT_ORDNEN.id, ordneRichtig);
  await mitKarte(ctx, breit, MIT_ORDNEN.id, ordneRichtig);
  ctx.report.checks.push(`Stufen auf der Karte: Wahl über „Rate mal!“, Umstellen wechselt die Frage, übersteht Neuladen, „Zurück zu Entdecker“ (${a}); `
    + `Profi ohne Profi-Fragen sagt „Du spielst Entdecker“, ohne „Zurück zu Entdecker“ (${b}); falsche Antwort bleibt orange (Finger und Maus darauf), nach falscher Entdecker-Antwort und Wechsel eine Profi-Frage (${g}); `
    + `„Noch einmal nachdenken“ über eine nur fällige Hauptfrage zeigt sie ohne alte Lösung, danach ist der Eintrag weg (${i}); `
    + `auf Profi nur Profi-Fragen, jede einmal, dann „Geschafft! Mehr Profi-Fragen …“ und „Weiter zu“ führt zur Nachbarkarte (${h}); Vorschlag nach drei richtigen, „Nein, ich bleibe“ und „Ja“ (${c}); Vorschlag leichter nach zwei falschen auf Profi (${d}); „Fast richtig“ nur auf Experte, Erklärung erst nach dem Wort (${e}); „Ordne richtig“ ab seiner Stufe, ordnen, prüfen, Neuladen (${f})`);
}
