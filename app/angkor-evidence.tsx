'use client';
import {useHistoryEvidenceView} from './history-evidence-view-state';
import {LearningFeedback} from './learning-motion';
import './angkor-evidence.css';

const stages=['Eine Menge verteilen','Speichern erklären','Eine Spur prüfen'];
export default function AngkorEvidence(){
 const [view,setView]=useHistoryEvidenceView('history-angkor',{level:0,variant:false,extra:false,compare:false,choice:0});const stage=view.level,released=view.choice??0,corroborated=view.variant,explain=view.compare;
 const stored=6-released;
 const tasks=[
  'Leite zwei der sechs Marken weiter. Vergleiche, was im Becken und was außerhalb liegt.',
  'Verändere die Weiterleitung. Erkläre in eigenen Worten: Was kann ein Speicher mit der Menge tun – und was nicht?',
  'Wähle zwischen einer einzelnen Bildspur und einer zusätzlich geprüften Spur. Was weißt du jeweils schon, und was bleibt offen?'
 ];
 const explanations=[
  'Bei zwei weitergeleiteten Marken bleiben vier im Becken. Zusammen sind es weiterhin sechs. Die Darstellung zählt beide Orte; sie erzeugt keine zusätzliche Menge.',
  'Speichern hält eine Menge zunächst an einem Ort. Weiterleiten verteilt sie anders. In diesem Lernbild fehlen Zufluss, Verdunstung und Versickerung. Eine eigene Erklärung wird hier nicht automatisch bewertet.',
  corroborated?'Die zusätzliche Untersuchung stützt die Einordnung der Spur als Wasserweg in diesem gedachten Fall. Das genaue Baujahr, jede frühere Nutzung und die Versorgung aller Menschen sind damit noch nicht belegt.':'Die gerade Linie fällt auf und liefert eine Forschungsfrage. Ohne weitere Belege ist sie noch kein sicher nachgewiesener historischer Wasserweg.'
 ];
 return <section className="history-context history-evidence angkor-evidence" tabIndex={-1} data-history-evidence="history-angkor" aria-label="Angkor untersuchen">
  <h3>Was kann ein Speicher – und was zeigt eine Spur?</h3>
  <p className="small-note">Eigenes erfundenes Lernbild. Sechs Marken stehen für eine gedachte Wassermenge. Keine Literangabe, Originalkarte oder historische Versorgungsrechnung.</p>
  <div className="model-buttons" role="group" aria-label="Freiwillige Denkstufe">{stages.map((label,i)=><button key={label} className="secondary-button" aria-pressed={stage===i} onClick={()=>{setView(v=>({...v,level:i as 0|1|2,compare:false}));}}>{i+1} · {label}</button>)}</div>
  <p className="learning-goal">{tasks[stage]}</p>
  {stage<2?<>
   <figure className="angkor-water-figure">
    <svg viewBox="0 0 360 160" role="img" aria-label={`Erfundenes Mengenbild: ${stored} Marken im Becken, ${released} weitergeleitete Marken; insgesamt sechs.`}>
     <path d="M26 25V130H166V25M178 94H334" fill="none" stroke="#284b56" strokeWidth="4"/>
     <path d="M320 84l14 10-14 10" fill="none" stroke="#284b56" strokeWidth="4"/>
     {Array.from({length:stored},(_,i)=><circle key={'stored-'+i} cx={53+(i%3)*42} cy={105-Math.floor(i/3)*38} r="12" fill="#27778c"/>)}
     {Array.from({length:released},(_,i)=><circle key={'released-'+i} cx={204+(i%3)*42} cy={65-Math.floor(i/3)*36} r="12" fill="#27778c"/>)}
    </svg>
    <figcaption><strong>Im Becken: {stored}</strong><span>Weitergeleitet: {released}</span><span>Zusammen: {stored+released} Marken</span></figcaption>
   </figure>
   <label className="angkor-water-select">Weitergeleitete Marken<select className="secondary-button" value={released} onChange={event=>{const choice=Number(event.target.value);setView(v=>({...v,choice,compare:false}));}}>{[0,1,2,3,4,5,6].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
   <p className="model-result" role="status">{stored} im Becken + {released} weitergeleitet = 6 Marken.</p>
  </>:<>
   <figure className="angkor-trace-figure"><svg viewBox="0 0 360 130" role="img" aria-label="Erfundene Bildspur: eine gerade Linie in einer schematischen Fläche. Keine Aufnahme oder Karte Angkors."><rect x="16" y="16" width="328" height="98" rx="6" fill="#edf0e6"/><path d="M48 87L300 40" stroke="#50665b" strokeWidth="6"/><path d="M38 36l48 17m150 41l48-19" stroke="#a5b0a0" strokeWidth="3"/></svg><figcaption>Eine gedachte gerade Bildspur. Ihre Form allein verrät nicht ihre ganze Geschichte.</figcaption></figure>
   <div className="model-buttons" role="group" aria-label="Zusätzlichen Beleg vergleichen"><button className="secondary-button" aria-pressed={!corroborated} onClick={()=>{setView(v=>({...v,variant:false,compare:false}));}}>Nur die Bildspur</button><button className="secondary-button" aria-pressed={corroborated} onClick={()=>{setView(v=>({...v,variant:true,compare:false}));}}>Eine Untersuchung ergänzen</button></div>
   <p className="model-result" role="status">{corroborated?'Gedachter Zusatzbefund: Eine Untersuchung am Boden bestätigt hier einen gebauten Wasserweg.':'Bislang liegt nur die gedachte Bildspur vor; ihre Deutung bleibt offen.'}</p>
  </>}
  <button className="secondary-button" aria-expanded={explain} onClick={()=>setView(v=>({...v,compare:!v.compare}))}>{explain?'Vergleich schließen':'Meine Überlegung vergleichen'}</button>
  <LearningFeedback active={explain} className="model-result"><strong>Eine mögliche Einordnung</strong><p>{explanations[stage]}</p></LearningFeedback>
  <p className="small-note">Freiwillig, ohne zusätzlichen Stempel. Die Mini-Frage behält ihre eigene Funktion. Das Bild zeigt keine vollständige Wasserversorgung und beweist keine bestimmte Ursache eines historischen Wandels.</p>
 </section>;
}
