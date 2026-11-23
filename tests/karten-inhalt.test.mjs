// Die neuen Felder der Wissenskarte (chapters, claims, moreQuestions) sind wohlgeformt,
// und ihre IDs stoßen mit keiner vorhandenen ID zusammen (Pass-Einträge hängen an diesen IDs).
import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../app/world-catalog.json' with {type: 'json'};
import {ganzEinfachImAusprobieren, kartenFeldFehler} from '../app/kern/karte/karten-daten.ts';

const basis = catalog.find(t => t.id === 'animal-african-savanna-elephant');
const frage = n => ({id: 'x:rate-' + n, level: 'entdecker', prompt: 'Frage ' + n + '?', answers: ['Mond', 'Sonne', 'Wolke'], correct: 0, why: 'Weil er leuchtet.', hint: 'Schau nach oben.'});

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
  assert.ok(fehler({moreQuestions: [{...frage(1), answers: ['Mond', 'Sonne']}]}).length > 0, 'nur zwei Antworten');
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

test('kartenFeldFehler: Häppchen und Personen mit „Ganz einfach“ brauchen „Ausprobieren“', () => {
  // Karten mit Häppchen und Personenkarten zeigen den Satz learning.starter oben in „Ausprobieren“ (große Prüfung,
  // Aufgabe 13; Teilschritt 3, E12). Hätte so eine Karte kein „Ausprobieren“, ginge der Satz verloren.
  const feuer = catalog.find(t => t.id === 'history-fire');
  const lernhilfen = {starter: 'Schau genau hin.', observe: 'Was siehst du?', benefit: 'Du kannst beobachten.'};
  const ohneAusprobieren = {...feuer, chapters: [{question: 'Wie?', text: 'So.'}], learning: lernhilfen};
  assert.ok(kartenFeldFehler(ohneAusprobieren).some(f => f.includes('Ausprobieren')), 'Satz ohne Platz wird gemeldet');
  assert.deepEqual(kartenFeldFehler({...ohneAusprobieren, chapters: undefined}), [], 'ohne Häppchen steht der Satz in „Kurz erklärt“');
  assert.deepEqual(kartenFeldFehler({...basis, chapters: [{question: 'Wie?', text: 'So.'}], learning: lernhilfen}), [], 'mit Ausprobieren in Ordnung');
  assert.ok(kartenFeldFehler({...feuer, category: 'people', learning: lernhilfen}).some(f => f.includes('Ausprobieren')), 'Person ohne Ausprobieren wird gemeldet');
  assert.deepEqual(kartenFeldFehler({...feuer, learning: {starter: 'Schau genau hin.'}}), [], '„Selbst beobachten“ und Lernziel sind freiwillig');
  assert.ok(kartenFeldFehler({...feuer, learning: {observe: 'Was siehst du?'}}).some(f => f.includes('starter')), 'Lernhilfen ohne „Ganz einfach“ werden gemeldet');
  assert.ok(kartenFeldFehler({...feuer, learning: {starter: 'Schau genau hin.', observe: ' '}}).some(f => f.includes('observe')), 'leeres observe wird gemeldet');
  assert.ok(kartenFeldFehler({...feuer, learning: {starter: 'Schau genau hin.', benefit: ''}}).some(f => f.includes('benefit')), 'leeres benefit wird gemeldet');
});

test('ganzEinfachImAusprobieren: Häppchen und Personen oben in „Ausprobieren“, sonst offen in „Kurz erklärt“', () => {
  const satz = {learning: {starter: 'Schau genau hin.'}};
  assert.equal(ganzEinfachImAusprobieren({...satz, category: 'science'}), false);
  assert.equal(ganzEinfachImAusprobieren({...satz, category: 'science', chapters: []}), true);
  assert.equal(ganzEinfachImAusprobieren({...satz, category: 'people'}), true);
  assert.equal(ganzEinfachImAusprobieren({category: 'people'}), false, 'ohne Satz nirgends');
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
  // Die Überraschung soll neu sein: kein Satz daraus steht schon in Einleitung, Abschnitten, „Mehr erfahren“, Steckbrief
  // oder „Ganz einfach“ (bei 21 Karten war es wörtlich derselbe Satz; er wurde gestrichen, BACKLOG).
  const saetze = text => text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 15);
  const doppelt = catalog.filter(t => t.surprise).flatMap(t => {
    const rest = [t.intro, ...(t.paragraphs ?? []), ...(t.more ?? []), ...(t.facts ?? []).map(f => f.text), t.learning?.starter].filter(Boolean).join(' ');
    return saetze(t.surprise).filter(s => rest.includes(s)).map(s => t.id + ': ' + s);
  });
  assert.deepEqual(doppelt, []);
});

