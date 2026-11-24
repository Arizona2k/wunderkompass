# Sprachprüfung des Inhaltsentwurfs „Karte mit Stufen“ (kinder-redaktion, 23.11.2026)

Prüft [den Entwurf](2026-11-23-karte-stufen-entwurf.md). Teilprüfung durch einen Helfer.

Ich habe den ganzen Entwurf gelesen: /home/user/wunderkompass/docs/entwurf/2026-11-23-karte-stufen-entwurf.md (alle 441 Zeilen, Teile A bis E). Die JSON-Datei /home/user/wunderkompass/docs/entwurf/2026-11-23-karte-stufen-entwurf.json habe ich bis Zeile 1206 gelesen und dort mit dem Markdown abgeglichen; die Texte sind gleich. Zum Vergleich habe ich außerdem `app/challenge-hints.json` und die Karte `history-apollo11` angesehen. Geändert habe ich nichts.

## Neue Texte: Befunde je Fragen-ID

**animal-african-savanna-elephant:rate-3**
- wrongReasons[1]: „Junge Männchen verlassen die Familie, wenn sie groß werden.“ → „Junge Männchen haben noch wenig Erfahrung.“
  - Grund: Der alte Satz wiederholt fast wörtlich den Tipp.

**animal-african-savanna-elephant:rate-4**
- prompt: „… Warum ist es dann gut, dass die älteste Elefantenkuh die Herde führt?“ → „In einem sehr trockenen Jahr sind viele Wasserlöcher leer. Die älteste Elefantenkuh führt die Herde. Warum ist das jetzt gut?“
  - Grund: So fällt der dass-Satz mit 14 Wörtern weg.

**animal-polar-bear:rate-1**
- answers[3]: „Sie fressen sich Fett an und fasten“ → „Sie fressen nichts und leben vom Fett“
  - Grund: Kleine Kinder kennen „fasten“ oft nicht.

**animal-polar-bear:rate-3**
- answers[2]: „Seine dicke Fettschicht unter der Haut“ → „Seine dicke Fettschicht“
  - Grund: Mit 38 Zeichen ist die richtige Antwort sonst klar die längste (die anderen haben 19 bis 28).
- why: „Sie ist bis zu zehn Zentimeter dick.“ → „Sie ist bis zu zehn Zentimeter dick, so breit wie eine Kinderhand.“
  - Grund: Die Zahl bekommt einen Vergleich.

**animal-common-octopus:rate-3**
- prompt: „Ein Krake passt durch einen Spalt, der viel schmaler ist als sein Körper. Wie schafft er das?“ → „Ein Krake quetscht sich durch einen Spalt. Der Spalt ist viel schmaler als sein Körper. Wie geht das?“
  - Grund: Der Relativsatz fällt weg.

**history-stone_tools:rate-4**
- prompt: „Aus der Zeit der ältesten Steinwerkzeuge hat man keine Werkzeuge aus Holz gefunden. Woran kann das liegen?“ → „Man hat sehr alte Steinwerkzeuge gefunden. Holzwerkzeuge aus dieser Zeit fehlen. Woran kann das liegen?“
  - Grund: Der alte Einstieg ist schwer zu lesen, weil er mit einem langen Satzteil beginnt.

**history-apollo11:rate-4**
- hints[1]: „… schon verbraucht.“ → „… schon vorbei.“
  - Grund: „Verbraucht“ passt nicht zu Zeit.

**history-apollo11:mini** (vorgeschlagener neuer Tipp)
- „Im Raumschiff saß mehr als ein Mensch. Und alle waren Raumfahrer.“ → „Lies das Häppchen „Wie kamen sie zum Mond?“: Wie viele flogen mit?“
  - Grund: Der Vorschlag schließt beide falschen Antworten aus („Nur Armstrong“ und „Marie Curie und Gutenberg“). Damit verrät er die Lösung.

