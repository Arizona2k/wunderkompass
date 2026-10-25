'use client';

import './animal-inquiry.css';
import {Eye,GitBranch,Search,Volume2} from 'lucide-react';
import {useSavedGame,useSavedModel} from './saved-games';
import DATA from './animal-inquiries.json';

const LEVELS=['Belege sammeln','Zusammenhang erklären','Genauer nachdenken'] as const;
type Task=(typeof DATA.entries)[number]['reason']|(typeof DATA.entries)[number]['transfer'];

// New optional keys live in the existing per-topic Schema-3 session. They never
// replace the article's items/topicAnswer/compareAnimal or award a discovery.
export default function AnimalInquiry({id,onRead}:{id:string;onRead:(text:string)=>void}){
 const data=DATA.entries.find(entry=>entry.id===id);
 const [level,setLevel]=useSavedModel<number>('animalInquiryLevel',0,{min:0,max:2});
 const [seen,setSeen]=useSavedGame<number[]>('animalInquiryEvidence',[],value=>Array.isArray(value)?[...new Set(value.filter(v=>v===0||v===1))]:[]);
 if(!data)return null;
 const icons=[Eye,GitBranch,Search],observation='observation' in data?data.observation:null;
 return <details className="animal-inquiry" data-animal-inquiry={id}>
  <summary>Deine Tierforscher-Werkstatt · freiwillig</summary>
  <div className="animal-inquiry-body">
   <h3>{data.goal}</h3>
   <p>Wähle einen Denkweg. Du kannst jederzeit wechseln.</p>
   <div className="animal-inquiry-levels" role="group" aria-label="Denkweg in der Tierforscher-Werkstatt">
    {LEVELS.map((label,index)=>{const Icon=icons[index];return <button className="secondary-button" key={label} aria-pressed={level===index} onClick={()=>setLevel(index)}><Icon size={20} aria-hidden="true"/><span>{label}<small>{['etwa 6–8 Jahre','etwa 9–11 Jahre','etwa 12–14 Jahre'][index]}</small></span></button>;})}
   </div>
   {level===0?<section className="animal-evidence" aria-label="Belege aus der Tierkarte">
    <h4>Was wissen wir aus der Karte?</h4><p>Öffne die beiden Belege und vergleiche sie. Ein Foto allein zeigt nicht alle Fähigkeiten oder die ganze Lebensweise eines Tiers.</p>
    {data.evidence.map((e,index)=><div className="animal-evidence-row" key={e.label}><button className="knowledge-link" aria-expanded={seen.includes(index)} onClick={()=>setSeen(current=>current.includes(index)?current.filter(v=>v!==index):[...current,index])}><span>{index+1}. {e.label}</span><span aria-hidden="true">{seen.includes(index)?'−':'+'}</span></button>{seen.includes(index)&&<p>{e.text}</p>}</div>)}
    {observation&&<section className="animal-observation"><h4>{observation.task}</h4><details className="learning-details"><summary>Ein Beobachtungshinweis · freiwillig</summary><p>{observation.hint}</p></details><p className="small-note">Du kannst zeichnen oder mit eigenen Worten erklären. Dafür musst du kein Tier anfassen oder stören.</p></section>}
    <p className="small-note">Erkläre mit eigenen Worten: Welche zwei verschiedenen Dinge erfährst du? Beim nächsten Denkweg prüfst du einen Zusammenhang.</p>
   </section>:<ReasonTask key={id+':'+level} task={level===1?data.reason:data.transfer} level={level} onRead={onRead}/>}
   <details className="learning-details animal-inquiry-sources"><summary>Wie wird diese Aufgabe geprüft?</summary><p>{data.status}</p><p>Die Belege findest du in „Kurz erklärt“, die Originalverweise unter „Für Erwachsene: Quellen &amp; Modellgrenzen“. Diese Werkstatt simuliert kein Tier und trifft keine neue Gefährdungsbewertung.</p></details>
  </div>
 </details>;
}

function ReasonTask({task,level,onRead}:{task:Task;level:number;onRead:(text:string)=>void}){
 const [answer,setAnswer]=useSavedGame<string|null>('animalInquiryAnswer:'+level,null,value=>typeof value==='string'&&task.answers.includes(value)?value:null);
 const chosen=answer===null?-1:task.answers.indexOf(answer),correct=chosen===task.correct,reflection='reflection' in task?task.reflection:null;
 return <section className="animal-reason-task" aria-label={level===1?'Zusammenhang erklären':'Schlussfolgerung prüfen'}>
  <h4>{task.prompt}</h4>
  <button className="speech-button" onClick={()=>onRead(task.prompt+'. '+task.answers.join('. '))}><Volume2 size={17} aria-hidden="true"/> Denkfrage vorlesen</button>
  <details className="learning-details"><summary>Ein Denkhinweis · freiwillig</summary><p>{task.hint}</p></details>
  <div className="quiz-answers">{task.answers.map((text,index)=><button key={text} className={'quiz-answer '+(chosen===index?(correct?'is-correct':'is-incorrect'):'')} aria-pressed={chosen===index} onClick={()=>setAnswer(text)}><span className="answer-letter" aria-hidden="true">{String.fromCharCode(65+index)}</span><span>{text}</span></button>)}</div>
  {chosen>=0&&<div className="lab-feedback" role="status"><strong>{correct?'Deine Auswahl passt.':'Prüfe die Aussage noch einmal.'}</strong><p>{task.feedback[chosen]}</p><button className="speech-button" onClick={()=>setAnswer(null)}>Noch einmal überlegen</button></div>}
  {level===2&&correct&&reflection&&<details className="learning-details animal-transfer-reflection">
   <summary>Eine eigene Überlegung · freiwillig</summary>
   <p>{reflection.prompt}</p>
   <p>Du kannst deine Idee erzählen oder im Notizbuch festhalten. Die Rückmeldung oben prüft nur deine gewählte Antwort.</p>
   <details className="learning-details"><summary>Ein Muster zum Vergleichen</summary><p>{reflection.example}</p><p>{reflection.compare}</p><p className="small-note">Vergleiche deine eigenen Gedanken selbst mit dem Muster. Auch anders formulierte passende Ideen sind möglich.</p></details>
  </details>}
 </section>;
}
