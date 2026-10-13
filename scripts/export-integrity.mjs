import assert from 'node:assert/strict';
// A self-consistent old export is insufficient: compare with an actual fresh extraction.
export function verifyFreshExport(expected,current){
 const entries=index=>index.files.map(f=>[f.file,f.sha256,[...f.sources].sort()]).sort((a,b)=>a[0].localeCompare(b[0]));
 assert.equal(expected.personalProgressIncluded,false,'Private progress must not be exported');
 assert.equal(current.personalProgressIncluded,false,'Fresh extraction must exclude private progress');
 assert.equal(new Set(current.files.map(f=>f.file)).size,current.files.length,'Duplicate fresh source export');
 assert.deepEqual(entries(current),entries(expected),'Source and checked export differ; regenerate and review the intended data change');
 return true;
}
