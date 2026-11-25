# Nachprüfung der Endfassung „Tier-Auflösungen“, Paket 1 (A1 bis A24) und Teil C

> Helferbericht (fakten-pruefer, opus/high), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

fakten-pruefer, opus / high. Ich habe keine Projektdateien geändert.

**Kurzurteil:** In A1 bis A24 ist keine geänderte Aussage im Kern falsch, es gibt also keinen Muss-Befund. Sechs Stellen sind ungenau oder falsch belegt (Soll), dazu kommen sieben kleine Verbesserungen (Kann). Alle drei Rechnungen stimmen: Giraffe und Lineal, Panda und Tafel Schokolade, Kaiserpinguin und Fußballfelder.

**Grundlage:**
- Die Quellen habe ich am 25.11.2026 abgerufen. Die meisten Seiten lagen noch aus meiner ersten Runde vor; ich habe sie wieder nach den Zitaten durchsucht. Neue Abrufe liegen in `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/fp2/` (Scratchpad, wird nicht dauerhaft gesichert).
- Ein Skript hat die 72 Texte aus `docs/entwurf/2026-11-25-tier-aufloesung-endfassung-texte.md` (Zeilen 1 bis 264) mit der Einbau-Datei `/home/user/wunderkompass/docs/entwurf/2026-11-25-tier-aufloesung-endfassung.json` verglichen: 0 Abweichungen. Geprüft ist also genau das, was eingebaut würde.

---

## Muss (falsch)

Keine.

---

## Soll (ungenau, zu stark oder falsch belegt)

**S1. Afrikanischer Savannenelefant, Zuhause** (⚠ des Autors)
- **Satz:** „Dort ist es meist heiß und trocken.“
- **Problem:** „meist trocken“ stimmt für die Savanne nicht. Es ist dort immer warm, aber sechs bis acht Monate im Jahr regnet es. Danach kommt eine lange Trockenzeit. Der San Diego Zoo sagt dazu nichts.
- **Beleg:** UCMP Berkeley, https://ucmp.berkeley.edu/ucmp_oldsite_nonwpfiles/exhibits/biomes/grasslands.php: „Savannas are always found in warm or hot climates … rainfall is concentrated in six or eight months of the year, followed by a long period of drought“.
- **Vorschlag:** „Dort ist es immer warm, und oft regnet es monatelang nicht.“ Diese Quelle ergänzen.

**S2. Großer Panda, Tierdetektiv**
- **Satz:** „Es ist rosa, nackt und blind.“
- **Problem:** Die Quellen widersprechen sich. Smithsonian schreibt „hairless“, der San Diego Zoo schreibt „covered in short white hair“. Neugeborene Pandas haben tatsächlich feines, kurzes weißes Haar. „nackt“ ist darum zu stark.
- **Beleg:** San Diego Zoo, https://animals.sandiegozoo.org/animals/giant-panda: „They're born pink, covered in short white hair, and are helpless.“ Smithsonian, https://www.nationalzoo.si.edu/animals/giant-panda: „Pink, hairless, and blind“.
- **Vorschlag:** „Es ist rosa, blind und fast nackt.“ Den San Diego Zoo als zweite Quelle angeben.
- **Die Rechnung stimmt:** 3 bis 5 Unzen sind 85 bis 142 g, eine Tafel Schokolade wiegt 100 g. Smithsonian vergleicht selbst mit einem „stick of butter“ (113 g).

**S3. Axolotl, Tierdetektiv**
- **Satz:** „Rosa Tiere wurden für Aquarien gezüchtet.“
- **Problem:** Das angegebene Zitat steht nicht auf der Seite des San Diego Zoo („naturally gray in color, though pink axolotls have been bred for the pet trade“). Ich habe die Seite zweimal abgerufen. Dort steht nur: „Although naturally dark, axolotls can be many colors: white (albino), pink, golden, or multicolored.“ Dass die Tiere gezüchtet werden, steht dort nicht. Der Toronto Zoo belegt die Zucht, nennt aber weiß und golden, nicht rosa.
- **Beleg:** Toronto Zoo, https://www.torontozoo.com/animals/Axolotl: „The colouring in the wild is gray brown, often with spots but for the aquarium trade, they are being bred in white (albino) and golden colours“.
- **Vorschlag:** „Helle, fast weiße Tiere werden für Aquarien gezüchtet.“ Als Quelle den Toronto Zoo nennen und das falsche Zitat streichen. Satz 1 („grau oder dunkel, wie der schlammige Seegrund“) und Satz 3 (Luft schnappen) trägt der San Diego Zoo wörtlich.

