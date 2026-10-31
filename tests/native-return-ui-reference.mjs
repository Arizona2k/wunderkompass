import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');

// This outer inverse changes only current shared UI metadata. Original inner
// technical/audit checks run on its projection before the whole prior contract.
// Unrelated content remains visible to those original hashes and error cases.
export function nativeReturnUiReference(fixture,currentTemplate){
 const prior=new Map(fixture.priorDossiers.map(row=>[row.id,row])),history=fixture.historyField;
 assert.equal(fixture.priorDossiers.length,139);assert.equal(prior.size,139);
 assert.equal(history,'historicalUIBeforeNativeShortReturn20261030');
 assert.equal(typeof currentTemplate.build,'string');assert(currentTemplate.build.length>0);
 assert(['visible','search','back','offline'].every(key=>currentTemplate[key]===true));
 assert.equal(typeof currentTemplate.report,'string');assert(currentTemplate.report.length>0);assert(!Object.hasOwn(currentTemplate,'route'));
 function beforeNativeReturnUi(item,{current=false}={}){
  if(!Object.hasOwn(item,history))return item;
  const saved=prior.get(item.id);assert(saved,'unknown native short return UI history '+item.id);
  assert.deepEqual(item[history],saved.ui,'unreviewed old native short return UI history '+item.id);
  assert.deepEqual(item.ui,{...currentTemplate,route:saved.ui.route},(current?'stale current shared UI: ':'unreviewed current UI: ')+'native short return binding '+item.id);
  const original=structuredClone(item);original.ui=original[history];delete original[history];return original;
 }
 function assertCurrentNativeReturnUi(items){
  assert.equal(items.length,139);const current=new Map(items.map(item=>[item.id,item]));assert.equal(current.size,139,'duplicate native short return UI dossier');
  assert.deepEqual(items.map(item=>item.id),fixture.priorDossiers.map(item=>item.id),'changed native short return UI identities or order');
  for(const[id,saved]of prior){const item=current.get(id);assert(Object.hasOwn(item,history),'current native short return UI history missing '+id);assert.equal(hash(beforeNativeReturnUi(item,{current:true})),saved.wholeSHA256,'unreviewed complete prior native short return dossier '+id);}
 }
 return {beforeNativeReturnUi,assertCurrentNativeReturnUi};
}
