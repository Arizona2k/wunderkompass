# Personen-Rätsel: Prüfung der Kinder-Redaktion

Helfer: `kinder-redaktion` (opus/high), 25.11.2026. Prüft die 27 Rätsel aus den Paketen 1 bis 3.

Ich habe keine Datei geändert. Gelesen habe ich die drei Entwürfe, `EIGENE_RAETSEL` in /home/user/wunderkompass/app/world-game-support.mjs, den Test /home/user/wunderkompass/tests/world-game-learning-copy.test.mjs (Zeilen 60 bis 72) und /home/user/wunderkompass/tests/world-game-runde.test.mjs (Zeilen 177 bis 182). Dazu kamen Stichproben aus den Karten (Lovelace, Cai Lun, Carson, Wu, Meitner).

## 1. Gesamteindruck

**Paket 1 und 2: gut. Paket 3: geht so.**

Die Pakete 1 und 2 sind fast durchweg kindgerecht. Satz 1 ist konkret und passt zum Ton der vorhandenen Rätsel (Schimpansen, Raupen, Welle, Papier). Paket 3 hat drei Satz-2-Fassungen mit 17 bis 21 Wörtern und Strichpunkt. Bei Wu und Meitner ist Satz 1 für 5- bis 7-Jährige zu abstrakt.

„Diese Person“ steht 45-mal in 27 Rätseln. Das klingt vor allem dann holprig, wenn Satz 2 wieder damit beginnt (Bell Burnell). Mit meinen Vorschlägen sind es noch 37.

**Regel-Check meiner Vorschläge, von Hand nachgeprüft (nicht mit dem echten Test):**
- Kein Namensteil, auch nicht mitten im Wort. Beispiele: „Unterschied“ enthält kein „chien“, „Dingen“ steht nur bei Ibn al-Haytham und nicht bei Lehmann.
- Kein Fürwort aus der Liste des Tests. Kein Wort, das auf „er“ direkt nach ä, ö, ü oder ß endet („Darüber“ und „Außerdem“ schlagen nicht an).
- Kein Wort, das das Geschlecht verrät. Satz 1 enthält nie „?“ oder „.“ (die Trennung für Entdecker bleibt also sicher).
- Ein Vorschlag beginnt nicht mit „Diese Person“ (Hokusai). Danach beginnen immer noch 33 der 36 Rätsel damit; der Test in world-game-runde Zeile 181 verlangt mehr als 20.

**Zählweise:** Zahlen und Bindestrich-Wörter zähle ich als ein Wort (zum Beispiel „Science-Fiction“, „Computer-Rechnungen“).

## 2. Befunde je Person

### Muss

- **person-leavitt, Satz 2** (21 Wörter, Strichpunkt). Vorschlag mit drei Sätzen, wie bei Mandela:
  - „Dabei fand diese Person Sterne, die in einem festen Takt heller und dunkler werden.“ (14)
  - „Dieser Takt hilft, Entfernungen im Weltall zu messen.“ (8)
  - Wenn es bei zwei Sätzen bleiben soll: „Ein fester Takt im Licht mancher Sterne hilft, Entfernungen im Weltall zu messen.“ (13)
- **person-franklin, Satz 2** (21 Wörter, Strichpunkt, fremder Name Gosling).
  - Vorschlag: „1952 entstand im Team ein berühmtes Bild der DNA, des Bauplans in Zellen.“ (13)
  - „Im Team“ würdigt die gemeinsame Arbeit ohne den unbekannten Namen.
  - Die Schraubenform kann bei Bedarf als dritter Satz dazu: „Das Muster deutete auf eine Schraubenform hin.“ (7)
- **person-bell_burnell, Satz 2** (18 Wörter, beginnt wieder mit „Diese Person“).
  - Vorschlag: „Vorher half diese Person, ein Radioteleskop zu bauen: viele Antennen auf einem Feld.“ (13)
  - „Viele Antennen auf einem Feld“ erklärt das Wort Radioteleskop. Cambridge bringt Kindern nichts.
- **person-payne_gaposchkin, Satz 2** (17 Wörter). Vorschlag: „Das Ergebnis von 1925: Sterne bestehen vor allem aus Wasserstoff und Helium.“ (12)
  - Das neutrale „Ergebnis“ passt auch zur vorsichtigen Darstellung auf der Karte.
