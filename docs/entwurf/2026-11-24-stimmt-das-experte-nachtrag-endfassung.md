# B) Experten-Nachtrag „Stimmt das wirklich?“: Endfassung des `karten-autor` (24.11.2026)

Helfer: `karten-autor` (opus / high), 24.11.2026. Nur Entwurf, nichts geändert. Grundlage: die Prüfberichte zu Fassung 2 und Claudes Entscheidungen dazu. Neue Sätze (⚠) gehen noch einmal an `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer`.

Grundlage: der Nachtrag-Entwurf, die Faktenprüfung dazu, die Berichte von `kinder-redaktion` und `stufen-pruefer` und die Entscheidungen von Claude. Die IDs `detective-luft-3` und `detective-pilze-3` sind frei, auch in `tests/fixtures/stable-ids.json` (mit grep geprüft).

## 1. Neue Fragen

```json
[
 {
  "id": "detective-luft-3",
  "game": "detective",
  "level": "hard",
  "stufe": "experte",
  "prompt": "Eine Chipstüte ist fest verschlossen. Im Tal ist sie weich. Oben auf einem hohen Berg ist sie prall wie ein Ballon. Warum?",
  "answers": [
   "Von außen drückt weniger Luft auf die Tüte",
   "Oben ist es wärmer, und die Luft dehnt sich aus",
   "Durch winzige Löcher kam Luft in die Tüte",
   "Oben zieht die Erde viel schwächer an der Luft"
  ],
  "correct": "Von außen drückt weniger Luft auf die Tüte",
  "wrongReasons": {
   "Oben ist es wärmer, und die Luft dehnt sich aus": "Wärme ist hier nicht der Grund. Auch an kühlen Tagen wird die Tüte oben prall.",
   "Durch winzige Löcher kam Luft in die Tüte": "Die Tüte ist dicht verschlossen. Hätte sie oben ein Loch, würde Luft hinausströmen. Dann bliebe sie weich.",
   "Oben zieht die Erde viel schwächer an der Luft": "Oben zieht die Erde fast so stark wie im Tal. Daran liegt es nicht."
  },
  "why": "Oben auf dem Berg ist die Luft dünner. Sie drückt von außen schwächer auf die Tüte. Die Luft drinnen drückt nach außen und dehnt sich aus. Darum wird die Tüte prall.",
  "hints": [
   "Hoch oben fällt das Atmen schwerer. Wie ist die Luft dort?",
   "Drück einen Luftballon mit beiden Händen zusammen. Was passiert, wenn du loslässt?"
  ],
  "topic": "science-atmosphere",
  "quelle": [
   {"label": "UCAR Center for Science Education: The Troposphere (Luftdruck sinkt, Luft wird kälter mit der Höhe)", "url": "https://scied.ucar.edu/learning-zone/atmosphere/troposphere"},
   {"label": "OpenStax Chemistry 2e (Rice University), Kap. 9.2: Relating Pressure, Volume, Amount, and Temperature (weniger Druck, mehr Rauminhalt; Luft strömt von hohem zu niedrigem Druck)", "url": "https://openstax.org/books/chemistry-2e/pages/9-2-relating-pressure-volume-amount-and-temperature-the-ideal-gas-law"},
   {"label": "Museum of Science Boston: Why do chip bags puff up on planes?", "url": "https://mos.org/video/why-do-chip-bags-puff-planes"},
   {"label": "NASA Glenn: Air Pressure (Luftdruck wirkt in alle Richtungen)", "url": "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/air-pressure/"},
   {"label": "NASA: What Is Microgravity? (Schwerkraft in etwa 400 km Höhe noch etwa 90 %)", "url": "https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-microgravity-grades-5-8/"}
  ]
 },
 {
  "id": "detective-pilze-3",
  "game": "detective",
  "level": "hard",
  "stufe": "experte",
  "prompt": "In einem dunklen Keller steht ein Topf mit Basilikum. Daneben wachsen Champignons auf Kompost. Was passiert in den nächsten Wochen?",
  "answers": [
   "Das Basilikum wird schwach, die Pilze wachsen weiter",
   "Die Pilze werden schwach, das Basilikum wächst weiter",
   "Das Basilikum und die Pilze werden beide schwach",
   "Das Basilikum und die Pilze wachsen beide weiter"
  ],
  "correct": "Das Basilikum wird schwach, die Pilze wachsen weiter",
  "wrongReasons": {
   "Die Pilze werden schwach, das Basilikum wächst weiter": "Basilikum macht seine Nahrung mit Licht. Im Keller ist es aber dunkel.",
   "Das Basilikum und die Pilze werden beide schwach": "Champignons brauchen für ihre Nahrung kein Licht. Die Dunkelheit stört sie nicht.",
   "Das Basilikum und die Pilze wachsen beide weiter": "Basilikum ist eine grüne Pflanze. Im Dunkeln fehlt ihm etwas Wichtiges."
  },
  "why": "Ohne Licht kann das Basilikum keine Nahrung machen. Es wird blass und schwach. Der Kompost unter den Pilzen ist aus Stroh und Mist. Die Pilzfäden zerlegen ihn und holen sich daraus Nahrung. Licht brauchen sie dafür nicht.",
  "hints": [
   "Was brauchen grüne Blätter, um Nahrung zu machen?",
   "Champignons haben keine grünen Blätter. Wovon leben sie dann?"
  ],
  "topic": "science-fungi",
  "quelle": [
   {"label": "Penn State Extension: Basic Procedures for Agaricus Mushroom Growing (meist ohne Licht gezogen, auch in Kellern; kein Blattgrün; Kompost aus Stroh und Mist)", "url": "https://extension.psu.edu/basic-procedures-for-agaricus-mushroom-growing"},
   {"label": "National Parks Board Singapur, GardeningSG: Etiolation (ohne Licht werden Pflanzen blass, mit langen, schwachen Trieben)", "url": "https://gardeningsg.nparks.gov.sg/gardening-resource-library/etiolation/"},
   {"label": "University of Minnesota Extension: Growing basil in home gardens (mindestens sechs bis acht Stunden helles Licht am Tag)", "url": "https://extension.umn.edu/vegetables/growing-basil"},
   {"label": "Kimball, Biology (LibreTexts), 16.4C Etiolation (im Dunkeln fehlt Chlorophyll; ohne Licht stirbt der Keimling, wenn sein Vorrat aufgebraucht ist)", "url": "https://bio.libretexts.org/Bookshelves/Introductory_and_General_Biology/Biology_(Kimball)/16%3A_The_Anatomy_and_Physiology_of_Plants/16.04%3A_Plant_Development_-_Fundamentals/16.4C%3A_Etiolation"}
  ],
  "gruppe": "nahrung"
 }
]
```

