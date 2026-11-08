import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import rawCatalog from '../app/world-catalog.json' with {type:'json'};
import rawGraph from '../app/world-connections.json' with {type:'json'};
import currentHistoryPhotos from '../app/world-photos.json' with {type:'json'};
import {photosBeforeHistoryEvidence} from './history-evidence-reference.mjs';
const photos=photosBeforeHistoryEvidence(currentHistoryPhotos);
import rawInquiries from '../app/people-inquiries.json' with {type:'json'};
import illustrations from '../app/people-illustrations.json' with {type:'json'};
import rawBookLinks from '../app/people-book-links.json' with {type:'json'};
import {worldGameBank,restoreWorldGameOrders} from '../app/world-game-bank.ts';
import {CHALLENGE_BANK} from '../app/knowledge-challenge.ts';
import {inventoryBeforeFourteenBacklinks,NEXT_FOURTEEN_PEOPLE_IDS,beforeFourteenPeople,beforeFourteenPeopleQuestions,beforeFourteenPeopleGraph,FOURTEEN_PEOPLE_ADDED_PHOTO_IDS,beforeFourteenPhotoIds} from './people-fourteen-reference.mjs';
import prior from './fixtures/people-fourteen-before-whole-data.json' with {type:'json'};
import {beforeRetainedPeople,beforeRetainedPeopleGraph,beforeRetainedPeopleBookLinks} from './retained-people-reference.mjs';
const catalog=beforeRetainedPeople(rawCatalog),graph=beforeRetainedPeopleGraph(rawGraph),inquiries={...rawInquiries,entries:beforeRetainedPeople(rawInquiries.entries)},bookLinks=beforeRetainedPeopleBookLinks(rawBookLinks);
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const named=new Set(NEXT_FOURTEEN_PEOPLE_IDS);

test('fourteen people retain every preceding190 topics apart from named new reciprocal backlinks,143 relationship,53 photograph record and22 recognition question',()=>{
 assert.equal(catalog.length,204);assert.equal(new Set(catalog.map(t=>t.id)).size,204);
 assert.equal(catalog.filter(t=>t.person).length,36);
 assert.deepEqual(catalog.filter(t=>named.has(t.id)).map(t=>t.id),NEXT_FOURTEEN_PEOPLE_IDS);
 assert.equal(hash(beforeFourteenPeople(catalog)),prior.whole190CatalogSHA256);
 assert.equal(graph.connections.length,181);assert.equal(new Set(graph.connections.map(e=>e.id)).size,181);
 assert.equal(hash(beforeFourteenPeopleGraph(graph)),prior.whole143GraphSHA256);
 assert.equal(Object.keys(photos).length,60);
 const oldPhotoIds=beforeFourteenPhotoIds(Object.keys(photos));assert.deepEqual(oldPhotoIds,prior.oldPhotoIds);
 assert.equal(hash(Object.fromEntries(oldPhotoIds.map(id=>[id,photos[id]]))),prior.whole53PhotoMetadataSHA256);
 const bank=worldGameBank('people');assert.equal(bank.length,36);
 const precedingBank=beforeFourteenPeople(bank);assert.equal(precedingBank.length,22);
 assert.equal(hash(precedingBank),prior.whole22PeopleBankSHA256);
 const orders=Object.fromEntries(precedingBank.map(q=>[q.id,[...q.answers].reverse()]));
 orders['unknown-future-person']=['Bereits gespeicherter unbekannter Wert'];
 const restored=restoreWorldGameOrders(orders,{},bank,'people');
 for(const [id,answers]of Object.entries(orders))assert.deepEqual(restored[id],answers,'actual preceding saved order remains semantically unchanged: '+id);
});

test('all four earlier inquiry and illustration objects remain whole and fourteen new figures carry distinct scoped tasks',()=>{
 assert.equal(hash({...inquiries,entries:beforeFourteenPeople(inquiries.entries)}),prior.wholeFourInquiriesSHA256);
 assert.equal(hash({...illustrations,entries:beforeFourteenPeople(illustrations.entries)}),prior.wholeFourIllustrationsSHA256);
 assert.equal(inquiries.entries.length,18);assert.equal(illustrations.entries.length,11);
 const added=inquiries.entries.filter(e=>named.has(e.id));
 assert.deepEqual(added.map(e=>e.id),NEXT_FOURTEEN_PEOPLE_IDS);assert.equal(new Set(added.map(e=>e.figure)).size,14);
 assert.equal(added.flatMap(e=>e.tasks).length,42);
 for(const entry of added){
  const topic=catalog.find(t=>t.id===entry.id);assert(topic.person);assert(topic.paragraphs.length>=3);
  const own=illustrations.entries.find(e=>e.id===entry.id),photo=topic.image?photos[topic.image]:null;
  assert.equal(Number(!!own)+Number(!!photo),1,'each new topic has its actually chosen own illustration or licensed photograph');
  assert(topic.sources.length>0);for(const source of topic.sources){assert.equal(new URL(source.url).protocol,'https:');assert(source.label.trim());}
  assert.match(topic.checkedAt,/^\d{4}-\d{2}-\d{2}$/);assert(entry.ownMediaConcept.trim());
  assert.deepEqual(entry.tasks.map(t=>t.age),['6-8','9-11','12-14']);
  for(const task of entry.tasks){
   assert.equal(task.answers.length,3);assert.equal(new Set(task.answers).size,3);
   assert(Number.isInteger(task.correct)&&task.correct>=0&&task.correct<3);
   for(const field of ['goal','example','prompt','hint','why'])assert.equal(typeof task[field],'string');
   assert.equal(task.wrongReasons.length,3);assert.equal(task.wrongReasons[task.correct],null);
   for(const[index,reason]of task.wrongReasons.entries())if(index!==task.correct){assert.equal(typeof reason,'string');assert(reason.trim());assert.notEqual(reason,task.why);}
  }
 }
 assert.equal(beforeFourteenPeopleQuestions(CHALLENGE_BANK).length,226);
 const questions=CHALLENGE_BANK.filter(q=>named.has(q.topic));assert.equal(questions.length,14);assert.equal(new Set(questions.map(q=>q.id)).size,14);
 for(const id of NEXT_FOURTEEN_PEOPLE_IDS){const q=questions.find(q=>q.topic===id),topic=catalog.find(t=>t.id===id);assert.equal(q.id,id+':mini');assert.equal(q.difficulty,'easy');assert.deepEqual(q.answers,topic.question.answers);assert.equal(q.correct,topic.question.correct);assert.equal(q.why,topic.question.why);assert.deepEqual(q.hints,[topic.questionFeedback.hint]);assert(q.hints[0].length>=45);}
 // The42 voluntary three-level inquiries above are separate from these14 global recognition minis; never double-count them or change existing save IDs.
});

