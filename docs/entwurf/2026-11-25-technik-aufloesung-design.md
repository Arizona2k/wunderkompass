# Technik-Auflösungen: Design-Prüfung (25.11.2026)

Helfer: `design-pruefer` (sonnet/high), lokale Vorschau des Technik-Stands (Chromium, Teilprüfung). Nur Befunde, entschieden hat Claude (Abschnitt „Entscheidungen“ am Ende).

**Design-Prüfung Technik-Detektiv, Auflösung und „Was ist neu?“ (Chromium, Teilprüfung)**

Alle Bilder liegen in `/home/user/wunderkompass/.qa-output/design-technik/`.
Gemessen habe ich 320, 390, 768, 1280 und 1440 px, dazu 320×568 mit großer Schrift (Kamera) und „Was ist neu?“ in 390 und 1280 px.
Kein waagerechtes Scrollen und nichts hinter der unteren Leiste.

**Hinweis zum Aufbau:** Die vorgegebene Runde ging nicht ganz. `invention-telephone` gibt es im Spielvorrat nicht (es heißt `invention-phone`). Mit dem ungültigen Eintrag wurde die ganze Runde verworfen und neu gelost. Für die Bilder habe ich `invention-phone` genommen und die Session vollständig gesetzt (`stufe`, `vorige`, `geschafft`, `index`).

**Gesamteindruck**
- **320 px:** Der Kasten füllt fast den Bildschirm (333 px hoch), bleibt aber vollständig über der Leiste. Mit großer Schrift und der Kamera (180 Zeichen) sind es 393 px, auch dann passt alles knapp über die Leiste.
- **390 px:** Stimmig, der Text hat vier bis fünf Zeilen, Abstände ruhig, Kasten endet 12 px über der Leiste.
- **768 px:** Gut, der Text umbricht auf zwei Zeilen. Der Kasten ist 722 px breit, das ist an der Grenze.
- **1280 und 1440 px:** Der Kasten ist 1000 px breit, die Zeilen werden zu lang (siehe Soll 1). Sonst sauber.

**Befunde**

*Muss:* keine.

*Soll*
1. **Zeilenlänge, 1280 und 1440 px (`technik-richtig-1280.png`):**
   - Der Auflösungstext ist 960 px breit, das sind etwa 110 bis 115 Zeichen pro Zeile. Bei 768 px sind es etwa 95. Für Kinder zu lang; Richtwert sind 60 bis 75 Zeichen.
   - Vorschlag: `max-width` auf etwa 65ch für `.lab-feedback p`.
   - Das ist ein Baustein für alle Spiele, also wirkt es auch bei „Wer war das?“ (`vergleich-people-richtig-1280.png` zeigt dasselbe).
2. **Inhalt der Falsch-Rückmeldung, alle Breiten (`technik-falsch-390.png`, `technik-falsch-320.png`):**
   - Der Text lautet „Worum geht es im Text? Überlege bei jeder Erfindung: Wobei hilft sie den Menschen?“.
   - Es gibt keinen „Text“. Die Frage ist ein Problem oder eine Forscherfrage. Das verwirrt Leseanfänger.
   - Vorschlag: „Worum geht es in der Frage?“ oder „Welches Problem soll gelöst werden?“. Das ist inhaltlich Sache von `kinder-redaktion`.

*Kann*
3. **Hierarchie „Richtig!“ gegen Text (alle Richtig-Bilder):**
   - „Richtig!“ hat 18 px und ist fett, der Text 16 px. Beide haben dieselbe grüne Farbe (Kontrast 5,7:1, AA erfüllt).
   - Die Abstufung trägt, ist aber schwach. Es gibt kein Symbol und keine Farbabstufung.
   - Vorschlag: etwa 20 px, oder ein kleines Häkchen vor „Richtig!“. Prüfen, ob das für „Noch nicht ganz“ auch passt.
4. **Ausrichtung der Knöpfe, 390 bis 1440 px (`technik-richtig-390.png`):**
   - „Erklärung vorlesen“ (44 px hoch) und „Nächste Aufgabe“ (48 px) liegen nebeneinander, die Mitten sind etwa 4 bis 8 px versetzt. Der Textknopf wirkt dadurch leicht zu tief.
   - Vorschlag: `align-items: center` in der Zeile.
   - Der Textknopf hat nur 14 px Schrift (Tippfläche 141×44 passt). Etwas größer wäre leserlicher.
