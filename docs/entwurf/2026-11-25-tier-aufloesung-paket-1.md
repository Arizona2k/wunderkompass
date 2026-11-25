# Tier-Auflösungen, Paket 1 (25.11.2026), karten-autor

Entwurf des `karten-autor` (opus / high), noch ungeprüft. Danach prüfen `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer` unabhängig. Gesichert von Claude aus dem Helferbericht, Wortlaut unverändert bis auf die Gliederung.

## Regeln, nach denen geschrieben wurde

Nach den Regeln aus `AUFLOESUNG` und `TECHNIK_AUFLOESUNG`, dazu drei Regeln aus den Spielen (gelten auch für Pakete 2 bis 4):

- **Höchstens 180 Zeichen**, 2 bis 3 Sätze.
- **Höchstens 13 Wörter je Satz.** Getrennt wird wie beim Technik-Test an `.`, `!`, `?` und `:` (darum zählt das Skript bei Löwe, Giraffe und Gorilla 4 Satzteile).
- **Höchstens eine Zahl.**
- **Beginnt mit Artikel und Kartentitel**, z. B. „Der Löwe“. Bei Titeln mit Adjektiv ändert der Artikel die Endung: „Der Afrikanische Savannenelefant“, „Der Große Panda“, „Der Westliche Flachlandgorilla“, „Der Große Tümmler“. Ein Test mit `startsWith(t.title)` würde dort scheitern (siehe „Offen“).
- **Beim Tierdetektiv wird kein Satz des Hinweises wiederholt.** Kein Satz steht wörtlich so auf der Karte.
- **Kein anderes Tier aus dem Spiel wird genannt**, auch nicht über andere Namen: „Tintenfisch“ ist ein anderer Name der Karte „Gewöhnliche Sepia“ (bei Kaiserpinguin und Tümmler darum weggelassen); „Löwen“ beim Gepard vermieden.

Nachgezählt mit einem Skript im Scratchpad des Helfers: alle 36 Texte „ok“, 142 bis 180 Zeichen. San Diego Zoo heißt unten immer San Diego Zoo Wildlife Alliance, Smithsonian immer Smithsonian National Zoo.

---

## 1. Afrikanischer Savannenelefant (`animal-african-savanna-elephant`)

**Heute im Spiel:** Hinweis „Ich kann mit meinem langen Rüssel riechen, greifen und Wasser ins Maul bringen. An seiner Spitze sitzen zwei kleine Fortsätze.“ · Zuhause: „Savanne“ (Karte ohne Fakt „Lebensraum“, Auflösung heute nur „Afrikanischer Savannenelefant: Savanne“) · Futter: „Pflanzen“ (heute „Er frisst Gras, Blätter, Zweige, Früchte und Rinde.“).

- **Tierdetektiv (178):** Der Afrikanische Savannenelefant greift mit zwei Fingerchen an der Rüsselspitze. So hebt er sogar einen Strohhalm auf. Mit dem Rüssel spritzt er sich auch Wasser über den Rücken.
  - Quelle: San Diego Zoo, https://animals.sandiegozoo.org/animals/elephant („two fingers there to help them pick things up“, „pick up a single piece of straw“, „spray themselves with water“)
- **Zuhause (162):** Der Afrikanische Savannenelefant lebt in weitem Grasland mit einzelnen Bäumen. Dort ist es oft heiß und trocken. Mit den Stoßzähnen gräbt er manchmal nach Wasser.
  - Quelle: San Diego Zoo (wie oben): Stoßzähne zum „digging for water and food“. ⚠ Für „Grasland mit einzelnen Bäumen“ steht auf der Karte keine eigene Quelle.
- **Futter (161):** Der Afrikanische Savannenelefant frisst Pflanzen, und davon sehr viel. Mit dem Rüssel rupft er Gras und reißt Zweige ab. Dafür braucht er etwa 16 Stunden am Tag.
  - Quelle: San Diego Zoo (wie oben): „average of 16 hours per day eating“, 75 bis 150 kg am Tag. ⚠ Gras mit dem Rüssel rupfen: allgemeines Wissen, nicht wörtlich belegt.

**Hinweise:** Trinken weggelassen (Zusatzfrage „Wie trinkt ein großer Elefant?“). Kein Staubbad: Die Quelle sagt „roll in the mud or dust“ (wälzen, nicht pusten).

