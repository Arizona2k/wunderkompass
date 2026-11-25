# Code-Prüfung: Auflösung und Rückmeldung im Blick

Helfer: `code-pruefer` (opus / high), 25.11.2026, Arbeitsstand im Nebenordner vor dem PR. Bericht unverändert gesichert; was Claude daraus macht, steht in der [Endfassung](2026-11-25-spiel-aufloesung-endfassung.md).

**Ergebnis:** Noch nicht bereit. `pnpm test` ist rot, und die neue Suite kippt per Zufall in etwa jedem achten Lauf. Am Code der App habe ich keinen schweren Fehler gefunden; Pass und gespeicherte Runden sind sicher.

## Befunde

### Muss

**1. `pnpm test` ist rot.**
- Datei: `/home/user/wunderkompass/…/wt-aufl/tests/browser-suites.test.mjs:16-23`
- Zwei Tests schlagen fehl: „Rauchtest, Pflicht- und Vollprüfung sind vollständig eingetragen“ und „CI-Satz enthält die Tempo-Prüfung“.
- Ursache: Die feste Liste `CI` kennt `spiel-fokus` nicht. Die gemeldeten „16/16 grün“ galten nur für `world-game-learning-copy.test.mjs`.
- Vorschlag: `'spiel-fokus'` in `ANSICHTEN` aufnehmen (Zeile 21) oder in `PASS_OFFLINE`.

**2. Die Suite `spiel-fokus` kippt zufällig.**
- Datei: `tests/browser/spiel-fokus.mjs:47-69`
- Der Test klickt die Antworten immer von oben nach unten. Ist bei jeder Aufgabe einer Runde die erste Antwort richtig, wird „falsch“ nie geprüft. Nach der letzten Aufgabe klickt der Test dann „Runde abschließen“. Danach gibt es keine Antwortknöpfe mehr, und `antworten.first().waitFor()` läuft in die Zeitgrenze.
- Bei `classic:detective` hat jede Aufgabe nur zwei Antworten („Stimmt“ / „Stimmt nicht“), und eine Runde hat vier Aufgaben.
- Gemessen mit den echten Rundenfunktionen, je 20 000 Runden: Wie oft ist in jeder Aufgabe die erste Antwort richtig?
  - Klassik: 6,1 %
  - Personen: 0,37 %
  - Kreuz und quer: 0,09 %
- Hochgerechnet (nicht gemessen): je Browser rund 12 % rote Läufe, bei zwei Geräten. Je PR (Chromium Pflicht, dazu Firefox und WebKit) liegt die Chance auf mindestens einen roten Lauf bei rund 30 %.
- Vorschlag: Die falsche Antwort gezielt wählen. Die Runde aus `localStorage` lesen (`gameSessions[...]`), die richtige Antwort über `CLASSIC_QUESTIONS`, `CHALLENGE_BANK` oder `worldGameBank` bestimmen und in Aufgabe 1 erst eine falsche, dann die richtige klicken. Alternativ eine feste Runde per `addInitScript` vorgeben, wie in `learning-tasks.mjs:47`.

### Soll

**3. Ein hoher Kasten wird nie geprüft, und dann liegt „Weiter“ außer Sicht.**
- Datei: `app/kern/spiel-fokus.ts:65-68`
- Passt der Kasten nicht ins Bild, steht sein Anfang oben. „Weiter“ bekommt den Fokus mit `preventScroll` und liegt dann unter dem Bildrand: Wer mit der Tastatur spielt, sieht den Fokusrahmen nicht.
- Fall: Bei `technology` ist die Erklärung bis zu 534 Zeichen lang. Bei 320 oder 360 px ist der Kasten damit vermutlich höher als die rund 570 px über der Leiste (geschätzt, nicht gemessen). Vorher rollte `focus()` den Knopf ins Bild.
- Die Abwägung „Richtig!“ vor „Weiter“ steht so im Kommentar und ist vertretbar.
- Vorschlag: In der Suite einen Fall mit `world:technology` bei 360 px ergänzen, damit der Weg mit „Anfang oben“ einmal läuft. Außerdem entscheiden, ob „Weiter“ in diesem Fall doch ins Bild rollen soll.

**4. Die Prüfung, ob der Kasten passt, vergisst den Abstand von 12 px oben und unten.**
- Dateien: `app/kern/spiel-fokus.ts:65`, `app/kern/kern.css:468`
- Ist der Kasten zwischen frei−24 px und frei hoch, rechnet der Code „passt“ und rollt mit `nearest`. Mit dem Abstand ist der Kasten dann aber höher als der freie Platz, und der Browser richtet den Anfang aus. Der Fuß des Kastens rutscht bis zu 12 px unter die Leiste.
- Auch der Test rechnet `passt` ohne den Abstand (`spiel-fokus.mjs:31-32`) und würde dann rot.
- Vorschlag: `k.getBoundingClientRect().height + 24 <= innerHeight - leiste`, oder den Abstand per `getComputedStyle(k).scrollMarginTop/Bottom` auslesen. Im Test genauso.

### Kann

