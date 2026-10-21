import fs from 'node:fs';
import {validateJourneyContent} from '../app/journey-content-validation.mjs';

// Reuse the prepared Master index shape; retain legacy chapters without optional
// depth fields, and bind the fields and source IDs that actually exist today.
export function journeyIndex(data){
 return data.journeys.map(j=>({...j,steps:j.steps.map(s=>({
  title:s.title,text:s.text.split(/\.\s/u)[0]+'.',
  ...(s.tryIt?{tryIt:s.tryIt}:{}),...(s.sourceIds?{sourceIds:s.sourceIds}:{}),
  textFields:['starter','deeper','whyItMatters','observe'].filter(key=>Object.hasOwn(s,key))
 }))}));
}
export function journeyContent(check=false){
 const data=JSON.parse(fs.readFileSync('app/journey-content.json','utf8'));
 const index=journeyIndex(data),sources=JSON.parse(fs.readFileSync('app/journey-sources.json','utf8'));
 validateJourneyContent(data,index,sources);
 const file='app/journey-index.json',bytes=JSON.stringify(index,null,2)+'\n';
 if(check){if(fs.readFileSync(file,'utf8')!==bytes)throw Error('Stale journey index');}
 else fs.writeFileSync(file,bytes);
 return data.journeys;
}
