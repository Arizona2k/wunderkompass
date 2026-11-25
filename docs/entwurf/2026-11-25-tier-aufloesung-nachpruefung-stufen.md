## Stufenprüfung: Endfassung der Tier-Auflösungen (Nachprüfung, 25.11.2026)

> Helferbericht (stufen-pruefer, opus/high), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

Ich habe nur die Schwierigkeit geprüft, nicht die Fakten und nicht die Sprache. Dateien habe ich nicht geändert. Die Fallenlisten habe ich so nachgebaut, wie sie nach Teil B aussehen würden: alle Streichungen und Auffüllungen per Skript, alle Einträge gefunden, keine Liste unter der Mindestzahl, keine doppelten Einträge. Danach habe ich gezählt, wie oft man die richtige Antwort an der Länge erkennt, welche Fallen ständig wiederkommen, wie oft Falle und Lösung dieselbe Futterart haben (Pflanzen, Tiere oder beides) und bei wie vielen Aufgaben nur die richtige Antwort ein Wasserwort enthält. Die 144 Texte habe ich mit Rätsel, Tipp, Hauptfrage, Zusatzfragen und „Stimmt das?“ jedes Tieres verglichen.
Nachbau und Skripte: `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/sp2/fallen-nach.json`, `.../sp2/fallen-nach.txt`, `.../sp2/muster.cjs` (der Scratchpad kann geleert werden).

### Gesamteindruck
- Die Auflösungen sind fertig für den Einbau. Keine verrät mehr eine Profi- oder Experten-Frage.
- Die Fallen-Streichungen machen Aufgaben fairer, aber bei Tieren aus dem Wasser jetzt deutlich zu leicht. Beim Futter auf Profi ist die richtige Antwort in 65 % der möglichen Runden die einzige mit Meer- oder Wasserbezug, vorher waren es 33 %. Als Übergang ist das vertretbar, denn zu leicht ist besser als zweideutig. Drei der geplanten „neuen Paare“ verbessern das aber nicht.
- Die Schlussfragen in Teil D helfen beim Nachdenken und verraten keine Lösung.

### Einstufung (Fallenlisten nach Teil B)
- **Profi, praktisch Entdecker-Niveau:**
  - Lebensraum: Jaguar (in jeder Runde mindestens 2 von 3 Fallen aus Meer oder Polargebiet) und Monarchfalter (3 von 4 Fallen; in einer von vier Runden sind alle Fallen solche).
  - Futter: Krake, Sepia, Aal, Axolotl, Walhai, Papageitaucher und Kaiserpinguin. Bei ihnen ist die richtige Antwort in jeder Runde die einzige mit Wasserbezug.
- **Profi, nur zur Hälfte Profi-Niveau:** Chamäleon-Lebensraum. In der Hälfte der Runden sind 2 von 3 Fallen eindeutig falsch.
- **Profi-tauglich:** Hummer-Futter mit der Falle „Als erwachsenes Tier vor allem Pflanzen“ (gleicher Ort, andere Futterart). Dazu Blauwal und Tümmler zum Teil.
- **Entdecker:** Die Schlussfrage passt. Nur in 3 von 225 Fallen hat die Falle dieselbe Futterart wie die Lösung.

---

### 1. Sind meine früheren Befunde umgesetzt?
- **Umgesetzt:**
  - 1-M1: Krake bekommt den Satz mit den drei Herzen statt Knochen und Spalt.
  - 1-M2 und 2-M1: Krill ist bei allen fünf Tieren gestrichen, dazu bei Tümmler, Papageitaucher und Axolotl.
  - 1-S1: alle acht Texte (Axolotl, Tümmler, Orang-Utan, Eisbär, Jaguar, Papageitaucher, Sepia ohne Zahlen, Seepferdchen in beiden Spielen).
  - 1-S2: Chamäleon, Clownfisch und Koala.
  - 1-K1: Elefant, Grasfrosch, Aal, Biene, Walhai.
  - 1-K4: Kurzschnabeligel.
  - 2-M2: Eisbär bekommt „Wüste“.
  - 2-S1: „Fleisch“ ist gestrichen.
  - 2-S2: Chamäleon, Schleiereule und Monarchfalter, dazu Katta und Jaguar.
  - 3-M1: Schlussfrage je nach Stufe.
  - 3-S1: „zu allem in der Aufgabe“ ist geblieben.
  - 3-K3: „Deine Wahl“.
