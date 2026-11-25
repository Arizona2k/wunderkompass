# Stufen-Prüfung: T21 (Clownfisch, Tierdetektiv) und N15 („Fleisch“ als Profi-Falle)

> Helferbericht (stufen-pruefer, opus), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

Ich habe nichts geändert. Einzige neue Datei ist das Rechenskript `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/stufen-sim/sim.mjs`. Es spielt die Futter-Runden der Stufe Profi mit derselben Zählung wie `tests/ratemuster.test.mjs` nach: 120 Startwerte, Test-Loader aus wt-tier.

### 1. Gesamteindruck
- **T21** schadet keiner Frage. Die Hauptfrage der Karte ist schon vorher an drei anderen Stellen beantwortet, und der Satz mit der Qualle hilft beim Behalten.
- **N15** beseitigt das Ratemuster. Bei Giraffe und Dromedar ist „Fleisch“ als Profi-Falle aber fast eine Quatsch-Antwort: Aus vier Antworten werden praktisch drei. Es gibt eine gleich wirksame Lösung mit Fallen, die wirklich in die Irre führen können.

### 2. Urteile

**T21: ok**
- **Wann ein Kind die Auflösung sieht:** Ja, es kann sie vor der Kartenfrage sehen. Der Tierdetektiv ist unabhängig von der Karte spielbar.
- **Warum das nicht schadet:** Die Lösung der Kartenfrage steht schon an drei anderen Stellen:
  - Der Tipp im Tierdetektiv sagt sie wörtlich, und zwar *vor* der Antwort: „Seeanemonen sind Tiere.“ (`app/animal-detective-clues.json`)
  - Der Einleitungssatz der Karte: „… einer Seeanemone, und die ist auch ein Tier.“
  - Der Absatz „Für Große“: „Seeanemonen sind ebenfalls Tiere, keine Pflanzen.“
- Der Satz „wie bei einer Qualle“ sagt also nichts Neues. Er stützt das Wissen nur, ohne die Verwandtschaft auszusprechen.
- **Stufe der Frage:** Die Kartenfrage („Was ist die Seeanemone beim Clownfisch?“, 3 Antworten) ist eine Entdecker-Frage. Erkennen und Erinnern reicht dort. Dass ein Kind sich nach dem Spiel daran erinnert, ist gewollt und kein Verrat.
- **Andere Fragen:** Es gibt keine weitere Frage zur Seeanemone als Pflanze, weder auf der Karte (keine Zusatzfragen, keine „Stimmt das?“-Sätze, keine Challenge-Fragen) noch in den Spielen. Eine Karte zur Qualle gibt es nicht, also kann nichts über Kreuz verraten werden.
- **Eigene Aufgabe im Tierdetektiv:** Die Auflösung erscheint erst nach „Richtig!“ und ändert die Aufgabe selbst nicht.
- **Hinweis:** Im Arbeitsordner steht in `app/world-game-tier-aufloesung.json` noch der alte Satz mit den Brennnesseln. Die neue Fassung gibt es bisher nur im Entwurf. Ich habe sie geprüft, nicht den eingebauten Stand.

**N15: ok mit Vorschlag**
- **Was gut ist:** „Fleisch“ ist für alle drei Tiere eindeutig falsch, und das Ratemuster ist weg. Rechnung mit Stand N15: „Fleisch“ steht in 153 Aufgaben, 101-mal ist es richtig, das ist eine Quote von 0,66 (Grenze 0,8). Vor N15 waren es 0,86, also ein Fund.
- **Was schwach ist:** Profi zieht 3 aus 5 Fallen, also steht „Fleisch“ in 60 % der Aufgaben zu diesen drei Tieren. Dass Giraffe und Dromedar kein Fleisch fressen, weiß schon ein 6-jähriges Kind. Die Falle ist wortgleich mit der Entdecker-Falle derselben Tiere. Das widerspricht der Profi-Regel „falsche Antworten wirklich ähnlich“. Beim Okapi ist es anders: Viele Kinder kennen das Tier nicht, dort ist „Fleisch“ eine echte Frage.

### 3. Befunde und Vorschläge

**a) N15, Vorschlag A (empfohlen)**
`world-game-tier-fallen.json` → `nahrung` → `profi`:
- `animal-giraffe`: „Fleisch“ wieder streichen.
- `animal-dromedary`: „Fleisch“ wieder streichen.
- `animal-okapi`: „Fleisch“ behalten.
- `animal-honey-bee`: „Fleisch“ ergänzen. Denkanstoß: Bienen und Wespen werden oft verwechselt. Wespen gehen an Wurst und Kuchen, Honigbienen nicht.
- `animal-koala`: „Fleisch“ ergänzen. Denkanstoß: Viele sagen „Koalabär“, und Bären fressen auch Fleisch.
- `animal-western-lowland-gorilla`: bleibt wie es ist. Groß und stark, aber er frisst vor allem Pflanzen.

