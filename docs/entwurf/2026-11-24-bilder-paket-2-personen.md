# Bilder, Paket 2: Personen und vier Lücken (24.11.2026)

Bericht der `bild-recherche` (Bilder-Strang, BACKLOG Phase 1, Punkt 26; Regel „Immer zuerst Originalfotos“), unverändert übernommen. Die Vorschaubilder lagen nur im Arbeitsordner des Chats und sind nicht im Repository. Die Vorschlagsliste für das Einbau-Skript steht in [`docs/bilder/vorschlaege-2026-11-24-paket-2.json`](../bilder/vorschlaege-2026-11-24-paket-2.json) (ohne Rosalind Franklin, für sie gibt es kein sicheres Bild). Noch nichts ist eingebaut. Claude sieht jedes Bild vor dem Einbau groß an. Claudes Umsetzung steht am Ende.

Ich habe nichts im Repository geändert. Vorschaubilder (640 px, bei Wikimedia nur 960 px Thumbs) liegen unter `/tmp/claude-0/-home-user-wunderkompass/3a68ef24-47f6-5148-8204-dbed78581f5f/scratchpad/bilder-paket-2/`.

## Zusammenfassung
- **13 von 15 Karten haben einen belastbaren Vorschlag.** Bei 11 davon sind Lizenz und Herkunft über die Commons-API und den Dateiseiten-Quelltext geprüft. Bei den übrigen zwei (Wright Flyer, Meitner) gibt es offene Punkte, die in den Risiken stehen.
- **Rosalind Franklin: kein sicheres Bild** (`foto_id: null`). Das einzige freie Foto in Originalgröße ist falsch lizenziert (Details im Block).
- **Ibn Sina:** Der Block ist eine Handschrift, kein Porträt. Ein modernes Porträt steht als Alternative im Block.
- **Mandela:** Er ist auf dem Vorschlag nicht allein. Ein freies Einzelporträt habe ich nicht gefunden.
- **Meitner:** Der Vorschlag hat die sauberste Lizenzkette, ist aber als Bild nur zweite Wahl.
- **Rate-Limit:** Die Commons-API hat mich oft mit 429 gebremst, teils 10 Minuten. Die Suche ist deshalb nicht erschöpfend. Besonders für Fire (altes Feuerstellen-Foto), Mandela (Einzelporträt) und Meitner (besseres freies Porträt) kann es noch Besseres geben.
- **Nicht geprüft:**
  - Ich habe keine Dateien in voller Größe angesehen, nur Vorschaubilder.
  - Flickr-Quellseiten (IAEA, Cogdog) habe ich nicht geöffnet. Commons-Aussagen zu Flickr-Lizenzen sind ungeprüft.
  - `www5.kb.dk` (Quelle des Lehmann-Fotos) ist im Netz dieser Sitzung nicht erreichbar.
- **Kartenkopf und Hochformat:** Fast alle Porträts sind Hochformat. Im Querstreifen (besonders mit 360 px Höhe auf breiten Bildschirmen) braucht jedes eine `object-position` nach oben. Sonst wird das Gesicht abgeschnitten. In den Blöcken steht je ein Richtwert.
- **Kennwörter:** Bei zwei Bildern passt keines der drei Kennwörter genau. Der Block nennt die Lücke und mein Vorschlag steht im Feld `label`.
  - Anning: ein Gemälde zu Lebzeiten, daher `label: null`. Sie ist kein Foto, deshalb braucht die Bildunterschrift „Gemälde, vor 1842“.
  - Ibn Sina: eine Handschrift.
- **Foto-IDs:** Alle vorgeschlagenen IDs kommen in `app/world-photos.json` nicht vor.

## Teil A: Personen

```json
{
  "karte": "person-mary_anning",
  "foto_id": "mary-anning",
  "commons_datei": "File:Mary Anning painting.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Mary_Anning_painting.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/e/e7/Mary_Anning_painting.jpg",
  "original_breite": 5633,
  "original_hoehe": 7283,
  "author": "Unbekannter Maler (laut Tickell 1996 „Mr. Grey“ zugeschrieben); Natural History Museum, London",
  "license": "gemeinfrei (PD-art, Alter)",
  "license_url": "https://creativecommons.org/publicdomain/mark/1.0/",
  "label": null,
  "entstanden": "vor 1842, zu Lebzeiten (Anning starb 1847). Es ist ein Gemälde, kein Foto: Bildunterschrift „Gemälde, vor 1842“.",
  "alt_de": "Ein altes Gemälde: Mary Anning steht am Meer in einem grünen Mantel, hält einen Hammer und einen Korb, neben ihr schläft ihr Hund.",
  "querstreifen": "Gesicht sichtbar nur mit object-position oben (ca. 10 bis 15 %). Am Handy gut, auf breiten Bildschirmen zeigt der Streifen nur Gesicht mit Haube, ohne Hammer.",
  "risiken": "Maler nur über ein Buch (Tickell 1996) zugeschrieben, nicht unabhängig geprüft. Alter Meister, kein Persönlichkeitsproblem. Die Datei ist sehr groß, also verkleinern. Die schlechtere Kopie von B. J. Donne (1847, nach ihrem Tod, 1154x1394) nicht nehmen.",
  "alternative": "File:Mary Anning by B. J. Donne.jpg (spätere Kopie von 1847, 1154x1394, gemeinfrei). Hübsch farbig, aber nach ihrem Tod entstanden, dann Kennwort „Spätere Darstellung“."
}
```

