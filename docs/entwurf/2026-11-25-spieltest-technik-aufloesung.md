# Spieltest Technik-Detektiv: kurze Auflösungen (25.11.2026)

Helfer: `spieltester` (sonnet/high), lokale Vorschau des Technik-Stands. Kein Kindertest. Nur Befunde, entschieden hat Claude (Abschnitt „Entscheidungen“ am Ende).

**Auftrag:** Rolle 1: 7 Jahre mit Elternteil, Handy 390×844 Touch, Entdecker, Chromium. Rolle 2: 11 Jahre allein, Rechner 1280×800 nur Tastatur, Profi, Firefox. Optional: 320×568 mit „Größere Schrift". Kein Kindertest, nur Werkzeugbeobachtung.

**Ergebnis:** Beide Runden bis zum Ende gespielt (Entdecker 5/5, Profi 8/8, jeweils Spielstempel), dazu eine Runde bei 320×568 mit großer Schrift. Handlungen: Rolle 1 rund 30 Taps, Rolle 2 rund 45 Tastendrücke (Tab, Shift+Tab, Enter). Die Zusatzrunde bei 320 px lief mit einem Skript, das jede Frage selbst beantwortete. Dadurch habe ich zusätzlich alle Profi-Texte gesehen.

Die Reihenfolge der Aufgaben und der Antworten wird bei jedem Start neu gemischt. Der Ablauf ist deshalb nicht Aufgabe für Aufgabe wiederholbar.

## Befunde

### Muss
- **Keiner blockierend.** Keine Sackgasse, kein Fehler, kein Text hinter der Leiste.

### Soll
1. **Auto-Text erklärt nicht, wie es funktioniert.** Er erzählt nur die Geschichte (Bild f13-p8-richtig.png, Profi Aufgabe 8): „Das Auto hatte Vorläufer, die mit Dampf fuhren. Karl Benz baute einen Wagen mit Benzinmotor. Bertha Benz half ihm und probierte den Wagen aus." Das ist das alte „dass es das gibt", nicht das neue „wie". Vorschlag: ein Satz zum Motor oder zu den Rädern, etwa „Ein Motor dreht die Räder", und Benz kürzer.
2. **Smartphone-Text ist eine Aufzählung statt einer Erklärung** (k07-richtig3.png): „Das Smartphone steckt voller Erfindungen. Ein Akku liefert den Strom, winzige Bauteile rechnen. Funk verbindet es ohne Kabel. Programme bestimmen, was es gerade tut." Er nennt Teile, aber kein „wie". Das Ende „Programme bestimmen, was es gerade tut" ist für 7-Jährige abstrakt. Mit 4 Sätzen liegt er außerdem an der Obergrenze.
3. **Kamera-Text beantwortet die Frage nur halb** (Profi Aufgabe 2, f10-p2-richtig.png). Frage: „Warum kann Licht ein Bild hinterlassen?" Text: „Die Kamera ist ein dunkler Kasten mit einem kleinen Loch. Hinten entsteht ein Bild, das auf dem Kopf steht. Früher hielten es Platten oder Filme fest, heute elektronische Bauteile." Das beschreibt eine Lochkamera. Warum Licht etwas festhält, steht nicht darin. Außerdem hat nicht jede Kamera ein „kleines Loch", sondern meist eine Linse. Ich vermute, ein Fakten-Check lohnt sich.
4. **Firefox, Spielplatz-Liste, Tab auf die Karte „Technik-Detektiv" (f02-fokus-karte.png):** Der Fokus liegt auf der Karte bei y=742–938, die Fensterhöhe ist 800. Die Karte ist also halb abgeschnitten, der Titel nur angeschnitten. Der Rahmen ist nicht ganz sichtbar. Die neue Firefox-Rollhilfe greift hier nicht, sie gilt nur im Rückmeldekasten. Vorschlag: dieselbe Rollhilfe auch für die Kartenliste im Spielplatz. Die Karte liegt nach 31 Tab-Schritten ganz unten in der Liste.
5. **Firefox, nach Enter auf die Karte liegt der Fokus auf `body`.** Eine Tastaturnutzerin muss wieder von vorn zählen: 3 Tabs bis „Ändern", mehr bis zu den Antworten. Im Spiel selbst ist es gut: Nach „Nächste Aufgabe" liegt der Fokus auf der neuen Frage (H2). Vorschlag: nach dem Öffnen eines Spiels den Fokus auf die Überschrift oder die erste Frage setzen.

