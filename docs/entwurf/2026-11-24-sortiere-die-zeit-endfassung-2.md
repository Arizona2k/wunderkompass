# A) „Sortiere die Zeit“ (`world:chronology`): Endfassung (Fassung 3) des `karten-autor` (24.11.2026)

Helfer: `karten-autor` (opus / high), 24.11.2026. Nur Entwurf, nichts geändert. Grundlage: die Prüfberichte zu Fassung 2 und Claudes Entscheidungen dazu. Neue Sätze (⚠) gehen noch einmal an `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer`.

Diese Fassung ersetzt Fassung 2 ganz. Grundlage sind die Prüfberichte zu Fassung 2 (`…-fassung-2-faktenpruefung.md`, `…-sortiere-und-nachtrag-kinderredaktion.md`, `…-sortiere-und-nachtrag-stufenpruefung.md`) und die Entscheidungen von Claude dazu. **Geprüft ist an dieser Fassung nur, was die Prüfer schon in Fassung 2 bestätigt haben.** Was neu ist, steht mit ⚠ in Abschnitt 6.

## 1. Der Vorrat: 24 Teile

Die Felder:
- `korb` gilt nur für Entdecker (`früh`, `mitte`, `spät`). `null` heißt: nie auf Entdecker.
- `fenster` gilt nur für Profi. `null` heißt: nie auf Profi. Es dient nur der Regel „höchstens 2 aus einem Fenster“ (Abschnitt 5).
- `gruppe` gilt nur für Experte. `null` heißt: nie auf Experte.
- `jahrText` ist die Hauptzeile der Zeitangabe.
- `jahrGenau` ist eine zweite, kleinere Zeile. Es gibt sie nur bei Teilen vor dem Jahr 1000, und auf Entdecker wird sie nie gezeigt.
- `erklaerung` ist freiwillig: eine kleine Zeile, sobald das Rätsel gelöst ist.

**Regel für `jahrText`:**
- Vor dem Jahr 1000 heißt es „vor etwa N Jahren“. Gerechnet wird ab 2026, gerundet auf 50 oder 100. Die genaue Angabe steht in `jahrGenau`.
- Ausnahmen, mit Absicht:
  - Rom: „vor über 2.000 Jahren“, denn genau sind es 2.052 Jahre.
  - Feuer: „vor mindestens 790.000 Jahren“, denn das ist der älteste sichere Nachweis, kein Mittelwert.
  - Steinwerkzeuge: „vor etwa 3,3 Millionen Jahren“, gerundet auf 100.000.
- Ab dem Jahr 1000 steht nur die Jahreszahl da.

