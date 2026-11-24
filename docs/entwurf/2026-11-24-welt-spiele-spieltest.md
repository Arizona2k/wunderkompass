# Teil B, Aufgabe 8: Spieltest der Welt-Spiele mit Stufen

Stand: 24.11.2026. Bericht des `spieltester` zum Code-Stand `4b29615` (lokaler Build), vollständig übernommen. Rollenspiel, kein Kindertest. Bilder und Skripte lagen unter `.qa-output/spieltester/b8-1/` und `b8-2/` (nicht in Git). Was Claude daraus gemacht hat, steht am Ende.

Beide Ziele sind erreicht. Auftrag 1 ging über 2 Runden Tier & Lebensraum, Auftrag 2 über 2 Runden Wer war das?. Das sind Spieltests in den Rollen, kein Kindertest.

## Kurzliste

**Muss vor dem PR**
- Keiner der Befunde blockiert den Spielfluss. Nichts war kaputt, keine Sackgasse, keine Browser-Fehler.
- Eine Sache solltest du vor dem PR trotzdem entscheiden: Stufe „Experte“ ist in „Wer war das?“ nur ein Etikett (Befund A). Wer „schwer“ wählt, bekommt Profi und eine kleine graue Zeile. Das ist ehrlich gesagt, aber für ein Kind, das „es schwer will“, enttäuschend. Entscheide, ob das so bleiben darf oder ob die Stufe bis zum Ausbau ausgeblendet wird.

**Sollte bald**
- B: Profi-Hinweise verraten die Antwort über „er“, „sie“ und „ihr“ (Ratemuster).
- C: Die Rückmeldung nach einem Fehler ist immer derselbe Satz und hilft nicht beim Weiterdenken.
- D: Der Entdecker-Hinweis in „Wer war das?“ ist wörtlich der Profi-Hinweis und für Kleine zu schwer.
- E: Ein Stufenwechsel mitten in der Runde setzt still auf Aufgabe 1 zurück.
- F: In „Tier & Lebensraum“ stehen schwierige Wörter in den Antworten, und es gibt Füllerantworten.
- G: Das Spiel öffnet auf dem Handy mitten in der Seite, die Antworten liegen unter dem Bild.

**Gut so**
- Die Stufe steht oben im Spiel („Stufe: Entdecker“, Knopf „Ändern“).
- Entdecker hat 5 Aufgaben mit 3 Antworten, Profi hat 8 Aufgaben mit 4 Antworten.
- Die Stufenwahl ist verständlich: „zum Reinkommen“, „vier Antworten, kniffligere Fallen“, „nachdenken und kombinieren“.
- Nach der Wahl schließt das Feld, und der Fokus landet wieder auf „Ändern“.
- „Neue Runde“ bringt wirklich neue Aufgaben.
- Alle Tippflächen sind 44 px hoch oder mehr.

---

## Auftrag 1: Tier & Lebensraum

- **Rolle:** 7 Jahre, mit Elternteil, das vorliest.
- **Gerät:** Handy 390 × 844, Touch, leerer Pass.
- **Stand:** lokaler Build, Vorschau auf Port 4490, Chromium.
- **Ergebnis:** Ziel erreicht. Runde 1 bis zum Stempel, dann „Neue Runde“ und Runde 2 komplett gespielt.
- **Zählung:** Ich habe weit über 30 Handlungen gebraucht, rund 70, weil ich mehrere Läufe von vorn wiederholt habe. Ursachen waren meine Skriptfehler: ein falscher Knopf-Filter (ich tippte „Alle Spiele“), eine Endlosschleife auf einer Antwort und ein falscher Rückmeldungs-Filter. Die Befunde stammen aus den sauberen Läufen.

