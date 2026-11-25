# Endfassung: kurze Auflösungen im Technik-Detektiv (25.11.2026)

Stand: Claude führt den [Entwurf](2026-11-25-technik-aufloesung-entwurf.md) des `karten-autor` mit den drei Prüfberichten zusammen:

- [Kinder-Redaktion](2026-11-25-technik-aufloesung-kinderredaktion.md)
- [Faktenprüfung](2026-11-25-technik-aufloesung-faktenpruefung.md)
- [Stufenprüfung](2026-11-25-technik-aufloesung-stufenpruefung.md)

Gebaut wird nach dem Merge von „Auflösung und Rückmeldung im Blick“.

## Nachgezählt

Ein Zählskript (nicht im Repository) hat alle 24 Texte gegen die Karten in `app/world-catalog.json` geprüft:

- höchstens 180 Zeichen;
- beginnt mit dem Kartentitel;
- höchstens 13 Wörter je Satz;
- höchstens eine Zahl;
- kein Satz aus dem Hinweis der Aufgabe wiederholt;
- kein anderer Erfindungstitel;
- kein fast wörtlicher Satz aus Einstieg, Einleitung oder Stationen der Karte.

Ergebnis: alle 24 „ok“. Die langen Texte schrumpfen von 316 bis 534 auf 142 bis 180 Zeichen.

## Die 24 Texte

### Lange Erklärungen, die kürzer werden

| ID | Text | Entscheidung |
|---|---|---|
| `invention-camera` | Die Kamera ist ein dunkler Kasten mit einem kleinen Loch. Hinten entsteht ein Bild, das auf dem Kopf steht. Früher hielten es Platten oder Filme fest, heute elektronische Bauteile. | „Platten oder Filme“ (Fakten). „elektronische Bauteile“ statt „Chip“ (Kinder). |
| `invention-telescope` | Das Fernrohr hat vorn eine viel größere Öffnung als dein Auge. Wie ein großer Eimer im Regen fängt es mehr Licht auf. So siehst du auch ganz schwache Sterne. | Wie im Entwurf. Quelle für die Pupille: OpenStax Astronomy (Fakten). |
| `invention-microscope` | Das Mikroskop vergrößert meist in zwei Schritten. Die untere Linse macht ein größeres Bild. Die obere vergrößert es noch einmal wie eine Lupe. | „meist“ ergänzt (Fakten). |
| `invention-battery` | Die Batterie ist kein Behälter voller Strom. In ihr verändern sich Stoffe, und das liefert elektrische Energie. Die Lampe leuchtet nur, solange der Stromweg keine Lücke hat. | Wie im Entwurf (alle drei: taugt). |
| `invention-generator` | Der Generator hat einen Magneten und viel aufgewickelten Draht. Wenn sich der Magnet darin bewegt, fließt im Draht Strom. Die Energie dafür kommt aus der Bewegung. | „viel aufgewickelter Draht“ statt „Spule“ (Kinder). |
| `invention-transistor` | Der Transistor ist ein Schalter, den kein Finger drückt. Ein schwaches elektrisches Signal schaltet darin einen starken Strom an und aus. Viele sind kleiner als ein Staubkorn. | Fassung der Kinder-Redaktion. Beides belegt (CHM, ASML, US EPA; zweite Faktenprüfung). |
| `invention-refrigerator` | Der Kühlschrank füllt keine Kälte hinein, er bringt Wärme hinaus. Ein besonderer Stoff in Rohren nimmt innen die Wärme auf. Außen gibt er sie wieder ab. | Geglättet. Neue Quelle: Penn State EGEE 102 statt Danfoss (Fakten). |
| `invention-bicycle` | Das Fahrrad hat vorn und hinten ein Zahnrad, dazwischen eine Kette. Wenn das hintere kleiner ist, dreht sich das Hinterrad bei jeder Pedalrunde öfter. Dafür trittst du fester. | Eine Kette (Fakten). Kein verdrehter Satzanfang (Kinder). „Du kommst weiter“ ist im zweiten Satz enthalten: mehr Umdrehungen je Pedalrunde. |
| `invention-elevator` | Der Aufzug hängt oft an Seilen. Am anderen Ende hängt ein Gegengewicht, so muss der Motor weniger heben. Wenn die Kabine zu schnell fährt, klemmt sich eine Bremse fest. | Fassung der Faktenprüfung: keine Wippe, Quelle TK Elevator. |
| `invention-seismograph` | Der Seismograf steht auf dem Boden und wackelt bei einem Beben mit. Ein schweres Gewicht darin hängt frei und bleibt fast still. Ein Stift daran malt so eine Zickzacklinie. | Fassung der Kinder-Redaktion. |
| `invention-3d-printing` | Der 3D-Druck baut einen Gegenstand meist aus dünnen Schichten auf. Jede Schicht ist wie eine Scheibe vom fertigen Ding. Bei manchen Geräten macht Licht flüssiges Material hart. | Wie im Entwurf. |
| `invention-sewing-machine` | Die Nähmaschine sticht mit der Nadel den oberen Faden durch den Stoff. Darunter verschlingt sich ein zweiter Faden mit ihm. Dann rückt der Stoff weiter, und alles beginnt neu. | Wie im Entwurf. |

