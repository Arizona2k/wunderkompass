# Projektstand und Übergabe

Stand: 9. Oktober 2026 (Europe/Berlin). Regeln: AGENTS.md; Ziele: VISION.md; einziger Aufgabenbestand: BACKLOG.md; Abnahme: QUALITY.md; abgeschlossene Änderungen: CHANGELOG.md.

## Aktueller Durchlauf: WK-014 / write-permission-probe-2026-10-09

Status: in Prüfung, separate Vorbereitung auf codex/write-permission-probe-2026-10-09. Keine aktive Entwicklungsarbeit nach Übergabe; echter Jobtoken-Test wartet auf reviewte Workflowübernahme und manuelle Freigabe. Die folgenden älteren Abschnitte bleiben historische Nachweise.

Aktuell per GitHub-Connector gelesen: main `43aa54aee718c14e18d1ff2c10d527c316fc9402` (Basis dieses PRs), test-live `4b73cdb4ab049bcfe227fd43f07c80e8ffe68b0f` (PR #4 übernommen). Keine offenen PRs oder aktiven Actions-Läufe beim Start; gemeinsame Entwicklungsreservierung nicht vorhanden (404). Lokaler sauberer Checkout entspricht exakt main und dessen Tree `76e9c0164c0661d8619f332b251e917e6ad27a69`. Git fetch scheiterte am Sandbox-Proxy; Aktualität über Connector belegt. main/test-live werden nicht geschrieben.

Die aktuelle Freigabekette wurde vollständig auf test-live gelesen: .github/workflows/test-release.yml, scripts/release/policy.cjs, TEST-LIVE.md und aktuelles AGENTS.md. Workflowweit permissions:{}; Gate lesend, exakte Kandidatenprüfung lesend, nur Publisher contents/write und pull-requests/read. Publisher verwendet vertrauenswürdige Basis, pinned checkout v4 mit Jobtoken-Credentials, prüft Head/Base/Policy erneut, erstellt Backup-Tag und schreibt ausschließlich die geprüfte SHA mit Git-Lease. Feste false- und zusätzliche opt-in-Sperre weiterhin vorhanden. Kein Publisherlauf in den letzten zehn Actions-Läufen; letzter Quality-Lauf für PR #4 completed/success (37955079218). Frühere lokale Policytests sind kein Beleg für einen echten Actions-Schreibzugriff.

GitHub-Standard laut Nutzer: Read repository contents and packages permissions; bleibt unverändert. Laut GitHub-Dokumentation dürfen explizite Jobrechte den lesenden Standard erweitern. Das ist eine zulässige Konfiguration, kein tatsächlicher Schreibnachweis. Actions-Einstellungen sind über den Connector nicht lesbar; keine administrativen Rechte oder Ersatz-Tokens angelegt. Beide Branches melden protected:false. Rulesets-API 403 verlangt Pro oder öffentliches Repository; keine kostenpflichtige Änderung. Die vorhandene Sperre innerhalb des Releaseworkflows bleibt vollständig erhalten; keine repositoryweite Branch Protection behauptet.

Vorbereitet: ausschließlich workflow_dispatch mit manueller Eingabe TAGS_ONLY, festem Repository und main-Ref; vorgelagerter Job ohne Schreibrecht verhindert neue Testjobs ab 2026-10-16T00:00:00Z (02:00 Europe/Berlin). Testjob höchstens fünf Minuten, nur contents/write, kein PAT/Secret und keine PR-Schreibrechte. Zwei eindeutig laufbezogene Tags unter refs/tags/wk-permission-probe/RUN-ATTEMPT/ auf neuen leeren Git-Bäumen; Anlegen, Nachlesen, Aktualisieren mit exakter Lease, Nachlesen, Löschen mit Lease und Abwesenheit prüfen. main/test-live-SHAs vor/nach vergleichen. Git-Fehlerausgaben werden unterdrückt, Quittung enthält nur sichere Resultate/Tagpfad. Keine Anwendungsskripte, Installation, Inhaltsänderung oder Hosting-API im Schreibjob. contents/write bleibt technisch repositoryweit; die Eingrenzung auf Tags ist durch Code, nicht eine GitHub-Token-Scopesicherung, gegeben.

Bei Abbruch/Runnerausfall ist finally nicht garantiert: laufbezogene Tags anhand Actions-Quittung/Run-ID prüfen, nur eigene bekannte SHAs mit genauer Lease entfernen. Unbekannte fremde SHAs bleiben erhalten und der Test meldet Fehler. Die geänderte Quality-CI führt nur lokale Probe-Integrationstests mit Read-only-Token aus. Der neue Schreibworkflow läuft weder auf PR noch Push automatisch. Er muss zuerst auf den Defaultbranch übernommen werden; hier kein Merge und kein Dispatch. Die Übernahme nach main kann einen bestehenden Vercel-Produktionsbuild auslösen und ist vorab gesondert zu klären.

Damit bereits die PR-Vorbereitung keine neue Vorschau veröffentlicht, enthält der erste Remotecommit eine Vercel-git.deploymentEnabled:false-Regel ausschließlich für codex/write-permission-probe-2026-10-09. Andere Branches bleiben gemäß Vercel-Dokumentation unverändert. Kein Branch mit ungeschütztem Basisstand wird vorab remote erstellt. Keine Änderung an Vercel-Konto, Alias, Domain oder Zugriffsschutz. Nach Erstellung GitHub-Status prüfen; fehlender Status beweist nicht unabhängig den Vercel-Dashboardzustand.

Tatsächlich lokal geprüft: Node v24.19.0; fünf Tests mit echten lokalen bare-Git-Remotes, erfolgreiche Tagtransaktion/Bereinigung, abgewiesenes Schreiben, bestehender Namespace, konkurrierende fremde Änderung und serverseitige Ablehnung einer falschen Lease. Alle bestanden, keine echten GitHub-Testrefs angelegt. Erster Aufruf scheiterte an Sandbox-EPERM bei Subprozessen; abschließender Lauf mit freigegebenem Subprozess-/Netzwerkkontext erfolgreich. node --check, YAML-/JSON-Struktur, actionlint 1.7.7 und git diff --check prüfen zusätzlich die Vorbereitung. App-/Browserprüfung nicht als neu ausgeführt behauptet; kein Anwendungscode geändert.

Vercel: aktueller test-live-Commit und PR-#4-Head haben Vercel-success-Status. Das belegt bisherigen Betrieb, nicht GITHUB_TOKEN→Vercel oder Zugangsschutz. Offen: isolierter Triggernachweis mit genau dem Publisher-Token auf einem getrennten, ausdrücklich freigegebenen Ziel; Projekt-/Git-Zuordnung und test-live-Alias, Autorberechtigung, konstante geschützte Testadresse, autorisierter/unautorisierter Zugriff, funktionierender Rückfallstand, Deploymentfehler/Smoke-Test/Recovery sowie vorhandene kostenlose Actions-/Vercel-Kontingente und Ausgabenlimits. Keine zusätzlichen Hostingprojekte, Hooks, kostenpflichtigen Dienste oder Tokens eingerichtet. Erfolgreicher Tagtest würde Branchrechte und Vercel weiterhin nicht belegen.

Nächster Schritt: separaten PR prüfen, sichere Übernahme/Registrierung des manuellen Workflows und Testlauf ausdrücklich freigeben; lesenden GitHub-Standard und feste Release-Sperre beibehalten. Vor Dispatch Restkontingent prüfen. Erst tatsächliche Quittung mit created/advanced/cleanup/protectedBranchesUnchanged:true zählt als erfolgreicher Jobtoken-Tagtest. Anschließende Vercel-Abnahme und automatische Freigabe bleiben getrennte Schritte.

Quellen (9. Oktober 2026): https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax und https://docs.github.com/en/actions/tutorials/authenticate-with-github_token ; Vercel-Branch-Ausschluss: https://vercel.com/docs/project-configuration/git-configuration .

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
| Status | in Prüfung – Umsetzung und lokale/Actions-Prüfungen vollständig bestanden; PR #2 wartet auf Review, kein aktiver Entwicklungsdurchlauf nach Abschluss |
| Bearbeiter | Codex, diese Cloud-Aufgabe |
| Basis | main `6a540d2af3c0c0bcfade1a806582ffa5afb6302c` |
| Branch | codex/quality-ci-2026-10-09 |
| Start / Lebenszeichen | 9. Oktober 2026, ca. 16:55 / 17:11 Uhr Europe/Berlin |
| PR / Synchronisierung | https://github.com/Arizona2k/wunderkompass/pull/2 – gegen main, kein Merge; Implementierungsbranch gepusht, Abschlussdokumentation im selben Branch |
| Nächster Schritt | PR #2 reviewen; keine automatische Zusammenführung. Spätere test-live-Freigabe erst mit aktiver Branch-Sperre |

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
| Browser | Chromium 151.0.7922.173 über QA_BROWSER_EXECUTABLE=/usr/bin/chromium. Suche, 21 Ansichten ohne Overflow, Bilder, vier Hubs, Favorit nach Reload, Memory mit falschen Paaren/Fortsetzen/Abschluss und vollständige Offline-Vorbereitung (111 Cacheeinträge) tatsächlich durchlaufen. Abschließender Gesamtlauf Exit 0; kalter Offline-Neustart mit beendetem Vorschau-Server, nachgewiesen fehlgeschlagenem HTTP-Zugriff und deaktiviertem Browsernetzwerk, ungeöffnetem Tierbild und bedienbarem Energiemodell erfolgreich. Keine JS-/Konsolen-/Request-/HTTP-Fehler oder externen Requests. Desktop-/Smartphone-Screenshots visuell angesehen. |
| Browserdownload | Playwright-CDN durch Cloud-Netzwerkregel mit HTTP 403 Domain forbidden blockiert. Kein Bypass; lokal vorhandenes System-Chromium verwendet. GitHub muss seinen passenden Chromium-Download separat nachweisen. |
| Diff/Syntax | git diff --check und node --check der beiden portablen Testdateien Exit 0. |

Rohlogs unter work/, synthetische Browsernachweise unter .qa-output/; nicht versionieren. Ein fehlgeschlagener Browserlauf gilt als fehlgeschlagener Pflichtcheck, auch wenn vorherige Teilprüfungen bestanden.

## GitHub-Nachweis und offene Grenzen

PR #2 wurde als Draft gegen main erstellt, Branchcommit `52d60f7812e95c33d50d79b7944e9b8e68426839` per git push gesichert. Erster tatsächlicher Actions-Lauf: https://github.com/Arizona2k/wunderkompass/actions/runs/37948939464 – **failure**, Pflichtjob Required quality checks rot aufgrund der Browserprobe. Installation, Node 24.21.0/pnpm 11.25.0, typecheck/lint/test/build/verify, QA-Frozen-Installation und Chromium-Download/Systembibliotheken waren bereits erfolgreich. Damit ist auch nachgewiesen, dass ein Browserfehler den Gesamtcheck fehlschlagen lässt.

Diagnose und isolierte Testkorrektur: Vite-Vorschau fügt CORS/Vary: Origin hinzu; lokaler kalter Neustart konnte dadurch Modulvarianten verfehlen. tests/browser/preview-server.mjs schaltet ausschließlich die Vorschau-CORS-Middleware aus. Zusätzlich meldet Playwright/Chromium navigator.onLine in dieser persistenten Offline-Simulation weiterhin true (auch im ersten GitHub-Lauf); diese Browserkennung beweist keine Netzverfügbarkeit. Die korrigierte Probe beendet deshalb den Server tatsächlich und prüft den gescheiterten HTTP-Zugriff vor dem Offline-Neustart. Sie verändert weder Anwendung noch Worker und ignoriert keine Cache-Validierung. Der gesamte lokale Lauf danach ist grün.

Der erste Artefakt-Upload fand wegen des versteckten .qa-output-Verzeichnisses keine Dateien. include-hidden-files ist nun für die zwei expliziten JSON-/PNG-Muster aktiviert; Profile bleiben ausgeschlossen. Aktualisierter GitHub-Gesamtlauf **success**: https://github.com/Arizona2k/wunderkompass/actions/runs/37949478487, Lauf #2, Implementierungscommit `ea60c90f3cd3a9bdc47b420b892f8eed5e81ef6c`, PR-Merge-Stand gegen unveränderten main. GitHub-Connector bestätigt completed/success. Logs belegen pnpm 11.25.0, 20 einzelne Unit-Tests bestanden / 0 Fehler, alle Installations-/TypeScript-/Lint-/Build-/Integritätsschritte sowie vollständige Chromium-Probe (151.0.7922.34) erfolgreich. Lokal waren es Node 24.19.0/Chromium 151.0.7922.173; GitHub verwendet Node 24.21.0 und den zu Playwright passenden Browser.

Artefakt `browser-evidence-37949478487-1` (ID 11625801053, 522112 Bytes): laut Upload-Log fünf Dateien (ein JSON-Bericht, vier PNGs), erfolgreich gespeichert; Connector bestätigt nicht abgelaufen, Ablauf 16. Oktober 2026. Kein Profilupload. Die sicheren Resultate bleiben dauerhaft hier, auch nach Artefaktablauf. Erster roter und anschließender grüner Lauf zeigen Fehlersperre des Jobs und erfolgreichen Normalbetrieb. Branch-Protection-Sperrwirkung ist davon getrennt und noch nicht aktiviert.

Remote-Refs nach Implementierung per git ls-remote bestätigt: main weiterhin `6a540d2af3c0c0bcfade1a806582ffa5afb6302c`, test-live weiterhin `88f79649d588b513bdb385d3307321b21f1a5aa7`, Entwicklungsbranch am getesteten Commit ea60c90. Die anschließende Übergabeänderung betrifft ausschließlich BACKLOG.md, PROJECT_STATE.md und CHANGELOG.md; kein neuer Anwendungs-/Test-/Workflowdiff. git diff --check bestanden. PR wartet auf Review; kein Auto-Merge, keine Vercel-Einstellung oder Testwebsite geändert.

Noch offen: Branch-Regeln importieren/prüfen/aktivieren (separate spätere Freigabe), Sperrwirkung durch roten PR und regulären direkten Pushversuch belegen, vollständiger Pass-Export/Reset/Import/Tab-Browserweg (WK-004), physische Geräte, Safari/Firefox, Screenreader, gehörte deutsche Stimme, schwache Hardware und pädagogische Abnahme. Kein Scheduler oder Auto-Merge aktiviert. Nächster Schritt nach grüner QA: PR gegen main prüfen; Übernahme und spätere test-live-Bereitstellung ausdrücklich kontrollieren.
