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

test('Gestein accepts its specific glassy-rock reference and rejects other BGS paths or query parameters',()=>{
 const sourceIndex=book.learning.Gestein.sources.findIndex(s=>s.url==='https://webapps.bgs.ac.uk/bgsrcs/rcs_details.cfm?code=OBS');
 assert.ok(sourceIndex>=0);assert.doesNotThrow(()=>validateBookData(book));
 for(const url of ['http://webapps.bgs.ac.uk/bgsrcs/rcs_details.cfm?code=OBS','https://webapps.bgs.ac.uk/bgsrcs/rcs_details.cfm?code=CIR','https://webapps.bgs.ac.uk/bgsrcs/rcs_details.cfm?code=OBS&other=1','https://webapps.bgs.ac.uk.example/bgsrcs/rcs_details.cfm?code=OBS']){
  const changed=structuredClone(book);changed.learning.Gestein.sources[sourceIndex].url=url;
  assert.throws(()=>validateBookData(changed),/Wortquellennachweis/);
 }
});
