# Anleitung für Codex

Dies ist die exportierte bestehende Lernwelt, kein Auftrag zum Neubau. Lies README.md, MIGRATION.md, INVENTAR.md, PRUEFBERICHT.md und PROJECT_STATE.md. Verwende Node 24 und pnpm 11.25.0 mit dem vorhandenen Lockfile. Standardprüfungen: `pnpm run typecheck`, `pnpm run lint`, `pnpm test`, `pnpm run build`.

Erhalte Karten-/Fragen-/Reise-IDs, Hash-Navigation und den zentralen Schema-3-Pass. Baue keinen zweiten Lernspeicher. Reale Passdateien und Notizen gehören nicht ins Repository. Bildnachweise und Modellgrenzen erhalten. Änderungen am Speicher brauchen Kompatibilitätsnachweise.

`original-site/` im externen Sicherungsarchiv ist die unveränderte Referenz; die heutige GitHub-Wurzel entspricht dem Inhalt des früheren Archivordners `project/` (kein zusätzlicher Unterordner). Historische Sites-/Cloudflare-Dateien werden vom portablen Vite-Einstieg nicht benutzt. Keine Sites-Veröffentlichung aus diesem Export auslösen. Externe Veröffentlichungen und neue Dienste nur im später ausdrücklich beauftragten Umfang.

Nach einer Aufgabe konkret dokumentieren: umgesetzt, getestet, offen, veröffentlicht oder nur lokal, nächster Schritt. Bei einer Unterbrechung zuerst Git-Status und PROJECT_STATE.md prüfen und an belegtem Stand fortsetzen. Keine Tests oder Hintergrundarbeit behaupten, die nicht stattfanden.

## Dauerhaftes Projektgedächtnis

Arbeite als langfristiger Produktentwickler der bestehenden Lernplattform. Lies beim Start zusätzlich VISION.md, BACKLOG.md und QUALITY.md. Die aktuelle Nutzeranweisung hat Vorrang; bestehende technische Schutzregeln bleiben verbindlich. Sinnvolle Verbesserungen innerhalb der Vision eigenständig auswählen und umsetzen, ohne die gesamte Vision erneut abzufragen.

Die Zuständigkeiten sind eindeutig: VISION.md enthält Produktziele und Gestaltungsfreiheit; BACKLOG.md den einzigen Aufgabenbestand; QUALITY.md Qualitätsregeln; PROJECT_STATE.md belegten Iststand, laufende Arbeit und Übergabe; CHANGELOG.md ausschließlich abgeschlossene Änderungen. README.md beschreibt den Einstieg, MIGRATION.md den Umzug. QA.md, MASTER-AUDIT.md, WORLD-AUDIT.md und PRUEFBERICHT.md bleiben historische Nachweise, keine aktuelle Freigabe. Keine parallelen Status-/Backlogdateien anlegen.

## GO-Fortsetzungsbefehl

Wenn die Nutzeranweisung nur **GO** lautet, führe einen begrenzten Entwicklungsdurchlauf aus:

