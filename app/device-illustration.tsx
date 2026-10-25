import DATA from './device-illustrations.json';
import './device-illustration.css';

export const hasDeviceIllustration=(id:string)=>DATA.entries.some(entry=>entry.id===id);

export default function DeviceIllustration({id,compact=false}:{id:string;compact?:boolean}){
 const entry=DATA.entries.find(entry=>entry.id===id);if(!entry)return null;
 return <figure className={'device-illustration '+(compact?'compact':'')} data-device-illustration={id}>
  <img src={entry.src} alt={compact?'':entry.alt} aria-hidden={compact||undefined} width={entry.width} height={entry.height} loading="lazy" decoding="async"/>
  {compact?<span className="device-media-kind">KI-Illustration</span>:<>
   <div className="device-illustration-labels">{entry.labels.map(label=><span key={label}>{label}</span>)}</div>
   <figcaption>{entry.caption} <a href={entry.source.url} target="_blank" rel="noreferrer">{entry.source.label}</a></figcaption>
  </>}
 </figure>;
}
