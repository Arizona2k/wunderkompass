# Stufen-Prüfung: Smartphone-Auflösung (25.11.2026)

Helfer: `stufen-pruefer` (opus / high), prüft den [Entwurf](2026-11-25-technik-aufloesung-smartphone-entwurf.md). Sein Gegenvorschlag heißt im Bericht „D“; in der Entscheidung heißt er „E“, weil die [Kinder-Redaktion](2026-11-25-technik-aufloesung-smartphone-kinderredaktion.md) gleichzeitig eine andere Fassung „D“ vorschlug. Entscheidung: [Nachtrag, Abschnitt 7](2026-11-25-technik-aufloesung-nachtrag-entwurf.md#7-entscheidungen).

Ich habe nur gelesen und nichts geändert. Grundlage: `docs/entwurf/2026-11-25-technik-aufloesung-smartphone-entwurf.md`, mein früherer Befund `docs/entwurf/2026-11-25-technik-aufloesung-nachtrag-stufen-schluss.md`, `app/world-game-bank.ts`, `app/world-game-runde.ts`, `app/world-game-support.mjs` (`TECHNIK_AUFLOESUNG`), `app/world-game-fallen.json` und `app/world-catalog.json` (Karte `invention-smartphone`).

## Gesamteindruck

**Empfehlung: Fassung A, mit einer kleinen Änderung (Fassung D unten).** Nur A verbindet beide Teile der Aufgabe in einer Kette, und Große lernen dabei etwas Neues: Das Smartphone telefoniert, indem es rechnet. B wiederholt fast wörtlich die Auflösung beim Computer. C stützt sich auf eine Zahl ohne Beleg und erklärt den Funk nur vage. Die heutige Fassung erklärt weiterhin nur das Telefonieren.

## Wichtig für die Bewertung: Welche Fallen stehen wirklich neben dem Smartphone?

Ich habe das aus dem Code abgeleitet.
- **Entdecker:** Die festen Fallen sind „Die Eisenbahn“ und „Das Telefon“. Hier muss die Auflösung also zeigen, warum nicht das Telefon.
- **Profi und Experte** (Experte spielt in den Welt-Spielen Profi): Die drei Fallen kommen aus den fünf Erfindungen, die zeitlich am nächsten liegen: 3D-Druck, Internet, Satellit, Transistor, Computer. **Das Telefon kommt auf Profi nie vor.** Hier muss die Auflösung zeigen, warum nicht der Computer.
- Andersherum taucht das Smartphone nie als Falle bei Computer, Transistor, Telefon oder Internet auf. Beim Internet ist es durch `ausschluss` auch auf Entdecker ersetzt. Die Smartphone-Auflösung kann darum in derselben Runde keine Lösung **verraten**. Sie kann sie höchstens **doppeln oder verwischen**.

## Frage 1: Warum das Smartphone und nicht Telefon oder Computer?

| Fassung | Warum nicht Telefon? (Entdecker) | Warum nicht Computer? (Profi) | Urteil |
|---|---|---|---|
| Heute | Nein. Sie erklärt nur Stimme über Funk, das kann ein Handy auch. | Nein. Die Hälfte „Informationen bearbeiten“ fehlt. | deckt nur die halbe Aufgabe |
| A | Ja. Der Chip rechnet, und auch Fotos werden zu Zahlen, das ist mehr als Sprechen. | Halb. Funk zum Mast zeigt „unterwegs“, aber das Wort „unterwegs“ aus der Aufgabe fehlt. | gut |
| B | Ja, aber die Teile stehen unverbunden nebeneinander. | Schwach. Der Chip-Satz ist fast die Computer-Auflösung, der Unterschied geht unter. | schwach |
| C | Ja (tippen, wischen). | Ja, sie sagt als einzige „unterwegs“. Der Funk wird aber nur zu „bleibt verbunden“ und erklärt kein Wie. | mittel |

## Frage 2: Verraten oder verwischen andere Auflösungen

- **B** sagt „folgt den Schritten …, blitzschnell nacheinander“, beim Computer steht „Liste genauer Schritte … sehr schnell nacheinander ab“. Das verrät nichts, weil keine der beiden Erfindungen bei der anderen als Falle steht. Kommen beide in einer Runde (Profi spielt 8 von 24 Aufgaben), liest das Kind aber zweimal fast dasselbe. Das bringt keine neue Erkenntnis und verwischt, was das Smartphone besonders macht. **Befund.**
- **C** sagt „Milliarden winziger Schalter“, beim Transistor steht „ist ein Schalter“. Auch das verrät nichts, die Verbindung ist fachlich echt. Ohne gute Quelle für „Milliarden“ (siehe Entwurf) darf C aber nicht kommen.
- **A** sagt „Stimme → Zahlenreihen“, beim Telefon steht „Stimme → elektrisches Signal“. Das ist ein **gewollter, echter Gegensatz** (früher ein elektrisches Signal, heute Zahlen) und für Große der eigentliche Gewinn, wenn beide in einer Runde kommen. „Rechnet“ klingt nach „Große Rechnungen“ in der Computer-Aufgabe. Das ist unschädlich: Dort steht das Smartphone nie zur Wahl, und die Verbindung stimmt.
- **Heute:** Die Fassung verwischt das Telefon, denn sie erklärt das Smartphone genau so, wie man das Telefon erklären würde.

## Frage 3: Tragfähig für Kleine, Gewinn für Große?

- **Entdecker:** A lässt sich vorlesen. Chip, der rechnet, aus Stimme werden Zahlen, Funkwellen zum Mast: Das sind drei klare Bilder. „Zahlenreihen“ ist für 6-Jährige unnötig schwer und erinnert an den Zahlenstrahl aus der Schule. „Zahlen“ reicht. Ob „Chip“ an Kartoffelchips denken lässt, entscheidet die Kinder-Redaktion.
- **Große (10 bis 12):** A und D bieten einen echten Gedanken: Telefonieren ist beim Smartphone Rechnen, Stimme und Fotos sind dort nur Zahlen. Das steht so nirgends auf der Karte, man findet es also nicht einfach wieder. Mit der Telefon-Auflösung ergibt sich dazu der Vergleich früher und heute. B und C bleiben bei Aufzählungen.

## Gegenvorschlag D (Fassung A, angepasst)

„Das Smartphone hat einen winzigen Chip, der blitzschnell rechnet. Er macht aus deiner Stimme und deinen Fotos Zahlen. Unterwegs tragen Funkwellen sie zu einem Mast in der Nähe.“

- 176 Zeichen, Sätze mit 9, 9 und 10 Wörtern, keine Ziffer. Ich habe den Wortanfang gegen alle 24 Namen der Erfindungskarten geprüft, dazu „telefon“, „automat“, „licht“, „kamera“ und „druck“: Es gibt keinen Treffer außer „Smartphone“ selbst.
- Das sind die Unterschiede zu A:
  - „lange Zahlenreihen“ wird zu „Zahlen“, das ist leichter für Entdecker.
  - „Unterwegs“ greift das Schlüsselwort der Aufgabe auf und zeigt auf Profi, warum es nicht der Computer ist.
- „Ein Mast in der Nähe“ bleibt, so wie früher entschieden.

## Befunde

1. `app/world-game-support.mjs`, `TECHNIK_AUFLOESUNG['invention-smartphone']`: Die heutige Fassung deckt nur das Telefonieren ab und erklärt auf Entdecker nicht, warum es nicht das Telefon ist. Vorschlag: Fassung D.
2. Fassung B: Sie doppelt die Computer-Auflösung. Ich rate ab.
3. Fassung C: „Milliarden“ ist nicht belegt, und der Funk bleibt ohne Wie. Ich rate ab.
4. Fassung A und D, für den `fakten-pruefer`: „sie“ bezieht sich auch auf die Fotos. Das klingt, als würden Fotos immer gesendet, dabei geht das nur beim Verschicken. Ich halte das für eine zulässige Vereinfachung. Wird sie abgelehnt, dann ohne Fotos: „… Er macht aus deiner Stimme Zahlen. …“. Damit ginge aber das Zeichen für „mehr als Telefonieren“ verloren. Ich würde die Fotos behalten.

## Lücken

Der Technik-Detektiv hat keine Experten-Aufgaben, Experte spielt Profi (E3 in `app/world-game-runde.ts`). Gut passen würde hier eine Aufgabe aus S5, bei der man zwei Tatsachen verbindet, etwa: „Was können Smartphone und Telefon beide, aber nur eins davon rechnet dabei mit Zahlen?“, oder ein Vergleich, der „Stimme → elektrisches Signal“ dem Satz „Stimme → Zahlen“ gegenüberstellt. Das gehört nicht in diese Auflösung, sondern ins BACKLOG.

## Unsicher

- Ob 5- bis 7-Jährige „aus deiner Stimme werden Zahlen“ als spannendes Wunder erleben oder als unverständlich empfinden, kann nur die Rückmeldung echter Kinder klären.
- „Chip“ und „Funkwellen“ sind Sache der Kinder-Redaktion.
- Fachliche Richtigkeit, etwa das Zuschreiben der Umwandlung an einen einzigen Chip, prüft der Fakten-Prüfer.
