// Die neuen Felder der Wissenskarte (chapters, claims, moreQuestions) sind wohlgeformt,
// und ihre IDs stoßen mit keiner vorhandenen ID zusammen (Pass-Einträge hängen an diesen IDs).
import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../app/world-catalog.json' with {type: 'json'};
import {kartenFeldFehler} from '../app/kern/karte/karten-daten.ts';

const basis = catalog.find(t => t.id === 'animal-african-savanna-elephant');
const frage = n => ({id: 'x:rate-' + n, prompt: 'Frage ' + n + '?', answers: ['A', 'B', 'C'], correct: 0, why: 'Weil A.', hint: 'Denk an A.'});

test('kartenFeldFehler meldet kaputte neue Felder', () => {
  const heil = {
    ...basis,
    id: 'x',
    chapters: [{question: 'Wie?', text: 'So.'}],
    claims: [{id: 'x:stimmt-1', text: 'Elefanten können springen.', isTrue: false, explanation: 'Sie heben nie alle vier Füße zugleich.'}],
    moreQuestions: [frage(1)],
  };
  assert.deepEqual(kartenFeldFehler(heil), []);
  assert.deepEqual(kartenFeldFehler(basis), [], 'Karte ohne neue Felder ist in Ordnung');

  const fehler = feld => kartenFeldFehler({...heil, ...feld});
  assert.ok(fehler({moreQuestions: [{...frage(1), id: 'x-rate-1'}]}).length > 0, 'falsche Fragen-ID');
  assert.ok(fehler({moreQuestions: [{...frage(1), id: 'y:rate-1'}]}).length > 0, 'Fragen-ID einer anderen Karte');
  assert.ok(fehler({moreQuestions: [{...frage(1), answers: ['A', 'B']}]}).length > 0, 'nur zwei Antworten');
  assert.ok(fehler({moreQuestions: [{...frage(1), correct: 3}]}).length > 0, 'correct außerhalb');
  assert.ok(fehler({moreQuestions: [{...frage(1), hint: ' '}]}).length > 0, 'leerer Hinweis');
  assert.ok(fehler({moreQuestions: [{...frage(1), why: ''}]}).length > 0, 'leere Erklärung');
  assert.ok(fehler({chapters: [1, 2, 3, 4].map(n => ({question: 'F' + n + '?', text: 'T' + n}))}).length > 0, 'vier Häppchen');
  assert.ok(fehler({chapters: []}).length > 0, 'leere Häppchen-Liste');
  assert.ok(fehler({chapters: [{question: 'Wie?', text: ''}]}).length > 0, 'leeres Häppchen');
  assert.ok(fehler({claims: [{...heil.claims[0], id: 'x:stimmt'}]}).length > 0, 'falsche Behauptungs-ID');
  assert.ok(fehler({claims: [{...heil.claims[0], isTrue: 'nein'}]}).length > 0, 'isTrue ist kein Wahrheitswert');
  assert.ok(fehler({claims: [{...heil.claims[0], explanation: ''}]}).length > 0, 'leere Auflösung');
});

test('alle Karten haben wohlgeformte neue Felder', () => {
  const kaputt = catalog.map(t => [t.id, kartenFeldFehler(t)]).filter(([, fehler]) => fehler.length);
  assert.deepEqual(kaputt, []);
});

test('neue IDs sind eindeutig und gleichen keiner Challenge-ID', () => {
  const ids = catalog.flatMap(t => [
    t.id,
    t.id + ':mini', // Die Startfrage zählt in der Wissens-Challenge unter dieser ID (knowledge-challenge.ts).
    ...(t.challenges ?? []).map(q => q.id),
    ...(t.moreQuestions ?? []).map(q => q.id),
    ...(t.claims ?? []).map(c => c.id),
  ]);
  const doppelt = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual(doppelt, []);
});

// Aufgabe 9 (6.8): Jede Karte hat mindestens eine erklärte Verbindung zu einer anderen Karte.
const {connections: verbindungen} = JSON.parse(fs.readFileSync(new URL('../app/world-connections.json', import.meta.url), 'utf8'));
const kartenIds = new Set(catalog.map(t => t.id));
const ARTEN = ['needs', 'energy', 'partnership', 'transport', 'recycling', 'habitat', 'exploration', 'cause', 'context', 'compare', 'uses', 'evidence'];

test('jede Karte hat mindestens eine erklärte Verbindung', () => {
  const verbunden = new Set(verbindungen.flatMap(v => [v.fromId, v.toId]));
  assert.deepEqual(catalog.filter(t => !verbunden.has(t.id)).map(t => t.id), []);
});

test('Verbindungen zeigen auf echte Karten, mit bekannter Art und ohne doppeltes Paar', () => {
  const paare = verbindungen.map(v => [v.fromId, v.toId].sort().join('|'));
  assert.deepEqual(verbindungen.filter(v => !kartenIds.has(v.fromId) || !kartenIds.has(v.toId) || v.fromId === v.toId).map(v => v.id), []);
  assert.deepEqual(verbindungen.filter(v => !ARTEN.includes(v.kind)).map(v => v.id), []);
  assert.deepEqual(paare.filter((paar, index) => paare.indexOf(paar) !== index), []);
  assert.equal(new Set(verbindungen.map(v => v.id)).size, verbindungen.length);
});

