import DATA from './world-index.json';
import type {Place} from './earth-data';
import type {WorldCategory,WorldEntry} from './world-types';
export const WORLD_INDEX=DATA as WorldEntry[];
export const WORLD_CATEGORIES:{id:WorldCategory;title:string;intro:string;icon:string;seed:string}[]=[
 {id:'animals',title:'Die Tierwelt',intro:'Spuren folgen, Lebensräume besuchen und Tiere schützen.',icon:'PawPrint',seed:'animal-polar-bear'},
 {id:'history',title:'Zeitreise',intro:'Von frühen Werkzeugen bis zum Blick in ferne Galaxien.',icon:'History',seed:'history-apollo11'},
 {id:'people',title:'Große Köpfe',intro:'Menschen, Fragen und Ideen, die unsere Welt veränderten.',icon:'Users',seed:'person-marie_curie'},
 {id:'inventions',title:'Erfindungen',intro:'Probleme lösen, Teile untersuchen und Technik ausprobieren.',icon:'Lightbulb',seed:'invention-car'},
 {id:'buildings',title:'Bauwerke',intro:'Was trägt eine Brücke? Wie hebt Wasser ein Schiff?',icon:'Landmark',seed:'building-golden-gate-bridge'},
 {id:'science',title:'Große Fragen',intro:'Strom, Computer, Fliegen und Navigation selbst erforschen.',icon:'FlaskConical',seed:'science-circuit'}
];
export function worldPlace(entry:WorldEntry,index=0):Place{const p=entry.locations[index];return {id:`world-${entry.id}-${index}`,name:entry.title,kind:'nature',lat:p.lat,lon:p.lon,text:p.label+'. '+entry.intro,fact:entry.category==='animals'?'Dieser Punkt zeigt eine Beispielregion, keine vollständige Tierverbreitung. Mehr dazu auf der Entdeckerkarte.':'Dieser Punkt zeigt einen verbundenen Ort. Entwicklungen hatten oft viele Beteiligte und weitere Orte.',label:entry.title};}
export const WORLD_PLACES=WORLD_INDEX.flatMap(t=>t.locations.map((_,i)=>worldPlace(t,i)));
export function worldEntryForPlace(id:string){return WORLD_INDEX.find(t=>t.locations.some((_,i)=>`world-${t.id}-${i}`===id));}
export const WORLD_ROUTES=[
 {id:'safari',title:'Safari mit Forscheraugen',intro:'Fünf Tiere, fünf erstaunliche Anpassungen.',topics:['animal-african-savanna-elephant','animal-giraffe','animal-lion','animal-cheetah','animal-jaguar']},
 {id:'ideas',title:'Wie Ideen um die Welt reisen',intro:'Schrift, Papier, Druck und vernetzte Computer.',topics:['history-writing','history-paper','person-johannes_gutenberg','invention-computer','invention-internet']},
 {id:'space',title:'Unser Weg ins Weltall',intro:'Rechnen, Raketen und gemeinsame Forschung.',topics:['person-katherine_johnson','invention-rocket','history-apollo11','person-mae_jemison','history-iss']},
 {id:'energy',title:'Vom Licht zur Bewegung',intro:'Stromkreise, Motoren und Energie für den Abend.',topics:['science-circuit','invention-light','science-motor','science-energy','invention-satellite']},
 {id:'ocean-life',title:'Das Meer lebt und bewegt sich',intro:'Strömungen, Nahrungsketten und große Meeresbewohner.',topics:['science-currents','science-foodweb','animal-blue-whale','animal-whale-shark','animal-common-octopus']},
 {id:'world-knowledge',title:'Wissen reist um die Welt',intro:'Maya, Zahlzeichen, Timbuktu und Navigation im Pazifik.',topics:['history-maya','history-zero','history-timbuktu','history-polynesia','science-solar-system']}
];
