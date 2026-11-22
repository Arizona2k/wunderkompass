'use client';
// „Rate mal!“: die Startfrage der Karte, weit oben. Verhalten wie die alte Mini-Frage:
// Falsch zeigt „Überlege noch einmal.“ und den Hinweis, aber keine Erklärung; neu wählen geht sofort.
// Richtig zeigt Häkchen und Erklärung und schreibt „gelernt“. Die Wiederholung bekommt nur die erste Antwort.
import {Check} from 'lucide-react';
import {restoreAnswerWording} from '../../retained-answer-wording.mjs';
import {LearningFeedback} from '../../learning-motion';
import QuestionHints from '../../question-hints';
import {useSavedGame} from '../../saved-games';
import {shuffle} from '../../../lib/shuffle';
import type {KartenFrage} from './karten-daten';

// Die Reihenfolge der Antworten, gespeichert unter dem alten Schlüssel (Hauptfrage: items).
// Die Karte ruft das einmal auf und gibt die Reihe an „Rate mal!“ und an „Vorlesen“ weiter,
// damit beide dieselbe Reihenfolge nutzen. Passt die gespeicherte Reihe nicht mehr zu den Antworten
// (Frage geändert), gilt die Reihenfolge der Daten.
export function useAntwortReihe(frage: KartenFrage): readonly string[] {
  const q = frage.question;
  const [gespeicherteReihe] = useSavedGame(frage.itemsKey, () => shuffle(q.answers));
  const reihe = gespeicherteReihe.map(wert => restoreAnswerWording(frage.id, wert));
  return reihe.length === q.answers.length && new Set(reihe).size === q.answers.length && reihe.every(a => q.answers.includes(a)) ? reihe : q.answers;
}

type RateMalProps = {
  frage: KartenFrage;
  auswahl: readonly string[];
  ueberschrift: 'h2' | 'h3';
  onLearn: () => void;
  onReview: (reviewId: string, correct: boolean) => void;
  onRead: (text: string) => void;
};

export default function RateMal({frage, auswahl, ueberschrift: Ueberschrift, onLearn, onReview, onRead}: RateMalProps) {
  const q = frage.question;
  const richtigeAntwort = q.answers[q.correct];
  // Gespeichert unter dem alten Schlüssel (Hauptfrage: topicAnswer), damit frühere Antworten zählen.
  const [gespeicherteAntwort, setAntwort] = useSavedGame<string | null>(frage.answerKey, null);
  const antwort = gespeicherteAntwort === null ? null : restoreAnswerWording(frage.id, gespeicherteAntwort);
  const richtig = antwort === richtigeAntwort;
  const fruehereAuswahl = antwort !== null && !q.answers.includes(antwort);

  function waehle(wahl: string) {
    setAntwort(wahl);
    const korrekt = wahl === richtigeAntwort;
    if (antwort === null) onReview(frage.reviewId, korrekt);
    if (korrekt) onLearn();
  }

  return (
    <section className="world-mini-question rate-mal" tabIndex={-1} aria-labelledby={'rate-mal-' + frage.id}>
      <Ueberschrift id={'rate-mal-' + frage.id} className="rate-mal-titel">Rate mal!</Ueberschrift>
      <p className="rate-mal-frage">{q.prompt}</p>
      <div className="quiz-answers">
        {auswahl.map((wahl, i) => (
          <button
            type="button"
            className={'quiz-answer ' + (antwort === wahl ? (richtig ? 'is-correct' : 'is-incorrect') : '')}
            disabled={richtig}
            key={wahl}
            onClick={() => waehle(wahl)}
          >
            <span className="answer-letter">{String.fromCharCode(65 + i)}</span>
            <span>{wahl}</span>
            {richtig && antwort === wahl && <Check size={19} aria-hidden="true"/>}
          </button>
        ))}
      </div>
      <LearningFeedback active={antwort !== null}>
        {antwort && <>
          <strong>{fruehereAuswahl ? 'Deine frühere Auswahl bleibt gespeichert' : richtig ? 'Passende Antwort gewählt.' : 'Überlege noch einmal.'}</strong>
          <p>
            {fruehereAuswahl
              ? <>Du hattest <q className="retained-mini-choice">{antwort}</q> gewählt. Diese Antwort gehört zu früheren Auswahlmöglichkeiten. Oben siehst du die aktuelle Auswahl. Du kannst sie erneut prüfen; die frühere Antwort wird dabei nicht automatisch umgedeutet.</>
              : richtig
                ? q.why
                : (frage.wrongReasons?.[q.answers.indexOf(antwort)] ?? 'Vergleiche die Antworten mit der Erklärung oder dem Modell. Du kannst in Ruhe noch einmal wählen.')}
          </p>
          {richtig && (
            <button
              type="button"
              className="speech-button"
              onClick={event => {
                const bereich = event.currentTarget.closest('.world-mini-question');
                setAntwort(null);
                requestAnimationFrame(() => bereich?.querySelector<HTMLButtonElement>('.quiz-answer')?.focus());
              }}
            >
              Später noch einmal prüfen
            </button>
          )}
        </>}
      </LearningFeedback>
      {/* Der Hinweis steht unter der Rückmeldung: erst „Überlege noch einmal.“, dann die Hilfe. */}
      {!richtig && <QuestionHints key={frage.id} hints={frage.hints} onRead={onRead}/>}
    </section>
  );
}
