'use client';
import CycleFigure,{WATER,MOON} from './cycle-figure';
import {useSavedGame,useSavedModel} from './saved-games';
export default function CycleModels({kind,onSolved}:{kind:'water-cycle'|'moon-phases';onSolved:()=>void}){
 const [step,setStep]=useSavedModel<number>('cycleStep',0,{min:0,max:3}),[seen,setSeen]=useSavedGame<number[]>('cycleSeen',[],(v,f)=>Array.isArray(v)&&v.every(n=>Number.isInteger(n)&&n>=0&&n<=3)?[...new Set(v)]:f);
 const water=kind==='water-cycle',stations=water?WATER:MOON,current=stations[step];
 function choose(i:number){setStep(i);const next=[...new Set([...seen,i])];setSeen(next);if(next.length===4)onSolved();}
 return <section className="cycle-model"><p className="eyebrow">AUSPROBIEREN & BEOBACHTEN</p><h3>{water?'Folge den Wegen des Wassers':'Wechsle deinen Blick auf den Mond'}</h3><p>Wähle eine Station. Beobachte die Zeichnung und erkläre den Unterschied.</p><CycleFigure kind={kind} step={step}/>{!water&&<div className="moon-observation"><span className={'moon-disc moon-phase-'+step} role="img" aria-label={'Sichtbare Mondscheibe: '+current.title}/><strong>Von der Erde aus: {current.title}</strong></div>}
 <div className="model-buttons" role="group" aria-label={water?'Wasserstation wählen':'Mondphase wählen'}>{stations.map((s,i)=><button className="secondary-button" aria-pressed={step===i} key={s.title} onClick={()=>choose(i)}>{i+1}. {s.title}</button>)}</div><div className="model-result" role="status"><strong>{current.title}</strong><p>{current.text}</p></div><p className="small-note">{water?'Schematischer Beispielweg, kein geschlossener Fahrplan: Pflanzen, Eis und Grundwasser eröffnen weitere Wege.':'Vier ausgewählte Phasen; Bahnen, Größen und Abstände nicht maßstabsgetreu. Ansicht der Mondscheibe für eine aufrechte Orientierung auf der Nordhalbkugel. Der Erdschatten verursacht die normalen Mondphasen nicht.'}</p><p>{seen.length}/4 Stationen selbst erkundet</p></section>;
}