**person-marie_curie:rate-2**
- answers[0]: „Mit Henri Becquerel“ → „Mit dem Forscher Henri Becquerel“
- answers[1]: „Mit Albert Einstein“ → „Mit dem Forscher Albert Einstein“
- Grund für beide: Die richtige Antwort („Mit ihrem Mann Pierre Curie“) war sonst die längste, und sie lässt sich nicht ändern.

**person-marie_curie:rate-3**
- answers[1]: „Sie wollte an ihre unfreie Heimat Polen erinnern“ → „Sie wollte an ihre Heimat Polen erinnern“
  - Grund: Sie ist die längste Antwort (48 Zeichen), und „unfreie“ fällt auf. „Unfrei“ steht schon im `why`.
- hints[1]: „Polen wurde damals von Russland beherrscht.“ → „Ihre Heimatstadt Warschau gehörte damals zu Russland.“
  - Grund: genauer, denn Polen war geteilt. Bitte vom fakten-pruefer prüfen lassen.

**person-jane_goodall:rate-1**
- hints[0]: „Goodall sah sie …“ → „Jane sah sie …“
  - Grund: Die anderen Fragen sagen „Jane“; ein Name für alle Fragen.

**person-jane_goodall:rate-2**
- hints[0]: „… ein scheues Tier nicht erschrecken.“ → „… eine ängstliche Katze nicht erschrecken.“
  - Grund: „Scheu“ kennen Kleine selten; eine Katze kennen alle.
- prompt: „Was half ihr?“ → „Was half dagegen?“
  - Grund: „Ihr“ ist hier mehrdeutig.

**building-giza-pyramids:rate-2**
- answers[3]: „Mit Kamel-Karawanen“ → „Auf dem Rücken von Kamelen“
  - Grund: Kleine kennen „Karawane“ meist nicht.
- why: „aus Tura“ → „aus Tura, einem Steinbruch am anderen Ufer des Nils“
  - Grund: Der Ortsname wird sonst nicht erklärt. Bitte vom fakten-pruefer prüfen lassen.

**building-giza-pyramids:rate-3**
- prompt: „Vor ungefähr wie vielen Jahren verlor die Cheops-Pyramide ihren Rekord als höchstes Bauwerk der Welt?“ → „Lange war die Cheops-Pyramide das höchste Bauwerk der Welt. Wann wurde sie überholt?“
  - Grund: Die alte Frage hat 16 Wörter und einen holprigen Anfang.

**building-eiffel-tower:rate-2**
- wrongReasons[0]: „Schön aussehen ist schön, aber …“ → „Hübsch sieht er damit auch aus. Aber das ist nicht der wichtigste Grund.“
  - Grund: Das doppelte „schön“ fällt weg.

**building-eiffel-tower:rate-3**
- Die vier Antworten haben 46 bis 59 Zeichen und brauchen am Handy je zwei Zeilen. Kürzer:
  - „Die Schattenseite dehnt sich mehr aus“
  - „Die Sonnenseite dehnt sich mehr aus“
  - „Alles dehnt sich gleich stark aus“
  - „Das Eisen dehnt sich aus und wird weich“

**science-water-cycle-2**
- Tipps tauschen: Tipp 1 wird „Wolken entstehen durch Kondensation. Was wird da woraus?“, Tipp 2 wird „Kondensation ist das Gegenteil von Verdunstung.“
  - Grund: Der jetzige erste Tipp führt mit Antwort [1] direkt zur Lösung.
- Die Vorschläge des stufen-pruefer für [1] und [2] unterstütze ich.

**science-water-cycle-3**
- prompt: „Eine Stadt bedeckt viel Boden mit Asphalt und Beton. Was wird für das Regenwasser dadurch schwerer?“ → „In der Stadt ist viel Boden mit Asphalt bedeckt. Was kann Regenwasser dort schlechter?“
  - Grund: Die alte Frage hat 17 Wörter.
- Vorschlag des stufen-pruefer für [2] → „Aus Seen und Flüssen verdunstet weiter Wasser, auch in der Stadt.“
  - Grund: „Seen verdunsten“ ist schief.

