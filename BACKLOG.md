# BACKLOG

Stand: 21.11.2026. Die eine priorisierte Aufgabenliste. Oben das Nächste, unten Ideen.
Der alte Aufgabenbestand (498 Zeilen, Pakete und WK-Nummern) liegt im alten Stand: `git show b53f75f:BACKLOG.md`.
Übernommen wurden nur produktrelevante offene Punkte; WK-Nummern stehen in Klammern zum Nachschlagen.

## Phase 1 – Neuer Kern (als Nächstes)

Ziel: Kinder finden in Sekunden etwas Spannendes und können sofort etwas tun. Zuerst das Handy (320–390 px), dann Tablet und Rechner.

1. **Entwurf** in `docs/entwurf/` mit Skizzen für Handy und Rechner, Freigabe durch den Nutzer.
2. **Design-System:** Schrift, Farben (hell, Orange und Petrol als Akzente), Abstände, Tippflächen, Kacheln mit „Glossy“-Schimmer (Antippen auf Touch, ruhig bei „Bewegung reduzieren“), Bild- und Fotorahmen, Bewegung.
3. **Startseite „Entdecken“:** eine Frage mit großem Bild, Weiter-machen, Entdeckung des Tages, frühe Themen, Suche. Doppelte Titel und Einleitungen weg; das erste Motiv im ersten Bildschirm (WK-053, WK-057).
4. **Navigation:** kompakter Wechsel der sechs Bereiche auf dem Handy; heute schneidet die Leiste bei 360 px „Entdecken“ links an (Befund Schritt 0).
5. **Themenwelt-Seite:** Themen als große Bildkacheln, Filter ohne langen Vorlauf (WK-053: mobile Tierübersicht).
6. **Neue Wissenskarte:** kurz und kindgerecht oben, Vertiefung („Mehr erfahren“) freiwillig, Bild mit Nachweis, ein kleines Tun (raten, tippen), Verbindungen zu echten Nachbarn (Ziel 6).
7. **Bildwirkung:** Bilder laden ohne graue Platzhalter im ersten Bildschirm (Löwe/Gepard bei 1440 px), Fotos füllen die Kartenbreite (Elefant).
8. **Verbindungen (Ziel 6):** 15 von 196 erklärten Verbindungen haben keine Rückrichtung im `related`-Feld; zufällig wirkende Nachbarn (Elefant → Honigbiene, Großer Panda) durch fachlich echte ersetzen.
9. **Befunde des `design-pruefer` aus Schritt 0** (Startseite, Tierwelt, Eisbär-Karte bei 360 und 1280 px):
   - Nach einem Seitenwechsel zeigt der programmgesteuerte Fokus einen großen Petrol-Rahmen um Überschrift und Inhalt. Fokusrahmen nur bei Tastaturbedienung (`:focus-visible`), Sprungziel trotzdem für Bildschirmleser erhalten.
   - Tippflächen teils unter 44 px; sehr kleine, blasse Meta-Texte und Bildnachweise (Kontrast nach WCAG AA prüfen).
   - Fotos auf Welt- und Startkacheln mit Rand statt formatfüllend (`object-fit: cover` mit sinnvollem Bildausschnitt).
   - Feinschliff: Texteinzug in Karten ungleich, auf 360 px kommt das Motiv spät, einzelner Pfeil ohne Beschriftung, uneinheitliche Bedienelemente, abstrakte Einstiegsfragen.
10. **Prüfen:** `design-pruefer` in 320, 390, 768, 1280 und 1440 px, Rauchtest-Bilder vorher/nachher, Pass und alte Links unverändert.
11. **„Was ist neu?“ in der App** (Produktchronik): Nutzerwunsch 21.11.2026 – hier stehen künftig die Änderungen, Gestaltung frei. Neu gestalten: kurz, kindgerecht, mit Bild oder Motiv je Eintrag, neueste oben; ab Phase 1 bekommt jede sichtbare Änderung einen Eintrag. Dabei die verwaisten `evidence.file`-Texte in `app/update-history.ts` bereinigen (zeigen auf entfernte Berichtsdateien).

## Phase 2 – Tierwelt (grob)

