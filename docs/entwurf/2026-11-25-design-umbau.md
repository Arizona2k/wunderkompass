# Design-Umbau „Kompass“: Entwurf in Schritten (25.11.2026)

Stand: Entwurf von Claude, zur Freigabe durch den Nutzer. Grundlage:
- Entscheidung des Nutzers vom 25.11.2026: Stilprobe C „Kompass“ wird das neue Design, der Stempel kommt am Spielende, Gestaltung frei (Regel in `CLAUDE.md`).
- [Stilproben](2026-11-25-stilproben.md) mit `stilproben/c.css`, [Design-Prüfung C](2026-11-25-stilprobe-c-designpruefung.md), [Spieltest C](2026-11-25-stilprobe-c-spieltest.md).
- [Bestand im Code](2026-11-25-design-umbau-bestand.md) (wo welche Farben, Schriften, Klassen und Tests stecken).
- [Design-Prüfung](2026-11-25-personen-raetsel-designpruefung.md) und [Spieltest](2026-11-25-personen-raetsel-spieltest.md) der Personen-Rätsel, dazu BACKLOG Punkt 25 und „Ein Spielbrett für alle Spiele“.

## Ziel in einem Satz

Die ganze Seite sieht aus wie die Stilprobe C: Kartenpapier, Petrol für alles, was man antippt, Orange nur als Kompassnadel und Markierung, Andika zum Lesen, Bricolage für Überschriften, große Tippflächen. Dabei geht nichts kaputt: Pass, alte Links, Offline und alle Breiten laufen in jedem Schritt weiter.

## Was sich für Kinder ändert

- Ruhigere, einheitliche Seiten: ein Knopfstil, ein Fokusrahmen und eine Farbe für „hier kannst du tippen“ statt heute drei bis fünf.
- Leichter lesbar: Andika ist für Leseanfänger gemacht (eindeutiges a, l, I, 1), keine Trennstriche mitten im Wort, kein Text unter 16 px.
- Spiele: Die Rückmeldung und „Nächste Aufgabe“ sind immer zu sehen. Am Spielende gibt es einen Stempel, der sich einmal aufdrückt.
- Start und Welten: Foto-Kacheln mit Weltfarbe, eine Route „Weiter entdecken“, die Kompassrose als Zeichen der Seite.

## Leitlinien für alle Schritte

1. **Ein Ort für Farben und Maße.** Die Kompass-Werte kommen in den Kern (`app/kern/kern.css`, Namen `--kern-*` bleiben, damit nicht jede Datei neu muss). Die doppelten Sätze verweisen darauf: shadcn in `globals.css`, `--wk-*` in `discovery.css` und `foundation.css`, `--motiv-*` der Karte. Am Ende fallen die Doppel weg.
2. **Gleiche Bausteine für gleiche Dinge.** `primary-button`, `secondary-button`, `speech-button`, Tipp-Kasten, Antwortknopf und Rückmeldung bekommen je eine Fassung. Heute sind sie in `globals.css` mehrfach festgelegt.
3. **Tests im selben Schritt.** Feste Werte in Tests (Hintergrund, Fokusfarbe, Schriftname, Farbe der falschen Antwort) ändern sich mit dem Design. Sie werden im selben PR auf die neuen Werte gesetzt, nicht abgeschwächt: Ein Test prüft weiter Fokus, Kontrast und Tippflächen, nur mit den Kompass-Werten.
4. **Keine Änderung am Speicher.** Kein Schritt berührt den Pass, die IDs oder die Hash-Links. Texte, die Tests und Bildschirmleser finden (zum Beispiel „Entdeckerpass öffnen“, „Spielstempel sammeln“, die Leistenwörter), bleiben gleich, außer ein Schritt sagt ausdrücklich etwas anderes.
5. **Bewegung sparsam.** Nur der Stempel am Spielende und der leise Schimmer an Welt-Kacheln bewegen sich. Bei „Bewegung reduzieren“ steht alles still.
6. **Weltfarben nur als helle Tönung** mit dunkler Schrift oder hinter weißen Symbolen (Kontrast mindestens 4,5:1 für Text, 3:1 für Grafik).
7. **Dunkler Modus erst nach dem Umbau** (Frage des Nutzers, 25.11.2026; Abschnitt „Später: Schritt 8“). Bis dahin gilt: Neue und umgebaute Teile nehmen Farben nur aus den Kern-Werten, auch Zeichnungen (`currentColor` oder `var(--kern-…)` statt fester Hex-Werte), damit der dunkle Modus später billig wird. Große Schrift („große Schrift“ im Pass) und erzwungene Farben (`forced-colors`) bleiben bedienbar.

## Die Schritte