**science-water-cycle:rate-4**
- Kein Befund. Das Wort „Häppchen“ im Tipp ist der Begriff, den die Seite selbst benutzt.

**science-photosynthesis-2**
- wrongReasons[3]: „Stickstoff ist zwar in der Luft, entsteht aber nicht …“ → „Stickstoff ist in der Luft. Bei der Fotosynthese entsteht er aber nicht.“
  - Grund: zwei kurze Sätze statt einem mit „zwar … aber“.

**science-pollination-3**
- prompt: „Warum entstehen davon nicht sicher Samen?“ → „Warum gibt es trotzdem nicht immer Samen?“
  - Grund: „davon nicht sicher“ ist holprig.
- why: „Danach müssen noch weitere Schritte klappen, die Befruchtung.“ → „Danach muss noch die Befruchtung klappen.“
  - Grund: Der Einschub fällt weg.

**science-fungi-3**
- answers[0]: „Totes Laub würde sich immer höher stapeln“ → „Totes Laub würde sich hoch stapeln“
  - Grund: Mit 41 Zeichen war die richtige Antwort die längste (die anderen haben 29 bis 34).

**science-moon-phases-3**
- answers[0] (neu): „Die Mondbahn ist etwas schräg geneigt“ → „Die Bahn des Mondes ist etwas schräg“
  - Grund: „schräg geneigt“ sagt dasselbe zweimal.
- answers[2]: „Bei Vollmond steht die Erde nicht zwischen Sonne und Mond“ → „Die Erde steht nicht zwischen Sonne und Mond“
  - Grund: Mit 56 Zeichen ist sie die mit Abstand längste.

**science-tides-2**
- wrongReasons[1]: „Schau in einen Gezeitenkalender für zwei verschiedene Orte.“ → „Das Wasser braucht Zeit, bis es an jede Küste kommt.“
  - Grund: Der alte Satz ist ein Auftrag, keine Erklärung.

**science-tides-3**
- prompt: „Warum reicht ein Mondkalender nicht, um eine Wattwanderung sicher zu planen?“ → „Du willst durchs Watt wandern. Warum reicht ein Mondkalender nicht?“
  - Grund: Der um-zu-Satz fällt weg.

**science-tides-4**
- prompt: „Warum kann Springtide bei Neu- und Vollmond auftreten?“ → „Bei Neumond und Vollmond gibt es Springtiden, besonders hohe Fluten. Warum?“
  - Grund: „Neu- und“ ist schwer zu lesen; das Fachwort wird gleich erklärt.

**history-khipu:limits**
- hints[0]: „Achte darauf, welcher Satz mehr sagt, als die Zahlen zeigen.“ → „Stell dir vor, du kannst in einem Brief nur die Zahlen lesen. Verstehst du dann den ganzen Brief?“
  - Grund: Der alte Tipp wiederholt nur die Frage.

**history-mohenjo-daro:limits**
- prompt (19 Wörter, Nebensatz und Verneinung) → „Forschende haben nur einen Teil der Stadt ausgegraben. Warum wissen sie nicht alles über die ganze Stadt?“

**history-bronze:material**
- prompt: „Forschende messen: … Was wissen sie dadurch noch nicht?“ → „In einem alten Metallstück stecken Kupfer und Zinn. Was verrät das nicht?“
  - Grund: 12 statt 16 Wörter.
- Die Vorschläge des stufen-pruefer für die wrongReasons unterstütze ich.

**person-maria_sibylla_merian:evidence**
- prompt (21 Wörter mit Nebensatz) → „Wird aus dieser Raupe dieser Falter? Wie findest du es sicher heraus?“
- Prüfenswert: „Schmetterling“ statt „Falter“, weil Kinder das Wort besser kennen.

**person-maria_sibylla_merian:limits**
- hints[0]: „Wer half Merian in Suriname, auch wenn die Namen oft fehlen?“ → „Lies noch einmal, wie Merian in Suriname gearbeitet hat.“
  - Grund: Der alte Tipp sagt schon, dass ihr andere halfen. Das ist die Lösung.

