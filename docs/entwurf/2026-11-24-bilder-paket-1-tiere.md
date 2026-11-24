# Bilder, Paket 1: Originalfotos für 24 Tierkarten (24.11.2026)

Bericht der `bild-recherche` (Bilder-Strang, BACKLOG Phase 1, Punkt 26; Regel „Immer zuerst Originalfotos“). Unverändert übernommen. Die Vorschlagsliste für das Einbau-Skript steht in [`docs/bilder/vorschlaege-2026-11-24-paket-1.json`](../bilder/vorschlaege-2026-11-24-paket-1.json). Noch nichts ist eingebaut; Claude sieht jedes Bild vor dem Einbau groß an. Claudes Umsetzung steht am Ende.

## Zusammenfassung

Für alle 24 Karten gibt es ein freies Original mit erlaubter Lizenz (gemeinfrei, CC0, CC BY, CC BY-SA). Jedes Foto ist mindestens 2000 px breit, zugleich der kleinste Wert (Clownfisch, 2000 px). Hochgerechnet oder hochskaliert wurde nichts.

Schwierig war:
- **Seepferdchen:** fast alle freien Fotos sind Hochformat oder aus Aquarien. Das beste Bild ist ein quadratnahes Hochformat, der Kopf wird im flachen Streifen abgeschnitten (siehe Block).
- **Clownfisch:** Die Karte trennt *Amphiprion percula* ausdrücklich von *A. ocellaris*. Viele Commons-Fotos "percula" sind laut ihrer eigenen Beschreibung *ocellaris* (z. B. Karelj, Janderk). Ich habe ein iNaturalist-Foto aus der Kategorie "Amphiprion percula in Queensland" gewählt.
- **Okapi:** Alle freien Fotos sind Zoo-Fotos. Ich fand kein freies Wildfoto. Das gewählte Bild zeigt kein Gitter und keine Scheibe.
- **Aal und Hummer:** Es gab wenig scharfe Ganzkörperfotos, die nicht aus Fischständen, Labor oder Aquarium stammen.

**Wichtige Hinweise vorab:**
1. **Weinbergschnecke:** Die Karte `animal-garden-snail` heißt "Gefleckte Weinbergschnecke". Das ist *Cornu aspersum* (Garten-Schnirkelschnecke, früher *Helix aspersa*). Das ist **nicht** *Helix pomatia*, wie im Auftrag stand. Ich habe *Cornu aspersum* gewählt, weil der Kartentitel das so verlangt. Bitte vor dem Einbau gegen den Kartentext prüfen.
2. **Clownfisch:** Der Kartentext verlangt *A. percula*, das Wunschbeispiel im Auftrag (*percula*) passt dazu.
3. **Gemeinfreie Bilder:** Biber und Walross haben keinen Lizenz-Link (US-Behörden). Bei Public Domain bitte statt der Lizenz-URL die Commons-Seite verlinken.
4. **Prüfumfang:** Ich habe Lizenz, Urheber, Größe, Beschreibung und Kategorien über die Commons-API gelesen. Die Motive habe ich nur auf 420-px-Vorschauen gesichtet. Die Schärfe der Originale habe ich nicht in voller Größe geprüft, und es wurde nichts heruntergeladen oder eingebaut.
5. **Art-Sicherheit:** Die Bestimmung ergibt sich aus Dateititel und Commons-Kategorie, nicht aus eigener Fachprüfung. Wo es kniffliger ist, steht es unter `art_geprueft`.
6. **API-Drosselung:** Wikimedia drosselte die Anfragen zeitweise (HTTP 429, geteilte Adresse). Der Lauf wurde dadurch langsamer, die Ergebnisse sind nicht betroffen.
7. **Foto-IDs:** Alle 24 IDs sind neu. Gegen die 60 vorhandenen Schlüssel in `app/world-photos.json` gibt es keine Kollision.
8. **Streifen-Hinweis:** Bei `object-fit: cover` im Querstreifen gilt allgemein: Hochformatige Tiere wie Meerkat und Seepferdchen, und fast bildfüllende Tiere wie Waschbär, Walross und Okapi verlieren oben oder unten etwas. Ab etwa 2,5 zu 1 Streifenformat gilt das für alle Fotos im 3:2-Format. Die Hinweise stehen je Karte.

---

## Die 24 Blöcke

```json
{
  "karte": "animal-platypus",
  "foto_id": "platypus",
  "commons_datei": "File:Duck-billed platypus (Ornithorhynchus anatinus) Scottsdale.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Duck-billed_platypus_(Ornithorhynchus_anatinus)_Scottsdale.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Duck-billed_platypus_%28Ornithorhynchus_anatinus%29_Scottsdale.jpg",
  "original_breite": 5022,
  "original_hoehe": 3348,
  "author": "Charles J. Sharp",
  "license": "CC BY-SA 4.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
  "alt_de": "Ein Schnabeltier schwimmt im Wasser, man sieht seinen breiten Schnabel, den Körper und den flachen Schwanz.",
  "art_geprueft": "Ornithorhynchus anatinus laut Commons-Kategorie und Beschreibung (Scottsdale, Tasmanien, 14.11.2023); sicher",
  "querstreifen": "Tier liegt waagerecht in der unteren Bildmitte, ganzes Tier sichtbar; ab etwa 2,5:1 Streifenformat wird Schnabel oder Schwanz knapp",
  "risiken": "keine; Tier schwimmt frei im Wasser, ob wild oder Anlage ist aus den Angaben nicht ersichtlich, kein Gitter oder Scheibe sichtbar; Namensnennung und Weitergabe unter gleichen Bedingungen nötig",
  "alternative": "File:Duck-billed platypus (Ornithorhynchus anatinus) Scottsdale 5.jpg (4455x2970, gleiche Lizenz und Urheber)"
}
```

