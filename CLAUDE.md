# CLAUDE.md – Arbeitshandbuch für WunderKompass

Stand: 21.11.2026. Kurz, verbindlich, auf Deutsch. Bei Widerspruch gilt eine spätere ausdrückliche Weisung des Nutzers im Chat.

## Das Projekt in fünf Sätzen

WunderKompass ist eine kostenlose Lernseite zum Entdecken: Tiere, Natur, Erde, Weltall, Menschen, Erfindungen und Geschichte.
Kinder lernen mit Wissenskarten, einem 3D-Globus, kleinen Spielen, Mitmach-Laboren und Lernreisen.
Der Fortschritt liegt nur im Browser, im „Entdeckerpass“; es gibt kein Konto und keine Cloud.
Die Seite läuft auf Handy, Tablet und Rechner und funktioniert nach einmaliger Vorbereitung auch offline.
Seit dem 21.11.2026 entwickelt Claude die Seite weiter (Weg C: neuer kindgerechter Kern, Bewährtes zieht um).

**Zielgruppe:** Kinder von 5 bis 10 Jahren, selten 12 bis 14. Meistens mit einem Elternteil, ab etwa 8 auch allein.
Daraus folgt: kurze Sätze, große Bilder, große Tippflächen, schnell etwas tun können. Vertiefung für Große ist freiwillig.

## Feste Regeln

- **Kostenlos.** Keine bezahlten Dienste, Abos, Testzugänge oder Upgrades, auch nicht für Hosting, Builds, Bilder oder Audio. Kostenlose Konten nur nach Erklärung und OK des Nutzers.
- **Kompatibilität.** Karten-, Fragen-, Kapitel-, Spiel-, Labor-, Missions- und Reise-IDs bleiben gleich. Hash-Links (`#world/...`, `#journeys/...`) funktionieren weiter. Alte Links (auch `#news/...`) werden aufgefangen.
- **Ein Lernspeicher.** Der Pass ist der einzige Speicher: Schema 3, App-ID `earth-explorer`, Schlüssel `erde-entdecken:save:v3`, Altpass `erde-entdecken:forscherpass:v2`, IndexedDB `earth-explorer`. Wer daran etwas ändert, belegt mit Altpass, Import/Export, Reload und Fehlerfall, dass nichts verloren geht.
- **Daten.** Keine echten Pass-Dateien, Notizen, persönlichen Daten oder Zugangsdaten ins Repository. Nur ausgedachte Testpässe.
- **Bilder.** Nur mit geklärten Rechten und vollständigem Bildnachweis (Urheber, Lizenz, Quelle). Vorhandene Nachweise bleiben.
  - Zuerst freie Originale: Fotos und historische Abbildungen (z. B. Wikimedia Commons) nach Prüfung von Lizenz und Namensnennung.
  - Nur wenn es kein passendes Original gibt: gekennzeichnete eigene Illustration oder kostenloses KI-Bild, sichtbar als solches benannt.
  - Echte Menschen nie als foto-ähnliches KI-Bild. Rekonstruktionen (z. B. Dinosaurier) heißen auch so.
- **Git.** `main` nie direkt ändern. Kein Force-Push. Arbeit auf `claude/...`, PR nur nach `test-live`. Gemergt wird regulär nach grüner CI und erst nach „ok“ des Nutzers im Chat.
- **Zwei Adressen.** `wunderkompass.vercel.app` (aus `main`) bekommen Freunde; sie wird nur nach einer fertigen Phase und OK erneuert (PR `test-live` → `main`). Die Test-Adresse (aus `test-live`) ist die Arbeitsfläche.
- **Ehrlichkeit.** Keine Prüfung behaupten, die nicht stattfand. Keine erfundenen Studien, Kindertests oder Lernwirkungen. Teilprüfungen heißen Teilprüfungen.
- **Datenschutz.** Name und E-Mail des Nutzers gehen nie an externe Dienste, auch nicht in Anfragen oder Commits.
- **Inhalte.** Wichtige Aussagen brauchen eine geprüfte Quelle. Verbindungen zwischen Themen müssen fachlich echt sein (Ziel 6). Keine Nachrichten; der News-Bereich bleibt entfernt.
- **Neue Pakete:** nur kostenlos, mit passender Lizenz, exakt gepinnt. pnpm nimmt nur Versionen an, die mindestens 7 Tage alt sind (`minimumReleaseAge`).

## Befehle

Im Cloud-Container zuerst: `export PATH=/opt/node24/bin:$PATH` (dort ist sonst Node 22 aktiv). Node 24, pnpm 11.25.0.

