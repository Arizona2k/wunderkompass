# Ergänzung zu Phase 1: Leicht, knifflig, richtig knifflig

Stand: 23.11.2026. Vom Nutzer freigegeben am 23.11.2026 („Ok“). Ergänzt `2026-11-21-phase-1-ergaenzung-spannung.md` (B1, B2, B7) und gilt ab Teilschritt 3 „Kniffliger spielen“.

## 1. Anlass

- Kinder verschiedenen Alters nutzen die Seite, oft am selben Gerät. Rückmeldung an den Nutzer: Wie stellt man um, wenn es zu leicht oder zu schwer ist? (23.11.2026)
- Der Nutzer will: Es soll auch richtig schwer werden können, damit Kinder mit 10 oder 12 Spaß haben und weitermachen. Kleine sollen trotzdem gut mitkommen.
- Schon vorher meldete ein 10-jähriges Kind: Spiele und Aufgaben sind zu leicht (BACKLOG Phase 1, Punkt 12). Das ist eine einzelne Rückmeldung, keine Studie.

## 2. Was es heute schon gibt

Stufen gibt es schon, aber verstreut und unter vier verschiedenen Namen:

| Ort | Heute | Schwäche |
|---|---|---|
| Quiz im Entdeckerpass | „Quiz-Stufe“: Einfach, Normal, Knifflig (`settings.difficulty`) | im Pass versteckt, gilt nur für das alte Quiz |
| Wissens-Challenge | Leicht, Mittel, Schwer; 42 Zusatzfragen auf 13 Karten (21 mittel, 21 schwer) | nur dort sichtbar |
| Personen-Belege | drei Stufen mit Altersangaben „6–8“, „9–11“, „12–14“ | Alter auf dem Knopf ist für ein großes Kind peinlich, wenn es „6–8“ wählen möchte |
| Freigegeben für Teilschritt 3 (B1) | Entdecker, Profi, Experte | noch nicht gebaut |
| Wissenskarte | eine Hauptfrage, bei 12 Pilot-Karten dazu 2 bis 3 Zusatzfragen | ohne Stufe |

## 3. Vorschlag

### S1. Überall dieselben drei Namen

- **Entdecker:** zum Reinkommen. Drei Antworten, Hinweis jederzeit, kurze Sätze.
- **Profi:** vier Antworten, Fallen, die wirklich ähnlich sind, mehr Fragen pro Runde, Hinweis erst auf Wunsch (wie B1).
- **Experte:** zum Knobeln für Große (siehe S5).
- Auf den Knöpfen stehen **keine Altersangaben**, nur was einen erwartet. Beispiel: „Experte – nachdenken und kombinieren“.
- Unter „Für Erwachsene“ steht eine grobe Orientierung: Entdecker etwa 5 bis 7, Profi etwa 8 bis 10, Experte ab etwa 10 Jahren.
- Die alten Namen verschwinden: „Einfach/Normal/Knifflig“, „Leicht/Mittel/Schwer“ und die Altersknöpfe der Personen-Belege heißen dann auch Entdecker, Profi und Experte.

### S2. Die Wahl dort, wo gespielt wird

- Vor jeder Runde und über „Rate mal!“ steht die Stufe groß und lässt sich mit einem Tipp umstellen.
- Die Seite merkt sich die **letzte Wahl für alle Spiele und Karten zusammen.** Wechselt ein jüngeres Geschwisterkind ans Gerät, reicht ein Tipp.
- Neue Pässe starten auf **Entdecker.**
- „Zu schwer? Zurück zu Entdecker“ ist immer da. Ein Fehler bestraft nie, und es gibt keine Uhr.
- Die „Quiz-Stufe“ im Entdeckerpass wird dieselbe Wahl. Wer dort heute „Knifflig“ eingestellt hat, startet auf Profi.

### S3. Vorschläge statt Automatik

- Nach **drei richtigen Antworten hintereinander** fragt die Seite freundlich: „Das war leicht für dich. Willst du Profi probieren?“ (auf Profi entsprechend: Experte).
- Nach **zwei falschen Antworten hintereinander** auf Profi oder Experte: „Ganz schön knifflig. Willst du eine Stufe leichter spielen?“
- Höchstens ein Vorschlag pro Runde, immer mit „Nein, ich bleibe“.
- Die Seite stellt nie von selbst um. Das Kind entscheidet. So fühlt sich niemand herabgestuft.

