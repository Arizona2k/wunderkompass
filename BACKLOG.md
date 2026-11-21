# BACKLOG

Stand: 21.11.2026. Die eine priorisierte Aufgabenliste. Oben das Nächste, unten Ideen.
Der alte Aufgabenbestand (498 Zeilen, Pakete und WK-Nummern) liegt im alten Stand: `git show b53f75f:BACKLOG.md`.
Übernommen wurden nur produktrelevante offene Punkte; WK-Nummern stehen in Klammern zum Nachschlagen.

## Phase 1 – Neuer Kern (als Nächstes)

Ziel: Kinder finden in Sekunden etwas Spannendes und können sofort etwas tun. Zuerst das Handy (320–390 px), dann Tablet und Rechner.

1. **Entwurf** in `docs/entwurf/` mit Skizzen für Handy und Rechner, Freigabe durch den Nutzer.
2. **Design-System:** Schrift, Farben (hell, Orange und Petrol als Akzente), Abstände, Tippflächen, Kacheln mit „Glossy“-Schimmer (Antippen auf Touch, ruhig bei „Bewegung reduzieren“), Bild- und Fotorahmen, Bewegung. Einheitlich für alle Bereiche; jeder Baustein mit Tastatur bedienbar und mit sichtbarem Fokus (Katalog 2027, Abschnitt 5).
3. **Startseite „Entdecken“:** eine Frage mit großem Bild, Weiter-machen, Entdeckung des Tages, frühe Themen, Suche. Doppelte Titel und Einleitungen weg; das erste Motiv im ersten Bildschirm (WK-053, WK-057).
4. ~~**Navigation**~~ erledigt in Teilschritt 1: eine Leiste mit sechs Bereichen, am Handy unten, nichts abgeschnitten.
5. **Themenwelt-Seite:** Themen als große Bildkacheln, Filter ohne langen Vorlauf (WK-053: mobile Tierübersicht).
6. **Neue Wissenskarte:** kurz und kindgerecht oben, Vertiefung („Mehr erfahren“, später „Für Große“) freiwillig, Bild mit Nachweis, ein kleines Tun (raten, tippen), Verbindungen zu echten Nachbarn (Ziel 6).
7. **Bildwirkung:** Bilder laden ohne graue Platzhalter im ersten Bildschirm (Löwe/Gepard bei 1440 px), Fotos füllen die Kartenbreite (Elefant).
8. **Verbindungen (Ziel 6):** 15 von 196 erklärten Verbindungen haben keine Rückrichtung im `related`-Feld; zufällig wirkende Nachbarn (Elefant → Honigbiene, Großer Panda) durch fachlich echte ersetzen.
9. **Befunde des `design-pruefer` aus Schritt 0** (Startseite, Tierwelt, Eisbär-Karte bei 360 und 1280 px):
   - ~~Großer Petrol-Rahmen nach einem Seitenwechsel~~ erledigt in Teilschritt 1 (Rahmen nur bei Tastaturbedienung, Sprungziel bleibt).
   - Tippflächen teils unter 44 px; sehr kleine, blasse Meta-Texte und Bildnachweise (Kontrast nach WCAG AA prüfen).
   - Fotos auf Welt- und Startkacheln mit Rand statt formatfüllend (`object-fit: cover` mit sinnvollem Bildausschnitt).
   - Feinschliff: Texteinzug in Karten ungleich, auf 360 px kommt das Motiv spät, einzelner Pfeil ohne Beschriftung, uneinheitliche Bedienelemente, abstrakte Einstiegsfragen.
10. **Prüfen:** `design-pruefer` in 320, 390, 768, 1280 und 1440 px, Rauchtest-Bilder vorher/nachher, Pass und alte Links unverändert.
11. ~~**„Was ist neu?“ in der App**~~ erledigt in Teilschritt 1: eigene Seite, kurze Einträge mit Symbol, neueste oben, alte Chronik unter „Früher“; `app/update-history.ts` mit den verwaisten Verweisen ist gelöscht. Ab jetzt bekommt jede sichtbare Änderung einen Eintrag (`app/kern/neuigkeiten.ts`).

