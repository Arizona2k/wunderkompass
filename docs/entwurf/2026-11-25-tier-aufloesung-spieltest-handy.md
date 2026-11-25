# Spieltest Tierdetektiv, 6 Jahre mit Elternteil, Handy (Entwurf des Berichts)

> Helferbericht (spieltester, sonnet), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.
>
> **Anmerkung von Claude:** Gespielt wurde das alte Spiel „Tierdetektiv“ (`app/advanced-games.tsx`, fünf Spuren), nicht das Welt-Spiel „Tierdetektiv – neue Spuren“ (`app/world-games.tsx`), das der Tier-PR ändert. Mein Auftrag nannte das Spiel nicht eindeutig. Darum fehlen dort Denkfrage und neue Auflösung. Der Spieltest des Welt-Spiels wird nachgeholt. Die Befunde zum alten Spiel (Rückmeldung hinter der Leiste, Lernhilfe mit „Lebensraum“ und „Eigenschaften“, abgeschnittene Frage) und die fast gleichen Namen zweier Spiele kommen ins BACKLOG (Umbau-Schritt 6, ein Spielbrett für alle Spiele).

Kein Kindertest, sondern Spieltest in der Rolle. Bilder liegen alle in `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/spieltest-tier-handy/` (Nummer vorn, z. B. `02-a1-richtig.png`). Skripte: `/home/user/wunderkompass/.qa-output/spieltester/tier-handy/`.

## 1. Auftrag
- **Rolle:** 6 Jahre, mit Mama oder Papa, Mama liest vor, das Kind tippt.
- **Ziel:** Tierdetektiv, Stufe Entdecker, eine Runde bis zum Ende.
- **Gerät:** Handy 390 × 844, Touch, Chromium.
- **Stand:** `http://127.0.0.1:4200/`. Der Server dort ist `python3 -m http.server` im Ordner `scratchpad/wt-tier/dist`. Dieser Build enthält die Texte „Darum stimmt es“ und „Du hast eine trockene“. Es ist also der neue Stand.
- **Nicht wie im Auftrag:** Der Tierdetektiv hat gar keine Stufenwahl. Auf der Karte steht kein „3 Stufen zur Wahl“, und im Spiel gibt es kein „Stufe: Entdecker“. Das gibt es nur bei „Wer lebt wo?“. Ich habe den Tierdetektiv gespielt, so wie er ist, und danach „Wer lebt wo?“ kurz angesehen.

## 2. Ergebnis
Das Ziel ist erreicht. Die Runde (5 von 5 Aufgaben) lief bis „Abenteuer geschafft!“ mit dem Haken „Stempel im Entdeckerpass“. Ich habe rund 35 Handlungen gebraucht, gelaufen ist es ohne Sackgasse.

Zwei Dinge aus eurem Auftrag habe ich **nicht** gesehen:
- Eine Denkfrage nach einer falschen Antwort gab es im Tierdetektiv nie, auch bei vier falschen Tipps nicht.
- Die Auflösung nach „Richtig!“ ist bei vier von fünf Aufgaben nur der alte Satz.

## 3. Ablauf
Die Reihenfolge der Aufgaben wird gemischt, die Texte unten sind genau das, was ich gesehen habe.

1. **Startseite → Spielen → Tierdetektiv** (`01-start`, `01-spielen`, `02-spiel-offen`). Die Karte war leicht zu finden. Das Spiel zeigt eine Frage und drei große Antworten. Die Knöpfe sind 362 × 56 px.
2. **Aufgabe 1, Panda/Bambus.**
   - Ich habe zuerst falsch „Faultier“ getippt (`01-a1-falsch`). Rückmeldung: „Noch nicht ganz. Versuch es noch einmal!“
   - Dann „Panda“ (`02-a1-richtig`). Auflösung: „Der Große Panda lebt ursprünglich in China und frisst hauptsächlich Bambus.“
   - Der Knopf „Nächste Spur“ lag bei y 775–823. Die Leiste unten beginnt bei y 780. Man sah nur 5 px davon (Befund 1).
