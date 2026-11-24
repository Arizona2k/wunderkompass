# Entwurf „Stimmt das wirklich?“ (`classic:detective`): neuer Fragenvorrat nach Stufen (24.11.2026)

Helfer: `karten-autor`. Keine Projektdatei geändert, nicht selbst geprüft; danach prüfen `fakten-pruefer`, `kinder-redaktion`, `stufen-pruefer`. Grundlage: `app/classic-questions.json`, `app/classic-learning.ts`, `app/classic-reason-game.tsx`, [Stufen-Prüfung](2026-11-24-stimmt-das-wirklich-stufenpruefung.md), Regeln S1, S5, E3 bis E11, `app/kern/woerter.ts`, Karten in `app/world-catalog.json`, `app/journey-content.json`.

**Die Fragen selbst (26, gültiges JSON):** [2026-11-24-stimmt-das-wirklich-entwurf.json](2026-11-24-stimmt-das-wirklich-entwurf.json). 8 Entdecker, 11 Profi, 7 Experte; Themen Wasser, Wolke, Jahreszeiten, Meer, Luft, Korallen, Pflanzen, Pilze. 6 der 12 alten Fragen bleiben (alle überarbeitet), 6 ruhen, darunter alle drei Mantel-Fragen. Für den Erdmantel gibt es **keine passende Karte**.

## Was mit den 12 alten IDs passiert

| Alte ID | Was passiert | Warum |
|---|---|---|
| detective-easy-coral | bleibt, Entdecker | Antworten unverändert; Tipps, „warum nicht“ und Auflösung neu |
| detective-easy-evaporation | bleibt, Entdecker | Antworten unverändert; Tipps neu (Wäsche statt Pfütze, sonst doppelt mit wasser-1) |
| detective-easy-cloud | ruht | zu schwer für Entdecker; der Gedanke kommt in `detective-wolke-1` (Experte, „Ein Wort macht den Satz falsch“) mit neuer ID wieder |
| detective-easy-mantle | ruht | keine Karte zum Mantel |
| detective-medium-mantle | ruht | wie oben |
| detective-hard-mantle | ruht | wie oben |
| detective-medium-water | bleibt, überarbeitet, Profi | fragt dasselbe; Quatsch-Antworten durch echte Fehlvorstellungen ersetzt, vierte Antwort |
| detective-medium-coral | bleibt, überarbeitet, Profi | fragt dasselbe (einfacher); neue Fallen, vierte Antwort |
| detective-medium-seasons | ruht | „Die Sonne ist aus“ glaubt kein Kind; Ersatz `detective-jahreszeiten-2` (Profi) und `-3` (Experte), neue IDs |
| detective-hard-water | ruht | dieselbe Frage wie easy-evaporation |
| detective-hard-seasons | bleibt, überarbeitet, jetzt Profi | dieselbe Frage; Lösung steht auf der Karte |
| detective-hard-coral | bleibt, überarbeitet, jetzt Profi | dieselbe Frage; Lösung steht auf der Karte |

Ruhende Fragen bleiben in der JSON (sonst finden gespeicherte Runden und Links wie `game-knowledge-<id>` sie nicht), werden aber nicht mehr gezogen.

## Was der `fakten-pruefer` besonders prüfen soll (⚠)

Selbst nachgelesen: NASA Space Place (Jahreszeiten, Sonnennähe im Januar), NOAA Korallen, NOAA Korallenbleiche, NOAA Conveyor Belt, NOAA Strömungen, NOAA Gezeiten (Sonne etwa halb so stark), UCAR Atmosphäre, University of Illinois (Atem), ASU Ask A Biologist (Kohlenstoff aus der Luft), US Forest Service (Wind bestäubt Gräser; Sonnenblumen von Tieren bestäubt). Nur über Suchergebnisse: NOAA AOML (Trübung), Penn State und MSU (Apfel, Kirsche), MSU Extension (Baummasse), NASA Goddard (etwa 0,1 % Schwankung der Sonne).

- detective-koralle-1: Quelle „Trübung nimmt den Algen Licht“ nur über die Suche; „Korallen suchen ihr Futter nicht mit den Augen“ haltbar?
- detective-pflanzen-3: „vor allem aus Luft und Wasser“ (Trockenmasse aus CO₂), Weg über Zucker vereinfacht.
- detective-jahreszeiten-2: „Kalte Luft ist genauso durchsichtig wie warme“ ohne direkte Quelle; „fast gleich hell“ nach NASA Goddard; „im Januar am nächsten“ nach NASA Space Place.
- detective-meer-3: „auch tief unten strömt immer Wasser“, „sie hören nicht auf“: „immer“ steht bei NOAA nicht wörtlich.
- detective-meer-4: „sinkt bis ganz nach unten“ (NOAA: „sinks toward the ocean bottom“).
- detective-meer-1: Tipp 2 „jeden Tag fast eine Stunde später … der Mond geht auch später auf“ (Mondtag 24 h 50 min, Mondaufgang Mittelwert).
- detective-luft-1: Tipp 1 „Dort oben fällt das Atmen schwerer“ ohne direkte Quelle.
- detective-pilze-2: „Wasser und Nährstoffe“ (Karte sagt „Mineralstoffe“).
- detective-pflanzen-2: Apfel und Süßkirsche brauchen Insekten (nur Suche); moderne Sonnenblumen-Sorten bestäuben sich teils selbst – „brauchen Tiere als Boten“ prüfen.
- detective-jahreszeiten-1 und hard-seasons: „Weihnachten am Strand“, „gehen dann baden“ ohne Quelle.
- detective-wolke-1: In einer Wolke ist zwischen den Tröpfchen auch unsichtbarer Dampf; ist „Wasserdampf ist das falsche Wort“ eindeutig genug?
- detective-wasser-2: „Das Wasser in der Quelle war vorher Regen“ vereinfacht (Grundwasser aus versickertem Niederschlag).

