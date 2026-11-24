# Tier-Fallen: Faktenprüfung (Bericht des `fakten-pruefer`)

Stand: 24.11.2026. Geprüft wurde jedes Paar aus dem [Entwurf](2026-11-24-tier-fallen-entwurf.md) („Tier & Lebensraum“, „Wer frisst was?“) gegen `app/world-catalog.json` und Quellen. Der Bericht ist unverändert übernommen. Was Claude daraus gemacht hat, steht unten unter „Umsetzung“.

## Streichen

Maßstab: Eine Falle wird gestrichen, wenn sie in Wirklichkeit ganz oder zum Teil passt. Das gilt über das ganze Verbreitungsgebiet und alle Lebensphasen oder wenn die Karte selbst darauf hinweist. „Grenzfall“ heißt: im Zweifel gestrichen. Ein gestrichener Text fällt in beiden Listen des Tieres weg (Entdecker und Profi).

### Lebensraum

```jsonl
{"spiel":"lebensraum","id":"animal-african-savanna-elephant","streichen":["Gebirge","Flüsse und Seen"],"grund":"Savannenelefanten leben auch an Berghängen (Aberdares, Kilimandscharo) und in Feuchtgebieten (Wikipedia African bush elephant: „from sea level to mountain slopes“, „wetlands“)."}
{"spiel":"lebensraum","id":"animal-lion","streichen":["Gebirge"],"grund":"Löwen wurden am Mount Elgon bis 3.600 m und am Mount Kenya nahe der Schneegrenze nachgewiesen (Wikipedia Lion)."}
{"spiel":"lebensraum","id":"animal-cheetah","streichen":["Gebirge","Wiesen und Gärten"],"grund":"In der Sahara bevorzugen Geparden Hochgebirge, im Iran hügeliges Gelände bis 2.000–3.000 m (Wikipedia Cheetah). Die Karte nennt Grasländer, „Wiesen“ passt also teilweise."}
{"spiel":"lebensraum","id":"animal-bengal-tiger","streichen":["Savanne","Hecken, Gärten und Waldränder","Flüsse und Seen"],"grund":"Die Karte nennt Grasland und Mangroven. Tiger leben im Terai-Grasland (Ökoregion „Terai-Duar savanna and grasslands“), schwimmen in den Sundarbans und nutzen Waldränder. Wikipedia Bengal tiger: „alluvial grasslands“, „mangroves“."}
{"spiel":"lebensraum","id":"animal-giraffe","streichen":["Wüste"],"grund":"„The Angolan giraffe can be found in desert environments“ (Wikipedia Giraffe), z. B. in der Namib."}
{"spiel":"lebensraum","id":"animal-giant-panda","streichen":["Hecken, Gärten und Waldränder"],"grund":"Der Panda lebt im Bergwald, auch im Sekundärwald, deshalb passt „Waldränder“ teilweise."}
{"spiel":"lebensraum","id":"animal-western-lowland-gorilla","streichen":["Hecken, Gärten und Waldränder"],"grund":"Gorillas nutzen Sekundärwald und Lichtungen („primary and secondary forest“, „clearings/bais“, Wikipedia Western lowland gorilla). Waldrand passt teilweise."}
{"spiel":"lebensraum","id":"animal-bornean-orangutan","streichen":["Hecken, Gärten und Waldränder"],"grund":"Der Orang-Utan ist ein Waldtier und lebt auch in gestörten Wäldern, deshalb passt „Waldränder“ teilweise."}
{"spiel":"lebensraum","id":"animal-emperor-penguin","streichen":["Trockene offene Landschaften"],"grund":"Die Antarktis gilt als die größte Kälte- bzw. Trockenwüste. Das ist ein bekanntes Kinderwissen, und Kolonien brüten auf offenem Eis."}
{"spiel":"lebensraum","id":"animal-green-sea-turtle","streichen":["Felsiger Meeresboden"],"grund":"Grenzfall: Erwachsene weiden auch Algen auf felsigen Küstenriffen, z. B. bei Hawaii, das die Karte nennt."}
{"spiel":"lebensraum","id":"animal-red-kangaroo","streichen":["Büsche und Bäume","Wiesen und Gärten","Wälder und Siedlungsräume"],"grund":"Die Karte nennt Grasland, Buschland und offene Wälder. Wikipedia Red kangaroo: „scrubland, grassland, and desert habitats“, „open habitats with some trees“."}
{"spiel":"lebensraum","id":"animal-koala","streichen":["Hecken, Gärten und Waldränder"],"grund":"Koalas leben auch an Waldrändern und in Gärten von Vororten Ostaustraliens."}
{"spiel":"lebensraum","id":"animal-jaguar","streichen":["Trockene offene Landschaften","Gebirge","Hecken, Gärten und Waldränder"],"grund":"Wikipedia Jaguar: „dry deciduous forests … dry grassland“, „recorded at elevations up to 3,800 m“, ein Jaguar in den Santa Rita Mountains. Waldrand passt teilweise."}
{"spiel":"lebensraum","id":"animal-honey-bee","streichen":["Savanne","Gebirge","Trockene offene Landschaften","Grasland","Wüste","Regenwald"],"grund":"Das Herkunftsgebiet umfasst ganz Afrika: A. m. scutellata lebt in der Tieflandsavanne, A. m. monticola im Bergwald (PMC-Studien, s. u.). Wikipedia nennt „desert areas“, A. m. adansonii kommt auch im feuchten Tropenklima vor."}
{"spiel":"lebensraum","id":"animal-axolotl","streichen":["Wälder und Siedlungsräume"],"grund":"Laut Karte lebt das Axolotl „in Mexiko-Stadt“, deshalb passt „Siedlungsräume“ aus gutem Grund."}
{"spiel":"lebensraum","id":"animal-garden-cross-spider","streichen":["Blütenreiche Landschaften","Grasland"],"grund":"Wiesen sind Grasland und oft blütenreich, beides passt also teilweise zu „Wiesen und Gärten“."}
{"spiel":"lebensraum","id":"animal-dromedary","streichen":["Savanne","Grasland"],"grund":"Dromedare leben in Trockensavannen des Sahel und Ostafrikas, verwilderte Tiere in Australien auch in trockenem Grasland."}
{"spiel":"lebensraum","id":"animal-white-tailed-eagle","streichen":["Arktis"],"grund":"Seeadler brüten in Grönland und Island (Wikipedia White-tailed eagle: „as far west as Greenland and Iceland“)."}
{"spiel":"lebensraum","id":"animal-platypus","streichen":["Regenwald"],"grund":"„The surrounding terrestrial environment includes tropical rainforests“ (Wikipedia Platypus)."}
{"spiel":"lebensraum","id":"animal-short-beaked-echidna","streichen":["Regenwald","Hecken, Gärten und Waldränder","Blütenreiche Landschaften"],"grund":"Das Säugetier mit der weitesten Verbreitung in Australien, auch in „outer suburbs“ und „possibly rainforests“ (Wikipedia). „Offene Landschaften“ schließt blütenreiche mit ein."}
{"spiel":"lebensraum","id":"animal-okapi","streichen":["Hecken, Gärten und Waldränder"],"grund":"Das Okapi ist ein Waldtier, deshalb passt „Waldränder“ teilweise."}
{"spiel":"lebensraum","id":"animal-ring-tailed-lemur","streichen":["Savanne","Wüste","Hecken, Gärten und Waldränder"],"grund":"Der Katta lebt von Galeriewald bis Dornbusch, und der Dornwald im Süden heißt oft „spiny desert“ (Wikipedia: „gallery forests to spiny scrub“). Eine Savanne passt zu „trockene Landschaften“."}
{"spiel":"lebensraum","id":"animal-north-american-beaver","streichen":["Regenwald"],"grund":"Grenzfall: Biber leben auch an Bächen im gemäßigten Regenwald an der Pazifikküste Nordamerikas."}
{"spiel":"lebensraum","id":"animal-red-fox","streichen":["Savanne","Blütenreiche Landschaften","Feuchte Wälder und Larvengewässer"],"grund":"„Wälder, Offenland“ schließt offene, blütenreiche und feuchte Waldlebensräume ein. Der Rotfuchs reicht bis in Steppen und Trockengebiete (Wikipedia Red fox)."}
{"spiel":"lebensraum","id":"animal-raccoon","streichen":["Gebirge"],"grund":"„They have extended their range to mountainous areas“ (Wikipedia Raccoon)."}
{"spiel":"lebensraum","id":"animal-hedgehog","streichen":["Grasland","Blütenreiche Landschaften"],"grund":"Igel suchen ihr Futter auch auf Weiden, Rasen und Wiesen, das passt teilweise."}
{"spiel":"lebensraum","id":"animal-barn-owl","streichen":["Gebirge","Gärten, Hecken und andere Verstecke","Blütenreiche Landschaften","Wüste"],"grund":"Wikipedia Western barn owl: „grasslands, savannas, heathlands … up to 4,000 m … agricultural landscapes and peri-urban areas“. Wüste ist ein Grenzfall (Nahost)."}
{"spiel":"lebensraum","id":"animal-kingfisher","streichen":["Hecken, Gärten und Waldränder"],"grund":"Grenzfall: Eisvögel jagen regelmäßig an Gartenteichen."}
{"spiel":"lebensraum","id":"animal-common-chameleon","streichen":["Wüste"],"grund":"Grenzfall: Das Verbreitungsgebiet reicht bis in die Trockengebiete Nordafrikas und rund ums Rote Meer (Wikipedia Common chameleon)."}
{"spiel":"lebensraum","id":"animal-fire-salamander","streichen":["Hecken, Gärten und Waldränder","Regenwald"],"grund":"„Feuchte Wälder“ und „Regenwald“ liegen im Wortsinn nah beieinander. Feuersalamander leben auch an Waldrändern und in waldnahen Gärten."}
{"spiel":"lebensraum","id":"animal-common-frog","streichen":["Blütenreiche Landschaften"],"grund":"Grasfrösche leben auf feuchten Wiesen, das passt teilweise."}
{"spiel":"lebensraum","id":"animal-european-eel","streichen":["Felsiger Meeresboden"],"grund":"Grenzfall: An der Küste verstecken sich Aale zwischen Steinen und Felsen."}
{"spiel":"lebensraum","id":"animal-monarch-butterfly","streichen":["Savannen und trockene offene Landschaften"],"grund":"Monarchfalter leben in offener Prärie und offenem Grasland mit Seidenpflanzen."}
{"spiel":"lebensraum","id":"animal-garden-snail","streichen":["Blütenreiche Landschaften","Grasland","Trockene offene Landschaften"],"grund":"Die Art stammt aus dem Mittelmeerraum und lebt dort auch in Dünen, trockenem Buschland und auf Grasflächen."}
```

