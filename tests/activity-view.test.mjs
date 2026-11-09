import test from 'node:test';import assert from 'node:assert/strict';import {activityIsOpen} from '../app/activity-view.mjs';
test('resume stays available on Home, another target and the selection; only an actually open exact target is redundant',()=>{
 const cases=[
  [{type:'journey',id:'moon'},{route:'journeys/moon'}],
  [{type:'journey',id:'moon'},{route:'journeys/moon/3'}],
  [{type:'lab',id:'solar'},{route:'labs/solar'}],
  [{type:'topic',id:'animal-lion'},{route:'world/topic/animal-lion'}],
  [{type:'route',id:'moon-to-sea'},{route:'world/route/moon-to-sea'}],
  [{type:'game',id:'memory',family:'classic'},{mode:'games',gameFamily:'classic',gameId:'memory'}],
  [{type:'game',id:'world:people',family:'world'},{mode:'games',gameFamily:'world',gameId:'world:people'}],
  [{type:'quiz',id:'saved-round'},{mode:'quiz'}],
  [{type:'place',id:'vostok'},{mode:'globe',placeId:'vostok'}],
 ];
 for(const [activity,current] of cases){const original=structuredClone(activity);assert.equal(activityIsOpen(activity,current),true);assert.equal(activityIsOpen(activity,{route:'home',mode:'home'}),false);assert.deepEqual(activity,original);}
 for(const [activity,current] of [
  [{type:'journey',id:'moon'},{route:'journeys/moonshine/2'}],
  [{type:'lab',id:'solar'},{route:'labs'}],
  [{type:'lab',id:'solar'},{route:'labs/solar-extra'}],
  [{type:'topic',id:'animal-lion'},{route:'world/topic/animal-lion-extra'}],
  [{type:'game',id:'memory',family:'classic'},{mode:'games',gameFamily:null,gameId:'memory'}],
  [{type:'game',id:'memory',family:'classic'},{mode:'games',gameFamily:'extra',gameId:'memory'}],
  [{type:'game',id:'world:people',family:'world'},{mode:'games',gameFamily:'world',gameId:'world:food'}],
  [{type:'place',id:'vostok'},{mode:'globe',placeId:'fuji'}],
  [{type:'quiz',id:'saved-round'},{mode:'games'}],
  [{type:'unknown',id:'same'},{route:'same',mode:'same'}],
  [null,{route:'home'}],
 ])assert.equal(activityIsOpen(activity,current),false);
});
test('only the exact selected article-map point is redundant in its own article; Home, other places and stored activity remain unchanged',()=>{
 for(const id of ['world-history-cahokia-0','world-person-marie_curie-1']){
  const article=id.slice(6,id.lastIndexOf('-')),activity={type:'place',id},before=structuredClone(activity);
  assert.equal(activityIsOpen(activity,{route:'world/topic/'+article,mode:'world',placeId:id}),true);
  for(const current of [{route:'home',mode:'home',placeId:id},{route:'world/topic/'+article+'-other',mode:'world',placeId:id},{route:'world/topic/'+article,mode:'world',placeId:'different'},{route:'world/topic/'+article,mode:'world'}])assert.equal(activityIsOpen(activity,current),false);
  assert.deepEqual(activity,before,'visibility never edits the saved place or its resume identity');
 }
 for(const id of ['world-history-cahokia-00','world-history-cahokia--1','world-history-cahokia-1.5','world-history-cahokia','history-cahokia-0'])assert.equal(activityIsOpen({type:'place',id},{route:'world/topic/history-cahokia',mode:'world',placeId:id}),false);
});
