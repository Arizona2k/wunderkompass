import assert from'node:assert/strict';import{createHash}from'node:crypto';
const documentURL=value=>{const u=new URL(value);assert.equal(u.protocol,'https:');u.hash='';return u.href;};
// A PDF viewer has no ordinary readable HTML body. Accept only an actually
// activated200PDF response plus the complete same-anchor browser download.
export function activatedPDFEvidence({requested,actualURL,httpStatus,contentType,contentLength,contentEncoding,downloadURL,downloadFailure,body}){
 assert(Number.isInteger(httpStatus)&&httpStatus>=200&&httpStatus<300&&httpStatus!==206,'complete successful source response required');
 assert.equal(documentURL(actualURL),documentURL(requested),'actual viewer endpoint');assert.equal(documentURL(downloadURL),documentURL(actualURL),'actual same-source download endpoint');
 assert.equal(contentType?.split(';')[0].trim().toLowerCase(),'application/pdf','actual source MIME');assert.equal(downloadFailure,null,'actual completed browser download');
 assert(Buffer.isBuffer(body)&&body.length>200,'nonempty complete PDF bytes');assert.match(body.subarray(0,8).toString('latin1'),/^%PDF-(?:1\.\d|2\.0)/,'PDF signature');assert(body.subarray(-4096).includes(Buffer.from('%%EOF')),'PDF end marker');
 const encoding=(contentEncoding??'identity').toLowerCase();assert(['identity','gzip','br','deflate','zstd'].includes(encoding),'known actual HTTP content encoding');
 let actualDeclaredLengthChecked=false;
 if(contentLength!==undefined&&contentLength!==null){const length=Number(contentLength);assert(Number.isSafeInteger(length)&&length>0);if(encoding==='identity'){assert.equal(body.length,length,'whole original PDF matches actual unencoded Content-Length');actualDeclaredLengthChecked=true;}}
 return{kind:'actual PDF viewer and explicit same-anchor original download',bytes:body.length,sha256:createHash('sha256').update(body).digest('hex'),PDFHeader:body.subarray(0,8).toString('latin1'),PDFEOF:true,actualDeclaredLengthChecked,contentEncoding:encoding,scientificApproval:false};
}
