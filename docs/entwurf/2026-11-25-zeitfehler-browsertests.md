# Zeitfehler in den Browser-Tests: Suche nach Verwandten des Offline-Fundes

Helfer: `technik-pruefer` (sonnet / high), 25.11.2026. Anlass: `offline-cold-full` war dreimal rot, weil `offlinePlayground` ein kurz noch sichtbares Spielbrett zählte (Korrektur in `277e652`). Nur gelesen, kein Browserlauf.

**Ergebnis:** In `tests/browser/*.mjs` gibt es keine zweite Stelle, die genau so wie der alte `offlinePlayground` abbiegt (Brett zählen und dann entscheiden, während sich die Seite umbaut). Es gibt aber ein paar schwächere Verwandte. Ich habe keinen Browserlauf gestartet, nur gelesen und gesucht.

**Ursache im Kern.** `useZurUebersicht` (`app/zur-uebersicht.ts`) schließt das Spiel erst in einem `useEffect`, also nach dem Klick auf „Spiele“. Das alte Brett steht so einen Augenblick weiter da. Jede Messung zwischen Klick und diesem Effekt sieht noch den alten Stand. Das gilt auch für Labor und Reisen, falls dort dasselbe Muster auftaucht.

**Vorgehen.** Es gibt rund 900 Augenblicksmessungen in 105 Dateien. Ich habe nur die gesichtet, die einen Weg wählen (`if`, `?:`, `&&`, Schleifenbedingung). Ich habe nicht jede einzelne `assert` gelesen. Reine Prüfungen wie `assert.equal(await x.isDisabled(), …)` können höchstens flackern, aber den Weg nicht ändern.

## Muss
Keine Stelle.

## Soll

1. **`tests/browser/harness.mjs:77`** (`hilfeOeffnen`): `if (await kurz.isVisible())` entscheidet, ob „So geht’s“ oder der Weg über den Fuß genommen wird. Seit `app/kern/kern.css:375` steht „So geht’s“ in jeder Breite auf der Startseite, der Fuß-Zweig (Zeilen 82–86) ist damit toter Code. Ist der Knopf im Moment der Messung noch nicht gezeichnet, nähme der Test still den anderen Weg. Er gäbe dann `eltern` statt `kurz` zurück, und die Fokus-Rückkehr-Prüfung in `audit-ui.mjs:29` würde rot. Das Risiko ist gering, weil der Knopf im Hero liegt und nicht nachgeladen wird. Korrektur: `await kurz.waitFor()` statt `isVisible()`, den Fuß-Zweig streichen. Das ist zugleich Aufräumen. Aufrufer sind `guides.mjs:9` und `audit-ui.mjs:29`.

2. **`tests/browser/karte-hilfen.mjs:176-184`** (`angezeigteFrage`): Die Funktion liest `aria-labelledby` des ersten „Rate mal!“-Bereichs im Augenblick und lässt `assert.ok` auf „Frage gehört zur Karte“ folgen. Läuft der Aufruf gleich nach einem Kartenwechsel, kann noch die Frage der alten Karte stehen, und der Test bricht mit einer falschen Meldung ab. Die meisten Aufrufer warten vorher auf den Kartentitel (`titelIst`, `waitForFunction` auf `#world-topic-title`). Nicht alle habe ich belegt. Korrektur an dieser einen zentralen Stelle: erst per `waitForFunction` warten, bis die ID aus `aria-labelledby` zu `fragenDerKarte(t)` gehört, danach lesen. Das schützt alle Aufrufer auf einmal.

## Kann

3. **`tests/browser/connected-discoveries.mjs:143-145`**: Nach `next.click()` (Zeile 155) wartet die Schleife auf `.world-mini-question` und liest dann sofort den Titel mit `getAttribute`. Käme die neue Station erst nach einem Frame, würde `assert.equal(t.id, route.topics[i])` mit der alten Station rot. Ich halte das für unwahrscheinlich, weil der Stationswechsel ein State-Update im Klick ist, belegen kann ich es nicht (unklar). `route-revisit.mjs:29` macht es besser: Dort wartet der Test auf die Überschrift der erwarteten Station. Korrektur: auf `#world-topic-title[aria-label="<erwarteter Titel>"]` warten, bevor gelesen wird.

4. **`tests/browser/playground.mjs:70`**: `if(!(await zeile.locator('.stufen-zeile').filter({hasText:'Stufe: '+name}).count()))` tippt „Stufe ändern“. Das steht in derselben Datei wie der Fund. Es ist trotzdem harmlos, denn `.stufen-wahl` und `.stufen-zeile` entstehen im selben Aufbau (`app/kern/stufen-wahl.tsx:42-43`), und `zeile.waitFor()` läuft davor. Der Pass ist beim Öffnen längst geladen. Wer ganz sicher gehen will, wartet vorher auf `.stufen-zeile`.

5. **`tests/browser/book-particle.mjs:84`, `book-water.mjs:83`**: Die Schleife `!count()` klickt „Weitere Wörter entdecken“, ohne vorher zu warten, dass die erste Kartenseite da ist. Bei später Anzeige gäbe es einen Klick zu viel. Die Grenze `n<5` fängt das meist auf, es bleibt harmlos bis flackernd. Korrektur: vor der Schleife `await child.locator('.word-card h3').first().waitFor()`, so wie `book-pagination.mjs:11` es mit `waitForFunction` tut.

