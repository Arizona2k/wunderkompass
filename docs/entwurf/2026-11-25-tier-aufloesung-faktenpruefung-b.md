# Faktenprüfung Tier-Auflösungen Paket 3 und 4 (25.11.2026)

> Helferbericht (fakten-pruefer, opus/high), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

`fakten-pruefer`, opus / high. Dateien wurden nicht geändert.
Geprüft: `docs/entwurf/2026-11-25-tier-aufloesung-paket-3.md` und `docs/entwurf/2026-11-25-tier-aufloesung-paket-4.md` (je 12 Tiere × 3 Texte), dazu `app/world-game-tier-fallen.json` und `app/world-catalog.json`.

**Kurz gesagt:** Die 72 Texte stimmen im Kern fast alle. Bei den Texten muss nur eine Stelle geändert werden (Walross, „wirbellos“). Drei Stellen sollten geändert werden (Erdmännchen, Rotfuchs, Waschbär), dazu kommen einige kleine Verbesserungen. Mehr Arbeit machen die Fallen. Bei Monarchfalter, Chamäleon, Igel, Grasfrosch, Papageitaucher und Seepferdchen passt eine Falle laut Quelle ganz oder teilweise, beim Monarchfalter und beim Chamäleon steht das sogar in der eigenen Kartenquelle.

---

## Muss (falsch)

### M1 Walross / Futter: „Solche Tiere ohne Knochen heißen wirbellos.“
- **Urteil:** falsch verkürzt. Dass Muscheln, Würmer und Seegurken keine Knochen haben, stimmt. Als Erklärung des Wortes ist der Satz aber falsch: „wirbellos“ heißt „ohne Wirbelsäule“. Haie haben auch keine echten Knochen und sind trotzdem Wirbeltiere; der Walhai hat eine eigene Karte.
- **Beleg:** ADF&G Walrus, https://www.adfg.alaska.gov/index.cfm?adfg=walrus.main: „soft invertebrates found on or below the seafloor … clams, snails, worms, sea cucumbers“. Der Teil zum Saugen stimmt: „Walruses suck out the soft parts of clams and snails leaving the shells to fall to the sea floor.“
- **Vorschlag** (170 Zeichen): „Das Walross frisst vor allem Muscheln, Würmer und Seegurken. Sie haben kein Rückgrat, darum heißen sie wirbellos. Es saugt das Weiche aus der Muschel wie ein Staubsauger.“
- Das Wort sollte in allen Paketen gleich erklärt werden. „ohne Knochen im Rücken“ aus Paket 4 geht; „kein Rückgrat“ ist am genauesten. Beim Braunbrustigel („kleine Tiere ohne Knochen“) ist der Satz nur eine Beschreibung und damit nicht falsch; der Gleichheit halber trotzdem angleichen.

### M2 Fallen, die laut Quelle passen (streichen)
Maßstab ist derselbe wie in `docs/entwurf/2026-11-24-tier-fallen-faktenpruefung.md`: Passt eine Falle ganz oder teilweise, kommt sie in beiden Listen des Tieres weg.

