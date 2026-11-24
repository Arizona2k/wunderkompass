# Phase 1, Teilschritt 3 „Kniffliger spielen“ – Entwurf und Bauplan

Stand: 23.11.2026. **Freigegeben am 23.11.2026**: Der Nutzer hat die fünf Entscheidungen in Abschnitt 3 „wie empfohlen“ getroffen. Die Ziele waren schon freigegeben; dieser Text legt fest, wie sie gebaut werden.

> **Für ausführende Agenten:** Pflicht-Skill: superpowers:executing-plans (Claude baut selbst in dieser Sitzung) oder superpowers:subagent-driven-development. Schritte haben Kästchen (`- [ ]`) zum Abhaken. Erst nach Freigabe bauen.

**Grundlage (freigegeben, nicht neu ausdenken):**
- [Ergänzung „Weniger lesen, mehr knobeln“](2026-11-21-phase-1-ergaenzung-spannung.md): B1, B3, B4, B5, B7 Stufe 1, Abschnitte 5 und 6.
- [Ergänzung „Leicht, knifflig, richtig knifflig“](2026-11-23-phase-1-ergaenzung-stufen.md): S1 bis S4, aus S5 die Arten 1, 2 und 6 mit vorhandenem Inhalt, „Reihenfolge“ (Art 3) als kleine Probe.
- [Stufen-Prüfung der Pilot-Karten](2026-11-23-stufen-pruefung-pilotkarten.md): Befunde 1 bis 7, zehn Vorschläge für Experten-Fragen.
- Nutzer, 23.11.2026: „Ganz einfach“ steht auf allen Karten offen, die schweren Absätze kommen unter „Für Große“ (BACKLOG 17).
- Verschobene Kleinigkeiten: BACKLOG Phase 1, Punkte 12, 13, 16, 17, 19, 22, 23 (Fundstellen in Abschnitt 5, Aufgabe 4 und 17).

**Ziel in einem Satz:** Überall dieselben drei Stufen mit einer gemeinsamen Wahl, Spiele ohne Ratemuster und mit mehr Abwechslung, Labore erst ausprobieren, Karten mit Stufen und offenem „Ganz einfach“.

## 1. Was der Bestand zeigt

Gezählt am 23.11.2026 (Bestandsaufnahme durch einen Lese-Helfer, Zahlen zum Raten mit `node -e` nachgezählt).

- **Spiele:** 31 Spiele in drei Familien (`classic:`, `extra:`, `world:`, Liste in `app/playground-catalog.ts`). Ein Stufenfeld haben nur vier. Neun sind ganz fest, ohne jede Auswahl: Foto-Forscher (3 Aufgaben), Schatzsuche (4), Weltreise (7), Vulkan beschriften (4), Ozean-Navigator (5), Tierrekorde (5), Sortiere die Zeit (5), Klima-Detektiv (4), Tierdetektiv der Extra-Spiele (5).
- **Stufen-Speicher:** sieben getrennte Stellen mit drei Namensfamilien: `settings.difficulty` (Einfach/Normal/Knifflig), Challenge, Klassik und Labore (Leicht/Mittel/Schwer), Reisen, Personen-Belege und Tier-Aufgaben (Zahl 0 bis 2, teils mit Alter auf dem Knopf). Eine gemeinsame Wahl gibt es nicht, auf der Karte gibt es gar keine Stufe.
- **Karte:** Zusatzfragen sind fest auf drei Antworten verdrahtet (`app/kern/karte/karten-daten.ts`, `tests/karten-inhalt.test.mjs`). Die 42 Challenge-Fragen der 13 Challenge-Karten erscheinen nur in der Wissens-Challenge.
- **Labore:** Den Stempel gibt es für die richtige Antwort, auch ohne das Modell anzufassen (`app/research-guide.tsx`, `InquiryQuestion`). Die Vermutung ist ein freiwilliges Textfeld.
- **Reisen:** 240 Aufgaben in 80 Kapiteln, je drei Antworten in fester Reihenfolge (`app/journey-inquiry.tsx`). Die richtige Antwort steht gleich oft an Stelle 1, 2 und 3.
- **Wiederholen:** Spiele und Challenge schreiben Einträge in `review` (`world-game:…`, `challenge:…`), aber kein Spiel liest sie. Nur Karte, Wissensbuch und das alte Quiz lesen `review`.
- **Länder:** 12 Länder, doppelt gepflegt (`advanced-games.tsx`, `memory-pairs.ts`), 12 Flaggenbilder in `public/flags/`. `app/country-metadata.json` hat Hauptstädte für etwa 240 Gebiete, ungeprüft und in gemischten Sprachen („Moskau“ neben „Havana“).

**Ratemuster „richtige Antwort ist die längste“** (gezählt; bei Zufall wäre es bei drei Antworten etwa ein Drittel):

| Gruppe | Anzahl | richtig = einzige längste | richtig = einzige kürzeste |
|---|---|---|---|
| Hauptfragen der Karten | 204 | 68 (33 %) | 66 (32 %) |
| Reise-Aufgaben | 240 | 103 (43 %) | 77 (32 %) |
| Challenge-Fragen | 42 | 25 (60 %) | 9 (21 %) |
| davon „schwer“ | 21 | 15 (71 %) | 3 (14 %) |
| Zusatzfragen der Pilot-Karten | 30 | **0** | 13 (43 %) |

