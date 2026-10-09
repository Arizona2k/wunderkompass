# Migration von WunderKompass zu GitHub, Codex und Vercel

## Aktueller Stand nach dem GitHub-Import

Stand: 9. Oktober 2026. Das private Repository [Arizona2k/wunderkompass](https://github.com/Arizona2k/wunderkompass) ist angelegt und in dieser Codex-Cloud-Aufgabe ausgecheckt. Seine Wurzel entspricht bereits dem früheren `project/`. Die Schritte 4 und 5 unten sind die historische Ersteinrichtungsanleitung: im bestehenden Checkout **kein erneutes git init und keine Ersetzung von origin** durchführen. Auch das Sicherungsarchiv nicht erneut über den vorhandenen Stand kopieren.

Für die Weiterentwicklung gelten [AGENTS.md](AGENTS.md), [PROJECT_STATE.md](PROJECT_STATE.md), [VISION.md](VISION.md), [BACKLOG.md](BACKLOG.md) und [QUALITY.md](QUALITY.md). Ein GO verwendet den gespeicherten Aufgabenbestand auf einem Entwicklungsbranch. Die Einrichtung wird als separater Pull Request gesichert; main bleibt unverändert. Vor dem ersten GO auf main den Einrichtungs-PR regulär übernehmen oder die Cloud-Aufgabe auf dessen Branch starten. Werkzeuge/Prüfergebnisse und Zugriffshindernisse stehen in PROJECT_STATE.md.

Vercel, externe Testpersonen und geplante Durchläufe sind weiterhin spätere, gesondert beauftragte Schritte. Kein Deployment oder Scheduler ist durch diese Anleitung aktiviert. Persönliche Pässe vor jedem Domainwechsel sichern; Testdaten und echte Notizen nicht veröffentlichen.

## Historische Export- und Umzugsanleitung

Stand: 9. Oktober 2026. Diese Anleitung bereitet den Umzug vor. Die bestehende ChatGPT Site bleibt erhalten. In diesem Auftrag wurden keine neuen Veröffentlichungen oder externen Repositories angelegt.

## 1. Sicherung herunterladen und entpacken

Das ZIP vollständig herunterladen und entpacken. Die Ordner `original-site/` und `project/` nicht zusammenführen. Eine zusätzliche unveränderte Kopie des ZIP aufbewahren. `project/` enthält die vorbereitete Anwendung; `original-site/` ist die bytegleiche Rückfallkopie des bisherigen Quellstands.

## 2. Eigenen Entdeckerpass sichern

Auf der bisherigen Adresse `https://erde-entdecker.rahmati-nima92.chatgpt.site` im tatsächlich verwendeten Browser den **Entdeckerpass** öffnen und die Sicherung herunterladen. Den Buttonnamen in der Oberfläche beachten. Die vorhandene JSON-Sicherungsfunktion verwenden, keine Browserdaten löschen und keinen Pass zurücksetzen.

Jeder Browser und jedes Gerät kann einen anderen Pass besitzen. Diese JSON-Datei enthält auch eigene Notizen und Zeitstempel. Sie gehört in deine persönliche Ablage, **nicht in GitHub und nicht in das öffentliche Projektarchiv**. Die neue Adresse kann den alten browserlokalen Speicher nicht auslesen. Auch `localhost` und verschiedene Vorschau-Domains sind eigene Speicherorte.

## 3. Anwendung auf dem eigenen Computer prüfen

Node.js 24 installieren und ein Terminal im Ordner `project/` öffnen. Die Node-Version ist wichtig: Die vorhandenen Node-Tests nutzen die neuere Modul-Hook-Unterstützung.

```bash
node --version
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run lint
pnpm test
pnpm run build
pnpm run start
```

Die angezeigte lokale Adresse öffnen. Startseite, Globus, eine Lernreise, eine Tierkarte und ein Spiel bedienen. `pnpm run dev` ist der normale Entwicklungsstart. Keine `.env` oder API-Schlüssel für den bestehenden Lernbetrieb erforderlich.

## 4. GitHub anlegen

Auf GitHub ein eigenes Repository, beispielsweise `wunderkompass`, anlegen. Für die erste Übergabe ist ein privates Repository zweckmäßig. Wenn du die folgenden Git-Befehle verwendest, das neue Repository **ohne** vorab erzeugte README, Lizenz und `.gitignore` erstellen. Git muss installiert und deine GitHub-Anmeldung eingerichtet sein.

Im Terminal weiterhin im Ordner `project/`:

```bash
git init -b main
git add .
git commit -m "Import WunderKompass from verified Site backup"
git remote add origin https://github.com/DEIN-GITHUB-NAME/wunderkompass.git
git push -u origin main
```

`DEIN-GITHUB-NAME` durch den tatsächlichen GitHub-Namen und gegebenenfalls den Repository-Namen ersetzen. Alternativ GitHub Desktop verwenden und den Ordner `project/` als neues Repository übernehmen. Dateien wie `.gitignore` und `.node-version` mit übernehmen. Nicht `node_modules`, Browserprofile, Spielstand-Sicherungen oder Zugangsdaten hochladen. Die vorhandene `.gitignore` hält generierte Arbeitsdateien aus dem Repository.

Der Quellstand hat bewusst einen neuen ersten GitHub-Commit. Die frühere Sites-Git-Historie und das authentifizierte Sites-Remote sind nicht enthalten. Die Herkunft ist über den ursprünglichen Commit und die Dateiprüfsummen dokumentiert.

## 5. Codex mit dem Repository verbinden

GitHub-Repository zunächst erfolgreich hochladen. In ChatGPT auf dem Web oder Desktop **Work in → Cloud → Select environment → Create environment** wählen. Dein GitHub-Konto verbinden, das konkrete Repository auswählen und die Projektvorbereitung starten. Die Bezeichnungen können sich ändern; maßgeblich sind die unten verlinkten offiziellen Anleitungen. Auf dem Mobilgerät kann eine bereits vorbereitete Umgebung ausgewählt werden; die erstmalige Einrichtung erfolgt nach aktueller Dokumentation auf Web/Desktop.

Codex soll Node.js 24 und pnpm 11.25.0 bereitstellen und Folgendes im Repository ausführen:

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run lint
pnpm test
pnpm run build
```

Paketmanager-Zugriff für die Ersteinrichtung erlauben. Es sind keine App-API-Schlüssel erforderlich. Die erfolgreiche Umgebungsvorbereitung prüfen und die **Umgebung** speichern/veröffentlichen. Das veröffentlicht noch keine neue Lernwebsite. Danach eine Aufgabe in dieser Umgebung starten. Lies `AGENTS.md` und `PROJECT_STATE.md`, damit Codex den Stand und das Speicherformat kennt.

Geeignete erste Aufgabe:

> Lies README.md, MIGRATION.md, PROJECT_STATE.md und AGENTS.md. Installiere mit dem vorhandenen Lockfile. Prüfe TypeScript, Lint, Tests und Build. Starte die vorhandene Anwendung und berichte über konkrete Fehler. Erhalte IDs und Entdeckerpass. Veröffentliche noch nichts und baue die Lernplattform nicht neu.

Künftige Arbeit über Git-Commits beziehungsweise Pull Requests sichern. Den aktuellen Stand und nächsten Schritt in `PROJECT_STATE.md` halten, damit ein späteres „Weiter“ an überprüfbarem Projektstand anknüpft.

## 6. Vercel vorbereiten

Erst nach erfolgreicher lokaler/Codex-Prüfung das GitHub-Repository in Vercel importieren. Das ist ein späterer Schritt und wurde hier **nicht ausgeführt**. Die bisherige Sites-Adresse bleibt unabhängig davon erreichbar.

| Einstellung | Wert |
| --- | --- |
| Repository-Wurzel | `project/` ist selbst die GitHub-Wurzel; dann keine zusätzliche Root Directory einstellen. Falls du das gesamte Sicherungsverzeichnis hochgeladen hast, ausdrücklich `project` wählen. |
| Framework Preset | **Vite**, auch wenn historische Next-Dateien enthalten sind |
| Node.js | **24.x** |
| Install Command | `corepack pnpm install --frozen-lockfile` |
| Build Command | `pnpm run build` |
| Output Directory | `dist` |
| Environment Variable | `ENABLE_EXPERIMENTAL_COREPACK=1` für Preview und Production |

`vercel.json` enthält Framework, Install-/Build-Befehl, Ausgabe und Cache-Regeln für den Offline-Worker. Das Corepack-Flag ist eine Build-Einstellung, kein Geheimnis. Bei einer Meldung über fehlendes Corepack die aktuelle Vercel-Paketmanager-Anleitung prüfen; Lockfile und Paketversion nicht beiläufig ändern.

Kein eigener Datenbankserver oder Worker notwendig: Die aktive Anwendung wird statisch ausgeliefert. Die alten Cloudflare-/Connector-/Auth-Beispiele sind keine portierte API. HTTPS und Betrieb auf der Domain-Wurzel `/` verwenden; Unterordnerhosting benötigt zusätzliche Pfad-/Service-Worker-Anpassungen und wurde nicht vorbereitet. Die Navigation verwendet weiterhin `#world/topic/...` und andere Hash-Pfade.

Die Vercel-Testadresse in einem frischen Browser öffnen. Wenn externe Tester Zugriff bekommen sollen, Vercels tatsächliche Zugriffs-/Deployment-Protection-Einstellungen prüfen; ein privates GitHub-Repository allein bestimmt die Sichtbarkeit der Website nicht. Erst danach eine endgültige Domain oder Produktionsfreigabe festlegen. Preise und Kontolimits wurden nicht als kostenlose Dauerzusage geprüft.

## 7. Spielstand auf der neuen Adresse übernehmen

Entdeckerpass auf der **endgültigen neuen Adresse** öffnen, die persönliche Sicherungsdatei auswählen und den vorhandenen Importdialog bestätigen. Ein Import ersetzt den lokalen Pass der Zieladresse; deshalb auch dort vorhandene Stände vorher sichern. Favoriten, Kapitel und Einstellungen prüfen, neu laden und „Fortsetzen“ bedienen. Den alten Pass und die alte Site zunächst behalten. Vorschau-Adressen teilen ihren Speicher nicht automatisch mit der endgültigen Domain.

## 8. Abnahme und weiterer Betrieb

Globus mit normalem Seitenscrollen und aktivierter Drehsteuerung, Länderwahl, Lernreise, Suche, Spiel, Import/Export und Bilder prüfen. Auf der neuen Domain „Für offline vorbereiten“ vollständig abschließen; dann den Browser schließen und offline erneut öffnen. Offline-Caches der alten Domain werden nicht mitkopiert.

Echte iPhone-/iPad-/Android-Tests, gehörte deutsche Stimme, Safari/Firefox und Screenreader bleiben notwendig. Die natürliche Stimme hängt vom Zielbrowser/Betriebssystem ab. Ein erfolgreicher lokaler statischer Build ist keine bereits erfolgte Vercel-Veröffentlichung.

Die alte Site erst dann ändern oder stilllegen, wenn du dies später ausdrücklich entscheidest. Dieser Export führt keine solche Aktion aus.

## Offizielle Quellen

Am 9. Oktober 2026 zur Anleitung abgeglichen:

- [GitHub: lokalen Quellcode übernehmen](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)
- [OpenAI: Codex Cloud einrichten](https://developers.openai.com/codex/cloud)
- [OpenAI: Cloud-Umgebungen](https://developers.openai.com/codex/environments/cloud-environments)
- [Vercel: Vite](https://vercel.com/docs/frameworks/frontend/vite)
- [Vercel: Build, Corepack und Projektwurzel](https://vercel.com/docs/builds/configure-a-build)
- [Vercel: unterstützte Node-Versionen](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
