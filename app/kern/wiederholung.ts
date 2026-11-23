import type { Review } from '../progress-storage';

// Wiederholung nach einer Antwort (Teilschritt 3, E16; BACKLOG 19 und 23, K7).
// Es zählt die erste Antwort einer Runde. Nach „Noch einmal raten“ zählt eine Antwort nur, wenn die Frage
// wirklich wieder fällig ist; zum Spaß falsch raten macht sie nicht früher fällig. Eine richtige Antwort
// nach einer falschen nimmt die Frage aus „Ein Gedanke zum Wiederholen“; morgen ist sie wieder dran.
type Eintrag = Review[string];
const tag = (datum: Date) => datum.toISOString().slice(0, 10);

export function wiederholungFuerAntwort(eintrag: Eintrag | undefined, korrekt: boolean, neueRunde: boolean, heute = new Date()): 'zaehlen' | 'nachbessern' | null {
  if (neueRunde && (!eintrag || eintrag.due <= tag(heute))) return 'zaehlen';
  if (korrekt && eintrag && !eintrag.correct) return 'nachbessern';
  return null;
}

export function nachgebessert(eintrag: Eintrag, heute = new Date()): Eintrag {
  const morgen = new Date(heute);
  morgen.setUTCDate(morgen.getUTCDate() + 1);
  return { ...eintrag, correct: true, due: tag(morgen) };
}
