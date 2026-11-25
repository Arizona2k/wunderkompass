# Spieltest „Auflösung und Rückmeldung im Blick“ (25.11.2026)

Helfer: `spieltester` (sonnet / high), Stand vor den Korrekturen des code-pruefers, lokal aus dem Arbeitsordner. Kein Kindertest.

**Spieltest in der Rolle: 8 Jahre, allein, Handy 360 × 640 (Touch), Stand lokal http://127.0.0.1:4310/. Das ist kein Kindertest.**

Ziel erreicht. Die Runden „Wer war das?“ (Entdecker 5 von 5, Profi 8 von 8), „Kreuz und quer“ (6 von 6), „Stimmt das wirklich?“ (4 von 4) und „Früher oder heute?“ (4 von 5 gespielt) liefen durch. Es gab keine Sackgasse.

Bildordner: `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/spieltest-aufl/` (unten „…/“). Jeder frische Browser hatte einen leeren Pass. Es gab keine Konsolenfehler, keine Seitenfehler und keine gescheiterten Anfragen.

Zur Ehrlichkeit: Das Limit von rund 30 Handlungen habe ich überschritten, es waren etwa 100 Taps. Der Auftrag hatte fünf Spiele, und ich habe Skripte mehrfach neu abgespielt. Ton, Vorlesen und die echte Schrifteinstellung des Geräts habe ich nicht geprüft.

## Die neuen Punkte im Einzelnen

- **Rollen und Kasten:** Nach jeder Antwort rollt die Seite weich (etwa 300 ms) so, dass der Kasten über der Leiste endet. Gemessen endet er bei 564 px, die Leiste beginnt bei 576 px. Das galt bei allen Aufgaben, die ich mit normalem Tempo gespielt habe, auch bei „Noch nicht ganz“, bei Profi und beim längsten Kasten (484 px hoch). Das Rollen stört nicht und springt nicht.
- **Fokus:** Nach „Richtig!“ steht er auf „Nächste Aufgabe“. Bei der letzten Aufgabe heißt der Knopf „Spielstempel sammeln“ (Entdecker, Profi, Kreuz und quer) bzw. „Runde abschließen“ (Stimmt das wirklich?). Nach einem falschen Tipp bleibt der Fokus auf dem Antwortknopf.
- **Auflösung bei „Wer war das?“:** Sie ist kurz und etwas Neues, zum Beispiel: „Ibn al-Haytham … Früher dachten viele: Augen schicken Strahlen aus wie eine Taschenlampe. Er zeigte: Es ist umgekehrt.“ Bild: `…/02-nach-B.png`.
- **Neue Tipps:** Bei „Stimmt das wirklich?“ sind sie gut („Wohin könnte das Wasser gegangen sein: nach oben oder nach unten?“, dazu „Noch ein Tipp“, Bild `…/03-stimmt-a2-v1.png`). Bei „Wer war das?“ ist der Tipp bei jeder Aufgabe derselbe Satz („Kennst du einen der Namen? Überlege: Hat dieser Mensch so etwas gemacht?“). Er hilft nicht weiter.
- **Profi nach falscher Antwort:** „Passt jeder Satz im Hinweis zu diesem Menschen?“ ist ein klarer Denkanstoß (Bild `…/02-profi-a1-v1.png`). Danach erscheint „Ganz schön knifflig. Willst du eine Stufe leichter spielen?“ mit „Ja, leichter spielen“ und „Nein, ich bleibe“ (Bild `…/10-profi-a4-v1.png`).
- **„Erst in der Zukunft“:** Die eigene Rückmeldung erscheint („Das hier gibt es schon, oder es gab es früher. War es früher so oder ist es heute so?“). Sie ist verständlich, aber allgemein (Bild `…/02-fh-a1-v1.png`).

## Muss

