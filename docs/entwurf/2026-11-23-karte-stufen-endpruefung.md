# Endprüfung der Endfassung „Karte mit Stufen“ (23.11.2026)

Prüft [die Endfassung](2026-11-23-karte-stufen-endfassung.json). Teilprüfungen durch Helfer.

## stufen-pruefer

**Gesamturteil:** Die Endfassung `/home/user/wunderkompass/docs/entwurf/2026-11-23-karte-stufen-endfassung.json` hält die Stufen fast überall. Die Vereinfachungen haben keine Profi- oder Experten-Frage merklich leichter gemacht, und Punkt 4 ist erfüllt: Alle 12 Pilot-Karten haben mindestens eine Profi- und eine Experten-Frage (beim Wasserkreislauf kommen die Profi-Fragen aus der Challenge, bei Steinwerkzeuge gibt es zusätzlich „Ordne richtig“), und alle Challenge-Karten haben mindestens zwei Profi-Fragen. Die Ratemuster liegen im Rahmen (mit node nachgezählt): Bei pilot ist die richtige Antwort in 17 % die einzige längste und in 24 % die einzige kürzeste, bei challenge in 19 % bzw. 12 %. Übertreibende Wörter stehen in falschen Antworten nicht auffällig häufiger als in richtigen (Profi pilot 21 % zu 13 %, challenge 28 % zu 17 %). Die Antworten werden in der App gemischt (`rate-mal.tsx`, `knowledge-challenge.ts`), die Stelle der richtigen Antwort verrät also nichts. Zwei Fragen sind durch die Überarbeitung schlechter geworden, dazu kommen ein paar ältere Muster.

**Befunde**

1. **`animal-common-octopus:rate-3`, Tipp 2 (durch die Überarbeitung schlechter geworden):** Der neue Tipp „Weichtiere haben keine Knochen.“ wiederholt die richtige Antwort wörtlich („Er hat keine Knochen …“). Damit fällt auch die gute Falle „Seine Knochen sind weich und biegsam“ weg. Vorschlag, kindgerecht und mit Denkschritt: „Denk an eine Schnecke. Hat sie innen etwas Hartes?“

2. **`science-water-cycle:rate-4`, Antworten (durch die Überarbeitung schlechter geworden):** Alle drei falschen Antworten beginnen jetzt mit „Es …“. Nur die richtige fängt anders an und ist außerdem knapp die längste (37 zu 36). Vorschlag für die richtige Antwort: „Es ist Wasserdampf aus der Luft“ (31 Zeichen, dann weder die längste noch die kürzeste).

3. **`person-marie_curie:rate-3`:** Die Längen sind in Ordnung (40 zu 38/38/35, nur 2 Zeichen Unterschied). Kein Befund.

4. **`person-marie_curie:rate-2`, Profi:** Nur die richtige Antwort trägt den Nachnamen aus der Frage („Marie Curie“ und „Pierre Curie“). Das löst man durch bloßes Vergleichen der Wörter. Vorschlag: „Mit ihrem Ehemann Pierre“ (24 Zeichen, dann nicht die kürzeste, denn die Irène-Antwort hat 23).

5. **`history-apollo11:rate-4`, Experte:** Die richtige Zahl ist die einzige, die nicht in der Frage vorkommt (4, 1 und 8 stehen dort). Vorschlag: Antwort [3] „Etwa 8 Tage“ ersetzen durch „Etwa 2 Tage“, mit der Erklärung „Rechne noch einmal: 8 minus 4 minus fast 1.“

6. **`animal-african-savanna-elephant:rate-4`, Experte:** Die richtige Antwort ist deutlich die längste (45 zu höchstens 38), und keine Falle hat mit Wasser zu tun. Vorschlag: [0] „Sie ist die Stärkste und kann Löwen vertreiben“, [2] „Sie läuft am schnellsten zum nächsten Wasser“ (Erklärung: „Schnell sein hilft nichts, wenn man nicht weiß, wohin.“).

