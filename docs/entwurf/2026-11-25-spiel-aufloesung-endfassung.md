# Endfassung: kurze Auflösungen, Tipps und „Rückmeldung im Blick“

Stand 25.11.2026. Grundlage: [Entwurf](2026-11-25-spiel-aufloesung-entwurf.md) des `karten-autor`, geprüft von `fakten-pruefer` ([1. Runde](2026-11-25-spiel-aufloesung-faktenpruefung.md), [2. Runde](2026-11-25-spiel-aufloesung-faktenpruefung-2.md)), `kinder-redaktion` ([Bericht](2026-11-25-spiel-aufloesung-kinderredaktion.md)) und `stufen-pruefer` ([Bericht](2026-11-25-spiel-aufloesung-stufenpruefung.md)). Eingebaut in `app/world-game-support.mjs` (`AUFLOESUNG`, `hints`, `worldGameWrongFeedback`) und `app/world-game-bank.ts`.

## Was sich für Kinder ändert

- **„Wer war das?“:** Nach „Richtig!“ steht nicht mehr der ganze Kartentext, sondern eine kurze Auflösung mit etwas Neuem über die Person (Abschnitt Paket A). Sie gilt auf allen Stufen.
- **Tipps in Kinderton** für Personen (Profi, Experte), Tierzuhause, Futter, Erfindungen und Früher oder heute (Paket B).
- **Eigene Rückmeldungen** nach falscher Antwort: Personen auf Profi und Experte, „Erst in der Zukunft“ bei Früher oder heute.
- **Rückmeldung im Blick:** Nach jeder Antwort rollt die Seite so, dass der Kasten mit „Richtig!“ oder „Noch nicht ganz“ ganz über der unteren Leiste steht (Spieltest Personen-Rätsel, Muss 1). Nach „Richtig!“ hat „Weiter“ den Fokus. Gilt für alle Welt-Spiele, Kreuz und quer, „Stimmt das wirklich?“ und „Wer lebt wo?“ (`app/kern/spiel-fokus.ts`, `zurRueckmeldung`).

## Paket B: Tipps und Rückmeldungen

| Spiel | Tipp | Gilt für |
|---|---|---|
| `people` | Manche Menschen hier machten ähnliche Dinge. Achte auf Einzelheiten im Hinweis: einen Ort, ein Jahr oder ein Ding. Welchen Namen kannst du sicher streichen? | Profi, Experte (Entdecker behält den eigenen Tipp) |
| `habitats` | Schau dir das Tier genau an: Hat es Flossen, Beine oder Flügel? Ist sein Zuhause eher warm oder kalt, nass oder trocken? | alle Stufen |
| `food` | Überlege: Wo und wie sucht dieses Tier sein Futter? Lies jede Antwort bis zum Ende. Manchmal frisst ein junges Tier etwas anderes als ein großes. | alle Stufen |
| `technology` | Worum geht es im Text? Überlege bei jeder Erfindung: Wobei hilft sie den Menschen? | alle Stufen |
| `then-now` | Denk an Dinge, die du von zu Hause oder von unterwegs kennst. Klingt die Beschreibung nach heute oder nach früher? | alle Aufgaben ohne eigene Vergleichsfrage (alle außer Kompass) |

Rückmeldungen nach falscher Antwort:
- `people`, Profi und Experte: „Du hast „X“ gewählt. Passt jeder Satz im Hinweis zu diesem Menschen? Schau dir auch die anderen Namen an.“
- `then-now`, Antwort „Erst in der Zukunft“ (und die alten dritten Antworten „Noch keine wirkliche Entwicklung“, „Nur ein Zukunftswunsch“ aus gespeicherten Runden): „Du hast „X“ gewählt. Das hier gibt es schon, oder es gab es früher. War es früher so oder ist es heute so?“ Der Satz ist für Früher- und Heute-Aufgaben gleich und verrät keine Zeit.
- Alle anderen: „Du hast „X“ gewählt.“ und der Tipp.

## Was Claude aus den Berichten macht

