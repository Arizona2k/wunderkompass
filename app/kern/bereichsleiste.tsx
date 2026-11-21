"use client";
import type {MouseEvent} from 'react';
import {BookOpen, FlaskConical, Gamepad2, Globe2, House, Map as Karte} from 'lucide-react';
import {BEREICHE, type BereichId} from './bereiche';

const SYMBOLE = {explore: House, world: Globe2, games: Gamepad2, labs: FlaskConical, journeys: Karte, book: BookOpen} as const;

type Props = {bereich: BereichId | null; onBereich: (ziel: string) => void};

// Die sechs Bereiche als echte Links. Auf dem Handy liegt die Leiste unten, sonst im Kopf.
export default function Bereichsleiste({bereich, onBereich}: Props) {
  function oeffnen(event: MouseEvent<HTMLAnchorElement>, ziel: string) {
    // Mit Strg, Cmd, Umschalt oder Mittelklick öffnet der Browser den Link selbst.
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onBereich(ziel);
  }
  return <nav className="kern-leiste" aria-label="Bereiche">
    <ul>
      {BEREICHE.map(({id, ziel, wort}) => {
        const Symbol = SYMBOLE[id];
        return <li key={id}>
          <a href={'#' + ziel} data-route-focus={'home-nav-' + id} aria-current={bereich === id ? 'page' : undefined} onClick={event => oeffnen(event, ziel)}>
            <Symbol size={22} aria-hidden="true"/>
            <span>{wort}</span>
          </a>
        </li>;
      })}
    </ul>
  </nav>;
}
