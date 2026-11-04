import {ecologyPredecessors,withAstronomyPreEcologyRuntime} from './ecology-predecessor-reference.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {asteroidLocation,cometDirections,projectedTransit,galaxyMembership,lightyearDistance} from '../app/book-astronomy-models.ts';
import {validateAstronomyPack,ASTRONOMY_WORDS,ASTRONOMY_QUESTIONS} from '../app/book-astronomy-validation.mjs';
import {bookAstronomyContent} from '../scripts/book-astronomy-index.mjs';
import {astronomyPredecessors,withDigitalPreAstronomyRuntime} from './astronomy-predecessor-reference.mjs';
import {learningFingerprint} from '../build/learning-fingerprint.mjs';
import {collectInventory as collectCurrentInventory,fingerprint} from '../scripts/content-inventory.mjs';
import {inventoryBeforeFourteenBacklinks} from './people-fourteen-reference.mjs';
const collectInventory=(...args)=>inventoryBeforeFourteenBacklinks(collectCurrentInventory(...args));
import {validateDossierContent} from '../scripts/editorial-contract.mjs';
const read=name=>JSON.parse(fs.readFileSync(name,'utf8'));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const whole=value=>sha(JSON.stringify(value));
const pack=read('app/book-astronomy-content.json'),words=read('exports/content/knowledge-words.json'),why=read('exports/content/why-questions.json');

