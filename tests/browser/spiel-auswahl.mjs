import assert from 'node:assert/strict';
import {CHALLENGE_BANK, EXPERTEN_HINWEIS, stufeDerFrage} from '../../app/knowledge-challenge.ts';
import {createSave, SAVE_KEY} from '../../app/progress-storage.ts';
import {STUFE_SCHLUESSEL} from '../../app/kern/stufe.ts';
import {worldGameBank} from '../../app/world-game-bank.ts';
import {bereich, ladeanfragen} from './harness.mjs';

// Spielrunden wählen ihre Aufgaben mit dem gemeinsamen Helfer (Teil B, Aufgabe 7, app/kern/auswahl.ts):
// falsch und fällig zuerst, schon gesehene, nicht fällige zuletzt; „Neue Runde“ oben merkt sich die vorige Runde.
// Die Reihenfolge im Einzelnen prüfen die Unit-Tests (tests/auswahl.test.mjs, tests/challenge.test.mjs);
// hier geht es darum, dass die Seite den Pass wirklich übergibt und die vorige Runde im Pass landet.
// Kreuz und quer startet seit Teil B, Aufgabe 9 gleich mit der Stufe aus dem Pass (Entscheidungsliste Teil B, Punkt 8).
const SPIEL = 'world:knowledge-challenge';
const stufeVon = id => stufeDerFrage(CHALLENGE_BANK.find(q => q.id === id));
const pool = CHALLENGE_BANK.filter(q => stufeDerFrage(q) === 'profi' && !q.ruht);
const falsch = pool.at(-1), gesehen = pool.slice(0, 14);