**Dazu nötig (unverändert):** `detective-pflanzen-3` bekommt `"gruppe": "nahrung"`. An ihren Texten ändert sich nichts. Grund: Das „warum“ von pilze-3 („Ohne Licht kann das Basilikum keine Nahrung machen“) und sein Tipp 1 berühren die Licht-Falle von pflanzen-3. Mit der Gruppe kommen beide nie in dieselbe Experten-Runde. Eine Runde zieht dann aus 5 Plätzen: einer aus „dampf“, einer aus „nahrung“, dazu jahreszeiten-3, meer-4 und luft-3.

**Warum das jetzt Experte ist:**
- **luft-3:** Das Kind verbindet „oben dünne Luft“ (luft-1) mit „von außen drückt weniger“. Jede Falle ist eine echte Fehlvorstellung: Wärme, Loch, Schwerkraft.
  - Tipp 2 ist ein Versuch zum Selbermachen. Er nennt weder „außen“ noch „weniger“.
  - Das „warum nicht“ zur Wärme sagt nicht mehr, dass es oben kälter ist. So verrät es `detective-wasser-4` nicht mehr (Befund B2), und `wasser-4` verrät es nicht.
- **pilze-3 (umgebaut nach B1):** Das Kind muss zwei Tatsachen verbinden: „Grüne Pflanzen brauchen Licht für ihre Nahrung“ und „Champignons holen ihre Nahrung aus dem Kompost“.
  - Die vier Antworten sind ein 2×2-Feld wie bei `detective-meer-4`. Keine Antwort widerlegt sich selbst.
  - Wer nur eine Tatsache kennt, landet bei einer Falle („beide schwach“ oder „beide weiter“).
  - Jedes „warum nicht“ klärt nur eine Hälfte, Basilikum oder Pilze. Nach einem Fehler bleiben also noch zwei Antworten zum Nachdenken.

