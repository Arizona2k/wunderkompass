import CATALOG from './world-catalog.json' with {type:'json'};
import type {WorldTopic,WorldQuestion} from './world-types';
const TOPICS=CATALOG as WorldTopic[];
type GameItem=WorldQuestion & {id:string;topic:string;image?:string};
const question=(prompt:string,correct:string,wrong:string[],why:string):WorldQuestion=>({prompt,answers:[correct,...wrong],correct:0,why});
// A growing pool must not invalidate the entire saved order map. Preserve
// unrelated/future fields and repair only a current question's invalid order.
export function restoreWorldGameOrders(value:unknown,fallback:Record<string,unknown>,pool:GameItem[]):Record<string,unknown>{
 const restored={...fallback,...(value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{})};
 for(const question of pool){const order=restored[question.id];if(!Array.isArray(order)||order.length!==question.answers.length||new Set(order).size!==question.answers.length||!order.every(answer=>typeof answer==='string'&&question.answers.includes(answer)))restored[question.id]=fallback[question.id];}
 return restored;
}
export function worldGameBank(id:string):GameItem[]{const animals=TOPICS.filter(t=>t.animal),people=TOPICS.filter(t=>t.person),invent=TOPICS.filter(t=>t.invention),historicalInventions=invent.filter(t=>!t.invention!.walkthrough);const q=(t:WorldTopic,q:WorldQuestion,image?:string):GameItem=>({...q,id:t.id,topic:t.id,...(image?{image}: {})});
 if(id==='records')return [
  q(animals.find(t=>t.id==='animal-blue-whale')!,question('Welches ist das größte heute lebende Tier?','Blauwal',['Savannenelefant','Giraffe'],'Blauwale sind die größten heute lebenden Tiere. Viele sind etwa 24–30 Meter lang.')),
  q(animals.find(t=>t.id==='animal-african-savanna-elephant')!,question('Welches ist das größte heute lebende Landtier?','Afrikanischer Savannenelefant',['Löwe','Koala'],'Beim Landtier-Rekord zählt ein Tier, das an Land lebt. Der Blauwal lebt im Meer.')),
  q(animals.find(t=>t.id==='animal-cheetah')!,question('Welches Landtier ist besonders für den schnellsten Sprint bekannt?','Gepard',['Giraffe','Panda'],'Geparden können für kurze Strecken besonders schnell sprinten. Sprintgeschwindigkeit ist etwas anderes als lange Ausdauer.')),
  q(animals.find(t=>t.id==='animal-giraffe')!,question('Welches heute lebende Landtier ist am höchsten?','Giraffe',['Elefant','Löwe'],'Hier geht es um Höhe vom Boden bis zum Kopf. Das ist ein anderer Rekord als Gewicht.')),
  q(animals.find(t=>t.id==='animal-common-octopus')!,question('Welches dieser Tiere besitzt acht Arme?','Oktopus',['Delfin','Meeresschildkröte'],'Ein Oktopus hat acht Arme. Das ist eine Eigenschaft, kein Geschwindigkeitsrekord.'))];
 if(id==='people')return people.map((t,i)=>q(t,question('Wer passt zu diesem Hinweis? '+t.intro.replace(t.title,'Diese Person'),t.title,[people[(i+3)%people.length].title,people[(i+7)%people.length].title],t.paragraphs.join(' '))));
 if(id==='technology')return invent.map((t,i)=>{
  // Preserve old answer banks when principle-only optical cards are added.
  const oldIndex=historicalInventions.findIndex(old=>old.id===t.id),index=oldIndex<0?i:oldIndex;
  const prompt=(t.invention!.walkthrough?'Welche Erfindung passt zu dieser Forscherfrage? ':'Welche Erfindung hilft bei diesem Problem? ')+t.invention!.stages[0].text;
  return q(t,question(prompt,t.title,[historicalInventions[(index+3)%historicalInventions.length].title,historicalInventions[(index+5)%historicalInventions.length].title],t.invention!.stages[2].text));
 });
 if(id==='then-now')return historicalInventions.flatMap(t=>[q(t,{...question('Früher oder heute? '+t.invention!.stages[3].text,'Früher',['Heute','Noch keine wirkliche Entwicklung'],t.invention!.stages[4].text),prompt:'Früher oder heute? '+t.invention!.stages[3].text}),{...q(t,question('Früher oder heute? '+t.invention!.stages[4].text,'Heute',['Früher','Nur ein Zukunftswunsch'],t.invention!.stages[3].text)),id:t.id+'-today'}]);
 if(id==='food')return animals.map(t=>{const food=t.animal!.diet;const wrong=(/Fleisch|Fisch|Krill|Beute|Meerestiere|Wassertiere/.test(food)?['Blätter und Gras','Nektar und Pollen']:['Robben','Fische und Tintenfische']).filter(x=>x!==food).slice(0,2);return q(t,question('Welche Nahrung passt besonders zu '+t.title+'?',food,wrong,t.facts.find(f=>f.label==='Was frisst es?'||f.label==='Nahrung')?.text??food),t.image);});
 if(id==='habitats')return animals.map(t=>q(t,question('Welcher Lebensraum passt zu '+t.title+'?',t.animal!.habitat,['Arktis','Antarktis','Savanne','Regenwald','Ozean','Wald'].filter(s=>s!==t.animal!.habitat).slice(0,2),t.intro),t.image));
 return animals.map((t,i)=>q(t,question('Wer bin ich? '+t.paragraphs[t.paragraphs.length-1]+' '+t.surprise,t.title,[animals[(i+5)%animals.length].title,animals[(i+9)%animals.length].title],t.intro)));
}
