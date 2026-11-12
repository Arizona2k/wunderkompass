// Exact source repair after the completed native226 failure. Never qualify mixed revisions.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import boundary from './fixtures/history-native226-source-predecessor.json' with {type:'json'};
import {native227ProjectedBoundary,projectNative227Catalog,projectNative227Dossiers,projectNative227Runtime} from './history-native227-timbuktu-source-reference.mjs';
export const native226SourceBoundary=native227ProjectedBoundary(boundary);
const native227PreviousCatalogSHA256=boundary.currentCatalogSHA256;
export const wholeNative226=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const signature=rows=>rows.map(row=>({id:row.id,sha256:wholeNative226(row)}));
export function runtimeBodyBeforeNative226(file,body){
 const repair=boundary.additionalRuntimeRepairs20261110?.find(row=>row.file===file);
 if(!repair)return body;
 const before=Buffer.from(repair.beforeUTF8),after=Buffer.from(repair.afterUTF8??(()=>{assert.equal(repair.file,'app/science-thinking.json');assert.equal(repair.beforeUTF8.split(repair.exactReplacement.before).length,2);return repair.beforeUTF8.replace(repair.exactReplacement.before,repair.exactReplacement.after);})()),hash=b=>createHash('sha256').update(b).digest('hex');
 assert.equal(hash(before),repair.beforeSHA256);assert.equal(hash(after),repair.afterSHA256);
 assert(Buffer.from(body).equals(before)||Buffer.from(body).equals(after),'only the entire named historical/runtime text-wrap pair');
 return before;
}
export function catalogBeforeNative226(rows){
 rows=projectNative227Catalog(rows);
 assert.equal(rows.length,212,'all212 whole topics before source-repair inversion');
 const hash=wholeNative226(rows);
 if(hash===boundary.previousCatalogSHA256)return rows;
 assert.equal(hash,boundary.currentCatalogSHA256,'only the entire current source-corrected catalog');
 const changes=new Map(boundary.topicChanges.map(row=>[row.id,row]));
 const old=rows.map(row=>{const change=changes.get(row.id);if(!change)return row;assert.deepEqual(row,change.after);return structuredClone(change.before);});
 assert.equal(wholeNative226(old),boundary.previousCatalogSHA256,'whole original212 before source repair');return old;
}
export function dossiersBeforeNative226(rows){
 rows=projectNative227Dossiers(rows);
 const containsRepair=rows.some(row=>Object.hasOwn(row,boundary.historyField)||row.ui?.build===boundary.currentBuild);
 if(rows.length<=288&&!containsRepair)return rows;
 assert.equal(rows.length,300,'all300 whole records before source-repair inversion');
 if(wholeNative226(rows)===boundary.previousWholeDossiersSHA256)return rows;
 // Earlier exact inverse tests bind their own synthetic UI layer. Their original
 // strict historical validator below still checks every whole old record.
 if(!containsRepair)return rows;
 const layer=boundary.qualifiedUILayer;
 if(layer&&rows.some(row=>row.ui?.build===layer.currentTemplate.build)){
  assert.equal(layer.routes.length,300);
  rows=rows.map((row,i)=>{const route=layer.routes[i];assert.equal(row.id,route.id);assert.deepEqual(row.ui,{...layer.currentTemplate,route:route.route});const copy=structuredClone(row);assert(Object.hasOwn(route,'previousUI'));copy.ui=structuredClone(route.previousUI);return copy;});
 }
 assert.deepEqual(signature(rows),boundary.currentContentDossiers,'every whole source-corrected record, including original histories');
 const changes=new Map(boundary.dossierChanges.map(row=>[row.id,row]));
 const old=rows.map(row=>{const change=changes.get(row.id);if(!change)return row;assert.deepEqual(row,change.after);assert.deepEqual(row[change.historyField??boundary.historyField],change.before);return structuredClone(change.before);});
 assert.deepEqual(signature(old),boundary.previousDossiers);assert.equal(wholeNative226(old),boundary.previousWholeDossiersSHA256);return old;
}

