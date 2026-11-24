'use client';
import {useRef} from 'react';
import {Check,Volume2} from 'lucide-react';
import {useGameSnapshot,useSavedGame} from './saved-games';
import {vorigeRunde} from './kern/auswahl';
import type {Review} from './progress-storage';
import QuestionHints from './question-hints';
import HINTS from './challenge-hints.json';
import {challengeQuestionForOrder,EXPERTEN_HINWEIS,gespielteStufe,kreuzUndQuerRunde,restoreChallenge,stufeDerFrage,type ChallengeSession} from './knowledge-challenge';
import StufenWahl,{stufeWechseln} from './kern/stufen-wahl';
import {StufenVorschlagHinweis,useStufenVorschlag} from './kern/stufen-vorschlag';
import {flushSync} from 'react-dom';
import {rundeNochSatz,spielVorschlagErlaubt,type Stufe} from './kern/stufe';
import {leseGeschafft,mitGeschafft,type Geschafft} from './world-game-runde';
import {WOERTER} from './kern/woerter';
// Kreuz und quer (Teil B, Aufgabe 9; Entscheidungsliste Teil B, Punkte 3 und 8): Das Spiel startet gleich mit der Stufe aus
// dem Pass, ohne Auswahl „Leicht/Mittel/Schwer“. Eine gespeicherte Runde läuft mit ihrer Stufe zu Ende (E1), auch eine alte
// mit Leicht/Mittel/Schwer. Ein Wechsel in der Runde startet sofort eine neue Runde der neuen Stufe im selben Brett, damit
// stufeWechseln den Knopf „Ändern“ wiederfindet (stufen-wahl.tsx). „Neue Runde“ oben merkt die vorige Runde (world-games.tsx).
export default function KnowledgeChallenge({review,stufe,onStufe,onWin,onRead,onReview,onTopic}:{review:Review;stufe:Stufe;onStufe:(s:Stufe)=>void;onWin:()=>void;onRead:(s:string)=>void;onReview:(id:string,correct:boolean)=>void;onTopic:(id:string)=>void}){
 const saved=useGameSnapshot(),abschluss=useRef<HTMLHeadingElement>(null),raum=useRef<HTMLElement>(null),weiter=useRef<HTMLButtonElement>(null);
 const runde=(s:Stufe,vorige:readonly string[])=>kreuzUndQuerRunde(s,vorige,Math.random,review);
 // Ein leerer Spielstand (frisch, nach „Neue Runde“ oder aus der Zeit der Auswahl) beginnt gleich eine Runde.
 const [session,setSession]=useSavedGame<ChallengeSession>('challenge',()=>runde(stufe,vorigeRunde(saved)),(value,fallback)=>{const r=restoreChallenge(value,fallback);return r.ids.length?r:fallback;});
 const [,setVorige]=useSavedGame<string[]>('vorige',[]),[geschafft,setGeschafft]=useSavedGame<Geschafft>('geschafft',{},value=>leseGeschafft(value));
 const gespielt=gespielteStufe(session);
 // Stufen-Vorschlag wie auf der Karte (E8, S8): erste Antwort je Frage, nur Fragen der Stufe der Runde, höchstens einer je
 // Runde, und nur, solange die Runde auf der gewählten Stufe läuft (spielVorschlagErlaubt; Code-Nachprüfung PR 2, Befund 1).
 const {vorschlag,merke,schliessen}=useStufenVorschlag('challenge:'+session.ids.join(','),gespielt,spielVorschlagErlaubt(stufe,gespielt));
 const zurFrage=()=>requestAnimationFrame(()=>document.getElementById('challenge-question')?.focus());
 function neueRunde(neu:Stufe){onRead('');schliessen();setVorige(session.ids);setSession(runde(neu,session.ids));}
 function wechsel(neu:Stufe){onStufe(neu);if(neu!==gespielt)neueRunde(neu);}
 const hinweis=stufe!==gespielt?rundeNochSatz(gespielt,stufe):session.stufe==='experte'?EXPERTEN_HINWEIS:null;
 const stufenZeile=<StufenWahl stufe={stufe} spielt={gespielt} onStufe={wechsel} hinweis={hinweis} ohneZurueck={session.done}/>;
 const q=challengeQuestionForOrder(session.ids[session.index],session.orders[session.ids[session.index]])!,right=session.answer===q.answers[q.correct];
 const authoredWrongReason=q.retainedAnswerOrder?q.retainedWrongReasons?.[q.answers.indexOf(session.answer??'')]:(HINTS as Record<string,{wrongReasons?:(string|null)[]}>)[q.id]?.wrongReasons?.[q.answers.indexOf(session.answer??'')];
 if(session.done)return <section ref={raum} className="knowledge-challenge">{stufenZeile}<div className="world-game-finish"><Check size={44}/><h2 ref={abschluss} tabIndex={-1}>Sechs Aufgaben gelöst!</h2><p>Dein Spielstempel ist im Entdeckerpass. Mach gern eine Pause oder entdecke eine passende Karte.</p><button className="secondary-button" onClick={()=>onTopic(q.topic)}>Passendes Wissen entdecken</button><button className="primary-button" onClick={()=>{neueRunde(stufe);zurFrage();}}>Noch eine Runde</button></div></section>;
 return <section ref={raum} className="knowledge-challenge">{stufenZeile}<p className="eyebrow">AUFGABE {session.index+1} VON {session.ids.length}</p><progress aria-label="Gelöste Aufgaben" value={session.index+(right?1:0)} max={session.ids.length}/><p className="small-note">Thema: {q.topicTitle}</p><h2 tabIndex={-1} id="challenge-question">{q.prompt}</h2><button className="speech-button" onClick={()=>onRead(q.topicTitle+'. '+q.prompt+'. '+session.orders[q.id].join('. '))}><Volume2 size={17}/> Frage vorlesen</button>{!right&&<QuestionHints key={q.id} hints={q.hints} onRead={onRead}/>}<div className="quiz-answers">{session.orders[q.id].map((a,i)=><button className={'quiz-answer '+(session.answer===a?(right?'is-correct':'is-incorrect'):'')} disabled={right} key={a} onClick={()=>{setSession({...session,answer:a});if(session.answer===null){onReview('challenge:'+q.id,a===q.answers[q.correct]);merke(q.id,a===q.answers[q.correct],stufeDerFrage(q));}}}><span className="answer-letter">{String.fromCharCode(65+i)}</span><span>{a}</span></button>)}</div>{session.answer&&<div className="lab-feedback" role="status"><strong>{right?WOERTER.richtig:WOERTER.nochNicht}</strong><p>{right?q.why:authoredWrongReason??'Vergleiche die Antworten in Ruhe. Ein Tipp hilft dir.'}</p>{vorschlag&&<StufenVorschlagHinweis vorschlag={vorschlag} onJa={()=>stufeWechseln(()=>{schliessen();wechsel(vorschlag.ziel);},raum.current)} onNein={()=>{flushSync(schliessen);(weiter.current??document.getElementById('challenge-question'))?.focus();}}/>}{right&&<button ref={weiter} className="primary-button" onClick={()=>{onRead('');schliessen();if(session.index===session.ids.length-1){setSession({...session,done:true});if(session.stufe)setGeschafft(mitGeschafft(geschafft,session.stufe));onWin();requestAnimationFrame(()=>abschluss.current?.focus());}else{setSession({...session,index:session.index+1,answer:null});zurFrage();}}}>{session.index===session.ids.length-1?'Spielstempel sammeln':'Nächste Aufgabe'}</button>}</div>}</section>;
}
