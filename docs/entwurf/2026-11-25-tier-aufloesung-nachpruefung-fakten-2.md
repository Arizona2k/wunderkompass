## Faktenprüfung Endfassung Tier-Auflösungen, Paket 2 (A25–A48, Teil B, Teil D)

> Helferbericht (fakten-pruefer, opus/high), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

Ich habe keine Dateien geändert. Gelesen habe ich die Entscheidungen, den Bericht des karten-autors, `docs/entwurf/2026-11-25-tier-aufloesung-endfassung-texte.md` (Zeilen 265–528), meine Berichte A und B, `app/world-game-tier-fallen.json`, die Felder `diet` und `habitat` in `app/world-catalog.json` sowie `app/world-game-support.mjs` (Zeilen 205–230) und `app/world-game-habitats.mjs`. Die Quellen habe ich am 25.11.2026 selbst abgerufen, meist mit `curl`. Die Wildlife Trusts habe ich über WebFetch gelesen.

**Kurz:** In den geänderten Texten A25–A48 ist nichts falsch. Eine Stelle ist ungenau (Grasfrosch, Zuhause), dazu kommen einige Kann-Punkte. Fast alle ⚠-Stellen sind jetzt belegt. Mehr Arbeit machen die Fallen: Alle sechs „eigenen Funde“ des Autors bestätigen sich. Dazu kommen drei weitere Fallen, die laut Kartenquelle teilweise passen. Die neuen Auffüll-Paare selbst sind alle sicher falsch. Die festen Sätze in Teil D stimmen.

---

## Muss (Falle passt laut Quelle ganz oder teilweise oder ist ein Unterbegriff, also streichen)

**M1 Monarchfalter, Lebensraum, Entdecker: „Küste“**
- **Problem:** Die eigene Kartenquelle nennt Küsten als Überwinterungsort.
- **Beleg:** FWS, https://www.fws.gov/species/monarch-danaus-plexippus: „The western population overwinters in hundreds of groves … along the California coast“, „Monarchs living west of the Rocky Mountains … overwinter in California at sites along the Pacific Coast“. Außerdem: „non-migratory monarchs … in parts of Florida, the Gulf Coast and California“.
- **Ersatz:** streichen. Entdecker behält 3 Einträge: „Felsiger Meeresboden“, „Ozean“, „Antarktis“. Die Zwischenlösung für Profi („Ozean“, „Antarktis“) bleibt gültig.

**M2 Axolotl, Nahrung, Profi: „Früchte, Blätter und auch Insekten“**
- **Problem:** Insekten sind belegtes Futter des Axolotls.
- **Beleg:** San Diego Zoo, https://animals.sandiegozoo.org/animals/axolotl: „inhaling worms, mollusks, crustaceans, insect larvae, and even small fish“, „consume worms, tadpoles, insects, and small fish“. ADW, https://animaldiversity.org/accounts/Ambystoma_mexicanum/: „insectivore … insects“.
- **Ersatz:** streichen. Profi hat dann 3 Einträge: „Ameisen und Termiten“, „Vor allem kleine Säugetiere“ und die Zwischenlösung „Gräser und andere Pflanzen“. Bis zur Bestätigung „Nektar und Pollen“ aus Entdecker dazu. Neue Paare für später: „Pflanzen und Rinde“ (wie vom Autor vorgeschlagen) und „Pflanzliches Material“.

**M3 Europäischer Aal, Nahrung, Entdecker: „Früchte, Blätter und auch Insekten“**
- **Problem:** Der Autor nannte das „grenzwertig“. Laut zwei Quellen passt es teilweise.
- **Beleg:** WWT, https://www.wwt.org.uk/discover-wetlands/wetland-wildlife/species-factfiles/european-eel: „Small eels feed on insect larvae and worms“. ADW, https://animaldiversity.org/accounts/Anguilla_anguilla/: „Glass eels consume insect larvae“ und „European eels are reported to leap out of the water … and feed on terrestrial invertebrates“.
- **Ersatz:** streichen. Entdecker behält 4: „Vorwiegend Pflanzen“, „Eukalyptusblätter“, „Bambus“, „Nektar und Pollen“.