```json
{
  "karte": "person-ibn_al_haytham",
  "foto_id": "ibn-al-haytham",
  "commons_datei": "File:Ibn al-Haytham crop.jpg (nur 710x939, deshalb als Quelle der größere Scan der Library of Congress)",
  "source_page_url": "https://www.loc.gov/resource/rbctos.2017rosen1321/?sp=9",
  "original_url": "https://tile.loc.gov/image-services/iiif/public:rbc:2017rosen1321:0009/pct:7,37.5,29,19/full/0/default.jpg",
  "original_breite": 1107,
  "original_hoehe": 1066,
  "author": "Adolph Boÿ (Zeichnung), Jeremias Falck (Kupferstich); Titelblatt von Johannes Hevelius, Selenographia, Danzig 1647; Scan: Library of Congress, Rare Book and Special Collections Division",
  "license": "gemeinfrei (Druck von 1647)",
  "license_url": "https://creativecommons.org/publicdomain/mark/1.0/",
  "label": "Historischer Druck",
  "entstanden": "1647, rund 600 Jahre nach seinem Tod: eine erfundene Darstellung, kein Porträt zu Lebzeiten. Die Beschriftung des Drucks nennt ihn „Alhasen“, er steht für das Denken (ratione).",
  "alt_de": "Ein alter Kupferstich: Ein Gelehrter mit Turban und langem Bart hält ein Blatt mit einer geometrischen Zeichnung.",
  "querstreifen": "Gesicht bleibt sichtbar (Kopf im oberen Drittel, object-position oben).",
  "risiken": "Die 1107x1066 px sind ein Ausschnitt (Pixelbereich x=267, y=2103, Breite 1107, Höhe 1066) aus der 3816x5609-px-Seite. Der Ausschnitt ist am IIIF-Dienst der LOC geladen (Größe geprüft). Er ist nicht von Commons. Die LOC sagt nur: „keine bekannten Einschränkungen“ (kein Lizenztext). Ein Druck von 1647 ist aber nach Alter frei. Im Bild steht rechts Teilen des Titeltextes. Der Ausschnitt kann sauberer gewählt werden.",
  "alternative": "File:Ibn Al-Haytham portrait.jpg (990x1294, CC BY-SA 4.0, Michel Bakni): ein modernes Stich-Porträt, dessen Vorlage (eventuell Banknote) ich nicht belegen konnte, daher nicht empfohlen. Ibn-al-Haytham-Karte ohne Gesicht: Handschrift des „Kitab al-Manazir“ suchen (nicht geprüft)."
}
```

```json
{
  "karte": "person-maria_sibylla_merian",
  "foto_id": "maria-sibylla-merian",
  "commons_datei": "File:Bildnis der Maria Sibylla Merian, 1679.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Bildnis_der_Maria_Sibylla_Merian,_1679.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/a/a6/Bildnis_der_Maria_Sibylla_Merian%2C_1679.jpg",
  "original_breite": 2106,
  "original_hoehe": 2499,
  "author": "Jacob Marrel (um 1613/14 bis 1681); Kunstmuseum Basel (Inv. 43, Öl auf Leinwand, 59 x 50,5 cm)",
  "license": "gemeinfrei (PD-art, Maler 1681 gestorben); Commons markiert zusätzlich CC0",
  "license_url": "https://creativecommons.org/publicdomain/zero/1.0/",
  "label": null,
  "entstanden": "1679, zu Lebzeiten (Merian war 32). Gemälde, keine spätere Darstellung: Bildunterschrift „Gemälde von 1679“.",
  "alt_de": "Ein altes Gemälde: Maria Sibylla Merian als junge Frau mit Locken, Perlenkette und weißem Spitzenkragen.",
  "querstreifen": "Am Handy sichtbar. Auf breiten Bildschirmen schneidet der Streifen Stirn und Kinn ab, nur Augen und Nase bleiben. Dann am besten object-position bei ca. 25 %.",
  "risiken": "Die frühere Notiz „Original nicht abrufbar“ ist überholt: Die Datei ist abrufbar, 2106x2499 bestätigt (Exif nennt das Basler Inventar). Die Zuschreibung an Marrel stammt von Commons und dem Kunstmuseum Basel (nicht unabhängig geprüft).",
  "alternative": "File:Portret van Maria Sibylla Merian ... RP-P-1940-337.jpg (Rijksmuseum, CC0, 4780x3606, Querformat; Druck nach 1717, Kennwort „Historischer Druck“) oder File:Anna Maria Sibylla Merian (par Schellenberg).jpg (Stich mit Faltern und Eidechse, 2456x3362, gemeinfrei; ihr Gesicht ist darin klein)."
}
```