Die Hauptfragen sind unauffällig. Bei Challenge und Zusatzfragen fällt das Muster auf (einmal fast immer die längste, einmal nie). Die Reise-Aufgaben liegen etwas darüber.

## 2. Entwurf: wie es gebaut wird

### E1. Eine gemeinsame Stufe im Pass

- Werte: `entdecker`, `profi`, `experte`.
- Ort: `gameSessions['kern:stufe'] = {stufe, seit: 'JJJJ-MM-TT'}`. Das ist der vorhandene freie Spielspeicher. Der Schlüssel `kern:` ist frei: Spiele heißen `classic:`, `extra:`, `world:`, Labore `lab:`, Karten `topic:`. Es gibt keine neue Schema-Version.
- Fehlt der Eintrag (alle heutigen Pässe), gilt `settings.difficulty`: `tricky` startet auf Profi, alles andere auf Entdecker. Neue Pässe starten also auf Entdecker (S2).
- `settings.difficulty` bleibt im Pass, wird gelesen, aber nie mehr geschrieben. Alte Sicherungen und alte App-Stände laden weiter.
- Die Stufenfelder der einzelnen Spiele (`researchLevel`, `chapter:<n>:level`, `peopleEvidenceLevel`, `animalInquiryLevel`, Klassik- und Challenge-Runden) bleiben im Pass. Sie wählen aber nicht mehr die Stufe. Gelöscht wird nichts.
- Eine angefangene Runde läuft mit ihrer alten Stufe und ihren Antworten zu Ende (Ergänzung Spannung, Abschnitt 5).
- Schreiben ändert `lastActivity` nicht. Sonst würde „Weiter entdecken“ auf die Stufenwahl zeigen.
- Die reine Logik liegt in `app/kern/stufe.ts` (ohne React, im Node-Test prüfbar): lesen, Übernahme aus `settings.difficulty`, Abbildung alter Werte (`easy`/`medium`/`hard` und 0/1/2), Vorschläge (E8).
- Bekannte Grenze: Beim Laden behält der Pass höchstens 2000 Spielstände (`progress-storage.ts`, Zeile 53). Ein neuer Eintrag steht hinten. Ein Test mit 2000 Einträgen zeigt, ob die Stufe dann verloren geht; wenn ja, wird `kern:stufe` beim Kürzen bevorzugt.

### E2. Die Wahl dort, wo gespielt wird

- Ein Baustein `StufenWahl`: eine Zeile „Stufe: Profi“ mit dem Knopf „Ändern“. Ein Tipp öffnet drei große Knöpfe mit kurzer Beschreibung, ohne Alter:
  - „Entdecker – zum Reinkommen“
  - „Profi – vier Antworten, kniffligere Fallen“
  - „Experte – nachdenken und kombinieren“
- Die Zeile steht über „Rate mal!“, vor jeder Spielrunde, in den Laboren und über den Reise-Aufgaben. Im Entdeckerpass ersetzt sie die „Quiz-Stufe“.
- Die grobe Orientierung nach Alter (Entdecker etwa 5 bis 7, Profi etwa 8 bis 10, Experte ab etwa 10) steht nur unter „Für Erwachsene“ auf der Pass-Seite.
- Bei Profi und Experte steht immer „Zu schwer? Zurück zu Entdecker“ dabei. Keine Uhr, keine Strafe.

### E3. Experte nur, wo es echte Experten-Aufgaben gibt

- Grundsatz S5: Schwer wird der Gedanke, nicht die Wörter. Viele Spiele haben dafür heute keinen Inhalt.
- Hat ein Spiel keine Experten-Aufgaben, spielt ein Experte dort Profi. Ein Satz sagt es: „Experte gibt es hier noch nicht. Du spielst Profi.“
- Wir bauen keine unechte Experten-Stufe, die nur mehr Fragen oder längere Wörter hat. (Entscheidung D3)

### E4. Was die Stufen je Bereich bedeuten

| Bereich | Entdecker | Profi | Experte in Teilschritt 3 |
|---|---|---|---|
| Wissenskarte | Hauptfrage, dann Entdecker-Zusatzfragen | zuerst eine ungesehene Profi-Frage; vier Antworten; Hinweis auf Wunsch | zuerst eine Experten-Frage (Denkfrage, „Fast richtig“, Reihenfolge), sonst Profi |
| Welt-Spiele aus dem Katalog (Tierdetektiv, Tier & Lebensraum, Wer frisst was?, Wer war das?, Technik, Früher & heute) | 3 Antworten, 5 Aufgaben | 4 Antworten, Fallen aus derselben Gruppe (Tierfamilie, Lebensraum, Zeit, Welt), 8 Aufgaben | wie Profi (E3) |
| Wissens-Challenge (neuer Name) | Hauptfragen der Karten | die als Profi eingestuften Challenge-Fragen | nur die vom `stufen-pruefer` als echt bestätigten |
| Länder-Spiele | 3 Antworten, bekannte Länder | 4 Antworten, Länder vom selben Kontinent | wie Profi (E3) |
| Reihenfolge-Spiele („Ordne richtig“, „Sortiere die Zeit“) | 3 Teile | 4 Teile | 4 Teile, die nah beieinander liegen (Probe für S5 Art 3) |
| Labore | heutige leichte Frage | heutige mittlere Frage | Vermutung mit Begründung, dann am Modell prüfen (S5 Art 6), als Probe in zwei Laboren |
| Reise-Aufgaben | „Entdecken“ | „Erklären“ | „Übertragen“, wenn der `stufen-pruefer` sie als Experte bestätigt, sonst Profi |
| Personen-Belege, Tier-Aufgaben | Stufe 0 | Stufe 1 | Stufe 2 (gleiche Prüfung) |