test('twenty-five reciprocal word pairs and thirty-eight explained world links use real retained endpoints without duplicate focus identities',()=>{
 const words=JSON.parse(fs.readFileSync('exports/content/knowledge-words.json','utf8'));
 const wordIds=new Set(words.map(w=>w.term));
 assert.equal(bookLinks.length,25);assert.equal(new Set(bookLinks.map(b=>[b.kind,b.term,b.topic].join('|'))).size,25);
 const linked=new Set();
 for(const link of bookLinks){assert.equal(link.kind,'word');assert(named.has(link.topic));assert(wordIds.has(link.term),link.term+' exists');assert(link.connection.trim());linked.add(link.topic);}
 assert.deepEqual(linked,new Set(['person-henrietta_swan_leavitt','person-cecilia_payne_gaposchkin','person-rosalind_franklin','person-jocelyn_bell_burnell','person-chien_shiung_wu','person-lise_meitner','person-zaha_hadid','person-rachel_carson','person-katsushika_hokusai']));
 const byId=new Map(catalog.map(t=>[t.id,t]));
 const added=graph.connections.filter(e=>named.has(e.fromId)||named.has(e.toId));assert.equal(added.length,38);
 assert.deepEqual(new Set(added.flatMap(e=>[e.fromId,e.toId]).filter(id=>named.has(id))),new Set(NEXT_FOURTEEN_PEOPLE_IDS),'all14 connect through meaningful existing world relationships; word links are present only where a corresponding word exists');
 for(const edge of added){assert(byId.has(edge.fromId));assert(byId.has(edge.toId));assert.notEqual(edge.fromId,edge.toId);assert.equal(typeof edge.why,'string');assert(edge.why.trim());assert(byId.get(edge.fromId).related.includes(edge.toId));assert(byId.get(edge.toId).related.includes(edge.fromId));}
});

test('seven newly licensed motifs use the existing three-size local WebP pipeline and keep all old photo identities visible',()=>{
 assert.deepEqual(Object.keys(photos).filter(id=>!prior.oldPhotoIds.includes(id)),FOURTEEN_PEOPLE_ADDED_PHOTO_IDS);
 for(const id of FOURTEEN_PEOPLE_ADDED_PHOTO_IDS){
  const record=photos[id];assert.equal(record.id,id);assert(record.author.trim());assert(record.license.trim());
  assert.equal(new URL(record.license_url).protocol,'https:');assert.equal(new URL(record.source_page_url).protocol,'https:');
  assert(record.alt_de.trim());assert(record.caption.trim());assert.equal(record.fit,'contain');
  assert.deepEqual(record.variants.map(v=>v.width),[320,640,960]);assert.equal(record.src,record.variants[2].src);
  for(const variant of record.variants){
   assert(variant.src.startsWith('/world/people/'));assert(variant.src.endsWith('.webp'));
   const body=fs.readFileSync('public'+variant.src);assert.equal(body.subarray(0,4).toString(),'RIFF');assert.equal(body.subarray(8,12).toString(),'WEBP');
  }
 }
 const unknown='unreviewed-future-photo';assert(beforeFourteenPhotoIds([...Object.keys(photos),unknown]).includes(unknown));
});

test('historical related-list inverse accepts only ten exact current content identities and preserves unknown records',()=>{
 const boundary=JSON.parse(fs.readFileSync('tests/fixtures/people-fourteen-dossier-predecessor.json','utf8'));
 const changes=Object.entries(boundary.relatedDataHashChanges);assert.equal(changes.length,10);
 const rows=changes.map(([id,c])=>({id,dataHash:c.current,untouched:'must remain'})),unknown={id:'topics-people:unknown-future',dataHash:'unreviewed',untouched:'future'};
 const original={records:[...rows,unknown],families:['kept'],inventoryFingerprint:'actual-before'},restored=inventoryBeforeFourteenBacklinks(original);
 assert.deepEqual(restored.records.slice(0,10),changes.map(([id,c])=>({id,dataHash:c.previous,untouched:'must remain'})));assert.deepEqual(restored.records[10],unknown);assert.deepEqual(restored.families,original.families);
 for(const index of [0,9]){const bad=structuredClone(original);bad.records[index].dataHash='0'.repeat(64);assert.throws(()=>inventoryBeforeFourteenBacklinks(bad));}
 assert.equal(original.records[0].dataHash,changes[0][1].current);
});
