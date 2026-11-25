# Personen-Rätsel: Neufassung der fünf vorhandenen Rätsel (Entwurf, 25.11.2026)

Helfer: `karten-autor` (opus/high). Entwurf, noch ungeprüft; geprüft wird unabhängig durch `fakten-pruefer`, `kinder-redaktion`, `stufen-pruefer`.

Ich habe keine Dateien geändert. Das ist ein Entwurf. Geprüft hat ihn noch niemand: Fakten, Sprache und Stufe sehen sich `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer` noch an.

**Was ich gemessen habe:** Ein node-Skript hat jede Fassung gegen die Regeln aus `tests/world-game-learning-copy.test.mjs` Z. 59–71 geprüft (Namensteile, auch mitten im Wort, und dieselbe Fürwort-Regex). Es hat auch die Zusatzregeln geprüft und die Wörter gezählt: Satz 1 beginnt mit „Diese Person“, Satz 2 nicht, Satz 1 ohne `?`, höchstens 13 Wörter, keine Abkürzung mit Punkt. Getrennt wird wie geplant am ersten `.`, `!` oder `?` mit Leerzeichen danach. Alle Hauptfassungen bestehen das. Ein zweiter Lauf hat keinen ganzen Namensteil einer der anderen Personenkarten in den Texten gefunden. Den echten `pnpm test` habe ich nicht laufen lassen. Skript: `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/neu/pruefe.mjs`

**Feste Entdecker-Antworten heute** (aus `worldGameBank('people')`):
- Darwin: Anning, Hopper. Anning steht auf der Ausschlussliste, darum kommt eine Ersatz-Falle; laut stufen-pruefer kann das auch Bertha Benz sein.
- Murasaki: Tu Youyou, Maathai.
- Mandela: Gutenberg, Armstrong.
- Jemison: Darwin, Ibn al-Haytham.
- Karl Benz: Einstein, Jemison.

Die Texte sind auf diese Antworten abgestimmt. Ändert M1 die Fallen, sollte der stufen-pruefer das noch einmal ansehen.

## 1. Zum Einbau: neue Einträge in `EIGENE_RAETSEL`

```json
{
 "person-charles_darwin": "Diese Person verglich Lebewesen und erklärte, wie sich Arten über lange Zeit verändern. Vorher sammelte diese Person auf einer Schiffsreise mit der „Beagle“ Tiere und Pflanzen.",
 "person-murasaki_shikibu": "Diese Person schrieb in Japan vor etwa 1000 Jahren die Geschichte eines Prinzen. Die Geschichte entstand am Hof des Kaisers und wurde jahrhundertelang von Hand abgeschrieben.",
 "person-nelson_mandela": "Diese Person kämpfte in Südafrika für gleiche Rechte, egal welche Hautfarbe. Dort galt die Apartheid: Gesetze gaben Menschen je nach Hautfarbe ungleiche Rechte. 1994 durften alle Erwachsenen wählen, und diese Person wurde Oberhaupt des Landes.",
 "person-mae_jemison": "Diese Person flog 1992 mit einer Raumfähre ins All und forschte dort. Vorher studierte diese Person Medizin und Technik und behandelte kranke Menschen.",
 "person-karl_benz": "Diese Person entwickelte einen Motorwagen, also ein sehr frühes Auto. Dafür mussten Motor, Lenkung und Bremsen gut zusammenpassen."
}
```

## 2. Je Person

### person-charles_darwin
- **Satz 1 (13 Wörter):** Diese Person verglich Lebewesen und erklärte, wie sich Arten über lange Zeit verändern.
- **Satz 2 (13 Wörter):** Vorher sammelte diese Person auf einer Schiffsreise mit der „Beagle“ Tiere und Pflanzen.
- **Gesamt:** 26 Wörter.
- **Warum so:**
  - Satz 1 nennt, was die Person getan hat: vergleichen und erklären.
  - Kein „Generationen“, keine Reise, kein „fünf Jahre“, kein „Fossilien“. Fossilien würden zur ausgeschlossenen Falle Anning locken.
  - Satz 2 nennt ein Schiff. Das trennt auch auf Profi klar von Bertha Benz („lange Fahrt“ mit dem Auto).
  - „Vorher“ stimmt: Erst kam die Reise, die Erklärung kam später.
  - Satz 2 enthält das alte Fürwort „sie“ nicht.
