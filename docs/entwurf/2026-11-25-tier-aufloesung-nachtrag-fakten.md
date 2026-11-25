# Faktenprüfung: Nachtrag zu den Tier-Auflösungen (T1–T30, K1–K5) und neue Fallen

> Helferbericht (fakten-pruefer, opus), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

Ich habe keine Dateien geändert. Gelesen habe ich den Nachtrag, endfassung-2.json (die 32 geänderten Texte habe ich per Skript gegen endfassung.json abgeglichen), karten-2.json, nachpruefung-fakten-2.md, die drei Karten in `app/world-catalog.json` und die Fallen in `…/scratchpad/wt-tier/app/world-game-tier-fallen.json`. Die Quellen habe ich am 25.11.2026 selbst geöffnet, fast alle mit `curl` als Rohtext. Ausnahmen nenne ich jeweils.

**Kurz:** Kein Text ist falsch, also gibt es keinen Muss-Punkt. Ein Sollte-Punkt betrifft den Text (T21), einer die neuen Fallen (Giraffe „Nektar und Pollen“). Dazu kommen einige Kann-Punkte. Die Zitate des Autors habe ich alle im Wortlaut wiedergefunden.

---

### Muss
Keiner.

### Sollte

**T21 Echter Clownfisch, Tierdetektiv: „Sonst brennen die Fangarme wie bei einer Qualle.“**
- **Urteil:** stimmt mit Vorschlag.
- **Was stimmt:** Die Verwandtschaft ist belegt. Beide Tiere nesseln.
  - aqua.org/explore/animals/anemones: „they're actually invertebrates related to corals and jellies“
  - nationalgeographic.com/animals/invertebrates/facts/sea-anemones: „A close relative of coral and jellyfish, anemones are stinging polyps“
  - Australian Museum (…/why-dont-anemonefishes-get-stung/): „protective agent in the mucus that coats their bodies“
- **Das Problem:** „brennen wie bei einer Qualle“ vergleicht die Stärke. Die ist sehr verschieden, und Kinder könnten denken, eine Anemone im Aquarium tue so weh wie eine Qualle. Eine Quelle zur Stärke habe ich nicht gesucht. Das ist also eine Einschätzung zur Fehlvorstellung, kein Quellenbefund.
- **Vorschlag (146 Zeichen):** „Der Echte Clownfisch hat eine Schleimschicht auf der Haut. Sie schützt ihn vor den Fangarmen seiner Seeanemone. Die haben Nesseln wie eine Qualle.“
  - Damit ist die Ausstattung verglichen, nicht die Stärke.
  - Den Hinweis auf die Hauptfrage („Pflanze?“) prüft der stufen-pruefer. Hier bleibt er gleich.

### Kann

**T9 Bengaltiger, Futter: „hält seine Beute oft mit einem Biss in den Nacken fest“**
- **Urteil:** stimmt mit Einschränkung.
- WWF (wwf.de/themen-projekte/artenlexikon/bengal-tiger): „gezielten Biss in den Nacken oder in die Kehle des Beutetieres, abhängig von dessen Größe. Anschließend schleift der Tiger seine Beute an einen sicheren Ort“
- San Diego Zoo (animals.sandiegozoo.org/animals/tiger): „grab its prey by the neck“
- Smithsonian (nationalzoo.si.edu/animals/tiger): „finish the kill by breaking or biting the neck“
- „Nacken“ ist also gedeckt. Die Kehle fehlt, und für „oft“ gibt es keine Zahl.
- **Vorschlag, genauer (13 Wörter):** „Der Bengaltiger hält seine Beute mit einem Biss in Nacken oder Kehle fest.“ Der Rest bleibt, dann hat der Text 160 Zeichen.
- „Hält fest“ statt „tötet“ ist eine vertretbare Abschwächung für Kinder.

