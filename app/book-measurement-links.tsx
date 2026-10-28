import {BookOpen,ArrowRight} from 'lucide-react';
import measurementLinks from './book-measurement-topic-index.json';
import heatLinks from './book-heat-topic-index.json';
import lightLinks from './book-light-topic-index.json';
const links=[...measurementLinks,...heatLinks,...lightLinks];
import {navigateHash} from './hash-route';

export default function BookMeasurementLinks({topicId}:{topicId:string}){
 const related=links.filter(link=>link.topic===topicId);
 if(!related.length)return null;
 return <section className="lab-knowledge-connections" data-book-measurement-links={topicId}><h3><BookOpen size={20}/> Mit passenden Wörtern weiterdenken</h3>{related.map(link=><div className="connection-card" key={link.term}><a className="knowledge-link" data-route-focus={'topic-word-'+topicId+'-'+link.term} href={'#book/words/'+encodeURIComponent(link.term)} onClick={event=>{event.preventDefault();navigateHash('book/words/'+encodeURIComponent(link.term));}}><span>{link.term}</span><ArrowRight size={17}/></a><p>{link.connection}</p></div>)}</section>;
}