**5. Der Rechner prüft wenig.**
- Datei: `spiel-fokus.mjs:52-53`
- Playwrights `click()` rollt den Knopf selbst ins Bild. Bei 1280×800 steht der Kasten danach wohl schon ohne Zutun der App im Bild; der Rechner-Durchlauf zeigt also kaum etwas. Dass die Suite gegen den alten Stand rot war, kommt vermutlich von 360 px.
- Vorschlag: Bei 1280 px eine niedrigere Höhe wählen (z. B. 600), damit der Kasten sicher außer Sicht liegt.

**6. Sanftes Rollen wird nie geprüft.**
- Datei: `spiel-fokus.mjs:76`
- Beide Geräte laufen mit `reducedMotion: 'reduce'`, also ohne `scroll-behavior:smooth`.
- Vorschlag: Ein Gerät mit `'no-preference'` laufen lassen. Das `waitForFunction` mit 4 s verträgt das, und so ist auch das sanfte Rollen in Firefox und WebKit abgedeckt.

**7. Ungewöhnliche Schreibweise im Test.**
- Datei: `spiel-fokus.mjs:58`
- `new Function('return ' + lage)` geht nur, weil die Seite keine CSP setzt (geprüft: keine in `vercel.json` oder `index.html`).
- Lesbarer wäre es, `lageImBrowser` einmal per `page.addInitScript` als `window.__lage` bereitzustellen.

**8. Selektor zu allgemein.**
- Datei: `spiel-fokus.mjs:13`
- `kasten: '.game-feedback'` ist ohne Spielraum geschrieben. Besser `.classic-learning .game-feedback`, wie bei den anderen beiden Spielen.

## Geprüft und in Ordnung

- **Pass und gespeicherte Runden:** IDs der Spielaufgaben, Antworttexte und Reihenfolgen bleiben gleich; geändert sind nur `why`, die Tipps und die Rückmeldung.
  - `tests/fixtures/gespeicherte-antworten*.json` und `scripts/antworten-stand.mjs` betreffen nur Kartenfragen; dort ändert sich nichts. `stable-ids.json` ist unverändert.
  - Gespeicherte then-now-Runden mit alter dritter Antwort laufen weiter: `restoreWorldGameOrders` nutzt `ALTE_DRITTE_ANTWORT` wie bisher. Sie bekommen jetzt `ZUKUNFT_FALSCH`.
  - `invention-compass-today` mit „Nur ein Zukunftswunsch“ geht weiter über `retiredAnswer`, ohne Kasten (`learning-tasks.mjs:67-71` passt dazu).
  - Gespeicherte people-Runden: Nur die Erklärung und die Rückmeldung ändern sich.
- **`zumWeiterKnopf`:** keine weiteren Aufrufer im Repository (auch nicht in Unterlagen).
- **Tests, die den Fokus auf „Weiter“ voraussetzen** (`playground.mjs:116`, `spiel-auswahl.mjs:159`): Sie bleiben gültig, weil der Fokus nach richtiger Antwort weiter auf „Weiter“ geht. Keine Browser-Suite prüft den alten Tipptext oder `paragraphs.join` als people-Erklärung.
- **`StufenVorschlagHinweis` → `onNein`:** unverändert. Es fokussiert `weiter.current ?? frage` ohne `preventScroll`, was dort richtig ist.
- **`requestAnimationFrame`:**
  - Nach dem Abbau prüft der Code `kasten.current` und `weiter?.current`, nichts geht kaputt.
  - Bei zwei Klicks im selben Frame (falsch, dann richtig) laufen beide Rückrufe; der letzte setzt den Fokus richtig. React schreibt Klick-Updates sofort, darum gibt es die Ref im Rückruf schon.
- **Rechner ohne untere Leiste:** `scrollPaddingBottom` ist dort `auto`, `parseFloat` ergibt NaN, also 0. Richtig.
- **Kopfleiste:** `.kern-kopf` klebt nicht oben fest, darum fehlt kein `scroll-padding-top`.
- **Firefox und WebKit:** kein `isMobile`, nur `hasTouch`. `scrollTo({behavior:'instant'})` und `focus({preventScroll})` gibt es in allen drei Engines.
- **Unit-Test** „Auflösungen und Profi-Tipp verraten keine andere Person“: prüft echtes Verhalten.
- **Doppelte Festlegung:** `DRITTE_ANTWORT` gibt es nur einmal (support.mjs); bank.ts exportiert sie weiter.
- **Typen und Lint:** `pnpm run typecheck` und `pnpm run lint` sind grün (selbst laufen lassen).

## Nicht geprüft

- Die neue Suite habe ich nicht selbst im Browser laufen lassen. Die Rate bei Befund 2 ist berechnet, nicht beobachtet.
- Wie hoch der `technology`-Kasten bei 320 px wirklich ist (nur aus der Textlänge geschätzt).
- Inhalt und Fakten der Auflösungen und Tipps.
- Größere Suiten mit `set: 'full'`.
- Ob es Einträge in CHANGELOG und „Was ist neu?“ gibt.

Meine Hilfsskripte für die Messungen liegen außerhalb des Repositorys:
- `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/runden-probe2.mjs`
- `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/laengen.mjs`
