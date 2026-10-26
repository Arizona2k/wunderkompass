import journeyIndex from "./journey-index.json" with {type:"json"};
import { MORE_WORDS, MORE_WHY } from "./expanded-learning-data";
import type { QuizQuestion } from "./earth-data";

export type JourneyStep = { title: string; text: string; fact?: string; starter?:string; deeper?:string; whyItMatters?:string; observe?:string; sourceIds?:string[]; tryIt?: string };
export type Journey = { id: string; title: string; intro: string; icon: string; color: string; minutes: number; photo?: string; steps: JourneyStep[]; question: QuizQuestion; activity: string; lab?: "water" | "seasons" | "plates"; source: string; sourceName: string };

const BASE_GLOSSARY = [
  ["Äquator","Weltkugel","Gedachte Linie um die Mitte der Erde. Ihr Breitengrad ist 0°. Sie trennt Nord- und Südhalbkugel."],
  ["Atmosphäre","Wetter","Die Gashülle um die Erde. Ihr unterster Teil enthält die Luft, in der wir leben und in der das meiste Wetter entsteht."],
  ["Breitengrad","Weltkugel","Beschreibt, wie weit ein Ort nördlich oder südlich vom Äquator liegt. Der Äquator hat 0°, die Pole 90°."],
  ["Ebbe und Flut","Meere","Das regelmäßige Sinken und Steigen des Meeresspiegels. Vor allem der Mond und auch die Sonne verursachen die Gezeiten."],
  ["Erdachse","Weltkugel","Gedachte Linie durch Nordpol, Erdmitte und Südpol. Um sie dreht sich die Erde."],
  ["Erdkern","Erdinneres","Die innersten Teile der Erde. Der äußere Kern ist flüssig, der innere fest. Beide bestehen vor allem aus Metall."],
  ["Erdkruste","Erdinneres","Die dünne, feste Außenhaut der Erde. Sie liegt auch unter den Ozeanen."],
  ["Erdmantel","Erdinneres","Die mächtige Schicht zwischen Kruste und Kern. Das heiße Gestein ist überwiegend fest und verformt sich sehr langsam."],
  ["Erdbeben","Erdinneres","Eine Erschütterung des Bodens. Häufig entstehen Erdbeben, wenn Gestein an einer Bruchfläche plötzlich verrutscht."],
  ["Erosion","Natur","Gestein und Boden werden von Wasser, Wind oder Eis abgetragen. So verändern sich Landschaften."],
  ["Gletscher","Wasser","Eine große Eismasse an Land, die sich langsam bewegt. Sie entsteht aus Schnee, der sich über viele Jahre sammelt."],
  ["Grundwasser","Wasser","Wasser unter der Erdoberfläche in einer gesättigten Zone: Dort sind die Hohlräume mit Wasser gefüllt."],
  ["Halbinsel","Weltkugel","Ein Stück Land, das weit ins Wasser ragt und auf einer Seite mit einer größeren Landfläche verbunden bleibt."],
  ["Halbkugel","Weltkugel","Eine Hälfte der Erde. Der Äquator trennt die Nordhalbkugel von der Südhalbkugel."],
  ["Hauptstadt","Weltkugel","Eine Stadt, in der wichtige Aufgaben der Regierung eines Landes liegen. Sie muss nicht die größte Stadt sein."],
  ["Insel","Weltkugel","Eine Landfläche, die ringsum von Wasser umgeben ist. Japan ist ein Land mit vielen Inseln."],
  ["Jahreszeiten","Wetter","Der Wechsel von Frühling, Sommer, Herbst und Winter in vielen Gegenden. Er hängt mit der geneigten Erdachse zusammen."],
  ["Klima","Wetter","Typische Wetterbedingungen einer Gegend über viele Jahre. Ein einzelner warmer oder kalter Tag ist Wetter."],
  ["Kondensation","Wasser","Wasserdampf wird zu flüssigen Tröpfchen. Das kann passieren, wenn feuchte Luft abkühlt."],
  ["Kontinent","Weltkugel","Eine sehr große Landfläche. Unser Lernmodell unterscheidet sieben Kontinente; andere Einteilungen sind möglich."],
  ["Korallen","Meere","Kleine Meerestiere. Manche bauen feste Kalkskelette und bilden gemeinsam große Korallenriffe."],
  ["Längengrad","Weltkugel","Beschreibt, wie weit ein Ort östlich oder westlich vom Nullmeridian liegt. Alle Längengrade treffen sich an den Polen."],
  ["Lava","Erdinneres","Geschmolzenes Gestein an der Erdoberfläche. Unter der Erdoberfläche nennt man es Magma."],
  ["Lebensraum","Natur","Ein Ort, der einem Lebewesen Nahrung, Wasser und passende Bedingungen bietet. Ein Teich und ein Wald sind Beispiele."],
  ["Magma","Erdinneres","Geschmolzenes Gestein unter der Erdoberfläche. Der gesamte Erdmantel besteht trotzdem nicht aus flüssigem Magma."],
  ["Meeresspiegel","Meere","Die Höhe der Meeresoberfläche. Weil Wellen und Gezeiten sie verändern, verwendet man für Höhen einen mittleren Bezug."],
  ["Nahrungsnetz","Natur","Die Verbindungen zwischen Lebewesen, die einander fressen oder als Nahrung dienen. Viele Nahrungsketten hängen zusammen."],
  ["Niederschlag","Wetter","Wasser, das aus der Atmosphäre auf die Erde fällt. Dazu gehören Regen, Schnee und Hagel."],
  ["Nordpol","Weltkugel","Das nördliche Ende der Erdachse. Er liegt über dem Arktischen Ozean."],
  ["Ozean","Meere","Ein sehr großes Meer. Die fünf benannten Ozeane sind zu einem Weltmeer verbunden."],
  ["Plankton","Meere","Lebewesen, die mit Strömungen treiben. Es gibt pflanzliches und tierisches Plankton, von sehr klein bis recht groß."],
  ["Plattentektonik","Erdinneres","Die Bewegung der großen festen Platten an der Außenseite der Erde. Sie verändert die Erde über lange Zeit."],
  ["Recycling","Natur","Abfälle werden zu Material für neue Dinge aufbereitet. Noch besser ist oft, etwas lange zu nutzen und Abfall zu vermeiden."],
  ["Savanne","Natur","Eine Landschaft mit vielen Gräsern und einzelnen Bäumen. Häufig wechseln dort Regen- und Trockenzeiten."],
  ["Schwerkraft","Weltkugel","Die Anziehung zwischen Dingen mit Masse. Die Erde zieht uns und andere Dinge zu ihrer Mitte."],
  ["Südpol","Weltkugel","Das südliche Ende der Erdachse. Er liegt auf dem Kontinent Antarktika."],
  ["Süßwasser","Wasser","Wasser mit wenig gelöstem Salz. Es ist nicht süß im Geschmack. Viel Süßwasser steckt in Eis oder unter der Erde."],
  ["Treibhauseffekt","Wetter","Bestimmte Gase halten einen Teil der von der Erde abgegebenen Wärme zurück. Zusätzliche Treibhausgase verstärken die Erwärmung."],
  ["Verdunstung","Wasser","Flüssiges Wasser wird zu unsichtbarem Wasserdampf und gelangt in die Luft. Das geht auch ohne Kochen."],
  ["Vulkan","Erdinneres","Eine Stelle, an der Magma, Gase und manchmal Asche aus dem Erdinneren austreten können."],
  ["Wasserkreislauf","Wasser","Die Bewegung des Wassers zwischen Meer, Luft, Land, Boden und Eis. Es gibt viele Wege und keinen festen Anfang."],
  ["Wetter","Wetter","Was die Luft gerade macht: Temperatur, Wind, Wolken und Niederschlag an einem Ort zu einer bestimmten Zeit."],
  ["Wüste","Natur","Eine Gegend mit sehr wenig Niederschlag. Wüsten können heiß oder kalt sein."],
  ["Zeitzone","Weltkugel","Eine Region, die dieselbe Uhrzeit verwendet. Weil die Erde sich dreht, ist nicht überall gleichzeitig Mittag."],
] as const;

