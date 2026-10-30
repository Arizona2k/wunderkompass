import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import catalogue from '../app/world-catalog.json' with {type:'json'};
import amendments from './fixtures/learning-audit-explicit-field-amendments.json' with {type:'json'};
import {worldGameBank} from '../app/world-game-bank.ts';
import {dossierBeforeLearningAudit,assertCurrentLearningAuditDossierFields,assertCurrentLearningAuditSharedUI,topicBeforeLearningAudit,gameBeforeLearningAudit,assertCurrentLearningAuditFields} from './learning-audit-reference.mjs';
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
test('four explicit current article and generated-question amendments preserve every other M79 topic/bank value and order',()=>{
 assert.equal(amendments.sourceCommit,'690e97f160d51415224623912ee92ebc798694bc');assert.equal(amendments.topics.length,4);assert.equal(amendments.games.length,4);assert.equal(catalogue.length,190);
 assertCurrentLearningAuditFields(catalogue,worldGameBank);
 assert.equal(hash(catalogue.map(topicBeforeLearningAudit)),amendments.publicBaseCatalogSemanticSHA256,'all190topics and their complete unnamed fields retain the actual public base');
 for(const[game,expected]of Object.entries(amendments.publicBaseGameBankSemanticSHA256))assert.equal(hash(worldGameBank(game).map(gameBeforeLearningAudit)),expected,game+' all unmodified choices, indices, explanations and ordering');
});
test('historical comparison cannot conceal different source URLs, answer disclosure or a mixed old/new revision',()=>{
 const phone=structuredClone(catalogue.find(topic=>topic.id==='invention-phone'));phone.sources[0].url='https://invalid.example/unreviewed';assert.throws(()=>topicBeforeLearningAudit(phone),/unreviewed/);
 const telescope=structuredClone(catalogue.find(topic=>topic.id==='invention-telescope'));telescope.invention.recognitionClue='Die Antwort ist Fernrohr.';assert.throws(()=>topicBeforeLearningAudit(telescope),/unreviewed/);
 const comparison=structuredClone(worldGameBank('then-now').find(item=>item.id==='invention-compass-today'));comparison.answers=['Heute','Früher','Nur ein Zukunftswunsch'];assert.throws(()=>gameBeforeLearningAudit(comparison),/unreviewed/);
 assert.throws(()=>assertCurrentLearningAuditFields(catalogue.map(topicBeforeLearningAudit),worldGameBank),/current topic amendment/,'raw product regressions to historical fields do not pass the current contract');
});
test('unrelated facts and a wrong current correct index remain visible to unchanged complete historical hashes',()=>{
 const changed=structuredClone(catalogue);changed[0].intro+=' Nicht freigegebene Änderung.';assert.notEqual(hash(changed.map(topicBeforeLearningAudit)),amendments.publicBaseCatalogSemanticSHA256);
 const bank=structuredClone(worldGameBank('then-now'));bank.find(item=>item.id==='invention-compass-today').correct=1;assert.notEqual(hash(bank.map(gameBeforeLearningAudit)),amendments.publicBaseGameBankSemanticSHA256['then-now']);
 const original=JSON.stringify(catalogue);catalogue.map(topicBeforeLearningAudit);assert.equal(JSON.stringify(catalogue),original,'comparison helpers do not modify actual source data');
});

test('exact scoped telescope dossier binding retains all139 whole M79 dossiers and rejects unrelated or mixed metadata edits',()=>{
 const current=JSON.parse(fs.readFileSync('content/editorial-reviews.json','utf8')).dossiers;
 assertCurrentLearningAuditSharedUI(current);
 const staleUI=structuredClone(current);staleUI[0].ui.build='stale';assert.throws(()=>assertCurrentLearningAuditSharedUI(staleUI),/stale current shared UI/);assert.throws(()=>dossierBeforeLearningAudit(staleUI[0]),/unreviewed current UI/);
 const missingUI=structuredClone(current);delete missingUI[0][amendments.sharedUI.historyField];assert.throws(()=>assertCurrentLearningAuditSharedUI(missingUI),/current shared UI history missing/);
 const wrongOldUI=structuredClone(current[0]);wrongOldUI[amendments.sharedUI.historyField].report+=' Unreviewed.';assert.throws(()=>dossierBeforeLearningAudit(wrongOldUI),/unreviewed old UI history/);

 assert.equal(current.length,139);assert.equal(amendments.dossiers.length,1);assertCurrentLearningAuditDossierFields(current);
 assert.equal(hash(current.map(dossierBeforeLearningAudit)),amendments.publicBaseDossiersSemanticSHA256);
 const raw=JSON.stringify(current),telescope=current.find(d=>d.id==='topics-inventions:invention-telescope');
 const mixed=structuredClone(telescope);mixed.dataHash=mixed.learningAudit20261030.previousDataHash;assert.throws(()=>dossierBeforeLearningAudit(mixed),/unreviewed/);
 const fake=structuredClone(telescope);fake.learningAudit20261030.reason='Unreviewed';assert.throws(()=>dossierBeforeLearningAudit(fake),/unreviewed/);
 const unrelated=structuredClone(current);unrelated.find(d=>d.id===telescope.id).sources[0].checkedOn='2026-10-30';assert.notEqual(hash(unrelated.map(dossierBeforeLearningAudit)),amendments.publicBaseDossiersSemanticSHA256);
 assert.throws(()=>assertCurrentLearningAuditDossierFields(current.map(dossierBeforeLearningAudit)),/current dossier amendment/);
 assert.equal(JSON.stringify(current),raw,'inverse comparisons never modify actual dossiers');
});
