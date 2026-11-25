# Tier-Auflösungen, Paket 2 (25.11.2026), karten-autor

> Helferbericht (karten-autor, opus / high), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

Das ist ein Entwurf und noch nicht geprüft. Dateien habe ich keine geändert. Als Nächstes prüfen `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer`.

## So habe ich geschrieben

Ich halte mich an dieselben Grenzen wie bei `AUFLOESUNG` und `TECHNIK_AUFLOESUNG`:
- höchstens 180 Zeichen;
- höchstens 13 Wörter je Satz;
- höchstens eine Zahl;
- 2 bis 3 Sätze;
- kein Satz aus dem Rätsel-Hinweis und kein fast wörtlicher Satz von der Karte;
- kein anderer Tiername aus dem Spiel (Titel und Kurznamen wie „Delfin“, „Schildkröte“ oder „Salamander“), sonst verrät die Auflösung eine Falle.

**Anfang wie bei Technik:** Jeder Text beginnt mit Artikel und Kartentitel, also „Der Orca“, „Die Grüne Meeresschildkröte“, „Das Rote Riesenkänguru“. Ausnahme ist „Der Krake“ statt „Der Gewöhnliche Krake“, so steht es auch in der Einleitung der Karte. Die Tier-Titel haben keinen Artikel. Ein späterer Test kann darum nicht wie bei Technik `startsWith(t.title)` prüfen. Vorschlag: Der Test prüft, ob der Text mit „Der/Die/Das “ und dem Titel oder seinem letzten Wort beginnt. Bitte allen vier Paketen dieselbe Regel geben.

**Nachgezählt** habe ich mit einem Node-Skript (`/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/zaehle.mjs`). Es zählt Länge, Satzlänge und Zahlen und sucht nach Hinweissätzen, Kartensätzen, anderen Tiernamen und den Wörtern „nur“, „immer“, „alle“, „nie“. Alle 36 Texte sind ok, sie haben 125 bis 177 Zeichen. Den Text der Meeresschildkröte (Zuhause) habe ich danach noch geändert und einzeln nachgezählt: 167 Zeichen, Sätze unter 13 Wörtern.

---

## 1. animal-orca – Orca

**Heute:**
- Hinweis: „Wir leben oft in Familiengruppen und lernen voneinander. Manche Gruppen fressen vor allem Fische, andere jagen Meeressäuger. Beim Jagen arbeiten wir zusammen.“
- Zuhause: „Ozean“, die Auflösung heute: „Orca: Ozean“
- Futter: „Je nach Gruppe verschiedene Beutetiere“, die Auflösung heute: „Manche Gruppen fressen vor allem Fische. Andere jagen Meeressäuger wie Robben.“

**Tierdetektiv:** Der Orca jagt oft gemeinsam mit seiner Familie. Manche Orcas schwimmen zusammen auf eine Eisscholle zu und machen so eine Welle. Die spült Robben ins Wasser.
- Quelle: WWF UK, Top 10 facts about Orcas (Quelle der Karte; „waves to wash seals off ice floes“): https://www.wwf.org.uk/learn/fascinating-facts/orcas
- Quelle: NOAA Fisheries, Killer Whale („coordinated hunting strategy … work as a team“): https://www.fisheries.noaa.gov/species/killer-whale

**Zuhause:** Der Orca kommt in warmen und in eisigen Meeren zurecht. Unter seiner Haut liegt eine dicke Fettschicht. Sie hält ihn warm wie eine Decke.
- Quelle: NOAA Fisheries (in allen Ozeanen): Link oben.
- ⚠ Quelle: AMNH Ology, Karte „Polar Seas“ („a layer of blubber about 10 centimeters thick to keep their bodies warm in the polar seas“): https://amnh.org/explore/ology/ology-cards/197-polar-seas. Die Seite gab mir 403 zurück. Das Zitat kenne ich nur aus einem Suchergebnis.
- Ersatzquelle: SeaWorld, Killer Whale Adaptations: https://seaworld.org/animals/all-about/killer-whale/adaptations/

**Futter:** Der Orca lernt von seiner Gruppe, welche Beute sie jagt. Manche Gruppen fangen vor allem Lachse, andere Robben. Mit Klicklauten und ihrem Echo spüren Orcas Beute auf.
- Quelle: NOAA (Residents: „mainly salmon“, Transients: „marine mammals … seals“; Rufe „learned and culturally transmitted“): Link oben.
- Quelle: WWF UK (nennt „echolocation“): Link oben.

