# Bildkandidaten Zeitreise und Erfindungen, Paket 3 (25.11.2026)

Helfer: `bild-recherche` (sonnet/medium), 25.11.2026. Kandidaten, teilgeprüft (Commons-API und Vorschau); vor dem Einbau volle Größe ansehen und `node scripts/foto-einbau.mjs <datei> --nur-pruefen` laufen lassen. Im Repository wurde nichts geändert. Zwischendateien (Vorschau-Bilder, Hilfsskripte) liegen nur unter `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/bilder3/`.

## Ausgangslage und Auswahl

- Von 58 `history-*` und `invention-*` Karten haben nur `history-fire`, `invention-compass` und `invention-bicycle` ein Foto. Alle übrigen haben im Feld `image` keinen Eintrag.
- In den vier genannten Berichten (Nachsuche, Darwin/Goodall, offene Fragen, Weltall) kommen 37 dieser Karten vor. Es bleiben 21 Karten ohne Foto und ohne Kandidat. Der alte Bericht vom 21.11. wurde nicht als „schon bearbeitet“ gezählt, weil er alle Karten nur grob streift.
- Die 21 offenen Karten sind: `invention-elevator`, `history-ww2`, `history-un`, `invention-battery`, `invention-generator`, `invention-transistor`, `history-berlin_wall_fall`, `invention-refrigerator`, `history-paper`, `history-zero`, `history-compass`, `history-ww1`, `history-holocaust`, `history-berlin_wall_build`, `history-web`, `history-reunification`, `history-iss`, `history-september11`, `history-webb`, `history-polynesia`, `history-bronze`.
- **So habe ich gewählt:**
  - Lernreisen: Keine der 21 Karten ist in `app/journey-links.ts` verlinkt (alle dort verlinkten sind in Paket 2 oder haben schon ein Foto).
  - Verbindungen in `app/world-connections.json`: Es kamen zuerst die Karten mit den meisten Verbindungen. Das sind `invention-elevator` (4), `history-ww2` (3), `history-un` (3), `invention-battery` (3), `invention-generator` (3), `invention-transistor` (3), `history-berlin_wall_fall` (2) und `invention-refrigerator` (2).
  - Danach vier Karten mit je 1 Verbindung: `history-paper`, `history-iss`, `history-webb`, `history-web`. Ausgewählt, weil sie ein klares, kindgerecht fotografierbares Motiv haben.
  - Bewusst zurückgestellt: `history-holocaust`, `history-september11`, `history-ww1`, `history-berlin_wall_build` (belastende Bilder, brauchen eine eigene Entscheidung des Nutzers) sowie `history-zero`, `history-compass`, `history-polynesia`, `history-bronze` (schwer als Foto zu zeigen, später). Auch die Startfragen (`rate-mal.tsx`) habe ich nicht ausgewertet.

## Prüftiefe (ehrlich)

- Lizenz, Urheber, Quelle, Datum und Größe habe ich je Datei über die Commons-API gelesen (`extmetadata`). Das ist der Wikitext der Dateiseite. Die gerenderte Dateiseite habe ich nicht geöffnet.
- Jedes Bild habe ich als Vorschau von 360 px Breite angesehen, nicht in voller Größe. Schärfe, Ränder, Wasserzeichen und Details sind deshalb nicht geprüft.
- Alle Hauptkandidaten und Ersatzbilder sind mindestens 960 px breit; die kleinste Breite ist 1087 px, nichts muss hochskaliert werden.
- Ausschnitt-Hinweise sind aus den Vorschauen geschätzt. Die Prozentwerte beziehen sich auf das Originalbild (x von links, y von oben). Vor dem Einbau `--vorschau` benutzen.
- Externe Quellen (Flickr, IWM, NASA, Wellcome) habe ich nicht geöffnet.
- Die API hat öfter mit 429 gebremst. Ich habe Abfragen gebündelt, mit Pausen gearbeitet und den User-Agent `WunderKompass-Bildeinbau/1.0` benutzt.
- Neue Foto-IDs (Vorschläge unten) habe ich gegen `app/world-photos.json` geprüft: keine ist belegt.
- Alle Dateiseiten haben die Adresse `https://commons.wikimedia.org/wiki/File:` plus Dateiname mit `_` statt Leerzeichen. Heutiges Bild ist bei allen 12 Karten: keins.
- Das Feld `label` im Bestand heißt für Gemälde, Stiche und Ähnliches „Darstellung“ (Eingabe „Spätere Darstellung“); für Fotos „Foto“.

