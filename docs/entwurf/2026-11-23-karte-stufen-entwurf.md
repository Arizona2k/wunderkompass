# Inhaltsentwurf „Karte mit Stufen“ (stufen-pruefer, 23.11.2026)

Ungeprüfter Entwurf (Teilprüfung durch einen Helfer). Maschinenlesbar: [2026-11-23-karte-stufen-entwurf.json](2026-11-23-karte-stufen-entwurf.json). Nächster Schritt: fakten-pruefer und kinder-redaktion prüfen ihn, dann noch einmal stufen-pruefer, dann einbauen (Plan Teilschritt 3, Aufgabe 5).


## Inhaltsentwurf „Karte mit Stufen“ (Stufen-Prüfer)

Das ist eine Teilprüfung durch einen Helfer. Kein Kind hat diese Fragen gesehen. Alles mit ⚠ im Feld `pruefen` muss der `fakten-pruefer` prüfen, die Sprache prüft die `kinder-redaktion`.

**Maschinenlesbar:** Der ganze Entwurf (83 Fragen, alle Felder) liegt in `docs/entwurf/2026-11-23-karte-stufen-entwurf.json`. Er wurde erzeugt aus `ov.mjs` (Einstufung und Texte), `wr.mjs` (wrongReasons) und `build.mjs` im selben Ordner. Unveränderte Texte sind exakt aus dem Katalog übernommen.

`build.mjs` prüft dabei automatisch:
- die Antwortzahl je Stufe,
- dass `wrongReasons[correct]` null ist,
- dass kein Tipp und kein wrongReason die richtige Antwort wörtlich enthält,
- dass jede Experten-Frage 2 Tipps hat,
- dass `correct` bei bestehenden Fragen gleich bleibt.

Ergebnis: 0 Fehler. Die Felder in Teil A sind dieselben wie in `draft.json`; zusätzlich steht dort jeweils `difficulty` (bei Challenge-Fragen unverändert).

**Regeln aus der Ergänzung des Koordinators, eingehalten:**
- Vierte Antworten hängen immer hinten an (Index 3).
- Reihenfolge und `correct` bestehender Antworten sind unverändert.
- Bei Fragen mit ganz neuem Inhalt auf alter ID steht `correct` am alten Index: 0, bei Goodall rate-2 ebenfalls 0.
- Bei den Challenge-Fragen sind die bestehenden wrongReasons übernommen. Ausnahme ist `science-photosynthesis-2`[2]: Der alte Satz nannte „Sauerstoff“ wörtlich, das hätte den Test gerissen.

---

## A) Bestehende Fragen je Karte (Pilot-Zusatzfragen und Challenge-Fragen)

**animal-african-savanna-elephant**
```json
{"id":"animal-african-savanna-elephant:rate-1","level":"profi","prompt":"Wie trinkt ein Elefant?","answers":["Er spritzt sich Wasser ins Maul","Er schluckt es direkt durch den Rüssel","Er schleckt Wasser wie ein Hund","Er taucht den Kopf ins Wasser und schluckt"],"correct":0,"why":"Er saugt Wasser ein Stück weit in den Rüssel. Dann spritzt er es sich ins Maul und schluckt.","hints":["Der Rüssel ist auch seine Nase."],"wrongReasons":[null,"Der Rüssel ist auch seine Nase. Wasser direkt hinunterschlucken kann er damit nicht.","Elefanten schlecken nicht mit der Zunge wie ein Hund.","Sein Kopf ist schwer und weit oben. Ins Wasser tauchen muss er ihn nicht."],"geaendert":"4. Antwort","pruefen":""},
{"id":"animal-african-savanna-elephant:rate-2","level":"profi","prompt":"Wie schwer ist ein Elefantenbaby bei der Geburt?","answers":["Etwa 3 Kilogramm","Etwa 100 Kilogramm","Etwa 1.000 Kilogramm","Etwa 30 Kilogramm"],"correct":1,"why":"Ein Savannenelefant wiegt bei der Geburt rund 100 Kilogramm. Nach etwa 20 Minuten kann er schon stehen.","hints":["Es wiegt schon mehr als ein erwachsener Mensch."],"wrongReasons":["3 Kilogramm wiegt ungefähr ein Menschenbaby. Ein Elefantenbaby ist viel schwerer.",null,"So viel wiegt ein kleines Auto. Das Baby muss ja noch in den Bauch der Mutter passen.","30 Kilogramm wiegt etwa ein Schulkind. Ein Elefantenbaby ist schwerer."],"geaendert":"4. Antwort (30 kg macht das Schätzen enger); Tipp neu, der alte („wie riesig seine Eltern sind“) lenkte zu 1.000 kg","pruefen":"Geburtsgewicht rund 100 kg (90–120 kg)"},
{"id":"animal-african-savanna-elephant:rate-3","level":"profi","prompt":"Wer führt eine Elefantenherde an?","answers":["Der größte und stärkste Bulle","Ein junges Männchen","Meist das älteste Weibchen","Meist die Mutter mit den meisten Jungen"],"correct":2,"why":"Meist führt das älteste Weibchen die Herde, die Leitkuh. Erwachsene Männchen leben allein oder in kleinen Gruppen.","hints":["Junge Bullen verlassen die Familie, wenn sie erwachsen werden."],"wrongReasons":["Erwachsene Bullen leben meist allein oder in kleinen Gruppen, nicht in der Familienherde.","Junge Männchen verlassen die Familie, wenn sie groß werden.",null,"Viele Junge zu haben, macht ein Tier nicht zur Anführerin. Wichtig ist etwas anderes."],"geaendert":"4. Antwort, auch mit „Meist“ (vorsichtiges Wort nicht nur bei richtig); Tipp neu (Befund 3). Den Vorschlag „Wasserstellen“ aus dem Bericht nicht genommen, er würde rate-4 verraten","pruefen":"⚠ Junge Bullen verlassen die Familienherde mit etwa 10–15 Jahren"}
```

**animal-polar-bear**
```json
{"id":"animal-polar-bear:rate-1","level":"profi","prompt":"Was machen die meisten Eisbären im Winter?","answers":["Sie halten einen langen Winterschlaf","Sie wandern zum Südpol","Sie jagen weiter Robben","Sie fressen sich Fett an und fasten"],"correct":2,"why":"Die meisten Eisbären jagen auch im Winter Robben. Nur Weibchen, die Junge erwarten, bleiben den ganzen Winter in einer Schneehöhle.","hints":["Im Winter ist das Meereis besonders groß."],"wrongReasons":["Nur Weibchen, die Junge erwarten, bleiben den Winter über in einer Schneehöhle.","Eisbären leben im Norden. Am Südpol gibt es keine Eisbären.",null,"Fasten müssen Eisbären eher, wenn das Eis im Sommer schmilzt."],"geaendert":"4. Antwort; Tipp neu (der alte zeigte direkt auf die Nahrung)","pruefen":"⚠ Meereis im Winter am größten; „fasten“ trifft auf trächtige Weibchen in der Schneehöhle zu, nicht auf die meisten Eisbären"},
{"id":"animal-polar-bear:rate-2","level":"profi","prompt":"Wie schwimmt ein Eisbär?","answers":["Er paddelt mit den Vorderpfoten","Er paddelt nur mit den Hinterbeinen","Er lässt sich auf Eisschollen treiben","Er paddelt wie ein Hund"],"correct":0,"why":"Eisbären schwimmen sehr gut. Sie paddeln mit den breiten Vorderpfoten und lenken mit den Hinterbeinen.","hints":["Seine Pfoten sind sehr groß und breit."],"wrongReasons":[null,"Die Hinterbeine lenken eher. Die Kraft kommt woanders her.","Er kann gut selbst schwimmen, auch weite Strecken.","Ein Hund paddelt mit allen vier Beinen. Der Eisbär nutzt ein Beinpaar viel mehr."],"geaendert":"4. Antwort (Hundepaddeln als ähnliche Falle)","pruefen":"⚠ Antrieb mit den Vorderpfoten, Hinterbeine lenken"}
```

**animal-common-octopus**
```json
{"id":"animal-common-octopus:rate-1","level":"profi","prompt":"Wie lange lebt ein Krake meistens?","answers":["Nur etwa 1 bis 2 Jahre","So lange wie ein Mensch","Mehr als 100 Jahre","Etwa 10 bis 20 Jahre"],"correct":0,"why":"Ein Krake lebt meist nur etwa 1 bis 2 Jahre. Das ist viel kürzer als ein Menschenleben.","hints":["Schon mit etwa einem Jahr kann er Junge bekommen."],"wrongReasons":[null,"So alt wird ein Krake bei weitem nicht.","100 Jahre schaffen manche Schildkröten, aber kein Krake.","So lange lebt ein Krake nicht. Er wird überraschend schnell erwachsen."],"geaendert":"4. Antwort (näher dran)","pruefen":""},
{"id":"animal-common-octopus:rate-2","level":"entdecker","prompt":"Wie bewegt sich ein Krake über den Meeresboden?","answers":["Er schwimmt immer wie ein Fisch","Er rollt sich wie ein Ball","Er läuft auf seinen Armen"],"correct":2,"why":"Am Meeresboden läuft er auf seinen Armen. Schwimmen kann er auch, etwa mit einem Wasserstrahl auf der Flucht.","hints":["Überlege, womit er sich am Boden abstützen kann."],"wrongReasons":["Schwimmen kann er auch, aber nicht immer. Am Boden macht er es anders.","Rollen wie ein Ball kann ein Krake nicht.",null],"geaendert":"","pruefen":""}
```

**history-stone_tools**
```json
{"id":"history-stone_tools:rate-1","level":"profi","prompt":"Lebten damals noch große Dinosaurier?","answers":["Nein, sie waren längst ausgestorben","Ja, sie lebten gleich nebenan","Ja, man jagte sie mit Steinwerkzeugen","Nein, sie entstanden erst später"],"correct":0,"why":"Die großen Dinosaurier starben vor etwa 66 Millionen Jahren aus. Die ersten Steinwerkzeuge sind viel jünger.","hints":["Die Dinosaurier starben vor etwa 66 Millionen Jahren aus. Vergleiche mit dem Steckbrief."],"wrongReasons":[null,"Schau auf die Zeit: Lebten beide wirklich zur selben Zeit?","Vergleiche die Zahlen: Wann lebten die Dinosaurier, wann gab es die Werkzeuge?","Prüfe die Reihenfolge noch einmal: Wer war zuerst da?"],"geaendert":"4. Antwort (zweites „Nein“), Tipp neu (Befund 3 und 4)","pruefen":""},
{"id":"history-stone_tools:rate-2","level":"entdecker","prompt":"Wie bekam ein Stein früher eine scharfe Kante?","answers":["Man schmolz ihn im Feuer","Man ließ ihn lange in der Sonne liegen","Man schlug Steine gegeneinander"],"correct":2,"why":"Schlägt man Steine gegeneinander, brechen Stücke ab. So entstehen scharfe Kanten.","hints":["Denk daran, was passiert, wenn ein Stein auf einen harten Stein fällt."],"wrongReasons":["Stein schmilzt erst bei riesiger Hitze. Ein Lagerfeuer schafft das nicht.","Sonne macht einen Stein warm, aber nicht scharf.",null],"geaendert":"","pruefen":""},
{"id":"history-stone_tools:rate-3","level":"entdecker","prompt":"Woran erkennen Forschende, wofür ein Werkzeug diente?","answers":["An Spuren am Stein","An alten Anleitungen auf Papier","An der Farbe des Steins"],"correct":0,"why":"Beim Benutzen entstehen Gebrauchsspuren am Stein. Daraus lernen Forschende oft, wofür das Werkzeug diente.","hints":["Ein benutztes Werkzeug sieht anders aus als ein neues."],"wrongReasons":[null,"Papier gab es damals noch lange nicht.","Die Farbe zeigt, welcher Stein es ist, aber nicht, wofür er diente."],"geaendert":"","pruefen":""}
```

**history-apollo11**
```json
{"id":"history-apollo11:rate-1","level":"profi","prompt":"Wer blieb bei Apollo 11 im Raumschiff?","answers":["Neil Armstrong","Niemand, alle stiegen aus","Michael Collins","Buzz Aldrin"],"correct":2,"why":"Michael Collins steuerte das Raumschiff und kreiste um den Mond. Armstrong und Aldrin landeten mit der Mondfähre.","hints":["Einer musste im Raumschiff auf die anderen warten."],"wrongReasons":["Neil Armstrong betrat als Erster den Mond. Er war also nicht im Raumschiff.","Einer musste oben bleiben und das Raumschiff steuern.",null,"Buzz Aldrin stieg mit Armstrong auf dem Mond aus."],"geaendert":"4. Antwort (Aldrin als ähnliche Falle); Tipp bleibt und lässt jetzt drei Namen übrig","pruefen":""},
{"id":"history-apollo11:rate-2","level":"profi","prompt":"Wie kamen die Astronauten zurück auf die Erde?","answers":["Auf einer Landebahn wie ein Flugzeug","Mit Fallschirmen ins Meer","Mit der Mondfähre auf eine Wiese","Mit Fallschirmen auf festes Land"],"correct":1,"why":"Ihre Kapsel schwebte an Fallschirmen in den Pazifik. Ein Hubschrauber holte die drei aus dem Wasser und flog sie zu einem Schiff.","hints":["Die Kapsel brauchte etwas, das sie langsamer macht."],"wrongReasons":["Die Kapsel hatte keine Flügel und keine Räder zum Landen.",null,"Die Mondfähre blieb beim Mond zurück. Sie kam nicht mit zur Erde.","So landen andere Raumkapseln, zum Beispiel aus Russland. Apollo 11 machte es anders."],"geaendert":"4. Antwort; der Tipp (Fallschirm) verrät damit nicht mehr die Lösung (Befund 3)","pruefen":""},
{"id":"history-apollo11:rate-3","level":"entdecker","prompt":"Wie lange dauerte die ganze Reise ungefähr?","answers":["Ein paar Stunden","Etwa 8 Tage","Mehrere Jahre"],"correct":1,"why":"Vom Start bis zur Landung im Meer vergingen etwa 8 Tage. Bis zur Landung auf dem Mond dauerte es schon 4 Tage.","hints":["Allein der Hinflug dauerte mehrere Tage."],"wrongReasons":["Allein der Hinflug zum Mond dauerte schon Tage.",null,"Jahre dauerte es nicht. Der Mond ist viel näher als andere Planeten."],"geaendert":"bleibt Entdecker mit 3 Antworten; Befund 6 bewusst nicht umgesetzt, weil die neue Experten-Frage rate-4 „8 Tage“ nennt","pruefen":""}
```

