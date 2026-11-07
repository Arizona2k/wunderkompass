import assert from'node:assert/strict';import{createHash}from'node:crypto';
const documentURL=value=>{const u=new URL(value);assert.equal(u.protocol,'https:');u.hash='';return u.href;};
// A PDF viewer has no ordinary readable HTML body. Accept only an actually
// activated200PDF response plus the complete same-anchor browser download.
export function activatedPDFEvidence({requested,actualURL,httpStatus,contentType,contentLength,contentEncoding,downloadURL,downloadFailure,body,activationMode='viewer',actualAnchorDownloadObserved,activationHTTPResponseURL}){
 assert(['viewer','native-download'].includes(activationMode),'known actual PDF activation mode');
 if(activationMode==='native-download'){
  assert.equal(actualAnchorDownloadObserved,true,'normal exact-anchor browser download actually observed');
  assert.equal(documentURL(activationHTTPResponseURL),documentURL(actualURL),'actual activated navigation response endpoint');
 }
 assert(Number.isInteger(httpStatus)&&httpStatus>=200&&httpStatus<300&&httpStatus!==206,'complete successful source response required');
 assert.equal(documentURL(actualURL),documentURL(requested),'actual viewer endpoint');assert.equal(documentURL(downloadURL),documentURL(actualURL),'actual same-source download endpoint');
 assert.equal(contentType?.split(';')[0].trim().toLowerCase(),'application/pdf','actual source MIME');assert.equal(downloadFailure,null,'actual completed browser download');
 assert(Buffer.isBuffer(body)&&body.length>200,'nonempty complete PDF bytes');assert.match(body.subarray(0,8).toString('latin1'),/^%PDF-(?:1\.\d|2\.0)/,'PDF signature');assert(body.subarray(-4096).includes(Buffer.from('%%EOF')),'PDF end marker');
 const encoding=(contentEncoding??'identity').toLowerCase();assert(['identity','gzip','br','deflate','zstd'].includes(encoding),'known actual HTTP content encoding');
 let actualDeclaredLengthChecked=false;
 if(contentLength!==undefined&&contentLength!==null){const length=Number(contentLength);assert(Number.isSafeInteger(length)&&length>0);if(encoding==='identity'){assert.equal(body.length,length,'whole original PDF matches actual unencoded Content-Length');actualDeclaredLengthChecked=true;}}
 // The existing report transport retains JSON. Carry the complete original
 // alongside its digest so the native evidence bundle can restore the PDF;
 // a local download path or checksum alone cannot preserve its bytes.
 return{kind:activationMode==='viewer'?'actual PDF viewer and explicit same-anchor original download':'actual exact-anchor native PDF download and navigation response',...(activationMode==='native-download'?{actualAnchorDownloadObserved:true,activationHTTPResponseURL,normalPDFViewerReturnChecked:false}:{}),bytes:body.length,sha256:createHash('sha256').update(body).digest('hex'),originalBase64:body.toString('base64'),PDFHeader:body.subarray(0,8).toString('latin1'),PDFEOF:true,actualDeclaredLengthChecked,contentEncoding:encoding,scientificApproval:false};
}

export function decodeActivatedPDFOriginal(record){
 assert(['actual PDF viewer and explicit same-anchor original download','actual exact-anchor native PDF download and navigation response'].includes(record?.kind));
 if(record.kind==='actual exact-anchor native PDF download and navigation response'){
  assert.equal(record.actualAnchorDownloadObserved,true);assert.equal(record.normalPDFViewerReturnChecked,false);documentURL(record.activationHTTPResponseURL);
 }
 assert.equal(typeof record.originalBase64,'string');assert(record.originalBase64.length>0);
 const body=Buffer.from(record.originalBase64,'base64');assert.equal(body.toString('base64'),record.originalBase64,'canonical complete PDF encoding');
 assert(Number.isSafeInteger(record.bytes)&&record.bytes>200);assert.equal(body.length,record.bytes);
 assert.match(record.sha256,/^[a-f0-9]{64}$/);assert.equal(createHash('sha256').update(body).digest('hex'),record.sha256,'whole original PDF');
 assert.match(body.subarray(0,8).toString('latin1'),/^%PDF-(?:1\.\d|2\.0)/);assert(body.subarray(-4096).includes(Buffer.from('%%EOF')));return body;
}
