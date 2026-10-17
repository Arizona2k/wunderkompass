import test from 'node:test';
import assert from 'node:assert/strict';
import draft from '../content/animal-expansion-review.json' with {type:'json'};
import catalog from '../app/world-catalog.json' with {type:'json'};
import original from '../content/animal-editorial-review.json' with {type:'json'};

test('24 individually authored new species are implemented beside the24 originals without fabricating independent acceptance',()=>{
 assert.equal(draft.entries.length,24);assert.equal(draft.runtimeNewSpecies,24);assert.equal(draft.acceptedNew,0);assert.equal(draft.independentReview,false);
 const ids=new Set(catalog.map(t=>t.id)),prepared=new Set(draft.entries.map(e=>e.id));
 assert.equal(prepared.size,24);assert.equal(new Set(draft.entries.map(e=>e.taxon)).size,24);
 assert.equal(original.entries.length,24);for(const old of original.entries)assert.ok(ids.has(old.id));
 for(const e of draft.entries){
  assert.equal(ids.has(e.id),true,'implemented species really exists in runtime '+e.id);
  assert.equal(e.stage,'implemented-awaiting-full-validation');assert.equal(e.runtimeIntegrated,true);assert.equal(e.independentlyAccepted,false);
  assert.match(e.taxon,/^[A-Z][a-z]+ [a-z]+$/,'one species, not a group/subspecies alias');
  assert.equal(e.paragraphs.length,2);assert.deepEqual(e.claims.map(c=>c.statement),e.paragraphs);
  const url=new URL(e.source.url);assert.equal(url.protocol,'https:');assert.equal(url.username,'');assert.equal(url.password,'');
  assert.ok(e.claims.every(c=>c.anchor.length>10));assert.equal(e.source.accessedOn,draft.preparedOn);
  for(const c of e.proposedConnections){assert.ok(c.reason.length>35);assert.notEqual(c.target,e.id);assert.ok(ids.has(c.target)||prepared.has(c.target),e.id+' no invented destination');}
  assert.equal(e.media.status,'own-vector-implemented-awaiting-visual-review');assert.ok(e.limits.length>50);assert.ok(e.openBeforeRuntime.length>=3);assert.ok(e.runtimeMeasurement.anchor.length>10);assert.equal(e.independentlyAccepted,false);
 }
});

test('each manuscript has three distinct thinking actions and individually written prompts, hints and explanatory feedback',()=>{
 const prompts=[],hints=[];
 for(const e of draft.entries){
  assert.deepEqual(Object.keys(e.levels),['6-8','9-11','12-14']);
  assert.equal(new Set(Object.values(e.levels).map(l=>l.kind)).size,3);
  for(const l of Object.values(e.levels)){assert.ok(l.task.length>35);assert.ok(l.hint.length>35);assert.ok(l.feedback.length>35);prompts.push(l.task);hints.push(l.hint);}
 }
 assert.equal(new Set(prompts).size,72,'no single generic prompt cloned across animal subjects');
 assert.equal(new Set(hints).size,72,'voluntary hints are authored for their actual question');
});

test('known source pitfalls remain explicit blocking limits, never ready or invented scientific guarantees',()=>{
 const find=id=>draft.entries.find(e=>e.id==='animal-'+id);
 assert.match(find('walrus').limits,/zusätzlichen artspezifischen Quelle/);
 assert.match(find('short-beaked-echidna').limits,/gruppenweite Gefährdung/);
 assert.match(find('north-american-beaver').limits,/nicht Castor fiber/);
 assert.match(find('eastern-clown-anemonefish').limits,/ocellaris/);
 assert.match(find('short-snouted-seahorse').limits,/NICHT übernehmen/);
 assert.match(find('european-eel').limits,/nicht als direkt beobachtetes/);
});
