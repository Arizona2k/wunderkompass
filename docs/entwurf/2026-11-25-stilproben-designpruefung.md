# Design-Prüfung der Stilproben A und B

Helfer: `design-pruefer` (sonnet/high), 25.11.2026. Statische Muster in Chromium, 320 bis 1440 px. Eigene Bilder in `.qa-output/stilproben/pruefung/` (nicht in Git).

Geprüft mit den vorhandenen Aufnahmen plus eigenen Messungen in Chromium bei 320, 390, 768, 1280 und 1440 px: Überbreite, Tippflächen, Schriftgrößen, Kontrast (WCAG 2.x) und Tab-Fokus. Eigene Ausgaben liegen in `/home/user/wunderkompass/.qa-output/stilproben/pruefung/` (`glyphen.png`, `fokus-montage.png`, `m320.png`, `m768a.png`, `m768b.png`, `k1440.png`, `s1440.png`, `b-spiel-390-unten.png`). Keine Projektdatei geändert.

## 1. Gesamteindruck je Breite

- **320 px:** A zeigt schon im ersten Bildschirm Frage, Knopf und halbes Pinguinfoto. B zeigt nur Gruß-Etikett, Frage und zwei Knöpfe, das Motiv fehlt im ersten Bildschirm. Der „Richtig!“-Stempel in B zwingt „Von der Sonne“ in zwei Zeilen.
- **390 px:** A ist aufgeräumt: Frage, ein klarer dunkler Knopf, Foto. B ist fröhlicher, hat aber vier Elemente vor dem Foto, und das Foto beginnt erst bei etwa 60 % der Höhe. In B ist die Wissenskarten-Kachel im Spiel kaputt (Symbol überdeckt Text).
- **768 px:** Beide sind einspaltig mit großem Titel, das Foto ist nur halb im ersten Bildschirm. Das ist vertretbar, aber auf dem Tablet wird der Platz nicht genutzt (siehe Soll 8).
- **1280 px:** A wirkt ruhig und hochwertig, wird aber oben von der Kompassrose beschnitten. B ist lebendig und gut gegliedert, die Welten-Kacheln sind stark.
- **1440 px:** Beide halten die Maximalbreite 1200 px sauber, keine seitliche Überbreite (0 px in allen 30 Kombinationen).

## 2. Befunde

### Muss

1. **B, Grandstander „u“ gleicht „v“.** Datei `/home/user/wunderkompass/.qa-output/stilproben/pruefung/glyphen.png` und `b-start-390.png`: „Natur“ liest sich „Natvr“, „Mund“ „Mvnd“, „pinguine“ „pingvine“. Das ist für Leseanfänger ein echter Fehler. Abhilfe: Grandstander komplett streichen. Andika fett für Überschriften ist eindeutig (`glyphen.png`, dritte Zeile).
2. **B, Spiel, 390 px, Wissenskarten-Kachel (`.ohnefoto`).** Datei `pruefung/b-spiel-390-unten.png`: Der weiße Kreis (88 px) liegt über „Dazu gibt es eine Wissenskarte“, die ersten Buchstaben sind verdeckt. Abhilfe: Kreis oben links und Text mit `justify-content:flex-end` bei kleiner Höhe nicht kollidieren lassen, z. B. Kreis 64 px oder `min-height` ≥ 260 px. Die Kachel darf nur Text oder Symbol berühren, nie beides.
3. **A, Kompassrose bei 1280 und 1440 px beschnitten.** Dateien `a-start-1280.png` und `a-start-1440.png`: Der Ring ist oben an der Kopfzeile abgeschnitten (`.buehne{overflow:hidden}` mit `top:-70px`). Abhilfe: Rose nach innen (`top:-20px`) oder `overflow:visible` mit mehr Abstand oberhalb. Rose und Foto danach je Fotoausschnitt prüfen.
4. **Tippflächen unter 48 px (Messung per Skript).**
   - A: Textlinks im Stil `.weg`, nämlich „Andere Frage“ (112 × 21), „Spiel beenden“ (120 × 21), „Karte öffnen“ (97 × 19 und 256 × 28), außerdem der Pfad „Die Tierwelt“ (24 px hoch).
   - B: „Spiel beenden“ (113 × 17), „Karte öffnen“ (100 × 16), „Die Tierwelt“-Reiter 46 px.
   - Beide: Logo-Link 30 bis 40 px.
   - Abhilfe: `min-height:48px` mit Innenabstand (`display:inline-flex;align-items:center`), die gestrichelte oder unterstrichene Linie dann am Text lassen. Bei A ist „Andere Frage“ als Sekundärknopf besser, wie in B.