test('neue und durchgesehene Verbindungen (ab 22.11.2026) sind kurz und kindgerecht erklärt', () => {
  // Ältere Einträge behalten ihre IDs (animal-inquiry-…, animal-expansion-…, history-evidence-…); neue heißen a--b.
  const alteForm = /^(animal-inquiry|animal-expansion|history-evidence)-/;
  // Ein Datum wie „3. Oktober“ beendet keinen Satz.
  const ohneDatum = text => text.replace(/(\d)\.(?=\s+(Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\b)/g, '$1');
  const saetze = text => (ohneDatum(text).match(/[.!?](\s|$)/g) ?? []).length;
  const fehler = verbindungen.filter(v => v.checkedAt >= '2026-11-22').flatMap(v => [
    ...(v.id === v.fromId + '--' + v.toId || alteForm.test(v.id) ? [] : [v.id + ': ID nicht a--b']),
    ...(v.why.length > 50 ? [] : [v.id + ': Satz zu kurz']),
    ...(saetze(v.why) <= 2 ? [] : [v.id + ': mehr als zwei Sätze']),
    ...(/nicht\b[^.]*\bsondern\b/i.test(v.why) ? [v.id + ': „nicht …, sondern …“'] : []),
  ]);
  assert.deepEqual(fehler, []);
});

// Aufgabe 10 (A2): Aufräumen über alle Karten.
test('kein Steckbrief-Eintrag wiederholt wörtlich einen Abschnitt', () => {
  const doppelt = catalog.flatMap(t => {
    const text = [t.intro, ...(t.paragraphs ?? []), ...(t.more ?? [])].join('\n');
    return (t.facts ?? []).filter(f => f.text && text.includes(f.text)).map(f => t.id + ': ' + f.label);
  });
  assert.deepEqual(doppelt, []);
});

test('kein „Schon gewusst?“-Satz steht auf mehr als einer Karte', () => {
  const karten = new Map();
  for (const t of catalog) if (t.surprise) karten.set(t.surprise, [...(karten.get(t.surprise) ?? []), t.id]);
  assert.deepEqual([...karten.values()].filter(ids => ids.length > 1), []);
});

test('keine Rate-mal-Frage verweist auf Text', () => {
  // „nach oben“ oder „oben über“ sind Richtungen, kein Verweis auf den Text.
  const verweis = /beschrieben|\b(wie|siehe) oben\b|oben (genannt|stehend)|im Text|diese[rn]? Karte/i;
  const fragen = t => [t.question, ...(t.moreQuestions ?? [])].filter(Boolean);
  assert.deepEqual(catalog.filter(t => fragen(t).some(q => verweis.test(q.prompt))).map(t => t.id), []);
});

test('keine Erwachsenensätze im Kinderteil', () => {
  // Gesucht in intro, paragraphs, more, facts, surprise und den Texten der Erfindungsschritte
  // (die Karte zeigt sie alle); Muster und Treffer stehen im Ledger von Aufgabe 10.
  // Solche Hinweise gehören in sourceNote („Für Erwachsene“).
  const erwachsen = /Zeitanker|Modellgrenze|zurückdatiert|Lernziel|Lernmodell|Vorläufer und Weiterentwicklungen|Forscherblick/;
  const funde = catalog.flatMap(t => [
    t.intro, ...(t.paragraphs ?? []), ...(t.more ?? []), ...(t.facts ?? []).flatMap(f => [f.label, f.text]), t.surprise,
    ...(t.invention?.stages ?? []).map(s => s.text),
  ].filter(text => text && erwachsen.test(text)).map(text => t.id + ': ' + text.slice(0, 50)));
  assert.deepEqual(funde, []);
});

test('„Schon gewusst?“ wiederholt keinen Satz der Karte', () => {
  // Die Überraschung soll neu sein: kein Satz daraus steht schon in Einleitung, Abschnitten, „Mehr erfahren“ oder Steckbrief.
  const saetze = text => text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 15);
  const doppelt = catalog.filter(t => t.surprise).flatMap(t => {
    const rest = [t.intro, ...(t.paragraphs ?? []), ...(t.more ?? []), ...(t.facts ?? []).map(f => f.text)].filter(Boolean).join(' ');
    return saetze(t.surprise).filter(s => rest.includes(s)).map(s => t.id + ': ' + s);
  });
  assert.deepEqual(doppelt, []);
});

test('wrongReasons passt zu den Antworten', () => {
  const falsch = catalog.filter(t => t.questionFeedback?.wrongReasons && t.questionFeedback.wrongReasons.length !== t.question?.answers.length);
  assert.deepEqual(falsch.map(t => t.id), []);
});

