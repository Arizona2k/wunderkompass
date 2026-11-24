# Code-Prüfung Teil B, PR 2 (Aufgabe 9), 24.11.2026

Helfer: `code-pruefer`. Geprüft: `git diff origin/test-live` auf dem Branch `claude/wunderkompass-weiter-tz194g`. Bericht unverändert; was Claude umsetzt, steht im CHANGELOG-Eintrag des PR.

## Code-Prüfung Teil B, PR 2 (Aufgabe 9)

**1. Ergebnis:** Bereit mit Änderungen. Kein kritischer Fehler gefunden, der Pass-Daten zerstört. Zwei Fehler sollten vor dem PR behoben werden: Bei den Klassik-Spielen gehen über „Neu mischen“ `geschafft` und die vorige Runde verloren, und nach „Neue Aufgabenfolge“ geht der Fokus verloren.

**2. Befunde**

**Fehler (wichtig) 1: „Neu mischen“ bei den Klassik-Spielen löscht `geschafft` und merkt sich die vorige Runde nicht.**
- Stellen: `/home/user/wunderkompass/app/learning-games.tsx:35` (`onNewRound={()=>{onRead("");if(game)onNew(game);setRound(n=>n+1);}}`) und `/home/user/wunderkompass/app/kern/auswahl.ts:49-55`.
- `vorigeRunde` liest nur `items`, `challenge.ids` und `vorige`, aber nicht `learningRound.ids`.
- Fall: Ein Kind schafft „Stimmt das wirklich?“ als Profi, dann steht `gameSessions.detective.geschafft = {profi:'…'}` im Pass. Es tippt oben „Neu mischen“. Dann löscht `clearGame('detective')` den ganzen Stand mitsamt `geschafft`.
- Die neue Runde startet mit `vorige=[]`. Sind alle Fragen schon gesehen und nicht fällig, kann genau dieselbe Runde wiederkommen.
- Das widerspricht Entscheidung 22 („wie die Welt-Spiele“) und Punkt 3 („`geschafft` und Spielstempel bleiben“). `world-games.tsx:45` sichert beides, die Klassik nicht.
- Der Browser-Test, der „Neu mischen“ geklickt hat, ist in `tests/browser/playground.mjs` weggefallen.
- Vorschlag:
  - `vorigeRunde` liest auch `learningRound.ids`.
  - `onNewRound` in `learning-games.tsx` sichert `vorige` und `geschafft` wie in `world-games.tsx`.
  - Ein Test klickt „Neu mischen“ und prüft danach `vorige` und `geschafft`.

**Fehler (klein, Rückschritt) 2: Fokus geht nach „Neue Aufgabenfolge auf dieser Stufe“ verloren.**
- Stelle: `/home/user/wunderkompass/app/classic-reason-game.tsx:30` (`neueRunde`) und der Abschlussknopf in Z. 35.
- Das alte `start()` setzte den Fokus per `requestAnimationFrame` auf `#reason-question`. Das neue `neueRunde` tut es nicht. Der Knopf verschwindet, also landet der Fokus auf `<body>` (Tastatur und Vorlesen).
- Dasselbe gilt für „Andere Aufgaben auf dieser Stufe“ in `/home/user/wunderkompass/app/knowledge-challenge-game.tsx:29/34`; dort war es auch vorher schon so.
- Vorschlag: In beiden Abschlussknöpfen nach `neueRunde(stufe)` den Fokus auf `#reason-question` bzw. `#challenge-question` setzen (rAF) und im Test prüfen.

**Risiko 3: Alte Klassik-Runden verlieren die gespeicherte Antwort, wenn eine Frage umformuliert wurde.**
- Geändert wurden `detective-hard-seasons` und `detective-hard-coral` (anderer Text der richtigen Antwort) sowie `detective-medium-coral` und `detective-medium-water` (andere Antwortliste).
- Per Skript nachgestellt: eine alte, fertige Schwer-Runde mit `detective-hard-seasons` als letzter Frage und der alten richtigen Antwort. `restoreReasonRound` liefert dann `done:false`, `answer:null` und mischt die Reihenfolge neu.
- Folge: Die Spiele-Übersicht zeigt „Runde fortsetzen“ statt „Runde abgeschlossen“, und das Kind muss die letzte Frage noch einmal lösen. Der Stempel bleibt.
- Kreuz und quer hat dafür `restoreAnswerWording` und die Listen in `gespeicherte-antworten*.json`, die Klassik nicht.
- Vorschlag: Eine kleine Zuordnung alter Antworttexte zu den neuen (mindestens die richtigen) in `restoreReasonRound`, dazu ein Unit-Test mit einer alten, fertigen Runde.
- Alternativ bewusst hinnehmen und in der Entscheidungsliste festhalten.

