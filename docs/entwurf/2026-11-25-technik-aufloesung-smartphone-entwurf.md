# Smartphone-Auflösung: drei neue Fassungen (25.11.2026)

Helfer: `karten-autor` (opus / high). Anlass: Stufen-Prüfung (Schlussrunde Nachtrag) und Spieltest-Nachprüfung (Soll 2) fanden, dass die Auflösung nur das Telefonieren erklärt. Entscheidung: [Nachtrag, Abschnitt 7](2026-11-25-technik-aufloesung-nachtrag-entwurf.md#7-entscheidungen).

Ich empfehle **Fassung A**. Alle drei Fassungen bestehen das Prüfskript. Geändert habe ich nichts. Geprüft hat sie noch niemand: Faktenprüfung, Kinder-Redaktion und Stufen-Prüfung stehen aus.

**Ausgabe von pruef.cjs** (das Skript prüft nur Teilstrings):
```
invention-smartphone-A | 178 Zeichen | 9/10/9 | Zahlen 0 | max. Wortüberlappung 0.22 | ok
invention-smartphone-B | 176 Zeichen | 11/5/8 | Zahlen 0 | max. Wortüberlappung 0.20 | ok
invention-smartphone-C | 176 Zeichen | 9/7/10 | Zahlen 0 | max. Wortüberlappung 0.22 | ok
```
Zusätzlich habe ich den Wortanfang geprüft (Regex `(^|[^\p{L}])Name`, ohne Unterscheidung von Groß- und Kleinschreibung) gegen alle 26 Namen im Auftrag: In keiner Fassung gibt es einen Treffer. Keine Fassung enthält „telefonieren“, „automatisch“, „Computer“, „Licht“, „Transistor“ oder „Kamera“. Die Wörter „Chip“, „Zahlenreihe“ und „Funkmast“ stehen nirgends auf der Smartphone-Karte, es gibt also keine Dopplung.

### Fassung A (empfohlen), 178 Zeichen
„Das Smartphone hat einen winzigen Chip, der blitzschnell rechnet. Er macht aus deiner Stimme und deinen Fotos lange Zahlenreihen. Funkwellen tragen sie zu einem Mast in der Nähe.“

- **Was sie besser macht:** Beide Teile der Aufgabe hängen in einer einzigen Kette zusammen. Der Chip bearbeitet die Informationen (Stimme, Fotos), und der Funk trägt sie fort. Das Kind sieht so, was das Smartphone vom Handy unterscheidet.
- **Was sie schlechter macht:** Der Wechsel zum nächsten Mast fällt weg. „Zahlenreihen“ ist für 5-Jährige abstrakt, auch wenn das Bild klar ist.
- **Quellen:**
  - Stimme wird zu Zahlen und per Funk übertragen: BfS-Unterrichtsmaterial Mobilfunk (Archiv), „Bei der Mobilfunktechnologie werden digitalisierte Informationen wie Sprache … mittels hochfrequenter elektromagnetischer Felder übertragen“, https://archiv.bge.de/archiv/www.asse.bund.de/SharedDocs/Downloads/BfS/DE/broschueren/unterricht-mobilfunk/mobilfunk-unterricht1e808.pdf (vom fakten-pruefer am 25.11. schon geprüft).
  - Mast in der Nähe: dieselbe Quelle, außerdem BAFU, „Mobil telefonieren – wie funktioniert das?“: „Zu jeder Zelle gehört eine Antenne“, https://www.bafu.admin.ch/de/mobil-telefonieren-wie-funktioniert-das
  - Chip rechnet, Telefon und Rechner in einem Gerät: Computer History Museum, Simon („combining mobile phone, personal organizer …“), https://www.computerhistory.org/revolution/artifact/1733. Dazu das Bauteil „Prozessor – Verarbeitet die Anweisungen“ auf der Karte.
- ⚠ **Bitte prüfen:**
  - „Er macht aus deiner Stimme … Zahlenreihen“ schreibt das Umwandeln dem einen Chip zu. Tatsächlich arbeiten ein Wandler und ein Codec mit, meist auf demselben System-on-a-Chip. Ich halte das für eine zulässige Vereinfachung.
  - Fotos werden nur dann per Funk übertragen, wenn man sie verschickt. Der Satz klingt so, als gingen sie immer weg.

### Fassung B, 176 Zeichen
„Das Smartphone schickt deine Stimme als unsichtbare Funkwellen zu einem Funkmast. Innen arbeitet ein winziger Chip. Er folgt den Schritten einer App, blitzschnell nacheinander.“

- **Was sie besser macht:** Den Funkteil hält sie nah an der heutigen, schon geprüften Fassung, und „App“ kennen Kinder. **Was sie schlechter macht:** Die beiden Teile stehen unverbunden nebeneinander. Der Chip-Satz ähnelt stark der Auflösung beim Computer („Liste genauer Schritte … nacheinander“).
- **Quellen:** Funk zum Mast wie bei A (BfS, BAFU). Chip folgt Programmen: Computer History Museum (Simon, s. o.) und die Karte selbst („Programme ausführen“, „Verarbeitet die Anweisungen“).
- ⚠ **Bitte prüfen:** „App“ steht nicht in `app/kern/woerter.ts`. Die Kinder-Redaktion sollte das Wort prüfen.

### Fassung C, 176 Zeichen
„Das Smartphone hat einen Chip mit Milliarden winziger Schalter. Er rechnet, sobald du tippst oder wischst. Über Funkwellen und Masten bleibt es unterwegs mit anderen verbunden.“

- **Was sie besser macht:** Tippen und Wischen ist ein konkretes Beispiel aus dem Alltag der Kinder. Die „Schalter“ greifen die Transistor-Auflösung auf. **Was sie schlechter macht:** Der Funkteil wird zu einem vagen „bleibt verbunden“, ohne Wie. „Milliarden“ ist eine Zahl, die man belegen muss.
- **Quellen:** Funk und Masten wie bei A (BfS, BAFU).
- ⚠ **Milliarden Schalter:** Ich habe keine neutrale Quelle gefunden. Britannica sperrt den Abruf (403). Gefunden habe ich nur Hersteller- und Technikseiten: Apple A17 Pro mit etwa 19 Milliarden laut Herstellerangabe, außerdem pcwelt.de, teltarif.de und bild der wissenschaft (https://www.wissenschaft.de/technik-digitales/totgesagte-leben-laenger/). Ohne gute Quelle sollte C nicht kommen.

### Empfehlung
Ich empfehle **A**. Nur A erklärt in einem Zug das „Wie“ beider Teile: Rechnen macht Informationen zu Zahlen, Funk trägt sie fort. Die heutige Fassung sehe ich nicht als besser, weil sie den zweiten Teil der Aufgabe weglässt. Ihren schönen Mast-Wechsel könnte man unter „Mehr erfahren“ auf der Karte retten.

### Umformuliert
Keine. Die Auflösung ist keine gespeicherte Antwort.

### Offen
1. **„Zahlenreihen“:** Die Kinder-Redaktion soll entscheiden, ob das Wort für 5- bis 7-Jährige trägt. Die Alternative „Nullen und Einsen“ ist anschaulicher, aber länger und braucht dann eine Kürzung an anderer Stelle.
2. **Mast in der Nähe:** In A steht „zu einem Mast in der Nähe“ statt „zum nächsten Mast“. Das Gerät nutzt nicht immer den Mast, der räumlich am nächsten steht. Das liegt auf der Linie der früheren Entscheidung („Ein Funkmast in der Nähe“).
