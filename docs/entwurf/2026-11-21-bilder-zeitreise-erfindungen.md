# Bildkandidaten für Zeitreise und Erfindungen

Stand: 21.11.2026. Phase 1, Teilschritt 2, Aufgabe 12 (nur Recherche). Eingebaut werden die Bilder erst in Teilschritt 4. Ins Repository kommen bis dahin keine Bilddateien.

## So wurde geprüft (Teilprüfung)

- **Suche, Lizenz und Urheber:** vier Helfer `bild-recherche`, über die Commons-API (Lizenzfeld, Urheberfeld, Größe, Beschreibung der Dateiseite). Die Dateiseiten selbst haben sie nur teilweise geöffnet. Bei „gemeinfrei“ fehlte oft der Lizenzbaustein in der Antwort.
- **Motiv:** Claude hat jedes gewählte Bild als Vorschaubild (330 px) angesehen. Für schwache Motive hat Claude Ersatzkandidaten geprüft. Geprüft sind damit nur Motiv und Bildwirkung im Kleinen, nicht Schärfe und Einzelheiten im großen Bild.
- **Fachlich:** Claude hat jedes Motiv gegen den Text der Karte gehalten (Ort, Zeit, Gegenstand).
- **Vor dem Einbau in Teilschritt 4 noch nötig:**
  1. Für jedes gewählte Bild die Dateiseite öffnen und den Lizenzbaustein und den Urheber dort bestätigen.
  2. Das Bild in voller Größe ansehen.
  3. Den Bildnachweis vollständig in `app/world-photos.json` eintragen.
  4. Bildunterschriften mit Kennwort und Hinweis (zum Beispiel „Nachbau“) schreiben und von `kinder-redaktion` und `fakten-pruefer` prüfen lassen.

**Dateiseite:** `https://commons.wikimedia.org/wiki/File:` + Dateiname (Leerzeichen als `_`). Jede genannte Datei ließ sich am 21.11.2026 über Commons abrufen.

