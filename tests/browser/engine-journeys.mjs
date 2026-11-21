// Lernreisen und Geschichte in jeder Browser-Engine (aus dem alten journey-engines-Lauf übernommen):
// Hilfeansichten der Reisen, je Reise die schwerste Aufgabe des ersten Kapitels mit falscher und
// richtiger Antwort, Weiter/Zurück/Neuladen, große Schrift in vier Breiten, axe-Prüfung des Lesers
// und die Geschichts-Ansicht in vier Breiten.
import assert from 'node:assert/strict';
import path from 'node:path';
import DATA from '../../app/journey-inquiries.json' with {type: 'json'};
import {JOURNEYS} from '../../app/learning-data.ts';
import {prepareAxe} from './axe-loader.mjs';
import {neuigkeitenAnsicht} from './discovery-central.mjs';
import {journeySupportView} from './journeys.mjs';

const WIDTHS = [320, 390, 768, 1440];

export async function engineJourneys({browser, base, ready, monitor, report, shots, engine}) {
  const context = await browser.newContext({viewport: {width: 390, height: 844}, reducedMotion: 'reduce'});
  try {
    const p = await context.newPage();
    monitor(p);
    p.setDefaultTimeout(20000);
    await p.goto(base + '/#journeys');
    await ready(p);

    report.journeySupport = await journeySupportView(p, {widths: WIDTHS, shots, engine});

    const checked = [];
    for (const journey of JOURNEYS) {
      await p.evaluate(id => { location.hash = 'journeys/' + id + '/1'; }, journey.id);
      const inquiry = p.locator('[data-chapter-inquiry="' + journey.id + ':0"]');
      await inquiry.waitFor();
      const chapter = DATA.chapters.find(c => c.id === journey.id + ':0');
      const task = chapter.tasks[2];
      await inquiry.locator('.journey-levels button').nth(2).click();
      await inquiry.locator('.quiz-answer').nth((task.correct + 1) % 3).click();
      assert.equal(await inquiry.getByText(task.why, {exact: true}).count(), 0, chapter.id + ': falsche Antwort zeigt die Erklärung nicht');
      await inquiry.locator('.quiz-answer').nth(task.correct).click();
      await inquiry.getByText(task.why, {exact: true}).waitFor();
      assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2), false, chapter.id + ': kein waagerechter Überlauf');
      checked.push(chapter.id);
    }
    report.checks.push(`Lernreisen ${engine}: ${checked.length} erste Kapitel mit falscher und richtiger Antwort`);

    await p.evaluate(() => { location.hash = 'journeys/water/3'; });
    await p.locator('[data-chapter-inquiry="water:2"]').waitFor();
    await p.getByRole('button', {name: 'Weiter entdecken', exact: true}).click();
    await p.locator('[data-chapter-inquiry="water:3"]').waitFor();
    await p.goBack();
    await p.locator('[data-chapter-inquiry="water:2"]').waitFor();
    await p.reload();
    await p.locator('[data-chapter-inquiry="water:2"]').waitFor();

    for (const width of WIDTHS) {
      await p.setViewportSize({width, height: 900});
      await p.evaluate(() => document.querySelector('.earth-app').classList.add('large-reading'));
      assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2), false, `große Schrift ${width}: kein waagerechter Überlauf`);
      await p.locator('.journey-levels button').nth(1).focus();
      await p.screenshot({path: path.join(shots, `journey-${width}.png`), fullPage: true, animations: 'disabled'});
    }
    await prepareAxe(p);
    const violations = await p.evaluate(async () => (await window.axe.run('.journey-reader', {runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']}})).violations.map(v => v.id));
    assert.deepEqual(violations, [], 'Lernreise-Leser ohne axe-Verstöße');

    report.historyViews = [];
    for (const width of WIDTHS) {
      await p.setViewportSize({width, height: 900});
      report.historyViews.push(await neuigkeitenAnsicht(p, width, shots, {engine}));
    }
  } finally {
    await context.close();
  }
}
