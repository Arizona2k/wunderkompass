import { JOURNEYS } from "./learning-data";
import COUNTRY_META from "./country-metadata.json" with {type:"json"};
import { EXTRA_QUESTIONS } from "./quiz-data";
export type Mode = "globe" | "layers" | "day" | "quiz" | "journeys" | "games" | "book" | "labs" | "world";
export type MapProperties = { id: string; name: string; continent: string; iso: string; lat: number; lon: number; type: string };
export type Country = { type: "Feature"; id?: string; properties: MapProperties; geometry: {type: "Polygon"; coordinates: number[][][]} | {type: "MultiPolygon"; coordinates: number[][][][]} };
export type Place = { id: string; name: string; kind: "country" | "continent" | "ocean" | "line" | "nature"; lat: number; lon: number; text: string; fact: string; color?: string; capital?: string; iso?: string; label?: string; population?: number; populationYear?: number; area?: number; areaYear?: number; languages?:string[];currencies?:string[];isState?:boolean };
export type Layer = { id: string; name: string; color: string; tag: string; text: string; fact: string; depth: string; radius: number };

export const CONTINENTS: Place[] = [
  { id: "Europe", name: "Europa", kind: "continent", lat: 51, lon: 20, color: "#80d4ae", text: "Europa ist einer der sieben Kontinente in unserem Modell. Hier liegt Deutschland. Viele Länder sind Nachbarn und haben unterschiedliche Sprachen.", fact: "Europa und Asien hängen zusammen. Gemeinsam nennt man diese große Landfläche Eurasien." },
  { id: "Africa", name: "Afrika", kind: "continent", lat: 4, lon: 20, color: "#efc979", text: "Afrika liegt auf beiden Seiten des Äquators. Hier gibt es Wüsten, Regenwälder und weite Graslandschaften.", fact: "Die Sahara liegt im Norden Afrikas. Sie ist die größte heiße Wüste der Erde." },
  { id: "Asia", name: "Asien", kind: "continent", lat: 42, lon: 88, color: "#82bc99", text: "Asien ist der größte Kontinent. Hier liegen zum Beispiel China, Indien, Japan und Iran.", fact: "Der Mount Everest liegt in Asien. Er ist der höchste Berg über dem Meeresspiegel." },
  { id: "North America", name: "Nordamerika", kind: "continent", lat: 43, lon: -105, color: "#80cfae", text: "Nordamerika liegt größtenteils auf der Nordhalbkugel. Dazu gehören zum Beispiel Kanada, die USA und Mexiko.", fact: "Auch die große Insel Grönland gehört geografisch zu Nordamerika." },
  { id: "South America", name: "Südamerika", kind: "continent", lat: -19, lon: -59, color: "#b2d58b", text: "Südamerika liegt zum größten Teil südlich des Äquators. Hier findest du die Anden, eine lange Gebirgskette.", fact: "Der Amazonas fließt durch Südamerika. Um ihn wächst ein riesiger Regenwald." },
  { id: "Oceania", name: "Australien / Ozeanien", label: "Australien", kind: "continent", lat: -25, lon: 135, color: "#d7c38a", text: "Australien ist der kleinste Kontinent in unserem Modell. Mit Neuseeland und vielen Inseln im Pazifik gehört es zur Weltregion Ozeanien.", fact: "Australien ist der Name eines Landes und auch eines Kontinents." },
  { id: "Antarctica", name: "Antarktika", kind: "continent", lat: -77, lon: 0, color: "#e9f6fa", text: "Antarktika ist der Kontinent am Südpol. Eine riesige Eisschicht bedeckt fast das ganze Land.", fact: "Pinguine leben auf der Südhalbkugel. Eisbären leben in der Arktis im Norden. In der Natur treffen sie sich also nicht." },
];