### Nahrung

```jsonl
{"spiel":"nahrung","id":"animal-african-savanna-elephant","streichen":["Bambus"],"grund":"Elefanten fressen Bambus, wo er wächst (Bergbambuswälder in Ostafrika). Kinder kennen das auch von Elefanten im Zoo."}
{"spiel":"nahrung","id":"animal-lion","streichen":["Meerestiere"],"grund":"Grenzfall: Wüstenlöwen an der Skelettküste Namibias jagen Robben und Seevögel. Das ist gut dokumentiert, die Fundstelle habe ich aber nicht aufgerufen."}
{"spiel":"nahrung","id":"animal-cheetah","streichen":["Fische, Vögel und auch tote Tiere","Vor allem kleine Säugetiere"],"grund":"Die Karte selbst sagt „kleinere Antilopen, außerdem Hasen und Vögel“."}
{"spiel":"nahrung","id":"animal-giant-panda","streichen":["Fleisch","Kleine Beutetiere","Fisch und Meerestiere"],"grund":"„Will eat meat, fish, and eggs when available“ (Wikipedia Giant panda)."}
{"spiel":"nahrung","id":"animal-western-lowland-gorilla","streichen":["Ameisen und Termiten"],"grund":"Die Karte nennt „gelegentlich auch kleine Wirbellose“. Westliche Gorillas fressen nachweislich Termiten und Ameisen."}
{"spiel":"nahrung","id":"animal-bornean-orangutan","streichen":["Ameisen und Termiten","Nektar und Pollen"],"grund":"Wikipedia Bornean orangutan: Nahrung umfasst „flowers … honey … insects“. Die Karte nennt Insekten."}
{"spiel":"nahrung","id":"animal-emperor-penguin","streichen":["Kleine wirbellose Tiere","Fleisch"],"grund":"Laut Karte frisst er Krill und Tintenfische, das sind wirbellose Tiere. Als Fleischfresser passt „Fleisch“ teilweise."}
{"spiel":"nahrung","id":"animal-common-bottlenose-dolphin","streichen":["Kleine wirbellose Tiere","Fleisch"],"grund":"Laut Karte frisst er Tintenfische und Krebstiere (wirbellos). Als Fleischfresser passt „Fleisch“ teilweise."}
{"spiel":"nahrung","id":"animal-orca","streichen":["Vor allem kleine Säugetiere"],"grund":"Es gibt Orca-Gruppen, die vor allem Robben jagen. Das sagt die Karte selbst."}
{"spiel":"nahrung","id":"animal-common-octopus","streichen":["Algen und Zooplankton","Kleine Tiere im Plankton","Fleisch"],"grund":"Junge Kraken (Paralarven) treiben im Plankton und fressen Zooplankton (Nande et al. 2017, Frontiers in Physiology). Der erwachsene Krake jagt Fische und Krebse."}
{"spiel":"nahrung","id":"animal-green-sea-turtle","streichen":["Meerestiere","Früchte, Blätter und auch Insekten"],"grund":"Wikipedia: Jungtiere fressen „jellyfish … insects … leaves, tree bark“. Die Karte sagt selbst, dass Jungtiere auch kleine Tiere fressen. Erwachsene fressen in manchen Gebieten Mangrovenblätter."}
{"spiel":"nahrung","id":"animal-jaguar","streichen":["Vor allem kleine Säugetiere"],"grund":"Grenzfall: Die Karte nennt Gürteltiere als Beute."}
{"spiel":"nahrung","id":"animal-axolotl","streichen":["Vor allem Insekten","Kleine Tiere im Plankton"],"grund":"Laut Karte frisst es Insekten. Jungtiere fressen Kleinkrebse aus dem Plankton, z. B. Wasserflöhe."}
{"spiel":"nahrung","id":"animal-whale-shark","streichen":["Kleine wirbellose Tiere"],"grund":"Plankton besteht großteils aus kleinen wirbellosen Tieren (Krill, Ruderfußkrebse)."}
{"spiel":"nahrung","id":"animal-garden-cross-spider","streichen":["Nektar und Pollen","Pflanzliches Material","Ameisen und Termiten"],"grund":"Junge Kreuzspinnen fressen Pollen aus dem Netz, etwa 25 % ihrer Nahrung (Eggs & Sanders 2013, PLoS ONE). Fliegende Ameisen und Termiten sind Insekten im Netz."}
{"spiel":"nahrung","id":"animal-platypus","streichen":["Vor allem Insekten"],"grund":"„It feeds on insect larvae, annelid worms, shrimp …“ (Wikipedia Platypus). Insektenlarven sind der Hauptteil."}
{"spiel":"nahrung","id":"animal-meerkat","streichen":["Ameisen und Termiten"],"grund":"Erdmännchen fressen Ameisen und Termiten. Der afrikaanse Name „mierkat“ heißt „Ameisenkatze“ (Wikipedia Meerkat)."}
{"spiel":"nahrung","id":"animal-ring-tailed-lemur","streichen":["Ameisen und Termiten"],"grund":"Der richtige Text sagt „auch Insekten“. Wikipedia: frisst Gliederfüßer und „termite mounds“."}
{"spiel":"nahrung","id":"animal-hedgehog","streichen":["Ameisen und Termiten"],"grund":"Ameisen sind kleine wirbellose Tiere und gehören zur Igelnahrung."}
{"spiel":"nahrung","id":"animal-kingfisher","streichen":["Fleisch"],"grund":"Fischfresser sind Fleischfresser, „Fleisch“ passt also teilweise."}
{"spiel":"nahrung","id":"animal-ostrich","streichen":["Ameisen und Termiten"],"grund":"Grenzfall: „auch kleine Tiere“, Strauße fressen auch Insekten."}
{"spiel":"nahrung","id":"animal-common-chameleon","streichen":["Ameisen und Termiten"],"grund":"Hautflügler (Hymenoptera, dazu gehören Ameisen) sind häufige Beute (Wikipedia Common chameleon)."}
{"spiel":"nahrung","id":"animal-fire-salamander","streichen":["Ameisen und Termiten","Kleine Wassertiere","Algen und Zooplankton"],"grund":"Ameisen sind wirbellos. Die Larven leben im Bach und fressen kleine Wassertiere, auch Wasserflöhe. Der richtige Text grenzt nicht auf Erwachsene ein."}
{"spiel":"nahrung","id":"animal-common-frog","streichen":["Ameisen und Termiten","Kleine Wassertiere","Kleine Tiere im Plankton"],"grund":"Das sind alles „kleine Tiere“. Junge Frösche fressen Kleinstgliederfüßer (Wikipedia Common frog)."}
{"spiel":"nahrung","id":"animal-eastern-clown-anemonefish","streichen":["Krill"],"grund":"Grenzfall: Krill gehört zum Zooplankton, das ist der richtige Text."}
{"spiel":"nahrung","id":"animal-european-eel","streichen":["Insekten","Kleine Tiere im Plankton","Fleisch"],"grund":"Wikipedia European eel: „aquatic insects, terrestrial insects … occasionally plankton“, frisst auch Fische und Aas."}
{"spiel":"nahrung","id":"animal-monarch-butterfly","streichen":["Früchte, Blätter und auch Insekten"],"grund":"Die Raupen fressen Blätter (der Seidenpflanze), deshalb passt die Falle teilweise."}
{"spiel":"nahrung","id":"animal-european-lobster","streichen":["Algen und Zooplankton","Kleine Tiere im Plankton"],"grund":"Hummerlarven treiben im Plankton und fressen Zooplankton. Der richtige Text grenzt keine Lebensphase ein."}
{"spiel":"nahrung","id":"animal-common-cuttlefish","streichen":["Vor allem wirbellose Bodentiere","Kleine Tiere im Plankton"],"grund":"Sepien jagen vor allem Krebse am Boden. Jungtiere fressen kleine Krebschen wie Schwebegarnelen."}
{"spiel":"nahrung","id":"animal-short-snouted-seahorse","streichen":["Vor allem wirbellose Bodentiere"],"grund":"Grenzfall: Seepferdchen fressen kleine Krebschen wie Flohkrebse am Boden und an Pflanzen."}
```

