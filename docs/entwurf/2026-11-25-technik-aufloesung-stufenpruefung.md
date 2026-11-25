# Stufen-Prüfung: kurze Auflösungen im Technik-Detektiv

Helfer: `stufen-pruefer` (opus/high), 25.11.2026, zum [Entwurf](2026-11-25-technik-aufloesung-entwurf.md).

Geprüft habe ich `/home/user/wunderkompass/docs/entwurf/2026-11-25-technik-aufloesung-entwurf.md` mit `app/world-game-bank.ts`, `app/world-game-runde.ts`, `app/world-game-support.mjs` und `app/world-catalog.json`. Ich habe nichts geändert.

## Gesamteindruck

Die 12 Auflösungen der Walkthrough-Karten sind aus Sicht der Stufen gut. Sie erklären, wie etwas funktioniert, und räumen oft mit einem Irrtum auf (Kühlschrank, Batterie, Rakete, Satellit). Das ist auch für 10- bis 12-Jährige neu. Probleme gibt es nur bei den 12 kurzen Karten, und zwar fast nur im Zusammenspiel mit „Früher oder heute?“: Drei Texte wiederholen dort eine Aufgabe. Zwei Texte widersprechen einer dortigen Lösung, und ein Kind, das klug denkt, wird dafür bestraft.

## Grundlage aus dem Code

- **Technik-Detektiv:** Alle Stufen bekommen dieselbe Frage und dieselbe Auflösung (`why`). Entdecker hat 3 Antworten mit festen Fallen und 5 Aufgaben. Profi hat 4 Antworten, die Fallen sind die fünf zeitlich nächsten Erfindungen, dazu kommen 8 Aufgaben. Experte spielt Profi (`weltSpielStufe`). Die Auflösung erscheint nur nach „Richtig!“. Nach einer falschen Antwort kommt der allgemeine Tipp.
- **„Früher oder heute?“** (`world-game-bank.ts`, Zeile 59) nutzt nur die 12 Karten ohne Walkthrough. Die Früher-Aufgabe ist `stages[3]`, die Heute-Aufgabe `stages[4]`, beim Kompass stattdessen `comparisonQuestion` mit der Lösung „Früher und heute“. Als Rückmeldung zeigt das Spiel den jeweils anderen Satz. Die 12 Walkthrough-Karten überschneiden sich also gar nicht.
- **Wichtig für die Gewichtung:** „Früher oder heute?“ ist heute schon über die Zeitform lösbar. Alle Früher-Sätze stehen in der Vergangenheit, alle Heute-Sätze in der Gegenwart. In 5 der 12 Früher-Sätze steht sogar „früh-“ (Flugzeug, Telefon, Computer, Kompass, Smartphone). Das ist bekannt (`BACKLOG.md`, Punkt 25). Ob ein Kind eine Früher-Aufgabe dort wiedererkennt, kostet darum heute kaum etwas. Schaden richtet etwas an, wenn eine Auflösung (a) die einzige echte Denkaufgabe dort vorwegnimmt (Kompass) oder (b) einer dortigen Lösung widerspricht (Auto, Flugzeug).

## 1. Überschneidung mit „Früher oder heute?“

**Meine Regel:** Wiederholung über zwei Spiele hinweg ist erwünschtes Weiterlernen, solange die Auflösung das Prinzip erklärt. Sie wird zum Verraten, wenn sie das Prinzip mit einem Zeitstempel verbindet („die ersten …“, „schon vor langer Zeit“). Genau so sollen die künftigen Aufgaben mit der Lösung „Früher und heute“ aus Punkt 25 aussehen, und die blieben dann keine Denkaufgaben mehr.

