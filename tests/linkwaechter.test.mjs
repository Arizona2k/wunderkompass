// Linkwächter: Jedes Ziel, auf das die App verweist, muss es geben.
// Frage des Nutzers (23.11.2026): „Die Seite wächst und wächst – prüft etwas die Verknüpfungen von Suchleiste,
// Spielen, Themen, Begriffen und Wörtern?“ Viele Bausteine lassen ein fehlendes Ziel still weg oder zeigen
// „gibt es hier nicht“. Ein Kind fände dann eine Sackgasse, und kein Test schlüge an.
// Dieser Test sammelt die Ziele aus Daten und Code und prüft, dass jedes existiert.
// Ob eine Verbindung fachlich stimmt, prüfen fakten-pruefer und kinder-redaktion, nicht dieser Test.
// Neue Art von Verweis: hier eine Quelle ergänzen. Landkarte aller Quellen: docs/entwurf/2026-11-24-linkwaechter-landkarte.md.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {sourceConstant} from '../scripts/source-constant.mjs';
import {WORLD_CATEGORIES, WORLD_INDEX, WORLD_PLACES, WORLD_ROUTES} from '../app/world-index.ts';
import {GLOSSARY, JOURNEYS, WHY_QUESTIONS} from '../app/learning-data.ts';
import {EXPERIMENT_SEARCH, LAB_SEARCH, RESEARCH_PATHS} from '../app/research-catalog.ts';
import {RESEARCH_LINK_REASONS} from '../app/research-links.ts';
import {MISSION_RESEARCH} from '../app/mission-research.ts';
import {CHAPTER_LINKS} from '../app/journey-links.ts';
import {DISCOVERY_ACTIVITIES, DISCOVERY_CONNECTIONS} from '../app/discovery-data.ts';
import {HOME_MOTIFS} from '../app/discovery-selection.ts';
import {NATURE, PLATE_POINTS, naturAtlasZiel} from '../app/nature-data.ts';
import {CONTINENTS, LINES, OCEANS} from '../app/earth-data.ts';
import {BEREICHE} from '../app/kern/bereiche.ts';
import {bookLookup} from '../app/book-location.ts';

const json = datei => JSON.parse(fs.readFileSync(datei, 'utf8'));
const appDateien = muster => fs.readdirSync('app').filter(name => muster.test(name)).map(name => 'app/' + name);

// Was es gibt.
const KARTEN = new Set(WORLD_INDEX.map(karte => karte.id));
const WELTEN = new Set(WORLD_CATEGORIES.map(welt => welt.id));
const LERNROUTEN = new Set(WORLD_ROUTES.map(route => route.id));
const KAPITEL_JE_REISE = new Map(JOURNEYS.map(reise => [reise.id, reise.steps.length]));
const LABORE = new Set(sourceConstant('app/research-labs.tsx', 'LABS').map(labor => labor.id));
const VERSUCHE = new Set(sourceConstant('app/research-labs.tsx', 'EXPERIMENT_IDS'));
const WOERTER = new Set(GLOSSARY.map(([wort]) => wort));
const WARUM_FRAGEN = new Set(WHY_QUESTIONS.map(([frage]) => frage));
const NATURORTE = new Set(NATURE.map(ort => ort.id));
const SPIELE = {
  classic: new Set(sourceConstant('app/learning-games.tsx', 'GAMES').map(spiel => spiel.id)),
  extra: new Set(sourceConstant('app/advanced-games.tsx', 'EXTRA_GAMES').map(spiel => spiel.id)),
  world: new Set(sourceConstant('app/world-games.tsx', 'WORLD_GAMES').map(spiel => spiel.id)),
};
const BEREICHE_DER_APP = new Set(sourceConstant('app/earth-explorer.tsx', 'MODES'));
const BUCH_REITER = new Set(['words', 'why', 'notes', 'nature', 'atlas']);

