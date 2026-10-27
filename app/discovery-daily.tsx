import TopicMap from './topic-map';
import DiscoveryTopicMedia,{hasDiscoveryTopicMedia} from './discovery-topic-media';
import type {WorldEntry} from './world-types';
import type {Place} from './earth-data';
import {ArrowRight} from 'lucide-react';
export default function DiscoveryDaily({topic,place,day,onOpen}:{topic?:WorldEntry;place:Place;day:string;onOpen:()=>void}){
 const entry=topic??{title:place.name,locations:[{label:place.name,lat:place.lat,lon:place.lon}]};
 return <section className="daily-discovery discovery-daily" aria-labelledby="daily-discovery-title" data-discovery-day={day} data-discovery-target={topic?.id??place.id}>
  <div className="discovery-daily-media">{topic&&hasDiscoveryTopicMedia(topic)?<DiscoveryTopicMedia topic={topic} historyKey="home-daily"/>:<TopicMap compact entry={entry} onPlace={onOpen}/>}</div>
  <div><p className="eyebrow">ENTDECKUNG DES TAGES</p><h2 id="daily-discovery-title">{entry.title}</h2><p>{topic?.sensitive?'Eine ruhige historische Erklärung, freiwillig zum gemeinsamen Anschauen.':topic?.intro??place.text}</p><button className="discovery-text-link" onClick={onOpen}>{topic?'Entdeckerkarte öffnen':'Auf der Erde besuchen'}<ArrowRight size={18} aria-hidden="true"/></button></div>
 </section>;
}
