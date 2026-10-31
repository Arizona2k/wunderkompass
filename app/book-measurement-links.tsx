import {BookOpen,ArrowRight} from 'lucide-react';
import measurementLinks from './book-measurement-topic-index.json';
import heatLinks from './book-heat-topic-index.json';
import lightLinks from './book-light-topic-index.json';
import waterLinks from './book-water-topic-index.json';
import particleLinks from './book-particle-topic-index.json';
import mechanicsLinks from './book-mechanics-topic-index.json';
import cellLinks from './book-cell-topic-index.json';
type BookLink={kind:'word'|'why';term:string;topic:string;connection:string};
const links:BookLink[]=[...[...measurementLinks,...heatLinks,...lightLinks,...waterLinks,...particleLinks].map(link=>({...link,kind:'word' as const})),...[...mechanicsLinks,...cellLinks].map(link=>({...link,kind:link.kind as 'word'|'why'}))];
import {navigateHash} from './hash-route';

export default function BookMeasurementLinks({topicId}:{topicId:string}){
 const related=links.filter(link=>link.topic===topicId);
 if(!related.length)return null;
 return <section className="lab-knowledge-connections" data-book-measurement-links={topicId}><h3><BookOpen size={20}/> {related.some(link=>link.kind==='why')?'Mit passenden Wörtern und Fragen weiterdenken':'Mit passenden Wörtern weiterdenken'}</h3>{related.map(link=><div className="connection-card" key={link.kind==='word'?link.term:'why:'+link.term}><a className="knowledge-link" data-route-focus={'topic-'+(link.kind==='why'?'why':'word')+'-'+topicId+'-'+link.term} href={'#book/'+(link.kind==='why'?'why':'words')+'/'+encodeURIComponent(link.term)} onClick={event=>{event.preventDefault();navigateHash('book/'+(link.kind==='why'?'why':'words')+'/'+encodeURIComponent(link.term));}}><span>{link.term}</span><ArrowRight size={17}/></a><p>{link.connection}</p></div>)}</section>;
}
