import test from 'node:test';import assert from 'node:assert/strict';
import catalog from '../app/world-catalog.json' with {type:'json'};
import {DRITTE_ANTWORT,worldGameBank,restoreWorldGameOrders,validWorldGameOrder} from '../app/world-game-bank.ts';
import {AUFLOESUNG,EIGENE_RAETSEL,TECHNIK_AUFLOESUNG,animalDetectiveClue,personRecognitionClue,worldGameHint,worldGamePrompt,worldGameWrongFeedback} from '../app/world-game-support.mjs';
import {foodDistractors} from '../app/world-game-food.mjs';
import TIER_AUFLOESUNG from '../app/world-game-tier-aufloesung.json' with {type:'json'};
import {worldGameAnswerCorrect} from '../app/world-game-habitats.mjs';
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
 const walrus=worldGameBank('habitats').find(q=>q.id==='animal-walrus');assert.equal(walrus.why,TIER_AUFLOESUNG.tiere['animal-walrus'].zuhause);assert.match(worldGameWrongFeedback('habitats',walrus,walrus.answers[1]),/trockene Wüste/);
});


test('Benz and al-Chwarizmi recognition prompts conceal real name variants while keeping the answer and explanation',()=>{
 const pool=worldGameBank('people');
 for(const [id,variants,names] of [
  ['person-karl_benz',['Karl Benz','Carl Benz'],['Karl','Carl','Benz']],
  ['person-al_khwarizmi',['al-Chwarizmi','al-Khwarizmi'],['Chwarizmi','Khwarizmi']]
 ]){
  const t=catalog.find(t=>t.id===id),q=pool.find(q=>q.id===id);
  const naiveClue=t.intro.replace(t.title,'Diese Person');
  assert(names.some(name=>new RegExp('\\b'+name+'\\b','iu').test(naiveClue)),'the current intro with only the full title replaced is a real counterexample');
  const clue=personRecognitionClue(t);assert.notEqual(clue,naiveClue);
  assert.equal(q.prompt,'Wer passt zu diesem Hinweis? '+clue);
  assert.equal(q.answers[q.correct],t.title);assert.equal(q.why,AUFLOESUNG[id]);
  for(const name of variants)assert(!q.prompt.toLocaleLowerCase('de').includes(name.toLocaleLowerCase('de')));
  for(const part of names)assert(!new RegExp('\\b'+part+'\\b','iu').test(q.prompt),'richer opening cannot leak a separated real name part');
 }
});
// Eigene Rätsel (Stufen-Prüfung Teil B, M5): kein Teil des Namens, kein „er“, „sie“, „sein“, „ihr“, das das Geschlecht verrät.
test('eigene Personen-Rätsel verraten weder Namen noch Geschlecht',()=>{
 const pool=worldGameBank('people');
 // Seit dem 25.11.2026 hat jede Person ein eigenes Rätsel (Endfassung Personen-Rätsel); neue Personen bekommen auch eines.
 assert.deepEqual(Object.keys(EIGENE_RAETSEL).sort(),catalog.filter(t=>t.person).map(t=>t.id).sort());
 for(const [id,satz] of Object.entries(EIGENE_RAETSEL)){
  const t=catalog.find(t=>t.id===id);assert.ok(t?.person,id+' ist eine Personenkarte');
  assert.equal(personRecognitionClue(t),satz);
  const q=pool.find(q=>q.id===id);if(q)assert.equal(q.prompt,'Wer passt zu diesem Hinweis? '+satz);
  const namensteile=normalize(t.title).split(' ').filter(w=>w.length>2&&!['al','von','van','der'].includes(w));
  // Lange Namensteile auch mitten im Wort: „Benzinmotor“ verrät Benz (kinder-redaktion, 24.11.2026).
  for(const teil of namensteile)assert.ok(teil.length>3?!normalize(satz).includes(teil):!new RegExp('(^| )'+teil+'( |$)','u').test(normalize(satz)),id+' nennt '+teil);
  assert.doesNotMatch(satz,/\b(er|sie|sein|seine|seinen|seinem|seiner|ihr|ihre|ihren|ihrem|ihrer|Er|Sie|Sein|Seine|Ihr|Ihre)\b/u,id+': Fürwort verrät das Geschlecht');
 }
});
// Entdecker sieht und hört nur Satz 1, Profi alles (Endfassung Personen-Rätsel, Abschnitte 1 und 3). Satz 1 sagt, wofür die
// Person bekannt ist: höchstens 13 Wörter, beginnt mit „Diese Person“ (Hokusai: „Von dieser Person“), keine Frage, keine Abkürzung
// mit Punkt (sonst schnitte die Trennung mitten im Satz). Satz 2 beginnt nie mit „Diese Person“.
test('Personen-Rätsel: Entdecker liest nur Satz 1 und bekommt einen eigenen Tipp, Profi liest alles',()=>{
 const pool=worldGameBank('people'),ersterSatz=t=>t.match(/^.*?[.!?](?=\s|$)/u)[0];
 for(const [id,satz] of Object.entries(EIGENE_RAETSEL)){
  const eins=ersterSatz(satz),rest=satz.slice(eins.length).trim(),q=pool.find(q=>q.id===id);
  assert.ok(rest.length>0,id+': hat mehr als einen Satz');
  assert.ok(eins.split(/\s+/u).length<=13,id+': Satz 1 hat '+eins.split(/\s+/u).length+' Wörter');
  assert.ok(eins.startsWith(id==='person-katsushika_hokusai'?'Von dieser Person':'Diese Person'),id);
  assert.doesNotMatch(eins,/\?/u,id);
  assert.doesNotMatch(satz,/(^|\s)(z|d|u|s|bzw|ca|etc|Nr|Dr|St|v|n|Chr)\.(\s|$)/u,id+': Abkürzung mit Punkt');
  assert.doesNotMatch(rest,/^Diese Person/u,id+': Satz 2');
  assert.equal(worldGamePrompt('people',q,'entdecker'),'Wer passt zu diesem Hinweis? '+eins);
  for(const stufe of ['profi','experte',undefined])assert.equal(worldGamePrompt('people',q,stufe),q.prompt,id+' '+stufe);
 }
 const q=pool[0],wrong=q.answers[1],tipp='Kennst du einen der Namen? Überlege: Hat dieser Mensch so etwas gemacht?';
 assert.equal(worldGameHint('people',q,'entdecker'),tipp);
 assert.equal(worldGameWrongFeedback('people',q,wrong,'entdecker'),'Du hast „'+wrong+'“ gewählt. Hat dieser Mensch so etwas gemacht? Schau dir auch die anderen Namen an.');
 // Auf Profi und Experte lenkt die Rückmeldung auf die Sätze 2 und 3 (Endfassung Auflösungen, Paket B).
 for(const stufe of ['profi','experte',undefined]){assert.notEqual(worldGameHint('people',q,stufe),tipp);assert.equal(worldGameWrongFeedback('people',q,wrong,stufe),'Du hast „'+wrong+'“ gewählt. Passt jeder Satz im Hinweis zu diesem Menschen? Schau dir auch die anderen Namen an.');assert.notEqual(worldGameWrongFeedback('people',q,wrong,stufe),worldGameWrongFeedback('people',q,wrong,'entdecker'));}
 // Andere Spiele bleiben auf jeder Stufe gleich.
 for(const game of ['animal-detective','technology'])for(const item of worldGameBank(game).slice(0,3)){assert.equal(worldGamePrompt(game,item,'entdecker'),item.prompt);assert.equal(worldGameHint(game,item,'entdecker'),worldGameHint(game,item));}
});
test('optional recognition name variants preserve compound words and Unicode word boundaries',()=>{
 assert.equal(personRecognitionClue({title:'Karl (Carl) Benz',intro:'Carl Benz nutzte einen Benzinmotor; Karl Benz ist eine Namensform.'}),'Diese Person nutzte einen Benzinmotor; diese Person ist eine Namensform.');
 assert.equal(personRecognitionClue({title:'Karl (Carl) Benz',intro:'Karl Benziner ist hier ein anderes Wort; Karl Benz steht einzeln.'}),'Karl Benziner ist hier ein anderes Wort; diese Person steht einzeln.');
 assert.equal(personRecognitionClue({title:'al-Chwarizmi (al-Khwarizmi)',intro:'AL-KHWARIZMI schrieb über Algebra.'}),'Diese Person schrieb über Algebra.');
});
test('telescope recognition uses the supported optical description without changing its article research question',()=>{
 const t=catalog.find(t=>t.id==='invention-telescope'),q=worldGameBank('technology').find(q=>q.id===t.id);
 assert(t.invention.recognitionClue.trim().length>20);
 assert.equal(q.prompt,'Welche Erfindung passt zu dieser Beschreibung? '+t.invention.recognitionClue);
 for(const name of ['fernrohr',...t.aliases])assert(!q.prompt.toLocaleLowerCase('de').includes(name.toLocaleLowerCase('de')),'prompt names '+name);assert.equal(q.answers[q.correct],t.title);
 assert.notEqual(q.prompt,t.invention.stages[0].text);assert.equal(q.why,TECHNIK_AUFLOESUNG[t.id]);
 for(const other of catalog.filter(x=>x.invention&&x.id!==t.id)){
  const otherQ=worldGameBank('technology').find(q=>q.id===other.id);
  assert.equal(otherQ.prompt,(other.invention.walkthrough?'Welche Erfindung passt zu dieser Forscherfrage? ':'Welche Erfindung hilft bei diesem Problem? ')+other.invention.stages[0].text);
 }
});
test('the compass principle question separates earlier-and-today from every retired answer without rewriting an old order',()=>{
 const pool=worldGameBank('then-now'),q=pool.find(q=>q.id==='invention-compass-today'),t=catalog.find(t=>t.id==='invention-compass');
 assert.equal(q.answers[q.correct],'Früher und heute');assert.equal(q.correct,0);
 const retired=['Heute','Früher','Nur ein Zukunftswunsch'];for(const a of retired){assert(!q.answers.includes(a),'retired answer is deliberately disjoint');assert.equal(worldGameAnswerCorrect('then-now',q,a),false,'old answer cannot silently become correct for the revised question');}
 const fallback=Object.fromEntries(pool.map(row=>[row.id,[...row.answers].reverse()]));
 const old={...fallback,[q.id]:retired};const restored=restoreWorldGameOrders(old,fallback,pool,'then-now');
 assert.deepEqual(restored[q.id],fallback[q.id]);assert.deepEqual(old[q.id],retired,'old caller data is not overwritten');
 for(const row of pool.filter(row=>row.id!==q.id))assert.deepEqual(restored[row.id],old[row.id]);
 assert.equal(worldGameHint('then-now',q),t.invention.comparisonQuestion.hint);
 for(let i=0;i<q.answers.length;i++)if(i!==q.correct){const feedback=worldGameWrongFeedback('then-now',q,q.answers[i]);assert.equal(feedback,t.invention.comparisonQuestion.wrongReasons[i]);assert.notEqual(feedback,q.why);}
});
test('every other earlier-today question retains its old prompt, answer and explanation',()=>{
 // Alle haben dieselbe dritte Antwort (Stufen-Prüfung Teil B, M1): Die Falle verrät die Lösung nicht mehr.
 assert.equal(DRITTE_ANTWORT,'Erst in der Zukunft');
 for(const q of worldGameBank('then-now')){
  if(q.id==='invention-compass-today')continue;
  const today=q.id.endsWith('-today'),t=catalog.find(t=>t.id===(today?q.id.slice(0,-6):q.id));
  assert.equal(q.prompt,'Früher oder heute? '+t.invention.stages[today?4:3].text);
  assert.deepEqual(q.answers,today?['Heute','Früher',DRITTE_ANTWORT]:['Früher','Heute',DRITTE_ANTWORT]);
  assert.equal(q.why,t.invention.stages[today?3:4].text);
 }
});
test('gespeicherte Aufgaben mit ihrer alten dritten Antwort laufen weiter',()=>{
 const pool=worldGameBank('then-now'),frueher=pool.find(q=>!q.id.endsWith('-today')),heute=pool.find(q=>q.id.endsWith('-today')&&q.id!=='invention-compass-today'),kompass=pool.find(q=>q.id==='invention-compass-today');
 // So standen sie bis 24.11.2026 auf test-live: Früher mit „Noch keine wirkliche Entwicklung“, Heute mit „Nur ein Zukunftswunsch“.
 const altFrueher=['Noch keine wirkliche Entwicklung','Früher','Heute'],altHeute=['Früher','Nur ein Zukunftswunsch','Heute'];
 assert.equal(validWorldGameOrder(altFrueher,frueher,pool,'then-now'),true,'alte Früher-Runde bleibt, wie sie war');
 assert.equal(validWorldGameOrder(altHeute,heute,pool,'then-now'),true,'alte Heute-Runde bleibt, wie sie war');
 for(const alt of ['Noch keine wirkliche Entwicklung','Nur ein Zukunftswunsch',DRITTE_ANTWORT])for(const q of [frueher,heute])assert.equal(worldGameAnswerCorrect('then-now',q,alt),false,alt+' ist nie richtig');
 assert.equal(validWorldGameOrder(altFrueher,heute,pool,'then-now'),false,'bei Heute-Aufgaben gab es diesen Text nie');
 assert.equal(validWorldGameOrder(altHeute,frueher,pool,'then-now'),false,'bei Früher-Aufgaben gab es diesen Text nie');
 assert.equal(validWorldGameOrder(altFrueher,kompass,pool,'then-now'),false);
 assert.equal(validWorldGameOrder(['Noch keine wirkliche Entwicklung','Früher',DRITTE_ANTWORT],frueher,pool,'then-now'),false,'die richtige zweite Kategorie fehlt');
 const fallback=Object.fromEntries(pool.map(q=>[q.id,[...q.answers]]));
 const restored=restoreWorldGameOrders({[frueher.id]:altFrueher,[heute.id]:altHeute},fallback,pool,'then-now');
 assert.deepEqual(restored[frueher.id],altFrueher);assert.deepEqual(restored[heute.id],altHeute);
});
// Kurze Auflösung nach „Richtig!“ (Endfassung 25.11.2026, docs/entwurf/2026-11-25-spiel-aufloesung-endfassung.md).
test('jede Person hat eine kurze Auflösung, die etwas Neues sagt',()=>{
 const pool=worldGameBank('people'),personen=catalog.filter(t=>t.person);
 assert.deepEqual(Object.keys(AUFLOESUNG).sort(),personen.map(t=>t.id).sort());
 assert.deepEqual(Object.keys(AUFLOESUNG).sort(),Object.keys(EIGENE_RAETSEL).sort());
 const saetze=text=>text.split(/(?<=[.!?])\s+/u);
 for(const t of personen){
  const text=AUFLOESUNG[t.id],q=pool.find(q=>q.id===t.id);
  assert.equal(q.why,text,t.id);
  assert.ok(text.length<=180,t.id+': höchstens 180 Zeichen');
  // Beginnt mit dem ersten Namensteil, damit klar ist, wer gemeint war (Murasaki steht im Genitiv).
  assert.ok(normalize(text).startsWith(normalize(t.title).split(' ')[0]),t.id+': beginnt mit dem Namen');
  assert.doesNotMatch(text,/^Richtig/u,t.id);
  for(const satz of saetze(text))assert.ok(satz.split(/\s+/u).length<=13,t.id+': Satz zu lang: '+satz);
  assert.ok((text.match(/\d+/gu)??[]).length<=1,t.id+': höchstens eine Zahl');
  for(const satz of saetze(EIGENE_RAETSEL[t.id]))assert.ok(!text.includes(satz),t.id+': wiederholt einen Rätselsatz');
 }
});
// Kurze Auflösung im Technik-Detektiv (Endfassung 25.11.2026, docs/entwurf/2026-11-25-technik-aufloesung-endfassung.md).
test('jede Erfindung hat eine kurze Auflösung, die nichts aus der Aufgabe wiederholt',()=>{
 const pool=worldGameBank('technology'),erfindungen=catalog.filter(t=>t.invention);
 assert.deepEqual(Object.keys(TECHNIK_AUFLOESUNG).sort(),erfindungen.map(t=>t.id).sort());
 const saetze=text=>text.split(/(?<=[.!?:])\s+/u),ohneArtikel=t=>normalize(t.title).replace(/^(der|die|das) /u,'');
 for(const t of erfindungen){
  const text=TECHNIK_AUFLOESUNG[t.id],q=pool.find(q=>q.id===t.id),hinweis=t.invention.recognitionClue||t.invention.stages[0].text;
  assert.equal(q.why,text,t.id);
  assert.ok(text.length<=180,t.id+': höchstens 180 Zeichen');
  assert.ok(text.startsWith(t.title),t.id+': beginnt mit dem Namen der Erfindung');
  for(const satz of saetze(text))assert.ok(satz.split(/\s+/u).length<=13,t.id+': Satz zu lang: '+satz);
  // Nur ganze Zahlen zählen: „3D“ ist ein Wort, keine Zahl (code-pruefer, Kann 3).
  assert.ok((text.match(/(?<![\p{L}\d])\d+(?![\p{L}\d])/gu)??[]).length<=1,t.id+': höchstens eine Zahl');
  for(const satz of saetze(hinweis))assert.ok(!normalize(text).includes(normalize(satz)),t.id+': wiederholt den Hinweis');
  // Keine andere Erfindung aus dem Spiel, sonst verrät die Auflösung eine Falle oder ein späteres Ziel. Geprüft wird nur der
  // Wortanfang, damit auch „Satelliten“ oder „Raketentriebwerk“ auffallen, und mit den anderen Namen der Karte (code-pruefer, Kann 2).
  for(const o of erfindungen)if(o!==t)for(const name of [ohneArtikel(o),...(o.aliases??[]).map(a=>ohneArtikel({title:a}))])
   assert.ok(!(' '+normalize(text)).includes(' '+name),t.id+' nennt '+o.title+' („'+name+'“)');
 }
});
// Technik-Detektiv: Nach einer falschen Antwort prüft das Kind die gewählte Erfindung, auf allen Stufen, statt den Tipp ein
// zweites Mal zu lesen (Nachtrag Technik-Auflösungen, Abschnitt 7).
test('Technik-Detektiv: nach falscher Antwort ein eigener Prüfsatz statt des Tipps',()=>{
 for(const q of worldGameBank('technology'))for(const stufe of ['entdecker','profi','experte',undefined]){
  const wrong=q.answers.find((_,i)=>i!==q.correct),feedback=worldGameWrongFeedback('technology',q,wrong,stufe);
  assert.equal(feedback,'Du hast „'+wrong+'“ gewählt. Was macht diese Erfindung? Passt das zu allem in der Aufgabe?',q.id);
  assert.ok(!feedback.includes(worldGameHint('technology',q,stufe)),q.id+': wiederholt den Tipp');
 }
});
// Eine Auflösung nennt keine andere Person aus dem Spiel, sonst verrät sie eine Falle oder ein späteres Ziel; der Profi-Tipp
// ist für alle gleich und nennt niemanden (Stufen-Prüfung Auflösungen, Tests 2 und 4). Nur Bertha und Karl Benz dürfen sich nennen.
test('Auflösungen und Profi-Tipp verraten keine andere Person',()=>{
 const personen=catalog.filter(t=>t.person),paar=new Set(['person-bertha_benz','person-karl_benz']);
 const nachname=t=>normalize(t.title.replace(/\(.*?\)/gu,'').trim().split(' ').at(-1));
 const nennt=(text,t)=>(' '+normalize(text)+' ').includes(' '+nachname(t)+' ');
 const tipp=worldGameHint('people',worldGameBank('people')[0],'profi');
 for(const t of personen){
  assert.equal(worldGameHint('people',worldGameBank('people').find(q=>q.id===t.id),'profi'),tipp,t.id);
  assert.ok(!nennt(tipp,t),'der Profi-Tipp nennt '+t.title);
  for(const o of personen)if(o!==t&&!(paar.has(t.id)&&paar.has(o.id)))assert.ok(!nennt(AUFLOESUNG[t.id],o),t.id+' nennt '+o.title);
 }
});
// Früher oder heute? „Erst in der Zukunft“ und die alten dritten Antworten sind immer falsch; die Rückmeldung verrät keine Zeit.
test('die Zukunfts-Antwort bekommt bei Früher und Heute dieselbe Rückmeldung',()=>{
 const pool=worldGameBank('then-now').filter(q=>q.id!=='invention-compass-today');
 const frueher=pool.find(q=>!q.id.endsWith('-today')),heute=pool.find(q=>q.id.endsWith('-today'));
 for(const alt of [DRITTE_ANTWORT,'Noch keine wirkliche Entwicklung','Nur ein Zukunftswunsch']){
  const a=worldGameWrongFeedback('then-now',frueher,alt),b=worldGameWrongFeedback('then-now',heute,alt);
  assert.equal(a,b,alt);assert.ok(a.startsWith('Du hast „'+alt+'“ gewählt. '),alt);assert.notEqual(a,'Du hast „'+alt+'“ gewählt. '+worldGameHint('then-now',frueher));
 }
 for(const q of pool)assert.equal(worldGameAnswerCorrect('then-now',q,DRITTE_ANTWORT),false,q.id);
 // Vertauschte Antworten (Früher statt Heute) bekommen weiter den allgemeinen Tipp, der für alle Aufgaben gleich ist.
 assert.equal(worldGameWrongFeedback('then-now',frueher,'Heute'),'Du hast „Heute“ gewählt. '+worldGameHint('then-now',frueher));
 assert.equal(worldGameHint('then-now',frueher),worldGameHint('then-now',heute));
});
// Kurze Auflösung nach „Richtig!“ in den drei Tierspielen (Tier-Auflösungen, Endfassung und Nachtrag 25.11.2026). Gleiche
// Grenzen wie bei Menschen und Erfindungen. Kein anderes Spieltier, sonst verrät die Auflösung eine Falle oder ein späteres Ziel
// (Kurznamen aus dem Prüfskript der Endfassung; ein Name zählt am Wortanfang, damit auch „Haie“ oder „Füchse“ auffallen;
// „Orang-Utan“ ganz, weil „orange“ sonst mitzählt).
test('jedes Tier hat in allen drei Tierspielen eine kurze Auflösung',()=>{
 const tiere=TIER_AUFLOESUNG.tiere,spiele={'animal-detective':'detektiv',habitats:'zuhause',food:'futter'};
 assert.deepEqual(Object.keys(tiere).sort(),animals.map(t=>t.id).sort());
 const KURZ={'animal-african-savanna-elephant':['elefant'],'animal-lion':['löwe','löwin'],'animal-cheetah':['gepard'],'animal-bengal-tiger':['tiger'],'animal-giraffe':['giraffe'],'animal-giant-panda':['panda'],'animal-western-lowland-gorilla':['gorilla'],'animal-bornean-orangutan':['orang utan','orangutan'],'animal-polar-bear':['eisbär'],'animal-emperor-penguin':['pinguin'],'animal-blue-whale':['blauwal'],'animal-common-bottlenose-dolphin':['tümmler','delfin'],'animal-orca':['orca','schwertwal'],'animal-common-octopus':['krake','oktopus'],'animal-green-sea-turtle':['schildkröte'],'animal-red-kangaroo':['känguru'],'animal-koala':['koala'],'animal-jaguar':['jaguar'],'animal-honey-bee':['biene'],'animal-axolotl':['axolotl'],'animal-whale-shark':['walhai','hai'],'animal-garden-cross-spider':['spinne'],'animal-dromedary':['dromedar','kamel'],'animal-white-tailed-eagle':['adler'],'animal-platypus':['schnabeltier'],'animal-short-beaked-echidna':['ameisenigel','schnabeligel'],'animal-okapi':['okapi'],'animal-meerkat':['erdmännchen'],'animal-ring-tailed-lemur':['katta','lemur'],'animal-north-american-beaver':['biber'],'animal-walrus':['walross'],'animal-red-fox':['fuchs','füchs'],'animal-raccoon':['waschbär'],'animal-hedgehog':['igel'],'animal-barn-owl':['eule'],'animal-kingfisher':['eisvogel'],'animal-ostrich':['strauß'],'animal-atlantic-puffin':['papageitaucher'],'animal-common-chameleon':['chamäleon'],'animal-fire-salamander':['salamander'],'animal-common-frog':['frosch','frösch'],'animal-eastern-clown-anemonefish':['clownfisch'],'animal-european-eel':['aal'],'animal-monarch-butterfly':['monarch','falter'],'animal-garden-snail':['schnecke'],'animal-european-lobster':['hummer'],'animal-common-cuttlefish':['sepia','tintenfisch'],'animal-short-snouted-seahorse':['seepferdchen']};
 assert.deepEqual(Object.keys(KURZ).sort(),animals.map(t=>t.id).sort(),'jedes Spieltier hat Kurznamen');
 const saetze=text=>text.split(/(?<=[.!?:])\s+/u);
 for(const [spiel,feld] of Object.entries(spiele)){const pool=worldGameBank(spiel);for(const t of animals){
  const text=tiere[t.id][feld],q=pool.find(q=>q.id===t.id),wo=t.id+' '+feld;
  assert.equal(q.why,text,wo);
  assert.ok(text.length<=180,wo+': höchstens 180 Zeichen');
  for(const satz of saetze(text))assert.ok(satz.split(/\s+/u).length<=13,wo+': Satz zu lang: '+satz);
  assert.ok((text.match(/(?<![\p{L}\d])\d+(?![\p{L}\d])/gu)??[]).length<=1,wo+': höchstens eine Zahl');
  for(const satz of saetze(animalDetectiveClue(t.id).clue))assert.ok(!text.includes(satz),wo+': wiederholt einen Rätselsatz');
  for(const [id,namen] of Object.entries(KURZ))if(id!==t.id)for(const name of namen)assert.ok(!(' '+normalize(text)).includes(' '+normalize(name)),wo+' nennt '+name);
 }}
});
