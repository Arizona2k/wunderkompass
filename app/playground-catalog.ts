import INDEX from './game-index.json' with {type:'json'};
import {LAYERS} from './earth-data';
import type {LocalProgress} from './progress-storage';
export type GameFamily='classic'|'extra'|'world';
export const GAME_THEMES=['Alle Themen','Länder & Weltkarte','Tiere & Lebensräume','Erde & Wetter','Geschichte & Ideen','Wissen verbinden'] as const;
export const GAME_MECHANICS=['Alle Spielarten','Paare merken','Sortieren & zuordnen','Spuren kombinieren','Aussagen prüfen','Entdeckungsreise'] as const;
type Meta={theme:typeof GAME_THEMES[number];mechanic:typeof GAME_MECHANICS[number];goal:string;age:number;levels?:boolean};
const m=(theme:Meta['theme'],mechanic:Meta['mechanic'],goal:string,age=8,levels=false):Meta=>({theme,mechanic,goal,age,levels});
const META:Record<string,Meta>={
 'classic:hunt':m('Länder & Weltkarte','Entdeckungsreise','Orte auf der Weltkugel finden',8),
 'classic:memory':m('Länder & Weltkarte','Paare merken','Länder mit Hauptstädten verbinden',6),
 'classic:order':m('Erde & Wetter','Sortieren & zuordnen','Schichten und Wasserwege erklären',6),
 'classic:habitats':m('Tiere & Lebensräume','Sortieren & zuordnen','Lebensräume und Anpassungen verstehen',6,true),
 'classic:detective':m('Erde & Wetter','Aussagen prüfen','Irrtümer erkennen und Wissen übertragen',6,true),
 'classic:quiz':m('Wissen verbinden','Aussagen prüfen','Erdwissen in eigenen Themenrunden prüfen',8,true),
 'extra:flags':m('Länder & Weltkarte','Spuren kombinieren','Flaggen an Farben und Formen erkennen',6),
 'extra:flag-memory':m('Länder & Weltkarte','Paare merken','Flaggen mit Ländern verbinden',6),
 'extra:capitals':m('Länder & Weltkarte','Spuren kombinieren','Hauptstädte kennenlernen',8),
 'extra:continent-sort':m('Länder & Weltkarte','Sortieren & zuordnen','Länder auf Kontinenten einordnen',6),
 'extra:continent-puzzle':m('Länder & Weltkarte','Sortieren & zuordnen','Kontinente an ihren Formen finden',6),
 'extra:silhouettes':m('Länder & Weltkarte','Spuren kombinieren','Küsten und Länderformen vergleichen',9),
 'extra:animal-detective':m('Tiere & Lebensräume','Spuren kombinieren','Tierhinweise miteinander verbinden',6),
 'extra:habitat-sort':m('Tiere & Lebensräume','Sortieren & zuordnen','Tiere und ihre Umgebung verbinden',6),
 'extra:climate-detective':m('Erde & Wetter','Spuren kombinieren','Klimagürtel vergleichen',9),
 'extra:weather-match':m('Erde & Wetter','Sortieren & zuordnen','Wetterzeichen mit Beobachtungen verbinden',6),
 'extra:volcano-label':m('Erde & Wetter','Sortieren & zuordnen','Den Aufbau eines Vulkans verstehen',8),
 'extra:photos':m('Erde & Wetter','Spuren kombinieren','Fotos genau beobachten und erklären',6),
 'extra:worldtour':m('Länder & Weltkarte','Entdeckungsreise','Sieben Weltregionen kennenlernen',8),
 'extra:treasure':m('Erde & Wetter','Spuren kombinieren','Naturrekorde nach ihrer Messregel unterscheiden',9),
 'extra:ocean-find':m('Länder & Weltkarte','Entdeckungsreise','Ozeane auf der Karte finden',6),
 'extra:neighbors':m('Länder & Weltkarte','Sortieren & zuordnen','Deutschlands Nachbarn entdecken',8),
 'world:knowledge-challenge':m('Wissen verbinden','Spuren kombinieren','Natur, Erde und Weltall verbinden',6,true),
 'world:animal-detective':m('Tiere & Lebensräume','Spuren kombinieren','Tiermerkmale als Spuren nutzen',8),
 'world:habitats':m('Tiere & Lebensräume','Sortieren & zuordnen','Tiere mit einer passenden Heimat verbinden',6),
 'world:food':m('Tiere & Lebensräume','Sortieren & zuordnen','Nahrung und Tiermerkmale verbinden',6),
 'world:records':m('Tiere & Lebensräume','Spuren kombinieren','Tierrekorde nach genauen Regeln vergleichen',9),
 'world:chronology':m('Geschichte & Ideen','Sortieren & zuordnen','Zeitanker von früher nach später ordnen',9),
 'world:people':m('Geschichte & Ideen','Spuren kombinieren','Menschen hinter Ideen kennenlernen',9),
 'world:technology':m('Geschichte & Ideen','Spuren kombinieren','Probleme mit Erfindungen verbinden',8),
 'world:then-now':m('Geschichte & Ideen','Aussagen prüfen','Frühere und heutige Technik unterscheiden',8),
};
export const PLAYGROUND_GAMES=INDEX.map(g=>({...g,family:g.family as GameFamily,key:g.family+':'+g.id,...META[g.family+':'+g.id]}));
export type PlaygroundGame=typeof PLAYGROUND_GAMES[number];
export const gameSaveId=(g:Pick<PlaygroundGame,'id'|'family'>)=>g.family==='world'?'world:'+g.id:g.id;
export function gameStatus(g:PlaygroundGame,p:LocalProgress):{label:string;resume:boolean;finished:boolean;stamped:boolean}{
 const s=p.gameSessions[gameSaveId(g)],stamped=g.id==='order'&&g.family==='classic'?p.games.some(id=>id==='order-layers'||id==='order-water'):p.games.includes(gameSaveId(g));
 let finished=!!s&&(s.finished===true||s.done===true||s.roundDone===true||s.timeDone===true);
 if(s?.learningRound&&typeof s.learningRound==='object')finished=(s.learningRound as {done?:boolean}).done===true;
 if(s?.challenge&&typeof s.challenge==='object')finished=(s.challenge as {done?:boolean}).done===true;
 if(g.id==='memory'&&g.family==='classic')finished=Array.isArray(s?.matched)&&s.matched.length===6;
 if(g.id==='flag-memory')finished=Array.isArray(s?.found)&&s.found.length===6;
 const sizes:Record<string,number>={'continent-sort':8,'habitat-sort':7,'weather-match':5,'continent-puzzle':7,'volcano-label':4,'neighbors':9};
 if(g.family==='extra'&&sizes[g.id])finished=Array.isArray(s?.found)&&s.found.length===sizes[g.id];
 if(g.family==='extra'&&g.id==='ocean-find')finished=s?.index===4&&s.found===true;
 if(g.family==='classic'&&g.id==='order')finished=s?.checked===true&&Array.isArray(s.chosen)&&Array.isArray(s.pool)&&s.chosen.length===4&&s.chosen.every((id,i)=>id===(s.topic==='water'?['sun','cloud','rain','river']:LAYERS.map(l=>l.id))[i]);
 const quiz=g.family==='classic'&&g.id==='quiz',hunt=g.family==='classic'&&g.id==='hunt';
 if(quiz)finished=p.quizSession?.finished===true;if(hunt)finished=p.missions.length===12;
 const hasRound=s?.learningRound&&typeof s.learningRound==='object'?(s.learningRound as {level?:unknown}).level!=null:s?.challenge&&typeof s.challenge==='object'?(s.challenge as {difficulty?:unknown}).difficulty!=null:!!s&&Object.keys(s).length>0;
 const resume=quiz?!!p.quizSession&&!p.quizSession.finished:hunt?p.missions.length>0&&!finished:!!hasRound&&!finished;
 const earned=stamped||(quiz&&p.quizResults.length>0)||(hunt&&finished);
 return {label:finished?'Runde abgeschlossen':resume?'Runde fortsetzen':earned?'Schon gespielt':'Noch entdecken',resume,finished,stamped:earned};
}
export function filterGames(theme:string,mechanic:string){return PLAYGROUND_GAMES.filter(g=>(theme===GAME_THEMES[0]||g.theme===theme)&&(mechanic===GAME_MECHANICS[0]||g.mechanic===mechanic));}