1. **Kreuz und quer auf Entdecker ist für 8 Jahre zu schwer und zu leicht zu erraten.**
   - Fachsprache: „Welche Aussage beschreibt im behandelten Beispiel die physikalische Erklärung und nicht nur den chemischen Befund?“ (Lise Meitner). Weitere Beispiele: „additives Herstellen“, „Transit“, „Exoplaneten“, „Wechselwirkung der Moleküle“, „Kapillarwirkung … Durchmesser“. Die Rückmeldung „Das ist der wichtige Befund. Er benennt noch nicht den erklärenden Vorgang im Atomkern.“ versteht ein 8-jähriges Kind nicht.
   - Ratemuster, die ich gesehen habe: Die richtige Antwort ist die längste (Elektrisches Licht, Exoplaneten). Falsche Antworten enthalten „garantiert“, „Nur“, „Immer nur“, „allein“, „unabhängig“, „Auf jedem“ (Exoplaneten, 3D-Druck, Oberflächenspannung, Kapillarwirkung). Richtig ist die Antwort mit „kann … nicht ausgeschlossen“. Bei „Sonnenstrom“ und „Seepferdchen“ sind die falschen Antworten abwegig.
   - Die Karte sagt „Ab etwa 6“. Das passt nicht.
   - Bilder: `…/05-kreuz-a3-v1.png`, `…/03-kreuz-a1-v2.png`. Fragen und Antworten stehen in `…/03-kreuz3-…`, den Text habe ich oben zusammengefasst.
2. **Der Weg zum „Weiter“-Knopf bricht bei großer Schrift.** Eine eingebaute Schrifteinstellung habe ich nicht gefunden. Ich habe sie mit 150 % Schrift per CSS nachgestellt (Simulation, kein echter Fall). Bei Profi mit dem Kasten „Ganz schön knifflig“ ist der Kasten dann 641 bis 647 px hoch. Er beginnt bei 12 px und endet bei 653 bis 659 px, also etwa 80 px hinter der Leiste. „Nächste Aufgabe“ liegt außerhalb des Bildes, das Kind muss von Hand scrollen. Der Fokus steht zwar auf dem Knopf, aber man sieht ihn nicht. Bilder: `…/07-gross-a3-v1.png`, `…/08-gross-a3-v2.png`. Bei normaler Schrift passt alles. Wichtig wäre es, falls Systemschrift „groß“ bei Kindern oder Eltern vorkommt. Vorschlag: Ist der Kasten höher als die Fläche über der Leiste, nach dem Knopf rollen oder den Knopf unten festhalten.

## Soll

3. **Schnelles Tippen (150 ms Pause) lässt den Kasten nach der Antwort etwa 19 px zu tief stehen.** Gemessen: unten 595 px, Leiste 576 px (Aufgabe 2 und 3, drei Taps schnell hintereinander). Der Knopf „Nächste Aufgabe“ ist dabei weiter sichtbar. Der Text ist noch lesbar, nur der untere Rand des Kastens ist verdeckt. Bild: `…/02-fast-a2.png`. Vermutung: Beim schnellen Tippen wird das Rollziel mit altem Aufbau berechnet.
4. **„Ganz schön knifflig. Willst du eine Stufe leichter spielen?“ erscheint auch nach „Richtig!“** (Profi, Bild `…/12-profi-a4-v3.png`). Das Kind hat es gerade geschafft und soll dann „Ja, leichter“ oder „Nein“ wählen. Der Kasten wird dadurch 484 px hoch und verdrängt die Auflösung. Vorschlag: nur nach falscher Antwort zeigen.
5. **„Früher oder heute?“ verrät Antworten.** Der Auflösungstext von Aufgabe 3 („Es gibt Autos mit Verbrennungsmotor, Elektromotor oder beiden. Bremsen und Sicherheitsgurte helfen …“) steht in Aufgabe 5 wörtlich als Frage, richtige Antwort dann „Heute“ (Bild `…/05-fh-a3-v3.png`, Frage in der Textausgabe unter „Aufgabe 5 von 5“). Das gleiche Muster gilt vermutlich für Zug und Lampe.
   - Die Auflösung bei „Früher“ erklärt oft nur die heutige Seite („Passagierflugzeuge verbinden weit entfernte Orte“). Sie sagt nicht, warum es früher war.
   - „Erst in der Zukunft“ ist als dritte Antwort immer falsch. Das macht die Aufgabe leicht.
