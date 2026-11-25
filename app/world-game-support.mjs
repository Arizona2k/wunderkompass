import clues from './animal-detective-clues.json' with {type:'json'};
import catalog from './world-catalog.json' with {type:'json'};
const detective=new Map(clues.entries.map(row=>[row.id,row]));
/** @param {string} id */
export function animalDetectiveClue(id){const row=detective.get(id);if(!row)throw Error('Animal clue not reviewed: '+id);return row;}
// Eigene Personen-Rätsel statt des Kartenanfangs, für alle 36 Personen (Endfassung 25.11.2026, docs/entwurf/
// 2026-11-25-personen-raetsel-endfassung.md, Abschnitt 1 mit den Änderungen aus Abschnitt 7). Satz 1 sagt, wofür die Person
// bekannt ist, und reicht Entdeckern allein (worldGamePrompt); die weiteren Sätze helfen auf Profi. Ohne Namensteile und ohne
// „er“, „sie“, „sein“, „ihr“ und Berufswörter, die verraten, ob ein Mann oder eine Frau gesucht ist (Stufen-Prüfung Teil B, M5).
// Nur Aussagen, die auf der Karte stehen oder geprüft sind (fakten-pruefer, kinder-redaktion, stufen-pruefer).
/** @type {Record<string,string>} */
export const EIGENE_RAETSEL={
 'person-jane_goodall':'Diese Person beobachtete wilde Schimpansen und gab den Tieren Namen statt Nummern. Dabei zeigte sich: Schimpansen holen mit Zweigen Termiten aus dem Bau.',
 'person-wangari_maathai':'Diese Person pflanzte in Kenia mit vielen Menschen Bäume. 2004 bekam diese Person den Friedensnobelpreis, einen der berühmtesten Preise der Welt.',
 'person-ada_lovelace':'Diese Person schrieb vor etwa 180 Jahren Rechenschritte für eine geplante Rechenmaschine. Außerdem dachte diese Person: So eine Maschine könnte vielleicht auch mit Musik arbeiten.',
 'person-bertha_benz':'Diese Person wagte mit einem der ersten Autos eine lange Fahrt. 1888 ging die Reise mit den beiden Söhnen von Mannheim nach Pforzheim.',
 'person-cai_lun':'Diese Person half im alten China, besseres Papier herzustellen. Es heißt: Im Jahr 105 kam dieses Papier an den Hof des Kaisers.',
 'person-marie_curie':'Diese Person erforschte unsichtbare Strahlen und bekam zweimal den Nobelpreis. Das ist einer der berühmtesten Preise der Welt. Im Team entdeckte diese Person 1898 zwei neue Grundstoffe: Polonium und Radium.',
 'person-rachel_carson':'Diese Person warnte: Gift gegen Insekten kann auch Vögel und andere Tiere treffen. Darüber schrieb diese Person 1962 ein Buch: Gift kann mit dem Futter weiterwandern.',
 'person-inge_lehmann':'Diese Person entdeckte: Mitten in der Erde steckt ein Kern im Kern. Dafür verglich diese Person, wann Erdbebenwellen an verschiedenen Orten ankamen.',
 'person-tu_youyou':'Diese Person fand im Team ein Mittel gegen Malaria, eine Krankheit durch Mückenstiche. Das Mittel stammt aus einer Pflanze: dem Einjährigen Beifuß.',
 'person-maria_sibylla_merian':'Diese Person beobachtete und zeichnete, wie aus Raupen Schmetterlinge werden. 1699 reiste diese Person mit der jüngsten Tochter nach Suriname in Südamerika.',
 'person-johannes_gutenberg':'Diese Person druckte in Mainz Bücher mit einzelnen Buchstaben aus Metall. Die beweglichen Buchstaben ließen sich danach für einen anderen Text neu ordnen.',
 'person-katsushika_hokusai':'Von dieser Person stammt ein berühmtes Bild mit einer riesigen Welle. Das Bild zeigt auch den Berg Fuji und wurde mit Holzblöcken gedruckt.',
 'person-alexander_humboldt':'Diese Person verglich, welche Pflanzen unten und welche hoch oben am Berg wachsen. Von 1799 bis 1804 reiste diese Person durch Teile Amerikas.',
 'person-grace_hopper':'Diese Person half, Befehle für Computer in Wörtern zu schreiben. Dafür entstanden im Team frühe Programme, die Wörter für den Computer übersetzen.',
 'person-katherine_johnson':'Diese Person rechnete aus, auf welchem Weg Raumschiffe durch den Weltraum fliegen. 1962 prüfte diese Person Computer-Rechnungen für einen Flug rund um die Erde.',
 'person-tim_berners_lee':'Diese Person entwickelte das Web: Seiten im Internet, die miteinander verbunden sind. Ende 1990 lief der erste Browser, ein Programm, das solche Seiten zeigt.',
 'person-mary_anning':'Diese Person fand an der Küste versteinerte Reste von Tieren aus uralter Zeit. In England grub diese Person Teile eines ausgestorbenen Meerestiers aus.',
 'person-ibn_al_haytham':'Diese Person erforschte vor etwa 1000 Jahren, wie Licht und unser Sehen funktionieren. Mit Versuchen zeigte diese Person: Licht kommt von den Dingen in unsere Augen.',
 'person-henrietta_swan_leavitt':'Diese Person fand Sterne, die in einem festen Takt heller und dunkler werden. Dieser Takt hilft, Entfernungen im Weltall zu messen. Die Sterne fand diese Person auf vielen Fotos vom Himmel.',
 'person-cecilia_payne_gaposchkin':'Diese Person untersuchte das Licht der Sterne, um herauszufinden, woraus Sterne bestehen. Das Ergebnis von 1925: Sterne bestehen vor allem aus Wasserstoff und Helium.',
 'person-rosalind_franklin':'Diese Person untersuchte mit Röntgenstrahlen, wie der Bauplan von Lebewesen geformt ist. Dieser Bauplan heißt DNA. 1952 entstand im Team ein berühmtes Röntgenbild davon.',
 'person-jocelyn_bell_burnell':'Diese Person fand mit einem Feld voller Antennen regelmäßige Signale aus dem Weltall. Der Fund war ein Zufall: Die Signale erschienen auf langen Papierstreifen.',
 'person-octavia_butler':'Diese Person schrieb Geschichten über erfundene Welten und die Zukunft. Solche Geschichten heißen Science-Fiction und stellen oft Fragen an unser Leben heute.',
 'person-chien_shiung_wu':'Diese Person prüfte mit einem genauen Versuch, ob im Spiegelbild alles genauso abläuft. Ende 1956 zeigte sich im Team: Beim Zerfall mancher Atomkerne ist das nicht so.',
 'person-lise_meitner':'Diese Person erklärte, wie ein winziger Atomkern in zwei Stücke zerbrechen kann. Das gelang 1939 mit Otto Frisch, kurz nach der Flucht aus Deutschland.',
 'person-zaha_hadid':'Diese Person plante Gebäude mit ganz ungewöhnlichen Formen. Dazu gehört ein Feuerwehrhaus von 1993 in der Stadt Weil am Rhein.',
 'person-ibn_sina':'Diese Person schrieb vor etwa 1000 Jahren ein großes Buch über Medizin. Darin sammelte und ordnete diese Person, was man damals über Krankheiten und Heilung wusste.',
 'person-charles_darwin':'Diese Person erklärte, wie sich Tier- und Pflanzenarten über lange Zeit verändern. Vorher reiste diese Person fast fünf Jahre mit dem Schiff „Beagle“ um die Welt.',
 'person-murasaki_shikibu':'Diese Person schrieb in Japan eine sehr lange Geschichte über einen Prinzen. Die Geschichte ist etwa 1000 Jahre alt und spielt am Hof des Kaisers.',
 'person-nelson_mandela':'Diese Person kämpfte in Südafrika für gleiche Rechte, egal welche Hautfarbe. Dort galten ungerechte Gesetze: die Apartheid. 1994 durften zum ersten Mal alle Erwachsenen wählen. Danach führte diese Person das Land.',
 'person-mae_jemison':'Diese Person flog 1992 mit einer Raumfähre ins All und forschte dort. Vorher studierte diese Person Technik und Medizin und behandelte dann kranke Menschen.',
 'person-karl_benz':'Diese Person entwickelte einen Motorwagen, also ein sehr frühes Auto. Dafür mussten Motor, Lenkung und Bremsen gut zusammenpassen.',
 'person-albert_einstein':'Diese Person stellte sich genau vor, was mit Licht, Raum und Zeit passiert. Für eine Arbeit über Licht bekam diese Person den Nobelpreis des Jahres 1921.',
 'person-al_khwarizmi':'Diese Person schrieb in Bagdad wichtige Bücher übers Rechnen. Darin ging es auch um Algebra: das Rechnen mit unbekannten Zahlen.',
 'person-neil_armstrong':'Diese Person landete mit Buzz Aldrin auf dem Mond. Die Reise hieß Apollo 11.',
 'person-rabindranath_tagore':'Diese Person schrieb Gedichte, Geschichten und Lieder. Außerdem malte diese Person Bilder: Aus frei gezogenen Linien wurden neue Formen.'
};
/** @param {{title:string,intro:string}} topic */
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
// Personen-Rätsel: Entdecker sieht und hört nur Satz 1, Profi alles (Endfassung 25.11.2026, Abschnitt 1).
const PERSONEN_FRAGE='Wer passt zu diesem Hinweis? ';
/** @param {string} game @param {{prompt:string}} item @param {string} [stufe] gespielte Stufe der Runde */
export function worldGamePrompt(game,item,stufe){
 if(game!=='people'||stufe!=='entdecker'||!item.prompt.startsWith(PERSONEN_FRAGE))return item.prompt;
 const hinweis=item.prompt.slice(PERSONEN_FRAGE.length);
 return PERSONEN_FRAGE+(hinweis.match(/^.*?[.!?](?=\s|$)/u)?.[0]??hinweis);
}
// Entdecker-Tipp fürs Personenspiel (Endfassung, Abschnitt 3): braucht nur einen bekannten Namen und eine Denkfrage.
// Nach einer falschen Antwort steht die Denkfrage direkt hinter der Wahl, damit „dieser Mensch“ die gewählte Person meint
// (kinder-redaktion beim Einbau, 25.11.2026). „Mensch“ statt „Person“, damit die Wahl nicht wie die gesuchte Person klingt.
const PERSONEN_TIPP_ENTDECKER='Kennst du einen der Namen? Überlege: Hat dieser Mensch so etwas gemacht?';
const PERSONEN_FALSCH_ENTDECKER='Hat dieser Mensch so etwas gemacht? Schau dir auch die anderen Namen an.';
/** @param {string} game @param {{id:string}} item @param {string} [stufe] gespielte Stufe der Runde */
export function worldGameHint(game,item,stufe){
 if(game==='people'&&stufe==='entdecker')return PERSONEN_TIPP_ENTDECKER;
 const comparison=game==='then-now'?catalog.find(t=>t.id+'-today'===item.id)?.invention?.comparisonQuestion:undefined;
 if(comparison)return comparison.hint;
 if(game==='animal-detective')return animalDetectiveClue(item.id).hint;
 if(game==='records')return recordHints[item.id]??'Welche Eigenschaft wird genau verglichen?';
 return hints[game]??'Vergleiche alle Hinweise, bevor du dich entscheidest.';
}
/** @param {string} game @param {{id:string}} item @param {string} answer @param {string} [stufe] gespielte Stufe der Runde */
export function worldGameWrongFeedback(game,item,answer,stufe){
 if(game==='people'&&stufe==='entdecker')return 'Du hast „'+answer+'“ gewählt. '+PERSONEN_FALSCH_ENTDECKER;
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
 return 'Du hast „'+answer+'“ gewählt. '+worldGameHint(game,item,stufe);
}