```json
[
 {"id":"zeit-steinwerkzeug","name":"Die ersten bekannten Steinwerkzeuge entstehen","jahr":-3300000,"jahrText":"vor etwa 3,3 Millionen Jahren","jahrGenau":null,"zeitwort":"vor sehr, sehr langer Zeit","korb":"früh","fenster":null,"gruppe":null,"karte":"history-stone_tools","quelle":[{"titel":"Harmand u. a., Nature 2015 (PubMed): 3.3-million-year-old stone tools from Lomekwi 3","url":"https://pubmed.ncbi.nlm.nih.gov/25993961/"},{"titel":"Natural History Museum London","url":"https://www.nhm.ac.uk/discover/news/2023/february/oldest-remains-ancient-human-relative-paranthropus-suggest-possible-tool-use.html"}]},
 {"id":"zeit-feuer","name":"Frühe Menschen nutzen Feuer","jahr":-790000,"jahrText":"vor mindestens 790.000 Jahren","jahrGenau":null,"zeitwort":"vor sehr, sehr langer Zeit","korb":"früh","fenster":null,"gruppe":null,"karte":"history-fire","quelle":[{"titel":"Smithsonian Human Origins Program · Hearths & Shelters","url":"https://humanorigins.si.edu/evidence/behavior/hearths-shelters"}]},
 {"id":"zeit-schrift","name":"Menschen beginnen, auf Tontafeln zu schreiben","jahr":-3200,"jahrText":"vor etwa 5.200 Jahren","jahrGenau":"um 3200 v. Chr.","zeitwort":"vor sehr, sehr langer Zeit","korb":"früh","fenster":"ganz-frueh","gruppe":"ganz-frueh","karte":"history-writing","quelle":[{"titel":"ISAC Museum, University of Chicago (Google Arts & Culture) · Early Writing in Mesopotamia","url":"https://artsandculture.google.com/story/rwWhZTdobl0nLA"}]},
 {"id":"zeit-pyramide","name":"Die große Pyramide von Gizeh wird gebaut","jahr":-2550,"jahrText":"vor etwa 4.600 Jahren","jahrGenau":"um 2550 v. Chr.","zeitwort":"vor sehr, sehr langer Zeit","korb":"früh","fenster":"ganz-frueh","gruppe":"ganz-frueh","karte":"history-pyramids","quelle":[{"titel":"Harvard University · Digital Giza","url":"https://giza.fas.harvard.edu/commontopics/"}]},
 {"id":"zeit-rom","name":"Rom bekommt seinen ersten Kaiser","jahr":-27,"jahrText":"vor über 2.000 Jahren","jahrGenau":"27 v. Chr.","zeitwort":"vor sehr, sehr langer Zeit","korb":null,"fenster":"ganz-frueh","gruppe":"ganz-frueh","karte":"history-rome","quelle":[{"titel":"Kunsthistorisches Museum Wien (Google Arts & Culture) · Emperor Augustus","url":"https://artsandculture.google.com/asset/oAHA3JvskhVbHA"}]},
 {"id":"zeit-papier","altId":"history-paper","name":"Papier aus China wird verbessert","jahr":105,"jahrText":"vor etwa 1.900 Jahren","jahrGenau":"im Jahr 105","zeitwort":"vor sehr, sehr langer Zeit","korb":null,"fenster":"ganz-frueh","gruppe":"ganz-frueh","karte":"history-paper","quelle":[{"titel":"Robert C. Williams Museum of Papermaking (Georgia Tech) · Early Papermaking in China","url":"https://paper.gatech.edu/early-papermaking"}]},
 {"id":"zeit-null","name":"Rechenregeln für die Null werden aufgeschrieben","jahr":628,"jahrText":"vor etwa 1.400 Jahren","jahrGenau":"im Jahr 628","zeitwort":"vor sehr, sehr langer Zeit","korb":null,"fenster":"ganz-frueh","gruppe":"ganz-frueh","karte":"history-zero","quelle":[{"titel":"University of St Andrews, MacTutor · Brahmagupta","url":"https://mathshistory.st-andrews.ac.uk/Biographies/Brahmagupta/"},{"titel":"University of St Andrews, MacTutor · A history of Zero","url":"https://mathshistory.st-andrews.ac.uk/HistTopics/Zero/"}]},
 {"id":"zeit-buchdruck","altId":"history-printing","name":"Gutenberg druckt Bücher mit Buchstaben aus Metall","jahr":1450,"jahrText":"um 1450","jahrGenau":null,"zeitwort":"vor ein paar hundert Jahren","korb":"mitte","fenster":"buch-bis-bahn","gruppe":"buch-bis-bahn","karte":"history-printing","quelle":[{"titel":"Stadt Mainz / Gutenberg.de · Zeitleiste Gutenberg","url":"https://www.gutenberg.de/zeit/zeitleiste_gutenberg"}]},
 {"id":"zeit-karibik","name":"Schiffe von Kolumbus erreichen die Karibik","jahr":1492,"jahrText":"1492","jahrGenau":null,"zeitwort":"vor ein paar hundert Jahren","korb":null,"fenster":"buch-bis-bahn","gruppe":"buch-bis-bahn","karte":"history-voyages1492","quelle":[{"titel":"Library of Congress · Columbus and the Taíno","url":"https://www.loc.gov/exhibits/exploring-the-early-americas/columbus-and-the-taino.html"}]},
 {"id":"zeit-fernrohr","name":"Ein Fernrohr wird zum ersten Mal beschrieben","jahr":1608,"jahrText":"1608","jahrGenau":null,"zeitwort":"vor ein paar hundert Jahren","korb":"mitte","fenster":"buch-bis-bahn","gruppe":"buch-bis-bahn","karte":"invention-telescope","quelle":[{"titel":"Linda Hall Library · Scientist of the Day: Hans Lipperhey","url":"https://www.lindahall.org/about/news/scientist-of-the-day/hans-lipperhey/"}]},
 {"id":"zeit-mikroskop","name":"Robert Hooke zeigt, was er im Mikroskop sah","jahr":1665,"jahrText":"1665","jahrGenau":null,"zeitwort":"vor ein paar hundert Jahren","korb":null,"fenster":"buch-bis-bahn","gruppe":"buch-bis-bahn","karte":"invention-microscope","quelle":[{"titel":"Science Museum Group · Hooke's compound microscope (copy), 1665–1675","url":"https://collection.sciencemuseumgroup.org.uk/objects/co8391/hookes-compound-microscope-copy-1665-1675"}]},
 {"id":"zeit-dampfmaschine","name":"Newcomen baut eine Dampfmaschine für Bergwerke","jahr":1712,"jahrText":"1712","jahrGenau":null,"zeitwort":"vor ein paar hundert Jahren","korb":"mitte","fenster":"buch-bis-bahn","gruppe":"buch-bis-bahn","karte":"history-steam","quelle":[{"titel":"Science Museum Group · Desaguliers' Newcomen engine model","url":"https://collection.sciencemuseumgroup.org.uk/objects/co2000/demainbrays-newcomen-engine-model"}]},
 {"id":"zeit-eisenbahn","altId":"history-railway","name":"Die erste Dampf-Eisenbahn für alle fährt","jahr":1825,"jahrText":"1825","jahrGenau":null,"zeitwort":"vor ein paar hundert Jahren","korb":"mitte","fenster":"buch-bis-bahn","gruppe":"buch-bis-bahn","karte":"history-railway","quelle":[{"titel":"National Railway Museum · Shildon and Locomotion No. 1","url":"https://blog.railwaymuseum.org.uk/shildon-the-cradle-of-the-railways-and-locomotion-no-1/"}]},
 {"id":"zeit-aufzug","name":"Otis zeigt einen Aufzug mit Sicherheitsbremse","jahr":1854,"jahrText":"1854","jahrGenau":null,"zeitwort":"vor 100 bis 200 Jahren","korb":null,"fenster":null,"gruppe":"motoren","karte":"invention-elevator","quelle":[{"titel":"National Register of Historic Places · Otis, PDF, Abschnitt 8","url":"https://npgallery.nps.gov/GetAsset/07a0f86d-5e38-4a69-96f7-45050d94f808"},{"titel":"Otis · Our History (1853, 1854)","url":"https://www.otis.com/en/us/our-company/history"}]},
 {"id":"zeit-telefon","name":"Bell bekommt ein Patent auf sein Telefon","jahr":1876,"jahrText":"1876","jahrGenau":null,"zeitwort":"vor 100 bis 200 Jahren","korb":null,"fenster":"motoren","gruppe":"motoren","karte":"invention-phone","erklaerung":"Ein Patent schützt eine Erfindung. Andere dürfen sie dann eine Zeit lang nicht einfach nachbauen.","quelle":[{"titel":"U.S. National Archives (DocsTeach) · Alexander Graham Bell's Telephone Patent Drawing and Oath, 3/7/1876, NAID 302052","url":"https://docsteach.org/document/alexander-graham-bells-telephone-patent-drawing-and-oath/"},{"titel":"Library of Congress · Information Bulletin (Bell Papers)","url":"https://www.loc.gov/loc/lcib/0404/digitize.html"}]},
 {"id":"zeit-auto","name":"Benz bekommt ein Patent auf sein Auto","jahr":1886,"jahrText":"1886","jahrGenau":null,"zeitwort":"vor 100 bis 200 Jahren","korb":null,"fenster":"motoren","gruppe":"motoren","karte":"invention-car","erklaerung":"Ein Patent schützt eine Erfindung. Andere dürfen sie dann eine Zeit lang nicht einfach nachbauen.","quelle":[{"titel":"DPMA · Postergalerie: Automobil","url":"https://www.dpma.de/fileadmin/user_upload/Dokumente/Entdecken/Postergalerie/06_automobil.pdf"}]},
 {"id":"zeit-flugzeug","name":"Die Brüder Wright lenken ein Flugzeug mit Motor","jahr":1903,"jahrText":"1903","jahrGenau":null,"zeitwort":"vor 100 bis 200 Jahren","korb":null,"fenster":"motoren","gruppe":"motoren","karte":"history-flight","quelle":[{"titel":"Smithsonian NASM · 1903 Wright Flyer","url":"https://airandspace.si.edu/collection-objects/1903-wright-flyer/nasm_A19610048000"},{"titel":"Smithsonian NASM · The Flight of the Airplane","url":"https://airandspace.si.edu/explore/stories/flight-airplane"}]},
 {"id":"zeit-rakete","name":"Die erste Rakete mit flüssigem Treibstoff fliegt","jahr":1926,"jahrText":"1926","jahrGenau":null,"zeitwort":"vor 100 bis 200 Jahren","korb":null,"fenster":"motoren","gruppe":"motoren","karte":"invention-rocket","quelle":[{"titel":"NASA · 95 Years Ago: Goddard's First Liquid-Fueled Rocket","url":"https://www.nasa.gov/history/95-years-ago-goddards-first-liquid-fueled-rocket/"}]},
 {"id":"zeit-satellit","name":"Der erste Satellit kreist um die Erde","jahr":1957,"jahrText":"1957","jahrGenau":null,"zeitwort":"vor weniger als 100 Jahren","korb":"spät","fenster":"weltall-netz","gruppe":"weltall-netz","karte":"invention-satellite","erklaerung":"Ein Satellit ist ein Gerät im Weltall. Der erste war so groß wie ein Wasserball.","quelle":[{"titel":"NASA · Dawn of the Space Age","url":"https://www.nasa.gov/history/dawn-of-the-space-age/"}]},
 {"id":"zeit-mondlandung","altId":"history-apollo11","name":"Menschen landen auf dem Mond","jahr":1969,"jahrText":"1969","jahrGenau":null,"zeitwort":"vor weniger als 100 Jahren","korb":"spät","fenster":"weltall-netz","gruppe":"weltall-netz","karte":"history-apollo11","quelle":[{"titel":"NASA · Apollo 11 Mission Overview","url":"https://www.nasa.gov/history/apollo-11-mission-overview/"}]},
 {"id":"zeit-internetseiten","altId":"history-web","name":"Ein Forscher schreibt seine Idee für Internetseiten auf","jahr":1989,"jahrText":"1989","jahrGenau":null,"zeitwort":"vor weniger als 100 Jahren","korb":"spät","fenster":"weltall-netz","gruppe":"weltall-netz","karte":"history-web","quelle":[{"titel":"CERN · A short history of the Web","url":"https://home.cern/science/computing/the-birth-of-the-web/short-history-web/"}]},
 {"id":"zeit-smartphone","name":"Das erste Smartphone kommt in den Laden","jahr":1994,"jahrText":"1994","jahrGenau":null,"zeitwort":"vor weniger als 100 Jahren","korb":null,"fenster":"weltall-netz","gruppe":null,"karte":"invention-smartphone","erklaerung":"Man konnte schon auf den Bildschirm tippen und Nachrichten schreiben.","quelle":[{"titel":"TIME · Meet the First Smartphone (IBM Simon)","url":"https://time.com/3137005/first-smartphone-ibm-simon/"},{"titel":"Computer History Museum · IBM/BellSouth Simon Personal Communicator","url":"https://www.computerhistory.org/revolution/artifact/1733"}]},
 {"id":"zeit-iss","name":"Die erste Besatzung zieht in die Raumstation ISS","jahr":2000,"jahrText":"2000","jahrGenau":null,"zeitwort":"vor etwa 25 Jahren","korb":null,"fenster":"weltall-netz","gruppe":"weltall-netz","karte":"history-iss","quelle":[{"titel":"NASA · Expedition 1 kicks off science aboard the ISS","url":"https://www.nasa.gov/missions/station/iss-research/expedition-1-kicks-off-science-aboard-international-space-station/"}]},
 {"id":"zeit-webb","name":"Das Weltraum-Fernrohr Webb zeigt seine ersten Farbbilder","jahr":2022,"jahrText":"2022","jahrGenau":null,"zeitwort":"vor ein paar Jahren","korb":null,"fenster":"weltall-netz","gruppe":"weltall-netz","karte":"history-webb","quelle":[{"titel":"NASA · NASA Reveals Webb Telescope's First Images of Unseen Universe","url":"https://science.nasa.gov/missions/webb/nasa-reveals-webb-telescopes-first-images-of-unseen-universe/"}]}
]
```