- Alle Tierthemen kindgerecht neu: kurze Texte (`kinder-redaktion`), geprüfte Fakten (`fakten-pruefer`), Fotos mit Rechten (`bild-recherche`), kleine Aufgaben mit erklärender Rückmeldung.
- **Befunde der `kinder-redaktion` an der Eisbär-Karte (Muster für alle Tierkarten):**
  - Drei Fakten wiederholen andere Felder wörtlich (Lebensraum = `intro`, Besondere Fähigkeit = zweiter Absatz, Schutz = erster `more`-Absatz); „Kurzfassung vorlesen“ liest sie doppelt. Ursache: `content/enrich_world.py`, betrifft wahrscheinlich alle so erzeugten Tierkarten.
  - Mini-Frage mit unplausiblen Falschantworten („Eis macht ihn zu einem Fisch“) und ohne `questionFeedback`; die Erklärung erwähnt den Südpol, obwohl die Frage das nicht braucht.
  - `intro` ohne Neugier-Einstieg; Größe ohne kindgerechten Vergleich; Altersangabe zu verschachtelt; zweiter `more`-Absatz belehrend, „gefährdet“ unerklärt; Einzahl und Mehrzahl gemischt; Hinweis in `app/challenge-hints.json` umständlich.
- **Befunde des `fakten-pruefer` (Eisbär):** Länge 1,8–2,7 m und durchsichtige Haare stimmen. Nicht ergänzen: den Mythos, Eisbärhaare leiteten Licht wie Glasfasern zur Haut (widerlegt, Koon 1998).
- **Befund der `bild-recherche` (Eisbär):** Nachweis korrekt (Commons „Polar_Bear.jpg“, gemeinfrei, USFWS), aber nur 700 px breit. Breiteres freies Foto suchen.
- Tier-Spiele (Tierdetektiv, Lebensraum-Sortierer, Tier & Lebensraum, Wer frisst was?, Tierrekorde) mit echten Stufen und Fehlerbegründungen.
- Fehlende Medien: Pilze, Bestäubung, Nahrungsnetze (WK-056).

## Phase 3 – Weitere Welten (grob)

- Welt für Welt nach dem Tierwelt-Muster: Natur, Erde, Weltall, Menschen, Erfindungen, Geschichte.
- **PR #95 übernehmen:** acht Geschichtsthemen mit acht Vertiefungen, kindgerecht umgeschrieben nach `kinder-redaktion` und `fakten-pruefer`. Stand: Branch `codex/wunderkompass-history-evidence-2026-11-08`, Commit `7e00bd0` (lokaler Tag `archiv/pr95-geschichte-2026-11-21`).
- Alter Artikel „Papier aus China“ neu (WK-053).
- 16 Lernreisen mit 80 Kapiteln und 240 Aufgaben kindgerecht nacharbeiten: mehr Tun als Ankreuzen, Hinweise, erklärende Rückmeldung (WK-055, WK-048).
- Planetenwerte vereinheitlichen: Neptun 30,05 AE (Orbitlabor) gegen 30,18 AE (Größenvergleich), ebenso Saturn und Uranus; eine Definition, Quelle und Erklärung (WK-056).
- Wissensbuch: gemeinsame Ansicht aller Notizen; sparsame Begriffshilfe beim Lesen.

## Phase 4 – Globus, Spiele, Labore (grob)

- Einzeln in den neuen Kern übernehmen und dabei verbessern.
- Frage-Spiele (Flaggen, Hauptstädte, Silhouetten, Klima, Foto-Forscher, Schatzsuche): der dritte Hinweis verrät nicht mehr die Lösung, echte Stufen, Fehlantworten erklärt (WK-021, WK-056; Stand 11.10., vor der Arbeit neu prüfen).
- Rückmeldungen ehrlich formulieren: nach einer Auswahl nicht „Richtig erklärt!“ bescheinigen (WK-056; teils erledigt, vorher prüfen).
- Länder- und Flaggen-Memory mit drei Stufen und Erklärungen (WK-038). Wissens-Challenge: falsche Antworten begründen, neue Themen (WK-017).
- Ozean-Navigator mit zugänglicher Karte; Weltreise-Suche modernisieren.
- Labore: Modelle, Legenden und Modellgrenzen einzeln verbessern.

## Technik und Prüfung