**S4. Orca, Futter**
- **Satz:** „Lachsjäger finden ihre Beute mit Klicklauten und Echo.“
- **Problem:** Die Aussage stimmt, aber die angegebene NOAA-Artseite trägt sie nicht. Dort steht nur „rely on underwater sound to feed“; das Wort Echoortung kommt nicht vor.
- **Beleg:** NOAA Fisheries, Sound Strategy: Hunting with the Southern Residents, Part 1, https://www.fisheries.noaa.gov/feature-story/sound-strategy-hunting-southern-residents-part-1: „echolocation, a form of sonar they use to find the Chinook salmon they favor as prey“ und „To hunt for fish, the whales use echolocation … searching for prey with slow click trains“.
- **Vorschlag:** Text bleibt, diese Quelle eintragen.

**S5. Gewöhnlicher Krake, Futter**
- **Satz:** „Krebse beißt er mit seinem harten Schnabel auf.“
- **Problem:** Die angegebene Quelle, Fiorito & Gherardi 1999, behandelt nur Muscheln. Für Satz 3 („Muscheln zieht er mit den Armen auseinander“) passt sie: „When the initial pulling method did not result efficient octopuses skipped to drilling“ (Abstract über Europe PMC gelesen). Für die Krebse trägt sie nichts. Ich korrigiere damit meine eigene Angabe aus Bericht A, S1.
- **Beleg für Satz 2:**
  - Monterey Bay Aquarium (Riesenkrake, also eine andere Art, gleiches Verhalten), https://www.montereybayaquarium.org/animals/animals-a-to-z/giant-pacific-octopus: „It may pull the hard-shelled prey apart, bite it open with its beak, or ‚drill‘ through its shell.“
  - NOAA Ocean Today, https://oceantoday.noaa.gov/howtofeedagiantoctopus/: „envelopes the crab and then he'll bite it with his beak“.
- **Vorschlag:** Text bleibt, Monterey Bay Aquarium als Quelle ergänzen.

**S6. Licht (`invention-light`), `more[0]` und `stages[2]`**
- **Satz:** „In den USA bauten Thomas Edison und sein Team bessere Lampen und ein Kraftwerk.“
- **Problem:** „bessere“ steht in keiner der angegebenen Quellen. Das Science Museum spricht von zwei unabhängigen Erfindungen. Die NPS-Kinderseite sagt, was Edisons Lampe besser konnte: Sie leuchtete lange.
- **Beleg:**
  - Science Museum Group, https://collection.sciencemuseumgroup.org.uk/objects/co42487/swan-electric-lamp: „invented independently in the late 1870s by Joseph Swan in England and Thomas Edison in the USA“.
  - NPS, https://home.nps.gov/edis/learn/kidsyouth/the-electric-light-system-phonograph-motion-pictures.htm: „Edison and his muckers had a long lasting light bulb“.
  - Das Kraftwerk ist belegt, NPS, https://www.nps.gov/edis/learn/historyculture/edison-biography.htm: „In September 1882, the first commercial power station, located on Pearl Street“.
- **Vorschlag:** „In den USA bauten Thomas Edison und sein Team Lampen, die lange leuchteten, und ein Kraftwerk.“

---

## Kann (kleine Verbesserungen)

- **Giraffe, Tierdetektiv:** „Jeder ist fast so lang wie ein Lineal.“ Die Quelle sagt „each one **can be** over 10 inches (25.4 centimeters)“. Der oberste Halswirbel ist kürzer, darum ist „Jeder“ etwas zu stark. Die Rechnung stimmt: Ein Schullineal ist 30 cm lang, ein Wirbel über 25 cm, also „fast so lang“. Kinder haben aber oft 15-cm-Lineale. Vorschlag: „Einer kann fast so lang sein wie ein langes Lineal.“
- **Kaiserpinguin, Zuhause:** „viele Schichten dichter Federn“. Die Quelle sagt „several layers“. Vorschlag: „mehrere Schichten“.
- **Bengaltiger, Zuhause:** „Dort stehen die Bäume im salzigen Wasser.“ Das passiert vor allem bei Flut (NOAA Ocean Service: „most mangroves get flooded at least twice per day“). Vorschlag: „Bei Flut stehen die Bäume dort im salzigen Wasser.“
- **Aufzug, `wrongReasons[2]`:** „so viel wie die Kabine und ein paar Fahrgäste“.
  - Die TK-Elevator-Seite sagt: Kabine plus 40 bis 50 % der Nutzlast. Bei kleinen Aufzügen für 8 Personen sind das 3 bis 4 Fahrgäste, „ein paar“ passt dort. Bei großen Aufzügen passt es nicht mehr.
  - `paragraphs[0]` sagt „etwa halb voll“. Auf derselben Karte stehen damit zwei verschiedene Bilder.
  - Das ist nicht falsch. Wenn es gleich klingen soll: „Das Gegengewicht wiegt so viel wie eine halb volle Kabine.“
