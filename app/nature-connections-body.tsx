import {useEffect} from 'react';
import {navigateHash} from './hash-route';
import links from './nature-place-links.json';
export default function NatureConnectionsBody({id,onReady}:{id:string;onReady:(ready:boolean)=>void}){
 const related=links[id as keyof typeof links];
 useEffect(()=>{onReady(true);},[onReady]);
 return <ul>{related.map(link=><li key={link.id}><p>{link.reason}</p><a className="book-topic-link" href={'#book/nature/'+encodeURIComponent(link.id)} data-route-focus={'nature-incoming-'+id+'-'+link.id} onClick={event=>{event.preventDefault();navigateHash('book/nature/'+encodeURIComponent(link.id));}}>Mit „{link.name}“ weiterdenken →</a></li>)}</ul>;
}
