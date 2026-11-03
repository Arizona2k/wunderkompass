import {useEffect,useState} from 'react';
import {LearningDetails} from './learning-components';
import {bookAnswerSentence} from './book-answer-feedback';
import {navigateHash} from './hash-route';
import allLearning from './nature-learning-content.json';
import {NATURE} from './nature-data';
import {NatureFigure} from './nature-study-figure';
const date=(value:string)=>new Date(value+'T12:00:00Z').toLocaleDateString('de-DE',{timeZone:'UTC'});
export default function NatureStudyBody({id,headingLevel,onReady}:{id:string;headingLevel:3|5;onReady:(ready:boolean)=>void}){
 const item=allLearning[id as keyof typeof allLearning],learning=item.learning,q=learning.question;
 const [answer,setAnswer]=useState<number|null>(null),Heading=('h'+headingLevel)as'h3'|'h5';
 useEffect(()=>{onReady(true);},[onReady]);
 return <div className="nature-study-body" data-nature-study-body={id}>
  <p className="nature-learning-benefit">{learning.benefit}</p>
  <LearningDetails summary="Ganz einfach · etwa 6–8 Jahre" data-history-disclosure={'nature-starter-'+id}><p>{learning.starter}</p></LearningDetails>
  <LearningDetails summary="Noch genauer · etwa 12–14 Jahre" data-history-disclosure={'nature-deeper-'+id}><p>{learning.deeper}</p></LearningDetails>
  <NatureFigure family={item.family} kind={learning.figure.kind} headingLevel={headingLevel}/>
  <LearningDetails summary="Selbst beobachten und erklären" data-history-disclosure={'nature-observe-'+id}><p>{learning.observe}</p></LearningDetails>
  <section className="book-thinking" aria-label={'Denkfrage zu '+item.name}><Heading>{q.prompt}</Heading><LearningDetails summary="Ein Hinweis, wenn du möchtest"><p>{q.hint}</p></LearningDetails><div className="quiz-answers">{q.answers.map((text,n)=><button type="button" className="quiz-answer" key={text} aria-pressed={answer===n} onClick={()=>setAnswer(n)}>{text}</button>)}</div>{answer!==null&&<p className="book-feedback" role="status">Deine Auswahl: {bookAnswerSentence(q.answers[answer])} {answer===q.correct?'Das passt. ':'Noch nicht passend. '}{answer===q.correct?q.why:q.wrongReasons[answer]}</p>}</section>
  <LearningDetails summary="Mit anderen Naturorten vergleichen" data-history-disclosure={'nature-related-'+id}><ul>{learning.relatedNature.map(link=>{const target=NATURE.find(p=>p.id===link.id);return target?<li key={link.id}><p>{link.reason}</p><a className="book-topic-link" href={'#book/nature/'+encodeURIComponent(target.id)} data-route-focus={'nature-related-'+id+'-'+target.id} onClick={event=>{event.preventDefault();navigateHash('book/nature/'+encodeURIComponent(target.id));}}>Mit „{target.name}“ weiterdenken →</a></li>:null;})}</ul></LearningDetails>
  <LearningDetails summary="Passende Begriffe weiterdenken" data-history-disclosure={'nature-words-'+id}><ul>{learning.relatedWords.map(link=><li key={link.term}><p>{link.reason}</p><a className="book-topic-link" href={'#book/words/'+encodeURIComponent(link.term)} data-route-focus={'nature-word-'+id+'-'+link.term} onClick={event=>{event.preventDefault();navigateHash('book/words/'+encodeURIComponent(link.term));}}>Mit „{link.term}“ weiterdenken →</a></li>)}</ul></LearningDetails>
  <LearningDetails summary="Quellen und Prüfstand" data-history-disclosure={'nature-sources-'+id}><p>Mit KI-Unterstützung erstellt und gegen die bezeichneten Belegstellen abgeglichen. Die Quellengeber haben diese WunderKompass-Erklärung nicht geprüft oder freigegeben.</p><ul>{learning.sources.map(source=><li key={source.url}><a className="secondary-button" href={source.url} target="_blank" rel="noreferrer">{source.title}</a><p>Belegstelle: {source.anchor}</p><p>Quelle abgerufen am {date(source.checkedOn)}. {source.updatedOn&&<>Angegebener Quellenstand: {date(source.updatedOn)}.</>}</p></li>)}</ul></LearningDetails>
 </div>;
}
