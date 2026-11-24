# Teil B, Vorarbeiten: Technik-Prüfung zur Wartehilfe vor Seitenwechseln (24.11.2026)

Helfer `technik-pruefer` (sonnet/high), Auftrag: Testsystem nach `scripts/seitenwechsel.mjs` (zentrale Wartehilfe vor `reload`, `goto`, `close`), CI-Dauer, Unterlagen, Linkwächter-Tempo. Kein Browserlauf, nur Lesen und zwei Unit-Test-Dateien. Bericht in Kurzform; was Claude daraus macht, steht jeweils dahinter.

**Ergebnis:** Die Lösung deckt alle Wege ab, die zu den fünf späten Funden führten, und läuft in der CI über denselben Runner (`tests/browser/run.mjs`; kein Skript unter `scripts/` startet Playwright selbst). Offen bleiben der Wechsel innerhalb der App und Randwege. Unterlagen beschrieben noch den alten Stand.

| Nr. | Befund | Stufe | Umsetzung |
|---|---|---|---|
| 1 | Nach dem ersten Zeitlimit wartet jeder weitere Wechsel derselben Seite wieder 20 s; eine hängende Seite kann eine Suite um viele Minuten verlängern, auch `finally { context.close() }` | mittel | umgesetzt: Seite merkt sich das Scheitern, spätere Wartepunkte kehren sofort zurück; Schließen hat ein kürzeres Limit |
| 2 | Wechsel innerhalb der App (`goBack` 87×, `location.hash` 198×, Klicks) ohne Wartehilfe; `goBack`/`goForward` ließen sich billig mitpatchen | mittel | BACKLOG (eigener Schritt mit Messung); alle fünf späten Funde kamen von Neuladen/Schließen |
| 3 | Wartehilfe nur für überwachte Seiten (`monitor`); nicht überwacht z. B. die leere Seite in `journey-zoom.mjs:39`, Popups | niedrig | umgesetzt: jede neue Seite wird gleich beim Anlegen beobachtet |
| 4 | Randwege ohne Wartehilfe: `evaluate(() => location.reload())` (0 Treffer), `Frame.goto`, `setContent`, Service-Worker-Anfragen | niedrig | im Kopfkommentar von `scripts/seitenwechsel.mjs` genannt |
| 5 | Stresslauf: „rund 6 Minuten“ in `/pruefen` vermutlich veraltet (zwei Bildwechsel je Wartestelle, je 150 ms gebremst) | niedrig | nachgemessen und nachgeführt |
| 6 | Unterlagen alt: `BACKLOG.md` (Seitenwechsel, Firefox-Hinweis und Idee a), `STATUS.md`, Kommentar `tests/browser/wissenskarte.mjs:106`, `CLAUDE.md` ohne Satz zur Wartehilfe, CHANGELOG fehlt | mittel | nachgeführt |
| 7 | `tests/browser-warten.test.mjs` braucht 7,7 s (echte Zeitgeber), Linkwächter 0,7 s | niedrig | Ruhezeit in den Tests mit nachgebauten Klassen verkürzt; die sechs Tests der echten Ruhezeit bleiben (zusammen rund 5 s), die Datei braucht weiter gut 7 s |

Zeit (Schätzung des Helfers aus den Logs): je Neuladen rund 0,5 s, je Schließen 0,03 s; netto 0 bis 10 % in der Vollprüfung, weil 39 alte Wartestellen wegfielen. Die längste Gruppe (`reisen`) bleibt deutlich unter ihrer Grenze von 75 Minuten.

Geprüft und in Ordnung: haltende `route`-Handler (`foundation`, `portable-flows`, `animal-learning`, `world-photos`) sind richtig ausgenommen; `ladeanfragen` ohne `timeout` nimmt den Standardwert; `smoke.mjs` braucht `anfragenFertig()` weiter (vor `browserErrorsSettled`); Job-Namen in `quality.yml` passen zu `CLAUDE.md`. Kleinigkeit: In `kern-huelle.mjs` kommt `ladeanfragen` vor `ctx.monitor`, dadurch fehlte der Browser-Name im Fehlertext (umgesetzt: wird nachgetragen).

Nebenbefund: Der Branch bündelt Testinfrastruktur, App-Änderung und Linkwächter; für die Messwerte im CHANGELOG wäre eine Trennung klarer. Claude: bleibt ein PR (alles Vorarbeiten für Teil B, vom Plan so vorgesehen); die Messwerte nennen die Teile getrennt, wo es geht.
