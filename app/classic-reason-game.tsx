'use client';
import {useRef} from 'react';
import {Check,BookOpen,Volume2,Trophy} from 'lucide-react';
import {useGameSnapshot,useSavedGame} from './saved-games';
import QuestionHints from './question-hints';
import {navigateHash} from './hash-route';
import {CLASSIC_QUESTIONS,answerReasonRound,klassikSpielStufe,neueKlassikRunde,restoreReasonRound,rundenStufe,type ReasonGame,type ReasonRound} from './classic-learning';
import {vorigeRunde} from './kern/auswahl';
import type {Review} from './progress-storage';
import StufenWahl from './kern/stufen-wahl';
import {STUFEN_NAME,type Stufe} from './kern/stufe';
import {leseGeschafft,mitGeschafft,type Geschafft} from './world-game-runde';
import INDEX from './world-index.json';
import {WORLD_ROUTES} from './world-index';
import {WOERTER} from './kern/woerter';
// „Stimmt das wirklich?“ und „Wer lebt wo?“ folgen der gemeinsamen Stufe (Teil B, Aufgabe 9; wie Kreuz und quer und die
// Welt-Spiele, Entscheidungsliste Teil B, Punkte 3 und 8): Das Spiel startet gleich mit einer Runde, eine gespeicherte Runde
// läuft mit ihrer Stufe zu Ende, ein Wechsel in der Runde startet sofort eine neue im selben Brett. Experte spielt Profi,
// solange es keine vier echten Experten-Fragen gibt (E3). Zähler wie „… davon beim ersten Versuch“ gibt es nicht mehr (E13).
export default function ClassicReasonGame({game,review,stufe,onStufe,onReview,onWin,onRead,onTopic}:{game:ReasonGame;review:Review;stufe:Stufe;onStufe:(s:Stufe)=>void;onReview:(id:string,correct:boolean)=>void;onWin:()=>void;onRead:(s:string)=>void;onTopic:(id:string)=>void}){
 const saved=useGameSnapshot(),abschluss=useRef<HTMLHeadingElement>(null);
 const runde=(s:Stufe,vorige:readonly string[])=>neueKlassikRunde(game,s,review,vorige);
 const [round,setRound]=useSavedGame<ReasonRound>('learningRound',()=>runde(stufe,vorigeRunde(saved)),(value,fallback)=>{const r=restoreReasonRound(game,value);return r.ids.length?r:fallback;});
 const [,setVorige]=useSavedGame<string[]>('vorige',[]),[geschafft,setGeschafft]=useSavedGame<Geschafft>('geschafft',{},value=>leseGeschafft(value));
 const gespielt=rundenStufe(round);
 function neueRunde(neu:Stufe){onRead('');setVorige(round.ids);setRound(runde(neu,round.ids));}
 function wechsel(neu:Stufe){onStufe(neu);if(klassikSpielStufe(game,neu)!==gespielt)neueRunde(neu);}
 const hinweis=klassikSpielStufe(game,stufe)!==gespielt?`Diese Runde spielst du noch als ${STUFEN_NAME[gespielt]}. Die neue Stufe gilt ab der nächsten Runde.`:stufe==='experte'&&gespielt==='profi'?'Experte gibt es hier noch nicht. Du spielst Profi.':null;
 const stufenZeile=<StufenWahl stufe={stufe} spielt={gespielt} onStufe={wechsel} hinweis={hinweis} ohneZurueck={round.done}/>;
 const q=CLASSIC_QUESTIONS.find(q=>q.id===round.ids[round.index])!,right=round.answer===q.correct,topic=INDEX.find(t=>t.id===q.topic),route=WORLD_ROUTES.find(r=>r.topics.includes(q.topic)),link=<button className="secondary-button" data-route-focus={'game-knowledge-'+q.id} onClick={()=>onTopic(q.topic)}><BookOpen size={18} aria-hidden="true"/> Wissen vertiefen: {topic?.title??'Passende Karte'}</button>;
 if(round.done)return <section className="classic-learning game-finish">{stufenZeile}<Trophy size={38} aria-hidden="true"/><h2 ref={abschluss} tabIndex={-1}>Zusammenhänge entdeckt!</h2><p>Du hast alle {round.ids.length} Aufgaben gelöst. Nachdenken und Nachschauen gehören zum Lernen.</p><p className="success-inline"><Check size={18} aria-hidden="true"/> Dein Spielstempel bleibt im Entdeckerpass.</p><div className="game-finish-actions"><button className="primary-button" onClick={()=>neueRunde(stufe)}>Neue Aufgabenfolge auf dieser Stufe</button>{link}{route&&<button className="speech-button" data-route-focus={'game-route-'+game} onClick={()=>navigateHash('world/route/'+route.id)}>Wissensroute: {route.title}</button>}</div><p className="small-note">Oder mach eine Pause. Hier gibt es keine Serien und keinen Zeitdruck.</p></section>;
 return <section className="classic-learning">{stufenZeile}<p className="eyebrow">AUFGABE {round.index+1} VON {round.ids.length}</p><progress aria-label="Gelöste Spielaufgaben" value={round.index+(right?1:0)} max={round.ids.length}/><h2 id="reason-question" tabIndex={-1}>{q.prompt}</h2><button className="speech-button" onClick={()=>onRead(q.prompt+'. '+round.orders[q.id].join('. '))}><Volume2 size={17} aria-hidden="true"/> Aufgabe vorlesen</button>{!right&&<QuestionHints key={q.id} hints={q.hints} onRead={onRead}/>}<div className="quiz-answers">{round.orders[q.id].map((a,i)=><button key={a} className={'quiz-answer '+(round.answer===a?(right?'is-correct':'is-incorrect'):'')} disabled={right} onClick={()=>{if(round.answer===null)onReview('classic:'+game+':'+q.id,a===q.correct);setRound(r=>answerReasonRound(r,a));}}><span className="answer-letter" aria-hidden="true">{String.fromCharCode(65+i)}</span><span>{a}</span>{round.answer===a&&<span className="answer-state">{right?'Passt':'Noch prüfen'}</span>}</button>)}</div>{round.answer&&<div className="game-feedback" role="status"><strong>{right?WOERTER.richtig:WOERTER.nochNicht}</strong><p>{right?q.why:q.wrongReasons[round.answer]}</p>{right?<><button className="primary-button" onClick={()=>{onRead('');if(round.index===round.ids.length-1){setRound({...round,done:true});if(round.stufe)setGeschafft(mitGeschafft(geschafft,round.stufe));onWin();requestAnimationFrame(()=>abschluss.current?.focus());}else{setRound({...round,index:round.index+1,answer:null});requestAnimationFrame(()=>document.getElementById('reason-question')?.focus());}}}>{round.index===round.ids.length-1?'Runde abschließen':'Nächste Aufgabe'}</button>{link}</>:<p className="small-note">Vergleiche in Ruhe oder schau in den Tipp.</p>}</div>}</section>;
}
