# Technik-Prüfung nach den späten Funden in Teil A (23.11.2026)

Bericht des `technik-pruefer`, unverändert. Umsetzung: siehe Entscheidungsliste Teil A, Abschnitt „Code-Prüfung Teil A“.

**Ergebnis:** Ein Teil der Anfrage stimmt so nicht. `wissenskarte` ist schon im CI-Satz, und `pnpm run check` hätte den Fotosynthese-Fehler gefunden. Offen ist nur die `core`-Lücke (Fund 2). Die Größenmessung ist ein irreführender Hinweis, aber kein Fehler. Es gibt zwei kleine Lücken in den Unterlagen. Ich habe nichts geändert.

**Wichtig**

1. **`wissenskarte` ist im CI-Satz.**
   - Fundstelle: `tests/browser/suites.mjs:74` (`set: 'ci'`). Der Wächter `tests/browser-suites.test.mjs` führt sie in `PASS_OFFLINE`.
   - Die Fotosynthese-Prüfung steht in `tests/browser/wissenskarte.mjs:98` und `:515`. `rollen.waitFor` wartet auf Sichtbarkeit, die Legende unter dem zugeklappten „Für Große“ hätte also rot gemacht.
   - Beleg: `.qa-output/browser/zeiten-ci-chromium.json` zeigt `wissenskarte` in Stufe `ci` mit `bestanden: false` (20:06). Der CI-Satz hat den Fehler also schon gemeldet. Der Lauf `zeiten-full-chromium.json` (23:05) war dann grün.
   - Dein Satz „Unit-Tests und CI-Satz waren grün“ trifft laut diesen Dateien für den Stand von 20:06 nicht zu. Ich kann nicht sagen, ob nach der Änderung „Ganz einfach offen“ noch ein CI-Lauf mit `wissenskarte` stattfand. Falls nicht, war es kein Systemfehler, sondern ein ausgelassener Schritt: Ein Lauf von `pnpm run test:browser wissenskarte` nach dem Einbau hätte genügt.
   - Fehler, der später sichtbar wurde, ist damit nur `core`.

2. **Echte Lücke: `core` und `book-normalization` laufen nur in der Vollprüfung.**
   - `bookNormalizationView` wird nur von `connected-discoveries.mjs:152` und `offline-resilience.mjs:148` aufgerufen. Beide hängen an den Voll-Suiten `core` (718 s) und `offline-resilience` (594 s).
   - 49 Browser-Dateien in `tests/browser/` öffnen `world/topic/…` oder `.wissenskarte`. Bei jeder Änderung an Kartentexten oder -aufbau kann also eine Voll-Suite nachziehen müssen.
   - Konkreter Vorschlag, klein: In `CLAUDE.md` (Arbeitsablauf, Punkt 4) steht eine feste Zuordnung. Wer `app/kern/karte/**`, `app/world-catalog.json` oder `app/kern/kern.css` ändert, lässt vor dem Commit laufen: `node tests/browser/run.mjs --suite full core animals article-atlas`.
     - `core` allein dauert rund 12 Minuten. Es deckt die sechs Karten, den Atlas, das Wissensbuch (Gezeiten) und die verbundenen Entdeckungen ab.
     - Prüfe vorher, ob `article-atlas` als Suite-Name existiert. Es ist eine Datei, aber keine Suite in `suites.mjs`. `core` ruft sie auf (`core.mjs:11`). Die Liste also nur aus echten Suite-Namen bauen.
   - Alternative, falls das zu lang ist: einen Schnelltest `karten-sichtbar` im CI-Satz anlegen.
     - Er öffnet die Karten aus `core`s `TOPICS` bei 390 px.
     - Er klappt „Für Große“ nicht auf und prüft, dass alle Texte, die Browser-Tests mit `getByText` erwarten, sichtbar sind.
     - Das ist aber nur bei einer Handvoll Karten sinnvoll, sonst wird es ein zweites `core`.
   - Davon rate ich ab: eine Unit-Regel „was ein Browser-Test sichtbar erwartet, steht nicht unter ‚Für Große‘“. Die Erwartungen stecken als wörtliche Texte in 49 Dateien, eine Regel darüber wäre eine fragile Textsuche ohne sauberen Bezug zur Sichtbarkeit. Davon rate ich auch ab: `core` im Ganzen in den CI-Satz zu verschieben (12 Minuten mehr im Pflichtjob).

3. **Größenbericht im Build (Frage b): irreführend, kein Fehler.**
   - Die Vergleichsbasis ist `content/performance-trend-baseline.json`, eingelesen in `scripts/performance-budget.mjs:1`. Sie ist Commit `eb67783` vom 16.10.2026, 569 Commits alt.
   - Sie enthält nur `totalJsBytes`, `totalJsGzipBytes` und die Reisen-Nutzlast. Aktuell sind es 5,54 MB gegen 3,42 MB, also +2,12 MB.
   - Die Hinweiszeile „Observed growth trends (not total-size gates)“ ist nur Ausgabe. Sie führt in `scripts/performance-budget.mjs` nicht zu einem Fehler. Die echten Grenzen in `performance-budgets.json` (`build.*`) gelten weiter: Einstieg 978 KB gegen 1 MB, größte Datei 1,64 MB gegen 1,75 MB.
   - Der Befund steht schon in `BACKLOG.md:251` und in der Entscheidungsliste, Punkt 12. Er wurde nur noch nicht umgesetzt.
   - Vorschlag: `observeOnly` und die Trendzeile streichen (`performance-budget.mjs`, `performance-budgets.json`, `tests/foundation.test.mjs:38-40`) und die Datei `content/performance-trend-baseline.json` löschen. Sie liest sonst niemand, und kein Pass und keine ID hängt daran. Alternative: Den Vergleichsstand nur bei jeder Veröffentlichung nach `main` erneuern. Das ist mehr Pflegeaufwand, und der Wert ist gering, weil die festen Grenzen das Wichtige schon schützen. Ich empfehle das Streichen.
   - Hinweis zur Einordnung: Der Einstieg ist mit 978 KB gegen 1.000 KB nur 2,2 % unter der Grenze (gzip 292.076 gegen 293.000). Das ist eher ein Anlass als der Trendvergleich: Der nächste größere Zuwachs reißt die Grenze.

