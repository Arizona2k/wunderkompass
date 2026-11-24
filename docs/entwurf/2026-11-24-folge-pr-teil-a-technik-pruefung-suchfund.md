# Technik-Prüfung: später Suchfund in der CI von PR #108 (24.11.2026)

Helfer `technik-pruefer` (sonnet/high), nach dem späten Fund in der Engine-Schnellprüfung WebKit (Lauf 45344729398, `portable-flows`). Geprüft wurde der Stand `d3a192b` (Baustein `inSucheTippen`). Der Bericht steht unverändert hier, danach folgt „Was daraus wurde“.

---

**Ergebnis:** Die Korrektur ist ein vertretbarer Test-Workaround, aber keine Ursachenbehandlung. Sie entfernt genau den Zustand, der den Fehler ausgelöst hat. Das "bleibt die Eingabe"-Argument in den Unterlagen ist für WebKit nicht gedeckt. Es gibt dazu eine Lücke im Arbeitssystem, die ich unten als Blockierendes nenne.

**Gelesen habe ich:** `git show d3a192b`, `app/global-search.tsx`, `app/earth-explorer.tsx` (Zeilen 220, 331), `app/journey-content-data.ts`, `tests/browser/suites.mjs`, `stresslauf.mjs`, `journey-content.mjs` und alle Fundstellen der Suchtests per Grep. **Nicht ausgeführt:** keine Browserläufe, keine Probeskripte, kein `pnpm`. Die Läufe (1 von 1000, 0 von 853) habe ich nicht nachgemessen und übernehme sie von dir. Der Diff `origin/test-live...HEAD` für `app/` zeigte keine Änderungen. Das stützt "Seite unverändert". Den Fetch-Stand von `origin` habe ich nicht gesondert geprüft.

## Blockierend (aus meiner Sicht vor "Ursache offen, beobachten")

1. **Die Absicherung "Eingabe bleibt" läuft nie in WebKit.**
   - BACKLOG (neuer Punkt "Suche: Getipptes war einmal weg"), Entscheidungsliste (letzter Abschnitt) und der Kommentar in `tests/browser/harness.mjs` (`inSucheTippen`) berufen sich auf `journey-content` ("Typed query retained …").
   - Dieser Test steckt aber nur in der Suite `journeys` (`tests/browser/journeys.mjs:25`, `tests/browser/suites.mjs:85`: `set: 'full'`, `chromiumOnly: true`).
   - Er läuft also weder in Firefox noch in WebKit und nicht im CI-Satz. Der Fund trat in WebKit auf.
   - Er hält außerdem die Kapiteltexte bis nach dem `fill` zurück (`journey-content.mjs:~18`). Der kritische Fall "Ankunft während des Tippens" kommt darin nicht vor.
   - Nach der Korrektur testet in WebKit niemand mehr "Kapiteltexte kommen beim Tippen an". Der Baustein wartet genau diesen Moment weg.
   - Das ist die Abschwächung, die du fragst. Sie ist begründet, aber nicht ersetzt. Der Fehler kann damit unbemerkt in der Seite bleiben.
   - **Vorschlag:** Ein kleiner CI-Test, in allen Engines und mit echter Tastatur (`pressSequentially`, wie `book-commands.mjs:9`).
     - Auf `**/assets/journey-content-*.json` ein `context.route` legen.
     - Die Antwort in einer Schleife um 0, 20, 50, 100 ms nach dem Start des Tippens freigeben.
     - Danach prüfen: `inputValue` ist gleich dem Getippten, und "Passende Entdeckungen" erscheint.
   - Das macht aus "1 in 1000" einen gezielten Fall. Er ist auch ehrlicher als der Satz "Kommen die Kapiteltexte nach dem Tippen, bleibt die Eingabe (alle Läufe)".
   - Bis dahin sollte die Formulierung in BACKLOG, Entscheidungsliste und Kommentar sagen: "nur in Chromium, nur in `full`".