3. **Aufgabe 2, Eisbär.**
   - Falsch „Kaiserpinguin“ (`04-a2-falsch`). Rückmeldung wieder nur „Noch nicht ganz. Versuch es noch einmal!“
   - Ich habe „Ich brauche eine Lernhilfe“ getippt (`05-a2-hilfe`). Der Knopf wurde zu „Nächster Hinweis“. Der Hilfetext lautet: „Lies die Hinweise einzeln. Welches Tier passt zum Lebensraum UND zu den Eigenschaften?“
   - Dann „Eisbär“ (`06-a2-richtig`). Auflösung: „Eisbären leben in der Arktis und jagen vor allem Robben.“
4. **Aufgabe 3, Dromedar.**
   - Falsch „Eisbär“ (`08`), falsch „Panda“ (`09`). Beide Male nur „Noch nicht ganz …“.
   - Richtig „Dromedar“ (`10-a3-richtig`). Auflösung: „Im Höcker steckt Fett, kein Wassertank. Dromedare kommen gut mit Trockenheit zurecht.“ Das ist die einzige echt neue Auflösung, und sie ist gut.
5. **Aufgabe 4, Känguru.**
   - Falsch „Giraffe“. Wieder nur „Noch nicht ganz …“.
   - Richtig „Känguru“ (`12`, `13`). Auflösung: „Kängurus sind Beuteltiere. Australien ist ihr ursprünglicher Lebensraum.“
   - Hier stand die Seite oben. Von der Rückmeldung war im Bild nichts zu sehen (Befund 1).
6. **Aufgabe 5, Korallen.**
   - Falsch „Algen“ (`16`).
   - Richtig „Korallen“ (`17`). Auflösung: „Korallen sind Tiere. Viele riffbildende Korallen leben mit Algen zusammen.“
   - Der Knopf heißt jetzt „Spiel abschließen“. Er war voll sichtbar.
7. **Spielende** (`18-ende`): siehe Feinschliff.
8. **Zusätzlich „Wer lebt wo?“** (`19`, `22-wlw-falsch`). Frage: Giraffe, drei Landschaften. Ich habe falsch „Baumlose Eisfläche“ getippt. Rückmeldung: „Noch nicht ganz. Versuch es noch einmal! Ohne Bäume fehlen die Blätter, die die Giraffe frisst. Vergleiche in Ruhe oder schau in den Tipp.“ Die Seite war zur Rückmeldung gerollt, sie war sofort sichtbar. Auch hier keine Denkfrage in der Art „Du hast … gewählt …“. Ich habe nur diese eine Aufgabe gesehen, weil die Handlungen aufgebraucht waren.
9. **„Was ist neu?“** (`23-neu`): siehe Abschnitt 4.

## 4. Befunde

### Blockierend
Keiner. Die Runde ließ sich spielen.

### Wichtig
1. **Kaputt / Sieht falsch aus: Die Rückmeldung im Tierdetektiv ist nicht immer im Bild.** Das widerspricht dem Eintrag „Nach jeder Antwort rollt die Seite von selbst zu ‚Richtig!‘“. Die Schritte nachzustellen: Handy 390 × 844, Tierdetektiv, Aufgabe starten, ohne Scrollen die richtige Antwort tippen.
   - **Aufgabe 4** (`12-a4-richtig.png`, `13-a4-richtig-nichts.png`): Nach „Känguru“ blieb die Seite bei scrollY 0. Zu sehen sind Frage und Antworten, die Rückmeldung beginnt erst bei y 775 hinter der Leiste, der Knopf „Nächste Spur“ liegt bei y 895. Ich habe die Seite danach noch zweimal geprüft, sie rollte nicht von selbst. Mama sieht nur den grünen Haken und weiß nicht, wo es weitergeht. Die Auflösung liest sie gar nicht.
   - **Aufgabe 1** (`02-a1-richtig.png`): Die Seite rollte nur 88 px. Die Auflösung war sichtbar, „Nächste Spur“ aber nur 5 px hoch über der Leiste (y 775–823, Leiste ab 780). Erst nach Scrollen um 200 px war er frei (`03-a1-scroll.png`).
   - Bei Aufgaben 2, 3 und 5 (Scrollstand schon bei 288 bis 300) war alles im Bild.
   - Vermutung: Die Rollhilfe greift im Tierdetektiv nicht oder nur halb, abhängig vom Scrollstand, und rechnet die Leiste unten nicht ein. Das sieht nur aus, als hinge es mit dem Scrollstand zusammen, ich habe es nicht in beide Richtungen sauber getrennt.
   - Vorschlag: nach der Antwort so rollen, dass die ganze Rückmeldung samt Knopf über der Leiste liegt (wie in „Wer lebt wo?“, `22`).

