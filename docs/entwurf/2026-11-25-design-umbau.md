# Design-Umbau „Kompass“: Entwurf in Schritten (25.11.2026)

Stand: Entwurf von Claude, zur Freigabe durch den Nutzer. Grundlage:
- Entscheidung des Nutzers vom 25.11.2026: Stilprobe C „Kompass“ wird das neue Design, der Stempel kommt am Spielende, Gestaltung frei (Regel in `CLAUDE.md`).
- [Stilproben](2026-11-25-stilproben.md) mit `stilproben/c.css`, [Design-Prüfung C](2026-11-25-stilprobe-c-designpruefung.md), [Spieltest C](2026-11-25-stilprobe-c-spieltest.md).
- [Bestand im Code](2026-11-25-design-umbau-bestand.md) (wo welche Farben, Schriften, Klassen und Tests stecken).
- [Design-Prüfung](2026-11-25-personen-raetsel-designpruefung.md) und [Spieltest](2026-11-25-personen-raetsel-spieltest.md) der Personen-Rätsel, dazu BACKLOG Punkt 25 und „Ein Spielbrett für alle Spiele“.

> Gegengelesen vom `code-pruefer` am 25.11.2026 ([Bericht](2026-11-25-design-umbau-codepruefung.md)); alle Muss- und Soll-Punkte sind unten in die Schritte eingearbeitet, die Kann-Punkte ebenfalls. Offen bis zum jeweiligen Schritt: Größe der Fontsource-Pakete, reservierter Schriftname bei Andika (Zuschnitt), `unicode-range` in Firefox und WebKit.

## Ziel in einem Satz

Die ganze Seite sieht aus wie die Stilprobe C: Kartenpapier, Petrol für alles, was man antippt, Orange nur als Kompassnadel und Markierung, Andika zum Lesen, Bricolage für Überschriften, große Tippflächen. Dabei geht nichts kaputt: Pass, alte Links, Offline und alle Breiten laufen in jedem Schritt weiter.

## Was sich für Kinder ändert

- Ruhigere, einheitliche Seiten: ein Knopfstil, ein Fokusrahmen und eine Farbe für „hier kannst du tippen“ statt heute drei bis fünf.
- Leichter lesbar: Andika ist für Leseanfänger gemacht (eindeutiges a, l, I, 1), keine Trennstriche mitten im Wort, kein Text unter 16 px.
- Spiele: Die Rückmeldung und „Nächste Aufgabe“ sind immer zu sehen. Am Spielende gibt es einen Stempel, der sich einmal aufdrückt.
- Start und Welten: Foto-Kacheln mit Weltfarbe, eine Route „Weiter entdecken“, die Kompassrose als Zeichen der Seite.

## Leitlinien für alle Schritte