| Tier | Spiel / Liste | Falle | Beleg |
|---|---|---|---|
| Monarchfalter | Lebensraum, **Entdecker** und Profi | „Flüsse und Feuchtgebiete“ | Kartenquelle FWS, https://www.fws.gov/species/monarch-danaus-plexippus: „Whether it's a field, roadside area, open area, **wet area** or urban garden …“ und „In western North America, nectar and milkweed resources are often associated with **riparian** [habitat]“ |
| Europäisches Chamäleon | Lebensraum, **Entdecker** | „Flussufer und Stillgewässer“ | Kartenquelle ADW, https://animaldiversity.org/accounts/Chamaeleo_chamaeleon/: „Mediterranean chameleons live in savannas, **riparian habitats**, forests and grasslands.“ |
| Europäisches Chamäleon | Lebensraum, Profi | „Savanne“, „Grasland“ | dasselbe Zitat („savannas … grasslands“) |
| Braunbrustigel | Nahrung, Profi | „Fleisch“ | Kartenquelle Wildlife Trusts, https://www.wildlifetrusts.org/wildlife-explorer/mammals/european-hedgehog: „eat all kinds of invertebrates, **as well as amphibians, birds' eggs and just about anything else they can catch**“. BHPS, https://www.britishhedgehogs.org.uk/leaflets/L9-Basic-Facts.pdf: „may also catch and eat small vertebrates and will also scavenge“. Das Faltblatt https://www.britishhedgehogs.org.uk/posters/No-Milk-or-Bread.pdf empfiehlt sogar „meaty cat, dog or hedgehog food“. |
| Grasfrosch | Nahrung, Profi | „Fleisch“ | Woodland Trust, https://woodlandtrust.org.uk/trees-woods-and-wildlife/animals/reptiles-and-amphibians/common-frog/: „Common frogs are **carnivorous** … known to eat smaller amphibians“ |
| Papageitaucher | Nahrung, Profi | „Krill“, „Kleine Tiere im Plankton“ | Kartenquelle Audubon, https://www.audubon.org/field-guide/bird/atlantic-puffin: „The diet of Atlantic Puffin adults … may include many crustaceans (such as **euphausiid shrimp**, mysids, copepods)“; „euphausiid“ ist Krill |
| Kurzschnäuziges Seepferdchen | Nahrung, Profi | „Krill“ | NOAA, https://oceanservice.noaa.gov/facts/plankton.html: „Zooplankton include microscopic animals (**krill**, …)“. Kartenquelle Wildlife Trusts (Seepferdchen-Seite): Garnelen und Plankton sind das Lieblingsfutter. MarLIN, https://www.marlin.ac.uk/species/detail/1788: „plankton, brine shrimp, small crustaceans“. Krill zählt also selbst zu den „kleinen Beutetieren“ der richtigen Antwort. |

**Folge für die Mindestzahl** (Test: mindestens 3 Fallen auf Entdecker, 4 auf Profi):
- Profi wird zu kurz bei: Chamäleon-Lebensraum (3 übrig: Regenwald, Blütenreiche Landschaften, Arktis), Monarchfalter-Lebensraum (3, nach S6 nur noch 2), Feuersalamander-Nahrung und Grasfrosch-Nahrung (je 3, wenn S5 umgesetzt ist).
- Nachfüllen nur mit geprüften Paaren.

---

## Soll (ungenau oder nicht belegt)

### S1 Erdmännchen / Zuhause: „Erdmännchen graben Baue mit vielen Gängen.“
- **Urteil:** ungenau.
- **Beleg:** Kartenquelle San Diego Zoo, https://animals.sandiegozoo.org/animals/meerkat: „Although they are excellent diggers, meerkats **usually live in burrows dug by other wildlife**, such as ground squirrels.“ Der Teil zur Temperatur stimmt: „The deeper tunnels stay at a constant, comfortable temperature“. Die Sonnenbrille trägt die Quelle: „Dark patches around their eyes cut down on the sun's glare“.
- **Vorschlag** (etwa 140 Zeichen): „Erdmännchen wohnen in Bauen mit vielen Gängen. Oft hat sie ein anderes Tier gegraben. Dunkle Augenflecken wirken wie eine Sonnenbrille.“ Oder den Temperatur-Satz behalten und die Sonnenbrille streichen.

### S2 Rotfuchs / Zuhause: „Oft zieht er in einen Bau, den ein anderes Tier gegraben hat. So kommt er sogar mitten in Städten zurecht.“
- **Urteil:** Beide Teile stimmen, aber das „So“ verbindet sie zu einem falschen Grund. Fremde Baue (Kaninchen, Murmeltier) erklären nicht, warum der Fuchs in Städten zurechtkommt.
- **Beleg:** ADW, https://animaldiversity.org/accounts/Vulpes_vulpes/: „Dens of other animals, such as rabbits or marmots, are often taken over by foxes.“ Wildlife Trusts (Fuchs-Seite, über WebFetch): „towns and the countryside“.
- **Vorschlag** (159 Zeichen): „Der Rotfuchs frisst vieles, darum findet er fast überall Futter. Oft zieht er in einen Bau, den ein anderes Tier gegraben hat. Er lebt sogar mitten in Städten.“

