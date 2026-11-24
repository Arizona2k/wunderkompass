# Foto-Inventur WunderKompass, 24.11.2026

Bericht der `bild-recherche` (Auftrag von Claude nach dem Hinweis des Nutzers „teilweise sind die Fotos nicht richtig, teilweise fehlen Fotos“, BACKLOG Phase 1, Punkt 26). Unverändert übernommen; die Bilder im Scratchpad gibt es nach dem Chat nicht mehr. Claudes Umsetzung steht am Ende.

## 1. Zusammenfassung

Ich habe 72 Bilder angesehen: alle 60 Fotos aus `app/world-photos.json`, die 5 Reisebilder (`public/journeys/*.webp`), die 3 Fotos in `public/photos/` und die 4 gekennzeichneten KI-Zeichnungen (Okapi, 3D-Drucker, Seismograf, Nähmaschine). Die meisten sah ich in Kontaktbögen mit je vier Bildern bei etwa 600 px. Einzelne Bilder (Gepard, Walhai, Blauwal) sah ich in voller Größe.

Alle 60 Dateien existieren, und `identify` stimmt bei jeder mit `width` und `height` aus dem JSON überein.

**Es gibt kein einziges Foto, das das Falsche zeigt.** Tierart, Person, Bauwerk und Ort stimmen bei allen 60. Alt-Texte, Dateinamen und Commons-Beschreibungen passen zusammen. Die Befunde sind:

- 2 Fotos, bei denen das Motiv schlecht erkennbar ist: Blauwal und Orca.
- 1 Ausschnittsproblem bei Querstreifen-Köpfen, betrifft Pinguin und Eiffelturm.
- 11 Fotos unter 640 px Breite (ohne Eisbär 700 px, den du schon kennst).
- 4 Fotos mit schwachem Motiv oder schwacher Qualität, aber nicht falsch.
- 2 Nachweis-Schwächen.
- Es fehlt keine Kennzeichnung: Gutenberg, al-Chwarizmi, Cai Lun und Hokusai tragen ein Kennwort. Alle KI-Bilder sind in Alt-Text und Bildunterschrift als „Eigene KI-Illustration“ benannt. Das Okapi-Bild zeigt ein Tier, keine Person.

Das Wort „falsch“ im Sinne des Nutzers trifft also am ehesten auf **Blauwal** (Foto zeigt nur Gischt und Blasloch) und **Orca** (winzig im Bild) zu. Das sind Fotos, die ein Kind nicht als das erkennt, was auf der Karte steht.

**Korrektur an meiner eigenen Zwischenmessung:** Eine Montage-Simulation zeigte mir zuerst Kopfabschnitte, die es auf der echten Seite so nicht gibt. Danach habe ich die 27 Fotos mit `object-fit: cover` im echten gebauten `dist/` in Chromium gerendert und gemessen. Die Fläche ist 362×260 bei 390 px, **502×360 bei Fenstern ab 1280 px (also Verhältnis 1,39)**. Das ist mild. Der Querstreifen entsteht erst bei Breiten von 600 bis 899 px: 564×260 bei 600 px, 722×260 bei 768 px (Verhältnis 2,8). Bei 900 px sind es 405×360, bei 1024 px 464×360. Die Ausschnitts-Befunde unten gelten daher für **Tablet hochkant, 600 bis 899 px**.

## 2. Befunde, schwerste zuerst