```json
{
  "karte": "person-inge_lehmann",
  "foto_id": "inge-lehmann",
  "commons_datei": "File:Inge Lehman.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Inge_Lehman.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/2/20/Inge_Lehman.jpg",
  "original_breite": 3370,
  "original_hoehe": 4922,
  "author": "Even Neuhaus (1863 bis 1946), Atelierfoto 1932; Bild: Det Kgl. Bibliotek / Københavns Universitetsbibliotek",
  "license": "gemeinfrei (Commons: PD-Denmark50), zusätzlich von der Bibliothek unter CC BY-SA 4.0 freigegeben",
  "license_url": "https://creativecommons.org/licenses/by-sa/4.0/",
  "label": null,
  "entstanden": "1932, zu Lebzeiten (Lehmann war 44). Foto, Signatur „Neuhaus 1932“ im Bild.",
  "alt_de": "Ein altes braunes Foto von Inge Lehmann als junge Frau mit kurzen Haaren und freundlichem, ruhigem Blick.",
  "querstreifen": "Gesicht im oberen Drittel, mit object-position oben sichtbar. Auf sehr breiten Bildschirmen werden Haare oder Kinn knapp angeschnitten.",
  "risiken": "Die frühere Notiz „Lizenz unbelegt“ ist teilweise geklärt: Der Quelltext nennt zwei Bausteine, dänische 50-Jahre-Regel für Fotos und CC BY-SA 4.0 durch die Bibliothek. Die Bibliotheksseite (`www5.kb.dk`) konnte ich nicht öffnen, die Freigabe ist also nicht an der Quelle belegt. Für die US-Nutzung ist die Rechtslage bei einem Foto von 1932 nicht abschließend geklärt. Mit der CC-BY-SA-Angabe dazu (Urheber, Lizenz, Quelle, Hinweis auf Zuschnitt) ist die Nennung abgesichert. Mittleres Restrisiko: Datei prüfen, sobald `kb.dk` erreichbar ist.",
  "alternative": "keine weitere geprüft"
}
```

```json
{
  "karte": "person-murasaki_shikibu",
  "foto_id": "murasaki-shikibu",
  "commons_datei": "File:Murasaki-Shikibu-composing-Genji-Monogatari.png",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Murasaki-Shikibu-composing-Genji-Monogatari.png",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/1/19/Murasaki-Shikibu-composing-Genji-Monogatari.png",
  "original_breite": 1817,
  "original_hoehe": 1458,
  "author": "Tosa Mitsuoki (1617 bis 1691); Ishiyama-dera, Ōtsu",
  "license": "gemeinfrei (PD-art, PD-old-100)",
  "license_url": "https://creativecommons.org/publicdomain/mark/1.0/",
  "label": "Spätere Darstellung",
  "entstanden": "vor 1691, rund 650 Jahre nach ihrer Zeit (um 1000): eine erfundene Darstellung, keine Abbildung zu Lebzeiten.",
  "alt_de": "Ein altes japanisches Gemälde: Eine Frau in vielen bunten Kleidern sitzt an einem niedrigen Tisch und schreibt.",
  "querstreifen": "Querformat. Gesicht oben links bei etwa 35 bis 40 % der Breite, 15 bis 25 % der Höhe. Am Handy ganz sichtbar, auf breiten Bildschirmen object-position oben links (ca. 40 % 15 %), sonst Kopf angeschnitten.",
  "risiken": "PNG, also umwandeln. Lizenzbaustein PD-old-100 laut Commons; die Aufbewahrung im Tempel bestätigt nichts weiter. Würdevoll, keine Probleme.",
  "alternative": "File:Murasaki Shikibu composing the Tale of Genji at Ishiyamadera, by Yashima Gakutei.jpg (3715x2610, 19. Jh., Kennwort „Historischer Druck“, gemeinfrei). File:Portrait of Murasaki Shikibu 04 02.jpg ist nur 828 px breit."
}
```