2. **Weitere Suchtests tragen dasselbe Risiko.**
   - Betroffen ist der erste Suchdialog nach einem frischen Seitenaufruf. Danach ist der Inhalt gepuffert (`useState(currentJourneyContent)`, `app/global-search.tsx:14`).
   - `tests/browser/no-news.mjs:25-27`:
     - Suite `no-news` im CI-Satz, also auch in Firefox und WebKit.
     - Frische Seite, `ready`, direkt `fill('Vulkan-Werkstatt')`.
     - Danach wartet es auf `option.filter(...)`. Bei verlorener Eingabe gibt es nur einen Timeout.
     - Das ist die direkteste Wiederholung des Fundes.
   - `tests/browser/people-learning.mjs:69` und `tests/browser/retained-people-learning.mjs:99`:
     - Hier ist unklar, ob der Inhalt schon gepuffert ist.
     - Im CI-Satz läuft `people-learning`.
   - Weitere Treffer in `full`:
     - `tests/browser/building-originals.mjs:65`
     - `tests/browser/science-originals.mjs:146-147`
     - `tests/browser/challenge-hints.mjs:14`
     - `tests/browser/invention-electrical.mjs:69`
     - `tests/browser/discovery-central.mjs:293-294`
     - `tests/browser/fallback-selected-focus.mjs:20`
     - `tests/browser/connected-discoveries.mjs:69`
     - `tests/browser/foundation.mjs:54`
   - Der Satz in der Entscheidungsliste "alle anderen Suchtests warten schon auf einen bestimmten Treffer" stimmt nur für die Rangfolge. Bei verlorener Eingabe sind sie genauso flaky. Sie scheitern nur laut, aber mit Timeout und ohne klare Meldung.
   - **Vorschlag:** Statt jeden einzeln zu ändern, den Baustein `inSucheTippen` als Standard nehmen, mindestens in `no-news` und `people-learning` (CI-Satz). Dort ist `option.first()` nicht nötig. Der Baustein bräuchte dafür einen optionalen Rückgabewert ohne Rangprüfung, was er schon hat. Die Treffer in `full` bei Gelegenheit nachziehen.
   - Sicher sind die Tests, die echte Tasten tippen und die Eingabe prüfen: `animal-learning.mjs:212-215` (Taste plus `inputValue`), `book-commands.mjs:9` und `book-context.mjs:28`.

## Bald

3. **Zur Ursache (Frage 1).**
   - Der Verdacht "Playwrights `fill` in zwei Schritten" ist nicht belegt. Mit Ereignisprotokoll kam es nie vor. Das Protokoll kann den Zeitablauf selbst verändern, ein 1-zu-1000-Treffer ist dünn.
   - Es bleibt die Möglichkeit, dass die Seite im WebKit-Fall eine Eingabe durch ein erneutes Zeichnen verwirft. Das Zeichnen läuft auf einem Rechenschritt mit großer Last: Beim Eintreffen der Kapiteltexte werden alle Einträge samt `prepareSearchDocument` neu berechnet (`app/global-search.tsx:17-18`).
   - Das Neuberechnen hängt außerdem an den Rückruf-Eigenschaften (`onPlace`, `onJourney`, …). Ihre Identität wechselt bei jedem Zeichnen des Elternteils. Das kann auf langsamen Handys eine spürbare Pause pro Neuzeichnen bedeuten.
   - Auf einem schwachen Gerät kann sich das beim Tippen von Kindern bemerkbar machen. Der Satz "Bisher gibt es keinen Hinweis, dass es Kinder trifft" ist deshalb richtig, aber kein Entwarnung. Besser: "nicht ausgeschlossen".
   - Die Ladedauer (`world.json`, `allPlaces` in `app/earth-explorer.tsx:220`) beeinflusst die Einträge ebenfalls, wird vom Baustein aber nicht abgewartet. Ein Treffer für `option.first()` könnte sich in Ausnahmen verschieben, wenn ein Ort (`place:`) erst nach der Überschrift eintrifft. Ich halte das für unwahrscheinlich bei den vier Suchbegriffen. Es ist aber keine Zusicherung.

4. **Unterlagen.**
   - `STATUS.md` erwähnt den vierten Fund nicht und spricht weiter von "Fünf späte Funde" (Zeile 13). Die Entscheidungsliste zählt dagegen "Dritter / Vierter" (`docs/entwurf/2026-11-23-teilschritt-3-teil-a-entscheidungen.md:136`, `:205`). Die Zählung weicht ab. Bitte abgleichen oder ausdrücken, was gezählt wird.
   - Der Stresslauf-Hinweis stimmt (`tests/browser/stresslauf.mjs` bremst nur `requestAnimationFrame`). Er steht auch richtig im BACKLOG.

## Klein

