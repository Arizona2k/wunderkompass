// One exact later source repair; the entire previously qualified boundary stays unchanged.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import repair from './fixtures/history-native227-timbuktu-source-predecessor.json' with {type:'json'};
export const native227TimbuktuRepair=repair;
const whole=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const bytesSHA=x=>createHash('sha256').update(JSON.stringify(x,null,2)+'\n').digest('hex');
const signatures=rows=>rows.map(r=>({id:r.id,sha256:whole(r)}));

export function catalogBeforeNative227Timbuktu(rows){
 const hash=whole(rows);if(hash===repair.previousCatalogSHA256)return rows;
 assert.equal(hash,repair.currentCatalogSHA256,'only the exact whole current or previous212 topics');
 const old=rows.map(row=>{if(row.id!==repair.topicAfter.id)return row;assert.deepEqual(row,repair.topicAfter);return structuredClone(repair.topicBefore);});
 assert.equal(whole(old),repair.previousCatalogSHA256);assert.equal(bytesSHA(old),repair.previousCatalogBytesSHA256);return old;
}
export const projectNative227Catalog=rows=>whole(rows)===repair.currentCatalogSHA256?catalogBeforeNative227Timbuktu(rows):rows;

export function dossiersBeforeNative227Timbuktu(rows){
 assert.equal(rows.length,300);
 if(whole(rows)===repair.previousWholeQualifiedDossiersSHA256)return rows;
 const layer=repair.qualifiedUILayer;
 if(layer&&rows.some(r=>r.ui?.build===layer.currentTemplate.build)){
  assert.equal(layer.routes.length,300);
  rows=rows.map((row,i)=>{const route=layer.routes[i];assert.equal(row.id,route.id);assert.deepEqual(row.ui,{...layer.currentTemplate,route:route.route});const old=structuredClone(row);old.ui=structuredClone(route.previousUI);return old;});
 }
 assert.deepEqual(signatures(rows),repair.currentContentDossiers,'every current whole record before the later technical UI');
 const old=rows.map(row=>{if(row.id!==repair.dossierAfter.id)return row;assert.deepEqual(row,repair.dossierAfter);return structuredClone(repair.dossierBefore);});
 assert.deepEqual(signatures(old),repair.previousQualifiedDossiers);assert.equal(whole(old),repair.previousWholeQualifiedDossiersSHA256);return old;
}
export const projectNative227Dossiers=rows=>rows.some(r=>r.id===repair.dossierAfter.id&&Object.hasOwn(r,'sourceAccessCheck20261112'))?dossiersBeforeNative227Timbuktu(rows):rows;

export function runtimeBeforeNative227Timbuktu(value){
 const hash=whole(value);if(hash===repair.previousRuntimeBoundarySignature)return value;
 assert.equal(hash,repair.currentRuntimeBoundarySignature,'only the exact whole new or previous runtime boundary');
 const old=structuredClone(value);
 for(const change of repair.runtimeChanges){let parent=old;for(const key of change.path.slice(0,-1))parent=parent[key];assert.deepEqual(parent[change.path.at(-1)],change.after);parent[change.path.at(-1)]=structuredClone(change.before);}
 assert.equal(whole(old),repair.previousRuntimeBoundarySignature);assert.equal(bytesSHA(old),repair.previousRuntimeBoundarySHA256);return old;
}
export const projectNative227Runtime=value=>whole(value)===repair.currentRuntimeBoundarySignature?runtimeBeforeNative227Timbuktu(value):value;

export function materialBeforeNative227Timbuktu(value){
 if(bytesSHA(value)===repair.previousMaterialSHA256)return value;
 const old=structuredClone(value);assert.equal(old.sources.length,25);assert.deepEqual(old.sources[10],repair.currentMaterialSource);assert.deepEqual(old.previousTimbuktuArchivedSource20261112,repair.previousMaterialSource);old.sources[10]=structuredClone(old.previousTimbuktuArchivedSource20261112);delete old.previousTimbuktuArchivedSource20261112;
 assert.equal(bytesSHA(old),repair.previousMaterialSHA256,'the entire earlier25 sources and strict historical JSON record');return old;
}

export function native227ProjectedBoundary(previous){
 assert.equal(bytesSHA(previous),repair.previousNative226BoundarySHA256,'unchanged whole qualified Native226 boundary');
 const current=structuredClone(previous);
 current.currentBuild=repair.currentBuild;current.currentCatalogSHA256=repair.currentCatalogSHA256;
 current.currentInputs=structuredClone(repair.runtimeChanges.find(r=>r.path.length===1&&r.path[0]==='currentInputs').after);
 current.currentContentDossiers=structuredClone(repair.currentContentDossiers);
 const t=current.topicChanges.find(r=>r.id===repair.topicAfter.id),d=current.dossierChanges.find(r=>r.id===repair.dossierAfter.id);assert(t&&d);t.after=structuredClone(repair.topicAfter);d.after=structuredClone(repair.dossierAfter);
 if(repair.qualifiedUILayer)current.qualifiedUILayer=structuredClone(repair.qualifiedUILayer);else delete current.qualifiedUILayer;
 return current;
}

// Explicitly distinguish unchanged prior qualified UI from a newly qualified layer.
export function assertNative227SourceUI(actual,previous,layer,priorLayer,currentBuild){
 if(layer===null){assert.deepEqual(actual.ui,previous.ui);return;}
 let oldUI=actual.ui;
 if(layer){
  assert.equal(layer.currentTemplate.build,currentBuild);const route=layer.routes.find(r=>r.id===actual.id);assert(route);assert.deepEqual(actual.ui,{...layer.currentTemplate,route:route.route});oldUI=route.previousUI;
  // The original unit countercases construct an explicit one-layer transition.
  if(JSON.stringify(oldUI)===JSON.stringify(previous.ui))return;
 }
 assert.equal(priorLayer.currentTemplate.build,repair.previousBuild);
 const route=priorLayer.routes.find(r=>r.id===actual.id);assert(route);
 assert.deepEqual(oldUI,{...priorLayer.currentTemplate,route:route.route},'only the entire earlier qualified8c UI, never new approval');
 assert.deepEqual(route.previousUI,previous.ui,'preserve the entire still earlier UI');
}
