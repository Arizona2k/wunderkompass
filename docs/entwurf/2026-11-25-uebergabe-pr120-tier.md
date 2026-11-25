# Übergabe: PR #120 und Tier-PR (25.11.2026, abends)

Gesichert, weil das Nutzungslimit bei 93 % stand. Weiter erst nach dem „Go“ des Nutzers.

## PR #120 (Design-Umbau Schritt 1, Branch `claude/gracious-hypatia-a2jweq`)

- Code-Stand cb01af3. Grün: `pnpm run check` lokal, CI auf GitHub (Required quality checks, Engine-Schnellprüfung Firefox und WebKit), große Suiten in Chromium `core`, `offline-cold-full`, `home`, `home-visits`, `components`.
- Beim Sichern liefen noch: `journeys` (lokal, rund 44 Minuten; Log nur im Container) und die erste Schlussprüfung mit Fable (`schluss-pruefer`, von Hand als `general-purpose` mit Modell `fable`). Ist der Container weg: `journeys` neu starten (`node tests/browser/run.mjs --suite full journeys`, Hintergrund mit `timeout: 7200000`) und die Fable-Prüfung neu beauftragen.
- Danach: PR-Text unten in den PR übernehmen, Auto-Merge einschalten (OK des Nutzers liegt vor: „Ok fürs mergen“), Test-Seite mit `list_deployments` prüfen, Trigger `trig_012nJstrdgn8KftyoDf4spVE` löschen, PR-Abo beenden.
- Dauer für den CHANGELOG: Beginn 15:36 UTC (Commit 3f26937).

## Tier-PR (Branch `claude/tier-aufloesung-vorbereitung`, Basis 4f9f4fe)

- Fertig gebaut und von `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer` in drei Runden geprüft ([Entscheidungen](2026-11-25-tier-aufloesung-nachpruefung-entscheidungen.md)). Dazu „Was ist neu?“, der neue Helfer `schluss-pruefer` und die Regel „Fehler nur einmal“ ([Liste](../fehler-nicht-wiederholen.md)).
- Beim Sichern liefen zwei `spieltester` (6 Jahre am Handy: Tierdetektiv Entdecker; 10 Jahre am Rechner: „Wer frisst was?“ und „Tier & Lebensraum“ Profi) gegen einen lokalen Build. Fehlen ihre Berichte (`docs/entwurf/2026-11-25-tier-aufloesung-spieltest-*.md`), neu beauftragen. Der Handy-Test traf das alte Spiel „Tierdetektiv“ statt „Tierdetektiv – neue Spuren“ (Anmerkung im Bericht): für das Welt-Spiel nachholen, Befunde zum alten Spiel ins BACKLOG.
- **Spieltest am Rechner (Profi) fand Wichtiges, vor dem PR klären** ([Bericht](2026-11-25-tier-aufloesung-spieltest-rechner.md)): (1) „Wer frisst was?“: Die richtige Antwort ist bei Allesfressern oft die einzige lange Mischkost-Antwort mit „auch“, „vor allem“, „je nach“ (Orca, Strauß, Katta, Waschbär) – Ratemuster nach Länge. (2) Fallen aus immer demselben kleinen Vorrat (Plankton, Krill, Bambus, Eukalyptus), nach zwei Aufgaben streichbar. (3) Grasfrosch: drei Ein-Wort-Lebensräume gegen eine lange Antwort; Auflösung nennt Wiesen, Antwort nicht. (4) Savannenelefant: „Eukalyptusblätter“ als Falle neben „Pflanzen“ ist halb richtig. (5) Denkfrage bei „Wer frisst was?“ fragt „Wie groß ist dieses Tier?“ – passt kaum zum Futter. (6) Auflösungen Elefant, Erdmännchen, Kaiserpinguin ohne Bezug zur Frage. (7) „Wiesen und Gärten“ gegen „Wiesen & Gärten“. (8) „Ganz schön knifflig …“ auch nach „Richtig!“. Vorschlag: (1) bis (5) im Tier-PR mit `stufen-pruefer` und `karten-autor` lösen (Fallen mit langer Mischkost, größerer Vorrat, Futter-Denkfrage), (6) bis (8) prüfen, Rest ins BACKLOG.
- Nach dem Merge von #120: `git checkout --no-track -B claude/gracious-hypatia-a2jweq origin/test-live`, dann alle Commits von `claude/tier-aufloesung-vorbereitung` ab 4f9f4fe der Reihe nach cherry-picken (Konflikte höchstens in `CLAUDE.md`, `STATUS.md`, `CHANGELOG.md`, `app/kern/neuigkeiten.ts`).
- Dann: `pnpm run check`, `node tests/browser/run.mjs --suite full core offline-cold-full playground animals` (Hintergrund, `timeout: 7200000`), `schluss-pruefer` auf dem fertigen Diff, CHANGELOG mit Messwerten, STATUS, BACKLOG, Vorschau, PR nach `test-live` mit dem Text unten, Merge nach grüner CI (OK liegt vor).

## Gleich nach „Go“ zusätzlich

