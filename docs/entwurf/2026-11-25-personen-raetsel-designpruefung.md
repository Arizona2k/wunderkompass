# Personen-Rätsel: Design-Prüfung (25.11.2026)

Helfer: `design-pruefer` (sonnet/high), Stand `bce6fba`, lokaler Build, Chromium. Bilder lagen unter `.qa-output/design-personen/` (nicht in Git). Was Claude daraus macht, steht am Ende.

Design-Prüfung „Wer war das?“ (Spiel `people`), Stand `bce6fba`, Chromium, Breiten 320/390/768/1280/1440 px. Im Repository habe ich nichts geändert, die Vorschau auf Port 4482 ist beendet, und `dist/` blieb unberührt. Bilder liegen unter `/home/user/wunderkompass/.qa-output/design-personen/`.

## Kurzliste

**Muss: nichts Blockierendes.** Kein waagerechtes Scrollen in irgendeiner Breite, nichts abgeschnitten. Fokusring (3 px Petrol) an allen Bedienelementen sichtbar. Beim Öffnen des Spiels per Klick liegt der Fokus auf `body`, also kein Rahmen um Überschriften. Mit „Bewegung reduzieren“ keine laufenden Animationen und alles bedienbar.

**Soll**
1. **Langer Profi-Text als Überschrift wirkt zu wuchtig, vor allem bei 320 px.** Die Frage ist ein `h2` mit 23 px und Gewicht 650 (27 px ab 768).
   - Mandela Profi: bei 320 px 11 Zeilen und 354 px hoch, bei 390 px 8 Zeilen und 258 px, bei 768 px 5 Zeilen, bei 1280 px 4 Zeilen.
   - Curie Profi bei 320 px: 9 bis 10 Zeilen. Mandela hat 242 Zeichen, der Median der 36 Personen-Rätsel liegt bei 183.
   - Zum Vergleich: Tier & Lebensraum hat höchstens 78 Zeichen, Technik 133, Tierdetektiv 210 (Aal bei 320 px: 8 Zeilen, ebenfalls Vollgewicht). Die Länge ist also nicht neu, die Personen-Rätsel sind aber die längsten.
   - Bilder: `people-profi-nelson_mandela-320-1-start.png`, `people-profi-marie_curie-320-start.png`, `animal-detective-profi-european-eel-320-start.png` (Vergleich), `people-profi-nelson_mandela-768-1-start.png`.
   - Vorschlag: Frage „Wer passt zu diesem Hinweis?“ als Überschrift lassen, den Hinweis (2 bis 4 Sätze) darunter als Absatz in Fließtextgröße, mittleres Gewicht, etwa 19 bis 20 px. Das wäre eine Änderung für alle Spiele mit langem Hinweis (Personen und Tierdetektiv), damit die Spiele einheitlich bleiben. Alternativ Mandela um einen Satz kürzen.
2. **Antworten bei 320 × 640 px nicht ohne Scrollen erreichbar, auch nicht auf Entdecker.**
   - Entdecker: Antwort A beginnt bei y = 571, die feste Leiste unten fängt bei etwa 576 an. Alle drei Antworten liegen unter der Leiste (`people-entdecker-nelson_mandela-320-1-start.png`).
   - Profi Mandela: Antwort A beginnt bei y = 820, rund 180 px unter dem sichtbaren Bereich. Auf dem ersten Bildschirm sieht man nur Frage und Text.
   - Bei 390 × 844 px: Entdecker alle drei Antworten sichtbar. Profi Curie nur Antwort A, halb von der Leiste überdeckt (`people-profi-curie-390-fokus-tab7.png`).
   - Das hängt vor allem an den Zeilen oberhalb: Stufenzeile, „Zu schwer? Zurück zu Entdecker“ (nur Profi/Experte), „Aufgabe 1 von 1“, „Vorlesen“ und das Tipp-Kästchen (bei geschlossenem Tipp 74 px) nehmen zusammen rund 300 px.
   - Vorschlag: das ist bei 320 px ohnehin eng. Wenn man etwas gewinnen will: „Aufgabe 1 von 1“ ausblenden, wenn es nur eine Aufgabe gibt, und „Vorlesen“ neben die Überschrift statt in eine eigene Zeile.
