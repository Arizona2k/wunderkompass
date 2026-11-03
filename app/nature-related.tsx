import {LearningDetails} from './learning-components';
import {navigateHash} from './hash-route';
import links from './nature-word-links.json';
export function NatureRelated({term}:{term:string}){
 const related=links[term as keyof typeof links];if(!related?.length)return null;
 return <LearningDetails className="book-related-words nature-word-links" summary="An Naturorten weiterforschen" data-history-disclosure={'word-nature-'+term} data-nature-incoming={term}><ul>{related.map(link=><li key={link.id}><p>{link.reason}</p><a className="book-topic-link" href={'#book/nature/'+encodeURIComponent(link.id)} data-route-focus={'word-nature-'+term+'-'+link.id} onClick={event=>{event.preventDefault();navigateHash('book/nature/'+encodeURIComponent(link.id));}}>Mit „{link.name}“ weiterdenken →</a></li>)}</ul></LearningDetails>;
}
