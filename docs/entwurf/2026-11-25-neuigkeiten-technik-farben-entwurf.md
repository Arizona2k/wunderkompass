# Entwurf „Was ist neu?“: Technik kurz erklärt und neue Farben

Helfer: `karten-autor` (opus / high), 25.11.2026. Ungeprüfter Entwurf; Einbau mit dem jeweiligen Schritt.

Ich habe keine Datei geändert. Alle vier Fassungen bestehen die Regeln aus `/home/user/wunderkompass/tests/neuigkeiten.test.mjs`: Titel höchstens 40 Zeichen, Text höchstens 160 Zeichen, höchstens zwei Sätze, kein „Nachrichten“, ID in Kleinbuchstaben mit Bindestrich. Nachgezählt habe ich mit `node -e` und genau demselben Ausdruck für Satzenden wie der Test. Das „!“ in „Richtig!“ zählt dabei nicht als Satzende, weil direkt danach das Anführungszeichen „““ kommt.

### Eintrag A: `technik-kurz`, Symbol `lupe` (Detektiv; der Eintrag davor hat schon `kompass`)

**A1 (Empfehlung)**
```ts
{id: 'technik-kurz', datum: '2026-11-25', symbol: 'lupe', titel: 'Technik-Detektiv: kurz erklärt', text: 'Nach „Richtig!“ erfährst du jetzt in drei Sätzen, wie die Erfindung funktioniert. Zur Rakete probierst du mit einem Luftballon etwas aus.'}
```
- Titel 30, Text 137 Zeichen; Sätze mit 12 und 9 Wörtern.
- **Wie A1 an den vorigen Eintrag anschließt:** `rueckmeldung-ganz` endet mit „… erfährst du dann etwas Neues über diesen Menschen.“ A1 nimmt dasselbe Wort „erfährst“ auf, wiederholt aber das Rollen zu „Richtig!“ nicht.
- **Warum Empfehlung:** Das Luftballon-Beispiel lädt zum Mitmachen ein.

**A2**
```ts
{id: 'technik-kurz', datum: '2026-11-25', symbol: 'lupe', titel: 'Wie funktioniert das?', text: 'Auch im Technik-Detektiv lernst du nach „Richtig!“ noch etwas. Drei kurze Sätze sagen dir, wie jede der 24 Erfindungen funktioniert.'}
```
- Titel 21, Text 132 Zeichen; Sätze mit 9 und 11 Wörtern.
- Hier schließt „Auch“ ausdrücklich an den vorigen Eintrag an.

**Worauf sich die Aussagen stützen**
- **Spielname „Technik-Detektiv“:** `/home/user/wunderkompass/app/world-games.tsx:33` und `/home/user/wunderkompass/app/game-index.json:172`.
- **Erklärung kommt erst nach richtiger Antwort:**
  - `/home/user/wunderkompass/app/world-games.tsx:62`: `feedback = right ? current.why : worldGameWrongFeedback(…)`.
  - Die Überschrift heißt wörtlich „Richtig!“ (`/home/user/wunderkompass/app/kern/woerter.ts:5`, `/home/user/wunderkompass/app/kern/spiel-fokus.ts`).
- **Bisher die lange Erklärung:** `/home/user/wunderkompass/app/world-game-bank.ts:55` nimmt heute `stages[2].text`.
- **24 Erfindungen:**
  - Nachgezählt: 24 Karten mit `invention` in `app/world-catalog.json`.
  - Das Spiel nimmt alle davon (`world-game-bank.ts:51`).
- **Drei Sätze, wie es funktioniert:** `/home/user/wunderkompass/docs/entwurf/2026-11-25-technik-aufloesung-endfassung.md`, Tabellen „Die 24 Texte“.
- **Luftballon bei der Rakete:** dieselbe Datei, Zeile `invention-rocket` („Lass mal einen aufgeblasenen Luftballon los …“).

