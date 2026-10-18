import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
test('the existing handoff requirement map has no dangling source links after feature removal',()=>{
 const rows=fs.readFileSync('BACKLOG.md','utf8').split('\n').filter(line=>/^\| (?:A[1-6]|B[1-8]|B9|C|P3[A-D]|P35[A-D]) \|/.test(line));
 assert.equal(rows.length,24,'retain the complete original requirement map');
 for(const row of rows)for(const match of row.matchAll(/\]\((?!https?:)([^)]+)\)/g)){
  const file=path.resolve(match[1]);assert(file.startsWith(process.cwd()+path.sep),'evidence stays inside the project');assert(fs.existsSync(file),'missing mapped handoff source '+match[1]);
 }
});
