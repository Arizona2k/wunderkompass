# Personen-Rätsel: Spieltest (25.11.2026)

Helfer: `spieltester` (sonnet/high), Stand `bce6fba`, lokaler Build, Chromium. Rollenspiel, kein Kindertest. Bilder lagen unter `.qa-output/spieltester/personen/` (nicht in Git). Was Claude daraus macht, steht am Ende.

**Spieltest „Wer war das?“, Stand `bce6fba`, eigene Vorschau auf Port 4481 (beendet). Rollenspiel, kein Kindertest.**

## Auftrag
- Mia (6, mit Mama, Handy 390 px, Touch, Entdecker), Jonas (11, Rechner 1280 px, Maus und Tastatur, Profi), dazu Stufenwechsel, Neuladen und „Was ist neu?“.
- Handlungen: Mia gut 30 Schritte (eine Runde von Hand, dazu ein Durchlauf bis zum Rundenende). Jonas rund 25 und der Rest in Skripten. Die drei Jonas-Läufe mit 8 Aufgaben (2 Profi-Runden, 16 Rätsel) habe ich per Skript durchgespielt, um Ratemuster zu sammeln. Gelesen habe ich nur den sichtbaren Text. Das ist mehr als die vorgegebenen 30 Handlungen.

## Ergebnis
- Beide Runden wurden bis zum Ende gespielt, die Rundenabschluss-Seite kommt jedes Mal („Eine ganze Runde gelöst!“), keine Sackgasse, keine Browser-Fehler.
- Die Rätsel selbst sind gut: kurze Sätze, kein Name im Text, die Rückmeldung sagt, was zu tun ist.
- Auffällig sind die Stellen, an denen Mia und Jonas etwas übersehen oder verlieren (Liste unten).

## Kurzliste nach Wichtigkeit

**Muss**
1. **Rückmeldung nach einer Antwort liegt unter dem sichtbaren Bereich.** Auf dem Handy verdeckt die untere Leiste das meiste von „Noch nicht ganz. Versuch es noch einmal!“ (`.qa-output/spieltester/personen/06-aufg2-wahl0.png`, `04-erste-antwort.png`, ohne Scrollen sichtbar nur eine Kante). Die falsche Antwort wird orange, aber der Hilfetext („Hat dieser Mensch so etwas gemacht? Schau dir auch die anderen Namen an.“) steht außerhalb des Bildschirms. Mia würde ihn nicht lesen. Bei einer richtigen Antwort ist es umgekehrt: Die Seite scrollt ans Ende der langen Erklärung, die Überschrift „Richtig!“ steht oben außerhalb des Bildes (`08-aufg2-wahl2.png`). Auch am Rechner (1280×800) ist die Rückmeldung kaum zu sehen (`21-profi-aufg3-antwort.png`, nur ein Streifen unten). Vorschlag: Nach der Antwort zur Rückmeldung scrollen oder sie über den Antworten zeigen.
2. **Stufenwechsel mitten in der Runde wirft den Fortschritt weg.** Beispiel: Profi, 2 Aufgaben gelöst (Aufgabe 3 von 8) → „Zu schwer? Zurück zu Entdecker“ oder Ändern → Entdecker: neue Runde „Aufgabe 1 von 5“ (`22-nach-wechsel.png`). Zurück zu Profi: „Aufgabe 1 von 8“, die 2 gelösten Aufgaben sind weg (`26-zurueck-profi.png`). Nur Profi → Experte behält „Aufgabe 3 von 8“. Es gibt keinen Hinweis darauf vorher. Neuladen dagegen ist sauber: Die Seite landet auf dem Spielplatz mit „Weiter entdecken / Fortsetzen“, und „Fortsetzen“ führt zurück auf Profi, Aufgabe 3 von 8 (`23-nach-reload.png`, `25-fortsetzen.png`). Vorschlag: Fortschritt je Stufe merken oder vorher „Neue Runde?“ fragen.