// Country groupings cannot represent every geographic continent boundary.
export const CONTINENT_MEMBERSHIPS:Record<string,string[]>={RU:['Europe','Asia'],TR:['Europe','Asia'],KZ:['Europe','Asia'],EG:['Africa','Asia'],ID:['Asia','Oceania']};

export const OCEANS: Place[] = [
  { id: "atlantic", name: "Atlantischer Ozean", label: "Atlantik", kind: "ocean", lat: 22, lon: -37, text: "Der Atlantik liegt zwischen Amerika im Westen und Europa und Afrika im Osten. Alle Ozeane sind miteinander verbunden.", fact: "Wenn du von Europa nach Amerika über das Meer reist, überquerst du oft den Atlantik." },
  { id: "pacific", name: "Pazifischer Ozean", label: "Pazifik", kind: "ocean", lat: 6, lon: -145, text: "Der Pazifik ist der größte Ozean. Er liegt zwischen Amerika, Asien und Australien.", fact: "Im Pazifik liegt der Marianengraben. Er ist an seiner tiefsten Stelle fast 11 Kilometer tief." },
  { id: "indian", name: "Indischer Ozean", kind: "ocean", lat: -17, lon: 75, text: "Der Indische Ozean liegt zwischen Afrika, Asien und Australien. Im Norden grenzt er an Indien.", fact: "In warmem Meerwasser wachsen Korallenriffe. Sie bieten vielen Meerestieren ein Zuhause." },
  { id: "arctic", name: "Arktischer Ozean", kind: "ocean", lat: 82, lon: -20, text: "Der Arktische Ozean umgibt den Nordpol. Er ist der kleinste der fünf Ozeane und teilweise von Meereis bedeckt.", fact: "Am Nordpol liegt Meer unter dem Eis. Am Südpol liegt ein Kontinent unter dem Eis." },
  { id: "southern", name: "Südlicher Ozean", kind: "ocean", lat: -62, lon: 85, text: "Der Südliche Ozean umgibt die Antarktis. In diesem kalten Wasser leben zum Beispiel Wale, Robben und winziger Krill.", fact: "Wir unterscheiden fünf Ozeane. Zusammen bilden sie ein einziges großes Weltmeer." },
  { id: "mediterranean", name: "Mittelmeer", kind: "ocean", lat: 35, lon: 18, text: "Das Mittelmeer liegt zwischen Europa, Afrika und Asien. Es ist ein kleineres Meer und gehört zum Atlantik.", fact: "Die schmale Straße von Gibraltar verbindet das Mittelmeer mit dem Atlantik." },
  { id: "north-sea", name: "Nordsee", kind: "ocean", lat: 56, lon: 3, text: "Die Nordsee liegt im Norden Europas. Auch Deutschland hat eine Küste an der Nordsee.", fact: "An vielen Küsten der Nordsee steigt und sinkt das Wasser regelmäßig. Das nennt man Ebbe und Flut." },
  { id: "red-sea", name: "Rotes Meer", kind: "ocean", lat: 21, lon: 38, text: "Das Rote Meer liegt zwischen Afrika und der Arabischen Halbinsel. Es ist mit dem Indischen Ozean verbunden.", fact: "Trotz seines Namens sieht sein Wasser meistens blau aus." },
  {id:"baltic",name:"Ostsee",kind:"ocean",lat:57,lon:19,text:"Die Ostsee liegt in Nordeuropa. Sie ist über schmale Wasserstraßen mit der Nordsee verbunden.",fact:"Ihr Wasser enthält weniger Salz als das offene Weltmeer: Viele Flüsse bringen Süßwasser hinein."},
  {id:"caribbean",name:"Karibisches Meer",kind:"ocean",lat:16,lon:-75,text:"Die Karibik liegt zwischen Mittelamerika, Südamerika und vielen Inseln. Sie gehört zum Atlantik.",fact:"Eine Inselgruppe nennt man auch Archipel."},
  {id:"arabian",name:"Arabisches Meer",kind:"ocean",lat:16,lon:64,text:"Dieses Meer liegt zwischen der Arabischen Halbinsel und Indien. Es ist Teil des Indischen Ozeans.",fact:"Eine Halbinsel ist mit größerem Land verbunden und auf vielen Seiten von Wasser umgeben."},
  {id:"bay-bengal",name:"Bucht von Bengalen",kind:"ocean",lat:15,lon:88,text:"Diese große Meeresbucht liegt östlich von Indien im Indischen Ozean.",fact:"Große Flüsse wie Ganges und Brahmaputra bringen Wasser und Sedimente in diese Region."},
  {id:"coral-sea",name:"Korallenmeer",kind:"ocean",lat:-19,lon:154,text:"Das Korallenmeer liegt nordöstlich von Australien und gehört zum Pazifik.",fact:"Das Great Barrier Reef liegt an seiner Westseite vor Australien."},
  {id:"bering",name:"Beringmeer",kind:"ocean",lat:57,lon:-176,text:"Das Beringmeer liegt zwischen Alaska und dem Osten Russlands. Es gehört zum Pazifik.",fact:"Die schmale Beringstraße verbindet die Regionen des Pazifiks und des Arktischen Ozeans."},
  {id:"gulf-mexico",name:"Golf von Mexiko",kind:"ocean",lat:25,lon:-90,text:"Diese große Meeresbucht liegt zwischen den USA, Mexiko und Kuba und ist mit dem Atlantik verbunden.",fact:"Golf ist eine Bezeichnung für eine große Meeresbucht. Die Bezeichnung Golf von Mexiko wird international verwendet."},

];

