// Separate own authoring; the active PR90 application does not import this file.
type Props={selected:number;onSelect:(value:number)=>void};
const INK='#234e58',BLUE='#467889',ORANGE='#b7572f';
function Choice({labels,name,selected,onSelect}:{labels:[string,string];name:string}&Props){return <div className="visual-choice" role="group" aria-label={name}>{labels.map((label,i)=><button key={label} aria-pressed={selected===i} onClick={()=>onSelect(i)}>{label}</button>)}</div>;}
function Fish({x,y,large=false,former=false}:{x:number;y:number;large?:boolean;former?:boolean}){const rx=large?49:31,ry=large?28:19;return <g transform={'translate('+x+' '+y+')'} fill={former?'#fff':'#d6e5e4'} stroke={former?'#71858a':INK} strokeWidth="2.5" strokeDasharray={former?'5 4':undefined}><path d={'M'+(-rx+3)+' 0L'+(-rx-20)+' '+(-ry)+'V'+ry+'Z'}/><ellipse rx={rx} ry={ry}/><circle cx={rx-10} cy="-5" r="2" fill={INK} stroke="none"/></g>;}
export function FoodTransferEvidenceFigure({selected,onSelect}:Props){const after=selected===1;return <>
 <h4>Wohin gelangen dieselben vier Markierungen?</h4>
 <p>Erfundenes Zählbild: Zwei Beutetiere tragen je zwei Stoffmarkierungen. Das größere Tier frisst beide. Nur für dieses Beispiel nehmen wir vollständige Weitergabe ohne Abbau oder Ausscheidung an.</p>
 <svg viewBox="0 0 340 230" role="img" aria-label={after?'Eigene erfundene Stoffweitergabe: vier Markierungen beim größeren Tier. Die gestrichelten Beuteumrisse zeigen die vorherigen Positionen; beide Beutetiere sind als Nahrung aufgenommen.':'Eigene erfundene Ausgangslage: zwei Markierungen beim ersten und zwei beim zweiten Beutetier, keine beim größeren Tier. Insgesamt vier.'} data-food-transfer={after?'after':'before'}>
  <path d="M112 64L190 100M183 88L190 100L176 101M112 166L190 130M176 129L190 130L183 142" fill="none" stroke={INK} strokeWidth="3"/>
  <Fish x={73} y={63} former={after}/><Fish x={73} y={168} former={after}/><Fish x={265} y={115} large/>
  {!after&&[63,168].flatMap(y=>[65,81].map(x=><circle key={x+':'+y} cx={x} cy={y} r="5" fill={ORANGE}/>))}
  {after&&[[-12,-8],[5,-8],[-12,8],[5,8]].map(([x,y],i)=><circle key={i} cx={265+x} cy={115+y} r="5" fill={ORANGE}/>)}
  {[[73,25,'1'],[73,131,'2'],[265,62,'3']].map(([x,y,label])=><text key={label} x={x} y={y} fontSize="24" textAnchor="middle" fill={INK}>{label}</text>)}
 </svg>
 <ol className="people-evidence-legend"><li>Erstes Beutetier: vorher zwei Markierungen{after?'; danach als Nahrung aufgenommen':''}.</li><li>Zweites Beutetier: vorher zwei Markierungen{after?'; danach als Nahrung aufgenommen':''}.</li><li>Größeres Tier: {after?'danach vier':'vorher keine'} Markierungen.</li></ol>
 <Choice {...{selected,onSelect}} name="Vorher und nachher im erfundenen Stoffweg vergleichen" labels={['Vor der Futteraufnahme','Nach zwei Beutetieren']}/>
 <p className="people-evidence-observation" role="status">{after?'Alle vier Markierungen sind jetzt beim größeren Tier. Die gestrichelten Umrisse zeigen die früheren Positionen der gefressenen Beutetiere. Es entstehen keine zusätzlichen Markierungen.':'Die vier Markierungen verteilen sich zunächst auf zwei Beutetiere. Der Schalter verändert ihre Verteilung, nicht die vorgegebene Gesamtzahl.'}</p>
 <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung. Eigene schematische Fische und erfundene Stoffmarkierungen, keine echten Tiere oder DDT-Messdaten. Die Pfeile zeigen die Richtung der Weitergabe. Größen und Punktzahlen geben keine Masse, Dosis oder Konzentration an. Für Konzentrationen braucht man zusätzlich eine Bezugsmenge, etwa Gramm Gewebe. Wirkliche Aufnahme, Abbau und Ausscheidung hängen vom Stoff und Lebewesen ab.</p>
 </>;}