**T22 Walross, Zuhause**
- **Urteil:** stimmt, die Vermutung ist richtig gefasst.
- University of Alaska Fairbanks (gi.alaska.edu/alaska-science-forum/why-does-walrus-blush): „The skin of walruses becomes pallid when it is exposed to cold air or water and changes to pink when exposed to warmer ambient temperatures. This color change may indicate that the circulatory output to the skin is altered to control their total body heat loss.“
- **Nur formal:** Satz 2 hat 14 Wörter, wenn man den Doppelpunkt nicht als Satzgrenze zählt.
- **Vorschlag, falls gewünscht (160 Zeichen):** „Das Walross wird im eiskalten Wasser blass. Forscher vermuten: Dann fließt weniger Blut durch die Haut. Das spart Wärme. An Land in der Wärme wird es wieder rosa.“
- Ebenso gezählt hat T4 (Giraffe), Satz 1, 15 Wörter. Fachlich stimmt T4 (siehe unten).

**T15 Grasfrosch, Zuhause: „Wiesen mit dichtem Gras“**
- **Urteil:** stimmt mit Einschränkung.
- Woodland Trust (woodlandtrust.org.uk/…/common-frog/): „in gardens, meadows and woodland throughout the remainder of the year“ und „During the winter months, common frogs spend their time resting in the mud at the bottom of ponds, under piles of logs or in compost heaps.“
- Wildlife Trusts, nur über WebFetch (siehe unten): „feeding in woodland, gardens, hedgerows and tussocky grassland“, „In winter, they hibernate in pond mud or under log piles.“ und „Some might even spend the winter in the mud at the bottom of a pond.“
- „Tussocky“ heißt bultig, in Horsten wachsend. „Dicht“ passt einigermaßen, „hoch“ träfe das Bild etwas besser.
- **Vorschlag (119 Zeichen):** „Der Grasfrosch lebt gern auf Wiesen mit hohem Gras. Den Winter verbringt er ganz unten im Teich oder unter Holzstapeln.“
- Der Wintersatz stimmt so.

**T27 Katta, Zuhause**
- **Urteil:** stimmt. „Oft“ ist bei 40 Prozent vertretbar, denn die Quelle betont es gerade als Besonderheit.
- Smithsonian (nationalzoo.si.edu/animals/ring-tailed-lemur): „Unlike most other lemurs, ringtails spend 40 percent of their time on the ground. They move quadrupedally“
- Ebenda: „arid, open areas and forests“ und „with their bellies toward the sun … warming them up before they forage“
- Kleine Unschärfe: „Bevor er frisst“ klingt nach jeder Mahlzeit.
- **Vorschlag (165 Zeichen):** Satz 3 wird zu „Zum Aufwärmen streckt er seinen Bauch der Sonne entgegen.“

**K3 Licht, `more[0]` und `stages[2].text`**
- **Urteil:** stimmt.
- Science Museum Group (collection.sciencemuseumgroup.org.uk/objects/co42487/swan-electric-lamp): „Early carbon and rod filament incandescent electric lamp, by Sir Joseph Wilson Swan, England, 1878-1879“. Das trägt „um 1879“ und „Stab aus Kohle“.
- NPS-Kinderseite (home.nps.gov/edis/learn/kidsyouth/the-electric-light-system-phonograph-motion-pictures.htm): „The bulb burned at least 13 hours … Edison and his muckers had a long lasting light bulb.“
- NPS-Biografie (nps.gov/edis/learn/historyculture/edison-biography.htm): „In September 1882, the first commercial power station, located on Pearl Street in lower Manhattan, went into operation“
- **Hinweis:** Die Gegenüberstellung „Swan: frühe Lampen“ und „Edison: Lampen, die lange leuchteten“ betont Edison leicht. Swan baute ab etwa 1880 ebenfalls haltbare Lampen. Das habe ich heute nicht belegt, also kein Änderungszwang. Der Text bleibt neutral genug, weil er mit „Viele Menschen arbeiteten daran“ beginnt.

**K5 Licht, `question.why`**
- **Urteil:** stimmt.
- NPS-Kinderseite (URL wie K3): „Most Americans still lit their homes with gas light and candles for another fifty years.“
- Gaslampen und Kerzen geben Licht durch Flammen, das ist richtig.
- Zwei kleine Unschärfen:
  - Öl- und Petroleumlampen waren damals ebenfalls häufig. „Etwa“ deckt das ab.
  - „Dann bauten … elektrische Lampen“ übergeht ältere elektrische Bogenlampen. Für diese Aussagen habe ich heute keine Quelle gelesen.