**Hinweise:**
- Die Fettschicht steht in keiner Quelle der Karte, bitte die AMNH-Seite direkt prüfen.
- „lernt …, welche Beute sie jagt“: NOAA belegt das Lernen für die Rufe. Dass Orcas auch die Jagd voneinander lernen, schreiben WWF und Fachliteratur, aber NOAA nicht wörtlich. ⚠ Bitte prüfen.

## 2. animal-common-octopus – Gewöhnlicher Krake

**Heute:**
- Hinweis: „Ich besitze acht Arme und verstecke mich oft allein in einer Felsspalte. Stoße ich Wasser aus, kann ich mich schnell fortbewegen.“
- Zuhause: „Küste“, die Auflösung heute: „Gewöhnlicher Krake: Küste“
- Futter: „Meerestiere“, die Auflösung heute: „Er frisst zum Beispiel Krebse, Muscheln, Schnecken und Fische.“

**Tierdetektiv:** Der Krake hat keine Knochen. Sein weicher Körper quetscht sich durch erstaunlich enge Spalten. Beim Wasserausstoßen saust er davon wie ein losgelassener Luftballon.
- Quelle: Smithsonian Magazine, 2026 („bodies are mostly soft and pliable“, nur Knorpelkapsel und Schnabel sind fester; Versuche mit dem Gewöhnlichen Kraken): https://www.smithsonianmag.com/smart-news/octopuses-are-the-ultimate-escape-artists-now-scientists-know-how-the-creatures-contort-themselves-to-squeeze-through-tiny-holes-180989846/
- Quelle: UC Berkeley, Weichtiere (Quelle der Karte): https://ucmp.berkeley.edu/taxa/inverts/mollusca/mollusca.php
- Quelle: Aquarium La Rochelle (Rückstoß bei der Flucht): https://www.aquarium-larochelle.com/en/species-encyclopedia/common-octopus/

**Zuhause:** Der Krake findet an felsigen Küsten viele Verstecke. Er ändert Farbe und Haut und sieht dann aus wie der Stein daneben. Mit seinen Saugnäpfen hält er sich gut fest.
- Quelle: Animal Diversity Web, Octopus vulgaris (versteckt sich „by varying colour, skin, texture“; „rocky shores … crevice“; „arms lined with suckers“): https://animaldiversity.org/accounts/Octopus_vulgaris/

**Futter:** Der Krake packt seine Beute mit den Saugnäpfen. In der Mitte unter seinen Armen sitzt ein harter Schnabel. Damit knackt er die Schalen von Krebsen und Muscheln.
- Quelle: Smithsonian Magazine (Schnabel aus Chitin zum Fressen): Link oben.
- ⚠ Quelle: Nationalpark Calanques, Common octopus (Schnabel knackt Schalen von Krebsen und Weichtieren): https://calanques-parcnational.fr/en/common-octopus. Das kenne ich nur aus einem Suchergebnis.

**Hinweise:**
- Den bekannten Satz „passt durch jedes Loch, das größer ist als sein Schnabel“ habe ich bewusst weggelassen. Eine Studie von 2026 stellt ihn infrage.
- „Schnecken“ habe ich weggelassen, damit kein Tiername aus dem Spiel fällt (Weinbergschnecke).

## 3. animal-green-sea-turtle – Grüne Meeresschildkröte

**Heute:**
- Hinweis: „Ich schwimme zwischen Futterplätzen und Niststränden. Zum Atmen muss ich an die Oberfläche. Als erwachsenes Tier fresse ich vor allem Seegras und Algen.“
- Zuhause: „Küste“, die Auflösung heute: „Grüne Meeresschildkröte: Küste“
- Futter: „Als erwachsenes Tier vor allem Pflanzen“, die Auflösung heute: „Erwachsene fressen vor allem Seegras und Algen. Junge Tiere fressen auch kleine Tiere.“

**Tierdetektiv:** Die Grüne Meeresschildkröte hat statt Füßen flache Flossen. Damit schwimmt sie weite Strecken durchs Meer. Grün ist übrigens ihr Körperfett, nicht ihr Panzer.
- Quelle: NOAA Fisheries, Green Turtle (Quelle der Karte; der Name „comes from the color of their fat (not their shells)“): https://www.fisheries.noaa.gov/species/green-turtle
- Quelle: Turtle Foundation, Arten (Quelle der Karte): https://turtle-foundation.org/de/meeresschildkroeten/arten/