### Kann
- **Frage Entdecker, Aufgabe 2 (k03-aufgabe2.png):** „Wie werden kleine Strukturen unterscheidbar?" ist für 7-Jährige schwer. „Strukturen" und „unterscheidbar" kennen sie nicht. Das war schon vorher so, nicht Teil der Änderung.
- **Der Tipp ist immer derselbe Satz** (k05-tipp.png): „Worum geht es im Text? Überlege bei jeder Erfindung …". Es gibt aber keinen „Text". Die Rückmeldung bei falscher Antwort wiederholt ihn („Du hast „Die Rakete" gewählt. Worum geht es im Text? …", k01-falsch.png). Er hilft nicht beim Raten.
- **Ratemuster, Wortgleichheit in der Frage:**
  - Entdecker: „Computer an verschiedenen Orten …" mit der Antwortoption „Der Computer", die falsch ist.
  - Entdecker: „telefonieren und gleichzeitig …" mit „Das Telefon" und „Das Smartphone"; richtig ist Smartphone.
  - Das ist kein Fehler, sondern eher gute Ablenkung. Ein 7-Jähriges tippt aber wegen des Wortes daneben, und die Rückmeldung hilft dann nicht.
- **Spielende (k10-ende.png, k11-ende-oben.png, f14-ende.png):** Der Bildschirm ist auf die Überschrift gerollt, Stufe und Haken sind halb abgeschnitten, darunter ist eine große leere Fläche. Der „Stempel" ist nur Text und Haken, es gibt kein Stempelbild. Auf dem Handy führt „Zu einer passenden Entdeckerkarte" weiter, sonst nichts. Das ist ein Hinweis für die Stempel-Gestaltung, nicht für diese Änderung.
- **Knopfname:** Sichtbar steht „Ändern", der Name für Bildschirmleser ist „Stufe ändern". Das ist unkritisch, ich erwähne es nur.
- **Experte (s06-ende-gross.png):** Die Stufe lässt sich wählen. Die Seite sagt ehrlich „Experten-Aufgaben gibt es hier noch nicht. Du spielst Profi." Das ist gut, aber die Stufe sieht trotzdem wählbar aus.

## Ihre Fragen zu den Texten

Nach „Richtig!" steht der Text bei jedem Ablauf gleich im Bild. Handy 390×844: Knopf „Nächste Aufgabe" 722–770 von 844. Rechner 1280×800: Knopf bei 722–770, die Leiste (nur Skiplink) ist nicht im Weg. Handy 320×568 mit großer Schrift: Knopf unten bei 475, Leiste bei 504, also frei. „Erklärung vorlesen" 141×44 px, „Nächste Aufgabe" 150×48 px, „Vorlesen" 79×44 px: alle mindestens 44 px hoch.

- **Gibt der Text ein „Wie"?** Ja bei Internet, Mikroskop, Kühlschrank, Rakete, 3D-Druck, Batterie, Transistor, Telefon, Fernrohr, Buchdruck, Seismograf, Satellit, Eisenbahn und Aufzug. Kaum bei Auto (Geschichte) und Smartphone (Aufzählung), halb bei Kamera.
- **Wiederholt er nur den Hinweis aus der Aufgabe?** Nein, nirgends.
- **Passt er zur gewählten Erfindung?** Ja, bei allen 15 gesehenen.
- **Zu kindisch für 11?** Nein. Die Texte sind knapp und sachlich, der Luftballon bei der Rakete und der Eimer beim Fernrohr sind eher Gewinn. Profi liest sich nicht kindisch.
- **Fokus bei Tastatur (Rolle 2):**
  - Nach der Antwort (Enter) springt der Fokus von selbst auf „Nächste Aufgabe" bzw. „Spielstempel sammeln". Das ist gut.
  - Ein Tab-Schritt vor „Erklärung vorlesen" geht mit Shift+Tab, Tab geht zurück.
  - Der Fokusrahmen ist immer ganz sichtbar: f06, f07 und f13 passen, bei „Nächste Aufgabe" und bei einer falschen Antwort (f09-p2-falsch.png).
  - Nach „Nächste Aufgabe" liegt der Fokus auf der Frage (H2), das Spielende-H2 hat ebenfalls Fokus.
  - Die Rollhilfe im Rückmeldekasten funktioniert in Firefox, auch bei Knopf bei y=722–770.
  - Auffällig ist nur Befund 4 und 5 (Liste/Öffnen).