**`fakten-pruefer`, 1. Runde (5 Muss):** alle umgesetzt. Darwin ohne „verwandelt sich“ (kein Widerspruch zur Metamorphose bei Merian), „Arten können sich … verändern“. Personen-Tipp ohne „forschten“ (auf Profi kommen Dichter, Künstler und Mandela). Einstein mit „Energie in kleinen Portionen“. Zukunfts-Rückmeldung stimmt jetzt für Früher und Heute. Belege getauscht (Ibn al-Haytham: PMC6074172, Bertha Benz: Mercedes-Benz Tradition). Kann: Gutenberg „Schriftzeichen aus Metall“, Cai Lun „Einfaches Papier gab es schon vor ihm“, Tu Youyou „einen Teil des Nobelpreises“ übernommen.

**`fakten-pruefer`, 2. Runde (4 Muss):** alle umgesetzt. Tagore „als erster Dichter, der kein Europäer war“. Meitner „ein schwerer Atomkern“. Payne-Gaposchkin „bestehen fast nur aus leichtem Gas, anders als die Erde“ („ganz“ fiel für die Satzlänge weg). Die Zukunfts-Rückmeldung setzt die gewählte Antwort ein. Kann: Leavitt, Karl Benz, Ibn al-Haytham („lange in Kairo“), Hokusai („nur“ gestrichen), Meitner („arbeitete mit ihr“) übernommen.

**`kinder-redaktion` (6 Muss):** alle umgesetzt. Keine Abkürzungen (COBOL, CERN, „E.“), kein Englisch, kein Schachtelsatz bei Wu, Payne-Gaposchkin konkret, Ibn al-Haytham „Es ist umgekehrt“, kein Bezug auf Wörter, die nur in Profi-Sätzen stehen (Curie, Humboldt, Mandela, Bertha Benz), Physiker, Anwalt und Patent erklärt, „Bonpland“ und „auch Carl geschrieben“ weg. Kann: Carson mit Erklärung des Buchtitels, Hadid mit dem Preis als erste Frau, Wiederholungen aus den Rätseln abgebaut, Paket-B-Wortlaut („Dinge“, „Das hier“) übernommen.

**`stufen-pruefer` (3 Muss):** alle umgesetzt. Profi-Tipp mit breiten Beispielen, Darwin „Ein einzelnes Tier wird dabei nicht zu einer neuen Art“, Tests angepasst. Neue Unit-Tests 1 bis 4 eingebaut (`tests/world-game-learning-copy.test.mjs`): Auflösung je Person (Länge, Name am Anfang, Satzlänge, keine Rätselsätze), keine andere Kartenperson in einer Auflösung (nur Bertha und Karl Benz), Profi-Tipp für alle gleich und ohne Namen, Zukunfts-Rückmeldung für Früher und Heute gleich. Kann: Bertha ohne „Motorwagen“ und ohne den Namen ihres Mannes, `habitats` mit „warm oder kalt“, then-now-Rückmeldung ohne Zeitform übernommen.

## Aufgeschoben (mit Grund)

- **Quellen auf die Karten** (Kann, beide Faktenrunden): Hopper (Computer History Museum), Bertha Benz (Mercedes-Benz Tradition), Tagore (V&A), Lovelace (Computer History Museum, Babbage), Ibn al-Haytham (PMC6074172), Bell Burnell (NASA Imagine), Cai Lun (Oxford Cabinet), Lehmann (USGS). Gehört in die Kartenquellen, nicht in diesen PR; BACKLOG.
- **Curie „einen“ Grundstoff** und **Bonpland „Pflanzenforscher“** bleiben: Die Aussagen stimmen, die Quelle zu Bonplands Beruf ist nur teilweise belegt (SPSG auf der Karte).
- **„Mehr lesen“-Link in der Rückmeldung:** kommt mit Umbau-Schritt 6 (Spielbrett).
- **Eigene Rückmeldungskästen** in den Länder-Spielen (`app/learning-games.tsx`, `app/advanced-games.tsx`): folgen mit Umbau-Schritt 6.
- **BACKLOG aus der Stufen-Prüfung:** Experten-Aufgaben aus den Auflösungen; Abstand bei Früher oder heute für Profi und Experte (Prinzip-Fragen wie beim Kompass); Ratemuster-Test auf Wörter im Hinweis ausdehnen; Tierdetektiv und `recordHints` in Kinderton; 5 von 12 Früher-Texten enthalten „früh-“.

## Paket A: 36 Auflösungen nach „Richtig!“

