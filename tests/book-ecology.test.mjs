import {retainedPredecessors,withEcologyPreRetainedRuntime} from './retained-predecessor-reference.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {ECOLOGY_FIGURES,ecologyState} from '../app/book-ecology-models.ts';
import {validateEcologyPack,ECOLOGY_WORDS} from '../app/book-ecology-validation.mjs';
import {bookEcologyContent} from '../scripts/book-ecology-index.mjs';
import {ecologyPredecessors,withAstronomyPreEcologyRuntime} from './ecology-predecessor-reference.mjs';
import {learningFingerprint} from '../build/learning-fingerprint.mjs';
import {collectInventory,fingerprint} from '../scripts/content-inventory.mjs';
import {validateDossierContent} from '../scripts/editorial-contract.mjs';

const read=name=>JSON.parse(fs.readFileSync(name,'utf8'));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const whole=value=>sha(JSON.stringify(value));
const pack=read('app/book-ecology-content.json'),words=read('exports/content/knowledge-words.json'),why=read('exports/content/why-questions.json');

test('generation comparison measures changing proportions in groups without tracing an individual or claiming a cause',()=>{
 for(const[index,count]of[2,4,3].entries()){
  const row=ecologyState('generation-frequency',index);
  assert.equal(row.generation,index+1);assert.equal(row.individuals.length,8);
  assert.equal(row.individuals.filter(p=>p.marked).length,count);
  assert.equal(row.marked,count);assert.equal(row.total,8);assert.equal(row.percentage,[25,50,37.5][index]);
  assert.equal(new Set(row.individuals.map(p=>p.x+':'+p.y)).size,8);
  assert.equal(row.causeKnown,false);assert.equal(row.individualIdentityAcrossGenerations,false);
 }
});
test('microorganism size does not imply one cell, a species, a real micrograph or a shared scale',()=>{
 assert.deepEqual([0,1,2].map(index=>ecologyState('microstructure-examples',index).show),[['bacterium'],['septate-fungus'],['bacterium','septate-fungus']]);
 for(const index of[0,1,2]){
  const row=ecologyState('microstructure-examples',index);assert.deepEqual(row.cellCounts,{bacterium:1,'septate-fungus':6});
  assert.equal(row.trueSizeComparison,false);assert.equal(row.realMicrograph,false);assert.equal(row.speciesIdentification,false);
 }
});
test('ecosystem progresses from living components to environment and explicitly named relationships',()=>{
 const rows=[0,1,2].map(index=>ecologyState('ecosystem-relationships',index));
 assert.deepEqual(rows.map(row=>row.nodes.length),[3,6,7]);
 assert.deepEqual(rows.map(row=>row.edges.length),[0,0,3]);
 assert.deepEqual(rows[2].edges,[{from:'light',to:'plant',process:'Fotosynthese'},{from:'plant',to:'animal',process:'Nahrung'},{from:'dead-material',to:'fungus',process:'Abbau'}]);
 for(const row of rows){assert.equal(row.completeEcosystem,false);assert.equal(new Set(row.nodes).size,row.nodes.length);for(const edge of row.edges){assert(row.nodes.includes(edge.from));assert(row.nodes.includes(edge.to));}}
});
test('decomposition transfers the same twelve thought markers, without treating them as real atoms, mass or days',()=>{
 const rows=[0,1,2].map(index=>ecologyState('decomposition-transfer',index));
 assert.deepEqual(rows.map(row=>row.remaining),[12,8,5]);assert.deepEqual(rows.map(row=>row.transferred),[0,4,7]);
 for(const row of rows){assert.equal(row.remaining+row.transferred,12);assert.equal(row.total,12);assert.equal(row.conserved,true);assert.equal(row.realAtomCounts,false);assert.equal(row.realMassMeasurement,false);assert.equal(row.elapsedDays,null);}
 const q=pack.learning.Zersetzung.question;
 assert.equal(q.prompt,'Wähle im Modell „Zwischenbild“. Dort liegen acht Marken im Restmaterial und vier in anderen Formen oder an anderen Orten. Welche Folgerung passt zum Modell?');
 assert.equal(rows[1].remaining,8);assert.equal(rows[1].transferred,4);
});
test('each carbon transfer distinguishes source, process and destination, with no invented amounts or complete cycle',()=>{
 const expected=[['air','plant','Fotosynthese'],['plant','air','Zellatmung'],['dead-material','air','Zersetzung']];
 for(const[index,triple]of expected.entries()){
  const row=ecologyState('carbon-labelled-paths',index);assert.deepEqual([row.from,row.to,row.process],triple);assert(row.nodes.includes(row.from)&&row.nodes.includes(row.to));
  assert.equal(row.massRate,null);assert.equal(row.reservoirAmounts,null);assert.equal(row.completeCycle,false);
 }
});
test('same number of wet days produces distinct independent rainfall sums and no real drought diagnosis',()=>{
 const a=ecologyState('rain-count-versus-amount',0),b=ecologyState('rain-count-versus-amount',1),both=ecologyState('rain-count-versus-amount',2);
 assert.deepEqual(both.series,[...a.series,...b.series]);assert.deepEqual(both.series.map(row=>row.totalMillimeters),[20,2]);
 assert.deepEqual(both.series.map(row=>row.wetDays),[2,2]);
 for(const row of[a,b,both]){assert.equal(row.realObservations,false);assert.equal(row.localDroughtDiagnosis,false);for(const series of row.series){assert.equal(series.days,4);assert.equal(series.totalMillimeters,series.amounts.reduce((sum,n)=>sum+n,0));assert.equal(series.wetDays,series.amounts.filter(n=>n>0).length);}}
});
test('all six model selectors reject missing, fractional, negative, string and out-of-range states',()=>{
 assert.equal(ECOLOGY_FIGURES.length,6);assert.equal(new Set(ECOLOGY_FIGURES).size,6);
 for(const kind of ECOLOGY_FIGURES)for(const index of[-1,3,.5,NaN,Infinity,undefined,'1'])assert.throws(()=>ecologyState(kind,index));
 for(const kind of['unknown','',null,undefined])assert.throws(()=>ecologyState(kind,0));
});
test('six ecological studies preserve all165 whole previous words, their relative order, all52 Why and all11 older packs',()=>{
 assert.deepEqual(bookEcologyContent(true),pack);assert.equal(words.length,180);assert.equal(new Set(words.map(row=>row.term)).size,180);assert.equal(why.length,60);
 assert.equal(ECOLOGY_WORDS.length,6);assert.equal(read('exports/content/book-ecology.json').length,6);
 const old=read('tests/fixtures/book-before-ecology-165-hashes.json');
 assert.equal(Object.keys(old.words).length,165);assert.equal(Object.keys(old.why).length,52);assert.equal(Object.keys(old.packs).length,11);
 for(const[term,hash]of Object.entries(old.words))assert.equal(whole(words.find(row=>row.term===term)),hash,term);
 assert.deepEqual(words.filter(row=>Object.hasOwn(old.words,row.term)).map(row=>row.term),old.wordOrder);
 assert.deepEqual(why.slice(0,52).map(row=>row.question),old.whyOrder);
 for(const[question,hash]of Object.entries(old.why))assert.equal(whole(why.find(row=>row.question===question)),hash,question);
 for(const[file,hash]of Object.entries(old.packs))assert.equal(sha(fs.readFileSync(file)),hash,file);
});
test('all six content-only dossiers match actual canonical lessons, sources, task feedback and existing targets',()=>{
 const inventory=collectInventory(),records=new Map(inventory.records.map(row=>[row.id,row])),knownIds=new Set(records.keys()),items=retainedPredecessors(read('content/editorial-reviews.json').dossiers),lessons=read('exports/content/book-ecology.json');
 assert.equal(items.length,203);assert.deepEqual(items.slice(197).map(row=>row.id),ECOLOGY_WORDS.map(term=>'words:'+term));
 for(const dossier of items.slice(197)){
  const term=dossier.id.slice(6),record=records.get(dossier.id),lesson=lessons.find(row=>row.kind==='word'&&row.term===term);assert(record&&lesson);
  assert.equal(dossier.dataHash,record.dataHash);assert.equal(dossier.teachingDataHash,fingerprint(lesson));assert.deepEqual(dossier.answerReview,pack.learning[term].question);
  assert.deepEqual(dossier.sources.map(row=>row.url),pack.learning[term].sources.map(row=>row.url));
  assert.equal(validateDossierContent(dossier,record,{knownIds}).contentReady,true);assert.equal(validateDossierContent(dossier,record,{knownIds}).scientificApproval,false);
 }
});
test('all seven authored incoming connections point back to genuinely linked canonical older words',()=>{
 const incoming=read('app/book-ecology-word-link-index.json'),topics=read('app/world-index.json');let edges=0;
 for(const[term,links]of Object.entries(incoming))for(const link of links){edges++;assert(words.some(row=>row.term===term));const item=pack.learning[link.term];assert(item);assert(item.relatedWords.some(row=>row.term===term&&row.reason===link.reason));}
 assert.equal(edges,7);
 for(const item of Object.values(pack.learning)){assert(topics.some(row=>row.id===item.topic));for(const link of item.relatedWords??[])assert(words.some(row=>row.term===link.term));}
});
test('unreviewed model, source date, invalid target, missing task feedback and duplicate answer cannot pass',()=>{
 for(const mutate of[data=>data.learning.Evolution.figure='unknown',data=>data.learning.Dürre.sources[0].checkedOn='2030-01-01',data=>data.learning.Mikroorganismus.relatedWords.push({term:'unpublished',reason:'missing'}),data=>delete data.learning.Zersetzung.question,data=>data.learning.Ökosystem.question.wrongReasons[0]='',data=>data.learning.Kohlenstoffkreislauf.question.answers.push(data.learning.Kohlenstoffkreislauf.question.answers[0])]){const changed=structuredClone(pack);mutate(changed);assert.throws(()=>validateEcologyPack(changed));}
});
test('all197 actual whole predecessor dossiers and553 runtime inputs survive; changed history or premature new UI cannot pass',()=>{
 const items=retainedPredecessors(read('content/editorial-reviews.json').dossiers),old=read('tests/fixtures/book-before-ecology-165-hashes.json');
 assert.deepEqual(ecologyPredecessors(items).map(row=>({id:row.id,sha256:whole(row)})),old.whole197PredecessorDossiers);
 assert.equal(withAstronomyPreEcologyRuntime(process.cwd(),learningFingerprint),'0af1ba46e82f4b1f');
 for(const mutate of[rows=>rows[0].explanation+=' unreviewed',rows=>delete rows[0].historicalUIBeforeAstronomy20261101,rows=>delete rows[0].historicalUIBeforeDigital20261101,rows=>rows[196].ui.build='invented',rows=>rows[197].dataHash='changed',rows=>rows[202].teachingDataHash='changed',rows=>rows[197].ui={build:'invented'},rows=>rows.reverse(),rows=>rows.pop()]){const changed=structuredClone(items);mutate(changed);assert.throws(()=>ecologyPredecessors(changed));}
});