- **Falsch tippen:** Entdecker „Die Rakete" (k01-falsch.png) und „Das Telefon", Profi „Der Aufzug". Die Rückmeldung „Noch nicht ganz. Versuch es noch einmal!" steht gleich im Bild, die falsche Antwort ist orange markiert. Danach klappt das Richtige.

### Gesehene Erfindungen und Auflösungstext wörtlich
1. **Internet:** „Das Internet verbindet Geräte auf der ganzen Welt. Eine Nachricht reist darin in vielen kleinen Päckchen. Am Ziel werden sie zusammengesetzt wie ein Puzzle."
2. **Mikroskop:** „Das Mikroskop vergrößert meist in zwei Schritten. Die untere Linse macht ein größeres Bild. Die obere vergrößert es noch einmal wie eine Lupe."
3. **Smartphone:** „Das Smartphone steckt voller Erfindungen. Ein Akku liefert den Strom, winzige Bauteile rechnen. Funk verbindet es ohne Kabel. Programme bestimmen, was es gerade tut."
4. **Kühlschrank:** „Der Kühlschrank füllt keine Kälte hinein, er bringt Wärme hinaus. Ein besonderer Stoff in Rohren nimmt innen die Wärme auf. Außen gibt er sie wieder ab."
5. **Rakete:** „Die Rakete stößt hinten sehr schnell Gas aus. Das schiebt sie nach vorn. Lass mal einen aufgeblasenen Luftballon los: Er saust genauso davon. Das klappt sogar im Weltall."
6. **3D-Druck:** „Der 3D-Druck baut einen Gegenstand meist aus dünnen Schichten auf. Jede Schicht ist wie eine Scheibe vom fertigen Ding. Bei manchen Geräten macht Licht flüssiges Material hart."
7. **Kamera:** „Die Kamera ist ein dunkler Kasten mit einem kleinen Loch. Hinten entsteht ein Bild, das auf dem Kopf steht. Früher hielten es Platten oder Filme fest, heute elektronische Bauteile."
8. **Aufzug:** „Der Aufzug hängt oft an Seilen. Am anderen Ende hängt ein Gegengewicht, so muss der Motor weniger heben. Wenn die Kabine zu schnell fährt, klemmt sich eine Bremse fest."
9. **Batterie:** „Die Batterie ist kein Behälter voller Strom. In ihr verändern sich Stoffe, und das liefert elektrische Energie. Die Lampe leuchtet nur, solange der Stromweg keine Lücke hat."
10. **Telefon:** „Das Telefon macht aus deiner Stimme ein elektrisches Signal. Das andere Telefon macht daraus wieder Ton. Viele forschten daran, auch Alexander Graham Bell."
11. **Transistor:** „Der Transistor ist ein Schalter, den kein Finger drückt. Ein schwaches elektrisches Signal schaltet darin einen starken Strom an und aus. Viele sind kleiner als ein Staubkorn."
12. **Auto:** „Das Auto hatte Vorläufer, die mit Dampf fuhren. Karl Benz baute einen Wagen mit Benzinmotor. Bertha Benz half ihm und probierte den Wagen aus."
13. **Fernrohr:** „Das Fernrohr hat vorn eine viel größere Öffnung als dein Auge. Wie ein großer Eimer im Regen fängt es mehr Licht auf. So siehst du auch ganz schwache Sterne."
14. **Buchdruck:** „Der Buchdruck arbeitete mit einzelnen Buchstaben aus Metall. Sie wurden zu einer Seite gelegt, eingefärbt und auf Papier gepresst. Danach konnte man sie für neue Seiten nutzen."
15. **Seismograf:** „Der Seismograf steht auf dem Boden und wackelt bei einem Beben mit. Ein schweres Gewicht darin hängt frei und bleibt fast still. Ein Stift daran malt so eine Zickzacklinie."
16. **Satellit:** „Der Satellit fällt ständig zur Erde, trifft sie aber nicht. Er fliegt so schnell zur Seite, dass er an ihr vorbeifällt. Der erste flog 1957 ins All."
17. **Eisenbahn:** „Die Eisenbahn rollt auf harten, glatten Schienen. Darum kann eine Lok viele schwere Wagen ziehen. Schon 1825 fuhr in England eine Bahn mit Gütern und Menschen."

