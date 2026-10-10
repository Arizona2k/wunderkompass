import {useLayoutEffect} from 'react';
import {ArrowLeft,ArrowRight,Sparkles} from 'lucide-react';
import {navigateHash,restoreRouteView} from './hash-route';
import {publicUpdates,updateDate,type UpdateEntry} from './update-history';
export default function UpdateHistoryView(){
 const entries=publicUpdates();
 useLayoutEffect(()=>{restoreRouteView('updates');},[]);
 return <article className="update-history" aria-labelledby="updates-title">
  <a className="discovery-text-link" data-route-focus="updates-home" href="#globe" onClick={e=>{e.preventDefault();navigateHash('globe');}}><ArrowLeft size={18}/> Zur Startseite</a>
  <header className="updates-heading"><p className="eyebrow"><Sparkles size={16}/> WUNDERKOMPASS WÄCHST</p><h1 id="updates-title" tabIndex={-1}>Was ist neu?</h1><p>Vom ersten Globus bis zu sechs Wissenswelten: So ist WunderKompass gewachsen.</p></header>
  <p className="updates-note">Hier stehen bestätigte Veröffentlichungen. Änderungen, die noch entwickelt oder geprüft werden, erscheinen erst nach ihrer belegten Veröffentlichung.</p>
  <ol className="updates-timeline">{entries.slice(0,4).map(entry=><UpdateItem key={entry.id} entry={entry}/>)}</ol>
  {entries.length>4&&<details data-history-disclosure="updates-archive" className="updates-archive"><summary>Ältere Neuigkeiten ({entries.length-4})</summary><ol className="updates-timeline">{entries.slice(4).map(entry=><UpdateItem key={entry.id} entry={entry}/>)}</ol></details>}
  <details data-history-disclosure="updates-provenance" className="updates-provenance"><summary>Wie vollständig ist die Chronik?</summary><p>Der belegte Projektstart liegt am 6. Oktober 2026 deutscher Zeit. Alle 14 gespeicherten Website-Versionen sind erhalten. 13 davon wurden nachweislich erfolgreich veröffentlicht – von Version 1 bis zum aktuellen veröffentlichten Stand 14.</p><p>Version 6 wurde nur gespeichert und bleibt aus der öffentlichen Zeitreise ausgeblendet. Frühere Ideen oder nicht gespeicherte Entwürfe vor dem Anlegen der Website sind nicht vollständig überliefert. Die Daten hier stammen aus den bestätigten Veröffentlichungsprotokollen; die Beschreibungen wurden mit den erhaltenen Quellständen abgeglichen.</p><p>Spätere Entwicklungsänderungen sind vorbereitet und erscheinen erst nach ihrer belegten Veröffentlichung. Die Links oben öffnen die entsprechenden Bereiche in dem Stand, den du gerade verwendest.</p></details>
 </article>;
}

function UpdateItem({entry}:{entry:UpdateEntry}){return <li>
   <span className="updates-icon" aria-hidden="true">{entry.icon}</span><div className="updates-entry"><div className="updates-meta"><span>Version {entry.version}</span><span>{entry.publishedOn?'Veröffentlicht am':'Veröffentlicht · nachgewiesen am'} <time dateTime={entry.publishedOn??entry.confirmedOn}>{updateDate(entry)}</time></span></div><h2>{entry.title}</h2><p>{entry.summary}</p>
    <div className="updates-links">{entry.links.map(link=><a key={link.hash} data-route-focus={entry.id+"-"+link.hash} href={'#'+link.hash} onClick={e=>{e.preventDefault();navigateHash(link.hash);}}>{link.label}<ArrowRight size={16}/></a>)}</div>
    <details data-history-disclosure={entry.id}><summary>Mehr zu diesem Stand</summary>{entry.details.map(text=><p key={text}>{text}</p>)}</details>
   </div></li>;}