| Ort (Karte) | Foto-ID, Datei | Zeigt | Soll zeigen | Befund | Sicherheit | Vorschlag |
|---|---|---|---|---|---|---|
| `animal-blue-whale` | `blue-whale`, `/world/blue-whale.webp` | Gischt und Blasloch, dunkle Fläche, kein Körper erkennbar (1200×788) | Blauwal als Tier | Motiv nicht erkennbar | sicher | Ersatz A unten (Luftbild, ganzer Wal) |
| `animal-orca` | `orca`, `/world/orca.webp` | Winziger Orca-Vorderkörper weit hinten auf grauem Meer (1200×675) | Orca groß und deutlich | Motiv winzig; beim Ausschnitt kleiner als ein Fünftel der Fläche | sicher | Ersatz B unten |
| `animal-emperor-penguin` | `emperor-penguin`, 700×1024 | zwei Pinguine, Hochformat | Kaiserpinguin | Kopf im Querstreifen weg (600 bis 899 px). Bei 1280 px ist der Kopf des hinteren Pinguins knapp sichtbar. Bekannt, hier nur bestätigt | sicher | Querformat-Foto suchen, oder `object-position: 50% 15%` für dieses Foto |
| `building-eiffel-tower` | `eiffel-tower`, 900×1200 | Turm im Hochformat | Eiffelturm | Im Streifen (600 bis 899 px) fehlen Spitze und Fuß; bei 1280 px nur der Fuß abgeschnitten | vermutlich | `object-position` oder Querformat-Ausschnitt. Quelle ist 1920×2560, ein größerer Export ist möglich |
| `person-cai_lun` | `cai-lun`, 375×469 | Holzschnitt-Darstellung | Cai Lun | zu klein (375 px). Die Quelle auf Commons ist selbst nur 375 px | sicher | nur für kleine Kachel tauglich, oder breiteres Bild suchen. Kennwort „Darstellung“ ist vorhanden |
| `person-wangari_maathai` | `wangari-maathai`, 495×800 | Frau hält eine silberne Trophäe vors Gesicht, Augen geschlossen, Hand an der Trophäe | Porträt | zu klein, und Gesicht teils verdeckt. Quelle ist 742×1200, ein Export in 742 px wäre möglich | sicher (Größe), vermutlich (Motiv) | größer exportieren; Alternative Porträt prüfen lassen |
| `person-alexander_humboldt` | `alexander-von-humboldt`, 500×607 | Ovales Porträt | Humboldt | zu klein. Quelle ebenfalls nur 500 px | sicher | nur kleine Kachel |
| `person-grace_hopper` | `grace-hopper`, 517×606 | Foto | Hopper | zu klein; Quelle ebenfalls 517 px | sicher | nur kleine Kachel |
| `person-jane_goodall` | `jane-goodall`, 550×800 | Porträt | Goodall | zu klein; Quelle nur 617×898 (auch dann <640 knapp erreicht, <960 nicht) | sicher | auf 617 px exportieren oder anderes Foto |
| `person-charles_darwin` | `charles-darwin`, 569×800 | Foto 1881 | Darwin | zu klein; Quelle 630×885 | sicher | auf 630 px exportieren |
| `person-al_khwarizmi` | `al-khwarizmi`, 597×800 | sowjetische Briefmarke mit Fantasie-Porträt | al-Chwarizmi | zu klein; Quelle 735×985. Kennwort vorhanden. Beschreibung auf Commons nennt Datum 6.9.1989 (Arabisch), unsere Alt-Text sagt 1983; auf der Marke steht „1983“ | sicher (Größe) | auf 735 px exportieren |
| `person-karl_benz` | `karl-benz`, 600×800 | Foto | Benz | zu klein, Quelle aber 1536×2048 | sicher | auf 960 px neu exportieren |
| `person-bertha_benz` | `bertha-benz`, 601×800 | Foto | Bertha Benz | zu klein, Quelle aber 3655×4867 | sicher | auf 960 px neu exportieren |
| `person-albert_einstein` | `albert-einstein`, 609×800 | Foto | Einstein | zu klein, Quelle aber 2523×3313 | sicher | auf 960 px neu exportieren |
| `person-johannes_gutenberg` | `johannes-gutenberg`, 615×800 | Kupferstich | Gutenberg | zu klein; Quelle 650×846. Kennwort „Darstellung“ vorhanden | sicher | auf 650 px exportieren |
| `animal-dromedary` | `dromedary`, 1000×750 | junges Tier im Zoo, kleiner Höcker, Äste vorn | Dromedar | Motiv schwach (Jungtier, Höcker kaum zu sehen, Zweige verdecken Beine). Nicht falsch | vermutlich | erwachsenes Dromedar suchen |
| `animal-common-octopus` | `common-octopus`, 1200×900 | Krake im dunklen Aquarium, unscharf | Krake | sehr dunkel, Farbsäume; im Streifen nur Teil des Körpers | vermutlich | besseres Foto suchen (nicht dringend) |
| `animal-red-kangaroo` | `red-kangaroo`, 748×562 | zwei Tiere im Zoo mit Zaun und Mulch | Rotes Riesenkänguru | Commons nennt Perth Zoo und *Osphranter rufus*, es passt. Die Tiere sind grau-braun (vermutlich Weibchen); Zaun stört; 748 px reichen nur für kleine Ansicht | vermutlich | optional besseres Foto |
| `person-jocelyn_bell_burnell` | `jocelyn-bell-burnell`, 960×655 | Frau sitzt klein am Bildrand auf blauer Bank, zweite Person mit Laptop | Bell Burnell | Motiv klein, Ort Lobby, kein Porträt; Alt-Text nennt die zweite Person ehrlich | sicher | besseres Porträt suchen |
| Reise „Wetter“ (`journey-photos.json` `weather`) | `/journeys/weather.webp`, 1440×810 | Felslandschaft, Himmel mit hellem Sonnenstreifen, keine sichtbaren Regenschauer | Alt: „Unter dunklen Wolken fallen Regenschauer“ | Alt-Text passt nur teilweise zum Bild | vermutlich | Alt-Text prüfen (z. B. „Wolken über Felsen“) |
| `bryce-hoodoos`, `arches-sandstone`, `crater-lake`, `white-sands` | `/world/*-1200.webp` (nur in `nature-learning` benutzt) | passende Fotos (Bryce Canyon, Double O Arch, Crater Lake mit Wizard Island, White Sands) | – | Nachweis: `source_page_url` zeigt nur auf die Park-Startseite (`index.htm` bzw. `crater-lake.htm`), nicht auf das Einzelbild; Urheber „National Park Service“ ist nicht am Bild nachprüfbar | vermutlich | Einzelbild-Seite verlinken |

