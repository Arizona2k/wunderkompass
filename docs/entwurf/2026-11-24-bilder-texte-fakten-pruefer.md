# Bildtexte für 40 Fotos: Prüfung des `fakten-pruefer` (24.11.2026)

Geprüft: `docs/bilder/texte-2026-11-24.json`, `docs/bilder/vorschlaege-2026-11-24-paket-1.json`, `docs/bilder/vorschlaege-2026-11-24-paket-2.json`, `app/world-catalog.json`. Grundlage: Commons-Metadaten aller 40 Dateien über die API; 16 Bilder selbst als Vorschau angesehen (Clownfisch, Blauwal, Feuer, Meitner, Mandela, Walross, Strauß, Kurzschnabeligel, Schnecke, Orca, Anning, Murasaki, Kompass, Merian, Wright Flyer über die LOC, Ibn al-Haytham als LOC-Ausschnitt), dazu die Ibn-Sina-Handschrift über Wellcome. Bericht gekürzt auf Befunde und Belege, sonst wörtlich.

**Ergebnis:** Ein Text muss geändert werden (Ibn Sina). Drei sollten genauer werden (Merian, Feuer, Clownfisch). Alles andere ist bestätigt.

## Änderung nötig

1. **`ibn-sina-manuscript`, caption „Wann sie abgeschrieben wurde, weiß man nicht.“: falsch.**
   - Das Wellcome-Bild trägt „WELLCOME OR. 73“ (https://wellcomecollection.org/works/vcjm2j7z).
   - Die Handschrift MS Arabic 73 (45 Blätter) ist auf das 17. Jahrhundert datiert (https://wellcomecollection.org/works/qap7puqr).
   - Sie enthält genau einen Text, „أحكام الأدوية القلبية“, Verfasser Ibn Sina, 980–1037 (https://wellcomecollection.org/works/ayzh5uqf).
   - Der dort zitierte Textanfang steht sichtbar auf der rechten Seite des Fotos; der Prüfer hat beides selbst verglichen. Der Text ist also wirklich von Ibn Sina.
   - Vorschlag: „Kein Bild von Ibn Sina, sondern eine Handschrift mit seinem Text über Heilmittel für das Herz. Sie wurde erst etwa 600 Jahre nach seinem Tod abgeschrieben.“ (17. Jahrhundert minus 1037 sind 564 bis 663 Jahre.)
   - Den Katalogsatz MS Arabic 73 als Quelle aufnehmen.

## Genauer machen

2. **`maria-sibylla-merian`, caption:** stimmt mit Einschränkung.
   - Commons und Wikidata/RKD nennen das Bild „Portrait of a woman called Maria Sibylla Merian“, also mit unsicherer Zuordnung. Die Universität Nijmegen schreibt ebenso (https://shewrote.rich.ru.nl/works/53732a16-060e-4b8e-9ea8-a874840e8b32).
   - Artothek führt es laut Websuche mit dem Maler „Marrel, Jacob (?)“. Die Seite selbst war nicht abrufbar.
   - Geboren am 2.4.1647 (NDB, https://www.deutsche-biographie.de/118581082.html), 1679 also „etwa 30“.
   - Stiefvater belegt: Wandtext des Kunstmuseums Basel „stepdaughter of the still life painter Jacob Marrel“ (https://cdn.kunstmuseumbasel.ch/website/wandtexte-engl_d92f6dfa.pdf).
   - Vorschlag: „Dieses Gemälde von 1679 soll Maria Sibylla Merian zeigen, mit etwa 30 Jahren. Gemalt hat es wohl ihr Stiefvater Jacob Marrel.“
3. **`neolithic-fire-kit`, „Feuerzeug“:** fachlich richtig, aber Kinder denken an ein Gasfeuerzeug.
   - „Néolithique moyen“ heißt mittlere Jungsteinzeit. Im Elsass ist das die erste Hälfte des 5. Jahrtausends v. Chr., etwa 4900 bis 4400 v. Chr. (Revue archéologique de l'Est, https://journals.openedition.org/rae/10382). Das sind rund 6400 bis 6900 Jahre. „Über 6000“ ist sicher, „rund 7000“ ist zu hoch.
   - Vorschlag: „Werkzeuge zum Feuermachen aus der Jungsteinzeit, über 6000 Jahre alt. Damit schlug man Funken. Feuer nutzten Menschen aber schon viel früher.“
4. **`clownfish`, alt_de „Fisch“:** Die Vorsicht ist unnötig.
   - iNaturalist-Beobachtung 37261056 (22.09.2015, Stufe „research“): vier übereinstimmende Bestimmungen als Amphiprion percula, Lizard Island, Great Barrier Reef (https://api.inaturalist.org/v1/observations/37261056).
   - A. ocellaris kommt am Great Barrier Reef nicht vor (Australian Museum, https://australian.museum/learn/animals/fishes/eastern-clown-anemonefish-amphiprion-percula).
   - „Drei weiße, schwarz umrandete Streifen“ stimmt (https://fishesofaustralia.net.au/home/species/317).
   - Vorschlag: „Ein Echter Clownfisch …“. „Fisch“ ist aber nicht falsch.

## Bestätigt (Auswahl der markierten Punkte)

- **Wright Flyer:**
  - LOC-Schlagwort „Wright flyer“ (https://www.loc.gov/item/2011632160/); Commons-Kategorie „Wright Flyer at the National Air and Space Museum“.
  - Doppeltes Höhenruder vorn, die Figur liegt bäuchlings, das Flugzeug hängt unter Glas: Das passt zur Halle „Milestones of Flight“, wo der Flyer bis zum 24.09.2003 hing.
  - Bespannung „Muslin“ (Smithsonian, https://airandspace.si.edu/collection-objects/1903-wright-flyer/nasm_A19610048000).
  - Liegender Pilot: Britannica.
  - Optionaler Zusatz: „Heute steht es dort tiefer, in einem anderen Saal.“
- **Meitner:** IAEA-Text auf Commons, 19.05.1963, Flughafen Schwechat, Empfang durch Sigvard Eklund. Den Mann im Bild nicht zu nennen bleibt richtig. Die Ausstellung „Atoms at Work“ ist nur über die IAEA belegt.
- **Anning:** „with her dog Tray“, „before 1842“, Natural History Museum. Sie starb 1847.
- **Murasaki:** Tosa Mitsuoki (1617–1691), „Before 1691“. „Über 600 Jahre“ passt.
- **Ibn al-Haytham:** Hevelius, Selenographia 1647 (Adolph Boÿ, Jeremias Falck); 607 Jahre nach 1040. Das Kennwort „Spätere Darstellung“ ist richtig. Ein geometrisches Blatt ist im Ausschnitt nicht zu sehen; es zu streichen war richtig.
- **Mandela:** 04.07.1993, Verleihung der Liberty Medal in Philadelphia (https://constitutioncenter.org/about/liberty-medal/recipients/nelson-mandela-f.-w.-de-klerk). Clinton steht links. Mandela hier nicht „Präsident“ zu nennen, ist richtig.
- **Kompass:** Maison Houlliot & Cie, Paris, etwa 1866/67 bis 1946 (Sammlerquellen). „Viel älter“ stimmt.
- **Tierarten:** Alle passen zur jeweiligen Karte und zum alt_de, laut Commons. Dazu gehören Kurzschnabeligel, Schnecke (Cornu aspersum), Strauß (rosa Hals und Beine), Walross, Blauwal (Luftbild, Southwest Fisheries Science Center) und Orca (Unimak Island, Augenfleck sichtbar).
- **Lehmann, Tagore, Butler, Fahrrad:**
  - Lehmann 1932; Tagore 1909 in Kolkata.
  - Butler am 25.10.2005, beim Signieren von „Fledgling“.
  - Fahrrad „Fixed gear“ von 2008, also nur ein Gang.

## Nicht geprüft

- 24 Bilder hat der Prüfer nicht selbst angesehen, darunter Okapi, Erdmännchen, Katta, Biber, Fuchs, Waschbär, Igel, Eule, Eisvogel, Papageitaucher, Chamäleon, Salamander, Frosch, Aal, Monarch, Hummer, Sepia, Seepferdchen, Lehmann, Butler, Tagore und Fahrrad. Deren alt_de hat er nur mit der Commons-Beschreibung abgeglichen.
- Merian: Die Basler Sammlungsseite und der RKD-Satz waren nicht abrufbar.
- Murasaki: Dass das Bild im Ishiyama-dera hängt, ist nicht unabhängig belegt. Das steht aber auch nicht im Text.
- Mandela: Die Quellseite der Clinton-Bibliothek hat der Prüfer nicht geöffnet.
