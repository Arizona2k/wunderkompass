// Strict raw-current146 validation before the exact139 historical projection.
// Apply only after genuine current full closure and its actual UI fixture.
import assert from 'node:assert/strict';
import fixture from './fixtures/editorial-before-mechanics-139.json' with {type:'json'};
import {mechanicsHistoryReference} from './mechanics-history-reference.mjs';
import {cellPredecessors} from './cell-predecessor-reference.mjs';
const reference=mechanicsHistoryReference(fixture,fixture.currentTemplate);
export function mechanicsPredecessors(items){
 items=cellPredecessors(items);
 reference.assertCurrentMechanicsSharedUI(items);
 const prior=fixture.priorDossiers.map((saved,index)=>{
  assert.equal(items[index].id,saved.id,'historical mechanics projection order');
  return reference.beforeMechanicsUI(items[index]);
 });
 assert.equal(prior.length,139);
 return prior;
}
