import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import catalog from '../app/world-catalog.json' with {type:'json'};
import {beforeAccessiblePeopleSourceDossiers,accessiblePeopleSourceCorrection as correction} from './people-accessible-sources-reference.mjs';
import {beforeFourteenDossiers} from './people-fourteen-dossier-reference.mjs';

test('eight reviewed alternatives retain all35 public source actions and exact prior dossier facts, media and histories',()=>{
 const rows=JSON.parse(fs.readFileSync('content/editorial-reviews.json','utf8')).dossiers;
 assert.equal(rows.length,268);assert.equal(correction.dossiers.length,6);
 const restored=beforeAccessiblePeopleSourceDossiers(rows);
 for(const change of correction.dossiers)assert.deepEqual(restored.find(row=>row.id===change.id),change.original);
 assert.equal(beforeFourteenDossiers(rows).length,254);
 const inquiries=JSON.parse(fs.readFileSync('app/people-inquiries.json','utf8')).entries;
 const next=new Set(inquiries.slice(4).map(row=>row.id));
 assert.equal(catalog.filter(row=>next.has(row.id)).reduce((sum,row)=>sum+row.sources.length,0),35);
 // Arbitrary new data or stale current source/body claims cannot hide behind
 // reconstruction of a known historically reviewed object.
 for(const change of correction.dossiers){
  for(const mutate of [row=>row.sources[0].url='https://invalid.example/unreviewed',row=>row.explanation+=' unreviewed',row=>row.claims[0].anchor='unreviewed',row=>row.ui.build='invented',row=>row.ui.route='world/topic/unreviewed-route',row=>row.mediaDecision='unreviewed']){
   const bad=structuredClone(rows);mutate(bad.find(row=>row.id===change.id));
   assert.throws(()=>beforeFourteenDossiers(bad),change.id);
  }
 }
});