### S3 Waschbär / Tierdetektiv: „Weil er Futter oft im Wasser betastet, heißt er Waschbär.“
- **Urteil:** stimmt mit Einschränkung. Der Name kommt davon, dass es wie Waschen *aussieht*. Wild lebende Waschbären tasten Futter im flachen Wasser ab. Das Futter zum Wasser tragen und „waschen“ sieht man nur bei Tieren in Gefangenschaft.
- **Beleg:** ADW, https://animaldiversity.org/accounts/Procyon_lotor/: „commonly associated with washing their food … lotor, means ‚the washer‘“. Wikipedia „Raccoon“, Abschnitt Dousing (nur als Einstieg): „This gives the appearance of the raccoon ‚washing‘ the food … has not been observed in the wild“. Der Fühlzellen-Satz stimmt: National Geographic, https://www.nationalgeographic.com/animals/article/raccoon-climbing-building-intelligence-facts-animals: „four to five times more sensory cells in their paws … see with their hands“.
- **Vorschlag** (158 Zeichen): „Der Waschbär hat in den Pfoten viel mehr Fühlzellen als die meisten Säugetiere. Er tastet Futter oft im Wasser ab. Das sieht aus wie Waschen, daher sein Name.“ Das Zitat „Er sieht mit den Händen“ fällt dabei weg; wer es behalten will, kürzt anders.

### S4 Grenzfälle bei den Fallen (nach dem Maßstab „im Zweifel streichen“)
- **Schleiereule, Lebensraum, Entdecker: „Flussufer und Stillgewässer“.** Teilweise strittig.
  - Schleiereulen jagen an grasigen Säumen von Gräben und Ufern. Barn Owl Trust, https://barnowltrust.org.uk/how-to-manage-land-for-barn-owls/barn-owl-habitat-requirements: „rough grass field margins and **ditch sides**“. GWCT, https://gwct.org.uk/farming/big-farmland-bird-count/farmland-birds-to-count/barn-owl/: „spinneys, **ditches**, rough pastures“.
  - Das Wasser selbst ist kein Lebensraum der Eule. Auf Entdecker muss eine Falle aber klar falsch sein, darum: streichen.
- **Katta, Lebensraum, Entdecker: „Flussufer und Stillgewässer“** (ein eigener Fund). Kattas leben auch in Galeriewäldern an Flüssen. Wikipedia „Ring-tailed lemur“ (Einstieg): „it ranges from **gallery forests** to spiny scrub“. Grenzfall: streichen.
- **Monarchfalter, Lebensraum, Profi: „Wüste“.** FWS (Quelle siehe M2): „milkweed may function as the principal nectar source for monarchs in **more arid regions**“. Grenzfall: streichen.
- **Erdmännchen, Nahrung, Profi: „Fische, Vögel und auch tote Tiere“** (ein eigener Fund). San Diego Zoo (Quelle siehe S1): „insects …, spiders, snails, rodents, **birds, eggs**, lizards, and scorpions“. Passt also teilweise: streichen oder ersetzen.

### S5 „Fleisch“ als Falle: eine Regel für alle
Am 24.11. wurde „Fleisch“ bei Kaiserpinguin, Großem Tümmler und Eisvogel gestrichen („Als Fleischfresser passt ‚Fleisch‘ teilweise“). Beim Großen Panda flog es raus, weil er „will eat meat … when available“. Behalten wurde es bei Axolotl und Hummer. Das ist uneinheitlich.

