import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {bookAnswerSentence} from '../app/book-answer-feedback.ts';

test('selected answers form one readable feedback sentence while preserving authored terminal punctuation',()=>{
 for(const[answer,expected]of[['Ein kleiner Körper','Ein kleiner Körper.'],['Kein Transit.','Kein Transit.'],['Wirklich?','Wirklich?'],['Vergleiche!','Vergleiche!'],['Noch offen…','Noch offen…'],['Die Zahl ist 3,5','Die Zahl ist 3,5.'],['Endet schon.  ','Endet schon.'],['','']])assert.equal(bookAnswerSentence(answer),expected);
});
test('all current authored study choices keep their whole wording without repeated feedback sentence punctuation',()=>{
 let choices=0,alreadyPunctuated=0,missingTerminal=0;
 for(const name of fs.readdirSync('app').filter(name=>/^book-.+-content\.json$/.test(name))){const pack=JSON.parse(fs.readFileSync('app/'+name,'utf8'));for(const item of[...Object.values(pack.learning??{}),...Object.values(pack.whyLearning??{})])for(const answer of item.question?.answers??[]){choices++;const text=answer.trimEnd(),display=bookAnswerSentence(answer);assert(display.startsWith(text));assert(!display.endsWith('..'));if(['.','!','?','…'].includes(text.at(-1))){alreadyPunctuated++;assert.equal(display,text);}else{missingTerminal++;assert.equal(display,text+'.');}}}
 assert(choices>150&&alreadyPunctuated>0&&missingTerminal>0,'old/new complete sentence and short choice families are both exercised');
});