**Zuhause:** Die Grüne Meeresschildkröte braucht zwei Orte an der Küste. Im flachen Wasser weidet sie auf Wiesen aus Seegras. Ihre Eier legt sie an Sandstränden in den warmen Sand.
- Quelle: NOAA („shallow coastal habitats“; „lay their eggs on sandy beaches … incubating in the warm sand“): Link oben.

**Futter:** Die Grüne Meeresschildkröte hat keine Zähne. Ihr Schnabel hat aber eine gezackte Kante wie ein Brotmesser. Damit schneidet sie Seegras und Algen ab.
- Quelle: NOAA („the serrated edges of their beak“; „diet mainly consists of algae and seagrasses“): Link oben.

**Hinweise:**
- „Flossen“ belegt NOAA nur nebenbei, das ist Grundwissen.
- Streng genommen sind Algen keine Pflanzen. Die richtige Antwort „vor allem Pflanzen“ und die Karte behandeln sie aber so. Der Text widerspricht der Antwort nicht.

## 4. animal-red-kangaroo – Rotes Riesenkänguru

**Heute:**
- Hinweis: „Ich lebe im trockenen Inneren Australiens. Mit meinen kräftigen Hinterbeinen hüpfe ich schnell. Weibchen sind häufig blaugrau.“
- Zuhause: „Grasland“, die Auflösung heute: „Rotes Riesenkänguru: Grasland“
- Futter: „Pflanzen“, die Auflösung heute: „Es frisst Gräser und andere kleine grüne Pflanzen.“

**Tierdetektiv:** Das Rote Riesenkänguru hüpft schnell und spart dabei Kraft. Seine Beine federn bei jedem Sprung wie Gummibänder. Der lange, kräftige Schwanz hilft beim Gleichgewicht.
- Quelle: San Diego Zoo, Kangaroo and Wallaby (Kängurus „burn less energy the faster they hop“; Schwanz „helping … balance“): https://animals.sandiegozoo.org/animals/kangaroo-and-wallaby
- ⚠ Quelle: eLife 2025, Thornton et al. (die Achillessehne speichert Federenergie): https://elifesciences.org/articles/96437

**Zuhause:** Das Rote Riesenkänguru lebt dort, wo es oft sehr heiß ist. In der Hitze ruht es im Schatten. Es leckt seine Unterarme nass, und das kühlt beim Trocknen.
- Quelle: Tierpark Hellabrunn, Red Kangaroo („rests or sleeps in the shade during the heat of the day“; „cool down by licking its forearms“): https://hellabrunn.de/en/animals/australia/red-kangaroo
- Quelle: CSIRO 2024 („spit bath“, keine Schweißdrüsen): https://www.csiro.au/en/news/all/articles/2024/january/how-to-stay-cool-aussie-animal-style

**Futter:** Das Rote Riesenkänguru frisst vor allem abends und nachts, wenn es kühler ist. Ist es lange trocken, holt es sich Wasser aus Gräsern und Blättern.
- Quelle: Taronga (Quelle der Karte; „During drought, kangaroos can obtain their hydration through eating grasses and foliage“): https://www.taronga.org.au/wildlife-and-conservation/animals/detail/red-kangaroo
- ⚠ Quelle: Hellabrunn („most active in the cool of the evening, at night and dawn“): Link oben.

**Hinweise:**
- Hellabrunn sagt „aktiv“, nicht wörtlich „frisst“. Bitte prüfen, ob „frisst“ so stehen darf.
- „federn wie Gummibänder“ ist eine Vereinfachung für die Sehnen.
- Die Taronga-Seite selbst nennt weder Sehnen noch Schatten.

## 5. animal-koala – Koala

**Heute:**
- Hinweis: „Ich lebe in Eukalyptuswäldern Australiens und fresse hauptsächlich ihre Blätter. Kräftige Hände halten mich an Ästen fest; ich ruhe viel in Bäumen.“
- Zuhause: „Wald“, die Auflösung heute: „Koala: Wald“
- Futter: „Eukalyptusblätter“, die Auflösung heute: „Sie fressen hauptsächlich Eukalyptusblätter.“

**Tierdetektiv:** Der Koala bekommt aus Eukalyptusblättern wenig Energie. Darum spart er Kraft: Er schläft und döst den größten Teil des Tages.
- Quelle: San Diego Zoo, Koala (Quelle der Karte; „To conserve energy, koalas sleep 18 to 22 hours a day“; „don’t get many calories from their diet“): https://animals.sandiegozoo.org/animals/koala

**Zuhause:** Der Koala findet im Eukalyptuswald Futter und Schlafplatz am selben Ort. Mit scharfen Krallen hält er sich an der Rinde fest.
- Quelle: San Diego Zoo („sharp claws to dig into bark“): Link oben.

