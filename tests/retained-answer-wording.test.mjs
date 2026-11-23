import test from 'node:test';import assert from 'node:assert/strict';
import {RETAINED_ANSWER_WORDING as alias,restoreAnswerWording,isRetainedAnswerWordingCorrection} from '../app/retained-answer-wording.mjs';
import {CHALLENGE_BANK,restoreChallenge,emptyChallenge} from '../app/knowledge-challenge.ts';
import {createSave,restoreSave,emptyProgress} from '../app/progress-storage.ts';
import {historicalQuestionBank} from '../scripts/world-question-index.mjs';
// Documented question corrections, copied word for word from the former editorial registry
// (id, topic, changed fields, before/after question, reason, review date and authority).
// They protect real saved answers; the unused proof metadata was not copied.
const QUESTION_CORRECTIONS=[
 {
  "id": "animal-white-tailed-eagle:mini",
  "topic": "animal-white-tailed-eagle",
  "changedFields": [
   "answers"
  ],
  "before": {
   "prompt": "Was bedeutet eine Spannweite von zwei Metern?",
   "answers": [
    "Der Abstand zwischen den ausgebreiteten Flügelspitzen.",
    "Die Höhe des Vogels im Stehen.",
    "Die Länge eines einzelnen Schwanzfeder."
   ],
   "correct": 0,
   "why": "Spannweite wird von Flügelspitze zu Flügelspitze gemessen."
  },
  "after": {
   "prompt": "Was bedeutet eine Spannweite von zwei Metern?",
   "answers": [
    "Der Abstand zwischen den ausgebreiteten Flügelspitzen.",
    "Die Höhe des Vogels im Stehen.",
    "Die Länge einer einzelnen Schwanzfeder."
   ],
   "correct": 0,
   "why": "Spannweite wird von Flügelspitze zu Flügelspitze gemessen."
  },
  "reason": "Genitiv-/Genuskongruenz einer falschen Antwort berichtigt; Bedeutung bleibt Schwanzfederlänge, richtigeAntwort/Index und alle anderenWerte bleiben erhalten. BekannteAltantwort gezielt inMiniFrage/Wissens-Challenge wiedererkennen, damit gemischtegespeicherteRunden erhalten bleiben.",
  "reviewedOn": "2026-10-18",
  "authority": "Nutzerauftrag_Inhaltskorrektur_2026-10-18.txt Abschnitt6: dokumentierte notwendigeAlttextkorrektur mit zusätzlichem Nachweis beiAntwortänderungen."
 },
 {
  "id": "history-writing:mini",
  "topic": "history-writing",
  "changedFields": [
   "why"
  ],
  "before": {
   "prompt": "Wofür nutzten Menschen in Uruk frühe Schrift?",
   "answers": [
    "Um Dinge wie Getreidemengen festzuhalten",
    "Zum Versenden von E-Mails",
    "Zum Bauen von Satelliten"
   ],
   "correct": 0,
   "why": "Schrift konnte Informationen bewahren, auch wenn die Person, die sie wusste, gerade nicht da war."
  },
  "after": {
   "prompt": "Wofür nutzten Menschen in Uruk frühe Schrift?",
   "answers": [
    "Um Dinge wie Getreidemengen festzuhalten",
    "Zum Versenden von E-Mails",
    "Zum Bauen von Satelliten"
   ],
   "correct": 0,
   "why": "Auf frühen Tontafeln hielten Menschen wirtschaftliche Angaben fest, zum Beispiel Mengen von Getreide. Die Aufzeichnung bewahrte diese Information auch für später."
  },
  "reason": "Allgemeinen Nutzensatz durch direkt zur Frage und richtigen Antwort passende Erklärung ersetzt; keine Antwort-/Lösungs-/IDänderung.",
  "reviewedOn": "2026-10-18",
  "authority": "Nutzerauftrag_Inhaltskorrektur_2026-10-18.txt Abschnitte4–6"
 }
];
const correction=QUESTION_CORRECTIONS.find(c=>c.topic===alias.topic),question=CHALLENGE_BANK.find(q=>q.topic===alias.topic);
function legacySession({finished=false}={}){
 const others=CHALLENGE_BANK.filter(q=>q.difficulty==='easy'&&q.id!==question.id).slice(0,5),qs=finished?[...others,question]:[question,...others];
 return {difficulty:'easy',ids:qs.map(q=>q.id),orders:Object.fromEntries(qs.map(q=>[q.id,[...q.answers].reverse().map(value=>q.id===question.id&&value===alias.after?alias.before:value)])),index:finished?5:0,answer:finished?question.answers[question.correct]:alias.before,done:finished};
}
test('only the exact reviewed wrong-answer grammar alias is accepted; solution and other words remain protected',()=>{
 assert.equal(restoreAnswerWording(alias.topic,alias.before),alias.after);assert.equal(restoreAnswerWording('animal-lion',alias.before),alias.before);assert.equal(restoreAnswerWording(alias.topic,'unbekannt'),'unbekannt');assert.equal(restoreAnswerWording(alias.topic,question.answers[question.correct]),question.answers[question.correct]);assert.ok(isRetainedAnswerWordingCorrection(correction));
 for(const mutate of [c=>c.after.answers[0]+=' x',c=>c.after.correct=2,c=>c.before.correct=2,c=>c.after.answers.reverse(),c=>c.after.answers[2]+=' x',c=>c.topic='animal-lion']){const invalid=structuredClone(correction);mutate(invalid);assert.equal(isRetainedAnswerWordingCorrection(invalid),false);assert.throws(()=>historicalQuestionBank([question],[invalid]));}
 // Both documented corrections must still match the current challenge bank; only their earlier wording is restored.
 const historical=historicalQuestionBank(CHALLENGE_BANK,QUESTION_CORRECTIONS);
 for(const c of QUESTION_CORRECTIONS){const now=CHALLENGE_BANK.find(q=>q.id===c.id),old=historical.find(q=>q.id===c.id);assert.equal(now.topic,c.topic);for(const key of ['prompt','answers','correct','why']){assert.deepEqual(now[key],c.after[key],c.id+' current '+key);assert.deepEqual(old[key],c.before[key],c.id+' earlier '+key);}}
});
test('a real six-question legacy challenge preserves IDs, shuffled order, wrong selection and earned final state without mutating its source',()=>{
 for(const finished of [false,true]){const old=legacySession({finished}),untouched=structuredClone(old),current=restoreChallenge(old,emptyChallenge());assert.deepEqual(old,untouched);assert.deepEqual(current.ids,old.ids);assert.equal(current.index,old.index);assert.equal(current.done,old.done);assert.deepEqual(current.orders[question.id],[...question.answers].reverse());assert.equal(current.answer,finished?question.answers[question.correct]:alias.after);assert.equal(current.answer===question.answers[question.correct],finished);assert.deepEqual(restoreChallenge(current,emptyChallenge()),current);}
});
test('unknown/duplicate/cross-topic answers and a false completed wrong-answer round still fail closed',()=>{
 const wrongFinished=legacySession({finished:true});wrongFinished.answer=alias.before;assert.deepEqual(restoreChallenge(wrongFinished,emptyChallenge()),emptyChallenge());
 const old=legacySession();for(const mutate of [s=>s.answer='unbekannt',s=>s.done=true,s=>s.orders[question.id][1]=alias.before,s=>{const other=s.ids[1];s.orders[other][0]=alias.before;},s=>s.ids.reverse()]){const invalid=structuredClone(old);mutate(invalid);assert.deepEqual(restoreChallenge(invalid,emptyChallenge()),emptyChallenge());}
});
test('Schema3 backup retains unrelated progress and the original old words; only the runtime question interpretation migrates',()=>{
 const progress=emptyProgress();progress.favorites=['topic:animal-lion'];progress.games=['memory'];progress.gameSessions={'world:knowledge-challenge':{challenge:legacySession()},'world:animal-detective':{items:['animal-lion','animal-koala'],index:1,roundAnswer:'Koala',roundDone:false}};
 const pass=createSave(progress),restored=restoreSave(JSON.parse(JSON.stringify(pass)),true);assert.deepEqual(restored.progress.gameSessions,pass.progress.gameSessions);assert.deepEqual(restored.progress.favorites,progress.favorites);assert.deepEqual(restored.progress.games,progress.games);assert.equal(restoreChallenge(restored.progress.gameSessions['world:knowledge-challenge'].challenge,emptyChallenge()).answer,alias.after);
});
// Teilschritt 3, Aufgabe 5: Eine Challenge-Frage kann mehrere frühere Antwortsätze haben (z. B. erst umformuliert,
// dann eine vierte Antwort). Jede alte Runde zeigt ihre eigenen Antworten weiter; Frage, Lösung und Erklärung bleiben gleich.
test('frühere Antwortsätze: jede bekannte alte Fassung bleibt lesbar, Fremdes nicht',async()=>{
 const {retainedChallengeChoiceVariant}=await import('../app/retained-answer-wording.mjs');
 const frage={id:'t-1',topic:'t',difficulty:'medium',prompt:'P?',correct:0,why:'W.',answers:['A','B','C','D']};
 const reihen=[
  {id:'t-1',topic:'t',difficulty:'medium',prompt:'P?',correct:0,why:'W.',beforeAnswers:['A','X','Y'],beforeWrongReasons:null},
  {id:'t-1',topic:'t',difficulty:'medium',prompt:'P?',correct:0,why:'W.',beforeAnswers:['A','B','C'],beforeWrongReasons:[null,'nicht B','nicht C']},
 ];
 assert.deepEqual(retainedChallengeChoiceVariant(frage,['D','C','B','A'],reihen),{answers:frage.answers,retainedAnswerOrder:false,retainedWrongReasons:null});
 assert.deepEqual(retainedChallengeChoiceVariant(frage,['C','B','A'],reihen),{answers:['A','B','C'],retainedAnswerOrder:true,retainedWrongReasons:[null,'nicht B','nicht C']});
 assert.deepEqual(retainedChallengeChoiceVariant(frage,['Y','A','X'],reihen),{answers:['A','X','Y'],retainedAnswerOrder:true,retainedWrongReasons:null});
 assert.equal(retainedChallengeChoiceVariant(frage,['A','B','Z'],reihen),null,'unbekanntes Wort');
 assert.equal(retainedChallengeChoiceVariant({...frage,prompt:'Anders?'},['C','B','A'],reihen),null,'andere Frage');
 assert.equal(retainedChallengeChoiceVariant({...frage,correct:1},['C','B','A'],reihen),null,'andere Lösung');
 assert.equal(retainedChallengeChoiceVariant({...frage,id:'t-2'},['C','B','A'],reihen),null,'andere ID');
});