1. **Ein Ort für Farben und Maße.** Die Kompass-Werte kommen in den Kern (`app/kern/kern.css`, Namen `--kern-*` bleiben, damit nicht jede Datei neu muss). Die doppelten Sätze verweisen darauf: shadcn in `globals.css`, `--wk-*` in `discovery.css` und `foundation.css`, `--motiv-*` der Karte. Am Ende fallen die Doppel weg. **Wichtig (Codeprüfung M1):** `kern.css` steht im Bundle *vor* den eigenen Regeln von `globals.css` und vor den nachgeladenen CSS-Teilen (Karte, Reisen, Buch, Dialoge); gleich spezifische Regeln von dort gewinnen, dazu kommen `!important`-Regeln. Darum löscht jeder Schritt die alten Regeln und die Gegenregeln mit `!important` im selben PR, statt nur umzulenken, und prüft je Baustein mit `getComputedStyle` (Farbe, Größe, Fokus) auch in einem nachgeladenen Bereich (Karte oder Reise).
2. **Gleiche Bausteine für gleiche Dinge.** `primary-button`, `secondary-button`, `speech-button`, Tipp-Kasten, Antwortknopf und Rückmeldung bekommen je eine Fassung. Heute sind sie in `globals.css` mehrfach festgelegt.
3. **Tests im selben Schritt.** Feste Werte in Tests (Hintergrund, Fokusfarbe, Schriftname, Farbe der falschen Antwort) ändern sich mit dem Design. Sie werden im selben PR auf die neuen Werte gesetzt, nicht abgeschwächt: Ein Test prüft weiter Fokus, Kontrast und Tippflächen, nur mit den Kompass-Werten.
4. **Keine Änderung am Speicher.** Kein Schritt berührt den Pass, die IDs oder die Hash-Links. Texte, die Tests und Bildschirmleser finden (zum Beispiel „Entdeckerpass öffnen“, „Spielstempel sammeln“, die Leistenwörter), bleiben gleich, außer ein Schritt sagt ausdrücklich etwas anderes. Das gemeinsame Spielbrett (Schritt 6) ist nur Darstellung: Spielkennungen, Präfixe (`world:`, `challenge:`, `classic:`, `topic:`), `onWin`-Kennungen, `gameSessions` und `geschafft` bleiben wie sie sind.
5. **Bewegung sparsam.** Nur der Stempel am Spielende und der leise Schimmer an Welt-Kacheln bewegen sich; die Nadel pendelt nicht (anders als in der Stilprobe). Bei „Bewegung reduzieren“ steht alles still, auf beiden Wegen: Systemeinstellung (`prefers-reduced-motion`) und Pass-Einstellung (`data-reduced-motion` an `.earth-app`). Alles, was sich bewegt, sieht im Grundzustand schon fertig aus (Stempel aufgedrückt, kein Schimmer über dem Foto), damit `animation:none` nichts Halbes zeigt (Codeprüfung S6).
6. **Weltfarben nur als helle Tönung** mit dunkler Schrift oder hinter weißen Symbolen (Kontrast mindestens 4,5:1 für Text, 3:1 für Grafik).
7. **Dunkler Modus erst nach dem Umbau** (Frage des Nutzers, 25.11.2026; Abschnitt „Später: Schritt 8“). Bis dahin gilt: Neue und umgebaute Teile nehmen Farben nur aus den Kern-Werten, auch Zeichnungen (`currentColor` oder `var(--kern-…)` statt fester Hex-Werte), damit der dunkle Modus später billig wird. Große Schrift („große Schrift“ im Pass) und erzwungene Farben (`forced-colors`) bleiben bedienbar.
8. **Prüfen mit echten Suitennamen** (Codeprüfung M2, M6). `run.mjs` kennt Suiten, keine Dateinamen: Die Hilfsdateien `discovery-central`, `foundation`, `text-geometry`, `karte-stufen` laufen in den Suiten `home`, `home-visits`, `core`, `kern-huelle`, `offline-cold`, `components`, `performance`, `people-learning`, `offline-resilience`, `journeys`, `wissenskarte`. Nach Schritt 1, 2 und 6 startet Claude zusätzlich die CI-„Vollprüfung“ von Hand auf dem Branch, weil diese Schritte fast jede Seite ändern. Jeder sichtbare Schritt bekommt einen Eintrag in „Was ist neu?“.

## Die Schritte

Jeder Schritt ist ein eigener PR nach `test-live` mit Vorschau, Helferprüfung und dem „ok“ des Nutzers. Jeder Schritt läuft für sich, die Seite ist nach jedem Merge vollständig benutzbar.

### Schritt 1: Farben, Fokus, Knöpfe (Grundlage)