Nicht gesehen, weil gemischt: Elektrisches Licht, Fahrrad, Generator, Nähmaschine (kam nur als falsche Option). Der Text „Eisenbahn" (Sätze) und „Satellit" sind inhaltlich zu prüfen. Der Satellit-Text beschreibt den freien Fall; „der erste flog 1957" ist sachlich richtig.

## Was Spaß machte
- Luftballon-Vergleich bei der Rakete, Eimer im Regen beim Fernrohr, Puzzle-Päckchen beim Internet, „Kälte hinein / Wärme hinaus" beim Kühlschrank.
- Sofortige Rückmeldung und die gute Tastaturführung (Fokus springt auf „Nächste Aufgabe").
- „Was ist neu?" enthält „Technik-Detektiv: So geht das" (25. November 2026) und „„Richtig!" siehst du jetzt gleich ganz".

## Browser-Meldungen
Keine (weder Konsolenfehler noch Seitenfehler noch gescheiterte Anfragen, in Chromium und Firefox).

## Nicht geprüft
Ton und Vorlesen (nur Knöpfe sichtbar), echte Geräte, WebKit/Safari, Offline. Rolle 2 nur Tastatur, aber auch Maus-Tap bei Rolle 1 nur Chromium. Nur eine Zufallsreihenfolge je Lauf, einzelne Erfindungen (Elektrisches Licht, Fahrrad, Generator, Nähmaschine, Kompass) kamen nicht als richtige Antwort vor.

Bilder und Skripte: /home/user/wunderkompass/.qa-output/spieltest-technik/ (Präfix k = Handy, f = Firefox, s = 320 px mit großer Schrift)

## Entscheidungen (Claude, 25.11.2026)

- **Soll 1 bis 3 (Auto, Smartphone, Kamera) im Technik-PR:** `karten-autor` schreibt neue Fassungen, die das „Wie“ erklären; danach prüfen `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer` unabhängig. Bei der Kamera beantwortet der Text dann auch die Frage der Karte („Warum kann Licht ein Bild hinterlassen?“), und er beschreibt keine reine Lochkamera mehr.
- **Soll 4 und 5 ins BACKLOG** (Eintrag „Fokus und Leiste, Rest“): Beides gab es schon vor diesem Schritt und betrifft alle Spiele und Labore im Spielplatz, nicht nur den Technik-Detektiv. Es braucht „Alle Wege prüfen“.
- **Kann, Tipp-Satz:** im Technik-PR (wie Design-Prüfung Soll 2).
- **Kann, „Strukturen unterscheidbar“** (Entdecker-Frage beim Mikroskop): ins BACKLOG zu den Technik-Fragen auf Entdecker.
- **Kann, gleiche Wörter in Frage und falscher Antwort** („Computer“, „telefonieren“): steht schon im BACKLOG (Smartphone auf Entdecker, neue Fallen); der Computer-Fall kommt dazu.
- **Kann, Spielende und Stempel:** Design-Umbau „Kompass“ (Stempel am Spielende, Eintrag im BACKLOG).
- **Kann, „Ändern“ und „Stufe ändern“:** bleibt. Der sichtbare Text steckt im Namen für Bildschirmleser.
- **Kann, Experte wählbar:** steht im BACKLOG („Technik-Detektiv ohne Experten-Aufgaben“).