7. **`fastRichtig` (`person-marie_curie:stimmt-1`):** Es gibt praktisch nur zwei Möglichkeiten, denn „Marie Curie“ kann auf ihrer eigenen Karte nie das falsche Wort sein. Das Ersatzwort steht außerdem wörtlich im Häppchen („1898 entdeckte sie …“). Das ist höchstens knapp Experte. Vorschlag für die Behauptung: „Marie Curie hat 1898 mit Pierre das Radium erfunden.“ Zur Auswahl dann „1898“, „Pierre“, „Radium“, „erfunden“. Das Kind muss jedes Detail mit dem Häppchen vergleichen, und genau darum geht es bei „Fast richtig“. Das Ersatzwort bleibt „entdeckt“. Der Plan sah zwei Behauptungen vor, in der Endfassung ist nur eine.

8. **`ordnen` (`history-stone_tools:ordnen-1`):** Die Aufgabe weicht von E4 ab („4 Teile, die nah beieinander liegen“). Dinosaurier und Pyramiden sind leicht einzuordnen. Knifflig ist nur Werkzeug gegen Feuer, und das steht in einem einzigen Satz bei „Stimmt das?“, auf den Tipp 2 direkt zeigt. Als Probe ist das vertretbar. Vorschlag für Tipp 2, damit noch etwas zu suchen bleibt: „Eine Stelle auf der Karte vergleicht zwei dieser Teile direkt. Such sie.“ Für spätere „Ordne richtig“-Aufgaben gehören Teile, die zeitlich näher beieinanderliegen, ins BACKLOG.

9. **Quatsch-Antworten auf Profi (Challenge, alte Antworttexte, nur mit Alias änderbar):**
   - `science-fungi-2` [1] „Pollen als einziges Futter“ ersetzen durch „Licht“.
   - `science-tides-4` [1] „Nur Vollmond erzeugt Schwerkraft“ ersetzen durch „Dann dreht sich die Erde schneller“.

10. **`person-maria_sibylla_merian:limits`:** Die richtige Antwort ist mit 72 Zeichen weit die längste (die anderen 41 bis 57) und braucht am Handy sichtbar eine Zeile mehr. Vorschlag der Redaktion übernehmen, mit Alias: „Auch andere Menschen in Suriname halfen ihr.“ (44). Der Teil über einheimische und versklavte Menschen steht schon im `why`.

11. **Für Aufgabe 9 (Wissens-Challenge):**
    - Auf Experte gibt es nur 4 Challenge-Fragen (fungi-3, coral-reef-4, moon-phases-4, seasons-3). Eine Runde hat 6 Plätze (`knowledge-challenge.ts`, `slice(0,6)`), also ist jede Experten-Runde gleich. Vorschlag: die 12 Experten-Fragen der Pilot-Karten mit in den Topf nehmen, oder mit ungesehenen Profi-Fragen auffüllen.
    - Die Auswahl muss nach `level` gehen, nicht nach `difficulty`. Sonst landen die 8 Fragen mit drei Antworten (Entdecker, aber `difficulty: "medium"`) in der Profi-Runde.

**Unsicher:** Ob „Fast richtig“ und „Ordne richtig“ in dieser Form 11-Jährigen Spaß machen und knifflig genug sind, kann ich nur schätzen. Das zeigt erst die Rückmeldung echter Kinder über den Nutzer.

## fakten-pruefer

## Nachprüfung der Endfassung „Karte mit Stufen“ (fakten-pruefer, Teilprüfung)

Geprüft habe ich in `/home/user/wunderkompass/docs/entwurf/2026-11-23-karte-stufen-endfassung.json` alle 56 IDs aus `neuOderGeaendert`, dazu `fastRichtig` und `ordnen`. Jeden Text habe ich mit dem Entwurf verglichen. Bezüge wie „Lies im Steckbrief …“ oder „Schon gewusst?“ habe ich in `/home/user/wunderkompass/app/world-catalog.json` nachgesehen. Geändert habe ich nichts.

**Ergebnis:** Die fünf Punkte, nach denen du gefragt hast, stimmen alle. Nur bei Merian passt ein Wort nicht ganz. Sechs weitere kleine Befunde stehen unten, einer davon ist eine Antwort, die nicht eindeutig falsch ist (Elefant rate-3).

### Die fünf Punkte, nach denen du gefragt hast

