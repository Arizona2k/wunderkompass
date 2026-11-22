'use client';
// Das Bild einer Wissenskarte, groß im Kartenkopf oder klein auf einer Kachel.
// Reihenfolge (Bildregel 6.3): freies Foto, sonst eigene Zeichnung, sonst die Motivkachel in der Weltfarbe.
import WorldPhoto from '../../world-media';
import TopicIllustration, {hasTopicIllustration} from '../../topic-illustration';
import {WORLD_ICONS} from '../../world-icons';
import {WORLD_CATEGORIES} from '../../world-index';
import {displayTopicTitle} from '../../topic-title';
import type {WorldEntry} from '../../world-types';
import {bildArt} from './karten-daten';
import './karte.css';

type KartenbildProps = {
  topic: WorldEntry;
  groesse: 'gross' | 'kachel';
  // Nur groß: die Nachweiszeile direkt unter dem Foto. Kacheln zeigen nie eine;
  // ihre Nachweise stehen im Block „Bildnachweise auf dieser Seite“.
  nachweis?: boolean;
};

export default function Kartenbild({topic, groesse, nachweis = false}: KartenbildProps) {
  const art = bildArt(topic, hasTopicIllustration(topic.id));
  const kachel = groesse === 'kachel';
  const kennwort = art.art === 'motiv' ? undefined : art.kennwort;
  return (
    <div className={`kartenbild kartenbild-${groesse} kartenbild-welt-${topic.category}`} data-bildart={art.art}>
      {art.art === 'foto' && (kachel
        ? <WorldPhoto id={art.photoId} compact credit={false}/>
        : <WorldPhoto id={art.photoId} credit={nachweis} eager/>)}
      {art.art === 'zeichnung' && <TopicIllustration id={topic.id} compact={kachel}/>}
      {art.art === 'motiv' && <Motivkachel topic={topic}/>}
      {kennwort && <span className="kartenbild-kennwort">{kennwort}</span>}
    </div>
  );
}

// Kein Foto, keine Zeichnung: Weltfarbe, großes Weltsymbol und Titel. Rein schmückend,
// denn der Titel steht auf jeder Karte und Kachel ohnehin als Text daneben.
function Motivkachel({topic}: {topic: WorldEntry}) {
  const welt = WORLD_CATEGORIES.find(c => c.id === topic.category);
  const Symbol = WORLD_ICONS[(welt?.icon ?? 'Search') as keyof typeof WORLD_ICONS];
  return (
    <div className="kartenbild-motiv" aria-hidden="true">
      <Symbol className="kartenbild-symbol" strokeWidth={1.5}/>
      <span className="kartenbild-motiv-titel">{displayTopicTitle(topic.title)}</span>
    </div>
  );
}