**person-marie_curie**
```json
{"id":"person-marie_curie:rate-1","level":"entdecker","prompt":"Kann man radioaktive Strahlung mit den Augen sehen?","answers":["Nein, man braucht Messgeräte","Ja, sie sieht aus wie bunter Rauch","Ja, mit einer starken Lupe"],"correct":0,"why":"Unsere Augen können diese Strahlung nicht sehen. Marie Curie maß sie deshalb mit empfindlichen Geräten.","hints":["Auch Luft siehst du nicht, und trotzdem ist sie da."],"wrongReasons":[null,"Strahlung ist kein Rauch. Rauch kann man sehen.","Eine Lupe macht nur Dinge größer, die man schon sehen kann."],"geaendert":"","pruefen":""},
{"id":"person-marie_curie:rate-2","level":"profi","prompt":"Mit wem entdeckte Marie Curie Polonium und Radium?","answers":["Mit Henri Becquerel","Mit Albert Einstein","Mit ihrem Mann Pierre Curie","Mit ihrer Tochter Irène"],"correct":2,"why":"Marie und Pierre Curie entdeckten 1898 gemeinsam Polonium und Radium. Henri Becquerel hatte vorher die Strahlung von Uran entdeckt. Ihre Tochter Irène war damals noch ein Baby.","hints":["Es war jemand aus ihrer Familie."],"wrongReasons":["Becquerel entdeckte vorher die Strahlung von Uran. Polonium und Radium fand er nicht.","Albert Einstein war 1898 noch ein junger Student.",null,"Irène war 1898 noch ein Baby."],"geaendert":"zwei Antworten ersetzt (Befund 5: „allein“-Falle und Gutenberg), 4. Antwort, Tipp neu, Erklärung ergänzt","pruefen":"Irène Curie geboren 1897; Becquerel entdeckte 1896 die Uranstrahlung"}
```

**person-jane_goodall**
```json
{"id":"person-jane_goodall:rate-1","level":"profi","prompt":"Womit holten Schimpansen Termiten aus ihrem Bau?","answers":["Nur mit ihren bloßen Händen","Mit Grashalmen und Zweigen","Mit Werkzeugen von Menschen","Mit spitzen Steinen"],"correct":1,"why":"Sie steckten Grashalme und Zweige in den Termitenbau. Manche Zweige machten sie vorher passend, indem sie Blätter abzupften.","hints":["Goodall sah sie dabei etwas aus dem Wald benutzen."],"wrongReasons":["Mit bloßen Händen kommen sie nicht tief in den Termitenbau.",null,"Die Schimpansen lebten frei im Wald, ohne Werkzeuge von Menschen.","Steine nehmen manche Schimpansen zum Nüsseknacken. Für Termiten passen sie nicht."],"geaendert":"4. Antwort; der Tipp („etwas aus dem Wald“) lässt jetzt zwei übrig","pruefen":"⚠ Steine benutzen Schimpansen zum Nüsseknacken, nicht zum Termitenangeln"},
{"id":"person-jane_goodall:rate-2","level":"entdecker","prompt":"Anfangs liefen die Schimpansen vor Jane weg. Was half ihr?","answers":["Sie kam immer wieder und wartete","Sie lief ihnen schnell hinterher","Sie lockte sie mit lauten Rufen"],"correct":0,"why":"Jane kam Tag für Tag wieder und blieb ruhig. Nach vielen Monaten liefen die Schimpansen nicht mehr vor ihr weg.","hints":["Stell dir vor, du willst ein scheues Tier nicht erschrecken."],"wrongReasons":[null,"Hinterherlaufen macht scheue Tiere noch ängstlicher.","Laute Rufe erschrecken die Schimpansen eher."],"geaendert":"NEUER INHALT (Befund 7: wiederholte die Hauptfrage); ID bleibt, Thema „wie sie forschte“ bleibt; alte Antworten als Alias","pruefen":"⚠ Gewöhnung nach Monaten (Häppchen); später gab es auch Futterstellen mit Bananen – „wartete“ trotzdem zutreffend?"}
```

**building-giza-pyramids**
```json
{"id":"building-giza-pyramids:rate-1","level":"profi","prompt":"Woraus ist die große Pyramide vor allem gebaut?","answers":["Aus Kalkstein","Aus festgedrücktem Sand","Aus Lehmziegeln","Aus Granit"],"correct":0,"why":"Die Cheops-Pyramide besteht vor allem aus Kalkstein aus der Umgebung. Granit gibt es nur innen, zum Beispiel in der Königskammer.","hints":["Denk an die großen Steinblöcke."],"wrongReasons":[null,"Sand allein hält keine so hohen Wände zusammen.","Lehmziegel nahm man für Häuser. Für die große Pyramide brauchte man Härteres.","Granit steckt nur an wenigen Stellen innen, zum Beispiel in der Königskammer."],"geaendert":"4. Antwort (Granit als ähnliche Falle), Erklärung ergänzt; der Tipp lässt jetzt zwei übrig","pruefen":"⚠ Granit in der Königskammer (aus Assuan)"},
{"id":"building-giza-pyramids:rate-2","level":"profi","prompt":"Wie kamen die hellen Außensteine zur Pyramide?","answers":["Mit Schiffen auf dem Nil","Mit Schiffen aus einem fernen Land","Sie lagen schon an der Baustelle","Mit Kamel-Karawanen"],"correct":0,"why":"Die hellen Außensteine kamen mit Schiffen aus Tura. Die meisten anderen Steine stammten aus der Umgebung. Kamele gab es damals in Ägypten noch nicht als Lasttiere.","hints":["Die hellen Steine kamen aus Ägypten selbst, aber nicht aus Gizeh."],"wrongReasons":[null,"Die hellen Steine kamen aus Ägypten selbst.","Die hellen Steine gab es nicht direkt in Gizeh. Sie kamen von etwas weiter weg.","Kamele gab es damals in Ägypten noch nicht als Lasttiere."],"geaendert":"4. Antwort, Tipp neu (Befund 3), Erklärung ergänzt","pruefen":"⚠ Kamele als Lasttiere in Ägypten erst etwa im 1. Jahrtausend v. Chr.; Tura-Kalkstein per Schiff (Merer-Papyri)"}
```

**building-eiffel-tower**
```json
{"id":"building-eiffel-tower:rate-1","level":"entdecker","prompt":"Woraus ist der Eiffelturm vor allem gebaut?","answers":["Aus Beton","Aus Eisen","Aus Stein"],"correct":1,"why":"Der Turm besteht aus vielen Eisenteilen. Sie sind zu einem Gitter verbunden.","hints":["Schau dir die vielen dünnen Stangen an."],"wrongReasons":["Beton ist grau und fest wie Stein. Der Turm besteht aus vielen dünnen Stangen.",null,"Steine wären viel zu schwer für einen so hohen, dünnen Turm."],"geaendert":"","pruefen":""},
{"id":"building-eiffel-tower:rate-2","level":"profi","prompt":"Wozu bekommt der Turm immer wieder neue Farbe?","answers":["Nur damit er für Fotos hübsch aussieht","Damit sich das Eisen nicht ausdehnt","Damit das Eisen nicht rostet","Damit Blitze ihm nicht schaden"],"correct":2,"why":"Die Farbe schützt das Eisen vor Rost. Ohne Anstrich würde der Turm nicht lange halten.","hints":["Der Turm steht seit über 130 Jahren draußen, bei Regen und Wind."],"wrongReasons":["Schön aussehen ist schön, aber nicht der wichtigste Grund.","Farbe kann nicht verhindern, dass sich Eisen bei Wärme ausdehnt.",null,"Gegen Blitze hilft keine Farbe."],"geaendert":"„Damit er nachts leuchtet“ ersetzt durch eine Falle aus „Schon gewusst?“ (Befund 6; „Wind“ aus dem Bericht passt nicht zu Farbe), 4. Antwort, Tipp neu (der alte nannte Regen und Eisen)","pruefen":""}
```

**science-water-cycle** (Pilot und Challenge)
```json
{"id":"science-water-cycle:rate-1","level":"entdecker","prompt":"Wo ist das meiste Wasser der Erde?","answers":["In Flüssen und Seen","Im Meer","In den Wolken"],"correct":1,"why":"Von 100 Eimern Wasser auf der Erde wären 97 Meerwasser. Dieses Wasser ist salzig.","hints":["Schau auf einen Globus: Welche Farbe siehst du am meisten?"],"wrongReasons":["Flüsse und Seen sind klein im Vergleich zu etwas anderem.",null,"In den Wolken ist nur ein winziger Teil des Wassers."],"geaendert":"","pruefen":""},
{"id":"science-water-cycle:rate-2","level":"entdecker","prompt":"Geben Pflanzen Wasser an die Luft ab?","answers":["Ja, über ihre Blätter","Nein, sie trinken nur","Ja, über die Blüten als Regen"],"correct":0,"why":"Pflanzen nehmen Wasser mit den Wurzeln auf. Über ihre Blätter geben sie Wasserdampf an die Luft ab.","hints":["Pflanzen trinken mit den Wurzeln, aber wo bleibt das Wasser dann?"],"wrongReasons":[null,"Pflanzen trinken mit den Wurzeln, aber nicht alles Wasser bleibt in ihnen.","Aus Blüten fällt kein Regen."],"geaendert":"als Entdecker geführt (Quatsch-Antwort „Blüten als Regen“ hilft Kleinen); Profi liefern die Challenge-Fragen","pruefen":""},
{"id":"science-water-cycle:rate-3","level":"entdecker","prompt":"Warum wird ein nasses Handtuch trocken?","answers":["Das Handtuch trinkt das Wasser auf","Das Wasser verschwindet einfach ganz","Das Wasser verdunstet in die Luft"],"correct":2,"why":"Das Wasser im Handtuch wird zu unsichtbarem Wasserdampf. Der Dampf zieht in die Luft davon.","hints":["Mit einer Pfütze passiert dasselbe."],"wrongReasons":["Das Handtuch saugt Wasser auf, aber dann müsste es nass bleiben.","Wasser verschwindet nie ganz. Es ist nur woanders.",null],"geaendert":"bleibt; die doppelte Challenge-Frage -1 bekommt neuen Inhalt (Befund 7)","pruefen":""},
{"id":"science-water-cycle-1","level":"profi","prompt":"An welchem Tag trocknet eine Pfütze am schnellsten?","answers":["Warm, sonnig und windig","Warm, sonnig und windstill","Kalt, sonnig und windig","Kühl, bewölkt und windstill"],"correct":0,"why":"Wärme lässt Wasser schneller verdunsten. Wind bläst die feuchte Luft über der Pfütze weg. Darum trocknet sie an warmen, windigen Tagen am schnellsten.","hints":["Denk an nasse Wäsche auf der Leine. Wann wird sie schnell trocken?","Wärme hilft beim Verdunsten. Wind hilft auch: Er bläst die feuchte Luft weg."],"wrongReasons":[null,"Ohne Wind bleibt die feuchte Luft über der Pfütze liegen. Das bremst.","Kälte bremst das Verdunsten.","Kühl, bewölkt und ohne Wind: Da trocknet es langsam."],"geaendert":"NEUER INHALT (Befund 7: doppelt mit Pilot rate-3); Thema Verdunstung/Pfütze bleibt; alte Antworten als Alias; alte wrongReasons in challenge-hints.json ersetzen","pruefen":"Wind beschleunigt Verdunstung"},
{"id":"science-water-cycle-2","level":"profi","prompt":"Was heißt Kondensation?","answers":["Gasförmiges Wasser wird flüssig","Flüssiges Wasser wird gasförmig","Eis wird flüssig","Flüssiges Wasser wird zu Eis"],"correct":0,"why":"Beim Kondensieren entstehen aus Wasserdampf Tröpfchen.","hints":["Kondensation ist das Gegenteil von Verdunstung.","Wolken entstehen durch Kondensation: Aus unsichtbarem Dampf werden Tröpfchen."],"wrongReasons":[null,"Der Übergang von flüssigem zu gasförmigem Wasser heißt Verdunstung. Kondensation verläuft in die andere Richtung.","Wenn Eis flüssig wird, schmilzt es. Bei Kondensation wird dagegen aus gasförmigem Wasser flüssiges Wasser.","Wenn Wasser zu Eis wird, gefriert es. Das ist etwas anderes."],"geaendert":"4. Antwort; Tipp 2 ohne das kalte Glas (das würde die neue Experten-Frage rate-4 verraten)","pruefen":""},
{"id":"science-water-cycle-3","level":"profi","prompt":"Eine Stadt bedeckt viel Boden mit Asphalt und Beton. Was wird für das Regenwasser dadurch schwerer?","answers":["Das Versickern von Regenwasser","Das oberflächliche Abfließen von Regenwasser","Die Verdunstung aus offenen Gewässern","Das Bilden von Pfützen"],"correct":0,"why":"Undurchlässige Oberflächen erschweren den Weg in den Boden; mehr Wasser kann oberflächlich abfließen.","hints":["Vergleiche eine Wiese und einen Parkplatz nach einem Regenschauer.","Auf der Wiese verschwindet das Wasser nach unten. Auf dem Parkplatz nicht."],"wrongReasons":[null,"Wasser kann über undurchlässige Oberflächen abfließen. Erschwert wird hier zunächst der Eintritt in den Boden.","Offene Gewässer können weiterhin Wasser an die Luft abgeben. Die Frage betrifft zunächst den Weg des Regenwassers durch die versiegelte Fläche in den Boden.","Auf Asphalt bleiben Pfützen eher länger stehen."],"geaendert":"Frage einfacher (ohne „versiegelt“, „unmittelbar“), 4. Antwort (Pfützen = Gegenteil-Falle)","pruefen":""},
{"id":"science-water-cycle-4","level":"profi","prompt":"Ein Wassertropfen ist manchmal nur ein paar Tage unterwegs, manchmal tausende Jahre. Warum?","answers":["Wasser bleibt verschieden lange in Speichern","Jeder Tropfen durchläuft immer dieselben vier Stationen","Die Zahl der Modellstationen legt die Reisedauer fest","Manche Tropfen gehen unterwegs verloren"],"correct":0,"why":"Wasser bleibt verschieden lange an einem Ort: in einer Wolke nur Tage, im Gletschereis oder tief im Boden oft tausende Jahre.","hints":["Wo kann Wasser auf seiner Reise eine lange Pause machen?","In einer Wolke bleibt es nur kurz. Im Eis oder tief im Boden sehr lange."],"wrongReasons":[null,"Das Schema zeigt nur einen möglichen Weg. Wirkliche Wasserwege können sich verzweigen und andere Speicher einschließen.","Die vier Stationen sind Erklärschritte, keine Zeiteinheiten. Das Modell enthält weder Aufenthaltszeiten noch eine berechnete Reisedauer.","Wasser geht nicht verloren. Es ist nur an einem anderen Ort."],"geaendert":"Frage einfacher, 4. Antwort (knüpft an „nicht vernichtet“ an), Erklärung konkreter","pruefen":"⚠ Verweilzeit in der Luft etwa 9 Tage, in Grundwasser und Eis bis über 10.000 Jahre"}
```

