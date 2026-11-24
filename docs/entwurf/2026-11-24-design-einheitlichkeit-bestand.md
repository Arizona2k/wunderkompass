# Bestandsaufnahme Einheitlichkeit aller Bereiche (24.11.2026)

Helfer: `design-pruefer`, Auftrag nach dem Wunsch des Nutzers „gleichmäßig, einheitlich … Lass mich das nicht jedes Mal sagen“. Grundlage für den Design-Schritt (zusammen mit [Ideen für ein modernes Design](2026-11-24-design-ideen.md)). Bericht unverändert. Die Screenshots lagen nur im Container (`.qa-output/design-bestand/`, nicht in Git).

# Bestandsaufnahme Einheitlichkeit (Design-Prüfer, 24.11.2026)

Geprüft: Stand `cf15116`, frisch gebaut, eigene Vorschau auf Port 4491 (danach beendet). Chromium, 390 und 1280 px bei deviceScaleFactor 1, Bewegung reduziert. Dazu ein Test auf waagerechtes Scrollen bei 320 px.

Screenshots liegen in `/home/user/wunderkompass/.qa-output/design-bestand/` (143 Dateien). Benennung: `<name>-<breite>-t<n>.png` sind Abschnitte einer ganzen Seite (je 1800 px hoch bei 390, 1700 px bei 1280), `<name>-<breite>.png` ist der erste Bildschirm.

Kürzel:
- `home`, `welten`, `games`, `labs`, `journeys`, `buch`, `neu`
- `w-<welt>` mit animals, history, people, inventions, buildings, science (Weltenseiten)
- `k-<...>` Wissenskarten: tier, zeit, zeit2, person, erf, erf2, bau, wiss, wiss2
- `s-memory`, `s-wer`, `s-stimmt` (Spiele), `l-vulkan` (Labor), `r-reise` (Kapitel)
- `pass-390`, `pass-1280` (Dialog), `globe-*`

Zahlen zu Bildern, Tippflächen und Kontrast sind unten nur genannt, wo ich sie gemessen habe.

## Gesamteindruck

- **Kern (Wissenskarte, Kopfzeile, Navigation, Weltenübersicht, Weltenseiten):** gehört erkennbar zusammen. Es gibt Welt-Akzentfarben, runde Karten und einheitliche Fragekästen. Der Eindruck bricht an den Bildern.
- **Bilder:** Jede Stelle rahmt sie anders (Vollbreite, mittig mit grauen Seiten, Textband, Zeichnung, Foto mit eigener Bildunterschrift). Das ist der größte Bruch.
- **Spiele, Labor, Wissensbuch, Entdeckerpass, untere Startseite:** noch im alten Stil. Es sind schlichte Textlisten oder KI-Vorschauzeichnungen, dazu Zähler und andere Knöpfe.
- **Waagerechtes Scrollen:** keines bei 320 px (13 Routen geprüft).

## 1. Tabelle je Bereich

