# Personen-Rätsel: Fakten-Prüfung

Helfer: `fakten-pruefer` (opus/high), 25.11.2026. Prüft die 27 Rätsel gegen Karten und externe Quellen.

Ich habe keine Dateien geändert. Grundlage: die drei Entwürfe, die 27 Karten in `/home/user/wunderkompass/app/world-catalog.json` und externe Quellen. Was ich nicht selbst abrufen konnte, steht am Ende.

**Ergebnis:** 1 Muss, 2 Soll, mehrere Kann. Alle anderen Rätsel sind sachlich ok. Alle Gegenvorschläge habe ich mit einem kleinen Skript gegen die Regeln aus dem Test (Zeile 67 bis 70) laufen lassen: keine Namensteile, keine verbotenen Fürwörter, genau 2 Sätze. Das Skript bildet die Testregeln nach, es ist nicht der echte Test: `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/vorschlag.mjs`.

---

### Muss

**Bell Burnell, Satz 2:** „…half in Cambridge, das Radioteleskop **dafür** zu bauen…“
- **Urteil:** falsch verkürzt. Ein Kind lernt daraus, dass das Teleskop gebaut wurde, um diese Signale zu finden. In Wahrheit war der Fund ein Zufall, und genau das betont auch die Karte.
- **Beleg:** University of Cambridge, https://www.cam.ac.uk/stories/journeysofdiscovery-pulsars
  - zum Zweck: „was actually built to study radio emission from quasars“
  - zum Bau: „helped solder and sledgehammer the antennae into place“ über zwei Jahre, „a space the size of 57 tennis courts“
  - zu den Aufzeichnungen: „rolls of chart recordings“
- Antennen auf einem Feld, Papierstreifen und „aus dem Weltall“ (Pulsare) sind damit belegt. Falsch ist nur das „dafür“.
- **Vorschlag:** „Diese Person fand auf langen Papierstreifen sehr regelmäßige Signale aus dem Weltall. Vorher half diese Person in Cambridge, ein Radioteleskop zu bauen: viele Antennen auf einem großen Feld.“ (12/16 Wörter)

### Soll

**Payne-Gaposchkin, Satz 2:** „erklärte diese Person: Sterne bestehen vor allem aus Wasserstoff und Helium“
- **Urteil:** stimmt mit Einschränkung. Ihre Rechnung ergab das wirklich. In der Doktorarbeit selbst nannte sie den Wert aber auf Druck von Russell „almost certainly not real“. „Erklärte“ klingt nach einer selbstbewussten Aussage, die es so nicht gab.
- **Beleg:** Science History Institute, https://www.sciencehistory.org/education/scientific-biographies/cecilia-payne-gaposchkin/ (Russell „contradicted her“; Zusatz in der Arbeit: „The enormous abundance derived for [hydrogen and helium] … is almost certainly not real“; später bestätigt).
- **Vorschlag:** „…1925 berechnete diese Person in einer großen Forschungsarbeit: Sterne bestehen vor allem aus Wasserstoff und Helium.“ (12/16)
- **Nebenbefund:** Die Karteneinleitung sagt ebenfalls „erklärte“. Dort am besten gleich mitkorrigieren.

**Maathai, Satz 2:** „2004 bekam diese Person **dafür** den Friedensnobelpreis“
- **Urteil:** stimmt mit Einschränkung. Der Preis galt nicht nur dem Bäumepflanzen.
- **Beleg:** NobelPrize.org, https://www.nobelprize.org/prizes/peace/2004/maathai/facts/ (Begründung: „for her contribution to sustainable development, democracy and peace“; zum Pflanzen: „The campaign encouraged women to plant trees … contributed to the planting of over thirty million trees … she saw tree-planting in a broader perspective which included democracy, women's rights…“).
- **Vorschlag:** „2004 bekam diese Person **auch dafür** den Friedensnobelpreis, einen berühmten Preis für Frieden.“ Oder das „dafür“ einfach streichen.
- „Pflanzte mit vielen Menschen Bäume“ ist ok: Gemeinsames Pflanzen ist durch das Nobelzitat und die Karte gedeckt.

