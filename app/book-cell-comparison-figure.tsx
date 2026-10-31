import {useId, useState} from 'react';
import {CELL_EXAMPLES, cellExample} from './book-cell-comparison-model';
import type {CellExample} from './book-cell-comparison-model';

const EXAMPLE_KEYS: CellExample[] = ['nucleated-human', 'bacterium', 'mature-human-red-cell'];

export function CellComparisonFigure({initialExample = 'nucleated-human'}: {initialExample?: CellExample}) {
  const id = useId();
  const [selected, setSelected] = useState<CellExample>(initialExample);
  const example = cellExample(selected);
  return <figure className="book-cell-comparison" aria-labelledby={id + '-heading'}>
    <figcaption>
      <p className="model-caption">Eigene Modellskizze · KI-unterstützt</p>
      <h4 id={id + '-heading'}>Kein Kern – auch keine DNA?</h4>
      <p>Vergleiche Kernhülle und DNA in drei bekannten Zellbeispielen.</p>
    </figcaption>
    <div className="book-cell-comparison__choices" role="group" aria-label="Bekanntes Zellenbeispiel auswählen">
      {EXAMPLE_KEYS.map(key => <button type="button" key={key} aria-pressed={key === selected}
        onClick={() => setSelected(key)}>{CELL_EXAMPLES[key].label}</button>)}
    </div>
    <h5>{example.title}</h5>
    <svg viewBox="0 0 280 220" role="img" aria-labelledby={id + '-title ' + id + '-description'}>
      <title id={id + '-title'}>{example.label}: vereinfachtes Strukturschema</title>
      <desc id={id + '-description'}>
        Eine äußere Linie steht für die Zellmembran.
        {example.nucleus ? ' Ein Doppelring zeigt eine Kernhülle. DNA liegt im Kern und in einem gezeichneten Mitochondrium.' :
          example.dna ? ' DNA ist als gewellte Linie im Zellinneren dargestellt, ohne Kernhülle.' :
            ' Im Beispiel der reifen roten Blutzelle sind weder Kern noch Mitochondrien oder DNA dargestellt.'}
        Alle Formen, Größen, Anzahlen und Positionen sind frei gewählte Symbole.
      </desc>
      <ellipse cx="140" cy="105" rx="110" ry="75" className="book-cell-comparison__membrane"/>
      {example.nucleus && <g>
        <circle cx="130" cy="95" r="31" className="book-cell-comparison__nucleus"/>
        <circle cx="130" cy="95" r="25" className="book-cell-comparison__nucleus"/>
        <path d="M114 87C125 74 142 92 120 101S142 115 145 96" className="book-cell-comparison__dna"/>
      </g>}
      {example.mitochondria && <g>
        <ellipse cx="202" cy="133" rx="23" ry="14" className="book-cell-comparison__mitochondrion"/>
        <path d="M187 133L193 127L198 138L204 126L211 138L217 132" className="book-cell-comparison__inner-membrane"/>
        <path d="M197 131C198 127 205 127 205 132C205 138 197 138 197 131Z" className="book-cell-comparison__dna"/>
      </g>}
      {!example.nucleus && example.dna && <path
        d="M83 89C103 58 176 84 137 113S201 143 209 108M94 119C99 137 129 131 118 115"
        className="book-cell-comparison__dna"/>}
    </svg>
    <dl className="book-cell-comparison__facts">
      <div><dt>Kernhülle</dt><dd>{example.nucleus ? 'im Beispiel vorhanden' : 'im Beispiel nicht vorhanden'}</dd></div>
      <div><dt>DNA</dt><dd>{example.dna ? example.dnaPlaces.join(' und ') : 'in dieser spezialisierten reifen Zelle nicht dargestellt'}</dd></div>
      <div><dt>Lebewesen gehört zu</dt><dd>{example.organismGroup === 'Eukaryot' ? 'den Eukaryoten' : 'den Prokaryoten'}</dd></div>
    </dl>
    <p role="status">{example.explanation}</p>
    <p className="model-caption">Die Herkunft der Beispiele ist bekannt. Aus einem fehlenden Kerns­ymbol allein
      lässt sich keine unbekannte Zelle bestimmen. Die Zeichnung ist keine Aufnahme und kein Größenvergleich.</p>
  </figure>;
}
