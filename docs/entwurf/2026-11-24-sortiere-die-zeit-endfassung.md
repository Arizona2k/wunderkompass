# „Sortiere die Zeit“ (`world:chronology`): Endfassung des `karten-autor` (24.11.2026)

Entwurf des `karten-autor` nach der Entscheidung des Nutzers vom 24.11.2026 (Entscheidungsliste „drei Spiele“, C3). Der Helfer hat keine Datei geändert. **Geprüft ist noch nichts:** Als Nächstes lesen `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer` (Berichte folgen als eigene Dateien).

Gelesen hat der Helfer: den ersten Entwurf `2026-11-24-wetter-zeit-karten-autor.md`, die Prüfberichte `2026-11-24-drei-spiele-kinder-redaktion.md`, `2026-11-24-wetter-zeit-fakten-pruefer.md`, `2026-11-24-drei-spiele-stufen-pruefer.md` (Punkte 23 bis 26), die Entscheidungsliste `2026-11-24-drei-spiele-entscheidungen.md`, E3/E4/E14 in `2026-11-23-phase-1-teilschritt-3.md`, `app/kern/woerter.ts`, `Chronology` in `app/world-games.tsx`, die Fundstellen in `app/world-progress.tsx`, `app/game-index.json`, `app/playground-catalog.ts` und alle Karten mit Datum in `app/world-catalog.json`. Nachgezählt mit `node`.

## 1. Der Vorrat: 24 Teile

Felder: `korb` nur für Entdecker (`früh`, `mitte`, `spät`; `null` = nie auf Entdecker); `fenster` nur für Profi (`null` = nie auf Profi); `gruppe` nur für Experte; `altId` = alte ID aus `TIME_IDS` (alter Spielstand erkennbar); `erklaerung` freiwillig, eine kleine Zeile nach dem Prüfen.

`jahrText`: Vor dem Jahr 1000 zuerst „vor etwa N Jahren“, die genaue Angabe in Klammern (größere Zahl heißt früher, niemand muss „v. Chr.“ verstehen). Ab dem Jahr 1000 nur die Jahreszahl. Gerechnet ab 2026, auf 50 oder 100 gerundet.

