// Reine Logik der neuen Wissenskarte. Ohne React, damit Node-Tests die Datei laden können.
// Die Hauptfrage behält ihre alten Schlüssel (world-question:<id>, topicAnswer, items):
// Darunter stehen schon Antworten von Kindern im Pass.
import type {Mode} from '../../earth-data';
import type {LocalProgress} from '../../progress-storage';
import type {WorldQuestion, WorldTopic} from '../../world-types';

export type KartenFrage = {
  id: string;
  reviewId: string;
  answerKey: string;
  itemsKey: string;
  question: WorldQuestion;
  hints: string[];
  // Je Antwort ein Satz, warum sie nicht passt; null bei der richtigen (wie questionFeedback im Katalog).
  wrongReasons?: (string | null)[];
};

// Alle Fragen einer Karte: zuerst die Hauptfrage, dann die Zusatzfragen in Datenreihenfolge.
export function kartenFragen(topic: WorldTopic, hintBank: Record<string, {steps: string[]}>): KartenFrage[] {
  // Hinweise wie bisher (world-topic.tsx): Der Hinweis aus questionFeedback ersetzt den ersten Schritt der Bank.
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
  };
  const zusatz = (topic.moreQuestions ?? []).map(({id, hint, prompt, answers, correct, why}): KartenFrage => ({
    id,
    reviewId: 'world-question:' + id,
    answerKey: 'topicAnswer:' + id,
    itemsKey: 'items:' + id,
    question: {prompt, answers, correct, why},
    hints: [hint],
  }));
  return [haupt, ...zusatz];
}

// Welche Frage „Rate mal!“ zeigt: die erste, die das Kind noch nie beantwortet hat.
// Sind alle schon beantwortet, die am frühesten wieder fällige; bei Gleichstand die frühere.
export function ersteFrage(fragen: KartenFrage[], review: LocalProgress['review']): KartenFrage {
  if (!fragen.length) throw Error('Eine Karte hat immer mindestens ihre Hauptfrage.');
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

// Gibt es einen Mitmach-Baustein für „Ausprobieren“? Genau die Bedingung der alten Karte (world-topic.tsx).
export function hatBaustein(topic: WorldTopic): boolean {
  return !!(topic.animal || topic.invention || topic.building || topic.model || topic.investigation || topic.id === 'science-tides');
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
    });
  }

  if (topic.moreQuestions !== undefined) {
    const fragen = Array.isArray(topic.moreQuestions) ? topic.moreQuestions : [];
    if (!Array.isArray(topic.moreQuestions)) melde('moreQuestions ist keine Liste');
    fragen.forEach((q, i) => {
      if (!eigeneId(q?.id, 'rate')) melde(`moreQuestions[${i}]: ID muss ${topic.id}:rate-<Zahl> sein`);
      const antworten = Array.isArray(q?.answers) ? q.answers : [];
      if (antworten.length !== 3 || antworten.some(leer) || new Set(antworten).size !== 3) melde(`moreQuestions[${i}]: braucht 3 verschiedene Antworten`);
      if (!Number.isInteger(q?.correct) || q.correct < 0 || q.correct >= antworten.length) melde(`moreQuestions[${i}]: correct passt zu keiner Antwort`);
      if (leer(q?.prompt) || leer(q?.why) || leer(q?.hint)) melde(`moreQuestions[${i}]: Frage, Erklärung oder Hinweis fehlt`);
    });
  }
  return fehler;
}
