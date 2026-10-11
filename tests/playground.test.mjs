import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {PLAYGROUND_GAMES,filterGames,gameStatus,gameSaveId} from '../app/playground-catalog.ts';
import {CLASSIC_QUESTIONS,CLASSIC_LEVELS,createReasonRound,restoreReasonRound,answerReasonRound,emptyReasonRound} from '../app/classic-learning.ts';
import {emptyProgress,createSave,restoreSave} from '../app/progress-storage.ts';
import {LAYERS} from '../app/earth-data.ts';
const find=(key)=>PLAYGROUND_GAMES.find(g=>g.key===key);
test('all 31 existing game identities retain a theme, mechanic and honest level support',()=>{
 assert.equal(PLAYGROUND_GAMES.length,31);assert.equal(new Set(PLAYGROUND_GAMES.map(g=>g.key)).size,31);
 for(const g of PLAYGROUND_GAMES){assert.ok(g.theme&&g.mechanic&&g.goal&&g.age>=6);assert.equal(gameSaveId(g),g.family==='world'?'world:'+g.id:g.id);}
 assert.equal(find('classic:memory').levels,false);assert.equal(find('extra:continent-sort').levels,false);
 assert.equal(filterGames('Tiere & Lebensräume','Paare merken').length,0);assert.ok(filterGames('Tiere & Lebensräume','Sortieren & zuordnen').length>1);
 const p=emptyProgress();p.gameSessions.habitats={items:[{name:'Eisbär'}],index:0};p.games=['world:habitats'];
 assert.equal(gameStatus(find('classic:habitats'),p).resume,true);assert.equal(gameStatus(find('world:habitats'),p).resume,false);assert.equal(gameStatus(find('world:habitats'),p).stamped,true);
 p.gameSessions['world:habitats']={roundDone:true};assert.equal(gameStatus(find('world:habitats'),p).finished,true);assert.equal(gameStatus(find('classic:habitats'),p).finished,false);
});
test('a past order stamp does not mark a wrong current build finished, and quiz/hunt use existing state',()=>{
 const p=emptyProgress();p.games=['order-layers'];p.gameSessions.order={topic:'layers',pool:LAYERS,chosen:[...LAYERS].reverse().map(l=>l.id),checked:true};
 assert.equal(gameStatus(find('classic:order'),p).finished,false);assert.equal(gameStatus(find('classic:order'),p).resume,true);
 p.gameSessions['ocean-find']={index:4,found:true};assert.equal(gameStatus(find('extra:ocean-find'),p).finished,true);p.gameSessions['ocean-find']={index:3,found:true};assert.equal(gameStatus(find('extra:ocean-find'),p).resume,true);p.gameSessions.habitats={learningRound:emptyReasonRound()};assert.equal(gameStatus(find('classic:habitats'),p).resume,false);
 p.gameSessions.order.chosen=LAYERS.map(l=>l.id);assert.equal(gameStatus(find('classic:order'),p).finished,true);
 p.quizSession={finished:false,index:2,ids:['a','b','c']};assert.equal(gameStatus(find('classic:quiz'),p).resume,true);
 p.missions=[0,1];assert.equal(gameStatus(find('classic:hunt'),p).resume,true);
});
test('24 differentiated tasks have valid knowledge links, answer-specific explanations and non-answer hints',()=>{
 const topics=JSON.parse(fs.readFileSync(new URL('../app/world-index.json',import.meta.url))),ids=new Set();
 for(const game of ['habitats','detective'])for(const l of CLASSIC_LEVELS){const bank=CLASSIC_QUESTIONS.filter(q=>q.game===game&&q.level===l.id);assert.equal(bank.length,4);for(const q of bank){assert.ok(!ids.has(q.id));ids.add(q.id);assert.ok(topics.some(t=>t.id===q.topic));assert.equal(new Set(q.answers).size,q.answers.length);assert.ok(q.answers.includes(q.correct));assert.ok(q.why.length>40);for(const a of q.answers.filter(a=>a!==q.correct))assert.ok(q.wrongReasons[a]?.length>30);for(const h of q.hints)assert.ok(!h.toLocaleLowerCase('de').includes(q.correct.toLocaleLowerCase('de')),q.id+' must not state its complete answer');}}
 const easy=CLASSIC_QUESTIONS.filter(q=>q.game==='detective'&&q.level==='easy'),hard=CLASSIC_QUESTIONS.filter(q=>q.game==='detective'&&q.level==='hard');assert.ok(easy.every(q=>q.answers.length===2));assert.ok(hard.every(q=>q.answers.length===3));assert.ok(hard.some(q=>q.prompt.includes('Schluss')));
});
test('wrong/right/retry is recorded without double score, stored random order survives import and completed round resumes',()=>{
 let r=createReasonRound('habitats','hard');const ids=[...r.ids],orders=structuredClone(r.orders),q=CLASSIC_QUESTIONS.find(q=>q.id===r.ids[0]);
 r=answerReasonRound(r,q.answers.find(a=>a!==q.correct));r=answerReasonRound(r,q.correct);assert.deepEqual(r.missed,[q.id]);assert.equal(r.firstCorrect,0);assert.equal(answerReasonRound(r,q.correct),r);
 assert.deepEqual(restoreReasonRound('habitats',structuredClone(r)),r);assert.deepEqual(r.ids,ids);assert.deepEqual(r.orders,orders);
 for(let i=1;i<r.ids.length;i++){r={...r,index:i,answer:null};r=answerReasonRound(r,CLASSIC_QUESTIONS.find(q=>q.id===r.ids[i]).correct);}r={...r,done:true};assert.equal(r.firstCorrect,3);assert.equal(restoreReasonRound('habitats',r).done,true);
 const repeat=createReasonRound('habitats','hard',r.missed);assert.deepEqual(repeat.ids,[q.id]);assert.equal(repeat.repeat,true);assert.equal(repeat.level,'hard');
});
test('malformed or cross-game sessions cannot switch the chosen level or leak answers',()=>{
 const r=createReasonRound('detective','medium');assert.deepEqual(restoreReasonRound('habitats',r),emptyReasonRound());assert.deepEqual(restoreReasonRound('detective',{...r,ids:[...r.ids,r.ids[0]]}),emptyReasonRound());
 const q=CLASSIC_QUESTIONS.find(q=>q.id===r.ids[0]),fixed=restoreReasonRound('detective',{...r,orders:{[q.id]:Array(3).fill(q.correct)},index:-20,answer:'made up',done:true,firstCorrect:NaN});
 assert.deepEqual(fixed.orders[q.id],q.answers);assert.equal(fixed.answer,null);assert.equal(fixed.done,false);assert.equal(fixed.firstCorrect,0);
});
test('schema-3 backup retains legacy shuffled tuples, collisions, notes, stamps and new round fields together',()=>{
 const p=emptyProgress();p.settings.readVoice='';p.games=['order-water','world:habitats'];p.favorites=['topic:animal-polar-bear'];p.notes=[{id:'synthetic',text:'Prüfnotiz',at:'2026-10-11T13:00:00.000Z'}];
 const legacy={items:[['Korallen sind Tiere.',true,'Korallen sind Tiere.']],index:0,answer:false,score:0,finished:false};
 p.gameSessions={detective:legacy,habitats:{items:[{name:'Eisbär',correct:'Arktis',prompt:'Meereis',why:'Im Norden'}],index:0,answer:null,finished:false},'world:habitats':{items:['animal-polar-bear'],roundAnswer:'Savanne',roundDone:false},'world:animal-detective':{roundAnswer:null},'animal-detective':{items:[]},order:{chosen:['sun'],pool:[{id:'sun',name:'Wasser verdunstet',text:'Flüssig wird gasförmig'}]},'test-new':{learningRound:createReasonRound('detective','hard')}};
 const restored=restoreSave(JSON.parse(JSON.stringify(createSave(p))),true).progress;assert.deepEqual(restored,p);assert.deepEqual(restored.gameSessions.detective,legacy);
});
