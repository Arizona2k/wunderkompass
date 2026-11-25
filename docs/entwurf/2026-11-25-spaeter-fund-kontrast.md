# Später Fund: Kontrast nach der neuen Papierfarbe (Technik-Prüfung)

**Ergebnis:** Der CI-Satz prüft Kontrast per axe nur in drei kleinen Ausschnitten (Pass, „Was ist neu?“, Sonnensystem). Startseite, Themenwelten, Spiele, Labore, Lernreisen, Wörterbuch und die Wissenskarte selbst sind nur in Suiten des Satzes „full“ abgedeckt. Die günstigste Vorkehrung ist eine neue kleine CI-Suite `kontrast` (Chromium, axe nur `color-contrast`, ganze Seite, rund 12 Ansichten, 320 und 1280 px). Sie kostet vermutlich 30 bis 60 s Suitenzeit, im Pflicht-Job wohl nur 15 bis 30 s Wanduhrzeit. Eine Regel in CLAUDE.md oder ein Unit-Test über Kernfarben hätte den Fehler nicht gefangen.

> Helferbericht (technik-pruefer, sonnet), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

## Zu Frage 1: Warum sah der CI-Satz das nicht?

Die Regeln sind nicht das Problem. Alle axe-Aufrufe im CI-Satz nutzen die Tags `wcag2a, wcag2aa, wcag21aa, wcag22aa`, und `color-contrast` gehört zu `wcag2aa`. Das Problem ist der Ausschnitt: Die Aufrufe laufen nur auf einzelnen Containern.

Axe-Aufrufe in Suiten mit `set: 'ci'`:

| Suite | Ausschnitt | Fundstelle |
|---|---|---|
| `pass-atlas` | `.passport-atlas` (320 und 1440 px) und `.pass-confirmation` | tests/browser/pass-atlas.mjs:101–118 |
| `kern-huelle` | nur `.kern-neuigkeiten` („Was ist neu?“) | tests/browser/kern-huelle.mjs:794–798 |
| `solar-labels` | nur `.model-solar-system` | tests/browser/solar-comparison.mjs:37, 44 |
| `people-learning` | `.people-evidence`, aber nur wenn `window.axe` schon da ist | tests/browser/people-learning.mjs:71 |

Zu `people-learning`: Die Datei lädt axe nicht selbst (kein `AXE_FILE`, kein `addScriptTag`). Die Prüfung läuft vermutlich im CI-Satz nie. Das habe ich nicht durch einen Lauf belegt.

Die Suite `wissenskarte` (CI, rund 116 s) hat gar kein axe. Sie misst Kontrast nur mit dem eigenen Helfer `kontrast` an A/B/C-Buchstaben und zwei Knöpfen (tests/browser/wissenskarte.mjs:410, 441). `reise-kapitel` hat ebenfalls kein axe (nur Tippflächen und Aufklapper).

In `set: 'full'` stehen diese Prüfungen:
- `components` (foundation.mjs:73): `#labs` `.research-world`, nur 320 und 1440 px. Das war die erste Meldung, die Suite braucht nur 38 s.
- `core` über `article-atlas.mjs:57`: axe auf `.wissenskarte` an acht Karten. Das ist die einzige axe-Prüfung auf Kartentexten und Kartenaufbau, und sie steckt im 718-s-Block `core`.
- `book-measurements.mjs:50`: „current word accessibility“, in `journeys`.
- `home`: axe auf `.discovery-hero`, `.discovery-worlds`, `.discovery-pathways`, `.kern-leiste` und `.continue-card` (discovery-central.mjs:193, 383). Die Suite braucht 176 s.
- `research`, `playground`, `challenge`: axe je auf ihrem eigenen Ausschnitt.

Dein Skript hat auf `#book` 236 Treffer für #567683 gefunden. Dort steht die größte Fläche mit Nebentext, und sie liegt in keiner CI-Suite.

