# STATUS

Stand: 21.11.2026. Kurz und aktuell halten (unter 60 Zeilen). Verlauf steht in [CHANGELOG.md](CHANGELOG.md), Aufgaben in [BACKLOG.md](BACKLOG.md).

## Wo wir stehen

- **Schritt 0 „Großputz & Arbeitsweise“** ist fertig und seit 21.11.2026 in `test-live` (PR #96, Merge-Commit `a0ec975`). Die Testseite zeigt den neuen Stand (Build-Kennung `cd33868b5f4034b8`, Rauchtest gegen die Testseite grün). Die Kinderseite sieht unverändert aus. Plan: [docs/entwurf/2026-11-21-schritt-0-plan.md](docs/entwurf/2026-11-21-schritt-0-plan.md), alle Entscheidungen: [docs/entwurf/2026-11-21-schritt-0-entscheidungen.md](docs/entwurf/2026-11-21-schritt-0-entscheidungen.md).
- Prüfungen, nur in Chromium: `pnpm run check` grün (350 Unit-Tests, 13 Browser-Suiten, 2 min 39 s). Große Prüfung: 28 von 28 Suiten grün (zwei im Nachlauf, weil das Werkzeug Läufe nach 2 Stunden abbricht). Der neue Build gleicht dem alten bis auf die Kennung (270 Dateien). Offline-Update vom alten Stand behält Pass und Favoriten. Repository: 1284 → 1021 Dateien, 73,9 → 42,2 MB.
- Entfernt: Nachweis-, Bericht- und Release-Maschinerie, Vergleichsdateien, alte Datenbank- und Sites-Reste. Neu: schlanke Prüfkette (`pnpm run check`), Browser-Runner, kurze Unterlagen, sechs Helfer, Kurzbefehle `/weiter` und `/pruefen`.
- Der alte Stand liegt vollständig in Commit `b53f75f` (Historie von `test-live`). Archiv-Tags auf GitHub braucht es nicht: Die Sitzung kann keine anlegen, und beide Stände sind über ihre Commits erreichbar.
- **Alter Katalog „WunderKompass 2027“** ist eingeordnet: [docs/entwurf/2026-11-21-katalog-2027-einordnung.md](docs/entwurf/2026-11-21-katalog-2027-einordnung.md) (übernommen, angepasst, weggelassen, mit Gründen). Audit V2 ist am heutigen Code nachgeprüft: 18 von 19 Befunden behoben, der Rest steht im BACKLOG. Seit 21.11.2026 in `test-live` (PR #97, Merge-Commit `5cf70fa`).
- **Neue feste Regel „Kein Bestandsschutz“** (CLAUDE.md): Was nicht gut ist, wird geändert oder gestrichen. Geschützt bleiben nur Pass-Fortschritt und alte Links. Der ID-Wächter wird zusammen mit dem ersten gestrichenen Inhalt auf „ausgemustert mit Ziel“ umgebaut (BACKLOG, Technik).
- PR #95 (acht Geschichtsthemen) liegt auf Branch `codex/wunderkompass-history-evidence-2026-11-08`, Commit `7e00bd0`; Übernahme in Phase 3.

## Adressen

- **Testseite** (neuester freigegebener Stand, Branch `test-live`): https://wunderkompass-git-c76589-interaktive-wissens-und-lernplattform.vercel.app/
- **Für Freunde** (Branch `main`, nur nach Phasen-Freigabe): https://wunderkompass.vercel.app/

## Nächster Schritt

Phase 1 „Neuer Kern“: Entwurf am 21.11.2026 freigegeben ([docs/entwurf/2026-11-21-phase-1-entwurf.md](docs/entwurf/2026-11-21-phase-1-entwurf.md)). Jetzt: Plan in kleinen Schritten, dann Teilschritt 1 „Aussehen und Hülle“.

## Offene Fragen an den Nutzer

- Keine.

## Vorübergehende Modell-Ausnahmen

- **Bis 23.11.2026, 02:00 UTC (03:00 Uhr deutscher Zeit):** `fable` ist ausgeschöpft, große Abschlussprüfungen laufen bis dahin mit `opus`. Danach wieder `fable` nehmen und diesen Eintrag löschen. Weil die Schlussprüfung von Schritt 0 nur mit `opus` lief, prüft `fable` am Ende von Phase 1 die Strecke ab `b53f75f` mit.

## Bekannte Grenzen

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