```json
{
  "karte": "person-nelson_mandela",
  "foto_id": "nelson-mandela",
  "commons_datei": "File:President Bill Clinton with Nelson Mandela.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:President_Bill_Clinton_with_Nelson_Mandela.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/3/31/President_Bill_Clinton_with_Nelson_Mandela.jpg",
  "original_breite": 3600,
  "original_hoehe": 2404,
  "author": "Robert McNeely, White House Photograph Office (Clinton Presidential Library)",
  "license": "gemeinfrei (US-Regierungswerk, PD-USGov-POTUS)",
  "license_url": "https://creativecommons.org/publicdomain/mark/1.0/",
  "label": null,
  "entstanden": "4. Juli 1993, Philadelphia (Freedom Festival), zu Lebzeiten",
  "alt_de": "Nelson Mandela lacht bei einer Feier in Philadelphia, neben ihm steht US-Präsident Bill Clinton.",
  "querstreifen": "Querformat. Gesicht in der Mitte bei etwa 55 % der Breite; Mandela bleibt auch im breiten Streifen sichtbar, wenn der Ausschnitt mittig sitzt.",
  "risiken": "Mandela ist nicht allein im Bild. Clinton steht links neben ihm, am Rand sind Teile weiterer Männer zu sehen. Die Bildunterschrift muss sagen „Mandela (Mitte)“ und nicht Clinton nennen müssen. Herkunft über die Clinton-Bibliothek (Quellseite genannt, nicht geöffnet). Ein sauberes Einzelporträt, das frei lizenziert ist, habe ich nicht gefunden.",
  "alternative": "File:George W. Bush and Nelson Mandela - walking - Oval Office - May 17 2005 (cropped).jpg (1863x2719, PD-USGov, Mandela lächelnd im bunten Hemd, aber Bush und Mandela Arm in Arm). Abgelehnt: `Nelson Mandela, 2000.jpg` (Flickr Commons, nur „keine bekannten Einschränkungen“, keine Lizenz), `Nelson Mandela 1994.jpg` (CC BY-SA 2.0, aber Weitergabe über einen Fotografen mit Celebrity-Agentur, Herkunft nicht belegt), Fotos von Mandela in der Zelle auf Robben Island (Haft)."
}
```

```json
{
  "karte": "person-octavia_butler",
  "foto_id": "octavia-butler",
  "commons_datei": "File:Butler signing.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Butler_signing.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/9/99/Butler_signing.jpg",
  "original_breite": 1380,
  "original_hoehe": 1055,
  "author": "Nikolas Coukouma",
  "license": "CC BY-SA 2.5",
  "license_url": "https://creativecommons.org/licenses/by-sa/2.5/",
  "label": null,
  "entstanden": "25. Oktober 2005, zu Lebzeiten (Butler starb Februar 2006), Foto bei einer Lesereise",
  "alt_de": "Octavia Butler sitzt mit Brille an einem Tisch und schreibt ihren Namen in ein Buch.",
  "querstreifen": "Querformat. Gesicht im oberen Drittel, Hände mit Buch weiter unten; Streifen bei mittlerem Ausschnitt gut, bei sehr breitem Streifen nur Kopf.",
  "risiken": "Herkunft sauber: Der Urheber hat das Foto selbst auf Commons freigegeben („Own work“, Lizenz CC BY-SA 2.5, Nennung und Weitergabe unter gleichen Bedingungen nötig). Der Hintergrund ist dunkel mit Kerzen, aber würdevoll. Das Bild ist eine Ausschnittsversion des Fotos; bei Zuschnitt zusätzlich als bearbeitet nennen.",
  "alternative": "File:Butler signing portrait.jpg (716x960, CC BY 2.5, zu schmal)"
}
```

```json
{
  "karte": "person-lise_meitner",
  "foto_id": "lise-meitner",
  "commons_datei": "File:Lise Meitner arrives in Vienna to attend the opening of the \"Atoms at Work\" exhibition.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Lise_Meitner_arrives_in_Vienna_to_attend_the_opening_of_the_%22Atoms_at_Work%22_exhibition.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/d/d1/Lise_Meitner_arrives_in_Vienna_to_attend_the_opening_of_the_%22Atoms_at_Work%22_exhibition.jpg",
  "original_breite": 2808,
  "original_hoehe": 2106,
  "author": "IAEA Imagebank (Internationale Atomenergie-Organisation)",
  "license": "CC BY-SA 2.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/2.0/",
  "label": null,
  "entstanden": "19. Mai 1963, zu Lebzeiten (Meitner war 84), Ankunft in Wien zur Ausstellung „Atoms at Work“",
  "alt_de": "Lise Meitner, eine alte Dame mit Mütze, steht in Wien und hört einem Mann zu, der sich zu ihr hinunterbeugt.",
  "querstreifen": "Querformat. Meitner unten links (x 25 bis 40 %, y 35 bis 60 %). Mit object-position links (ca. 30 % 55 %) bleibt ihr Gesicht sichtbar. Auf breiten Bildschirmen kommt das Gesicht des Mannes rechts daneben mit hinein.",
  "risiken": "Lizenzkette gut (Rechteinhaber IAEA hat über Flickr selbst freigegeben; die Flickr-Seite habe ich nicht geöffnet). Bild nur zweite Wahl: Meitner ist nicht das Bildzentrum, daneben sind Sigvard Eklund und weitere Personen. Besser wäre das Harris-&-Ewing-Studioporträt (`File:Lise Meitner NatGeo.jpg`, 2354x3072, schönes Bild), aber es hat nur den Baustein „keine bekannten Einschränkungen“ der LOC, stammt von einer National-Geographic-Seite und das Datum (um 1960) ist geschätzt, deshalb unsicher.",
  "alternative": "File:Lise Meitner NatGeo.jpg (nur wenn man den Baustein PD-Harris-Ewing akzeptiert, Risiko mittel). File:Lise Meitner (1878-1968), lecturing at Catholic University, Washington, D.C., 1946.jpg (1500x2030, Smithsonian Archives, Flickr-Commons-Hinweis „keine bekannten Einschränkungen“, keine Lizenz)."
}
```

