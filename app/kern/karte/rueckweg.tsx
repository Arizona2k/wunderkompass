'use client';
// Rückweg über der Karte: ein Link statt der alten Kartenleiste (Entwurf 6.3, Plan Aufgabe 6).
// - Aus der App (navigateHash setzt wunderRoute): „← Zurück“ mit history.back().
//   Kam das Kind von seiner Auswahl, trägt der Link deren Fokus-Schlüssel „world-return-selection“.
// - Direkt geöffnet (Link von außen, neuer Tab): „← {Welt}“ führt zur Welt der Karte.
// Gestaltung in rueckweg.css; sie lädt mit der Weltenansicht, nicht mit dem Start-Skript.
import type {MouseEvent} from 'react';
import {WORLD_CATEGORIES} from '../../world-index';
import type {WorldCategory} from '../../world-types';
import './rueckweg.css';

type RueckwegProps = {
  category: WorldCategory;
  ausDerApp: boolean;
  zurAuswahl: boolean;
  onBack: () => void;
  onWorld: () => void;
};

export default function KartenRueckweg({category, ausDerApp, zurAuswahl, onBack, onWorld}: RueckwegProps) {
  const welt = WORLD_CATEGORIES.find(c => c.id === category);
  const zurueck = ausDerApp || zurAuswahl;
  function folgen(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (zurueck) onBack();
    else onWorld();
  }
  return (
    <nav className="karten-rueckweg" aria-label="Rückweg">
      <a href={'#world/' + category} data-route-focus={zurAuswahl ? 'world-return-selection' : undefined} onClick={folgen}>
        <span aria-hidden="true">←</span> {zurueck ? 'Zurück' : welt?.title}
      </a>
    </nav>
  );
}