**science-photosynthesis**
```json
{"id":"science-photosynthesis-1","level":"entdecker","prompt":"Welche Stoffe braucht die Pflanze dafür?","answers":["Wasser und Kohlendioxid","Wasser und Sauerstoff","Kohlendioxid und Mineralstoffe, ohne Wasser"],"correct":0,"why":"Wasser und Kohlendioxid liefern die Ausgangsstoffe; Licht liefert Energie.","hints":["Lies den ersten Satz der Karte noch einmal."],"wrongReasons":[null,"Sauerstoff entsteht bei der Fotosynthese grüner Pflanzen. Kohlendioxid liefert Kohlenstoff für den Aufbau; beide Gase haben hier verschiedene Rollen.","Mineralstoffe sind für Pflanzen wichtig. Sie ersetzen jedoch das Wasser nicht, das zu den Ausgangsstoffen der Fotosynthese gehört."],"geaendert":"Entdecker: steht wörtlich im Einleitungssatz","pruefen":""},
{"id":"science-photosynthesis-2","level":"profi","prompt":"Was wird bei der Fotosynthese frei?","answers":["Sauerstoff","Kohlendioxid","Nur Wasserdampf","Stickstoff"],"correct":0,"why":"Bei der Fotosynthese von Pflanzen entsteht Sauerstoff.","hints":["Pflanzen nehmen Kohlendioxid auf. Gesucht ist, was sie abgeben.","Diesen Stoff brauchen wir zum Atmen."],"wrongReasons":[null,"Hier hast du ein Gas gewählt, das die Pflanze für den Zuckeraufbau nutzt. Die Frage sucht ein bei der Fotosynthese entstehendes Gas.","Wasserdampf geben Blätter auch ab. Bei der Fotosynthese entsteht aber noch ein anderes Gas.","Stickstoff ist zwar in der Luft, entsteht aber nicht bei der Fotosynthese."],"geaendert":"4. Antwort; wrongReasons[2] neu (der alte nannte „Sauerstoff“ wörtlich)","pruefen":""},
{"id":"science-photosynthesis-3","level":"profi","prompt":"Warum kann ein Löwe indirekt von Fotosynthese abhängen?","answers":["Seine Beute frisst Pflanzen mit gespeicherter Energie","Der Löwe nutzt Licht direkt zum Aufbau seiner Nahrung","Die Sonnenwärme ersetzt die Energie aus seiner Nahrung","Er schläft gern im warmen Sonnenlicht"],"correct":0,"why":"Energie gelangt über Pflanzenfresser zu Fleischfressern.","hints":["Was frisst ein Löwe? Und was frisst sein Futter?","Zebras fressen Gras. Woher hat das Gras seine Energie?"],"wrongReasons":[null,"Ein Löwe betreibt keine Fotosynthese. Er erhält chemisch gespeicherte Energie über seine Nahrung.","Sonnenwärme kann einen Körper erwärmen. Sie ersetzt beim Löwen jedoch nicht die chemische Energie aus Nahrung.","Wärme ist angenehm, aber sie ist keine Nahrung."],"geaendert":"4. Antwort; Profi statt Experte: die richtige ist die einzige Antwort mit „Pflanzen“","pruefen":""},
{"id":"science-photosynthesis-4","level":"profi","prompt":"Welche Aussage über Pflanzen ist richtig?","answers":["Sie betreiben auch Zellatmung","Ihre Zellatmung findet nur ohne Licht statt","Fotosynthese und Zellatmung sind derselbe Vorgang","Sie atmen überhaupt nicht"],"correct":0,"why":"Pflanzen nutzen Zellatmung, um Energie aus energiereichen Stoffen verfügbar zu machen.","hints":["Auch Pflanzenzellen brauchen Energie, am Tag und in der Nacht.","Fotosynthese baut Zucker auf. Zellatmung nutzt ihn. Das sind zwei Vorgänge."],"wrongReasons":[null,"Zellatmung braucht nicht erst Dunkelheit. Lebende Pflanzenzellen können gespeicherte Energie auch tagsüber verfügbar machen.","Beim Zuckeraufbau wird Lichtenergie genutzt; bei der Zellatmung wird gespeicherte chemische Energie verfügbar. Das sind verschiedene Reaktionsfolgen.","Pflanzenzellen brauchen auch Energie, Tag und Nacht. Wie kommen sie daran?"],"geaendert":"4. Antwort (verbreitete Fehlvorstellung)","pruefen":""}
```

**science-pollination**
```json
{"id":"science-pollination-1","level":"entdecker","prompt":"Wie kann eine Biene bei der Bestäubung helfen?","answers":["Sie transportiert anhaftenden Pollen","Sie pflanzt fertige Bäume","Sie verwandelt Nektar in Samen"],"correct":0,"why":"Beim Blütenbesuch kann Pollen am Körper hängen bleiben.","hints":["Stell dir vor, die Biene krabbelt in eine Blüte. Was bleibt an ihrem Pelz kleben?"],"wrongReasons":[null,"Bienen pflanzen keine Bäume.","Aus Nektar macht die Biene Honig, keine Samen."],"geaendert":"Entdecker: zwei Quatsch-Antworten","pruefen":""},
{"id":"science-pollination-2","level":"entdecker","prompt":"Wer kann ohne Insekten Pollen transportieren?","answers":["Der Wind","Ein Schatten","Die Erdschwere allein zu jeder Blüte"],"correct":0,"why":"Windbestäubte Pflanzen nutzen Luftbewegung.","hints":["Lies „Schon gewusst?“ noch einmal."],"wrongReasons":[null,"Ein Schatten kann nichts tragen.","Die Erdschwere zieht Pollen nur nach unten, nicht zu jeder Blüte."],"geaendert":"Entdecker: steht in „Schon gewusst?“","pruefen":""},
{"id":"science-pollination-3","level":"profi","prompt":"Eine Biene besucht eine Blüte. Warum entstehen davon nicht sicher Samen?","answers":["Pollen muss auf eine passende Narbe kommen","Die Biene hat den Nektar mitgenommen","Pollen sind fertige Samen","Nur Honigbienen können eine Blüte bestäuben"],"correct":0,"why":"Der Pollen muss auf die Narbe einer passenden Blüte gelangen. Danach müssen noch weitere Schritte klappen, die Befruchtung. Erst dann entstehen Samen. Auch viele andere Insekten bestäuben.","hints":["Was muss mit dem Pollen passieren, damit es eine Bestäubung ist?","Nicht jeder Pollen passt zu jeder Blüte."],"wrongReasons":[null,"Den Nektar braucht die Pflanze nicht für Samen. Er ist Futter für die Biene.","Ein Pollenkorn ist kein Samen. Daraus wächst nicht direkt eine Pflanze.","Auch Hummeln, Fliegen und Schmetterlinge bestäuben."],"geaendert":"Frage einfacher; richtige Antwort kürzer und ohne Fachwörter; „Jeder Besuch erzeugt sofort eine Frucht“ ersetzt (passte nicht zur Frage); 4. Antwort aus dem Steckbrief","pruefen":""},
{"id":"science-pollination-4","level":"profi","prompt":"Pollen einer Tulpe landet auf der Narbe einer Rose. Was passiert?","answers":["Davon entstehen keine Samen","Es entstehen sicher Samen","Die Rose bildet Tulpensamen","Es wächst eine Mischung aus Tulpe und Rose"],"correct":0,"why":"Tulpe und Rose sind ganz verschiedene Pflanzen. Der Tulpenpollen passt nicht zur Rose. Aus ihm entstehen keine Samen und auch keine Mischpflanze.","hints":["Pollen muss zur Blüte passen, ungefähr wie ein Schlüssel zum Schloss."],"wrongReasons":[null,"Sicher ist das nicht. Tulpe und Rose sind sehr verschieden.","Eine Rose kann keine Tulpensamen bilden.","Aus zwei so verschiedenen Pflanzen wächst keine Mischung."],"geaendert":"Frage als Beispiel statt „unpassender Pollen“ (die Frage verriet die Lösung); richtige Antwort ohne vorsichtige Fachsprache; „Alle Arten können beliebig gekreuzt werden“ ersetzt; 4. Antwort","pruefen":"⚠ Tulpe (Liliengewächs) und Rose: keine Befruchtung möglich"}
```

**science-fungi**
```json
{"id":"science-fungi-1","level":"entdecker","prompt":"Welche Rolle haben viele Pilze im Wald?","answers":["Sie zersetzen abgestorbenes Material","Sie erzeugen Sonnenlicht","Sie bestehen nur aus Blüten"],"correct":0,"why":"Zersetzer helfen beim Recycling von Stoffen.","hints":["Lies den Steckbrief: Welche Aufgabe haben viele Pilze?"],"wrongReasons":[null,"Sonnenlicht kommt von der Sonne, nicht von Pilzen.","Pilze haben keine Blüten."],"geaendert":"Entdecker: steht im Steckbrief","pruefen":""},
{"id":"science-fungi-2","level":"profi","prompt":"Manche Pilze leben mit Baumwurzeln zusammen. Was bekommt der Pilz vom Baum?","answers":["Zucker","Pollen als einziges Futter","Mineralstoffe","Wasser"],"correct":0,"why":"Die Pflanze liefert energiereiche Stoffe aus der Fotosynthese.","hints":["Der Pilz kann kein Sonnenlicht nutzen, der Baum schon."],"wrongReasons":[null,"Pollen ist kein Futter für Pilze.","Mineralstoffe bekommt eher der Baum vom Pilz.","Wasser bringt eher der Pilz zum Baum."],"geaendert":"Frage ohne „Mykorrhizapilz“; „Fertige Pilzhüte“ (Quatsch) ersetzt; 4. Antwort; Mineralstoffe und Wasser sind Richtungsfallen (die bekommt der Baum)","pruefen":"⚠ Pflanze gibt dem Pilz Zucker, Pilz der Pflanze Wasser und Mineralstoffe"},
{"id":"science-fungi-3","level":"experte","prompt":"Stell dir einen Wald ganz ohne Pilze und andere Zersetzer vor. Was würde passieren?","answers":["Totes Laub würde sich immer höher stapeln","Bäume bekämen mehr Nährstoffe","Totes Laub würde schneller zu Erde","Bäume würden schneller wachsen"],"correct":0,"why":"Zersetzer machen aus totem Laub und Holz wieder Stoffe, die Pflanzen brauchen. Ohne sie bliebe das Laub liegen, und dem Boden fehlten Nährstoffe.","hints":["Was machen Pilze mit totem Laub und Holz?","Ohne Zersetzer bleibt das Laub, wie es ist. Was passiert dann Jahr für Jahr?"],"wrongReasons":[null,"Ohne Zersetzer kommen die Nährstoffe aus dem Laub nicht zurück in den Boden.","Zu Erde wird Laub gerade durch Zersetzer.","Bäume brauchen Nährstoffe aus dem Boden. Ohne Zersetzer fehlen sie bald."],"geaendert":"NEUE FRAGE auf gleicher ID (Thema „Pilze im Nahrungsnetz“ bleibt): Gedankenexperiment statt Wiederholung von -1; alle alten Antworten als Alias","pruefen":""},
{"id":"science-fungi-4","level":"profi","prompt":"Pilzfäden verbinden manche Baumwurzeln. Welcher Satz ist vorsichtig und richtig?","answers":["Übertragungen müssen untersucht werden","Bäume sprechen nachweislich wie Menschen","Alle Pilze teilen immer alles","Pilze verbinden niemals Bäume"],"correct":0,"why":"Eine Verbindung allein belegt noch keinen bestimmten Austausch oder menschliche Kommunikation.","hints":["Vorsichtig heißt: nur sagen, was man auch belegen kann."],"wrongReasons":[null,"Dass Bäume sprechen wie Menschen, hat niemand nachgewiesen.","„Alle“ und „immer“ sagt zu viel. Pilze sind sehr verschieden.","Pilzfäden verbinden manche Bäume wirklich. „Niemals“ stimmt nicht."],"geaendert":"Frage einfacher; 4. Antwort (Übertreibung in die andere Richtung)","pruefen":""}
```

