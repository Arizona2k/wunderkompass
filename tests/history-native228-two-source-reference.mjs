// Exact two-source transition after the two observed native228 access failures.
// Every earlier whole boundary remains immutable and independently reconstructible.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import repair from './fixtures/history-native228-two-source-predecessor.json' with {type:'json'};
export const native228SourceRepair=repair;
const whole=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const bytesSHA=x=>createHash('sha256').update(JSON.stringify(x,null,2)+'\n').digest('hex');
const signatures=rows=>rows.map(row=>({id:row.id,sha256:whole(row)}));

export function catalogBeforeNative228(rows){
 if(whole(rows)===repair.previousCatalogSHA256)return rows;
 assert.equal(whole(rows),repair.currentCatalogSHA256,'only the entire current or previously qualified212 topics');
 const changes=new Map(repair.topicChanges.map(c=>[c.id,c]));
 const old=rows.map(row=>{const change=changes.get(row.id);if(!change)return row;assert.deepEqual(row,change.after);return structuredClone(change.before);});
 assert.equal(bytesSHA(old),repair.previousCatalogBytesSHA256);return old;
}
export const projectNative228Catalog=rows=>whole(rows)===repair.currentCatalogSHA256?catalogBeforeNative228(rows):rows;

export function dossiersBeforeNative228(rows){
 assert.equal(rows.length,300);
 if(whole(rows)===repair.previousWholeQualifiedDossiersSHA256)return rows;
 const layer=repair.qualifiedUILayer;
 if(layer&&rows.some(row=>row.ui?.build===layer.currentTemplate.build)){
  assert.equal(layer.routes.length,300);
  rows=rows.map((row,i)=>{const route=layer.routes[i];assert.equal(row.id,route.id);assert.deepEqual(row.ui,{...layer.currentTemplate,route:route.route});const old=structuredClone(row);old.ui=structuredClone(route.previousUI);return old;});
 }
 assert.deepEqual(signatures(rows),repair.currentContentDossiers,'every whole current content record, with the exact prior bb2 UI');
 const changes=new Map(repair.dossierChanges.map(c=>[c.id,c]));
 const old=rows.map(row=>{const change=changes.get(row.id);if(!change)return row;assert.deepEqual(row,change.after);assert.deepEqual(row[change.historyField],change.before);return structuredClone(change.before);});
 assert.deepEqual(signatures(old),repair.previousQualifiedDossiers);assert.equal(whole(old),repair.previousWholeQualifiedDossiersSHA256);return old;
}
export const projectNative228Dossiers=rows=>rows.some(row=>Object.hasOwn(row,repair.dossierChanges[0].historyField)||row.ui?.build===repair.currentBuild)?dossiersBeforeNative228(rows):rows;

export function registryBeforeNative228(value){
 if(bytesSHA(value)===repair.previousRegistryBytesSHA256)return value;
 const old=structuredClone(value),layer=repair.qualifiedUILayer;
 if(layer){const field='historyEvidenceAfterNative228TechnicalUIProof20261112';assert.deepEqual(old[field],layer.registryProof);delete old[field];}
 old.dossiers=dossiersBeforeNative228(old.dossiers);
 assert.equal(bytesSHA(old),repair.previousRegistryBytesSHA256,'entire previous registry, including all top-level history and approvals');return old;
}

export function runtimeBeforeNative228(value){
 if(whole(value)===repair.previousRuntimeBoundarySignature)return value;
 assert.equal(whole(value),repair.currentRuntimeBoundarySignature,'only the entire new or previous runtime boundary');
 const old=structuredClone(value);
 for(const change of repair.runtimeChanges){let parent=old;for(const key of change.path.slice(0,-1))parent=parent[key];assert.deepEqual(parent[change.path.at(-1)],change.after);parent[change.path.at(-1)]=structuredClone(change.before);}
 assert.equal(bytesSHA(old),repair.previousRuntimeBoundarySHA256);return old;
}
export const projectNative228Runtime=value=>whole(value)===repair.currentRuntimeBoundarySignature?runtimeBeforeNative228(value):value;

export function materialBeforeNative228(value){
 if(bytesSHA(value)===repair.previousMaterialSHA256)return value;
 assert.equal(bytesSHA(value),repair.currentMaterialSHA256,'the entire current26-case source material fixture');
 const old=structuredClone(value);assert.equal(old.sources.length,26);assert.deepEqual(old.sources[10],repair.currentMaterialSources[0]);assert.deepEqual(old.sources.at(-1),repair.currentMaterialSources[1]);assert.deepEqual(old.previousTimbuktuDirectSource20261112,repair.previousDirectTimbuktuMaterial);
 old.sources[10]=structuredClone(old.previousTimbuktuDirectSource20261112);old.sources.pop();delete old.previousTimbuktuDirectSource20261112;
 assert.equal(bytesSHA(old),repair.previousMaterialSHA256,'all25 previous cases and every earlier historical source field');return old;
}

export function native228ProjectedBoundary(previous){
 assert.equal(bytesSHA(previous),repair.previousProjectedNative226BoundarySHA256,'whole earlier Native227-projected boundary');
 const current=structuredClone(previous);current.currentBuild=repair.currentBuild;current.currentCatalogSHA256=repair.currentCatalogSHA256;
 current.currentInputs=structuredClone(repair.runtimeChanges.find(c=>c.path.length===1&&c.path[0]==='currentInputs').after);current.currentContentDossiers=structuredClone(repair.currentContentDossiers);
 for(const change of repair.topicChanges){const row=current.topicChanges.find(c=>c.id===change.id);assert(row);assert.deepEqual(row.after,change.before);row.after=structuredClone(change.after);}
 for(const change of repair.dossierChanges){const row=current.dossierChanges.find(c=>c.id===change.id);assert(row);assert.deepEqual({...row.after,ui:change.before.ui},change.before);row.after=structuredClone(change.after);}
 if(repair.qualifiedUILayer)current.qualifiedUILayer=structuredClone(repair.qualifiedUILayer);else delete current.qualifiedUILayer;
 return current;
}