- **person-wu, Satz 1 und 2.** Satz 1 („Vorgänge im Spiegelbild“) können Kleine nicht greifen. Satz 2 hat 17 Wörter und braucht „Betazerfall“ und „Spiegel-Regel“.
  - Satz 1: „Diese Person prüfte genau, ob die Natur links und rechts unterscheidet.“ (11)
  - Satz 2: „1956 zeigte sich im Team: Beim Zerfall mancher Atomkerne gibt es diesen Unterschied.“ (13)
  - ⚠ für den `fakten-pruefer`: „links und rechts unterscheiden“ ist die übliche Umschreibung für die Verletzung der Spiegelsymmetrie, steht aber nicht wörtlich auf der Karte.
  - Rückfall mit Spiegel, Satz 1: „Diese Person prüfte mit einem Versuch, ob im Spiegelbild alles gleich abläuft.“ (12)
  - Rückfall mit Spiegel, Satz 2: „1956 zeigte sich im Team: Beim Zerfall mancher Atomkerne ist das nicht so.“ (13)
- **person-meitner, Satz 1** (15 Wörter, abstrakt, und das ist ausgerechnet der Satz für Entdecker).
  - Vorschlag: „Diese Person erklärte, wie ein winziger Atomkern in zwei Stücke zerbrechen kann.“ (12)
  - „Zerfallen“ habe ich bewusst vermieden, damit es nicht mit Wu verwechselt wird.

### Soll

- **person-wangari_maathai, Satz 2:** „Friedensnobelpreis, einen berühmten Preis für Frieden“ sagt dasselbe zweimal.
  - Vorschlag: „Dafür gab es 2004 den Friedensnobelpreis, einen der berühmtesten Preise der Welt.“ (12)
  - Satz 1: ok.
- **person-ada_lovelace, Satz 1:** Nebensatz mit 13 Wörtern. Ohne Zeitangabe verwechseln Kleine die Person leicht mit Berners-Lee, der in der Runde daneben steht.
  - Vorschlag: „Diese Person schrieb vor fast 200 Jahren Rechenschritte für eine geplante Maschine.“ (12)
  - ⚠ fakten: 1843 liegt 183 Jahre zurück. Ist „fast 200“ vertretbar?
- **person-cai_lun, Satz 2:** „verbessertes Schreibpapier“ wiederholt „besseres Papier“ aus Satz 1.
  - Vorschlag: „Erzählt wird: Im Jahr 105 kam das neue Papier zum Kaiserhof.“ (11). Darin steckt auch die Vorsicht aus „ist überliefert“.
  - Ohne diese Vorsicht: „Im Jahr 105 wurde das neue Papier am Hof des Kaisers vorgestellt.“ (12)
  - Satz 1: ok.
- **person-marie_curie, Satz 2:** 14 Wörter mit dem Doppel-Fachwort „Elemente, also Grundstoffe“.
  - Vorschlag: „Im Team entdeckte diese Person 1898 zwei neue Grundstoffe: Polonium und Radium.“ (12)
- **person-rachel_carson, Satz 1 und 2:** Satz 1 hat 14 Wörter, und Satz 2 wiederholt Satz 1 („andere Tiere treffen“ und „zu anderen Tieren gelangen“).
  - Satz 1: „Diese Person warnte: Gift gegen Schädlinge kann auch andere Tiere treffen.“ (11)
  - Satz 2: „Darüber schrieb diese Person 1962 ein Buch: Gift kann mit dem Futter weiterwandern.“ (13)
- **person-tu_youyou, Satz 1:** „Malaria, die Stechmücken übertragen“ lässt sich zweideutig lesen (wer überträgt wen?).
  - Vorschlag: „Diese Person suchte im Team nach Medizin gegen Malaria, eine Krankheit durch Mückenstiche.“ (13)
  - Satz 2: ok.
- **person-alexander_humboldt, Satz 2:** 14 Wörter. „Aimé Bonpland“ ist für Kinder ein unbekannter, schwer vorzulesender Name.
  - Vorschlag: „Dafür reiste diese Person von 1799 bis 1804 durch Teile Amerikas.“ (11)
  - „Fünf Jahre“ vermeide ich bewusst, weil das Darwin-Rätsel so beginnt.
  - Satz 1: ok.
- **person-grace_hopper:** „Anweisungen“ und „Übersetzungsprogramme“ sind schwer.
  - Satz 1: „Diese Person half, Computern Befehle mit Wörtern statt Zahlen zu geben.“ (11)
  - Satz 2: „Dafür entstanden im Team frühe Programme, die Wörter für den Computer übersetzen.“ (12)
  - ⚠ fakten: „statt Zahlen“ steht so nicht auf der Karte.
- **person-katherine_johnson, Satz 2:** „John Glenns“ besteht den Test, aber „John“ führt Kinder zur Antwort „Johnson“.
  - Vorschlag: „1962 prüfte diese Person Computer-Rechnungen für einen Flug rund um die Erde.“ (12)
  - Satz 1: ok.
