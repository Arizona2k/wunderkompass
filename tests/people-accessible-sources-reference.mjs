import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import correction from './fixtures/people-accessible-sources-correction.json' with {type:'json'};
import {beforeRetainedPeopleDossiers} from './retained-people-reference.mjs';
const whole=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');

// New technical UI evidence may be bound only after the corrected full run.
// Until then every previous receipt continues to identify its actual a415 build.
export function beforeMetRecordSourceUIDossiers(items){
 items=beforeRetainedPeopleDossiers(items);
 const latest=correction.native219MetRecordCorrection;
 if(!latest||items.length!==268)return items;
 assert.equal(latest.currentBuild,correction.currentBuild);
 return items.map(row=>{
  const original=structuredClone(row),q=latest.uiQualification;
  if(q){
   assert.equal(latest.uiQualificationPending,false);
   assert.equal(q.currentBuild,latest.currentBuild);assert.equal(q.beforeBuild,latest.beforeBuild);
   assert.equal(original[q.historyField]?.build,q.beforeBuild);
   assert.deepEqual(original.ui,{...q.qualifiedCurrentUITemplate,route:original[q.historyField]?.route});
   original.ui=original[q.historyField];delete original[q.historyField];
  }else{
   assert.equal(latest.uiQualificationPending,true);
   assert.equal(original.ui.build,latest.beforeBuild);
   assert(!Object.hasOwn(original,'historicalUIBeforeMetRecordSourceCorrection20261105'),'no premature current UI history');
  }
  return original;
 });
}

// Only these six individually reviewed current dossiers can reconstruct the
// preceding whole source-reviewed objects. Historical assertions stay intact.
export function beforeAccessiblePeopleSourceDossiers(items){
 items=beforeMetRecordSourceUIDossiers(items);
 if(items.length!==268)return items;
 const changes=new Map(correction.dossiers.map(row=>[row.id,row]));
 assert.equal(changes.size,6);
 return items.map(row=>{
  const original=structuredClone(row);
  const current=correction.native218SourceUIQualification;
  if(current){
   assert.equal(correction.native218SourceUIQualificationPending,false);
   assert.equal(current.currentBuild,correction.native219MetRecordCorrection?.beforeBuild??correction.currentBuild);
   assert.equal(original[current.historyField]?.build,current.beforeBuild);
   assert.deepEqual(original.ui,{...current.qualifiedCurrentUITemplate,route:original[current.historyField]?.route});
   original.ui=original[current.historyField];delete original[current.historyField];
  }
  if(correction.qualifiedCurrentUITemplate){
   assert.deepEqual(original.ui,{...correction.qualifiedCurrentUITemplate,route:original[correction.historyField]?.route});
   assert.equal(row[correction.historyField]?.build,correction.beforeBuild);
   original.ui=original[correction.historyField];delete original[correction.historyField];
  }else assert(!Object.hasOwn(row,correction.historyField),'no premature source-correction UI history');
  const change=changes.get(row.id);
  if(!change)return original;
  assert.equal(whole(original),change.currentSHA256,'whole current individually reviewed source correction: '+row.id);
  assert.equal(change.original.id,row.id);
  return structuredClone(change.original);
 });
}

export const accessiblePeopleSourceCorrection=correction;