- Kompass-Farben in `app/kern/kern.css`: Papier `#EDF1EA` als Grund, Tinte `#15314A` für Text, Petrol `#0B6B73` für Knöpfe, Links und Fokus, Orange `#D9650A` nur als Grafik, Grün `#2E7A55` für „Richtig“, Rot `#B5462F` für „noch nicht richtig“, Ränder `#788A80` (3,2:1 auf Papier, reicht für Ränder ab 3:1), Weltfarben `--w-*` aus `c.css` (Weiß auf `--w-tiere` nur für Symbole, nicht für Text: 4,3:1). Radien 22, 14 und 8 px.
- shadcn-Werte (`globals.css`), beide `--wk-focus` und die Kartenfarben verweisen auf diese Werte.
- **Ein Fokusrahmen** für die ganze Seite: 3 px Petrol mit weißem Innenring (heute fünf Varianten in `globals.css`, `foundation.css`, `pass-atlas.css`, `discovery.css`, `book.css`, `playground.css`).
  Dazu (Codeprüfung S5): `.journey-reader :focus-visible` (`journeys.css`), `research.css`, `.dazu-passt-kachel` (`karte.css`) und der Ring der shadcn-Bausteine (`components/ui/*`); die spezifischeren Regeln werden gelöscht. Die Gegenstücke für erzwungene Farben (`CanvasText`, `Highlight`) bekommen eine gemeinsame Regel. Der weiße Innenring darf eigene Schatten nicht überschreiben (z. B. `.stufen-knopf[aria-pressed]`): `outline` plus `outline-offset` statt `box-shadow`.
- **Knöpfe:** `primary-button` (Petrol, weiße Schrift), `secondary-button` (weiß, Petrol-Rand), `speech-button` je einmal festlegen, mindestens 48 px hoch; die Mehrfach-Regeln in `globals.css` fallen weg. Dazu, damit Kinder bis Schritt 7 nicht drei Knopfstile nebeneinander sehen (Codeprüfung S8): Antwortknopf `quiz-answer`, Wahlknöpfe `.visual-choice button` (31 Dateien) und `model-choice`, die Hover-Werte, und `--wk-teal` verweist auf den Kern. Eine kurze Tabelle „alter Hex-Wert → Kern-Wert“ für die sichtbarsten Farben aus `globals.css` (720 feste Hex-Werte) kommt in den PR.
- **Große Schrift** (Pass-Einstellung) als feste Stufe im Kern, etwa +20 % auf alle Bausteine, statt `1.15rem!important` in `globals.css:44`; sonst wächst sie nach dem Umbau kaum noch (Codeprüfung S7). Der Test `lesbarkeit.mjs` prüft dann die Stufe, nicht nur „größer“.
- **Kleinste Textgröße 16 px** in Bausteinen („Vorlesen“, „Brauchst du einen Tipp?“, Tipptext; heute 14 und 15 px). Bildnachweise 14 px.
- `index.html`: Beschreibung sagt heute „Kinder ab 8 Jahren“, die Zielgruppe ist 5 bis 10 (nebenbei richtigstellen).
- Tests mit festen Werten anpassen: `tests/browser/kern-huelle.mjs` (Hintergrund, Fokusfarbe), `tests/browser/karte-stufen.mjs` (Farbe der falschen Antwort) und, was die Suche nach `rgb(` und Hex-Werten in `tests/browser/` noch findet.
- Prüfen: `pnpm run check`, danach `node tests/browser/run.mjs --suite full core offline-cold-full home home-visits components journeys` (Regel für `kern.css` und Leitlinie 8), danach die CI-Vollprüfung von Hand. `design-pruefer` in allen Breiten auf Start, Karte, Spiel, Pass, Labor, Reise.

### Schritt 2: Schriften

