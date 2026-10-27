import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DISCOVERY_CONNECTIONS} from '../app/discovery-data.ts';
import {KNOWLEDGE_CONNECTIONS,connectionsFor} from '../app/knowledge-connections.ts';
import {dailyDiscovery,differentDiscovery,discoveryVisit,localDiscoveryDay,DISCOVERY_IDLE_MS} from '../app/discovery-visit.mjs';
import {execFileSync} from 'node:child_process';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const topics=read('../app/world-catalog.json'),routes=read('../exports/content/world-routes.json');

test('discovery trails have live, reciprocal knowledge edges and relevant existing routes',()=>{
 assert.equal(new Set(DISCOVERY_CONNECTIONS.map(c=>c.id)).size,DISCOVERY_CONNECTIONS.length);
 for(const trail of DISCOVERY_CONNECTIONS){
  const edge=KNOWLEDGE_CONNECTIONS.find(c=>c.id===trail.id);assert.ok(edge,trail.id);
  for(const [id,neighbor] of [[edge.fromId,edge.toId],[edge.toId,edge.fromId]]){
   const topic=topics.find(t=>t.id===id);assert.ok(topic,id);assert.ok(topic.related.includes(neighbor),id+' reverse link');
   assert.ok(connectionsFor(id).some(c=>c.topic===neighbor&&c.why===edge.why));
  }
  const route=routes.find(r=>r.id===trail.routeId);assert.ok(route,trail.routeId);
  assert.ok(route.topics.includes(edge.fromId)||route.topics.includes(edge.toId),'route continues the selected connection');
  assert.equal(new Set(route.topics).size,route.topics.length);
  for(const id of route.topics)assert.ok(topics.some(t=>t.id===id),id);
 }
});

test('Home photo questions grow from the canonical article and existing rights metadata without a separate content collection',()=>{
 const index=read('../app/world-index.json'),photos=read('../app/world-photos.json'),core=read('../app/world-photo-core.json');let eligible=0;
 for(const entry of index){const topic=topics.find(t=>t.id===entry.id);assert(topic,entry.id);
  if(entry.image&&photos[entry.image]&&!entry.sensitive&&!topic.history?.sensitive){eligible++;assert.equal(entry.image,topic.image);assert.equal(entry.homeQuestion,topic.question.prompt);assert.deepEqual(entry.homePhoto??core[entry.image],photos[entry.image],'every eligible Home motif has complete immediate canonical rights metadata');if(core[entry.image])assert.equal(entry.homePhoto,undefined,'reuse the six existing immediate credits without duplicating them');for(const field of['author','license','license_url','source_page_url','alt_de'])assert(photos[entry.image][field],entry.image+' '+field);}
  else{assert.equal(entry.homeQuestion,undefined);assert.equal(entry.homePhoto,undefined);}
 }
 assert(eligible>1,'several actual published motifs permit variety');
});

test('Home connection selection grows from canonical edges sharing a published route',()=>{
 const projection=read('../app/discovery-connections.json'),index=read('../app/world-index.json');assert(projection.length>DISCOVERY_CONNECTIONS.length);
 for(const edge of projection){const original=KNOWLEDGE_CONNECTIONS.find(c=>c.id===edge.id),route=routes.find(r=>r.id===edge.routeId);assert(original);for(const key of ['fromId','toId','kind','why','checkedAt'])assert.equal(edge[key],original[key]);const curated=DISCOVERY_CONNECTIONS.find(t=>t.id===edge.id);if(curated){assert.equal(route.id,curated.routeId);assert(route.topics.includes(edge.fromId)||route.topics.includes(edge.toId),'preserve the existing thematic continuation');}else assert(route.topics.includes(edge.fromId)&&route.topics.includes(edge.toId));for(const id of [edge.fromId,edge.toId])assert(index.some(t=>t.id===id&&!t.sensitive));assert(edge.question&&edge.label);assert.equal(edge.question,curated?.question??topics.find(t=>t.id===edge.fromId).question.prompt,'use an actual published question, not a sentence generated from article titles');}
 const expected=KNOWLEDGE_CONNECTIONS.filter(c=>routes.some(r=>r.topics.includes(c.fromId)&&r.topics.includes(c.toId))&&[c.fromId,c.toId].every(id=>index.some(t=>t.id===id&&!t.sensitive))).map(c=>c.id).sort();assert.deepEqual(projection.map(c=>c.id).sort(),expected);
});

