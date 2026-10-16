import baseline from '../content/performance-trend-baseline.json' with {type:'json'};
import fs from 'node:fs';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';

export function measureBuild(dir){
 const manifest=JSON.parse(fs.readFileSync(path.join(dir,'.vite/manifest.json'),'utf8'));
 const visited=new Set(),js=new Set(),css=new Set();
 function visit(key){if(visited.has(key))return;visited.add(key);const m=manifest[key];if(!m)throw Error('Missing manifest import: '+key);js.add(m.file);for(const c of m.css??[])css.add(c);for(const i of m.imports??[])visit(i);}
 const entries=Object.keys(manifest).filter(k=>manifest[k].isEntry);if(entries.length!==1)throw Error('Expected exactly one application entry');visit(entries[0]);
 const size=(files,gzip=false)=>[...files].reduce((total,f)=>{const data=fs.readFileSync(path.join(dir,f));return total+(gzip?gzipSync(data).length:data.length);},0);
 const allJs=fs.readdirSync(path.join(dir,'assets')).filter(f=>f.endsWith('.js')).map(f=>'assets/'+f);
 const journeyData=fs.readdirSync(path.join(dir,'assets')).filter(f=>/^journey-inquiries-.*\.json$/.test(f)).map(f=>'assets/'+f);if(journeyData.length!==1)throw Error('One current journey inquiry payload required');
 return {journeyInquiryBytes:size(journeyData),journeyInquiryGzipBytes:size(journeyData,true),entryJsBytes:size(js),entryJsGzipBytes:size(js,true),entryCssBytes:size(css),entryCssGzipBytes:size(css,true),totalJsBytes:size(allJs),totalJsGzipBytes:size(allJs,true),largestJsBytes:Math.max(...allJs.map(f=>fs.statSync(path.join(dir,f)).size)),worldGeometryBytes:fs.statSync(path.join(dir,'world.json')).size,entryFiles:[...js],cssFiles:[...css]};
}
export function violations(metrics,budgets){return Object.entries(budgets).filter(([key,max])=>!Number.isFinite(metrics[key])||metrics[key]>max).map(([key,max])=>({metric:key,actual:metrics[key],maximum:max}));}
export function observedTrends(metrics,names,previous=baseline){
 return Object.fromEntries(names.map(name=>{if(!Number.isFinite(metrics[name])||metrics[name]<0)throw Error('Missing observed performance metric '+name);const before=previous.metrics[name];return [name,{current:metrics[name],...(Number.isFinite(before)?{previous:before,difference:metrics[name]-before,previousCommit:previous.commit}:{})}];}));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const budgets=JSON.parse(fs.readFileSync('performance-budgets.json','utf8'));
 const metrics=measureBuild('dist'),failures=violations(metrics,budgets.build),trends=observedTrends(metrics,budgets.observeOnly);
 fs.mkdirSync('.qa-output',{recursive:true});fs.writeFileSync('.qa-output/performance-build.json',JSON.stringify({status:failures.length?'failed':'passed',metrics,budgets:budgets.build,trends,failures},null,2)+'\n');
 console.log('Performance build budgets',JSON.stringify(metrics));
 console.log('Observed growth trends (not total-size gates)',JSON.stringify(trends));
 if(failures.length){console.error('Performance budget exceeded',failures);process.exitCode=1;}
}