```json
{
  "karte": "animal-short-beaked-echidna",
  "foto_id": "short-beaked-echidna",
  "commons_datei": "File:Short-beaked Echidna - Tachyglossus aculeatus (51749103282).jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Short-beaked_Echidna_-_Tachyglossus_aculeatus_(51749103282).jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Short-beaked_Echidna_-_Tachyglossus_aculeatus_%2851749103282%29.jpg",
  "original_breite": 3190,
  "original_hoehe": 2112,
  "author": "Gregory Smith",
  "license": "CC BY-SA 2.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/2.0/deed.en",
  "alt_de": "Ein Ameisenigel läuft im Gras. Sein Rücken ist voller Stacheln und er hat eine lange, schmale Schnauze.",
  "art_geprueft": "Tachyglossus aculeatus laut Commons-Kategorie; Beschreibung nennt Tasmanien (2007); sicher",
  "querstreifen": "Tier mittig, ganzes Tier mit Schnauze sichtbar, auf grünem Gras",
  "risiken": "keine; Wildtier; Namensnennung und Weitergabe unter gleichen Bedingungen nötig",
  "alternative": "File:Short-beaked echidna (Tachyglossus aculeatus) Freycinet.jpg (4440x2960, CC BY-SA 4.0, Charles J. Sharp)"
}
```

```json
{
  "karte": "animal-okapi",
  "foto_id": "okapi",
  "commons_datei": "File:Saint-Aignan (Loir-et-Cher). Okapi.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Saint-Aignan_(Loir-et-Cher)._Okapi.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Saint-Aignan_%28Loir-et-Cher%29._Okapi.jpg",
  "original_breite": 3008,
  "original_hoehe": 2008,
  "author": "Daniel Jolivet",
  "license": "CC BY 2.0",
  "license_url": "https://creativecommons.org/licenses/by/2.0/deed.en",
  "alt_de": "Ein Okapi geht über eine Wiese. Es hat einen dunklen Körper und weiße Streifen an den Beinen, ähnlich wie ein Zebra.",
  "art_geprueft": "Okapia johnstoni laut Commons-Kategorie und Beschreibung (Männchen, ZooParc de Beauval); sicher",
  "querstreifen": "Tier mittig mit Rand, ganzes Tier sichtbar; bei sehr flachem Streifen verlieren die Beine unten die Hufe",
  "risiken": "Zootier (kein freies Wildfoto gefunden), im Bild kein Gitter und keine Scheibe; Namensnennung nötig, Bearbeitungshinweis wegen Zuschnitt",
  "alternative": "File:Okapi (Okapia johnstoni) at Jacksonville Zoo.jpg (3264x2448, CC BY-SA 3.0, Moe Epsilon)"
}
```

```json
{
  "karte": "animal-meerkat",
  "foto_id": "meerkat",
  "commons_datei": "File:112 Meerkat standing in the Kalahari Desert of Namibia Photo by Giles Laurent.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:112_Meerkat_standing_in_the_Kalahari_Desert_of_Namibia_Photo_by_Giles_Laurent.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/c/ca/112_Meerkat_standing_in_the_Kalahari_Desert_of_Namibia_Photo_by_Giles_Laurent.jpg",
  "original_breite": 5535,
  "original_hoehe": 3690,
  "author": "Giles Laurent",
  "license": "CC BY-SA 4.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
  "alt_de": "Ein Erdmännchen steht aufrecht auf rotem Sand und schaut sich um.",
  "art_geprueft": "Suricata suricatta suricatta laut Commons-Kategorie, Kalahari, Namibia (2025); sicher",
  "querstreifen": "Tier mittig und aufrecht, ganzes Tier sichtbar im 3:2-Bild; bei flachem Streifen (>2:1) werden Kopf oder Füße abgeschnitten",
  "risiken": "keine; Wildtier; Namensnennung und Weitergabe unter gleichen Bedingungen nötig",
  "alternative": "File:Suricatos (Suricata suricatta), parque nacional Makgadikgadi Pans, Botsuana, 2018-07-30, DD 26.jpg (6663x5446, CC BY-SA 4.0, Diego Delso; zwei Erdmännchen, ebenfalls hochformatig-nah)"
}
```

