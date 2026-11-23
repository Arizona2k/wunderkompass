'use client';
// „Ordne richtig“ (Teilschritt 3, E11, S5 Art 3): Teile in die richtige Reihenfolge bringen, ab der Stufe der Aufgabe.
// Mit „nach oben“/„nach unten“ verschieben, dann „Prüfen“. Ein Denkanstoß wie „Stimmt das?“: kein „gelernt“,
// keine Wiederholung. Gespeichert im Spielstand der Karte: 'ordnen:' + id = {reihe, geloest}.
import {ArrowDown, ArrowUp, Check} from 'lucide-react';
import {useSavedGame} from '../../saved-games';
import QuestionHints from '../../question-hints';
import {shuffle} from '../../../lib/shuffle';
import type {KartenOrdnen} from '../../world-types';
import {WOERTER} from '../woerter';

type Stand = {reihe: string[]; geprueft: boolean};

// Eine neue Reihe ist nie schon richtig.
function gemischt(teile: string[]): string[] {
  const reihe = shuffle(teile);
  return reihe.every((t, i) => t === teile[i]) ? [...reihe.slice(1), reihe[0]] : reihe;
}

const gueltig = (wert: unknown, teile: string[]): wert is Stand => {
  const r = (wert as Stand | null)?.reihe;
  return Array.isArray(r) && r.length === teile.length && teile.every(t => r.includes(t)) && typeof (wert as Stand).geprueft === 'boolean';
};

export default function OrdneRichtig({ordnen, ueberschrift: Ueberschrift = 'h2', onRead}: {ordnen: KartenOrdnen; ueberschrift?: 'h2' | 'h3'; onRead: (text: string) => void}) {
  const [stand, setStand] = useSavedGame<Stand>('ordnen:' + ordnen.id, () => ({reihe: gemischt(ordnen.teile), geprueft: false}), (wert, neu) => (gueltig(wert, ordnen.teile) ? wert : neu));
  const richtig = stand.reihe.every((t, i) => t === ordnen.teile[i]);
  const geloest = stand.geprueft && richtig;
  const verschiebe = (von: number, nach: number) => {
    const reihe = [...stand.reihe];
    [reihe[von], reihe[nach]] = [reihe[nach], reihe[von]];
    setStand({reihe, geprueft: false});
  };
  const titelId = 'ordnen-' + ordnen.id;
  return (
    <section className="wissenskarte-abschnitt ordne-richtig" aria-labelledby={titelId}>
      <Ueberschrift id={titelId}>Ordne richtig</Ueberschrift>
      <p className="ordne-richtig-frage">{ordnen.frage}</p>
      <ol className="ordne-richtig-liste">
        {stand.reihe.map((teil, i) => (
          <li key={teil} className={geloest ? 'is-correct' : ''}>
            <span className="ordne-richtig-nummer" aria-hidden="true">{i + 1}</span>
            <span className="ordne-richtig-text">{teil}</span>
            {!geloest && (
              <span className="ordne-richtig-knoepfe">
                <button type="button" className="kern-knopf" aria-label={`„${teil}“ nach oben`} disabled={i === 0} onClick={() => verschiebe(i, i - 1)}><ArrowUp size={20} aria-hidden="true"/></button>
                <button type="button" className="kern-knopf" aria-label={`„${teil}“ nach unten`} disabled={i === stand.reihe.length - 1} onClick={() => verschiebe(i, i + 1)}><ArrowDown size={20} aria-hidden="true"/></button>
              </span>
            )}
            {geloest && <Check size={20} aria-hidden="true"/>}
          </li>
        ))}
      </ol>
      {!geloest && <button type="button" className="primary-button" onClick={() => setStand({...stand, geprueft: true})}>Prüfen</button>}
      {stand.geprueft && (
        <div className="ordne-richtig-rueckmeldung" role="status">
          <strong>{richtig ? WOERTER.richtig : WOERTER.nochNicht}</strong>
          {richtig && <p>{ordnen.aufloesung}</p>}
        </div>
      )}
      {!geloest && <QuestionHints key={ordnen.id} hints={ordnen.hints} onRead={onRead}/>}
    </section>
  );
}