## 2. Löwe (`animal-lion`)

**Heute:** Hinweis „Wir leben in Rudeln. Weibchen jagen oft zusammen und betreuen gemeinsam die Jungen. Unsere lauten Rufe sind weithin zu hören.“ · Zuhause „Savanne“ · Futter „Fleisch“ (heute „Sie fressen zum Beispiel Zebras, Gnus und andere größere Tiere.“).

- **Tierdetektiv (168):** Der Löwe lebt mit seiner Familie zusammen, anders als die meisten Katzen. Mit Brüllen zeigen Löwen anderen: Das ist unser Gebiet. So erkennen sie sich auch gegenseitig.
  - Quellen: Smithsonian, https://www.nationalzoo.si.edu/animals/lion („world's most social felines“, „mark their territories by roaring“); San Diego Zoo, https://animals.sandiegozoo.org/animals/lion (Brüllen „identifies individuals, strengthens the pride’s bond“).
- **Zuhause (162):** Der Löwe lebt gern in offenem Grasland mit Büschen und einzelnen Bäumen. Dort ziehen viele große Tiere umher, die er jagt. Er ruht viel, bis zu 21 Stunden am Tag.
  - Quellen: San Diego Zoo („lying around that total up to 21 hours“); Karte (Savannen, offene Wälder); Smithsonian („primarily eat large animals“).
- **Futter (142):** Der Löwe frisst Fleisch. Meist jagen die Weibchen, oft nachts oder in der Dämmerung. Manchmal nehmen Löwen anderen Jägern auch ihre Beute weg.
  - Quellen: San Diego Zoo („usually hunt at night, particularly at dusk and dawn, with lionesses doing most of the work“); Smithsonian („steal kills from hyenas, leopards“).

**Hinweise:** Nicht „die einzigen Katzen in Gruppen“ (Gepard-Karte: Männchen oft in kleinen Gruppen). Satz 1 ähnelt der Erklärung der Hauptfrage, ist aber nicht wörtlich gleich. Tarnfarbe nicht belegt, darum nicht drin.

## 3. Gepard (`animal-cheetah`)

**Heute:** Hinweis „Ich kann für kurze Zeit besonders schnell sprinten. Manche meiner Laute klingen wie das Zirpen eines Vogels.“ · Zuhause „Savanne“ · Futter „Fleisch“ (heute „Sie fressen vor allem kleinere Antilopen, außerdem Hasen und Vögel.“).

- **Tierdetektiv (180):** Der Gepard lenkt beim Rennen mit dem langen Schwanz wie mit einem Steuer. Seine Krallen halten im Boden wie Stollen am Fußballschuh. Mit Zirpen finden sich Mutter und Junge wieder.
  - Quelle: Smithsonian, https://nationalzoo.si.edu/animals/cheetah („tail acts as a rudder“, „semi-retractable claws provide great traction“, Zirpen bei Trennung und Wiedersehen).
- **Zuhause (172):** Der Gepard braucht offenes Land, damit er frei rennen kann. Gern späht er von einem Termitenhügel aus über das Gras. Er jagt am Tag, meist morgens und am späten Nachmittag.
  - Quelle: Smithsonian (wie oben): „scan the countryside from … the top of a termite mound“, „primarily diurnal, hunting in the early morning and late afternoon“.
- **Futter (168):** Der Gepard schleicht sich zuerst nah an seine Beute heran. Dann sprintet er los und packt sie an der Kehle. Er frisst schnell, bevor andere Tiere ihm die Beute stehlen.
  - Quelle: Smithsonian (wie oben): „creep within 100 yards“, „clamping down on the animal's windpipe“, „eat quickly, as they can be bullied away … by lions, hyenas, and … vultures“.

**Hinweise:** „Stollen am Fußballschuh“ ist ein eigener Vergleich für „traction“ (für die `kinder-redaktion`). „Andere Tiere“ statt „Jäger“, weil auch Geier die Beute wegnehmen.

## 4. Bengaltiger (`animal-bengal-tiger`)

**Heute:** Hinweis „Ich lebe zum Beispiel in Indien und Nepal. Als erwachsenes Tier bin ich meist allein unterwegs, schleiche mich an Beute an und kann gut schwimmen.“ · Zuhause „Wald“ · Futter „Fleisch“ (heute „Sie jagen vor allem mittelgroße und große Tiere, zum Beispiel Hirsche und Wildschweine.“).

