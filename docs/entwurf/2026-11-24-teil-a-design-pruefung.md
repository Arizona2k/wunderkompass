# Design-Prüfung Teil A „Eine Stufe für alles“ (Bericht des `design-pruefer`, 24.11.2026)

Gesichert, wie geliefert (sonnet/high). Geprüft auf `dist/` nach Commit `b04aa69` (App seitdem unverändert). Die Bilder lagen im Scratchpad dieser Sitzung und sind nicht im Repository; wer sie braucht, erzeugt sie neu (Stellen und Zustände unten). Bewertung und Umsetzung: Abschnitt „Design-Prüfung“ in [der Entscheidungsliste](2026-11-23-teilschritt-3-teil-a-entscheidungen.md).

---

Geprüft mit Chromium bei 320, 390 (beide mit Touch/isMobile), 768, 1280 und 1440 px, deviceScaleFactor 1.

## Gesamteindruck je Breite

- **320 px:** Alles benutzbar, kein waagerechtes Scrollen. Eng sind das Label „Modellkörper“ im Steckbrief (bricht mitten im Wort), die Ordne-Zeilen (Text nur etwa 120 px breit) und die Stufenwahl.
- **390 px:** Gut. Die Stufenwahl wirkt hier wie eine vierte Antwortliste.
- **768 px:** Gut. Alle Stellen sind klar und luftig.
- **1280 und 1440 px:** Der Inhalt liegt als 760-px-Spalte links. Rechts bleibt viel Leerraum, ich nehme an, das ist Absicht. In der offenen Stufenwahl ist das Layout verrutscht (Befund 1).

Messungen auf allen fünf Breiten: kein waagerechtes Scrollen und keine Tippfläche unter 44 px in den geprüften Bereichen. Ausnahme ist das unsichtbare Dateifeld im Pass (1×1 px, kein Fehler). Fließtext ist durchgehend mindestens 16 px. Kontraste:
- Graublauer Text (70,97,108) auf der Seite: 6,2 zu 1.
- Gleicher Text auf dem Vorschlagskasten: 5,6 zu 1.
- Weißer Text auf dem orangen Knopf: 4,9 zu 1.
- Braune Schrift auf dem „falsches Wort“-Knopf: 4,7 zu 1.

Alles liegt über AA. Auf den zwei Knöpfen mit 14 px Schrift (siehe Befund 3) ist es knapp.

## Befunde

### Wichtig (mittel)

**1. Stufenwahl bei „Rate mal!“ ist geöffnet nicht klar und bei 1280/1440 verrutscht**
- Bilder: `rate-1280-offen.png`, `rate-1440-offen.png`, `rate-390-offen.png`, `rate-320-offen.png`, `experte-1280.png`, `experte-390.png`.
- **Bei 1280/1440 offen:** Die Überschrift „Rate mal!“ steht senkrecht mittig links neben den drei Stufenkacheln, die rechts in einer schmalen Spalte stehen. Links bleibt eine große Leerfläche, die Frage rutscht weit nach unten.
- **Bei 1280/1440 auf Profi/Experte:** Der Link „Zu schwer? Zurück zu Entdecker“ steht eingerückt (x≈268) und nicht bündig unter „Rate mal!“.
- **Bei 320 bis 768 offen:** Die drei Stufenkacheln sind nach rechts eingerückt (bei 390 etwa 50 px Leerraum links). Sie sehen fast aus wie die Antwortkacheln A/B/C direkt darunter. Die Frage „Was kann ein Elefant …“ folgt nur etwa 8 px darunter, ohne Trennung.
- **Warum es stört:** Ein Kind kann die Stufenkacheln für Antworten halten und „Profi“ antippen, ohne es zu wollen. Es gibt keine Überschrift wie „Welche Stufe?“.
- **Vorschlag:**
  - Die Stufenwahl als eigene kleine Zeile oder Karte mit Titel „Welche Stufe?“ setzen, volle Breite, mit Abstand (mindestens 16 bis 24 px) zur Frage.
  - Beim Öffnen die Frage und Antworten dimmen oder verbergen, bis gewählt ist.
  - Kachel-Stil deutlich von Antwort-Stil unterscheiden (kein A/B/C-Look, kleinere Schrift oder Chips).
  - Auf Desktop Überschrift und Stufenzeile in einer Grid-Zeile oben bündig ausrichten.

