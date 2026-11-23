"use client";
// Die gemeinsame Stufenwahl (Teilschritt 3, E2): eine Zeile „Stufe: Profi“ mit „Ändern“.
// Ein Tipp öffnet die drei Stufen, ein zweiter stellt um. Auf Profi und Experte steht immer
// „Zu schwer? Zurück zu Entdecker“ dabei. Kein Alter auf den Knöpfen; das steht nur für Erwachsene im Pass.
import {useEffect, useId, useRef, useState} from 'react';
import {Check} from 'lucide-react';
import {STUFEN, type Stufe} from './stufe';

export const STUFEN_TEXT: Record<Stufe, {name: string; text: string}> = {
  entdecker: {name: 'Entdecker', text: 'zum Reinkommen'},
  profi: {name: 'Profi', text: 'vier Antworten, kniffligere Fallen'},
  experte: {name: 'Experte', text: 'nachdenken und kombinieren'},
};

export default function StufenWahl({stufe, onStufe}: {stufe: Stufe; onStufe: (stufe: Stufe) => void}) {
  const [offen, setOffen] = useState(false);
  const gruppe = useId(), aendern = useRef<HTMLButtonElement>(null), gewaehlt = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (offen) gewaehlt.current?.focus(); }, [offen]);
  function waehle(neu: Stufe) {
    onStufe(neu);
    setOffen(false);
    requestAnimationFrame(() => aendern.current?.focus());
  }
  return <div className="stufen-wahl" data-stufe={stufe}>
    <div className="stufen-zeile">
      <p>Stufe: <strong>{STUFEN_TEXT[stufe].name}</strong></p>
      <button ref={aendern} type="button" className="kern-knopf" aria-label="Stufe ändern" aria-expanded={offen} aria-controls={offen ? gruppe : undefined} onClick={() => setOffen(o => !o)}>Ändern</button>
    </div>
    {offen && <div id={gruppe} className="stufen-knoepfe" role="group" aria-label="Stufe wählen">
      {STUFEN.map(s => <button key={s} ref={s === stufe ? gewaehlt : undefined} type="button" className="stufen-knopf" aria-pressed={s === stufe} onClick={() => waehle(s)}>
        <strong>{STUFEN_TEXT[s].name}</strong><span>{STUFEN_TEXT[s].text}</span>{s === stufe && <Check size={22} aria-hidden="true"/>}
      </button>)}
    </div>}
    {!offen && stufe !== 'entdecker' && <button type="button" className="stufen-zurueck" onClick={() => waehle('entdecker')}>Zu schwer? Zurück zu Entdecker</button>}
  </div>;
}