// The additional source replacement preserves the exact whole previous Native/Home boundary.
export function boundaryBeforeHattushaSourceReplacement(){
 const boundary=boundaryBeforeCaralSourceReplacement();
 const layer=boundary.additionalSourceRepair20261111;assert(layer);assert.equal(layer.previousBoundarySHA256,'ccd00731686b04a43397fe689b4b41f68402bf9696ce4feed49c46ff28a4ff52');
 const previous=structuredClone(boundary);delete previous.additionalSourceRepair20261111;
 const expected=[['currentBuild'],['currentCatalogSHA256'],['currentInputs'],['currentContentDossiers'],['topicChanges',9],['dossierChanges',9],['qualifiedUILayer']];assert.deepEqual(layer.previousValues.map(x=>x.path),expected);
 for(const item of layer.previousValues){let parent=previous;for(const key of item.path.slice(0,-1))parent=parent[key];if(item.present)parent[item.path.at(-1)]=structuredClone(item.value);else delete parent[item.path.at(-1)];}
 assert.equal(createHash('sha256').update(JSON.stringify(previous,null,2)+'\n').digest('hex'),layer.previousBoundarySHA256,'every byte of the whole previous Native/Home boundary');return previous;
}
export function catalogBeforeHattushaSourceReplacement(rows){
 rows=catalogBeforeCaralSourceReplacement(rows);const boundary=boundaryBeforeCaralSourceReplacement();
 const previous=boundaryBeforeHattushaSourceReplacement();if(wholeNative226(rows)===previous.currentCatalogSHA256)return rows;assert.equal(wholeNative226(rows),boundary.currentCatalogSHA256);
 const before=previous.topicChanges.find(x=>x.id==='history-hattusha').after,after=boundary.topicChanges.find(x=>x.id==='history-hattusha').after;
 const old=rows.map(row=>{if(row.id!=='history-hattusha')return row;assert.deepEqual(row,after);return structuredClone(before);});assert.equal(wholeNative226(old),previous.currentCatalogSHA256);return old;
}
export function dossiersBeforeHattushaSourceReplacement(rows){
 rows=dossiersBeforeCaralSourceReplacement(rows);const boundary=boundaryBeforeCaralSourceReplacement();
 const previous=boundaryBeforeHattushaSourceReplacement(),layer=boundary.qualifiedUILayer;assert.equal(rows.length,300);
 if(layer&&rows.some(row=>row.ui?.build===layer.currentTemplate.build)){assert.equal(layer.routes.length,300);rows=rows.map((row,i)=>{const route=layer.routes[i];assert.equal(row.id,route.id);assert.deepEqual(row.ui,{...layer.currentTemplate,route:route.route});const copy=structuredClone(row);assert(Object.hasOwn(route,'previousUI'));copy.ui=structuredClone(route.previousUI);return copy;});}
 if(JSON.stringify(signature(rows))===JSON.stringify(previous.currentContentDossiers))return rows;assert.deepEqual(signature(rows),boundary.currentContentDossiers);
 const before=previous.dossierChanges.find(x=>x.id==='topics-history:history-hattusha').after,key=boundary.additionalSourceRepair20261111.previousDossierField;
 const old=rows.map(row=>{if(row.id!=='topics-history:history-hattusha')return row;assert.deepEqual(row[key],before);return structuredClone(before);});assert.deepEqual(signature(old),previous.currentContentDossiers);return old;
}