- **Benz, `more[0]`** (Satz nicht neu, steht aber im geänderten Feld): „Die Patentanmeldung von 1886 trug die Nummer 37435.“ Die Nummer gehört zum erteilten Patent. Mercedes-Benz: „in 1886 he was granted patent No. 37 435“; NDB: „deutsche Reichspatent Nr. 37 435“. Vorschlag: „Sein Patent von 1886 hat die Nummer 37435.“
- **Licht, einheitliches Wort:** Die Früher-Stufe sagt jetzt „Glühfaden“, `parts[1]` heißt weiter „Glühdraht“. Beides ist richtig, ein Kind liest aber zwei Wörter für dasselbe Teil. Wenn gewünscht: `parts[1]` auf „Glühfaden“ umstellen.
- **Walhai, Zuhause:** „Oft kommt er in flaches Wasser …“. Georgia Aquarium sagt „Frequents shallow water areas … sometimes during seasonal plankton blooms“. „Oft“ geht, „Gern“ wäre näher an der Quelle.

---

## ⚠-Stellen aus Abschnitt 2 (soweit in A1 bis A24)

| Stelle | Urteil |
|---|---|
| Elefant, Zuhause, „heiß und trocken“ | Soll, siehe S1 |
| Elefant, Futter, „rupft Gras“ | Stimmt. San Diego Zoo: „African elephants are grazer-browsers and eat grasses“ und Rüssel „to grab, hold … pull“. |
| Elefant, Futter, „länger, als du wach bist“ | Stimmt nach meinem Wissen. AASM 2016: 6 bis 12 Jahre 9 bis 12 Stunden Schlaf, also 12 bis 15 Stunden wach, weniger als 16. Die Zahlen stehen nicht im Abstract (Europe PMC, PMID 27250809), ich nenne sie aus meinem Wissen. |
| Giraffe, Lineal | Stimmt, siehe Kann |
| Panda, Tafel Schokolade | Rechnung stimmt; „nackt“ ist Soll S2 |
| Gorilla, Zuhause, „WWF beschreibt beide Unterarten“ | Erledigt. Der WWF nennt die Unterart ausdrücklich: „Westliche Flachlandgorillas besuchen gerne die sumpfigen Bais, wo sie mineralreiche Wasserpflanzen zum Fressen finden.“ |
| Orang-Utan, Tierdetektiv, Satz 2 (Folgerung) | Vertretbar. San Diego Zoo: „long fingers and toes can easily grasp branches“, „prehensile feet“. |
| Orang-Utan, Zuhause, „oft nass“ | Vertretbar, Regenwald. Der San Diego Zoo trägt auch den Grund: „use leafy branches to shelter themselves from rain“. |
| Kaiserpinguin, Futter, Fußballfelder | Stimmt. 5 × 105 m = 525 m. Auch mit der größten Länge für Länderspiele (110 m) sind es 550 m, weniger als 565 m. Die Spielfeldlängen kenne ich aus den Fußballregeln (IFAB), diese Seite habe ich nicht abgerufen. Australian Antarctic Program: „the deepest dive recorded was to 565 metres“. |
| Krake, Tierdetektiv, Smithsonian Magazine | Stimmt. curl bekam 403, WebFetch las die Seite (Rachel Nuwer, 2013, aktualisiert 13.03.2024): „Two of the hearts work exclusively to move blood past the animal's gills“, dazu das dritte Herz; „the copper in octopus blood makes it appear blue“; Tinte „garbles creatures' senses of smell and taste“. |
| Biene, Zuhause, und Gartenkreuzspinne, Zuhause (Alltagswissen) | Beide Texte sind „wie Paket“, also unverändert. Darum nicht neu geprüft. |

---

## Teil C: Kartenkorrekturen

