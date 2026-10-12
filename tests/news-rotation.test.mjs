import test from 'node:test';import assert from 'node:assert/strict';
import {selectTopics,NEWS_DOMAINS} from '../scripts/news/topic-selection.mjs';
const now=new Date('2026-10-12T12:00:00Z');
const item=(domain,id,{subjectKey=id,eventKey=id,claim=id,...extra}={})=>({entry:{id,sourcePublishedOn:'2026-10-12',claims:[{key:'fact',value:claim}],editorial:{status:'approved'}},domain,subjectKey,eventKey,family:domain+'-facts',verified:true,rightsConfirmed:true,risk:'routine',...extra});
test('an edition prefers two to three genuine different domains and never fills gaps with unsafe, old or unlicensed stories',()=>{
 const candidates=[item('weltall','planet-a'),item('weltall','planet-b'),item('geografie','earth'),item('natur-tiere','bee')];
 const chosen=selectTopics(candidates,{now});assert.equal(chosen.selected.length,3);assert.equal(new Set(chosen.selected.map(c=>c.domain)).size,3);
 for(const unsafe of [item('gesellschaft','war',{risk:'war',priority:100,priorityEvidence:true}),item('sport','unlicensed',{rightsConfirmed:false}),item('umwelt','unverified',{verified:false}),{...item('geschichte','old'),entry:{id:'old',sourcePublishedOn:'2025-01-01',claims:[{key:'fact',value:'old'}]}}]){const result=selectTopics([unsafe],{now});assert.equal(result.selected.length,0);assert.ok(result.held.length);}
 assert.equal(selectTopics([],{now}).selected.length,0);assert.equal(NEWS_DOMAINS.length,11);
});
test('14-day history rotates domains; repeated subjects and equivalent event content stay out even with a new date or title',()=>{
 const history=[{day:'2026-10-06',items:[{id:'a',domain:'weltall',subjectKey:'planet-a',eventKey:'event-a',family:'weltall-facts'}]},{day:'2026-10-07',items:[{id:'b',domain:'weltall',subjectKey:'b',eventKey:'event-b',family:'weltall-facts'}]},{day:'2026-10-08',items:[{id:'c',domain:'weltall',subjectKey:'c',eventKey:'event-c',family:'weltall-facts'}]}];
 const result=selectTopics([item('weltall','another-planet'),item('natur-tiere','bee'),item('kultur','music'),item('technologie','new-invention')],{history,now});assert.deepEqual(new Set(result.selected.map(c=>c.domain)),new Set(['natur-tiere','kultur','technologie']));assert.ok(result.held.some(h=>h.id==='another-planet'&&h.reason==='Ausgabeziel erreicht'));assert.equal(selectTopics([item('weltall','another-planet')],{history,now}).selected.length,1);
 const duplicate=selectTopics([item('natur-tiere','bee-a',{claim:'same event'}),item('natur-tiere','bee-b',{claim:'same event'}),item('geografie','earth')],{now});assert.equal(duplicate.selected.length,2);assert.ok(duplicate.held.some(h=>h.reason.includes('Doppelmeldung')));
 const first=selectTopics([item('geografie','earth-day-one',{subjectKey:'same-earth-camera',recurring:true,claim:'two images'})],{now});
 const repeat=selectTopics([item('geografie','earth-day-two',{subjectKey:'same-earth-camera',recurring:true,claim:'three images'})],{now:new Date('2026-10-13T12:00:00Z'),history:first.history});assert.equal(repeat.selected.length,0);assert.ok(repeat.held[0].reason.includes('kürzlich'));
 const sameMeaning=selectTopics([item('geografie','renamed-event',{claim:'two images'})],{now,previous:[{generation:{meaningKey:first.selected[0].meaningKey}}]});assert.equal(sameMeaning.selected.length,0);
});
test('independent verified events stay eligible through fourteen scarce-source days; diversity and proven priority are preferences',()=>{
 let history=[];let routineCount=0;for(let d=1;d<=14;d++){
  const day='2026-10-'+String(d).padStart(2,'0'),current=new Date(day+'T12:00:00Z'),c=item('weltall','daily-'+d);c.entry.sourcePublishedOn=day;
  const result=selectTopics([c],{history,now:current});routineCount+=result.selected.length;history=result.history;
 }
 assert.equal(routineCount,14,'fresh independent evidence is not blocked by a scarce-domain weekly quota');assert.equal(history.length,14);
 const fullWeek=[{day:'2026-10-11',items:Array.from({length:3},(_,i)=>({domain:'wissenschaft',subjectKey:'s'+i,eventKey:'e'+i,family:'wissenschaft-facts'}))}];
 assert.equal(selectTopics([item('wissenschaft','new-important',{priority:95,priorityEvidence:true})],{history:fullWeek,now}).selected.length,1);
 assert.equal(selectTopics([item('wissenschaft','unproven-priority',{priority:95,priorityEvidence:false})],{history:fullWeek,now}).selected.length,1);assert.equal(selectTopics([item('wissenschaft','unproven-priority',{priority:95,priorityEvidence:false}),item('natur-tiere','bee')],{history:fullWeek,now,maxItems:1}).selected[0].domain,'natur-tiere');assert.equal(selectTopics([item('wissenschaft','new-important',{priority:95,priorityEvidence:true}),item('natur-tiere','bee')],{history:fullWeek,now,maxItems:1}).selected[0].domain,'wissenschaft');
 const afterWindow=selectTopics([item('weltall','current')],{history:[{day:'2026-09-01',items:[{domain:'weltall',subjectKey:'current',family:'weltall-facts'}]}],now});assert.equal(afterWindow.selected.length,1);assert.equal(afterWindow.history.length,1);
});

test('a new distinct event about the same subject is allowed, but the same event or meaning cannot be retitled as news',()=>{
 const first=selectTopics([item('wissenschaft','first',{subjectKey:'same-subject',eventKey:'original-event',claim:'original fact'})],{now});
 assert.equal(selectTopics([item('wissenschaft','new',{subjectKey:'same-subject',eventKey:'new-event',claim:'genuinely different fact'})],{now,history:first.history}).selected.length,1);
 for(const candidate of [item('wissenschaft','retitled',{eventKey:'original-event',claim:'minor variation'}),item('wissenschaft','redated',{eventKey:'renamed-event',claim:'original fact'})])assert.equal(selectTopics([candidate],{now,history:first.history}).selected.length,0);
 assert.deepEqual(selectTopics([item('sport','unsafe',{rightsConfirmed:false}),{...item('kultur','old'),entry:{id:'old',sourcePublishedOn:'2025-01-01',claims:[]}}],{now}).availableDomains,[]);
});