// Preserve the entire last JMU/Home boundary before the Caral link change.
const restoreCaralValues=(value,values)=>{const old=structuredClone(value);for(const item of values){let p=old;for(const k of item.path.slice(0,-1))p=p[k];if(item.present)p[item.path.at(-1)]=structuredClone(item.value);else delete p[item.path.at(-1)];}return old;};
export function boundaryBeforeCaralSourceReplacement(){
 const boundary=boundaryBeforeKewSourceReplacement();
 const layer=boundary.caralSourceRepair20261111;assert(layer);assert.equal(layer.previousBoundarySHA256,'70e8a3594eb37f78beb304539f3990ac1f2be1d5ec1f5a251af6eee316799428');assert.deepEqual(layer.previousValues.map(v=>v.path),[["currentBuild"],["currentCatalogSHA256"],["currentInputs"],["currentContentDossiers"],["topicChanges",7],["dossierChanges",7],["qualifiedUILayer"]]);
 const old=restoreCaralValues(boundary,layer.previousValues);delete old.caralSourceRepair20261111;assert.equal(createHash('sha256').update(JSON.stringify(old,null,2)+'\n').digest('hex'),layer.previousBoundarySHA256);return old;
}
export function catalogBeforeCaralSourceReplacement(rows){
 rows=[native226SourceBoundary.currentCatalogSHA256,native227PreviousCatalogSHA256,boundaryBeforeHumboldtSourceReplacement().currentCatalogSHA256].includes(wholeNative226(rows))?catalogBeforeKewSourceReplacement(rows):rows;const boundary=boundaryBeforeKewSourceReplacement();
 const prior=boundaryBeforeCaralSourceReplacement();if(wholeNative226(rows)===prior.currentCatalogSHA256)return rows;assert.equal(wholeNative226(rows),boundary.currentCatalogSHA256);const before=prior.topicChanges.find(x=>x.id==='history-caral').after,after=boundary.topicChanges.find(x=>x.id==='history-caral').after;const old=rows.map(r=>{if(r.id!=='history-caral')return r;assert.deepEqual(r,after);return structuredClone(before);});assert.equal(wholeNative226(old),prior.currentCatalogSHA256);return old;
}
export function dossiersBeforeCaralSourceReplacement(rows){
 rows=rows.some(r=>Object.hasOwn(r,"individualDossierBeforeKewSourceReplacement20261111")||(native226SourceBoundary.qualifiedUILayer&&r.ui?.build===native226SourceBoundary.qualifiedUILayer.currentTemplate.build))?dossiersBeforeKewSourceReplacement(rows):rows;const boundary=boundaryBeforeKewSourceReplacement();
 const prior=boundaryBeforeCaralSourceReplacement(),layer=boundary.qualifiedUILayer;assert.equal(rows.length,300);if(layer&&rows.some(r=>r.ui?.build===layer.currentTemplate.build)){assert.equal(layer.routes.length,300);rows=rows.map((r,i)=>{const route=layer.routes[i];assert.equal(r.id,route.id);assert.deepEqual(r.ui,{...layer.currentTemplate,route:route.route});const copy=structuredClone(r);assert(Object.hasOwn(route,'previousUI'));copy.ui=structuredClone(route.previousUI);return copy;});}
 if(JSON.stringify(signature(rows))===JSON.stringify(prior.currentContentDossiers))return rows;assert.deepEqual(signature(rows),boundary.currentContentDossiers);const before=prior.dossierChanges.find(x=>x.id==='topics-history:history-caral').after;const old=rows.map(r=>{if(r.id!=='topics-history:history-caral')return r;assert.deepEqual(r[boundary.caralSourceRepair20261111.previousDossierField],before);return structuredClone(before);});assert.deepEqual(signature(old),prior.currentContentDossiers);return old;
}
export function runtimeBoundaryBeforeCaralSourceReplacement(value){
 value=projectNative227Runtime(value);value=wholeNative226(value)===native226SourceBoundary.humboldtSourceRepair20261111.currentRuntimeBoundarySignature?runtimeBoundaryBeforeHumboldtSourceReplacement(value):value;value=wholeNative226(value)===native226SourceBoundary.kewSourceRepair20261111.currentRuntimeBoundarySignature?runtimeBoundaryBeforeKewSourceReplacement(value):value;const layer=boundaryBeforeKewSourceReplacement().caralSourceRepair20261111;const observed=wholeNative226(value);if(observed===layer.previousRuntimeBoundarySignature)return value;assert.equal(observed,layer.currentRuntimeBoundarySignature,'only the whole known current or previous runtime boundary');assert.deepEqual(layer.previousRuntimeValues.map(v=>v.path),[["currentRuntimeBuild"],["currentInputs"],["currentCatalogSHA256"],["newTopics",2],["replacedInputs",14,"currentBytes"],["replacedInputs",14,"currentSHA256"]]);const old=restoreCaralValues(value,layer.previousRuntimeValues);assert.equal(createHash('sha256').update(JSON.stringify(old,null,2)+'\n').digest('hex'),layer.previousRuntimeBoundarySHA256);return old;}