## Tabelle je Karte

### 1. `invention-elevator` (4 Verbindungen)
- **Kandidat (Hauptbild):** `File:Elisha OTIS 1854.jpg`. Kennzeichnung: **spätere Darstellung** (Kopie eines alten Stichs, Vorführung von Otis im Crystal Palace New York, 1854).
- **Lizenz:** gemeinfrei (Public domain). **Urheber:** unbekannt. **Quelle:** „Copie de gravure ancienne“ (Dateiseite). Kein Namensnennungszwang.
- **Größe:** 3567 x 3514 (quadratisch).
- **Ausschnitt:** Schwarzweiß-Stich, Otis steht auf der Plattform oben Mitte, Menge unten. 4:3 und 16:9: `focus 50% 35%`.
- **Alt-Text:** Ein Mann steht auf einer Plattform hoch oben in einer großen Halle. Unten schauen viele Menschen zu. Es ist eine alte Zeichnung.
- **Vorschlag Foto-ID:** `otis-elevator-demo-1854`.
- **Risiko:** Urheber unbekannt, Gemeinfreiheit beruht nur auf dem Alter des Stichs; Dateiseite vor dem Einbau öffnen. Ein Stich, kein Foto: Unterschrift „alte Zeichnung“. Er zeigt die Sicherung (Vorführung), nicht den heutigen Aufzug.
- **Ersatz:** `File:Elevator machine room.jpg`, 3292 x 2195, CC BY-SA 4.0, Filip.vidinovski. Kennzeichnung: **Foto**. Alter Maschinenraum eines Aufzugs in Kočani (Nordmazedonien) mit Antrieb und Seilen, passt zum Text (Antrieb, Treibscheibe). Namensnennung und Weitergabe unter gleichen Bedingungen nötig. Als Kinderbild eher nüchtern, dunkel und orange.

### 2. `history-ww2` (3 Verbindungen)
- **Kandidat (Hauptbild):** `File:Ve Day Celebrations in London, England, UK, 8 May 1945 D24584.jpg`. Kennzeichnung: **Foto**.
- **Lizenz:** gemeinfrei. **Urheber:** Ministry of Information Photo Division Photographer. **Quelle:** Imperial War Museums (D 24584), über Commons.
- **Größe:** 2480 x 1676.
- **Ausschnitt:** dichte Menschenmenge in Whitehall. 4:3: `focus 50% 50%`. 16:9: `focus 50% 55%`.
- **Alt-Text:** Eine riesige Menschenmenge steht dicht gedrängt auf einer Straße in London. Es ist ein altes Schwarzweißfoto vom Ende des Krieges in Europa im Mai 1945.
- **Vorschlag Foto-ID:** `ve-day-whitehall-1945`.
- **Risiko:** Viele Personen, alle anonym, kein Gesicht im Vordergrund. Der Lizenzbaustein auf der Dateiseite steht nicht in der API-Antwort (nur „Public domain“); Dateiseite öffnen. Das Bild zeigt das Kriegsende in Europa, nicht den Kriegsbeginn 1939; Unterschrift muss „Kriegsende in Europa, 8. Mai 1945, London“ sagen. Absichtlich kein Bild mit Kampfhandlungen oder Toten.
- **Ersatz:** `File:Winston Churchill waves to crowds in Whitehall in London as they celebrate VE Day, 8 May 1945. H41849.jpg`, 1782 x 1772, gemeinfrei, War Office official photographer Major W. G. Horton (IWM H 41849). Kennzeichnung: **Foto**. Zeigt einen echten Politiker; Namen in der Unterschrift nötig.