- **Vorschlag, genauer (156 Zeichen):** „Früher kam abends das Licht meist aus Flammen, etwa von Kerzen, Öl- und Gaslampen. Dann bauten Joseph Swan, Thomas Edison und andere elektrische Glühlampen.“

**T8 Seepferdchen, Futter**
- **Urteil:** stimmt mit Einschränkung.
- UTMSI (utmsi.utexas.edu/…/seahorses-use-their-heads-to-their-advantage/) sagt:
  - „Seahorses feed on copepods, nearly microscopic crustaceans that can bolt from predators“
  - „barely moves the water in front of its mouth. The copepods therefore cannot detect water movements“
  - „swiftly jerks its head up and sucks in the copepod“
  - „This 'pivot' feeding is used by various species of seahorses, pipefish and sea dragons“
- Gemessen wurde nur am Zwergseepferdchen („3-D holographic images of dwarf seahorses“). Den Ruck mit dem Kopf nennt die Quelle ausdrücklich für mehrere Arten. Dass der Kopf kaum Wasser bewegt, erklärt sie als Eigenschaft des Seepferdchenkopfs, belegt ist es aber nur an einer Art. Für einen Kindertext ist das tragbar.
- „Welle“ als Wort für die Wasserbewegung vor dem Maul ist eine zulässige Vereinfachung. „Zuckt hoch“ entspricht genau „jerks its head up“.

---

### Geprüft und in Ordnung (stimmt)

- **T1:** UCMP (ucmp.berkeley.edu/…/grasslands.php): „Savanna is grassland with scattered individual trees.“
- **T2:**
  - Smithsonian (nationalzoo.si.edu/animals/giant-panda): „A newborn cub weighs 3-5 ounces“ (85–142 g, also passt die Tafel zu 100 g) und „Pink, hairless, and blind“
  - San Diego Zoo: „born pink, covered in short white hair“. „Fast nackt“ löst den Widerspruch richtig.
- **T3:** Toronto Zoo (torontozoo.com/animals/Axolotl): „for the aquarium trade, they are being bred in white (albino) and golden colours“. „Helle, fast weiße“ deckt weiße und goldene Tiere ab. Das Wort „Albino“ steht nicht im Text, also gibt es kein Problem.
- **T4:** San Diego Zoo: „each one can be over 10 inches (25.4 centimeters) long!“ und „It is thought that the dark color of their tongue protects them from getting sunburned“
- **T5:** Australian Antarctic Program: „several layers of scale-like feathers“
- **T6:**
  - NOAA (oceanservice.noaa.gov/facts/mangroves.html): „most mangroves get flooded at least twice per day“
  - WWF (Seite wie T9) nennt für Bengaltiger in Bangladesch „Sümpfen und Mangrove[n]“.
  - Eine Quelle speziell zur täglichen Flut in den Sundarbans kenne ich nur aus einer Suchzusammenfassung, nicht im Rohtext. Die UNESCO-Seite gab 403.
  - „Bei Flut“ ist trotzdem gut gedeckt. „Salzig“ ist vereinfacht, denn das Wasser ist je nach Jahreszeit brackig bis fast süß. Für Kinder geht das.
- **T7:** Nur der Satzbau ist geändert, die Fakten sind unverändert.
- **T10:** UTMSI (…/dolphin-signatures/): „the whistles really are like names“ und „Baby dolphins create their own signatures … continue using these signatures throughout their lives“
- **T11:** ADW (animaldiversity.org/accounts/Chamaeleo_chamaeleon/): „At night, they move to areas with denser vegetation which protects them from wind“ und „Females dig long and deep burrows in the ground to lay their eggs“
- **T12:**
  - NPS (nps.gov/articles/species-spotlight-red-fox.htm): „If the snow is deep it lands head first“
  - MDC (mdc.mo.gov/node/275020): „acts like a blanket on chilly nights“
