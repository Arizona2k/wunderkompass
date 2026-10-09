# Änderungsverlauf

Nur tatsächlich abgeschlossene Änderungen aufnehmen. Historische Produktänderungen und Prüfungen bleiben in QA.md, WORLD-AUDIT.md, MASTER-AUDIT.md und PRUEFBERICHT.md; sie werden hier nicht als neu ausgeführte Arbeit wiederholt.

## 2026-10-09 – Agentensystem vorbereitet (WK-001)

- Bestehende technische Regeln um dauerhaftes Projektgedächtnis, begrenzten GO-Ablauf, Übergaben, Branch-/PR-Sicherung und Schutz vor parallelen Durchläufen ergänzt.
- VISION.md, BACKLOG.md und QUALITY.md als gemeinsamer Produkt-, Aufgaben- und Qualitätsbestand angelegt.
- GitHub-/Cloud-Iststand erfasst und historische Exportanleitung vom aktuellen Repository-Einstieg getrennt; PR-Vorlage ergänzt.
- Cloud-Prüfbasis mit pnpm 11.25.0 und Frozen-Lockfile-Installation hergestellt; Standardprüfungen auf dem importierten Stand ausgeführt (WK-002, Ergebnisse in PROJECT_STATE.md).
- Keine Anwendungs-, Inhalts-, ID-, Speicherformat- oder Lockfileänderung; keine Website veröffentlicht und keine Automatisierung aktiviert.

Tatsächliche Prüfungen, Einschränkungen und Synchronisierungsstand dieser Einrichtung stehen in PROJECT_STATE.md. Spätere Aufgaben übernehmen diesen Bestand.

## 2026-10-09 – Automatische PR-Prüfbasis umgesetzt (WK-012/WK-003, in Review)

- GitHub-Actions-Pflichtjob für PRs gegen main/test-live mit Node 24, pnpm 11.25.0, Frozen-Installationen, TypeScript, ESLint, Node-Tests, Build, Inhaltsintegrität und Chromium eingerichtet.
- Browserwerkzeuge mit eigenem QA-Lockfile reproduzierbar installiert; vorhandenes App-Lockfile erhalten. Portable Produktionsprobe um Suche/Tippfehler/kein Ergebnis, Hash-Zurück/Vor und Memory mit falschen Paaren, Reload/Fortsetzen und Abschluss ergänzt.
- Isolierten Vorschau-Testserver, echte Serverabschaltung vor kaltem Offline-Neustart sowie Fehlerberichte und ausschließlich synthetische Browserartefakte vorbereitet. Vollständige lokale Browserprobe bestanden.
- Deaktivierte test-live-Ruleset-Vorlage und sichere spätere Freigabereihenfolge dokumentiert. Keine aktive Branch-Regel, kein Auto-Merge, keine Vercel-Änderung oder Veröffentlichung.
- Erster tatsächlicher Actions-Lauf hat einen Browserfehler korrekt als roten Pflichtcheck gemeldet. Der korrigierte vollständige Actions-Lauf #2 ist grün, einschließlich 20 Unit-Tests, Chromium und fünf gespeicherten Browserartefakten. Getesteter Commit und Lauf stehen in PROJECT_STATE.md; Implementierung wartet in PR #2 auf Review.

## 2026-10-09 – Isolierten Vercel-Test vorbereitet (WK-015, in Review)

- Befristeten, manuell startbaren und fest deaktivierten Workflow mit exakter Kandidatenqualität, create-only Git-Push und frischer branch-/SHA-bezogener Previewbeobachtung vorbereitet. Keine Autoränderung, Promotion oder automatische Freigabe.
- 13 neue lokale Git-/Beobachtungstests bestanden; fünf vorhandene Tagtests erhalten. Bestehende vollständige Kandidatenprüfung einschließlich 27 Release-/20 App-Tests und Chromium-Produktionsbrowser erfolgreich.
- VERCEL-E2E.md dokumentiert Abnahme, Kontingent-/Übernahmegrenze, Schutzprüfung, Fehlerbehandlung und Erhaltung des alten Entwicklungsstands. Noch kein Remote-E2E-Nachweis und keine Aktivierung.

## 2026-10-09 – Vercel-Baseline korrigiert (WK-015, in Review)

- Bestätigten authorize-Fehler durch paginierte Einzelstatus-API behoben. Der neueste Vercel-Kontext muss erfolgreich sein und vom Vercel-Bot stammen; fehlende Creator oder neuere Fehler verdecken keinen alten Erfolg.
- Auch die neueste Deployment-Statusmeldung benötigt einen Vercel-Botnachweis. Acht Regressionstests ergänzt, einschließlich tatsächlichem authorize-Skript; insgesamt 26 Release-Tests grün.
- Standardprüfungen, lokale Chromium-Produktionsprobe, Actionlint und Syntax bestanden. Remote-E2E und Deployment-API-Vertrag bleiben offen. Korrekturbranch gezielt von Vercel ausgeschlossen; kein Rerun, Merge oder automatische Veröffentlichung.