3. **Schriftgrößen unter 16 px (bestehen schon, gelten für alle Welt-Spiele):** „Vorlesen“ und „Brauchst du einen Tipp?“ haben 14 px, der aufgeklappte Tipptext 15 px. Die neuen Tipp- und Rückmeldungstexte stehen in diesen Bausteinen. Der Rückmeldetext selbst hat 16 px und lässt sich gut lesen.
4. **Erklärung nach richtiger Antwort ist eine Textwand.** Bei Curie Profi und 320 px sind es rund 40 Zeilen (`people-profi-marie_curie-320-richtig.png`), bei Mandela auf 1280 px 8 Zeilen mit 15 bis 16 px (`people-profi-nelson_mandela-1280-4-richtig-full.png`). Das ist nicht neu, aber für 5- bis 10-Jährige schwer lesbar. Vorschlag: für Entdecker die Erklärung auf 2 bis 3 Sätze kürzen, den Rest hinter „Mehr erfahren“.

**Kann**
5. Bei 1280 px liegen „Erklärung vorlesen“ und der orange Knopf „Spielstempel sammeln“ ohne Abstand nebeneinander (Text endet bei x = 300, Knopf beginnt bei 301; `people-profi-nelson_mandela-1280-4-richtig-full.png`). Zwischen die beiden gehört ein Abstand von mindestens 12 px. Bei 320 px stehen sie untereinander und passen.
6. Der Profi-Tipp („Vergleiche die genannte Tätigkeit oder Entdeckung …“) ist abstrakt und klingt wie ein Behördentext. Als Entdecker-Tipp gibt es nun eine kindgerechte Fassung („Kennst du einen der Namen? …“), als Profi-Tipp nicht. Beim Profi-Tipp gibt es auch keine Rückmeldung mit dem gewählten Namen in Kinderton, sondern denselben Satz mit vorangestelltem „Du hast „X“ gewählt.“ (`people-profi-marie_curie-320-falsch.png`). Das ist inhaltlich in Ordnung, nur der Ton weicht von Entdecker ab.
7. Auf Profi ist die Frage bei 320 px nach „Vorlesen“ und dem Tipp aus dem Bild gescrollt (nach einer falschen Antwort und geöffnetem Tipp sieht man die Frage nicht mehr). Kein Fehler, nur eine Folge von Punkt 1.

## Gesamteindruck je Breite
- **320 px:** Entdecker passt sauber, Antworten aber erst nach einem Scroll. Profi wirkt mit 10 bis 11 Zeilen Überschrift erdrückend, Antworten weit unten.
- **390 px:** Entdecker gut, alle drei Antworten sichtbar. Profi: Überschrift 8 Zeilen, nur eine Antwort halb zu sehen.
- **768 px:** gut lesbar, Frage 4 bis 5 Zeilen, alle vier Antworten ohne Scrollen sichtbar.
- **1280 px:** sauber, Zeilenlänge etwa 65 Zeichen bei 1000 px Spaltenbreite (`people-profi-nelson_mandela-1280-1-start.png`). Nur der Abstand in Punkt 5 stört.
- **1440 px:** Layout und Maße identisch zu 1280 px (gleiche Spaltenbreite, gleiche Messwerte). Die Bilder dazu habe ich nicht einzeln durchgesehen.

## Zu den gefragten Punkten
- **Kontrast:** Fließtext in Frage und Antworten ist dunkles Petrol auf Hellbeige, deutlich über AA. Tipp-Text (`rgb(111,84,39)` auf Hellorange) und Rückmeldung (`rgb(56,104,88)` auf Hellgrün) habe ich nur gemessen, nicht gerechnet, sie wirken ausreichend. Ein Rechner-Check steht aus.
- **Tippflächen:** Alle Knöpfe, auch „Vorlesen“ und der Tipp-Kopf, mindestens 44 px hoch. Antworten 63 bis 65 px. „Alle Spiele“, „Neue Runde“ und „Ändern“ haben 48 px. Der Abstand zwischen den Antworten ist etwa 12 px.
- **Neue Rückmeldung nach falscher Antwort:** „Du hast „Rabindranath Tagore“ gewählt. Hat dieser Mensch so etwas gemacht? Schau dir auch die anderen Namen an.“ Sie bricht in allen Breiten sauber um und steht unter den Antworten (`people-entdecker-nelson_mandela-320-3-falsch-full.png`). Bei 320 px schiebt die feste Leiste sie im Vollseiten-Bild optisch ins Bild, das ist ein Artefakt des Screenshots, kein Fehler.
- **Einheitlichkeit mit Tier & Lebensraum:** Aufbau gleich (Stufenzeile, „Aufgabe x von y“, Überschrift, Vorlesen, Tipp, Antworten, Rückmeldung). Nur die Länge der Überschrift unterscheidet sich stark (Punkt 1). Das Muster „Hinweis als Überschrift“ gibt es schon im Tierdetektiv.
- **„Was ist neu?“:** Oberster Eintrag „Neue Rätsel bei „Wer war das?““ vom 25.11.2026 erscheint in allen Breiten korrekt (`neu-320.png`, `neu-390.png`, `neu-768.png`, `neu-1280.png`, `neu-1440.png`). Text 17 bis 18 px, Überschrift fett, kein Abschneiden. Der Text ist kindgerecht und kurz. Das Symbol (Lupe) ist dasselbe wie bei einem Eintrag darunter, kein Problem.

