import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {GENE_OUTPUTS,CHROMOSOME_STAGES,NUCLEOTIDE_TYPES,RNA_ROLES,selectCase,inventedSequenceChange,qualitativeReaction} from '../app/book-gene-models.ts';
import {validateGenePack,GENE_WORDS,GENE_QUESTIONS} from '../app/book-gene-validation.mjs';
const pack=JSON.parse(fs.readFileSync(new URL('../app/book-gene-content.json',import.meta.url),'utf8'));
test('DNA copying increases chromatids and DNA molecules before separation changes the selected chromosome count',()=>{
 const a=selectCase(CHROMOSOME_STAGES,0),b=selectCase(CHROMOSOME_STAGES,1),c=selectCase(CHROMOSOME_STAGES,2);
 assert.equal(a.chromosomes,1);assert.equal(a.chromatids,1);assert.equal(a.dnaMolecules,1);
 assert.equal(b.chromosomes,a.chromosomes);assert.equal(b.chromatids,2*a.chromatids);assert.equal(b.dnaMolecules,2*a.dnaMolecules);assert.equal(b.connected,true);
 assert.equal(c.chromosomes,2);assert.equal(c.dnaMolecules,b.dnaMolecules);assert.equal(c.connected,false);assert.equal(c.positions.length,2);assert(c.positions[0]<c.positions[1]);
 for(const state of CHROMOSOME_STAGES)assert.equal(state.positions.length,state.chromatids);
 for(const v of[-1,3,.5,NaN,Infinity,'1'])assert.throws(()=>selectCase(CHROMOSOME_STAGES,v),TypeError);
});
test('an enzyme lowers only the qualitative barrier while initial and final free-energy coordinates stay identical',()=>{
 const a=qualitativeReaction(false),b=qualitativeReaction(true);assert.deepEqual(a.start,b.start);assert.deepEqual(a.end,b.end);assert(b.peak.y>a.peak.y&&b.peak.y<b.start.y);assert.equal(a.end.y-a.start.y,b.end.y-b.start.y);assert.equal(a.measured,false);assert.equal(b.measured,false);assert.notEqual(a.path,b.path);for(const v of[null,0,'yes'])assert.throws(()=>qualitativeReaction(v),TypeError);
});
test('the deliberately invented substitution identifies only the third base and leaves biological effect undetermined',()=>{
 const a=inventedSequenceChange(false),b=inventedSequenceChange(true);assert.equal(a.before,a.after);assert.deepEqual(a.differences,[]);assert.equal(b.before,'ATCG');assert.equal(b.after,'ATGG');assert.deepEqual(b.differences,[2]);assert.equal(a.biologicalEffect,b.biologicalEffect);for(const v of[null,0,'yes'])assert.throws(()=>inventedSequenceChange(v),TypeError);
});
test('functional RNA genes do not acquire a forced protein endpoint, and RNA examples have distinct roles',()=>{
 assert.equal(selectCase(GENE_OUTPUTS,0).protein,true);assert.equal(selectCase(GENE_OUTPUTS,1).protein,false);assert.deepEqual(RNA_ROLES.map(r=>r.key),['mRNA','rRNA','tRNA']);assert.equal(new Set(RNA_ROLES.map(r=>r.description)).size,3);for(const v of[-1,3])assert.throws(()=>selectCase(RNA_ROLES,v),TypeError);
});
test('nucleotide comparison keeps the shared organization and distinguishes the sugar and T versus U',()=>{
 const [dna,rna]=NUCLEOTIDE_TYPES;assert.equal(dna.sugar,'Desoxyribose');assert.equal(rna.sugar,'Ribose');assert.deepEqual(dna.bases,['A','T','C','G']);assert.deepEqual(rna.bases,['A','U','C','G']);assert.equal(dna.bases.filter(v=>rna.bases.includes(v)).length,3);
});
test('all ten private lessons retain individual claims, sources, non-revealing hints and specific wrong-answer explanations',()=>{
 assert.equal(GENE_WORDS.length,8);assert.equal(GENE_QUESTIONS.length,2);assert.deepEqual(validateGenePack(structuredClone(pack)),pack);assert.equal(new Set([...Object.values(pack.learning),...Object.values(pack.whyLearning)].map(r=>r.figure)).size,9);
 for(const item of [...Object.values(pack.learning),...Object.values(pack.whyLearning)]){
  assert(item.sources.length>0);for(const s of item.sources){assert.equal(s.checkedOn,'2026-10-31');assert.equal(s.updatedOn,null);}
  for(const link of item.relatedWords??[])if(Object.hasOwn(pack.learning,link.term))assert(pack.learning[link.term].relatedWords?.some(r=>r.term===Object.keys(pack.learning).find(k=>pack.learning[k]===item))||Object.values(pack.whyLearning).includes(item));
 }
 for(const mutate of[p=>delete p.learning.Gen,p=>p.learning.RNA.figure='messenger-only',p=>p.learning.Gen.sources[0].updatedOn='October 31, 2026',p=>p.learning.Mutation.relatedWords.push({term:'not-current-Evolution',reason:'unpublished'}),p=>p.whyLearning[GENE_QUESTIONS[1]].question.wrongReasons[1]='']){const x=structuredClone(pack);mutate(x);assert.throws(()=>validateGenePack(x),/Incomplete gene explanations/);}
});
