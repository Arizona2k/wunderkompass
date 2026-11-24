# STATUS

Stand: 24.11.2026 spätabends. Kurz halten: ein Satz je fertigem Schritt, Verlauf in [CHANGELOG.md](CHANGELOG.md), Aufgaben in [BACKLOG.md](BACKLOG.md).

## Wo wir stehen

Fertig und in `test-live` (Einzelheiten im CHANGELOG; alter Stand mit allen Berichten in Commit `b53f75f`):
- Schritt 0 „Großputz“ (PR #96), Einordnung Katalog 2027 (PR #97, [Einordnung](docs/entwurf/2026-11-21-katalog-2027-einordnung.md)).
- Phase 1, Teilschritt 1 „Aussehen und Hülle“ (PR #99) und Teilschritt 2 „Wissenskarte“ (PR #102 bis #104), dazu die abgesicherte Arbeitsweise (PR #105).
- Teilschritt 3 „Kniffliger spielen“ ([Entwurf und Plan](docs/entwurf/2026-11-23-phase-1-teilschritt-3.md)): Arbeitssystem (PR #106), Teil A „Eine Stufe für alles“ (PR #107, [Entscheidungen](docs/entwurf/2026-11-23-teilschritt-3-teil-a-entscheidungen.md)), Folge-PR (PR #108), Stufen-Feinschliff (PR #109, [Entscheidungen](docs/entwurf/2026-11-24-stufen-feinschliff-entscheidungen.md)), Teil B Vorarbeiten (PR #110), Teil B PR 1 = Welt-Spiele mit Stufen (PR #111, [Entscheidungen 1 bis 18](docs/entwurf/2026-11-24-teil-b-entscheidungen.md)).
- Bilder-Strang, erster Teil (PR #113): alle 24 KI-Tierbilder durch Fotos ersetzt, 8 Personen, Einbau-Werkzeug `scripts/foto-einbau.mjs`.
- **Merge-Freigabe des Nutzers** für alle Teil-B-PRs nach grüner CI samt Engine-Schnellprüfung; Abweichungen vom Plan vorher melden (Entscheidungen 11 und 19).

## Adressen

- **Testseite** (`test-live`, alle benutzen nur diese): https://wunderkompass-git-c76589-interaktive-wissens-und-lernplattform.vercel.app/
- **Vorschau** (`vorschau`, eigener Pass, nur zum Ansehen): https://wunderkompass-git-f420d3-interaktive-wissens-und-lernplattform.vercel.app/
- Älterer Stand (`main`, nicht genutzt, nicht gebaut): https://wunderkompass.vercel.app/. Vercel baut nur `test-live` und `vorschau` (Tageslimit 100, Regeln in `CLAUDE.md`).

## Nächster Schritt

Phase 1 hat sechs Teilschritte: 1 Hülle (fertig) · 2 Wissenskarte (fertig) · **3 Kniffliger spielen** · 4 Weltenseiten und Bilder · 5 Startseite und Sammlung · 6 Feinschliff.

1. **Teil B, PR 2 = Aufgabe 9 (fast fertig, Branch `claude/wunderkompass-weiter-tz194g`, gepusht; Zwischenstand gesichert, Nutzungslimit 94 %).** „Kreuz und quer“, „Stimmt das wirklich?“ (26 Fragen, Experte echt) und „Wer lebt wo?“ mit der Stufe aus dem Pass; Zähler weg; „Spielen“ in der Leiste zeigt immer die Übersicht; Stufen-Vorschlag in allen Spielen (S8); Ratemuster-Test (S10); „Was ist neu?“. Entscheidungen: [Teil B, Punkte 19 bis 35](docs/entwurf/2026-11-24-teil-b-entscheidungen.md). Eingebaut: [Code-Prüfung](docs/entwurf/2026-11-24-teil-b-pr2-code-pruefung.md), [Nachprüfung](docs/entwurf/2026-11-24-teil-b-pr2-code-nachpruefung.md) (Commit `26e4b88`, Vorschlag nur auf der gewählten Stufe) und zuletzt die [Spieltest-Funde](docs/entwurf/2026-11-24-teil-b-pr2-spieltest.md) 1 bis 4: Jedes Spiel öffnet oben (`app/game-shell.tsx`), nach richtiger Antwort Fokus auf „Nächste Aufgabe“, nach „Nächste Aufgabe“ Fokus auf die Frage und das Brett in den Blick (`app/kern/spiel-fokus.ts`, gleich für Welt-Spiele, Kreuz und quer, Klassik-Spiele). Dieser letzte Commit ist nur mit typecheck und Lint geprüft. **Noch zu tun, der Reihe nach:**
   - Später Fund (Fokus nach „Spielen“ in der Leiste) ist behoben: Die Übersicht war beim ersten Fokusversuch noch versteckt; `zurSpielkarte` in `app/earth-explorer.tsx` versucht es jetzt Bild für Bild, und jeder Weg in ein Spiel merkt seine Karte (`merkeSpielkarte`). `playground`, `spiel-auswahl`, `challenge` grün; [Technik-Prüfung](docs/entwurf/2026-11-24-teil-b-pr2-technik-spaeter-fund.md) gesichert. Offene Frage an den Nutzer: Regel „Prüfschritte der Vollprüfung vor dem Commit selbst laufen lassen“ in `CLAUDE.md` aufnehmen?
   - Fokus-Prüfungen in `tests/browser/playground.mjs` sind drin; CHANGELOG mit Messwerten (Dauer beim Merge eintragen) und BACKLOG-Rest erledigt.
   - `pnpm run check` auf `b63ad2f` grün (530 Unit-Tests, CI-Satz, WebKit). Großer Lauf `--suite full core offline-cold-full` grün (core 1041 s, offline-cold-full 195 s); `playground`, `challenge`, `spiel-auswahl` waren schon grün.
   - Vorschau-Runde erledigt (`f5e3086`, READY). `design-pruefer` fertig ([Bericht mit Nachtrag](docs/entwurf/2026-11-24-teil-b-pr2-design-pruefung.md)): Befund 1 (Spiele öffneten bei weichem Scrollen nicht oben, Ursache Karte „Weiter entdecken“) behoben mit Test in `spiel-auswahl`; Balken in Kreuz und quer und Rahmen fürs Vorschaubild angeglichen; Rest im BACKLOG („Ein Spielbrett für alle Spiele“). Danach läuft `pnpm run check` neu (Log `.qa-output/check-pr2-e.log`), dann `--suite full playground challenge`, neue Vorschau-Runde (Kreuz und quer, Stimmt das wirklich?, Wer lebt wo?, Stufen-Vorschlag, Spiele-Übersicht; 320 bis 1440 px).
   - PR offen: [#114](https://github.com/Arizona2k/wunderkompass/pull/114) nach `test-live` (Abo auf CI aktiv). Auto-Merge erst nach großem Lauf und Design-Befunden; CI samt Engine-Schnellprüfung grün, dann Auto-Merge (Freigabe liegt vor), `list_deployments`, Bericht.
2. **Danach: Technik-PR** (BACKLOG, „Technik-PR nach den Analysen“; [Bewertung](docs/entwurf/2026-11-24-analysen-bewertung.md)): Speicher-Wiederholung mit wachsender Pause, eine Importgrenze, neun `^`-Versionen exakt pinnen plus Wächter-Test.
3. **Dann PR 3 = Aufgaben 10 und 12** („Rekorde der Natur“, „Wetter und Klima“, „Sortiere die Zeit“, kleine Spiele zusammenlegen). Geprüfte Endfassungen in `docs/entwurf/2026-11-24-rekorde-*`, `…-wetter-klima-*`; „Sortiere die Zeit“ [Fassung 2](docs/entwurf/2026-11-24-sortiere-die-zeit-fassung-2.md) wird gerade geprüft. Dazu der [Experten-Nachtrag „Stimmt das wirklich?“](docs/entwurf/2026-11-24-stimmt-das-experte-nachtrag.md) (in Prüfung). Dann PR 4 = Länder ([Ideen](docs/entwurf/2026-11-24-laender-spiele-ideen.md)).
4. **Bilder im Hintergrund** (BACKLOG Punkt 26): Blauwal, Wright Flyer, Meitner ([offene Bildfragen](docs/entwurf/2026-11-24-bilder-offene-fragen.md)), 3 Erfindungen, Darwin, Goodall ([Vorschläge](docs/entwurf/2026-11-24-bilder-erfindungen-darwin-goodall.md)), Mandela nach Klärung der Herkunft.

## Helfer beim Einstieg

Gleich nach `/weiter` starten diese Helfer im Hintergrund (Regel „Helfer starten mit jedem Chat“ in `CLAUDE.md`). Hier bei jedem Meilenstein nachführen.
- `fakten-pruefer`, `kinder-redaktion`, `stufen-pruefer`: nur die ⚠-Stellen der beiden Endfassungen nachprüfen ([Sortiere die Zeit, Fassung 3](docs/entwurf/2026-11-24-sortiere-die-zeit-endfassung-2.md), 18 ⚠; [Experten-Nachtrag](docs/entwurf/2026-11-24-stimmt-das-experte-nachtrag-endfassung.md), 15 ⚠).
- `karten-autor`: danach eigene Personen-Rätsel für die übrigen Personen (BACKLOG Punkt 25).
- `bild-recherche`: Mandela ist geklärt ([Bericht](docs/entwurf/2026-11-24-bilder-mandela.md): `File:Nelson Mandela 1994.jpg`, CC BY-SA 2.0, einbauen mit `scripts/foto-einbau.mjs`); dann Zeitreise und Erfindungen ohne Bild ([Kandidaten](docs/entwurf/2026-11-21-bilder-zeitreise-erfindungen.md)).
- `design-pruefer` und `spieltester`: PR 2 ansehen, solange er offen ist; sonst nichts bis zum Design-Schritt.
- `code-pruefer`: Nachprüfung der eingebauten Funde von PR 2, solange er offen ist.
- `technik-pruefer`: Technik-PR vorbereiten (Stellen im Code, Testplan).
- `ideen-scout`: gerade nichts (Design- und Länder-Ideen liegen vor).

## Offene Fragen an den Nutzer

- **Design vorziehen?** Empfehlung: nach PR 2 zwei Stilproben (Start, Karte, Spiel; Handy und Rechner) zur Auswahl, auf Grundlage von [Design-Ideen](docs/entwurf/2026-11-24-design-ideen.md) und [Bestandsaufnahme Einheitlichkeit](docs/entwurf/2026-11-24-design-einheitlichkeit-bestand.md). Antwort steht aus.
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