### Kann

- **Lovelace, Satz 1:** „…die damals noch nicht gebaut war“. „Noch nicht“ klingt, als wäre die Maschine später gebaut worden. Die Analytical Engine wurde nie fertig gebaut.
  - Beleg: Computer History Museum, https://www.computerhistory.org/babbage/engines/ („none of Babbage's designs was physically realized in its entirety in his lifetime“; beim Tod 1871 war nur „a small experimental piece“ im Bau). Dass es bis heute keine fertige Maschine gibt, weiß ich nur aus meinem Wissensstand.
  - Vorschlag: „…für eine Maschine, die nie fertig gebaut wurde.“ (12/13)
  - Musik ist ok: CHM zitiert „the Engine might compose elaborate and scientific pieces of music“, als Bedingung formuliert.
- **Humboldt, Satz 2:** „reiste diese Person **dafür**“. Die Reise hatte viele Ziele, nicht nur den Vergleich der Pflanzen nach Höhe. Vorschlag: das „dafür“ streichen.
- **Leavitt, Satz 2:** stimmt. Das Weglassen der Leuchtkraft ist eine zulässige Vereinfachung. Das „hilft“ ist vorsichtig genug und erzeugt keine Fehlvorstellung.
  - Schwäche: Der Satz sagt nicht, was die Person entdeckte (je heller, desto längere Periode). Beleg: Library of Congress, https://blogs.loc.gov/inside_adams/2019/12/henriettaleavitt/ („the brighter variables have the longer periods“; Fotoplatten: „looked at photographic plates of stars“).
  - Möglicher Ersatz, falls gewünscht (vor dem Einbau noch durch das Prüfskript): „Dabei merkte diese Person: Hellere blinkende Sterne haben einen langsameren Takt; das hilft, Entfernungen im Weltall zu messen.“
- **Wu, Satz 2:** „1956“ ist vertretbar. Die Versuche liefen Ende 1956, veröffentlicht wurde 1957 (Phys. Rev. 105, 1957).
  - Beleg: NIST, https://www.nist.gov/pml/fall-parity/reversal-parity-law-nuclear-physics (Laborbuch-Eintrag vom 27.12.1956; Ergebnis für „beta particles by cobalt-60“).
  - Vorschlag: „Ende 1956“.
  - „Betazerfall allgemein“ ist fachlich richtig, weil die Paritätsverletzung zur schwachen Wechselwirkung gehört. NIST sagt das aber nicht ausdrücklich, dort geht es nur um Cobalt-60.
- **Cai Lun, Satz 2:** Das Weglassen von „ist überliefert“ ist vertretbar. Das Rätsel behauptet nicht, dass Papier erfunden wurde, und „half, besseres Papier herzustellen“ ist genau richtig. Wer die Vorsicht kurz behalten will: „Im Jahr 105 soll diese Person dem Hof des Kaisers ein verbessertes Schreibpapier gezeigt haben.“ (15 Wörter)

---

### Ok (je kurz mit Beleg)

- **Goodall:** ok.
  - „Namen statt Nummern“: Jane Goodall Institute, https://janegoodall.org/jane-goodalls-story/ („giving the chimpanzees names instead of numbers“).
  - Termiten mit Zweigen: https://janegoodall.org/news/55-years-at-gombe-qa-with-jane-on-origins-of-life-work/ („not only used grass stems as tools, but sometimes picked leafy twigs“).
