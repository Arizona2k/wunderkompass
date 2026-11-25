# Entwurf: kurze Auflösungen und Tipps in Kinderton für die Welt-Spiele

Helfer: karten-autor (opus/high), 25.11.2026. Ungeprüfter Entwurf; Prüfung durch fakten-pruefer, kinder-redaktion, stufen-pruefer folgt.

Ich habe nur gelesen und nichts geändert. Gelesen habe ich `app/world-game-support.mjs`, `app/world-game-bank.ts` (Z. 50), `app/world-games.tsx` (Z. 62), `tests/world-game-learning-copy.test.mjs`, alle 36 Personenkarten in `app/world-catalog.json`, die Endfassung der Personen-Rätsel sowie die Design-Prüfung und den Spieltest vom 25.11.

Nichts davon ist geprüft. Lesen müssen es noch der `fakten-pruefer`, die `kinder-redaktion` und der `stufen-pruefer`.

---

## Paket A: 36 Auflösungen nach „Richtig!“ (gelten auf allen Stufen)

Vorschlag zum Einbau: ein neues Objekt `AUFLOESUNG` in `app/world-game-support.mjs` mit denselben Schlüsseln wie `EIGENE_RAETSEL`. In `world-game-bank.ts` Z. 50 steht dann `AUFLOESUNG[t.id] ?? t.paragraphs.join(' ')` statt `t.paragraphs.join(' ')`.

**Gezählt mit `node`:**
- Länge: 110 bis 176 Zeichen, Median 152.
- Je Text 2 bis 3 Sätze, höchstens 13 Wörter pro Satz.
- Höchstens eine Zahl je Text. Zahlen stehen nur bei Tu Youyou, Mandela, Karl Benz, Armstrong und Tagore.
- Kein Text beginnt mit „Richtig“.
- Kein Satz wiederholt einen Rätselsatz wörtlich.
- Zwei Sätze (Goodall Satz 3, Meitner) habe ich nach dem letzten Zählen noch umgestellt. Sie sind geschätzt und bleiben unter 180 Zeichen und unter 13 Wörtern.

