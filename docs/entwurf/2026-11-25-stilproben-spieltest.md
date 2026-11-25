# Spieltest der Stilproben A und B

Helfer: `spieltester` (sonnet/high), 25.11.2026. Statische Muster, kein Kindertest. Bilder in `.qa-output/stilproben/spieltest/` (nicht in Git).

**Ehrlich vorweg:** Das ist kein Kindertest. Ich bin ein Testbrowser. Die Seiten sind statische Muster. Ich habe angesehen, gescrollt, mit Tab durchgegangen und Tippflächen gemessen. Ich habe nichts „gespielt“. „Würde tippen“ heißt: Das ist meine Einschätzung aus dem Bild, nicht beobachtet. Es gibt keinen Ton, keine Bewegung und keinen Kartenwechsel. Im Muster fehlen die Falsch-Antwort und das Weiterklicken. Ich habe rund 25 Ansichten und Scrolls gemacht, dazu eine Tab-Runde je Seite.

**Auftrag:** Mia (6, Handy 390 px, Touch, Mama liest vor): Tiere ansehen, dann spielen. Jonas (10, Rechner 1280 px, allein): Spielfrage lösen und Fortschritt auf der Route sehen. Stand: file://-Seiten in `/home/user/wunderkompass/docs/entwurf/2026-11-25-stilproben/`.

**Ergebnis in einem Satz:** Beide Ziele lassen sich als „würde finden und tippen“ im Muster nachvollziehen. Für Mia trägt B besser, für Jonas A. Dazu kommen zwei echte Darstellungsfehler (A: Kompassrose angeschnitten, B: Symbol überdeckt Text) und eine Lücke bei Jonas' Routen-Ziel (beide Stile).

### Begehung 1: Mia (390 px, Touch)

**Stil A (Kartenwerk)**
1. Start, `/home/user/wunderkompass/.qa-output/stilproben/spieltest/mia-a-start-1.png`. Zuerst fällt die große Frage in dunkler Schrift auf, dann das Pinguinfoto mit der Kompassrose. Mama liest „Wo leben Kaiserpinguine …“, Mia würde den dunklen Knopf „Antwort suchen“ oder das Foto tippen. „Andere Frage“ ist nur ein kleiner Textlink.
2. Weiter unten (`mia-a-start-ganz.png`) stehen „Deine Route“ und „Sechs Welten“ als Textliste mit kleinen farbigen Quadraten (36 px) und Symbolen. Mia will „Tiere“. Die Tierwelt erkennt sie nur an einem winzigen Pfoten-Symbol, ein Foto gibt es nicht. Hier braucht sie Mama.
3. Karte, `mia-a-karte-ganz.png`. Großes Elefantenfoto, „Vorlesen“ gleich unter dem Titel (sehr gut für Mia). Die „Rate mal!“-Antworten sind schlichte weiße Pillen in gestricheltem Rahmen und wirken eher wie Eingabefelder als wie Knöpfe. „Stimmt“ und „Stimmt nicht“ sind dünn umrandet.
4. Spiel, `mia-a-spiel-1.png` und `mia-a-spiel-2.png`. Die Fortschrittspunkte sind klar. Die richtige Antwort wird grün mit Haken, darunter steht groß „Richtig!“ mit Erklärung. „Nächste Aufgabe“ ist ein dunkler Knopf, sichtbar ohne Scrollen. Die anderen Antworten sind auf 50 % Deckkraft ausgegraut.

**Stil B (Sammelheft)**
1. Start, `mia-b-start-1.png`. Zuerst fällt der orange Knopf „Antwort finden“ auf, daneben das schräge Foto wie ein Aufkleber. Das ist sofort einladend. Zwei große Knöpfe untereinander, kein Textlink.
2. `mia-b-start-ganz.png`. Die sechs Welten sind bunte Kacheln mit rundem Foto (Panda = Tiere, Pyramiden = Zeit, Marie Curie, Kompass, Brücke). Mia tippt ohne Lesen den Panda. Das ist der größte Unterschied zu A.
3. Karte, `mia-b-karte-ganz.png`. Gleiche Struktur wie A. Die Antwortknöpfe haben dicken Rand und Schatten und sehen eindeutig tippbar aus. Der Steckbrief ist eine 2x2-Kachelgruppe, das ist übersichtlicher als die Tabelle in A.
4. Spiel, `mia-b-spiel-1.png`, `mia-b-spiel-2.png`, `mia-b-spiel-stempel-zoom.png`. Die richtige Antwort ist grün mit Haken. Rechts im Knopf sitzt der Stempel „Richtig!“, darunter ein grüner Erklärungskasten ohne Überschrift. „Nächste Aufgabe“ (orange) liegt im ersten Bild unter der Menüleiste verdeckt und erscheint erst nach Scrollen.

### Begehung 2: Jonas (1280 px, Maus und Tastatur)

