# Personen-Rätsel: Nachprüfung der Neufassung (Fakten)

Helfer: fakten-pruefer (opus / high), 25.11.2026. Nur Befunde, ändert nichts.

Ich habe keine Dateien geändert. Grundlage waren `/home/user/wunderkompass/docs/entwurf/2026-11-25-personen-raetsel-entscheidungen.md` (Abschnitte 2 und 9), `/home/user/wunderkompass/docs/entwurf/2026-11-25-personen-raetsel-neufassung-alt.md`, mein Vorbericht `/home/user/wunderkompass/docs/entwurf/2026-11-25-personen-raetsel-faktenpruefung.md` und die Karten in `/home/user/wunderkompass/app/world-catalog.json`. Alle Zitate unten habe ich heute selbst abgerufen, wenn nicht anders vermerkt. Meine drei Änderungsvorschläge (Murasaki, Mandela, Franklin) und die zwei Kann-Fassungen (Berners-Lee, Cai Lun) habe ich mit einem kleinen Skript gegen die Regeln aus dem Test (Z. 67–70) geprüft. Es bildet die Testregeln nach, ist aber nicht der echte Test: keine Namensteile, keine Fürwörter, Satz 1 beginnt mit „Diese Person“ und hat höchstens 13 Wörter. Alle fünf Fassungen bestehen. Skript: `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/fp2-check.mjs`

**Ergebnis:** 0 Muss, 2 Soll, 4 Kann. Dazu ein neuer Quellenfund: Auch die Karte von Karl Benz hat den toten DPMA-Link.

## Muss
Keine. In beiden Fassungen ist keine Aussage falsch.

## Soll

**S1 Murasaki, Satz 2: „Die Geschichte entstand am Hof des Kaisers“**
- **Urteil:** stimmt mit Einschränkung, so ist es zu sicher gesagt. Ob die Geschichte am Hof entstand, ist nicht geklärt. Vermutlich begann die Arbeit vor dem Dienst am Hof.
- **Beleg EBSCO Research Starters:** https://www.ebsco.com/research-starters/literature-and-writing/murasaki-shikibu-writes-tale-genji – „Whether Murasaki Shikibu wrote the earliest parts of Genji monogatari (c. 1004 …) away from court and completed it after she began her court service is not clear.“
- **Beleg Kyoto National Museum (Quelle der Karte):** https://www.kyohaku.go.jp/eng/exhibitions/special/2026_genji/ – Die Seite sagt nur: „Set against the rarefied world of the imperial court“. Dazu: „The novel appears to have gained a wide readership while Murasaki was serving as lady-in-waiting to Empress Shōshi“.
- **Vorschlag (13 Wörter, besteht das Prüfskript):** „Die Geschichte spielt am Hof des Kaisers und wurde jahrhundertelang von Hand abgeschrieben.“ Diese Fassung trägt die Karten-Quelle allein, und die Profi-Falle zu Cai Lun bleibt erhalten.
- **Nebenbefund an der Karte (Kann):** Die `intro` sagt „schrieb am japanischen Kaiserhof“ und ist damit ebenso zu sicher. Die Fassung aus `paragraphs[0]` („arbeitete am japanischen Kaiserhof und schrieb im frühen 11. Jahrhundert …“) passt. Vorschlag für die `intro`: „… lebte am japanischen Kaiserhof und schrieb im frühen 11. Jahrhundert …“

**S2 Mandela, Satz 3: „1994 durften alle Erwachsenen wählen“**
- **Urteil:** stimmt, aber das Wichtigste fehlt: Es war das erste Mal. Ohne „zum ersten Mal“ erfährt ein Kind nicht, dass vorher nicht alle wählen durften. Laut Entwurf soll der Satz genau das zeigen.
- **Beleg Apartheid Museum:** https://www.apartheidmuseum.org/exhibitions/1994-election – „The first ever democratic elections in which all South Africans could vote were held on 27 April 1994.“ Dazu: „For Africans, this was their first chance to vote in a national election“.
- **Beleg „Erwachsene“:** Electoral Act 202 of 1993, § 15(1), https://www.gov.za/sites/default/files/gcis_document/201409/act202-93.pdf – „Any person of the age of 18 years or older who is a citizen of or permanently resident in the Republic … shall … be entitled to vote“. § 16(d) schloss einige verurteilte Gefangene aus. Diese Ausnahme ist für Kinder unerheblich, „alle Erwachsenen“ ist eine zulässige Vereinfachung.
- **Vorschlag:** „1994 durften zum ersten Mal alle Erwachsenen wählen, und diese Person wurde Oberhaupt des Landes.“
- **Zur Frage nach der Seite des Apartheid Museum:** Ja, sie taugt als Quelle. Es ist eine Museumsseite mit einer klaren Aussage, und die Mandela-Karte nennt schon eine andere Seite desselben Museums.