**science-coral-reef**
```json
{"id":"science-coral-reef-1","level":"profi","prompt":"Was liefern die Algenpartner vieler Riffkorallen?","answers":["Energiereiche Stoffe aus Fotosynthese","Schutz vor Fischen, die Korallen fressen","Kleine Krebse als Futter","Kühles Wasser bei Hitze"],"correct":0,"why":"Die Algen nutzen Licht und versorgen die Koralle mit energiereichen Stoffen.","hints":["Was können Algen, was Tiere nicht können?","Algen machen es wie Pflanzen: Sie nutzen Sonnenlicht."],"wrongReasons":[null,"Algen sind zu klein, um Fische zu verjagen.","Algen fangen keine Krebse.","Algen können das Wasser nicht kühlen."],"geaendert":"zwei Quatsch-Antworten ersetzt („Elektrischen Strom“, „Fertige Fische“), 4. Antwort","pruefen":""},
{"id":"science-coral-reef-2","level":"profi","prompt":"Was kann bei starkem Wärmestress passieren?","answers":["Korallen verlieren ihre Algenpartner","Korallen bekommen noch mehr Algenpartner","Korallen färben sich dunkler","Korallen wachsen schneller"],"correct":0,"why":"Der Verlust der Algenpartner kann zur Bleiche führen.","hints":["Denk an die Partner, die in der Koralle wohnen."],"wrongReasons":[null,"Hitze ist Stress. Bei Stress bekommt die Koralle keine neuen Partner dazu.","Bei Hitze wird eine Koralle eher heller, nicht dunkler.","Hitze ist Stress für die Koralle. Dann wächst sie nicht schneller."],"geaendert":"zwei Quatsch-Antworten ersetzt („werden automatisch Pflanzen“, „Meer wird zu Eis“), 4. Antwort","pruefen":""},
{"id":"science-coral-reef-3","level":"entdecker","prompt":"Warum bedeutet Bleiche nicht sofort Tod?","answers":["Die Koralle kann noch leben und sich erholen","Das Skelett ist die ganze lebende Koralle","Weiße Korallen brauchen keine Nahrung"],"correct":0,"why":"Bleiche ist ein Stresszustand; anhaltender Stress kann tödlich sein.","hints":["Lies „Schon gewusst?“ noch einmal."],"wrongReasons":[null,"Das Skelett ist hart und tot. Lebendig ist das Gewebe darauf.","Auch weiße Korallen brauchen Nahrung."],"geaendert":"Entdecker: steht fast wörtlich in „Schon gewusst?“","pruefen":""},
{"id":"science-coral-reef-4","level":"experte","prompt":"Warum brauchen viele Riffkorallen klares Wasser?","answers":["Licht kann ihre Algenpartner erreichen","Korallen können ihre Beute besser sehen","In klarem Wasser ist es kühler","In klarem Wasser gibt es keine Feinde"],"correct":0,"why":"Fotosynthetische Algenpartner sind auf Licht angewiesen; das gilt nicht für alle Korallenarten.","hints":["Halte die Hand in trübes Wasser. Was kommt dort schlecht hindurch?","Die Algen in der Koralle machen es wie Pflanzen."],"wrongReasons":[null,"Korallen haben keine Augen. Sie fangen Futter mit ihren Fangarmen.","Klares Wasser ist nicht kühler als trübes.","Feinde gibt es auch in klarem Wasser."],"geaendert":"Frage einfacher; zwei Quatsch-Antworten ersetzt; echte Experten-Frage: Licht + Algenpartner verbinden","pruefen":"Korallen fangen Plankton mit Tentakeln, nicht mit Augen"}
```

**science-moon-phases** (Pilot und Challenge)
```json
{"id":"science-moon-phases:rate-1","level":"experte","prompt":"Hat der Mond eine Seite, die immer dunkel ist?","answers":["Ja, die Rückseite ist immer dunkel","Ja, die Vorderseite ist immer dunkel","Nein, jede Seite bekommt Sonnenlicht","Nein, der Mond ist überall immer hell"],"correct":2,"why":"Nein, eine immer dunkle Seite gibt es nicht. Die Rückseite bekommt genauso viel Sonnenlicht wie die Seite, die wir sehen.","hints":["Wir sehen immer dieselbe Seite des Mondes. Trotzdem gibt es Neumond.","Bei Neumond ist die Seite zu uns dunkel. Wohin scheint die Sonne dann?"],"wrongReasons":["Denk an Neumond: Dann ist die Seite zu uns dunkel. Wo ist es dann hell?","Die Seite zu uns ist bei Vollmond ganz hell.",null,"Die Sonne beleuchtet immer nur eine Hälfte. Der Mond ist nicht überall zugleich hell."],"geaendert":"4. Antwort (zweites „Nein“, Befund 4), Tipps in zwei Schritten (Befund 3); die alten drei Antworten bleiben wörtlich","pruefen":""},
{"id":"science-moon-phases:rate-2","level":"entdecker","prompt":"Kann man den Mond auch am Tag sehen?","answers":["Ja, oft auch am Tag","Nein, nur in der Nacht","Nur wenn Vollmond ist"],"correct":0,"why":"Ja, der Mond steht oft auch am Tag am Himmel. Neben der hellen Sonne fällt er nur weniger auf.","hints":["Schau mal am Nachmittag in den Himmel."],"wrongReasons":[null,"Der Mond hält sich nicht an unsere Schlafenszeit.","Gerade bei Vollmond sieht man den Mond fast nur nachts."],"geaendert":"","pruefen":""},
{"id":"science-moon-phases:rate-3","level":"profi","prompt":"Sehen alle Menschen auf der Erde dieselbe Mondphase?","answers":["Nein, jedes Land sieht eine andere","Ja, nur manchmal auf dem Kopf","Nein, im Süden ist immer Vollmond","Ja, überall genau gleich"],"correct":1,"why":"Ja, alle sehen dieselbe Phase. In Australien, auf der Südhalbkugel, steht sie nur auf dem Kopf.","hints":["Es gibt nur einen Mond für die ganze Erde."],"wrongReasons":["Es gibt nur einen Mond für die ganze Erde.",null,"Vollmond ist nicht immer, auch im Süden nicht.","Im Süden sieht der Mond anders herum aus als bei uns."],"geaendert":"4. Antwort (zweites „Ja“, Befund 4); der Tipp lässt jetzt zwei übrig","pruefen":"⚠ nahe dem Äquator liegt die Sichel eher waagerecht, also nicht „überall genau gleich“"},
{"id":"science-moon-phases-1","level":"profi","prompt":"Was verändert sich bei den Mondphasen?","answers":["Unser Blick auf die beleuchtete Hälfte","Die Kugelform des Mondes","Der Schatten der Erde auf dem Mond","Wie hell die Sonne gerade leuchtet"],"correct":0,"why":"Der Mond bleibt ungefähr kugelförmig; wir sehen verschieden viel beleuchtete Fläche.","hints":["Halte einen Ball neben eine Lampe und geh einmal um ihn herum.","Der Ball bleibt gleich. Was ändert sich, wenn du herumgehst?"],"wrongReasons":[null,"Der Mond bleibt immer eine Kugel.","Der Erdschatten macht eine Mondfinsternis, aber keine Mondphasen.","Die Sonne leuchtet immer etwa gleich hell."],"geaendert":"„Die Größe der Sonne“ (Quatsch) ersetzt durch die Erdschatten-Fehlvorstellung, 4. Antwort","pruefen":""},
{"id":"science-moon-phases-2","level":"entdecker","prompt":"Wie lange dauert es ungefähr von Neumond zu Neumond?","answers":["29,5 Tage","24 Stunden","Ein Jahr"],"correct":0,"why":"Ein vollständiger Phasenzyklus dauert etwa 29,5 Tage.","hints":["Schau in den Steckbrief unter „Rhythmus“."],"wrongReasons":[null,"24 Stunden dauert ein Tag auf der Erde.","Ein Jahr braucht die Erde für eine Runde um die Sonne."],"geaendert":"Entdecker: steht wörtlich im Steckbrief","pruefen":""},
{"id":"science-moon-phases-3","level":"profi","prompt":"Warum gibt es nicht jeden Vollmond eine Mondfinsternis?","answers":["Die Mondbahn ist etwas schräg geneigt","Der Erdschatten ist zu klein für den Mond","Bei Vollmond steht die Erde nicht zwischen Sonne und Mond","Der Mond ist bei Vollmond zu weit weg"],"correct":0,"why":"Meist verfehlt der Mond den Erdschatten.","hints":["Für eine Finsternis müssen Sonne, Erde und Mond genau auf einer Linie stehen.","Stell dir die Mondbahn von der Seite vor. Liegt sie ganz flach?"],"wrongReasons":[null,"Der Erdschatten ist größer als der Mond. Er könnte ihn ganz verdecken.","Bei Vollmond steht die Erde ungefähr zwischen Sonne und Mond.","Der Abstand zum Mond ist bei Vollmond nicht besonders groß."],"geaendert":"Befund 2: zwei Quatsch-Antworten ersetzt, richtige ohne „Erdbahnebene“, 4. Antwort","pruefen":"⚠ Erdkernschatten in Mondentfernung etwa 2,7 Monddurchmesser breit"},
{"id":"science-moon-phases-4","level":"experte","prompt":"Heute ist Vollmond. Wann geht der Mond ungefähr auf?","answers":["Wenn die Sonne untergeht","Wenn die Sonne aufgeht","Mittags, wenn die Sonne hoch steht","Um Mitternacht"],"correct":0,"why":"Bei Vollmond sehen wir die ganze helle Seite. Dafür muss die Sonne hinter uns stehen und der Mond gegenüber. Geht die Sonne im Westen unter, geht der Vollmond im Osten auf.","hints":["Bei Vollmond sehen wir die ganze helle Seite. Wo steht dann die Sonne: hinter uns oder hinter dem Mond?","Sonne und Vollmond stehen sich gegenüber, wie zwei Kinder an den Enden einer Wippe."],"wrongReasons":[null,"Sonne und Vollmond stehen sich gegenüber. Kommen sie dann zur selben Zeit hoch?","Mittags steht der Vollmond auf der anderen Seite der Erde.","Um Mitternacht steht der Vollmond schon hoch am Himmel."],"geaendert":"NEUE FRAGE auf gleicher ID (Befund 7: doppelt mit stimmt-1, die Behauptung bleibt); Thema „Stellung von Sonne, Erde, Mond“; alte Antworten als Alias","pruefen":"Vollmond geht etwa bei Sonnenuntergang auf"}
```

