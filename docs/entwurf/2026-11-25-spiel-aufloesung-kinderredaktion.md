# Kinder-Redaktion: kurze Auflösungen und Tipps

Helfer: kinder-redaktion (opus/high), 25.11.2026. Prüft den Entwurf docs/entwurf/2026-11-25-spiel-aufloesung-entwurf.md.

Ich habe nur gelesen und nichts geändert. Gelesen habe ich den Entwurf, `EIGENE_RAETSEL` und die Tipp- und Rückmeldungs-Logik in `/home/user/wunderkompass/app/world-game-support.mjs` sowie die Karten Hopper, Humboldt und Bell Burnell in `app/world-catalog.json`. Die Zeichen habe ich von Hand gezählt, weil ich keine Shell hatte. Bitte beim Einbau mit `node` nachzählen.

### Gesamteindruck: gut, mit einigen nötigen Änderungen

Die Texte sind kurz, warm und meist gut vorlesbar. Viele bringen eine echte Erkenntnis, zum Beispiel Darwin, Cai Lun, Gutenberg/Korea, Katherine Johnson, Hokusai und Franklin mit der Wendeltreppe. Schwächen gibt es an drei Stellen:
- Ein paar Texte bleiben leer oder setzen Wissen voraus, zum Beispiel „überraschte damals viele“, COBOL und CERN.
- Mehrere Texte beziehen sich auf Rätselsätze, die nur Profi sieht.
- Viele Texte fangen gleich an: „X war [Beruf] in [Land].“ Das kostet Platz, der für das Spannende fehlt.

**Muster, das man prüfen sollte (Entdecker sieht nur Rätselsatz 1):** Die Auflösung gilt auf allen Stufen. Darum darf sie sich nicht auf Satz 2 oder 3 beziehen. Das betrifft Curie („der neuen Grundstoffe“), Humboldt („Auf der Reise“), Mandela („Apartheid“), Franklin („DNA“) und Bertha Benz („Motorwagen“, das Rätsel sagt „Autos“). Vorschläge dazu stehen unten.

### Fachwörter, nach denen der Autor fragt
- **Physiker:** erklären (Muss), siehe Einstein.
- **Mathematikerin:** kann bleiben, denn „Mathe“ kennt jedes Schulkind.
- **Anwalt:** kurz erklären, siehe Mandela.
- **Generationen:** gut, wird im selben Satz erklärt.
- **Patent:** Die Erklärung „Schutz für eine Erfindung“ ist zu abstrakt. Besser: „Niemand durfte … einfach nachbauen.“
- **Ingenieur:** gut erklärt.
- **Algorithmus:** gut erklärt. Ein Vergleich mit einem Rezept macht es noch greifbarer.
- **Architektin:** gut erklärt.

### Paket A: Urteil je Text

1. **Goodall: ändern (Kann).** „wilde Schimpansen“ steht schon im Rätsel, und „im heutigen“ klingt nach Erwachsenen.
   „Jane Goodall forschte im Wald von Tansania, in Afrika. Am Anfang liefen die Schimpansen vor ihr weg. Erst nach Monaten gewöhnten sich die Tiere an sie.“ (150)
2. **Maathai: ändern (Kann).** „setzte sich … ein“ ist abstrakt, Kenia und Bäume stehen schon im Rätsel, und das Passiv ist steif. Die Erkenntnis „Pflanzen allein reicht nicht“ soll vorne stehen.
   „Wangari Maathai wollte, dass die Bäumchen auch groß werden. Darum wurden sie nach dem Pflanzen gepflegt. Später zählte man, wie viele noch wuchsen.“ (147)
3. **Lovelace: ok.**
4. **Bertha Benz: ändern (Muss).** „auch“ steht zweimal. „Motorwagen“ ist für Entdecker nicht eingeführt. „Gab Geld“ ist als Erkenntnis schwach.
   „Bertha Benz zeigte mit ihrer Fahrt: Das neue Auto schafft auch weite Strecken. Ihr Mann Karl Benz hatte es gebaut. Sie gab Geld für seine Arbeit.“ (145)
5. **Cai Lun: ok.** Kann: „am Hof des Kaisers“ steht schon in Rätselsatz 2. Stattdessen „Cai Lun arbeitete für den Kaiser von China.“ (Satz 1 hat dann 43 statt 47 Zeichen, zusammen 147.)
6. **Curie: ändern (Muss).** „Einer der neuen Grundstoffe“ setzt Profi-Satz 3 voraus.
   „Marie Curie stammte aus Polen und forschte in Paris. Mit ihrem Mann fand sie einen neuen Grundstoff. Sie nannten ihn nach Polen: Polonium.“ (138)
