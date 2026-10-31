import {LearningDetails} from './learning-components';
import {navigateHash} from './hash-route';
import incomingLight from './book-light-word-link-index.json';
import incomingWater from './book-water-word-link-index.json';
import incomingParticle from './book-particle-word-link-index.json';
import incomingMechanics from './book-mechanics-word-link-index.json';

const incoming:Record<string,{term:string;reason:string}[]>={};
for(const pack of [incomingLight,incomingWater,incomingParticle,incomingMechanics])for(const [term,links]of Object.entries(pack))(incoming[term]??=[]).push(...links);

/** Small generated incoming edges keep existing words connected as a pack grows. */
export function BookRelatedWords({term}:{term:string}){
 const links=incoming[term];
 if(!links?.length)return null;
 return <LearningDetails className="book-related-words" summary="Verwandte Begriffe entdecken" data-book-related-words={term} data-history-disclosure={'book-related-words-'+term}>
  <ul>{links.map(link=><li key={link.term}><p>{link.reason}</p><a className="book-topic-link" href={'#book/words/'+encodeURIComponent(link.term)} data-route-focus={'book-word-related-'+term+'-'+link.term} onClick={event=>{event.preventDefault();navigateHash('book/words/'+encodeURIComponent(link.term));}}>Mit „{link.term}“ weiterdenken →</a></li>)}</ul>
 </LearningDetails>;
}
