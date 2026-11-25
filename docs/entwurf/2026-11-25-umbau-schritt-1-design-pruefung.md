# Design-Prüfung Umbau-Schritt 1 „Farben, Fokus, Knöpfe“ (Stand: Build auf Port 4180, Chromium)

> Helferbericht (design-pruefer, sonnet/high), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

Ich habe nichts im Repository geändert. Skripte und Bilder liegen unter `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/design-s1/`.

## 1. Gesamteindruck je Breite
- **320 px:** Die Knöpfe sind einheitlich und gut tippbar, es gibt kein waagerechtes Scrollen. Mit großer Schrift brechen aber „Alle Spiele“ und „Neue Runde“ in zwei Zeilen mit Symbol links um. Im Pass-Dialog stößt „Gespeichertes & Notizen“ an den Rand. Die untere Leiste ist eng („Welten Spielen“ berühren sich fast).
- **390 px:** Das ist der Hauptweg und er wirkt ruhig. Haupt-, Neben-, Vorlese-, Antwort- und Wahlknöpfe sehen gleich aus (Petrol, 14 px Radius, 48 px und mehr). Die Rückmeldekästen sind aber noch grün, auch bei „Noch nicht ganz“.
- **768 px:** Wie 390 px, die Knöpfe sitzen sauber in Zeilen. Reise und Labor haben keine Auffälligkeiten außer den unten genannten Altresten.
- **1280 px:** Sauber. Die Tipp-Kästen sind hier auffällig hoch (74 px) bei 14 px Schrift. Der „Rate mal!“-Kasten sitzt links in der Spalte, das ist Schritt 5.
- **1440 px:** Nur per Messung geprüft (kein waagerechtes Scrollen, keine Knöpfe unter 44 px außer den unten genannten). Bilder habe ich bei 1440 px nicht angesehen.

## 2. Zu deiner Frage: Stimmt der Satz im „Was ist neu?“-Eintrag?
**„Grün wird eine Antwort jetzt nur noch, wenn sie richtig ist.“** Für die Antwortknöpfe selbst stimmt das:
- Gewählt ist Petrol-zart und falsch ist rot.
- Bei „richtig“ ist der Rand grün, der Buchstabe weiß auf Grün und es steht ein Haken daneben.
- Das gilt bei Karte, allen `.quiz-answer`-Spielen, Reise und Labor-Fragen.
- Die Wahlknöpfe der Reise sind Petrol-zart, nicht grün.

**Der Satz ist aber irreführend, solange die Rückmeldung grün bleibt.** Bei einer falschen Antwort erscheint „Noch nicht ganz. Versuch es noch einmal!“ in einem grün getönten Kasten mit grüner Schrift (`.lab-feedback`, Schrift `rgb(56,104,88)`).
- Das ist an jeder Stelle so: Karte, Spiel, Reise und Labor (Bild 02 und 03).
- Auf der Tier-Karte kommt hinzu: Der ganze „Rate mal!“-Kasten ist grün (Weltfarbe Tiere), samt grüner Überschrift.
- **Empfehlung:** Entweder den Satz entschärfen („Eine richtige Antwort wird grün.“) oder (besser) die Rückmeldung bei „falsch“ nicht grün machen. Ich schlage Petrol-zart und Tinte vor, oder die falsch-zart-Farbe als Rand. Das grüne `.lab-feedback` bleibt dann nur für „Richtig!“.

## 3. Befunde

### Muss
1. **Falsch-Rückmeldung ist grün** (siehe oben).
   - Alle Breiten, Karte, Spiel, Reise, Labor.
   - Bilder: `zeigen/02-karte-falsch-gruener-kasten-390.png`, `zeigen/03-spiel-falsch-gruener-kasten-390.png`.
   - Vorschlag: `.lab-feedback` und `.game-feedback` im Zustand „falsch“ neutral färben. Das geht über eine Klasse oder `:has(.is-incorrect)`. Alternativ den Satz ändern.
   - Der Schluss-Eintrag („Richtig!“ siehst du jetzt…) bleibt dann stimmig.
