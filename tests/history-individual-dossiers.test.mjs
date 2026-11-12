import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {collectInventory} from '../scripts/content-inventory.mjs';
import {validateDossierContent,validateDossier} from '../scripts/editorial-contract.mjs';
import {dossiersBeforeHistoryEvidence,historyDossierBoundary as boundary,wholeHistoryDossier} from './history-individual-dossiers-reference.mjs';
import {beforeHistoryEvidence} from './history-evidence-reference.mjs';
import {dossiersBeforeNative226} from './history-native226-source-reference.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const currentRegistry=read('content/editorial-reviews.json').dossiers,registry=dossiersBeforeNative226(currentRegistry);
const ids=['khipu','mohenjo-daro','bronze','kilwa','timbuktu','angkor','polynesia','caral','nalanda','hattusha','writing','paper','printing','rosetta','catalhoyuk','cahokia'].map(id=>'topics-history:history-'+id);
test('sixteen current individual history studies have actual content identities, meaningful sources, rights and existing reciprocal links',()=>{
 const inventory=collectInventory(),records=new Map(inventory.records.map(row=>[row.id,row])),knownIds=new Set(records.keys());
 const catalog=read('app/world-catalog.json'),previous=beforeHistoryEvidence(catalog),priorById=new Map(previous.map(t=>[t.id,t]));
 assert.equal(registry.length,300);assert.equal(boundary.addedIds.length,12);
 for(const id of ids){
  const dossier=currentRegistry.find(row=>row.id===id),record=records.get(id),topic=catalog.find(t=>'topics-history:'+t.id===id);
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
test('the two Benz source replacements preserve original teaching, complete source histories and actual dates while every current declared claim has a source',()=>{
 const layer=boundary.sourceEndpointCorrection20261109;
 assert.equal(layer.changes.length,2);assert.equal(layer.currentContentOnly.length,300);
 const catalog=read('app/world-catalog.json'),inventory=collectInventory(),records=new Map(inventory.records.map(row=>[row.id,row])),knownIds=new Set(records.keys());
 for(const change of layer.changes){
  const current=registry.find(row=>row.id===change.id),topic=catalog.find(row=>'topics-people:'+row.id===change.id);
  const content=structuredClone(current),uiLayer=boundary.qualifiedUILayer;if(uiLayer){const saved=uiLayer.routes.find(row=>row.id===current.id);assert.deepEqual(content.ui,{...uiLayer.currentTemplate,route:saved.route});if(Object.hasOwn(saved,'previousUI'))content.ui=structuredClone(saved.previousUI);else delete content.ui;}
  assert.deepEqual(content,change.after);
  assert.deepEqual(current.sources.map(row=>row.url),topic.sources.map(row=>row.url));
  assert.deepEqual(validateDossierContent(current,records.get(current.id),{knownIds}).errors,[]);
  for(const key of ['teachingDataHash','goal','explanation','example','hint','feedback','modelLimits','ageLevels','media','ui','reviewedOn','historicalSourceBeforeNative221Replacement20261106'])assert.deepEqual(content[key],change.before[key],key);
  assert(!current.sources.some(row=>row.url.includes('/patentefrauen/berthabenz/')));
  assert(change.before.sources.some(row=>row.url.includes('/patentefrauen/berthabenz/')),'the original DPMA source remains historical, never silently removed');
  assert.equal(current.sources.find(row=>row.url.includes('qm.org.qa/')).checkedOn,'2026-11-09');
 }
 assert.equal(catalog.find(row=>row.id==='person-karl_benz').sources.length,3);
 assert.equal(catalog.find(row=>row.id==='person-bertha_benz').sources.length,3);
 assert.equal(wholeHistoryDossier(dossiersBeforeHistoryEvidence(registry)),boundary.previousWholeSHA256);
});
test('the exact Benz inverse rejects mixed sources, altered old claims, old UI order, missing rows and unrelated changes',()=>{
 const changes=boundary.sourceEndpointCorrection20261109.changes;
 for(const mutate of [
  rows=>{rows[rows.findIndex(row=>row.id===changes[0].id)]=structuredClone(changes[0].before);},
  rows=>{rows.find(row=>row.id===changes[0].id).claims[1].anchor+=' unreviewed';},
  rows=>{rows.find(row=>row.id===changes[1].id).sources.reverse();},
  rows=>{rows.find(row=>row.id===changes[1].id).historicalSourceBeforeNative221Replacement20261106.claims[0].anchor+=' altered';},
  rows=>{const row=rows.find(row=>row.id===changes[0].id),ui=row.ui;delete row.ui;row.ui=ui;},
  rows=>rows.splice(rows.findIndex(row=>row.id===changes[1].id),1),
  rows=>{rows[0].example+=' unknown';},
 ]){const altered=structuredClone(registry);mutate(altered);assert.throws(()=>dossiersBeforeHistoryEvidence(altered));}
});

test('a common UI binding reverses whole key order before the two source corrections and rejects incomplete or invented bindings',()=>{
 const originalLayer=boundary.qualifiedUILayer;
 const sourceOnly=registry.map((row,i)=>{
  const copy=structuredClone(row);
  if(originalLayer){const saved=originalLayer.routes[i];assert.equal(copy.id,saved.id);assert.deepEqual(copy.ui,{...originalLayer.currentTemplate,route:saved.route});if(Object.hasOwn(saved,'previousUI'))copy.ui=structuredClone(saved.previousUI);else delete copy.ui;}
  return copy;
 });
 const template={build:'synthetic-exact-inverse-only',visible:true,search:true,back:true,offline:true,report:'Only an inverse regression, never actual UI acceptance.'};
 const routes=sourceOnly.map(row=>({id:row.id,route:'synthetic/'+row.id,...(Object.hasOwn(row,'ui')?{previousUI:structuredClone(row.ui)}:{})}));
 const bound=sourceOnly.map((row,i)=>({...structuredClone(row),ui:{...template,route:routes[i].route}}));
 try{
  boundary.qualifiedUILayer={currentTemplate:template,routes};
  assert.deepEqual(sourceOnly.map(row=>({id:row.id,sha256:wholeHistoryDossier(row)})),boundary.sourceEndpointCorrection20261109.currentContentOnly);
  assert.equal(wholeHistoryDossier(dossiersBeforeHistoryEvidence(bound)),boundary.previousWholeSHA256);
  for(const mutate of [rows=>delete rows[299].ui,rows=>{rows[0].ui.route+=' unknown';},rows=>{rows[0].ui.report+=' invented';},rows=>{rows[0].ui=structuredClone(routes[0].previousUI);},rows=>{rows[299].ui.offline=false;},rows=>{rows.find(row=>row.id===boundary.sourceEndpointCorrection20261109.changes[0].id).claims[1].anchor+=' invented';}]){const altered=structuredClone(bound);mutate(altered);assert.throws(()=>dossiersBeforeHistoryEvidence(altered));}
  const saved=routes[0].previousUI;try{routes[0].previousUI={...saved,report:saved.report+' unknown'};assert.throws(()=>dossiersBeforeHistoryEvidence(bound));}finally{routes[0].previousUI=saved;}
 }finally{if(originalLayer)boundary.qualifiedUILayer=originalLayer;else delete boundary.qualifiedUILayer;}
});

test('qualified history UI is exactly reversible and partial mixed missing routes or altered previous UI cannot borrow it',()=>{
 const layer=boundary.qualifiedUILayer;assert(layer);assert.equal(layer.routes.length,300);
 const contentOnly=registry.map((row,i)=>{const x=structuredClone(row);if(Object.hasOwn(layer.routes[i],'previousUI'))x.ui=structuredClone(layer.routes[i].previousUI);else delete x.ui;return x;});
 assert.deepEqual(contentOnly.map(row=>({id:row.id,sha256:wholeHistoryDossier(row)})),boundary.sourceEndpointCorrection20261109?.currentContentOnly??boundary.currentContentOnly);assert.equal(wholeHistoryDossier(dossiersBeforeHistoryEvidence(structuredClone(registry))),boundary.previousWholeSHA256);
 for(const mutate of[rows=>{delete rows[299].ui;},rows=>{rows[0].ui=structuredClone(layer.routes[0].previousUI);},rows=>{rows[0].ui.route+='unknown';},rows=>{rows[0].ui.report+='unqualified';},rows=>{rows[0].ui.build='unknown';},rows=>{rows[299].ui.offline=false;}]){const bad=structuredClone(registry);mutate(bad);assert.throws(()=>dossiersBeforeHistoryEvidence(bad));}
 const saved=layer.routes[0];try{layer.routes[0]={...saved,previousUI:{...saved.previousUI,report:saved.previousUI.report+' altered previous'}};assert.throws(()=>dossiersBeforeHistoryEvidence(structuredClone(registry)));}finally{layer.routes[0]=saved;}
});