```json
{
  "karte": "person-rabindranath_tagore",
  "foto_id": "rabindranath-tagore",
  "commons_datei": "File:Rabindranath Tagore in 1909.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Rabindranath_Tagore_in_1909.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/9/91/Rabindranath_Tagore_in_1909.jpg",
  "original_breite": 1071,
  "original_hoehe": 1500,
  "author": "Generalstabens litografiska anstalt, Stockholm (Druckerei; Fotograf unbekannt). Foto von 1909, veröffentlicht 1914 in „Les Prix Nobel 1913“",
  "license": "gemeinfrei (PD-old-100-1923)",
  "license_url": "https://creativecommons.org/publicdomain/mark/1.0/",
  "label": null,
  "entstanden": "1909, zu Lebzeiten (Tagore war 48), Foto in Kalkutta",
  "alt_de": "Ein altes Schwarz-Weiß-Foto: Rabindranath Tagore mit langem Bart und welligem Haar blickt zur Seite.",
  "querstreifen": "Hochformat, nur 1071 px breit (über 960, aber knapp). Gesicht bei 25 bis 55 % der Höhe. Am Handy gut mit object-position oben (ca. 20 %); auf breiten Bildschirmen schneidet der Streifen Stirn oder Bart ab.",
  "risiken": "Gute Wahl: veröffentlicht 1914, Rechte gelten als abgelaufen. Der Urheber ist die Druckerei, nicht der Fotograf, das entspricht dem Commons-Eintrag. Quellseite (nobelprize.org) und Buch nicht geöffnet.",
  "alternative": "File:Rabindranath Tagore.jpg (1936x2695, PD-India, Datum „vor 1941“, Urheber unbekannt, Quelle ein Blog: unsicherer für die US-Nutzung)"
}
```

```json
{
  "karte": "person-ibn_sina",
  "foto_id": "ibn-sina-manuscript",
  "commons_datei": "File:Ibn Sina (Avicenna), Rules about medicines of the heart. Wellcome L0016607.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Ibn_Sina_(Avicenna),_Rules_about_medicines_of_the_heart._Wellcome_L0016607.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/b/bf/Ibn_Sina_%28Avicenna%29%2C_Rules_about_medicines_of_the_heart._Wellcome_L0016607.jpg",
  "original_breite": 4652,
  "original_hoehe": 3936,
  "author": "Wellcome Collection (Handschrift der Asian Collection)",
  "license": "CC BY 4.0",
  "license_url": "https://creativecommons.org/licenses/by/4.0/",
  "label": null,
  "entstanden": "Datum nicht angegeben (Abschrift eines Textes von Ibn Sina, spätere Handschrift, Alter nicht belegt). Kein Porträt: Es ist ein historischer Gegenstand, kein Kennwort der Liste passt. Bildunterschrift „Eine Handschrift mit einem Text von Ibn Sina“.",
  "alt_de": "Eine aufgeschlagene alte Handschrift mit arabischer Schrift und einer goldblauen Verzierung. Der Text stammt von Ibn Sina.",
  "querstreifen": "Querformat, Streifen zeigt Verzierung und Schrift gut (object-position mittig).",
  "risiken": "Es zeigt Ibn Sina nicht selbst. Der Titel „Rules about medicines of the heart“ und die Zuordnung zu ihm stammen aus dem Wellcome-Titel und dem Seitentext; ich habe die Handschrift nicht gelesen. Gut belegt ist die Lizenz (Wellcome, CC BY 4.0).",
  "alternative": "Wenn ein Gesicht gewünscht ist: File:Ibn-Sina.jpg (1920x2560, CC BY 4.0, Muntadher Saleh, Federzeichnung von 2022, Kennwort „Spätere Darstellung“). Moderne Fantasie-Zeichnung, Herkunft („Expo 2020“) auf Commons nicht belegt, daher nur zweite Wahl. Die Miniatur `File:Avicenna-miniatur.jpg` ist nur 801 px breit."
}
```

