# Experten-Nachtrag „Stimmt das wirklich?“ (Entwurf des karten-autor, 24.11.2026)

## Entwurf: „Stimmt das wirklich?“ – zwei neue Experten-Fragen ohne Dampf und eine neue Falle für wasser-2

Ich habe keine Dateien im Projekt geändert. Das fertige JSON liegt zum Übernehmen auch hier: `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/entwurf.json` (Schlüssel `neu` und `geaendert`). Gelesen habe ich vorher die Nachprüfung und die Stufenprüfung vom 24.11. sowie `app/classic-questions.json`, `app/classic-learning.ts` (wie Runden gebildet werden) und die Karten `science-atmosphere`, `science-fungi` und `science-pressure`.

### Vorab: Zwei Abweichungen vom Auftrag
1. **Vier Antworten statt drei.** Laut Auftrag sollten es 3 Antworten sein. Die Regel für Experte (S2) verlangt aber 4, und alle 6 vorhandenen Experten-Fragen haben 4. Darum habe ich 4 geschrieben. Wenn du 3 willst, streich jeweils die letzte Falle („Oben zieht die Erde …“ und „Aus der Luft, so wie grüne Blätter“).
2. **„Wald ohne Pilze“ habe ich nicht genommen.** Die Karte `science-fungi` hat schon die Aufgabe `science-fungi-3` (Experte): „Stell dir einen Wald ganz ohne Pilze und andere Zersetzer vor. Was würde passieren?“ Das wäre fast wörtlich doppelt.
   - Eine Fassung über die Wurzelpilze (Pilz an der Baumwurzel) würde `detective-pilze-2` verraten. Diese Profi-Frage kann in einer Experten-Runde als vierte Frage kommen, denn Runden sind 3 Experte plus 1 Profi, und die Sperre über `gruppe` greift nur innerhalb einer Stufe.
   - Sie würde außerdem die Falle „Aus der Erde“ in `pflanzen-3` verlockender machen.
   - Stattdessen: Champignons in dunklen Räumen. Das verbindet zwei Dinge von der Karte: Pilze machen keine Nahrung aus Licht, und sie zerlegen Totes.

