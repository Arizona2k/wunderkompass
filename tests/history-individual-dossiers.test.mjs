import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {collectInventory} from '../scripts/content-inventory.mjs';
import {validateDossierContent,validateDossier} from '../scripts/editorial-contract.mjs';
import {dossiersBeforeHistoryEvidence,historyDossierBoundary as boundary,wholeHistoryDossier} from './history-individual-dossiers-reference.mjs';
import {beforeHistoryEvidence} from './history-evidence-reference.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const registry=read('content/editorial-reviews.json').dossiers;
const ids=['khipu','mohenjo-daro','bronze','kilwa','timbuktu','angkor','polynesia','caral','nalanda','hattusha','writing','paper','printing','rosetta','catalhoyuk','cahokia'].map(id=>'topics-history:history-'+id);
test('sixteen current individual history studies have actual content identities, meaningful sources, rights and existing reciprocal links',()=>{
 const inventory=collectInventory(),records=new Map(inventory.records.map(row=>[row.id,row])),knownIds=new Set(records.keys());
 const catalog=read('app/world-catalog.json'),previous=beforeHistoryEvidence(catalog),priorById=new Map(previous.map(t=>[t.id,t]));
 assert.equal(registry.length,300);assert.equal(boundary.addedIds.length,12);
 for(const id of ids){
  const dossier=registry.find(row=>row.id===id),record=records.get(id),topic=catalog.find(t=>'topics-history:'+t.id===id);
  assert(dossier&&record&&topic,id);assert.deepEqual(validateDossierContent(dossier,record,{knownIds}).errors,[],id);
  assert.deepEqual(dossier.sources.map(source=>source.url).sort(),topic.sources.map(source=>source.url).sort(),id+' exact actually linked source set');
  assert.equal(dossier.aiSelfReview.dataHash,record.dataHash);
  assert(dossier.claims.length>=2,id+' individually anchored claims');
  for(const asset of dossier.media){assert.equal(createHash('sha256').update(fs.readFileSync(asset.path)).digest('hex'),asset.sha256,id+' whole actual medium');}
  for(const other of topic.related){
   const reciprocal=catalog.find(t=>t.id===other).related.includes(topic.id);
   if(!reciprocal){assert(priorById.get(topic.id)?.related.includes(other),'only an exact existing one-way link can remain historical');assert(!priorById.get(other)?.related.includes(topic.id),'no existing reciprocal link may be lost');}
  }
  assert.equal(validateDossier(dossier,record,{knownIds,build:'not-actually-qualified'}).structurallyReady,false,'content structure alone never invents current UI proof');
 }
});
test('all30 new explained graph edges have genuine reciprocal article links, including Rosetta/Hattusha and Çatalhöyük/tools',()=>{
 const catalog=new Map(read('app/world-catalog.json').map(t=>[t.id,t])),graph=read('app/world-connections.json');
 assert.equal(graph.connections.length,226);const added=graph.connections.slice(196);assert.equal(added.length,30);
 for(const edge of added){assert(catalog.get(edge.fromId).related.includes(edge.toId),edge.id);assert(catalog.get(edge.toId).related.includes(edge.fromId),edge.id);assert(edge.why.length>60);}
 for(const [a,b]of[['history-rosetta','history-hattusha'],['history-catalhoyuk','history-stone_tools']])assert(added.some(e=>e.fromId===a&&e.toId===b));
});
test('all288 whole factual and UI predecessors are recovered exactly with nested histories retained',()=>{
 const restored=dossiersBeforeHistoryEvidence(registry);assert.equal(restored.length,288);
 assert.equal(wholeHistoryDossier(restored),boundary.previousWholeSHA256);
 assert.deepEqual(dossiersBeforeHistoryEvidence(structuredClone(restored)),restored);
});
test('missing, mixed, reordered, unknown, altered sources, media and nested histories cannot obtain the editorial predecessor',()=>{
 for(const mutate of[
  rows=>rows.pop(),rows=>rows.push(structuredClone(rows[0])),rows=>rows.reverse(),
  rows=>{rows[0].explanation+=' unreviewed';},
  rows=>{rows.find(row=>row.id===ids[0]).sources[0].url='https://example.com/unreviewed';},
  rows=>{rows.find(row=>row.id===ids[0]).media[0].sha256='0'.repeat(64);},
  rows=>{rows.find(row=>row.id===ids[0])[boundary.historyField].goal+=' altered history';},
  rows=>{delete rows.find(row=>row.id===ids[0])[boundary.historyField];},
  rows=>{rows.find(row=>row.id===ids[0]).ui={build:'invented',visible:true,search:true,back:true,offline:true};},
  rows=>{rows[299].id='unknown';},
 ]){const changed=structuredClone(registry);mutate(changed);assert.throws(()=>dossiersBeforeHistoryEvidence(changed));}
});
