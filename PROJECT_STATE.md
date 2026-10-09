# Projektstand und Übergabe

Stand: 9. Oktober 2026 (Europe/Berlin). Diese Datei beschreibt belegten Iststand und aktive Arbeit. Regeln: AGENTS.md; Ziele: VISION.md; Aufgaben: BACKLOG.md; Abnahme: QUALITY.md; abgeschlossene Änderungen: CHANGELOG.md.

## Tatsächlicher Repository-Stand

- Privates Repository: https://github.com/Arizona2k/wunderkompass, Standardbranch main. GitHub-Connector meldet Schreib-/PR-Rechte.
- GitHub-main am Beginn dieses Durchlaufs über Connector gelesen: `0d9196741225dc902ef75d0f167ed37f97b4b344` (`Add files via upload`). Lokaler HEAD und origin/main stimmten damit überein. Der GitHub-Import ist erfolgt; die Repository-Wurzel ist direkt die Anwendung, kein zusätzlicher Ordner project/.
- Checkout dieser Cloud-Aufgabe: /workspace/wunderkompass. Startbranch war der isolierte Branch work, sauber. Neuer Entwicklungsbranch: `codex/agent-system-2026-10-09`. main wurde nicht verändert.
- Herkunft des Exports: bestehende WunderKompass-Site Version 14, Originalcommit `7b93a5c53fcd42d46b310252b6a4a3cf5622fbe7`. original-site/, ZIP und externe Archiv-Prüfsummen gehören zur getrennten Sicherung, nicht zum aktuellen Checkout. Historische Angaben zur aktiven Original-Site wurden hier nicht erneut remote geprüft.
- Aktive Anwendung: React/TypeScript, portabler Vite-Einstieg, vorhandene Inhalte/Medien und zentraler Schema-3-Pass. Historische Sites-/Cloudflare-/D1-Dateien sind inaktive Quellen. Kein neuer Dienst oder Lernspeicher.
- Kein Website-Umbau, kein Deployment, kein main-Merge und keine geplante/unbefristete Automatisierung in dieser Aufgabe. Eine Vercel-Anbindung oder externe Testpersonen-Freigabe wurde nicht geprüft oder eingerichtet.

## Durchlauf und Reservierung

| Feld | Belegter Stand |
| --- | --- |
| Durchlauf | setup-2026-10-09 |
| Aufgabe | WK-001 – Agentensystem einrichten |
| Status | in Prüfung; Einrichtung/Prüfbasis abgeschlossen und auf GitHub gesichert, PR wartet auf Review/Merge. Kein aktiver Entwicklungsdurchlauf mehr. |
| Bearbeiter | Codex, diese Cloud-Aufgabe |
| Basis | GitHub-main `0d9196741225dc902ef75d0f167ed37f97b4b344` |
| Branch | `codex/agent-system-2026-10-09` |
| Start / letztes Lebenszeichen | 9. Oktober 2026 / Abschluss um 16:14 Uhr Europe/Berlin |
| PR | https://github.com/Arizona2k/wunderkompass/pull/1 – offen, kein Draft, nicht zusammengeführt |
| Gemeinsame Sperre | Kein Scheduler aktiv; vor neuem Durchlauf GitHub-Branch/PR und aktiven Aufgabenstatus prüfen. Keine parallele Reservierung starten. |

## Einrichtung und Prüfung

AGENTS.md erweitert; VISION.md, BACKLOG.md, QUALITY.md, CHANGELOG.md und PR-Vorlage angelegt; README.md/MIGRATION.md um aktuellen GitHub-/GO-Einstieg ergänzt. Bestehende IDs, Hash-Navigation, Lerninhalte, Speicherformat, Medien und Lockfile bleiben unverändert.

Historische Nachweise gelesen: PRUEFBERICHT.md (Export), QA.md (letzte Produktprüfung), MASTER-AUDIT.md und WORLD-AUDIT.md (frühere Ausbaustände), INVENTAR.md. Ihre Ergebnisse sind keine neue Vollabnahme dieses Checkouts. Rohprotokolle des externen Archivs sind hier nicht als vorhanden vorausgesetzt.

Node `v24.19.0`; vorinstalliertes pnpm `11.19.0`. Die anfänglichen Fetch-/Downloadfehler lagen am eingeschränkten Netzwerkzugriff des Shell-Sandboxes. Mit `with_additional_permissions` für Netzwerk funktioniert der Zugriff über den vorhandenen Proxy: `git fetch origin` Exit 0, unveränderter main-Commit wie oben; Corepack liefert pnpm `11.25.0`. `COREPACK_HOME=/workspace/wunderkompass/work/corepack` hält den Paketmanager im ignorierten Arbeitsbereich. Eine frische Aufgabe muss dieses Setup erneut herstellen (work/ ist kein dauerhaftes Projektgedächtnis). Kein Proxy-Bypass und kein Lockfilewechsel.

