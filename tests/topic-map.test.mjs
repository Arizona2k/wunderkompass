import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {topicMapGroups} from '../app/topic-map-layout.mjs';
const catalog=JSON.parse(fs.readFileSync('app/world-catalog.json','utf8'));
test('the existing world-map family retains every named location exactly once without modifying its coordinates or order',()=>{
 for(const topic of catalog){const locations=structuredClone(topic.locations),snapshot=JSON.stringify(locations),groups=topicMapGroups(locations);assert.deepEqual(groups.flatMap(g=>g.members.map(m=>m.index)).sort((a,b)=>a-b),locations.map((_p,i)=>i));assert.equal(JSON.stringify(locations),snapshot);for(const g of groups){assert.ok(Number.isFinite(g.x)&&Number.isFinite(g.y));assert.ok(g.x>=48&&g.x<=752&&g.y>=48&&g.y<=370);assert.equal(g.label,g.members.map(m=>m.index+1).join('&'));for(const m of g.members)assert.equal(m.label,locations[m.index].label);}}
});
test('nearby actual biography places share an overview marker while the exact individual destinations remain available',()=>{
 const close=topicMapGroups(catalog.find(t=>t.id==='person-bertha_benz').locations);assert.equal(close.length,1);assert.equal(close[0].label,'1&2');assert.deepEqual(close[0].members.map(m=>m.index),[0,1]);
 const far=topicMapGroups(catalog.find(t=>t.id==='person-albert_einstein').locations);assert.equal(far.length,2);assert.deepEqual(far.map(g=>g.label),['1','2']);
 const computers=topicMapGroups(catalog.find(t=>t.id==='invention-computer').locations);assert.deepEqual(computers.map(g=>g.members.map(m=>m.index)),[[0],[1,2]]);
});
test('the clean reproducible background has geography without inherited continent numbers, captions or duplicated location labels',()=>{
 const svg=fs.readFileSync('public/maps/world-context.svg','utf8');assert.ok(svg.includes('viewBox="0 0 800 450"'));assert.ok((svg.match(/<path /g)||[]).length>=200);assert.ok(!/<text\b|<image\b|<script\b/.test(svg));
});
test('invalid coordinates cannot silently produce an invented map point',()=>{
 for(const p of [{lat:NaN,lon:0},{lat:0,lon:Infinity},{lat:91,lon:0},{lat:0,lon:-181}])assert.throws(()=>topicMapGroups([{label:'invalid',...p}]),RangeError);
});
