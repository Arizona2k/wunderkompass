import type {MouseEvent} from 'react';
import {ArrowRight} from 'lucide-react';
import {JOURNEYS} from './learning-overview';
import {chapterLinksForTopic} from './journey-links';
import {navigateHash} from './hash-route';
export default function JourneyTopicLinks({topicId,onReadStop}:{topicId:string;onReadStop:()=>void}){
 const links=chapterLinksForTopic(topicId);if(!links.length)return null;
 const groups=JOURNEYS.flatMap(j=>{const chapters=links.filter(c=>c.id===j.id);return chapters.length?[{journey:j,chapters}]:[];});
 const activate=(event:MouseEvent<HTMLAnchorElement>,path:string)=>{if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();onReadStop();navigateHash(path);};
 const card=(c:typeof links[number])=>{const j=JOURNEYS.find(j=>j.id===c.id)!;return <div className="connection-card" key={c.path}><a className="knowledge-link" data-route-focus={'topic-journey-'+topicId+'-'+c.id+'-'+c.index} href={'#'+c.path} onClick={event=>activate(event,c.path)}><span>{j.steps[c.index].title}</span><ArrowRight size={17}/></a><p>Kapitel {c.index+1}: {j.steps[c.index].tryIt??j.steps[c.index].text.match(/^.*?[.!?](?:\s|$)/)?.[0].trim()??j.steps[c.index].text}</p></div>;};
 return <section className="knowledge-network journey-topic-links"><h3>Auf einer Lernreise weiterdenken</h3>{groups.map(({journey,chapters})=><div className="journey-linked-group" key={journey.id}><h4>{journey.title}</h4>{card(chapters[0])}{chapters.length>1&&<details data-history-disclosure={'journey-links-'+topicId+'-'+journey.id}><summary>{chapters.length-1} weitere {chapters.length===2?'Station':'Stationen'} dieser Reise</summary>{chapters.slice(1).map(card)}</details>}</div>)}</section>;
}
