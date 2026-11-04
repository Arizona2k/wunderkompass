import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import dossierBoundary from './fixtures/people-fourteen-dossier-predecessor.json' with {type:'json'};

// Only the fourteen named additions are removed for older release comparisons.
// Current204/36/18 inventories require their own full raw-data checks. Unknown
// future additions and every old field remain visible to the old assertions.
export const NEXT_FOURTEEN_PEOPLE_IDS=Object.freeze([
 'person-henrietta_swan_leavitt','person-cecilia_payne_gaposchkin',
 'person-rosalind_franklin','person-jocelyn_bell_burnell',
 'person-katsushika_hokusai','person-murasaki_shikibu',
 'person-rachel_carson','person-octavia_butler','person-nelson_mandela',
 'person-chien_shiung_wu','person-lise_meitner','person-zaha_hadid',
 'person-rabindranath_tagore','person-ibn_sina',
]);
const additions=new Set(NEXT_FOURTEEN_PEOPLE_IDS);
export function beforeFourteenPeople(items){
 const seen=new Set();
 for(const item of items)if(additions.has(item.id)){
  assert(!seen.has(item.id),'duplicate named person addition: '+item.id);
  seen.add(item.id);
 }
 return items.filter(item=>!additions.has(item.id)).map(item=>Array.isArray(item.related)?{...item,related:item.related.filter(id=>!additions.has(id))}:item);
}
export const beforeFourteenPeopleQuestions=items=>items.filter(item=>!additions.has(item.topic));
export const beforeFourteenPeopleGraph=graph=>({...graph,connections:graph.connections.filter(edge=>!additions.has(edge.fromId)&&!additions.has(edge.toId))});

// Seven explicitly reviewed additions only. Unknown future photo identities
// remain visible to all unchanged old photo predicates and the raw current guard.
export const FOURTEEN_PEOPLE_ADDED_PHOTO_IDS=Object.freeze([
 'henrietta-swan-leavitt','cecilia-payne-gaposchkin','jocelyn-bell-burnell',
 'rachel-carson','chien-shiung-wu','zaha-hadid','hokusai-great-wave-jp1847',
]);
export const beforeFourteenPhotoIds=ids=>ids.filter(id=>!FOURTEEN_PEOPLE_ADDED_PHOTO_IDS.includes(id));

// Historical dossier predicates consume historical content identities. Current
// production inventory and every new/raw dossier remain checked without this
// inverse. Only the ten named related-list additions can change these hashes;
// the runtime boundary and raw190 field guard independently enforce that scope.
export function inventoryBeforeFourteenBacklinks(inventory){
 const records=inventory.records.map(row=>{
  const change=dossierBoundary.relatedDataHashChanges?.[row.id];
  if(!change)return row;
  assert.equal(row.dataHash,change.current,'actual current related-list identity: '+row.id);
  return {...row,dataHash:change.previous};
 });
 return {...inventory,records,inventoryFingerprint:createHash('sha256').update(JSON.stringify(records.map(r=>[r.id,r.dataHash]))).digest('hex')};
}
