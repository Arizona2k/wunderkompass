# Kartenkorrekturen und Satz nach falscher Antwort (25.11.2026), karten-autor

> Helferbericht (karten-autor, opus / high), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

Das ist ein Entwurf und noch nicht geprüft. Danach prüfen `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer`. Ich habe keine Dateien geändert.

Gelesen habe ich `BACKLOG.md` (Abschnitt „Kartenkorrekturen dazu“), die Berichte `docs/entwurf/2026-11-25-technik-aufloesung-faktenpruefung.md`, `…-faktenpruefung-2.md`, `…-nachtrag-fakten.md` und `…-nachtrag-spieltest.md`, beide Endfassungen, `app/world-catalog.json`, `app/world-game-support.mjs`, `app/world-game-bank.ts`, `app/world-games.tsx` und `tests/world-game-learning-copy.test.mjs`.

---

## Teil 1: Kartenkorrekturen

### 1.1 Licht (`invention-light`)

**Heutiger Stand:**
- `more[0]` lautet: „Viele Menschen arbeiteten daran, darunter Joseph Swan sowie Thomas Edison und sein Team. Sie verbesserten Lampen und Stromversorgung.“
- `invention.stages[2]` („Entwicklung“) hat denselben Wortlaut.
- `question.why` hat denselben Wortlaut, mit einem Satz davor.
- In `sources` steht zweimal dieselbe NPS-Kinderseite. Swan ist nicht belegt.

**Neuer Wortlaut für `more[0]` und `invention.stages[2].text`, beide gleich:**
```json
"Viele Menschen arbeiteten daran. In England baute Joseph Swan 1878 und 1879 frühe Glühlampen. Darin glühte ein dünnes Stück Kohle. In den USA verbesserten Thomas Edison und sein Team Lampen und Stromversorgung."
```
- Der längste Satz hat 12 Wörter.
- Kein Satz wiederholt die Technik-Auflösung („…bauten Lampen und ein ganzes Stromnetz“) oder die Früher-Stufe („…ein dünner Draht so heiß, dass er leuchtete“).

**Neues `sources`:** Der doppelte zweite Eintrag fällt weg, zwei Einträge kommen dazu.
```json
"sources": [
  {"label": "National Park Service – elektrisches Licht", "url": "https://home.nps.gov/edis/learn/kidsyouth/the-electric-light-system-phonograph-motion-pictures.htm"},
  {"label": "National Park Service · Thomas Edison: Lampe, Lichtsystem und Kraftwerk Pearl Street 1882", "url": "https://www.nps.gov/edis/learn/historyculture/edison-biography.htm"},
  {"label": "Science Museum Group · Glühlampe von Joseph Swan, 1878–1879", "url": "https://collection.sciencemuseumgroup.org.uk/objects/co42487/swan-electric-lamp"}
]
```
`question.why` lasse ich, wie es ist. Es stimmt weiter, und die Hauptfrage bleibt unangetastet. Der Swan-Satz dort ist jetzt durch die SMG-Quelle belegt.

**Quellen (heute abgerufen):**
- SMG co42487: „Early carbon and rod filament incandescent electric lamp 1878-9. Made by the English chemist, Joseph Swan (1827-1914).“ Dazu „Made: 1878-1879“ und „Place made: England“.
- NPS Edison-Biografie: „inventing not just an incandescent electric light, but also an electric lighting system“ und „In September 1882, the first commercial power station, located on Pearl Street …“.

**Zu prüfen:**
- ⚠ „ein dünnes Stück Kohle“: Die SMG schreibt „carbon and rod filament“. Ob das ein Faden oder ein Stab war, ist unklar, darum nenne ich keins von beiden. Bitte prüfen, ob „Stück Kohle“ trägt.
- ⚠ Die Früher-Stufe nennt weiter einen „dünnen Draht“. Das stimmt für spätere Glühlampen. Neben dem Kohle-Satz könnte ein Kind aber stutzen. Die Früher-Stufe ändere ich nicht, weil sie die Aufgabe in „Früher oder heute?“ ist.