| ID | Urteil | Grund | Vorschlag (geprüft: Zeichen, Wörter je Satz, Zahlen) |
|---|---|---|---|
| `invention-compass` | **umformulieren (wichtig)** | Prinzip in der Gegenwart plus „Seefahrer in China … vor langer Zeit“ ergibt genau die Lösung „Früher und heute“ der Vergleichsfrage. Das ist dort die einzige Aufgabe, bei der man zwei Tatsachen verbinden muss. Danach wäre sie nur noch Wiedererkennen. | „Der Kompass hat eine magnetische Nadel, die ungefähr nach Norden zeigt. Die Erde wirkt dabei wie ein riesiger Magnet. Der magnetische Norden liegt aber nicht genau am Nordpol.“ (175; 11/8/9; 0 Zahlen). Satz 3 steht inhaltlich in `stages[4]`; bitte vom `fakten-pruefer` prüfen lassen. |
| `invention-light` | **umformulieren** | „In den ersten Glühlampen glühte … ein dünner Draht“ ist `stages[3]` mit Zeitstempel, also fast wörtlich die Früher-Aufgabe. Dazu kommt derselbe Satz dort als Rückmeldung zur LED-Aufgabe. Das Kind liest ihn dreimal, und für Große ist er nicht neu. | „Elektrisches Licht leuchtet ganz ohne Flamme. Dafür mussten Leitungen den Strom bis ins Haus bringen. Swan, Edison und viele andere verbesserten Lampen und Leitungen.“ (166; 6/9/9; 0). Die Karte sagt „Lampen und Stromversorgung“. Dass Swan auch an Leitungen arbeitete, sollte der `fakten-pruefer` prüfen; sonst „Edison und sein Team bauten auch Leitungen“. |
| `invention-railway` | **umformulieren** | „Die ersten Loks fuhren mit Dampf“ ist `stages[3]` mit Zeitstempel. Wie Schienen helfen, erklärt der Text nicht. | „Die Eisenbahn fährt auf Schienen, auf denen Räder leicht rollen. So zieht eine Lokomotive viele schwere Wagen. 1825 öffnete in England die Bahn von Stockton nach Darlington.“ (173; 10/7/10; 1 Zahl). Den geringen Rollwiderstand muss der `fakten-pruefer` belegen. |
| `invention-car` | **umformulieren (klein)** | „Vorläufer, die mit … Strom fuhren“ macht die Heute-Aufgabe mit dem Elektromotor zur Falle für Kinder, die denken: Wer sich das gemerkt hat, wählt „Früher“ und gilt als falsch. „frühen Wagen“ plus Benz zeigt zudem auf die Früher-Aufgabe „Benz-Motorwagen“. | „Das Auto hatte Vorläufer, die mit Dampf fuhren. Karl Benz baute einen Wagen mit Benzinmotor. Bertha Benz half ihm und probierte den Wagen aus.“ (Wortzahlen 8/7/9, 0 Zahlen.) „Strom“ kommt zurück, wenn Punkt 25 die Heute-Aufgabe zum Auto neu fasst. |
| `invention-airplane` | **umformulieren** | „Vorläufer: Ballons und Gleiter“ widerspricht der Heute-Aufgabe zum Flugzeug („Auch Gleitflugzeuge … können fliegen“, Lösung Heute). Diese Mehrdeutigkeit steht bereits in Punkt 25. Außerdem nennt der Text nur Namen und ein Jahr, aber kein Wie. | „Das Flugzeug hält sich mit seinen Flügeln in der Luft. Strömt Luft schnell an ihnen vorbei, entsteht eine Kraft nach oben. 1903 flogen die Brüder Wright mit Motor und Steuerung.“ (177; 10/11/9; 1). Der Auftrieb steht in `stages[1]` und ist vereinfacht; bitte vom `fakten-pruefer` prüfen lassen. |
| `invention-printing` | **lassen** | „einzelne Buchstaben … zu einer Seite“ entspricht inhaltlich der Früher-Aufgabe. Das ist aber das Wie selbst, und „Danach ließen sie sich für neue Seiten nutzen“ ist für Große neu. Die Früher-Aufgabe ist über die Zeitform ohnehin lösbar. | – |
| `invention-phone` | **lassen** | Ohne „Leitung“ gibt es keinen Konflikt mit Früher oder Heute. Das Prinzip ist gut erklärt. | – |
| `invention-internet` | **umformulieren (niedrig)** | „1969 verband ein Vorläufer die ersten Rechner“ zeigt auf die Früher-Aufgabe. Wichtiger ist etwas anderes: „Rechner“ steht als Ersatz für „Computer“. Auf Profi ist das Internet eine Falle bei der Computer-Frage („Große **Rechnungen** …“), und das Wort lockt dorthin. | „Das Internet verbindet viele Netze auf der ganzen Welt. Nachrichten reisen darin in kleinen Päckchen und werden am Ziel zusammengesetzt. 1969 gab es einen ersten Vorläufer.“ (172; 9/11/6; 1) |
| `invention-smartphone` | **umformulieren (niedrig)** | „Frühe Geräte dieser Art …“ wiederholt den Anfang der Früher-Aufgabe („Frühe Kombinationsgeräte …“). Für 10- bis 12-Jährige ist der Rest Alltag. | „Das Smartphone vereint viele Erfindungen: Funk, Chips, Akku und Bildschirm. Programme bestimmen, was es gerade tut. Seinen Ort findet es mit Funksignalen aus dem All.“ (166; 10/6/9; 0). Den Ortungssatz muss der `fakten-pruefer` belegen. „Satellit“ steht bewusst nicht im Text. |
| `invention-computer`, `invention-rocket`, `invention-satellite` | **lassen** | Sie erklären das Prinzip ohne Zeitstempel. Ein Zeitbezug steht dort nur in der Gegenwartsform oder in einem Jahr, und das verrät nichts zusätzlich. | – |

## 2. Verraten im eigenen Spiel