### S4. Stufen auch auf der Wissenskarte

- **Entdecker** bekommt zuerst die Hauptfrage wie heute.
- **Profi und Experte** bekommen zuerst eine passende schwerere Frage der Karte, wenn es eine gibt. Sonst kommt die Hauptfrage.
- Dafür bekommt jede Zusatzfrage eine Stufe (Profi oder Experte). Die 42 Challenge-Fragen haben ihre Stufe schon (mittel = Profi, schwer = Experte). Die 30 Fragen der Pilot-Karten werden eingestuft.
- Für den Pass zählt die Karte weiter als gelernt, sobald eine ihrer Fragen richtig ist (wie B7). Alte Einträge bleiben gültig.

### S5. Experte wird wirklich knifflig

Grundsatz: **Schwer durch Denken, nicht durch schwere Wörter, mehr Text oder Zeitdruck.** Eine Experten-Frage soll man nicht lösen können, indem man einen Satz der Karte wiederfindet.

Aufgabenarten für Experte:

1. **Denkfragen:** Zwei Tatsachen verbinden oder übertragen. Beispiel: „Warum hätte ein Eisbär in der Wüste ein Problem?“
2. **Fast richtig:** Bei „Stimmt das?“ ist nur ein kleines Detail falsch. Der Experte sagt, welches.
3. **Reihenfolge:** Vier Schritte oder Ereignisse ordnen, zum Beispiel Mondphasen, Wasserkreislauf, Erfindungen auf dem Zeitstrahl.
4. **Schätzen mit Regler** (B6): Auf Experte zählt nur ein enges „fast genau“.
5. **Knobelfälle** (B6): Hinweise aus drei Karten zusammensetzen.
6. **Labore:** erst eine Vermutung mit Begründung, dann am Modell prüfen; auf Experte mit zwei Dingen, die sich ändern.
7. **„Für Große“ als Futter:** Experten-Fragen dürfen Wissen aus „Für Große“ brauchen. Wer es nicht weiß, kann es dort nachlesen.

Belohnung (Ergänzung zu B2): Profi bringt das goldene Bild in der Sammlung. Experte bringt dazu einen Stern am Bild. Weiterhin keine Punkte, Zähler oder Ranglisten.

### S6. Ein neuer Helfer: `stufen-pruefer`

Vorschlag des Nutzers, Claude empfiehlt ihn.

- **Aufgabe:** prüft, ob jede Stufe zu ihren Kindern passt:
  - Entdecker ist machbar für 5- bis 7-Jährige, auch beim Vorlesen;
  - Profi ist spürbar schwerer;
  - Experte fordert 10- bis 12-Jährige wirklich (Denken statt Wiederfinden);
  - die drei Stufen unterscheiden sich deutlich.
- **Dazu prüft er:**
  - Ratemuster (längste Antwort, Quatsch-Antworten, feste Fallen);
  - ob falsche Antworten auf Profi und Experte ähnlich genug sind;
  - ob Hinweise die Lösung verraten;
  - ob eine Experten-Frage aus einem Satz der Karte ablesbar ist;
  - ob Vorschläge (S3) zur richtigen Zeit kommen.
- **Abgrenzung:**
  - Die `kinder-redaktion` prüft Sprache und Ton.
  - Der `fakten-pruefer` prüft die Richtigkeit.
  - Der `stufen-pruefer` prüft nur die Schwierigkeit.
  - Will die Redaktion etwas einfacher machen und der Stufen-Prüfer schwerer, gilt: Die Sprache bleibt einfach, schwer wird der Gedanke.
- **Wie alle Helfer:**
  - Er meldet nur Befunde und ändert nichts.
  - Modell `opus`, Stufe `high`: Schwierigkeit einzuschätzen ist eine Urteilsfrage.
  - Er kommt in die Helfer-Tabelle in `CLAUDE.md` und als Datei nach `.claude/agents/stufen-pruefer.md`.