export const LINES: Place[] = [
  { id: "equator", name: "Äquator", kind: "line", lat: 0, lon: 15, text: "Der Äquator ist eine gedachte Linie um die Mitte der Erde. Er teilt sie in die Nordhalbkugel und die Südhalbkugel.", fact: "Auf dem Äquator ist der Breitengrad 0°. Die orange Linie ist nur im Modell sichtbar, nicht draußen auf der Erde." },
  { id: "north-pole", name: "Nordpol", kind: "line", lat: 90, lon: 0, text: "Der Nordpol liegt ganz im Norden. Hier verläuft das nördliche Ende der gedachten Erdachse.", fact: "Am Nordpol treffen alle Längengrade zusammen. Unter dem Eis liegt der Arktische Ozean." },
  { id: "south-pole", name: "Südpol", kind: "line", lat: -90, lon: 0, text: "Der Südpol liegt ganz im Süden auf dem Kontinent Antarktika. Hier verläuft das südliche Ende der gedachten Erdachse.", fact: "Am Südpol dauert ein Tag oder eine Nacht ungefähr ein halbes Jahr." },
  {id:"prime-meridian",name:"Nullmeridian",kind:"line",lat:30,lon:0,text:"Der Nullmeridian ist die vereinbarte Linie für 0° Länge. Er läuft durch Greenwich in London.",fact:"Längengrade helfen beim Finden von Orten. Ihre Linien treffen sich an den Polen."},
  {id:"tropic-north",name:"Nördlicher Wendekreis",kind:"line",lat:23.4,lon:30,text:"Der nördliche Wendekreis liegt etwa 23,4° nördlich des Äquators.",fact:"Hier kann die Sonne um die Juni-Sonnenwende mittags genau über einem Ort stehen."},
  {id:"tropic-south",name:"Südlicher Wendekreis",kind:"line",lat:-23.4,lon:30,text:"Der südliche Wendekreis liegt etwa 23,4° südlich des Äquators.",fact:"Hier kann die Sonne um die Dezember-Sonnenwende mittags genau über einem Ort stehen."},
  {id:"arctic-circle",name:"Nördlicher Polarkreis",kind:"line",lat:66.6,lon:25,text:"Der nördliche Polarkreis liegt ungefähr 66,6° nördlich des Äquators.",fact:"Nördlich davon kann die Sonne im Sommer mindestens einen ganzen Tag sichtbar sein. Im Winter gibt es Orte mit Polarnacht."},
  {id:"antarctic-circle",name:"Südlicher Polarkreis",kind:"line",lat:-66.6,lon:25,text:"Der südliche Polarkreis liegt ungefähr 66,6° südlich des Äquators.",fact:"Südlich davon gibt es im Südsommer Tage ohne Sonnenuntergang und im Südwinter Polarnacht. An den Polen dauert es besonders lange."},

];

