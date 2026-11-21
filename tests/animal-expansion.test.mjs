import test from 'node:test';
import assert from 'node:assert/strict';
import inquiries from '../app/animal-inquiries.json' with {type:'json'};
import catalog from '../app/world-catalog.json' with {type:'json'};
test('voluntary inquiry hints do not copy the answer and wrong feedback does not just repeat the correct explanation',()=>{
 const animals=catalog.filter(t=>t.category==='animals'),ids=inquiries.entries.map(e=>e.id);
 assert.equal(new Set(ids).size,ids.length,'one inquiry per animal');assert.deepEqual(new Set(ids),new Set(animals.map(t=>t.id)),'every animal article has its own inquiry');
 for(const inquiry of inquiries.entries){
  for(const level of ['reason','transfer']){
   const task=inquiry[level],label=inquiry.id+':'+level;
   assert.notEqual(task.hint.trim(),task.answers[task.correct].trim(),label+' hint leaves the choice to the learner');
   assert.equal(task.feedback[1-task.correct].trim().endsWith(task.feedback[task.correct].trim()),false,label+' wrong feedback explains the specific misconception');
  }
 }
});
test('source-specific comparison units and range/typical/upper semantics remain explicit',()=>{
 const animals=catalog.filter(t=>t.category==='animals');
 for(const t of animals){const s=t.animal.size;assert.ok(Number.isFinite(s.min)&&Number.isFinite(s.max)&&s.min>=0&&s.max>=s.min,t.id);assert.ok(['m','cm','mm','kg','g'].includes(s.unit));if(s.kind&&s.kind!=='range'){assert.ok(['upper-bound','typical'].includes(s.kind));assert.equal(s.min,s.max,t.id+' single comparison value is not invented as a range');}assert.ok(s.measurement_de);}
 assert.equal(animals.find(t=>t.id==='animal-common-chameleon').animal.size.unit,'g');assert.equal(animals.find(t=>t.id==='animal-garden-snail').animal.size.measurement_de,'Gehäusebreite, nicht Länge des ausgestreckten Tiers');
});