- **person-tim_berners_lee, Satz 1:** „Web“ kennen Kleine nicht.
  - Vorschlag: „Diese Person entwickelte das Web: Internetseiten, die durch Links verbunden sind.“ (11)
  - Das setzt Web und Internet nicht gleich, aber Kinder erkennen „Internetseiten“. ⚠ fakten bitte bestätigen.
- **person-mary_anning, Satz 2:** 14 Wörter, Fachwort „Meeresreptil“, „solche Fossilien“ ist doppelt.
  - Vorschlag: „Bei Lyme Regis legte diese Person Teile eines ausgestorbenen Meerestiers frei.“ (11)
- **person-ibn_al_haytham:**
  - Satz 1: „tausend“ als Zahl schreiben, „vor etwa 1000 Jahren“, einheitlich mit Murasaki und Ibn Sina (weiter 13 Wörter).
  - Satz 2 (14 Wörter, „gezielten“): „In Kairo prüfte diese Person Ideen über Licht mit Versuchen und Mathematik.“ (12)
  - Lieber noch die Aha-Fassung (Offen 2 in Paket 2), wenn der `fakten-pruefer` zustimmt: „Mit Versuchen zeigte diese Person: Licht kommt von den Dingen in unsere Augen.“ (13)
- **person-meitner, Satz 2:** 15 Wörter. Vorschlag: „Das gelang 1939 mit Otto Frisch, kurz nach der Flucht aus Deutschland.“ (12)
  - Die Flucht ist altersgerecht genannt, ohne Einzelheiten.
  - Kleine Schwäche: Wer floh, steht nur unausgesprochen da.
- **person-octavia_butler, Satz 2:** „Fragen an unsere Gegenwart“ ist abstrakt, „Science-Fiction“ bleibt unerklärt.
  - Vorschlag: „Solche Zukunftsgeschichten heißen Science-Fiction und stellen Fragen an unser Leben heute.“ (11)
  - Satz 1: ok.
- **person-zaha_hadid, Satz 2:** 15 Wörter, Füllwort „zum Beispiel“.
  - Vorschlag: „Dazu gehört ein Feuerwehrhaus in Weil am Rhein von 1993.“ (10)
- **person-ibn_sina, Satz 2:** Kinder kennen „Kanon“ als Lied, und die Karte erklärt das Wort nicht.
  - Vorschlag: „Das Buch wurde viele hundert Jahre lang übersetzt und abgeschrieben.“ (10)
  - Soll der Titel bleiben, braucht die Karte eine Erklärung.
  - Satz 1: ok.

### Kann

- **person-jane_goodall:** Satz 1 ok. Satz 2 ohne Wiederholung: „Dabei zeigte sich: Schimpansen holen mit Zweigen Termiten aus dem Bau.“ (11)
- **person-bertha_benz:**
  - Satz 1: „Diese Person wagte mit einem der ersten Autos eine lange Fahrt.“ (11)
  - Satz 2: „1888 ging die Reise mit den beiden Söhnen von Mannheim nach Pforzheim.“ (12). „Mit zwei Söhnen“ klingt nach fremden Kindern.
- **person-marie_curie, Satz 1:** „Diese Person bekam zweimal einen Nobelpreis, einen der berühmtesten Preise der Welt.“ (12). Das passt einheitlich zu Maathai.
- **person-inge_lehmann:**
  - Satz 1: „Diese Person entdeckte: Mitten in der Erde steckt ein Kern im Kern.“ (12)
  - Satz 2: „Messorten“ durch „Orten“ ersetzen (dann 10 Wörter).
- **person-ada_lovelace, Satz 2:** „mit Musik umgehen“ durch „mit Musik arbeiten“ ersetzen: „Außerdem dachte diese Person: So eine Maschine könnte vielleicht auch mit Musik arbeiten.“ (13)
- **person-maria_sibylla_merian:**
  - Satz 1: „Diese Person beobachtete und zeichnete, wie aus Raupen Schmetterlinge werden.“ (10)
  - Satz 2: „1699 ging es mit der Tochter bis nach Suriname in Südamerika.“ (11)
- **person-katsushika_hokusai, Satz 1:** „Von dieser Person stammt ein berühmtes Bild mit einer riesigen Welle.“ (11). „Stammt“ deckt den Entwurf ab, ohne „zeichnete“ oder „druckte“ zu behaupten. Satz 2: ok.
- **person-tim_berners_lee, Satz 2:** Die Abkürzung CERN fällt weg, und „Browser“ wird besser erklärt: „Ende 1990 lief der erste Browser, ein Programm, das solche Seiten zeigt.“ (12)
- **person-jocelyn_bell_burnell, Satz 1:** „Diese Person entdeckte sehr regelmäßige Signale aus dem Weltall, wie ein Ticken.“ (12). „Papierstreifen“ ist für Kleine ein schwer vorstellbares Bild. ⚠ fakten: „Ticken“ ist ein Vergleich.
- **person-rosalind_franklin, Satz 1:** Kleine denken bei „Stoffe“ an Kleiderstoff. „Diese Person machte mit Röntgenstrahlen sichtbar, wie Stoffe ganz innen aufgebaut sind.“ (12). „Röntgen“ kennen Kinder vom Arztbesuch, das darf bleiben.
- **person-zaha_hadid, Satz 1:** „entwarf“ durch „plante“ ersetzen (dann 8 Wörter).