```json
[
 {"id":"zeit-steinwerkzeug","name":"Die ersten bekannten Steinwerkzeuge entstehen","jahr":-3300000,"jahrText":"vor etwa 3,3 Millionen Jahren","zeitwort":"vor sehr, sehr langer Zeit","korb":"früh","fenster":null,"gruppe":null,"karte":"history-stone_tools","quelle":[{"titel":"Harmand u. a., Nature 2015 (PubMed): 3.3-million-year-old stone tools from Lomekwi 3","url":"https://pubmed.ncbi.nlm.nih.gov/25993961/"},{"titel":"Natural History Museum London","url":"https://www.nhm.ac.uk/discover/news/2023/february/oldest-remains-ancient-human-relative-paranthropus-suggest-possible-tool-use.html"}]},
 {"id":"zeit-feuer","name":"Frühe Menschen nutzen Feuer","jahr":-790000,"jahrText":"vor mindestens 790.000 Jahren","zeitwort":"vor sehr, sehr langer Zeit","korb":"früh","fenster":null,"gruppe":null,"karte":"history-fire","quelle":[{"titel":"Smithsonian Human Origins Program · Hearths & Shelters","url":"https://humanorigins.si.edu/evidence/behavior/hearths-shelters"}]},
 {"id":"zeit-schrift","name":"Menschen beginnen, auf Tontafeln zu schreiben","jahr":-3200,"jahrText":"vor etwa 5.200 Jahren (um 3200 v. Chr.)","zeitwort":"vor sehr, sehr langer Zeit","korb":"früh","fenster":"ganz-frueh","gruppe":"ganz-frueh","karte":"history-writing","quelle":[{"titel":"ISAC Museum, University of Chicago (Google Arts & Culture) · Early Writing in Mesopotamia","url":"https://artsandculture.google.com/story/rwWhZTdobl0nLA"}]},
 {"id":"zeit-pyramide","name":"Die große Pyramide von Gizeh wird gebaut","jahr":-2550,"jahrText":"vor etwa 4.600 Jahren (um 2550 v. Chr.)","zeitwort":"vor sehr, sehr langer Zeit","korb":"früh","fenster":"ganz-frueh","gruppe":"ganz-frueh","karte":"history-pyramids","quelle":[{"titel":"Harvard University · Digital Giza","url":"https://giza.fas.harvard.edu/commontopics/"}]},
 {"id":"zeit-rom","name":"Rom bekommt seinen ersten Kaiser","jahr":-27,"jahrText":"vor etwa 2.050 Jahren (27 v. Chr.)","zeitwort":"vor sehr, sehr langer Zeit","korb":null,"fenster":"ganz-frueh","gruppe":"ganz-frueh","karte":"history-rome","quelle":[{"titel":"The Metropolitan Museum of Art · The Roman Empire (27 B.C.–393 A.D.)","url":"https://www.metmuseum.org/essays/the-roman-empire-27-b-c-393-a-d"}]},
 {"id":"zeit-papier","altId":"history-paper","name":"Papier aus China wird verbessert","jahr":105,"jahrText":"vor etwa 1.900 Jahren (im Jahr 105)","zeitwort":"vor sehr, sehr langer Zeit","korb":null,"fenster":"ganz-frueh","gruppe":"ganz-frueh","karte":"history-paper","quelle":[{"titel":"Robert C. Williams Museum of Papermaking (Georgia Tech) · Early Papermaking in China","url":"https://paper.gatech.edu/early-papermaking"}]},
 {"id":"zeit-null","name":"Rechenregeln für die Null werden aufgeschrieben","jahr":628,"jahrText":"vor etwa 1.400 Jahren (im Jahr 628)","zeitwort":"vor sehr, sehr langer Zeit","korb":null,"fenster":"ganz-frueh","gruppe":"ganz-frueh","karte":"history-zero","quelle":[{"titel":"University of St Andrews, MacTutor · Brahmagupta","url":"https://mathshistory.st-andrews.ac.uk/Biographies/Brahmagupta/"}]},
 {"id":"zeit-buchdruck","altId":"history-printing","name":"Gutenberg druckt Bücher mit Buchstaben aus Metall","jahr":1450,"jahrText":"um 1450","zeitwort":"vor ein paar hundert Jahren","korb":"mitte","fenster":"buch-bis-bahn","gruppe":"buch-bis-bahn","karte":"history-printing","quelle":[{"titel":"Stadt Mainz / Gutenberg.de · Zeitleiste Gutenberg","url":"https://www.gutenberg.de/zeit/zeitleiste_gutenberg"}]},
 {"id":"zeit-karibik","name":"Schiffe von Kolumbus erreichen die Karibik","jahr":1492,"jahrText":"1492","zeitwort":"vor ein paar hundert Jahren","korb":null,"fenster":"buch-bis-bahn","gruppe":"buch-bis-bahn","karte":"history-voyages1492","quelle":[{"titel":"Smithsonian National Museum of the American Indian · Columbus Day myths","url":"https://americanindian.si.edu/nk360/informational/columbus-day-myths"},{"titel":"Smithsonian NMAI · Mesoamerica and the Caribbean","url":"https://americanindian.si.edu/exhibitions/infinityofnations/mesoamerica-caribbean.html"}]},
 {"id":"zeit-fernrohr","name":"Ein Fernrohr wird zum ersten Mal beschrieben","jahr":1608,"jahrText":"1608","zeitwort":"vor ein paar hundert Jahren","korb":"mitte","fenster":"buch-bis-bahn","gruppe":"buch-bis-bahn","karte":"invention-telescope","quelle":[{"titel":"Linda Hall Library · Scientist of the Day: Hans Lipperhey","url":"https://www.lindahall.org/about/news/scientist-of-the-day/hans-lipperhey/"}]},
 {"id":"zeit-mikroskop","name":"Robert Hooke zeigt Bilder aus dem Mikroskop","jahr":1665,"jahrText":"1665","zeitwort":"vor ein paar hundert Jahren","korb":null,"fenster":"buch-bis-bahn","gruppe":"buch-bis-bahn","karte":"invention-microscope","quelle":[{"titel":"Science Museum Group · Hooke's compound microscope (copy), 1665–1675","url":"https://collection.sciencemuseumgroup.org.uk/objects/co8391/hookes-compound-microscope-copy-1665-1675"}]},
 {"id":"zeit-dampfmaschine","name":"Newcomens Dampfmaschine pumpt Wasser aus Bergwerken","jahr":1712,"jahrText":"1712","zeitwort":"vor ein paar hundert Jahren","korb":"mitte","fenster":"buch-bis-bahn","gruppe":"buch-bis-bahn","karte":"history-steam","quelle":[{"titel":"Science Museum Group · Desaguliers' Newcomen engine model","url":"https://collection.sciencemuseumgroup.org.uk/objects/co2000/demainbrays-newcomen-engine-model"}]},
 {"id":"zeit-eisenbahn","altId":"history-railway","name":"Die erste Dampf-Eisenbahn für alle fährt","jahr":1825,"jahrText":"1825","zeitwort":"vor ein paar hundert Jahren","korb":"mitte","fenster":"buch-bis-bahn","gruppe":"buch-bis-bahn","karte":"history-railway","quelle":[{"titel":"National Railway Museum · Shildon and Locomotion No. 1","url":"https://blog.railwaymuseum.org.uk/shildon-the-cradle-of-the-railways-and-locomotion-no-1/"}]},
 {"id":"zeit-aufzug","name":"Otis zeigt einen Aufzug mit Sicherheitsbremse","jahr":1854,"jahrText":"1854","zeitwort":"vor 100 bis 200 Jahren","korb":null,"fenster":null,"gruppe":"motoren","karte":"invention-elevator","quelle":[{"titel":"Otis · Our History (1853, 1854)","url":"https://www.otis.com/en/us/our-company/history"},{"titel":"National Register of Historic Places · Otis, PDF, Abschnitt 8","url":"https://npgallery.nps.gov/GetAsset/07a0f86d-5e38-4a69-96f7-45050d94f808"}]},
 {"id":"zeit-telefon","name":"Bell bekommt ein Patent auf das Telefon","jahr":1876,"jahrText":"1876","zeitwort":"vor 100 bis 200 Jahren","korb":null,"fenster":"motoren","gruppe":"motoren","karte":"invention-phone","erklaerung":"Ein Patent heißt: Andere dürfen die Erfindung nicht einfach nachbauen.","quelle":[{"titel":"Library of Congress · Information Bulletin (Bell Papers)","url":"https://www.loc.gov/loc/lcib/0404/digitize.html"}]},
 {"id":"zeit-auto","name":"Benz bekommt ein Patent auf sein Auto","jahr":1886,"jahrText":"1886","zeitwort":"vor 100 bis 200 Jahren","korb":null,"fenster":"motoren","gruppe":"motoren","karte":"invention-car","erklaerung":"Ein Patent heißt: Andere dürfen die Erfindung nicht einfach nachbauen.","quelle":[{"titel":"DPMA · Postergalerie: Automobil","url":"https://www.dpma.de/fileadmin/user_upload/Dokumente/Entdecken/Postergalerie/06_automobil.pdf"}]},
 {"id":"zeit-flugzeug","name":"Das erste Flugzeug mit Motor fliegt gesteuert","jahr":1903,"jahrText":"1903","zeitwort":"vor 100 bis 200 Jahren","korb":null,"fenster":"motoren","gruppe":"motoren","karte":"history-flight","quelle":[{"titel":"Smithsonian NASM · 1903 Wright Flyer","url":"https://airandspace.si.edu/collection-objects/1903-wright-flyer/nasm_A19610048000"},{"titel":"Smithsonian NASM · The Flight of the Airplane","url":"https://airandspace.si.edu/explore/stories/flight-airplane"}]},
 {"id":"zeit-rakete","name":"Die erste Rakete mit flüssigem Treibstoff fliegt","jahr":1926,"jahrText":"1926","zeitwort":"vor 100 bis 200 Jahren","korb":null,"fenster":"motoren","gruppe":"motoren","karte":"invention-rocket","quelle":[{"titel":"NASA · 95 Years Ago: Goddard's First Liquid-Fueled Rocket","url":"https://www.nasa.gov/history/95-years-ago-goddards-first-liquid-fueled-rocket/"}]},
 {"id":"zeit-satellit","name":"Der erste Satellit kreist um die Erde","jahr":1957,"jahrText":"1957","zeitwort":"als Oma und Opa jung waren","korb":"spät","fenster":"weltall-netz","gruppe":"weltall-netz","karte":"invention-satellite","quelle":[{"titel":"NASA · Dawn of the Space Age","url":"https://www.nasa.gov/history/dawn-of-the-space-age/"}]},
 {"id":"zeit-mondlandung","altId":"history-apollo11","name":"Menschen landen auf dem Mond","jahr":1969,"jahrText":"1969","zeitwort":"als Oma und Opa jung waren","korb":"spät","fenster":"weltall-netz","gruppe":"weltall-netz","karte":"history-apollo11","quelle":[{"titel":"NASA · Apollo 11 Mission Overview","url":"https://www.nasa.gov/history/apollo-11-mission-overview/"}]},
 {"id":"zeit-internetseiten","altId":"history-web","name":"Der Plan für Internetseiten entsteht","jahr":1989,"jahrText":"1989","zeitwort":"als Oma und Opa jung waren","korb":"spät","fenster":"weltall-netz","gruppe":"weltall-netz","karte":"history-web","quelle":[{"titel":"CERN · A short history of the Web","url":"https://home.cern/science/computing/the-birth-of-the-web/short-history-web/"}]},
 {"id":"zeit-smartphone","name":"Das erste Smartphone wird vorgestellt","jahr":1993,"jahrText":"1993","zeitwort":"als Oma und Opa jung waren","korb":null,"fenster":"weltall-netz","gruppe":"weltall-netz","karte":"invention-smartphone","quelle":[{"titel":"Computer History Museum · IBM/BellSouth Simon Personal Communicator","url":"https://www.computerhistory.org/revolution/artifact/1733"}]},
 {"id":"zeit-iss","name":"Die erste Besatzung zieht in die Raumstation ISS","jahr":2000,"jahrText":"2000","zeitwort":"als Mama und Papa Kinder waren","korb":null,"fenster":"weltall-netz","gruppe":"weltall-netz","karte":"history-iss","quelle":[{"titel":"NASA · Expedition 1 kicks off science aboard the ISS","url":"https://www.nasa.gov/missions/station/iss-research/expedition-1-kicks-off-science-aboard-international-space-station/"}]},
 {"id":"zeit-webb","name":"Das Weltraum-Teleskop Webb zeigt seine ersten Bilder","jahr":2022,"jahrText":"2022","zeitwort":"vor ein paar Jahren","korb":null,"fenster":"weltall-netz","gruppe":"weltall-netz","karte":"history-webb","quelle":[{"titel":"NASA · NASA Reveals Webb Telescope's First Images of Unseen Universe","url":"https://science.nasa.gov/missions/webb/nasa-reveals-webb-telescopes-first-images-of-unseen-universe/"}]}
]
```

