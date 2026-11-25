# Design-Prüfung der Stilprobe C

Helfer: `design-pruefer` (sonnet/high), 25.11.2026. Chromium, Seiten per file://, 320, 390, 768, 1280, 1440 px. Keine Projektdatei geändert. Eigene Bilder liegen in `/home/user/wunderkompass/.qa-output/stilproben/pruefung-c/`.

## 1. Gesamteindruck je Breite

- **320 px:** Der erste Bildschirm zeigt Frage, zwei Knöpfe und das halbe Pinguinfoto (`/home/user/wunderkompass/.qa-output/stilproben/c-start-320.png`). Damit ist der frühere B-Mangel „kein Motiv oben“ behoben. Im Spiel wird der Stempel eng, der Rückmeldetext läuft in vier Zeilen (`c-spiel-320.png`).
- **390 px:** Das ist die stärkste Breite. Frage, Hauptknopf, Foto und Kompassrose sind klar geordnet. Die Welt-Kacheln mit Foto sind attraktiv und ruhig (`c-start-390-ganz.png`). Auch die Spielseite mit Stempel und „noch nicht richtig“ ist stimmig.
- **768 px:** Der Start ist jetzt zweispaltig und gut (`c-start-768.png`). Die Karte ist noch einspaltig. Das Foto füllt 736 × 552 px, der Titel sitzt erst am unteren Bildschirmrand (`c-karte-768.png`). Das Spiel ist unauffällig und passt (`c-spiel-768-ganz.png`).
- **1280 px:** Der Start ist ausgewogen (Titel, Foto, Rose, danach Route und Welten). Das Spiel passt auf einen Bildschirm (`c-spiel-falsch-1280.png`). Die Karte hat links unter dem Foto viel Leerraum, das ist wegen sticky vertretbar.
- **1440 px:** Die Maximalbreite 1200 px hält sauber (`c-start-1440.png`). Der Foto-Ausschnitt wirkt weich, siehe Soll 2.

## 2. Stand der früheren Befunde

Gemessen wurde mit eigenen Skripten: 4 Seiten × 5 Breiten für Überbreite, Tippflächen und Überlappungen, dazu Kontrastberechnung, Tab-Durchlauf (Montagen siehe Pkt. 4) und Vergleich mit/ohne „Bewegung reduzieren“.

**Muss**

| Nr. | Befund | Stand | Messung |
|---|---|---|---|
| 1 | Grandstander (u wie v) | **behoben** | Grandstander ist raus. `glyphen-c.png` zeigt „Natur Mund Pinguine“ eindeutig in Bricolage. Siehe aber Soll 3 zu „I“ und „l“. |
| 2 | Symbol über Kacheltext (B) | **behoben** | Kein Symbol-Text-Überlapp bei 20 Kombinationen (`.ohnefoto .ico.gross` gegen Text, 0 px). |
| 3 | Rose beschnitten (A) | **behoben, mit Einschränkung** | Rose bei 320 bis 1440 vollständig sichtbar. Bei etwa 1024 px berührt sie ein „e“ von „Kaiserpinguine“ (`pruefung-c/rose-1024.png`, Soll 1). |
| 4 | Tippflächen unter 48 px | **behoben** | Alle `a`, `button`, `summary` sind in 20 Kombinationen mindestens 48 × 48 px, auch Logo, Pfad, „Spiel beenden“, „Karte öffnen“, Desktop-Menü und Fußleiste. |
| 5 | Ausgegraute Antworten blass | **behoben** | „Erledigt“-Zustand in fester Farbe (`#4A5F70`), 6,3 bis 6,6:1, mit gestricheltem Rand (3,2 bis 3,65:1) statt `opacity`. Der Fokusring ist voll deckend. |

**Soll**

