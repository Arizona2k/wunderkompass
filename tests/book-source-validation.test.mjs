import test from 'node:test';
import assert from 'node:assert/strict';
import book from '../app/book-content.json' with {type:'json'};
import {validateBookData} from '../app/book-validation.mjs';

test('Delta accepts the specific inland source while unrelated or lookalike source URLs remain invalid',()=>{
 assert.doesNotThrow(()=>validateBookData(book));
 const sourceIndex=book.learning.Delta.sources.findIndex(s=>s.url==='https://whc.unesco.org/en/list/1432/');
 assert.ok(sourceIndex>=0);
 for(const url of ['http://whc.unesco.org/en/list/1432/','https://whc.unesco.org/en/list/1433/','https://whc.unesco.org/en/list/1432/other','https://whc.unesco.org.example/en/list/1432/']){
  const changed=structuredClone(book);changed.learning.Delta.sources[sourceIndex].url=url;
  assert.throws(()=>validateBookData(changed),/Wortquellennachweis/);
 }
});
