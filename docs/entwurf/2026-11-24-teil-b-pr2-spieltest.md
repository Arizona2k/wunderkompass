# Spieltest Teil B, PR 2 (24.11.2026)

Helfer: `spieltester` (sonnet / high), auf der Vorschau (Stand `26d344c`, vor der Code-Nachprüfung). Spieltest in einer Rolle, kein Kindertest. Bilder in `.qa-output/spieltester/pr2/` (nicht in Git).

**Spieltest Teil B PR 2: „Stimmt das wirklich?“ und „Kreuz und quer“ in zwei Rollen (kein Kindertest)**

## 1. Auftrag
- **Auftrag 1:** Rolle 9 Jahre, allein, liest flüssig. Gerät Handy 390 × 844, Touch. Ziel: „Stimmt das wirklich?“ bis zum Spielstempel spielen.
- **Auftrag 2:** Rolle 12 Jahre, will es schwer. Gerät Rechner 1280 × 800, Tastatur. Ziel: „Kreuz und quer“ als Experte spielen.
- **Stand:** Vorschau https://wunderkompass-git-f420d3-interaktive-wissens-und-lernplattform.vercel.app/, frischer Pass in jedem Lauf. Ein Browser, nacheinander, kein lokaler Server.
- **Handlungen:** Ich habe die Grenze von rund 30 je Auftrag überschritten. Weil jeder Lauf mit leerem Pass beginnt, musste ich die ersten Schritte jedes Mal neu abspielen. Ein einzelner Durchgang hat etwa 25 bis 35 Handlungen, insgesamt waren es rund 15 Läufe. Der Tastaturdurchgang allein hatte 27 Tastendrücke.
- **Fragen sind zufällig:** Die Reihenfolge und die Aufgaben wechseln mit jedem Lauf. Die Aufgabentexte unten stammen darum aus verschiedenen Läufen.

## 2. Ergebnis
- **Auftrag 1** erreicht. Die Runde führte nach der Stufenänderung auf Profi (Aufgabe 1 bis 4) bis zum Spielstempel („Zusammenhänge entdeckt! … Dein Spielstempel bleibt im Entdeckerpass.“).
- **Auftrag 2** erreicht, teils. Ich habe als Experte per Tab und Enter 3 Aufgaben gespielt, den Vorschlag „Ja, leichter spielen“ angenommen und die Fokus-Wege geprüft. Die Runde als Profi habe ich nicht zu Ende gespielt.

## 3. Ablauf
Alle Bilder liegen unter `/home/user/wunderkompass/.qa-output/spieltester/pr2/`. Die Nummer vorn gehört zum jeweiligen Lauf, spätere Läufe überschreiben gleichnamige Nummern. Genannt sind nur Bilder, die ich ausgewertet habe.