**Stil A**
1. Start, `jonas-a-start-1.png` und `jonas-a-start-ganz.png`. Große, ruhige Schlagzeile, Foto, Kompassrose. Das wirkt erwachsen genug, nicht „Babykram“. „Deine Route“ ist links als gestrichelter Weg mit drei Stationen: Zuletzt (Elefant), Als Nächstes (Kreuz und quer, roter Rand), Danach (Lernreise). Das kommt seinem Ziel „Route“ am nächsten.
2. Spiel, `jonas-a-spiel-ganz.png`. Alles passt auf eine Bildschirmhöhe. Die Fortschrittsleiste besteht aus Punkten, gestrichelter Linie und rotem Dreieck („Aufgabe 3 von 6“). „Richtig!“ steht groß mit Haken, daneben die Karte „Warum verändert der Mond seine Form?“ als Verknüpfung. Das gefällt Jonas, es macht neugierig.
3. Tab: Die Reihenfolge ist logisch (Navigation, Suchen, Pass, Antworten, Weiter). Der Fokus ist überall als 3-px-Rahmen sichtbar.

**Stil B**
1. Start, `jonas-b-start-1.png` und `jonas-b-start-ganz.png`. Orange, schräge Aufkleber, Grandstander-Schrift, schräges „Frage des Tages“-Etikett und bunte Kacheln. Das wirkt für Jonas deutlich kindlicher. Statt „Deine Route“ steht „Weiter in deinem Heft“ mit zwei Karten. Eine Route oder einen Fortschritt gibt es auf der Startseite nicht.
2. Spiel, `jonas-b-spiel-ganz.png`. Erledigte Aufgaben sind grüne Haken, die aktuelle ein dicker leerer Kreis. Das zeigt Fortschritt klar und ist belohnender als A. Der Stempel ist nett, aber blass.
3. Tab: gleiche Reihenfolge wie A, Fokus 3 px blau, überall sichtbar.

### Befunde

**Blockierend:** keine.

**Wichtig**
- **Sieht falsch aus (B), Spielseite 390 px:** `mia-b-spiel-2.png`. Auf der blauen Karte „Dazu gibt es eine Wissenskarte“ überdeckt das runde Teleskop-Symbol die Textzeile „Dazu gibt es …“. Das ist gut sichtbar kaputt. Vorschlag: Symbol und Text sauber untereinander oder nebeneinander setzen.
- **Sieht falsch aus (A), Startseite 1280 px:** `jonas-a-start-1.png`. Die Kompassrose ist oben von der Kopfleiste angeschnitten. Auf dem Handy (`mia-a-start-1.png`) sitzt sie sauber. Vorschlag: Abstand nach oben oder Rose nach unten schieben.
- **Verwirrend (B), Stempel:** `mia-b-spiel-stempel-zoom.png`. Der Stempel ist dünn, halb durchsichtig, grün auf hellgrün, mit kleiner Schrift. Er ragt aus dem Knopf und wirkt wie eine Beschädigung statt wie ein Triumph. Die große „Richtig!“-Zeile von A fehlt in B, und der Erklärungskasten hat keine Überschrift. Wer den Stempel übersieht, erkennt die Rückmeldung nur an Haken und Farbe. Vorschlag: Stempel größer, deckend und stärker gedreht, dazu „Richtig!“ als Überschrift im Kasten.
- **Lücke (beide), Jonas' Routenziel:** Keine Seite zeigt „wie weit bin ich“. A zeigt eine Route mit drei Stationen, aber keine Zahl wie „2 von 8“. B zeigt gar keine Route, nur „Weiter in deinem Heft“. Das Muster kann Jonas' Ziel nicht ganz beantworten.
- **Zu schwer / keine Hilfe (beide), Spielseite für Mia:** Es gibt auf der Spielseite kein „Vorlesen“ (ich habe im Text danach gesucht), obwohl es auf der Karte eines gibt. Die Mondfrage („Woher kommt das Licht des Mondes?“) hat nur Textantworten ohne Bilder. Mia kann sie ohne Mama nicht lösen.
- **Verwirrend (B), Schrift:** Auf Jonas' Startseite sieht das „u“ in „Natur“ und „pinguine“ wie ein „v“ aus. Das ist das erwartete Leseanfänger-Risiko aus dem Entwurf, es bestätigt sich im Bild. Für Mia heikel.
- **Fehlt im Muster (beide):** Ich habe keine falsche Antwort gesehen, denn die Muster zeigen nur den richtigen Zustand. Dazu kann ich weder A noch B bewerten (im HTML steht nichts zu „falsch“ oder „nochmal“). Das entscheidet aber, ob Mia entmutigt wird.

