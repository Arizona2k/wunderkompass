# STATUS

Stand: 23.11.2026. Kurz und aktuell halten (unter 60 Zeilen). Verlauf steht in [CHANGELOG.md](CHANGELOG.md), Aufgaben in [BACKLOG.md](BACKLOG.md).

## Wo wir stehen

- **Schritt 0 „Großputz & Arbeitsweise“** (PR #96, `a0ec975`) und die **Einordnung des Katalogs „WunderKompass 2027“** (PR #97, `5cf70fa`, [Einordnung](docs/entwurf/2026-11-21-katalog-2027-einordnung.md)) sind seit 21.11.2026 in `test-live`. Ebenso **Phase 1, Teilschritt 1 „Aussehen und Hülle“** (PR #99, `6f43eb5`, [Entscheidungen](docs/entwurf/2026-11-21-phase-1-teilschritt-1-entscheidungen.md)). Der alte Stand liegt vollständig in Commit `b53f75f`.
- **Phase 1, Teilschritt 2 „Wissenskarte“** ist fertig und in `test-live` ([Plan](docs/entwurf/2026-11-21-phase-1-plan-teilschritt-2.md), [Entscheidungen und verschobene Kleinigkeiten](docs/entwurf/2026-11-23-phase-1-teilschritt-2-entscheidungen.md)):
  - Schritt 0: CI-Fehler und alte Fehler behoben (PR #102, `176cd08`). Bildkandidaten für Zeitreise und Erfindungen: [Liste](docs/entwurf/2026-11-21-bilder-zeitreise-erfindungen.md).
  - Teil A „Neue Karte“ (PR #103, `40a0f0b`): neue Wissenskarte, alte Karte entfernt, Lernreisen einfach zuerst; der Pass behält Spielstände über 256.
  - Teil B „Kürzer und verbunden“ (PR #104, `4b5bdb1`): jede Karte mit erklärtem Nachbarn, Karten aufgeräumt, zwölf Pilot-Karten im neuen Stil, frühere Antworten bleiben. Dazu die Ergänzung „Stufen“ und der Helfer `stufen-pruefer`. Geprüft: `pnpm run check` und große Prüfung in Chromium grün; CI-Vollprüfung Chromium und Firefox grün, WebKit rot nur durch die zwei alten Fehler `backup` und `offline-cold`; beide danach behoben (PR #105), seither prüft jeder PR sie auch in WebKit. Schlussprüfung mit dem stärksten Modell, Befunde behoben oder mit Grund im BACKLOG (Punkt 23).
- **Arbeitsweise abgesichert** (23.11.2026, PR #105): Helfer müssen laufen (Helfer-Check in `/weiter`, Ersatz von Hand, technik-pruefer nach jedem späten Fehler), nichts geht beim Chatwechsel verloren (`CLAUDE.md`, „Übergabe beim Chatwechsel“), Aufräumen gilt auch fürs Arbeiten. Bericht des technik-pruefer: [Technik-Prüfung](docs/entwurf/2026-11-23-technik-pruefung.md).
- PR #95 (acht Geschichtsthemen) liegt auf Branch `codex/wunderkompass-history-evidence-2026-11-08`, Commit `7e00bd0`; Übernahme in Phase 3.

## Adressen

- **Testseite** (neuester freigegebener Stand, Branch `test-live`): https://wunderkompass-git-c76589-interaktive-wissens-und-lernplattform.vercel.app/
- **Für Freunde** (Branch `main`, nur nach Phasen-Freigabe): https://wunderkompass.vercel.app/

## Nächster Schritt

Phase 1 „Neuer Kern“ ([Entwurf](docs/entwurf/2026-11-21-phase-1-entwurf.md), [Ergänzung „Weniger lesen, mehr knobeln“](docs/entwurf/2026-11-21-phase-1-ergaenzung-spannung.md), darin die Rückmeldung eines 10-jährigen Kindes: zu viel Text, zu leicht), sechs Teilschritte: 1. Aussehen und Hülle (fertig) · 2. Wissenskarte (fertig) · **3. Kniffliger spielen** · 4. Weltenseiten und Bilder · 5. Startseite und Sammlung · 6. Feinschliff und Abschluss.

**Teilschritt 3 „Kniffliger spielen“** mit der [Ergänzung „Leicht, knifflig, richtig knifflig“](docs/entwurf/2026-11-23-phase-1-ergaenzung-stufen.md) ([Prüfbericht Pilot-Karten](docs/entwurf/2026-11-23-stufen-pruefung-pilotkarten.md)). Darauf aufbauen, nicht neu ausdenken:

1. Zuerst das Arbeitssystem, in der Reihenfolge aus der [Technik-Prüfung](docs/entwurf/2026-11-23-technik-pruefung.md) (Abschnitt „Einordnung durch Claude und Reihenfolge“): gemeinsame Test-Bausteine mit Wächter, Vollprüfung aufteilen (Zeitgrenze danach 75 Minuten), Firefox/WebKit früher prüfen (WebKit-Kurzprüfung für Pass und Offline läuft schon bei jedem PR), CI-Satz ergänzen, Altlasten aufräumen. Vorher den `technik-pruefer` dazu befragen.
2. Dann Entwurf und Plan für Teilschritt 3 in `docs/entwurf/`, mit den verschobenen Kleinigkeiten aus der Entscheidungsliste von Teilschritt 2 und BACKLOG Phase 1.

## Offene Fragen an den Nutzer

- Keine. Entschieden am 23.11.2026 (Nutzer: „ja“ zu beiden Empfehlungen): „Ganz einfach“ auf allen Karten offen, die schweren Absätze unter „Für Große“ (BACKLOG 17, Umsetzung in Teilschritt 3); `main` bekommt dieselbe GitHub-Regel wie `test-live`. Die Regel stellt der Nutzer auf GitHub ein (Claude hat dafür kein Werkzeug); danach prüft Claude, ob `main` als geschützt gilt.

## Vorübergehende Modell-Ausnahmen

- Keine. (Die Ausnahme für `fable` lief am 23.11.2026 um 02:00 UTC ab; die offene Nachprüfung steht im BACKLOG, Phase 1, Punkt 10.)

## Archivierte Browser-Tests

Liefen schon vor Schritt 0 nirgends mehr und liegen nur im alten Stand (`git show b53f75f:tests/browser/<name>.mjs`): `audio`, `globe`, `legacy-games`, `responsive`, `usability`, `world-games`, `critical` (der Fall „beschädigter Speicherstand“ steht im BACKLOG). Gelöscht: `content`, `journeys-labs`, `models-existing`, `new-models`, `offline`, `routes`, `search-links`.

## Neuer Chat: Startnachricht

Neue Chats in der Cloud-Umgebung **„wunderkompass“** starten (beim Start des Chats auswählen). Ihr Start-Skript holt Pakete und die passenden Browser; angelegt am 21.11.2026, in einem frischen Chat noch nicht erprobt. Wenn eine neue Sitzung nötig ist, diesen Text in den neuen Chat kopieren:

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