- **Nicht umgesetzt, aber vertretbar:** Der Zuhause-Text der Biene ist weiter dünn (niedrige Priorität). Orca behält den Satz „Fett hält warm“ (1-K2, so gewollt).
- **Verschoben ins BACKLOG** laut Entscheidung: 2-S3, 2-S4 und alle K-Befunde aus Teil 2. Zu 2-S4 siehe Kann 7.

### 2. Wiederholungen: die sieben Stellen aus Abschnitt 5
| Stelle | Urteil |
|---|---|
| Kaiserpinguin, Tierdetektiv | **Reicht.** Satz 2 (wochenlang nichts fressen) ist ganz neu. Hautfalte und „jeder mal in die Mitte“ vertiefen das Rätsel, statt es zu wiederholen. |
| Papageitaucher, Zuhause | **Reicht.** Dieselbe Höhle jedes Jahr und der Schnabel, der nur zur Brutzeit bunt ist, sind neu. Das war mein eigener Vorschlag. |
| Feuersalamander, Tierdetektiv | **Reicht knapp.** Kühle Bäche ohne Fische sind neu. Aber Rätsel, Karte und Hauptfrage handeln auch alle von den Larven. Satz 3 („Sie haben gelbe Flecken…“) liest ein Kind als bekannte Tatsache über das erwachsene Tier, das Neue geht unter. Kann: siehe Kann 1. |
| Walross, Tierdetektiv | **Gut.** Das Rätsel sagt, wofür die Stoßzähne *nicht* da sind, die Auflösung sagt, wofür sie da sind. Das ist eine echte Ergänzung. |
| Tiger, Tierdetektiv | **Reicht knapp.** Neu ist nur der Grund (Abkühlen). Kann: siehe Kann 1. |
| Igel, Tierdetektiv | **Reicht fürs Rätsel.** Das Fettpolster erklärt das schwere Rätselwort „Stoffwechsel absenken“. Aber „Nest aus Laub“ ist fast die Antwort der Hauptfrage („ein Laubversteck“). Weil die Hauptfrage leicht ist und das Rätsel „Laub“ schon nennt, ist das nur Kann 1. |
| Clownfisch, Futter | **Reicht für Entdecker**, denn ein Futtertext muss das Futter nennen und erklärt hier die Wörter. Für 10- bis 12-Jährige ist nichts Neues dabei. Kann 1. |

---

## Muss

**M1 Aal, Entdecker-Falle „Früchte, Blätter und auch Insekten“: die Auflösung macht sie zum Teil richtig**
- **Ort:** `app/world-game-tier-fallen.json`, nahrung → animal-european-eel → entdecker.
- **Beleg:** Der Futtertext (Texte A43) sagt: „Junge Aale fressen auch Insektenlarven und Würmer.“ Nach „Richtig!“ liest das Kind also, dass ein Teil der Falle gestimmt hätte. Das ist dasselbe Muster wie bei Krill (1-M2). Nach der Regel vom 24.11. fliegt eine Falle raus, die ganz oder teilweise passt. Der Autor nennt die Falle selbst „grenzwertig“, entschieden ist sie noch nicht.
- **Vorschlag:** In der Entdecker-Liste des Aals streichen. Es bleiben 4 Fallen, die Mindestzahl ist erfüllt.

## Soll

**S1 Wassertiere beim Futter auf Profi zu leicht, und Axolotl und Schnabeltier werden ungleich behandelt**
- **Beleg:**
  - Anteil der Runden, in denen nur die richtige Antwort ein Wasserwort hat: vorher 0,33, nachher 0,65.
  - Bei 1,00, also in jeder Runde: Krake (Fallen nur noch Ameisen, Insekten, kleine Säugetiere, Pflanzen und Rinde), Sepia, Hummer, Aal, Axolotl, Papageitaucher. Vorher lagen diese Tiere bei 0,20 bis 0,40.
  - Gründe: Krill fehlt, und aufgefüllt wird mit Pflanzen vom Land.