**science-seasons**
```json
{"id":"science-seasons-1","level":"entdecker","prompt":"Welche Jahreszeit hat Australien ungefähr im deutschen Sommer?","answers":["Winter","Auch immer Sommer","Keine Jahreszeit"],"correct":0,"why":"Die Südhalbkugel ist dann von der Sonne weggeneigt.","hints":["Australien liegt auf der Südhalbkugel. Schau in den Steckbrief."],"wrongReasons":[null,"Sommer ist nicht überall gleichzeitig.","Jahreszeiten gibt es auch in Australien."],"geaendert":"Entdecker mit Tipp; Quatsch-Antworten auf Entdecker erlaubt","pruefen":""},
{"id":"science-seasons-2","level":"profi","prompt":"Warum erwärmt hohe Sonne den Boden stärker?","answers":["Licht verteilt sich auf eine kleinere Fläche","Die Sonne ist dann näher an der Erde","Die Sonne leuchtet dann heller","Licht verteilt sich auf eine größere Fläche"],"correct":0,"why":"Bei höherem Sonnenstand trifft mehr Energie auf dieselbe Bodenfläche.","hints":["Halte eine Taschenlampe über ein Blatt: einmal gerade von oben, einmal schräg.","Schräg wird der Lichtfleck größer und schwächer."],"wrongReasons":[null,"Hohe Sonne ist kaum näher. Der Unterschied ist winzig.","Die Sonne leuchtet immer etwa gleich hell.","Denk an die Taschenlampe: Wann wird der Lichtfleck groß, wann klein?"],"geaendert":"zwei Quatsch-Antworten ersetzt („mehr Sterne“, „magnetisch“), 4. Antwort als Zwillingsfalle","pruefen":""},
{"id":"science-seasons-3","level":"experte","prompt":"Anfang Januar ist die Erde der Sonne am nächsten. Trotzdem ist bei uns dann Winter. Was zeigt das?","answers":["Der Abstand ist nicht der Hauptgrund","Nähe zur Sonne macht die Erde kälter","Im Januar leuchtet die Sonne schwächer","Auf der Südhalbkugel ist dann auch Winter"],"correct":0,"why":"Wäre der Abstand der Grund, müsste bei größter Nähe überall Sommer sein. Bei uns ist aber Winter, in Australien Sommer. Der Hauptgrund ist die schräge Erdachse.","hints":["Was müsste im Januar los sein, wenn Nähe zur Sonne Sommer macht?","Nähe müsste Sommer bringen. Bei uns ist aber Winter. Passt das zusammen?"],"wrongReasons":[null,"Näher am Feuer wird es wärmer, nicht kälter. Das gilt auch für die Sonne.","Die Sonne leuchtet das ganze Jahr etwa gleich hell.","Auf der Südhalbkugel ist im Januar Sommer."],"geaendert":"NEUE FRAGE auf gleicher ID (Thema „Abstand widerlegen“ bleibt); die alte Lösung stand fast wörtlich in „Schon gewusst?“; alle alten Antworten als Alias","pruefen":"⚠ Perihel um den 3. Januar"},
{"id":"science-seasons-4","level":"profi","prompt":"Was kann das einfache Achsenmodell nicht vorhersagen?","answers":["Ob es morgen an deinem Ort regnet","Welche Halbkugel zur Sonne geneigt ist","Warum Tageslängen wechseln","Wann bei uns die Tage am längsten sind"],"correct":0,"why":"Für Tageswetter braucht man weitere Daten über die Atmosphäre.","hints":["Das Modell zeigt nur Erde, Sonne und die schräge Achse. Was fehlt darin?"],"wrongReasons":[null,"Welche Halbkugel zur Sonne geneigt ist, zeigt das Modell gut.","Warum die Tage länger und kürzer werden, zeigt das Modell auch.","Wann die Tage am längsten sind, kann man am Modell ablesen."],"geaendert":"4. Antwort","pruefen":""}
```

**science-tides**
```json
{"id":"science-tides-1","level":"entdecker","prompt":"Was heißt Ebbe?","answers":["Der Wasserstand fällt","Der Wasserstand steigt","Das Meer ist immer trocken"],"correct":0,"why":"Ebbe bezeichnet den fallenden Wasserstand.","hints":["Bei Ebbe kann man an der Nordsee durchs Watt laufen."],"wrongReasons":[null,"Steigendes Wasser heißt Flut.","Das Meer ist nie ganz trocken. Es kommt immer wieder."],"geaendert":"","pruefen":""},
{"id":"science-tides-2","level":"profi","prompt":"Ist Hochwasser überall gleichzeitig?","answers":["Nein, jede Küste hat eigene Zeiten","Ja, an allen Küsten gleichzeitig","Ja, immer um zwölf Uhr","Nein, Hochwasser gibt es nur bei Vollmond"],"correct":0,"why":"Form und Tiefe von Meeresbecken sowie Küsten beeinflussen den Verlauf.","hints":["Küsten sind verschieden: flach oder steil, Bucht oder offenes Meer."],"wrongReasons":[null,"Schau in einen Gezeitenkalender für zwei verschiedene Orte.","Die Zeiten verschieben sich jeden Tag. Zwölf Uhr passt nicht immer.","Hochwasser gibt es fast jeden Tag, nicht nur bei Vollmond."],"geaendert":"richtige Antwort einfacher und kürzer; 4. Antwort (zweites „Nein“)","pruefen":""},
{"id":"science-tides-3","level":"profi","prompt":"Warum reicht ein Mondkalender nicht, um eine Wattwanderung sicher zu planen?","answers":["Er zeigt keine Zeiten und kein Wetter für deinen Ort","Der Mond hat keinen Einfluss auf das Meer","Jeder Vollmond hält Wasser zurück","Bei Vollmond bleibt das Watt den ganzen Tag trocken"],"correct":0,"why":"Ein Mondkalender zeigt nur die Mondphasen. Fürs Watt brauchst du die Gezeiten für genau diesen Ort und den Wetterbericht. Und eine Begleitung, die sich auskennt.","hints":["Was steht in einem Mondkalender, und was nicht?","Fürs Watt brauchst du die genauen Zeiten für genau diese Küste."],"wrongReasons":[null,"Der Mond hat Einfluss auf das Meer. Das steht auf der Karte.","Vollmond hält kein Wasser fest.","Auch bei Vollmond kommt die Flut wieder."],"geaendert":"Frage und richtige Antwort einfacher; 4. Antwort; Sicherheitssatz bleibt in der Erklärung","pruefen":""},
{"id":"science-tides-4","level":"profi","prompt":"Warum kann Springtide bei Neu- und Vollmond auftreten?","answers":["Sonne, Erde und Mond stehen auf einer Linie","Nur Vollmond erzeugt Schwerkraft","Springtide gibt es nur im Frühling","Dann ist der Mond der Erde besonders nah"],"correct":0,"why":"Bei entsprechender Anordnung verstärken sich die Gezeiteneinflüsse.","hints":["Wo stehen Sonne, Erde und Mond bei Neumond und bei Vollmond?","Bei Neumond steht der Mond auf der Seite der Sonne, bei Vollmond gegenüber."],"wrongReasons":[null,"Schwerkraft hat der Mond immer, nicht nur bei Vollmond.","Springtide hat nichts mit dem Frühling zu tun. Es gibt sie das ganze Jahr.","Wie nah der Mond ist, hängt nicht an Neumond oder Vollmond."],"geaendert":"richtige Antwort anschaulicher (nicht „ziehen in dieselbe Richtung“, das stimmt bei Vollmond nicht); 4. Antwort","pruefen":"⚠ Erdnähe des Mondes hängt nicht an der Mondphase"}
```

**history-khipu**
```json
{"id":"history-khipu:compare","level":"profi","prompt":"Ein Bild zeigt drei Zeichen und fünf Zeichen. Niemand hat dir gesagt, was sie bedeuten. Was weißt du dann nicht?","answers":["Ob die Zeichen etwa Körbe oder Personen zählen","Dass fünf mehr als drei ist","Die Möglichkeit, beide gezeichneten Mengen zu vergleichen","Wie viele Zeichen es zusammen sind"],"correct":0,"why":"Eine Anzahl lässt sich vergleichen, ohne zu wissen, was gezählt wird. Die Bedeutung braucht eine vereinbarte Zuordnung.","hints":["Was kannst du am Bild selbst sehen, und was nicht?"],"wrongReasons":[null,"Dass fünf mehr ist als drei, siehst du durch Zählen.","Vergleichen kannst du die Mengen auch ohne Erklärung.","Zusammenzählen kannst du selbst."],"geaendert":"Frage ohne Verweis auf ein Lernbild, das auf der Karte fehlt; 4. Antwort","pruefen":""},
{"id":"history-khipu:limits","level":"profi","prompt":"Forschende lesen aus einem Khipu Zahlen ab. Was behauptet zu viel?","answers":["Dass damit alles im Khipu verstanden ist","Dass bestimmte Mengen aufgezeichnet sein können","Dass Knoten und Anordnung untersucht werden können","Dass Khipus Zahlen festhalten konnten"],"correct":0,"why":"Erkennbare Zahlen beweisen keine vollständige Entschlüsselung aller weiteren Merkmale oder Bedeutungen.","hints":["Achte darauf, welcher Satz mehr sagt, als die Zahlen zeigen."],"wrongReasons":[null,"Mengen kann man aus den Zahlen wirklich ablesen. Das ist nicht zu viel.","Knoten und Anordnung kann man wirklich untersuchen.","Dass Khipus Zahlen festhalten konnten, ist gut belegt."],"geaendert":"Frage einfacher; richtige Antwort kürzer (war die längste); 4. Antwort","pruefen":""}
```

**history-mohenjo-daro**
```json
{"id":"history-mohenjo-daro:compare","level":"profi","prompt":"In einem alten Haus finden Forschende einen Abfluss. Was zeigt das sicher?","answers":["Dass es hier einen Weg für Wasser gab","Dass alle Bewohner der Stadt dasselbe Einkommen hatten","Dass das Wasser immer keimfrei war","Dass jedes Haus der Stadt einen Abfluss hatte"],"correct":0,"why":"Der Fund belegt zunächst die bauliche Einrichtung. Einkommen oder Keimfreiheit benötigen andere Belege.","hints":["Trenne: Was liegt wirklich im Boden, und was denkt man sich nur dazu?"],"wrongReasons":[null,"Über Geld sagt ein Abfluss nichts.","Ob das Wasser sauber war, zeigt der Abfluss nicht.","Gefunden wurde der Abfluss in einem Haus, nicht in allen."],"geaendert":"Frage und richtige Antwort einfacher; 4. Antwort","pruefen":""},
{"id":"history-mohenjo-daro:limits","level":"profi","prompt":"Nur ein Teil der Stadt ist ausgegraben. Warum gilt nicht alles, was man dort findet, für die ganze Stadt?","answers":["Weil andere Stadtteile anders sein konnten","Weil Baureste grundsätzlich nichts über Menschen verraten","Weil nur schriftliche Quellen wissenschaftlich zählen","Weil Ausgrabungen alle Funde zerstören"],"correct":0,"why":"Materielle Quellen sind wertvoll, aber ihr räumlicher und zeitlicher Ausschnitt begrenzt die Schlüsse. Weitere Funde können sie ergänzen.","hints":["Stell dir vor, du kennst nur eine einzige Straße deiner Stadt."],"wrongReasons":[null,"Baureste verraten viel über Menschen, zum Beispiel wie sie wohnten.","Auch Funde im Boden zählen in der Wissenschaft.","Gute Ausgrabungen gehen vorsichtig mit den Funden um."],"geaendert":"Frage und richtige Antwort einfacher (beginnt jetzt wie die anderen mit „Weil“); 4. Antwort","pruefen":""}
```

**invention-bicycle**
```json
{"id":"invention-bicycle:rate-1","level":"experte","prompt":"Warum hatte das Hochrad so ein riesiges Vorderrad?","answers":["Damit man pro Tritt weiter kommt","Damit man höher sitzt und weit sieht","Weil kleine Räder schneller kaputtgingen","Weil es so sicherer war"],"correct":0,"why":"Je größer das Rad, desto weiter kam man mit einer Pedalumdrehung. So war man schneller unterwegs.","hints":["Lies das Häppchen zum Hochrad noch einmal.","Eine Pedalumdrehung dreht das Rad genau einmal. Wie weit rollt dabei ein großes Rad, wie weit ein kleines?"],"wrongReasons":[null,"Hoch saß man wirklich, aber das war nicht der Grund für das große Rad.","Kleine Räder gingen nicht schneller kaputt.","Das Hochrad war gefährlich. Wer stürzte, fiel tief."],"geaendert":"4. Antwort (Falle zum Namen „Sicherheitsfahrrad“), Tipps in zwei Schritten (Befund 3)","pruefen":""},
{"id":"invention-bicycle:rate-2","level":"entdecker","prompt":"Welcher Gang hilft dir an einem steilen Berg?","answers":["Ein schwerer Gang","Der Gang ist egal","Ein leichter Gang"],"correct":2,"why":"Im leichten Gang trittst du öfter, aber mit weniger Kraft. So kommst du den Berg besser hinauf.","hints":["Am Berg ist jeder Tritt besonders anstrengend."],"wrongReasons":["Im schweren Gang ist jeder Tritt am Berg sehr anstrengend.","Der Gang ist nicht egal. Probier es am Berg aus.",null],"geaendert":"","pruefen":""},
{"id":"invention-bicycle:rate-3","level":"entdecker","prompt":"Woher kommt die Energie beim Radfahren?","answers":["Aus den Zahnrädern","Aus deinen Beinen","Aus der Kette"],"correct":1,"why":"Die Energie kommt aus deinen Beinen. Kette und Zahnräder geben sie nur an das Hinterrad weiter.","hints":["Denk daran, was sich bewegt, wenn du in die Pedale trittst."],"wrongReasons":["Zahnräder geben die Kraft nur weiter. Sie machen keine.",null,"Die Kette gibt die Kraft nur weiter. Sie macht keine."],"geaendert":"","pruefen":""}
```

