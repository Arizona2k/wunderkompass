import {useId,useState,type ReactNode} from 'react';
import {GENE_OUTPUTS,NUCLEOTIDE_TYPES,RNA_ROLES,selectCase} from './book-gene-models';
export function GeneFrame({kind,title,description,children}:{kind:string;title:string;description:string;children:ReactNode}){
 const id=useId();return <figure className="book-gene-model" data-gene-model={kind} aria-labelledby={id}><figcaption><p className="model-caption">Eigene Modellskizze · KI-unterstützt</p><h4 id={id}>{title}</h4><p>{description}</p></figcaption>{children}</figure>;
}
export function GeneOutputFigure(){
 const [selected,setSelected]=useState(0),state=selectCase(GENE_OUTPUTS,selected),id=useId();
 return <GeneFrame kind="gene-output" title="Ein Gen, unterschiedliche Ergebnisse" description="Vergleiche zwei gedachte Gene. Nicht jedes Gen führt zu einem Protein.">
  <div className="book-gene-choices" role="group" aria-label="Gedachtes Gen auswählen">{GENE_OUTPUTS.map((s,i)=><button type="button" key={s.key} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{s.label}</button>)}</div>
  <svg viewBox="0 0 320 140" role="img" aria-labelledby={id+'-title '+id+'-desc'}><title id={id+'-title'}>Ein markierter Genabschnitt innerhalb einer längeren DNA</title><desc id={id+'-desc'}>Eine Linie setzt sich links und rechts eines umrahmten Abschnitts fort. Der Rahmen markiert nur einen Ausschnitt. Länge, Abgrenzung und Formen sind erfunden, keine vollständige Genkarte.</desc><path className="gene-line" d="M18 70H302"/><rect className="gene-accent" x="105" y="38" width="110" height="64" rx="8"/><text x="160" y="78" textAnchor="middle">Gen</text></svg>
  <ol className="book-gene-route" aria-label="Vereinfachter Informationsweg"><li><strong>DNA-Abschnitt</strong><p>Information liegt in einem bestimmten Abschnitt der DNA.</p></li><li><strong>RNA</strong><p>{state.rnaRole}</p></li><li><strong>{state.protein?'Protein':'Aufgabe der RNA'}</strong><p>{state.protein?'Aus der Information kann ein Protein hergestellt werden.':'In diesem Beispiel entsteht keine Protein-Nachricht. Die RNA wirkt selbst.'}</p></li></ol>
  <p role="status">{state.label}: {state.protein?'Der vereinfachte Weg enthält RNA und anschließend ein Protein.':'Das Beispiel endet bei einer RNA mit eigener Aufgabe.'}</p><p className="model-caption">Zwei unterschiedliche Beispiele, keine lückenlose Reaktionskette und keine Vorhersage von Merkmalen. Der gezeichnete Rahmen hat keine gemessene Genlänge.</p>
 </GeneFrame>;
}
export function NucleotidePartsFigure(){
 const [selected,setSelected]=useState(0),state=selectCase(NUCLEOTIDE_TYPES,selected),id=useId();
 return <GeneFrame kind="nucleotide-parts" title="Drei Teile bilden einen Baustein" description="Wähle DNA oder RNA und vergleiche Zucker und Basenauswahl.">
  <div className="book-gene-choices" role="group" aria-label="Nukleotidart auswählen">{NUCLEOTIDE_TYPES.map((s,i)=><button type="button" key={s.key} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{s.key}</button>)}</div>
  <svg viewBox="0 0 320 160" role="img" aria-labelledby={id+'-title '+id+'-desc'}><title id={id+'-title'}>{state.key}-Nukleotid: Phosphat, Zucker und Base</title><desc id={id+'-desc'}>Ein Kreis, ein Fünfeck und ein Rechteck sind verbunden. Die Zahlen eins, zwei und drei verweisen auf die Textlegende. Sie geben weder Atomzahlen noch Molekülformen an.</desc><path className="gene-line" d="M58 82H120M184 82H248"/><circle className="gene-form" cx="42" cy="82" r="28"/><path className="gene-form" d="M160 43L197 70L184 113H136L123 70Z"/><rect className="gene-accent" x="248" y="54" width="58" height="56" rx="6"/>{[[42,1],[160,2],[277,3]].map(([x,n])=><text key={n} x={x} y="90" textAnchor="middle">{n}</text>)}</svg>
  <ol><li>Phosphatgruppe</li><li>Zucker: {state.sugar}</li><li>Eine Base aus der Auswahl {state.bases.join(', ')}</li></ol><p role="status">{state.key}: {state.sugar}; mögliche Basen {state.bases.join(', ')}. Ein Nukleotid enthält eine dieser Basen.</p><p className="model-caption">Ein Baustein, kein ganzes Gen. Die Formen und Linien erklären nur die Gliederung; sie sind keine chemische Strukturformel und zeigen keine tatsächlichen Größen oder Bindungswinkel.</p>
 </GeneFrame>;
}
export function RNARolesFigure(){
 const [selected,setSelected]=useState(0),state=selectCase(RNA_ROLES,selected),id=useId();
 return <GeneFrame kind="rna-roles" title="RNA kann mehr als Nachrichten tragen" description="Drei ausgewählte Rollen bei der Herstellung von Proteinen.">
  <div className="book-gene-choices" role="group" aria-label="RNA-Beispiel auswählen">{RNA_ROLES.map((s,i)=><button type="button" key={s.key} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{s.key} · {s.label}</button>)}</div>
  <svg viewBox="0 0 320 180" role="img" aria-labelledby={id+'-title '+id+'-desc'}><title id={id+'-title'}>{state.key}: {state.label}</title><desc id={id+'-desc'}>Drei nummerierte Arbeitsbereiche: eins steht für die Information, zwei für den Herstellungsort, drei für die Zuordnung von Aminosäuren. Nur der gewählte Bereich wird zusätzlich umrandet. Es sind keine echten RNA-Formen.</desc>{[0,1,2].map(i=><g key={i}><rect className={i===selected?'gene-accent':'gene-form'} x={12+i*106} y="45" width="84" height="84" rx="10" style={{strokeWidth:i===selected?4:2}}/><text x={54+i*106} y="96" textAnchor="middle">{i+1}</text></g>)}</svg>
  <ol><li>mRNA: Information für die Proteinherstellung</li><li>rRNA: Bestandteil und Mitwirkung am Ribosom</li><li>tRNA: passende Aminosäuren bei der Herstellung zuordnen</li></ol><p role="status">{state.description}</p><p className="model-caption">Die Nummern bezeichnen Rollen, keine zeitliche Reihenfolge. Es gibt weitere RNA-Aufgaben, etwa Regulation. Die Kästchen sind weder Molekülformen noch ein vollständiger Ablauf.</p>
 </GeneFrame>;
}
