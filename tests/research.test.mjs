import {createSave,restoreSave,emptyProgress} from '../app/progress-storage.ts';
import test from 'node:test';import assert from 'node:assert/strict';
import {seasonalSun,moonObservation,moonAlignment,tideHeight,summarizeLab} from '../app/research-math.ts';
import {LAB_SEARCH,EXPERIMENT_SEARCH,EXPERIMENT_RESEARCH,RESEARCH_QUESTIONS,RESEARCH_PATHS} from '../app/research-catalog.ts';
import FEEDBACK from '../app/research-feedback.json' with {type:'json'};
import LABS from '../exports/content/laboratories.json' with {type:'json'};
import WORLD_INDEX from '../app/world-index.json' with {type:'json'};
import WORLD_ROUTES from '../exports/content/world-routes.json' with {type:'json'};
import JOURNEYS from '../exports/content/journeys.json' with {type:'json'};
import {DISCOVERY_CONNECTIONS,DISCOVERY_ACTIVITIES} from '../app/discovery-data.ts';
import {KNOWLEDGE_CONNECTIONS,connectionsFor} from '../app/knowledge-connections.ts';
test('seasonal geometry has opposing hemispheres, polar nights and no false daily rotation effect',()=>{
 const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} ≈ ${b}`);
 for(const latitude of [-80,-70,-52,-34,0,34,52,70,80])for(let m=0;m<4;m++){
  const a=seasonalSun(latitude,m),b=seasonalSun(-latitude,m);close(a.daylight+b.daylight,24);close(seasonalSun(latitude,m,false).daylight,12);assert.ok(Number.isFinite(a.noonAltitude));
 }
 assert.ok(seasonalSun(52,1).daylight>seasonalSun(52,3).daylight);assert.equal(seasonalSun(70,1).daylight,24);assert.equal(seasonalSun(70,3).daylight,0);
 close(seasonalSun(0,1).daylight,12);close(seasonalSun(52,0).noonAltitude,38);
});
test('moon month and half-lit disc distinguish phase from inclination and eclipse alignment',()=>{
 assert.equal(moonObservation(0).illuminated,0);assert.equal(moonObservation(180).illuminated,1);assert.ok(Math.abs(moonObservation(90).illuminated-.5)<1e-12);
 assert.deepEqual(moonObservation(-90),moonObservation(270));assert.deepEqual(moonObservation(450),moonObservation(90));
 assert.equal(moonAlignment(180,90).nearNode,false);assert.equal(moonAlignment(180,0).nearNode,true);assert.equal(moonAlignment(90,90).alignment,'other');assert.equal(moonAlignment(0,90,false).nearNode,true);
 assert.ok(moonObservation(359).day<29.53);assert.equal(moonObservation(270).waxing,false);
});
test('harmonic tide comparison retains water-level variation at quarter moon and a time lag',()=>{
 assert.ok(tideHeight(0,false)>tideHeight(0,true));assert.ok(tideHeight(0,true)>0);assert.equal(tideHeight(6,false,6),tideHeight(0,false,0));
 for(const q of [false,true])for(let h=0;h<25;h+=.25)assert.ok(Number.isFinite(tideHeight(h,q))&&Math.abs(tideHeight(h,q))<=1.46+1e-9);
 assert.match(summarizeLab('depth',{depth:3000}),/flüssig/);assert.match(summarizeLab('depth',{depth:1000}),/überwiegend fest/);
});
test('all eleven lab paths and all three substantive inquiry tiers lead to actual retained content',()=>{
 assert.equal(LAB_SEARCH.length,11);assert.equal(EXPERIMENT_SEARCH.length,6);
 for(const lab of LAB_SEARCH){const p=RESEARCH_PATHS[lab.id];assert.ok(p.task&&p.hint&&p.legend.length);assert.ok(p.book||WORLD_INDEX.some(t=>t.id===p.topic),p.topic);assert.ok(JOURNEYS.some(j=>j.id===p.journey),p.journey);assert.ok(LAB_SEARCH.some(l=>l.id===p.next));if(p.experiment)assert.ok(EXPERIMENT_SEARCH.some(e=>e.id===p.experiment));
  for(const level of ['medium','hard']){const q=RESEARCH_QUESTIONS[lab.id][level];assert.ok(q.prompt&&q.hint&&q.why&&q.wrong);assert.ok(q.correct>=0&&q.correct<q.answers.length);assert.equal(new Set(q.answers).size,q.answers.length);assert.notEqual(q.wrong,q.why);}
  assert.notEqual(RESEARCH_QUESTIONS[lab.id].medium.prompt,RESEARCH_QUESTIONS[lab.id].hard.prompt);
 }
});
test('all33 retained laboratory questions explain each of66 wrong choices independently without changing correct-answer positions',()=>{
 assert.deepEqual(Object.keys(FEEDBACK).sort(),LABS.map(l=>l.id).sort());
 for(const lab of LABS)for(const level of ['easy','medium','hard']){
  const q=level==='easy'?lab:RESEARCH_QUESTIONS[lab.id][level],reasons=FEEDBACK[lab.id][level];assert.equal(reasons.length,q.answers.length);assert.equal(reasons[q.correct],'');assert.equal(new Set(reasons.filter(Boolean)).size,q.answers.length-1);
  for(let i=0;i<q.answers.length;i++)if(i!==q.correct){assert.ok(reasons[i].length>40);assert.notEqual(reasons[i],q.why);assert.ok(!/[<>\u0000-\u0008]/u.test(reasons[i]));}
 }
});
test('varied homepage knowledge trails use real bidirectional edges, actual routes and concrete activities',()=>{
 assert.ok(DISCOVERY_CONNECTIONS.length>3);assert.equal(DISCOVERY_ACTIVITIES.length,DISCOVERY_CONNECTIONS.length);
 for(const pick of DISCOVERY_CONNECTIONS){const edge=KNOWLEDGE_CONNECTIONS.find(c=>c.id===pick.id);assert.ok(edge);assert.ok(connectionsFor(edge.fromId).some(c=>c.topic===edge.toId));assert.ok(connectionsFor(edge.toId).some(c=>c.topic===edge.fromId));assert.ok(WORLD_ROUTES.some(r=>r.id===pick.routeId));}
 for(const a of DISCOVERY_ACTIVITIES){const [area,id,experiment]=a.hash.split('/');assert.ok(a.text.length>40&&a.title.length>10);if(area==='labs')assert.ok(id==='experiment'?EXPERIMENT_SEARCH.some(e=>e.id===experiment):LAB_SEARCH.some(l=>l.id===id));if(area==='journeys')assert.ok(JOURNEYS.some(j=>j.id===id));}
});

test('A/B observations name all weather choices and include the new moon and coast conditions',()=>{assert.match(summarizeLab('weather',{weather:'storm'}),/Gewitter/);assert.match(summarizeLab('weather',{weather:'tornado'}),/Tornado/);assert.notEqual(summarizeLab('moon',{angle:180,moonNode:0}),summarizeLab('moon',{angle:180,moonNode:90}));assert.notEqual(summarizeLab('moon',{moonInclined:true}),summarizeLab('moon',{moonInclined:false}));assert.match(summarizeLab('tides',{tideDelay:2}),/Zeitversatz 2 h/);assert.match(summarizeLab('solar',{planet:'neptune',days:4}),/Neptun, Zeit 4 Tage/);});

test('schema-3 backup roundtrip retains old lab answers and every new research field',()=>{const progress=emptyProgress();progress.labs=['moon'];progress.chapters.water=2;progress.settings.largeText=true;progress.settings.readVoice='';progress.gameSessions['lab:moon']={angle:180,answer:2,researchPrediction:'Synthetische Vermutung',researchCompareA:'Erste Beobachtung',researchCompareB:'Zweite Beobachtung',researchJournal:'Synthetische eigene Erklärung',researchMission:7,researchLevel:'hard','researchAnswer-hard':1,moonNode:90,moonInclined:false};const restored=restoreSave(JSON.parse(JSON.stringify(createSave(progress))),true);assert.equal(restored.schemaVersion,3);assert.deepEqual(restored.progress,progress);});

test('all six practical experiments have distinct safe comparisons and scientific limits',()=>{assert.deepEqual(Object.keys(EXPERIMENT_RESEARCH),EXPERIMENT_SEARCH.map(e=>e.id));for(const field of ['safety','prediction','comparison','limit'])assert.equal(new Set(Object.values(EXPERIMENT_RESEARCH).map(e=>e[field])).size,6);assert.match(EXPERIMENT_RESEARCH['foam-volcano'].safety,/niemals verschließen/);assert.match(EXPERIMENT_RESEARCH.evaporation.limit,/gleichzeitig verschieden/);assert.match(EXPERIMENT_RESEARCH.condensation.comparison,/im selben Raum/);});
