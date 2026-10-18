import DATA from './animal-illustrations.json';
import './animal-illustration.css';
export const hasAnimalIllustration=(id:string)=>DATA.entries.some(entry=>entry.id===id);
export default function AnimalIllustration({id,compact=false}:{id:string;compact?:boolean}){
 const entry=DATA.entries.find(entry=>entry.id===id);if(!entry)return null;
 return <figure className={'animal-illustration '+(compact?'compact':'')} data-animal-illustration={id}>
  <img src={entry.src} alt={compact?'':entry.alt} aria-hidden={compact||undefined} width={360} height={220} loading="lazy" decoding="async"/>
  {!compact&&<><div className="animal-illustration-labels">{entry.labels.map(label=><span key={label}>{label}</span>)}</div><figcaption>{entry.caption}</figcaption></>}
 </figure>;
}
