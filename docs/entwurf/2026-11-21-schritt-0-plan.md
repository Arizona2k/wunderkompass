# Schritt 0 „Großputz & Arbeitsweise“ – Bauplan

> **Für ausführende Agenten:** Diesen Plan Aufgabe für Aufgabe abarbeiten, mit superpowers:executing-plans (selbst) oder superpowers:subagent-driven-development (je Aufgabe ein frischer Helfer). Häkchen (`- [ ]`) zeigen den Fortschritt.

**Ziel:** Ballast entfernen, schlanke Prüfungen einführen, kurze Unterlagen und Helfer einrichten. Die Kinderseite bleibt dabei Byte für Byte gleich, bis auf die Build-Kennung.

**Aufbau:** Erst den Ausgangsstand sichern (Tags, `dist/`-Kopie). Dann die Prüfungen von der alten Nachweiskette lösen und einen kleinen neuen Browser-Runner bauen. Erst danach wird die alte Maschinerie gelöscht. Am Ende belegen ein `dist/`-Vergleich, Screenshots und ein Offline-Update-Test, dass sich für Kinder nichts ändert.

**Technik:** Node 24, pnpm 11.25.0, React 19, Vite 8, `node --test`, Playwright 1.63.0 (Chromium), GitHub Actions, Vercel (Git-Anbindung).

**Entwurf:** [`docs/entwurf/2026-11-21-neuausrichtung-design.md`](2026-11-21-neuausrichtung-design.md), Teil 2. Plan und Entwurf immer zusammen lesen.

## Feste Vorgaben

- Node 24 und pnpm 11.25.0, immer `--frozen-lockfile`. Im Container gilt `export PATH=/opt/node24/bin:$PATH` (Standard dort ist Node 22).
- Arbeitsbranch `claude/fervent-meitner-asxhow`. Kein Force-Push. `main` nie anfassen. PR nur nach `test-live`. Gemergt wird erst nach „ok“ des Nutzers im Chat.
- Tags: `archiv/vor-neuausrichtung-2026-11-21` → `b53f75f`, `archiv/pr95-geschichte-2026-11-21` → `7e00bd0`.
- Nicht ändern: `app/`, `components/`, `lib/`, `public/`, `vendor/`, `migration/`, `hooks/`, `index.html`, `vite.config.ts`, `vercel.json`, `build/learning-*`, `content/update-history-evidence.json`, `content/research/`.
- Pass-Kennungen bleiben: Schema 3, `earth-explorer`, `erde-entdecken:save:v3`, Legacy `erde-entdecken:forscherpass:v2`, IndexedDB `earth-explorer`.
- CI-Jobname bleibt exakt **„Required quality checks“**. Nur Chromium. Ziel: unter 10 Minuten.
- Rauchtest in 360 px (Touch) und 1440 px.
- `dist/` darf sich nur in der Build-Kennung unterscheiden.
- Keine Kosten, keine neuen Dienste oder Konten.
- Commits als `Claude <noreply@anthropic.com>`. Keine echten Pass-Dateien und keine persönlichen Daten.
- Keine Prüfung abschwächen, überspringen oder blind wiederholen, nur damit sie grün wird. Eine Teilprüfung nie als Gesamtprüfung ausgeben.
- **Löschregel:** Vor jedem Löschen nach Lesern suchen, mit `grep -rn <Dateiname>` über `app components lib build scripts tests migration hooks .github vite.config.ts index.html package.json vercel.json eslint.config.mjs tsconfig.json`. Bleibt ein Leser, der nicht selbst gelöscht wird, bleibt auch die Datei. Unklares bleibt liegen und wird im STATUS notiert.
- **Import-Prüfung:** Nach jedem Lösch-Commit läuft das Skript `$S/import-check.mjs` (siehe Aufgabe 1). Es meldet 0 fehlende relative Import- und Leseziele.
- Unterlagen auf Deutsch, in kurzen Sätzen.

`$S` steht für das Scratchpad `/tmp/claude-0/-home-user-wunderkompass/06ac61c3-9979-5ec9-91bb-8328059da415/scratchpad`. Es kann bei einem Neustart verschwinden. Dann den Ausgangsstand neu erzeugen: `git worktree add /home/user/wk-live archiv/vor-neuausrichtung-2026-11-21`, dort installieren, bauen und Aufgabe 1 wiederholen.

## Prüf-Schwerpunkte

Diese fünf Fälle prüft keine einzelne Aufgabe von selbst. Sie würden aber echte Nutzer treffen. Jeder bekommt einen Prüfschritt in Aufgabe 13 oder 14:

1. **Wer die Seite offline gespeichert hat,** bekommt nach dem Merge eine neue Build-Kennung. Erwartung: Die App lädt die neue Version (mit oder ohne Hinweis „Neue Version laden“), und der Pass bleibt erhalten. → Aufgabe 13, Schritt 5
2. **Vercel baut mit dem geänderten Lockfile** (`corepack pnpm install --frozen-lockfile`). Erwartung: Die Vorschau ist bereit und liefert dieselbe Build-Kennung wie der lokale Build. → Aufgabe 14, Schritt 2
3. **Alte Links von Freunden auf der echten Vorschau-Adresse** (`#news/…`, `#journeys/water`, `#world/topic/…`). Erwartung: Sie werden wie lokal aufgefangen. → Aufgabe 14, Schritt 3
4. **Die CI auf GitHub** (frische Installation, `--jobs 2`, 4 Kerne). Erwartung: grün, ohne Wackler, möglichst unter 10 Minuten. → Aufgabe 14, Schritt 5
5. **Eine neue Chat-Sitzung startet auf `main`.** Das ist der Standardbranch, dort fehlen `CLAUDE.md` und `/weiter`. Erwartung: Die Startnachricht in STATUS wechselt zuerst auf `test-live`. → Aufgabe 14, Schritt 8 (nach dem Merge)

---

### Aufgabe 1: Ausgangsstand sichern

Kein Commit. Ergebnis sind Vergleichsdaten im Scratchpad.

**Dateien:**
- Neu: `$S/baseline/dist/` (Kopie des Ausgangs-Builds), `$S/baseline/build-id.txt`
- Neu: `$S/compare-dist.mjs`, `$S/import-check.mjs`

**Schnittstellen:**
- Liefert: `node $S/compare-dist.mjs <distA> <distB>` gibt die Zahl der Unterschiede aus. Exit 0 heißt 0 Unterschiede.
- Liefert: `node $S/import-check.mjs` gibt fehlende Ziele aus. Exit 0 heißt keine.

- [ ] **Schritt 1:** In `/home/user/wk-live` (Stand `b53f75f`) mit Node 24 `pnpm install --frozen-lockfile && pnpm run build` ausführen. Erwartung: Exit 0.
- [ ] **Schritt 2:** `dist/` nach `$S/baseline/dist/` kopieren. Die Build-Kennung aus `<meta name="learning-build">` nach `build-id.txt` schreiben. Erwartet wird `68f3b45724224e9f`.
- [ ] **Schritt 3: `compare-dist.mjs` schreiben.** Es vergleicht zwei `dist/`-Bäume nach diesen Regeln:
  - Pfade und Textinhalte (`.js .css .html .json .webmanifest .svg .txt`) werden normalisiert. Beide Build-Kennungen werden zu `__BUILD__`. Vite-Hashes `-[A-Za-z0-9_-]{8}.(js|css)` werden zu `-[hash].$1`.
  - Gruppiert wird nach normalisiertem Pfad. Verglichen wird die sortierte Liste der SHA-256-Werte der normalisierten Inhalte. So lösen gleichnamige Chunks keinen Fehlalarm aus.
  - Ausgabe: fehlende, zusätzliche und abweichende Pfade.
