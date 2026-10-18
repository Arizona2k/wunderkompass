import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
const read=path=>JSON.parse(fs.readFileSync(new URL(path,import.meta.url),'utf8'));
const topics=read('../app/world-catalog.json'),index=read('../app/world-index.json'),photos=read('../app/world-photos.json'),baseline=read('./fixtures/baseline-topics.json');
test('all original topics and categories survive editorial expansion',()=>{
 for(const old of baseline){const current=topics.find(t=>t.id===old.id);assert.ok(current,old.id);assert.equal(current.category,old.category);}
 assert.equal(new Set(topics.map(t=>t.id)).size,topics.length);assert.deepEqual(index.map(t=>t.id),topics.map(t=>t.id));
});
test('each topic has meaningful depth, a valid question and valid connections',()=>{
 for(const t of topics){assert.ok(t.more.length>=2,t.id+' depth');assert.ok(t.question.answers.length>=2,t.id);assert.equal(new Set(t.question.answers).size,t.question.answers.length);assert.ok(Number.isInteger(t.question.correct)&&t.question.correct>=0&&t.question.correct<t.question.answers.length);for(const id of t.related)assert.ok(topics.some(p=>p.id===id),t.id+' → '+id);assert.ok(t.sources.length>0);for(const s of t.sources)assert.ok(s.url.startsWith('https://'));}
});
test('every retained animal/person photo or individually authored new animal diagram has its own local rights evidence',()=>{
 const own=read('../app/animal-illustrations.json').entries;
 for(const t of topics.filter(t=>t.animal||t.person)){const diagram=own.find(e=>e.id===t.id);if(diagram){assert.equal(t.category,'animals');assert.equal(t.image,undefined);assert.ok(diagram.alt&&diagram.caption);assert.ok(fs.existsSync(new URL('../public'+diagram.src,import.meta.url)));continue;}const p=photos[t.image];assert.ok(p,t.id+' image');assert.ok(p.alt_de&&p.author&&p.license&&p.license_url);assert.ok(fs.existsSync(new URL('../public'+p.src,import.meta.url)),p.src);}
 for(const p of Object.values(photos)){assert.ok(p.width>0&&p.height>0);assert.ok(fs.existsSync(new URL('../public'+p.src,import.meta.url)),p.src);}
});
test('the geographical overview used by cards exists',()=>assert.ok(fs.existsSync(new URL('../public/journeys/continents.svg',import.meta.url))));
