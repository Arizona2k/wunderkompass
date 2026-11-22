'use client';
// „Bildnachweise auf dieser Seite“: Urheber, Lizenz, Quelle und Bearbeitung für jedes Foto der Seite,
// auch für die Kachel-Fotos, die selbst keine Nachweiszeile zeigen.
// Die vollen Fotodaten lädt der Block erst beim ersten Aufklappen (geprüft, wie in world-media.tsx).
import {useState} from 'react';
import {ladeFotoDaten} from '../../world-media';
import FOTO_IDS from '../../world-photo-ids.json';
import type {WorldPhotoData} from '../../world-types';
import {bildnachweisListe} from './karten-daten';
import './karte.css';

type Zustand = {art: 'zu'} | {art: 'laedt'} | {art: 'fertig'; fotos: Record<string, WorldPhotoData>} | {art: 'fehler'};

export default function BildnachweiseAufDieserSeite({photoIds}: {photoIds: readonly string[]}) {
  const [zustand, setZustand] = useState<Zustand>({art: 'zu'});
  const ids = [...new Set(photoIds)].filter(id => FOTO_IDS.includes(id));
  if (!ids.length) return null;

  const laden = () => {
    setZustand({art: 'laedt'});
    ladeFotoDaten().then(fotos => setZustand({art: 'fertig', fotos}), () => setZustand({art: 'fehler'}));
  };

  return (
    <details className="bildnachweise" onToggle={event => { if (event.currentTarget.open && zustand.art === 'zu') laden(); }}>
      <summary>Bildnachweise auf dieser Seite</summary>
      {zustand.art === 'laedt' && <p role="status">Die Bildnachweise werden geladen …</p>}
      {zustand.art === 'fehler' && (
        <div role="status">
          <p>Die Bildnachweise konnten nicht sicher geladen werden.</p>
          <button type="button" className="secondary-button" onClick={laden}>Noch einmal versuchen</button>
        </div>
      )}
      {zustand.art === 'fertig' && (
        <ul>
          {bildnachweisListe(ids, zustand.fotos).map(eintrag => (
            <li key={eintrag.photoId}>
              <p className="bildnachweis-motiv">{eintrag.alt}</p>
              <p>
                {eintrag.author} · <a href={eintrag.licenseUrl} target="_blank" rel="noreferrer">{eintrag.license}</a>
                {' · '}<a href={eintrag.sourceUrl} target="_blank" rel="noreferrer">Original und Rechte</a>
              </p>
              {eintrag.changes && <p>Bearbeitung: {eintrag.changes}</p>}
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}