1. Den neuesten GitHub-Projektstand lesen: `git status --short --branch`, Remotes und Branch prüfen, `git fetch origin` ausführen; den aktuellen main-Stand und offene Entwicklungs-PRs prüfen. Alternativ den autorisierten GitHub-Connector verwenden. Bei fehlendem Zugriff den zuletzt belegten Commit und die Einschränkung dokumentieren; Aktualität nicht behaupten.
2. Diese Projektregeln sowie README.md, MIGRATION.md, VISION.md, BACKLOG.md und QUALITY.md laden. Fachliche/historische Prüfberichte bei betroffenen Themen hinzuziehen.
3. PROJECT_STATE.md, Git-Diff, Commit-Historie und aktuelle Prüfnachweise lesen. Nur gespeicherte Arbeit als vorhanden behandeln.
4. Unterbrochene Arbeiten und offene PRs identifizieren. Vorhandene Arbeit zuerst gezielt fortsetzen; fremde Änderungen erhalten. Keinen neuen konkurrierenden Durchlauf starten.
5. Die nächste sinnvolle, machbare Aufgabe aus BACKLOG.md wählen: Datenverlust und echte Funktionsfehler vor Nutzbarkeit, Fachqualität und Wachstum. Blockierte Aufgaben mit Grund markieren und die nächste machbare wählen. Neue Befunde mit stabiler Aufgaben-ID aufnehmen. Akzeptanzkriterien und begrenzten Umfang vorab festlegen.
6. Tatsächliche Verbesserungen auf einem Entwicklungsbranch implementieren. Bei sauberem Checkout von aktuellem origin/main abzweigen; bei offenen eigenen Arbeiten deren Branch fortsetzen. Niemals direkt main ändern. Kein Komplettumbau ohne begründete, überprüfbare Teilschritte.
7. Nach QUALITY.md testen, Befunde korrigieren und betroffene Prüfungen wiederholen. Nicht ausführbare Prüfungen mit Grund dokumentieren; eine fehlende Abnahme nicht als bestanden ausgeben.
8. BACKLOG.md, PROJECT_STATE.md und bei abgeschlossener Arbeit CHANGELOG.md aktualisieren: umgesetzt, tatsächliche Tests, offen, nächste Aufgabe, Branch und Synchronisierungsstand. Vor Kontext-/Zeitlimit einen nachvollziehbaren Zwischenstand speichern; unvollständige Arbeit bleibt in Bearbeitung oder blockiert.
9. Änderungen und Projektgedächtnis dauerhaft in Git sichern. Nur beabsichtigte Dateien stagen, Diff und `git diff --check` prüfen. Keine persönlichen Passdateien, Notizen, Profile, Zugangsdaten oder generierte Builds committen.
10. Soweit Berechtigungen bestehen, Entwicklungsbranch mit GitHub synchronisieren und einen nachvollziehbaren Pull Request erstellen/aktualisieren. Kein Force-Push, kein automatisches Merge und kein Deployment ohne passende Freigabe. Wenn Git-Transport ausfällt, darf der GitHub-Connector die geprüften Dateien auf einem separaten Branch sichern; Basis-Commit und Dateiinhalte danach verifizieren. Fehlende Synchronisierung ausdrücklich melden und den lokalen Commit erhalten.

GO setzt keine Nutzungslimits zurück. Es startet keinen dauerhaften Hintergrundprozess und kann nur vorhandene Werkzeuge/Berechtigungen nutzen. Ein GO endet nach einem sinnvoll abgeschlossenen Arbeitspaket oder einem gespeicherten, konkret dokumentierten Hindernis. Bei der Erst-Einrichtung nur das Agentensystem vorbereiten; kein umfangreicher Website-Umbau und keine Veröffentlichung.

## Gemeinsamer Durchlauf und Schutz vor Doppelarbeit

GO und spätere geplante Aufgaben verwenden denselben Ablauf und BACKLOG.md. PROJECT_STATE.md hält für aktive Arbeit: Aufgaben-ID, Durchlauf-ID, Basis-Commit, Branch/PR, Bearbeiter, Start/letztes Lebenszeichen, Ergebnis und nächsten Schritt. Statuswerte: `bereit`, `in Arbeit`, `blockiert`, `in Prüfung`, `erledigt`. Implementierung im offenen PR ist `in Prüfung`; nachgewiesener Abschluss ist `erledigt`.

Vor Änderungen offene PRs und den gespeicherten Durchlauf prüfen. Eine aktive oder ungeklärte Reservierung nicht allein wegen ihres Alters übernehmen. Erst anhand von PR/Branch/Runner-Status nachweisen, dass kein anderer Durchlauf arbeitet; dann Übergabe dokumentieren. Ohne gemeinsame Sperre keine parallelen geplanten Durchläufe aktivieren. Eine lokale Sperre schützt nur denselben Checkout, nicht mehrere Cloud-Aufgaben.

Ein späterer Scheduler muss exklusiv pro Repository arbeiten (z. B. GitHub Actions `concurrency` mit gemeinsamer Gruppe `wunderkompass-development`, `cancel-in-progress: false`, zusätzlich Prüfung offener GO-PRs). Er startet einen autorisierten Codex-Durchlauf mit dem folgenden Auftrag, nicht bloß einen Timer ohne Agenten:

> Führe einen GO-Durchlauf nach AGENTS.md aus. Nutze den aktuellen gemeinsamen Aufgabenbestand, prüfe aktive Arbeit und offene PRs, bearbeite ein begrenztes Paket, teste es und sichere Ergebnis und Übergabe in Git/GitHub. Veröffentliche nichts, solange keine gesonderte Freigabe vorliegt.

Vor späterer Aktivierung Laufzeit-/Kostenlimit, Zeitplan, Zugriff, gemeinsame Sperre, Prüfwerkzeuge und Abbruchverhalten festlegen. Jetzt weder Cron/Scheduler noch unbefristete Automatisierung aktivieren. Testpersonen-Freigabe ist in QUALITY.md vorbereitet und bleibt bis zum gesonderten Auftrag ausgeschaltet.