- **Bertha Benz:** ok. Deutsches Museum, https://www.deutsches-museum.de/museum/presse/meldung/eine-ikone-der-automobilgeschichte-wird-140 („1888 brach sie mit ihren Söhnen zu einer ersten ‚Fernfahrt‘ von Mannheim nach Pforzheim auf“). „Zwei Söhne“ habe ich nicht extern belegt; die Karte sagt „beiden Söhnen“.
- **Curie:** ok, „entdeckte im Team“ ist richtig. Geprüft habe ich nur gegen die Karte (1898 Polonium und Radium mit Pierre Curie, Bémont am Radium beteiligt; Nobelpreise 1903 und 1911). Die NobelPrize-Seite habe ich nicht abgerufen.
- **Carson:** ok. „Gift gegen Schädlinge“ ist sachlich, Carson selbst sprach von „barrage of poison“ und „biocides“. NPS, https://www.nps.gov/people/rachel-carson.htm („alerted the public to the dangers of using chemical pesticides carelessly“; erschienen 1962).
- **Lehmann:** ok. Belegt habe ich das nur über eine Websuche und die Karte: P-Wellen-Aufzeichnungen des Bebens in Neuseeland 1929 an mehreren Stationen, 1936 drei Schalen mit innerem Kern. Seiten von AMNH und APS waren gesperrt (403), siehe Quellenlage.
- **Tu Youyou:** ok, „das Team gewann“ ist belegt. Lasker Foundation, https://laskerfoundation.org/winners/artemisinin-therapy-for-malaria/ („Tu was appointed head of the Project 523 research group“; „On November 8, 1972, she and her colleagues obtained the pure substance“).
- **Merian:** ok. „Schmetterlinge“ ist korrekt, denn im Deutschen gehören auch Nachtfalter dazu. Rijksmuseum, https://www.rijksmuseum.nl/en/stories/10-things/story/maria-sibylla-merian-en („studied the metamorphosis of caterpillars into butterflies“; „In 1699, Merian and her youngest daughter Dorothea Maria Graff travelled to Suriname“).
- **Gutenberg:** ok. „Druckte“ als kindgerechte Verkürzung der Werkstattarbeit ist vertretbar, denn das Rätsel sagt nicht „erfand das Drucken“. Geprüft nur gegen die Karte, gutenberg.de habe ich nicht abgerufen.
- **Hokusai:** ok, die Leideform „wurde gedruckt“ passt. Nur gegen die Karte geprüft.
- **Hopper:** ok. Yale, https://news.yale.edu/2017/02/10/grace-murray-hopper-1906-1992-legacy-innovation-and-service („her programming team developed the first computer language ‚compiler‘ called A-0“; „Flow-Matic used regular English words“). Kleine Unschärfe: A-0 übersetzte mathematischen Code, erst FLOW-MATIC arbeitete mit Wörtern. Satz 2 bleibt trotzdem richtig.
- **Katherine Johnson:** ok, „Computer-Rechnungen“ ist richtig. NASA, https://www.nasa.gov/centers-and-facilities/langley/katherine-johnson-biography/ (Glenn bat, „get the girl“ solle „the computer's numbers by hand“ prüfen).
- **Berners-Lee:** ok. CERN, https://home.cern/science/computing/the-birth-of-the-web/short-history-web/ („By the end of 1990, Tim Berners-Lee had the first Web server and browser up and running at CERN“). Achtung: Die Adresse im Entwurf (`/birth-web/short-history-web`) liefert 404. Die Adresse auf der Karte funktioniert.
- **Anning:** ok, Meeresreptil ist belegt. NHM, https://www.nhm.ac.uk/discover/mary-anning-unsung-hero.html (Joseph fand 1811 den Schädel, Mary legte 1812 das Skelett frei; „recognised as being an extinct marine reptile“).
- **Ibn al-Haytham:** ok mit kleiner Einschränkung. MacTutor, https://mathshistory.st-andrews.ac.uk/Biographies/Al-Haytham/: in Kairo bis zum Tod al-Hakims 1021 unter Hausarrest, „During this time he undertook scientific work“, danach Leben und Schreiben „near the Azhar Mosque in Cairo“. Dass er die Lichtforschung genau in Kairo machte, belegt MacTutor nicht wörtlich. Das ist aber die übliche Darstellung, das Rätsel kann so bleiben.
- **Franklin:** ok. KCL, https://www.kcl.ac.uk/the-story-behind-photograph-51 („taken by Rosalind Franklin, together with her PhD student Raymond Gosling … in May 1952“). „Bauplan in Zellen“ ist die gängige Schulvereinfachung und vertretbar. „Erbanleitung“ wäre etwas genauer, das ist eine Frage für die kinder-redaktion.
- **Meitner:** ok. MPI für Chemie, https://www.mpic.de/3549655/die-entdeckung-der-kernspaltung („Die kernphysikalische Erklärung lieferten Lise Meitner und ihr Neffe Otto Frisch Anfang Januar 1939. Meitner war … im Sommer 1938 emigriert“). „Kurz nachdem“ bei rund einem halben Jahr Abstand ist vertretbar.
- **Hadid:** ok. Design Museum, https://designmuseum.org/designers/zaha-hadid („1993 Vitra Fire Station completed, Weil am Rhein“); Pritzker, https://www.pritzkerprize.com/laureates/2004. Nebenbei: Die Feuerwehr zog später aus, heute zeigt das Haus Stühle. Am Rätsel ändert das nichts.
- **Ibn Sina:** ok, „rund 1000 Jahre“ stimmt. Winchester College, https://winchestercollections.co.uk/collection/canon-of-medicine/ („in the first quarter of the 11th century“; lateinische Übersetzung durch Gerard von Cremona; Lehrbuch „until the late 17th century“).
- **Octavia Butler:** ok, nur gegen die Karte geprüft (kein Abruf). Kleinigkeit: „Kindred“ spielt in der Vergangenheit, „erfundene Welten und die Zukunft“ trifft trotzdem den Kern.

