import connections from './nature-connections.json';
import {LearningDetails} from './learning-components';
import {navigateHash} from './hash-route';
import {restoreRouteView} from './hash-route';
import {useLayoutEffect} from 'react';
import './nature-connections.css';
type Link={id:string;name:string;reason:string};
export default function NatureConnections({kind,target}:{kind:'word'|'topic'|'lab';target:string}){
 useLayoutEffect(()=>{const focus=history.state?.wunderFocus;if(typeof focus==='string'&&focus.startsWith('nature-reverse-'+kind+'-'+target+'-')){const root=Array.from(document.querySelectorAll<HTMLDetailsElement>('details.nature-links')).find(el=>el.dataset.historyDisclosure==='nature-reverse-'+kind+'-'+target);if(root?.getClientRects().length)restoreRouteView(location.hash.slice(1));}});
 const links=(connections as Record<string,Record<string,Link[]>>)[kind][target];if(!links?.length)return null;
 return <LearningDetails className="nature-links" summary="Mit passenden Naturorten weiterdenken" data-history-disclosure={'nature-reverse-'+kind+'-'+target}><ul>{links.map(link=><li key={link.id}><p>{link.reason}</p><a className="book-topic-link" data-route-focus={'nature-reverse-'+kind+'-'+target+'-'+link.id} href={'#book/nature/'+link.id} onClick={e=>{e.preventDefault();navigateHash('book/nature/'+link.id);}}>{link.name} entdecken →</a></li>)}</ul></LearningDetails>;
}
