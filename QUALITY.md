# Verbindliche Qualität und Tests

## Technische Bestandsgarantien

Node 24 und pnpm 11.25.0 mit pnpm-lock.yaml verwenden; Installation mit `pnpm install --frozen-lockfile`. Abweichungen und Installationshindernisse ausdrücklich dokumentieren, keine stillen Lockfile-/Versionswechsel. Aktiver Einstieg: index.html → migration/main.tsx → vorhandene React-App, Vite, statischer dist/. Historische Sites-/Cloudflare-/D1-/Auth-Beispiele sind kein aktiver Lernserver.

Karten-, Fragen-, Reise-, Spiel-, Kapitel-, Modell- und Fortschritts-IDs sowie Hash-Navigation erhalten. Ein zentraler Schema-3-Pass mit Appkennung `earth-explorer`, IndexedDB `earth-explorer` Version 1 / Store `saves` / Schlüssel `main`, Journal `erde-entdecken:save:v3` und Legacy-Leseschlüssel `erde-entdecken:forscherpass:v2`. Kein zweiter Lernspeicher. Marken-/Domainwechsel migrieren diese Identität nicht automatisch. Speicheränderungen brauchen Nachweise für alte Schema-3-/Legacy-v2-Daten, future/defekte Daten, Import/Export, Reload und Tab-Konflikte.

Nur synthetische Prüfpässe verwenden. Persönliche Passdateien, Notizen, Browserprofile und Geheimnisse niemals versionieren. Bild-/Datenlizenzen, Quellen, Alt-Texte und Modellgrenzen erhalten. Offline-Updates dürfen vorhandenen Pass oder vollständigen vorherigen Cache nicht unbelegt verwerfen.

## Prüfbasis und risikogerechte Erweiterung

Für Code-/Inhaltsänderungen im Repository ausführen:

```bash
pnpm run typecheck
pnpm run lint
pnpm test
pnpm run build
pnpm run verify
```

Bei Änderungen an exportierten Inhalten erst `pnpm run export:data`, danach Integrität prüfen und den gewollten Export-Diff reviewen. Bei reinen Dokumentationsänderungen sind Link-/Regelkonsistenz, Diff und `git diff --check` erforderlich; vorhandene App-Prüfungen können zusätzlich den übernommenen Stand absichern. Keine neuen Tests schreiben, die lediglich Dokumentationsformulierungen spiegeln.

Browserwerkzeuge sind separat unter qa/package.json mit eigenem qa/pnpm-lock.yaml gebunden. GitHub Actions behandelt die portable Browserprobe als Pflichtprüfung; lokal müssen Playwright/Chromium tatsächlich installiert sein. Produktionsbuild statt bloßer DOM-Simulation bedienen:

```bash
pnpm --dir qa install --frozen-lockfile
pnpm --dir qa exec playwright install --with-deps chromium
pnpm run test:browser
```

Die Probe startet ihren eigenen lokalen Preview-Server und speichert isolierte Nachweise unter .qa-output/. QA_PORT und QA_PLAYWRIGHT_MODULE/QA_BROWSER_EXECUTABLE erlauben explizite Umgebungsanpassung. Historische Browser-Skripte zuerst auf alte absolute Pfade prüfen; nicht blind als portable Vollabnahme ausgeben.

## Kritische Nutzung wie ein echter Nutzer

