# Spiele „Wetter und Klima“ und „Sortiere die Zeit“ (Teil B, Aufgabe 10, E14): Entwurf vom `karten-autor` (24.11.2026)

**Noch nicht geprüft.** Danach prüfen `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer` unabhängig. Der Bericht steht unten wörtlich.

---

E14, Teil B, Aufgabe 10: zwei Entwürfe sind fertig. Ich habe keine Datei geändert. Geprüft ist noch nichts, als Nächstes kommen `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer`.

Gelesen habe ich: `docs/entwurf/2026-11-23-phase-1-teilschritt-3.md` (E3, E4, E5, E9, E14), `docs/entwurf/2026-11-23-phase-1-ergaenzung-stufen.md` (S5) und `app/advanced-games.tsx` (CLIMATE, GAME_HINTS, SORT_DATA). Dazu `app/world-games.tsx` (Chronology, TIME_IDS) und `app/world-catalog.json` (Datumsangaben der Karten). Außerdem die Wetter-Reise in `app/journey-content.json` mit ihren Quellen und die Fixtures `tests/fixtures/gespeicherte-antworten*.json`. In den Fixtures steht keine Antwort aus den drei Spielen.

Hinweis zu den Daten von „Sortiere die Zeit“: Sie liegen nicht in `app/world-game-bank.ts`. Sie stehen in `app/world-games.tsx`, Zeile 55: `TIME_IDS` mit Karten-IDs. Name und Datum kommen dort aus `t.title` und `t.history.date` der Karten.

---

# Teil 1: Spiel „Wetter und Klima“

- **Spielname:** Wetter und Klima
- **Untertitel:** Wolken, Regen und Klimazonen: Was ist heute, was gilt über viele Jahre?
- **Tipp-Satz für das Spiel** (ersetzt `GAME_HINTS['climate-detective']`): Frag dich zuerst: Geht es um heute oder um viele Jahre?
- **Begriff einmal erklären** (Vorschlag: klein über jeder Klimazonen-Frage): Eine Klimazone ist ein großes Gebiet der Erde mit ähnlichem Klima.

So sind die Antworten geordnet:
- `falsch[0]` und `falsch[1]` sieht Entdecker.
- `falsch[2]` ist die schwerste Falle, sie kommt nur auf Profi dazu.
- Experte-Aufgaben haben zusätzlich `tipp2`, denn Regel 2 verlangt zwei Tipps.

