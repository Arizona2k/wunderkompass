import {useId, useState} from 'react';
import {DNA_BASES, compareDNASequences} from './book-cell-dna-model';

const EXAMPLE = compareDNASequences('AATT', 'ATAT');
const OPTIONS = [EXAMPLE.first, EXAMPLE.second];

export function DNAOrderFigure() {
  const id = useId();
  const [selected, setSelected] = useState(0);
  const example = OPTIONS[selected];
  return <figure className="book-dna-order-figure" aria-labelledby={id + '-heading'}>
    <figcaption>
      <p className="model-caption">Eigene Modellskizze · KI-unterstützt</p>
      <h4 id={id + '-heading'}>Gleich viele Bausteine, andere Reihenfolge</h4>
      <p>Gleiche Anzahl, andere Reihenfolge: Wechsle die erfundenen Folgen.</p>
    </figcaption>
    <div className="book-dna-order-figure__choices" role="group" aria-label="Zeichenfolge auswählen">
      {OPTIONS.map((option, index) => <button key={option.sequence} type="button"
        aria-pressed={selected === index} onClick={() => setSelected(index)}>
        Folge {option.sequence}
      </button>)}
    </div>
    <svg viewBox="0 0 280 170" role="img" aria-labelledby={id + '-title ' + id + '-description'}>
      <title id={id + '-title'}>Zeichenfolge {example.sequence} mit den zugehörigen Basenpaaren</title>
      <desc id={id + '-description'}>
        Die obere Folge lautet {example.sequence}, die zugehörigen Zeichen darunter {example.partner}.
        A ist mit T verbunden und C mit G. Dies ist eine Zeichenhilfe, keine räumliche DNA-Struktur.
      </desc>
      {example.bases.map((base, index) => {
        const x = 40 + index * 66;
        return <g key={index}>
          <path d={`M${x} 67V103`} className="book-dna-order-figure__pair"/>
          <circle cx={x} cy="46" r="21" className="book-dna-order-figure__base"/>
          <circle cx={x} cy="124" r="21" className="book-dna-order-figure__base book-dna-order-figure__base--partner"/>
          <text x={x} y="46" textAnchor="middle" dominantBaseline="central">{base}</text>
          <text x={x} y="124" textAnchor="middle" dominantBaseline="central">{example.partner[index]}</text>
        </g>;
      })}
    </svg>
    <dl className="book-dna-order-figure__counts" aria-label="Anzahl der Zeichen in der oberen Folge">
      {DNA_BASES.map(base => <div key={base}><dt>{base}</dt><dd>{example.counts[base]}</dd></div>)}
    </dl>
    <p role="status">Ausgewählt: {example.sequence}. Beide Beispiele enthalten zwei A und zwei T.
      Ihre Reihenfolge ist verschieden.</p>
    <p className="model-caption">Vier Zeichen als Denkbeispiel. Strangrichtung, räumliche Form und weitere
      Bestandteile sind ausgelassen. Daraus lassen sich keine Eigenschaften eines Menschen ablesen.</p>
  </figure>;
}
