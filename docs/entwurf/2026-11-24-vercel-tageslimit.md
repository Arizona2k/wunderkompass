# Vercel-Tageslimit (24.11.2026)

Helfer: `technik-pruefer`. Der Helfer hat nichts geändert. Er hatte keinen Zugang zu Vercel und hat darum mit den GitHub-Deployments (`vercel[bot]`, 338 Einträge), `git diff-tree` und der Vercel-Doku gearbeitet.

**Ergebnis:** Das Limit kam von zu vielen Pushes: 145 Deployments in 24 Stunden, 106 am 24.11. (UTC). Gut die Hälfte davon war reine Unterlagen-Arbeit. Ein übersprungener Build (`ignoreCommand`) zählt laut Doku trotzdem mit. Die einfachste sichere Abhilfe ist ein Branch-Filter in `vercel.json` (`git.deploymentEnabled`) mit einer festen Liste von Branches, die gebaut werden. Dafür muss „Zeigen“ auf einen eigenen Vorschau-Branch umziehen.

## 1. Wie viele Deployments gab es?

- **24.11. (UTC-Tag):** 106 Deployments, das erste um 00:33, das letzte um 19:03:55. Nach mitteleuropäischem Kalendertag sind es 126.
- **Letzte 24 Stunden vor der Sperre:** 145. Zum Vergleich: 21.11. 76, 22.11. 5, 23.11. 54.
- **Alle sind „Preview“:** Auch Merges nach `test-live` laufen als Preview. Production ist nur `main`.
- **Was die 145 waren:**
  - 63 nur `docs/` oder `*.md` im Hauptordner.
  - 17 nur `tests/`, `.claude/` oder `.superpowers/` (zusammen 80, also 55 %).
  - 48 mit Code.
  - 2 Merges.
  - 15 nicht mehr einordenbar (Commit nicht mehr im Klon).
- **Nachtlauf:** Allein `claude/trusting-galileo-ck3o23` hatte 45 Pushes zwischen 23.11. 19:10 und 24.11. 08:30 UTC.
- **Ohne die Unterlagen-Builds** wären es etwa 65 gewesen.
- **Wie Vercel zählt, ist unklar:** Ein gleitendes Fenster hätte schon um 10:37 UTC gesperrt, ein UTC-Tag gegen 17:35. Gebaut wurde aber bis 19:03. Vielleicht zählen abgebrochene Builds nicht. Die Doku (`vercel.com/docs/limits`, Stand 16.09.2026) sagt nur: 100 Deployments je 86 400 s, danach „wait another day“. **Sichere Annahme für das Ende der Sperre: 25.11.2026, 19:10 UTC**, vielleicht früher.

## 2. Kostenlose Abhilfe

Gelesen: `vercel.com/docs/project-configuration/project-settings`, `…/git-configuration`, `…/vercel-json`, `vercel.com/kb/guide/how-to-reduce-build-costs`, `…/why-aren-t-commits-triggering-deployments-on-vercel`.

- **`ignoreCommand` oder „Ignored Build Step“ hilft nicht (belegt):** „Canceled builds are counted as full deployments … will still count towards your deployment quotas“.
- **`git.deploymentEnabled` verhindert das Deployment ganz (belegt):** Wert je Branch, Muster erlaubt („Specify branches that should not trigger a deployment upon commits“). Passt ein Branch auf mehrere Regeln und eine ist `true`, wird gebaut. Dass so ein Push nicht zählt, steht nicht wörtlich in der Doku; es entsteht aber gar kein Deployment. Am Tag danach am Zähler prüfen.
- **Empfehlung:** Nur feste Branches bauen:
  ```json
  "git": { "deploymentEnabled": { "**": false, "main": true, "test-live": true, "vorschau/**": true } }
  ```
  - Die 24 einzelnen `codex/...`-Zeilen in `vercel.json` sind dann überflüssig.
  - Pushes auf `claude/...` bauen nie. „Laufend sichern“ bleibt unbegrenzt möglich.
  - **Zeigen (Schritt 5)** über einen zusätzlichen Push desselben Stands: `git push origin HEAD:refs/heads/vorschau/<thema>`. Das kostet einen Build, nur bei sichtbaren Änderungen. Die Adresse steht in `list_aliases`. Der Vercel-Kommentar im PR entfällt, der Link wird von Hand genannt.
  - **Nicht geprüft:** ob die Cloud-Umgebung Pushes außerhalb von `claude/...` zulässt. Vorher mit einem Probe-Push klären. Sonst `claude/**: false` plus `claude/vorschau-*: true` (falls der Branch-Name frei wählbar ist) oder Bündeln.
  - Die Änderung wirkt erst ab dem Commit, der `vercel.json` ändert, und nur auf Branches mit diesem Stand. Sie kommt per PR nach `test-live`.
