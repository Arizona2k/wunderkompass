import assert from 'node:assert/strict';
import {CHALLENGE_BANK} from '../../app/knowledge-challenge.ts';
import {createSave, SAVE_KEY} from '../../app/progress-storage.ts';
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
}