| Befehl | Was er tut |
|---|---|
| `pnpm install --frozen-lockfile` | Pakete genau nach Lockfile |
| `pnpm run dev` | Entwicklungsserver (Offline-Vorbereitung ist dort aus) |
| `pnpm run build` | Produktionsbuild nach `dist/` plus Größenbudget (`performance-budgets.json`) |
| `pnpm run start` | `dist/` lokal ansehen, meist `http://127.0.0.1:4173` |
| `pnpm run typecheck` / `pnpm run lint` | Typen und Lint |
| `pnpm test` | Unit-Tests (`tests/*.test.mjs`, Node-Testrunner) |
| `pnpm run test:smoke` | Rauchtest im Browser: 360 px (Touch) und 1440 px, Bilder in `.qa-output/browser/` |
| `pnpm run test:browser` | CI-Satz: Pass, Sicherung, Offline, alte Links (zwei Suiten parallel) |
| `pnpm run test:full` | Große Prüfung, am Ende einer Phase; `-- --browser firefox` oder `webkit` oder `all` |
| `pnpm run check` | Die ganze Prüfkette: typecheck, lint, test, build, test:browser |
| `pnpm run export:data` | Inhaltsexporte nach `exports/content` (noch in Git, weil Browser-Tests sie lesen; Ablösung im BACKLOG) |

Browser-Runner direkt: `node tests/browser/run.mjs --suite smoke|ci|full [--browser chromium|firefox|webkit|all] [--jobs N] [--base URL] [suitenamen]`.
`--base` prüft eine laufende Adresse (z. B. eine Vercel-Vorschau). `QA_DIST=<ordner>` prüft einen anderen Build.
Lokal ist nur Chromium installiert. Firefox und WebKit laufen in der CI (Job „Vollprüfung“, bei PRs nach `main` oder von Hand).
Nie `playwright install` im Container ausführen.

CI (`.github/workflows/quality.yml`): Job **„Required quality checks“** (Name nicht ändern, die Branch-Regel verlangt ihn) läuft bei jedem PR.

## Arbeitsablauf

Jede Phase und jeder größere Schritt:

1. **Entwurf** in `docs/entwurf/`, Freigabe durch den Nutzer.
2. **Plan** in kleinen Schritten.
3. **Bauen** auf dem Branch `claude/...`.
4. **Prüfen:** `pnpm run check` grün, dazu passende Helfer.
5. **Zeigen:** Vercel-Vorschau-Link und Screenshots, in einfachen Worten.
6. **Freigabe:** PR nach `test-live`, Vorschau- und PR-Link schicken. Merge nach grüner CI und „ok“ im Chat.
7. **Nachführen:** `STATUS.md`, `BACKLOG.md`, `CHANGELOG.md`. Sichtbare Änderungen bekommen einen kurzen, kindgerechten Eintrag in „Was ist neu?“ auf der Seite (Wunsch des Nutzers, 21.11.2026; ab Phase 1).
8. **Für Freunde veröffentlichen** (nur am Phasenende, nach Frage und OK): vorher `test:full` in Chromium, Firefox und WebKit, dann PR `test-live` → `main`.

Kleine Korrekturen brauchen keinen Entwurf, laufen aber durch Prüfen, Zeigen und Freigabe.

**Tests.** Ein Test bleibt, wenn er schützt: (a) Pass und Speicher, (b) IDs, Hash-Links und alte Links, (c) Inhaltsintegrität, die Kinder merken (IDs, Verweise, Bilder, Bildnachweise), (d) genutzte App-Logik. Tests auf Nachweise, Berichte, alte Bytes oder wörtliche Alttexte gibt es nicht mehr. Keine Prüfung abschwächen, überspringen oder blind wiederholen.

**Im Chat immer Deutsch**, auch kurze Zwischenmeldungen und Beschreibungen von Befehlen (Wunsch des Nutzers, 21.11.2026).

**Berichte an den Nutzer** immer in dieser Form, kurz und ohne Fachjargon:

- Was ist fertig?
- Was kannst du dir ansehen (Link, Bild)?
- Was musst du entscheiden?
- Was kommt als Nächstes?

**Commits:** `git -c user.name=Claude -c user.email=noreply@anthropic.com commit …`, deutsche Betreffzeile. Vor jedem Push `git diff --check` und Autor/Committer prüfen.

## Helfer (`.claude/agents/`)

Helfer melden nur Befunde und ändern nichts. Claude entscheidet und setzt um.

