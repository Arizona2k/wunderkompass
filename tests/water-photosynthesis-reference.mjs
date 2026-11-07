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
 assert.deepEqual(items.map(row=>({id:row.id,sha256:wholeWaterReference(row)})),expected,'all286 whole M93 dossiers and the two exact new content-only dossiers, without invented current UI');
 return items.slice(0,286);
}
export const waterPhotosynthesisBoundary=boundary;
