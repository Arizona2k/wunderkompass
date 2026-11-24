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
import {angezeigteFrage, antwortKnopf, ersteFrageAufStufe, ersteNachbarkarte, falscheAntworten, frageNachWechselAufStufe, fragenAufStufe, fragenDerKarte, fragenGenauDerStufe, hauptfrage, karteDa, rateMal, richtigeAntwort, stufenWahl, stufeWaehlen, zeigtFrage} from './karte-hilfen.mjs';
import catalog from '../../app/world-catalog.json' with {type: 'json'};

const SAVE_KEY = 'erde-entdecken:save:v3';
const WARTEN = {timeout: 10000};
const stufeImPass = page => page.evaluate(key => JSON.parse(localStorage.getItem(key))?.progress.gameSessions['kern:stufe']?.stufe ?? null, SAVE_KEY);
const passLesen = page => page.evaluate(key => JSON.parse(localStorage.getItem(key)).progress, SAVE_KEY);
const ZURUECK = 'Zu schwer? Zurück zu Entdecker';
const hatStufe = (t, stufe) => fragenDerKarte(t).some(f => f.level === stufe);
// Karten für die Fälle, aus den Daten gewählt (die Einstufung kann sich ändern, der Test nicht).
const MIT_PROFI = catalog.find(t => hatStufe(t, 'profi') && fragenAufStufe(t, 'entdecker').length >= 1);
const OHNE_ZUSATZ = catalog.find(t => fragenDerKarte(t).length === 1);
const DREI_LEICHTE = catalog.find(t => fragenAufStufe(t, 'entdecker').length >= 3);
// Für die Vorschläge zählen nur Fragen genau der gewählten Stufe (Code-Prüfung Teil A, Befund 1): zwei echte Profi-Fragen.
const ZWEI_AUF_PROFI = catalog.find(t => fragenDerKarte(t).filter(f => f.level === 'profi').length >= 2);
// Für den Schluss: mindestens zwei Profi-Fragen und eine erklärte Nachbarkarte.
const SCHLUSS_AUF_PROFI = catalog.find(t => fragenGenauDerStufe(t, 'profi').length >= 2 && hatStufe(t, 'profi') && ersteNachbarkarte(t.id));

