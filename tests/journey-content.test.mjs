import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import content from '../app/journey-content.json' with {type:'json'};
import index from '../app/journey-index.json' with {type:'json'};
import sources from '../app/journey-sources.json' with {type:'json'};
import {validateJourneyContent} from '../app/journey-content-validation.mjs';
import {journeyIndex} from '../scripts/journey-content-index.mjs';

test('complete journey explanations retain the existing sixteen routes, eighty chapter titles and final questions',()=>{
 assert.equal(content.journeys.length,16);
 assert.equal(content.journeys.flatMap(j=>j.steps).length,80);
 assert.deepEqual(journeyIndex(content),index);
 assert.equal(validateJourneyContent(content,index,sources),content.journeys);
 for(const j of content.journeys){
  const meta=index.find(m=>m.id===j.id);
  assert.deepEqual(meta.question,j.question);
  assert.deepEqual(meta.steps.map(s=>s.title),j.steps.map(s=>s.title));
 }
 assert.equal(fs.readFileSync('app/journey-index.json','utf8'),JSON.stringify(index,null,2)+'\n');
});

test('legacy explanations without optional depth and revised chapters with explicit depth both validate',()=>{
 const legacy={"title":"Berge wachsen langsam","text":"Wenn Platten zusammenstoßen, kann Gestein gefaltet und gehoben werden. So entstand etwa der Himalaya. Manche Berge sind Vulkane, aber längst nicht alle.","fact":"Der Everest ist der höchste Berg über dem Meeresspiegel. Die Messregel gehört zum Rekord."};
 const revised=content.journeys.flatMap(j=>j.steps).find(s=>Object.hasOwn(s,'deeper'));
 assert.ok(!Object.hasOwn(legacy,'deeper'));assert.ok(revised);assert.ok(revised.sourceIds.length);
 assert.equal(validateJourneyContent(content,index,sources).length,16);
 const legacyDocument=structuredClone(content);legacyDocument.journeys.find(j=>j.id==='landscapes').steps[0]=legacy;
 const legacyIndex=journeyIndex(legacyDocument);
 assert.equal(validateJourneyContent(legacyDocument,legacyIndex,sources).length,16);
 const undeclared=structuredClone(legacyDocument);undeclared.journeys.find(j=>j.id==='landscapes').steps[0].deeper='Nicht im erhaltenen Altindex erklärte Vertiefung';
 assert.throws(()=>validateJourneyContent(undeclared,legacyIndex,sources));
});

test('missing chapters, changed identities, source substitution, damaged depth and injected text fail closed',()=>{
 const revised=d=>d.journeys.flatMap(j=>j.steps).find(s=>Object.hasOwn(s,'deeper'));
 for(const mutate of[
  d=>d.journeys.pop(),d=>d.journeys[1]=d.journeys[0],d=>d.journeys[0].steps.pop(),
  d=>d.journeys[0].steps[0].title='Ein anderes Kapitel',
  d=>d.journeys[0].question.correct=(d.journeys[0].question.correct+1)%3,
  d=>d.journeys[0].source='https://example.invalid/replaced-source',
  d=>d.journeys[0].steps[0].text='<img src=x onerror=alert(1)>',
  d=>{delete d.journeys[0].steps[0].fact;},
  d=>{delete revised(d).deeper;},d=>{revised(d).deeper='';},
  d=>{revised(d).sourceIds=['unverified-source'];},
  d=>{revised(d).sourceIds.push(revised(d).sourceIds[0]);}
 ]){const broken=structuredClone(content);mutate(broken);assert.throws(()=>validateJourneyContent(broken,index,sources));}
});
