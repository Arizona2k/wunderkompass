import test from 'node:test';import assert from 'node:assert/strict';
import catalog from '../app/world-catalog.json' with {type:'json'};
import {DRITTE_ANTWORT,worldGameBank,restoreWorldGameOrders,validWorldGameOrder} from '../app/world-game-bank.ts';
import {EIGENE_RAETSEL,animalDetectiveClue,personRecognitionClue,worldGameHint,worldGameWrongFeedback} from '../app/world-game-support.mjs';
import {foodDistractors} from '../app/world-game-food.mjs';
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
 const walrus=worldGameBank('habitats').find(q=>q.id==='animal-walrus');assert.match(walrus.why,/Arktische Küsten und Meere/);assert.match(worldGameWrongFeedback('habitats',walrus,walrus.answers[1]),/ohne Gewässer/);
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
  assert.equal(q.answers[q.correct],t.title);assert.equal(q.why,t.paragraphs.join(' '));
  for(const name of variants)assert(!q.prompt.toLocaleLowerCase('de').includes(name.toLocaleLowerCase('de')));
  for(const part of names)assert(!new RegExp('\\b'+part+'\\b','iu').test(q.prompt),'richer opening cannot leak a separated real name part');
 }
 // Am Satzanfang „Diese Person“, mitten im Satz „diese Person“ (Teil B, Entscheidungsliste Punkt 7).
 const ersetzt=t=>t.intro.replace(t.title,(_,o,s)=>/^\s*$|[.!?:]\s*$/u.test(s.slice(0,o))?'Diese Person':'diese Person');
 for(const t of catalog.filter(t=>t.person&&!Object.hasOwn(EIGENE_RAETSEL,t.id))){
  assert.equal(pool.find(q=>q.id===t.id).prompt,'Wer passt zu diesem Hinweis? '+ersetzt(t));
 }
});
// Eigene Rätsel (Stufen-Prüfung Teil B, M5): kein Teil des Namens, kein „er“, „sie“, „sein“, „ihr“, das das Geschlecht verrät.
test('eigene Personen-Rätsel verraten weder Namen noch Geschlecht',()=>{
 const pool=worldGameBank('people');
 assert.ok(Object.keys(EIGENE_RAETSEL).length>=9);
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
 assert.notEqual(q.prompt,t.invention.stages[0].text);assert.equal(q.why,t.invention.stages[2].text);
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
