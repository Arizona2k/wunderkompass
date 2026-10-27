import {journeyContent} from './journey-content-index.mjs';
import {worldPhotoIndex,corePhotoIds} from './world-photo-index.mjs';
import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import crypto from 'node:crypto';import ts from 'typescript';
worldPhotoIndex(process.argv.includes('--check'));
const root=process.cwd(),out=path.join(root,process.argv.includes('--check')?'.qa-output/content-check':'exports/content');fs.mkdirSync(out,{recursive:true});const cache=new Map();
function load(relative){let f=path.resolve(root,relative);if(!fs.existsSync(f)&&fs.existsSync(f+'.ts'))f+='.ts';if(!f.startsWith(path.join(root,'app')+path.sep))throw Error('Public data only');if(cache.has(f))return cache.get(f);if(f.endsWith('.json')){const v=JSON.parse(fs.readFileSync(f,'utf8'));cache.set(f,v);return v;}if(!['earth-data.ts','learning-data.ts','expanded-learning-data.ts','quiz-data.ts','nature-data.ts','world-index.ts','solar-system-data.ts','planet-distances.ts'].includes(path.basename(f)))throw Error('Not a data module');const m={exports:{}};cache.set(f,m.exports);const js=ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;new vm.Script(js,{filename:f}).runInNewContext({module:m,exports:m.exports,require:s=>load(path.relative(root,path.resolve(path.dirname(f),s))),console},{timeout:5000});return m.exports;}
function lit(n){if(ts.isAsExpression(n)||ts.isSatisfiesExpression(n)||ts.isParenthesizedExpression(n))return lit(n.expression);if(ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n))return n.text;if(ts.isNumericLiteral(n))return Number(n.text);if(n.kind===ts.SyntaxKind.TrueKeyword)return true;if(n.kind===ts.SyntaxKind.FalseKeyword)return false;if(n.kind===ts.SyntaxKind.NullKeyword)return null;if(ts.isPrefixUnaryExpression(n)&&n.operator===ts.SyntaxKind.MinusToken)return -lit(n.operand);if(ts.isArrayLiteralExpression(n))return n.elements.map(lit);if(ts.isObjectLiteralExpression(n))return Object.fromEntries(n.properties.map(p=>{if(!ts.isPropertyAssignment(p))throw Error('Nonliteral');return [p.name.getText().replace(/^['"]|['"]$/g,''),lit(p.initializer)];}));if(ts.isIdentifier(n))return n.text;throw Error('Not a literal: '+n.getText().slice(0,60));}
function constant(f,name){const s=ts.createSourceFile(f,fs.readFileSync(path.join(root,f),'utf8'),ts.ScriptTarget.Latest,true,f.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);for(const q of s.statements)if(ts.isVariableStatement(q))for(const d of q.declarationList.declarations)if(d.name.getText()===name)return lit(d.initializer);throw Error('Missing '+name);}
// Small generated Home projection of existing edges sharing a published route; no second editorial collection.
const canonicalTopics=JSON.parse(fs.readFileSync(path.join(root,'app/world-catalog.json'),'utf8'));
const graph=JSON.parse(fs.readFileSync(path.join(root,'app/world-connections.json'),'utf8')).connections;
const trails=constant('app/discovery-data.ts','DISCOVERY_CONNECTIONS'),trailIds=trails.map(t=>t.id);
if(new Set(trailIds).size!==trailIds.length)throw Error('Duplicate discovery trail');
const publishedIndex=JSON.parse(fs.readFileSync(path.join(root,'app/world-index.json'),'utf8')),publishedRoutes=constant('app/world-index.ts','WORLD_ROUTES');
const discoveryIndex=graph.flatMap(edge=>{
 const from=publishedIndex.find(t=>t.id===edge.fromId),to=publishedIndex.find(t=>t.id===edge.toId),curated=trails.find(t=>t.id===edge.id);
 const route=publishedRoutes.find(r=>r.id===curated?.routeId)??publishedRoutes.find(r=>r.topics.includes(edge.fromId)&&r.topics.includes(edge.toId));
 if(!from||!to||from.sensitive||to.sensitive||!route)return [];
 return [{...edge,label:curated?.label??from.title+' & '+to.title,question:curated?.question??canonicalTopics.find(t=>t.id===from.id).question.prompt,routeId:route.id}];
});
for(const id of trailIds)if(discoveryIndex.filter(c=>c.id===id).length!==1)throw Error('Missing or ambiguous discovery connection '+id);
const discoveryIndexFile=path.join(root,'app/discovery-connections.json'),discoveryIndexText=JSON.stringify(discoveryIndex,null,2)+'\n';
if(process.argv.includes('--check')){if(fs.readFileSync(discoveryIndexFile,'utf8')!==discoveryIndexText)throw Error('Stale discovery connection projection');}
else fs.writeFileSync(discoveryIndexFile,discoveryIndexText);
// Reuse the existing lightweight metadata index, deriving photo questions from
// the canonical published article rather than keeping a second Home catalog.
const worldIndexFile=path.join(root,'app/world-index.json'),worldIndex=JSON.parse(fs.readFileSync(worldIndexFile,'utf8'));
const photoMetadata=JSON.parse(fs.readFileSync(path.join(root,'app/world-photos.json'),'utf8'));
const homeIndex=worldIndex.map(previous=>{
 const entry={...previous};delete entry.homeQuestion;delete entry.homePhoto;
 const topic=canonicalTopics.find(t=>t.id===entry.id);if(!topic)throw Error('Unknown canonical discovery topic '+entry.id);
 if(entry.image&&photoMetadata[entry.image]&&!entry.sensitive&&!topic.history?.sensitive){
  if(topic.image!==entry.image||typeof topic.question?.prompt!=='string'||!topic.question.prompt.trim())throw Error('Stale photo/question discovery metadata '+entry.id);
  return {...entry,homeQuestion:topic.question.prompt,homePhoto:corePhotoIds.includes(entry.image)?undefined:photoMetadata[entry.image]};
 }
 return entry;
});
const homeIndexText=JSON.stringify(homeIndex,null,2)+'\n';
if(process.argv.includes('--check')){if(fs.readFileSync(worldIndexFile,'utf8')!==homeIndexText)throw Error('Stale canonical Home question projection');}
else fs.writeFileSync(worldIndexFile,homeIndexText);
const files=[];function write(name,value,sources){const b=JSON.stringify(value,null,2)+'\n';fs.writeFileSync(path.join(out,name),b);files.push({file:name,sources,entries:Array.isArray(value)?value.length:Object.keys(value).length,bytes:Buffer.byteLength(b),sha256:crypto.createHash('sha256').update(b).digest('hex')});}
write('people-illustrations.json',JSON.parse(fs.readFileSync('app/people-illustrations.json','utf8')).entries,['app/people-illustrations.json']);
write('people-inquiries.json',JSON.parse(fs.readFileSync('app/people-inquiries.json','utf8')).entries,['app/people-inquiries.json']);
write('animal-inquiries.json',JSON.parse(fs.readFileSync(path.join(root,'app/animal-inquiries.json'),'utf8')).entries,['app/animal-inquiries.json']);
const e=load('app/earth-data.ts'),l=load('app/learning-data.ts'),n=load('app/nature-data.ts'),w=load('app/world-index.ts');
for(const [f,k] of [['continents.json','CONTINENTS'],['oceans.json','OCEANS'],['orientation-lines.json','LINES'],['earth-layers.json','LAYERS'],['quiz-questions.json','QUESTIONS']])write(f,e[k],['app/earth-data.ts','app/learning-data.ts','app/quiz-data.ts']);
write('journey-inquiries.json',JSON.parse(fs.readFileSync('app/journey-inquiries.json','utf8')),['app/journey-inquiries.json']);write('journeys.json',journeyContent(process.argv.includes('--check')),['app/journey-content.json','app/journey-index.json','app/journey-sources.json','app/journey-content-validation.mjs','scripts/journey-content-index.mjs']);write('knowledge-words.json',l.GLOSSARY.map(([term,short,more])=>({term,short,more})),['app/learning-data.ts','app/expanded-learning-data.ts']);write('why-questions.json',l.WHY_QUESTIONS.map(([question,answer])=>({question,answer})),['app/learning-data.ts','app/expanded-learning-data.ts']);write('earth-badges.json',l.BADGES,['app/learning-data.ts']);
for(const [f,k] of [['nature-locations.json','NATURE'],['plate-locations.json','PLATE_POINTS'],['map-layers.json','MAP_LAYERS'],['climate-zones.json','CLIMATE_ZONES'],['continent-worlds.json','CONTINENT_WORLDS']])write(f,n[k],['app/nature-data.ts','app/plate-points.json']);write('world-routes.json',w.WORLD_ROUTES,['app/world-index.ts']);write('world-categories.json',w.WORLD_CATEGORIES,['app/world-index.ts']);
for(const [s,f,k] of [['app/earth-explorer.tsx','globe-missions.json','MISSIONS'],['app/research-labs.tsx','laboratories.json','LABS'],['app/research-labs.tsx','home-experiments.json','EXPERIMENTS']])write(f,constant(s,k),[s]);
write('planets.json',load('app/solar-system-data.ts').PLANETS,['app/solar-system-data.ts','app/planet-distances.ts','app/planet-distance-source.json']);
for(const [s,f] of [['app/research-feedback.json','research-feedback.json'],['app/challenge-hints.json','challenge-hints.json'],['app/world-connections.json','world-connections.json'],['app/world-catalog.json','world-topics.json'],['app/world-index.json','world-index.json'],['app/game-index.json','games.json'],['app/world-photos.json','world-photo-metadata.json'],['app/journey-photos.json','journey-photo-metadata.json'],['app/country-metadata.json','country-metadata.json'],['app/capital-points.json','capital-locations.json'],['app/marine.json','marine-regions.json'],['public/world.json','world-geometry.geojson'],['public/geo-nature.json','nature-geometry.geojson'],['public/world/photo-credits.json','photo-credits.json']])write(f,JSON.parse(fs.readFileSync(path.join(root,s),'utf8')),[s,...(s==='app/world-connections.json'?['app/discovery-data.ts','app/discovery-connections.json']:[])]);
write('research-questions.json',constant('app/research-catalog.ts','RESEARCH_QUESTIONS'),['app/research-catalog.ts']);write('home-experiment-research.json',constant('app/research-catalog.ts','EXPERIMENT_RESEARCH'),['app/research-catalog.ts']);write('research-paths.json',constant('app/research-catalog.ts','RESEARCH_PATHS'),['app/research-catalog.ts']);
write('animal-illustrations.json',JSON.parse(fs.readFileSync(path.join(root,'app/animal-illustrations.json'),'utf8')).entries,['app/animal-illustrations.json']);
write('device-illustrations.json',JSON.parse(fs.readFileSync(path.join(root,'app/device-illustrations.json'),'utf8')).entries,['app/device-illustrations.json']);
const topics=JSON.parse(fs.readFileSync(path.join(root,'app/world-catalog.json'),'utf8'));write('science-model-index.json',topics.filter(t=>t.model).map(t=>({id:t.id,title:t.title,model:t.model})),['app/world-catalog.json']);
const summary={generatedAt:new Date().toISOString(),personalProgressIncluded:false,topics:topics.length,categories:Object.fromEntries([...new Set(topics.map(t=>t.category))].map(c=>[c,topics.filter(t=>t.category===c).length])),journeys:l.JOURNEYS.length,chapters:l.JOURNEYS.reduce((a,j)=>a+j.steps.length,0),quizQuestions:e.QUESTIONS.length,knowledgeWords:l.GLOSSARY.length,whyQuestions:l.WHY_QUESTIONS.length,routes:w.WORLD_ROUTES.length,files};fs.writeFileSync(path.join(out,'index.json'),JSON.stringify(summary,null,2)+'\n');console.log('EXPORTED',files.length,'content files;',summary.topics,'topics;',summary.chapters,'chapters.');
