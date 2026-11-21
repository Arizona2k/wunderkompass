// Alle Browser-Suiten an einer Stelle.
// set: 'smoke' läuft immer, 'ci' in jeder Prüfung (pnpm run test:browser), 'full' nur in der großen Prüfung.
// chromiumOnly: braucht Chromium-Funktionen (CDP, nativer Zoom). solo: läuft allein, nicht parallel.
import {smoke} from './smoke.mjs';

export const SUITES = [
  {name: 'smoke', set: 'smoke', run: smoke},
];
