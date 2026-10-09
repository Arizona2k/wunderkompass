import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DISCOVERY_CONNECTIONS} from '../app/discovery-data.ts';
import {KNOWLEDGE_CONNECTIONS,connectionsFor} from '../app/knowledge-connections.ts';
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