```json
{
  "karte": "animal-ring-tailed-lemur",
  "foto_id": "ring-tailed-lemur",
  "commons_datei": "File:Ring-tailed lemur (Lemur catta) 2.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Ring-tailed_lemur_(Lemur_catta)_2.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/4/40/Ring-tailed_lemur_%28Lemur_catta%29_2.jpg",
  "original_breite": 5741,
  "original_hoehe": 3827,
  "author": "Charles J. Sharp",
  "license": "CC BY-SA 4.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
  "alt_de": "Ein Katta beugt sich am Wasser zum Trinken herunter. Sein langer Schwanz hat schwarze und weiße Ringe.",
  "art_geprueft": "Lemur catta laut Commons-Kategorie, Andasibe-Mantadia, Madagaskar (2018); sicher",
  "querstreifen": "Tier liegt waagerecht, ganzer Katta mit Ringelschwanz sichtbar, links im Bild; bei flachem Streifen bleibt er knapp im Rahmen",
  "risiken": "keine; Katta ist im Park in Madagaskar fotografiert (ob frei lebend oder an Menschen gewöhnt, ist nicht angegeben); Namensnennung und Weitergabe unter gleichen Bedingungen nötig",
  "alternative": "File:ZSL London - Ring-tailed lemur (02).jpg (4144x3456, CC BY-SA 4.0, Katie Chan; Zootier im London Zoo)"
}
```

```json
{
  "karte": "animal-north-american-beaver",
  "foto_id": "north-american-beaver",
  "commons_datei": "File:North American beaver (Castor canadensis) (46677957975).jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:North_American_beaver_(Castor_canadensis)_(46677957975).jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/a/a1/North_American_beaver_%28Castor_canadensis%29_%2846677957975%29.jpg",
  "original_breite": 6016,
  "original_hoehe": 4000,
  "author": "Glacier National Park Service (Flickr-Konto GlacierNPS, U.S. National Park Service)",
  "license": "Public domain (US NPS)",
  "license_url": null,
  "alt_de": "Ein Biber sitzt am Ufer im trockenen Gras. Sein Fell ist braun und nass.",
  "art_geprueft": "Castor canadensis laut Dateititel und Commons-Kategorie (Glacier-Nationalpark, 11.04.2019); sicher",
  "querstreifen": "Tier mittig links, ganzer Körper mit Schwanz sichtbar; bei flachem Streifen wird oben etwas Gras abgeschnitten, Tier bleibt",
  "risiken": "keine; Wildtier; gemeinfrei als Werk einer US-Bundesbehörde (Commons-Vorlage PD US NPS), Quelle trotzdem angeben; keine Lizenz-URL, stattdessen Commons-Seite",
  "alternative": "File:North American beaver (Castor canadensis) (47593489151).jpg (6016x4000, gleiche Herkunft; Biber im Wasser vor Biberburg)"
}
```

```json
{
  "karte": "animal-walrus",
  "foto_id": "walrus",
  "commons_datei": "File:Pacific Walrus - Bull (8247646168).jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Pacific_Walrus_-_Bull_(8247646168).jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/2/22/Pacific_Walrus_-_Bull_%288247646168%29.jpg",
  "original_breite": 3072,
  "original_hoehe": 2048,
  "author": "Joel Garlich-Miller, U.S. Fish and Wildlife Service",
  "license": "Public domain (US FWS)",
  "license_url": null,
  "alt_de": "Ein großes Walross sitzt auf dem Eis und schaut in die Kamera. Es hat zwei lange Stoßzähne und einen Schnurrbart.",
  "art_geprueft": "Odobenus rosmarus divergens (Pazifisches Walross) laut Commons-Kategorie, Alaska, 2004; Art sicher, Unterart ist Pazifik (Karte nennt nur Odobenus rosmarus)",
  "querstreifen": "Tier füllt das Bild, Kopf mit Stoßzähnen in der Mitte; bei flachem Streifen wird der Körper unten abgeschnitten, Kopf bleibt",
  "risiken": "keine; Wildtier, gemeinfrei (Werk einer US-Bundesbehörde, Flickr-Konto FWS Headquarters); Quelle trotzdem angeben; keine Lizenz-URL, stattdessen Commons-Seite",
  "alternative": "File:NOR-2016-Svalbard-Sjuøyane-Phippsøya-Atlantic Walrus (Odobenus rosmarus rosmarus) 04.jpg (6665x3750, CC BY-SA 4.0, Godot13; Gruppe auf Fels im Meer, Atlantisches Walross)"
}
```

```json
{
  "karte": "animal-red-fox",
  "foto_id": "red-fox",
  "commons_datei": "File:Portrait of a red fox in Rautas fjällurskog.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Portrait_of_a_red_fox_in_Rautas_fj%C3%A4llurskog.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Portrait_of_a_red_fox_in_Rautas_fj%C3%A4llurskog.jpg",
  "original_breite": 5568,
  "original_hoehe": 3712,
  "author": "ClaudiaTen",
  "license": "CC BY-SA 4.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
  "alt_de": "Ein Rotfuchs steht im weißen Schnee. Sein Fell ist orange, der Schwanz buschig, die Pfoten sind schwarz.",
  "art_geprueft": "Vulpes vulpes laut Commons-Kategorie (Featured Picture, Schweden, 2022); sicher",
  "querstreifen": "Fuchs mittig im Schnee, ganzes Tier mit Schwanz sichtbar; bei flachem Streifen wird oben und unten nur Schnee abgeschnitten",
  "risiken": "keine; Wildtier; Namensnennung und Weitergabe unter gleichen Bedingungen nötig",
  "alternative": "File:Red Fox drinking from a lake in Gennevilliers, France.jpg (6291x4194, CC BY 4.0, Alexis Lours)"
}
```