**Was ihr vor dem Einbau prüfen solltet**
- ⚠ **„drei Sätze“ stimmt nicht überall.** Rakete und Smartphone haben in der Endfassung **vier** Sätze, die anderen 22 drei. Wenn das so bleibt, ist A1 bei diesen beiden um einen Satz ungenau, A2 auch. Ausweichen ginge mit „in ein paar kurzen Sätzen“: A1 hätte dann 141 Zeichen und einen Satz mit 13 Wörtern; das habe ich nicht mit dem Skript nachgezählt. Oder „drei Sätze“ bleibt, wenn die Endfassung noch angepasst wird.
- ⚠ **Der Eintrag gilt erst nach dem Einbau.** Die Endfassung ist laut Abschnitt „Noch offen vor dem Einbau“ noch nicht eingebaut, und eine zweite Faktenprüfung (⚑) steht aus. Der Eintrag darf erst mit `TECHNIK_AUFLOESUNG` erscheinen. Das Datum passt ihr dann an den Tag des Einbaus an.

### Eintrag B: `neue-farben`, Symbol `kompass` (das neue Aussehen heißt „Kompass“)

**B1 (Empfehlung)**
```ts
{id: 'neue-farben', datum: '2026-11-25', symbol: 'kompass', titel: 'Ruhige Farben, gleiche Knöpfe', text: 'Die Seite hat jetzt ruhigere Farben, und die Knöpfe sind überall blaugrün. Was du auswählst, sieht nicht mehr grün aus wie eine richtige Antwort.'}
```
- Titel 29, Text 145 Zeichen; Sätze mit 12 und 12 Wörtern.
- **Warum Empfehlung:** B1 nennt, was jedes Kind beim Tippen sofort merkt. Dass „gewählt“ nicht mehr wie „richtig“ aussieht, ist dabei der wichtigste Punkt fürs Lernen.

**B2**
```ts
{id: 'neue-farben', datum: '2026-11-25', symbol: 'kompass', titel: 'Die Seite hat neue Farben', text: 'Die Knöpfe sind jetzt überall blaugrün, mit großer Schrift auch größer. Mit der Tastatur siehst du überall denselben Rahmen.'}
```
- Titel 25, Text 124 Zeichen; Sätze mit 11 und 8 Wörtern.
- B2 richtet sich eher an Eltern und an Kinder, die die Seite mit der Tastatur bedienen.

**Worauf sich die Aussagen stützen**
- **Ruhigere Farben:**
  - Neuer Grund ist das Papier `#EDF1EA` (`/home/user/wunderkompass/docs/entwurf/2026-11-25-design-umbau.md`, Schritt 1, Z. 39).
  - Heute ist der Grund `rgb(250, 248, 243)` (`/home/user/wunderkompass/docs/entwurf/2026-11-25-umbau-schritt-1-bauplan.md`, Z. 76).
- **Knöpfe überall blaugrün:**
  - Petrol `#0B6B73` für Knöpfe (design-umbau Z. 39 und 43).
  - Der orange Knopf `#b95121` und das orange `--primary` werden Petrol (bauplan Z. 12 und 56).
  - „Jeder Weg zeigt danach dieselben Knöpfe“ (bauplan Z. 99).
  - Statt „Petrol“ schreibe ich „blaugrün“, weil Kinder das Fachwort nicht kennen.
- **Gewählt nicht mehr grün:**
  - Heute sind gewählte Knöpfe `#d9efe4`, also grün (bauplan Z. 19).
  - Neu: gewählt in „Petrol-zart, nicht grün“ (bauplan Z. 62–63).
- **Große Schrift macht Knöpfe größer:** große Schrift als feste Stufe, etwa +20 % auf alle Bausteine (design-umbau Z. 44, bauplan Z. 53).
- **Gleicher Rahmen mit der Tastatur:** „Ein Fokusrahmen für die ganze Seite“ (design-umbau Z. 41, bauplan Z. 64).