Alle 24 Kartenverweise gibt es im Katalog, jede Karte kommt nur einmal vor. Keine `zeit-`ID gibt es bisher im Code.

## 2. Zeitwörter und Körbe

Sechs Zeitwörter, jedes für einen festen Zeitraum, nach dem Prüfen auf jeder Stufe neben der Jahreszahl. Gerechnet ab 2026.

| Zeitwort (fester Wortlaut) | Jahre | Entdecker-Korb | Teile |
|---|---|---|---|
| vor sehr, sehr langer Zeit | bis 999 n. Chr. | **früh** | Steinwerkzeuge, Feuer, Schrift, Pyramide (nur Profi/Experte: Rom, Papier, Null) |
| vor ein paar hundert Jahren | 1400 bis 1826 (mindestens 200 Jahre her) | **mitte** | Buchdruck, Fernrohr, Dampfmaschine, Eisenbahn (nur Profi/Experte: Karibik, Mikroskop) |
| vor 100 bis 200 Jahren | 1827 bis 1926 | – | Aufzug, Telefon, Auto, Flugzeug, Rakete |
| als Oma und Opa jung waren | 1950 bis 1995 | **spät** | Satellit, Mondlandung, Internetseiten (nur Profi/Experte: Smartphone) |
| als Mama und Papa Kinder waren | 1996 bis 2012 | – | ISS |
| vor ein paar Jahren | ab 2013 | – | Webb |