- **Tierdetektiv (166):** Der Bengaltiger ist mit seinen Streifen im hohen Gras schwer zu sehen. Jeder Tiger hat ein eigenes Muster, wie ein Fingerabdruck. Zum Abkühlen geht er oft ins Wasser.
  - Quelle: Smithsonian, https://www.nationalzoo.si.edu/animals/tiger („striped coats help them blend into their surroundings“, „no two tigers have the exact same markings“, „often go into the water to escape flies or cool off“).
- **Zuhause (176):** Der Bengaltiger findet im Wald Verstecke, Wasser und Beutetiere. In Bangladesch lebt er sogar in Mangroven. Das sind Wälder an der Küste, deren Bäume im salzigen Wasser stehen.
  - Quelle: WWF Deutschland, https://www.wwf.de/themen-projekte/artenlexikon/bengal-tiger („in den Sümpfen und Mangrovenwäldern der sogenannten Sundarbans“). ⚠ „Bäume im salzigen Wasser“: allgemeines Wissen, braucht einen Beleg.
- **Futter (148):** Der Bengaltiger jagt meist nachts. Hat er ein großes Tier erbeutet, zieht er es an einen sicheren Ort. Davon kann er dann mehrere Tage lang fressen.
  - Quellen: Smithsonian („hunt primarily at night“); WWF Deutschland („schleift der Tiger seine Beute an einen sicheren Ort“, Weibchen „bis zu drei Tage“).

**Hinweise:** Die Karte nennt nur den WWF; Smithsonian Tiger sollte als zweite Quelle auf die Karte. WWF sagt „dämmerungs- oder nachtaktiv“ nur für Gegenden mit vielen Menschen, Smithsonian allgemein „primarily at night“ (⚠ „meist nachts“).

## 5. Giraffe (`animal-giraffe`)

**Heute:** Hinweis „Mit meiner langen Zunge erreiche ich Blätter zwischen dornigen Zweigen. Mein sehr langer Hals hat trotzdem sieben Halswirbel.“ · Zuhause „Savanne“ · Futter „Pflanzen“ (heute „Sie fressen Blätter und Triebe, oft von Akazien.“).

- **Tierdetektiv (170):** Die Giraffe hat einen so langen Hals, weil jeder Halswirbel sehr lang ist. Ihre Zunge ist dunkel gefärbt. Forscher vermuten: Das schützt sie beim Fressen vor Sonnenbrand.
  - Quelle: San Diego Zoo, https://animals.sandiegozoo.org/animals/giraffe (Halswirbel „each one can be over 10 inches … long“, dunkle Zunge gegen Sonnenbrand „It is thought …“).
- **Zuhause (148):** Die Giraffe kommt mit der trockenen Savanne gut zurecht. Viel Wasser bekommt sie aus saftigen Blättern. Darum kann sie lange ohne Trinken auskommen.
  - Quelle: San Diego Zoo (wie oben): „Acacia leaves contain a lot of water, so giraffes can go a long time without drinking.“
- **Futter (172):** Die Giraffe zupft Blätter mit Zunge und beweglichen Lippen ab. Ihre dicke, klebrige Spucke umhüllt verschluckte Dornen. Wie eine Kuh kaut sie ihr Futter später noch einmal.
  - Quelle: San Diego Zoo (wie oben): „prehensile lips“, „thick, sticky saliva that coats any thorns they might swallow“, „ruminants … chewing their cud“.

**Hinweise:** „Wie eine Kuh“: keine Spielkarte, die Quelle sagt „ruminants“. Satz 1 erklärt den „Trotzdem“-Teil des Hinweises.

## 6. Großer Panda (`animal-giant-panda`)

**Heute:** Hinweis „Ich lebe in kühlen Bergwäldern Chinas und zerbeiße mit kräftigen Kiefern harten Bambus. Ein besonderer Handgelenkknochen hilft beim Festhalten.“ · Zuhause „Gebirge“ · Futter „Bambus“ (heute „Sie fressen fast nur Bambus.“).