// Aufgabe 11 (A1, A3, A4, B7 Stufe 2): zwölf Pilot-Karten mit Häppchen, „Stimmt das?“ und Zusatzfragen.
const PILOT = [
  'animal-african-savanna-elephant', 'animal-polar-bear', 'animal-common-octopus',
  'science-water-cycle', 'science-moon-phases',
  'person-marie_curie', 'person-jane_goodall',
  'building-giza-pyramids', 'building-eiffel-tower',
  'history-stone_tools', 'history-apollo11',
  'invention-bicycle',
];
// Sätze: Trennung nach . ! oder ? vor Leerzeichen oder Ende; Wörter: Trennung an Leerraum.
const saetze = text => text.trim().split(/(?<=[.!?])(?:\s+|$)/).filter(s => s.trim());
const woerter = text => text.trim().split(/\s+/).filter(Boolean);
const pilotKarte = id => catalog.find(t => t.id === id);

test('Pilot-Karten haben Häppchen, eine Behauptung und zwei bis drei Zusatzfragen', () => {
  const unvollstaendig = PILOT.filter(id => {
    const t = pilotKarte(id);
    return !t || !(t.chapters?.length >= 1) || t.claims?.length !== 1 || !(t.moreQuestions?.length >= 2 && t.moreQuestions.length <= 3);
  });
  assert.deepEqual(unvollstaendig, []);
  const zusatz = PILOT.reduce((summe, id) => summe + pilotKarte(id).moreQuestions.length, 0);
  assert.ok(zusatz >= 25 && zusatz <= 35, zusatz + ' Zusatzfragen statt 25 bis 35');
});

test('Pilot-Karten halten das Längen-Budget', () => {
  const funde = PILOT.map(pilotKarte).flatMap(t => {
    const f = [];
    if (saetze(t.intro).length !== 1) f.push('Einstieg hat nicht genau 1 Satz');
    [t.question, ...(t.moreQuestions ?? [])].forEach((q, i) => {
      if (woerter(q.prompt).length > 10) f.push(`Frage ${i}: mehr als 10 Wörter`);
      if (q.answers.length !== 3) f.push(`Frage ${i}: nicht 3 Antworten`);
      if (saetze(q.why).length > 2) f.push(`Frage ${i}: Erklärung länger als 2 Sätze`);
    });
    (t.claims ?? []).forEach(c => { if (saetze(c.explanation).length > 2) f.push(c.id + ': Auflösung länger als 2 Sätze'); });
    const kapitel = t.chapters ?? [];
    if (kapitel.length > 3) f.push('mehr als 3 Häppchen');
    kapitel.forEach((k, i) => { if (saetze(k.text).length > 2) f.push(`Häppchen ${i}: mehr als 2 Sätze`); });
    if (t.facts.length > 5) f.push('Steckbrief mit mehr als 5 Zeilen');
    if (t.surprise && saetze(t.surprise).length !== 1) f.push('„Schon gewusst?“ hat nicht genau 1 Satz');
    const offen = [
      t.intro, t.question.prompt, ...t.question.answers,
      ...kapitel.flatMap(k => [k.question, k.text]),
      ...t.facts.flatMap(x => [x.label, x.text]),
      t.surprise ?? '', ...(t.claims ?? []).map(c => c.text),
    ].join(' ');
    if (woerter(offen).length > 140) f.push(`offener Teil ${woerter(offen).length} Wörter (höchstens 140)`);
    return f.map(text => t.id + ': ' + text);
  });
  assert.deepEqual(funde, []);
});

test('richtige Antwort der Zusatzfragen ist nicht als einzige die längste', () => {
  const funde = catalog.flatMap(t => (t.moreQuestions ?? []).filter(q => {
    const laenge = q.answers.map(a => a.length);
    return laenge.every((l, i) => i === q.correct || l < laenge[q.correct]);
  }).map(q => q.id));
  assert.deepEqual(funde, []);
});

// Über der Auflösung steht schon „Das stimmt.“ oder „Das stimmt nicht.“ (stimmt-das.tsx).
// Beginnt auch der Text so, liest das Kind dieselbe Aussage zweimal (Design-Prüfung 22.11.2026).
test('Auflösung von „Stimmt das?“ wiederholt nicht die Überschrift', () => {
  const funde = catalog.flatMap(t => (t.claims ?? []).filter(c => /^(das\s+)?stimmt\b/i.test(c.explanation.trim())).map(c => c.id));
  assert.deepEqual(funde, []);
});

test('neue Fragen- und Behauptungs-IDs sind stabil eingetragen', () => {
  // Pass-Einträge hängen an diesen IDs (review, gameSessions); die Liste darf nur wachsen.
  const stabil = JSON.parse(fs.readFileSync(new URL('./fixtures/stable-ids.json', import.meta.url), 'utf8'))['world-card-extras'];
  assert.ok(Array.isArray(stabil), 'stable-ids.json braucht die Familie world-card-extras');
  const neu = catalog.flatMap(t => [...(t.moreQuestions ?? []), ...(t.claims ?? [])].map(x => x.id));
  assert.deepEqual(neu.filter(id => !stabil.includes(id)), [], 'neue ID fehlt in stable-ids.json');
  assert.deepEqual(stabil.filter(id => !neu.includes(id)), [], 'eingetragene ID gibt es nicht mehr');
});
