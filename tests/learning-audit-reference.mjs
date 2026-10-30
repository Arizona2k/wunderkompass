// A field-only inverse for historical release comparisons. Current/raw fields
// and every unmodified190topic/sevenbank value are independently checked below.
// Original public fixtures and hashes remain unchanged. No saved answer mapping.
import assert from 'node:assert/strict';
import {isDeepStrictEqual} from 'node:util';
import amendments from './fixtures/learning-audit-explicit-field-amendments.json' with {type:'json'};
import technicalUi from './fixtures/editorial-before-technical-limits-139.json' with {type:'json'};
import {technicalLimitUiReference} from './technical-limit-ui-reference.mjs';
const technical=technicalLimitUiReference(technicalUi,technicalUi.currentTemplate);
const topics=new Map(amendments.topics.map(row=>[row.id,row]));
const games=new Map(amendments.games.map(row=>[row.id,row]));
const dossiers=new Map(amendments.dossiers.map(row=>[row.id,row]));
function field(object,path){let parent=object;for(const key of path.slice(0,-1))parent=parent?.[key];return {exists:!!parent&&Object.hasOwn(parent,path.at(-1)),value:parent?.[path.at(-1)]};}
function matches(value,change,side){const actual=field(value,change.path);return actual.exists===change[side+'Exists']&&(!actual.exists||isDeepStrictEqual(actual.value,change[side]));}
function beforeExplicitAmendment(value,row){
 if(!row)return value;
 // Existing historical helpers compose; already projected fields are allowed.
 // The separate raw-current contract rejects any product regression to before.
 if(row.changes.every(change=>matches(value,change,'before')))return value;
 assert(row.changes.every(change=>matches(value,change,'after')),'unreviewed or mixed audit field revision: '+value.id);
 const copy=structuredClone(value);
 for(const change of row.changes){let parent=copy;for(const key of change.path.slice(0,-1))parent=parent[key];const key=change.path.at(-1);if(change.beforeExists)parent[key]=structuredClone(change.before);else delete parent[key];}
 return copy;
}
export const topicBeforeLearningAudit=topic=>beforeExplicitAmendment(topic,topics.get(topic.id));
export const gameBeforeLearningAudit=item=>beforeExplicitAmendment(item,games.get(item.id));
export function assertCurrentLearningAuditFields(catalogue,bank){
 for(const row of amendments.topics){const topic=catalogue.find(topic=>topic.id===row.id);assert(topic);for(const change of row.changes)assert(matches(topic,change,'after'),'current topic amendment '+row.id+' '+change.path.join('.'));}
 for(const row of amendments.games){const item=bank(row.game).find(item=>item.id===row.id);assert(item);for(const change of row.changes)assert(matches(item,change,'after'),'current question amendment '+row.id+' '+change.path.join('.'));}
}

const sharedUI=amendments.sharedUI,priorUI=new Map(sharedUI.priorUI.map(row=>[row.id,row.ui]));
function beforeSharedLearningUI(value){
 const item=technical.beforeTechnicalLimitUi(value);
 if(!Object.hasOwn(item,sharedUI.historyField))return item; // already projected historical value
 const saved=priorUI.get(item.id);assert(saved,'unknown shared UI history '+item.id);
 assert.deepEqual(item[sharedUI.historyField],saved,'unreviewed old UI history '+item.id);
 assert.deepEqual(item.ui,{...sharedUI.currentTemplate,route:saved.route},'unreviewed current UI binding '+item.id);
 const original=structuredClone(item);original.ui=original[sharedUI.historyField];delete original[sharedUI.historyField];return original;
}
export const dossierBeforeLearningAudit=item=>{const original=beforeSharedLearningUI(item);return beforeExplicitAmendment(original,dossiers.get(original.id));};
export function assertCurrentLearningAuditSharedUI(items){
 assert.equal(sharedUI.priorUI.length,139);assert.equal(priorUI.size,139);const current=new Map(items.map(item=>[item.id,item]));assert.equal(current.size,items.length,'duplicate current dossier');
 for(const [id,saved]of priorUI){const raw=current.get(id);assert(raw);assert(Object.hasOwn(raw,technicalUi.historyField),'stale current shared UI: technical history missing '+id);const item=technical.beforeTechnicalLimitUi(raw,{current:true});assert(item);assert(Object.hasOwn(item,sharedUI.historyField),'current shared UI history missing '+id);assert.deepEqual(item[sharedUI.historyField],saved,'changed prior shared UI '+id);assert.deepEqual(item.ui,{...sharedUI.currentTemplate,route:saved.route},'stale current shared UI '+id);}
 technical.assertCurrentTechnicalLimitUi(items);
}
export function assertCurrentLearningAuditDossierFields(items){
 for(const row of amendments.dossiers){const item=items.find(item=>item.id===row.id);assert(item);for(const change of row.changes)assert(matches(item,change,'after'),'current dossier amendment '+row.id+' '+change.path.join('.'));}
}
