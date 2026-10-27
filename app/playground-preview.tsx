import {MEMORY_PAIRS} from './memory-pairs';
import {LAYERS} from './earth-data';
const PREVIEWS=new Set(['classic:hunt','classic:memory','classic:order']);
export const hasPlaygroundPreview=(key:string)=>PREVIEWS.has(key);
export default function PlaygroundPreview({game}:{game:string}){
 if(game==='classic:hunt')return <span className="playground-preview preview-globe" aria-hidden="true"><img src="/previews/playground-hunt-model.jpg" width="320" height="321" alt="" loading="lazy"/><span>3D-Modell · KI-unterstützt</span></span>;
 if(game==='classic:memory')return <span className="playground-preview preview-memory" aria-hidden="true"><span className="preview-memory-grid">{[MEMORY_PAIRS[0],MEMORY_PAIRS[4]].flat().map(label=><span key={label}>{label}</span>)}</span><span>Spielkarten · KI-unterstützt</span></span>;
 if(game==='classic:order')return <span className="playground-preview preview-order" aria-hidden="true"><span className="preview-order-pool">{[LAYERS[1],LAYERS[0],LAYERS[3],LAYERS[2]].map(layer=><span key={layer.id}>{layer.name}</span>)}</span><span>Bausteine · KI-unterstützt</span></span>;
 return null;
}