Alle 24 Kartenverweise sind wie bisher. Es gibt keine neuen Karten und keine neuen IDs.

**Für Claude, außerhalb des Spiels (Einbau):**
- Die Karte `invention-smartphone` bekommt `invention.year: 1994` (bisher 1993). Das ist eine nötige Änderung laut Faktenprüfung. `invention.date` („Frühe Kombinationen: 1990er-Jahre“) kann bleiben.
- Aus der Endfassung ist noch offen: `history-writing` (3200–3000 v. Chr. gegenüber 3400–3200 bei ISAC) und Linda Hall als Quelle auf `invention-telescope`.

## 2. Zeitwörter und Körbe

Es gibt sechs feste Zeitwörter.

| Zeitwort (fester Wortlaut) | Jahre | Entdecker-Korb | Teile |
|---|---|---|---|
| vor sehr, sehr langer Zeit | bis 999 | **früh** | Steinwerkzeuge, Feuer, Schrift, Pyramide (nur Profi/Experte: Rom, Papier, Null) |
| vor ein paar hundert Jahren | 1400 bis 1825 | **mitte** | Buchdruck, Fernrohr, Dampfmaschine, Eisenbahn (nur Profi/Experte: Karibik, Mikroskop) |
| vor 100 bis 200 Jahren | 1826 bis 1926 | – | Aufzug, Telefon, Auto, Flugzeug, Rakete |
| vor weniger als 100 Jahren ⚠ | 1927 bis 1996 | **spät** | Satellit, Mondlandung, Internetseiten (nur Profi: Smartphone) |
| vor etwa 25 Jahren | 1997 bis 2005 | – | ISS |
| vor ein paar Jahren | ab 2013 | – | Webb |

- „vor weniger als 100 Jahren“ altert langsam. Ab 2026 gerechnet: Satellit 69, Mondlandung 57, Internetseiten 37, Smartphone 32 Jahre. Das Zeitwort stimmt bis einschließlich 2056, dann ist der Satellit 100 Jahre her.
- Rakete 1926: 2026 sind das genau 100 Jahre. Sie gehört darum zu „vor 100 bis 200 Jahren“, und die beiden Zeitwörter überschneiden sich nicht.
- ISS und Webb sind ebenfalls „weniger als 100 Jahre“ her. Sie haben aber genauere eigene Zeitwörter und kommen nie auf Entdecker vor. Nach dem Lösen ist beides wahr; ein Widerspruch entsteht nicht.
- **Einbau-Hinweis:** „vor etwa 25 Jahren“ (ISS) wird im Code ab dem aktuellen Jahr gerechnet und auf 5 gerundet (2026: 26 → „vor etwa 25 Jahren“).
- Lücken ohne Zeitwort (dort liegt heute kein Teil): 1000 bis 1399 und 2006 bis 2012.
- Entdecker: In jedem Rätsel kommt ein Teil aus jedem Korb. Das ergibt 4 × 4 × 3 = **48 Rätsel** und **432 Runden**. Der kleinste Abstand ist **132 Jahre** (Eisenbahn 1825, Satellit 1957).