```json
{
  "karte": "person-rosalind_franklin",
  "foto_id": null,
  "commons_datei": null,
  "source_page_url": null,
  "original_url": null,
  "original_breite": null,
  "original_hoehe": null,
  "author": null,
  "license": null,
  "license_url": null,
  "label": null,
  "entstanden": null,
  "alt_de": null,
  "querstreifen": null,
  "risiken": "KEIN SICHERES BILD. (1) File:Rosalind-franklin-in-paris.jpg (1920x1080, Commons: CC BY-SA 4.0 durch „CSHL“) ist falsch lizenziert: Die Quellseite nennt Vittorio Luzzati als Fotografen und trägt nur „© Cold Spring Harbor Laboratory. All Rights Reserved“. Eine CC-Freigabe ist nicht belegt. (2) File:Rosalind Franklin.jpg (MRC LMB, CC BY-SA 4.0) ist nur 521x626, zu klein. (3) File:Rosalind Franklin CC-BY-SA.png (2450x3675, CC BY-SA 4.0, „Rori!“) ist eine moderne Karikatur nach einem Foto, damit weder Original noch klar frei (mögliche Vorlage urheberrechtlich geschützt). (4) Das geograph-Foto der Tafel im King's College und die Gedenktafel in Chelsea (`File:ROSALIND FRANKLIN 1920-1958 ... .jpg`, CC BY-SA 4.0, Spudgun67) enthalten das geschützte Porträt bzw. zeigen kein Gesicht.",
  "alternative": "Die eigene gekennzeichnete Zeichnung behalten. Ein freies Original könnte eine Gedenktafel (Spudgun67, 1500x2000) als Ersatz ohne Gesicht sein, falls die Karte ein Foto braucht. Das ist eine Entscheidung für Claude."
}
```

## Teil B: Vier Karten

```json
{
  "karte": "history-fire",
  "foto_id": "neolithic-fire-kit",
  "commons_datei": "File:Nécessaire à feu-Néolithique moyen.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:N%C3%A9cessaire_%C3%A0_feu-N%C3%A9olithique_moyen.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/5/55/N%C3%A9cessaire_%C3%A0_feu-N%C3%A9olithique_moyen.jpg",
  "original_breite": 2211,
  "original_hoehe": 2460,
  "author": "Ji-Elle",
  "license": "CC BY-SA 4.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/4.0/",
  "label": null,
  "entstanden": "Foto vom 9. Juli 2025. Gegenstand: Feuerzeug-Satz aus der Mittelsteinzeit-Neolithikum (Duttlenheim, Elsass): Silexklinge und Eisenerz (Pyrit oder Markasit), mit Schlägen entstehen Funken.",
  "alt_de": "Ein sehr alter Feuerzeug-Satz aus Stein: ein rostbrauner Brocken Pyrit und eine Feuersteinklinge. Damit schlugen Menschen Funken.",
  "querstreifen": "Fast quadratisch, Gegenstand mittig und gut sichtbar, auch im breiten Streifen (Stein wird dann angeschnitten, aber erkennbar).",
  "risiken": "Es ist keine Feuerstelle, sondern das Werkzeug, und es stammt aus der Jungsteinzeit (rund 7000 Jahre alt), viel jünger als die ältesten Feuerstellen der Karte. Die Unterschrift muss das sagen („So machten Menschen später Feuer“) und darf nicht behaupten, es sei der Beginn. Das Foto ist etwas weich und unscharf (Vitrine, schwaches Licht), für den Kopf aber brauchbar. Datierung aus der Dateibeschreibung (Kennwort „Neolithikum“), nicht unabhängig geprüft. Eine echte frühe Feuerstelle als Foto habe ich nicht gefunden (Suche begrenzt durch Rate-Limit).",
  "alternative": "File:Feuermachen 05.JPG (Traumrune, 3264x2448, CC BY-SA 3.0): ein Mensch macht heute mit Holzreiben Feuer, Rauch und Glut, aber Rauch verdeckt das Meiste. File:A Mutwa man demonstrating traditional fire-making techniques.jpg (CC BY-SA 4.0, echte Menschen vorgeführt, mit Vorsicht). Nicht empfohlen: Wellcome-Zeichnungen (Kolonial-Ethnografie)."
}
```