## 2. wasser-2: neue Falle (Satz bleibt, Quelle dazu)

```json
{
 "id": "detective-wasser-2",
 "game": "detective",
 "level": "medium",
 "stufe": "profi",
 "prompt": "Ein Kind sagt: „Der Wasserkreislauf fängt immer im Meer an.“ Stimmt das?",
 "answers": [
  "Ja, alles Wasser startet im Meer",
  "Ja, denn Wolken entstehen nur über dem Meer",
  "Nein, er hat gar keinen festen Anfang",
  "Nein, er fängt an der Quelle eines Flusses an"
 ],
 "correct": "Nein, er hat gar keinen festen Anfang",
 "wrongReasons": {
  "Ja, alles Wasser startet im Meer": "Wasser verdunstet auch aus Seen und Pfützen. Pflanzen geben es über ihre Blätter ab.",
  "Nein, er fängt an der Quelle eines Flusses an": "Das Wasser in der Quelle war vorher Regen oder Schnee. Es war also schon unterwegs.",
  "Ja, denn Wolken entstehen nur über dem Meer": "Auch über Land entstehen Wolken. An heißen Sommertagen türmen sie sich oft über Feldern und Bergen auf."
 },
 "why": "Das Wasser wandert immer weiter, ohne Pause. Darum kannst du überall einsteigen. Einen ersten Ort gibt es nicht.",
 "hints": [
  "Folge einem Tropfen: Meer, Wolke, Regen, Fluss, Meer. Wo war er davor?",
  "Male einen Kreis. Kannst du zeigen, wo er anfängt?"
 ],
 "topic": "science-water-cycle",
 "quelle": [
  {"label": "NASA Earth Observatory: The Water Cycle", "url": "https://science.nasa.gov/earth/earth-observatory/the-water-cycle/"},
  {"label": "USGS: The Water Cycle", "url": "https://www.usgs.gov/special-topics/water-science-school/science/water-cycle"},
  {"label": "UCAR Center for Science Education: Clouds Form Due to Surface Heating", "url": "https://scied.ucar.edu/learning-zone/clouds/clouds-form-surface-heating"},
  {"label": "Alaska Science Forum (Geophysical Institute, University of Alaska Fairbanks): Cumulus clouds and cloud streets", "url": "https://www.gi.alaska.edu/alaska-science-forum/cumulus-clouds-and-cloud-streets"}
 ]
}
```

## 3. Quellen und was noch zu prüfen ist

Vom `fakten-pruefer` bestätigt, ohne neues ⚠:
- luft-3: richtige Antwort, die beiden anderen Antworten, die ersten beiden Sätze des „warum“, Tipp 1 und die Schwerkraft-Aussage.
- pilze-3: alle Penn-State-Aussagen (dunkle Räume, kein Blattgrün, Kompost aus Stroh und Mist, Nahrung aus zerfallenden Pflanzenresten).
- wasser-2: ganz, jetzt mit der Quelle Alaska Science Forum.

**Neu oder geändert, noch zu prüfen (⚠):**

