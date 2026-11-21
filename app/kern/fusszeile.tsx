"use client";
import type {MouseEvent, ReactNode} from 'react';
import {navigateHash} from '../hash-route';

type Props = {onEltern: (e: MouseEvent<HTMLButtonElement>) => void; neuAktiv?: boolean; children?: ReactNode};

// Seitenfuß: „Was ist neu?“, „Für Eltern“, darunter die Offline-Box (children).
// Auf der Seite „Was ist neu?“ selbst ist der Link als aktuelle Seite markiert.
export default function Fusszeile({onEltern, neuAktiv = false, children}: Props) {
  return <footer className="kern-fuss">
    <div className="kern-fuss-links">
      <a href="#updates" data-route-focus="home-updates" aria-current={neuAktiv ? 'page' : undefined} onClick={event => { event.preventDefault(); navigateHash('updates'); }}>Was ist neu?</a>
      <button type="button" onClick={onEltern}>Für Eltern</button>
    </div>
    {children}
    <p className="kern-fuss-satz">Wissen entdecken. Zusammenhänge verstehen.</p>
  </footer>;
}