```json
{
  "karte": "invention-airplane",
  "foto_id": "wright-flyer-museum",
  "commons_datei": "File:Wright Brothers plane in the Air and Space Museum in Washington, D.C LCCN2011632160.tif",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Wright_Brothers_plane_in_the_Air_and_Space_Museum_in_Washington,_D.C_LCCN2011632160.tif",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/0/08/Wright_Brothers_plane_in_the_Air_and_Space_Museum_in_Washington%2C_D.C_LCCN2011632160.tif",
  "original_breite": 6895,
  "original_hoehe": 5406,
  "author": "Carol M. Highsmith (Library of Congress)",
  "license": "gemeinfrei (Highsmith hat ihre Fotos der Allgemeinheit gewidmet; so führt es Commons, auf der LOC-Seite nicht erneut geprüft)",
  "license_url": "https://creativecommons.org/publicdomain/mark/1.0/",
  "label": null,
  "entstanden": "zwischen 1980 und 2006 (Foto, Bildtitel nennt nur „Wright Brothers plane“)",
  "alt_de": "Ein sehr altes Flugzeug mit zwei großen Stoff-Flügeln übereinander hängt in einem Museum, vorn liegt eine Puppe als Pilot.",
  "querstreifen": "Querformat, Flügel füllen das Bild; im breiten Streifen werden obere Flügelkante und Deckenträger abgeschnitten, das Flugzeug bleibt erkennbar.",
  "risiken": "Die Datei ist ein TIFF von 6895x5406, deshalb nur über eine verkleinerte Jpg-Ansicht verwenden (Commons-Thumb, z. B. 2400 px). Dass es der Flyer von 1903 ist, folgt aus der Ausstellung im Air and Space Museum (hängende Aufstellung der Halle vor 2003), nicht aus dem Titel; vor dem Einbau mit dem Smithsonian-Eintrag bestätigen. Rechts im Bild ist ein Raumfahrt-Ausstellungsstück, links ein Teil eines anderen Flugzeugs (kein Text).",
  "alternative": "File:• The original 1903 Wright Flyer on display ... (1st August 2015).jpg (Vintage Fan 5678, CC BY 4.0, 4896x3672): sicher der Original-Flyer, nennt der Titel selbst, aber dunkel und mit Besuchern. File:Wright flyer - full.jpg (RadioFan, CC BY-SA 3.0, 4694x2436, Panorama mit Menschen)."
}
```

```json
{
  "karte": "invention-compass",
  "foto_id": "antique-pocket-compass",
  "commons_datei": "File:Boussole 01.JPG",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Boussole_01.JPG",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/4/47/Boussole_01.JPG",
  "original_breite": 3668,
  "original_hoehe": 2445,
  "author": "Caroline Léna Becker",
  "license": "CC BY 3.0",
  "license_url": "https://creativecommons.org/licenses/by/3.0/",
  "label": null,
  "entstanden": "Foto vom 20. Dezember 2012. Gegenstand: ein alter französischer Kompass der Maison Houlliot & Cie, Paris, aus der Privatsammlung der Fotografin (Alter nicht angegeben).",
  "alt_de": "Ein alter Kompass aus Messing mit Glas, darin eine lange Magnetnadel über einer Gradeinteilung.",
  "querstreifen": "Querformat, Kompass mittig, Nadel liegt auf der Mittellinie und bleibt auch im sehr breiten Streifen sichtbar.",
  "risiken": "Es ist kein Schiffskompass, sondern ein Taschen- bzw. Peilkompass aus dem 19. Jh. oder später (nicht belegt), die Nadel ist aber deutlich zu sehen und passt zum Karten-Satz („Eine magnetische Nadel konnte bei der Richtung helfen“). Unterschrift deshalb „ein alter Kompass“, nicht „aus der Zeit der Seefahrer“. Die Hersteller-Beschriftung ist kaum lesbar. Namensnennung nötig (CC BY, keine Weitergabe unter gleichen Bedingungen).",
  "alternative": "File:Bussola di sisson, 1750-1800 ca.jpg (Sailko, CC BY 3.0, 2688x3126, Museum Pisa, Nadel in Messingkasten, alt belegt 1750 bis 1800, aber Hochformat mit Schild und Kasten, unruhiger). File:Antique compass (11567429394).jpg (CC BY 2.0, 2040x3047, verschwommen, nicht empfohlen)."
}
```

