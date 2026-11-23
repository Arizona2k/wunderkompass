# Faktencheck des Inhaltsentwurfs „Karte mit Stufen“ (fakten-pruefer, 23.11.2026)

Prüft [den Entwurf](2026-11-23-karte-stufen-entwurf.md). Teilprüfung durch einen Helfer.

## Fakten-Prüfung: Entwurf „Karte mit Stufen“

Geprüft habe ich `/home/user/wunderkompass/docs/entwurf/2026-11-23-karte-stufen-entwurf.json` (alle 83 Fragen) und die Teile C und D aus `/home/user/wunderkompass/docs/entwurf/2026-11-23-karte-stufen-entwurf.md`. Verglichen habe ich mit `/home/user/wunderkompass/app/world-catalog.json` und mit Quellen von außen. Ich habe nichts geändert.

**Ergebnis:** 15 Fragen haben einen Befund, dazu zwei Punkte in Teil C/D. 68 Fragen passen. Fünf Befunde betreffen eine Antwort, die nicht eindeutig richtig oder falsch ist. Sie stehen zuerst.

### Befunde, die vor dem Einbau geändert werden sollten

**animal-african-savanna-elephant:rate-1** (neue 4. Antwort „Er taucht den Kopf ins Wasser und schluckt“)
- **Befund:** Die Antwort ist nicht eindeutig falsch. Junge Kälber, die den Rüssel noch nicht beherrschen, knien sich hin und saugen das Wasser direkt mit dem Maul. Auch der Grund „Sein Kopf ist schwer und weit oben“ ist nicht belegt.
- **Beleg:** ElephantVoices, Ethogramm „Drinking“: „with unskilled calves … kneeling down to suck water directly into the mouth“ (https://www.elephantvoices.org/the-elephant-ethogram/drinking). San Diego Zoo: „sucks water only part way up the trunk, curls it toward its mouth“ (https://animals.sandiegozoo.org/animals/elephant).
- **Vorschlag:** Frage ändern zu „Wie trinkt ein großer Elefant?“. Neuer wrongReason: „So trinken höchstens ganz junge Elefanten, die mit dem Rüssel noch üben. Ein großer Elefant nimmt den Rüssel.“

**animal-polar-bear:rate-2** (neue 4. Antwort „Er paddelt wie ein Hund“)
- **Befund:** Die Antwort ist nicht eindeutig falsch. Fachquellen nennen den Schwimmstil des Eisbären selbst „Hundepaddeln“, nur mit den Vorderpfoten.
- **Beleg:** SeaWorld: „A polar bear's front paws propel them through the water dog-paddle style. The hind feet and legs are held flat and are used as rudders.“ (https://seaworld.org/animals/all-about/polar-bears/adaptations/)
- **Vorschlag:** 4. Antwort „Er paddelt mit allen vier Beinen gleich stark“. wrongReason: „Die Hinterbeine lenken nur. Die Kraft kommt von einem Beinpaar.“

**science-pollination-4** (wrongReason zu Antwort 1 „Es entstehen sicher Samen“)
- **Befund:** „Sicher ist das nicht“ klingt so, als könnten manchmal doch Samen entstehen. Das widerspricht der richtigen Antwort.
- **Vorschlag:** „Das klappt nicht. Tulpe und Rose sind viel zu verschieden.“

**science-fungi-2** (wrongReason „Pollen ist kein Futter für Pilze.“)
- **Befund:** Das ist falsch. Viele Pilze zersetzen Pollen. Pollen ist sogar ein üblicher Köder, um bestimmte Pilze zu fangen.
- **Beleg:** Rhizophydiales: „the majority of the described saprotrophic species are biodegraders of pollen“ (https://en.wikipedia.org/wiki/Rhizophydiales). Studie zum Stechlinsee, in der Pollen zersetzende Pilze bei Pollenflug überwiegen (https://www.nature.com/articles/s41396-022-01267-y).
- **Vorschlag:** „Pollen bekommt der Pilz nicht vom Baum.“

**science-seasons-2** (wrongReason zu „Die Sonne ist dann näher an der Erde“: „Hohe Sonne ist kaum näher. Der Unterschied ist winzig.“)
- **Befund:** Der Satz verfestigt die Fehlvorstellung „im Sommer ist die Sonne näher“. Im deutschen Sommer (Juli) ist die Erde sogar am weitesten von der Sonne weg.
- **Beleg:** NASA Space Place: „Aphelion occurs in July, and perihelion occurs in January.“ (https://spaceplace.nasa.gov/seasons/en/)
- **Vorschlag:** „Nein. Im deutschen Sommer ist die Erde sogar ein bisschen weiter von der Sonne weg.“

### Befunde mit Einschränkung

**animal-polar-bear:rate-3**
- **Richtige Antwort stimmt.** Im Wasser hält vor allem die Fettschicht warm, nasses Fell isoliert kaum.
  - SeaWorld: „A thick layer of fat, up to 11 cm … keeps the polar bear warm while swimming“ (Link wie oben).
  - San Diego Zoo: „guard hairs that stick together when wet“.
  - Laut einer Zusammenfassung der älteren Fachliteratur steigt der Wärmeverlust durch das Fell im Wasser um das 25- bis 50-Fache. Den Originalaufsatz habe ich nicht gelesen.
- **Befund zum wrongReason zu Antwort 1:** „Die schwarze Haut nimmt Sonnenwärme auf“ liegt nah am Glasfaser-Mythos und ist umstritten. Durch das Haar kommt kaum Licht bis zur Haut.
- **Beleg:** BEAR.org: „Less than 0.001 percent of red light … traveled an inch down a hair shaft“ (https://bear.org/myth-polar-bears-are-solar/).
- **Vorschlag:** „Die Haut liegt unter dem Fell. Im eiskalten Wasser hält sie ihn nicht warm.“

**animal-common-octopus:rate-3** (why)
- **Befund:** „Nur sein Schnabel ist hart“ vereinfacht zu stark. Um das Gehirn liegt eine feste Knorpelkapsel. Auch die Faustregel „Wo der Schnabel durchpasst, passt der ganze Krake durch“ ist nicht belegt. Eine Studie vom November 2026 nimmt die Knorpelkapsel als Maß. Laut Bericht testete sie Löcher bis 5 mm enger als die Knorpelkapsel, und Gewöhnliche Kraken schlüpften durch.
- **Beleg:** ConnectSci zu Xin u. a., J Exp Biol 2026: „stiff cartilage encasing the central nervous system“ (https://connectsci.au/news/news-parent/10357/Octopuses-squeeze-through-tiny-holes-But-how). Science News, 5.11.2026 (https://sciencenews.org/article/octopuses-squeeze-escape-steps-video).
- **Vorschlag für why:** „Ein Krake ist ein Weichtier und hat keine Knochen. Fast sein ganzer Körper ist weich. So quetscht er sich durch erstaunlich enge Spalten.“
- **Tipp 2:** „Weichtiere wie Schnecken haben innen kein hartes Gerüst“ stimmt nicht für alle Weichtiere: Die Sepia hat innen einen harten Schulp. Vorschlag: „Weichtiere haben keine Knochen.“

**history-stone_tools:rate-4**
- **Befund zum wrongReason zu Antwort 3** („Dass alle verbrannt wurden, kann niemand wissen“): Das schwache Argument verschenkt den Zusammenhang mit der Karte. Vor 3,3 Millionen Jahren nutzte noch niemand Feuer, das steht im eigenen „Stimmt das?“.
- **Vorschlag:** „Feuer nutzte damals noch niemand. Das steht bei „Stimmt das?“.“
- **Notiz im Feld `pruefen` ist veraltet:** Die Speere von Schöningen sind seit 2025 auf etwa 200.000 Jahre datiert, nicht 300.000. Beleg: Universität Mainz, „Age of Schöningen spears revised to 200,000 years“ (https://press.uni-mainz.de/age-of-schoningen-spears-revised-to-200000-years/). Die Frage selbst bleibt richtig.

**person-marie_curie:rate-3**
- **Befund zur richtigen Antwort und zum why:** Belegt ist, dass der Name Polen ehren sollte. Die politische Absicht („unfreie Heimat“) wird oft berichtet, steht aber nicht in der Veröffentlichung von 1898.
- **Beleg:**
  - AIP: „They honored Marie's native land by naming the element „polonium.““ (https://history.aip.org/exhibits/curie/brief/03_radium/radium_3.html)
  - BnF: „en l'honneur de la patrie de Marie“ (https://heritage.bnf.fr/france-pologne/maria-sklodowska-curie-1867-1934)
  - RSC-Podcast zur politischen Spitze gegen Russland (https://periodic-table.rsc.org/podcast/84/polonium)
- **Vorschlag:** Antwort „Sie wollte ihre Heimat Polen ehren“. why: „Polen war damals kein eigenes, freies Land. Mit dem Namen ehrte Marie Curie ihre Heimat, und alle sollten an Polen denken.“
- **Tipp 2:** „Polen wurde damals von Russland beherrscht“ ist zu grob, Polen war unter drei Staaten aufgeteilt. Vorschlag: „Polen war damals aufgeteilt. Ihre Heimatstadt Warschau gehörte zu Russland.“ Dieselbe Ungenauigkeit steht auch im Steckbrief der Karte.
- **Bestätigt:** Das Gestein kam nicht aus Polen. AIP, Bericht vom Dezember 1898: „residue from the treatment of the Joachimsthal pitchblende“ (https://history.aip.org/exhibits/curie/discover.htm).

**building-giza-pyramids:rate-3**
- **Befund:** Die Rechnung passt zur Karte (4.500 − 3.800). Wer den Rekord übernahm, ist aber unsicher. Wikipedia nennt schon Old St Paul's in London (1221, 149 m) und davor kurz die Yongning-Pagode (516–534). Die Höhen sind jeweils umstritten. Lincoln (1311) ist nur eine von mehreren Angaben. „Vor etwa 700 Jahren“ bleibt trotzdem die einzige passende Antwort.
- **Beleg:** „From 1221 to 1884 the records were held by European churches“ (https://en.wikipedia.org/wiki/History_of_the_world%27s_tallest_structures). Für das Alter gilt die Seite des ägyptischen Ministeriums, „tallest structure in the world for 3,800 years“ (https://egymonuments.gov.eg/en/monuments/the-great-pyramid).
- **Vorschlag für den letzten Satz des why:** „Damals bekam wohl eine Kirche in England eine noch höhere Turmspitze. Wie hoch sie genau war, weiß man nicht sicher.“

**science-water-cycle-4** (why)
- **Befund:** „in einer Wolke nur Tage“ ist ungenau. Gemeint ist die Luft: Dort bleibt Wasser im Mittel gut 8 Tage. Eine einzelne Wolke hält oft nur Minuten bis Stunden.
- **Beleg:** Earle, Physical Geology (BCcampus): „a molecule of water stays in the atmosphere for just over eight days“ (https://courses.lumenlearning.com/suny-purchase-physicalgeology/chapter/13-1-the-hydrological-cycle/).
- **Vorschlag:** „… in der Luft nur etwa eine Woche, im Gletschereis oder tief im Boden oft tausende Jahre.“
- **Klein, freiwillig:** „Wasser geht nicht verloren“ (Antwort 3) stimmt streng genommen nicht, weil Pflanzen bei der Fotosynthese Wasser spalten. Für die Stufe ist das vertretbar.

**science-tides-2** (wrongReason zu Antwort 3)
- **Befund:** „Hochwasser gibt es fast jeden Tag“ ist schief. An der Nordsee kommt es etwa alle 12 Stunden 25 Minuten, also jeden Tag, meist zweimal.
- **Beleg:** BSH-Bericht zur Gezeitenvorausberechnung: „12 h 25 min später … folgt wieder ein Hochwasser“ (https://digitale-bibliothek.bsh.de/viewer/api/v1/records/167721/files/source/BSHBericht50.pdf).
- **Vorschlag:** „An der Nordsee gibt es jeden Tag Hochwasser, meist zweimal.“

**science-tides-3** (richtige Antwort)
- **Befund:** „Er zeigt keine Zeiten …“ ist mehrdeutig. Viele Mondkalender zeigen Zeiten, zum Beispiel für Mondaufgang und Vollmond.
- **Vorschlag:** „Er zeigt nicht, wann bei dir Ebbe ist, und kein Wetter“. Oder kürzer: „Er zeigt keine Gezeiten und kein Wetter für deinen Ort“.

**invention-bicycle:rate-1** (wrongReason zu Antwort 2)
- **Befund:** „Kleine Räder gingen nicht schneller kaputt“ ist nicht belegt. Belegt ist: Das große Rad brachte mehr Strecke pro Tritt und nebenbei eine sanftere Fahrt.
- **Beleg:** „the larger the front wheel, the further (and so faster) it went“, „the large wheel gave a smoother ride“ (https://en.wikipedia.org/wiki/Penny-farthing).
- **Vorschlag:** „Darum ging es nicht. Das große Rad sollte dich schneller machen.“

**invention-bicycle:rate-4**
- **Befund:** Die richtige Antwort trifft nur einen Teil. Der Hauptgrund für den Namen: Man kippte seltener kopfüber nach vorn. Bestätigt ist, dass Hochräder schon Bremsen hatten (Löffelbremse am Vorderrad), und dass der Rover Vollgummireifen hatte.
- **Beleg:** „so-called because the rider, seated much lower and farther behind the front wheel contact point, was less prone to a header“ (https://en.wikipedia.org/wiki/Penny-farthing). Zu den Bremsen: https://en.wikipedia.org/wiki/Bicycle_brake.
- **Vorschlag:** Antwort „Man stürzte seltener und nicht so tief“. why ergänzen: „… Man kippte nicht mehr so leicht kopfüber nach vorn.“

### Teil C und D

**building-giza-pyramids:stimmt-1** („Fast richtig“, Auflösung)
- **Befund:** „Heute fehlen die Spitze und die Verkleidung“ stimmt nicht ganz. Unten sind an jeder Seite noch einzelne Verkleidungssteine erhalten. Die Zahlen stimmen: 146,5 m einst, 138,5 m heute, also etwa 8 m.
- **Beleg:** „Today a few of the casing stones from the lowest course can be seen in situ on each side“ (https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza).
- **Vorschlag:** „Heute fehlen die Spitze und fast die ganze Verkleidung.“

**building-giza-pyramids:stimmt-2** (Granit)
- **Stimmt.** Das Ministerium schreibt: „exterior was once entirely covered with high quality limestone … brought from Turah … by ship“ (egymonuments, Link oben). Granit aus Assuan gibt es innen, zum Beispiel in der Königskammer (Wikipedia, Lehner 1997).
- **Hinweis:** Bei der Mykerinos-Pyramide waren die unteren Lagen außen tatsächlich aus Granit. Darum immer „die große Pyramide“ schreiben. Das ist mein Fachwissen, dafür habe ich keine Quelle aufgerufen.

**history-stone_tools, „Ordne richtig“**
- **Reihenfolge und Zahlen stimmen:** 66 Millionen Jahre, 3,3 Millionen Jahre, Feuer etwa 1 Million Jahre, Pyramiden etwa 4.500 Jahre.
- **Falls Höhlenbilder als Teil dazukommen:** Die älteste sicher datierte Felskunst ist eine Hand-Schablone von mindestens 67.800 Jahren (Sulawesi, Nature, Januar 2026). Davor war ein Bild von etwa 51.200 Jahren der Rekord. „Vor mehr als 40.000 Jahren“ ist also richtig, aber vorsichtig. Beleg: https://www.smithsonianmag.com/smart-news/can-you-see-the-faded-outline-of-a-hand-archaeologists-say-this-67800-year-old-stencil-may-be-the-worlds-oldest-known-rock-art-180988054/

**Nebenbei: Notiz im Feld `pruefen` bei building-eiffel-tower:rate-3**
- Die offizielle Seite nennt einen Kreis von etwa 15 cm Durchmesser, den die Spitze an einem Sonnentag beschreibt. Für „18 cm“ habe ich keine seriöse Quelle gefunden. Die Frage selbst nennt keine Zahl und stimmt.

### Geprüft und passend (nur IDs)

animal-african-savanna-elephant:rate-2, animal-african-savanna-elephant:rate-3, animal-african-savanna-elephant:rate-4, animal-polar-bear:rate-1, animal-common-octopus:rate-1, animal-common-octopus:rate-2, history-stone_tools:rate-1, history-stone_tools:rate-2, history-stone_tools:rate-3, history-apollo11:rate-1, history-apollo11:rate-2, history-apollo11:rate-3, history-apollo11:rate-4, person-marie_curie:rate-1, person-marie_curie:rate-2, person-jane_goodall:rate-1, person-jane_goodall:rate-2, person-jane_goodall:rate-3, building-giza-pyramids:rate-1, building-giza-pyramids:rate-2, building-eiffel-tower:rate-1, building-eiffel-tower:rate-2, building-eiffel-tower:rate-3, science-water-cycle:rate-1, science-water-cycle:rate-2, science-water-cycle:rate-3, science-water-cycle-1, science-water-cycle-2, science-water-cycle-3, science-water-cycle:rate-4, science-photosynthesis-1, science-photosynthesis-2, science-photosynthesis-3, science-photosynthesis-4, science-pollination-1, science-pollination-2, science-pollination-3, science-fungi-1, science-fungi-3, science-fungi-4, science-coral-reef-1, science-coral-reef-2, science-coral-reef-3, science-coral-reef-4, science-moon-phases:rate-1, science-moon-phases:rate-2, science-moon-phases:rate-3, science-moon-phases-1, science-moon-phases-2, science-moon-phases-3, science-moon-phases-4, science-seasons-1, science-seasons-3, science-seasons-4, science-tides-1, science-tides-4, history-khipu:compare, history-khipu:limits, history-mohenjo-daro:compare, history-mohenjo-daro:limits, invention-bicycle:rate-2, invention-bicycle:rate-3, history-bronze:material, history-bronze:limits, person-maria_sibylla_merian:evidence, person-maria_sibylla_merian:limits, person-inge_lehmann:evidence, person-inge_lehmann:limits, sowie person-marie_curie:stimmt-1 (Teil C)

**Wichtige Belege zu den Fragen mit ⚠:**
- **Elefant rate-4:** San Diego Zoo, die Leitkuh ist „usually the oldest and most experienced female“ und hat die Aufgabe „to remember where and how to find food and water“. Foley u. a. 2008 (https://pmc.ncbi.nlm.nih.gov/articles/PMC2610102/) stützt das nur als Vermutung aus drei Gruppen.
- **Eisbär rate-1:** San Diego Zoo, „only pregnant females over-winter in dens … most … continue to hunt seals throughout the winter“.
- **Apollo rate-4:** NASA Mission Overview (https://www.nasa.gov/history/apollo-11-mission-overview/). Landung bei 102:45 Stunden, Start vom Mond bei 124:22 Stunden, Gesamtflug 195:18 Stunden. Daraus folgen etwa 4,3 Tage Hinflug, 0,9 Tage auf dem Mond und 3,0 Tage Rückflug.
- **Gizeh rate-2:** Tura-Kalkstein kam per Schiff (Ministerium, Link oben).
- **Goodall rate-2:** Jane Goodall Institute, „After months of trying to gain their trust“ (https://janegoodall.org/jane-goodalls-story/).
- **Jahreszeiten-3:** Perihel Anfang Januar laut NASA Space Place.

### Nicht geprüft

- **Ohne Quelle beurteilt, aus Fachwissen:** das Datum für Kamele als Lasttiere in Ägypten, Steine zum Nüsseknacken bei Schimpansen, Tulpe und Rose ohne Befruchtung, Korallen ohne Augen, die Breite des Erdschattens (2,7 Monddurchmesser), die Mondnähe unabhängig von der Phase. Gegen keine Aussage spricht etwas, aber ich habe keine Quelle aufgerufen.
- **Originalaufsätze nicht gelesen:** Scholander 1950 und Frisch u. a. 1974 zum nassen Eisbärfell kenne ich nur aus einer Zusammenfassung in Literaturlisten.
- **Unveränderte alte Texte nicht einzeln geprüft:** zum Beispiel „nach etwa 20 Minuten kann er stehen“ (Elefant rate-2), „97 von 100 Eimern“ (Wasserkreislauf rate-1) und die alten wrongReasons der Challenge-Fragen.
- **Nicht nachgelesen:** der aktuelle Text von toureiffel.paris (WebFetch bekam 403, die 15 cm stammen aus einem Suchauszug) und Britannica (403).
- **Nicht beurteilt:** Sprache und Schwierigkeit. Das ist Sache von `kinder-redaktion` und `stufen-pruefer`.