### E5. Vier Antworten auf Profi

- Wo die Antworten erzeugt werden (Welt-Spiele, Länder), zieht das Spiel auf Profi drei statt zwei falsche Antworten, und zwar ähnliche.
- Auf der Karte bekommen Profi- und Experten-Fragen eine vierte Antwort als geprüften Inhalt (`fakten-pruefer`, `kinder-redaktion`, `stufen-pruefer`). Die Regel „genau drei Antworten“ in `kartenFeldFehler` und im Inhaltstest wird zu: Entdecker 3, Profi und Experte 4.
- Hauptfragen bleiben bei drei Antworten und wörtlich gleich (gespeicherte Antworten).
- Reisen und Labore behalten vorerst drei Antworten. Dort ist jede Stufe schon eine eigene, schwerere Frage; über 300 neue Antworten wären viel Inhalt auf einmal. Sie kommen mit den Reisen und Laboren in späteren Phasen. (Entscheidung D2)

### E6. Stufen für Zusatzfragen

- Neues Feld `level` an jeder Zusatzfrage: `entdecker`, `profi` oder `experte`. Die Challenge-Fragen behalten `difficulty` und werden auf dieselben Werte abgebildet (nach der Einstufung durch den `stufen-pruefer`, nicht blind „mittel = Profi, schwer = Experte“).
- Der freigegebene Entwurf sagt „Profi oder Experte“. Der `stufen-pruefer` empfiehlt, auch Entdecker zu erlauben: Fast die Hälfte der Pilot-Fragen ist Entdecker-Niveau, und sonst bekämen Kleine beim nächsten Besuch nie eine neue Frage (B7). (Entscheidung D1)
- Neue Fragen bekommen neue IDs nach dem Muster `<kartenId>:rate-<n>` und kommen in `tests/fixtures/stable-ids.json`. Die Challenge-Fragen behalten ihre IDs (`<kartenId>-<n>`).

### E7. Abwechslung: nie dieselbe Runde, Wiederholen mit Abstand

- Ein gemeinsamer Helfer `waehleAufgaben({vorrat, review, vorige, anzahl, zufall})` in `app/kern/auswahl.ts` (rein, im Node-Test prüfbar). Reihenfolge:
  1. falsch beantwortet und fällig,
  2. noch nie gesehen,
  3. fällig,
  4. der Rest.
- Ist der Vorrat größer als eine Runde, ist die neue Runde nie dieselbe Auswahl wie die vorige. Die Reihenfolge ist zufällig.
- Der Helfer liest die vorhandenen `review`-Einträge (`world-game:…`, `challenge:…`). Neue Speicherorte braucht er nicht; die vorige Runde steht schon im Spielstand.
- Alle Rundenspiele nutzen ihn: Welt-Spiele, Challenge, Länder-Spiele, Klassik und Quiz. Die Karte behält `ersteFrage` und bekommt die Stufe dazu (E4).
- Ehrlich: „Wiederholen in anderer Form“ (eine alte Frage kommt als „Stimmt das?“ wieder) kommt nicht in Teilschritt 3. Dafür fehlen passende Behauptungen für die meisten Fragen.

### E8. Vorschläge statt Automatik (S3)

- Reine Funktion `stufenVorschlag(folge, stufe)`: nach drei richtigen Antworten hintereinander „Das war leicht für dich. Willst du Profi probieren?“ (auf Profi entsprechend Experte), nach zwei falschen auf Profi oder Experte „Ganz schön knifflig. Willst du eine Stufe leichter spielen?“.
- Die Folge der letzten Antworten zählt nur, solange die Seite offen ist. Sie kommt nicht in den Pass.
- Höchstens ein Vorschlag je Runde und je Karte, immer mit „Nein, ich bleibe“. Die Seite stellt nie selbst um.
- Gezählt wird nur die erste Antwort auf eine Frage.

### E9. Ratemuster abstellen (B4)