- [ ] **Schritt 4:** Selbsttest von `compare-dist.mjs`:
  - Baseline gegen sich selbst ergibt 0.
  - Gegen eine Kopie mit einem geänderten Byte in einer `.js`-Datei ergibt 1.
- [ ] **Schritt 5: `import-check.mjs` schreiben.** Es durchsucht alle `.mjs .js .cjs .ts .tsx` in `scripts tests build app` sowie `package.json` und `.github/workflows/*.yml`.
  - Es findet relative Ziele in `from '…'`, `import('…')`, `require('…')`, `new URL('…', import.meta.url)` und in `readFileSync('…')`/`readFile('…')` mit festen Pfaden (zum Beispiel `content/…`, `exports/…`, `tests/fixtures/…`), außerdem in `node <pfad>`-Aufrufen in Skripten und Workflows.
  - Es meldet jedes Ziel, das nicht existiert. Endungslose Ziele gelten auch mit `.ts`, `.tsx` oder `.mjs`.
- [ ] **Schritt 6:** `import-check.mjs` auf dem aktuellen Stand laufen lassen. Erwartung: 0, oder nur vorhandene Altlasten. Diese Liste notieren, damit sie später nicht als neuer Fehler zählt.

### Aufgabe 2: Archiv-Tags

**Dateien:** keine.

- [ ] **Schritt 1:** `git fetch origin codex/wunderkompass-history-evidence-2026-11-08`. Prüfen, dass `FETCH_HEAD` = `7e00bd0…` ist.
- [ ] **Schritt 2:** Zwei kommentierte Tags anlegen:
  - `git tag -a archiv/vor-neuausrichtung-2026-11-21 b53f75f -m "Stand vor der Neuausrichtung (Weg C), mit allen alten Berichten und Tests"`
  - `git tag -a archiv/pr95-geschichte-2026-11-21 7e00bd0 -m "PR #95: acht Geschichtsthemen, für spätere kindgerechte Übernahme"`
- [ ] **Schritt 3:** Beide Tags einzeln pushen: `git push origin <tag>`. Prüfen mit `git ls-remote --tags origin 'archiv/*'`. Erwartung: beide Tags zeigen auf die richtigen Commits (`^{}`-Zeilen).

### Aufgabe 3: Testbefehl von der Nachweiskette lösen

Das muss zuerst passieren. Heute zieht `pnpm test` über `test-command.mjs` die Dateien `handoff.mjs`, `scripts/release/*`, `exports/content` und `qa/` mit.

**Dateien:**
- Ändern: `package.json` (Skript `test`), `scripts/test-runtime.mjs`
- Löschen: `scripts/test-command.mjs` (nach Löschregel; einzige Leser sind `package.json` und die Lint-Liste)

**Schnittstellen:**
- Liefert: `pnpm test` = `node --import ./scripts/test-runtime.mjs --test "tests/*.test.mjs"`. Es gibt keine `.qa-output/unit-proof.json` mehr.
- Liefert: Unter `test-runtime.mjs` lassen sich JSON-Dateien ohne `with {type:'json'}` importieren. Damit werden `app/world-index.ts` (`WORLD_ROUTES`) und `app/nature-data.ts` (`NATURE`) für Tests importierbar.

- [ ] **Schritt 1:** Fehlschlag zeigen: `node --import ./scripts/test-runtime.mjs -e "const m=await import('./app/world-index.ts');console.log(m.WORLD_ROUTES.length)"`. Erwartung: Fehler wegen fehlendem Import-Attribut.
- [ ] **Schritt 2:** In `test-runtime.mjs` einen `load`-Hook ergänzen. Für URLs mit Endung `.json` ruft er `nextLoad(url, {...context, importAttributes: {...context.importAttributes, type: 'json'}})` auf. Die bestehende Auflösung endungsloser `.ts`-Importe bleibt unverändert.
- [ ] **Schritt 3:** Den Befehl aus Schritt 1 wiederholen. Erwartung: Es wird eine Zahl ausgegeben.
- [ ] **Schritt 4:** Skript `test` in `package.json` ersetzen. `scripts/test-command.mjs` aus beiden Lint-Listen streichen und löschen.
- [ ] **Schritt 5:** `pnpm test`. Erwartung: Wie auf `b53f75f` laufen 99 Dateien und `# tests 572`, alle grün.
- [ ] **Schritt 6:** `pnpm run typecheck && pnpm run lint`. Grün. Danach committen: „Testbefehl von der alten Nachweiskette gelöst“.

### Aufgabe 4: Unit-Tests anpassen (FIX)

Die 31 FIX-Dateien aus **Anhang A** werden so geändert, dass sie keine Vergleichsdateien mehr importieren und keine wörtlichen Alttexte oder Hash-Pins mehr prüfen. Die Logik- und Integritätsprüfungen bleiben. Noch wird nichts gelöscht.

**Dateien:**
- Ändern: die 31 Dateien aus Anhang A, Abschnitt FIX
- Neu: `tests/fixtures/water-photosynthesis-legacy-answers.json`
- Neu: `scripts/source-constant.mjs`. Dorthin wandern `constant()` und `lit()` aus `scripts/export-content.mjs`, Zeilen 35–36. Das Export-Skript importiert sie von dort.

**Schnittstellen:**
- Liefert: `sourceConstant(file: string, name: string) → unknown` liest eine Konstante wie `LABS` als Literal aus einer `.ts`- oder `.tsx`-Quelldatei (TypeScript-Parser, wie bisher).

- [ ] **Schritt 1:** Die neun Legacy-Antwortsätze extrahieren. Sie liegen in `tests/fixtures/water-photosynthesis-M93-data-predecessor.json` unter `boundary.bankChanges` und kommen **vor** jeder Löschung in die neue Fixture. `water-photosynthesis.test.mjs` liest danach nur noch diese Datei.
- [ ] **Schritt 2:** Die Änderungen je Datei aus Anhang A umsetzen. Neue Quellen sind `GLOSSARY`, `WHY_QUESTIONS` und `JOURNEYS` aus `app/learning-data.ts`, `WORLD_ROUTES` aus `app/world-index.ts`, `NATURE` aus `app/nature-data.ts` und die JSON-Dateien unter `app/`.
  - `LABS` (`app/research-labs.tsx`) lässt sich nicht importieren. Labor-Prüfungen nutzen deshalb `sourceConstant('app/research-labs.tsx', 'LABS')`.
  - Kein Unit-Test außer `content-integrity` (Aufgabe 9) startet `export-content.mjs`, weil `node --test` die Dateien parallel ausführt und alle in `.qa-output/content-check` schreiben würden.
  - Nach dem Umbau des Export-Skripts: `node scripts/export-content.mjs --check` ist grün. Der Inhalt von `.qa-output/content-check` ist byte-gleich zu vorher (vorher eine Kopie sichern und vergleichen).
- [ ] **Schritt 3:** Prüfen: `grep -l -- '-reference.mjs\|predecessor\|editorial-reviews\|excellence-baseline\|exports/content' tests/*.test.mjs` liefert nur noch Dateien aus der DELETE-Liste.
- [ ] **Schritt 4:** Mutationsprobe: In drei geänderten Tests (`challenge`, `journeys`, `discovery`) je einmal den geprüften Wert absichtlich verfälschen. Der Test muss rot werden. Danach zurücksetzen.
- [ ] **Schritt 5:** `pnpm test`, `typecheck` und `lint` sind grün. Committen: „Unit-Tests auf echte App-Daten umgestellt“.