export const LAYERS: Layer[] = [
  { id: "crust", name: "Erdkruste", color: "#3fb5a0", tag: "Fest · ganz außen", radius: 1, depth: "Etwa 5–70 km dick", text: "Die Erdkruste ist die dünne, feste Außenhaut der Erde. Auf ihr stehen wir. Auch unter den Ozeanen gibt es Erdkruste.", fact: "Wie die Schale eines Apfels ist die Kruste im Vergleich zur ganzen Erde sehr dünn. Im Modell ist sie dicker, damit du sie gut sehen kannst." },
  { id: "mantle", name: "Erdmantel", color: "#ed8241", tag: "Überwiegend fest · sehr heiß", radius: .965, depth: "Bis etwa 2.900 km Tiefe", text: "Unter der Kruste liegt der Erdmantel. Er besteht überwiegend aus festem Gestein. Wegen der großen Hitze kann es sich über sehr lange Zeit langsam verformen und bewegen.", fact: "Der Erdmantel ist kein riesiger See aus Lava. Nur an manchen Stellen schmilzt ein kleiner Teil des Gesteins." },
  { id: "outer-core", name: "Äußerer Erdkern", color: "#f4bc43", tag: "Flüssig · vor allem Metall", radius: .546, depth: "Etwa 2.900–5.150 km Tiefe", text: "Der äußere Erdkern besteht vor allem aus flüssigem Eisen und etwas Nickel. Das heiße Metall bewegt sich.", fact: "Die Bewegung des flüssigen Metalls hilft, das Magnetfeld der Erde zu erzeugen. Es lenkt viele geladene Teilchen von der Sonne ab." },
  { id: "inner-core", name: "Innerer Erdkern", color: "#fff1a2", tag: "Fest · im Mittelpunkt", radius: .191, depth: "Etwa 5.150–6.371 km Tiefe", text: "Ganz innen liegt der innere Erdkern. Er besteht vor allem aus Eisen. Obwohl es dort sehr heiß ist, ist er fest.", fact: "Der riesige Druck im Inneren verhindert, dass das Metall einfach schmilzt." },
];