Entdecker: je Rätsel ein Teil aus jedem Korb, 4 × 4 × 3 = **48 Rätsel**, 2 Rätsel ohne gemeinsame Teile = **432 Runden**. Kleinster Abstand in einem Entdecker-Rätsel **132 Jahre** (Eisenbahn 1825 und Satellit 1957). Mit dem Abstand des stufen-pruefer (245 Jahre) fällt die Eisenbahn aus dem Korb `mitte`: 36 Rätsel, kleinster Abstand 245 Jahre (Dampfmaschine 1712 und Satellit 1957).

„vor 100 bis 200 Jahren“ statt „vor mehr als hundert Jahren“: Die Rakete (1926) ist 2026 genau 100 Jahre her. Dieses Zeitwort sieht Entdecker nie als Tipp.

## 3. Texte je Stufe (fertiger Wortlaut)

```json
{
 "spielliste": "Was kam zuerst? Bring Erfindungen und Ereignisse in die richtige Reihenfolge.",
 "missionZeitreisender": "Löse eine Runde im Zeitspiel.",
 "eyebrow": "DEINE ZEITMASCHINE",
 "ueberschrift": "Was kam zuerst?",
 "zaehler": "Rätsel {n} von 2",
 "einleitung": {
  "entdecker": "Ordne von früher nach später. Was zuerst kam, steht ganz oben.",
  "profi": "Ordne von früher nach später. Die Jahreszahlen siehst du nach dem Prüfen.",
  "experte": "Ordne von früher nach später. Diese vier liegen nah beieinander."
 },
 "pruefKnopf": "Meine Reihenfolge prüfen",
 "vorlesenKnopf": "Stationen vorlesen",
 "tipp": {
  "knopf": "WOERTER.tipp (Brauchst du einen Tipp?)",
  "entdecker": "Unter jedem Teil steht jetzt, wann es ungefähr war.",
  "profi": "Ein Tipp: {name} – das war {jahrText}.",
  "experte": "erster Tipp der Gruppe, dann WOERTER.nochEinTipp für den zweiten (Abschnitt 4)"
 },
 "fehler": {
  "entdecker_keins": "Noch nicht ganz. Versuch es noch einmal!",
  "entdecker_eins": "Das grüne Teil steht schon richtig. Schieb die anderen.",
  "profi_0": "Noch keins steht richtig.",
  "profi_1": "1 von 4 steht richtig.",
  "profi_2": "2 von 4 stehen richtig.",
  "experte": "Noch nicht ganz. Was war zuerst da?"
 },
 "richtig": "Richtig! Alles steht von früher nach später.",
 "weiterKnopf": "Weiter zum zweiten Rätsel",
 "geschafft": "Geschafft! Beide Rätsel sind gelöst.",
 "gespeichert": "Zeitspiel gelöst und gespeichert.",
 "nachDemPruefen": "{jahrText} · {zeitwort}",
 "vChrErklaerung": "v. Chr. heißt „vor Christus“. Gemeint ist: vor dem Jahr 1."
}
```