### Aufgabe 5: Unit-Tests und Vergleichsdaten entfernen (DELETE)

**Dateien:**
- Löschen: die 39 Testdateien aus Anhang A (DELETE), alle 28 `tests/*-reference.mjs`, die Hilfsdateien `tests/fixtures/animal-proof.mjs`, `nature-proof.mjs`, `search-ranking-before-p35.mjs` (falls nach Aufgabe 4 ohne Leser) und `tests/review-parts-fixture.py`
- Löschen: Fixtures nach Muster `*-predecessor*`, `*-hashes*`, `editorial-before-*`, `chronicle-before-*`, `book-before-*`, `world-photos-before-*`, `nature-before-*` und `godot-original-release.json`, jeweils nur ohne verbleibenden Leser (Löschregel, Browser-Tests eingeschlossen)

- [ ] **Schritt 1:** Die Dateien löschen. Vorher für jede Fixture die Löschregel anwenden. Sicher bleiben die Fixtures aus Anhang A, Abschnitt „bleibt“.
- [ ] **Schritt 2:** `node $S/import-check.mjs`. Erwartung: keine neuen fehlenden Ziele.
- [ ] **Schritt 3:** `pnpm test`. Grün. Neue Datei- und Testzahl notieren (etwa 60 Dateien).
- [ ] **Schritt 4:** `typecheck` und `lint` grün. Committen: „Prozess-Tests und Vergleichsdaten entfernt (bleiben im Archiv-Tag)“.

### Aufgabe 6: Neuer Browser-Runner und Rauchtest

**Dateien:**
- Neu: `tests/browser/harness.mjs`, `tests/browser/run.mjs`, `tests/browser/suites.mjs`, `tests/browser/smoke.mjs`
- Ändern: `package.json` (devDependencies `playwright` 1.63.0 und `axe-core` 4.11.4 exakt; Skript `test:smoke`; Lint-Listen), `pnpm-lock.yaml`

**Schnittstellen:**
- `harness.mjs`:
  - `startPreview({dist = process.env.QA_DIST ?? 'dist', port} = {}) → Promise<{base: string, port: number, stop(): Promise<void>}>`. Freien Port über `net.createServer().listen(0)` holen. Den vorhandenen `tests/browser/preview-server.mjs` mit `QA_PORT` und `QA_DIST` starten. Warten auf `WK_PREVIEW_READY <port>` und darauf, dass `/world.json` mit 200 antwortet (wie bisher in `portable-smoke.mjs`, 46 × 300 ms).
  - `ready(page) → Promise<void>`: wartet auf `[aria-label="Entdeckerpass öffnen"]:not([disabled])`, Zeitlimit 26 s.
  - `withPage(ctx, {width, height, touch = false}, fn) → Promise<void>`: neuer Kontext mit `reducedMotion: 'reduce'`. `isMobile` nur bei Chromium und Touch. Danach `ctx.monitor`, `goto(ctx.base)`, `ready`, `fn(page)`, Kontext schließen.
- Jede Suite bekommt ein `ctx`-Objekt: `{engine, browser, browserType, launchOptions, base, ready, monitor(page), report, shots, startPreview}`.
  - `report` = `{checks: [], ...browserErrorArrays()}` aus `scripts/browser-errors.mjs`.
  - `shots` = `.qa-output/browser/<engine>/<name>/`.
- `suites.mjs` exportiert `SUITES: Array<{name: string, set: 'smoke'|'ci'|'full', run(ctx): Promise<void>, chromiumOnly?: true, solo?: true}>`.
- `run.mjs` (nur Kommandozeile): `node tests/browser/run.mjs --suite smoke|ci|full [--browser chromium|firefox|webkit|all] [--jobs N] [--base URL] [name …]`.
  - `ci` umfasst smoke und ci. `full` umfasst smoke, ci und full.
  - Erste Zeile: `await import('../../scripts/test-runtime.mjs')`, danach erst `await import('./suites.mjs')`. Grund: Browser-Module importieren `app/*.ts`, und diese haben endungslose Importe. So funktioniert `node tests/browser/run.mjs` ohne Zusatzschalter.
  - Ein einzelnes `--` in den Argumenten wird ignoriert (`pnpm run … -- --browser x`).
  - `--base` ist nur mit `--suite smoke` erlaubt. Dann wird kein lokaler Server gestartet.
  - Ohne `dist/index.html` (oder `QA_DIST`): Abbruch mit „Erst pnpm run build ausführen“.
  - Playwright kommt aus `import(process.env.QA_PLAYWRIGHT_MODULE ?? 'playwright')`. `QA_BROWSER_EXECUTABLE` bleibt möglich. Chromium bekommt das Argument `--enable-unsafe-swiftshader`.
  - Je Suite: frischer `report`, Ausführung, danach muss `browserErrorsComplete(report)` gelten. Ausgabe `PASS|FAIL <name> <Sekunden>`. Nach einem Fehler geht es weiter. Am Ende Exit 1, falls etwas fehlschlug.
  - `--jobs N` lässt bis zu N Suiten gleichzeitig auf demselben Browser laufen. `solo`-Suiten laufen danach allein. `chromiumOnly`-Suiten werden in anderen Engines als „übersprungen (nur Chromium)“ gemeldet.
  - Für Firefox entfernt ein Wrapper um `browser.newContext` die Option `isMobile`, weil Firefox sie nicht kennt.
- `smoke.mjs` exportiert `smoke(ctx)`. Es läuft je einmal mit 360×800 (Touch) und 1440×900, mit diesen Prüfungen:
  1. Start: `.discovery-hero` ist sichtbar, kein waagerechter Überlauf (`scrollWidth <= innerWidth + 2`). Screenshot `start-<w>.png`.
  2. `#world/animals`: Das Textfeld „Entdeckerkarten durchsuchen“ ist sichtbar, kein Überlauf. Screenshot `welt-<w>.png`.
  3. `#world/topic/animal-polar-bear`: `.world-mini-question` ist sichtbar, kein Überlauf. Screenshot `karte-<w>.png`.
  4. Klick auf „Das interessiert mich!“: `erde-entdecken:save:v3` → `progress.favorites` enthält `topic:animal-polar-bear`, auch nach einem Reload.
  5. `#news/girl-day-2026` wird zu `#home`. `#journeys/water` wird zu `^#journeys/water/\d+$`.

- [ ] **Schritt 1:** Playwright und axe-core mit `pnpm add -D -E playwright@1.63.0 axe-core@4.11.4` hinzufügen. Danach `pnpm install --frozen-lockfile`. Grün.
- [ ] **Schritt 2:** Harness, Runner, Suites (nur `smoke`) und `smoke.mjs` schreiben. Skript `"test:smoke": "node tests/browser/run.mjs --suite smoke"` ergänzen.
- [ ] **Schritt 3:** Fehlschlag zeigen: `test:smoke` ohne `dist/` bricht mit dem Hinweis ab. Danach ein absichtlich falsches Thema (`animal-gibtsnicht`) einsetzen: `FAIL smoke`, Exit 1. Zurücksetzen.
- [ ] **Schritt 4:** `pnpm run build && pnpm run test:smoke`. Erwartung: `PASS smoke`, 6 Screenshots.
- [ ] **Schritt 5:** Gegenprobe auf dem Ausgangsstand: `QA_DIST=$S/baseline/dist pnpm run test:smoke`. Erwartung: `PASS`. Schlägt eine Prüfung schon dort fehl, ist das ein vorhandener Produktfehler. Dann anhalten und dem Nutzer berichten.
- [ ] **Schritt 6:** Die neuen Dateien in die Lint-Listen aufnehmen. `lint` ist grün (Konfiguration nur gezielt für `tests/browser/` anpassen, falls nötig). Committen: „Neuer schlanker Browser-Runner mit Rauchtest“.