- **T13:** Woodland Trust: „able to adapt their skin colour to blend in“ und „Frogs can breathe through their skin“
- **T14:** San Diego Zoo (…/jaguar): „rosettes, with an irregular broken border and often a spot in the center“ und „Usually it is jaguars that are found in darker rainforest areas that are sometimes black.“
- **T16:** Nur sprachlich geändert.
- **T17a:** Wildlife Trusts (…/marine/crustaceans/lobster), über WebFetch: „Common lobsters live in crevices and excavated hidey-holes amongst rocks“ und „They hide during the day and come out to feed at night.“
- **T17b:** NHM (nhm.ac.uk/discover/snails-and-slugs.html):
  - „hiding under bricks and behind pots or resting in window boxes and compost heaps“
  - „retreat into their shells if a shadow falls on them“
  - „seal up the openings to their shells with a mucus plug“
- **T18:**
  - San Diego Zoo (…/meerkat): „usually live in burrows dug by other wildlife, such as ground squirrels. These burrows have an average of 15 entrance and exit holes“ und „Dark patches around their eyes cut down on the sun's glare“
  - „Erdhörnchen“ ist die richtige deutsche Gruppe. de.wikipedia „Erdhörnchen“ (nur als Einstieg): „Die Erdhörnchen (Xerinae) sind eine Unterfamilie der Hörnchen“. Das Kap-Borstenhörnchen im südlichen Afrika steht dort in der Kategorie Erdhörnchen und teilt seine Baue mit Erdmännchen.
- **T19:** San Diego Zoo (…/lion): „Adult male lions … usually have an impressive mane“ und vom Brüllen: „It identifies individuals … and lets other lions know of the pride's domain.“
- **T20:** San Diego Zoo (…/koala): „On hot days, koalas select the coolest trees“, „On cooler days, koalas are more likely to rest farther away from the trunk“ und „sharp claws to dig into bark“
- **T23:**
  - LfU Bayern (PDF): „kühle saubere und raubfischfreie kleine Bäche“ und „Feuersalamanderlarven vor allem von Raubfischen“
  - NABU LFA Feldherpetologie: „gold-gelben Flecke an den Oberarmen und Oberschenkeln“
- **T24:** Science Buddies: „cupped your hand behind your ear, hoping to hear the sound better“ und „Bigger funnels (like the ear trumpet or hand cupping) collect more sound waves“
- **T25:** NHM: „acts not only as an adhesive but also as a barrier that prevents dehydration“ und „move at a slow speed, which keeps their slime flowing as a lubricant“. „Er macht den Weg glatt“ ist eine tragbare Vereinfachung, obwohl der Schleim auch klebt.
- **T26a:** San Diego Zoo (…/ostrich): „sprint in short bursts up to 43 miles per hour (70 kilometers per hour)“. 70 km/h liegen über den 50 km/h in der Stadt, und „für kurze Zeit“ ist genau.
- **T26b:** Ebenda: „the largest eye of any land animal“, „With their long necks and keen vision, they can see for great distances“ und „Ostriches live in groups, which helps with defense“
- **T28:** Monterey Bay Aquarium (…/carpet-anemone): „The anemone's stinging tentacles keep predators at bay.“
- **T29:** Nur gestrichen, der Rest ist unverändert.
- **T30:**
  - BHPS (britishhedgehogs.org.uk/hibernation/): „their heart rate decreases considerably from approximately 190 per minute to a faint 20 per minute“
  - Wildlife Trusts (…/mammals/european-hedgehog), über WebFetch: „dropping both their body temperature and heart rate to save energy“ und „They survive on their stored fat until spring“
- **K1:** NDB (deutsche-biographie.de/gnd118509225.html): „erhielt der Erfinder für seinen Wagen das deutsche Reichspatent Nr. 37 435“. Die NDB nennt dazu den 26.1.1886. Für „Patent von 1886“ ist das Datum egal.
- **K2:**
  - TK Elevator (tkelevator.com/…/counterweights.html): „reduces the effort required by the lifting machine“ und „The weight of an elevator cab (structural load) plus part of the passenger load (40 to 50% of its rated load) determines the weight of the counterweights.“
  - „Etwa so viel wie die halb volle Kabine“ ist richtig, und „etwa“ ist berechtigt. „Halb voll“ meint die Nutzlast, nicht den Platz. Für Kinder ist das ausreichend.
