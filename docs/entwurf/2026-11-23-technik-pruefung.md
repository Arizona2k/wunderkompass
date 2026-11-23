# Technik-Prüfung nach Teilschritt 2 (23.11.2026)

Anlass: Zweimal fielen Fehler erst spät auf. In Teil A fand die CI-Vollprüfung (Lauf 249) drei Fehler in Firefox und einen in WebKit. In Teil B fand `test:full` in Chromium fünf rote Suiten. `pnpm run check` hatte jeweils nichts gefunden.
Geprüft hat der Helfer `technik-pruefer` (sonnet/high) auf dem Stand `afbc441`. Er hat nur gelesen, kein Build und kein Browser liefen. Wo eine Zahl geschätzt ist, steht das dabei.
Claude hat die Befunde eingeordnet (Abschnitt „Einordnung“). Dieser Bericht ist die Grundlage für den Anfang von Teilschritt 3. Der nächste Chat baut darauf auf und muss ihn nicht neu erarbeiten.

## Gemessene Dauern (CI-Lauf 252, Vollprüfung von Teil A)

- Gesamt je Browser: Chromium 6104 s, Firefox 2263 s, WebKit 3040 s. Die drei laufen gleichzeitig, Wartezeit also rund 102 Minuten.
- Chromium je Suite (s): journeys 2078, engine-journeys 855, core 821, offline-resilience 738, animals 484, offline-cold-full 160, home 149, playground 114, research 104, challenge 102, home-visits 71, der CI-Satz zusammen 322, der Rest klein.
- WebKit (s): engine-journeys 1167, offline-resilience 1017, animals 434, CI-Satz nacheinander 403, solar-labels 22.
- Die CI läuft etwa 20 % schneller als der Container (journeys lokal 2640 s).
- Pflichtprüfung „Required quality checks“: rund 5½ Minuten, davon Browser-Tests 3–4 Minuten (Läufe 253/254).

## Befunde

**Dringend**

1. **Die Pflichtprüfung läuft nur in Chromium** (`.github/workflows/quality.yml`, Schritt „Install Chromium“). Alle späten Fehler aus Teil A betrafen nur Firefox oder WebKit; `no-news` lief im CI-Satz grün und fiel erst in Firefox auf. WebKit war in den Vollprüfungen 246, 248 und 252 rot (die alten Fehler `backup` und `offline-cold`).
2. **Die Teil-B-Fehler waren eine Fehlerklasse:** Tests beantworteten die Hauptfrage mit eigenem Code (`question.answers[question.correct]`) und suchten „Ganz einfach“ selbst. Eine Wächter-Prüfung hätte das in unter einer Sekunde gemeldet. Vorbild ist der bestehende `innerWidth`-Wächter in `tests/browser-suites.test.mjs`.
3. **Kandidaten für den CI-Satz:** `solar-labels` (35 s Chromium), `animals` mit nur einer Breite (390 px, geschätzt 70–90 s), `core` mit nur einer Breite (geschätzt rund 200 s, zuerst messen). Zusammen geschätzt 3–5 Minuten mehr. Zu lang für den CI-Satz: `journeys`, `engine-journeys`, `offline-resilience`, `offline-cold-full`.

**Bald**

4. **Zeitgrenze:** `timeout-minutes: 180` reicht derzeit (Puffer 43 % in der CI). Der Kommentar „rund zwei Stunden“ (quality.yml) gilt nur für den Container. Nach dem Aufteilen genügen 75 Minuten je Job.
5. **Pakete mit Sicherheitslücken:** `pnpm audit --prod` meldet 14 Funde, darunter zwei kritische und eine hohe in `next` 16.3.8 und eine hohe in `zod`. Claude hat nachgeprüft: `next` steht nur noch in drei alten, unbenutzten Dateien (`app/chatgpt-auth.ts`, `app/layout.tsx`, `components/ui/sonner.tsx` über `next-themes`); im fertigen Build (`dist/assets`) ist kein Next-Code. Die Seite läuft als Vite-Seite ohne Server. Die Lücken sind deshalb für Besucher nicht erreichbar. Trotzdem aufräumen.
6. **`main` ist technisch nicht geschützt.** Es gibt keinen Branch-Schutz und kein Ruleset auf `main`; nur `test-live` verlangt „Required quality checks“. Die Regel „`main` nie direkt ändern“ gilt also nur, weil wir sie einhalten.
7. Playwright 1.65.1 ist die neueste stabile Version (13.11.2026). Das stimmt.

**Klein**