**history-bronze**
```json
{"id":"history-bronze:material","level":"profi","prompt":"Forschende messen: In einem alten Stück stecken Kupfer und Zinn. Was wissen sie dadurch noch nicht?","answers":["Wann und wo Menschen das Stück benutzt haben.","Dass das untersuchte Stück Kupfer enthält.","Dass das untersuchte Stück Zinn enthält.","Dass das Stück aus einem Metallgemisch besteht."],"correct":0,"why":"Die Analyse beschreibt Bestandteile. Eine zeitliche Einordnung braucht zusätzliche Informationen, etwa einen verlässlich untersuchten Fundzusammenhang.","hints":["Welche Antworten wiederholen nur, was die Messung schon zeigt?"],"wrongReasons":[null,"Kupfer ist in der Analyse bereits genannt. Die Frage sucht eine Information, die aus diesen Bestandteilen allein noch nicht folgt.","Zinn ist in der Analyse bereits genannt. Die Stoffangabe liefert allein noch keine Angaben zu Ort und Zeitpunkt der Nutzung.","Dass es ein Gemisch ist, zeigt die Messung schon: Kupfer und Zinn."],"geaendert":"Frage einfacher; 4. Antwort","pruefen":""},
{"id":"history-bronze:limits","level":"profi","prompt":"Bei einer Ausgrabung liegt ein Gegenstand aus Bronze. Welcher Satz behauptet zu viel?","answers":["Alle Menschen der Gegend nutzten nur Bronze.","An diesem Fund kann der Werkstoff untersucht werden.","Weitere Funde können mit diesem Stück verglichen werden.","Der Fund kann etwas über diesen Ort verraten."],"correct":0,"why":"Ein einzelner Gegenstand zeigt keine ausschließliche Nutzung in einer ganzen Region. Weitere Funde und ihre Zusammenhänge können auch die Nutzung anderer Werkstoffe belegen.","hints":["Wie viele Menschen und Dinge zeigt ein einzelner Fund wirklich?"],"wrongReasons":[null,"Das einzelne Stück kann tatsächlich untersucht werden. Diese begrenzte Aussage behauptet keine ausschließliche Nutzung in der ganzen Region.","Ein Vergleich mit weiteren Funden ist möglich. Er setzt keine pauschale Aussage über alle Menschen und Werkstoffe voraus.","Ein Fund kann wirklich etwas über seinen Ort verraten. Das ist nicht zu viel."],"geaendert":"Frage einfacher; richtige Antwort kürzer (war die längste); 4. Antwort","pruefen":""}
```

**person-maria_sibylla_merian**
```json
{"id":"person-maria_sibylla_merian:evidence","level":"profi","prompt":"Ein Bild zeigt eine Raupe, ein anderes einen Falter. Wie findest du heraus, ob aus dieser Raupe dieser Falter wird?","answers":["Die Farben von Raupe und Falter genau vergleichen","Die Raupe beobachten, bis der Falter schlüpft","Schauen, ob beide auf derselben Wiese leben","Nachsehen, ob beide gleich groß sind"],"correct":1,"why":"Nur wer dieselbe Raupe beobachtet, bis aus der Puppe ein Falter schlüpft, weiß es sicher. Ähnliche Farben oder derselbe Ort sind kein Beleg.","hints":["Denk daran, wie Merian gearbeitet hat."],"wrongReasons":["Ähnliche Farben beweisen nicht, dass das eine aus dem anderen wird.",null,"Viele Tiere leben auf derselben Wiese. Das ist kein Beweis.","Raupe und Falter sind ganz verschieden gebaut. Die Größe hilft nicht."],"geaendert":"Frage einfacher; alle Antworten neu (zwei alte waren Quatsch: „Hintergrundfarbe ausmalen“, „ähnliche Wörter“)","pruefen":""},
{"id":"person-maria_sibylla_merian:limits","level":"profi","prompt":"Jemand sagt: „Merians Name steht auf dem Buch. Also stammt alles darin nur von ihr.“ Welche Tatsache zeigt, dass das nicht stimmt?","answers":["Das Buch wurde im Jahr 1705 veröffentlicht.","Das Buch enthält besonders sorgfältig ausgeführte Bilder.","Merian nutzte auch Wissen und Arbeit indigener und versklavter Menschen.","Merian zeichnete sehr genau und geduldig."],"correct":2,"why":"Die dokumentierten Beiträge anderer widersprechen dem Alleinanspruch. Ihre oft fehlenden Namen machen ihr Wissen und ihre Arbeit nicht bedeutungslos.","hints":["Wer half Merian in Suriname, auch wenn die Namen oft fehlen?"],"wrongReasons":["Das Erscheinungsjahr belegt einen Zeitpunkt. Es sagt nicht, dass die Autorin ohne Beiträge anderer arbeitete.","Sorgfältige Bilder sagen noch nicht, von wem alle Beobachtungen und Informationen stammen.",null,"Genau und geduldig zu sein sagt nichts darüber, wer noch geholfen hat."],"geaendert":"Frage einfacher; richtige Antwort bleibt wörtlich (Inhalt wichtig, daher bleibt sie die längste); 4. Antwort","pruefen":""}
```

**person-inge_lehmann**
```json
{"id":"person-inge_lehmann:evidence","level":"profi","prompt":"Inge Lehmann misst ein schwaches Signal. Nach dem alten Bild der Erde dürfte es gar nicht da sein. Was ist jetzt klug?","answers":["Sofort ein ganz neues Bild der Erde zeichnen.","Das Signal löschen, weil es nicht zur bisherigen Zeichnung passt.","Die Messung prüfen und eine bessere Erklärung suchen.","Warten, bis jemand Berühmtes es erklärt."],"correct":2,"why":"Ein verlässliches unerwartetes Signal kann eine zusätzliche Erklärung nötig machen. Weitere Daten und Rechnungen prüfen, ob das veränderte Modell besser passt.","hints":["Was würdest du tun, wenn deine Waage plötzlich etwas Seltsames anzeigt?"],"wrongReasons":["So schnell geht das nicht. Wer weiß, ob das Signal echt ist?","Eine unbequeme Messung zu entfernen prüft ihre Verlässlichkeit nicht und verbessert das Modell nicht.",null,"Ob etwas stimmt, hängt nicht an einem berühmten Namen."],"geaendert":"Frage einfacher; „Zeichnung schöner färben“ (Quatsch) ersetzt; richtige Antwort kürzer; 4. Antwort aus „Für Große“ (berühmter Name)","pruefen":""},
{"id":"person-inge_lehmann:limits","level":"profi","prompt":"Ein neues Modell erklärt Lehmanns Messungen besser als das alte. Was darf man jetzt sagen?","answers":["Das Modell passt besser, aber vieles ist noch offen.","Nun sind jede Temperatur und jeder Stoff im Erdinneren exakt bekannt.","Damit ist das gezeichnete Schnittbild ein Foto des wirklichen Erdkerns.","Das alte Modell war also in allem falsch."],"correct":0,"why":"Eine Erklärung kann bestimmte Messungen gut erfassen. Genaue Temperaturen, Stoffe oder weitere Grenzen werden nicht allein durch diesen einen Vergleich bestimmt.","hints":["Passt ein Modell besser, weiß man dann schon alles?"],"wrongReasons":[null,"Die Erklärung der Wellen liefert nicht automatisch sämtliche Temperaturen und Zusammensetzungen exakt mit.","Ein passendes Modell bleibt eine Darstellung und Erklärung. Es verwandelt sich nicht in eine direkte Fotografie.","Das alte Modell war nicht in allem falsch. Vieles daran stimmt bis heute."],"geaendert":"Frage einfacher; richtige Antwort von 97 auf 51 Zeichen; 4. Antwort","pruefen":""}
```

### Umformuliert (alt → neu, Alias nötig)

In Klammern steht der Antwort-Index.

- `person-marie_curie:rate-2`:
  - [0] „Ganz allein, ohne jede Hilfe“ → „Mit Henri Becquerel“
  - [1] „Mit dem Erfinder Gutenberg“ → „Mit Albert Einstein“
- `person-jane_goodall:rate-2` (neuer Inhalt):
  - [0] „Sie beobachtete sie lange und geduldig“ → „Sie kam immer wieder und wartete“
  - [1] „Sie fing sie und brachte sie in einen Zoo“ → „Sie lief ihnen schnell hinterher“
  - [2] „Sie brachte ihnen Kunststücke bei“ → „Sie lockte sie mit lauten Rufen“
- `building-eiffel-tower:rate-2`:
  - [1] „Damit er nachts leuchtet“ → „Damit sich das Eisen nicht ausdehnt“
- `science-water-cycle-1` (neuer Inhalt):
  - [0] „Wasser verdunstet“ → „Warm, sonnig und windig“
  - [1] „Das Wasser kondensiert“ → „Warm, sonnig und windstill“
  - [2] „Die Sonne vernichtet das Wasser“ → „Kalt, sonnig und windig“
- `science-pollination-3`:
  - [0] „Passende Pollenübertragung und weitere Schritte müssen gelingen“ → „Pollen muss auf eine passende Narbe kommen“
  - [1] „Jeder Besuch erzeugt sofort eine Frucht“ → „Die Biene hat den Nektar mitgenommen“
- `science-pollination-4`:
  - [0] „Erfolgreiche Fortpflanzung ist damit nicht gesichert“ → „Davon entstehen keine Samen“
  - [2] „Alle Arten können beliebig gekreuzt werden“ → „Die Rose bildet Tulpensamen“
- `science-fungi-2`:
  - [2] „Fertige Pilzhüte“ → „Mineralstoffe“
- `science-fungi-3` (neuer Inhalt):
  - [0] „Sie machen Stoffe aus totem Material wieder zugänglich“ → „Totes Laub würde sich immer höher stapeln“
  - [1] „Sie vernichten alle Stoffe endgültig“ → „Bäume bekämen mehr Nährstoffe“
  - [2] „Sie ersetzen alle Pflanzen“ → „Totes Laub würde schneller zu Erde“
- `science-coral-reef-1`:
  - [1] „Elektrischen Strom“ → „Schutz vor Fischen, die Korallen fressen“
  - [2] „Fertige Fische“ → „Kleine Krebse als Futter“
- `science-coral-reef-2`:
  - [1] „Korallen werden automatisch Pflanzen“ → „Korallen bekommen noch mehr Algenpartner“
  - [2] „Das Meer wird überall zu Eis“ → „Korallen färben sich dunkler“
- `science-coral-reef-4`:
  - [1] „Korallen können nur in Luft atmen“ → „Korallen können ihre Beute besser sehen“
  - [2] „Klarheit entfernt jede Wärme“ → „In klarem Wasser ist es kühler“
- `science-moon-phases-1`:
  - [2] „Die Größe der Sonne“ → „Der Schatten der Erde auf dem Mond“
- `science-moon-phases-3`:
  - [0] „Die Mondbahn ist gegen die Erdbahnebene geneigt“ → „Die Mondbahn ist etwas schräg geneigt“
  - [1] „Der Mond schaltet sein Licht aus“ → „Der Erdschatten ist zu klein für den Mond“
  - [2] „Die Erde hat keinen Schatten“ → „Bei Vollmond steht die Erde nicht zwischen Sonne und Mond“
- `science-moon-phases-4` (neuer Inhalt):
  - [0] „Mondphasen entstehen durch den Blick auf Sonnenlicht“ → „Wenn die Sonne untergeht“
  - [1] „Der Mond ist dann wirklich halbiert“ → „Wenn die Sonne aufgeht“
  - [2] „Wolken schneiden ihn immer genau halb ab“ → „Mittags, wenn die Sonne hoch steht“
- `science-seasons-2`:
  - [1] „Die Sonne besteht dann aus mehr Sternen“ → „Die Sonne ist dann näher an der Erde“
  - [2] „Der Boden zieht Licht magnetisch an“ → „Die Sonne leuchtet dann heller“
- `science-seasons-3` (neuer Inhalt):
  - [0] „Gleichzeitig entgegengesetzte Jahreszeiten beider Halbkugeln“ → „Der Abstand ist nicht der Hauptgrund“
  - [1] „Beide Halbkugeln sind weit auseinander im Weltall“ → „Nähe zur Sonne macht die Erde kälter“
  - [2] „Die Erde hört im Winter auf zu rotieren“ → „Im Januar leuchtet die Sonne schwächer“
- `science-tides-2`:
  - [0] „Nein, örtliche Bedingungen unterscheiden sich“ → „Nein, jede Küste hat eigene Zeiten“
- `science-tides-3`:
  - [0] „Örtliche Zeiten und Wetter müssen berücksichtigt werden“ → „Er zeigt keine Zeiten und kein Wetter für deinen Ort“
- `science-tides-4`:
  - [0] „Sonnen- und Mondeinfluss können sich verstärken“ → „Sonne, Erde und Mond stehen auf einer Linie“
- `history-khipu:limits`:
  - [0] „Dass damit jede weitere Bedeutung des Khipus vollständig geklärt ist“ → „Dass damit alles im Khipu verstanden ist“
- `history-mohenjo-daro:compare`:
  - [0] „An dieser Stelle gab es eine bauliche Einrichtung für einen Wasserweg“ → „Dass es hier einen Weg für Wasser gab“
- `history-mohenjo-daro:limits`:
  - [0] „Untersuchter Ausschnitt und Gesamtstadt sind nicht automatisch gleich“ → „Weil andere Stadtteile anders sein konnten“
- `history-bronze:limits`:
  - [0] „Alle Menschen der ganzen Region benutzten ausschließlich Bronze.“ → „Alle Menschen der Gegend nutzten nur Bronze.“
- `person-maria_sibylla_merian:evidence`:
  - [0] „Die beiden Bilder mit derselben Hintergrundfarbe ausmalen.“ → „Die Farben von Raupe und Falter genau vergleichen“
  - [1] „Beobachtungsnotizen, die die Entwicklung desselben Tiers verfolgen.“ → „Die Raupe beobachten, bis der Falter schlüpft“
  - [2] „Die Namen der Tiere durch besonders ähnliche Wörter ersetzen.“ → „Schauen, ob beide auf derselben Wiese leben“
- `person-inge_lehmann:evidence`:
  - [0] „Die Zeichnung schöner färben und damit die Messung ersetzen.“ → „Sofort ein ganz neues Bild der Erde zeichnen.“
  - [2] „Messung prüfen und untersuchen, welche Erklärung sie zusätzlich erfasst.“ → „Die Messung prüfen und eine bessere Erklärung suchen.“
