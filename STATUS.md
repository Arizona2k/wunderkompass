# STATUS

Stand: 25.11.2026. Kurz halten: ein Satz je fertigem Schritt, Verlauf in [CHANGELOG.md](CHANGELOG.md), Aufgaben in [BACKLOG.md](BACKLOG.md).

## Wo wir stehen

Fertig und in `test-live` (Einzelheiten im CHANGELOG; alter Stand mit allen Berichten in Commit `b53f75f`):
- Schritt 0 „Großputz“ (PR #96), Einordnung Katalog 2027 (PR #97, [Einordnung](docs/entwurf/2026-11-21-katalog-2027-einordnung.md)).
- Phase 1, Teilschritt 1 „Aussehen und Hülle“ (PR #99) und Teilschritt 2 „Wissenskarte“ (PR #102 bis #104), dazu die abgesicherte Arbeitsweise (PR #105).
- Teilschritt 3 „Kniffliger spielen“ ([Entwurf und Plan](docs/entwurf/2026-11-23-phase-1-teilschritt-3.md)): Arbeitssystem (PR #106), Teil A „Eine Stufe für alles“ (PR #107, [Entscheidungen](docs/entwurf/2026-11-23-teilschritt-3-teil-a-entscheidungen.md)), Folge-PR (PR #108), Stufen-Feinschliff (PR #109, [Entscheidungen](docs/entwurf/2026-11-24-stufen-feinschliff-entscheidungen.md)), Teil B Vorarbeiten (PR #110), Teil B PR 1 = Welt-Spiele mit Stufen (PR #111, [Entscheidungen 1 bis 18](docs/entwurf/2026-11-24-teil-b-entscheidungen.md)).
- Teil B PR 2 = Kreuz und quer und die Klassik-Spiele mit Stufen (PR #114, [Entscheidungen 19 bis 35](docs/entwurf/2026-11-24-teil-b-entscheidungen.md), [Design-Prüfung](docs/entwurf/2026-11-24-teil-b-pr2-design-pruefung.md)).
- Technik-PR nach den Analysen (PR #116): Speichern nach Fehlern mit wachsender Pause, eine Größengrenze für Sicherungen, feste Paketversionen.
- Personen-Rätsel „Wer war das?“ (PR #117, [Endfassung](docs/entwurf/2026-11-25-personen-raetsel-endfassung.md)): eigenes Rätsel für alle 36 Menschen, Entdecker liest Satz 1, Fallen nach Gebiet.
- „Auflösung und Rückmeldung im Blick“ (PR #118, [Endfassung](docs/entwurf/2026-11-25-spiel-aufloesung-endfassung.md)): kurze Auflösung je Person nach „Richtig!“, Tipps in Kinderton, Rückmeldung nach jeder Antwort ganz über der Leiste.
- Technik-Detektiv „So funktioniert die Erfindung“ (PR #119, [Endfassung](docs/entwurf/2026-11-25-technik-aufloesung-endfassung.md), [Nachtrag mit Entscheidungen](docs/entwurf/2026-11-25-technik-aufloesung-nachtrag-entwurf.md#7-entscheidungen)): kurze Auflösung für alle 24 Erfindungen (Smartphone erklärt Telefonieren und Rechnen), neuer Tipp, eigener Satz nach falscher Antwort, neue Frage nicht hinter der Leiste.
- Bilder-Strang, erster Teil (PR #113): alle 24 KI-Tierbilder durch Fotos ersetzt, 8 Personen, Einbau-Werkzeug `scripts/foto-einbau.mjs`.
- **Entschieden am 25.11.2026:** Der Nutzer nimmt beide Empfehlungen an: die Regel „neue oder geänderte Vollprüfungs-Suite vor dem Commit selbst laufen lassen“ (jetzt in `CLAUDE.md`, Arbeitsablauf Punkt 4) und zwei Stilproben fürs Design, mit dem Auftrag „beim Design sei kreativ“.
- **Entschieden am 25.11.2026 (Design):** Der Nutzer folgt der Empfehlung: Stilprobe C „Kompass“ wird das neue Design, der Stempel kommt am Spielende. Dazu freie Hand bei Anordnung, Reihenfolge, Überschriften, Leisten und Darstellung, auch für künftige Erweiterungen (Regel „Gestaltung frei“ in `CLAUDE.md`).
- **Entschieden am 25.11.2026 (Nachtmodus):** Den Zeitpunkt entscheidet Claude; geplant als Umbau-Schritt 8 „Nachtkarte“ nach Schritt 7 ([Entwurf](docs/entwurf/2026-11-25-design-umbau.md), Abschnitt „Später: Schritt 8“).
- **Freigabe am 25.11.2026:** Der Nutzer gibt den [Design-Umbau-Entwurf](docs/entwurf/2026-11-25-design-umbau.md) frei und sein OK zum Merge für die kommenden PRs (Personen-Rätsel, „Auflösung und Rückmeldung im Blick“, Umbau-Schritte 1 bis 8, PR 3 und 4), jeweils nach grüner CI samt Engine-Schnellprüfung („du hast meine freigaben und auch mein ok“). Vorschau und Screenshots bekommt er weiterhin vor jedem Merge einer sichtbaren Änderung; Befunde des `code-pruefer` zum Entwurf fließen noch ein.
- **Entschieden am 25.11.2026 (Regel):** Der Nutzer nimmt die Empfehlung „Engine-Sonderverhalten“ an (jetzt in `CLAUDE.md`, Arbeitsablauf Punkt 4).
- **Merge-Freigabe des Nutzers** für alle Teil-B-PRs nach grüner CI samt Engine-Schnellprüfung; Abweichungen vom Plan vorher melden (Entscheidungen 11 und 19).

## Adressen

- **Testseite** (`test-live`, alle benutzen nur diese): https://wunderkompass-git-c76589-interaktive-wissens-und-lernplattform.vercel.app/
- **Vorschau** (`vorschau`, eigener Pass, nur zum Ansehen): https://wunderkompass-git-f420d3-interaktive-wissens-und-lernplattform.vercel.app/
- Älterer Stand (`main`, nicht genutzt, nicht gebaut): https://wunderkompass.vercel.app/. Vercel baut nur `test-live` und `vorschau` (Tageslimit 100, Regeln in `CLAUDE.md`).

## Nächster Schritt

Phase 1 hat sechs Teilschritte: 1 Hülle (fertig) · 2 Wissenskarte (fertig) · **3 Kniffliger spielen** · 4 Weltenseiten und Bilder · 5 Startseite und Sammlung · 6 Feinschliff.

1. **Design-Umbau Schritt 1 „Farben, Fokus, Knöpfe“** (fertig gebaut auf `claude/gracious-hypatia-a2jweq`; [Bauplan](docs/entwurf/2026-11-25-umbau-schritt-1-bauplan.md)). Gebaut: Kompass-Farben und Fokusrahmen, gleiche Knöpfe (48 px, 16 bis 18 px Schrift), Auswahl Blaugrün, Rückmeldekästen neutral und weiß, Kreuz bei falschen Antworten, „Richtig!“ überall 20 px. Helfer fertig: [Spieltest](docs/entwurf/2026-11-25-umbau-schritt-1-spieltest.md), [Code-Prüfung](docs/entwurf/2026-11-25-umbau-schritt-1-codepruefung.md), [Design-Prüfung](docs/entwurf/2026-11-25-umbau-schritt-1-design-pruefung.md); Muss-Befunde eingebaut, der Rest je Schritt in BACKLOG Punkt 29. Noch offen: `pnpm run check` grün, `kern-huelle`, `karte-stufen`, `spiel-fokus`, `pass-atlas` einzeln in Firefox und WebKit, `node tests/browser/run.mjs --suite full core offline-cold-full home home-visits components journeys`, Vorschau, PR nach `test-live`, Merge nach grüner CI (OK des Nutzers liegt vor: „Ok fürs mergen“, 25.11.2026), danach CHANGELOG-Messwerte.
2. **Danach eigener PR: Tier-Auflösungen** (Tierdetektiv, Tierzuhause, Futter), Kartenkorrekturen (Benz, Aufzug, Licht, Kühlschrank), Sätze nach falscher Antwort, Fallen bereinigen. Die [Endfassung](docs/entwurf/2026-11-25-tier-aufloesung-endfassung.md) liegt vor ([Texte mit Quellen](docs/entwurf/2026-11-25-tier-aufloesung-endfassung-texte.md), [Einbau-Datei](docs/entwurf/2026-11-25-tier-aufloesung-endfassung.json)); `fakten-pruefer` (zwei Pakete), `kinder-redaktion` und `stufen-pruefer` lesen seit 25.11.2026 nur die geänderten Stellen (Berichte als `…-tier-aufloesung-nachpruefung-*.md` sichern; fehlen sie, neu beauftragen). Offene Punkte für Claude stehen in der Endfassung, Abschnitt 5 (wirbellos-Formel 4-mal, „Deine Wahl“/„Deine Antwort“, Licht-Fixture `tests/fixtures/retained-optical-game-banks.json`, gestrichene Fallen in gespeicherten Runden). Einbau: `AUFLOESUNG` in `app/world-game-support.mjs`, `app/world-game-tier-fallen.json`, Kartenfelder, Rückmeldesätze; Tests `tests/world-game-learning-copy.test.mjs` und `tests/world-game-runde.test.mjs` anpassen.
3. **Design-Umbau „Kompass“:** [Entwurf in sieben Schritten](docs/entwurf/2026-11-25-design-umbau.md) (freigegeben am 25.11.2026; Gegenlesen durch `code-pruefer`, Bericht `…-design-umbau-codepruefung.md`). Schritt 1 Farben, Fokus, Knöpfe; 2 Schriften; 3 Hülle; 4 Start und Welten; 5 Karte; 6 Spielbrett mit Stempel am Spielende; 7 Rest und Aufräumen. [Bestand im Code](docs/entwurf/2026-11-25-design-umbau-bestand.md).
4. **PR 3 = Aufgaben 10 und 12** („Rekorde der Natur“, „Wetter und Klima“, „Sortiere die Zeit“, kleine Spiele zusammenlegen) mit dem [Experten-Nachtrag](docs/entwurf/2026-11-24-stimmt-das-experte-nachtrag-endfassung.md), nach Umbau-Schritt 2 und vor Schritt 6. Dann PR 4 = Länder ([Ideen](docs/entwurf/2026-11-24-laender-spiele-ideen.md)).
5. **Bilder im Hintergrund** (BACKLOG Punkt 26): Mandela einbauen (`File:Nelson Mandela 1994.jpg`, [Bericht](docs/entwurf/2026-11-24-bilder-mandela.md)), dann Zeitreise und Erfindungen ([Nachsuche](docs/entwurf/2026-11-25-bilder-zeitreise-erfindungen-nachsuche.md)), vor Umbau-Schritt 4 ein freies Foto für „Wissenschaft & Weltall“.

## Helfer beim Einstieg

Gleich nach `/weiter` starten diese Helfer im Hintergrund (Regel „Helfer starten mit jedem Chat“ in `CLAUDE.md`). Hier bei jedem Meilenstein nachführen.
- `fakten-pruefer` (zwei Pakete), `kinder-redaktion`, `stufen-pruefer`: Nachprüfung der Tier-Endfassung (siehe Nächster Schritt 2), falls ihre Berichte noch fehlen.
- `design-pruefer`, `code-pruefer`, `spieltester`: Schritt 1 ist geprüft; wieder bei Umbau-Schritt 2.
- `bild-recherche`: Zeitreise Paket 4 (lief am 25.11.2026; Ziel `docs/entwurf/2026-11-25-bilder-zeitreise-paket-4.md`, sonst neu beauftragen); danach Erfindungen ohne Bild und ein freies Foto für „Wissenschaft & Weltall“ (Umbau-Schritt 4).
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
