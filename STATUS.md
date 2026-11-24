# STATUS

Stand: 23.11.2026. Kurz und aktuell halten (unter 60 Zeilen). Verlauf steht in [CHANGELOG.md](CHANGELOG.md), Aufgaben in [BACKLOG.md](BACKLOG.md).

## Wo wir stehen

- **Schritt 0 „Großputz & Arbeitsweise“** (PR #96, `a0ec975`) und die **Einordnung des Katalogs „WunderKompass 2027“** (PR #97, `5cf70fa`, [Einordnung](docs/entwurf/2026-11-21-katalog-2027-einordnung.md)) sind seit 21.11.2026 in `test-live`. Ebenso **Phase 1, Teilschritt 1 „Aussehen und Hülle“** (PR #99, `6f43eb5`, [Entscheidungen](docs/entwurf/2026-11-21-phase-1-teilschritt-1-entscheidungen.md)). Der alte Stand liegt vollständig in Commit `b53f75f`.
- **Phase 1, Teilschritt 2 „Wissenskarte“** ist fertig und in `test-live` ([Plan](docs/entwurf/2026-11-21-phase-1-plan-teilschritt-2.md), [Entscheidungen und verschobene Kleinigkeiten](docs/entwurf/2026-11-23-phase-1-teilschritt-2-entscheidungen.md)):
  - Schritt 0 (PR #102), Teil A „Neue Karte“ (PR #103, `40a0f0b`), Teil B „Kürzer und verbunden“ (PR #104, `4b5bdb1`) mit der Ergänzung „Stufen“ und dem Helfer `stufen-pruefer`. Geprüft und offen gebliebene Befunde: [Entscheidungen](docs/entwurf/2026-11-23-phase-1-teilschritt-2-entscheidungen.md), BACKLOG Punkt 23.
- **Arbeitsweise abgesichert** (23.11.2026, PR #105): Helfer müssen laufen (Helfer-Check in `/weiter`, Ersatz von Hand, technik-pruefer nach jedem späten Fehler), nichts geht beim Chatwechsel verloren (`CLAUDE.md`, „Übergabe beim Chatwechsel“), Aufräumen gilt auch fürs Arbeiten. Bericht des technik-pruefer: [Technik-Prüfung](docs/entwurf/2026-11-23-technik-pruefung.md).
- **Phase 1, Teilschritt 3 „Kniffliger spielen“ hat begonnen** (23.11.2026, PR #106, am 23.11.2026 freigegeben und in `test-live`): Das Arbeitssystem ist umgebaut ([Entscheidungsliste](docs/entwurf/2026-11-23-teilschritt-3-arbeitssystem-entscheidungen.md)): gemeinsame Test-Bausteine mit Wächter, Vollprüfung in sieben Gruppen (je höchstens 75 Minuten, mit den Zeiten aus CI-Lauf 262 ausgeglichen), Engine-Schnellprüfung (CI-Satz in Firefox und WebKit bei jedem PR, kein Pflicht-Check), `solar-labels` im CI-Satz, Datentest gegen doppeltes „Ganz einfach“, 61 alte Dateien und 14 ungenutzte Pakete entfernt. Dazu zwei Firefox-Funde: React lässt Firefox manche Fotos doppelt laden, und nach dem Neuladen bricht Firefox die Nachfrage zu einem gespeicherten Foto selbst ab. Die Überwachung erkennt genau diese zwei Fälle jetzt (Entscheidungsliste, Punkte 10 und 13). [Entwurf und Plan](docs/entwurf/2026-11-23-phase-1-teilschritt-3.md) sind freigegeben.
- **Teilschritt 3, Teil A „Eine Stufe für alles“ in Arbeit** (Branch `claude/trusting-galileo-ck3o23`, noch kein PR; Entscheidungen: [Teil A](docs/entwurf/2026-11-23-teilschritt-3-teil-a-entscheidungen.md)):
  - Fertig und gepusht: Aufgaben 1 bis 6 (Stufe im Pass, Stufenwahl, Vorschläge, gemeinsame Wörter, Karte mit Stufen, „Ganz einfach“ offen mit 67 neuen Sätzen und 24 neuen Tier-Einleitungen, geprüft von `fakten-pruefer` und `kinder-redaktion`, zweimal nachgeprüft). Code-Prüfung ([Bericht](docs/entwurf/2026-11-23-teil-a-code-pruefung.md)) mit allen zehn Befunden umgesetzt (Entscheidungsliste, Abschnitt „Code-Prüfung Teil A“).
  - Große Browser-Prüfung (nur Chromium): alle Suiten mindestens einmal nach Teil A grün oder im Schlusslauf. Vier späte Funde: drei lagen im Test, einer auf der Seite (die Fotosynthese-Zeichnung lag unter dem zugeklappten „Für Große“, jetzt offen unter dem Satz); alle behoben und vom `technik-pruefer` nachgeprüft ([Bericht 1](docs/entwurf/2026-11-23-teil-a-technik-pruefung.md), [Bericht 2](docs/entwurf/2026-11-23-teil-a-technik-pruefung-core-fund.md), [Bericht 3](docs/entwurf/2026-11-24-teil-a-technik-pruefung-offline-fund.md)). Zwei davon prüft jetzt zusätzlich der CI-Satz (Rückweg aus der Lernroute in `wissenskarte`, alte Antwortreihe offline in `offline-cold`).
  - Code-Nachprüfung ([Bericht](docs/entwurf/2026-11-23-teil-a-code-nachpruefung.md)) umgesetzt. Schlusslauf grün: `core`, `offline-cold-full`, `home-visits`, `animal-native-zoom`, `research` in Chromium; die drei geänderten CI-Suiten auch in Firefox und WebKit ([Entscheidungsliste](docs/entwurf/2026-11-23-teilschritt-3-teil-a-entscheidungen.md#schlusslauf-24112026-nach-commit-b04aa69)).
  - Design-Prüfung ([Bericht](docs/entwurf/2026-11-24-teil-a-design-pruefung.md)): Stufenwahl als eigener Kasten, Vorschlag vor „Noch eine Frage“, „Prüfen“ größer, Abstände im Pass. Inhaltliche Befunde im BACKLOG (Entscheidungsliste, Abschnitt „Design-Prüfung“). Kurze Code-Nachprüfung dazu ([Bericht](docs/entwurf/2026-11-24-teil-a-code-nachpruefung-design.md)): Titel der Stufenwahl ist jetzt ihr vorgelesener Name, `karte-stufen` prüft den Ort des Vorschlags. Danach `pnpm run check` und `--suite full core` erneut.
- **PR #95 und #27 durchgesehen und geschlossen** ([Bericht](docs/entwurf/2026-11-23-pr-95-27-durchsicht.md)): Originalaufträge in `docs/archiv/auftrag-2026-10-13/`, Funde im BACKLOG, „Ganz einfach“-Vorlagen in Aufgabe 6. Die zwei Branches löscht der Nutzer auf GitHub (Knopf „Delete branch“ auf den PR-Seiten).

## Adressen

- **Testseite** (neuester freigegebener Stand, Branch `test-live`): https://wunderkompass-git-c76589-interaktive-wissens-und-lernplattform.vercel.app/
- **Für Freunde** (Branch `main`, nur nach Phasen-Freigabe): https://wunderkompass.vercel.app/

## Nächster Schritt

Phase 1 „Neuer Kern“ ([Entwurf](docs/entwurf/2026-11-21-phase-1-entwurf.md), [Ergänzung „Weniger lesen, mehr knobeln“](docs/entwurf/2026-11-21-phase-1-ergaenzung-spannung.md), darin die Rückmeldung eines 10-jährigen Kindes: zu viel Text, zu leicht), sechs Teilschritte: 1. Aussehen und Hülle (fertig) · 2. Wissenskarte (fertig) · **3. Kniffliger spielen** · 4. Weltenseiten und Bilder · 5. Startseite und Sammlung · 6. Feinschliff und Abschluss.

**Teilschritt 3 „Kniffliger spielen“:** [Entwurf und Plan](docs/entwurf/2026-11-23-phase-1-teilschritt-3.md) (Grundlage: [Ergänzung Stufen](docs/entwurf/2026-11-23-phase-1-ergaenzung-stufen.md), [Prüfbericht Pilot-Karten](docs/entwurf/2026-11-23-stufen-pruefung-pilotkarten.md)). Darauf aufbauen, nicht neu ausdenken:

1. Teil A abschließen: Nachlauf der großen Suiten auswerten, neu bauen, `pnpm run check`, `design-pruefer` in fünf Breiten, kurze Nachprüfung durch den `code-pruefer`, Vorschau-Link und Bilder, PR von Teil A nach `test-live`. Vor dem Merge `tests/fixtures/gespeicherte-antworten-teil-a.json` neu erzeugen, falls sich Antworten geändert haben.
2. Danach Teil B (zuerst der Linkwächter-Test, BACKLOG) und Teil C nach dem Plan.
3. Nebenbei: `journeys` (rund 23 bis 35 Minuten) teilen; darin steckt z. B. `learning-tasks` (allein 82 s). BACKLOG, „Vollprüfung dauert lange“.

## Offene Fragen an den Nutzer

- **Teil A (gesammelt in der Nacht zum 24.11.2026):** (1) Personenkarten: „Ganz einfach“ steht dort in „Ausprobieren“, nicht offen über den Absätzen (Abweichung vom Plan, Grund in der Entscheidungsliste). Einverstanden? (2) „Selbst beobachten“ und Lernziel aus PR #27 sind nicht übernommen (ungeprüft, oft Erwachsenensprache). Einverstanden? (3) Vorschlag des `technik-pruefer` für `CLAUDE.md`, Arbeitsablauf Punkt 4: betroffene Tests nach dem Auslöser suchen (Speicherschlüssel, Funktion), nicht nur nach dem Wortlaut, und nach Kartenänderungen `--suite full core offline-cold-full` laufen lassen (rund 3 Minuten mehr). Übernehmen? (4) Optional: den veralteten Größenvergleich im Build streichen (BACKLOG).
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
