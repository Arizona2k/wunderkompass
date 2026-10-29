import {test} from 'node:test';import assert from 'node:assert/strict';import {searchScore,foldSearch,prepareSearchDocument,preparedSearchScore} from '../app/search-ranking.ts';
import {searchScore as previousScore} from './fixtures/search-ranking-before-p35.mjs';
import words from '../exports/content/knowledge-words.json' with {type:'json'};
import topics from '../app/world-index.json' with {type:'json'};
test('canonical normalization removes copied invisible breaks and typographic spacing',()=>{
 assert.equal(foldSearch('Ele\u00adfant\u200b'),foldSearch('Elefant'));
 assert.equal(foldSearch('Große–Köpfe\u00a0 entdecken'),foldSearch('Große Köpfe entdecken'));
});
test('meaningful multiword and question inputs require every content word in one canonical document',()=>{
 assert(searchScore('Mond Schatten','Halbmond','Gewöhnliche Mondphasen sind kein Schatten der Erde.'));
 assert(searchScore('Vulkan Gas','Vulkan-Werkstatt','Gas und Zähigkeit verändern.'));
 assert(searchScore('Warum entstehen Jahreszeiten?','Ein Jahr, zwei verschiedene Sommer','','Jahreszeiten Erdachse'));
 assert(searchScore('Elefant Afrika','Afrikanischer Savannenelefant','Er lebt in Afrikas Savannen.'));
 for(const query of ['Elefant Vulkanquantensalat','Mond Kontinentaldrift','Warum entstehen Jahreszeiten Vulkanquantensalat?'])assert.equal(searchScore(query,'Afrikanischer Savannenelefant Mond Jahreszeiten','Afrikas Schatten'),0);
 assert(searchScore('Elefamt','Afrikanischer Savannenelefant','','Elefant'));
 assert(searchScore('Jahreszeiten','Jahreszeiten')>searchScore('Jahreszeiten','Reise durch das Jahr','','Jahreszeiten'));
});
test('exact names precede incidental mentions',()=>assert.ok(searchScore('Deutschland','Deutschland')>searchScore('Deutschland','Berliner Mauer','Deutschland war geteilt')));
test('a one-character mistake finds a familiar animal alias',()=>assert.ok(searchScore('Elefamt','Afrikanischer Savannenelefant','','Elefant')));
test('accents and technical spelling normalize',()=>{assert.equal(foldSearch('Große_Köpfe'),'grosse kopfe');assert.equal(foldSearch('Äquator'),'aquator');});
test('unrelated search terms produce no artificial match',()=>assert.equal(searchScore('zzzzzz','Eisbär','Arktis'),0));
test('prepared search preserves all prior positive scores and ordering; meaningful combinations can add matches',()=>{
 const docs=[...words.map(w=>[w.term,w.more,w.short]),...topics.map(t=>[t.title,t.intro,t.aliases.join(' ')]),['A  B','x\ny','one\t two   three'],['Straße_Äquator','Große Köpfe','Maße MÜNCHEN']];
 const indexed=docs.map(([label,preview,keywords])=>prepareSearchDocument(label,preview,keywords));
 const queries=['','Elefant','Elefamt','Einstein','Giraffe','Gletscher','fotosyntese','zqqxxx','one two',' two ','A  B','große-köpfe','MAẞE',...docs.flatMap(([label])=>[label,label.slice(0,-1),label.split(' ')[0]])];
 for(const query of queries){
  const old=docs.map((d,id)=>({id,score:previousScore(query,...d)})),next=indexed.map((d,id)=>({id,score:preparedSearchScore(foldSearch(query),d)}));
  for(const row of old.filter(row=>row.score))assert.equal(next[row.id].score,row.score,'existing positive score for '+query+' / '+row.id);
  assert.deepEqual(next.filter(r=>old[r.id].score).sort((a,b)=>b.score-a.score),old.filter(r=>r.score).sort((a,b)=>b.score-a.score),'ordered matches for '+query);
 }
});
