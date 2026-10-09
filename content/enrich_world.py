"""Editorial enrichment; keep topic IDs, route IDs and progress keys stable."""
import json
from pathlib import Path
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]
catalog = json.loads((ROOT / 'app/world-catalog.json').read_text())
extra = {
 'history-stone_tools': 'Ein Werkzeug verlängert die Möglichkeiten des Körpers: Mit einer scharfen Steinkante lässt sich etwas schneiden, das die Hand allein nicht durchtrennen kann. Aus Gebrauchsspuren lernen Forschende, wofür alte Werkzeuge benutzt wurden.',
 'history-fire': 'Feuer machte Wärme und gekochte Nahrung möglich. Es konnte aber auch gefährlich sein. Zu lernen, ein Feuer zu erhalten, war etwas anderes als zu lernen, es selbst zu entzünden.',
 'history-writing': 'Schrift kann eine Nachricht bewahren, auch wenn die Person, die sie geschrieben hat, längst gegangen ist. Frühe Schreiber hielten zum Beispiel Vorräte und Lieferungen fest. Später wurden auch Geschichten aufgeschrieben.',
 'history-pyramids': 'Eine Pyramide brauchte viele verschiedene Arbeiten: Steine gewinnen, transportieren, bearbeiten und genau setzen. Ein solches Bauwerk erzählt deshalb auch von Organisation, Versorgung und Handwerk.',
 'history-paper': 'Dünne Papierblätter lassen sich zusammenlegen, beschriften und zu Büchern verbinden. Papierherstellung, Schrift und Druck ergänzen einander; jede Entwicklung hatte ihre eigene Geschichte.',
 'history-zero': 'Vergleiche 25 und 205: Die Null zeigt, dass an einer Stelle kein Zehner steht. Als Zahl und als Platzhalter macht sie unterschiedliche Aufgaben möglich. Zahlzeichen und Rechenweisen verbreiteten sich durch Austausch.',
 'history-compass': 'Ein Kompass zeigt eine Richtung auch dann, wenn Wolken die Sterne verdecken. Eine Karte sagt dagegen, wo Wege, Küsten und Berge liegen. Für eine Reise braucht man oft beides.',
 'history-medieval_cities': 'Mittelalterliche Städte waren auch Orte für Handwerk und Handel. Nicht alle Menschen lebten in Burgen. Bauern, Händlerinnen und viele andere versorgten die Gemeinschaften.',
 'history-printing': 'Bewegliche Zeichen werden nach dem Drucken wieder auseinandergenommen. Für die nächste Seite können dieselben Zeichen in einer anderen Reihenfolge benutzt werden. Das spart Arbeit gegenüber einer komplett neu geschnitzten Seite.',
 'history-voyages1492': 'Eine Reise ist kein Beginn der Geschichte eines Landes. In Amerika lebten bereits sehr viele Menschen mit eigenen Sprachen, Städten und Wissenssystemen. Die folgenden europäischen Eroberungen hatten für sie schwere Folgen.',
 'history-steam': 'Wasser wird erhitzt und Dampf kann Arbeit verrichten. Eine Maschine wandelt dabei einen Teil der Wärmeenergie in Bewegung um. Brennstoff, Wasser und Wartung bleiben nötig.',
 'history-railway': 'Schienen führen die Räder und verbinden Orte. Zu einem Bahnnetz gehören deshalb mehr als Lokomotiven: Bahnhöfe, Signale, Gleise und Menschen, die den Verkehr organisieren.',
 'history-electric_light': 'Eine brauchbare Lampe allein genügte nicht. Für viele beleuchtete Häuser brauchte es außerdem Kraftwerke, Leitungen, Schalter und Regeln für den sicheren Betrieb.',
 'history-flight': 'Bei einem Flugzeug müssen Auftrieb, Vorwärtsbewegung und Steuerung zusammenpassen. Frühere Gleitversuche halfen dabei, Flügel und Steuerflächen zu verbessern.',
 'history-ww1': 'Ein Krieg betrifft auch Menschen weit weg von einer Front: Familien werden getrennt, Versorgung wird schwierig und ganze Orte verändern sich. Deshalb lernen wir neben Jahreszahlen auch, was Konflikte mit Menschen machen.',
 'history-holocaust': 'Jüdische Menschen hatten und haben sehr verschiedene Lebensweisen. Sie wurden wegen ihrer zugeschriebenen Herkunft oder Religion verfolgt. Niemand darf wegen seiner Herkunft, Religion oder einer Behinderung weniger Rechte haben.',
 'history-ww2': 'Nach dem Krieg waren viele Städte zerstört und Millionen Menschen mussten ein neues Zuhause finden. Frieden bedeutete deshalb auch: helfen, wieder aufbauen und Regeln für Zusammenarbeit entwickeln.',
 'history-un': 'Die Vereinten Nationen sind keine Regierung für die ganze Erde. Staaten beraten dort gemeinsam. Zusammenarbeit ist oft schwierig; Gespräche, Hilfsprogramme und gemeinsame Regeln bleiben trotzdem wichtig.',
 'history-berlin_wall_build': 'Die Mauer trennte Straßen und Familien. Viele Menschen konnten ihre Verwandten auf der anderen Seite nicht frei besuchen. An Resten der Mauer und in Museen kann man heute lernen, wie diese Grenze den Alltag veränderte.',
 'history-apollo11': 'Die Mondlandung war eine Teamleistung. Neben den Astronauten arbeiteten sehr viele Menschen an Berechnungen, Raumanzügen, Raketen und Funkverbindungen. Gesteinsproben halfen, die Geschichte des Mondes zu erforschen.',
 'history-web': 'Internet und Web sind verschieden: Das Internet verbindet Computer-Netze. Das World Wide Web ist ein Dienst darauf, der Seiten durch Links verbindet. E-Mail ist ein anderer Internetdienst.',
 'history-berlin_wall_fall': 'Viele Menschen demonstrierten friedlich und verlangten Veränderungen. Der offene Grenzübergang im November 1989 war ein wichtiger Schritt; die deutsche Wiedervereinigung folgte erst 1990.',
 'history-reunification': 'Eine neue gemeinsame Staatsordnung entstand nicht an einem einzigen Abend. Gesetze, Verwaltungen und der Alltag mussten sich verändern. Menschen erlebten diesen Wandel sehr unterschiedlich.',
 'history-iss': 'Auf der Raumstation arbeiten Teams an Versuchen, die auf der Erde anders ablaufen würden. In der Umlaufbahn fallen Station und Besatzung gemeinsam um die Erde; die Schwerkraft ist dort nicht verschwunden.',
 'history-september11': 'An einer Gedenkstätte wird an die Opfer erinnert. Menschen können Blumen niederlegen, Namen lesen und Fragen stellen. Erinnern bedeutet hier auch, die Würde jedes Menschen zu achten und friedlich zusammenzuleben.',
 'history-webb': 'Infrarotlicht ist für unsere Augen unsichtbar. Die Messdaten des Teleskops werden zu Bildern verarbeitet; Farben können verschiedene Wellenlängen sichtbar machen. Ein solches Bild ist eine Erklärung von Daten, kein Blick mit bloßen Augen.',
 'person-marie_curie': 'Radioaktivität bedeutet, dass bestimmte Atomkerne von selbst Strahlung abgeben. Curie untersuchte diese Vorgänge mit Messgeräten. Strahlung kann schaden; heute braucht solche Forschung besonders sorgfältigen Schutz.',
 'person-ada_lovelace': 'Ein Algorithmus ist eine genaue Folge von Schritten. Lovelaces Anleitung bezog sich auf eine geplante Rechenmaschine. Sie konnte nicht einfach einen heutigen Computer einschalten und ihr Programm ausprobieren.',
 'person-grace_hopper': 'Ein Compiler übersetzt ein Programm in eine Form, die ein Computer verarbeiten kann. Das hilft Menschen, Anweisungen verständlicher aufzuschreiben. Trotzdem müssen Programme sorgfältig geprüft werden.',
 'person-katherine_johnson': 'Eine Flugbahn beschreibt, wo ein Raumfahrzeug zu verschiedenen Zeiten sein soll. Schon ein kleiner Rechenfehler kann große Folgen haben. Deshalb wurden Rechnungen unabhängig überprüft.',
 'person-tim_berners_lee': 'Ein Link verbindet eine Webseite mit einer anderen. Gemeinsame Regeln machen das Web auf unterschiedlichen Computern nutzbar. Berners-Lee entwickelte das Web; das Internet gab es bereits vorher.',
 'person-karl_benz': 'Ein Fahrzeug braucht ein ganzes System: Antrieb, Räder, Lenkung und Bremsen. Andere Menschen arbeiteten ebenfalls an Fahrzeugen, auch mit Dampf oder elektrischer Energie. Automobilgeschichte hat viele Beteiligte.',
 'person-bertha_benz': 'Eine Erfindung muss im Alltag bestehen. Unterwegs merkt man andere Schwierigkeiten als in einer Werkstatt. Bertha Benz machte mit ihrer Reise sichtbar, wo das Fahrzeug und seine Versorgung verbessert werden mussten.',
 'person-jane_goodall': 'Geduldige Beobachtung kann eine erste Vermutung verändern. Goodall dokumentierte Verhalten einzelner Schimpansen über lange Zeit. Tiere in freier Natur lassen sich nicht wie Maschinen an- und ausschalten.',
 'person-albert_einstein': 'Bei einem Gedankenexperiment stellt man sich eine Situation genau vor. Dann fragt man, welche Folgen die bekannten Regeln hätten. Eine spannende Idee genügt aber nicht: Ihre Vorhersagen müssen zu Messungen passen.',
 'person-al_khwarizmi': 'Algebra hilft, eine unbekannte Zahl zu finden. „Eine Zahl plus drei ist acht“ lässt sich Schritt für Schritt lösen. Gelehrte übernahmen und verbesserten Wissen aus verschiedenen Regionen; Mathematik ist eine gemeinsame Geschichte.',
 'person-tu_youyou': 'Ein Hinweis aus einem alten Text ist noch kein fertiges Medikament. Stoffe müssen untersucht, dosiert und in wissenschaftlichen Studien geprüft werden. Pflanzen oder Arzneien probiert man deshalb nicht selbst als Experiment aus.',
 'person-cai_lun': 'Papier entsteht aus Fasern, die in Wasser verteilt, zu einer dünnen Schicht gesammelt und getrocknet werden. Verfahren wurden über lange Zeit verbessert. Cai Lun gilt als wichtiger Verbesserer, nicht als einziger Ursprung des Papiers.',
 'person-mae_jemison': 'Für Raumfahrt braucht es viele Fachrichtungen: Medizin, Technik, Mathematik und Naturwissenschaften. Jemisons verschiedene Ausbildungen zeigen, dass Fragen oft über die Grenzen eines einzelnen Faches hinausgehen.',
 'person-johannes_gutenberg': 'Ein Drucksystem muss viele Teile zusammenbringen: passende Metallzeichen, Farbe, Papier und eine Presse. In Ostasien gab es bereits früher Druck und bewegliche Zeichen. Gutenbergs Beitrag war eine besondere Weiterentwicklung in Europa.',
 'person-wangari_maathai': 'Mit dem Green Belt Movement verband Maathai das Pflanzen von Bäumen mit gemeinsamer Arbeit und besseren Lebensbedingungen. Bäume schützen Boden und bieten Lebensräume. Die Pflege nach dem Pflanzen ist genauso wichtig wie das Setzen des Baumes.',
 'person-charles_darwin': 'Lebewesen einer Art unterscheiden sich. Wenn einige Unterschiede beim Überleben und bei der Fortpflanzung helfen, können sie über viele Generationen häufiger werden. Das heißt natürliche Selektion; ein einzelnes Tier verändert sich dabei nicht auf Wunsch.',
 'person-alexander_humboldt': 'Temperatur, Höhe, Pflanzen und Boden hängen zusammen. Humboldt verglich Messungen an verschiedenen Orten. Forschungsreisen trafen auf bereits vorhandenes Wissen; lokale Menschen halfen wesentlich beim Reisen und Verstehen.',
 'person-neil_armstrong': 'Neil Armstrong und Buzz Aldrin gingen auf dem Mond umher, während Michael Collins in der Mondumlaufbahn blieb. Eine Mission braucht unterschiedliche Aufgaben. Der erste Schritt eines Menschen war das Ergebnis der Arbeit eines großen Teams.',
 'invention-light': 'Heute nutzen viele Lampen LEDs. Sie erzeugen Licht anders als ein heißer Glühdraht. Vergleiche die elektrische Leistung, die Helligkeit und die Lebensdauer; eine möglichst sparsame passende Lampe vermeidet Verschwendung.',
 'invention-car': 'Ein Verbrennungsmotor nutzt die Energie eines Kraftstoffs; ein Elektroauto einen Elektromotor und elektrische Energie. Beide brauchen zuverlässige Bremsen. Auch Bus, Bahn, Radfahren und Zufußgehen lösen die Aufgabe, Menschen zu bewegen.',
 'invention-railway': 'Bei einer Eisenbahn sind nicht nur die Fahrzeuge wichtig. Ein Fahrplan und Signale helfen, viele Züge gemeinsam zu betreiben. Schienen transportieren Menschen und Güter; neue Strecken verändern auch Landschaften.',
 'invention-airplane': 'Ein Flügel lenkt strömende Luft nach unten. Die Luft übt dadurch auch eine Kraft auf den Flügel aus. Druckunterschiede gehören zur Erklärung. Luftteilchen müssen oben und unten nicht gleichzeitig am Ende des Flügels ankommen.',
 'invention-phone': 'Das Mikrofon macht aus Schallschwingungen ein elektrisches Signal. Am anderen Ende verwandelt ein Lautsprecher Signale wieder in Schall. Heute können Verbindungen zusätzlich digital und über Funk übertragen werden.',
 'invention-computer': 'Ein Computer führt Programme aus. Eingabe, Verarbeitung, Speicherung und Ausgabe arbeiten zusammen. Ein Ergebnis kann falsch sein, wenn das Programm oder seine Daten falsch sind; ein schneller Rechner ist nicht automatisch ein kluger Entscheider.',
 'invention-internet': 'Gemeinsame Regeln, die Protokolle heißen, helfen verschiedenartigen Geräten beim Austausch. Daten können in Paketen über mehrere Zwischenstationen reisen. Nicht jede Verbindung ist immer verfügbar; Netze brauchen Wartung und Schutz.',
 'invention-compass': 'Die Nadel orientiert sich am Magnetfeld der Erde. Magnetischer Norden und geografischer Nordpol liegen nicht genau am selben Ort. Metall und andere Magnete in der Nähe können die Anzeige stören.',
 'invention-printing': 'Mit derselben Druckform lassen sich viele gleiche Seiten herstellen. Eine Änderung muss vor dem Drucken in die Vorlage. Digital gespeicherte Texte sind leichter zu verändern; für verlässliche Bücher bleiben Quellen und sorgfältiges Korrigieren wichtig.',
 'invention-rocket': 'Eine Rakete stößt Masse schnell nach hinten aus und erhält dadurch Schub. Sie muss sich nicht an Luft abstoßen und kann auch im Weltraum arbeiten. Einige heutige Raketenstufen werden nach der Landung erneut verwendet.',
 'invention-satellite': 'Ein Satellit fällt ständig in Richtung Erde, bewegt sich aber seitwärts schnell genug, um sie immer wieder zu verfehlen. Messgeräte sammeln Daten; Antennen übertragen sie. Unterschiedliche Aufgaben brauchen unterschiedliche Umlaufbahnen.',
 'invention-smartphone': 'Im Smartphone stecken viele frühere Entwicklungen: Computer, Funk, Bildschirm, Kamera und Akku. Reparieren und längeres Benutzen können Material sparen. Nicht jede neue Version ist für jede Aufgabe nötig.',
 'science-circuit': 'Im Alltag versorgt elektrische Energie Lampen und Geräte. Der Schalter unterbricht einen Stromweg. Unser Modell verwendet eine Batterie: Steckdosen, Netzkabel und echte elektrische Anlagen sind keine Kinderexperimente.',
 'science-network': 'Eine Nachricht kann in kleinere Datenpakete zerlegt werden. Zwischenstationen leiten sie weiter. In echten Netzen gibt es viel mehr Wege und Regeln als in diesem Modell. Das Web ist nur einer der Dienste des Internets.',
 'science-flight': 'Steigt das Flugzeug, sind die Kräfte für diesen Bewegungszustand nicht genauso ausgeglichen wie bei einem gleichmäßigen geraden Flug. Ein Regler erklärt nur eine vereinfachte Kraftbilanz und ist keine Flugvorhersage.',
 'science-gps': 'Navigationsgeräte vergleichen die Laufzeiten von Satellitensignalen. Dafür müssen die Uhren sehr genau sein. In der wirklichen räumlichen Ortung werden normalerweise mindestens vier Satelliten verwendet, auch um den Uhrenfehler zu bestimmen. Diese Seite fragt deinen Standort nicht ab.',
 'science-computer': 'Eine Datei kann Bilder, Texte oder Töne darstellen. Welche Bedeutung eine Folge von Bits hat, hängt von vereinbarten Regeln ab. Unser Acht-Bit-Modell zeigt Zahlen; echte Rechner verarbeiten viel längere Folgen und viele verschiedene Datenformen.',
 'science-shadows': 'Gleichzeitige Schattenmessungen an weit entfernten Orten können helfen, die Erdkrümmung zu untersuchen. Dafür muss man die Sonnenrichtung und die Lage der Orte beachten. Dieses vereinfachte Modell zeigt die Idee; es ersetzt keine vollständige Messung.',
}

