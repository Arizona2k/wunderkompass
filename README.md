# WunderKompass

Eine kostenlose Lernseite zum Entdecken für Kinder von 5 bis 10 Jahren, meist zusammen mit einem Elternteil:
Tiere, Natur, Erde, Weltall, Menschen, Erfindungen und Geschichte, mit Wissenskarten, 3D-Globus, kleinen Spielen, Mitmach-Laboren und Lernreisen.

- Fortschritt bleibt nur im Browser (Entdeckerpass), ohne Konto und ohne Cloud.
- Läuft auf Handy, Tablet und Rechner, nach einmaliger Vorbereitung auch offline.
- Hauptadresse: <https://wunderkompass.vercel.app> (wird nur nach einer fertigen Phase erneuert).

Für die Mitarbeit: [CLAUDE.md](CLAUDE.md) (Arbeitshandbuch), [STATUS.md](STATUS.md) (aktueller Stand), [BACKLOG.md](BACKLOG.md) (Aufgaben), [VISION.md](VISION.md) (Produktziele), [CHANGELOG.md](CHANGELOG.md) (Verlauf).

## Lokal starten

Voraussetzungen: Node 24 und pnpm 11.25.0 (`corepack enable` richtet pnpm passend zu `package.json` ein).

```bash
pnpm install --frozen-lockfile
```

```bash
pnpm run dev
```

Der Entwicklungsserver läuft unter <http://127.0.0.1:5173>. Die Offline-Vorbereitung gibt es nur im Produktionsbuild:

```bash
pnpm run build && pnpm run start
```

Das zeigt `dist/` unter <http://127.0.0.1:4173>.

## Prüfen

| Befehl | Zweck |
|---|---|
| `pnpm run check` | Ganze Prüfkette: Typen, Lint, Unit-Tests, Build mit Größenbudget, Browser-CI-Satz |
| `pnpm test` | Unit-Tests, darunter Pass-Kompatibilität, stabile IDs und Bildnachweise |
| `pnpm run test:smoke` | Kurzer Browsertest in 360 px und 1440 px mit Screenshots |
| `pnpm run test:full` | Große Browserprüfung am Ende einer Phase (`-- --browser firefox`, `webkit` oder `all`) |

Browsertests nutzen Playwright. Screenshots landen in `.qa-output/browser/`.
Die CI auf GitHub führt bei jedem PR den Job „Required quality checks“ aus.

## Wo was liegt

| Ort | Inhalt |
|---|---|
| `app/` | Die App: Ansichten, Inhalte (JSON/TS), Entdeckerpass, Service Worker |
| `components/`, `lib/`, `hooks/` | Gemeinsame UI-Bausteine und Hilfen |
| `public/` | Bilder, Fotos, Karten, Lizenztexte |
| `build/` | Vite-Plugins für Build-Kennung und Offline-Liste |
| `scripts/` | Inhaltsexport und -prüfung, Größenbudget, Testlaufzeit |
| `tests/` | Unit-Tests, Browser-Runner (`tests/browser/`), feste Altstände (`tests/fixtures/`) |
| `docs/entwurf/` | Entwürfe und Pläne je Phase |
| `docs/archiv/` | Originalaufträge und alte Arbeitsregeln |

## Werkzeuge und Lizenzen

Alle Werkzeuge sind kostenlos. Neue Pakete werden exakt gepinnt; pnpm nimmt nur Versionen an, die mindestens 7 Tage alt sind.

- React, Vite, Tailwind CSS, three.js: MIT. d3-geo (Globuskarten): ISC.
- Motion for React 14.4.0 (MIT): sanfte Übergänge in Themen, Reisen und Laboraufgaben. Lizenztexte in `public/licenses/learning-motion.json`, in der App über die Hilfe für Begleitpersonen erreichbar.
- Playwright (Apache-2.0) und axe-core (MPL-2.0): Browsertests und Barrierefreiheitsprüfung.
- Hosting: Vercel mit Git-Anbindung und einer Vorschau für jeden Branch.

Die Fotos stammen fast alle von Wikimedia Commons (54 von 60). Jeder Bildnachweis (Urheber, Lizenz, Quelle) steht in `app/world-photos.json`.