### Aufgabe 7: Browser-Tests auf den neuen Runner umziehen

**Dateien:**
- Neu: `tests/browser/core.mjs` (aus `portable-smoke.mjs`, Zeilen 51–60), `tests/browser/offline-cold.mjs` (aus den Zeilen 67–79), `tests/browser-suites.test.mjs`
- Ändern: `tests/browser/suites.mjs`, `no-news.mjs`, `backup.mjs`, `axe-loader.mjs`, `playground.mjs` (axe-Pfad), `animal-learning.mjs`, `science-originals.mjs`, `book-normalization.mjs` (Review-Importe)
- Ändern: `package.json` (Skripte `test:browser` und `test:full`)

**Schnittstellen:**
- `core(ctx)` übernimmt den alten „core“-Block unverändert: 4 Breiten plus 320 px.
- `offlineCold(ctx, {full = false} = {})`:
  - startet eigenen Server über `ctx.startPreview()`
  - bereitet offline vor, stoppt den Server und startet einen kalten persistenten Kontext offline
  - prüft dann Foto, Energiemodell und Pass-Dialog
  - Mit `full: true` laufen zusätzlich die alten `offlineX`-Inhaltsrunden.
- `test:browser` = `node tests/browser/run.mjs --suite ci --jobs 2`.
- `test:full` = `node scripts/export-content.mjs && node tests/browser/run.mjs --suite full`.

- [ ] **Schritt 1: CI-Suiten eintragen** (Liste in Anhang B):
  - `offline-cold` und `offline-resilience` als `solo`
  - Tests, die nur innerhalb von `backup` aufgerufen werden (zum Beispiel `storage-feedback`, `book-notes`, `model-import-integrity`), **nicht** doppelt eintragen. Das mit `grep` prüfen.
- [ ] **Schritt 2: FULL-Suiten eintragen.** Sie spiegeln die bisherigen Aufrufe in `portable-smoke.mjs` (Zeilen 49–79) und zusätzlich die Module, die nur `journey-engines.mjs` erreicht. `chromiumOnly` setzen bei CDP oder nativem Zoom: `native-screenshot`, `journey-zoom`, `native-world-selection-return`, `animalNativeZoom`, `learning-task-offline`. Doppelläufe von CI-Flows innerhalb von FULL-Flows sind in Ordnung.
- [ ] **Schritt 3:** `no-news.mjs` übernimmt die 2 Konstanten aus `scripts/news-removal-evidence.mjs` direkt und verzichtet auf `newsRemovalComplete`. In `backup.mjs` den `process.argv[1]`-Block mit `runtime.mjs` löschen. `axe-loader.mjs` und `playground.mjs` laden axe über `createRequire(import.meta.url).resolve('axe-core/axe.min.js')`.
- [ ] **Schritt 4:** Die 3 Review-JSON-Importe ersetzen. Benutzte Werte inline übernehmen, wenn es höchstens etwa 20 sind. Hängen Prüfungen an Nachweisfeldern, kommt der Test ins Archiv und in die STATUS-Liste.
- [ ] **Schritt 5: Wächtertest `tests/browser-suites.test.mjs` schreiben.** Er importiert `suites.mjs` und prüft:
  - Namen sind eindeutig, jedes `run` ist eine Funktion, `set` ist gültig.
  - `smoke` und alle Namen aus Anhang B (CI) sind vorhanden.
  - Damit fällt jeder kaputte Import eines Browser-Moduls schon in `pnpm test` auf.
  - Erst ausführen, bevor alle Einträge da sind: rot. Danach grün.
- [ ] **Schritt 6:** `pnpm run build && pnpm run test:browser`. Erwartung: alle PASS. Laufzeit notieren. Danach einmal mit `--jobs 1` vergleichen.
  - Zeitgrenze aus Entwurf 0.3: Braucht `test:browser` lokal mehr als etwa 7 Minuten, wandern die langsamsten Suiten nach `full`, aber nur solche, die nicht unter Regel a fallen. Pass-Suiten bleiben immer in `ci`.
- [ ] **Schritt 7:** `pnpm run test:full` im Hintergrund laufen lassen und natürlich beenden lassen (Chromium, etwa 30 Minuten).
  - Jede rote Suite ursächlich einordnen: als Port-Fehler (beheben), als vorhandener Produktfehler (BACKLOG) oder als nur mit großem Aufwand lösbar (Archiv plus STATUS-Liste).
  - Kein Wiederholen ohne Ursache.
- [ ] **Schritt 8:** `pnpm test`, `typecheck` und `lint` grün. Committen: „Browser-Tests auf den neuen Runner umgezogen“.

### Aufgabe 8: CI neu (`quality.yml`)

**Dateien:**
- Ändern: `.github/workflows/quality.yml`

**Schnittstellen:**
- Job `checks`, `name: Required quality checks`, `ubuntu-24.04`, `timeout-minutes: 20`, `permissions: contents: read`.
- Job `full`, `name: Vollprüfung (${{ matrix.browser }})`:
  - Matrix `chromium`, `firefox`, `webkit`
  - läuft nur bei `github.base_ref == 'main'` (Veröffentlichungs-PR) oder `workflow_dispatch`
  - `timeout-minutes: 60`, `--browser ${{ matrix.browser }}`

- [ ] **Schritt 1:** `checks` neu schreiben. Die Schritte checkout, pnpm/action-setup und setup-node bleiben auf ihren SHA-Pins. Als `cache-dependency-path` bleibt nur `pnpm-lock.yaml`. Danach in dieser Reihenfolge:
  1. `pnpm install --frozen-lockfile`
  2. `pnpm run typecheck`
  3. `pnpm run lint`
  4. `pnpm test`
  5. `pnpm run build`
  6. `pnpm exec playwright install --with-deps chromium` (den bisherigen apt-Spiegel-Schritt behalten, falls er nichts Entferntes nutzt)
  7. `pnpm run test:browser`
  8. bei Fehlschlag `.qa-output/browser` als Artefakt hochladen (`actions/upload-artifact`, SHA-gepinnt, 7 Tage)
- [ ] **Schritt 2:** Job `full` ergänzen (gleiche Einrichtung, dann `pnpm run test:full -- --browser ${{ matrix.browser }}`). Concurrency-Gruppe beibehalten.
- [ ] **Schritt 3:** Lokal die YAML-Syntax prüfen, zum Beispiel mit `node -e` und dem `yaml`-Paket, falls im Lockfile vorhanden. Sonst mit `python3 -c 'import yaml…'`. Prüfen, dass keine Zeile mehr `qa/`, `scripts/release`, `handoff`, `review-evidence`, `journey-engines` oder `upload-review-parts` enthält.
- [ ] **Schritt 4:** Committen: „CI auf schlanke Prüfkette umgestellt (Jobname unverändert)“.

### Aufgabe 9: Alte Prüf- und Release-Maschinerie entfernen

