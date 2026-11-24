# Teil A: Zweiter später Fund (`offline-cold-full`), technik-pruefer

Stand: 24.11.2026 (Nacht, UTC), Branch `claude/trusting-galileo-ck3o23`, Commit `dd4dced`. Bericht des `technik-pruefer` nach der Regel „nach jedem spät gefundenen Fehler“, gekürzt auf die Befunde. Umsetzung: Abschnitt „Zweiter später Fund im Nachlauf“ in der [Entscheidungsliste Teil A](2026-11-23-teilschritt-3-teil-a-entscheidungen.md).

**Ergebnis:** Analyse und Korrektur stimmen. Weitere Tests mit dem alten Verhalten (Datenreihenfolge oder Überschreiben im Pass) nicht gefunden. Größter offener Punkt: `offline-cold-full` und der 320-px-Rest von `core` sind nach Teil A nie bis zum Ende gelaufen.

## 1. Analyse und Korrektur

- `festGemischt` für `animal-white-tailed-eagle` nachgerechnet: `Höhe, Länge, Abstand`, genau die angezeigte Reihe. `items=[before,after,correct]` ergibt über den Alias eine Dublette, `gueltigeReihe` liefert `null` (`app/kern/karte/karten-daten.ts:87-111`).
- Nicht abgeschwächt, sondern strenger (vorher Datenreihenfolge, jetzt die genaue Reihe; der Online-Fall war in `e95756f` auf „sortiert gleich“ gelockert und prüft jetzt wieder genau).
- Die Erwartung kommt aus derselben Funktion wie die App: Der Test sichert „kaputte Reihe → feste Mischung“; den Algorithmus sichern die Eigenschaftstests `tests/karte-stufen.test.mjs:111-120`. Vertretbar, weil nichts gespeichert wird.
- **Lücke:** Der Offline-Fall prüft nicht, dass die alte Reihe im Pass bleibt (`items` nach dem Neuladen noch `[before,after,correct]`); nur der Online-Fall tut das.
- Kommentar und Meldung im Online-Fall sagen noch „neu gemischt“; gemeint ist „feste Mischung, nichts gespeichert“.

## 2. Weitere Tests mit altem Verhalten

- Alle Stellen, die `items` oder `gameSessions['topic:…']` schreiben, schreiben gültige Reihen (`tests/browser/animal-learning.mjs:144`, `tests/animal-learning.test.mjs:28`, `tests/browser/retained-answer-wording.mjs:50, 76, 112`; `wissenskarte.mjs:837` liest nur). Auch Zusatzfragen-Schlüssel, Wissensbuch-Ansichten, `tests/fixtures/*`, Altpass-Import/Export: nichts.
- Vorlesen (`wissenskarte.mjs:232, 239`) prüft nur „enthält“, nicht die Reihenfolge. Lücke, kein Fehler.
- Andere Teil-A-Änderungen: alte Wörter kommen in `tests/` nicht mehr vor; Tests mit Absätzen öffnen „Für Große“ über `lesetexte`; „Ganz einfach“ offen und Personenkarten zentral in `karte-hilfen.mjs:80-138`.
- **Nie nach Teil A zu Ende gelaufen:** `offline-cold-full` (Abbruch nach 56 s; danach u. a. `offlineArticleAtlas`, `offlineChallengeHints`, `offlineDiscoveryCentral`, `offlineResearch`, `offlineJourneys`, `offlinePlayground`) und der 320-px-Rest von `core` (`article-atlas.mjs:100-144`, `passDesign` bei 320 px).
- Grün nach dem letzten App-Code-Commit (`full-a7`): `animals`, `playground`, `challenge`, `engine-journeys`, `journeys`, `offline-resilience`, `offline-cold`, `performance`. Nur vor den Code-Commits `e7d1745`/`a0ec522` grün (`full-a6`): `components`, `research`, `home`, `home-visits`, `animal-native-zoom`, `solar-labels`.
- **Empfehlung:** `node tests/browser/run.mjs --suite full core offline-cold-full home-visits animal-native-zoom research` vor der Meldung „Teil A fertig“.

## 3. Warum so spät, und was hilft?

- Die Offline-Fassung steht in einer langen Zeile mit anderer Meldung als der Online-Fall und läuft nur in `offline-cold-full` (Chromium, Vollprüfung). `full-a6` war durch Chromium-Abstürze abgebrochen; die Suite lief erst eine Stunde nach der Änderung.
- **Vorschlag 1:** `offlineRetainedAnswerWording` in den CI-Teil von `offline-cold.mjs` stellen (vor `if (full)`), Aufruf in `animal-learning.mjs:194` streichen. Kostet wenige Sekunden, läuft dann bei jedem PR, auch in WebKit/Firefox. Offen: ob `navigator.onLine === false` in WebKit hält.
- **Vorschlag 2:** Hilfe in `karte-hilfen.mjs`, die die erwartete Reihe über `antwortReihe` bestimmt.
- **Vorschlag 3 (CLAUDE.md, Arbeitsablauf Punkt 4):** betroffene Tests nach dem Auslöser suchen (Schlüssel wie `items`, `gameSessions['topic:`, Funktionen wie `antwortReihe`), nicht nach dem Wortlaut; den Befehl nach Kartenänderungen um `offline-cold-full` ergänzen (`--suite full core offline-cold-full`, rund 3 Minuten mehr).

## Hinweis

`useSavedGame` ohne Wiederherstellungsfunktion ersetzt einen Pass-Wert, der kein String-Array ist (z. B. `[]`), durch eine zufällige Mischung und speichert sie (altes Verhalten von `saved-games.tsx:13-24`). „Überschreibt den Pass nie“ gilt in `rate-mal.tsx` also nur für String-Arrays; die Kommentare in `rate-mal.tsx:20-22` und `karten-daten.ts:92-96` sind etwas zu allgemein.