2. **Zu schwer / Verwirrend: Keine Denkfrage nach falschen Antworten im Tierdetektiv.** Ich habe vier falsche Antworten gegeben (Faultier, Kaiserpinguin, Eisbär und Panda bei Aufgabe 3, Giraffe, Algen). Jedes Mal erschien nur „Noch nicht ganz. Versuch es noch einmal!“. Es steht nicht da, was gewählt wurde, es gibt keine Frage zum Zuhause oder Futter, und der Tierdetektiv sagt nirgends „Zuhause“ oder „Futter“. Ich kann deshalb nicht beurteilen, ob die Denkfrage einem 6-Jährigen hilft. Wenn die Denkfrage im Tierdetektiv gemeint ist, ist sie nicht ausgespielt. Wenn sie nur in „Wer lebt wo?“ oder „Lebensraum-Sortierer“ vorgesehen ist, sollte der Auftrag das sagen. In „Wer lebt wo?“ sah ich nur einen Satz, warum es falsch ist. Der ist kindgerecht und hilft, ist aber keine Denkfrage.

3. **Verwirrend: Die Lernhilfe passt nicht zum Tierdetektiv.** Der Hilfetext sagt „Lebensraum UND … Eigenschaften“. Das sind Wörter, die ein 6-Jähriges nicht kennt, und das widerspricht „Zuhause“ und „Futter“. Sie sagt auch nichts zur Aufgabe selbst, sondern ist ein Standardsatz. Außerdem heißt der Knopf nach dem Tippen „Nächster Hinweis“, in der Aufgabe sieht man aber keinen Hinweis (`05-a2-hilfe.png`).

### Feinschliff
4. **Auflösung bei vier von fünf Aufgaben ist der alte Satz, kein „warum“.**
   - **Panda:** „Der Große Panda lebt ursprünglich in China und frisst hauptsächlich Bambus.“ Das wiederholt nur die Frage (Bambus, China).
   - **Eisbär:** „… leben in der Arktis und jagen vor allem Robben.“ Das ist ein zweites Faktum, aber kein warum.
   - **Känguru:** „Kängurus sind Beuteltiere. Australien ist ihr ursprünglicher Lebensraum.“ Das wiederholt die Frage („Beuteltier“, „Australien“) und enthält „ursprünglicher Lebensraum“.
   - **Korallen:** „Viele riffbildende Korallen leben mit Algen zusammen.“ Das ist neu, aber „riffbildende“ ist für 6-Jährige schwer. Dass Algen als falsche Antwort stehen, ist dagegen eine gute Falle.
   - Nur beim **Dromedar** erklärt der Satz das Warum: „Im Höcker steckt Fett, kein Wassertank …“. Das sollte als Vorbild dienen.
5. **Der Text zur neuen Aufgabe ist oben abgeschnitten.** Nach „Nächste Spur“ bleibt der Scrollstand (288 bis 300). Die erste Zeile der Frage liegt dann über dem Rand (`07-a3-neu.png`, `15-a5-neu.png`: „Mein Höcker speichert Fett …“ und „Wir sind kleine Tiere, leben im Wasser …“ fehlen vorne). „Aufgabe 3/5“ und der Fortschrittsbalken sind weg. Mama muss hochrollen, bevor sie vorlesen kann. Vorschlag: nach „Nächste Spur“ zur Frage rollen.
6. **Spielende** (`18-ende.png`): Die Überschrift „Abenteuer geschafft!“ ist oben halb abgeschnitten (Scrollstand 300), darunter bleibt eine große leere Fläche. Der „Stempel“ ist nur ein kleiner Haken mit Text. Das ist dasselbe wie beim Technik-Spieltest (Design „Kompass“).
7. **Ratemuster:** Hier gibt es keines, auf das ein Kind setzen kann.
   - Die Fallen sind ernsthaft falsch: „Algen“ (die Frage sagt „Tiere“), „Pinguine“, „Eisbär“ beim Höcker, „Faultier“ beim Bambus.
   - Die richtige Antwort ist weder immer die längste noch die kürzeste. Sie steht auch nicht an einer festen Stelle (mal erste, mal zweite, mal dritte).
   - Hinweis: Alle Antworten sind einzelne Tiernamen, die Fallen sind eher leicht zu entkräften. Für 6-Jährige ist das passend, sonst eher leicht.