```json
{
  "karte": "animal-raccoon",
  "foto_id": "raccoon",
  "commons_datei": "File:Raccoon in Central Park (35264).jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Raccoon_in_Central_Park_(35264).jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Raccoon_in_Central_Park_%2835264%29.jpg",
  "original_breite": 3855,
  "original_hoehe": 3019,
  "author": "Rhododendrites",
  "license": "CC BY-SA 4.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
  "alt_de": "Ein Waschbär steht auf einem Waldweg zwischen Felsen. Er hat eine schwarze Maske um die Augen und einen geringelten Schwanz.",
  "art_geprueft": "Procyon lotor laut Beschreibung und Kategorie (Central Park, New York, 2022); sicher",
  "querstreifen": "Tier mittig, ganzer Waschbär sichtbar, Bild fast 4:3; im flachen Streifen verliert er Füße oder Kopf, besser nicht über etwa 2:1 beschneiden",
  "risiken": "keine; Wildtier in einer Stadtanlage; Namensnennung und Weitergabe unter gleichen Bedingungen nötig; Commons-Kategorie 'Retouched pictures' (leichte Bearbeitung)",
  "alternative": "File:Raton laveur commun (Procyon lotor).jpg (4085x2537, CC BY-SA 4.0, Clément Bardot; Tierpark Domaine du Pescheray, nur Kopf und Vorderkörper, hell gefärbt)"
}
```

```json
{
  "karte": "animal-hedgehog",
  "foto_id": "hedgehog",
  "commons_datei": "File:West European Hedgehog (Erinaceus europaeus)1.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:West_European_Hedgehog_(Erinaceus_europaeus)1.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/a/aa/West_European_Hedgehog_%28Erinaceus_europaeus%291.jpg",
  "original_breite": 2500,
  "original_hoehe": 1662,
  "author": "Hrald",
  "license": "CC BY-SA 3.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/3.0/deed.en",
  "alt_de": "Ein Igel läuft im Wald über Laub und Moos. Sein Rücken ist voller Stacheln.",
  "art_geprueft": "Erinaceus europaeus laut Dateititel und Beschreibung (Emmerdennen, Emmen, Niederlande, 2009); sicher (dort kommt keine Schwesterart vor, kein eigener Fachcheck)",
  "querstreifen": "Igel mittig links, ganz sichtbar; bei flachem Streifen bleibt er im Rahmen",
  "risiken": "Datei steht auch unter GFDL (Doppellizenz), wir nutzen CC BY-SA 3.0; Bildbreite nur 2500 px (ausreichend); Namensnennung und Weitergabe unter gleichen Bedingungen nötig",
  "alternative": "File:Erinaceus europaeus LC0119.jpg (2002x1500, CC BY-SA 2.0 DE, Jörg Hempel; Igel im Herbstlaub, Kopf nah am Rand)"
}
```

```json
{
  "karte": "animal-barn-owl",
  "foto_id": "barn-owl",
  "commons_datei": "File:Front view of a barn owl - Tyto alba - in flight.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Front_view_of_a_barn_owl_-_Tyto_alba_-_in_flight.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/a/a8/Front_view_of_a_barn_owl_-_Tyto_alba_-_in_flight.jpg",
  "original_breite": 6629,
  "original_hoehe": 3318,
  "author": "Dannymoore1973 (Commons-Feld: 'Dannymoore1973, Minor edits made by Subsidiary account')",
  "license": "CC0 1.0",
  "license_url": "https://creativecommons.org/publicdomain/zero/1.0/deed.en",
  "alt_de": "Eine Schleiereule fliegt direkt auf uns zu. Ihr Gesicht ist weiß und herzförmig, die Flügel sind weit ausgebreitet.",
  "art_geprueft": "Tyto alba laut Dateititel und Commons-Kategorie 'Tyto alba in flight'; sicher",
  "querstreifen": "2:1-Bild, Eule genau mittig, mit ausgebreiteten Flügeln, blauer Himmel; ganzes Tier bleibt auch im flachen Streifen",
  "risiken": "Herkunft Pixabay (Commons-Kategorie 'Images from Pixabay'); Ort unbekannt, evtl. Greifvogelschau, nicht angegeben; CC0 laut Commons, Urheberfeld enthält einen Bearbeitungsvermerk des Hochladenden; Ich habe die Pixabay-Quelle nicht selbst geöffnet",
  "alternative": "File:Tyto alba tylluan wen.jpg (3090x2438, CC BY-SA 4.0, Alun Williams333; Eule sitzt auf Pfosten, Wales, 2016)"
}
```

```json
{
  "karte": "animal-kingfisher",
  "foto_id": "kingfisher",
  "commons_datei": "File:Eisvogel kingfisher.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Eisvogel_kingfisher.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/d/d2/Eisvogel_kingfisher.jpg",
  "original_breite": 4928,
  "original_hoehe": 3264,
  "author": "Frank-2.0",
  "license": "CC0 1.0",
  "license_url": "https://creativecommons.org/publicdomain/zero/1.0/deed.en",
  "alt_de": "Ein Eisvogel sitzt auf einem Ast mit Moos. Er hat einen blauen Rücken, eine orange Brust und einen langen, spitzen Schnabel.",
  "art_geprueft": "Alcedo atthis ispida laut Commons-Kategorie (Featured Picture); sicher",
  "querstreifen": "Vogel mittig links auf dem Ast, ganz sichtbar; bei flachem Streifen wird unten und oben nur der unscharfe Hintergrund abgeschnitten",
  "risiken": "keine; Ort laut Commons unbekannt ('Birds in unidentified locations'); CC0 aus Flickr übernommen (Flickr-Review durch Bot vermerkt)",
  "alternative": "File:Common Kingfisher 2025 09 28 03.jpg (5993x3995, CC BY 4.0, Alexis Lours; Weibchen auf Ast, Rückenansicht)"
}
```