- Reise-Aufgaben mischen ihre Antworten einmal je Kapitel. Die Reihenfolge wird im Spielstand gemerkt, damit sie nach Neuladen gleich bleibt (wie auf der Karte).
- Ein Test je Gruppe (Zusatzfragen, Challenge-Fragen, Reise-Aufgaben, Labor-Fragen, Klassik-Fragen): Die richtige Antwort ist höchstens in 45 % der Fragen die einzige längste und höchstens in 45 % die einzige kürzeste. Für die Zusatzfragen gilt zusätzlich mindestens 15 %, damit „die längste ist nie richtig“ verschwindet. Heute würden die Challenge-Fragen (60 %) und die Zusatzfragen (0 %) scheitern. Sie werden mit der Einstufung neu gefasst.
- Feste Fallen verschwinden: Die Tier-Spiele ziehen ihre falschen Antworten je Runde aus ähnlichen Tieren statt immer aus „Korallenriff“ und „Meereis der Antarktis“. Die Tests, die das alte Verhalten festhalten (`world-game-habitat-semantics`, `world-game-learning-copy`), werden in einem Durchgang mit angepasst.
- Quatsch-Antworten und übertreibende Wörter („nur“, „immer“, „allein“) prüft der `stufen-pruefer`. Dafür gibt es keinen sinnvollen festen Test.

### E10. Labore: erst ausprobieren, dann der Stempel (B5)

- Ablauf: 1. Vermuten (drei Vermutungen zur Auswahl; das freie Feld bleibt freiwillig) → 2. Am Modell ausprobieren → 3. Die Frage → Stempel.
- Die Frage ist erst aktiv, wenn das Modell einmal verändert wurde. Das merkt sich der Labor-Spielstand (`gameSessions['lab:<id>'].ausprobiert`).
- Alte Stempel bleiben, wer schon einen hat, muss nichts wiederholen.
- Experte (S5 Art 6) zuerst als Probe in zwei Laboren mit zwei Reglern: Das Kind wählt eine Vermutung mit Begründung („… weil …“) und prüft sie am Modell. Welche zwei Labore, entscheidet die Prüfung der Modelle in Aufgabe 14.

### E11. Experten-Aufgaben aus vorhandenem Inhalt (S5)

- **Denkfragen (Art 1):** die zehn Vorschläge des `stufen-pruefer` für die Pilot-Karten, nach Prüfung durch `fakten-pruefer` und `kinder-redaktion`. Dazu die Befunde 2 bis 7 seines Berichts (Hinweise, die die Lösung verraten, doppelte Fragen, zu offensichtliche Fallen).
- **Fast richtig (Art 2):** bei „Stimmt das?“: Nach „Stimmt nicht“ wählt ein Experte, welches Wort falsch ist. Zuerst bei `person-marie_curie:stimmt-1` („erfunden“) und `building-giza-pyramids:stimmt-1`.
- **Reihenfolge (Art 3, Probe):** ein Baustein „Ordne richtig“ auf Grundlage der vorhandenen Reise-Reihenfolge (`Sequence` in 10 Kapiteln). Zuerst auf der Karte Steinwerkzeuge (Vorschlag des Prüfers) und in „Ordne richtig“ (`classic:order`) mit Rätseln aus Karten (Mondphasen, Wasserkreislauf, Erfindungen).
- **Labore (Art 6):** siehe E10.
- **Hinweise auf Experte:** nur auf Wunsch, in zwei Schritten; der erste verrät nie die Lösung. Ein Test prüft, dass kein Hinweis die richtige Antwort wörtlich enthält. (Entscheidung D5)

### E12. „Ganz einfach“ offen auf allen Karten

- Karten ohne Häppchen zeigen unter „Kurz erklärt“ den Satz aus `learning.starter` offen, ohne Altersangabe. Die Absätze kommen zugeklappt unter „Für Große“, wie bei den Pilot-Karten und den Reisen.
- Bei 24 Tierkarten steht derselbe Satz wörtlich in der Einleitung (BACKLOG 17). Er wird dort gestrichen oder umformuliert; eine Inhaltsregel „Ganz einfach steht nicht in der Einleitung“ hält das fest.
- Die 21 Wissenschaftskarten ohne „Schon gewusst?“ (am 23.11.2026 gestrichen, weil wörtlich gleich mit „Ganz einfach“) bekommen ihren neuen Satz erst mit der Wissenschaftswelt in Phase 3.

### E13. Belohnung schon jetzt merken

- Die goldenen Bilder und Sterne kommen in Teilschritt 5. Damit nichts verloren geht, was Kinder vorher schaffen, merkt sich jedes Spiel ab Teilschritt 3 die höchste geschaffte Stufe: `gameSessions[<spiel>].geschafft = {profi?: Datum, experte?: Datum}`.
- Sichtbar ist davon in Teilschritt 3 nichts.
- Die Zähler „… davon beim ersten Versuch“ und „{turns} Versuche“ verschwinden aus den klassischen Spielen (BACKLOG 12).

### E14. Kleine feste Spiele: zusammenlegen statt aufblähen (B3)

Kein Bestandsschutz: Wo es sinnvoll ist, geht ein kleines Spiel in einem größeren auf. Seine ID und seine Links bleiben und führen dorthin; ein gesammelter Spielstempel bleibt im Pass. (Entscheidung D4)