**Soll**
3. **Entdecker ist für Mia reines Raten, wenn sie die Namen nicht kennt.** Der Tipp („Kennst du einen der Namen?“) hilft nur, wer eine Person kennt. Für ein 6-jähriges Kind kennen die wenigsten Namen wie Tu Youyou, Grace Hopper oder Lise Meitner. Der Rätselsatz allein trägt dann nicht: „Diese Person half, Befehle für Computer in Wörtern zu schreiben“ (Hopper, Meitner, Einstein) sagt Mia nichts. Wegen des Rateweges kommt sie über Ausprobieren zur Lösung, die Erklärung danach ist der eigentliche Lerneffekt. Die falschen Namen sind klar anders (Armstrong, Hadid, Johnson bei Medizin- oder Erdthemen), und einige Rätsel gehen mit dem Wort-Treffer (Welle, Gebäude, gedichtet). Die Spielkarte nennt „Ab etwa 9“: Für Mia passt das, sie braucht Mama.
4. **Die Erklärung nach „Richtig!“ ist für 6 bis 9 Jahre viel zu lang und zu schwer.** Beispiele: Lise Meitner („nationalsozialistischen Deutschland … Exil … wissenschaftlichem Austausch“), Zaha Hadid (`14-ende.png`: „Unser eigener kleiner Ausstellungsplan enthält zwei Stationen … kein Grundriss eines Hadid-Gebäudes und kein Nachweis, dass ein tatsächliches Gebäude tragfähig oder barrierefrei ist“ – verwirrend und ohne Bezug zum Rätsel), Marie Curie (ganze Seite, `08-aufg2-wahl2.png`). Das sind alte Kartentexte, nicht die neuen Rätsel. Vorschlag: Im Spiel nur 2 bis 3 Sätze zeigen, Rest hinter „Mehr lesen“.
5. **Profi: Die falschen Namen sind nur teils aus demselben Gebiet.** Das Hinweis-Wort verrät oft schon alles: Hokusai („riesige Welle … Berg Fuji … Holzblöcken“) gegen Ibn Sina, Anning, Cai Lun; Darwin („Beagle“) gegen Carson, Hokusai, Maathai (`21-profi-aufg3-antwort.png`); Armstrong („Buzz Aldrin, Apollo 11“); Benz („Motorwagen“) gegen Hadid, Leavitt, Armstrong. Gut kniffliger sind z. B. Leavitt gegen Payne-Gaposchkin und Meitner (alle Sternforscherinnen und Physikerinnen), Humboldt gegen Carson, Johnson (Weltraum-Rechnen) gegen Jemison und Bell Burnell. Insgesamt war Profi für Jonas (11) nicht kniffliger, sondern eher leicht bis mittel: In 16 Rätseln gab ich die richtige Antwort bei etwa 11 sofort aus dem Hinweiswort. Fair war es überall, kein Rätsel passt auf zwei Personen.
6. **Die Stufe Profi ist anders als im Auftrag beschrieben:** 8 Aufgaben statt 5 und 4 Antworten (A bis D) statt 3. Das macht die Runde länger und das Raten schwerer, ist aber wohl Absicht. Bitte bestätigen oder im Auftrag nachtragen.

**Kann**
7. Lange Namen mit Klammer („Karl (Carl) Benz“, „al-Chwarizmi (al-Khwarizmi)“) sind für Mia schwer zu lesen oder vorzulesen. Sie sind länger als die anderen, aber kein Ratemuster, weil al-Chwarizmi mal richtig, mal falsch ist.
8. Rundenende (`15-runde-ende.png`): Die Seite steht gescrollt, oben fehlt der Spieltitel, großer leerer Bereich. Es gibt nur „Zu einer passenden Entdeckerkarte“, „Neue Runde“ steht ganz oben außerhalb des Bildes.
9. Mit geöffnetem Tipp (Handy) verschwindet Antwort C unter dem Bildschirmrand (`03-tipp.png`), Mia muss scrollen.
10. Der Tipp-Knopf „Brauchst du einen Tipp?“ ist ein aufklappbarer Kopf (kein Button). Er funktioniert, per Tab erreichbar (Reihenfolge: Ändern → Zu schwer? → Vorlesen → Tipp → A bis D).

## Kein Ratemuster gefunden
Die Position der richtigen Antwort ist über 16 Profi-Rätsel gestreut (C, B, D, A, A, C, B, B, B, D, C, C, B, A, C, D). Die richtige Antwort ist nicht regelmäßig die längste oder kürzeste. Kein Rätsel verrät ein anderes. Bei Entdecker (5 Rätsel von Hand plus 5 im Durchlauf) kamen manche Namen häufig als falsche Antwort vor (Armstrong, Johnson, Hadid), das ist unauffällig.

## „Was ist neu?“ (`24-was-ist-neu.png`)
Der neue Eintrag steht oben („25. November 2026, Neue Rätsel bei „Wer war das?““), ist kurz und verständlich: „Jeder der 36 Menschen im Spiel hat jetzt ein eigenes Rätsel. Als Entdecker liest du einen leichten Satz, als Profi wird es kniffliger.“

