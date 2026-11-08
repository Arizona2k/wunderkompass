// Recover only the exact complete M94 editorial registry, never arbitrary partial revisions.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import boundary from './fixtures/history-individual-dossiers-M94-predecessor.json' with {type:'json'};
export const historyDossierBoundary=boundary;
export const wholeHistoryDossier=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const signature=rows=>rows.map(row=>({id:row.id,sha256:wholeHistoryDossier(row)}));
export function dossiersBeforeHistoryEvidence(rows){
 const isHistory=rows.length>288||rows.some(row=>boundary.addedIds.includes(row.id)||Object.hasOwn(row,boundary.historyField));
 if(!isHistory)return rows;
 assert.equal(rows.length,300,'only the twelve named new individual history dossiers');
 const layer=boundary.qualifiedUILayer;
 if(layer&&rows.some(row=>row.ui?.build===layer.currentTemplate.build)){
  assert.equal(layer.routes.length,300);
  rows=rows.map((row,index)=>{
   const saved=layer.routes[index];assert.equal(row.id,saved.id);
   assert.deepEqual(row.ui,{...layer.currentTemplate,route:saved.route},'whole named actual UI layer only');
   const restored=structuredClone(row);delete restored.ui;
   if(Object.hasOwn(saved,'previousUI'))restored.ui=structuredClone(saved.previousUI);
   return restored;
  });
 }
 assert.deepEqual(signature(rows),boundary.currentContentOnly,'all300 whole individual content records and unchanged predecessors');
 const restored=rows.filter(row=>!boundary.addedIds.includes(row.id)).map(row=>{
  if(!boundary.changedPriorIds.includes(row.id))return row;
  assert(Object.hasOwn(row,boundary.historyField),'each factual/relationship revision keeps its entire original');
  return structuredClone(row[boundary.historyField]);
 });
 assert.deepEqual(signature(restored),boundary.previous,'all288 whole original factual and UI histories in their original order');
 assert.equal(wholeHistoryDossier(restored),boundary.previousWholeSHA256);
 return restored;
}