| Bereich | Zustand | Auffälligste Brüche (Bild) |
|---|---|---|
| Kopfzeile / Navigation | neu | Auf dem Globus (`#globe`) ist "Start" aktiv, obwohl es kein Tab "Globus" gibt. Sonst einheitlich. `globe-390.png` |
| Startseite oben (Frage, Foto, Weltenkacheln) | neu | Die sechs Weltenkacheln zeigen sechs Bildarten: Foto-Ausschnitt, Pyramidenfoto, Porträt auf Beige, Fahrrad-Strichzeichnung, Brücke, braunes Kreis-Modell. `home-390-t1.png`, `home-1280-t1.png` |
| Startseite unten (ab "Alles hängt zusammen") | alt | Dieselben KI-Modellvorschauen kommen mehrfach vor: die Jahreszeiten-Skizze zweimal, die Gezeitenkurve dreimal. Die Fläche für Lernreisen zeigt ein Jaguar-Foto, das nichts mit Reisen zu tun hat. Die drei Teaser sind unterschiedlich gerahmt. `home-390-t2.png`, `home-390-t3.png`, `home-1280.png` |
| Welten-Übersicht (`#world`) | gemischt | Die Kachelbilder haben vier Rahmen: Elefant mit grauen Seitenstreifen, Pyramiden mit grauen Balken oben und unten, Porträt klein auf Tönung, Zeichnung mit dunkler Unterschriftsleiste. Die Wissensrouten darunter sind acht gleiche Textkästen ohne Bild. Der Zählerblock "Dein Weg als Weltentdecker" steht noch da. `welten-390-t1.png`, `welten-390-t2.png`, `welten-390-t3.png` |
| Weltenseiten (6 Welten) | gemischt | Tiere und Personen haben Fotos in grauen "contain"-Kästen. Zeitreise (33 von 34), Erfindungen (19 von 24), Bauwerke (9 von 16) und Wissenschaft (46 von 46) zeigen ein Textband statt Bild. Das Band hat den Text "Ein Modell zum Ausprobieren" oder "Benz-Patent: 1886". `w-history-390-t1.png`, `w-inventions-1280-t1.png`, `w-science-390-t1.png` |
| Wissenskarte (Kern) | neu, einheitlich | Der Kopf ist je nach Bild verschieden: Foto, Foto mit Beschreibung (Fahrrad), Text-Platzhalter mit Weltsymbol. Beim Platzhalter steht der Titel zweimal untereinander. `k-zeit-390-t1.png`, `k-wiss-390-t1.png`, `k-erf2-1280-t1.png` |
| Spiele-Übersicht (`#games`) | alt | 31 Spiele, nur 3 mit Vorschau. Die Vorschauen sind nachgezeichnete Oberflächen mit der Beschriftung "Spielkarten · KI-unterstützt". Das trifft nicht zu, es sind keine KI-Bilder. Alle anderen Einträge sind reine Textzeilen. Alle Einträge heißen "Noch entdecken". `games-390-t1.png`, `games-1280.png` |
| Spiele selbst | alt | Kein Bild und kein Foto, auch nicht bei "Eine Giraffe frisst Blätter von Bäumen". Doppelter Titel beim Memory ("Länder-Memory" und "Länder und Hauptstädte"). Memory-Karten sind Kompass-Symbole mit Zahl. `s-memory-390-t1.png`, `s-wer-390-t1.png`, `s-stimmt-390-t1.png` |
| Labor-Übersicht und Labor | alt | Alle Vorschauen sind KI-Zeichnungen mit je zwei Zeilen "Eigene Modellvorschau · KI-unterstützt / Momentaufnahme…". Der Zähler "0/11 Forscherstempel" und eine nackte Suchzeile stehen vorn. Im Labor steht ein Ausbruch-Knopf in dunklem Orange, die Schritte haben winzige Großbuchstaben-Zwischentitel. `labs-390-t1.png`, `labs-1280.png`, `l-vulkan-390-t1.png` |
| Lernreisen (`#journeys`) | gemischt, bildstark | Echte Fotos und Zeichnungen in einer Liste, aber nur 9 mit "cover", 7 mit "contain". Bei 1280 füllen die Bilder ihre Spalte nicht (342 von etwa 390 px breit). "Dein Lernweg · 0 von 16 Reisen geschafft" ist ein Zähler. `journeys-390-t1.png`, `journeys-1280.png` |
| Reise-Kapitel | gemischt | Textspalten haben drei verschiedene Breiten (800, 866, 946 px). Die Bildunterschrift lautet nur "Foto: NASA" ohne Lizenz. Sonst steht auf der Karte "Foto: Autor · Lizenz". "Kapitel 1 von 5" steht neben einer Kapitelkarte mit 6 Einträgen. `r-reise-1280-t1.png` |
| Wissensbuch | alt | Reine Textlisten, kein Bild, kein Weltsymbol. Eine eigene Kopfzeile mit Reitern. `buch-390-t1.png`, `buch-1280.png` |
| "Was ist neu?" | gemischt | Neue Einträge als Karten, aber nur ein Symbol je Eintrag, noch kein Motiv. Die Entwurfsvorgabe ist "Motiv je Eintrag". `neu-390-t1.png` |
| Entdeckerpass-Dialog | alt | Zähler (0/16, 0/31), "Entdeckerpunkte", Pokal "Neugieriger Entdecker", Abzeichen. Das widerspricht Teilschritt 5, der die Sammlung ohne Zahlen vorsieht. `pass-390.png`, `pass-1280.png` |