```json
{
 "person-jane_goodall": "Jane Goodall erforschte wilde Schimpansen in Afrika, im heutigen Tansania. Am Anfang liefen die Tiere vor ihr weg. Erst nach Monaten gewöhnten sich die Schimpansen an sie.",
 "person-wangari_maathai": "Wangari Maathai setzte sich in Kenia für Bäume und eine gesunde Umwelt ein. Die Bäumchen wurden auch gepflegt. Später zählte man, wie viele noch wuchsen.",
 "person-ada_lovelace": "Ada Lovelace war Mathematikerin in England. Ihre Rechenschritte gelten als eines der ersten Computerprogramme. Die Maschine dazu wurde aber nie fertig gebaut.",
 "person-bertha_benz": "Bertha Benz zeigte mit ihrer Fahrt: Der Motorwagen schafft auch weite Strecken. Sie gab auch Geld für die Arbeit ihres Mannes Karl Benz.",
 "person-cai_lun": "Cai Lun arbeitete am Hof des Kaisers von China. Papier gab es schon vor ihm. Es besteht aus winzigen Pflanzenfasern, die sich zu einem Blatt verbinden.",
 "person-marie_curie": "Marie Curie stammte aus Polen und forschte in Paris. Einer der neuen Grundstoffe ist nach ihrer Heimat benannt: Polonium kommt von Polen.",
 "person-rachel_carson": "Rachel Carson erforschte das Leben im Meer und schrieb Bücher, die alle verstehen. Ihr Buch über Gift heißt auf Deutsch „Der stumme Frühling“.",
 "person-inge_lehmann": "Inge Lehmann erforschte Erdbebenwellen und das Innere der Erde. Heute wissen wir: Der äußere Erdkern ist flüssig, der innere ist fest.",
 "person-tu_youyou": "Tu Youyou suchte in China nach neuen Medikamenten. Ein Hinweis in alten Büchern über Heilkunde half dem Team weiter. 2015 bekam sie für diese Arbeit den Nobelpreis.",
 "person-maria_sibylla_merian": "Maria Sibylla Merian war Künstlerin und Naturforscherin. Auf ihren Bildern sieht man auch die Pflanzen, an denen die Raupen leben.",
 "person-johannes_gutenberg": "Johannes Gutenberg war Handwerker und Erfinder in Mainz. Seine Werkstatt druckte eine berühmte Bibel. In Korea druckte man aber schon früher mit Metall-Buchstaben.",
 "person-katsushika_hokusai": "Katsushika Hokusai war ein Künstler aus Japan. Er zeichnete die Bilder vor. Andere Menschen schnitten sie in Holz und druckten sie.",
 "person-alexander_humboldt": "Alexander von Humboldt war ein Naturforscher, der weit reiste. Auf der Reise war der Pflanzenforscher Aimé Bonpland dabei. Auch Menschen vor Ort halfen.",
 "person-grace_hopper": "Grace Hopper war Mathematikerin in den USA. Sie wollte Programme, die Menschen leichter lesen können. Ihre Arbeit half später auch bei COBOL, einer Sprache für Computer.",
 "person-katherine_johnson": "Katherine Johnson war Mathematikerin bei der Raumfahrt in den USA. Ergebnisse vom Computer rechnete sie mit einer Tisch-Rechenmaschine nach. So konnten Fehler auffallen.",
 "person-tim_berners_lee": "Tim Berners-Lee ist ein Computer-Fachmann aus England. Er arbeitete am Forschungszentrum CERN in der Schweiz. Später durfte jeder die Web-Programme kostenlos nutzen.",
 "person-mary_anning": "Mary Anning sammelte Fossilien und legte sie sorgfältig frei. Ihr Bruder Joseph fand den Schädel eines Meerestiers aus uralter Zeit. Mary fand später weitere Teile davon.",
 "person-ibn_al_haytham": "Ibn al-Haytham war ein Forscher, der auch in Kairo arbeitete. Früher dachten viele: Die Augen schicken Strahlen zu den Dingen. Das stimmt aber nicht.",
 "person-henrietta_swan_leavitt": "Henrietta Swan Leavitt erforschte Sterne an einer Sternwarte in den USA. Ihr Fund: Je länger der Takt, desto mehr Licht gibt der Stern ab.",
 "person-cecilia_payne_gaposchkin": "Cecilia Payne-Gaposchkin war Sternforscherin. Sie untersuchte Sternenlicht, das wie ein Regenbogen in Farben zerlegt war. Ihr Ergebnis überraschte damals viele.",
 "person-rosalind_franklin": "Rosalind Franklin war Forscherin in London. Ihr Röntgenbild gab einen wichtigen Hinweis: Die DNA ist gedreht wie eine Wendeltreppe.",
 "person-jocelyn_bell_burnell": "Jocelyn Bell Burnell war damals eine junge Forscherin in England. Später zeigte sich: Die Signale kommen von Resten großer Sterne. Diese Reste drehen sich sehr schnell.",
 "person-octavia_butler": "Octavia E. Butler war Schriftstellerin in den USA. Ihre Notizen und ersten Fassungen liegen heute in einer Bibliothek. Darin sieht man: Sie überarbeitete ihre Texte.",
 "person-chien_shiung_wu": "Chien-Shiung Wu wurde in China geboren und forschte später in den USA. Der Versuch zeigte: Eine Naturregel, an die viele glaubten, gilt nicht immer.",
 "person-lise_meitner": "Lise Meitner forschte viele Jahre in Berlin über Atome. Mit ihrem Neffen Otto Frisch erkannte sie: Zerbricht ein Atomkern, kann Energie frei werden.",
 "person-zaha_hadid": "Zaha Hadid war Architektin: Sie entwarf Häuser und andere Bauten. Ihre Ideen entwickelte sie auch mit Zeichnungen und gemalten Bildern.",
 "person-ibn_sina": "Ibn Sina kannte sich mit Medizin und vielen anderen Wissensgebieten aus. In Europa nannte man ihn Avicenna. Sein Buch wurde dort übersetzt und lange abgeschrieben.",
 "person-charles_darwin": "Charles Darwin war Naturforscher. Arten verändern sich über viele Generationen, von Eltern zu Kindern und Enkeln. Ein einzelnes Tier verwandelt sich nicht.",
 "person-murasaki_shikibu": "Murasaki Shikibu war Schriftstellerin am Kaiserhof in Japan. Ihr selbst geschriebenes Buch gibt es nicht mehr. Erhalten sind Abschriften: Andere schrieben den Text von Hand ab.",
 "person-nelson_mandela": "Nelson Mandela war Anwalt und kämpfte gegen die Apartheid. Er wurde verhaftet und war viele Jahre im Gefängnis. 1990 kam er frei.",
 "person-mae_jemison": "Mae Jemison war Ärztin und Astronautin in den USA. Sie war die erste Schwarze Frau im Weltall. Dort half sie bei Versuchen mit Knochenzellen.",
 "person-karl_benz": "Karl Benz, auch Carl geschrieben, war Ingenieur, ein Fachmann für Technik. 1886 bekam er ein Patent, einen Schutz für seine Erfindung. Bertha Benz half ihm.",
 "person-albert_einstein": "Albert Einstein war Physiker und wurde in Ulm geboren. Er beschrieb Licht als winzige Päckchen voller Energie.",
 "person-al_khwarizmi": "Al-Chwarizmi war Mathematiker und Sternforscher in Bagdad. Von seinem Namen kommt das Wort „Algorithmus“: eine Anleitung in festen Schritten.",
 "person-neil_armstrong": "Neil Armstrong war Testpilot und Astronaut. 1969 betrat er als erster Mensch den Mond. Michael Collins blieb im Raumschiff und kreiste um den Mond.",
 "person-rabindranath_tagore": "Rabindranath Tagore war ein Dichter aus Indien. Er bekam 1913 den Nobelpreis für Literatur. Manche Bilder entstanden aus durchgestrichenen Wörtern in seinen Texten."
}
```

