import measurementWords from "./book-measurement-word-index.json" with {type:"json"};
const MEASUREMENT_WORDS=measurementWords as [string,string,string][];
import heatIndex from "./book-heat-index.json" with {type:"json"};
import lightIndex from "./book-light-index.json" with {type:"json"};
import waterIndex from "./book-water-index.json" with {type:"json"};
import particleIndex from "./book-particle-index.json" with {type:"json"};
import mechanicsIndex from "./book-mechanics-index.json" with {type:"json"};
import cellIndex from "./book-cell-index.json" with {type:"json"};
import geneIndex from "./book-gene-index.json" with {type:"json"};
const GENE_WORDS=geneIndex.words as [string,string,string][];
const GENE_WHY=geneIndex.why as [string,string][];
const CELL_WORDS=cellIndex.words as [string,string,string][];
const CELL_WHY=cellIndex.why as [string,string][];
const MECHANICS_WORDS=mechanicsIndex.words as [string,string,string][];
const MECHANICS_WHY=mechanicsIndex.why as [string,string][];
const PARTICLE_WORDS=particleIndex.words as [string,string,string][];
const WATER_WORDS=waterIndex.words as [string,string,string][];
const WATER_WHY=waterIndex.why as [string,string][];
const LIGHT_WORDS=lightIndex.words as [string,string,string][];
const LIGHT_WHY=lightIndex.why as [string,string][];
const HEAT_WORDS=heatIndex.words as [string,string,string][];
const HEAT_WHY=heatIndex.why as [string,string][];