// null, wenn die App die Adresse (ohne #) anzeigen kann, sonst der Grund.
function adressFehler(adresse) {
  const [bereich, ...teile] = adresse.split('/');
  if (bereich === 'news') return null; // alte Nachrichten-Links führen zur Startseite (hash-route.ts)
  if (bereich === 'updates') return teile.length ? 'unbekannte Unteradresse' : null;
  if (!BEREICHE_DER_APP.has(bereich)) return 'unbekannter Bereich';
  if (!teile.length) return null;
  if (bereich === 'world') {
    const [art, id, seite, ...rest] = teile;
    if (art === 'topic') return teile.length === 2 && KARTEN.has(id) ? null : 'Karte fehlt';
    if (art === 'route') return teile.length === 2 && LERNROUTEN.has(id) ? null : 'Lernroute fehlt';
    if (!WELTEN.has(art)) return 'Welt fehlt';
    return teile.length === 1 || (id === 'page' && /^\d+$/.test(seite) && !rest.length) ? null : 'unbekannte Weltseite';
  }
  if (bereich === 'journeys') {
    const [id, seite, ...rest] = teile, kapitel = KAPITEL_JE_REISE.get(id);
    if (!kapitel) return 'Reise fehlt';
    // Seite 1 bis Kapitelzahl, dazu die Abschlussseite.
    return seite === undefined || (!rest.length && /^\d+$/.test(seite) && seite >= 1 && seite <= kapitel + 1) ? null : 'Kapitel fehlt';
  }
  if (bereich === 'labs') {
    if (teile[0] === 'experiment') return teile.length === 2 && VERSUCHE.has(teile[1]) ? null : 'Versuch fehlt';
    return teile.length === 1 && LABORE.has(teile[0]) ? null : 'Labor fehlt';
  }
  if (bereich === 'book') {
    if (teile.length === 1 && BUCH_REITER.has(teile[0])) return null;
    const ziel = bookLookup(adresse);
    if (!ziel) return 'unbekannte Buchadresse';
    const vorhanden = {words: WOERTER, why: WARUM_FRAGEN, nature: NATURORTE}[ziel.tab];
    return vorhanden.has(ziel.term) ? null : 'Buchziel fehlt';
  }
  return 'unbekannte Unteradresse';
}

// Sammelt Verweise als [Quelle, Ziel, Grund]; prüft am Ende, dass keiner fehlt, und nennt alle fehlenden auf einmal.
function pruefliste() {
  const fehlend = [];
  return {
    ziel(quelle, wert, vorhanden, art) { if (!vorhanden.has(wert)) fehlend.push(`${quelle} → ${wert} (${art} fehlt)`); },
    adresse(quelle, adresse) { const grund = adressFehler(adresse); if (grund) fehlend.push(`${quelle} → #${adresse} (${grund})`); },
    fertig() { assert.deepEqual(fehlend, [], 'Verweise ins Leere:\n' + fehlend.join('\n')); },
  };
}

// Feste Ziele im Programmtext, nur in eindeutigen Zusammenhängen: Adressen mit #, navigateHash, goMode mit Ziel,
// Kartenaufrufe, topic-Felder und Listen aus lauter Karten-IDs. CSS-Klassen wie "animal-inquiry" bleiben außen vor.
const QUELLTEXT = fs.readdirSync('app', {recursive: true})
  .filter(name => /\.(ts|tsx|mjs)$/.test(name))
  .map(name => ['app/' + name, fs.readFileSync('app/' + name, 'utf8')]);
const KARTEN_ID = '(?:' + [...new Set([...KARTEN].map(id => id.split('-')[0]))].join('|') + ')-[a-z0-9_]+(?:-[a-z0-9_]+)*';
// Jede Suche muss etwas finden: Findet ein Muster nach einem Umbau nichts mehr, wäre der Test sonst still grün.
// Gibt es die Stelle wirklich nicht mehr, gehört auch die Suche weg.
function imQuelltext(muster, nurDatei) {
  const funde = [];
  for (const [datei, text] of QUELLTEXT) {
    if (nurDatei && datei !== nurDatei) continue;
    for (const treffer of text.matchAll(muster)) funde.push([datei, treffer[1]]);
  }
  assert.ok(funde.length, `Linkwächter: Suche ${muster}${nurDatei ? ' in ' + nurDatei : ''} findet nichts mehr`);
  return funde;
}

test('Linkwächter erkennt kaputte Adressen (Gegenprobe)', () => {
  for (const gut of ['home', 'updates', 'news/alt', 'world/animals', 'world/animals/page/2', 'world/topic/animal-honey-bee', 'journeys/planet', 'journeys/planet/6', 'labs/moon', 'labs/experiment/lamp-ball', 'book/notes', 'book/nature', 'book/words/Vulkan', 'book/nature/daintree']) {
    assert.equal(adressFehler(gut), null, gut);
  }
  for (const schlecht of ['welt', 'world/topic/gibt-es-nicht', 'world/route/x', 'journeys/planet/7', 'journeys/mars', 'labs/x', 'book/words/Wolke', 'book/nature/capital-harare', 'globe/x', 'updates/x']) {
    assert.notEqual(adressFehler(schlecht), null, schlecht);
  }
});