## 2. Brüche nach Wirkung sortiert

Reihenfolge: was Kinder und Eltern zuerst sehen, und wie oft.

1. **Bildrahmen uneinheitlich (Welten-Übersicht, Weltenseiten, Startseite).**
   - Ursache: Alle Listenbilder haben `object-fit: contain`. Es entstehen graue Seitenstreifen oder Balken, je nach Seitenverhältnis. Zu sehen bei Pyramiden, Löwe, Mauer und Porträts, auch bei Ada Lovelace mit weißem Passepartout. Die Kartenköpfe sind dagegen vollbreit.
   - Vorschlag: ein gemeinsamer Bildrahmen mit festem Seitenverhältnis (zum Beispiel 4:3, auf der Karte 16:10), `cover` und Fokuspunkt je Foto. Porträts bekommen einen Fokus auf das Gesicht, kein Zentrieren.
   - Aufwand: mittel (ein Baustein mit Fokuspunkt in den Foto-Daten, dann alle Listen umstellen).
2. **91 Karten zeigen ein Textband oder Symbol statt Bild.** Gezählt aus den Weltenseiten bei 1280 px: Zeitreise 33, Erfindungen 19, Bauwerke 9, Wissenschaft 30, dazu 16 mit kleiner Modellgrafik.
   - Das Band hat wechselnden Text ("Wichtiger Schritt: 1879"), der als Bild gelesen wird. Auf der Karte steht der Titel doppelt.
   - Vorschlag: bis die Bilder da sind, ein ruhiger einheitlicher Platzhalter ohne wiederholten Titel, mit einem kleinen Motiv statt Text. Das Datum gehört in den Steckbrief, nicht ins Bildfeld. Danach Bilder aus der Bildsuche einbauen (BACKLOG Punkt 26, Teilschritt 4).
   - Aufwand: klein für den Platzhalter, groß für die Bilder.
3. **Weltenkacheln (Start und Übersicht).** Fahrrad-Zeichnung und braunes Jupiter-Kreis-Modell stehen neben Fotos, obwohl die Fahrradkarte inzwischen ein Foto hat. Die Pyramiden stehen für Zeitreise und noch einmal für Bauwerke.
   - Vorschlag: sechs Kacheln gleicher Art, möglichst Fotos oder sechs gleich gemalte Motive. Die Pyramiden bleiben bei Bauwerke.
   - Aufwand: klein bis mittel.
4. **Untere Startseite wirkt aus alter Zeit.** Mehrfach wiederholte KI-Modellvorschauen, ein Jaguar-Foto bei "Lernreisen", Teaser ohne feste Form.
   - Vorschlag: auf die drei Einstiege reduzieren (Spielen, Labor, Reisen), jeder mit einem eigenen Foto. Die Frage "Eine Frage. Zwei Welten" mit der Erklärung nur auf der Karte lassen.
   - Aufwand: mittel.
5. **Spiele und Labore ohne Bild und mit falscher KI-Kennzeichnung.** 28 von 31 Spielen sind Textzeilen. Die Vorschauen heißen "KI-unterstützt", obwohl es nachgebaute Oberflächen sind.
   - Vorschlag: eine einheitliche Spielkachel mit Motiv, Titel, Altersangabe und einem Knopf. "KI-unterstützt" nur dort, wo es stimmt. Die Zeile "Momentaufnahme eines Modellzustands" streichen.
   - Aufwand: mittel bis groß.
6. **Zähler und Punkte sind noch sichtbar** (Pass-Dialog, Labor-Kopf, Lernreisen, Welten-Übersicht "Dein Weg als Weltentdecker", "Neue Abzeichen…"). Das ist ein Widerspruch zum Entwurf, Teilschritt 5.
   - Vorschlag: nach Teilschritt 5 vollständig entfernen. Bis dahin Welten-Übersicht und Pass vereinheitlichen.
   - Aufwand: Teil von Teilschritt 5.
7. **Wissensrouten** (acht gleiche Textkästen mit grünem "Reise beginnen →" und Kompass-Symbol).
   - Vorschlag: als Kacheln mit Foto der ersten Station, gleiche Kachel wie bei Lernreisen.
   - Aufwand: klein.