**building-giza-pyramids:rate-2:** stimmt.
- Tura liegt am Ostufer, Gizeh am Westufer.
- Beleg: Wikipedia „Stone quarries of ancient Egypt“, gestützt auf Harrell 2016 (JARCE 52): „Tura-Masara … spans 6 km of underground quarries along the eastern bank of the Nile“ (https://en.wikipedia.org/wiki/Stone_quarries_of_ancient_Egypt).
- Dass die Steine per Schiff kamen, sagt das ägyptische Ministerium: „brought from Turah … by ship“ (https://egymonuments.gov.eg/en/monuments/the-great-pyramid).

**person-maria_sibylla_merian:limits:** stimmt mit Einschränkung.
- Dass einheimische und versklavte Menschen ihr Pflanzen und Tiere zeigten, ist belegt. Rijksmuseum: „They collected plants and insects for Merian and helped her identify and name them.“ (https://www.rijksmuseum.nl/en/stories/10-things/story/maria-sibylla-merian-en)
- Aber „Ihre Namen fehlen **oft**“ klingt, als stünden manche Namen im Buch. Laut Kurator des Rijksmuseums nennt sie niemanden mit Namen: „she clearly describes that specimens were handed over or that the local population or enslaved people pointed out things to her, but she doesn't mention [them by] name“ (https://theartnewspaper.com/2024/09/03/rijksmuseum-acquires-controversial-early-botanic-book-on-suriname).
- Den Text von 1705 selbst habe ich nicht gelesen.
- **Vorschlag:** „Ihre Namen schrieb sie nicht ins Buch.“

**animal-polar-bear:rate-3:** stimmt.
- „Bis zu zehn Zentimeter“ steht genauso auf der Karte. SeaWorld nennt sogar bis 11 cm, die Karte bleibt also vorsichtig.
- „Fast so lang wie deine Hand“: Bei 5- bis 10-Jährigen ist die Hand nach meinem Fachwissen etwa 12 bis 15 cm lang, also passt „fast“. Eine Messquelle habe ich nicht erreicht (Seiten gesperrt).
- Die neue Begründung zur Haut ist frei vom Glasfaser-Mythos.

**person-marie_curie:rate-3:** stimmt. Alle drei falschen Antworten sind eindeutig falsch:
- Das Erz kam aus Joachimsthal in Böhmen, nicht aus Polen (AIP, https://history.aip.org/exhibits/curie/discover.htm).
- Pierre Curie war Franzose.
- Das Geld hat mit dem Namen nichts zu tun.
- Tipp 2 stimmt: Warschau gehörte zum russischen Teil Polens.
- **Hinweis:** Tipp 1 schickt Kinder in den Steckbrief. Dort steht noch „Polen wurde damals von Russland beherrscht“. Das widerspricht Tipp 2 („aufgeteilt“) und sollte angeglichen werden: „In Warschau. Polen war damals aufgeteilt, Warschau gehörte zu Russland.“

**Challenge-Fragen der kinder-redaktion:** Fast alles passt. Befunde nur bei science-photosynthesis-1, -4, science-fungi-1, science-tides-2, science-water-cycle-3 (unten).

### Weitere Befunde

**animal-african-savanna-elephant:rate-3** (Antwort 4 „Meist die Mutter mit den meisten Jungen“)
- **Befund:** Nicht eindeutig falsch. Das habe ich im ersten Durchgang übersehen. Elefantenkühe bekommen bis über 65 Junge. Die älteste Kuh, also meist die Leitkuh, hat darum oft auch die meisten Jungen geboren. Die Beschreibung trifft dann dasselbe Tier.
- **Beleg:** Lee u. a. 2016, Amboseli, 834 Weibchen: „reproduction does not entirely cease until they are over 65“ (https://pmc.ncbi.nlm.nih.gov/articles/PMC4748003).
- **Vorschlag:** Antwort „Das Weibchen, das am lautesten trompetet“. wrongReason: „Laut sein macht ein Tier nicht zur Anführerin. Wichtig ist Erfahrung.“

**science-photosynthesis-4** (wrongReason zu Antwort 2: „Licht stört die Zellatmung nicht. Sie läuft auch am Tag.“)
- **Befund:** Der erste Satz ist falsch. In Blättern ist die Zellatmung bei Licht meist schwächer als im Dunkeln (Kok-Effekt).
- **Beleg:** Tcherkez u. a. 2017, New Phytologist 214: „The Kok effect is believed to be primarily caused by the inhibition of respiration by light“. Die Atmung bei Licht ist „typically lower than … the rate of respiration in darkness“ (https://buckleylab.ucdavis.edu/wp-content/uploads/sites/511/2018/01/tcherkez-et-al-2017-kok-effect.pdf).
- **Vorschlag:** „Die Zellatmung läuft auch am Tag, nicht nur im Dunkeln.“

**science-tides-2** (wrongReason zu Antwort 2: „Das Wasser braucht Zeit, bis es an jede Küste kommt.“)
- **Befund:** Der Satz weckt das Bild, dass Wasser von Ort zu Ort fließt. Tatsächlich läuft eine Gezeitenwelle um die Nordsee. Die Karte warnt selbst: „Die Gezeiten sind keine einfache Wasserwelle, die überall gleich ankommt.“
- **Beleg:** wetterdienst.de: „Die Gezeiten werden durch eindringende Gezeitenwellen aus dem Nordatlantik ausgelöst. Sie laufen … südwärts … ostwärts“ (https://www.wetterdienst.de/Deutschlandwetter/Thema_des_Tages/6503/gezeiten-an-nord-und-ostsee-windstau-und-sturmflutwarndienst-und-amphidromische-punkte).
- **Vorschlag:** „Die Flut läuft wie eine Welle an den Küsten entlang. Sie kommt nicht überall gleichzeitig an.“

**science-fungi-1** (why: „So wird daraus wieder Erde.“)
- **Befund:** Das Wort „wieder“ stützt eine bekannte Fehlvorstellung: Pflanzen seien aus Erde gemacht. Das widerspricht der Fotosynthese-Karte („Ein Teil der Stoffe in einem Baum stammt ursprünglich aus der Luft“). Beim Zersetzen geht auch viel als Kohlendioxid in die Luft zurück.
- **Beleg:** UC Davis, Kursseite Bodenkunde (aufgerufen über die Suche): Beim Zersetzen entstehen Kohlendioxid und Humus, dabei werden Nährstoffe frei (https://lawr.ucdavis.edu/classes/ssc219/biogeo/decomp.htm).
- **Vorschlag:** „Pilze zerlegen totes Laub und Holz. Daraus wird nach und nach Erde mit Nährstoffen für neue Pflanzen.“

**science-photosynthesis-1** (why: „Die Kraft dafür kommt vom Licht.“)
- **Befund:** Kraft und Energie werden oft verwechselt. Die Karte selbst sagt „Lichtenergie“, und photosynthesis-3 sagt „Energie vom Sonnenlicht“.
- **Vorschlag:** „Die Energie dafür kommt vom Licht.“

**science-water-cycle-3** (why: „Durch Asphalt kommt kein Wasser.“)
- **Befund:** Klein. Es gibt wasserdurchlässigen Asphalt, und durch Risse sickert etwas. Das ist mein Fachwissen, eine Quelle habe ich nicht aufgerufen.
- **Vorschlag:** „Durch Asphalt kommt kaum Wasser.“

### Ergebnis

Alle übrigen geprüften IDs passen, ebenso `fastRichtig` (person-marie_curie:stimmt-1) und `ordnen` (history-stone_tools:ordnen-1).
- Die Bezüge „Steckbrief“, „Schon gewusst?“, „Häppchen“, „Rhythmus“ und „Stimmt das?“ treffen in allen geprüften Fragen echte Kartentexte.
- Bei Curie rate-3 passt der Steckbrief nicht zu Tipp 2 (siehe oben).

### Nicht geprüft

- **Ohne neue Quelle, aus Fachwissen oder dem ersten Bericht:** Kamele, Korallen ohne Augen, Größe des Erdschattens, Einstein 1898 als Student, Irène geboren 1897.
- **Handlänge von Kindern:** ohne Messquelle, die Tabellen waren gesperrt.
- **Merians Originaltext von 1705:** nicht gelesen.
- **Gezeiten-Broschüre des Nationalparks Wattenmeer:** nicht ladbar, nur der Auszug aus der Suche.
- **Sprache und Schwierigkeit:** nicht beurteilt.
