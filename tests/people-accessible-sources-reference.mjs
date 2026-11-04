import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import correction from './fixtures/people-accessible-sources-correction.json' with {type:'json'};
const whole=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');

// Only these six individually reviewed current dossiers can reconstruct the
// preceding whole source-reviewed objects. Historical assertions stay intact.
export function beforeAccessiblePeopleSourceDossiers(items){
 if(items.length!==268)return items;
 const changes=new Map(correction.dossiers.map(row=>[row.id,row]));
 assert.equal(changes.size,6);
 return items.map(row=>{
  const original=structuredClone(row);
  if(correction.qualifiedCurrentUITemplate){
   assert.deepEqual(row.ui,{...correction.qualifiedCurrentUITemplate,route:row[correction.historyField]?.route});
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
