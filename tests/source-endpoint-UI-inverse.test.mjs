// Exact additional UI-history regression. Synthetic UI never establishes actual product acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {beforeWaterPhotosynthesis,topicBeforeWaterPhotosynthesis,dossiersBeforeWaterPhotosynthesis,wholeWaterReference,waterPhotosynthesisBoundary as boundary} from './water-photosynthesis-reference.mjs';

const raw=JSON.parse(fs.readFileSync(new URL('../content/editorial-reviews.json',import.meta.url),'utf8')).dossiers;
const actualLayer=boundary.sourceEndpointCorrection.qualifiedUILayer;
const pending=actualLayer&&raw.some(row=>row.ui?.build===actualLayer.build)?raw.map((row,index)=>({...structuredClone(row),ui:{...actualLayer.previousTemplate,route:actualLayer.routes[index].route}})):structuredClone(raw);
if(actualLayer)assert.equal(wholeWaterReference(pending),actualLayer.previousSourceCorrectedWholeDossiersSHA256);
const historical=dossiersBeforeWaterPhotosynthesis(structuredClone(pending));
function synthetic(run){
 const correction=boundary.sourceEndpointCorrection;
 const original=structuredClone(correction),previousLayer=structuredClone(boundary.qualifiedUILayer);
 try{
  correction.pendingCurrentUIBuild='synthetic-source-endpoint-current';
  const currentTemplate={build:correction.pendingCurrentUIBuild,visible:true,search:true,back:true,offline:true,report:'Synthetic unit fixture only; no actual application qualification.'};
  correction.qualifiedUILayer={build:currentTemplate.build,currentTemplate,previousTemplate:structuredClone(previousLayer.currentTemplate),routes:structuredClone(previousLayer.routes),previousSourceCorrectedWholeDossiersSHA256:wholeWaterReference(pending)};
  const current=pending.map((row,index)=>({...structuredClone(row),ui:{...currentTemplate,route:previousLayer.routes[index].route}}));
  run({current,layer:correction.qualifiedUILayer});
 }finally{
  for(const key of Object.keys(correction))delete correction[key];
  Object.assign(correction,original);
  boundary.qualifiedUILayer=previousLayer;
 }
}

test('a second exact UI inverse preserves all288 source-corrected predecessors and all286 original factual/UI dossiers',()=>synthetic(({current})=>{
 assert.equal(current.length,288);
 assert.deepEqual(dossiersBeforeWaterPhotosynthesis(current),historical);
 assert.deepEqual(dossiersBeforeWaterPhotosynthesis(structuredClone(pending)),historical);
 assert.equal(boundary.qualifiedUILayer.build,'7483c6fa2774d7ff');
 assert.equal(pending[0].ui.build,'7483c6fa2774d7ff');
}));

test('partial UI, wrong builds, flags, routes, identities and order cannot obtain the historical inverse',()=>synthetic(({current})=>{
 const cases=[
  rows=>{rows[0].ui=pending[0].ui;},
  rows=>{rows[0].ui.build='unknown';},
  rows=>{rows[0].ui.visible=false;},
  rows=>{rows[0].ui.route='#wrong';},
  rows=>{rows[0].id='unknown';},
  rows=>{[rows[0],rows[1]]=[rows[1],rows[0]];},
  rows=>{delete rows[287].ui;},
  rows=>{rows.push(structuredClone(rows[0]));},
 ];
 for(const mutate of cases){const bad=structuredClone(current);mutate(bad);assert.throws(()=>dossiersBeforeWaterPhotosynthesis(bad));}
}));

test('the additional UI layer cannot hide factual changes, nested history or changed source corrections',()=>synthetic(({current})=>{
 const cases=[
  rows=>{rows[0].goal+=' altered';},
  rows=>{rows[0].unreviewedHistory={claim:'altered'};},
  rows=>{rows.find(row=>row.id===boundary.sourceEndpointCorrection.dossier.id).dataHash='changed';},
  rows=>{rows[287].goal+=' altered';},
 ];
 for(const mutate of cases){const bad=structuredClone(current);mutate(bad);assert.throws(()=>dossiersBeforeWaterPhotosynthesis(bad));}
}));

test('damaged predecessor bodies, templates, build bindings and routes fail closed',()=>synthetic(({current,layer})=>{
 for(const [key,value] of [
  ['previousSourceCorrectedWholeDossiersSHA256','0'.repeat(64)],
  ['previousTemplate',{...layer.previousTemplate,visible:false}],
  ['currentTemplate',{...layer.currentTemplate,build:'wrong'}],
  ['routes',[...layer.routes].reverse()],
  ['build','wrong'],
 ]){
  const original=layer[key];layer[key]=value;
  try{assert.throws(()=>dossiersBeforeWaterPhotosynthesis(structuredClone(current)));}finally{layer[key]=original;}
 }
}));