const BASE_WHY_QUESTIONS = [
  ["Warum merken wir die Erddrehung nicht?","Die Erde, die Luft und wir bewegen uns zusammen. Gleichmäßige Bewegung merkt man kaum – ähnlich wie in einem ruhig fahrenden Zug. Die Drehung hat aber messbare Wirkungen, etwa auf große Windbewegungen."],
  ["Warum ist der Himmel blau?","Luft streut das Sonnenlicht. Kurzwelliges blaues Licht wird stärker in viele Richtungen gestreut als rotes Licht. Dadurch erreicht uns von vielen Stellen des Himmels blaues Licht."],
  ["Warum ist ein Sonnenuntergang oft rot?","Wenn die Sonne tief steht, legt ihr Licht einen längeren Weg durch die Luft zurück. Viel blaues Licht wird unterwegs gestreut. In direkter Richtung von der Sonne bleibt mehr rotes und orangefarbenes Licht übrig."],
  ["Warum ist Meerwasser nicht zum Trinken geeignet?","Es enthält zu viel Salz. Unser Körper braucht zusätzliches Wasser, um viel Salz auszuscheiden. Meerwasser zu trinken kann uns deshalb noch mehr austrocknen. Wir trinken sauberes Trinkwasser."],
  ["Ist jeder Berg ein Vulkan?","Nein. Viele Berge entstehen, wenn die Erdkruste zusammengeschoben und gehoben wird. Ein Vulkan entsteht dort, wo Magma die Oberfläche erreicht. Manche Vulkane sehen wie Berge aus, andere sind flacher."],
  ["Warum haben Länder Grenzen?","Menschen haben Grenzen vereinbart oder im Lauf ihrer Geschichte verändert. Sie zeigen, wo Länder und Gebiete liegen. In der Natur sieht man solche Linien meistens nicht so wie auf einer Karte."],
  ["Warum passt eine runde Erde nicht genau auf eine flache Karte?","Eine Kugeloberfläche lässt sich nicht ohne Verzerrungen flach ausbreiten. Auf Weltkarten werden deshalb Formen, Flächen oder Entfernungen verändert. Der Globus zeigt die Lage auf einer Kugel anschaulicher."],
  ["Ist Eis am Nordpol dasselbe wie Eis am Südpol?","Am Nordpol schwimmt Meereis auf dem Arktischen Ozean. Am Südpol liegt eine sehr dicke Eisschicht auf dem Kontinent Antarktika. Rund um Antarktika gibt es ebenfalls Meereis."],
  ["Können wir bis zum Mittelpunkt graben?","Nein. Schon in der Erdkruste steigen Temperatur und Druck stark an. Die tiefsten Bohrungen reichen nur einen winzigen Teil der Strecke bis zum Mittelpunkt. Mit Erdbebenwellen lernen Forschende trotzdem viel über das Innere."],
  ["Warum können Wolken schweben?","Ihre Wassertröpfchen sind winzig. Sie fallen sehr langsam, und bewegte Luft kann sie tragen. Werden Tröpfchen größer und schwerer, können sie als Regen fallen."],
] as const;