const COUNTRY_DETAILS: Record<string, {capital: string; text: string; fact: string}> = {
  RU: { capital: "Moskau", text: "Russland liegt in Europa und Asien. Es ist nach seiner Fläche das größte Land der Erde.", fact: "Ein Land kann sich über mehrere Kontinente erstrecken. Kontinentgrenzen und Ländergrenzen sind also nicht immer dasselbe." },
  DE: { capital: "Berlin", text: "Deutschland liegt in Europa. Im Norden gibt es Küsten an der Nordsee und Ostsee, im Süden hohe Berge in den Alpen.", fact: "Deutschland hat neun Nachbarländer. Schau auf der Kugel nach, ob du einige davon findest." },
  FR: { capital: "Paris", text: "Frankreich liegt in Europa und grenzt an Deutschland. In seiner Hauptstadt Paris steht der Eiffelturm.", fact: "Ein Teil der Alpen liegt in Frankreich. Dort befindet sich der Mont Blanc." },
  IT: { capital: "Rom", text: "Italien liegt in Südeuropa am Mittelmeer. Auf der Karte sieht seine lange Halbinsel wie ein Stiefel aus.", fact: "In Italien gibt es aktive Vulkane, zum Beispiel den Ätna auf Sizilien." },
  ES: { capital: "Madrid", text: "Spanien liegt im Südwesten Europas. Es teilt sich die Iberische Halbinsel mit Portugal.", fact: "Spanien hat Küsten am Atlantik und am Mittelmeer." },
  GB: { capital: "London", text: "Das Vereinigte Königreich liegt auf Inseln vor der Küste Europas. England ist ein Teil dieses Landes.", fact: "Zum Vereinigten Königreich gehören England, Schottland, Wales und Nordirland." },
  PL: { capital: "Warschau", text: "Polen liegt in Europa und ist ein östliches Nachbarland Deutschlands. Im Norden liegt die Ostsee.", fact: "Die Weichsel ist ein großer Fluss in Polen. Sie fließt durch Warschau bis zur Ostsee." },
  GR: { capital: "Athen", text: "Griechenland liegt im Süden Europas. Es hat viele Inseln und eine lange Küste am Mittelmeer.", fact: "Die Olympischen Spiele der Antike fanden in Griechenland statt." },
  CY: { capital: "Nikosia", text: "Zypern ist eine Insel im östlichen Mittelmeer. Auf der Kugel liegt sie südlich der Türkei.", fact: "Eine Insel ist ein Stück Land, das rundherum von Wasser umgeben ist." },
  TR: { capital: "Ankara", text: "Die Türkei liegt in Asien und Europa. Der größere Teil des Landes befindet sich in Asien.", fact: "Die Stadt Istanbul liegt an einer Meerenge zwischen Europa und Asien." },
  IR: { capital: "Teheran", text: "Iran liegt in Asien. Hier gibt es hohe Berge, große Wüsten und Küsten am Kaspischen Meer und am Persischen Golf.", fact: "Die Landessprache heißt Persisch. Sie wird von rechts nach links geschrieben." },
  IN: { capital: "Neu-Delhi", text: "Indien liegt im Süden Asiens. Das Land ragt wie ein großes Dreieck in den Indischen Ozean.", fact: "Im Norden Indiens liegt ein Teil des Himalaya, eines sehr hohen Gebirges." },
  CN: { capital: "Peking", text: "China liegt in Asien. Das große Land hat Berge, Wüsten, Wälder und eine lange Küste am Pazifik.", fact: "Große Pandas stammen aus China. Sie fressen vor allem Bambus." },
  JP: { capital: "Tokio", text: "Japan liegt in Asien und besteht aus vielen Inseln im Pazifik. Der Fuji ist ein bekannter Vulkan.", fact: "Ein Land kann aus mehreren Inseln bestehen. Es muss nicht eine einzige zusammenhängende Landfläche sein." },
  EG: { capital: "Kairo", text: "Ägypten liegt größtenteils in Afrika. Der Nil fließt durch das Land und mündet ins Mittelmeer.", fact: "Die alten Ägypter bauten die berühmten Pyramiden von Gizeh." },
  KE: { capital: "Nairobi", text: "Kenia liegt in Ostafrika. Der Äquator verläuft durch das Land.", fact: "In Kenias Savannen leben unter anderem Elefanten, Giraffen und Löwen." },
  ZA: { capital: "Pretoria, Kapstadt und Bloemfontein", text: "Südafrika liegt an der Südspitze Afrikas. Hier treffen die Regionen des Atlantiks und des Indischen Ozeans aufeinander.", fact: "Südafrika hat drei Hauptstädte mit verschiedenen Aufgaben." },
  MA: { capital: "Rabat", text: "Marokko liegt im Nordwesten Afrikas. Es hat Küsten am Atlantik und am Mittelmeer.", fact: "Zwischen Marokko und Spanien liegt die schmale Straße von Gibraltar." },
  US: { capital: "Washington, D.C.", text: "Die USA liegen in Nordamerika. Das große Land hat Küsten am Atlantik und am Pazifik.", fact: "Alaska liegt weit im Norden und Hawaii besteht aus Inseln im Pazifik. Beide gehören zu den USA." },
  CA: { capital: "Ottawa", text: "Kanada liegt im Norden Nordamerikas. Es gibt große Wälder, viele Seen und kalte Regionen in der Arktis.", fact: "In Kanada sind Englisch und Französisch Amtssprachen." },
  MX: { capital: "Mexiko-Stadt", text: "Mexiko liegt in Nordamerika, südlich der USA. Es hat Küsten am Pazifik und am Golf von Mexiko.", fact: "In Mexiko stehen alte Pyramiden, die von Völkern wie den Maya und Azteken gebaut wurden." },
  BR: { capital: "Brasília", text: "Brasilien ist das größte Land Südamerikas. Der Äquator verläuft durch den Norden des Landes.", fact: "Ein großer Teil des Amazonas-Regenwaldes liegt in Brasilien. Die Amtssprache ist Portugiesisch." },
  AR: { capital: "Buenos Aires", text: "Argentinien liegt im Süden Südamerikas. Im Westen liegen die Anden, im Osten der Atlantik.", fact: "Der Süden Argentiniens gehört zur Landschaft Patagonien. Dort gibt es große Gletscher." },
  PE: { capital: "Lima", text: "Peru liegt an der Westküste Südamerikas. Hier gibt es die Anden und einen Teil des Amazonas-Regenwaldes.", fact: "In den Bergen Perus liegt die alte Inka-Stadt Machu Picchu." },
  AU: { capital: "Canberra", text: "Australien ist ein Land und ein Kontinent. Es liegt auf der Südhalbkugel zwischen dem Indischen Ozean und dem Pazifik.", fact: "Kängurus und Koalas leben ursprünglich in Australien. Die Hauptstadt ist Canberra, nicht Sydney." },
  NZ: { capital: "Wellington", text: "Neuseeland liegt südöstlich von Australien im Pazifik. Es besteht unter anderem aus zwei großen Inseln.", fact: "Der Kiwi ist ein Vogel, der in Neuseeland lebt und nicht fliegen kann." },
  NO: { capital: "Oslo", text: "Norwegen liegt im Norden Europas. Das Land hat eine lange Küste mit tiefen Meeresbuchten, den Fjorden.", fact: "Weit im Norden Norwegens geht die Sonne im Sommer eine Zeit lang nicht unter." },
};

