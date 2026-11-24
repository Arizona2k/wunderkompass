# Code-Nachprüfung Teil B, PR 2 (24.11.2026)

Helfer: `code-pruefer` (opus / high). Geprüft: die eingebauten Funde der [Code-Prüfung](2026-11-24-teil-b-pr2-code-pruefung.md) auf Commit `45cef38`/`26d344c`. Nur gelesen, nichts geändert.

**Ergebnis:** Mit Änderungen bereit. Die Funde sind fast alle richtig umgesetzt. Eine Korrektur (Hinweis 6, Teil 2: der Vorschlag misst jetzt an der Stufe der Runde) hat aber einen neuen Fehler gebracht: Der Stufen-Vorschlag kann die Stufe, die das Kind gewählt hat, in die falsche Richtung umstellen.

## Befunde

**Wichtig 1: Ein „schwerer“-Vorschlag kann die gewählte Stufe senken, ein „leichter“-Vorschlag sie heben.**
- **Stellen:**
  - `/home/user/wunderkompass/app/kern/stufe.ts:78` (`nachAntwort`)
  - `/home/user/wunderkompass/app/classic-reason-game.tsx:30`
  - `/home/user/wunderkompass/app/knowledge-challenge-game.tsx:29`
  - `/home/user/wunderkompass/app/world-games.tsx:56`
- **Ursache:** Gemessen wird jetzt an `gespielt`. Der Filter `erlaubt` schließt aber nur `ziel===stufe` aus und prüft die Richtung nicht gegen die gewählte Stufe im Pass.
- **Fall:** Ein Kind spielt Kreuz und quer als Entdecker. Über „Passendes Wissen entdecken“ stellt es auf einer Karte Experte ein. Zurück im Spiel läuft die Runde als Entdecker weiter („Ab der nächsten Runde spielst du Experte“). Nach drei richtigen Antworten steht da: „Willst du Profi probieren?“. Ein Tipp auf „Ja“ ruft `onStufe('profi')` auf, und die Stufe im Pass fällt für alle Bereiche von Experte auf Profi.
- **Nachgestellt mit `nachAntwort` und dem echten Filter je Spiel:**
  - Klassik „Stimmt das wirklich?“: Pass Experte, Runde Entdecker, 3× richtig → „schwerer“ mit Ziel Profi.
  - Kreuz und quer: Pass Entdecker, Runde Experte, 2× falsch → „leichter“ mit Ziel Profi. Das hebt die Stufe.
  - Welt-Spiele: gleiches Muster.
  - Dasselbe passiert mit alten Runden (Leicht/Mittel/Schwer), die auf Test-Live noch im Pass stehen.
- **Vorher:** Fragen außerhalb der Pass-Stufe zählten nicht, darum kam es nicht vor. Es ist also ein Rückschritt aus diesem Commit.
- **Vorschlag:**
  - Ein gemeinsamer Helfer in `stufe.ts`: Ein Vorschlag ist nur erlaubt, wenn das Ziel auf derselben Seite der gespielten und der gewählten Stufe liegt, z. B. `(r(ziel)-r(gespielt))*(r(ziel)-r(stufe))>0`. Das schließt `ziel===stufe` mit ein.
  - Die Spiele nutzen diesen Helfer und behalten nur ihre eigene Bedingung (`klassikSpielStufe` / `weltSpielStufe` / `hatStufen`).
  - Dazu ein Unit-Test mit Pass ≠ Runde in beide Richtungen.
- **Bitte entscheiden:** Pass Entdecker, alte Mittel-Runde (Profi), 3× richtig → „Willst du Experte probieren?“. Das sind zwei Stufen über der gewählten. Nach der Regel oben bliebe das erlaubt; ob es so gewollt ist, gehört in die Entscheidungsliste.

**Klein 2: Testlücken aus Hinweis 9 sind nur zum Teil geschlossen.**
- Es gibt keinen Browser-Test für den Stufen-Vorschlag in einem Spiel: „Ja“ startet eine neue Runde mit Fokus auf „Ändern“, nach „Nein“ liegt der Fokus auf „Nächste Aufgabe“ bzw. der Frage.
- Den Fokus nach „Noch eine Runde“ in Kreuz und quer prüft kein Test. `connected-discoveries.mjs:125` klickt, prüft aber `#challenge-question` nicht.
- Zu alten Runden von Kreuz und quer gibt es nur den Unit-Test für `gespielteStufe`, nicht die Stufenzeile mit ihrem Hinweistext.
- Den Fall „Spiel lädt noch“ (der `else`-Zweig in `spielenOderBereich`) prüft kein Test.
- `tests/stufen-vorschlag.test.mjs` bleibt auch bei Befund 1 grün, weil Pass-Stufe und Rundenstufe dort immer gleich sind.

