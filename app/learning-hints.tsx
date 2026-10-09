"use client";
import {useState} from 'react';
import {Lightbulb} from 'lucide-react';
export function LearningHints({hints}:{hints:readonly string[]}){
 const [step,setStep]=useState(0);
 return <div className="learning-hints"><button className="secondary-button" disabled={step===hints.length} onClick={()=>setStep(n=>Math.min(hints.length,n+1))}><Lightbulb size={18}/>{step===0?'Ich brauche eine Lernhilfe':step===hints.length?'Alle Hinweise gezeigt':'Nächster Hinweis'}</button>{step>0&&<ol aria-live="polite">{hints.slice(0,step).map((hint,i)=><li key={i}>{hint}</li>)}</ol>}</div>;
}
export const CATEGORY_HINTS:Record<string,string>={Weltkugel:'Stell dir die Erde als Kugel vor. Denke an Land, Wasser und die gedachten Linien.',Erdschichten:'Gehe von der festen Außenhaut in Richtung Erdmitte. Fest und flüssig sind nicht dasselbe.',Länder:'Denke an Kontinente, Kartenformen und die Lage des Landes.',"Wasser & Wetter":'Denke daran, wie Wasser seinen Zustand ändern kann. Eine Wolke enthält Tröpfchen oder Eiskristalle.',Jahreszeiten:'Die geneigte Erdachse verändert Sonnenstand und Tageslänge. Norden und Süden sind unterschiedlich.',Natur:'Vergleiche, welche Umgebung das Lebewesen oder die Landschaft braucht.',"Erde schützen":'Überlege, was Tiere schützt oder Material, Energie und Abfall spart.'};