- **Ehrlich:** Auch ein guter Helfer ersetzt keine echten Kinder. Ob Experte 12-Jährigen Spaß macht, zeigt erst ihre Rückmeldung über den Nutzer.

### S7. Mehrere Kinder an einem Gerät: vorerst nicht

- Eigene Profile je Kind bräuchten einen neuen Aufbau des Passes (CLAUDE.md: ein Lernspeicher, Schema 3). Das Risiko für den Fortschritt ist hoch, der Nutzen mit S2 klein.
- Darum vorerst nur: Die Stufe ist sichtbar und mit einem Tipp umgestellt.
- Kommt öfter die Rückmeldung, dass Geschwister sich in die Quere kommen, wird das ein eigener Entwurf.

## 4. Wo es hinkommt

| Teilschritt | Was dazukommt |
|---|---|
| 3 „Kniffliger spielen“ | S1 bis S4 für die vorhandenen Spiele, Labore, Reise-Aufgaben und Karten; die 42 Challenge-Fragen und die 30 Pilot-Fragen eingestuft; aus S5 die Arten 1, 2 und 6 mit vorhandenem Inhalt; als neue Art zuerst „Reihenfolge“ (Art 3) als kleine Probe; der `stufen-pruefer` prüft alles davon |
| 5 „Startseite und Sammlung“ | Stern für Experte am goldenen Bild |
| Phase 2 (Tierwelt) | Schätzen und Knobelfälle (S5, Arten 4 und 5, wie B6); neue Experten-Fragen entstehen mit den neuen Tierkarten |
| Phase 3 | Experten-Fragen wachsen Welt für Welt mit |

Der Helfer `stufen-pruefer` ist seit der Freigabe angelegt (`.claude/agents/stufen-pruefer.md`), damit er schon die Pilot-Karten prüfen kann.

## 5. Grenzen

- **Pass:**
  - Die gemeinsame Stufe liegt in `gameSessions`, dem freien Spielspeicher im Pass (wie B1). Es gibt keine neue Schema-Version.
  - `settings.difficulty` bleibt erhalten und gültig, damit alte Pässe und Sicherungen weiter laden.
  - Tests belegen mit Altpass, Import/Export, Neuladen und Fehlerfall, dass nichts verloren geht.
- **IDs:** Fragen-, Spiel-, Labor- und Reise-IDs bleiben. Eine Stufe ist nur ein zusätzliches Feld, neue Fragen bekommen neue IDs.
- **Inhalte:** Jede neue Experten-Frage braucht eine Quelle und geht durch `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer`.
- **Kleine nicht abhängen:** Entdecker bleibt leicht, kein Zeitdruck, keine Wertung.

## 6. Prüfen

- Unit-Tests:
  - die gemeinsame Wahl und der Start auf Entdecker;
  - die Übernahme von „Knifflig“ als Profi;
  - die Vorschläge nach drei richtigen und zwei falschen Antworten;
  - die Reihenfolge der Fragen auf der Karte je Stufe;
  - jede Zusatzfrage hat eine gültige Stufe.
- Browser-Tests: Umstellen mit einem Tipp, die Wahl übersteht Neuladen, Export und Import; Altpass mit `settings.difficulty`.
- Helfer: `stufen-pruefer` für alle eingestuften Fragen, dazu wie immer `kinder-redaktion`, `fakten-pruefer`, `design-pruefer` und `code-pruefer`.
- **Ehrlich:** Ob Kinder dadurch länger bleiben, wissen wir erst aus ihren Rückmeldungen. Wir erfinden keinen Kindertest.

## 7. Entscheidungen des Nutzers

- 23.11.2026: Die Vorschläge (gleiche Namen, Wahl beim Spielen, Vorschläge statt Automatik, Stufen auf der Karte) sind gut und sollen so umgesetzt werden. Wichtig ist, dass es auch richtig schwer werden kann, damit 10- bis 12-Jährige Spaß haben. Einen eigenen Helfer für die Schwierigkeit hat der Nutzer vorgeschlagen.
- 23.11.2026: Der Nutzer hat den Entwurf als Ganzes freigegeben („Ok“), also auch S5 (Experten-Arten), S6 (Helfer `stufen-pruefer`, gleich angelegt) und S7 (vorerst keine Profile je Kind).
