# Projektstand und Übergabe

Stand: 9. Oktober 2026 (Europe/Berlin). Regeln: AGENTS.md; Ziele: VISION.md; Bestand: BACKLOG.md; Qualität: QUALITY.md; Testfreigabe: TEST-LIVE.md. Frühere Einrichtungsnachweise bleiben in der Git-Historie dieser Datei und CHANGELOG.md erhalten.

## Belegter aktueller Stand

- Privates Repository Arizona2k/wunderkompass, Anwendung in der Repository-Wurzel; Defaultbranch main.
- main beim Start und nach lokalen Prüfungen: `43aa54aee718c14e18d1ff2c10d527c316fc9402`. test-live: `1f7fe74a0f8e7e14bf8e709aea2135dc1b09172c`. Beide unverändert, keine Websiteübernahme, kein Merge, keine Vercel-Einstellung geändert.
- Bestehendes Agentensystem und Quality-CI sind inzwischen übernommen; keine offenen PRs beim Start (API-Prüfung). Die früheren PR-#1/#2-Reservierungen sind abgeschlossen. Der zunächst veraltete lokale work-Checkout wurde mit aktuellem test-live abgeglichen, danach separater Branch erstellt.
- GitHub meldet admin/maintain/push/pull, private visibility, Auto-Merge false und protected:false für main/test-live. Rulesets: HTTP403 mit ausdrücklicher Upgrade-to-Pro-Aufforderung. Branch-Protection-Lesen scheitert außerdem an Integrationsrechten. Keine erzwungene Branch-Sperre vorhanden.
- Aktueller test-live-Commit: GitHub-Status Vercel success. Tarif/Budget, Actions-Schreibrichtlinie, Vercel-Projekt-/Schutz-/Alias-Einstellungen nicht direkt lesbar. Keine Zugangsdaten oder Freigabelinks ausgegeben.
- IDs, Schema-3-Pass, Inhalt, Medien, Hash-Navigation und Anwendungscode unverändert; beide Lockfiles unverändert. Herkunft und frühere Produktprüfungen: PRUEFBERICHT.md/Git-Historie. Keine neue fachliche Vollabnahme behauptet.

## Durchlauf

| Feld | Stand |
| --- | --- |
| ID / Aufgabe | test-release-2026-10-09 / WK-013 |
| Status | in Prüfung; Implementierung und lokale Tests abgeschlossen, Draft-PR #4 gegen test-live |
| Bearbeiter | Codex, diese Cloud-Aufgabe |
| Basis | test-live `1f7fe74a0f8e7e14bf8e709aea2135dc1b09172c` |
| Branch | codex/test-release-2026-10-09 |
| Gemeinsame Reservierung | Während Einrichtung atomarer Remote-Tag wunderkompass-development-lock; Eigentümer `7b58058882d63884bc1aa3417f17dfceac6e9a34`. Nach gesicherter Übergabe nur durch diesen Eigentümer auflösen; Endzustand unten. |
| Nächster Schritt | PR reviewen, isolierte Actions-/Vercel-/Zugangs-/Rollbackabnahme vorbereiten. Keine Übernahme/Aktivierung in diesem Auftrag. |

## Umsetzung

Deaktivierter Controlled-test-release-Workflow mit **fester false-Sperre** und zusätzlicher opt-in-Variable. Die feste Sperre schützt auch bei einer zufällig schon gesetzten Repositoryvariable. Gate und exakte Commitprüfung haben nur Leserechte; ausschließlich Publisher contents/write und pull-requests/read. Actions für diese neue Kette auf überprüfte Commit-SHAs gebunden. Kein PR-Kandidatencode im Schreibjob, kein gemeinsamer Cache, kein Secret in den Prüfschritten. Eigenständige vollständige Qualitätsprüfung der unveränderten Head-SHA; Policy blockiert Änderung an Test-/Build-/Workflow-/Releasekonfiguration und Regeln. Automatische Freigabe deshalb nur für normale Anwendungspakete, nicht für diese Einrichtung.