**Dateien (alle nach Löschregel):**
- Alte Runner und Helfer:
  - `tests/browser/quality-runner.mjs`, `portable-smoke.mjs`, `journey-engines.mjs`, `runtime.mjs`, `worker-evidence-copy.mjs`, `activated-pdf-source-evidence.mjs`, `people-source-activation.mjs`
  - die 7 DELETE-Waisen und 7 ARCHIV-Waisen aus Anhang B
  - `cold-offline-reuse`, `native-navigation-reuse` (falls ohne Leser)
- Release und Nachweise:
  - `scripts/release/`, `scripts/handoff.mjs`, `review-evidence.mjs`, `quality-evidence.mjs`, `test-selection.mjs`, `measure-build.mjs`
  - `inventory-provenance.mjs`, `content-inventory.mjs`, `editorial-contract.mjs`, `export-integrity.mjs`, `verify-content.mjs`, `news-removal-evidence.mjs`
  - `review-parts.mjs`, `verify-review-parts.py`
  - `tests/release/`, `.github/actions/upload-review-parts/`, `.github/workflows/test-release.yml`
- Daten:
  - `content/editorial-reviews.json`, `content/excellence-baseline.json`, `content/excellence-history-evidence.json`
  - alle `content/*-review.json` und `content/*-review.md`
  - `exports/content` (aus Git entfernen, `/exports/` in `.gitignore`)
- Sonstiges:
  - `qa/` (Ordner)
  - `tsconfig.tsbuildinfo` (`git rm --cached`; `*.tsbuildinfo` steht schon in `.gitignore`)
  - `.gitattributes`, Zeilen 2–3
- Neu: `tests/content-integrity.test.mjs`
- Ändern: `package.json` (Skripte und Lint-Listen)

**Schnittstellen:**
- `package.json`-Skripte danach:
  - unverändert: `dev`, `build`, `start`, `preview`, `typecheck`, `typecheck:fast`, `export:data`
  - wie oben: `test`, `test:smoke`, `test:browser`, `test:full`
  - neu: `check` = `pnpm run typecheck && pnpm run lint && pnpm test && pnpm run build && pnpm run test:browser`
  - entfallen: `verify`, `verify:export`, `test:affected`, `build:profile`
- Lint-Liste (gleich für `lint` und `lint:fast`): `app scripts/export-content.mjs scripts/source-constant.mjs scripts/test-runtime.mjs tests/progress.test.mjs tests/browser-suites.test.mjs tests/content-integrity.test.mjs tests/browser/harness.mjs tests/browser/run.mjs tests/browser/suites.mjs tests/browser/smoke.mjs tests/browser/core.mjs tests/browser/offline-cold.mjs`.
- `tests/content-integrity.test.mjs` ersetzt `verify`:
  1. `node scripts/export-content.mjs --check` beendet sich mit Exit 0. Das prüft, dass abgeleitete Dateien in `app/` aktuell sind und die Inhalts-Validatoren grün sind.
  2. Themen-IDs in `app/world-catalog.json` sind eindeutig.
  3. Jeder Bildpfad eines Themas existiert unter `public/`.
  4. Jedes Foto hat einen Bildnachweis (Urheber und Lizenz).
  5. Stabile IDs (Regel b): Jede ID aus `tests/fixtures/stable-ids.json` existiert noch in den App-Daten.
     - Die Datei entsteht einmalig vor dem Löschen aus `content/excellence-baseline.json`. Sie hat die Form `{familie: [legacyId, …]}`.
     - Aufgenommen werden nur Familien, deren IDs im Pass oder in Links vorkommen: `topics-*`, `journeys`, `chapters`, `games`, `labs`, `lab-tasks`, `experiments`, `missions`, `quiz`, `nature-topics`.
     - `journey-tasks` sind schon über `journey-task-identities.json` geschützt.
     - Die App-Quelle jeder Familie steht in den `sourceFiles` der Baseline-Einträge.
  - Schritte 2–4 nur, soweit `content.test.mjs` und `world-photo-demand.test.mjs` sie nach Aufgabe 4 noch nicht abdecken.
  - Verletzt der heutige Stand eine Regel, kommt eine ausdrückliche `KNOWN_GAPS`-Liste mit BACKLOG-Verweis dazu. Sie darf nur kürzer werden.

- [ ] **Schritt 1:** `tests/fixtures/stable-ids.json` aus `content/excellence-baseline.json` erzeugen. `tests/content-integrity.test.mjs` schreiben und laufen lassen, solange die alten Daten noch da sind. Grün (mit eventuellen `KNOWN_GAPS`).
- [ ] **Schritt 2:** Mutationsprobe: Ein Bildpfad in einer Kopie des Katalogs (Testdaten im Test, nicht in `app/`) zeigt ins Leere. Der Test muss das erkennen.
- [ ] **Schritt 3:** Alles aus der Dateiliste löschen. Für jede Datei vorher die Löschregel anwenden.
- [ ] **Schritt 4:** `package.json`-Skripte und Lint-Listen anpassen. `.github/pull_request_template.md`, Zeile 13 vorläufig neutral fassen; Aufgabe 11 schreibt die Vorlage neu.
- [ ] **Schritt 5:** `node $S/import-check.mjs` meldet keine neuen fehlenden Ziele. `grep -rn "qa/node_modules\|scripts/release\|handoff\|exports/content" scripts tests build package.json .github` findet nur noch `export-content.mjs`, das `exports/content` schreibt.
- [ ] **Schritt 6:** Die volle lokale Kette: `pnpm install --frozen-lockfile && pnpm run check`. Grün. Committen: „Alte Nachweis- und Release-Maschinerie entfernt (bleibt im Archiv-Tag)“.

### Aufgabe 10: Altlasten entfernen

**Dateien (nach Löschregel):**
- `db/`, `drizzle/`, `drizzle.config.ts`, `next.config.ts`, `cloudflare-env.d.ts`, `examples/`, `migration-changes.json`, `dependencies.json`
- `build/sites-vite-plugin.ts`, `build/sites-worker.ts`, `build/connector-preview-*.mjs`, `scripts/connector-preview/`
- `scripts/sites-env.*`, `build-verified.sh`, `install-ci.*`, `install-pnpm.sh`, `npm-install*`, `pnpm-install*`, `run-framework.mjs`, `execution-profile*`
- devDependencies `@cloudflare/vite-plugin`, `@cloudflare/workers-types`, `@vitejs/plugin-rsc`, `drizzle-kit`, `json-rpc-2.0`, `raw-body`, `react-server-dom-webpack`, `vinext`, `wrangler`, außerdem die dependency `drizzle-orm`
- `pnpm-workspace.yaml`: Freigabe für `workerd` entfernen
- **Bleiben:** `next` und `eslint-config-next` (Typen für `next/link`), `components.json` (shadcn), `lib/connector*` und `app/*` (geschützt)

- [ ] **Schritt 1:** Für jedes Paket mit `grep` prüfen, dass `app components lib build scripts tests migration hooks vite.config.ts` es nicht importieren. Dann `pnpm remove <pakete>`.
- [ ] **Schritt 2:** Dateien löschen. `node $S/import-check.mjs` meldet keine neuen Ziele.
- [ ] **Schritt 3:** `pnpm install --frozen-lockfile && pnpm run check`. Grün.
- [ ] **Schritt 4:** `node $S/compare-dist.mjs $S/baseline/dist dist`. Erwartung: 0 Unterschiede. Sonst die Ursache klären, bevor es weitergeht. Committen: „Ungenutzte Altlasten (Cloudflare, Drizzle, vinext …) entfernt“.