```json
[
 {"id":"wetter-regen","stufe":"entdecker","frage":"Wassertropfen fallen aus den Wolken. Wie heißt das?","richtig":"Regen","falsch":["Wind","Nebel","Hagel"],"tipp":"Wofür nimmst du einen Schirm mit?","warum":"Wolkentröpfchen wachsen und werden schwer. Dann fallen sie als Regen. Hagel dagegen ist Eis.","quellen":[{"titel":"USGS Water Science School · Precipitation and the Water Cycle","url":"https://www.usgs.gov/special-topics/water-science-school/science/precipitation-and-water-cycle"},{"titel":"NOAA NSSL · Severe Weather 101: Hail","url":"https://www.nssl.noaa.gov/education/svrwx101/hail/"}],"alt_id":"extra:weather-match/Regen"},
 {"id":"wetter-schnee","stufe":"entdecker","frage":"Weiche Flocken aus Eiskristallen fallen vom Himmel. Was ist das?","richtig":"Schnee","falsch":["Nebel","Regen","Hagel"],"tipp":"Denk an einen kalten Wintertag draußen.","warum":"Schneeflocken sind viele kleine Eiskristalle. Hagel sind harte Eiskörner aus Gewitterwolken.","quellen":[{"titel":"NSIDC · Snow","url":"https://nsidc.org/learn/parts-cryosphere/snow"},{"titel":"NOAA NSSL · Severe Weather 101: Hail","url":"https://www.nssl.noaa.gov/education/svrwx101/hail/"}],"alt_id":"extra:weather-match/Schnee"},
 {"id":"wetter-wind","stufe":"entdecker","frage":"Die Luft bewegt sich, und Blätter rascheln. Was ist das?","richtig":"Wind","falsch":["Nebel","Regen","Tau"],"tipp":"Was lässt einen Drachen am Himmel fliegen?","warum":"Wind ist Luft, die sich bewegt. Du siehst ihn nicht. Du siehst nur, was er bewegt.","quellen":[{"titel":"NOAA JetStream · Origin of Wind","url":"https://www.noaa.gov/jetstream/synoptic/origin-of-wind"}],"alt_id":"extra:weather-match/Wind"},
 {"id":"wetter-sonnig","stufe":"entdecker","frage":"Am Himmel ist fast keine Wolke. Wie ist das Wetter?","richtig":"Sonnig","falsch":["Regnerisch","Neblig","Bewölkt"],"tipp":"Was siehst du, wenn keine Wolke im Weg ist?","warum":"Ohne Wolken scheint die Sonne frei. Sonnig kann trotzdem warm oder kalt sein.","quellen":[{"titel":"National Weather Service · Forecast Terms (Sky Condition)","url":"https://www.weather.gov/bgm/forecast_terms"}],"alt_id":"extra:weather-match/Sonne"},
 {"id":"wetter-wolke","stufe":"profi","frage":"Woraus besteht eine Wolke, die du am Himmel siehst?","richtig":"Aus kleinen Tropfen oder Eis","falsch":["Aus Rauch von vielen Feuern","Aus dichter, kalter Luft","Aus unsichtbarem Wasserdampf"],"tipp":"Denk an den Badspiegel nach dem Duschen. Was siehst du darauf?","warum":"Wasserdampf ist unsichtbar. Kühlt er ab, entstehen winzige Tröpfchen oder Eiskristalle. Die sehen wir als Wolke.","quellen":[{"titel":"NASA Science for Kids · How Do Clouds Form?","url":"https://science.nasa.gov/kids/earth/how-do-clouds-form/"},{"titel":"USGS · Condensation and the Water Cycle","url":"https://www.usgs.gov/water-science-school/science/condensation-and-water-cycle"}],"alt_id":"extra:weather-match/Wolke"},
 {"id":"wetter-nebel","stufe":"profi","frage":"Eine Wolke liegt direkt am Boden. Wie heißt das?","richtig":"Nebel","falsch":["Hagel","Tau","Raureif"],"tipp":"Bei diesem Wetter siehst du oft nur wenige Meter weit.","warum":"Nebel ist eine Wolke ganz unten. Tau und Raureif sitzen dagegen auf Gras und Zweigen.","quellen":[{"titel":"NWS Glossary · Fog","url":"https://forecast.weather.gov/glossary.php?word=FOG"},{"titel":"NWS Glossary · Dew","url":"https://forecast.weather.gov/glossary.php?word=DEW"},{"titel":"NWS Glossary · Frost","url":"https://forecast.weather.gov/glossary.php?word=FROST"}],"alt_id":null},
 {"id":"wetter-klima-wort","stufe":"entdecker","frage":"Wie heißt das typische Wetter einer Gegend über viele Jahre?","richtig":"Das Klima","falsch":["Das Wetter","Der Wind","Der Wetterbericht"],"tipp":"Gesucht ist ein Wort für viele Jahre, nicht für heute.","warum":"Klima ist das typische Wetter über viele Jahre. Forschende schauen dafür meist auf 30 Jahre oder mehr.","quellen":[{"titel":"NOAA · What's the difference between climate and weather?","url":"https://www.noaa.gov/explainers/what-s-difference-between-climate-and-weather"}],"alt_id":null},
 {"id":"wetter-satz-heute","stufe":"entdecker","frage":"Welcher Satz erzählt vom Wetter?","richtig":"Heute ist der Himmel ganz grau.","falsch":["In der Arktis sind die Winter lang.","Im Regenwald regnet es sehr oft.","In Deutschland gibt es vier Jahreszeiten."],"tipp":"Welcher Satz gilt nur für einen Tag?","warum":"„Heute“ zeigt: Das ist Wetter. Die anderen Sätze gelten über viele Jahre. Das ist Klima.","quellen":[{"titel":"NOAA · What's the difference between climate and weather?","url":"https://www.noaa.gov/explainers/what-s-difference-between-climate-and-weather"},{"titel":"NSIDC · Arctic Weather and Climate","url":"https://nsidc.org/learn/parts-cryosphere/arctic-weather-and-climate"},{"titel":"Ohio University, The Physical Environment · Tropical Rainforest","url":"https://people.ohio.edu/dyer/TPE/tpe_3e/climate_systems/tropical_rainforest_1.html"}],"alt_id":null},
 {"id":"wetter-satz-klima","stufe":"profi","frage":"Welcher Satz beschreibt das Klima?","richtig":"In der Sahara regnet es selten.","falsch":["Morgen wird es in Kiel windig.","Heute Mittag gibt es Gewitter.","Diesen Winter lag hier kaum Schnee."],"tipp":"Welcher Satz gilt nicht nur kurz, sondern fast jedes Jahr?","warum":"Die Sahara ist fast jedes Jahr sehr trocken. Das ist Klima. Ein Tag oder ein einziger Winter ist zu kurz dafür.","quellen":[{"titel":"NOAA · What's the difference between climate and weather?","url":"https://www.noaa.gov/explainers/what-s-difference-between-climate-and-weather"},{"titel":"NOAA JetStream · Climate Zones","url":"https://www.noaa.gov/jetstream/global/climate-zones"},{"titel":"Britannica · Sahara: Climate","url":"https://www.britannica.com/place/Sahara-desert-Africa/Climate"}],"alt_id":null},
 {"id":"wetter-zone-gemaessigt","stufe":"entdecker","frage":"In Deutschland gibt es warme Sommer und kalte Winter. Welche Klimazone passt?","richtig":"Gemäßigte Zone","falsch":["Tropen","Polarzone","Subtropen"],"tipp":"Dort ist es nicht sehr heiß und nicht sehr kalt.","warum":"Deutschland liegt in der gemäßigten Zone. Dort wechseln die Jahreszeiten deutlich.","quellen":[{"titel":"Tatsachen über Deutschland · Geografie und Klima","url":"https://www.tatsachen-ueber-deutschland.de/de/deutschland-auf-einen-blick/geografie-und-klima"}],"alt_id":"extra:climate-detective/1"},
 {"id":"wetter-zone-tropen","stufe":"entdecker","frage":"Rund um den Äquator steht die Sonne das ganze Jahr hoch. Welche Klimazone ist das?","richtig":"Tropen","falsch":["Polarzone","Gemäßigte Zone","Subtropen"],"tipp":"Denk an Regenwald, Papageien und warme Luft.","warum":"Die Tropen liegen rund um den Äquator. Dort gibt es Regenwald, aber auch Savanne.","quellen":[{"titel":"NOAA JetStream · Climate Zones","url":"https://www.noaa.gov/jetstream/global/climate-zones"},{"titel":"Ohio University, The Physical Environment · Tropical Rainforest","url":"https://people.ohio.edu/dyer/TPE/tpe_3e/climate_systems/tropical_rainforest_1.html"}],"alt_id":"extra:climate-detective/2"},
 {"id":"wetter-zone-polar","stufe":"entdecker","frage":"Nahe den Polen steht die Sonne tief. Die Winter sind lang. Welche Klimazone ist das?","richtig":"Polarzone","falsch":["Tropen","Gemäßigte Zone","Subtropen"],"tipp":"Hier leben Eisbären und Kaiserpinguine, aber an verschiedenen Enden der Erde.","warum":"Im Winter geht die Sonne dort lange gar nicht auf. Es bleibt kalt und dunkel.","quellen":[{"titel":"NSIDC · Arctic Weather and Climate","url":"https://nsidc.org/learn/parts-cryosphere/arctic-weather-and-climate"},{"titel":"NOAA JetStream · Climate Zones","url":"https://www.noaa.gov/jetstream/global/climate-zones"}],"alt_id":"extra:climate-detective/3"},
 {"id":"wetter-zone-subtropen","stufe":"profi","frage":"Zwischen Tropen und gemäßigter Zone liegen viele heiße Wüsten. Welche Klimazone ist das?","richtig":"Subtropen","falsch":["Polarzone","Gemäßigte Zone","Tropen"],"tipp":"Der Norden der Sahara liegt in dieser Zone.","warum":"Die Subtropen liegen zwischen Tropen und gemäßigter Zone. Dort gibt es Wüsten, aber auch feuchte Gegenden.","quellen":[{"titel":"NOAA JetStream · Climate Zones","url":"https://www.noaa.gov/jetstream/global/climate-zones"},{"titel":"Britannica · Sahara: Climate","url":"https://www.britannica.com/place/Sahara-desert-Africa/Climate"}],"alt_id":"extra:climate-detective/4"},
 {"id":"wetter-ein-tag","stufe":"experte","frage":"Ein Julitag in Deutschland ist kalt und nass. Was folgt daraus?","richtig":"Ein Tag sagt wenig über das Klima.","falsch":["Deutschland liegt jetzt in der Polarzone.","Das Klima hat sich heute geändert.","Der Sommer ist hier immer kalt."],"tipp":"Wie lange muss man beobachten, um ein Klima zu kennen?","tipp2":"Überlege: Ist ein einzelner Tag Wetter oder Klima?","warum":"Ein kalter Tag gehört zum Wetter. Klima zeigt sich erst über viele Jahre. Ein Tag ändert es nicht.","quellen":[{"titel":"NOAA · What's the difference between climate and weather?","url":"https://www.noaa.gov/explainers/what-s-difference-between-climate-and-weather"}],"alt_id":null},
 {"id":"wetter-berg-eis","stufe":"experte","frage":"Der Kilimandscharo liegt nahe am Äquator. Oben gibt es trotzdem Eis. Warum?","richtig":"Hoch oben ist die Luft viel kälter.","falsch":["Dort ist gerade Winter wie bei uns.","Der Wind bringt Eis vom Nordpol.","Auf den Gipfel scheint nie die Sonne."],"tipp":"Denk an die Alpen: Wo liegt dort im Frühling noch Schnee?","tipp2":"Vergleiche den Fuß des Berges mit seinem Gipfel.","warum":"In der untersten Luftschicht wird es nach oben meist kälter. Darum gibt es auf sehr hohen Bergen Eis, sogar nahe am Äquator.","quellen":[{"titel":"NASA Earth Observatory · Kilimanjaro's Shrinking Ice Fields","url":"https://science.nasa.gov/earth/earth-observatory/kilimanjaros-shrinking-ice-fields-79641"},{"titel":"NOAA JetStream · Layers of the Atmosphere","url":"https://www.noaa.gov/jetstream/atmosphere/layers-of-atmosphere"}],"alt_id":null}
]
```