**Klein**

4. **CI-Dauer (Frage c):** Der Pflichtjob hat `timeout-minutes: 20` (`.github/workflows/quality.yml`, Job `checks`). Der CI-Satz in Chromium enthält jetzt `wissenskarte` (rund 58 bis 65 s) und `pass-spielstaende` mit dem neuen Teil `stufeImPass`. `karte-stufen` hängt am `wissenskarte`-Ablauf. Eine echte Dauer des Pflichtjobs steht nirgends in STATUS, BACKLOG oder den Berichten. Ich kann den Puffer also nicht belegen. Vorschlag: Beim nächsten PR die Dauer der Schritte „Browser tests“ und „WebKit-Kurzprüfung“ ablesen und in STATUS notieren. Liegt sie über 15 Minuten, ist das ein Befund. Die Engine-Schnellprüfung hat 35 Minuten Grenze, die Vollprüfung 75 (längste Gruppe `reisen` mit rund 35 Minuten laut `shards.mjs`). Das ist ausgeglichen.

5. **`core` in der CI (Frage c):** `core` und `wissenskarte` laufen bei PRs nach `test-live` nur so: `wissenskarte` im Pflichtjob und in der Engine-Schnellprüfung (Firefox, WebKit), `core` nirgends. `core` läuft nur im Job „Vollprüfung“ (nur bei PRs nach `main` oder von Hand), Chromium-Gruppe `kern` in `shards.mjs`. Die Lücke ist Fund 2; sie wird bewusst in Kauf genommen, weil `core` zu lang ist.

6. **Unterlagen (Frage d):**
   - Die Befehlstabelle in `CLAUDE.md` stimmt mit `package.json` überein: `dev`, `build`, `start`, `typecheck`, `lint`, `test`, `test:smoke`, `test:browser`, `test:browser:webkit`, `test:full`, `check`, `export:data` gibt es alle. Die Pfade aus „Wo was liegt“ (`components/`, `build/`, `content/research/`, `docs/archiv/`) gibt es.
   - Es fehlen:
     - `scripts/antworten-stand.mjs` steht nicht in der Zeile `scripts/` (`CLAUDE.md:~134`). Vorschlag: „…, Antworten-Stand (`antworten-stand.mjs`, vor jedem Merge, der neue Antworten bringt)“.
     - `tests/fixtures/gespeicherte-antworten*.json`: Die Zeile `tests/fixtures/` nennt nur `stable-ids.json`. Vorschlag: „gespeicherte-antworten*.json wachsen nur (Regel aus Teil A)“. Das ist eine Kompatibilitätsregel für gespeicherte Kinderantworten und gehört in die Feste Regel „Kompatibilität“, nicht nur in die Tabelle.
     - `app/kern/` mit `karte/`, `stufe.ts`, `wiederholung.ts`: nur als Ortsangabe in „Wo was liegt“ ergänzen, weil die Karten-Dateien dort liegen (`app/kern/karte/wissenskarte.tsx`).
   - `.claude/agents/`: alle neun Dateien haben `model:` und `effort:` wie in der Helfer-Tabelle. Keine Ausnahme mit Enddatum gefunden.

7. **Playwright (Frage e):** In Ordnung. `package.json` pinnt `1.65.1` (Freigabe 13.11.2026, also 10 Tage alt). `pnpm view playwright dist-tags` meldet `latest: 1.65.1`. Alles Neuere ist `1.66.0-alpha`. `minimumReleaseAge: 10080` steht in `pnpm-workspace.yaml`. Netz ging.

8. **Aufräumen (nur ein Vorschlag, nicht dringend):** `exports/content` hat 59 Dateien (16 MB) in Git, nur weil Browser-Tests sie lesen (`CLAUDE.md`, Zeile `export:data`). Die Ablösung steht schon im BACKLOG; ich habe nichts Neues dazu.

**Geprüft und in Ordnung:** `tests/browser/suites.mjs`, `shards.mjs`, `quality.yml` (Jobnamen, Gruppen-Liste stimmt mit `shards.mjs`, Wächtertests dafür vorhanden), die Befehlstabelle in `CLAUDE.md` gegen `package.json`, `.claude/agents/*` (Modell und Stufe), Playwright-Version, `scripts/performance-budget.mjs` samt Vergleichsdatei.

**Nicht geprüft:** `pnpm test` (nicht gestartet), `pnpm outdated` und `pnpm audit --prod` (nur Playwright abgefragt), die echte Dauer des Pflichtjobs (keine Angabe vorhanden), Vercel-Einstellungen und GitHub-Branch-Regeln (kein Zugang), die Container-Neustart-Ursache (laut dir kein Fehler der Seite).