### 3. `history-un` (3 Verbindungen)
- **Kandidat (Hauptbild):** `File:United Nations Conference 5c 1945 issue U.S. stamp.jpg`. Kennzeichnung: **spätere Darstellung / historische Abbildung** (US-Briefmarke vom 25.04.1945, „Toward United Nations“).
- **Lizenz:** gemeinfrei. **Urheber:** Bureau of Engraving and Printing. **Quelle:** U.S. Postal Service, National Postal Museum, über Commons.
- **Größe:** 1322 x 854.
- **Ausschnitt:** Briefmarke füllt das Bild mit schwarzem Rand. 4:3 oder 16:9: `focus 50% 55%` (Rand wird mit abgeschnitten).
- **Alt-Text:** Eine blaue Briefmarke aus dem Jahr 1945 mit den Worten „Toward United Nations“ und einem Olivenzweig.
- **Vorschlag Foto-ID:** `un-conference-stamp-1945`.
- **Risiko:** Schwache Lösung. Ich habe kein freies Foto der Gründung 1945 gefunden, das kindgerecht klar ist. Die gefundenen Konferenzfotos sind Gespräche in Anzügen, ohne erkennbares Thema. Die Marke ist englisch beschriftet und zeigt nur die Konferenz, nicht die 51 Staaten; kein Personenbild.
- **Ersatz:** `File:United Nations General Assembly Hall (3).jpg`, 5184 x 3456, CC BY-SA 3.0, Basil D Soufi. Kennzeichnung: **Foto**, aber von 2011, nicht von 1945: der Saal, in dem die Länder heute zusammenkommen. Namensnennung und Weitergabe unter gleichen Bedingungen nötig. Das UN-Emblem ist zu sehen (Zeichen der UN, nicht Werbung; zu klären).
- Nicht gewählt: Konferenzfotos von 1945 (`File:UN San Francisco Delegates 1945.jpg`, 1200 x 982, gemeinfrei; `File:61375 UnitedNations 1945 Iran Delegation.jpg`) wegen unklarem Motiv.