### Zu kurze Listen nach dem Streichen (Profi braucht 3, Entdecker 2)

- Lebensraum Profi: Honigbiene 0, Kurzschnabeligel 1 („Arktis“), Rotfuchs 1 („Regenwald“), Schleiereule 2 („Regenwald“, „Arktis“), Feuersalamander 2 („Küsten und offenes Meer“, „Arktis“).
- Nahrung Profi: Orang-Utan 2 („Algen und Zooplankton“, „Eukalyptusblätter“).
- Für diese Tiere sollten Wasser- oder Polar-Fallen aufgefüllt werden, die eindeutig nicht passen. Achtung: Für Rotfuchs, Schleiereule und Kurzschnabeligel nicht „Wüste“ nehmen, für Rotfuchs auch nicht „Arktis“.
- Alle Entdecker-Listen behalten mindestens 2. Knapp sind: Panda-Nahrung 2, Bengaltiger-Lebensraum 3.

## Richtige Texte mit Fehlern

Sachlich falsch ist keiner. Drei haben Einschränkungen:

- **Dromedar, Lebensraum „Wüste“ zur Frage „in freier Natur“:** Wilde Dromedare gibt es seit etwa 2.000 Jahren nicht mehr. Nur in Australien leben verwilderte Tiere. Beleg: Wikipedia Dromedary: „has not occurred naturally in the wild for nearly 2,000 years … A feral population occurs in Australia“. Die Karte sagt es selbst („Menschen halten es“). Die Frage passt bei diesem Tier schlecht.
- **Honigbiene, „Wiesen & Gärten“ zu „in freier Natur“:** Laut Karte nisten wilde Völker in Baumhöhlen, also im Wald. Gärten sind keine freie Natur. Das ist eine Vereinfachung, kein Fehler.
- **Axolotl, „Flüsse & Seen“:** Das Axolotl lebt in Seen und Kanälen (Xochimilco, Chalco), nicht in Flüssen. Beleg: Wikipedia Axolotl: „native to the freshwater lakes of Xochimilco and Chalco … now existing mainly as canals“. Geringfügig.
- Am Rand: Der Kurzschnabeligel frisst neben Ameisen und Termiten auch viele Käferlarven (in einer Studie 37 %, Wikipedia Short-beaked echidna). „Ameisen und Termiten“ ist vertretbar verkürzt.