const countryCache=new WeakMap<Country,Place>();
export function countryPlace(country: Country): Place {
  const cached=countryCache.get(country);if(cached)return cached;
  const p = country.properties;
  const continent = CONTINENTS.find(c => c.id === p.continent);
  const regions=(CONTINENT_MEMBERSHIPS[p.iso]??[p.continent]).map(id=>CONTINENTS.find(c=>c.id===id)?.name??id);
  const details = ["Country","Sovereign country"].includes(p.type)?COUNTRY_DETAILS[p.iso]:undefined;
  let minLat=90,maxLat=-90;
  if(!details){const polygons=country.geometry.type==="Polygon"?[country.geometry.coordinates]:country.geometry.coordinates;for(const polygon of polygons)for(const ring of polygon)for(const point of ring){minLat=Math.min(minLat,point[1]);maxLat=Math.max(maxLat,point[1]);}}
  const position=minLat<0&&maxLat>0?"auf beiden Seiten des Äquators":minLat>=0?"nördlich des Äquators":"südlich des Äquators";
  const meta=(COUNTRY_META as Record<string,{capital:string;population:number;populationYear:number;area:number|null;areaYear:number;languages:string[];currencies:string[];isState:boolean;ownIso:boolean}>)[p.id];
  const place:Place = { isState:meta?.isState,languages:meta?.languages,currencies:meta?.currencies,population:meta?.population,populationYear:meta?.populationYear,area:meta?.area??undefined,areaYear:meta?.areaYear, id: p.id, name: p.name, kind: "country", lat: p.lat, lon: p.lon, iso: meta?.ownIso?p.iso:undefined, capital: details?.capital||meta?.capital||undefined,
    text: details?.text ?? `${p.name} liegt ${regions.length>1?"in den Weltregionen "+regions.join(" und "):"in der Weltregion "+(continent?.name??p.continent)}. Die helle Umrandung auf der Kugel zeigt dir seine Lage.`,
    fact: details?.fact ?? `${p.name} liegt ${position}. Schau nach, welche Länder oder Meere in der Nähe liegen.` };
  countryCache.set(country,place);return place;
}

