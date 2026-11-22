'use client';
// „Dazu passt“: höchstens drei große Kacheln am Kartenende (Entwurf 6.3).
// 1. die erste erklärte Nachbarkarte mit Bild und Satz „warum“,
// 2. der Ort auf dem Globus (nur mit Orten),
// 3. der erste Link (Reise oder Labor) oder sonst das Spiel der Welt.
// Jede Kachel nimmt vor dem Wechsel den Fokus (Safari fokussiert Knöpfe beim Antippen nicht);
// so findet „Zurück“ die Kachel über data-route-focus wieder.
import type {MouseEvent} from 'react';
import {Compass, FlaskConical, Gamepad2, Globe2, Route} from 'lucide-react';
import {WORLD_INDEX, worldPlace} from '../../world-index';
import type {Mode} from '../../earth-data';
import type {WorldActions, WorldCategory, WorldTopic} from '../../world-types';
import Kartenbild from './kartenbild';
import type {DazuPasstKachel} from './karten-daten';

// Das Spiel jeder Welt, wie bisher auf der alten Karte („In dieser Welt spielen“).
const SPIEL_JE_WELT: Record<WorldCategory, string> = {
  science: 'knowledge-challenge',
  animals: 'animal-detective',
  history: 'chronology',
  people: 'people',
  inventions: 'technology',
  buildings: 'then-now',
};

const LINK_ART: Partial<Record<Mode, {text: string; Symbol: typeof Compass}>> = {
  journeys: {text: 'Eine Lernreise zum Mitmachen', Symbol: Route},
  labs: {text: 'Ein Labor zum Ausprobieren', Symbol: FlaskConical},
};

type DazuPasstProps = {
  topic: WorldTopic;
  actions: WorldActions;
  onTopic: (id: string) => void;
  kacheln: readonly DazuPasstKachel[];
  ueberschrift: 'h2' | 'h3';
};

export default function DazuPasst({topic: t, actions: a, onTopic, kacheln, ueberschrift: Ueberschrift}: DazuPasstProps) {
  const eintrag = WORLD_INDEX.find(e => e.id === t.id);
  // Erst den Fokus auf die Kachel, dann wechseln.
  const wechsel = (aktion: () => void) => (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.focus({preventScroll: true});
    aktion();
  };
  return (
    <section className="dazu-passt" aria-labelledby={'dazu-passt-' + t.id}>
      <Ueberschrift id={'dazu-passt-' + t.id}>Dazu passt</Ueberschrift>
      <div className="dazu-passt-kacheln">
        {kacheln.map(kachel => {
          if (kachel.art === 'karte') {
            const nachbar = WORLD_INDEX.find(e => e.id === kachel.topicId);
            if (!nachbar) return null;
            return (
              <button
                type="button"
                key="karte"
                className="dazu-passt-kachel dazu-passt-karte"
                data-route-focus={`world-connection-${t.id}-${nachbar.id}`}
                onClick={wechsel(() => onTopic(nachbar.id))}
              >
                <span className="dazu-passt-bild" aria-hidden="true"><Kartenbild topic={nachbar} groesse="kachel"/></span>
                <span className="dazu-passt-titel">{nachbar.title}</span>
                <span className="dazu-passt-text">{kachel.why}</span>
              </button>
            );
          }
          if (kachel.art === 'globus') {
            if (!eintrag) return null;
            return (
              <button
                type="button"
                key="globus"
                className="dazu-passt-kachel dazu-passt-globus"
                data-route-focus={'world-dazu-passt-globus-' + t.id}
                onClick={wechsel(() => a.onPlace(worldPlace(eintrag, 0)))}
              >
                <Symbolflaeche Symbol={Globe2}/>
                <span className="dazu-passt-titel">Auf dem Globus zeigen</span>
                <span className="dazu-passt-text">{t.locations[0].label}</span>
              </button>
            );
          }
          if (kachel.art === 'link') {
            const art = LINK_ART[kachel.mode] ?? {text: 'Weiterentdecken', Symbol: Compass};
            return (
              <button
                type="button"
                key="link"
                className="dazu-passt-kachel dazu-passt-link"
                data-route-focus={'world-dazu-passt-link-' + t.id}
                onClick={wechsel(() => a.onNavigate(kachel.mode, kachel.id, kachel.iso))}
              >
                <Symbolflaeche Symbol={art.Symbol}/>
                <span className="dazu-passt-titel">{kachel.label}</span>
                <span className="dazu-passt-text">{art.text}</span>
              </button>
            );
          }
          return (
            <button
              type="button"
              key="spiel"
              className="dazu-passt-kachel dazu-passt-spiel"
              data-route-focus={'world-dazu-passt-spiel-' + t.id}
              onClick={wechsel(() => a.onGame(SPIEL_JE_WELT[t.category]))}
            >
              <Symbolflaeche Symbol={Gamepad2}/>
              <span className="dazu-passt-titel">In dieser Welt spielen</span>
              <span className="dazu-passt-text">Ein kurzes Spiel aus dieser Welt</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// Kacheln ohne Foto: großes Symbol auf der Weltfarbe, rein schmückend.
function Symbolflaeche({Symbol}: {Symbol: typeof Compass}) {
  return (
    <span className="dazu-passt-bild dazu-passt-symbol" aria-hidden="true">
      <Symbol strokeWidth={1.5}/>
    </span>
  );
}