7. **Carson: ändern (Kann, empfohlen).** Der Titel „Der stumme Frühling“ bleibt ohne Erklärung rätselhaft. Die Erklärung ist aber das Spannende daran.
   „Rachel Carson erforschte das Leben im Meer. Ihr Buch über Gift heißt „Der stumme Frühling“. Gemeint ist ein Frühling, in dem keine Vögel mehr singen.“ (149)
8. **Lehmann: ok.**
9. **Tu Youyou: ok.**
10. **Merian: ok.**
11. **Gutenberg: ändern (Kann).** „in Mainz“ steht schon in Rätselsatz 1. „Bibel“ kennen Kleine oft nicht; die Erklärung ist neutral.
    „Johannes Gutenberg war Handwerker und Erfinder. Seine Werkstatt druckte die Bibel, das heilige Buch der Christen. In Korea druckte man aber schon früher mit Metall-Buchstaben.“ (175)
    Ohne den Bibel-Zusatz wären es 154 Zeichen.
12. **Hokusai: ok.** Kann: „Er zeichnete die Bilder nur vor.“ betont die Erkenntnis.
13. **Humboldt: ändern (Muss).** „Auf der Reise“ fehlt bei Entdecker der Bezug. „Aimé Bonpland“ ist schwer vorzulesen, und ein Name bringt Kindern nichts.
    „Alexander von Humboldt nahm Messgeräte mit auf seine Reisen. Ein Pflanzenforscher aus Frankreich reiste mit ihm. Auch Menschen, die dort lebten, halfen mit.“ (155)
14. **Hopper: ändern (Muss).** „COBOL“ ist eine Abkürzung ohne Nutzen. Satz 2 wiederholt den Rätselsinn.
    „Grace Hopper war Mathematikerin in den USA. Früher bestanden Computer-Befehle oft nur aus Zahlen. Wörter sind für Menschen viel leichter zu lesen.“ (146)
    Zweifel für den `fakten-pruefer`: „oft nur aus Zahlen“ steht nicht auf der Karte.
15. **Katherine Johnson: ok.**
16. **Berners-Lee: ändern (Muss).** „CERN“ ist eine Abkürzung, „Web-Programme“ ist Englisch.
    „Tim Berners-Lee ist ein Computer-Fachmann aus England. Er arbeitete an einem Forschungszentrum in der Schweiz. Später durfte jeder seine Erfindung kostenlos nutzen.“ (164)
17. **Anning: ändern (Kann).** Satz 2 wiederholt den Rätselwortlaut „Meerestier aus uralter Zeit“ und hat 12 Wörter.
    „Mary Anning legte Fossilien vorsichtig aus dem Stein frei. Zuerst fand ihr Bruder Joseph einen Schädel. Später fand Mary weitere Teile dieses Tieres.“ (149)
18. **Ibn al-Haytham: ändern (Muss).** „Das stimmt aber nicht.“ klingt wie eine Belehrung und verpufft. Für Profi steht die Lösung schon in Rätselsatz 2. „der auch in Kairo arbeitete“ ist holprig. Besser als Aha-Umkehr:
    „Ibn al-Haytham arbeitete eine Zeit lang in Kairo, in Ägypten. Früher dachten viele: Augen schicken Strahlen aus wie eine Taschenlampe. Er zeigte: Es ist umgekehrt.“ (163)
19. **Leavitt: ok.** Kann: „Je länger …, desto mehr …“ ist für 5- bis 7-Jährige schwer. Stattdessen „Ihr Fund: Ein Stern mit langsamem Takt leuchtet stärker.“ (gesamt 129)
20. **Payne-Gaposchkin: ändern (Muss).** „Ihr Ergebnis überraschte damals viele“ sagt nicht, was überraschte. Es ist auch das Echo zu Wu. Der Rätselwortlaut „Licht der Sterne“ wiederholt sich.
    „Cecilia Payne-Gaposchkin zerlegte Sternenlicht in seine Farben wie beim Regenbogen. Sie fand heraus: Sterne sind anders gebaut als die Erde. Fast alles darin ist leichtes Gas.“ (176)
    Ohne „wie beim Regenbogen“ sind es 156 Zeichen.
21. **Franklin: ändern (Kann).** Entdecker kennt „DNA“ nicht, Rätselsatz 1 sagt nur „Bauplan“.
    „Rosalind Franklin war Forscherin in London. Ihr Röntgenbild gab einen Hinweis: Der Bauplan DNA ist gedreht wie eine Wendeltreppe.“ (129)
22. **Bell Burnell: ändern (Kann).** „damals“ hängt in der Luft. Satz 3 bringt ohne Bild wenig.
    „Jocelyn Bell Burnell war eine junge Forscherin in England. Die Signale kamen von Resten großer Sterne. Diese Reste drehen sich und blitzen wie ein Leuchtturm.“ (158)
    Den Leuchtturm-Vergleich soll der `fakten-pruefer` ansehen.
