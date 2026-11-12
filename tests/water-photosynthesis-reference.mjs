import {thinkingBeforeKewSourceReplacement} from './history-native226-source-reference.mjs';
import {beforeHistoryEvidence} from './history-evidence-reference.mjs';
import {dossiersBeforeHistoryEvidence} from './history-individual-dossiers-reference.mjs';
// Exact historical source/UI inverse; qualification requires named actual whole-input evidence.
// Exact historical source/UI inverse; actual qualification is recorded in the named boundary.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import boundary from './fixtures/water-photosynthesis-M93-data-predecessor.json' with {type:'json'};
import retainedPeople from './fixtures/retained-people-data-predecessor.json' with {type:'json'};
import legacyPeople from './fixtures/legacy-people20-before-merian-lehmann.json' with {type:'json'};

export const wholeWaterReference=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const topics=new Map(boundary.topics.map(row=>[row.id,row]));
const questions=new Map(boundary.bankChanges.map(row=>[row.id,row]));
function previous(value,row){
 if(!row||wholeWaterReference(value)===wholeWaterReference(row.before))return value;
 assert.deepEqual(value,row.after,'only the entire reviewed water/photosynthesis object has a historical predecessor: '+value.id);
 return structuredClone(row.before);
}
const sourceCorrection=boundary.sourceEndpointCorrection;
// Each additional correction is an exact named boundary, not a permissive normalization.
const sourceCorrections=()=>[...(boundary.additionalSourceEndpointCorrections??[]),sourceCorrection].filter(Boolean);
export const topicBeforeWaterPhotosynthesis=topic=>{
 const correction=sourceCorrections().find(row=>row.topic.id===topic.id);
 // Earlier release tests may have already removed the fourteen-person backlinks.
 // Admit only whole originals from either preserved boundary, never a partial-looking object.
 const historical=correction?[retainedPeople.catalogChanges.find(row=>row.id===topic.id)?.original,legacyPeople.peopleTopics.find(row=>row.id===topic.id)].filter(Boolean):[];
 if(historical.some(original=>wholeWaterReference(topic)===wholeWaterReference(original)))return topic;
 return previous(previous(topic,correction?.topic),topics.get(topic.id));
};
export function beforeWaterPhotosynthesis(items){
 items=beforeHistoryEvidence(items);
 if(items.some(row=>Object.hasOwn(row,'category')&&Object.hasOwn(row,'paragraphs'))){
  if(items.some(row=>topics.has(row.id)&&wholeWaterReference(row)===wholeWaterReference(topics.get(row.id).after)))assert.equal(items.length,204,'a current water/photosynthesis catalog must retain all204 identities');
  if(items.length===204){const hash=wholeWaterReference(items);assert([boundary.previousCatalogSHA256,boundary.currentCatalogSHA256,...sourceCorrections().map(row=>row.previousCurrentCatalogSHA256)].includes(hash),'all204 whole topics, including every unrelated field, must match the reviewed boundary');}
  return items.map(topicBeforeWaterPhotosynthesis);
 }
 return items.map(row=>previous(row,questions.get(row.id)));
}
export function thinkingBeforeWaterPhotosynthesis(thinking){
 if(wholeWaterReference(thinking)===wholeWaterReference(boundary.previousThinking))return thinking;
 thinking=thinkingBeforeKewSourceReplacement(thinking);
 assert.equal(wholeWaterReference(thinking),boundary.currentThinkingSHA256,'all25 whole authored inquiry entries must match before historical projection');
 return structuredClone(boundary.previousThinking);
}
export function dossiersBeforeWaterPhotosynthesis(items){
 items=dossiersBeforeHistoryEvidence(items);
 if(items.length<=286)return items;
 assert.equal(items.length,288,'only two named individual dossiers were added');
 // Preparation only: this inverse does not qualify a product UI or manufacture a passed run.
 const sourceUI=sourceCorrection?.qualifiedUILayer;
 if(sourceUI&&items.some(row=>row.ui?.build===sourceUI.build)){
  assert.equal(sourceUI.build,sourceCorrection.pendingCurrentUIBuild,'only the named source-corrected build can have this additional inverse');
  assert.deepEqual(sourceUI.previousTemplate,boundary.qualifiedUILayer.currentTemplate,'the whole actual preceding UI layer remains unchanged');
  assert.deepEqual(sourceUI.routes,boundary.qualifiedUILayer.routes,'all288 actual route identities and their order remain unchanged');
  assert.equal(sourceUI.currentTemplate.build,sourceUI.build);
  const restored=items.map((row,index)=>{
   const route=sourceUI.routes[index];assert.equal(row.id,route.id,'the qualified current source/UI layer retains dossier order');
   assert.deepEqual(row.ui,{...sourceUI.currentTemplate,route:route.route},'only the whole qualified source-corrected UI object may be projected');
   return {...row,ui:{...sourceUI.previousTemplate,route:route.route}};
  });
  assert.equal(wholeWaterReference(restored),sourceUI.previousSourceCorrectedWholeDossiersSHA256,'all288 whole source-corrected predecessor dossiers must be recovered before the factual-source inverse');
  items=restored;
 }
 for(const correction of sourceCorrections()){
  if(correction.legacyTopicWithoutExistingDossier===true){
   assert.equal(correction.topic.id,'history-paper','only the named still-unreviewed legacy paper source boundary lacks an individual dossier');
   assert.equal(correction.dossier,undefined,'source-only legacy correction cannot replace or invent a factual dossier');
   assert(!items.some(row=>row.id==='topics-history:history-paper'),'this bounded source correction cannot qualify an added legacy paper dossier');
   continue;
  }
  assert(correction.dossier,'every other named source correction retains its exact existing individual dossier boundary');
  items=items.map(row=>{if(row.id!==correction.dossier.id)return row;const {ui,...content}=row;const prior=previous(content,correction.dossier);return {...prior,...(ui?{ui}: {})};});
 }
 const expected=[...boundary.previousDossiers,...boundary.newContentDossiers];
 const signature=rows=>rows.map(row=>({id:row.id,sha256:wholeWaterReference(row)}));
 if(JSON.stringify(signature(items))===JSON.stringify(expected))return items.slice(0,286);
 const layer=boundary.qualifiedUILayer;
 assert(layer,'an unqualified UI change has no historical inverse');
 assert.equal(layer.routes.length,288);assert.equal(new Set(layer.routes.map(row=>row.id)).size,288);
 assert.equal(layer.currentTemplate.build,layer.build);
 const routes=new Map(layer.routes.map(row=>[row.id,row.route]));
 const restored=items.map((row,index)=>{
  assert(routes.has(row.id),'every route belongs to the exact qualified UI layer');
  assert.deepEqual(row.ui,{...layer.currentTemplate,route:routes.get(row.id)},'only the whole explicitly qualified current UI object can be projected');
  const prior=structuredClone(row);
  if(index<286)prior.ui={...layer.previousTemplate,route:routes.get(row.id)};
  else delete prior.ui;
  return prior;
 });
 assert.deepEqual(signature(restored),expected,'all286 whole prior dossiers and two exact new content-only dossiers must be recovered; no factual, route, order or partial UI change hidden');
 return restored.slice(0,286);
}
export const waterPhotosynthesisBoundary=boundary;