### Neues und Quelle je Person

„Neu“ heißt hier: Das steht nicht im Rätsel. Mit ⚠ markiert ist, was nicht wörtlich auf der Karte steht; das soll der `fakten-pruefer` besonders ansehen.

| ID | Zeichen | Neu gegenüber dem Rätsel | Quelle |
|---|---|---|---|
| jane_goodall | ca. 170 | Tansania; Tiere liefen erst weg, Geduld | `paragraphs` (Gombe, Tansania), `chapters[1]` |
| wangari_maathai | 153 | Pflege und spätere Zählung der Bäume | `paragraphs` (Pflege, „die noch lebenden Bäume zu zählen“), greenbeltmovement.org/gbm-ten-10-step-procedure |
| ada_lovelace | 158 | England; frühes Programm; Maschine nie fertig | `facts`, `paragraphs`; ⚠ „eines der ersten Computerprogramme“ und „nie fertig gebaut“: Karte sagt nur „wichtige frühe Arbeit zur Programmierung“ und „kein Beleg … vollständig gebaut“; computerhistory.org/babbage/adalovelace, blog.sciencemuseum.org.uk/ada-lovelace-visionary-of-the-computer-age |
| bertha_benz | 136 | Gab Geld; Karl Benz war ihr Mann | `intro` („finanzierte“), Karte Karl Benz `paragraphs`; ⚠ „ihr Mann“ steht auf keiner der beiden Karten wörtlich: deutsches-museum.de (Meldung „Eine Ikone … wird 140“) |
| cai_lun | 151 | Hofbeamter; Papier gab es schon vorher; Pflanzenfasern | `paragraphs` (Beamter, archäologische Funde, Fasern verbinden sich) |
| marie_curie | 137 | Polen und Paris; Name Polonium | `facts` (Warschau), `chapters[0]`, `surprise` |
| rachel_carson | 142 | Meeresforscherin; deutscher Buchtitel | `paragraphs`, `facts` |
| inge_lehmann | 134 | Außenkern flüssig, Innenkern fest | `paragraphs` (letzte Sätze) |
| tu_youyou | 164 | Medikamente; Hinweis aus alten Büchern; Nobelpreis 2015 | `paragraphs`; ⚠ Sie bekam die Hälfte des Preises; „den Nobelpreis“ ist vereinfacht |
| maria_sibylla_merian | 130 | Künstlerin; Pflanzen der Raupen | `intro`, `paragraphs`; ⚠ „Künstlerin und Naturforscherin“: rijksmuseum.nl (Story Merian), oumnh.ox.ac.uk/learn-maria-sibylla-merian |
| johannes_gutenberg | 163 | Bibel; Korea war früher | `facts`, `paragraphs` (Gutenberg-Bibel, UNESCO Jikji 1377) |
| katsushika_hokusai | 131 | Japan; andere schnitten und druckten | `paragraphs`; ⚠ „aus Japan“ steht nicht auf der Karte: getty.edu/cona (subid 700000091) |
| alexander_humboldt | 152 | Bonpland; Hilfe vor Ort | `paragraphs` |
| grace_hopper | 169 | Ziel lesbare Programme; COBOL | `paragraphs`, `facts` |
| katherine_johnson | 169 | Gegenprüfung mit Tisch-Rechenmaschine; warum | `paragraphs` („Tischrechenmaschine … So konnten Rechen- oder Übertragungsfehler auffallen“) |
| tim_berners_lee | 165 | England; CERN Schweiz; Programme kostenlos | `facts`, `paragraphs` (freie Websoftware 1993) |
| mary_anning | 170 | Bruder Joseph fand den Schädel | `paragraphs` |
| ibn_al_haytham | 149 | Kairo; alte Sehstrahl-Vorstellung widerlegt | `paragraphs`; ⚠ „Früher dachten viele“: mathshistory.st-andrews.ac.uk/Biographies/Al-Haytham (Sehstrahl-Lehre nach Euklid und Ptolemäus) |
| henrietta_swan_leavitt | 138 | Sternwarte USA; längerer Takt heißt mehr Licht | `paragraphs` (Harvard, „Zusammenhang“); ⚠ Richtung des Zusammenhangs steht nicht auf der Karte: blogs.loc.gov/inside_adams/2019/12/henriettaleavitt, womenshistory.org (Biografie Leavitt) |
| cecilia_payne_gaposchkin | 160 | Licht in Farben zerlegt; Ergebnis überraschte | `paragraphs` (Spektrum, „widersprach verbreiteten Erwartungen“); Regenbogen-Vergleich: openstax.org/books/astronomy-2e/pages/5-5-formation-of-spectral-lines |
| rosalind_franklin | 131 | London; gedreht wie Wendeltreppe | `paragraphs` (King’s College London, „schraubenförmige Struktur“) |
| jocelyn_bell_burnell | 168 | Junge Forscherin; Signale von Sternresten | `paragraphs` (Doktorandin Cambridge, Neutronensterne); ⚠ „Reste großer Sterne“: starchild.gsfc.nasa.gov (Bell), csiro.au (Pulsar 2017) |
| octavia_butler | 165 | Archiv mit Entwürfen; Überarbeiten | `paragraphs`, `facts`, researchguides.huntington.org/oeb |
| chien_shiung_wu | 148 | China und USA; eine Regel gilt nicht immer | `paragraphs` („zuvor angenommene Spiegelsymmetrie“) |
| lise_meitner | ca. 150 | Berlin; Frisch ist der Neffe; Energie wird frei | `paragraphs` |
| zaha_hadid | 135 | Architektin; Ideen mit Bildern entwickelt | `paragraphs` („Zeichnung und Malerei“) |
| ibn_sina | 163 | Avicenna; in Europa übersetzt und abgeschrieben | `paragraphs`, `intro` |
| charles_darwin | 155 | Wandel über Generationen, nicht im einzelnen Tier | `intro`, `paragraphs`; australian.museum (What is natural selection) |
| murasaki_shikibu | 176 | Original verloren; nur Abschriften | `paragraphs` |
| nelson_mandela | 129 | Anwalt; Gefängnis; 1990 frei | `paragraphs`, `facts` |
| mae_jemison | 141 | Ärztin; erste Schwarze Frau im All; Knochenzellen | `paragraphs`, `facts` |
| karl_benz | 156 | Ingenieur; Patent 1886; Bertha half | `facts`, `paragraphs`; ⚠ Erklärung „Patent = Schutz für eine Erfindung“ ist Allgemeinwissen, die Karte hat dafür keine Quelle |
| albert_einstein | 110 | Ulm; Licht als Energie-Päckchen | `paragraphs` (Ulm, Energiequanten) |
| al_khwarizmi | 141 | Sternforscher; Wort „Algorithmus“ | `facts`, `paragraphs` |
| neil_armstrong | 147 | Testpilot; erster Mensch auf dem Mond; Collins | `intro`, `paragraphs`; ⚠ „als erster Mensch“ steht nicht auf der Karte: nasa.gov/people/neil-a-armstrong |
| rabindranath_tagore | 164 | Indien; Nobelpreis 1913; Bilder aus Streichungen | `facts`, `paragraphs`; ⚠ „aus Indien“ (Karte: „bengalisch“) und „durchgestrichene Wörter“ (Karte: „Spuren beim Überarbeiten von Texten“): vam.ac.uk/articles/rabindranath-tagore-poet-and-painter, ngmaindia.gov.in |