## Geprüft ohne Befund

- Lebensraum: 14 von 48 Tieren (Eisbär, Blauwal, Großer Tümmler, Orca, Gewöhnlicher Krake, Walhai, Erdmännchen, Walross, Afrikanischer Strauß, Papageitaucher, Echter Clownfisch, Europäischer Hummer, Gewöhnliche Sepia, Kurzschnäuziges Seepferdchen).
- Nahrung: 18 von 48 Tieren (Bengaltiger, Giraffe, Eisbär, Blauwal, Rotes Riesenkänguru, Koala, Westliche Honigbiene, Dromedar, Seeadler, Kurzschnabeligel, Okapi, Nordamerikanischer Biber, Walross, Rotfuchs, Waschbär, Schleiereule, Papageitaucher, Gefleckte Weinbergschnecke).
- Bewusst behalten, obwohl knapp:
  - Eisbär: „Wüste“ und „Trockene offene Landschaften“. Eisbären leben vor allem auf Meereis, anders als der Kältewüsten-Fall beim Pinguin.
  - Panda: „Regenwald“. Pandas leben in kühlen Nadel- und Laubwäldern, nicht im Regenwald.
  - Axolotl: „Gebirge“. Es lebt im Hochland, aber nicht im Gebirge.
  - „Krill“ bei Tümmler, Krake, Hummer, Sepia, Seepferdchen und Aal: Keines dieser Tiere frisst nachweislich Krill.
  - „Fleisch“ bei Axolotl und Hummer: Sie fressen vor allem Wirbellose.