| Nr. | Stelle | Wortlaut | Quelle | Wer prüft noch |
|---|---|---|---|---|
| ⚠ B1 | luft-3, Frage | „… prall wie ein Ballon.“ | Bild statt Sachaussage, Vorschlag der `kinder-redaktion`. | fakten (kurz) |
| ⚠ B2 | luft-3, `why`, 3. Satz | „Die Luft drinnen drückt nach außen und dehnt sich aus.“ | OpenStax 9.2 (Boyle: weniger Druck, mehr Rauminhalt); Museum of Science Boston („that air pushes out on the walls of the bag“). „Luft“ statt „Gas“ (`kinder-redaktion`); gekürzt auf 10 Wörter. Chipstüten sind oft mit Stickstoff gefüllt, dem Hauptteil der Luft. | fakten, kinder |
| ⚠ B3 | luft-3, Tipp 2 | „Drück einen Luftballon mit beiden Händen zusammen. Was passiert, wenn du loslässt?“ | Vorschlag der `kinder-redaktion`. Physik: Lässt der Druck von außen nach, dehnt sich der Ballon aus (OpenStax 9.2). Beim Ballon wirkt auch das Gummi mit; als Vergleich ist das vertretbar. | fakten, stufen (zu leicht oder zu verratend?) |
| ⚠ B4 | luft-3, „warum nicht“ Wärme | „Wärme ist hier nicht der Grund. Auch an kühlen Tagen wird die Tüte oben prall.“ | Wortlaut des `stufen-pruefer`. Größenordnung laut Faktenprüfung: 1000 m höher sind rund 11 % weniger Druck, 10 Grad kälter nur etwa 3,5 % weniger Rauminhalt. Der Druck überwiegt also. Museum of Science Boston, OpenStax 9.2. | fakten, kinder |
| ⚠ B5 | luft-3, „warum nicht“ Loch | „Die Tüte ist dicht verschlossen. Hätte sie oben ein Loch, würde Luft hinausströmen. Dann bliebe sie weich.“ | Wortlaut des `fakten-pruefer` mit „Luft“ statt „Gas“. OpenStax 9.2 („from high pressure to low pressure“). | kinder |
| ⚠ B6 | luft-3, „warum nicht“ Schwerkraft | „Oben zieht die Erde fast so stark wie im Tal. Daran liegt es nicht.“ | Inhalt schon geprüft (NASA Microgravity, Rechnung des `fakten-pruefer`: 3 km höher etwa 0,09 % weniger). Nur gekürzt, bisher 12 Wörter. | kinder |
| ⚠ B7 | pilze-3, Frage | „In einem dunklen Keller steht ein Topf mit Basilikum. Daneben wachsen Champignons auf Kompost. Was passiert in den nächsten Wochen?“ | Penn State: Champignons wachsen ohne Licht, auch in Kellern. ⚠ **Der Zeitraum „in den nächsten Wochen“ ist nicht wörtlich belegt.** Belegt sind nur die Folgen ohne Licht (NParks, Kimball) und der hohe Lichtbedarf von Basilikum (UMN: 6 bis 8 Stunden am Tag). Dass ein Basilikum im ganz dunklen Keller binnen weniger Wochen sichtbar blass und schwach wird, halte ich für sicher, habe aber keinen Beleg mit Zeitangabe. | fakten, kinder, stufen |
| ⚠ B8 | pilze-3, 4 Antworten | 2×2-Feld „Basilikum schwach/weiter“ × „Pilze schwach/weiter“ | Wie B7. Ich nehme „wird schwach“ statt „blass und schlapp“, damit alle vier Antworten gleich gebaut sind. Das „warum“ sagt dann „blass und schwach“. | fakten, kinder, stufen |
| ⚠ B9 | pilze-3, 3 × „warum nicht“ | siehe JSON | Penn State („darkness is not a requirement“, „lack the ability to use energy from the sun“); NParks (Pflanzen ohne Licht werden blass und schwach); Kimball (Chlorophyll braucht Licht). | fakten, kinder, stufen (verrät keins zu viel?) |
| ⚠ B10 | pilze-3, `why` | „Ohne Licht kann das Basilikum keine Nahrung machen. Es wird blass und schwach. Der Kompost unter den Pilzen ist aus Stroh und Mist. Die Pilzfäden zerlegen ihn und holen sich daraus Nahrung. Licht brauchen sie dafür nicht.“ | Penn State (Kompost aus „straw-bedded horse manure“, „hay or wheat straw“, „poultry manure“; Nahrung aus „decaying, organic-matter vegetation“); NParks; Kimball. Die Sätze 3 bis 5 sind vom `fakten-pruefer` bestätigt, mit kleinen Änderungen: „Pilzfäden“ statt „feine Fäden“, und „Der Kompost unter den Pilzen“, damit die Frage nicht fast wörtlich wiederkehrt. „Mist“ bleibt. Die Vereinfachung zur Deckschicht (Casing) hat der `fakten-pruefer` als vertretbar eingestuft. | fakten, kinder |
| ⚠ B11 | pilze-3, Tipps | „Was brauchen grüne Blätter, um Nahrung zu machen?“ / „Champignons haben keine grünen Blätter. Wovon leben sie dann?“ | Wortlaut des `stufen-pruefer`. Penn State; Karte `science-photosynthesis` („Grüne Pflanzen nutzen Lichtenergie …“). Kein Tipp enthält eine Antwort wörtlich; Tipp 1 klärt nur die Basilikum-Hälfte. | fakten, kinder |