export async function spielAuswahl({browser, base, ready, monitor, report}) {
  const context = await browser.newContext({viewport: {width: 390, height: 900}, hasTouch: true, reducedMotion: 'reduce'});
  const save = createSave();
  save.progress.favorites = ['topic:animal-koala'];
  save.progress.gameSessions = stufeImPass('profi');
  save.progress.review = {
    ['challenge:' + falsch.id]: {correct: false, seen: 1, due: '2026-01-01'},
    ...Object.fromEntries(gesehen.map(q => ['challenge:' + q.id, {correct: true, seen: 2, due: '2099-01-01'}])),
  };
  await context.addInitScript(({key, save}) => { if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(save)); }, {key: SAVE_KEY, save});
  const page = await context.newPage();
  monitor(page);
  const pass = () => page.evaluate(key => JSON.parse(localStorage.getItem(key)).progress, SAVE_KEY);
  const runde = async () => (await pass()).gameSessions[SPIEL]?.challenge;
  const zeile = page.locator('.knowledge-challenge .stufen-wahl');
  // Wartet, bis im Pass eine neue Runde der Stufe liegt, die nicht `alt` ist, und gibt ihre Fragen zurück.
  const neueRunde = async (stufe, alt = []) => {
    await page.waitForFunction(({key, spiel, stufe, alt}) => { const r = JSON.parse(localStorage.getItem(key)).progress.gameSessions[spiel]?.challenge; return r?.stufe === stufe && r.ids?.length === 6 && JSON.stringify(r.ids) !== JSON.stringify(alt); }, {key: SAVE_KEY, spiel: SPIEL, stufe, alt});
    await page.locator('.knowledge-challenge .quiz-answer').first().waitFor();
    return (await runde()).ids;
  };
  try {
    await page.goto(base);
    await ready(page);
    await ladeanfragen(page)();
    await bereich(page, 'games').click();
    await page.locator(`[data-game-key="${SPIEL}"]`).click();
    await zeile.locator('.stufen-zeile').filter({hasText: 'Stufe: Profi'}).waitFor();
    assert.equal(await page.locator('.challenge-levels').count(), 0, 'keine Auswahl Leicht/Mittel/Schwer mehr');

    const erste = await neueRunde('profi');
    assert.ok(erste.every(id => stufeVon(id) === 'profi'), 'die Runde spielt die Stufe aus dem Pass');
    assert.ok(erste.includes(falsch.id), 'die falsch beantwortete, fällige Frage ist in der Runde');
    assert.equal(erste.some(id => gesehen.some(q => q.id === id)), false, 'gesehene, nicht fällige Fragen kommen erst nach den ungesehenen');

    await page.locator('.world-game-room').getByRole('button', {name: 'Neue Runde', exact: true}).click();
    const zweite = await neueRunde('profi', erste);
    assert.deepEqual((await pass()).gameSessions[SPIEL].vorige, erste, '„Neue Runde“ merkt sich die vorige Runde im Pass');
    assert.equal(zweite.some(id => erste.includes(id)), false, 'die neue Runde wiederholt die vorige nicht');

    await page.reload();
    await ready(page);
    await page.getByRole('button', {name: 'Fortsetzen', exact: true}).click();
    await page.locator('.knowledge-challenge .quiz-answer').first().waitFor();
    const nachher = await pass();
    assert.deepEqual(nachher.gameSessions[SPIEL].challenge.ids, zweite, 'Neuladen ändert die Runde nicht');
    assert.deepEqual(nachher.gameSessions[SPIEL].vorige, erste);
    assert.deepEqual(nachher.favorites, save.progress.favorites, 'der übrige Pass bleibt');

    // Ein Wechsel in der Runde startet gleich eine neue Runde der neuen Stufe und merkt die abgebrochene (Punkt 3).
    await zeile.getByRole('button', {name: 'Zu schwer? Zurück zu Entdecker', exact: true}).click();
    const entdecker = await neueRunde('entdecker', zweite);
    assert.ok(entdecker.every(id => stufeVon(id) === 'entdecker'));
    assert.deepEqual((await pass()).gameSessions[SPIEL].vorige, zweite, 'die abgebrochene Runde ist gemerkt');
    assert.equal(await page.evaluate(() => document.activeElement?.classList.contains('stufen-aendern')), true, 'der Fokus bleibt auf „Ändern“');

    // Experte: zuerst höchstens drei Experten-Fragen, dann Profi, mit ehrlichem Satz (Entscheidung C1 und Punkt 8).
    await zeile.getByRole('button', {name: 'Stufe ändern', exact: true}).tap();
    await zeile.getByRole('group', {name: 'Welche Stufe willst du spielen?', exact: true}).getByRole('button').filter({hasText: 'Experte'}).tap();
    const experte = await neueRunde('experte', entdecker);
    assert.equal(experte.filter(id => stufeVon(id) === 'experte').length, 3, 'drei Experten-Fragen');
    assert.ok(experte.filter(id => stufeVon(id) !== 'experte').every(id => stufeVon(id) === 'profi'), 'aufgefüllt mit Profi');
    await zeile.getByText(EXPERTEN_HINWEIS, {exact: true}).waitFor();

    // Stufe an anderer Stelle ändern (wie im Pass oder auf einer Karte): Die angefangene Runde läuft mit ihrer Stufe zu Ende.
    await page.evaluate(({key, eintrag}) => { const s = JSON.parse(localStorage.getItem(key)); Object.assign(s.progress.gameSessions, eintrag); localStorage.setItem(key, JSON.stringify(s)); }, {key: SAVE_KEY, eintrag: stufeImPass('entdecker')});
    await page.reload();
    await ready(page);
    await page.getByRole('button', {name: 'Fortsetzen', exact: true}).click();
    await zeile.getByText('Diese Runde spielst du noch als Experte. Ab der nächsten Runde spielst du Entdecker.', {exact: true}).waitFor();
    assert.deepEqual((await runde()).ids, experte, 'Neuladen behält die Runde und ihre Stufe');
    report.checks.push('Spielrunden-Auswahl: Kreuz und quer startet mit der Stufe aus dem Pass, liest Wiederholungen, „Neue Runde“ und Stufenwechsel merken die vorige Runde, Experte mit drei Experten-Fragen, Neuladen behält Runde und Stufe');
  } finally {
    await context.close();
  }
  await weltSpielRunden({browser, base, ready, monitor, report});
  await oeffnetObenTrotzWeiterKarte({browser, base, ready, monitor, report});
}

