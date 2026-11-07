import assert from 'node:assert/strict';
const saveKey='erde-entdecken:save:v3';
export async function retainedPeopleMiniQuestion(page,topic){
 const {id,question:q,questionFeedback:f}=topic;assert(q&&f&&f.wrongReasons.length===3);
 const saved=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)).progress,saveKey);
 const mini=page.locator('.world-mini-question');await mini.getByRole('heading',{name:q.prompt,exact:true}).waitFor();
 const answerButton=word=>mini.locator('.quiz-answer').filter({has:page.getByText(word,{exact:true})});
 const original=await saved(),current=original.gameSessions['topic:'+id]?.topicAnswer;
 if(current!==null&&current!==undefined){if(!await mini.getByRole('button',{name:'Später noch einmal prüfen',exact:true}).count())await answerButton(q.answers[q.correct]).click();await mini.getByRole('button',{name:'Später noch einmal prüfen',exact:true}).click();}
 const hint=mini.locator('.world-game-hint');assert.equal(await hint.evaluate(el=>el.open),false);await hint.locator(':scope>summary').click();await hint.getByText(f.hint,{exact:true}).waitFor();assert(!f.hint.includes(q.answers[q.correct]),'individual hint does not recite the whole correct answer');
 const reviewKey='world-question:'+id,priorSeen=(await saved()).review[reviewKey]?.seen??0,wrong=[];
 for(const[index,word]of q.answers.entries())if(index!==q.correct){
  const button=answerButton(word);assert.equal(await button.count(),1);await button.focus();await page.keyboard.press('Enter');await mini.getByText('Überlege noch einmal.',{exact:true}).waitFor();await mini.getByText(f.wrongReasons[index],{exact:true}).waitFor();
  await page.waitForFunction(({id,word,key,seen,saveKey})=>{const p=JSON.parse(localStorage.getItem(saveKey)).progress;return p.gameSessions['topic:'+id]?.topicAnswer===word&&p.review[key]?.seen===seen;},{id,word,key:reviewKey,seen:priorSeen+1,saveKey});
  wrong.push({index,word,exactIndividualFeedback:f.wrongReasons[index],seen:(await saved()).review[reviewKey].seen});
 }
 const correct=answerButton(q.answers[q.correct]);await correct.focus();await page.keyboard.press('Enter');await mini.getByText('Passende Antwort gewählt.',{exact:true}).waitFor();await mini.getByText(q.why,{exact:true}).waitFor();
 await page.waitForFunction(({id,word,saveKey})=>JSON.parse(localStorage.getItem(saveKey)).progress.gameSessions['topic:'+id]?.topicAnswer===word,{id,word:q.answers[q.correct],saveKey});
 assert.equal(await mini.locator('.quiz-answer:not([disabled])').count(),0);assert.equal((await saved()).review[reviewKey].seen,priorSeen+1);
 const geometry=await mini.evaluate(root=>({width:innerWidth,pageWidth:document.documentElement.scrollWidth,buttons:[...root.querySelectorAll('.quiz-answer')].map(b=>{const r=b.getBoundingClientRect();return{left:r.left,right:r.right,width:r.width,height:r.height};})}));
 assert(geometry.pageWidth<=geometry.width+2);assert(geometry.buttons.every(b=>b.left>=-1&&b.right<=geometry.width+1&&b.width>=43.9&&b.height>=43.9));
 const axeWasAvailable=await page.evaluate(()=>typeof window.axe?.run==='function');
 await page.reload();await mini.getByRole('heading',{name:q.prompt,exact:true}).waitFor();await mini.getByText(q.why,{exact:true}).waitFor();
 if(axeWasAvailable)await page.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});
 const after=await saved();assert.equal(after.review[reviewKey].seen,priorSeen+1);assert.equal(after.gameSessions['topic:'+id].topicAnswer,q.answers[q.correct]);
 for(const field of ['notes','favorites','favoritePlaces','settings','games','missions','labs','experiments','quizSession','quizResults','journeys','chapters','completedChapters'])assert.deepEqual(after[field],original[field],field+' whole preserved during intentional mini-question');
 for(const[key,session]of Object.entries(original.gameSessions))for(const[field,value]of Object.entries(session))if(!(key==='topic:'+id&&field==='topicAnswer'))assert.deepEqual(after.gameSessions[key]?.[field],value,'unrelated saved session leaf '+key+'/'+field);
 for(const[key,value]of Object.entries(original.review))if(key!==reviewKey)assert.deepEqual(after.review[key],value,'unrelated review '+key);
 for(const value of original.discoveries)assert(after.discoveries.includes(value));for(const value of after.discoveries)assert(original.discoveries.includes(value)||value==='learned:'+id,'only actual completed mini-question may earn its stamp');
 return{id,ownHintActuallyOpened:true,wrong,correctWord:q.answers[q.correct],actualReloadWordAndOneAttemptCountPreserved:true,priorSeen,afterSeen:after.review[reviewKey].seen,allUnrelatedProgressAndOriginalLeavesPreserved:true,geometry};
}
