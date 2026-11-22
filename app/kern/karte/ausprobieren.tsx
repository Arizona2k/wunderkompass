'use client';
// „Ausprobieren“: ein aufklappbarer Bereich, zu Beginn zu. Die Bausteine laden erst beim ersten Öffnen
// (eigenes Skript), damit die Karte schnell da ist. Das Skript liegt im Offline-Vorrat.
import {lazy, Suspense, useState} from 'react';
import LearningBoundary from '../../learning-boundary';
import type {WorldActions, WorldTopic} from '../../world-types';

const Bausteine = lazy(() => import('./bausteine'));

export default function Ausprobieren({topic, actions}: {topic: WorldTopic; actions: WorldActions}) {
  const [geoeffnet, setGeoeffnet] = useState(false);
  return (
    <details
      className="wissenskarte-ausprobieren wissenskarte-aufklapper"
      onToggle={event => { if (event.currentTarget.open) setGeoeffnet(true); }}
    >
      <summary>Ausprobieren</summary>
      {/* Lädt das Skript nicht, bleibt der Fehler in diesem Bereich; die Karte darüber bleibt stehen. */}
      {geoeffnet && (
        <LearningBoundary name="Ausprobieren">
          <Suspense fallback={<p className="wissenskarte-laedt" role="status">Einen Moment, gleich geht es los …</p>}>
            <Bausteine topic={topic} actions={actions}/>
          </Suspense>
        </LearningBoundary>
      )}
    </details>
  );
}
