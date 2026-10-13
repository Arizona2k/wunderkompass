import fs from 'node:fs';
import {createHash} from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';
import data from '../app/journey-inquiries.json' with {type:'json'};
import {JOURNEYS} from '../app/learning-data.ts';
import {validateJourneyInquiries} from '../app/journey-inquiry-validation.mjs';
import {journeyRoute,chapterPath} from '../app/journey-routing.mjs';
import {CHAPTER_LINKS,chapterDestination,chapterLinksForTopic} from '../app/journey-links.ts';
import {restoreSave,createSave} from '../app/progress-storage.ts';
import {mergeSaves} from '../app/progress-sync.ts';
test('all legacy chapter identities have distinct complete inquiry levels and valid knowledge destinations',()=>{
 const chapters=validateJourneyInquiries(data,JOURNEYS);assert.equal(JOURNEYS.length,16);assert.equal(chapters.length,80);
 for(const j of JOURNEYS){assert.equal(j.steps.length,5);assert.equal(CHAPTER_LINKS[j.id].length,5);for(let index=0;index<5;index++){
  const c=chapters.find(c=>c.id===j.id+':'+index);assert.ok(c);assert.equal(new Set(c.tasks.map(q=>q.prompt)).size,3);
  assert.ok(chapterDestination(CHAPTER_LINKS[j.id][index]).why);
  assert.equal(journeyRoute(chapterPath(j.id,index),JOURNEYS,{[j.id]:4}).step,index);
 }}
 assert.ok(chapterLinksForTopic('science-water-cycle').some(c=>c.id==='water'));
});
test('incomplete, duplicated, injected or damaged inquiry data fail closed',()=>{
 for(const mutate of [d=>d.chapters.pop(),d=>d.chapters[1]=d.chapters[0],d=>d.chapters[0].journeyId='missing',d=>d.chapters[0].goal='<img src=x>',d=>d.chapters[0].tasks[0].correct=3,d=>d.chapters[0].tasks[1].answers=['a','a','b'],d=>d.chapters[0].tasks[2].wrong=[],d=>d.chapters[0].sequence=['one','one','two']]){const broken=structuredClone(data);mutate(broken);assert.throws(()=>validateJourneyInquiries(broken,JOURNEYS));}
});
test('old resumes, explicit chapter links and final chapter are compatible; malformed URLs cannot overwrite the resume index',()=>{
 assert.equal(journeyRoute('journeys/water',JOURNEYS,{water:3}).step,3);
 assert.equal(journeyRoute('journeys/water/6',JOURNEYS,{water:2}).step,5);
 for(const page of ['0','-1','1.5','01','7','1/extra','nonsense']){const r=journeyRoute('journeys/water/'+page,JOURNEYS,{water:2});assert.equal(r.step,2);assert.equal(r.invalid,true);}
 assert.equal(journeyRoute('journeys/unknown/1',JOURNEYS).journey,null);
});
test('240 old sessions plus all 16 journey notebooks survive schema-3 backup restoration and independent tab edits',()=>{
 const old=Object.fromEntries(Array.from({length:240},(_,i)=>['old-'+i,{index:i}])),notes=Object.fromEntries(JOURNEYS.map(j=>['journey:'+j.id,{'chapter:0:note':'Private synthetic test text','chapter:0:answer:2':1}]));
 const b=createSave();b.progress.gameSessions={...old,...notes};b.progress.chapters.water=3;b.progress.journeys=['water'];const restored=restoreSave(JSON.parse(JSON.stringify(b)),true);
 assert.deepEqual(restored.progress.gameSessions,b.progress.gameSessions);assert.equal(restored.progress.chapters.water,3);assert.deepEqual(restored.progress.journeys,['water']);
 const a=structuredClone(restored),c=structuredClone(restored);a.progress.gameSessions['journey:water']['chapter:0:note']='Changed in first tab';c.progress.gameSessions['journey:water']['chapter:1:answer:1']=2;
 const merged=mergeSaves(restored,a,c);assert.equal(merged.progress.gameSessions['journey:water']['chapter:0:note'],'Changed in first tab');assert.equal(merged.progress.gameSessions['journey:water']['chapter:1:answer:1'],2);
});

test('reciprocal links retain every relevant chapter and never repeat a path',()=>{
 const water=chapterLinksForTopic('science-water-cycle');assert.deepEqual(water.filter(c=>c.id==='water').map(c=>c.index),[1,2,3,4]);assert.deepEqual(water.filter(c=>c.id==='landscapes').map(c=>c.index),[1,4]);
 assert.equal(new Set(water.map(c=>c.path)).size,water.length);assert.deepEqual(chapterLinksForTopic('unknown-topic'),[]);
 for(const [id,links] of Object.entries(CHAPTER_LINKS))for(let index=0;index<links.length;index++)if(links[index].startsWith('world/topic/'))assert.ok(chapterLinksForTopic(links[index].slice(12)).some(c=>c.id===id&&c.index===index&&c.path===chapterPath(id,index)));
});

test('all240 stored correct choices keep their identities and meaning after selective editorial revision',()=>{
 const retained=JSON.parse(fs.readFileSync('tests/fixtures/journey-task-identities.json','utf8')).tasks;assert.equal(retained.length,240);
 for(const old of retained){const split=old.id.lastIndexOf(':'),id=old.id.slice(0,split),level=Number(old.id.slice(split+1));const q=data.chapters.find(c=>c.id===id)?.tasks[level];assert.ok(q);assert.equal(q.correct,old.correct,old.id);assert.equal(q.answers[q.correct],old.correctAnswer,old.id);}
 const reviews=JSON.parse(fs.readFileSync('content/journey-task-review.json','utf8'));assert.equal(reviews.independentReview,false);
 for(const review of reviews.tasks){const split=review.id.lastIndexOf(':'),id=review.id.slice(0,split),level=Number(review.id.slice(split+1)),q=data.chapters.find(c=>c.id===id).tasks[level];assert.deepEqual(q,review.after);assert.equal(createHash('sha256').update(JSON.stringify(q)).digest('hex'),review.afterHash);assert.equal(q.correct,review.before.correct);for(let i=0;i<3;i++)if(i!==q.correct){assert.notEqual(q.answers[i],q.answers[q.correct]);assert.notEqual(q.wrong[i],q.why);}}
});
