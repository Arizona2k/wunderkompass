# Design-Prüfung „Auflösung und Rückmeldung im Blick“ (25.11.2026)

Helfer: `design-pruefer` (sonnet / high), Stand vor den Korrekturen des code-pruefers, lokal aus dem Arbeitsordner, nur Chromium.

**Design-Prüfung: Rückmeldung nach der Antwort in den Spielen**

Geprüft in Chromium auf den drei Spielen (`world:people`, `world:knowledge-challenge`, `classic:detective`) bei 320, 390, 768, 1280 und 1440 px. Für „falsch“ und „richtig“ gibt es je Breite ein Bild, bei 390 px zusätzlich mit `large-reading` („große Schrift“), und für den Fokus „Weiter“ auf 320, 390 und 1280 px ein Bild mit Tastatur. Bildordner: `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/design-aufl/`. Dateinamen: `<spiel>-<falsch|richtig>-<breite>[-gross|-tab].png`, mit `people`, `kreuz`, `detektiv`. Kein waagerechtes Scrollen bei irgendeiner Breite.

**Gesamteindruck**
- **320 px:** Der Kasten steht ganz im Bild, genau 12 px über der Leiste (Kasten unten 564, Leiste ab 576). Bei „Wer war das?“ liegt „Richtig!“ mit Auflösung (bis 5 Zeilen) und „Weiter“ komplett im Bild, bei „Kreuz und quer“ ebenfalls. Es wird eng, aber nichts ist abgeschnitten.
- **390 px:** Dasselbe, ebenfalls 12 px Abstand zur Leiste, bei allen drei Spielen. Mit großer Schrift passt auch der längste Fall („Stimmt das wirklich?“, richtig, mit „Wissen vertiefen“) vollständig über die Leiste.
- **768 px, 1280 px, 1440 px:** Es gibt keine untere Leiste, der Kasten liegt 12 bis 25 px über dem Fensterrand. Die Seite wirkt luftig. Bei 768 px steht der Kasten nach dem Rollen teils mitten im Bild und hat unten viel Leerraum.

**Muss**
- Keine blockierenden Befunde. Der Kasten wird nirgends von der Leiste verdeckt, und „Weiter“ erhält den Fokus (`document.activeElement`).

**Soll**
1. **„Erklärung vorlesen“ und „Nächste Aufgabe“ berühren sich ab 768 px (0 px Abstand).**
   - Bilder: `people-richtig-768.png`, `people-richtig-1280-tab.png`, `people-richtig-1440.png`.
   - Mit Tastatur-Fokusring (3 px) überlappt der Ring auf 1280 px den Schluss von „Erklärung vorlesen“.
   - Unter 768 px stehen beide untereinander und sind in Ordnung.
   - Vorschlag: Im Kasten ab 768 px `gap` von mindestens 12 bis 16 px zwischen beiden setzen (Flex mit `gap`, `align-items:center`). Alternativ „Weiter“ nach rechts setzen oder die Zeile auch breit umbrechen lassen.
2. **Hierarchie im Kasten: „Richtig!“ bzw. „Noch nicht ganz …“ ist so groß wie der Fließtext.**
   - `STRONG` hat 16 px / Gewicht 700, der Text 16 px / Gewicht 500 (`people-richtig-390`, `people-richtig-320.png`).
   - Mit großer Schrift ist es schlimmer: Der Fließtext wird 18,4 px, die Überschrift bleibt 16 px. Sie ist dann kleiner als der Text darunter (`kreuz-falsch-390-gross.png`, `people-falsch-390-gross.png`, `detektiv-richtig-390-gross.png`).
   - Vorschlag: Überschrift 18 bis 20 px (große Schrift 22 px) und etwas mehr Abstand darunter. Ein Häkchen- oder Sternchen-Symbol vor „Richtig!“ kann die Aussage zusätzlich tragen.
3. **Der Fokusring auf „Weiter“ erscheint nur bei Tastatur, nach Tipp oder Klick nicht.**
   - Nach Tipp oder Klick: `:focus-visible` false, kein Ring (`people-richtig-320.png`). Das entspricht der Vorgabe „kein großer Rahmen nach Maus oder Finger“.
   - Mit Tastatur: 3 px solid Petrol (14,110,114), gut sichtbar auf dem Orangeknopf, auf allen drei Breiten (`people-richtig-320-tab.png`, `people-richtig-1280-tab.png`).
   - Zu 320 und 390 px: Der Ring wird nicht abgeschnitten.
   - Es besteht also kein Handlungsbedarf bei Soll 3, nur Beobachtung (siehe „Nicht geprüft“).