## Was mit den heutigen Aufgaben passiert

Die alten Aufgaben haben keine eigenen IDs. Darum verweist `alt_id` auf das Spiel und die Stelle: `/1` bis `/4` ist die Reihenfolge in `CLIMATE`, die Wörter sind die Felder von „Wetter-Zeichen“.

**Klima-Detektiv: alle vier bleiben, die Fragen sind umgeschrieben, die richtige Antwort bleibt gleich.**
- `/1` „Hier liegt Deutschland. Jahreszeiten unterscheiden sich deutlich. Welcher Klimagürtel passt?“ wird `wetter-zone-gemaessigt`. Richtig bleibt „Gemäßigte Zone“, Stufe Entdecker.
- `/2` „Rund um den Äquator erreicht das ganze Jahr viel Sonnenenergie den Boden …“ wird `wetter-zone-tropen`. Richtig bleibt „Tropen“, Entdecker.
- `/3` „Niedriger Sonnenstand, lange Winter, nahe den Polen …“ wird `wetter-zone-polar`. Richtig bleibt „Polarzone“, Entdecker.
- `/4` „Zwischen Tropen und gemäßigten Gebieten … viele heiße Wüsten …“ wird `wetter-zone-subtropen`. Richtig bleibt „Subtropen“, jetzt Profi: „Tropen“ ist eine echte Falle.
- Gründe: „Klimagürtel“ wird überall zu „Klimazone“ (gängiger im Unterricht, wird einmal erklärt). Die Fragen sind kürzer und ohne Fachwort wie „Sonnenenergie“. Jede Frage hat eine vierte Antwort. Weggefallen sind die alten Nebensätze „Wetter und Landschaft sind dort trotzdem nicht überall gleich“ und „Breite allein bestimmt das Klima nicht vollständig“. Den zweiten Gedanken trägt jetzt die Experte-Aufgabe `wetter-berg-eis`.