PR-Freshness, unveränderlicher SHA-zu-SHA-Dateivergleich/Renames mit Vollständigkeitsprüfung (über 300 Dateien manuell), Eigentümerquelle, codex-Branch, Nicht-Draft, auto-test-live-Label, keine konkurrierenden codex-PRs, keine aktive Reservierung und keine ungelösten Änderungsanforderungen werden vor und nach den Tests geprüft. Kandidat muss von aktuellem test-live abstammen. Backup-Tag vor Übertragung; Git-Lease vergleicht atomar den erwarteten Zielcommit, nach expliziter Fast-forward-Prüfung. Kein REST-Ref-Update mit Check-then-write-Rennen, kein neuer ungetesteter Mergecommit, kein main-Ziel. Git-Quittung mit SHAs/Rückfalltag.

Atomare gemeinsame Entwicklungsreservierung über annotiertes Tagobjekt und Lease auf zuvor nicht vorhandenen festen Ref; nur Eigentümer kann auflösen. Gemeinsame Workflowgruppe wunderkompass-development. Einzelne externe Schreibberechtigte und unabhängige nicht teilnehmende Cloud-Aufträge können dieses freiwillige Protokoll weiterhin umgehen. Keine Scheduler aktiviert. TEST-LIVE.md dokumentiert auch unvermeidbare Rennen zwischen PR-Metadaten/Reservierung und Git-Transaktion; die Kette kann dabei nur die geprüfte SHA pushen, nie einen neu hinzugekommenen ungeprüften Commit.

QUALITY/AGENTS/BACKLOG/Testbetriebsanleitung aktualisiert: private Free-Grenze ausdrücklich, test-live als Basis für künftige Testarbeit, main getrennt, konkrete manuelle Aktivierungs- und Rückfallschritte. Die alte deaktivierte Ruleset-Vorlage bleibt nur für passenden späteren Tarif.

## Tatsächlich ausgeführte lokale Prüfungen

Prüfstand: genannte Basis plus Implementierungsdiff dieses Branches. Node v24.19.0, pnpm 11.25.0 über COREPACK_HOME unter work/, Chromium aus /usr/bin/chromium, Playwright 1.62.1. Alle folgenden abschließenden Prüfungen Exit 0:

- App-Frozen-Installation; QA-Frozen-Installation mit Store/Cache unter .sites-runtime. Erster QA-Installversuch konnte das Home-Verzeichnis nicht beschreiben; danach lokale Store-/Cachepfade, erfolgreich. Kein Home-Dump/kein Tokenlesen. Git-/Subprozess-/Browserzugriff benötigt Sandbox-Netzwerkfreigabe zum bestehenden Proxy/localhost.
- typecheck, lint, pnpm test: 20 App-Tests bestanden, null Fehler.
- build: statischer Produktionsbuild erfolgreich; bestehende Warnungen zu großen Chunks und progress-storage-Dynamic-Import bleiben.
- verify: 32 Inhaltsdateien/Prüfsummen bestätigt.
- Vollständige bestehende portable Produktionsbrowserprobe: drei Größen, 21 Ansichten, Such-/Hash-/Bild-/Hub-/Favoriten-/Memoryabläufe, Reload/Fortsetzen/Abschluss und kalter Offline-Neustart mit tatsächlich beendetem Server, 111 vollständige Cacheeinträge. Keine JS-/Request-/HTTPfehler im erfassten Ablauf. System-Chromium statt eines neuen CDN-Downloads; keine physische Geräte-/Hör-/Screenreader-Abnahme.
- Release-/Policy-/Git-Integration: **27 Tests bestanden**. Zulässiger Fall, Draft/geschlossen/main/Fork/fremder Autor/fehlendes Label, geänderte Head-/Base-SHA, zweiter PR, Test-/Workflow-/Script-/Lockfile-/Regeländerungen, Rename aus geschütztem Pfad, ungültige SHA, leere/unvollständige Dateiliste, divergente Basis und Reviewblock. Echte lokale bare Git-Repositories: exakt geprüfte SHA übertragen, main unberührt, Rückfalltag erhalten, Doppelübernahme abgewiesen, veraltete Basis/Nicht-Fast-forward abgewiesen, serverseitiges Lease-Rennen durch post-receive-Hook simuliert, Backupfehler stoppt Push, Rückfallcommit hat alten Baum und aktuelle Historie, Reservierung exklusiv/ownergebunden und blockiert Publisher.
- actionlint 1.7.7 für beide Workflowdateien, git diff --check. actionlint als Releasebinary nach work/ geladen; keine Systeminstallation. Ein zunächst ausprobiertes vorhandenes go-Wrapperkommando konnte go install nicht ausführen; Binaryprüfung anschließend erfolgreich.

