

# „Sortiere die Zeit“ (`world:chronology`): Fassung 2 des `karten-autor` (24.11.2026)

Das ist ein Entwurf des `karten-autor` nach drei Prüfberichten: `2026-11-24-sortiere-die-zeit-faktenpruefung.md`, `…-stufenpruefung.md` und `…-kinder-redaktion.md`. Dazu kommen die Punkte C1 bis C3 aus `2026-11-24-drei-spiele-entscheidungen.md`. Ich habe keine Datei geändert.

**Geprüft ist an dieser Fassung noch nichts.** Ich habe nur selbst gegengelesen: Quellen geöffnet und mit `node` nachgezählt. Jede neue oder geänderte Aussage trägt ⚠ (Abschnitt 6).

Das Dokument ersetzt die Endfassung ganz. Die alten Berichte braucht man zum Einbauen nicht.

Gelesen habe ich die fünf genannten Dateien, `Chronology` und `Rounds` in `app/world-games.tsx`, `app/kern/woerter.ts`, `app/kern/stufe.ts` (`mitErsterAntwort`, `stufenVorschlag`), `app/kern/karte/ordne-richtig.tsx` und die betroffenen Karten in `app/world-catalog.json`.

---

## 1. Der Vorrat: 24 Teile

Die Felder:
- `korb` gilt nur für Entdecker (`früh`, `mitte`, `spät`; `null` heißt: nie auf Entdecker).
- `fenster` gilt nur für Profi (`null` heißt: nie auf Profi). Es dient nur der Regel „höchstens 2 aus einem Fenster“ (Abschnitt 5), nicht mehr einer festen Reihenfolge.
- `gruppe` gilt nur für Experte (`null` heißt: nie auf Experte).
- `altId` ist die alte ID aus `TIME_IDS`.
- `jahrText` ist die Hauptzeile der Zeitangabe.
- **Neu:** `jahrGenau` ist eine zweite, kleinere Zeile. Es gibt sie nur bei Teilen vor dem Jahr 1000. Auf Entdecker wird sie nie gezeigt.
- `erklaerung` ist freiwillig: eine kleine Zeile, sobald das Rätsel gelöst ist.

**Regel für `jahrText`:**
- Vor dem Jahr 1000 heißt es „vor etwa N Jahren“, gerechnet ab 2026 und auf 50 oder 100 gerundet. Die genaue Angabe steht in `jahrGenau`.
- Ab dem Jahr 1000 steht nur die Jahreszahl da.

