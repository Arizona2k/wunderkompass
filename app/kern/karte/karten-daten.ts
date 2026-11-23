// Reine Logik der neuen Wissenskarte. Ohne React, damit Node-Tests die Datei laden können.
// Die Hauptfrage behält ihre alten Schlüssel (world-question:<id>, topicAnswer, items):
// Darunter stehen schon Antworten von Kindern im Pass.
import type {Mode} from '../../earth-data';
import type {LocalProgress} from '../../progress-storage';
import type {WorldPhotoData, WorldQuestion, WorldTopic} from '../../world-types';
import {restoreAnswerWording} from '../../retained-answer-wording.mjs';
import FOTO_IDS from '../../world-photo-ids.json';
import FOTO_KENNWOERTER from './foto-kennwoerter.json';
import BELEGE from './belege-ids.json';
import {STUFEN, STUFEN_NAME, type Stufe} from '../stufe';

export type KartenFrage = {
  id: string;
  reviewId: string;
  answerKey: string;
  itemsKey: string;
  question: WorldQuestion;
  hints: string[];
  // Je Antwort ein Satz, warum sie nicht passt; null bei der richtigen (wie questionFeedback im Katalog).
  wrongReasons?: (string | null)[];
  // Teilschritt 3 (E4, E6): Die Hauptfrage ist Entdecker; Zusatz- und Challenge-Fragen tragen ihre Stufe.
  level: Stufe;
};
type Tippbank = Record<string, {steps: string[]; wrongReasons?: (string | null)[]}>;

// Alle Fragen einer Karte: zuerst die Hauptfrage, dann die Zusatzfragen, dann die Challenge-Fragen, je in Datenreihenfolge.
export function kartenFragen(topic: WorldTopic, hintBank: Tippbank): KartenFrage[] {
  // Hinweise wie auf der alten Karte: Der Hinweis aus questionFeedback ersetzt den ersten Schritt der Bank.
  const bank = hintBank[topic.id + ':mini']?.steps ?? [];
  const feedback = topic.questionFeedback;
  const haupt: KartenFrage = {
    id: topic.id,
    reviewId: 'world-question:' + topic.id,
    answerKey: 'topicAnswer',
    itemsKey: 'items',
    question: topic.question,
    hints: feedback ? [feedback.hint, ...bank.slice(1)] : [...bank],
    ...(feedback ? {wrongReasons: feedback.wrongReasons} : {}),
    level: 'entdecker',
  };
  const schluessel = (id: string) => ({id, reviewId: 'world-question:' + id, answerKey: 'topicAnswer:' + id, itemsKey: 'items:' + id});
  const zusatz = (topic.moreQuestions ?? []).map(({id, hint, hints, level, wrongReasons, prompt, answers, correct, why}): KartenFrage => ({
    ...schluessel(id),
    question: {prompt, answers, correct, why},
    hints: hints ?? (hint ? [hint] : []),
    ...(wrongReasons ? {wrongReasons} : {}),
    level: level ?? 'entdecker',
  }));
  // Die Challenge-Fragen erscheinen auch auf ihrer Karte (B7). Auf der Karte haben sie eigene Schlüssel;
  // in der Wissens-Challenge bleibt ihre Wiederholung challenge:<id>. Ohne Einstufung gelten sie als Profi.
  const challenge = (topic.challenges ?? []).map(({id, level, prompt, answers, correct, why}): KartenFrage => {
    const eintrag = hintBank[id];
    return {
      ...schluessel(id),
      question: {prompt, answers, correct, why},
      hints: [...(eintrag?.steps ?? [])],
      ...(eintrag?.wrongReasons ? {wrongReasons: eintrag.wrongReasons} : {}),
      level: level ?? 'profi',
    };
  });
  return [haupt, ...zusatz, ...challenge];
}

// Die Fragen, die eine Stufe zeigen darf: ihre eigene Stufe zuerst, dann die leichteren; je in Datenreihenfolge.
// „Noch eine Frage“ blättert in genau dieser Liste (bleibt bei der gewählten Stufe und darunter).
export function fragenFuerStufe(fragen: KartenFrage[], stufe: Stufe): KartenFrage[] {
  const rang = (f: KartenFrage) => STUFEN.indexOf(f.level);
  return fragen.filter(f => rang(f) <= STUFEN.indexOf(stufe)).sort((a, b) => rang(b) - rang(a));
}