```json
{
  "karte": "animal-ostrich",
  "foto_id": "ostrich",
  "commons_datei": "File:Masai ostrich (Struthio camelus massaicus) male Serengeti.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Masai_ostrich_(Struthio_camelus_massaicus)_male_Serengeti.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/8/86/Masai_ostrich_%28Struthio_camelus_massaicus%29_male_Serengeti.jpg",
  "original_breite": 6281,
  "original_hoehe": 4187,
  "author": "Charles J. Sharp",
  "license": "CC BY-SA 4.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
  "alt_de": "Ein Strauß-Männchen geht über die Grassteppe. Er hat schwarze Federn, einen langen nackten Hals und lange Beine.",
  "art_geprueft": "Struthio camelus massaicus (Massai-Strauß, Unterart von Struthio camelus) laut Dateititel und Kategorie, Serengeti, Tansania; Art sicher, Unterart nur aus Dateititel",
  "querstreifen": "Strauß steht links der Mitte, ganz sichtbar mit Hals, klein im Bild (viel Steppe); im flachen Streifen bleibt er komplett",
  "risiken": "keine; Wildtier; Namensnennung und Weitergabe unter gleichen Bedingungen nötig; Aufnahmedatum im Commons-Eintrag 03.08.2026",
  "alternative": "File:Avestruz (Struthio camelus), parque nacional de Amboseli, Kenia, 2024-05-22, DD 63.jpg (8688x5792, CC BY-SA 4.0, Diego Delso; Weibchen, braun-grau)"
}
```

```json
{
  "karte": "animal-atlantic-puffin",
  "foto_id": "atlantic-puffin",
  "commons_datei": "File:02 Atlantic puffin on Treshnish Isles by Romaniviatores.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:02_Atlantic_puffin_on_Treshnish_Isles_by_Romaniviatores.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/2/26/02_Atlantic_puffin_on_Treshnish_Isles_by_Romaniviatores.jpg",
  "original_breite": 6782,
  "original_hoehe": 4523,
  "author": "Romaniviatores",
  "license": "CC BY-SA 4.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
  "alt_de": "Ein Papageitaucher steht auf einer Wiese am Meer und breitet die Flügel aus. Sein Schnabel ist bunt in Orange und Gelb.",
  "art_geprueft": "Fratercula arctica laut Commons-Kategorie, Treshnish Isles, Schottland (2025); sicher",
  "querstreifen": "Vogel mittig mit ausgebreiteten Flügeln, ganz sichtbar, blauer Hintergrund; bei flachem Streifen bleiben Flügel und Füße knapp im Bild",
  "risiken": "keine; Wildvogel; Namensnennung und Weitergabe unter gleichen Bedingungen nötig",
  "alternative": "File:Puffin (Fratercula arctica) 2.jpg (5472x3648, CC BY-SA 4.0, Charles J. Sharp; Papageitaucher auf Felsen, Skomer)"
}
```

```json
{
  "karte": "animal-common-chameleon",
  "foto_id": "common-chameleon",
  "commons_datei": "File:BennyTrapp Chamaeleo chamaeleon Samos Griechenland.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:BennyTrapp_Chamaeleo_chamaeleon_Samos_Griechenland.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/2/2e/BennyTrapp_Chamaeleo_chamaeleon_Samos_Griechenland.jpg",
  "original_breite": 3872,
  "original_hoehe": 2592,
  "author": "Benny Trapp",
  "license": "CC BY 3.0",
  "license_url": "https://creativecommons.org/licenses/by/3.0/deed.en",
  "alt_de": "Ein grünes Chamäleon sitzt auf einem dünnen Zweig. Sein Schwanz ist eingerollt und es hat gelbgrüne Flecken.",
  "art_geprueft": "Chamaeleo chamaeleon laut Dateititel und Commons-Kategorie (Featured Picture, Samos, Griechenland); sicher",
  "querstreifen": "Tier mittig links auf dem Zweig, ganz sichtbar mit eingerolltem Schwanz; bei flachem Streifen wird oben und unten nur Laub abgeschnitten",
  "risiken": "keine; Wildtier; Namensnennung nötig; Datei steht auch unter GFDL, wir nutzen CC BY 3.0",
  "alternative": "File:Chamaeleonidae- Chamaeleo chamaeleon chamaeleon (Mediterranean Chameleon) 7.jpg (3012x2008, CC BY 2.0, Kristof Zyskowski & Yulia Bereshpolova; sandfarben, auf Holz, Jordantal)"
}
```