Quellenlage pilze-3:
- Die Basilikum-Aussage ist sauber belegbar, darum habe ich keine andere Verbindung gesucht.
  - Basilikum braucht viel Licht: University of Minnesota Extension (geöffnet: „at least six to eight hours of bright light per day“).
  - Pflanzen ohne Licht werden blass und schwach: National Parks Board Singapur, eine Behörde (geöffnet: „Plants that are grown in the absence of light or not enough light become pale, have unexpanded leaves, and long weak shoots.“).
  - Lehrbuch Kimball über LibreTexts (geöffnet: „The pale color of the dark-grown plant is caused by the lack of chlorophyll.“; „When the food reserves of its seed are used up, the seedling will die (unless placed in the light).“).
- Die Kew-Quelle habe ich bei pilze-3 gestrichen. Sie war nicht erreichbar (403) und wird nicht gebraucht.

## 4. Umformuliert (alt → neu)

- **wasser-2:** Die Antwort „Nein, er fängt immer in den Wolken an“ fällt weg (samt ihrem „warum nicht“). Neu ist „Ja, denn Wolken entstehen nur über dem Meer“.
  - Klassik-Antworten stehen nicht in `tests/fixtures/gespeicherte-antworten*.json` (mit grep geprüft).
  - Im Code mischt `restoreReasonRound` eine gespeicherte Reihenfolge mit der alten Antwort neu. War die alte Antwort gewählt, wird die Auswahl leer. Kein Fortschritt im Pass geht verloren.
- luft-3 und pilze-3 sind neu, es gibt also keine gespeicherten Antworten.
- pflanzen-3 bekommt nur das Feld `gruppe`.

## 5. Zahlen (nachgezählt mit `node`, aus `app/classic-questions.json` plus diesem Entwurf)

- **Je Frage:**
  - luft-3: Experte, 4 Antworten, 2 Tipps.
  - pilze-3: Experte, 4 Antworten, 2 Tipps.
  - wasser-2: Profi, 4 Antworten (2 × Ja, 2 × Nein).
- **Antwortlängen in Zeichen** (richtige mit *):
  - luft-3: 42* / 47 / 41 / 46
  - pilze-3: 52* / 53 / 48 / 48 (je 8 Wörter)
  - wasser-2: 32 / 43 / 37* / 45