---

## Paket B: Tipps in Kinderton

Sie ersetzen die Einträge in `hints` (`app/world-game-support.mjs`, Z. 66 ff.). Auf Entdecker bleibt bei `people` alles wie heute.

| Spiel | Neuer Tipp | Zeichen | Gilt für |
|---|---|---|---|
| `people` | Einige Menschen hier forschten an ähnlichen Dingen. Such im Hinweis nach etwas Besonderem: einem Ort, einem Jahr oder einem Werkzeug. | 133 | Profi, Experte |
| `habitats` | Schau dir das Tier genau an: Hat es Flossen, Beine oder Flügel? Lebt es eher an Land, am Wasser oder im Wasser? | 111 | alle Stufen |
| `food` | Überlege: Wo und wie sucht dieses Tier sein Futter? Lies jede Antwort ganz bis zum Ende. | 88 | alle Stufen |
| `technology` | Worum geht es im Text? Überlege bei jeder Erfindung: Wobei hilft sie den Menschen? | 82 | alle Stufen |
| `then-now` | Denk an Geräte, die du von zu Hause oder von unterwegs kennst. Klingt die Beschreibung nach heute oder nach früher? | 115 | alle Stufen, nur Aufgaben ohne eigene `comparisonQuestion` (heute gilt das für alle außer der Kompass-Aufgabe) |

