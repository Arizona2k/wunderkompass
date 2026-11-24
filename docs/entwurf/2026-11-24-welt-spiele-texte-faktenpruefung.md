# Welt-Spiele: neue Spieltexte – Faktenprüfung

Stand: 24.11.2026. Bericht des Helfers `fakten-pruefer` zu den neuen Personen-Rätseln (`EIGENE_RAETSEL`), der dritten Antwort bei „Früher oder heute?“ und den geänderten Tier-Fallen. Der Helfer hat nichts geändert. Umsetzung durch Claude: Abschnitt am Ende.


Kurz vorweg: In Teil A muss nur das Einstein-Rätsel geändert werden, weil die Karte seine beiden Aussagen nicht enthält. In Teil B ist „Nur ein Zukunftswunsch“ überall klar falsch; vier Aufgaben sind aber mehrdeutig. Teil C ist ohne Befund.

Ich habe nichts geändert. Geprüft habe ich `app/world-game-support.mjs` (`EIGENE_RAETSEL`), die Personenkarten in `app/world-catalog.json`, `app/world-game-fallen.json`, `app/world-game-tier-fallen.json` und `content/research/animals.json`. `profiKandidaten` und `worldGameBank` habe ich mit den genannten Befehlen ausgeführt.

---

### A. Personen-Rätsel „Wer war das?“