**Benz:** Namen, Daten und Quellen stimmen.
- Deutsche Biographie, https://www.deutsche-biographie.de/gnd118509225.html: Ansetzung „Benz, Carl“, Lebensdaten „1844 – 1929“, Beruf „Ingenieur“, unter den Namensvarianten „Benz, Karl“. Damit sind „Carl“, „manchmal auch Karl geschrieben“, 1844 bis 1929 und „Ingenieur“ belegt.
- Deutsches Museum: „Am 29. Januar 1886 … meldete der Ingenieur Carl Benz (1844 – 1929) das Patent … an“.
- Das Label „Deutsche Biographie · Benz, Carl Friedrich“ passt zur NDB-Überschrift „Benz, Carl Friedrich“.
- `AUFLOESUNG`: „1886 bekam er ein Patent“ stimmt (Mercedes-Benz: „in 1886 he was granted patent No. 37 435“).
- `world-connections.json`: Die Verbindung zu Bertha Benz stimmt. Das Deutsche Museum nennt die Fahrt 1888 von Mannheim nach Pforzheim „mit ihren Söhnen“. Die Korrektur „des Motorwagens“ ist richtig.
- Offen ist nur die Kann-Stelle zur „Patentanmeldung“, siehe oben.

**Aufzug:** Stimmt.
- TK Elevator, https://tkelevator.com/us-en/tools/classroom-on-demand/counterweights.html: „cab (structural load) plus part of the passenger load (40 to 50% of its rated load)“ trägt „etwa halb voll“.
- Dieselbe Seite: „reduces the effort required by the lifting machine“ trägt „macht dem Antrieb die Arbeit leichter“ und „muss der Antrieb weniger heben“.
- Dieselbe Seite: „Counterweights are only used for traction elevator applications“ trägt „Nicht alle Aufzüge verwenden diese Bauart“.
- „Es zieht auf der anderen Seite am Seil“ ist physikalisch richtig.
- Zu „ein paar Fahrgäste“ siehe Kann.

**Licht:** Stimmt bis auf „bessere“ (Soll S6).
- „Um 1879 … Swan … England“: Science Museum Group: „Early carbon and rod filament incandescent electric lamp 1878-9. Made by the English chemist, Joseph Swan“.
- „dünnes Stück Kohle“ trägt „carbon and rod filament“.
- „ein dünner Glühfaden“ in der Früher-Stufe ist für Kohle- und Drahtlampen richtig. Die NPS-Kinderseite: „the filament, the tiny thread that glows inside a light bulb“.
- Alle drei Quell-URLs sind erreichbar und passen zu ihren Labels.