1. Start (`01-start.png`): Startseite mit der unteren Leiste.
2. „Spielen“ (`01-spielen.png`): Der Spielplatz zeigt 31 Angebote. Die Karte „Stimmt das wirklich?“ ist ein Knopf. Auf dem Handy musste ich weit nach unten scrollen.
3. Das Spiel öffnet auf der Stufe Entdecker, sofort mit „Aufgabe 1 von 4“. Es gibt keinen Zähler und keinen Zwischenschritt. Oben stehen „Stufe: Entdecker“ und „Ändern“ (`01-oben.png`).
4. Aufgabe 1, bewusst falsch (`01-antwort1.png`, `01-a1-falsch.png`): „Noch nicht ganz. Versuch es noch einmal!“ plus eine Erklärung. Danach die richtige Antwort: „Richtig! …“ plus „Nächste Aufgabe“ (`02-a1-richtig.png`).
5. Aufgabe 2 richtig, „Nächste Aufgabe“. Jetzt steht Aufgabe 3 von 4 da, unbeantwortet (`04-a3-vor-spielen.png`).
6. Mitten in der Runde unten auf „Spielen“ getippt (`05-nach-spielen.png`). Oben stehen eine Karte „Weiter entdecken: Stimmt das wirklich? [Fortsetzen]“ und darunter ein Knopf „Fortsetzen: Stimmt das wirklich?“. Die Karte in der Liste heißt „Runde fortsetzen“.
7. „Fortsetzen“ getippt (`01-zurueck-in-runde.png`): Es ist dieselbe Runde, wieder Aufgabe 3 von 4 mit derselben Frage. Der Stand blieb erhalten.
8. „Ändern“ (`04-aendern-offen.png`): Es erscheint „Welche Stufe willst du spielen?“ mit Entdecker „zum Reinkommen“, Profi „etwas kniffliger“, Experte „nachdenken und kombinieren“. Das ist verständlich.
9. Profi gewählt (`05-profi-gewaehlt.png`): Die Runde fängt bei „Aufgabe 1 von 4“ neu an, mit 4 Antworten (A bis D). Dazu steht „Zu schwer? Zurück zu Entdecker“ da.
10. Profi gespielt, wie ein Kind rät: mehrfach falsch, dann richtig. Nach der 3. Aufgabe kam der Vorschlag „Ganz schön knifflig. Willst du eine Stufe leichter spielen?“ mit „Ja, leichter spielen“ und „Nein, ich bleibe“ (`03-profi3.png`). Bei einem anderen Zufallslauf blieb er trotz 3 Fehlversuchen aus.
11. „Runde abschließen“ führt zum Ende (`05-ende-oben.png`, `06-ende-unten.png`): Pokal, Spielstempel-Satz, „Noch eine Runde“, „Wissen vertiefen: …“. Das war die Stempel-Stelle.
12. Zusatzläufe auf Entdecker: Nach 3 richtigen Antworten in Folge kommt „Das war leicht für dich. Willst du Profi probieren?“ mit „Ja, Profi probieren“ und „Nein, ich bleibe“ (`01-vorschlag-q3.png`). Verständlich, die Knöpfe sind 294 × 48 px groß.
13. „Nein, ich bleibe“: Der Vorschlag verschwindet, die Runde geht normal weiter (Aufgabe 4, dann Ende). Der Fokus liegt danach auf „Nächste Aufgabe“ bzw. „Runde abschließen“. Das ist sinnvoll.
14. „Ja, Profi probieren“: Die Runde fängt als Profi bei Aufgabe 1 von 4 neu an, der Fokus liegt auf „Ändern“.
15. Auftrag 2 (Rechner): „Kreuz und quer“, Stufe Experte (`02-b-experte.png`). Die Stufenzeile lautet: „Hier gibt es erst wenige Experten-Fragen. Du bekommst bis zu drei davon, dann Profi-Fragen.“ Dazu „Zu schwer? Zurück zu Entdecker“.
16. Tab-Reihenfolge: Ändern, Zu schwer?, Frage vorlesen, Tipp, A bis D, dann Fuß. Logisch.
17. Tastaturdurchgang (`01-b-nach-richtig-r1.png`, `02-b-nach-weiter-r1.png`, `04-b-nach-weiter-r2.png`, `05-b-nach-ja.png`): Details bei Befund 2 und 4. Nach „Ja, leichter spielen“ (Experte → Profi) beginnt „Aufgabe 1 von 6“ neu.

**Der Satz „Diese Runde läuft noch …“ habe ich nie gesehen.** Ich habe die Stufe in einer begonnenen Runde über „Ändern“ gewechselt, den Vorschlag mit Ja und mit Nein beantwortet und die Runde über „Spielen → Fortsetzen“ und „Alle Spiele“ verlassen und wieder betreten. Eine Stufenzeile in dieser Art kam nie. Wenn sie vorkommen soll, habe ich den Auslöser nicht gefunden.

## 4. Befunde

**Wichtig**

1. **Verwirrend / Sicht falsch: Öffnet man ein Spiel aus der Spieleliste, steht die Seite mitten im Spiel.** Auf dem Handy war die Seite 549 px nach unten gescrollt. Man sah nur die Antwortknöpfe, Überschrift, Stufenzeile und Frage lagen darüber (`01-spiel-offen.png`). Auf dem Rechner waren es 109 px. Nach „Fortsetzen“ aus der Übersicht war die Seite oben, das passte. Die Stelle zum Nachstellen: „Spielen“, weit nach unten scrollen, die Karte „Stimmt das wirklich?“ tippen. Vorschlag: Beim Spielstart nach oben scrollen (Spielüberschrift in den Blick).

