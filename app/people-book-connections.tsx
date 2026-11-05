import {LearningDetails} from './learning-components';
import {navigateHash} from './hash-route';
import {WORLD_INDEX} from './world-index';
import LINKS from './people-book-links.json';
export function PeopleBookConnections({term}:{term:string}){
 const links=LINKS.filter(link=>link.kind==='word'&&link.term===term);if(!links.length)return null;
 return <LearningDetails summary="Mit Menschen und ihren Fragen weiterdenken" className="book-related-words book-people-connections" data-book-people-connections={term} data-history-disclosure={'book-people-'+term}><ul>{links.map(link=>{const person=WORLD_INDEX.find(t=>t.id===link.topic);return person?<li key={link.topic}><p>{link.connection}</p><a className="book-topic-link" href={'#world/topic/'+link.topic} data-route-focus={'book-word-'+term+'-person-'+link.topic} onClick={e=>{e.preventDefault();navigateHash('world/topic/'+link.topic);}}>Mit {person.title} weiterdenken →</a></li>:null;})}</ul></LearningDetails>;
}
