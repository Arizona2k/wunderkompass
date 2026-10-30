import fs from 'node:fs/promises';import assert from 'node:assert/strict';
import {createSave,SAVE_KEY} from '../../app/progress-storage.ts';
import {RESEARCH_QUESTIONS} from '../../app/research-catalog.ts';
import legacy from '../../app/research-task-compatibility.json' with {type:'json'};
import feedback from '../../app/research-feedback.json' with {type:'json'};

export async function researchTransferFlow(browser,base,ready,monitor,report,shots){
 report.researchTransfer??=[];
 for(const width of[320,1440])for(const mode of['old-wrong','old-correct']){
  const pass=createSave();pass.progress.settings.readVoice='';pass.progress.settings.largeText=width===320;pass.progress.labs=['moon'];pass.progress.games=['memory'];pass.progress.favorites=['topic:science-tides'];pass.progress.notes=[{id:'synthetic-transfer-note',text:'Vorhandene synthetische Notiz.',at:'2026-10-18T00:00:00.000Z'}];pass.progress.gameSessions.memory={matched:[0],open:[]};pass.progress.gameSessions['journey:water']={'chapter:2:note':'Unberührte Wassernotiz.'};
  for(const[id,old]of Object.entries(legacy.entries))pass.progress.gameSessions['lab:'+id]={researchLevel:'hard','researchAnswer-hard':mode==='old-correct'?old.correct:(old.correct+1)%3,researchJournal:'Vorhandene eigene Erklärung.',researchMission:7,researchCompareA:'Alte Beobachtung A',researchCompareB:'Alte Beobachtung B',future:{keep:true}};
  const file=shots+'/synthetic-transfer-'+mode+'-'+width+'.json';await fs.writeFile(file,JSON.stringify(pass,null,2)+'\n');
  const c=await browser.newContext({viewport:{width,height:950},hasTouch:width===320,reducedMotion:'reduce',acceptDownloads:true}),p=await c.newPage();monitor(p);p.setDefaultTimeout(26000);const state=()=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)).progress,SAVE_KEY);
  const keep=async()=>{const saved=await state();for(const key of['notes','favorites','games'])assert.deepEqual(saved[key],pass.progress[key]);for(const id of['memory','journey:water'])assert.deepEqual(saved.gameSessions[id],pass.progress.gameSessions[id]);for(const id of Object.keys(legacy.entries)){const old=pass.progress.gameSessions['lab:'+id],now=saved.gameSessions['lab:'+id];for(const key of['researchJournal','researchMission','researchCompareA','researchCompareB','future'])assert.deepEqual(now[key],old[key]);}};
  try{
   await p.goto(base);await ready(p);await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await p.locator('input[type=file]').setInputFiles(file);await p.getByRole('button',{name:'Pass wiederherstellen',exact:true}).click();await p.locator('.passport-dialog').waitFor({state:'hidden'});const earned=new Set(pass.progress.labs),positions=[];
   for(const[id,old]of Object.entries(legacy.entries)){
    const q=RESEARCH_QUESTIONS[id].hard,chosen=pass.progress.gameSessions['lab:'+id]['researchAnswer-hard'];await p.evaluate(id=>location.hash='labs/'+id,id);await p.locator('#lab-heading').waitFor();const question=p.locator('.research-question');await question.getByRole('heading',{name:q.prompt,exact:true}).waitFor();await question.getByText('Deine frühere Auswahl „'+old.answers[chosen]+'“ bleibt gespeichert.',{exact:false}).waitFor();assert.equal((await state()).gameSessions['lab:'+id]['researchAnswer-hard'],chosen);assert.deepEqual([...(await state()).labs].sort(),[...earned].sort(),'opening old correct or incorrect selection creates no new stamp');await keep();
    const order=await question.locator('.quiz-answer').evaluateAll(es=>es.map(e=>Number(e.dataset.answerIndex)));assert.deepEqual([...order].sort(),[0,1,2]);positions.push(order.indexOf(q.correct));await question.getByText(mode==='old-correct'?old.why:old.feedback[chosen],{exact:true}).waitFor();
    if(mode==='old-wrong'){
     assert.equal(await question.locator('.quiz-answer.is-incorrect').count(),0,'the old selected text is explained rather than attributed to a rewritten wrong choice');
     if(id==='depth'){
      await p.reload();await ready(p);await question.getByRole('heading',{name:q.prompt,exact:true}).waitFor();assert.equal((await state()).gameSessions['lab:'+id]['researchAnswer-hard'],chosen);
      await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();const downloading=p.waitForEvent('download');await p.getByRole('button',{name:'Entdeckerpass sichern',exact:true}).click();const download=shots+'/actual-transfer-download-'+width+'.json';await(await downloading).saveAs(download);const actual=JSON.parse(await fs.readFile(download,'utf8'));for(const lab of Object.keys(legacy.entries))assert.equal(actual.progress.gameSessions['lab:'+lab]['researchAnswer-hard'],pass.progress.gameSessions['lab:'+lab]['researchAnswer-hard']);assert.deepEqual(actual.progress.labs,pass.progress.labs);await p.keyboard.press('Escape');report.checks.push('Actual lab pass download at'+width+': all11 original selected indices and earned stamps retained');
     }
     await question.getByRole('button',{name:q.answers[chosen],exact:true}).click();await question.getByText(feedback[id].hard[chosen],{exact:true}).waitFor();assert.equal((await state()).gameSessions['lab:'+id].researchHardTaskRevision,1);assert.deepEqual([...(await state()).labs].sort(),[...earned].sort());await question.getByRole('button',{name:q.answers[q.correct],exact:true}).click();earned.add(id);await question.getByText(q.why,{exact:true}).waitFor();assert.equal((await state()).gameSessions['lab:'+id]['researchAnswer-hard'],q.correct);assert.deepEqual([...(await state()).labs].sort(),[...earned].sort());
    }else{assert.equal(await question.locator('.quiz-answer.is-correct').getAttribute('data-answer-index'),String(old.correct));assert.equal(await question.locator('.quiz-answer:disabled').count(),3);}
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);await keep();if(width===320&&mode==='old-wrong'&&['seasons','moon'].includes(id))await question.screenshot({path:shots+'/transfer-'+id+'-320.png'});report.researchTransfer.push({width,large:width===320,mode,id,oldSelectedCanonicalIndexRetained:true,originalPriorTextExplained:true,noAutomaticStamp:true,newWrongAndCorrect:mode==='old-wrong',oldNotesJournalsComparisonsAndFutureFieldsRetained:true});
   }
   assert.equal(new Set(positions).size,3);assert(positions.filter(i=>i===1).length<8);
  }catch(error){await p.screenshot({path:shots+'/transfer-failure-'+mode+'-'+width+'.png',fullPage:true}).catch(()=>{});throw error;}finally{await c.close();}
 }
 assert.equal(report.researchTransfer.length,44);report.checks.push('Eleven concrete transfer tasks at320large/1440:44 actual old-wrong/old-correct cases, stable canonical answers and varied display positions, real downloads/reload, no automatic stamps and old pass fields retained');
}