2. **Falsch ist nur über Farbe erkennbar.**
   - Rot (#B5462F) und Grün (#2E7A55) sind genau das Rot-Grün-Paar, das viele nicht unterscheiden. „Richtig“ hat einen Haken, die falsche Antwort hat keinen Marker.
   - Bei erzwungenen Farben unterscheidet sich die falsche Antwort nur durch 3 px Rand und einen anderen Farbton. Bild: `zeigen/08-erzwungene-farben-falsch-390.png`.
   - Vorschlag: ein „✕“ oder „Noch nicht“-Symbol am Zeilenende, analog zum Haken.
   - Wenn du das als Soll einstufst, ist es auch in Ordnung. Für 5- bis 10-Jährige halte ich es für Muss.

### Soll
3. **Alte Beige/Braun-Tipp-Kästen** („Brauchst du einen Tipp?“) auf Karte, in allen Spielen, in allen 11 Laboren und im Globus.
   - Farben: Fläche #FBF6E9, Schrift #775A24.
   - **Schrift uneinheitlich:** auf der Karte 16 px und 48 px hoch, in Spiel und Labor 14 px und 44 px.
   - Mit großer Schrift wächst der Text nicht mit (Bild `gross-karte-falsch-320.png`).
   - Vorschlag: ein Baustein, 16 px mit Kern-Schrift, Farbe Petrol-zart oder Papier.
   - Ähnlich alt: Globus `.mission-hint` („Ich brauche einen Tipp“, 14 px, Braun) und `.mission-button` (Beige/Braun in `globals.css`).
4. **Labor „Wasserkreislauf“:** Stationenknöpfe `.water-loop button`.
   - Alter Blauton, 14 px Schrift, Rand #D1E2E8 (kaum sichtbar), „gewählt“ nur hellblau (Bild `zeigen/09-labor-wasser-altes-blau-390.png`).
   - Gehört auf den Wahlknopf-Baustein (Petrol-zart, 16 px).
5. **Labor-Kopfzeile bei 390 px:** „Alle Experimente“ ist 50 px hoch, „Modell zurücksetzen“ 75 px (zweizeilig), nicht auf gleiche Höhe gezogen. Bild: `zeigen/06-labor-knoepfe-ungleich-390.png`.
   - Dasselbe bei „Beobachtung A merken“ und „B merken“ (je 75 px).
   - Vorschlag: `align-items: stretch` oder kürzere Beschriftung.
6. **Große Schrift bei 320 px:**
   - Spielkopf „Alle Spiele“ und „Neue Runde“ brechen in zwei Zeilen mit linkem Symbol um (Bild `zeigen/07-grosse-schrift-320-knoepfe-umbrechen.png`). Das ist genau der „unschöne Einzelwörter“-Fall.
   - Pass-Nav „Gespeichertes & Notizen“ läuft an den rechten Rand (`gross-pass-320.png`), die Symbole fehlen.
   - Vorschlag: Beim Umbruch das Symbol ausblenden oder die Knöpfe untereinander stellen.
   - Mit großer Schrift sind bei 320 px auch „Wie / groß?“ im Steckbrief und die Feedback-Überschrift „Noch nicht ganz…“ auf der Karte kleiner als der Fließtext darunter. In `gross-karte-falsch-320.png` ist der Titel 16 px und der Text größer. Im Spiel gilt dagegen 20/24 px.
7. **Rückmeldekasten der Karte nicht deutlicher.**
   - Der Bauplan wollte „Richtig!“ auf etwa 20 px oder mit Häkchen. Im Spiel (20 px, `.game-room … > strong`) ist das so, auf der Karte, in der Reise und im Labor nicht.
   - Dort ist die Überschrift etwa 16 px und kaum größer als der Text (Bild `zeigen/01-karte-richtig-390.png`).
   - Vorschlag: überall derselbe Wert wie im Spiel.
8. **„Noch einmal raten“ (Karte, nach „Richtig!“)** ist ein weißer Knopf mit grünem Rand und grüner Schrift. Er trägt die Klasse `.speech-button`, sieht aber anders aus als alle Knöpfe.
   - Er ist auch grün, obwohl er nichts „Richtiges“ bedeutet.
   - Vorschlag: `.secondary-button`.
9. **Globus-Schalter** „Grenzen / Äquator & Pole / Namen“ (shadcn-Switch, bei „an“) sind grün (`rgb(58,151,127)`). Im Pass sind die Schalter dagegen Petrol (richtig).
   - Der Globus ist als Schritt 7 geplant, aber das ist ein „aktiv = grün“-Fall, der zum Satz im Eintrag passt.
   - Vorschlag: `--primary` oder `data-state=checked` auf Petrol.
10. **Tippflächen unter 48 px (Bausteine):**
    - „Mission beginnen“ (`.speech-button` in `.world-missions` auf #world): 44 px (anderes `min-height` überschreibt). Vorschlag: gleiche Regel wie überall.
    - Karte: „1 · Südost-Queensland …“ (`.secondary-button`) ist ab 768 px 46 px hoch.
    - Wissensbuch: Buchstabenfilter („Alle“, A bis Z) 44 × 44 px. Das ist das Mindestmaß der Prüfliste, aber nicht der Kern-Wert 48 px. Schritt 7.
    - Dazu die Globus-Knöpfe in der Prüfung: `.spin-button`, `.map-label`, `.icon-button` mit 44 px und 12 bis 14 px Schrift. Schritt 7, laut BACKLOG bekannt.
11. **Seitenaufbau mit Zugehörigkeit:** Das Stufenmenü „Ändern“ ist ein `.kern-knopf` (weiß, grauer Rand), alle Nachbarknöpfe sind `.secondary-button` (Petrol-Rand). Das ist die einzige Stelle, wo zwei Knopfarten nebeneinander stehen (Karte und Spielkopf).
    - Vorschlag: eine Linie festlegen (klein, grauer Rand ist als „leise“ sinnvoll, dann aber überall so).

### Kann
12. **Hover und Auswahl sehen gleich aus:** Antwort-Hover = Petrol-zart + Petrol-Rand = gewählt. Auf dem Desktop wirkt Zeigen wie Auswählen.
    - Dazu fehlt der „Lichtschimmer“ aus VISION.md auf Kacheln und Knöpfen. Hover ändert nur die Farbe. Gehört vermutlich zu Schritt 6.
13. **Aktive Leiste und Fokus bei erzwungenen Farben:** Der aktive Eintrag (schwarz, 3 px) und der Fokus (indigo, 3 px) sehen sich ähnlich, beide mit dickem Kasten. Kaum zu unterscheiden, wenn beides gleichzeitig vorkommt. Bild `fc-fokus-start.png`.
14. **Pass-Navigation** („Überblick“, „Lernwege“ …) ist weiß mit grauem Rand und Schrift 500, links ausgerichtet, also ein dritter Knopftyp. Das sind Sprungmarken, daher unkritisch, aber ein Kasten ohne Auswahlzustand sieht wie ein Reiter aus.
15. **Memory („Länder-Memory“)** und Memory-Spiele nutzen noch altes Hellblau (#E4F2FA) und aufgedeckte Karten in Beige/Orange (#FFF6E8, Schrift Braun; Kleinschrift „Land / Hauptstadt“ blass). Bild `zeigen/10-memory-altes-beige-390.png`. Schritt 6.
16. **Mini-Schrift:** Sehr viele Texte und Links der Startseite bleiben 13 bis 14 px und 44 px hoch (`.discovery-text-link`, „Foto & Quelle“, „Original und Rechte“, Chips „Mond & Meer“, 14 px). Das ist Schritt 2 und 4, aber die Messung zeigt viele Stellen.

## 4. Gleiche Bausteine für gleiche Dinge (Frage 2)
- **Gleich, gemessen:**
  - `.primary-button`: Petrol `rgb(11,107,115)`, weiße Schrift, 17 px, 48 px und mehr, 14 px Radius. Gleich auf Start, Reise, Spiel, Pass und Labor.
  - `.secondary-button`: weiß mit Petrol-Rand, Petrol-dunkel-Schrift, 17 px, 14 px Radius. Gleich auf allen Seiten, auch im Pass-Dialog.
  - `.speech-button`: ohne Fläche, Petrol-dunkel, 16 px, 48 px. Gleich, außer „Noch einmal raten“ und „Mission beginnen“ (siehe oben).
  - `.quiz-answer`: weiß, Rand #788A80, 18 px, 56 px und mehr, gleich in Karte, Spiel, Reise, Labor.
  - Wahlknöpfe der Reise und Stufenknöpfe: Petrol-zart und Petrol-Rand bei „gewählt“.
- **Abweichend:** `.kind-tab model-choice` (Globus „Kontinente / Länder / Meere“) hat im Ruhezustand keinen Rand und wirkt wie reiner Text. Nur „Länder“ (gewählt) sieht wie ein Knopf aus. Das betrifft die Frage 5 deines Auftrags („Kontinente / Länder / Meere“). Bild `hunt-1-390.png`.
- Die „Erde“-Tabs oben (Weltkugel, Erdschichten, Tag & Nacht) sind ein weißer Reiter in grauem Rahmen, also ein eigener Baustein. Das ist okay als Reiter.

## 5. Kontrast und Lesbarkeit
Gerechnet (WCAG, mit den ausgelesenen Farben):
- Weiß auf Petrol 6,2:1.
- Petrol-dunkel auf Weiß 8,4:1 und auf Petrol-zart 7,1:1.
- Rückmeldeschrift (56,104,88) auf Kasten 5,7:1.
- Tipp-Schrift Braun auf Beige etwa 6:1.
- Leise Tinte auf Papier 5,8:1.
- Rand #788A80 auf Weiß 3,65:1 und auf Papier 3,2:1, das ist über 3:1 und damit in Ordnung, aber knapp.
- Weiß auf Falsch 5,4:1 und auf Richtig 5,2:1.
- Falsch-Rand auf falsch-zart 4,5:1 und Richtig-Rand auf richtig-zart 4,4:1. Als Rand genügt das, hier gibt es kein Problem.

Nicht einzeln gemessen: alle Weltfarben-Kästen und alle Altbereiche.

## 6. Was noch alt aussieht (Ort, Schritt)
- **Orange:**
  - Marken-Kompass im Kopf (gewollt, Identität).
  - Skip-Link-Rand (`.skip-link`).
  - Reisenübersicht: Kapitelliste `.journey-outline li .active` war laut Quelle grün (`#2c6b59`, `#d7f0e5`), im Browser aber beim Listeneintrag in `#journeys` als orange Hintergrund (#FFF6E9) mit Rand erfasst. Bitte an der Stelle prüfen (Schritt 7).
  - „Was ist neu?“: Symbolkreise orange (Grafik, ok).
  - Tipp-Texte: braun (siehe Soll 3).
  - Mission/Tipp-Knöpfe im Globus, Memory (aufgedeckt).
  - Zeitreise-Kästen sind orange-beige (Weltfarbe, bewusst), die falsch-zart-Farbe liegt dort farblich nah dran (Bild `welt-history-stone_tools.png`).
- **Alte Grüntöne:**
  - Tier-Karte: „Rate mal!“-Kasten, „Schon gewusst?“ (Kasten und Symbol), „Ausprobieren“ und „Mehr erfahren“ (grüne 20-px-Überschriften), „Klima erkunden“ (`.knowledge-link`, grüne Fläche und Schrift), „Dazu passt“-Kacheln mit grünem Rand.
  - Abschnitt „Gelernt“-Chip (grün, bedeutet Ergebnis, vertretbar).
  - Fakt-Kasten in der Reise (grüne Fläche, Symbol), Pass-Abzeichen `.earned` (grün), `.chosen-correct` (`app/learning-games.tsx`, `advanced-games.tsx`), `.memory-card.matched`, `.game-win`, `.word-categories` aktiv (Wissensbuch).
- **Alte Blautöne an Knöpfen und Flächen:**
  - Wasser-Labor (`.water-loop`), Memory-Karten (zugedeckt) und die Hinweisfläche „Auch ohne Internet weiter entdecken“ (#EAF4FA, Fuß, auf jeder Seite, Schritt 3).
  - Start und Welten: „Weiter entdecken“-Kasten (hellblau, Welten).
  - Globus-Fuß: Linienknöpfe „Äquator / Nordpol / Südpol“ (14 px, grauer Rand).

## 7. Fokus, Tastatur, erzwungene Farben, Bewegung
- **Fokus:** Auf Start (45 Tabs) und in einer Spielfrage ist der Rahmen überall 3 px Petrol `rgb(11,107,115)` mit 2 px Luft. Ausnahme: Die untere Leiste hat −3 px Abstand (innen), das ist gewollt. Der Rahmen ist an Antworten, Knöpfen, Zusammenfaltern und Suche sichtbar. Bild `fokus-antwort.png`. Es erschien kein großer Rahmen um Überschriften.
- **Erzwungene Farben (390 px):** Der gewählte Wahlknopf zeigt den doppelten Rand (Bild `fc-reise-wahl.png`), der Fokusrahmen ist sichtbar. Die richtige Antwort ist 3 px mit Haken und die übrigen sind gestrichelt. Falsch siehe Muss 2.
- **Bewegung reduzieren:** In diesem Durchgang nicht geprüft (nur Pass-Schalter „Weniger Bewegung“ eingeschaltet, kein Bewegungsvergleich).

## 8. Was gut ist (erhalten)
- Ein Rahmen für den Fokus, überall gleich.
- Haupt-, Neben- und Vorlese-Knöpfe: klare Petrol-Linie, 48 px und mehr, ruhiger Text 17 px.
- Antwortzustände: Petrol-zart für gewählt, Grün mit Haken und Buchstabe für richtig, gestrichelte „erledigte“ Antworten (statt blasser Deckkraft), mit lesbarem Kontrast.
- Wahlknöpfe der Reise (Petrol-zart) und die Pass-Schalter in Petrol.
- Keine waagerechten Scrollbalken auf allen geprüften Seiten und Breiten, keine abgeschnittenen Knopftexte bei normaler Schrift.
- Das Kompass-Symbol bei Memory und im Kopf trägt die Identität gut.

## 9. Was ich angesehen habe und was nicht
- **Angesehen:** Start (320, 390, 768, 1280, 1440 als Messung, 320, 390, 1280 als Bild), Welten, Tierwelt, Koala-Karte (alle Breiten gemessen, 390 und 1280 als Bild), Spiele-Übersicht, „Wer war das?“ (falsch und richtig), Globus mit Kontinente, Länder, Meere, Memory, Reihenfolge-Spiel, Lebensräume, Detektiv (nur Ansicht), alle 11 Labore (Farb- und Größenscan), Reise `water/1` (Wahlknöpfe, Antworten), Reisenübersicht, Pass-Dialog (390), „Was ist neu?“ (390), große Schrift (320 voll, 1280 nicht als Bild), erzwungene Farben (390), Tastatur.
- **Nicht oder nur teilweise geprüft:**
  - 1440 px nur per Messung.
  - Große Schrift bei 1280 px nicht angesehen.
  - Bewegung reduzieren nicht.
  - Die 31 Spiele nur über Messung der Knopfklassen und 5 Spiele einzeln; die übrigen nicht gespielt (Flaggen, Silhouetten, Hauptstädte usw.).
  - Eine falsche und eine richtige Antwort nur beim „Wer war das?“-Spiel, Karte und Reise; Hover nur bei Antwort und Zustand per Messung.
  - Wissensbuch/Karte-Werkstatt nur gemessen (Buchstabenfilter).
  - Keine echten Geräte, kein Safari/WebKit, kein Firefox, kein Bildschirmleser, keine Kinder.
  - Kontrastwerte teils aus den Werten der `kern.css` gerechnet.
  - Der Bildstand ist die Kopie auf 4180. Sie weicht eventuell vom aktuellen Arbeitsstand ab (im Repo sind `globals.css`, `book.css`, `pass-atlas.css`, `topic-map.css` und `lesbarkeit.mjs` unversioniert geändert).

## 10. Bilder für den Nutzer (alle in `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/design-s1/zeigen/`, Faktor 2)
1. `01-karte-richtig-390.png`: Karte, richtige Antwort, „Richtig!“-Kasten, grüner Knopf „Noch einmal raten“.
2. `02-karte-falsch-gruener-kasten-390.png`: Karte, falsche Antwort in Rot, aber grüner Kasten und Beige-Tipp.
3. `03-spiel-falsch-gruener-kasten-390.png`: „Wer war das?“, falsche Antwort, grüne Rückmeldung.
4. `04-spiel-richtig-390.png`: Spiel, richtige Antwort, Haken, „Nächste Aufgabe“.
5. `05-reise-wahlknopf-gewaehlt-390.png`: Reise, Wahlknöpfe in Petrol-zart (gut).
6. `06-labor-knoepfe-ungleich-390.png`: Labor, zwei Kopfknöpfe mit ungleicher Höhe.
7. `07-grosse-schrift-320-knoepfe-umbrechen.png`: große Schrift bei 320 px, Knöpfe brechen um.
8. `08-erzwungene-farben-falsch-390.png`: erzwungene Farben, falsche Antwort nur durch Rand erkennbar.
9. `09-labor-wasser-altes-blau-390.png`: Wasser-Labor, alte blaue Stationenknöpfe.
10. `10-memory-altes-beige-390.png`: Memory, altes Beige und Blau.

Weitere Belege im selben Ordner `design-s1/`: `koala-quiz-falsch-390.png`, `koala-falsch3-390.png`, `wer-falsch-b-390.png`, `hunt-1-390.png`, `gross-karte-falsch-320.png`, `gross-pass-320.png`, `fc-reise-wahl.png`, `fc-fokus-start.png`, `fokus-antwort.png`, `welt-history-stone_tools.png`.