// Add only after actual complete current browsers, whole original archive and
// current positive visual qualification; the fixture cannot stand for an intent.
import {validateDossier} from '../scripts/editorial-contract.mjs';
const ecologyCurrentUIFixture=read('tests/fixtures/editorial-before-ecology-197.json');
function assertActualCurrent203(items){
 items=retainedPredecessors(items);
 const actualDeliveredBuild=withEcologyPreRetainedRuntime(process.cwd(),learningFingerprint);
 const inventory=collectInventory(),records=new Map(inventory.records.map(row=>[row.id,row])),knownIds=new Set(records.keys());
 assert.equal(items.length,203);assert.equal(ecologyCurrentUIFixture.priorDossiers.length,197);assert.equal(ecologyCurrentUIFixture.addedDossiers.length,6);assert.equal(ecologyCurrentUIFixture.currentTemplate.build,withEcologyPreRetainedRuntime(process.cwd(),learningFingerprint));
 const old=ecologyPredecessors(items),baseline=read('tests/fixtures/book-before-ecology-165-hashes.json');assert.deepEqual(old.map(row=>({id:row.id,sha256:whole(row)})),baseline.whole197PredecessorDossiers);
 const expected=ECOLOGY_WORDS.map(term=>'words:'+term);assert.deepEqual(ecologyCurrentUIFixture.addedDossiers.map(row=>row.id),expected);
 for(const item of items){const record=records.get(item.id);assert(record,item.id);assert.equal(validateDossier(item,record,{build:actualDeliveredBuild,knownIds}).structurallyReady,true,item.id+' actual delivered M88 technical UI contract');}
 const teaching=read('exports/content/book-ecology.json');
 for(const id of expected){const item=items.find(row=>row.id===id),record=records.get(id),isWord=record.family==='words',key=isWord?record.legacyId:why[record.sourceIndex].question,canonical=isWord?words.find(row=>row.term===key):why[record.sourceIndex];assert.equal(item.dataHash,record.dataHash);assert.equal(record.dataHash,fingerprint(canonical));const lesson=teaching.find(row=>row.kind===(isWord?'word':'why')&&(isWord?row.term:row.whyQuestion)===key);assert(lesson);assert.equal(item.teachingDataHash,fingerprint(lesson));assert.deepEqual(item.sources.map(row=>row.url),(isWord?pack.learning:pack.whyLearning)[key].sources.map(row=>row.url));assert.equal(item.ui.route,record.route);}
}
test('all203 real current UI contracts retain every whole197 M87 dossier and all six individual Ecology studies',()=>assertActualCurrent203(read('content/editorial-reviews.json').dossiers));
test('current203UI rejects stale binding, lost nested histories, changed teaching, wrong routes and altered identities',()=>{
 for(const mutate of[rows=>rows[197].ui.build='stale',rows=>rows[202].ui.offline=false,rows=>rows[198].ui.route='book/words/unpublished',rows=>rows[197].teachingDataHash='0'.repeat(64),rows=>rows[202].dataHash='0'.repeat(64),rows=>rows[0].explanation+=' unreviewed',rows=>delete rows[0].historicalUIBeforeEcology20261101,rows=>delete rows[0].historicalUIBeforeAstronomy20261101,rows=>delete rows[0].historicalUIBeforeDigital20261101,rows=>delete rows[0].historicalUIBeforeStatistics20261031,rows=>delete rows[0].historicalUIBeforeGene20261031,rows=>rows[196].historicalUIBeforeEcology20261101.build='invented',rows=>rows.reverse(),rows=>rows.pop()]){const changed=structuredClone(read('content/editorial-reviews.json').dossiers);mutate(changed);assert.throws(()=>assertActualCurrent203(changed));}
});
