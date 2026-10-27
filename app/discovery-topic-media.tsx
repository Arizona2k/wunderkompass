import WorldPhoto from './world-media';
import TopicMap from './topic-map';
import ResearchPreview from './research-preview';
import {navigateHash} from './hash-route';
import WaterMoonDrawing from './water-moon-drawing';
import ScienceDiagram,{hasScienceDiagram} from './science-diagram';
import CycleFigure,{WATER} from './cycle-figure';
import PlanetSizeFigure,{COMPARISON_PLANETS} from './planet-size-figure';
import type {WorldEntry} from './world-types';
export const hasDiscoveryTopicMedia=(topic:WorldEntry)=>!!topic.image||hasScienceDiagram(topic.id)||['science-moon-phases','science-tides','science-currents','science-water-cycle','science-solar-system','science-seasons'].includes(topic.id);
/** The article's existing photo or explanatory drawing, without loading its interactive model. */
export default function DiscoveryTopicMedia({topic,historyKey}:{topic:WorldEntry;historyKey?:string}){
 const key=historyKey??'home-topic-'+topic.id;
 if(topic.image)return <WorldPhoto id={topic.image} historyKey={key+'-credit'} creditDisclosure/>;
 if(topic.id==='science-moon-phases')return <ResearchPreview id="moon"/>;
 if(topic.id==='science-tides')return <ResearchPreview id="tides"/>;
 if(topic.id==='science-currents')return <WaterMoonDrawing id={topic.id} historyKey={key+'-model'} preview/>;
 if(hasScienceDiagram(topic.id))return <ScienceDiagram id={topic.id} historyKey={key+'-model'} preview/>;
 if(topic.id==='science-water-cycle')return <figure className="discovery-model-preview"><CycleFigure kind="water-cycle"/><ol className="discovery-model-labels">{WATER.map(station=><li key={station.title}>{station.title}</li>)}</ol><figcaption>Eigene Modellvorschau mit KI-Unterstützung · ein möglicher Wasserweg, kein geschlossener Fahrplan. Weitere Wege führen durch Pflanzen, Eis und Grundwasser.</figcaption></figure>;
 if(topic.id==='science-seasons')return <ResearchPreview id="seasons"/>;
 if(topic.id==='science-solar-system')return <figure className="discovery-model-preview"><PlanetSizeFigure planet={COMPARISON_PLANETS[4]}/><figcaption>Eigene Modellvorschau mit KI-Unterstützung · Erde und Jupiter im selben Durchmessermaßstab (1 : 11,21). Der Abstand hat keine Bedeutung.</figcaption></figure>;
 return <TopicMap compact entry={topic} onPlace={()=>navigateHash('world/topic/'+topic.id)}/>;
}