### Kurze Erklärungen, die besser werden

| ID | Text | Entscheidung |
|---|---|---|
| `invention-light` | Elektrisches Licht leuchtet ganz ohne Flamme. Dafür bringen Leitungen den Strom bis ins Haus. Thomas Edison und sein Team bauten Lampen und ein ganzes Stromnetz. | Fassung der Stufenprüfung: kein Glühlampen-Satz mehr, der die Früher-Aufgabe verrät. Damit entfällt auch der Streit Kohlefaden oder Draht (Fakten). Edison-Team und Pearl Street 1882 belegt (NPS, zweite Faktenprüfung). |
| `invention-airplane` | Das Flugzeug hat Flügel, die Luft nach unten lenken. Dabei wird es nach oben gedrückt. 1903 flogen die Brüder Wright mit Motor und konnten dabei lenken. | Kein „Ballons und Gleiter“ mehr, das der Heute-Aufgabe widerspricht (Stufen). „Dabei wird es nach oben gedrückt“ statt „Das drückt es nach oben“, damit es nicht nach „Luft prallt von unten“ klingt (NASA Glenn, zweite Faktenprüfung). |
| `invention-phone` | Das Telefon macht aus deiner Stimme ein elektrisches Signal. Das andere Telefon macht daraus wieder Ton. Viele forschten daran, auch Alexander Graham Bell. | Fassung der Kinder-Redaktion. |
| `invention-computer` | Der Computer folgt einem Programm, also einer Liste genauer Schritte. Er arbeitet sie sehr schnell nacheinander ab. Einen einzigen Erfinder des Computers gibt es nicht. | Wie im Entwurf. |
| `invention-internet` | Das Internet verbindet Geräte auf der ganzen Welt. Eine Nachricht reist darin in vielen kleinen Päckchen. Am Ziel werden sie zusammengesetzt wie ein Puzzle. | Ohne „Rechner“ und ohne „1969 … ersten Rechner“ (Kinder, Stufen, Fakten). |
| `invention-compass` | Der Kompass hat eine magnetische Nadel, die ungefähr nach Norden zeigt. Die Erde wirkt dabei wie ein riesiger Magnet. Ihr magnetischer Nordpol liegt aber nicht genau am Nordpol. | Ohne China und „vor langer Zeit“, das die Aufgabe „Früher und heute“ verrät (Stufen, wichtig). Satz 3 nach der zweiten Faktenprüfung: „Ihr magnetischer Nordpol“, weil „magnetischer Norden“ eine Richtung ist (NOAA NCEI). |
| `invention-printing` | Der Buchdruck arbeitete mit einzelnen Buchstaben aus Metall. Sie wurden zu einer Seite gelegt, eingefärbt und auf Papier gepresst. Danach konnte man sie für neue Seiten nutzen. | „konnte man“ statt Passiv (Kinder). |
| `invention-rocket` | Die Rakete stößt hinten sehr schnell Gas aus. Das schiebt sie nach vorn. Lass mal einen aufgeblasenen Luftballon los: Er saust genauso davon. Das klappt sogar im Weltall. | Mit „Lass mal“ zum Ausprobieren (Leitlinie: zeigen und ausprobieren). |
| `invention-satellite` | Der Satellit fällt ständig zur Erde, trifft sie aber nicht. Er fliegt so schnell zur Seite, dass er an ihr vorbeifällt. Der erste flog 1957 ins All. | Fassung der Faktenprüfung: kein Widerspruch mehr zu „ohne herunterzufallen“. |
| `invention-smartphone` | Das Smartphone steckt voller Erfindungen. Ein Akku liefert den Strom, winzige Bauteile rechnen. Funk verbindet es ohne Kabel. Programme bestimmen, was es gerade tut. | Fassung der Kinder-Redaktion: „winzige Bauteile“ statt „Chip“, ohne „Frühe Geräte“ (Stufen). |
| `invention-car` | Das Auto hatte Vorläufer, die mit Dampf fuhren. Karl Benz baute einen Wagen mit Benzinmotor. Bertha Benz half ihm und probierte den Wagen aus. | Fassung der Stufenprüfung: ohne „oder Strom“ und ohne „frühen“. Schreibweise „Karl Benz“ wie auf der Karte (wird beim Bau geprüft). |
| `invention-railway` | Die Eisenbahn rollt auf harten, glatten Schienen. Darum kann eine Lok viele schwere Wagen ziehen. Schon 1825 fuhr in England eine Bahn mit Gütern und Menschen. | Kein Dampf-Satz, der die Früher-Aufgabe wiederholt (Stufen). 1825 belegt (National Railway Museum, Stockton Council); „harten, glatten“, damit „glatt“ nicht nach Glatteis klingt (zweite Faktenprüfung). |

