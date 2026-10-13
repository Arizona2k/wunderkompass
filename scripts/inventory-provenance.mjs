import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
import {dependencies} from './test-selection.mjs';
export function sourceManifest(root=process.cwd()){
 const reachable=dependencies(path.join(root,'migration/main.tsx')),files=[];
 const walk=directory=>{for(const entry of fs.readdirSync(directory,{withFileTypes:true})){const file=path.join(directory,entry.name);if(entry.isSymbolicLink())throw Error('Unexpected inventory symlink');if(entry.isDirectory())walk(file);else{const relative=path.relative(root,file),data=fs.readFileSync(file);files.push({file:relative,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex'),role:relative.startsWith('exports/')?'integrity-export':relative.startsWith('public/')?'public-asset':reachable.has(file)?'portable-import-graph':/^(scripts|tests|build|\.github)\//.test(relative)?'engineering':/\.md$/.test(relative)?'documentary':'requires-use-review'});}}};
 for(const directory of ['app','build','components','hooks','lib','migration','public','content','exports','scripts','tests','.github'])walk(path.join(root,directory));
 for(const name of fs.readdirSync(root).filter(f=>/\.md$/.test(f)||/^(package\.json|pnpm-lock\.yaml|pnpm-workspace\.yaml|vite\.config\.ts|tsconfig\.json|eslint\.config\.mjs|performance-budgets\.json|vercel\.json|index\.html)$/.test(f))){const data=fs.readFileSync(path.join(root,name));files.push({file:name,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex'),role:/\.md$/.test(name)?'documentary':'engineering'});}
 return {files:files.sort((a,b)=>a.file.localeCompare(b.file)),meaning:'A complete manifest of named project source/data/media/test directories. Import reachability is evidence, not proof of visible use. Original Sites/server templates remain until individually resolved; no blind dependency/code removal.'};
}
export const surfaceStates=[
 ['globe',['first-visit','return','search-open','search-empty','search-failure','country','continent','ocean','nature','marine','capitals','orientation','climate','plates','mission','credits','keyboard']],
 ['layers',['four-layers','selection','model-limits']],['day',['rotation','light','model-limits']],
 ['world',['six-categories','article','disclosures','models','knowledge-links','journey-links-open','route','empty','error']],
 ['journeys',['16-overviews','filters','80-chapters','three-levels','hint','wrong-answer','right-answer','sequence','note','resume','chapter-link','final-stamp']],
 ['games',['31-offers','filters','offer-entry','hint','wrong-answer','correct-answer','round-resume','finish','repeat']],
 ['labs',['11-models','three-levels','hint','measurement','comparison','note','model-limits','six-home-experiments','mission-entry']],
 ['book',['words','word-filter','word-open-levels','measurement-models','word-hint','word-wrong-correct','word-sources','word-link-back-focus','book-partial-retry','why-open','notebook','nature-atlas','country-atlas','more-results','no-results']],
 ['updates',['latest','old-archive','all-details','prepared','source-evidence','back-focus']],
 ['news',['editorial','automatic','sources','archive','valid-refresh','rejected-signature','stale','offline','retry']],
 ['pass',['overview','badges','statistics','display','speech-settings','backup-export','backup-import-valid','backup-import-invalid','reset-confirmation','two-tabs']],
 ['cross-cutting',['320','360','390','768','1024','1440','1920','large-text','native-200-percent','reduced-motion','keyboard-focus','cold-offline','worker-upgrade','error-recovery','help','privacy']]
].flatMap(([surface,states])=>states.map(state=>({id:surface+':'+state,surface,state,visualAcceptance:'individual current screenshot review still required',humanAcceptance:false})));