## 3. Texte je Stufe (fertiger Wortlaut)

```json
{
 "spielliste": "Was kam zuerst? Bring Erfindungen und Ereignisse in die richtige Reihenfolge.",
 "missionZeitreisender": "Löse eine Runde im Zeitspiel.",
 "eyebrow": "DEINE ZEITMASCHINE",
 "ueberschrift": "Was kam zuerst?",
 "zaehler": "Rätsel {n} von 2",
 "einleitung": {
  "entdecker": "Ordne von früher nach später. Was zuerst kam, gehört ganz nach oben.",
  "profi": "Ordne von früher nach später. Die Zeiten siehst du, wenn alles stimmt.",
  "experte": "Ordne von früher nach später. Diesmal wird es knifflig."
 },
 "pruefKnopf": "Meine Reihenfolge prüfen",
 "vorlesenKnopf": "Vorlesen",
 "tipp": {
  "knopf": "WOERTER.tipp (Brauchst du einen Tipp?)",
  "entdecker": "Unter jedem Teil steht jetzt, wann es ungefähr war.",
  "profi": "Unter zwei Teilen steht jetzt, wann sie waren.",
  "experte": "erster Tipp der Gruppe, dann WOERTER.nochEinTipp für den zweiten (Abschnitt 4)"
 },
 "fehler": {
  "entdecker_keins": "Noch nicht ganz. Versuch es noch einmal!",
  "entdecker_eins": "Das grüne Teil steht schon richtig. Tausch die anderen zwei!",
  "profi_0": "Noch keins steht richtig. Versuch es noch einmal!",
  "profi_1": "1 von 4 steht schon richtig.",
  "profi_2": "2 von 4 stehen schon richtig.",
  "experte": "Noch nicht ganz. Was war zuerst da?"
 },
 "loesungKnopf": "Lösung zeigen",
 "loesungText": "So ist die Reihenfolge richtig. Schau dir an, wann alles war.",
 "richtig": "Richtig! Alles steht von früher nach später.",
 "weiterKnopf": "Weiter zum zweiten Rätsel",
 "geschafft": "Geschafft! Beide Rätsel sind gelöst.",
 "gespeichert": "Dein Spielstempel bleibt in deinem Entdeckerpass.",
 "rundeOhneStempel": "Diese Runde ist zu Ende. Den Spielstempel gibt es, wenn du beide Rätsel selbst löst. Willst du gleich noch eine Runde spielen?",
 "nachDemLoesen": "Zeile 1: {jahrText} · {zeitwort}; Zeile 2 (klein, nur Profi und Experte): {jahrGenau}",
 "vChrErklaerung": "v. Chr. heißt „vor Christus“. Vor dem Jahr 1 zählt man rückwärts. Bei Jahren vor Christus ist die größere Zahl früher."
}
```

**Regeln für den Einbau:**

- **Wann die Zeiten sichtbar werden (C3, Nutzer):** Jahreszahl, Zeitwort und `erklaerung` erscheinen erst, wenn das Rätsel gelöst ist oder „Lösung zeigen“ gedrückt wurde. Ausnahmen sind nur die beiden Tipps unten.
- **`nachDemLoesen`:**
  - Beginnt `jahrText` mit „vor“, fällt „· {zeitwort}“ weg.
  - Zeile 2 (`jahrGenau`) gibt es nur auf Profi und Experte und nur, wenn sie nicht `null` ist.
  - Beispiel Entdecker: „1450 · vor ein paar hundert Jahren“. Beispiel Profi: „vor etwa 4.600 Jahren“, darunter klein „um 2550 v. Chr.“.
- **Vorlesen:** Vor dem Lösen liest der Knopf nur die Namen. Danach liest er Name, `jahrText` und `jahrGenau`; „v. Chr.“ wird dabei als „vor Christus“ ausgeschrieben.
- **`vChrErklaerung`:** einmal je Rätsel, wenn ein sichtbares `jahrGenau` „v. Chr.“ enthält. Das kommt nur auf Profi und Experte vor.
- **`erklaerung` beim Patent:** höchstens einmal je Rätsel, beim älteren Teil. Auf Profi stehen Telefon und Auto wegen der 50-Jahre-Regel nie zusammen, auf Experte (motoren) schon.
- **Entdecker-Tipp:** Unter allen drei Teilen steht das Zeitwort (D1).
- **Entdecker, Fehler:**
  - Grüne Teile stehen richtig und sind gesperrt.
  - Bei 3 Teilen stehen nach dem Prüfen 0, 1 oder 3 richtig, nie genau 2.
  - `entdecker_keins` ist wörtlich `WOERTER.nochNicht`.
- **Profi-Tipp (P3):**
  - Er zeigt den `jahrText` (nur Zeile 1) unter den beiden Teilen mit dem kleinsten Abstand im Rätsel. Bei Gleichstand nimmt er das ältere Paar.
  - Er wird einmal je Rätsel festgelegt und ändert sich beim Schieben nicht.
- **Profi, Fehler:** Es wird nur gezählt, nicht gezeigt, welche Teile richtig stehen.
- **„Lösung zeigen“:**
  - Den Knopf gibt es nur auf Profi und Experte, ab dem 3. Fehlversuch neben dem Prüfknopf.
  - Er sortiert die Teile, zeigt die Zeiten und `loesungText` und danach den Weiterknopf.
  - **Neben „Lösung zeigen“ steht kein Zähler und kein Satz, der die Versuche bewertet.**
  - Der Prüfknopf bleibt daneben aktiv.
  - Auf Entdecker ist der Knopf nie nötig (D2).
- **Ende der Runde (entschieden: kein Stempel nach „Lösung zeigen“):**
  - Sind beide Rätsel ohne „Lösung zeigen“ gelöst: `geschafft` und `gespeichert`, Stempel über `onWin`.
  - Sonst: `rundeOhneStempel`, kein Stempel.
  - Der Satz nennt nur die Regel. Er stimmt darum auch, wenn das Kind den Stempel schon hat.
