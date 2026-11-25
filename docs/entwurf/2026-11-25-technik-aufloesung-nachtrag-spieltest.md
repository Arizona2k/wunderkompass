# Spieltest Technik-Auflösungen, Nachprüfung (25.11.2026)

Helfer: `spieltester` (sonnet / high), lokaler Build des Branchs. Kein Kindertest. Entscheidungen dazu: [Nachtrag, Abschnitt 7](2026-11-25-technik-aufloesung-nachtrag-entwurf.md#7-entscheidungen).

**Nachprüfung Technik-Detektiv: Die neuen Auflösungen für Auto, Smartphone und Kamera erklären jetzt das „Wie“. Kein Muss-Fund. Offen bleiben drei kleine Soll-Punkte und ein paar Kann-Punkte.**

**Auftrag:** Rolle 7 Jahre mit Elternteil, Handy 390×844 mit Touch, Chromium, Stufe Entdecker. Danach Rolle 10 Jahre am Rechner 1280×800, Profi, eine Runde. Stand: lokaler Build des Branchs, frischer Kontext ohne Pass.

**Ergebnis:** Eine ganze Entdecker-Runde ist bis „Spielstempel sammeln“ und Endbildschirm gespielt (5/5, 17 Taps). Für die Auflösungen habe ich 6 weitere Runden ohne Handeingriff durchgespielt. Dabei kamen Auto (2 Runden), Kamera (2) und Smartphone (1) vor. Profi am Rechner: 8/8 Aufgaben bis zum Ende, mit Zwischenstopps bei Falsch.

## Muss
- Keiner. Keine Sackgasse, keine Konsolenfehler, keine gescheiterten Anfragen.

## Soll
1. **Das Versprechen der Spielkarte steht nirgends sichtbar.** Der Text „Welche Erfindung hilft? Finde sie und erfahre, wie sie funktioniert.“ stammt aus `app/game-index.json` und `app/world-games.tsx`.
   - Auf der Startseite habe ich ihn nicht gefunden. In der Welt „Erfindungen“ konnte ich ihn nicht prüfen, weil mein Skript den Link nicht traf.
   - Im Bereich „Spielen“ (Bild 03-karte.png) steht auf der Karte nur „Probleme mit Erfindungen verbinden · Ab etwa 8 · Spuren kombinieren“.
   - Auf der Spielseite selbst steht er auch nicht, dort beginnt gleich „Aufgabe 1 von 5“.
   - Ob ein Kind den Satz irgendwo sieht, konnte ich also nicht belegen. Wenn er nur in der Suche vorkommt, hilft er dem Kind beim Einstieg nicht.
   - Vorschlag: Auf der Spielplatz-Karte denselben Satz oder einen kurzen Teil davon zeigen, damit sichtbarer Text und Inhalt zusammenpassen.
   - Das Versprechen selbst hält das Spiel: Alle 20 Auflösungen, die ich gesehen habe, erklären ein „Wie“.
2. **Smartphone-Text beantwortet nur die halbe Aufgabe** (15-auflösung-Smartphone.png). Aufgabe: „Menschen telefonieren und gleichzeitig Informationen bearbeiten.“ Der Text erklärt nur das Telefonieren: Funkwellen, Funkmast, nächster Mast. Das „Informationen bearbeiten“ fehlt. Vorschlag: einen Satz zu „kleiner Computer im Gerät“ ergänzen oder die Aufgabe kürzen.
3. **Auto-Text:** „Heißes Gas braucht viel Platz und drückt ein Metallteil weg“ (13-auflösung-Auto.png). Für 7-Jährige ist „ein Metallteil“ unklar, der Vergleich „wie deine Beine beim Radfahren“ ist dagegen gut. Vorschlag: „einen Kolben“ nennen oder „ein Teil im Motor“ schreiben. Der Radfahr-Vergleich verrät außerdem die Aufgabe zum Fahrrad aus der Profi-Runde: „Wie erreicht die Kraft deiner Beine das Hinterrad?“ (siehe Kann).

## Kann
- **Kamera:** Der neue Text ist gut und wie bei Kamera-Chips (Linse, Felder, viel Licht gleich viel Strom; 14-auflösung-Kamera.png). In Profi Aufgabe 4 fragt dagegen „Wie werden kleine Strukturen unterscheidbar?“ („Strukturen“ und „unterscheidbar“ sind für 7-Jährige schwer, wie schon im ersten Bericht). Die Kamera ist dort nur Ablenker.
- **Falsche Antwort:** Der Satz „Was macht diese Erfindung genau? Passt das zu allem, was in der Aufgabe steht?“ ist als Frage an das Kind formuliert und nicht mehr der alte Tipp-Satz (siehe 06-falsch2.png). Für ein 7-jähriges Kind ist er trotzdem abstrakt. „Passt das zu allem“ und „genau“ sagt ihm nicht, was es konkret tun soll. Mit Vorlesen durch das Elternteil hilft er aber, weil der Erwachsene nachfragen kann („Was macht ein Buchdruck?“). Ohne Elternteil wird eher weiter geraten. Vorschlag: eine kürzere Fassung wie „Was kann der Buchdruck? Hilft das beim Problem?“
- **Tipp:** Er ist jetzt „Stell dir jede Erfindung bei der Arbeit vor. Welche passt zu allem, was in der Aufgabe steht?“ (16-tipp.png). Der frühere Verweis auf „den Text“ ist weg. Gut.
- **Profi, 10 Jahre:** Der Satz „Ganz schön knifflig. Willst du eine Stufe leichter spielen?“ erscheint nach zwei Fehlern, auch zusammen mit „Richtig!“ (22-profi-richtig2.png). Das wirkt an der Stelle bevormundend. Vorschlag: den Hinweis nur zeigen, wenn die aktuelle Antwort falsch ist.
- **Profi ist nicht richtig fordernd:** Viele falsche Optionen sind offensichtlich unsinnig, etwa Kühlschrank oder Telefon bei „Kraft der Beine ans Hinterrad“ oder „Nähmaschine“ bei „zitternder Boden“. Über Ausschluss lösbar. Die Fragen sind gut formuliert, aber ein 10-Jähriger kommt meist ohne Nachdenken durch. Fordernder wären Ablenker aus demselben Feld (Fahrrad gegen Auto gegen Eisenbahn).
- **Ratemuster:** Die richtige Antwort stand in meinen 8+ Fragen oft Mitte oder B bei drei Optionen (4 von 5 Fragen in der Handy-Runde: B). Die Reihenfolge ist gemischt, ein festes Muster habe ich nicht belegt.

## Zu deinen Beobachtungspunkten
1. **Versprechen:** Das Spiel hält es (siehe Soll 1 zur Sichtbarkeit). Die Auflösungen sind kurz und erklären ein „Wie“: Ballon bei der Rakete, Eimer beim Fernrohr, Päckchen beim Internet, Funkmast beim Smartphone, Benzin im Motor beim Auto.
2. **Auflösungen zu Auto, Smartphone und Kamera:** Alle drei erklären jetzt, wie die Erfindung funktioniert, und nicht mehr nur, dass es sie gibt. Wörtlich:
   - Auto: „Das Auto fährt oft mit Benzin, das im Motor verbrennt. Heißes Gas braucht viel Platz und drückt ein Metallteil weg. Das Drücken dreht die Räder, wie deine Beine beim Radfahren.“
   - Smartphone: „Das Smartphone verwandelt deine Stimme in unsichtbare Funkwellen, wie beim Radio. Ein Funkmast in der Nähe fängt sie auf. Wenn du weit weggehst, übernimmt der nächste Mast.“
   - Kamera: „Die Kamera lenkt Licht mit einer Linse auf Millionen winziger Felder. Jedes Feld macht aus Licht etwas Strom: viel Licht, viel Strom. Die Kamera speichert alle Felder als ein Foto.“
   - Neu gesehen und passend: Flugzeug („Flügel, die Luft nach unten lenken“), Kompass, Nähmaschine, Generator, Fahrrad (Zahnräder, Kette).
3. **Falsch tippen:** 7 Mal bewusst falsch getippt, dabei ist die falsche Antwort orange markiert, „Noch nicht ganz. Versuch es noch einmal!“ steht gleich im Bild. Zum Satz danach siehe Kann.
4. **Nach „Nächste Aufgabe“:** Die neue Frage steht ganz im Bild. Mein Skript maß in Aufgabe 2 bis 5 (jeweils bis Frage-Unterkante 244 bis 276 px, Leiste ab 780 px). Frage 1 einer neuen Runde: Frage bei 321 bis 450 px, ebenfalls frei (12-neueFrage.png). Nach „Richtig!“ ist der Kopf der Frage dagegen oben angeschnitten, weil die Seite zur Rückmeldung rollt. Das ist gewollt und gut, der Knopf „Nächste Aufgabe“ liegt bei y=702 bis 750 und ist 150×48 px, ganz sichtbar.

## Profi am Rechner
- **Lesbarkeit:** Rückmeldetext ist 650 px breit, also etwa 75 bis 85 Zeichen je Zeile, bei großer Schrift. Das liest sich angenehm (22-profi-richtig2.png, 23-profi-falsch.png). Die Antwortknöpfe laufen dagegen über 1000 px, das ist unkritisch.
- **Fordernd genug?** Siehe Kann. Eher leicht, vor allem bei den Ablenkern.

## Browser-Meldungen
Keine (weder Konsolenfehler noch Seitenfehler noch gescheiterte Anfragen, Chromium).

## Nicht geprüft
Ton und Vorlesen, Firefox/WebKit, Tastatur, 320 px, „Größere Schrift“, echte Geräte. Die Suche habe ich nicht erfolgreich bedient, ob das Versprechen dort steht, weiß ich nicht.

Bilder und Skripte lagen nur im Arbeitsordner des Chats (nicht im Repository): (03-karte, 06-falsch2, 07-richtig2, 12-neueFrage, 13-auflösung-Auto, 14-auflösung-Kamera, 15-auflösung-Smartphone, 16-tipp, 22-profi-richtig2, 23-profi-falsch u. a.).

Das war ein Spieltest in der Rolle eines Kindes und kein Kindertest; echte Kinder bleiben die wichtigste Rückmeldung.