Zu den Alt-Texten und Nachweisen:

- Ein Jocelyn-Eintrag hat einen doppelten Urhebernamen: `"IAU/B. Tafreshi (twanight.org) /B. Tafreshi"`. Das ist Kosmetik und kommt aus Commons.
- `PHOTOS` in `app/learning-media.ts` (Erde, Riff, Vulkan) hat nur `credit` und `url`, kein Lizenzfeld. Die Bilder sind NASA beziehungsweise NOAA. Die Seite `earth.jpg` verlinkt auf `nasa.gov`, `reef.jpg` auf `noaa.gov`. Für „vollständigen Nachweis“ fehlen Lizenzname und Link. Bei `volcano.jpg` fehlt ein geklärter Urheber (verlinkt auf `svs.gsfc.nasa.gov/11446`, NASA/JSC). Das habe ich nicht gegengeprüft.

## 3. Ersatzvorschläge (nur die beiden klar unbrauchbaren Fotos)

**A) Blauwal, Ersatz für `blue-whale`**

- Motiv: Luftbild eines Blauwals. Der ganze, sehr lange Körper ist zu sehen, schlank, mit Finne und Blasloch-Bereich, auf dunkelblauem Wasser. So erkennt ein Kind sofort die Größe und Form.
- Datei: https://commons.wikimedia.org/wiki/File:Blue_Whale_001_noaa_body_color.jpg, 800×600 px
- Urheber: NOAA Fisheries (Protected Resources Division, Southwest Fisheries Science Center, La Jolla)
- Lizenz: Public domain (NOAA). Commons führt keinen Lizenz-Link in den Metadaten. Für den Nachweis https://commons.wikimedia.org/wiki/File:Blue_Whale_001_noaa_body_color.jpg als Quelle angeben. Keine Namensnennung nötig, ich empfehle sie trotzdem.
- Breite: 800 px, also unter 960, aber über 640. Für den Kartenkopf bei 502×360 reicht es (Verhältnis 1,33 passt zu 1,39). Nie hochskalieren.
- Alt-Text: „Ein Blauwal von oben, ein langer schlanker Körper im dunkelblauen Wasser.“
- Risiken: Rechte Seite wirkt leicht verwaschen. Der Wal liegt diagonal; im Streifen 600 bis 899 px würde `object-fit: cover` Teile abschneiden, dort besser `contain`.
- Verworfen: Mike Baird, *Blue Whale (Balaenoptera musculus) Mysticeti baleen whale.jpg* (CC BY 2.0, 2135×1602). Es zeigt nur einen Rücken auf grauem Meer und trägt ein Wasserzeichen im Bild.

**B) Orca, Ersatz für `orca`**

- Motiv: zwei Orcas springen, einer groß im Vordergrund, schwarz-weiß, Kopf, Rückenflosse, weißer Augenfleck deutlich zu sehen. So erkennt ein Kind das Tier sofort.
- Datei: https://commons.wikimedia.org/wiki/File:Killerwhales_jumping.jpg, 2186×1453 px
- Urheber: Robert Pittman (NOAA)
- Lizenz: Public domain (Commons-Angabe, Quelle NOAA). Keine Namensnennung verlangt.
- Breite: 2186 px, genug für 960.
- Alt-Text: „Zwei schwarz-weiße Orcas springen gleichzeitig aus dem Meer.“
- Risiken: Hinweis „Bearbeitung“ (Verkleinern, WebP) wie bisher ins Feld `transformations_de`. Bei Querstreifen bleibt der große Orca im Bild.