Anmerkungen:
- **Entdecker, Fehler:** Bei 3 Teilen stehen nach einem Prüfen 0, 1 oder alle 3 richtig (nie genau 2). Grüne Teile sind gesperrt. „Noch nicht ganz. Versuch es noch einmal!“ ist wörtlich `WOERTER.nochNicht`.
- **Profi, Fehler:** Bei 4 Teilen nach einem Fehlversuch 0, 1 oder 2 richtige, nie genau 3. Bei „1“ die Einzahl.
- **Experte:** genau der Satz des Nutzers, nicht an `WOERTER.nochNicht` angehängt (sonst „Noch nicht ganz“ doppelt).
- **Vorlesen:** Vor dem Prüfen liest „Stationen vorlesen“ nur die Namen, keine Jahreszahlen (heute liest der Knopf `t.history.date` mit vor und verrät die Lösung).
- **Profi, Tipp:** zeigt die Jahreszahl eines Teils; Vorschlag: eines, das gerade falsch steht, sonst das zweitälteste.
- **`erklaerung` beim Patent:** Zeile bei Telefon und Auto (nur Profi und Experte). Ersatz ohne „Patent“: „Bell darf sein Telefon als Erfindung schützen lassen“, „Benz darf sein Auto als Erfindung schützen lassen“.
- **`vChrErklaerung`** freiwillig, einmal, wenn ein Teil mit „v. Chr.“ im Rätsel war.

## 4. Experte: 4 Gruppen mit Tipps

Je Rätsel 4 Teile aus einer Gruppe, je Runde aus zwei verschiedenen Gruppen. Jeder Tipp hat eine Bedingung `braucht`: Gezeigt wird der erste Tipp der Liste, dessen Teile alle im Rätsel sind. Am Ende von Tipp 1 ein allgemeiner Satz, am Ende von Tipp 2 eine Vorlage mit dem ältesten gezogenen Teil. Tipp 1 verrät nie die ganze Reihenfolge.