**Hinweis 4: Alte „Schwer“-Runden von Kreuz und quer werden als Experte angezeigt.**
- Stelle: `/home/user/wunderkompass/app/knowledge-challenge.ts:47-48` (`ALTE_STUFE.hard='experte'`).
- Von den alten Schwer-Fragen sind 16 Profi, 4 Experte und 1 Entdecker (2 weitere Profi-Fragen ruhen).
- Bei Pass-Stufe Profi zeigt eine alte Schwer-Runde „Diese Runde spielst du noch als Experte“. Das ist so nicht ehrlich und uneinheitlich zur Klassik, wo Schwer als Profi gilt (Entscheidung 22).
- Vorschlag: `hard` als `profi` anzeigen, dazu einen Unit-Test für `gespielteStufe` alter Runden. Den gibt es noch nicht.

**Hinweis 5: „Spielen“ in der Leiste wirkt nur, wenn man schon im Spielebereich ist.**
- Stelle: `/home/user/wunderkompass/app/earth-explorer.tsx:186`.
- Fall a: Spiel offen, dann „Wissen vertiefen“ oder Leiste „Welten“, dann Leiste „Spielen“. Das Kind landet wieder im offenen Spiel, nicht in der Übersicht. Entscheidung 25 nennt diesen Weg nicht; bitte bewusst entscheiden.
- Fall b: `gamePanel` ist gesetzt, aber kein Container hat ein Spiel offen (Spiel lädt noch per Suspense oder unbekannte Resume-ID). Dann tut `useZurUebersicht` nichts (`offen=false`), und die Übersicht bleibt versteckt.
- Vorschlag: Bei „Spielen“ zusätzlich `gamePanel` in `earth-explorer.tsx` zurücksetzen, wenn kein Container offen meldet. Mindestens Fall a in Punkt 25 festhalten.

**Hinweis 6: Ein Stufen-Vorschlag, der nicht gezeigt wird, verbraucht trotzdem den einzigen Vorschlag der Runde.**
- Stellen: `/home/user/wunderkompass/app/classic-reason-game.tsx` (`zeigeVorschlag`) und `world-games.tsx` (gleiches Muster).
- `merke` ruft `nachVorschlag` schon auf, bevor die Anzeige ihn ausfiltert. Fall: „Wer lebt wo?“ als Profi, drei richtige Antworten. Der Vorschlag „Experte?“ wird unterdrückt, aber die Runde gilt als „gefragt“ und die Folge ist geleert. Ein späteres „leichter“ kann in dieser Runde nicht mehr kommen.
- Außerdem: Ist im Pass Experte gewählt und das Spiel spielt Profi, zählt keine Antwort (`frageStufe≠stufe`). Ein „leichter“-Vorschlag kommt dann nie.
- Vorschlag: Erlaubte Ziele an `useStufenVorschlag` übergeben, bevor die Runde als gefragt gilt.

**Hinweis 7: „Nein, ich bleibe“ setzt den Fokus uneinheitlich.**
- In Klassik und Kreuz und quer geht der Fokus immer auf die Frage, auch nach einer richtigen Antwort.
- Die Welt-Spiele nehmen dann „Nächste Aufgabe“ (`weiter.current??frage.current`). Besser angleichen.

**Risiko 8 (Testrobustheit): Zwei Tests lesen den Pass, bevor die Runde sicher gespeichert ist.**
- Stellen: `/home/user/wunderkompass/tests/browser/connected-discoveries.mjs:81` (`(await pass()).gameSessions['world:knowledge-challenge'].challenge.stufe`) und `/home/user/wunderkompass/tests/browser/discovery-central.mjs:200` (`…challenge.ids`).
- Beide lesen direkt, nachdem `.quiz-answer` sichtbar ist. Die neue Runde schreibt erst der Mount-Effekt von `useSavedGame`, also nach dem Commit. Unter Last kann das einen TypeError geben oder einen falschen Wert liefern.
- Vorschlag: Vorher `waitForFunction`, bis `challenge.ids.length===6` im Pass steht.

