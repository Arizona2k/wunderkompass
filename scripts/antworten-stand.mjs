// Schreibt eine datierte Liste aller Antworten, die Kinder auf den Karten speichern können (Hauptfragen, Zusatzfragen,
// Challenge-Fragen; ruhende Fragen erscheinen nicht mehr und fehlen darum). Aufruf, wenn ein Schritt neue Antworten bringt,
// direkt vor dem Merge nach test-live:
//   node scripts/antworten-stand.mjs tests/fixtures/gespeicherte-antworten-<name>.json "<Datum, Branch, Schritt>"
// Eine gemergte Liste wird nie geändert; tests/gespeicherte-antworten.test.mjs liest alle Listen (Regel: die Listen wachsen nur).
import {writeFileSync} from 'node:fs';
import catalog from '../app/world-catalog.json' with {type: 'json'};

const [ziel, stand] = process.argv.slice(2);
if (!ziel || !stand) throw Error('Aufruf: node scripts/antworten-stand.mjs <ziel.json> "<stand>"');
const eintrag = (id, q) => ({id, answers: q.answers, correct: q.correct});
const fragen = catalog.flatMap(t => [
  eintrag(t.id, t.question),
  ...(t.moreQuestions ?? []).filter(q => !q.ruht).map(q => eintrag(q.id, q)),
  ...(t.challenges ?? []).filter(q => !q.ruht).map(q => eintrag(q.id, q)),
]);
writeFileSync(ziel, JSON.stringify({
  stand,
  hinweis: 'Antworten, die Kinder auf den Karten gespeichert haben können. Nach dem Merge nie ändern; tests/gespeicherte-antworten.test.mjs prüft, dass jede noch lesbar ist.',
  fragen,
}, null, 2) + '\n');
console.log(fragen.length, 'Fragen nach', ziel);
