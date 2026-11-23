# STATUS

Stand: 23.11.2026. Kurz und aktuell halten (unter 60 Zeilen). Verlauf steht in [CHANGELOG.md](CHANGELOG.md), Aufgaben in [BACKLOG.md](BACKLOG.md).

## Wo wir stehen

- **Schritt 0 „Großputz & Arbeitsweise“** (PR #96, `a0ec975`) und die **Einordnung des Katalogs „WunderKompass 2027“** (PR #97, `5cf70fa`, [Einordnung](docs/entwurf/2026-11-21-katalog-2027-einordnung.md)) sind seit 21.11.2026 in `test-live`. Ebenso **Phase 1, Teilschritt 1 „Aussehen und Hülle“** (PR #99, `6f43eb5`, [Entscheidungen](docs/entwurf/2026-11-21-phase-1-teilschritt-1-entscheidungen.md)). Der alte Stand liegt vollständig in Commit `b53f75f`.
- **Phase 1, Teilschritt 2 „Wissenskarte“** ist fertig und in `test-live` ([Plan](docs/entwurf/2026-11-21-phase-1-plan-teilschritt-2.md), [Entscheidungen und verschobene Kleinigkeiten](docs/entwurf/2026-11-23-phase-1-teilschritt-2-entscheidungen.md)):
  - Schritt 0 (PR #102), Teil A „Neue Karte“ (PR #103, `40a0f0b`), Teil B „Kürzer und verbunden“ (PR #104, `4b5bdb1`) mit der Ergänzung „Stufen“ und dem Helfer `stufen-pruefer`. Geprüft und offen gebliebene Befunde: [Entscheidungen](docs/entwurf/2026-11-23-phase-1-teilschritt-2-entscheidungen.md), BACKLOG Punkt 23.
- **Arbeitsweise abgesichert** (23.11.2026, PR #105): Helfer müssen laufen (Helfer-Check in `/weiter`, Ersatz von Hand, technik-pruefer nach jedem späten Fehler), nichts geht beim Chatwechsel verloren (`CLAUDE.md`, „Übergabe beim Chatwechsel“), Aufräumen gilt auch fürs Arbeiten. Bericht des technik-pruefer: [Technik-Prüfung](docs/entwurf/2026-11-23-technik-pruefung.md).
- **Phase 1, Teilschritt 3 „Kniffliger spielen“ hat begonnen** (23.11.2026, Branch `claude/blissful-hawking-itgss4`, PR nach `test-live`): Das Arbeitssystem ist umgebaut ([Entscheidungsliste](docs/entwurf/2026-11-23-teilschritt-3-arbeitssystem-entscheidungen.md)): gemeinsame Test-Bausteine mit Wächter, Vollprüfung in sieben Gruppen (je höchstens 75 Minuten, mit den Zeiten aus CI-Lauf 262 ausgeglichen), Engine-Schnellprüfung (CI-Satz in Firefox und WebKit bei jedem PR, kein Pflicht-Check), `solar-labels` im CI-Satz, Datentest gegen doppeltes „Ganz einfach“, 61 alte Dateien und 14 ungenutzte Pakete entfernt. Dazu zwei Firefox-Funde: React lässt Firefox manche Fotos doppelt laden, und nach dem Neuladen bricht Firefox die Nachfrage zu einem gespeicherten Foto selbst ab. Die Überwachung erkennt genau diese zwei Fälle jetzt (Entscheidungsliste, Punkte 10 und 13). [Entwurf und Plan](docs/entwurf/2026-11-23-phase-1-teilschritt-3.md) liegen zur Freigabe.
- PR #95 (acht Geschichtsthemen) liegt auf Branch `codex/wunderkompass-history-evidence-2026-11-08`, Commit `7e00bd0`; Übernahme in Phase 3.

## Adressen

- **Testseite** (neuester freigegebener Stand, Branch `test-live`): https://wunderkompass-git-c76589-interaktive-wissens-und-lernplattform.vercel.app/
- **Für Freunde** (Branch `main`, nur nach Phasen-Freigabe): https://wunderkompass.vercel.app/

## Nächster Schritt

Phase 1 „Neuer Kern“ ([Entwurf](docs/entwurf/2026-11-21-phase-1-entwurf.md), [Ergänzung „Weniger lesen, mehr knobeln“](docs/entwurf/2026-11-21-phase-1-ergaenzung-spannung.md), darin die Rückmeldung eines 10-jährigen Kindes: zu viel Text, zu leicht), sechs Teilschritte: 1. Aussehen und Hülle (fertig) · 2. Wissenskarte (fertig) · **3. Kniffliger spielen** · 4. Weltenseiten und Bilder · 5. Startseite und Sammlung · 6. Feinschliff und Abschluss.

**Teilschritt 3 „Kniffliger spielen“:** [Entwurf und Plan](docs/entwurf/2026-11-23-phase-1-teilschritt-3.md) (Grundlage: [Ergänzung Stufen](docs/entwurf/2026-11-23-phase-1-ergaenzung-stufen.md), [Prüfbericht Pilot-Karten](docs/entwurf/2026-11-23-stufen-pruefung-pilotkarten.md)). Darauf aufbauen, nicht neu ausdenken:

1. Der Nutzer gibt den Entwurf frei und entscheidet D1 bis D5 (Abschnitt „Entscheidungen“ im Entwurf).
2. Dann bauen, beginnend mit Teil A, Aufgabe 1 (Stufe im Pass, `app/kern/stufe.ts`). Pass-Änderungen mit Altpass, Import/Export, Reload und Fehlerfall belegen.
3. Nebenbei: `journeys` (rund 35 Minuten, längste Gruppe der Vollprüfung) teilen oder beschleunigen, sobald klar ist, welcher Teil die Zeit braucht (BACKLOG, „Vollprüfung dauert lange“).

## Offene Fragen an den Nutzer

- **D1 bis D5** im [Entwurf Teilschritt 3](docs/entwurf/2026-11-23-phase-1-teilschritt-3.md), Claude empfiehlt je eine Lösung.
- **`main` schützen:** entschieden am 23.11.2026 (dieselbe GitHub-Regel wie `test-live`), der Nutzer stellt sie ein; am 23.11.2026 um 16:45 UTC galt `main` laut GitHub noch als ungeschützt, Claude prüft beim nächsten Einstieg. **Engine-Schnellprüfung als Pflicht-Check?** Erst nach einigen Wochen ohne hängende Browser-Downloads (BACKLOG).

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
