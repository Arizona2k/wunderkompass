import {dossierBeforeLearningAudit} from './learning-audit-reference.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';

test('shared audit UI maintenance preserves every complete M78 dossier and its factual and UI history',()=>{
 const baseline=JSON.parse(fs.readFileSync('tests/fixtures/editorial-before-audit-ui-139-hashes.json','utf8'));
 const current=JSON.parse(fs.readFileSync('content/editorial-reviews.json','utf8')).dossiers.map(dossierBeforeLearningAudit);
 assert.equal(baseline.sourceCommit,'9d09ed1773aca26a6a3cd7e42b4d1ad762bc6481');
 assert.equal(baseline.dossiers.length,139);assert.equal(current.length,139);
 assert.deepEqual(current.map(d=>d.id),baseline.dossiers.map(d=>d.id));
 for(const old of baseline.dossiers){
  const original={...current.find(d=>d.id===old.id)};
  if(original.historicalUIBeforeAuditUiCurrentFull20261029){
   original.ui=original.historicalUIBeforeAuditUiCurrentFull20261029;
   delete original.historicalUIBeforeAuditUiCurrentFull20261029;
  }
  assert.equal(createHash('sha256').update(JSON.stringify(original)).digest('hex'),old.sha256,old.id+' whole original dossier retained');
 }
});