**2. Vorschlag „Willst du Profi probieren?“ (`.stufen-vorschlag`) konkurriert mit „Noch eine Frage“**
- Bilder: `vorschlag-390.png`, `vorschlag-320.png`, `vorschlag-1280-fokus.png`.
- Der Vorschlagskasten steht unter dem großen, vollbreiten orangen Knopf „Noch eine Frage“. Auf 390 px liegt er teils unter dem Falz.
- „Ja, Profi probieren“ und „Nein, ich bleibe“ sind kleine linksbündige Knöpfe (etwa 48 px hoch, schmal), gestapelt mit nur etwa 8 px Abstand. Der „Nein“-Knopf ist fast randlos weiß. Der Kasten hat 15 px Innenabstand, die Erklärung darüber 20 px.
- **Warum es stört:** Kinder tippen den auffälligsten (orangen) Knopf und sehen den Vorschlag gar nicht. Zwei Knöpfe dicht an dicht verleiten zu Fehltipps.
- **Vorschlag:**
  - Auf Handy volle Breite und mindestens 12 px Abstand zwischen „Ja“ und „Nein“.
  - Den Vorschlag über „Noch eine Frage“ setzen oder „Noch eine Frage“ in dieser Situation zurücknehmen.
  - Beide Knöpfe gleich gewichtig gestalten, Innenabstand an die Erklärung angleichen.

### Feinschliff (niedrig)

**3. „Prüfen“ bei „Ordne richtig“ ist klein**
- Bild: `ordne-390-1-start.png`, `ordne-1280-1-start.png`.
- Knopf 81 × 45 px mit 14 px Schrift, linksbündig. Daneben sind die Karten-Knöpfe „Noch eine Frage“ vollbreit mit 16 px und mehr. Auf 390 und 320 liegt „Prüfen“ nahe an der Bottom-Navigation.
- **Vorschlag:** Auf Handy vollbreit, mindestens 16 px, Innenabstand zur Bottom-Navigation vergrößern. Das ist ein Hauptknopf in Orange und sollte entsprechend wirken.

**4. „Ordne richtig“ (Zustände)**
- Bilder: `ordne-390-1-start.png`, `ordne-390-2-falsch.png`, `ordne-390-4-geprueft.png`, `ordne-320-1-start.png`.
- Die Pfeil-Knöpfe sind 48 × 44 px und nur als Icons gestaltet. Das ist gut, aber für 5-Jährige ist „oben = zuerst“ nicht erklärt. Nur die Zahlen 1 bis 4 zeigen es.
- Bei 320 px ist der Text pro Zeile nur etwa 120 px breit und läuft auf 4 Zeilen.
- Die Fehlermeldung „Noch nicht ganz. Versuch es noch einmal!“ steht als schlichter fetter Text unter „Prüfen“, ohne Kasten und ohne Markierung. Sie wirkt wie ein Rest vom Layout.
- Die Auflösung nach „Richtig!“ ist ein 6- bis 7-zeiliger Absatz mit vier Zahlen (66 Mio., 3,3 Mio., 1 Mio., 4.500 Jahre). Das ist für 8- bis 10-Jährige schwer. Eine kleine Zeitleiste oder kürzere Sätze wären besser.
- **Vorschlag:**
  - Kurzer Hinweis über der Liste: „Oben = zuerst“.
  - Fehlermeldung in Kasten mit Icon.
  - Auflösung gliedern: Reihe als 1 bis 4 mit je einer Zeile (z. B. „vor 66 Mio. Jahren“) statt Fließtext.

