import {useId, useState, type ReactNode} from 'react';
import {GENOME_COLLECTIONS, genomeCollection, membraneExample, mitochondrialExample, type MembraneRoute, type MitochondrialView} from './book-cell-process-model';

function Frame({kind, title, description, children}: {kind: string; title: string; description: string; children: ReactNode}) {
  const id = useId();
  return <figure className="book-cell-process" data-cell-process={kind} aria-labelledby={id}>
    <figcaption><p className="model-caption">Eigene Modellskizze · KI-unterstützt</p><h4 id={id}>{title}</h4><p>{description}</p></figcaption>{children}
  </figure>;
}
function Arrow({x, y, end, vertical = false, dashed = false}: {x: number; y: number; end: number; vertical?: boolean; dashed?: boolean}) {
  return <g className="cell-process-arrow"><path d={vertical ? `M${x} ${y}V${end}` : `M${x} ${y}H${end}`} strokeDasharray={dashed ? '5 4' : undefined}/><path d={vertical ? `M${x - 5} ${end - 8}L${x} ${end}L${x + 5} ${end - 8}` : `M${end - 8} ${y - 5}L${end} ${y}L${end - 8} ${y + 5}`}/></g>;
}
export function CellMembraneFigure() {
  const id = useId(), [route, setRoute] = useState<MembraneRoute>('unavailable'), state = membraneExample(route);
  return <Frame kind="membrane" title="Eine Grenze und ein ausgewählter Weg" description="Ein gedachter Stoff, zwei vereinfachte Situationen.">
    <div className="cell-process-choices" role="group" aria-label="Transportweg im Gedankenbeispiel">
      {(['unavailable', 'matching-protein'] as const).map(value => <button type="button" key={value} aria-pressed={route === value} onClick={() => setRoute(value)}>{value === 'unavailable' ? 'Ohne passenden Weg' : 'Mit passendem Transportprotein'}</button>)}
    </div>
    <svg viewBox="0 0 280 190" role="img" aria-labelledby={id + '-title ' + id + '-desc'} data-membrane-crosses={state.crosses}>
      <title id={id + '-title'}>{state.crosses ? 'Der ausgewählte Weg führt durch die gedachte Membran' : 'Kein Durchtritt im ausgewählten Beispiel'}</title>
      <desc id={id + '-desc'}>Zwei senkrechte Linien stehen für die Lipiddoppelschicht. Der Pfeil endet {state.crosses ? 'hinter einem gezeichneten Transportprotein' : 'vor dieser Schicht'}. Kreise sind erfundene Stoffsymbole. Die Skizze bildet weder Molekülform noch einen vollständigen Transportmechanismus ab.</desc>
      <g className="cell-process-membrane"><path d="M125 20V170M155 20V170"/>{[32,54,76,98,120,142,164].map(y => <g key={y}><circle cx="125" cy={y} r="4"/><circle cx="155" cy={y} r="4"/></g>)}</g>
      {state.crosses && <rect data-matching-protein="true" x="115" y="69" width="50" height="42" rx="9" className="cell-process-protein"/>}
      <circle cx="43" cy="90" r="12" className="cell-process-symbol"/><Arrow x={63} y={90} end={state.crosses ? 225 : 98}/>
      {state.crosses && <circle cx="245" cy="90" r="12" className="cell-process-symbol"/>}
    </svg>
    <p role="status">{state.statement}</p><ol><li>Links und rechts liegen verschiedene Seiten der Zellmembran. Die Linien bedeuten keine zusätzliche Zellwand.</li><li>Der gewählte gedachte Stoff gelangt hier nicht unmittelbar durch die Lipidschicht. Das Protein ist ein symbolischer passender Weg. Andere Stoffe können andere Wege benötigen oder unmittelbar durch die Lipidschicht gelangen.</li><li>Die Pfeillänge misst weder Zeit noch Stoffmenge. Energiebedarf und einzelne Transportschritte werden nicht dargestellt.</li></ol>
  </Frame>;
}
export function CellMitochondrionFigure() {
  const id = useId(), [view, setView] = useState<MitochondrialView>('structure'), state = mitochondrialExample(view);
  return <Frame kind="mitochondrion" title="Aufbau und Energieumwandlung verbinden" description="Eine Skizze, zwei Blickwinkel: Aufbau und Energieumwandlung.">
    <div className="cell-process-choices" role="group" aria-label="Mitochondrium betrachten">{(['structure', 'conversion'] as const).map(value => <button type="button" key={value} aria-pressed={view === value} onClick={() => setView(value)}>{value === 'structure' ? 'Aufbau ansehen' : 'Energieumwandlung verfolgen'}</button>)}</div>
    <svg viewBox="0 0 280 210" role="img" aria-labelledby={id + '-title ' + id + '-desc'} data-mitochondrial-view={view}>
      <title id={id + '-title'}>Mitochondrium: {view === 'structure' ? 'zwei Membranen und eigene DNA' : 'chemische Energie wird umgewandelt'}</title>
      <desc id={id + '-desc'}>Eine äußere Umrandung und eine gefaltete innere Linie stehen für zwei Membranen. Eine kleine Schleife im Inneren symbolisiert eigene DNA. {state.showConversion ? 'Ein Pfeil führt hinein, einer führt rechts hinaus und ein weiterer nach unten. Die Textlegende unterscheidet chemische Ausgangsbedingungen, ATP-Bildung und Wärme.' : 'Die Skizze zeigt keine gemessenen Größen oder Anzahlen.'}</desc>
      <ellipse cx="140" cy="91" rx="78" ry="48" className="cell-process-organelle"/>
      <path d="M80 90C80 66 100 56 116 61L116 88Q122 100 128 88L128 62Q134 58 140 61L140 90Q146 102 152 90L152 63C175 62 198 77 199 93C197 115 177 126 154 125C132 128 103 121 89 110Q80 102 80 90Z" className="cell-process-fold"/>
      <path d="M167 112C167 106 179 106 179 112C179 118 167 118 167 112Z" className="cell-process-dna"/>
      {state.showConversion && <g data-energy-conversion-arrows="true"><Arrow x={8} y={91} end={58}/><Arrow x={220} y={91} end={270}/><Arrow x={140} y={146} end={194} vertical dashed/></g>}
    </svg>
    <p role="status">{state.statement}</p><ol><li>Die Umrandung stellt die äußere Membran dar; die gefaltete Linie die innere. Die kleine Schleife steht für mitochondriale DNA.</li><li>Bei der Umwandlungsansicht steht der linke Pfeil für chemische Ausgangsbedingungen. Der rechte verbindet sie mit der Bildung von ATP; der untere steht für die Abgabe von Wärme.</li><li>ATP ist ein Stoff, mit dem chemische Energie zwischen Zellvorgängen übertragen werden kann. Pfeile und Faltungen sind keine vollständige Reaktionskette, Mengenbilanz, Messung oder medizinische Prüfung. Nicht jeder Zelltyp besitzt Mitochondrien.</li></ol>
  </Frame>;
}
export function CellGenomeFigure() {
  const id = useId(), [selected, setSelected] = useState(0), example = genomeCollection(selected);
  return <Frame kind="genome" title="Eine Sammlung kann mehrere Orte umfassen" description="Kern-DNA und mitochondriale DNA: eine Gesamtheit, mehrere Bereiche.">
    <div className="cell-process-choices" role="group" aria-label="Erfundene Sammlung auswählen">{GENOME_COLLECTIONS.map((value, index) => <button type="button" key={value.key} aria-pressed={selected === index} onClick={() => setSelected(index)}>{value.label}</button>)}</div>
    <svg viewBox="0 0 280 210" role="img" aria-labelledby={id + '-title ' + id + '-desc'} data-genome-example={example.key}>
      <title id={id + '-title'}>{example.symbols} Zeichen in zwei gedachten Aufbewahrungsbereichen</title>
      <desc id={id + '-desc'}>Eine große Umrandung umfasst beide Bereiche. Links stehen {example.nuclear.join(', ')} als Zeichen für Ausschnitte der Kern-DNA, rechts {example.mitochondrial.join(', ')} als Zeichen für einen Ausschnitt mitochondrialer DNA. Diese erfundenen Zeichen sind weder echte Gene noch maßstäbliche Mengenverhältnisse.</desc>
      <rect x="10" y="12" width="260" height="185" rx="16" className="cell-process-collection"/>
      <rect x="27" y="34" width="125" height="140" rx="12" className="cell-process-organelle"/><rect x="174" y="69" width="73" height="69" rx="20" className="cell-process-organelle"/>
      {example.nuclear.map((part, index) => <text key={index} x="89" y={63 + index * 30} textAnchor="middle">{part}</text>)}<text x="210" y="109" textAnchor="middle">{example.mitochondrial[0]}</text>
    </svg>
    <p role="status">{example.symbols} gezeichnete Zeichen insgesamt. Die zusätzliche Länge verändert die Menge, beweist aber weder größere Klugheit noch höhere biologische Komplexität.</p><ol><li>Beim Menschen gehören Kern-DNA und mitochondriale DNA zum Genom. Links und rechts sind hier nur erfundene Ausschnitte dieser beiden Bereiche dargestellt. Die Umrandung umfasst die ganze Zeichensammlung.</li><li>Einzelne Zeichen und Zeichengruppen sind hier keine bestimmten Gene. Ein Gen ist ein Abschnitt der Erbinformation; nicht jeder frei gewählte Abschnitt ist deshalb ein Gen.</li><li>Sechs beziehungsweise zehn Zeichen statt echter Genome. Keine Größenverhältnisse, Eigenschaften oder Fähigkeiten eines wirklichen Lebewesens lassen sich daraus ableiten.</li></ol>
  </Frame>;
}