```json
{
  "karte": "animal-fire-salamander",
  "foto_id": "fire-salamander",
  "commons_datei": "File:A fire salamander (Salamandra salamandra).jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:A_fire_salamander_(Salamandra_salamandra).jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/5/52/A_fire_salamander_%28Salamandra_salamandra%29.jpg",
  "original_breite": 3668,
  "original_hoehe": 2429,
  "author": "Vasyl Krasnoshtan",
  "license": "CC BY 4.0",
  "license_url": "https://creativecommons.org/licenses/by/4.0/deed.en",
  "alt_de": "Ein Feuersalamander läuft über den Boden. Seine Haut ist schwarz mit leuchtend gelben Flecken.",
  "art_geprueft": "Salamandra salamandra laut Dateititel und Beschreibung (Wiki Science Competition 2023, Ukraine); sicher",
  "querstreifen": "Tier füllt die Bildmitte, Kopf rechts; die Schwanzspitze scheint am linken Rand knapp abgeschnitten (in der Vorschau, nicht am Original geprüft); im flachen Streifen bleibt der Körper",
  "risiken": "keine; Wildtier; Namensnennung nötig",
  "alternative": "File:Fire salamander - Salamandra salamandra salamandra.jpg (3628x2105, CC BY-SA 4.0, Bouke ten Cate; Weibchen im Bach)"
}
```

```json
{
  "karte": "animal-common-frog",
  "foto_id": "common-frog",
  "commons_datei": "File:Grasfrosch-Rana-temporaria-adult.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Grasfrosch-Rana-temporaria-adult.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Grasfrosch-Rana-temporaria-adult.jpg",
  "original_breite": 3000,
  "original_hoehe": 2223,
  "author": "Holger Krisp",
  "license": "CC BY 3.0",
  "license_url": "https://creativecommons.org/licenses/by/3.0/deed.en",
  "alt_de": "Ein Grasfrosch sitzt auf einem Stein zwischen braunen Blättern. Er ist gelbbraun mit dunklen Flecken und hat große, goldene Augen.",
  "art_geprueft": "Rana temporaria laut Dateititel, Beschreibung und Commons-Kategorie (Lauterach, Deutschland); sicher",
  "querstreifen": "Frosch mittig, ganz sichtbar; Bild 4:3, bei flachem Streifen (>2:1) wird er oben und unten beschnitten, Kopf und Körper bleiben aber im Rahmen",
  "risiken": "keine; Wildtier; Namensnennung nötig",
  "alternative": "File:Rana temporaria in nature park Trhoň in 2014 (2).jpg (4448x2986, CC BY 3.0, Chmee2)"
}
```

```json
{
  "karte": "animal-eastern-clown-anemonefish",
  "foto_id": "clownfish",
  "commons_datei": "File:Amphiprion percula 59038652.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Amphiprion_percula_59038652.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/0/00/Amphiprion_percula_59038652.jpg",
  "original_breite": 2000,
  "original_hoehe": 1451,
  "author": "craigjhowe",
  "license": "CC BY 4.0",
  "license_url": "https://creativecommons.org/licenses/by/4.0/deed.en",
  "alt_de": "Ein orangefarbener Clownfisch mit weißen Streifen schwimmt zwischen den Fangarmen einer Seeanemone.",
  "art_geprueft": "Amphiprion percula laut iNaturalist-Übernahme (Titel 'Percula Anemonefish'), Commons-Kategorie 'Amphiprion percula in Queensland'; mittel-hoch (Verwechslung mit A. ocellaris möglich, Merkmale am Foto nicht eigenständig prüfbar)",
  "querstreifen": "Fisch mittig, ganz sichtbar mit Seeanemone ringsum; bei flachem Streifen bleibt er im Rahmen",
  "risiken": "iNaturalist-Foto, Bestimmung von der Community (nicht von mir); Aufnahmeort nur über Kategorie Queensland (passt zum Great Barrier Reef der Karte); Namensnennung nötig; Commons-Fotos 'Hal – Amphiprion percula' (Aquarium Southend) und Karelj sind laut Beschreibung teils A. ocellaris bzw. Aquarium und für diese Karte weniger geeignet",
  "alternative": "File:Amphiprion percula 59836686.jpg (2048x1536, CC BY 4.0, Kai Squires; zwei Fische in Seeanemone, Salomonen, 2011)"
}
```

```json
{
  "karte": "animal-european-eel",
  "foto_id": "european-eel",
  "commons_datei": "File:Anguilla anguilla 01 by-dpc.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Anguilla_anguilla_01_by-dpc.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Anguilla_anguilla_01_by-dpc.jpg",
  "original_breite": 3218,
  "original_hoehe": 2154,
  "author": "David Perez",
  "license": "CC BY 3.0",
  "license_url": "https://creativecommons.org/licenses/by/3.0/deed.en",
  "alt_de": "Ein Aal schlängelt sich zwischen Steinen im Wasser eines Flusses. Sein Körper ist lang und glatt wie eine Schlange.",
  "art_geprueft": "Anguilla anguilla laut Dateititel, Beschreibung (Río Porma, León, Spanien) und Commons-Kategorie; sicher (in Europa gibt es nur diese Aalart)",
  "querstreifen": "Aal als S-Form in Bildmitte, ganzer Fisch sichtbar; bei flachem Streifen wird Kopf oder Schwanz knapp, Körper bleibt",
  "risiken": "keine; Fluss, scheinbar wildlebend; Datei steht auch unter GFDL, wir nutzen CC BY 3.0; Namensnennung nötig; Foto ist etwas dunkel",
  "alternative": "File:Anguille .......jpg (1920x1090, CC BY-SA 4.0, Aerygtuh; Aal im Wasser, Belgien, kleiner im Bild)"
}
```

