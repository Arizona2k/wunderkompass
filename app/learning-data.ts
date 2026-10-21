import { MORE_JOURNEYS, MORE_WORDS, MORE_WHY } from "./expanded-learning-data";
import type { QuizQuestion } from "./earth-data";

export type JourneyStep = { title: string; text: string; fact: string; starter?:string; deeper?:string; whyItMatters?:string; observe?:string; sourceIds?:string[]; tryIt?: string };
export type Journey = { id: string; title: string; intro: string; icon: string; color: string; minutes: number; photo?: string; steps: JourneyStep[]; question: QuizQuestion; activity: string; lab?: "water" | "seasons" | "plates"; source: string; sourceName: string };

const BASE_JOURNEYS: Journey[] = [
  { id:"planet", title:"Unser blauer Planet", intro:"Was macht die Erde zu unserem Zuhause?", icon:"globe", color:"blue", minutes:7, photo:"earth", source:"https://science.nasa.gov/earth/facts/", sourceName:"NASA · Earth facts", steps:[
    {title:"Ein Zuhause im Weltall",text:"Die Erde ist ein Planet. Sie reist um die Sonne, zusammen mit sieben anderen Planeten. Die Sonne ist ein Stern und gibt uns Licht und Wärme. Die Erde ist der dritte Planet von der Sonne aus.",fact:"Die Sonne ist viel größer als die Erde. Auf unserer Weltkugel sind beide Größen nicht maßstabsgetreu dargestellt."},
    {title:"Land und Wasser",text:"Etwa 71 von 100 Teilen der Erdoberfläche sind vom Ozean bedeckt. Darum sieht die Erde aus dem Weltall überwiegend blau aus. Die großen Landflächen heißen Kontinente. Inseln sind kleinere Landflächen, die ringsum von Wasser umgeben sind.",fact:"Die Erde ist keine perfekte Kugel. An den Polen ist sie ein kleines bisschen abgeflacht.",tryIt:"Finde auf der Weltkugel eine Insel und einen Kontinent."},
    {title:"Eine unsichtbare Hülle",text:"Um die Erde liegt die Atmosphäre. Das ist eine Hülle aus Gasen. Wir nennen das Gasgemisch um uns herum Luft. Luft ist unsichtbar, aber du kannst bewegte Luft als Wind spüren. Sie enthält den Sauerstoff, den wir zum Atmen brauchen.",fact:"Auch eine leere Flasche ist nicht wirklich leer: In ihr ist Luft."},
    {title:"Warum fallen wir nicht herunter?",text:"Die Schwerkraft zieht Dinge zur Mitte der Erde. Deshalb bleiben wir auf dem Boden. Für Menschen auf der anderen Seite der Erde ist unten ebenfalls die Richtung zur Erdmitte. Es gibt im Weltall kein gemeinsames Oben und Unten für alle.",fact:"Die Schwerkraft hält auch die Atmosphäre an der Erde fest.",tryIt:"Zeige an drei Stellen der Weltkugel, in welche Richtung dort unten ist."},
    {title:"Zwei Bewegungen, zwei Zeiten",text:"Die Erde dreht sich um ihre Achse. Eine Umdrehung dauert ungefähr einen Tag. Gleichzeitig reist sie um die Sonne. Für eine ganze Reise braucht sie ungefähr ein Jahr. Tag und Jahr sind also zwei verschiedene Bewegungen.",fact:"Ein Jahr dauert ungefähr 365¼ Tage. Schaltjahre helfen unserem Kalender, dazu zu passen."}
  ],question:{id:"journey-planet",category:"Weltkugel",question:"Wohin zieht die Schwerkraft dich?",answers:["Zur Mitte der Erde","Zum Nordpol","Immer zur Sonne"],correct:0,why:"Unten bedeutet auf der Erde: in Richtung Erdmitte. Das gilt auch für Menschen auf der anderen Seite."},activity:"Nimm einen Ball. Zeige auf mehrere Stellen und überlege: Wo wäre dort oben, wo unten?"},
  { id:"inside", title:"Unter unseren Füßen", intro:"Erdschichten, wandernde Platten und Vulkane.", icon:"layers", color:"orange", minutes:9, photo:"volcano", lab:"plates", source:"https://www.nps.gov/subjects/geology/plate-tectonics.htm", sourceName:"National Park Service · Bewegliche Erdplatten", steps:[
    {title:"Vier Schichten",text:"Von außen nach innen finden wir Erdkruste, Erdmantel, äußeren Kern und inneren Kern. Die Kruste ist eine sehr dünne Gesteinshaut. Der Mantel darunter ist viel dicker. Die beiden Kernschichten bestehen vor allem aus Metall.",fact:"Niemand kann bis zum Erdkern bohren. Forschende untersuchen unter anderem, wie Erdbebenwellen durch die Erde wandern."},
    {title:"Heiß heißt nicht immer flüssig",text:"Der Mantel ist sehr heiß, besteht aber überwiegend aus festem Gestein. Über sehr lange Zeit kann es sich langsam verformen. Der äußere Kern ist flüssig. Der innere Kern ist trotz großer Hitze fest, weil dort ein gewaltiger Druck herrscht.",fact:"Die Erde ist innen kein riesiger Hohlraum voller Lava."},
    {title:"Die Erde hat ein Plattenpuzzle",text:"Die feste äußere Hülle ist in große Platten geteilt. Sie bestehen aus der Kruste und dem obersten festen Teil des Mantels. Die Platten bewegen sich meistens nur wenige Zentimeter im Jahr. Darauf reisen auch die Kontinente ganz langsam mit.",fact:"Eine Platte kann Land und Meeresboden tragen. Die Plattengrenzen sind nicht die Ländergrenzen."},
    {title:"Zusammen, auseinander, vorbei",text:"Platten können auseinanderdriften, zusammenstoßen oder aneinander vorbeigleiten. Wo Kontinente zusammenstoßen, können hohe Gebirge entstehen. Wo eine Platte unter eine andere taucht, entstehen oft Vulkane. Bei allen drei Arten von Grenzen können Erdbeben auftreten.",fact:"Die Entstehung eines Gebirges dauert viele Millionen Jahre. Das passiert nicht in wenigen Sekunden wie im Modell."},
    {title:"Magma oder Lava?",text:"Geschmolzenes Gestein unter der Erdoberfläche heißt Magma. Erreicht es die Oberfläche, nennen wir es Lava. Bei einem Ausbruch können auch Asche und Gase austreten. Manche Vulkane liegen an Plattengrenzen; andere, wie auf Hawaii, über heißen Stellen im Erdinneren.",fact:"Vulkanasche ist kein verbranntes Holz, sondern besteht aus winzigen Gesteins- und Glasstückchen."}
  ],question:{id:"journey-inside",category:"Erdschichten",question:"Wie heißt geschmolzenes Gestein an der Erdoberfläche?",answers:["Eis","Lava","Erdkern"],correct:1,why:"Unter der Erde heißt es Magma. Sobald es an die Oberfläche gelangt, heißt es Lava."},activity:"Lege zwei gefaltete Geschirrtücher nebeneinander. Schiebe sie langsam zusammen: Wie falten sie sich? Das ist nur ein Vergleich für die Entstehung von Gebirgen."},
  {
  "id": "water",
  "title": "Die Reise eines Tropfens",
  "intro": "Wasser verschwindet nicht einfach. Es reist!",
  "icon": "water",
  "color": "blue",
  "minutes": 8,
  "lab": "water",
  "source": "https://www.usgs.gov/water-science-school/water-cycle",
  "sourceName": "USGS · Wasserkreislauf",
  "steps": [
    {
      "title": "Drei Formen von Wasser",
      "text": "Wasser kann fest, flüssig oder gasförmig sein. Festes Wasser heißt Eis. Flüssiges Wasser fließt. Gasförmiges Wasser heißt Wasserdampf und ist unsichtbar. Die weiße Wolke über einem heißen Getränk besteht dagegen aus kleinen Wassertröpfchen.\n\nEin nasses Tuch muss nicht kochen, um trocken zu werden. Wasser kann an seiner Oberfläche in die Luft gelangen. Dabei verschwinden die Wasserteilchen nicht einfach.",
      "fact": "Wasser kann auch bei Zimmertemperatur verdunsten. Es muss dafür nicht kochen.",
      "starter": "Eis, Wasser und unsichtbarer Wasserdampf sind Formen desselben Stoffes.",
      "deeper": "Verdunsten geschieht an der Oberfläche; Kochen ist ein anderer Vorgang. Eine sichtbare weiße Wolke besteht aus Tröpfchen, nicht aus dem unsichtbaren Gas.",
      "whyItMatters": "Du unterscheidest Zustandsänderung vom Verschwinden eines Stoffes.",
      "observe": "Beobachte ein nasses Tuch beim Trocknen. Vermute, wohin das Wasser gelangt. Nutze kein heißes Wasser und keine Herdplatte.",
      "sourceIds": [
        "water-base",
        "water-evaporation"
      ]
    },
    {
      "title": "Ab in die Luft",
      "text": "Die Sonne erwärmt Meere, Seen und den Boden. Ein Teil des Wassers verdunstet und gelangt als Wasserdampf in die Luft. Auch Pflanzen geben Wasser ab. Bei Wärme, Wind und trockener Luft kann Wasser schneller verdunsten.\n\nBeim Trocknen spielt die Umgebung mit: Bewegt sich die Luft, kann sie feuchte Luft am Tuch ersetzen. Deshalb ist nicht allein die Temperatur wichtig.",
      "fact": "Eine Pfütze wird kleiner, obwohl niemand das Wasser weggeschöpft hat: Ein Teil ist in der Luft.",
      "tryIt": "Was passiert mit einer nassen Socke, wenn sie zum Trocknen aufgehängt wird?",
      "starter": "Wasser gelangt aus Pfützen, Meeren und Pflanzen in die Luft.",
      "deeper": "Mehrere Bedingungen wirken gleichzeitig. Im Wassermodell veränderst du möglichst nur einen Regler, damit du eine Ursache besser vergleichen kannst.",
      "whyItMatters": "Du lernst, einen fairen Vergleich von mehreren gleichzeitig veränderten Dingen zu unterscheiden.",
      "observe": "Vergleiche im Wasserkreislauflabor zwei Einstellungen mit nur einem veränderten Regler. Beschreibe eine Beobachtung und eine Vermutung getrennt.",
      "sourceIds": [
        "water-base",
        "water-evaporation"
      ]
    },
    {
      "title": "Wie entstehen Wolken?",
      "text": "Wenn feuchte Luft abkühlt, kann sich Wasserdampf in winzige Tröpfchen verwandeln. Das heißt Kondensation. Viele Tröpfchen oder Eiskristalle zusammen bilden eine Wolke. Erst wenn sie groß genug werden, fällt Niederschlag.\n\nKondensation macht Wasser sichtbar, das vorher als Gas in der Luft war. Die Tropfen außen am kalten Glas kommen deshalb aus der Luft und nicht durch die Glaswand.",
      "fact": "Eine Wolke besteht nicht einfach aus unsichtbarem Wasserdampf. Wir sehen ihre Tröpfchen oder Eiskristalle.",
      "starter": "Kühlt feuchte Luft ab, können Tröpfchen entstehen. Viele bilden eine Wolke.",
      "deeper": "Nicht jede Abkühlung erzeugt sofort eine Wolke. Die vorhandene Feuchtigkeit und die Bedingungen der Luft entscheiden mit.",
      "whyItMatters": "Du erkennst einen unsichtbaren Stoff an seiner sichtbaren Veränderung.",
      "observe": "Beobachte mit einem Erwachsenen ein kaltes Wasserglas. Vermute zuerst, woher Tropfen außen kommen, und vergleiche deine Erklärung mit dem Kapitel.",
      "sourceIds": [
        "water-condensation"
      ]
    },
    {
      "title": "Zurück auf die Erde",
      "text": "Niederschlag kann Regen, Schnee oder Hagel sein. Wasser sammelt sich in Bächen, Flüssen und Seen. Ein Teil versickert im Boden und wird zu Grundwasser. Flüsse bringen viel Wasser zurück ins Meer. Dort kann seine Reise von Neuem beginnen.\n\nZwei Regentropfen müssen nicht denselben Weg nehmen. Einer fließt über den Boden, ein anderer versickert. Manche bleiben lange gespeichert, bevor sie weiterwandern.",
      "fact": "Der Wasserkreislauf hat keinen festen Startpunkt. Wasser kann auch lange im Eis oder im Boden bleiben.",
      "starter": "Wasser fällt als Niederschlag und findet viele Wege durch Land und Meer.",
      "deeper": "Ein Kreislauf bedeutet keine überall gleich schnelle Rundreise. Pfeile zeigen Verbindungen zwischen Speichern, nicht die Reise jedes einzelnen Tropfens.",
      "whyItMatters": "Du kannst in einer einfachen Grafik mehrere echte Wasserwege erkennen.",
      "observe": "Zeichne zwei mögliche Wege vom Regen zum Meer. Markiere, wo Wasser auf seinem Weg länger gespeichert sein könnte.",
      "sourceIds": [
        "water-base",
        "water-infiltration"
      ]
    },
    {
      "title": "Trinkwasser ist kostbar",
      "text": "Das meiste Wasser auf der Erde ist salzig. Süßwasser enthält viel weniger Salz. Ein großer Teil des Süßwassers steckt in Eis oder im Boden. Sauberes Trinkwasser muss deshalb gut geschützt und aufbereitet werden.\n\nSalzgehalt und Sauberkeit sind verschiedene Fragen. Auch Süßwasser kann ungeeignet zum Trinken sein. Wasseraufbereitung und Schutz der Wasserquellen gehören deshalb zusammen.",
      "fact": "Klares Wasser ist nicht automatisch Trinkwasser. Aus Bächen und Seen trinken wir nicht einfach.",
      "starter": "Sauberes Trinkwasser ist wertvoll. Klares Wasser ist nicht automatisch sicher.",
      "deeper": "Ein Lernversuch ersetzt keine Prüfung der Trinkwasserqualität. Farbe und Geruch allein sind keine sichere Freigabe.",
      "whyItMatters": "Du verstehst, warum wir unbekanntes Wasser nicht einfach probieren.",
      "observe": "Suche mit einem Erwachsenen den Weg eures Trinkwassers heraus. Nutzt Informationen des Wasserversorgers; probiert kein Wasser aus Bächen oder Seen.",
      "sourceIds": [
        "water-reserves",
        "water-drinking-quality"
      ]
    }
  ],
  "question": {
    "id": "journey-water",
    "category": "Wasser & Wetter",
    "question": "Was passiert bei Kondensation?",
    "answers": [
      "Steine werden zu Sand",
      "Eis wird wärmer",
      "Wasserdampf wird zu Wassertröpfchen"
    ],
    "correct": 2,
    "why": "Kühlt feuchte Luft ab, können kleine Tröpfchen entstehen. Viele Tröpfchen machen Wolken sichtbar."
  },
  "activity": "Fülle mit einem Erwachsenen kaltes Wasser in ein Glas. Beobachte die Außenseite: Die Tröpfchen dort kommen aus der Luft, nicht durch das Glas!"
},
  {
  "id": "weather",
  "title": "Wetterforscher unterwegs",
  "intro": "Wolken, Wind und der Unterschied zum Klima.",
  "icon": "cloud",
  "color": "purple",
  "minutes": 7,
  "source": "https://science.nasa.gov/kids/videos/video-whats-the-difference-between-weather-and-climate/",
  "sourceName": "NASA Kids · Wetter und Klima",
  "steps": [
    {
      "title": "Was ist heute draußen los?",
      "text": "Wetter ist, was gerade in der Luft um uns herum passiert: Ist es warm oder kalt? Regnet es? Weht Wind? Wetter kann sich schon innerhalb eines Tages ändern. Forschende messen Temperatur, Luftdruck, Wind und Niederschlag.\n\nWarm fühlen und Temperatur messen sind nicht dasselbe. Ein Messgerät hilft, Beobachtungen verschiedener Tage zu vergleichen. Dabei sollte man ähnliche Bedingungen wählen.",
      "fact": "Ein Thermometer misst die Temperatur. Ein Regenmesser misst, wie viel Regen gefallen ist.",
      "starter": "Wetter beschreibt, was gerade draußen passiert. Wir können es beobachten und messen.",
      "deeper": "Eine Einzelmessung gilt für ihren Ort und Zeitpunkt. Sie beschreibt nicht automatisch eine ganze Stadt oder einen langen Zeitraum.",
      "whyItMatters": "Du trennst einen persönlichen Eindruck von einem vergleichbaren Messwert.",
      "observe": "Beschreibe das Wetter ohne Zahlen und mit einem vorhandenen Thermometer. Notiere auch Ort und Zeit und vergleiche beide Beschreibungen.",
      "sourceIds": [
        "weather-base",
        "weather-climate"
      ]
    },
    {
      "title": "Wind ist Luft in Bewegung",
      "text": "Die Sonne erwärmt die Erde nicht überall gleich. Dadurch entstehen Unterschiede in Temperatur und Luftdruck. Luft setzt sich in Bewegung: Es weht Wind. Auch die Drehung der Erde beeinflusst große Windsysteme.\n\nUnterschiede im Luftdruck helfen, Luft anzutreiben. Wind bewegt Wolken oder Blätter; sie sind Hinweise auf seine Wirkung, nicht die Luft selbst.",
      "fact": "Wind kann Samen verteilen, Wolken verschieben und Windräder antreiben.",
      "starter": "Wind ist Luft, die sich bewegt. Er kann schwach oder stark sein.",
      "deeper": "Das Wetterstationsmodell vereinfacht viele gleichzeitig wirkende Vorgänge. Ein einzelner Regler bildet keine vollständige Wettervorhersage ab.",
      "whyItMatters": "Du kannst Bewegung als Hinweis auf einen unsichtbaren Vorgang nutzen.",
      "observe": "Beobachte Blätter sicher durch ein Fenster. Trenne die Beobachtung Blatt bewegt sich von der Erklärung Luft bewegt das Blatt.",
      "sourceIds": [
        "weather-wind",
        "weather-sea-breeze"
      ]
    },
    {
      "title": "Wolken beobachten",
      "text": "Wolken können wie Watte, wie dünne Federn oder wie eine graue Decke aussehen. Ihre Form verrät etwas über die Vorgänge in der Luft. Aus manchen Wolken fällt Regen. Nicht jede Wolke regnet: Ihre Tröpfchen sind oft noch sehr klein.\n\nEine Wolkenzeichnung hält einen Moment fest. Wenn du später erneut schaust, können Form und Lage anders sein. Eine Beobachtungsreihe verrät mehr als ein einzelnes Bild.",
      "fact": "Nebel ist eine Wolke direkt am Boden.",
      "tryIt": "Sieh aus dem Fenster. Zeichne eine Wolkenform und beschreibe sie mit drei Wörtern.",
      "starter": "Wolken sehen verschieden aus. Nicht jede Wolke bringt Regen.",
      "deeper": "Aus der Form allein folgt keine sichere lokale Vorhersage. Wolkenbeobachtung ist ein Hinweis unter mehreren Wetterdaten.",
      "whyItMatters": "Du bemerkst Veränderungen, statt Wolken nur nach ihrem Aussehen zu benennen.",
      "observe": "Skizziere vom Fenster aus dieselbe Himmelsstelle zweimal. Notiere die Zeit und beschreibe, was sich verändert hat, ohne direkt in die Sonne zu schauen.",
      "sourceIds": [
        "weather-cloud-types",
        "weather-fog"
      ]
    },
    {
      "title": "Wetter ist kurz, Klima ist lang",
      "text": "Wetter beschreibt einzelne Stunden und Tage. Klima beschreibt, welches Wetter in einer Gegend über viele Jahre typisch ist. Für Klimavergleiche betrachten Forschende oft mindestens 30 Jahre. Ein kalter Tag allein sagt deshalb wenig über die Erwärmung des Klimas aus.\n\nEine Reihe von drei Tagen ist noch kein Klimabeleg. Für einen langfristigen Vergleich müssen viele Beobachtungen aus vergleichbaren Zeiträumen betrachtet werden.",
      "fact": "Deine Kleidung passt du an das heutige Wetter an. Die typischen Jahreszeiten deiner Gegend gehören zum Klima.",
      "starter": "Wetter ist heute. Klima beschreibt typische Bedingungen über viele Jahre.",
      "deeper": "Ein Mittelwert fasst viele Daten zusammen, verschweigt aber die einzelnen Unterschiede. Klima umfasst auch Muster und Schwankungen, nicht nur eine Zahl.",
      "whyItMatters": "Du erkennst, warum ein kalter Tag einer langfristigen Erwärmung nicht widerspricht.",
      "observe": "Erfinde keine Messwerte: Vergleiche dein Wetterblatt mit einer datierten Klimabeschreibung. Erkläre, welche unterschiedliche Frage beide beantworten.",
      "sourceIds": [
        "weather-base",
        "weather-climate"
      ]
    },
    {
      "title": "Wie wissen wir das Wetter von morgen?",
      "text": "Wetterstationen, Satelliten und andere Messgeräte sammeln Daten. Computer berechnen daraus Vorhersagen. Weil die Luft ständig in Bewegung ist, bleiben Vorhersagen unsicher. Je weiter der Blick in die Zukunft geht, desto größer ist diese Unsicherheit meistens.\n\nEine Vorhersage ist ein begründeter Blick nach vorn, keine bereits gemachte Beobachtung. Werden neue Daten verfügbar, kann sie angepasst werden. Das ist kein Zeichen von willkürlichem Raten.",
      "fact": "Eine Vorhersage kann sehr hilfreich sein, auch wenn sie nicht auf die Minute stimmt.",
      "starter": "Messgeräte und Computer helfen beim Wetterbericht. Trotzdem kann er sich ändern.",
      "deeper": "Unsicherheit wächst häufig mit dem Vorhersageabstand. Auch Ort und Wetterlage beeinflussen, wie genau eine Aussage sein kann.",
      "whyItMatters": "Du kannst eine veränderte Vorhersage als neue Einschätzung verstehen.",
      "observe": "Notiere einen Wetterbericht und vergleiche ihn später mit dem beobachteten Wetter. Markiere, was passte und wo die Aussage unsicher war.",
      "sourceIds": [
        "weather-climate",
        "weather-forecast-range"
      ]
    }
  ],
  "question": {
    "id": "journey-weather",
    "category": "Wasser & Wetter",
    "question": "Was beschreibt Klima?",
    "answers": [
      "Typisches Wetter über viele Jahre",
      "Nur den Regen von heute",
      "Die Farbe einer Wolke"
    ],
    "correct": 0,
    "why": "Klima beschreibt langfristige Muster. Wetter beschreibt dagegen die Bedingungen zu einer bestimmten Zeit."
  },
  "activity": "Führe drei Tage lang ein Wetterblatt: Wolken, Wind, Regen und Temperatur. Das ist eine Wetterbeobachtung – noch keine Klimamessung."
},
  {
  "id": "seasons",
  "title": "Die Jahreszeiten-Maschine",
  "intro": "Warum ist in Australien Weihnachten im Sommer?",
  "icon": "sun",
  "color": "yellow",
  "minutes": 8,
  "lab": "seasons",
  "source": "https://spaceplace.nasa.gov/seasons/en/",
  "sourceName": "NASA Space Place · Jahreszeiten",
  "steps": [
    {
      "title": "Die Erde steht schief",
      "text": "Die gedachte Erdachse ist gegenüber einer senkrechten Linie zur Umlaufbahn um etwa 23,4 Grad geneigt. Während die Erde um die Sonne reist, zeigt ihre Achse ungefähr in dieselbe Richtung. Das verändert im Lauf des Jahres den Sonnenstand und die Tageslänge.\n\nSchräg bedeutet hier: im Vergleich zur Umlaufbahn um die Sonne. Die Achse kippt nicht alle sechs Monate zur anderen Seite; die Erde erreicht einen anderen Ort auf ihrer Bahn.",
      "fact": "Die Achse ist keine echte Stange. Sie hilft uns, die Drehung zu beschreiben.",
      "starter": "Die Erde dreht sich um eine gedachte, schräg stehende Achse.",
      "deeper": "Richtung und Neigungswinkel sind zwei verschiedene Dinge. Im Jahreszeitenmodell bleiben beide während eines vereinfachten Umlaufs ungefähr gleich.",
      "whyItMatters": "Du kannst den jährlichen Wechsel erklären, ohne die Erdachse ständig neu zu kippen.",
      "observe": "Wähle im Jahreszeitenlabor nacheinander März, Juni, September und Dezember. Vergleiche bei eingeschalteter Achsneigung die Richtung der Achse und die Position der Erde zur Sonne. Was bleibt gleich, was ändert sich?",
      "sourceIds": [
        "seasons-base"
      ]
    },
    {
      "title": "Sommer auf der Nordhalbkugel",
      "text": "Um den Juni ist die Nordhalbkugel zur Sonne geneigt. Bei uns in Deutschland steht die Sonne dann höher und die Tage sind länger. So erreicht uns pro Tag mehr Sonnenenergie. Auf der Südhalbkugel ist zur gleichen Zeit Winter.\n\nBeide Wirkungen helfen zusammen: Sonnenlicht trifft steiler auf und scheint länger am Tag. Deshalb kann insgesamt mehr Sonnenenergie ankommen, auch wenn ein einzelner Sommertag kühl ist.",
      "fact": "Am Nordpol geht die Sonne im Sommer für mehrere Monate nicht unter.",
      "starter": "Im nördlichen Sommer sind unsere Tage länger und die Sonne steht höher.",
      "deeper": "Sommer bedeutet eine Jahreszeit, nicht eine Temperaturgarantie. Wetter, Standort und Sonnenenergie dürfen nicht zu einer einzigen Aussage vermischt werden.",
      "whyItMatters": "Du verstehst den Unterschied zwischen einer Jahreszeit und ihrem heutigen Wetter.",
      "observe": "Wähle im Jahreszeitenlabor Juni. Vergleiche die Karten für Deutschland und Australien: Welche Jahreszeiten werden gleichzeitig angezeigt? Erkläre den Unterschied mit der Achsneigung. Prüfe das Tageswetter zusätzlich, bevor du Reisekleidung aussuchst.",
      "sourceIds": [
        "seasons-base",
        "seasons-polar-day"
      ]
    },
    {
      "title": "Winter auf der Nordhalbkugel",
      "text": "Um den Dezember ist die Nordhalbkugel von der Sonne weg geneigt. Bei uns steht die Sonne niedriger, und die Tage sind kürzer. In Australien ist gleichzeitig Sommer. Die Jahreszeiten der beiden Halbkugeln sind also gegensätzlich.\n\nDie zwei Halbkugeln erleben denselben Umlauf gleichzeitig, aber mit entgegengesetzter Neigung zur Sonne. Eine Erklärung nur durch wechselnde Entfernung könnte diesen Gegensatz nicht erklären.",
      "fact": "Die Entfernung zur Sonne ist nicht der Hauptgrund für unsere Jahreszeiten.",
      "starter": "Im nördlichen Winter sind die Tage kürzer. In Australien ist dann Sommer.",
      "deeper": "Die Erdbahn ist nicht genau kreisrund. Das hebt die entscheidende Wirkung der Achsneigung auf Sonnenstand und Tageslänge aber nicht auf.",
      "whyItMatters": "Du kannst zwei Erklärungen daran prüfen, ob sie dieselbe Beobachtung erklären.",
      "observe": "Stelle im Modell Dezember ein. Erkläre mit den beiden Halbkugeln, weshalb Entfernung allein nicht für Sommer und Winter ausreicht.",
      "sourceIds": [
        "seasons-base"
      ]
    },
    {
      "title": "Frühling und Herbst",
      "text": "Um März und September sind Tag und Nacht fast überall ungefähr gleich lang. Die Sonne steht dann über dem Äquator. Welche Jahreszeit beginnt, hängt von der Halbkugel ab: Frühling im Norden bedeutet Herbst im Süden und umgekehrt.\n\nUngefähr ist wichtig: Das einfache Modell zeigt einen Grundzusammenhang. Wirkliche Sonnenauf- und Sonnenuntergänge hängen auch davon ab, wie die Sonne am Horizont betrachtet wird.",
      "fact": "In den Tropen unterscheidet man oft eher Regen- und Trockenzeiten als vier Jahreszeiten wie bei uns.",
      "starter": "Im März und September sind Tag und Nacht ungefähr gleich lang.",
      "deeper": "Vier gleich benannte Jahreszeiten beschreiben nicht jeden Lebensraum gut. In tropischen Regionen können Niederschlagszeiten für Pflanzen und Tiere wichtiger sein.",
      "whyItMatters": "Du lernst, ein nützliches Modell zu verwenden und seine Grenzen mitzusagen.",
      "observe": "Vergleiche im Modell März und September. Benenne die Jahreszeiten jeweils aus Sicht der Nord- und Südhalbkugel.",
      "sourceIds": [
        "seasons-base",
        "seasons-equinox",
        "seasons-climate-zones"
      ]
    },
    {
      "title": "Ein Tag ist kein Jahr",
      "text": "Drehen um die eigene Achse macht Tag und Nacht. Reisen um die Sonne mit geneigter Achse macht den jährlichen Wechsel der Jahreszeiten. Ein sonniger Wintertag bleibt trotzdem ein Wintertag. Wetter und Jahreszeit sind nicht dasselbe.\n\nDu kannst dieselbe Landschaft nachts und tagsüber sehen, ohne dass dabei eine andere Jahreszeit beginnt. Die beiden Veränderungen haben verschiedene Zeiträume und Ursachen.",
      "fact": "Auch im Winter kann die Sonne hell scheinen. Für die tägliche Sonnenenergie zählen neben der Tageslänge auch der Sonnenstand und das Wetter.",
      "starter": "Die Erddrehung macht Tag und Nacht. Der Umlauf mit geneigter Achse macht Jahreszeiten.",
      "deeper": "Ein Modell kann Drehung und Umlauf zum Beobachten beschleunigen. Das ist eine Darstellungshilfe, keine Aussage über die wirklichen Geschwindigkeiten.",
      "whyItMatters": "Du ordnest Beobachtungen der passenden Bewegung zu.",
      "observe": "Erkläre mit zwei verschiedenen Handbewegungen Tag und Jahr. Sage dazu, welche Bewegung du zeigst und welche du gerade auslässt.",
      "sourceIds": [
        "seasons-base"
      ]
    }
  ],
  "question": {
    "id": "journey-seasons",
    "category": "Jahreszeiten",
    "question": "Welche Jahreszeit ist in Australien, wenn in Deutschland Sommer ist?",
    "answers": [
      "Auch Sommer",
      "Winter",
      "Immer Frühling"
    ],
    "correct": 1,
    "why": "Deutschland liegt auf der Nordhalbkugel, Australien auf der Südhalbkugel. Ihre Jahreszeiten sind gegensätzlich."
  },
  "activity": "Halte einen Ball schief neben eine Taschenlampe. Lass seine Achse gleich ausgerichtet und bewege ihn um die Lampe. Mach das gemeinsam und schau nicht in das Licht."
},
  {
  "id": "ocean",
  "title": "Tauchgang ins Weltmeer",
  "intro": "Vom sonnigen Korallenriff in die dunkle Tiefsee.",
  "icon": "waves",
  "color": "blue",
  "minutes": 8,
  "photo": "reef",
  "source": "https://oceanservice.noaa.gov/education/tutorial_corals/coral01_intro.html",
  "sourceName": "NOAA · Korallen und Meereswissen",
  "steps": [
    {
      "title": "Fünf Namen, ein Weltmeer",
      "text": "Wir unterscheiden Pazifik, Atlantik, Indischen, Arktischen und Südlichen Ozean. Die Grenzen sind Vereinbarungen: Das Wasser bleibt verbunden. Kleinere Meere wie Nordsee und Mittelmeer gehören ebenfalls zum großen Weltmeer.\n\nEin Name setzt keine Wand ins Wasser. Meere und Ozeane werden für die Orientierung gegliedert, während Wasser und Lebewesen über viele dieser gedachten Grenzen hinwegkommen können.",
      "fact": "Der Pazifik ist der größte, der Arktische Ozean der kleinste der fünf Ozeane.",
      "starter": "Fünf Ozeane haben eigene Namen. Ihr Wasser ist miteinander verbunden.",
      "deeper": "Benennungen und Abgrenzungen sind Vereinbarungen. Unser Fünf-Ozeane-Modell ist eine Orientierungshilfe, keine Trennung in fünf geschlossene Behälter.",
      "whyItMatters": "Du liest Meeresnamen auf einer Karte, ohne das Weltmeer in getrennte Seen zu verwandeln.",
      "observe": "Verfolge auf der Kugel einen möglichen Wasserweg zwischen Atlantik und Pazifik. Kannst du einen Weg finden, der nur über Wasser führt? Die gedachten Ozeangrenzen sind keine Wände.",
      "sourceIds": [
        "ocean-basins",
        "ocean-sizes"
      ]
    },
    {
      "title": "Warum ist das Meer salzig?",
      "text": "Regen und Flüsse lösen winzige Mengen von Mineralien aus Gestein und bringen sie ins Meer. Auch am Meeresboden gelangen Stoffe ins Wasser. Wenn Wasser verdunstet, bleibt das Salz zurück. Über lange Zeit haben sich so Salze im Meer angesammelt.\n\nDer Kreislauf von Wasser und der Transport gelöster Stoffe sind verschiedene Vorgänge. Ein Fluss kann Mineralien mitbringen, obwohl er nicht so salzig schmeckt wie Meerwasser.",
      "fact": "Die meisten Flüsse enthalten ebenfalls gelöste Stoffe, aber viel weniger Salz als Meerwasser.",
      "starter": "Meerwasser enthält Salz. Wenn Wasser verdunstet, bleibt das Salz zurück.",
      "deeper": "Salzgehalt ist nicht überall gleich. Verdunstung, Regen und einströmendes Süßwasser beeinflussen örtliche Unterschiede.",
      "whyItMatters": "Du kannst Wassertransport und Stofftransport auseinanderhalten.",
      "observe": "Zeichne zwei Pfeile: Wasser ins Meer und Wasser in die Luft. Beschrifte, bei welchem Pfeil gelöste Salze mitreisen können. Kein Meerwasser probieren.",
      "sourceIds": [
        "ocean-salt"
      ]
    },
    {
      "title": "Korallen sind Tiere",
      "text": "Ein Korallenriff wird von vielen winzigen Korallentieren aufgebaut. Viele riffbildende Korallen leben mit kleinen Algen zusammen. Die Algen brauchen Sonnenlicht. Deshalb wachsen solche Riffe meistens in flachem, warmem, klarem Meerwasser.\n\nEin Korallentier ist klein; sein gemeinsam gebauter Lebensraum kann groß sein. Kalkskelett und lebendes Tier sind nicht dasselbe. Viele andere Arten nutzen das Riff als Zuhause.",
      "fact": "Ein Riff bietet Fischen, Krebsen und vielen anderen Lebewesen Verstecke und Nahrung.",
      "starter": "Korallen sind Tiere. Viele kleine Polypen bauen zusammen ein Riff.",
      "deeper": "Auch im kalten, dunklen Meer können manche Steinkorallen Riffe aufbauen. Unser Bild zeigt warme Flachwasserriffe mit Algenpartnern und beschreibt nicht alle Korallen.",
      "whyItMatters": "Du erkennst die Zusammenarbeit und den Unterschied zwischen Organismus und Lebensraum.",
      "observe": "Untersuche im Schaubild den vergrößerten Steinkorallen-Polypen. Unterscheide lebendes Tier, kleine Algen im Gewebe und Kalkskelett. Erkläre danach, wie ein Riff anderen Tieren Lebensraum bietet. Der Fisch ist ein anderes Tier, kein Teil des Polypen.",
      "sourceIds": [
        "ocean-base",
        "ocean-coral-symbiosis",
        "ocean-coral-range"
      ]
    },
    {
      "title": "Immer tiefer, immer dunkler",
      "text": "Sonnenlicht erreicht nur die oberen Bereiche des Meeres. Weiter unten wird es dunkel, kalt und der Druck nimmt zu. Dort leben Tiere mit besonderen Anpassungen. Manche erzeugen eigenes Licht. Auch in der Tiefsee gibt es also Leben.\n\nLicht von oben erreicht nicht jede Tiefe. Dunkelheit bedeutet daher nicht automatisch, dass kein Leben möglich ist. Anpassungen müssen zu den Bedingungen des Lebensraums passen.",
      "fact": "Der tiefste bekannte Bereich liegt im Marianengraben, fast elf Kilometer unter der Meeresoberfläche.",
      "starter": "In der Tiefsee ist es dunkel. Trotzdem leben dort Tiere.",
      "deeper": "Das dunkle Bild zeigt einen ausgewählten Lebensraum, nicht alle Tiefseetiere. Auch der Tiefenrekord braucht die Messregel unter der Meeresoberfläche.",
      "whyItMatters": "Du vermeidest den Schluss dunkel gleich unbewohnt.",
      "observe": "Vergleiche im Schaubild Oberfläche und Tiefe. Welche Bedingungen ändern sich? Erkläre, warum ein Tier nicht überall dieselben Bedingungen vorfindet.",
      "sourceIds": [
        "ocean-light",
        "ocean-pressure",
        "ocean-depth",
        "ocean-bioluminescence"
      ]
    },
    {
      "title": "Wasser in Bewegung",
      "text": "Wind, Temperaturunterschiede und Unterschiede im Salzgehalt helfen, Meeresströmungen anzutreiben. Sie transportieren Wärme und Nährstoffe. Ebbe und Flut entstehen vor allem durch die Schwerkraft des Mondes und auch der Sonne.\n\nEin Wasserstand und ein Wasserstrom sind nicht dasselbe. Gezeiten können zwar Strömungen erzeugen, doch auch Wind und Dichteunterschiede treiben Strömungen an. Eine einzelne Welle ist wieder ein anderer Vorgang.",
      "fact": "Eine Welle kann sich fortbewegen, ohne dass jedes Wasserteilchen die ganze Strecke mitreist.",
      "starter": "Strömungen bewegen Wasser. Gezeiten lassen den Meeresspiegel steigen und sinken.",
      "deeper": "Die Gezeitenhöhe hängt vom Ort ab. Ein einfaches Modell ohne Küstenform kann keinen örtlichen Gezeitenkalender ersetzen.",
      "whyItMatters": "Du beschreibst Meerwasser genauer als mit alles bewegt sich.",
      "observe": "Vergleiche die Pfeile im Strömungsschaubild. Folge dann über die Karte Meeresströmungen der Wissensverbindung zu Ebbe und Flut und wechsle dort zwischen Niedrigwasser und Hochwasser. Beschreibe einmal einen Wasserweg und einmal die Änderung der Wasserhöhe.",
      "sourceIds": [
        "ocean-currents",
        "ocean-tides",
        "ocean-waves"
      ]
    }
  ],
  "question": {
    "id": "journey-ocean",
    "category": "Natur",
    "question": "Was sind Korallen?",
    "answers": [
      "Bunte Steine",
      "Unterwasserpflanzen",
      "Tiere"
    ],
    "correct": 2,
    "why": "Korallen bestehen aus kleinen Tieren, den Polypen. Viele leben mit Algen zusammen."
  },
  "activity": "Vergleiche auf der Weltkugel die Nordsee und den Pazifik. Welche ist ein kleineres Meer, welcher ein Ozean?"
},
  {
  "id": "nature",
  "title": "Lebensräume voller Leben",
  "intro": "Wüste, Wald, Savanne und Eiswelten erkunden.",
  "icon": "leaf",
  "color": "green",
  "minutes": 8,
  "source": "https://www.nps.gov/subjects/biodiversity/index.htm",
  "sourceName": "National Park Service · Artenvielfalt",
  "steps": [
    {
      "title": "Ein Zuhause für jedes Lebewesen",
      "text": "Ein Lebensraum bietet einem bestimmten Lebewesen passende Lebensbedingungen. Ein Wald ist ein Lebensraum, ein Teich ebenfalls. Tiere und Pflanzen sind an ihre Umgebung angepasst. Ein Fisch und ein Kaktus brauchen deshalb ganz unterschiedliche Bedingungen.\n\nPassend hängt vom Lebewesen ab: Ein Teich ist für einen Fisch ein Zuhause, für einen Kaktus kein geeigneter Ort. Ein Lebensraum ist also mehr als nur eine Adresse. Tiere brauchen passende Nahrung. Pflanzen stellen energiereiche Stoffe mithilfe von Licht selbst her; Wasser und weitere passende Bedingungen brauchen sie ebenfalls.",
      "fact": "Auch unter einem Stein und in einer Handvoll Erde gibt es Lebensräume.",
      "starter": "Ein Lebensraum muss zu den Bedürfnissen eines Lebewesens passen. Tiere brauchen dort auch Nahrung, Wasser und Schutz.",
      "deeper": "Eine Karte mit einem Beispielpunkt zeigt nicht die gesamte Verbreitung einer Art. Auch innerhalb einer Landschaft sind die Bedingungen unterschiedlich.",
      "whyItMatters": "Du erklärst einen Lebensraum aus Sicht eines Lebewesens.",
      "observe": "Wähle ein Tier aus der Tierwelt. Nenne Nahrung, Wasser und Schutz und suche, welche dieser Bedürfnisse seine Karte erklärt.",
      "sourceIds": [
        "nature-habitat-needs"
      ]
    },
    {
      "title": "Regenwald und Savanne",
      "text": "Tropische Regenwälder sind meist warm und feucht. Dort wachsen viele verschiedene Pflanzen. In Savannen wechseln häufig Regen- und Trockenzeiten. Zwischen Gräsern stehen einzelne Bäume. In afrikanischen Savannen leben zum Beispiel Giraffen und viele Antilopen.\n\nNicht nur die Menge, auch die Verteilung des Regens zählt. Lange trockene Abschnitte stellen andere Anforderungen als häufige Niederschläge. Das hilft, verschiedene Pflanzenwelten zu verstehen.",
      "fact": "Nicht alle Regenwälder liegen in den Tropen. Es gibt auch kühlere Regenwälder.",
      "starter": "Regenwald und Savanne können warm sein. Ihr Wasserangebot ist verschieden.",
      "deeper": "Tropisch bezeichnet eine Weltregion, nicht eine einzige Landschaft. Savannen und Regenwälder sind Beispiele, keine vollständige Liste der Tropen.",
      "whyItMatters": "Du vergleichst Lebensräume anhand ihrer Bedingungen statt allein an einem Tierbild.",
      "observe": "Wähle im Schaubild Regenwald und Savanne. Vergleiche Pflanzen und Wasserangebot. Öffne danach die verknüpfte Giraffenkarte: Welche dort beschriebene Bedingung passt zur Savanne?",
      "sourceIds": [
        "nature-rainforest-types",
        "nature-savanna-seasons"
      ]
    },
    {
      "title": "Wüste heißt trocken",
      "text": "Eine Wüste bekommt sehr wenig Niederschlag. Manche Wüsten sind heiß, andere kalt. Die Antarktis ist trotz ihres Eises sehr trocken und gilt als Kältewüste. Wüstentiere und Pflanzen haben besondere Wege, mit wenig Wasser auszukommen.\n\nEine Sanddüne ist kein Beweis für alle Wüsten. Entscheidend ist der geringe Niederschlag. Deshalb kann eine eisige Gegend zu derselben Landschaftsgruppe gehören wie eine heiße.",
      "fact": "Kamele lagern Fett in ihren Höckern, kein Trinkwasser.",
      "starter": "Eine Wüste ist sehr trocken. Sie kann heiß oder kalt sein.",
      "deeper": "Trockenheit und Temperatur sind verschiedene Größen. Die Bezeichnung Kältewüste verbindet beide, ohne sie gleichzusetzen.",
      "whyItMatters": "Du kannst eine Kategorie an ihrem Merkmal erkennen, statt an einem typischen Bild.",
      "observe": "Wähle im Schaubild heiße Wüste und Kältewüste. Nenne das gemeinsame Merkmal und einen wichtigen Unterschied. Kannst du aus dem Bild allein die jährliche Niederschlagsmenge ablesen?",
      "sourceIds": [
        "nature-dry-deserts",
        "nature-antarctic-precipitation",
        "nature-camel-hump"
      ]
    },
    {
      "title": "Norden und Süden unterscheiden",
      "text": "Eisbären leben in der Arktis im Norden. Viele Pinguinarten leben im Süden, einige sogar nahe am Äquator. Pinguine und Eisbären treffen sich in der freien Natur nicht. Am Südpol liegt Land unter dem Eis; am Nordpol liegt Meer.\n\nNorden und Süden sind keine austauschbaren Eiswelten. Der Nordpol liegt über Meer, der Südpol auf einem Kontinent. Auch Pinguinarten leben in unterschiedlichen Regionen.",
      "fact": "Nicht jeder Pinguin lebt in Schnee und Eis.",
      "starter": "Eisbären und Pinguine leben nicht gemeinsam in der freien Natur.",
      "deeper": "Ein Tier auf einer Illustration muss nicht dort leben, wo die Dekoration Schnee zeigt. Prüfe die Verbreitungsangabe der jeweiligen Art.",
      "whyItMatters": "Du kannst ein schönes Bild von einer richtigen Verbreitungskarte unterscheiden.",
      "observe": "Finde Eisbär und Kaiserpinguin in der Tierwelt. Vergleiche ihre Beispielorte und prüfe, ob beide Punkte dieselbe Region zeigen.",
      "sourceIds": [
        "nature-polar-foundations",
        "nature-emperor-coast",
        "nature-polar-bear-range",
        "nature-penguin-regions"
      ]
    },
    {
      "title": "Alle hängen zusammen",
      "text": "Pflanzen nutzen Sonnenlicht, um Nahrung aufzubauen. Manche Tiere fressen Pflanzen, andere Tiere fressen Tiere. Pilze und kleine Lebewesen bauen abgestorbene Reste ab. Solche Beziehungen bilden Nahrungsnetze. Verschwindet eine Art, kann das andere Arten beeinflussen.\n\nEine Kette zeigt einen Weg; ein Netz zeigt mehrere Beziehungen. Ein Tier kann verschiedene Nahrung nutzen und selbst Nahrung für mehrere andere Arten sein.",
      "fact": "Artenvielfalt ist ein Teil der biologischen Vielfalt. Dazu gehören auch Unterschiede innerhalb von Arten und die Vielfalt der Lebensräume.",
      "starter": "Pflanzen, Tiere, Pilze und kleine Lebewesen hängen in Nahrungsnetzen zusammen.",
      "deeper": "Zersetzer bauen Reste ab; das ist kein überflüssiger Abfallweg. Eine vereinfachte Zeichnung enthält trotzdem nicht jedes Lebewesen eines Lebensraums.",
      "whyItMatters": "Du erkennst, weshalb eine Veränderung mehrere Arten betreffen kann.",
      "observe": "Zeichne ein kleines Nahrungsnetz aus passenden Arten der Tierwelt. Erkläre: Deine Pfeile zeigen von der Nahrung zum Fresser. Ergänze Sonnenlicht mit einem anders gezeichneten Pfeil zur Pflanze; Licht ist keine gefressene Nahrung.",
      "sourceIds": [
        "nature-foodweb-energy",
        "nature-biological-diversity"
      ]
    }
  ],
  "question": {
    "id": "journey-nature",
    "category": "Natur",
    "question": "Was macht eine Wüste zur Wüste?",
    "answers": [
      "Wenig Niederschlag",
      "Immer große Hitze",
      "Dass dort Sand liegt"
    ],
    "correct": 0,
    "why": "Wüsten sind sehr trocken. Es gibt heiße und kalte Wüsten, auch ohne große Sandflächen."
  },
  "activity": "Suche vom Weg aus drei verschiedene Lebewesen in deiner Umgebung. Beobachte sie, ohne sie zu stören oder mitzunehmen."
},
  {
  "id": "protect",
  "title": "Wir passen auf die Erde auf",
  "intro": "Kleine Ideen, große Gemeinschaftsaufgabe.",
  "icon": "heart",
  "color": "green",
  "minutes": 7,
  "source": "https://science.nasa.gov/kids/earth/what-is-the-greenhouse-effect/",
  "sourceName": "NASA Kids · Treibhauseffekt",
  "steps": [
    {
      "title": "Eine hilfreiche Wärmedecke",
      "text": "Bestimmte Gase in der Atmosphäre halten einen Teil der Wärme zurück, die die Erde ins Weltall abgibt. Das nennt man Treibhauseffekt. Ohne den natürlichen Treibhauseffekt wäre unsere Erde viel kälter. Die Lufthülle ist dabei keine echte Decke.\n\nSonnenlicht und die von der Erde abgegebene Wärme sind nicht derselbe Vorgang. Das Deckenbild hilft beim ersten Verstehen, erklärt aber nicht alles, was Strahlung und Gase tun.",
      "fact": "Wasserdampf, Kohlendioxid und Methan gehören zu den Treibhausgasen.",
      "starter": "Treibhausgase halten einen Teil der abgegebenen Wärme zurück. Die Luft ist keine echte Decke.",
      "deeper": "Ein Vergleich muss Grenzen haben. Die Atmosphäre hat keine Stoffdecke und hält auch nicht sämtliche Wärme fest.",
      "whyItMatters": "Du erkennst eine hilfreiche Erklärung, ohne ihren Vergleich wörtlich zu nehmen.",
      "observe": "Zeichne Licht zur Erde und Wärme von der Erde weg als verschiedene Pfeile. Beschreibe, welchen Teil der zweite Pfeil vereinfacht.",
      "sourceIds": [
        "protect-base",
        "protect-energy-balance"
      ]
    },
    {
      "title": "Die zusätzliche Erwärmung",
      "text": "Menschen verbrennen Kohle, Erdöl und Erdgas. Dabei kommt zusätzliches Kohlendioxid in die Luft. Auch andere Tätigkeiten verstärken den Treibhauseffekt. Die Erde wird im Durchschnitt wärmer. Das verändert unter anderem Eis, Meere und Lebensräume.\n\nDurchschnittlich wärmer bedeutet nicht an jedem Ort jeden Tag wärmer. Wetter bleibt wechselhaft, während sich langfristige Bedingungen verändern. Erwachsene und Einrichtungen müssen dafür Verantwortung übernehmen.",
      "fact": "Das ist eine Aufgabe für Erwachsene, Unternehmen und Länder gemeinsam. Du musst die Welt nicht allein retten.",
      "starter": "Zusätzliche Treibhausgase erwärmen die Erde. Lösungen sind eine gemeinsame Aufgabe.",
      "deeper": "Eine einzelne Handlung erklärt nicht den gesamten Klimawandel. Energieversorgung, Verkehr und weitere Tätigkeiten hängen in großen Systemen zusammen.",
      "whyItMatters": "Du verstehst einen globalen Zusammenhang, ohne dir allein die ganze Verantwortung aufzubürden.",
      "observe": "Vergleiche die Erklärung mit dem Wetter-Kapitel. Formuliere eine Frage, die du Erwachsenen zum Umgang mit Energie stellen möchtest.",
      "sourceIds": [
        "protect-base",
        "protect-energy-balance"
      ]
    },
    {
      "title": "Weniger verschwenden",
      "text": "Dinge herstellen, transportieren und wegwerfen braucht Material und Energie. Etwas länger benutzen, reparieren, ausleihen oder weitergeben kann Ressourcen sparen. Mehrwegflaschen sind dafür ein Beispiel. Recycling hilft auch, kann aber nicht jede Art von Abfall lösen.\n\nEine Sache länger zu nutzen kann verhindern, dass gleich eine neue hergestellt werden muss. Recycling beginnt erst später und ist nicht für jedes Material gleich gut möglich.",
      "fact": "Bevor etwas in den Müll kommt, kannst du fragen: Kann es jemand noch gebrauchen?",
      "starter": "Reparieren, ausleihen und weitergeben können Materialien sparen.",
      "deeper": "Vergleiche müssen den ganzen Weg betrachten: Herstellung, Nutzung, Transport und Entsorgung. Ein einzelnes grünes Zeichen beantwortet nicht alle Fragen.",
      "whyItMatters": "Du findest konkrete Möglichkeiten, ohne jede Sache sofort durch etwas Neues zu ersetzen.",
      "observe": "Wähle gemeinsam eine ungenutzte heile Sache. Vergleicht Weitergeben, Ausleihen und Aufbewahren anhand eurer wirklichen Situation.",
      "sourceIds": [
        "protect-reuse-resources"
      ]
    },
    {
      "title": "Natur Platz geben",
      "text": "Pflanzen und Tiere brauchen passende Lebensräume. Müll gehört nicht in die Natur. Blüten können Insekten Nahrung bieten. Wilde Tiere beobachten wir mit Abstand. Schon ein kleiner Garten oder Balkon kann zusammen mit Erwachsenen etwas für die Natur bieten.\n\nEine Blüte kann Nahrung bieten; ein ruhiger Platz kann Schutz geben. Hilfe heißt deshalb nicht immer anfassen oder mitnehmen. Manche Tiere brauchen vor allem Abstand.",
      "fact": "Ein Tier in Ruhe zu lassen, ist oft die beste Hilfe.",
      "starter": "Pflanzen und Tiere brauchen Platz. Wir können sie beobachten, ohne sie zu stören.",
      "deeper": "Ein Balkon ersetzt keinen ganzen Lebensraum. Kleine Beiträge können dennoch nützlich sein, wenn sie zu den örtlichen Arten und Bedingungen passen.",
      "whyItMatters": "Du verbindest Naturschutz mit den Bedürfnissen von Lebewesen.",
      "observe": "Beobachte mit Abstand eine Blüte oder einen Baum. Welche Nutzung kannst du tatsächlich sehen? Stelle keine unbekannten Pflanzen oder Tiere um.",
      "sourceIds": [
        "protect-pollinator-habitat",
        "protect-wildlife-distance"
      ]
    },
    {
      "title": "Gemeinsam etwas bewegen",
      "text": "Du kannst Ideen sammeln, Fragen stellen und mit Erwachsenen kleine Vorhaben ausprobieren. Zum Beispiel Wege zu Fuß zurücklegen, unnötiges Licht ausschalten oder Lebensmittel gut nutzen. Welche Lösung sinnvoll ist, hängt von der Situation ab.\n\nEine Lösung passt zu einem konkreten Problem. Zu Fuß gehen kann für einen kurzen sicheren Weg sinnvoll sein; eine andere Strecke braucht eine andere Entscheidung. Fragen helfen mehr als pauschale Vorwürfe.",
      "fact": "Niemand macht alles perfekt. Lernen und gemeinsam ausprobieren zählen.",
      "starter": "Gute Ideen entstehen gemeinsam. Niemand muss alles perfekt machen.",
      "deeper": "Ein persönliches Beispiel ist keine vollständige Lösung für Gesellschaft und Wirtschaft. Es kann zeigen, welche Bedingungen eine gute Entscheidung braucht.",
      "whyItMatters": "Du kannst Verantwortung gemeinsam und ohne Schuldgefühl besprechen.",
      "observe": "Überlegt mit einem Erwachsenen eine kleine machbare Änderung. Notiert den Nutzen und eine Bedingung, unter der eure Idee nicht passen würde.",
      "sourceIds": [
        "protect-reuse-resources",
        "protect-wildlife-distance"
      ]
    }
  ],
  "question": {
    "id": "journey-protect",
    "category": "Erde schützen",
    "question": "Dein Spielzeug ist heil, aber du nutzt es nicht mehr. Was ist eine gute Idee?",
    "answers": [
      "Sofort wegwerfen",
      "Weitergeben oder tauschen",
      "Im Wald liegen lassen"
    ],
    "correct": 1,
    "why": "Weitergeben und Tauschen helfen, Dinge länger zu nutzen und weniger Neues herstellen zu müssen."
  },
  "activity": "Finde mit einem Erwachsenen eine Sache, die ihr reparieren, ausleihen oder weitergeben könnt."
}
];

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
  ["Grundwasser","Wasser","Wasser unter der Erdoberfläche in Poren und Spalten von Boden und Gestein. Es ist meist kein großer unterirdischer See."],
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
  ["Nordpol","Weltkugel","Das nördliche Ende der Erdachse. Er liegt im Arktischen Ozean auf Meereis."],
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

export const JOURNEYS=[...BASE_JOURNEYS,...MORE_JOURNEYS];
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
