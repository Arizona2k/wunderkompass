'use client';
import {useId} from 'react';
import {Volume2} from 'lucide-react';
import DATA from './people-inquiries.json';
import {LearningDetails} from './learning-components';
import {useSavedGame,useSavedModel} from './saved-games';
import './people-evidence.css';
import {FossilDrawing,LightDrawing} from './people-illustration';
import {InsectObservationFigure,InnerCoreEvidenceFigure} from './people-observation-figures';

type Task={age:string;goal:string;example:string;prompt:string;answers:string[];correct:number;hint:string;why:string;wrongReasons:(string|null)[]};
type Entry={id:string;figure:string;tasks:Task[]};
const LEVELS=[['Entdecken','Etwa 6–8 Jahre'],['Erklären','Etwa 9–11 Jahre'],['Übertragen','Etwa 12–14 Jahre']];

export const hasPeopleEvidence=(id:string)=>DATA.entries.some(e=>e.id===id);

export default function PeopleEvidence({id,onRead}:{id:string;onRead:(text:string)=>void}){
 const entry=DATA.entries.find(e=>e.id===id);
 return entry?<Study key={id} entry={entry} onRead={onRead}/>:null;
}
function Study({entry,onRead}:{entry:Entry;onRead:(text:string)=>void}){
 const [level,setLevel]=useSavedModel<number>('peopleEvidenceLevel',0,{min:0,max:2});
 const heading=useId();
 return <section tabIndex={-1} className="people-evidence" data-person-evidence={entry.id} aria-labelledby={heading}>
  <p className="eyebrow">SELBST HERAUSFINDEN</p><h3 id={heading}>Eine Erklärung mit Belegen prüfen</h3>
  <p>Du kannst Beobachtungen vergleichen und deine Erklärung begründen. Gedachte Situationen und eigene Modelle sind jeweils gekennzeichnet. Alle Stufen sind freiwillig.</p>
  <EvidenceFigure kind={entry.figure}/>
  <div className="people-evidence-levels" role="group" aria-label="Denkstufe zur Forscherspur">{LEVELS.map(([name,age],i)=><button className="secondary-button" key={name} aria-pressed={level===i} onClick={()=>setLevel(i)}><strong>{name}</strong><span>{age}</span></button>)}</div>
  <EvidenceTask key={entry.tasks[level].age} task={entry.tasks[level]} onRead={onRead}/>
 </section>;
}
function EvidenceTask({task,onRead}:{task:Task;onRead:(text:string)=>void}){
 const [choice,setChoice]=useSavedGame<number|null>('peopleEvidenceAnswer:'+task.age,null,value=>typeof value==='number'&&Number.isInteger(value)&&value>=0&&value<3?value:null);
 const right=choice===task.correct;
 return <div className="people-evidence-task" data-person-evidence-task={task.age}>
  <p><strong>Dein Ziel:</strong> {task.goal}</p><p className="people-evidence-example">{task.example}</p><h4>{task.prompt}</h4>
  <LearningDetails summary="Ein Denkhinweis"><p>{task.hint}</p></LearningDetails>
  <div className="quiz-answers">{task.answers.map((answer,i)=><button key={answer} className={'quiz-answer '+(choice===i?(right?'is-correct':'is-incorrect'):'')} aria-pressed={choice===i} onClick={()=>setChoice(i)}><span>{answer}</span></button>)}</div>
  {choice!==null&&<div className="lab-feedback" role="status"><strong>{right?'Deine Auswahl passt':'Prüfe deine Auswahl'}</strong><p>{right?task.why:task.wrongReasons[choice]}</p>{right?<p>Wenn du möchtest: Begründe deine Auswahl mit eigenen Worten und vergleiche deine Erklärung mit dem Beispiel. Deine eigene Erklärung wird hier nicht bewertet.</p>:<p>Du darfst eine andere Antwort ausprobieren.</p>}</div>}
  <button className="speech-button" onClick={()=>onRead([task.example,task.prompt,...task.answers].join(' '))}><Volume2 size={17}/> Beispiel und Frage vorlesen</button>
 </div>;
}
function EvidenceFigure({kind}:{kind:string}){
 const [selected,setSelected]=useSavedModel<number>('peopleEvidenceFigure',0,{min:0,max:1});
 if(kind==='insect-observation-series'||kind==='inner-core-evidence-comparison')return <div className="people-evidence-figure" data-evidence-figure={kind} data-evidence-scene={selected}>{kind==='insect-observation-series'?<InsectObservationFigure selected={selected} onSelect={setSelected}/>:<InnerCoreEvidenceFigure selected={selected} onSelect={setSelected}/>}</div>;
 if(!['fossil-evidence','light-to-eye'].includes(kind))return null;
 const fossil=kind==='fossil-evidence';
 return <div className="people-evidence-figure" data-evidence-figure={kind} data-evidence-scene={selected}>
  <h4>{fossil?'Fund und Zeichnung unterscheiden':'Welchen Weg kann Licht nehmen?'}</h4>
  {fossil?<div className={'people-evidence-comparison '+(selected===1?'is-comparing':'')}>
   <figure><FossilDrawing/><figcaption><strong>Unser gedachter Fund</strong><span>Der Knochenumriss ist das im Beispiel beschriebene Merkmal.</span></figcaption></figure>
   {selected===1&&[['a','#438da8','Bild A: blau'],['b','#d28759','Bild B: braunrot']].map(([id,color,label])=><figure key={id} data-reconstruction={id}><FossilDrawing color={color} label={'Eigene erfundene Rekonstruktion '+label+' mit demselben Knochenumriss'}/><figcaption><strong>{label}</strong><span>Dieselbe Knochenform, eine zusätzlich gezeichnete Hautfarbe.</span></figcaption></figure>)}
  </div>:<LightDrawing blocked={selected===1}/>}
  {!fossil&&<div className="people-evidence-legend"><span>Lichtquelle</span><span>Beleuchteter Gegenstand</span><span>Auge</span></div>}
  <div className="visual-choice" role="group" aria-label={fossil?'Fund und Rekonstruktionen vergleichen':'Lichtweg mit und ohne Schirm vergleichen'}>{(fossil?['Nur den Fund betrachten','Zwei Zeichnungen vergleichen']:['Ohne Schirm','Mit undurchlässigem Schirm']).map((label,i)=><button key={label} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{label}</button>)}</div>
  <p className="people-evidence-observation" role="status">{fossil?(selected===0?'Die gezeichnete Knochenform allein verrät in diesem Beispiel keine Hautfarbe.':'Die beiden erfundenen Bilder haben dieselbe Knochenform. Die verschieden gezeichneten Hautfarben sind dadurch nicht am Knochen beobachtet.'):(selected===0?'Der dargestellte Weg führt von der Lichtquelle zum Gegenstand und weiter zum Auge. Das Auge sendet hier keine Sehstrahlen aus.':'Der undurchlässige Schirm unterbricht diesen dargestellten Weg. Wir betrachten hier keine Löcher, Spiegel oder anderen Lichtwege.')}</p>
  <p className="small-note">{fossil?'Eigenes erfundenes Museumsbeispiel: Knochenform und Tierumrisse sind frei gezeichnet, kein echtes Fossilienfoto und keine Rekonstruktion einer bestimmten Art. Das blaue Bild A gehört zum ersten Aufgabenbeispiel.':'Eigenes vereinfachtes Schema ohne Mengen- oder Abstandsmaßstab. Kein Nachbau eines historischen Versuchs und kein vollständiges Augen- oder Gehirnmodell.'}</p>
 </div>;
}