## Kann

- **K1 Franklin, Satz 1: „wie winzige Dinge ganz innen aufgebaut sind“.** Das ist nicht falsch. „Ganz innen“ mit „Röntgenstrahlen“ kann aber an das Durchleuchten beim Arzt erinnern. Genau das ist die Methode nicht: Die Karte sagt ausdrücklich „keine gewöhnlichen Nahfotos“.
  - Beleg KCL: https://www.kcl.ac.uk/people/rosalind-franklin – „most famous for her work in X-ray crystallography, taking images of DNA molecules“.
  - Vorschlag (11 Wörter, besteht das Prüfskript): „Diese Person fand mit Röntgenstrahlen heraus, wie winzige Teilchen aufgebaut sind.“ Ob das Wort „Teilchen“ für Kleine passt, entscheidet die kinder-redaktion.
- **K2 Berners-Lee, Satz 1: „das Web: Internetseiten“.** Das ist vertretbar und alltagsnah. Die Karte trennt aber Internet und Web. „Seiten im Internet“ zeigt klarer, dass das Web auf dem Internet läuft und nicht das Internet selbst ist.
  - Beleg W3C-FAQ (Quelle der Karte): https://www.w3.org/People/Berners-Lee/FAQ.html – „I was lucky enough to invent the Web at the time when the Internet already existed“.
  - Fassung (13 Wörter, besteht das Prüfskript): „Diese Person entwickelte das Web: Seiten im Internet, die durch Links verbunden sind.“
- **K3 Cai Lun, Satz 2: „kam das neue Papier an den Hof“.** „Neu“ kann wie „neu erfunden“ klingen. Die Karte sagt „verbesserte Form“.
  - Fassung: „Es heißt: Im Jahr 105 kam das bessere Papier an den Hof des Kaisers.“
  - „Es heißt“ gibt das „ist überliefert“ der Karte richtig wieder.
- **K4 Mandela, „kämpfte“.** Das ist fachlich gedeckt, auch der bewaffnete Teil des Widerstands.
  - Beleg Nelson Mandela Foundation: https://www.nelsonmandela.org/democracy – „There were four pillars to this struggle – armed resistance, underground work, international solidarity and mass mobilisation.“
  - Ob „kämpfte“ oder „setzte sich ein“: Das ist eine Frage des Tons, keine Fakten-Frage.

## Bestätigt, je Person

### Neufassung der fünf vorhandenen Rätsel

- **Darwin: trägt.** „Über lange Zeit“ ist als Vereinfachung in Ordnung und erzeugt keine Fehlvorstellung. „Arten“ statt „Lebewesen“ ist richtig gewählt.
  - NHM: https://www.nhm.ac.uk/discover/charles-darwin-most-famous-biologist.html – „Gradually these features may become more common in a population, so species change over time“.
  - „Vorher … sammelte“: „On his travels Darwin collected plants, animals and fossils“, danach „spent many years comparing and analysing specimens before finally declaring that evolution occurs by a process of natural selection“.
  - Genauer wäre „über viele Generationen“ (Wort der Karte). Das ist nicht nötig.
- **Murasaki: trägt mit Änderung (S1).** Satz 1 stimmt.
  - Kyoto: „Written by the court lady Murasaki Shikibu over a thousand years ago“.
  - Abschreiben: „passed down … through the devoted efforts of countless scribes over the centuries“.