**1. Einstein** (`person-albert_einstein`): „fand heraus, dass die Zeit nicht überall gleich schnell vergeht … E = mc²“
- **Urteil:** In der Sache stimmt es mit Einschränkung. **Die Karte deckt es aber nicht.** Ich habe den ganzen Katalog durchsucht: „mc²“ kommt nirgends vor, und dass Zeit unterschiedlich schnell vergeht, steht auf keiner Karte. Die Karte sagt nur „untersuchte Licht, Raum und Zeit“ und „spezielle und allgemeine Relativitätstheorie“. Damit verstößt das Rätsel gegen die Regel „nur Aussagen, die die Karte deckt“.
- **Beleg:** Die Quellen der Karte tragen beide Aussagen bereits:
  - NIST (https://www.nist.gov/atomic-clocks/a-powerful-tool-for-science/putting-einstein-test): „The faster you move relative to a motionless observer, the slower time passes for you.“ und „The more strongly you feel the force of gravity, Einstein argued, the slower time passes for you.“
  - AIP (https://history.aip.org/exhibits/einstein/great1.htm), Abschnitt zu 1905: „The relationship is expressed as an equation: E=mc²“.
- **Einschränkung zu „fand heraus“:** Einstein hat den Effekt mit seiner Theorie vorausgesagt. Gemessen wurde er erst später.
- **Vorschlag, eine von zwei Möglichkeiten:**
  - (a) Auf der Karte einen Satz ergänzen, gestützt auf NIST und AIP, zum Beispiel: „Einstein sagte voraus: Uhren gehen nicht überall gleich schnell. Spätere Messungen zeigten, dass das stimmt. 1905 schrieb er auch die berühmte Formel E = mc² auf.“ Das Rätsel wird dann leicht angepasst: „Diese Person sagte voraus, dass Uhren nicht überall gleich schnell gehen. Von dieser Person stammt auch die berühmte Formel E = mc².“
  - (b) Das Rätsel nur aus Karteninhalten bauen: „Diese Person erforschte Licht, Raum und Zeit und bekam 1921 den Physik-Nobelpreis.“
- **Eindeutigkeit:** Die Profi-Kandidaten sind Meitner, Lehmann, Leavitt, Curie und Tagore. Keine dieser Personen passt. Meitner hat E = mc² zwar beim Erklären der Kernspaltung benutzt, aber die Formel „stammt“ nicht von ihr, und ihre Karte erwähnt sie nicht. Ein Ausschluss ist nicht nötig.

**2. Darwin** (`person-charles_darwin`): „reiste fünf Jahre lang mit dem Schiff ‚Beagle‘ um die Welt. Später erklärte diese Person, wie sich Tiere und Pflanzen über sehr lange Zeit verändern.“
- **Urteil:** Stimmt mit Einschränkung.
- **Beleg:**
  - NHM (https://www.nhm.ac.uk/discover/charles-darwin-most-famous-biologist.html): „a five-year voyage aboard HMS Beagle“.
  - Royal Museums Greenwich (https://www.rmg.co.uk/stories/topics/hms-beagle): „The second voyage (1831–36) took her to South America and then around the world.“
  - Die Reise dauerte genau vom 27.12.1831 bis 2.10.1836, also knapp fünf Jahre.
- **Kartendeckung:** „1831 bis 1836“ steht auf der Karte, „um die Welt“ nicht wörtlich. Das ist eine kleine Lücke; der Satz lässt sich auf der Karte mit RMG als Beleg ergänzen.
- **Vereinfachung:** „wie sich Tiere und Pflanzen … verändern“ kann so klingen, als verwandle sich ein einzelnes Tier. Die Karte warnt ausdrücklich davor: „Ein einzelnes Tier verwandelt sich dabei nicht auf Wunsch.“
- **Vorschlag:** „Diese Person reiste fast fünf Jahre lang mit dem Schiff ‚Beagle‘ um die Welt. Später erklärte sie, wie sich Lebewesen über viele Generationen verändern.“
- **Eindeutigkeit:** Die Profi-Kandidaten (Lovelace, Karl Benz, Bertha Benz, Hokusai, Tagore) sind ohne Befund. Humboldt und Anning sind schon ausgeschlossen. Mary Anning steht als feste Entdecker-Antwort im Rätsel und wird über den Ausschluss richtig ersetzt.

**3. Benz** (`person-karl_benz`): „entwickelte einen Wagen mit Benzinmotor“
- **Urteil:** Stimmt. Die Karte deckt es mit der Kartenfrage „Einen frühen Wagen mit Benzinmotor entwickeln“.
- **Beleg:** Deutsches Museum (https://www.deutsches-museum.de/museum/presse/meldung/eine-ikone-der-automobilgeschichte-wird-140): „Der Motor hatte fast einen Liter Hubraum, nur einen Zylinder und wurde mit Benzin betrieben. Wohlgemerkt nicht mit unserem heutigen Benzin, sondern mit Leichtbenzin aus der Apotheke.“
- **Eindeutigkeit:** Ohne Befund. Bertha Benz ist ausgeschlossen. Die übrigen Profi-Kandidaten (Tagore, Curie, Leavitt, Lovelace, Meitner) passen nicht. Daimler oder Maybach haben keine Personenkarte.

**4. al-Chwarizmi** (`person-al_khwarizmi`): „schrieb in Bagdad wichtige Bücher über das Rechnen und die Algebra“
- **Urteil:** Stimmt. Die Karte deckt es im Intro.
- **Beleg:** MacTutor (https://mathshistory.st-andrews.ac.uk/Biographies/Al-Khwarizmi/): „scholars at the House of Wisdom in Baghdad“. Das Algebra-Buch nennt die Seite „the most famous and important of all of al-Khwarizmi's works“, dazu „also wrote a treatise on Hindu-Arabic numerals“.
- **Eindeutigkeit:** Ohne Befund, mit einem Hinweis. Ibn al-Haytham (Profi-Kandidat) hat laut Karte das Arbeitsgebiet „Optik und Mathematik“. Seine Karte nennt aber Kairo, nicht Bagdad, und keine Algebra. Unterscheidbar bleibt es also über „Bagdad“ und „Algebra“, ein Ausschluss ist nicht nötig. Zaha Hadid ist in Bagdad geboren, ist aber kein Kandidat.

**5. Armstrong** (`person-neil_armstrong`): „Bei Apollo 11 landete diese Person zusammen mit Buzz Aldrin auf dem Mond.“
- **Urteil:** Stimmt. Der Satz steht wörtlich im Intro der Karte.
- **Beleg:** NASA-Missionsüberblick (https://www.nasa.gov/missions/apollo/apollo-11/apollo-11-mission-overview/): „Partially piloted manually by Armstrong, the Eagle landed in the Sea of Tranquility … Armstrong and Aldrin returned to the CSM with Collins.“
- **Eindeutigkeit:** Ohne Befund. Katherine Johnson hat für Apollo gerechnet, ist aber nicht gelandet.

**6. Mandela** (`person-nelson_mandela`): Einsatz gegen die Apartheid, „staatliches System … rassistische Gesetze“, „1994 kam diese Person an die Spitze des Landes“
- **Urteil:** Stimmt. Die Karte deckt es wörtlich im Intro: „wurde 1994 Präsident“.
- **Beleg:** Nelson Mandela Foundation (https://www.nelsonmandela.org/biography): „On 10 May 1994 he was inaugurated as South Africa's first democratically elected President.“ Als Präsident war er Staats- und Regierungschef, „an der Spitze des Landes“ trifft also zu.
- Die Erklärung der Apartheid ist kindgerecht und richtig verkürzt. Die Karte ergänzt in den Absätzen „nach rassistischen staatlichen Kategorien eingeteilt … ungleiche Rechte“.
- **Eindeutigkeit:** Ohne Befund.

**7. Murasaki Shikibu** (`person-murasaki_shikibu`): Kaiserhof, frühes 11. Jahrhundert, Genji
- **Urteil:** Stimmt. Der Satz steht wörtlich im Intro der Karte.
- **Beleg:** Kyoto National Museum (https://www.kyohaku.go.jp/eng/exhibitions/special/2026_genji/):
  - Die Seite nennt die Hofdame „lady-in-waiting to Empress Shōshi“ und das Werk „written over a thousand years ago during the Heian period“.
  - „No autograph manuscript by Murasaki Shikibu herself survives“.
  - „Frühes 11. Jahrhundert“ steht dort nicht wörtlich. Es folgt aber aus der Hofzeit unter Shōshi (988–1074).
- **Eindeutigkeit:** Ohne Befund. Unter den Kandidaten ist keine japanische Person; Hokusai ist kein Kandidat.

**8. Tagore** (`person-rabindranath_tagore`): Gedichte, Geschichten, Lieder; „aus frei gezogenen Linien neue Formen“
- **Urteil:** Stimmt mit kleiner Einschränkung. Die Karte deckt es wörtlich im Intro.
- **Beleg:** V&A (https://www.vam.ac.uk/articles/rabindranath-tagore-poet-and-painter): Die Bilder „began with doodles that turned crossed-out words and lines into images“ und „were unplanned and shaped by accidents and intuitive decisions“. Weiter heißt es dort „best known as a poet“, „a composer“ und „especially of short stories“.
- **Hinweis:** „Frei gezogene Linien“ ist eine freie Wiedergabe. Genauer und für Kinder anschaulicher wäre: „Aus Kritzeleien und durchgestrichenen Wörtern in seinen Texten machte diese Person Bilder.“ Das ist ein Vorschlag, kein Fehler.
- **Eindeutigkeit:** Ohne Befund. Curie, Leavitt, die beiden Benz und Meitner haben weder Gedichte noch Lieder geschrieben.

**9. Jemison** (`person-mae_jemison`): „verband Medizin, Technik und Raumfahrt. 1992 forschte diese Person im Weltraumlabor der Endeavour.“
- **Urteil:** Stimmt. Der Satz steht im Intro der Karte.
- **Beleg:** NASA STS-47 (https://www.nasa.gov/mission/sts-47/): „Space Shuttle: Endeavour“, „Launched: September 12, 1992“, „Spacelab-J“, „Mae C. Jemison, Mission Specialist“. Spacelab war ein Labormodul in der Ladebucht der Endeavour, „Weltraumlabor der Endeavour“ passt also.
- **Eindeutigkeit:** Ohne Befund. Berners-Lee, Hadid, Butler, Bell Burnell und Maathai sind nicht ins All geflogen.

---

### B. „Früher oder heute?“

**„Nur ein Zukunftswunsch“ ist in allen 21 Aufgaben mit dieser Antwort klar falsch.** Jeder Satz beschreibt etwas, das es wirklich gab oder gibt; kein Satz beschreibt einen Plan oder Traum. Die Kompass-Heute-Aufgabe hat andere Antworten („Früher und heute“). Sie ist richtig und war nicht Teil des Auftrags.

Geprüfte Einzelfakten:
- **Goddard:** NASA, laut Suchergebnis (zum Beispiel https://www.nasa.gov/history/95-years-ago-goddards-first-liquid-fueled-rocket/): „rose 41 feet in the air during its 2.5-second flight“. „Klein und flog nur kurz“ stimmt.
- **Benz-Motorwagen:** Deutsches Museum (Link oben): „Benz-Dreiräder“, „Mittelding aus Fahrrad und Kutsche“. „Drei Räder, kein geschlossener Innenraum“ stimmt.
- **Sputnik 1 sendete Funksignale:** stimmt (Allgemeinwissen, nicht eigens abgerufen).

Bei diesen Aufgaben ist die jeweils **andere Zeit nicht ganz klar falsch**:

1. **`invention-internet`**: „Einige Forschungsrechner waren über Leitungen verbunden.“ Nur die Vergangenheitsform zeigt „Früher“ an; heute sind Forschungsrechner erst recht über Leitungen verbunden. Das ist die schwächste Aufgabe.
   - **Vorschlag:** „Im allerersten Netz waren nur wenige Forschungsrechner über Leitungen verbunden.“
2. **`invention-airplane-today`**: „Auch Gleitflugzeuge ohne eigenen Motor können fliegen.“ Gleitflug gab es schon vor dem Motorflug. Das Lilienthal-Museum (https://lilienthal-museum.de/olma/ehome.htm) schreibt, Lilienthal gelangen 1891 „the first safe, multiple gliding flights in history“. Als Merkmal für „Heute“ ist der Satz darum irreführend und könnte die Fehlvorstellung erzeugen, Segelflug sei neu.
   - **Vorschlag:** „Große Passagierflugzeuge fliegen jeden Tag mit vielen Menschen über Meere und Kontinente.“
3. **`invention-light`** (Glühlampe) und **`invention-railway`** (Dampflok): Nur die Vergangenheitsform macht „Heute“ falsch. Beides gibt es noch:
   - Glühlampen für besondere Zwecke. Der EU-Ausstieg für Haushaltslampen lief schrittweise ab 2009 (Verordnung (EG) Nr. 244/2009); das habe ich hier nicht eigens abgerufen.
   - Dampfloks auf Museums- und Schmalspurbahnen; ebenfalls nicht eigens abgerufen.
   - **Vorschlag:** „Früher leuchteten die meisten Lampen so: …“ und „Früher zogen vor allem Dampflokomotiven die Züge …“
4. **`invention-car-today`**: „Es gibt Autos mit Verbrennungsmotor, Elektromotor oder beiden.“ Elektroautos gab es schon um 1900. Das Deutsche Museum schreibt dazu: „nach 1900 einen kleinen Boom von Elektroautos“, und die Benz-Karte nennt selbst Elektrofahrzeuge. Der Sicherheitsgurt macht „Heute“ dennoch eindeutig. Das hat geringe Priorität und ist kein Muss.

Ohne Befund sind:
- „Frühes Telefon“, „Frühe elektronische Rechner“, „Frühe Formen“ (Kompass), „Druckwerkstatt“, „Goddard“, „Sputnik“, „Frühe Kombinationsgeräte“ und „Frühe Flugzeuge“: Hier zeigen „frühe“ oder ein Name die Zeit klar an.
- Alle übrigen Heute-Aufgaben (LED, Bahn, Telefon, Chips, Internet/Web, Druck/digital, wiederverwendbare Raketenteile, Satelliten, Smartphone).

---

### C. Tierfallen (`app/world-game-tier-fallen.json`)

- **Grüne Meeresschildkröte, Nahrung.** Die richtige Antwort im Spiel lautet „Als erwachsenes Tier vor allem Pflanzen“. Alle sieben Fallen sind klar falsch: „Vor allem wirbellose Bodentiere“, „Vor allem kleine Fische“, „Nektar und Pollen“, „Eukalyptusblätter“, „Bambus“, „Vor allem kleine Säugetiere“, „Insekten“.
  - **Beleg:** NOAA (https://www.fisheries.noaa.gov/species/green-turtle): Erwachsene: „Their diet mainly consists of algae and seagrasses“, sie „may also eat invertebrates“. Junge Tiere im offenen Meer fressen „plant and animal life found in oceanic drift communities“. Junge Tiere fressen also Treibgut-Lebewesen im offenen Meer, nicht „vor allem“ Bodentiere oder Fische.
- **Axolotl:** „Früchte, Blätter und auch Insekten“ ist als ganze Beschreibung klar falsch.
  - **Beleg:** San Diego Zoo (https://animals.sandiegozoo.org/animals/axolotl): „worms, mollusks, crustaceans, insect larvae, and even small fish“. Früchte oder Blätter werden nicht genannt; Pflanzen dienen nur als Versteck.
- **Eisbär:** „Antarktis“ ist klar falsch.
  - **Beleg:** WWF (https://www.wwf.de/themen-projekte/artenlexikon/eisbaer/): „Eisbären leben in der Polarregion rund um den Nordpol.“ Dazu der Hinweis in `content/research/animals.json`: „Nicht in die Antarktis platzieren.“
- **Kaiserpinguin:** „Arktis“ ist klar falsch.
  - **Beleg:** Australian Antarctic Division (https://www.antarctica.gov.au/about-antarctica/animals/penguins/emperor-penguin/): „breed in colonies scattered around the Antarctic continent“.

---

## Zusammenfassung

**Falsch, muss geändert werden**
- Einstein-Rätsel: Zeit und E = mc² stehen nicht auf der Karte, das verstößt gegen die Deckungsregel. Lösung: einen Kartensatz mit den vorhandenen Quellen NIST und AIP ergänzen oder das Rätsel umschreiben. Außerdem „fand heraus“ durch „sagte voraus“ ersetzen.

**Unklar oder mehrdeutig**
- Darwin-Rätsel: Aus „Tiere und Pflanzen verändern sich“ besser „Lebewesen über viele Generationen“ machen, um die Fehlvorstellung zu vermeiden. „Um die Welt“ steht nicht auf der Karte; RMG belegt es. „Fünf Jahre“ ist eigentlich „knapp fünf“.
- `invention-internet` (Früher): „Heute“ ist nicht klar falsch.
- `invention-airplane-today`: Den Gleitflug-Satz streichen, weil es Gleitflug schon vor dem Motorflug gab.
- `invention-light`, `invention-railway` (Früher): Nur die Zeitform entscheidet. „Früher meistens …“ wäre klarer.
- `invention-car-today`: Elektro- und Hybridautos gab es schon um 1900. Geringe Priorität, der Gurt entscheidet.
- Tagore: „frei gezogene Linien“ wäre genauer als „Kritzeleien und durchgestrichene Wörter“. Nur ein Vorschlag.

**Geprüft ohne Befund**
- Rätsel Benz, al-Chwarizmi, Armstrong, Mandela (samt Apartheid-Erklärung und 1994), Murasaki, Jemison (Endeavour, 1992). Für alle neun Rätsel ist die Profi-Kandidatenliste ohne neues Ausschlusspaar. Die vorhandenen Ausschlüsse (Benz ↔ Bertha Benz, Darwin ↔ Humboldt/Anning) genügen.
- „Nur ein Zukunftswunsch“ ist in allen 21 Aufgaben klar falsch.
- Teil C vollständig.

## Quellenlage
- Die Karten haben überwiegend gute, ursprüngliche Quellen: NHM, Linnean Society, NASA, Nelson Mandela Foundation, V&A, NGMA, Kyoto National Museum, MacTutor, Deutsches Museum, NIST, AIP, NOAA, WWF.
- **Eine tote Quelle:** Die Benz-Karte verweist auf DPMA https://www.dpma.de/dpma/veroeffentlichungen/patentefrauen/berthabenz/index.html. Die Seite liefert HTTP 404 (am 24.11.2026 zweimal abgerufen, mit WebFetch und mit curl). Sie sollte ersetzt oder entfernt werden; das Deutsche Museum trägt die Aussagen allein.

## Nicht geprüft
- Den Abschnitt zur Entstehungszeit des Genji bei Britannica und beim Met Museum konnte ich nicht lesen (403 bzw. Bot-Sperre). „Frühes 11. Jahrhundert“ stützt sich darum nur mittelbar auf Kyoto.
- Den EU-Glühlampenausstieg und heutige Dampflok-Linien habe ich nicht abgerufen; das ist Allgemeinwissen.
- Die Sputnik-Funksignale habe ich nicht abgerufen.
- Die übrigen Fallen der Tierliste (etwa „Wald“ beim Eisbär) gehörten nicht zum Auftrag und sind ungeprüft.
- Die Bildnachweise der Karten habe ich nicht geprüft.

Sources:
- [NIST: Putting Einstein to the Test](https://www.nist.gov/atomic-clocks/a-powerful-tool-for-science/putting-einstein-test)
- [AIP: Einstein 1905](https://history.aip.org/exhibits/einstein/great1.htm)
- [NHM: Charles Darwin](https://www.nhm.ac.uk/discover/charles-darwin-most-famous-biologist.html)
- [Royal Museums Greenwich: HMS Beagle](https://www.rmg.co.uk/stories/topics/hms-beagle)
- [Deutsches Museum: Benz-Motorwagen](https://www.deutsches-museum.de/museum/presse/meldung/eine-ikone-der-automobilgeschichte-wird-140)
- [MacTutor: Al-Khwarizmi](https://mathshistory.st-andrews.ac.uk/Biographies/Al-Khwarizmi/)
- [NASA: Apollo 11 Mission Overview](https://www.nasa.gov/missions/apollo/apollo-11/apollo-11-mission-overview/)
- [Nelson Mandela Foundation: Biografie](https://www.nelsonmandela.org/biography)
- [Kyoto National Museum: Genji 2026](https://www.kyohaku.go.jp/eng/exhibitions/special/2026_genji/)
- [V&A: Tagore, poet and painter](https://www.vam.ac.uk/articles/rabindranath-tagore-poet-and-painter)
- [NASA: STS-47](https://www.nasa.gov/mission/sts-47/)
- [NASA: Goddards erste Flüssigkeitsrakete](https://www.nasa.gov/history/95-years-ago-goddards-first-liquid-fueled-rocket/)
- [Otto-Lilienthal-Museum](https://lilienthal-museum.de/olma/ehome.htm)
- [NOAA: Green Turtle](https://www.fisheries.noaa.gov/species/green-turtle)
- [San Diego Zoo: Axolotl](https://animals.sandiegozoo.org/animals/axolotl)
- [WWF: Eisbär](https://www.wwf.de/themen-projekte/artenlexikon/eisbaer/)
- [Australian Antarctic Division: Emperor penguin](https://www.antarctica.gov.au/about-antarctica/animals/penguins/emperor-penguin/)
## Umsetzung (Claude, 24.11.2026)

Folgt.
