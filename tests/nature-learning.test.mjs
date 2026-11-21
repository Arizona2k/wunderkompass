import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateNatureLearning,natureContent} from '../scripts/nature-content-index.mjs';
import {bookLookup,bookLookupFocus,initialBookView} from '../app/book-location.ts';
import {GLOSSARY} from '../app/learning-data.ts';
import {NATURE,hasNatureLearning} from '../app/nature-data.ts';
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const pack=read('app/nature-learning-content.json'),places=NATURE,words=GLOSSARY;

test('34 individually explained landscapes extend the canonical Nature inventory',()=>{
 assert.equal(places.length,74);assert.equal(Object.keys(pack).length,34);
 assert.equal(new Set(places.map(p=>p.id)).size,74);
 assert.equal(places.filter(p=>p.category!=='animals').length,68);
 const explained=places.slice(-Object.keys(pack).length);
 assert.deepEqual(new Set(explained.map(p=>p.id)),new Set(Object.keys(pack)),'explained places follow the existing inventory');
 assert.deepEqual(places.filter(p=>hasNatureLearning(p.id)),explained);
 assert.deepEqual(natureContent(true,{places,words}),pack);
});

test('every authored word and place edge has its actual existing target and derived incoming return link',()=>{
 const wordLinks=read('app/nature-word-links.json'),placeLinks=read('app/nature-place-links.json');
 for(const[id,item]of Object.entries(pack)){
  for(const link of item.learning.relatedWords)assert(wordLinks[link.term].some(edge=>edge.id===id&&edge.reason===link.reason));
  for(const link of item.learning.relatedNature)assert(pack[link.id]?.learning.relatedNature.some(edge=>edge.id===id)||placeLinks[link.id].some(edge=>edge.id===id&&edge.reason===link.reason));
 }
 for(const links of [...Object.values(wordLinks),...Object.values(placeLinks)])for(const link of links)assert.equal(places.find(p=>p.id===link.id)?.name,link.name);
});

test('unbound claims, broken target links, incomplete feedback and private evidence cannot silently enter public Nature content',()=>{
 const bad=[p=>{p.tanganyika.learning.claims[0].sourceIndex=99;},p=>{p.tanganyika.learning.relatedWords[0].term='Nichtvorhandenes Wort';},p=>{p.tanganyika.learning.relatedNature[0].id='missing-place';},p=>{const q=p.tanganyika.learning.question;q.wrongReasons[(q.correct+1)%3]='';},p=>{p.tanganyika.learning.sources[0].actualReadEvidence=['private'];},p=>{p.tanganyika.learning.sources[0].checkedOn='2026-02-30';}];
 for(const mutate of bad){const copy=structuredClone(pack);mutate(copy);assert.throws(()=>validateNatureLearning(copy,{places,words}));}
});

test('existing German word/Why routes and saved reading views remain intact while Nature gains a native deep route',()=>{
 for(const[tab,term,prefix]of[['words','Wärme','book-word-target-'],['why','Warum ist das Meer salzig?','book-why-target-'],['nature','galapagos-upwelling','book-nature-target-']]){
  const route='book/'+tab+'/'+encodeURIComponent(term),lookup=bookLookup(route);assert.deepEqual(lookup,{tab,term});assert.equal(bookLookupFocus(lookup),prefix+term);assert.equal(initialBookView(route).tab,tab);assert.equal(initialBookView(route).query,tab==='words'?term:'');
  const saved={...initialBookView(route),natureLimit:72,wordLimit:48,query:'eigene Suche',letter:'W'};assert.deepEqual(initialBookView(route,saved),saved);
 }
 assert.deepEqual(bookLookup('book/nature'),{tab:'nature',term:''});assert.equal(bookLookupFocus(bookLookup('book/nature')),undefined);
 for(const route of['book/nature/%ZZ','world/nature/foo','book/words','book/why','book/unknown/foo'])assert.equal(bookLookup(route),undefined);
});
