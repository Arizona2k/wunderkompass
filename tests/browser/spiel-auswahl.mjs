import assert from 'node:assert/strict';
import {CHALLENGE_BANK} from '../../app/knowledge-challenge.ts';
import {createSave, SAVE_KEY} from '../../app/progress-storage.ts';
import {STUFE_SCHLUESSEL} from '../../app/kern/stufe.ts';
import {worldGameBank} from '../../app/world-game-bank.ts';
import {bereich, ladeanfragen} from './harness.mjs';

// Spielrunden wählen ihre Aufgaben mit dem gemeinsamen Helfer (Teil B, Aufgabe 7, app/kern/auswahl.ts):
// falsch und fällig zuerst, schon gesehene, nicht fällige zuletzt; „Neue Runde“ oben merkt sich die vorige Runde.
// Die Reihenfolge im Einzelnen prüfen die Unit-Tests (tests/auswahl.test.mjs, tests/challenge.test.mjs);
// hier geht es darum, dass die Seite den Pass wirklich übergibt und die vorige Runde im Pass landet.
const SPIEL = 'world:knowledge-challenge';
const pool = CHALLENGE_BANK.filter(q => q.difficulty === 'medium' && !q.ruht);
const falsch = pool.at(-1), gesehen = pool.slice(0, 14);

export async function spielAuswahl({browser, base, ready, monitor, report}) {
  const context = await browser.newContext({viewport: {width: 390, height: 900}, hasTouch: true, reducedMotion: 'reduce'});
  const save = createSave();
  save.progress.favorites = ['topic:animal-koala'];
  save.progress.review = {
    ['challenge:' + falsch.id]: {correct: false, seen: 1, due: '2026-01-01'},
    ...Object.fromEntries(gesehen.map(q => ['challenge:' + q.id, {correct: true, seen: 2, due: '2099-01-01'}])),
  };
  await context.addInitScript(({key, save}) => { if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(save)); }, {key: SAVE_KEY, save});
  const page = await context.newPage();
  monitor(page);
  const pass = () => page.evaluate(key => JSON.parse(localStorage.getItem(key)).progress, SAVE_KEY);
  const runde = async () => (await pass()).gameSessions[SPIEL]?.challenge;
  const profiStarten = async () => {
    await page.locator('.challenge-levels').getByRole('button').filter({hasText: 'Mittel'}).click();
    await page.waitForFunction(({key, spiel}) => JSON.parse(localStorage.getItem(key)).progress.gameSessions[spiel]?.challenge?.ids?.length === 6, {key: SAVE_KEY, spiel: SPIEL});
    return (await runde()).ids;
  };
  try {
    await page.goto(base);
    await ready(page);
    await ladeanfragen(page)();
    await bereich(page, 'games').click();
    await page.locator(`[data-game-key="${SPIEL}"]`).click();
    await page.locator('.challenge-levels').waitFor();

    const erste = await profiStarten();
    assert.ok(erste.includes(falsch.id), 'die falsch beantwortete, fällige Frage ist in der Runde');
    assert.equal(erste.some(id => gesehen.some(q => q.id === id)), false, 'gesehene, nicht fällige Fragen kommen erst nach den ungesehenen');

    await page.locator('.world-game-room').getByRole('button', {name: 'Neue Runde', exact: true}).click();
    await page.locator('.challenge-levels').waitFor();
    await page.waitForFunction(({key, spiel}) => Array.isArray(JSON.parse(localStorage.getItem(key)).progress.gameSessions[spiel]?.vorige), {key: SAVE_KEY, spiel: SPIEL});
    assert.deepEqual((await pass()).gameSessions[SPIEL].vorige, erste, '„Neue Runde“ merkt sich die vorige Runde im Pass');

    const zweite = await profiStarten();
    assert.equal(zweite.some(id => erste.includes(id)), false, 'die neue Runde wiederholt die vorige nicht');

    await page.reload();
    await ready(page);
    await page.getByRole('button', {name: 'Fortsetzen', exact: true}).click();
    await page.locator('.knowledge-challenge .quiz-answer').first().waitFor();
    const nachher = await pass();
    assert.deepEqual(nachher.gameSessions[SPIEL].challenge.ids, zweite, 'Neuladen ändert die Runde nicht');
    assert.deepEqual(nachher.gameSessions[SPIEL].vorige, erste);
    assert.deepEqual(nachher.favorites, save.progress.favorites, 'der übrige Pass bleibt');
    report.checks.push('Spielrunden-Auswahl: Challenge liest Wiederholungen aus dem Pass, „Neue Runde“ merkt die vorige Runde, Neuladen behält beides');
  } finally {
    await context.close();
  }
  await weltSpielRunden({browser, base, ready, monitor, report});
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
    await zeile.getByText('Experte gibt es hier noch nicht. Du spielst Profi.', {exact: true}).waitFor();
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
    await zeile.getByText('Diese Runde spielst du noch als Entdecker. Die neue Stufe gilt ab der nächsten Runde.', {exact: true}).waitFor();
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
      await brett.getByRole('button', {name: i === neu.items.length - 1 ? 'Spielstempel sammeln' : 'Nächste Aufgabe', exact: true}).click();
    }
    await brett.getByText('Alle 8 Aufgaben sind gelöst. Dein Spielstempel bleibt in deinem Entdeckerpass.', {exact: true}).waitFor();
    const heute = new Date().toISOString().slice(0, 10);
    assert.deepEqual((await sitzung()).geschafft, {profi: heute}, 'die geschaffte Stufe steht im Spielstand');
    await page.locator('.world-game-room').getByRole('button', {name: 'Neue Runde', exact: true}).click();
    await brett.getByText('AUFGABE 1 VON 8', {exact: true}).waitFor();
    assert.deepEqual((await sitzung()).geschafft, {profi: heute}, '„Neue Runde“ behält sie');
    await zeile.getByRole('button', {name: 'Zu schwer? Zurück zu Entdecker', exact: true}).click();
    await brett.getByText('AUFGABE 1 VON 5', {exact: true}).waitFor();
    assert.deepEqual((await sitzung()).geschafft, {profi: heute}, 'ein Stufenwechsel behält sie');
    report.checks.push('Welt-Spiel-Runden: Experte spielt Profi (8 Aufgaben), Wechsel in der Runde startet eine neue Runde mit Fokus auf „Ändern“, Wechsel an anderer Stelle lässt die Runde zu Ende laufen, „Neue Runde“ nimmt die Stufe aus dem Pass');
  } finally {
    await context.close();
  }
}
