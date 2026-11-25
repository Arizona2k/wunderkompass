# STATUS

Stand: 25.11.2026. Kurz halten: ein Satz je fertigem Schritt, Verlauf in [CHANGELOG.md](CHANGELOG.md), Aufgaben in [BACKLOG.md](BACKLOG.md).

## Wo wir stehen

Fertig und in `test-live` (Einzelheiten im CHANGELOG; alter Stand mit allen Berichten in Commit `b53f75f`):
- Schritt 0 „Großputz“ (PR #96), Einordnung Katalog 2027 (PR #97, [Einordnung](docs/entwurf/2026-11-21-katalog-2027-einordnung.md)).
- Phase 1, Teilschritt 1 „Aussehen und Hülle“ (PR #99) und Teilschritt 2 „Wissenskarte“ (PR #102 bis #104), dazu die abgesicherte Arbeitsweise (PR #105).
- Teilschritt 3 „Kniffliger spielen“ ([Entwurf und Plan](docs/entwurf/2026-11-23-phase-1-teilschritt-3.md)): Arbeitssystem (PR #106), Teil A „Eine Stufe für alles“ (PR #107, [Entscheidungen](docs/entwurf/2026-11-23-teilschritt-3-teil-a-entscheidungen.md)), Folge-PR (PR #108), Stufen-Feinschliff (PR #109, [Entscheidungen](docs/entwurf/2026-11-24-stufen-feinschliff-entscheidungen.md)), Teil B Vorarbeiten (PR #110), Teil B PR 1 = Welt-Spiele mit Stufen (PR #111, [Entscheidungen 1 bis 18](docs/entwurf/2026-11-24-teil-b-entscheidungen.md)).
- Teil B PR 2 = Kreuz und quer und die Klassik-Spiele mit Stufen (PR #114, [Entscheidungen 19 bis 35](docs/entwurf/2026-11-24-teil-b-entscheidungen.md), [Design-Prüfung](docs/entwurf/2026-11-24-teil-b-pr2-design-pruefung.md)).
- Bilder-Strang, erster Teil (PR #113): alle 24 KI-Tierbilder durch Fotos ersetzt, 8 Personen, Einbau-Werkzeug `scripts/foto-einbau.mjs`.
- **Entschieden am 25.11.2026:** Der Nutzer nimmt beide Empfehlungen an: die Regel „neue oder geänderte Vollprüfungs-Suite vor dem Commit selbst laufen lassen“ (jetzt in `CLAUDE.md`, Arbeitsablauf Punkt 4) und zwei Stilproben fürs Design, mit dem Auftrag „beim Design sei kreativ“.
- **Merge-Freigabe des Nutzers** für alle Teil-B-PRs nach grüner CI samt Engine-Schnellprüfung; Abweichungen vom Plan vorher melden (Entscheidungen 11 und 19).

## Adressen

- **Testseite** (`test-live`, alle benutzen nur diese): https://wunderkompass-git-c76589-interaktive-wissens-und-lernplattform.vercel.app/
- **Vorschau** (`vorschau`, eigener Pass, nur zum Ansehen): https://wunderkompass-git-f420d3-interaktive-wissens-und-lernplattform.vercel.app/
- Älterer Stand (`main`, nicht genutzt, nicht gebaut): https://wunderkompass.vercel.app/. Vercel baut nur `test-live` und `vorschau` (Tageslimit 100, Regeln in `CLAUDE.md`).

## Nächster Schritt

Phase 1 hat sechs Teilschritte: 1 Hülle (fertig) · 2 Wissenskarte (fertig) · **3 Kniffliger spielen** · 4 Weltenseiten und Bilder · 5 Startseite und Sammlung · 6 Feinschliff.

1. **Jetzt: zwei Stilproben fürs Design** (kreativ, Nutzer 25.11.2026): Start, Karte und Spiel, je Handy und Rechner, als Entwurf in `docs/entwurf/` mit Bildern zur Auswahl. Grundlage: [Design-Ideen](docs/entwurf/2026-11-24-design-ideen.md), [Bestandsaufnahme Einheitlichkeit](docs/entwurf/2026-11-24-design-einheitlichkeit-bestand.md) und die Design-Reste im BACKLOG („Ein Spielbrett für alle Spiele“, Rückmeldung in den Blick, Vorschaubild). Danach prüfen `design-pruefer` und `spieltester`; der Nutzer wählt.
2. **Dann, während der Nutzer wählt: Technik-PR** (BACKLOG, „Technik-PR nach den Analysen“; [Bewertung](docs/entwurf/2026-11-24-analysen-bewertung.md)): Speicher-Wiederholung mit wachsender Pause, eine Importgrenze, neun `^`-Versionen exakt pinnen plus Wächter-Test.
3. **Dann PR 3 = Aufgaben 10 und 12** („Rekorde der Natur“, „Wetter und Klima“, „Sortiere die Zeit“, kleine Spiele zusammenlegen). Geprüfte Endfassungen in `docs/entwurf/2026-11-24-rekorde-*`, `…-wetter-klima-*`; „Sortiere die Zeit“ [Fassung 2](docs/entwurf/2026-11-24-sortiere-die-zeit-fassung-2.md) wird gerade geprüft. Dazu der [Experten-Nachtrag „Stimmt das wirklich?“](docs/entwurf/2026-11-24-stimmt-das-experte-nachtrag.md) (in Prüfung). Dann PR 4 = Länder ([Ideen](docs/entwurf/2026-11-24-laender-spiele-ideen.md)).
4. **Bilder im Hintergrund** (BACKLOG Punkt 26): Blauwal, Wright Flyer, Meitner ([offene Bildfragen](docs/entwurf/2026-11-24-bilder-offene-fragen.md)), 3 Erfindungen, Darwin, Goodall ([Vorschläge](docs/entwurf/2026-11-24-bilder-erfindungen-darwin-goodall.md)), Mandela nach Klärung der Herkunft.

## Helfer beim Einstieg

Gleich nach `/weiter` starten diese Helfer im Hintergrund (Regel „Helfer starten mit jedem Chat“ in `CLAUDE.md`). Hier bei jedem Meilenstein nachführen.
- `fakten-pruefer`, `kinder-redaktion`, `stufen-pruefer`: nur die ⚠-Stellen der beiden Endfassungen nachprüfen ([Sortiere die Zeit, Fassung 3](docs/entwurf/2026-11-24-sortiere-die-zeit-endfassung-2.md), 18 ⚠; [Experten-Nachtrag](docs/entwurf/2026-11-24-stimmt-das-experte-nachtrag-endfassung.md), 15 ⚠).
- `karten-autor`: danach eigene Personen-Rätsel für die übrigen Personen (BACKLOG Punkt 25).
- `bild-recherche`: Mandela ist geklärt ([Bericht](docs/entwurf/2026-11-24-bilder-mandela.md): `File:Nelson Mandela 1994.jpg`, CC BY-SA 2.0, einbauen mit `scripts/foto-einbau.mjs`); dann Zeitreise und Erfindungen ohne Bild ([Kandidaten](docs/entwurf/2026-11-21-bilder-zeitreise-erfindungen.md)).
- `design-pruefer` und `spieltester`: nichts bis zum nächsten sichtbaren PR oder den Stilproben.
- `code-pruefer`: den Technik-PR prüfen, sobald er steht.
- `technik-pruefer`: Technik-PR vorbereiten (Stellen im Code, Testplan).
- `ideen-scout`: gerade nichts (Design- und Länder-Ideen liegen vor).

## Offene Fragen an den Nutzer

- **Welche Stilprobe?** Folgt, sobald die zwei Stilproben stehen.
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