```json
{
  "karte": "animal-monarch-butterfly",
  "foto_id": "monarch-butterfly",
  "commons_datei": "File:Monarch butterfly male (52341).jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Monarch_butterfly_male_(52341).jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/7/72/Monarch_butterfly_male_%2852341%29.jpg",
  "original_breite": 5184,
  "original_hoehe": 3888,
  "author": "Rhododendrites",
  "license": "CC BY-SA 4.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
  "alt_de": "Ein Monarchfalter sitzt auf einer orangefarbenen Blume. Seine Flügel sind orange mit schwarzen Adern und weißen Punkten.",
  "art_geprueft": "Danaus plexippus laut Beschreibung (Männchen, Brooklyn Botanic Garden, 2025) und Kategorie (Featured Picture); sicher",
  "querstreifen": "Falter mittig links, ganze Flügel sichtbar, Bild 4:3; im flachen Streifen (>2:1) werden die Flügelspitzen oben und unten knapp",
  "risiken": "keine; Tier im Botanischen Garten; Namensnennung und Weitergabe unter gleichen Bedingungen nötig",
  "alternative": "File:Monarch butterfly in BBG (84685).jpg (4068x2746, CC BY-SA 4.0, Rhododendrites)"
}
```

```json
{
  "karte": "animal-garden-snail",
  "foto_id": "garden-snail",
  "commons_datei": "File:Cornu aspersum (Helix aspersa).jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Cornu_aspersum_(Helix_aspersa).jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/0/08/Cornu_aspersum_%28Helix_aspersa%29.jpg",
  "original_breite": 4288,
  "original_hoehe": 3216,
  "author": "Gzen92",
  "license": "CC BY-SA 4.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
  "alt_de": "Eine Gartenschnecke kriecht über den Asphalt. Sie trägt ihr braun gestreiftes Haus auf dem Rücken und streckt ihre Fühler aus.",
  "art_geprueft": "Cornu aspersum (Commons-Titel noch mit altem Namen Helix aspersa), Colmar, Frankreich; sicher. ACHTUNG: Die Karte 'Gefleckte Weinbergschnecke' ist Cornu aspersum, nicht Helix pomatia (die Weinbergschnecke im Auftrag)",
  "querstreifen": "Schnecke mittig, ganz sichtbar mit Haus und Fühlern, Bild 4:3; im flachen Streifen bleibt sie im Rahmen, nur Asphalt oben und unten wird abgeschnitten",
  "risiken": "Untergrund ist Asphalt (Stadtschnecke); Namensnennung und Weitergabe unter gleichen Bedingungen nötig",
  "alternative": "File:Garden snail crossing the sidewalk.jpg (4032x3024, CC BY-SA 3.0, Grendelkhan)"
}
```

```json
{
  "karte": "animal-european-lobster",
  "foto_id": "european-lobster",
  "commons_datei": "File:Homard (Homarus gammarus) à l'entrée de son trou (Ifremer 00669-78066).jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Homard_(Homarus_gammarus)_%C3%A0_l%27entr%C3%A9e_de_son_trou_(Ifremer_00669-78066).jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/b/bb/Homard_%28Homarus_gammarus%29_%C3%A0_l%27entr%C3%A9e_de_son_trou_%28Ifremer_00669-78066%29.jpg",
  "original_breite": 4928,
  "original_hoehe": 3264,
  "author": "Xavier Caisey (Ifremer)",
  "license": "CC BY 4.0",
  "license_url": "https://creativecommons.org/licenses/by/4.0/deed.en",
  "alt_de": "Ein Europäischer Hummer sitzt am Meeresboden vor seiner Höhle. Er hat zwei große Scheren und lange rote Fühler.",
  "art_geprueft": "Homarus gammarus laut Dateititel und Commons-Kategorie (Ifremer/Océanothèque, Frankreich); sicher (nicht der Amerikanische Hummer)",
  "querstreifen": "Hummer von vorn, Scheren und Fühler füllen die Mitte; Hinterleib liegt hinter den Scheren; bei flachem Streifen gehen die Fühlerspitzen oben verloren",
  "risiken": "keine; lebender Wildhummer unter Wasser; Quelle Ifremer, Namensnennung nötig; Aufnahmedatum nicht genau angegeben",
  "alternative": "File:Homarus gammarus 70180761.jpg (2000x1335, CC BY 4.0, Bernard Picton; Seitenansicht ganzes Tier, Irland, dunkel)"
}
```

