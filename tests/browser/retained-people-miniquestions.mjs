import {AXE_FILE} from './axe-loader.mjs';
import assert from 'node:assert/strict';
import {antwortKnopf,falscheAntworten,hauptfrage,rateMal,richtigeAntwort,zeigtFrage,zusatzfragen} from './karte-hilfen.mjs';
const saveKey='erde-entdecken:save:v3';
// Die Hauptfrage einer Personenkarte (eigener Hinweis, drei eigene „warum nicht“-Sätze) mit der Tastatur durchspielen.
export async function retainedPeopleMiniQuestion(page,topic){
 const id=topic.id,haupt=hauptfrage(topic),richtig=richtigeAntwort(haupt),why=haupt.question.why,[hinweis]=haupt.hints;assert(haupt.wrongReasons?.length===3);
 const saved=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,saveKey);
 const mini=rateMal(page);await zeigtFrage(page,topic,haupt);
 const answerButton=word=>antwortKnopf(page,word);
 const original=await saved(),current=original.gameSessions['topic:'+id]?.[haupt.answerKey];
 if(current!==null&&current!==undefined){if(!await mini.getByRole('button',{name:'Noch einmal raten',exact:true}).count())await answerButton(richtig).click();await mini.getByRole('button',{name:'Noch einmal raten',exact:true}).click();}
 const hint=mini.locator('.world-game-hint');assert.equal(await hint.evaluate(el=>el.open),false);await hint.locator(':scope>summary').click();await hint.getByText(hinweis,{exact:true}).waitFor();assert(!hinweis.includes(richtig),'individual hint does not recite the whole correct answer');
 const reviewKey=haupt.reviewId,priorSeen=(await saved()).review[reviewKey]?.seen??0,wrong=[];
 for(const word of falscheAntworten(haupt)){
  const index=haupt.question.answers.indexOf(word),reason=haupt.wrongReasons[index];
  const button=answerButton(word);assert.equal(await button.count(),1);await button.focus();await page.keyboard.press('Enter');await mini.getByText('Noch nicht ganz. Versuch es noch einmal!',{exact:true}).waitFor();await mini.getByText(reason,{exact:true}).waitFor();
  await page.waitForFunction(({id,word,key,seen,saveKey})=>{const p=JSON.parse(localStorage.getItem(saveKey)).progress;return p.gameSessions['topic:'+id]?.topicAnswer===word&&p.review[key]?.seen===seen;},{id,word,key:reviewKey,seen:priorSeen+1,saveKey});
  wrong.push({index,word,exactIndividualFeedback:reason,seen:(await saved()).review[reviewKey].seen});
 }
 const correct=answerButton(richtig);await correct.focus();await page.keyboard.press('Enter');await mini.getByText('Richtig!',{exact:true}).waitFor();await mini.getByText(why,{exact:true}).waitFor();
 await page.waitForFunction(({id,word,saveKey})=>JSON.parse(localStorage.getItem(saveKey)).progress.gameSessions['topic:'+id]?.topicAnswer===word,{id,word:richtig,saveKey});
 assert.equal(await mini.locator('.quiz-answer:not([disabled])').count(),0);assert.equal((await saved()).review[reviewKey].seen,priorSeen+1);
 const geometry=await mini.evaluate(root=>({width:document.documentElement.clientWidth,pageWidth:document.documentElement.scrollWidth,buttons:[...root.querySelectorAll('.quiz-answer')].map(b=>{const r=b.getBoundingClientRect();return{left:r.left,right:r.right,width:r.width,height:r.height};})}));
 assert(geometry.pageWidth<=geometry.width+2);assert(geometry.buttons.every(b=>b.left>=-1&&b.right<=geometry.width+1&&b.width>=43.9&&b.height>=43.9));
 const axeWasAvailable=await page.evaluate(()=>typeof window.axe?.run==='function');
 // Karten mit Zusatzfragen (Pilot, Aufgabe 11) zeigen nach dem Neuladen die nächste offene Frage (ersteFrage), ohne Lösung.
 // Die gespeicherte Antwort prüft der Pass hier unten. Die Hauptfrage mit Lösung nach dem Neuladen prüfen weiter alle
 // Personenkarten ohne Zusatzfragen und wissenskarte.mjs.
 const beforeReload=await saved(),zusatz=zusatzfragen(topic),next=zusatz.find(z=>beforeReload.review[z.reviewId]===undefined);
 assert(!zusatz.length||next,id+': after the main question one additional question is still open');
 await page.reload();
 if(next){await zeigtFrage(page,topic,next);assert.equal(await mini.getByText(why,{exact:true}).count(),0,id+': no solution of the main question after reload');}
 else{await zeigtFrage(page,topic,haupt);await mini.getByText(why,{exact:true}).waitFor();}
 if(axeWasAvailable)await page.addScriptTag({path:AXE_FILE});
 const after=await saved();assert.equal(after.review[reviewKey].seen,priorSeen+1);assert.equal(after.gameSessions['topic:'+id][haupt.answerKey],richtig);
 for(const field of ['notes','favorites','favoritePlaces','settings','games','missions','labs','experiments','quizSession','quizResults','journeys','chapters','completedChapters'])assert.deepEqual(after[field],original[field],field+' whole preserved during intentional mini-question');
 for(const[key,session]of Object.entries(original.gameSessions))for(const[field,value]of Object.entries(session))if(!(key==='topic:'+id&&field==='topicAnswer'))assert.deepEqual(after.gameSessions[key]?.[field],value,'unrelated saved session leaf '+key+'/'+field);
 for(const[key,value]of Object.entries(original.review))if(key!==reviewKey)assert.deepEqual(after.review[key],value,'unrelated review '+key);
 for(const value of original.discoveries)assert(after.discoveries.includes(value));for(const value of after.discoveries)assert(original.discoveries.includes(value)||value==='learned:'+id,'only actual completed mini-question may earn its stamp');
 return{id,ownHintActuallyOpened:true,wrong,correctWord:richtig,actualReloadWordAndOneAttemptCountPreserved:true,priorSeen,afterSeen:after.review[reviewKey].seen,allUnrelatedProgressAndOriginalLeavesPreserved:true,geometry};
}