**Empfehlung:** „Fleisch“ nur bei Tieren, die gar keine Tiere fressen. Dann fällt „Fleisch“ zusätzlich zu Igel und Frosch (M2) weg bei:
- Kurzschnabeligel (Profi): frisst nur Tiere (Ameisen, Termiten, Larven).
- Feuersalamander (Profi): NABU Euskirchen, https://www.nabu-euskirchen.de/2026/06/03/feuersalamander-ein-portrait/: „hauptsächlich von kleinen wirbellosen Tieren … Regenwürmer, Schnecken, Asseln, Insekten, Spinnen“.
- Chamäleon (Profi): ADW: „88 to 100% arthropods“.
- Hummer (Profi): Wildlife Trusts (Hummer-Seite): „Lobsters are scavengers“; frisst also auch tote Tiere.
- Echter Clownfisch (**Entdecker**): frisst Zooplankton, also Tiere. Australian Museum: „feeding on algae and zooplankton“.
- Afrikanischer Strauß (**Entdecker**): San Diego Zoo, https://animals.sandiegozoo.org/animals/ostrich: „also munch on insects, snakes, lizards, or rodents“. Das ist derselbe Fall wie beim Panda.

Behalten können „Fleisch“: Okapi, Monarchfalter.

### S6 Hinweis zur Quellenlage beim Papageitaucher / Tierdetektiv
- **Urteil:** stimmt in der Sache. Die Seite https://seabirdinstitute.audubon.org/node/4316 leitete bei mir aber auf eine allgemeine Seite um. Den Wortlaut („using their wings to essentially ‚fly‘ underwater while using their feet to control direction“) habe ich nur im Suchauszug gesehen.
- Besser wäre eine Quelle, die sich aufrufen lässt, z. B. https://kids.nationalgeographic.com/animals/birds/atlantic-puffin/ (laut Suche: „use their webbed feet to steer“). Diese Seite habe ich nicht selbst geöffnet.

---

## Kann (Feinschliff, Inhalt stimmt)

- **Afrikanischer Strauß / Tierdetektiv:** „So kippt er nicht um“ geht etwas weiter als die Quelle („help them balance … especially if they suddenly change direction“). Vorschlag: „So hält er das Gleichgewicht, wenn er einen Haken schlägt.“ Achtung: Mit dem ganzen Satz wird der Text sonst 183 Zeichen lang, darum „plötzlich“ und das „sehr“ in „sehr schnell“ streichen.
- **Europäisches Chamäleon / Tierdetektiv:** „ohne sich zu bewegen“, dabei bewegen sich die Augen. Besser: „ohne sich vom Fleck zu rühren“. ADW: „When stationary, … use their eyes independently to scan the environment for predators and prey.“
- **Erdmännchen / Futter:** „Junge üben zuerst mit Skorpionen, denen Erwachsene den Stachel entfernt haben.“ Laut Cambridge, https://www.cam.ac.uk/research/news/wild-meerkats-school-their-young, bekommen die Jungen die Beute erst tot oder unschädlich gemacht, „In the case of the scorpions, they **often** removed the sting“. Vorschlag: „Junge bekommen Skorpione oft erst ohne Stachel.“
- **Grasfrosch / Tierdetektiv:** „beginnt sein Leben als Kaulquappe“, dabei beginnt es im Ei (Laich), und davon spricht auch das Rätsel. Vorschlag: „Der Grasfrosch schlüpft als Kaulquappe mit Schwanz aus dem Ei.“ Die Abfolge erst Beine, dann Arme, dann verschwindet der Schwanz ist belegt: NHM, https://www.nhm.ac.uk/discover/frogspawn-tadpoles-and-froglets.html: „their legs begin to form, followed by the arms. Their tails are gradually absorbed“.
- **Europäischer Aal / Tierdetektiv:** „als Jungtier Glasaal“. Davor gibt es eine blattförmige Larve; Glasaal heißt er erst an der Küste. WWT, https://www.wwt.org.uk/discover-wetlands/wetland-wildlife/species-factfiles/european-eel: „when they reach the shores of Europe … metamorphose into … ‚glass eels‘“. Vorschlag: „heißt an der Küste Glasaal“.
- **Papageitaucher / Zuhause:** „gräbt … eine Höhle“ → „gräbt … meist eine Höhle“. Audubon: „burrow 3-7 ft long, **or in natural crevice or under rocks**“.
- **Feuersalamander / Tierdetektiv:** „kühle, saubere Bäche“. Die Larven kommen auch in Quelltümpel. LfU Bayern, https://www.lfu.bayern.de/wasser/auen/grundlagen/auen_naturhaushalt/doc/feuersalamander.pdf: „Quellbäche, Quelltümpel und quellwassergespeiste Kleingewässer“. Für Kinder ist „Bäche“ vertretbar.
- **Kurzschnabeligel / Zuhause:** „Hauptsache, es gibt Ameisen und Termiten“ ist eine Folgerung. Sie ist vertretbar, er frisst aber auch Käferlarven.
- **Echter Clownfisch / Zuhause:** „Nachts ruht er oft mitten auf der Seeanemone“. Die Quelle sagt das für „most species“, nicht ausdrücklich für Amphiprion percula. Mit „oft“ ist das ausreichend vorsichtig.
- **Nebenbefund Karte Schleiereule** (`animal-barn-owl`): Als Erdteil steht nur „Europa“. Auch die eng gefasste Art Tyto alba (Westliche Schleiereule) lebt in „Europe, Africa, and West Asia“ (Wikipedia „Barn owl“, Einstieg). Gehört nicht zu den Auflösungen; ins BACKLOG.