**5. „Fast richtig“ (Marie Curie, Experte)**
- Bilder: `fast-390-2-wort.png`, `fast-390-3-falsch.png`, `fast-390-4-erklaerung.png`, `fast-1280-4-erklaerung.png`.
- Zwischen „Welches Wort ist falsch?“ und den Wortknöpfen ist ein auffälliger Leerraum von etwa 26 bis 40 px. Der Rest ist eng gesetzt.
- „Richtig!“ steht im Block untereinander zweimal (nach „Stimmt nicht“ und nach dem Wort). Die Erklärung steht doppelt: im Satz „Radium steckte schon im Gestein …“ und im Kasten „Das stimmt nicht“ mit fast gleichem Inhalt.
- Das falsch gewählte Wort („1898“) wird durch gelbbraune Schrift auf hellgrünem Grund markiert (Kontrast 4,7 zu 1, ausreichend). Es gibt kein Symbol, nur Farbe und die Textzeile darunter.
- **Vorschlag:**
  - Den Leerraum verringern.
  - Eine der beiden Erklärungen streichen (z. B. den Kasten „Das stimmt nicht“ weglassen, wenn die Wortauflösung kommt).
  - Falsch markiertes Wort mit Symbol (z. B. Kreuz oder Fragezeichen) markieren.

**6. Fotosynthese-Karte**
- Bilder: `science-photosynthesis-390-kurz.png`, `science-photosynthesis-390-kurz2.png`, `science-photosynthesis-320-kurz.png`, `science-photosynthesis-768-kurz.png`, `science-photosynthesis-1280-kurz.png`.
- Die Zeichnung wirkt gut (klar, helle Farben, passt zur Linie), ist lesbar und drängt nichts weg. Sie ist bei 1280 etwa 400 px breit in 760 px Spalte und könnte etwas größer sein.
- Der Erklärabsatz „Der gewellte Pfeil steht für Lichtenergie … keine Mengen, Molekülstruktur oder Reaktionsgeschwindigkeit“ steht nicht direkt an der Zeichnung, sondern erst nach drei Kurztexten (Energie, Ausgangsstoffe, Produkte). Bei 390 px sind es 5 Zeilen mit Fachwörtern, bei 320 px noch mehr. Für 5- bis 10-Jährige ist das schwer.
- Der Satz „Eigene vereinfachte Erklärzeichnung · KI-unterstützt“ trennt bei 390 px mitten im Wort („KI-/unterstützt“).
- **Vorschlag:**
  - Bildlegende direkt unter die Zeichnung und kurz halten. Die Fachwörter („Molekülstruktur“, „Reaktionsgeschwindigkeit“) gehören nach „Für Große“.
  - Die Zeichnung bei 1280 etwas größer, ohne den Rest wegzudrücken.

**7. Auftrieb-Karte**
- Bilder: `science-buoyancy-390-kurz.png`, `science-buoyancy-320-kurz.png`, `science-buoyancy-1280-kurz.png`.
- „Ganz einfach“ ist offen, „Für Große“ ist zu. Die Reihenfolge ist klar und das Einklapp-Feld gut erkennbar. Der Chevron und der Rahmen zeigen deutlich, dass man aufklappen kann.
- Das Wort „Ganz einfach“ steht nirgends als Überschrift. Der Satz steht einfach unter „Kurz erklärt“. Das ist eher Geschmack: Wer die Stufe nicht kennt, sieht nur „Für Große“ und versteht den Gegensatz nicht.
- Bei 320 px bricht das Steckbrief-Label „Modellkörper“ mitten im Wort („Modellkörpe / r“) und schiebt den Wert stark ein.
- **Vorschlag:** Label-Spalte bei 320 px breiter oder das Label oberhalb des Wertes setzen. Optional „Für Große“ als „Mehr für Große“ oder mit einem Pfeil-Hinweis versehen.