async function mitKarte(ctx, {width, height, touch = false}, id, fn) {
  const context = await ctx.browser.newContext({viewport: {width, height}, reducedMotion: 'reduce', ...(touch ? {hasTouch: true} : {}), ...(touch && ctx.engine === 'chromium' ? {isMobile: true} : {})});
  try {
    await context.addInitScript(FOKUS_NACH_KLICK);
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
  const profi = await zeigtFrage(page, t, frageNachWechselAufStufe(t, 'profi'));
  await fokusAuf(page, AENDERN, 'nach dem Umstellen (neue Frage) steht der Fokus auf „Ändern“');
  assert.equal(profi.level, 'profi', 'auf Profi zuerst eine neue Profi-Frage');
  assert.equal(await rateMal(page).locator('.quiz-answer').count(), profi.question.answers.length, 'alle Antworten der Frage stehen da');
  assert.equal(await stufeImPass(page), 'profi');
  await wahl.getByRole('button', {name: ZURUECK, exact: true}).waitFor();
  // Experte: eigene Frage oder der ehrliche Satz (E3).
  await stufeWaehlen(page, 'experte', {touch});
  if (hatStufe(t, 'experte')) await zeigtFrage(page, t, frageNachWechselAufStufe(t, 'experte'));
  else await wahl.getByText('Experte gibt es hier noch nicht. Du spielst Profi.', {exact: true}).waitFor();
  await fokusAuf(page, AENDERN, 'nach dem Umstellen auf Experte steht der Fokus auf „Ändern“');
  await anfragenFertig();
  await page.reload();
  await ready(page);
  await karteDa(page, t.id);
  await stufenWahl(page).locator('.stufen-zeile').filter({hasText: 'Stufe: Experte'}).waitFor(WARTEN);
  await tippe(stufenWahl(page).getByRole('button', {name: ZURUECK, exact: true}), touch);
  await stufenWahl(page).locator('.stufen-zeile').filter({hasText: 'Stufe: Entdecker'}).waitFor(WARTEN);
  await zeigtFrage(page, t, frageNachWechselAufStufe(t, 'entdecker'));
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
// alte Entdecker-Frage (Spieltest 24.11.2026, Befund 1). Beim Öffnen bliebe es bei der falschen Frage (E4).
async function wechselNachFalscherAntwort(page, {touch}) {
  const t = MIT_PROFI;
  const haupt = await zeigtFrage(page, t, ersteFrageAufStufe(t, 'entdecker'));
  await tippe(antwortKnopf(page, falscheAntworten(haupt)[0]), touch);
  await rateMal(page).getByText('Noch nicht ganz. Versuch es noch einmal!', {exact: true}).waitFor(WARTEN);
  await page.waitForFunction(([key, id]) => JSON.parse(localStorage.getItem(key)).progress.review[id]?.correct === false, [SAVE_KEY, haupt.reviewId], WARTEN);
  const pass = await passLesen(page);
  const stand = pass.gameSessions['topic:' + t.id];
  assert.equal(ersteFrageAufStufe(t, 'profi', pass.review, stand).id, haupt.id, 'Testvoraussetzung: beim Öffnen auf Profi käme die falsche Entdecker-Frage');
  await stufeWaehlen(page, 'profi', {touch});
  const frage = await zeigtFrage(page, t, frageNachWechselAufStufe(t, 'profi', pass.review, stand));
  assert.equal(frage.level, 'profi', 'nach dem Wechsel auf Profi eine Profi-Frage');
  await fokusAuf(page, AENDERN, 'nach dem Wechsel (neue Frage) steht der Fokus auf „Ändern“');
  return t.id;
}

// (c, d): Auf Profi zeigt „Noch eine Frage“ jede Profi-Frage einmal und keine leichtere; danach steht der Schluss mit
// „Nächste Karte“, und der Knopf führt zur ersten erklärten Nachbarkarte.
async function schlussNachDerStufe(page, {touch}) {
  const t = SCHLUSS_AUF_PROFI;
  const runde = fragenGenauDerStufe(t, 'profi');
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
      assert.equal(await rateMal(page).getByText('Alle Profi-Fragen geschafft!', {exact: true}).count(), 0, 'noch kein Schluss nach ' + (i + 1) + ' Fragen');
      await tippe(rateMal(page).getByRole('button', {name: 'Noch eine Frage', exact: true}), touch);
      await page.waitForFunction(id => document.querySelector('section.rate-mal')?.getAttribute('aria-labelledby') !== 'rate-mal-' + id, frage.id, WARTEN);
    }
  }
  await rateMal(page).getByText('Alle Profi-Fragen geschafft!', {exact: true}).waitFor(WARTEN);
  assert.equal(await rateMal(page).getByRole('button', {name: 'Noch eine Frage', exact: true}).count(), 0, 'nach der letzten Profi-Frage kein „Noch eine Frage“');
  await rateMal(page).getByRole('button', {name: 'Noch einmal raten', exact: true}).waitFor();
  const ziel = ersteNachbarkarte(t.id);
  const knopf = rateMal(page).locator('.rate-mal-naechste-karte');
  assert.match(await knopf.innerText(), /^Nächste Karte: /, 'der Knopf sagt, wohin er führt');
  // Am Handy ragt der Knopf nicht über den Rand (lange Titel brechen um).
  const rand = await knopf.evaluate(el => ({rechts: el.getBoundingClientRect().right, breite: document.documentElement.clientWidth}));
  assert.ok(rand.rechts <= rand.breite + 0.5, 'der Knopf „Nächste Karte“ passt in die Breite: ' + JSON.stringify(rand));
  await tippe(knopf, touch);
  await page.waitForFunction(id => decodeURIComponent(location.hash) === '#world/topic/' + id, ziel, WARTEN);
  await karteDa(page, ziel);
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
  // Der Vorschlag steht in der Rückmeldung vor dem nächsten Schritt („Noch eine Frage“ oder, nach der letzten Frage der
  // Stufe, der Schluss); darunter übersahen ihn Kinder (Design-Prüfung Teil A, Befund 2).
  assert.equal(await rateMal(page).getByRole('status').locator('.stufen-vorschlag').count(), 1, 'der Vorschlag steht in der Rückmeldung');
  assert.equal(await rateMal(page).evaluate(bereich => {
    const hinweis = bereich.querySelector('.stufen-vorschlag');
    const weiter = bereich.querySelector('.rate-mal-schluss, .rate-mal-weiter');
    return Boolean(hinweis && weiter && hinweis.compareDocumentPosition(weiter) & Node.DOCUMENT_POSITION_FOLLOWING);
  }), true, 'der Vorschlag steht vor dem nächsten Schritt');
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
    + `Profi ohne Profi-Fragen sagt „Du spielst Entdecker“, ohne „Zurück zu Entdecker“ (${b}); nach falscher Entdecker-Antwort und Wechsel eine Profi-Frage (${g}); `
    + `auf Profi nur Profi-Fragen, jede einmal, dann „Alle Profi-Fragen geschafft!“ und „Nächste Karte“ führt zur Nachbarkarte (${h}); Vorschlag nach drei richtigen, „Nein, ich bleibe“ und „Ja“ (${c}); Vorschlag leichter nach zwei falschen auf Profi (${d}); „Fast richtig“ nur auf Experte, Erklärung erst nach dem Wort (${e}); „Ordne richtig“ ab seiner Stufe, ordnen, prüfen, Neuladen (${f})`);
}
