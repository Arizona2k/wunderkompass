# Technik-Auflösungen: Code-Prüfung (25.11.2026)

Helfer: `code-pruefer` (opus/high), Diff `c925a60..arbeit-technik` (lokaler Zwischenstand). Nur Befunde, entschieden hat Claude.

Der Änderungssatz ist **bereit**. Ich habe nichts gefunden, das den Pass, IDs oder Antworten gefährdet (kein Muss, kein Soll). Es gibt nur drei kleine Kann-Punkte. Der Browser-Test `spiel-fokus` ist **nicht gelaufen**. Für den Fall „hoch“ habe ich nur am CSS gerechnet, nicht im Browser gemessen. Nach dieser Rechnung tritt er mit gutem Abstand ein.

## Befunde

**Muss:** keine.
**Soll:** keine.

**Kann**

1. **Fall „hoch“: am CSS gerechnet, nicht gemessen** (`tests/browser/spiel-fokus.mjs:35,40`)
   - **Freier Platz:** Auf dem Handy ist `.kern-kopf` nicht sticky, die Grenze oben liegt also bei 0. Unten ziehe ich die Leiste ab (`--kern-leiste-hoehe` 64 px). Frei sind damit 400 − 64 = 336 px. Davon geht noch der `scroll-margin` 12+12 ab. Der Kasten gilt also als „hoch“, sobald er **über 312 px** misst. Die App (`app/kern/spiel-fokus.ts`, `zurRueckmeldung`) rechnet genauso.
   - **Geschätzte Kastenhöhe für die Kamera (180 Zeichen):**
     - Innenbreite rund 262 px (320 − 2×14 Seitenrand − 2×14 Innenabstand − Rahmen).
     - `.large-reading p` hat 1.15rem und Zeilenhöhe 1.65, also rund 30 px je Zeile. Bei etwa 27 Zeichen je Zeile ergibt das rund 7 Zeilen, also etwa 213 px.
     - Dazu kommen „Richtig!“ (1.3rem, etwa 35 px), der Innenabstand (32 px) und die beiden Knöpfe untereinander (etwa 100 px). Laut `kern.css` stehen sie bei schmalem Handy untereinander.
     - Zusammen sind das rund 380 bis 400 px, also etwa 60 bis 90 px Reserve. Selbst bei nur 5 Zeilen wären es noch etwa 325 px.
   - **Kein Leerlauf:** Der Test läuft nicht ins Leere. Zeile 96 verlangt `!l.passt`. Wird ein Text später so kurz, dass der Kasten passt, wird der Test **rot** und besteht nicht still.
   - **Kein Rückfall auf eine Zufallsrunde:** Die gespeicherte Runde `invention-camera` ist gültig, denn `gueltig` in `world-games.tsx` prüft nur, ob die ID im Vorrat steht, und die Kamera steht dort.
   - **Auch der falsche Schritt geht:** Die Rückmeldung nach falscher Antwort ist etwa 300 px hoch. Ob sie passt oder nicht, `imBild` ist in beiden Lagen erfüllt.
   - **Vorschlag:** Laufen lassen, nachdem du gebaut hast. Optional die gemessenen Werte (`fertig.kasten`, `fertig.frei`) mit in `report.checks` schreiben. Dann sieht man die Reserve auch bei grünem Lauf.
   - **Lücke:** Die Mischung „320×568, große Schrift, Kasten passt“ prüft jetzt kein Gerät mehr. Der passende Fall läuft nur noch bei 360 und 1280 px ohne große Schrift. Das ist vertretbar.

2. **Namensprüfung im Unit-Test erkennt nur das genaue Wort** (`tests/world-game-learning-copy.test.mjs:178`). Groß/Klein, Artikel und Satzzeichen sind sauber gelöst: `normalize` macht alles klein und ersetzt Satzzeichen durch Leerzeichen, der Artikel wird entfernt, und die Leerzeichen am Rand sorgen für ganze Wörter. Deshalb gibt es heute keinen falschen Alarm: „Telefon“ wird in „Smartphone“ nicht gefunden, „Druck“ trifft nicht auf „3D-Druck“.
   - **Was durchrutscht:**
     - Gebeugte Formen wie „Satelliten“, „Kameras“, „Computern“.
     - Zusammensetzungen wie „Raketentriebwerk“, „Handykamera“.
     - Aliase wie „Teleskop“ für das Fernrohr.
   - **Fall:** Schreibt jemand in einen Text „bringt Satelliten ins All“, bleibt der Test grün. In den heutigen 24 Texten kommt so etwas nicht vor, ich habe das einzeln angesehen.
   - **Vorschlag:** Nur vorn auf Wortgrenze prüfen (`' '+name`, ohne Leerzeichen dahinter) und `o.aliases` mitnehmen.

3. **Zahlenprüfung zählt „3D“ als Zahl** (Zeile 175, `/\d+/g`). Beim 3D-Druck ist damit die einzige erlaubte Zahl schon verbraucht. Kommt dort später eine Jahreszahl dazu, gibt es einen falschen Alarm. Heute haben genau vier Texte eine Zahl: 3D-Druck „3“, Flugzeug 1903, Satellit 1957, Eisenbahn 1825. Vorschlag: nur ganze Zahlen zählen, zum Beispiel `/(?<![\p{L}\d])\d+(?![\p{L}])/gu`, oder mit einer Ausnahme für 3D.

