# STATUS

Stand: 21.11.2026. Kurz und aktuell halten (unter 60 Zeilen). Verlauf steht in [CHANGELOG.md](CHANGELOG.md), Aufgaben in [BACKLOG.md](BACKLOG.md).

## Wo wir stehen

- **Schritt 0 „Großputz & Arbeitsweise“** ist gebaut und geprüft (Plan: [docs/entwurf/2026-11-21-schritt-0-plan.md](docs/entwurf/2026-11-21-schritt-0-plan.md)). Die Kinderseite sieht unverändert aus.
- Entfernt: Nachweis-, Bericht- und Release-Maschinerie, Vergleichsdateien, alte Datenbank- und Sites-Reste. Neu: schlanke Prüfkette (`pnpm run check`), Browser-Runner, kurze Unterlagen, sechs Helfer, Kurzbefehle `/weiter` und `/pruefen`.
- Der alte Stand liegt vollständig in Commit `b53f75f` (Historie von `test-live`). Die Archiv-Tags gibt es nur lokal, weil die Sitzung keine Tags hochladen darf.
- PR #95 (acht Geschichtsthemen) liegt auf Branch `codex/wunderkompass-history-evidence-2026-11-08`, Commit `7e00bd0`; Übernahme in Phase 3.

## Adressen

- **Testseite** (neuester freigegebener Stand, Branch `test-live`): https://wunderkompass-git-c76589-interaktive-wissens-und-lernplattform.vercel.app/
- **Für Freunde** (Branch `main`, nur nach Phasen-Freigabe): https://wunderkompass.vercel.app/

## Nächster Schritt

Phase 1 „Neuer Kern“ entwerfen: Design-System, Startseite, Navigation, Themenwelt-Seite, neue Wissenskarte, zuerst für das Handy (Entwurf in `docs/entwurf/`, dann Freigabe).

## Offene Fragen an den Nutzer

- Merge von Schritt 0 nach `test-live` (nach Ansicht von Vorschau und PR, „ok“ im Chat).
- Optional: die zwei Archiv-Tags auf GitHub selbst anlegen (`archiv/vor-neuausrichtung-2026-11-21` → `b53f75f`, `archiv/pr95-geschichte-2026-11-21` → `7e00bd0`).

## Bekannte Grenzen

- Die sechs Helfer in `.claude/agents/` und die Kurzbefehle `/weiter` und `/pruefen` entstanden erst während der Sitzung und ließen sich dort noch nicht per Namen aufrufen. Ersatz: ein allgemeiner Helfer mit gleichem Modell und gleicher Denkstufe, der die Rollendatei liest; die Schritte der Kurzbefehle liefen von Hand. In der nächsten Sitzung zuerst prüfen, ob beides per Name klappt.
- Lokal läuft nur Chromium. Firefox und WebKit prüft der CI-Job „Vollprüfung“.

## Archivierte Browser-Tests

Diese Testdateien liefen schon vorher nirgends mehr („tote Waisen“) und liegen nur noch im alten Stand (`git show b53f75f:tests/browser/<name>.mjs`):

| Datei | Grund |
|---|---|
| `audio.mjs`, `globe.mjs`, `legacy-games.mjs`, `responsive.mjs`, `usability.mjs`, `world-games.mjs` | Von keinem Lauf mehr aufgerufen; die Abläufe decken heutige Suiten ab (Globus, Spiele, Breiten in `core`, `animals`, `playground`) |
| `critical.mjs` | Von keinem Lauf aufgerufen; einziger noch fehlender Fall „beschädigter Speicherstand“ steht im BACKLOG als neuer Test |

Ebenfalls schon vorher tot und gelöscht (laut Plan): `content`, `journeys-labs`, `models-existing`, `new-models`, `offline`, `routes`, `search-links`.

Aus dem großen Prüflauf in Schritt 0 kam kein weiterer Test ins Archiv: Alle umgezogenen Suiten laufen grün (Chromium).

## Neuer Chat: Startnachricht

Wenn eine neue Sitzung nötig ist, diesen Text in den neuen Chat kopieren:

```text
Wir arbeiten weiter an WunderKompass (Repository Arizona2k/wunderkompass).
Der Standardbranch main ist veraltet, der aktuelle Stand liegt auf test-live.
Setze zuerst deinen Arbeitsbranch (claude/...) auf test-live, mit genau diesen Zeilen:

git fetch origin main test-live
B=$(git branch --show-current)
if git merge-base --is-ancestor origin/test-live HEAD; then echo "Branch hat schon den test-live-Stand."
elif [ "$B" != main ] && { [ -z "$(git log --oneline origin/main..HEAD)" ] || [ -z "$(git log --oneline origin/test-live..HEAD)" ]; }; then git checkout --no-track -B "$B" origin/test-live
else echo "STOPP: Branch nicht automatisch umstellbar. Erst nachfragen."; fi

Dann CLAUDE.md und STATUS.md lesen und /weiter ausführen.
Fehlt /weiter (Kurzbefehle laden beim Sitzungsstart vom alten Stand), lies .claude/skills/weiter/SKILL.md und führe die Schritte von Hand aus.
```