| Spiel heute | Vorschlag |
|---|---|
| Tierdetektiv (`extra:animal-detective`, 5 feste Fragen) | geht im Welt-Tierdetektiv (`world:animal-detective`, 48 Tiere) auf |
| „Wer lebt wo?“ (`classic:habitats`, 12 Fragen) | geht in „Tier & Lebensraum“ (`world:habitats`, 48 Tiere) auf; seine Warum-Fragen werden dort Profi-Aufgaben |
| Lebensraum-Sortierer (`extra:habitat-sort`, 7 feste Tiere) | bleibt, zieht aber je Runde 7 aus den 48 Tierkarten |
| Vulkan beschriften (`extra:volcano-label`, 4 Begriffe) | wird der erste Schritt im Vulkan-Labor (`lab:volcano`) |
| Schatzsuche (`extra:treasure`, 4) und Tierrekorde (`world:records`, 5) | ein Spiel „Rekorde“ mit Natur- und Tierrekorden, 12 bis 15 geprüfte Aufgaben |
| Klima-Detektiv (`extra:climate-detective`, 4) und Wetter zuordnen (`extra:weather-match`, 5) | ein Spiel „Wetter und Klima“ mit 12 bis 15 geprüften Aufgaben |
| Foto-Forscher (`extra:photos`, 3) | zieht seine Fotos aus den Kartenfotos (mit Nachweis): „Was zeigt das Foto?“, auf Profi mit ähnlichen Karten derselben Welt |
| „Stimmt das wirklich?“ (`classic:detective`, 12) | zieht zusätzlich aus allen „Stimmt das?“-Behauptungen der Karten; wächst mit dem Ausrollen in Phase 2 und 3 |
| Ozean-Navigator (`extra:ocean-find`, 5) | zufällige Reihenfolge; Profi mit bekannten Meeren aus `app/marine.json` nach Prüfung |
| Sortiere die Zeit (`world:chronology`, 5) | 15 geprüfte Jahreszahlen, je Runde 5; das Wort „Zeitanker“ fällt weg (BACKLOG 22) |
| Weltreise, Entdeckungsreise, Nachbarn, Kontinente | bleiben; Antworten werden gemischt |

### E15. Länder-Spiele: mehr Länder, geprüft

- Flaggen, Hauptstädte, Umrisse und die beiden Memorys nutzen eine gemeinsame, geprüfte Länderliste statt zwei Kopien mit 12 Ländern.
- Zuerst etwa 50 Länder: alle Länder Europas und die bekanntesten der übrigen Kontinente. Jedes mit deutscher Schreibweise, geprüfter Hauptstadt und Flaggenbild mit Nachweis (Flaggen sind meist gemeinfrei; `bild-recherche` prüft das). Die übrigen Länder folgen mit Phase 4 (Globus und Länder). (Teil von Entscheidung D4)
- Profi zieht die falschen Antworten vom selben Kontinent.

### E16. Gemeinsame Wörter

Aus BACKLOG 13, 17 und 22, einheitlich in der ganzen App (Karte, Spiele, Labore, Reisen):
- Rückmeldung: „Richtig!“ und „Noch nicht ganz. Versuch es noch einmal!“
- Ein Wort für Hinweise: „Tipp“ (`app/question-hints.tsx`).
- Ein deutscher Name statt „Wissens-Challenge“; Vorschlag der `kinder-redaktion` einholen.
- „Zeitanker“ und „Modellgrenzen“ kindgerecht; Fragegrammatik der 11 Erfindungskarten („Welches Problem hilft das Auto zu lösen?“).
- „Noch einmal raten“: Nach dem zweiten Versuch wird keine neue Wiederholung eingetragen (BACKLOG 19). Es zählt die erste Antwort; eine richtige zweite Antwort nimmt die Karte aber aus „Ein Gedanke zum Wiederholen“ (BACKLOG 23, K7).

## 3. Was der Nutzer entschieden hat

Entschieden am 23.11.2026: bei allen fünf Punkten das Erste, wie von Claude empfohlen (Nutzer: „wie empfohlen“). Die Alternative steht jeweils nur noch zum Nachlesen dabei.

- **D1 Zusatzfragen auch auf Entdecker:** Ja (Empfehlung des `stufen-pruefer`), sonst bekommen Kleine auf der Karte nie eine neue Frage. Oder nur Profi und Experte, wie im freigegebenen Entwurf.
- **D2 Vier Antworten zuerst in Spielen und auf der Karte:** Reisen und Labore behalten vorerst drei, weil dort jede Stufe schon eine eigene Frage ist. Oder gleich überall vier (über 300 neue, geprüfte Antworten in Teilschritt 3).
- **D3 Experte nur mit echten Experten-Aufgaben:** Wo es keine gibt, spielt ein Experte Profi und erfährt das. Oder überall eine Experten-Stufe, dann oft nur „mehr vom Gleichen“.
- **D4 Kleine Spiele zusammenlegen und Länder in zwei Schritten (E14, E15):** wie in der Tabelle; zuerst etwa 50 Länder. Oder jedes kleine Spiel einzeln auf 10 bis 15 Aufgaben bringen und gleich alle Länder (viel neuer Inhalt, länger bis zur Vorschau).
- **D5 Hinweise auf Experte:** ja, nur auf Wunsch und nie mit der Lösung. Oder auf Experte keine Hinweise.