**Warum diese Fassungen:**
- **habitats und food:** Der Tipp wiederholt die bestehenden Rückfragen „Wo findet dieses Tier Futter und Schutz?“ und „Frisst dieses Tier Pflanzen, andere Tiere oder beides?“ (Rückmeldung bei gezogenen Fallen) bewusst nicht.
- **habitats:** Er nutzt das Tierfoto, das im Spiel zu sehen ist.
- **food:** „Bis zum Ende lesen“ ersetzt den alten Satz über Entwicklungsstadien („Raupen: Seidenpflanzen; Falter: Nektar“, „Als erwachsenes Tier vor allem Pflanzen“), ohne das Wort selbst zu brauchen.
- **technology:** Er passt zu allen drei Frageformen („Beschreibung“, „Forscherfrage“, „Problem“). Darum fragt er nicht nur nach dem Problem.
- **then-now:** Er verweist absichtlich nicht auf die Zeitform der Verben. Die „Früher“-Texte stehen in der Vergangenheit, die „Heute“-Texte in der Gegenwart. Ein Hinweis auf „wurde“ oder „gibt es“ wäre ein Ratemuster.

### Rückmeldung nach falscher Antwort

**people, Profi und Experte.** Heute greift der Rückfall am Ende von `worldGameWrongFeedback`. Neu wäre das (84 Zeichen ohne Namen):
> `'Du hast „'+answer+'“ gewählt. Passt jeder Satz im Hinweis zu diesem Menschen? Schau dir auch die anderen Namen an.'`

- Er folgt dem Muster und dem Wort „Mensch“ von Entdecker. Darüber hinaus lenkt er auf die Einzelheiten in Satz 2 und 3, die auf Profi die Fallen aus demselben Gebiet ausschließen.
- Er behauptet nicht „passt zum Gebiet“, denn die dritte Falle ist die zeitlich nächste Person und nicht immer fachnah.

**then-now, freiwillig.** Ein eigener Satz, wenn `answer === DRITTE_ANTWORT` („Erst in der Zukunft“):
> „Du hast „Erst in der Zukunft“ gewählt. Das hier gab es schon wirklich. War es früher, oder ist es heute so?“

- Er stimmt für jede Aufgabe, weil diese Antwort laut `world-game-bank.ts` immer falsch ist.
- Für die anderen falschen Antworten (Früher und Heute vertauscht) bleibt der Rückfall „Du hast „X“ gewählt. “ + Tipp.

**Ohne eigene Rückmeldung.** Alle anderen Rückfälle (technology, habitats und food ohne gefundenes Tier) lauten nach der Änderung „Du hast „X“ gewählt. “ + neuer Tipp. Das liest sich mit allen fünf Tipps natürlich.

---

## Umformuliert

Keine. `why`, Tipps und Rückmeldungen werden nicht im Pass gespeichert. Antworttexte, IDs und Hauptfragen bleiben unverändert.

## Zahlen

