import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import fixture from './fixtures/people-fourteen-dossier-predecessor.json' with {type:'json'};
const whole=row=>createHash('sha256').update(JSON.stringify(row)).digest('hex');

// Exact whole-object outer boundary; existing inner predecessor checks remain.
// The bound template file is created only after actual full qualification.
function actualQualifiedTemplate(){const p=new URL('./fixtures/editorial-before-people-fourteen-254.json',import.meta.url);return fs.existsSync(p)?JSON.parse(fs.readFileSync(p,'utf8')).currentTemplate:null;}
export function beforeFourteenDossiers(items,qualifiedTemplate=actualQualifiedTemplate()){
 if(items.length<254)return items;
 const expected=[...fixture.prior254,...fixture.new14];
 if(items.length===254){
  assert.deepEqual(items.map(row=>({id:row.id,sha256:whole(row)})),fixture.prior254.map(({ui,...row})=>row));
  return items;
 }
 assert.equal(items.length,268);
 assert.deepEqual(items.map(row=>row.id),expected.map(row=>row.id));
 assert.equal(new Set(items.map(row=>row.id)).size,268);
 const restored=items.map((row,index)=>{
  const original=structuredClone(row),old=index<254;
  if(qualifiedTemplate){
   assert.equal(qualifiedTemplate.build,fixture.currentPreparedBuild);
   for(const field of ['visible','search','back','offline'])assert.equal(qualifiedTemplate[field],true);
   assert.equal(typeof qualifiedTemplate.report,'string');assert(qualifiedTemplate.report.trim());
   assert.deepEqual(row.ui,{...qualifiedTemplate,route:old?expected[index].ui.route:expected[index].route});
   if(old){assert.deepEqual(row[fixture.historyField],expected[index].ui);original.ui=original[fixture.historyField];delete original[fixture.historyField];}
   else{assert(!Object.hasOwn(row,fixture.historyField));delete original.ui;}
  }else{
   assert(!Object.hasOwn(row,fixture.historyField),'no premature new UI history');
   if(!old)assert(!Object.hasOwn(row,'ui'),'no premature current UI for a new person');
  }
  const dataChange=fixture.relatedDataHashChanges?.[row.id],dataHistory=fixture.relatedDataHashHistoryField;
  if(dataChange){assert.equal(original.dataHash,dataChange.current);assert.equal(original[dataHistory],dataChange.previous);original.dataHash=original[dataHistory];delete original[dataHistory];}
  else if(dataHistory)assert(!Object.hasOwn(original,dataHistory),'no unreviewed related-list data history');
  assert.equal(whole(original),expected[index].sha256,'whole previous dossier or individual new content: '+row.id);
  return original;
 });
 return restored.slice(0,254);
}