- **Experte (C1):** 30 Rätsel (Abschnitt 8). Der Satz E3 („Experte gibt es hier noch nicht“) entfällt für dieses Spiel.
- **Stufen-Vorschläge (E6) für `mitErsterAntwort`:** Je Rätsel wird höchstens einmal gemeldet, mit dem Schlüssel `zeit:<Teil-IDs sortiert>`.
  - Erste Prüfung richtig, ohne aufgeklappten Tipp → `richtig = true`.
  - „Lösung zeigen“ → `richtig = false`.
  - Gelöst beim 2. oder 3. Versuch → nichts melden, aber die Folge leeren.
  - **A3 (wörtlich):** Tipp aufgeklappt und erste Prüfung richtig zählt wie Lösen im 2. oder 3. Versuch.
  - **A4 (wörtlich):** Beim Leeren der Folge den Schlüssel in `gezaehlt` aufnehmen und `stufe` setzen.
    - Sinngemäß: `{...folge, stufe, antworten: [], gezaehlt: [...folge.gezaehlt, frage]}`.
    - Das gilt nur, wenn `frageStufe === stufe` und der Schlüssel noch nicht gezählt ist.
    - `folge` ist dieselbe Modul-Variable wie bei Karten und anderen Spielen. Ein Rätsel mit Mühe leert also auch eine Serie von anderswo. Der `stufen-pruefer` hält das für vertretbar.

## 4. Experte: 4 Gruppen mit Tipps

**Ziehung:**
- Je Rätsel kommen 4 Teile aus einer Gruppe, je Runde zwei verschiedene Gruppen.
- Die nächste Runde nimmt bevorzugt die beiden Gruppen, die zuletzt nicht dran waren.
- Innerhalb einer Gruppe nicht dieselben 4 Teile wie beim letzten Mal.

**Tipps:**
- Tipp 1 ist der erste Eintrag in `tipp1`, dessen `braucht`-Teile alle im Rätsel sind.
- Tipp 2 ist der erste passende Eintrag in `tipp2`, dessen Text nicht schon Tipp 1 war.
- `vorlage` mit dem ältesten gezogenen Teil ist der letzte Rückfall.
- Tipp 1 ordnet höchstens zwei Teile.
- Gruppennamen (`titel`) stehen nur im Code.

```json
[
 {"gruppe":"ganz-frueh","titel":"Ganz früh","teile":["zeit-schrift","zeit-pyramide","zeit-rom","zeit-papier","zeit-null"],
  "tipp1":[
   {"braucht":["zeit-schrift","zeit-pyramide"],"text":"Von den Bauarbeiten an der großen Pyramide gibt es ein Tagebuch."},
   {"braucht":["zeit-rom","zeit-null"],"text":"Die Römer kannten noch keine Rechenregeln für die Null."},
   {"braucht":[],"text":"Frag dich bei jedem Teil: Was musste es vorher schon geben?"}],
  "tipp2":[
   {"braucht":["zeit-rom","zeit-papier"],"text":"Rom hatte schon über 100 Jahre lang Kaiser. Dann wurde in China das Papier verbessert."},
   {"braucht":["zeit-papier","zeit-null"],"text":"Papier ist älter als die Rechenregeln für die Null."},
   {"braucht":["zeit-pyramide","zeit-rom"],"text":"Die große Pyramide war schon über 2.000 Jahre alt. Erst dann bekam Rom seinen ersten Kaiser."},
   {"braucht":[],"vorlage":"Ganz nach oben gehört: {name}."}]},
 {"gruppe":"buch-bis-bahn","titel":"Vom Buchdruck zur Eisenbahn","teile":["zeit-buchdruck","zeit-karibik","zeit-fernrohr","zeit-mikroskop","zeit-dampfmaschine","zeit-eisenbahn"],
  "tipp1":[
   {"braucht":["zeit-buchdruck","zeit-karibik"],"text":"Kolumbus schrieb einen Brief über seine Reise. Man druckte ihn viele Male."},
   {"braucht":["zeit-dampfmaschine","zeit-eisenbahn"],"text":"Was musste es geben, damit eine Dampflok fahren kann?"},
   {"braucht":["zeit-karibik","zeit-fernrohr"],"text":"Kolumbus hatte noch kein Fernrohr an Bord."},
   {"braucht":["zeit-buchdruck","zeit-mikroskop"],"text":"Robert Hooke ließ seine Mikroskop-Zeichnungen als Buch drucken."},
   {"braucht":[],"text":"Frag dich bei jedem Teil: Was musste es vorher schon geben?"}],
  "tipp2":[
   {"braucht":["zeit-karibik","zeit-fernrohr"],"text":"Kolumbus hatte noch kein Fernrohr an Bord."},
   {"braucht":["zeit-fernrohr","zeit-mikroskop"],"text":"Fernrohre gab es schon über 50 Jahre vor Hookes Zeichnungen."},
   {"braucht":["zeit-mikroskop","zeit-dampfmaschine"],"text":"Hookes Zeichnungen waren schon über 40 Jahre alt. Dann kam Newcomens Dampfmaschine."},
   {"braucht":[],"vorlage":"Ganz nach oben gehört: {name}."}]},
 {"gruppe":"motoren","titel":"Vom Aufzug zur Rakete","teile":["zeit-aufzug","zeit-telefon","zeit-auto","zeit-flugzeug","zeit-rakete"],
  "tipp1":[
   {"braucht":["zeit-auto","zeit-flugzeug"],"text":"Das Flugzeug der Brüder Wright hatte einen Benzinmotor. Den gab es vorher schon in Autos."},
   {"braucht":["zeit-flugzeug","zeit-rakete"],"text":"Die erste Rakete mit flüssigem Treibstoff verbrannte Benzin. Flugzeuge flogen damals schon seit über 20 Jahren damit."},
   {"braucht":["zeit-auto","zeit-rakete"],"text":"Die erste Rakete mit flüssigem Treibstoff verbrannte Benzin. Autos fuhren damals schon lange damit."}],
  "tipp2":[
   {"braucht":["zeit-aufzug","zeit-telefon"],"text":"Aufzug und Telefon sind hier die ältesten. Der Aufzug kam zuerst."},
   {"braucht":["zeit-telefon","zeit-auto"],"text":"Das Telefon kam zehn Jahre vor dem Auto."},
   {"braucht":[],"vorlage":"Ganz nach oben gehört: {name}."}]},
 {"gruppe":"weltall-netz","titel":"Weltall und Internet","teile":["zeit-satellit","zeit-mondlandung","zeit-internetseiten","zeit-iss","zeit-webb"],
  "tipp1":[
   {"braucht":["zeit-satellit","zeit-mondlandung"],"text":"Bevor Menschen ins All fliegen, muss erst etwas ohne Menschen hinauf."},
   {"braucht":["zeit-satellit","zeit-iss"],"text":"Bevor Menschen ins All fliegen, muss erst etwas ohne Menschen hinauf."},
   {"braucht":["zeit-mondlandung","zeit-iss"],"text":"Erst flogen Menschen kurz zum Mond. Später wohnten sie lange im All."},
   {"braucht":[],"text":"Frag dich bei jedem Teil: Was musste es vorher schon geben?"}],
  "tipp2":[
   {"braucht":["zeit-internetseiten","zeit-iss"],"text":"Als die ISS ihre erste Besatzung bekam, gab es schon Internetseiten."},
   {"braucht":["zeit-internetseiten","zeit-mondlandung"],"text":"Die Idee für Internetseiten kam etwa 20 Jahre nach der Mondlandung."},
   {"braucht":["zeit-mondlandung","zeit-iss"],"text":"Erst flogen Menschen kurz zum Mond. Später wohnten sie lange im All."},
   {"braucht":[],"vorlage":"Ganz nach oben gehört: {name}."}]}
]
```