// Exact whole prior Caral6615 candidate before the single Kew source replacement.
export function boundaryBeforeKewSourceReplacement(){
 const boundary=boundaryBeforeHumboldtSourceReplacement();
 const layer=boundary.kewSourceRepair20261111;assert(layer);assert.equal(layer.previousBoundarySHA256,'a5b0406334d0b8dbb0604aeedfa9a632549dbc98c3f9ee3ce751be86f723b384');assert.deepEqual(layer.previousValues.map(v=>v.path),[["currentBuild"],["currentCatalogSHA256"],["currentInputs"],["currentContentDossiers"],["qualifiedUILayer"]]);const old=restoreCaralValues(boundary,layer.previousValues);delete old.kewSourceRepair20261111;
 for(const [key,n,id]of[['topicChanges',layer.previousCounts.topicChanges,'science-photosynthesis'],['dossierChanges',layer.previousCounts.dossierChanges,'topics-science:science-photosynthesis'],['additionalRuntimeRepairs20261110',layer.previousCounts.runtimeRepairs,'app/science-thinking.json']]){assert.equal(old[key].length,n+1);assert.equal(old[key].at(-1).id??old[key].at(-1).file,id);old[key].pop();}
 assert.equal(createHash('sha256').update(JSON.stringify(old,null,2)+'\n').digest('hex'),layer.previousBoundarySHA256);return old;
}
export function catalogBeforeKewSourceReplacement(rows){
 rows=[native226SourceBoundary.currentCatalogSHA256,native227PreviousCatalogSHA256].includes(wholeNative226(rows))?catalogBeforeHumboldtSourceReplacement(rows):rows;const boundary=boundaryBeforeHumboldtSourceReplacement();
 const before=boundaryBeforeKewSourceReplacement();if(wholeNative226(rows)===before.currentCatalogSHA256)return rows;assert.equal(wholeNative226(rows),boundary.currentCatalogSHA256);const change=boundary.topicChanges.at(-1);assert.equal(change.id,'science-photosynthesis');const old=rows.map(r=>{if(r.id!==change.id)return r;assert.deepEqual(r,change.after);return structuredClone(change.before);});assert.equal(wholeNative226(old),before.currentCatalogSHA256);return old;
}
export function dossiersBeforeKewSourceReplacement(rows){
 rows=rows.some(r=>Object.hasOwn(r,"individualDossierBeforeHumboldtSourceReplacement20261111")||(native226SourceBoundary.qualifiedUILayer&&r.ui?.build===native226SourceBoundary.qualifiedUILayer.currentTemplate.build))?dossiersBeforeHumboldtSourceReplacement(rows):rows;const boundary=boundaryBeforeHumboldtSourceReplacement();
 const before=boundaryBeforeKewSourceReplacement(),layer=boundary.qualifiedUILayer;assert.equal(rows.length,300);if(layer&&rows.some(r=>r.ui?.build===layer.currentTemplate.build)){assert.equal(layer.routes.length,300);rows=rows.map((r,i)=>{const route=layer.routes[i];assert.equal(r.id,route.id);assert.deepEqual(r.ui,{...layer.currentTemplate,route:route.route});const copy=structuredClone(r);assert(Object.hasOwn(route,'previousUI'));copy.ui=structuredClone(route.previousUI);return copy;});}
 if(JSON.stringify(signature(rows))===JSON.stringify(before.currentContentDossiers))return rows;assert.deepEqual(signature(rows),boundary.currentContentDossiers);const change=boundary.dossierChanges.at(-1);assert.equal(change.id,'topics-science:science-photosynthesis');const old=rows.map(r=>{if(r.id!==change.id)return r;assert.deepEqual(r[change.historyField],change.before);return structuredClone(change.before);});assert.deepEqual(signature(old),before.currentContentDossiers);return old;
}
export function runtimeBoundaryBeforeKewSourceReplacement(value){
 value=projectNative227Runtime(value);
 value=wholeNative226(value)===native226SourceBoundary.humboldtSourceRepair20261111.currentRuntimeBoundarySignature?runtimeBoundaryBeforeHumboldtSourceReplacement(value):value;const boundary=boundaryBeforeHumboldtSourceReplacement();
 const layer=boundary.kewSourceRepair20261111,observed=wholeNative226(value);if(observed===layer.previousRuntimeBoundarySignature)return value;assert.equal(observed,layer.currentRuntimeBoundarySignature,'only the entire actual current or previous runtime boundary');assert.deepEqual(layer.previousRuntimeValues.map(v=>v.path),[["currentRuntimeBuild"],["currentInputs"],["currentCatalogSHA256"],["replacedInputs",14,"currentBytes"],["replacedInputs",14,"currentSHA256"]]);const old=restoreCaralValues(value,layer.previousRuntimeValues);assert.equal(old.changedTopics.length,layer.previousCounts.runtimeTopics+1);assert.equal(old.changedTopics.at(-1).id,'science-photosynthesis');old.changedTopics.pop();assert.equal(old.replacedInputs.length,layer.previousCounts.runtimeInputs+1);assert.equal(old.replacedInputs.at(-1).file,'app/science-thinking.json');old.replacedInputs.pop();assert.equal(createHash('sha256').update(JSON.stringify(old,null,2)+'\n').digest('hex'),layer.previousRuntimeBoundarySHA256);return old;
}

// Exact whole current/pre-source inquiry objects, including every unchanged entry.
export function thinkingBeforeKewSourceReplacement(value){
 const repair=boundary.additionalRuntimeRepairs20261110.find(r=>r.file==='app/science-thinking.json');assert(repair&&repair.exactReplacement);assert.equal(repair.beforeUTF8.split(repair.exactReplacement.before).length,2);const afterUTF8=repair.beforeUTF8.replace(repair.exactReplacement.before,repair.exactReplacement.after);const sha=b=>createHash('sha256').update(b).digest('hex');assert.equal(sha(repair.beforeUTF8),repair.beforeSHA256);assert.equal(sha(afterUTF8),repair.afterSHA256);const before=JSON.parse(repair.beforeUTF8),after=JSON.parse(afterUTF8);if(wholeNative226(value)===wholeNative226(before))return value;assert.equal(wholeNative226(value),wholeNative226(after),'only the entire named current inquiry source replacement');return before;
}

