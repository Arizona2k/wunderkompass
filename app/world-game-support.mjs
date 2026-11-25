import clues from './animal-detective-clues.json' with {type:'json'};
import catalog from './world-catalog.json' with {type:'json'};
import fallen from './world-game-fallen.json' with {type:'json'};
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
 'person-albert_einstein':'Diese Person machte Versuche im Kopf, um Licht, Raum und Zeit zu verstehen. Für eine Arbeit über Licht bekam diese Person den Nobelpreis des Jahres 1921.',
 'person-al_khwarizmi':'Diese Person schrieb in Bagdad wichtige Bücher übers Rechnen. Darin ging es auch um Algebra: das Rechnen mit unbekannten Zahlen.',
 'person-neil_armstrong':'Diese Person landete mit Buzz Aldrin auf dem Mond. Die Reise hieß Apollo 11.',
 'person-rabindranath_tagore':'Diese Person schrieb Gedichte, Geschichten und Lieder. Außerdem malte diese Person Bilder: Aus frei gezogenen Linien wurden neue Formen.'
};
// Kurze Auflösung nach „Richtig!“ statt der ganzen Karte (Design-Prüfung und Spieltest zum Personen-Rätsel, 25.11.2026;
// Endfassung docs/entwurf/2026-11-25-spiel-aufloesung-endfassung.md). Sie bringt etwas Neues und wiederholt keinen Rätselsatz.
// Höchstens 180 Zeichen, eine Zahl, 13 Wörter je Satz; geprüft von fakten-pruefer, kinder-redaktion und stufen-pruefer.
/** @type {Record<string,string>} */
export const AUFLOESUNG={
 'person-jane_goodall':'Jane Goodall forschte im Wald von Tansania, in Afrika. Am Anfang liefen die Schimpansen vor ihr weg. Erst nach Monaten gewöhnten sich die Tiere an sie.',
 'person-wangari_maathai':'Wangari Maathai wollte, dass die Bäumchen auch groß werden. Darum wurden sie nach dem Pflanzen gepflegt. Später zählte man, wie viele noch wuchsen.',
 'person-ada_lovelace':'Ada Lovelace war Mathematikerin in England. Ihre Rechenschritte gelten als eines der ersten Computerprogramme. Die Maschine dazu wurde aber nie fertig gebaut.',
 'person-bertha_benz':'Bertha Benz zeigte mit ihrer Fahrt: Das neue Auto schafft auch weite Strecken. Ihr Mann hatte es gebaut. Sie gab Geld für seine Arbeit.',
 'person-cai_lun':'Cai Lun arbeitete für den Kaiser von China. Einfaches Papier gab es schon vor ihm. Es besteht aus winzigen Pflanzenfasern, die sich zu einem Blatt verbinden.',
 'person-marie_curie':'Marie Curie stammte aus Polen und forschte in Paris. Mit ihrem Mann fand sie einen neuen Grundstoff. Sie nannten ihn nach Polen: Polonium.',
 'person-rachel_carson':'Rachel Carson erforschte das Leben im Meer. Ihr Buch über Gift heißt „Der stumme Frühling“. Gemeint ist ein Frühling, in dem keine Vögel mehr singen.',
 'person-inge_lehmann':'Inge Lehmann erforschte Erdbebenwellen und das Innere der Erde. Heute wissen wir: Der äußere Erdkern ist flüssig, der innere ist fest.',
 'person-tu_youyou':'Tu Youyou suchte in China nach neuen Medikamenten. Ein Hinweis in alten Büchern über Heilkunde half dem Team weiter. 2015 bekam sie dafür einen Teil des Nobelpreises.',
 'person-maria_sibylla_merian':'Maria Sibylla Merian war Künstlerin und Naturforscherin. Auf ihren Bildern sieht man auch die Pflanzen, an denen die Raupen leben.',
 'person-johannes_gutenberg':'Johannes Gutenberg war Handwerker und Erfinder. Seine Werkstatt druckte die Bibel, das heilige Buch der Christen. In Korea druckte man schon früher mit Schriftzeichen aus Metall.',
 'person-katsushika_hokusai':'Katsushika Hokusai war ein Künstler aus Japan. Er zeichnete die Bilder vor. Andere Menschen schnitten sie in Holz und druckten sie.',
 'person-alexander_humboldt':'Alexander von Humboldt nahm Messgeräte mit auf seine Reisen. Ein Pflanzenforscher aus Frankreich reiste mit ihm. Auch Menschen, die dort lebten, halfen mit.',
 'person-grace_hopper':'Grace Hopper war Mathematikerin in den USA. Früher bestanden Computer-Befehle oft nur aus Zahlen. Wörter sind für Menschen viel leichter zu lesen.',
 'person-katherine_johnson':'Katherine Johnson war Mathematikerin bei der Raumfahrt in den USA. Ergebnisse vom Computer rechnete sie mit einer Tisch-Rechenmaschine nach. So konnten Fehler auffallen.',
 'person-tim_berners_lee':'Tim Berners-Lee ist ein Computer-Fachmann aus England. Er arbeitete an einem Forschungszentrum in der Schweiz. Später durfte jeder seine Erfindung kostenlos nutzen.',
 'person-mary_anning':'Mary Anning legte Fossilien vorsichtig aus dem Stein frei. Zuerst fand ihr Bruder Joseph einen Schädel. Später fand Mary weitere Teile dieses Tieres.',
 'person-ibn_al_haytham':'Ibn al-Haytham lebte und arbeitete lange in Kairo, in Ägypten. Früher dachten viele: Augen schicken Strahlen aus wie eine Taschenlampe. Er zeigte: Es ist umgekehrt.',
 'person-henrietta_swan_leavitt':'Henrietta Swan Leavitt erforschte Sterne an einer Sternwarte in den USA. Sie fand: Von zwei solchen Sternen leuchtet der mit dem langsameren Takt stärker.',
 'person-cecilia_payne_gaposchkin':'Cecilia Payne-Gaposchkin zerlegte Sternenlicht in seine Farben, wie beim Regenbogen. Ihr Fund: Sterne bestehen fast nur aus leichtem Gas, anders als die Erde.',
 'person-rosalind_franklin':'Rosalind Franklin war Forscherin in London. Ihr Röntgenbild gab einen Hinweis: Der Bauplan DNA ist gedreht wie eine Wendeltreppe.',
 'person-jocelyn_bell_burnell':'Jocelyn Bell Burnell war eine junge Forscherin in England. Die Signale kamen von Resten großer Sterne. Diese Reste drehen sich und blitzen wie ein Leuchtturm.',
 'person-octavia_butler':'Octavia Butler war Schriftstellerin in den USA. Ihre Notizen und Entwürfe liegen heute in einer Bibliothek. Darin sieht man: Sie schrieb ihre Texte oft um.',
 'person-chien_shiung_wu':'Chien-Shiung Wu wurde in China geboren und forschte später in den USA. Ihr Versuch zeigte: Auch eine bekannte Naturregel gilt nicht immer.',
 'person-lise_meitner':'Lise Meitner forschte viele Jahre in Berlin über Atome. Ihr Neffe Otto Frisch arbeitete mit ihr. Zusammen erkannten sie: Wenn ein schwerer Atomkern zerbricht, wird Energie frei.',
 'person-zaha_hadid':'Zaha Hadid war Architektin: Sie entwarf Häuser und andere Bauten. Als erste Frau bekam sie einen der wichtigsten Preise für Baukunst. Ihre Ideen malte sie auch als Bilder.',
 'person-ibn_sina':'Ibn Sina wusste viel über Medizin und noch viele andere Dinge. In Europa nannte man ihn Avicenna. Dort übersetzte man sein Buch und schrieb es lange ab.',
 'person-charles_darwin':'Charles Darwin war Naturforscher. Arten können sich über viele Generationen verändern, von Eltern zu Jungen und Enkeln. Ein einzelnes Tier wird dabei nicht zu einer neuen Art.',
 'person-murasaki_shikibu':'Murasaki Shikibus eigene Handschrift gibt es nicht mehr. Wir kennen ihre Geschichte nur, weil andere sie von Hand abschrieben.',
 'person-nelson_mandela':'Nelson Mandela war Anwalt: Er half Menschen vor Gericht. Für seinen Kampf saß er 27 Jahre im Gefängnis. Trotzdem gab er nicht auf.',
 'person-mae_jemison':'Mae Jemison war Ärztin und Astronautin in den USA. Sie war die erste Schwarze Frau im Weltall. Dort half sie bei Versuchen mit Knochenzellen.',
 'person-karl_benz':'Karl Benz war Ingenieur, also ein Fachmann für Technik. 1886 bekam er ein Patent: Andere durften seinen Motorwagen nicht einfach nachbauen. Seine Frau Bertha half ihm.',
 'person-albert_einstein':'Albert Einstein war Physiker, also ein Forscher für Kraft, Bewegung und Licht. Geboren wurde er in Ulm. Er erklärte: Licht bringt seine Energie in kleinen Portionen mit.',
 'person-al_khwarizmi':'Al-Chwarizmi forschte über Zahlen und über die Sterne. Von seinem Namen kommt das Wort „Algorithmus“. Das ist eine Anleitung in festen Schritten, wie ein Rezept.',
 'person-neil_armstrong':'Neil Armstrong testete vorher neue Flugzeuge. 1969 betrat er als erster Mensch den Mond. Ein dritter Mann, Michael Collins, kreiste im Raumschiff um den Mond.',
 'person-rabindranath_tagore':'Rabindranath Tagore war ein Dichter aus Indien. 1913 bekam er den Nobelpreis, als erster Dichter, der kein Europäer war. Manchmal malte er aus durchgestrichenen Wörtern Bilder.'
};
// Kurze Auflösung im Technik-Detektiv statt der langen Erklärung aus der Karte (stages[2]); Nachprüfung Spieltest Soll 2
// und 3, Endfassung docs/entwurf/2026-11-25-technik-aufloesung-endfassung.md. Sie sagt in drei bis vier Sätzen, wie die
// Erfindung funktioniert, und verrät keine Aufgabe aus „Früher oder heute?“. Gleiche Grenzen wie bei den Menschen;
// geprüft von fakten-pruefer (zwei Runden), kinder-redaktion und stufen-pruefer. Auto, Smartphone und Kamera erklären seit dem
// Nachtrag das „Wie“ (Spieltest Soll 1 bis 3; docs/entwurf/2026-11-25-technik-aufloesung-nachtrag-*.md).
/** @type {Record<string,string>} */
export const TECHNIK_AUFLOESUNG={
 'invention-camera':'Die Kamera lenkt Licht mit einer Linse auf Millionen winziger Felder. Jedes Feld macht aus Licht etwas Strom: viel Licht, viel Strom. Die Kamera speichert alle Felder als ein Foto.',
 'invention-telescope':'Das Fernrohr hat vorn eine viel größere Öffnung als dein Auge. Wie ein großer Eimer im Regen fängt es mehr Licht auf. So siehst du auch ganz schwache Sterne.',
 'invention-microscope':'Das Mikroskop vergrößert meist in zwei Schritten. Die untere Linse macht ein größeres Bild. Die obere vergrößert es noch einmal wie eine Lupe.',
 'invention-battery':'Die Batterie ist kein Behälter voller Strom. In ihr verändern sich Stoffe, und das liefert elektrische Energie. Die Lampe leuchtet nur, solange der Stromweg keine Lücke hat.',
 'invention-generator':'Der Generator hat einen Magneten und viel aufgewickelten Draht. Wenn sich der Magnet darin bewegt, fließt im Draht Strom. Die Energie dafür kommt aus der Bewegung.',
 'invention-transistor':'Der Transistor ist ein Schalter, den kein Finger drückt. Ein schwaches elektrisches Signal schaltet darin einen starken Strom an und aus. Viele sind kleiner als ein Staubkorn.',
 'invention-refrigerator':'Der Kühlschrank füllt keine Kälte hinein, er bringt Wärme hinaus. Ein besonderer Stoff in Rohren nimmt innen die Wärme auf. Außen gibt er sie wieder ab.',
 'invention-bicycle':'Das Fahrrad hat vorn und hinten ein Zahnrad, dazwischen eine Kette. Wenn das hintere kleiner ist, dreht sich das Hinterrad bei jeder Pedalrunde öfter. Dafür trittst du fester.',
 'invention-elevator':'Der Aufzug hängt oft an Seilen. Am anderen Ende hängt ein Gegengewicht, so muss der Motor weniger heben. Wenn die Kabine zu schnell fährt, klemmt sich eine Bremse fest.',
 'invention-seismograph':'Der Seismograf steht auf dem Boden und wackelt bei einem Beben mit. Ein schweres Gewicht darin hängt frei und bleibt fast still. Ein Stift daran malt so eine Zickzacklinie.',
 'invention-3d-printing':'Der 3D-Druck baut einen Gegenstand meist aus dünnen Schichten auf. Jede Schicht ist wie eine Scheibe vom fertigen Ding. Bei manchen Geräten macht Licht flüssiges Material hart.',
 'invention-sewing-machine':'Die Nähmaschine sticht mit der Nadel den oberen Faden durch den Stoff. Darunter verschlingt sich ein zweiter Faden mit ihm. Dann rückt der Stoff weiter, und alles beginnt neu.',
 'invention-light':'Elektrisches Licht leuchtet ganz ohne Flamme. Dafür bringen Leitungen den Strom bis ins Haus. Thomas Edison und sein Team bauten Lampen und ein ganzes Stromnetz.',
 'invention-airplane':'Das Flugzeug hat Flügel, die Luft nach unten lenken. Dabei wird es nach oben gedrückt. 1903 flogen die Brüder Wright mit Motor und konnten dabei lenken.',
 'invention-phone':'Das Telefon macht aus deiner Stimme ein elektrisches Signal. Das andere Telefon macht daraus wieder Ton. Viele forschten daran, auch Alexander Graham Bell.',
 'invention-computer':'Der Computer folgt einem Programm, also einer Liste genauer Schritte. Er arbeitet sie sehr schnell nacheinander ab. Einen einzigen Erfinder des Computers gibt es nicht.',
 'invention-internet':'Das Internet verbindet Geräte auf der ganzen Welt. Eine Nachricht reist darin in vielen kleinen Päckchen. Am Ziel werden sie zusammengesetzt wie ein Puzzle.',
 'invention-compass':'Der Kompass hat eine magnetische Nadel, die ungefähr nach Norden zeigt. Die Erde wirkt dabei wie ein riesiger Magnet. Ihr magnetischer Nordpol liegt aber nicht genau am Nordpol.',
 'invention-printing':'Der Buchdruck arbeitete mit einzelnen Buchstaben aus Metall. Sie wurden zu einer Seite gelegt, eingefärbt und auf Papier gepresst. Danach konnte man sie für neue Seiten nutzen.',
 'invention-rocket':'Die Rakete stößt hinten sehr schnell Gas aus. Das schiebt sie nach vorn. Lass mal einen aufgeblasenen Luftballon los: Er saust genauso davon. Das klappt sogar im Weltall.',
 'invention-satellite':'Der Satellit fällt ständig zur Erde, trifft sie aber nicht. Er fliegt so schnell zur Seite, dass er an ihr vorbeifällt. Der erste flog 1957 ins All.',
 'invention-smartphone':'Das Smartphone verwandelt deine Stimme in unsichtbare Funkwellen, wie beim Radio. Ein Funkmast in der Nähe fängt sie auf. Wenn du weit weggehst, übernimmt der nächste Mast.',
 'invention-car':'Das Auto fährt oft mit Benzin, das im Motor verbrennt. Heißes Gas braucht viel Platz und drückt ein Metallteil weg. Das Drücken dreht die Räder, wie deine Beine beim Radfahren.',
 'invention-railway':'Die Eisenbahn rollt auf harten, glatten Schienen. Darum kann eine Lok viele schwere Wagen ziehen. Schon 1825 fuhr in England eine Bahn mit Gütern und Menschen.'
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
// Tipps in Kinderton (Endfassung 25.11.2026, Paket B). Sie verraten keine Zeitform und keine Lösung (stufen-pruefer).
const hints={
 habitats:'Schau dir das Tier genau an: Hat es Flossen, Beine oder Flügel? Ist sein Zuhause eher warm oder kalt, nass oder trocken?',
 food:'Überlege: Wo und wie sucht dieses Tier sein Futter? Lies jede Antwort bis zum Ende. Manchmal frisst ein junges Tier etwas anderes als ein großes.',
 people:'Manche Menschen hier machten ähnliche Dinge. Achte auf Einzelheiten im Hinweis: einen Ort, ein Jahr oder ein Ding. Welchen Namen kannst du sicher streichen?',
 technology:'Stell dir jede Erfindung bei der Arbeit vor. Welche passt zu allem, was in der Aufgabe steht?',
 'then-now':'Denk an Dinge, die du von zu Hause oder von unterwegs kennst. Klingt die Beschreibung nach heute oder nach früher?'
};
/** @type {Record<string,string>} */
const recordHints={
 'animal-blue-whale':'Unterscheide alle heute lebenden Tiere von Tieren, die ausschließlich an Land leben.',
 'animal-african-savanna-elephant':'Hier werden nur Tiere verglichen, die an Land leben. Das größte Meerestier beantwortet diese Frage nicht.',
 'animal-cheetah':'Ein Sprint ist ein kurzer schneller Lauf. Das ist etwas anderes als große Ausdauer.',
 'animal-giraffe':'Vergleiche die Höhe vom Boden bis zum Kopf, nicht das Gewicht oder die Länge.',
 'animal-common-octopus':'Achte auf den Körperbau: Arme, Flossen und Beine sind unterschiedliche Körperteile.'
};
// Personen-Rätsel (Endfassung 25.11.2026, Abschnitte 2 und 7): Entdecker-Fallen kommen aus anderen Gebieten, nie aus
// Liste A (ausschluss.people, eine Richtung) oder Liste B (nichtAufEntdecker, beide Richtungen). Hier statt in
// world-game-runde.ts, weil Browser-Tests diese Datei in reinem Node laden.
/** @type {Record<string,string[]>} */
const GEBIETE=fallen.personen.gebiete,/** @type {Record<string,string[]>} */LISTE_A=fallen.ausschluss.people,/** @type {string[][]} */LISTE_B=fallen.personen.nichtAufEntdecker;
const PERSONEN=catalog.filter(t=>t.person),PERSON_NACH_TITEL=new Map(PERSONEN.map(t=>[t.title,t.id]));
/** @param {string} id @returns {string[]} */
export function personenEntdeckerFallen(id){
 const gebiet=GEBIETE[id]??[],nicht=LISTE_A[id]??[];
 return PERSONEN.map(t=>t.id).filter(x=>x!==id&&!nicht.includes(x)&&!(GEBIETE[x]??[]).some(g=>gebiet.includes(g))&&!LISTE_B.some(([a,b])=>(a===id&&b===x)||(a===x&&b===id)));
}
// Entdecker sieht und hört nur Satz 1, Profi alles (Abschnitt 1). Mit `antworten` (so ruft das Spiel): Satz 1 nur, wenn alle
// Fallen Entdecker-Fallen sind. Gespeicherte Runden von vor dem 25.11.2026 behalten ihre alten Fallen (manche aus demselben
// Gebiet) und zeigen darum den ganzen Hinweis, bis eine neue Runde beginnt (code-pruefer beim Einbau).
const PERSONEN_FRAGE='Wer passt zu diesem Hinweis? ';
/** @param {string} game @param {{id:string,prompt:string,answers:string[],correct:number}} item @param {string} [stufe] gespielte Stufe der Runde @param {readonly string[]} [antworten] gezeigte Antworten */
export function worldGamePrompt(game,item,stufe,antworten){
 if(game!=='people'||stufe!=='entdecker'||!item.prompt.startsWith(PERSONEN_FRAGE))return item.prompt;
 if(antworten){const erlaubt=personenEntdeckerFallen(item.id),richtig=item.answers[item.correct];if(!antworten.every(a=>a===richtig||erlaubt.includes(PERSON_NACH_TITEL.get(a)??'')))return item.prompt;}
 const hinweis=item.prompt.slice(PERSONEN_FRAGE.length);
 return PERSONEN_FRAGE+(hinweis.match(/^.*?[.!?](?=\s|$)/u)?.[0]??hinweis);
}
// Entdecker-Tipp fürs Personenspiel (Endfassung, Abschnitt 3): braucht nur einen bekannten Namen und eine Denkfrage.
// Nach einer falschen Antwort steht die Denkfrage direkt hinter der Wahl, damit „dieser Mensch“ die gewählte Person meint
// (kinder-redaktion beim Einbau, 25.11.2026). „Mensch“ statt „Person“, damit die Wahl nicht wie die gesuchte Person klingt.
const PERSONEN_TIPP_ENTDECKER='Kennst du einen der Namen? Überlege: Hat dieser Mensch so etwas gemacht?';
const PERSONEN_FALSCH_ENTDECKER='Hat dieser Mensch so etwas gemacht? Schau dir auch die anderen Namen an.';
// Auf Profi und Experte trennen die Sätze 2 und 3 die Fallen aus demselben Gebiet (Endfassung 25.11.2026, Paket B).
// Technik-Detektiv nach einer falschen Antwort, alle Stufen: prüft, ob die gewählte Erfindung zu allen Teilen der Aufgabe
// passt, statt den Tipp zu wiederholen (Nachtrag Technik-Auflösungen, stufen-pruefer und kinder-redaktion, 25.11.2026).
const TECHNIK_FALSCH='Was macht diese Erfindung genau? Passt das zu allem, was in der Aufgabe steht?';
const PERSONEN_FALSCH_PROFI='Passt jeder Satz im Hinweis zu diesem Menschen? Schau dir auch die anderen Namen an.';
// Früher oder heute? Die dritte Antwort ist bei jeder Aufgabe falsch (world-game-bank.ts). Hier statt dort, weil Browser-Tests
// diese Datei in reinem Node laden. Gespeicherte Runden von vor dem 24.11.2026 zeigen noch die alten dritten Antworten.
export const DRITTE_ANTWORT='Erst in der Zukunft';
/** @type {Record<string,string>} */
export const ALTE_DRITTE_ANTWORT={Früher:'Noch keine wirkliche Entwicklung',Heute:'Nur ein Zukunftswunsch'};
const ZUKUNFT_ANTWORTEN=[DRITTE_ANTWORT,...Object.values(ALTE_DRITTE_ANTWORT)];
const ZUKUNFT_FALSCH='Das hier gibt es schon, oder es gab es früher. War es früher so oder ist es heute so?';
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
 if(game==='people')return 'Du hast „'+answer+'“ gewählt. '+PERSONEN_FALSCH_PROFI;
 if(game==='then-now'&&ZUKUNFT_ANTWORTEN.includes(answer))return 'Du hast „'+answer+'“ gewählt. '+ZUKUNFT_FALSCH;
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
 if(game==='technology')return 'Du hast „'+answer+'“ gewählt. '+TECHNIK_FALSCH;
 return 'Du hast „'+answer+'“ gewählt. '+worldGameHint(game,item,stufe);
}