23. **Butler: ändern (Muss).** „E.“ stört beim Vorlesen und bei der Satzteilung. Satz 3 lässt sich zuspitzen.
    „Octavia Butler war Schriftstellerin in den USA. Ihre Notizen und Entwürfe liegen heute in einer Bibliothek. Darin sieht man: Sie schrieb ihre Texte oft um.“ (155)
24. **Wu: ändern (Muss).** Der eingeschobene Relativsatz „…, an die viele glaubten, …“ ist ein Schachtelsatz. Das „viele“ ist das Echo zu Payne.
    „Chien-Shiung Wu wurde in China geboren und forschte später in den USA. Ihr Versuch zeigte: Auch eine bekannte Naturregel gilt nicht immer.“ (140)
25. **Meitner: ok.** Kann: „Zerbricht ein Atomkern, kann …“ ersetzen durch „Wenn ein Atomkern zerbricht, wird Energie frei.“ (gesamt 146, 13 Wörter, notfalls teilen). Gut ist, dass die Bombe nicht vorkommt.
26. **Hadid: ändern (Kann).** Malerei allein ist mäßig spannend. Der Pritzker-Preis als erste Frau passt jetzt hinein.
    „Zaha Hadid war Architektin: Sie entwarf Häuser und andere Bauten. Als erste Frau bekam sie einen der wichtigsten Preise für Baukunst. Ihre Ideen malte sie auch als Bilder.“ (171)
27. **Ibn Sina: ändern (Kann).** „Wissensgebieten“ ist schwer.
    „Ibn Sina wusste viel über Medizin und noch viele andere Dinge. In Europa nannte man ihn Avicenna. Dort übersetzte man sein Buch und schrieb es lange ab.“ (152)
28. **Darwin: ok.** Stärkster Text: Er räumt einen Irrtum aus.
29. **Murasaki: ändern (Kann).** Japan und Kaiserhof stehen schon im Rätsel. Mit 176 Zeichen ist der Text zu voll.
    „Murasaki Shikibus eigene Handschrift gibt es nicht mehr. Wir kennen ihre Geschichte nur, weil andere sie von Hand abschrieben.“ (126)
30. **Mandela: ändern (Muss).** „Apartheid“ steht nur in Profi-Satz 2 und wiederholt das Rätsel. „Anwalt“ wird nicht erklärt. „viele Jahre“ verschenkt die starke Zahl.
    „Nelson Mandela war Anwalt: Er half Menschen vor Gericht. Für seinen Kampf saß er 27 Jahre im Gefängnis. Trotzdem gab er nicht auf.“ (130)
    Die 27 Jahre soll der `fakten-pruefer` bestätigen. Das Jahr 1990 fällt dafür weg, damit es bei einer Zahl bleibt.
31. **Jemison: ok.** „Ärztin“ steht in Profi-Satz 2 schon sinngemäß, das stört aber nicht.
32. **Karl Benz: ändern (Muss).** Vorgelesen klingen Karl und Carl gleich, „auch Carl geschrieben“ verwirrt also nur. Zwei Erklär-Einschübe hintereinander sind zu viel. „Bertha Benz half ihm.“ ist flach.
    „Karl Benz war Ingenieur, also ein Fachmann für Technik. 1886 bekam er ein Patent: Niemand durfte seinen Motorwagen einfach nachbauen. Seine Frau Bertha half ihm dabei.“ (167)
    Das passt zu Vorschlag 4: Beide Texte verweisen aufeinander.
33. **Einstein: ändern (Muss).** „Physiker“ wird nicht erklärt. Mit 110 Zeichen ist Platz dafür.
    „Albert Einstein war Physiker, also ein Forscher für Licht, Kraft und Bewegung. Geboren wurde er in Ulm. Er beschrieb Licht als winzige Päckchen voller Energie.“ (161)
34. **Al-Chwarizmi: ok.** Kann: „Bagdad“ steht schon im Rätsel, und ein Rezept-Vergleich macht den Text greifbarer.
    „Al-Chwarizmi forschte über Zahlen und über die Sterne. Von seinem Namen kommt das Wort „Algorithmus“. Das ist eine Anleitung in festen Schritten, wie ein Rezept.“ (161)
35. **Armstrong: ändern (Kann).** „Testpilot“ wird nicht erklärt. Wer Collins ist, bleibt offen.
    „Neil Armstrong testete vorher neue Flugzeuge. 1969 betrat er als erster Mensch den Mond. Ein dritter Mann, Michael Collins, wartete oben im Raumschiff.“ (151)
36. **Tagore: ändern (Kann).** „entstanden aus“ ist umständlich. „erster aus Asien“ ist spannender als „für Literatur“.
    „Rabindranath Tagore war ein Dichter aus Indien. 1913 bekam er als erster Mensch aus Asien den Nobelpreis. Manchmal malte er aus durchgestrichenen Wörtern Bilder.“ (162)
    „erster Mensch aus Asien“ soll der `fakten-pruefer` bestätigen.