**person-inge_lehmann:evidence**
- prompt: „ein schwaches Signal“ → „eine schwache Erdbebenwelle“
  - Grund: „Signal“ wird nicht erklärt. Die Sätze selbst sind kurz genug.

**„Fast richtig“, building-giza-pyramids:stimmt-2**
- Auflösung: „aus hellem Kalkstein aus Tura“ → „aus hellem, glattem Kalkstein“
  - Grund: Der Ortsname wird nicht erklärt.
- Achtung: Die Auflösung verrät die Lösung von `giza:rate-1` (Kalkstein, mit Granit als Falle). Darum nicht vor `rate-1` zeigen.

**„Ordne richtig“, history-stone_tools**
- Frage: „Was war zuerst? Ordne vom Ältesten zum Jüngsten.“ → „Was geschah zuerst, was zuletzt? Ordne der Reihe nach.“
  - Grund: „Vom Ältesten“ passt schlecht zu Ereignissen.

## Bestehend, nur mit Alias änderbar (Antworttexte)

- **science-photosynthesis-1** [2]: „Kohlendioxid und Mineralstoffe, ohne Wasser“ → „Kohlendioxid und Mineralstoffe“
  - Grund: holprig und die längste Antwort.
- **science-pollination-1** [0]: „Sie transportiert anhaftenden Pollen“ → „Sie trägt Pollen zur nächsten Blüte“
  - Grund: „anhaftend“ auf Entdecker-Stufe.
- **science-pollination-2** [2]: „Die Erdschwere allein zu jeder Blüte“ → „Die Erdschwere“
  - Grund: holprig.
- **science-seasons-1** [1]: „Auch immer Sommer“ → „Auch Sommer“
- **science-fungi-2** [1]: „Pollen als einziges Futter“ → „Pollen“
  - Grund: Sie fällt durch ihre Länge auf; die richtige Antwort („Zucker“) ist dadurch die kürzeste.
- **science-fungi-4** [0]: „Übertragungen müssen untersucht werden“ → „Was sie austauschen, wird noch erforscht“
- **science-coral-reef-1** [0]: „Energiereiche Stoffe aus Fotosynthese“ → „Nahrung, die sie mit Licht machen“
  - Grund: Als einzige Antwort in Fachsprache fällt sie auf.
- **science-water-cycle-3** [1]: „Das oberflächliche Abfließen von Regenwasser“ → „Das Abfließen über den Boden“
- **science-water-cycle-4** [2]: „Die Zahl der Modellstationen legt die Reisedauer fest“ → „Die vier Stationen bestimmen die Reisezeit“
- **history-khipu:compare** [2]: „Die Möglichkeit, beide gezeichneten Mengen zu vergleichen“ → „Ob drei weniger als fünf ist“
  - Grund: Sie hat als einzige eine andere Satzform.
- **history-bronze:material** [0]: „Wann und wo Menschen das Stück benutzt haben.“
  - Grund: Die richtige Antwort ist die einzige ohne „Dass …“ am Anfang und fällt dadurch auf.
  - Vorschlag: „Dass Menschen es hier vor langer Zeit benutzten.“ Den Inhalt muss der fakten-pruefer gegenlesen.
- **person-maria_sibylla_merian:limits** [2]: „… indigener und versklavter Menschen.“ (70 Zeichen, „indigen“ wird nicht erklärt) → „Auch andere Menschen in Suriname halfen ihr.“
  - Den Teil über einheimische und versklavte Menschen ins `why` übernehmen.
- **person-inge_lehmann:limits** [1] und [2] (68 und 70 Zeichen, „exakt“, „Schnittbild“) → „Jetzt weiß man alles über das Erdinnere.“ / „Die Zeichnung ist jetzt ein Foto vom Erdkern.“

## Bestehende Erklärungen und Rückmeldungen, ohne Alias änderbar

Das gilt, falls diese Texte nicht beim Kind gespeichert werden; bitte prüfen. Sie sind voller Fachsprache und passen nicht zu den neuen, einfachen Fragen.