export type QuizQuestion = { id: string; category: "Weltkugel" | "Erdschichten" | "Länder" | "Wasser & Wetter" | "Jahreszeiten" | "Natur" | "Erde schützen"; question: string; answers: string[]; correct: number; why: string };
const BASE_QUESTIONS: QuizQuestion[] = [
  { id: "equator", category: "Weltkugel", question: "Wie heißt die gedachte Linie um die Mitte der Erde?", answers: ["Äquator", "Nordpol", "Erdkern"], correct: 0, why: "Der Äquator teilt die Erde in die Nordhalbkugel und die Südhalbkugel." },
  { id: "outer", category: "Erdschichten", question: "Welche Schicht besteht vor allem aus flüssigem Metall?", answers: ["Erdkruste", "Äußerer Erdkern", "Erdmantel"], correct: 1, why: "Im äußeren Erdkern ist das Metall flüssig. Der innere Erdkern ist dagegen fest." },
  { id: "germany", category: "Länder", question: "Auf welchem Kontinent liegt Deutschland?", answers: ["Afrika", "Asien", "Europa"], correct: 2, why: "Deutschland liegt in Europa. Seine Hauptstadt ist Berlin." },
  { id: "day", category: "Weltkugel", question: "Warum gibt es Tag und Nacht?", answers: ["Die Erde dreht sich", "Die Sonne wird ausgeschaltet", "Der Mond verdeckt jeden Abend die Sonne"], correct: 0, why: "Die Erde dreht sich. Die Seite zur Sonne hat Tag, die andere Seite hat Nacht." },
  { id: "crust", category: "Erdschichten", question: "Auf welcher Erdschicht stehen unsere Häuser?", answers: ["Auf dem inneren Kern", "Auf der Erdkruste", "Auf dem äußeren Kern"], correct: 1, why: "Die Erdkruste ist die feste Außenhaut. Auf ihr liegen die Kontinente und die Böden der Ozeane." },
  { id: "ocean", category: "Weltkugel", question: "Welcher Ozean ist der größte?", answers: ["Arktischer Ozean", "Atlantik", "Pazifik"], correct: 2, why: "Der Pazifik ist der größte Ozean und liegt zwischen Amerika, Asien und Australien." },
  { id: "australia", category: "Länder", question: "Welche Tiere stammen aus Australien?", answers: ["Kängurus und Koalas", "Eisbären", "Große Pandas"], correct: 0, why: "Kängurus und Koalas stammen aus Australien. Große Pandas stammen aus China." },
  { id: "mantle", category: "Erdschichten", question: "Wie ist das Gestein im Erdmantel meistens?", answers: ["Kalt und locker", "Fest, aber sehr heiß", "Überall flüssige Lava"], correct: 1, why: "Der Mantel besteht überwiegend aus festem, heißem Gestein. Es kann sich sehr langsam verformen." },
  { id: "water", category: "Weltkugel", question: "Was bedeckt den größeren Teil der Erdoberfläche?", answers: ["Land", "Eis", "Wasser"], correct: 2, why: "Etwa 71 von 100 Teilen der Erdoberfläche sind vom Ozean bedeckt. Die Erde ist ein blauer Planet." },
  { id: "berlin", category: "Länder", question: "Wie heißt die Hauptstadt von Deutschland?", answers: ["Berlin", "Paris", "Rom"], correct: 0, why: "Berlin ist Deutschlands Hauptstadt. Paris liegt in Frankreich und Rom in Italien." },
  { id: "north", category: "Weltkugel", question: "Was liegt unter dem Eis am Nordpol?", answers: ["Ein großer Wald", "Meerwasser", "Eine riesige Stadt"], correct: 1, why: "Der Nordpol liegt im Arktischen Ozean. Unter dem Eis am Südpol liegt dagegen Land." },
  { id: "inner", category: "Erdschichten", question: "Warum ist der innere Erdkern trotz Hitze fest?", answers: ["Er besteht aus Eis", "Dort gibt es keine Hitze", "Der Druck ist riesig"], correct: 2, why: "Im Mittelpunkt der Erde ist der Druck so groß, dass das Metall fest bleibt." },
  { id: "italy", category: "Länder", question: "Welches Land sieht auf der Karte wie ein Stiefel aus?", answers: ["Italien", "Kanada", "Japan"], correct: 0, why: "Italiens lange Halbinsel sieht aus wie ein Stiefel, der ins Mittelmeer ragt." },
  { id: "continents", category: "Weltkugel", question: "Wie viele Kontinente zeigt unser Lernmodell?", answers: ["Drei", "Sieben", "Zwölf"], correct: 1, why: "Unser Modell zeigt Europa, Asien, Afrika, Nordamerika, Südamerika, Australien und Antarktika." },
  { id: "japan", category: "Länder", question: "Welches Land besteht aus vielen Inseln im Pazifik?", answers: ["Deutschland", "Ägypten", "Japan"], correct: 2, why: "Japan ist ein Inselstaat in Asien. Auf der Weltkugel liegt es östlich von China." },
  { id: "core-order", category: "Erdschichten", question: "Welche Schicht liegt ganz in der Mitte?", answers: ["Innerer Erdkern", "Erdkruste", "Erdmantel"], correct: 0, why: "Von außen nach innen: Erdkruste, Erdmantel, äußerer Kern, innerer Kern." },
  { id: "africa", category: "Länder", question: "Auf welchem Kontinent liegt Ägypten größtenteils?", answers: ["Europa", "Afrika", "Südamerika"], correct: 1, why: "Ägypten liegt größtenteils in Afrika. Der Nil fließt dort ins Mittelmeer." },
  { id: "five", category: "Weltkugel", question: "Wie viele Ozeane unterscheiden wir in diesem Modell?", answers: ["Zwei", "Sieben", "Fünf"], correct: 2, why: "Pazifik, Atlantik, Indischer, Arktischer und Südlicher Ozean. Sie sind alle miteinander verbunden." },
];