```json
[
 {"id":"zeit-steinwerkzeug","name":"Die ersten bekannten Steinwerkzeuge entstehen","jahr":-3300000,"jahrText":"vor etwa 3,3 Millionen Jahren","jahrGenau":null,"zeitwort":"vor sehr, sehr langer Zeit","korb":"früh","fenster":null,"gruppe":null,"karte":"history-stone_tools","quelle":[{"titel":"Harmand u. a., Nature 2015 (PubMed): 3.3-million-year-old stone tools from Lomekwi 3","url":"https://pubmed.ncbi.nlm.nih.gov/25993961/"},{"titel":"Natural History Museum London","url":"https://www.nhm.ac.uk/discover/news/2023/february/oldest-remains-ancient-human-relative-paranthropus-suggest-possible-tool-use.html"}]},
 {"id":"zeit-feuer","name":"Frühe Menschen nutzen Feuer","jahr":-790000,"jahrText":"vor mindestens 790.000 Jahren","jahrGenau":null,"zeitwort":"vor sehr, sehr langer Zeit","korb":"früh","fenster":null,"gruppe":null,"karte":"history-fire","quelle":[{"titel":"Smithsonian Human Origins Program · Hearths & Shelters","url":"https://humanorigins.si.edu/evidence/behavior/hearths-shelters"}]},
 {"id":"zeit-schrift","name":"Menschen beginnen, auf Tontafeln zu schreiben","jahr":-3200,"jahrText":"vor etwa 5.200 Jahren","jahrGenau":"um 3200 v. Chr.","zeitwort":"vor sehr, sehr langer Zeit","korb":"früh","fenster":"ganz-frueh","gruppe":"ganz-frueh","karte":"history-writing","quelle":[{"titel":"ISAC Museum, University of Chicago (Google Arts & Culture) · Early Writing in Mesopotamia","url":"https://artsandculture.google.com/story/rwWhZTdobl0nLA"}]},
 {"id":"zeit-pyramide","name":"Die große Pyramide von Gizeh wird gebaut","jahr":-2550,"jahrText":"vor etwa 4.600 Jahren","jahrGenau":"um 2550 v. Chr.","zeitwort":"vor sehr, sehr langer Zeit","korb":"früh","fenster":"ganz-frueh","gruppe":"ganz-frueh","karte":"history-pyramids","quelle":[{"titel":"Harvard University · Digital Giza","url":"https://giza.fas.harvard.edu/commontopics/"}]},
 {"id":"zeit-rom","name":"Rom bekommt seinen ersten Kaiser","jahr":-27,"jahrText":"vor über 2.000 Jahren","jahrGenau":"27 v. Chr.","zeitwort":"vor sehr, sehr langer Zeit","korb":null,"fenster":"ganz-frueh","gruppe":"ganz-frueh","karte":"history-rome","quelle":[{"titel":"Kunsthistorisches Museum Wien (Google Arts & Culture) · Emperor Augustus","url":"https://artsandculture.google.com/asset/oAHA3JvskhVbHA"}]},
 {"id":"zeit-papier","altId":"history-paper","name":"Papier aus China wird verbessert","jahr":105,"jahrText":"vor etwa 1.900 Jahren","jahrGenau":"im Jahr 105","zeitwort":"vor sehr, sehr langer Zeit","korb":null,"fenster":"ganz-frueh","gruppe":"ganz-frueh","karte":"history-paper","quelle":[{"titel":"Robert C. Williams Museum of Papermaking (Georgia Tech) · Early Papermaking in China","url":"https://paper.gatech.edu/early-papermaking"}]},
 {"id":"zeit-null","name":"Rechenregeln für die Null werden aufgeschrieben","jahr":628,"jahrText":"vor etwa 1.400 Jahren","jahrGenau":"im Jahr 628","zeitwort":"vor sehr, sehr langer Zeit","korb":null,"fenster":"ganz-frueh","gruppe":"ganz-frueh","karte":"history-zero","quelle":[{"titel":"University of St Andrews, MacTutor · Brahmagupta","url":"https://mathshistory.st-andrews.ac.uk/Biographies/Brahmagupta/"}]},
 {"id":"zeit-buchdruck","altId":"history-printing","name":"Gutenberg druckt Bücher mit Buchstaben aus Metall","jahr":1450,"jahrText":"um 1450","jahrGenau":null,"zeitwort":"vor ein paar hundert Jahren","korb":"mitte","fenster":"buch-bis-bahn","gruppe":"buch-bis-bahn","karte":"history-printing","quelle":[{"titel":"Stadt Mainz / Gutenberg.de · Zeitleiste Gutenberg","url":"https://www.gutenberg.de/zeit/zeitleiste_gutenberg"}]},
 {"id":"zeit-karibik","name":"Schiffe von Kolumbus erreichen die Karibik","jahr":1492,"jahrText":"1492","jahrGenau":null,"zeitwort":"vor ein paar hundert Jahren","korb":null,"fenster":"buch-bis-bahn","gruppe":"buch-bis-bahn","karte":"history-voyages1492","quelle":[{"titel":"Library of Congress · Columbus and the Taíno","url":"https://www.loc.gov/exhibits/exploring-the-early-americas/columbus-and-the-taino.html"}]},
 {"id":"zeit-fernrohr","name":"Ein Fernrohr wird zum ersten Mal beschrieben","jahr":1608,"jahrText":"1608","jahrGenau":null,"zeitwort":"vor ein paar hundert Jahren","korb":"mitte","fenster":"buch-bis-bahn","gruppe":"buch-bis-bahn","karte":"invention-telescope","quelle":[{"titel":"Linda Hall Library · Scientist of the Day: Hans Lipperhey","url":"https://www.lindahall.org/about/news/scientist-of-the-day/hans-lipperhey/"}]},
 {"id":"zeit-mikroskop","name":"Robert Hooke zeigt Zeichnungen aus dem Mikroskop","jahr":1665,"jahrText":"1665","jahrGenau":null,"zeitwort":"vor ein paar hundert Jahren","korb":null,"fenster":"buch-bis-bahn","gruppe":"buch-bis-bahn","karte":"invention-microscope","quelle":[{"titel":"Science Museum Group · Hooke's compound microscope (copy), 1665–1675","url":"https://collection.sciencemuseumgroup.org.uk/objects/co8391/hookes-compound-microscope-copy-1665-1675"}]},
 {"id":"zeit-dampfmaschine","name":"Newcomen baut eine Dampfmaschine für Bergwerke","jahr":1712,"jahrText":"1712","jahrGenau":null,"zeitwort":"vor ein paar hundert Jahren","korb":"mitte","fenster":"buch-bis-bahn","gruppe":"buch-bis-bahn","karte":"history-steam","quelle":[{"titel":"Science Museum Group · Desaguliers' Newcomen engine model","url":"https://collection.sciencemuseumgroup.org.uk/objects/co2000/demainbrays-newcomen-engine-model"}]},
 {"id":"zeit-eisenbahn","altId":"history-railway","name":"Die erste Dampf-Eisenbahn für alle fährt","jahr":1825,"jahrText":"1825","jahrGenau":null,"zeitwort":"vor ein paar hundert Jahren","korb":"mitte","fenster":"buch-bis-bahn","gruppe":"buch-bis-bahn","karte":"history-railway","quelle":[{"titel":"National Railway Museum · Shildon and Locomotion No. 1","url":"https://blog.railwaymuseum.org.uk/shildon-the-cradle-of-the-railways-and-locomotion-no-1/"}]},
 {"id":"zeit-aufzug","name":"Otis zeigt einen Aufzug mit Sicherheitsbremse","jahr":1854,"jahrText":"1854","jahrGenau":null,"zeitwort":"vor 100 bis 200 Jahren","korb":null,"fenster":null,"gruppe":"motoren","karte":"invention-elevator","quelle":[{"titel":"National Register of Historic Places · Otis, PDF, Abschnitt 8","url":"https://npgallery.nps.gov/GetAsset/07a0f86d-5e38-4a69-96f7-45050d94f808"},{"titel":"Otis · Our History (1853, 1854)","url":"https://www.otis.com/en/us/our-company/history"}]},
 {"id":"zeit-telefon","name":"Bell bekommt ein Patent auf sein Telefon","jahr":1876,"jahrText":"1876","jahrGenau":null,"zeitwort":"vor 100 bis 200 Jahren","korb":null,"fenster":"motoren","gruppe":"motoren","karte":"invention-phone","erklaerung":"Ein Patent schützt eine Erfindung. Andere dürfen sie dann nicht einfach nachbauen.","quelle":[{"titel":"Library of Congress · Information Bulletin (Bell Papers)","url":"https://www.loc.gov/loc/lcib/0404/digitize.html"}]},
 {"id":"zeit-auto","name":"Benz bekommt ein Patent auf sein Auto","jahr":1886,"jahrText":"1886","jahrGenau":null,"zeitwort":"vor 100 bis 200 Jahren","korb":null,"fenster":"motoren","gruppe":"motoren","karte":"invention-car","erklaerung":"Ein Patent schützt eine Erfindung. Andere dürfen sie dann nicht einfach nachbauen.","quelle":[{"titel":"DPMA · Postergalerie: Automobil","url":"https://www.dpma.de/fileadmin/user_upload/Dokumente/Entdecken/Postergalerie/06_automobil.pdf"}]},
 {"id":"zeit-flugzeug","name":"Die Brüder Wright lenken ein Flugzeug mit Motor","jahr":1903,"jahrText":"1903","jahrGenau":null,"zeitwort":"vor 100 bis 200 Jahren","korb":null,"fenster":"motoren","gruppe":"motoren","karte":"history-flight","quelle":[{"titel":"Smithsonian NASM · 1903 Wright Flyer","url":"https://airandspace.si.edu/collection-objects/1903-wright-flyer/nasm_A19610048000"},{"titel":"Smithsonian NASM · The Flight of the Airplane","url":"https://airandspace.si.edu/explore/stories/flight-airplane"}]},
 {"id":"zeit-rakete","name":"Die erste Rakete mit flüssigem Treibstoff fliegt","jahr":1926,"jahrText":"1926","jahrGenau":null,"zeitwort":"vor 100 bis 200 Jahren","korb":null,"fenster":"motoren","gruppe":"motoren","karte":"invention-rocket","quelle":[{"titel":"NASA · 95 Years Ago: Goddard's First Liquid-Fueled Rocket","url":"https://www.nasa.gov/history/95-years-ago-goddards-first-liquid-fueled-rocket/"}]},
 {"id":"zeit-satellit","name":"Der erste Satellit kreist um die Erde","jahr":1957,"jahrText":"1957","jahrGenau":null,"zeitwort":"vor 30 bis 70 Jahren","korb":"spät","fenster":"weltall-netz","gruppe":"weltall-netz","karte":"invention-satellite","erklaerung":"Ein Satellit ist ein Gerät im Weltall. Der erste war so groß wie ein Wasserball.","quelle":[{"titel":"NASA · Dawn of the Space Age","url":"https://www.nasa.gov/history/dawn-of-the-space-age/"}]},
 {"id":"zeit-mondlandung","altId":"history-apollo11","name":"Menschen landen auf dem Mond","jahr":1969,"jahrText":"1969","jahrGenau":null,"zeitwort":"vor 30 bis 70 Jahren","korb":"spät","fenster":"weltall-netz","gruppe":"weltall-netz","karte":"history-apollo11","quelle":[{"titel":"NASA · Apollo 11 Mission Overview","url":"https://www.nasa.gov/history/apollo-11-mission-overview/"}]},
 {"id":"zeit-internetseiten","altId":"history-web","name":"Ein Forscher schreibt seine Idee für Internetseiten auf","jahr":1989,"jahrText":"1989","jahrGenau":null,"zeitwort":"vor 30 bis 70 Jahren","korb":"spät","fenster":"weltall-netz","gruppe":"weltall-netz","karte":"history-web","quelle":[{"titel":"CERN · A short history of the Web","url":"https://home.cern/science/computing/the-birth-of-the-web/short-history-web/"}]},
 {"id":"zeit-smartphone","name":"Das erste Smartphone kommt in den Laden","jahr":1994,"jahrText":"1994","jahrGenau":null,"zeitwort":"vor 30 bis 70 Jahren","korb":null,"fenster":"weltall-netz","gruppe":null,"karte":"invention-smartphone","erklaerung":"Man konnte schon auf den Bildschirm tippen und E-Mails schreiben.","quelle":[{"titel":"TIME · Meet the First Smartphone (IBM Simon)","url":"https://time.com/3137005/first-smartphone-ibm-simon/"},{"titel":"Computer History Museum · IBM/BellSouth Simon Personal Communicator","url":"https://www.computerhistory.org/revolution/artifact/1733"}]},
 {"id":"zeit-iss","name":"Die erste Besatzung zieht in die Raumstation ISS","jahr":2000,"jahrText":"2000","jahrGenau":null,"zeitwort":"vor etwa 25 Jahren","korb":null,"fenster":"weltall-netz","gruppe":"weltall-netz","karte":"history-iss","quelle":[{"titel":"NASA · Expedition 1 kicks off science aboard the ISS","url":"https://www.nasa.gov/missions/station/iss-research/expedition-1-kicks-off-science-aboard-international-space-station/"}]},
 {"id":"zeit-webb","name":"Das Weltraum-Fernrohr Webb zeigt seine ersten Farbbilder","jahr":2022,"jahrText":"2022","jahrGenau":null,"zeitwort":"vor ein paar Jahren","korb":null,"fenster":"weltall-netz","gruppe":"weltall-netz","karte":"history-webb","quelle":[{"titel":"NASA · NASA Reveals Webb Telescope's First Images of Unseen Universe","url":"https://science.nasa.gov/missions/webb/nasa-reveals-webb-telescopes-first-images-of-unseen-universe/"}]}
]
```

