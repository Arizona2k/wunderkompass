import PLATES from "./plate-points.json";
import type { Place } from "./earth-data";
export type MapLayer="plain"|"capitals"|"mountains"|"rivers"|"lakes"|"deserts"|"forests"|"volcanoes"|"animals"|"records"|"climate"|"vegetation"|"plates"|"orientation"|"timezones";
export const MAP_LAYERS:[MapLayer,string,string][]=[
 ["plain","Länder & Meere","Dreh die Welt und entdecke Länder, Kontinente und Meere."],
 ["capitals","Städte & Hauptstädte","Ausgewählte Hauptstädte und weitere Städte mit wichtigen Aufgaben. Die Stadtkarte erklärt den Unterschied. Manche Länder haben mehrere Hauptstädte."],
 ["orientation","Linien & Orientierung","Äquator, Wendekreise, Nullmeridian und ein Gradnetz. Diese Linien sind auf der Erde unsichtbar."],
 ["mountains","Berge & Gebirge","Tippe auf einen Namen. Die Markierung zeigt einen Ort im Gebirge, nicht seine ganze Ausdehnung."],
 ["rivers","Flüsse","Ausgewählte große Flüsse: blaue Linien zeigen ihren vereinfachten Verlauf."],
 ["lakes","Seen","Seen liegen im Land. Einige sind so groß, dass sie Meer heißen."],
 ["deserts","Wüsten","Beispiele für sehr trockene Landschaften. Auch eisige Gebiete können Wüsten sein."],
 ["forests","Regenwälder","Beispielorte in tropischen Regenwäldern. Sie liegen nicht nur in Südamerika."],
 ["volcanoes","Vulkane","Entdecke Vulkane und vergleiche sie im Forscherlabor."],
 ["animals","Tierwelten","Beispielorte natürlicher Lebensräume. Tiere leben in größeren Gebieten als einem Kartenpunkt."],
 ["records","Naturrekorde","Vom höchsten Berg über dem Meer bis in die tiefste bekannte Meeresstelle."],
 ["climate","Klimazonen","Vereinfachte Breitengrad-Gürtel: Tropen, Subtropen, gemäßigte und polare Gebiete. Höhe, Meeresströmungen und Winde verändern das echte Klima."],
 ["vegetation","Pflanzenwelten","Ausgewählte Beispiele: Regenwald, Savanne, Wüste, Wald und Tundra. Keine vollständige Vegetationskarte."],
 ["plates","Plattengrenzen","Die roten Linien zeigen das vereinfachte PB2002-Plattenmodell von Peter Bird. Platten tragen Land und Meeresboden; Grenzen sind teils breite Zonen."],
 ["timezones","Zeitzonen verstehen","Meridiane im Abstand von 15°: ein Sonnenzeit-Unterschied von etwa einer Stunde. Echte Zeitzonen folgen oft Ländergrenzen. Genaue Stadtuhren findest du im Labor."],
];
type Entry=[string,string,MapLayer,number,number,string,string];
const entries:Entry[]=[
 ["everest","Mount Everest","mountains",27.99,86.93,"Der Everest liegt im Himalaya an der Grenze von Nepal und China. Mit rund 8.849 Metern ist er der höchste Berg über dem Meeresspiegel.","Misst man vom Fuß am Meeresboden, ist Mauna Kea höher. Ein Rekord braucht also immer eine Messregel."],
 ["alps","Alpen","mountains",46.6,10.4,"Die Alpen liegen in Europa und reichen durch mehrere Länder. Auch der Süden Deutschlands gehört dazu.","Gletscher formen Täler. Der Mont Blanc ist der höchste Berg der Alpen."],
 ["himalaya","Himalaya","mountains",28.2,84.4,"Indiens Platte drückt gegen die Eurasische Platte. Über Millionen Jahre entstand das riesige Himalaya-Gebirge.","Es wächst an manchen Stellen weiter – und Wind, Wasser und Eis tragen gleichzeitig Gestein ab."],
 ["andes","Anden","mountains",-22,-68,"Die Anden verlaufen am westlichen Rand Südamerikas. Sie gehören zu den längsten Gebirgsketten an Land.","In den Anden gibt es hohe Gipfel, Vulkane und sehr verschiedene Lebensräume."],
 ["rockies","Rocky Mountains","mountains",44,-110,"Dieses große Gebirge zieht sich durch den Westen Nordamerikas.","Viele Flüsse beginnen als kleine Bäche in Gebirgen."],
 ["kilimanjaro","Kilimandscharo","mountains",-3.07,37.35,"Der Kilimandscharo liegt in Tansania. Mit ungefähr 5.895 Metern ist er Afrikas höchster Berg.","Er ist ein Vulkanmassiv. Höhe kann das Klima stark verändern, auch nahe am Äquator."],
 ["amazon","Amazonas","rivers",-3.1,-60,"Der Amazonas fließt durch Südamerika zum Atlantik. Er führt mehr Wasser als jeder andere Fluss.","Welcher Fluss der längste ist, hängt auch davon ab, welche Quelle und welchen Verlauf man misst. Nil und Amazonas werden unterschiedlich eingeordnet."],
 ["nile","Nil","rivers",26,31,"Der Nil fließt durch den Nordosten Afrikas ins Mittelmeer. Weißer Nil und Blauer Nil treffen sich im Sudan.","Am trockenen Unterlauf des Nils hilft Flusswasser Pflanzen, Tieren und Menschen."],
 ["rhine","Rhein","rivers",50.3,7.6,"Der Rhein beginnt in den Alpen und fließt unter anderem durch Deutschland zur Nordsee.","Ein Fluss überquert Ländergrenzen. Sauberes Wasser ist deshalb eine gemeinsame Aufgabe."],
 ["yangtze","Jangtse","rivers",30.7,111.1,"Der Jangtse fließt durch China zum Meer. Er ist der längste Fluss Asiens.","Flüsse transportieren Wasser, Sand und gelöste Stoffe."],
 ["mississippi","Mississippi","rivers",34,-91,"Der Mississippi fließt durch die USA nach Süden in den Golf von Mexiko.","Sein riesiges Einzugsgebiet wird auch von vielen Nebenflüssen mit Wasser versorgt."],
 ["victoria","Victoriasee","lakes",-1,33,"Dieser große Süßwassersee liegt in Ostafrika. Uganda, Kenia und Tansania teilen seine Ufer.","Ein See kann zu mehreren Ländern gehören."],
 ["baikal","Baikalsee","lakes",53.6,108.1,"Der Baikalsee liegt in Russland in Asien. Er ist der tiefste See der Erde: ungefähr 1.642 Meter.","Hier lebt die Baikalrobbe, eine Robbe im Süßwasser."],
 ["caspian","Kaspisches Meer","lakes",42,51,"Trotz seines Namens ist das Kaspische Meer ein riesiger See ohne natürliche Verbindung zum Weltmeer.","Es ist das größte eingeschlossene Binnengewässer. Sein Wasser ist salzhaltig."],
 ["sahara","Sahara","deserts",24,12,"Die Sahara liegt in Nordafrika. Sie ist die größte heiße Wüste der Erde.","Nicht die ganze Sahara besteht aus Sanddünen. Es gibt auch Fels, Kies und Gebirge."],
 ["antarctic-desert","Antarktische Wüste","deserts",-78,30,"Das Innere der Antarktis erhält sehr wenig Niederschlag. Deshalb sind große Teile eine Kältewüste, obwohl über lange Zeit viel Eis zusammengekommen ist. An den Küsten kann deutlich mehr Schnee fallen.","Eine Wüste wird durch Trockenheit bestimmt, nicht durch Hitze. Antarktika ist die größte Wüste insgesamt."],
 ["atacama","Atacama","deserts",-24,-69,"Die Atacama liegt im Westen Südamerikas, vor allem in Chile. Viele Teile sind extrem trocken.","Kalte Meeresströmung und Gebirge tragen zur Trockenheit bei."],
 ["gobi","Gobi","deserts",43,105,"Die Gobi liegt in der Mongolei und in China. Im Winter kann es dort sehr kalt werden.","Wüsten haben sehr verschiedene Temperaturen."],
 ["amazon-forest","Amazonas-Regenwald","forests",-3,-63,"In Südamerika liegt der größte tropische Regenwald. Brasilien und mehrere Nachbarländer teilen diese Region.","Viele verschiedene Arten leben hier. Der Regenwald ist mehr als eine Ansammlung von Bäumen."],
 ["congo-forest","Kongo-Regenwald","forests",0,23,"Rund um das Kongobecken in Afrika wächst ein riesiger tropischer Regenwald.","Wälder speichern Kohlenstoff und bieten Tieren und Pflanzen Lebensräume."],
 ["borneo","Regenwald auf Borneo","forests",1,114,"Borneo ist eine Insel in Südostasien. In ihren Regenwäldern leben unter anderem Orang-Utans.","Borneo gehört zu Indonesien, Malaysia und Brunei."],
 ["etna","Ätna","volcanoes",37.75,15,"Der Ätna liegt auf Sizilien in Italien. Er gehört zu Europas aktiven Vulkanen.","Bei einem Vulkan können Lava, Gase und Asche an die Oberfläche gelangen."],
 ["fuji","Fuji","volcanoes",35.36,138.73,"Der Fuji ist Japans höchster Berg und ein Vulkan. Sein letzter bestätigter Ausbruch begann 1707.","Ein ruhiger Vulkan kann trotzdem noch aktiv sein. Aktiv bedeutet nicht: Er bricht gerade aus."],
 ["kilauea","Kīlauea","volcanoes",19.42,-155.29,"Dieser Vulkan liegt auf Hawaii im Pazifik. Hawaii entstand über einem heißen Bereich des Mantels, einem Hotspot.","Nicht jeder Vulkan liegt an einer Plattengrenze."],
 ["vesuvius","Vesuv","volcanoes",40.82,14.43,"Der Vesuv liegt nahe Neapel in Italien. Sein Ausbruch im Jahr 79 verschüttete unter anderem Pompeji.","Forschende beobachten aktive Vulkane. Das Lernmodell ist keine Vorhersage."],
 ["iceland","Island","volcanoes",64.5,-18.5,"Auf Island treffen der Mittelatlantische Rücken und ein Hotspot zusammen. Dort gibt es viele Vulkane.","Am Rücken bewegen sich Platten auseinander. Neues Gestein kann entstehen."],
 ["polar-bear","Eisbär","animals",75,-100,"Eisbären leben in der Arktis. Sie jagen vor allem Robben und sind auf Meereis angewiesen.","Hier siehst du einen Beispielort im kanadischen Norden. Eisbären leben auch in anderen arktischen Regionen."],
 ["penguin","Kaiserpinguin","animals",-72,20,"Kaiserpinguine leben in der Antarktis und brüten auf Meereis.","Eisbären und wilde Kaiserpinguine begegnen sich nicht: Ihre Lebensräume liegen an verschiedenen Polen."],
 ["giraffe","Giraffe","animals",-2,35,"Giraffen leben in afrikanischen Savannen und offenen Waldlandschaften. Ihr langer Hals hilft beim Erreichen von Blättern.","Dieser Beispielort liegt in Ostafrika. Eine Tierart lebt nicht nur auf einem einzelnen Kartenpunkt."],
 ["sloth","Faultier","animals",-3,-62,"Faultiere leben in Bäumen tropischer Wälder in Mittel- und Südamerika.","Langsame Bewegung spart Energie. Manche Arten hängen mit dem Rücken nach unten."],
 ["panda","Großer Panda","animals",30.8,103,"Große Pandas leben ursprünglich in Bergwäldern Chinas. Ihre Hauptnahrung ist Bambus.","Eine Landschaft kann gleichzeitig Wald und Gebirge sein."],
 ["kangaroo","Känguru","animals",-26,134,"In Australien leben verschiedene Känguruarten. Mit kräftigen Hinterbeinen bewegen sie sich hüpfend fort.","Kängurus sind Beuteltiere. Ihre Jungen entwickeln sich anfangs im Beutel."],
 ["reef","Great Barrier Reef","records",-18,147,"Vor der Nordostküste Australiens liegt das größte Korallenriffsystem der Welt.","Korallen sind Tiere. Viele riffbildende Korallen leben mit winzigen Algen zusammen."],
 ["mariana","Marianengraben","records",11.35,142.2,"Im Pazifik liegt der tiefste bekannte Bereich des Ozeans: Challenger Deep, ungefähr 11 Kilometer tief.","Der genaue Tiefenwert hängt von der Messung ab. Hier herrscht viel höherer Druck als an der Oberfläche."],
 ["tundra","Tundra","vegetation",69,25,"Weit im Norden ist der Sommer kurz. In der Tundra wachsen etwa Moose, Flechten und niedrige Sträucher.","Nicht jede Landschaft hat genug Wärme für hohe Bäume."],
 ["temperate-forest","Wald in Europa","vegetation",51,10,"In vielen gemäßigten Gebieten wachsen Laub- und Mischwälder. In Deutschland verlieren viele Laubbäume im Herbst ihre Blätter.","Der genaue Waldtyp hängt auch von Boden, Wasser und menschlicher Nutzung ab."],
 ["russia-size","Russland: größtes Land","records",60,100,"Russland ist nach Fläche das größte Land der Erde. Es erstreckt sich über Europa und Asien.","Die Fläche eines Landes und seine Bevölkerung sind unterschiedliche Vergleiche."],
 ["vatican-size","Vatikanstadt: kleinstes Land","records",41.902,12.453,"Vatikanstadt liegt innerhalb der Stadt Rom. Mit weniger als einem Quadratkilometer ist sie der kleinste unabhängige Staat nach Fläche.","Auf der Weltkarte ist dieses Land zu klein für viele Kartenmaßstäbe. Unsere Markierung zeigt seine Lage."],
 ["vostok","Kälte-Rekord: Wostok","records",-78.47,106.8,"An der Station Wostok in Antarktika wurden am 21. Juli 1983 −89,2 °C Lufttemperatur gemessen. Die WMO führt den Wert in ihrer Rekordtabelle mit Stand 31. Juli 2025.","Satelliten können noch niedrigere Oberflächentemperaturen erfassen. Das ist eine andere Messart als Lufttemperatur."],
 ["furnace-creek","Hitze-Rekord: Death Valley","records",36.46,-116.86,"Die WMO-Tabelle mit Stand 31. Juli 2025 führt 56,7 °C am 10. Juli 1913 bei Furnace Creek als höchsten anerkannten Lufttemperaturwert.","Ein einzelner Rekord ist kein typischer Sommertag. Messmethode, Ort und Zeitpunkt gehören dazu."],

];
export const PLATE_POINTS=PLATES as (Place & {category:MapLayer})[];
export const NATURE: (Place & {category:MapLayer})[]=entries.map(([id,name,category,lat,lon,text,fact])=>({id,name,kind:"nature",category,lat,lon,text,fact}));
export function layerPlaces(layer:MapLayer){if(layer==="plates")return PLATE_POINTS; if(layer==="records")return NATURE.filter(p=>["everest","mariana","sahara","antarctic-desert","amazon-forest","amazon","baikal","reef","russia-size","vatican-size","vostok","furnace-creek"].includes(p.id));if(layer==="vegetation")return NATURE.filter(p=>["tundra","temperate-forest","amazon-forest","sahara","giraffe"].includes(p.id));return NATURE.filter(p=>p.category===layer);}
export const CLIMATE_ZONES=[{name:"Tropen",color:"#d6aa53",text:"Rund um den Äquator: viel Sonnenenergie im ganzen Jahr. Regenwald und Savanne sind unterschiedliche tropische Lebensräume."},{name:"Subtropen",color:"#e3cc8b",text:"Zwischen Tropen und gemäßigten Gebieten: oft heiße Sommer. Hier liegen viele heiße Wüsten, aber auch feuchte Landschaften."},{name:"Gemäßigte Zone",color:"#82bd9a",text:"Mittlere Breiten: die Jahreszeiten unterscheiden sich deutlich. Deutschland liegt in dieser Zone."},{name:"Polarzone",color:"#c7e7ec",text:"Nahe den Polen: niedriger Sonnenstand und lange kalte Zeiten. Im Sommer kann die Sonne sehr lange über dem Horizont bleiben."}];
export const CONTINENT_WORLDS:Record<string,{animal:string;landscape:string;river:string;challenge:string}>={
 Europe:{animal:"Rotfuchs in Wald und Stadt",landscape:"Alpen, Küsten und Wälder",river:"Rhein und Donau",challenge:"Finde drei Nachbarländer Deutschlands."},
 Africa:{animal:"Giraffe in der Savanne",landscape:"Sahara, Savannen und Kongo-Regenwald",river:"Nil und Kongo",challenge:"Finde den Äquator und die Sahara. Liegen sie am gleichen Ort?"},
 Asia:{animal:"Panda im Bergwald",landscape:"Himalaya, Gobi und Regenwälder",river:"Jangtse und Ganges",challenge:"Finde den Everest und den Inselstaat Japan."},
 "North America":{animal:"Bison in Graslandschaften",landscape:"Rocky Mountains, Wälder und Arktis",river:"Mississippi und Mackenzie",challenge:"Finde Kanada, die USA und Mexiko."},
 "South America":{animal:"Faultier im Regenwald",landscape:"Anden, Amazonas-Regenwald und Atacama",river:"Amazonas und Orinoco",challenge:"Vergleiche die trockene Atacama mit dem Amazonaswald."},
 Oceania:{animal:"Känguru in Australien",landscape:"Wüsten, Inseln und Korallenriffe",river:"Murray in Australien",challenge:"Finde Australien, Neuseeland und das Great Barrier Reef."},
 Antarctica:{animal:"Kaiserpinguin am Meereis",landscape:"Eiswüste und hohe Gebirge",river:"Keine großen Flüsse wie der Rhein; kurze Schmelzwasserflüsse im Sommer",challenge:"Vergleiche Nordpol und Südpol: Wo liegt Land unter dem Eis?"}
};