4. **Weißer Text auf dem Orangeknopf hat nur 4,33:1 beim Mittelwert der Rechnung.** Der echte Knopf hat Hintergrund `rgb(185,81,33)` und rechnerisch etwa 5,2:1 (nicht mit Werkzeug gegengeprüft). Falls der Knopf-Verlauf heller ist, nachmessen.

**Kann**
- **Falsche Antwort: Textkontrast der Antwort knapp.** Der markierte Knopf hat `rgb(140,103,53)` auf `rgb(255,243,228)`, das sind 4,67:1 (AA grenzwertig, Bild `people-falsch-390.png`). Der Text im Kasten ist mit 5,70:1 (`rgb(56,104,88)` auf Kastenhintergrund) in Ordnung. „Stimmt das wirklich?“ hat 11,7:1.
- **Nicht gewählte Antworten stehen nach der Antwort mit `opacity: 0.65`.** Das sind rund 3:1, sie sind blass (`people-richtig-1440.png`). Sie sind deaktiviert und damit AA-ausgenommen. Da Kinder sie zum Vergleich ansehen, ist ein Wert um 0,8 freundlicher.
- **Das Tipp-Feld unterscheidet sich je Spiel.**
  - „Kreuz und quer“ und „Wer war das?“: ein orangefarbener Kasten ohne Auf-/Zuklappzeichen, „Brauchst du einen Tipp?“ mit Lampe oder ohne (`kreuz-falsch-390.png`).
  - „Stimmt das wirklich?“: weißer Kasten mit ▸ (`detektiv-falsch-768.png`).
  - Das ist ein Hinweis auf uneinheitliche Bausteine. Gleiche Dinge sollten gleich aussehen.
- **Bei 768 px (`detektiv-falsch-768.png`) bleibt unter dem Kasten viel leere Fläche.** Das ist nur Leerraum, kein Fehler.
- **„Wissen vertiefen“ (`detektiv-richtig-390.png`, `detektiv-richtig-390-gross.png`):** 66 bis 85 px hoch, zweizeilig mit zentriertem Text und links stehendem Symbol. Das ist funktional, wirkt aber als Zweitknopf neben dem Hauptknopf etwas schwer. Es bleibt klar nachrangig, da weiß.

**Tippflächen**
- „Nächste Aufgabe“: 150 × 48 px (mit großer Schrift 187 × 54).
- „Erklärung vorlesen“: 141 × 44 px.
- „Rückmeldung vorlesen“: 167 × 44 px.
- „Wissen vertiefen“: 250 bis 420 × 48 bis 66 px.
- Alle erfüllen 44 px, aber „Vorlesen“ ist mit 44 px genau am Minimum.

**Fokus und Rollen im Detail**
- Falsche Antwort: Der Fokus bleibt auf der gewählten Antwort. Der Kasten endet 12 px über der Leiste (`people-falsch-320.png`, `people-falsch-390.png`).
- Richtige Antwort: Der Fokus liegt auf „Nächste Aufgabe“, der Knopf ist sichtbar (z. B. oben 499, unten 547 bei 320 px, Kastenunterkante 564).
- Bei großer Schrift ist der Fall „Kreuz und quer, falsch“ so kurz, dass die Seite nicht weiterrollt und unter dem Kasten schon der Fuß der Startseite („Was ist neu?“, „Für Eltern“) sichtbar wird (`kreuz-falsch-390-gross.png`). Das ist unproblematisch, wirkt aber etwas unruhig.

**Was gut ist (erhalten)**
- Der Kasten steht immer vollständig sichtbar und konsequent 12 px über der Leiste.
- Die kurze Auflösung bei „Wer war das?“ ist gut lesbar (max. 5 Zeilen bei 320 px).
- Der Fokus springt bei „Richtig!“ auf „Weiter“, und der Ring ist per Tastatur deutlich.
- „Richtig“ und „Falsch“ sind nicht nur farblich unterschieden: Häkchen, Text, Buchstabenmarke grün bzw. orange.
- Der Ton „Noch nicht ganz. Versuch es noch einmal!“ ist freundlich.
- Es gibt kein waagerechtes Scrollen und keine Überlappung mit der Leiste.

**Nicht geprüft**
- Echte Geräte, Safari oder WebKit (nur Chromium).
- Bildschirmleser, Rollverhalten bei „Bewegung reduzieren“.
- Fokus per Tastatur bei 768 px (der Versuch kam nicht bis „richtig“), zudem Tastaturfokus bei „Kreuz und quer“ und „Stimmt das wirklich?“ auf 320 und 1280 px.
- Mehrere Aufgaben, Stufenwechsel, Zurück und Neuladen.