**Zu den beiden Fragen zum Ton und zum Doppelten:**
- „Das stimmt aber nicht.“ ist leicht belehrend. Die Umkehr „Er zeigte: Es ist umgekehrt.“ ist eine Entdeckung statt einer Zurechtweisung.
- „überraschte damals viele“ und „an die viele glaubten“ wären in einer Runde ein hörbares Echo. Die Vorschläge 20 und 24 lösen beides auf.

### Paket B

- **people-Tipp: ändern (Kann).** „forschten“ passt nicht auf alle, zum Beispiel nicht auf Mandela, Tagore, Murasaki oder Hokusai.
  „Manche Menschen hier machten ähnliche Dinge. Such im Hinweis nach etwas Besonderem: einem Ort, einem Jahr oder einem Werkzeug.“ (126)
  Das Wort „Hinweis“ passt zur Spielfrage „Wer passt zu diesem Hinweis?“.
- **habitats: ok.** Das Kind kann sofort schauen. Kleine Unschärfe: Vögel haben Beine und Flügel, Pinguine Flügel als Flossen. Als Denkanstoß reicht es.
- **food: ok.** Kann, falls die Entwicklungsstufen-Antworten Kinder stolpern lassen: „Lies jede Antwort bis zum Ende. Manchmal frisst ein junges Tier etwas anderes als ein großes.“ Das hilft, ohne die Lösung zu verraten.
- **technology: ok.**
- **then-now: ok.** Kann: „Dinge“ statt „Geräte“, denn Papier und Buchdruck sind keine Geräte.
- **people, falsche Antwort (Profi/Experte): ok.** Gleiches Muster wie bei Entdecker, beschämt nicht.
- **then-now, „Erst in der Zukunft“: ok mit Kleinigkeit.** „Das hier“ ist vage, und das Komma vor „oder“ fällt weg:
  „Du hast „Erst in der Zukunft“ gewählt. Das gab es schon wirklich. War es früher so oder ist es heute so?“
  Bei „Heute“-Aufgaben klingt „gab“ etwas schief. Das lässt sich hinnehmen, sonst „Das gibt es nicht erst in der Zukunft.“

### Muss
1. Hopper ohne COBOL (14), Berners-Lee ohne CERN und „Web-Programme“ (16).
2. Payne-Gaposchkin konkret statt „überraschte viele“ (20). Wu ohne Schachtelsatz (24). Damit ist auch das Echo weg.
3. Ibn al-Haytham: „Es ist umgekehrt“ statt „Das stimmt aber nicht“ (18).
4. Kein Bezug auf Wörter, die nur in Profi-Rätselsätzen stehen: Curie (6), Humboldt (13), Mandela (30), Bertha Benz (4).
5. Fachwörter erklären: Physiker (33) und Anwalt (30). Patent greifbar erklären (32).
6. Vorlesbarkeit: „auch Carl geschrieben“ weg (32), „E.“ bei Butler weg (23), „Bonpland“ weg (13).

### Kann
- Carson mit Erklärung des Titels (7, empfohlen) und Hadid mit dem Preis als erste Frau (26). Beides bringt deutlich mehr Erkenntnis.
- Wiederholungen aus dem Rätsel abbauen: Goodall, Maathai, Cai Lun, Gutenberg, Anning, Murasaki, Al-Chwarizmi.
- Kleinere Verständlichkeit: Franklin (DNA), Leavitt (je … desto), Meitner, Ibn Sina, Armstrong, Bell Burnell (Leuchtturm), Tagore.
- Paket B: Wortlaut des people-Tipps, food-Zusatz, „Dinge“ bei then-now, „Das hier“ in der then-now-Rückmeldung.
- Allgemein: Den Einstieg „X war [Beruf] in [Land].“ nur nutzen, wo er etwas Neues bringt. Sonst gleich mit dem Spannenden beginnen.

### Unsicher
- Neue oder zugespitzte Aussagen in meinen Vorschlägen muss der `fakten-pruefer` prüfen: Mandela 27 Jahre, Tagore „erster Mensch aus Asien“, Hadid „einer der wichtigsten Preise“, Hopper „Befehle oft nur aus Zahlen“, Bell Burnell Leuchtturm, Payne-Gaposchkin „anders gebaut als die Erde / leichtes Gas“, Humboldt „aus Frankreich“, Curie „mit ihrem Mann … nannten“.
- Ob das habitats-Spiel das Tierfoto wirklich auf allen Stufen zeigt, habe ich nicht im Browser geprüft.
- Der vorgeschlagene Test „Auflösung beginnt mit dem Namen“ ist bei Murasaki („Shikibus“) nur als Textanfang erfüllt. Das sollte der Test zulassen.