8. **Knopf- und Linkstile sind nicht einheitlich.**
   - Mehrere Hauptknöpfe: petrolfarbene Vollknöpfe ("Gezeiten erforschen", "Weiter entdecken"), dunkelorange Vollknöpfe (Labor), weiße Umrandungen ("Vorlesen", "Was ist neu?"), Textlinks mit Pfeil. Die Pfeil-Links heißen "Entdecken", "Noch entdecken", "Reise beginnen", und je Welt in anderer Farbe.
   - Der Stil von "Entdecken" ist auf den Karten mit Pin-Symbol, in der Übersicht ohne.
   - Vorschlag: genau zwei Stufen (Hauptknopf und ruhiger Knopf) und eine Pfeil-Linkart. Ein Wort für die Handlung.
   - Aufwand: mittel.
9. **Überschriften-Muster.**
   - Kleiner Großbuchstaben-Vorspann: "FRAGEN, BILDER UND ZUSAMMENHÄNGE" (Welten), "DEINE WISSENSWELT" (Spiele, Labor, Buch), keiner bei Lernreisen und Neuigkeiten.
   - "Spielplatz" heißt der Bereich, im Reiter steht "Spielen". Die Reise heißt "Lernreisen" und "Reisen", das Labor "Forscherlabor" und "Labor".
   - Vorschlag: ein Kopfbaustein (Titel, ein Satz, optional Bild) für alle Übersichten. Reiter und Titel gleich benennen.
   - Aufwand: klein.
10. **Kartenbreite und Ausrichtung bei 1280 px.** Bei der Karte steht die Zurück-Taste links bei x=30, der Text bei x=120 und der Inhalt endet bei x=880, rechts bleibt ein leerer Streifen. Beim Journey-Kapitel gibt es drei Spaltenbreiten. Die Weltenseiten-Kacheln haben ungleiche Höhen (ungleiche Trennlinien).
    - Vorschlag: eine feste Inhaltsbreite und Ausrichtung für Karte und Reise, Kacheln mit gleicher Höhe oder ohne Trennlinie.
    - Aufwand: klein.
11. **Bildunterschriften in drei Stilen:** helle Zeile unter dem Foto ("Charles J. Sharp · CC BY-SA 4.0"), dunkle Leiste auf Zeichnungen ("Eigene Modellvorschau · mit KI-Unterstützung"), und auf der Karte "Foto: … · Lizenz" mit aufklappbarer Quelle. Bei Reisen nur "Foto: NASA".
    - Vorschlag: ein Format. Kurz in der Kachel, voll auf der Karte.
    - Aufwand: klein.
12. **Feinschliff.**
    - Im Steckbrief der Karte "Planeten: groß und weit entfernt" bricht "Entfernungseinheit" mitten im Wort um (`k-wiss-390-t2.png`, "Entfernungsein / heit"). Vorschlag: breitere Label-Spalte oder Silbentrennung.
    - Beim Foto-Rahmen der Wissenskarte liegt das Bild in einem weißen Kasten mit Unterschrift. Bei einzelnen Hochformaten (Porträts) steht das Bild klein auf lila Fläche.
    - Weltsymbole in den Kopfflächen (Uhr, Glühbirne, Kolben) sitzen oben rechts als großes Wasserzeichen. Das wirkt wie ein Platzhalter.

## 3. Bausteine zum Vereinheitlichen