2. **Verwirrend / Tastatur: Nach einer richtigen Antwort verschwindet der Fokus.** Beim Enter auf die richtige Antwort ist `document.activeElement` danach `BODY`. Das passierte im Experte-Durchgang bei jeder richtigen Antwort. Nach einer falschen Antwort blieb der Fokus auf dem Knopf. Mit Tab erreicht man „Nächste Aufgabe“ trotzdem in 1 bis 2 Schritten. Ein Screenreader oder eine Tastaturnutzerin verliert aber ihre Stelle. Vorschlag: Fokus auf die Rückmeldung („Richtig!“) oder direkt auf „Nächste Aufgabe“ setzen. Bei „Nein, ich bleibe“ klappt das schon. Es gilt für „Kreuz und quer“. In „Stimmt das wirklich?“ habe ich den Fokus nicht geprüft.

3. **Sieht falsch aus: Auf dem Handy liegt „Nächste Aufgabe“ nach der Antwort unter dem Bildrand.** In `02-q1-nach-richtig.png` (vom ersten Lauf, überschrieben) sieht man bei „Richtig!“ nur die Überschrift der Rückmeldung am unteren Rand. Die Erklärung und der Knopf „Nächste Aufgabe“ sind unter der Leiste. Eine falsche Antwort zeigt nur „Noch nicht ganz. Versuch es …“ am Rand (`01-antwort1.png`). Der Scrollstand blieb 0. Ein 9-jähriges Kind muss selbst scrollen, um weiterzukommen. Vorschlag: Nach der Antwort die Rückmeldung in den Blick scrollen, oder „Nächste Aufgabe“ unten festheften.

4. **Verwirrend / Tastatur, Rechner: Nach „Nächste Aufgabe“ ist die Frage halb abgeschnitten.** Der Fokus geht auf die Frageüberschrift (`H2`), das ist richtig. Die Seite stand aber im Lauf `02-b-nach-weiter-r1.png` 443 px nach unten gescrollt. Die Überschrift ist dort oben abgeschnitten („Warum brauchen viele Riffkorallen klares Wasser?“ halb sichtbar), die Stufenzeile ist weg. Der Fokus lag im Lauf bei y = −19, im ersten Lauf bei y = −57. Vorschlag: Nach „Nächste Aufgabe“ nach oben scrollen, bis Stufenzeile und Frage zu sehen sind.

5. **Verwirrend: Stufenwechsel mitten in der Runde wirft den Fortschritt weg, ohne es zu sagen.** Aus Aufgabe 3 von 4 wurde Aufgabe 1 von 4, ohne Hinweis und ohne Rückfrage. In „Kreuz und quer“ ging es nach „Ja, leichter spielen“ von Aufgabe 3 auf „Aufgabe 1 von 6“. Ein Kind merkt es, weil der Balken zurückspringt, versteht aber nicht warum. Genau hier würde ein Satz wie „Diese Runde läuft noch …“ helfen, den ich nie sah. Vorschlag: kurzer Satz „Neue Runde auf Profi“ oder die laufende Runde auf der alten Stufe zu Ende spielen lassen.

**Feinschliff**

6. **Verwirrend / Doppelt: Zwei gleiche Fortsetzen-Knöpfe.** In der Übersicht stehen oben die Karte „Weiter entdecken … Fortsetzen“ und direkt darunter „Fortsetzen: Stimmt das wirklich?“ (`05-nach-spielen.png`). Beide führen zum selben Spiel.

7. **Sieht falsch aus: Der Fortschrittsbalken in „Kreuz und quer“ auf dem Rechner sieht anders aus als im Handyspiel.** Er ist dunkelgrau mit leuchtendem Grün (`01-b-nach-richtig-r1.png`, `02-b-experte.png`). Bei 0 Aufgaben gelöst wirkt er wie voll. Im Spiel „Stimmt das wirklich?“ war der Balken hellgrau mit dunklem Grün. Das sieht nach dem Standard-Aussehen eines `<progress>`-Elements aus, ist aber nur eine Vermutung. Ich habe „Kreuz und quer“ auf dem Handy nicht gesehen. Eine Einheitlichkeitsfrage.

8. **Verwirrend: „Zu schwer? Zurück zu Entdecker“ auch auf Experte.** Dort wäre Profi die nächste Stufe. Ob der Sprung zwei Stufen runter gewollt ist, weiß ich nicht.

9. **Zu leicht (Entdecker, „Stimmt das wirklich?“): Rückmeldung bei falscher Antwort verrät die richtige.** Beispiel: „Korallen sind Tiere.“ Bei der falschen Antwort steht dort „Trotzdem sind sie Tiere.“ Wer zuerst falsch tippt, löst den zweiten Versuch ohne Nachdenken. Bei Profi und Experte rät man bei vier Antworten ohnehin, Fehlversuche kosten nichts.

