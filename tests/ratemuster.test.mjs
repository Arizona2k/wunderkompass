// Ratemuster-Test für verräterische Wörter (Teil B, Aufgabe 9; Stufen-Prüfung Welt-Spiele, S10):
// Steht ein Wort in mindestens 5 % der Aufgaben einer Gruppe in genau einer gezeigten Antwort, und ist diese Antwort
// in mindestens 80 % dieser Aufgaben die richtige, löst ein Kind die Aufgaben über das Wort statt über das Wissen.
// Er hätte „Erst in der Zukunft“ (M1), „Pflanze“ bei der Nahrung (S1) und die verräterischen Tier- und Technik-Namen (S5) gefunden.
// Gruppen: Welt-Spiele je Spiel und Stufe (gezogene Runden), Kreuz und quer je Stufe, Klassik-Spiele je Stufe.
// Bekannte Funde, die erst mit neuen Inhalten verschwinden, stehen mit BACKLOG-Verweis in AUSNAHMEN; die Liste darf nur schrumpfen.
import assert from 'node:assert/strict';
import test from 'node:test';
import {worldGameBank} from '../app/world-game-bank.ts';
import {STUFEN_SPIELE, neueWeltRunde} from '../app/world-game-runde.ts';
import {CHALLENGE_BANK, stufeDerFrage} from '../app/knowledge-challenge.ts';
import {CLASSIC_QUESTIONS, klassikStufe} from '../app/classic-learning.ts';

const STOPP = new Set(['der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer', 'und', 'oder', 'aber', 'nicht', 'ist', 'sind', 'wird', 'werden', 'hat', 'haben', 'mit', 'von', 'vom', 'zum', 'zur', 'für', 'auf', 'aus', 'bei', 'nach', 'wie', 'als', 'auch', 'noch', 'sich', 'sie', 'er', 'es', 'im', 'in', 'an', 'am', 'zu', 'so', 'dann', 'dort', 'hier', 'ja', 'nein']);
const woerter = text => new Set(text.toLocaleLowerCase('de').split(/[^a-zäöüß]+/).filter(w => w.length >= 3 && !STOPP.has(w)));

// aufgaben: [{antworten: [gezeigte Texte], richtig: Text}]. Ergebnis: Wörter mit Anteil und Trefferquote.
export function verraeterischeWoerter(aufgaben, {mindestAnteil = 0.05, mindestQuote = 0.8} = {}) {
  const zaehler = new Map();
  for (const {antworten, richtig} of aufgaben) {
    const je = antworten.map(woerter), alle = new Set(je.flatMap(w => [...w]));
    for (const w of alle) {
      const mit = antworten.filter((_a, i) => je[i].has(w));
      if (mit.length !== 1) continue;
      const z = zaehler.get(w) ?? {n: 0, richtig: 0};
      z.n++; if (mit[0] === richtig) z.richtig++;
      zaehler.set(w, z);
    }
  }
  return [...zaehler].filter(([, z]) => z.n / aufgaben.length >= mindestAnteil && z.richtig / z.n >= mindestQuote && z.n >= 3)
    .map(([wort, z]) => ({wort, anteil: +(z.n / aufgaben.length).toFixed(2), quote: +(z.richtig / z.n).toFixed(2), n: z.n}));
}

function zufallAus(seed) { let s = seed * 9301 + 49297; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }

function weltAufgaben(spiel, stufe) {
  const pool = worldGameBank(spiel), aufgaben = [];
  for (let seed = 0; seed < 120; seed++) {
    const r = neueWeltRunde({spiel, stufe, review: {}, vorige: [], zufall: zufallAus(seed), heute: '2026-11-24'});
    for (const id of r.items) { const q = pool.find(q => q.id === id); aufgaben.push({antworten: r.orders[id], richtig: q.answers[q.correct]}); }
  }
  return aufgaben;
}

export const GRUPPEN = () => [
  ...STUFEN_SPIELE.flatMap(spiel => ['entdecker', 'profi'].map(stufe => ['welt:' + spiel + ':' + stufe, weltAufgaben(spiel, stufe)])),
  ...['entdecker', 'profi', 'experte'].map(stufe => ['kreuz-und-quer:' + stufe, CHALLENGE_BANK.filter(q => !q.ruht && stufeDerFrage(q) === stufe).map(q => ({antworten: q.answers, richtig: q.answers[q.correct]}))]),
  ...['habitats', 'detective'].flatMap(spiel => ['entdecker', 'profi', 'experte'].map(stufe => ['klassik:' + spiel + ':' + stufe, CLASSIC_QUESTIONS.filter(q => q.game === spiel && !q.ruht && klassikStufe(q) === stufe).map(q => ({antworten: q.answers, richtig: q.correct}))])),
].filter(([, aufgaben]) => aufgaben.length > 0);

// Bekannte Funde mit Grund. Wird ein Fund behoben, schlägt der Test fehl, bis der Eintrag hier gestrichen ist.
const AUSNAHMEN = {
  // BACKLOG Phase 1, Punkt 25 „Fallen-Listen schärfen“ (Stufen-Prüfung S1): „Verschiedene … Nahrung“ ist nie Falle. Verschwindet
  // mit genaueren richtigen Antworten. „Pflanzen“ ist seit den neuen Profi-Fallen vom 25.11.2026 kein Fund mehr (Tier-Auflösungen).
  'welt:food:profi': ['verschiedene'],
  // BACKLOG Phase 1, Punkt 25 „Tierdetektiv und Technik“ (S5): Entdecker zieht die Fallen nur aus 12 der 24 Erfindungen;
  // die übrigen sind, wenn sie dastehen, immer richtig. Verschwindet mit Fallen aus allen Erfindungen.
  'welt:technology:entdecker': ['druck', 'fahrrad', 'kühlschrank', 'nähmaschine', 'transistor'],
};

test('kein Wort verrät in einer Spielgruppe die richtige Antwort', () => {
  const funde = Object.fromEntries(GRUPPEN().map(([name, aufgaben]) => [name, verraeterischeWoerter(aufgaben).map(f => f.wort).sort()]).filter(([, w]) => w.length));
  assert.deepEqual(funde, AUSNAHMEN);
});

test('der Helfer findet ein verräterisches Wort und übersieht keins', () => {
  const aufgaben = Array.from({length: 20}, (_v, i) => ({antworten: ['Ein Tier mit Pflanzen ' + i, 'Fleisch ' + i, 'Fisch ' + i], richtig: i < 18 ? 'Ein Tier mit Pflanzen ' + i : 'Fisch ' + i}));
  assert.deepEqual(verraeterischeWoerter(aufgaben).map(f => f.wort), ['tier', 'pflanzen']);
  const fair = aufgaben.map((a, i) => ({...a, richtig: a.antworten[i % 3]}));
  assert.deepEqual(verraeterischeWoerter(fair), []);
});