## 4. Feste Vorgaben (gelten für jede Aufgabe)

- **Pass:** Schema 3, App-ID `earth-explorer`, Schlüssel `erde-entdecken:save:v3`, Altpass `erde-entdecken:forscherpass:v2`, IndexedDB `earth-explorer`. Neues nur in `gameSessions` und `review`. Jede Änderung am Pass belegt mit Altpass, Import/Export, Neuladen und Fehlerfall, dass nichts verloren geht.
- **IDs:** Spiel-, Fragen-, Labor-, Missions- und Reise-IDs bleiben. Geht ein Spiel in einem anderen auf, führt sein alter Link dorthin, und sein Stempel bleibt. Neue Fragen bekommen neue IDs.
- **Gespeicherte Antworten:** Hauptfragen bleiben wörtlich. Werden Antworten von Challenge- oder Zusatzfragen umformuliert, läuft eine angefangene Runde weiter (`RETAINED_ANSWER_WORDING` oder eine Liste alter Wörter, mit Test). Vorher gilt die Pflicht aus BACKLOG 23: Fixture mit allen gespeicherten Antworten und Test „gleich oder Alias vorhanden“.
- **Sammeln ohne Zahlen:** keine Punkte, Zähler oder Ranglisten. „Frage 3 von 6“ bleibt als Orientierung.
- **Kleine nicht abhängen:** Entdecker bleibt leicht, keine Uhr, keine Strafe, „Zurück zu Entdecker“ ist immer da.
- **Inhalte:** Jede neue Frage, Antwort, Behauptung und Auflösung prüfen `fakten-pruefer` (mit Quelle), `kinder-redaktion` (Sprache) und `stufen-pruefer` (Schwierigkeit). Will die Redaktion einfacher und der Stufen-Prüfer schwerer: Die Sprache bleibt einfach, schwer wird der Gedanke.
- **Tests zuerst suchen:** Ändert sich, welche Frage oder welche Antworten ein Spiel zeigt, zuerst alle betroffenen Tests suchen, in einem Durchgang anpassen und die großen Suiten gleich laufen lassen (CLAUDE.md, Arbeitsablauf 4). Die Karte nur über `tests/browser/karte-hilfen.mjs` prüfen (Wächter in `tests/browser-suites.test.mjs`).
- **„Was ist neu?“:** Jede sichtbare Änderung bekommt einen kurzen Eintrag (`app/kern/neuigkeiten.ts`).

## 5. Bauplan

Geliefert in drei Teilen mit je einem PR nach `test-live`. Gründe: kleinere PRs, der Nutzer sieht früher etwas, und Teil A legt den Grundstein, den B und C brauchen.

| Teil | Aufgaben | Inhalt |
|---|---|---|
| A „Eine Stufe für alles“ | 1–6 | gemeinsame Stufe, Wahl, Vorschläge, Wörter, Karte mit Stufen, „Ganz einfach“ offen |
| B „Spiele kniffliger“ | 7–12 | Auswahl-Helfer, Welt-Spiele, Challenge und Klassik, kleine Spiele, Länder, Reihenfolge |
| C „Labore und Reisen“ | 13–17 | Labore, Reisen, Personen und Tiere, Abschluss |

### Teil A „Eine Stufe für alles“

#### Aufgabe 1: Stufen-Kern im Pass (E1)

- [ ] Test zuerst (`tests/stufe.test.mjs`): neuer Pass → Entdecker; `settings.difficulty: 'tricky'` ohne Eintrag → Profi; `easy`/`normal` → Entdecker; gesetzte Stufe gewinnt; ungültiger Wert → Entdecker; alte Werte `easy`/`medium`/`hard` und 0/1/2 bilden richtig ab.
- [ ] `app/kern/stufe.ts` schreiben, bis die Tests grün sind.
- [ ] Schreiben über eine eigene Funktion in `use-local-progress.ts`, die `lastActivity` nicht ändert.
- [ ] Pass-Belege (`tests/pass-spielstaende.test.mjs` erweitern): Export/Import, Altpass v2, Neuladen, zweiter Tab, Fehlerfall (kaputter Eintrag → Entdecker, übriger Pass bleibt), Pass mit 2000 Spielständen.
- [ ] Browser-Suite `pass-spielstaende`: Stufe übersteht Neuladen, Sicherung und Einlesen; Altpass mit `difficulty: 'tricky'` startet auf Profi.

#### Aufgabe 2: Baustein `StufenWahl` und Pass-Seite (E2)

- [ ] Baustein in `app/kern/stufen-wahl.tsx` mit Tests für Tastatur, Fokus und Tippflächen ab 48 px.
- [ ] Entdeckerpass: „Quiz-Stufe“ durch `StufenWahl` ersetzen; Altersorientierung unter „Für Erwachsene“.
- [ ] Browser-Test: Umstellen mit einem Tipp; „Zurück zu Entdecker“ sichtbar auf Profi und Experte.

#### Aufgabe 3: Vorschläge (E8)