- `technik-pruefer` (jetzt opus / high) im Hintergrund mit den neuen Aufträgen „Vorausdenken“, „Vorausplanen“ und „Helfer-Einsatzplan“ (Punkte 9 bis 11 seiner Anleitung). Modelle und Einsätze aller Helfer: `docs/helfer-einsatzplan.md` (`design-pruefer` und `ideen-scout` jetzt opus / high). Er steht schon in der Helferliste, liest aber seine neue Anleitung erst im nächsten Chat aus dem Hauptordner: darum die Datei aus diesem Branch als Auftrag mitgeben.

## PR-Text für #120 (zum Übernehmen)

## Was ist fertig?

Design „Kompass“, Schritt 1: ruhige Farben, ein Fokusrahmen, gleiche Knöpfe ([Bauplan](docs/entwurf/2026-11-25-umbau-schritt-1-bauplan.md)).

- **Ruhige Kompass-Farben** überall: Kartenpapier, dunkle Tinte, Blaugrün als Hauptfarbe. Alle Werte stehen einmal in `app/kern/kern.css`.
- **Ein Fokusrahmen** für alles, was man mit der Tastatur erreicht: 3 px Blaugrün. Er bleibt jetzt auch an Stellen sichtbar, wo er fehlte: Pass-Überschriften, Themenkachel nach „zur Auswahl“, Schließen-Knopf im Pass.
- **Gleiche Knöpfe** auf Start, Welten, Karten, in Spielen, Laboren, Reisen, am Globus und im Pass: mindestens 48 px hoch, Schrift 16 bis 18 px, mit „Größerer Schrift“ größer.
- **Grün heißt nur „richtig“:** Gewählte Knöpfe, Filter und Reiter sind blaugrün statt grün oder orange.
- **Rückmeldung neutral:** Der Kasten nach einer Antwort ist weiß. „Richtig!“ und „Noch nicht ganz“ sind überall gleich groß.
- **Kreuz bei falsch:** Eine falsche Antwort zeigt ein Kreuz, die richtige einen Haken. So ist sie nicht nur an der Farbe zu erkennen.
- „Was ist neu?“: „Ruhige Farben, gleiche Knöpfe“.

Entdeckerpass, IDs und Links ändern sich nicht. Es ist nur Gestaltung (CSS), dazu Tests und Unterlagen. Mit dabei sind gesicherte Helferberichte zum nächsten Schritt (Tier-Auflösungen), noch ohne Einbau.

## Was kann man sich ansehen?

- Vorschau: https://wunderkompass-git-f420d3-interaktive-wissens-und-lernplattform.vercel.app/ (nur zum Ansehen, eigener Pass; Kinder benutzen die Test-Seite)
- Bilder wurden im Chat gezeigt (Start, Karte und Spiel mit falscher Antwort, Welten, Pass; Handy 390 px und Rechner 1280 px).

## Prüfung

- [x] `pnpm run check` lokal grün (auf dem letzten Stand `cb01af3`, mit der neuen Suite `kontrast`)
- [x] Passende Helfer gefragt: `spieltester`, `code-pruefer`, `design-pruefer`, nach dem späten Fund `technik-pruefer` ([Spieltest](docs/entwurf/2026-11-25-umbau-schritt-1-spieltest.md), [Code](docs/entwurf/2026-11-25-umbau-schritt-1-codepruefung.md), [Design](docs/entwurf/2026-11-25-umbau-schritt-1-design-pruefung.md)). Alle Muss-Befunde sind eingebaut, der Rest steht je Schritt in BACKLOG Punkt 29.
- [x] Entdeckerpass, IDs und alte Links unverändert
- [x] Keine neuen Bilder
- [x] Keine echten Pässe, persönlichen Daten oder Zugangsdaten
- [ ] Nur am Phasenende: `test:full` in drei Browsern (kein Phasenende)

Zusätzlich gelaufen:
- `kern-huelle`, `wissenskarte` (mit den Kartenstufen), `spiel-fokus` und `pass-atlas` einzeln in Firefox und WebKit (Regel „Engine-Sonderverhalten“). Auf dem letzten Stand grün: alle außer `wissenskarte` in WebKit, die läuft noch.
- Große Suiten in Chromium auf dem letzten Stand: `core`, `offline-cold-full`, `home`, `home-visits`, `components` und `journeys` grün.
- Späte Korrektur vor dem PR: Der Fokusrahmen bei erzwungenen Farben war in Firefox zu blass (Systemfarbe auf Weiß, 2,9:1). Er nimmt jetzt die Textfarbe (`cdd7b8d`).
- **Später Fund während des PR:** Das neue, etwas dunklere Kartenpapier schob zehn alte Grautöne knapp unter den nötigen Schriftkontrast (4,5:1). Gemeldet haben es nur zwei große Suiten, deren Ausschnitt zufällig dort lag. Behoben in `app/globals.css` (`6b12847`), danach 0 Befunde.
- **Damit das nicht wieder spät auffällt:** neue Prüfung `kontrast` im CI-Satz (`cb01af3`). Sie misst den Schriftkontrast auf ganzen Seiten in 14 Hauptansichten, in 320 und 1280 px, rund 60 s. Am alten Stand ist sie rot und nennt jede zu blasse Farbe, am neuen grün. Die `technik-pruefer`-Prüfung zum späten Fund liegt bei ([Bericht](docs/entwurf/2026-11-25-spaeter-fund-kontrast.md)).