### Ablauf
1. Start → „Spielen“. Die Liste hat 31 Angebote, „Tier & Lebensraum“ steht fast am Ende. Ich musste zu dem Spiel scrollen, ohne Suche oder Filter. Ein 7-Jähriges findet es nur mit Hilfe.
2. Spiel öffnen. Der Stand „Stufe: Entdecker“ steht gleich oben, dazu „Aufgabe 1 von 5“. Die Stufe ist also klar.
3. Absichtlich falsch (z. B. beim Eisvogel „Savanne“ statt „Flussufer“, beim Löwen „Flüsse & Seen“). Die Rückmeldung lautet: „Noch nicht ganz. Versuch es noch einmal! Diese Wahl passt zum Beispiel zu: Katta. Gesucht ist aber: Eisvogel. Wo findet dieses Tier Futter und Schutz?“ Die Antwort färbt sich orange, man darf nochmal wählen.
4. Richtig: grüne Antwort, „Richtig! Löwe: Savanne“, Knopf „Nächste Aufgabe“ (Bild des Löwen-Schrittes gesehen, danach wegen Neuaufnahme gelöscht).
5. 5 Aufgaben bis zum Ende. Der letzte Knopf heißt „Spielstempel sammeln“. Danach erscheint „Eine ganze Runde gelöst! Alle 5 Aufgaben sind gelöst. Dein Spielstempel bleibt in deinem Entdeckerpass.“ mit dem Link „Zu einer passenden Entdeckerkarte“.
6. „Neue Runde“. Es kommen neue Tiere (Runde 1: Honigbiene, Orca, Grasfrosch, Rotfuchs, Kaiserpinguin; Runde 2: Europäischer Aal, Feuersalamander, Braunbrustigel, Erdmännchen, Jaguar). Bild: `/home/user/wunderkompass/.qa-output/spieltester/b8-1/01-neue-runde.png`. Die übrigen Bilder dieses Auftrags habe ich beim Neuaufnehmen überschrieben. Die Skripte liegen in `.qa-output/spieltester/b8-1/` (`g.mjs` ist der Lauf bis zum Stempel, `h.mjs` zwei Runden).

### Befunde
- **Wichtig, Verwirrend (F):** Manche Antwortwörter sind für ein 7-Jähriges zu schwer, auch mit Vorlesen. Beispiele: „Küsten mit Haltestrukturen“ (Seepferdchen), „Wälder, Offenland und Siedlungen“ (Rotfuchs), „Savannen und trockene offene Landschaften“ (Strauß), „Arktische Küsten und Meere“. Bei Seepferdchen und Hummer hilft auch das Bild nicht, es braucht Wissen. Vorschlag: für Entdecker kurze Antworten wie „Wald“, „Meer“, „Wiese“ verwenden.
- **Wichtig, Zu leicht, Ratemuster (F):** „Antarktis“, „Felsiger Meeresboden“ und „Korallenriffe mit Seeanemonen“ tauchen als Füller ständig auf. Bei Giraffe, Löwe, Jaguar und Orang-Utan streicht jedes Kind die Füller ohne Tierwissen weg. Beim Kängurukartenbeispiel war die längste Antwort „Flüsse, Küsten und Atlantik“ dabei, aber falsch. Es gibt kein klares Längenmuster, aber das Füllermuster ist deutlich. Für Entdecker ist das okay, es soll leicht sein.
- **Wichtig (C):** Die Rückmeldung nach dem Fehler hilft nur halb. „Diese Wahl passt zum Beispiel zu: Katta“ nennt ein Tier, das ein 7-Jähriges kaum kennt (Katta, Echter Clownfisch). „Wo findet dieses Tier Futter und Schutz?“ ist die einzige Hilfe, gut. Die Erklärung nach „Richtig!“ besteht nur aus „Löwe: Savanne“, ohne ein Warum. Vorschlag: einen kurzen Satz dazu, z. B. „Der Löwe lebt in der Savanne. Dort jagt er.“
- **Wichtig (G):** Das Spiel öffnet auf dem Handy mit gleichem Scrollstand wie die Liste (gemessen: scrollY 551). Das Kind sieht mitten im Bild statt Titel und Stufe. Auch ganz oben liegen die Antworten wegen des großen Fotos unter dem Bildschirmrand. Ob das bewusst ist (Frage mit Bild zuerst), kann ich nicht beurteilen. Vorschlag: beim Öffnen und nach „Neue Runde“ nach oben scrollen, das Foto etwas niedriger machen.
- **Feinschliff:** Beim „Richtig“-Kasten liegt „Erklärung vorlesen“ direkt am Knopf „Nächste Aufgabe“, kein Abstand. Der Endbildschirm ist unten leer, keine Freude außer einem Haken. Der Fokus nach „Neue Runde“ bleibt auf dem Knopf, das ist in Ordnung.
- **Feinschliff:** Die Liste „Spielen“ hat 31 Karten ohne Suche. Der Fortschrittsmerker „Fortsetzen: Tier & Lebensraum“ erscheint nach dem Zurückgehen, das ist gut.

