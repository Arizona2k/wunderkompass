# Datei-, Architektur- und Funktionsinventur

Gesicherte Site-Version: **14**. Ursprünglicher Commit: `7b93a5c53fcd42d46b310252b6a4a3cf5622fbe7`. Erfasst wurden **304 versionierte Dateien mit 17,680,743 Bytes**. Keine fehlenden Dateien oder Symlinks im Quellstand. `source-files.csv` und `original-manifest.json` listen jede einzelne Datei mit Größe und SHA-256.

## Struktur

| Bereich | Bestand und Aufgabe |
| --- | --- |
| `app/` | 66 Dateien: Seiten-Einstieg, Lernoberfläche, Geografie, Globus, Lernreisen, Spiele, Wissensbuch, neue Welten und zentrale Speicherlogik. |
| `components/` | 62 Dateien: bestehende UI-Primitiven und Connector-Fehlerkomponente. |
| `public/` | 91 Dateien: 19 SVG, 59 WebP, drei PNG, drei JPEG sowie Karten-/Lizenz-/Manifestdaten. |
| `content/` | Zehn Dateien: Autoren-/Importskripte, Quellenauswahl und redaktionelle Forschungsdaten. |
| `tests/` | 21 ursprüngliche Dateien: Node-Tests, Fixtures und historische Browserprüfungen. |
| `build/`, `scripts/` | Sieben beziehungsweise 14 ursprüngliche Dateien für Sites-Betrieb, Offline-Erzeugung und Installation. |
| `db/`, `drizzle/`, `examples/` | D1-/Drizzle-Gerüst und Beispiele; keine aktive Lerndatenbank. |
| `lib/`, `hooks/`, `vendor/` | Hilfsfunktionen, Connector-Gerüst, Mobil-Hook und lokale CSS-/Lizenzdateien. |
| Neue Exportdateien | Vite-Einstieg, Vercel-Konfiguration, Inhaltsexport, portable Browserprobe und Übergabedokumentation. |

## Technologie

React 19.2.6, TypeScript 5.9.3, Tailwind 4.2.1 und lokales CSS; Three.js 0.186.1 mit OrbitControls für 3D; d3-geo 3.1.1 für Projektionen; lucide-react 1.31.0 sowie vorhandene shadcn/Base-UI/Radix-Komponenten. Originalbetrieb: Vinext 1.0.0-beta.5, Vite 8.0.13, Next-kompatibles App-Gerüst, Cloudflare Vite-Plugin und Wrangler. Exportbetrieb: Vite 8.0.13 mit React-Plugin und statischem `dist/`; kein Sites-Zugang nötig. Node 24 und pnpm 11.25.0 wurden für den Export verwendet.

Alle 26 direkten Runtime- und 22 direkten Entwicklungsabhängigkeiten sind in `dependencies.json` mit deklarierter und installierter Version erfasst. Das ursprüngliche Lockfile sichert auch transitive Auflösung und Paketintegritäten. Plattformpakete wurden in der Kopie bewusst nicht durch eine beiläufige Bereinigung entfernt.

## Seiten und Wissenswelten

Es gibt einen App-Einstieg `/` und eine clientseitige Navigation. Die Hauptmodi sind Weltkugel, Erdschichten, Tag & Nacht, Quiz, Lernreisen, Spielplatz, Wissensbuch, Forscherlabor und zusätzliche Welten. Die Hash-Navigation hält Direktlinks und Browser-Zurück; sie ist keine Sammlung serverseitiger Einzelseiten.

| Bestand | Inhalt und primäre Quellen |
| --- | --- |
| Geografie | 242 GeoJSON-Kartenobjekte, sieben Kontinente, fünf Ozeane, Orientierungs-/Naturlayer, Hauptstädte, Länder-Metadaten, Meeres- und Plattenregionen; `earth-data.ts`, `nature-data.ts`, JSON und `public/world.json`. 242 Kartenobjekte sind ausdrücklich nicht 242 souveräne Staaten. |
| Lernreisen | 16 Reisen, 80 Kapitel, Kapiteldiagramme und lokale Illustrationen/Fotos; `learning-data.ts`, `expanded-learning-data.ts`, `chapter-visual.tsx`, Reise-Komponenten. |
| Tierwelt | 24 Karten mit Bildern, Verbreitungs-Beispielorten, Nahrung, Verhalten, Schutz und Mini-Fragen. |
| Zeitreise | 31 Themen, Datierung, sensible Einstiegshinweise, Kontextfolgen, Querverbindungen. |
| Große Köpfe | 18 Personen mit lokalen Porträts/Darstellungen und Beiträgen im fachlichen Zusammenhang. |
| Erfindungen | Zwölf Karten, Problem-/Entwicklungsfolge, Bauteilzeichnungen und Früher-/Heute-Vergleich. |
| Bauwerke | Acht Karten, Standorte, Maße, ausgewählte Bauphasen und Brücken-/Schleusenmodelle. |
| Wissenschaft | 15 Karten; neun zusätzliche Modelle zu Atmosphäre, Magnetfeld, Strömungen, Motor, Nahrung, Schall, Planetenmaßen, Energie und Musterregeln; weitere vorhandene Modelle erhalten. |
| Wissensrouten | Sechs Routen mit je fünf Stationen; `world-index.ts`. |
| Spiele | 30 Angebote in `game-index.json` und Spiele-Komponenten. Regeln, dynamische Fragen, Zufallsauswahl und Auswertung bleiben im Quellcode; JSON allein ersetzt den Spielcode nicht. |
| Forscherlabor | Elf Erd-Labore; sechs Versuche zu Hause; zwölf Globusmissionen. |
| Wissensbuch | 90 Wörter, 30 Warum-Fragen, Naturatlas, Interessen und lokale Notizen. |
| Pass | Fortschritt, Stempel/Abzeichen, Runden, Einstellungen, Export/Import, Wiederholen und Fortsetzen. |
| Eltern/Hilfe | Erläuterungen, Bedienhinweise, Quellen, Speicher- und Vorlese-Hinweise. |