8. **Tippflächen:** Alle Antworten und Knöpfe sind mindestens 48 px hoch (Antworten 362 × 56, „Nächste Spur“ 151 × 48, „Ich brauche eine Lernhilfe“ 273 × 48, „Vorlesen“ 90 × 48). Keine zu kleine Fläche gesehen.
9. **„Was ist neu?“** (`23-neu.png`):
   - Der Eintrag „Tierspiele: Darum stimmt es“ steht oben (25. November 2026). Text: „In drei Tierspielen erfährst du jetzt, warum deine Antwort stimmt. Zum Beispiel: Schleim schützt den Clownfisch vor den brennenden Fangarmen seiner Seeanemone.“
   - Verständlich für ein Kind: ja, als Idee. Die Sätze sind kurz. „Seeanemone“ und „Fangarme“ muss Mama erklären.
   - **Nicht passend zum Spiel:** Welche drei Spiele es sind, steht nicht da. Das Clownfisch-Beispiel habe ich im Tierdetektiv nicht gesehen. Das Beispiel soll das Kind aufs Ausprobieren neugierig machen, aber ob der Eintrag auch den Tierdetektiv meint, ist unklar. Ich habe ihn nicht geprüft.
   - Der Eintrag „Richtig! siehst du jetzt gleich ganz“ behauptet: „Nach jeder Antwort rollt die Seite von selbst zu ‚Richtig!‘ oder ‚Noch nicht ganz‘.“ Im Tierdetektiv stimmt das nicht immer (Befund 1).

## 5. Was Spaß machte
- Große, klare Antworten mit großem Abstand, Tippen mit dem Daumen ist leicht.
- Rot mit Kreuz bei falsch, grün mit Haken bei richtig, die übrigen Antworten werden gestrichelt. Das sieht man sofort.
- Der Hinweis „Versuch es noch einmal!“ lässt Raten zu, ohne dass man steckenbleibt.
- Die Dromedar-Erklärung („kein Wassertank“) ist ein schönes „Aha“.
- „Korallen sind Tiere“ ist eine gute Überraschung gegen „Algen“.
- Die Fragen selbst sind kurz, bildhaft („Mein Höcker speichert Fett“) und für 6-Jährige gut.

## 6. Browser-Meldungen
Keine (keine Konsolenfehler, keine Seitenfehler, keine gescheiterten Anfragen).

## 7. Nicht geprüft
- Ton und Vorlesen (nur Knöpfe gesehen).
- Weitere Aufgaben im Tierdetektiv (ich sah nur eine zufällige Runde von 5; die Reihenfolge ist gemischt). Auch „Lebensraum-Sortierer“ und die dritte Tierspiel-Karte habe ich nicht gespielt.
- Eine Denkfrage im Sinne von „Du hast eine trockene Wüste gewählt …“. Ich weiß nicht, wo sie vorkommen soll, und habe sie nirgends gesehen. Falls sie nur bei bestimmten Aufgaben erscheint, habe ich sie verpasst.
- Stufe Entdecker im Tierdetektiv (gibt es dort nicht), andere Geräte, andere Browser, Offline.
- Die Tests wurden auf einem lokalen Build ausgeführt (Python-Server auf Port 4200), nicht auf Test-Seite oder Vorschau.
- Eine Zweitrunde ohne mein Scrollen, um Befund 1 sauber zu trennen (Scrollstand 0 gegen 300), fehlt. Befund 1 ist für Aufgabe 4 belegt (Scrollstand 0), für Aufgabe 1 (Scrollstand 88).