**Tipps je Ziehung (mit `node` nachgezählt, alle 30 Rätsel):**

- **ganz-frueh:**
  - ohne Schrift oder ohne Pyramide: Römer/Null, dann Rom/Papier.
  - ohne Rom: Tagebuch, dann Papier/Null.
  - ohne Papier: Tagebuch, dann Pyramide/Rom.
  - ohne Null: Tagebuch, dann Rom/Papier.
- **buch-bis-bahn** (Tipp 2 kommt nur noch in 3 von 15 Ziehungen aus der Vorlage, bisher in 15 von 15):
  - ohne Dampfmaschine+Eisenbahn, ohne Mikroskop+Eisenbahn, ohne Mikroskop+Dampfmaschine: Kolumbus-Brief, dann Kolumbus/Fernrohr.
  - ohne Fernrohr+Eisenbahn: Kolumbus-Brief, dann Hooke/Newcomen.
  - ohne Fernrohr+Dampfmaschine, ohne Fernrohr+Mikroskop: Kolumbus-Brief, dann Vorlage (Buchdruck).
  - ohne Karibik+Eisenbahn, ohne Karibik+Dampfmaschine: Hooke-Buch, dann Fernrohr/Hooke.
  - ohne Karibik+Mikroskop: Dampflok, dann Vorlage (Buchdruck).
  - ohne Karibik+Fernrohr: Dampflok, dann Hooke/Newcomen.
  - ohne Buchdruck+Eisenbahn, ohne Buchdruck+Dampfmaschine: Kolumbus/Fernrohr, dann Fernrohr/Hooke.
  - ohne Buchdruck+Mikroskop: Dampflok, dann Kolumbus/Fernrohr.
  - ohne Buchdruck+Fernrohr: Dampflok, dann Hooke/Newcomen.
  - ohne Buchdruck+Karibik: Dampflok, dann Fernrohr/Hooke.
- **motoren:**
  - ohne Rakete, ohne Telefon oder ohne Aufzug: Benzinmotor.
  - ohne Auto: Rakete/Flugzeug.
  - ohne Flugzeug: Rakete/Auto.
  - Tipp 2: Aufzug/Telefon. Ohne Telefon kommt die Vorlage (Aufzug), ohne Aufzug Telefon/Auto.
- **weltall-netz:**
  - ohne Webb: Satellit/Mond, dann Internetseiten/ISS.
  - ohne ISS: Satellit/Mond, dann Internetseiten/Mond.
  - ohne Internetseiten: Satellit/Mond, dann Mond/ISS.
  - ohne Mondlandung: Satellit/ISS, dann Internetseiten/ISS.
  - ohne Satellit: Mond/ISS, dann Internetseiten/ISS.

**Nachbarpaare ohne Tipp, über alle Ziehungen** (gezählt in der richtigen Reihenfolge):
- ganz-frueh 7, motoren 6.
- buch-bis-bahn 20 (Fassung 2: 32).
- weltall-netz 7 (Fassung 2: 7). Offen bleibt jetzt öfter Mondlandung/Internetseiten statt Internetseiten/ISS.

Der `stufen-pruefer` hat für buch-bis-bahn anders gezählt (25 → 19). Die Richtung stimmt überein.

**Abstände in den Gruppen** (Jahre, ohne Jahr 0), unverändert:
- ganz-frueh: 650, 2.523, 131, 523
- buch-bis-bahn: 42, 116, 57, 47, 113
- motoren: 22, 10, 17, 23
- weltall-netz: 12, 20, 11, 22

## 5. Profi: Ziehregel (unverändert)

- 4 Teile aus dem Profi-Vorrat (21 Teile, `fenster` ≠ `null`).
- Höchstens 2 Teile aus einem Fenster.
- Mindestens **50 Jahre** zwischen je zwei Teilen (ohne Jahr 0).
- Kein Aufzug auf Profi (`fenster: null`).

Ergebnis: 2.815 Rätsel (2.155 mit 2 Teilen aus einem Fenster) und 1.511.194 Runden. Der kleinste Abstand ist 50 Jahre (Telefon/Rakete). Eine neue Reihe ist nie schon richtig (wie `gemischt` in `ordne-richtig.tsx`).

## 6. Quellen und was noch zu prüfen ist

Bestätigt und nicht neu zu prüfen ist alles, was die Faktenprüfung zu Fassung 2 unter „Kann so bleiben“ nennt (⚠ 1, 2, 3, 5, 6, 9 bis 17, 19, 20, 21 dort). Dazu kommen die Sätze, die ein Prüfer selbst vorgeschlagen und ein anderer schon gesehen hat:
- Benzinmotor-Tipp: vorgeschlagen von `fakten-pruefer` und `kinder-redaktion`, Inhalt E2 vom `stufen-pruefer` bestätigt.
- Profi-Einleitung und „die ältesten“: `kinder-redaktion`.
- Karibik/Fernrohr in `tipp2`: Satz schon geprüft.
- Reihenfolge Internetseiten/ISS: kein neuer Text.

**Neu oder geändert, noch zu prüfen (⚠):**

