// Exact named M94 predecessor only. Unknown or mixed current objects fail closed.
import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import fixture from './fixtures/history-evidence-M94-predecessor.json' with {type:'json'};
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
export function graphBeforeHistoryEvidence(graph){if(graph.connections.length!==224)return graph;assert.equal(wholeHistoryEvidence(graph),fixture.currentGraphSHA256);const prior={...graph,connections:graph.connections.slice(0,196)};assert.equal(wholeHistoryEvidence(prior),fixture.previousGraphSHA256);return prior;}
