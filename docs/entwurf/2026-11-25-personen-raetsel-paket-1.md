# Personen-Rätsel „Wer ist das?“, Paket 1 von 3 (Entwurf, ungeprüft)

Helfer: `karten-autor` (opus/high), 25.11.2026. Entwurf; prüfen danach `fakten-pruefer`, `kinder-redaktion`, `stufen-pruefer`.

Ich habe keine Dateien geändert. Gelesen habe ich die neun Karten in `/home/user/wunderkompass/app/world-catalog.json`, `EIGENE_RAETSEL` und `personRecognitionClue` in `/home/user/wunderkompass/app/world-game-support.mjs`, den Aufbau der Runde in `/home/user/wunderkompass/app/world-game-bank.ts` sowie die Tests `/home/user/wunderkompass/tests/world-game-learning-copy.test.mjs` und `/home/user/wunderkompass/tests/world-game-runde.test.mjs`.

**Schon nachgezählt** (mit node, Skript `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/check.mjs`):
- Alle neun Rätsel bestehen die Namensteil-Regel und die Fürwort-Regex aus dem Test (um Zeile 67–70). Sie enthalten auch keinen Alias der Karte.
- Der Text bis zum ersten Satzende (`.`, `!` oder `?` mit Leerzeichen danach) ist genau Satz 1. Satz 1 enthält keine Abkürzungen und keine Fragezeichen. Ihr könnt für Entdecker also einfach am ersten Satzende trennen.
- Satzlängen: 9 bis 14 Wörter.
- Alle Rätsel beginnen mit „Diese Person“. Mitten im Satz steht „diese Person“ klein.

Diese Zählung ist keine Prüfung durch die Prüfer.

---

### person-jane_goodall
- **Satz 1:** Diese Person beobachtete wilde Schimpansen und gab den Tieren Namen statt Nummern.
- **Satz 2:** Dabei sah diese Person, wie Schimpansen mit Zweigen Termiten aus dem Bau holten.
- **Fundstelle:** `surprise` („Sie gab den Schimpansen Namen statt Nummern.“), `paragraphs[0]` und `[1]` (Schimpansen in Gombe; mit Stängeln und Zweigen Termiten aus den Bauten holen), Häppchen 1.
- **Quelle:** Jane Goodall Institute, https://janegoodall.org/jane-goodalls-story/ und https://janegoodall.org/news/55-years-at-gombe-qa-with-jane-on-origins-of-life-work/
- ⚠ leicht: „Namen statt Nummern“ steht nur im `surprise` der Karte. Bitte prüfen, ob die Quellen der Karte das ausdrücklich belegen.
- **Verwechslung:** Nur diese Karte handelt von Schimpansen und Termiten. In der Runde stehen Tu Youyou und Wangari Maathai daneben. Maathai passt auch zu „Natur in Afrika“, aber hier geht es um Bäume, nicht um Tiere. Satz 1 reicht allein.

### person-wangari_maathai
- **Satz 1:** Diese Person pflanzte in Kenia mit vielen Menschen Bäume.
- **Satz 2:** 2004 bekam diese Person dafür den Friedensnobelpreis, einen berühmten Preis für Frieden.
- **Fundstelle:** `intro` (in Kenia mit vielen Frauen für Bäume), `more[3]` (Green Belt Movement: Pflanzen von Bäumen), `paragraphs[0]` und `more[4]` (Friedensnobelpreis 2004).
- **Quelle:** Green Belt Movement, https://www.greenbeltmovement.org/wangari-maathai/ und https://www.greenbeltmovement.org/the-nobel-peace-prize/
- **Bewusst anders als die Karte:** „Menschen“ statt „Frauen“, damit das Rätsel neutral bleibt. Die Karte sagt „setzte sich für Bäume ein“; „pflanzte“ ist eine Vereinfachung, bitte prüfen.
- **Verwechslung:** Kenia steht nur auf dieser Karte. Goodall (auch Afrika und Natur) beobachtete Tiere. Curie, Einstein und Tu Youyou haben auch einen Nobelpreis, aber keinen für Frieden und keinen Bezug zu Bäumen.