| Nr. | Stelle | Wortlaut | Quelle | Wer prüft noch |
|---|---|---|---|---|
| ⚠ A1 | ganz-frueh, Tipp 1 (Rom/Null) | „Die Römer kannten noch keine Rechenregeln für die Null.“ | MacTutor, A history of Zero (Brahmagupta ist „the first person that we know who tried to extend arithmetic to … zero“, im 7. Jahrhundert), https://mathshistory.st-andrews.ac.uk/HistTopics/Zero/; MacTutor Brahmagupta (628); KHM (Augustus, 27 v. Chr.). Der Satz behauptet nicht, dass es bei den Römern kein Zeichen für die Null gab. Die MacTutor-Seite nennt die Römer selbst nicht; der Satz folgt aus „erste bekannte Regeln im 7. Jahrhundert“ und „Rom 27 v. Chr.“. | fakten, kinder, stufen |
| ⚠ A2 | motoren, Tipp 1 (Flugzeug/Rakete) | „Die erste Rakete mit flüssigem Treibstoff verbrannte Benzin. Flugzeuge flogen damals schon seit über 20 Jahren damit.“ | NASA Goddard: „fueled with gasoline and liquid oxygen“ (16.3.1926); NASM Wright Flyer: „twelve-horsepower gasoline engine“ (1903); 1903 bis 1926 sind 23 Jahre. Der Wortlaut ist aus dem Vorschlag des `fakten-pruefer` umgeformt („da“ → „damals“, „über 20 Jahre“ → „seit über 20 Jahren“). | fakten (nur Wortlaut), kinder, stufen |
| ⚠ A3 | motoren, Tipp 1 (Auto/Rakete) | „Die erste Rakete mit flüssigem Treibstoff verbrannte Benzin. Autos fuhren damals schon lange damit.“ | Wörtlich der Vorschlag des `fakten-pruefer`. NASA Goddard; DPMA-Poster (Benz 1886, „1900 … 22 Prozent mit Benzin“); Ligroin = Leichtbenzin (Faktenprüfung, Punkt 7). | kinder, stufen |
| ⚠ A4 | buch-bis-bahn, Tipp 1 | „Kolumbus schrieb einen Brief über seine Reise. Man druckte ihn viele Male.“ | Princeton University Library, Editions of the „Columbus Letter“, https://rarebooks.blogs.princeton.edu/2014/02/editions-of-the-columbus-lette/ („fifteen known editions“ in vier Jahren); Library of Congress, Columbus and the Taíno, https://www.loc.gov/exhibits/exploring-the-early-americas/columbus-and-the-taino.html („Seventeen editions of the letter were published between 1493 and 1497“, von mir geöffnet). Die Aufteilung in zwei Sätze stammt von der `kinder-redaktion`. Neu ist die Aussage „Kolumbus schrieb“. | fakten |
| ⚠ A5 | buch-bis-bahn, Tipp 2 (Fernrohr/Mikroskop) | „Fernrohre gab es schon über 50 Jahre vor Hookes Zeichnungen.“ | Linda Hall (1608); Science Museum Group (Micrographia 1665). 1608 bis 1665 sind 57 Jahre. Der Wortlaut des `stufen-pruefer` („wurde … beschrieben“) ist ins Aktiv gesetzt. | fakten, kinder |
| ⚠ A6 | buch-bis-bahn, Tipp 2 (Mikroskop/Dampfmaschine) | „Hookes Zeichnungen waren schon über 40 Jahre alt. Dann kam Newcomens Dampfmaschine.“ | Science Museum Group: Micrographia 1665; Newcomen-Maschine 1712. Das sind 47 Jahre. Wortlaut des `stufen-pruefer`. | fakten, kinder |
| ⚠ A7 | `zeit-mikroskop`, Name | „Robert Hooke zeigt, was er im Mikroskop sah“ | Science Museum Group: „'Micrographia', published in 1665, presented intriguing illustrations“. Vorschlag der `kinder-redaktion`. | fakten |
| ⚠ A8 | `zeit-smartphone`, `erklaerung` | „Man konnte schon auf den Bildschirm tippen und Nachrichten schreiben.“ | CHM: „using a touchscreen instead of buttons for dialing and typing“, dazu Fax und Pager; TIME: „email capability“. Aus „E-Mails“ wird „Nachrichten“ (`kinder-redaktion`). | fakten |
| ⚠ A9 | `zeit-telefon`, `zeit-auto`, `erklaerung` | „Ein Patent schützt eine Erfindung. Andere dürfen sie dann eine Zeit lang nicht einfach nachbauen.“ | DPMA, Patentschutz („befristetes … Nutzungsmonopol“, höchstens 20 Jahre). Vorschlag des `fakten-pruefer`. | kinder |
| ⚠ A10 | `zeit-telefon`, Quelle | National Archives über DocsTeach, NAID 302052, Datum 3/7/1876 | Vorschlag des `fakten-pruefer`, von ihm über WebFetch gelesen. Von mir nicht geöffnet. | fakten (Seite erreichbar?) |
| ⚠ A11 | `vChrErklaerung` | „v. Chr. heißt „vor Christus“. Vor dem Jahr 1 zählt man rückwärts. Bei Jahren vor Christus ist die größere Zahl früher.“ | Allgemeine Zeitrechnung. Der dritte Satz nennt ausdrücklich „Jahre vor Christus“ und lässt sich darum nicht auf 105 oder 628 übertragen. | fakten, kinder |
| ⚠ A12 | Zeitwort Korb `spät` | „vor weniger als 100 Jahren“ | Rechnung ab 2026: 69, 57, 37 und 32 Jahre. Rakete genau 100, also bei „100 bis 200“. Vorschlag der `kinder-redaktion`. | fakten (Rechnung), stufen (Entdecker: „ein paar hundert“ gegen „weniger als 100“) |
| ⚠ A13 | `rundeOhneStempel` | „Diese Runde ist zu Ende. Den Spielstempel gibt es, wenn du beide Rätsel selbst löst. Willst du gleich noch eine Runde spielen?“ | Kein Sachinhalt. Nennt die Regel aus Abschnitt 3 und tadelt nicht. Grundlage ist der Satz der `kinder-redaktion`; aus „ohne Lösung schaffst“ wird „selbst löst“, weil „ohne Lösung“ wie „nicht gelöst“ klingen kann. | kinder, stufen |

Neu dazugekommene Quellen:
- MacTutor „A history of Zero“ ersetzt die FSU-Kursseite. Die Seite habe ich geöffnet; den Satz zum 7. Jahrhundert habe ich über WebFetch gelesen.
- National Archives (DocsTeach) beim Telefon.
- Library of Congress als zweite Quelle beim Kolumbus-Brief (geöffnet).

## 7. Umformuliert (alt → neu)

**Keine gespeicherten Antworttexte.** Aus diesem Spiel steht nichts in `tests/fixtures/gespeicherte-antworten*.json`.

Gespeicherter Spielstand wie in Fassung 2:
- Ein alter Stand mit 5 Teilen (`items`) wird verworfen, und es startet eine neue Runde.
- Der neue Stand bekommt eigene Schlüssel.
- `world:chronology`, Stempel und `geschafft` bleiben.