**M4 Großer Tümmler, Nahrung, Profi: „Kleine Tiere im Plankton“**
- **Problem:** Ein Unterbegriff der richtigen Antwort „Fisch und Meerestiere“, und der Tümmler frisst kleine Krebse.
- **Beleg:** NOAA, https://www.fisheries.noaa.gov/species/common-bottlenose-dolphin: „feed on a variety of prey, such as fish, squid, and crustaceans (e.g., crabs and shrimp)“.
- **Ersatz:** streichen. Profi hat dann 3 Einträge: „Vor allem kleine Säugetiere“, „Vor allem Insekten“ und die Zwischenlösung „Pflanzliches Material“. Zusätzlich „Bambus“ aus Entdecker. Neue Paare für später: „Als erwachsenes Tier vor allem Pflanzen“ (wie vom Autor vorgeschlagen) und „Ameisen und Termiten“.

**M5 Orca, Nahrung, Profi: „Kleine wirbellose Tiere“**
- **Problem:** Orcas fressen Tintenfische, und die sind wirbellos.
- **Beleg:** NOAA, https://www.fisheries.noaa.gov/species/killer-whale: „Transients … primarily eats marine mammals and squid“ und „diets … can include squid“.
- **Ersatz:** streichen. Profi behält 4: „Krill“, „Kleine Tiere im Plankton“, „Insekten“, „Ameisen und Termiten“. Krill und Plankton nennt NOAA nicht als Futter, beides ist also fachlich falsch für den Orca (siehe aber S5).

**M6 Erdmännchen, Nahrung, Profi: „Vor allem kleine Säugetiere“**
- **Problem:** Nagetiere stehen in der Kartenquelle.
- **Beleg:** San Diego Zoo, https://animals.sandiegozoo.org/animals/meerkat: „insects (the biggest part of their diet), spiders, snails, rodents, birds, eggs, lizards, and scorpions“.
- **Ersatz:** streichen. Profi hat dann 3 Einträge: „Meerestiere“, „Krill“, „Kleine Wassertiere“. Bis zur Bestätigung „Eukalyptusblätter“ aus Entdecker dazu. Neues Paar: „Nektar und Pollen“. Keine allgemeine Pflanzenfalle nehmen, siehe S3.

**M7 Schnabeltier, Nahrung, Profi: „Krill“ und „Kleine Tiere im Plankton“; Entdecker: „Algen und Zooplankton“**
- **Problem:** Die richtige Antwort ist „Kleine Wassertiere“, wie bei Axolotl und Aal. Dort wurde „Krill“ genau deshalb gestrichen (Fakten A: „Krill ist ein kleines Wassertier“). Dass Krill beim Schnabeltier bleibt, verstößt gegen die Unterbegriff-Regel. Plankton-Tiere und Zooplankton sind ebenfalls kleine Wassertiere.
- **Beleg:** NOAA, https://oceanservice.noaa.gov/facts/plankton.html: „Zooplankton include microscopic animals (krill, …)“. NSW, https://www.environment.nsw.gov.au/topics/animals-and-plants/native-animals/native-animal-facts/land-mammals/platypus: „Its diet consists mainly of riverbed animals such as insect larvae“.
- **Ersatz:** alle drei streichen. Profi hat dann 3 Einträge: „Ameisen und Termiten“, „Fisch und Meerestiere“, „Vor allem kleine Säugetiere“. Bis zur Bestätigung „Bambus“ aus Entdecker dazu, neues Paar „Pflanzen und Rinde“. Entdecker behält 4.
- Nebenbei: Abschnitt 5 nennt „Schnabeltier, Igel, Kurzschnabeligel“ als Tiere, bei denen Krill bleibt. Die Entscheidung nennt aber „Igel, Feuersalamander und Schnabeltier“.

**M8 Afrikanischer Strauß, Nahrung, Entdecker: „Vor allem kleine Säugetiere“**
- **Problem:** Es ist dasselbe Zitat, mit dem „Fleisch“ beim Strauß gestrichen wurde. Auf Entdecker muss eine Falle deutlich falsch sein.
- **Beleg:** San Diego Zoo, https://animals.sandiegozoo.org/animals/ostrich: „they also munch on insects, snakes, lizards, or rodents that come within reach“.
- **Ersatz:** streichen. Entdecker behält 3: „Meerestiere“, „Krill“, „Vor allem kleine Fische“.