- `person-inge_lehmann:limits`:
  - [0] „Das Modell wird durch passende Messungen gestützt; weitere Eigenschaften brauchen zusätzliche Belege.“ → „Das Modell passt besser, aber vieles ist noch offen.“

Bei 23 Challenge-Fragen ändert sich nur der Fragetext (Prompt); Antworten sind davon nicht betroffen. Sechs Fragen bekommen auf ihrer alten ID ganz neuen Inhalt:
- `science-water-cycle-1`
- `science-fungi-3`
- `science-moon-phases-4`
- `science-seasons-3`
- `person-jane_goodall:rate-2`
- `person-maria_sibylla_merian:evidence`

Das Thema bleibt jeweils gleich. Ihre `wrongReasons` in `challenge-hints.json` werden ersetzt.

**Bitte vom Test unabhängig prüfen:** Einige übernommene wrongReasons verraten die Lösung. Ich habe sie nach deiner Anweisung übernommen. Vorschlag zum Ersetzen:
- `science-water-cycle-2`
  - [1] → „Das ist Verdunstung. Kondensation ist etwas anderes.“
  - [2] → „Wenn Eis flüssig wird, schmilzt es. Das ist etwas anderes.“
- `science-water-cycle-3`
  - [1] → „Auf Asphalt fließt Regen sogar leichter ab.“
  - [2] → „Seen und Flüsse verdunsten weiter, auch in der Stadt.“
- `history-bronze:material`
  - [1] → „Kupfer ist schon genannt. Das wissen sie also bereits.“
  - [2] → „Zinn ist schon genannt. Das wissen sie also bereits.“
- `history-bronze:limits`
  - [1] → „Das kann man wirklich tun. Das ist nicht zu viel.“
  - [2] → „Vergleichen geht wirklich. Das ist nicht zu viel.“

---

## B) Neue Fragen (die zehn Experten-Vorschläge plus zwei Ergänzungen)

Neun Denkfragen kommen aus dem Bericht. Der zehnte Vorschlag, Steinwerkzeuge als Reihenfolge, steht in Teil D. Zusätzlich gibt es zwei Ergänzungen:
- `history-stone_tools:rate-4` als Ersatz-Denkfrage, falls „Ordne richtig“ noch nicht gebaut ist;
- `invention-bicycle:rate-4` als Profi-Frage, weil dem Fahrrad keine Profi-Frage fehlte.

```json
{"id":"animal-african-savanna-elephant:rate-4","level":"experte","prompt":"In einem sehr trockenen Jahr sind viele Wasserlöcher leer. Warum ist es dann gut, dass die älteste Elefantenkuh die Herde führt?","answers":["Sie ist die Stärkste und kann kämpfen","Sie erinnert sich an Wasserstellen von früher","Sie ist die Schnellste der Herde","Sie braucht selbst am wenigsten Wasser"],"correct":1,"why":"Eine alte Leitkuh hat schon viele trockene Jahre erlebt. Sie erinnert sich, wo es damals noch Wasser gab, und führt die Herde dorthin.","hints":["Schau im Steckbrief nach: Wie alt kann ein Elefant werden?","In 50 Jahren gibt es viele trockene Jahre. Wer sie erlebt hat, weiß mehr."],"wrongReasons":["Kämpfen hilft nicht, wenn das Wasserloch leer ist.",null,"Schnell laufen hilft nichts, wenn man nicht weiß, wohin.","Auch die Leitkuh braucht viel Wasser. Sie hat einen anderen Vorteil."],"geaendert":"neu (Bericht Abschnitt 4); richtige Antwort verlängert, damit sie nicht die kürzeste ist","pruefen":"⚠ Leitkühe erinnern sich an ferne Wasserstellen und führen in Dürren dorthin (z. B. Foley u. a. 2008, Tarangire); Leitkuh ist nicht die Stärkste"},
{"id":"animal-polar-bear:rate-3","level":"experte","prompt":"Ein Eisbär schwimmt lange im eiskalten Meer. Sein Fell ist klatschnass. Was hält ihn jetzt vor allem warm?","answers":["Die Luft in seinem Fell","Seine schwarze Haut","Seine dicke Fettschicht unter der Haut","Seine großen, breiten Tatzen"],"correct":2,"why":"Nasses Fell hält kaum noch Luft fest. Im Wasser wärmt ihn vor allem seine Fettschicht. Sie ist bis zu zehn Zentimeter dick.","hints":["Lies noch einmal: Was hält den Eisbären warm?","Nasses Fell klebt zusammen. Ist dann noch viel Luft darin?"],"wrongReasons":["Nasses Fell klebt zusammen. Dann ist kaum noch Luft darin.","Die schwarze Haut nimmt Sonnenwärme auf. Im kalten Wasser hilft sie wenig.",null,"Die Tatzen helfen beim Schwimmen, aber sie halten nicht warm."],"geaendert":"neu (Bericht Abschnitt 4)","pruefen":"⚠ Im Wasser isoliert vor allem die Fettschicht, nasses Fell kaum"},
{"id":"animal-common-octopus:rate-3","level":"experte","prompt":"Ein Krake passt durch einen Spalt, der viel schmaler ist als sein Körper. Wie schafft er das?","answers":["Seine Knochen sind weich und biegsam","Er drückt den Spalt mit den Armen breiter","Er hat keine Knochen und macht sich schmal","Nur seine Arme passen hinein"],"correct":2,"why":"Ein Krake ist ein Weichtier und hat keine Knochen. Nur sein Schnabel ist hart. Wo der Schnabel durchpasst, kann sich der ganze Krake hindurchquetschen.","hints":["Im Steckbrief steht seine Tiergruppe. Was bedeutet das Wort?","Weichtiere wie Schnecken haben innen kein hartes Gerüst."],"wrongReasons":["Weiche Knochen hat ein Krake nicht. Denk an seine Tiergruppe.","Fels lässt sich nicht wegdrücken, auch nicht von starken Armen.",null,"Der ganze Krake kommt durch den Spalt, nicht nur die Arme."],"geaendert":"neu (Bericht Abschnitt 4); „Weichtier“ nicht mehr in der Frage, Falle „weiche Knochen“ statt „Wasser ausstoßen“ (das wäre teilweise wahr)","pruefen":"⚠ kein Skelett; der harte Schnabel bestimmt, wie schmal der Spalt sein darf"},
{"id":"history-stone_tools:rate-4","level":"experte","prompt":"Aus der Zeit der ältesten Steinwerkzeuge hat man keine Werkzeuge aus Holz gefunden. Woran kann das liegen?","answers":["Damals wuchsen dort noch keine Bäume","Holz taugt nicht für Werkzeuge","Holz verrottet, Stein bleibt erhalten","Alle Holzwerkzeuge wurden verbrannt"],"correct":2,"why":"Holz verrottet mit der Zeit. Stein hält Millionen Jahre. Darum wissen wir nicht, ob die frühen Verwandten des Menschen auch Holz benutzten.","hints":["Was passiert mit einem Ast, der jahrelang im Wald liegt?","Ein Stein liegt nach Millionen Jahren noch da. Ein Ast nicht."],"wrongReasons":["Bäume gab es schon viele Millionen Jahre vorher.","Aus Holz kann man gut Werkzeuge machen, zum Beispiel Speere oder Grabstöcke.",null,"Dass alle verbrannt wurden, kann niemand wissen. Es gibt einen einfacheren Grund."],"geaendert":"neu, zusätzlich zum Bericht: Ersatz-Denkfrage, falls „Ordne richtig“ (D) noch nicht gebaut ist","pruefen":"⚠ älteste erhaltene Holzwerkzeuge sind viel jünger (Schöningen etwa 300.000 J., Kalambo Falls etwa 476.000 J.); Bäume gab es lange vorher"},
{"id":"history-apollo11:rate-4","level":"experte","prompt":"Der Hinflug dauerte etwa 4 Tage. Auf dem Mond blieben sie fast einen Tag. Die ganze Reise dauerte etwa 8 Tage. Wie lange dauerte ungefähr der Rückflug?","answers":["Etwa 4 Tage","Etwa 3 Tage","Etwa 1 Tag","Etwa 8 Tage"],"correct":1,"why":"8 Tage minus 4 Tage Hinflug minus fast 1 Tag auf dem Mond: Für den Rückflug bleiben etwa 3 Tage.","hints":["Die Reise hat drei Teile: hin, auf dem Mond, zurück.","Von den 8 Tagen sind 4 Tage und noch fast 1 Tag schon verbraucht."],"wrongReasons":["4 Tage dauerte der Hinflug. Zähle nach, was von 8 Tagen übrig bleibt.",null,"Fast einen Tag waren sie auf dem Mond. Gesucht ist der Rückflug.","8 Tage dauerte die ganze Reise, nicht nur der Rückflug."],"geaendert":"neu (Bericht Abschnitt 4)","pruefen":"⚠ Start 16.7.1969 13:32 UTC, Mondlandung 20.7. 20:17 UTC, Start vom Mond 21.7. 17:54 UTC, Wasserung 24.7. 16:50 UTC"},
{"id":"person-marie_curie:rate-3","level":"experte","prompt":"Marie Curie forschte in Paris. Warum nannte sie ein neues Element trotzdem „Polonium“?","answers":["Sie fand es in einem Bergwerk in Polen","Sie wollte an ihre unfreie Heimat Polen erinnern","Ihr Mann Pierre stammte auch aus Polen","Das Geld für ihre Forschung kam aus Polen"],"correct":1,"why":"Polen war damals kein freies Land. Mit dem Namen wollte Marie Curie alle an ihre Heimat erinnern.","hints":["Lies im Steckbrief nach, wo sie geboren wurde.","Polen wurde damals von Russland beherrscht. Mit einem Namen kann man an etwas erinnern."],"wrongReasons":["Das Gestein für ihre Versuche kam nicht aus Polen.",null,"Pierre Curie war Franzose.","Woher das Geld kam, hat mit dem Namen nichts zu tun."],"geaendert":"neu (Bericht Abschnitt 4)","pruefen":"⚠ Grund der Namenswahl (Veröffentlichung 1898); ⚠ Erz (Pechblende) aus St. Joachimsthal in Böhmen, nicht aus Polen; Pierre Curie war Franzose; Polen war geteilt (Russland, Preußen, Österreich)"},
{"id":"person-jane_goodall:rate-3","level":"experte","prompt":"Jane sieht: Ein Schimpanse zupft alle Blätter von einem Zweig ab. Dann verschwindet er im Gebüsch. Was hat sie wirklich gesehen?","answers":["Er hat ein Termiten-Werkzeug gebaut","Er wollte damit Termiten angeln","Er hat einen Zweig ganz kahl gemacht","So machen es alle Schimpansen"],"correct":2,"why":"Gesehen hat Jane nur den kahlen Zweig. Dass er damit Termiten angeln will, ist eine Vermutung. Ob sie stimmt, zeigt erst die nächste Beobachtung.","hints":["Was konnte Jane mit eigenen Augen sehen, und was denkt sie sich nur dazu?","Den Termitenbau hat sie in dieser Szene gar nicht gesehen."],"wrongReasons":["Ein Werkzeug? Das vermutet Jane. Gesehen hat sie es nicht.","Was der Schimpanse will, kann Jane nicht sehen. Das ist eine Vermutung.",null,"Jane hat nur einen Schimpansen gesehen, nicht alle."],"geaendert":"neu (Bericht Abschnitt 4)","pruefen":"ausgedachte Szene, keine neuen Fakten"},
{"id":"building-giza-pyramids:rate-3","level":"experte","prompt":"Vor ungefähr wie vielen Jahren verlor die Cheops-Pyramide ihren Rekord als höchstes Bauwerk der Welt?","answers":["Vor etwa 3.800 Jahren","Vor etwa 140 Jahren","Vor etwa 700 Jahren","Vor etwa 8.300 Jahren"],"correct":2,"why":"Gebaut wurde sie vor etwa 4.500 Jahren. Rund 3.800 Jahre lang war sie die Höchste. 4.500 minus 3.800 ergibt etwa 700 Jahre. Damals bekam eine Kirche in England eine noch höhere Turmspitze.","hints":["Zwei Zahlen stehen auf der Karte: wann sie gebaut wurde und wie lange sie die Höchste war.","Rechne: 4.500 Jahre minus 3.800 Jahre."],"wrongReasons":["3.800 Jahre lang war sie die Höchste. Gesucht ist, wie lange das her ist.","Vor etwa 140 Jahren wurde der Eiffelturm gebaut. Da war der Rekord schon lange weg.",null,"Das ist mehr als ihr ganzes Alter. So alt ist die Pyramide nicht."],"geaendert":"neu (Bericht Abschnitt 4); „an den Eiffelturm“ gestrichen, damit die Antworten gleich lang sind (140 Jahre bleibt die Eiffelturm-Falle)","pruefen":"⚠ Kathedrale von Lincoln um 1311 höher (Turmspitze 1548 eingestürzt)"},
{"id":"building-eiffel-tower:rate-3","level":"experte","prompt":"Bei Sonne neigt sich die Spitze des Turms ein wenig von der Sonne weg. Warum?","answers":["Die Schattenseite dehnt sich stärker aus als die Sonnenseite","Die Sonnenseite dehnt sich stärker aus als die Schattenseite","Der ganze Turm dehnt sich überall gleich stark aus","Das Eisen dehnt sich aus und wird dabei weich"],"correct":1,"why":"Die Sonne wärmt eine Seite mehr. Diese Seite dehnt sich stärker aus und wird ein wenig länger. Darum biegt sich die Spitze zur kühlen Seite, weg von der Sonne.","hints":["Stell dir den Turm aus zwei Hälften vor: eine in der Sonne, eine im Schatten.","Wird eine Seite länger als die andere, biegt sich der Turm zur kürzeren Seite."],"wrongReasons":["Die Schattenseite ist kühler. Kühles Eisen dehnt sich weniger aus.",null,"Dann würde der Turm nur ein bisschen höher. Neigen würde er sich nicht.","Eisen wird erst bei sehr großer Hitze weich. Sonne schafft das nicht."],"geaendert":"neu; gegenüber dem Bericht umgebaut: alle Antworten enthalten „dehnt sich aus“, sonst wäre die Lösung aus „Schon gewusst?“ wiederzufinden","pruefen":"⚠ Auslenkung der Spitze bis etwa 15–18 cm (toureiffel.paris)"},
{"id":"science-water-cycle:rate-4","level":"experte","prompt":"Eine kalte Glasflasche mit Deckel kommt aus dem Kühlschrank. Bald ist sie außen nass. Woher kommt das Wasser?","answers":["Es sickert durch das Glas nach außen","Wasserdampf aus der Luft wird flüssig","Es kommt von deinen Händen beim Tragen","Wasser aus der Flasche verdunstet nach außen"],"correct":1,"why":"Die Luft enthält unsichtbaren Wasserdampf. An der kalten Flasche kühlt die Luft ab, und der Dampf wird zu Tröpfchen. So entsteht auch eine Wolke.","hints":["Denk an das Häppchen „Wie entsteht eine Wolke?“.","Die Flasche ist fest zu. Was ist um die Flasche herum und kühlt an ihr ab?"],"wrongReasons":["Durch Glas kann kein Wasser sickern.",null,"Auch wenn du die Flasche gar nicht anfasst, wird sie nass.","Die Flasche ist fest zu. Aus ihr kommt nichts heraus."],"geaendert":"neu (Bericht Abschnitt 4); „Reif vom Kühlschrank“ ersetzt (wäre bei Gefrierfach teilweise wahr)","pruefen":""},
{"id":"invention-bicycle:rate-4","level":"profi","prompt":"Warum hieß das Rover-Rad „Sicherheitsfahrrad“?","answers":["Es hatte als erstes Rad Bremsen","Es hatte schon Reifen mit Luft","Bei einem Sturz fiel man weniger tief","Es fuhr langsamer als andere Räder"],"correct":2,"why":"Beim Hochrad saß man hoch über dem großen Vorderrad. Beim Rover-Rad saß man näher am Boden. Ein Sturz war darum weniger gefährlich. Luftreifen hatte es noch nicht.","hints":["Vergleiche, wo man auf dem Hochrad saß und wo auf dem Rover-Rad."],"wrongReasons":["Bremsen hatten schon Räder vor dem Rover-Rad.","Das Rover-Rad hatte noch Reifen aus festem Gummi.",null,"Schneller oder langsamer, darum ging es beim Namen nicht."],"geaendert":"neu, zusätzlich zum Bericht: der Karte fehlte eine Profi-Frage","pruefen":"⚠ Name „safety bicycle“ wegen des niedrigen Sitzes; ⚠ Hochräder hatten schon Bremsen am Vorderrad (sonst wäre „als erstes Rad Bremsen“ nicht eindeutig falsch)"}
```