Warum der Fehler gerade jetzt auffiel: Der alte Wert lag knapp über der Grenze (rund 4,5:1). Jede Änderung der Seitenfarbe schiebt dann alle hart eingetragenen Grautöne in `app/globals.css` über die Grenze, und nur die Suiten mit passendem Ausschnitt melden es. Die Farbänderung war also der Auslöser. Das Muster „Fehler nur dort, wo der Ausschnitt zufällig liegt“ gilt für jede Farb- oder Hintergrundänderung.

## Zu Frage 2: Empfehlung

**Neue Suite `kontrast`, `set: 'ci'`, `chromiumOnly: true`.**

Dateien:
1. **Neu: `tests/browser/kontrast.mjs`.** Das ist dein Skript `kontrast-alle.mjs` im Scratchpad, nur robust gemacht:
   - Ansichten wie im Skript, ohne `#updates` (das deckt `kern-huelle` ab): `''`, `#world`, zwei Wissenskarten (`#world/topic/animal-whale-shark`, `#world/topic/history-pyramids`), `#games` und eine Spielkachel, `#labs` und eine Laborkachel, `#journeys` und eine Reise, `#book`, `#book/words/Meter`, `#globe`, eine Weltreise.
   - Statt `waitForTimeout(1800/1500/400)` nimmt der Test `ready(page)` aus `harness.mjs` und `ladeanfragen(page)()` als Wartepunkt. Alle `details` werden geöffnet wie im Skript. Die Seite wird mit `ctx.monitor(page)` überwacht.
   - `axe.run(document, {runOnly: {type: 'rule', values: ['color-contrast']}})`. Die Meldung zeigt die einzelnen Farbpaare („#58737e auf #edf1ea (4.4 < 4.5:1)“), je ein bis drei Selektoren und den Textanfang. Das war im Skript der nützlichste Teil, weil es sagt, welche Farbe geändert werden muss.
   - Das Skript meldete ein fehlendes Klickziel nur mit `console.log`. Im Test wird daraus ein `assert`. Dazu eine Sperre gegen leere Erfolge: Pro Ansicht muss `result.passes` oder `result.violations` Knoten enthalten, sonst hat axe nichts geprüft.
   - `incomplete` (Text über Bildern oder Verläufen) zählt nicht als Fehler. Das ist eine bekannte Grenze von axe.
2. **`tests/browser/suites.mjs`:** Eintrag `{name: 'kontrast', set: 'ci', chromiumOnly: true, run: kontrast}`. Er kommt nach `performance`, ohne `solo`, damit er in der zweiten Bahn von `--jobs 2` mitläuft.
3. **`tests/browser-suites.test.mjs`:** `'kontrast'` in die Liste `CI` aufnehmen (neben `'performance'`, Zeile 19–20). Sonst schlagen die Tests „Rauchtest, Pflicht- und Vollprüfung sind vollständig eingetragen“ und „CI-Satz enthält die Tempo-Prüfung“ fehl.
4. **`CLAUDE.md`:** In der Zeile `pnpm run test:browser` (Tabelle Befehle) „Kontrast“ ergänzen. Keine neue Arbeitsregel nötig.

`shards.mjs` braucht keine Änderung: Die Gruppe „rest“ fängt neue Suiten selbst auf, das prüft schon `tests/browser-shards.test.mjs`. In der Engine-Schnellprüfung (Firefox und WebKit) läuft die Suite nicht, weil `chromiumOnly`. Das ist in Ordnung, denn axe rechnet engine-unabhängig. Die Messung läuft auf den Computed Styles und nicht auf dem Rendering.

**Laufzeit.** Ohne Messung, nur aus dem Vorhandenen abgeleitet:
- Dein Skript brauchte 1 bis 2 Minuten für 30 Seitenaufrufe, überwiegend wegen fester Wartezeiten von rund 3,7 s je Aufruf. Mit Wartepunkten nach `ready` sollte die Suite bei 30 bis 60 s liegen.
- Zur Einordnung: Die Chromium-Suiten des CI-Satzes summieren sich laut check-final.log auf rund 684 s, verteilt auf zwei Bahnen. Das sind etwa 6 bis 7 Minuten Wanduhrzeit, plus rund 15 bis 30 s für die neue Suite. Gegen `timeout-minutes: 20` bleibt reichlich Puffer.
- Eine echte Dauer der letzten CI-Läufe steht weder in STATUS.md noch in den Berichten. Den Puffer kann ich daher nicht gegen CI-Daten belegen, nur gegen die lokalen Zeiten.
- Gibt es Zeitdruck, ist die Reduktion „1280 px nur für `''`, `#world`, `#book`, eine Karte“ ohne Verlust möglich. Kontrast hängt vor allem an Farbe und Hintergrund und kaum an der Breite. 320 px bleibt, weil dort Text über Bildern und gestapelte Flächen am ehesten kippen.

**Vor dem Commit prüfen (Regel „nie gelaufener Testblock“).** Die Suite muss einmal gegen den Stand vor der Korrektur rot werden. Dafür gibt es schon einen Build im Scratchpad: `QA_DIST=/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/dist-s1 node tests/browser/run.mjs --suite ci kontrast`. Erwartet sind rote Meldungen mit #58737e, #567683 und #57727d. Danach muss sie auf dem korrigierten Build grün sein. Ohne diesen Gegenbeweis wäre die Suite nur ein unbewiesener Wächter.

**Warum nicht die anderen Wege (Frage 2):**
- **Unit-Test über Kern-Farbpaare: abraten.** Die drei Fehlerfarben (#58737e, #567683, #57727d) waren hart eingetragene Hexwerte in `globals.css`, keine Kern-Variablen. Ein Test über `--kern-*`-Paare hätte nichts gesehen. Ein Test, der alle Hexfarben in CSS gegen `--kern-grund` rechnet, würde falsch alarmieren, weil die Hintergründe je Stelle wechseln (Weiß, Petrol-zart, Tönungen). Das wäre die Pflege einer zweiten Kontrastrechnung neben axe.
- **Nur eine CLAUDE.md-Regel („wer Kernfarben ändert, lässt components und journeys laufen“): abraten.** `journeys` allein dauert rund 2082 s (35 min), `components` deckt nur `#labs` ab, und `#book` liegt in `journeys`. Die Regel ist teuer, leicht zu vergessen, und sie widerspricht „weniger Bürokratie“. Der Fehler stand schon einmal in Schritt 1 mit einer ähnlichen Regel für `core`, und er kam trotzdem spät.
- **axe `color-contrast` in eine bestehende Suite einbauen: abraten.** `wissenskarte` (116 s) und `kern-huelle` (121 s) sind schon die längsten CI-Suiten. Eine eigene Suite hat einen eigenen Namen in den Zeitdateien, ist einzeln startbar (`--suite ci kontrast`) und lässt sich einzeln kürzen.
- **Alle WCAG-Tags auf der ganzen Seite statt nur `color-contrast`: abraten.** Andere Regeln wie Landmarks oder doppelte IDs würden Altlasten melden, die nichts mit der Farbe zu tun haben. Das macht den Test wartungsintensiv.

## Zu Frage 3: Weitere Stellen mit demselben Muster

Nach Risiko für die nächsten Schritte geordnet. Alles hier steht nur in `full`.

**Bald**
1. **Wissenskarte (Schritte für Karten und Bilder).** axe auf `.wissenskarte` an acht Karten steckt in `core` (article-atlas.mjs:57), also in einer 718-s-Gruppe. Die CI-Suite `wissenskarte` prüft Kontrast, Schrift 14 px und Tippflächen nur an A/B/C und zwei Knöpfen. Die neue `kontrast`-Suite deckt zwei Karten ab. Zusätzlich sollte `kontrast` einen Bildtext-Fall enthalten (Karte mit Foto und Bildnachweis). Dort liegen die kleinen blassen Texte, die der Bericht der Design-Prüfung in Schritt 1 erwähnt (BACKLOG Z. 25: „sehr kleine, blasse Meta-Texte und Bildnachweise“).
2. **Leiste und Startseite (Schritt 2).** Hier fängt `kern-huelle` (CI) die Hülle, aber Geometrie und axe der Startseite stehen in `home` (176 s) und `home-visits` (168 s). Diese Suiten sind zu lang für CI. Die neue `kontrast`-Suite deckt Farben der Leiste und der Startseite ab. Layoutfehler (Tippflächen, Umbruch) deckt sie nicht ab. Dafür gibt es schon `tippflaechen48` und `schrift14` aus `tests/browser/lesbarkeit.mjs`, nur für Karte und Reise-Kapitel. Folgevorschlag: dieselben zwei Helfer auf der Startseite und in der Leiste im CI-Satz einsetzen, wenn Schritt 2 die Leiste umbaut. Das wäre eine kleine Ergänzung in `kern-huelle.mjs` oder `kontrast.mjs`, aber erst bei Bedarf, nicht auf Vorrat. Der design-pruefer hat in Schritt 1 selbst viele Texte unter 16 px und 44-px-Flächen gefunden (docs/entwurf/2026-11-25-umbau-schritt-1-design-pruefung.md:82). Das kann Schritt 2 oder 4 wiederholen.
3. **`people-learning` (CI).** Die axe-Prüfung auf `.people-evidence` läuft vermutlich nie (siehe oben). Entweder `prepareAxe(page)` aus `axe-loader.mjs` davorsetzen oder die Zeile streichen. Beides ist klein und gehört in denselben PR.

**Klein**
4. **`components` (38 s, `chromiumOnly`)** ist so schnell, dass sich ein Teil im CI-Satz lohnen könnte. Weil die neue Suite `#labs` und `#games` ganzseitig abdeckt, ist das nicht nötig. Ich würde es nicht verschieben.
5. **Spiele:** `challenge` und `playground` sind Voll-Suiten mit axe auf `.knowledge-challenge`, `.classic-learning`, `.playground`. Die Rückmeldungsfarben (Richtig/Falsch, `--kern-richtig-zart`) liegen erst nach einer Antwort im DOM. `kontrast` sieht sie nicht, weil sie nur die Ansicht im Ausgangszustand prüft. Die Suite `wissenskarte` prüft diese Zustände mit `kontrast` an den A/B/C-Buchstaben schon. Im Schritt für Spiele muss der Zustand „nach Antwort“ in `kontrast` oder in `spiel-fokus` (CI) dazukommen.
6. **Ablauf-abhängige Zustände** (Hover, Fokusring, geöffnete Dialoge) sieht auch `kontrast` nicht. Der Fokusring wird in `pass-atlas` (CI) mit `keyboardRing` geprüft.

## Geprüft und in Ordnung
- Alle axe-Aufrufe in `tests/browser/*.mjs` per grep durchgesehen. Ob jede Suite wirklich `set: 'ci'` oder `'full'` hat, steht in tests/browser/suites.mjs:42–112.
- Alle Tags enthalten `wcag2aa`, also `color-contrast`.
- Laufzeiten der CI-Suiten aus `check-final.log` im Scratchpad.
- `tests/browser-suites.test.mjs` und `shards.mjs`: Eintrag und Gruppe „rest“ sind vorbereitet, keine Änderung an `shards.mjs`.
- Dein Skript `kontrast-alle.mjs` und seine Ausgaben (`kontrast-alle.txt`). Die drei genannten Farbpaare tauchen dort mit 4,25 bis 4,47:1 auf.
- Git-Stand: nur `app/globals.css` geändert, wie von dir beschrieben. Ich habe nichts geändert.

## Nicht geprüft
- Die echte CI-Dauer des Pflicht-Jobs gegen `timeout-minutes: 20` (quality.yml:20). Eine Dauerliste fehlt in STATUS.md und BACKLOG.md. Die 6 bis 7 Minuten oben sind eine Rechnung aus den Suitenzeiten.
- Die Laufzeit der neuen Suite. Sie ist eine Schätzung aus deinem Skript.
- `pnpm outdated`, `pnpm audit`, Vercel und Branch-Regeln: nicht Teil dieser Frage, nicht angesehen.
- In `engine-final.log` im Scratchpad steht ein roter Lauf `pass-atlas [firefox]` (Fokusring-Kontrast „system-color“ 2,94:1). Ob das der später behobene oder noch offene Stand ist, habe ich nicht geklärt. Bitte vor dem Merge gegen den aktuellen Lauf prüfen.