5. **Frage 3 (Hängen).** Ich habe den Baustein gegen `app/global-search.tsx:22` gelesen und sehe keinen Hänger im Normalfall:
   - **Status-Text:** Er steht im selben Zeichnen wie das Eingabefeld. `waitFor({state:'detached'})` läuft deshalb nicht ins Leere. Ist der Inhalt schon gepuffert, ist der Text nie da und `detached` löst sofort.
   - **Fehlerfall oder offline:** Bei Fehlschlag wechselt der Text zu "Kapiteltexte sind gerade nicht erreichbar …". Der exakte Treffer verschwindet, `detached` ist erfüllt, und der Test tippt weiter. Das ist gewollt. Die Fehlerfälle prüft `journey-content` ohnehin. Die Abbruchzeit des Abrufs (12 s, `app/journey-content-data.ts`) liegt unter den Standard-Timeouts (20 s und mehr). Mit einem Standard-Timeout von 12 s in manchen Suiten wäre das knapp. Ein Fall mit hängendem statt abgewiesenem Abruf kommt in offline-Suiten nicht vor.
   - **"Passende Entdeckungen":** Sie erscheint nie, wenn der Suchbegriff keine Treffer hat. Dann gibt es einen Timeout mit der Meldung des Wartens statt "kein Treffer". Das ist laut und in Ordnung. Eine eigene Meldung wäre hübsch, aber nicht nötig.
   - **Mehrfach vorhandene Überschrift:** Es gibt nur eine Gruppe, also keine Strict-Mode-Verletzung.

## Frage 5: Arbeitssystem

- **Netz-Stresslauf analog zur Frame-Bremse.** `QA_NET_DELAY_MS` mit einer Zufallsverzögerung (0 bis 150 ms) auf `**/assets/*` über `context.route`, im selben Modul `tests/browser/stresslauf.mjs`. Das kostet nichts und fängt genau diese Klasse (Daten kommen mitten in einer Eingabe). Dazu ein `--repeat N` für einzelne Suiten, damit ein 1-zu-1000-Fall überhaupt sichtbar wird.
- **Eine WebKit-Suite mehr in `pnpm run check`.** Die dritte Meldung aus der Engine-Schnellprüfung WebKit (nach `pass-spielstaende` und dem Spiegel) zeigt: Die WebKit-Suiten laufen lokal nur als `offline-cold` und `backup`. `portable-flows` (kurz, laut deiner Messung 0,9 s bis zum Fehler) und `no-news` wären günstige Ergänzungen in `test:browser:webkit`. Die Gesamtlaufzeit des CI-Satzes in WebKit (rund 5 Minuten laut BACKLOG) bliebe unverändert, weil sie ohnehin in der Engine-Schnellprüfung laufen.
- **Nicht blockierend, aber merken:** `engine-journeys` und die Engine-Suiten laufen in WebKit nur in der CI. Beim nächsten späten Fund dieser Art prüfen, ob die Suite in `check` fehlt.

## Geprüft und in Ordnung

- Der Baustein `inSucheTippen` (`tests/browser/harness.mjs:20-40`) liest sich korrekt: Er öffnet die Suche, wartet auf das Feld, wartet den Ladehinweis weg, tippt, wartet auf die Überschrift und prüft `inputValue`.
- Bei verlorener Eingabe gibt es jetzt eine klare Fehlermeldung statt `lab:moon`.
- Die Rangfolge wird weiter streng geprüft (`tests/browser/portable-flows.mjs`, `data-value` des ersten Treffers). Die Bronzezeit-Prüfung (`tests/browser/history-learning.mjs:58`) behält ihr `count() === 1`. Das Nutzen von `dialog.getByRole('option')` statt `page.getByRole('option')` ist unschädlich.
- Die Aussage "Überschrift nur über Treffern zu einer Eingabe" stimmt (`term ? 'Passende Entdeckungen' : 'Ideen für deine nächste Entdeckung'`, `app/global-search.tsx:22`).
- Die Aussage "Stresslauf bremst nur `requestAnimationFrame`" stimmt.
- Die Beschreibung "Seite unverändert" stützt der Diff gegen `origin/test-live` (keine Änderungen in `app/`).
- Der Commit-Text, die Entscheidungsliste und das BACKLOG sind in den Fakten (Lauf-ID, Zahlen, Dateien) untereinander stimmig.

## Nicht geprüft