12. **Rückmeldung eines 10-jährigen Kindes (21.11.2026):** schnell gelangweilt, zu viel Text, Spiele und Aufgaben zu leicht. Eine einzelne Rückmeldung, keine Studie; sie passt aber zu den Befunden der Helfer. Daraus die freigegebene Ergänzung `docs/entwurf/2026-11-21-phase-1-ergaenzung-spannung.md` („Weniger lesen, mehr knobeln“). Phase 1 hat seitdem sechs Teilschritte:
    - **Teilschritt 2 „Wissenskarte“** zusätzlich: A1 Längen-Budget (etwa 120 Wörter offen, Rest nach „Für Große“/„Für Erwachsene“), A2 Aufräumen über alle 204 Karten (Skript-Doppelungen aus `content/enrich_world.py`, gleicher Geschichtssatz auf 25 Karten, Lernziele und Erwachsenensätze, sechs Mini-Fragen mit Textverweis), A3 Häppchen (`chapters`) für etwa 12 Pilot-Karten, A4 Baustein „Stimmt das?“, A5 Reisen zeigen `starter` offen und `text` unter „Für Große“; B7 Stufe 2: je zwei bis drei neue Fragen für die Pilot-Karten.
    - **Teilschritt 3 „Kniffliger spielen“ (neu):** B1 „Entdecker“ und „Profi“ (vier Antworten, ähnliche Ablenker, mehr Fragen, Hinweise auf Wunsch; Wahl in `gameSessions`), B3 größere Vorräte (Flaggen, Hauptstädte, Umrisse über alle geprüften Länder statt 12; Tier-Ablenker je Runde aus Familie oder Lebensraum; kleine Spiele 10 bis 15 Aufgaben), B4 keine Ratemuster (längste Antwort, feste Reihenfolge der Reise-Antworten), B5 Labor-Stempel erst nach dem Ausprobieren, B7 Stufe 1 (nie dieselbe Runde, Wiederholen mit Abstand, die 42 Zusatzfragen von 13 Karten auch auf der Karte); dazu die Zähler „… davon beim ersten Versuch“ und „{turns} Versuche“ aus den klassischen Spielen entfernen.
    - **Teilschritt 5 „Startseite und Sammlung“** zusätzlich: B2 goldenes Bild für „Profi“.
    - **Wechselnde Startfrage bleibt** (Nutzer findet sie gut, 21.11.2026; passt zu B7 „Jedes Mal etwas Neues“). Heute: neue Frage bei jedem neuen Besuch oder nach 30 Minuten Pause, gleiche Frage nach einem kurzen Abstecher, „Andere Frage“ auf Wunsch. Das bleibt so. Schwächen heute (gezählt): 56 Fragen aus nur drei Welten (Tiere 24, Köpfe 25, Bauwerke 7), teils zu schwer oder abstrakt („Welche Körpergröße wird auf der Karte verglichen?“, Sternlichtkurve mit Tag 2, 5 und 8), Antworten erst nach einem Klick. Neu nach Entwurf 6.5: eigene Liste kindgerechter „Rate mal!“-Fragen mit Antwortknöpfen direkt auf der Startseite, aus allen sechs Welten, gelöste Fragen erst wieder, wenn alle anderen dran waren. Pflege: Ein Test prüft jeden Eintrag (Karte, Foto, Nachweis, Frage, Antworten); neue Karten mit Foto und guter Frage kommen gleich mit auf die Liste, sie wächst Teilschritt für Teilschritt.
    - Der Nutzer gibt Rückmeldungen der Kinder zwischendurch weiter; sie fließen in den laufenden Teilschritt ein.
13. **Wörter in der Hülle, die noch warten** (Befunde der `kinder-redaktion`, Teilschritt 1): Suchknopf „Lernwelt durchsuchen“ → „Suchen“ (steckt in über 30 Browser-Tests und im Suchfeld; mit der neuen Startseite in Teilschritt 5 umstellen). Englisches Wort „Wissens-Challenge“ ersetzen (mit Teilschritt 3). „Wissensspur“ und „Wissensroute“ stehen beide für dasselbe; ein Wort wählen.
14. **Kleine Befunde der `code-pruefer`-Prüfung zu Teilschritt 1, bewusst verschoben:**
    - Tab-Reihenfolge im Kopf: Unter 768 px und zwischen 768 und 1199 px springt der Tastaturfokus von der Leiste zurück zu Suche und Pass, weil die Leiste im HTML zwischen Marke und Knöpfen steht. Trifft nur Tastatur-Nutzer. Mit der neuen Startseite in Teilschritt 5 lösen, ohne die Reihenfolge am breiten Rechner zu verderben.
    - Schutzrand unten: `env(safe-area-inset-bottom)` wirkt in Safari erst mit `viewport-fit=cover`. Am iPhone des Nutzers ansehen (besonders als Startbildschirm-App), ob die Wörter der Leiste frei vom Home-Balken stehen; erst dann entscheiden, ob `viewport-fit=cover` nötig ist (dann auch seitliche Ränder im Querformat).
    - Zurück aus der festen Leiste in Firefox und WebKit: In Chromium bleibt die Lesestelle erhalten (gemessen). Firefox und WebKit prüft `zurueckNachLeiste` erst im CI-Job „Vollprüfung“; spätestens am Phasenende beobachten.
15. **Befunde des `design-pruefer` zu Teilschritt 1, bewusst verschoben** (behoben wurden: Suchfeld bei großer Schrift, „So geht’s“ auf der Startseite in jeder Breite, „Was ist neu?“ als aktuelle Seite markiert, zu lange Beispieltexte in Suchfeldern; gemessen und kein Fehler: Tippflächen ab 44 px, Offline-Kasten 14 px):
    - Hilfe-Knopf „?“ im Kopf ab 768 px, damit die Hilfe am Rechner nur einen Schritt braucht (heute: Startseite „So geht’s“ oder Fuß „Für Eltern“). Mit der neuen Startseite in Teilschritt 5.
    - Startseite: einzelner Pfeil ohne Wort, lange Einstiegsfragen, Kasten „Weiter entdecken“ und zwei verschiedene Knopffarben. Teilschritt 5 baut die Startseite neu.
    - Wissenskarte: Abstände, Textlänge, Bildgröße. Teilschritt 2 baut die Karte neu.
    - Fotos mit Rand statt formatfüllend, graue Flächen beim Laden: siehe Punkte 7 und 9; die grauen Flächen könnten auch nur am Bildschirmfoto liegen, vorher nachmessen. Teilschritt 4.
    - Gleiche Buch-Symbole für verschiedene Dinge; Pass-Symbole bei 320 px eng; Entdeckerpunkte und Pokal passen nicht zu VISION (Sammeln ohne Zahlen). Teilschritt 5 (Sammlung).
    - Labor: erster Bildschirm zeigt wenig zum Tun, Knöpfe unterschiedlich hoch. Lernreisen: Fortschrittsbalken kaum zu sehen. Mit Phase 4, kleine Störungen vorher in Teilschritt 6.
    - Beschriftungen in Zeichnungen (SVG) nur 9–11 px groß und noch in der alten Schrift (Regel `svg{font-family:…}` in `kern.css`). Je Zeichnung mit ihrer Phase vergrößern und auf Nunito umstellen.
