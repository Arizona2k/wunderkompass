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
- Bilder-Strang, erster Teil (PR #113): alle 24 KI-Tierbilder durch Fotos ersetzt, 8 Personen, Einbau-Werkzeug `scripts/foto-einbau.mjs`.
- **Entschieden am 25.11.2026:** Der Nutzer nimmt beide Empfehlungen an: die Regel „neue oder geänderte Vollprüfungs-Suite vor dem Commit selbst laufen lassen“ (jetzt in `CLAUDE.md`, Arbeitsablauf Punkt 4) und zwei Stilproben fürs Design, mit dem Auftrag „beim Design sei kreativ“.
- **Entschieden am 25.11.2026 (Design):** Der Nutzer folgt der Empfehlung: Stilprobe C „Kompass“ wird das neue Design, der Stempel kommt am Spielende. Dazu freie Hand bei Anordnung, Reihenfolge, Überschriften, Leisten und Darstellung, auch für künftige Erweiterungen (Regel „Gestaltung frei“ in `CLAUDE.md`).
- **Entschieden am 25.11.2026 (Nachtmodus):** Den Zeitpunkt entscheidet Claude; geplant als Umbau-Schritt 8 „Nachtkarte“ nach Schritt 7 ([Entwurf](docs/entwurf/2026-11-25-design-umbau.md), Abschnitt „Später: Schritt 8“).
- **Freigabe am 25.11.2026:** Der Nutzer gibt den [Design-Umbau-Entwurf](docs/entwurf/2026-11-25-design-umbau.md) frei und sein OK zum Merge für die kommenden PRs (Personen-Rätsel, „Auflösung und Rückmeldung im Blick“, Umbau-Schritte 1 bis 8, PR 3 und 4), jeweils nach grüner CI samt Engine-Schnellprüfung („du hast meine freigaben und auch mein ok“). Vorschau und Screenshots bekommt er weiterhin vor jedem Merge einer sichtbaren Änderung; Befunde des `code-pruefer` zum Entwurf fließen noch ein.
- **Merge-Freigabe des Nutzers** für alle Teil-B-PRs nach grüner CI samt Engine-Schnellprüfung; Abweichungen vom Plan vorher melden (Entscheidungen 11 und 19).

## Adressen

- **Testseite** (`test-live`, alle benutzen nur diese): https://wunderkompass-git-c76589-interaktive-wissens-und-lernplattform.vercel.app/
- **Vorschau** (`vorschau`, eigener Pass, nur zum Ansehen): https://wunderkompass-git-f420d3-interaktive-wissens-und-lernplattform.vercel.app/
- Älterer Stand (`main`, nicht genutzt, nicht gebaut): https://wunderkompass.vercel.app/. Vercel baut nur `test-live` und `vorschau` (Tageslimit 100, Regeln in `CLAUDE.md`).

## Nächster Schritt

Phase 1 hat sechs Teilschritte: 1 Hülle (fertig) · 2 Wissenskarte (fertig) · **3 Kniffliger spielen** · 4 Weltenseiten und Bilder · 5 Startseite und Sammlung · 6 Feinschliff.

1. **Technik-PR „Technik-Detektiv: So funktioniert die Erfindung“** (gebaut, im Arbeitsbranch `claude/wunderkompass-weiter-tz194g`; Prüfkette, große Suiten, Vorschau und PR laufen in diesem Chat): 24 kurze Auflösungen, neuer Tipp, eigener Satz nach falscher Antwort, neuer Spieltext in der Suche, neue Frage nicht hinter der Leiste (S2 aus der [Technik-Prüfung](docs/entwurf/2026-11-25-spaeter-fund-fokusrahmen.md)), Rückmeldung höchstens 65 Zeichen breit. [Endfassung](docs/entwurf/2026-11-25-technik-aufloesung-endfassung.md), [Nachtrag mit Entscheidungen](docs/entwurf/2026-11-25-technik-aufloesung-nachtrag-entwurf.md#7-entscheidungen).
2. **Design-Umbau Schritt 1 „Farben, Fokus, Knöpfe“** (nach dem Merge des Technik-PR, am besten im neuen Chat): [Bauplan](docs/entwurf/2026-11-25-umbau-schritt-1-bauplan.md) mit Bestand und Prüfplan; „Was ist neu?“ dazu als Eintrag B aus dem [Entwurf](docs/entwurf/2026-11-25-neuigkeiten-technik-farben-entwurf.md) mit [Kinder-Redaktion](docs/entwurf/2026-11-25-neuigkeiten-technik-farben-kinderredaktion.md). Kleine Schritte nebenher: Kartenkorrekturen (BACKLOG, „Kartenkorrekturen dazu“), danach kurze Auflösungen für Tierdetektiv, Tierzuhause und Futter.
3. **Design-Umbau „Kompass“:** [Entwurf in sieben Schritten](docs/entwurf/2026-11-25-design-umbau.md) (freigegeben am 25.11.2026; Gegenlesen durch `code-pruefer`, Bericht `…-design-umbau-codepruefung.md`). Schritt 1 Farben, Fokus, Knöpfe; 2 Schriften; 3 Hülle; 4 Start und Welten; 5 Karte; 6 Spielbrett mit Stempel am Spielende; 7 Rest und Aufräumen. [Bestand im Code](docs/entwurf/2026-11-25-design-umbau-bestand.md).
4. **PR 3 = Aufgaben 10 und 12** („Rekorde der Natur“, „Wetter und Klima“, „Sortiere die Zeit“, kleine Spiele zusammenlegen) mit dem [Experten-Nachtrag](docs/entwurf/2026-11-24-stimmt-das-experte-nachtrag-endfassung.md), nach Umbau-Schritt 2 und vor Schritt 6. Dann PR 4 = Länder ([Ideen](docs/entwurf/2026-11-24-laender-spiele-ideen.md)).
5. **Bilder im Hintergrund** (BACKLOG Punkt 26): Mandela einbauen (`File:Nelson Mandela 1994.jpg`, [Bericht](docs/entwurf/2026-11-24-bilder-mandela.md)), dann Zeitreise und Erfindungen ([Nachsuche](docs/entwurf/2026-11-25-bilder-zeitreise-erfindungen-nachsuche.md)), vor Umbau-Schritt 4 ein freies Foto für „Wissenschaft & Weltall“.

## Helfer beim Einstieg

Gleich nach `/weiter` starten diese Helfer im Hintergrund (Regel „Helfer starten mit jedem Chat“ in `CLAUDE.md`). Hier bei jedem Meilenstein nachführen.
- `code-pruefer`: Umbau-Schritt 1 nach dem Bau (Löschungen in `globals.css`, nachgeladene Teile; [Bauplan](docs/entwurf/2026-11-25-umbau-schritt-1-bauplan.md), Punkt 8).
- `karten-autor`: kurze Auflösungen für Tierdetektiv, Tierzuhause und Futter (2 bis 3 Sätze je Aufgabe wie bei Menschen und Technik; Muster in `TECHNIK_AUFLOESUNG` und [Endfassung Technik](docs/entwurf/2026-11-25-technik-aufloesung-endfassung.md)); dazu die Kartenkorrekturen (BACKLOG, „Kartenkorrekturen dazu“) als Textvorschlag mit Quelle.
- `fakten-pruefer`, `kinder-redaktion`, `stufen-pruefer`: diese Entwürfe unabhängig gegenlesen, sobald sie vorliegen.
- `bild-recherche`: Zeitreise und Erfindungen ohne Bild weiter ([Nachsuche](docs/entwurf/2026-11-25-bilder-zeitreise-erfindungen-nachsuche.md)); dazu ein freies Foto für „Wissenschaft & Weltall“ (Design-Umbau Schritt 4).
- `design-pruefer` und `spieltester`: Umbau-Schritt 1 an Bildern und im Browser, sobald er gebaut ist.
- `technik-pruefer`: gerade nichts (nur nach einem späten Fund).
- `ideen-scout`: gerade nichts (Design- und Länder-Ideen liegen vor).

## Offene Fragen an den Nutzer

- **Regel „Engine-Sonderverhalten“?** Vorschlag aus der [Technik-Prüfung](docs/entwurf/2026-11-25-spaeter-fund-fokusrahmen.md) (S1), eine Zeile in `CLAUDE.md`, Arbeitsablauf 4: Wer Code oder eine Suite ändert, deren Kommentar ein Sonderverhalten von Firefox oder WebKit nennt, lässt genau diese Suite vor dem Commit einzeln in dieser Engine laufen (meist unter 30 s). Claude empfiehlt Ja; `CLAUDE.md` ändert sich erst nach dem OK. Bis dahin hält Claude es schon so.
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