export function NarrativeInformationEvidenceFigure({selected,onSelect}:Props){const noor=selected===1;return <>
 <h4>Dasselbe Ereignis – wer weiß welchen Teil?</h4>
 <p>Unsere eigene Erfindung: Eine Buchlieferung bleibt aus. Lina kennt den platten Fahrradreifen. Noor sieht nur die leere Abholstelle. Wähle den vorgegebenen Informationsstand einer Figur.</p>
 <svg viewBox="0 0 320 205" role="img" aria-label={'Eigene Gegenüberstellung zweier vorgegebener Informationsstände: Lina kennt einen platten Reifen, Noor die leere Abholstelle. Hervorgehoben ist '+(noor?'Noors Beobachtung.':'Linas Wissen um die Ursache.')} data-narrative-information={noor?'noor':'lina'}>
  <path d="M20 18H132V90H90L75 108V90H20Z" fill="#fff" stroke={noor?BLUE:ORANGE} strokeWidth={noor?2:4}/>
  <path d="M188 18H300V90H245L230 108V90H188Z" fill="#fff" stroke={noor?ORANGE:BLUE} strokeWidth={noor?4:2}/>
  <path d="M55 67C44 49 51 29 72 29C93 29 100 49 89 67L81 71L73 67L65 71Z" fill="#eaf1f1" stroke={INK} strokeWidth="3"/>
  <path d="M73 34V61M73 48L85 39M73 48L61 39M73 48L85 57M73 48L61 57" fill="none" stroke={INK} strokeWidth="2"/>
  <path d="M211 35V72H277V35M211 56H277" fill="none" stroke={INK} strokeWidth="3"/>
  {[75,230].map(x=><g key={x}><circle cx={x} cy="136" r="16" fill="#d6e5e4" stroke={INK} strokeWidth="2.5"/><path d={'M'+(x-23)+' 189V178Q'+x+' 143 '+(x+23)+' 178V189Z'} fill={BLUE} stroke={INK} strokeWidth="2.5"/></g>)}
 </svg>
 <div className="people-evidence-legend"><span>Links Lina: Ursache bekannt</span><span>Rechts Noor: leere Abholstelle beobachtet</span></div>
 <Choice {...{selected,onSelect}} name="Vorgegebenen Informationsstand vergleichen" labels={['Linas Information','Noors Information']}/>
 <p className="people-evidence-example"><strong>In unserem erfundenen Text vorgegeben:</strong> {noor?'Noor sieht an der Abholstelle keine Bücher. Warum die Lieferung ausbleibt, ist Noor noch nicht mitgeteilt worden.':'Lina weiß vom platten Reifen des Bücherfahrrads. Diese Information wurde Noor noch nicht mitgeteilt.'}</p>
 <p className="people-evidence-observation" role="status">{noor?'Die Beobachtung der leeren Stelle verrät nicht von selbst die Ursache oder eine Absicht. Eine weitere Information könnte Noors Wissen verändern.':'Das Wissen um die Ursache gehört hier zu Lina. Dass die andere Figur dieselbe Ursache kennt, darf man nicht ohne Textbeleg annehmen.'}</p>
 <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung. Eigene erfundene Figuren, Sätze und Symbole; keine Butler-Porträts, Manuskriptseiten oder Romanszene. Die Gegenüberstellung ist kein maßstäblicher Ort. Das Umschalten ändert den betrachteten Informationsstand, nicht das vorgegebene Ereignis. Gefühle und freie literarische Deutungen werden daraus nicht automatisch bewertet.</p>
 </>;}