Angezeigte Texte (keine Kinderantworten):
- Spielliste: „Was kam zuerst? Ordne fünf Erfindungen und Ereignisse.“ → „Was kam zuerst? Bring Erfindungen und Ereignisse in die richtige Reihenfolge.“
- Mission: „Ordne fünf Ereignisse im Zeitspiel.“ → „Löse eine Runde im Zeitspiel.“
- Die Rückmeldung „… Schau auf die Jahreszahlen.“ entfällt.

## 8. Zahlen (nachgezählt mit `node`)

| Stufe | Vorrat | je Rätsel | Rätsel | Runden | kleinster Abstand |
|---|---|---|---|---|---|
| Entdecker | 11 (4 früh, 4 mitte, 3 spät) | 3 | 48 | 432 | 132 Jahre |
| Profi | 21 | 4 | 2.815 | 1.511.194 | 50 Jahre |
| Experte | 21 in 4 Gruppen (5, 6, 5, 5) | 4 | 30 | 300 | 10 Jahre (Telefon/Auto) |

- **Satzlängen:** Kein Satz in Tipps, Erklärungen, Rückmeldungen oder Einleitungen hat mehr als 11 Wörter (gezählt mit `node`).
  - Genau 11 Wörter haben: Tagebuch, der allgemeine Satz, Satellit/Menschen, ISS/Internetseiten, Internetseiten/Mondlandung und die Vorlage mit dem längsten Namen.
  - 10 Wörter haben: Fernrohr/Hooke, Pyramide/Rom (1. Satz), Patent (2. Satz), Smartphone und Stempel (2. Satz).
  - Namen haben höchstens 8 Wörter.
- **„Einzige längste / einzige kürzeste“:** gilt hier nicht. Das Spiel sortiert und hat keine Antwortwahl (0 Fragen mit Antwortliste).
- **Kein Tipp nennt die ganze Reihenfolge.** Tipp 1 ordnet in allen 30 Ziehungen genau zwei Teile.

## 9. Was gegenüber Fassung 2 geändert ist

1. **Benzinmotor-Tipp:** „Das erste Flugzeug“ → „Das Flugzeug der Brüder Wright“.
2. **„in Richtung Weltall“ gestrichen.** Es gibt zwei neue Rakete-Tipps mit „verbrannte Benzin“ (Flugzeug/Rakete, Auto/Rakete), nach den Vorschlägen des `fakten-pruefer` mit der NASA-Quelle.
3. **Römer/Null:** „Die Römer hatten kein Zeichen für die Null.“ → „Die Römer kannten noch keine Rechenregeln für die Null.“ Die Quelle ist MacTutor statt der FSU-Seite.
4. **Smartphone:** `erklaerung` mit „Nachrichten“ statt „E-Mails“. Einbau-Hinweis: `invention.year` 1994.
5. **Telefon:** National Archives (DocsTeach, NAID 302052) als erste Quelle. Die Patent-`erklaerung` (Telefon und Auto) hat jetzt „eine Zeit lang“.
6. **`vChrErklaerung`** neu: Die Regel gilt ausdrücklich nur für Jahre vor Christus.
7. **Zeitwort `spät`:** „vor 30 bis 70 Jahren“ → „vor weniger als 100 Jahren“ (Satellit, Mondlandung, Internetseiten, Smartphone).
   - ISS: Einbau-Hinweis, ab dem aktuellen Jahr rechnen.
   - Die Ausnahmen in der `jahrText`-Regel sind benannt (Rom, dazu Feuer und Steinwerkzeuge).
8. **Mikroskop-Name:** „Robert Hooke zeigt, was er im Mikroskop sah“.
   - Der Kolumbus-Tipp hat jetzt zwei Sätze, mit der Library of Congress als zweiter Quelle.
   - Profi-Einleitung: „Die Zeiten siehst du …“.
   - „die ältesten“ ist kleingeschrieben.
   - Der Satelliten-Name bleibt.
9. **Stempel nach „Lösung zeigen“: keiner** (entschieden).
   - Neben „Lösung zeigen“ steht kein Zähler und kein wertender Satz.
   - `rundeOhneStempel` nennt freundlich, wie es den Stempel gibt.
10. **Tipps:**
    - buch-bis-bahn: drei neue `tipp2`-Einträge (Kolumbus/Fernrohr, Fernrohr/Hooke, Hooke/Newcomen).
    - weltall-netz: Internetseiten/ISS steht in `tipp2` jetzt vor Internetseiten/Mondlandung.
    - „Tipps je Ziehung“ ist neu nachgezählt.
11. **E6:** A3 und A4 stehen wörtlich in den Einbau-Regeln.
12. Offen 4, 6 und 7 aus Fassung 2 sind entschieden (kein Stempel, 50 Jahre, kein Aufzug auf Profi). Offen 8 ist erledigt.

## 10. Offen

1. **Römer/Null, Alternative:** Will Claude näher am Wortlaut des `fakten-pruefer` bleiben, ginge auch „Römische Zahlen sind viel älter als die Rechenregeln für die Null.“ (11 Wörter). Das ist wahr und stützt keinen Mythos. Es verbindet aber über die römischen Zahlen, nicht über die Römer selbst, und ist darum ein Denkschritt weiter. Ich empfehle die Fassung mit „Die Römer kannten noch keine …“.
2. **buch-bis-bahn, noch 3 Vorlagen:** Zwei davon helfen kaum, weil Tipp 1 dort schon „Buchdruck vor Karibik“ geordnet hat. Gemeint sind die Ziehungen ohne Fernrohr+Dampfmaschine und ohne Fernrohr+Mikroskop.
   - Abhilfe ohne neue Texte: zwei schon geprüfte Sätze hinten an `tipp2` hängen, vor die Vorlage: Buchdruck/Mikroskop (Hooke-Buch) und Dampfmaschine/Eisenbahn (Dampflok).
   - Ich habe es nicht eingebaut, weil die Entscheidung „drei Einträge“ lautete.
3. **„vor ein paar Jahren“ (Webb)** altert ebenfalls. Etwa ab 2032 prüfen oder wie die ISS im Code rechnen.
4. **Wasserball-Satellit:** freiwillige Genauigkeit des `fakten-pruefer` („ein Gerät, das um die Erde kreist“). Nicht übernommen, weil die `kinder-redaktion` den Satz so gelobt hat.
5. Offen bleiben aus der Endfassung: `history-writing` und Linda Hall. Ob Kinder den Profi oder Experte als Knobelei erleben, zeigt nur der `spieltester` oder echte Kinder.