```json
[
 {"gruppe":"ganz-frueh","titel":"Ganz früh","teile":["zeit-schrift","zeit-pyramide","zeit-rom","zeit-papier","zeit-null"],
  "tipp1":[
   {"braucht":["zeit-schrift","zeit-pyramide"],"text":"Beim Bau der großen Pyramide schrieb ein Aufseher ein Tagebuch."},
   {"braucht":[],"text":"Frag dich bei jedem Teil: Was musste es vorher schon geben?"}],
  "tipp2":[
   {"braucht":["zeit-papier","zeit-null"],"text":"Papier ist älter als die Rechenregeln für die Null."},
   {"braucht":["zeit-pyramide","zeit-rom"],"text":"Die große Pyramide war schon über 2.000 Jahre alt. Erst dann bekam Rom seinen ersten Kaiser."},
   {"braucht":[],"vorlage":"Ganz nach oben gehört: {name}."}]},
 {"gruppe":"buch-bis-bahn","titel":"Vom Buchdruck zur Eisenbahn","teile":["zeit-buchdruck","zeit-karibik","zeit-fernrohr","zeit-mikroskop","zeit-dampfmaschine","zeit-eisenbahn"],
  "tipp1":[
   {"braucht":["zeit-dampfmaschine","zeit-eisenbahn"],"text":"Was musste es geben, damit eine Dampflok fahren kann?"},
   {"braucht":["zeit-karibik","zeit-fernrohr"],"text":"Kolumbus hatte noch kein Fernrohr an Bord."},
   {"braucht":["zeit-buchdruck","zeit-mikroskop"],"text":"Robert Hooke ließ seine Mikroskop-Bilder als Buch drucken."},
   {"braucht":[],"text":"Frag dich bei jedem Teil: Was musste es vorher schon geben?"}],
  "tipp2":[
   {"braucht":[],"vorlage":"Ganz nach oben gehört: {name}."}]},
 {"gruppe":"motoren","titel":"Vom Aufzug zur Rakete","teile":["zeit-aufzug","zeit-telefon","zeit-auto","zeit-flugzeug","zeit-rakete"],
  "tipp1":[
   {"braucht":["zeit-auto","zeit-flugzeug","zeit-rakete"],"text":"Erst auf der Straße, dann in der Luft, dann in Richtung Weltall."},
   {"braucht":["zeit-auto","zeit-flugzeug"],"text":"Erst auf der Straße, dann in der Luft."},
   {"braucht":["zeit-flugzeug","zeit-rakete"],"text":"Erst in der Luft, dann in Richtung Weltall."},
   {"braucht":["zeit-auto","zeit-rakete"],"text":"Erst auf der Straße, dann in Richtung Weltall."}],
  "tipp2":[
   {"braucht":["zeit-aufzug","zeit-telefon"],"text":"Aufzug und Telefon sind hier die Ältesten. Der Aufzug kam zuerst."},
   {"braucht":["zeit-telefon","zeit-auto"],"text":"Das Telefon kam zehn Jahre vor dem Auto."},
   {"braucht":[],"vorlage":"Ganz nach oben gehört: {name}."}]},
 {"gruppe":"weltall-netz","titel":"Weltall und Internet","teile":["zeit-satellit","zeit-mondlandung","zeit-internetseiten","zeit-smartphone","zeit-iss","zeit-webb"],
  "tipp1":[
   {"braucht":["zeit-satellit","zeit-mondlandung"],"text":"Bevor Menschen ins All fliegen, muss erst etwas ohne Menschen hinauf."},
   {"braucht":["zeit-satellit","zeit-iss"],"text":"Bevor Menschen ins All fliegen, muss erst etwas ohne Menschen hinauf."},
   {"braucht":["zeit-iss"],"text":"In der ISS leben bis heute Menschen."},
   {"braucht":[],"text":"Frag dich bei jedem Teil: Was musste es vorher schon geben?"}],
  "tipp2":[
   {"braucht":["zeit-smartphone","zeit-iss"],"text":"Smartphones gab es schon, bevor jemand in der ISS wohnte."},
   {"braucht":["zeit-internetseiten","zeit-mondlandung"],"text":"Der Plan für Internetseiten kam etwa 20 Jahre nach der Mondlandung."},
   {"braucht":["zeit-internetseiten","zeit-smartphone"],"text":"Das erste Smartphone kam vier Jahre nach dem Plan für Internetseiten."},
   {"braucht":[],"vorlage":"Ganz nach oben gehört: {name}."}]}
]
```

Abstände in den Gruppen (Jahre): ganz-frueh −3200, −2550, −27, 105, 628 (kleinster 132); buch-bis-bahn 1450, 1492, 1608, 1665, 1712, 1825 (42); motoren 1854, 1876, 1886, 1903, 1926 (10); weltall-netz 1957, 1969, 1989, 1993, 2000, 2022 (4). Bei Motoren reichen beide Tipps immer zur Lösung; bei den anderen bleibt manchmal ein Rest zum Knobeln. Gruppennamen (`titel`) nur im Code, nicht sichtbar (würden verraten; „Motoren“ passt nicht zum Telefon).

## 5. Profi-Fenster

Je Rätsel ein Teil aus jedem Fenster, in dieser Reihenfolge: `ganz-frueh` (5), `buch-bis-bahn` (6), `motoren` (4, ohne Aufzug), `weltall-netz` (6). 5 × 6 × 4 × 6 = **720 Rätsel**, 2 Rätsel ohne gemeinsame Teile = **108.000 Runden**. Kleinste Abstände: Rakete 1926 und Satellit 1957 (31 Jahre, echte Abhängigkeit), Eisenbahn 1825 und Telefon 1876 (51). Aufzug bewusst nicht auf Profi (neben der Eisenbahn nur 29 Jahre); Steinwerkzeuge und Feuer nur auf Entdecker.