- **Mandela: trägt mit Änderung (S2).** „Hautfarbe“ trägt als kindgerechte Vereinfachung.
  - bpb, Das junge Politik-Lexikon: https://www.bpb.de/kurz-knapp/lexika/das-junge-politik-lexikon/319831/apartheid/ – „in acht verschiedene Gruppen oder ‚Rassen‘, je nach ihrer Hautfarbe, eingeteilt“ und „1994 … erstmals alle Südafrikaner, unabhängig von ihrer Hautfarbe“.
  - Fachlich genauer: The National Archives: https://www.nationalarchives.gov.uk/education/teaching-resources/apartheid-in-south-africa/ – „defined people exclusively in terms of appearance and perception“. Die Einteilung beruhte also auf dem Aussehen, nicht nur auf der Haut. Für Kinder reicht das Wort „Hautfarbe“.
  - „Oberhaupt“: Mandela wurde Präsident (Karte, NMF-Biografie).
- **Jemison: trägt.** NASA: https://www.nasa.gov/former-astronaut-mae-c-jemison/
  - Studium: „earned a BS in chemical engineering … completed her doctorate degree in medicine in 1981“. „Technik“ für Ingenieurwesen ist eine zulässige Vereinfachung; NASA schreibt „background in both engineering and medical research“.
  - Arbeit als Ärztin: „worked as a General Practitioner in Los Angeles … before becoming a Peace Corps Medical Officer“. Das NASA-PDF https://www.nasa.gov/wp-content/uploads/2019/09/jemison_mae.pdf nennt dazu „provision of medical care“. Damit trägt „behandelte kranke Menschen“.
  - „Forschte dort“: „Jemison carried out experiments on the effects of space motion sickness, frog fertilization in space, and bone loss“.
- **Karl Benz: trägt.** Deutsches Museum: https://www.deutsches-museum.de/museum/presse/meldung/eine-ikone-der-automobilgeschichte-wird-140 – „Er gilt als erstes wirklich funktionsfähiges Automobil mit Verbrennungsmotor“. Das Museum nennt ihn auch „das Auto“. „Ein sehr frühes Auto“ ist damit gedeckt und vorsichtiger als nötig, passend zur Karte.
- **Entdecker-Tipp:** enthält keine Sachaussage, nichts zu prüfen.

### Offene Fragen aus Abschnitt 9

- **Lovelace: trägt.** 1843 liegt heute 183 Jahre zurück, „etwa 180“ stimmt also. „Geplant“ ist richtig.
  - CHM: https://www.computerhistory.org/babbage/engines/ – „none of Babbage's designs was physically realized in its entirety in his lifetime“.
- **Hopper: trägt.**
  - CHM: https://computerhistory.org/profile/grace-murray-hopper/ – „developed one of the world's first compilers and compiler-based programming languages“.
  - „Wörter“: Karte („FLOW-MATIC, das Wörter für Anweisungen nutzte“) und der Yale-Beleg aus dem Vorbericht („Flow-Matic used regular English words“; Yale heute nicht neu abgerufen).
- **Berners-Lee: trägt (K2 freiwillig).**
  - CERN: https://home.cern/science/computing/the-birth-of-the-web/short-history-web/ – „By the end of 1990, Tim Berners-Lee had the first Web server and browser up and running at CERN“.
  - W3C-FAQ: „I wrote in 1990 the first GUI browser“.
- **Ibn al-Haytham: trägt.**
  - MacTutor (Quelle der Karte): https://mathshistory.st-andrews.ac.uk/Biographies/Al-Haytham/ – „He gives the first correct explanation of vision, showing that light is reflected from an object into the eye.“
  - „Mit Versuchen“: UNESCO (Quelle der Karte): https://www.unesco.org/en/articles/ibn-al-haythams-scientific-method – „the experiment … serve to prove …“.
- **Wu: trägt.**
  - NIST: https://www.nist.gov/pml/fall-parity/reversal-parity-law-nuclear-physics – „two physical systems, one of which is a mirror image of the other, must behave in identical fashion“ sowie „parity is not conserved in the emission of beta particles by cobalt-60“. Laborbuch „December 27, 1956“, also „Ende 1956“.
  - Oxford Museum: https://oumnh.ox.ac.uk/learn-chien-shiung-wu – „objects and their mirror images behave the same way, just reversed“.
- **Franklin: trägt (K1 freiwillig).** Satz 2 wie im Vorbericht.
- **Bell Burnell: trägt.** Cambridge: https://www.cam.ac.uk/stories/journeysofdiscovery-pulsars
  - Antennenfeld: „a lot of wires and cables strung from posts over a space the size of 57 tennis courts“.
  - Papierstreifen: „rolls of chart recordings“.
  - Zufall: „My project was to study quasars, and then we accidentally stumble over these things called pulsars. They were totally unexpected“.
