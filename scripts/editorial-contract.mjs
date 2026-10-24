import {fingerprint, normalConcept} from './content-inventory.mjs';

// Structural readiness is deliberately separate from scientific/editorial acceptance.
export function validateDossierContent(dossier, record, {knownIds} = {}) {
 const errors=[];
 const text=value=>typeof value==='string'&&value.trim().length>0;
 const day=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;
 if(dossier.id!==record.id||dossier.dataHash!==record.dataHash)errors.push('stale or unrelated content');
 for(const field of ['goal','explanation','example','whyItMatters','hint','feedback','modelLimits','reviewedBy'])if(!text(dossier[field]))errors.push(field+' missing');
 if(!day(dossier.reviewedOn))errors.push('review date missing or invalid');
 if(!['6-8','9-11','12-14'].every(age=>text(dossier.ageLevels?.[age])))errors.push('three meaningful reading/learning levels required');
 const sources=dossier.sources??[],claims=dossier.claims??[],sourceIds=new Set();
 for(const source of sources){
  if(!text(source.id)||sourceIds.has(source.id)||!text(source.organisation)||!text(source.rightsBasis)||!/^https:\/\//.test(source.url??'')||!day(source.checkedOn))errors.push('incomplete/duplicate source or unclear rights');
  sourceIds.add(source.id);
 }
 if(!sources.length||!claims.length)errors.push('explicit source-anchored claims required');
 for(const claim of claims)if(!text(claim.statement)||!text(claim.anchor)||!sourceIds.has(claim.sourceId))errors.push('unanchored claim');
 const media=dossier.media??[];
 if(!media.length&&!text(dossier.mediaDecision))errors.push('explain a deliberate text-only choice');
 for(const asset of media)if(!text(asset.path)||!text(asset.license)||!text(asset.credit)||!text(asset.alt)||!text(asset.learningPurpose))errors.push('media rights/alternative/learning purpose incomplete');
 if(!Array.isArray(dossier.links)||dossier.links.some(id=>!knownIds?.has(id)||id===record.id))errors.push('invalid knowledge connection');
 if(!dossier.links?.length&&!text(dossier.isolationReason))errors.push('justify missing meaningful connections');
 return {id:record.id,contentReady:errors.length===0,errors,scientificApproval:false};
}

export function validateDossier(dossier, record, {build, knownIds} = {}) {
 const {errors}=validateDossierContent(dossier,record,{knownIds});
 const ui=dossier.ui;
 if(!ui||ui.build!==build||ui.route!==record.route||!['visible','search','back','offline'].every(key=>ui[key]===true)||typeof ui.report!=='string'||!ui.report.trim())errors.push('current built UI/search/back/offline proof required');
 return {id:record.id,structurallyReady:errors.length===0,errors,scientificApproval:false};
}

function report(inventory, dossiers, options, validate) {
 const ids=new Set(inventory.records.map(r=>r.id)),seen=new Set(),concepts=new Map(),duplicates=[];
 for(const record of inventory.records){
  const family=inventory.families.find(f=>f.id===record.family);
  if(!family?.eligibleForDoubling)continue;
  const key=normalConcept(record.title),previous=concepts.get(key);
  if(previous)duplicates.push([previous,record.id]);else concepts.set(key,record.id);
 }
 const results=dossiers.map(dossier=>{
  if(seen.has(dossier.id)||!ids.has(dossier.id))throw Error('Duplicate or unknown editorial dossier '+dossier.id);
  seen.add(dossier.id);return validate(dossier,inventory.records.find(r=>r.id===dossier.id),{...options,knownIds:ids});
 });
 return {schemaVersion:1,inventoryFingerprint:fingerprint(inventory.records.map(r=>[r.id,r.dataHash])),results,missingDossiers:inventory.records.filter(r=>!seen.has(r.id)).map(r=>r.id),duplicateConceptCandidates:duplicates,scientificApproval:false,acceptedNew:0,meaning:'Only structural evidence. Missing dossiers remain open. Semantic duplicates, claims, rights and child suitability still need actual individual review; no automatic human acceptance.'};
}

export const editorialReport=(inventory,dossiers=[],options={})=>report(inventory,dossiers,options,validateDossier);
export function editorialContentReport(inventory,dossiers=[]){
 return {...report(inventory,dossiers,{},validateDossierContent),scope:'static content and references only; no current UI acceptance',meaning:'Static dossier structure, content identity, source/rights fields and knowledge references only. Current UI/search/back/offline acceptance remains mandatory in the final editorialReport; no scientific approval.'};
}
