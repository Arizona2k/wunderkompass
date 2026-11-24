# Code-Prüfung Folge-PR „Entscheidungen zu Teil A“ (24.11.2026)

Helfer: `code-pruefer` (opus / high). Geprüft: `git diff origin/test-live...HEAD` auf `claude/trusting-galileo-ck3o23` (Stand `f500ff3`): Paketspiegel-Skript und `quality.yml`, Stresslauf (`tests/browser/stresslauf.mjs`, `run.mjs`), gestrichener Größenvergleich. Bericht unverändert übernommen; was daraus wurde, steht am Ende.

**Ergebnis:** Die Änderungen sind bereit. Nichts Blockierendes, nur drei Kleinigkeiten und ein Hinweis zu den Unterlagen.

## Befunde

**Kleinigkeit 1: Ein ungültiger Wert für `QA_FRAME_DELAY_MS` wird still übergangen**
- Fundstelle: `tests/browser/run.mjs:45-46`
- Was passiert: `QA_FRAME_DELAY_MS=150ms` (oder ein Tippfehler) ergibt `Number(...)` = `NaN`. `NaN` ist falsy, also wird die Bremse nie geladen. Die Fehlermeldung in `stresslauf.mjs:9` wird nie erreicht.
- Folge: Der Lauf läuft ungebremst, wird grün und gilt fälschlich als Stresslauf. Die Zeile „Stresslauf: …“ fehlt zwar im Log, aber das übersieht man leicht.
- Vorschlag: Die Bedingung auf `process.env.QA_FRAME_DELAY_MS` setzen, nicht auf die Zahl. Dann prüft `bremseBilder` jeden gesetzten Wert, auch `0` und `NaN`.

**Kleinigkeit 2: Mehrere rAF-Aufrufe aus demselben Bild können in verschiedenen Bildern landen**
- Fundstelle: `tests/browser/stresslauf.mjs:37-45`
- Was passiert: Jeder Aufruf bekommt einen eigenen `setTimeout`. Zwei rAF-Aufrufe aus demselben Bild laufen danach nicht sicher im selben echten Bild. Die Reihenfolge bleibt erhalten, weil Timer mit gleicher Verzögerung der Reihe nach feuern.
- Folge: Nicht bewusst gewollt, kann einen Fehlalarm im Stresslauf auslösen, den es ohne Bremse nicht gibt. Kein Fehler im CI-Weg, denn der Code läuft ohne Schalter gar nicht.
- Vorschlag: In den Kommentar schreiben, dass Rot im Stresslauf erst bestätigt werden muss.

**Kleinigkeit 3: Einträge ohne `priority:` rücken nach vorn**
- Fundstelle: `scripts/ci-paketspiegel.sh:20-21`
- Was passiert: Laut apt-Doku gilt für einen Eintrag ohne `priority:` die höchste Zahl, er kommt also zuletzt dran. Das Skript gibt ihm `priority:10`. Ein Eintrag mit `priority:50` bleibt bei 50 und fällt damit hinter ihn zurück. Bei Prioritäten wie 2 und 12 werden beide zu 12, die Reihenfolge geht verloren.
- Folge: Widerspricht dem Kommentar „bleiben in ihrer Reihenfolge“. Auf den GitHub-Rechnern egal, weil alle Einträge Prioritäten 1 bis 3 haben.
- Vorschlag: Einträge ohne Priorität unverändert lassen, oder den Kommentar anpassen.

**Hinweis (Unterlagen, außerhalb des Auftrags):** `CHANGELOG.md:11` sagt „Er gehört jetzt zu `/pruefen`“. In `.claude/skills/pruefen/SKILL.md` steht aber nichts vom Stresslauf; die Entscheidungsliste sagt selbst „Aufnahme in `/pruefen`: folgt“. Entweder den Schritt eintragen oder den Satz ändern.

## Geprüft und in Ordnung

