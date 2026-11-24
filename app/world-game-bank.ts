import {habitatDistractors} from './world-game-habitats.mjs';
import {animalDetectiveClue,personRecognitionClue} from './world-game-support.mjs';
import {foodDistractors} from './world-game-food.mjs';
import CATALOG from './world-catalog.json' with {type:'json'};
import PEOPLE_BASELINE from './people-game-baseline.json' with {type:'json'};
import TIER_FALLEN from './world-game-tier-fallen.json' with {type:'json'};
import type {WorldTopic,WorldQuestion} from './world-types';
const TOPICS=CATALOG as WorldTopic[];
// „Erst in der Zukunft“ passt zu den Stufen der Erfindungskarten (Früher, Heute, Zukunft) und ist bei jeder Aufgabe klar falsch
// (kinder-redaktion und fakten-pruefer, 24.11.2026).
export const DRITTE_ANTWORT='Erst in der Zukunft';
// Bis 24.11.2026 hatte jede Aufgabe ihre eigene dritte Antwort; gespeicherte Runden dürfen sie behalten.
const ALTE_DRITTE_ANTWORT:Record<string,string>={Früher:'Noch keine wirkliche Entwicklung',Heute:'Nur ein Zukunftswunsch'};
type GameItem=WorldQuestion & {id:string;topic:string;image?:string};
const question=(prompt:string,correct:string,wrong:string[],why:string):WorldQuestion=>({prompt,answers:[correct,...wrong],correct:0,why});
// Recognition questions can keep older real topic names as distractors. Factual
// choices in the other games remain tied to the current question's answer set.
// Auf Profi haben diese drei Spiele eine Antwort mehr (Teil B, Schritt 8.2): die richtige und drei Namen aus dem Vorrat.
// Lebensraum und Nahrung ziehen ihre Fallen je Runde aus einer geprüften Liste je Tier (Schritt 8.3): gültig sind die richtige
// Antwort, die alten festen Sätze (alte Runden) und die Fallen aus der Liste, drei oder auf Profi vier Antworten.
export function validWorldGameOrder(value:unknown,current:GameItem,pool:GameItem[],gameId?:string):value is string[]{
 const recognition=!!gameId&&['animal-detective','people','technology'].includes(gameId);
 const tierListe=gameId==='habitats'?TIER_FALLEN.lebensraum:gameId==='food'?TIER_FALLEN.nahrung:null,fallen=(tierListe as Record<string,{entdecker:string[];profi:string[]}>|null)?.[current.id];
 if(!Array.isArray(value)||!(value.length===current.answers.length||(recognition||!!fallen)&&value.length===current.answers.length+1)||new Set(value).size!==value.length||!value.every(answer=>typeof answer==='string'))return false;
 if(value.every(answer=>current.answers.includes(answer)))return true;
 const alteDritte=gameId==='then-now'&&current.answers.includes(DRITTE_ANTWORT)?ALTE_DRITTE_ANTWORT[current.answers[current.correct]]:undefined;
 if(alteDritte){const alt=current.answers.map(answer=>answer===DRITTE_ANTWORT?alteDritte:answer);return value.length===alt.length&&value.every(answer=>alt.includes(answer));}
 if(fallen)return value.includes(current.answers[current.correct])&&value.every(answer=>current.answers.includes(answer)||fallen.entdecker.includes(answer)||fallen.profi.includes(answer));
 if(!recognition||!value.includes(current.answers[current.correct]))return false;
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
 // Früher oder heute? Alle Aufgaben haben dieselbe dritte Antwort (Stufen-Prüfung Teil B, M1): Vorher stand bei „Früher“
 // immer „Noch keine wirkliche Entwicklung“ und bei „Heute“ immer „Nur ein Zukunftswunsch“; die Falle verriet die Lösung.
 if(id==='then-now')return historicalInventions.flatMap(t=>[q(t,{...question('Früher oder heute? '+t.invention!.stages[3].text,'Früher',['Heute',DRITTE_ANTWORT],t.invention!.stages[4].text),prompt:'Früher oder heute? '+t.invention!.stages[3].text}),{...q(t,t.invention!.comparisonQuestion??question('Früher oder heute? '+t.invention!.stages[4].text,'Heute',['Früher',DRITTE_ANTWORT],t.invention!.stages[3].text)),id:t.id+'-today'}]);
 if(id==='food')return animals.map(t=>q(t,question('Welche Beschreibung passt zur Nahrung? Tier: '+t.title+'.',t.animal!.diet,foodDistractors(t.id),t.facts.find(f=>f.label==='Was frisst es?'||f.label==='Nahrung')?.text??t.animal!.diet),t.image));
 if(id==='habitats')return animals.map(t=>q(t,question('Welcher Lebensraum passt in freier Natur? Tier: '+t.title+'.',t.animal!.habitat,habitatDistractors(t.id),t.title+': '+(t.facts.find(f=>f.label==='Lebensraum')?.text??t.animal!.habitat)),t.image));
 return animals.map((t,i)=>{const clue=animalDetectiveClue(t.id).clue;return q(t,question('Wer bin ich? '+clue,t.title,[animals[(i+5)%animals.length].title,animals[(i+9)%animals.length].title],'Gesucht ist '+t.title+'. So beschreibt sich das Tier: „'+clue+'“'));});
}