---

## Geprüft und bestätigt (Quelle selbst geöffnet)

- **Schnabeltier:** alle drei Texte.
  - NSW: „both its eyes and ears close when it dives“, „electrical discharges from its prey“, „resting burrows“.
  - San Diego Zoo: „webbed feet“, „waterproof … traps an insulating layer of air“, „cheek pouches … swim to the surface to eat“, „grind their food between mouth pads made of keratin“, Larven, Krebse, Würmer.
- **Kurzschnabeligel:** alle drei. NSW Echidnas: „curl into a ball“, „burrow straight down into soft soil“, „from snow-covered mountains to deserts“, „hollow logs“, „keen sense of smell“, „no teeth, it grinds its food between its tongue and the bottom of its mouth“.
- **Okapi:** alle drei. San Diego Zoo: „partial sunlight“, „may also help a young okapi follow their mother“, „listen for leopards“, „strip the buds and young leaves“, „leaves, twigs, fruits“, „long enough to reach its eyes and ears“.
- **Erdmännchen:** Tierdetektiv (Wache, verschiedene Rufe für Feinde am Boden und aus der Luft), Sonnenbrille, Krallen, Skorpione; Einschränkungen siehe S1 und Kann.
- **Katta:** alle drei.
  - Smithsonian: „rubbed on the tail and flicked at an opponent“, „move quadrupedally“, „bellies toward the sun … arms and legs stretched out … before they forage“.
  - Duke: „stink fighting“, „fruit, leaves, flowers, bark, sap“, „insects and small vertebrates (especially in the dry season when food is scarce)“.
- **Katta, IUCN (BACKLOG 27):** **Endangered (stark gefährdet)**.
  - Bewertung: LaFleur, M. & Gould, L. (2020), *Lemur catta*, IUCN Red List, e.T11496A115565760, doi:10.2305/IUCN.UK.2020-2.RLTS.T11496A115565760.en.
  - Die Seite der IUCN war bei mir durch Cloudflare gesperrt (403). Geprüft habe ich deshalb über die Schnittstelle von GBIF, die die IUCN-Daten übernimmt: https://api.gbif.org/v1/species/2436412/iucnRedListCategory → `{"category":"ENDANGERED", "iucnTaxonID":"11496", "code":"EN"}`.
  - Smithsonian („Ring-tailed lemurs are an endangered species“) und Duke („IUCN Status: endangered“) stimmen damit überein. Die Karte nennt keine Einstufung; das ist kein Fehler. Soll sie eine zeigen: „stark gefährdet (Rote Liste der IUCN, 2020)“.