Alle 24 Kartenverweise wie in der Endfassung. Es gibt keine neuen Karten und keine neuen IDs. `zeit-smartphone` hat jetzt `gruppe: null`: Es kommt auf Profi vor, auf Experte nicht mehr.

**Für Claude, außerhalb des Spiels:**
- Die Karte `invention-smartphone` hat `invention.year: 1993`. Sie soll auf 1994 angeglichen werden (Faktenprüfung, nötige Änderung 1). `invention.date` („Frühe Kombinationen: 1990er-Jahre“) kann bleiben.
- Offen aus der Endfassung bleibt: `history-writing` (3200–3000 v. Chr. gegenüber ISAC 3400–3200) und Linda Hall als Quelle auf `invention-telescope`.

## 2. Zeitwörter und Körbe

Es gibt sechs feste Zeitwörter, gerechnet ab 2026. Neu: Die Zeitwörter nennen keine Familie mehr (Oma, Opa, Mama, Papa), sondern Zahlen.

| Zeitwort (fester Wortlaut) | Jahre | Entdecker-Korb | Teile |
|---|---|---|---|
| vor sehr, sehr langer Zeit | bis 999 | **früh** | Steinwerkzeuge, Feuer, Schrift, Pyramide (nur Profi/Experte: Rom, Papier, Null) |
| vor ein paar hundert Jahren | 1400 bis 1825 (über 200 Jahre her) | **mitte** | Buchdruck, Fernrohr, Dampfmaschine, Eisenbahn (nur Profi/Experte: Karibik, Mikroskop) |
| vor 100 bis 200 Jahren | 1826 bis 1926 | – | Aufzug, Telefon, Auto, Flugzeug, Rakete |
| vor 30 bis 70 Jahren ⚠ | 1956 bis 1996 | **spät** | Satellit, Mondlandung, Internetseiten (nur Profi: Smartphone) |
| vor etwa 25 Jahren ⚠ | 1997 bis 2005 | – | ISS |
| vor ein paar Jahren | ab 2013 | – | Webb |

