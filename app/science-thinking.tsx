'use client';
import {useId} from 'react';
import {Volume2} from 'lucide-react';
import DATA from './science-thinking.json';
import {LearningDetails} from './learning-components';
import {useSavedGame,useSavedModel} from './saved-games';
import './science-thinking.css';

type Answer={id:string;text:string;feedback:string};
type Stage={id:string;goal:string;example:string;prompt:string;hint:string;answers:Answer[];correct:string};
type Entry={id:string;stages:Stage[];sources:string[];interactive:boolean};
const LEVELS=['Vermuten','Erklären','Übertragen'];
export default function ScienceThinking({id,onRead}:{id:string;onRead:(text:string)=>void}){
 const entry=DATA.entries.find(entry=>entry.id===id);
 return entry?<Thinking entry={entry} onRead={onRead}/>:null;
}
function Thinking({entry,onRead}:{entry:Entry;onRead:(text:string)=>void}){
 const [level,setLevel]=useSavedModel<number>('scienceThinkingLevel',0,{min:0,max:2}),heading=useId();
 return <section className="science-thinking" data-science-thinking={entry.id} aria-labelledby={heading}>
  <p className="eyebrow">DEIN FORSCHERBLICK</p><h3 id={heading}>Vermuten, prüfen und weiterdenken</h3>
  <p>Überlege zuerst, was du erwartest. {entry.interactive?'Probiere passende Einstellungen im Modell darüber aus und vergleiche deine Beobachtung mit der Erklärung.':'Vergleiche die eigene Darstellung oben mit den gedachten Situationen. Begründe, was sie zeigen kann und wo ihre Grenzen liegen.'} Alle Denkstufen sind freiwillig.</p>
  <div className="science-thinking-levels" role="group" aria-label="Denkstufe zum Modell">{LEVELS.map((name,index)=><button key={name} className="secondary-button" aria-pressed={index===level} onClick={()=>setLevel(index)}>{name}</button>)}</div>
  <ThinkingTask key={entry.stages[level].id} task={entry.stages[level]} onRead={onRead}/>
  <LearningDetails summary="Quellen zum Forscherblick"><p>Die Situationen sind gedachte Beispiele. Grenzen des Modells stehen direkt bei seiner Erklärung.</p><ul>{entry.sources.map((url,index)=><li key={url}><a href={url} target="_blank" rel="noreferrer">Quelle {index+1}: {new URL(url).hostname}</a></li>)}</ul></LearningDetails>
 </section>;
}
function ThinkingTask({task,onRead}:{task:Stage;onRead:(text:string)=>void}){
 // Keep the actual chosen wording, including a prior wording after an update.
 // A changed answer is never silently interpreted as another or graded by index.
 const questionHeading=useId();
 const [choice,setChoice]=useSavedGame<string|null>('scienceThinkingAnswer:'+task.id,null,value=>typeof value==='string'?value:null);
 const answer=task.answers.find(answer=>answer.text===choice),right=answer?.id===task.correct;
 return <div className="science-thinking-task" data-science-thinking-stage={task.id}>
  <p><strong>Dein Ziel:</strong> {task.goal}</p><p className="science-thinking-example">{task.example}</p><h4 id={questionHeading}>{task.prompt}</h4>
  <LearningDetails summary="Ein Denkhinweis"><p>{task.hint}</p></LearningDetails>
  {choice!==null&&!answer&&<p className="gentle-note">Diese Frage hat neue Antwortmöglichkeiten. Du kannst sie erneut bearbeiten.</p>}
  <div className="quiz-answers" role="group" aria-labelledby={questionHeading}>{task.answers.map(answer=><button key={answer.id} className={'quiz-answer '+(choice===answer.text?(right?'is-correct':'is-incorrect'):'')} aria-pressed={choice===answer.text} onClick={()=>setChoice(answer.text)}><span>{answer.text}</span></button>)}</div>
  {answer&&<div className="lab-feedback" role="status"><strong>{right?'Dein Gedanke passt':'Prüfe die Begründung'}</strong><p>{answer.feedback}</p>{!right&&<p>Du kannst eine andere Erklärung ausprobieren.</p>}</div>}
  <button className="speech-button" onClick={()=>onRead([task.goal,task.example,task.prompt,...task.answers.map(answer=>answer.text)].join(' '))}><Volume2 size={17}/> Beispiel und Frage vorlesen</button>
 </div>;
}