// Gibt es auf der Karte Fragen genau dieser Stufe? Ohne Experten-Frage spielt ein Experte dort Profi (E3).
export const hatFragenDerStufe = (fragen: KartenFrage[], stufe: Stufe) => fragen.some(f => f.level === stufe);

// Ehrlicher Satz unter der Stufenwahl, wenn die Karte die gewählte Stufe noch nicht hat (E3): Dann spielt das Kind
// die höchste vorhandene Stufe darunter. Keine unechte Experten-Stufe aus „mehr vom Gleichen“.
export function stufenHinweis(fragen: KartenFrage[], stufe: Stufe): string | null {
  if (hatFragenDerStufe(fragen, stufe)) return null;
  const darunter = STUFEN.slice(0, STUFEN.indexOf(stufe)).reverse().find(s => hatFragenDerStufe(fragen, s)) ?? 'entdecker';
  return `${STUFEN_NAME[stufe]} gibt es hier noch nicht. Du spielst ${STUFEN_NAME[darunter]}.`;
}

// Eine gespeicherte Antwortreihe gilt nur, wenn sie genau die heutigen Antworten vertauscht (alte Wörter über ihren Alias).
// Sonst null: Die Karte mischt dann neu, statt in der Reihenfolge der Daten zu zeigen (dort steht die Lösung oft vorn),
// z. B. wenn eine Frage auf Profi eine vierte Antwort bekommen hat (Teilschritt 3, E5).
export function gueltigeReihe(frage: KartenFrage, gespeichert: unknown): string[] | null {
  const antworten = frage.question.answers;
  if (!Array.isArray(gespeichert)) return null;
  const reihe = gespeichert.map(wert => (typeof wert === 'string' ? restoreAnswerWording(frage.id, wert) : wert));
  return reihe.length === antworten.length && new Set(reihe).size === antworten.length && reihe.every(a => antworten.includes(a)) ? reihe : null;
}

// Welche Frage „Rate mal!“ zeigt, unter den Fragen der Stufe (fragenFuerStufe, eigene Stufe zuerst):
// 1. eine Frage, deren gespeicherte Antwort (Kartenstand, gameSessions['topic:<id>']) nicht die richtige ist.
//    Wer falsch geantwortet hat und zurückkommt (Wissensbuch, Nachbarkarte), soll dort weiterdenken.
// 2. sonst die erste, die das Kind noch nie beantwortet hat (auf Profi also zuerst eine neue Profi-Frage);
// 3. sind alle schon beantwortet, die am frühesten wieder fällige. Bei Gleichstand jeweils die frühere.
export function ersteFrage(alle: KartenFrage[], review: LocalProgress['review'], kartenstand?: Record<string, unknown>, stufe: Stufe = 'entdecker'): KartenFrage {
  const fragen = fragenFuerStufe(alle, stufe);
  if (!fragen.length) throw Error('Eine Karte hat immer mindestens ihre Hauptfrage.');
  const offen = fragen.find(frage => {
    const wert = kartenstand?.[frage.answerKey];
    return typeof wert === 'string' && restoreAnswerWording(frage.id, wert) !== frage.question.answers[frage.question.correct];
  });
  if (offen) return offen;
  const ungesehen = fragen.find(frage => review[frage.reviewId] === undefined);
  if (ungesehen) return ungesehen;
  return fragen.reduce((frueheste, frage) => review[frage.reviewId].due < review[frueheste.reviewId].due ? frage : frueheste);
}

export type DazuPasstKachel =
  | {art: 'karte'; topicId: string; why: string}
  | {art: 'globus'}
  | {art: 'link'; label: string; mode: Mode; id?: string; iso?: string}
  | {art: 'spiel'};

// Höchstens drei Kacheln unter „Dazu passt“, immer in dieser Reihenfolge:
// die erste erklärte Verbindung, der Globus (nur mit Orten), dann der erste Link oder das Spiel der Welt.
// `related` kommt nie vor: Dort fehlt der Satz, warum zwei Karten zusammengehören (Entwurf 6.3).
export function dazuPasst(topic: WorldTopic, verbindungen: readonly {topic: string; why: string}[]): DazuPasstKachel[] {
  const kacheln: DazuPasstKachel[] = [];
  const verbindung = verbindungen[0];
  if (verbindung) kacheln.push({art: 'karte', topicId: verbindung.topic, why: verbindung.why});
  if (topic.locations.length) kacheln.push({art: 'globus'});
  const link = topic.links[0];
  kacheln.push(link ? {art: 'link', ...link} : {art: 'spiel'});
  return kacheln;
}

