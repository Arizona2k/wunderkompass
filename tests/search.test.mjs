import {test} from 'node:test';import assert from 'node:assert/strict';import {searchScore,foldSearch} from '../app/search-ranking.ts';
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