- **K4:** Nur das Wort ist geändert, sachlich in Ordnung.

---

## Neue Fallen (Zusatzauftrag)

**1. Honigbiene, „Fleisch“**
- **Urteil:** im Alltag eindeutig falsch, streng genommen ein Grenzfall.
- Zoo Frankfurt (Kartenquelle, zoo-frankfurt.de/…/honigbiene-europaeische-westliche): „Die Nahrung der erwachsenen Honigbienen besteht aus Nektar und Pollen.“
- Bei Pollenmangel fressen Völker aber eigene junge Larven. Schmickl & Crailsheim 2001, J Comp Physiol A 187:541–547, PubMed 11730301: „Five days of non-foraging led to cannibalism of larvae younger than 3 days old … worker jelly gets enriched by protein gained from cannibalism“.
- **Empfehlung:** „Fleisch“ ist vertretbar. Kinder meinen damit Fleisch anderer Tiere, und Bienen gehen nicht an Wurst. Wer streng nach „zum Teil zutreffend“ urteilt: Dasselbe Notverhalten trifft die bestehende Entdecker-Falle „Insekten“ stärker, denn Bienenlarven sind Insekten. Wenn eine der beiden gehen soll, dann eher „Insekten“.

**2. Koala, Fleisch**
- **Urteil:** eindeutig falsch.
- ADW (animaldiversity.org/accounts/Phascolarctos_cinereus/): „Koalas are herbivorous feeding on both eucalypt and non-eucalypt species. However the bulk of their diet comes from only a few eucalypt species.“
- San Diego Zoo: „offered fresh branches from several kinds of eucalypts each day“

**3. Okapi, „Fleisch“**
- **Urteil:** eindeutig falsch, auch mit Lehm, Holzkohle und Fledermauskot.
- ADW (animaldiversity.org/accounts/Okapia_johnstoni/): „supplement their diets with sulfurous clay for minerals. Some okapis have been observed eating burnt charcoal and licking bat guano off of hollow trees.“ Als „Primary Diet“ steht dort „herbivore, folivore“.
- San Diego Zoo (…/okapi): „leaves, twigs, fruits, and fungi … They also eat clay, likely for the minerals it contains.“
- Mineralien und Kot sind kein Fleisch.

**4. Nordamerikanischer Biber, „Vor allem kleine Fische“**
- **Urteil:** eindeutig falsch.
- Smithsonian (Kartenquelle, nationalzoo.si.edu/animals/beaver): „Beavers are herbivores, eating leaves, woody stems and aquatic plants.“
- ADW (Castor canadensis): „Primary Diet herbivore … lignivore“
- Hinweis für die Auflösung: Dass Biber Fische fressen, ist eine verbreitete Fehlvorstellung. Die Auflösung sollte es klar sagen, etwa „Biber fressen keine Fische, nur Pflanzen.“

**5. Giraffe: „Eukalyptusblätter“ und die übrigen Fallen zur Nahrung**
- **„Eukalyptusblätter“ (Profi):** in freier Natur eindeutig falsch, in Zoos nicht ganz sicher. Ich empfehle, sie zu behalten.
  - San Diego Zoo Wildlife Alliance Library (ielc.libguides.com/sdzg/factsheets/giraffes/diet): „Acacia and Combretum spp. predominant in their diet; also, Terminalia and Ziziphus spp.“
  - Perth Zoo: „acacia and wild apricot“
  - Australia Zoo: „twigs of acacia, mimosa and wild apricot“
  - Keine Quelle, die ich gelesen habe, nennt Eukalyptus als Giraffenfutter.
  - Eine Suchzusammenfassung erwähnt, dass der San Francisco Zoo unter anderem Eukalyptus an Pflanzenfresser verfüttert, „including giraffes“. Die Seite selbst gab 404, darum ist das nicht belegt. Da das Spiel nach der natürlichen Nahrung fragt, halte ich die Falle für vertretbar.