## Nicht geprüft / Grenzen

- Vor allem die englische Wikipedia als Volltext, über die Programmierschnittstelle (API); hier geht es um Lebensräume und Nahrung, nicht um Zahlen. Primärquellen nur für drei Punkte, und auch die nur aus Suchergebnissen, ohne Volltext:
  - Pollen bei der Kreuzspinne: https://pmc.ncbi.nlm.nih.gov/articles/PMC3843719/ (Eggs & Sanders 2013, PLoS ONE; zitiert Smith & Mommsen 1984, Science)
  - Nahrung junger Kraken: https://www.frontiersin.org/articles/10.3389/fphys.2017.00573
  - Honigbienen-Unterarten in Savanne und Bergwald: https://pmc.ncbi.nlm.nih.gov/articles/PMC6523158 und https://pmc.ncbi.nlm.nih.gov/articles/PMC5444601
- Ohne aufgerufene Fundstelle, aus Fachwissen und als Grenzfall markiert: Wüstenlöwen fressen Robben, Gorillas fressen Termiten, Meeresschildkröten weiden auf felsigen Riffen, Biber leben im gemäßigten Regenwald, Schleiereulen in der Wüste, Chamäleons in der Wüste, Aale zwischen Felsen, Hummer- und Sepia-Larven fressen Plankton, Monarchfalter leben in der Prärie, Weinbergschnecken in Dünen.
- Die Wikipedia-Seiten zu Monarchfalter, Okapi und Strauß ließen sich nicht laden (Abruflimit). Diese Tiere nur aus Fachwissen und den Kartentexten beurteilt.
- Die Streichungen sind bewusst streng („im Zweifel streichen“), und die Grenze ist teils ein Urteil. Ob z. B. „Waldränder“ bei reinen Waldtieren wirklich zum Raten verleitet, soll der `stufen-pruefer` mitbewerten.
- Nicht geprüft: die Spiel-Logik (wie Fallen gezogen werden, ob gleiche Texte doppelt erscheinen können) und die Karten außerhalb der Felder `intro`, `facts`, `animal.habitat` und `animal.diet`.
- Geprüfte Datei: `docs/entwurf/2026-11-24-tier-fallen-entwurf.md`, verglichen mit `app/world-catalog.json`.

## Umsetzung (Claude, 24.11.2026)

- Alle 112 gestrichenen Paare (64 Zeilen) sind aus `app/world-game-tier-fallen.json` entfernt, in beiden Listen des Tieres.
- Zu kurze Listen wurden **nur mit schon geprüften Paaren** aufgefüllt: Fehlt Profi eine vierte Falle, kommen Entdecker-Fallen desselben Tieres dazu, und umgekehrt (z. B. Honigbiene Profi, Rotfuchs Profi, Panda-Nahrung Entdecker). Neue, ungeprüfte Paare kamen nicht hinzu. Für diese Tiere ist Profi dadurch etwas leichter (deutlich andere statt ähnlicher Fallen); das ist ehrlicher als eine Falle, die doch passt.
- Jede Liste hat danach mindestens 3 Entdecker- und 4 Profi-Fallen (Test in `tests/world-game-runde.test.mjs`).
- Verschoben ins BACKLOG: die Frage „in freier Natur“ beim Dromedar (wilde Dromedare gibt es nicht mehr), „Wiesen & Gärten“ bei der Honigbiene und „Flüsse & Seen“ beim Axolotl (Kartentexte, Phase 2).