- Paket A: 36 Texte, eine Fassung für alle Stufen. Keine Antwortlisten, darum gibt es keine Kennzahl „richtige Antwort = einzige längste oder kürzeste“.
- Paket B: 5 Tipps und 1 Rückmeldung, dazu 1 freiwillige then-now-Rückmeldung. Längster Satz: 12 Wörter (then-now).

## Was ich anders mache als vorgegeben, und warum

1. **Karl Benz, Satz 1:** „Karl Benz, auch Carl geschrieben, …“ statt des Titels „Karl (Carl) Benz“. Eine Klammer liest sich vorgelesen schlecht. So steht es auch im `intro` der Karte.
2. **Fachwörter ohne Erklärung:** „Physiker“ (Einstein), „Mathematikerin“ (Lovelace, Hopper, Johnson), „Anwalt“ (Mandela), „Generationen“ (Darwin; erklärt durch „von Eltern zu Kindern und Enkeln“). Die ersten drei halte ich ab 8 für bekannt, die `kinder-redaktion` soll entscheiden. Mögliche Ergänzung: „Physiker, also Naturforscher“.
3. **Wiederholung im ersten Satz:** Bei Hadid („entwarf … Bauten“) und Mandela („kämpfte gegen die Apartheid“) wiederholt Satz 1 den Inhalt des Rätsels, weil dort steht, was die Person tat. Das Neue steht in Satz 2 und 3.
4. **Wörter, die nur Profi aus dem Rätsel kennt:** „Meerestier“ (Anning) und „Otto Frisch“ (Meitner) stehen nur in Rätselsatz 2, also nur auf Profi. Ich habe sie so geschrieben, dass sie auch für Entdecker ohne diesen Satz verständlich sind.
5. **Abkürzung mit Punkt:** „Octavia E. Butler“ hat einen Punkt im Namen. Für die Auflösung ist das harmlos, solange kein Code sie in Sätze teilt. Für das Vorlesen sollte man es kurz prüfen.
6. **Was ich bewusst weggelassen habe:** „Photonen“ (Einstein): ein neues Fachwort ohne Nutzen für Kinder. Hadid „2004 erste Frau mit dem Pritzker-Preis“ und Carson „Frühling ohne Vogelgesang“: Beides bringt Erkenntnis, aber dann wird der Text über 180 Zeichen lang. Beides geht, wenn Claude lieber tauscht.

## Offen

- **Tests, die sich mit dem Einbau ändern müssen**, in `tests/world-game-learning-copy.test.mjs`:
  - Z. 49 prüft für Karl Benz und al-Chwarizmi `q.why === t.paragraphs.join(' ')`.
  - Z. 88 prüft, dass die Profi-Rückmeldung bei `people` gleich „Du hast „X“ gewählt. “ + Tipp ist.
  - Z. 32 prüft, dass Tipp, Rückmeldung und `why` verschieden sind. Das bleibt erfüllt.
  - Vorschlag für einen neuen Test: Jede Person in `EIGENE_RAETSEL` hat eine Auflösung, die mit dem Namen beginnt, unter 180 Zeichen bleibt und nicht mit „Richtig“ beginnt.
- **„Mehr lesen“:** Ob unter der kurzen Auflösung ein Link „Mehr lesen“ zur Karte (`#world/<id>`) stehen soll, wie Design-Prüfer und Spieltester vorschlagen, entscheidet Claude. Ich habe die Texte so geschrieben, dass sie auch ohne Link allein stehen.
- **Tier-Detektiv und „Rekorde“:** Ihre Tipps (`recordHints`, Tierdetektiv aus `animal-detective-clues.json`) klingen teils auch abstrakt, zum Beispiel „Unterscheide alle heute lebenden Tiere von Tieren, die ausschließlich an Land leben.“ Sie gehörten nicht zum Auftrag und könnten ein nächstes Paket werden.
- **Doppelte Wörter im Ton:** „überraschte damals viele“ (Payne-Gaposchkin) und „an die viele glaubten“ (Wu) klingen ähnlich. Die `kinder-redaktion` soll sagen, ob das in einer Runde stört.
- **Erklärung vor dem Tipp:** Ob „Das stimmt aber nicht.“ (Ibn al-Haytham) zu belehrend klingt, entscheidet die `kinder-redaktion`.

Hilfsdatei mit dem Zählskript und den Texten: `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/aufl.mjs`. Dort fehlen die zwei späten Änderungen an Goodall und Meitner; maßgeblich ist der JSON-Block oben.
