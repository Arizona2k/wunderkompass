# STATUS

Stand: 23.11.2026. Kurz und aktuell halten (unter 60 Zeilen). Verlauf steht in [CHANGELOG.md](CHANGELOG.md), Aufgaben in [BACKLOG.md](BACKLOG.md).

## Wo wir stehen

- **Schritt 0 „Großputz & Arbeitsweise“** (PR #96, `a0ec975`) und die **Einordnung des Katalogs „WunderKompass 2027“** (PR #97, `5cf70fa`, [Einordnung](docs/entwurf/2026-11-21-katalog-2027-einordnung.md)) sind seit 21.11.2026 in `test-live`. Ebenso **Phase 1, Teilschritt 1 „Aussehen und Hülle“** (PR #99, `6f43eb5`, [Entscheidungen](docs/entwurf/2026-11-21-phase-1-teilschritt-1-entscheidungen.md)). Der alte Stand liegt vollständig in Commit `b53f75f`.
- **Phase 1, Teilschritt 2 „Wissenskarte“** ist fertig und in `test-live` ([Plan](docs/entwurf/2026-11-21-phase-1-plan-teilschritt-2.md), [Entscheidungen und verschobene Kleinigkeiten](docs/entwurf/2026-11-23-phase-1-teilschritt-2-entscheidungen.md)):
  - Schritt 0 (PR #102), Teil A „Neue Karte“ (PR #103, `40a0f0b`), Teil B „Kürzer und verbunden“ (PR #104, `4b5bdb1`) mit der Ergänzung „Stufen“ und dem Helfer `stufen-pruefer`. Geprüft und offen gebliebene Befunde: [Entscheidungen](docs/entwurf/2026-11-23-phase-1-teilschritt-2-entscheidungen.md), BACKLOG Punkt 23.
- **Arbeitsweise abgesichert** (23.11.2026, PR #105): Helfer müssen laufen (Helfer-Check in `/weiter`, Ersatz von Hand, technik-pruefer nach jedem späten Fehler), nichts geht beim Chatwechsel verloren (`CLAUDE.md`, „Übergabe beim Chatwechsel“), Aufräumen gilt auch fürs Arbeiten. Bericht des technik-pruefer: [Technik-Prüfung](docs/entwurf/2026-11-23-technik-pruefung.md).
- **Phase 1, Teilschritt 3 „Kniffliger spielen“ hat begonnen** (23.11.2026, PR #106, am 23.11.2026 freigegeben und in `test-live`): Das Arbeitssystem ist umgebaut ([Entscheidungsliste](docs/entwurf/2026-11-23-teilschritt-3-arbeitssystem-entscheidungen.md)): gemeinsame Test-Bausteine mit Wächter, Vollprüfung in sieben Gruppen (je höchstens 75 Minuten, mit den Zeiten aus CI-Lauf 262 ausgeglichen), Engine-Schnellprüfung (CI-Satz in Firefox und WebKit bei jedem PR, kein Pflicht-Check), `solar-labels` im CI-Satz, Datentest gegen doppeltes „Ganz einfach“, 61 alte Dateien und 14 ungenutzte Pakete entfernt. Dazu zwei Firefox-Funde: React lässt Firefox manche Fotos doppelt laden, und nach dem Neuladen bricht Firefox die Nachfrage zu einem gespeicherten Foto selbst ab. Die Überwachung erkennt genau diese zwei Fälle jetzt (Entscheidungsliste, Punkte 10 und 13). [Entwurf und Plan](docs/entwurf/2026-11-23-phase-1-teilschritt-3.md) sind freigegeben.
- **Teilschritt 3, Teil A „Eine Stufe für alles“ in Arbeit** (Branch `claude/trusting-galileo-ck3o23`, noch kein PR; Entscheidungen: [Teil A](docs/entwurf/2026-11-23-teilschritt-3-teil-a-entscheidungen.md)):
  - Fertig und gepusht: Aufgabe 1 (Stufe im Pass), 2 (Stufenwahl im Entdeckerpass), 3 (Vorschläge, Logik), 4 (gemeinsame Wörter, „Noch einmal raten“ zählt nicht doppelt). Browser-Prüfung von Aufgabe 4: 24 von 26 Suiten grün; `wissenskarte` und `journeys` waren rot, beide Ursachen behoben, Wiederholung läuft.
  - Aufgabe 5 (Karte mit Stufen) zur Hälfte: Logik, Wahl über „Rate mal!“, Vorschlag, Schutz gespeicherter Antworten (`tests/fixtures/gespeicherte-antworten.json`). Offen: Inhalte aus dem [Entwurf des stufen-pruefer](docs/entwurf/2026-11-23-karte-stufen-entwurf.md) nach Prüfung durch `fakten-pruefer` und `kinder-redaktion` einbauen, strengere Inhaltsregeln (3/4 Antworten je Stufe, Ratemuster-Grenzen statt „nie die längste“), „Fast richtig“, „Ordne richtig“, Browser-Test `karte-stufen`.
- **PR #95 und #27 durchgesehen** ([Bericht](docs/entwurf/2026-11-23-pr-95-27-durchsicht.md)); Auftrag des Nutzers: Brauchbares umsetzen, Rest löschen. Offen: Originalaufträge nach `docs/archiv/`, Funde ins BACKLOG, dann beide PRs schließen und Branches löschen (Commits bleiben über `refs/pull/<n>/head`).

## Adressen

- **Testseite** (neuester freigegebener Stand, Branch `test-live`): https://wunderkompass-git-c76589-interaktive-wissens-und-lernplattform.vercel.app/
- **Für Freunde** (Branch `main`, nur nach Phasen-Freigabe): https://wunderkompass.vercel.app/

## Nächster Schritt

Phase 1 „Neuer Kern“ ([Entwurf](docs/entwurf/2026-11-21-phase-1-entwurf.md), [Ergänzung „Weniger lesen, mehr knobeln“](docs/entwurf/2026-11-21-phase-1-ergaenzung-spannung.md), darin die Rückmeldung eines 10-jährigen Kindes: zu viel Text, zu leicht), sechs Teilschritte: 1. Aussehen und Hülle (fertig) · 2. Wissenskarte (fertig) · **3. Kniffliger spielen** · 4. Weltenseiten und Bilder · 5. Startseite und Sammlung · 6. Feinschliff und Abschluss.

**Teilschritt 3 „Kniffliger spielen“:** [Entwurf und Plan](docs/entwurf/2026-11-23-phase-1-teilschritt-3.md) (Grundlage: [Ergänzung Stufen](docs/entwurf/2026-11-23-phase-1-ergaenzung-stufen.md), [Prüfbericht Pilot-Karten](docs/entwurf/2026-11-23-stufen-pruefung-pilotkarten.md)). Darauf aufbauen, nicht neu ausdenken:

1. Aufgabe 5 fertigstellen (siehe „Wo wir stehen“), dann Aufgabe 6: „Ganz einfach“ offen auf allen Karten (Vorlagen für 73 Karten in PR #27, siehe Durchsicht 2b), „Was ist neu?“, `pnpm run check`, Helfer, PR von Teil A nach `test-live`.
2. PR #95 und #27 aufräumen (siehe oben).
3. Nebenbei: `journeys` (rund 23 bis 35 Minuten) teilen; darin steckt z. B. `learning-tasks` (allein 82 s). BACKLOG, „Vollprüfung dauert lange“.

## Offene Fragen an den Nutzer

- **`main` schützen:** entschieden am 23.11.2026 (dieselbe GitHub-Regel wie `test-live`). Der Nutzer stellt die Regel irgendwann selbst ein (23.11.2026: „das mit main mach ich irgendwann anders“). Claude fragt nicht bei jedem Einstieg nach, sondern prüft es nur vor einer Veröffentlichung nach `main` und nennt es dann im Bericht. Stand 23.11.2026 abends: laut GitHub noch ungeschützt. **Engine-Schnellprüfung als Pflicht-Check?** Erst nach einigen Wochen ohne hängende Browser-Downloads (BACKLOG).

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