```json
{
  "karte": "animal-common-cuttlefish",
  "foto_id": "common-cuttlefish",
  "commons_datei": "File:Sepia común (Sepia officinalis), Parque natural de la Arrábida, Portugal, 2020-07-21, DD 62.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Sepia_com%C3%BAn_(Sepia_officinalis),_Parque_natural_de_la_Arr%C3%A1bida,_Portugal,_2020-07-21,_DD_62.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/6/65/Sepia_com%C3%BAn_%28Sepia_officinalis%29%2C_Parque_natural_de_la_Arr%C3%A1bida%2C_Portugal%2C_2020-07-21%2C_DD_62.jpg",
  "original_breite": 3776,
  "original_hoehe": 2517,
  "author": "Diego Delso",
  "license": "CC BY-SA 4.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
  "alt_de": "Eine Sepia schwebt über dem Meeresgrund zwischen Algen. Man sieht ihr Auge, die Fangarme und den Flossensaum am Körper.",
  "art_geprueft": "Sepia officinalis laut Dateititel, Beschreibung und Commons-Kategorie (Featured Picture, Arrábida, Portugal, 2020); sicher",
  "querstreifen": "Tier mittig, ganz sichtbar mit Fangarmen links; bei flachem Streifen bleibt es im Rahmen",
  "risiken": "keine; Wildtier unter Wasser; Namensnennung und Weitergabe unter gleichen Bedingungen nötig",
  "alternative": "File:Sepia común (Sepia officinalis), Catania, Sicilia, Italia, 2025-04-04, DD 11.jpg (6137x4091, CC BY-SA 4.0, Diego Delso; Sepia schräg, Kopf unten links)"
}
```

```json
{
  "karte": "animal-short-snouted-seahorse",
  "foto_id": "short-snouted-seahorse",
  "commons_datei": "File:Hippocampus hippocampus (cropped).jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Hippocampus_hippocampus_(cropped).jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/b/b0/Hippocampus_hippocampus_%28cropped%29.jpg",
  "original_breite": 2119,
  "original_hoehe": 1910,
  "author": "Hans Hillewaert",
  "license": "CC BY-SA 4.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
  "alt_de": "Ein Seepferdchen hält sich mit dem Schwanz an einem Zweig aus Tang fest. Sein Kopf ist nach vorn geneigt und es hat eine kurze Schnauze.",
  "art_geprueft": "Hippocampus hippocampus laut Dateititel, Beschreibung ('Short-snouted seahorse', Belgische Nordsee, 2012) und Kategorie; hoch (Bestimmung durch Meeresbiologen, nicht von mir geprüft)",
  "querstreifen": "Bild fast quadratisch (1,11:1), Seepferdchen füllt die Höhe; in einem Querstreifen von 1,5:1 oder flacher gehen Kopf oder Schwanz verloren; Empfehlung: bei dieser Karte kein flacher Streifen, sondern etwa 4:3 oder object-position auf den Kopf",
  "risiken": "Breite nur 2119 px (über 960 px, reicht, aber unter 3000 px); Tier wurde laut Beschreibung gefangen und fotografiert (vermutlich Aquarium oder Becken, vor dunklem Hintergrund); Hochformat-Motiv; Namensnennung und Weitergabe unter gleichen Bedingungen nötig",
  "alternative": "File:Hippocampus (35153478275).jpg (5760x3840, CC BY 2.0, prilfish from Vienna, Austria; gelbes Seepferdchen am Meeresboden, Kategorie H. hippocampus, Piran; wirkt unscharf und der Schwanz ist links abgeschnitten, Verwechslung mit H. guttulatus nicht ausgeschlossen) oder File:Jielbeaumadier hippocampes aq la rochelle 2009.jpeg (4000x3000, CC BY-SA 4.0, Aquarium La Rochelle, zwei Tiere, im Aquarium)"
}
```

## Kein freies Original gefunden?

Doch, für alle 24 Karten. Es braucht keinen Ersatz durch eine Zeichnung oder ein KI-Bild.

Offen bleiben zwei Einschränkungen:
- **Seepferdchen:** Das Motiv ist ein Hochformat. Ein Querstreifen braucht dafür einen anderen Zuschnitt (siehe Block).
- **Okapi:** Es gibt nur Zoo-Fotos, kein freies Wildfoto.

## Nicht geprüft

- Schärfe in Originalgröße (nur 420-px-Vorschauen).
- Commons-Seiten im Browser (nur API-Daten).
- Pixabay-Original des Schleiereulen-Fotos.
- iNaturalist-Bestimmung des Clownfisch-Fotos.
- Ob ein Bild auf Commons seit der Abfrage geändert, gelöscht oder neu lizenziert wurde. Vor dem Einbau sollte das Einbau-Skript die Lizenz noch einmal per API gegenprüfen.

Meine Arbeitsdateien liegen im Scratchpad. Die Vorschauen unter `/tmp/claude-0/-home-user-wunderkompass/3a68ef24-47f6-5148-8204-dbed78581f5f/scratchpad/th/` sind nicht Teil des Ergebnisses und sind nicht im Repository.

## Umsetzung (Claude, 24.11.2026)

Folgt mit dem Bilder-Strang (Plan: [2026-11-24-bilder-strang-plan.md](2026-11-24-bilder-strang-plan.md)). Vor dem Einbau zu klären: Weinbergschnecke (*Cornu aspersum* passt zum Kartentitel „Gefleckte Weinbergschnecke“, gegen den Kartentext prüfen), Clownfisch-Art (*A. percula* laut iNaturalist), Seepferdchen-Zuschnitt (fast quadratisch), Schleiereule (Herkunft Pixabay). Neue Foto-IDs vor dem Einbau noch einmal gegen `app/world-photos.json` prüfen (das Skript lehnt vergebene IDs ab).