**Feinschliff**
- **Sieht falsch aus (beide):** Textlinks wie „Andere Frage“ (A), „Spiel beenden“ und „Karte öffnen“ sind nur 16 bis 21 px hoch. Das liegt unter 44 px. Vielleicht sind in der echten Seite die ganzen Karten tippbar, das sehe ich im Muster nicht. In B sind „Andere Frage“ und „Nächste Aufgabe“ dagegen als Knöpfe ausgeführt. Vorschlag: Textlinks als Knöpfe oder mit großer Tippfläche.
- **Verwirrend (beide):** Oben rechts stehen zwei reine Symbolknöpfe (Lupe, Ausweiskarte) und unten sechs Symbole mit kleiner Beschriftung. Mia kennt den Ausweis nicht. Mama erklärt es einmalig, dann geht es.
- **Sieht falsch aus (beide):** Nach dem Antworten sind die übrigen Antworten mit 50 % Deckkraft sehr blass. Sie sind kaum lesbar, besonders in B auf weißem Grund mit grauem Rand. Für „schon beantwortet“ üblich, aber wenig Kontrast.
- **Sieht falsch aus (B), 390 px:** Die orange „Nächste Aufgabe“ liegt im ersten Bildschirm hinter der Menüleiste und muss erst erreicht werden. In A ist sie sofort sichtbar.
- **Verwirrend (A):** „Rate mal!“-Antworten sehen wie Eingabefelder aus und die erledigten Punkte der Fortschrittsleiste haben kein Häkchen. Der Weg zum Tippen ist trotzdem klar.

**Gut gelungen**
- A: ruhige Schlagzeile, Route als Weg mit Haltepunkten, große „Richtig!“-Zeile mit Haken, passt zum Namen „Kompass“, wirkt für Jonas nicht kindisch, alles auf einem Bildschirm.
- B: Welten-Kacheln mit Foto (Mia findet ohne Lesen „Tiere“), dicke tippbare Knöpfe, grüne Haken in der Fortschrittsleiste, Stempel als Idee, Steckbrief-Kacheln.
- Beide: „Vorlesen“ gleich unter dem Kartentitel, Fotos mit Nachweis, 48 px hohe Hauptflächen, deutlich sichtbarer Fokus, sinnvolle Tab-Reihenfolge, keine Seitenverbreiterung (Breite = Fensterbreite), kein Browserfehler.

### Welcher Stil für wen, und was übernehmen

- **Mia (6, Handy):** B trägt besser. Die Foto-Kacheln und die dicken Knöpfe führen auch ohne Lesen zum Ziel, und der orange Hauptknopf ist sofort zu finden. Das „v“-artige „u“ ist ihr Risiko. Aus A sollte B die große „Richtig!“-Zeile und eine ruhigere Schrift übernehmen.
- **Jonas (10, Rechner):** A trägt besser. Es wirkt erwachsener, hat eine echte Route und passt auf einen Bildschirm. B wirkt bei ihm schnell nach „Babykram“. Aus B sollte A die Foto-Kacheln für die Welten (jetzt eine reine Textliste), die grünen Haken in der Fortschrittsleiste und einen stärkeren Stempel-Moment übernehmen.
- **Das stützt die vorläufige Empfehlung im Entwurf** (A als Grundlage, aus B die Foto-Kacheln und den Stempel). Ich ergänze: Der Stempel muss deutlicher werden und eine Textzeile „Richtig!“ behalten. Eine Zahl für den Routenfortschritt fehlt in beiden Mustern. Und für Mia braucht die Spielseite ein „Vorlesen“.

### Browser-Meldungen
Keine (keine Konsolenfehler, keine Seitenfehler, keine gescheiterten Anfragen).

### Nicht geprüft
Ton und „Vorlesen“, Bewegung (Rosenpendeln, Stempel-Aufschlag), Antippen und Kartenwechsel, Falsch-Antwort-Zustand, 320/768 px (nur vorhandene Bilder, nicht von mir angesehen), Firefox und Safari, echtes Touchgerät, Bildschirmleser, echte Kinder.

### Bilder (alle in `/home/user/wunderkompass/.qa-output/stilproben/spieltest/`)
`mia-a-start-1.png`, `mia-a-start-ganz.png`, `mia-a-karte-ganz.png`, `mia-a-spiel-1.png`, `mia-a-spiel-2.png`, `mia-b-start-1.png`, `mia-b-start-ganz.png`, `mia-b-karte-ganz.png`, `mia-b-spiel-1.png`, `mia-b-spiel-2.png`, `mia-b-spiel-stempel-zoom.png`, `jonas-a-start-1.png`, `jonas-a-start-ganz.png`, `jonas-a-spiel-ganz.png`, `jonas-b-start-1.png`, `jonas-b-start-ganz.png`, `jonas-b-spiel-ganz.png`. Hinweis: In den Ganzseiten-Bildern erscheint die untere Menüleiste mitten in der Seite. Das ist nur ein Aufnahme-Effekt der fixierten Leiste, kein Fehler. Skripte liegen im selben Ordner (`lauf.mjs`, `ganz.mjs`, `zoom.mjs`, `tab.mjs`). Am Projekt wurde nichts geändert.
