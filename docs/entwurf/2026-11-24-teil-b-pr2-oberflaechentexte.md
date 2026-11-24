# Oberflächentexte Teil B, PR 2 (Aufgabe 9), Entwurf, 24.11.2026

Helfer: `karten-autor`. Eingebaut in Commit `cf15116`, danach geprüft von der `kinder-redaktion` ([Bericht](2026-11-24-teil-b-pr2-oberflaechentexte-kinderredaktion.md)).

## Entwurf: Oberflächentexte für Teil B, Aufgabe 9 (Kreuz und quer)

Das ist nur ein Entwurf. Ich habe keine Datei geändert, und noch hat niemand geprüft. Als Nächstes prüft die `kinder-redaktion`. Wie viele Experten-Fragen es gibt, habe ich mit `node` aus `app/world-catalog.json` gezählt. Kreuz und quer hat 4 Experten-Fragen, je Runde kommen höchstens 3 (`EXPERTEN_JE_RUNDE`). Bei „Stimmt das wirklich?“ gibt es 4 Aufgaben je Runde.

### 1. Eintrag für „Was ist neu?“ (`app/kern/neuigkeiten.ts`, oben anfügen)

```ts
{id: 'kreuz-und-quer', datum: '2026-11-24', symbol: 'kompass', titel: 'Kreuz und quer und neue Fragen', text: 'Die Wissens-Challenge heißt jetzt „Kreuz und quer“ und startet gleich auf deiner Stufe. „Stimmt das wirklich?“ hat neue Fragen zu Wetter, Meer und Pilzen.'}
```
- Länge nachgezählt: Titel 30 Zeichen (erlaubt sind 40), Text 154 Zeichen (erlaubt sind 160). Die Sätze haben 13 und 11 Wörter. Der Test erkennt 2 Sätze, denn auf „?“ folgt ein Anführungszeichen und kein Leerzeichen.
- Der erste Satz hat 13 Wörter. Wenn der `kinder-redaktion` das zu lang ist, kann „gleich“ wegfallen, dann sind es 12.
- Die `id` `kreuz-und-quer` ist noch frei. Als Symbol nehme ich `kompass`, weil frühere Spiele-Einträge es auch nutzen. Am 24.11. gibt es schon zwei Einträge mit `stern`.
- Ich empfehle nur einen Eintrag. Oben stehen höchstens 6 Einträge, jeder neue schiebt einen älteren nach „Früher“. Die Einträge „Memory ohne Zähler“, „Spielen führt zurück“ und „Stufe vorschlagen“ lasse ich weg. Sie sind klein, und „drei-stufen“ und „spiele-mit-stufen“ sagen das Wichtigste schon.

### 2. Die Oberflächensätze

| Ort | Bisher | Empfehlung |
|---|---|---|
| Spielliste (`world-games.tsx`, `game-index.json`) | „Fragen aus allen Welten, bunt gemischt. Du spielst auf deiner Stufe.“ | **So lassen.** Kurz und stimmt. |
| Startseite, Text (`discovery-data.ts`) | „Bei „Kreuz und quer“ prüfst du, wie Pflanzen und Tiere zusammenarbeiten. Du spielst auf deiner Stufe, Tipps gibt es auf Wunsch.“ | **Neu:** „Bei „Kreuz und quer“ kommen Fragen aus allen Welten, zum Beispiel zu Bienen und Blüten. Du spielst auf deiner Stufe.“ |
| Startseite, Knopf | „Kreuz und quer öffnen“ | **So lassen.** Der Knopf öffnet das Spiel wirklich (`onGame`). |
| Bildunterschrift (`discovery-activity-preview.tsx`, `knowledge-preview-image.json`) | „Bildschirmfoto aus dem Spiel · So sieht eine Runde aus.“ | **Kann bleiben.** Genauer wäre `caption` = „So sieht eine Aufgabe aus.“, denn das Bild zeigt eine Frage, keine Runde. Im Spiel heißt es auch „AUFGABE 1 VON 6“. |
| Klassik, Abschluss (`classic-reason-game.tsx`) | „Du hast alle {n} Aufgaben gelöst. Nachdenken und Nachschauen gehören zum Lernen.“ | **Neu:** „Du hast alle {n} Aufgaben gelöst. Toll, wie du drangeblieben bist!“ |
| Klassik, Knopf | „Neue Aufgabenfolge auf dieser Stufe“ | **Knopftext ändert sich:** „Noch eine Runde auf deiner Stufe“ |
| Kreuz und quer, Abschluss (`knowledge-challenge-game.tsx`) | „Dein Spielstempel ist im Entdeckerpass. Mach gern eine Pause oder entdecke eine passende Karte.“ | **So lassen.** |
| Kreuz und quer, Knopf | „Andere Aufgaben auf dieser Stufe“ | **Knopftext ändert sich:** „Noch eine Runde auf deiner Stufe“ (gleich wie bei Klassik) |
| Experte (`knowledge-challenge.ts`, `EXPERTEN_HINWEIS`) | „Experten-Fragen gibt es hier erst wenige. Du bekommst sie zuerst, dann Profi-Fragen.“ | **Neu:** „Hier gibt es erst wenige Experten-Fragen. Du bekommst bis zu drei, danach Profi-Fragen.“ |
| Memory, Statuszeile (`learning-games.tsx`) | „Ohne Zeitdruck“ | **Kann bleiben.** Freundlicher wäre „Lass dir Zeit“. |
| Memory, Abschluss | „Alle sechs Paare gefunden. Die passenden Länder und Hauptstädte sind verbunden.“ | **Neu:** „Alle sechs Paare gefunden! Jedes Land hat seine Hauptstadt.“ |

