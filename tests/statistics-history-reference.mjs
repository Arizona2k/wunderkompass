import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');

// Parameterized preparation. A real currentTemplate may only be supplied after
// the integrated full qualification; synthetic proof inputs never bind live UI.
export function statisticsHistoryReference(fixture,currentTemplate){
 const prior=new Map(fixture.priorDossiers.map(row=>[row.id,row]));
 const added=new Map(fixture.addedDossiers.map(row=>[row.id,row])),history=fixture.historyField;
 assert.equal(fixture.priorDossiers.length,166);assert.equal(prior.size,166);
 assert.equal(fixture.addedDossiers.length,11);assert.equal(added.size,11);assert([...added.keys()].every(id=>!prior.has(id)));
 assert.equal(typeof history,'string');assert(history.startsWith('historicalUIBeforeStatistics'));
 assert.equal(typeof currentTemplate.build,'string');assert(currentTemplate.build.length>0);
 assert(['visible','search','back','offline'].every(key=>currentTemplate[key]===true));
 assert.equal(typeof currentTemplate.report,'string');assert(currentTemplate.report.length>0);
 assert(!Object.hasOwn(currentTemplate,'route'));
 function restoreUIRevision(item,revision){
  const original=structuredClone(item);
  if(!revision)return original;
  assert.equal(typeof revision.historyField,'string');assert(revision.historyField.startsWith('historicalUIBeforeStatistics'));
  assert(Object.hasOwn(original,revision.historyField),'missing previous whole statistics UI '+original.id);
  assert.deepEqual(original[revision.historyField],{...revision.previousTemplate,route:original.ui.route},'changed previous statistics UI '+original.id);
  original.ui=original[revision.historyField];delete original[revision.historyField];return original;
 }
 function beforeCurrentUIRevision(item){return restoreUIRevision(item,fixture.uiRevision);}
 function beforeAllUIRevisions(item){
  let original=structuredClone(item);
  for(let revision=fixture.uiRevision;revision;revision=revision.previousRevision)original=restoreUIRevision(original,revision);
  return original;
 }
 function beforeStatisticsUI(item){
  if(!Object.hasOwn(item,history))return item;
  const saved=prior.get(item.id);assert(saved,'unknown statistics UI history '+item.id);
  assert.deepEqual(item[history],saved.ui,'changed prior statistics UI '+item.id);
  assert.deepEqual(item.ui,{...currentTemplate,route:saved.ui.route},'unreviewed statistics current UI '+item.id);
  const original=beforeAllUIRevisions(item);original.ui=original[history];delete original[history];
  // Whole prior hashes remain mandatory in assertCurrentStatisticsSharedUI.
  // Field-only historical projection lets original complete-hash countercases
  // expose unrelated mutations without concealing or rewriting them.
  return original;
 }
 function assertCurrentStatisticsSharedUI(items){
  const current=new Map(items.map(item=>[item.id,item]));
  assert.equal(current.size,177);assert.equal(items.length,177);
  assert.deepEqual(new Set(current.keys()),new Set([...prior.keys(),...added.keys()]),'unreviewed statistics dossier identities');
  assert.deepEqual(items.map(item=>item.id),[...prior.keys(),...added.keys()],'changed statistics current dossier identities or order');
  let previous=items;
  for(let revision=fixture.uiRevision;revision;revision=revision.previousRevision){
   assert.equal(revision.whole177Before.length,177);
   assert.deepEqual(previous.map(item=>item.id),revision.whole177Before.map(row=>row.id));
   previous=previous.map(item=>restoreUIRevision(item,revision));
   for(const[item,index]of previous.map((item,index)=>[item,index]))assert.equal(digest(item),revision.whole177Before[index].sha256,'every whole prior statistics dossier remains exact '+item.id);
  }
  for(const [id,saved]of prior){
   const item=current.get(id);assert(Object.hasOwn(item,history),'missing current statistics history '+id);
   const original=beforeStatisticsUI(item);assert.equal(digest(original),saved.wholeSHA256);
  }
  for(const [id,saved]of added){
   const item=current.get(id);assert(!Object.hasOwn(item,history),'invented prior statistics history '+id);
   assert.deepEqual(item.ui,{...currentTemplate,route:saved.route},'stale new statistics UI '+id);
   assert.equal(typeof saved.wholeSHA256,'string','new statistics whole dossier reference required '+id);
   assert.equal(digest(item),saved.wholeSHA256,'unreviewed complete new statistics dossier '+id);
  }
 }
 return {beforeStatisticsUI,beforeCurrentUIRevision,beforeAllUIRevisions,assertCurrentStatisticsSharedUI};
}