// Die übrigen Verbindungen für „Mehr erfahren“; die erste steht schon in „Dazu passt“.
export function weitereVerbindungen<T extends {topic: string}>(verbindungen: readonly T[]): T[] {
  return verbindungen.slice(1);
}

// Gibt es einen Mitmach-Baustein für „Ausprobieren“? Genau die Bedingung der alten Karte.
export function hatBaustein(topic: WorldTopic): boolean {
  return !!(topic.animal || topic.invention || topic.building || topic.model || topic.investigation || topic.id === 'science-tides');
}

// Karten mit Belegen zu Personen und Geschichte oder mit einem Forscherblick, auch ohne Mitmach-Baustein.
// Die Liste ist ein kleiner Auszug aus people-inquiries.json, science-thinking.json und den Geschichtsbausteinen:
// Die großen Dateien lädt erst der aufgeklappte Bereich. Ein Test hält die Liste gleich mit den Daten.
const MIT_BELEGEN = new Set([...BELEGE.personen, ...BELEGE.geschichte, ...BELEGE.forscherblick]);

// Bekommt die Karte den Bereich „Ausprobieren“? Mitmach-Baustein oder Belege (Entwurf 6.3).
export function hatAusprobieren(topic: WorldTopic): boolean {
  return hatBaustein(topic) || MIT_BELEGEN.has(topic.id);
}