**Wetter-Zeichen: alle fünf Zuordnungen bleiben als Fragen, umgeschrieben.**
- Regen, Schnee und Wind: Die richtige Antwort bleibt dasselbe Wort.
- Sonne wird „Sonnig“, weil die Frage jetzt „Wie ist das Wetter?“ heißt.
- Wolke: Die Richtung ist umgedreht. Früher hieß es Beschreibung → „Wolke“, jetzt „Woraus besteht eine Wolke?“, auf Profi mit der häufigen Fehlvorstellung „unsichtbarer Wasserdampf“ als Falle.
- Die fünf Erklärsätze sind neu gefasst; der Gedanke „sonnig kann warm oder kalt sein“ ist übernommen.

**Gestrichen:** nichts.
**Neu:** `wetter-nebel`, `wetter-klima-wort`, `wetter-satz-heute`, `wetter-satz-klima`, `wetter-ein-tag`, `wetter-berg-eis`.

## Umformuliert (alt → neu)

Die richtige Antwort wird nirgends eine andere. Nur der Wortlaut ändert sich:
- Wetter-Zeichen, Ziel „Sonne“ → „Sonnig“.
- Wetter-Zeichen, Ziel „Wolke“ → „Aus kleinen Tropfen oder Eis“ (neue Frage).
- Klima-Detektiv: Die vier Fragetexte sind neu (siehe oben), die Antwortwörter bleiben.

Keiner dieser Texte steht in `tests/fixtures/gespeicherte-antworten*.json`. Gespeichert sind aber Spielstände:
- Klima-Detektiv speichert ganze Frage-Objekte (`items`, eingelesen mit `restoreQuestions`).
- Wetter-Zeichen speichert die Namen der Karten (`items`, `found`).

Du musst entscheiden, ob alte Runden zu Ende laufen oder neu starten.

## Zahlen (nachgezählt mit `node -e`)

- **Stufen:** 9 Entdecker, 4 Profi, 2 Experte, zusammen 15.
- **Alle 15 mit 4 Antworten:** Die richtige Antwort ist 2-mal die einzige längste (13 %) und 2-mal die einzige kürzeste (13 %).
- **Die 9 Entdecker-Aufgaben mit 3 Antworten:** 2-mal die einzige längste (22 %), 3-mal die einzige kürzeste (33 %). Alles liegt unter der Grenze von 45 %.
- **Tipps:** Kein Tipp enthält die richtige Antwort wörtlich.
- **Satzlänge:** Jeder Satz in den Fragen hat höchstens 11 Wörter.
- **Übertreibungen:** „immer“ und „nie“ stehen nur in falschen Antworten. In jeder dieser Aufgaben gibt es noch eine weitere falsche Antwort ohne Übertreibung.
- **Hinweis zu den Zonen:** Der lange Name „Gemäßigte Zone“ macht in `wetter-zone-gemaessigt` die richtige Antwort zur einzigen längsten. Bei „Tropen“ ist es umgekehrt, dort ist sie die einzige kürzeste. Das liegt an den festen Namen der Zonen. Bei Bedarf ginge eine einheitliche Reihe: Tropische, Subtropische, Gemäßigte, Polare Zone. Das wäre aber weniger kindnah und hieße, alle vier richtigen Antworten umzuformulieren.