### 4. `invention-battery` (3 Verbindungen)
- **Kandidat (Hauptbild):** `File:Batterien (12164766485).jpg`. Kennzeichnung: **Foto**.
- **Lizenz:** CC BY 2.0 (https://creativecommons.org/licenses/by/2.0). **Urheber:** Tim Reckmann aus Hamm. **Quelle:** Flickr, über Commons. Namensnennung nötig.
- **Größe:** 5472 x 3648, 25.01.2014.
- **Ausschnitt:** vier AA-Akkus auf Weiß, mittig. 4:3 und 16:9: `focus 50% 50%`.
- **Alt-Text:** Vier Batterien in Stabform stehen nebeneinander auf weißem Grund.
- **Vorschlag Foto-ID:** `aa-batteries`.
- **Risiko:** Es sind aufladbare NiMH-Akkus (Aufdruck „REC…“), keine Einwegbatterien wie in der Taschenlampe der Karte. Aufdruck mit kleinem Herstellernamen. Flickr-Quelle nicht gegengeprüft.
- **Ersatz:** `File:Voltaic pile, Europe, 1800-1899 Wellcome L0057740.jpg`, 2832 x 4256 (Hochformat), CC BY 4.0, Wellcome Collection (Urheber nicht eingetragen). Kennzeichnung: **Foto** einer historischen Voltaschen Säule. Namensnennung nötig. Passt zur Geschichte der Batterie, nicht zur Taschenlampenfrage. Hochformat, `focus 50% 40%` oder `fit: contain`.

### 5. `invention-generator` (3 Verbindungen)
- **Kandidat (Hauptbild):** `File:Faraday disk - National Museum of Nature and Science, Tokyo - DSC07366.JPG`. Kennzeichnung: **Foto** (Modell der Faraday-Scheibe von 1831, des ersten elektrischen Generators).
- **Lizenz:** CC0. **Urheber:** Daderot. **Quelle:** Eigenes Werk. Kein Namensnennungszwang.
- **Größe:** 3657 x 3505, 04.09.2013.
- **Ausschnitt:** Kupferscheibe und Magnet auf Holzsockel, Mitte. 4:3: `focus 50% 40%`. 16:9: `focus 50% 40%`.
- **Alt-Text:** Eine große runde Kupferscheibe mit Kurbel dreht sich zwischen den Armen eines Magneten. Das ist ein altes Modell des ersten Stromerzeugers.
- **Vorschlag Foto-ID:** `faraday-disk-model`.
- **Risiko:** Museumsmodell mit japanischem Schild unten (Name „Faraday-Disk“), Schild beim Zuschnitt abschneiden. Es ist die einfachste Bauform, nicht der Generator aus dem Kraftwerk.
- **Ersatz:** `File:Hoover Dam Main Turbine Hall.jpg`, 4912 x 7360 (Hochformat), CC BY 4.0, Alexander Mason. Kennzeichnung: **Foto**. Lange Halle mit den Generatoren des Hoover-Staudamms. Namensnennung nötig. Hochformat, `focus 50% 50%`. Die Datei ist laut API vom Februar 2026 hochgeladen; sehr groß, auf 960 px verkleinern.

### 6. `invention-transistor` (3 Verbindungen)
- **Kandidat (Hauptbild):** `File:A replica of the first working transistor 02.jpg`. Kennzeichnung: **Foto eines Nachbaus**.
- **Lizenz:** CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0). **Urheber:** Mister rf. **Quelle:** Eigenes Werk. Namensnennung und Weitergabe unter gleichen Bedingungen nötig.
- **Größe:** 1600 x 1850 (Hochformat), 23.02.2019.
- **Ausschnitt:** Nachbau aus durchsichtigem Kunststoff mit Goldteil, Mitte. 4:3: `focus 50% 45%`. 16:9: `focus 50% 45%`.
- **Alt-Text:** Der Nachbau des ersten Transistors: ein Gestell aus durchsichtigem Kunststoff mit einem goldenen Block und dünnen Drähten.
- **Vorschlag Foto-ID:** `transistor-replica-1947`.
- **Risiko:** Auf dem Bild liegt zusätzlich ein kleiner Transistor 2N43 (links); laut Dateibeschreibung zum Größenvergleich. Mit 1600 px nur bis 960 px ausspielen. Motiv für Kinder abstrakt.
- **Ersatz:** `File:2SA798 dual pnp transistor, around 1977.jpg`, 2000 x 1330, CC0, Retired electrician. Kennzeichnung: **Foto** zweier moderner Transistoren (Stand 1970er), freigestellt auf Hellgrau. Kein Namensnennungszwang. Aufdruck „A798“, Ausschnitt `focus 50% 50%`.
- Nicht gewählt: Foto von Bardeen, Shockley und Brattain (`File:Bardeen Shockley Brattain 1948.JPG`, 3073 x 2448, gemeinfrei, AT&T). Echte Personen, aber das ist ein historisches Original und kein KI-Bild, falls der Nutzer ein Personenbild möchte. Als Hauptbild zu wenig sichtbar für „Transistor“.