- **Andika** (400 und 700) für Text, **Bricolage Grotesque** für Überschriften; beide OFL, Lizenztexte nach `public/licenses/`, der Lizenz-Link in `app/parent-guide.tsx:17` zeigt danach dorthin. Selbst gehostet als `woff2`; Vite legt sie mit Prüfsumme ab, die Offline-Liste nimmt jede `.woff2` von selbst auf (`build/learning-assets.mjs`). Kein fremder Dienst.
- **Je Schrift zwei Teile, Latein und Latein-Erweiterung**, mit `unicode-range` wie heute bei Nunito (Codeprüfung M3): Die Dateien der Stilprobe haben nur 226 bis 232 Zeichen, ohne ł, ż, ō, ū, ā; der Katalog braucht sie (Białowieża, japanische und hawaiische Namen). Weg: Fontsource-Pakete (`@fontsource/andika`, `@fontsource-variable/bricolage-grotesque`), exakt gepinnt und mindestens 7 Tage alt, wie heute bei Nunito. Nie direkt aus `docs/` oder `vendor/` einbinden: Der Build-Fingerabdruck (`build/learning-fingerprint.mjs:8`) erfasst diese Ordner nicht, ein Tausch dort könnte die Offline-Bereitschaft kosten (Codeprüfung S1; `vendor` kommt dabei gleich in die Liste).
- **Die Regeln für `body` und `--font-sans` in `globals.css:16-17` werden ersetzt**, sonst kommt die neue Schrift nicht durch (M1). Fließtext in Stärke 400 statt 500 (Andika hat nur 400 und 700). Ebenso `globals.css:121` (Trebuchet in Kapitel-Zeichnungen) und `system-ui` in `book-cell-process-figure.css` und `book-gene-figures.css`.
- **Verrutschen beim Laden:** Ersatzschrift mit passenden Maßen (`size-adjust`, `ascent-override`) oder `preload` für die Text-Schrift; die Suite `performance` misst `homeCls ≤ 0.1` und LCP (Codeprüfung S3).
- **Größe:** Bricolage ist als variable Schrift 131 KB groß, mehr als beide Nunito-Dateien zusammen. Darum auf Latein und Latein-Erweiterung und die gebrauchten Stärken zuschneiden (Ziel: alle Schriften zusammen höchstens etwa 150 KB). Ein neues Budget `fontBytes` in `performance-budgets.json` hält das fest; heute gibt es für Schriften keins. Dazu braucht `scripts/performance-budget.mjs` eine Messung (Summe aller `dist/assets/*.woff2`), sonst gilt der fehlende Wert als Verstoß; `tests/foundation.test.mjs:38` bekommt den Schlüssel (Codeprüfung S2).
- **„Il“-Frage:** Überschriften in Stärke 720 bis 740 statt 780 und mit echten Titeln prüfen, die mit I anfangen (Ibn Sina, Ibn al-Haytham, Inge Lehmann, Igel, Insel).
- **Latein-Erweiterung:** prüfen, dass Andika „Białowieża“ und ähnliche Namen zeigt (Test `kern-huelle.mjs:88-99`, heute für Nunito). Die Offline-Prüfung `offline-cold.mjs:78-83` nennt Nunito beim Namen; sie wird auf alle drei Schriften erweitert (Andika 400, Andika 700, Bricolage), damit eine fehlende Überschriften-Schrift offline auffällt (Codeprüfung M4).
- Silbentrennung bleibt wie heute: Überschriften trennen erst ab 10 Buchstaben (`kern.css:313-317`, Test `kern-huelle.mjs:629-650`), lange Kartentitel dürfen trennen. Die Stilprobe wollte `hyphens: manual`; das bräche bei 320 px lange Wörter ohne Bindestrich um und ist für Leseanfänger schlechter (Codeprüfung S4).
- Danach `@fontsource-variable/nunito` mit `pnpm remove` entfernen (Lockfile, CI mit `--frozen-lockfile`), im selben Commit `kern.css:5-21`, `globals.css:16-17`, beide Schrift-Tests, der Lizenz-Link und `public/licenses/nunito-OFL.txt`; danach nach `@fontsource` suchen, weil Vite ein fehlendes `url()` nur warnt.
- Zeichnungen: Die Regel `svg { font-family: "Trebuchet MS" … }` (`kern.css`) auf Andika umstellen. Ändert das Textbreiten in den 46 alten Zeichnungen zu stark (Prüfung `text-geometry`), bekommen die Zeichnungen einen eigenen Schritt.
- Prüfen wie Schritt 1, dazu `offline-cold` (Schriften offline), `performance` und die WebKit-Kurzprüfung; danach die CI-Vollprüfung von Hand (Textbreiten in Buch, Laboren, Tieren, Reisen).

### Schritt 3: Hülle (Kopf, Leiste, Fuß)