16. **Kleine Befunde der Schlussprüfung (`code-pruefer`) zu Teilschritt 1**, für Teilschritt 6 „Feinschliff“, falls nicht vorher erledigt. Behoben wurde schon: Auf dem iPhone ging nach einem Tipp in Leiste oder Fuß und „Zurück“ die Lesestelle verloren (Test `zurueckOhneFokus`). Außerdem rutschten die Bereiche beim Laden stark, weil der Fuß unter dem neuen, schlanken Kopf im Bild stand (Tempo-Prüfung: Weltenseite 0,96 statt höchstens 0,1; jetzt etwa 0,03).
    - Rückkehr-Sichtprüfungen rechnen ohne die feste Leiste (`app/hash-route.ts`, `returnGuideFocus` in `app/earth-explorer.tsx`): Ein Ziel kann fokussiert, aber hinter der Leiste verdeckt sein. Betrifft vor allem Tastatur und Bildschirmleser. Lösung: sichtbare Unterkante = Fensterhöhe minus `scroll-padding-bottom`.
    - Tab-Reihenfolge am Handy springt oben → unten → oben, weil die Leiste im Code zwischen Marke und Knöpfen steht.
    - Totes CSS: `.brand-word`, `.brand-period`, Abstand `.learning-tabs` wirkt nicht mehr (Abstände zwischen Seitenkopf, Offline-Hinweis und „Weiter entdecken“ im Design-Abgleich ansehen), `data-focus-at-heading` liest niemand mehr.
    - Zwei Fokus-Prüfungen in `tests/browser/discovery-central.mjs` messen nur die Rahmenbreite; Rahmenart mitprüfen und die Meldung „calm heading focus remains visible“ klären.
    - `env(safe-area-inset-bottom)` in `kern.css` wirkt erst mit `viewport-fit=cover`; heute harmlos.
    - Fuß-Link „Was ist neu?“ und Marke öffnen bei Strg- oder Mittelklick keinen neuen Tab (die Leiste kann das schon).
    - „Spielen“ in der Leiste führt bei offenem Spiel nicht zur Übersicht (Altverhalten). Mit Teilschritt 3 klären.
    - Restliches Rutschen beim Laden (etwa 0,02 bis 0,04, schon vor Teilschritt 1 so): Die Zeile „Dein Entdeckerpass wird geladen …“ verschwindet über dem Inhalt, und der obere Abstand der Ladeanzeige (`.learning-status`, `margin: 16px 0`) wandert nach außen und zurück. `display: flow-root` an `.learning-panel` hilft nicht (Abstand wandert eine Ebene tiefer). Besser: Ladezeile ohne Platzbedarf zeigen und Ladeanzeigen ohne oberen Außenabstand.
    - Kurze Seiten wie „Was ist neu?“ haben am Handy viel leere Fläche vor dem Fuß, weil der Hauptbereich mindestens bildschirmhoch ist (`.learning-main` in `kern.css`). Ohne diese Höhe rutscht „Was ist neu?“ bei 390 px um 0,13 bis 0,15 (Grenze 0,1). Die Fläche schrumpft mit jedem neuen Eintrag. Wenn das Rutschen anders gelöst ist (Punkt darüber), die Mindesthöhe nur noch beim Laden setzen.
    - Prüfen, ob Safari auch auf anderen Rückwegen die Lesestelle verliert (angetippte Karten, Kapitel), weil es Links beim Antippen nicht fokussiert. Die WebKit-Vollprüfung in der CI zeigt es.
    - ~~Buchleiste (`app/learning-strip.ts`) beim Drehen des Handys~~ erledigt am 21.11.2026 (vor Teil A von Teilschritt 2): Die Leiste beobachtet jetzt ihren Rahmen statt sich selbst und stellt Pfeile und gewählten Bereich erst im nächsten Bild nach. Tests in `kern-huelle`: `buchLeisteDrehen` (Handy gedreht, auch „Kleiner Atlas“ bleibt ganz sichtbar) und `buchLeisteZiehen` (Rechner mit sichtbaren Scrollbalken, Fenster schmal und breit gezogen, nur Chromium). Vorgezogen, weil die Schleife die WebKit-Vollprüfung scheitern ließ.

## Phase 2 – Tierwelt (grob)

- Alle Tierthemen kindgerecht neu: kurze Texte (`kinder-redaktion`), geprüfte Fakten (`fakten-pruefer`), Fotos mit Rechten (`bild-recherche`), kleine Aufgaben mit erklärender Rückmeldung.
- **Befunde der `kinder-redaktion` an der Eisbär-Karte (Muster für alle Tierkarten):**
  - Drei Fakten wiederholen andere Felder wörtlich (Lebensraum = `intro`, Besondere Fähigkeit = zweiter Absatz, Schutz = erster `more`-Absatz); „Kurzfassung vorlesen“ liest sie doppelt. Ursache: `content/enrich_world.py`, betrifft wahrscheinlich alle so erzeugten Tierkarten.
  - Mini-Frage mit unplausiblen Falschantworten („Eis macht ihn zu einem Fisch“) und ohne `questionFeedback`; die Erklärung erwähnt den Südpol, obwohl die Frage das nicht braucht.
  - `intro` ohne Neugier-Einstieg; Größe ohne kindgerechten Vergleich; Altersangabe zu verschachtelt; zweiter `more`-Absatz belehrend, „gefährdet“ unerklärt; Einzahl und Mehrzahl gemischt; Hinweis in `app/challenge-hints.json` umständlich.
