# STATUS

Stand: 21.11.2026. Kurz und aktuell halten (unter 60 Zeilen). Verlauf steht in [CHANGELOG.md](CHANGELOG.md), Aufgaben in [BACKLOG.md](BACKLOG.md).

## Wo wir stehen

- **Schritt 0 „Großputz & Arbeitsweise“** ist fertig und geprüft, aber noch nicht in `test-live` übernommen (Plan: [docs/entwurf/2026-11-21-schritt-0-plan.md](docs/entwurf/2026-11-21-schritt-0-plan.md)). Die Kinderseite sieht unverändert aus.
- Prüfungen, nur in Chromium: `pnpm run check` grün (350 Unit-Tests, 13 Browser-Suiten, 2 min 39 s). Große Prüfung: 28 von 28 Suiten grün (zwei im Nachlauf, weil das Werkzeug Läufe nach 2 Stunden abbricht). Der neue Build gleicht dem alten bis auf die Kennung (270 Dateien). Offline-Update vom alten Stand behält Pass und Favoriten. Repository: 1284 → 1021 Dateien, 73,9 → 42,2 MB.
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

## Vorübergehende Modell-Ausnahmen

- **Bis 23.11.2026, 02:00 UTC (03:00 Uhr deutscher Zeit):** `fable` ist ausgeschöpft, große Abschlussprüfungen laufen bis dahin mit `opus`. Danach wieder `fable` nehmen und diesen Eintrag löschen. Weil die Schlussprüfung von Schritt 0 nur mit `opus` lief, prüft `fable` am Ende von Phase 1 die Strecke ab `b53f75f` mit.

## Bekannte Grenzen

- Die sechs Helfer in `.claude/agents/` und die Kurzbefehle `/weiter` und `/pruefen` entstanden erst während der Sitzung und ließen sich dort noch nicht per Namen aufrufen. Ersatz: ein allgemeiner Helfer mit gleichem Modell und gleicher Denkstufe, der die Rollendatei liest; die Schritte der Kurzbefehle liefen von Hand. Kurz vor dem PR erschienen Kurzbefehle und Helfer dann doch per Name in der Sitzung. In der nächsten Sitzung zuerst prüfen, ob beides gleich zu Beginn per Name klappt.
- Lokal läuft nur Chromium. Firefox und WebKit prüft der CI-Job „Vollprüfung“.

## Archivierte Browser-Tests

Diese Dateien liefen schon vorher nirgends mehr und liegen nur im alten Stand (`git show b53f75f:tests/browser/<name>.mjs`): `audio`, `globe`, `legacy-games`, `responsive`, `usability`, `world-games` (heutige Suiten decken die Abläufe ab: Globus, Spiele, Breiten in `core`, `animals`, `playground`) und `critical` (der einzige fehlende Fall „beschädigter Speicherstand“ steht im BACKLOG). Ebenfalls tot und gelöscht: `content`, `journeys-labs`, `models-existing`, `new-models`, `offline`, `routes`, `search-links`. Aus dem großen Prüflauf kam kein weiterer Test ins Archiv.

## Neuer Chat: Startnachricht

Wenn eine neue Sitzung nötig ist, diesen Text in den neuen Chat kopieren:

```text
Wir arbeiten weiter an WunderKompass (Repository Arizona2k/wunderkompass).
Der aktuelle Stand liegt auf test-live (Standardbranch), main ist der ältere Stand für Freunde.
Prüfe zuerst, ob dein Arbeitsbranch (claude/...) den test-live-Stand hat, mit genau diesen Zeilen:

git fetch origin main test-live
B=$(git branch --show-current)
if git merge-base --is-ancestor origin/test-live HEAD; then echo "Branch hat schon den test-live-Stand."
elif [ "$B" != main ] && { [ -z "$(git log --oneline origin/main..HEAD)" ] || [ -z "$(git log --oneline origin/test-live..HEAD)" ]; }; then git checkout --no-track -B "$B" origin/test-live
else echo "STOPP: Branch nicht automatisch umstellbar. Erst nachfragen."; fi

Dann CLAUDE.md und STATUS.md lesen und /weiter ausführen.
Fehlt /weiter (Kurzbefehle laden beim Sitzungsstart vom alten Stand), lies .claude/skills/weiter/SKILL.md und führe die Schritte von Hand aus.
```
