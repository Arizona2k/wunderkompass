import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');

// Parameterized preparation. A real currentTemplate may only be supplied after
// the integrated full qualification; synthetic proof inputs never bind live UI.
export function geneHistoryReference(fixture,currentTemplate){
 const prior=new Map(fixture.priorDossiers.map(row=>[row.id,row]));
 const added=new Map(fixture.addedDossiers.map(row=>[row.id,row])),history=fixture.historyField;
 assert.equal(fixture.priorDossiers.length,156);assert.equal(prior.size,156);
 assert.equal(fixture.addedDossiers.length,10);assert.equal(added.size,10);assert([...added.keys()].every(id=>!prior.has(id)));
 assert.equal(typeof history,'string');assert(history.startsWith('historicalUIBeforeGene'));
 assert.equal(typeof currentTemplate.build,'string');assert(currentTemplate.build.length>0);
 assert(['visible','search','back','offline'].every(key=>currentTemplate[key]===true));
 assert.equal(typeof currentTemplate.report,'string');assert(currentTemplate.report.length>0);
 assert(!Object.hasOwn(currentTemplate,'route'));
 function beforeGeneUI(item){
  if(!Object.hasOwn(item,history))return item;
  const saved=prior.get(item.id);assert(saved,'unknown gene UI history '+item.id);
  assert.deepEqual(item[history],saved.ui,'changed prior gene UI '+item.id);
  assert.deepEqual(item.ui,{...currentTemplate,route:saved.ui.route},'unreviewed gene current UI '+item.id);
  const original=structuredClone(item);original.ui=original[history];delete original[history];
  // Whole prior hashes remain mandatory in assertCurrentGeneSharedUI.
  // Field-only historical projection lets original complete-hash countercases
  // expose unrelated mutations without concealing or rewriting them.
  return original;
 }
 function assertCurrentGeneSharedUI(items){
  const current=new Map(items.map(item=>[item.id,item]));
  assert.equal(current.size,166);assert.equal(items.length,166);
  assert.deepEqual(new Set(current.keys()),new Set([...prior.keys(),...added.keys()]),'unreviewed gene dossier identities');
  assert.deepEqual(items.map(item=>item.id),[...prior.keys(),...added.keys()],'changed gene current dossier identities or order');
  for(const [id,saved]of prior){
   const item=current.get(id);assert(Object.hasOwn(item,history),'missing current gene history '+id);
   const original=beforeGeneUI(item);assert.equal(digest(original),saved.wholeSHA256);
  }
  for(const [id,saved]of added){
   const item=current.get(id);assert(!Object.hasOwn(item,history),'invented prior gene history '+id);
   assert.deepEqual(item.ui,{...currentTemplate,route:saved.route},'stale new gene UI '+id);
   assert.equal(typeof saved.wholeSHA256,'string','new gene whole dossier reference required '+id);
   assert.equal(digest(item),saved.wholeSHA256,'unreviewed complete new gene dossier '+id);
  }
 }
 return {beforeGeneUI,assertCurrentGeneSharedUI};
}
