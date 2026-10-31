"use client";
import {Check,Compass,Globe2} from 'lucide-react';
import {Progress} from '@/components/ui/progress';
import {JOURNEYS} from './learning-overview';
import {countryPlace,type Country,type Place} from './earth-data';
import type {LocalProgress} from './progress-storage';
export default function LearningProgress({progress,countries,onJourney,onPlace}:{progress:LocalProgress;countries:Country[];onJourney:(id:string)=>void;onPlace:(p:Place)=>void}){
 const done=new Set(progress.journeys),started=JOURNEYS.filter(j=>j.id in progress.chapters||done.has(j.id));
 const known=countries.filter(c=>progress.discoveries.includes('country:'+c.properties.id));
 const next=JOURNEYS.find(j=>!done.has(j.id));
 return <section className="learning-map"><h3><Compass size={21}/> Deine Lernlandkarte</h3><p>{started.length} von {JOURNEYS.length} Lernreisen begonnen. Du bestimmst das Tempo.</p>
  {next&&<button className="secondary-button next-learning" onClick={()=>onJourney(next.id)}>Als Nächstes: {next.title}</button>}
  <details><summary>Lernreisen und Kapitel ansehen</summary><div className="learning-map-grid">{JOURNEYS.map(j=>{const finished=done.has(j.id);const chapters=(progress.completedChapters[j.id]??[]).filter(n=>n<j.steps.length).length;const total=j.steps.length;return <button className="learning-map-tile" key={j.id} onClick={()=>onJourney(j.id)}><strong>{j.title}{finished&&<Check size={18} aria-label="Abgeschlossen"/>}</strong><span>{finished?'Abgeschlossen':j.id in progress.chapters?`${chapters} von ${total} Kapiteln erkundet`:'Noch nicht begonnen'}</span><Progress value={finished?100:chapters/total*100} aria-label={`${j.title}: ${finished?'abgeschlossen':chapters+' von '+total+' Kapiteln'}`}/></button>;})}</div></details>
  <details><summary><Globe2 size={17}/> Deine entdeckten Länder ({known.length})</summary>{known.length?<div className="known-countries">{known.map(c=><button className="secondary-button" key={c.properties.id} onClick={()=>onPlace(countryPlace(c))}>{c.properties.name}</button>)}</div>:<p>Tippe ein Land auf der Weltkugel an. Hier kannst du es später wiederfinden.</p>}</details>
  <p className="small-note">Eine Entdeckung zeigt, was du besucht hast. Ein Reisestempel zeigt, dass du das Abschlussrätsel erklärt hast. Beides ist keine Schulnote.</p>
 </section>;
}
