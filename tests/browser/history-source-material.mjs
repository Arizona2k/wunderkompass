import assert from 'node:assert/strict';
import material from '../fixtures/history-native226-source-material.json' with {type:'json'};
const normalize=s=>s.normalize('NFKC').replace(/\s+/g,' ').trim();
const documentURL=s=>{const u=new URL(s);u.hash='';return u.href;};
// This supplements actual navigation/return/progress checks; it never grants source or UI approval.
export function assertHistorySourceMaterial({requested,actualURL,responseURL,httpStatus,contentType,title,body}){
 const source=material.sources.find(s=>documentURL(s.url)===documentURL(requested))??[material.previousCaralJSONSource20261111,material.previousTimbuktuArchivedSource20261112].find(s=>s&&documentURL(s.url)===documentURL(requested));
 if(!source){assert(!requested.startsWith('https://web.archive.org/'),'unknown archive cannot borrow a known passage');return null;}
 assert.equal(httpStatus,200,'complete actual source response');
 assert.equal(documentURL(actualURL),documentURL(source.url),'exact actually read archived document or official abstract');
 assert.equal(documentURL(responseURL),documentURL(actualURL),'observed actual main-document response');
 assert.equal(typeof body,'string');assert(body.length>200,'substantive actual source body');
 const text=normalize(body);
 assert(!/^(?:access denied|forbidden|just a moment|attention required)/i.test(title.trim()),'no challenge page');
 for(const term of source.titleTerms)assert(normalize(title).includes(normalize(term)),'exact source title: '+term);
 for(const anchor of source.bodyAnchors)assert(text.includes(normalize(anchor)),'actual factual source passage: '+anchor);
 if(source.kind==='json'){
  assert.equal(contentType?.split(';')[0].trim().toLowerCase(),'application/json');
  const data=JSON.parse(body),rows=data.resultList?.result;assert.equal(rows?.length,1);
  assert.equal(rows[0].id,'11326098');assert.equal(rows[0].source,'MED');assert.equal(rows[0].doi,'10.1126/science.1059519');
  assert(normalize(rows[0].abstractText).includes('65 hectares'),'actual abstract, never metadata-only');
 }else assert.equal(contentType?.split(';')[0].trim().toLowerCase(),'text/html');
 return {case:source.case,kind:source.kind,archiveTimestamp:source.archiveTimestamp,allActualFactualAnchorsPresent:true,sourceApprovalClaimed:false};
}
