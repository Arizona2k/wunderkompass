# STATUS

Stand: 24.11.2026. Kurz und aktuell halten (unter 60 Zeilen). Verlauf steht in [CHANGELOG.md](CHANGELOG.md), Aufgaben in [BACKLOG.md](BACKLOG.md).

## Wo wir stehen

- **Schritt 0 „Großputz & Arbeitsweise“** (PR #96, `a0ec975`) und die **Einordnung des Katalogs „WunderKompass 2027“** (PR #97, `5cf70fa`, [Einordnung](docs/entwurf/2026-11-21-katalog-2027-einordnung.md)) sind seit 21.11.2026 in `test-live`. Ebenso **Phase 1, Teilschritt 1 „Aussehen und Hülle“** (PR #99, `6f43eb5`, [Entscheidungen](docs/entwurf/2026-11-21-phase-1-teilschritt-1-entscheidungen.md)). Der alte Stand liegt vollständig in Commit `b53f75f`.
- **Phase 1, Teilschritt 2 „Wissenskarte“** ist fertig und in `test-live` ([Plan](docs/entwurf/2026-11-21-phase-1-plan-teilschritt-2.md), [Entscheidungen und verschobene Kleinigkeiten](docs/entwurf/2026-11-23-phase-1-teilschritt-2-entscheidungen.md)): Schritt 0 (PR #102), Teil A „Neue Karte“ (PR #103, `40a0f0b`), Teil B „Kürzer und verbunden“ (PR #104, `4b5bdb1`) mit der Ergänzung „Stufen“ und dem Helfer `stufen-pruefer`. Geprüft und offen gebliebene Befunde: [Entscheidungen](docs/entwurf/2026-11-23-phase-1-teilschritt-2-entscheidungen.md), BACKLOG Punkt 23.
- **Arbeitsweise abgesichert** (23.11.2026, PR #105): Helfer müssen laufen (Helfer-Check in `/weiter`, Ersatz von Hand, technik-pruefer nach jedem späten Fehler), nichts geht beim Chatwechsel verloren (`CLAUDE.md`, „Übergabe beim Chatwechsel“), Aufräumen gilt auch fürs Arbeiten. Bericht des technik-pruefer: [Technik-Prüfung](docs/entwurf/2026-11-23-technik-pruefung.md).
- **Phase 1, Teilschritt 3 „Kniffliger spielen“ hat begonnen** (23.11.2026, PR #106, am 23.11.2026 freigegeben und in `test-live`): Das Arbeitssystem ist umgebaut ([Entscheidungsliste](docs/entwurf/2026-11-23-teilschritt-3-arbeitssystem-entscheidungen.md)): gemeinsame Test-Bausteine mit Wächter, Vollprüfung in sieben Gruppen (je höchstens 75 Minuten, mit den Zeiten aus CI-Lauf 262 ausgeglichen), Engine-Schnellprüfung (CI-Satz in Firefox und WebKit bei jedem PR, kein Pflicht-Check), `solar-labels` im CI-Satz, Datentest gegen doppeltes „Ganz einfach“, 61 alte Dateien und 14 ungenutzte Pakete entfernt. Dazu zwei Firefox-Funde: React lässt Firefox manche Fotos doppelt laden, und nach dem Neuladen bricht Firefox die Nachfrage zu einem gespeicherten Foto selbst ab. Die Überwachung erkennt genau diese zwei Fälle jetzt (Entscheidungsliste, Punkte 10 und 13). [Entwurf und Plan](docs/entwurf/2026-11-23-phase-1-teilschritt-3.md) sind freigegeben.
- **Teilschritt 3, Teil A „Eine Stufe für alles“ fertig und in `test-live`** ([PR #107](https://github.com/Arizona2k/wunderkompass/pull/107), gemergt am 24.11.2026 als `36c8fdd` nach grüner CI und „ok“; alle Entscheidungen: [Teil A](docs/entwurf/2026-11-23-teilschritt-3-teil-a-entscheidungen.md)):
  - Gebaut: Aufgaben 1 bis 6 (Stufe im Pass, Stufenwahl, Vorschläge, gemeinsame Wörter, Karte mit Stufen, „Ganz einfach“ offen mit 67 neuen Sätzen und 24 neuen Tier-Einleitungen). Geprüft von `karten-autor`/`stufen-pruefer`/`fakten-pruefer`/`kinder-redaktion`, Code-Prüfung und -Nachprüfung ([Bericht](docs/entwurf/2026-11-23-teil-a-code-pruefung.md), [Nachprüfung](docs/entwurf/2026-11-23-teil-a-code-nachpruefung.md)), Design-Prüfung ([Bericht](docs/entwurf/2026-11-24-teil-a-design-pruefung.md), [Code-Nachprüfung dazu](docs/entwurf/2026-11-24-teil-a-code-nachpruefung-design.md)); inhaltliche Design-Befunde im BACKLOG.
  - Browser: alle großen Suiten nach Teil A mindestens einmal grün in Chromium, auf dem Endstand `pnpm run check` (437 Unit-Tests) und `--suite full core`, die geänderten CI-Suiten auch in Firefox und WebKit. Fünf späte Funde (drei im Test, zwei auf der Seite), alle behoben und vom `technik-pruefer` nachgeprüft ([1](docs/entwurf/2026-11-23-teil-a-technik-pruefung.md), [2](docs/entwurf/2026-11-23-teil-a-technik-pruefung-core-fund.md), [3](docs/entwurf/2026-11-24-teil-a-technik-pruefung-offline-fund.md), [4](docs/entwurf/2026-11-24-teil-a-technik-pruefung-webkit-fund.md)); zwei davon prüft jetzt der CI-Satz. Der letzte: Nach einem Stufenwechsel sprang der Fokus kurz weg; jetzt setzt die Seite ihn noch im Tipp (`flushSync`), vom `code-pruefer` ohne Fehler geprüft ([Bericht](docs/entwurf/2026-11-24-teil-a-code-pruefung-flushsync.md)). Danach zeigte `pnpm run check` einmal einen zeitweisen Testfehler: WebKit brach offline Bilder ab, weil ein Test zu früh neu lud; im Test behoben, vom `code-pruefer` geprüft ([Bericht](docs/entwurf/2026-11-24-teil-a-code-pruefung-offline-wartehilfe.md)). Auf dem Endstand `7900f38` (danach nur Unterlagen) grün: `pnpm run check`, `offline-cold` in allen drei Browsern, `offline-cold-full`; die Karten- und Pass-Suiten auf `ae5810c` in allen drei Browsern, `--suite full core` auf `0322422` (danach nur Tests und Kommentare).
- **Folge-PR „Entscheidungen zu Teil A“** ([PR #108](https://github.com/Arizona2k/wunderkompass/pull/108), Merge nach grüner CI freigegeben): die sechs Antworten des Nutzers umgesetzt (Paketspiegel in der CI, Größenvergleich gestrichen, `CLAUDE.md` Punkt 4, Stresslauf `QA_FRAME_DELAY_MS` in `/pruefen`). Dazu zwei späte Funde aus seiner CI, beide nur im Test, beide behoben ([Entscheidungsliste, letzte zwei Abschnitte](docs/entwurf/2026-11-23-teilschritt-3-teil-a-entscheidungen.md)): In WebKit war einmal das Suchfeld leer, als die Kapiteltexte während des Tippens kamen; jetzt prüft ein eigener Test genau diesen Moment mit echtem Tippen in allen drei Browsern ([Technik-Prüfung](docs/entwurf/2026-11-24-folge-pr-teil-a-technik-pruefung-suchfund.md)). In Firefox war der Rauchtest rot, wenn die Startseite zufällig das Riff-Foto zeigte und der Test zu früh weiterging; jetzt wartet er, bis die Startseite fertig ist ([Technik-Prüfung](docs/entwurf/2026-11-24-folge-pr-teil-a-technik-pruefung-firefox-smoke.md)). Dazu der neue Helfer `spieltester` (Pilot) mit einem ersten Probelauf an den Stufen ([Bericht](docs/entwurf/2026-11-24-spieltester-probelauf-stufen.md)): zwei bestätigte Fehler und weitere Befunde, alle im BACKLOG (Phase 1, Punkt 12, „Stufen-Feinschliff aus dem ersten Spieltest“), noch nichts geändert.

## Adressen

- **Testseite** (neuester freigegebener Stand, Branch `test-live`): https://wunderkompass-git-c76589-interaktive-wissens-und-lernplattform.vercel.app/
- **Für Freunde** (Branch `main`, nur nach Phasen-Freigabe): https://wunderkompass.vercel.app/

## Nächster Schritt

Phase 1 „Neuer Kern“ ([Entwurf](docs/entwurf/2026-11-21-phase-1-entwurf.md), [Ergänzung „Weniger lesen, mehr knobeln“](docs/entwurf/2026-11-21-phase-1-ergaenzung-spannung.md), darin die Rückmeldung eines 10-jährigen Kindes: zu viel Text, zu leicht), sechs Teilschritte: 1. Aussehen und Hülle (fertig) · 2. Wissenskarte (fertig) · **3. Kniffliger spielen** · 4. Weltenseiten und Bilder · 5. Startseite und Sammlung · 6. Feinschliff und Abschluss.

**Teilschritt 3 „Kniffliger spielen“:** [Entwurf und Plan](docs/entwurf/2026-11-23-phase-1-teilschritt-3.md) (Grundlage: [Ergänzung Stufen](docs/entwurf/2026-11-23-phase-1-ergaenzung-stufen.md), [Prüfbericht Pilot-Karten](docs/entwurf/2026-11-23-stufen-pruefung-pilotkarten.md)). Darauf aufbauen, nicht neu ausdenken:

1. Je nach Antwort des Nutzers (Offene Fragen) zuerst der kleine **Stufen-Feinschliff** aus dem ersten Spieltest (BACKLOG Phase 1, Punkt 12: a, b und d mit einem Test je Fehler, c nach Entscheidung, e über `karten-autor` und `stufen-pruefer`), dann **Teil B** nach dem [Plan](docs/entwurf/2026-11-23-phase-1-teilschritt-3.md), am besten in einem neuen Chat. In Teil B zuerst: Linkwächter-Test, der zentrale Schritt „Seitenwechsel im Test“ (dabei die Suchtests aus BACKLOG „Suche: Getipptes war einmal weg“ auf `inSucheTippen` umstellen) und ein Blick auf das Startpaket (nur rund 750 Byte Luft, BACKLOG „Startpaket fast an seiner festen Grenze“). Dann Teil C.

## Offene Fragen an den Nutzer

- **Stufen nach dem ersten Spieltest** ([Bericht](docs/entwurf/2026-11-24-spieltester-probelauf-stufen.md), BACKLOG Phase 1, Punkt 12): Zuerst den kleinen Feinschliff oder gleich Teil B? Und sollen auf Profi und Experte nach den Fragen der Stufe die leichteren weiterlaufen oder kommt ein klarer Schluss („Alle Fragen dieser Stufe geschafft!“)? Empfehlung: Feinschliff zuerst, mit klarem Schluss. Der Helfer `spieltester` bleibt Pilot (Freigabe des Nutzers, 24.11.2026); nach einigen Einsätzen gemeinsam entscheiden, ob er bleibt.
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