8. Der Lint prüft nur 8 Browser-Testdateien (`package.json`); `kern-huelle.mjs`, `wissenskarte.mjs`, `reise-kapitel.mjs`, `karte-hilfen.mjs` und `pass-spielstaende.mjs` fehlen.
9. `concurrency` in quality.yml: Ein neuer Push bricht eine laufende Vollprüfung desselben Branches ab (Lauf 249 verlor so 100 Minuten). Kürzere Jobs mildern das.
10. `CLAUDE.md` nannte „Stand: 21.11.2026“ trotz neuerer Regeln (behoben am 23.11.2026).

**Geprüft und in Ordnung:** alle acht Helfer-Dateien gegen die Tabelle in `CLAUDE.md` (Modell und Stufe), Modell-Stand, keine laufende Modell-Ausnahme, Befehle in `package.json`, Job-Name „Required quality checks“ (das Ruleset verlangt genau ihn), `minimumReleaseAge` 7 Tage, pnpm 11.25.0, Node 24, Standardbranch `test-live`, `vercel.json`, Markierung der reinen Chromium-Suiten.

**Nicht geprüft:** Vercel-IDs und Adressen, das Ergebnis von CI-Lauf 253, alle geschätzten Dauern.

## Vorschlag: Vollprüfung aufteilen (von rund 102 auf rund 35–38 Minuten)

- **Chromium in drei Jobs:**
  - A = `journeys` (2078 s)
  - B = `core` + `offline-resilience` + `animals` (2043 s)
  - C = `engine-journeys` + `offline-cold-full` + `home` + `research` + `playground` + `challenge` + `home-visits` + `native-zoom` + `solar` + `components` + CI-Satz (rund 1980 s)
- **Firefox:** ein Job (2263 s).
- **WebKit in zwei Jobs:**
  - `engine-journeys` + `solar-labels` + CI-Satz
  - `offline-resilience` + `animals`
- **Technik:** `tests/browser/run.mjs` nimmt Suitennamen schon als Argument an.
  - Sicherer als Listen im Workflow ist eine Datei `tests/browser/shards.json` (Browser → Gruppen) mit einem Unit-Test: Jede Suite kommt je Browser genau einmal vor, damit eine neue Suite nie still wegfällt.
  - Dazu schreibt `run.mjs` eine Zeiten-Datei als Artefakt, damit die Gruppen später neu ausgeglichen werden können.
  - Der Job-Name „Required quality checks“ bleibt unverändert.
- **journeys selbst:** Die Suite allein füllt fast einen Job (`journeySupportView` in sieben Breiten). Erst messen, welcher Teil die Zeit braucht, dann eventuell teilen. Ob sich `engine-journeys` in Chromium mit `journeys` überschneidet, ist nur eine Vermutung.

## Einordnung durch Claude und Reihenfolge

Die Befunde stimmen mit dem überein, was in Teil A und B passiert ist. Zwei Schätzungen des Helfers sind ungeprüft (die Dauer der Kurzläufe von `animals` und `core`); sie werden vor einer Entscheidung gemessen. Die Aussage des Helfers, neue Helfer erschienen erst im nächsten Chat, stimmt nicht ganz: Nach dem Nachziehen des Hauptordners erschienen sie in diesem Chat mit Verzögerung.

Empfohlene Reihenfolge am Anfang von Teilschritt 3, je als kleiner Schritt mit `pnpm run check`:

1. **Gemeinsame Test-Bausteine für die Karte** (BACKLOG) und dazu der **Wächter** aus Befund 2. Das verhindert die Fehlerklasse aus Teil B.
2. **Vollprüfung aufteilen** wie oben, mit `shards.json`, Wächter-Test und Zeiten-Datei; danach `timeout-minutes` auf 75. (Umgesetzt am 23.11.2026 als `tests/browser/shards.mjs`.)
3. **Alte WebKit-Fehler `backup` und `offline-cold` beheben.** Danach eine **Engine-Schnellprüfung** (Firefox und WebKit, CI-Satz plus `solar-labels`) bei jedem PR, zunächst nicht als Pflicht. Das verhindert die Fehlerklasse aus Teil A.
4. **CI-Satz ergänzen:** `solar-labels`, dann `animals` und `core` mit einer Breite, wenn die gemessene Dauer den Satz unter 10 Minuten lässt.
5. **Aufräumen:** `next`, `next-themes` und die drei alten Dateien entfernen, `zod` prüfen, Lint auf alle Browser-Testdateien.
6. **`main` schützen** (Ruleset wie bei `test-live`): nur nach Entscheidung des Nutzers, kostenlos.