- **Fundstelle:**
  - `intro`: „verglich Lebewesen, Fossilien und viele Beobachtungen“
  - `paragraphs[0]`: „Seine Beobachtungen halfen ihm später, die Entwicklung von Lebewesen zu erklären.“
  - `more[0]`: „Auf der Beagle-Reise sammelte er Tiere, Pflanzen, Fossilien und Notizen.“
- **Quelle:** Natural History Museum, https://www.nhm.ac.uk/discover/charles-darwin-most-famous-biologist.html
  - Von mir abgerufen: „On his travels Darwin collected plants, animals and fossils“
  - „spent many years comparing and analysing specimens“
  - „so species change over time“
- **Ersatz:**
  - Satz 1: „Diese Person verglich Tiere und Pflanzen und erklärte, wie sich Arten langsam verändern.“ (13)
  - Satz 2: „Viele Beobachtungen stammten von einer Schiffsreise mit der „Beagle“ von 1831 bis 1836.“ (13)
- **Offen:**
  - ⚠ **fakten-pruefer:** Die NHM-Seite sagt „over time“, nicht „über lange Zeit“. Die Karte sagt „über Generationen“. Ist „über lange Zeit“ als Vereinfachung in Ordnung? Sonst ginge „nach und nach“ (ebenfalls 13 Wörter). Missverständlich wäre „Lebewesen verändern sich“, als ob sich ein einzelnes Tier wandelt. Das verbietet die Karte, darum steht dort „Arten“.
  - **kinder-redaktion:** Ist „Arten“ für 5- bis 7-Jährige ohne Erklärung verständlich (bekannt aus „Tierarten“)?
  - **stufen-pruefer:** Lockt „über lange Zeit“ zur Ersatz-Falle Anning? Anning ist ausgeschlossen, aber Hokusai, Tagore oder einer der Benz können als Ersatz kommen.

### person-murasaki_shikibu
- **Satz 1 (13 Wörter):** Diese Person schrieb in Japan vor etwa 1000 Jahren die Geschichte eines Prinzen.
- **Satz 2 (13 Wörter):** Die Geschichte entstand am Hof des Kaisers und wurde jahrhundertelang von Hand abgeschrieben.
- **Gesamt:** 26 Wörter.
- **Warum so:**
  - Satz 1 nennt das Werk.
  - „Japan“ trennt von den anderen Gelehrten um 1000, die als Profi-Fallen kommen können (Ibn Sina, Ibn al-Haytham, al-Chwarizmi).
  - „Hof des Kaisers“ in Satz 2 bleibt eine echte Profi-Falle zu Cai Lun.
- **Zeitangabe:**
  - Die Karte sagt „frühes 11. Jahrhundert“ und „Lebte um 1000“. Das Kyoto National Museum sagt „over a thousand years ago during the Heian period“.
  - Das sind heute rund 1000 bis 1025 Jahre. „Vor etwa 1000 Jahren“ und „vor über 1000 Jahren“ stimmen also beide.
  - Ich empfehle „vor etwa 1000 Jahren“, gleich wie bei Ibn al-Haytham und Ibn Sina. Bei Ibn Sina steht heute „vor rund 1000 Jahren“; das sollte dann auch auf „etwa“ wechseln.
- **Fundstelle:**
  - `intro`: „schrieb am japanischen Kaiserhof im frühen 11. Jahrhundert die Erzählung vom Prinzen Genji“
  - `paragraphs[1]`: „Der Text wurde über Jahrhunderte von Hand weiterkopiert.“
  - `facts[0]`: „Lebte um 1000“
- **Quelle:** Kyoto National Museum, https://www.kyohaku.go.jp/eng/exhibitions/special/2026_genji/
  - Abgerufen: „over a thousand years ago“
  - „passed down through the devoted efforts of countless scribes over the centuries“
  - Die Seite nennt die Autorin eine „court lady“. Dass am Hof geschrieben wurde, steht ausdrücklich in der Karten-`intro`.