---

# Teil 2: „Sortiere die Zeit“ (`world:chronology`)

Die fünf heutigen Ereignisse behalten ihre heutigen IDs (Karten-IDs); bei ihnen ist `alt_id` gleich `id`. Ihre richtige Reihenfolge bleibt gleich: 105 < 1450 < 1825 < 1969 < 1989. Neue Ereignisse heißen `zeit-...`.

```json
[
 {"id":"zeit-schrift","name":"Menschen schreiben auf Tontafeln","jahr":-3200,"jahr_text":"etwa 3200 v. Chr.","karte":"history-writing","gruppe":null,"quellen":[{"titel":"The Metropolitan Museum of Art · The Origins of Writing","url":"https://www.metmuseum.org/essays/the-origins-of-writing"}],"alt_id":null},
 {"id":"zeit-pyramide","name":"Die große Pyramide von Gizeh","jahr":-2550,"jahr_text":"um 2550 v. Chr.","karte":"history-pyramids","gruppe":null,"quellen":[{"titel":"Harvard University · Digital Giza","url":"https://giza.fas.harvard.edu/commontopics/"},{"titel":"Ägyptisches Ministerium für Tourismus und Altertümer · The Great Pyramid","url":"https://egymonuments.gov.eg/en/monuments/the-great-pyramid"}],"alt_id":null},
 {"id":"history-paper","name":"Papier aus China wird verbessert","jahr":105,"jahr_text":"um 105 n. Chr.","karte":"history-paper","gruppe":null,"quellen":[{"titel":"Robert C. Williams Museum of Papermaking · Early Papermaking in China","url":"https://paper.gatech.edu/early-papermaking"},{"titel":"Berkshire China Encyclopedia · Cai Lun","url":"https://www.berkshirepublishing.com/ecph-china/2017/12/27/cai-lun-121-ce/"}],"alt_id":"history-paper"},
 {"id":"history-printing","name":"Buchdruck mit beweglichen Buchstaben","jahr":1450,"jahr_text":"um 1450","karte":"history-printing","gruppe":"buch-bis-bahn","quellen":[{"titel":"Stadt Mainz / Gutenberg.de · Zeitleiste Gutenberg","url":"https://www.gutenberg.de/zeit/zeitleiste_gutenberg"}],"alt_id":"history-printing"},
 {"id":"zeit-fernrohr","name":"Erstes Fernrohr in den Niederlanden","jahr":1608,"jahr_text":"1608","karte":"invention-telescope","gruppe":"buch-bis-bahn","quellen":[{"titel":"Linda Hall Library · Scientist of the Day: Hans Lipperhey","url":"https://www.lindahall.org/about/news/scientist-of-the-day/hans-lipperhey/"}],"alt_id":null},
 {"id":"zeit-dampfmaschine","name":"Eine Dampfmaschine pumpt Wasser","jahr":1712,"jahr_text":"1712","karte":"history-steam","gruppe":"buch-bis-bahn","quellen":[{"titel":"Science Museum Group · Desaguliers' Newcomen engine model","url":"https://collection.sciencemuseumgroup.org.uk/objects/co2000/demainbrays-newcomen-engine-model"}],"alt_id":null},
 {"id":"history-railway","name":"Erste öffentliche Bahn mit Dampflok","jahr":1825,"jahr_text":"1825","karte":"history-railway","gruppe":"buch-bis-bahn","quellen":[{"titel":"National Railway Museum · Shildon and Locomotion No. 1","url":"https://blog.railwaymuseum.org.uk/shildon-the-cradle-of-the-railways-and-locomotion-no-1/"}],"alt_id":"history-railway"},
 {"id":"zeit-telefon","name":"Bell meldet das Telefon an","jahr":1876,"jahr_text":"1876","karte":"invention-phone","gruppe":"motoren","quellen":[{"titel":"Library of Congress · Information Bulletin (Bell Papers)","url":"https://www.loc.gov/loc/lcib/0404/digitize.html"},{"titel":"National Museums Scotland · Did Alexander Graham Bell invent the telephone?","url":"https://www.nms.ac.uk/discover-catalogue/did-alexander-graham-bell-invent-the-telephone"}],"alt_id":null},
 {"id":"zeit-auto","name":"Benz meldet sein Auto an","jahr":1886,"jahr_text":"1886","karte":"invention-car","gruppe":"motoren","quellen":[{"titel":"DPMA · Postergalerie: Automobil","url":"https://www.dpma.de/docs/postergalerieneu/06_automobil.pdf"}],"alt_id":null},
 {"id":"zeit-flugzeug","name":"Erster gesteuerter Flug mit Motor","jahr":1903,"jahr_text":"1903","karte":"history-flight","gruppe":"motoren","quellen":[{"titel":"Smithsonian National Air and Space Museum · 1903 Wright Flyer","url":"https://airandspace.si.edu/collection-objects/1903-wright-flyer/nasm_A19610048000"}],"alt_id":null},
 {"id":"zeit-rakete","name":"Erste Rakete mit flüssigem Treibstoff","jahr":1926,"jahr_text":"1926","karte":"invention-rocket","gruppe":"motoren","quellen":[{"titel":"NASA · 95 Years Ago: Goddard's First Liquid-Fueled Rocket","url":"https://www.nasa.gov/history/95-years-ago-goddards-first-liquid-fueled-rocket/"}],"alt_id":null},
 {"id":"zeit-satellit","name":"Erster Satellit kreist um die Erde","jahr":1957,"jahr_text":"1957","karte":"invention-satellite","gruppe":"weltall-netz","quellen":[{"titel":"NASA · Dawn of the Space Age","url":"https://www.nasa.gov/history/dawn-of-the-space-age/"}],"alt_id":null},
 {"id":"history-apollo11","name":"Menschen landen auf dem Mond","jahr":1969,"jahr_text":"1969","karte":"history-apollo11","gruppe":"weltall-netz","quellen":[{"titel":"NASA · Apollo 11 Mission Overview","url":"https://www.nasa.gov/history/apollo-11-mission-overview/"}],"alt_id":"history-apollo11"},
 {"id":"history-web","name":"Das World Wide Web entsteht","jahr":1989,"jahr_text":"1989 (erster Plan)","karte":"history-web","gruppe":"weltall-netz","quellen":[{"titel":"CERN · A short history of the Web","url":"https://home.cern/science/computing/the-birth-of-the-web/short-history-web/"}],"alt_id":"history-web"},
 {"id":"zeit-iss","name":"Erste Besatzung zieht in die ISS","jahr":2000,"jahr_text":"2000","karte":"history-iss","gruppe":"weltall-netz","quellen":[{"titel":"NASA · Expedition 1 kicks off science aboard the ISS","url":"https://www.nasa.gov/missions/station/iss-research/expedition-1-kicks-off-science-aboard-international-space-station/"}],"alt_id":null}
]
```