## Was gut ist (erhalten)
- Entdecker-Frage kurz und klar („Wer passt zu diesem Hinweis?“ plus ein Satz), passt in alle Breiten.
- Die neue Rückmeldung nennt den gewählten Namen und stellt eine Denkfrage, ohne zu verraten. Sie liegt als eigener grüner Kasten klar abgesetzt unter den Antworten.
- Fokus, Tab-Reihenfolge und Tippflächen sind überall sauber.
- Antworten sind immer vollbreit und gut lesbar. Nach richtiger Antwort werden die falschen blass, die richtige grün mit Häkchen.

## Nicht geprüft
- Firefox, WebKit/Safari, echte Handys oder Tablets, Bildschirmleser und die Vorlesefunktion.
- Rechnerischer Kontrastwert (nur Farben gemessen, nicht nach WCAG berechnet).
- Alle 36 Personen: Ich habe Mandela und Curie je Stufe angesehen, Entdecker nur mit Mandela. Eigene Fotos in diesem Spiel gibt es nicht.
- Experte-Stufe (spielt hier wie Profi).
- Mehrere Runden hintereinander und das Verhalten nach einem Stufenwechsel mitten in der Runde.
- Dunkler Modus, große Schrift („large-reading“) und Browser-Zoom.
- Glanz auf Kacheln und Knöpfen beim Zeigen: nicht gesondert betrachtet, nur auf den Bildern ist keiner zu sehen.

## Was Claude daraus macht (25.11.2026)

Zusammen mit dem [Spieltest](2026-11-25-personen-raetsel-spieltest.md) ausgewertet. Fast alle Punkte gelten für alle Welt-Spiele und sind älter als die Rätsel. Sie bremsen den Rätsel-PR darum nicht, gehen aber gleich in die nächsten Schritte.

- **Muss:** keiner. Der Rätsel-PR geht so weiter.
- **Soll 4 (Textwand nach „Richtig!“)** kommt in den **nächsten kleinen PR**: eine kurze Auflösung je Person (2 bis 3 Sätze, `karten-autor` schreibt sie schon, danach drei Prüfer). Grund: Heute steht dort die ganze Personenkarte, im Schnitt 877 Zeichen Erwachsenentext (`app/world-game-bank.ts`, `t.paragraphs.join(' ')`). Bei den anderen Welt-Spielen sind es unter 90 Zeichen (Tiere) und im Schnitt 281 (Erfindungen).
- **Kann 6 (Profi-Tipp im Behördenton)** kommt in denselben PR, zusammen mit den gleich klingenden Tipps von „Tier & Lebensraum“, „Was frisst es?“, „Technik“ und „Früher oder heute?“ (einheitlich, `hints` in `app/world-game-support.mjs`).
- **Soll 1 (lange Frage als Überschrift), Soll 2 (Antworten unter dem Rand bei 320 px), Kann 5 (Abstand vor „Spielstempel sammeln“), Kann 7** gehen in den Schritt „Spiele“ des Design-Umbaus „Kompass“: Hinweis als Absatz unter einer kurzen Überschrift (für Personen und Tierdetektiv gleich), „Vorlesen“ neben die Überschrift, Knopfreihe mit Abstand. Grund: Die Spielseite wird dort ohnehin neu gebaut, und viele Browser-Tests finden die Frage über ihre Überschrift; beides zusammen in einem Durchgang ist sicherer.
- **Soll 3 (Schrift unter 16 px)** geht in den ersten Schritt des Design-Umbaus (Grundbausteine im Kern: kleinste Textgröße 16 px).
- **Kontrast rechnen** (offen im Bericht): beim Design-Umbau mit den neuen Farben für alle Bausteine.