### Spaß
Das Foto-Tiere-Raten mit dem großen Bild funktioniert. Das grüne Häkchen und der orange Knopf „Nächste Aufgabe“ sind eindeutig. Jede Runde bringt neue Tiere.

---

## Auftrag 2: Wer war das?

- **Rolle:** 11 Jahre, allein, will es schwer, liest flüssig.
- **Gerät:** Tablet 768 × 1024, Touch, leerer Pass.
- **Stand:** lokaler Build, Vorschau auf Port 4490, Chromium.
- **Ergebnis:** Ziel erreicht. Experte gewählt, eine Runde (8 Aufgaben) bis zum Stempel gespielt, dann mitten in einer neuen Runde über „Zu schwer? Zurück zu Entdecker“ auf Entdecker gewechselt. Zählung rund 45 Handlungen mit Wiederholungen, die saubere Folge sind je Lauf 17 und 26.

### Ablauf
1. „Spielen“ → „Wer war das?“, auch hier erst nach Scrollen in der Liste. Das Spiel öffnet mit scrollY 433, also mitten in der Seite. Bild: `/home/user/wunderkompass/.qa-output/spieltester/b8-2/01-liste.png`.
2. Start in Entdecker: „AUFGABE 1 VON 5“, 3 Antworten (Mary Anning, Grace Hopper, Charles Darwin). `/home/user/wunderkompass/.qa-output/spieltester/b8-2/02-start.png`.
3. „Ändern“: Das Auswahlfeld öffnet („Welche Stufe willst du spielen?“ mit Entdecker, Profi, Experte). `/home/user/wunderkompass/.qa-output/spieltester/b8-2/03-aendern.png`.
4. „Experte“ gewählt: Die Auswahl schließt, der Fokus geht zurück auf „Ändern“. Oben steht „Stufe: Experte“ und darunter klein: „Experte gibt es hier noch nicht. Du spielst Profi.“ plus der Link „Zu schwer? Zurück zu Entdecker“. Es sind „Aufgabe 1 von 8“ mit 4 Antworten. `/home/user/wunderkompass/.qa-output/spieltester/b8-2/01-experte.png`.
5. Eine Runde Profi, 8 Aufgaben. Ich habe die Antworten der Reihe nach angetippt, bis es stimmte (Fehlversuche je Aufgabe: 0, 0, 1, 1, 1, 0, 3, 0). Bilder: `/home/user/wunderkompass/.qa-output/spieltester/b8-2/01-profi-richtig.png` (Aufgabe 1), `02-letzte.png`, `03-ende.png` („Eine ganze Runde gelöst! Alle 8 Aufgaben sind gelöst.“).
6. „Neue Runde“ in Experte, 3 Aufgaben beantwortet (Aufgabe 4 von 8 erreicht), dann „Zu schwer? Zurück zu Entdecker“. Bilder: `01-vor-zurueck.png`, `/home/user/wunderkompass/.qa-output/spieltester/b8-2/02-nach-zurueck.png`. Danach steht oben „Stufe: Entdecker“, „Aufgabe 1 von 5“ mit 3 Antworten, der Fokus liegt auf „Ändern“, scrollY 0. Nach Neuladen und Wiederöffnen bleibt Entdecker.