5. **Abgeblendete falsche Antworten nach „Richtig!“ (alle Richtig-Bilder):**
   - Sie haben `opacity .65`, das ergibt etwa 2,9:1 Kontrast. Als deaktivierte Elemente ist das nach WCAG ausgenommen.
   - Für Eltern, die mitlesen, sind sie aber blass. Optional `opacity` auf etwa .8.
6. **Kästen:** Der Kasten wirkt mit dem kurzen Text weder leer noch voll. Besonders bei 768 bis 1440 px sitzt er mit dem Text und der Knopfzeile gut proportioniert.
7. **„Was ist neu?“, Vorgängereintrag (`was-ist-neu-390.png`):** Der Titel „„Richtig!“ siehst du jetzt gleich ganz“ wirkt unvollständig, es fehlt am Ende vermutlich „unten“ oder Ähnliches. Das ist nicht der neue Eintrag, aber direkt darunter sichtbar. Außerdem betreffen die ersten drei Einträge vom selben Tag alle das Spiel-Feedback, vielleicht zusammenfassen.

**Fokus, Bewegung, Konsistenz**
- **Tastatur:** Nach Enter auf die richtige Antwort springt der Fokus auf „Nächste Aufgabe“. Der Fokusrahmen (3 px petrol) ist klar sichtbar und liegt über der Leiste, in 390 px und in 320 px mit großer Schrift (`fokus-richtig-390.png`, `fokus-richtig-320-reduziert-gross.png`).
- **Maus oder Touch:** Kein großer Rahmen um „Richtig!“ oder den Kasten.
- **„Bewegung reduzieren“** (320 px, große Schrift): ruhig und bedienbar, nichts springt.
- **Konsistenz mit „Wer war das?“:** Gleiche Bausteine (`lab-feedback`, `speech-button`, `primary-button`), gleiche Maße und Abstände (`vergleich-people-richtig-390.png` und `-1280.png`). Der Technik-Kasten ist stimmig.

**„Was ist neu?“ (`was-ist-neu-390.png`, `was-ist-neu-1280.png`)**
- Der neue Eintrag „Technik-Detektiv: So geht das“ steht ganz oben mit Lupe in einem orangen Kreis. Die Karte ist 390 px sauber umbrochen.
- Die Zeile ist bei 1280 px mit etwa 70 Zeichen angenehm. Der Text ist verständlich und kurz.
- Kein Überlauf.

**Was gut ist (erhalten)**
- Kurze Auflösung, 4 bis 5 Zeilen auf dem Handy.
- Fokusführung auf „Nächste Aufgabe“.
- Tippflächen mindestens 44 px.
- Die Karte ist über die Leiste sichtbar auch bei 320×568 mit großer Schrift.
- Konsistenz der Kästen zwischen den Spielen.

**Nicht geprüft**
- Firefox und WebKit, echte Geräte, Bildschirmleser.
- Die Stufen Profi und Experte.
- Weitere Aufgaben außer Rakete und Kamera.
- Das Hover- und Glanz-Verhalten der Kacheln.
- 1440 px ist nur über Messwerte geprüft (gleiches Layout wie 1280 px). Das Bild `technik-richtig-1440.png` habe ich nicht angesehen.

## Entscheidungen (Claude, 25.11.2026)

- **Soll 1 (Zeilenlänge) im Technik-PR:** Text im Rückmeldekasten höchstens etwa 65 Zeichen breit (`kern.css`). Weil das `kern.css` ändert, laufen danach `core` und `offline-cold-full`.
- **Soll 2 (Tipp-Satz „Worum geht es im Text?“) im Technik-PR:** `karten-autor` schreibt Fassungen, `kinder-redaktion` und `stufen-pruefer` prüfen. Der Spieltest hat denselben Satz gemeldet.
- **Kann 3, 4 und 5** („Richtig!“ deutlicher, Knöpfe mittig ausgerichtet und Vorlesen-Schrift ab 16 px, Deckkraft der nicht gewählten Antworten) kommen in den [Bauplan für Umbau-Schritt 1](2026-11-25-umbau-schritt-1-bauplan.md), weil dort Knöpfe, Antworten und Farben neu gebaut werden.
- **Kann 6:** bleibt so.
- **Kann 7:** keine Änderung. Der Titel „„Richtig!“ siehst du jetzt gleich ganz“ ist ein ganzer Satz und von der Kinder-Redaktion geprüft. Die drei Einträge vom selben Tag betreffen verschiedene Spiele und bleiben getrennt.
- **Hinweis zum Aufbau:** Der falsche Name `invention-telephone` stand in Claudes Auftrag, nicht im Produkt.