- **Befunde des `fakten-pruefer` (Eisbär):** Länge 1,8–2,7 m und durchsichtige Haare stimmen. Nicht ergänzen: den Mythos, Eisbärhaare leiteten Licht wie Glasfasern zur Haut (widerlegt, Koon 1998).
- **Befund der `bild-recherche` (Eisbär):** Nachweis korrekt (Commons „Polar_Bear.jpg“, gemeinfrei, USFWS), aber nur 700 px breit. Breiteres freies Foto suchen.
- Tier-Spiele (Tierdetektiv, Lebensraum-Sortierer, Tier & Lebensraum, Wer frisst was?, Tierrekorde) mit echten Stufen und Fehlerbegründungen. Die Grundlage („Entdecker“/„Profi“, bessere Ablenker) kommt schon in Phase 1, Teilschritt 3; hier folgen Fehlerbegründungen und neue Aufgaben.
- **Knobelfälle und Schätzfragen** (Ergänzung B6): Detektivfälle mit Hinweisen aus drei Karten; Schätzfragen mit Regler („Wie lang ist ein Eisbär? Schieb!“). Erste Probe mit den Tierrekorden.
- **Neue Fragen für alle Tierkarten** (Ergänzung B7 Stufe 3): beim Neuschreiben je Karte zwei bis drei weitere Fragen, geprüft mit den neuen Texten.
- Fehlende Medien: Pilze, Bestäubung, Nahrungsnetze (WK-056).
- Feld `related` aufräumen (ab hier Welt für Welt): 144 einseitige Einträge, viele Füller (Elefant und Honigbiene bei fast allen Tieren). Seit Phase 1 zeigt die Karte nur noch erklärte Verbindungen aus `world-connections.json`; `related` wird entweder zu erklärten Verbindungen ausgebaut oder ganz ersetzt (IDs bleiben).
- Lebensraum-Daten vereinheitlichen: „Wiesen & Gärten“ / „Wiesen und Gärten“ und „Flüsse & Seen“ / „Flüsse und Seen“ stehen beide in den Daten; die Anzeige fasst sie schon zusammen (`app/world-selection-state.mjs`), die Daten nicht (Audit V2, E).

## Phase 3 – Weitere Welten (grob)

- Welt für Welt nach dem Tierwelt-Muster: Natur, Erde, Weltall, Menschen, Erfindungen, Geschichte. Dabei je Karte zwei bis drei weitere Fragen (Ergänzung B7 Stufe 3) und Texte nach dem Längen-Budget (A1).
- **PR #95 übernehmen:** acht Geschichtsthemen mit acht Vertiefungen, kindgerecht umgeschrieben nach `kinder-redaktion` und `fakten-pruefer`. Stand: Branch `codex/wunderkompass-history-evidence-2026-11-08`, Commit `7e00bd0`.
- Alter Artikel „Papier aus China“ neu (WK-053).
- Echte Bilder für die Karten ohne Bild in Bauwerke (9) und Wissenschaft (etwa 30); in Phase 1 haben sie Motivkacheln, Zeitreise und Erfindungen bekommen dort schon Bilder (Entwurf Phase 1, 6.10).
- 16 Lernreisen mit 80 Kapiteln und 240 Aufgaben kindgerecht nacharbeiten: mehr Tun als Ankreuzen, Hinweise, erklärende Rückmeldung (WK-055, WK-048).
- Planetenwerte vereinheitlichen: Neptun 30,05 AE (Orbitlabor) gegen 30,18 AE (Größenvergleich), ebenso Saturn und Uranus; eine Definition, Quelle und Erklärung (WK-056).
- Wissensbuch: gemeinsame Ansicht aller Notizen; sparsame Begriffshilfe beim Lesen. Verweise wie „Mit ‚Reflexion‘ weiterdenken“ nicht in zwei verschachtelten Klappen verstecken (Audit V2, A1). „Stationen erneut ansehen“, Notizen bearbeiten und die Zählung der Wiederholungen dabei einmal im Browser bedienen; bisher nur am Code geprüft (Audit V2, H1–H3).
- Quellen der Bauwerk- und Erfindungsthemen: `burjkhalifa.ae/the-tower/structures/` und die NMS-Seite zum Telefon sperren automatische Abrufe (403); beim Überarbeiten mit `fakten-pruefer` klären. Die drei alten kaputten Adressen stehen noch im Erzeugungsskript `content/author-world-content.py` (Zeilen 126, 161) und nur dort (Audit V2, G1).
- **Neue Themenfelder aus dem Katalog 2027** (Körper, Geld und Zinsen, Religionen, Robotik, Physik und Chemie, Sport, Urzeit): nach den Sorgfaltsregeln in `docs/entwurf/2026-11-21-katalog-2027-einordnung.md` in die passenden Welten, jedes Thema in drei Tiefen. Eigene Welt „Urzeit“ (Dinosaurier, Fossilien, Erdzeitalter) beim Entwurf von Phase 3 prüfen.

## Phase 4 – Globus, Spiele, Labore (grob)