Weitere Ersatzvorschläge für Pinguin, Eiffelturm, Krake, Dromedar und Jocelyn Bell Burnell habe ich nicht recherchiert, weil die Fotos nicht klar falsch sind und die Commons-API mich zeitweise gedrosselt hat. Für Eiffelturm und Pinguin reicht vermutlich `object-position` oder `contain` statt eines neuen Fotos.

## 4. Stichprobe Nachweis (Commons-API)

Geprüft wurden 33 Fotos gegen Commons (Urheber, Lizenz, Beschreibung, Originalgröße): Gepard, Giraffe, Känguru, Dromedar, Orca, Eiffelturm, Walhai, Tim Berners-Lee, Jocelyn Bell Burnell, Katherine Johnson, Wangari Maathai, al-Chwarizmi, Humboldt, Bertha und Karl Benz, Cai Lun, Leavitt, Goodall, Tu Youyou, Hadid, Jemison, Hopper, Einstein, Darwin, Gutenberg, Eisbär, Delfin, Chien-Shiung Wu, Blauwal und Kaiserpinguin (Rohtext). Bei allen stimmen Urheber, Lizenz und Motiv. Bei „Golden Gate Bridge“ fehlen in den Commons-Metadaten die Felder; die Dateiseite im Rohtext nennt „Photographed 19 April 2002 by Peter Craig“ und „PD-user-en|Carpaltnl“. Das passt zu unserem Eintrag. Das Bild selbst ist klein (1142×687), hat nur 90 KB und wurde 2005 „color-modified“ (laut Dateihistorie).

Nicht abgerufen, nur gegen die JSON-Felder gelesen: die übrigen etwa 30 Einträge sowie Commons-Seiten von Rachel Carson (USFWS), Hokusai (Met), Journey-Fotos (USGS/NPS) und die NPS-Fotos.

## 5. Ehrlich: Was ich nicht geprüft habe

- **Kontaktbogen-Artefakte:** In meinen Montagen sah ich Banding und Posterisierung bei vielen Fotos (Giraffe, Orang-Utan, Walhai, Golden Gate, Reisebilder). Bei Walhai und Blauwal habe ich das Original geöffnet: Dort sind die Bilder sauber. Es war ein Artefakt meiner Montage. **Ich melde keine Qualitätsprobleme daraus.** Bei Giraffe, Orang-Utan, Reisebildern und Erde/Vulkan habe ich das Original nicht einzeln gegengeprüft.
- **Nicht angesehen:** die `-320`/`-640`/`-960`-Varianten und die `-600`-Varianten der NPS-Bilder (nur die 960/1200er), die Personen-SVGs unter `public/world/people/*.svg` (Ibn Sina, Lise Meitner, Murasaki, Mandela, Butler, Tagore, Rosalind Franklin), alle `app/*-illustrations.json`-Zeichnungen und `public/animals/*.svg`. Die Personen-SVGs sind eigene Zeichnungen; ich habe sie nicht geöffnet.
- **Ausschnitt nur gemessen** in Chromium für `animal-*` und `building-*` (die 27 Fotos mit `object-fit: cover`). Die 33 Fotos mit `fit: contain` werden nie beschnitten. Das Bild für „Dazu passt“ (150 px hoch, ebenfalls `cover`) habe ich **nicht gerendert**; dort ist der Ausschnitt noch kleiner, der Kaiserpinguin-Befund deckt es ab.
- **Startseite, Wissensbuch, Lernreisen** habe ich nicht durchgeklickt; ich habe nur die Dateien und die Datenfelder geprüft. Wo ein Foto auf Reisen oder Startseite erscheint, ist aus `app/journey-media.ts` und `world-gateways.tsx` abgeleitet (Startseite nutzt `african-elephant`, `giza-pyramids`, `marie-curie`, `golden-gate-bridge`).
- **Unbenutzte Bilddateien:** ein grober `grep` auf Dateinamen fand keine. Ob einzelne `-320`/`-640`-Dateien nirgends gelesen werden, habe ich nicht belegt.
- Die Commons-API hat mich mehrfach wegen zu vieler Anfragen gedrosselt. Deshalb habe ich Abfragen gebündelt. Eine zweite Quelle für den Urheber hatte ich nur bei Golden Gate, Blauwal und Pinguin.
- **Nicht gemeldet, weil nicht geprüft:** ob die Aussagen auf den Karten (Text) zum Foto passen. Ich habe nur Titel, Alt-Text und Bild verglichen.

## Umsetzung (Claude, 24.11.2026)

Folgt mit dem Bilder-Strang (direkt nach dem Merge von Teil B, PR 1).