animal_tasks = {
 'african-savanna-elephant': ('Was kann ein Elefant mit seinem Rüssel tun?', ['Riechen und greifen', 'Unter Wasser atmen wie ein Fisch', 'Wie ein Vogel fliegen'], 'Der Rüssel ist Nase und bewegliches Greifwerkzeug zugleich.', 'Schutzprogramme brauchen sichere Wege zwischen Lebensräumen. Wildtiere mit Abstand beobachten und keine Produkte aus Elfenbein kaufen.'),
 'lion': ('Wie leben viele Löwen?', ['In einem Rudel', 'Immer allein in einer Baumhöhle', 'In einem Bienenstaat'], 'Löwen leben häufig in Gruppen. Bei vielen anderen Katzen ist das anders.', 'Menschen und Löwen brauchen sichere Lebensräume. Schutzprojekte helfen auch Menschen, ihre Nutztiere zu schützen und Konflikte zu vermeiden.'),
 'cheetah': ('Wofür ist ein Gepard besonders bekannt?', ['Sehr schnelle kurze Sprints', 'Ausdauerndes Fliegen', 'Den größten Körper aller Landtiere'], 'Der Gepard ist ein schneller Sprinter. Er kann das hohe Tempo nicht unbegrenzt halten.', 'Weite verbundene Lebensräume sind wichtig. Straßen und Zäune können Wege zerschneiden. Schutzgebiete und sichere Verbindungen helfen.'),
 'bengal-tiger': ('Was frisst ein Bengaltiger hauptsächlich?', ['Andere Tiere', 'Bambusblätter', 'Blütennektar'], 'Ein Tiger ist ein Fleischfresser und jagt unter anderem große Säugetiere.', 'Wälder, Beutetiere und Schutz vor Wilderei gehören zusammen. Produkte aus Tigerteilen gehören nicht in den Einkauf.'),
 'giraffe': ('Welche Messung beschreibt die Höhe einer Giraffe?', ['Vom Boden bis zum Kopf', 'Nur die Länge des Schwanzes', 'Das Gewicht in Kilogramm'], 'Die Gesamthöhe schließt den langen Hals ein. Länge, Höhe und Gewicht sind unterschiedliche Größen.', 'Giraffen brauchen Nahrung und zusammenhängende Landschaften. Der Schutz von Bäumen und Wanderrouten ist wichtig.'),
 'giant-panda': ('Was frisst der Große Panda überwiegend?', ['Bambus', 'Fische', 'Meereis'], 'Der Große Panda frisst überwiegend Bambus, obwohl er zur Gruppe der Raubtiere gehört.', 'Geschützte Bambuswälder und Verbindungen zwischen ihnen helfen. Eine bessere Einstufung bedeutet nicht, dass Schutz unnötig geworden ist.'),
 'western-lowland-gorilla': ('Warum ist Waldschutz für Gorillas wichtig?', ['Der Wald bietet Nahrung und Schutz', 'Gorillas leben nur im Meer', 'Gorillas benötigen keine Pflanzen'], 'Westliche Flachlandgorillas leben in Waldgebieten und ernähren sich überwiegend von Pflanzen.', 'Waldschutz, Schutz vor Wilderei und Abstand zu Menschen helfen. Menschliche Krankheiten können Menschenaffen ebenfalls gefährden.'),
 'bornean-orangutan': ('Wo verbringt ein Orang-Utan viel Zeit?', ['In Bäumen', 'Im offenen Ozean', 'Im antarktischen Eis'], 'Orang-Utans bewegen sich viel in Bäumen und bauen dort Schlafnester.', 'Verbundenen Wald erhalten und Wiederaufforstung unterstützen hilft. Mit Erwachsenen lässt sich auf Produkte aus verantwortlichem Anbau achten.'),
 'polar-bear': ('Warum braucht der Eisbär Meereis?', ['Dort kann er nach Robben jagen', 'Er frisst das Eis', 'Eis macht ihn zu einem Fisch'], 'Meereis ist eine wichtige Jagdfläche. Eisbären leben in der Arktis, nicht am Südpol.', 'Menschen können die zusätzliche Erderwärmung begrenzen und wichtige Lebensräume schützen. Ein einzelnes Kind muss dieses große Problem nicht allein lösen.'),
 'emperor-penguin': ('Wo leben Kaiserpinguine in freier Natur?', ['In der Antarktis', 'Am Nordpol bei Eisbären', 'In europäischen Baumhöhlen'], 'Kaiserpinguine leben im antarktischen Gebiet. Ihre Flügel helfen beim Schwimmen statt beim Fliegen.', 'Stabiles Meereis ist für die Fortpflanzung wichtig. Forschung und Klimaschutz helfen, Veränderungen zu verstehen und Lebensräume zu schützen.'),
 'blue-whale': ('Was frisst ein Blauwal überwiegend?', ['Krill', 'Große Bäume', 'Elefanten'], 'Krill sind kleine krebsartige Tiere. Ein sehr großes Tier kann von sehr kleinen Tieren leben.', 'Langsamerer Schiffsverkehr in wichtigen Gebieten, weniger Unterwasserlärm und Schutz vor Verfangen in Fischereigerät können helfen.'),
 'common-bottlenose-dolphin': ('Wie atmet ein Delfin?', ['Er holt Luft an der Oberfläche', 'Er hat Kiemen wie ein Fisch', 'Er muss überhaupt nicht atmen'], 'Delfine sind Säugetiere. Sie atmen mit Lungen und müssen an die Oberfläche kommen.', 'Tiere nicht füttern oder verfolgen. Saubere Gewässer und Fischereimethoden mit weniger Beifang schützen Delfine.'),
 'orca': ('Zu welcher Gruppe gehört der Orca?', ['Zu den Delfinen', 'Zu den Haien', 'Zu den Meeresschildkröten'], 'Der Orca ist die größte Delfinart. Seine Nahrung kann sich zwischen Populationen unterscheiden.', 'Saubere Gewässer, ausreichend Nahrung und weniger Lärm sind wichtig. Verschiedene Orca-Gruppen haben unterschiedliche Gefährdungen.'),
 'common-octopus': ('Wie viele Arme hat ein Krake?', ['Acht', 'Zwei', 'Sechs'], 'Ein Krake hat acht Arme mit Saugnäpfen. Arme und Körperbeutel werden unterschiedlich gemessen.', 'Saubere Küsten und verantwortlicher Fischfang helfen. Wilde Kraken bleiben im Meer; ihre Verstecke werden nicht zerstört.'),
 'green-sea-turtle': ('Welche Körpergröße wird auf der Karte verglichen?', ['Die Panzerlänge', 'Die Flughöhe', 'Das Gewicht ihres Nestes'], 'Die Panzerlänge ist eine klar festgelegte Messrichtung. Junge Meeresschildkröten können andere Nahrung fressen als erwachsene Tiere.', 'Müll vermeiden, an Niststränden Abstand halten und keine hellen Lichter auf Jungtiere richten. Fischereigerät sollte Schildkröten nicht fangen.'),
 'red-kangaroo': ('Was steckt in der Größenangabe dieser Karte?', ['Das Gewicht erwachsener Männchen', 'Die Höhe aller Jungtiere', 'Die Länge des Beutels'], 'Die Karte gibt eine Gewichtsspanne für erwachsene Männchen an. Weibchen sind leichter.', 'Lebensräume erhalten und Tiere nicht füttern. Straßen können für wandernde Tiere gefährlich sein; Erwachsene beachten Wildwechsel-Hinweise.'),
 'koala': ('Was frisst ein Koala hauptsächlich?', ['Blätter bestimmter Eukalyptusbäume', 'Fische', 'Gräser vom Meeresboden'], 'Koalas sind auf passende Eukalyptusarten angewiesen. Nicht jedes Blatt eignet sich als Nahrung.', 'Passende zusammenhängende Eukalyptuswälder erhalten hilft. Straßen, Waldverlust und Krankheiten sind weitere Probleme für Koalas.'),
 'jaguar': ('Welche Fähigkeit passt zu einem Jaguar?', ['Er kann gut schwimmen', 'Er baut Honigwaben', 'Er ist ein fliegender Vogel'], 'Jaguare können gut schwimmen und nutzen auch Gewässer in ihren Lebensräumen.', 'Große verbundene Waldgebiete helfen. Schutzprogramme verbinden Natur- und Gewässerschutz mit den Bedürfnissen der Menschen vor Ort.'),
 'honey-bee': ('Was kann eine Biene beim Blütenbesuch weitertragen?', ['Pollen', 'Meereis', 'Salz vom Meeresboden'], 'Pollen kann von Blüte zu Blüte gelangen und bei vielen Pflanzen zur Bestäubung beitragen.', 'Vielfältige Blüten und passende Nistplätze helfen auch Wildbienen. Honigbienen und Wildbienen sind nicht dasselbe; nur mehr Bienenstöcke lösen nicht alle Probleme.'),
 'axolotl': ('Was ist an einem erwachsenen Axolotl besonders?', ['Er behält seine äußeren Kiemen', 'Er wird zu einem Vogel', 'Er lebt nur im trockenen Sand'], 'Axolotl behalten Merkmale ihrer Larvenzeit, darunter die äußeren Kiemen. Sie sind Amphibien.', 'Für wilde Axolotl ist der Schutz der Gewässer bei Mexiko-Stadt entscheidend. Viele Tiere in Aquarien ersetzen keinen sicheren wilden Lebensraum.'),
}

