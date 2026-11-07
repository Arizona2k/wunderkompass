// Exact historical source/UI inverse; actual qualification is recorded in the named boundary.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import boundary from './fixtures/water-photosynthesis-M93-data-predecessor.json' with {type:'json'};

export const wholeWaterReference=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const topics=new Map(boundary.topics.map(row=>[row.id,row]));
const questions=new Map(boundary.bankChanges.map(row=>[row.id,row]));
function previous(value,row){
 if(!row||wholeWaterReference(value)===wholeWaterReference(row.before))return value;
 assert.deepEqual(value,row.after,'only the entire reviewed water/photosynthesis object has a historical predecessor: '+value.id);
 return structuredClone(row.before);
}
export const topicBeforeWaterPhotosynthesis=topic=>previous(topic,topics.get(topic.id));
export function beforeWaterPhotosynthesis(items){
 if(items.some(row=>Object.hasOwn(row,'category')&&Object.hasOwn(row,'paragraphs'))){
  if(items.some(row=>topics.has(row.id)&&wholeWaterReference(row)===wholeWaterReference(topics.get(row.id).after)))assert.equal(items.length,204,'a current water/photosynthesis catalog must retain all204 identities');
  if(items.length===204){const hash=wholeWaterReference(items);assert([boundary.previousCatalogSHA256,boundary.currentCatalogSHA256].includes(hash),'all204 whole topics, including every unrelated field, must match the reviewed boundary');}
  return items.map(topicBeforeWaterPhotosynthesis);
 }
 return items.map(row=>previous(row,questions.get(row.id)));
}
export function thinkingBeforeWaterPhotosynthesis(thinking){
 if(wholeWaterReference(thinking)===wholeWaterReference(boundary.previousThinking))return thinking;
 assert.equal(wholeWaterReference(thinking),boundary.currentThinkingSHA256,'all25 whole authored inquiry entries must match before historical projection');
 return structuredClone(boundary.previousThinking);
}
export function dossiersBeforeWaterPhotosynthesis(items){
 if(items.length<=286)return items;
 assert.equal(items.length,288,'only two named individual dossiers were added');
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
