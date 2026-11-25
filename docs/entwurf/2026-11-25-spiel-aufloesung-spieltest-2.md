# Nachprüfung Spieltest „Auflösung und Rückmeldung im Blick“

Helfer: `spieltester` (sonnet / high), 25.11.2026, Stand nach den Korrekturen aus Code-, Spiel- und Designprüfung (lokaler Build). Kein Kindertest.

**Auftrag:** Zwei Rollen, Stand lokal http://127.0.0.1:4310/ nach den Korrekturen. Das ist kein Kindertest. Bilder liegen in `/home/user/wunderkompass/.qa-output/spieltest-aufloesung-2/`.
- Rolle 1: 7 Jahre, Handy 360×640 mit Touch, „Wer war das?“, Entdecker.
- Rolle 2: 9 Jahre, 320×568 mit Touch, „Größere Schrift“ eingeschaltet, Technik-Detektiv, Entdecker.

**Ergebnis:** Ziel erreicht. Rolle 1 hat 5 von 5 gespielt, Rolle 2 mehrfach 5 von 5. Keine Sackgasse.

**Muss 2: nur teilweise erledigt.** Der Teil „Richtig! sichtbar“ ist behoben. Der Teil „Fokus liegt unter der Leiste“ ist es nicht, wenn man mit Tab weitergeht.

### Rolle 1 (7 Jahre, 360×640)
Ich habe bei jeder Aufgabe zuerst absichtlich falsch getippt, dann weiter probiert, und das 3-mal.
- Nach jeder Antwort sah ich den Kasten sofort, ohne selbst zu rollen. Der Kasten endete immer bei 564 px, die Leiste beginnt bei 576 px.
- Die Kästen waren 226 px („Noch nicht ganz“) und 271 bis 298 px („Richtig!“) hoch. Alles war im Bild.
- Der Fokus steht nach „Richtig!“ auf „Nächste Aufgabe“ (499 bis 547 px, sichtbar). Bei der letzten Aufgabe heißt der Knopf „Spielstempel sammeln“.
- Bilder: `r1-01-a1-nach-antwort.png`, `r1-03-a2-v2.png` (Kasten voll sichtbar, Abstand zu „Erklärung vorlesen“ gut), `r1-09-ende.png` („Eine ganze Runde gelöst!“).
- „Richtig!“ und „Noch nicht ganz“ sind gut lesbar.

### Rolle 2 (9 Jahre, 320×568, große Schrift)
In den Einstellungen („Entdeckerpass öffnen“, dann „Größere Schrift“) schaltete ich die Schrift ein. Der Schalter steht danach auf „an“, und die Schrift ist deutlich größer.

Bei kurzen und mittleren Erklärungen (355 bis 385 px hoch) passt alles. „Richtig!“ und „Nächste Aufgabe“ sind sichtbar, der Fokus liegt auf dem Knopf (Bild `lang-03-a1-richtig.png`).

Bei langen Erklärungen ist der Kasten höher als der freie Platz. Das passierte bei Mikroskop, Teleskop, Aufzug, 3D-Druck, Magnet und Elektrode. Gemessene Kastenhöhen: 537, 568, 598, 628, 689, 719 und 780 px.
- „Richtig!“ steht oben im Bild (12 bis 60 px), der Fokus liegt darauf. Das ist die Verbesserung (Bilder `r2-03-a1-richtig.png`, `lang-05-a2-richtig.png`).
- Der Text läuft nach unten aus dem Bild. „Nächste Aufgabe“ ist nicht zu sehen. Bei 537 px Kasten liegt sie halb hinter der Leiste (477 bis 532 px, Leiste ab 504 px). Bei 568 px und mehr liegt sie ganz dahinter.
- Das Kind muss von Hand scrollen. Dann ist der Weg frei (`r2-04-a1-handscroll.png`: Knopf und Luft darunter, die Leiste verdeckt nichts mehr). Beim 689-px-Kasten ist nur der Text abgeschnitten, ein Hinweis aufs Weiterscrollen fehlt.
- Tastatur (Tab, Tab, Enter) bei einem hohen Kasten, Bild `r2-06-a1-tab2.png`:
  - Tab 1 geht auf „Erklärung vorlesen“ (464 bis 508 px, halb hinter der Leiste).
  - Tab 2 geht auf „Nächste Aufgabe“ (504 bis 558 px). Der Knopf liegt fast ganz hinter der Leiste, nur sein oberer Rand mit dem Fokusrahmen schaut heraus. Der Browser hat nur 4 px nachgerollt.
  - Enter funktioniert trotzdem und führt zu „Aufgabe 2 von 5“.