**Futter:** Der Koala frisst Blätter, die für die meisten Pflanzenfresser giftig sind. Mit seinen Backenzähnen zermahlt er die zähen Eukalyptusblätter. Er sucht sich Lieblingssorten aus.
- Quelle: San Diego Zoo („Most herbivores can’t tolerate eucalypts“; „grind the tough eucalypt leaves with their cheek teeth“; „select their favorite varieties“): Link oben.

**Hinweise:**
- Ohne Stundenzahl, weil die Quelle zwei Werte nennt (18 bis 22 und „as much as 20“).
- Die beiden „Daumen“ stehen schon im „Schon gewusst?“ der Karte, darum habe ich sie weggelassen.

## 6. animal-jaguar – Jaguar

**Heute:**
- Hinweis: „Ich lebe in Mittel- und Südamerika, zum Beispiel im Amazonasgebiet. Ich kann gut klettern und schwimmen. Mein Fell trägt ein eigenes Fleckenmuster.“
- Zuhause: „Regenwald“, die Auflösung heute: „Jaguar: Regenwald“
- Futter: „Fleisch“, die Auflösung heute: „Sie fressen viele verschiedene Tiere, zum Beispiel Hirsche, Tapire und Gürteltiere.“

**Tierdetektiv:** Der Jaguar ist mit seinen Flecken gut getarnt. Sie verwischen seinen Umriss, so sieht ihn die Beute zwischen den Blättern kaum. Viele Flecken sind Ringe mit einem Punkt darin.
- Quelle: San Diego Zoo, Jaguar (Quelle der Karte; „rosettes … often a spot in the center“; „helps them hide from their prey, breaking up their outline in forests“): https://animals.sandiegozoo.org/animals/jaguar

**Zuhause:** Der Jaguar lebt meist nah am Wasser, zum Beispiel an Flüssen im Regenwald. Er badet gern und ist ein starker Schwimmer. Viele seiner Beutetiere leben auch am Wasser.
- Quelle: San Diego Zoo („typically live near water and have a taste for aquatic creatures“; „enjoy a good dip and are strong swimmers“): Link oben.

**Futter:** Der Jaguar schleicht sich nachts an und überfällt seine Beute aus dem Versteck. Seine Kiefer sind so kräftig, dass er sogar harte Panzer durchbeißt.
- Quelle: San Diego Zoo („stalk and ambush their ground-dwelling prey at night“; „large jaw muscles … eat … hard-shelled reptiles“): Link oben.
- Quelle: WWF Schweiz (Quelle der Karte): https://www.wwf.ch/de/tierarten/jaguar-der-im-fliegen-jagt

**Hinweise:**
- „harte Panzer durchbeißt“ ⚠: San Diego Zoo sagt „eat hard-shelled reptiles“ und „piercing the skull“. Bitte prüfen, ob „durchbeißt“ trägt.
- „Schildkröten“ und „Kaimane“ habe ich weggelassen, damit kein Tiername aus dem Spiel fällt.

## 7. animal-honey-bee – Westliche Honigbiene

**Heute:**
- Hinweis: „Wir leben mit einer Königin, Arbeiterinnen und männlichen Drohnen zusammen. Wenn wir Blüten besuchen, tragen wir Pollen weiter.“
- Zuhause: „Wiesen & Gärten“, die Auflösung heute: „Westliche Honigbiene: Wiesen & Gärten“
- Futter: „Nektar und Pollen“, die Auflösung heute: „Erwachsene Bienen fressen Nektar und Pollen.“

**Tierdetektiv:** Die Westliche Honigbiene hat einen Körper voller feiner Haare. Daran bleibt Pollen hängen und fällt an der nächsten Blüte ab. So kann die Pflanze Samen bilden.
- ⚠ Quelle: University of Florida IFAS, External Anatomy (verzweigte Haare halten Pollen): https://entnemdept.ufl.edu/media/entnemdeptifasufledu/honeybee/pdfs/abj-field-guide-to-beekeeping/20,-August-2015,-External-Anatomy,-low-res.pdf. Das kenne ich nur aus einem Suchergebnis.
- Quelle: NC Zoo (Quelle der Karte): https://www.nczoo.org/wildlife/animals/honey-bee