- **Ungleich behandelt:** Axolotl und Schnabeltier haben dieselbe richtige Antwort („Kleine Wassertiere“) und leben beide im Süßwasser. Die Entscheidung lässt Krill beim Schnabeltier stehen, mit der Begründung „Meer gegen Land oder Süßwasser“, streicht ihn aber beim Axolotl. In meiner Prüfung vom 25.11. (2-M1) hatte ich den Axolotl ausdrücklich zu den Tieren gezählt, bei denen Krill bleiben soll. Die Entscheidung beruft sich trotzdem für das Streichen auch auf 2-M1.
- **Vorschlag:** Eine Regel für beide Tiere.
  - Empfehlung aus Sicht der Stufen: Beim Axolotl „Krill“ statt „Gräser und andere Pflanzen“. Das ist eine Denkfalle (Krill lebt im Meer), widerspricht dem Futtertext des Axolotls nicht (Würmer, Kaulquappen, Fische) und senkt seinen Wert von 1,00 auf 0,25.
  - Andere Möglichkeit, wenn Claude der Faktenprüfung A folgt („Krill ist ein kleines Wassertier“): Krill auch beim Schnabeltier streichen, ebenso „Kleine Tiere im Plankton“.
  - Dazu nach Regel streichen:
    - Axolotl „Früchte, Blätter und auch Insekten“: passt laut San Diego Zoo zum Teil (Insekten).
    - Tümmler „Kleine Tiere im Plankton“: ein Unterbegriff seiner Antwort; die Karte nennt Krebstiere als Futter.
  - Die Messwerte kommen ins BACKLOG 25.

**S2 Die „neuen Paare, später statt dessen“ sind meist genauso leicht, beim Hummer sogar leichter**
- **Ort:** Bericht Teil B, Tabelle „Auffüllen“.
- **Beleg:**
  - „Küstennaher Meeresboden“ (Jaguar), „Arktische Küsten und Meere“ (Chamäleon), „Korallenriffe…“ und „Arktische Küsten…“ (Monarchfalter) und „Raupen: Seidenpflanzen; Falter: Nektar“ (Walhai) sind genauso Entdecker-Fallen wie die jetzigen Auffüller.
  - Beim Hummer würde die einzige echte Profi-Falle („Als erwachsenes Tier vor allem Pflanzen“: gleicher Ort, andere Futterart) durch „Nektar und Pollen“ ersetzt. Das ist ein Rückschritt.
  - Gut sind dagegen Krake, Sepia und Tümmler mit „Als erwachsenes Tier vor allem Pflanzen“ sowie Aal und Axolotl mit „Pflanzen und Rinde“ (der Biber lebt auch am Wasser).
- **Vorschlag:**
  - Hummer: die jetzige Auffüllung dauerhaft behalten.
  - Walhai: „Vor allem wirbellose Bodentiere“, auch ein Meer-Futter, aber vom Grund statt aus dem Plankton. Das muss der `fakten-pruefer` bestätigen.
  - Jaguar: eine Falle vom Land, die sicher falsch ist, zum Beispiel „Hecken, Gärten und Waldränder“ oder „Wiesen und Gärten“ (`fakten-pruefer`).
  - Monarchfalter: Regel S3 vom 24.11. Profi lässt das Tier bei „Tier & Lebensraum“ weg, denn fast jeder Ort an Land passt zum Teil (Wald und Gebirge im Winterquartier, Grasland und Prärie, „Wüste“ ist schon gestrichen).
  - Chamäleon: Mir ist keine sichere Falle vom Land bekannt. Die Auffüllung bleibt, bis der `fakten-pruefer` eine findet.

**S3 Clownfisch, Tierdetektiv: der Vergleich mit der Brennnessel arbeitet gegen die Hauptfrage**
- **Ort:** Texte A42, Tierdetektiv, Satz 3: „Die brennen sonst wie Brennnesseln.“
- **Beleg:** Die Hauptfrage will genau die Vorstellung „Seeanemone = Pflanze“ abbauen. Ihre Falle ist „Eine Pflanze mit Blüten“, ihr Tipp sagt „Name und Form erinnern an eine Blüte“ (`app/world-catalog.json`, Clownfisch). Ein Vergleich mit einer Pflanze stärkt diese Vorstellung bei 5- bis 7-Jährigen.
- **Vorschlag:** „Die brennen sonst wie bei einer Qualle.“ Seeanemone und Qualle sind verwandt (Nesseltiere), das ist also eine fachlich echte Verbindung. Der Vergleich kommt im Spiel noch nicht vor. Der `fakten-pruefer` prüft die Verwandtschaft, die `kinder-redaktion` den Ton.

## Kann

1. **Die sieben Stellen nachschärfen** (jeweils nur mit Quelle, `fakten-pruefer`):
   - Feuersalamander, Satz 3: „Seine gelben Flecken warnen: Ich schmecke giftig.“ Die Warnfarbe steht weder auf der Karte noch im Rätsel, nur die Larven.
   - Tiger, Satz 3: die weißen Flecken auf der Rückseite der Ohren. Quelle nötig.
   - Igel, Satz 2: „Im Winterschlaf schlägt sein Herz viel langsamer als sonst.“ Damit fällt „Laub“ weg, das schon Rätsel und Hauptfrage nennen.
   - Clownfisch, Futter: die Sätze 2 und 3 zu einem zusammenziehen und eine neue Tatsache ergänzen.