export const MORE_WORDS:[string,string,string][]=[
 ["Epizentrum","Erdinneres","Der Punkt an der Erdoberfläche direkt über dem Erdbebenherd."],["Erdbebenherd","Erdinneres","Der Ort im Gestein, an dem die plötzliche Bewegung eines Erdbebens beginnt."],["Seismometer","Erdinneres","Ein Messgerät, das Bodenbewegungen aufzeichnet."],["Magnitude","Erdinneres","Ein Maß für die Größe eines Erdbebens. Sie ist etwas anderes als die Wirkung an einem bestimmten Ort."],["Subduktion","Erdinneres","An einer Plattengrenze taucht eine Platte unter eine andere in den Mantel ab."],["Hotspot","Erdinneres","Ein heißer Bereich im Mantel, über dem Vulkane entstehen können, auch mitten auf einer Platte."],["Krater","Erdinneres","Eine Vertiefung, etwa an einem Vulkan oder durch einen Einschlag."],["Magmakammer","Erdinneres","Ein Bereich, in dem sich Magma sammelt; häufig ein kompliziertes Netzwerk."],["Schlot","Erdinneres","Ein Weg, durch den Magma und Gase zur Oberfläche gelangen können."],["Schildvulkan","Erdinneres","Ein meist breiter, flacher Vulkan, der oft aus vielen dünnflüssigen Lavaflüssen aufgebaut ist."],["Vulkanasche","Erdinneres","Winzige Gesteins-, Mineral- und Glasstücke aus einem Vulkan, keine Asche von verbranntem Holz."],["Tsunami","Meere","Eine Reihe langer Wasserwellen, die etwa durch plötzliche Bewegung des Meeresbodens entstehen kann."],["Nullmeridian","Weltkugel","Die vereinbarte Linie für 0° geografische Länge durch Greenwich in London."],["Wendekreis","Weltkugel","Eine Linie bei ungefähr 23,4° nördlicher oder südlicher Breite. Zwischen beiden kann die Sonne mittags im Zenit stehen."],["Breitengrad","Weltkugel","Ein Winkel, der zeigt, wie weit nördlich oder südlich vom Äquator ein Ort liegt."],["Längengrad","Weltkugel","Ein Winkel, der die Lage östlich oder westlich des Nullmeridians beschreibt."],["Zeitzone","Weltkugel","Ein Gebiet, in dem dieselbe vereinbarte Uhrzeit gilt. Grenzen folgen häufig Ländern statt geraden Linien."],["Hauptstadt","Weltkugel","Eine Stadt mit wichtigen Aufgaben für ein Land. Manche Länder haben mehrere Hauptstädte."],["Halbinsel","Wasser","Land, das auf vielen Seiten von Wasser umgeben ist, aber noch mit größerem Land zusammenhängt."],["Bucht","Meere","Ein Teil eines Meeres oder Sees, der weit ins Land hineinragt."],["Meerenge","Meere","Eine schmale Wasserverbindung zwischen größeren Meeresgebieten."],["Delta","Wasser","Eine Landschaft aus abgelagertem Material an manchen Flussmündungen. Der Fluss kann sich in mehrere Arme teilen."],["Einzugsgebiet","Wasser","Die Fläche, aus der Wasser zu einem bestimmten Fluss oder See abfließt."],["Grundwasser","Wasser","Wasser unter der Erdoberfläche in einer gesättigten Zone: Dort sind die Hohlräume mit Wasser gefüllt."],["Versickerung","Wasser","Wasser dringt von der Oberfläche in Boden und Gestein ein."],["Dichte","Wasser","Wie viel Masse in einem bestimmten Volumen steckt. Eis ist weniger dicht als flüssiges Wasser."],["Tundra","Natur","Eine kalte Landschaft mit kurzem Sommer und meist niedrigen Pflanzen wie Moosen und Sträuchern."],["Taiga","Natur","Ein ausgedehnter Gürtel von Nadelwäldern in kalten nördlichen Regionen."],["Klimazone","Wetter","Eine große Region mit ähnlichen langfristigen Klimabedingungen. Einfache Breitengrad-Gürtel sind nur ein Modell."],["Tropen","Wetter","Die Region zwischen den Wendekreisen. Im Jahreslauf erreicht sie viel Sonnenenergie."],["Subtropen","Wetter","Regionen zwischen Tropen und gemäßigten Gebieten. Sie enthalten trockene und feuchte Landschaften."],["Niederschlag","Wetter","Wasser, das aus Wolken zur Erde fällt, etwa Regen, Schnee oder Hagel."],["Luftdruck","Wetter","Der Druck, den die Luft ausübt. Luftdruckunterschiede helfen, Wind anzutreiben."],["Gewitter","Wetter","Wetter mit Blitz und Donner, häufig in hohen Wolken mit kräftiger aufsteigender Luft."],["Regenbogen","Wetter","Ein farbiger Bogen, der entsteht, wenn Sonnenlicht in Wassertröpfchen gebrochen und reflektiert wird."],["Mondphase","Weltall","Die scheinbare Form des Mondes, weil wir verschieden viel seiner beleuchteten Hälfte sehen."],["Neumond","Weltall","Der Mond steht ungefähr in Richtung Sonne; seine uns zugewandte Seite ist kaum beleuchtet."],["Vollmond","Weltall","Der Mond steht der Sonne am Himmel gegenüber. Wir sehen seine beleuchtete Scheibe fast ganz."],["Umlaufbahn","Weltall","Der Weg eines Himmelskörpers um einen anderen, zum Beispiel des Mondes um die Erde."],["Stern","Weltall","Eine große heiße Gaskugel, die eigene Energie erzeugt und Licht aussendet. Unsere Sonne ist ein Stern."],["Planet","Weltall","Ein großer, ungefähr runder Himmelskörper, der einen Stern umkreist. Die Erde ist ein Planet."],["Springtide","Meere","Gezeiten mit oft größerem Unterschied zwischen Hoch- und Niedrigwasser bei Neu- und Vollmond."],["Nipptide","Meere","Gezeiten mit oft kleinerem Unterschied zwischen Hoch- und Niedrigwasser nahe den Viertelmondphasen."],["Fjord","Meere","Eine lange, oft tiefe Meeresbucht in einem Tal, das ein Gletscher geformt hat."],["Meeresspiegel","Meere","Die Höhe der Meeresoberfläche. Für Höhenvergleiche nutzt man einen gemittelten Bezug."],["Biodiversität","Natur","Die Vielfalt von Lebewesen, ihren genetischen Unterschieden und Lebensräumen."],
 ["Archipel","Wasser","Eine Gruppe von Inseln, zum Beispiel die vielen Inseln Japans."],["Gestein","Erdinneres","Natürliches festes Material, das meist aus Mineralen besteht. Manche Gesteine enthalten auch Glas."],["Mineral","Erdinneres","Ein natürlich vorkommender fester Stoff mit bestimmter Zusammensetzung und geordnetem innerem Aufbau, zum Beispiel Quarz."],["Verwitterung","Erdinneres","Gestein wird an der Oberfläche durch Wasser, Luft, Temperaturwechsel oder Lebewesen verändert und zerkleinert."],["Sediment","Erdinneres","Material wie Sand, Schlamm oder Kies, das abgelagert wird."],["Küste","Meere","Der Bereich, in dem Land und Meer aufeinandertreffen."],["Wasserdampf","Wasser","Wasser als unsichtbares Gas in der Luft. Sichtbare Nebeltröpfchen sind etwas anderes."],["Meeresströmung","Meere","Wasser, das sich über größere Strecken im Meer bewegt. Strömungen transportieren Wärme und Stoffe."],







 ...MEASUREMENT_WORDS,
 ...HEAT_WORDS,
 ...LIGHT_WORDS,
 ...WATER_WORDS,
 ...PARTICLE_WORDS,
 ...MECHANICS_WORDS,
 ...CELL_WORDS,
 ...GENE_WORDS,
];
export const MORE_WHY:[string,string][]=[
 ["Warum ist die Erde rund?","Die Schwerkraft zieht Materie zur Mitte. Bei einem großen Himmelskörper formt sie daraus ungefähr eine Kugel. Die Erddrehung macht die Erde an den Polen etwas flacher."],
 ["Warum fallen Menschen in Australien nicht herunter?","Unten zeigt überall auf der Erde zur Erdmitte. Die Schwerkraft zieht auch Menschen in Australien dorthin. Ihr Oben zeigt von der Mitte weg, genau wie unseres."],
 ["Warum gibt es Tag und Nacht?","Die Sonne beleuchtet eine Hälfte der Erde. Die Erde dreht sich, sodass ein Ort ins Licht und wieder aus dem Licht wandert."],
 ["Warum gibt es Jahreszeiten?","Die Erdachse ist geneigt. Beim Umlauf um die Sonne verändern sich Tageslänge und Sonnenstand. Im Norden und Süden sind die Jahreszeiten entgegengesetzt."],
 ["Warum regnet es?","In Wolken wachsen Tröpfchen oder Eiskristalle. Werden sie groß genug, fallen sie. Eis kann unterwegs schmelzen und ebenfalls als Regen am Boden ankommen."],
 ["Warum bricht ein Vulkan aus?","Magma kann aufsteigen. Dabei verändert sich der Druck, und gelöste Gase bilden wachsende Blasen. Magma und Gase können durch Schwachstellen an die Oberfläche gelangen."],
 ["Warum gibt es Erdbeben?","Gestein kann sich an Störungen verhaken und Spannung aufbauen. Beim plötzlichen Rutschen werden Wellen ausgesendet, die den Boden bewegen."],
 ["Schwimmen Kontinente auf Lava?","Nein. Kontinente gehören zu festen Platten, die auch Meeresboden tragen. Der Mantel darunter ist überwiegend fest, kann sich über lange Zeit aber verformen."],
 ["Warum ist es an den Polen kalt?","Sonnenlicht trifft dort flacher auf und verteilt seine Energie auf größere Flächen. Dazu kommen lange polare Nächte. Schnee und Eis reflektieren viel Licht."],
 ["Warum gibt es Wellen im Meer?","Viele Oberflächenwellen entstehen, wenn Wind Energie auf Wasser überträgt. Wasserteilchen bewegen sich dabei vor allem auf und ab oder auf kreisähnlichen Wegen, während die Welle weiterläuft."],
 ["Warum leuchtet der Mond?","Er reflektiert Sonnenlicht. Seine Oberfläche ist keine Lampe. Von der Erde aus sehen wir verschieden viel von seiner beleuchteten Hälfte."],
 ["Warum gibt es Ebbe und Flut?","Die Anziehung von Mond und Sonne wirkt unterschiedlich stark auf verschiedene Teile der Erde. Zusammen mit der Bewegung des Systems erzeugt das Gezeiten. Küsten und Meerestiefe beeinflussen sie vor Ort."],
 ["Warum ist das Meer salzig?","Wasser löst Stoffe aus Gestein. Flüsse und Vorgänge am Meeresboden bringen gelöste Stoffe ins Meer. Wenn Wasser verdunstet, bleibt Salz zurück."],
 ["Warum haben Eisbären keine Pinguine als Nachbarn?","Eisbären leben in der Arktis. Wilde Pinguine leben in anderen Regionen, überwiegend auf der Südhalbkugel. Sie sind nicht alle Bewohner der Antarktis."],
 ["Warum ist eine Wüste nicht immer heiß?","Wüste bedeutet sehr wenig Niederschlag. Auch eine kalte Landschaft wie Antarktika kann deshalb eine Wüste sein."],
 ["Warum schwimmt Eis?","Beim Gefrieren bilden Wasserteilchen eine offenere Struktur. Für dieselbe Masse braucht Eis mehr Platz. Es ist dadurch weniger dicht als flüssiges Wasser."],
 ["Warum kommt der Donner nach dem Blitz?","Licht erreicht uns viel schneller als Schall. Der Blitz erhitzt Luft sehr schnell; ihre Ausdehnung erzeugt den Donner."],
 ["Warum hört ein Fluss nicht an einer Grenze auf?","Flusswasser folgt der Schwerkraft und der Landschaft. Von Menschen festgelegte Landesgrenzen halten es nicht auf."],
 ["Warum ist Canberra die Hauptstadt und nicht Sydney?","Eine Hauptstadt wird von Menschen festgelegt und muss nicht die größte Stadt sein. Canberra wurde als Hauptstadt Australiens geplant."],
 ["Warum gibt es so viele Sprachen?","Menschen haben sich über lange Zeit in verschiedenen Gemeinschaften entwickelt. Sprachen verändern sich, beeinflussen sich gegenseitig und können über Ländergrenzen hinweg gesprochen werden."],
 ...HEAT_WHY,
 ...LIGHT_WHY,
 ...WATER_WHY,
 ...MECHANICS_WHY,
 ...CELL_WHY,
 ...GENE_WHY,
];