- Kopf mit Kompass-Marke (Rose und orange Nadel), Suche und Pass als runde 48-px-Knöpfe; ab 900 px mit Wort, darunter nur Symbol mit Namen für Bildschirmleser.
- Leiste am Handy unten wie in C: sechs gleich große Felder, aktiver Punkt mit Petrol-Hinterlegung, der nicht springt, Fokus innen (Design-Prüfung C, Soll 6, Kann 3). Auf dem Rechner eine Reihe im Kopf.
- Leistenwörter mindestens 14 px (Test `kern-huelle.mjs:173`), Ziel 16 px; die 13 px aus der Stilprobe nicht übernehmen. Bei 320 px hat jedes Feld nur etwa 53 px: mit der neuen Schrift und großer Schrift auf Abgeschnittenes prüfen (Codeprüfung S9).
- Fuß ruhig auf Papier, „Was ist neu?“ und „Für Eltern“ bleiben.
- Marke überall gleich: `public/favicon.svg`, `public/learning.webmanifest` (`theme_color`, `background_color`) und die PNG-Symbole (Codeprüfung K3).
- Leistenwörter und die Namen „Entdeckerpass öffnen“ und „Lernwelt durchsuchen“ bleiben (58 und 9 Testdateien). Ob „Lernwelt durchsuchen“ zu „Suchen“ wird (BACKLOG Punkt 13), entscheidet dieser Schritt mit allen Tests in einem Durchgang.
- Prüfen: `pnpm run check` (darin `kern-huelle`, `pass-atlas`, `performance`), dazu `--suite full home home-visits components`; `spieltester` am Handy und Rechner.

### Schritt 4: Start und Welten

- Start: Tagesfrage mit großem Foto und Kompassrose (Rose berührt den Titel in keiner Breite, Design-Prüfung C, Soll 1), Route „Weiter entdecken“ mit Stand („x von y Karten entdeckt“, echte Zahl aus dem Pass; gezählt werden nur Karten, die es im Katalog noch gibt, sonst wäre „12 von 10“ möglich), sechs Welt-Kacheln mit Foto und Weltfarbe.
- Fotos mit `srcset` bis 960 px, damit sie auf dem Rechner scharf sind (Soll 2).
- Schimmer nur auf Etikett und Rand der Kachel, nie über Foto oder Text (VISION, Soll 4); bei „Bewegung reduzieren“ ein ruhiger farbiger Rand.
- „Wissenschaft & Weltall“ hat noch kein freies Foto: Auftrag an `bild-recherche` vor diesem Schritt; bis dahin die gekennzeichnete Zeichnung.
- Weltenseiten mit denselben Kacheln.
- Prüfen: `pnpm run check`, `--suite full home home-visits core offline-cold-full`; `design-pruefer`, `spieltester`.

### Schritt 5: Wissenskarte

- Karte im Kompass-Aussehen: Foto mit Nachweis, „Kurz erklärt“, „Rate mal!“, „Stimmt das?“, Steckbrief, „Dazu passt“. Ab 700 px zweispaltig (Design-Prüfung C, Soll 5).
- Kartenfarben (`--motiv-*`) aus den Weltfarben.
- Die alte `article-workshop.css` in der Karte durch Kern-Bausteine ersetzen.
- Prüfen: `pnpm run check` (darin `wissenskarte` mit den Stufen-Prüfungen), dann `--suite full core offline-cold-full` (Pflicht bei Kartenaufbau).

### Schritt 6: Ein Spielbrett für alle Spiele, Stempel am Spielende

