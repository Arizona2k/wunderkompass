import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {topicMapGroups} from '../app/topic-map-layout.mjs';
import React from 'react';import * as jsx from 'react/jsx-runtime';import {renderToStaticMarkup} from 'react-dom/server';import ts from 'typescript';
import path from 'node:path';import os from 'node:os';import {createHash} from 'node:crypto';
import {learningFingerprint} from '../build/learning-fingerprint.mjs';
import {assertCurrentHistoryEvidenceRuntime,withHistoryEvidencePredecessorRuntime} from './history-evidence-runtime-reference.mjs';
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

test('every real map location has a stable distinct return opener while compact maps remain noninteractive',()=>{
 const source=fs.readFileSync('app/topic-map.tsx','utf8'),code=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,module={exports:{}};
 new Function('require','module','exports',code)(name=>{if(name==='react/jsx-runtime')return jsx;if(name==='./topic-map-layout.mjs')return{topicMapGroups};if(name==='./topic-map.css')return{};throw Error('Unexpected map dependency '+name);},module,module.exports);
 const render=(entry,compact=false)=>renderToStaticMarkup(React.createElement(module.exports.default,{entry,onPlace:()=>{},compact}));
 const all=[];
 for(const topic of catalog){
  const markup=render(topic),keys=[...markup.matchAll(/data-route-focus="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(keys,topic.locations.map((_p,i)=>'world-map-'+topic.id+'-'+i),'the actual rendered map keeps one stable opener per ordered destination');all.push(...keys);
  assert.equal(/<button\b/.test(render(topic,true)),false,'a compact map inside a card never adds an interactive child');
 }
 assert.equal(new Set(all).size,all.length,'same labels or nearby points in different topics cannot collide');
});
test('the exact map/reading/resume originals recover all741 previous runtime bodies while mixed old/current controls cannot pass or masquerade as M94',()=>{
 const boundary=JSON.parse(fs.readFileSync('tests/fixtures/history-evidence-M94-predecessor.json','utf8')),layer=boundary.mapReadingReturnCorrection20261109;
 assert.equal(layer.previousCurrentRuntimeBuild,'ab8dd03876b3985b');assert.equal(layer.previousCurrentInputs.length,741);assert.deepEqual(layer.replacedInputs.map(r=>r.file),['app/activity-view.mjs','app/hash-route.ts','app/topic-map.css','app/topic-map.tsx']);
 const current=assertCurrentHistoryEvidenceRuntime(process.cwd()),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'wk-map-exact-originals-')),sha=b=>createHash('sha256').update(b).digest('hex');
 const link=(from,to)=>{try{fs.linkSync(from,to);}catch(e){if(e.code!=='EXDEV')throw e;fs.copyFileSync(from,to);}};
 try{
  for(const [name,from]of current){const dest=path.join(temporary,name);fs.mkdirSync(path.dirname(dest),{recursive:true});link(from,dest);}
  for(const row of layer.replacedInputs){
   const file=path.join(temporary,row.file),body=Buffer.from(row.originalUTF8);assert.equal(body.length,row.beforeBytes);assert.equal(sha(body),row.beforeSHA256);
   fs.unlinkSync(file);fs.writeFileSync(file,body);assert.throws(()=>assertCurrentHistoryEvidenceRuntime(temporary),'one old control mixed into the current UI cannot qualify');
   let inspected;withHistoryEvidencePredecessorRuntime(temporary,p=>{inspected=p;});assert.equal(inspected,temporary,'an unknown mixed UI is not projected to the accepted historical build');
   fs.unlinkSync(file);link(current.get(row.file),file);
  }
  for(const row of layer.replacedInputs){const file=path.join(temporary,row.file);fs.unlinkSync(file);fs.writeFileSync(file,row.originalUTF8);}
  for(const row of layer.previousCurrentInputs){const body=fs.readFileSync(path.join(temporary,row.file));assert.equal(body.length,row.bytes);assert.equal(sha(body),row.sha256,row.file+' exact whole prior input');}
  assert.equal(learningFingerprint(temporary),layer.previousCurrentRuntimeBuild,'the actual full741-file prior build, not a relabelled current result');
 }finally{fs.rmSync(temporary,{recursive:true,force:false});}
});