### 1. Neue Fragen (die IDs `detective-luft-3` und `detective-pilze-3` sind frei, auch in `tests/fixtures/stable-ids.json`)
```json
[
 {
  "id": "detective-luft-3", "game": "detective", "level": "hard", "stufe": "experte",
  "prompt": "Eine Chipstüte ist fest verschlossen. Im Tal ist sie weich. Oben auf einem hohen Berg ist sie prall wie ein Kissen. Warum?",
  "answers": ["Von außen drückt weniger Luft auf die Tüte", "Oben ist es wärmer, und die Luft dehnt sich aus", "Durch winzige Löcher kam Luft in die Tüte", "Oben zieht die Erde viel schwächer an der Luft"],
  "correct": "Von außen drückt weniger Luft auf die Tüte",
  "wrongReasons": {
   "Oben ist es wärmer, und die Luft dehnt sich aus": "Oben auf einem Berg ist es meist kälter als im Tal. Wärme ist also nicht der Grund.",
   "Durch winzige Löcher kam Luft in die Tüte": "Die Tüte ist dicht verschlossen. Außerdem wird ein Ballon mit Loch schlaff, nicht prall.",
   "Oben zieht die Erde viel schwächer an der Luft": "Auf einem Berg zieht die Erde fast genauso stark wie im Tal. Daran liegt es nicht."
  },
  "why": "Oben auf dem Berg ist die Luft dünner. Sie drückt von außen schwächer auf die Tüte. Das Gas in der Tüte drückt nach außen und dehnt sich aus. Darum wird die Tüte prall.",
  "hints": ["Hoch oben fällt das Atmen schwerer. Wie ist die Luft dort?", "In der Tüte ist oben genauso viel Gas wie im Tal. Was ist also oben anders: drinnen oder draußen?"],
  "topic": "science-atmosphere",
  "quelle": [
   {"label": "UCAR Center for Science Education: The Troposphere (Luftdruck sinkt, Luft wird kälter mit der Höhe)", "url": "https://scied.ucar.edu/learning-zone/atmosphere/troposphere"},
   {"label": "Museum of Science Boston: Why do chip bags puff up on planes?", "url": "https://mos.org/video/why-do-chip-bags-puff-planes"},
   {"label": "NASA Glenn: Air Pressure (Gasdruck wirkt in alle Richtungen)", "url": "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/air-pressure/"},
   {"label": "NASA: What Is Microgravity? (Schwerkraft in 400 km Höhe noch etwa 90 %)", "url": "https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-microgravity-grades-5-8/"}
  ]
 },
 {
  "id": "detective-pilze-3", "game": "detective", "level": "hard", "stufe": "experte",
  "prompt": "Champignons sind Pilze. Man züchtet sie oft in dunklen Räumen. Trotzdem werden sie groß. Woher bekommen sie ihre Nahrung?",
  "answers": ["Aus dem bisschen Licht, das im Raum ist", "Aus dem Kompost, auf dem sie wachsen", "Aus dem Wasser, mit dem man sie gießt", "Aus der Luft, so wie grüne Blätter"],
  "correct": "Aus dem Kompost, auf dem sie wachsen",
  "wrongReasons": {
   "Aus dem bisschen Licht, das im Raum ist": "Pilze können aus Licht keine Nahrung machen. Ihnen fehlt das Grün, das Pflanzen dafür haben.",
   "Aus dem Wasser, mit dem man sie gießt": "Wasser brauchen Pilze wirklich. Aber Wasser allein ist keine Nahrung.",
   "Aus der Luft, so wie grüne Blätter": "Grüne Blätter brauchen dafür Licht. Und Pilze haben gar keine grünen Blätter."
  },
  "why": "Champignons wachsen auf Kompost aus Stroh und Mist. Ihre feinen Fäden zerlegen ihn und holen sich daraus Nahrung. Licht brauchen sie dafür nicht.",
  "hints": ["Denk an den Wald. Worauf wachsen dort viele Pilze?", "Pilze fangen kein Licht ein. Viele leben von toten Pflanzenresten. Was liegt in dem Raum unter den Pilzen?"],
  "topic": "science-fungi",
  "quelle": [
   {"label": "Penn State Extension: Basic Procedures for Agaricus Mushroom Growing (meist ohne Licht gezogen, Kompost aus Stroh und Mist, Gießen)", "url": "https://extension.psu.edu/basic-procedures-for-agaricus-mushroom-growing"},
   {"label": "Kew: Why fungi matter (Pilze zersetzen, keine Fotosynthese)", "url": "https://growwild.kew.org/championing-nature/fungi/why-fungi-matter"}
  ],
  "gruppe": "nahrung"
 }
]
```
**Dazu nötig:** `detective-pflanzen-3` bekommt ebenfalls `"gruppe": "nahrung"`. An ihren Texten ändert sich nichts. Grund: Die Falle „Aus der Luft, so wie grüne Blätter“ und ihr „warum nicht“ würden sonst `pflanzen-3` verraten („Aus Luft und Wasser“), wenn beide in derselben Experten-Runde kommen. Die Sperre greift hier, weil beide Fragen Experte sind. Damit kann eine Runde aus 5 Plätzen ziehen statt aus 4: einer aus der Gruppe „dampf“, einer aus „nahrung“, dazu jahreszeiten-3, meer-4 und luft-3.

**Warum das Experte ist:**
- **luft-3:** Das Kind muss zwei Dinge verbinden: „oben dünne Luft“ (Entdecker-Wissen aus luft-1) heißt „von außen drückt weniger“. Jede Falle ist eine echte Fehlvorstellung, die man mit einem Gegengrund widerlegen kann: Wärme, ein Loch, Schwerkraft.
- **pilze-3:** Das Kind schließt drei Wege aus: Licht (Raum ist dunkel), Luft wie Blätter (Pilze sind keine Pflanzen) und Wasser (Wasser ist keine Nahrung). Dann verbindet es „Pilze zerlegen Totes“ mit dem Kompost. Der Kompost steht nicht in der Frage, man kommt also nicht über ein gleiches Wort zur Lösung.
- **Wortwahl:** Keiner der ersten Tipps nennt die Lösung, und keine Lösung steht wörtlich in einem Tipp (nachgezählt). Kein „warum nicht“ verrät die Lösung, man kann also nach einem Fehler noch einmal versuchen.