**Ein Ersatz-Ereignis**, falls eine vierte Gruppe „ganz früh“ gewünscht ist (Schrift, Pyramide, Papier, Null; dann 16 Ereignisse):

```json
{"id":"zeit-null","name":"Regeln zum Rechnen mit Null","jahr":628,"jahr_text":"628 n. Chr.","karte":"history-zero","gruppe":"ganz-frueh","quellen":[{"titel":"University of St Andrews, MacTutor · Brahmagupta","url":"https://mathshistory.st-andrews.ac.uk/Biographies/Brahmagupta/"}],"alt_id":null}
```

Dann bekämen auch `zeit-schrift`, `zeit-pyramide` und `history-paper` die Gruppe `ganz-frueh`.

## Gruppen für Experte (je 4 Ereignisse nah beieinander), mit zwei Tipps

```json
[
 {"gruppe":"buch-bis-bahn","ereignisse":["history-printing","zeit-fernrohr","zeit-dampfmaschine","history-railway"],"tipp":"Was musste es geben, damit eine Dampflok fahren kann?","tipp2":"Die Dampfmaschine kam vor der Eisenbahn. Was davon ist noch älter?"},
 {"gruppe":"motoren","ereignisse":["zeit-telefon","zeit-auto","zeit-flugzeug","zeit-rakete"],"tipp":"Überlege: Was ist schwerer zu bauen, ein Auto, ein Flugzeug oder eine Rakete?","tipp2":"Das Telefon ist das Älteste in dieser Gruppe."},
 {"gruppe":"weltall-netz","ereignisse":["zeit-satellit","history-apollo11","history-web","zeit-iss"],"tipp":"Bevor Menschen ins All fliegen, muss erst etwas ohne Menschen hinauf.","tipp2":"Das Web entstand 20 Jahre nach der Mondlandung."}
]
```

Abstände in den Gruppen:
- buch-bis-bahn: 1450 bis 1825.
- motoren: 1876 bis 1926.
- weltall-netz: 1957 bis 2000.

Die ersten Tipps setzen auf echte Abhängigkeiten: Dampflok braucht Dampfmaschine, Satellit kommt vor Menschen im All. Das macht Experte zu einer Denkaufgabe und nicht nur zu einer Wissensfrage.

## Was mit den heutigen Ereignissen passiert

- **Alle fünf bleiben** mit ihrer ID: `history-paper`, `history-printing`, `history-railway`, `history-apollo11`, `history-web`. Die richtige Reihenfolge ist gleich.
- **Umgeschrieben ist nur die Anzeige.** Heute zeigt das Spiel Kartentitel und Kartendatum. Neu sind ein kurzer Ereignisname und ein ehrliches `jahr_text`.
- **Gespeichert** werden heute nur die IDs in ihrer Reihenfolge (`items`). Ein Alias für Antworttexte ist darum nicht nötig. Ein alter Spielstand mit 5 Teilen passt aber nicht zu Runden mit 3 oder 4 Teilen: Die Prüfung `items.length===5` muss angepasst werden.
- **Gestrichen:** nichts.
- **Neu:** 10 Ereignisse. Jedes passt zu genau einer vorhandenen Karte; keine Karte kommt doppelt vor.