const pools={heroes:['bee','elephant','bridge'],trails:['moon-sea','bee-flower','reef'],random:()=>0};
const saved={heroId:'bee',trailId:'moon-sea',lastInputAt:1000,idleDue:false};
test('the local daily choice survives corpus growth/reordering for that day and safely replaces retired or malformed IDs',()=>{
 const day='2026-10-27',ids=['world:bee','nature:reef'],saved={day,id:'nature:reef',tracking:'discard'};
 assert.deepEqual(dailyDiscovery(day,saved,'world:bee',['world:new',...ids].reverse()),{day,id:'nature:reef'});
 assert.deepEqual(dailyDiscovery('2026-10-28',saved,'world:bee',ids),{day:'2026-10-28',id:'world:bee'});
 for(const stored of [null,[],{day,id:'world:retired'},{day,id:5}])assert.deepEqual(dailyDiscovery(day,stored,'world:bee',ids),{day,id:'world:bee'});
 assert.throws(()=>dailyDiscovery(day,saved,'missing',ids));
});
test('a new opening changes suitable discoveries while reload and history restore the actual previous entry',()=>{
 const first=discoveryVisit(null,{type:'open',now:1000},pools);assert.equal(first.heroId,'bee');assert.equal(first.trailId,'moon-sea');
 const opened=discoveryVisit(saved,{type:'open',now:1001},pools);assert.notEqual(opened.heroId,saved.heroId);assert.notEqual(opened.trailId,saved.trailId);
 const reloaded=discoveryVisit(saved,{type:'reload',now:1001},pools);assert.equal(reloaded.heroId,saved.heroId);assert.equal(reloaded.trailId,saved.trailId);
 const restored=discoveryVisit(opened,{type:'history',now:1002,selection:saved},pools);assert.equal(restored.heroId,saved.heroId);assert.equal(restored.trailId,saved.trailId);
 assert.deepEqual(saved,{heroId:'bee',trailId:'moon-sea',lastInputAt:1000,idleDue:false},'do not mutate stored snapshots');
});
test('thirty idle minutes never replace current reading; only the next deliberate Home entry consumes the pending visit',()=>{
 const almost=discoveryVisit(saved,{type:'home',now:1000+DISCOVERY_IDLE_MS-1},pools);assert.equal(almost.heroId,saved.heroId);
 const reading=discoveryVisit(saved,{type:'activity',now:1000+DISCOVERY_IDLE_MS},pools);assert.equal(reading.heroId,saved.heroId);assert.equal(reading.trailId,saved.trailId);assert.equal(reading.idleDue,true);
 const reloaded=discoveryVisit(reading,{type:'reload',now:1000+DISCOVERY_IDLE_MS+1},pools);assert.equal(reloaded.heroId,saved.heroId);assert.equal(reloaded.idleDue,true);
 const home=discoveryVisit(reloaded,{type:'home',now:1000+DISCOVERY_IDLE_MS+2},pools);assert.notEqual(home.heroId,saved.heroId);assert.notEqual(home.trailId,saved.trailId);assert.equal(home.idleDue,false);
});
test('ongoing real activity postpones a new visit; a manual choice is stable across reload and Back',()=>{
 let state=saved;for(let i=1;i<=6;i++)state=discoveryVisit(state,{type:'activity',now:1000+i*10*60*1000},pools);
 const home=discoveryVisit(state,{type:'home',now:state.lastInputAt+1},pools);assert.equal(home.heroId,saved.heroId);
 const picked=discoveryVisit(home,{type:'hero',id:'bridge',now:state.lastInputAt+2},pools);assert.equal(picked.trailId,home.trailId);assert.equal(picked.heroId,'bridge');
 const trail=discoveryVisit(picked,{type:'trail',id:'reef',now:state.lastInputAt+3},pools);assert.equal(trail.heroId,'bridge');assert.equal(trail.trailId,'reef');
 const back=discoveryVisit(trail,{type:'history',selection:saved,now:state.lastInputAt+4},pools);assert.equal(back.heroId,'bee');assert.equal(back.trailId,'moon-sea');
});
test('choice pools grow without immediately repeating; removed and malformed UI IDs cannot escape the live pools',()=>{
 assert.equal(differentDiscovery(['only'],'only',()=>1),'only');assert.notEqual(differentDiscovery(pools.heroes,'bee',()=>1),'bee');
 assert.equal(differentDiscovery(['old','new'],'old',()=>NaN),'new');assert.throws(()=>differentDiscovery([],null));assert.throws(()=>differentDiscovery(['same','same'],null));
 const repaired=discoveryVisit({heroId:'retired',trailId:{},lastInputAt:NaN,identifier:'must-not-be-copied',log:['must-not-be-copied']},{type:'reload',now:10,selection:{heroId:'unknown',trailId:'reef'}},pools);assert(pools.heroes.includes(repaired.heroId));assert.equal(repaired.trailId,'reef');
 assert.equal('identifier' in repaired,false);assert.equal('log' in repaired,false);
});
test('the daily key follows local midnight and DST rather than the UTC day or elapsed24-hour blocks',()=>{
 const script=`import{localDiscoveryDay}from'./app/discovery-visit.mjs';console.log(JSON.stringify(['2026-10-26T23:30:00Z','2026-10-25T00:30:00Z','2026-10-25T01:30:00Z'].map(t=>localDiscoveryDay(new Date(t)))));`;
 const run=zone=>JSON.parse(execFileSync(process.execPath,['--input-type=module','-e',script],{cwd:new URL('..',import.meta.url),env:{...process.env,TZ:zone},encoding:'utf8'}));
 const berlin=run('Europe/Berlin'),losAngeles=run('America/Los_Angeles');assert.equal(berlin[0].key,'2026-10-27');assert.equal(losAngeles[0].key,'2026-10-26');assert.equal(berlin[1].key,'2026-10-25');assert.deepEqual(berlin[1],berlin[2]);
 const before=localDiscoveryDay(new Date(2026,9,24,23,59)),after=localDiscoveryDay(new Date(2026,9,25,0,0));assert.equal(after.ordinal-before.ordinal,1);
});
