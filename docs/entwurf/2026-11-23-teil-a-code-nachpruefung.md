# Teil A: Nachprüfung der Korrekturen (code-pruefer)

Stand: 23.11.2026, Branch `claude/trusting-galileo-ck3o23`, Commits `291e477..6f9ff04`. Bericht des `code-pruefer`, gekürzt auf die Befunde. Umsetzung: Abschnitt „Code-Nachprüfung“ in der [Entscheidungsliste Teil A](2026-11-23-teilschritt-3-teil-a-entscheidungen.md).

**Ergebnis:** Bereit, mit kleinen Änderungen. Alle zehn Befunde der ersten Prüfung ([Bericht](2026-11-23-teil-a-code-pruefung.md)) sind im Code behoben, nicht nur in den Tests. Nichts gefunden, wodurch im Pass etwas verloren geht.

Gelaufen: `pnpm test` (436/436), `pnpm run typecheck`, `pnpm run lint`, alle grün. `scripts/antworten-stand.mjs` erzeugt genau `tests/fixtures/gespeicherte-antworten-teil-a.json` (287 Fragen, keine ID doppelt). Nicht gelaufen (so beauftragt): Build, Browser-Suiten.

## Die zehn Befunde

1. Behoben: Vorschläge zählen nur Fragen genau der gewählten Stufe (`stufe.ts`, `mitErsterAntwort`), mit Unit-Test; `ZWEI_AUF_PROFI` ist strenger (17 Karten).
2. Behoben: Fokus nach Stufenwechsel und nach den Vorschlag-Knöpfen (`stufen-wahl.tsx`, `wissenskarte.tsx`). Ist die Karte vorher zu, bleibt `focus()` ohne Wirkung, ohne Fehler.
3. Behoben.
4. Behoben für die Karte: Die neue Liste stimmt mit dem Skript überein; der Test erkennt fehlende Antworten, andere Lösungen und fehlende Fragen. Die Wissens-Challenge deckt er nicht ab (M1).
5. Behoben: Eine heutige Challenge-Runde behält ihre Tipps immer. Drei alte Fassungen mit gleichem Fragetext behalten die heutigen Tipps; sie passen zu den alten Antworten (nachgelesen).
6. Behoben (Entscheidungsliste eng gefasst).
7. Behoben (Kommentare).
8. Behoben: „Ordne richtig“ hält den Fokus beim selben Teil, ansonsten auf dem anderen Pfeil; Ansage per `aria-live`.
9. Behoben: Der Test ist strenger als vorher (neue Schlüssel nur mit vier Präfixen).
10. Behoben: Nachbarländer-Satz über `WOERTER.nochNicht`; in `app/` steht kein „Noch nicht ganz“ mehr fest im Code.

Lernhilfe-Regel in `kartenFeldFehler`: richtig, meldet auch `null`, läuft über den ganzen Katalog, mit drei Mutationsproben.

## Neue Befunde

**Hoch:** keine.

**M1 (mittel): Die Teil-A-Liste schützt laufende Runden der Wissens-Challenge nicht.** `tests/gespeicherte-antworten.test.mjs` prüft die Teil-A-Liste nur mit `fehlt()`, und das erlaubt zusätzliche Antworten. `challengeQuestionForOrder` verlangt aber eine genaue Vertauschung oder einen Eintrag in den früheren Fassungen. Bekommt eine Challenge-Frage später eine weitere Antwort, bleibt der Test grün, und `restoreChallenge` verwirft die angefangene Runde. Vorschlag: für die Challenge-Einträge zusätzlich `challengeQuestionForOrder(id, umgedrehte alte Antworten)` prüfen (nicht `null`, gleiche Antworten, gleiche Lösung).

**N1 (niedrig):** Im Tipp-Test überspringt `if (neu && …)` still, wenn eine heutige Reihe nicht lesbar ist. Besser `assert.ok(neu)`.

**N2 (niedrig):** `tests/browser/karte-stufen.mjs` verschiebt bei „Ordne richtig“ nur nach oben. Der Weg, auf dem React das fokussierte Teil selbst im DOM verschiebt (nach unten), läuft nie im Browser. Vorschlag: einen Schritt nach unten mit Fokus- und Ansageprüfung.

**N3 (niedrig):** In der Entscheidungsliste ist das Beispiel „Frankreich hat keine gemeinsame Grenze …“ falsch (Frankreich ist Nachbarland). Nur die Unterlage, der Code ist richtig.

## Geprüft und in Ordnung

- Katalog: genau 11 geänderte Werte (10 `learning.starter`, 1 `intro`), keine Schlüssel dazu oder weg, keine ID geändert, kein Feld leer.
- Pass, IDs, Links: `stable-ids.json` unverändert, Pass-Code, Speicher und Hash-Routen nicht berührt, kein neuer Pass-Schlüssel.
- Keine Prüfung abgeschwächt (`karte-stufen.mjs` strenger, `book-normalization.mjs` prüft denselben Text sichtbar und schlägt laut fehl, wenn „Für Große“ schon offen ist).
- Fokus wird erst nach dem React-Zustand gesetzt (`requestAnimationFrame`).
- Die Fotosynthese-Zeichnung erscheint genau einmal.

## Nicht geprüft

Browser-Suiten und Build (so beauftragt), Firefox und WebKit, die tatsächliche Ansage im Screenreader, die Darstellung bei 320 px, die Inhalte der 11 Sätze (Sache von `fakten-pruefer` und `kinder-redaktion`).