1. **Paketspiegel** (`scripts/ci-paketspiegel.sh`, `quality.yml`)
   - Mit mawk 1.3.4 an drei Listen ausprobiert (AWS-Spiegel mit Priorität 1 plus archive 1 und security 3; Kommentare, eingerückte Kommentare, Leerzeilen, Leerzeichen-Zeilen; Einträge mit und ohne `priority:`, Tab oder Leerzeichen, `http` und `https`, mit und ohne Schrägstrich am Ende; Liste ohne archive, dann wird `https://archive.ubuntu.com/ubuntu/ priority:1` angehängt). Kommentare und Leerzeilen bleiben, nur archive hat 1, alle anderen alte Zahl + 10, ein zweiter Aufruf ändert nichts.
   - gawk nicht installiert, nicht ausprobiert; das Skript nutzt nur POSIX-awk.
   - Die CI geht nicht kaputt: Datei fehlt → Meldung und Exit 0 (ausprobiert); nicht beschreibbar → `sudo cp`, Besitzer und Rechte bleiben; `set -euo pipefail` bricht nur ab, wenn `mktemp`, awk oder sudo wirklich scheitern; Aufruf mit `bash`, fehlendes Ausführrecht egal; alle drei Jobs checken vorher aus.
   - Priorität: apt-Doku (`doc/apt-transport-mirror.1.xml`): „The mirrors with the lowest number are tried first … same priority is again random.“ Die Annahme stimmt.
   - Alle drei Installationsstellen gleich (`quality.yml` Zeilen 49, 110, 166), andere gibt es nicht.
2. **Stresslauf**
   - Alle Wege der Suiten laufen über die beiden gebremsten Stellen: `browser.newContext`, `context.newPage`, `browserType.launch` (kern-huelle:485), `browserType.launchPersistentContext` (offline-cold, animal-learning, journey-zoom, native-world-selection), `browser.newPage` (backup; ruft in Playwright 1.65.1 intern `this.newContext(options)` auf).
   - Firefox mit `dropIsMobile`: legt sich über den schon gebremsten `newContext`, genau einmal gebremst. Die nativen Suiten nehmen `browserType` aus dem Runner, also dasselbe Objekt.
   - Ausprobiert: Verzögerung 151 ms (Chromium, Firefox), 167 ms (WebKit); Abbrechen in beiden Phasen wirkt in allen drei Engines; Bremse wirkt in der ersten Seite eines dauerhaften Profils und in iframes; Zeitstempel aus dem echten Bild.
   - IDs starten bei 1 und sind eindeutig; Abbruch einer unbekannten oder gelaufenen ID tut nichts.
   - Ohne `QA_FRAME_DELAY_MS` wird `stresslauf.mjs` nicht geladen, die Zeiten-Datei bleibt gleich.
3. **Größenbudget**
   - Feste Grenzen in `build` und `browser` identisch mit `origin/test-live`, ebenso `violations()`.
   - Der Test prüft alle sechs festen Build-Grenzen (je +1 Byte → Verstoß) und die drei Browser-JS-Budgets; weggefallen sind nur die Prüfungen zum gestrichenen Beobachten.
   - Keine Restverweise auf `performance-trend-baseline`, `observeOnly`, `observedTrends`, `trends` außerhalb der Unterlagen.
   - `pnpm test` grün (437 von 437), `pnpm run lint` und `pnpm run typecheck` grün.

## Nicht geprüft

- gawk (nicht installiert).
- Ob der neue Spiegel in der echten GitHub-CI schneller ist (zeigt erst der CI-Lauf).
- Kein vollständiger Stresslauf über eine Suite, nur gezielte Proben in allen drei Engines.
- `pnpm run build`, Browser-Suiten, `pnpm run check`.
- `QA_PLAYWRIGHT_MODULE` mit einem CommonJS-Modul (der Runner greift genauso auf `playwright[engine]` zu, also nicht neu).

## Was daraus wurde (Claude, 24.11.2026)

- Kleinigkeit 1: behoben. `run.mjs` lädt die Bremse, sobald `QA_FRAME_DELAY_MS` gesetzt ist; `bremseBilder` lehnt `0`, `NaN` und Text mit Fehlermeldung ab.
- Kleinigkeit 2: im Kopfkommentar von `stresslauf.mjs` und im `/pruefen`-Schritt vermerkt: Rot im Stresslauf erst bestätigen (Ursache klären), dann beheben.
- Kleinigkeit 3: behoben. Einträge ohne `priority:` bleiben unverändert (sie sind schon zuletzt dran), alle anderen bekommen alte Zahl + 10, ihre Reihenfolge bleibt genau. Ein zweiter Aufruf schiebt sie nur weiter nach hinten; archive bleibt bei 1. Kommentar angepasst.
- Hinweis: Der Stresslauf steht jetzt als Schritt in `/pruefen`.