- Ursache und Nachstellbarkeit in WebKit, die Läufe aus deiner Beschreibung, die laufende Vollprüfung in Chromium, `pnpm outdated` und `pnpm audit` (kein Auftrag hier, Frage 4 und 5 der Liste), `timeout-minutes` gegen aktuelle Laufzeiten, Vercel und Branch-Regeln.
- Ob `people-learning` beim Suchen schon gepufferte Kapiteltexte hat (nur gelesen, nicht gelaufen).
---

## Was daraus wurde (Claude, 24.11.2026)

1. **Blockierend 1, „Eingabe bleibt“ läuft nie in WebKit:** Befund am Code bestätigt (`suites.mjs`: `journeys` mit `set: 'full'`, `chromiumOnly: true`; Freigabe erst nach `fill`). Umgesetzt wie vorgeschlagen: `tippenWaehrendKapiteltexteKommen` in `tests/browser/portable-flows.mjs`, eingebunden in die Suite `portable-flows` (CI-Satz, alle drei Browser). Echte Tastendrücke (`pressSequentially`, 30 ms Abstand), Kapiteltexte per `context.route` zurückgehalten und 0, 20, 50, 100 oder 150 ms nach dem ersten Tastendruck freigegeben, jede Verzögerung auf einer frischen Seite mit Service Worker aus. Der Test prüft vor dem Tippen, dass der Ladehinweis steht (die Kapiteltexte also wirklich noch fehlen), danach Eingabe, „Passende Entdeckungen“, ersten Treffer (Elefant) und genau eine Anfrage. Probe: 200 Fälle in WebKit, je 100 in Chromium und Firefox, kein Buchstabe verloren. Kommentar in `inSucheTippen`, BACKLOG und Entscheidungsliste nennen jetzt diesen Test statt `journey-content`.
2. **Blockierend 2, weitere Suchtests:** `no-news` (CI-Satz) nutzt jetzt `inSucheTippen`. Widerspruch beim Rest: `people-learning.mjs:69` und `retained-people-learning.mjs:99` laufen nicht im CI-Satz, sondern in `peopleSourceView` und `retainedPeopleSourceView` mit `questions: true`, also aus `article-atlas.mjs` in `core` (Vollprüfung). Die Suite `people-learning` im CI-Satz ist `peopleLegacyRound` und sucht nicht. Diese beiden und die übrigen Treffer der Vollprüfung (dazu `research.mjs:84-85`) stehen mit Fundstellen im BACKLOG zum Nachziehen bei Gelegenheit. Im CI-Satz tippt sonst kein Test mit `fill` in die Suche (`kern-huelle` öffnet sie nur; `animal-learning` tippt mit echter Tastatur und prüft die Eingabe, läuft in der Vollprüfung).
3. **Bald 3, Ursache:** „kein Hinweis, dass es Kinder trifft“ ersetzt durch „nicht ausgeschlossen“; der Verdacht heißt jetzt ausdrücklich „nicht belegt“. Die Neuberechnung der Einträge bei jedem Zeichnen ist am Code bestätigt (`onLab` ist in `earth-explorer.tsx:331` eine neue Funktion bei jedem Zeichnen) und steht als eigener BACKLOG-Punkt („Suche rechnet bei jedem Neuzeichnen alles neu“). Der Hinweis zu `world.json`: kein Treffer der vier Suchbegriffe ist ein Ort; bleibt eine Restunsicherheit, kein Umbau.
4. **Bald 4, Zählung:** Die Überschrift heißt jetzt „Später Fund in der CI von PR #108“, mit einem Satz, was `STATUS.md` zählt (die fünf Funde von Teil A, PR #107).
5. **Klein 5:** keine Änderung nötig.
6. **Frage 5, Arbeitssystem:**
   - Netz-Stresslauf `QA_NET_DELAY_MS` und `--repeat N`: ins BACKLOG übernommen (beim Punkt zum Suchfund), nicht jetzt gebaut. Der gezielte Test deckt diesen Fall schon in jedem PR ab.
   - Weitere WebKit-Suiten in `pnpm run check`: abgelehnt. Ein Fall von 1 zu 1000 wäre lokal mit einem zusätzlichen Lauf nicht aufgefallen. Der Stresslauf in `/pruefen` prüft vor jedem PR den ganzen CI-Satz in WebKit, die Engine-Schnellprüfung in jedem PR ebenso. `check` bleibt dadurch kürzer.