### Befunde
- **Wichtig (A), Verwirrend:** „Stufe: Experte“ steht oben und gleichzeitig „Experte gibt es hier noch nicht. Du spielst Profi.“ Die Hinweiszeile ist klein, grau und leicht zu übersehen. Der Link „Zu schwer? Zurück zu Entdecker“ passt nicht zu jemandem, der gerade freiwillig die schwerste Stufe wollte, und ist sehr nah an der Meldung. Eine 11-Jährige liest es verstanden, ist aber enttäuscht, es hat keinen Mehrwert. Vorschlag: Ist die Stufe ohne Inhalt, lieber nach der Wahl oben „Stufe: Profi“ anzeigen und den Hinweis als eigene Zeile größer setzen, oder die Auswahl „Experte“ hier ausgrauen mit „kommt bald“.
- **Wichtig, Ratemuster (B): Pronomen im Hinweis.** Profi-Aufgaben mit nur einem Geschlecht unter den Antworten:
  - Aufgabe 5 „…landete **er** zusammen mit Buzz Aldrin auf dem Mond“. Antworten: Katherine Johnson, Neil Armstrong, Wangari Maathai, Jane Goodall. Nur Armstrong ist ein Mann, also sofort richtig, auch ohne Wissen.
  - Aufgabe 1 „**Ihr** Werk wurde … abgeschrieben“. Antworten: Murasaki Shikibu, Ibn al-Haytham, al-Chwarizmi, Gutenberg. Nur sie ist eine Frau.
  - Aufgabe 6 „**Ihre** Arbeit an Artemisinin …“, Antworten alle Frauen (Tu Youyou, Goodall, Franklin, Johnson). Hier hilft das Pronomen nicht, gut.
  - Aufgabe 3 „…verband **er** Beobachtungen“. Von 4 Antworten bleiben 3 Männer, kein Totalverrat. Aufgabe 8 „**Sie** dachte …“ lässt 2 von 4 übrig.
  - Im Entdecker-Hinweis zu Darwin steht „erklärte **sie**, wie sich Tiere … verändern“ mit der Antwortreihe Mary Anning, Grace Hopper, Charles Darwin. Dort bezieht sich „sie“ grammatisch auf „Person“, führt ein Kind aber auf die zwei Frauen. Das ist irreführend, keine Verrat. Vorschlag: Pronomen im Hinweis vermeiden („Diese Person …“ durchgehend, „…ihr/sein/Werk“ ersetzen) oder Antworten mit gemischtem Geschlecht je Aufgabe.