**Zuhause:** Die Westliche Honigbiene braucht viele Blüten in der Nähe ihres Nests. Auf Wiesen und in Gärten blüht vom Frühling bis zum Herbst etwas.
- Quelle: NC Zoo (sammeln Nektar und Pollen an Pflanzen): Link oben.
- Quelle: Karte, Feld „more“ („Vielfältige Blüten … helfen“).
- ⚠ „vom Frühling bis zum Herbst“ ist Alltagswissen, dafür habe ich keine eigene Quelle.

**Futter:** Die Westliche Honigbiene saugt Nektar mit ihrem Rüssel wie mit einem Strohhalm. Pollen trägt sie in Körbchen an den Hinterbeinen heim. Aus Nektar macht das Volk Honig.
- Quelle: ASU Ask a Biologist, Honey Bee Anatomy (Rüssel „straw-like mouthparts“; „pollen basket“ am Hinterbein): https://askabiologist.asu.edu/honey-bee-anatomy
- Quelle: Zoo Frankfurt (Quelle der Karte; Pollen „in den Körbchen … an den Hinterbeinen“): https://www.zoo-frankfurt.de/de/tiere-von-a-z-detailansicht/animal/tiere-von-a-z-detailansicht/honigbiene-europaeische-westliche
- Quelle: NC Zoo („produce honey to feed the colony“): Link oben.

**Hinweise:**
- Die Spielfrage lautet „in freier Natur“, die richtige Antwort ist aber „Wiesen & Gärten“. Gärten sind keine freie Natur. Laut Karte nisten wilde Völker in Baumhöhlen. Der Text überbrückt das nur über die Blüten, ohne der Antwort zu widersprechen.
- Den Schwänzeltanz habe ich weggelassen, er steht schon im „Schon gewusst?“.

## 8. animal-axolotl – Axolotl

**Heute:**
- Hinweis: „Meine federartigen äußeren Kiemen nehmen Sauerstoff aus dem Wasser auf. Meist lebe ich allein und fresse kleine Wassertiere.“
- Zuhause: „Flüsse & Seen“, die Auflösung heute: „Axolotl: Flüsse & Seen“
- Futter: „Kleine Wassertiere“, die Auflösung heute: „Sie fressen Würmer, Insekten, kleine Krebstiere und kleine Fische.“

**Tierdetektiv:** Der Axolotl behält seine Kiemen sein ganzes Leben lang. Viele seiner Verwandten verlieren sie beim Großwerden und gehen an Land. Ab und zu schnappt er aber auch Luft.
- Quelle: San Diego Zoo, Axolotl (Quelle der Karte; „Unlike other salamanders, axolotls are neotenic“; behalten „external gills“; „may pop up to the surface for a quick gulp of air“): https://animals.sandiegozoo.org/animals/axolotl
- Quelle: Toronto Zoo („permanent feathery gills“): https://www.torontozoo.com/animals/Axolotl

**Zuhause:** Der Axolotl lebt in stillen Seen und Kanälen. Er versteckt sich gern zwischen Wasserpflanzen und im Schlamm am Grund. So wird er nicht so leicht gefressen.
- Quelle: San Diego Zoo („inhabit still-water lakes“; „burrow into aquatic vegetation and mud to avoid being eaten“): Link oben.
- Quelle: Toronto Zoo („lagoons and canals of Lake Xochimilco“): Link oben.

**Futter:** Der Axolotl saugt seine Beute blitzschnell ein, wie ein Staubsauger. Manchmal schluckt er kleine Steinchen mit. Die helfen im Magen beim Zerkleinern.
- Quelle: San Diego Zoo („Using a suction technique“; verschluckter Kies hilft, das Futter im Magen zu zerkleinern): Link oben.

**Hinweise:**
- Die Antwort „Flüsse & Seen“ passt nur halb, denn der Axolotl lebt in stillen Seen und Kanälen, nicht in Flüssen. Der Text widerspricht der Kategorie nicht.
- Die Quellen widersprechen sich bei der Tageszeit: Toronto sagt „usually active during the day“, San Diego „during the day they burrow“. Darum steht im Text kein „tagsüber“.
- „Salamander“ habe ich weggelassen, das ist ein Kurzname der Feuersalamander-Karte.
- „blitzschnell“ ⚠: Die Quelle sagt nur „suction technique“.

## 9. animal-whale-shark – Walhai

**Heute:**
- Hinweis: „Ich bin der größte lebende Fisch und atme mit Kiemen. Mein großes Maul sammelt winzige Nahrungsteilchen; mein Körper trägt helle Flecken.“
- Zuhause: „Ozean“, die Auflösung heute: „Walhai: Ozean“
- Futter: „Kleine Tiere im Plankton“, die Auflösung heute: dieselben Worte