// Welt-Spiel-Runden mit der gemeinsamen Stufe (Teil B, Aufgabe 8, Schritt 8.1; Entscheidungsliste Teil B, Punkt 3).
const WELT = 'world:habitats';
const stufeImPass = stufe => ({[STUFE_SCHLUESSEL]: {stufe, seit: '2026-11-24'}});
async function weltSpielRunden({browser, base, ready, monitor, report}) {
  const context = await browser.newContext({viewport: {width: 390, height: 900}, hasTouch: true, reducedMotion: 'reduce'});
  const save = createSave();
  save.progress.gameSessions = stufeImPass('experte');
  await context.addInitScript(({key, save}) => { if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(save)); }, {key: SAVE_KEY, save});
  const page = await context.newPage();
  monitor(page);
  const sitzung = async () => (await page.evaluate(key => JSON.parse(localStorage.getItem(key)).progress, SAVE_KEY)).gameSessions[WELT];
  const brett = page.locator('.world-game-room .game-board');
  const zeile = brett.locator('.stufen-wahl');
  try {
    await page.goto(base);
    await ready(page);
    await ladeanfragen(page)();
    await bereich(page, 'games').click();
    await page.locator(`[data-game-key="${WELT}"]`).click();
    await brett.getByText('AUFGABE 1 VON 8', {exact: true}).waitFor();
    await zeile.getByText('Experten-Aufgaben gibt es hier noch nicht. Du spielst Profi.', {exact: true}).waitFor();
    // Das Spiel öffnet oben, nicht mitten in der Spieleliste (Spieltest Welt-Spiele, G).
    await page.waitForFunction(() => { const oben = document.querySelector('.world-game-room')?.getBoundingClientRect().top; return oben !== undefined && oben >= 0 && oben <= 40; });
    const profi = await sitzung();
    assert.equal(profi.stufe, 'profi', 'Experte spielt in den Welt-Spielen Profi');
    assert.equal(profi.items.length, 8);

    await zeile.getByRole('button', {name: 'Zu schwer? Zurück zu Entdecker', exact: true}).click();
    await brett.getByText('AUFGABE 1 VON 5', {exact: true}).waitFor();
    const entdecker = await sitzung();
    assert.equal(entdecker.stufe, 'entdecker', 'ein Wechsel in der Runde startet gleich eine neue Runde');
    assert.equal(entdecker.items.length, 5);
    assert.deepEqual(entdecker.vorige, profi.items, 'die abgebrochene Runde ist gemerkt');
    assert.equal(entdecker.items.some(id => profi.items.includes(id)), false, 'und kommt nicht gleich wieder');
    assert.equal(await page.evaluate(() => document.activeElement?.classList.contains('stufen-aendern')), true, 'der Fokus bleibt auf „Ändern“');
    assert.equal(await zeile.locator('.stufen-hinweis').count(), 0);

    // Stufe an anderer Stelle ändern (wie im Pass oder auf einer Karte): Die angefangene Runde läuft mit ihrer Stufe zu Ende.
    await page.evaluate(({key, eintrag}) => { const s = JSON.parse(localStorage.getItem(key)); Object.assign(s.progress.gameSessions, eintrag); localStorage.setItem(key, JSON.stringify(s)); }, {key: SAVE_KEY, eintrag: stufeImPass('profi')});
    await page.reload();
    await ready(page);
    await page.getByRole('button', {name: 'Fortsetzen', exact: true}).click();
    await brett.getByText('AUFGABE 1 VON 5', {exact: true}).waitFor();
    await zeile.getByText('Diese Runde spielst du noch als Entdecker. Ab der nächsten Runde spielst du Profi.', {exact: true}).waitFor();
    assert.deepEqual((await sitzung()).items, entdecker.items, 'Neuladen behält die Runde');

    await page.locator('.world-game-room').getByRole('button', {name: 'Neue Runde', exact: true}).click();
    await brett.getByText('AUFGABE 1 VON 8', {exact: true}).waitFor();
    const neu = await sitzung();
    assert.equal(neu.stufe, 'profi', '„Neue Runde“ nimmt die Stufe aus dem Pass, eine geschaffte Profi-Runde wird gemerkt und übersteht „Neue Runde“ und Stufenwechsel');
    assert.deepEqual(neu.vorige, entdecker.items);
    assert.equal(await zeile.locator('.stufen-hinweis').count(), 0);

    // Eine Profi-Runde ganz durchspielen: Die höchste geschaffte Stufe wird gemerkt (E13) und übersteht „Neue Runde“.
    const pool = worldGameBank('habitats');
    for (let i = 0; i < neu.items.length; i++) {
      const q = pool.find(q => q.id === neu.items[i]);
      await brett.getByText(`AUFGABE ${i + 1} VON 8`, {exact: true}).waitFor();
      assert.equal(await brett.locator('.quiz-answer').count(), 4, 'Profi zeigt vier Antworten');
      await brett.locator('.quiz-answer').filter({has: page.getByText(q.answers[q.correct], {exact: true})}).click();
      // Die richtige Antwort wird gesperrt; der Fokus geht zum nächsten Schritt statt auf <body> (Design-Prüfung Welt-Spiele, Wichtig 2).
      const weiter = i === neu.items.length - 1 ? 'Spielstempel sammeln' : 'Nächste Aufgabe';
      await page.waitForFunction(text => document.activeElement?.textContent?.trim() === text, weiter);
      await brett.getByRole('button', {name: weiter, exact: true}).click();
    }
    await brett.getByText('Alle 8 Aufgaben sind gelöst. Dein Spielstempel bleibt in deinem Entdeckerpass.', {exact: true}).waitFor();
    await page.waitForFunction(() => document.activeElement?.tagName === 'H2' && document.activeElement.textContent === 'Eine ganze Runde gelöst!');
    assert.equal(await zeile.getByRole('button', {name: 'Zu schwer? Zurück zu Entdecker', exact: true}).count(), 0, 'kein „Zu schwer?“ nach einer geschafften Runde (Design-Prüfung Welt-Spiele, Muss 1)');
    const heute = new Date().toISOString().slice(0, 10);
    assert.deepEqual((await sitzung()).geschafft, {profi: heute}, 'die geschaffte Stufe steht im Spielstand');
    await page.locator('.world-game-room').getByRole('button', {name: 'Neue Runde', exact: true}).click();
    await brett.getByText('AUFGABE 1 VON 8', {exact: true}).waitFor();
    assert.deepEqual((await sitzung()).geschafft, {profi: heute}, '„Neue Runde“ behält sie');
    await zeile.getByRole('button', {name: 'Zu schwer? Zurück zu Entdecker', exact: true}).click();
    await brett.getByText('AUFGABE 1 VON 5', {exact: true}).waitFor();
    assert.deepEqual((await sitzung()).geschafft, {profi: heute}, 'ein Stufenwechsel behält sie');
    report.checks.push('Welt-Spiel-Runden: öffnet oben, Experte spielt Profi (8 Aufgaben), Wechsel in der Runde startet eine neue Runde mit Fokus auf „Ändern“, Wechsel an anderer Stelle lässt die Runde zu Ende laufen, „Neue Runde“ nimmt die Stufe aus dem Pass, Fokus nach richtiger Antwort und am Ende, kein „Zu schwer?“ auf dem Abschlussbild');
  } finally {
    await context.close();
  }
}

