# STATUS

Stand: 25.11.2026. Kurz halten: ein Satz je fertigem Schritt, Verlauf in [CHANGELOG.md](CHANGELOG.md), Aufgaben in [BACKLOG.md](BACKLOG.md).

## Wo wir stehen

Fertig und in `test-live` (Einzelheiten im CHANGELOG; alter Stand mit allen Berichten in Commit `b53f75f`):
- Schritt 0 „Großputz“ (PR #96), Einordnung Katalog 2027 (PR #97, [Einordnung](docs/entwurf/2026-11-21-katalog-2027-einordnung.md)).
- Phase 1, Teilschritt 1 „Aussehen und Hülle“ (PR #99) und Teilschritt 2 „Wissenskarte“ (PR #102 bis #104), dazu die abgesicherte Arbeitsweise (PR #105).
- Teilschritt 3 „Kniffliger spielen“ ([Entwurf und Plan](docs/entwurf/2026-11-23-phase-1-teilschritt-3.md)): Arbeitssystem (PR #106), Teil A „Eine Stufe für alles“ (PR #107, [Entscheidungen](docs/entwurf/2026-11-23-teilschritt-3-teil-a-entscheidungen.md)), Folge-PR (PR #108), Stufen-Feinschliff (PR #109, [Entscheidungen](docs/entwurf/2026-11-24-stufen-feinschliff-entscheidungen.md)), Teil B Vorarbeiten (PR #110), Teil B PR 1 = Welt-Spiele mit Stufen (PR #111, [Entscheidungen 1 bis 18](docs/entwurf/2026-11-24-teil-b-entscheidungen.md)).
- Teil B PR 2 = Kreuz und quer und die Klassik-Spiele mit Stufen (PR #114, [Entscheidungen 19 bis 35](docs/entwurf/2026-11-24-teil-b-entscheidungen.md), [Design-Prüfung](docs/entwurf/2026-11-24-teil-b-pr2-design-pruefung.md)).
- Technik-PR nach den Analysen (PR #116): Speichern nach Fehlern mit wachsender Pause, eine Größengrenze für Sicherungen, feste Paketversionen.
- Bilder-Strang, erster Teil (PR #113): alle 24 KI-Tierbilder durch Fotos ersetzt, 8 Personen, Einbau-Werkzeug `scripts/foto-einbau.mjs`.
- **Entschieden am 25.11.2026:** Der Nutzer nimmt beide Empfehlungen an: die Regel „neue oder geänderte Vollprüfungs-Suite vor dem Commit selbst laufen lassen“ (jetzt in `CLAUDE.md`, Arbeitsablauf Punkt 4) und zwei Stilproben fürs Design, mit dem Auftrag „beim Design sei kreativ“.
- **Entschieden am 25.11.2026 (Design):** Der Nutzer folgt der Empfehlung: Stilprobe C „Kompass“ wird das neue Design, der Stempel kommt am Spielende. Dazu freie Hand bei Anordnung, Reihenfolge, Überschriften, Leisten und Darstellung, auch für künftige Erweiterungen (Regel „Gestaltung frei“ in `CLAUDE.md`).
- **Merge-Freigabe des Nutzers** für alle Teil-B-PRs nach grüner CI samt Engine-Schnellprüfung; Abweichungen vom Plan vorher melden (Entscheidungen 11 und 19).

## Adressen

- **Testseite** (`test-live`, alle benutzen nur diese): https://wunderkompass-git-c76589-interaktive-wissens-und-lernplattform.vercel.app/
- **Vorschau** (`vorschau`, eigener Pass, nur zum Ansehen): https://wunderkompass-git-f420d3-interaktive-wissens-und-lernplattform.vercel.app/
- Älterer Stand (`main`, nicht genutzt, nicht gebaut): https://wunderkompass.vercel.app/. Vercel baut nur `test-live` und `vorschau` (Tageslimit 100, Regeln in `CLAUDE.md`).

## Nächster Schritt

Phase 1 hat sechs Teilschritte: 1 Hülle (fertig) · 2 Wissenskarte (fertig) · **3 Kniffliger spielen** · 4 Weltenseiten und Bilder · 5 Startseite und Sammlung · 6 Feinschliff.

1. **Personen-Rätsel einbauen** (BACKLOG Punkt 25; gebaut, Helfer haben gelesen, Prüfung läuft): [Endfassung](docs/entwurf/2026-11-25-personen-raetsel-endfassung.md), Abschnitt 7 gilt vor 1 und 2. Bauen: eigene Rätsel, Satz 1 für Entdecker, Gebiete und Paarlisten als Daten in `app/world-game-fallen.json`, Profi mit zwei Gebietsfallen, Entdecker-Tipp mit Stufe in `worldGameHint` und `worldGameWrongFeedback`, Kartenkorrekturen (Abschnitt 4), Tests (Goodall in `tests/world-game-runde.test.mjs`). Danach `pnpm run check` und `node tests/browser/run.mjs --suite full core offline-cold-full`. Messskript: `docs/entwurf/2026-11-25-personen-raetsel-messung/regel.mjs`.
2. **Design-Umbau „Kompass“:** Entwurf für den Umbau in Schritten (zuerst Farben, Schriften und Bausteine im Kern `app/kern/`, dann Leiste und Start, Karte, Spiele), jeder Schritt mit Vorschau. Grundlage: [Stilproben](docs/entwurf/2026-11-25-stilproben.md) mit C, [Design-Prüfung C](docs/entwurf/2026-11-25-stilprobe-c-designpruefung.md), [Spieltest C](docs/entwurf/2026-11-25-stilprobe-c-spieltest.md), [Bestand Einheitlichkeit](docs/entwurf/2026-11-24-design-einheitlichkeit-bestand.md).
3. **Dann PR 3 = Aufgaben 10 und 12** („Rekorde der Natur“, „Wetter und Klima“, „Sortiere die Zeit“, kleine Spiele zusammenlegen) mit dem [Experten-Nachtrag](docs/entwurf/2026-11-24-stimmt-das-experte-nachtrag-endfassung.md) und der kleinen CI-Suite `spiel-fokus` (BACKLOG). Dann PR 4 = Länder ([Ideen](docs/entwurf/2026-11-24-laender-spiele-ideen.md)).
4. **Bilder im Hintergrund** (BACKLOG Punkt 26): Mandela einbauen (`File:Nelson Mandela 1994.jpg`, [Bericht](docs/entwurf/2026-11-24-bilder-mandela.md)), dann Zeitreise und Erfindungen ([Nachsuche](docs/entwurf/2026-11-25-bilder-zeitreise-erfindungen-nachsuche.md)).

## Helfer beim Einstieg

Gleich nach `/weiter` starten diese Helfer im Hintergrund (Regel „Helfer starten mit jedem Chat“ in `CLAUDE.md`). Hier bei jedem Meilenstein nachführen.
- `code-pruefer`: den Einbau der Personen-Rätsel prüfen, sobald er steht (vorher nichts).
- `fakten-pruefer`, `kinder-redaktion`, `stufen-pruefer`: die vier neuen Sätze aus Abschnitt 7 der [Endfassung](docs/entwurf/2026-11-25-personen-raetsel-endfassung.md) gegenlesen (wer sie nicht vorgeschlagen hat), dazu den Einbau.
- `karten-autor`: gerade nichts (Rätsel fertig; PR-3-Texte liegen geprüft vor).
- `bild-recherche`: Zeitreise und Erfindungen ohne Bild weiter ([Nachsuche](docs/entwurf/2026-11-25-bilder-zeitreise-erfindungen-nachsuche.md)).
- `design-pruefer` und `spieltester`: beim nächsten sichtbaren PR (Personen-Rätsel) und wenn der Nutzer das Design gewählt hat.
- `technik-pruefer`: gerade nichts (nur nach einem späten Fund).
- `ideen-scout`: gerade nichts (Design- und Länder-Ideen liegen vor).

## Offene Fragen an den Nutzer

- **`spieltester`** ist Pilot (seit 24.11.2026); nach einigen Einsätzen gemeinsam entscheiden, ob er bleibt.
- **`main` schützen** macht der Nutzer selbst; Claude prüft es nur vor einer Veröffentlichung nach `main`. **Engine-Schnellprüfung als Pflicht-Check?** Erst nach einigen ruhigen Wochen (BACKLOG).

## Vorübergehende Modell-Ausnahmen

Keine.

## Archivierte Browser-Tests

Nur im alten Stand (`git show b53f75f:tests/browser/<name>.mjs`): `audio`, `globe`, `legacy-games`, `responsive`, `usability`, `world-games`, `critical` (Fall „beschädigter Speicherstand“ im BACKLOG).

## Neuer Chat: Startnachricht

Neue Chats in der Cloud-Umgebung **„wunderkompass“** starten. Diesen Text in den neuen Chat kopieren:

```text
Wir arbeiten weiter an WunderKompass (Repository Arizona2k/wunderkompass).
Der aktuelle Stand liegt auf test-live (Standardbranch), main ist ein älterer Stand und wird zurzeit nicht genutzt.
Prüfe zuerst, ob dein Arbeitsbranch (claude/...) den test-live-Stand hat, mit genau diesen Zeilen:

git fetch origin main test-live
B=$(git branch --show-current)
if git merge-base --is-ancestor origin/test-live HEAD; then echo "Branch hat schon den test-live-Stand."
elif [ "$B" != main ] && { [ -z "$(git log --oneline origin/main..HEAD)" ] || [ -z "$(git log --oneline origin/test-live..HEAD)" ]; }; then git checkout --no-track -B "$B" origin/test-live
else echo "STOPP: Branch nicht automatisch umstellbar. Erst nachfragen."; fi

Dann CLAUDE.md und STATUS.md lesen und /weiter ausführen.
Fehlt /weiter (Kurzbefehle laden beim Sitzungsstart vom alten Stand), lies .claude/skills/weiter/SKILL.md und führe die Schritte von Hand aus.
```
