# WunderKompass – Projektsicherung und Übergabe

Stand: 9. Oktober 2026 · Quellstand der bestehenden ChatGPT Site, Version 14.

**Der vollständige aktuelle, versionierte Quellcode ist gesichert. Die bestehende Website wurde weder geändert noch neu veröffentlicht.** Die Sicherung enthält eine unveränderte Originalkopie und eine separat vorbereitete, eigenständig baubare Exportkopie.

## Welchen Ordner brauche ich?

| Ordner/Datei | Zweck |
| --- | --- |
| `original-site/` | Alle 304 Dateien des originalen Quellstands, bytegleich gesichert. Nicht als Vercel-Projekt auswählen. |
| `project/` | Für GitHub und Codex vorbereitete Anwendung. Dieser Ordner ist die spätere Repository-Wurzel. |
| `project/exports/content/` | 32 JSON-/GeoJSON-Inhaltsdateien plus Inhaltsindex und Prüfsummen. |
| `MIGRATION.md` | Schritte für GitHub, Codex, Vercel und den Entdeckerpass. |
| `INVENTAR.md`, `source-files.csv`, `assets.csv` | Architektur, Funktionen und vollständige Datei-/Medieninventur. |
| `DEPENDENCIES.md`, `dependencies.json` | Deklarierte und tatsächlich installierte direkte Abhängigkeiten. |
| `PRUEFBERICHT.md`, `verification/` | Tatsächlich ausgeführte Prüfungen mit Grenzen und Protokollen. |
| `original-manifest.json`, `SHA256SUMS.txt` | Herkunft und Dateiintegrität. |

Für GitHub **den Inhalt von `project/` verwenden**, nicht beide Anwendungskopien übereinanderkopieren. Original-Sicherung und ZIP aufbewahren.

## Lokaler Start

Node.js 24 und pnpm 11.25.0 verwenden. Zuerst in `project/` wechseln. Falls pnpm noch fehlt:

```bash
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm run dev
```

Die vom Terminal angezeigte Adresse öffnen, normalerweise `http://127.0.0.1:5173`. Der erste Download der Pakete braucht Internet. In der Entwicklungsansicht ist die Offline-Vorbereitung bewusst nicht aktiv.

```bash
pnpm run typecheck
pnpm run lint
pnpm test
pnpm run build
pnpm run start
```

Der Produktionsbuild liegt unter `dist/`. `pnpm run start` zeigt ihn gewöhnlich unter `http://127.0.0.1:4173`. Die Offline-Vorbereitung lässt sich dort über den echten Button prüfen. `index.html` nicht einfach per Doppelklick öffnen: Karten, Module und Service Worker brauchen HTTP/HTTPS.

## Was gehört dazu?

108 Wissenskarten: 24 Tiere, 31 historische Themen, 18 Menschen, zwölf Erfindungen, acht Bauwerke, 15 Wissenschaftsthemen. Dazu die 3D-Erde, 242 Kartenobjekte einschließlich abhängiger Gebiete, 16 Lernreisen mit 80 Kapiteln, sechs Wissensrouten, 30 Spielangebote, elf Erd-Labore, neun zusätzliche Wissenschaftsmodelle, zwölf Globusmissionen, sechs Versuche, 76 Quizfragen, 90 Wissenswörter und 30 Warum-Fragen. Diagramme, Animationen und Interaktionen liegen in den Komponenten; sie benötigen keine zusätzlichen Bilddateien.

Alle 91 öffentlichen Dateien einschließlich 84 Bild-/SVG-Dateien und der Mediennachweise sind enthalten. Viele Icons entstehen aus `lucide-react`. Es gibt keine verpflichtende Canva-/ElevenLabs-Anbindung und keine geheimen API-Schlüssel für den Lernbetrieb.

## Was wurde ausschließlich in der Exportkopie angepasst?

Die aktive Anwendung ist eine clientseitige React-Lernwelt. Die Sites-Version startet über Vinext/Cloudflare. In `project/` übernehmen ein gewöhnlicher Vite-Einstieg, ein Anker-Adapter für den vorhandenen Startseiten-Link und eine Vercel-Konfiguration den Betrieb. App-Komponenten, Wissensdaten, Original-IDs und Speicherformat wurden erhalten. Der gleiche Offline-Worker bekommt weiterhin einen passenden Versions-Fingerabdruck. Die Sites-Zuordnung ist in der Exportkopie entfernt; in `original-site/` bleibt sie erhalten.

Alle Unterschiede stehen in `migration-changes.json`. Die bereits vorhandenen Framework-/D1-/Connector-Beispieldateien bleiben als inaktive Quellen erhalten. Sie sind kein eingerichteter Backend-Dienst. Die ursprünglichen Abhängigkeitsversionen und das pnpm-Lockfile wurden übernommen; eine Paketbereinigung ist kein Teil dieser Sicherung.

## Lernfortschritt und Grenzen

Der Pass liegt in IndexedDB und localStorage des jeweiligen Browsers. Er ist **nicht** Bestandteil dieses Quellcodeexports. Eine neue Domain besitzt einen eigenen Speicher. Vor einem Umzug den Pass auf der alten Adresse sichern und auf der neuen Adresse importieren; Details in `MIGRATION.md`.

Git-Historie, Zugangsdaten, Cookies, persönliche Browserprofile, fremde externe Webseiten und nicht gespeicherte Canva-Entwürfe gehören nicht zum Export. Alle aktuell versionierten Projektdateien sind enthalten. Dieser Auftrag erstellt noch kein GitHub-Repository, keine Codex-Umgebung und keine Vercel-Veröffentlichung.
