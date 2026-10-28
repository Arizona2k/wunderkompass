import {useState,type ReactNode} from 'react';
import {LearningDetails} from './learning-components';
import {navigateHash} from './hash-route';
import {WORLD_INDEX} from './world-index';

export type BookLearning={
 starter:string;deeper:string;observe:string;benefit:string;connection:string;topic:string;
 question?:{prompt:string;answers:string[];correct:number;hint:string;why:string;wrongReasons:string[]};
 sources:{url:string;title:string;anchor:string;updatedOn:string|null;checkedOn:string}[];
 relatedWords?:{term:string;reason:string}[];relatedQuestions?:{question:string;reason:string}[];
};

export function BookStudyBody({term,learning,sourceReadOn,onTopic,children}:{term:string;learning:BookLearning;sourceReadOn:string;onTopic?:(id:string)=>void;children?:ReactNode}){
 const [answer,setAnswer]=useState<number|null>(null),q=learning.question,checked=new Date(sourceReadOn+'T12:00:00Z').toLocaleDateString('de-DE'),topic=WORLD_INDEX.find(t=>t.id===learning.topic);
 return <>
  <p>{learning.benefit}</p>
  <LearningDetails summary="Ganz einfach · etwa 6–8 Jahre" data-history-disclosure={'book-starter-'+term}><p>{learning.starter}</p></LearningDetails>
  <LearningDetails summary="Noch genauer · etwa 12–14 Jahre" data-history-disclosure={'book-deeper-'+term}><p>{learning.deeper}</p></LearningDetails>
  {children}
  <LearningDetails summary="Selbst beobachten und erklären"><p>{learning.observe}</p></LearningDetails>
  {q&&<section className="book-thinking" aria-label={'Denkfrage zu '+term}><h4><strong>{q.prompt}</strong></h4><LearningDetails summary="Ein Hinweis, wenn du möchtest"><p>{q.hint}</p></LearningDetails><div className="quiz-answers">{q.answers.map((a,i)=><button className="quiz-answer" key={a} onClick={()=>setAnswer(i)} aria-pressed={answer===i}>{a}</button>)}</div>{answer!==null&&<p className="book-feedback" role="status">Deine Auswahl: {q.answers[answer]}. {answer===q.correct?'Das passt. ':'Noch nicht passend. '}{answer===q.correct?q.why:q.wrongReasons[answer]}</p>}</section>}
  {topic&&<div className="book-connection"><p>{learning.connection}</p><a className="knowledge-link book-topic-link" href={'#world/topic/'+topic.id} data-route-focus={'word-topic-'+term} onClick={e=>{if(onTopic){e.preventDefault();onTopic(topic.id);}}}>Mit „{topic.title}“ weiterdenken →</a></div>}
  {learning.relatedWords&&learning.relatedWords.length>0&&<LearningDetails summary="Mit anderen Wörtern weiterdenken" data-history-disclosure={'book-related-'+term}><ul>{learning.relatedWords.map(link=><li key={link.term}><p>{link.reason}</p><a className="book-topic-link" href={'#book/words/'+encodeURIComponent(link.term)} data-route-focus={'word-related-'+term+'-'+link.term} onClick={e=>{e.preventDefault();navigateHash('book/words/'+encodeURIComponent(link.term));}}>Mit „{link.term}“ weiterdenken →</a></li>)}</ul></LearningDetails>}
  {learning.relatedQuestions&&learning.relatedQuestions.length>0&&<LearningDetails summary="Passende Warum-Fragen erkunden" data-history-disclosure={"word-why-"+term}><ul>{learning.relatedQuestions.map(link=><li key={link.question}><p>{link.reason}</p><a className="book-topic-link" href={"#book/why/"+encodeURIComponent(link.question)} data-route-focus={"word-why-"+term+"-"+link.question} onClick={e=>{e.preventDefault();navigateHash("book/why/"+encodeURIComponent(link.question));}}>{link.question} →</a></li>)}</ul></LearningDetails>}
  <LearningDetails summary="Quellen und Prüfstand"><p>Mit KI-Unterstützung erstellt; Codex hat die Erklärung gegen ausgewählte Belegstellen der verlinkten Quellen abgeglichen. Die Quellengeber haben diese WunderKompass-Erklärung nicht geprüft oder freigegeben. Belegstellenabgleich: {checked}.</p><ul>{learning.sources.map(s=><li key={s.url}><a className="secondary-button" href={s.url} target="_blank" rel="noreferrer">{s.title}</a></li>)}</ul><p className="small-note">Eigene Beispiele und Zeichnungen; keine übernommenen Fotos, Logos oder Quelltexte. Quellenabruf am {checked}.</p></LearningDetails>
 </>;
}