### person-ada_lovelace
- **Satz 1:** Diese Person schrieb Rechenschritte für eine Maschine, die damals noch nicht gebaut war.
- **Satz 2:** Außerdem dachte diese Person: Eine solche Maschine könnte vielleicht auch mit Musik umgehen.
- **Fundstelle:** `intro` (1843, geplante Rechenmaschine, genaue Schrittfolgen), `more[3]` („wurde zu ihren Lebzeiten nicht gebaut“), `paragraphs[3]` (Musik als bedingte Vorstellung).
- **Quelle:** Computer History Museum, https://www.computerhistory.org/babbage/adalovelace/; York University, Anmerkungen von 1843, https://psychclassics.yorku.ca/Lovelace/lovelace.htm
- **Verwechslung:**
  - Grace Hopper machte das Programmieren echter Computer einfacher. Die Maschine existierte also.
  - Katherine Johnson berechnete Flugbahnen.
  - al-Chwarizmi schrieb Bücher übers Rechnen, ohne Maschine.
  - In der Runde stehen Tim Berners-Lee und Einstein daneben, beide ohne geplante Maschine.
  - „Damals noch nicht gebaut“ ist das Unterscheidungsmerkmal.

### person-bertha_benz
- **Satz 1:** Diese Person machte mit einem sehr frühen Auto eine lange Fahrt.
- **Satz 2:** 1888 ging die Reise mit zwei Söhnen von Mannheim nach Pforzheim.
- **Fundstelle:** `intro` (erprobte den Motorwagen auf einer längeren Reise), `paragraphs[0]` (1888, mit beiden Söhnen, Mannheim nach Pforzheim).
- **Quelle:** DPMA, https://www.dpma.de/dpma/veroeffentlichungen/patentefrauen/berthabenz/index.html
- **Namen:** kein „Benzin“ (Test prüft „benz“ auch mitten im Wort), kein „Mutter“. „Söhne“ verrät nicht, ob Mutter oder Vater gesucht ist.
- **Verwechslung:** Karl Benz' Rätsel sagt „entwickelte einen frühen Motorwagen“, hier steht „fuhr eine lange Strecke“. Pforzheim und 1888 stehen nur auf dieser Karte. In der Runde stehen al-Chwarizmi und Gutenberg daneben, also keine Verwechslung. Ist Karl Benz einmal Falschantwort, trennt Satz 2 eindeutig. Für ganz Kleine kann Satz 1 allein bei Karl Benz knapp sein (siehe Offen).

### person-cai_lun
- **Satz 1:** Diese Person half im alten China, besseres Papier herzustellen.
- **Satz 2:** Im Jahr 105 zeigte diese Person dem Hof des Kaisers ein verbessertes Schreibpapier.
- **Fundstelle:** `intro` (verbesserte die Papierherstellung im China der Han-Zeit), `paragraphs[1]` („Für das Jahr 105 ist überliefert, dass Cai Lun dem Hof eine verbesserte Form von Schreibpapier vorstellte“), `paragraphs[0]` (Beamter am chinesischen Kaiserhof).
- **Quelle:** Berkshire China Encyclopedia, https://www.berkshirepublishing.com/ecph-china/2017/12/27/cai-lun-121-ce/
- **Namen:** kein „Beamter“, weil das Wort männlich ist. Die kurzen Namensteile „Cai“ und „Lun“ kommen nicht vor.
- ⚠ Satz 2 lässt das „ist überliefert“ der Karte weg. Falls der fakten-pruefer die Vorsicht braucht, gibt es diese Fassung: „Für das Jahr 105 wird erzählt: Diese Person zeigte dem Hof des Kaisers ein besseres Schreibpapier.“ Sie ist mit 16 Wörtern aber länger.
- **Verwechslung:** Gutenberg, Hokusai und Bell Burnell haben auch „Papier“ auf der Karte, aber nicht China und nicht die Herstellung von Papier. Tu Youyou (China) lebt heute und forscht an Medizin. In der Runde stehen Maathai und Anning daneben.

### person-marie_curie
- **Satz 1:** Diese Person bekam für die Forschung zwei Nobelpreise, sehr berühmte Preise.
- **Satz 2:** 1898 entdeckte diese Person im Team zwei neue Elemente, also Grundstoffe: Polonium und Radium.
- **Fundstelle:** `intro` und `facts` (zwei Nobelpreise, Physik 1903, Chemie 1911), Häppchen 2 (1898, zwei neue Elemente, Elemente sind Grundstoffe), `paragraphs[2]` (Teamarbeit).
- **Quelle:** NobelPrize.org, https://www.nobelprize.org/prizes/physics/1903/marie-curie/biographical/; AIP, https://history.aip.org/exhibits/curie/discover.htm
- **Namen:** „im Team“ statt „mit ihrem Mann Pierre“. Das vermeidet ein Fürwort und den Namensteil „Curie“.
- **Wortwahl:** „entdeckte“, nicht „erfand“, passend zur Behauptung auf der Karte, die das „Erfinden“ als falsch ausweist.
- **Verwechslung:** Einstein (ein Nobelpreis, Karte 1921), Tu Youyou (einer) und Maathai (einer). Zwei Nobelpreise hat nur Curie. Meitner, Wu und Franklin haben keine Nobelpreise auf der Karte und kein Polonium oder Radium. In der Runde stehen Katherine Johnson und Goodall daneben.

