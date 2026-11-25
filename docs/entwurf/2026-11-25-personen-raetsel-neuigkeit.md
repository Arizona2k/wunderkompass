# „Was ist neu?“ zu den neuen Rätseln in „Wer war das?“ (25.11.2026)

Helfer: `karten-autor` (Entwurf). Prüfung danach durch die `kinder-redaktion`.

Ich habe keine Datei geändert. Beide Varianten gehören ganz oben in `NEUIGKEITEN` in /home/user/wunderkompass/app/kern/neuigkeiten.ts, also vor `kreuz-und-quer`. Dann stimmt die Reihenfolge „neueste zuerst“.

**Variante A (empfohlen)**
```ts
  {id: 'wer-war-das-raetsel', datum: '2026-11-25', symbol: 'lupe', titel: 'Neue Rätsel bei „Wer war das?“', text: 'Alle 36 Menschen haben jetzt ein eigenes Rätsel. Als Entdecker liest du einen leichten Satz, als Profi das ganze Rätsel.'},
```
- Titel: 30 Zeichen. Text: 120 Zeichen, 2 Sätze mit 8 und 12 Wörtern.

**Variante B**
```ts
  {id: 'eigene-raetsel', datum: '2026-11-25', symbol: 'lupe', titel: 'Jeder Mensch hat sein Rätsel', text: 'Bei „Wer war das?“ hat jetzt jeder der 36 Menschen ein eigenes Rätsel. Als Entdecker hilft dir ein neuer Tipp, als Profi wird es kniffliger.'},
```
- Titel: 28 Zeichen. Text: 140 Zeichen, 2 Sätze mit 13 und 12 Wörtern.

**Nachgezählt mit `node -e`, mit denselben Regeln wie `tests/neuigkeiten.test.mjs`:**
- Beide IDs sind klein mit Bindestrichen geschrieben und in der Datei noch frei.
- Der Titel hat höchstens 40 Zeichen, der Text höchstens 160.
- Der Satz-Zähler des Tests findet in beiden Texten 2 Sätze. Das „?“ in „Wer war das?“ zählt er nicht mit, weil direkt danach das „““ kommt.
- „Nachrichten“ kommt nicht vor.

## Warum ich A empfehle
- Der Spielname steht im Titel. So sieht ein Kind schon beim Überfliegen, worum es geht.
- Der zweite Satz zeigt, was ein Kind auf seiner Stufe selbst sieht: ein Satz auf Entdecker, das ganze Rätsel als Profi. Das ist greifbarer als „kniffliger“.
- A ist kürzer und hat keinen Satz über 12 Wörter.
- Den neuen Tipp und die falschen Namen aus anderen Gebieten erwähnt A nicht. Das sind Details, die das Kind im Spiel ohnehin merkt.

B nennt den Tipp, bleibt aber dafür allgemeiner („wird es kniffliger“). Der erste Satz ist mit 13 Wörtern etwas lang.

## Symbol
Ich habe `lupe` gewählt, weil man bei einem Rätsel wie ein Detektiv sucht. `stern` ginge auch und würde zum Eintrag `spiele-mit-stufen` passen. Dann stünden aber drei Sterne in den obersten sechs Einträgen.

## Quellen
Keine nötig. Der Eintrag beschreibt nur die Seite. Die Zahl 36 stammt aus deinem Auftrag; neue Zahlen stehen nicht drin.

## Umformuliert
Keine.

## Offen
- Mit dem neuen Eintrag stehen oben weiter höchstens sechs Einträge. Der Eintrag `stufe-mit-ziel` vom 24.11. rutscht dann unter „Früher“. Das macht `aufteilen()` von selbst, der Test bleibt grün.
- Ich habe nicht nachgesehen, wie die Stufen im Spiel `people` angezeigt werden. Bitte kurz prüfen, ob sie dort wirklich „Entdecker“ und „Profi“ heißen, damit die Wörter genau zur Spielseite passen.
- Prüfen sollte den Text noch die `kinder-redaktion`.