- **Tierdetektiv (177):** Der Große Panda ist ein Bär mit großen Kaumuskeln. Seine breiten Backenzähne zermahlen die harten Bambusstängel. Sein „Extra-Daumen“ ist kein Finger, sondern ein langer Knochen.
  - Quellen: Smithsonian, https://www.nationalzoo.si.edu/animals/giant-panda („large molar teeth and strong jaw muscles for crushing tough bamboo“, „pseudo thumb, formed by an elongated and enlarged wrist bone“); WWF Deutschland, https://www.wwf.de/themen-projekte/artenlexikon/grosser-panda/.
- **Zuhause (173):** Der Große Panda lebt in Bergwäldern, wo es kühl und feucht ist. Sein dichtes, wolliges Fell hält ihn warm. Winterruhe hält er nicht, denn Bambus gibt es dort das ganze Jahr.
  - Quellen: Smithsonian („thick, wooly coat keeps it warm in the cool forests“); WWF Deutschland (feuchte Hanglagen, Bambus „ganzjährig verfügbar“, keine Winterruhe).
- **Futter (166):** Der Große Panda frisst etwa 12 Stunden am Tag Bambus. Sein Bauch ist eigentlich für Fleisch gebaut und verdaut Bambus schlecht. Darum braucht er riesige Mengen davon.
  - Quellen: WWF Deutschland („circa 12 Stunden des Tages“); Smithsonian („10 to 16 hours“, Verdauung „more similar to that of a carnivore“).

**Hinweise:** „Winterruhe“ wie beim WWF; ob für 5-Jährige verständlich, entscheidet die `kinder-redaktion` (sonst „Er schläft im Winter nicht lange.“). „Etwa 12“ passt zu WWF (circa 12) und Smithsonian (10 bis 16).

## 7. Westlicher Flachlandgorilla (`animal-western-lowland-gorilla`)

**Heute:** Hinweis „Beim Gehen auf allen vieren stütze ich mich auf die Fingerknöchel. In meiner Gruppe leben meist ein erwachsenes Männchen, mehrere Weibchen und ihre Jungen.“ · Zuhause „Regenwald“ · Futter „Vorwiegend Pflanzen“ (heute „Er frisst vor allem Blätter, Stängel und Früchte, gelegentlich auch kleine Wirbellose.“).

- **Tierdetektiv (166):** Der Westliche Flachlandgorilla hat längere Arme als Beine. Das erwachsene Männchen heißt Silberrücken: Auf seinem Rücken wachsen graue Haare. Es beschützt die Gruppe.
  - Quellen: Smithsonian, https://www.nationalzoo.si.edu/animals/western-lowland-gorilla („arms are longer than their legs“, Silberrücken schützt die Gruppe); WWF Deutschland, https://www.wwf.de/themen-projekte/artenlexikon/westlicher-gorilla („ergrauten Rückenhaare“).
- **Zuhause (179):** Der Westliche Flachlandgorilla findet im warmen, feuchten Regenwald viele Pflanzen. Gern besucht er sumpfige Lichtungen, also freie Stellen im Wald. Dort frisst er Wasserpflanzen.
  - Quelle: WWF Deutschland (wie oben): „sumpfige Waldlichtungen, die so genannten Bais“, „mineralreiche Wasserpflanzen“.
- **Futter (168):** Der Westliche Flachlandgorilla frisst vor allem Pflanzen. Wenn viele Früchte reif sind, wandert er dafür weite Strecken. Ab und zu nascht er auch Ameisen oder Termiten.
  - Quellen: WWF Deutschland (Früchtesaison, weite Strecken; gelegentlich „Weberameisen und Termiten“); Smithsonian („longer distances traveled when more fruit is abundant“).

**Hinweise:** „Weite Strecken“ ist relativ (Smithsonian: meist unter 1,6 km am Tag, nur zur Fruchtzeit mehr; ⚠ für den `fakten-pruefer`). Ameisen und Termiten stehen nicht unter den Fallen.

## 8. Borneo-Orang-Utan (`animal-bornean-orangutan`)

**Heute:** Hinweis „Ich lebe nur auf Borneo. Lange Arme und Greifhände helfen beim Klettern. Zum Schlafen baue ich meist ein neues Nest aus Ästen und Blättern.“ · Zuhause „Regenwald“ · Futter „Vorwiegend Pflanzen“ (heute „Er frisst vor allem Früchte, außerdem Blätter, Rinde und Insekten.“).