Mit pnpm 11.25.0 wurde `pnpm install --frozen-lockfile` erfolgreich ausgeführt (Exit 0, Lockfile aktuell, vorhandene Abhängigkeiten bereits aktuell). Prüfungen werden über `COREPACK_HOME=/workspace/wunderkompass/work/corepack corepack pnpm ...` gestartet. Erster zusätzlicher Prüflauf mit vorinstalliertem pnpm 11.19.0 bestand ebenfalls, ist aber nicht der maßgebliche Paketmanager-Nachweis.

Prüfstand: unveränderter Anwendungscode des Basiscommits plus Dokumentationsdiff dieses Branches; Node 24.19.0, pnpm 11.25.0. Alle fünf Standardprüfungen nach der Frozen-Lockfile-Installation ausgeführt:

| Prüfung | Tatsächliches Ergebnis |
| --- | --- |
| `pnpm run typecheck` | Exit 0. |
| `pnpm run lint` | Exit 0, keine Warnungen. |
| `pnpm test` | Exit 0; Reporter meldet drei erfolgreiche Testdateien, null Fehler (content/progress/search). Die Quellen enthalten 20 Testdefinitionen; diese werden hier nicht als 20 einzeln ausgegebene Testergebnisse behauptet. |
| `pnpm run build` | Exit 0; statischer Build erzeugt. Bestehende Warnungen: Chunks >500 kB und ineffektiver dynamischer Import von progress-storage.ts. |
| `pnpm run verify:export` | Exit 0; 32 Inhaltsdateien und Prüfsummen verifiziert. |
| Dokumentation | Neun Projekt-/Agentendateien geprüft; lokale Markdown-Links auflösbar, technische Altregeln erhalten; `git diff --check` Exit 0. Keine App-/Medien-/Inhalts-/Lockfileänderung im Diff. |
| `node tests/browser/portable-smoke.mjs` | Exit 1 vor Browserstart: `ERR_MODULE_NOT_FOUND` für qa/node_modules/playwright/index.mjs. Keine Browserwege als neu bestanden behauptet; Werkzeugbereitstellung und echte Probe sind WK-003. |

Rohlogs lokal unter work/ (nicht versioniert). Die sicheren Resultate stehen dauerhaft hier. Neue Browser-/Geräte-/Audio-Vollabnahme bleibt offen.

Git-Synchronisierung erfolgreich: Einrichtungscommit `62f2b1e6dcdaf4cccc2c1a71a9716284b65f2283` wurde mit `git push -u origin codex/agent-system-2026-10-09` auf GitHub gesichert (Exit 0). Der GitHub-Connector bestätigte denselben Head in [Pull Request #1](https://github.com/Arizona2k/wunderkompass/pull/1), Ziel main, Basis unverändert `0d9196741225dc902ef75d0f167ed37f97b4b344`. Die vorliegende Ergänzung dokumentiert diesen Nachweis als separaten Übergabecommit auf demselben Branch. Es besteht kein Synchronisierungsblocker mehr. main bleibt unangetastet; es wurde nichts zusammengeführt oder veröffentlicht.

## Nächste Aufgabe und offene Grenzen

Erster GO: Versions-/Werkzeugsetup bestätigen, dann WK-003 (portable Browserprobe), danach WK-004 (Suche/Pass-Nutzerweg). WK-002 wurde bei der Einrichtung mitbearbeitet. Bei erneutem Netzwerkblocker diesen festhalten und die nächste machbare Aufgabe wählen. Vor GO die Agentenregeln aus diesem Entwicklungsbranch laden oder den geprüften PR regulär nach main übernehmen; der Merge wird in dieser Einrichtung nicht ausgeführt.

Offen: physische Mobilgeräte, Safari/Firefox, gehörte deutsche Stimme, manuelle Screenreader, 200-%-Zoom auf Geräten, Leistungsprofil schwächerer Hardware und pädagogische Beobachtung. BACKLOG.md priorisiert konkrete machbare Maßnahmen. Veröffentlichung/Testpersonen/Scheduler bleiben bis zu einem passenden gesonderten Auftrag blockiert. Persönlichen Entdeckerpass vor Domainwechsel sichern; keine Passdaten ins Repository.
