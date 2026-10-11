import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import {measureBuild} from './performance-budget.mjs';
const started=performance.now();
const child=spawn('corepack',['pnpm','run','build'],{stdio:'inherit',env:process.env});
const code=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);});
if(code!==0)process.exit(code??1);
const report={method:'Wall-clock production Vite build including enforced budgets; existing installed dependencies, same machine. No network install, no field-performance claim.',node:process.version,seconds:(performance.now()-started)/1000,metrics:measureBuild('dist')};
await fs.mkdir('.qa-output',{recursive:true});await fs.writeFile('.qa-output/build-profile.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