| Helfer | Aufgabe | Modell / Stufe |
|---|---|---|
| `kinder-redaktion` | Texte für 5- bis 10-Jährige: Satzlänge, Fachwörter, Ton, Länge, Doppeltes, Mini-Fragen | opus / high |
| `fakten-pruefer` | Aussagen gegen Quellen, Zahlen, Einheiten, Aktualität | opus / high |
| `design-pruefer` | Screenshots in 320, 390, 768, 1280, 1440 px: Lesbarkeit, Kontrast, Fokus, Tippflächen, Abgeschnittenes, Bildwirkung | sonnet / high |
| `code-pruefer` | Änderungen auf Fehler, besonders Pass, IDs und Links | opus / high |
| `bild-recherche` | Freie Fotos suchen, Lizenz und Namensnennung prüfen, Nachweis vorbereiten | sonnet / medium |
| `ideen-scout` | Vergleichbare Angebote ansehen, Ideen als Vorschläge liefern | sonnet / medium |

- `fable` (stärkstes Modell) nur gezielt für große Abschlussprüfungen am Phasenende.
- `haiku` für einfache Massenprüfungen, z. B. alle Karten auf kaputte Verweise.
- **Vorübergehende Modell-Ausnahmen** (z. B. Kontingent eines Modells erschöpft) stehen mit Enddatum in `STATUS.md`. Ist das Datum vorbei: wieder das Modell aus dieser Liste nehmen, den Eintrag löschen, dem Nutzer kurz Bescheid sagen. `/weiter` prüft das bei jedem Einstieg.

**Modell-Stand** (für den Vergleich in `/weiter`): 21.11.2026: Fable 5.2, Opus 5.5, Sonnet 5.5, Haiku 5.5.

## Kurzbefehle (`.claude/skills/`)

- `/weiter` – Wiedereinstieg: Branch prüfen (auf `main` → zu `test-live` wechseln), `CLAUDE.md` und `STATUS.md` lesen, Git-Stand prüfen, Modell-Check, nächsten Schritt nennen.
- `/pruefen` – vor einer Übergabe: Prüfkette, passende Helfer, ehrlicher Sammelbericht.

## Wo was liegt

| Ort | Inhalt |
|---|---|
| `app/` | Die App (React 19, Vite 8, Tailwind 4): Ansichten, Inhalte als JSON/TS, Pass, Service Worker |
| `app/world-catalog.json` | Alle Wissenskarten; Fotos und Nachweise in `app/world-photos.json` |
| `components/`, `lib/`, `hooks/` | Gemeinsame UI-Bausteine und Hilfen |
| `public/` | Bilder, Fotos (WebP in 320/640/960), Karten, statische Dateien |
| `build/` | Vite-Plugins: Build-Kennung, Offline-Liste, Worker |
| `scripts/` | `export-content.mjs` (Exporte und Inhaltsprüfung), Größenbudget, Test-Laufzeit |
| `tests/*.test.mjs` | Unit-Tests; `tests/fixtures/` feste Altstände für Kompatibilität (z. B. `stable-ids.json`) |
| `tests/browser/` | Browser-Runner (`run.mjs`, `suites.mjs`, `harness.mjs`) und Suiten |
| `content/research/`, `content/update-history-evidence.json` | Quellen und Daten, die die App liest |
| `docs/entwurf/` | Entwürfe und Pläne je Phase |
| `docs/archiv/` | Originalaufträge des Nutzers und die alte AGENTS.md |
| `STATUS.md`, `BACKLOG.md`, `VISION.md`, `CHANGELOG.md` | Stand, Aufgaben, Produktziele, Verlauf |

Der alte Stand mit allen Berichten liegt in Commit `b53f75f` (Historie von `test-live`; lokaler Tag `archiv/vor-neuausrichtung-2026-11-21`).

## Vercel

- Team `team_ZoDaUGD4xeLiekVnSQ4oD2aE`, Projekt `prj_ZY036iUMf0CKLgb4h9ywyGBTUHRI` (Git-Anbindung, Vorschau je Branch außer `codex/**`).
- Status über das Vercel-MCP (`list_deployments`), keine Deployments von Hand.
- Feste Adressen: Testseite (`test-live`) https://wunderkompass-git-c76589-interaktive-wissens-und-lernplattform.vercel.app/, Freunde (`main`) https://wunderkompass.vercel.app/. Jeder Branch bekommt eine eigene Vorschau-Adresse (in `list_aliases` nachsehen).

## Neue Sitzung

Der Standardbranch auf GitHub ist seit 21.11.2026 `test-live`; neue Sitzungen starten damit auf dem aktuellen Stand. `main` bleibt der ältere Stand für Freunde. Die Startnachricht zum Kopieren steht in `STATUS.md` („Neuer Chat: Startnachricht“); ihre Branch-Zeilen sind nur noch eine Sicherung.
