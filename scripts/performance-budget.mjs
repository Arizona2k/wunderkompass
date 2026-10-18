import {offlineAssetMetrics} from '../build/learning-assets.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
import baseline from '../content/performance-trend-baseline.json' with {type:'json'};

export function measureBuild(dir){
 const manifest=JSON.parse(fs.readFileSync(path.join(dir,'.vite/manifest.json'),'utf8'));
 const visited=new Set(),js=new Set(),css=new Set();
 function visit(key){if(visited.has(key))return;visited.add(key);const m=manifest[key];if(!m)throw Error('Missing manifest import: '+key);js.add(m.file);for(const c of m.css??[])css.add(c);for(const i of m.imports??[])visit(i);}
 const entries=Object.keys(manifest).filter(k=>manifest[k].isEntry);if(entries.length!==1)throw Error('Expected exactly one application entry');visit(entries[0]);
 const size=(files,gzip=false)=>[...files].reduce((total,f)=>{const data=fs.readFileSync(path.join(dir,f));return total+(gzip?gzipSync(data).length:data.length);},0);
 const allJs=fs.readdirSync(path.join(dir,'assets')).filter(f=>f.endsWith('.js')).map(f=>'assets/'+f);
 const learningText=fs.readdirSync(path.join(dir,'assets')).filter(f=>/^(book-core|journey-content)-.*\.json$/.test(f)).map(f=>'assets/'+f);if(learningText.length!==2)throw Error('Both current learning text payloads required');
 const bookExtras=fs.readdirSync(path.join(dir,'assets')).filter(f=>/^(book-study-|book-search-|book-topic-).*\.json$/.test(f)).map(f=>'assets/'+f);const allLearningText=[...learningText,...bookExtras];
 const worldText=fs.readdirSync(path.join(dir,'assets')).filter(f=>/^world-content-(animals|history|people|inventions|buildings|science)-.*\.json$/.test(f)).map(f=>'assets/'+f);if(worldText.length!==6)throw Error('All six current world text payloads required');
 const whyText=bookExtras.filter(f=>/book-study-why-/.test(f));if(whyText.length!==1)throw Error('One current Why payload required');const bookIndexes=bookExtras.filter(f=>/book-study-index-/.test(f));const bookStudies=bookExtras.filter(f=>/book-study-[a-f0-9]{16}-/.test(f)),bookSearch=bookExtras.filter(f=>/book-search-/.test(f)),bookTopics=bookExtras.filter(f=>/book-topic-/.test(f));const largest=(files,gzip=false)=>files.length?Math.max(...files.map(f=>size([f],gzip))):0;
 const journeyData=fs.readdirSync(path.join(dir,'assets')).filter(f=>/^journey-inquiries-.*\.json$/.test(f)).map(f=>'assets/'+f);if(journeyData.length!==1)throw Error('One current journey inquiry payload required');
 return {journeyInquiryBytes:size(journeyData),bookWhyBytes:size(whyText),bookWhyGzipBytes:size(whyText,true),worldTextBytes:size(worldText),worldTextGzipBytes:size(worldText,true),largestWorldTextBytes:Math.max(...worldText.map(f=>fs.statSync(path.join(dir,f)).size)),largestBookStudyBytes:largest(bookStudies),largestBookStudyGzipBytes:largest(bookStudies,true),bookSearchBytes:largest(bookSearch),bookSearchGzipBytes:largest(bookSearch,true),totalBookSearchBytes:size(bookSearch),totalBookSearchGzipBytes:size(bookSearch,true),bookStudyIndexBytes:size(bookIndexes),bookStudyIndexGzipBytes:size(bookIndexes,true),largestBookTopicBytes:largest(bookTopics),largestBookTopicGzipBytes:largest(bookTopics,true),initialLearningTextBytes:size(learningText),initialLearningTextGzipBytes:size(learningText,true),bookStudyTextBytes:size(bookExtras),learningTextBytes:size(allLearningText),learningTextGzipBytes:size(allLearningText,true),journeyInquiryGzipBytes:size(journeyData,true),entryJsBytes:size(js),entryJsGzipBytes:size(js,true),entryCssBytes:size(css),entryCssGzipBytes:size(css,true),totalJsBytes:size(allJs),totalJsGzipBytes:size(allJs,true),largestJsBytes:Math.max(...allJs.map(f=>fs.statSync(path.join(dir,f)).size)),worldGeometryBytes:fs.statSync(path.join(dir,'world.json')).size,entryFiles:[...js],cssFiles:[...css]};
}
export function violations(metrics,budgets){return Object.entries(budgets).filter(([key,max])=>!Number.isFinite(metrics[key])||metrics[key]>max).map(([key,max])=>({metric:key,actual:metrics[key],maximum:max}));}
export function observedTrends(metrics,names,previous=baseline){
 return Object.fromEntries(names.map(name=>{if(!Number.isFinite(metrics[name])||metrics[name]<0)throw Error('Missing observed performance metric '+name);const before=previous.metrics[name];return [name,{current:metrics[name],...(Number.isFinite(before)?{previous:before,difference:metrics[name]-before,previousCommit:previous.commit}:{})}];}));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const budgets=JSON.parse(fs.readFileSync('performance-budgets.json','utf8'));
 const metrics=measureBuild('dist'),failures=violations(metrics,budgets.build),trends=observedTrends(metrics,budgets.observeOnly),offline=offlineAssetMetrics('dist');
 fs.mkdirSync('.qa-output',{recursive:true});fs.writeFileSync('.qa-output/performance-build.json',JSON.stringify({status:failures.length?'failed':'passed',metrics,budgets:budgets.build,trends,offline,failures},null,2)+'\n');
 console.log('Performance build budgets',JSON.stringify(metrics));
 console.log('Complete offline asset measurement',JSON.stringify(offline));
 console.log('Observed growth trends (not total-size gates)',JSON.stringify(trends));
 if(failures.length){console.error('Performance budget exceeded',failures);process.exitCode=1;}
}