export const QUESTIONS = [...BASE_QUESTIONS, ...EXTRA_QUESTIONS, ...JOURNEYS.map(j=>j.question)];
export const QUIZ_CATEGORIES = ["Alle Themen", ...new Set(QUESTIONS.map(q=>q.category))];

export function shuffle<T>(items: readonly T[]): T[] {
  const result=[...items];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
}
export function makeQuiz(category = "Alle Themen",difficulty:'easy'|'normal'|'tricky'='normal'): QuizQuestion[] {
  const available = [...new Map(QUESTIONS.filter(q => category === "Alle Themen" || q.category === category).map(q=>[q.question,q])).values()];
  if(difficulty==='easy')return shuffle(available).slice(0,4);
  if(difficulty==='tricky'){
    const reasoning=shuffle(available.filter(q=>/warum|wieso|wie |beweist|verursacht|gehört|verändert|unterschied|vor allem/i.test(q.question)));
    const other=shuffle(available.filter(q=>!reasoning.some(r=>r.id===q.id)));
    return [...reasoning,...other].slice(0,category==='Alle Themen'?8:5);
  }
  return shuffle(available).slice(0, category === "Alle Themen" ? 8 : Math.min(5,available.length));
}


export function flag(iso:string){return /^[A-Z]{2}$/.test(iso)?String.fromCodePoint(...[...iso].map(c=>127397+c.charCodeAt(0))):'🌍';}
