# Stufen-Prüfung: Smartphone-Auflösung (25.11.2026)

Helfer: `stufen-pruefer` (opus / high), prüft den [Entwurf](2026-11-25-technik-aufloesung-smartphone-entwurf.md) und die Fassung D der [Kinder-Redaktion](2026-11-25-technik-aufloesung-smartphone-kinderredaktion.md). Entscheidung: [Nachtrag, Abschnitt 7](2026-11-25-technik-aufloesung-nachtrag-entwurf.md#7-entscheidungen).

Ich habe nur gelesen und nichts geändert. Dieser Bericht ersetzt meinen ersten Bericht von heute. Mein dort vorgeschlagenes „D“ heißt hier **D1**. Damit es nicht mit der Fassung der Kinder-Redaktion verwechselt wird, heißt diese **D**.

Grundlage: `docs/entwurf/2026-11-25-technik-aufloesung-smartphone-entwurf.md`, `docs/entwurf/2026-11-25-technik-aufloesung-nachtrag-stufen-schluss.md`, `app/world-game-bank.ts`, `app/world-game-runde.ts`, `app/world-game-support.mjs` (`TECHNIK_AUFLOESUNG`, `TECHNIK_FALSCH`), `app/world-game-fallen.json`, `app/world-catalog.json`.

## Gesamtempfehlung

**Ich empfehle Fassung E.** Sie verbindet die Fassung der Kinder-Redaktion mit A:

„Das Smartphone rechnet innen blitzschnell. Fotos, Spiele und deine Stimme sind darin lauter Zahlen. Unterwegs tragen Funkwellen die Zahlen zu einem Funkmast in der Nähe.“

- 169 Zeichen, Sätze mit 5, 9 und 11 Wörtern, keine Ziffer.
- Ich habe den Wortanfang gegen alle Erfindungsnamen geprüft, dazu „telefon“, „automat“, „licht“, „kamera“ und „druck“: kein Treffer.
- Ohne „Chip“, wie die Kinder-Redaktion wünscht. Ohne „Rechner“, wie es aus Sicht der Stufen nötig ist (Begründung unten).

Rangfolge der drei Fassungen, nach denen gefragt wurde: **D mit einer Änderung (= E) > A > heute.**
- **D** in der vorgelegten Form ist besser als A: anschaulicher, mit „unterwegs“ und klarem Bezug „die Zahlen“. Es kostet aber das Wort „Rechner“.
- **A** taugt als Rückfall, wenn E nicht gewünscht ist. Dann besser als D1: „Das Smartphone hat einen winzigen Chip, der blitzschnell rechnet. Er macht aus deiner Stimme und deinen Fotos Zahlen. Unterwegs tragen Funkwellen sie zu einem Mast in der Nähe.“ (176 Zeichen).
- **Die heutige Fassung** ist die schwächste. Sie erklärt nur das Telefonieren.

## Wichtig: Welche Fallen stehen wirklich neben dem Smartphone? (aus dem Code)

- **Entdecker:** Die festen Fallen sind „Die Eisenbahn“ und „Das Telefon“. Die Auflösung muss also zeigen, warum nicht das Telefon.
- **Profi und Experte** (Experte spielt in den Welt-Spielen Profi): Drei Fallen kommen aus den fünf zeitlich nächsten Erfindungen: 3D-Druck, Internet, Satellit, Transistor, Computer. **„Der Computer“ steht damit in 3 von 5 Profi-Runden mit dem Smartphone daneben. Das Telefon kommt auf Profi nie vor.**
- Andersherum taucht das Smartphone nie als Falle bei Computer, Transistor, Telefon oder Internet auf. Beim Internet ist es durch `ausschluss` ersetzt. Die Auflösung kann in derselben Runde also keine Lösung **verraten**. Sie kann sie höchstens doppeln oder verwischen.

## Antwort auf die Frage der Kinder-Redaktion: Ist „Rechner“ zu nah an „Der Computer“?

**Ja, auf Profi.**
1. **Die Seite benutzt „Rechner“ selbst als Wort für Computer.** Auf der Computer-Karte steht „Frühe elektronische Rechner füllten große Räume“, auf der Internet-Karte „Das ARPANET verband 1969 erste Rechner“. „Das Smartphone hat innen einen winzigen Rechner“ heißt also auf derselben Seite: „Im Smartphone steckt ein Computer.“
2. **Auf Profi steht „Der Computer“ oft als Falle daneben.** Kinder ab 8 kennen „Rechner“ als Computer. Hat ein Kind erst „Der Computer“ getippt und dann beim zweiten Versuch das Smartphone gefunden, liest es nach „Richtig!“: winziger Rechner. Die Frage „War der Computer also doch richtig?“ liegt nahe. Der dritte Satz („Unterwegs … Funkwellen“) gibt den Unterschied zwar her, sagt aber nicht ausdrücklich, dass der Rechner allein nicht reicht.
3. **Es widerspricht dem Sinn der harten Grenze.** Sie soll verhindern, dass die Auflösung andere Erfindungen nennt. Ein Synonym umgeht nur das Prüfskript.
4. **Auf Entdecker ist es unschädlich.** Dort steht der Computer nie zur Wahl, und Kleine denken bei „Rechner“ eher an rechnen oder einen Taschenrechner.

**Lösung:** Das Verb „rechnet“ statt des Geräts „Rechner“ (Fassung E). Damit gibt es keinen Kartoffelchip und keine Computer-Falle. Der Gedanke bleibt gleich.

## Prüfung der drei Fragen je Fassung

| Fassung | (1) Warum nicht Telefon (Entdecker) / Computer (Profi)? | (2) Verraten oder verwischen | (3) Kleine / Große |
|---|---|---|---|
| Heute | Nein / nein. Nur Stimme über Funk, das kann ein Handy auch. | Verwischt das Telefon, denn sie erklärt das Smartphone wie ein Telefon. | Kleine: gut. Große: nichts Neues zur Aufgabe. |
| A | Ja (Fotos werden auch zu Zahlen) / halb (Funk ja, „unterwegs“ fehlt). | Gewollter Gegensatz zur Telefon-Auflösung (elektrisches Signal gegen Zahlen). | Kleine: „Chip“ und „Zahlenreihen“ sind schwer. Große: echter Gedanke. |
| B | Ja, aber unverbunden / schwach. | **Doppelt die Computer-Auflösung** („Schritte … nacheinander“). | Große: Aufzählung. Ich rate ab. |
| C | Ja / ja („unterwegs“), der Funk bleibt aber ohne Wie. | „Schalter“ ist eine echte Verbindung zum Transistor, verrät nichts. | „Milliarden“ ist nicht belegt. Ich rate ab. |
| D (Redaktion) | Ja (Fotos, Spiele) / Funk und „unterwegs“ ja, aber „Rechner“ zieht zum Computer. | **Verwischt auf Profi den Computer** (siehe oben). | Kleine: sehr gut („lauter Zahlen“, Spiele). Große: echter Gedanke. |
| E | Ja / ja („unterwegs“ und Funkmast; rechnen ist eine Tätigkeit, kein zweites Gerät). | Gegensatz zum Telefon bleibt. Keine Doppelung mit Computer oder Transistor. | Kleine: kurz und vorlesbar. Große: Telefonieren ist für das Smartphone Rechnen mit Zahlen. |

Erkenntnisgewinn für Große (A, D, E): Der Satz „Für das Gerät ist deine Stimme nur Zahlen“ steht nirgends auf der Karte. Man findet ihn also nicht einfach wieder. Mit der Telefon-Auflösung („Stimme → elektrisches Signal“) entsteht ein Vergleich von früher und heute.

## Befunde

1. `app/world-game-support.mjs`, `TECHNIK_AUFLOESUNG['invention-smartphone']`: Die heutige Fassung deckt nur die halbe Aufgabe ab. Vorschlag: Fassung E.
2. Fassung D, Wort „Rechner“: Es ist auf Profi zu nah an der Falle „Der Computer“, und die Seite selbst benutzt es als Synonym. Vorschlag: „Das Smartphone rechnet innen blitzschnell.“
3. Fassungen D und E, für den `fakten-pruefer`: „tragen Funkwellen die Zahlen“ klingt so, als würden Fotos und Spiele immer gesendet. Hält er das für zu ungenau, gibt es diese Fassung (170 Zeichen, Sätze mit 5, 9 und 10 Wörtern): „… Unterwegs tragen Funkwellen deine Stimme als Zahlen zu einem Funkmast.“ Dabei fällt „in der Nähe“ weg.
4. Fassung B: Sie doppelt die Computer-Auflösung. Fassung C: Die Zahl ist nicht belegt. Beide lieber nicht nehmen.

## Lücken

Im Technik-Detektiv gibt es keine Experten-Aufgaben (E3 in `app/world-game-runde.ts`). Passen würde ein Vergleich nach S5, der zwei Tatsachen verbindet: Telefon („Stimme → elektrisches Signal“) gegen Smartphone („Stimme → Zahlen“). Das ist ein Punkt fürs BACKLOG, nicht für diese Auflösung.

## Unsicher

- Ob ein Kind auf Profi nach „Rechner“ wirklich denkt „dann war es doch der Computer“, ist meine Einschätzung aus der Fallenliste. Belegen kann das nur die Rückmeldung echter Kinder.
- Ob 5- bis 7-Jährige „deine Stimme ist lauter Zahlen“ als Wunder erleben oder als unverständlich empfinden, ebenso.
- Ton und Wortwahl entscheidet die Kinder-Redaktion, die fachliche Vereinfachung prüft der Fakten-Prüfer.