Jeder Schritt ist ein eigener PR nach `test-live` mit Vorschau, Helferprüfung und dem „ok“ des Nutzers. Jeder Schritt läuft für sich, die Seite ist nach jedem Merge vollständig benutzbar.

### Schritt 1: Farben, Fokus, Knöpfe (Grundlage)

- Kompass-Farben in `app/kern/kern.css`: Papier `#EDF1EA` als Grund, Tinte `#15314A` für Text, Petrol `#0B6B73` für Knöpfe, Links und Fokus, Orange `#D9650A` nur als Grafik, Grün `#2E7A55` für „Richtig“, Rot `#B5462F` für „noch nicht richtig“, Ränder `#788A80` (3,6:1), Weltfarben `--w-*` aus `c.css`. Radien 22, 14 und 8 px.
- shadcn-Werte (`globals.css`), beide `--wk-focus` und die Kartenfarben verweisen auf diese Werte.
- **Ein Fokusrahmen** für die ganze Seite: 3 px Petrol mit weißem Innenring (heute fünf Varianten in `globals.css`, `foundation.css`, `pass-atlas.css`, `discovery.css`, `book.css`, `playground.css`).
- **Knöpfe:** `primary-button` (Petrol, weiße Schrift), `secondary-button` (weiß, Petrol-Rand), `speech-button` je einmal festlegen, mindestens 48 px hoch; die Mehrfach-Regeln in `globals.css` fallen weg.
- **Kleinste Textgröße 16 px** in Bausteinen („Vorlesen“, „Brauchst du einen Tipp?“, Tipptext; heute 14 und 15 px). Bildnachweise 14 px.
- `index.html`: Beschreibung sagt heute „Kinder ab 8 Jahren“, die Zielgruppe ist 5 bis 10 (nebenbei richtigstellen).
- Tests mit festen Werten anpassen: `tests/browser/kern-huelle.mjs` (Hintergrund, Fokusfarbe), `tests/browser/karte-stufen.mjs` (Farbe der falschen Antwort) und, was die Suche nach `rgb(` und Hex-Werten in `tests/browser/` noch findet.
- Prüfen: `pnpm run check`, danach `core` und `offline-cold-full` (Regel für `kern.css`), dazu `discovery-central`, `pass-atlas`, `foundation`, `text-geometry` aus der Vollprüfung. `design-pruefer` in allen Breiten auf Start, Karte, Spiel, Pass, Labor, Reise.

### Schritt 2: Schriften

- **Andika** (400 und 700) für Text, **Bricolage Grotesque** für Überschriften; beide OFL, Lizenztexte nach `public/licenses/`. Selbst gehostet als `woff2` per `@font-face` im Kern; Vite legt sie mit Prüfsumme ab, die Offline-Liste nimmt jede `.woff2` von selbst auf (`build/learning-assets.mjs`). Kein fremder Dienst.
- **Größe:** Bricolage ist als variable Schrift 131 KB groß, mehr als beide Nunito-Dateien zusammen. Darum auf Latein und Latein-Erweiterung und die gebrauchten Stärken zuschneiden (Ziel: alle Schriften zusammen höchstens etwa 150 KB). Ein neues Budget `fontBytes` in `performance-budgets.json` hält das fest; heute gibt es für Schriften keins.
- **„Il“-Frage:** Überschriften in Stärke 720 bis 740 statt 780 und mit echten Titeln prüfen, die mit I anfangen (Ibn Sina, Ibn al-Haytham, Inge Lehmann, Igel, Insel).
- **Latein-Erweiterung:** prüfen, dass Andika „Białowieża“ und ähnliche Namen zeigt (Test `kern-huelle.mjs`, heute für Nunito).
- Keine automatische Silbentrennung (`hyphens: manual`).
- Danach `@fontsource-variable/nunito` aus `package.json` entfernen (Kein Bestandsschutz).
- Zeichnungen: Die Regel `svg { font-family: "Trebuchet MS" … }` (`kern.css`) auf Andika umstellen. Ändert das Textbreiten in den 46 alten Zeichnungen zu stark (Prüfung `text-geometry`), bekommen die Zeichnungen einen eigenen Schritt.
- Prüfen wie Schritt 1, dazu `offline-cold` (Schriften offline) und die WebKit-Kurzprüfung.

### Schritt 3: Hülle (Kopf, Leiste, Fuß)