| Karte | Auflösung | Zeichen |
|---|---|---|
| `person-jane_goodall` | Jane Goodall forschte im Wald von Tansania, in Afrika. Am Anfang liefen die Schimpansen vor ihr weg. Erst nach Monaten gewöhnten sich die Tiere an sie. | 151 |
| `person-wangari_maathai` | Wangari Maathai wollte, dass die Bäumchen auch groß werden. Darum wurden sie nach dem Pflanzen gepflegt. Später zählte man, wie viele noch wuchsen. | 147 |
| `person-ada_lovelace` | Ada Lovelace war Mathematikerin in England. Ihre Rechenschritte gelten als eines der ersten Computerprogramme. Die Maschine dazu wurde aber nie fertig gebaut. | 158 |
| `person-bertha_benz` | Bertha Benz zeigte mit ihrer Fahrt: Das neue Auto schafft auch weite Strecken. Ihr Mann hatte es gebaut. Sie gab Geld für seine Arbeit. | 135 |
| `person-cai_lun` | Cai Lun arbeitete für den Kaiser von China. Einfaches Papier gab es schon vor ihm. Es besteht aus winzigen Pflanzenfasern, die sich zu einem Blatt verbinden. | 157 |
| `person-marie_curie` | Marie Curie stammte aus Polen und forschte in Paris. Mit ihrem Mann fand sie einen neuen Grundstoff. Sie nannten ihn nach Polen: Polonium. | 138 |
| `person-rachel_carson` | Rachel Carson erforschte das Leben im Meer. Ihr Buch über Gift heißt „Der stumme Frühling“. Gemeint ist ein Frühling, in dem keine Vögel mehr singen. | 149 |
| `person-inge_lehmann` | Inge Lehmann erforschte Erdbebenwellen und das Innere der Erde. Heute wissen wir: Der äußere Erdkern ist flüssig, der innere ist fest. | 134 |
| `person-tu_youyou` | Tu Youyou suchte in China nach neuen Medikamenten. Ein Hinweis in alten Büchern über Heilkunde half dem Team weiter. 2015 bekam sie dafür einen Teil des Nobelpreises. | 166 |
| `person-maria_sibylla_merian` | Maria Sibylla Merian war Künstlerin und Naturforscherin. Auf ihren Bildern sieht man auch die Pflanzen, an denen die Raupen leben. | 130 |
| `person-johannes_gutenberg` | Johannes Gutenberg war Handwerker und Erfinder. Seine Werkstatt druckte die Bibel, das heilige Buch der Christen. In Korea druckte man schon früher mit Schriftzeichen aus Metall. | 178 |
| `person-katsushika_hokusai` | Katsushika Hokusai war ein Künstler aus Japan. Er zeichnete die Bilder vor. Andere Menschen schnitten sie in Holz und druckten sie. | 131 |
| `person-alexander_humboldt` | Alexander von Humboldt nahm Messgeräte mit auf seine Reisen. Ein Pflanzenforscher aus Frankreich reiste mit ihm. Auch Menschen, die dort lebten, halfen mit. | 156 |
| `person-grace_hopper` | Grace Hopper war Mathematikerin in den USA. Früher bestanden Computer-Befehle oft nur aus Zahlen. Wörter sind für Menschen viel leichter zu lesen. | 146 |
| `person-katherine_johnson` | Katherine Johnson war Mathematikerin bei der Raumfahrt in den USA. Ergebnisse vom Computer rechnete sie mit einer Tisch-Rechenmaschine nach. So konnten Fehler auffallen. | 169 |
| `person-tim_berners_lee` | Tim Berners-Lee ist ein Computer-Fachmann aus England. Er arbeitete an einem Forschungszentrum in der Schweiz. Später durfte jeder seine Erfindung kostenlos nutzen. | 164 |
| `person-mary_anning` | Mary Anning legte Fossilien vorsichtig aus dem Stein frei. Zuerst fand ihr Bruder Joseph einen Schädel. Später fand Mary weitere Teile dieses Tieres. | 149 |
| `person-ibn_al_haytham` | Ibn al-Haytham lebte und arbeitete lange in Kairo, in Ägypten. Früher dachten viele: Augen schicken Strahlen aus wie eine Taschenlampe. Er zeigte: Es ist umgekehrt. | 164 |
| `person-henrietta_swan_leavitt` | Henrietta Swan Leavitt erforschte Sterne an einer Sternwarte in den USA. Sie fand: Von zwei solchen Sternen leuchtet der mit dem langsameren Takt stärker. | 154 |
| `person-cecilia_payne_gaposchkin` | Cecilia Payne-Gaposchkin zerlegte Sternenlicht in seine Farben, wie beim Regenbogen. Ihr Fund: Sterne bestehen fast nur aus leichtem Gas, anders als die Erde. | 158 |
| `person-rosalind_franklin` | Rosalind Franklin war Forscherin in London. Ihr Röntgenbild gab einen Hinweis: Der Bauplan DNA ist gedreht wie eine Wendeltreppe. | 129 |
| `person-jocelyn_bell_burnell` | Jocelyn Bell Burnell war eine junge Forscherin in England. Die Signale kamen von Resten großer Sterne. Diese Reste drehen sich und blitzen wie ein Leuchtturm. | 158 |
| `person-octavia_butler` | Octavia Butler war Schriftstellerin in den USA. Ihre Notizen und Entwürfe liegen heute in einer Bibliothek. Darin sieht man: Sie schrieb ihre Texte oft um. | 155 |
| `person-chien_shiung_wu` | Chien-Shiung Wu wurde in China geboren und forschte später in den USA. Ihr Versuch zeigte: Auch eine bekannte Naturregel gilt nicht immer. | 138 |
| `person-lise_meitner` | Lise Meitner forschte viele Jahre in Berlin über Atome. Ihr Neffe Otto Frisch arbeitete mit ihr. Zusammen erkannten sie: Wenn ein schwerer Atomkern zerbricht, wird Energie frei. | 177 |
| `person-zaha_hadid` | Zaha Hadid war Architektin: Sie entwarf Häuser und andere Bauten. Als erste Frau bekam sie einen der wichtigsten Preise für Baukunst. Ihre Ideen malte sie auch als Bilder. | 171 |
| `person-ibn_sina` | Ibn Sina wusste viel über Medizin und noch viele andere Dinge. In Europa nannte man ihn Avicenna. Dort übersetzte man sein Buch und schrieb es lange ab. | 152 |
| `person-charles_darwin` | Charles Darwin war Naturforscher. Arten können sich über viele Generationen verändern, von Eltern zu Jungen und Enkeln. Ein einzelnes Tier wird dabei nicht zu einer neuen Art. | 175 |
| `person-murasaki_shikibu` | Murasaki Shikibus eigene Handschrift gibt es nicht mehr. Wir kennen ihre Geschichte nur, weil andere sie von Hand abschrieben. | 126 |
| `person-nelson_mandela` | Nelson Mandela war Anwalt: Er half Menschen vor Gericht. Für seinen Kampf saß er 27 Jahre im Gefängnis. Trotzdem gab er nicht auf. | 130 |
| `person-mae_jemison` | Mae Jemison war Ärztin und Astronautin in den USA. Sie war die erste Schwarze Frau im Weltall. Dort half sie bei Versuchen mit Knochenzellen. | 141 |
| `person-karl_benz` | Karl Benz war Ingenieur, also ein Fachmann für Technik. 1886 bekam er ein Patent: Andere durften seinen Motorwagen nicht einfach nachbauen. Seine Frau Bertha half ihm. | 167 |
| `person-albert_einstein` | Albert Einstein war Physiker, also ein Forscher für Kraft, Bewegung und Licht. Geboren wurde er in Ulm. Er erklärte: Licht bringt seine Energie in kleinen Portionen mit. | 169 |
| `person-al_khwarizmi` | Al-Chwarizmi forschte über Zahlen und über die Sterne. Von seinem Namen kommt das Wort „Algorithmus“. Das ist eine Anleitung in festen Schritten, wie ein Rezept. | 161 |
| `person-neil_armstrong` | Neil Armstrong testete vorher neue Flugzeuge. 1969 betrat er als erster Mensch den Mond. Ein dritter Mann, Michael Collins, kreiste im Raumschiff um den Mond. | 158 |
| `person-rabindranath_tagore` | Rabindranath Tagore war ein Dichter aus Indien. 1913 bekam er den Nobelpreis, als erster Dichter, der kein Europäer war. Manchmal malte er aus durchgestrichenen Wörtern Bilder. | 176 |

36 Texte, längster 178 Zeichen.