**8. Stufenwahl im Pass (Fund zum Ort)**
- Bilder: `pass-390-zu.png`, `pass-390-offen.png`, `pass-390-erw.png`, `pass-320-offen.png`, `pass-1280-offen.png`.
- Die Stufenwahl liegt im Abschnitt „Spielen & Vorlesen“ unter „Leise Erfolgstöne“, nicht im Abschnitt „Sichern & mitnehmen“. Ich habe das gesehen, nicht angenommen. Falls ein anderer Ort gewollt war, bitte prüfen.
- „Für Erwachsene: Welche Stufe passt?“ hat den Standard-Browser-Pfeil (Dreieck ▶), anders als die gestalteten Chevron-Bereiche auf der Karte. Das sieht uneinheitlich aus.
- Beim Aufklappen sind die zwei Absätze ohne Abstand gesetzt („… keine Punkte.“ und „Die Stufe gilt zuerst …“ direkt untereinander).
- Die Zusammenfassung klebt oben an der Experte-Kachel und unten an „Vorlesetempo“ (kaum Abstand).
- **Vorschlag:** Gestalteten Chevron wie auf der Karte, Absatzabstand (mindestens 8 px) und 16 bis 24 px Abstand zu den Nachbarn.

**9. Kleinigkeiten Stufenwahl**
- Die Zweitzeilen („zum Reinkommen“, „vier Antworten, kniffligere Fallen“) haben 15 px Schrift. Bei 320 px bricht „vier Antworten, kniffligere Fallen“ in zwei Zeilen um. Die Mindestgröße von 16 px wäre sauberer.
- „Stufe: Entdecker“ ist grau und wirkt leise, während „Ändern“ als weißer Knopf deutlich kontrastiert. Das passt.

## Was gut gelöst ist

- Fokus: Tastaturfokus ist an allen geprüften Bedienelementen deutlich sichtbar (3 px petrolfarbener Rahmen). Nach der Stufenwahl landet der Fokus ruhig auf „Ändern“. Es gibt keinen großen Rahmen um Überschriften oder Inhaltsblöcke.
- Tippflächen: Alle gemessenen Knöpfe sind mindestens 44 px hoch (Stufenknöpfe 48, Wortknöpfe 59 bis 63, Pfeile 48 × 44, „Prüfen“ 45).
- Kein waagerechtes Scrollen, kein Abgeschnittenes (außer „Modellkörper“ bei 320 px).
- Fotosynthese-Zeichnung offen unter dem Satz ist eine klare Verbesserung: farbig, ruhig, sofort lesbar, gut im Verhältnis zum Text.
- Auftrieb: Reihenfolge „Ganz einfach“, dann „Für Große“, dann Steckbrief ist klar.
- „Ordne richtig“: Fortschritt ist erkennbar (Zahlen, abgeblendeter erster Aufwärtspfeil und letzter Abwärtspfeil), richtiger Endzustand mit Häkchen ist eindeutig.
- „Fast richtig“: Wortknöpfe sind groß und leicht zu treffen, richtig und falsch sind unterscheidbar.
- Reduzierte Bewegung (Stichprobe mit `reducedMotion: 'reduce'` auf der Elefantenkarte): ruhig und bedienbar.

## Nicht geprüft

- Keine echten Geräte, keine Bildschirmleser, nur Chromium (kein Firefox, kein WebKit).
- Glanz beim Zeigen oder Antippen nicht geprüft.
- Reduzierte Bewegung nur auf der Elefantenkarte, nicht auf den anderen Stellen, und nur das Layout, nicht die Animationen selbst.
- Tastaturfokus nur an der Stufenwahl (Elefant) und am Vorschlagsknopf geprüft, nicht an Pfeil-Knöpfen oder Wortknöpfen.
- „vorschlagLeichter“ (zwei falsche Antworten auf Profi) und der Zustand „Profi gibt es hier noch nicht“ nicht angesehen.
- Fokus-Verhalten nach Seitenwechsel auf anderen Seiten (Prüfpunkt 8, zweiter Teil) nicht untersucht.
- 1440 px nur über Messwerte plus gleiche Layoutlogik wie 1280 geprüft. Alle Bilder bei 320, 390, 768 und 1280 angesehen. Bei 1440 lagen die Bilder vor, nicht einzeln durchgesehen.
