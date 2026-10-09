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

## 9. Oktober 2026 – Testfreigabe technisch vorbereitet (WK-013)

Deaktivierte Kette für exakte Commitprüfung und kontrollierte Übernahme ausschließlich nach test-live; separate minimale Schreibrechte, vertrauenswürdiger Publisher, Vorgängersicherung und atomarer Git-Leasevergleich. Gemeinsame Entwicklungsreservierung und Release-/Git-Integrationstests ergänzt. Aktuelle Tarifgrenze und isoliert erforderliche Vercel-/Aktivierungsabnahme dokumentiert. Lokal 27 neue Release-/Git-Tests sowie vorhandene App-/Browserprüfungen bestanden. Separater Entwicklungsbranch; kein main/test-live-Merge, keine Aktivierung und keine bestehende Website verändert. Remote-Nachweis in PROJECT_STATE.md.

## 9. Oktober 2026 – WK-016: vernetzte Natur- und Weltallentdeckungen

Auf eigenem Branch von test-live umgesetzt, noch nicht veröffentlicht: acht neue Fachquellen-geprüfte Karten, 32 mittlere/schwere Aufgaben, 16 erklärte bidirektionale Beziehungen, zwei Lernrouten, zwei gespeicherte Lernmodelle und Wissens-Challenge mit drei Stufen (142 Aufgaben). Kartenübersicht portioniert auf zwölf Treffer; keine feste Inhaltsobergrenze. 108 bisherige Karten/IDs, Schema-3-Pass und Lockfiles erhalten. Gesamt: 116 Karten, acht Routen, 31 Spielangebote. 25 App-Tests, 27 Release-Tests, TypeScript/Lint/Build/33 Inhaltsdateien und vollständiger Produktionsbrowserlauf bei vier Größen inklusive neuen Spielabschlüssen/Reload/Offline erfolgreich. Grenzen/Reviewstatus und nächste Arbeit in PROJECT_STATE.md/BACKLOG.md. Keine Zusammenführung oder Websiteveröffentlichung.
