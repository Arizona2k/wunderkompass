# Technik-Prüfung: später Fund im Spielplatz-Test (PR 2)

Helfer: `technik-pruefer` (sonnet / high), 24.11.2026. Nur gelesen, keine Läufe.

**Ergebnis:** Der Block wurde in einer Suite geschrieben, die nur in der Vollprüfung läuft, und CLAUDE.md verlangt nicht, eine geänderte Suite sofort selbst auszuführen. Ein Fund später als `pnpm run check` war damit vorprogrammiert. Weitere Wege ohne `merkeSpielkarte` habe ich im Code nicht gefunden. Nur ein Fall bleibt offen (siehe 2).

## 1. Warum so spät, was fehlt?

- `playground` steht mit `set: 'full'` (`/home/user/wunderkompass/tests/browser/suites.mjs:106`), `check` führt sie nicht aus. Der Block ist also nie gelaufen, bevor er committet wurde.
- Arbeitsablauf Punkt 4 (`/home/user/wunderkompass/CLAUDE.md:72`) verlangt "betroffene große Suiten gleich laufen lassen" nur dann, wenn sich etwas ändert, das Tests voraussetzen (Kartentexte, Kartenaufbau). Der Fall "ich schreibe oder ändere selbst Testcode in einer Vollprüfungs-Suite" steht nicht drin. Dazu kommt, dass der Block aus einer Code-Prüfung stammt ("Entscheidung 25") und App und Test zusammen geändert wurden. Beide Teile waren ungeprüft.
- Die letzte lokale Zeitdatei zeigt `playground` mit `bestanden: false` nach 140,2 s (`.qa-output/browser/zeiten-full-chromium.json`). Der Lauf fand also erst im großen Lauf statt, nicht beim Schreiben.

**Vorschlag, ein Satz für Punkt 4 in CLAUDE.md:** "Wer eine Suite mit `set: 'full'` neu schreibt oder ändert, lässt genau diese Suite vor dem Commit einmal laufen (`node tests/browser/run.mjs --suite full <name>`); ein nie gelaufener Testblock gilt nicht als geprüft."

## 2. Weitere Wege ohne `merkeSpielkarte`

Alle Fundstellen in `/home/user/wunderkompass/app/earth-explorer.tsx`:
- Zeile 235 `openPlaygroundGame` setzt `gameOpener.current=g.key` direkt (in Ordnung).
- Zeile 239 `continueActivity`, Zeile 245 `openWorldGame` und Zeile 246 `searchGame` rufen `merkeSpielkarte` auf (in Ordnung).
- Zeile 168 (Pass-Wiederherstellung) setzt `setResumeGame(undefined);setGamePanel(null)`. Das schließt das Spiel, es öffnet keins, daher kein Problem. Der alte `gameOpener` bleibt aber stehen. Nach einem Import könnte der Fokus später auf eine Karte des vorigen Passes zeigen. Das ist harmlos, weil es nur den Fokus betrifft, und der Fallback `playground-title` greift, wenn die Karte fehlt.
- Zeile 190 `spielenOderBereich` setzt `setGamePanel(null)` und ruft `zurSpielkarte` auf (in Ordnung).
- **Offen:** Zeilen 196 bis 198 (`classicGameActive`, `worldGameActive`, `extraGameActive`) setzen `setGamePanel`, wenn ein Spiel von innen aktiv wird (`onActive`, Zeilen 292 und 295). Dabei wird `gameOpener` nicht gesetzt. Startet ein Kind ein Spiel direkt im Spielbereich-Bauteil, ohne `openPlaygroundGame`, `searchGame`, `openWorldGame` oder `continueActivity`, bleibt der alte oder leere Wert. Der Fokus geht dann auf `playground-title` oder auf die Karte des zuvor geöffneten Spiels. Ob dieser Weg überhaupt vorkommt, habe ich nicht geprüft. Das ist ein Prüfauftrag an den `code-pruefer`, kein bestätigter Fehler.
- Außerhalb von `earth-explorer.tsx` gibt es keine weiteren Aufrufe von `setResumeGame` oder `setGamePanel`. `data-game-key` steht nur in `app/playground.tsx:20`.

## 3. `playground` in den CI-Satz?

- Der CI-Satz in Chromium braucht 358,9 s (`zeiten-ci-chromium.json`, zwei Suiten parallel). `playground` mit rund 140 s würde etwa 2,3 Minuten dazukommen, zum Teil parallel. Das ergäbe etwa 6 bis 8,5 Minuten. Das Zeitlimit des Pflichtjobs liegt bei 20 Minuten (`.github/workflows/quality.yml:20`, nicht sicher, dass es der Job „Required quality checks“ ist), der Puffer bliebe über einem Viertel.
- Die ganze Suite ist aber `chromiumOnly` und prüft viel mehr als Fokus und Fortsetzen, nämlich alle Stufen und Spiele. Das passt nicht zu "schnell und früh".
- **Besser:** eine kleine CI-Teilprüfung, zum Beispiel `spiel-auswahl` (7,3 s, `set: 'ci'`) um den Fokus-Block erweitern oder eine neue Suite `spiel-fokus` (geschätzt 10 bis 20 s) daraus machen. Sie enthält nur den Weg "Spiel offen, Spielen in der Leiste, direkt und über Welt, Fortsetzen, Neuladen+Fortsetzen" für ein einziges Spiel (`classic:detective`). Der Block in `tests/browser/playground.mjs` (um Zeile 80 bis 90) läuft heute nur bei `game==='detective'&&stufe==='profi'&&i===1`, also tief in der Suite. Er lässt sich leicht herauslösen.
- Zusätzlich sollte der Fall "Neuladen, dann Fortsetzen" (der eigentliche Fehler) mit drin sein. Das deckt der Block laut deiner Beschreibung ab.
- Kein Pass geht verloren, die Vollprüfung behält `playground` unverändert.

## Geprüft und in Ordnung
`CLAUDE.md` Punkt 4 und 8, `tests/browser/suites.mjs` (alle `set`-Werte), die Zeitdateien in `.qa-output/browser/`, alle `setResumeGame`- und `setGamePanel`-Stellen in `app/earth-explorer.tsx`, der Block in `tests/browser/playground.mjs`, `timeout-minutes` in `.github/workflows/quality.yml`.

## Nicht geprüft
Ob der Weg aus Punkt 2 ("offen") real vorkommt. Echte Laufzeit eines abgetrennten Fokus-Tests (nur geschätzt). Welcher Job zu welchem `timeout-minutes` gehört, habe ich nicht gegengelesen, nur die Zahl 20 in Zeile 20 gesehen. Keine Läufe gestartet (nur Lesen).

## Nachtrag Claude

- Punkt 2 „offen“ ist geklärt: Die Spielbereiche öffnen ein Spiel nur über `resume` (`setGame(resume.id)` in `app/learning-games.tsx` und `app/advanced-games.tsx`, `start(resume.id)` in `app/world-games.tsx`). `resume` kommt nur aus den vier Wegen in `app/earth-explorer.tsx`, die die Spielkarte jetzt alle merken. Kein weiterer Weg ohne Karte.
- Regelvorschlag aus Punkt 1 und die kleine CI-Teilprüfung aus Punkt 3: dem Nutzer vorgeschlagen; die Teilprüfung kommt in den Technik-PR (BACKLOG).