- **Ersatz:**
  - Satz 1: „Diese Person schrieb vor etwa 1000 Jahren in Japan eine Geschichte über einen Prinzen.“ Das sind 14 Wörter, also eins über der Grenze, aber ohne Genitiv.
  - Satz 2: „… und wurde viele Hundert Jahre abgeschrieben.“
- **Offen:**
  - ⚠ **fakten-pruefer:** „entstand am Hof des Kaisers“ stützt sich auf die Karte („schrieb am japanischen Kaiserhof“). Die Museumsseite sagt nur „court lady“ und „imperial court“ als Schauplatz. Reicht das?
  - **kinder-redaktion:** „Geschichte eines Prinzen“ (Genitiv, 13 Wörter) oder „Geschichte über einen Prinzen“ (14 Wörter)? Ist „jahrhundertelang“ für Profi zu lang?
  - **stufen-pruefer:** Auf Entdecker heißen die Fallen Tu Youyou und Maathai. Kleine kennen keinen der drei Namen; das ist das Problem aus M1, nicht aus dem Text.

### person-nelson_mandela
- **Satz 1 (11 Wörter):** Diese Person kämpfte in Südafrika für gleiche Rechte, egal welche Hautfarbe.
- **Satz 2 (12 Wörter):** Dort galt die Apartheid: Gesetze gaben Menschen je nach Hautfarbe ungleiche Rechte.
- **Satz 3 (12 Wörter):** 1994 durften alle Erwachsenen wählen, und diese Person wurde Oberhaupt des Landes.
- **Gesamt:** 35 Wörter in drei Sätzen.
- **Warum so:**
  - Satz 1 kommt ohne „Apartheid“ aus. Das Wort steht in Satz 2 und wird im selben Satz erklärt.
  - „Oberhaupt“ statt „Präsident“, weil „Präsident“ verraten würde, dass ein Mann gesucht ist.
  - Satz 3 zeigt die Folge: erstmals wählen alle.
- **Fundstelle:**
  - `intro`: „setzte sich in Südafrika gegen die Apartheid ein … benachteiligte Menschen durch rassistische Gesetze … wurde 1994 Präsident“
  - `paragraphs[0]`: „teilte Menschen nach rassistischen staatlichen Kategorien ein und gab ihnen ungleiche Rechte“
  - `paragraphs[1]`: „Die ersten demokratischen Wahlen fanden 1994 statt“
- **Quellen:**
  - Nelson Mandela Foundation, https://www.nelsonmandela.org/biography. Abgerufen: „On 10 May 1994 he was inaugurated as South Africa's first democratically elected President“
  - Nelson Mandela Foundation, https://www.nelsonmandela.org/democracy. Abgerufen: „South Africa's first democratic elections in April 1994“
  - Nicht in den `sources` der Karte, nur in einer Suchübersicht gesehen, die Seite selbst habe ich nicht geöffnet: Apartheid Museum, 1994 Election, https://www.apartheidmuseum.org/exhibitions/1994-election. Laut Suchtext: erste Wahl, bei der alle Südafrikaner wählen durften, vorher nur Weiße.
- **Ersatz für Satz 1:** „Diese Person setzte sich in Südafrika für gleiche Rechte ein, egal welche Hautfarbe.“ (13). Das ist näher am Kartenwort „setzte sich … ein“.
- **Offen:**
  - ⚠ **fakten-pruefer: „Hautfarbe“.** Keine Quelle der Karte sagt das wörtlich. Die Karte sagt „rassistische staatliche Kategorien“. Das alte Rätsel benutzte „Hautfarbe“ schon und wurde am 24.11.2026 geprüft. Bitte trotzdem bestätigen, ob die Vereinfachung trägt.
  - ⚠ **fakten-pruefer: „alle Erwachsenen durften wählen“.** Die Kartenquellen sagen nur „first democratic elections“. Soll die Seite des Apartheid Museum als Quelle auf die Karte?
  - **kinder-redaktion:** „kämpfte“ (vorgeschlagen vom stufen-pruefer, anschaulich) oder „setzte sich ein“? Laut `more[0]` gab es auch bewaffneten Widerstand, „kämpfte“ ist also nicht falsch, klingt aber nach Gewalt. Ist „Oberhaupt“ verständlich genug?