6. **Am Ende von „Wer war das?“ gibt es keinen Stempel zu sehen.** Der Knopf „Spielstempel sammeln“ führt zu einer Seite mit Haken, „Eine ganze Runde gelöst!“ und dem Knopf „Zu einer passenden Entdeckerkarte“. Der Stempel selbst fehlt, und der Knopf ist unklar. Bild: `…/05-nach-weiter-5.png`. Das gilt vermutlich auch für die anderen Spiele, ich habe nur das Ende bei „Wer war das?“ gesehen.
7. **Wissen für 8 Jahre bei „Wer war das?“ (Entdecker):** Fast alle Hinweise brauchen Vorwissen („fand mit einem Feld voller Antennen regelmäßige Signale“, „Sterne im festen Takt“), und der Tipp hilft nicht. Es bleibt bei Raten oder bei Aufgaben mit auffälligem Wort (Mond, Auto, Welle). Die Karte sagt „Ab etwa 9“. Der Kasten zeigt aber immer „Noch nicht ganz“ und lädt zum Weiterprobieren ein, das lindert es.
8. **Kreuz und quer: Rückmeldung nach falscher Antwort ist immer derselbe Satz** („Vergleiche die Antworten in Ruhe. Ein Tipp hilft dir.“), auch wenn der Tipp zu ist. Der Knopf „Nächste Aufgabe“ steht links (x=29), bei „Wer war das?“ und „Früher oder heute?“ rechts (x=172), bei „Stimmt das wirklich?“ links. Das ist uneinheitlich.

## Kann

9. Bei „Stimmt das wirklich?“ wechselt die Reihenfolge von „Stimmt“ und „Stimmt nicht“ von Aufgabe zu Aufgabe (A/B tauschen). Ein flüchtiges Kind tippt mal daneben.
10. Bei „Wer war das?“ steht „Erklärung vorlesen“ direkt am Knopf „Nächste Aufgabe“ (kein Abstand, Bild `…/02-nach-B.png`).
11. Beim Starten ist die erste Antwort erst nach Scrollen zu sehen (Aufgabe und Tipp füllen den Bildschirm; Bild `…/01-people-start.png`). Nach dem Weiterklicken steht die Aufgabe dagegen schön oben (Bild `…/02-nach-weiter-2.png`).
12. Tippflächen: Antworten 332 × 63, „Nächste Aufgabe“ 150 × 48, „Ändern“ 81 × 48, „Vorlesen“ 80 × 44, Tipp 294 × 44. Alles mindestens 44 px, gut.
13. Auf der Spielübersicht steht „Fortsetzen: Wer war das?“ unsichtbar im Aufbau (0 × 0). Das ist harmlos, ich notiere es nur.

## Was Spaß machte

- Die Auflösung mit etwas Neuem („Augen schicken Strahlen aus wie eine Taschenlampe“, Schimpansen mit Zweigen bei den Termiten).
- Das Rollen zum Kasten und der Fokus auf „Nächste Aufgabe“ funktionieren verlässlich.
- Bei Profi ändern sich die Hinweise (mehr Sätze, 4 Antworten, 8 Aufgaben) und es kommt ein freundliches Angebot, leichter zu spielen.
- „Stimmt das wirklich?“ hat Kindertipps, kurze Rückmeldungen und „Wissen vertiefen“. Das ist die beste Runde.

## Nicht geprüft

Ton und Vorlesen, 3D, echte Geräte, andere Browser, echte Schrifteinstellung (nur simuliert), „Experte“, Profi bei Kreuz und quer, Pass-Speicherung des Stempels, 320 px Breite.