Rohlogs unter work/, ausschließlich synthetische Browsernachweise unter .qa-output/, beides unversioniert. Keine echten Git-Releases oder Rollbacks auf test-live ausgeführt. Ein früher lokaler Renn-Test hatte denselben Zielcommit als Konkurrenz eingesetzt (Git betrachtet das als bereits aktuell); Test auf einen tatsächlich unterschiedlichen Konkurrenzcommit korrigiert, abschließender Lauf grün.

## Aktivierungsgrenzen

Kein echtes Publisher-GITHUB_TOKEN-Schreib-/Vercel-End-to-end-Experiment an der bestehenden Website: würde das ausdrückliche Änderungsverbot verletzen. Vor Aktivierung isoliert nachweisen; bei zusätzlichen Kosten oder Credentials anhalten. Konstanten Alias, bestehenden Zugangsschutz, autorisierte/unautorisierte Browser, vorherigen funktionierenden Deploymentstand und Rückfall isoliert bestätigen. Konto-Restkontingent und Ausgabenlimit prüfen. Die Einrichtung kann nach Review nach test-live übernommen werden, löst dabei möglicherweise schon einen Vercel-Build aus und bleibt deshalb eine spätere Aktion. Feste false-Sperre erst nach Abnahme separat reviewt entfernen, danach auf ausdrücklichen Auftrag opt-in aktivieren. main bleibt unverändert.

## GitHub-Nachweis und Abschluss

Draft-PR #4: https://github.com/Arizona2k/wunderkompass/pull/4 gegen test-live, kein Merge. Implementierungscommit `5e4b81379c0c17e7610faff3ae1e4478e41d1a30` vollständig remote grün: https://github.com/Arizona2k/wunderkompass/actions/runs/37954354567 (Quality, Lauf #5, completed/success). Alle Pflichtschritte einschließlich 27 Release-/Git-Tests, 20 App-Tests und vollständiger Chromium-Produktionsprobe erfolgreich.

Abschließende Härtung nach diesem Lauf: Dateiprüfung stammt aus dem **unveränderlichen SHA-zu-SHA-Commitvergleich**, nicht aus einer zwischenzeitlich veränderlichen PR-Dateiliste. Der exakte Vergleich und changed_files müssen übereinstimmen; GitHubs Vergleichsgrenze von 300 Dateien blockiert größere Pakete sicher zur manuellen Wartungsprüfung. Regression im API-Test ergänzt: eine geschützte Änderung am geprüften Commit wird trotz hypothetisch harmloser beweglicher PR-Dateiliste abgewiesen. Erneuter vollständiger lokaler Release-/Git-Lauf: 27/27 bestanden; actionlint und Diffprüfung bestanden. Anwendung/Lockfiles unverändert, lokale App-/Browserprüfung daher weiterhin derselbe Anwendungsstand.

Diese Härtung und Abschlussdokumentation werden als Folgecommit im selben PR synchronisiert; GitHub prüft auch diesen endgültigen PR-Head erneut vollständig. Den jeweils aktuellen CI-Nachweis am PR prüfen, keine frühere grüne SHA für einen später geänderten Head als Freigabe verwenden. Der endgültige CI-Ausgang wird im Abschlussbericht dieses Auftrags genannt.

Eigene gemeinsame Reservierung nach gesicherter Übergabe mit exakt ihrer Eigentümer-SHA aufgelöst; Remote-Abwesenheit überprüft. Kein aktiver Entwicklungsdurchlauf nach Abschluss, PR bleibt in Prüfung. main/test-live nach Abschluss erneut gegen die oben genannten SHAs geprüft. Keine feste false-Sperre entfernt, kein Release-Label gesetzt, keine Repositoryvariable aktiviert, kein Scheduler und kein kostenpflichtiger Dienst eingerichtet. Vercel-End-to-end-Veröffentlichung weiterhin ausdrücklich nicht ausgeführt.