2. **Weitere Wiederholungen,** harmlos, weil Rätsel oder Hauptfrage es schon verraten und Entdecker-leicht sind:
   - Orca, Futter, Sätze 1 und 2 ≈ Rätsel, Sätze 1 und 2 („lernen voneinander“, „Manche … vor allem …, andere …“)
   - Löwe, Futter: „Meist jagen die Weibchen“ ≈ Rätsel
   - Rotfuchs, Zuhause, Satz 3: „sogar mitten in Städten“ = Rätsel und Hauptfrage. Vorschlag: streichen; zwei Sätze mit 113 Zeichen reichen.
   - Kurzschnabeligel, Futter, Satz 3: Zunge = Antwort der Hauptfrage
   - Sepia, Futter, Satz 2: „langen Fangarme“ ≈ Hauptfrage und Rätsel. Das war mein eigener Vorschlag aus 1-S1; ich korrigiere ihn hiermit.
   - Katta, Tierdetektiv: Duft ≈ Hauptfrage
   - Meeresschildkröte: Zuhause und Futter ≈ Rätsel
   - Panda, Zuhause, Satz 1 ≈ Rätsel
   - Aal, Zuhause, Satz 2 ≈ Hauptfrage (Wanderweg)
   - Chamäleon: Tierdetektiv und Futter sprechen beide von der Zunge
3. **Profi-Schlussfrage, zwei schwache Stellen:**
   - Hummer gegen die Meeresschildkröten-Falle: gleicher Ort, die Größe hilft nicht weiter. Genau dieser Fall soll später auch bei Krake, Sepia und Tümmler kommen.
   - Blauwal und Walhai: „Wie groß ist dieses Tier?“ lenkt zur Vorstellung „großes Tier, große Beute“. Der Tipp beim Blauwal warnt genau davor („Großes Tier bedeutet nicht automatisch große Beute“).
   - Andere Fassung: „Wo lebt dieses Tier, und womit frisst es?“ (7 Wörter: Barten, Scheren, Zunge, Zähne). Sie verrät nichts und wiederholt den Tipp nicht. Ob Kinder damit besser zurechtkommen, kann der `spieltester` grob zeigen, sicher nur echte Kinder. Wenn sie nicht kommt: die jetzige Fassung behalten. Sie passt bei den meisten Paaren mit gleicher Futterart (75 % der Profi-Fallen).
4. **Entdecker-Schlussfrage, drei Ausnahmen:** Panda gegen „Eukalyptusblätter“ (die Liste hat nur 3 Einträge, die Falle kommt also in 2 von 3 Runden), Gorilla gegen „Raupen…“, Meeresschildkröte gegen „Bambus“. Hier trennt „Pflanzen oder Tiere?“ nicht. Dass das andere Tier genannt wird, hilft trotzdem. Kommt ins BACKLOG 25 zu 2-K2.
5. **Tierdetektiv, „Satz im Hinweis“:** Die Aufgabe heißt „Wer bin ich?“, der Knopf „Brauchst du einen Tipp?“. Ein Kind kann „Hinweis“ für den Tipp halten. „Passt dein Tier zu jedem Satz im Rätsel?“ ist eindeutig. Das letzte Wort hat die `kinder-redaktion`.
6. **Länge als Ratehilfe:**
   - Seepferdchen, Futter auf Profi: Die richtige Antwort „Kleine Beutetiere“ ist jetzt immer die kürzeste (vorher in 40 % der Runden) und als einzige nicht mit „Vor allem“ angefangen; das tun 3 der 4 Fallen. Der Abstand ist nur 1 Zeichen, also beobachten.
   - Axolotl: auch immer die kürzeste. Das erledigt sich, wenn Krill zurückkommt (S1).
   - Insgesamt bleibt der Anteil auf Profi etwa gleich: richtige Antwort am längsten 0,285 → 0,272, am kürzesten 0,204 → 0,223.
   - Besser geworden: Beim Hummer war die richtige Antwort bisher immer die längste, jetzt nur noch in einer von vier Runden.
7. **2-S4 (Rätsel verraten die Lösung):**
   - Blauwal: „Ich bin das größte heute lebende Tier“ ist wörtlich die Rekorde-Frage.
   - Orang-Utan: „nur auf Borneo“.
   - Rätsel sind keine gespeicherten Antworten, die Änderung ist also billig und könnte gleich in diesen PR.