- Kopf mit Kompass-Marke (Rose und orange Nadel), Suche und Pass als runde 48-px-Knöpfe; ab 900 px mit Wort, darunter nur Symbol mit Namen für Bildschirmleser.
- Leiste am Handy unten wie in C: sechs gleich große Felder, aktiver Punkt mit Petrol-Hinterlegung, der nicht springt, Fokus innen (Design-Prüfung C, Soll 6, Kann 3). Auf dem Rechner eine Reihe im Kopf.
- Fuß ruhig auf Papier, „Was ist neu?“ und „Für Eltern“ bleiben.
- Leistenwörter und die Namen „Entdeckerpass öffnen“ und „Lernwelt durchsuchen“ bleiben (58 und 9 Testdateien). Ob „Lernwelt durchsuchen“ zu „Suchen“ wird (BACKLOG Punkt 13), entscheidet dieser Schritt mit allen Tests in einem Durchgang.
- Prüfen: `kern-huelle`, `discovery-central`, `pass-atlas`, `foundation`; `spieltester` am Handy und Rechner.

### Schritt 4: Start und Welten

- Start: Tagesfrage mit großem Foto und Kompassrose (Rose berührt den Titel in keiner Breite, Design-Prüfung C, Soll 1), Route „Weiter entdecken“ mit Stand („x von y Karten entdeckt“, echte Zahl aus dem Pass), sechs Welt-Kacheln mit Foto und Weltfarbe.
- Fotos mit `srcset` bis 960 px, damit sie auf dem Rechner scharf sind (Soll 2).
- Schimmer nur auf Etikett und Rand der Kachel, nie über Foto oder Text (VISION, Soll 4); bei „Bewegung reduzieren“ ein ruhiger farbiger Rand.
- „Wissenschaft & Weltall“ hat noch kein freies Foto: Auftrag an `bild-recherche` vor diesem Schritt; bis dahin die gekennzeichnete Zeichnung.
- Weltenseiten mit denselben Kacheln.
- Prüfen: `discovery-central`, `smoke`, Welt-Suiten; `design-pruefer`, `spieltester`.

### Schritt 5: Wissenskarte

- Karte im Kompass-Aussehen: Foto mit Nachweis, „Kurz erklärt“, „Rate mal!“, „Stimmt das?“, Steckbrief, „Dazu passt“. Ab 700 px zweispaltig (Design-Prüfung C, Soll 5).
- Kartenfarben (`--motiv-*`) aus den Weltfarben.
- Die alte `article-workshop.css` in der Karte durch Kern-Bausteine ersetzen.
- Prüfen: `pnpm run check`, dann `core` und `offline-cold-full` (Pflicht bei Kartenaufbau), `wissenskarte`, `karte-stufen`.

### Schritt 6: Ein Spielbrett für alle Spiele, Stempel am Spielende

- Welt-Spiele, Kreuz und quer und Klassik-Spiele bekommen dasselbe Brett (BACKLOG „Ein Spielbrett für alle Spiele“).
- Kurze Überschrift, langer Hinweis als Absatz darunter (Personen und Tierdetektiv gleich); „Vorlesen“ neben der Überschrift; Antworten bei 320 px im ersten Bild. Viele Tests finden die Frage über die Überschrift (`getByRole('heading', {name: …})`); sie werden in einem Durchgang angepasst.
- Nach einer falschen Antwort steht der Tipp im Rückmeldekasten; nach einer richtigen bleibt „Nächste Aufgabe“ über der Leiste sichtbar.
- **Stempel am Spielende:** Nach der letzten Aufgabe heißt der Knopf weiter „Spielstempel sammeln“. Danach drückt sich ein Stempel einmal auf (0,45 s; bei „Bewegung reduzieren“ sofort fertig), daneben „Eine ganze Runde gelöst!“ und als Hauptknopf „Noch eine Runde“, darunter „Zu einer passenden Entdeckerkarte“. Nach jeder einzelnen richtigen Antwort steht nur das grüne „Richtig!“ (Entscheidung des Nutzers).
- Ein Fortschritt mit Häkchen für alle Spiele. Beim Stufenwechsel mitten in der Runde ein Hinweis, dass eine neue Runde beginnt (BACKLOG Punkt 25).
- Prüfen: `playground`, `spiel-auswahl`, `world-game-learning-copy`, `learning-tasks`, CI-Suite `spiel-fokus`; `design-pruefer`, `spieltester` als 6-Jährige am Handy und 11-Jähriger am Rechner.

### Schritt 7: Der Rest und Aufräumen

- Labore, Lernreisen, Wissensbuch, Pass, Dialoge („Für Eltern“, Hilfe, Suche) auf die Kern-Bausteine.
- Unbenutzte Klassen aus `globals.css` streichen (Liste im Bestand, Abschnitt 6), ebenso die `--wk-*`-Doppel und die alten Fokusregeln.
- Am Ende `test:full` in Chromium, Firefox und WebKit und die CI-Vollprüfung von Hand, weil sich fast jede Seite geändert hat.

## Reihenfolge mit den anderen Arbeiten