- **Wichtig, Ratemuster (B): Lösungsstellung.** Im Lauf Profi lag die richtige Antwort bei Aufgabe 1, 2, 6, 8 auf Platz A, bei 3, 4, 5 auf B, bei 7 auf D, nie auf C. Das ist eine kleine Stichprobe (eine Runde), aber „immer A“ hätte 4 von 8 getroffen. Bitte die Reihenfolge der Antworten prüfen.
- **Wichtig, Zu leicht, Profi für eine 11-Jährige:** Eine Mischung. Hinweise wie „Mit 26 Jahren begann … Gombe“ (Goodall) oder „Fossilien … Lyme Regis“ (Anning) verlangen echtes Wissen (3 Fehlversuche bei Anning, Humboldt/Hokusai/Lovelace als Fallen). Dagegen sind die Pronomen-Aufgaben (1, 5) und Aufgabe 4 (zwei Nobelpreise, hier erklärt der Hinweis das Wort selbst) leicht. Eine Antwort ist nicht auffällig länger oder kürzer. Die Namen wiederholen sich als Falle stark (Humboldt, Anning und Jane Goodall je 3-mal in einer Runde). Wer in Aufgabe 3 die Erklärung gelesen hat, kennt Humboldt für später.
- **Wichtig (C): Die Fehler-Rückmeldung ist immer dieselbe.** „Du hast ‚Ada Lovelace‘ gewählt. Vergleiche die genannte Tätigkeit oder Entdeckung mit dem, was du über die angebotenen Personen weißt.“ Auch nach dem dritten Fehler (Aufgabe 7) kein neuer Hinweis. Die Erklärung nach „Richtig!“ ist dagegen lang (ca. 5 Zeilen), ordentlich, aber für einen Leser ab 11 gut. Vorschlag: nach dem zweiten Fehler einen Hinweis aus dem Tipp einblenden.
- **Wichtig (D):** Der Entdecker-Hinweis ist teilweise zu schwer für Kleine. Beispiel: „Diese Person suchte mit einem Forschungsteam nach Mitteln gegen Malaria. Ihre Arbeit an Artemisinin zeigt, wie historische Hinweise und moderne Untersuchungen zusammenwirken können.“ Das ist wortgleich der Profi-Hinweis zu Tu Youyou, auch in Entdecker (3 Antworten, mit Gutenberg und Armstrong, plus „Ihre“ → leicht). Die Stufe Entdecker soll kürzer und einfacher formulieren, nicht nur weniger Antworten. Ich habe hier nur Wörter wie Artemisinin und „historische Hinweise“ gemeint, die ein 6- bis 8-Jähriges nicht kennt.
- **Wichtig (E): Stufenwechsel mitten in der Runde.** Nach 3 gelösten Aufgaben auf „Zu schwer? Zurück zu Entdecker“ beginnt still eine neue Runde bei „Aufgabe 1 von 5“. Das Fortschreiten (3 gelöst) geht ohne Meldung verloren. Für eine 11-Jährige verständlich, einem Kleineren erscheint es als „Wo ist meine Runde?“. Vorschlag: im Hinweis kurz sagen „Neue Runde mit Entdecker“ oder die Stufe erst bei „Neue Runde“ wirken lassen.
- **Feinschliff:** Am Ende des Spiels steht der Fokus auf `body` (der Knopf „Spielstempel sammeln“ verschwindet), die Ansicht ist 203 px gescrollt, Titel und Knöpfe oben halb verdeckt. Besser: den Fokus auf die Überschrift „Eine ganze Runde gelöst!“ setzen.
- **Feinschliff:** Antwortflächen sind 722 × 65 px, groß genug. „Zu schwer? Zurück zu Entdecker“ hat 248 × 48 px. Der Hinweistext „Experte gibt es hier noch nicht…“ ist kleine Schrift (ca. 14 px).

### Spaß
Die Hinweise zu echten Personen (Jane Goodall, Mary Anning, Ada Lovelace, Tu Youyou) sind interessant, und die Erklärungen nach „Richtig!“ erzählen Geschichten (z. B. Ada Lovelace und die Rechenmaschine, Humboldt und Bonpland). Das Knobeln mit Fallen (Lise Meitner/Marie Curie, Karl Benz/Bertha Benz) reizt.

---

## Browser-Meldungen
Keine. Es gab keine Konsolenfehler, keine Seitenfehler und keine gescheiterten Anfragen.

## Nicht geprüft
- Ton und „Vorlesen“. Ich habe nur die Knöpfe gesehen, nichts gehört.
- Der Tipp-Knopf „Brauchst du einen Tipp?“ (nie aufgeklappt, daher weiß ich nicht, ob er über die allgemeine Fehlermeldung hinausgeht).
- Die Stufe Profi in „Tier & Lebensraum“ und in den anderen vier Spielen (Wer lebt wo?, Stimmt das wirklich?, Das große Welt-Quiz, Wissens-Challenge).
- Entdecker in „Wer war das?“ als ganze Runde.
- Der Wechsel über „Ändern“ mitten in der Runde. Ich habe nur den Link „Zu schwer? Zurück zu Entdecker“ genommen, nicht „Ändern“.
- Andere Browser und echte Geräte.
- Alte Pässe und Verhalten nach Sicherung/Import.

Die Vorschau auf Port 4490 ist beendet. Port 4480 habe ich nicht angerührt (antwortet weiter mit 200).

Dateien: Skripte und Bilder unter `/home/user/wunderkompass/.qa-output/spieltester/b8-1/` und `/home/user/wunderkompass/.qa-output/spieltester/b8-2/`.

## Umsetzung (Claude, 24.11.2026)

Folgt.