// Ein Spiel öffnet oben, auch mit weichem Scrollen und wenn über den Spielen noch „Weiter entdecken“ für ein anderes Spiel
// steht (Design-Prüfung PR 2, Befund 1): Die Karte verschwindet, sobald ein Spiel offen ist, nicht erst nach dem Speichern.
// Sonst rückte alles um ihre Höhe nach oben, während die Seite noch zum Spiel rollte, und der Titel lag über dem Bildrand.
async function oeffnetObenTrotzWeiterKarte({browser, base, ready, monitor, report}) {
  const context = await browser.newContext({viewport: {width: 390, height: 780}, reducedMotion: 'no-preference'});
  const page = await context.newPage();
  monitor(page);
  try {
    await page.goto(base);
    await ready(page);
    await ladeanfragen(page)();
    await bereich(page, 'games').click();
    // Erst Kreuz und quer anfangen und zurück zu allen Spielen: Dann steht „Weiter entdecken“ über den Spielen.
    await page.locator(`[data-game-key="${SPIEL}"]`).click();
    await page.locator('.knowledge-challenge .quiz-answer').first().waitFor();
    await page.waitForFunction(({key, spiel}) => JSON.parse(localStorage.getItem(key) ?? 'null')?.progress?.lastActivity?.id === spiel, {key: SAVE_KEY, spiel: SPIEL});
    await page.locator('.game-room').getByRole('button', {name: 'Alle Spiele', exact: true}).click();
    await page.locator('.continue-card').waitFor();
    const kachel = page.locator('[data-game-key="classic:detective"]');
    await kachel.scrollIntoViewIfNeeded();
    await kachel.click();
    await page.locator('.game-room .classic-learning .stufen-wahl').waitFor();
    // Warten, bis die Seite fertig gerollt ist (zehn Bilder ohne Bewegung).
    await page.waitForFunction(() => new Promise(fertig => { let y = scrollY, ruhig = 0; const bild = () => { if (scrollY === y) { if (++ruhig >= 10) return fertig(true); } else { y = scrollY; ruhig = 0; } requestAnimationFrame(bild); }; requestAnimationFrame(bild); }));
    assert.equal(await page.locator('.continue-card').count(), 0, 'im offenen Spiel keine Karte „Weiter entdecken“');
    const oben = await page.evaluate(() => Math.round(document.querySelector('.game-room h1').getBoundingClientRect().top));
    assert.ok(oben >= 0 && oben <= 40, `der Spieltitel steht oben im Bild (${oben} px)`);
    await page.locator('.game-room').getByRole('button', {name: 'Alle Spiele', exact: true}).click();
    await page.locator('.continue-card').waitFor();
    report.checks.push('Spiel öffnet oben auch mit weichem Scrollen und Karte „Weiter entdecken“ darüber; die Karte ist im offenen Spiel weg und in der Übersicht wieder da');
  } finally {
    await context.close();
  }
}
