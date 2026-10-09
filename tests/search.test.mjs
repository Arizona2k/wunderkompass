import {test} from 'node:test';import assert from 'node:assert/strict';import {searchScore,foldSearch} from '../app/search-ranking.ts';
test('exact names precede incidental mentions',()=>assert.ok(searchScore('Deutschland','Deutschland')>searchScore('Deutschland','Berliner Mauer','Deutschland war geteilt')));
test('a one-character mistake finds a familiar animal alias',()=>assert.ok(searchScore('Elefamt','Afrikanischer Savannenelefant','','Elefant')));
test('accents and technical spelling normalize',()=>{assert.equal(foldSearch('Große_Köpfe'),'grosse kopfe');assert.equal(foldSearch('Äquator'),'aquator');});
test('unrelated search terms produce no artificial match',()=>assert.equal(searchScore('zzzzzz','Eisbär','Arktis'),0));
