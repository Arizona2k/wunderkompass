'use client';
// „Rate mal!“: die Startfrage der Karte, weit oben. Verhalten wie die alte Mini-Frage:
// Falsch zeigt „Noch nicht ganz. Versuch es noch einmal!“ und den Tipp, aber keine Erklärung; neu wählen geht sofort.
// Richtig zeigt Häkchen und Erklärung und schreibt „gelernt“. Die Wiederholung bekommt nur die erste Antwort.
// Zusatzfragen (Pilot-Karten) verhalten sich genauso, mit eigenen Schlüsseln; „Noch eine Frage“ blättert ohne Zähler weiter.
// Nach der letzten Frage einer Runde steht statt „Noch eine Frage“ ein Schluss (Satz und Weg zur nächsten Karte), wenn die
// Karte ihn zeigt (zeigtSchluss: nicht bei einer einzelnen Entdecker-Frage).
import {useEffect, useRef, type ReactNode} from 'react';
import {Check, Compass} from 'lucide-react';
import {restoreAnswerWording} from '../../retained-answer-wording.mjs';
import {LearningFeedback} from '../../learning-motion';
import QuestionHints from '../../question-hints';
import {useSavedGame} from '../../saved-games';
import {shuffle} from '../../../lib/shuffle';
import type {Review} from '../../progress-storage';
import {wiederholungFuerAntwort} from '../wiederholung';
import type {Stufe} from '../stufe';
import {WOERTER} from '../woerter';
import {festGemischt, gueltigeReihe, type KartenFrage} from './karten-daten';

// Die Reihenfolge der Antworten, gespeichert unter dem alten Schlüssel (Hauptfrage: items).
// Passt die gespeicherte Reihe nicht mehr zu den Antworten (z. B. eine vierte Antwort auf Profi), zeigt die Karte eine
// feste Mischung (festGemischt) und lässt die alte Reihe im Pass stehen. Das gilt für eine Liste aus Wörtern; was gar keine
// Wortliste ist, ersetzt useSavedGame wie bei allen Spielständen durch eine neue Mischung (saved-games.tsx). Die Karte nutzt `antwortReihe` mit dem
// Spielstand aus dem Pass auch fürs Vorlesen, damit beide dieselbe Reihenfolge haben.
export function antwortReihe(frage: KartenFrage, gespeichert: unknown): readonly string[] {
  return gueltigeReihe(frage, gespeichert) ?? festGemischt(frage);
}

function useAntwortReihe(frage: KartenFrage): readonly string[] {
  const [gespeicherteReihe] = useSavedGame(frage.itemsKey, () => shuffle(frage.question.answers));
  return antwortReihe(frage, gespeicherteReihe);
}

type RateMalProps = {
  frage: KartenFrage;
  ueberschrift: 'h2' | 'h3';
  onLearn: () => void;
  onReview: (reviewId: string, correct: boolean) => void;
  // Der Wiederholungseintrag dieser Frage und „richtig nach falsch“ (E16): Es zählt die erste Antwort einer Runde.
  wiederholung?: Review[string];
  onNachbessern?: (reviewId: string) => void;
  onRead: (text: string) => void;
  // Nur wenn in dieser Runde noch eine Frage der Stufe wartet: „Noch eine Frage“ nach einer richtigen Antwort.
  onWeiter?: () => void;
  // Nach der letzten Frage der Runde (nur Karten mit mehr als einer Frage): Satz und, wenn vorhanden, Knopf zur nächsten Karte.
  schluss?: {text: string; weiter?: ReactNode};
  // Nach „Noch eine Frage“ bekommt die neue Frage den Fokus.
  fokus?: boolean;
  // Jede Wahl melden (für die Stufen-Vorschläge zählt dort nur die erste je Frage, und nur auf der gewählten Stufe).
  onAntwort?: (frageId: string, korrekt: boolean, stufe: Stufe) => void;
  // Der Vorschlag steht in der Rückmeldung nach der Erklärung (und nach dem Schluss-Satz), vor den Knöpfen: Darunter
  // übersahen Kinder ihn neben dem großen orangen Knopf (Design-Prüfung Teil A, Befund 2).
  vorschlag?: ReactNode;
  // Unter der Überschrift, z. B. die Stufenwahl (Teilschritt 3, E2: „über Rate mal!“, ohne eigenen Kasten).
  kopf?: ReactNode;
};