### 2. wasser-2: neue Falle
**Klares Ergebnis: Die Aussage „im Meer verdunstet das meiste Wasser“ stimmt.** WHOI: „We estimate that 86% of global evaporation … occurs over the oceans“ (https://www2.whoi.edu/site/globalwatercycle). Die USGS nennt rund 90 % für Meere, Seen und Flüsse zusammen (https://www.usgs.gov/special-topics/water-science-school/science/evaporation-and-water-cycle).
- Die Antwort „Ja, denn im Meer verdunstet das meiste Wasser“ wäre nur wegen des „Ja“ falsch, die Begründung selbst ist richtig.
- Ein „Noch nicht ganz“ darauf kann einem Kind beibringen, die richtige Begründung sei falsch. Darum ist sie nicht sicher falsch.

**Vorschlag (sicher falsch):** „Ja, denn Wolken entstehen nur über dem Meer“. Sie ersetzt „Nein, er fängt immer in den Wolken an“. Das war die schwächste Falle, mit dem Übertreibungswort „immer“. Danach stehen 2 Ja- gegen 2 Nein-Antworten (vorher 1:3).
```json
{
 "id": "detective-wasser-2", "game": "detective", "level": "medium", "stufe": "profi",
 "prompt": "Ein Kind sagt: „Der Wasserkreislauf fängt immer im Meer an.“ Stimmt das?",
 "answers": ["Ja, alles Wasser startet im Meer", "Ja, denn Wolken entstehen nur über dem Meer", "Nein, er hat gar keinen festen Anfang", "Nein, er fängt an der Quelle eines Flusses an"],
 "correct": "Nein, er hat gar keinen festen Anfang",
 "wrongReasons": {
  "Ja, alles Wasser startet im Meer": "Wasser verdunstet auch aus Seen und Pfützen. Pflanzen geben es über ihre Blätter ab.",
  "Nein, er fängt an der Quelle eines Flusses an": "Das Wasser in der Quelle war vorher Regen oder Schnee. Es war also schon unterwegs.",
  "Ja, denn Wolken entstehen nur über dem Meer": "Auch über Land entstehen Wolken. An heißen Sommertagen türmen sie sich oft über Feldern und Bergen auf."
 },
 "why": "Das Wasser wandert immer weiter, ohne Pause. Darum kannst du überall einsteigen. Einen ersten Ort gibt es nicht.",
 "hints": ["Folge einem Tropfen: Meer, Wolke, Regen, Fluss, Meer. Wo war er davor?", "Male einen Kreis. Kannst du zeigen, wo er anfängt?"],
 "topic": "science-water-cycle",
 "quelle": [
  {"label": "NASA Earth Observatory: The Water Cycle", "url": "https://science.nasa.gov/earth/earth-observatory/the-water-cycle/"},
  {"label": "USGS: The Water Cycle", "url": "https://www.usgs.gov/special-topics/water-science-school/science/water-cycle"},
  {"label": "UCAR Center for Science Education: Clouds Form Due to Surface Heating", "url": "https://scied.ucar.edu/learning-zone/clouds/clouds-form-surface-heating"}
 ]
}
```
**Andere Möglichkeit, nur wenn ihr die Falle mit der wahren Begründung trotzdem wollt (eher für Experte):** „Ja, denn im Meer verdunstet das meiste Wasser“, mit „warum nicht“: „Das meiste Wasser verdunstet wirklich über dem Meer. Aber auch dieses Wasser war vorher schon unterwegs, zum Beispiel als Fluss.“ Ich empfehle die sicher falsche Fassung oben.

### Quellen je Aussage (⚠ = bitte vom `fakten-pruefer` besonders prüfen)
**luft-3:**
- Luft wird oben dünner, der Luftdruck sinkt, oben ist es meist kälter: UCAR Troposphere („Air pressure and the density of the air also decrease as altitude increases“, „Air gets colder as one rises“).
- Eine verschlossene Tüte bläht sich auf, wenn draußen der Luftdruck niedrig ist: Museum of Science Boston. ⚠ Eine Behörde oder Universität habe ich dafür nicht gefunden, nur dieses Museum (dazu Lehrbuch-Lösungen und Foren, die ich nicht nehme). Die Physik ist eindeutig.
- Gas drückt in alle Richtungen: NASA Glenn.
- „Auf einem Berg zieht die Erde fast genauso stark“: abgeleitet aus NASA Microgravity (in 400 km Höhe noch etwa 90 %). ⚠ Der Wert für den Berg ist abgeleitet, nicht wörtlich belegt. Er liegt bei etwa 0,1 % weniger auf 3 km. Das „viel“ in der Falle macht sie sicher falsch.
- ⚠ „Ein Ballon mit Loch wird schlaff, nicht prall“ (Luft strömt von innen nach außen, weil innen mehr Druck ist): Allgemeinwissen, ohne eigene Quelle.
- ⚠ Das Wort „Gas“ statt „Luft“ in der Tüte ist bewusst gewählt: Chipstüten sind oft mit Stickstoff gefüllt. Das wird nicht behauptet, darum keine Quelle dafür.
- ⚠ Das „warum“ sagt bewusst nicht „innen drückt es so stark wie im Tal“. Wenn sich die Tüte ausdehnt, sinkt der Druck innen etwas.

**pilze-3:**
- Penn State Extension (Seite selbst gelesen): „mushrooms are usually grown in the absence of light, darkness is not a requirement“, „Mushrooms lack the ability to use energy from the sun“, Nährstoffe aus „decaying, organic-matter vegetation“, „Straw-bedded horse manure and hay or wheat straw“, „Watering the crop is the most delicate operation“.
- Kew „Why fungi matter“ steht schon bei `pilze-2` und auf der Karte. ⚠ Ich bekam beim Abruf einen Fehler (403) und konnte die Seite nicht selbst lesen.
- ⚠ Die Frage gilt nur für Champignons. Austernpilze und Shiitake brauchen Licht für ihre Fruchtkörper (USDA-Papier, über die Suche gefunden: https://legacy.rma.usda.gov/pilots/feasible/PDF/mushroom.pdf). Darum steht in der Frage „Champignons“ und „oft“, nicht „alle Pilze“.

**wasser-2:**
- Wolken entstehen auch über Land, wenn die Sonne den Boden erwärmt: UCAR „Clouds Form Due to Surface Heating“ (über die Suche gefunden, die Seite habe ich nicht selbst gelesen).
- Über Hügeln und Bergen steigt warme Luft gern auf: Alaska Science Forum (https://www.gi.alaska.edu/alaska-science-forum/cumulus-clouds-and-cloud-streets). ⚠ Das „über Feldern und Bergen“ bitte gegen die UCAR-Seite prüfen.

### Umformuliert
- wasser-2: Die Antwort „Nein, er fängt immer in den Wolken an“ fällt weg, neu ist „Ja, denn Wolken entstehen nur über dem Meer“ (samt eigenem „warum nicht“; der alte Satz „Wolken sind nur eine Station …“ entfällt).
- In `tests/fixtures/gespeicherte-antworten*.json` gibt es keine Klassik-Einträge (geprüft mit grep). Folge im Code: `restoreReasonRound` mischt eine gespeicherte Reihenfolge mit der alten Antwort neu. War die alte Antwort gerade gewählt, wird die Auswahl leer. Es geht kein Fortschritt im Pass verloren.
- Sonst nichts umformuliert. pflanzen-3 bekommt nur das Feld `gruppe`.

### Zahlen (nachgezählt mit python)
- **Pro Frage:**
  - luft-3: Experte, 4 Antworten, 2 Tipps.
  - pilze-3: Experte, 4 Antworten, 2 Tipps.
  - wasser-2: Profi, 4 Antworten.
- **Experte gesamt danach:** 8 Fragen. Die richtige Antwort ist in 0 von 8 die einzige längste und in 0 von 8 die einzige kürzeste. Verräterische Wörter nach der Regel aus `tests/ratemuster.test.mjs`: keine.
- **Profi gesamt danach:** 12 Fragen, 0 von 12 einzige längste, 1 von 12 einzige kürzeste (unverändert gegenüber vorher), keine verräterischen Wörter.
- **Länge der Antworten in Zeichen:**
  - luft-3: 42 (richtig) / 47 / 41 / 46
  - pilze-3: 39 / 36 (richtig) / 37 / 34
  - wasser-2: 32 / 43 / 37 (richtig) / 45
- **Übertreibungswörter:** Die richtige Antwort ist nie die einzige ohne. In wasser-2 hat sie selbst ein starkes Wort, das stimmt („gar keinen“).
- **Satzlänge:** Alle Sätze haben höchstens 12 Wörter.

### Offen
1. **3 oder 4 Antworten** auf Experte (siehe oben). Ich empfehle 4, wie bei den vorhandenen Experten-Fragen.
2. **Leichtes Verraten über die Stufen hinweg,** das `gruppe` nicht abfängt:
   - Das „warum“ von luft-3 („oben dünner“) macht in `luft-2` (Profi, kann als vierte Frage kommen) die Falle „Ganz oben wird die Luft wieder dichter“ leichter.
   - Das „warum nicht“ zur Licht-Falle in pilze-3 macht in `pilze-2` die Falle „Zucker vom Pilz zurück“ leichter.
   - Beides betrifft je nur eine Falle. Ich halte es für vertretbar, entscheiden soll der `stufen-pruefer`.
3. **„Mist“** im „warum“ von pilze-3 ist fachlich richtig (Pferde- und Hühnermist), kann aber Kichern auslösen. Die `kinder-redaktion` soll entscheiden. Ersatz wäre „aus Stroh und Heu“, das ist dann aber unvollständig.
4. **Prüfung:** Alles ist ungeprüft. Es prüfen `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer` unabhängig voneinander.