**Kühlschrank:** Stimmt.
- Die Seite heißt „6.4 Refrigerators | EGEE 102: Energy Conservation for Environmental Protection“ (https://courses.ems.psu.edu/egee102/node/2402). Haupttext: „A refrigerator is a heat mover“. Das Label passt.
- Hinweis aus Bericht A gilt weiter: Nur den Haupttext zitieren, nicht das Video-Transkript unten auf der Seite.

---

## Geprüft und in Ordnung (geänderte Texte; Zitate auf der Seite wiedergefunden)

- **A1 Elefant:** Tierdetektiv, Futter
- **A2 Löwe:** Tierdetektiv, Zuhause (San Diego Zoo „up to 21 hours“; Smithsonian „primarily eat large animals“)
- **A3 Gepard:** alle drei (Smithsonian: „rudder“, „great traction“, „mom and cubs will do the same“, „termite mound“, „early morning and late afternoon“, „creep within 100 yards“, „eat quickly“)
- **A4 Bengaltiger:** Futter (WWF: „schleift der Tiger seine Beute an einen sicheren Ort“, „bis zu drei Tage“, „dämmerungs- oder nachtaktiv“); Zuhause mit Kann
- **A5 Giraffe:** Zuhause; Tierdetektiv mit Kann
- **A6 Großer Panda:** Zuhause (WWF: „keine Winterruhe“), Futter (WWF „circa 12 Stunden“; Smithsonian „digestive system … carnivore“), Satz „ist ein Bär“ (WWF: „Familie der Ursidae (Großbären)“)
- **A7 Gorilla:** Tierdetektiv (Smithsonian „arms are longer than their legs“; WWF „ergrauten Rückenhaare“, „Hauptaufgabe … Gruppe zu beschützen“), Futter (Smithsonian „longer distances traveled when more fruit is abundant“, „invertebrates found on leaves and fruits“)
- **A8 Orang-Utan:** Zuhause („drape large leaves over themselves like a poncho“), Futter („Figs … most common“, „mental map“)
- **A9 Eisbär:** alle drei (Noppen, steifes Fell, „must move ashore … may fast“, Robbe unter Schnee)
- **A10 Kaiserpinguin:** Tierdetektiv („taking turns to occupy the warmest and coldest positions“; ADW Hautfalte), Futter; Zuhause mit Kann
- **A11 Blauwal:** Tierdetektiv (NOAA: Barten „hang from the roof of the mouth“), Zuhause („migrate seasonally between summer feeding grounds and winter breeding grounds“)
- **A12 Großer Tümmler:** Tierdetektiv (UTMSI, Janik & Slater), Zuhause (UTMSI: „stays alert enough to watch for predators“)
- **A13 Orca:** Tierdetektiv (WWF UK: „creating waves to wash seals off ice floes“); Futter Satz 1 und 2 (NOAA „culture … of each ecotype“, „mainly salmon“), Satz 3 siehe S4
- **A14 Krake:** Tierdetektiv, Zuhause; Futter siehe S5
- **A15 Meeresschildkröte:** Tierdetektiv, Zuhause (NOAA: „comes from the color of their fat (not their shells)“, „incubating in the warm sand“)
- **A16 Känguru:** alle drei (San Diego Zoo „without expending much energy“; eLife „elastic energy storage“; Australian Museum „arid zone“, „provides them with their water needs“; Hellabrunn)
- **A17 Koala:** alle drei (u. a. „Koalas eat a little dirt now and then to help them digest“, „coadapted to be able to ingest these toxins“)
- **A18 Jaguar:** Tierdetektiv, Zuhause, Futter („stalk and ambush … at night“, „hard-shelled reptiles like turtles“)
- **A19 Honigbiene:** Tierdetektiv (NC Zoo: „workers fan drops of water on the hive floor to air condition their home in summer“), Futter (ASU: „Straw-like mouthparts … to drink fluids“, „pollen basket“)
- **A20 Axolotl:** Futter; Tierdetektiv Satz 1 und 3; Satz 2 siehe S3
- **A21 Walhai:** Tierdetektiv (National Geographic: „a whale's tail moves up and down but a shark's tail moves from side to side“), Futter („zooplankton … fish eggs“; „water is directed away through the gills“); Zuhause mit Kann
- **A22 Gartenkreuzspinne:** Tierdetektiv und Futter (Wildlife Trusts über WebFetch: „sit in the middle of the web“, „rush out and wrap their prey tightly in silk to stop them from moving“)
- **A23 Dromedar:** Tierdetektiv („When food is scarce … causing the hump to lean over and droop“; Größe hängt vom Futter ab), Zuhause (ADW „100 L of water in just 10 minutes“)
- **A24 Seeadler:** Futter (NABU: Fische „nah an der Wasseroberfläche“, Aas; Donau-Auen: „Oft wählen sie den einfacheren Weg und ernähren sich von Aas“)

---

## Quellenlage

- **Gut:** Fast alle Texte stützen sich auf Zoos, Behörden und Fachorganisationen: San Diego Zoo, Smithsonian, NOAA, WWF, Australian Antarctic Program, NABU, ADW, Georgia Aquarium. Für Kindertexte passt das.
- **Falsch zugeordnet oder zu schwach:**
  - Axolotl: Das Zitat steht nicht auf der Seite (S3).
  - Orca: Die Echoortung fehlt auf der NOAA-Artseite (S4).
  - Krake: Fiorito & Gherardi deckt die Krebse nicht ab (S5).
  - Panda: Smithsonian und San Diego Zoo widersprechen sich beim Fell (S2).

## Nicht geprüft

- **Unveränderte Texte** („wie Paket“): nicht erneut geprüft, wie beauftragt. Dazu gehören auch Biene, Zuhause, und Gartenkreuzspinne, Zuhause, obwohl sie im Bericht ein ⚠ tragen.
- **Gesperrt oder nur über Umwege gelesen:**
  - Smithsonian Magazine (curl 403, per WebFetch gelesen)
  - Wildlife Trusts (curl 403, per WebFetch)
  - PubMed (429, Abstract über Europe PMC)
  - Smithsonian Ocean, Seite zu Orcas und Lachsen (403, nicht gebraucht)
  - National Geographic Education, Savanne (404, ersetzt durch UCMP)
- **Nur aus meinem Wissen, nicht abgerufen:** die Schlafstunden der AASM für Kinder und die Spielfeldlängen der Fußballregeln (IFAB).
- **Nicht Teil dieses Auftrags:**
  - A25 bis A48
  - Teil B (Fallen) und Teil D (Sätze nach falscher Antwort)
  - Zeichen- und Wortzählung
  - die Regel „kein Satz aus Hinweis oder Frage“
  - die freiwillige Änderung in `app/world-photos.json` (Bildtext „um 1920“)