## „Zeitanker“ kommt noch hier vor (Vorschläge)

- `app/parent-guide.tsx`, Zeile 9: „historischen Zeitankern“ → „wichtigen Jahreszahlen der Geschichte“.
- `app/world-catalog.json`, `sourceNote`: 8 Erfindungskarten haben „Ein Zeitanker ist nicht immer ein genauer Erfindungstag.“ → „Eine Jahreszahl nennt nicht immer den genauen Tag einer Erfindung.“ Dazu kommt `history-writing`: „Der Zeitanker ist ungefähr“ → „Die Jahreszahl ist ungefähr“.
- Diese Texte sagen „fünf“, das stimmt dann nicht mehr:
  - `app/game-index.json` und `app/world-games.tsx`, Zeile 27: „Was kam zuerst? Ordne fünf Erfindungen und Ereignisse.“ → „Was kam zuerst? Ordne Erfindungen und Ereignisse.“
  - `app/world-progress.tsx`, Zeile 11, Mission „Zeitreisender“: „Ordne fünf Ereignisse im Zeitspiel.“ → „Ordne Ereignisse im Zeitspiel richtig.“

## Zahlen Teil 2

- 15 Ereignisse, 12 davon in 3 Gruppen zu je 4, dazu 3 sehr frühe ohne Gruppe.
- Die Zählung „längste/kürzeste“ entfällt, weil es keine Antworten zum Auswählen gibt.
- Alle Namen haben höchstens 6 Wörter.

---

# Was der `fakten-pruefer` besonders prüfen soll

1. ⚠ **`zeit-pyramide`:** Für die Große Pyramide nennen viele Quellen etwa 2560 v. Chr. Die Karte `history-pyramids` sagt „um 2550 v. Chr.“. Ich habe die Karte übernommen, damit Spiel und Karte gleich sind. Die Harvard-Seite habe ich nicht geöffnet.
2. ⚠ **`zeit-schrift`:** Die Seite des Met war gerade nicht erreichbar (Fehler 429). Ich vermute dort etwa 3400 bis 3200 v. Chr.; die Karte sagt 3200 bis 3000. Bitte „etwa 3200 v. Chr.“ bestätigen.
3. ⚠ **`history-paper`:** 105 n. Chr. ist das überlieferte Jahr der Verbesserung, Papier selbst ist älter. Ist „um 105“ richtig?
4. ⚠ **`zeit-telefon` und `zeit-auto`:** Beide Namen sagen „meldet an“. Gemeint ist das Patent: Bell hat den Antrag am 14.02.1876 gestellt und das Patent am 07.03.1876 bekommen. Benz hat am 29.01.1886 angemeldet, erteilt wurde am 02.11.1886. Die Seiten von NMS und Mercedes-Benz gaben mir 403 zurück; die Daten habe ich nur aus Suchergebnissen von LOC und DPMA.
5. ⚠ **`zeit-fernrohr`:** 1608 ist der Patentantrag von Lipperhey vom 02.10.1608. Das Patent wurde nicht erteilt, und es gab weitere Antragsteller. „Erstes Fernrohr“ meint die erste schriftliche Erwähnung. Ist der Name so vertretbar?
6. ⚠ **`wetter-berg-eis`:** Die NASA-Seite sagt „in the tropics“, nicht „nahe am Äquator“; der Berg liegt bei etwa 3 Grad Süd. Bitte die Lage belegen (Britannica gab 403). Und bitte prüfen, ob auf dem Gipfel 2026 noch Eis liegt: NASA rechnete 2012 damit, dass es etwa 2040 bis 2060 verschwindet.
7. ⚠ **`wetter-zone-subtropen`:**
   - Der Tipp „Der Norden der Sahara liegt in dieser Zone“ stützt sich auf Britannica (Norden trocken-subtropisch, Süden trocken-tropisch). Die Britannica-Seite habe ich nur über die Suche gesehen.
   - Das Vier-Zonen-Modell der Schule lässt die Subpolarzone weg; das ist vereinfacht.
   - Die NOAA-Einteilung (Köppen) legt trockene Klimate auf 20 bis 35 Grad. Das stützt „viele heiße Wüsten“.