- [ ] Test zuerst: drei richtige → Vorschlag hoch; zwei falsche auf Profi → Vorschlag runter; höchstens einer je Runde; nur erste Antworten zählen; „Nein, ich bleibe“ stellt nichts um.
- [ ] Umsetzen als kleiner Hinweis unter der Rückmeldung, nicht als Fenster.

#### Aufgabe 4: Gemeinsame Wörter (E16)

- [ ] Vorschläge der `kinder-redaktion` für den neuen Challenge-Namen, „Zeitanker“, „Modellgrenzen“ einholen.
- [ ] Rückmeldesätze und „Tipp“ in Karte, Spielen, Laboren und Reisen; Fragegrammatik der 11 Erfindungskarten (Antworten bleiben wörtlich).
- [ ] „Noch einmal raten“ und Wiederholung (BACKLOG 19 und 23, K7) mit Unit-Test und Anpassung von `learning-tasks`.
- [ ] Alle Tests mit den alten Sätzen vorher suchen (`grep` nach „Passende Antwort gewählt“, „Überlege noch einmal“, „Denkhinweis“) und in einem Durchgang anpassen.

#### Aufgabe 5: Karte mit Stufen (E4, E5, E6, E11)

- [ ] Daten: Feld `level` an Zusatzfragen; Challenge-Fragen als weitere Fragen der Karte (`kartenFragen`), mit ihren IDs und Hinweisen aus `app/challenge-hints.json`. Review-ID auf der Karte `world-question:<id>`, in der Challenge weiter `challenge:<id>`.
- [ ] `ersteFrage` je Stufe (Test zuerst): Entdecker → Hauptfrage, dann Entdecker-Fragen; Profi → ungesehene Profi-Frage, sonst Hauptfrage; Experte → Experten-Frage, sonst wie Profi. Falsch beantwortete Fragen kommen weiter zuerst. „Noch eine Frage“ bleibt bei der gewählten Stufe und darunter.
- [ ] `kartenFeldFehler` und Inhaltstest: Entdecker 3 Antworten, Profi und Experte 4; jede Zusatzfrage hat eine gültige Stufe; kein Hinweis enthält die richtige Antwort wörtlich; Ratemuster-Grenzen (E9).
- [ ] Inhalt: `stufen-pruefer` stuft alle 30 Pilot-Fragen und 42 Challenge-Fragen ein; vierte Antworten, Befunde 2 bis 7, die zehn Experten-Vorschläge, „Fast richtig“ für zwei Behauptungen, „Ordne richtig“ auf der Karte Steinwerkzeuge. Danach `fakten-pruefer` und `kinder-redaktion`, dann noch einmal `stufen-pruefer`.
- [ ] Fixture der gespeicherten Antworten anlegen (BACKLOG 23), bevor eine Challenge-Antwort umformuliert wird.
- [ ] Browser-Tests über `karte-hilfen.mjs`: Karte auf jeder Stufe, Wechsel der Stufe auf der offenen Karte, Neuladen, Stufe Experte ohne Experten-Frage.

#### Aufgabe 6: „Ganz einfach“ offen und Teil A abschließen (E12)

- [ ] Karten ohne Häppchen: `learning.starter` offen, Absätze unter „Für Große“. Test `ganzEinfach` in `karte-hilfen.mjs` anpassen (nicht mehr aufklappen).
- [ ] 24 Tierkarten: Satz aus der Einleitung streichen oder umformulieren (`kinder-redaktion`); Inhaltsregel dazu.
- [ ] „Was ist neu?“-Eintrag, `pnpm run check`, betroffene große Suiten (`core`, `animals`, `home`), Helfer: `code-pruefer`, `design-pruefer` (fünf Breiten), `stufen-pruefer`, `kinder-redaktion`.
- [ ] Vorschau-Link und Bilder, PR nach `test-live`.

### Teil B „Spiele kniffliger“

#### Aufgabe 7: Auswahl-Helfer (E7)

- [ ] Zuerst der Linkwächter (BACKLOG, „Technik und Prüfung“; Frage des Nutzers vom 23.11.2026): ein Unit-Test, der jedes Verweisziel der App auf Existenz prüft, bevor E14 alte Spiel-Links umzieht.
- [ ] Test zuerst (`tests/auswahl.test.mjs`): Reihenfolge falsch-fällig → ungesehen → fällig → Rest; nie dieselbe Auswahl wie die vorige Runde, wenn der Vorrat größer ist; fester Zufall im Test.
- [ ] Challenge nutzt ihn statt der eigenen Regel (`tests/challenge.test.mjs` anpassen).

#### Aufgabe 8: Welt-Spiele (E4, E5, E9)

- [ ] Profi: vier Antworten mit Fallen aus derselben Gruppe, 8 Aufgaben, Hinweis auf Wunsch; Entdecker wie heute.
- [ ] Tier-Spiele ziehen Fallen je Runde statt fester Sätze; Tests `world-game-habitat-semantics`, `world-game-learning-copy`, `animal-game-saves` in einem Durchgang anpassen.
- [ ] Angefangene Runden mit drei Antworten laufen weiter (Test mit gespeicherter alter Runde).
- [ ] Höchste geschaffte Stufe merken (E13).