// Strict exact whole 578c state before the two Humboldt source replacements.
export function boundaryBeforeHumboldtSourceReplacement(){
 const layer=boundary.humboldtSourceRepair20261111;assert(layer);assert.equal(layer.previousBoundarySHA256,'86c49cbf870edd004d4052d09781c34a7d6b742e088d271de30cd4d907f102c6');assert.deepEqual(layer.previousValues.map(v=>v.path),[["currentBuild"],["currentCatalogSHA256"],["currentInputs"],["currentContentDossiers"],["qualifiedUILayer"]]);const old=restoreCaralValues(boundary,layer.previousValues);delete old.humboldtSourceRepair20261111;for(const [key,n,id]of[['topicChanges',layer.previousCounts.topicChanges,'person-alexander_humboldt'],['dossierChanges',layer.previousCounts.dossierChanges,'topics-people:person-alexander_humboldt']]){assert.equal(old[key].length,n+1);assert.equal(old[key].at(-1).id,id);old[key].pop();}assert.equal(createHash('sha256').update(JSON.stringify(old,null,2)+'\n').digest('hex'),layer.previousBoundarySHA256);return old;
}
export function catalogBeforeHumboldtSourceReplacement(rows){
 rows=projectNative227Catalog(rows);
 const before=boundaryBeforeHumboldtSourceReplacement();if(wholeNative226(rows)===before.currentCatalogSHA256)return rows;assert.equal(wholeNative226(rows),boundary.currentCatalogSHA256);const change=boundary.topicChanges.at(-1);assert.equal(change.id,'person-alexander_humboldt');const old=rows.map(r=>{if(r.id!==change.id)return r;assert.deepEqual(r,change.after);return structuredClone(change.before);});assert.equal(wholeNative226(old),before.currentCatalogSHA256);return old;
}
export function dossiersBeforeHumboldtSourceReplacement(rows){
 rows=projectNative227Dossiers(rows);
 const before=boundaryBeforeHumboldtSourceReplacement(),layer=boundary.qualifiedUILayer;assert.equal(rows.length,300);if(layer&&rows.some(r=>r.ui?.build===layer.currentTemplate.build)){assert.equal(layer.routes.length,300);rows=rows.map((r,i)=>{const route=layer.routes[i];assert.equal(r.id,route.id);assert.deepEqual(r.ui,{...layer.currentTemplate,route:route.route});const copy=structuredClone(r);assert(Object.hasOwn(route,'previousUI'));copy.ui=structuredClone(route.previousUI);return copy;});}if(JSON.stringify(signature(rows))===JSON.stringify(before.currentContentDossiers))return rows;assert.deepEqual(signature(rows),boundary.currentContentDossiers);const change=boundary.dossierChanges.at(-1);assert.equal(change.id,'topics-people:person-alexander_humboldt');const old=rows.map(r=>{if(r.id!==change.id)return r;assert.deepEqual(r,change.after);assert.deepEqual(r[change.historyField],change.before);return structuredClone(change.before);});assert.deepEqual(signature(old),before.currentContentDossiers);return old;
}
export function runtimeBoundaryBeforeHumboldtSourceReplacement(value){
 value=projectNative227Runtime(value);
 const layer=boundary.humboldtSourceRepair20261111,observed=wholeNative226(value);if(observed===layer.previousRuntimeBoundarySignature)return value;assert.equal(observed,layer.currentRuntimeBoundarySignature,'only the whole actual new or previous578c runtime boundary');assert.deepEqual(layer.previousRuntimeValues.map(v=>v.path),[["currentRuntimeBuild"],["currentInputs"],["currentCatalogSHA256"],["replacedInputs",14,"currentBytes"],["replacedInputs",14,"currentSHA256"]]);const old=restoreCaralValues(value,layer.previousRuntimeValues);assert.equal(old.changedTopics.length,layer.previousCounts.runtimeTopics+1);assert.equal(old.changedTopics.at(-1).id,'person-alexander_humboldt');old.changedTopics.pop();assert.equal(old.replacedInputs.length,layer.previousCounts.runtimeInputs);assert.equal(createHash('sha256').update(JSON.stringify(old,null,2)+'\n').digest('hex'),layer.previousRuntimeBoundarySHA256);return old;
}