Diese neuen IDs gehören in `tests/fixtures/stable-ids.json`:
- `animal-african-savanna-elephant:rate-4`
- `animal-polar-bear:rate-3`
- `animal-common-octopus:rate-3`
- `history-stone_tools:rate-4`
- `history-apollo11:rate-4`
- `person-marie_curie:rate-3`
- `person-jane_goodall:rate-3`
- `building-giza-pyramids:rate-3`
- `building-eiffel-tower:rate-3`
- `science-water-cycle:rate-4`
- `invention-bicycle:rate-4`

**Eine Überschneidung:** Die Frage `elephant:rate-4` verrät die Lösung von `rate-3` („älteste Kuh“). Ein Experte sieht `rate-4` zuerst. Wenn `rate-3` danach als „Noch eine Frage“ kommt, ist sie für ihn geschenkt. Das ist harmlos. Wer will, schiebt auf der Experten-Stufe `rate-3` nicht nach `rate-4` ein.

---

## C) „Fast richtig“ (S5 Art 2)

**`person-marie_curie:stimmt-1`** – „Marie Curie hat das Radium erfunden.“
- Falsches Wort: **erfunden**
- Zur Auswahl: „Marie Curie“, „Radium“, „erfunden“
- Richtiges Ersatzwort: **entdeckt**
- Auflösung: „Radium steckte schon im Gestein. Marie Curie hat es dort entdeckt, nicht erfunden. Erfinden kann man nur etwas, das es vorher nicht gab.“
- Einstufung: Experte, aber knapp. Die Falle „erfinden oder entdecken“ ist bekannt.
- Wichtig: Die Wortwahl muss **vor** der bisherigen Erklärung kommen. Die Erklärung lautet „entdeckt, nicht erfunden“ und verrät das Wort sonst.

**`building-giza-pyramids:stimmt-1`** – „Die große Pyramide sah früher genauso aus wie heute.“
- Falsches Wort: **genauso**
- Zur Auswahl: „große Pyramide“, „früher“, „genauso“, „heute“
- Richtiges Ersatzwort: **anders**
- Auflösung: „Früher war sie etwa 8 Meter höher und außen ganz mit hellem, glattem Kalkstein verkleidet. Heute fehlen die Spitze und die Verkleidung.“ ⚠ 146,5 m einst, etwa 138,5 m heute
- **Schwach:** Das Ersatzwort ist nur die Verneinung der ganzen Behauptung, nicht ein kleines falsches Detail. Damit ist es höchstens Profi.
- **Empfehlung:** eine neue Behauptung `building-giza-pyramids:stimmt-2` (`isTrue: false`), die echtes „Fast richtig“ ist: „Früher war die große Pyramide außen ganz mit Granit verkleidet.“
  - Falsches Wort: **Granit**
  - Zur Auswahl: „früher“, „außen“, „Granit“, „verkleidet“
  - Ersatzwort: **Kalkstein**
  - Auflösung: „Die Verkleidung war aus hellem Kalkstein aus Tura. Granit gibt es nur innen, zum Beispiel in der Königskammer.“
  - ⚠ Fakten prüfen. Diese Behauptung passt zu `giza:rate-1` (Granit als Falle) und zu „Mehr erfahren“.

---

## D) „Ordne richtig“ (S5 Art 3, Probe) – `history-stone_tools`, Experte

- Frage: „Was war zuerst? Ordne vom Ältesten zum Jüngsten.“
- Richtige Reihenfolge:
  1. „Die großen Dinosaurier sterben aus“ (vor etwa 66 Millionen Jahren)
  2. „Die ersten Steinwerkzeuge entstehen“ (vor etwa 3,3 Millionen Jahren)
  3. „Frühe Verwandte des Menschen nutzen Feuer“ (älteste sichere Spuren vor etwa 1 Million Jahren ⚠, z. B. Wonderwerk-Höhle; ältere Funde sind umstritten)
  4. „Die Pyramiden von Gizeh werden gebaut“ (vor etwa 4.500 Jahren)
- Tipp 1: „Vergleiche: Millionen Jahre sind viel länger her als tausende Jahre.“
- Tipp 2: „Lies bei „Stimmt das?“ nach: Was gab es zuerst, Werkzeuge oder Feuer?“
- Auflösung: „Zuerst starben die Dinosaurier aus, vor etwa 66 Millionen Jahren. Viel später, vor etwa 3,3 Millionen Jahren, entstanden die ersten Steinwerkzeuge. Feuer nutzten frühe Verwandte des Menschen erst danach. Die ältesten sicheren Spuren sind etwa 1 Million Jahre alt. Die Pyramiden sind erst rund 4.500 Jahre alt.“
- Bewertung: Die Teile liegen zeitlich weit auseinander. E4 verlangt eigentlich „nah beieinander“. Schwer wird die Aufgabe, weil drei Stellen verbunden werden müssen: Steckbrief, rate-1 und stimmt-1. Die Pyramiden sind leicht einzuordnen. Wenn es enger werden soll, ersetzt „Menschen malen Bilder an Höhlenwände“ (⚠ etwa 40.000 Jahre und älter) einen Teil. Das wäre dann ein fünfter Teil oder ein Tausch gegen die Dinosaurier.

---

## E) Zahlen

Nachgezählt mit `node` über `draft.json`, in Zeichen, „einzige“ bedeutet: kein Gleichstand.

| Gruppe | Fragen | richtig = einzige längste | richtig = einzige kürzeste |
|---|---|---|---|
| Pilot-Zusatzfragen inkl. neue | 41 | 8 (20 %) | 8 (20 %) |
| davon Profi und Experte | 28 | 8 (29 %) | 2 (7 %) |
| ohne die Ersatzfrage Steinwerkzeuge rate-4 | 40 | 7 (17,5 %) | 8 (20 %) |
| Challenge-Fragen | 42 | 9 (21 %), vorher 60 % | 4 (10 %) |
| davon `difficulty: hard` | 21 | 5 (24 %), vorher 71 % | 1 (5 %) |

Alle Grenzen sind eingehalten: höchstens 45 %, und bei den Pilot-Fragen mindestens 15 % „einzige längste“.

Wortmuster bei Profi und Experte, gezählt über 62 richtige und 186 falsche Antworten:
- Übertreibende Wörter (nur, immer, alle, jede, niemals, ganz): in 10 % der richtigen und 16 % der falschen Antworten. Vorher war das Verhältnis etwa 1 zu 5.
- Vorsichtige Wörter (meist, oft, etwa, manchmal, wohl): in 7 der 62 richtigen und 11 der 186 falschen Antworten.

**Stufen je Karte** (E = Entdecker, P = Profi, X = Experte):

| Karte | Pilot E/P/X | Challenge E/P/X |
|---|---|---|
| Elefant | 0/3/1 | – |
| Eisbär | 0/2/1 | – |
| Krake | 1/1/1 | – |
| Steinwerkzeuge | 2/1/1 (+ „Ordne richtig“ X) | – |
| Apollo 11 | 1/2/1 | – |
| Marie Curie | 1/1/1 (+ „Fast richtig“) | – |
| Jane Goodall | 1/1/1 | – |
| Gizeh | 0/2/1 (+ „Fast richtig“) | – |
| Eiffelturm | 1/1/1 | – |
| Wasserkreislauf | 3/0/1 | 0/4/0 |
| Mondphasen | 1/1/1 | 1/2/1 |
| Fahrrad | 2/1/1 | – |
| Fotosynthese | – | 1/3/0 |
| Bestäubung | – | 2/2/0 |
| Pilze | – | 1/2/1 |
| Korallenriff | – | 1/2/1 |
| Jahreszeiten | – | 1/2/1 |
| Gezeiten | – | 1/3/0 |
| Khipu, Mohenjo-Daro, Bronze, Merian, Lehmann | – | je 0/2/0 |

- Summe Pilot: 13 Entdecker, 16 Profi, 12 Experte.
- Summe Challenge: 8 Entdecker, 30 Profi, 4 Experte.
- Jede Pilot-Karte hat mindestens eine Profi- und eine Experten-Frage. Beim Wasserkreislauf kommen die Profi-Fragen aus der Challenge.
- Jede Challenge-Karte hat mindestens eine Profi-Frage.
- Experte gibt es nur, wo die Aufgabe echt ist: Pilze-3, Korallen-4, Jahreszeiten-3, Mond-4.

---

### Kurz: Lücken und Unsicheres

- **Keine Entdecker-Zusatzfrage** haben Elefant, Eisbär und Gizeh. Kleine Kinder sehen dort nur die Hauptfrage.
- **Kein Experte** in der Challenge haben Fotosynthese, Bestäubung, Gezeiten und die fünf Geschichts- und Personenkarten. Passende Ideen:
  - Fotosynthese: „Woher kommt das meiste Holz eines Baumes?“, Art 1. Aber: „Schon gewusst?“ nennt das schon fast.
  - Gezeiten: „Springtide bei Neumond“ als Denkfrage, Art 1.
  - Bronze: Funde ordnen, Art 3.
- **Abwechslung:** Fünf Fragen haben dasselbe Muster „Welcher Satz behauptet zu viel / ist vorsichtig?“. Das sind `khipu:limits`, `bronze:limits`, `lehmann:limits`, `fungi-4` und teilweise `mohenjo:compare`. Wer das Muster einmal erkannt hat, wählt danach das Übertreibende oder das Vorsichtige. Das gehört beim Ausrollen aufgelockert.
- **Hauptfrage `history-apollo11:mini`:** Ihr Tipp handelt von Collins, also eigentlich von rate-1 (Befund 7). Vorschlag für den neuen Tipp: „Im Raumschiff saß mehr als ein Mensch. Und alle waren Raumfahrer.“
- **Nicht beurteilen kann ich:**
  - ob Experte 10- bis 12-Jährigen Spaß macht;
  - ob Rechenfragen wie Apollo-4 und Gizeh-3 als Knobelei oder als Mathe-Aufgabe empfunden werden.

  Das zeigt erst die Rückmeldung echter Kinder.