- **Tierdetektiv (162):** Der Borneo-Orang-Utan kann auch mit den Füßen greifen wie mit Händen. So hält er sich gleichzeitig an mehreren Ästen fest. Sein Name bedeutet „Mensch des Waldes“.
  - Quellen: Smithsonian, https://www.nationalzoo.si.edu/animals/orangutan („grasping hands and feet“, „person of the forest“); San Diego Zoo, https://animals.sandiegozoo.org/animals/orangutan („prehensile feet“). ⚠ Satz 2 ist eine Folgerung, nicht wörtlich belegt.
- **Zuhause (170):** Der Borneo-Orang-Utan verbringt den größten Teil seines Lebens in Bäumen. Dort findet er Futter und Schlafplätze. Bei Regen deckt er sich manchmal mit großen Blättern zu.
  - Quelle: San Diego Zoo (wie oben): „spend most of their lives in trees“, „drape large leaves over themselves like a poncho“.
- **Futter (170):** Der Borneo-Orang-Utan frisst am liebsten reife Früchte, zum Beispiel wilde Feigen. Schon als Junges lernt er, wo im Wald Fruchtbäume stehen. Er merkt sich die Plätze gut.
  - Quellen: San Diego Zoo („Figs … are most common“, „mental map of the forest“); Smithsonian („cognitive maps“).

**Hinweise:** Die Quellen sprechen allgemein von Orang-Utans. Smithsonian Orangutan als Kartenquelle ergänzen (Name).

## 9. Eisbär (`animal-polar-bear`)

**Heute:** Hinweis „Ich laufe mit großen Tatzen über das Meereis der Arktis und kann schwimmen. Meine Beute sind vor allem Robben.“ · Zuhause „Arktis“ · Futter „Fleisch“ (heute „Vor allem Robben.“).

- **Tierdetektiv (155):** Der Eisbär hat an den Sohlen seiner breiten Tatzen kleine Noppen. Dazu wächst dort steifes Fell. Beides hilft ihm, auf dem glatten Eis nicht auszurutschen.
  - Quelle: San Diego Zoo, https://animals.sandiegozoo.org/animals/polar-bear („Small bumps on the pads … may add traction“, „Stiff fur on the sole of each foot keeps polar bears from slipping on the ice“).
- **Zuhause (159):** Der Eisbär braucht das Meereis rund um den Nordpol als Jagdgebiet. Schmilzt das Eis im Sommer ganz, muss er an Land. Dort findet er oft wochenlang kaum Futter.
  - Quellen: San Diego Zoo („where the sea ice melts completely, polar bears must move ashore … may fast until ice forms again“); WWF Deutschland, https://www.wwf.de/themen-projekte/artenlexikon/eisbaer/.
- **Futter (163):** Der Eisbär frisst Fleisch, meistens von Robben. Seine feine Nase riecht eine Robbe sogar unter dem Schnee. Robben haben viel Fett und geben ihm darum viel Energie.
  - Quelle: San Diego Zoo (wie oben): „sniff out a seal's den that has been covered with snow“, Robben als „high-calorie diet“. ⚠ „Viel Fett“ nicht wörtlich belegt (Quelle zum Robbenfett suchen).

**Hinweise:** Paddeln weggelassen (Zusatzfrage). Fettschicht und Fell nicht, weil das Häppchen „Warum friert er nicht?“ sie erklärt. „Wochenlang“ ist vorsichtig (in manchen Gegenden monatelang).

## 10. Kaiserpinguin (`animal-emperor-penguin`)

**Heute:** Hinweis „Ich lebe an den Küsten der Antarktis und tauche nach Nahrung. Der Vater wärmt das Ei auf seinen Füßen. Bei Kälte rücken viele von uns eng zusammen.“ · Zuhause „Antarktis“ · Futter „Fisch und Meerestiere“ (heute „Er frisst Fische, Krill und Tintenfische.“).