**Ratemuster (nur Vermutungen)**
- **Hedging:** Die richtige Antwort ist oft die „vorsichtige“ oder verneinende: „Der Abstand ist nicht der Hauptgrund“ (Experte, einzige Verneinung unter vier), „Nein, sie kann sich noch erholen“, „Ja, aber schwächer als der Mond“, „Nein, er hat gar keinen festen Anfang“. Nicht immer die längste.
- **Zwillings-Antwort:** Profi „Warum wärmt die Sonne im Winter weniger?“: Richtig „Die Sonne steht tiefer, und die Tage sind kürzer“ (die längste). Die falsche A „Die Erde ist weiter weg, und die Tage sind kürzer“ ist ihr Zwilling. Profi „Winter in Deutschland“: Richtig „in Australien ist dann Sommer“, Zwilling „in Australien ist dann Frühling“. Wer einen Zwilling sieht, tippt auf einen der beiden.
- **Wort aus der Frage:** Profi „Kleine Algen leben in einer Koralle …“: Richtig ist die einzige Antwort ohne „Koralle“ („Zwei verschiedene Lebewesen arbeiten zusammen“), alle drei falschen enthalten es.
- **Entdecker „Stimmt das?“:** Falsche Aussagen enthalten oft Absolutes („für immer“, „Pilze sind Pflanzen“), wahre „kann“ („Wasser kann in die Luft verschwinden“). Von 7 gesehenen Aufgaben waren 5 wahr, 2 falsch.
- **Frage verrät Antwort:** Profi „Ist das Meer tief unten …“ und Entdecker „Pfütze“ sind Variationen derselben Wissenskarte. Das Kind sah in einem Lauf mehrere Aufgaben vom selben Thema (Meer, Wasser). Ob eine Aufgabe die nächste verrät, habe ich nicht untersucht.

**Zu schwer / zu leicht**
- **Entdecker:** zu leicht für ein 9-jähriges, liest flüssig, die erwartete Wirkung des Vorschlags „Das war leicht für dich“ nach 3 Richtigen in Folge stimmt.
- **Profi:** machbar, einige Fragen brauchen Weltwissen („Sonne zieht bei Ebbe und Flut auch mit“). Der Vorschlag kam nach 2 bis 3 Fehlversuchen nicht immer, einmal gar nicht.
- **Experte:** passend fordernd, die Vollmond-Frage (Experte) hat die Rolle zweimal falsch beantwortet.

**Tippflächen**
- Alle Knöpfe, die ich vermessen habe, sind 48 px hoch (Ändern 81 × 48, Alle Spiele 176 × 48, Neu mischen 176 × 48, Aufgabe vorlesen 134 × 48, „Zu schwer? Zurück zu Entdecker“ 248 × 48). Nicht gemessen: „Brauchst du einen Tipp?“ (die Messung traf ein verstecktes Element).

## 5. Was Spaß machte
- Der Start ohne Zähler und ohne Zwischenschritt: Das Spiel zeigt sofort eine Aufgabe.
- Die kurze Stufenzeile und die drei Stufen mit einem Satz je Stufe („zum Reinkommen“, „etwas kniffliger“, „nachdenken und kombinieren“).
- „Spielen“ → „Fortsetzen“ funktioniert: Die Runde blieb dieselbe, Aufgabe 3 von 4, dieselbe Frage.
- Die Stufen-Vorschläge sind in einfachen Worten, mit großen, klaren Knöpfen. „Nein, ich bleibe“ macht sinnvoll weiter.
- Pokal, Spielstempel-Satz und „Noch eine Runde“ am Ende der Runde.

## 6. Browser-Meldungen
Keine Konsolenfehler, keine Seitenfehler, keine gescheiterten Anfragen (in allen Läufen mitgeschrieben).

## 7. Nicht geprüft
- Ton („Aufgabe vorlesen“), Bildschirmleser, echte Geräte, andere Browser (nur Chromium).
- „Wer lebt wo?“.
- Die Profi-Runde in „Kreuz und quer“ bis zum Ende, und „Kreuz und quer“ auf dem Handy.
- Der Satz „Diese Runde läuft noch …“, siehe oben.
- Tastatur in „Stimmt das wirklich?“.
- Der Tipp-Inhalt und ob er die Antwort verrät.
- Die Offline-Vorbereitung.