// „Ganz einfach“ steht genau einmal auf der Karte. Der Browser-Test (karte-hilfen.mjs, ganzEinfach) sieht nur die
// Karten, die eine Suite öffnet, und die 21 doppelten Wissenschaftskarten fielen erst in der Vollprüfung auf
// (23.11.2026). Dieser Datentest deckt alle Karten in Millisekunden ab.
// Auch nicht in der Einleitung: Seit Teilschritt 3 (E12) stehen beide offen übereinander. Bei 24 Tierkarten war es derselbe
// Satz; sie bekamen neue Einleitungen.
test('„Ganz einfach“ steht nicht noch einmal wörtlich auf der Karte', () => {
  const gleich = text => (text ?? '').replace(/\s+/g, ' ').trim();
  // Alle Texte, die die Karte zeigen kann, außer „Ganz einfach“ selbst und der Einleitung.
  const texteOhneEinleitung = t => [
    ...(t.paragraphs ?? []), ...(t.more ?? []), t.surprise, t.learning?.observe, t.learning?.benefit,
    ...(t.facts ?? []).map(f => f.text), ...(t.chapters ?? []).map(c => c.text),
    ...(t.claims ?? []).flatMap(c => [c.text, c.explanation]),
    ...[t.question, ...(t.moreQuestions ?? [])].filter(Boolean).flatMap(q => [q.prompt, q.why, q.hint]),
  ];
  const mitStarter = catalog.filter(t => t.learning?.starter);
  const enthaelt = (texte, t) => texte.some(text => gleich(text).includes(gleich(t.learning.starter)));
  const sonstwo = mitStarter.filter(t => enthaelt(texteOhneEinleitung(t), t)).map(t => t.id);
  assert.deepEqual(sonstwo, [], 'doppelt außerhalb der Einleitung');
  const inEinleitung = mitStarter.filter(t => enthaelt([t.intro], t)).map(t => t.id);
  assert.deepEqual(inEinleitung, [], 'doppelt in der Einleitung');
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

// Seit Teilschritt 3 hat jede Pilot-Karte auch eine Experten-Frage: zwei bis vier sichtbare Zusatzfragen (ruhende zählen nicht).
const sichtbar = t => (t.moreQuestions ?? []).filter(q => !q.ruht);
test('Pilot-Karten haben Häppchen, eine Behauptung und zwei bis vier Zusatzfragen', () => {
  const unvollstaendig = PILOT.filter(id => {
    const t = pilotKarte(id);
    return !t || !(t.chapters?.length >= 1) || t.claims?.length !== 1 || !(sichtbar(t).length >= 2 && sichtbar(t).length <= 4);
  });
  assert.deepEqual(unvollstaendig, []);
  const zusatz = PILOT.reduce((summe, id) => summe + sichtbar(pilotKarte(id)).length, 0);
  assert.ok(zusatz >= 35 && zusatz <= 48, zusatz + ' Zusatzfragen statt 35 bis 48');
});

test('Pilot-Karten halten das Längen-Budget', () => {
  const funde = PILOT.map(pilotKarte).flatMap(t => {
    const f = [];
    if (saetze(t.intro).length !== 1) f.push('Einstieg hat nicht genau 1 Satz');
    // Teilschritt 3: Entdecker und Profi höchstens 10 Wörter; Experte darf eine kleine Denkaufgabe stellen (höchstens 30 Wörter).
    // Antworten: Hauptfrage und Entdecker 3, Profi und Experte 4.
    [{...t.question, level: 'entdecker'}, ...sichtbar(t)].forEach((q, i) => {
      if (woerter(q.prompt).length > (q.level === 'experte' ? 30 : 10)) f.push(`Frage ${i}: zu viele Wörter für ${q.level}`);
      if (q.answers.length !== (q.level === 'entdecker' ? 3 : 4)) f.push(`Frage ${i}: falsche Antwortzahl für ${q.level}`);
      // Auf Experte erklärt die Auflösung einen Denkweg: bis zu 3 Sätze; sonst höchstens 2.
      if (saetze(q.why).length > (q.level === 'experte' ? 3 : 2)) f.push(`Frage ${i}: Erklärung zu lang für ${q.level}`);
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

// Teilschritt 3, E9: Ratemuster je Gruppe. Die richtige Antwort ist höchstens in 45 % der Fragen die einzige längste
// und höchstens in 45 % die einzige kürzeste (Zeichen). Bei den Zusatzfragen außerdem mindestens 15 % die einzige
// längste: Die frühere Regel „nie die längste“ war selbst ein Ratemuster (Befund 4 des stufen-pruefer).
function muster(fragen) {
  let lang = 0, kurz = 0;
  for (const q of fragen) {
    const l = q.answers.map(a => a.length), r = l[q.correct];
    if (l.every((x, i) => i === q.correct || x < r)) lang++;
    if (l.every((x, i) => i === q.correct || x > r)) kurz++;
  }
  return {lang: lang / fragen.length, kurz: kurz / fragen.length};
}
test('Ratemuster der Zusatzfragen: richtige Antwort nicht auffällig lang oder kurz', () => {
  const m = muster(catalog.flatMap(t => (t.moreQuestions ?? []).filter(q => !q.ruht)));
  assert.ok(m.lang <= 0.45 && m.kurz <= 0.45 && m.lang >= 0.15, JSON.stringify(m));
});
test('Ratemuster der Challenge-Fragen: richtige Antwort nicht auffällig lang oder kurz', () => {
  const m = muster(catalog.flatMap(t => (t.challenges ?? []).filter(q => !q.ruht)));
  assert.ok(m.lang <= 0.45 && m.kurz <= 0.45, JSON.stringify(m));
});
test('Mutationsprobe: muster erkennt „immer die längste“ und „nie die längste“', () => {
  const q = (answers, correct) => ({answers, correct});
  assert.deepEqual(muster([q(['lang lang', 'a', 'b'], 0), q(['x', 'lang lang'], 1)]), {lang: 1, kurz: 0});
  assert.deepEqual(muster([q(['a', 'lang lang', 'b'], 0), q(['x', 'yy'], 0)]), {lang: 0, kurz: 0.5});
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
  const neu = catalog.flatMap(t => [...(t.moreQuestions ?? []), ...(t.claims ?? []), ...(t.ordnen ? [t.ordnen] : [])].map(x => x.id));
  assert.deepEqual(neu.filter(id => !stabil.includes(id)), [], 'neue ID fehlt in stable-ids.json');
  assert.deepEqual(stabil.filter(id => !neu.includes(id)), [], 'eingetragene ID gibt es nicht mehr');
});

// Teilschritt 3, Aufgabe 5 (E5, E6, E11): Stufen, Antwortzahl, Tipps und „warum nicht“; „Fast richtig“ und „Ordne richtig“.
// Eine Karte ohne die neuen Felder, damit nur der geprüfte Teil zählt.
const ohneNeues = (({moreQuestions, claims, chapters, challenges, ordnen, ...rest}) => rest)(basis);
test('kartenFeldFehler: Stufe, Antwortzahl, Tipps und „warum nicht“ der Zusatz- und Challenge-Fragen', () => {
  const q = extra => ({id: 'x:rate-1', prompt: 'Was leuchtet nachts?', answers: ['Mond', 'Sonne', 'Wolke'], correct: 0, why: 'Er spiegelt Licht.', hints: ['Schau nach oben.'], level: 'entdecker', ...extra});
  const mit = extra => kartenFeldFehler({...ohneNeues, id: 'x', moreQuestions: [q(extra)]});
  const vier = {answers: ['Mond', 'Sonne', 'Wolke', 'Regen']};
  assert.deepEqual(mit({}), [], 'Entdecker mit drei Antworten');
  assert.deepEqual(mit({level: 'profi', ...vier}), [], 'Profi mit vier');
  assert.deepEqual(mit({level: 'experte', ...vier, hints: ['Was ist nachts am Himmel?', 'Es ist rund.']}), [], 'Experte mit zwei Tipps');
  assert.deepEqual(mit({hints: undefined, hint: 'Schau nach oben.'}), [], 'altes Feld hint');
  assert.deepEqual(mit({wrongReasons: [null, 'Sie scheint am Tag.', 'Sie leuchtet nicht.']}), [], 'passende Sätze „warum nicht“');
  assert.ok(mit({level: undefined}).length > 0, 'ohne Stufe');
  assert.ok(mit({level: 'meister'}).length > 0, 'unbekannte Stufe');
  assert.ok(mit({level: 'profi'}).length > 0, 'Profi mit drei Antworten');
  assert.ok(mit(vier).length > 0, 'Entdecker mit vier Antworten');
  assert.ok(mit({level: 'experte', ...vier}).length > 0, 'Experte mit nur einem Tipp');
  assert.ok(mit({hints: ['Es ist der Mond.']}).length > 0, 'Tipp nennt die Lösung');
  assert.ok(mit({hints: []}).length > 0, 'kein Tipp');
  assert.ok(mit({wrongReasons: [null, 'Sie scheint am Tag.']}).length > 0, 'zu wenige Sätze');
  assert.ok(mit({wrongReasons: ['Falsch.', 'Sie scheint am Tag.', 'Sie leuchtet nicht.']}).length > 0, 'Satz bei der richtigen Antwort');
  assert.ok(mit({wrongReasons: [null, 'Der Mond ist es.', 'Sie leuchtet nicht.']}).length > 0, 'Satz nennt die Lösung');
  const challenge = extra => kartenFeldFehler({...ohneNeues, id: 'x', challenges: [{id: 'x-1', difficulty: 'medium', prompt: 'Was leuchtet nachts?', answers: ['Mond', 'Sonne', 'Wolke', 'Regen'], correct: 0, why: 'Er spiegelt Licht.', level: 'profi', ...extra}]});
  assert.deepEqual(challenge({}), [], 'Challenge-Frage auf Profi');
  assert.ok(challenge({level: undefined}).length > 0, 'Challenge-Frage ohne Stufe');
  assert.ok(challenge({answers: ['Mond', 'Sonne', 'Wolke']}).length > 0, 'Challenge-Frage auf Profi mit drei Antworten');
});

test('kartenFeldFehler: „Fast richtig“ und „Ordne richtig“', () => {
  const behauptung = extra => ({id: 'x:stimmt-1', text: 'Marie Curie hat das Radium erfunden.', isTrue: false, explanation: 'Sie hat es entdeckt.', ...extra});
  const fast = {wort: 'erfunden', woerter: ['Marie Curie', 'Radium', 'erfunden'], ersatz: 'entdeckt', aufloesung: 'Radium steckte schon im Gestein.'};
  const mitFast = extra => kartenFeldFehler({...ohneNeues, id: 'x', claims: [behauptung({fastRichtig: {...fast, ...extra}})]});
  assert.deepEqual(mitFast({}), []);
  assert.ok(kartenFeldFehler({...ohneNeues, id: 'x', claims: [behauptung({isTrue: true, fastRichtig: fast})]}).length > 0, 'nur bei falschen Behauptungen');
  assert.ok(mitFast({wort: 'Gestein'}).length > 0, 'falsches Wort steht nicht zur Auswahl');
  assert.ok(mitFast({woerter: ['Marie Curie', 'Polonium', 'erfunden']}).length > 0, 'Wort steht nicht in der Behauptung');
  assert.ok(mitFast({woerter: ['Radium', 'erfunden']}).length > 0, 'zu wenige Wörter');
  assert.ok(mitFast({ersatz: ''}).length > 0, 'Ersatzwort fehlt');
  const ordnen = extra => kartenFeldFehler({...ohneNeues, id: 'x', ordnen: {id: 'x:ordnen-1', level: 'experte', frage: 'Was war zuerst?', teile: ['Erst', 'Dann', 'Zuletzt', 'Ganz zuletzt'], hints: ['Vergleiche die Zahlen.', 'Millionen sind mehr als Tausende.'], aufloesung: 'So war es.', ...extra}});
  assert.deepEqual(ordnen({}), []);
  assert.ok(ordnen({id: 'x:ordne-1'}).length > 0, 'falsche ID');
  assert.ok(ordnen({teile: ['Erst', 'Dann']}).length > 0, 'zu wenige Teile');
  assert.ok(ordnen({teile: ['Erst', 'Erst', 'Dann']}).length > 0, 'doppelte Teile');
  assert.ok(ordnen({level: 'meister'}).length > 0, 'unbekannte Stufe');
  assert.ok(ordnen({aufloesung: ''}).length > 0, 'Auflösung fehlt');
});
