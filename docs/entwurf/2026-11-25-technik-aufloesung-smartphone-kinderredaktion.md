# Kinder-Redaktion: Smartphone-Auflösung (25.11.2026)

Helfer: `kinder-redaktion` (opus / high), prüft den [Entwurf](2026-11-25-technik-aufloesung-smartphone-entwurf.md). Entscheidung: [Nachtrag, Abschnitt 7](2026-11-25-technik-aufloesung-nachtrag-entwurf.md#7-entscheidungen).

Ich habe nur gelesen und nichts geändert. Geprüft habe ich `docs/entwurf/2026-11-25-technik-aufloesung-smartphone-entwurf.md`. Zum Vergleich habe ich gelesen: `TECHNIK_AUFLOESUNG` in `app/world-game-support.mjs`, meine beiden Nachtrag-Berichte und die Karte `invention-smartphone` in `app/world-catalog.json`. Die Zeichen habe ich von Hand gezählt. Bitte vor dem Einbau mit `pruef.cjs` nachzählen.

## 1. Gesamteindruck

**Note: geht so.** Der Befund stimmt. Die heutige Fassung ist anschaulich, beantwortet aber nur die erste Hälfte der Aufgabe. Mein eigener Tipp lautet „Passt das zu allem, was in der Aufgabe steht?“. Danach muss die Auflösung auch die zweite Hälfte erklären. A hat die richtige Idee, eine Kette aus Rechnen und Funk. Das Wort „Chip“ trägt diese Kette aber nicht. B und C fallen deutlich ab.

## 2. Antworten auf die Fragen

- **„Chip“:** Für 6- bis 8-Jährige ist das zuerst ein Kartoffelchip. „Ein winziger Chip, der rechnet“ ergibt für sie kein Bild. Erklärt wird das Wort weder auf der Karte noch in `app/kern/woerter.ts`. Mein Vorschlag ist **„ein winziger Rechner“**. Das Wort kennen Kinder vom Rechnen in der Schule und vom Taschenrechner. Es greift auch die Karte auf („Telefon und kleiner Computer“), ohne sie zu doppeln. Mit dem Namen einer Erfindung beginnt es nicht.
- **„rechnet“:** Das verstehen Kinder ab der 1. Klasse. Seltsam wird es erst bei „mit Fotos rechnen“. Das ergibt nur Sinn, wenn der Text sagt, dass für das Gerät alles Zahlen sind.
- **„Zahlenreihen“:** Das ist ein abstraktes zusammengesetztes Wort und für 8-Jährige knapp tragfähig. **„lauter Zahlen“** klingt kindlicher und reicht. Der Staun-Moment bleibt: Ein Foto ist für das Gerät nur Zahlen. „Nullen und Einsen“ ist schöner, braucht aber eine Erklärung und gehört deshalb unter „Mehr erfahren“.
- **„App“:** Das Wort kennen viele Kinder vom Tablet. Es ist aber englisch und wird nirgends erklärt. In B klingt der Satz damit fast wie die Computer-Auflösung („Liste genauer Schritte … nacheinander“). Ich rate davon ab.
- **A gegen die heutige Fassung:** A ist besser, weil sie die ganze Aufgabe abdeckt. A verliert dafür zwei anschauliche Dinge: „unsichtbare Funkwellen, wie beim Radio“ und den Wechsel zum nächsten Mast. Den Mast-Wechsel kann die Karte retten (Abschnitt 4). Dazu kommen zwei kleine Schwächen in A:
  - „Mast“ ohne „Funk“ lässt an ein Schiff oder eine Fahne denken. Das hatte ich schon in meinem ersten Bericht angemerkt, und die damalige Entscheidung lautete „Funkmast in der Nähe“.
  - „Stimme und Fotos … Funkwellen tragen sie“ klingt so, als gingen Fotos immer weg. Diesen Punkt hat der Autor selbst markiert.
- **B:** Die beiden Teile stehen unverbunden nebeneinander, dazu kommt „App“. Ich rate ab.
- **C:** „Milliarden“ hat keine neutrale Quelle, „bleibt verbunden“ erklärt kein Wie, und „Schalter“ doppelt die Transistor-Auflösung. Ich rate ab. Gut an C ist „tippst oder wischst“, das passt aber nicht mehr hinein.

## 3. Empfehlung: neue Fassung D (aus A weiterentwickelt)

> **Das Smartphone hat innen einen winzigen Rechner. Für ihn sind Fotos, Spiele und deine Stimme lauter Zahlen. Unterwegs tragen Funkwellen die Zahlen zu einem Funkmast in der Nähe.**

**177 Zeichen** (48 + 1 + 58 + 1 + 69). Wörter je Satz: 7 / 10 / 11. Ziffern: 0.

Ich habe alle Wörter gegen die Titel der 24 Erfindungen geprüft. Keines beginnt mit einem dieser Namen, auch nicht „Nähe“, denn „Nähmaschine“ ist länger. Die Wörter „telefonieren“, „Computer“, „Kamera“ und „Licht“ kommen nicht vor.

Warum D:
- **Ein Bild verbindet beide Teile.** Der Rechner macht alles zu Zahlen, und genau diese Zahlen tragen die Funkwellen fort. „die Zahlen“ steht absichtlich zweimal, damit die Kette auch für Kleine hält.
- **„Fotos, Spiele“** zeigt aus dem Alltag der Kinder, was „Informationen bearbeiten“ heißt. Die Stimme verbindet es mit dem Telefonieren.
- **„Unterwegs“** nimmt das Schlüsselwort der Aufgabe auf.
- **„Funkmast in der Nähe“** folgt der früheren Entscheidung.
- **Sätze fangen gerade an.** Es gibt keinen verdrehten Anfang. „Für ihn“ meint klar den Rechner.
- **Keine Dopplung** mit der Karte und den anderen Auflösungen. „Programm/Schritte“ steht beim Computer, „Schalter“ beim Transistor.

Wer bei A bleiben will, sollte mindestens zwei Wörter ändern: „Chip“ zu „Rechner“ und „Mast“ zu „Funkmast“. Das ergibt etwa 186 Zeichen, also müsste zusätzlich gekürzt werden. Darum empfehle ich D.

Möglich, aber nicht empfohlen: „unsichtbare“ vor „Funkwellen“ setzen und dafür „innen“ streichen. Das ergibt 183 Zeichen, also zu lang. Ohne „Funk“ in „Funkmast“ wären es 179 Zeichen, aber dann ist der Mast wieder mehrdeutig.

## 4. Vorschlag für „Mehr erfahren“ auf der Karte `invention-smartphone`

Das ist ein Vorschlag fürs BACKLOG, nicht Teil dieser Änderung.
- Den Mast-Wechsel aus der heutigen Fassung retten: „Wenn du weit weggehst, übernimmt der nächste Funkmast.“ Dafür fehlt noch eine Quelle.
- Für Große: „Der Rechner kennt eigentlich nur zwei Zeichen: Null und Eins.“
- Die Handschuh-Probe (aus meinem ersten Bericht) als Mitmach-Idee.

## 5. Unsicher

- Für den `fakten-pruefer`:
  - Sind „Für ihn sind Fotos, Spiele und deine Stimme lauter Zahlen“ und „Unterwegs tragen Funkwellen die Zahlen“ zulässige Vereinfachungen? Ich halte das für tragfähig, weil die BfS-Quelle aus dem Entwurf von digitalisierten Daten spricht.
  - Darf „Rechner“ für Prozessor und Speicher zusammen stehen?
- Für die `stufen-pruefer`: Ob „Rechner“ als Wort zu nah an der falschen Antwort „Der Computer“ liegt, kann ich nicht sicher beurteilen. Die Auflösung erscheint erst nach „Richtig!“, verrät also nichts. Ein Kind könnte aber denken: „Dann war es doch der Computer?“ Ich halte das für unkritisch, weil die Karte selbst „kleiner Computer“ sagt.
- Wie der Text bei 320 px und großer Schrift im Kasten aussieht, habe ich nicht gemessen.