### person-rachel_carson
- **Satz 1:** Diese Person zeigte in einem Buch: Gift gegen Schädlinge kann auch andere Tiere treffen.
- **Satz 2:** Das Buch von 1962 erklärt: Gift kann mit dem Futter zu anderen Tieren gelangen.
- **Fundstelle:** `intro` (Pflanzenschutzmittel treffen auch Lebewesen, gegen die sie nicht eingesetzt werden), `paragraphs[1]` (Silent Spring 1962; ein Stoff kann mit Nahrung weitergegeben werden und andere Tiere erreichen).
- **Quelle:** National Park Service, https://www.nps.gov/people/rachel-carson.htm; Michigan DNR, DDT und Nahrungsketten, https://www.michigan.gov/dnr/managing-resources/wildlife/wildlife-disease/wdm/ddt-and-other-chlorinated-hydrocarbon-pesticides
- ⚠ „Gift gegen Schädlinge“ vereinfacht „Pflanzenschutzmittel/Pestizide“. Bitte prüfen, ob das sachlich genug ist.
- **Namen:** kein „Biologin“ und kein „Autorin“, weil diese Wörter weiblich sind.
- **Verwechslung:** Mary Anning und Hokusai haben „Meer“ auf der Karte; deshalb nehme ich das Meer bewusst nicht. Gift und Nahrungskette stehen nur hier. In der Runde stehen Cai Lun und Darwin daneben; Darwin hat auch Tiere, aber kein Gift und kein Buch zu Umweltfolgen.

### person-inge_lehmann
- **Satz 1:** Diese Person fand heraus: Mitten in der Erde steckt ein innerer Kern.
- **Satz 2:** Dazu verglich diese Person, wann Erdbebenwellen an verschiedenen Messorten ankamen.
- **Fundstelle:** `intro` (Hinweise auf einen inneren Teil des Erdkerns), `paragraphs[0]` (Messgeräte zeichnen an verschiedenen Orten auf, wann Wellen ankommen), `paragraphs[1]` (verglich Aufzeichnungen; 1936 innerer Kern).
- **Quelle:** AMNH, https://www.amnh.org/learn-teach/curriculum-collections/earth-inside-and-out/inge-lehmann-discoverer-of-the-earth-s-inner-core; Niels Bohr Institute, https://nbi.ku.dk/english/www/inge/lehmann/
- ⚠ leicht: Die Karte sagt „veröffentlichte die Erklärung“ und „Hinweise“. „Fand heraus“ ist kindgerecht vereinfacht; die Karte nennt es selbst „Entdeckung eines inneren Kerns“.
- **Namen:** Der Test prüft „inge“ auch mitten im Wort. Darum kommen Wörter wie „Dinge“ oder „gelingen“ nicht vor; nachgeprüft.
- **Verwechslung:** Nur diese Karte handelt vom Erdkern. Mary Anning (Erde, Fossilien) und Humboldt passen nicht. In der Runde stehen Berners-Lee und Einstein daneben.

### person-tu_youyou
- **Satz 1:** Diese Person suchte mit einem Team nach Medizin gegen Malaria, die Stechmücken übertragen.
- **Satz 2:** Aus der Pflanze Einjähriger Beifuß gewann das Team einen Stoff namens Artemisinin.
- **Fundstelle:** `intro` (mit einem Forschungsteam nach Mitteln gegen Malaria), `paragraphs[0]` (Malaria durch Stechmücken übertragen), `paragraphs[2]` (Artemisinin aus dem Einjährigen Beifuß gewonnen).
- **Quelle:** Lasker Foundation, https://laskerfoundation.org/winners/artemisinin-therapy-for-malaria/; Nobelversammlung, https://www.nobelprizemedicine.org/wp-content/uploads/2015/10/Press_ENG.pdf
- ⚠ Die Karte sagt im Passiv „wurde ... gewonnen“. Dass Tu Youyous Team den Stoff gewann, ist in der Lasker-Quelle belegt; bitte prüfen.
- **Spieltest D:** Das Fachwort „Artemisinin“ steht jetzt erst in Satz 2, also nur für Profi und Experte.
- **Verwechslung:**
  - Ibn Sina (Medizin, alte Schriften) und Mae Jemison (Medizin) haben keine Malaria und keine Stechmücken.
  - Ohne das Wort Malaria wäre Ibn Sina eine echte Falle gewesen; darum steht es in Satz 1.
  - In der Runde stehen Gutenberg und Armstrong daneben.

---