**Hinweis 9: Testlücken für die neuen Wege.**
- Kein Browser-Test für „Spielen“ in der Leiste bei offenem Spiel: Fokus auf der Spielkarte, Stand bleibt, „Fortsetzen“ öffnet die Runde wieder.
- Kein Browser-Test für den Stufen-Vorschlag in den Spielen (Ja: neue Runde und Fokus auf „Ändern“; Nein: Fokus).
- Kein Test für eine alte Leicht/Mittel/Schwer-Runde von Kreuz und quer mit Stufenzeile und Hinweistext.
- „Neu mischen“ in der Klassik ist nicht mehr abgedeckt (siehe Befund 1).

**Hinweis 10: Die Entdecker-Runden von „Wer lebt wo?“ sind immer dieselben vier Fragen.**
- „Wer lebt wo?“ hat als Entdecker genau 4 Fragen, also so viele wie `KLASSIK_RUNDE`.
- „Neue Aufgabenfolge auf dieser Stufe“ bringt darum immer dieselben vier Fragen, nur neu gemischt. Der Test prüft „keine Wiederholung“ deshalb nur bei Profi.
- Das ist bekannt (geht in PR 3 auf). Bis dahin ist der Knopftext dort leicht irreführend.

**Hinweis 11: Ein offener Tab mit der alten Version kann eine neue Runde überschreiben.**
- Fall: Ein Tab läuft während des Updates noch mit der alten Version, und dort wird Klassik oder Kreuz und quer geöffnet.
- Die alte Version erkennt `level:null` mit `stufe` bzw. `difficulty:null` nicht, und ihr Mount-Speichern schreibt eine leere Runde in den Pass. Nur die laufende Runde geht verloren, Stempel bleiben. Das passiert nur in der Übergangszeit.

**3. Geprüft und in Ordnung**
- `restoreChallenge` und `restoreReasonRound` mit alten Runden, leerer Runde (`level/difficulty:null` ergibt eine neue Runde), fremdem Spiel, unbekannter Stufe, Frage aus anderer Stufe und kaputter Reihenfolge (wird neu gemischt). Alte Felder `missed`, `firstCorrect`, `repeat` werden ohne Absturz ignoriert. Ruhende Fragen bleiben in alten Runden spielbar.
- Kein neues Pass-Feld: neue Daten nur in `gameSessions` (`vorige`, `geschafft`, `stufe`) und `review` (`classic:<spiel>:<id>`). Die Schlüssel passen zu `key()` (höchstens 160 Zeichen). Import und Export sind unverändert, der Unit-Test für die Sicherung mit `vorige` und `geschafft` ist grün.
- IDs: Alle 24 alten Klassik-IDs sind noch da (6 ruhen). `stable-ids.json` ist nur gewachsen: neue Familie `classic-questions` mit 44 IDs, keine alte ID fehlt. Die Spiel-ID `knowledge-challenge` ist unverändert. Umformulierte Fragen behalten ihre Bedeutung, es gibt keine Wiederverwendung.
- `neueKlassikRunde`: höchstens 3 Experten-Fragen, Gruppe „dampf“ höchstens einmal je Runde, feste Reihenfolge bei `wasser-4`. Bei 2000 Zufallsläufen hatte jede Experte-Runde 4 Fragen.
- `useZurUebersicht` reagiert nicht beim ersten Aufbau und nicht in später geladenen Containern. `stufeWechseln` findet „Ändern“ über `raum` bzw. `.world-game-room` (es gibt nur einen).
- `gameStatus` erkennt Runden mit Stufe. Das neue Vorschaubild kommt über `dist/` in die Offline-Liste.
- `pnpm test` (526/526), `pnpm run typecheck` und `pnpm run lint` sind grün.

**4. Nicht geprüft**
- Keine Browser-Suiten ausgeführt (`test:browser`, `core`, `offline-cold-full`); ihre Änderungen habe ich nur gelesen.
- `ratemuster.test.mjs` nur auf Logik gelesen, die Zahlen nicht nachgerechnet.
- Inhalte von `classic-questions.json` nicht fachlich geprüft. Aufgefallen ist nur, dass `detective-medium-water` (Profi, „Wasserdampf aus der Luft wird flüssig“) in einer Experte-Runde neben `wasser-3` vorkommen kann; das sollte sich der `stufen-pruefer` ansehen.
- Darstellung bei 320 px und `prefers-reduced-motion` habe ich nicht angesehen.