6. **`tests/browser/book-normalization.mjs:47`**: `if(!await card.count()) …click('Weitere Naturorte entdecken')` direkt nach dem Klick auf den Reiter „Naturatlas“. Ist der Reiter noch nicht gezeichnet, klickt der Test eine Seite zu viel, der Knopf wird aber beim Klick abgewartet. Harmlos.

7. **Stille Auslassungen** (kein rotes Flackern, aber eine Prüfung kann unbemerkt entfallen): `nature-learning-view.mjs:59` und `:63`, `nature-navigation-view.mjs:17`, `building-originals.mjs:74` (`.building-comparison`), `world-entry.mjs:9` (Knopf „Die Erklärung anschauen“). Wird das Element nicht rechtzeitig gezeichnet, fällt die Prüfung weg und der Test bleibt grün. Besser: aus den Daten ableiten, ob es das Element geben muss, und dann hart warten. Bei `building-originals.mjs:74` wäre das `t.building.exploration`, bei der Naturkarte die Bild-Daten.

8. **`tests/browser/retained-people-learning.mjs:123`**: `if(await actualDrawings.count()===0)` wählt zwischen SVG- und HTML-Teilen und verlangt im HTML-Zweig feste Anzahlen. Ist das SVG noch nicht gezeichnet, nimmt der Test den falschen Zweig und wird rot. Das ist unklar, denn ob `figure` vorher abgewartet ist, habe ich nicht verfolgt. Korrektur: nach `entry.figure` entscheiden (die Karte `htmlParts` gibt es schon), nicht nach `count()`.

## Geprüft und harmlos
- **Nach `goBack`:** `discovery-central.mjs:153, 279, 285, 339, 426`, `journeys.mjs:200`, `wissenskarte.mjs:277, 305, 532, 762`. Alle warten erst auf die Rückkehr des Fokus. Das ist wichtig, weil `restoreRouteView` (`app/hash-route.ts:32`) offene `details[data-history-disclosure]` erst dann wiederherstellt. Danach zeigt `mehr-erfahren` den Zustand korrekt.
- **Das Muster `if(!await d.evaluate(e=>e.open)) summary.click()`** (rund 100-mal, `reveal`, `aufklappen` und andere): Es ist nur riskant, wenn die App `open` nachträglich setzt. Das tut sie nur bei der Wiederherstellung nach Zurück. Ich habe keine Stelle gefunden, an der unmittelbar nach `goBack` ohne Fokuswarten aufgeklappt wird. Die Hilfe `aufklappen` (`karte-hilfen.mjs:25-33`) prüft zusätzlich nach dem Klick.
- **Memory** (`portable-flows.mjs:133-161`, `cover.count()`, `open.count()`, `isDisabled()`): `learning-games.tsx` und `advanced-games.tsx` haben bei den Memory-Karten keinen `setTimeout`. Der Zustand ist nach dem Klick sofort da.
- **Weitere harmlos:**
  - `guides.mjs:18` räumt nur im `finally` auf, ein zu viel gedrücktes Escape schadet nicht.
  - `discovery-central.mjs:258` und `journeys.mjs:203` überspringen nur die Größenprüfung, wenn etwas unsichtbar ist.
  - `audit-ui.mjs:51-52` und `book-commands.mjs:13` laufen bis zum Endzustand, der danach per `assert` geprüft wird.
  - `karte-hilfen.mjs:135`, `:215` und `:224` sind im selben Aufbau wie die Frage (Zeile 182 wartet auf den Fragetext).
  - Bereichswechsel in `habitat-answer-semantics.mjs:15`, `animal-game-saves.mjs:16`, `backup.mjs:50` und `:69`, `world-game-learning-copy.mjs:20`, `foundation.mjs:57` und `:75`, `spiel-auswahl.mjs:43`, `:114` und `:190`: Danach folgt immer ein Klick oder `waitFor` auf etwas, das nur die Übersicht hat (`[data-game-key]`, `.game-tile`, `.continue-card`). Das alte Spiel kann den Test dort nicht täuschen. `playground.mjs:43` wartet bereits auf `.playground-grid:visible`.
- Die Korrektur in `playground.mjs:164` (`.playground-grid:visible` abwarten) ist die richtige Art von Warten.

## Nicht geprüft
- Kein Lauf, weder einzeln noch gesamt (die Vollprüfung läuft parallel). Alles ist aus dem Code gelesen. Ob eine der Stellen in der CI schon flackerte, habe ich nicht in den CI-Verläufen oder im `BACKLOG.md` nachgesehen.
- Die Annahme „State-Update im Klick ist synchron“ (Punkt 3) kommt aus dem Code von React und der App, nicht aus einer Messung.
- Die übrigen rund 700 reinen `assert`-Messungen habe ich nicht einzeln gelesen. Die `evaluate`-Aufrufe in `nature-model-geometry.mjs` und `wissenskarte.mjs` habe ich nur stichprobenartig angesehen.

**Hinweis für die Unterlagen:** Zu `CLAUDE.md` „Seitenwechsel im Test“ würde ein Satz passen: „Nach einem Klick auf einen Bereich, der ein offenes Spiel, Labor oder eine Reise schließt (`useZurUebersicht`, per Effekt), ist das alte Bild noch kurz da; ein Test wartet auf etwas, das nur die Übersicht hat, und zählt nicht das alte Bild.“ Das ist ein Vorschlag, ich habe nichts geändert.