**Klein 3: Der neue Leisten-Test wartet nicht auf Ruhe.**
- Stelle: `/home/user/wunderkompass/tests/browser/playground.mjs:84` und der Klick auf `bereich(p,'games')` danach.
- Die Bereichswechsel laufen ohne `ladeanfragen`, entgegen der Regel in CLAUDE.md. Der Wechsel nach „Welten“ lädt Programmteile nach, darum kann der Test unter Last wackeln.
- Vorschlag: vor beiden Klicks `await ladeanfragen(p)()`.

## Geprüft und in Ordnung
- **Befund 1 („Neu mischen“):** `vorigeRunde` liest jetzt `learningRound.ids`. `neuMischen` sichert `vorige` und `geschafft` wie `world-games.tsx:45`. `update` arbeitet funktional, darum kommen `clearGame` und die beiden `onSave` in der richtigen Reihenfolge an. Alte Runden mit `items` sind harmlos, unbekannte IDs in `vorige` stören `waehleAufgaben` nicht. Der Browser-Test würde ohne die Korrektur scheitern, weil dann `vorige` = `snapshot.ids` ≠ `alt` wäre.
- **Hinweis 2:** `zurFrage()` per rAF nach „Noch eine Runde“ in beiden Spielen. Der Klassik-Test würde ohne die Korrektur scheitern.
- **Risiko 3 (`ALTE_ANTWORT`):**
  - Abgleich `origin/test-live` mit HEAD: Genau `detective-hard-seasons` und `detective-hard-coral` haben eine geänderte richtige Antwort, beide stehen in der Liste.
  - Die alten Texte kommen in HEAD sonst nirgends vor, eine Verwechslung ist also nicht möglich.
  - `Object.hasOwn` schützt vor geerbten Schlüsseln wie `constructor`.
  - Ungültige Reihenfolgen werden neu gemischt.
  - Der Unit-Test würde ohne die Zuordnung scheitern.
- **Hinweis 4:** `hard→profi` wirkt nur auf die Anzeige. `restoreChallenge` prüft alte Runden über `difficulty` und verliert darum nichts. Der Unit-Test passt.
- **Hinweis 5 / Entscheidung 25:**
  - Die Spielflächen bleiben versteckt eingebunden, darum gilt `gameActivation` auch, wenn man vorher in einem anderen Bereich war.
  - Der Hydrations-Effekt ist durch `hydratedRevision` geschützt. Die Spielflächen hängen am Schlüssel `restoreRevision`, darum stimmt das Zurücksetzen bei Import oder Reset.
  - Im Ladefall bleibt `DeferredContent` aktiv, und ohne `resume` öffnet sich kein Spiel.
  - `zurSpielkarte` ist vor seiner ersten Nutzung definiert, es gibt also kein TDZ-Problem. Die Hook-Reihenfolge ist unbedingt.
  - Der Leisten-Test (direkt und mit Umweg) würde ohne die Korrektur scheitern.
- **Hinweis 6, Teil 1:** Ein unterdrückter Vorschlag verbraucht die Runde nicht. Logik und Unit-Test passen. Die Karte ruft weiter ohne Filter auf.
- **Hinweis 7:** „Nein, ich bleibe“ fokussiert jetzt überall `weiter.current ?? Frage`, mit `flushSync`.
- **Risiko 8:** `waitForFunction` steht in beiden Tests vor dem Lesen des Passes.
- **Hinweis 11:** Als Punkt 33 festgehalten.
- **Speicher:** Keine Pass-, Schema- oder ID-Änderungen.
- **Unit-Tests:** `auswahl`, `stufen-vorschlag`, `challenge` und `playground` laufen grün, 43/43.

## Nicht geprüft
- `pnpm run typecheck` und `pnpm run lint` habe ich nicht laufen lassen, um die laufende Prüfkette nicht zu bremsen.
- Keine Browser-Suiten: Die neuen Browser-Tests habe ich nur gelesen, ihre Ergebnisse nicht gesehen.
- Hinweis 10 (auf PR 3 verschoben), Darstellung bei 320 px und `prefers-reduced-motion`.
