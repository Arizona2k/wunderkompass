# Isolierter Vercel-End-to-End-Test (WK-015)

Der Workflow wurde mit PR #7 bereits manuell aktivierbar nach main übernommen. `.github/workflows/vercel-e2e.yml` kennt ausschließlich `workflow_dispatch`, verlangt Eigentümer/main/Bestätigung und endet am 16. Oktober 2026 um 02:00 Uhr Europe/Berlin. Diese Korrektur erteilt keine neue Test- oder Veröffentlichungsfreigabe. Kein Cron, Pushtrigger, Release-Label, PAT, Vercel-Token, Deploy-Hook, neues Projekt oder kostenpflichtiger Dienst. Die vorhandene automatische test-live-Freigabe bleibt ausgeschaltet.

## Bestätigter Fehler und Baseline-Korrektur

Lauf [37967901842](https://github.com/Arizona2k/wunderkompass/actions/runs/37967901842) scheiterte in `authorize` mit `No existing successful Vercel baseline`; Quality, Push und Beobachtung wurden übersprungen. Das tatsächliche Joblog und beide GitHub-API-Antworten wurden am 9. Oktober 2026 erneut gelesen: `GET /commits/4b73cdb4ab049bcfe227fd43f07c80e8ffe68b0f/status` enthält Vercel-success (Status-ID 55998884691), aber kein `creator`; `GET /commits/.../statuses` enthält denselben Erfolg mit `creator.login = vercel[bot]` sowie den älteren pending-Status 55998855005. Ursache ist das ungeeignete Antwortschema, kein fehlendes erfolgreiches Bestandsdeployment.

Die Baseline verwendet nun `repos.listCommitStatusesForRef` mit Pagination. GitHub liefert einzelne Statusmeldungen in umgekehrter chronologischer Reihenfolge. Der erste Eintrag im exakten Kontext `Vercel` entscheidet; erst danach werden `success` und `vercel[bot]` verlangt. Fehlende Creator, fremde Bots, pending/failure/error und API-Fehler blockieren; ältere Erfolge werden nicht als Ersatz akzeptiert. Autor-/SHA-Prüfung, Rechte, Laufzeit, Befristung und manuelle Trigger bleiben erhalten.

Der Beobachter verwendet bereits die separaten Deployment-/Deployment-Status-APIs, keine kombinierte Commitstatusantwort. Er verlangt weiterhin neue Deployment-ID, Run-Branch, SHA, Pushzeit, Preview, `production_environment: false` und den neuesten Status; dessen Creator muss zusätzlich `vercel[bot]` sein. HTTPS-Vercel-URL und `browserAcceptance: PENDING` bleiben verbindlich. Fehlende/fremde Creator führen zu Abbruch, nicht zu einer Ersatzannahme. Die tatsächlichen Deployment-API-Antworten konnten hier nicht gelesen werden: Connector lehnt die Deployment-Collection ab, CLI-Zugriff meldet `Forbidden`. Ob die bestehende Integration genau diese Branch-/Umgebungs-/Creator-/URL-Felder liefert, bleibt **OFFEN**. Das ist eine Beobachtungsgrenze, kein Nachweis eines fehlenden Vercel-Triggers.

Kein erneuter Dispatch oder Workflow-Rerun in diesem Korrekturauftrag. Der Korrekturbranch `codex/fix-vercel-baseline-2026-10-09` ist gezielt von Vercel-Autodeploy ausgeschlossen; Commits enthalten `[skip ci]`, um keine PR-Actions zu starten. Die korrigierte Remote-Kette, ein frisches Preview, READY/Buildlog, tatsächlicher Zugriffsschutz und berechtigter Remote-Browser sind weiterhin **OFFEN**. Vor einem später separat beauftragten Test Kontingente, aktuelle main-Regeln, Ablaufdatum und Dashboard-Zuordnung erneut prüfen.

## Fester Testumfang

- Bereits bestehender, vom Eigentümer verfasster Mergecommit: `4b73cdb4ab049bcfe227fd43f07c80e8ffe68b0f`, übernommen mit PR #4 nach test-live. Sein Vercel-Status ist erfolgreich; die Autorzuordnung wird vor dem Test über GitHub erneut geprüft. Es wird keine Autoridentität nachgeahmt und kein neuer Anwendungskommit erzeugt.
- Lesender Quality-Job prüft exakt diese SHA: Frozen-Installationen, TypeScript, Lint, Release-Tests, App-Tests, Build, Inhaltshashes und lokale Chromium-Produktionsprobe. Jeder Fehler verhindert den Schreibjob. Kontrollcode im Schreib-/Beobachtungsjob kommt ausschließlich vom separat reviewten Workflowcommit, niemals vom Kandidaten.
- Nur ein auf höchstens zwei Minuten begrenzter Job erhält `contents: write`. Checkout nutzt den normalen Job-`GITHUB_TOKEN`. Einziger Schreibref: neuer Branch `wk-vercel-e2e-RUN_ID-RUN_ATTEMPT`. Servergeprüfte leere Git-Lease verhindert Überschreiben eines bereits bestehenden Branches. Neue Run-Attempts bekommen eigene Namen.
- Der Commit wird direkt als Git-Objekt übertragen. SHA, Baum, Autor, Committer, Eltern und Signatur bleiben dadurch unverändert; kein amend/cherry-pick/merge. `main` und `test-live` werden vorher/nachher nur gelesen. Ein externer Branchwechsel wird als Fehler gemeldet und nicht automatisch rückgängig gemacht. Die Jobberechtigung ist technisch repositoryweit; die Zielbegrenzung erfolgt im reviewten Code.
- Bestehende Vercel-Git-Integration soll genau diesen Push als Preview verarbeiten. Der Test ruft keine Deployment-API zum Auslösen auf. Nur GitHub-Deployment-Datensätze werden lesend beobachtet, höchstens 60 Abfragen über ungefähr zehn Minuten.

## Freigabegrenze vor jedem Remote-Test

1. Korrektur-PR und endgültigen Diff prüfen. Der manuelle Workflow ist bereits auf main registriert; die Übernahme dieser Korrektur würde main erneut ändern und kann selbst die bestehende Website neu bauen. **Dieser Korrekturauftrag erlaubt das nicht; weder Merge noch Teststart erfolgt hier.** Sichere Übernahme und ein erneuter E2E-Start brauchen einen gesonderten Auftrag. Bei späterem main-Stand zunächst dessen aktuelle Regeln lesen.
2. Kostenloses GitHub-Actions-Restkontingent und Ausgabenlimit sowie Vercel-Hobby-Plan/Kontingent im bestehenden Konto prüfen. Für einen maximalen Ablauf bis zu 36 Runner-Minuten zuzüglich Installation/Abrechnungspuffer einplanen; keine kostenpflichtigen Zusatzprodukte/Trial starten. Bei unklaren Limits nicht dispatchen. Dieser Auftrag hat keinen lesenden Billing-/Vercel-Konto-Zugang. Damit der Vorbereitungs-PR keine unbekannten Actions-Kosten auslöst, enthält sein Commit `[skip ci]`; PR-CI ist ausdrücklich noch nicht ausgeführt und kann einen ausstehenden Pflichtcheck hinterlassen. Lokale Prüfung ersetzt keine spätere Actions-Abnahme.
3. Im Vercel-Dashboard verifizieren: vorhandenes Projekt `interaktive-wissens-und-lernplattform/wunderkompass`, verknüpftes Repository Arizona2k/wunderkompass, tatsächlicher Produktionsbranch, vorhandener test-live-Alias und Schutzumfang. Der neue Run-Branch darf weder Produktionsbranch noch Aliasquelle einer bestehenden Website sein. Bestehenden Schutz nur lesen. Standard Protection mit Vercel Authentication unterstützt geschützte Previews auf Hobby; die tatsächliche Konfiguration muss geprüft werden.
4. Vorherigen erfolgreichen Entwicklungsstand festhalten: test-live-SHA, bestehende erfolgreiche Deployment-ID, unveränderliche Deployment-URL und tatsächlicher Entwicklungsalias im zugriffsgeschützten Abnahmeprotokoll. Keine Geheimlinks, Cookies, Benutzerpässe oder Zugangsschlüssel ins Repository. Deployment nicht löschen; Vercel-Retention beachten. Git-Commit bleibt zusätzlich in test-live erhalten. Ein Git-Backup allein garantiert keine zeitlich unbegrenzte Hosting-Aufbewahrung.
5. Nach gesonderter Freigabe den Eigentümer den manuellen Workflow starten lassen, ausschließlich auf main mit `ISOLATED_PREVIEW_NO_COST`. Ablauf nach dem 16. Oktober benötigt erneute reviewte Befristung. Dieser Test erteilt keine Freigabe für automatische Veröffentlichung.

## Abnahme des tatsächlichen Deployments

Ein alter Vercel-success-Commitstatus ist unzureichend, weil derselbe Commit schon auf test-live bereitgestellt wurde. Der Beobachter verlangt einen **neuen** Datensatz vom `vercel[bot]`, mit genau Run-Branch, Kandidaten-SHA, Zeit nach Beginn des Pushs und Preview-Umgebung ohne production_environment. Er verwendet den neuesten, ebenfalls vom Vercel-Bot erstellten Status des neuesten passenden Datensatzes; ein früherer Erfolg verdeckt keinen Fehler. GitHub-Status `success` bleibt ein Teilnachweis, keine vollständige E2E-Freigabe.

Im bestehenden Vercel-Dashboard zusätzlich prüfen und dokumentieren:

| Nachweis | Erforderlicher Befund |
| --- | --- |
| Auslöser | Git-Push durch den konkreten Actions-Run mit Jobtoken; kein Benutzerpush, Deploy-Hook oder CLI-Redeploy für den Testbranch |
| Zuordnung | richtiges Projekt, Preview, Run-Branch und volle 40-stellige SHA `4b73cdb4ab049bcfe227fd43f07c80e8ffe68b0f` |
| Autor / Build | Eigentümer erkannt; Deployment READY; Buildlog erfolgreich, richtige Build-/Installbefehle und Ausgabe dist/ |
| Frische | neue Deployment-ID mit zeitlichem Bezug zum protokollierten Push; URL aus diesem Datensatz, keine alte test-live-URL |
| Commitgleichheit | Actions-Quality-SHA = Git-Push-SHA = Remote-Branch-SHA = Vercel-Git-SHA. Auch bei identischem Anwendungsbaum ist eine abweichende Commit-SHA keine erfolgreiche Abnahme. |

Falls Vercel dieselbe SHA auf dem neuen Branch nicht neu deployt, fehlt ein frischer Nachweis. Das ist **kein** Beweis, dass GITHUB_TOKEN prinzipiell ungeeignet ist. Dann zuerst Branchfilter, Ignored Build Step, Autorprüfung, Integration, Kontingent und Wiederverwendung identischer Commits lesend untersuchen. Keine künstlichen Autoränderungen oder ungeprüften Commits erzeugen. Ein frischer Eigentümerkommit wäre ein eigener späterer Test.

## Browserprüfung ohne neue Zugangsschlüssel

Die Actions-Probe prüft den Kandidaten lokal im Browser. Den geschützten Remote-Build prüft der Eigentümer anschließend über seine bestehende berechtigte Vercel-Browsersitzung. Es werden keine Sitzungen exportiert, kein Bypass-Token erstellt und kein Zugangsschutz abgeschaltet. Ohne diese berechtigte Sitzung bleibt der Remote-Funktionstest offen.

1. Exakte neue Deployment-URL in einem frischen privaten Browserfenster ohne Anmeldung öffnen. Login-/Sperrseite muss erscheinen und die Lernwelt darf nicht bedienbar sein. `/world.json`, `/learning-worker.js` und eine im Buildlog bekannte JS-Datei dürfen ohne Berechtigung ebenfalls nicht als App-Inhalt abrufbar sein. Loginseite mit HTTP 200 ist kein App-Erfolg; 401/403 allein beweist nicht den korrekten Schutz. Sperrseite und Projekt-/Schutzkonfiguration gemeinsam beurteilen. Keine Auth-Seiten/Cookies in CI-Artefakte übernehmen.
2. Dieselbe unveränderliche URL in der bestehenden berechtigten Sitzung öffnen. Titel „WunderKompass · Die große Abenteuerwelt des Wissens“, Globus und aktivierter Entdeckerpass-Button müssen erscheinen. Keine Schutz- oder Zahlungseinstellungen ändern.
3. Desktop 1440×900 und Smartphone 390×844: Suche Elefant/Elefamt, leere Treffer, Direktlink `#world/topic/animal-polar-bear`, Tierbild dekodiert, Mini-Frage bedienbar, vier Lernhubs, Memory mit falschem/richtigem Paar und Reload. Ausschließlich frischen synthetischen Lernstand verwenden; vorhandene echte Pässe weder importieren noch zurücksetzen. Keine horizontalen Überläufe oder eigenen JS-/HTTP-Fehler. Konsolenauszüge auf personenbezogene Angaben prüfen, keine Profile speichern.
4. Zurück/Vor und Neuladen prüfen; Favorit in diesem synthetischen Stand bleibt erhalten. Offline-Hinweis: Die lokale vollständige Offlineprobe umgeht keinen Vercel-Schutz. Eine zusätzliche Remote-Offlinevorbereitung kann geschützte Inhalte lokal zwischenspeichern; sie ist hier nicht erforderlich und wird nicht als Zugriffssperre nach Widerruf behauptet.
5. Vorherige Entwicklungs-URL separat erneut öffnen: gleiche vorherige SHA/Deployment-Zuordnung und weiterhin nutzbar. Danach nur die isolierte Test-URL als erfolgreich geprüft vermerken; keinen Alias umhängen, kein test-live/main-Update und keine Promotion.

Protokollfelder: Actions-Run/Attempt und Ergebnis, Quality-SHA, Remote-SHA, Vercel-Projekt/Deployment-ID/Buildstatus/Git-SHA, gesperrter und berechtigter Browserbefund mit Version/Größen, vorheriger Entwicklungsstand unverändert, tatsächlich geprüfte kostenlose Kontingente. Gesamtresultat erst nach allen Feldern `BESTANDEN`; bis dahin `OFFEN` bzw. `FEHLGESCHLAGEN`.

## Fehler, Erhaltung und Bereinigung

- Rechtefehler, Namenskollision, geänderte Basis oder rote Quality: Schreib-/Folgeschritte stoppen. Fehler bei Deployment, Timeout, falscher SHA/Umgebung, Auth-Sperre für den berechtigten Eigentümer oder Browserfehler: keine Freigabe. Kein automatischer Retry; unbekannter Zustand ist kein Erfolg.
- Authentifizierungsfehler oder fehlender GitHub-Deployment-Datensatz können reine Beobachtungsgrenzen sein. Dashboard lesen, bevor man fehlenden Trigger oder Tokenbedarf behauptet. Fehlerhafte Builds anhand des tatsächlichen Buildlogs untersuchen; Git-Transfer-Erfolg ersetzt keinen Build.
- Es wird absichtlich kein fehlerhafter Build remote veröffentlicht, um die Fehlererkennung zu testen. Lokale Tests simulieren fehlende/pending/error/failure/inactive Deployments, falsche Quelle/SHA, Production und alte Erfolge. Ein tatsächlicher Vercel-Fehler ist erst mit Remote-Log nachgewiesen.
- Der alte erfolgreiche Entwicklungsbranch und seine Website werden nie ersetzt. Daher braucht der isolierte Test keinen produktiven Rollback. Er beweist noch keinen Rückfall eines später veränderten stabilen test-live-Alias; der bleibt Voraussetzung für die spätere automatische Kette.
- Testbranch und Deployment zunächst für Abnahme erhalten. Bei Abbruch kann der Branch bereits existieren: Run-Name/SHA lesen, niemals fremde SHAs löschen. Spätere ausdrücklich beauftragte Bereinigung nur mit exakter Lease: `git push --force-with-lease=refs/heads/wk-vercel-e2e-RUN-ATTEMPT:4b73cdb4ab049bcfe227fd43f07c80e8ffe68b0f origin :refs/heads/wk-vercel-e2e-RUN-ATTEMPT`. Platzhalter zuerst mit dem echten Run ersetzen. Deployment im Dashboard getrennt prüfen; Branchlöschung garantiert keine Deploymentlöschung. Keine automatische Daten-/Deploymentbereinigung.

## Grenzen und Quellen

Kein zusätzlicher Token ist im vorbereiteten Verfahren enthalten. Ob die bestehende Integration ohne weiteren Token ausreicht, wird erst durch den tatsächlichen Run plus Browserabnahme bewiesen. GitHubs Unterdrückung weiterer Actions-Pushworkflows bei GITHUB_TOKEN sagt allein nichts über die externe Vercel-App aus. Ein PAT behebt auch keine fehlende Hobby-Autorberechtigung. Keine Ersatzcredentials auf Verdacht anlegen.

Offizielle Quellen, am 9. Oktober 2026 gelesen:

- [GITHUB_TOKEN und Triggergrenzen](https://docs.github.com/en/actions/concepts/security/github_token)
- [Vercel Hobby: Commit-Autor und Login-Verbindung](https://vercel.com/docs/deployments/troubleshoot-project-collaboration)
- [Branchbezogener Deployment-Ausschluss](https://vercel.com/docs/project-configuration/git-configuration)
- [Deployment Protection](https://vercel.com/docs/deployment-protection)
- [Vercel Hobby](https://vercel.com/docs/plans/hobby)

Der Vorbereitungsbranch ist bereits im ersten gepushten Commit ausschließlich für seinen eigenen Namen von Vercel-Autodeploy ausgeschlossen. Der spätere Run-Branch enthält den bestehenden Kandidaten mit dessen ursprünglicher Vercel-Datei, also keine neue allgemeine Deaktivierung. Vercel-Kontozugang, geschützter Remote-Browser, Kontingente und neue E2E-Deploymentnachweise sind in dieser Vorbereitung noch nicht verfügbar.