## 6. Quellen und was der `fakten-pruefer` besonders prüfen soll

Nicht neu zu prüfen: was der erste Faktenbericht bestätigt hat (Jahre der 15 alten Teile, Tipps zu Dampflok, Motoren-Satz und Satellit).

Neu, vom Helfer geöffnet: Computer History Museum (Simon: „Date Introduced 1993“, „the first smartphone“), Otis History (1853 erster Aufzug mit Sicherheitsbremse verkauft, 1854 Vorführung im Crystal Palace New York), Science Museum Group (Hookes „Micrographia“ 1665 mit Illustrationen), Smithsonian Magazine (Tagebuch des Merer, 27. Jahr des Cheops, Stein von Tura nach Gizeh).

Besonders prüfen (⚠):
1. Merer-Tipp: „Aufseher“ für „inspector“, „Tagebuch“ für das Logbuch vertretbar? Reicht Smithsonian Magazine, oder gibt es eine Museums- oder Universitätsseite? (26. oder 27. Regierungsjahr spielt keine Rolle.)
2. „Kolumbus hatte noch kein Fernrohr an Bord.“ – Schluss aus Linda Hall (erster schriftlicher Bericht 1608). Trägt er?
3. `zeit-rom`: Met-Seite gab 429. Bitte 27 v. Chr. und „erster Kaiser“ (Augustus) belegen.
4. `zeit-karibik`: NMAI-Seiten nicht geöffnet; 1492 belegen. Karte ist `sensitive`; der Name sagt „erreichen“, nicht „entdecken“. Nur Profi und Experte.
5. `zeit-smartphone`: Karte sagt nur „Frühe Kombinationen: 1990er-Jahre“; 1993 vorgestellt laut CHM, zu kaufen erst 1994. Hält „wird vorgestellt“? Hält „Smartphones gab es schon, bevor jemand in der ISS wohnte“?
6. `zeit-aufzug`: Hauptquelle ist eine Firmenseite; mit dem Dokument des National Register gegenprüfen.
7. `zeit-fernrohr`: „beschrieben“ statt „aufgeschrieben“; passt das zu „first written record“?
8. `zeit-mikroskop`: Stimmt „zeigt Bilder aus dem Mikroskop“ für 1665? Und „ließ seine Mikroskop-Bilder als Buch drucken“?
9. „In der ISS leben bis heute Menschen.“ seit 2.11.2000 durchgehend; läuft ab, wenn die ISS außer Betrieb geht (geplant um 2030). Vormerken.
10. `zeit-feuer`: Steht „mindestens 790.000“ wörtlich auf der Smithsonian-Seite?
11. `zeit-webb`: erstes Einzelbild 11.07.2022, Testbilder früher. „seine ersten Bilder“ oder „seine ersten großen Bilder“?
12. Gerundete Altersangaben 5.200, 4.600 (gerechnet 4.576), 2.050, 1.900, 1.400 gegenrechnen.
13. Zeitwörter mit Familie (für `kinder-redaktion`): „als Oma und Opa jung waren“ (1957 bis 1993) und „als Mama und Papa Kinder waren“ (2000) hängen vom Alter der Familie ab; Ersatz „vor etwa 30 bis 70 Jahren“, „vor etwa 25 Jahren“.

Für die Karten, außerhalb dieses Spiels: `history-writing` sagt 3200 bis 3000 v. Chr., das ISAC Museum 3400 bis 3200 (das Spiel nimmt −3200, passt zu beiden); `invention-telescope` braucht Linda Hall als Quelle.

## 7. Umformuliert (alt → neu)

Keine gespeicherten Antworttexte (nichts aus diesem Spiel in `tests/fixtures/gespeicherte-antworten*.json`). Heute speichert `useSavedGame('items')` die 5 Karten-IDs aus `TIME_IDS`; die neuen Teile haben `zeit-`IDs, die alten stehen in `altId`. Vorschlag: Ein alter Stand mit 5 Teilen wird verworfen, es startet eine neue Runde; `world:chronology`, Stempel und `geschafft` bleiben.

Angezeigte Texte: Spielliste (`app/game-index.json`, `app/world-games.tsx`) „Was kam zuerst? Ordne fünf Erfindungen und Ereignisse.“ → „Was kam zuerst? Bring Erfindungen und Ereignisse in die richtige Reihenfolge.“; Mission (`app/world-progress.tsx`) „Ordne fünf Ereignisse im Zeitspiel.“ → „Löse eine Runde im Zeitspiel.“; Rückmeldung „… Schau auf die Jahreszahlen.“ fällt weg.