**M9 Waschbär, Nahrung, Entdecker und Profi: „Vor allem kleine Säugetiere“** (eigener Fund)
- **Beleg:** ADW, https://animaldiversity.org/accounts/Procyon_lotor/: „Crayfish, insects, rodents, frogs, fish, and bird eggs are all possible components of a raccoon's diet“, dazu „Animal Foods: mammals“.
- **Ersatz:** aus beiden Listen streichen. Entdecker behält 4. Profi hat dann 3 („Algen und Zooplankton“, „Ameisen und Termiten“, „Krill“). Bis zur Bestätigung „Bambus“ aus Entdecker dazu, neues Paar „Nektar und Pollen“.

---

## Soll

**S1 Walhai, Nahrung, Entdecker: „Als erwachsenes Tier vor allem Pflanzen“** (alte Falle; der Autor hat das Algen-Thema mit ⚠ angesprochen)
- **Problem:** Unter Fachleuten ist das strittig. Eine Studie in der Fachzeitschrift Ecology von 2022 nennt Pflanzenkost einen großen Teil der Nahrung.
- **Beleg:** Meekan et al. 2022, Ecology, doi:10.1002/ecy.3818 („The world's largest omnivore is a fish“, https://ui.adsabs.harvard.edu/abs/2022Ecol..103E3818M). Science News, https://www.sciencenews.org/article/whale-shark-fish-largest-omnivore-skin-meat-plants: „plant material in fact makes up a very large part of their diet“. Der Widerspruch steht im selben Artikel (Hueter: „doesn't mean that whale sharks are true omnivores“).
- **Ersatz:** Nach dem Maßstab „im Zweifel streichen“ streichen. Entdecker behält 4. Die Wahl des Autors für Profi („Nektar und Pollen“, später „Raupen: Seidenpflanzen; Falter: Nektar“) ist richtig.

**S2 Krill bei Braunbrustigel und Feuersalamander (Profi)**
- **Problem:** Die richtige Antwort „Kleine wirbellose Tiere“ umfasst Krill rein logisch. Das ist derselbe Fall wie beim Axolotl. Laut Entscheidung bleibt Krill hier bewusst, weil Meer und Land verschieden sind. Fachlich ist Krill für beide Tiere sicher falsch. Mit der Unterbegriff-Regel im Auftrag verträgt sich das aber nicht.
- **Empfehlung:** Einheitlich streichen.
  - Beim Feuersalamander bleibt Profi dann bei 4, wenn das neue Paar „Fisch und Meerestiere“ dazukommt.
  - Beim Igel fällt Profi auf 3. Bis zur Bestätigung „Nektar und Pollen“ aus Entdecker dazu, neues Paar „Pflanzen und Rinde“.
  - Beim Kurzschnabeligel (Antwort „Ameisen und Termiten“) kann Krill bleiben.

**S3 Erdmännchen, richtige Antwort „Vor allem kleine Tiere“**
- **Problem:** Logisch sind „Krill“ und „Kleine Wassertiere“ (Profi) Unterbegriffe davon. Fachlich frisst das Erdmännchen beides nicht. Auf Entdecker ist „Pflanzen“ ein Grenzfall: Wikipedia „Meerkat“ (nur als Einstieg, nach Skinner & Chimimba) schreibt „it can additionally feed on … plants and seeds“. Die Primärquelle habe ich nicht gelesen.
- **Empfehlung:** die Antwort schärfen (BACKLOG „Fallen schärfen“, 2-K3). Bis dahin „Pflanzen“ auf Entdecker streichen oder belegt verwerfen.

