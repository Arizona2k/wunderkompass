import test from 'node:test';
import assert from 'node:assert/strict';
import {activatedPDFEvidence,decodeActivatedPDFOriginal} from './browser/activated-pdf-source-evidence.mjs';
const body=Buffer.from('%PDF-1.7\n'+('synthetic PDF evidence guard fixture\n'.repeat(10))+'%%EOF\n');
const original={requested:'https://example.org/paper.pdf#page=3',actualURL:'https://example.org/paper.pdf#page=3',httpStatus:200,contentType:'application/pdf',contentLength:String(body.length),contentEncoding:'identity',downloadURL:'https://example.org/paper.pdf',downloadFailure:null,body};
test('actual complete successful PDF response and same-source original download require signature, end marker and whole declared size',()=>{
 const result=activatedPDFEvidence(original);assert.equal(result.bytes,body.length);assert(result.actualDeclaredLengthChecked);assert.equal(result.scientificApproval,false);
 for(const[name,change]of[
  ['blocked source',{httpStatus:403}],['partial source',{httpStatus:206}],['wrong MIME',{contentType:'text/html'}],
  ['different viewer',{actualURL:'https://example.org/another.pdf'}],['different download',{downloadURL:'https://example.org/another.pdf'}],
  ['download failure',{downloadFailure:'interrupted'}],['missing signature',{body:Buffer.from('not a PDF\n'+'.'.repeat(400)+'%%EOF')}],
  ['missing EOF',{body:Buffer.from('%PDF-1.7\n'+'.'.repeat(400))}],['truncated body',{contentLength:String(body.length+1)}],
 ])assert.throws(()=>activatedPDFEvidence({...original,...change}),name);
 const compressed=activatedPDFEvidence({...original,contentEncoding:'gzip',contentLength:'120'});assert.equal(compressed.actualDeclaredLengthChecked,false);assert.equal(compressed.bytes,body.length);
});
test('complete PDF originals survive the existing JSON evidence transport and reject missing, changed or truncated payloads',()=>{
 const proof=JSON.parse(JSON.stringify(activatedPDFEvidence(original)));assert(decodeActivatedPDFOriginal(proof).equals(body));
 for(const change of [{originalBase64:undefined},{originalBase64:proof.originalBase64+'\n'},{originalBase64:proof.originalBase64.slice(0,-4)},{bytes:proof.bytes+1},{sha256:'0'.repeat(64)}])assert.throws(()=>decodeActivatedPDFOriginal({...proof,...change}));
});
