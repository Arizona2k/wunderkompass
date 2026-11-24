'use client';
// „Ausprobieren“: ein aufklappbarer Bereich, zu Beginn zu. Die Bausteine laden erst beim ersten Öffnen
// (eigenes Skript), damit die Karte schnell da ist. Das Skript liegt im Offline-Vorrat.
import {Component, lazy, Suspense, useState, type ReactNode} from 'react';
import {LearningStatus} from '../../learning-components';
import type {WorldActions, WorldTopic} from '../../world-types';
import {ganzEinfachImAusprobieren} from './karten-daten';

const laden = () => import('./bausteine');
// Für alle Karten gemeinsam: Ist das Skript einmal da, erscheinen die Bausteine jeder Karte sofort.
let Bausteine = lazy(laden);

// Stile, die nicht laden konnten. Vite merkt sich jede Stil-Datei und fragt sie kein zweites Mal an;
// darum ersetzt ein neuer Versuch diese Einträge selbst durch frische.
const gescheiterteStile = new Set<HTMLLinkElement>();
if (typeof document !== 'undefined') {
  document.addEventListener('error', event => {
    if (event.target instanceof HTMLLinkElement && event.target.rel === 'stylesheet') gescheiterteStile.add(event.target);
  }, true);
}

// React merkt sich ein gescheitertes Nachladen für immer; ein neuer Versuch braucht ein neues lazy().
function neuerVersuch() {
  for (const alt of gescheiterteStile) {
    const neu = alt.cloneNode() as HTMLLinkElement;
    alt.replaceWith(neu);
  }
  gescheiterteStile.clear();
  Bausteine = lazy(laden);
}

// Eigene Fehlergrenze statt LearningBoundary: Deren Knopf lädt die Seite neu (offline ohne Vorrat wäre die App
// dann weg), und sie liegt im Start-Skript. Diese hier versucht es nur in diesem Bereich noch einmal.
class NochEinmal extends Component<{children: ReactNode; onRetry: () => void}, {failed: boolean}> {
  state = {failed: false};
  static getDerivedStateFromError() { return {failed: true}; }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <LearningStatus tone="error" className="error-learning" action={<button className="primary-button" onClick={this.props.onRetry}>Noch einmal versuchen</button>}>
        <strong>Ausprobieren braucht noch einen Versuch.</strong><br/>Dein Entdeckerpass bleibt gespeichert.
      </LearningStatus>
    );
  }
}

export default function Ausprobieren({topic, actions}: {topic: WorldTopic; actions: WorldActions}) {
  const [geoeffnet, setGeoeffnet] = useState(false);
  const [versuch, setVersuch] = useState(0);
  return (
    <details
      className="wissenskarte-ausprobieren wissenskarte-aufklapper"
      onToggle={event => { if (event.currentTarget.open) setGeoeffnet(true); }}
    >
      <summary>Ausprobieren</summary>
      {/* Karten mit Häppchen und Personenkarten zeigen „Ganz einfach“ nicht in „Kurz erklärt“. Bei Personen ist der Satz
          meist die Anleitung zum Versuch hier unten; darum steht er über den Bausteinen und ist sofort da (große Prüfung,
          Aufgabe 13; Teilschritt 3, E12). kartenFeldFehler meldet solche Karten, die kein „Ausprobieren“ haben. */}
      {ganzEinfachImAusprobieren(topic) && <p className="wissenskarte-ausprobieren-einstieg">{topic.learning?.starter}</p>}
      {/* Lädt das Skript nicht, bleibt der Fehler in diesem Bereich; die Karte darüber bleibt stehen. */}
      {geoeffnet && (
        <NochEinmal key={versuch} onRetry={() => { neuerVersuch(); setVersuch(n => n + 1); }}>
          <Suspense fallback={<p className="wissenskarte-laedt" role="status">Einen Moment, gleich geht es los …</p>}>
            <Bausteine topic={topic} actions={actions}/>
          </Suspense>
        </NochEinmal>
      )}
    </details>
  );
}