- Grenzen ab 2026: Satellit 69 Jahre, Smartphone 32, ISS 26, Webb 4.
- Lücken ohne Zeitwort (dort liegt heute kein Teil): 1000 bis 1399, 1927 bis 1955, 2006 bis 2012.
- Die Eisenbahn bleibt im Korb `mitte`, wie es der stufen-pruefer empfiehlt. Die Grenze von 245 Jahren galt für Eisenbahn und Telefon zusammen, und das Telefon kommt auf Entdecker nicht vor.
- Entdecker: In jedem Rätsel kommt ein Teil aus jedem Korb. Das ergibt 4 × 4 × 3 = **48 Rätsel** und **432 Runden** (2 Rätsel ohne gemeinsame Teile). Der kleinste Abstand ist **132 Jahre** (Eisenbahn 1825, Satellit 1957).

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
  "profi": "Ordne von früher nach später. Die Jahreszahlen siehst du, wenn alles stimmt.",
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
 "rundeOhneStempel": "Diese Runde ist zu Ende. Willst du gleich noch eine spielen?",
 "nachDemLoesen": "Zeile 1: {jahrText} · {zeitwort}; Zeile 2 (klein, nur Profi und Experte): {jahrGenau}",
 "vChrErklaerung": "v. Chr. heißt „vor Christus“, also vor dem Jahr 1. Hier zählt man rückwärts: Die größere Zahl ist früher."
}
```

**Regeln für den Einbau:**

- **Wann die Zeiten sichtbar werden (C3, Nutzer):** Jahreszahl, Zeitwort und `erklaerung` kommen erst, wenn das Rätsel gelöst ist oder „Lösung zeigen“ gedrückt wurde. Ausnahmen sind die beiden Tipps unten. Die Profi-Einleitung sagt das jetzt so (P2).
- **`nachDemLoesen`:**
  - Beginnt `jahrText` mit „vor“, fällt „· {zeitwort}“ weg (sonst stünde „vor“ dreimal da).
  - Zeile 2 (`jahrGenau`) gibt es nur auf Profi und Experte und nur, wenn sie nicht `null` ist.
  - Beispiel Entdecker: „1450 · vor ein paar hundert Jahren“. Beispiel Profi: „vor etwa 4.600 Jahren“ und darunter klein „um 2550 v. Chr.“.
- **Vorlesen:** Vor dem Lösen liest der Knopf nur die Namen. Danach liest er Name, `jahrText` und `jahrGenau`; dabei wird „v. Chr.“ als „vor Christus“ ausgeschrieben.
- **`vChrErklaerung`:** einmal je Rätsel, wenn ein sichtbares `jahrGenau` „v. Chr.“ enthält. Das kommt nur auf Profi und Experte vor.
- **`erklaerung` beim Patent:**
  - Höchstens einmal je Rätsel, und zwar beim älteren Teil.
  - Auf Profi stehen Telefon und Auto wegen der 50-Jahre-Regel nie zusammen. Auf Experte (motoren) schon.
- **Entdecker-Tipp:** Unter allen drei Teilen steht das Zeitwort. Das bleibt so, wie es der stufen-pruefer in D1 empfiehlt: Zeitwörter zu ordnen ist selbst der Lerninhalt.
- **Entdecker, Fehler:**
  - Grüne Teile stehen richtig und sind gesperrt.
  - Bei 3 Teilen stehen nach dem Prüfen 0, 1 oder 3 richtig, nie genau 2. Steht genau 1 richtig, sind die anderen zwei vertauscht, darum „Tausch die anderen zwei!“.
  - `entdecker_keins` ist wörtlich `WOERTER.nochNicht`.
- **Profi-Tipp (P3):**
  - Der Tipp hängt nicht davon ab, wie die Teile gerade stehen. Er zeigt unter den beiden Teilen mit dem kleinsten Abstand im Rätsel den `jahrText` (nur Zeile 1). Bei Gleichstand nimmt er das ältere Paar.
  - Er wird einmal je Rätsel festgelegt und ändert sich beim Schieben nicht.
- **Profi, Fehler:** Es wird nur gezählt, nicht gezeigt, welche Teile richtig stehen. Bei 4 Teilen sind 0, 1 oder 2 richtig, nie genau 3.
- **„Lösung zeigen“:**
  - Nur auf Profi und Experte, nach dem 3. Fehlversuch, neben dem Prüfknopf.
  - Er sortiert die Teile, zeigt die Zeiten und `loesungText` und danach den Weiterknopf.
  - Auf Entdecker ist er nie nötig: Nach höchstens 3 Prüfungen ist das Rätsel gelöst (D2).
- **Ende der Runde:**
  - Sind beide Rätsel ohne „Lösung zeigen“ gelöst: `geschafft` und `gespeichert`, Stempel über `onWin`.
  - Sonst: `rundeOhneStempel` und kein Stempel (Vorschlag; siehe Offen 4).
- **Experte-Regel (C1):** Experte hat 30 Rätsel (Abschnitt 8). Experte ist also echt spielbar, der Satz E3 („Experte gibt es hier noch nicht“) entfällt für dieses Spiel.
- **Stufen-Vorschläge (E6), Vorschlag für `mitErsterAntwort`:** Je Rätsel wird höchstens einmal gemeldet, Schlüssel `zeit:<Teil-IDs sortiert>`.
  - Erste Prüfung richtig → `richtig = true`. Das zählt für „Willst du … probieren?“.
  - „Lösung zeigen“ → `richtig = false`. Das zählt für „Eine Stufe leichter?“.
  - Gelöst beim 2. oder 3. Versuch → nichts melden, aber die Folge leeren (`antworten: []`, `gefragt` bleibt). Damit unterbricht ein Rätsel mit Mühe eine Serie, ohne als falsch zu zählen.
  - Folge: Wer auf Experte normal knobelt, bekommt keinen Vorschlag „leichter“. Erst zweimal hintereinander „Lösung zeigen“ löst ihn aus.

## 4. Experte: 4 Gruppen mit Tipps

**Ziehung:**
- Je Rätsel 4 Teile aus einer Gruppe, je Runde zwei verschiedene Gruppen.
- Die nächste Runde nimmt bevorzugt die beiden Gruppen, die zuletzt nicht dran waren (stufen-pruefer, Frage 9).
- Innerhalb einer Gruppe nicht dieselben 4 Teile wie beim letzten Mal.

**Tipps:**
- Tipp 1 ist der erste Eintrag in `tipp1`, dessen `braucht`-Teile alle im Rätsel sind.
- Tipp 2 ist der erste passende Eintrag in `tipp2`, **dessen Text nicht schon Tipp 1 war** (neu, weil ein Satz in beiden Listen der Gruppe weltall-netz steht).
- `vorlage` mit dem ältesten gezogenen Teil ist der letzte Rückfall.
- Tipp 1 ordnet höchstens zwei Teile (E2) und verrät nie die ganze Reihenfolge.
- Gruppennamen (`titel`) stehen nur im Code.

```json
[
 {"gruppe":"ganz-frueh","titel":"Ganz früh","teile":["zeit-schrift","zeit-pyramide","zeit-rom","zeit-papier","zeit-null"],
  "tipp1":[
   {"braucht":["zeit-schrift","zeit-pyramide"],"text":"Von den Bauarbeiten an der großen Pyramide gibt es ein Tagebuch."},
   {"braucht":["zeit-rom","zeit-null"],"text":"Die Römer hatten kein Zeichen für die Null."},
   {"braucht":[],"text":"Frag dich bei jedem Teil: Was musste es vorher schon geben?"}],
  "tipp2":[
   {"braucht":["zeit-rom","zeit-papier"],"text":"Rom hatte schon über 100 Jahre lang Kaiser. Dann wurde in China das Papier verbessert."},
   {"braucht":["zeit-papier","zeit-null"],"text":"Papier ist älter als die Rechenregeln für die Null."},
   {"braucht":["zeit-pyramide","zeit-rom"],"text":"Die große Pyramide war schon über 2.000 Jahre alt. Erst dann bekam Rom seinen ersten Kaiser."},
   {"braucht":[],"vorlage":"Ganz nach oben gehört: {name}."}]},
 {"gruppe":"buch-bis-bahn","titel":"Vom Buchdruck zur Eisenbahn","teile":["zeit-buchdruck","zeit-karibik","zeit-fernrohr","zeit-mikroskop","zeit-dampfmaschine","zeit-eisenbahn"],
  "tipp1":[
   {"braucht":["zeit-buchdruck","zeit-karibik"],"text":"Den Brief von Kolumbus über seine Reise druckte man viele Male."},
   {"braucht":["zeit-dampfmaschine","zeit-eisenbahn"],"text":"Was musste es geben, damit eine Dampflok fahren kann?"},
   {"braucht":["zeit-karibik","zeit-fernrohr"],"text":"Kolumbus hatte noch kein Fernrohr an Bord."},
   {"braucht":["zeit-buchdruck","zeit-mikroskop"],"text":"Robert Hooke ließ seine Mikroskop-Zeichnungen als Buch drucken."},
   {"braucht":[],"text":"Frag dich bei jedem Teil: Was musste es vorher schon geben?"}],
  "tipp2":[
   {"braucht":[],"vorlage":"Ganz nach oben gehört: {name}."}]},
 {"gruppe":"motoren","titel":"Vom Aufzug zur Rakete","teile":["zeit-aufzug","zeit-telefon","zeit-auto","zeit-flugzeug","zeit-rakete"],
  "tipp1":[
   {"braucht":["zeit-auto","zeit-flugzeug"],"text":"Das erste Flugzeug hatte einen Benzinmotor. Den gab es vorher schon in Autos."},
   {"braucht":["zeit-flugzeug","zeit-rakete"],"text":"Erst in der Luft, dann in Richtung Weltall."},
   {"braucht":["zeit-auto","zeit-rakete"],"text":"Erst auf der Straße, dann in Richtung Weltall."}],
  "tipp2":[
   {"braucht":["zeit-aufzug","zeit-telefon"],"text":"Aufzug und Telefon sind hier die Ältesten. Der Aufzug kam zuerst."},
   {"braucht":["zeit-telefon","zeit-auto"],"text":"Das Telefon kam zehn Jahre vor dem Auto."},
   {"braucht":[],"vorlage":"Ganz nach oben gehört: {name}."}]},
 {"gruppe":"weltall-netz","titel":"Weltall und Internet","teile":["zeit-satellit","zeit-mondlandung","zeit-internetseiten","zeit-iss","zeit-webb"],
  "tipp1":[
   {"braucht":["zeit-satellit","zeit-mondlandung"],"text":"Bevor Menschen ins All fliegen, muss erst etwas ohne Menschen hinauf."},
   {"braucht":["zeit-satellit","zeit-iss"],"text":"Bevor Menschen ins All fliegen, muss erst etwas ohne Menschen hinauf."},
   {"braucht":["zeit-mondlandung","zeit-iss"],"text":"Erst flogen Menschen kurz zum Mond. Später wohnten sie lange im All."},
   {"braucht":[],"text":"Frag dich bei jedem Teil: Was musste es vorher schon geben?"}],
  "tipp2":[
   {"braucht":["zeit-internetseiten","zeit-mondlandung"],"text":"Die Idee für Internetseiten kam etwa 20 Jahre nach der Mondlandung."},
   {"braucht":["zeit-internetseiten","zeit-iss"],"text":"Als die ISS ihre erste Besatzung bekam, gab es schon Internetseiten."},
   {"braucht":["zeit-mondlandung","zeit-iss"],"text":"Erst flogen Menschen kurz zum Mond. Später wohnten sie lange im All."},
   {"braucht":[],"vorlage":"Ganz nach oben gehört: {name}."}]}
]
```

**Tipps je Ziehung (von Hand durchgegangen, alle 30 Rätsel):**

- **ganz-frueh:**
  - ohne Schrift oder ohne Pyramide: Tipp 1 Römer/Null, Tipp 2 Rom/Papier.
  - ohne Rom: Tagebuch, dann Papier/Null.
  - ohne Papier: Tagebuch, dann Pyramide/Rom.
  - ohne Null: Tagebuch, dann Rom/Papier.
  - Den allgemeinen Satz braucht es nicht mehr.
- **buch-bis-bahn:** Alle 15 Ziehungen bekommen einen eigenen Tipp 1. Ein Rätsel ohne eines der Paare Buchdruck/Karibik, Dampfmaschine/Eisenbahn, Karibik/Fernrohr oder Buchdruck/Mikroskop gibt es nicht.
- **motoren:**
  - ohne Aufzug, ohne Telefon oder ohne Rakete: Benzinmotor.
  - ohne Auto: Luft/Weltall.
  - ohne Flugzeug: Straße/Weltall.
  - Tipp 1 ordnet immer genau zwei Teile.
- **weltall-netz:**
  - ohne Satellit: Mond/ISS, dann Internetseiten/Mond.
  - ohne Mondlandung: Satellit/ISS, dann Internetseiten/ISS.
  - ohne Internetseiten: Satellit/Mond, dann Mond/ISS.
  - ohne ISS oder ohne Webb: Satellit/Mond, dann Internetseiten/Mond.

**Abstände in den Gruppen** (Jahre, ohne Jahr 0):
- ganz-frueh: 650, 2.523, 131, 523
- buch-bis-bahn: 42, 116, 57, 47, 113
- motoren: 22, 10, 17, 23
- weltall-netz: 12, 20, 11, 22

## 5. Profi: Ziehregel ohne festes Fenstermuster (P1)

Ziehregel:
- 4 Teile aus dem ganzen Profi-Vorrat (21 Teile, alle mit `fenster` ≠ `null`).
- Höchstens 2 Teile aus einem Fenster.
- Mindestens 50 Jahre zwischen je zwei Teilen (ohne Jahr 0).
- Die Reihenfolge der Fenster spielt keine Rolle mehr.

Nachgezählt mit `node`:
- **2.815 Rätsel**. Davon haben 2.155 zwei Teile aus einem Fenster, 660 je eines aus vier Fenstern. Das stimmt mit dem stufen-pruefer überein.
- Der kleinste Abstand ist genau 50 Jahre (Telefon 1876, Rakete 1926).
- Runden (2 Rätsel ohne gemeinsame Teile): 1.511.194.

Je Rätsel 4 Teile; vorher ziehen, dann mischen. Wie bei `gemischt` in `ordne-richtig.tsx`: Eine neue Reihe ist nie schon richtig.

Nebenwirkungen:
- Das Paar Rakete/Satellit (31 Jahre, echte Abhängigkeit) kommt auf Profi nicht mehr vor. Mit 30 Jahren statt 50 gäbe es 3.769 Rätsel, und es bliebe drin (siehe Offen 6).
- Teile aus „Weltall und Internet“ kommen seltener dran (Satellit 370-mal, Rom 682-mal von 2.815), weil sie eng beieinander liegen.
- Der Aufzug bleibt auf Profi aus, wie in der Endfassung (siehe Offen 7).

## 6. Quellen und was der `fakten-pruefer` prüfen soll

Nicht neu zu prüfen ist, was die Faktenprüfung der Endfassung unter „Kann so bleiben“ bestätigt hat:
- Kolumbus/Fernrohr, „erreichen“, Rom 27 v. Chr., Aufzug 1854, Fernrohr „beschrieben“, Feuer, Webb 2022
- alle Altersangaben
- die Tipps zu Papier/Null, Pyramide/Rom, Dampflok, Satellit und Mondlandung/Internetseiten (dieser in neuem Wortlaut, siehe ⚠ 15)
- Zeitwort-Grenzen, Reihenfolgen und Körbe

**Neu oder geändert, bitte prüfen (⚠):**

| Nr. | Stelle | Wortlaut | Quelle (vom Helfer geöffnet, wenn nicht anders vermerkt) |
|---|---|---|---|
| ⚠ 1 | `zeit-smartphone`, Name, Jahr | „Das erste Smartphone kommt in den Laden“, 1994 | TIME, https://time.com/3137005/first-smartphone-ibm-simon/: „went on sale to the public on August 16, 1994“; „first showed Simon off in late 1992“. CHM, https://www.computerhistory.org/revolution/artifact/1733: „the first smartphone“, „Date Introduced 1993“ (was CHM mit 1993 meint, bleibt unklar). |
| ⚠ 2 | `zeit-smartphone`, `erklaerung` | „Man konnte schon auf den Bildschirm tippen und E-Mails schreiben.“ | TIME (wie oben): „packed a touchscreen, email capability“. CHM nennt Telefon, Organizer, Fax, Pager. |
| ⚠ 3 | ganz-frueh, Tipp 1 | „Von den Bauarbeiten an der großen Pyramide gibt es ein Tagebuch.“ | Wortlaut nach dem Vorschlag des fakten-pruefer. Pierre Tallet, *Les papyrus de la mer Rouge I. Le « journal de Merer »*, IFAO 2017, Inhaltsübersicht https://www.ifao.egnet.net/uploads/publications/sommaires/IF1150.pdf (vom Helfer nicht geöffnet); Smithsonian Magazine, https://www.smithsonianmag.com/history/ancient-egypt-shipping-mining-farming-economy-pyramids-180956619/ |
| ⚠ 4 | ganz-frueh, Tipp 1, neu | „Die Römer hatten kein Zeichen für die Null.“ | Florida State University, Mathematik, Seite „Zero“: „there is no symbol for "zero" in the Roman numerals“, https://math.fsu.edu/~wooland/hm2ed/Part1Module1/zero.html. Die Quelle ist eine Kursseite ohne Autor, bitte mit Britannica („Roman numeral“) gegenprüfen. Trägt der Schluss „Römer ohne Null → Rom vor den Rechenregeln für die Null“ für 27 v. Chr. und 628? |
| ⚠ 5 | ganz-frueh, Tipp 2, neu (E1) | „Rom hatte schon über 100 Jahre lang Kaiser. Dann wurde in China das Papier verbessert.“ | Rechnung: 27 v. Chr. bis 105 sind 131 Jahre. Quellen: KHM Wien (Augustus 27 v. Chr.), Georgia Tech Papermaking (105). Gegenüber E1 heißt es „lang Kaiser“ statt „einen Kaiser“, damit es nicht klingt wie ein einziger Kaiser 100 Jahre lang. |
| ⚠ 6 | buch-bis-bahn, Tipp 1, neu (E4) | „Den Brief von Kolumbus über seine Reise druckte man viele Male.“ | Princeton University Library, Rare Books, „Editions of the ‚Columbus Letter‘“, https://rarebooks.blogs.princeton.edu/2014/02/editions-of-the-columbus-lette/: „first appeared in print in a Spanish edition published in Barcelona in 1493“; „Within four years it had gone through fifteen known editions“, „in ten cities across Europe“. |
| ⚠ 7 | motoren, Tipp 1, neu (E2) | „Das erste Flugzeug hatte einen Benzinmotor. Den gab es vorher schon in Autos.“ | NASM, 1903 Wright Flyer: „the Wrights built a small, twelve-horsepower gasoline engine“, https://airandspace.si.edu/collection-objects/1903-wright-flyer/nasm_A19610048000. DPMA-Poster: Benz 1886 „Automobil mit Verbrennungsmotor“; „in den USA im Jahr 1900 … 22 Prozent mit Benzin“. Bitte prüfen: Ist Benz' Kraftstoff (Ligroin, ein Leichtbenzin) als „Benzin“ vertretbar? Der zweite Satz stützt sich auf die DPMA-Zahl für 1900. |
| ⚠ 8 | motoren, Tipp 1 | „Erst in der Luft, dann in Richtung Weltall.“ / „Erst auf der Straße, dann in Richtung Weltall.“ | Kurzformen des geprüften Satzes. Die kinder-redaktion fragt, ob „in Richtung Weltall“ für Goddards Rakete trägt (etwa 12 m hoch). NASA-Seite wie in Abschnitt 1. |
| ⚠ 9 | weltall-netz, Tipp 1 und 2 | „Erst flogen Menschen kurz zum Mond. Später wohnten sie lange im All.“ | Wortlaut des fakten-pruefer; Bedingung jetzt Mondlandung + ISS. NASA Apollo 11, NASA Expedition 1. Der alte Satz „In der ISS leben bis heute Menschen.“ ist gestrichen. |
| ⚠ 10 | weltall-netz, Tipp 2, neu | „Als die ISS ihre erste Besatzung bekam, gab es schon Internetseiten.“ | CERN, A short history of the Web: „By the end of 1990, Tim Berners-Lee had the first Web server and browser up and running“; Software 1991 veröffentlicht. NASA Expedition 1 (2.11.2000). |
| ⚠ 11 | `zeit-internetseiten`, Name | „Ein Forscher schreibt seine Idee für Internetseiten auf“ | CERN: „Tim Berners-Lee wrote the first proposal for the World Wide Web in March 1989.“ |
| ⚠ 12 | `zeit-mikroskop`, Name; Hooke-Tipp | „Robert Hooke zeigt Zeichnungen aus dem Mikroskop“ / „Robert Hooke ließ seine Mikroskop-Zeichnungen als Buch drucken.“ | Vorschlag des fakten-pruefer. Science Museum Group: „Micrographia, published in 1665, presented intriguing illustrations“. |
| ⚠ 13 | `zeit-flugzeug`, Name | „Die Brüder Wright lenken ein Flugzeug mit Motor“ | Vorschlag der kinder-redaktion. NASM: „first successful flights of a powered heavier-than-air flying machine“, 17.12.1903. Das Wort „erste“ fällt weg; Giffard (Luftschiff 1852) ist kein Flugzeug. |
| ⚠ 14 | `zeit-dampfmaschine`, Name | „Newcomen baut eine Dampfmaschine für Bergwerke“ | Science Museum Group (Newcomen-Maschine pumpte Wasser aus Bergwerken). Jahr und Ereignis wie geprüft, nur neuer Wortlaut. |
| ⚠ 15 | weltall-netz, Tipp 2 | „Die Idee für Internetseiten kam etwa 20 Jahre nach der Mondlandung.“ | Geprüfter Satz; „Plan“ wird zu „Idee“, passend zum neuen Namen. |
| ⚠ 16 | `zeit-webb`, Name | „Das Weltraum-Fernrohr Webb zeigt seine ersten Farbbilder“ | NASA, 12.7.2022: „first full-color images“. Aus „Teleskop“ wird „Fernrohr“, wie bei `zeit-fernrohr`. |
| ⚠ 17 | `zeit-satellit`, `erklaerung`, neu | „Ein Satellit ist ein Gerät im Weltall. Der erste war so groß wie ein Wasserball.“ | NASA, Dawn of the Space Age: „about the size of a beach ball (58 cm …)“. Ist „Wasserball“ (aufblasbarer Ball) als Übersetzung für „beach ball“ in Ordnung? |
| ⚠ 18 | `zeit-telefon`, `zeit-auto`, `erklaerung` | „Ein Patent schützt eine Erfindung. Andere dürfen sie dann nicht einfach nachbauen.“ | Wortlaut der kinder-redaktion; allgemeine Erklärung, DPMA. Der Name des Telefons heißt jetzt „… auf sein Telefon“. |
| ⚠ 19 | `zeit-rom`, `zeit-karibik`, `zeit-aufzug`, Quellen | KHM Wien statt Met; Library of Congress statt NMAI; National Register zuerst | KHM, https://artsandculture.google.com/asset/oAHA3JvskhVbHA: „Augustus, the first Roman emperor (reigned 27 BC – AD 14)“ (geöffnet). Library of Congress (nicht geöffnet, Adresse aus der Faktenprüfung). National Register (aus der Faktenprüfung). |
| ⚠ 20 | `zeit-rom`, `jahrText` | „vor über 2.000 Jahren“ | 27 v. Chr. bis 2026 sind 2.052 Jahre (Faktenprüfung, Punkt 12). |
| ⚠ 21 | Zeitwörter | „vor 30 bis 70 Jahren“ (1956–1996), „vor etwa 25 Jahren“ (1997–2005) | Rechnung ab 2026: 1957 = 69, 1969 = 57, 1989 = 37, 1994 = 32, 2000 = 26 Jahre. |

Nicht geöffnet: IFAO-PDF, Library of Congress (Taíno), Britannica. Zitate aus TIME, KHM, NASM, CERN, Princeton, FSU und NASA kenne ich über WebFetch-Zusammenfassungen. Das DPMA-PDF habe ich als Text gelesen.

## 7. Umformuliert (alt → neu)

**Keine gespeicherten Antworttexte.** Aus diesem Spiel steht nichts in `tests/fixtures/gespeicherte-antworten*.json`.

Gespeicherter Spielstand:
- Heute speichert `useSavedGame('items')` die 5 Karten-IDs aus `TIME_IDS`.
- Vorschlag wie in der Endfassung: Ein alter Stand mit 5 Teilen wird verworfen, und es startet eine neue Runde.
- Dafür bekommt der neue Stand eigene Schlüssel, nicht mehr `items`.
- `world:chronology`, Stempel und `geschafft` bleiben.

Angezeigte Texte (keine Kinderantworten):
- Spielliste: „Was kam zuerst? Ordne fünf Erfindungen und Ereignisse.“ → „Was kam zuerst? Bring Erfindungen und Ereignisse in die richtige Reihenfolge.“
- Mission: „Ordne fünf Ereignisse im Zeitspiel.“ → „Löse eine Runde im Zeitspiel.“
- Rückmeldung „… Schau auf die Jahreszahlen.“ entfällt.

## 8. Zahlen (nachgezählt mit `node`)

| Stufe | Teile im Vorrat | je Rätsel | Rätsel | Runden (2 Rätsel) | kleinster Abstand im Rätsel |
|---|---|---|---|---|---|
| Entdecker | 11 (4 früh, 4 mitte, 3 spät) | 3 | 48 | 432 | 132 Jahre (Eisenbahn/Satellit) |
| Profi | 21 (5 + 6 + 4 + 6), Ziehregel aus Abschnitt 5 | 4 | 2.815 (2.155 mit 2 aus einem Fenster) | 1.511.194 | 50 Jahre (Telefon/Rakete) |
| Experte | 21 in 4 Gruppen (5, 6, 5, 5) | 4 | 30 (5 + 15 + 5 + 5) | 300 (zwei verschiedene Gruppen) | 10 Jahre (Telefon/Auto); weltall-netz 11 (Internetseiten/ISS, jetzt mit Tipp) |

- **Textlängen:** Namen höchstens 8 Wörter (Flugzeug, Internetseiten und ISS haben genau 8). Jeder Satz in Tipps, Erklärungen und Rückmeldungen hat höchstens 11 Wörter. Sätze mit genau 11 Wörtern: Tagebuch, Kolumbus-Brief, Satellit/Menschen, Internetseiten/Mondlandung, ISS/Internetseiten und der allgemeine Satz.
- **„Einzige längste / einzige kürzeste“:** Das gilt hier nicht. Das Spiel sortiert und hat keine Antwortwahl; es gibt 0 Fragen mit Antwortliste.
- **Ratemuster bei den Namen:** Das Wort „erste“ steht bei 9 von 24 Teilen und ist über alle Zeiten verteilt. Die Gruppennamen sind unsichtbar.

## 9. Was hat sich gegenüber der Endfassung geändert

1. **Smartphone:** 1994 statt 1993, „kommt in den Laden“, Quellen TIME und CHM, neue `erklaerung`. Es ist aus der Experte-Gruppe genommen, bleibt aber auf Profi. Seine zwei Experte-Tipps sind gestrichen. Die Karte soll auf 1994 angeglichen werden.
2. **Merer-Tipp** neu nach dem Wortlaut des fakten-pruefer, mit IFAO als Quelle.
3. **ISS-Tipp** „bis heute“ gestrichen. Neu ist der Satz des fakten-pruefer mit der Bedingung Mondlandung + ISS, in Tipp 1 und Tipp 2. Dazu kommt die Regel „Tipp 2 ≠ Tipp 1“.
4. **Quellen:** KHM Wien (Rom), Library of Congress (Karibik), National Register zuerst (Aufzug).
5. **Profi ohne festes Fenstermuster (P1):** Ziehregel mit höchstens 2 je Fenster und mindestens 50 Jahren, 2.815 Rätsel.
6. **Profi-Einleitung (P2):** „… siehst du, wenn alles stimmt.“
7. **Profi-Tipp (P3):** hängt nicht von der Stellung ab. Er zeigt die Zeiten des engsten Paars, mit dem Satz „Unter zwei Teilen steht jetzt, wann sie waren.“
8. **Neue Experte-Tipps:**
   - E1: Rom/Papier, umformuliert zu „lang Kaiser“.
   - E2: Motoren-Tipp 1 ordnet nur noch zwei Teile; neuer Satz zum Benzinmotor mit Quelle.
   - E4: Kolumbus-Brief, mit Princeton als Quelle.
   - Dazu, über E1 bis E4 hinaus: Römer/Null (ganz-frueh, Tipp 1) und Internetseiten/ISS (weltall-netz, Tipp 2), damit jede Ziehung einen eigenen Tipp hat.
9. **Experte-Einleitung neutral:** „Diesmal wird es knifflig.“
10. **„Zeichnungen“ statt „Bilder“** bei Mikroskop-Name und Hooke-Tipp.
11. **Stufen-Vorschläge (E6)** für `mitErsterAntwort` ausgearbeitet: erste Prüfung richtig = richtig, „Lösung zeigen“ = falsch, späteres Lösen leert die Folge.
12. **Zeitwörter neutral:** „vor 30 bis 70 Jahren“, „vor etwa 25 Jahren“.
13. **Anzeige nach dem Lösen:**
    - Neues Feld `jahrGenau` (zweite Zeile, nicht auf Entdecker).
    - Kein Zeitwort, wenn `jahrText` mit „vor“ beginnt.
    - „v. Chr.“ wird beim Vorlesen ausgeschrieben.
    - Rom heißt jetzt „vor über 2.000 Jahren“.
    - `vChrErklaerung` neu formuliert.
14. **Namen:** Dampfmaschine, Flugzeug, Internetseiten, Webb (Fernrohr, Farbbilder), Telefon („sein Telefon“).
15. **Rückmeldungen:** `profi_0` mit „Versuch es noch einmal!“, `profi_1`/`profi_2` mit „schon“, `entdecker_eins` mit „Tausch die anderen zwei!“.
16. **Neu:** „Lösung zeigen“ (Knopf und Text), `rundeOhneStempel`, `gespeichert` im Wortlaut der anderen Weltspiele, Patent-Erklärung höchstens einmal je Rätsel, Satellit mit `erklaerung`.
17. **Experte-Ziehung:** Die nächste Runde nimmt bevorzugt die beiden anderen Gruppen; nicht dieselben 4 Teile wie beim letzten Mal.

**Wo ich einer Empfehlung nicht oder nur teilweise folge:**
- **Profi-Tipp:** Weder der Satz des stufen-pruefer („Ein Tipp: {A} war {jahrA}, {B} war {jahrB}“; lang, Zeiten wie „vor etwa 4.600 Jahren“ passen nicht in „war“) noch der Satz der kinder-redaktion („Unter einem Teil …“; nur ein Teil hilft wenig, P3). Ich nehme den Gedanken des einen und die Form der anderen: zwei Teile, kurzer Satz.
- **E2:** Den Satz „…, wie er auch in Autos steckt“ übernehme ich nicht. Er sagt in der Gegenwart nichts über die Reihenfolge und war ungeprüft. Ersetzt durch einen belegten Benzinmotor-Satz.
- **E1:** „einen Kaiser“ wird zu „lang Kaiser“ (sonst sachlich schief).
- **Experte-Einleitung:** Den Vorschlag des fakten-pruefer („schwer auseinanderzuhalten“) nehme ich nicht, „knifflig“ ist kürzer und kinderleichter. Auch „Was musste es vorher schon geben?“ geht nicht, das ist schon der Rückfall-Tipp (Regel 9, Doppeltes).
- **ISS:** Den Satz der kinder-redaktion („Wer in der ISS wohnen will …“) nehme ich nicht. Er ordnet kein Paar der Gruppe außer gegenüber dem Satelliten, und das sagt der Satelliten-Tipp schon.
- **`vorlesenKnopf`:** „Vorlesen“ statt „Alles vorlesen“ (kinder-redaktion). So heißt derselbe Knopf in den anderen Weltspielen (`Rounds` in `world-games.tsx`); einheitlicher Baustein.
- **`gespeichert`:** „Dein Spielstempel bleibt in deinem Entdeckerpass.“ statt „Gespeichert in deinem Entdeckerpass.“. Das ist der Wortlaut am Ende der anderen Weltspiele.
- **Vorlage „Ganz nach oben gehört: {name}.“** bleibt ohne Anführungszeichen. Die kinder-redaktion hat sie freigegeben.

## 10. Offen (Claude oder die Prüfer entscheiden)

1. **„vor 30 bis 70 Jahren“ neben Wort-Zeitwörtern:** Auf Entdecker müssen Kinder „vor ein paar hundert Jahren“ und „vor 30 bis 70 Jahren“ vergleichen. Das ist für 5-Jährige nur mit Vorlesen machbar (`stufen-pruefer`, `kinder-redaktion`). Feste Grenzen altern: ab 2027 jährlich prüfen oder im Code ab dem aktuellen Jahr rechnen.
2. **Restwissen auf Experte:**
   - Webb hat keinen eigenen Tipp. Ein echter Vorgänger wäre ein früheres Weltraum-Fernrohr; dafür gibt es keine Karte (Idee fürs BACKLOG, wie im Stufenbericht).
   - Mikroskop/Dampfmaschine (47 Jahre) hat keinen Tipp. Eine belegbare Abhängigkeit habe ich nicht gefunden.
3. **„Das grüne Teil“:** zusätzlich ein Haken, damit es nicht nur an der Farbe hängt (`design-pruefer`).
4. **Ohne Stempel nach „Lösung zeigen“:** Das ist streng, besonders auf Experte. Ein Rätsel genügt, und die ganze Runde bekommt keinen Stempel. Die Alternative wäre ein Stempel auch mit „Lösung zeigen“, aber dann ohne Zählung für den Stufen-Vorschlag. Claude entscheidet.
5. **E6 im Code:** „Folge leeren“ gibt es heute nur über `nachVorschlag`. Für das Zeitspiel braucht es eine kleine eigene Hilfe (`code-pruefer`).
6. **Profi-Abstand 50 oder 30 Jahre:** 50 nach dem stufen-pruefer. Bei 30 bliebe das lehrreiche Paar Rakete/Satellit (31 Jahre) drin, es gäbe 3.769 Rätsel und mehr Gemisch aus einem Fenster.
7. **Aufzug auf Profi:** Mit der 50-Jahre-Regel ginge das jetzt (die Eisenbahn käme nie mit ihm zusammen). Er ist nicht aufgenommen, damit die Zahlen des stufen-pruefer gelten. Ein möglicher nächster Schritt.
8. **„in Richtung Weltall“** für Goddard 1926 (⚠ 8): Wenn der fakten-pruefer es nicht trägt, werden die beiden Kurzformen ersetzt durch „Erst flog ein Flugzeug mit Motor, dann eine Rakete mit flüssigem Treibstoff.“
9. **Offen für echte Kinder:** Macht Sortieren mit versteckten Zahlen den Kleinen Spaß? Erleben Experte-Kinder die Paare als Knobelei oder als Raten?

**Relevante Dateien:**
- /home/user/wunderkompass/docs/entwurf/2026-11-24-sortiere-die-zeit-endfassung.md
- /home/user/wunderkompass/docs/entwurf/2026-11-24-sortiere-die-zeit-faktenpruefung.md
- /home/user/wunderkompass/docs/entwurf/2026-11-24-sortiere-die-zeit-stufenpruefung.md
- /home/user/wunderkompass/docs/entwurf/2026-11-24-sortiere-die-zeit-kinder-redaktion.md
- /home/user/wunderkompass/app/world-games.tsx (`Chronology`, `Rounds`)
- /home/user/wunderkompass/app/kern/stufe.ts (`mitErsterAntwort`, `stufenVorschlag`)
- /home/user/wunderkompass/app/kern/karte/ordne-richtig.tsx (`gemischt`)
- Zählskripte (nur zum Nachrechnen, nicht fürs Repository): /tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/zaehl.mjs und /tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/texte.mjs
