import type { QuizQuestion } from "./earth-data";

type Entry = [string, string, string[], number, string];
const water: Entry[] = [
 ["evaporation","Was passiert, wenn eine Pfütze verdunstet?",["Das Wasser wird zu unsichtbarem Wasserdampf","Das Wasser wird zu Stein","Das Wasser hört auf zu existieren"],0,"Flüssiges Wasser gelangt als unsichtbarer Wasserdampf in die Luft. Es verschwindet nicht aus der Welt."],
 ["clouds","Woraus bestehen sichtbare Wolken?",["Nur aus Rauch","Aus Wassertröpfchen oder Eiskristallen","Aus Watte"],1,"Wasserdampf selbst ist unsichtbar. Sichtbare Wolken bestehen aus winzigen Tröpfchen oder Eiskristallen."],
 ["groundwater","Wo findet man Grundwasser?",["Nur über den Wolken","Nur im Ozean","In Poren und Spalten unter der Erdoberfläche"],2,"Regenwasser kann versickern und sich in Boden und Gestein sammeln."],
 ["freshwater","Was bedeutet Süßwasser?",["Wasser mit wenig Salz","Wasser mit Zucker","Wasser, das immer trinkbar ist"],0,"Süßwasser enthält wenig Salz. Trotzdem muss es sauber und geeignet sein, bevor wir es trinken."],
 ["fog","Was ist Nebel?",["Sand in der Luft","Eine Wolke nahe am Boden","Unsichtbares Licht"],1,"Nebel besteht wie eine Wolke aus vielen winzigen Wassertröpfchen, aber direkt nahe am Boden."],
 ["wind","Was ist Wind?",["Licht in Bewegung","Wasser in Bewegung","Luft in Bewegung"],2,"Luftdruckunterschiede setzen Luft in Bewegung. Diese bewegte Luft spüren wir als Wind."],
 ["weather-climate","Welche Aussage beschreibt Wetter?",["Heute regnet es","In dieser Gegend sind die Sommer meist trocken","Eine Wüste bekommt langfristig wenig Regen"],0,"Heute regnet es beschreibt einen bestimmten Tag. Typische Bedingungen über viele Jahre gehören zum Klima."],
 ["condensation","Was passiert beim Abkühlen feuchter Luft?",["Wasser wird immer zu Stein","Wasserdampf kann zu Tröpfchen werden","Die Luft verschwindet"],1,"Das Entstehen flüssiger Tröpfchen aus Wasserdampf heißt Kondensation."],
 ["precipitation","Was zählt zu Niederschlag?",["Sonnenlicht","Wind","Regen, Schnee und Hagel"],2,"Niederschlag ist Wasser, das aus der Atmosphäre zur Erde fällt, flüssig oder fest."],
 ["thermometer","Was misst ein Thermometer?",["Temperatur","Windrichtung","Die Zahl der Wolken"],0,"Ein Thermometer zeigt, wie warm oder kalt etwas ist. Ein Regenmesser hat eine andere Aufgabe."],
];
const seasons: Entry[] = [
 ["tilt","Was ist der Hauptgrund für unsere Jahreszeiten?",["Die Sonne wird im Winter ausgeschaltet","Die geneigte Erdachse","Die Erde dreht sich im Winter nicht"],1,"Die geneigte Erdachse verändert im Jahreslauf Sonnenstand und Tageslänge."],
 ["opposite","In Deutschland ist Sommer. Was ist gleichzeitig in Australien?",["Sommer","Frühling","Winter"],2,"Die Jahreszeiten auf Nord- und Südhalbkugel sind gegensätzlich."],
 ["year","Wie lange braucht die Erde ungefähr einmal um die Sonne?",["Ein Jahr","Eine Stunde","Einen Tag"],0,"Eine Reise um die Sonne dauert ungefähr 365¼ Tage. Die Drehung um die Achse dauert etwa einen Tag."],
 ["summer-days","Wie sind die Tage in Deutschland im Sommer im Vergleich zum Winter?",["Kürzer","Länger","Immer genau gleich lang"],1,"Im Sommer bleibt die Sonne bei uns länger über dem Horizont und steht höher."],
 ["rotation","Welche Bewegung macht Tag und Nacht?",["Die Bewegung der Wolken","Nur die Reise des Mondes","Die Drehung der Erde um ihre Achse"],2,"Während sich die Erde dreht, gelangt ein Ort ins Sonnenlicht und wieder auf die dunkle Seite."],
 ["christmas","Warum kann man in Australien Weihnachten bei Sommerwetter feiern?",["Australien liegt auf der Südhalbkugel","Australien hat keine Jahreszeiten","Dort gibt es eine zweite Sonne"],0,"Im Dezember ist die Südhalbkugel zur Sonne geneigt. Dort ist Sommer, während bei uns Winter ist."],
 ["tropics","Welche Jahreszeiten unterscheidet man in vielen tropischen Gegenden eher?",["Immer Schnee und Eis","Regenzeit und Trockenzeit","Tag und Nacht"],1,"Nicht überall gibt es vier Jahreszeiten wie bei uns. In vielen Tropengebieten ist Regen entscheidend."],
 ["march","Wie lang sind Tag und Nacht um die Tagundnachtgleiche ungefähr?",["Tag eine Stunde, Nacht ein Jahr","Tag und Nacht dauern immer drei Tage","Ungefähr gleich lang"],2,"Um März und September sind Tag und Nacht fast überall ungefähr gleich lang."],
];
const nature: Entry[] = [
 ["coral","Was sind Korallen?",["Tiere","Steine","Blumen"],0,"Korallen bestehen aus kleinen Tieren. Manche bilden feste Skelette und wachsen zu Riffen."],
 ["desert","Was zeichnet eine Wüste aus?",["Sie ist immer heiß","Sie bekommt sehr wenig Niederschlag","Sie liegt immer am Meer"],1,"Wüsten sind trocken. Auch die kalte Antarktis zählt als Wüste."],
 ["polar-bear","Wo leben Eisbären in der freien Natur?",["Am Südpol","Im Amazonas","In der Arktis im Norden"],2,"Eisbären leben im Norden. Pinguine und Eisbären treffen sich in der freien Natur nicht."],
 ["camel","Was speichern Kamele in ihren Höckern?",["Fett","Trinkwasser","Sand"],0,"Die Höcker enthalten Fett als Energiereserve. Sie sind keine Wassertanks."],
 ["reef-home","Was bietet ein Korallenriff vielen Meerestieren?",["Nur Dunkelheit","Nahrung und Verstecke","Trinkwasserflaschen"],1,"Riffe sind wichtige Lebensräume für viele verschiedene Meerestiere."],
 ["deep-sea","Was passiert, je tiefer du im Meer hinabgehst?",["Es wird überall sonniger","Der Druck verschwindet","Es wird dunkler und der Druck steigt"],2,"Sonnenlicht erreicht nur die oberen Bereiche. Der Wasserdruck nimmt mit der Tiefe zu."],
 ["habitat","Was ist ein Lebensraum?",["Ein Ort mit passenden Bedingungen für Lebewesen","Nur ein Kinderzimmer","Nur ein großer Zoo"],0,"Wälder, Teiche, Riffe und sogar der Boden unter einem Stein sind Lebensräume."],
 ["food-web","Warum heißt es Nahrungsnetz?",["Weil Tiere Netze kaufen","Weil viele Nahrungsbeziehungen zusammenhängen","Weil alle Tiere dasselbe fressen"],1,"Ein Lebewesen hat oft mehrere Nahrungsquellen und Fressfeinde. So hängen Nahrungsketten zusammen."],
 ["penguin","Welche Aussage über Pinguine stimmt?",["Alle leben am Nordpol","Alle leben ausschließlich im Eis","Nicht alle Pinguine leben im Eis"],2,"Pinguinarten leben in verschiedenen Gegenden der Südhalbkugel. Einige leben nahe am Äquator."],
 ["glacier","Was ist ein Gletscher?",["Eine große Eismasse an Land, die sich langsam bewegt","Ein warmer Sandberg","Eine Wolke"],0,"Gletscher entstehen aus über lange Zeit angesammeltem Schnee und bewegen sich langsam."],
 ["salt-sea","Was bleibt zurück, wenn Meerwasser verdunstet?",["Nichts","Das Salz","Nur Fische"],1,"Wasser gelangt in die Luft. Das gelöste Salz verdunstet dabei nicht mit."],
 ["tides","Was verursacht vor allem Ebbe und Flut?",["Schiffe","Regenwolken","Die Schwerkraft des Mondes"],2,"Vor allem die Anziehung des Mondes und auch die der Sonne verursachen die Gezeiten."],
];
const protect: Entry[] = [
 ["reuse","Dein Buch ist heil und du brauchst es nicht mehr. Was ist sinnvoll?",["Weitergeben oder tauschen","In den Fluss werfen","Sofort zerreißen"],0,"Andere können das Buch weiter nutzen. Das spart Material und vermeidet Abfall."],
 ["light","Niemand ist mehr im Zimmer. Was kannst du tun?",["Alles Licht einschalten","Unnötiges Licht ausschalten","Alle Geräte gleichzeitig anschalten"],1,"Licht braucht Energie. Wenn es nicht gebraucht wird, kann es ausgeschaltet werden."],
 ["wildlife","Du entdeckst ein Vogelnest. Wie beobachtest du es?",["Eier mitnehmen","Ganz nah hineinlangen","Mit Abstand und ohne es zu stören"],2,"Wildtiere brauchen Ruhe. Beobachten mit Abstand schützt sie und macht ihre natürlichen Verhaltensweisen sichtbar."],
 ["greenhouse","Was macht der natürliche Treibhauseffekt?",["Er hält einen Teil der Wärme zurück","Er schaltet die Sonne aus","Er macht die Erde luftleer"],0,"Ein natürlicher Treibhauseffekt macht die Erde wärmer. Zusätzliche Treibhausgase verstärken ihn."],
 ["repair","Ein Spielzeug ist kaputt. Was könnt ihr zuerst überlegen?",["Es in der Natur ablegen","Ob es sich reparieren lässt","Es sofort verbrennen"],1,"Reparieren kann die Nutzungsdauer verlängern. Erwachsene helfen bei Werkzeugen und elektrischen Dingen."],
 ["bottle","Was ist eine Mehrwegflasche?",["Eine Flasche, die man nur einmal nutzt","Eine Flasche ohne Wasser","Eine Flasche, die mehrfach benutzt wird"],2,"Mehrweg bedeutet: Ein Behälter wird nach dem Reinigen wieder genutzt."],
 ["responsibility","Wer muss beim Schutz von Klima und Natur zusammenarbeiten?",["Menschen, Unternehmen und Länder","Nur Kinder","Nur eine einzige Person"],0,"Das ist eine gemeinsame Aufgabe. Kinder dürfen Ideen beitragen, tragen aber nicht allein die Verantwortung."],
 ["litter","Wo gehört dein Abfall bei einem Ausflug hin?",["Unter einen Busch","In einen passenden Mülleimer oder mit nach Hause","In den See"],1,"Abfall darf nicht in der Natur liegen bleiben. Nimm ihn mit, wenn es keinen passenden Mülleimer gibt."],
 ["plants","Wie kann ein Balkon Insekten helfen?",["Alle Pflanzen entfernen","Alle Blüten abschneiden","Geeignete blühende Pflanzen anbieten"],2,"Blüten können Nahrung liefern. Erwachsene helfen bei der Auswahl geeigneter Pflanzen."],
 ["climate-day","Ein Wintertag ist sehr kalt. Beweist das, dass sich das Klima nicht erwärmt?",["Nein, ein einzelner Tag ist Wetter","Ja, ein Tag beschreibt das ganze Klima","Klima gibt es nur im Sommer"],0,"Klima betrachtet lange Zeiträume und viele Messungen. Einzelne kalte Tage kommen auch in einem wärmeren Klima vor."],
 ["resources","Warum kann Ausleihen statt Neukaufen sinnvoll sein?",["Es macht jeden Gegenstand schwerer","Ein Gegenstand wird von mehreren Menschen genutzt","Es verhindert, dass jemand etwas lernen kann"],1,"Gemeinsames Nutzen kann Material und Energie sparen, wenn dafür weniger Neues hergestellt wird."],
 ["food","Wie vermeidet ihr Lebensmittelabfälle?",["Alles ohne Plan kaufen","Alles sofort wegwerfen","Gemeinsam planen und Reste sinnvoll nutzen"],2,"Planen und richtiges Aufbewahren helfen. Erwachsene entscheiden, welche Lebensmittel noch sicher verwendbar sind."],
];
export const EXTRA_QUESTIONS: QuizQuestion[] = [
 ...water.map(([id,question,answers,correct,why])=>({id,question,answers,correct,why,category:"Wasser & Wetter" as const})),
 ...seasons.map(([id,question,answers,correct,why])=>({id,question,answers,correct,why,category:"Jahreszeiten" as const})),
 ...nature.map(([id,question,answers,correct,why])=>({id,question,answers,correct,why,category:"Natur" as const})),
 ...protect.map(([id,question,answers,correct,why])=>({id,question,answers,correct,why,category:"Erde schützen" as const})),
];