## Was Spaß machte
- Die kurzen Rätsel sind knackig und konkret (Welle, Malaria, Kern im Kern, Raumfähre, Beagle). Jonas wollte weiter, die Runde von 8 war zügig.
- Die Rückmeldung bei einer falschen Antwort nennt, was man tun soll, und der Tipp ist freundlich formuliert.
- Neuladen mit „Fortsetzen“ funktioniert.

## Browser-Meldungen
Keine (keine Konsolenfehler, keine Seitenfehler, keine gescheiterten Anfragen).

## Nicht geprüft
- Experte nur kurz: Stufenwechsel Profi → Experte (gleiche Aufgabenzahl, 4 Antworten); keine eigene Runde.
- Ton und Vorlesen (Vorlesen-Knöpfe nicht getestet), echte Geräte, andere Browser, Tablet.
- Ob der Spielstempel im Entdeckerpass nach der Runde wirklich ankommt.
- Die Fachtexte der 36 Rätsel auf Richtigkeit.
- Nur 2 Profi-Runden (16 Rätsel) und 2 Entdecker-Runden (10 Rätsel) von 36 Personen gesehen.

Dateien: Bilder und Skripte in `/home/user/wunderkompass/.qa-output/spieltester/personen/` (`00-start.png` bis `26-zurueck-profi.png`, `lib.mjs`, `mia.mjs`, `jonas3.mjs`, `teil3b.mjs`, `teil3c.mjs`). Im Repository habe ich nichts geändert. Die untracked Datei `docs/entwurf/2026-11-25-personen-raetsel-designpruefung.md` stammt nicht von mir.

## Was Claude daraus macht (25.11.2026)

Zusammen mit der [Design-Prüfung](2026-11-25-personen-raetsel-designpruefung.md) ausgewertet.

- **Muss 1 (Rückmeldung außerhalb des Bildes):** echt und für alle Spiele gleich, älter als die Rätsel. Kommt in den **nächsten kleinen PR** „Rückmeldung im Blick“ in `app/kern/spiel-fokus.ts` (Welt-Spiele, Kreuz und quer, Klassik): nach einer falschen Antwort rollt die Rückmeldung über die untere Leiste ins Bild; nach einer richtigen bleibt „Richtig!“ sichtbar, der Fokus geht trotzdem auf den Weiter-Knopf. Dazu die geplante kleine CI-Suite `spiel-fokus` (BACKLOG), die genau das prüft.
- **Muss 2 (Stufenwechsel beginnt neue Runde):** so entschieden (Teil B, [Entscheidung 3](2026-11-24-teil-b-entscheidungen.md), übertragen von der Entscheidung des Nutzers zur Karte). Geschafft-Stand, Spielstempel und Wiederholungen bleiben, und „Zu schwer?“ soll gerade eine leichtere Runde bringen. Profi → Experte behält die Runde, weil Experte bei diesem Spiel wie Profi spielt (Entscheidung 34). Neu ins BACKLOG (Design-Umbau, Schritt Spiele): vorher sichtbar machen, dass eine neue Runde beginnt (z. B. Knopf „Neue Runde als Entdecker“).
- **Soll 3 (Entdecker ist Raten, wenn man keinen Namen kennt):** bekannte Grenze; die Spielkarte nennt „ab etwa 9“, und der Lernweg ist Satz 1, Tipp und Auflösung. Die kurze Auflösung (nächster PR) macht diesen Weg besser. Idee fürs BACKLOG: auf Entdecker ein Gebietszeichen (Weltall, Tiere, Bücher …) als Bildhilfe.
- **Soll 4 (Erklärung zu lang):** nächster PR, kurze Auflösung je Person (`karten-autor` schreibt sie schon).
- **Soll 5 (Profi oft am Hinweiswort lösbar):** keine Änderung. Die Profi-Regel nimmt zwei Fallen aus demselben Gebiet, wo es sie gibt; der `stufen-pruefer` hat das geprüft. Ein Test-Helfer kennt alle 36 Menschen, ein Kind von 11 meist nicht. Mit echten Kindern beobachten.
- **Soll 6 (8 Aufgaben, 4 Antworten auf Profi):** so gewollt (Teil A); der Auftrag an den Spieltester war hier ungenau.
- **Kann 7 (Namen mit Klammer):** ins BACKLOG. Vorsicht: Die angezeigten Antworten sind gespeicherte Antworten im Pass (`tests/fixtures/gespeicherte-antworten*.json`); eine Änderung braucht den Weg für alte Runden.
- **Kann 8 und 9 (Rundenende, offener Tipp schiebt Antwort C weg):** Design-Umbau, Schritt Spiele (Stempel am Spielende).
- **Kann 10 (Tipp als aufklappbarer Kopf):** bleibt; per Tastatur erreichbar und bedienbar.
