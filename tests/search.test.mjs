import {test} from 'node:test';import assert from 'node:assert/strict';import {searchScore,foldSearch,prepareSearchDocument,preparedSearchScore} from '../app/search-ranking.ts';
import {searchScore as previousScore} from './fixtures/search-ranking-before-p35.mjs';
import words from '../exports/content/knowledge-words.json' with {type:'json'};
import topics from '../app/world-index.json' with {type:'json'};
test('exact names precede incidental mentions',()=>assert.ok(searchScore('Deutschland','Deutschland')>searchScore('Deutschland','Berliner Mauer','Deutschland war geteilt')));
test('a one-character mistake finds a familiar animal alias',()=>assert.ok(searchScore('Elefamt','Afrikanischer Savannenelefant','','Elefant')));
test('accents and technical spelling normalize',()=>{assert.equal(foldSearch('Große_Köpfe'),'grosse kopfe');assert.equal(foldSearch('Äquator'),'aquator');});
test('unrelated search terms produce no artificial match',()=>assert.equal(searchScore('zzzzzz','Eisbär','Arktis'),0));
test('prepared search preserves complete old-catalog scores and ordering, including aliases, typos and Unicode',()=>{
 const docs=[...words.map(w=>[w.term,w.more,w.short]),...topics.map(t=>[t.title,t.intro,t.aliases.join(' ')]),['A  B','x\ny','one\t two   three'],['Straße_Äquator','Große Köpfe','Maße MÜNCHEN']];
 const indexed=docs.map(([label,preview,keywords])=>prepareSearchDocument(label,preview,keywords));
 const queries=['','Elefant','Elefamt','Einstein','Giraffe','Gletscher','fotosyntese','zqqxxx','one two',' two ','A  B','große-köpfe','MAẞE',...docs.flatMap(([label])=>[label,label.slice(0,-1),label.split(' ')[0]])];
 for(const query of queries){
  const old=docs.map((d,id)=>({id,score:previousScore(query,...d)})),next=indexed.map((d,id)=>({id,score:preparedSearchScore(foldSearch(query),d)}));
  assert.deepEqual(next,old,'scores for '+query);
  assert.deepEqual(next.filter(r=>r.score).sort((a,b)=>b.score-a.score),old.filter(r=>r.score).sort((a,b)=>b.score-a.score),'ordered matches for '+query);
 }
});
