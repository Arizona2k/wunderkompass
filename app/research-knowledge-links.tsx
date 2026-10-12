import {FlaskConical,ArrowRight} from 'lucide-react';
import {LAB_SEARCH,RESEARCH_PATHS} from './research-catalog';
import {RESEARCH_LINK_REASONS} from './research-links';
import {navigateHash} from './hash-route';
export default function ResearchKnowledgeLinks({topicId}:{topicId:string}){
 const labs=LAB_SEARCH.filter(l=>RESEARCH_PATHS[l.id].topic===topicId);
 if(!labs.length)return null;
 return <section className="lab-knowledge-connections"><h3><FlaskConical size={20}/> Im Forscherlabor ausprobieren</h3>{labs.map(l=><div className="connection-card" key={l.id}><a className="knowledge-link" data-route-focus={'world-lab-'+topicId+'-'+l.id} href={'#labs/'+l.id} onClick={e=>{e.preventDefault();navigateHash('labs/'+l.id);}}><span>{l.name}</span><ArrowRight size={17}/></a><p>{RESEARCH_LINK_REASONS[l.id].topic}</p></div>)}</section>;
}