// Prüft die neuen Felder einer Karte. Leere Liste heißt: alles in Ordnung.
// Die Daten kommen aus JSON; deshalb prüft die Funktion auch Typen, die TypeScript nicht sieht.
export function kartenFeldFehler(topic: WorldTopic): string[] {
  const fehler: string[] = [];
  const melde = (text: string) => fehler.push(topic.id + ': ' + text);
  const leer = (wert: unknown) => typeof wert !== 'string' || !wert.trim();
  const eigeneId = (id: unknown, art: 'stimmt' | 'rate') =>
    typeof id === 'string' && id.startsWith(topic.id + ':' + art + '-') && /^\d+$/.test(id.slice(topic.id.length + art.length + 2));

  if (topic.chapters !== undefined) {
    const kapitel = Array.isArray(topic.chapters) ? topic.chapters : [];
    if (kapitel.length < 1 || kapitel.length > 3) melde('chapters braucht 1 bis 3 Häppchen');
    kapitel.forEach((k, i) => { if (leer(k?.question) || leer(k?.text)) melde(`chapters[${i}]: Frage oder Text fehlt`); });
  }

  if (topic.claims !== undefined) {
    const claims = Array.isArray(topic.claims) ? topic.claims : [];
    if (!Array.isArray(topic.claims)) melde('claims ist keine Liste');
    claims.forEach((c, i) => {
      if (!eigeneId(c?.id, 'stimmt')) melde(`claims[${i}]: ID muss ${topic.id}:stimmt-<Zahl> sein`);
      if (typeof c?.isTrue !== 'boolean') melde(`claims[${i}]: isTrue ist kein Wahrheitswert`);
      if (leer(c?.text) || leer(c?.explanation)) melde(`claims[${i}]: Text oder Auflösung fehlt`);
      // „Fast richtig“ (E11, S5 Art 2): nur bei falschen Behauptungen; das falsche Wort steht zur Auswahl und in der Behauptung.
      if (c?.fastRichtig !== undefined) {
        const f = c.fastRichtig;
        const woerter = Array.isArray(f?.woerter) ? f.woerter : [];
        if (c.isTrue !== false) melde(`claims[${i}]: „Fast richtig“ nur bei einer falschen Behauptung`);
        if (woerter.length < 3 || woerter.length > 4 || woerter.some(leer) || new Set(woerter).size !== woerter.length) melde(`claims[${i}]: „Fast richtig“ braucht 3 oder 4 verschiedene Wörter`);
        if (!woerter.includes(f?.wort)) melde(`claims[${i}]: das falsche Wort steht nicht zur Auswahl`);
        if (woerter.some(w => typeof w === 'string' && typeof c.text === 'string' && !c.text.includes(w))) melde(`claims[${i}]: ein Wort steht nicht in der Behauptung`);
        if (leer(f?.ersatz) || leer(f?.aufloesung)) melde(`claims[${i}]: Ersatzwort oder Auflösung fehlt`);
      }
    });
  }

  // Teilschritt 3 (E5, E6): jede Zusatz- und Challenge-Frage hat eine Stufe; Entdecker 3 Antworten, Profi und Experte 4.
  // Kein Tipp und kein Satz „warum nicht“ nennt die richtige Antwort wörtlich; Experte hat zwei Tipps (D5).
  const nenntLoesung = (text: unknown, loesung: unknown) => typeof text === 'string' && typeof loesung === 'string' && loesung.trim() !== ''
    && new RegExp('(^|[^\\p{L}\\p{N}])' + loesung.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^\\p{L}\\p{N}])', 'iu').test(text);
  const frageFehler = (q: Record<string, unknown> | undefined, wo: string, tipps: unknown[] | null) => {
    const antworten = Array.isArray(q?.answers) ? q.answers as unknown[] : [];
    const stufe = q?.level;
    if (!(STUFEN as readonly unknown[]).includes(stufe)) melde(`${wo}: braucht eine Stufe (entdecker, profi, experte)`);
    const anzahl = stufe === 'entdecker' ? 3 : 4;
    if (antworten.length !== anzahl || antworten.some(leer) || new Set(antworten).size !== anzahl) melde(`${wo}: braucht ${anzahl} verschiedene Antworten`);
    const correct = q?.correct;
    if (!Number.isInteger(correct) || (correct as number) < 0 || (correct as number) >= antworten.length) melde(`${wo}: correct passt zu keiner Antwort`);
    if (leer(q?.prompt) || leer(q?.why)) melde(`${wo}: Frage oder Erklärung fehlt`);
    const loesung = antworten[correct as number];
    if (tipps) {
      if (!tipps.length || tipps.length > 2 || tipps.some(leer)) melde(`${wo}: braucht einen oder zwei Tipps`);
      if (stufe === 'experte' && tipps.length !== 2) melde(`${wo}: Experte braucht zwei Tipps`);
      if (tipps.some(t => nenntLoesung(t, loesung))) melde(`${wo}: ein Tipp nennt die Lösung`);
    }
    if (q?.wrongReasons !== undefined) {
      const saetze = Array.isArray(q.wrongReasons) ? q.wrongReasons as unknown[] : [];
      if (saetze.length !== antworten.length || saetze.some((s, j) => (j === correct ? s !== null : leer(s)))) melde(`${wo}: wrongReasons passt nicht zu den Antworten`);
      if (saetze.some(s => nenntLoesung(s, loesung))) melde(`${wo}: ein Satz „warum nicht“ nennt die Lösung`);
    }
  };

  if (topic.moreQuestions !== undefined) {
    const fragen = Array.isArray(topic.moreQuestions) ? topic.moreQuestions : [];
    if (!Array.isArray(topic.moreQuestions)) melde('moreQuestions ist keine Liste');
    fragen.forEach((q, i) => {
      if (!eigeneId(q?.id, 'rate')) melde(`moreQuestions[${i}]: ID muss ${topic.id}:rate-<Zahl> sein`);
      const tipps = Array.isArray(q?.hints) ? q.hints : typeof q?.hint === 'string' ? [q.hint] : [];
      frageFehler(q as unknown as Record<string, unknown>, `moreQuestions[${i}]`, tipps);
    });
  }

  // Challenge-Fragen: ihre Tipps stehen in challenge-hints.json (eigener Inhaltstest).
  if (topic.challenges !== undefined) (Array.isArray(topic.challenges) ? topic.challenges : []).forEach((q, i) => frageFehler(q as unknown as Record<string, unknown>, `challenges[${i}]`, null));

  // „Ordne richtig“ (E11, S5 Art 3): Teile in richtiger Reihenfolge, Tipps, Auflösung.
  if (topic.ordnen !== undefined) {
    const o = topic.ordnen;
    const teile = Array.isArray(o?.teile) ? o.teile : [];
    if (!(typeof o?.id === 'string' && new RegExp('^' + topic.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ':ordnen-\\d+$').test(o.id))) melde(`ordnen: ID muss ${topic.id}:ordnen-<Zahl> sein`);
    if (!(STUFEN as readonly unknown[]).includes(o?.level)) melde('ordnen: braucht eine Stufe');
    if (teile.length < 3 || teile.length > 5 || teile.some(leer) || new Set(teile).size !== teile.length) melde('ordnen: braucht 3 bis 5 verschiedene Teile');
    const tipps = Array.isArray(o?.hints) ? o.hints : [];
    if (!tipps.length || tipps.length > 2 || tipps.some(leer)) melde('ordnen: braucht einen oder zwei Tipps');
    if (leer(o?.frage) || leer(o?.aufloesung)) melde('ordnen: Frage oder Auflösung fehlt');
  }

  // Mit Häppchen steht „Ganz einfach“ (learning.starter) oben in „Ausprobieren“. Ohne diesen Bereich ginge der Satz verloren.
  if (topic.chapters !== undefined && topic.learning?.starter && !hatAusprobieren(topic)) {
    melde('Häppchen und „Ganz einfach“: Der Satz braucht „Ausprobieren“, sonst geht er verloren');
  }
  return fehler;
}

