import {useEffect,useRef,useState} from 'react';
import {useBookMeasurement} from './book-measurement-data';
import {LearningStatus} from './learning-components';
import {LearningDetails} from './learning-components';
import type {MeasurementLearning} from './book-measurement-data';
import {lengthUnits,timeInterval,temperatureUnits} from './book-measure-math.mjs';
import {BookStudyBody,useBookStudyReturn} from './book-study';
const number=(n:number)=>n.toLocaleString('de-DE',{maximumFractionDigits:2});
export function BookMeasurement({term,onTopic}:{term:string;onTopic?:(id:string)=>void}){
 const details=useRef<HTMLDetailsElement|null>(null),retryFocus=useRef(false);
 const [active,setActive]=useState(false),{learning,error,retry,sourceReadOn}=useBookMeasurement(term,active);
 useBookStudyReturn(learning!==null,active,details);
 useEffect(()=>{if(!learning)return;if(retryFocus.current){retryFocus.current=false;if(document.activeElement===document.body)details.current?.querySelector('summary')?.focus({preventScroll:true});}},[learning,term]);
 return <LearningDetails className="book-study" summary="Weiterforschen · freiwillig" data-book-study={term} data-history-disclosure={'book-study-'+term} onToggle={e=>{details.current=e.currentTarget;if(e.currentTarget.open)setActive(true);}}>
  {learning&&sourceReadOn?<MeasurementStudy term={term} learning={learning} sourceReadOn={sourceReadOn} onTopic={onTopic}/>:<LearningStatus tone={error?'error':'loading'} action={error?<button className="secondary-button" onClick={e=>{retryFocus.current=document.activeElement===e.currentTarget;retry();}}>Wortvertiefung erneut laden</button>:undefined}>{error?'Diese Vertiefung konnte nicht sicher geladen werden. Definition, Pass und Notizen bleiben erhalten.':'Deine freiwillige Vertiefung wird geladen …'}</LearningStatus>}
 </LearningDetails>;
}
function MeasurementStudy({term,learning,sourceReadOn,onTopic}:{term:string;learning:MeasurementLearning;sourceReadOn:string;onTopic?:(id:string)=>void}){
 return <BookStudyBody term={term} learning={learning} sourceReadOn={sourceReadOn} onTopic={onTopic}>
  {learning.model&&<MeasureModel kind={learning.model}/>}
  {learning.illustration==='entities'&&<figure className="book-entities" style={{margin:'16px 0'}}><svg style={{display:'block',width:'100%',height:'auto',maxWidth:520}} viewBox="0 0 260 90" role="img" aria-label="Eigene Zählskizze: sechs Kugeln in drei Paaren">{[0,1,2].map(i=><g key={i}><path d={'M'+(30+i*85)+' 40H'+(60+i*85)} stroke="#245d70" strokeWidth={4}/><circle cx={30+i*85} cy={40} r={12} fill="#bfdbe9" stroke="#245d70" strokeWidth={2}/><circle cx={60+i*85} cy={40} r={12} fill="#bfdbe9" stroke="#245d70" strokeWidth={2}/></g>)}</svg><figcaption>Sechs einzelne Kugeln oder drei Paare. Eine eigene Zählhilfe, keine echte Molmenge oder maßstäbliche Teilchenaufnahme.</figcaption></figure>}
 </BookStudyBody>;
}
function MeasureModel({kind}:{kind:'length'|'duration'|'temperature'}){
 const [value,setValue]=useState(kind==='length'?50:kind==='duration'?4:0),[start,setStart]=useState(20);
 const config=kind==='length'?{min:10,max:200,step:10,label:'Beispiellänge in Zentimetern'}:kind==='duration'?{min:1,max:10,step:1,label:'Dauer in Sekunden'}:{min:-20,max:40,step:5,label:'Beispieltemperatur in Grad Celsius'};
 const length=kind==='length'?lengthUnits(value):null,time=kind==='duration'?timeInterval(start,value):null,temp=kind==='temperature'?temperatureUnits(value):null;
 const result=length?number(length.centimetres)+' cm = '+number(length.metres)+' m':time?'Beginn '+time.start+' s · Ende '+time.end+' s · Dauer '+time.duration+' s':number(temp!.celsius)+' °C = '+number(temp!.kelvin)+' K';
 return <section className="book-measure" data-book-measure={kind}><h4><strong>{kind==='length'?'Gleiche Länge, zwei Zahlen':kind==='duration'?'Beginn und Dauer trennen':'Zwei Skalen, gleich große Schritte'}</strong></h4><p>Vermute zuerst, was sich ändert. Verändere dann eine Angabe.</p><label style={{display:'block'}}>{config.label}: <strong>{number(value)}</strong><input style={{display:'block',margin:0,width:'100%',minHeight:44}} type="range" {...{min:config.min,max:config.max,step:config.step}} value={value} onChange={e=>setValue(Number(e.target.value))}/></label>{time&&<div className="book-measure-start" role="group" aria-label="Beginn auf der Zeitlinie">{[10,20].map(n=><button className="secondary-button" aria-pressed={start===n} key={n} onClick={()=>setStart(n)}>Beginn bei {n} s</button>)}</div>}
 <svg style={{display:'block',width:'100%',height:'auto',maxWidth:520}} viewBox="0 0 260 115" role="img" aria-label={kind==='length'?'Eigene virtuelle Längenskala, kein echtes Lineal':kind==='duration'?'Eigene Zeitlinie mit Beginn und Ende':'Eigene Skizze zweier Temperaturskalen, keine Messung'}>
 {length&&<><path d="M20 90H240" stroke="#245d70" strokeWidth={3}/>{Array.from({length:11},(_,i)=><path key={i} d={'M'+(20+i*22)+' 90V'+(i%5===0?68:78)} stroke="#245d70" strokeWidth={2}/>)}<rect x={20} y={30} width={length.centimetres/200*220} height={25} fill="#bfdbe9" stroke="#245d70"/><path d={'M'+(20+length.centimetres/200*220)+' 58V90'} stroke="#8b463d" strokeWidth={2}/></>}
 {time&&<><path d="M20 65H240" stroke="#245d70" strokeWidth={3}/><path d={'M'+(20+time.start/30*220)+' 65H'+(20+time.end/30*220)} stroke="#8b463d" strokeWidth={8}/>{[time.start,time.end].map(n=><circle key={n} cx={20+n/30*220} cy={65} r={6} fill="#245d70"/>)}<path d="M20 80V90M240 80V90" stroke="#245d70" strokeWidth={2}/></>}
 {temp&&[0,1].map(i=><g key={i}><path d={'M'+(45+i*140)+' 15V100'} stroke="#245d70" strokeWidth={3}/>{Array.from({length:7},(_,j)=><path key={j} d={'M'+(35+i*140)+' '+(100-j*14)+'H'+(55+i*140)} stroke="#245d70" strokeWidth={2}/>)}<circle cx={45+i*140} cy={100-(temp.celsius+20)/60*84} r={7} fill="#8b463d"/></g>)}
 </svg><div className="book-model-key">{length?'Zeichenskala: 0 bis 200 cm. Der Balken zeigt die gewählte Beispiellänge.':time?'Zeichenskala: 0 bis 30 s. Der markierte Abschnitt liegt zwischen Beginn und Ende.':'Links: −20 bis 40 °C. Rechts: 253,15 bis 313,15 K. Die markierten Punkte beschreiben dieselbe Beispieltemperatur.'}</div><p className="book-feedback" role="status" aria-live="polite">{result}</p><p className="small-note">Nur ein begrenztes Zahlenmodell. Die Zeichnung ist kein physisches Messgerät und auf deinem Bildschirm nicht maßstabsgetreu.</p></section>;
}
