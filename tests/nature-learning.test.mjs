import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';
import {validateNatureLearning,validateNaturePart,validateNatureIndex,validateNatureSearch} from '../app/nature-validation.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),source=read('app/nature-content.json'),ids=read('app/nature-entry-ids.json'),index=read('app/nature-study-index.json'),known={words:read('app/book-word-index.json'),topics:read('app/world-index.json').map(t=>t.id),labs:read('exports/content/laboratories.json').map(l=>l.id)},meta=b=>({bytes:b.length,sha256:createHash('sha256').update(b).digest('hex')});
test('68 distinct nature explanations preserve34 baseline identities and exclude six animal projections',async()=>{
 const baseline=read('content/excellence-baseline.json');const records=baseline.records??baseline.inventory?.records;assert.ok(records);const old=records.filter(r=>r.family==='nature-topics').map(r=>r.legacyId);assert.equal(old.length,34);assert.equal(ids.length,68);assert.equal(new Set(ids).size,68);for(const id of old)assert.ok(ids.includes(id),id);
 for(const r of records.filter(r=>r.family==='nature-animal-projections'))assert.ok(!ids.includes(r.legacyId));assert.deepEqual(source.entries.map(e=>e.id).sort(),[...ids].sort());
 for(const e of source.entries){assert.equal(validateNatureLearning(e.learning,known),e.learning);const m=index[e.id],bytes=fs.readFileSync('app/nature-studies/'+m.file);assert.ok(bytes.length<=8000);assert.deepEqual(await validateNaturePart(bytes,e.id,m,known),e.learning);}
});
test('missing individual hints, wrong-answer reasons, unknown connections and false source dates are rejected',()=>{
 for(const alter of [e=>delete e.question.hint,e=>e.question.wrongReasons[e.question.correct]='False feedback',e=>e.question.wrongReasons[(e.question.correct+1)%3]=null,e=>e.question.answers[1]=e.question.answers[0],e=>e.connection.target='nonexistent',e=>e.sources[0].checkedOn='2026-02-30',e=>e.sources[0].url='https://password:secret@example.org/',e=>e.sources[0].scope='']){const l=structuredClone(source.entries[0].learning);alter(l);assert.throws(()=>validateNatureLearning(l,known));}
});
test('nature index/parts reject missing identities, damaged bytes, mismatched identity and duplicate filenames',async()=>{
 const bytes=fs.readFileSync('app/nature-study-index.json'),integrity=read('app/nature-study-index-integrity.json'),files=fs.readdirSync('app/nature-studies');assert.deepEqual(await validateNatureIndex(bytes,integrity,ids,files),index);
 for(const alter of [x=>delete x[ids[0]],x=>x[ids[0]].file='../escape.json',x=>x[ids[0]].file=x[ids[1]].file,x=>x[ids[0]].bytes=8001]){const x=structuredClone(index);alter(x);const b=Buffer.from(JSON.stringify(x));await assert.rejects(validateNatureIndex(b,meta(b),ids,files));}
 const first=source.entries[0],m=index[first.id],part=fs.readFileSync('app/nature-studies/'+m.file);await assert.rejects(validateNaturePart(Buffer.concat([part,Buffer.from(' ')]),first.id,m,known));await assert.rejects(validateNaturePart(part,'another-place',m,known));
});
test('search projection covers all actual explanation levels; shortened or tampered search fails closed',async()=>{
 const bytes=fs.readFileSync('app/nature-search.json'),integrity=read('app/nature-search-integrity.json'),result=await validateNatureSearch(bytes,integrity,ids);for(const e of source.entries){assert.ok(result[e.id].includes(e.learning.deeper));assert.ok(result[e.id].includes(e.learning.observe));}
 const short={...result};delete short[ids[0]];const b=Buffer.from(JSON.stringify(short));await assert.rejects(validateNatureSearch(b,meta(b),ids));await assert.rejects(validateNatureSearch(Buffer.from('x'.repeat(bytes.length)),integrity,ids));
});