- **Andere Stufe:** Das geht nicht, denn Frage und Auflösung sind auf allen Stufen gleich, und Experte spielt Profi. Eine Profi-Runde nach einer Entdecker-Runde zeigt dieselben Fragen. Dass das Kind sich dann erinnert, ist gewollt (Wiederholung), es liegt nicht an der Auflösung.
- **Dieselbe Runde:** Ich habe jede Auflösung gegen die Fragen der Karten geprüft, die als Falle vorkommen (Entdecker fest, Profi die fünf zeitlich nächsten ohne die Ausschlussliste). **Keine Auflösung verrät eine spätere Lösung.** Folgende Berührungen gibt es:
  - Internet, „Rechner“ und die Computer-Frage: siehe oben, eine leichte Fehlleitung.
  - Mikroskop („Linse“) bei der Fernrohr-Frage (Linsen oder Spiegel, Mikroskop ist dort Profi-Falle): Das Mikroskop wird zur stärkeren, aber fairen Falle, „weit entfernt“ entscheidet. Gut so.
  - Rakete („im Weltall“) bei der Satelliten-Frage (Rakete ist dort Profi-Falle, weil der Ausschluss nur in eine Richtung gilt): eine faire Falle, „Erde beobachten“ entscheidet.
  - Fernrohr („Sterne“) und Kompass („… oder Sterne“): Das Fernrohr ist bei der Kompass-Frage ausgeschlossen, das ist also unkritisch.
- **Randnotiz:** Beim Fernrohr zeigt das Spiel `recognitionClue`, nicht die Forscherfrage. Den Grundsatz des Entwurfs („beantwortet die Forscherfrage“) sieht das Kind dort also nicht. Der Text passt trotzdem.

## 3. Alle 24 oder nur 12?

**Alle 24.** Aus Sicht der Stufen spricht nichts dagegen. Weil es nur einen Text für alle Stufen gibt, hilft ein einheitlicher Anfang mit dem Kartentitel gerade Entdeckern, die geraten haben: Sie sehen sofort, welche Antwort richtig war. Eine Bedingung gibt es: Die 12 kurzen Texte folgen der Regel „Prinzip ohne Zeitstempel, nichts gegen eine Lösung von ‚Früher oder heute?‘“. Wenn Punkt 25 umgesetzt wird, müssen sie noch einmal gegen die neuen Aufgaben geprüft werden. Das sollte als Merkpunkt in Punkt 25 stehen.

## 4. Ratemuster und Mehrwert für Große

- **Kein Ratemuster:** Die Auflösung kommt erst nach „Richtig!“. Dass ein Text auf jeder Stufe gleich gut passt, liegt am Aufbau und ist hier richtig.
- **Kaum Neues für 10- bis 12-Jährige:** Licht und Eisenbahn in der Fassung des Entwurfs, Smartphone und teilweise Auto (nur „wer“). Die Vorschläge oben beheben das bis auf das Auto.
- **Stark für Große:** Satellit („vorbeifallen“), Rakete, Kühlschrank, Batterie, Generator, Fahrrad, Computer („kein einziger Erfinder“).
- Fahrrad, Satellit und Transistor sind für Sechsjährige anspruchsvoll. Das schadet nicht, weil nichts gewertet wird und Lesen freiwillig ist; ob die Sprache passt, prüft die `kinder-redaktion`.

## Lücken (außerhalb des Entwurfs)

- **Keine Experten-Aufgaben:** Der Technik-Detektiv hat keine; Experte spielt Profi. Passend aus S5 wäre „übertragen“: Die Frage beschreibt das Prinzip, zum Beispiel „Wärme wird hinausgebracht“, und gesucht ist die Erfindung. Oder „Fehler finden“ zu den Irrtümern, die die neuen Auflösungen aufgreifen („Eine Batterie ist ein Behälter voller Strom. Stimmt das?“). Die neuen Auflösungen sind dafür gutes Material.
- **Nebenbefund:** Auf Entdecker hat die Smartphone-Frage („… telefonieren und gleichzeitig …“) die feste Falle „Das Telefon“. Das ist für Sechsjährige eine harte Wortfalle. Sie sollte auf die Ausschlussliste oder bei Entdecker ersetzt werden.

## Unsicher

- Ob Kinder die Auflösung nach „Richtig!“ überhaupt lesen oder gleich auf „Nächste Aufgabe“ tippen, und ob sie sie sich bis „Früher oder heute?“ merken, kann nur echte Rückmeldung von Kindern klären.
- Wörtliche Nähe habe ich durch Lesen beurteilt, nicht mit einem Skript. Gemessen habe ich nur Zeichen, Wörter je Satz und Zahlen meiner Vorschläge (mit `node -e`).
- Alle neuen Sachaussagen in meinen Vorschlägen brauchen noch die Prüfung durch den `fakten-pruefer`: Kompass Satz 3, Licht Satz 2, Eisenbahn Satz 1, Flugzeug Satz 2, Smartphone Satz 3.