#### Aufgabe 9: Challenge, Klassik und Quiz auf die gemeinsame Stufe

- [ ] Wissens-Challenge: neuer Name, Stufen nach Einstufung; „Andere Stufe auswählen“ wird `StufenWahl`.
- [ ] Klassik und Quiz lesen die gemeinsame Stufe; Zähler „… davon beim ersten Versuch“ und „{turns} Versuche“ entfernen.
- [ ] „Spielen“ in der Leiste bei offenem Spiel klären (BACKLOG 16).

#### Aufgabe 10: Kleine Spiele zusammenlegen und erweitern (E14)

- [ ] Je Spiel aus der Tabelle: alter Link → neues Ziel, Stempel bleibt (Test für jeden alten Link und jeden alten Stempel).
- [ ] Neue Aufgaben („Rekorde“, „Wetter und Klima“, 15 Jahreszahlen) mit Quelle; `fakten-pruefer`, `kinder-redaktion`, `stufen-pruefer`.
- [ ] Foto-Forscher aus den Kartenfotos, mit Bildnachweis je Foto.

#### Aufgabe 11: Länder-Spiele (E15)

- [ ] Gemeinsame Länderliste mit etwa 50 Ländern; `fakten-pruefer` für Hauptstädte und Schreibweisen, `bild-recherche` für Flaggen und Nachweise.
- [ ] Flaggen, Hauptstädte, Umrisse, Memorys darauf umstellen; Profi mit Ländern vom selben Kontinent.
- [ ] Alte Memory-Runden laufen weiter (`SavedGame` repariert sie heute schon; Test).

#### Aufgabe 12: Reihenfolge-Probe und Teil B abschließen

- [ ] „Ordne richtig“ (`classic:order`) mit Rätseln aus Karten; „Sortiere die Zeit“ mit Vorrat; beide mit den Stufen aus E4.
- [ ] „Was ist neu?“, `pnpm run check`, große Suiten `playground`, `challenge`, `animals`; Helfer wie in Aufgabe 6; PR nach `test-live`.

### Teil C „Labore und Reisen“

#### Aufgabe 13: Labore (E10)

- [ ] Test zuerst: Frage gesperrt, bis das Modell verändert wurde; alter Stempel bleibt; alter Spielstand ohne `ausprobiert` lädt.
- [ ] Drei Vermutungen je Labor (Inhalt aus den vorhandenen Modellen, `fakten-pruefer`, `kinder-redaktion`).
- [ ] Stufen statt Leicht/Mittel/Schwer; Experte-Probe in zwei Laboren mit zwei Reglern.

#### Aufgabe 14: Reisen (E9)

- [ ] Antworten mischen, Reihenfolge je Kapitel gemerkt; Stufen statt Entdecken/Erklären/Übertragen über die gemeinsame Wahl.
- [ ] `stufen-pruefer` prüft, welche „Übertragen“-Aufgaben echte Experten-Aufgaben sind; Ratemuster-Test für die 240 Aufgaben (heute 43 % längste).
- [ ] Tests `journeys`, `engine-journeys`, `journey-transfer`, `reise-kapitel` vorher durchsuchen und in einem Durchgang anpassen.

#### Aufgabe 15: Personen-Belege und Tier-Aufgaben

- [ ] Gemeinsame Wahl statt eigener Stufenknöpfe mit Alter (`people-evidence.tsx`, `animal-inquiry.tsx`).

#### Aufgabe 16: Reste aus E16

- [ ] Was nach Aufgabe 4 an alten Wörtern in Laboren und Reisen übrig ist.

#### Aufgabe 17: Teilschritt 3 abschließen

- [ ] „Was ist neu?“, `pnpm run check`, betroffene große Suiten; Helfer `code-pruefer`, `design-pruefer`, `stufen-pruefer`, `kinder-redaktion`, `fakten-pruefer`.
- [ ] `STATUS.md`, `BACKLOG.md`, `CHANGELOG.md`; Entscheidungsliste in `docs/entwurf/`.
- [ ] Vorschau-Link, PR nach `test-live`. Die Seite für Freunde wird erst am Ende von Phase 1 erneuert.

## 6. Prüfen

- Unit-Tests: Stufe und Übernahme, Vorschläge, Auswahl-Helfer, Frage je Stufe auf der Karte, Stufenfeld und Antwortzahl je Zusatzfrage, Ratemuster je Gruppe, Hinweis ohne Lösung, Labor-Sperre, alte Links und Stempel zusammengelegter Spiele.
- Browser-Tests: Umstellen mit einem Tipp, Stufe übersteht Neuladen, Export und Import, Altpass mit `settings.difficulty`, Karte auf jeder Stufe, angefangene alte Runden.
- Helfer je Teil wie in den Aufgaben. `fable` erst bei der Abschlussprüfung von Phase 1.
- **Ehrlich:** Ob Kinder dadurch länger bleiben, zeigt erst ihre Rückmeldung über den Nutzer. Wir erfinden keinen Kindertest. Der Nutzer kann das 10-jährige Kind nach Teil B noch einmal fragen.