### person-mae_jemison
- **Satz 1 (12 Wörter):** Diese Person flog 1992 mit einer Raumfähre ins All und forschte dort.
- **Satz 2 (11 Wörter):** Vorher studierte diese Person Medizin und Technik und behandelte kranke Menschen.
- **Gesamt:** 23 Wörter.
- **Warum so:**
  - Der Flug ins All steht jetzt vorn. Das trennt klar von den Entdecker-Fallen Darwin und Ibn al-Haytham.
  - Satz 2 beginnt nicht mit „Diese Person“.
  - Keine Wörter wie „Ärztin“ oder „Astronautin“, die verraten, dass eine Frau gesucht ist.
  - „Endeavour“ habe ich aus Satz 1 genommen: ein fremdes Wort weniger beim Vorlesen für Kleine.
- **Fundstelle:**
  - `intro`: „verband Medizin, Technik und Raumfahrt. 1992 forschte sie … im Weltraumlabor der Endeavour“
  - `paragraphs[0]`: „studierte Chemieingenieurwesen und Medizin … arbeitete sie als Ärztin“
- **Quellen:**
  - NASA, https://www.nasa.gov/former-astronaut-mae-c-jemison/
  - NASA, STS-47, https://www.nasa.gov/mission/sts-47/
  - NASA, Biografie 1993 (PDF), https://www.nasa.gov/wp-content/uploads/2019/09/jemison_mae.pdf
  - Diese Seiten habe ich nicht neu abgerufen; Belege laut Karte.
- **Ersatz für Satz 1:** „Diese Person flog 1992 mit der Raumfähre Endeavour ins All und forschte dort.“ (13). Das ist der bisher geprüfte Wortlaut, nur nach vorn gezogen.
- **Offen:**
  - ⚠ **fakten-pruefer:** Ist „Technik studiert“ als Vereinfachung von Chemieingenieurwesen in Ordnung? Das alte Rätsel sagte „kannte sich mit Technik aus“. Trägt „behandelte kranke Menschen“ für die Arbeit als Ärztin (unter anderem im Peace Corps)?
  - **stufen-pruefer:** Falls nach M1 Armstrong als Entdecker-Falle möglich wird, trennt Satz 1 nicht mehr („ins All“ gegen „Mond“). Dann sollte die Raumfahrt-Gruppe einander ausschließen.

### person-karl_benz
- **Satz 1 (10 Wörter):** Diese Person entwickelte einen Motorwagen, also ein sehr frühes Auto.
- **Satz 2 (8 Wörter, unverändert):** Dafür mussten Motor, Lenkung und Bremsen gut zusammenpassen.
- **Gesamt:** 18 Wörter.
- **Warum so:**
  - Jetzt steht „Auto“ drin (kinder-redaktion, Offen 3).
  - Kein „erstes Auto“, weil die Karte ausdrücklich sagt, dass es viele Beteiligte gab. Darum „sehr frühes“.
  - Die Namensteile „karl“, „carl“ und „benz“ kommen auch mitten im Wort nicht vor.
  - Die beiden Benz schließen sich als Falle gegenseitig aus. „Entwickelte“ (Karl) und „machte eine lange Fahrt“ (Bertha) treffen sich also nie in einer Runde.
- **Fundstelle:**
  - `intro`: „entwickelte einen Motorwagen“
  - `facts[1]`: „Ingenieur und Automobilpionier“
  - `surprise`: „frühe Automobilentwicklung“
  - `paragraphs[1]`: „Motor, Übertragung, Fahrwerk, Lenkung und Bremsen“
- **Quelle:** Deutsches Museum, https://www.deutsches-museum.de/museum/presse/meldung/eine-ikone-der-automobilgeschichte-wird-140. Nicht neu abgerufen.
- **Offen:**
  - ⚠ **fakten-pruefer:** „also ein sehr frühes Auto“ ist eine Gleichsetzung. Bitte bestätigen, dass der Patent-Motorwagen so genannt werden darf.