### JSON
```json
{
 "person-jane_goodall": "Diese Person beobachtete wilde Schimpansen und gab den Tieren Namen statt Nummern. Dabei sah diese Person, wie Schimpansen mit Zweigen Termiten aus dem Bau holten.",
 "person-wangari_maathai": "Diese Person pflanzte in Kenia mit vielen Menschen Bäume. 2004 bekam diese Person dafür den Friedensnobelpreis, einen berühmten Preis für Frieden.",
 "person-ada_lovelace": "Diese Person schrieb Rechenschritte für eine Maschine, die damals noch nicht gebaut war. Außerdem dachte diese Person: Eine solche Maschine könnte vielleicht auch mit Musik umgehen.",
 "person-bertha_benz": "Diese Person machte mit einem sehr frühen Auto eine lange Fahrt. 1888 ging die Reise mit zwei Söhnen von Mannheim nach Pforzheim.",
 "person-cai_lun": "Diese Person half im alten China, besseres Papier herzustellen. Im Jahr 105 zeigte diese Person dem Hof des Kaisers ein verbessertes Schreibpapier.",
 "person-marie_curie": "Diese Person bekam für die Forschung zwei Nobelpreise, sehr berühmte Preise. 1898 entdeckte diese Person im Team zwei neue Elemente, also Grundstoffe: Polonium und Radium.",
 "person-rachel_carson": "Diese Person zeigte in einem Buch: Gift gegen Schädlinge kann auch andere Tiere treffen. Das Buch von 1962 erklärt: Gift kann mit dem Futter zu anderen Tieren gelangen.",
 "person-inge_lehmann": "Diese Person fand heraus: Mitten in der Erde steckt ein innerer Kern. Dazu verglich diese Person, wann Erdbebenwellen an verschiedenen Messorten ankamen.",
 "person-tu_youyou": "Diese Person suchte mit einem Team nach Medizin gegen Malaria, die Stechmücken übertragen. Aus der Pflanze Einjähriger Beifuß gewann das Team einen Stoff namens Artemisinin."
}
```

### Umformuliert
Keine Antworttexte. Die Antworten bleiben die Personennamen; es ändert sich nur der Fragetext („Wer passt zu diesem Hinweis? …“). Die Fixtures `legacy-people18/20` enthalten ohnehin schon ältere Fragetexte.

### Zahlen
Entfällt: Es gibt keine neuen Antwortoptionen, die Falschantworten bleiben die festen Namen aus `people-game-baseline.json`. Satzlängen in Wörtern (Satz 1 / Satz 2): Goodall 12/13, Maathai 9/12, Lovelace 13/13, Bertha Benz 11/11, Cai Lun 9/13, Curie 11/14, Carson 14/13, Lehmann 12/10, Tu Youyou 13/12.

### Offen und Hinweise für den Einbau
1. **Test bricht absichtlich:** `/home/user/wunderkompass/tests/world-game-runde.test.mjs` Zeile 180 erwartet „Mit 26 Jahren begann diese Person“ (Goodall). Mit dem neuen Rätsel schlägt das fehl; dort ein anderes Beispiel wählen. Zeile 179 (kein großes „Diese Person“ mitten im Satz) und Zeile 181 (mehr als 20 Hinweise beginnen mit „Diese Person“) bleiben erfüllt.
2. **Entdecker nur Satz 1:** Heute zeigt der Code für alle Stufen den ganzen Text. Wie die Trennung je Stufe gebaut wird, entscheidet ihr. Die neun alten Rätsel in `EIGENE_RAETSEL` sind dafür nicht gebaut: Bei Armstrong ist Satz 1 allein schon gut, bei Einstein und Mandela ist Satz 1 für Kleine eher schwer.
3. **Bertha und Karl Benz:** Für ganz Kleine kann „sehr frühes Auto“ bei Karl Benz knapp sein. Heute stehen die beiden nie zusammen in einer Runde. Wird die Auswahl der Falschantworten einmal geändert, das noch einmal ansehen.
4. **Carson Satz 2:** Statt der Nahrungskette ginge auch „Das Buch von 1962 heißt „Der stumme Frühling“.“ Das hilft beim Wiedererkennen, ist aber weniger lehrreich. Ich empfehle die Nahrungskette.
5. **Für die Prüfer:** `fakten-pruefer` bitte vor allem Cai Lun (Satz 2, „überliefert“ weggelassen), Tu Youyou (Satz 2), Carson („Gift gegen Schädlinge“) und Goodall („Namen statt Nummern“). `kinder-redaktion` und `stufen-pruefer` bitte vor allem, ob Satz 1 bei Lovelace und Carson für 5- bis 8-Jährige allein reicht.