test('asteroid examples locate the selected object relative to Mars, Jupiter and the belt without claiming real orbits',()=>{
 const cases=[asteroidLocation(0),asteroidLocation(1),asteroidLocation(2)];
 assert(cases[0].radius>cases[0].marsRadius&&cases[0].radius<cases[0].jupiterRadius);
 assert(cases[0].radius>=cases[0].beltInnerRadius&&cases[0].radius<=cases[0].beltOuterRadius);
 assert(cases[1].radius<cases[1].marsRadius);assert.equal(cases[2].radius,cases[2].jupiterRadius);
 for(const row of cases){assert(Math.abs(Math.hypot(row.point.x-row.sun.x,row.point.y-row.sun.y)-row.radius)<1e-10);assert.equal(row.realOrbitCalculated,false);assert.equal(row.realObjectCount,null);}
});
test('comet material points away from the Sun independently of its indicated motion',()=>{
 for(const index of[0,1,2]){
  const row=cometDirections(index),radial={x:row.nucleus.x-row.sun.x,y:row.nucleus.y-row.sun.y},tail={x:row.tip.x-row.nucleus.x,y:row.tip.y-row.nucleus.y};
  assert(Math.abs(radial.x*tail.y-radial.y*tail.x)<1e-9);assert(radial.x*tail.x+radial.y*tail.y>0);
  assert(Math.abs(Math.hypot(tail.x,tail.y)-80)<1e-10);assert(Math.abs(row.movement.x*tail.y-row.movement.y*tail.x)>1);
  assert.deepEqual(row.movement,{x:0,y:-55});assert.equal(row.realTailShapeCalculated,false);assert.equal(row.realOrbitCalculated,false);
 }
});
test('both entirely overlapping projections block one percent of area; the separate disk blocks none',()=>{
 for(const index of[0,1,2]){
  const row=projectedTransit(index),distance=Math.hypot(row.foregroundPlanet.x-row.star.x,row.foregroundPlanet.y-row.star.y),inside=distance+row.foregroundPlanet.radius<=row.star.radius;
  assert.equal(inside,index!==2);assert.equal(row.fullyInside,inside);assert.equal(row.separate,index===2);
  const independentlyBlocked=inside?Math.PI*row.foregroundPlanet.radius**2/(Math.PI*row.star.radius**2):0;
  assert(Math.abs(row.blockedFraction-independentlyBlocked)<1e-14);assert.equal(row.remainingFraction,index===2?1:.99);
  assert.equal(row.planetConfirmed,false);assert.equal(row.realStellarMeasurement,false);assert.equal(row.uniformStellarBrightness,true);
 }
});
test('galaxy membership distinguishes planet, planetary system and galaxy without a scale or count',()=>{
 assert.deepEqual([0,1,2].map(i=>{const r=galaxyMembership(i);assert.equal(r.actualScale,null);assert.equal(r.actualStarCount,null);return[r.name,r.kind,r.memberOf];}),[['Erde','Planet','Sonnensystem'],['Sonnensystem','Planetensystem','Milchstraße'],['Milchstraße','Galaxie',null]]);
});
test('light-year is an exact Julian-year vacuum distance with independently rounded displayed kilometres',()=>{
 const one=299792458n*36525n*864n;assert.equal(one,9460730472580800n);
 for(const[index,years,label]of[[0,1,'9,46'],[1,2,'18,92'],[2,4,'37,84']]){
  const row=lightyearDistance(index);assert.equal(BigInt(row.metres),one*BigInt(years));assert.equal(row.years,years);assert.equal(row.lightyears,years);assert.equal(row.kilometresDecimal,(one*BigInt(years)/1000n).toString()+'.'+(one*BigInt(years)%1000n).toString().padStart(3,'0').replace(/0+$/,''));
  assert.equal(row.approximatelyGermanBillionKm,label);assert.equal(row.barFraction,years/4);assert.equal(row.realStarDistanceMeasured,false);assert.equal(row.vacuum,true);
 }
});
test('all five bounded models reject fractional, missing and out-of-range selections',()=>{
 for(const model of[asteroidLocation,cometDirections,projectedTransit,galaxyMembership,lightyearDistance])for(const input of[-1,3,.5,NaN,Infinity,undefined,'1'])assert.throws(()=>model(input));
});
test('eight astronomy studies preserve159 whole delivered word objects,50 Why identities and all ten older teaching packs',()=>{
 assert.deepEqual(bookAstronomyContent(true),pack);assert.equal(words.length,180);assert.equal(new Set(words.map(row=>row.term)).size,180);assert.equal(why.length,60);assert.equal(new Set(why.map(row=>row.question)).size,60);assert.equal(ASTRONOMY_WORDS.length,6);assert.equal(ASTRONOMY_QUESTIONS.length,2);assert.equal(read('exports/content/book-astronomy.json').length,8);
 const old=read('tests/fixtures/book-before-astronomy-159-hashes.json');assert.equal(Object.keys(old.words).length,159);assert.equal(Object.keys(old.why).length,50);assert.equal(Object.keys(old.packs).length,10);
 for(const[term,hash]of Object.entries(old.words))assert.equal(whole(words.find(row=>row.term===term)),hash,term);
 assert.deepEqual(why.slice(0,50).map(row=>row.question),old.whyOrder);
 for(const[question,hash]of Object.entries(old.why))assert.equal(whole(why.find(row=>row.question===question)),hash,question);
 for(const[file,hash]of Object.entries(old.packs))assert.equal(sha(fs.readFileSync(file)),hash,file);
});
test('astronomy connections use actual canonical peers and the old Planet receives the authored Asteroid edge',()=>{
 const incoming=read('app/book-astronomy-word-link-index.json'),topics=read('app/world-index.json');
 for(const item of[...Object.values(pack.learning),...Object.values(pack.whyLearning)]){
  assert(topics.some(row=>row.id===item.topic));for(const link of item.relatedWords??[])assert(words.some(row=>row.term===link.term));for(const link of item.relatedQuestions??[])assert(why.some(row=>row.question===link.question));
 }
 assert.deepEqual(Object.keys(incoming),['Planet']);assert.equal(incoming.Planet.length,1);assert.equal(incoming.Planet[0].term,'Asteroid');assert.equal(incoming.Planet[0].reason,pack.learning.Asteroid.relatedWords.find(row=>row.term==='Planet').reason);
});
test('unreviewed figures, dates, references, missing feedback and duplicate answers are rejected',()=>{
 for(const mutate of[data=>delete data.learning.Komet.question,data=>data.learning.Transit.figure='unknown',data=>data.learning.Galaxie.relatedWords.push({term:'unpublished',reason:'unavailable'}),data=>data.learning.Exoplanet.sources[0].checkedOn='2030-01-01',data=>data.learning.Asteroid.question.wrongReasons[data.learning.Asteroid.question.correct===0?1:0]='',data=>data.whyLearning[ASTRONOMY_QUESTIONS[0]].question.answers.push(data.whyLearning[ASTRONOMY_QUESTIONS[0]].question.answers[0])]){const changed=structuredClone(pack);mutate(changed);assert.throws(()=>validateAstronomyPack(changed));}
});
test('all eight individually authored astronomy contracts match the actual inventory, teaching, claims and sources',()=>{
 const inventory=collectInventory(),records=new Map(inventory.records.map(row=>[row.id,row])),knownIds=new Set(records.keys()),items=ecologyPredecessors(read('content/editorial-reviews.json').dossiers),teaching=read('exports/content/book-astronomy.json');
 const expected=[...ASTRONOMY_WORDS.map(term=>'words:'+term),...ASTRONOMY_QUESTIONS.map(question=>'why:'+why.findIndex(row=>row.question===question))];assert.deepEqual(items.slice(189).map(row=>row.id),expected);
 for(const dossier of items.slice(189)){
  const record=records.get(dossier.id);assert(record);assert.equal(dossier.dataHash,record.dataHash);const isWord=record.family==='words',key=isWord?record.legacyId:why[record.sourceIndex].question,lesson=teaching.find(row=>row.kind===(isWord?'word':'why')&&(isWord?row.term:row.whyQuestion)===key);assert(lesson);assert.equal(dossier.teachingDataHash,fingerprint(lesson));assert.deepEqual(dossier.sources.map(row=>row.url),(isWord?pack.learning:pack.whyLearning)[key].sources.map(row=>row.url));
  const result=validateDossierContent(dossier,record,{knownIds});assert.equal(result.contentReady,true);assert.equal(result.scientificApproval,false);
 }
});
test('all189 complete delivered dossiers and actual541 runtime inputs survive; altered histories or invented UI cannot pass',()=>{
 const items=read('content/editorial-reviews.json').dossiers,old=read('tests/fixtures/book-before-astronomy-159-hashes.json');assert.deepEqual(astronomyPredecessors(items).map(row=>({id:row.id,sha256:whole(row)})),old.whole189PredecessorDossiers);assert.equal(withDigitalPreAstronomyRuntime(process.cwd(),learningFingerprint),'11c3327c2907cf2c');
 for(const mutate of[rows=>rows[0].explanation+=' unreviewed',rows=>delete rows[0].historicalUIBeforeDigital20261101,rows=>delete rows[0].historicalUIBeforeStatistics20261031,rows=>rows[177].ui.build='invented',rows=>rows[189].dataHash='changed',rows=>rows[196].teachingDataHash='changed',rows=>rows[189].ui={build:'invented'},rows=>rows.reverse(),rows=>rows.pop()]){const changed=structuredClone(items);mutate(changed);assert.throws(()=>astronomyPredecessors(changed));}
});