- Einzeln in den neuen Kern übernehmen und dabei verbessern.
- **Globus als Herzstück** (Katalog 2027, Abschnitt 3): Themenebenen (Klimazonen, Tierwelten, Ozeane, Orte aus den Wissenskarten), von jeder Ebene zu Karten, Spielen und Laboren und zurück. Die vorhandene 2D-Ersatzansicht (`FallbackGlobe` in `app/globe.tsx`) bleibt und wird mit verbessert.
- **3D-Modelle** (Katalog 2027, Abschnitt 2): zuerst den Bestand sichten (welche Modelle erklären etwas, welche sind nur Schmuck, wo hilft echtes 3D). Dann ein erstes neues 3D-Modell mit klarem Lernwert (Vorschlag: Tag und Nacht oder Jahreszeiten), mit 2D-Fassung, Tastatur, Offline und Größenbudget. React Three Fiber dabei prüfen (Lizenz, Größe, Nutzen); nur exakt gepinnt aufnehmen.
- Frage-Spiele (Flaggen, Hauptstädte, Silhouetten, Klima, Foto-Forscher, Schatzsuche): der dritte Hinweis verrät nicht mehr die Lösung, echte Stufen, Fehlantworten erklärt (WK-021, WK-056; Stand 11.10., vor der Arbeit neu prüfen). Stufen und größere Vorräte kommen schon in Phase 1, Teilschritt 3; hier bleiben Hinweise, Fehlantworten und das neue Aussehen.
- Rückmeldungen ehrlich formulieren: nach einer Auswahl nicht „Richtig erklärt!“ bescheinigen (WK-056; teils erledigt, vorher prüfen).
- Länder- und Flaggen-Memory mit drei Stufen und Erklärungen (WK-038). Wissens-Challenge: falsche Antworten begründen, neue Themen (WK-017).
- Ozean-Navigator mit zugänglicher Karte; Weltreise-Suche modernisieren.
- **Länderansicht: rohe Sprach- und Währungscodes** (Audit V2, G2, für Kinder spürbar): Rund 100 Codes erscheinen ohne Namen, z. B. „bem“, „toi“ (Sambia), „ff“, „srr“ (Senegal), Währung „XCG“. `app/country-portrait.tsx` ergänzt bisher nur sechs Namen. Lösung: deutsche Namen ergänzen oder unbekannte Codes nicht roh zeigen; mit Test über alle Länder. Darf als kleine Korrektur vorgezogen werden.
- Zoom-Knöpfe heißen auch in der 2D-Schichtenansicht „Weltkugel vergrößern“ (Audit V2, B): passend benennen.
- **Schatzsuche markiert „Start“ statt „Spielen“** (Befund `design-pruefer`, Teilschritt 1): Die Schatzsuche läuft auf dem Globus (`#globe`), und der Globus gehört in der Leiste zu „Start“. Welche Ansicht offen ist, steht nicht in der Adresse. Lösung mit dem Globus-Umbau: eigener Hash für die Schatzsuche (alte Links bleiben) oder Markierung nach Herkunft.
- Labore: Modelle, Legenden und Modellgrenzen einzeln verbessern.

## Technik und Prüfung

