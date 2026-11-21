// Alle Browser-Suiten an einer Stelle.
// set: 'smoke' läuft immer, 'ci' in jeder Prüfung (pnpm run test:browser), 'full' nur in der großen Prüfung.
// chromiumOnly: braucht Chromium-Funktionen (CDP, nativer Zoom). solo: läuft allein, nicht parallel.
import {smoke} from './smoke.mjs';
import {core} from './core.mjs';
import {offlineCold} from './offline-cold.mjs';
import {engineJourneys} from './engine-journeys.mjs';
import {freePort, withPage} from './harness.mjs';
import {retainedAnimalRounds} from './animal-game-saves.mjs';
import {animalFlow, animalNativeZoom} from './animal-learning.mjs';
import {backupFlow} from './backup.mjs';
import {challengeHints} from './challenge-hints.mjs';
import {discoveryVisitCases, homepageOverview} from './discovery-central.mjs';
import {componentFlow, performanceFlow} from './foundation.mjs';
import {habitatAnswerSemantics} from './habitat-answer-semantics.mjs';
import {journeyTransferFlow} from './journey-transfer.mjs';
import {journeysFlow} from './journeys.mjs';
import {newsRemovalFlow} from './no-news.mjs';
import {offlineResilience} from './offline-resilience.mjs';
import {offlineRetention} from './offline-retention.mjs';
import {passDesign} from './pass-atlas.mjs';
import {peopleLegacyRound} from './people-learning.mjs';
import {playgroundFlow} from './playground.mjs';
import {memoryRound, searchAndHistory} from './portable-flows.mjs';
import {researchFlow} from './research.mjs';
import {researchTransferFlow} from './research-transfer.mjs';
import {retainedAnswerWordingFlow} from './retained-answer-wording.mjs';
import {solarFlow} from './solar-comparison.mjs';

// Ältere Abläufe erwarten (browser, base, ready, monitor, report, shots).
const flow = fn => ({browser, base, ready, monitor, report, shots}) => fn(browser, base, ready, monitor, report, shots);
// Firefox und WebKit prüfen die Modelle in vier Breiten, Chromium in allen acht.
const ENGINE_WIDTHS = [320, 390, 768, 1440];

export const SUITES = [
  {name: 'smoke', set: 'smoke', run: smoke},

  // CI: Pass, gespeicherte Antworten, Offline und alte Links (in jeder Engine).
  {name: 'offline-cold', set: 'ci', solo: true, run: ctx => offlineCold(ctx)},
  {name: 'no-news', set: 'ci', run: flow(newsRemovalFlow)},
  // backup prüft darin auch storage-feedback, book-notes und model-import-integrity.
  {name: 'backup', set: 'ci', run: flow(backupFlow)},
  {name: 'animal-game-saves', set: 'ci', run: flow(retainedAnimalRounds)},
  {name: 'habitat-answer-semantics', set: 'ci', run: flow(habitatAnswerSemantics)},
  {name: 'retained-answer-wording', set: 'ci', run: flow(retainedAnswerWordingFlow)},
  {name: 'journey-transfer', set: 'ci', run: flow(journeyTransferFlow)},
  {name: 'research-transfer', set: 'ci', run: flow(researchTransferFlow)},
  {name: 'offline-retention', set: 'ci', run: ({browser, shots, engine}) => offlineRetention(browser, {shots, kind: engine})},
  {name: 'pass-atlas', set: 'ci', run: async ctx => {
    await withPage(ctx, {width: 320, height: 568, touch: true}, page => passDesign(page, ctx.report, 320, ctx.shots));
    await withPage(ctx, {width: 1440, height: 900}, page => passDesign(page, ctx.report, 1440, ctx.shots));
  }},
  {name: 'portable-flows', set: 'ci', run: async ctx => {
    await withPage(ctx, {width: 390, height: 844, touch: true}, page => searchAndHistory(page, ctx.report));
    await withPage(ctx, {width: 1440, height: 900}, async page => {
      await searchAndHistory(page, ctx.report);
      await memoryRound(page, ctx.ready, ctx.report);
    });
  }},
  {name: 'people-learning', set: 'ci', run: ({browser, base, ready, report, shots}) => peopleLegacyRound(browser, base, ready, report, shots)},

  // FULL: alles, was die alten Läufe portable-smoke und journey-engines erreichten.
  {name: 'performance', set: 'full', solo: true, chromiumOnly: true, run: ({browser, base, ready, monitor, report}) => performanceFlow(browser, base, ready, monitor, report)},
  {name: 'components', set: 'full', chromiumOnly: true, run: flow(componentFlow)},
  {name: 'offline-resilience', set: 'full', solo: true, run: async ({browser, shots, engine, report}) => {
    report.offlineResilience = await offlineResilience(browser, {port: await freePort(), shots, kind: engine});
  }},
  {name: 'research', set: 'full', chromiumOnly: true, run: flow(researchFlow)},
  {name: 'journeys', set: 'full', chromiumOnly: true, run: ({browser, base, ready, monitor, report, shots, browserType, launchOptions}) =>
    journeysFlow(browser, base, ready, monitor, report, shots, {chromium: browserType, options: launchOptions})},
  {name: 'home', set: 'full', chromiumOnly: true, run: flow(homepageOverview)},
  {name: 'home-visits', set: 'full', chromiumOnly: true, run: flow(discoveryVisitCases)},
  {name: 'core', set: 'full', chromiumOnly: true, run: core},
  {name: 'solar-labels', set: 'full', run: ({browser, base, ready, monitor, report, shots, engine}) => engine === 'chromium'
    ? solarFlow(browser, base, ready, monitor, report, shots)
    : solarFlow(browser, base, page => page.locator('.model-solar-system').waitFor(), monitor, report, shots, {widths: ENGINE_WIDTHS})},
  {name: 'animals', set: 'full', run: ({browser, base, ready, monitor, report, shots, engine}) => engine === 'chromium'
    ? animalFlow(browser, base, ready, monitor, report, shots)
    : animalFlow(browser, base, ready, monitor, report, shots, {matrix: ENGINE_WIDTHS})},
  {name: 'animal-native-zoom', set: 'full', chromiumOnly: true, run: ({browserType, launchOptions, base, report, shots}) => animalNativeZoom(browserType, launchOptions, base, report, shots)},
  {name: 'playground', set: 'full', chromiumOnly: true, run: flow(playgroundFlow)},
  {name: 'challenge', set: 'full', chromiumOnly: true, run: flow(challengeHints)},
  {name: 'offline-cold-full', set: 'full', solo: true, chromiumOnly: true, run: ctx => offlineCold(ctx, {full: true})},
  {name: 'engine-journeys', set: 'full', run: engineJourneys},
];