### ok ohne Änderung

- Gutenberg, beide Sätze. Zu Offen 1 in Paket 2: „druckte“ bleibt aus Kindersicht. Die Werkstatt-Fassung mit 16 Wörtern ist zu lang. Verlangt der `fakten-pruefer` sie, dann so: „In der Werkstatt dieser Person in Mainz entstanden Bücher mit Buchstaben aus Metall.“ (13)
- Satz 1 bei Goodall, Maathai, Cai Lun, Humboldt, Johnson, Leavitt, Payne-Gaposchkin, Butler, Ibn Sina.
- Satz 2 bei Hokusai und Tu Youyou.

## 3. Zu den Fragen unter „Offen“

**Paket 1**
- **3. Bertha und Karl Benz:** Bertha sagt „Auto“, Karl sagt „Motorwagen“. Stünden beide je in einer Runde, würden Kleine bei beiden auf Bertha tippen. Wird die Auswahl der Falschantworten geändert, sollte Karls Satz 1 auch „Auto“ enthalten.
- **4. Carson:** Ich empfehle den Weg über das Futter, nicht den Buchtitel; mein Wortlaut steht oben.
- **5. Reicht Satz 1 allein?**
  - Lovelace: Ja, wenn die Zeitangabe dazukommt (siehe oben).
  - Carson: Ja, mit „warnte“ und 11 Wörtern.

**Paket 2**
- **1. Gutenberg:** siehe oben unter „ok“.
- **2. Ibn al-Haytham:** Die Aha-Fassung ist für Kinder deutlich besser, wenn der `fakten-pruefer` sie freigibt.
- **3. Web und Anweisungen:** Web wird zu „Internetseiten“, Anweisungen werden zu „Befehle“ (siehe oben).

**Paket 3**
- **1. Suchwörter:** Science-Fiction (jetzt erklärt) und Otto Frisch (nur in Satz 2) sind ok. „Kanon“ sollte heraus oder auf der Karte erklärt werden.
- **2. Meitner:** Die Berlin-Fassung nicht nehmen (Einstein-Falle). Besser der Atomkern-Satz mit 12 Wörtern.
- **3. Wu:** Die Fassung mit „links und rechts“.
- **4. Kanon:** siehe Ibn Sina oben.

**Muster gegen „diese Person“:** „Diese Person“ bleibt in Satz 1, weil der Satz für Entdecker allein stehen muss. In Satz 2 nur, wenn der Bezug sonst unklar wird. Sonst eignen sich:
- „Dabei / Dafür / Vorher / Dazu …“
- das Team als Satzgegenstand
- die Leideform
- „Von dieser Person stammt …“

Satz 2 sollte nie wieder mit „Diese Person“ beginnen.

## 4. Was nach `more` gehört

Bei Rätseln gibt es kein `more`. Was hier herausfällt, steht schon auf den Karten:
- Bonpland, Gosling und CERN
- „Kanon der Medizin“, „Betazerfall“, „Meeresreptil“
- Schraubenform

## 5. Unsicher

- **Fakten-Nähe der Vereinfachungen:**
  - „links und rechts“ (Wu), „fast 200 Jahre“ (Lovelace), „statt Zahlen“ (Hopper), „Internetseiten“ (Berners-Lee), „Ticken“ (Bell Burnell)
  - „Erzählt wird“ (Cai Lun), „Mit Versuchen zeigte“ (Ibn al-Haytham), „zerbrechen kann“ (Meitner)
  - Das gehört zum `fakten-pruefer`.
- **Stufen (für den `stufen-pruefer`):** Auch mit meinen Fassungen bleiben Wu, Meitner, Payne-Gaposchkin, Leavitt und Franklin für 5- bis 7-Jährige schwer. Sie lassen sich wohl nur über die Falschantworten in der Runde lösen. Ob diese Personen überhaupt in die Entdecker-Runde gehören, sollte er entscheiden.
- **Echter Test:** Ich habe den echten Test nicht laufen lassen; die Regeln habe ich von Hand nachgeprüft. Nach dem Einbau bitte `pnpm test` laufen lassen.
- **Weitere Test-Anpassung:** In world-game-runde Zeile 180 muss die erwartete Goodall-Zeile ersetzt werden (das hat schon der Autor gemeldet).