test('Adressen aus Reisen, Startseite, Bereichsleiste und Programmtext führen zu vorhandenen Zielen', () => {
  const liste = pruefliste();
  for (const [reise, adressen] of Object.entries(CHAPTER_LINKS)) {
    liste.ziel('Kapitel-Verweise', reise, KAPITEL_JE_REISE, 'Reise');
    for (const adresse of adressen) liste.adresse('Reise ' + reise, adresse);
  }
  for (const aktivitaet of DISCOVERY_ACTIVITIES) liste.adresse('Startseite, Mitmachen', aktivitaet.hash);
  for (const bereich of BEREICHE) liste.adresse('Bereichsleiste', bereich.ziel);
  const BEREICH = '(?:' + [...BEREICHE_DER_APP, 'updates'].join('|') + ')';
  for (const [datei, adresse] of [
    // Nur ganze Adressen: Ein Anfang wie 'labs/'+id ist kein Ziel (das Ziel prüfen die Daten-Tests unten).
    ...imQuelltext(new RegExp(`["'\`]#(${BEREICH}(?:/[^"'\`$]*[^"'\`$/])?)["'\`](?!\\s*\\+)`, 'g')),
    ...imQuelltext(/(?:navigateHash|replaceHash)\(\s*["']([^"']+)["']\s*[),]/g),
    ...imQuelltext(/goMode\(\s*["'][a-z]+["']\s*,\s*["']([^"']+)["']\s*\)/g),
  ]) liste.adresse(datei, adresse);
  liste.fertig();
});

test('Karten-IDs im Programmtext gibt es', () => {
  const liste = pruefliste();
  for (const [datei, id] of [
    ...imQuelltext(/(?:onTopic|searchTopic|openTopic)\(\s*["']([^"']+)["']/g),
    ...imQuelltext(new RegExp(`\\btopic\\s*:\\s*["'](${KARTEN_ID})["']`, 'g')),
    ...imQuelltext(/["'`/]world\/topic\/([a-z0-9_-]+)["'`]/g),
  ]) liste.ziel(datei, id, KARTEN, 'Karte');
  const kartenListe = new RegExp(`\\[\\s*((?:["']${KARTEN_ID}["']\\s*,\\s*)+["']${KARTEN_ID}["'])\\s*\\]`, 'g');
  for (const [datei, eintraege] of imQuelltext(kartenListe)) {
    for (const id of eintraege.match(/[a-z0-9_-]+(?=["'])/g)) liste.ziel(datei, id, KARTEN, 'Karte');
  }
  liste.fertig();
});

test('Karten verweisen auf vorhandene Karten, Reisen, Labore und Lernrouten', () => {
  const liste = pruefliste();
  for (const verbindung of json('app/world-connections.json').connections) {
    liste.ziel('Verbindung ' + verbindung.id, verbindung.fromId, KARTEN, 'Karte');
    liste.ziel('Verbindung ' + verbindung.id, verbindung.toId, KARTEN, 'Karte');
  }
  for (const karte of json('app/world-catalog.json')) {
    for (const link of karte.links ?? []) {
      const vorhanden = {journeys: KAPITEL_JE_REISE, labs: LABORE}[link.mode];
      if (!vorhanden) liste.ziel('Karte ' + karte.id, link.mode, new Set(), 'Linkart');
      else liste.ziel('Karte ' + karte.id, link.id, vorhanden, link.mode === 'labs' ? 'Labor' : 'Reise');
    }
  }
  for (const route of WORLD_ROUTES) for (const id of route.topics) liste.ziel('Lernroute ' + route.id, id, KARTEN, 'Karte');
  for (const motiv of HOME_MOTIFS) liste.ziel('Startfrage', motiv.id, KARTEN, 'Karte');
  for (const spur of DISCOVERY_CONNECTIONS) {
    liste.ziel('Wissensspur ' + spur.id, spur.routeId, LERNROUTEN, 'Lernroute');
    for (const id of spur.id.split('--')) liste.ziel('Wissensspur ' + spur.id, id, KARTEN, 'Karte');
  }
  liste.fertig();
});

test('Spiele: Suchindex, „Dazu passt“, Weltmissionen und Spielaufrufe im Programmtext', () => {
  const liste = pruefliste();
  const index = json('app/game-index.json');
  for (const spiel of index) liste.ziel('Suchindex der Spiele', spiel.id, SPIELE[spiel.family] ?? new Set(), 'Spiel ' + spiel.family);
  for (const [familie, ids] of Object.entries(SPIELE)) {
    for (const id of ids) liste.ziel('Spiel ohne Sucheintrag', familie + ':' + id, new Set(index.map(spiel => spiel.family + ':' + spiel.id)), 'Sucheintrag');
  }
  for (const [welt, spiel] of Object.entries(sourceConstant('app/kern/karte/dazu-passt.tsx', 'SPIEL_JE_WELT'))) {
    liste.ziel('Dazu passt', welt, WELTEN, 'Welt');
    liste.ziel('Dazu passt, Welt ' + welt, spiel, SPIELE.world, 'Weltspiel');
  }
  for (const [datei, id] of imQuelltext(/openWorldGame\(\s*["']([^"']+)["']/g)) liste.ziel(datei, id, SPIELE.world, 'Weltspiel');
  for (const [, id] of imQuelltext(/\bgame\s*:\s*["']([^"']+)["']/g, 'app/world-progress.tsx')) {
    liste.ziel('Weltmission', id, SPIELE.world, 'Weltspiel');
  }
  liste.fertig();
});

test('Suche: Startideen, Labore und Versuche haben ein Ziel', () => {
  const liste = pruefliste();
  const quelle = fs.readFileSync('app/global-search.tsx', 'utf8').match(/starters=\[([^\]]+)\]/);
  assert.ok(quelle, 'Startideen der Suche nicht gefunden (app/global-search.tsx, starters)');
  const ziele = {lab: LABORE, topic: KARTEN, area: new Set([...WELTEN, ...BEREICHE_DER_APP]), journey: KAPITEL_JE_REISE};
  for (const eintrag of quelle[1].match(/[a-z]+:[a-z0-9_-]+/g)) {
    const [art, id] = eintrag.split(':');
    liste.ziel('Startidee der Suche', id, ziele[art] ?? new Set(), art);
  }
  for (const labor of LAB_SEARCH) liste.ziel('Suche, Labore', labor.id, LABORE, 'Labor');
  for (const id of LABORE) liste.ziel('Labor ohne Sucheintrag', id, new Set(LAB_SEARCH.map(labor => labor.id)), 'Sucheintrag');
  for (const versuch of EXPERIMENT_SEARCH) liste.ziel('Suche, Versuche', versuch.id, VERSUCHE, 'Versuch');
  for (const id of VERSUCHE) liste.ziel('Versuch ohne Sucheintrag', id, new Set(EXPERIMENT_SEARCH.map(versuch => versuch.id)), 'Sucheintrag');
  liste.fertig();
});

test('Labore verweisen auf vorhandene Karten, Wörter, Reisen, Versuche und Labore', () => {
  const liste = pruefliste();
  for (const [labor, weg] of Object.entries(RESEARCH_PATHS)) {
    const quelle = 'Labor ' + labor;
    liste.ziel('Laborwege', labor, LABORE, 'Labor');
    if (weg.topic) liste.ziel(quelle, weg.topic, KARTEN, 'Karte');
    if (weg.book) liste.ziel(quelle, weg.book, WOERTER, 'Wort');
    if (weg.journey) liste.ziel(quelle, weg.journey, KAPITEL_JE_REISE, 'Reise');
    if (weg.experiment) liste.ziel(quelle, weg.experiment, VERSUCHE, 'Versuch');
    if (weg.next) liste.ziel(quelle, weg.next, LABORE, 'Labor');
  }
  for (const [labor, gruende] of Object.entries(RESEARCH_LINK_REASONS)) {
    liste.ziel('Laborverbindungen', labor, LABORE, 'Labor');
    for (const weitere of gruende.additionalTopics ?? []) liste.ziel('Labor ' + labor, weitere.topic, KARTEN, 'Karte');
  }
  const missionen = sourceConstant('app/earth-explorer.tsx', 'MISSIONS');
  assert.equal(MISSION_RESEARCH.length, missionen.length, 'jede Mini-Mission braucht genau ein Labor (gleiche Reihenfolge)');
  for (const [nummer, mission] of MISSION_RESEARCH.entries()) liste.ziel('Mini-Mission ' + (nummer + 1), mission.lab, LABORE, 'Labor');
  liste.fertig();
});

test('Wissensbuch: Wörter, Warum-Fragen, Naturorte und Wege zu Karten und Reisen', () => {
  const liste = pruefliste();
  const wortOderFrage = (quelle, eintrag) => eintrag.kind === 'why'
    ? liste.ziel(quelle, eintrag.term, WARUM_FRAGEN, 'Warum-Frage')
    : liste.ziel(quelle, eintrag.term, WOERTER, 'Wort');
  for (const datei of appDateien(/^book-.*-content\.json$/)) {
    const paket = json(datei);
    for (const [wort, inhalt] of Object.entries(paket.learning ?? {})) {
      liste.ziel(datei, wort, WOERTER, 'Wort');
      pruefeBuchinhalt(liste, `${datei}, ${wort}`, inhalt);
    }
    for (const [frage, inhalt] of Object.entries(paket.whyLearning ?? {})) {
      liste.ziel(datei, frage, WARUM_FRAGEN, 'Warum-Frage');
      pruefeBuchinhalt(liste, `${datei}, ${frage}`, inhalt);
    }
  }
  for (const datei of [...appDateien(/^book-.*-topic-index\.json$/), 'app/people-book-links.json']) {
    for (const zeile of json(datei)) {
      wortOderFrage(datei, zeile);
      liste.ziel(`${datei}, ${zeile.term}`, zeile.topic, KARTEN, 'Karte');
    }
  }
  for (const datei of appDateien(/^book-.*-word-link-index\.json$/)) {
    for (const [wort, verweise] of Object.entries(json(datei))) {
      liste.ziel(datei, wort, WOERTER, 'Wort');
      for (const verweis of verweise) wortOderFrage(`${datei}, ${wort}`, verweis);
    }
  }
  for (const [wort, orte] of Object.entries(json('app/nature-word-links.json'))) {
    liste.ziel('Naturwörter', wort, WOERTER, 'Wort');
    for (const ort of orte) liste.ziel('Naturwörter, ' + wort, ort.id, NATURORTE, 'Naturort');
  }
  for (const [ort, eintrag] of Object.entries(json('app/nature-learning-content.json'))) {
    liste.ziel('Natur-Vertiefung', ort, NATURORTE, 'Naturort');
    for (const nachbar of eintrag.learning.relatedNature ?? []) liste.ziel('Natur-Vertiefung ' + ort, nachbar.id, NATURORTE, 'Naturort');
    for (const wort of eintrag.learning.relatedWords ?? []) liste.ziel('Natur-Vertiefung ' + ort, wort.term, WOERTER, 'Wort');
  }
  for (const [ort, nachbarn] of Object.entries(json('app/nature-place-links.json'))) {
    liste.ziel('Naturorte', ort, NATURORTE, 'Naturort');
    for (const nachbar of nachbarn) liste.ziel('Naturorte, ' + ort, nachbar.id, NATURORTE, 'Naturort');
  }
  for (const [wort, reise] of Object.entries(sourceConstant('app/knowledge-book.tsx', 'WORD_ROUTES'))) {
    liste.ziel('Wort → Lernreise', wort, WOERTER, 'Wort');
    liste.ziel('Wort → Lernreise, ' + wort, reise, KAPITEL_JE_REISE, 'Reise');
  }
  liste.fertig();
});

function pruefeBuchinhalt(liste, quelle, inhalt) {
  if (inhalt.topic) liste.ziel(quelle, inhalt.topic, KARTEN, 'Karte');
  if (inhalt.word) liste.ziel(quelle, inhalt.word, WOERTER, 'Wort');
  for (const verwandt of inhalt.relatedWords ?? []) liste.ziel(quelle, verwandt.term, WOERTER, 'Wort');
  for (const verwandt of inhalt.relatedQuestions ?? []) liste.ziel(quelle, verwandt.question, WARUM_FRAGEN, 'Warum-Frage');
}

test('Globus: Mini-Missionen und „Im Naturatlas weiterdenken“ führen zu vorhandenen Zielen', () => {
  const liste = pruefliste();
  const laender = new Set(json('public/world.json').features.map(land => land.properties.iso));
  const gebiete = {country: laender, continent: new Set(CONTINENTS.map(ort => ort.id)), ocean: new Set(OCEANS.map(ort => ort.id)), line: new Set(LINES.map(ort => ort.id))};
  for (const mission of sourceConstant('app/earth-explorer.tsx', 'MISSIONS')) {
    liste.ziel('Mini-Mission „' + mission.title + '“', mission.id, gebiete[mission.kind] ?? new Set(), mission.kind);
  }
  const hauptstaedte = json('app/capital-points.json');
  for (const ort of [...NATURE, ...PLATE_POINTS, ...hauptstaedte, ...WORLD_PLACES, ...CONTINENTS, ...OCEANS, ...LINES]) {
    const ziel = naturAtlasZiel(ort);
    if (ziel) liste.adresse('Globus, ' + ort.id, ziel);
  }
  liste.fertig();
  for (const ort of NATURE) assert.ok(naturAtlasZiel(ort), 'jeder Naturort führt in den Naturatlas: ' + ort.id);
});
