import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');

// Exact technical UI inverse. The genuine current template is supplied only
// after the new build's complete proof. Historical comparisons remain able to
// expose unrelated fact changes through their original complete hashes.
export function technicalLimitUiReference(fixture,currentTemplate){
 const prior=new Map(fixture.priorDossiers.map(row=>[row.id,row]));
 const history=fixture.historyField;
 assert.equal(fixture.priorDossiers.length,139);assert.equal(prior.size,139);
 assert.equal(history,'historicalUIBeforeTechnicalLimits20261030');
 assert.equal(typeof currentTemplate.build,'string');assert(currentTemplate.build.length>0);
 assert(['visible','search','back','offline'].every(key=>currentTemplate[key]===true));
 assert.equal(typeof currentTemplate.report,'string');assert(currentTemplate.report.length>0);
 assert(!Object.hasOwn(currentTemplate,'route'));
 function beforeTechnicalLimitUi(item,{current=false}={}){
  if(!Object.hasOwn(item,history))return item; // already-projected historical row
  const saved=prior.get(item.id);assert(saved,'unknown technical UI history '+item.id);
  assert.deepEqual(item[history],saved.ui,'unreviewed old technical UI history '+item.id);
  assert.deepEqual(item.ui,{...currentTemplate,route:saved.ui.route},(current?'stale current shared UI: ':'unreviewed current UI: ')+'technical limit binding '+item.id);
  const original=structuredClone(item);original.ui=original[history];delete original[history];return original;
 }
 function assertCurrentTechnicalLimitUi(items){
  assert.equal(items.length,139);const current=new Map(items.map(item=>[item.id,item]));assert.equal(current.size,139,'duplicate current technical UI dossier');
  assert.deepEqual(items.map(item=>item.id),fixture.priorDossiers.map(item=>item.id),'changed technical UI dossier identities or order');
  for(const [id,saved]of prior){
   const item=current.get(id);assert(Object.hasOwn(item,history),'stale current shared UI: technical history missing '+id);
   const original=beforeTechnicalLimitUi(item,{current:true});
   assert.equal(hash(original),saved.wholeSHA256,'unreviewed complete prior technical dossier '+id);
  }
 }
 return {beforeTechnicalLimitUi,assertCurrentTechnicalLimitUi};
}