- **Detektiv Experte danach:** 8 Fragen. Die richtige Antwort ist in 0 von 8 die einzige längste und in 0 von 8 die einzige kürzeste.
- **Detektiv Profi danach:** 12 Fragen, 0 von 12 einzige längste, 1 von 12 einzige kürzeste (wie vorher).
- **Verräterische Wörter** nach der Regel aus `tests/ratemuster.test.mjs`, auf Profi und Experte nachgerechnet: keine.
- **Wörter nur in einer Antwort:** In pilze-3 steht nur „wächst“ in genau einer Antwort, und die ist falsch. Übertreibungswörter („nur“, „immer“, „allein“) stehen in keiner richtigen Antwort von luft-3 und pilze-3.
- **Kein Tipp enthält die richtige Antwort wörtlich** (geprüft).
- **Satzlängen:** In luft-3 und pilze-3 hat jeder Satz höchstens 11 Wörter. Ausnahmen gibt es nur bei wasser-2:
  - „An heißen Sommertagen türmen sie sich oft über Feldern und Bergen auf.“ hat 12 Wörter. Der Satz bleibt nach Claudes Entscheidung so (siehe Offen 1).
  - Die alte Frage von wasser-2 („Ein Kind sagt: …“) ist unverändert.
- Kindertexte von luft-3: „Gas“ kommt nicht mehr vor (geprüft). pilze-3: überall „Pilzfäden“, nirgends nur „Fäden“ (geprüft).

## 6. Was gegenüber dem ersten Nachtrag-Entwurf geändert ist

1. **luft-3:**
   - Frage: „wie ein Kissen“ → „wie ein Ballon“.
   - `why`: „Das Gas in der Tüte …“ → „Die Luft drinnen drückt nach außen und dehnt sich aus.“
   - Tipp 2: neu der Luftballon-Versuch.
   - Wärme-„warum nicht“: ohne „oben kälter“.
   - Loch-„warum nicht“: neu nach dem `fakten-pruefer`, mit „Luft“.
   - Schwerkraft-„warum nicht“: auf 10 Wörter gekürzt.
   - Quellen: OpenStax 9.2 dazu. Die Labels nennen „Luftdruck“ statt „Gasdruck“ und „in etwa 400 km Höhe“.
2. **pilze-3 ganz neu gebaut** (Befund B1): Basilikum und Champignons im dunklen Keller, 2×2-Feld mit vier gleich gebauten Antworten, neue „warum nicht“, neues „why“ mit „Pilzfäden“ und „Mist“, Tipps des `stufen-pruefer`. Quellen: Penn State, NParks, UMN, Kimball. Kew ist gestrichen. Die Gruppe „nahrung“ bleibt.
3. **wasser-2:** Der Satz bleibt. Das Alaska Science Forum ist als vierte Quelle dazugekommen.

## 7. Offen

1. **wasser-2, 12 Wörter:** Der Satz „An heißen Sommertagen türmen sie sich oft über Feldern und Bergen auf.“ bleibt laut Entscheidung, hat aber 12 Wörter. Eine Fassung mit 11 Wörtern ohne neue Aussage wäre: „Im Sommer türmen sie sich oft über Feldern und Bergen auf.“ (Alaska Science Forum: Cumulus verschwinden „as they do in winter“). Claude entscheidet.
2. **pilze-3, Zeitraum:** Hält der `fakten-pruefer` „in den nächsten Wochen“ ohne Beleg mit Zeitangabe nicht für tragfähig, wäre die Ausweichfrage: „Was passiert, wenn beide lange im Dunkeln bleiben?“ (8 Wörter).
3. **pilze-3 und pilze-2:** Das leichte Verraten über die Stufen hinweg ist wie vorher. Der `stufen-pruefer` hat es für vertretbar erklärt.
4. **pilze-3, Tipp 1:** Er klärt die Basilikum-Hälfte, und der `stufen-pruefer` hat ihn so vorgeschlagen. Ist er zu stark für einen ersten Tipp, wäre ein neutraler Ersatz: „Überleg für jedes Lebewesen einzeln: Woher kommt seine Nahrung?“ (9 Wörter).

Helfer: Diese Endfassungen hat nur der `karten-autor` geschrieben. Geprüft wird danach unabhängig, und nur die ⚠-Punkte: `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer`.