5. **Beide, ausgegraute Antworten sind zu blass und der Fokusring verblasst mit.** Kontrast 2,95:1 (A) und 3,09:1 (B) bei 18 px Text. `opacity:.5` wirkt auf den ganzen Knopf, daher ist auch der Fokusring halb durchsichtig (`pruefung/fokus-montage.png`, 3. und 6. Bild: blasser Ring um „Von brennenden Wolken“). Falsche Antworten sind außerdem Lernstoff („warum nicht“). Abhilfe: keine `opacity`, sondern feste Farben mit mindestens 4,5:1 (A: `--tinte-2` #4A5F70 auf Weiß 5,8:1; B: `--tinte-2` #4B5578), Rand dünner oder gestrichelt, damit „schon beantwortet“ erkennbar bleibt. Fokusring mit voller Deckkraft.

### Soll

1. **A, Randkontrast der Bedienelemente nur 1,4 bis 1,6:1** (`--linie` #C6D1C8 auf Weiß 1,57:1, auf Papier 1,38:1; WCAG 1.4.11 verlangt 3:1). Betrifft Antwortknöpfe, „Stimmt / Stimmt nicht“, Zweitknöpfe, die runden Kopfknöpfe, die aufklappbaren Kästen. Ein Kind sieht die Antwortfelder nur schwach. Abhilfe: Rand für Bedienelemente auf mindestens #7F9086 (3:1) oder Fläche leicht getönt; `--linie` nur für Trennlinien.
2. **B, „Richtig!“-Stempel.** Text 3,45:1 (#1F9D55 auf Weiß, 17 px). Abhilfe: #146B3A wie bei `.rueck b` (dort schon dunkler). Bei 320 und 390 px schiebt `padding-right:100px` den Antworttext in zwei Zeilen und der Stempel ragt über Ober- und Unterkante der Antwort (`m320.png`, 6. Bild; `s1440.png`). Bei längeren Antworten wird das schlimmer. Abhilfe: Stempel unter oder über die Antwort legen, nie in die Textzeile, oder kleiner (56 px) am Rand der Karte. Stempel nicht über Antworttext.
3. **A, Überschriftenschrift Bricolage mit −0,03 bis −0,015 em.** `glyphen.png`, erste Zeile: Großes „I“ und kleines „l“ sehen gleich aus („Il1“), „Illustration“ ballt sich. In Titeln wie „Igel“, „Insel“, „Ilse“ ist das für Leseanfänger unnötig. Abhilfe: Zeichenabstand auf 0 bis −0,01 em, Titel mit Eigennamen testen; oder Andika fett für kurze Kinder-Überschriften.
4. **A, aktueller Schritt als rotes Dreieck im Kreis** (`.fortschritt i.jetzt`, `a-spiel-390.png`). Das liest sich wie ein Warnzeichen. Rot ist in A außerdem Nadel- und Navigationsfarbe, und für „falsch“ ist die Farbe frei geblieben, ein Konflikt später. Abhilfe: Nadel als kleine Kompassnadel in Orange oder Petrol, Rot nur für „falsch“ (Rückmeldung, nicht beschämend) reservieren. Ein Falsch-Zustand fehlt in beiden Proben, siehe „Nicht geprüft“.
5. **A, Welten als weiße Liste mit 36-px-Farbfeld** (`a-start-1440.png`). Die Welten sind die Hauptnavigation für Kinder, hier aber das unscheinbarste Element: keine Fotos, nur Symbole. Das passt nicht zu „bildstark“ in `VISION.md`. Abhilfe: größere Kacheln mit Foto und Weltfarbe (das ist genau die Idee aus B, siehe Empfehlung).
6. **VISION.md verlangt Akzente in Orange und Petrol, Glanz beim Zeigen.** A hat weder Orange noch Petrol (Nachtblau, Wasserblau #1F6FA8, Rot, Grün), B hat Orange, aber kein Petrol und dazu viele harte, dunkle Ränder. Keine der Proben zeigt den Lichtschimmer. Abhilfe vor der Wahl: Petrol statt Wasserblau (Wege, Links, Fokus) und Orange statt Rot als Nadel, dann ist A näher an der Kompass-Identität der VISION.
7. **B, erster Bildschirm bei 320 px ohne Motiv.** `m320.png`, 4. Bild: „Frage des Tages“, Frage und zwei gestapelte Knöpfe füllen den Bildschirm. Abhilfe bei B-Anteilen: Knöpfe nebeneinander, Etikett einsparen oder Foto höher.
8. **Tablet 768 px beider Stile.** Die Titelbühne ist einspaltig, das Foto hängt halb unter der Leiste (`m768a.png`). Abhilfe: Zweispalter ab etwa 700 px oder Foto zuerst mit 16:9 oberhalb der Frage.
9. **Fokus auf dunklem Grund.** A-Ring (#1F6FA8) auf Nachtblau-Fläche nur 2,5:1, B-Ring (#2F6FE0) auf Tinte 3,1:1. Der 3-px-Ring liegt zwar mit 3 px Abstand auf hellem Grund und ist daher sichtbar, an Rändern von dunklen Knöpfen und aktiven Menüpunkten ist das aber knapp. Abhilfe: Ring zweifarbig (weiß innen, dunkel außen) oder einheitlich Orange mit dunkler Innenlinie.
10. **Desktop-Navigation 40 bis 42 px hoch** (A und B bei 1280). Mit Maus vertretbar, aber für Touch-Laptops auf 48 px bringen.
11. **A, Fußleiste: Aktiv-Zustand nur ein kleines rotes Dreieck und fettere Schrift** (`a-start-390.png`). Wirkt für Kleine schwach. B markiert mit dunkler Kachel, deutlich besser. Das kann man in A übernehmen (Hinterlegung in Petrol-hell), ohne den Rest zu verändern.

### Kann

- **Schriftgrößen:** Fließtext 18 bis 20 px, Zeilenlänge unter etwa 60 Zeichen, gut. Unter 16 px liegen nur Etiketten und Nachweise (13 bis 15 px, Fußleiste 13 px, Bildnachweis 13 px). Die Fußleiste bei 320 px ist mit 13 px noch lesbar, aber an der Grenze; Bildnachweise 14 px wären freundlicher für Eltern.
- **B, gedrehte Fotos und Beschriftungen** („Ostantarktis“ im Sticker schräg, Steckbrief ±1°): schräger Text kostet Leseanfänger etwas Lesefluss. Foto drehen ja, Text nicht.
- **A und B, „Entdecker“-Etikett** sieht wie ein Knopf aus, ist aber nur eine Anzeige. Als Anzeige schlichter (ohne Rand) oder wirklich antippbar machen.
- **A, Kompassrose bei 320 px:** Sie liegt auf der rechten Fotoecke und deckt den Rand ab, aber nichts Wichtiges. Bei anderen Fotoausschnitten nachprüfen.
- **B, Welt-Kachel „Wissenschaft & Weltall“ hat statt Foto nur Symbol** und wirkt dadurch uneinheitlich gegenüber den fünf anderen. Auch in der Empfehlung beachten.

## 3. Was gut ist (erhalten)

- Keine Überbreite, kein Abschneiden von Text; Umbrüche in Titeln sind brauchbar („Kaiser-/pinguine“ per weichem Trennzeichen).
- Andika als Fließtext (eindeutiges a, l, I, 1) und `hyphens:manual`.
- Kontrast der Normaltexte in beiden Stilen durchweg ≥ 4,5:1; Weltfarben A: weiße Symbole auf Farbfeld 4,2 bis 6,3:1; B: dunkle Schrift auf weißen Etiketten.
- Starke Fotowirkung auf Start und Karte; einheitliche Rahmen (A: 22 px Rundung, B: Sticker).
- A: Route als gestrichelter Weg, ruhige Hierarchie, ein eindeutiger Hauptknopf; Fokusring sichtbar an jedem Bedienelement (Tab geprüft, 3 px).
- B: Stempel-Moment, Fortschritt mit Häkchen, dicker Fußleistenzustand, die Welten-Kacheln mit rundem Foto-Sticker.
- Bei reduzierter Bewegung bleibt alles ruhig (Kompassnadel und Stempel haben `animation:none`).

## 4. Gesamturteil und Empfehlung

**Besser für 5 bis 10 Jahre und ohne Peinlichkeit für 12 bis 14: A**, mit Korrekturen. B ist für Kleine anfangs fröhlicher, hat aber ein echtes Leseproblem (u wie v), ist näher am Neo-Brutalismus-Trend (dicke Ränder, harte Schatten) und wirkt für 12- bis 14-Jährige kindlich. Außerdem ist B optisch laut (Gelb, Pink, Violett, Orange, Rot gleichzeitig), was „Orange und Petrol sparsam“ aus der VISION widerspricht.

**Die vorläufige Empfehlung (A plus bunte Welt-Kacheln und Stempel aus B, Überschriften Bricolage, Hauptknopf Tinte) bewerte ich: in der Richtung richtig, aber nicht so übernehmbar.**

- **Welt-Kacheln: ja, aber übersetzen.** Die Kacheln aus B sind mit dicken dunklen Rändern, harten Schatten und gesättigten Farben in B-Sprache gebaut. In A (Haarlinien, gedämpfte Kartenfarben) würden sie fremd wirken. Besser: Kacheln im Stil von A mit gedämpfter Weltfarbe, größerem Foto (nicht nur 64-px-Kreis) und Etikett, ohne harte Kante. Sonst entsteht ein Mischstil aus zwei Systemen. Die Farbe soll bunt, aber im Kartenton bleiben.
- **Stempel: ja, aber anders platziert.** Der Stempel passt zum Entdeckerpass (Sammeln). Er braucht aber einen festen, kollisionsfreien Platz (siehe Soll 2), und zur Sprache von A passt ein kleiner runder Stempel in Petrol oder Waldgrün mit Häkchen und Text „Richtig!“, nicht der doppelte Rand von B. Er ist ein Belohnungsmoment, also nur bei richtiger Antwort, ohne Alternative für „falsch“.
- **Hauptknopf Tinte statt Orange:** Das ist nachvollziehbar, widerspricht aber der VISION („Akzente Orange und Petrol“). Besser: Hauptknopf in Petrol, Orange nur als sparsamer Akzent (Nadel, aktiver Schritt, Stempel). Dann hat A endlich beide VISION-Farben.
- **Überschriften Bricolage: ja, mit Zeichenabstand 0 bis −0,01 em**, Test mit „Il“ und „Igel“. Fallback: Andika fett für kurze Titel (Spiele, Fragen).
- **Kritik an der Empfehlung selbst:** Sie behandelt „Freude“ als eine Frage von Kacheln und Stempel. Für 5-Jährige trägt A aber nur, wenn die Rückmeldung groß und belohnend ist (Stempel, Kompassnadel dreht, kleine Animation bei richtiger Antwort) und die Fotos groß bleiben. Das ist in der statischen Probe nicht prüfbar. Außerdem steht die Frage nach „Glossy“ (Lichtschimmer beim Zeigen) aus VISION.md in beiden Proben unbeantwortet.

**Empfohlene Reihenfolge:** A als Grundlage; vor der Freigabe die fünf Muss-Punkte beheben (v. a. Tippflächen der Textlinks, Rand- und Antwortkontrast, Rose beschnitten); Petrol/Orange festlegen; Welt-Kacheln und Stempel in A-Sprache neu zeichnen und als dritte Probe zeigen (Start 320/390/1280 und Spiel mit Richtig- und Falsch-Zustand), dann `spieltester` und `kinder-redaktion` darüber.

## 5. Nicht geprüft

- Bewegung und Übergänge (Stempel, Nadel, Kartenwechsel, Antippen), nur reduziert aufgenommen.
- Falsch-Zustand einer Antwort, Hover/Pressed-Zustände, Dunkelmodus, Schrifteinstellungen des Systems (z. B. 200 % Schrift).
- Echte Geräte (iOS-Safari-Rendering der Fonts, Safe Areas, Touch-Gefühl), Firefox, WebKit, Bildschirmleser.
- Kontrast auf Fotos (Etikett „Ostantarktis“, weißer Text über Foto) nur nach Augenschein, nicht gemessen.
- Reaktionen echter Kinder; die Aussagen zu Kleinen und Älteren sind Einschätzungen, kein Kindertest.
- Messskript prüft Kontrast nur für Text auf einfarbigen Flächen; Text auf Bildern und Verläufen blieb unbewertet.
