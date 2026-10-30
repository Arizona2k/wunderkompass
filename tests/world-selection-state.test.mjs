import test from 'node:test';
import assert from 'node:assert/strict';
import {habitatFilterLabel,worldSelectionCategory,resolveWorldSelection} from '../app/world-selection-state.mjs';
const categories=[{id:'animals'},{id:'science'}];
const original={route:'world/animals/page/2',query:'Meer',group:'Säugetiere',habitat:'Meere',timelineSelection:{era:'Alle',index:0}};
test('Back/Forward/Reload recover the exact list snapshot without unknown or personal fields',()=>{
 const saved={...original,unexpectedPrivateText:'must not be retained'};
 const actual=resolveWorldSelection(original.route,{...original,query:'different',group:'Alle'},saved,categories);
 assert.deepEqual(actual,original);assert.ok(!('unexpectedPrivateText' in actual));
 assert.deepEqual(saved,{...original,unexpectedPrivateText:'must not be retained'});
});
test('new page inherits current filters; a different category and direct entry use honest defaults',()=>{
 assert.deepEqual(resolveWorldSelection('world/animals/page/3',original,null,categories),{...original,route:'world/animals/page/3'});
 for(const route of ['world/science','world/animals/page/4']){
  const actual=resolveWorldSelection(route,null,null,categories);assert.equal(actual.query,'');assert.equal(actual.group,'Alle');assert.equal(actual.habitat,'Alle');assert.equal(actual.route,route);
 }
 assert.equal(resolveWorldSelection('world/science',original,null,categories).query,'');
});
test('malformed or unrelated saved context cannot invent a category or override the current route',()=>{
 for(const route of [undefined,'world/topic/animal-orca','world/animals/page/0','world/animals/page/01','world/unknown','https://example.com'])assert.equal(worldSelectionCategory(route,categories),null);
 for(const patch of [{query:null},{group:3},{habitat:[]},{timelineSelection:{era:'Alle',index:-1}},{timelineSelection:{era:'Alle',index:0.5}}]){
  const actual=resolveWorldSelection(original.route,null,{...original,...patch},categories);assert.equal(actual.query,'');assert.equal(actual.habitat,'Alle');
 }
 const actual=resolveWorldSelection('world/science',null,original,categories);assert.equal(actual.route,'world/science');assert.equal(actual.query,'');
});

test('only the two reviewed habitat wording pairs share a filter label',()=>{
 assert.equal(habitatFilterLabel('Wiesen & Gärten'),'Wiesen und Gärten');
 assert.equal(habitatFilterLabel('Wiesen und Gärten'),'Wiesen und Gärten');
 assert.equal(habitatFilterLabel('Flüsse & Seen'),'Flüsse und Seen');
 assert.equal(habitatFilterLabel('Flüsse und Seen'),'Flüsse und Seen');
 for(const label of ['Alle','Arktis','Antarktis','Meer','Flussufer','Regenwald','Wiesen & Wälder','Flüsse und Küsten',''])assert.equal(habitatFilterLabel(label),label);
});
