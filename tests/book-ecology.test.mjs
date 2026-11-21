import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ECOLOGY_FIGURES,ecologyState} from '../app/book-ecology-models.ts';
import {validateEcologyPack} from '../app/book-ecology-validation.mjs';
import {GLOSSARY} from '../app/learning-data.ts';

const read=name=>JSON.parse(fs.readFileSync(name,'utf8'));
const pack=read('app/book-ecology-content.json'),words=GLOSSARY.map(row=>({term:row[0]}));


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
test('all seven authored incoming connections point back to genuinely linked canonical older words',()=>{
 const incoming=read('app/book-ecology-word-link-index.json'),topics=read('app/world-index.json');let edges=0;
 for(const[term,links]of Object.entries(incoming))for(const link of links){edges++;assert(words.some(row=>row.term===term));const item=pack.learning[link.term];assert(item);assert(item.relatedWords.some(row=>row.term===term&&row.reason===link.reason));}
 assert.equal(edges,7);
 for(const item of Object.values(pack.learning)){assert(topics.some(row=>row.id===item.topic));for(const link of item.relatedWords??[])assert(words.some(row=>row.term===link.term));}
});
test('unreviewed model, source date, invalid target, missing task feedback and duplicate answer cannot pass',()=>{
 for(const mutate of[data=>data.learning.Evolution.figure='unknown',data=>data.learning.Dürre.sources[0].checkedOn='2030-01-01',data=>data.learning.Mikroorganismus.relatedWords.push({term:'unpublished',reason:'missing'}),data=>delete data.learning.Zersetzung.question,data=>data.learning.Ökosystem.question.wrongReasons[0]='',data=>data.learning.Kohlenstoffkreislauf.question.answers.push(data.learning.Kohlenstoffkreislauf.question.answers[0])]){const changed=structuredClone(pack);mutate(changed);assert.throws(()=>validateEcologyPack(changed));}
});
