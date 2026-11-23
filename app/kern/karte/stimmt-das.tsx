'use client';
// „Stimmt das?“: eine Behauptung zum Nachdenken, nach „Kurz erklärt“ (Pilot-Karten).
// Ein Tipp auf „Stimmt“ oder „Stimmt nicht“ zeigt die Auflösung; sie sagt immer klar, was stimmt.
// Gespeichert wird nur die Wahl im Spielstand der Karte ('claim:' + id). Kein „gelernt“, keine Wiederholung:
// Das ist ein Denkanstoß, keine Prüfung.
import {Check, X} from 'lucide-react';
import {LearningFeedback} from '../../learning-motion';
import {useSavedGame} from '../../saved-games';
import type {KartenBehauptung} from '../../world-types';
import type {Stufe} from '../stufe';
import {WOERTER} from '../woerter';

type StimmtDasProps = {behauptung: KartenBehauptung; ueberschrift?: 'h2' | 'h3'; stufe?: Stufe};

export default function StimmtDas({behauptung, ueberschrift: Ueberschrift = 'h2', stufe = 'entdecker'}: StimmtDasProps) {
  const [gespeichert, setWahl] = useSavedGame<boolean | null>('claim:' + behauptung.id, null);
  // Ein unpassender alter Wert gilt als „noch nicht getippt“.
  const wahl = typeof gespeichert === 'boolean' ? gespeichert : null;
  // „Fast richtig“ (Teilschritt 3, E11): Auf Experte wählt das Kind nach „Stimmt nicht“ das falsche Wort.
  // Die Erklärung kommt erst danach, sonst verriete sie das Wort. Gespeichert unter 'claimWort:' + id.
  const fast = stufe === 'experte' && !behauptung.isTrue ? behauptung.fastRichtig : undefined;
  const [wortGespeichert, setWort] = useSavedGame<string | null>('claimWort:' + behauptung.id, null);
  const wort = fast && typeof wortGespeichert === 'string' && fast.woerter.includes(wortGespeichert) ? wortGespeichert : null;
  const wortGefunden = !!fast && wort === fast.wort;
  const wortFrage = !!fast && wahl === false;
  const erklaerungZeigen = wahl !== null && (!wortFrage || wortGefunden);
  const titelId = 'stimmt-das-' + behauptung.id;
  // Nach dem Tippen zeigt der passende Knopf immer das Häkchen, auch wenn das Kind den anderen getippt hat.
  // Der getippte falsche Knopf bekommt das ×. Es gibt kein zweites Raten, darum muss der Knopf selbst zeigen, was stimmt.
  const knopf = (wert: boolean, text: string) => {
    const gewaehlt = wahl === wert;
    const passt = wert === behauptung.isTrue;
    const markierung = wahl === null ? '' : passt ? ' is-correct' : gewaehlt ? ' is-incorrect' : '';
    return (
      <button
        type="button"
        className={'quiz-answer' + markierung}
        aria-pressed={gewaehlt}
        disabled={wahl !== null}
        onClick={() => setWahl(wert)}
      >
        <span>{text}</span>
        {markierung === ' is-correct' && <Check size={19} aria-hidden="true"/>}
        {markierung === ' is-incorrect' && <X size={19} aria-hidden="true"/>}
      </button>
    );
  };
  return (
    <section className="wissenskarte-abschnitt stimmt-das" aria-labelledby={titelId}>
      <Ueberschrift id={titelId}>Stimmt das?</Ueberschrift>
      <p className="stimmt-das-behauptung">{behauptung.text}</p>
      <div className="quiz-answers stimmt-das-knoepfe">
        {knopf(true, 'Stimmt')}
        {knopf(false, 'Stimmt nicht')}
      </div>
      {wortFrage && fast && (
        <div className="stimmt-das-wort">
          <p><strong>{WOERTER.richtig} Da stimmt etwas nicht.</strong> Welches Wort ist falsch?</p>
          <div className="quiz-answers stimmt-das-woerter">
            {fast.woerter.map(w => (
              <button
                type="button"
                key={w}
                className={'quiz-answer' + (wort === w ? (wortGefunden ? ' is-correct' : ' is-incorrect') : '')}
                aria-pressed={wort === w}
                disabled={wortGefunden}
                onClick={() => setWort(w)}
              >
                <span>{w}</span>
                {wort === w && wortGefunden && <Check size={19} aria-hidden="true"/>}
              </button>
            ))}
          </div>
          {wort !== null && !wortGefunden && <p role="status">{WOERTER.nochNicht}</p>}
          {wortGefunden && <p role="status"><strong>{WOERTER.richtig}</strong> Richtig wäre „{fast.ersatz}“. {fast.aufloesung}</p>}
        </div>
      )}
      <LearningFeedback active={erklaerungZeigen}>
        {erklaerungZeigen && <>
          <strong>{behauptung.isTrue ? 'Das stimmt.' : 'Das stimmt nicht.'}</strong>
          <p>{behauptung.explanation}</p>
        </>}
      </LearningFeedback>
    </section>
  );
}
