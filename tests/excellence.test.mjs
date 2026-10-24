import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {collectInventory,compareBaseline,freezeBaseline,normalConcept} from '../scripts/content-inventory.mjs';
import {validateDossier,validateDossierContent,editorialReport,editorialContentReport} from '../scripts/editorial-contract.mjs';
const inventory=collectInventory(),baseline=JSON.parse(fs.readFileSync('content/excellence-baseline.json','utf8'));

test('frozen individual growth stocks cannot be compensated by other categories or lose old identities',()=>{
 const report=compareBaseline(inventory,baseline);
 assert.deepEqual(report.collections.map(c=>[c.id,c.baseline,c.target]),[['topics-animals',24,48],['topics-history',31,62],['topics-people',18,36],['topics-inventions',12,24],['topics-buildings',8,16],['topics-science',23,46],['words',90,180],['why',30,60],['nature-topics',34,68]]);
 assert.ok(report.collections.every(c=>c.acceptedNew===0&&!c.doublingAccepted));
 assert.throws(()=>compareBaseline({...inventory,records:inventory.records.slice(1)},baseline),/Lost legacy/);
 const changed=structuredClone(baseline);changed.families[0].count++;assert.throws(()=>compareBaseline(inventory,changed),/frozen/);
 const changedRoute=structuredClone(baseline);changedRoute.records[0].route='globe';assert.throws(()=>compareBaseline(inventory,changedRoute),/frozen/);
 assert.equal(freezeBaseline(inventory).commit,baseline.commit);
 assert.equal(normalConcept('  Größere Wälder '),normalConcept('grössere Wälder'));
});
test('all old journeys, diagrams, tasks, games and labs stay in scope without becoming new articles',()=>{
 const counts=Object.fromEntries(inventory.families.map(f=>[f.id,f.count]));
 for(const [id,n] of Object.entries({journeys:16,chapters:80,'chapter-graphics':80,'journey-tasks':240,'journey-processes':10,games:31,labs:11,experiments:6,missions:12}))assert.equal(counts[id],n,id);
 assert.equal(editorialReport(inventory).missingDossiers.length,inventory.records.length);
 assert.equal(editorialReport(inventory).scientificApproval,false);
});
test('dossiers reject unsupported claims, unknown rights, stale UI and duplicate identities',()=>{
 const record=inventory.records[0],d={id:record.id,dataHash:record.dataHash,goal:'Observe',explanation:'Explain',example:'Compare',whyItMatters:'Understand',hint:'Think',feedback:'Explain result',modelLimits:'Not a full model',reviewedBy:'Synthetic fixture only',reviewedOn:'2026-10-13',ageLevels:{'6-8':'Observe','9-11':'Explain','12-14':'Transfer'},sources:[{id:'source',organisation:'Fixture',url:'https://example.org/source',rightsBasis:'Synthetic test',checkedOn:'2026-10-13'}],claims:[{statement:'Fixture only',sourceId:'source',anchor:'Section 1'}],mediaDecision:'No visual needed for this test',links:[],isolationReason:'Synthetic isolated test',ui:{build:'fixture-build',route:record.route,visible:true,search:true,back:true,offline:true,report:'synthetic report'}};
 const options={build:'fixture-build',knownIds:new Set(inventory.records.map(r=>r.id))};
 assert.equal(validateDossier(d,record,options).structurallyReady,true);assert.equal(validateDossier(d,record,options).scientificApproval,false);
 const pending=structuredClone(d);delete pending.ui;
 assert.equal(validateDossierContent(pending,record,options).contentReady,true);
 assert.equal(validateDossier(pending,record,options).structurallyReady,false,'static content validity cannot confer current UI acceptance');
 const staticReport=editorialContentReport(inventory,[pending]);assert.equal(staticReport.results[0].contentReady,true);assert.equal(Object.hasOwn(staticReport.results[0],'structurallyReady'),false);assert.match(staticReport.scope,/no current UI acceptance/);
 const badStatic=structuredClone(pending);badStatic.claims[0].sourceId='missing';assert.equal(validateDossierContent(badStatic,record,options).contentReady,false,'early path retains factual reference validation');
 for(const change of [x=>x.claims[0].sourceId='missing',x=>x.sources[0].rightsBasis='',x=>x.sources[0].checkedOn='2026-02-31',x=>x.reviewedOn='invalid',x=>x.ui.build='old',x=>x.ui.offline=false,x=>x.dataHash='old',x=>x.ageLevels['6-8']='',x=>x.links=['missing']]){const bad=structuredClone(d);change(bad);assert.equal(validateDossier(bad,record,options).structurallyReady,false);}
 assert.throws(()=>editorialReport(inventory,[d,d],options),/Duplicate/);
});

test('user removal retires only the six exact frozen news identities; every remaining legacy identity stays required',()=>{
 const retired=baseline.records.filter(r=>r.id.startsWith('news:')||r.id==='surfaces:news'||r.id==='updates:news-engineering-2c');assert.equal(retired.length,6);
 for(const r of retired)assert.equal(inventory.records.some(x=>x.id===r.id),false);
 assert.doesNotThrow(()=>compareBaseline(inventory,baseline));
 for(const id of ['journeys:ocean',baseline.records.find(r=>r.family==='words').id,'surfaces:home'])assert.throws(()=>compareBaseline({...inventory,records:inventory.records.filter(r=>r.id!==id)},baseline),/Lost legacy/);
});