Bei kleinen Kästen (der Fokus liegt sofort auf „Nächste Aufgabe“) führt Tab weg von der Aufgabe: zu „Was ist neu?“ und „Für Eltern“. Dort ist nicht nötig, Tab zu drücken, und das ist unkritisch.

## Muss
1. **Fokus bei hohem Kasten per Tab nicht sichtbar** (Kaputt / Sieht falsch aus, Rest von Muss 2).
   - Nachstellen: 320×568, „Größere Schrift“ an, Technik-Detektiv, Entdecker, eine Aufgabe mit langer Erklärung richtig beantworten (z. B. Teleskop oder 3D-Druck), zweimal Tab drücken.
   - Der Knopf „Nächste Aufgabe“ mit Fokus liegt hinter der Leiste. Wer mit Tastatur oder Schalter bedient, sieht nicht, was fokussiert ist.
   - Vorschlag: Beim Fokus auf „Erklärung vorlesen“ und „Nächste Aufgabe“ die Seite so rollen, dass der Knopf über der Leiste landet, z. B. mit `scroll-padding-bottom` ab Leistenhöhe plus etwa 16 px. Oder beim Fokuswechsel von Hand nach `scrollIntoView({block:'center'})` rollen.

## Soll
2. **Bei sehr hohen Kästen fehlt für Touch ein Hinweis, dass es weitergeht.** Das Kind sieht „Richtig!“, aber keinen Knopf. Es muss von selbst auf Scrollen kommen (Bild `lang-05-a2-richtig.png`). Ein 9-jähriges Kind wird wohl scrollen. Ein 6-jähriges nicht unbedingt. Vorschläge: Den Knopf „Nächste Aufgabe“ bei hohem Kasten über der Erklärung zeigen oder ihn unten an der Leiste festhalten. Oder die Erklärungen kürzen (die bei Technik mit 689 bis 780 px bei großer Schrift sind lang).
3. Die Auflösungen bei Technik haben Zwischenüberschriften („Digitaler Entwurf: …“, „Querschnitt einer Schicht: …“). Bei einem Kind von 9 Jahren sind das viele Fachwörter und viel Text auf einmal.

## Kann
4. Ein Kühlschrank kam in 6 Läufen nicht vor, die Aufgaben sind je Lauf gemischt. Ich konnte also genau diese Aufgabe nicht prüfen. Dafür waren andere Erklärungen genauso lang.

## Was gut ist
- Der Fokus auf „Nächste Aufgabe“ und der Kasten über der Leiste funktionieren verlässlich bei normaler Schrift und bei mittleren Kästen mit großer Schrift.
- „Richtig!“ steht jetzt auch bei den höchsten Kästen oben, mit Fokus darauf.
- Mehr Abstand zwischen „Erklärung vorlesen“ und „Nächste Aufgabe“ ist sichtbar.

## Browser-Meldungen
Keine Konsolenfehler, Seitenfehler oder gescheiterte Anfragen. Die kurze Server-Unterbrechung hat keine Schritte beeinflusst. Ich habe nur den Lauf nach der Meldung gewertet.

## Nicht geprüft und Ehrlichkeit
- Ton und Vorlesen, 3D, andere Browser, echtes Gerät.
- Wenn „Größere Schrift“ eingeschaltet ist, steht die Wurzelschrift weiter auf 16 px. Es greift offenbar eine andere Einstellung. Das Ergebnis ist trotzdem sichtbar größer.
- Das Limit von rund 30 Handlungen habe ich überschritten (etwa 100 Taps), weil die Aufgaben je Lauf gemischt sind und ich mehrere Läufe brauchte.
- Dateien im Repository habe ich nicht geändert. Nur Skripte und Bilder liegen in `.qa-output/spieltest-aufloesung-2/`.