### 7. `history-berlin_wall_fall` (2 Verbindungen)
- **Kandidat (Hauptbild):** `File:Berlin Wall Collapse (cropped).jpg`. Kennzeichnung: **Foto**.
- **Lizenz:** CC BY 3.0 (https://creativecommons.org/licenses/by/3.0). **Urheber:** Sue Ream (San Francisco). **Quelle:** Eigenes Werk. Namensnennung nötig.
- **Größe:** 1119 x 1335 (Hochformat). Das ist die zugeschnittene Fassung; das uncropped Original habe ich nicht geprüft.
- **Ausschnitt:** viele Menschen oben auf der Mauer, im Vordergrund ein Schild „Achtung! Sie verlassen jetzt West-Berlin“. 4:3: `focus 50% 45%`. 16:9: `focus 50% 30%`.
- **Alt-Text:** Viele Menschen stehen oben auf der Berliner Mauer und davor. Ein Schild warnt: „Achtung! Sie verlassen jetzt West-Berlin“.
- **Vorschlag Foto-ID:** `berlin-wall-nov-1989`.
- **Risiko:** Die Dateiseite gibt „9. November 1989“ an, vermerkt aber selbst, das müsse falsch sein, weil die Mauer erst in der Nacht davor geöffnet wurde. Unterschrift also „November 1989“, nicht „9. November“. Menschenmenge, einzelne Personen nicht erkennbar benannt. Kein Gesicht im Mittelpunkt.
- **Ersatz:** `File:BrandenburgerTorDezember1989.jpg`, 2780 x 1870, gemeinfrei, SSGT F. Lee Corkran (DoD), 01.12.1989. Kennzeichnung: **Foto**. Menschenmenge an der Mauer vor dem Brandenburger Tor, blauer Himmel. Kein Namensnennungszwang; Unterschrift „Dezember 1989“. Ohne Textschild, dafür ein klares Berliner Motiv.

### 8. `invention-refrigerator` (2 Verbindungen)
- **Kandidat (Hauptbild):** `File:Open refrigerator with food at night.jpg`. Kennzeichnung: **Foto**.
- **Lizenz:** CC BY-SA 4.0. **Urheber:** W.carter. **Quelle:** Eigenes Werk. Namensnennung und Weitergabe unter gleichen Bedingungen nötig.
- **Größe:** 3465 x 4598 (Hochformat), 12.10.2016.
- **Ausschnitt:** offener Kühlschrank mit Flaschen, Obst, Gemüse, dunkler Rand. 4:3: `focus 50% 40%`. 16:9: `focus 50% 40%`.
- **Alt-Text:** Ein Kühlschrank steht offen. Innen liegen Flaschen, Obst und Gemüse in den Fächern. Der Raum drumherum ist dunkel.
- **Vorschlag Foto-ID:** `open-refrigerator`.
- **Risiko:** Nur ein Alltagsfoto, kein Hinweis auf die Technik (Kompressor, Wärme). Kleine Beschriftungen und Flaschenetiketten sind möglich (in voller Größe prüfen).
- **Ersatz:** `File:Kelvinator home refrigerator made by AMC model KP110R part 1170592 475K-R 1of3.jpg`, 2284 x 3972 (Hochformat), CC BY-SA 4.0, CZmarlin (Christopher Ziemnowicz; bittet um Fotonennung außerhalb Wikipedias). Kennzeichnung: **Foto** eines Kühlschranks aus den 1950ern. Marke „Kelvinator“ am Gerät (Markenzeichen). Namensnennung und Weitergabe unter gleichen Bedingungen nötig.

### 9. `history-paper`
- **Kandidat (Hauptbild):** `File:Five Steps of Papermaking - Step 3 - Casting the Paper Pulp - As described by Cai Lun in 105 CE.jpg`. Kennzeichnung: **spätere Darstellung** (Holzschnitt aus der Ming-Zeit, Dateiseite: „1600“, Quelle sonst Tiangong Kaiwu 1637; es ist keine Darstellung aus der Han-Zeit).
- **Lizenz:** gemeinfrei. **Urheber:** unbekannter Künstler der Ming-Zeit. **Quelle:** „Collection of reproductions of Ming dynasty woodcuts“. Kein Namensnennungszwang.
- **Größe:** 1087 x 1479 (Hochformat).
- **Ausschnitt:** Strichzeichnung in Weiß umrandet; Mann am Becken unten Mitte. 4:3: `focus 50% 60%`. 16:9: `focus 50% 65%`. Alternativ `fit: contain`.
- **Alt-Text:** Eine alte chinesische Zeichnung: Ein Mann steht an einem Becken und schöpft Papierbrei. Daneben stehen zwei Eimer.
- **Vorschlag Foto-ID:** `papermaking-woodcut-ming`.
- **Risiko:** Ein Schritt von fünf (Schritt 3), Strichzeichnung klein im Rahmen, mit chinesischen Schriftzeichen (Beschriftung am Rand). Zeigt das Verfahren etwa 1500 Jahre nach Cai Lun; Unterschrift muss „Zeichnung aus China, später als Cai Lun“ sagen. Es gibt vier weitere Schritte (Step 1, 2, 4, 5) als eigene Dateien, falls ein anderer Schritt mehr hergibt.
- **Ersatz:** `File:Process of Cai Lun's Papermaking Art (10353448523).jpg`, 4752 x 3168, CC0, Gary Todd. Kennzeichnung: **Foto** einer Schautafel im Henan-Museum (Zhengzhou), chinesisch beschriftet mit kleinen Strichbildern. Nur 1 Foto von einer Tafel, kein Papier zu sehen. Nicht für große Darstellung.
- Nicht gewählt: `File:Fangmatan paper map.jpg` (Papierstück mit Karte, 609 x 489, zu schmal).

### 10. `history-iss`
- **Kandidat (Hauptbild):** `File:ISS-01 Expedition 1 crew members pose with a model of their home.jpg`. Kennzeichnung: **Foto**.
- **Lizenz:** gemeinfrei (NASA). **Urheber:** NASA. **Quelle:** NASA Image Gallery (Verweis auf nasa.gov), über Commons.
- **Größe:** 3060 x 2032. Aufnahmedatum laut Commons 24.12.2000.
- **Ausschnitt:** drei Raumfahrer in blauen Anzügen im Wohnmodul, mit einem Modell der Station in der Mitte. 4:3: `focus 50% 50%`. 16:9: `focus 50% 45%`.
- **Alt-Text:** Drei Raumfahrer in blauen Anzügen lächeln in die Kamera. In der Mitte hält einer ein kleines Modell der Raumstation.
- **Vorschlag Foto-ID:** `iss-expedition-1-crew`.
- **Risiko:** Echte, benennbare Personen (Bill Shepherd, Juri Gidsenko, Sergej Krikalew, die erste Langzeitbesatzung). Das ist ein Original, kein KI-Bild. Die Unterschrift sollte die Namen nennen. Nicht doppelt mit dem ISS-Bild aus dem Weltall-Bericht (dort Station vor der Erde, ohne Gesichter, für eine andere Karte).
- **Ersatz:** `File:ISS Expedition 1 crew portrait.jpg`, 3072 x 2048, gemeinfrei, NASA. Dieselbe Besatzung, jeder hält eine Orange (frisches Obst, 04.12.2000). Kennzeichnung: **Foto**. Kindgerechter und lockerer, sonst gleiche Hinweise.

### 11. `history-webb`
- **Kandidat (Hauptbild):** `File:Southern Ring Nebula by Webb Telescope (2022).jpg`. Kennzeichnung: **Foto** (Aufnahme des Weltraumteleskops, kein Fotoshooting; Infrarotbild mit Falschfarben).
- **Lizenz:** gemeinfrei (Commons-Angabe). **Urheber:** NASA, ESA, CSA, STScI. **Quelle:** jwst.nasa.gov, Bild vom 12.07.2022 (erste Bildauswahl).
- **Größe:** 4833 x 4501.
- **Ausschnitt:** farbiger Nebel in der Mitte, schwarz drumherum. 4:3 und 16:9: `focus 50% 50%`.
- **Alt-Text:** Ein leuchtender Nebel im All in Blau und Orange, mit einem hellen Stern in der Mitte. Der Nebel sieht aus wie ein Auge.
- **Vorschlag Foto-ID:** `webb-southern-ring`.
- **Risiko:** Commons führt es als gemeinfrei, weil es ein NASA-Bild ist; ESA und CSA sind Mitautoren, ihre Anteile hat die Dateiseite nicht einzeln geklärt. Vor dem Einbau die Dateiseite öffnen. Falschfarben müssen in der Unterschrift stehen („mit Infrarotlicht, Farben hinzugefügt“).
- **Ersatz:** `File:Webb's First Deep Field.jpg`, 4537 x 4630, gemeinfrei, NASA, ESA, CSA und STScI. Kennzeichnung: **Foto** (Infrarotbild, Falschfarben). Zahllose Galaxien, passt zum Satz „Galaxien“ auf der Karte; im Kleinen weniger eindrucksvoll. Gleiche Lizenzhinweise.

### 12. `history-web`
- **Kandidat (Hauptbild):** `File:First Web Server.jpg`. Kennzeichnung: **Foto**.
- **Lizenz:** CC BY-SA 3.0 (http://creativecommons.org/licenses/by-sa/3.0/). **Urheber:** User:Coolcaesar (en.wikipedia). **Quelle:** Eigenes Werk. Namensnennung und Weitergabe unter gleichen Bedingungen nötig.
- **Größe:** 2048 x 1536 (4:3), 10.08.2005.
- **Ausschnitt:** Rechner mit Bildschirm, Tastatur und aufgeschlagenem Buch, Mitte. 4:3: direkt. 16:9: `focus 50% 50%`.
- **Alt-Text:** Ein alter Computer mit Bildschirm und Tastatur steht auf einem Tisch. An ihm klebt ein Zettel: Bitte nicht ausschalten.
- **Vorschlag Foto-ID:** `nextcube-first-web-server`.
- **Risiko:** Es ist der NeXT-Rechner, auf dem Tim Berners-Lee das erste Web betrieb (laut Dateibeschreibung), nicht in 1989 aufgenommen. Gerät steht im CERN, auf der Seite wird die Kennzeichnung „CERN“ am Monitor sichtbar sein; Wasserzeichen oder Markenzeichen (NeXT) habe ich nicht in voller Größe geprüft. Kein Mensch zu sehen.
- **Ersatz:** `File:CERN NEXT Server 2010-07-01.jpg`, 3888 x 2592, CC BY-SA 3.0, Henry Mühlpfordt. Kennzeichnung: **Foto** desselben Rechners im Museum, 2010. Namensnennung und Weitergabe unter gleichen Bedingungen nötig.

## Karten, für die ich kein gutes freies Original gefunden habe

- **`history-un`:** Ein freies Foto der Gründung 1945, das für 5- bis 10-Jährige klar erkennbar ist, habe ich nicht gefunden. Hauptbild ist deshalb die Briefmarke von 1945 (echte historische Abbildung, gemeinfrei); Ersatz ist ein Foto des heutigen Saals. Kein KI-Bild nötig. Wenn beides dem Nutzer zu schwach ist, bleibt die Karte besser ohne Bild, bis ein besseres Foto da ist.
- **`history-ww2`:** Gefunden ist nur ein Foto vom Kriegsende in Europa (VE Day), nicht vom Beginn 1939. Das ist bewusst gewählt (keine Kriegsbilder für Kinder). Ob das Motiv zum Karteninhalt „Beginn 1939“ passt, entscheidet der Nutzer.
- **`history-paper`:** Es gibt nur eine spätere Zeichnung (Ming-Zeit), kein Original aus der Han-Zeit. Als Darstellung benennen.
- **`invention-elevator`:** Auch hier nur ein alter Stich oder ein Maschinenraum; ein klares Foto eines heutigen Aufzugs mit Seilen und Gegengewicht habe ich nicht gefunden. Ein erklärendes Schaubild wäre kein Fotoersatz.
- **KI-Bilder:** Für keine der 12 Karten nötig. Falls der Nutzer die obigen Lösungen ablehnt, würde ich ein gekennzeichnetes Schaubild (eigene Illustration) vorschlagen, kein KI-Foto.

## Offene Fragen an Claude und den Nutzer

1. **Karten ohne Kandidat nach diesem Paket:** `history-zero`, `history-compass`, `history-ww1`, `history-holocaust`, `history-berlin_wall_build`, `history-reunification`, `history-september11`, `history-polynesia`, `history-bronze`. Die belastenden Themen (Holocaust, 11. September, Erster Weltkrieg, Mauerbau) brauchen vorab eine Entscheidung, ob und wie ein Bild für Kinder gezeigt wird.
2. **Urheberrecht prüfen vor dem Einbau:** Otis-Stich (Gemeinfreiheit nur über Alter), IWM-Fotos (Lizenzbaustein auf der Dateiseite bestätigen), Webb-Bild (ESA/CSA-Anteile).
3. **Hochformate:** Rakete, Transistor, Kühlschrank, Papier-Holzschnitt, Voltasche Säule und Hoover-Halle sind Hochformat; der `design-pruefer` muss sie bei 320 px sehen.
4. **Unterschriften** prüfen lassen von `fakten-pruefer` (Datum Mauerfall-Foto, Beschreibung Faraday-Scheibe, Nachbau-Hinweis Transistor, Papier-Holzschnitt) und `kinder-redaktion`.

Dateien: `/home/user/wunderkompass/app/world-catalog.json`, `/home/user/wunderkompass/app/world-photos.json`, `/home/user/wunderkompass/app/world-connections.json`, `/home/user/wunderkompass/app/journey-links.ts`, `/home/user/wunderkompass/scripts/foto-regeln.mjs`, `/home/user/wunderkompass/docs/entwurf/2026-11-25-bilder-zeitreise-erfindungen-nachsuche.md`. Zu speichern unter `/home/user/wunderkompass/docs/entwurf/2026-11-25-bilder-zeitreise-erfindungen-paket-3.md`.
