// Exact named M94 predecessor only. Unknown or mixed current objects fail closed.
import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import fixture from './fixtures/history-evidence-M94-predecessor.json' with {type:'json'};
import {normalConcept} from '../scripts/content-inventory.mjs';
export const historyEvidenceBoundary=fixture;
export const wholeHistoryEvidence=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const oldTopics=new Map(fixture.changedTopics.map(r=>[r.id,r])),newTopics=new Set(fixture.newTopics.map(r=>r.id)),oldQuestions=new Map(fixture.changedQuestions.map(r=>[r.id,r])),newQuestions=new Set(fixture.newQuestions.map(r=>r.id));
export function topicBeforeHistoryEvidence(topic){const row=oldTopics.get(topic.id);if(!row||wholeHistoryEvidence(topic)===wholeHistoryEvidence(row.before))return topic;assert.deepEqual(topic,row.after,'only the whole individually selected history/relationship replacement has a predecessor: '+topic.id);return structuredClone(row.before);}
export function beforeHistoryEvidence(items){
 if(items.some(row=>Object.hasOwn(row,'category')&&Object.hasOwn(row,'paragraphs'))){
  if(items.length!==212&&!items.some(row=>newTopics.has(row.id)))return items;
  assert.equal(wholeHistoryEvidence(items),fixture.currentCatalogSHA256,'all212 whole current topics, their identities and order');
  const prior=items.filter(row=>!newTopics.has(row.id)).map(topicBeforeHistoryEvidence);assert.equal(wholeHistoryEvidence(prior),fixture.previousCatalogSHA256,'exact whole204 accepted M94 topics');return prior;
 }
 if(items.length!==274&&!items.some(row=>newQuestions.has(row.id)))return items;
 assert.equal(wholeHistoryEvidence(items),fixture.currentBankSHA256,'all274 current questions including hints and every unchanged descriptor');
 const prior=items.filter(row=>!newQuestions.has(row.id)).map(row=>{const change=oldQuestions.get(row.id);if(!change)return row;assert.deepEqual(row,change.after);return structuredClone(change.before);});assert.equal(wholeHistoryEvidence(prior),fixture.previousBankSHA256,'exact whole240 accepted M94 questions');return prior;
}
export function graphBeforeHistoryEvidence(graph){if(graph.connections.length!==226)return graph;assert.equal(wholeHistoryEvidence(graph),fixture.currentGraphSHA256);const prior={...graph,connections:graph.connections.slice(0,196)};assert.equal(wholeHistoryEvidence(prior),fixture.previousGraphSHA256);return prior;}
export function inventoryBeforeHistoryEvidence(inventory){
 const added=new Set(fixture.newTopics.map(t=>'topics-'+t.category+':'+t.id));
 if(!inventory.records.some(row=>added.has(row.id)))return inventory;
 const priorTopics=new Map(fixture.changedTopics.map(row=>['topics-'+row.before.category+':'+row.id,row]));
 const currentTopics=inventory.records.filter(row=>row.family?.startsWith('topics-'));
 assert.equal(currentTopics.length,212,'all current whole inventory topic identities before historical projection');
 const original=JSON.parse(fixture.replacedInputs.find(row=>row.file==='app/world-catalog.json').originalUTF8);
 const changes=new Map(fixture.changedTopics.map(row=>[row.id,row.after]));
 const actual=[...original.map(topic=>changes.get(topic.id)??topic),...fixture.newTopics];
 assert.equal(wholeHistoryEvidence(actual),fixture.currentCatalogSHA256);
 const expected=new Map(actual.map(topic=>['topics-'+topic.category+':'+topic.id,topic]));
 assert.equal(new Set(currentTopics.map(row=>row.id)).size,212);
 for(const row of currentTopics){const topic=expected.get(row.id);assert(topic,'no unknown topic hidden by inventory reconstruction');assert.equal(row.dataHash,wholeHistoryEvidence(topic),row.id+' whole inventory content');assert.equal(row.title,topic.title);assert.equal(row.conceptKey,normalConcept(topic.title));}
 const records=inventory.records.filter(row=>!added.has(row.id)).map(row=>{
  const changed=priorTopics.get(row.id);if(!changed)return row;
  assert.equal(row.dataHash,wholeHistoryEvidence(changed.after),row.id+' exact current topic identity');
  assert.equal(row.title,changed.after.title);assert.equal(row.conceptKey,normalConcept(changed.after.title));
  return{...row,dataHash:wholeHistoryEvidence(changed.before),title:changed.before.title,conceptKey:normalConcept(changed.before.title)};
 });
 const families=inventory.families.map(f=>f.id==='topics-history'?{...f,count:f.count-8}:f);
 assert.equal(families.find(f=>f.id==='topics-history').count,34);
 return{...inventory,records,families,inventoryFingerprint:wholeHistoryEvidence(records.map(r=>[r.id,r.dataHash]))};
}
export function photosBeforeHistoryEvidence(photos){
 if(!Object.keys(photos).some(id=>fixture.newPhotoIds.includes(id)))return photos;
 assert.equal(wholeHistoryEvidence(photos),fixture.currentPhotosSHA256,'all74 whole current source, rights, credit and image identities');
 const prior=Object.fromEntries(Object.entries(photos).filter(([id])=>!fixture.newPhotoIds.includes(id)));
 assert.equal(wholeHistoryEvidence(prior),fixture.previousPhotosSHA256,'every whole60 original photo record');return prior;
}
export function photoIdsBeforeHistoryEvidence(ids){return ids.filter(id=>!fixture.newPhotoIds.includes(id));}
