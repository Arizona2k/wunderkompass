'use client';
import {useHistoryEvidenceView} from './history-evidence-view-state';
import {LearningFeedback} from './learning-motion';
import './paper-forming-evidence.css';

const stages=['Fasern im Wasser','Ein feuchtes Blatt formen','Ein getrocknetes Blatt'];
const fibres=[[58,45,91,62],[104,36,139,55],[156,54,195,39],[216,41,249,63],[268,50,300,35],[46,93,83,79],[115,87,153,106],[178,91,215,111],[245,103,283,81],[64,145,104,161],[144,148,180,133],[226,146,273,164]];
const gathered=[[100,94],[130,108],[152,88],[174,116],[194,92],[115,124],[147,114],[169,97],[189,126],[110,102],[158,130],[181,108]];
const questions=['Verfolge die bereits vorhandenen Fasern. Was verändert sich zwischen Faserbrei, geformtem und getrocknetem Blatt?','Wähle „Ein feuchtes Blatt formen“. Vergleiche Sieb und geschlossene Platte: Wo kann Wasser durch den Boden ablaufen, und welche andere Möglichkeit bleibt?','Ein früher Fund und ein späterer Verbesserungsbericht sind verschiedene Belege. Was trägt jeder von ihnen – und was folgt nicht daraus?'];
export function PaperFibreDrawing({step,closed=false,label}:{step:number;closed?:boolean;label:string}){
 return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 230" role="img" aria-label={label}>
     <rect x="16" y="16" width="328" height="198" rx="18" fill="#edf6f7"/>
     {step===0&&<>
      <path d="M28 34V198H332V34" fill="none" stroke="#315c67" strokeWidth="4"/>
      {[48,80,112,144,176].map(y=><path key={y} d={`M38 ${y}Q85 ${y-10} 130 ${y}T222 ${y}T322 ${y}`} fill="none" stroke="#3e8ba6" strokeWidth="3" strokeDasharray="7 5"/>)}
      {fibres.map(([x,y,x2,y2],i)=><path key={i} d={`M${x} ${y+10}Q${(x+x2)/2} ${(y+y2)/2} ${x2} ${y2+10}`} fill="none" stroke="#925d35" strokeWidth="5" strokeLinecap="round"/>)}
     </>}
     {step===1&&<>
      <path d="M34 28V106H326V28" fill={closed?'#dceff4':'none'} stroke="#315c67" strokeWidth="3"/>
      <path d="M34 98H326" stroke="#93643a" strokeWidth={closed?12:4} strokeDasharray={closed?undefined:'5 8'}/>
      {!closed&&Array.from({length:15},(_,i)=><path key={i} d={`M${40+i*20} 90V110`} stroke="#93643a" strokeWidth="3"/>)}
      <path d="M42 52Q88 42 130 52T218 52T318 52" stroke="#3e8ba6" strokeWidth="3" strokeDasharray="7 5" fill="none"/>
      {fibres.map(([x,y,x2,y2],i)=><path key={i} transform={`translate(${40+i*21-x} ${78+i%3*3-y-10})`} d={`M${x} ${y+10}Q${(x+x2)/2} ${(y+y2)/2} ${x2} ${y2+10}`} fill="none" stroke="#925d35" strokeWidth="5" strokeLinecap="round"/>)}
      {!closed&&<><path d="M58 154V204H302V154" fill="none" stroke="#315c67" strokeWidth="3"/>{[78,128,180,232,282].map((x,i)=><path key={x} d={`M${x} ${119+i%2*9}q-6 10 0 14q6-4 0-14Z`} fill="#3e8ba6"/>)}<path d="M66 188H294" stroke="#3e8ba6" strokeWidth="3" strokeDasharray="7 5"/></>}
     </>}
     {step===2&&<>
      <rect x="78" y="58" width="204" height="124" rx="7" fill="#fcf7e9" stroke="#a89878" strokeWidth="3"/>
      {fibres.map(([x,y,x2,y2],i)=><path key={i} transform={`translate(${gathered[i][0]-x} ${gathered[i][1]-y-10})`} d={`M${x} ${y+10}Q${(x+x2)/2} ${(y+y2)/2} ${x2} ${y2+10}`} fill="none" stroke="#925d35" strokeWidth="4" strokeLinecap="round"/>)}
     </>}
    </svg>;
}
export default function PaperFormingEvidence(){
 const [view,setView]=useHistoryEvidenceView('history-paper',{level:0,variant:false,extra:false,compare:false,choice:0});
 const step=view.choice??0,closed=view.variant;
 const captions=[
  'Die braunen Linien stehen für bereits vorhandene Pflanzenfasern, die blauen gestrichelten Linien für Wasser. Die Zeichen sind vergrößert und nicht maßstäblich.',
  closed?'Geschlossene Platte: Im gezeigten Vergleich läuft kein Wasser durch den Boden. Verdunstung oder ein anderer Wasserweg werden dadurch nicht ausgeschlossen.':'Sieb: Öffnungen lassen hier Wasser ablaufen; Fasern bleiben als feuchte Schicht zurück. Die blauen Tropfenzeichen zeigen einen Weg, keine gemessene Wassermenge.',
  'Die Faserlinien liegen hier enger und überlappen sich in einem gezeichneten Ausschnitt des als getrocknet markierten Blatts. Die Fasern waren schon vorher vorhanden. Restfeuchte, Festigkeit und Eignung für Tinte werden nicht berechnet.'
 ];
 const comparisons=[
  'Die Fasern sind in allen drei Bildern schon vorhanden. Wasser hilft, sie zu verteilen; beim Formen wird eine Schicht gesammelt und beim Trocknen Wasser abgegeben. Das ist eine Grundidee, keine vollständige historische Werkstattfolge.',
  'Durch die Öffnungen des Siebs kann Wasser ablaufen. Eine geschlossene Platte bietet diesen Weg nicht. Wasser könnte dort trotzdem verdunsten. Ein anderer Wasserweg ist nicht dasselbe wie „Wasser verschwindet niemals“; eine genaue Dauer lässt sich aus dem Bild nicht ablesen.',
  'Ein älteres Papierstück kann frühere Materialnutzung belegen. Der für 105 überlieferte Bericht betrifft eine spätere Verbesserung. Beides kann zusammenpassen. Daraus folgt weder ein genauer erster Erfindungstag noch, dass eine einzige Person alle Papierarten allein erfand.'
 ];
 const title=step===1?(closed?'Faserschicht über einer geschlossenen Platte':'Faserschicht auf einem durchlässigen Sieb'):stages[step];
 return <section className="history-context history-evidence paper-forming-evidence" tabIndex={-1} aria-label="Geschichtsdetektiv: Papier formen und Belege unterscheiden" data-history-evidence="history-paper" data-paper-forming-evidence>
  <h3>Wie wird aus Fasern ein Blatt?</h3>
  <p className="small-note">Eigenes vergrößertes Lernbild, keine Mikroskopaufnahme und keine Rekonstruktion einer Werkstatt in China im Jahr 105.</p>
  <div className="model-buttons" role="group" aria-label="Freiwillige Denkstufe">{['Arbeitsschritte beobachten','Wasserwege vergleichen','Belege unterscheiden'].map((label,i)=><button key={label} className="secondary-button" aria-pressed={view.level===i} onClick={()=>setView(v=>({...v,level:i as 0|1|2,compare:false}))}>{i+1} · {label}</button>)}</div>
  <p className="learning-goal">{questions[view.level]}</p>
  <div className="paper-forming-steps" role="group" aria-label="Gezeigter Arbeitsschritt">{stages.map((label,i)=><button key={label} className="secondary-button" aria-pressed={step===i} onClick={()=>setView(v=>({...v,choice:i,compare:false}))}>{label}</button>)}</div>
  <div className="paper-forming-stage" data-paper-step={step} data-paper-base={step===1?(closed?'closed':'sieve'):'not-applicable'}>
   <figure className="paper-forming-figure">
    <PaperFibreDrawing step={step} closed={closed} label={title+'. '+captions[step]}/>
    <figcaption>{captions[step]}</figcaption>
   </figure>
   <div className="paper-forming-explanation"><h4>{title}</h4><p>Faserlinien und Wasserzeichen sind unterschiedliche Formen. Ihre Anzahl ist keine Messung und zeigt keine chemischen Bindungen.</p>
    {step===1&&<div className="model-buttons" role="group" aria-label="Unterlage beim Formen vergleichen"><button className="secondary-button" aria-pressed={!closed} onClick={()=>setView(v=>({...v,variant:false,compare:false}))}>Sieb mit Öffnungen</button><button className="secondary-button" aria-pressed={closed} onClick={()=>setView(v=>({...v,variant:true,compare:false}))}>Geschlossene Platte</button></div>}
   </div>
  </div>
  {view.level===2&&<div className="paper-forming-source-case" aria-label="Zusammenfassung zweier Belegarten"><h4>{view.extra?'Ein älterer Papierfund':'Ein Bericht für 105'}</h4><p>{view.extra?'Das Museum ordnet bestimmte Papierreste aus Xuanquanzhi der Zeit von Kaiser Wu zu, etwa 140 bis 86 v. Chr. Diese Einordnung betrifft Funde, keinen festgestellten ersten Erfindungstag.':'Für 105 ist die Vorstellung eines verbesserten Verfahrens durch Cai Lun am Han-Hof überliefert. Diese Zusammenfassung ist kein Originaltext und kein Beleg, dass zuvor kein Papier existierte.'}</p><button className="secondary-button" onClick={()=>setView(v=>({...v,extra:!v.extra,compare:false}))}>{view.extra?'Verbesserungsbericht zeigen':'Älteren Fundbeleg zeigen'}</button></div>}
  <button className="secondary-button" aria-expanded={view.compare} onClick={()=>setView(v=>({...v,compare:!v.compare}))}>{view.compare?'Vergleich schließen':'Meine Überlegung vergleichen'}</button>
  <LearningFeedback active={view.compare} className="model-result"><strong>Eine mögliche Überlegung</strong><p>{comparisons[view.level]}</p></LearningFeedback>
  <p className="small-note">Die freiwillige Beobachtung vergibt keinen Stempel und bewertet keine freie Erklärung. Das Modell zeigt weder eine gemessene Trocknungszeit noch die gesamte Geschichte der Papierherstellung.</p>
 </section>;
}