**Lizenzen:** CC0 und gemeinfrei brauchen keine Nennung, wir nennen trotzdem Urheber und Quelle. CC BY verlangt Namensnennung. CC BY-SA verlangt zusätzlich, dass das bearbeitete Bild unter derselben Lizenz bleibt. Links: [CC0](https://creativecommons.org/publicdomain/zero/1.0/), [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), [CC BY-SA 3.0 de](https://creativecommons.org/licenses/by-sa/3.0/de/), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

## Ergebnis auf einen Blick

| | Zeitreise (34) | Erfindungen (24) |
|---|---|---|
| Gutes freies Original | 30 | 18 |
| Nur mit Einschränkung | 3 (Karte 6, 7, 28) | 3 (Karte 1, 5, 15) |
| Noch kein Bild | 1 (Karte 2) | 3 (Karte 4 doppelt, 8, 20) |

Für die drei Erfindungen mit KI-Bild (Seismograf, 3D-Druck, Nähmaschine) gibt es freie Originale. Sie ersetzen die KI-Bilder nach der Regel „freie Originale zuerst“.

## Zeitreise

**1. history-stone_tools – Werkzeuge aus Stein**
- Wahl: `Olduvai stone chopping tool at British Museum.jpg` · Foto (Museumsstück) · BabelStone · CC BY-SA 3.0 · 4000 × 2248
- Alt: „Ein sehr alter Stein, an dem scharfe Kanten abgeschlagen wurden. Er war ein Werkzeug.“
- Warum: Es ist ein echtes frühes Steinwerkzeug mit abgeschlagener Schneide.
- Hinweis: Das Werkzeug ist 1,8 bis 2 Millionen Jahre alt, also jünger als die Funde von Lomekwi aus der Karte. Die Unterschrift muss das sagen: „ein ähnliches, jüngeres Werkzeug“.
- Ersatz: `Olduvai Chopper.JPG` · Archaeomoonwalker · CC BY 3.0 · 3648 × 2736

**2. history-fire – Menschen nutzen Feuer**
- **Kein passendes historisches Original.** Die Vitrine mit Feuerzeug-Werkzeugen (`Tools to make fire - Museum Neandertal.jpg`) zeigt moderne Streichhölzer und passt nicht.
- Notlösung: `Lagerfeuer mit Glut Mai 2012.JPG` · Foto (heute) · 4028mdk09 · CC BY-SA 3.0 · 3648 × 2736. Alt: „Ein Lagerfeuer mit glühender Glut.“ Nur mit der Unterschrift „Ein Lagerfeuer heute“.
- Sonst: gekennzeichnete eigene Illustration „Rekonstruktion: Menschen am Feuer“, ohne fotoähnliche Gesichter. Entscheidung in Teilschritt 4.

**3. history-writing – Zeichen bewahren Nachrichten**
- Wahl: `Cuneiform tablet- administrative account of barley distribution with cylinder seal impression of a male figure, hunting dogs, and boars MET DP297594.jpg` · Foto (Museumsstück) · Metropolitan Museum of Art · CC0 · 2000 × 1500
- Alt: „Eine kleine Tontafel mit eingedrückten Zeichen. Auf ihr steht, wie viel Gerste verteilt wurde.“
- Warum: Die Tafel aus Sumer (um 3100 bis 2900 v. Chr.) hält genau eine Gersten-Abrechnung fest, wie die Karte erzählt.
- Hinweis: Die Tafel ist im Bild eher klein. Andere Ansichten derselben Tafel: DP297595 bis DP297597.
- Ersatz: `Proto cuneiform tablet OIM A12259.jpg` · Daderot, bearbeitet von Zunkir · CC BY-SA 4.0 · nur 980 px breit

**4. history-pyramids – Pyramiden im alten Ägypten**
- Wahl: `The Great Pyramid of Giza from southeast corner.JPG` · Foto · MusikAnimal · CC BY-SA 4.0 · 6000 × 4000
- Alt: „Die riesige Cheops-Pyramide aus großen Steinblöcken ragt in den blauen Himmel.“
- Warum: Man sieht die einzelnen bearbeiteten Steinblöcke.
- Ersatz: `Giza Great Pyramid of Khufu (9793898043).jpg` · Gary Todd · CC0

**5. history-paper – Papier aus China**
- Wahl: `Han Paper (9947870685).jpg` · Foto (Museum) · Gary Todd · CC0 · 4752 × 3168
- Alt: „Zwei Stücke sehr altes Papier aus China in Bilderrahmen.“
- Warum: Es zeigt Papier aus der Han-Zeit, in der Cai Lun lebte (Provinzmuseum Shaanxi).
- Hinweis: Das Motiv ist schlicht. Die Karte wird in Phase 3 neu geschrieben (BACKLOG), dann passt vielleicht eine Darstellung der Papierherstellung besser.

**6. history-zero – Rechnen mit der Null**
- Wahl (bedingt): `0121521 Chaturbhuj Temple, Gwalior Fort, Madhya Pradesh 37 (where is zero in this Hindu inscription).jpg` · Foto (Inschrift) · Ms Sarah Welch · CC0 · 5016 × 3000
- Alt: „Eine Steinwand in einem Tempel in Indien mit eingemeißelten Zeichen. Ein blauer Kreis zeigt eine Null.“
- Warum: Es zeigt eine frühe Null in Stein.
- Hinweis: Die Inschrift stammt von 876, ist also jünger als Brahmagupta (628). Das Bild enthält eine blaue Markierung und eine Vergrößerung. Die Unterschrift nennt das Jahr. Das Bakhshali-Manuskript ist nicht geeignet, weil seine Lizenz fraglich ist.

**7. history-compass – Der Kompass hilft auf See**
- Wahl (mit Einschränkung): `Museum of the Middle Urals - Chinese luopan.jpg` · Foto (Museumsstück) · Александр Сигачёв · CC0 · 3587 × 3525
- Alt: „Ein runder chinesischer Kompass aus Holz mit vielen Ringen und Schriftzeichen.“
- Warum: Es ist ein chinesischer Magnetkompass. In China wurde der Kompass zuerst so genutzt, bevor er Seeleuten half.
- Hinweis: Es ist ein Feng-Shui-Kompass aus späterer Zeit und kein Schiffskompass. Die Unterschrift muss das sagen. Ein Bild eines alten Seekompasses wurde nicht gefunden.

**8. history-medieval_cities – Märkte und Handwerk in Städten**
- Wahl: `Luebeck Markt 09.jpg` · Foto (heute) · J.-H. Janßen · CC BY-SA 4.0 · 5157 × 3360
- Alt: „Ein Markt mit Ständen vor dem alten Rathaus in Lübeck.“
- Warum: Lübeck steht in der Karte, und der Markt auf dem alten Platz gibt es bis heute.
- Ersatz: `Holstentor in Lübeck 2015.jpg` · Christian Wolf · CC BY-SA 3.0 de (das Tor ist von 1478)

**9. history-printing – Viele Bücher aus einer Druckwerkstatt**
- Wahl: `Bible de Gutenberg, copie de la BNF Res A71-(2).jpg` · Foto (Museumsstück) · Zythème · CC0 · 2400 × 1245
- Alt: „Eine aufgeschlagene Gutenberg-Bibel mit zwei Spalten Schrift auf jeder Seite.“
- Warum: Es ist das berühmteste Buch, das mit beweglichen Buchstaben gedruckt wurde (Mainz, um 1455).
- Ersatz: `Gutenberg Bible, New York Public Library, USA. Pic 01.jpg` · Joshua Keller · CC BY 2.0

**10. history-voyages1492 – Europäische Schiffe erreichen die Karibik**
- Wahl: `The Nao Santa Maria replica representing the flagship of Christopher Columbus - geograph.org.uk - 8349670.jpg` · Foto (Nachbau) · Andrew Diack · CC BY-SA 2.0 · 3439 × 5159 (Hochformat)
- Alt: „Ein Nachbau des Segelschiffs Santa Maria mit drei Masten liegt im Hafen.“
- Warum: Es zeigt das ganze Schiff, ruhig und ohne Szene der Eroberung.
- Hinweis: Die Unterschrift sagt „Nachbau“. Der erste Vorschlag (Ipswich) zeigt nur das Deck mit einer Laterne.

**11. history-steam – Eine Maschine arbeitet mit Dampf**
- Wahl: `Newcomen engine model (Hunterian museum).jpg` · Foto (Museumsmodell) · Andy Dingley · CC BY-SA 4.0 · 2988 × 4358 (Hochformat)
- Alt: „Ein Modell einer alten Dampfmaschine in einer Glasvitrine.“
- Warum: Es verbindet Newcomen und Watt wie die Karte. James Watt reparierte solche Modelle.
- Hinweis: Der erste Vorschlag (Gedenkmaschine Dartmouth) zeigt nur Holzbalken von unten.

**12. history-railway – Ein Zug mit Dampflok fährt**
- Wahl: `Locomotion No. 1 New Bridge.jpg` · Foto (Nachbau von 1975) · Kabelleger · CC BY-SA 4.0 · 5510 × 3401
- Alt: „Eine kleine alte Dampflok fährt mit Rauch über die Gleise.“
- Warum: Locomotion No. 1 eröffnete 1825 die Bahn von Stockton nach Darlington.
- Hinweis: Die Unterschrift sagt „Nachbau“.

**13. history-electric_light – Elektrisches Licht für den Alltag**
- Wahl: `Thomas Edison Lightbulbs 1879-1880.jpg` · Foto (Museumsstücke) · HumanisticRationale · CC BY 3.0 · 2592 × 3872 (Hochformat)
- Alt: „Zwei alte Glühlampen von Thomas Edison in einer Vitrine.“
- Warum: Es zeigt frühe Lampen von 1879 und 1880.
- Ersatz: `The Edison Incandescent Lamp detached from and screwed in socket.jpg` · historischer Druck · gemeinfrei

**14. history-flight – Ein gesteuertes Flugzeug mit Motor**
- Wahl: `First flight2.jpg` · Foto (historisch, 17.12.1903) · John T. Daniels · gemeinfrei · 6603 × 4280
- Alt: „Ein altes Schwarz-Weiß-Foto: Das erste Motorflugzeug hebt knapp über dem Sand ab, ein Mann läuft daneben.“
- Warum: Es ist das Originalfoto des ersten gesteuerten Motorflugs.

**15. history-ww1 – Der Erste Weltkrieg**
- Wahl: `Section of Menin Gate's Hall of Memory (DSCF9497).jpg` · Foto (Gedenkstätte heute) · Trougnouf (Benoit Brummer) · CC BY 4.0 · 3022 × 4906 (Hochformat)
- Alt: „Eine Wand aus hellem Stein in Ypern, in die sehr viele Namen eingemeißelt sind.“
- Warum: Das Menenpoort erinnert an die Vermissten des Krieges, ruhig und ohne Kampf.
- Hinweis: Kein Soldatenfriedhof (Tyne Cot), das wäre für kleine Kinder zu schwer.

**16. history-holocaust – Der Holocaust**
- Wahl: `Berlin holocaust memorial 2014-1.jpg` · Foto (Denkmal heute) · Mike Peel · CC BY-SA 4.0 · 5184 × 3456
- Alt: „Viele graue Steinblöcke in Reihen: das Denkmal in Berlin für die ermordeten Juden Europas.“
- Warum: Ein ruhiges Denkmal, ganz ohne Bilder von Leid.
- Ersatz: `Memorial to the Murdered Jews of Europe 10.jpg` · Kurt Kaiser · CC0

**17. history-ww2 – Der Zweite Weltkrieg**
- Wahl: `06561 Westerplatte pillars monument.jpg` · Foto (Denkmal heute) · Virtual-Pano · CC BY-SA 4.0 · 7619 × 5080
- Alt: „Dunkle Säulen und ein hohes Steindenkmal auf der Westerplatte in Polen.“
- Warum: Auf der Westerplatte bei Danzig begann am 1. September 1939 der Angriff auf Polen, den die Karte nennt.
- Hinweis: Diese Aussage zur Westerplatte vor dem Einbau mit einer Quelle belegen (`fakten-pruefer`).

**18. history-un – Länder gründen die Vereinten Nationen**
- Wahl: `Flags at the United Nations headquarters 2.jpg` · Foto (heute) · Damzow · CC BY-SA 3.0 · 1800 × 1200
- Alt: „Bunte Flaggen vieler Länder wehen nebeneinander vor dem Haus der Vereinten Nationen.“
- Warum: Die Flaggen stehen für die Länder, die zusammenarbeiten.

**19. history-berlin_wall_build – Die Berliner Mauer trennt Menschen**
- Wahl: `Berlin Wall 1961-11-20.jpg` · Foto (historisch) · National Archives (Fotograf unbekannt) · gemeinfrei (PD-USGov) · 1255 × 870
- Alt: „Arbeiter bauen 1961 mit einem Kran eine Mauer mitten in Berlin.“
- Warum: Es zeigt den Bau der Mauer ohne Gewalt.
- Hinweis: Die Herkunft ist nur über ein Archiv belegt. Auf der Dateiseite genau prüfen. Das Foto der Mutter, die ihr Kind über die Grenze reicht (CIA, gemeinfrei), ist sehr gefühlsstark und deshalb nur zweite Wahl.

**20. history-apollo11 – Menschen landen auf dem Mond**
- Wahl: `Aldrin Apollo 11.jpg` · Foto (historisch, 20.7.1969) · Neil A. Armstrong / NASA · gemeinfrei (PD-USGov-NASA) · 2700 × 2700
- Alt: „Ein Astronaut im weißen Raumanzug steht auf dem grauen Mondboden.“
- Warum: Es ist das bekannte Foto der Mondlandung.

**21. history-web – Das World Wide Web entsteht**
- Wahl: `First Web Server.jpg` · Foto (Museumsstück) · Coolcaesar (englische Wikipedia) · CC BY-SA 3.0 · 2048 × 1536
- Alt: „Ein alter schwarzer Computer mit Bildschirm und Tastatur. Auf ihm lief der erste Web-Server.“
- Warum: Auf diesem Rechner am CERN lief der erste Web-Server von Tim Berners-Lee.

**22. history-berlin_wall_fall – Die Berliner Mauer wird geöffnet**
- Wahl: `Crane removed part of Wall Brandenburg Gate.jpg` · Foto (historisch) · SSgt. F. Lee Corkran (US Air Force) · gemeinfrei · 2790 × 1860
- Alt: „Nachts stehen Menschen an einer neuen Lücke in der Mauer vor dem Brandenburger Tor.“
- Warum: Es zeigt die offene Mauer ruhig und ohne Gewalt.
- Hinweis: Aufgenommen im Dezember 1989, nicht am 9. November. Die Unterschrift darf kein falsches Datum nennen.

**23. history-reunification – Deutschland wird wiedervereinigt**
- Wahl: `Wiedervereinigung Deutsches Eck Koblenz 1990.jpg` · Foto (historisch, 3.10.1990) · Holger Weinandt · CC BY-SA 3.0 de · 3000 × 2055
- Alt: „Viele Menschen feiern am Abend des 3. Oktober 1990 am Deutschen Eck in Koblenz.“
- Warum: Es ist ein Foto vom Tag der Einheit selbst.
- Hinweis: Der Ort ist Koblenz, nicht Berlin. Die Fotos des Bundesarchivs aus Berlin sind nur 800 px breit.

**24. history-iss – Ein gemeinsames Labor im Weltraum**
- Wahl: `ISS Expedition 1 crew portrait.jpg` · Foto · NASA · gemeinfrei · 3072 × 2048
- Alt: „Drei Raumfahrer schweben in der Raumstation, und vor ihnen schweben Orangen.“
- Warum: Es ist die erste Besatzung, die lange auf der ISS lebte, ein Amerikaner und zwei Russen. Das Bild ist fröhlich.

**25. history-september11 – Die Anschläge vom 11. September**
- Wahl: `North reflecting pool of the National September 11 Memorial, New York City.jpg` · Foto (Gedenkstätte heute) · Christian David · CC BY-SA 4.0 · 7728 × 5152
- Alt: „Ein großes, quadratisches Wasserbecken in New York, in dem Wasser an den Wänden hinunterfließt.“
- Warum: Die Gedenkstätte steht an der Stelle der beiden Türme. Das Bild ist ruhig, die Anschläge selbst sind nicht zu sehen.
- Hinweis: Am Beckenrand stehen echte Namen von Opfern. Das ist an Gedenkorten üblich. Im großen Bild prüfen, ob sie lesbar sind.

**26. history-webb – Neue Bilder vom Universum**
- Wahl: `NASA’s Webb Reveals Cosmic Cliffs, Glittering Landscape of Star Birth.jpg` · Teleskopbild · NASA, ESA, CSA, STScI · gemeinfrei · 14575 × 8441
- Alt: „Ein leuchtender Rand aus Gas und Staub im Weltall sieht aus wie ein Gebirge. Darüber glitzern viele Sterne.“
- Warum: Es gehört zu den ersten Bildern des Webb-Teleskops vom Juli 2022.
- Hinweis: Die Farben sind aus Infrarotlicht umgerechnet. Die Unterschrift sagt das.

**27. history-maya – Die Maya: Wissen gestern und heute**
- Wahl: `Tikal, Temple I and II (15772710379).jpg` · Foto (heute) · Arian Zwegers · CC BY 2.0 · 5184 × 3456
- Alt: „Hohe Stufentempel der Maya-Stadt Tikal ragen aus dem grünen Wald.“
- Warum: Tikal steht in der Karte.
- Ersatz: `Dresden Codex f8461796.png` (Dresdner Maya-Handschrift) · gemeinfrei

**28. history-polynesia – Über den Pazifik ohne GPS**
- Wahl (mit Einschränkung): `Polynesian double-hulled and outrigger canoes.jpg` · Foto (heute) · Nurg · CC BY-SA 4.0 · 3653 × 2185
- Alt: „Große Boote mit zwei Rümpfen liegen in einer Bucht. Vorn liegt ein kleines Boot mit Ausleger.“
- Warum: Es zeigt die Doppelrumpfboote, mit denen die alte Navigation heute nachgefahren wird (Rarotonga).
- Hinweis: Die großen Boote sind im Bild klein, und es sind Nachbauten. In Teilschritt 4 noch einmal nach einem Doppelrumpfboot unter Segeln suchen (zum Beispiel Hōkūleʻa). `Smooth Sailing (50863544923).jpg` zeigt vor allem Palmen.

**29. history-timbuktu – Timbuktu: eine Stadt des Wissens**
- Wahl: `Kitâb fî al-Falak Musa al-Kansûsi Mamma Haidara Library 2256 n01.jpg` · Foto einer Handschrift · Marie-Lan Nguyen · gemeinfrei (Handschrift), Foto CC BY 4.0 · 6428 × 4289
- Alt: „Zwei Seiten einer alten Handschrift aus Timbuktu mit arabischer Schrift und Kreisen für die Sterne.“
- Warum: Es ist eine Handschrift über den Himmel aus einer Bibliothek in Timbuktu.
- Hinweis: Alter und Inhalt der Handschrift vor dem Einbau über die Bibliothek prüfen. Nennung „Marie-Lan Nguyen, CC BY 4.0“.

**30. history-greece – Fragen stellen im alten Griechenland**
- Wahl: `Temple of Hephaestus from ancient agora Athens.jpg` · Foto (heute) · Jebulon · CC0 · 4536 × 3019
- Alt: „Ein alter Tempel mit vielen Säulen steht über den Ruinen der Agora in Athen.“
- Warum: Auf der Agora trafen sich die Bürger Athens zum Reden und Abstimmen.

**31. history-rome – Römische Straßen und Wasserwege**
- Wahl: `Pont du Gard (30).jpg` · Foto (heute) · Krzysztof Golik · CC BY-SA 4.0 · 4485 × 2726
- Alt: „Eine hohe Brücke aus Stein mit drei Reihen Bögen über einem Fluss. Über sie floss Wasser zu einer Stadt.“
- Warum: Es ist eine römische Wasserleitung, wie die Karte sie erklärt.

**32. history-khipu – Khipus: Informationen in Schnüren**
- Wahl: `Peru, Inca Period, 15th-16th Century - Inka Khipu (Fiber Recording Device) - 1940.469 - Cleveland Museum of Art.tif` · Foto (Museumsstück) · Cleveland Museum of Art · CC0 · 5968 × 4958
- Alt: „Eine Hauptschnur mit vielen herabhängenden Schnüren, in die Knoten geknüpft sind.“
- Warum: Es ist ein echtes Khipu der Inka.
- Hinweis: TIF-Datei, beim Einbau nach WebP umwandeln.

**33. history-mohenjo-daro – Mohenjo-Daro: Spuren einer geplanten Stadt**
- Wahl: `Mohenjo-daro.jpg` · Foto (heute) · Saqib Qayyum · CC BY-SA 3.0 · 3648 × 2736
- Alt: „Freigelegte Mauern aus Backstein der alten Stadt Mohenjo-Daro. Vorn liegt ein großes Becken.“
- Warum: Es zeigt Ruinen und das Große Bad, also Bauplanung und Wasser wie in der Karte.
- Hinweis: Die Deutung eines Hügels als Kornspeicher (Dateiseite) ist umstritten. Nicht übernehmen.

**34. history-bronze – Bronze: neues Material, alte Werkzeuge**
- Wahl: `Bronze hydria (water jar) MET DP110061.jpg` · Foto (Museumsstück) · Metropolitan Museum of Art · CC0 · 3605 × 3604
- Alt: „Ein altes griechisches Wassergefäß aus dunkler Bronze mit Henkeln.“
- Warum: Die Karte nennt Bronzegefäße aus Griechenland.
- Ersatz: `Stone molds for bronze casting, Museum of Western Bohemia, 187766.jpg` · Zde · CC BY-SA 4.0 (Gussformen aus Stein)

## Erfindungen

**1. invention-light – Elektrisches Licht**
- Wahl (mit Einschränkung): `Siemens & Halske tantalum filament incandescent bulb, c. 1907 (NMAH EM.239147).jpg` · Foto (Museumsstück) · Crawdad Blues · CC0 · 1685 × 2474
- Alt: „Eine alte Glühlampe mit einem dünnen Draht im Glas.“
- Hinweis: Es ist eine Lampe von Siemens & Halske, nicht von Edison. Die Unterschrift sagt das. Die Edison-Lampen von Zeitreise-Karte 13 können wir hier nicht noch einmal zeigen.

**2. invention-car – Das Auto**
- Wahl: `Benz Patent-Motorwagen Nummer 1 (D.M. Verkehrszentrum).jpg` · Foto (Museumsstück) · Mattes · gemeinfrei · 3072 × 2304
- Alt: „Ein frühes Auto mit drei großen Speichenrädern und einer Sitzbank in einer Glasvitrine.“
- Hinweis: Laut Dateiseite ein Nachbau von 1903 mit Originalteilen von 1886. Im Bild spiegelt die Vitrine.

**3. invention-railway – Die Eisenbahn**
- Wahl: `Stephenson - The Rocket.JPG` · Foto (Museumsstück) · Colindla · CC BY-SA 3.0 · 2592 × 3872
- Alt: „Die Rocket, eine der ersten Dampflokomotiven, mit hohem Schornstein im Museum.“
- Ersatz: Nachbau von 1931 im Museum of Science and Industry, Chicago (Daderot, CC0)

**4. invention-airplane – Das Flugzeug**
- **Doppelt:** Das vorgeschlagene Foto (`Wrightflyer.jpg`) zeigt denselben Erstflug wie Zeitreise-Karte 14. In Teilschritt 4 ein anderes Motiv suchen, zum Beispiel den Wright Flyer im Museum. Bis dahin kein eigenes Bild für diese Karte.

**5. invention-phone – Das Telefon**
- Wahl (mit Einschränkung): `Bell telephone magazine (1936) (14733269916).jpg` · historischer Druck · Internet Archive Book Images · „No known copyright restrictions“ (Flickr Commons, kein CC-Baustein) · 1156 × 1526
- Alt: „Ein altes Tischtelefon mit Hörer an einem Haken.“
- Hinweis: Das Bild zeigt ein Tischtelefon, nicht Bells Gerät von 1876, wie der Helfer vermutete. Die Rechte auf der Dateiseite genau prüfen. Gute Fotos von Reis- oder Bell-Nachbauten sind auf Commons zu klein.

**6. invention-computer – Der Computer**
- Wahl: `Z3 Deutsches Museum.JPG` · Foto (Nachbau) · Venusianer · CC BY-SA 3.0 · 1600 × 1200
- Alt: „Ein Nachbau des ersten funktionierenden Computers: Schränke voller Schalter im Museum.“
- Hinweis: Die Unterschrift sagt „Nachbau“.

**7. invention-internet – Das Internet**
- Wahl: `8135 GlasVezel Vermeer Kabel Glasnet Groningen hoge internet snelheid verglazing ADSL Glasdraad.jpg` · Foto · Andre Hosper · CC BY-SA 4.0 · 4032 × 3024
- Alt: „Bunte Kabel für schnelles Internet liegen auf einem Feld, bevor sie in die Erde kommen.“
- Warum: Glasfaserkabel verbinden die Netze, die das Internet bilden.
- Ersatz: `Internet Tube.png` (Karte der Seekabel) · Stefano.desabbata · CC BY-SA 4.0

**8. invention-compass – Der Kompass**
- **Kein passendes Bild.** Ein altes Kompassfoto in guter Größe wurde nicht gefunden. Der „südweisende Wagen“ passt fachlich nicht (Zahnräder statt Magnetnadel). In Teilschritt 4 gezielt nachsuchen, sonst gekennzeichnete eigene Illustration (Magnetnadel über einer Windrose).

**9. invention-printing – Der Buchdruck**
- Wahl: `Gutenberg press.png` · Foto (Nachbau, freigestellt) · International Printing Museum · CC0 · 1874 × 2499
- Alt: „Ein Nachbau von Gutenbergs Druckerpresse aus Holz.“
- Hinweis: Die Unterschrift sagt „Nachbau“. Der erste Vorschlag zeigt vor allem einen Museumsraum.

**10. invention-rocket – Die Rakete**
- Wahl: `Apollo 11 Launch2.jpg` · Foto (NASA) · NASA, restauriert von Michel Vuijlsteke · gemeinfrei · 2400 × 3000
- Alt: „Eine riesige Rakete steigt mit Feuer und Rauch in den Himmel.“

**11. invention-satellite – Der Satellit**
- Wahl: `Explorer 1 Model With Cutaway Showing Science Components.jpg` · Foto (Modell) · NASA · gemeinfrei · 1060 × 817
- Alt: „Ein Modell des Satelliten Explorer 1, aufgeschnitten, damit man die Messgeräte sieht.“
- Hinweis: Die Unterschrift sagt „Modell“.

**12. invention-smartphone – Das Smartphone**
- Wahl: `IBM Simon Personal Communicator.png` · Foto · Bcos47 · gemeinfrei · 1615 × 3000
- Alt: „Ein frühes Smartphone von 1994 mit Bildschirm zum Antippen, in seiner Ladeschale.“
- Hinweis: Lizenzbaustein auf der Dateiseite prüfen. Der erste Vorschlag (Computer History Museum, CC BY 2.0) zeigt vor allem eine Ausstellungswand.

**13. invention-camera – Die Kamera**
- Wahl: `Camerae-obscurae.jpg` · Foto (Museumsstücke) · Edal Anton Lefterov · CC BY-SA 3.0 · 1974 × 1313
- Alt: „Zwei alte Holzkästen mit Linse. Licht wirft in ihnen ein Bild an die Rückwand.“
- Hinweis: Das älteste Foto der Welt (Niépce) ist im kleinen Bild für Kinder nicht zu erkennen.

**14. invention-telescope – Das Fernrohr**
- Wahl: `17th century telescopes in Galileo Museum 0640.jpg` · Foto (Museumsstücke) · C messier · CC BY 4.0 · 4999 × 3749
- Alt: „Mehrere alte Fernrohre aus dem 17. Jahrhundert im Galileo-Museum in Florenz.“

**15. invention-microscope – Das Mikroskop**
- Wahl: `Facsimile of the Leeuwenhoek microscope in Utrecht University Wellcome M0005632.jpg` · Foto (Nachbau) · Wellcome Collection · CC BY 4.0 · 4986 × 2446
- Alt: „Ein kleines Mikroskop aus Metall mit nur einer winzigen Linse.“
- Hinweis: Es hat nur eine Linse, die Karte beschreibt ein Mikroskop mit Objektiv und Okular. Die Unterschrift sagt „ein frühes Mikroskop mit einer Linse“. Urheberangabe auf der Dateiseite klären.

**16. invention-battery – Die Batterie**
- Wahl: `Voltaic cup pile demonstration.jpg` · Foto (Versuch) · GuidoB · CC BY-SA 3.0 · 2048 × 1536
- Alt: „Ein Glas mit Flüssigkeit, in dem zwei verschiedene Metalle stecken. Drähte führen zu einem kleinen Gerät.“
- Warum: Zwei Metalle und eine Flüssigkeit, genau der Aufbau aus der Karte.

**17. invention-generator – Der Generator**
- Wahl: `Machine Gramme.jpg` · Foto (Museumsstück) · Icone5 · CC BY-SA 4.0 · 2832 × 2128
- Alt: „Eine alte Maschine aus Eisen von 1873, die durch Drehen Strom erzeugt.“

**18. invention-transistor – Der Transistor**
- Wahl: `A replica of the first working transistor 02.jpg` · Foto (Nachbau) · Mister rf · CC BY-SA 4.0 · 1600 × 1850
- Alt: „Ein Nachbau des ersten Transistors aus einem Plastikdreieck und Drähten.“

**19. invention-refrigerator – Der Kühlschrank**
- Wahl: `1929 General Electric 'Monitor Top' Refrigerator, Tallahassee Automobile Museum.jpg` · Foto (Museumsstück) · Michael Rivera · CC BY-SA 4.0 · 5184 × 3456
- Alt: „Alte weiße Kühlschränke von 1929 mit einer runden Dose obendrauf.“

**20. invention-bicycle – Das Fahrrad**
- **Kein passendes Bild.** Die Karte erklärt Kette und Zahnräder. Die gefundenen Hochräder haben keine Kette. In Teilschritt 4 gezielt nach einem Foto von Kette und Kettenblatt suchen, sonst gekennzeichnete eigene Illustration.

**21. invention-elevator – Der Aufzug**
- Wahl: `Elisha OTIS 1854 (cropped).jpg` · historischer Druck · unbekannt · gemeinfrei · 3503 × 2539
- Alt: „Eine alte Zeichnung: Ein Mann steht auf einer Aufzugsplattform hoch über vielen Zuschauern.“
- Warum: Elisha Otis zeigte 1854 seine Fangsicherung, um die es in der Karte geht.

**22. invention-seismograph – Der Seismograf** (ersetzt das KI-Bild)
- Wahl: `Seismogram on historical seismometer at Institute of Geophysis of the Czech Academy of Science (12).jpg` · Foto · Petr Brož (Czech Academy of Science) · CC BY-SA 4.0 · 6000 × 4000
- Alt: „Ein Stift zeichnet auf einer Papierrolle eine Linie, die zeigt, wie der Boden zittert.“

**23. invention-3d-printing – Der 3D-Druck** (ersetzt das KI-Bild)
- Wahl: `Prusa i3 - RepRap 3D printer printing.jpg` · Foto · John Abella · CC BY 2.0 · 2448 × 3264
- Alt: „Ein 3D-Drucker baut Schicht für Schicht eine kleine Vase.“
- Hinweis: Es zeigt ein Verfahren mit Kunststofffaden. Die Karte sagt, dass es mehrere Verfahren gibt.

**24. invention-sewing-machine – Die Nähmaschine** (ersetzt das KI-Bild)
- Wahl: `1846 - Elias Howe Jr.'s Sewing Machine Patent Model, from the National Museum of American History - NMAH-DOR2010-0923-000001.jpg` · Foto (Museumsstück, Patentmodell) · Smithsonian, National Museum of American History · gemeinfrei · 3090 × 4652
- Alt: „Ein altes kleines Modell von Howes Nähmaschine von 1846 mit Rad und Nadel.“
- Hinweis: Gemeinfreiheit an der Quelle des Smithsonian bestätigen.