- Mindestens Desktop 1440×900, Tablet 768×1024 und Smartphone 390×844; für veränderte enge Layouts zusätzlich 360 px. Ansichten visuell ansehen, Bilder dekodieren, Überläufe und Konsolen-/HTTP-Fehler prüfen.
- Start/Globus → Ort oder Karte → Modell/Frage → passendes Spiel → Pass → Reload/Fortsetzen. Global suchen, Tippfehler und leere Treffer prüfen; Direktlinks und Browser-Zurück/Vor bedienen.
- Spiele mit falscher und richtiger Antwort, gespeicherter Zufallsrunde, Reload und Abschluss prüfen. Ein bloßer Klick zählt nicht als Lernnachweis.
- Tastatur, Sprunglink, Dialogöffnung/-schließung und Fokusrückkehr, Touch-Alternativen, Kontrast und reduzierte Bewegung kontrollieren; relevante axe-Prüfungen ergänzen. Ein Axe-Ergebnis ersetzt keine Screenreader-Abnahme.
- Bei Speicherung/Offline: realer synthetischer Dateiexport, bestätigter Import/Reset, zwei Tabs, vollständiger Browser-Neustart und vorbereiteter Offlinebetrieb; für Workeränderungen explizites Update von altem Build mit Passerhalt.
- Für Inhalte Lernziel, Verständlichkeit, Fachquellen mit Prüfdatum, Maße/Jahre/Unsicherheit und passende Verbindungen kontrollieren. Keine pauschal als verifiziert bezeichneten ungeprüften Quellenlinks.

Fehler korrigieren und betroffene Prüfungen wiederholen. Browsergrößen und Software-WebGL ersetzen keine physischen Geräte. Hörprobe, Safari/Firefox, Screenreader und schwächere Hardware bleiben konkrete Aufgaben, bis Nachweise vorliegen.

## Abschluss und Freigabe

Ein Arbeitspaket ist abgeschlossen, wenn Akzeptanzkriterien erfüllt, relevante Prüfungen bestanden, offene Grenzen dokumentiert, Projektgedächtnis aktualisiert und beabsichtigte Änderungen in Git gesichert sind. Ein ungetesteter Zwischenstand darf als solcher in einem Draft-PR gesichert werden, erhält aber keine Qualitätsfreigabe. Pro Durchlauf in PROJECT_STATE.md festhalten: Datum, Basis-/getesteter Commit bzw. eindeutig bezeichneten Diff, Werkzeugversionen, Befehle, Exitcodes, tatsächlicher Umfang, Warnungen, Blocker, Branch/PR und nächster Schritt. Rohlogs lokal unter work/ oder .qa-output/; relevante sichere Ergebnisse dauerhaft dokumentieren.

main niemals direkt ändern; keine automatische Zusammenführung oder Veröffentlichung beim GO. Unabhängige Websiteänderungen nicht in einen Dokumentations-/Einrichtungsauftrag mischen.

## Spätere automatische Testpersonen-Freigabe – derzeit inaktiv

Eine später ausdrücklich autorisierte Freigabekette muss folgende Bedingungen erfüllen:

1. Exklusiver Durchlauf nach AGENTS.md, begrenztes Arbeitspaket, überprüfter Entwicklungs-PR und unveränderter getesteter Commit; neue Änderungen machen alte Prüfungen ungültig.
2. Pflichtprüfungen einschließlich Browser-/Speicherregression gemäß Änderungsrisiko bestanden; offene geräteabhängige Grenzen ausdrücklich kenntlich. Keine Freigabe bei Datenverlust, Laufzeitfehlern oder ungeklärter fachlicher Regression.
3. Separate Vorschau für benannte Testpersonen; tatsächlichen Zugriffsschutz, Hosting-Rechte und Kosten prüfen. Ein privates GitHub-Repository schützt die Website nicht automatisch. Prüfpässe verwenden und persönliche Sicherung vor Domainwechsel erklären.
4. Release-Nachweis mit Commit, Prüfbericht, Vorschau-Adresse, Zielgruppe, Rollback auf vorherigen geprüften Build und Abbruch bei fehlgeschlagenem Smoke-Test.
5. Produktionsdomain/main-Merge bleiben separat geschützt. Keine Nutzung des alten Sites-Deployments, keine unbefristete Aktivierung und keine zusätzlichen Dienste ohne entsprechenden Auftrag.

Jetzt ist weder eine Freigabe noch ein Scheduler eingerichtet. Die Regeln bereiten diese spätere Einrichtung vor.

## GitHub Actions und Vorbereitung der test-live-Freigabe