| Nr. | Befund | Stand | Messung |
|---|---|---|---|
| 1 | Randkontrast A | **behoben** | `--rand` #788A80 hat 3,65:1 auf Weiß und 3,2:1 auf Papier. |
| 2 | Stempel (Kontrast, Platz) | **behoben** | Stempeltext 6,5:1, fester Platz in der Rückmeldung, kein Überlapp. Bei 320 wird der Text daneben eng, siehe Kann. |
| 3 | Bricolage Zeichenabstand | **teilweise** | −0,01 em statt −0,03 em. In Schwarz-fett (780) sind „I“ und „l“ weiter fast gleich, `glyphen-c.png`. |
| 4 | Rotes Dreieck | **behoben** | Aktueller Schritt ist eine orange Raute im Ring. Rot (#B5462F) steht nur noch bei „falsch“. |
| 5 | Welten ohne Foto | **behoben** | Foto-Kacheln mit Weltfarbe, Symbol und Zahl. Eine Ausnahme siehe Kann. |
| 6 | Orange und Petrol | **behoben** | Petrol 5,5:1 auf Papier, Orange nur als Grafik (3,2 bis 3,6:1, reicht für Grafik). |
| 7 | 320 px ohne Motiv | **behoben** | Foto liegt zur Hälfte im ersten Bildschirm. |
| 8 | Tablet einspaltig | **teilweise** | Start ist zweispaltig. Karte bei 700 bis 899 px weiter einspaltig mit riesigem Foto (`c-karte-768.png`). |
| 9 | Fokus auf dunklem Grund | **behoben** | Fokus zweifarbig: 2 px weiß innen, 3 px Petrol außen. Auf der blauen Kachel trägt der weiße Ring (6,9:1). Der Petrol-Anteil dort ist kaum sichtbar (1,1:1), das ist egal. |
| 10 | Desktop-Menü 40 bis 42 px | **behoben** | Jetzt 48 px. |
| 11 | Fußleiste: Aktiv-Zustand | **behoben** | Petrol-hell hinterlegte Pille. Nebenwirkung siehe Kann. |

**Kann**

- Schrift 13 px bei Bildnachweisen und Fußleiste, 15 px bei Etiketten: **nicht geändert**.
- „Entdecker“-Etikett: **behoben**, jetzt schlichte Anzeige.
- Gedrehter Text: **nicht behoben**, neu beim Stempel („Gelöst!“ ist −10° gedreht).
- Weltfarbe mit Symbol statt Foto bei „Wissenschaft & Weltall“: **teilweise**, jetzt ein gezeichnetes Mondphasen-Bild, das als Platzhalter erkennbar ist.

## 3. Neue Befunde

### Muss
Keine blockierenden Fehler gefunden. Keine Überbreite (0 px in allen 20 Kombinationen), kein abgeschnittener Text. Die gemeldeten `overflow:hidden`-Fälle sind gewollt (Bühne, Dekorlinien in `.ohnefoto`).

### Soll

1. **Rose berührt Titel bei Zwischenbreiten (Datei `c.css`, `.foto .rose`, `@media (min-width:900px)`).** Bei etwa 900 bis 1100 px ragt die 200-px-Rose mit `left:-78px` über den Titelrand und berührt das „e“ von „Kaiserpinguine“ (`rose-1024.png`; Messung: Textrand 494 px, Roselinks 469 px; bei 1280 bis 1440 px bleiben 0 bis 4 px Abstand, `rose-1280.png`). Abhilfe: `left:-56px` oder Rose 160 px. Alternativ `.frage` mit `max-width:11ch` begrenzen. Außerdem: Die Rose sitzt fest über der Foto-Ecke, bei anderen Fotos prüfen (Motiv rechts oben).
2. **Start-Foto wirkt weich (Datei `c-start.html`).** Das Muster lädt `emperor-penguin-640.webp` für bis zu 531 px Breite (1440 px, `c-start-1440.png`). Die App hat `-700` und `-640`. Im echten Bau `srcset` bis mindestens 960 px (laut Projekt liegen Fotos sonst in 320/640/960) und passenden `sizes`-Wert. Den Ausschnitt nicht über 4:3 hinaus beschneiden, sonst vergrößert sich das Motiv.
3. **„Il“ in Bricolage fett (780) bleibt mehrdeutig (`c.css`, `h1.frage`, `.karte h1`).** `glyphen-c.png`: „Il“ und „I1“ sehen fast gleich aus, „Igel/Insel/Ilse“ prüfen. Abhilfe: für Titel Gewicht 720 bis 740 statt 780 oder bei Eigennamen mit „I“ Andika fett; vor der Wahl mit echten Titeln testen.
4. **Schimmer liegt über dem Foto der Kachel (`c.css`, `.welt .bild::after`).** Im Standbild (`schimmer-standbild-1280.png`) legt sich ein heller Streifen (55 % Weiß) über Panda und Pyramide. Die VISION verlangt, dass der Effekt nie über Text oder Fotos liegt. Abhilfe: Schimmer auf `.etikett` und Rahmen beschränken, oder Deckkraft auf höchstens 25 % senken. Entscheidung des Nutzers, ob Glanz über dem Foto ausnahmsweise gewollt ist.
5. **Karte bei 700 bis 899 px einspaltig (`c.css`, `.karte`).** Das Foto (736 × 552 px) schiebt den Titel an den Bildschirmrand (`c-karte-768.png`). Abhilfe: wie auf dem Start zweispaltig ab 700 px, oder Foto 16:9 / `max-height:46vh`.
6. **Fußleiste: Fokusring klebt am Bildschirmrand (`c.css`, `.fuss a`).** Der 3-px-Ring und die 2 px Abstand reichen über den Rand und die Nachbarn (`fokus-fuss-390.png`, `fokus-c-start-390.png`). Der untere Teil ist abgeschnitten, drei Seiten bleiben sichtbar. Abhilfe: `.fuss a:focus-visible{outline-offset:-4px}`.

### Kann

1. **Stempel bei 320 px (`c.css`, `.stempel`, `.rueck`).** Der Rückmeldetext wird 4 Zeilen schmal (`c-spiel-320.png`). Abhilfe: Stempel bei unter 360 px auf 72 px verkleinern. Text im Stempel nicht drehen, nur das Zeichen (Rand und Haken).
2. **Dreifache Bestätigung.** Haken an der Antwort, Haken bei „Richtig!“ und Stempel „Gelöst!“. Das ist für Kleine fein, für 12- bis 14-Jährige etwas viel. Abhilfe: bei richtiger Antwort „Richtig!“ ohne Haken lassen oder Stempel nur am Spielende.
3. **Fußleiste: aktiver Eintrag springt 8 px tiefer (`c.css`, `.fuss a[aria-current] .ico`).** Die Pille ist 30 px hoch gegen 22 px, das Wort „Spielen“ sitzt tiefer als die anderen (`c-spiel-390-ganz.png`). Abhilfe: alle Symbole in eine 30-px-Box setzen.
4. **Schimmer bei „Bewegung reduzieren“ komplett aus.** Es gibt dann keinen Zeige-Zustand mehr. Abhilfe: dort eine ruhige Alternative (z. B. Rand in Weltfarbe 100 %).
5. **Fortschrittsbalken und Kachelrand.** Das Balkengleis (Papier auf Weiß 1,2:1) und die 55-%-Tönung am Kachelrand haben unter 3:1. Wegen Text und Foto unkritisch.
6. **Foto-Zeilen.** Bildnachweis bleibt bei 13 px, für Eltern lieber 14 px.
7. **„Wissenschaft & Weltall“.** Das gezeichnete Mondphasen-Bild fällt neben den fünf Fotos auf. Es ist als Übergang im Muster ausgewiesen, im echten Bau durch ein freies Foto ersetzen.

## 4. Antworten zu Punkt 2 bis 5 der Aufgabe

**Tab-Fokus** (Montagen: `fokus-c-start-390.png`, `fokus-c-start-1280.png`, `fokus-c-karte-390.png`, `fokus-c-spiel-falsch-390.png`, `fokus-c-spiel-1280.png`). Alle Stopps zeigen einen 3-px-Ring mit weißem Innenring. Er ist an Knöpfen, Route-Zeilen, Welt-Kacheln (auch auf Foto), Fußleiste, Antworten und dem Link auf der blauen Kachel gut sichtbar. Gemessen: 3 px, solid, an allen 77 Stopps.

**Kontrast.** Alle realen Texte mindestens 4,5:1 (mein Skript meldete Fehlalarme bei `color-mix`-Hintergründen, handnachgerechnet: Zahl-Etikett auf Kachel etwa 5,5:1). Weißes Symbol auf Weltfarbe 4,3 bis 6,9:1. Falsch-Zustand: Tinte auf hellem Grund 11,2:1, roter Rand 4,5:1.

**Zustand „noch nicht richtig“** (`c-spiel-falsch-390-ganz.png`, `c-spiel-falsch-1280.png`). Klar, aber nicht beschämend: rotes Kreuz, heller Grund, dann ein ruhiges Petrol-Feld mit „Noch nicht ganz. Versuch es noch einmal!“ und „Tipp ansehen“. Die anderen beiden Antworten bleiben voll sichtbar mit Rand und Schatten, also eindeutig antippbar. Die falsche Antwort bleibt ebenfalls antippbar, was zum „weiterprobieren“ passt. Mir fehlt nur ein deutliches Wort „warum nicht“ an der falschen Antwort, das ist in der App Inhalt, nicht Design.

**Schimmer und Stempel.** Der Schimmer ist schön und dezent (`schimmer-hover-390.png`, `schimmer-standbild-1280.png`). Er liegt allerdings über dem Foto (Soll 4). Der Stempel drückt sich einmal auf (0,45 s) und bleibt dann ruhig. Bei `reducedMotion:'reduce'` gemessen: Stempel `animation:none`, Deckkraft 1, Rose `animation:none`, Schimmer `display:none`, auch beim Hover. Ruhig und bedienbar.

## 5. Urteil

**C trägt.** C behebt alle fünf Muss- und acht von elf Soll-Punkten sauber, zwei teilweise (Soll 3, Soll 8), keiner offen. Für 5- bis 10-Jährige trägt die Mischung: Foto-Kacheln, Stempel, orange Nadel, große Tippflächen, eine Hauptaktion je Bildschirm, ruhige Rückmeldung bei Fehlern. Für 12- bis 14-Jährige wirkt sie nicht kindisch, weil Papier, Höhenlinien, Haarlinien-Ränder und Bricolage ruhig bleiben. Der Stempel ist die kindlichste Stelle, aber klein und dezent genug.

**Was an C schwächer ist als A oder B**
- Gegenüber A: mehr Elemente (Stempel, Haken, Stand-Zähler, drei Rückmelde-Zeichen), deshalb weniger Ruhe auf der Spielseite.
- Gegenüber B: weniger Überraschung. Die Kacheln sind kein Sticker, der Stempel ist kleiner. Das ist für Kleine weniger „wow“, wurde aber bewusst gegen Lautstärke getauscht.
- Gegenüber beiden: Es gibt zwei neue Ausreißer, den Schimmer über Fotos (Verstoß gegen VISION, Soll 4) und die Rose, die bei 1024 px den Titel berührt (Soll 1).

**Empfehlung:** C als Richtung nehmen. Vor dem Umbau Soll 1, 4, 5 und 6 beheben, dann einen echten Test mit `spieltester` auf einem Tablet (768 px) und Telefon (320 px).

## 6. Nicht geprüft

- Bewegung in Echtzeit (nur Zustandswerte per Skript und Standbilder; Schimmer-Tempo und Stempel-Wirkung nicht beurteilt).
- Echte Geräte, iOS-Safari, Firefox, WebKit, Bildschirmleser (nur Chromium).
- Text-auf-Foto-Kontrast (Etikett „Ostantarktis“, Pin) nur nach Augenschein: weißer Grund, dunkle Schrift, unkritisch.
- Dunkelmodus, 200 % Schrift, Landscape auf dem Handy.
- Reaktionen echter Kinder; die Aussagen zu 5- bis 10-Jährigen und 12- bis 14-Jährigen sind Einschätzungen, kein Kindertest.
- Zustände „Tippen und Halten“ (Pressed) nur als Hover geprüft.
- Muster-Seiten sind statisch; „Karten 14 von 204“ ist ausgedacht.