- **Nordamerikanischer Biber:** alle drei.
  - Smithsonian: „grow continuously“, „iron contained in the enamel“, „hind feet are webbed“, „rudder“, „valves that also close while submerged“, „stored on the muddy pond floor as a winter food supply“.
  - Rinde: ADW, https://animaldiversity.org/accounts/Castor_canadensis/: „Beavers eat bark and cambium“.
  - Bäume fällen: ADF&G, https://www.adfg.alaska.gov/index.cfm?adfg=beaver.main: „stands up on its hind legs to cut down a tree“, „underwater food caches“.
- **Walross:** Tierdetektiv und Zuhause.
  - ADF&G: „hundreds of … highly sensitive whiskers“, „pull themselves onto rocks or ice“, „the walrus with smaller tusks will move away“.
  - Blasse Haut: University of Alaska, https://gi.alaska.edu/alaska-science-forum/why-does-walrus-blush: „skin of walruses becomes pallid when it is exposed to cold air or water … may indicate that the circulatory output to the skin is altered to control their total body heat loss“. In der Quelle als Vermutung formuliert, als Kinderaussage vertretbar.
  - Fettschicht: Wikipedia „Walrus“ (Einstieg): „blubber layer … up to 15 cm“.
- **Rotfuchs:** Tierdetektiv und Futter.
  - NPS, https://www.nps.gov/articles/species-spotlight-red-fox.htm: „steering with their tails on the way down … If the snow is deep it lands head first“.
  - MDC, https://mdc.mo.gov/node/275020: „acts like a blanket on chilly nights“.
  - Wildlife Trusts: „not fussy eaters … worms as well as berries and fruit“.
  - Vergraben: Wildlife Online, https://www.wildlifeonline.me.uk/animals/article/red-fox-diet-killing-to-excess-caching: „some may be buried for later retrieval … caching“. Die Seite ist eine Sekundärquelle, stützt sich aber auf Macdonald 1976 und Sklepkovych 1996.
- **Waschbär:** Zuhause und Futter. ADW: „prefer to build dens in trees … barns“, „introduced to parts of … Europe“, „nocturnal“, „acorns“, „Crayfish, insects … fish“, „trash“.
- **Braunbrustigel:** alle drei.
  - Wildlife Trusts: „curl up in a nest of leaves called a ‚hibernaculum‘“, „survive on their stored fat until spring“, „big, crunchy beetles“.
  - Raupen jetzt belegt: BHPS Basic Facts: „beetles, **caterpillars** and earthworms being particularly important“.
  - Milch: BHPS: „Never offer milk as this can upset their tummies“; „only water to drink“.
  - Hedgehog Street (Seite geladen): Loch im Zaun, weite Wege in der Nacht.
- **Schleiereule:** alle drei.
  - Barn Owl Trust (Adaptations): „facial disk collects and directs sound“, „capture prey in total darkness by hearing alone“, „feathers are very soft – another adaptation for quiet flight“.
  - BTO: „voles, mice, shrews“, „low over vegetation“.
  - RSPB: „Long legs – great for plucking prey from the undergrowth“.
  - Barn Owl Trust (Brutplätze): „Old barns. Hollow trees … Nestboxes“.
  - Audubon: Beute ganz geschluckt, Gewölle.
- **Eisvogel:** alle drei.
  - RSPB: „transparent third eyelid … built-in swimming goggles“, „clear or slow flowing“.
  - RSPB (Jagd): „hit the prey against a branch“, „gulp down a fish headfirst, so the fins and scales won't jam“.
  - „Steiles Ufer“ ist jetzt belegt: Discover Wildlife (Mike Toms, BTO): „choosing a **steep or vertical bank** situated over water“.
- **Afrikanischer Strauß:** Zuhause und Futter. San Diego Zoo: „long necks and keen vision … see for great distances … notice danger“, „do not need to drink water“, „roots, leaves, and seeds … insects, snakes, lizards“, „swallow sand, pebbles, and small stones … gizzard“.
- **Papageitaucher:** Zuhause und Futter. Audubon: „Both sexes help excavate“, „carrying a dozen small fish lined up in its bill“, Futter der Jungen „mostly small fish“.
- **Europäisches Chamäleon:** Zuhause und Futter. ADW: „three digits on one side and two digits on the other“, „prehensile tails“, „sit-and-wait predators“, Zunge „as projectiles“.
- **Feuersalamander:** alle drei.
  - LfU Bayern: „kühle saubere und raubfischfreie kleine Bäche“, „vor allem von Raubfischen … gejagt“.
  - NABU Feldherpetologie: „gold-gelben Flecke an den Oberarmen und Oberschenkeln“.
  - NABU Euskirchen: „Haut ständig feucht bleiben muss“, „Tagsüber verstecken sich die Tiere unter Holz, Steine…“, „überwiegend nachtaktiv. Besonders bei Regen“, „langsam verfolgt und dann blitzschnell geschnappt“.