// Die Karte gibt `key={frage.id}`: Jede Frage hat ihren eigenen Zustand und ihre eigenen Schlüssel.
export default function RateMal({frage, ueberschrift: Ueberschrift, onLearn, onReview, wiederholung, onNachbessern, onRead, onWeiter, schluss, fokus = false, onAntwort, vorschlag, kopf}: RateMalProps) {
  const q = frage.question;
  const auswahl = useAntwortReihe(frage);
  const bereich = useRef<HTMLElement>(null);
  useEffect(() => { if (fokus) bereich.current?.focus(); }, [fokus]);
  const richtigeAntwort = q.answers[q.correct];
  // Gespeichert unter dem alten Schlüssel (Hauptfrage: topicAnswer), damit frühere Antworten zählen.
  const [gespeicherteAntwort, setAntwort] = useSavedGame<string | null>(frage.answerKey, null);
  const antwort = gespeicherteAntwort === null ? null : restoreAnswerWording(frage.id, gespeicherteAntwort);
  const richtig = antwort === richtigeAntwort;
  const fruehereAuswahl = antwort !== null && !q.answers.includes(antwort);

  // Eine neue Runde beginnt ohne Antwort (auch nach „Noch einmal raten“) oder nach einer früheren Auswahl,
  // die es nicht mehr gibt. Ob sie als Wiederholung zählt, entscheidet wiederholungFuerAntwort.
  function waehle(wahl: string) {
    setAntwort(wahl);
    const korrekt = wahl === richtigeAntwort;
    const art = wiederholungFuerAntwort(wiederholung, korrekt, antwort === null || fruehereAuswahl);
    if (art === 'zaehlen') onReview(frage.reviewId, korrekt);
    else if (art === 'nachbessern') onNachbessern?.(frage.reviewId);
    if (korrekt) onLearn();
    onAntwort?.(frage.id, korrekt, frage.level);
  }

  return (
    // data-route-focus: Rücksprungziel nach „Weiter zu“ (hash-route.ts); „Rate mal!“ steht immer da, der Knopf nicht.
    <section ref={bereich} className="world-mini-question rate-mal" tabIndex={-1} aria-labelledby={'rate-mal-' + frage.id} data-route-focus="rate-mal">
      <div className="rate-mal-kopf">
        <Ueberschrift id={'rate-mal-' + frage.id} className="rate-mal-titel">Rate mal!</Ueberschrift>
        {kopf}
      </div>
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
          <strong>{fruehereAuswahl ? 'Hier gibt es neue Antworten.' : richtig ? WOERTER.richtig : WOERTER.nochNicht}</strong>
          <p>
            {fruehereAuswahl
              ? <>Früher hast du <q className="retained-mini-choice">{antwort}</q> gewählt. Diese Antwort gibt es jetzt nicht mehr. Wähle oben eine Antwort aus.</>
              : richtig
                ? q.why
                : (frage.wrongReasons?.[q.answers.indexOf(antwort)] ?? 'Lies unten unter „Kurz erklärt“ nach.')}
          </p>
          {/* Erst der Schluss, dann ein Vorschlag, dann die Knöpfe (kinder-redaktion 24.11.2026, Befund f). */}
          {richtig && schluss && <p className="rate-mal-schluss"><Compass size={22} aria-hidden="true"/><strong>{schluss.text}</strong></p>}
          {vorschlag}
          {richtig && (
            <div className="rate-mal-weiter">
              {onWeiter && <button type="button" className="primary-button" onClick={onWeiter}>Noch eine Frage</button>}
              {!onWeiter && schluss?.weiter}
              <button
                type="button"
                className="speech-button"
                onClick={() => {
                  setAntwort(null);
                  requestAnimationFrame(() => bereich.current?.querySelector<HTMLButtonElement>('.quiz-answer')?.focus());
                }}
              >
                Noch einmal raten
              </button>
            </div>
          )}
        </>}
      </LearningFeedback>
      {/* Der Tipp steht unter der Rückmeldung: erst „Noch nicht ganz …“, dann die Hilfe. */}
      {!richtig && <QuestionHints key={frage.id} hints={frage.hints} onRead={onRead}/>}
    </section>
  );
}
