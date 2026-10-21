import {chapterPath} from './journey-routing.mjs';
// One relevant destination per legacy chapter; reciprocal topic links use the
// same map rather than an independently maintained second knowledge network.
export const CHAPTER_LINKS:Record<string,string[]>={
 planet:['world/topic/science-solar-system','world/topic/science-water-cycle','world/topic/science-atmosphere','world/topic/science-tides','world/topic/science-seasons'],
 inside:['layers','world/topic/science-magnetism','labs/plates','labs/plates','labs/volcano'],
 water:['labs/water','world/topic/science-water-cycle','world/topic/science-water-cycle','world/topic/science-water-cycle','world/topic/science-water-cycle'],
 weather:['labs/weather','labs/weather','labs/weather','world/topic/science-atmosphere','world/topic/invention-satellite'],
 seasons:['labs/seasons','world/topic/science-seasons','world/topic/science-seasons','labs/seasons','day'],
 ocean:['globe','world/topic/science-water-cycle','world/topic/science-coral-reef','book/words/Ozean','world/topic/science-currents'],
 nature:['world/topic/animal-jaguar','world/topic/animal-giraffe','world/topic/animal-dromedary','world/topic/animal-polar-bear','world/topic/science-foodweb'],
 protect:['world/topic/science-atmosphere','world/topic/science-energy','book/words/Recycling','world/topic/science-pollination','world/topic/person-wangari_maathai'],
 continents:['globe','book/words/Kontinent','globe','world/topic/animal-emperor-penguin','world/topic/science-shadows'],
 countries:['globe','globe','globe','globe','globe'],
 volcanoes:['labs/volcano','labs/volcano','labs/volcano','labs/plates','labs/volcano'],
 quakes:['labs/quake','labs/quake','layers','labs/quake','book/words/Tsunami'],
 moon:['world/topic/science-moon-phases','labs/moon','labs/moon','world/topic/invention-rocket','world/topic/history-apollo11'],
 navigation:['globe','world/topic/science-gps','world/topic/invention-compass','world/topic/science-seasons','labs/time'],
 landscapes:['labs/plates','world/topic/science-water-cycle','globe','world/topic/animal-dromedary','world/topic/science-water-cycle'],
 climate:['world/topic/science-atmosphere','world/topic/science-seasons','world/topic/animal-giraffe','world/topic/science-photosynthesis','world/topic/science-foodweb']
};
export function chapterLinksForTopic(topicId:string){return Object.entries(CHAPTER_LINKS).flatMap(([id,links])=>links.flatMap((link,index)=>link==='world/topic/'+topicId?[{id,index,path:chapterPath(id,index)}]:[]));}
const DESTINATIONS:Record<string,[string,string]>={
 'science-solar-system':['Die Erde im Sonnensystem','Vergleiche die Erde mit anderen Planeten und untersuche ihre Umlaufbahnen.'],
 'science-water-cycle':['Der Wasserkreislauf','Verfolge, wie Wasser seinen Zustand und seinen Aufenthaltsort verändert.'],
 'science-atmosphere':['Unsere Atmosphäre','Erkläre, wie die Lufthülle Wetter und Temperatur beeinflusst.'],
 'science-tides':['Ebbe und Flut','Vergleiche die Anziehung von Mond und Sonne und unterscheide Gezeiten von einzelnen Wellen.'],
 'science-seasons':['Warum Jahreszeiten entstehen','Prüfe die Rolle der geneigten Erdachse statt der Entfernung zur Sonne.'],
 'science-magnetism':['Das Magnetfeld der Erde','Unterscheide das Erdinnere vom Magnetfeld und seinem Einfluss auf einen Kompass.'],
 'invention-satellite':['Satelliten','Untersuche, wie Beobachtungen aus dem All beim Wetterwissen helfen.'],
 'science-coral-reef':['Korallenriffe','Lerne Korallen als Tiere und ihre Lebensbedingungen kennen.'],
 'science-currents':['Meeresströmungen','Verfolge, wie bewegtes Meerwasser Wärme zwischen Regionen transportiert.'],
 'animal-jaguar':['Jaguare im Regenwald','Vergleiche Merkmale des Jaguars mit den Bedingungen seines Lebensraums.'],
 'animal-giraffe':['Giraffen in der Savanne','Untersuche, wie Nahrung und Körperbau in einem Lebensraum zusammenhängen.'],
 'animal-dromedary':['Dromedare in trockenen Gebieten','Prüfe Anpassungen an Trockenheit und räume mit dem Wasser-im-Höcker-Irrtum auf.'],
 'animal-polar-bear':['Eisbären in der Arktis','Verbinde Kälte, Meereis und die Lebensweise eines Tieres.'],
 'science-foodweb':['Nahrungsnetze','Untersuche, warum eine Veränderung mehrere Lebewesen betreffen kann.'],
 'science-energy':['Energie verstehen','Vergleiche Energiequellen und ihre Auswirkungen, bevor du eine Lösung auswählst.'],
 'science-pollination':['Bestäubung','Verfolge die Verbindung zwischen Blüten, Bestäubern und neuen Samen.'],
 'person-wangari_maathai':['Wangari Maathai','Entdecke ein konkretes Beispiel dafür, wie gemeinsames Handeln Natur schützen kann.'],
 'animal-emperor-penguin':['Kaiserpinguine in der Antarktis','Unterscheide den südlichen Lebensraum der Pinguine von der Arktis.'],
 'science-shadows':['Schatten und Sonnenstand','Vergleiche Schattenlängen als Hinweis auf die Richtung des Sonnenlichts.'],
 'science-moon-phases':['Mondphasen','Unterscheide beleuchtete Mondhälfte und den Teil, den wir von der Erde sehen.'],
 'invention-rocket':['Raketen','Untersuche den Rückstoß und die Aufgabe einer Rakete bei Raumflügen.'],
 'history-apollo11':['Apollo 11','Ordne die erste bemannte Mondlandung in eine belegte historische Geschichte ein.'],
 'science-gps':['GPS','Vergleiche Satellitenortung mit der Orientierung allein nach Himmelsrichtungen.'],
 'invention-compass':['Der Kompass','Untersuche seine magnetische Richtung und warum eine Karte zusätzlich hilft.'],
 'science-photosynthesis':['Fotosynthese','Verbinde Licht, Wasser und Kohlenstoffdioxid mit dem Wachstum von Pflanzen.']
};
const TOOLS:Record<string,[string,string]>={
 globe:['Auf dem Globus vergleichen','Suche die Orte aus dem Kapitel und vergleiche ihre Lage auf der Erde.'],
 layers:['Die Erdschichten erkunden','Vergleiche Lage, Material und Eigenschaften der Erdschichten.'],
 day:['Tag und Nacht ausprobieren','Drehe die Erde und unterscheide ihre tägliche Rotation vom Umlauf um die Sonne.'],
 water:['Wasserformen im Modell','Ändere die Temperatur und beobachte Übergänge zwischen fest, flüssig und gasförmig.'],
 plates:['Plattenbewegungen untersuchen','Vergleiche Zusammenstoßen, Auseinanderdriften und seitliches Vorbeigleiten.'],
 volcano:['Vulkanbedingungen vergleichen','Verändere Bedingungen im vereinfachten Modell, ohne reale Ausbrüche vorherzusagen.'],
 quake:['Erdbeben im Modell','Vergleiche Entfernung und Stärke und beachte die Grenzen des Modells.'],
 weather:['Wetterbedingungen vergleichen','Ändere einzelne Bedingungen und vergleiche ihre Auswirkungen im Lernmodell.'],
 wind:['Wind untersuchen','Vergleiche Druckunterschiede und die daraus entstehende Luftbewegung.'],
 seasons:['Die Erdachse ausprobieren','Vergleiche geneigte und nicht geneigte Erdachse und die beiden Halbkugeln.'],
 moon:['Mond und Beleuchtung vergleichen','Ändere die Position und untersuche, welcher beleuchtete Teil sichtbar ist.'],
 time:['Zeitzonen erkunden','Vergleiche Ortszeiten und unterscheide Zeitzonengrenzen von Längengraden.']
};
export function chapterDestination(path:string){const parts=path.split('/');const pair=parts[0]==='world'?DESTINATIONS[parts[2]]:parts[0]==='book'?[parts[2]+' nachschlagen','Kläre die Bedeutung von „'+parts[2]+'“, bevor du das Kapitel erklärst.']:TOOLS[parts.at(-1)!];if(!pair)throw Error('Unknown journey destination '+path);return {title:pair[0],why:pair[1]};}
