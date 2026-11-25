# Faktenprüfung: Smartphone-Auflösung (25.11.2026)

Helfer: `fakten-pruefer` (opus / high), prüft den [Entwurf](2026-11-25-technik-aufloesung-smartphone-entwurf.md) und die Fassung D der [Kinder-Redaktion](2026-11-25-technik-aufloesung-smartphone-kinderredaktion.md). Entscheidung: [Nachtrag, Abschnitt 7](2026-11-25-technik-aufloesung-nachtrag-entwurf.md#7-entscheidungen).

Geprüft habe ich `docs/entwurf/2026-11-25-technik-aufloesung-smartphone-entwurf.md`, Fassung D aus der Nachricht des Koordinators und die Karte `invention-smartphone` in `app/world-catalog.json`. Die Quellen unten habe ich selbst geöffnet, außer wo es anders steht. Dateien habe ich nicht geändert.

**Ergebnis:** Keine Fassung ist sachlich falsch. A und D wirken aber so, als würden Fotos (bei D auch Spiele) immer gefunkt. C hat für „Milliarden“ beim Smartphone nur eine schwache Quellenlage. Mit einer kleinen Änderung ist D fachlich am saubersten.

---

### Zu den Einzelfragen

**(1) „Ein Chip macht aus der Stimme Zahlenreihen“: zulässig, mit Einschränkung**
- Die Stimme wird tatsächlich digitalisiert. BfS-Unterrichtsmaterial (Archiv), Glossar „Funksignal“, https://archiv.bge.de/archiv/www.asse.bund.de/SharedDocs/Downloads/BfS/DE/broschueren/unterricht-mobilfunk/mobilfunk-unterricht1e808.pdf: „Frequenz oder Amplitude der elektromagnetischen Welle werden z.B. in Abhängigkeit von der vom Handymikrofon aufgenommenen digitalisierten Sprachinformation verändert (moduliert).“
- **Hier irrt der Entwurf:** Er schreibt, Wandler und Codec säßen „meist auf demselben System-on-a-Chip“. Das trifft so nicht zu. Heutige Handy-Mikrofone (MEMS-Mikrofone) wandeln oft schon selbst in Zahlen um, mit einem eigenen kleinen Schaltkreis im Mikrofon-Gehäuse. Beleg: Malcovati & Baschirotto, „The Evolution of Integrated Interfaces for MEMS Microphones“, Micromachines 9 (2018) 323, doi:10.3390/mi9070323 (Volltext über Europe PMC): „The interface circuit for a MEMS microphone has to read-out the electrical signal … and convert it in the digital domain. Digital output is, indeed, a must for MEMS microphones“. Das Komprimieren und das Funken übernehmen danach andere Teile.
- **Urteil:** Wer schreibt, der *rechnende Chip* mache aus der Stimme Zahlen, verkürzt die Sache. Eine schädliche Fehlvorstellung entsteht daraus kaum. Genauer und ebenso kindgerecht ist „Für ihn sind … Zahlen“ (so in D): Der Prozessor verarbeitet alles als Zahlen, egal wer es umgewandelt hat.

**(2) Klingt A so, als würden Fotos immer gefunkt? Ja.**
- In A bezieht sich „Funkwellen tragen sie“ auf die Zahlenreihen von Stimme *und Fotos*. Fotos gehen aber nur weg, wenn man sie verschickt.
- „deine Stimme und deine Nachrichten“ ist sachlich besser und direkt belegt. BfS, gleiche Stelle: „Es überträgt die Nachrichten einer SMS, eines Handytelefonates oder Informationen aus dem Internet in verschlüsselter Form.“
- Kleine Restungenauigkeit: Zu Hause gehen Nachrichten oft über WLAN zum Router statt zu einem Mast. Weil die Aufgabe „unterwegs“ sagt, ist das in Ordnung.

**(3) „Milliarden Schalter“ (C): neutrale Quelle nur allgemein, nicht fürs Smartphone**
- Für „Schalter“ gibt es einen neutralen Beleg. bild der wissenschaft, https://www.wissenschaft.de/technik-digitales/totgesagte-leben-laenger/: „Ein Transistor ist ein Schalter.“
- Für „Milliarden“ gibt es nur einen allgemeinen Museumsbeleg. Computer History Museum, The Silicon Engine, https://www.computerhistory.org/siliconengine/: „billions of transistors per chip on today's microprocessor and memory devices“. Das Smartphone wird dabei nicht eigens genannt.
- Zahlen für Smartphone-Chips fand ich nur in Technik-Presse und bei Herstellern, etwa Apple A17 Pro mit 19 Milliarden. Selbst bestätigen konnte ich die Zahl nicht: Die Apple-Pressemitteilung zum iPhone 15 Pro nennt keine Transistorzahl, und der TechCrunch-Link führte zu einem anderen Artikel.
- Ob auch einfache oder ältere Handys Milliarden Schalter haben, ist nicht belegt.
- Hinzu kommt: „Er rechnet, sobald du tippst oder wischst“ kann klingen, als rechne der Chip nur dann. Er arbeitet aber auch im Hintergrund, etwa wenn ein Anruf ankommt.
- **C fällt** (nicht falsch, aber nicht ausreichend belegt), wie schon der Entwurf vorschlägt.

**(4) Tragen die genannten Quellen?**
- **BfS-Archiv:** gut. Behörde, Unterrichtsmaterial, belegt Digitalisierung, Funk, Basisstation und Funkzelle. Die Fundstelle „digitalisierte Informationen wie Sprache, Bilder …“ ist richtig zitiert.
- **BAFU:** gut, aber nur für den Mast. „Zu jeder Zelle gehört eine Antenne …, die via Funk Verbindung zu den Mobiltelefonen in ihrer näheren Umgebung herstellt.“ Für Chip und Zahlen sagt die Seite nichts.
- **Computer History Museum, Simon (artifact/1733):** belegt nur „first smartphone, combining mobile phone, personal organizer, fax, and pager“. Für „Chip rechnet“ oder „Zahlen“ trägt die Seite **nicht**; der Entwurf überdehnt sie.
  - Besser für „im Smartphone steckt ein Rechner mit Prozessor“: bild der wissenschaft (s. o.): „Solche Prozessoren … stecken in PCs, Notebooks, Smartphones“ und „dank mobiler Endgeräte wie Handys und Tablets [nutzen] die meisten gleich mehrere Computer“.
  - Für Fotos als Zahlen: Nobelprize.org, Physik 2009, https://www.nobelprize.org/prizes/physics/2009/popular-information/: „translated into digital ones and zeros“ (schon in der früheren Prüfung belegt).

---

### Die Fassungen

**Heutige Fassung** „Das Smartphone verwandelt deine Stimme in unsichtbare Funkwellen, wie beim Radio. Ein Funkmast in der Nähe fängt sie auf. Wenn du weit weggehst, übernimmt der nächste Mast.“
- **Urteil: vereinfacht, aber zulässig** (früher geprüft, BfS und Sächsisches Umweltministerium).
- Schwäche: Sie erklärt nur den Funk, nicht das „Informationen bearbeiten“. Das ist eine Lücke, kein Fehler.

**A** „… winzigen Chip, der blitzschnell rechnet. Er macht aus deiner Stimme und deinen Fotos lange Zahlenreihen. Funkwellen tragen sie zu einem Mast in der Nähe.“
- **Urteil: vereinfacht, aber zulässig, mit Änderung.**
- Das Umwandeln wird dem Rechen-Chip zugeschrieben (siehe 1), und die Fotos klingen, als würden sie immer gefunkt (siehe 2).
- Vorschlag (170 Zeichen, 9/9/9 Wörter, keine Ziffer): „Das Smartphone hat einen winzigen Chip, der blitzschnell rechnet. Für ihn sind deine Stimme und deine Nachrichten Zahlen. Funkwellen tragen sie zu einem Mast in der Nähe.“
- Näher am Entwurf, mit „Zahlenreihen“ (178 Zeichen, 9/9/9): „… Er macht aus deiner Stimme und deinen Nachrichten Zahlenreihen. …“ (Punkt 1 bleibt dann bestehen, ist aber vertretbar.)

**B** „… schickt deine Stimme als unsichtbare Funkwellen zu einem Funkmast. Innen arbeitet ein winziger Chip. Er folgt den Schritten einer App, blitzschnell nacheinander.“
- **Urteil: vereinfacht, aber zulässig.**
- „nacheinander“ unterschlägt, dass heutige Chips mehrere Kerne haben und vieles gleichzeitig tun. Für dieses Alter ist das in Ordnung; dieselbe Verkürzung steht schon in der geprüften Computer-Auflösung.
- Der Funkteil entspricht der geprüften Fassung. Fachlich gibt es keine Einwände, nur die Schwäche, dass beide Teile unverbunden nebeneinanderstehen.

**C** „… Chip mit Milliarden winziger Schalter. Er rechnet, sobald du tippst oder wischst. Über Funkwellen und Masten bleibt es unterwegs mit anderen verbunden.“
- **Urteil: nicht ausreichend belegt** (siehe 3). Nicht nehmen.

**D (Kinder-Redaktion)** „Das Smartphone hat innen einen winzigen Rechner. Für ihn sind Fotos, Spiele und deine Stimme lauter Zahlen. Unterwegs tragen Funkwellen die Zahlen zu einem Funkmast in der Nähe.“
- **„winziger Rechner“ für Prozessor und Speicher zusammen: zulässig.**
  - „Rechner“ ist das deutsche Wort für Computer, und die Karte selbst sagt „Telefon und kleiner Computer“.
  - bild der wissenschaft (s. o.) nennt Handys ausdrücklich Computer.
  - „winzig“ passt für den Chip-Stapel aus Prozessor und Speicher; das ganze Innenleben ist größer, aber das behauptet der Satz nicht.
- **„Für ihn sind … lauter Zahlen“: richtig und genauer als A.**
  - Der Satz sagt, wie der Rechner Dinge behandelt, nicht, wer sie umwandelt.
  - Stimme: BfS „digitalisierte Sprachinformation“. Fotos: Nobelprize.org „digital ones and zeros“. Spiele sind Programme und Daten, also ebenfalls Zahlen.
- **Satz 3: Ja, er klingt so, als gingen alle Zahlen immer weg**, also auch Fotos und Spiele. „die Zahlen“ greift alle drei Dinge aus Satz 2 auf. Spiele laufen meist auf dem Gerät selbst; nur Online-Spiele schicken Daten.
- Vorschlag (169 Zeichen, 7/10/10 Wörter, keine Ziffer, kein gesperrter Wortanfang): „Das Smartphone hat innen einen winzigen Rechner. Für ihn sind Fotos, Spiele und deine Stimme lauter Zahlen. Funkwellen tragen deine Stimme zu einem Funkmast in der Nähe.“
- Ob „Stimme“ zweimal stört, soll die `kinder-redaktion` entscheiden. Fachlich ist der Satz so eindeutig.

---

### Gesamtempfehlung (heutige Fassung, A, D)
1. **D mit geändertem Satz 3** (Vorschlag oben). Fachlich am saubersten: Der Satz macht keine falsche Aussage darüber, wer umwandelt, er deckt beide Teile der Aufgabe ab, und gefunkt wird nur, was wirklich gefunkt wird.
2. **A mit „Stimme und Nachrichten“** ist ebenfalls vertretbar.
3. **Heutige Fassung:** richtig, beantwortet aber nur die Hälfte der Aufgabe. Den Wechsel zum nächsten Mast könnte man unter „Mehr erfahren“ retten (Beleg Sachsen, früher geprüft).
- D unverändert und A unverändert empfehle ich wegen der Funk-Fehlvorstellung nicht.

### Quellenlage
- **Gut:** BfS-Archiv, BAFU, Nobelprize.org, Micromachines-Übersicht (Fachzeitschrift), Computer History Museum (Silicon Engine, nur allgemein), bild der wissenschaft.
- **Zu schwach für die zugewiesene Aussage:** CHM-Simon-Seite für „Chip rechnet“. Ersetzen durch bild der wissenschaft.
- Hersteller- und Technikpresse (pcwelt, teltarif, phonearena, TechCrunch) eignen sich nicht als Endbeleg.

### Nicht geprüft
- Transistorzahlen einzelner Smartphone-Chips: Apple-Pressemitteilungen 2018 bis 2023 nennen keine, und der TechCrunch-Link führte auf einen anderen Artikel.
- Gesperrt waren: Argonne National Laboratory (403), Spektrum.de (403), PubMed Central (reCAPTCHA; den Volltext habe ich über Europe PMC gelesen).
- Ob Spiele, Fotos und Nachrichten unterwegs über Mobilfunk oder WLAN gehen, hängt vom Einzelfall ab; das habe ich nicht weiter vertieft.
- Wortwahl („Zahlenreihen“, „Rechner“, doppelte „Stimme“) und Ratemuster sind Sache von `kinder-redaktion` und `stufen-pruefer`.

## Nachtrag: Fassung E

Dieser Nachtrag ergänzt meinen Bericht zu den Fassungen A bis D; die Belege dort gelten weiter. Für E brauchte es keine neue Quelle; geändert habe ich nichts.

**Fassung E** „Das Smartphone rechnet innen blitzschnell. Fotos, Spiele und deine Stimme sind darin lauter Zahlen. Unterwegs tragen Funkwellen die Zahlen zu einem Funkmast in der Nähe.“

- **Satz 1, „rechnet innen blitzschnell“: richtig.** Im Smartphone arbeiten Prozessoren. bild der wissenschaft, https://www.wissenschaft.de/technik-digitales/totgesagte-leben-laenger/: „Solche Prozessoren … stecken in PCs, Notebooks, Smartphones“. Dass „Rechner“ wegfällt, ändert fachlich nichts.
- **Satz 2, „sind darin lauter Zahlen“: richtig.** Er ist so genau wie D und sagt nicht, welcher Teil umwandelt.
  - Stimme: BfS-Archiv, „digitalisierte Sprachinformation“.
  - Fotos: Nobelprize.org 2009, „digital ones and zeros“.
  - Spiele sind Programme und Daten, also ebenfalls Zahlen.
  - Die Stimme wird nicht gespeichert, ist aber während des Gesprächs im Gerät tatsächlich Zahlen. Das passt.
- **Satz 3: Ja, er klingt so, als würden Fotos und Spiele immer gefunkt.** „die Zahlen“ greift alle drei Dinge aus Satz 2 auf. Es ist derselbe Mangel wie bei D. Fotos gehen nur beim Verschicken weg, und Spiele laufen meist auf dem Gerät selbst.
- **Ausweichsatz** „Unterwegs tragen Funkwellen deine Stimme als Zahlen zu einem Funkmast.“: **vereinfacht, aber zulässig.**
  - BfS, Glossar „Funksignal“: Die Welle wird „in Abhängigkeit von der vom Handymikrofon aufgenommenen digitalisierten Sprachinformation verändert (moduliert)“.
  - Streng genommen tragen die Wellen keine Zahlen, sondern werden nach den Zahlen verändert. „tragen … als Zahlen“ ist für dieses Alter eine gute Verkürzung.
  - Dass „in der Nähe“ fehlt, ist fachlich kein Fehler.
- **E mit Ausweichsatz** „Das Smartphone rechnet innen blitzschnell. Fotos, Spiele und deine Stimme sind darin lauter Zahlen. Unterwegs tragen Funkwellen deine Stimme als Zahlen zu einem Funkmast.“
  - Nachgezählt: 170 Zeichen, 5/9/10 Wörter, keine Ziffer. Einen Wortanfang mit dem Namen einer anderen Erfindung finde ich nicht.
  - Gleichwertig, falls „Zahlen … Zahlen“ stört (171 Zeichen, 5/9/11 Wörter): „… Unterwegs tragen Funkwellen deine Stimme zu einem Funkmast in der Nähe.“ Die Wahl soll die `kinder-redaktion` treffen.

### Aktualisierte Gesamtempfehlung (heutige Fassung, A, D, E)
1. **E mit Ausweichsatz** oder **D mit geändertem Satz 3**. Beide sind fachlich gleich gut: richtig, beide Teile der Aufgabe abgedeckt, gefunkt wird nur die Stimme. E vermeidet zusätzlich den Konflikt mit „Rechner“ als Wort für Computer, deshalb lege ich mich leicht auf **E mit Ausweichsatz** fest.
2. **A mit „deine Stimme und deine Nachrichten“** (siehe Hauptbericht) ist vertretbar.
3. **Heutige Fassung:** richtig, beantwortet aber nur die Hälfte der Aufgabe.
- **Nicht nehmen:** A, D und E jeweils unverändert, denn alle drei erwecken den Eindruck, Fotos (und Spiele) würden immer gefunkt. C bleibt mangels Beleg für „Milliarden“ draußen.

### Nicht geprüft
Für E habe ich keine neue Quelle geöffnet. Das Urteil stützt sich auf die im Hauptbericht geöffneten Quellen (BfS-Archiv, Nobelprize.org, bild der wissenschaft).