**`why`:**
- **fungi-1:** „Recycling“ (englisches Wort) → „Pilze zerlegen totes Laub und Holz. So wird daraus wieder Erde.“
- **fungi-2:** → „Der Baum macht mit Sonnenlicht Zucker und gibt dem Pilz etwas ab. Der Pilz bringt ihm dafür Wasser und Mineralstoffe.“
- **photosynthesis-1:** → „Aus Wasser und Kohlendioxid baut die Pflanze Zucker. Die Kraft dafür kommt vom Licht.“
- **photosynthesis-3:** → „Das Zebra frisst Gras. Das Gras hat seine Energie vom Sonnenlicht. Der Löwe frisst das Zebra.“
- **photosynthesis-4:** → „Auch Pflanzen atmen. Bei der Zellatmung holen sie sich Energie aus ihrem Zucker.“
- **pollination-2:** → „Bei manchen Pflanzen trägt der Wind den Pollen zur nächsten Blüte.“
- **water-cycle-3:** → „Durch Asphalt kommt kein Wasser. Der Regen kann nicht versickern und fließt ab.“
- **coral-reef-2:** → „Ohne ihre Algen wird die Koralle blass, fast weiß. Das nennt man Korallenbleiche.“
- **coral-reef-3:** → „Eine gebleichte Koralle lebt noch. Wird das Wasser wieder kühler, kann sie sich erholen.“
- **coral-reef-4:** → „Die Algen in der Koralle brauchen Licht, wie Pflanzen. In trübes Wasser kommt zu wenig Licht.“
- **moon-phases-1:** → „Die Sonne beleuchtet immer eine Hälfte des Mondes. Je nachdem, wo er steht, sehen wir mehr oder weniger davon.“
- **moon-phases-2:** → „… etwa 29,5 Tage. Das ist ungefähr ein Monat.“
- **moon-phases-3:** → „Die Bahn des Mondes ist etwas schräg. Darum zieht er bei Vollmond meist knapp am Erdschatten vorbei.“
- **seasons-2:** → „Steht die Sonne hoch, trifft ihr Licht auf eine kleine Fläche und wärmt sie stark.“
- **seasons-4:** → „Ob es regnet, hängt von Wolken, Wind und Luft ab. Das zeigt das Modell nicht.“
- **tides-1:** → „Bei Ebbe sinkt das Wasser. Es zieht sich vom Strand zurück.“
- **tides-2:** → „Die Form der Küste und die Tiefe des Meeres sind überall anders. Darum hat jeder Ort eigene Zeiten.“
- **tides-4:** → „Stehen Sonne, Erde und Mond in einer Linie, wirken Sonne und Mond zusammen. Dann ist die Flut besonders hoch.“
- **khipu:compare:** → „Zählen und vergleichen kannst du selbst. Was die Zeichen bedeuten, muss dir jemand sagen.“
- **khipu:limits:** → „Zahlen lesen heißt nicht, alles zu verstehen. Fäden und Knoten können noch mehr bedeuten.“
- **mohenjo-daro:compare:** → „Der Abfluss zeigt: Hier konnte Wasser abfließen. Ob die Menschen reich waren oder das Wasser sauber, verrät er nicht.“
- **mohenjo-daro:limits:** → „Andere Stadtteile können anders ausgesehen haben. Weitere Grabungen können mehr verraten.“
- **bronze:limits:** → „Ein einzelner Fund zeigt nicht, was alle benutzten. Es gab vielleicht auch Werkzeuge aus Stein oder Holz.“
- **merian:limits:** → „Merian hat viel selbst beobachtet und gemalt. Aber einheimische und versklavte Menschen zeigten ihr Pflanzen und Tiere. Ihre Namen fehlen oft im Buch.“ (bitte vom fakten-pruefer prüfen lassen)
- **lehmann:evidence:** → „Erst prüft man, ob die Messung stimmt. Wenn ja, braucht man eine bessere Erklärung.“
- **lehmann:limits:** → „Ein Modell, das besser passt, erklärt viel, aber nicht alles.“