## Geprüft und in Ordnung

- **Pass und Antworten:**
  - `q.id`, Antworten (Titel), Fallen (`(index+3)`/`(index+5)`), Reihenfolge und `prompt` sind unverändert. Geändert ist nur das 4. Argument von `question()`, also `why`.
  - `validWorldGameOrder` und `restoreWorldGameOrders` lesen nur `answers`.
  - `gameSessions` (items, orders, roundAnswer) und die Review-Schlüssel `world-game:technology:<id>` speichern kein `why`. `SavedQuestion.why` in `game-state.ts` gehört zu einem anderen Spiel.
  - Die Dateien `tests/fixtures/gespeicherte-antworten*.json` sind nicht angefasst.
- **Alte Runde und Neuladen:** Eine gespeicherte Runde von vor dem Einbau bleibt gültig. Nach dem Neuladen zeigt sie die neue kurze Auflösung, es geht nichts verloren. Auf allen Stufen gilt derselbe Text. Experte spielt hier wie Profi, Profi hat nur eine Antwort mehr.
- **Wo `why` sonst auftaucht:**
  - In `app/world-games.tsx` gibt es nur `feedback=right?current.why:…`, für die Anzeige und für „Erklärung vorlesen“. Beides ist stimmig kurz.
  - Die Fehler-Rückmeldung und der Tipp fürs Technik-Spiel benutzen `why` nicht.
  - „Früher oder heute?“ benutzt `stages[3]`/`[4]` und `comparisonQuestion` und bleibt unverändert.
  - Lernreisen, Missionen und Kreuz und quer greifen nicht darauf zu. `stages[2]` steht weiter auf der Wissenskarte.
  - `exports/content` und `scripts/export-content.mjs` enthalten die Spielfragen nicht, ein neuer Export ist **nicht** nötig.
- **Tests, die den Wortlaut erwarten:** Nur `tests/world-game-learning-copy.test.mjs:103` verlangte `stages[2]`, das wurde sauber umgestellt. Die Browser-Suiten `world-game-learning-copy.mjs` und `learning-tasks.mjs` lesen `q.why` zur Laufzeit und passen von selbst. Dabei wurde keine Prüfung abgeschwächt.
- **Prüfläufe in wt-tech:**
  - `pnpm run typecheck`: grün. Der JSDoc-Typ `Record<string,string>` passt, `??` ist erlaubt.
  - `pnpm test`: 555 von 555 grün, der neue Test ist dabei.
  - ESLint auf die 5 geänderten Dateien: grün.
  - `git diff --check`: sauber.
- **Texte:** Alle 24 Texte stehen wörtlich in der Endfassung `/home/user/wunderkompass/docs/entwurf/2026-11-25-technik-aufloesung-endfassung.md`. Die Kamera ist mit 180 Zeichen tatsächlich der längste Text, damit stimmt der Kommentar im Test.
- **Neuer Unit-Test:** Die Satzteilung (Lookbehind auf `.!?:` mit folgendem Leerzeichen) arbeitet bei den heutigen Texten richtig, auch beim Doppelpunkt im Rakete-Text. Der Hinweis wird genauso gewählt wie im Prompt (`recognitionClue || stages[0]`). Ganze Hinweissätze werden also sicher erkannt, Teilsätze nicht. Die Prüfung, dass jede Erfindung einen Text hat, erzwingt einen Text für jede neue Karte. Der Rückfall per `??` greift also nur im Notfall.
- **Kein Spoiler für „Früher oder heute?“:** Die Kamera ist eine Walkthrough-Karte und kommt dort gar nicht vor. Die Stichproben Telefon, Licht, Auto, Eisenbahn, Flugzeug und Satellit verraten keine Aufgabe.
- **Neuigkeit:** Die ID `technik-kurz` ist eindeutig, `lupe` ist erlaubt, der Eintrag steht oben.
- **Offline:** Es kommen keine neuen Dateien ins Offline-Paket.

## Nicht geprüft

- **`spiel-fokus` im Browser**, in keiner Engine. Vorschlag nach deinem Build in wt-tech:
  ```
  export PATH=/opt/node24/bin:$PATH
  cd /tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/wt-tech
  pnpm run build
  node tests/browser/run.mjs --suite ci --browser all spiel-fokus
  ```
  Ohne Build in wt-tech geht es auch mit einem fertigen Build aus einem anderen Ordner: `QA_DIST=<ordner> node tests/browser/run.mjs --suite ci --browser all spiel-fokus`. Firefox ist wichtig, denn dort war der Leistenfehler.
- Die übrigen Browser-Suiten (`world-game-learning-copy`, `learning-tasks`) und `pnpm run lint` über das ganze Repository.
- Den fachlichen Inhalt und den Ton der 24 Texte habe ich nicht geprüft. Das haben laut Kommentar fakten-pruefer, kinder-redaktion und stufen-pruefer übernommen.
- `CHANGELOG.md` mit der Zeile Messwerte, `STATUS.md` und `BACKLOG.md` fehlen in diesen Commits. Bei einem „Zwischenstand“ ist das erwartbar, vor dem PR muss es nachgeführt werden.
