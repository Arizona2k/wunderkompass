# Projektstand und Übergabe

Stand: 9. Oktober 2026 (Europe/Berlin). Regeln: AGENTS.md; Ziele: VISION.md; einziger Aufgabenbestand: BACKLOG.md; Abnahme: QUALITY.md; abgeschlossene Änderungen: CHANGELOG.md.

## Belegter Iststand

- Repository: https://github.com/Arizona2k/wunderkompass, private Anwendung direkt in der Repository-Wurzel.
- Aktueller main wurde mit git fetch und Connector gelesen: `6a540d2af3c0c0bcfade1a806582ffa5afb6302c` (Merge von PR #1). Das Agentensystem aus WK-001/WK-002 ist übernommen. PR #1 ist abgeschlossen; kein anderer Entwicklungs-PR war beim Start offen, keine aktive Reservierung.
- test-live beim Start: `88f79649d588b513bdb385d3307321b21f1a5aa7`. Vercel und geschützter Testlink sind laut Nutzer bereits eingerichtet; Zugriffsschutz und Zugangseinstellungen wurden in dieser Aufgabe nicht verändert.
- Checkout /workspace/wunderkompass war zunächst ein sauberer, veralteter Exportstand auf work. Nach Abgleich neuer Branch vom aktuellen origin/main: `codex/quality-ci-2026-10-09`.
- Herkunft: Site Version 14, Originalcommit `7b93a5c53fcd42d46b310252b6a4a3cf5622fbe7`; externe Originalsicherung behalten. Historische Auditberichte sind keine neue Produktvollabnahme.
- IDs, Inhalte, Medien, Hash-Navigation, Schema-3-Pass und Anwendungscode bleiben erhalten. App-Lockfile bytegleich zur Basis. Keine Änderung an main/test-live, keine Zusammenführung oder Veröffentlichung durch diesen Auftrag.

## Durchlauf und Reservierung

| Feld | Stand |
| --- | --- |
| Durchlauf | quality-ci-2026-10-09 |
| Aufgaben | WK-012 (Actions), WK-003 (portable Browserprüfung), Such-/Spielanteil aus WK-004 |
| Status | in Arbeit – Implementierung und lokale Prüfung, Actions-Nachweis noch ausstehend |
| Bearbeiter | Codex, diese Cloud-Aufgabe |
| Basis | main `6a540d2af3c0c0bcfade1a806582ffa5afb6302c` |
| Branch | codex/quality-ci-2026-10-09 |
| Start / Lebenszeichen | 9. Oktober 2026, ca. 16:55 / 17:05 Uhr Europe/Berlin |
| PR / Synchronisierung | Wird nach lokalem Prüfstand auf GitHub erstellt; kein Merge |
| Nächster Schritt | Browser-Neustart prüfen, Workflow am tatsächlichen PR ausführen, sichere Ergebnisse hier ergänzen |

## Umsetzung

Quality-Workflow unter .github/workflows/quality.yml für PRs gegen main/test-live, nur Leserechte, feste pnpm-Version, Node 24, Frozen-Installationen, typecheck/lint/test/build/verify und Browser als Pflichtschritte. Jobname Required quality checks bleibt stabil. Artefakte enthalten ausschließlich synthetische Screenshots/JSONs, keine Browserprofile. QA-Werkzeuge separat mit eigenem Lockfile/Workspace; vorhandenes App-Lockfile unverändert. package.json ergänzt verify als Alias zur bestehenden Inhaltsprüfung und test:browser.

Portable Browserprobe ergänzt um Suche/Tippfehler/kein Ergebnis/Escape, Hashlinks und Zurück/Vor sowie echte Memory-Runde mit falschen Paaren, Fortsetzen nach Reload und Abschluss. Bereinigung/Fehlerbericht bei fehlgeschlagener Probe ergänzt. Historische Skripte weiterhin an alte Sites-/Chromium-Pfade gebunden und nicht als portabel behauptet.

Deaktivierte importierbare Ruleset-Vorlage .github/rulesets/test-live.json bereitet PR-/Review-/Pflichtcheck-Schutz bei aktueller Zielbasis ohne Bypass vor. QUALITY.md beschreibt spätere Freigabereihenfolge und Grenzen. Keine Rulesets tatsächlich aktiviert, keine Auto-Merge-/Scheduler-/Deployment-Aktion. Ohne aktive Branch-Regeln ist ungeprüftes Pushen/Mergen technisch noch nicht gesperrt.

## Tatsächliche lokale Prüfung

Prüfstand: Basiscommit oben plus Implementierungsdiff dieses Entwicklungsbranches. Node v24.19.0, pnpm 11.25.0 via COREPACK_HOME=/workspace/wunderkompass/work/corepack; Playwright 1.62.1. Netzwerkzugriff innerhalb des Shell-Sandboxes für git/Corepack/Registry/localhost erforderlich; vorhandenen Proxy erhalten.

| Prüfung | Ergebnis |
| --- | --- |
| pnpm install --frozen-lockfile | Exit 0 mit pnpm 11.25.0; App-Lockfile unverändert. |
| pnpm --dir qa install --frozen-lockfile | Exit 0; eigener QA-Workspace, Lockfile und drei Werkzeugpakete. Lokal Store/Cache explizit unter .sites-runtime, um keine Home-Schreibrechte zu benötigen. |
| pnpm run typecheck | Exit 0. |
| pnpm run lint | Exit 0. |
| pnpm test | Exit 0; drei erfolgreiche Testdateien content/progress/search, null Fehler; 20 Definitionen in den Quellen. |
| pnpm run build | Exit 0. Bekannte Warnungen: große Chunks und ineffektiver dynamischer Import von progress-storage.ts. |
| pnpm run verify | Exit 0; 32 Inhaltsdateien und Prüfsummen bestätigt. verify:export bleibt kompatibel erhalten. |
| actionlint 1.7.7 | Exit 0 für .github/workflows/quality.yml. |
| Browser | Chromium 151.0.7922.173 über QA_BROWSER_EXECUTABLE=/usr/bin/chromium. Suche, 21 Ansichten ohne Overflow, Bilder, vier Hubs, Favorit nach Reload, Memory mit falschen Paaren/Fortsetzen/Abschluss und vollständige Offline-Vorbereitung (111 Cacheeinträge) tatsächlich durchlaufen. Gesamtlauf bisher Exit 1 beim kalten Offline-Neustart; noch keine vollständige Browserfreigabe. |
| Browserdownload | Playwright-CDN durch Cloud-Netzwerkregel mit HTTP 403 Domain forbidden blockiert. Kein Bypass; lokal vorhandenes System-Chromium verwendet. GitHub muss seinen passenden Chromium-Download separat nachweisen. |
| Diff/Syntax | git diff --check und node --check der beiden portablen Testdateien Exit 0. |

Rohlogs unter work/, synthetische Browsernachweise unter .qa-output/; nicht versionieren. Ein fehlgeschlagener Browserlauf gilt als fehlgeschlagener Pflichtcheck, auch wenn vorherige Teilprüfungen bestanden.

## GitHub-Nachweis und offene Grenzen

Actions ist implementiert und statisch geprüft; ein tatsächlicher erfolgreicher GitHub-Lauf ist noch nicht belegt. Nach PR-Erstellung konkreten Lauf, Commit und Abschluss hier dokumentieren. Status der neuen Arbeit bleibt bis zur Review/Übernahme in Prüfung.

Noch offen: Branch-Regeln importieren/prüfen/aktivieren (separate spätere Freigabe), Sperrwirkung durch roten PR und regulären direkten Pushversuch belegen, vollständiger Pass-Export/Reset/Import/Tab-Browserweg (WK-004), physische Geräte, Safari/Firefox, Screenreader, gehörte deutsche Stimme, schwache Hardware und pädagogische Abnahme. Kein Scheduler oder Auto-Merge aktiviert. Nächster Schritt nach grüner QA: PR gegen main prüfen; Übernahme und spätere test-live-Bereitstellung ausdrücklich kontrollieren.