**wrongReasons:**
- **photosynthesis-1** [1] → „Sauerstoff entsteht erst bei der Fotosynthese. Die Pflanze braucht etwas anderes aus der Luft.“
- **photosynthesis-1** [2] → „Mineralstoffe sind wichtig. Aber „ohne Wasser“ stimmt nicht.“
- **photosynthesis-2** [1] → „Kohlendioxid nimmt die Pflanze auf. Gesucht ist, was sie abgibt.“
- **photosynthesis-3** [1] → „Ein Löwe kann aus Licht keine Nahrung machen.“
- **photosynthesis-3** [2] → „Sonne wärmt den Löwen. Satt macht sie ihn nicht.“
- **photosynthesis-4** [1] → „Licht stört die Zellatmung nicht. Sie läuft auch am Tag.“
- **photosynthesis-4** [2] → „Das eine baut Zucker auf, das andere nutzt ihn. Das sind zwei Vorgänge.“
- **water-cycle-4** [1] → „Wasser nimmt viele Wege, nicht immer denselben.“
- **water-cycle-4** [2] → „Die vier Stationen erklären den Kreislauf. Eine Uhr sind sie nicht.“
- **merian:limits** [0] → „Das Jahr sagt nur, wann das Buch erschien.“
- **merian:limits** [1] → „Schöne Bilder verraten nicht, woher das Wissen kam.“
- **lehmann:evidence** [1] → „Wer unbequeme Messungen löscht, lernt nichts Neues.“
- **lehmann:limits** [1] → „Wie heiß es innen genau ist, weiß man damit noch nicht.“
- **lehmann:limits** [2] → „Ein Modell ist eine Zeichnung, kein Foto.“

**Fragen (`prompt`):**
- **photosynthesis-1:** „Welche Stoffe braucht die Pflanze dafür?“ → „Welche zwei Stoffe braucht eine Pflanze für die Fotosynthese?“
  - Grund: „Dafür“ ist ohne die Karte unklar.
- **photosynthesis-3:** „… indirekt …“ → „Ein Löwe frisst keine Pflanzen. Warum braucht er trotzdem die Fotosynthese?“
- **fungi-1:** „Welche Rolle …“ → „Welche Aufgabe haben viele Pilze im Wald?“
- **coral-reef-2:** „Was kann bei starkem Wärmestress passieren?“ → „Das Meer wird sehr warm. Was kann mit Korallen passieren?“
- **seasons-1:** → „Bei uns ist Sommer. Welche Jahreszeit hat dann Australien?“
- **seasons-4:** „Achsenmodell“ → „Ein Modell zeigt Erde, Sonne und die schräge Achse. Was kann es nicht vorhersagen?“
  - Dazu einen neuen Tipp: „Was davon hängt nur von der Stellung der Erde ab?“
- **moon-phases-3:** „nicht jeden Vollmond“ → „nicht bei jedem Vollmond“

## Unsicher

- Ob „Narbe“, „Zellatmung“, „Algenpartner“ und „Zersetzer“ auf den jeweiligen Karten erklärt sind, habe ich nicht nachgesehen.
- Beim Muster „Welcher Satz behauptet zu viel / ist vorsichtig?“ stimme ich dem stufen-pruefer zu. Bei `bronze:limits` hat die richtige Antwort „Alle … nur“, bei `lehmann:limits` „aber vieles ist noch offen“. Wer das Muster kennt, rät richtig.

**Gesamteindruck:** geht so bis gut. Die neuen Experten-Fragen machen den Gedanken schwer und lassen die Sprache einfach; Ton, Fallen und Tipp-Stufen sind meist sehr gelungen. Schwach sind die übernommenen Challenge-Texte (Erklärungen, Rückmeldungen, einige Antworten voller Fachsprache) und einige zu lange Fragen auf Profi-Stufe; dort liegt die meiste Arbeit vor dem Einbau.
