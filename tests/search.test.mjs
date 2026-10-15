import {test} from 'node:test';import assert from 'node:assert/strict';import {searchScore,foldSearch,prepareSearchDocument,preparedSearchScore} from '../app/search-ranking.ts';
import {searchScore as previousScore} from './fixtures/search-ranking-before-p35.mjs';
import nature from '../app/nature-content.json' with {type:'json'};
import words from '../app/book-content.json' with {type:'json'};
import topics from '../app/world-index.json' with {type:'json'};
test('exact names precede incidental mentions',()=>assert.ok(searchScore('Deutschland','Deutschland')>searchScore('Deutschland','Berliner Mauer','Deutschland war geteilt')));
test('a one-character mistake finds a familiar animal alias',()=>assert.ok(searchScore('Elefamt','Afrikanischer Savannenelefant','','Elefant')));
test('accents and technical spelling normalize',()=>{assert.equal(foldSearch('Große_Köpfe'),'grosse kopfe');assert.equal(foldSearch('Äquator'),'aquator');});
test('unrelated search terms produce no artificial match',()=>assert.equal(searchScore('zzzzzz','Eisbär','Arktis'),0));
test('prepared search preserves the previous complete ranking for actual old/new catalogs, typos, Unicode and whitespace',()=>{
 const docs=[...nature.entries.map(e=>[e.name,e.learning.starter,e.learning.deeper]),...words.words.map(([name,short,more])=>[name,short,more]),...topics.map(t=>[t.title,t.intro,t.aliases.join(' ')]),['A  B','x\ny','one\t two   three'],['Straße_Äquator','Große Köpfe','Maße MÜNCHEN']];
 for(const[label,preview,keywords]of docs){const prepared=prepareSearchDocument(label,preview,keywords);for(const q of ['',label,label.slice(0,-1),label.split(' ')[0],'Gletscher','Elefamt','fotosyntese','zqqxxx','one two',' two ','A  B','große-köpfe','MAẞE']){const expected=previousScore(q,label,preview,keywords);assert.equal(searchScore(q,label,preview,keywords),expected);assert.equal(preparedSearchScore(foldSearch(q),prepared),expected);}}
});
