import {useState} from 'react';
import {Volume2} from 'lucide-react';

export default function QuestionHints({hints,onRead}:{hints:readonly string[];onRead:(s:string)=>void}){
 const [second,setSecond]=useState(false);
 if(!hints.length)return null;
 return <details className="world-game-hint"><summary>Ein Denkhinweis</summary><p>{hints[0]}</p>{hints.length>1&&(second?<div className="challenge-second-hint" role="status"><strong>Nächster Denkschritt</strong><p>{hints[1]}</p></div>:<button className="secondary-button" onClick={()=>setSecond(true)}>Noch ein Hinweis</button>)}<button className="speech-button" onClick={()=>onRead(hints.slice(0,second?2:1).join(' '))}><Volume2 size={17}/> Hinweise vorlesen</button></details>;
}