**Tierdetektiv:** Der Walhai bewegt seine Schwanzflosse von links nach rechts, wie andere Haie. Wale schlagen ihre Schwanzflosse auf und ab. So kannst du die beiden unterscheiden.
- ⚠ Quelle: National Geographic, Whale myths debunked (Walhaie „are actually a true shark“; der Schwanz eines Wals bewegt sich auf und ab, der eines Hais zur Seite): https://www.nationalgeographic.com/animals/article/whales-dont-spray-water-from-their-blowholes-and-other-myths-debunked
- ⚠ Quelle: Live Science, Tale of 2 Tails: https://www.livescience.com/59188-difference-between-shark-and-whale-tails.html
- Beide kenne ich nur aus einem Suchergebnis und habe sie nicht selbst geöffnet.

**Zuhause:** Der Walhai zieht durch warme Meere rund um die Erde. Oft kommt er in flaches Wasser, wenn es dort viel Plankton gibt. Dann schwimmt er langsam nah an der Oberfläche.
- Quelle: Georgia Aquarium (Quelle der Karte; „circumglobally in the tropical Atlantic, Pacific, and Indian Oceans“; „shallow water areas near bays … during seasonal plankton blooms“; frisst an der Oberfläche bei etwa 2 Knoten): https://www.georgiaaquarium.org/animal/whale-shark/

**Futter:** Der Walhai schwimmt mit offenem Maul und nimmt viel Wasser auf. Das Wasser strömt durch die Kiemen wieder hinaus. Winzige Tiere und Fischeier bleiben drin wie in einem Sieb.
- Quelle: Georgia Aquarium („swimming with its mouth open“; das Wasser tritt durch die Kiemen aus, die Teilchen wandern zum Schlund; „zooplankton … and fish eggs“): Link oben.

**Hinweise:**
- „Plankton“ erkläre ich im Zuhause-Text nicht, auf der Karte steht die Erklärung im Feld „more“. Möglich wäre „winzige Tiere im Wasser“, dann wäre der Text etwa 180 Zeichen lang. Das soll die `kinder-redaktion` entscheiden.
- „Wale“ ist ein Gruppenwort, kein Kartentitel.
- „Oft kommt er in flaches Wasser“: Georgia sagt „frequents“, also häufig, aber nicht immer.

## 10. animal-garden-cross-spider – Gartenkreuzspinne

**Heute:**
- Hinweis: „Ich habe acht Beine und baue ein Radnetz aus Seide. Bewegt sich ein Insekt darin, spüre ich die Erschütterung der Fäden. Helle Rückenflecken bilden oft ein Kreuz.“
- Zuhause: „Wiesen und Gärten“, die Auflösung heute: „Gartenkreuzspinne: Wiesen und Gärten“
- Futter: „Insekten“, die Auflösung heute: „Insekten“

**Tierdetektiv:** Die Gartenkreuzspinne sitzt in der Mitte ihres Netzes. Die Fäden laufen von dort nach außen wie die Speichen eines Rades. So ist sie schnell dort, wo etwas zappelt.
- Quelle: The Wildlife Trusts, Garden spider (Quelle der Karte; „They sit in the middle of the web waiting to feel the vibrations …“; „rush out“): https://www.wildlifetrusts.org/wildlife-explorer/invertebrates/spiders/garden-spider
- Das Bild mit den Speichen erklärt das Wort „Radnetz“ aus dem Hinweis.

**Zuhause:** Die Gartenkreuzspinne spannt ihr Netz zwischen Pflanzen auf, zum Beispiel in Büschen. Dort fliegen viele Insekten vorbei. Netze siehst du vor allem vom Sommer bis in den Herbst.
- Quelle: The Wildlife Trusts (Lebensräume u. a. „Towns and gardens“, „Grassland“, „Woodland“; „When to see: June to November“): Link oben.

**Futter:** Die Gartenkreuzspinne fängt fliegende Insekten mit klebrigen Fäden. Zappelt eines, eilt sie hin und wickelt es fest in Seide ein. So kann es sich nicht mehr bewegen.
- Quelle: The Wildlife Trusts („sticky threads“; „wrap their prey tightly in silk to stop them from moving“): Link oben.

**Hinweise:**
- „zum Beispiel in Büschen“ ⚠: Der Ort steht nicht wörtlich in der Quelle, er ist allgemeines Wissen.
- Weggelassen habe ich „sie frisst ihr altes Netz“: Belegt ist das nur in Zeitschriften und älterer Fachliteratur, nicht in einer Quelle der Karte.
- Weggelassen habe ich auch „sieht schlecht“, dafür habe ich keine Quelle.

