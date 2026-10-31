import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');

// Parameterized preparation. A real currentTemplate may only be supplied after
// the integrated full qualification; synthetic proof inputs never bind live UI.
export function mechanicsHistoryReference(fixture,currentTemplate){
 const prior=new Map(fixture.priorDossiers.map(row=>[row.id,row]));
 const added=new Map(fixture.addedDossiers.map(row=>[row.id,row])),history=fixture.historyField;
 assert.equal(fixture.priorDossiers.length,139);assert.equal(prior.size,139);
 assert.equal(fixture.addedDossiers.length,7);assert.equal(added.size,7);assert([...added.keys()].every(id=>!prior.has(id)));
 assert.equal(typeof history,'string');assert(history.startsWith('historicalUIBeforeMechanics'));
 assert.equal(typeof currentTemplate.build,'string');assert(currentTemplate.build.length>0);
 assert(['visible','search','back','offline'].every(key=>currentTemplate[key]===true));
 assert.equal(typeof currentTemplate.report,'string');assert(currentTemplate.report.length>0);
 assert(!Object.hasOwn(currentTemplate,'route'));
 function beforeMechanicsUI(item){
  if(!Object.hasOwn(item,history))return item;
  const saved=prior.get(item.id);assert(saved,'unknown mechanics UI history '+item.id);
  assert.deepEqual(item[history],saved.ui,'changed prior mechanics UI '+item.id);
  assert.deepEqual(item.ui,{...currentTemplate,route:saved.ui.route},'unreviewed mechanics current UI '+item.id);
  const original=structuredClone(item);original.ui=original[history];delete original[history];
  // Whole prior hashes remain mandatory in assertCurrentMechanicsSharedUI.
  // Field-only historical projection lets original complete-hash countercases
  // expose unrelated mutations without concealing or rewriting them.
  return original;
 }
 function assertCurrentMechanicsSharedUI(items){
  const current=new Map(items.map(item=>[item.id,item]));
  assert.equal(current.size,146);assert.equal(items.length,146);
  assert.deepEqual(new Set(current.keys()),new Set([...prior.keys(),...added.keys()]),'unreviewed mechanics dossier identities');
  assert.deepEqual(items.map(item=>item.id),[...prior.keys(),...added.keys()],'changed mechanics current dossier identities or order');
  for(const [id,saved]of prior){
   const item=current.get(id);assert(Object.hasOwn(item,history),'missing current mechanics history '+id);
   const original=beforeMechanicsUI(item);assert.equal(digest(original),saved.wholeSHA256);
  }
  for(const [id,saved]of added){
   const item=current.get(id);assert(!Object.hasOwn(item,history),'invented prior mechanics history '+id);
   assert.deepEqual(item.ui,{...currentTemplate,route:saved.route},'stale new mechanics UI '+id);
   assert.equal(typeof saved.wholeSHA256,'string','new mechanics whole dossier reference required '+id);
   assert.equal(digest(item),saved.wholeSHA256,'unreviewed complete new mechanics dossier '+id);
  }
 }
 return {beforeMechanicsUI,assertCurrentMechanicsSharedUI};
}