---

### Lücken (Experte)
Aus den Auflösungen lassen sich Experten-Aufgaben bauen, ohne einen Satz zu wiederholen:
- **Zwei Tatsachen verbinden:** „Der Igel lebt im Winter von seinem Fett. Wann muss ein Eisbär oft hungern?“ Antwort: im Sommer, wenn das Eis geschmolzen ist (Eisbär-Zuhause plus Igel-Tierdetektiv).
- **Fehler finden:** „Ein Fischer zieht einen knallroten Hummer aus dem Meer. Was stimmt hier nicht?“ (Hummer-Tierdetektiv)
- **Schließen:** „Ein Dromedar hat einen kleinen, schiefen Höcker. Was war in letzter Zeit los?“
- **Knobelei über mehrere Karten:** „Bei welchen zwei Tieren kümmert sich der Vater um Eier oder Junge?“ (Kaiserpinguin, Seepferdchen)
- Gut, nur festhalten: Die Eisbär-Auflösungen (im Sommer an Land kaum Futter, Robben unter dem Schnee riechen) machen die Profi-Frage zum Winter zu einer Denkfrage. Wörtlich verraten sie sie nicht.

### Unsicher
- Ob die Vorschläge stimmen (Tiger-Ohren, Herzschlag des Igels, Warnfarbe des Salamanders, Verwandtschaft von Qualle und Seeanemone, Walhai mit „Vor allem wirbellose Bodentiere“, Jaguar mit „Gärten“): `fakten-pruefer`.
- Ob ein Profi-Kind bei Wassertieren die richtige Antwort wirklich nur am Wasserwort erkennt oder trotzdem nachdenkt, und ob Kinder die Auflösungen nach „Richtig!“ überhaupt lesen: Das zeigen nur echte Kinder über den Nutzer, grob vorher der `spieltester`.
- Wortwahl („Deine Wahl“ oder „Deine Antwort“, „Hinweis“ oder „Rätsel“): `kinder-redaktion`.

### In Ordnung
- Keine Auflösung verrät eine Zusatzfrage. Geprüft habe ich alle Profi- und Experten-Fragen von Elefant, Eisbär und Krake (nur diese Tiere haben Zusatzfragen) und alle „Stimmt das?“-Sätze.
- Durch keine neue Auflösung passt ein Rätsel plötzlich auch zu einer Falle im Tierdetektiv. Orca und Tümmler (Echo) sowie Krake und Sepia (Tinte, drei Herzen) schließen sich laut `app/world-game-fallen.json` gegenseitig aus. Das Okapi beim Giraffen-Rätsel bleibt wie vorher (1-K3).
- Gut gelungen ist das Dromedar: Der Höcker schrumpft, wenn Futter fehlt, und daraus kann ein Kind die Hauptfrage (Fett, kein Wasser) selbst ableiten, statt sie wiederzufinden. Ebenso das Walross und die neuen Texte zu Hummer, Aal, Axolotl, Grasfrosch und Biene.
- Fallen: Die Streichungen sind vollständig. Krill kommt nicht mehr 26-mal vor, sondern 18-mal; das schwächt diese Dauerfalle (2-K1). Die Entdecker-Listen bleiben eindeutig (Ausnahme M1).
- Teil D: Die Schlussfragen verraten keine Lösung. Die vier festen Lebensraum-Sätze, der Technik-Satz („zu allem in der Aufgabe“) und die Personensätze passen. Alte Runden ohne Stufe bekommen den Entdecker-Satz, das schadet nicht.

**Dateien:** `/home/user/wunderkompass/docs/entwurf/2026-11-25-tier-aufloesung-endfassung.md`, `/home/user/wunderkompass/docs/entwurf/2026-11-25-tier-aufloesung-endfassung-texte.md`, `/home/user/wunderkompass/docs/entwurf/2026-11-25-tier-aufloesung-endfassung.json`, `/home/user/wunderkompass/docs/entwurf/2026-11-25-tier-aufloesung-entscheidungen.md`, `/home/user/wunderkompass/docs/entwurf/2026-11-25-tier-aufloesung-stufenpruefung.md`, `/home/user/wunderkompass/app/world-game-tier-fallen.json`, `/home/user/wunderkompass/app/world-game-support.mjs`, `/home/user/wunderkompass/app/world-game-fallen.json`, `/home/user/wunderkompass/app/world-game-runde.ts`, `/home/user/wunderkompass/app/animal-detective-clues.json`, `/home/user/wunderkompass/app/world-catalog.json`.