## 11. animal-dromedary – Dromedar

**Heute:**
- Hinweis: „Im Höcker speichere ich Fett als Energievorrat, kein Wasser. Breite gepolsterte Füße helfen mir auf Sand.“
- Zuhause: „Wüste“, die Auflösung heute: „Dromedar: Wüste“
- Futter: „Gräser und andere Pflanzen“, die Auflösung heute: dieselben Worte

**Tierdetektiv:** Das Dromedar lebt vom Fett im Höcker, wenn es wenig Futter findet. Dann wird der Höcker kleiner und kippt zur Seite. Ist wieder genug Futter da, wächst er nach.
- Quelle: San Diego Zoo, Camel (Quelle der Karte; „When food is scarce, the camel’s body uses the fat stored in the hump, causing the hump to lean over and droop“; „size of the hump can change, depending on the amount of food“): https://animals.sandiegozoo.org/animals/camel

**Zuhause:** Das Dromedar kommt eine Woche oder länger ohne Trinken aus. Findet es Wasser, trinkt es in wenigen Minuten sehr viel. Bei Sandsturm verschließt es seine Nasenlöcher.
- Quelle: San Diego Zoo („can go a week or more without water“; „close their nostrils to keep sand out“): Link oben.
- Quelle: Animal Diversity Web (Quelle der Karte; „drinking 100 L of water in just 10 minutes“; Nasenlöcher beim Sandsturm): https://animaldiversity.org/accounts/Camelus_dromedarius/

**Futter:** Das Dromedar frisst auch dornige, trockene und salzige Pflanzen. Seine Lippen sind zäh und beweglich. Mit der gespaltenen Oberlippe greift es Gras dicht am Boden.
- Quelle: Animal Diversity Web („thorny plants, dry grasses and saltbush“): Link oben.
- Quelle: San Diego Zoo („split upper lip … eating short grass“; „tough but flexible lips … thorns or salty plants“): Link oben.

**Hinweise:**
- Die Seite von San Diego Zoo gilt für Kamele allgemein, also Dromedar und Trampeltier. ⚠ Bitte prüfen, ob „eine Woche oder länger“ fürs Dromedar trägt.
- Die Spielfrage „in freier Natur“ passt schlecht zu einem Haustier. Wilde Dromedare gibt es nicht mehr, verwilderte leben in Australien (Feld „more“ der Karte).

## 12. animal-white-tailed-eagle – Seeadler

**Heute:**
- Hinweis: „Ich bin ein großer Greifvogel und gleite mit breiten Flügeln über Gewässern. Erst als erwachsenes Tier habe ich weiße Schwanzfedern.“
- Zuhause: „Küsten und Seen“, die Auflösung heute: „Seeadler: Küsten und Seen“
- Futter: „Fische, Vögel und auch tote Tiere“, die Auflösung heute: dieselben Worte

**Tierdetektiv:** Der Seeadler gehört zu den größten Adlern Europas. Junge Seeadler haben einen dunklen Schnabel. Bei erwachsenen Tieren ist er kräftig gelb.
- Quelle: NABU, Seeadler (Quelle der Karte; „Seeadlerweibchen sind … die größten europäischen Adler“; „Je gelber der Schnabel und je reiner weiß der Schwanz sind, desto älter ist der Vogel“): https://www.nabu.de/tiere-und-pflanzen/voegel/portraets/seeadler/
- Quelle: Nationalpark Donau-Auen (Quelle der Karte; erwachsen „deutlich gelb“, jung noch schwarz): https://www.donauauen.at/aktuelles/blog/seeadler-in-den-donau-auen-beobachten

**Zuhause:** Der Seeadler braucht fischreiches Wasser in der Nähe. Sein Nest baut er auf alten, stabilen Bäumen. Im nächsten Frühjahr nutzt er das riesige Nest oft wieder.
- Quelle: NABU („Zur Nahrungssuche benötigt er Küsten, große Seen oder Flüsse in der Nähe“; Horst in „Wäldern mit alten, stabilen Bäumen oder an Klippen“; „riesigen Horste aus dem Vorjahr“ werden wieder genutzt): Link oben.

**Futter:** Der Seeadler späht nach Fischen dicht unter der Wasseroberfläche. Dann packt er sie mit den Krallen. Oft frisst er auch tote Tiere oder jagt anderen Vögeln die Beute ab.
- Quelle: NABU („silbrigen Blitzen oder Schatten direkt unter der Wasseroberfläche“; Aas): Link oben.
- Quelle: Donau-Auen („Oft wählen sie den einfacheren Weg und ernähren sich von Aas“; Kormorane als „Diebstahlopfer“): Link oben.

