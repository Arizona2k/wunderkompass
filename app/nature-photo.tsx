import './nature-photo.css';
import WorldPhoto from './world-media';
import candidates from './nature-photo-candidates.json';
export function hasNaturePhoto(id:string){return Object.hasOwn(candidates,id);}
export function NaturePhoto({id,context='book'}:{id:string;context?:'book'|'globe'}){
 const imageCandidates=candidates[id as keyof typeof candidates];
 return imageCandidates?<div className="nature-real-photo"><WorldPhoto id={id} imageCandidates={imageCandidates} creditDisclosure historyKey={'nature-photo-'+context+'-'+id}/></div>:null;
}
