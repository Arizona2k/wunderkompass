import ResearchPreview from './research-preview';
import DiscoverySequencePreview from './discovery-sequence-preview';
import image from './knowledge-preview-image.json';
export default function DiscoveryActivityPreview({hash}:{hash:string}){
 if(hash==='games')return <figure className="discovery-game-preview"><img src={image.src} width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async"/><figcaption>Eigene Spielvorschau · KI-unterstützt · {image.caption}</figcaption></figure>;
 if(hash.startsWith('labs/experiment/'))return <div><ResearchPreview id="water"/><p className="discovery-preview-note">Passendes digitales Modell: Wasserkreislauf. Der Versuch öffnet die Anleitung zum eigenen Beobachten.</p></div>;
 if(hash.startsWith('labs/'))return <ResearchPreview id={hash.split('/')[1]}/>;
 if(hash.startsWith('journeys/'))return <DiscoverySequencePreview journey={hash.split('/')[1]}/>;
 if(hash.startsWith('world/route/'))return <DiscoverySequencePreview route={hash.split('/')[2]} showTitle={false}/>;
 return null;
}
