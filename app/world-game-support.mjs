import clues from './animal-detective-clues.json' with {type:'json'};
import catalog from './world-catalog.json' with {type:'json'};
const detective=new Map(clues.entries.map(row=>[row.id,row]));
/** @param {string} id */
export function animalDetectiveClue(id){const row=detective.get(id);if(!row)throw Error('Animal clue not reviewed: '+id);return row;}
/** @type {Record<string,string>} */
const hints={
 habitats:'Denke an Nahrung, Ruheplätze und Fortbewegung. Prüfe, ob der Lebensraum zum Leben an Land, am Wasser oder im Wasser passt.',
 food:'Vergleiche die ganze Beschreibung der Nahrung. Achte auch darauf, ob vom erwachsenen Tier oder einem anderen Entwicklungsstadium die Rede ist.',
 people:'Vergleiche die genannte Tätigkeit oder Entdeckung mit dem, was du über die angebotenen Personen weißt.',
 technology:'Welches Problem wird beschrieben? Vergleiche, was die angebotenen Erfindungen jeweils ermöglichen.',
 'then-now':'Vergleiche, welche Möglichkeiten es früher gab und welche erst später hinzukamen. Eine ähnliche Aufgabe kann unterschiedlich gelöst werden.'
};
/** @type {Record<string,string>} */
const recordHints={
 'animal-blue-whale':'Unterscheide alle heute lebenden Tiere von Tieren, die ausschließlich an Land leben.',
 'animal-african-savanna-elephant':'Hier werden nur Tiere verglichen, die an Land leben. Das größte Meerestier beantwortet diese Frage nicht.',
 'animal-cheetah':'Ein Sprint ist ein kurzer schneller Lauf. Das ist etwas anderes als große Ausdauer.',
 'animal-giraffe':'Vergleiche die Höhe vom Boden bis zum Kopf, nicht das Gewicht oder die Länge.',
 'animal-common-octopus':'Achte auf den Körperbau: Arme, Flossen und Beine sind unterschiedliche Körperteile.'
};
/** @param {string} game @param {{id:string}} item */
export function worldGameHint(game,item){
 if(game==='animal-detective')return animalDetectiveClue(item.id).hint;
 if(game==='records')return recordHints[item.id]??'Welche Eigenschaft wird genau verglichen?';
 return hints[game]??'Vergleiche alle Hinweise, bevor du dich entscheidest.';
}
/** @param {string} game @param {{id:string}} item @param {string} answer */
export function worldGameWrongFeedback(game,item,answer){
 if(game==='habitats'){
  if(answer==='Trockene Sandwüste fern von Gewässern')return 'Du hast eine Gegend ohne Gewässer gewählt. Überlege, welche Rolle Wasser im Leben dieses Tieres spielt.';
  if(answer==='Baumkronen im tropischen Regenwald')return 'Du hast die oberen Zweige von Bäumen gewählt. Vergleiche das mit der Fortbewegung und Nahrungssuche dieses Tieres.';
  if(answer==='Unter Wasser in einem warmen Korallenriff')return 'Diese Wahl liegt dauerhaft unter Wasser. Prüfe, ob das zum ganzen Leben des gesuchten Tieres passt.';
  if(answer==='Meereis der Antarktis')return 'Diese Wahl liegt in der südlichen Polarregion. Vergleiche Klima und Lage mit dem Lebensraum dieses Tieres.';
 }
 if(game==='animal-detective'){
  const selected=catalog.find(t=>t.title===answer&&t.animal);
  if(selected?.animal)return 'Du hast „'+answer+'“ gewählt. Lebensraum: '+selected.animal.habitat+'. Nahrung: '+selected.animal.diet+'. Vergleiche das mit allen Rätselspuren. Eine einzelne Gemeinsamkeit reicht nicht.';
 }
 return 'Du hast „'+answer+'“ gewählt. '+worldGameHint(game,item);
}