1. **Eine Bildkachel (`Motivkachel`)** mit Rahmen, Seitenverhältnis, Ausschnitt, Bildunterschrift und gleicher Ecke. Verwendet auf Startseite, Welten-Übersicht, Weltenseiten, Lernreisen, Spiele, Labore und Wissensrouten. Das ist der größte Hebel.
2. **Ein Bildrahmen** (Foto und Zeichnung) mit festem Seitenverhältnis, Fokuspunkt und einem einzigen Kennzeichnungsformat: "Foto: Autor · Lizenz", "Zeichnung: eigene" oder "KI-Bild". Dazu ein Platzhalter für fehlende Bilder.
3. **Ein Übersichtskopf** (Vorspann, Titel, ein Satz, Zurück), wie bei Welten und Spiele-Reiter.
4. **Ein Knopfsatz** (Hauptknopf, ruhiger Knopf, Pfeil-Link) und ein einheitliches Wort für "los".
5. **Ein Kartenkörper** mit festem Schatten und Radius für Listen, Kacheln, Hinweiskästen und Spielkarten. Im Moment gibt es Kästen mit Rand, mit Schatten, mit Strichlinie ("Stimmt das?") und mit Farbfläche.
6. **Eine Akzentregel.** Aktuell hat jede Welt eine eigene Farbe (grün, braun, lila, orange, blau, petrol), dazu Orange und Petrol für Knöpfe. Das passt kaum zu "Orange und Petrol sparsam" in `VISION.md`. Entscheiden: Weltfarben nur als dünner Akzent (Chip, Linie) oder ganz weglassen.
7. **Ein Platzhalter-Baustein** (Motiv statt Text im Bildfeld), solange Bilder fehlen.

## 4. Was gut und einheitlich ist (bitte erhalten)

- Kopfzeile und Bereichsleiste (unten bei 390, oben bei 1280): einheitlich, klare Aktivmarkierung, Tippflächen gut sichtbar.
- Wissenskarte: Aufbau ("Rate mal!", "Kurz erklärt", "Stimmt das?", "Steckbrief", "Dazu passt") ist in allen Welten gleich und lesbar. Antwortknöpfe sind groß und gleich gebaut. Schrift mindestens 16 px im Fließtext (gesehen, nicht gemessen).
- Kartenfotos selbst sind gut: scharf, passend zum Thema (Elefant, Pyramiden, Fahrrad mit Kettenbeschreibung), mit sichtbarem Nachweis.
- "Dazu passt" mit Bild und Satz auf der Karte.
- Lernreisen-Übersicht auf dem Handy: Foto groß, Nummer, Titel, Satz. Das ist die beste Kachel der Seite und ein Vorbild für alle anderen.
- Kein waagerechtes Scrollen bei 320 px, keine Überlappungen von Text im Kern.
- Bildgrößen: Auf 390 und 1280 sind nur wenige Dateien kleiner als die Anzeige (Pinguin, Einstein, Benz, Eiffelturm, Kleinvorschau `lab-clocks-model.png` mit 192 px auf 362 px). Bei hochauflösenden Handys (2x) wird mehr unscharf. Das habe ich nicht gemessen.

## Nicht geprüft

- Nur Chromium, keine Kinder befragt, keine echten Geräte, keine Bildschirmleser.
- Tippflächen (44 px), Kontrast nach WCAG und die Tastaturfokus-Prüfung habe ich in dieser Bestandsaufnahme nicht gemessen. Auch nicht Schrift unter 16 px an einzelnen Stellen (Bildunterschriften wirken klein).
- Bei 768 px und 1440 px wurde nichts aufgenommen. 320 px nur auf Seitenüberlauf.
- Hochauflösende Bildschirme (2x/3x) und "Bewegung reduzieren" nur als eingeschalteter Modus ohne eigene Prüfung.
- Nicht jede Karte angesehen. Die Zählung der Bildarten je Welt (Textband, Foto, Zeichnung) kommt aus einem Skript über die Weltenseiten bei 1280 px. Unterscheidung Foto oder KI-Zeichnung dort nur grob.
- Die Startseite zeigt je Aufruf ein anderes Fragenfoto (gesehen: Krake, Marie Curie, Tim Berners-Lee). Ich habe nur diese drei gesehen.
- Spiele: nur Memory, "Wer lebt wo?" und "Stimmt das wirklich?" geöffnet und nur das erste Bild. Nicht alle 31 Spiele, Labore und Lernreisen durchgespielt.
- Das Git-Verzeichnis zeigt zwei geänderte Dateien (`app/kern/auswahl.ts`, `app/learning-games.tsx`). Sie stammen nicht von mir, mein Build lief auf dem Stand im Arbeitsordner einschließlich dieser Änderungen.
- Ich habe zum Beenden meiner Vorschau `pkill` benutzt. Falls dabei ein fremder Vorschau-Server auf einem anderen Port mitgegangen ist, bitte kurz prüfen.
- Keine Projektdateien geändert. Die Wegwerfskripte liegen im Scratchpad unter `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/`.