// Bildregel 6.3: zuerst ein freies Foto, sonst die eigene Zeichnung, sonst die Motivkachel.
// Die vollen Fotodaten lädt world-media.tsx erst bei Bedarf und geprüft. Für die Wahl genügen die kleine
// ID-Liste und die Kennwörter (foto-kennwoerter.json; ein Test hält sie gleich mit world-photos.json).
export type BildArt = {art: 'foto'; photoId: string; kennwort?: string} | {art: 'zeichnung'; kennwort: 'Zeichnung'} | {art: 'motiv'};

const KENNWORT_JE_FOTO: Record<string, string> = FOTO_KENNWOERTER;

export function bildArt(topic: Pick<WorldTopic, 'id' | 'image'>, hatZeichnung: boolean): BildArt {
  if (topic.image && FOTO_IDS.includes(topic.image)) {
    const kennwort = Object.hasOwn(KENNWORT_JE_FOTO, topic.image) ? KENNWORT_JE_FOTO[topic.image] : undefined;
    return kennwort ? {art: 'foto', photoId: topic.image, kennwort} : {art: 'foto', photoId: topic.image};
  }
  if (hatZeichnung) return {art: 'zeichnung', kennwort: 'Zeichnung'};
  return {art: 'motiv'};
}

// Was auf dem Bild stehen muss, damit Kinder es nicht für ein Foto von heute halten (Feld label in world-photos.json).
// Im Katalog heißt ein späteres Bildnis nur „Darstellung“ (world-media.tsx zeigt es als „Spätere Darstellung“).
const KENNWOERTER: Record<string, string> = {
  'KI-Bild': 'KI-Bild',
  'Rekonstruktion': 'Rekonstruktion',
  'Spätere Darstellung': 'Spätere Darstellung',
  'Darstellung': 'Spätere Darstellung',
  'Historischer Druck': 'Historischer Druck',
};

export function fotoKennwort(label: string | undefined): string | undefined {
  return label && Object.hasOwn(KENNWOERTER, label) ? KENNWOERTER[label] : undefined;
}

// alt beschreibt das Bild, damit man im Block erkennt, zu welchem Foto ein Eintrag gehört.
export type Bildnachweis = {photoId: string; alt: string; author: string; license: string; licenseUrl: string; sourceUrl: string; changes?: string};

// Ein Eintrag je Foto für „Bildnachweise auf dieser Seite“, in der Reihenfolge der Seite, ohne Doppel.
// `fotos` sind die geladenen Fotodaten (world-media.tsx, ladeFotoDaten).
export function bildnachweisListe(photoIds: readonly string[], fotos: Record<string, WorldPhotoData>): Bildnachweis[] {
  return [...new Set(photoIds)].filter(id => Object.hasOwn(fotos, id)).map(id => {
    const foto = fotos[id];
    return {
      photoId: id,
      alt: foto.alt_de,
      author: foto.author,
      license: foto.license,
      licenseUrl: foto.license_url,
      sourceUrl: foto.source_page_url,
      ...(foto.transformations_de?.trim() ? {changes: foto.transformations_de} : {}),
    };
  });
}
