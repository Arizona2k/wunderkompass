# Sicherung und Migration – tatsächliches Prüfergebnis

Stand: 2026-10-09T13:00:13.240026+00:00.

## Ergebnis

**Vollständiger aktueller Quellcodeexport möglich und erstellt.** Alle **304 versionierten Dateien** des Quellstands `7b93a5c53fcd42d46b310252b6a4a3cf5622fbe7` sind bytegleich in `original-site/` enthalten. Die zusätzliche `project/`-Kopie ist mit eigenem Vite-Einstieg für GitHub, Codex und statisches Hosting vorbereitet. Die Original-Website blieb unverändert auf Version 14; Git-Status ist sauber. Die vorhandene Veröffentlichung wurde über Sites als aktiv und erfolgreich bestätigt. Es wurde in diesem Auftrag weder gepusht noch eine Website-Version gespeichert oder veröffentlicht.

Die Originalkopie umfasst alle Quellen, Komponenten, 108 Wissenskarten, Geodaten, Lernreisen, Spiele, Diagramme, Animationen, Medien, Nachweise, Konfigurationen und Tests. Die zusätzlichen 32 JSON-/GeoJSON-Inhaltsexporte enthalten keine persönlichen echten Browser-Spielstände. `INVENTAR.md` beschreibt die Speicherbereiche und Grenzen im Einzelnen.

## Ausgeführte Prüfungen

| Prüfung | Ergebnis |
| --- | --- |
| Vollständigkeit | 304/304 versionierte Dateien vorhanden; keine fehlenden Dateien oder Symlinks. |
| Bytegleichheit | SHA-256 aller Originaldateien mit der Originalkopie und dem unveränderten Checkout verglichen. |
| Abhängigkeiten | Saubere Installation mit dem übernommenen Lockfile; pnpm 11.25.0, Node 24.19.0; 651 Pakete installiert. Keine Übernahme vorhandener `node_modules` vorausgesetzt. |
| TypeScript | `pnpm run typecheck`: Exit 0. |
| ESLint | `pnpm run lint`: Exit 0. |
| Node-Tests | `pnpm test`: 20 bestanden, 0 fehlgeschlagen. |
| Produktionsbuild | `pnpm run build`: Exit 0; statischer `dist/` mit HTML, Code, Bildern und erzeugtem Offline-Worker. |
| Datenexport | 32 Inhaltsdateien plus Index erzeugt; 108 Karten, 16 Reisen, 80 Kapitel, 76 Quizfragen, 90 Wörter, 30 Warum-Fragen, sechs Routen. |
| Datenintegrität | Jede exportierte Inhaltsdatei als JSON geparst und gegen ihre SHA-256 geprüft; vollständiger Kartenkatalog mit Quelle identisch. |
| Browser | Chromium 153.0.8010.0, echter lokaler Produktionsbuild mit Software-WebGL. |
| Responsive | 21 Ansichten: Startseite und sechs Themenkarten bei 1440×900, 768×1024, 390×844; keine horizontalen Überläufe in diesem Ablauf. |
| Kernfunktionen | Globus-Canvas geladen; vier ursprüngliche Lernhubs geöffnet, Memory gestartet und Karte aufgedeckt. Favorit blieb nach Reload erhalten. |
| Offline | Echter Vorbereitungsbutton verwendet, vollständiger Cache mit 111 Einträgen. Browser geschlossen, dasselbe Testprofil ohne Internet neu gestartet: zuvor ungeöffnetes Tierbild und Energiemodell funktionieren. |
| Laufzeitfehler | Keine erfassten JS-Seitenfehler oder eigenen HTTP-Fehler im ausgeführten Browserablauf. Keine externen Requests im geprüften Ablauf. |
| Geheimnisse | Bekannte private Schlüssel-/Token-/authentifizierte-URL-Muster im versionierten Quellstand geprüft: kein Treffer. Keine `.git`-Metadaten, `.env`-Dateien, Cookies oder realen Browserprofile eingepackt. Dies ist keine Garantie jedes denkbaren Geheimnisformats. |
| ZIP | CRC-Prüfung, sichere eindeutige Archivpfade sowie SHA-256 der Originaldateien und aller im Manifest gelisteten Archivdateien bestanden. Die separate `.sha256`-Datei bezeichnet die endgültigen ZIP-Bytes. |

Protokolle und drei Screenshots liegen unter `verification/`. Die Browserprobe `project/tests/browser/portable-smoke.mjs` gehört zur Übergabe. Für eigene Browserprüfungen die optionalen Werkzeuge in `project/qa/` installieren und einen Chromium-Browser mit Playwright bereitstellen. Die historischen Tests in `tests/browser/` bleiben im Original vollständig gesichert, können aber alte feste QA-/Cloudflare-Pfade voraussetzen. Sie werden nicht als erneut vollständig ausgeführte Migrationstests ausgegeben.

## Was nicht behauptet wird

- Keine bereits erfolgte Übertragung in dein GitHub-Konto, Einrichtung deiner Codex-Umgebung oder Vercel-Veröffentlichung. Es fehlt nicht der Code, sondern diese spätere Konto-/Hosting-Einrichtung.
- Kein Zugriff auf deine echten Browser-Pässe. Vor Domainwechsel persönlich sichern und über die bestehende Importfunktion übertragen. Notizen und Passdateien niemals öffentlich hochladen.
- Keine Cloud-Datenbank-/R2-Inhalte: Im Projekt sind D1 und R2 nicht eingerichtet; Schema ist leer. Vorhandene opt-in Beispiele sind Quellen, keine Bestandsdaten.
- Kein Export der Sites-Serverinfrastruktur, Zugangstoken, Git-Historie, früheren Build-Archive, fremden Quellenwebseiten, nicht gespeicherter Canva-Entwürfe oder nicht vorhandener ElevenLabs-Audios.
- Keine neue komplette fachliche oder pädagogische Prüfung aller Texte. Die Sicherung erhält den bestehenden Stand; das vorhandene `QA.md` bleibt als historische Produktprüfung enthalten.
- Keine physischen Geräte-, Safari-/Firefox-, Screenreader- oder gehörten Stimmtests und keine gemessenen Core Web Vitals. Die Drei-Größen-Prüfung nutzt Chromium, keine echten Geräte.
- Build-Warnungen zu großen Chunks und einer wirkungslosen dynamischen Importaufteilung bestehen weiterhin. Sie verhindern den erfolgreichen Build nicht; keine unbelegte Performance-Freigabe.

## Nächster sinnvoller Schritt

ZIP aufbewahren, `project/` in ein eigenes GitHub-Repository übernehmen und `MIGRATION.md` in der angegebenen Reihenfolge durchführen. Die unveränderte `original-site/`-Kopie bleibt deine Referenz. Die bestehende Site muss dafür nicht gelöscht oder ersetzt werden.