**Gründe:**
- **Startseite, Text:**
  - Der alte Satz verspricht ein Thema, das selten kommt. Die Runde ist bunt gemischt. Bienen- und Blütenfragen sind nur wenige im großen Vorrat, auf Profi nur eine.
  - Der Tipp-Satz fällt weg, weil direkt darunter schon „Freiwillige Hinweise helfen beim Weiterdenken.“ steht (`discovery-central.tsx`, Zeile 47).
  - „auf Wunsch“ klingt nach Erwachsenen.
  - Am Titel „Blüten und Bestäuber verbinden“ hängt dasselbe Problem: Das Spiel verbindet nicht gezielt. Ich habe ihn nicht umgeschrieben, weil er nicht im Auftrag stand. Den Titel entscheidest du.
- **Klassik, Abschluss:** Der zweite Satz belehrt. Besser ist ein Lob für das Dranbleiben.
- **Beide Knöpfe:**
  - „Aufgabenfolge“ ist ein schweres Wort, und die beiden Spiele sagen bisher dasselbe unterschiedlich.
  - „deiner“ statt „dieser“: Die neue Runde startet mit der Stufe aus dem Pass (`neueRunde(stufe)`), nicht mit der gerade gespielten. Hat ein Kind die Stufe gewechselt, wäre „dieser Stufe“ falsch.
- **Experten-Satz:** Der alte Satz stimmt so nicht mehr. „Du bekommst sie zuerst“ klingt nach allen, es sind aber höchstens drei von vier. Am besten wird „drei“ aus `EXPERTEN_JE_RUNDE` gebaut, damit der Satz nicht wieder veraltet.
- **Memory, Abschluss:** Der zweite Satz ist steif und wiederholt den ersten. Die Überschrift „Abenteuer geschafft!“ setzt `GameWin` selbst darüber.

**Knöpfe und Sätze, die Tests suchen:**
- Neuer Knopf „Noch eine Runde auf deiner Stufe“: `tests/browser/playground.mjs:91` sucht noch „Neue Aufgabenfolge auf dieser Stufe“.
- Derselbe neue Knopf in Kreuz und quer: `tests/browser/connected-discoveries.mjs:123` sucht noch „Andere Aufgaben auf dieser Stufe“.
- Neuer Experten-Satz: `tests/challenge.test.mjs:127` erwartet noch „Experten-Fragen gibt es hier erst wenige“.
- Neuer Memory-Abschluss: `tests/browser/portable-flows.mjs:166` sucht nur „Alle sechs Paare gefunden“. Der Anfang bleibt gleich, der Test passt also weiter.
- Unverändert: Der Knopf „Kreuz und quer öffnen“ bleibt, den sucht `tests/browser/discovery-central.mjs:197` und `:232`.

### 3. Quellen
Keine nötig. Es sind nur Sätze für die Oberfläche, ohne Wissensaussagen. Die Themen im Eintrag (Wetter, Meer, Pilze) stammen aus deiner Aufgabenbeschreibung, nicht aus `classic-questions.json`. Gezählt habe ich dort nur die Fragen je Stufe (8, 12, 6), die Themen habe ich nicht nachgesehen.

### 4. Umformuliert
Keine gespeicherten Antworten betroffen. Nur die Knopftexte und Sätze oben ändern sich.

### 5. Zahlen
Entfällt, denn es gibt keine Fragen. Nachgezählt habe ich: Kreuz und quer hat 8 Entdecker-, 33 Profi- und 4 Experten-Fragen aus den Challenges plus 198 Hauptfragen der Karten auf Entdecker. Bei „Stimmt das wirklich?“ sind es 8 Entdecker-, 12 Profi- und 6 Experten-Fragen.

### 6. Offen
- **Spiel-Beschreibung von „Stimmt das wirklich?“** in `app/game-index.json` und `app/learning-games.tsx` Zeile 24: „Entlarve erstaunliche Erd-Irrtümer als Wissensdetektiv.“ passt nicht mehr ganz.
  - Manche Aussagen stimmen, und es geht jetzt auch um Pilze, Korallen und Pflanzen.
  - Vorschlag: „Stimmt die Aussage oder nicht? Prüfe sie wie ein Detektiv.“
  - Im selben Array steht `meta:"10 knifflige Aussagen"`. Es wird anscheinend nirgends angezeigt. Das bitte prüfen.
- **Rest der Klassik-Abschlussseite:** Der Satz „Hier gibt es keine Serien und keinen Zeitdruck.“ steht dort noch. „Serien“ verstehen Kinder kaum. Vorschlag: „Oder mach eine Pause. Hier hetzt dich niemand.“
- **Alter Eintrag `pflanzen-wasser-mond`:** Darin steht noch „Bei der Wissens-Challenge suchst du dir eine von drei Stufen aus.“ Das ist Chronik von früher, darum lasse ich es stehen.