`.github/workflows/quality.yml` prüft PRs gegen main und test-live (ohne Pfadfilter), außerdem manuell per workflow_dispatch nach Übernahme des Workflows. Ein Job mit dem stabilen Checknamen **Required quality checks** führt Node 24 / pnpm 11.25.0, Frozen-Lockfile-Installation, TypeScript, ESLint, Node-Tests, Produktionsbuild, Inhaltsintegrität, separate Frozen-QA-Installation und echten Chromium-Browserlauf aus. Jeder fehlgeschlagene Schritt lässt den Job fehlschlagen; keine continue-on-error- oder Freigabe-Ausnahme. Abgebrochene oder übersprungene Läufe sind keine Freigabe. Der PR-Lauf prüft den GitHub-Merge-Stand des PRs. Logs und sichere Browser-JSONs/Screenshots sind im Actions-Lauf; Profile werden nicht hochgeladen.

Die portable Probe arbeitet ausschließlich gegen localhost mit frischen synthetischen Browserständen. Sie prüft drei Größen, globale Suche inklusive Tippfehler/leeren Treffern, Direktlinks und Zurück/Vor, Bilder, Originalhubs, Memory mit gespeicherter Runde/Reload und Abschluss, Favoriten/Reload, vollständige Offline-Vorbereitung und kalten Browser-Neustart ohne Netzwerk. Historische Browserprüfungen verwenden weiterhin alte absolute Pfade und sind keine zusätzlichen CI-Pflichtprüfungen. Vollständiger Pass-Import/Reset und Tab-Konflikte als Browserablauf bleiben WK-004; vorhandene Speicher-Unit-Tests laufen weiter.

**Noch keine automatische Freigabe:** Dieser Workflow schreibt keine Branches, aktiviert kein Auto-Merge und veröffentlicht nichts. Vercel kann schon durch einen Push nach test-live deployen; ein nachträglicher CI-Lauf auf diesem Branch würde das nicht verhindern. Deshalb keine direkten Pushes, Cherry-Picks oder nachträglichen Codeänderungen auf test-live. Freigabe künftig über einen separaten PR gegen test-live, dessen aktueller Merge-Stand vollständig grün ist. Nach jeder Codeänderung oder Änderung der Zielbasis erneut prüfen. Die verpflichtende Aktualität der Zielbasis verhindert eine Freigabe gegen einen inzwischen geänderten Branch.

`.github/rulesets/test-live.json` ist eine importierbare **deaktivierte Vorlage**, keine angewandte GitHub-Einstellung. Vor späterer Freigabe in GitHub unter Settings → Rules → Rulesets importieren, prüfen und gezielt aktivieren: PR erforderlich, ein unabhängiges Review, alte Reviews verwerfen, letzten Push unabhängig bestätigen, offene Reviewthreads schließen, Check Required quality checks bei aktueller Zielbasis erforderlich, kein Force-Push/Löschen und keine Bypass-Akteure. Bei der Statuscheck-Auswahl die Quelle GitHub Actions festlegen. GitHub-Tarif und Adminrechte müssen Branch-Regeln im privaten Repository unterstützen. Ohne tatsächlich aktive Schutzregeln ist das System eine automatische Prüfung, aber noch keine erzwungene Freigabesperre. main benötigt vor produktiver Automatisierung eigenen gleichwertigen Schutz; seine Einstellungen werden in diesem Auftrag nicht geändert.

Sichere spätere Reihenfolge: Workflow zuerst regulär reviewen/übernehmen; denselben Workflow über einen geprüften PR gegen test-live bereitstellen; Schutzregeln tatsächlich aktivieren und mit einem roten Test-PR sowie einem direkten Pushversuch durch ein reguläres Entwicklerkonto überprüfen; erst danach eine separat beauftragte automatische Zusammenführung erwägen. Kein Deployment aus dieser Einrichtung. Vercel-Zugriffsschutz unverändert lassen. Für jeden späteren Release Commit, grünen PR-Lauf, Zielcommit und vorherigen geprüften Rückfallstand dokumentieren. Ein Rollback ist ebenfalls eine ausdrücklich kontrollierte Bereitstellung; kein Force-Push.