### Aufgabe 11: Neue Unterlagen

**Dateien:**
- Neu: `CLAUDE.md` (etwa 150 Zeilen), `STATUS.md` (unter 60), `docs/archiv/AGENTS-alt-2026-11-21.md` (alte AGENTS.md, wörtlich)
- Neu geschrieben: `AGENTS.md` (unter 40), `README.md`, `VISION.md` (etwa 60), `BACKLOG.md`, `CHANGELOG.md`, `.github/pull_request_template.md`
- Verschieben: `content/auftrag-2026-10-13/` → `docs/archiv/auftrag-2026-10-13/` (`git mv`, Dateien selbst unverändert)
- Löschen: `MASTER-AUDIT.md`, `WORLD-AUDIT.md`, `QA.md`, `PRUEFBERICHT.md`, `INVENTAR.md`, `TEST-LIVE.md`, `PROJECT_STATE.md`, `QUALITY.md`, `MIGRATION.md`, `DEPENDENCIES.md`
- Ändern: Entwurf, Zeile 99 (neuer Archivpfad)

**Pflichtinhalte:**
- **CLAUDE.md:**
  - Projekt in 5 Sätzen und Zielgruppe
  - feste Regeln (aus dem Entwurf) und Pass-Kennungen, dazu die Bildregel: zuerst freie Originale, KI-Bild nur als gekennzeichneter, kostenloser Ersatz
  - Befehle (Prüfkette, `check`, `test:smoke`, `test:full`; Node 24 im Container)
  - Arbeitsablauf 0.5 und Berichtsform
  - Helfer-Tabelle 0.6 und Modell-Stand „21.11.2026: Fable 5.2, Opus 5.5, Sonnet 5.5, Haiku 5.5“
  - wo was liegt
  - Vercel-IDs (Team, Projekt) und Hinweis auf die Startnachricht in STATUS
- **STATUS.md:**
  - wo wir stehen, nächster Schritt, offene Fragen an den Nutzer
  - Liste archivierter Browser-Tests mit Grund (ARCHIV aus Anhang B und Fälle aus Aufgabe 7, Schritt 7)
  - Abschnitt **„Neuer Chat: Startnachricht“** mit Text zum Kopieren: zuerst `git fetch origin test-live && git checkout test-live` (der Standardbranch `main` ist veraltet), dann `CLAUDE.md` und `STATUS.md` lesen und `/weiter` ausführen
- **BACKLOG.md:**
  - Phase 1 ausführlich, Phasen 2–4 grob
  - Eintrag zu PR #95: acht Themen und acht Vertiefungen, Übernahme in Phase 3 nach `kinder-redaktion` und `fakten-pruefer`, Tag `archiv/pr95-geschichte-2026-11-21`
  - übernommene produktrelevante offene Punkte aus dem alten BACKLOG und aus PROJECT_STATE (das Lesen darf ein Explore-Helfer übernehmen)
  - Befunde aus Schritt 0: Wortlaut-Sperre `retainedChallengeChoices` in `app/retained-answer-wording.mjs`, verwaiste `evidence.file`-Texte in `app/update-history.ts`, Fall „beschädigter Speicherstand“ neu als Browser-Test (Vorlage `critical.mjs` im Archiv-Tag), `KNOWN_GAPS`, Firefox/WebKit für `test:full` beim ersten Veröffentlichungs-PR
  - Ideen-Sammlung, darin die Themenideen des Nutzers (Entwurf, Abschnitt „Wünsche des Nutzers nach der Freigabe“)
- **VISION.md:** Zielgruppe, Ton, Gestaltungslinie, Gestaltungswunsch „modern, mit Spaß, Glossy Look“ und Bildregel (beides aus dem Abschnitt „Wünsche des Nutzers nach der Freigabe“), die sechs Hauptbereiche, Ziel 6 „Alles hängt zusammen“. Stil-Referenzen aus der alten VISION kompakt übernehmen oder auf `docs/archiv/` verweisen.
- **README.md:** Was ist WunderKompass, lokal starten, Prüfkette, wo was liegt.
- **CHANGELOG.md:** neu ab „21.11.2026 Neuausrichtung“, in einfachen Worten. Der alte Verlauf liegt im Archiv-Tag.
- Aus `MIGRATION.md`, `QUALITY.md`, `DEPENDENCIES.md` und `TEST-LIVE.md` kommt nur noch Gültiges knapp in `CLAUDE.md` oder `README.md`, zum Beispiel Werkzeuge mit Lizenz.

- [ ] **Schritt 1:** Alte AGENTS.md wörtlich archivieren und das Auftragsverzeichnis mit `git mv` verschieben.
- [ ] **Schritt 2:** Die Unterlagen schreiben. Die Ziel-Längen mit `wc -l` prüfen.
- [ ] **Schritt 3:** Linkprüfung: Alle relativen Markdown-Links in den neuen Unterlagen und in `docs/entwurf/` lösen sich auf (kleines `grep`- und `test -e`-Skript). Ausgenommen sind die Originaldateien in `docs/archiv/`; sie bleiben unverändert.
- [ ] **Schritt 4:** Alte Prozessunterlagen löschen. `pnpm run check` grün. Committen: „Neue kurze Unterlagen; alte Aufträge in docs/archiv“.

### Aufgabe 12: Helfer und Kurzbefehle

**Dateien:**
- Neu: `.claude/agents/kinder-redaktion.md`, `fakten-pruefer.md`, `design-pruefer.md`, `code-pruefer.md`, `bild-recherche.md`, `ideen-scout.md`
- Neu: `.claude/skills/weiter/SKILL.md`, `.claude/skills/pruefen/SKILL.md`

**Schnittstellen:**
- Frontmatter der Helfer: `name`, `description`, `tools`, `model`, `effort`. Modelle und Stufen wie in Entwurf 0.6.
- Werkzeuge nur lesend, kein `Edit` und kein `Write`:
  - kinder-redaktion: Read, Grep, Glob
  - fakten-pruefer: Read, Grep, Glob, WebFetch, WebSearch, Bash (für `curl` auf Wikipedia)
  - design-pruefer: Read, Glob, Bash (Screenshots über den Runner)
  - code-pruefer: Read, Grep, Glob, Bash (`git diff`)
  - bild-recherche: Read, WebFetch, WebSearch, Bash
  - ideen-scout: Read, WebFetch, WebSearch
- Inhalt jeder Datei: Aufgabe, Prüfliste, Antwortformat.
- `bild-recherche` folgt der Bildregel: zuerst ein freies Original (Foto oder historische Abbildung) mit Lizenz und Namensnennung. Nur wenn es keines gibt, schlägt der Helfer eine gekennzeichnete Illustration oder ein kostenloses KI-Bild vor. Echte Menschen nie als foto-ähnliches KI-Bild.
- `ideen-scout` liefert Vorschläge. Ins BACKLOG schreibt Claude sie selbst.
- Skills: `weiter` und `pruefen` wie in Entwurf 0.7. `/weiter` prüft zusätzlich, ob der Branch `main` ist, und wechselt dann auf `test-live`.