- **„Nektar und Pollen“ (Profi):** Sollte. Das ist der wichtigere Fund.
  - du Toit 1990, Abstract (digitalcommons.usu.edu/wild_facpub/2086): „Flowers of Acacia nigrescens Oliver are an important food resource to giraffe in the late dry season.“
  - Die Library von oben: „Eat seeds, pods, acacia bark, flowers when available“
  - Giraffen fressen Blüten samt Nektar und Pollen. Nach der Regel „zum Teil zutreffend“ ist die Falle damit nicht eindeutig. **Empfehlung:** streichen. Ersatz zum Beispiel „Krill“ oder „Vor allem kleine Fische“. Die habe ich für die Giraffe nicht eigens geprüft, sie sind für einen Pflanzenfresser aber offensichtlich falsch.
- **„Fleisch“ (Entdecker und Profi):** vertretbar falsch. Dieselbe Library: „Will chew on bones ('osteophagia'), presumably for minerals“. Knochen zu kauen ist kein Fleischfressen. Die Auflösung sollte nichts anderes behaupten, also nicht „frisst nie etwas von Tieren“.
- **„Bambus“ (Profi):** In freier Natur sicher falsch. Ob Zoos Giraffen Bambus geben, habe ich nicht geprüft.
- **„Fisch und Meerestiere“, „Vor allem kleine Säugetiere“, „Insekten“, „Kleine Tiere“, „Algen und Zooplankton“:** sicher falsch. Die Library nennt nur Pflanzenteile, Blüten, Schoten, Rinde und das Knochenkauen.

---

**Quellenlage:** gut. Die Belege kommen von Zoos (San Diego, Smithsonian, Toronto, Perth), Behörden (NOAA, NPS, Australian Antarctic Program, LfU Bayern, UAF), Museen (NHM, Australian Museum, Science Museum Group), Fachverbänden (WWF, BHPS, Woodland Trust, Wildlife Trusts, NABU-LFA), ADW, der NDB und einer Fachzeitschrift (PubMed). Science Buddies und National Geographic reichen für die einfachen Aussagen, für die sie stehen. Die Herstellerseite von TK Elevator ist für den Wert des Gegengewichts eine fachnahe und brauchbare Quelle. Wikipedia diente nur als Einstieg (Erdhörnchen).

**Nicht oder nur eingeschränkt geprüft:**
- **Wildlife Trusts (T15, T17a, T30):**
  - `curl` bekommt eine Cloudflare-Abfrage (403).
  - Der Abruf über das Internet Archive brach zweimal ab. Der Proxy meldete „ws_closed_mid_exchange“.
  - Ich habe die drei Seiten darum erneut nur über WebFetch gelesen. Die Zitate kamen so wörtlich zurück, aber eine Prüfung am Rohtext ist das nicht.
  - Unter den URLs `…/european-lobster` und `…/hedgehog` liegen andere Seiten. Die richtigen sind `…/crustaceans/lobster` und `…/mammals/european-hedgehog`, so wie in den Unterlagen.
- **Sundarbans (T6):** Die tägliche Flut kenne ich nur aus einer Suchzusammenfassung. Die UNESCO-Seite und der Springer-Artikel waren gesperrt.
- **Giraffe und Eukalyptus im Zoo:** Die Seite des San Francisco Zoos war nicht erreichbar (404).
- **Nicht heute geprüft:** Bogenlampen vor Swan und Edison, Swans spätere haltbare Lampen, Öllampen als häufigste Lichtquelle (K3, K5) sowie die Quallen-Stärke (T21). Das sind meine Einschätzungen ohne Beleg von heute.
- **Nicht meine Aufgabe:** Ton, Länge, Wiederholungen und ob ein Text etwas verrät. Wortzahlen habe ich nur nebenbei nachgezählt (T4, T22).

Die heruntergeladenen Quelltexte lagen nur im Arbeitsordner der Sitzung (nicht im Repository). Das war kein Bericht, nur Arbeitsmaterial.
