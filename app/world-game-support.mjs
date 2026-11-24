import clues from './animal-detective-clues.json' with {type:'json'};
import catalog from './world-catalog.json' with {type:'json'};
const detective=new Map(clues.entries.map(row=>[row.id,row]));
/** @param {string} id */
export function animalDetectiveClue(id){const row=detective.get(id);if(!row)throw Error('Animal clue not reviewed: '+id);return row;}
/** @param {{title:string,intro:string}} topic */
// Eigene Personen-Rätsel statt des Kartenanfangs. Darwin und Einstein: eindeutige Rätsel (Teil B, Entscheidungsliste Punkt 7).
// Armstrong, Mandela, Murasaki Shikibu, Tagore, Jemison, Darwin und Einstein: ohne „er“, „sie“, „sein“, „ihr“ und Berufswörter,
// die verraten, ob ein Mann oder eine Frau gesucht ist (Stufen-Prüfung Teil B, M5). Nur Aussagen, die auf der Karte stehen
// (Einstein vorher mit E = mc², das auf keiner Karte steht; Benz vorher mit „Benzinmotor“, das den Namen verrät).
// Fassungen nach kinder-redaktion und fakten-pruefer, 24.11.2026 (docs/entwurf/2026-11-24-welt-spiele-texte-*.md).
/** @type {Record<string,string>} */
export const EIGENE_RAETSEL={
 'person-charles_darwin':'Fast fünf Jahre lang reiste diese Person mit dem Schiff „Beagle“. Später erklärte diese Person, wie sich Lebewesen über viele Generationen verändern.',
 'person-albert_einstein':'Diese Person untersuchte Licht, Raum und Zeit. Dabei stellte sich diese Person Dinge ganz genau vor und überlegte, was dann passieren würde.',
 'person-karl_benz':'Diese Person entwickelte einen frühen Motorwagen. So ein Wagen fährt mit einem Motor.',
 'person-al_khwarizmi':'Diese Person schrieb in Bagdad wichtige Bücher übers Rechnen. Darin ging es auch um Algebra: das Rechnen mit unbekannten Zahlen.',
 'person-neil_armstrong':'Diese Person landete mit Buzz Aldrin auf dem Mond. Die Reise hieß Apollo 11.',
 'person-nelson_mandela':'Diese Person setzte sich in Südafrika gegen die Apartheid ein. Die Apartheid teilte Menschen in Gruppen ein und gab ihnen ungleiche Rechte. 1994 wurde diese Person das Oberhaupt des Landes.',
 'person-murasaki_shikibu':'Diese Person lebte vor über 1000 Jahren am Hof des Kaisers von Japan. Dort schrieb diese Person die Erzählung vom Prinzen Genji.',
 'person-rabindranath_tagore':'Diese Person schrieb Gedichte, Geschichten und Lieder. Außerdem malte diese Person Bilder: Aus frei gezogenen Linien wurden neue Formen.',
 'person-mae_jemison':'Diese Person kannte sich mit Medizin und Technik aus. 1992 flog diese Person mit der Raumfähre Endeavour ins All und forschte dort.'
};
export function personRecognitionClue(topic){
 // These delivered riddles stay independent of a richer biography opening.
 // Reordered/parenthetical name parts must not reveal the requested person.
 if(Object.hasOwn(EIGENE_RAETSEL,topic.id))return EIGENE_RAETSEL[topic.id];
 const variants=[topic.title],optional=topic.title.match(/^(.*?)\s*\(([^()]*)\)(.*)$/u);
 if(optional){const[,before,alternative,after]=optional;variants.push((before+after).trim(),after.trim()?(before.replace(/\S+\s*$/u,'')+alternative+after).trim():alternative.trim());}
 let clue=topic.intro;
 for(const name of [...new Set(variants.filter(Boolean))].sort((a,b)=>b.length-a.length)){
  const escaped=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  // Am Satzanfang „Diese Person“, mitten im Satz „diese Person“ (fakten-pruefer 24.11.2026: „Mit 26 Jahren begann Diese Person …“).
  clue=clue.replace(new RegExp('(?<![\\p{L}\\p{N}])'+escaped+'(?![\\p{L}\\p{N}])','giu'),(_,offset,text)=>/^\s*$|[.!?:]\s*$/u.test(text.slice(0,offset))?'Diese Person':'diese Person');
 }
 return clue;
}
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
 const comparison=game==='then-now'?catalog.find(t=>t.id+'-today'===item.id)?.invention?.comparisonQuestion:undefined;
 if(comparison)return comparison.hint;
 if(game==='animal-detective')return animalDetectiveClue(item.id).hint;
 if(game==='records')return recordHints[item.id]??'Welche Eigenschaft wird genau verglichen?';
 return hints[game]??'Vergleiche alle Hinweise, bevor du dich entscheidest.';
}
/** @param {string} game @param {{id:string}} item @param {string} answer */
export function worldGameWrongFeedback(game,item,answer){
 const comparison=game==='then-now'?catalog.find(t=>t.id+'-today'===item.id)?.invention?.comparisonQuestion:undefined;
 if(comparison){const index=comparison.answers.indexOf(answer),reason=comparison.wrongReasons[index];if(reason)return reason;}
 if(game==='habitats'){
  if(answer==='Trockene Sandwüste fern von Gewässern')return 'Du hast eine Gegend ohne Gewässer gewählt. Überlege, welche Rolle Wasser im Leben dieses Tieres spielt.';
  if(answer==='Baumkronen im tropischen Regenwald')return 'Du hast die oberen Zweige von Bäumen gewählt. Vergleiche das mit der Fortbewegung und Nahrungssuche dieses Tieres.';
  if(answer==='Unter Wasser in einem warmen Korallenriff')return 'Diese Wahl liegt dauerhaft unter Wasser. Prüfe, ob das zum ganzen Leben des gesuchten Tieres passt.';
  if(answer==='Meereis der Antarktis')return 'Diese Wahl liegt in der südlichen Polarregion. Vergleiche Klima und Lage mit dem Lebensraum dieses Tieres.';
 }
 // Gezogene Fallen sind Texte anderer Tiere (Teil B, Schritt 8.3): Die Rückmeldung nennt ein Tier, zu dem die Wahl passt.
 if(game==='habitats'||game==='food'){
  const feld=game==='habitats'?'habitat':'diet',anderes=catalog.find(t=>t.animal&&t.id!==item.id&&t.animal[feld]===answer),gesucht=catalog.find(t=>t.id===item.id);
  // Namen nur hinter einem Doppelpunkt, weil Artikel fehlen; die Wahl wird nicht wiederholt (kinder-redaktion 24.11.2026).
  if(anderes&&gesucht)return 'Diese Wahl passt zum Beispiel zu: '+anderes.title+'. Gesucht ist aber: '+gesucht.title+'. '+(game==='habitats'?'Wo findet dieses Tier Futter und Schutz?':'Frisst dieses Tier Pflanzen, andere Tiere oder beides?');
 }
 if(game==='animal-detective'){
  const selected=catalog.find(t=>t.title===answer&&t.animal);
  if(selected?.animal)return 'Du hast „'+answer+'“ gewählt. Lebensraum: '+selected.animal.habitat+'. Nahrung: '+selected.animal.diet+'. Vergleiche das mit allen Rätselspuren. Eine einzelne Gemeinsamkeit reicht nicht.';
 }
 return 'Du hast „'+answer+'“ gewählt. '+worldGameHint(game,item);
}