---

### Quellenlage

- **Falsche Quellen auf Karten** (unabhängig von den Rätseln, sollten weg):
  - `person-jane_goodall`: In `sources` steht „Computer History Museum: Ada Lovelace“.
  - `person-marie_curie`: In `sources` stehen computerhistory.org/babbage/adalovelace und die Yale-Seite zu Grace Hopper.
- **Tote Links auf Karten** (selbst abgerufen):
  - `person-bertha_benz`: Die DPMA-Seite liefert 404, auch über WebFetch. Die zweite Quelle (Deutsches Museum) trägt die Fahrt.
  - `person-inge_lehmann`: `https://nbi.ku.dk/english/www/inge/lehmann/` liefert 404. Die Websuche fand als möglichen Ersatz `https://nbi.ku.dk/english/www/inge/lehmann/jordens-kerne/`, abgerufen habe ich ihn nicht.
- **Dünne Belege für Rätsel-Aussagen:**
  - `person-henrietta_swan_leavitt` hat nur eine Quelle (LoC-Blog).
  - `person-jocelyn_bell_burnell` hat keine Quelle für Antennen, Feld und Bau. Die Cambridge-Seite oben sollte auf die Karte, wenn das Rätsel davon spricht.
- Die übrigen Kartenquellen sind gut (Museen, Institute, Nobel, NIST, NASA, NHM).

### Nicht geprüft

- **Gesperrt oder nicht lesbar:**
  - Britannica (Cloudflare-Sperre)
  - AMNH und APS zu Lehmann (403)
  - Green-Belt-Seiten (Inhalt wird per Skript geladen, Unterseite 404); für Maathai habe ich stattdessen NobelPrize.org genommen
  - Berkshire China Encyclopedia zu Cai Lun (Abruf fehlgeschlagen)
  - Seite der Universität Heidelberg zu Merian
  - Science-Museum-Blog zu Lovelace (abgerufen, aber die Stelle zum Bau stand nicht im Text)
- **Ohne eigenen Abruf, nur gegen die Karte geprüft:** Hokusai, Gutenberg, Butler, Humboldt, Curie (Nobel-Jahre), die Sohn-Zahl bei Bertha Benz.
- **Nicht meine Aufgabe, nicht beurteilt:** Sprache, Satzlänge, Stufen-Eignung und Verwechslungsgefahr (das prüfen kinder-redaktion und stufen-pruefer).