- [ ] **Schritt 1:** Die acht Dateien schreiben.
- [ ] **Schritt 2:** Jeden Helfer einmal testweise aufrufen, mit kleinem Auftrag:
  - kinder-redaktion: Text von `animal-polar-bear`
  - fakten-pruefer: 2 Aussagen derselben Karte
  - design-pruefer: Rauchtest-Screenshots
  - code-pruefer: Diff von Schritt 0, als Gesamtprüfung
  - bild-recherche: Bildnachweis des Eisbär-Fotos
  - ideen-scout: eine kleine Runde
  - Ist ein Helfer in dieser Sitzung noch nicht aufrufbar (Dateien werden eventuell erst beim nächsten Start geladen), dann seinen Text an einen allgemeinen Helfer mit gleichem Modell geben und im STATUS vermerken, dass die echte Anbindung beim nächsten `/weiter` geprüft wird.
- [ ] **Schritt 3:** Befunde ins BACKLOG eintragen, als Arbeit für Phase 1 und 2. In Schritt 0 ändert sich an der Seite nichts. Befunde des code-pruefers zu Schritt 0 selbst sofort beheben.
- [ ] **Schritt 4:** `/weiter` und `/pruefen` einmal aufrufen, sonst wie in Schritt 2 vermerken. Committen: „Helfer und Kurzbefehle eingerichtet“.

### Aufgabe 13: Gesamtprüfung und Vergleich

**Dateien:** keine Änderungen, außer Befunde erzwingen eine Korrektur.

- [ ] **Schritt 1:** Frisch: `rm -rf node_modules dist && pnpm install --frozen-lockfile && pnpm run check`. Alles grün. Ausgabe und Laufzeiten notieren.
- [ ] **Schritt 2:** `node $S/compare-dist.mjs $S/baseline/dist dist`. Erwartung: 0 Unterschiede. Dazu beide Build-Kennungen notieren.
- [ ] **Schritt 3:** Screenshots vorher und nachher:
  - `QA_DIST=$S/baseline/dist node tests/browser/run.mjs --suite smoke` und `node tests/browser/run.mjs --suite smoke`
  - Die 6 Paare nebeneinander ansehen (selbst, nicht nur pixelweise)
  - pixelweiser Vergleich mit Playwright oder `compare` (falls vorhanden); erlaubt sind nur Kantenglättung und Uhrzeit-Unterschiede
- [ ] **Schritt 4:** `pnpm run test:full` (Chromium) ein letztes Mal am endgültigen Stand, natürlich zu Ende laufen lassen. Ergebnis ehrlich notieren.
- [ ] **Schritt 5: Offline-Update-Test** (Prüf-Schwerpunkt 1), als Skript im Scratchpad mit `harness.mjs`:
  1. Baseline-`dist` auf festem Port starten.
  2. Persistenten Kontext öffnen und „Für offline vorbereiten“ klicken, bis „Deine Lernwelt ist offline vorbereitet.“ erscheint.
  3. Favorit `animal-polar-bear` setzen, dann Kontext und Server schließen.
  4. Neuen `dist` auf demselben Port starten und den Kontext mit demselben Profil öffnen.
  5. Den Update-Hinweis abwarten (Text in `app/` mit `grep` suchen) und bestätigen.
  6. Erwartung: Der Favorit ist noch da, und `learning-build` ist die neue Kennung. Genau berichten, was die App zeigt.
- [ ] **Schritt 6:** Größe messen, getrackte Bytes und Dateizahl von `b53f75f` gegen `HEAD`: `git ls-tree -r -l <rev> | awk '{s+=$4} END {print s}'` und `git ls-tree -r <rev> | wc -l`.
- [ ] **Schritt 7:** STATUS und CHANGELOG mit den echten Ergebnissen nachführen. `pnpm run check` grün. Committen: „Schritt 0: Ergebnisse eingetragen“.

### Aufgabe 14: Vorschau, PR und Bericht

- [ ] **Schritt 1:** `git diff --check` ist sauber, Autor und Committer sind `noreply@anthropic.com`. Dann `git push -u origin claude/fervent-meitner-asxhow`, bei Netzfehlern bis zu 4 Wiederholungen mit Pause.
- [ ] **Schritt 2:** Vercel-MCP `list_deployments` (Team `team_ZoDaUGD4xeLiekVnSQ4oD2aE`, Projekt `prj_ZY036iUMf0CKLgb4h9ywyGBTUHRI`, Branch filtern). Erwartung: Der Stand ist `READY`.
  - Mit `curl` prüfen: `index.html` hat dieselbe `learning-build`-Kennung wie lokal, `/world.json` antwortet mit 200, `/learning-worker.js` hat `cache-control: no-cache, no-store, must-revalidate` (Prüf-Schwerpunkt 2).
- [ ] **Schritt 3:** `node tests/browser/run.mjs --suite smoke --base <Vorschau-URL>` (Prüf-Schwerpunkt 3). Scheitert es nur an Anfragen, die Vercel selbst einbaut (zum Beispiel `vercel.live`), dann das genau so berichten. Die Prüfung aus Schritt 2 trägt dann die Aussage.
- [ ] **Schritt 4:** PR `claude/fervent-meitner-asxhow` → `test-live` öffnen.
  - Titel: „Schritt 0: Großputz und neue Arbeitsweise“
  - Text nach der neuen `pull_request_template.md`: was entfernt wurde, Größe vorher und nachher, Prüfkette, `dist/`-Vergleich, Offline-Update-Test, archivierte Tests, Hinweis auf das einmalige „Neue Version laden“
- [ ] **Schritt 5:** Den CI-Lauf „Required quality checks“ abwarten (Prüf-Schwerpunkt 4). Den Nutzer fragen, ob ich den PR beobachten soll. Ist der Lauf rot: Ursache klären, beheben, neu pushen. Kein bloßes Wiederholen. Dauert der Job länger als 10 Minuten, gilt die Zeitgrenze aus Aufgabe 7, Schritt 6.
- [ ] **Schritt 6:** Bericht an den Nutzer in der festen Form: Was ist fertig? Was kannst du dir ansehen (Vorschau-Link, Screenshots vorher und nachher)? Was musst du entscheiden (Merge-„ok“; Vorschlag, den Standardbranch auf `test-live` umzustellen)? Was kommt als Nächstes?
- [ ] **Schritt 7:** Erst nach „ok“: regulärer Merge über GitHub mit erwarteter Head-SHA.
- [ ] **Schritt 8:** Nach dem Merge:
  - Die `test-live`-Vorschau liefert die neue Kennung.
  - In einem frischen Klon im Scratchpad (`git clone`, Standardbranch `main`) die Befehle der Startnachricht ausführen. Danach existieren `CLAUDE.md` und `.claude/skills/weiter/SKILL.md` (Prüf-Schwerpunkt 5).
  - Dem Nutzer sagen, ob ein neuer Chat sinnvoll ist, und die Startnachricht mitschicken.

---

## Anhang A – Unit-Tests (99 Dateien)

Kürzel:
- **REF** = `tests/*-reference.mjs`
- **PFX** = `tests/fixtures/*-predecessor*`
- **ER** = `content/editorial-reviews.json`
- **EB** = `content/excellence-baseline.json`
- **EXP** = `exports/content`
- **CI-Inv.** = `scripts/content-inventory.mjs`
- **EC** = `scripts/editorial-contract.mjs`

**KEEP (29, unverändert):** activity-view, animal-game-save-compatibility, book-answer-feedback, book-gene-models, book-nature-coast-models, book-nature-final-six-models, book-nature-geology-models, book-nature-geoscience-models, book-nature-habitats-models, book-nature-landforms-models, book-nature-process-models, book-nature-water-models, book-retained-models, concept-math, import-structure, journey-content, journey-transfer-compatibility, model-restoration, offline-assets, offline-worker, planet-distances, playground, progress, research-destinations, research-transfer-compatibility, route-view-restore, topic-map, world-game-habitat-semantics, world-selection-state.