**Hinweise:**
- „Oft“ steht im zweiten Teil des Satzes auch für „jagt … ab“. Belegt ist nur „gern“, also kein Widerspruch.
- „Krallen“ ist das Kinderwort für „Fänge“.

---

## Übergreifende Beobachtungen

1. **Lebensraum fehlt auf der Karte:** Acht der zwölf Karten (Orca bis Axolotl) haben keinen Fakt „Lebensraum“. Darum zeigt die Auflösung heute nur „Titel: Kategorie“, zum Beispiel „Koala: Wald“. Die neuen Texte ersetzen das. Walhai, Gartenkreuzspinne, Dromedar und Seeadler haben einen solchen Fakt, er ist aber nur die Kategorie. Das ist bei Futter genauso.
2. **Schwache Fallen, die mir aufgefallen sind:**
   - Walhai, Futter, Profi: Die Falle „Fleisch“ ist strittig, denn Planktontiere sind auch Tiere.
   - Gewöhnlicher Krake, Futter, Profi: Die Falle „Krill“ ist selbst ein Meerestier und damit Teil der richtigen Antwort „Meerestiere“. Ein Kind kann das zu Recht für richtig halten.
   - Westliche Honigbiene, Lebensraum: Die Profi-Fallen sind fast dieselben wie auf Entdecker (Meer, Antarktis, Riff, Gewässer). Für Profi ist das zu leicht.
   - Koala, Lebensraum, Profi: „Trockene offene Landschaften“ und „Offene Landschaften“ sind grenzwertig, weil Koalas auch in lichtem, trockenem Eukalyptus-Buschland leben. „Regenwald“ ist eher in Ordnung.
   - Jaguar, Lebensraum, Profi: „Wüste“ ist grenzwertig, weil es Jaguare am Rand von Trockengebieten gibt (Nordmexiko). Das sollte der `fakten-pruefer` ansehen.
   - Koala, Futter: „Kleine Beutetiere“ steht in beiden Fallenlisten. Das ist kein Fehler, nur doppelt.
3. **Spielfrage „in freier Natur“:** Sie passt schlecht zu „Wiesen & Gärten“ (Honigbiene, Gartenkreuzspinne) und zum Dromedar als Haustier. Vorschlag für später: eine eigene Frage oder Kategorie. Das geht nicht in diesem Schritt, weil gespeicherte Antworten betroffen sind.
4. **Axolotl „Flüsse & Seen“:** Das Tier lebt in stillen Seen und Kanälen, nicht in Flüssen. Ich empfehle, die Kategorie bei Gelegenheit genauer zu fassen, dann mit Alias, weil gespeicherte Antworten betroffen sind.
5. **Kein Widerspruch zwischen Karte und Hinweis** bei diesen zwölf gefunden. Ein kleiner Punkt: Der Koala-Hinweis „Kräftige Hände“ und die Karte „Kräftige Arme und Hände“ passen zusammen.
6. **Doppeltes zwischen den Spielen:** Robben stehen bei Orca/Tierdetektiv und Orca/Futter, Wasser bei Jaguar/Zuhause und im Jaguar-Hinweis. Weil das verschiedene Spiele sind, verrät das keine Lösung. Bitte trotzdem mit den Paketen 1, 3 und 4 abgleichen, ob die anderen Autoren das ebenso halten.
7. **Diese Quellen kenne ich nur aus Suchergebnissen:**
   - AMNH Ology (Orca-Fett, die Seite gab 403 zurück)
   - National Geographic und Live Science (Schwanzflosse)
   - Nationalpark Calanques (Krakenschnabel)
   - UF IFAS (Bienenhaare)

   Alle anderen habe ich direkt geöffnet und gelesen. Diese Quellen soll der `fakten-pruefer` bitte zuerst öffnen.

## Umformuliert
Keine. Es geht nur um die Felder für die Auflösung (`why`), nicht um Antworttexte.

## Offen
- Die Testregel für den Anfang „Artikel + Titel“ gemeinsam für alle vier Pakete festlegen.
- Walhai/Zuhause: „Plankton“ erklären oder nicht (Entscheidung der `kinder-redaktion`).
- Wo der Code die Texte ablegt, etwa als `TIER_AUFLOESUNG[id] = {detektiv, zuhause, futter}` in `app/world-game-support.mjs`, entscheidet Claude.