export const JOURNEYS=journeyIndex as Journey[];
export const GLOSSARY=[...new Map([...BASE_GLOSSARY,...MORE_WORDS].map(w=>[w[0],w])).values()].sort((a,b)=>a[0].localeCompare(b[0],"de"));
export const WHY_QUESTIONS=[...BASE_WHY_QUESTIONS,...MORE_WHY];
export const BADGES=[
 {id:"traveler",name:"Weltenbummler",text:"Entdecke 12 verschiedene Orte.",icon:"globe"},
 {id:"core",name:"Kernforscher",text:"Besuche alle 4 Erdschichten.",icon:"layers"},
 {id:"reader",name:"Wissenssammler",text:"Schließe 4 Lernreisen ab.",icon:"book"},
 {id:"explorer",name:"Wissensmeister",text:"Schließe alle 16 Lernreisen ab.",icon:"compass"},
 {id:"player",name:"Spieleforscher",text:"Löse 6 verschiedene Spiele.",icon:"game"},
 {id:"quiz",name:"Quizstern",text:"Beende eine Quizrunde.",icon:"star"},
 {id:"map",name:"Kartenprofi",text:"Löse die 12 Suchmissionen selbst.",icon:"compass"},
 {id:"volcano",name:"Vulkanforscher",text:"Löse die Vulkan-Lernreise und das Vulkanlabor.",icon:"layers"},
 {id:"ocean",name:"Meeresexperte",text:"Löse die Meeres-Lernreise und das Gezeitenlabor.",icon:"waves"},
 {id:"nature",name:"Tierforscher",text:"Löse die Lebensraum-Lernreise und ein Tierspiel.",icon:"leaf"},
 {id:"weather",name:"Wetterdetektiv",text:"Löse die Wetter-Lernreise und das Wetterlabor.",icon:"cloud"},
 {id:"super",name:"Super-Entdecker",text:"Schließe die Abenteuer-Weltreise und 5 Labore ab.",icon:"star"},
];