```json
{
  "karte": "invention-bicycle",
  "foto_id": "chain-drive-bicycle",
  "commons_datei": "File:Fixed gear bike mielec mechanizm.JPG",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Fixed_gear_bike_mielec_mechanizm.JPG",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Fixed_gear_bike_mielec_mechanizm.JPG",
  "original_breite": 1600,
  "original_hoehe": 1200,
  "author": "Mcdrwal",
  "license": "CC BY-SA 4.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/4.0/",
  "label": null,
  "entstanden": "Foto vom 10. Oktober 2008, heutiges Rad (kein frühes Sicherheitsfahrrad)",
  "alt_de": "Ein gelbes Fahrrad von der Seite: Eine Kette läuft vom großen Kettenblatt bei den Pedalen zu einem kleinen Zahnrad am Hinterrad.",
  "querstreifen": "4:3-Format, Kettenblatt, Kette und Hinterrad-Nabe liegen im mittleren Bilddrittel; mit object-position mittig (ca. 55 %) bleiben sie im Streifen sichtbar, die obere und untere Hälfte werden abgeschnitten.",
  "risiken": "Zeigt genau die Teile der Karte (Kettenblatt vorn, Kette, Zahnrad hinten), aber ein Rad mit nur einem Gang; über „Gänge“ sagt das Bild nichts. Reifenaufschriften (Accent, Blizzard) und eine Steckdose am Rand, keine Personen. Kein frühes Sicherheitsfahrrad gefunden. Namensnennung und Weitergabe unter gleichen Bedingungen nötig.",
  "alternative": "File:Bike gears and chain.jpg (5 Cent Dollar, CC BY-SA 4.0, 6000x3376, Schwarz-Weiß-Nahaufnahme von Kette und mehreren Zahnrädern am Hinterrad, zeigt die Gänge, aber nicht das Kettenblatt). File:Close up seven speed gear.jpg (NonNerd, CC0, 4320x3240, schmutzige Nahaufnahme, schlechter)."
}
```

## Hinweise zur Umsetzung
- **Kennwörter:** `label` ist bei Anning, Merian, Ibn Sina, Meitner und den Teil-B-Fotos `null`, weil es Gemälde, Handschriften oder Fotos sind. Für Anning und Merian (Gemälde zu Lebzeiten) gibt es keinen passenden Wert in der Liste. Entscheidung bei Claude: Kennwort erweitern („Gemälde“) oder Bildunterschrift ohne Kennwort.
- **Hochformat:** Anning, Merian, Lehmann, Tagore und Ibn Sina (falls Saleh) brauchen `object-position` oben. Auf breiten Bildschirmen ist der Streifen nur 4:1, das Gesicht wird dann angeschnitten. Eine Alternative wäre ein Porträt neben dem Text statt als Streifen.
- **Rechtliche Restpunkte vor dem Einbau:**
  - Lehmann: `kb.dk` prüfen, sobald erreichbar.
  - Meitner und Mandela: Flickr- bzw. Clinton-Bibliothek-Quelle öffnen.
  - Wright Flyer: Smithsonian-Eintrag zur Ausstellung gegenlesen.
  - Alle: Dateiseite in voller Größe ansehen, Urheberzeile 1:1 übernehmen.

Quellen: Commons-API und Dateiseiten-Quelltexte (Lizenzbausteine) am 24.11.2026; LOC-IIIF-Dienst für den Hevelius-Druck; CSHL-Blog (Franklin).

## Umsetzung (Claude, 24.11.2026)

Folgt mit dem Bilder-Strang (Plan: [2026-11-24-bilder-strang-plan.md](2026-11-24-bilder-strang-plan.md)). Vor dem Einbau zu klären:

- **Kennwort „Gemälde“:** Anning und Merian sind Gemälde zu Lebzeiten, dafür hat `app/kern/karte/foto-kennwoerter.json` noch kein Wort. Vorschlag: Kennwort ergänzen statt Bildunterschrift ohne Kennwort.
- **Mandela:** Auf dem Foto steht er mit Bill Clinton. Für eine Kinderkarte ist ein Einzelbild besser. Erst noch einmal nach einem freien Einzelporträt suchen (die Suche war durch die Bremse der Commons-API begrenzt), sonst Ausschnitt nur mit Mandela (gemeinfrei, also erlaubt) und als bearbeitet nennen.
- **Ibn Sina:** Eine Handschrift statt eines Gesichts ist ehrlicher als eine erfundene Zeichnung. Bildunterschrift muss sagen, dass es eine Handschrift mit seinem Text ist.
- **Rosalind Franklin:** kein freies Original belegt. Die gekennzeichnete Zeichnung bleibt (Regel: KI oder Zeichnung nur, wenn es nachweislich kein freies Original gibt; hier belegt).
- **Feuer:** Das Werkzeug ist jünger als die ältesten Feuerstellen; die Datierung im Bericht („Mittelsteinzeit-Neolithikum“) widerspricht sich. Vor dem Einbau prüft der `fakten-pruefer` Alter und Bildunterschrift.
- **Wright Flyer, Meitner, Lehmann:** die offenen Quellenpunkte aus „Rechtliche Restpunkte“ vor dem Einbau abarbeiten.
- **Hochformate:** Für Porträts im Querstreifen braucht das Einbau-Skript ein Feld für den Ausschnitt (`object-position`), siehe Plan, Offene Punkte.