- Welt-Spiele, Kreuz und quer und Klassik-Spiele bekommen dasselbe Brett (BACKLOG „Ein Spielbrett für alle Spiele“).
- Kurze Überschrift, langer Hinweis als Absatz darunter (Personen und Tierdetektiv gleich); „Vorlesen“ neben der Überschrift; Antworten bei 320 px im ersten Bild. Viele Tests finden die Frage über die Überschrift (`getByRole('heading', {name: …})`); sie werden in einem Durchgang angepasst.
- Nach einer falschen Antwort steht der Tipp im Rückmeldekasten; nach einer richtigen bleibt „Nächste Aufgabe“ über der Leiste sichtbar.
- **Stempel am Spielende:** Nach der letzten Aufgabe heißt der Knopf weiter „Spielstempel sammeln“. Danach drückt sich ein Stempel einmal auf (0,45 s; bei „Bewegung reduzieren“ sofort fertig), daneben „Eine ganze Runde gelöst!“ und als Hauptknopf „Noch eine Runde“, darunter „Zu einer passenden Entdeckerkarte“. Nach jeder einzelnen richtigen Antwort steht nur das grüne „Richtig!“ (Entscheidung des Nutzers).
- Ein Fortschritt mit Häkchen für alle Spiele. Beim Stufenwechsel mitten in der Runde ein Hinweis, dass eine neue Runde beginnt (BACKLOG Punkt 25).
- Texte, die Tests festhalten, in einem Durchgang anpassen: „Alle 8 Aufgaben sind gelöst. …“ und der Fokus auf „Eine ganze Runde gelöst!“ (`spiel-auswahl.mjs:162-163`), „Neue Runde“ statt „Noch eine Runde“ in fünf Testdateien (Codeprüfung K6).
- **Pass mitten in einer Runde** (Codeprüfung M5): Ein alter Testpass (z. B. `tests/fixtures/retained-animal-game-before-expansion.json`) mit halber Runde: neu laden, weiterspielen, Stempel holen. Der Hinweis „beim Stufenwechsel beginnt eine neue Runde“ ändert nur, was das Kind sieht, nicht, wie Runden gespeichert sind.
- Prüfen: `pnpm run check` (darin `pass-spielstaende`, `animal-game-saves`, `spiel-auswahl`, `habitat-answer-semantics`, `retained-answer-wording`, `people-learning`, `spiel-fokus`), dazu `--suite full playground challenge journeys`, danach die CI-Vollprüfung von Hand; `design-pruefer`, `spieltester` als 6-Jährige am Handy und 11-Jähriger am Rechner.

### Schritt 7: Der Rest und Aufräumen

- Labore, Lernreisen, Wissensbuch, Pass, Dialoge („Für Eltern“, Hilfe, Suche) auf die Kern-Bausteine.
- Unbenutzte Klassen aus `globals.css` streichen (Liste im Bestand, Abschnitt 6), ebenso die `--wk-*`-Doppel und die alten Fokusregeln. Vorher jede Klasse auch in `.json` und in zusammengesetzten Namen suchen: `model-solar-system` entsteht aus `'model-'+kind` (`world-models.tsx:10`), die CI-Suite `solar-labels` braucht sie (Codeprüfung S10).
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

- **Feste Werte in den Tests:** Hintergrund, Fokusfarbe und Schrift in `kern-huelle.mjs`, die Farbe der falschen Antwort in `karte-stufen.mjs`, Werden im jeweiligen Schritt angepasst, nicht abgeschwächt. Die Prüfungen auf 44 px sind Untergrenzen und scheitern bei 48 px nicht (Codeprüfung K10). Farbangaben in Zeichnungen stehen in fünf Tests (Codeprüfung K9) und zählen erst, wenn Zeichnungen umgefärbt werden; der Seitentitel steht in `core.mjs:34` (K8).
- **Die große `globals.css`** (110 KB, eine lange Zeile je Regelgruppe, 720 feste Hex-Farben, nur 28 `var()`): Alte Klassen prägen fast alle Bereiche, `--kern-grund` wird nie benutzt (der Grund kommt aus `--background`). Darum zuerst die Bausteine zentral umstellen und die alten Regeln löschen (Schritt 1), dann Bereich für Bereich (Codeprüfung S8).
- **Größe:** Die engste Grenze ist `entryCssGzipBytes` (60 000, gemessen 45 684, also etwa 14 KB Luft), solange Alt und Neu nebeneinander stehen; darum alte Regeln im selben Schritt löschen (Codeprüfung K7). Für Schriften gibt es noch kein Budget (kommt in Schritt 2).
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