Nachgerechnet: Quote 0,69 (147 Aufgaben, 101 richtig). Im Test bleibt nur „verschiedene“ als Ausnahme.

**b) Vorschlag B (Alternative)**
Wie A, nur ohne Okapi. Quote 0,73, also weniger Abstand zur Grenze. A ist mir lieber.

**c) Vorsicht beim Großen Panda**
„Fleisch“ nicht beim Panda eintragen. Pandas fressen selten auch Fleisch, das wäre wieder „zum Teil zutreffend“, also derselbe Grund wie bei den 8 gestrichenen Fallen. Ebenso ungeeignet sind Strauß, Grüne Meeresschildkröte (Jungtiere fressen Tiere) und Orang-Utan.

**d) Freiwillig, gleicher Gedanke**
Beim `animal-north-american-beaver` (Profi) eine der Fallen „Bambus“ oder „Eukalyptusblätter“ durch „Vor allem kleine Fische“ ersetzen. Viele glauben, Biber fressen Fisch, das ist eine echte Profi-Falle. Den Text gibt es schon als richtige Antwort bei Eisvogel und Papageitaucher.

**e) Schon vor N15 vorhanden: Giraffe, Rotes Riesenkänguru, Elefant**
Die richtige Antwort „Pflanzen“ ist dort die einzige allgemeine. Die Fallen sind bestimmte Pflanzen anderer Tiere („Eukalyptusblätter“, „Bambus“, „Nektar und Pollen“). Man rät dann nach „das Allgemeinste ist richtig“, und ein genaues Kind könnte sagen: „Eukalyptusblätter sind doch auch Pflanzen.“ Der Wörter-Test findet das nicht. Vorschlag für BACKLOG Punkt 25: nur einordnen, nicht in diesem PR.

**f) Kartenhinweis Clownfisch, nicht durch T21 entstanden**
- Fundstelle: `app/world-catalog.json`, `animal-eastern-clown-anemonefish`, `questionFeedback.hint`.
- Problem: „Suche in der Karte nach ihrer Tiergruppe“ führt zur Zeile „Tiergruppe: Fische“, und die gehört zum Clownfisch. Das kann ein Entdecker-Kind in die Irre führen.
- Vorschlag: „Eine Seeanemone sieht aus wie eine Blüte. Aber sie hat Fangarme und fängt damit Futter. Kann das eine Blume?“ Der Hinweis passt zur neuen Auflösung. Er ist für einen Entdecker-Hinweis bewusst deutlich.

**g) Kurzhinweis zur Hauptfrage**
- Fundstelle: `app/challenge-hints.json`, `animal-eastern-clown-anemonefish:mini`.
- Problem: „… selbst Nahrung aufnimmt und auf ihre Umgebung reagiert“ ist für 6-Jährige zu abstrakt. Auch Pflanzen reagieren auf ihre Umgebung.
- Vorschlag: „Eine Blume kann nichts fangen. Die Seeanemone fängt mit ihren Fangarmen kleine Tiere.“ Der fakten-pruefer müsste das bestätigen.

### 4. Lücken
- **Clownfisch-Karte:** Sie hat nur die Entdecker-Frage, es fehlen Profi und Experte. Passend aus S5 wäre „übertragen“ oder „Ursache finden“. Beispiel für Experte: „Ein anderer kleiner Fisch schwimmt in die Seeanemone und wird verletzt. Der Clownfisch nicht. Woran liegt das?“ Antworten: „An seiner Schleimschicht auf der Haut“ (richtig) / „An seinen orange-weißen Streifen“ / „Daran, dass die Seeanemone Fische nicht fängt“ / „Daran, dass er nur nachts kommt“. Die Lösung steht nur in der Auflösung des Spiels, nicht in einem Kartensatz. Vorher prüfen, ob „Schleimschicht“ auf die Karte soll.
- **Futter-Spiel:** Es hat keine Experten-Aufgaben, Experte spielt dort Profi (E3, bekannt).

### 5. Unsicher
- **Ob die Fallen wirklich verführen:** Ob „Fleisch“ bei Honigbiene oder Koala Kinder von 8 bis 10 Jahren tatsächlich verführt, ist meine Einschätzung. Das klärt nur die Rückmeldung echter Kinder.
- **Fakten zu Vorschlag a und d:** Honigbiene frisst kein Fleisch, Koala frisst kein Fleisch, Biber frisst keinen Fisch. Das muss der fakten-pruefer bestätigen, bevor es eingebaut wird.
- **Eukalyptus im Zoo:** Ob Giraffen in Zoos auch Eukalyptuszweige bekommen (betrifft Befund e), weiß ich nicht. Bitte ebenfalls dem fakten-pruefer geben.
- **Rechnung:** Die Quoten gelten für die 120 festen Startwerte des Tests. Bei echtem Zufall schwanken sie etwas, Vorschlag A liegt aber deutlich unter 0,8.