- **Grasfrosch:** Zuhause und Futter. Woodland Trust: „smooth, moist skin“, „Frogs can breathe through their skin“, „in the mud at the bottom of ponds, under piles of logs“, „flies, worms, snails and slugs … long, sticky tongue“, „tadpoles feed on algae“.
- **Echter Clownfisch:** alle drei.
  - Australian Museum: „orange colour with three white bars“, „algae and zooplankton“, „protective agent in the mucus“.
  - Monterey Bay Aquarium: „stinging tentacles keep predators at bay“.
  - NOAA: Zooplankton sind treibende Tiere.
  - Der Vergleich mit Brennnesseln ist für Nesselzellen in Ordnung.
- **Europäischer Aal:** Zuhause und Futter.
  - WWT: „darken in colour“, „more than 20 years“, „hidden in the dark waters of rivers“, „fish, molluscs and crustaceans … scavenge on dead fish … Small eels feed on insect larvae and worms“.
  - IKSR (Seite geladen): „catadromous … spends most of its life in the river and migrates … into the Sargasso Sea“. Das trägt „kommt mit Meer- und Flusswasser zurecht“.
- **Monarchfalter:** alle drei.
  - FWS: „only food the caterpillars can eat“, „nectar of many flowers during breeding and migration“, „field, roadside area … urban garden“.
  - Monarch Watch, https://monarchwatch.org/biology/: „The straw-like proboscis … through which it sucks nectar and water“.
- **Gefleckte Weinbergschnecke:** alle drei.
  - Die NHM-Seite nennt *Cornu aspersum* ausdrücklich: „These snails mostly come out at night, but you might also see them out and about when it rains“.
  - Allgemein für Schnecken, aber auf die Art übertragbar: „slime … barrier that prevents dehydration“, „shadow reflex“, „many snail species seal up the openings … with a mucus plug“, „like a piece of sandpaper“, „decaying or dead vegetation“.
  - „Pflanzen, oft auch welke“ widerspricht nicht. Gerade diese Art frisst auch frische Gartenpflanzen.
- **Europäischer Hummer:** alle drei. Wildlife Trusts (über WebFetch): „one used for crushing and one for tearing“, „grow back lost limbs“, „crevices and excavated hidey-holes amongst rocks“, „come out to feed at night“, „molluscs, sea urchins and other smaller crustaceans“.
- **Gewöhnliche Sepia:** alle drei.
  - Wildlife Trusts: „change colour and texture“, „sink into a sandy seabed … leaving only their eyes exposed“, „crabs, fish“.
  - MarLIN: „sandy and muddy substrata“, „arms are specialised for grasping prey after it has been seized by the tentacles“, „Brachyuran crabs and demersal fish“.
  - Zur Karte („küstennah“): Wildlife Trusts: „live in water up to 200 metres deep but come to shallow waters to breed“. Für Kinder vertretbar.
- **Kurzschnäuziges Seepferdchen:** alle drei.
  - Wildlife Trusts: „pretty poor swimmers“, „cling onto seagrass or seaweed“, „shallow waters, often in estuaries or associated with seagrass meadows“, keine Zähne, Garnelen und Plankton, „brood pouch“.
  - MarLIN: „used as a hand when grasping for climbing“, „remain motionless until a small animal such as a mysid shrimp passes within reach“.

**Bewertung der Fallen, auf die die Autoren hingewiesen haben, zusammengefasst:**