**Was ihr vor dem Einbau prüfen solltet**
- ⚠ **„überall“ gilt nur, wenn Schritt 1 wirklich alle Knopfarten umstellt** (primary, secondary, quiz-answer, visual-choice, model-choice). Das sieht der `design-pruefer` an den Bildern. Bleibt ein Bereich alt, ersetzt ihr „überall“ durch „fast überall“ oder streicht das Wort.
- ⚠ **Nichts Späteres angekündigt.** Neue Schrift (erst Schritt 2), Karten, Spiele und Stempel kommen in keiner Fassung vor.

### Umformuliert
Keine. Es sind neue Einträge; bestehende Einträge und gespeicherte Antworten sind nicht betroffen.

### Zahlen
Fragen und Antworten gibt es hier nicht, darum gibt es auch keinen Anteil „einzige längste/kürzeste Antwort“.

| Fassung | Titel (Zeichen) | Text (Zeichen) | Wörter je Satz |
|---|---|---|---|
| A1 | 30 | 137 | 12 / 9 |
| A2 | 21 | 132 | 9 / 11 |
| B1 | 29 | 145 | 12 / 12 |
| B2 | 25 | 124 | 11 / 8 |

### Offen
1. **Nicht alle fünf Punkte für B passen in einen Eintrag.** Mit 160 Zeichen und zwei Sätzen passen höchstens drei der fünf gewünschten Punkte hinein. B1 lässt Tastaturrahmen und große Schrift weg, B2 lässt Grund und „gewählt nicht grün“ weg. Wenn euch alles wichtig ist, ginge ein zweiter kleiner Eintrag, zum Beispiel `fokus-gleich`. Ich rate eher davon ab, weil höchstens sechs Einträge oben stehen und der Rest dann schneller unter „Früher“ rutscht.
2. **Das Datum beider Einträge** ist der Tag des jeweiligen Merges. 2026-11-25 ist nur ein Platzhalter. Neue Einträge kommen oben an, die Liste muss nach Datum geordnet bleiben.
3. **„drei Sätze“ in A** hängt von der Entscheidung zu Rakete und Smartphone ab (siehe oben).

Diese Entwürfe sind noch nicht geprüft. Danach sind `kinder-redaktion` (Ton, Länge) und `fakten-pruefer` dran: Stimmen „überall“ und „drei Sätze“ mit dem gebauten Stand?

## Entscheidung von Claude (25.11.2026)

- **A:** A1, aber ohne „in drei Sätzen“, weil Rakete und Smartphone vier Sätze haben: „Nach „Richtig!“ erfährst du jetzt kurz, wie die Erfindung funktioniert. Zur Rakete probierst du mit einem Luftballon etwas aus.“ Datum: Tag des Einbaus.
- **B:** B1. „überall“ bleibt nur, wenn der `design-pruefer` nach Schritt 1 keine alten Knöpfe mehr findet. Datum: Tag des Merges.
- Vor dem Einbau liest die `kinder-redaktion` beide Einträge.

## Nach der Kinder-Redaktion (25.11.2026, [Bericht](2026-11-25-neuigkeiten-technik-farben-kinderredaktion.md))

- **A, eingebaut:** Titel „Technik-Detektiv: So geht das“, Text „Liegst du richtig, erfährst du jetzt, wie die Erfindung funktioniert. Bei der Rakete zeigt ein Luftballon, wie sie davonsaust.“ (kein zweites „Nach „Richtig!““ direkt unter dem vorigen Eintrag, kein „Rakete ausprobieren“).
- **B, für Umbau-Schritt 1:** „Die Seite hat ruhigere Farben, und alle Knöpfe sehen gleich aus. Grün wird eine Antwort jetzt nur noch, wenn sie richtig ist.“ Nur wenn der Bau das wirklich überall so zeigt (Spiele, Kreuz und quer, Labore, Karten); sonst „Eine angetippte Antwort ist nicht mehr grün.“
- **Luftballon:** Der Versuch nutzt einen aufgeblasenen Ballon und ist ein üblicher Kinderversuch; die Gefahr beim Verschlucken betrifft schlaffe Ballons und Reste. Keine Änderung am Rakete-Text; die Seite richtet sich an Kinder mit Eltern.