- **Tierdetektiv (164):** Der Kaiserpinguin-Vater deckt das Ei mit einer Hautfalte am Bauch zu. Wochenlang frisst er dabei nichts. In der dichten Gruppe wechseln sich alle am kalten Rand ab.
  - Quellen: Australian Antarctic Program, https://www.antarctica.gov.au/about-antarctica/animals/penguins/emperor-penguin/ („long incubation fast“, „taking turns … in the huddle“); National Geographic, https://www.nationalgeographic.com/animals/birds/facts/emperor-penguin („brood pouch“, rund 65 Tage). ⚠ Hautfalte nicht beim Australian Antarctic Program; besser Animal Diversity Web, https://animaldiversity.org/accounts/Aptenodytes_forsteri/.
- **Zuhause (150):** Der Kaiserpinguin hat viele Schichten dichter Federn und darunter viel Fett. Beides hält ihn im eisigen Wind warm. Futter findet er im eiskalten Meer.
  - Quelle: Australian Antarctic Program (wie oben): „several layers of scale-like feathers“, „large reserves of energy-giving body fat“.
- **Futter (155):** Der Kaiserpinguin jagt unter Wasser nach Fischen und Krill. Mit den Flügeln rudert er wie mit Paddeln. Ein Kaiserpinguin tauchte sogar über 500 Meter tief.
  - Quelle: Australian Antarctic Program (wie oben): Fische, „Antarctic krill“, „deepest dive recorded was to 565 metres“. ⚠ Flügel als Paddel nur in der Erklärung der Hauptfrage auf der Karte, kein Beleg zitiert.

**Hinweise:** „Tintenfische“ wegen der Sepia-Karte weggelassen. Stacheln auf der Zunge gestrichen (nicht belegt).

## 11. Blauwal (`animal-blue-whale`)

**Heute:** Hinweis „Ich bin das größte heute lebende Tier. Barten in meinem Maul halten winzige Krebstiere zurück, während ich Wasser herausdrücke.“ · Zuhause „Ozean“ · Futter „Krill“ (heute „Sie fressen fast nur Krill – kleine garnelenähnliche Krebstiere.“).

- **Tierdetektiv (149):** Der Blauwal hat statt Zähnen Barten. Sie sind aus demselben Stoff wie deine Fingernägel. Beim Fressen dehnt sich seine Kehle wie ein riesiger Ballon.
  - Quellen: Smithsonian Ocean, Right Whale Baleen, https://ocean.si.edu/node/108163 (Keratin wie Fingernägel; am Glattwal erklärt, gilt für alle Bartenwale ⚠); NOAA Fisheries, https://www.fisheries.noaa.gov/species/blue-whale („inflating their throat pleats“).
- **Zuhause (166):** Der Blauwal wandert oft weit, zwischen Futterplätzen und Plätzen für den Nachwuchs. Er gehört zu den lautesten Tieren der Welt. Im Wasser tragen seine Rufe sehr weit.
  - Quelle: NOAA Fisheries (wie oben): saisonale Wanderung (manche wandern nicht), „among the loudest animals on the planet“, Rufe „up to 1,000 miles“.
- **Futter (173):** Der Blauwal schwimmt mit offenem Maul in einen Schwarm Krill. Dann drückt er das Wasser mit der Zunge hinaus. An einem Tag kann er so viel fressen, wie mehrere Autos wiegen.
  - Quelle: NOAA Fisheries (wie oben): „push the trapped water out of their mouth with their tongue“, „up to 6 tons of krill a day“. ⚠ „Mehrere Autos“: rund 1,5 t je Auto, also 4 bis 6 t.

**Hinweise:** „Oft weit“ ist vorsichtig. Der Satz zur Zunge steht im Futter-Spiel, so wiederholt der Tierdetektiv den Hinweis nicht.

## 12. Großer Tümmler (`animal-common-bottlenose-dolphin`)

**Heute:** Hinweis „Ich lebe im Meer und kann mit Klicklauten und deren Echo Nahrung orten. Meine Gruppe kann sich trennen und später neu zusammenfinden.“ · Zuhause „Ozean“ · Futter „Fisch und Meerestiere“ (heute „Er frisst Fische, Tintenfische und Krebstiere.“).

- **Tierdetektiv (176):** Der Große Tümmler hört am Echo, wo ein Fisch schwimmt. Jedes Tier hat einen eigenen Pfiff, fast wie einen Namen. So finden sich Tiere wieder, wenn sich die Gruppe getrennt hat.
  - Quellen: NOAA Fisheries, https://www.fisheries.noaa.gov/species/common-bottlenose-dolphin (Echoortung); University of Texas Marine Science Institute, https://utmsi.utexas.edu/science-and-the-sea/radio-program/dolphin-signatures/ (Erkennungspfiff). ⚠ Wiederfinden mit dem Pfiff ist Forschungsstand mit Vorbehalt.