- **Zweite Wahl ohne Umbau:** Unterlagen-Commits sammeln und erst mit dem nächsten Code-Commit pushen. Das widerspricht „Laufend sichern“ (das Nutzungslimit kann jederzeit kommen).

## 3. Folgen jetzt

- **Pflicht-Check ist nur „Required quality checks“.** Beleg: Ruleset 25304083 gilt nur für `test-live` (`required_status_checks = [{"context":"Required quality checks"}]`, `strict_required_status_checks_policy: true`). Vercel ist kein Pflicht-Check; der Merge ist also auch bei gesperrtem Vercel möglich.
- **Der Merge baut heute vermutlich keine neue Test-Adresse.** Bei einem gesperrten Push entsteht gar kein Deployment (`3a9e899` fehlt in der Liste). Die Test-Adresse bleibt auf dem Stand von PR #112 (Merge `9528037`).
- **Nach dem Ende der Sperre** gibt es nichts zum Neu-Starten. Die Test-Adresse zieht erst mit dem nächsten Commit auf `test-live` nach, also mit dem nächsten PR (z. B. der `vercel.json`-Änderung).
- **Lücke bei `main` (nicht Vercel):** Für `main` gilt weder Branch-Schutz noch ein Ruleset. „`main` nie direkt ändern“ ist nur Vereinbarung, die Vollprüfung bei PRs nach `main` kein Pflicht-Check. Vor der nächsten Veröffentlichung für Freunde ein Ruleset anlegen (Pflicht: „Required quality checks“ und die Vollprüfungen) oder bewusst darauf verzichten.

## 4. Vorschlag für `CLAUDE.md` (erst nach Entscheidung des Nutzers)

- „Laufend sichern“: „Pushes auf `claude/...` bauen keine Vercel-Vorschau (kostenloser Plan: 100 Deployments am Tag). Eine Vorschau zum Zeigen kommt nur mit Push auf `vorschau/<thema>`, höchstens ein Push je sichtbarer Änderung.“
- Schritte 5 und 6: „Link der Vorschau (Branch `vorschau/...`) und Screenshots“. Ist das Tageslimit erreicht: Screenshots aus `pnpm run test:smoke` oder `pnpm run start`.
- Abschnitt Vercel: „gebaut werden nur `main`, `test-live` und `vorschau/**` (siehe `vercel.json`)“; Tageslimit 100 Deployments, übersprungene Builds zählen mit; bei Sperre geht der Merge trotzdem, die Test-Adresse zieht erst später nach.
- Abschnitt Git: Nur `test-live` hat eine Branch-Regel, `main` ist ungeschützt.

## Nicht geprüft

Vercel-Zähler und Projekteinstellungen (kein Zugang), echter Zeitpunkt des Zurücksetzens, ob nicht gebaute Branches wirklich nicht zählen, ob Pushes auf `vorschau/...` in der Cloud-Umgebung gehen, die 15 nicht mehr auffindbaren Commits.

## Entscheidung (Claude)

Für diesen PR ändert sich nichts: Vercel ist kein Pflicht-Check, gemergt wird nach grüner CI. Der Umbau von `vercel.json` und „Zeigen“ braucht eine Entscheidung des Nutzers (Push auf einen Branch außerhalb von `claude/...`, neue Regel in `CLAUDE.md`). Er steht als erster kleiner Schritt im nächsten Chat (BACKLOG Phase 1, Punkt 28), ebenso die Frage nach einem Schutz für `main`.
