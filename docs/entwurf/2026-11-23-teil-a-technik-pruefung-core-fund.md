# Teil A: Später Fund im `core`-Nachlauf (technik-pruefer)

Stand: 23.11.2026 (Nacht), Branch `claude/trusting-galileo-ck3o23`, Commit `6efa6a0`. Bericht des `technik-pruefer` nach der Regel „nach jedem spät gefundenen Fehler“, gekürzt auf die Befunde. Umsetzung: Abschnitt „Später Fund im Nachlauf“ in der [Entscheidungsliste Teil A](2026-11-23-teilschritt-3-teil-a-entscheidungen.md).

**Ergebnis:** Die Analyse stimmt. Die Korrektur ist eine echte Prüfung und stärker als vorher. Keine weiteren Stellen mit demselben Muster. Nicht gemessen (so beauftragt): ob die Korrektur unter Last hält.

## 1. Analyse und Korrektur

- `scheduleRouteRestore` (`app/hash-route.ts:59-76`) wartet auf ein Animationsbild. `restoreRouteView` (`:29-55`) stellt dann in dieser Reihenfolge her: offene `details[data-history-disclosure]` (`:31`), Scrollposition (`:32`), Fokus (`:37`). „Mehr erfahren“ ist so ein Bereich (`app/kern/karte/mehr-erfahren.tsx:32`). Der Test sah die Karte vor diesem Bild: Fehler im Test-Timing, nicht in der Seite.
- `tests/browser/article-atlas.mjs` wartet jetzt auf den Fokus am Routen-Knopf (Schlüssel gibt es, `mehr-erfahren.tsx:93`) und prüft danach `open`. Der Fokus wird erst nach `open` gesetzt; die alte Prüfung bleibt unverändert, der Fokus kommt dazu.
- **Firefox und WebKit:** `core` ist `chromiumOnly` (`tests/browser/suites.mjs:89`) und steht nur in der Chromium-Gruppe „kern“ (`tests/browser/shards.mjs:14`). `articleAtlas` läuft in Firefox und WebKit nirgends.
- Falls `core` später für andere Browser geöffnet wird: Die Wartebedingung setzt voraus, dass ein Klick den Knopf fokussiert (`wunderFocus` stammt aus `document.activeElement`, `hash-route.ts:15`). Andere Tests öffnen darum per `focus()` und Enter (`journeys.mjs:159`, `discovery-central.mjs:75`).

## 2. Weitere Stellen mit demselben Muster

Keine. Alle `goBack`/`goForward`-Stellen in `tests/browser/` durchgesehen:

- Die meisten warten zuerst auf `activeElement.dataset.routeFocus` und prüfen dann (`journeys.mjs:159,160,200`, `category-timelines.mjs:6`, `discovery-central.mjs:75,279,290`, `people-fourteen-connected-routes.mjs:48`, `book-related-words.mjs:32`, `wissenskarte.mjs:278,306`).
- Scroll mit Wartebedingung: `kern-huelle.mjs:360-366`, `398-403`. Kapitel-Zustand: `reise-kapitel.mjs:111-113`.
- Grenzfall, bleibt: `book-commands.mjs:32`, `:37` prüfen nach drei Bildern `study.open===false` und öffnen dann von Hand. Eine zu frühe Prüfung bliebe dort höchstens grün, nicht rot.

## 3. Warum so spät?

- `core` ist `set:'full'` und nur Chromium: nicht in `pnpm run check`, nicht in „Required quality checks“, nicht in der Engine-Schnellprüfung. In der Vollprüfung lief es mit `--jobs 3` unter Last.
- `articleAtlas` hat einen Aufrufer (`core.mjs:46` in vier Breiten, `core.mjs:92` bei 320 px). Die vier früheren Aufrufe waren grün, der letzte bei 320 px rot. Last als Auslöser ist plausibel, nicht belegt.
- Der Weg „Mehr erfahren offen, in die Route, zurück“ steht in keiner CI-Suite (`wissenskarte.mjs`, `kern-huelle.mjs` durchsucht).
- Keine neue Regel nötig: Der Fehler entstand durch Last, nicht durch eine Kartenänderung. Arbeitsregel: Neue Prüfungen nach Zurück warten zuerst auf den Fokus.

## 4. Laufzeit

- Der Runner wählt nur ganze Suiten (`run.mjs:2-8`), kein Schalter für Breite oder Funktion.
- **Empfehlung:** `core` nicht zerlegen, keinen neuen Schalter bauen. Den Fall (Mehr erfahren offen, Route öffnen, Zurück, auf Fokus warten, offen prüfen) als kurzen Schritt in eine CI-Suite legen (`wissenskarte` oder `kern-huelle`), per Tastatur geöffnet (Fokus und Enter). Läuft dann bei jedem PR in Chromium und in der Engine-Schnellprüfung in Firefox und WebKit. Vorher `--suite ci wissenskarte` in Firefox und WebKit laufen lassen.
- `BACKLOG.md:248` (gestrichener CI-Lauf „`core` mit einer Breite“) betrifft etwas anderes.

## Kleinigkeit

Der Kommentar in `article-atlas.mjs` nannte den 24.11.2026; Commit und Fund sind vom 23.11.2026 (UTC).
