import test from 'node:test';import assert from 'node:assert/strict';
import catalog from '../app/world-catalog.json' with {type:'json'};
import {worldGameBank} from '../app/world-game-bank.ts';
import {animalDetectiveClue,worldGameHint,worldGameWrongFeedback} from '../app/world-game-support.mjs';
import {foodDistractors} from '../app/world-game-food.mjs';
import {execFileSync} from 'node:child_process';
const animals=catalog.filter(t=>t.animal),normalize=s=>s.normalize('NFKD').replace(/\p{M}/gu,'').toLocaleLowerCase('de').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
test('plain Node resolves the changed banks and production browser regression modules without a loader hook',()=>{
 const env={...process.env};delete env.NODE_OPTIONS;
 const script=`import{worldGameBank}from'./app/world-game-bank.ts';import'./tests/browser/world-game-offline-semantics.mjs';import'./tests/browser/habitat-answer-semantics.mjs';import'./tests/browser/world-game-learning-copy.mjs';console.log(JSON.stringify(['animal-detective','habitats','food'].map(id=>worldGameBank(id).length)));`;
 assert.deepEqual(JSON.parse(execFileSync(process.execPath,['--input-type=module','-e',script],{cwd:new URL('..',import.meta.url),env,encoding:'utf8'})),[48,48,48]);
});
const common={
 'animal-african-savanna-elephant':['Elefant'], 'animal-giant-panda':['Panda'], 'animal-western-lowland-gorilla':['Gorilla'], 'animal-bornean-orangutan':['Orang-Utan','Orangutan'], 'animal-emperor-penguin':['Pinguin'], 'animal-common-bottlenose-dolphin':['Delfin','Delphin'], 'animal-common-octopus':['Krake','Oktopus'], 'animal-green-sea-turtle':['Schildkröte'], 'animal-red-kangaroo':['Känguru'], 'animal-honey-bee':['Biene'], 'animal-garden-cross-spider':['Spinne','Kreuzspinne'], 'animal-white-tailed-eagle':['Adler'], 'animal-short-beaked-echidna':['Ameisenigel'], 'animal-north-american-beaver':['Biber'], 'animal-red-fox':['Fuchs'], 'animal-hedgehog':['Igel'], 'animal-barn-owl':['Eule'], 'animal-ostrich':['Strauß'], 'animal-common-chameleon':['Chamäleon'], 'animal-fire-salamander':['Salamander'], 'animal-common-frog':['Frosch'], 'animal-eastern-clown-anemonefish':['Clownfisch','Anemonenfisch'], 'animal-european-eel':['Aal'], 'animal-garden-snail':['Schnecke','Weinbergschnecke'], 'animal-european-lobster':['Hummer'], 'animal-common-cuttlefish':['Sepia','Tintenfisch'], 'animal-short-snouted-seahorse':['Seepferdchen']
};
test('all48 animal riddles and optional hints omit the target name, recorded aliases and common name variants',()=>{
 const pool=worldGameBank('animal-detective');assert.equal(pool.length,48);assert.deepEqual(pool.map(q=>q.id),animals.map(t=>t.id));
 for(const q of pool){const t=animals.find(t=>t.id===q.id),text=' '+normalize(q.prompt+' '+worldGameHint('animal-detective',q))+' ';assert.equal(q.answers[q.correct],t.title);for(const name of [t.title,...t.aliases,...(common[t.id]??[])])assert(!text.includes(' '+normalize(name)+' '),t.id+' leaks '+name);assert.notEqual(worldGameHint('animal-detective',q),q.why);}
 assert.throws(()=>animalDetectiveClue('new-unreviewed-animal'));
});
test('the former name-revealing walrus and cuttlefish riddles now compare observable features',()=>{
 const pool=worldGameBank('animal-detective'),walrus=pool.find(q=>q.id==='animal-walrus'),sepia=pool.find(q=>q.id==='animal-common-cuttlefish');assert.match(walrus.prompt,/Tastborsten/);assert.match(walrus.prompt,/Meeresboden/);assert.match(sepia.prompt,/acht Arme/);assert.match(sepia.prompt,/zwei längere Fangtentakel/);assert.match(sepia.prompt,/seitliche Flossen/);assert(!sepia.prompt.includes('Gewöhnlicher Krake'));
});
test('food alternatives compare complete descriptions including mixed diets and life stages',()=>{
 const pool=worldGameBank('food');assert.equal(pool.length,48);for(const q of pool){assert.equal(q.answers[q.correct],animals.find(t=>t.id===q.id).animal.diet);assert.equal(new Set(q.answers).size,3);}
 const raccoon=pool.find(q=>q.id==='animal-raccoon');assert(!raccoon.answers.includes('Fische und Tintenfische'));assert(raccoon.answers.includes('Ausschließlich pflanzliche Nahrung'));assert(raccoon.answers.includes('Ausschließlich tierische Nahrung'));
 const monarch=pool.find(q=>q.id==='animal-monarch-butterfly');assert.match(monarch.answers[monarch.correct],/Raupen: Seidenpflanzen; Falter: Nektar/);assert(monarch.answers.slice(1).every(a=>a.startsWith('In allen Lebensphasen ausschließlich')));assert.match(pool.find(q=>q.id==='animal-green-sea-turtle').answers[0],/erwachsenes Tier/);assert.throws(()=>foodDistractors('new-unreviewed-animal'));
});
test('thinking hint and wrong feedback are separate from the final explanation in every round family',()=>{
 for(const game of ['animal-detective','habitats','food','records','people','technology','then-now'])for(const q of worldGameBank(game)){
  const hint=worldGameHint(game,q),wrong=q.answers.find((_,i)=>i!==q.correct),feedback=worldGameWrongFeedback(game,q,wrong);assert(hint.length>20);assert(feedback.length>20);assert.notEqual(hint,q.why);assert.notEqual(feedback,q.why);
 }
 const walrus=worldGameBank('habitats').find(q=>q.id==='animal-walrus');assert.match(walrus.why,/Arktische Küsten und Meere/);assert.match(worldGameWrongFeedback('habitats',walrus,walrus.answers[1]),/ohne Gewässer/);
});