## Speicher und Datenmodelle

| Speicher/Dienst | Tatsächlich eingerichtet | Migration |
| --- | --- | --- |
| IndexedDB | Datenbank `earth-explorer`, Version 1; Object Store `saves`, Hauptschlüssel `main`. | Browsergebunden; persönlichen Pass separat exportieren/importieren. |
| localStorage | Journal `erde-entdecken:save:v3`; kompatibles Lesen des älteren `erde-entdecken:forscherpass:v2`. | Namenswechsel entfernt diese Schlüssel nicht; Domainwechsel benötigt Import. |
| Gemeinsamer Store | `local-progress-store.ts`, Schema 3, Epoch-/Revisionsbehandlung und Tab-Abgleich. | Unverändert übernommen; kein zweiter Speicher für neue Welten. |
| Cache Storage / Service Worker | `earth-learning-<build>`, Marker der vollständigen Vorbereitung, lokale Lernmedien und Code. | Auf neuer Domain neu vorbereiten. Kein persönlicher Cloud-Speicher. |
| Cloudflare D1 / R2 | `.openai/hosting.json`: beide `null`; `db/schema.ts` leer. | Keine Datenbank-/Bucket-Inhalte als vorhanden behauptet; Quellgerüst gesichert. |
| Auth / Connectors | Plattformgerüst vorhanden, von der aktiven Lernwelt nicht verwendet. | Keine Login- oder Connector-Sitzungen übertragen; statischer Export benötigt sie nicht. |
| Vorlesen | Web Speech API, deutsche Browser-/Systemstimmen; lokale Notizen nur mit lokaler Stimme. | Keine Audiodatei-Bibliothek; Stimme/Onlinebetrieb hängt vom Zielgerät ab. |
| Sound | Browser-Audio; keine externen Musik-/Tiergeräuschdateien im Quellstand. | Code gesichert, Gerätefreigaben können erforderlich sein. |
| Canva / ElevenLabs | Keine verpflichtende Laufzeitanbindung oder hinterlegte App-Schlüssel festgestellt. | Kein zusätzlicher Dienst erforderlich; nicht vorhandene Designs/Clips nicht behauptet. |

`WorldTopic`, `WorldEntry`, `WorldLocation`, `WorldQuestion` und `WorldActions` sind vollständig in `app/world-types.ts` erhalten. Der Katalog enthält IDs, Texte, Mini-Fragen, Fachquellen, verwandte Karten, Orte und kategorietypische Felder. `Save` enthält Appkennung, Schema-Version, Erstell-/Änderungszeit, `progress` sowie optional Epoch-/Revisionsfelder. `LocalProgress` enthält Entdeckungen, Reisen, Spiele, Missionen, Labore, Versuche, Favoriten/Orte, Kapitel, Wiederholungen, Notizen, Einstellungen, Quizrunden/-Ergebnisse, Spielrunden und letzte Aktivität. Wiederherstellung und Validierung stehen in `app/progress-storage.ts`.

## Medien, Icons und Animationen

Alle 84 Bild-/SVG-Dateien werden mit ursprünglichem Inhalt, Dateiformat, Dateigröße und Hash gesichert. `assets.csv` verknüpft verfügbare Bildbeschreibungen und Autoren-/Lizenzhinweise. Die originalen detaillierten Metadaten und Nachweise bleiben in den JSON-Dateien erhalten. Historische Personenporträts können ausdrücklich spätere Darstellungen sein. Lizenzhinweise der Flaggen, Unicode-/Plattendaten und CSS-Bestandteile bleiben erhalten. Die Sicherung überträgt keine neuen Rechte und ist keine pauschale juristische Freigabe.

Icons stammen vielfach aus Paketcode, Diagramme aus SVG-/React-Komponenten, die Kugel aus Three.js-Geometrie und Karten. CSS-Keyframes, Reglermodelle, OrbitControls und Animationen sind Quellcodebestandteile. Es gibt keine zusätzliche geheime Mediendatenbank. Quellenlinks zeigen auf fremde Webseiten; deren vollständiger Inhalt wird nicht mitgesichert.

## Gesichert und nicht gesichert

**Gesichert:** alle aktuellen versionierten Quell-, Konfigurations-, Komponenten-, Inhalts-, Medien-, Lizenz- und Testdateien; originales Lockfile; zusätzlich flache Inhaltsexporte, Architektur, Installationsanleitung, Provenienz und Integritätsnachweise.

**Nicht Teil des Archivs:** persönliche reale Browser-Spielstände/Notizen und Einstellungen, Cookies/Logins, Zugangstoken oder `.env`-Geheimnisse, Plattform-Serverinfrastruktur, nicht vorhandene Cloud-Datenbankdaten, Git-Historie, frühere veröffentlichte Build-Archive, externe Webseiten, Canva-Originalentwürfe, nie erzeugte Audiodateien, Paketmanager-Caches und Browser-Binärdateien. GitHub-/Codex-/Vercel-Konten und Deployments werden erst später eingerichtet.

Die 304 versionierten Dateien fehlen nicht. `node_modules` und `dist` werden bewusst nicht als Quellbestand gesichert: Sie werden mit Lockfile und Build reproduziert. Einige historische Autoren-/Browserprüfskripte enthalten Umgebungs- oder alte Arbeitsverzeichnis-Pfade; sie sind unverändert gesichert, aber nicht als universell lauffähige Werkzeuge bezeichnet. Die neue portable Browserprobe vermeidet diese feste Bindung.
