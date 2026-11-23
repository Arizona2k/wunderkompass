# STATUS

Stand: 23.11.2026. Kurz und aktuell halten (unter 60 Zeilen). Verlauf steht in [CHANGELOG.md](CHANGELOG.md), Aufgaben in [BACKLOG.md](BACKLOG.md).

## Wo wir stehen

- **Schritt 0 „Großputz & Arbeitsweise“** ist seit 21.11.2026 in `test-live` (PR #96, `a0ec975`): schlanke Prüfkette, Browser-Runner, kurze Unterlagen, sechs Helfer, `/weiter` und `/pruefen`. Plan und Entscheidungen in `docs/entwurf/2026-11-21-schritt-0-*.md`. Der alte Stand liegt vollständig in Commit `b53f75f`.
- **Katalog „WunderKompass 2027“** eingeordnet ([Einordnung](docs/entwurf/2026-11-21-katalog-2027-einordnung.md)), Audit V2 nachgeprüft (18 von 19 behoben); in `test-live` (PR #97, `5cf70fa`).
- **Phase 1, Teilschritt 1 „Aussehen und Hülle“** ist seit 21.11.2026 in `test-live` (PR #99, `6f43eb5`; siehe CHANGELOG). Entscheidungen beim Bauen: [Liste](docs/entwurf/2026-11-21-phase-1-teilschritt-1-entscheidungen.md). Firefox-Testrennen und WebKit-Fehler der Buchleiste behoben; drei WebKit-Fehler gab es schon vorher. Die CI-Vollprüfung danach fand je einen neuen Fehler in Chromium, Firefox und WebKit; behoben in Schritt 0 von Teilschritt 2 (nächster Punkt). Playwright 1.65.1, alle drei Browser laufen im Container. `pnpm run check` grün (314 Unit-Tests, 14 Browser-Suiten), Rauchtest auf der Testseite grün. Startdateien kleiner als vorher (JS 975 734 statt 985 613 Byte, CSS 344 657 statt 348 485).
- **Teilschritt 2, Schritt 0** (21.11.2026, PR #102, seit 22.11.2026 in `test-live`, `176cd08`): Drei neue CI-Fehler lagen an Tests und Werkzeug, dazu behoben: alter WebKit-Fehler `engine-journeys`, ResizeObserver-Schleife der Buchleiste, Startfrage mit langem Wort am kleinen Handy (Test prüft alle 56). Offen bleiben die alten WebKit-Fehler `backup` und `offline-cold`. Ausgangsgrößen gemessen, Bildkandidaten für Zeitreise und Erfindungen gesammelt ([Liste](docs/entwurf/2026-11-21-bilder-zeitreise-erfindungen.md)).
- **Teilschritt 2, Teil A „Neue Karte“** ist seit 22.11.2026 in `test-live` (PR #103, `40a0f0b`): neue Wissenskarte (Rate mal!, Kurz erklärt, Steckbrief, Ausprobieren lädt beim Öffnen, Mehr erfahren, Dazu passt, Rückweg-Link), alte Karte entfernt, Lernreisen einfach zuerst; siehe CHANGELOG. Behoben: Der Pass verlor beim Laden Spielstände über 256 (BACKLOG 18).
- **Teilschritt 2, Teil B „Kürzer und verbunden“** (23.11.2026, eigener PR nach `test-live`, „ok“ des Nutzers am 23.11.2026, Merge nach grüner CI): jede Karte mit erklärtem Nachbarn (30 neue Verbindungen), Karten aufgeräumt, zwölf Pilot-Karten im neuen Stil (Häppchen, „Stimmt das?“, Zusatzfragen), frühere Antworten bleiben, nach falscher Antwort kommt man zur selben Frage zurück; Prüfstand im CHANGELOG. Schlussprüfung durch einen frischen Prüfer auf dem stärksten Modell: „mit Korrekturen“, behoben bzw. mit Grund verschoben (BACKLOG 23). Dazu im selben PR: Ergänzung „Stufen“ (freigegeben 23.11.2026) und Helfer `stufen-pruefer`.
- PR #95 (acht Geschichtsthemen) liegt auf Branch `codex/wunderkompass-history-evidence-2026-11-08`, Commit `7e00bd0`; Übernahme in Phase 3.

## Adressen

- **Testseite** (neuester freigegebener Stand, Branch `test-live`): https://wunderkompass-git-c76589-interaktive-wissens-und-lernplattform.vercel.app/
- **Für Freunde** (Branch `main`, nur nach Phasen-Freigabe): https://wunderkompass.vercel.app/

## Nächster Schritt

Phase 1 „Neuer Kern“ ([Entwurf](docs/entwurf/2026-11-21-phase-1-entwurf.md), [Ergänzung „Weniger lesen, mehr knobeln“](docs/entwurf/2026-11-21-phase-1-ergaenzung-spannung.md), darin die Rückmeldung eines 10-jährigen Kindes: zu viel Text, zu leicht), sechs Teilschritte:

1. **Aussehen und Hülle** – fertig, in `test-live` ([Plan](docs/entwurf/2026-11-21-phase-1-plan-teilschritt-1.md)): Schrift Nunito, Farben, eine Leiste mit sechs Bereichen, ruhiger Kopf, neuer Fuß, „Was ist neu?“ für Kinder.
2. **Wissenskarte** – fast fertig ([Plan](docs/entwurf/2026-11-21-phase-1-plan-teilschritt-2.md)). Schritt 0 und Teil A in `test-live`, Teil B hat das „ok“ (Merge nach grüner CI).
3. **Kniffliger spielen** – als Nächstes, mit der [Ergänzung „Leicht, knifflig, richtig knifflig“](docs/entwurf/2026-11-23-phase-1-ergaenzung-stufen.md) ([Prüfbericht Pilot-Karten](docs/entwurf/2026-11-23-stufen-pruefung-pilotkarten.md)); zuerst die gemeinsamen Test-Bausteine für die Karte (BACKLOG).
4. Weltenseiten und Bilder · 5. Startseite und Sammlung · 6. Feinschliff und Abschluss.

## Offene Fragen an den Nutzer

- Vorschlag: „Ganz einfach“ auf allen Karten offen, die schweren Absätze unter „Für Große“ (BACKLOG 17).

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