## 8. Zahlen (nachgezählt mit `node`)

| Stufe | Teile im Vorrat | je Rätsel | Rätsel | Runden (2 Rätsel) | kleinster Abstand im Rätsel |
|---|---|---|---|---|---|
| Entdecker | 11 (4 früh, 4 mitte, 3 spät) | 3 | 48 | 432 | 132 Jahre (ohne Eisenbahn: 245) |
| Profi | 21 (5 + 6 + 4 + 6) | 4 | 720 | 108.000 | 31 Jahre |
| Experte | 22 in 4 Gruppen (5, 6, 5, 6) | 4 | 40 (5 + 15 + 5 + 15) | 550 (zwei verschiedene Gruppen) | 4 Jahre (Internetseiten 1989 und Smartphone 1993) |

Vorrat insgesamt 24 Teile; neu gegenüber dem ersten Faktenbericht: Steinwerkzeuge, Feuer, Rom, Karibik, Mikroskop, Aufzug, Smartphone, Webb (Null aus dem Ersatz des ersten Entwurfs). Namen höchstens 8 Wörter, kurze Sätze in der Gegenwart; Tipps höchstens 11 Wörter, Rückmeldungen höchstens 9.

## 9. Änderungen gegenüber dem ersten Entwurf

1. 2 Rätsel je Runde mit 3, 4 oder 4 Teilen statt 5 Teilen (Nutzer).
2. Neue Felder `zeitwort`, `korb`, `fenster`, `jahrText` (Nutzer, stufen-pruefer 24 und 25).
3. Alle Teile mit `zeit-`IDs, die fünf alten mit `altId`.
4. Namen nach fakten-pruefer (Ereignis) und kinder-redaktion (Wörter, Gegenwart): Schrift, Pyramide, Buchdruck, Fernrohr (erster Bericht), Dampfmaschine (Newcomen), Eisenbahn („für alle“), Telefon und Auto („Patent“ mit Erklärzeile), Flugzeug („mit Motor … gesteuert“, wegen Giffard 1852), Internetseiten, ISS (mit Artikel; „die Raumstation“ allein wäre mehrdeutig).
5. `jahrText` ohne Abkürzung vorn, genaue Angabe in Klammern (kinder-redaktion 13).
6. Neu im Vorrat: Steinwerkzeuge, Feuer, Rom, Karibik, Mikroskop, Aufzug, Smartphone, Webb, Null (Gründe in Abschnitt 1 und im Stufenbericht).
7. Tipps: Motoren Tipp 1 = Fakten-Satz plus Kurzformen; Weltall Tipp 2 = zusammengeführter Satz, gekürzt; neue Tipp-2-Sätze für Motoren (Aufzug ist jetzt das Älteste); Ganz früh nach stufen-pruefer plus Satz zu Pyramide und Rom; Buch bis Bahn: Kolumbus/Fernrohr, Hooke/Buchdruck.
8. Tipps mit `braucht` und Rückfall-Satz, weil nur 4 von 5 oder 6 Teilen gezogen werden.
9. Rückmeldesätze je Stufe, Einleitung, Zähler, Weiter- und Schluss-Satz neu; „Noch nicht ganz“ nirgends doppelt.

## 10. Offen (Claude oder die Prüfer entscheiden)

1. Wann die Jahreszahlen kommen: Vorschlag Zahl und Zeitwort erst, wenn das Rätsel stimmt; nach dem dritten Fehlversuch „Lösung zeigen“ (sortiert, zeigt die Zahlen, zählt als nicht gelöst).
2. Eisenbahn im Entdecker-Korb `mitte` behalten (48 Rätsel, 132 Jahre) oder herausnehmen (36, 245)? (stufen-pruefer)
3. Smartphone in Experte: gute Knobelei oder Wissensfalle?
4. Motoren Tipp 1 ordnet 3 von 4 Teilen: für einen ersten Tipp viel? (stufen-pruefer)
5. Profi-Tipp: welches Teil zeigt seine Jahreszahl?
6. Zeitwörter mit Oma, Opa, Mama und Papa oder neutrale Zahlen? (kinder-redaktion)
7. „Patent“ mit Erklärzeile oder „… als Erfindung schützen lassen“? (kinder-redaktion)
8. Anzeige nach dem Prüfen bei frühen Teilen lang für 320 px, „vor“ doppelt; vielleicht zwei Zeilen (design-pruefer).
9. Experte-Runden nicht dasselbe Gruppenpaar wie die vorige Runde (beim Einbau).
10. Offen für echte Kinder: Macht Sortieren mit versteckten Zahlen den Kleinen Spaß?
