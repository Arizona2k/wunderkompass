import assert from 'node:assert/strict';
import test from 'node:test';
import {researchLaboratoriesForTopic} from '../app/research-links.ts';
import {LAB_SEARCH,RESEARCH_PATHS} from '../app/research-catalog.ts';

test('chapter and article topic destinations preserve primary and individually authored extra relations',()=>{
 for(const [topic,id] of [['science-magnetism','depth'],['science-water-cycle','water'],['science-tides','tides'],['science-solar-system','solar'],['invention-seismograph','quake']]){
  const actual=researchLaboratoriesForTopic(topic,LAB_SEARCH,RESEARCH_PATHS);
  assert.deepEqual(actual.map(lab=>lab.id),[id],topic);
  assert.ok(actual[0].why.length>30,topic+' keeps its explanatory relation');
  assert.equal(actual[0].name,LAB_SEARCH.find(lab=>lab.id===id).name);
 }
});
test('unrelated, empty or unregistered topics never manufacture a laboratory match',()=>{
 for(const topic of ['', 'animal-orca','invention-compass','missing'])assert.deepEqual(researchLaboratoriesForTopic(topic,LAB_SEARCH,RESEARCH_PATHS),[]);
 assert.deepEqual(researchLaboratoriesForTopic('science-magnetism',[{id:'unregistered'}],{}),[]);
});
test('multiple authored destinations remain independently named choices without mutating the catalogue',()=>{
 const labs=LAB_SEARCH.filter(lab=>['weather','water'].includes(lab.id));
 const paths={weather:{topic:'shared-future-topic'},water:{topic:'shared-future-topic'}};
 const before=structuredClone({labs,paths});
 const choices=researchLaboratoriesForTopic('shared-future-topic',labs,paths);
 assert.deepEqual(choices.map(lab=>lab.id),['weather','water']);
 assert.equal(new Set(choices.map(lab=>lab.name)).size,2);
 assert.equal(new Set(choices.map(lab=>lab.why)).size,2);
 assert.deepEqual({labs,paths},before);
});