## Umformuliert (Alt → Neu), nur Fragen mit alter ID

In allen vier Fällen jetzt 4 statt 3 Antworten; gespeicherte `orders` passen von der Länge nicht mehr (die Runde mischt dann neu).

- **detective-medium-water** (richtig unverändert „Wasserdampf aus der Luft wird flüssig“): „Das Glas erzeugt neues Wasser“ → „Das Glas schwitzt wie ein Mensch“; „Unsichtbares Wasser ist unmöglich“ → „Die Kälte verwandelt sich in Wasser“; neu „Das Getränk sickert langsam durch das Glas“.
- **detective-medium-coral** (richtig unverändert „Zwei verschiedene Lebewesen arbeiten zusammen“): „Gleiche Nahrung macht beide zur selben Art“ → „Die Koralle wird dadurch zur Pflanze“; „Ein Tier muss seine Nahrung immer allein herstellen“ → „Die Koralle muss dann nie mehr selbst fressen“; neu „Die Koralle frisst die Algen nach und nach auf“.
- **detective-hard-seasons**: (richtig) „Nein, die Südhalbkugel hat die entgegengesetzte Jahreszeit“ → „Nein, in Australien ist dann gerade Sommer“; „Ja, ein kalter Ort beweist globale Kälte“ → „Ja, im Dezember ist es auf der ganzen Erde kalt“; „Ja, beide Halbkugeln sind immer gleich zur Sonne geneigt“ → „Ja, die Erde ist dann weiter von der Sonne weg“; neu „Nein, in Australien ist dann Frühling“.
- **detective-hard-coral**: (richtig) „Nein, Bleiche zeigt Stress, aber nicht sicher den Tod“ → „Nein, sie kann sich noch erholen“; „Ja, eine Farbänderung beweist immer den Tod“ → „Ja, weiß heißt: Sie lebt nicht mehr“; „Nein, Bleiche hat niemals Folgen für Korallen“ → „Nein, weiß ist ihre gesunde Farbe“; neu „Ja, sie ist zu Stein geworden“.

Fragetexte von medium-coral, hard-seasons und hard-coral sind einfacher formuliert, fragen dasselbe. Stufenwechsel: medium/hard → profi; gespeicherte Runden mit `level: 'hard'` oder `'medium'` brauchen eine Zuordnung (in den Fixtures gibt es keine Klassik-Einträge).

## Zahlen (mit Python nachgezählt)

- 8 Entdecker, 11 Profi, 7 Experte (26).
- Ganzer Vorrat: richtige Antwort in 4 von 26 die einzige längste, in 4 von 26 die einzige kürzeste – alle bei den Entdecker-Fragen mit 2 Antworten („Stimmt“ ist kürzer als „Stimmt nicht“; Lösung 4-mal „Stimmt“, 4-mal „Stimmt nicht“). Profi und Experte: 0 von 18 längste, 0 von 18 kürzeste.
- Starke Wörter: In 7 von 18 Profi- und Experten-Fragen (39 %) trägt die richtige Antwort ein starkes Wort, das stimmt (luft-2, meer-2, meer-3 „immer“; wasser-2 „gar keinen“; jahreszeiten-3 „ganze“; wasser-3 „gar kein“; meer-4 „ganz“). In keiner Frage ist die richtige Antwort noch die einzige ohne starkes Wort (vorher 8 von 8).
- In jeder Profi-Frage mit Ja/Nein haben mindestens zwei Antworten denselben Anfang.
- Kein Tipp enthält die richtige Antwort wörtlich; jede Frage hat 2 eigene Tipps. Kein Satz über 12 Wörter.
- Art der Experten-Fragen (S5): „Ein Wort macht den Satz falsch“ wolke-1; zwei Tatsachen verbinden jahreszeiten-3, meer-4, koralle-1; übertragen wasser-3, pflanzen-3; kleinen Fehler finden wasser-4.

## Offen (für Claude und die Prüfer)

1. Mantel ohne Karte (Stoff nur in den Reisen `inside` und `volcanoes`): Mantel-Fragen ruhen, bis es eine Karte „Erdinneres“ oder „Vulkane“ gibt; oder `topic` darf auf eine Reise zeigen (Code, Entscheidung).
2. Fragen pro Runde (heute 4) und ob Experte Profi beimischt; E3 entfällt, wenn der `stufen-pruefer` mindestens 4 der 7 Experten-Fragen bestätigt.
3. Entdecker mit 2 Antworten: Fragen mit 2 Antworten vom Längentest ausnehmen.
4. Doppelung: `detective-medium-water` (kaltes Glas) ähnelt `science-water-cycle:rate-4` (kalte Flasche).
5. Drei Fragen zu „Dampf ist unsichtbar“ (wolke-1, wasser-3, wasser-4): zu viel?
6. wasser-4: Antworten sind vier Sätze einer Erklärung; mischen oder nicht?
7. wolke-1: „Himmel“ als schwache Falle – auf Experte noch in Ordnung?
8. Schwächere Fallen (pilze-2 „wärmt seine Wurzeln“, medium-water „Kälte verwandelt sich“, hard-coral „zu Stein geworden“): echte Kindervorstellungen, aber nicht belegt.
9. Wörter: „Nährstoffe“, „Symbiose“, „Gewitterwolke“, „Ozonschicht“, „Polypen“, „Kohlendioxid“; „Blütenstaub“ statt „Pollen“.
10. Code (Claude): Stufen statt Leicht/Mittel/Schwer, `habitats` vorerst alt, Stufen-Vorschlag und „Zurück zu Entdecker“, Texte des Startbildschirms.