1. Erst der laufende PR „Wer war das?“, dann der kleine PR „Auflösung und Rückmeldung im Blick“ (kurze Auflösung je Person, kindgerechte Tipps, Rückmeldung immer sichtbar, CI-Suite `spiel-fokus`).
2. Dann Schritt 1 und 2 (Grundlage). Sie ändern das Aussehen überall auf einmal und sind die Voraussetzung für alles Weitere.
3. **PR 3** (neue Spiele „Rekorde der Natur“, „Wetter und Klima“, „Sortiere die Zeit“) nach Schritt 2 und vor Schritt 6: Die neuen Spiele benutzen die gemeinsamen Bausteine, und das neue Spielbrett in Schritt 6 nimmt sie gleich mit.
4. Schritte 3 bis 7 nacheinander. Bilder (Mandela, Zeitreise, Erfindungen, Weltall-Foto) laufen im Hintergrund weiter.

## Alle Wege prüfen (je Schritt)

- **Pass:** keine Änderung an Speicher, Schlüsseln oder Feldern. Prüfung: `test:browser` (Pass, Sicherung, alte Links) in jedem PR.
- **Alte Links:** keine Änderung an Routen. Prüfung wie oben.
- **Offline:** neue Schriften und Bilder müssen in der Offline-Liste stehen. Prüfung: `offline-cold`, ab Schritt 2 auch in WebKit.
- **Breiten:** 320, 390, 768, 1024, 1280 und 1440 px, dazu große Schrift und erzwungene Farben.
- **Wege zu jeder Seite:** Leiste, Startseite, Suche, Wissensbuch, Lernreise, Zurück, Neuladen: Jede Seite sieht gleich aus, egal woher man kommt.

## Risiken

- **Feste Werte in den Tests:** Hintergrund, Fokusfarbe und Schrift in `kern-huelle.mjs`, die Farbe der falschen Antwort in `karte-stufen.mjs`, viele Prüfungen auf 44 px statt 48 px in rund 40 Suiten. Werden im jeweiligen Schritt angepasst, nicht abgeschwächt.
- **Die große `globals.css`** (110 KB, eine lange Zeile je Regelgruppe): Alte Klassen prägen fast alle Bereiche. Darum zuerst die Bausteine zentral umstellen (Schritt 1), dann Bereich für Bereich.
- **Größe:** Beim CSS gibt es rund 100 KB Luft im Budget; für Schriften gibt es noch kein Budget (kommt in Schritt 2).
- **Bricolage „Il“:** wird mit echten Titeln geprüft (Schritt 2); notfalls Eigennamen mit I in Andika fett.

## Später: Schritt 8 „Nachtkarte“ (dunkler Modus)

Frage des Nutzers am 25.11.2026: „dunkler modus sinnvoll?“ Empfehlung von Claude: ja, aber erst nach Schritt 7. **Entschieden:** Der Nutzer überlässt Claude den Zeitpunkt („entscheide selber wann ein nachtmodus kommt“). Claude plant ihn als Schritt 8 direkt nach Schritt 7, mit eigenem Entwurf und Vorschau.
- **Wofür:** abends am Tablet oder Handy blendet eine helle Seite, und manche Familien stellen ihre Geräte ganz auf dunkel. Für Menschen, die Licht schlecht vertragen, ist es eine echte Hilfe.
- **Warum nicht gleich:** Bei normalem Licht lesen die meisten dunkle Schrift auf hellem Grund leichter; hell bleibt darum der Standard. Und heute stecken Farben an vielen Orten fest im Code: allein 292 feste `fill`- und `stroke`-Farben in Zeichnungen (`app/**/*.tsx`), dazu `globals.css`, Karten, Globus und Schaubilder. Ein dunkler Modus jetzt hieße, alles doppelt zu bauen und doppelt zu prüfen. Nach Schritt 7 laufen die Farben über die Kern-Werte; dann ist es vor allem eine zweite Farbtabelle plus die Zeichnungen.
- **Idee:** keine bloße Umkehrung, sondern eine „Nachtkarte“: tiefes Blau (die Tinte `#15314A` als Grund), helle Schrift, die orange Nadel leuchtet, dazu leise Sterne am Rand. Das passt zum Kompass und zur Welt „Weltall“.
- **So gebaut:** folgt der Einstellung des Geräts (`prefers-color-scheme`), ohne neues Feld im Pass. Ein eigener Schalter käme erst, wenn Familien ihn vermissen; er bräuchte den Beleg aus `CLAUDE.md` („Ein Lernspeicher“).
- **Prüfen:** Kontrast in beiden Modi, Fotos und Zeichnungen auf dunklem Grund, `forced-colors`, `design-pruefer` in beiden Modi.

## Nicht in diesem Umbau

- Neue Inhalte, Spiele oder Labore (eigene PRs).
- Der 3D-Globus (Phase 4).