for t in catalog:
 if t['id'] in extra:
  if t['id']=='person-wangari_maathai' and not t['more']:t['more']=['Sie erhielt 2004 den Friedensnobelpreis. Ihr Beitrag verband Umweltschutz, Demokratie und die Zusammenarbeit vieler Menschen.']
  if t['id']=='person-neil_armstrong' and not t['more']:t['more']=['Armstrong war Pilot und Ingenieur. Er wurde für einen besonderen Schritt bekannt, arbeitete aber vor und nach Apollo 11 an vielen Aufgaben.']
  t['more'] = list(dict.fromkeys([*t['more'], extra[t['id']]]))
 if t.get('animal'):
  task=animal_tasks[t['id'].removeprefix('animal-')]
  t['question']={'prompt':task[0], 'answers':task[1], 'correct':0, 'why':task[2]}
  t['more']=[t['animal']['protection']['text_de'], task[3]]
  for label,text in [('Lebensraum',t['intro']),('Besondere Fähigkeit',t['paragraphs'][-1]),('Schutz',t['animal']['protection']['text_de'])]:
   if not any(f['label']==label for f in t['facts']):t['facts'].append({'label':label,'text':text})

if len(sys.argv)>1:
 assets=json.loads(Path(sys.argv[1]).read_text())['assets']
 photos=json.loads((ROOT/'app/world-photos.json').read_text())
 image_dir=ROOT/'public/images/portraits';image_dir.mkdir(parents=True,exist_ok=True)
 for p in assets:
  shutil.copyfile(p['local_path'],image_dir/p['filename'])
  photos[p['id']]={k:p[k] for k in ['id','src','author','license','license_url','source_page_url','alt_de','width','height','transformations_de']}
  photos[p['id']].update(fit='contain',caption=p['caption_de'],label='Darstellung' if p['requires_depiction_label'] else 'Foto')
  person=p['id'].replace('-','_')
  if p['id']=='alexander-von-humboldt':person='alexander_humboldt'
  if p['id']=='al-khwarizmi':person='al_khwarizmi'
  topic=next(t for t in catalog if t['id']=='person-'+person);topic['image']=p['id']
 for t in catalog:
  if t.get('person') and t.get('image') in photos:photos[t['image']]['fit']='contain'
 (ROOT/'app/world-photos.json').write_text(json.dumps(photos,ensure_ascii=False,indent=2)+'\n')
 (ROOT/'public/world/photo-credits.json').write_text(json.dumps({'schema_version':1,'assets':list(photos.values())},ensure_ascii=False,indent=2)+'\n')

(ROOT/'app/world-catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
fields=['id','category','title','intro','aliases','locations','image','model']
index=[]
for t in catalog:
 p={k:t[k] for k in fields if k in t}
 if t.get('animal'):p.update({k:t['animal'][k] for k in ['group','habitat','continent']})
 if t.get('history'):p.update({k:t['history'][k] for k in ['year','era','sensitive']})
 if t.get('invention'):p['year']=t['invention']['year']
 index.append(p)
(ROOT/'app/world-index.json').write_text(json.dumps(index,ensure_ascii=False,indent=2)+'\n')
print('Enriched',len(catalog),'topics;',sum(bool(t.get('image')) for t in catalog),'with media')
