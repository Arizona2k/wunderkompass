import assert from 'node:assert/strict';
import {beforeWaterPhotosynthesis,dossiersBeforeWaterPhotosynthesis} from './water-photosynthesis-reference.mjs';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import fixture from './fixtures/retained-people-data-predecessor.json' with {type:'json'};
const whole=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const named=new Set(fixture.ids);

// Reconstruct only the named, whole reviewed objects. Unknown or modified
// objects cannot be turned into a known historical object by an ID match.
export function beforeRetainedPeople(items){
 // Existing historical tests compose this inverse more than once. Accept only
 // its exact whole already-restored M92 catalog before the newer water layer.
 if(items.length===204&&whole(items)===fixture.priorCatalogSHA256)return items;
 items=beforeWaterPhotosynthesis(items);
 if(items.some(row=>Object.hasOwn(row,'category')&&Object.hasOwn(row,'paragraphs'))){
  if(items.length!==204)return items; // Earlier subsets reach their original predicates unchanged.
  if(whole(items)===fixture.priorCatalogSHA256)return items;
  assert.equal(whole(items),fixture.currentCatalogSHA256,'whole current204 catalog, including every unrelated field');
  const changes=new Map(fixture.catalogChanges.map(row=>[row.id,row]));
  const restored=items.map(row=>changes.has(row.id)?structuredClone(changes.get(row.id).original):row);
  assert.equal(whole(restored),fixture.priorCatalogSHA256);return restored;
 }
 if(items.some(row=>Object.hasOwn(row,'tasks')&&Object.hasOwn(row,'figure'))){
  if(items.length<18)return items;
  if(whole(items)===fixture.priorInquiriesSHA256)return items;
  assert.equal(whole(items),fixture.currentInquiriesSHA256,'whole current36 inquiry objects');
  const restored=items.filter(row=>!named.has(row.id));assert.equal(whole(restored),fixture.priorInquiriesSHA256);return restored;
 }
 const changes=new Map(fixture.bankChanges.map(row=>[row.id,row]));
 return items.map(row=>{
  const change=changes.get(row.id);
  if(!change||!Object.hasOwn(row,'prompt')||!Object.hasOwn(row,'answers'))return row;
  if(whole(row)===whole(change.original))return row;
  assert.equal(whole(row),change.currentSHA256,'whole retained recognition question: '+row.id);
  return structuredClone(change.original);
 });
}
export function beforeRetainedPeopleGraph(graph){
 if(graph.connections.length<181)return graph;
 if(whole(graph)===fixture.priorGraphSHA256)return graph;
 assert.equal(whole(graph),fixture.currentGraphSHA256,'whole current196 explained links');
 const restored={...graph,connections:graph.connections.slice(0,181)};assert.equal(whole(restored),fixture.priorGraphSHA256);return restored;
}
export function beforeRetainedPeopleBookLinks(links){
 if(whole(links)===fixture.priorBookLinksSHA256)return links;
 assert.equal(whole(links),fixture.currentBookLinksSHA256,'whole current45 word pairs');
 const restored=links.slice(0,25);assert.equal(whole(restored),fixture.priorBookLinksSHA256);return restored;
}
export function beforeRetainedPeopleDossiers(items){
 items=dossiersBeforeWaterPhotosynthesis(items);
 if(items.length<268)return items;
 if(items.length===268){assert.deepEqual(items.map(row=>({id:row.id,sha256:whole(row)})),fixture.prior268.map(({route,...row})=>row));return items;}
 assert.equal(items.length,286);const expected=[...fixture.prior268,...fixture.new18];
 assert.deepEqual(items.map(row=>row.id),expected.map(row=>row.id));assert.equal(new Set(items.map(row=>row.id)).size,286);
 const qualifiedFile=new URL('./fixtures/editorial-before-retained-people-268.json',import.meta.url);
 const qualified=fs.existsSync(qualifiedFile)?JSON.parse(fs.readFileSync(qualifiedFile,'utf8')):null;
 return items.map((row,index)=>{
  const restored=structuredClone(row);
  if(qualified){
   // Reconstruct the whole actually qualified older UI layer during a source
   // correction. This is preservation, never current readiness: the editorial
   // contract separately requires the real current runtime build.
   assert.equal(qualified.currentTemplate.build,fixture.qualifiedUIBuild??fixture.currentRuntimeBuild);
   for(const field of ['visible','search','back','offline'])assert.equal(qualified.currentTemplate[field],true);
   assert.equal(typeof qualified.currentTemplate.report,'string');assert(qualified.currentTemplate.report.trim());
   assert.deepEqual(row.ui,{...qualified.currentTemplate,route:expected[index].route});
   if(index<268){assert.equal(typeof row[qualified.historyField],'object');restored.ui=restored[qualified.historyField];delete restored[qualified.historyField];}
   else{assert(!Object.hasOwn(row,qualified.historyField));delete restored.ui;}
  }else{
   assert(!Object.hasOwn(row,'historicalUIBeforeRetainedPeople20261105'),'no premature current technical UI history');
   if(index>=268)assert(!Object.hasOwn(row,'ui'),'new18 technical UI must await actual full qualification');
  }
  assert.equal(whole(restored),expected[index].sha256,'whole retained M92 dossier or reviewed new content: '+row.id);
  return restored;
 }).slice(0,268);
}
export const retainedPeopleBoundary=fixture;

// Reconstruct every whole previously qualified dossier, including all older
// source histories. The old UI template is historical evidence, never current
// readiness. The normal full current-object predicates remain mandatory.
export function beforeNative221PeopleSourceDossiers(items,qualified=JSON.parse(fs.readFileSync(new URL('./fixtures/editorial-before-retained-people-268.json',import.meta.url),'utf8'))){
 items=dossiersBeforeWaterPhotosynthesis(items);
 beforeRetainedPeopleDossiers(items);
 const previous=qualified.previousQualifiedUIBeforeNative221SourceCorrection;
 assert.equal(previous.wholeOriginalDossiers,286);assert.equal(items.length,286);
 assert.deepEqual(previous.keyOrder,['build','visible','search','back','offline','report','route']);
 assert.equal(previous.sourceHistoryField,'historicalSourceBeforeNative221Replacement20261106');
 assert.equal(previous.samePrimarySourceHistoryField,'historicalSourceBeforeNASADirectPDF20261106');
 const restored=items.map(row=>{
  if(Object.hasOwn(row,previous.sourceHistoryField))return structuredClone(row[previous.sourceHistoryField]);
  if(Object.hasOwn(row,previous.samePrimarySourceHistoryField))return structuredClone(row[previous.samePrimarySourceHistoryField]);
  assert.deepEqual(Object.keys(row.ui),previous.keyOrder);
  return {...structuredClone(row),ui:{...previous.template,route:row.ui.route}};
 });
 assert.equal(whole(restored),previous.wholeDossiersSHA256,'whole original286 source and UI dossiers, not merely known IDs');
 return restored;
}