**S4 Katta, Nahrung, Entdecker: „Fische, Vögel und auch tote Tiere“ und „Vor allem kleine Säugetiere“** (eigener Fund)
- **Problem:** Ein Grenzfall. Der eigene Futter-Text A29 sagt jetzt „Dann fängt er öfter Insekten und andere kleine Tiere.“
- **Beleg:** Duke Lemur Center, https://lemur.duke.edu/discover/meet-the-lemurs/ring-tailed-lemur/: „Occasionally they will also eat insects and small vertebrates (especially in the dry season …)“.
- **Ersatz:** Nach „im Zweifel streichen“ beide streichen. Entdecker behält 3: „Kleine Tiere im Plankton“, „Kleine Wassertiere“, „Raupen: Seidenpflanzen; Falter: Nektar“. Dieselbe Logik führte zur Streichung beim Erdmännchen („Fische, Vögel …“).

**S5 Sehr weite richtige Antworten** (Hinweis an Claude, nicht in diesem Schritt lösbar)
- **Problem:** Bei „Kleine Tiere“ (Grasfrosch), „Kleine Beutetiere“ (Seepferdchen), „Je nach Gruppe verschiedene Beutetiere“ (Orca) und „Verschiedene tierische und pflanzliche Nahrung“ (Rotfuchs, Waschbär) ist jede Tierfalle logisch ein Unterbegriff. Beispiel Rotfuchs, Entdecker „Kleine Wassertiere“: Die Wildlife Trusts (https://www.wildlifetrusts.org/wildlife-explorer/mammals/red-fox) schreiben „small mammals, birds, frogs, worms“.
- **Empfehlung:** Der Autor hat recht, beim Grasfrosch kein neues Tier-Paar zu bilden. Das gehört zu BACKLOG 25 (2-K3). Die Regel im Auftrag ist dort heute nicht eingehalten.

**S6 Grasfrosch / Zuhause (A41), Satz 2: „Den Winter verbringt er oft im Schlamm am Teichgrund.“**
- **Urteil:** ungenau. Laut beiden Quellen ist das nur einer von mehreren Orten.
- **Beleg:** Wildlife Trusts, https://www.wildlifetrusts.org/wildlife-explorer/amphibians/common-frog: „In winter, they hibernate in pond mud or under log piles“ und „Some might even spend the winter in the mud at the bottom of a pond“. Woodland Trust (Kartenquelle): „resting in the mud at the bottom of ponds, under piles of logs or in compost heaps“.
- **Ersatz:** „Den Winter verbringt er im Schlamm am Teichgrund oder unter Holzstapeln.“

---

## Kann

- **Walross / Zuhause (A31), Satz 2:** „weil weniger Blut hindurchfließt“ ist bei der University of Alaska eine Vermutung: „This color change may indicate that the circulatory output to the skin is altered“ (https://gi.alaska.edu/alaska-science-forum/why-does-walrus-blush). Die Physiologie dahinter ist üblich, als Kindersatz geht er. Genauer wäre: „Seine Haut wird dort blass. Wahrscheinlich fließt dann weniger Blut hindurch.“
- **Feuersalamander / Tierdetektiv (A40), Satz 3:**
  - „Sie haben gelbe Flecken oben an den Beinen“ stimmt für die Larven. NABU Feldherpetologie: „Die Larven lassen sich … anhand der gold-gelben Flecke an den Oberarmen und Oberschenkeln unterscheiden“ (https://nabu-lfa-feldherpetologie.jimdoweb.com/tiergruppen/amphibien/feuersalamander/).
  - „Sie“ könnte ein Kind aber auf den erwachsenen Salamander beziehen. Klarer: „Die Larven erkennt man an gelben Flecken oben an den Beinen.“
  - „ohne große Fische“: Die LfU sagt „raubfischfreie“ Bäche, auch kleine Forellen fressen Larven. Möglich: „kühle Bäche, in denen keine Fische jagen“.
- **Schleiereule / Tierdetektiv (A35):** Für den Alltagsversuch gibt es jetzt einen Beleg. Science Buddies (Scientific American), https://www.sciencebuddies.org/stem-activities/ears-do-their-design-size-and-shape-matter: „cupped your hand behind your ear, hoping to hear the sound better“ und „Bigger funnels (like the ear trumpet or hand cupping) collect more sound waves“. Die Wirkung hängt von der hohlen, nach vorn gewölbten Hand ab, darum genauer: „Leg mal die hohlen Hände hinter die Ohren“.
- **Gefleckte Weinbergschnecke / Tierdetektiv (A45):** „gleitet … wie auf einer Rutsche“ klingt nach passivem Rutschen. Die Schnecke kriecht aber mit Muskelwellen; der Schleim dient als Gleitmittel (NHM: „keeps their slime flowing as a lubricant“). Möglich: „Auf ihrem Schleim kriecht sie langsam voran. Er macht den Weg glatt.“
- **Grasfrosch / Zuhause (A41), Satz 1:** „im feuchten Gras“ steht so in keiner der Quellen. Die Wildlife Trusts sagen „tussocky grassland“, der Woodland Trust „gardens, meadows and woodland“. Möglich: „im hohen Gras“.
- **Afrikanischer Strauß / Tierdetektiv (A37):** Der Vergleich trägt. San Diego Zoo: „sprint in short bursts up to … 70 kilometers per hour … maintain a steady speed of … 50 kilometers per hour“. 70 km/h liegt über den 50 km/h innerorts. Genauer wäre „kann kurz schneller rennen“.
- **Monarchfalter, neues Paar „Arktische Küsten und Meere“:** sicher falsch. Direkt nach dem Streichen von „Küste“ (M1) wäre ein Eintrag ohne das Wort „Küste“ für Kinder klarer, etwa nur „Korallenriffe mit Seeanemonen“ und dazu „Felsiger Meeresboden“ aus Entdecker. **Nicht** „Gebirge“ nehmen: FWS nennt Überwinterung „in mountainous regions of central Mexico, at an elevation of about 8,000 to nearly 12,000 feet“.
- **Grenzfälle „Ameisen und Termiten“** bei Axolotl (Profi; San Diego Zoo: „insects“), Waschbär (Profi; ADW: „insects“) und Aal (Profi; ADW: „terrestrial invertebrates“): Dass diese Tiere Ameisen oder Termiten fressen, ist nicht belegt. Die Quellen nennen aber Insekten ohne Einschränkung. Ich halte das für vertretbar und nicht für zwingend.

---

## Teil B, Auffüll-Paare (Tabelle „Auffüllen“): Ergebnis

Alle Zwischenlösungen aus Entdecker und alle neuen Paare sind laut Quelle sicher falsch und kein Unterbegriff der richtigen Antwort:
- **Jaguar**, „Korallenriffe mit Seeanemonen“ und „Küstennaher Meeresboden“: San Diego Zoo, „typically live near water … swim in rivers and streams“. Am Meeresboden lebt er nicht.
- **Chamäleon**, „Felsiger Meeresboden“ und „Arktische Küsten und Meere“: ADW nennt „savannas, riparian habitats, forests and grasslands … arboreal“.
- **Monarchfalter**, „Ozean“ und „Antarktis“ (Zwischenlösung) sowie „Korallenriffe …“ und „Arktische Küsten …“: richtig, siehe aber Kann.
- **Tümmler, Krake, Sepia, Hummer**, „Als erwachsenes Tier vor allem Pflanzen“, „Pflanzliches Material“, „Pflanzen und Rinde“, „Gräser und andere Pflanzen“, „Nektar und Pollen“: Belege sind NOAA (Fisch, Tintenfisch, Krebse), ADW Octopus („feed primarily on gastropods and bivalves“), MarLIN Sepia („Brachyuran crabs and demersal fish … minor amounts of amphipods“) und Wildlife Trusts Hummer („molluscs, sea urchins and other smaller crustaceans“).
- **Axolotl**, „Gräser und andere Pflanzen“ und „Pflanzen und Rinde“: richtig. Die Liste muss aber wegen M2 weiter aufgefüllt werden.
- **Walhai**, „Nektar und Pollen“ und „Raupen: Seidenpflanzen; Falter: Nektar“: richtig. Georgia Aquarium: „zooplankton, specifically sergestid shrimps and fish eggs, as well as krill, jellies, copepods, coral spawn“.
- **Feuersalamander**, „Pflanzen und Rinde“ und „Fisch und Meerestiere“: richtig (NABU: kleine wirbellose Tiere).
- **Aal**, „Eukalyptusblätter“ und „Pflanzen und Rinde“: richtig.
- **Grasfrosch**, „Bambus“, kein neues Paar: richtig so (siehe S5).

**Die eigenen Funde des Autors aus Abschnitt 5:**
- Axolotl: bestätigt (M2)
- Aal: bestätigt (M3)
- Monarchfalter „Küste“: bestätigt (M1)
- Tümmler: bestätigt (M4)
- Erdmännchen: „Vor allem kleine Säugetiere“ passt teilweise (M6), „Krill“ und „Kleine Wassertiere“ siehe S3
- Orca: Krill und Plankton sind fachlich falsch und können bleiben, aber „Kleine wirbellose Tiere“ passt teilweise (M5)

## Teil D, feste Sätze: Ergebnis

- **„Deine Wahl ist Meereis ganz im Süden der Erde. Lebt dieses Tier dort?“** stimmt. NSIDC, https://nsidc.org/learn/parts-cryosphere/sea-ice/quick-facts-about-sea-ice: „Antarctica is a continent surrounded by vast oceans. Sea ice can spread out more freely around Antarctica“. Laut `app/world-game-habitats.mjs` kommt der Satz nur bei Landtieren (Gruppe `land`). Beim Eisbär führt er also nicht in die Irre.
- **Wüste, Baumkronen, Korallenriff:** sachlich richtig für die Gruppen, bei denen sie vorkommen (`water`, `water-edge`, `land`).
- **„Deine Antwort passt zu einem anderen Tier: X“** stimmt, denn der Code wählt X genau dann, wenn dessen Text gleich der Falle ist.
- **Monarchfalter, Sonderform „Raupen fressen Seidenpflanzen, Falter Nektar“:** stimmt. FWS: „lay eggs on milkweed plants as that is the only food the caterpillars can eat“ und „nectar of many flowers“.

---

## Geprüft und in Ordnung (Quelle am 25.11. selbst geöffnet)

- **Die ⚠-Stellen aus Abschnitt 2, soweit sie in A25–A48 liegen:**
  - **Chamäleon, Futter:** ADW: „insectivores … Common prey items include flies, hymenopterans, true bugs, crickets and grasshoppers, and beetles“. Das trägt „vor allem Insekten“.
  - **Chamäleon, Tierdetektiv und Zuhause:** „tongues, about as long as their bodies … from relatively large distances“, „Adults generally sleep in the same tree every night“, „Females dig long and deep burrows“.
  - **Papageitaucher, Tierdetektiv:** National Geographic Kids: „they use their webbed feet to steer, much as a boat uses a rudder“. Damit ist das Lenken mit den Füßen belegt; das Zitat in der Quellenangabe ergänzen.
  - **Papageitaucher, Futter:** Die Audubon-Seite https://www.audubon.org/field-guide/bird/atlantic-puffin war heute erreichbar: „carrying a dozen small fish lined up in its bill“.
  - **Papageitaucher, Zuhause:** National Geographic Kids: „often uses the same burrow they used the year before“. RSPB: „greyscale getup … shed their colourful beaks“.
  - **Hummer, Tierdetektiv und Futter:** Wildlife Trusts: „deep blue“, „only turn red when cooked“, „heat of cooking breaks the bond, releasing the red pigment“, „one used for crushing and one for tearing“. Die Knackschere ist damit belegt.
  - **Aal, Tierdetektiv:** WWT: „bellies become yellow … yellow eels“, „silver eels as they migrate back to the Sargasso Sea“.
  - **Strauß, Tierdetektiv:** „the only birds that have only two toes: all other birds have three or more“.
  - **Kurzschnabeligel, Zuhause, Satz 2:** Das ist eine vertretbare Folgerung. Australian Museum: „forests and woodlands, heath, grasslands and arid environments“.
  - **Walross, Zuhause:** siehe Kann.
  - **Schleiereule, Tierdetektiv:** jetzt belegt, siehe Kann.
- **Weitere geänderte Texte:**
  - **Schnabeltier, alle drei:** NSW mit „eyes and ears close“, „electrical discharges from its prey“, „cheek pouches“, „insect larvae“, „dug into the riverbank“; dazu San Diego Zoo.
  - **Okapi, Tierdetektiv und Futter:** „partial sunlight“, „follow their mother“, „strip the buds and young leaves“.
  - **Erdmännchen, alle drei:** „different calls for land predators and for those coming from the air“, „burrows dug by other wildlife“, „sun's glare“, „long … claws“.
  - **Katta, Zuhause:** „arid, open areas and forests“, „40 percent of their time on the ground“, Sonnenbad „before they forage“.
  - **Walross, Tierdetektiv und Futter:** ADF&G mit „pull themselves onto rocks or ice“, „the walrus with smaller tusks will move away“, „clams, snails, worms“, „suck out the soft parts“. Die Formel „ohne Wirbelsäule … wirbellos“ ist richtig.
  - **Rotfuchs, Zuhause:** Wildlife Trusts mit „scent glands on their feet to mark well-used trails“, „not fussy eaters“, „towns and the countryside“.
  - **Waschbär, Tierdetektiv und Zuhause:** ADW mit „black mask“, „commonly associated with washing their food“, „introduced to parts of … Europe“.
  - **Grasfrosch, Tierdetektiv und Futter:** Woodland Trust mit „adapt their skin colour to blend in“, „breathe through their skin“, „long, sticky tongue“, „tadpoles feed on algae“.
  - **Clownfisch, Tierdetektiv:** Australian Museum: „protective agent in the mucus that coats their bodies“.
  - **Seepferdchen, alle drei:** Wildlife Trusts mit „female transfers the eggs to the male“, „brood pouch“, „pretty poor swimmers“, „don't have teeth“. MarLIN mit „hold on in strong currents“, „remain motionless until a small animal such as a mysid shrimp passes“.
  - **Sepia, Futter:** MarLIN: „two elongated tentacles … quickly elongated“, Krabben und Fische.
  - **Igel, Futter, und die wirbellos-Formel bei Igel, Feuersalamander und Hummer:** fachlich richtig (alle genannten Beutetiere sind wirbellos).

## Nicht oder nur eingeschränkt geprüft

- **Heute nicht neu geöffnet** (Bestätigung aus meinem Bericht B vom selben Tag): Smithsonian Biber, Hedgehog Street, BHPS, BTO, Barn Owl Trust (Brutplätze), RSPB Eisvogel, NABU Euskirchen, LfU Bayern, Wildlife Trusts Sepia, NHM Schnecken, Cambridge (Erdmännchen-Junge), NPS und MDC (Rotfuchs, Tierdetektiv). Diese Texte sind laut Bericht nur sprachlich geändert, oder die Aussage wurde dort schon bestätigt.
- **Wildlife Trusts** (Hummer, Fuchs, Frosch, Seepferdchen): nur über WebFetch gelesen, die Zitate sind also nicht Wort für Wort am Seitentext geprüft.
- **Walhai als Allesfresser:** Die Seite der Forschungsbehörde AIMS lieferte 503. Gelesen habe ich die Zusammenfassung der Studie (ADS) und Science News, nicht den Volltext der Studie.
- **Erdmännchen und Pflanzen:** nur Wikipedia als Einstieg, die Primärquelle nicht gelesen.
- **Profi „Regenwald“ beim Monarchfalter und „Blütenreiche Landschaften“ bei Chamäleon und Jaguar:** nicht neu geprüft (alte Fallen vom 24.11.).
- **Alle anderen Fallen-Paare der 24 Tiere** außerhalb der genannten Funde: nicht neu geprüft.
- **Nicht meine Aufgabe:** Zeichen- und Wortzahl, Ton, Ratemuster und Mindestzahlen über das hier Genannte hinaus (Sache von `kinder-redaktion` und `stufen-pruefer`).

**Quellenlage:** gut. Fast alles stützt sich auf Zoos, Behörden, Museen und Fachverbände (San Diego Zoo, Smithsonian, Duke Lemur Center, NSW, ADF&G, FWS, NOAA, NHM, MarLIN, ADW, WWT, RSPB, Audubon, Barn Owl Trust, NABU). National Geographic Kids und Science Buddies sind Kinder- bzw. Lernseiten, für die beiden Aussagen (Füße zum Lenken, Hand hinter dem Ohr) reichen sie. Wikipedia diente nur als Einstieg.

Arbeitsdateien (nur heruntergeladene Quelltexte, kein Bericht): `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/fp2/`