## Gegeneinander abgewogen

- **Eisenbahn:** Die Kinder-Redaktion wollte den Dampf behalten, die Stufenprüfung nicht. Entschieden für die Stufenprüfung: Die Aufgabe „Früher oder heute?“ fragt genau danach.
- **Licht:** Die Faktenprüfung wollte „Kohlefaden“ statt „Draht“, die Stufenprüfung gar keinen Glühlampen-Satz. Entschieden für die Stufenprüfung, damit ist beides gelöst.
- **Flugzeug:** zwei Auftriebs-Fassungen. Genommen ist die kürzere mit „Luft nach unten lenken“; sie braucht keinen Fachbegriff.
- **Internet:** Beide Fassungen ohne „Rechner“ sind fast gleich; genommen ist die mit dem Puzzle-Bild.

## Noch offen vor dem Einbau

1. ~~Zweite Faktenprüfung~~ erledigt ([Bericht](2026-11-25-technik-aufloesung-faktenpruefung-2.md)): nichts falsch; übernommen bei Kompass, Eisenbahn, Flugzeug und Fahrrad („kleiner“ statt „klein“). Nicht übernommen: „an der Schiene“ beim Aufzug, weil der Satz dann verdreht anfängt; der Satz stimmt auch so. Alle 24 neu gezählt: ok.
2. **Kartenkorrekturen**, eigener kleiner Schritt mit Faktenprüfung:
   - Licht: Quelle Science Museum Group co42487 für Swan und die NPS-Biografie (Pearl Street) ergänzen, statt zweimal derselben Kinderseite;
   - Kompass: NOAA-NCEI-FAQ als Quelle ergänzen;
   - Kühlschrank: Penn State EGEE 102 statt Danfoss;
   - Aufzug: Gegengewicht trägt die Kabine und einen Teil der Last (TK Elevator);
   - Schreibweise Karl oder Carl Benz einheitlich.
3. **BACKLOG** (nicht in diesem Schritt):
   - Punkt 25: die kurzen Texte noch einmal prüfen, wenn „Früher oder heute?“ umgebaut wird;
   - Smartphone, Stufe Entdecker: die falsche Antwort „Das Telefon“ ist zu schwer;
   - Technik-Detektiv: Aufgaben für die Stufe Experte („übertragen“, „Fehler finden“).
4. **Einbau:**
   - `TECHNIK_AUFLOESUNG` in `app/world-game-support.mjs` statt `stages[2].text`;
   - ein Test, dass alle 24 vorhanden sind und mit dem Kartentitel beginnen (`tests/world-game-learning-copy.test.mjs`);
   - „Was ist neu?“-Eintrag.