## 3. Entdecker-Tipp für „Wer war das?“

**Heute für alle Stufen** (`app/world-game-support.mjs` Z. 42, `hints.people`):
„Vergleiche die genannte Tätigkeit oder Entdeckung mit dem, was du über die angebotenen Personen weißt.“

**Vorschlag Entdecker (14 Wörter, 81 Zeichen, zwei Sätze mit 5 und 9 Wörtern):**
„Was hat diese Person gemacht? Lass zuerst die Namen weg, die sicher nicht passen.“

**Ersatz (12 Wörter):**
„Kennst du einen der Namen? Überlege: Hat dieser Mensch so etwas gemacht?“

**Warum:** Kleine kennen oft keinen der drei Namen. Ausschließen hilft dann mehr als Vergleichen. Der Tipp verrät keine Lösung, nennt kein Geschlecht und erfüllt die Testregel (`hint.length > 20`, nicht gleich `why`). Der Profi-Tipp bleibt, wie er ist.

**Für den Einbau:** `worldGameHint(game,item)` kennt heute keine Stufe. Der Tipp braucht einen Stufen-Parameter, z. B. `worldGameHint(game,item,gespielt)` in `app/world-games.tsx` Z. 62. Auch „Tipp vorlesen“ liest dann den neuen Text.

## 4. Umformuliert
Keine. Antworttexte ändern sich nicht. Rätseltexte werden nicht gespeichert (stufen-pruefer, Abschnitt 4 Punkt 4). Kein Test erwartet den alten Wortlaut: Ich habe `tests/` nach „Beagle“, „Endeavour“, „Apartheid“, „Genji“ und „Motorwagen“ durchsucht und keinen Treffer gefunden.

## 5. Zahlen
Entfällt: Hier gibt es keine neuen Antwortlisten und keine Frage je Stufe. Wortzahlen gemessen:

| Person | Satz 1 | ganzes Rätsel |
|---|---|---|
| Darwin | 13 | 26 |
| Murasaki | 13 | 26 |
| Mandela | 11 | 35 (3 Sätze) |
| Jemison | 12 | 23 |
| Karl Benz | 10 | 18 |

## 6. Offen (für Claude)
1. **Ibn Sina:** Murasaki und Ibn al-Haytham sagen „vor etwa 1000 Jahren“. Soll Ibn Sina („vor rund 1000 Jahren“, Paket 3) im selben Zug angeglichen werden?
2. **Neue Quelle für Mandela:** Die Seite des Apartheid Museum zur Wahl 1994 deckt „alle Erwachsenen durften wählen“. Ob sie auf die Karte kommt, entscheidest du nach dem fakten-pruefer.
3. **„Arten“ (Darwin) und „Oberhaupt“ (Mandela):** Ob diese Wörter für die Jüngsten ohne Erklärung gehen, entscheidet die kinder-redaktion.
4. **Fallen nach M1:** Die Texte sind auf die heutigen festen Fallen abgestimmt. Ändert M1 die Fallenwahl, sollte der stufen-pruefer Jemison (Armstrong) und Darwin (Ersatz-Fallen) noch einmal ansehen.

Sources:
- [NHM: Charles Darwin](https://www.nhm.ac.uk/discover/charles-darwin-most-famous-biologist.html)
- [Kyoto National Museum: Genji](https://www.kyohaku.go.jp/eng/exhibitions/special/2026_genji/)
- [Nelson Mandela Foundation: Biography](https://www.nelsonmandela.org/biography)
- [Nelson Mandela Foundation: Democracy](https://www.nelsonmandela.org/democracy)
- [Apartheid Museum: 1994 Election](https://www.apartheidmuseum.org/exhibitions/1994-election)
- [NASA: Mae Jemison](https://www.nasa.gov/former-astronaut-mae-c-jemison/)
- [NASA: STS-47](https://www.nasa.gov/mission/sts-47/)
- [Deutsches Museum: Motorwagen](https://www.deutsches-museum.de/museum/presse/meldung/eine-ikone-der-automobilgeschichte-wird-140)