- **Neuer Browser-Test „beschädigter Speicherstand“:** Pass mit kaputtem Inhalt laden, nichts geht still verloren. Vorlage: `critical.mjs` im alten Stand (`git show b53f75f:tests/browser/critical.mjs`).
- **`main` hat eigene Alt-Commits:** Zehn Codex-Probe-Commits vom 9.10.2026 (PRs #5–#8: Workflows `vercel-e2e.yml` und `write-permission-probe.yml`, Änderungen an `quality.yml`, `vercel.json` mit `deploymentEnabled` für drei `codex/`-Branches, BACKLOG/CHANGELOG) stehen nur in `main`, nicht in `test-live`. Beim ersten Veröffentlichungs-PR `test-live` → `main` gibt es deshalb Konflikte: Probes nicht übernehmen, Konflikte zugunsten von `test-live` lösen. (`test-live` ist seit 21.11.2026 Standardbranch auf GitHub.)
- **Firefox und WebKit:** `test:full` läuft lokal nur in Chromium. Beim ersten Veröffentlichungs-PR (`test-live` → `main`) den CI-Job „Vollprüfung“ in allen drei Engines beobachten und Befunde beheben.
- **Wortlaut-Sperre** `retainedChallengeChoices` in `app/retained-answer-wording.mjs`: hält alte Antworttexte wörtlich fest, damit gespeicherte Antworten passen. Beim Umschreiben der Challenge-Fragen gezielt lösen (Pass-Kompatibilität zuerst).
- Speicher voll oder Worker-Fehler: Verhalten prüfen und kindgerecht erklären.
- Echte Geräte und Bildschirmleser (VoiceOver, TalkBack) wurden nie getestet. Nur mit echtem Nachweis behaupten; mit dem Nutzer klären, ob ein Gerätetest möglich ist.
- Schwer wartbaren Code (Zeilen mit bis zu 6.000 Zeichen) dort lesbar machen, wo eine Phase ohnehin arbeitet.
- **Inhaltsprüfung** `tests/content-integrity.test.mjs` (stabile IDs, Bildnachweise, Export) kam in Schritt 0 ohne `KNOWN_GAPS`-Liste aus: Der heutige Stand erfüllt alle Regeln. Neue Lücken nur mit BACKLOG-Verweis eintragen; die Liste darf nur kürzer werden.
- **`exports/content/` ablösen:** 30 Browser-Testmodule lesen die exportierten Inhaltsdateien (Befund Schritt 0, deshalb noch im Repository). Tests nach und nach direkt auf die Quellen in `app/` umstellen, dann `exports/` und den Export-Schritt in `test:full` entfernen. Bis dahin schreibt jeder `test:full`-Lauf einen neuen Zeitstempel in `exports/content/index.json`: vor dem Commit zurücksetzen.
- **Inhaltswächter erweitern** (Befunde code-pruefer, Schritt 0): (1) eigene Illustrationen tragen ihre KI-Kennzeichnung, und SVGs enthalten kein `<script>`, `<foreignObject>` und keine fremden Adressen (Vorlage: Test „24 local own images …“ in `git show b53f75f:tests/animal-expansion.test.mjs`); (2) Fragen-IDs der Spielbanken „Technik“ und „Früher oder heute?“ in `stable-ids.json`; (3) Orts-IDs, die als Entdeckung oder Favorit im Pass stehen (Länder, Hauptstädte, Meere, Kontinente, Plattenorte, Meeresorte).
- **Browser-Runner:** `stop()` in `tests/browser/harness.mjs` nach etwa 5 s mit SIGKILL beenden; `people-learning`, `offline-retention` und `animal-native-zoom` sammeln noch keine Konsolenfehler über `monitor`.
- **Rauchtest-Bilder:** Der Rauchtest fotografiert, bevor alle Fotos geladen sind (Befund Schritt 0: leere Bildflächen bei Löwe, Gepard, Curie, mal so, mal so). Vor dem Screenshot auf sichtbare Bilder warten, damit Vorher/Nachher-Vergleiche ruhig bleiben.
- **Alte Branches und Entwurfs-PR #27 aufräumen** (nur nach eigener Rückfrage): 107 gemergte und 122 `codex/*`-Branches auf GitHub; Entwurfs-PR #27 „Paket 3.5“ (Codex, alte Basis) vorher auf Brauchbares für spätere Phasen durchsehen.
- **Vollprüfung dauert lange:** `test:full` braucht in Chromium nacheinander rund zwei Stunden (Messung Schritt 0; CI-Grenze deshalb 180 Minuten). Suiten beschleunigen oder sinnvoll aufteilen, statt die Zeitgrenze im CI-Job weiter zu erhöhen.

## Medien mit offenen Rechten

- Acht Landschaftsgrafiken sind Rekonstruktionen und als solche zu kennzeichnen (WK-051).
- Merian-Porträt (Original nicht abrufbar), Lehmann-Foto (Lizenz unbelegt), Pont/Sydney-Aufnahmen: nur eigene gekennzeichnete Grafiken, bis ein freies Original gefunden ist (`bild-recherche`).

## Ideen-Sammlung

Erst nach Durchsicht durch `ideen-scout`, `kinder-redaktion` und `fakten-pruefer` einplanen.

**Themenwünsche des Nutzers (21.11.2026):**
- Medizin und Körper, zum Beispiel Knochen (den Körper erklären, keine Gesundheitsratschläge).
- Wirtschaft, Geld und Zinsen (gut als Mitmach-Modell im Forscherlabor).
- Religionen der Welt (neutral und respektvoll).
- Aktuelle Technik wie das Elektroauto (zeitlos erklärt, keine Nachrichten).
- Mehr Erdkunde und Geschichte (auf vorhandenen 31 Geschichtsthemen und dem Globus aufbauen).

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