### 1.2 Kühlschrank (`invention-refrigerator`)

**Heutiger Stand:** `sources[1]` = `{"label": "Danfoss · 2: What a refrigerator does", "url": "https://www.danfoss.com/en/about-danfoss/our-businesses/cooling/the-fridge-how-it-works/"}`. Die Seite liefert 403. Sonst nennt nichts in `app/` Danfoss (per grep geprüft).

**Neu:**
```json
{"label": "Penn State · 2: EGEE 102, 6.4 Refrigerators (Kühlschrank als Wärmetransporter)", "url": "https://courses.ems.psu.edu/egee102/node/2402"}
```
- Der Kartentext bleibt.
- Die Seite trägt diese Aussagen: Kältemittel nimmt innen Wärme auf und gibt sie außen ab, dazu Kompressor und Kreislauf. Zitate: „A refrigerator is a heat mover.“, Verdampfer „inside the freezer or behind the back panel“, Verflüssiger „on the back or bottom of your fridge“, Kompressor „the refrigerator's 'engine'“.
- Die Aussage „Betriebsenergie landet als Wärme im Raum“ trägt weiter OpenStax.

### 1.3 Aufzug (`invention-elevator`)

TK Elevator schreibt: „The weight of an elevator cab (structural load) plus part of the passenger load (40 to 50% of its rated load) determines the weight of the counterweights“, außerdem „reduces the effort required by the lifting machine“ und „gives balance to the elevator system“ (https://tkelevator.com/us-en/tools/classroom-on-demand/counterweights.html, heute abgerufen).

Drei Stellen sagen heute „Teil der Gewichtskraft der Kabine“:

| Feld | Heute | Neu |
|---|---|---|
| `paragraphs[0]`, nur Satz 2 | „Ein Gegengewicht gleicht einen Teil der Gewichtskraft der Kabine aus.“ | „Am anderen Ende der Seile hängt ein Gegengewicht. Es wiegt so viel wie die leere Kabine. Dazu kommt etwa die Hälfte der Last, die hinein darf. Das macht dem Antrieb die Arbeit leichter.“ |
| `invention.parts[counterweight].description` und derselbe Abschnitt „Gegengewicht: …“ in `invention.stages[2].text` | „Es gleicht einen Teil der Gewichtskraft der Kabine aus. Nicht alle Aufzüge verwenden diese Bauart.“ | „Es ist etwa so schwer wie die Kabine mit halber Ladung. Darum muss der Antrieb weniger heben. Nicht alle Aufzüge verwenden diese Bauart.“ |
| `questionFeedback.wrongReasons[2]` | „Das Gegengewicht gleicht einen Teil des Kabinengewichts aus, damit der Antrieb weniger heben muss. Eine Notbremse ist es nicht.“ | „Das Gegengewicht hält die Kabine und einen Teil der Last im Gleichgewicht. Eine Notbremse ist es nicht.“ |

Neu in `sources`:
```json
{"label": "TK Elevator · Counterweights: Kabine plus 40 bis 50 % der Nutzlast", "url": "https://tkelevator.com/us-en/tools/classroom-on-demand/counterweights.html"}
```

Hinweise:
- Die drei Fassungen sind absichtlich verschieden formuliert (Regel 9).
- Die Antwort „Den Gewichtsunterschied zwischen Kabine und Gegengewicht im Betrieb ausgleichen“ bleibt. Sie ist fachlich nicht falsch, nur keine Aufgabe der Fangvorrichtung. Damit sind keine gespeicherten Antworten betroffen.
- ⚠ „etwa die Hälfte“ und „halbe Ladung“ stehen für 40 bis 50 %. Bitte prüfen, ob „etwa“ reicht.
- Optional, aus der Faktenprüfung 2: In der Technik-Auflösung (`app/world-game-support.mjs:108`) „klemmt sich eine Bremse an der Schiene fest“. Beleg Otis: „The safeties clamp onto the hoistway rails“. Nicht nötig.

### 1.4 Karl oder Carl Benz

**Ergebnis der Suche:** Die laufenden Texte sind heute schon einheitlich „Karl Benz“. „Carl“ steht nur an diesen Stellen:
- im Titel „Karl (Carl) Benz“,
- in der Einleitung („Karl, auch Carl geschrieben, Benz …“),
- in Quellentiteln und URLs (Mercedes-Benz, Commons-Dateiname).

**Empfehlung: „Carl Benz“ als Schreibweise im Text.** Gründe:
- Die eigene Quelle der Karte, das Deutsche Museum, schreibt nur „Carl Benz“ („Am 29. Januar 1886 meldete Carl Benz das Patent … an“): https://www.deutsches-museum.de/museum/presse/meldung/eine-ikone-der-automobilgeschichte-wird-140
- Die Deutsche Biographie (NDB) führt ihn als „Benz, Carl Friedrich“. „Karl“ steht dort nur unter den Namensvarianten: https://www.deutsche-biographie.de/gnd118509225.html
- Das Mercedes-Benz-Archiv schreibt „Carl Benz“: https://group.mercedes-benz.com/company/tradition/founders-pioneers/carl-benz.html (liefert Bots 403, Schreibweise aus URL und Titel).
- Kinder treffen in Museen und auf Straßenschildern meist auf „Carl Benz“.
- „Karl“ ist nicht falsch: Britannica schreibt „Karl Benz“ (https://www.britannica.com/biography/Karl-Benz), und die NDB nennt „Karl Friedrich“ als Variante.

**Gegenvorschlag mit dem kleinsten Aufwand:** „Karl“ behalten. Dann ändert sich gar nichts, weil heute schon alles einheitlich ist. Nachteil: Die Karte schreibt anders als ihre eigene Quelle.

**Schritt 1, jetzt (keine gespeicherten Antworten betroffen):**

| Datei, Feld (Zeile) | Heute | Neu |
|---|---|---|
| `app/world-catalog.json`, `person-karl_benz.intro` (5241) | „Karl, auch Carl geschrieben, Benz entwickelte einen Motorwagen. Dafür …“ | „Carl Benz, manchmal auch Karl geschrieben, entwickelte einen Motorwagen. Dafür …“ (Satz 2 bleibt) |
| ebenda `more[0]` (5261) | „Karl Benz lebte von 1844 bis 1929. …“ | „Carl Benz lebte von 1844 bis 1929. …“ |
| `invention-car.more[0]` (6734) und `invention.stages[2].text` (6775) | „… Karl Benz entwickelte einen frühen Benzinwagen. …“ | „… Carl Benz entwickelte …“ |
| `invention-car.surprise` (6737) | „… vor dem Benzinwagen von Karl Benz …“ | „… von Carl Benz …“ |
| `invention-car.question.why` (6831) | „… Karl Benz entwickelte …“ | „… Carl Benz …“ (nur, wenn `why` nicht unter „Hauptfrage bleibt wörtlich“ fällt; Claude entscheidet) |
| `app/world-connections.json` (1777) | „… den Motorwagen ihres Mannes Karl …“ | „… ihres Mannes Carl …“ |
| `app/world-connections.json` (1785) | „1886 bekam Karl Benz ein Patent …“ | „1886 bekam Carl Benz ein Patent …“ |
| `app/world-game-support.mjs`, `AUFLOESUNG['person-karl_benz']` (87) | „Karl Benz war Ingenieur, …“ | „Carl Benz war Ingenieur, …“ |

Dazu:
- **Test:** `tests/world-game-learning-copy.test.mjs:157` verlangt, dass die Auflösung mit dem ersten Teil des Titels beginnt („karl“). Mit dem alten Titel schlägt das fehl. Der Test müsste auch den Namen in der Klammer annehmen, oder Schritt 2 kommt gleich mit.
- **Weiterhin erfüllt:** Der Test in Zeile 38 ff. braucht in der Einleitung einen Namensteil, das bleibt „Carl“.
- **Suche:** In `aliases` „Carl Benz“ und „Karl Benz“ ergänzen.
- **Wird neu erzeugt:** `app/world-index.json` (1429 bis 1455) kommt aus `pnpm run export:data` und zieht nach.

**Schritt 2, später:** zusammen mit dem BACKLOG-Punkt „Namen mit Klammer“.
- Titel „Karl (Carl) Benz“ → „Carl Benz“.
- Achtung: Der Titel ist in „Wer war das?“ eine **gespeicherte Antwort**. Alte Runden mit „Karl (Carl) Benz“ würden neu gemischt, und eine gespeicherte richtige Wahl würde nicht mehr erkannt (`worldGameAnswerCorrect` vergleicht den Text). Darum braucht es einen Alias. Betroffen sein können `tests/fixtures/gespeicherte-antworten*.json` und `tests/fixtures/legacy-people20-before-merian-lehmann.json`, wo der Titel als Antwort steht.
- Die Hauptfrage „Wofür ist Karl (Carl) Benz besonders bekannt?“ bleibt wörtlich. Sie nennt beide Schreibweisen und widerspricht damit keiner.

**Nur melden, nicht ändern:**
- `app/world-photos.json` 445 und 446 (Alt-Text und Bildunterschrift „Karl Benz …“). Der Commons-Dateiname `Carl_Benz_circa_1920.jpg` ist fest.
- Feste Titel und URLs: `content/research/history.json:1391` (Quellentitel „Carl Benz“) und die Mercedes-URL `carl-benz-workshop` in `invention-car.sources`.
- `content/research/history.json` 688 und 702 („Karl (Carl) Benz“, „Karl Benz entwickelte …“). Per grep liest weder die App noch ein Skript oder Test diese Datei. Optional angleichen.
- `content/author-world-content.py:135`: altes Erzeugungsskript, nicht nötig.
- Ohne Vornamen und darum unproblematisch: `app/challenge-hints.json:230` und `app/people-retained-evidence/bertha-benz.tsx`.

---

## Teil 2: Satz nach einer falschen Antwort

### Heute (`worldGameWrongFeedback`, `app/world-game-support.mjs` 205 bis 230; Anzeige in `app/world-games.tsx` unter „Noch nicht ganz. Versuch es noch einmal!“)

| Spiel | Heute |
|---|---|
| Technik-Detektiv | „Du hast „X“ gewählt. Was macht diese Erfindung genau? Passt das zu allem, was in der Aufgabe steht?“ |
| Wer war das?, Entdecker | „Du hast „X“ gewählt. Hat dieser Mensch so etwas gemacht? Schau dir auch die anderen Namen an.“ |
| Wer war das?, Profi und Experte | „Du hast „X“ gewählt. Passt jeder Satz im Hinweis zu diesem Menschen? Schau dir auch die anderen Namen an.“ |
| Tierdetektiv | „Du hast „X“ gewählt. Lebensraum: … Nahrung: … Vergleiche das mit allen Rätselspuren. Eine einzelne Gemeinsamkeit reicht nicht.“ |
| Tier & Lebensraum | „Diese Wahl passt zum Beispiel zu: {anderes Tier}. Gesucht ist aber: {Tier}. Wo findet dieses Tier Futter und Schutz?“ Dazu vier feste Sätze für alte Antworten (Sandwüste, Baumkronen, Korallenriff, Meereis), die nur noch in gespeicherten Runden vorkommen. |
| Wer frisst was? | wie Tier & Lebensraum, Schluss „Frisst dieses Tier Pflanzen, andere Tiere oder beides?“ |

### Was in den Daten steht (Artikel)

- **Erfindungen:** 23 von 24 Titeln haben ihren Artikel schon („Der Buchdruck“, „Das Smartphone“, „Die Kamera“, „Der 3D-Druck“). Die Ausnahme ist „Elektrisches Licht“, das ebenfalls klein im Satz funktioniert („elektrisches Licht“).
- **Menschen:** ohne Artikel, das passt. Zwei Titel haben eine Klammer: „Karl (Carl) Benz“ und „al-Chwarizmi (al-Khwarizmi)“.
- **Tiere:** ohne Artikel („Löwe“, „Westliche Honigbiene“).
- **Lebensräume und Nahrung:** Beschreibungen ohne Artikel („Savanne“, „Hecken, Gärten und Waldränder“).

### Einheitlicher Satzbau

1. **Was du gewählt hast, konkret.** Bei Namen-Spielen „Du hast „{gewählt}“ gewählt.“, bei Tier & Lebensraum und Wer frisst was? „Deine Wahl passt zum Beispiel zu: …“.
2. **Eine Denkfrage zu deiner Wahl**, mit ihrem Namen oder mit „dein Tier“.
3. **Ein Blick zurück** zur Aufgabe, zum Rätsel oder zu den anderen Antworten.

Feste Regeln:
- Höchstens 4 Sätze, höchstens 9 Wörter je Satz.
- Keine Lösung und kein Satz aus dem Tipp.
- Namen ohne Artikel stehen nur in „…“ oder hinter einem Doppelpunkt.
- Namen mit Artikel stehen nur als Satzgegenstand (Nominativ), sonst passt der Artikel aus dem Titel nicht („Wofür braucht man der Buchdruck?“ wäre falsch).
- „Dieses Tier“ meint immer das **gesuchte** Tier, „dein Tier“ immer das **gewählte**.
- „Deine Wahl“ ersetzt „Diese Wahl“, damit „diese/dieses“ nicht zweierlei meint.

### Vorlagen je Spiel

**Technik-Detektiv** (alle Stufen):
`Du hast „{gewählt}“ gewählt. Was macht {gewählt_klein}? Passt das zur Aufgabe?`
- Beispiel: „Du hast „Der Buchdruck“ gewählt. Was macht der Buchdruck? Passt das zur Aufgabe?“
- Andere Beispiele: „Was macht elektrisches Licht?“, „Was macht der 3D-Druck?“
- `{gewählt_klein}`: erster Buchstabe klein, wenn der Titel mit „Der “, „Die “ oder „Das “ beginnt oder „Elektrisches Licht“ heißt.
- Sonst (neuer Titel ohne Artikel) gilt die Ersatzform „Was macht diese Erfindung?“.
- Vorschlag für einen Unit-Test: Alle 24 heutigen Erfindungen bekommen die Form mit Namen und nicht die Ersatzform.
- „Was macht“ statt „Wobei hilft“, weil es auch zu Beschreibungs- und Forscherfrage-Aufgaben passt und nicht nur zu Problem-Aufgaben. Der Spieltester schlug „Was kann …“ vor, das klappt grammatisch ebenso.

**Wer war das?**, Entdecker:
`Du hast „{gewählt}“ gewählt. Hat {name} so etwas gemacht? Schau dir auch die anderen Namen an.`

**Wer war das?**, Profi und Experte:
`Du hast „{gewählt}“ gewählt. Passt jeder Satz im Hinweis zu {name}? Schau dir auch die anderen Namen an.`

- `{name}` ist der Titel ohne Klammerteil: „Karl (Carl) Benz“ → „Karl Benz“, „al-Chwarizmi (al-Khwarizmi)“ → „al-Chwarizmi“. So muss kein Kind „Klammer“ vorlesen.
- Satz 1 behält den angezeigten Knopftext.
- Beispiel: „Du hast „Marie Curie“ gewählt. Hat Marie Curie so etwas gemacht? Schau dir auch die anderen Namen an.“
- Der Entdecker-Tipp („Hat dieser Mensch so etwas gemacht?“) bleibt allgemein. Die Rückmeldung nennt den Namen und ist damit nicht wörtlich gleich.

**Tierdetektiv:**
`Du hast „{gewählt}“ gewählt. Zuhause: {habitat}. Futter: {diet}. Passt dein Tier zu jedem Satz im Rätsel?`
- Beispiel: „Du hast „Löwe“ gewählt. Zuhause: Savanne. Futter: Fleisch. Passt dein Tier zu jedem Satz im Rätsel?“
- Abwägung: Ohne die Angaben würde der Satz kürzer. Viele Rätsel handeln aber vom Körper und nicht von Zuhause oder Futter. Ein Kind kennt die gewählten Tiere (z. B. „Kurzschnabeligel“, „Gewöhnliche Sepia“) oft nicht, und ein Bild des gewählten Tiers zeigt das Spiel nicht. Die zwei Angaben geben ihm etwas zum Vergleichen. Darum würde ich sie behalten.
- „Zuhause/Futter“ statt „Lebensraum/Nahrung“ sind die leichteren Wörter. Die Spielnamen heißen aber „Tier & Lebensraum“ und „Wer frisst was?“. Das entscheidet die `kinder-redaktion`.
- Der heutige Schluss „Eine einzelne Gemeinsamkeit reicht nicht“ steckt jetzt in „zu jedem Satz“.

**Tier & Lebensraum:**
`Deine Wahl passt zum Beispiel zu: {anderes Tier}. Gesucht ist aber: {Tier}. Wo findet dieses Tier Futter und Schutz?`

**Wer frisst was?:**
`Deine Wahl passt zum Beispiel zu: {anderes Tier}. Gesucht ist aber: {Tier}. Frisst dieses Tier Pflanzen, andere Tiere oder beides?`

Abwägung zu diesen beiden Spielen:
- Ein Satz 1 „Du hast „…“ gewählt.“ wäre einheitlicher. Mit den langen Beschreibungen würden die Texte aber bis 206 Zeichen lang (heute höchstens 167).
- Die `kinder-redaktion` hat am 24.11. bewusst entschieden, die Wahl hier nicht zu wiederholen. Darum ändert sich nur „Diese“ zu „Deine“.
- Der Tiername bleibt hinter dem Doppelpunkt, weil der Artikel fehlt.
- Ich habe nachgezählt: Jede der 431 Lebensraum- und 442 Nahrungs-Fallen passt zu einem anderen Tier. Die Ersatzform wird also nie gebraucht.

**Vier feste Sätze für alte Runden (Tier & Lebensraum)**, im selben Satzbau:
- Sandwüste (Wassertiere): „Deine Wahl ist eine trockene Wüste. Dort gibt es kaum Wasser. Wie wichtig ist Wasser für dieses Tier?“
- Baumkronen (Wassertiere): „Deine Wahl ist hoch oben in den Bäumen. Kommt dieses Tier dort hinauf?“
- Korallenriff (Tiere am Wasserrand: Seeadler, Biber, Eisvogel, Feuersalamander, Grasfrosch): „Deine Wahl liegt ganz unter Wasser, im warmen Meer. Lebt dieses Tier dort?“
- Meereis (Landtiere, auch der Eisbär): „Deine Wahl liegt rund um den Südpol. Lebt dieses Tier dort?“ Der Satz nennt den Ort, damit der Eisbär (Norden) nicht falsch zu „ja“ führt.
  - Quelle: Britannica, „Antarctica“, https://www.britannica.com/place/Antarctica. ⚠ Heute nicht abgerufen.

### Ob die Platzhalter für alle Namen klappen (mit `node` durchgespielt)

| Fall | Anzahl | Längster Text | Längster Satz |
|---|---|---|---|
| Technik, alle Erfindungen | 24 | 90 Zeichen | 5 Wörter |
| Personen Entdecker | 36 | 127 Zeichen | 7 Wörter |
| Personen Profi | 36 | 137 Zeichen | 9 Wörter |
| Tierdetektiv | 48 | 179 Zeichen | 8 Wörter |

- Der längste Tierdetektiv-Text: „Du hast „Afrikanischer Strauß“ gewählt. Zuhause: Savannen und trockene offene Landschaften. Futter: Vor allem Pflanzen, auch kleine Tiere. Passt dein Tier zu jedem Satz im Rätsel?“
- Unschön, aber lesbar: der Monarchfalter mit „Futter: Raupen: Seidenpflanzen; Falter: Nektar“.

### Was die Tests heute festschreiben

Diese Tests müssen im selben Durchgang angepasst werden:
- `tests/world-game-learning-copy.test.mjs:87` und `:89` (Personen),
- `tests/world-game-learning-copy.test.mjs:189` (Technik).

In `tests/browser/` steht keiner dieser Wortlaute (per grep geprüft). Die Rückmeldesätze sind keine gespeicherten Antworten.

### Quellen zu Teil 2

Teil 2 enthält keine neuen Sachaussagen außer „Antarktis rund um den Südpol“ (Britannica, siehe oben). „Zuhause“ und „Futter“ setzen nur Felder ein, die schon auf den Karten stehen (`animal.habitat`, `animal.diet`).

---

## Umformuliert

- Keine Antworttexte von Fragen.
- Erst in Schritt 2 (später) käme die gespeicherte Antwort „Karl (Carl) Benz“ → „Carl Benz“ dazu. Die braucht einen Alias, betroffen sein können `tests/fixtures/gespeicherte-antworten*.json` und die Legacy-Fixtures.

## Zahlen

- In Teil 1 gibt es keine neuen Fragen und keine neuen Antworten. Die Auswertung „einzige längste“ oder „einzige kürzeste“ entfällt.
- In Teil 2 gibt es nur Rückmeldesätze und keine Antwortlisten.

## Offen

1. Benz: Ob „Carl“ (meine Empfehlung) oder „Karl“ (keine Änderung nötig), entscheidet Claude. Ebenso, ob `invention-car.question.why` als Teil der Hauptfrage gilt.
2. Licht: Ob „ein dünnes Stück Kohle“ zur SMG-Beschreibung „carbon and rod filament“ passt (`fakten-pruefer`).
3. Wer frisst was?, Profi: Die Schlussfrage „Pflanzen, andere Tiere oder beides?“ trennt schwache Fallen aus derselben Gruppe nicht, z. B. Giraffe „Pflanzen“ gegen „Bambus“ oder „Eukalyptusblätter“. Einen besseren Satz für alle Tiere habe ich nicht gefunden, ohne dass er die Lösung andeutet. Das soll der `stufen-pruefer` ansehen.
4. „Zuhause/Futter“ oder „Lebensraum/Nahrung“ im Tierdetektiv (`kinder-redaktion`).
5. Früher oder heute? gehört nicht zu den fünf Spielen. Dort bleibt „Du hast „…“ gewählt.“ mit dem Tipp oder dem eigenen Grund der Vergleichsfrage.

**Dateien:**
- `/home/user/wunderkompass/app/world-catalog.json`
- `/home/user/wunderkompass/app/world-connections.json`
- `/home/user/wunderkompass/app/world-game-support.mjs`
- `/home/user/wunderkompass/app/world-photos.json` (nur melden)
- `/home/user/wunderkompass/content/research/history.json`
- `/home/user/wunderkompass/tests/world-game-learning-copy.test.mjs`
- `/home/user/wunderkompass/tests/fixtures/gespeicherte-antworten.json`
- `/home/user/wunderkompass/tests/fixtures/gespeicherte-antworten-teil-a.json`
- `/home/user/wunderkompass/tests/fixtures/gespeicherte-antworten-feinschliff.json`