- **Meitner: trägt.** MPI für Chemie: https://www.mpic.de/3549655/die-entdeckung-der-kernspaltung – „dass er sich in zwei annähernd gleich große Fragmente teilte“.
- **Cai Lun: trägt (K3 freiwillig).** „Es heißt“ entspricht dem „überliefert“ der Karte (Barrett, siehe „Nicht geprüft“).
  - Die Berkshire-Seite der Karte (nur über WebFetch gelesen) sagt sowohl „improving and refining“ als auch „invented the technique of paper-making in 105“. Für die vorsichtige Fassung ist sie schwächer als Barrett.
- **Merian „jüngsten Tochter“:** bestätigt im Vorbericht (Rijksmuseum), nicht wiederholt.
- **Maathai ohne „dafür“: trägt.**
  - NobelPrize.org: https://www.nobelprize.org/prizes/peace/2004/maathai/facts/ – „for her contribution to sustainable development, democracy and peace“.
  - „The campaign encouraged women to plant trees“.
- **Bertha Benz „beiden Söhnen“: jetzt auch außerhalb der Karte belegt** (im Vorbericht noch offen).
  - Deutsches Museum, gleiche Seite: „1888 brach sie mit ihren Söhnen zu einer ersten ‚Fernfahrt‘ von Mannheim nach Pforzheim auf … Die Drei hatten große Mühen“.

## Quellenlage

- **Neuer Fund:** Der DPMA-Link `https://www.dpma.de/dpma/veroeffentlichungen/patentefrauen/berthabenz/index.html` liefert heute 404. Er steht nicht nur auf `person-bertha_benz`, sondern auch auf `person-karl_benz`. Entscheidungsliste Punkt 6 nennt nur Bertha; die Karte von Karl Benz gehört dazu. Das Deutsche Museum trägt beide Karten.
- Die übrigen Quellen der fünf Karten sind gut: NHM, Kyoto National Museum, Nelson Mandela Foundation, NASA, Deutsches Museum.

## Quellen, die neu auf Karten gehören

| Karte | URL | wofür |
|---|---|---|
| `person-nelson_mandela` | https://www.apartheidmuseum.org/exhibitions/1994-election | 1994 erste Wahl, bei der alle wählen durften |
| `person-nelson_mandela` | https://www.bpb.de/kurz-knapp/lexika/das-junge-politik-lexikon/319831/apartheid/ | „Hautfarbe“ und „erstmals alle … unabhängig von ihrer Hautfarbe“ (deutsch, für Kinder geschrieben) |
| `person-jocelyn_bell_burnell` | https://www.cam.ac.uk/stories/journeysofdiscovery-pulsars | Antennenfeld, Papierstreifen, Zufall (steht schon in Punkt 6, hier bestätigt) |

Nicht nötig: Für Murasaki mit „spielt“ reicht die Kyoto-Quelle, die schon auf der Karte steht. Wird stattdessen „entstand“ behalten, gibt es keine Quelle, die das trägt.

## Nicht geprüft

- **Britannica zu Murasaki:** 403. Die Angabe, dass sie vor dem Dienst am Hof zu schreiben begann, stammt darum aus EBSCO und einer Suchübersicht.
- **Oxford-Seite zu Cai Lun** (`www.cabinet.ox.ac.uk`): in dieser Sitzung nicht erreichbar, die Domain müsste in den Netzwerk-Einstellungen freigegeben werden.
- **Barrett (Cambridge Journal) zu Cai Lun:** nicht abgerufen. „Es heißt“ stützt sich auf die Karte.
- **Yale-Seite (Hopper) und Rijksmuseum (Merian):** heute nicht neu abgerufen, die Belege stammen aus dem Vorbericht.
- **Carson, Satz 2 („Gift kann mit dem Futter weiterwandern“):** nicht neu gegen eine Fremdquelle geprüft. Die Karte sagt es so („Ein Stoff kann mit Nahrung weitergegeben werden“), Quelle dort ist Michigan DNR.
- **Sprache, Wortwahl für Kleine („Arten“, „Oberhaupt“, „Teilchen“) und Fallenwirkung:** Das ist Sache von kinder-redaktion und stufen-pruefer.
