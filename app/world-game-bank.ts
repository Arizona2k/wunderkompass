import {habitatDistractors} from './world-game-habitats.mjs';
import {animalDetectiveClue,personRecognitionClue} from './world-game-support.mjs';
import {foodDistractors} from './world-game-food.mjs';
import CATALOG from './world-catalog.json' with {type:'json'};
import PEOPLE_BASELINE from './people-game-baseline.json' with {type:'json'};
import type {WorldTopic,WorldQuestion} from './world-types';
const TOPICS=CATALOG as WorldTopic[];
type GameItem=WorldQuestion & {id:string;topic:string;image?:string};
const question=(prompt:string,correct:string,wrong:string[],why:string):WorldQuestion=>({prompt,answers:[correct,...wrong],correct:0,why});
// Recognition questions can keep older real topic names as distractors. Factual
// choices in the other games remain tied to the current question's answer set.
export function validWorldGameOrder(value:unknown,current:GameItem,pool:GameItem[],gameId?:string):value is string[]{
 if(!Array.isArray(value)||value.length!==current.answers.length||new Set(value).size!==value.length||!value.every(answer=>typeof answer==='string'))return false;
 if(value.every(answer=>current.answers.includes(answer)))return true;
 if(!gameId||!['animal-detective','people','technology'].includes(gameId)||!value.includes(current.answers[current.correct]))return false;
 const names=new Set(pool.map(question=>question.answers[question.correct]));
 return value.every(answer=>names.has(answer));
}
// A growing pool must not invalidate the entire saved order map. Preserve
// unrelated/future fields and repair only a current question's invalid order.
export function restoreWorldGameOrders(value:unknown,fallback:Record<string,unknown>,pool:GameItem[],gameId?:string):Record<string,unknown>{
 const restored={...fallback,...(value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{})};
 for(const question of pool)if(!validWorldGameOrder(restored[question.id],question,pool,gameId))restored[question.id]=fallback[question.id];
 return restored;
}
export function worldGameBank(id:string):GameItem[]{const animals=TOPICS.filter(t=>t.animal),people=TOPICS.filter(t=>t.person),invent=TOPICS.filter(t=>t.invention),historicalInventions=invent.filter(t=>!t.invention!.walkthrough);const q=(t:WorldTopic,q:WorldQuestion,image?:string):GameItem=>({...q,id:t.id,topic:t.id,...(image?{image}: {})});
 if(id==='records')return [
  q(animals.find(t=>t.id==='animal-blue-whale')!,question('Welches ist das größte heute lebende Tier?','Blauwal',['Savannenelefant','Giraffe'],'Blauwale sind die größten heute lebenden Tiere. Viele sind etwa 24–30 Meter lang.')),
  q(animals.find(t=>t.id==='animal-african-savanna-elephant')!,question('Welches ist das größte heute lebende Landtier?','Afrikanischer Savannenelefant',['Löwe','Koala'],'Beim Landtier-Rekord zählt ein Tier, das an Land lebt. Der Blauwal lebt im Meer.')),
  q(animals.find(t=>t.id==='animal-cheetah')!,question('Welches Landtier ist besonders für den schnellsten Sprint bekannt?','Gepard',['Giraffe','Panda'],'Geparden können für kurze Strecken besonders schnell sprinten. Sprintgeschwindigkeit ist etwas anderes als lange Ausdauer.')),
  q(animals.find(t=>t.id==='animal-giraffe')!,question('Welches heute lebende Landtier ist am höchsten?','Giraffe',['Elefant','Löwe'],'Hier geht es um Höhe vom Boden bis zum Kopf. Das ist ein anderer Rekord als Gewicht.')),
  q(animals.find(t=>t.id==='animal-common-octopus')!,question('Welches dieser Tiere besitzt acht Arme?','Oktopus',['Delfin','Meeresschildkröte'],'Ein Oktopus hat acht Arme. Das ist eine Eigenschaft, kein Geschwindigkeitsrekord.'))];
 if(id==='people'){
  // Keep the actually delivered20-person clue/choice bank stable as new people join.
  const retained=PEOPLE_BASELINE.map(id=>people.find(t=>t.id===id)!);
  return people.map((t,i)=>{const old=PEOPLE_BASELINE.indexOf(t.id),index=old<0?i:old;return q(t,question('Wer passt zu diesem Hinweis? '+personRecognitionClue(t),t.title,[retained[(index+3)%retained.length].title,retained[(index+7)%retained.length].title],t.paragraphs.join(' ')));});
 }
 if(id==='technology')return invent.map((t,i)=>{
  // Preserve old answer banks when principle-only optical cards are added.
  const oldIndex=historicalInventions.findIndex(old=>old.id===t.id),index=oldIndex<0?i:oldIndex;
  const prompt=t.invention!.recognitionClue?'Welche Erfindung passt zu dieser Beschreibung? '+t.invention!.recognitionClue:(t.invention!.walkthrough?'Welche Erfindung passt zu dieser Forscherfrage? ':'Welche Erfindung hilft bei diesem Problem? ')+t.invention!.stages[0].text;
  return q(t,question(prompt,t.title,[historicalInventions[(index+3)%historicalInventions.length].title,historicalInventions[(index+5)%historicalInventions.length].title],t.invention!.stages[2].text));
 });
 if(id==='then-now')return historicalInventions.flatMap(t=>[q(t,{...question('Früher oder heute? '+t.invention!.stages[3].text,'Früher',['Heute','Noch keine wirkliche Entwicklung'],t.invention!.stages[4].text),prompt:'Früher oder heute? '+t.invention!.stages[3].text}),{...q(t,t.invention!.comparisonQuestion??question('Früher oder heute? '+t.invention!.stages[4].text,'Heute',['Früher','Nur ein Zukunftswunsch'],t.invention!.stages[3].text)),id:t.id+'-today'}]);
 if(id==='food')return animals.map(t=>q(t,question('Welche Beschreibung passt zur Nahrung? Tier: '+t.title+'.',t.animal!.diet,foodDistractors(t.id),t.facts.find(f=>f.label==='Was frisst es?'||f.label==='Nahrung')?.text??t.animal!.diet),t.image));
 if(id==='habitats')return animals.map(t=>q(t,question('Welcher Lebensraum passt in freier Natur? Tier: '+t.title+'.',t.animal!.habitat,habitatDistractors(t.id),t.title+': '+(t.facts.find(f=>f.label==='Lebensraum')?.text??t.animal!.habitat)),t.image));
 return animals.map((t,i)=>{const clue=animalDetectiveClue(t.id).clue;return q(t,question('Wer bin ich? '+clue,t.title,[animals[(i+5)%animals.length].title,animals[(i+9)%animals.length].title],'Gesucht ist '+t.title+'. So beschreibt sich das Tier: „'+clue+'“'));});
}