| Falle | Echt strittig? |
|---|---|
| Chamäleon „Flussufer und Stillgewässer“, „Savanne“, „Grasland“ | ja (M2) |
| „Fleisch“ bei Igel | ja (M2) |
| „Fleisch“ bei Frosch | ja (M2) |
| „Fleisch“ bei Kurzschnabeligel, Salamander, Hummer, Chamäleon | ja nach der Regel vom 24.11. (S5) |
| „Krill“ beim Seepferdchen | ja (M2) |
| „Krill“ und „Plankton“ beim Papageitaucher | ja (M2) |
| „Krill“ bei Sepia, Aal, Hummer | nein (MarLIN Sepia: Krabben, Fische, Flohkrebse; keine Quelle für Krill) |
| Schleiereule „Flussufer“ | Grenzfall, streichen (S4) |
| Monarchfalter „Wüste“ | Grenzfall (S4) |
| Weinbergschnecke „Savanne“ | nicht geprüft |

---

## Nicht geprüft oder nur eingeschränkt

- **Rote Liste der IUCN:** Die Seite selbst war gesperrt (Cloudflare 403). Die Einstufung habe ich über GBIF geprüft, das die Daten der IUCN übernimmt, und über die Fußnote bei Wikipedia (LaFleur & Gould 2020).
- **Wildlife Trusts** (Igel, Fuchs, Hummer, Sepia, Seepferdchen): Für `curl` gesperrt. Ich habe sie über WebFetch gelesen; dort fasst ein kleines Modell die Seite zusammen. Die Zitate oben stammen aus dieser Zusammenfassung und sind nicht Wort für Wort am Seitentext geprüft. Ein Umweg über das Webarchiv wurde vom Rechtesystem abgelehnt; ich habe ihn nicht weiter versucht.
- **Nicht ladbar:** Audubon Seabird Institute node/4316 (Umleitung, siehe S6), Open University „Staying warm“ (leere Antwort), Texas A&M Insects (403). Für die Texte war keine davon nötig; die Aussagen tragen andere Quellen.
- **Nicht geöffnet:** National Geographic Kids zum Papageitaucher, die Studie von 1986 zu nassen Waschbärpfoten, Primärliteratur zum Futterverstecken des Fuchses (nur Wildlife Online, Zusammenfassung von PubMed 1007654 nicht lesbar).
- **Weinbergschnecke „Savanne“ (Profi):** nicht geprüft.
- **Fallen außerhalb der Hinweise der Autoren:** nur stichprobenhaft angesehen (eigene Funde: Katta „Flussufer“, Erdmännchen „Fische, Vögel und auch tote Tiere“, „Fleisch“ bei Clownfisch und Strauß). Die anderen Paare dieser 24 Tiere habe ich nicht neu geprüft; sie stammen aus der Prüfung vom 24.11.
- **Nicht meine Aufgabe und darum nicht geprüft:** Satzlänge, Zeichenzahl und Ton der Entwürfe (Sache von `kinder-redaktion` und `stufen-pruefer`). Die Längen meiner Vorschläge habe ich nachgezählt; den Strauß-Vorschlag siehe Hinweis unter Kann.
- **Die Spiellogik** (`app/world-game-bank.ts`, `app/world-game-support.mjs`) habe ich nicht im Einzelnen gelesen. Ob die Texte dort richtig erscheinen, ist ungeprüft.

**Quellenlage:** gut. Fast alle Aussagen stützen sich auf Zoos, Museen, Behörden und Fachverbände (San Diego Zoo, Smithsonian, Duke Lemur Center, NSW, ADF&G, FWS, NOAA, NHM, MarLIN, LfU Bayern, NABU, RSPB, BTO, Barn Owl Trust, BHPS, WWT, IKSR). Schwächer sind Discover Wildlife (Magazin, beim Eisvogel aber mit Zitat aus der BTO), National Geographic (Magazin, mit Zitat einer Forscherin) und Wildlife Online (Sekundärquelle). Wikipedia habe ich nur als Einstieg genutzt und nicht als Endbeleg für Zahlen.
