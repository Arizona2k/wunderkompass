"use client";
import type {MouseEvent} from 'react';
import {Compass, IdCard, Search} from 'lucide-react';
import Bereichsleiste from './bereichsleiste';
import type {BereichId} from './bereiche';

type Props = {
  passBereit: boolean;
  bereich: BereichId | null;
  onStart: () => void;
  onSuche: () => void;
  onPass: (e: MouseEvent<HTMLButtonElement>) => void;
  onBereich: (ziel: string) => void;
};

// Kopf: Marke, Bereichsleiste, Suche und Pass. Keine Zähler, kein Hilfe-Knopf.
export default function Kopfzeile({passBereit, bereich, onStart, onSuche, onPass, onBereich}: Props) {
  return <header className="kern-kopf">
    <a className="kern-marke" href="#home" aria-label="WunderKompass – Startseite" onClick={event => { event.preventDefault(); onStart(); }}>
      <span className="kern-marke-zeichen" aria-hidden="true"><Compass size={24}/></span>
      <span className="kern-marke-wort">WunderKompass</span>
    </a>
    <Bereichsleiste bereich={bereich} onBereich={onBereich}/>
    <div className="kern-knoepfe">
      <button type="button" className="kern-knopf" aria-label="Lernwelt durchsuchen" title="Lernwelt durchsuchen" onClick={onSuche}>
        <Search size={22} aria-hidden="true"/>
      </button>
      <button type="button" className="kern-knopf kern-pass" aria-label="Entdeckerpass öffnen" disabled={!passBereit} onClick={onPass}>
        <IdCard size={22} aria-hidden="true"/>
        <span>Entdeckerpass</span>
      </button>
    </div>
  </header>;
}