test('Transit task explicitly selects the nonoverlapping projection before asking for its interpretation',()=>{
 const q=pack.learning.Transit.question;assert.equal(q.prompt,'Wähle im Modell „Daneben“. Was beschreibt die Ansicht bei dieser Auswahl?');
 const separate=projectedTransit(2),centred=projectedTransit(0);assert(separate.separate&&!separate.fullyInside);assert.equal(separate.blockedFraction,0);assert(centred.fullyInside&&!centred.separate);assert.equal(centred.blockedFraction,.01);
 assert.equal(q.answers[q.correct],'Aus dieser Blickrichtung gibt es keine Überdeckung der Scheiben.');
});

// Add only after actual complete current browsers, whole original archive and
// current positive visual qualification; the fixture cannot stand for an intent.
import {validateDossier} from '../scripts/editorial-contract.mjs';
const astronomyCurrentUIFixture=read('tests/fixtures/editorial-before-astronomy-189.json');
function assertActualCurrent197(items){
 items=ecologyPredecessors(items);
 const actualAstronomyBuild=withAstronomyPreEcologyRuntime(process.cwd(),learningFingerprint);
 const inventory=collectInventory(),records=new Map(inventory.records.map(row=>[row.id,row])),knownIds=new Set(records.keys());
 assert.equal(items.length,197);assert.equal(astronomyCurrentUIFixture.priorDossiers.length,189);assert.equal(astronomyCurrentUIFixture.addedDossiers.length,8);assert.equal(astronomyCurrentUIFixture.currentTemplate.build,actualAstronomyBuild);
 const old=astronomyPredecessors(items),baseline=read('tests/fixtures/book-before-astronomy-159-hashes.json');assert.deepEqual(old.map(row=>({id:row.id,sha256:whole(row)})),baseline.whole189PredecessorDossiers);
 const expected=[...ASTRONOMY_WORDS.map(term=>'words:'+term),...ASTRONOMY_QUESTIONS.map(question=>'why:'+why.findIndex(row=>row.question===question))];assert.deepEqual(astronomyCurrentUIFixture.addedDossiers.map(row=>row.id),expected);
 for(const item of items){const record=records.get(item.id);assert(record,item.id);assert.equal(validateDossier(item,record,{build:actualAstronomyBuild,knownIds}).structurallyReady,true,item.id+' actual current technical UI contract');}
 const teaching=read('exports/content/book-astronomy.json');
 for(const id of expected){const item=items.find(row=>row.id===id),record=records.get(id),isWord=record.family==='words',key=isWord?record.legacyId:why[record.sourceIndex].question,canonical=isWord?words.find(row=>row.term===key):why[record.sourceIndex];assert.equal(item.dataHash,record.dataHash);assert.equal(record.dataHash,fingerprint(canonical));const lesson=teaching.find(row=>row.kind===(isWord?'word':'why')&&(isWord?row.term:row.whyQuestion)===key);assert(lesson);assert.equal(item.teachingDataHash,fingerprint(lesson));assert.deepEqual(item.sources.map(row=>row.url),(isWord?pack.learning:pack.whyLearning)[key].sources.map(row=>row.url));assert.equal(item.ui.route,record.route);}
}
test('all197 real current UI contracts retain every whole189 M86 dossier and all eight individual Astronomy studies',()=>assertActualCurrent197(read('content/editorial-reviews.json').dossiers));
test('current197UI rejects stale binding, lost nested histories, changed teaching, wrong routes and altered identities',()=>{
 for(const mutate of[rows=>rows[189].ui.build='stale',rows=>rows[196].ui.offline=false,rows=>rows[190].ui.route='book/words/unpublished',rows=>rows[189].teachingDataHash='0'.repeat(64),rows=>rows[196].dataHash='0'.repeat(64),rows=>rows[0].explanation+=' unreviewed',rows=>delete rows[0].historicalUIBeforeAstronomy20261101,rows=>delete rows[0].historicalUIBeforeDigital20261101,rows=>delete rows[0].historicalUIBeforeStatistics20261031,rows=>delete rows[0].historicalUIBeforeGene20261031,rows=>rows[188].historicalUIBeforeAstronomy20261101.build='invented',rows=>rows.reverse(),rows=>rows.pop()]){const changed=structuredClone(read('content/editorial-reviews.json').dossiers);mutate(changed);assert.throws(()=>assertActualCurrent197(changed));}
});