- **Zuhause (160):** Der Große Tümmler muss auch im Schlaf zum Atmen auftauchen. Darum schläft immer nur eine Hälfte seines Gehirns. Die andere Hälfte passt auf und denkt ans Atmen.
  - Quellen: University of Texas Marine Science Institute, https://utmsi.utexas.edu/science-and-the-sea/radio-program/sleeping-dolphins/; Smithsonian Magazine, https://www.smithsonianmag.com/smart-news/dolphins-sleep-with-only-half-their-brain-at-a-time-81426439/. ⚠ Keine Kartenquelle; ist „immer“ zu stark?
- **Futter (180):** Der Große Tümmler jagt oft zusammen mit anderen aus seiner Gruppe. Gemeinsam treiben sie Fische zu einem dichten Schwarm. Dann schwimmen sie nacheinander hindurch und schnappen zu.
  - Quelle: NOAA Fisheries (wie oben): „work together to herd fish into groups and then take turns charging through the school of fish to feed“.

**Hinweise:** „Delfine atmen Luft“ nicht genommen (Hauptfrage der Karte). „Tintenfische“ wegen der Sepia-Karte weggelassen.

---

## Übergreifende Beobachtungen

1. **Die heutige Auflösung bei Tierzuhause ist fast leer.** Keine der 12 Karten hat einen Fakt „Lebensraum“; das Spiel zeigt nur „Titel: Savanne“.
2. **Ratemuster bei den Fallen:** Gorilla, Futter: „Fleisch“ und „Fisch und Meerestiere“ auf Entdecker und Profi. Panda, Futter: Entdecker-Liste nur 3 Einträge, „Eukalyptusblätter“ in beiden Listen; Elefant und Orang-Utan führen „Vor allem kleine Fische“ zweimal. Eisbär, Zuhause: „Feuchte Wälder und Larvengewässer“ ist Fachsprache. Auf Entdecker wirken „Raupen: Seidenpflanzen; Falter: Nektar“ und „Korallenriffe mit Seeanemonen“ sehr gezielt auf andere Tiere zugeschnitten (für den `stufen-pruefer`).
3. **Tierdetektiv-Hinweise:** Tiger nennt vor allem Länder; Blauwal nennt die Lösung fast selbst („das größte heute lebende Tier“); Orang-Utan verrät sie mit „nur auf Borneo“ (Titel „Borneo-“).
4. **Rückmeldung nach falscher Antwort im Tierdetektiv** („Lebensraum: X. Nahrung: Y. … Eine einzelne Gemeinsamkeit reicht nicht.“) ist nicht im Kinderton (schon im BACKLOG).
5. **Quellen für die Karten:** Smithsonian Tiger, Smithsonian Orangutan, San Diego Zoo Lion, Australian Antarctic Program oder Animal Diversity Web (Kaiserpinguin), Smithsonian Ocean (Barten).
6. **Für die anderen Pakete:** keine Namen anderer Spieltiere, auch nicht über andere Namen; keine Sätze, die eine Zusatzfrage oder die Hauptfrage der Karte beantworten.

## Offen (Claude entscheidet)

- **Anfang der Texte:** Artikel ändert bei vier Titeln die Endung. Ein Test müsste „beginnt mit Der/Die/Das und enthält den Titel ohne Endung“ prüfen oder eine Liste von Anfängen haben; Alternative „Afrikanischer Savannenelefant: …“ wie heute. Empfehlung des Helfers: Artikel (vorgelesen natürlicher).
- **Kinderwörter:** „Winterruhe“ (Panda), „Mangroven“ (Tiger, im Text erklärt), „Stollen am Fußballschuh“ (Gepard): `kinder-redaktion`.
- **Quellen ohne Kartenquelle (⚠):** Hautfalte (Kaiserpinguin), Halbhirn-Schlaf und Pfiff (Tümmler), Robbenfett (Eisbär), Erklärung der Mangroven: besonders für den `fakten-pruefer`.