## Was ist zu entscheiden?

Nichts. Das OK zum Mergen liegt vor („Ok fürs mergen“, 25.11.2026). Gemergt wird, wenn die CI grün ist, auch die Engine-Schnellprüfung.

## Nachgeführt

- [x] `STATUS.md`, `BACKLOG.md` (Punkt 29: Reste je Schritt), `CHANGELOG.md` (Messwerte; die Dauer folgt nach dem Merge)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01464e8iU95j3VgmwnD5oXVQ

## PR-Text für den Tier-PR (Entwurf)

## Was ist fertig?

Tierspiele mit kurzer Auflösung, klaren Sätzen nach falscher Antwort und sauberen Fallen ([Endfassung](docs/entwurf/2026-11-25-tier-aufloesung-endfassung.md), [Entscheidungen](docs/entwurf/2026-11-25-tier-aufloesung-nachpruefung-entscheidungen.md)).

- **Kurze Auflösung nach „Richtig!“** in „Tierdetektiv“, „Tier & Lebensraum“ und „Wer frisst was?“: für alle 48 Tiere je ein bis drei kurze Sätze, warum das stimmt (144 Texte in `app/world-game-tier-aufloesung.json`), statt eines langen Kartentexts.
- **Nach einer falschen Antwort** sagt das Spiel, was gewählt wurde, und stellt eine Denkfrage, zum Beispiel: „Du hast eine trockene Wüste gewählt. Dort gibt es kaum Wasser. Wie wichtig ist Wasser für dieses Tier?“ Der Tierdetektiv sagt „Zuhause“ und „Futter“ statt „Lebensraum“ und „Nahrung“.
- **Fallen bereinigt:** Keine falsche Antwort steckt mehr ganz oder halb in der richtigen. Profi-Fallen sind ähnlich, aber sicher falsch („Bambus“ statt „Fleisch“ beim Koala). Das Ratemuster bleibt weg („Fleisch“ und „Pflanzen“ sind je in rund zwei Dritteln der Fälle richtig, Grenze 80 %).
- **Kartenkorrekturen:** Carl Benz (Vorname, Patent, Quelle Deutsche Biographie), Aufzug (Gegengewicht etwa so schwer wie die halb volle Kabine), elektrisches Licht (Swan und Edison, Glühfaden aus Kohle), Kühlschrank (neue Quelle).
- **Clownfisch-Hinweise:** fragen nach dem Mund der Seeanemone. Der alte Hinweis schickte Kinder zur Zeile „Tiergruppe: Fische“, die zum Clownfisch gehört.
- „Was ist neu?“: „Tierspiele: Darum stimmt es“ (geprüft von `kinder-redaktion`).
- **Neuer Helfer `schluss-pruefer`:** Fable prüft jeden PR mit App- oder Inhaltsänderung zuletzt, vor dem PR-Link oder Auto-Merge (Wunsch des Nutzers; Pilot für drei PRs). Verankert in `CLAUDE.md`, `/pruefen` und `/weiter`, Ersatz bei fehlendem Fable über „Vorübergehende Modell-Ausnahmen“.

Entdeckerpass, IDs und Links ändern sich nicht. Keine gespeicherte Kartenantwort ändert sich. Gestrichene Fallen in gespeicherten Runden bleiben lesbar.

## Was kann man sich ansehen?

- Vorschau: https://wunderkompass-git-f420d3-interaktive-wissens-und-lernplattform.vercel.app/ (nur zum Ansehen, eigener Pass; Kinder benutzen die Test-Seite)
- Bilder: im Chat

## Prüfung

- [ ] `pnpm run check` lokal grün
- [ ] `node tests/browser/run.mjs --suite full core offline-cold-full playground animals` (Kartentexte geändert; `playground` prüft die Spieltexte im Browser)
- [x] Texte geprüft von `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer`, in drei Runden. Berichte liegen in `docs/entwurf/2026-11-25-tier-aufloesung-*.md`.
- [ ] `spieltester`
- [ ] `schluss-pruefer` (Fable) auf dem fertigen Diff samt diesem Text
- [x] Entdeckerpass, IDs und alte Links unverändert
- [x] Keine neuen Bilder
- [x] Keine echten Pässe, persönlichen Daten oder Zugangsdaten

## Was ist zu entscheiden?

Nichts. Das OK zum Mergen liegt vor (STATUS, Freigabe vom 25.11.2026). Gemergt wird nach grüner CI samt Engine-Schnellprüfung.

## Nachgeführt

- [ ] `STATUS.md`, `BACKLOG.md` (Punkt 30), `CHANGELOG.md` (Messwerte)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01464e8iU95j3VgmwnD5oXVQ
