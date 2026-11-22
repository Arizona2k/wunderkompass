'use client';
// Größen- oder Gewichtsvergleich eines Tiers (verschoben aus der alten Karte, Inhalt unverändert).
// Speichert unter dem Spielstand der Karte (topic:<id>) mit dem alten Schlüssel compareAnimal.
import {useSavedGame} from '../../saved-games';
import type {WorldTopic} from '../../world-types';

export default function AnimalMeasure({topic: t}: {topic: WorldTopic}) {
  const a = t.animal!;
  const [compare, setCompare] = useSavedGame('compareAnimal', false);
  const s = a.size;
  const weight = s.unit === 'kg' || s.unit === 'g';
  const reference = s.unit === 'm' ? 1.7 : s.unit === 'cm' ? 100 : s.unit === 'mm' ? 10 : s.unit === 'g' ? 100 : 50;
  const max = Math.max(s.max, reference);
  const number = (value: number) => value.toLocaleString('de-DE', {maximumFractionDigits: 3});
  return (
    <section className="animal-measure">
      <h3>{weight ? 'Ein Gefühl für das Gewicht' : 'Ein Gefühl für die Größe'}</h3>
      <p>{s.measurement_de}: {s.text_de}</p>
      <button className="secondary-button" aria-expanded={compare} onClick={() => setCompare(v => !v)}>
        {weight ? 'Einen Gewichtsvergleich zeigen' : 'Einen Größenvergleich zeigen'}
      </button>
      {compare && <>
        <div className="measure-bars">
          <div>
            <span>{t.title}</span>
            <div style={{width: Math.max(3, s.max / max * 100) + '%'}}/>
            <strong>{s.kind === 'typical' ? 'etwa' : 'bis etwa'} {number(s.max)} {s.unit}</strong>
          </div>
          <div>
            <span>{s.unit === 'm' ? 'Vergleichsperson (Höhe)' : s.unit === 'cm' ? 'Ein Meter' : s.unit === 'mm' ? 'Ein Zentimeter' : 'Vergleichsgewicht'}</span>
            <div style={{width: Math.max(3, reference / max * 100) + '%'}}/>
            <strong>{number(reference)} {s.unit}</strong>
          </div>
        </div>
        <p className="small-note">
          {s.kind === 'upper-bound'
            ? 'Der Balken zeigt nur den genannten oberen Vergleichswert, keinen Mindestwert oder Durchschnitt.'
            : s.kind === 'typical'
              ? 'Der Balken zeigt einen ungefähren Vergleichswert, keine Obergrenze.'
              : 'Der Balken zeigt den oberen Wert der beschriebenen Spanne, keinen Durchschnitt.'}
          {' '}
          {s.unit === 'm'
            ? 'Die Beispielperson ist 1,70 m hoch. Tierlänge und Tierhöhe sind unterschiedliche Messrichtungen.'
            : weight
              ? number(reference) + ' ' + s.unit + ' ist ein frei gewähltes Vergleichsgewicht, keine Altersangabe.'
              : 'Der Vergleich verwendet die gleiche Maßeinheit. Körperlänge, Flügellänge und Gehäusebreite sind unterschiedliche Messrichtungen.'}
        </p>
      </>}
    </section>
  );
}