- **Streichen möglich machen** (vor dem ersten Inhalt, der wegfällt; Regel „Kein Bestandsschutz“ in CLAUDE.md): Der Test „alle stabilen IDs … gibt es noch“ in `tests/content-integrity.test.mjs` verbietet heute jedes Entfernen. Umbauen auf eine Liste ausgemusterter IDs mit Ziel für alte Links: Eine ID darf fehlen, wenn sie dort steht und ihr Ziel existiert. Dazu belegen, dass alte Links umleiten und Pass-Einträge erhalten bleiben (Altpass, Import/Export, Reload).
- **Neuer Browser-Test „beschädigter Speicherstand“:** Pass mit kaputtem Inhalt laden, nichts geht still verloren. Vorlage: `critical.mjs` im alten Stand (`git show b53f75f:tests/browser/critical.mjs`).
- **`main` hat eigene Alt-Commits:** Zehn Codex-Probe-Commits vom 9.10.2026 (PRs #5–#8: Workflows `vercel-e2e.yml` und `write-permission-probe.yml`, Änderungen an `quality.yml`, `vercel.json` mit `deploymentEnabled` für drei `codex/`-Branches, BACKLOG/CHANGELOG) stehen nur in `main`, nicht in `test-live`. Beim ersten Veröffentlichungs-PR `test-live` → `main` gibt es deshalb Konflikte: Probes nicht übernehmen, Konflikte zugunsten von `test-live` lösen. (`test-live` ist seit 21.11.2026 Standardbranch auf GitHub.)
- ~~**Neue Fehler der CI-Vollprüfung nach Teilschritt 1**~~ (Lauf 44932697632 auf `c6401c1`) erledigt am 21.11.2026, vor Teil A von Teilschritt 2. Alle drei lagen an den Tests oder am Werkzeug, nicht an der App; dabei kam ein echter App-Fehler ans Licht (Buchleiste, unten):
    - Chromium `home-visits`: Der Test lud neu, schloss oder wechselte die Seite, während Startseiten-Bilder noch luden; in der langsamen CI brach Chromium sie ab. Lokal mit gedrosseltem Rechner nachgestellt. Der Test wartet jetzt vor jedem gewollten Seitenwechsel auf laufende Bilder (gemeinsamer Helfer `bildanfragen` in `tests/browser/harness.mjs`).
    - Firefox `pass-atlas`: Fehler in Playwright 1.65.1 mit Firefox 159. Ein Rollen-Locator mit Namen aus `aria-labelledby` lässt Firefox abstürzen, sobald danach `evaluateAll` oder `allTextContents` läuft (auf leerer Testseite nachgestellt). Der Test prüft den Namen über die Rolle (beim Öffnen, nach der Rückfrage und nach erneutem Öffnen) und arbeitet sonst über die Klasse.
    - WebKit `offline-resilience` (und der alte `engine-journeys`-Fehler, gleiche Ursache): WebKit lässt höchstens 200 Navigationen in etwa 10 Sekunden zu, auch Sprünge innerhalb der Seite, und blockiert danach still. Der Buchtest springt schneller. Neuer Wächter `navigationsTempo` (`scripts/navigation-tempo.mjs`, nur WebKit) bremst vor schnellen Seitenwechseln; die WebKit-Warnung zählt jetzt als Browserfehler. Damit das Bremsen keine App verdeckt, die den Verlauf zu oft beschreibt, zählt der Buchtest die Navigationen je Schritt (Navigationsbudget mit `navigationen(page)`).
    - Buchleiste: Danach meldete WebKit eine ResizeObserver-Schleife beim Drehen des Handys (BACKLOG Punkt 16). Behoben in `app/learning-strip.ts`, Tests `buchLeisteDrehen` und `buchLeisteZiehen` (Punkt 16).
- **Bei jedem Playwright-Update:** den Firefox-Absturz (Rollen-Locator mit `aria-labelledby`, danach `evaluateAll`) mit einem Minimalfall wiederholen. Ist er behoben, die Umgehung in `tests/browser/pass-atlas.mjs` zurückbauen. Andere Suiten mit dem gleichen Muster stürzen sonst ebenfalls in Firefox ab.
- **WebKit-Navigationssperre:** Meldet eine Suite in WebKit „Excessive navigation attempts blocked“, braucht ihr schneller Ablauf `navigationsTempo` vor den Seitenwechseln und dazu ein Navigationsbudget je Schritt wie in `tests/browser/book-related-words.mjs`. Nie die Meldung unterdrücken.
- **WebKit-Fehler, die es schon vor Teilschritt 1 gab** (CI-Vollprüfung am 21.11.2026, alter Stand `test-live` und Branch gleich; vor der nächsten Veröffentlichung für Freunde in einem eigenen Schritt beheben, jeweils erst Ursache, dann Test, dann Korrektur):
    - `backup`: Auswahl des Test-Passes scheitert in WebKit (`tests/browser/backup.mjs` Zeile 49/50, `selectOption('qa-pass-de')`); Verdacht: Sprachausgabe (`speechSynthesis`) fehlt im Test-WebKit.
    - ~~`engine-journeys`~~ erledigt am 21.11.2026: gleiche Ursache wie `offline-resilience` (WebKit-Navigationssperre, oben); lokal in WebKit grün.
    - `offline-cold`: „WebKit encountered an internal error“ beim Kaltstart offline (`tests/browser/offline-cold.mjs` Zeile 71).
    - Seit 21.11.2026 laufen Chromium, Firefox und WebKit auch im Container (Playwright 1.65.1). Diese drei lassen sich also lokal nachstellen.
- **Firefox und WebKit:** Die CI-Vollprüfung lief am 21.11.2026 zum ersten Mal in allen drei Engines. Firefox war grün bis auf einen Zeit-Wettlauf in `retained-answer-wording` (behoben in Teilschritt 1). In WebKit fand sie eine harmlose, aber gemeldete ResizeObserver-Schleife in der Buchleiste (behoben in Teilschritt 1) und die drei alten Fehler oben (davon `engine-journeys` behoben). Offen: prüfen, ob ein kurzer WebKit-Rauchtest bei jedem PR lohnt (CI-Zeit gegen Nutzen). WebKit ist besonders wichtig, weil iPhone und iPad des Nutzers Safari nutzen.
- **ResizeObserver-Schleifen auch in Chromium melden:** Chromium meldet sie nur leise (Playwright sieht sie nicht), WebKit als Seitenfehler. Vorschlag: `monitorBrowserErrors` in `scripts/browser-errors.mjs` fängt das `error`-Ereignis „ResizeObserver loop“ auf der Seite in allen Engines ab. Dann fallen solche Fehler schon in `pnpm run check` auf statt erst in der WebKit-Vollprüfung. Vorher in allen Suiten prüfen, ob es weitere Stellen gibt.
- **Wortlaut-Sperre** `retainedChallengeChoices` in `app/retained-answer-wording.mjs`: hält alte Antworttexte wörtlich fest, damit gespeicherte Antworten passen. Beim Umschreiben der Challenge-Fragen gezielt lösen (Pass-Kompatibilität zuerst).
- Speicher voll oder Worker-Fehler: Verhalten prüfen und kindgerecht erklären.
- Echte Geräte und Bildschirmleser (VoiceOver, TalkBack) wurden nie getestet. Nur mit echtem Nachweis behaupten. Der Nutzer sieht die Seite auf iPhone, iPad, einem Android-Gerät und dem PC an (21.11.2026): ab Phase 1 bei jeder Vorschau um einen kurzen Blick auf seinen Geräten bitten, mit zwei, drei konkreten Punkten zum Ansehen. Seine Rückmeldung ist ein echter Gerätetest, aber kein Test mit Bildschirmleser.
- Schwer wartbaren Code (Zeilen mit bis zu 6.000 Zeichen) dort lesbar machen, wo eine Phase ohnehin arbeitet.
- **Zeichnungen in alter Schrift:** Die SVG-Zeichnungen (46 Dateien mit `<text>`, vor allem Wissensbuch, Reisen, Labore, Personen) sind Pixel für Pixel auf die alte Schrift abgestimmt und behalten deshalb seit Teilschritt 1 „Trebuchet MS“, Arial (Regel am `svg` in `app/kern/kern.css`, Abschnitt „Anpassung alter Bereiche“). Beim Neuzeichnen in der jeweiligen Phase auf Nunito umstellen und die Regel am Ende entfernen.
- **Inhaltsprüfung** `tests/content-integrity.test.mjs` (stabile IDs, Bildnachweise, Export) kam in Schritt 0 ohne `KNOWN_GAPS`-Liste aus: Der heutige Stand erfüllt alle Regeln. Neue Lücken nur mit BACKLOG-Verweis eintragen; die Liste darf nur kürzer werden.
- **`exports/content/` ablösen:** 30 Browser-Testmodule lesen die exportierten Inhaltsdateien (Befund Schritt 0, deshalb noch im Repository). Tests nach und nach direkt auf die Quellen in `app/` umstellen, dann `exports/` und den Export-Schritt in `test:full` entfernen. Bis dahin schreibt jeder `test:full`-Lauf einen neuen Zeitstempel in `exports/content/index.json`: vor dem Commit zurücksetzen.
- **Inhaltswächter erweitern** (Befunde code-pruefer, Schritt 0): (1) eigene Illustrationen tragen ihre KI-Kennzeichnung, und SVGs enthalten kein `<script>`, `<foreignObject>` und keine fremden Adressen (Vorlage: Test „24 local own images …“ in `git show b53f75f:tests/animal-expansion.test.mjs`); (2) Fragen-IDs der Spielbanken „Technik“ und „Früher oder heute?“ in `stable-ids.json`; (3) Orts-IDs, die als Entdeckung oder Favorit im Pass stehen (Länder, Hauptstädte, Meere, Kontinente, Plattenorte, Meeresorte).
- **Browser-Runner:** `stop()` in `tests/browser/harness.mjs` nach etwa 5 s mit SIGKILL beenden; `people-learning`, `offline-retention` und `animal-native-zoom` sammeln noch keine Konsolenfehler über `monitor`.
- **Rauchtest-Bilder:** Der Rauchtest fotografiert, bevor alle Fotos geladen sind (Befund Schritt 0: leere Bildflächen bei Löwe, Gepard, Curie, mal so, mal so). Vor dem Screenshot auf sichtbare Bilder warten, damit Vorher/Nachher-Vergleiche ruhig bleiben.
- **Alte Branches und Entwurfs-PR #27 aufräumen** (nur nach eigener Rückfrage): 107 gemergte und 122 `codex/*`-Branches auf GitHub; Entwurfs-PR #27 „Paket 3.5“ (Codex, alte Basis) vorher auf Brauchbares für spätere Phasen durchsehen. Nicht löschen, solange PR #95 nicht übernommen ist: `codex/wunderkompass-history-evidence-2026-11-08` (Commit `7e00bd0`).
- **Tempo-Prüfung in `pnpm run check`** (Teilschritt 2, Befund 21.11.2026): Die Suite `performance` (Verrutschen beim Laden, Ladezeit, Startgröße; etwa 35 s) steckt nur in der großen Prüfung. Deshalb fiel das Springen beim Laden aus Teilschritt 1 erst am Ende auf. In den CI-Satz aufnehmen; sie läuft allein (`solo`), also prüfen, wie sich die CI-Laufzeit ändert.
- **Vollprüfung dauert lange:** `test:full` braucht in Chromium nacheinander rund zwei Stunden (Messung Schritt 0; CI-Grenze deshalb 180 Minuten). Suiten beschleunigen oder sinnvoll aufteilen, statt die Zeitgrenze im CI-Job weiter zu erhöhen.

## Medien mit offenen Rechten

- Acht Landschaftsgrafiken sind Rekonstruktionen und als solche zu kennzeichnen (WK-051).
- Merian-Porträt (Original nicht abrufbar), Lehmann-Foto (Lizenz unbelegt), Pont/Sydney-Aufnahmen: nur eigene gekennzeichnete Grafiken, bis ein freies Original gefunden ist (`bild-recherche`).

## Ideen-Sammlung

Erst nach Durchsicht durch `ideen-scout`, `kinder-redaktion` und `fakten-pruefer` einplanen.

**Themenwünsche des Nutzers (21.11.2026)** (Sorgfaltsregeln je Feld: `docs/entwurf/2026-11-21-katalog-2027-einordnung.md`):
- Medizin und Körper, zum Beispiel Knochen (den Körper erklären, keine Gesundheitsratschläge).
- Wirtschaft, Geld und Zinsen (gut als Mitmach-Modell im Forscherlabor).
- Religionen der Welt (neutral und respektvoll).
- Aktuelle Technik wie das Elektroauto (zeitlos erklärt, keine Nachrichten).
- Mehr Erdkunde und Geschichte (auf vorhandenen 31 Geschichtsthemen und dem Globus aufbauen).

**Weitere Themenwünsche des Nutzers (21.11.2026, nur Ideen; vor dem Einplanen durch `ideen-scout`, dann `kinder-redaktion` und `fakten-pruefer`, spätestens bei der Planung von Phase 3):**
- Naturgewalten: Vulkane und Vulkanausbrüche, Erdbeben, Tsunamis, Tornados (erklären, wie sie entstehen und wie Menschen sich schützen; keine Angstbilder, keine Nachrichten über echte Opfer).
- Geheimnisse der Tiefsee: unbekannte Lebewesen, Tiefseegräben, Unterwasserwelten (passt zur Idee „Tiefsee“ unten).
- Mythen und Legenden: Drachen, griechische Sagen, Atlantis, geheimnisvolle Geschichten (immer klar als Sage gekennzeichnet; dazu, was man wirklich weiß und woher die Geschichte vielleicht kommt).
- Erfindungen und Zukunft: fliegende Autos, Hologramme, Zeitreisen (zeitlos erklärt: was es schon gibt, was Forschende probieren, was nur Gedankenspiel ist).
- Detektive und Rätsel: Geheimschriften, Codes knacken, Spurensuche (Fingerabdrücke und Ähnliches, ohne Gewalt), spannende Forschungsrätsel (passt zu „Detektiv- und Geheimschrift-Rätsel“ unten).

**Dritte Wunschliste des Nutzers (21.11.2026), mit erster Durchsicht durch `ideen-scout`** (Teilprüfung: Katalog nicht geöffnet, viele Vorbilder nur vermutet; vor dem Einplanen `kinder-redaktion` und `fakten-pruefer`):
- Bauwerke: Brücken, Wolkenkratzer, Tunnel, ungewöhnliche Architektur (Anfang der Zeile fehlte in der Nachricht, „Brücken“ ist vermutet). Scout: Zuwachs für die Welt Bauwerke in Phase 3; Mitmachen z. B. „Welche Brücke trägt?“, Tunnel-Schritte ordnen, Türme mit breitem und schmalem Fuß. Höhen nur mit „etwa“ und Bezugsjahr, keine Einsturzbilder.
- Sprache und Kommunikation: Gebärdensprache, Hieroglyphen, Geheimsprachen, Tierkommunikation. Scout: passt zu Menschen und zu „Detektive und Rätsel“; Tierkommunikation (Bienentanz, Alarmrufe) schon in Phase 2. Gebärdensprache als echte Sprache mit eigener Grammatik darstellen; umstrittene Befunde (Menschenaffen mit Gebärden) vorsichtig oder weglassen.
- Faszinierende Rekorde: schnellste Tiere, größte Maschinen, Naturrekorde. Scout: Querschnitt, Start mit dem geplanten Spiel „Tierrekorde“ (Phase 2); Werte mit „etwa“ oder „nach heutigem Wissen“, Art der Bewegung nennen (Sturzflug gegen Laufen), keine Marken.
- Die Welt der Videospiele: Spieleentwicklung, virtuelle Welten, Programmieren, Game-Design. Scout: bei Erfindungen; Mitmachen z. B. Pfeilkarten für eine Figur, Spielregeln selbst bauen, Pixelbild malen. Keine Werbung für kaufbare Spiele, keine Figuren nachbauen, keine Bildschirmzeit-Ratschläge. Phase 3 oder später.
- Alltagsrätsel: Warum ist der Himmel blau? Warum knistert es? Warum schwimmen Schiffe? Scout: fast gleich mit der „Warum ist das so?“-Kette unten, passt genau zu Ziel 6. Nur ungefährliche Versuche, nie Steckdose.
- Die Zukunft unserer Erde: erneuerbare Energie, nachhaltige Städte, neue Verkehrsmittel, Umweltschutz. Scout: überschneidet sich mit „Aktuelle Technik“ und „Erfindungen und Zukunft“; zeitlos, ohne Angst, ohne Nachrichten und politische Streitfragen, immer auch, was Menschen schon tun.
- Entdeckungsreise je Themenwelt mit 3D-Modellen, Experimenten, Rätseln und versteckten Entdeckungen. Scout: kein drittes Format, sondern je Welt eine Lernreise als Einstieg mit Bausteinen aus den Laboren. 3D nur sparsam, mit 2D-Fassung und Größenbudget (vor dem Bau messen). Versteckte Entdeckungen ohne Zahlen: Tier im Bild finden, Spur im Bild, stilles „entdeckt“ im Pass.
- „Was wäre, wenn …?“: Gedankenexperimente zum Mitmachen. Scout: jede Seite fest als „Gedankenspiel“ kennzeichnen und mit „Das wissen wir wirklich“ auflösen. „Keine Schwerkraft“ ist eine fachliche Falle (dann gäbe es keine Erde und keine Luft); besser „ein Tag ohne Gewicht“ oder „Wie ist es auf der Raumstation?“. Dinosaurier heute: als Rekonstruktion, ohne Menschen daneben im Bild. Menschen auf dem Mars: als „Was bräuchte man?“, ohne Zeitangabe und Firmen. Weitere Fragen: kein Mond, keine Erddrehung, ohne Bienen (andere Bestäuber nennen), so klein wie eine Ameise.
- Scout-Favoriten: Alltagsrätsel, „Was wäre, wenn …?“ (eng gefasst), Rekorde ab Tierrekorden.

**Aus dem alten Bestand:**
- Welten als Themeninseln mit eigenem Motiv auf einer Übersichtskarte.
- Fortschritt im Pass als „geschafft / als Nächstes“, ohne Sterne oder Punkte.
- Kurze freiwillige Wiederholungsrunden mit erklärten Antworten.
- Neue Welten: Urzeit und Fossilien, Weltall und Raumfahrt, Tiefsee, Körper und Sinne, Technik und Roboter, Archäologie und Rätsel.
- Erlebnisse: Fossilien ausgraben, Rover steuern, Tauchgang, Erfinderwerkstatt, Quellen vergleichen.
- Musik und Schall, Detektiv- und Geheimschrift-Rätsel, Mathe und Logik, Sport und Medienkompetenz.
- Freiwillige Lernwege zwischen Themen, die erklären, warum sie zusammenhängen.

**Vom `ideen-scout` (21.11.2026, noch nicht geprüft):**
- „Warum ist das so?“-Kette: von einer Beobachtung über zwei, drei Warum-Schritte zu einem verbundenen Thema (Ziel 6).
- „Wer wohnt wo?“: Tiere per Antippen ihrem Lebensraum zuordnen, mit Begründung bei Fehlern.
- Tier-Detektiv mit Bildausschnitt: ein Ausschnitt eines echten Fotos, das Kind rät, wer es ist; der Ausschnitt wächst.
- Nahrungsnetz-Labor: Wer frisst wen? Ein Tier herausnehmen und sehen, was sich ändert.
- „Mein Tierpfad“: selbst gewählte Folge von Tierkarten im Pass, als Weg dargestellt.
- Eine Begleitfigur (Maskottchen), die durch die Seite führt und vorliest. Bewusst nicht in Phase 1 (Entwurf Phase 1, Nicht-Ziele); erst nach dem neuen Kern prüfen, ob sie Kindern hilft oder nur ablenkt.