8. ⚠ **`wetter-zone-tropen`:** Stimmt „steht die Sonne das ganze Jahr hoch“? Belegt ist das mit dem Lehrtext der Ohio University. „Hoch“ ist bewusst ungenau, dort steht „noon sun always high“.
9. ⚠ **`wetter-nebel`:** „Raureif“ ist ein deutscher Fachbegriff. Die NWS-Quelle beschreibt „frost“, das entspricht eher „Reif“. Vielleicht passt das Lexikon des Deutschen Wetterdienstes besser. „Sitzt auf Gras und Zweigen“ bitte prüfen.
10. ⚠ **`wetter-wolke`:** Wolkentröpfchen bilden sich an Staub-, Salz- oder Rauchteilchen (USGS). Die falsche Antwort „Aus Rauch von vielen Feuern“ ist trotzdem falsch, weil eine Wolke aus Wasser besteht. Bitte prüfen, ob ein Kind das falsch verstehen kann.
11. ⚠ **`wetter-satz-heute`:** Die falschen Antworten sollen wahre Klima-Sätze sein. Für „In Deutschland gibt es vier Jahreszeiten“ habe ich keine eigene Quelle, das ist Alltagswissen. „Im Regenwald regnet es sehr oft“ ist belegt (Ohio University). NOAA nennt aber Regenwälder mit einigen trockenen Monaten; „sehr oft“ ist darum bewusst ohne „immer“.
12. **`wetter-zone-gemaessigt`:** „Kalte Winter“ ist für Deutschland vereinfacht. Die Quelle sagt nur „gemäßigtes Klima“.
13. **`wetter-sonnig`:** „Sonnig kann warm oder kalt sein“ ist Alltagswissen ohne eigene Quelle.

Diese Quellen habe ich selbst geöffnet und den Wortlaut geprüft:
- NOAA: Wetter und Klima, Wind, Luftschichten, Klimazonen.
- NASA Kids Wolken, NSIDC Schnee und Arktis, NSSL Hagel.
- NWS: Nebel, Tau, Reif und Begriffe für den Himmel.
- USGS Niederschlag, NASA Kilimandscharo, Tatsachen über Deutschland.
- CERN, NASA Goddard, Linda Hall, Science Museum (1712), Gutenberg.de.

Die übrigen Quellen sind die Kartenquellen und waren schon geprüft.

Nicht erreichbar waren:
- `scijinks.gov` und `www.cabinet.ox.ac.uk`: Diese Adressen sind in den Netzwerkeinstellungen dieser Sitzung nicht freigegeben und wurden nicht verwendet.
- Britannica, Mercedes-Benz und NMS gaben 403 zurück, das Met gab 429.

Wikimedia habe ich nicht abgefragt.

# Offen (das musst du entscheiden)

1. **Unter welcher ID läuft „Wetter und Klima“?** Möglich ist `extra:climate-detective` oder eine neue Spiel-ID. Der andere alte Link führt dann dorthin, und beide Stempel bleiben.
2. **Wer zieht welche Aufgaben?** Mein Vorschlag:
   - Entdecker zieht nur Entdecker-Aufgaben (9) mit 3 Antworten.
   - Profi zieht Entdecker- und Profi-Aufgaben (13) mit 4 Antworten.
   - Experte zieht die 2 Experte-Aufgaben und füllt mit Profi auf.
   - Für eine eigene Experte-Runde sind 2 Aufgaben zu wenig. Eine Alternative nach E3 wäre, die beiden Aufgaben auf Profi nur gelegentlich einzustreuen.
3. **Jahreszahlen beim Sortieren verstecken.** Heute zeigt das Spiel das Datum neben jedem Teil, so ist die Aufgabe nur Ablesen. Mein Vorschlag:
   - Jahre erst nach „Meine Reihenfolge prüfen“ zeigen.
   - Dann muss auch die Rückmeldung „Schau auf die Jahreszahlen.“ neu werden, etwa „Noch nicht ganz. Was war zuerst da?“.
   - Das sollen `kinder-redaktion` und `stufen-pruefer` mit beurteilen.
4. **Entdecker beim Sortieren:** Damit die 3 Teile wirklich weit auseinanderliegen, schlage ich vor, je eines aus „sehr früh“ (vor 1000), „Mittelzeit“ (1450 bis 1825) und „neu“ (ab 1876) zu ziehen. Profi zieht 4 Teile aus mindestens drei dieser Zeiten.
5. **IDs:** Jedes neue Ereignis passt zu genau einer Karte. Das Spiel könnte darum auch weiter Karten-IDs benutzen, statt `zeit-...`. Ich habe wie gewünscht `zeit-...` vergeben.
6. **Mehr als 15 Ereignisse?** Ob `zeit-null` als sechzehntes Ereignis dazukommt (vierte Gruppe), entscheidest du.
7. **Klimazonen-Namen:** Bleibt es bei der üblichen Reihe Tropen, Subtropen, Gemäßigte Zone, Polarzone (mein Vorschlag)? Dann gibt es das kleine Längenmuster aus den Zahlen oben.
8. **Wörter für die Redaktion:** Ist „Treibstoff“ (`zeit-rakete`) und „World Wide Web“ (wie der Kartentitel) für Kinder in Ordnung? „Patent“ habe ich bewusst durch „meldet an“ ersetzt.

Keine Datei geändert.