**FIX (31):**

| Datei | Änderung |
|---|---|
| animal-expansion | Test 1 (über `inquiries.entries`) und Test 4 behalten, Rest und Importe weg |
| animal-learning | nur Test 2 behalten |
| book-astronomy, book-digital, book-ecology, book-statistics | Modell- und Validierungstests behalten. „preserve N whole words“, Dossier-, UI- und Runtime-Tests weg. REF-, CI-Inv.-, EC- und EXP-Importe weg |
| book-cell, book-gene, book-measurement, book-mechanics, book-heat, book-light, book-particle, book-water | „all N prior payloads unchanged“ weg. Canonical-Export-Test gegen `scripts/book-*-index.mjs` und `GLOSSARY`/`WHY_QUESTIONS` umstellen, sonst weg. Zusätzlich weg: heat Test 4, light Test 5, particle und water Test 3 |
| challenge | `beforeRetainedPeopleGraph` (Hash-Pin) und die Aufteilung 181/196 weg. Neu: eindeutige Verbindungs-IDs, `from`/`to` existieren, `connectionsFor` funktioniert in beide Richtungen |
| content | EXP-Lesen von `nature-locations` durch `NATURE` oder `app/nature-new-places.json` ersetzen. Prüfung, dass die Bilder von `device-illustrations` existieren, hier ergänzen |
| discovery | `WORLD_ROUTES` aus `app/world-index.ts` (JSON-Hook) |
| foundation | die 3 Auswahl-Tests und die Importe von test-selection und quality-evidence weg |
| geography-fact-corrections | Test 2: `sha()`-Pins durch Prüfung der Hauptstadt-IDs ersetzen |
| invention-optics-game-bank | Tests 3–4 behalten (Fixture `retained-optical-game-banks.json`) |
| journeys | Test 6: nur Correct-Index gegen `journey-task-identities.json`. Test 7 weg. EXP `laboratories` ersetzen |
| nature-learning | Vergleich mit der Before-Fixture weg. EXP durch `GLOSSARY` und `NATURE` ersetzen |
| people-two-continuation | Tests 2–3 behalten, Test 1 weg |
| research | Review-Vergleich weg. EXP durch `JOURNEYS`, `WORLD_ROUTES` und Labor-Export ersetzen |
| retained-answer-wording | `questionCorrections` aus ER inline übernehmen |
| science-originals | Tests 1 und 3 behalten, Test 4 neu schreiben oder weg |
| search | Test 7 (altes Scoring-Orakel) weg |
| update-history | alle Tests mit `chronicle-before-*` weg (etwa 24), die etwa 11 Logiktests behalten |
| water-photosynthesis | Tests 5–6 behalten. Die 9 Legacy-Antwortsätze vorher in die neue Fixture (Aufgabe 4, Schritt 1). Die anderen 7 Tests weg |
| world-game-learning-copy | `beforeRetainedPeople` und feste Prompt-Strings weg. Test 1 nutzt die Browser-Helfer `habitat-answer-semantics`, `world-game-learning-copy` und `world-game-offline-semantics` |
| world-photo-demand | Zeilen 9–10 und den CI-Inv.-Import weg. Prüfung von WebP-RIFF und 3 Varianten auf alle Fotos ausweiten |

**DELETE (39):** activated-pdf-source, animal-section-isolation, audit-ui-editorial, book-cell-editorial, book-gene-editorial, book-mechanics-editorial, book-retained-editorial, bronze-history, browser-errors, building-originals, cai-source-correction, darwin-source-correction, paper-source-correction, cold-offline-reuse, engine-diagnostics, excellence, export-integrity, fallback-predecessor, handoff-requirements, history-learning, invention-electrical, invention-mechanics, invention-optics, learning-audit-reference, native-navigation-reuse, nature-editorial, nature-evidence, news-removal, people-accessible-sources, people-fourteen-current-data, people-fourteen-predecessor, people-methods, quality-evidence, quality-once-reserve, retained-people, review-evidence, review-parts, source-endpoint-UI-inverse, worker-evidence-copy.

**Fixtures, die bleiben:** `retained-animal-game-before-expansion.json`, `legacy-habitat-three-actual-questions.json`, `retained-optical-game-banks.json`, `legacy-people18-before-two-biographies.json`, `legacy-people20-before-merian-lehmann.json`, `journey-task-identities.json`, `baseline-topics.json`, `retained-people-reciprocal-additions.json`, `learning.json` (bis Aufgabe 9 prüft, ob noch Leser bleiben), `retained-challenge-bank.json` (falls noch gelesen), neu `water-photosynthesis-legacy-answers.json` und `stable-ids.json`.

## Anhang B – Browser-Tests (130 Dateien)

**CI** (laufen bei jedem PR, Regeln a und b):
- smoke (neu), offline-cold (neu, `solo`)
- no-news, backup (darin storage-feedback, book-notes, model-import-integrity), animal-game-saves, habitat-answer-semantics, retained-answer-wording, journey-transfer, research-transfer, offline-retention, world-game-offline-semantics, learning-task-offline (`chromiumOnly`)
- pass-atlas (320 und 1440 px über `withPage`), portable-flows (`searchAndHistory`, `memoryRound`), people-learning (`peopleLegacyRound`)

**FULL:** Was `portable-smoke.mjs` bisher aufrief, über `test:full`:
- performance, components, offline-resilience (`solo`), research, journeys, home, home-visits, core, solar-labels, animals (+ `animalNativeZoom`, `chromiumOnly`), playground, challenge, offline-cold `{full: true}`
- dazu, was nur `journey-engines.mjs` erreichte
- Alle übrigen Testmodule (book-*, article-*, nature-* …) laufen darüber mit.

**HELFER** (bleiben, solange eine verbleibende Datei sie importiert): preview-server, stop-test-server, challenge-hints, retained-people-learning, storage-feedback, book-notes, model-import-integrity, axe-loader, native-screenshot, text-geometry, preserve-original-dom, book-pagination, book-*-diagrams, book-cell-geometry, book-retained-investigations, nature-legend, nature-model-geometry, fourteen-actual-dom-semantic-laws, retained-people-dom-laws, retained-people-miniquestions, model-labels, article-workshops, practical-guides, engine-diagnostics. Dazu aus `scripts/`: browser-errors, test-runtime, nature-learning-evidence.

**DELETE:** quality-runner, portable-smoke, journey-engines, runtime, worker-evidence-copy, activated-pdf-source-evidence, people-source-activation sowie die toten Waisen content, journeys-labs, models-existing, new-models, offline, routes, search-links.

**ARCHIV** (tote Waisen, bleiben im Tag, Liste in STATUS): audio, critical (einziger Fall „beschädigter Speicherstand“ → BACKLOG), globe, legacy-games, responsive, usability, world-games.

## Ausführung

Empfehlung: **Native**, also selbst bauen mit superpowers:executing-plans. Danach prüft der neue `code-pruefer` auf Opus den ganzen Branch (Aufgabe 12, Schritt 2).

Gründe:
- Die Aufgaben hängen eng an der Lösch-Reihenfolge.
- Fehler fallen sofort in mechanischen Prüfungen auf (`import-check`, Prüfkette, `dist/`-Vergleich).
- Vor dem „ok“ erreicht nichts die Kinder.

Für reine Fleißarbeit, etwa die 31 FIX-Dateien, darf ich Helfer parallel auf getrennte Dateien ansetzen.
