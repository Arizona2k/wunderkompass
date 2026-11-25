## Kinder-Redaktion: Nachprüfung der Endfassung „Tier-Auflösungen“ (25.11.2026)

> Helferbericht (kinder-redaktion, opus/high), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

Helfer: kinder-redaktion. Ich habe nur gelesen und keine Datei geändert.

Gelesen habe ich:
- `/home/user/wunderkompass/docs/entwurf/2026-11-25-tier-aufloesung-entscheidungen.md`
- `/home/user/wunderkompass/docs/entwurf/2026-11-25-tier-aufloesung-endfassung.md`
- `/home/user/wunderkompass/docs/entwurf/2026-11-25-tier-aufloesung-endfassung-texte.md`
- meine Berichte `-kinderredaktion-a.md` und `-b.md`

Zum Abgleich habe ich außerdem gelesen:
- `app/world-game-support.mjs` (Rätsel, Rückmeldungen, Zeilen 170–230)
- `app/animal-detective-clues.json`
- Aufzug- und Licht-Karte in `app/world-catalog.json`
- `app/world-games.tsx` und `app/kern/woerter.ts`: Wie heißen Tipp und Rätsel auf der Seite?

Die Zeichenzahlen meiner Ersatztexte habe ich von Hand gezählt. Bitte mit `pruefe.mjs` nachzählen. ⚠ heißt: Das muss der `fakten-pruefer` ansehen.

### Gesamteindruck: gut

Meine früheren Muss- und Soll-Befunde sind fast alle umgesetzt. Die Abweichungen in Abschnitt 5 sind gut begründet, und ich nehme alle 16 an. Neu sind zwei Arten von Fehlern:
- ein Grammatikfehler beim Kraken;
- mehrere fast gleiche Wendungen bei verschiedenen Tieren im selben Spiel (Grundsatz 6). Einige sind erst durch die Umbauten entstanden. Das Prüfskript des Autors sucht nur gleiche Folgen aus 5 Wörtern und findet sie darum nicht.

---

## Muss

**M1. Krake, Tierdetektiv: Grammatikfehler**
- Satz: „Bei Gefahr spritzt er Tinte, die verwirrt seine Feinde.“
- Problem: Im Nebensatz steht das Verb nicht am Ende. Kinder, die gerade lesen lernen, sollen keinen falschen Satzbau sehen.
- Ersatz: „Der Krake hat drei Herzen. Sein Blut ist blau und nicht rot. Bei Gefahr spritzt er Tinte. Die verwirrt seine Feinde.“

**M2. Seepferdchen und Meeresschildkröte, Futter: wörtlich derselbe Satz (Grundsatz 6)**
- Sätze: „Das Seepferdchen hat keine Zähne.“ und „Die Grüne Meeresschildkröte hat keine Zähne.“
- Problem: Ein Satz, zwei Tiere. Dazu kommen beim Kurzschnabeligel („Zähne hat er keine“) und beim Schnabeltier („Statt Zähnen …“) zwei weitere Texte im selben Spiel, die vom Fehlen der Zähne erzählen.
- Ersatz beim Seepferdchen (der Text ist neu, die Schildkröte bleibt): „Das Seepferdchen wartet still, bis ein winziges Krebstier vorbeischwimmt. Dann saugt es die Beute blitzschnell ein, wie mit einem Strohhalm.“ (etwa 135 Zeichen)

**M3. Bengaltiger und Löwe, Futter: fast dieselbe Wendung (Grundsatz 6)**
- Sätze: Tiger „Der Bengaltiger jagt oft in der Dämmerung oder nachts.“ und Löwe „Meist jagen die Weibchen, oft nachts oder in der Dämmerung.“
- Problem: Die Wendung ist dieselbe, nur umgestellt. Beim Tiger ist sie erst durch die Änderung nach Fakten A S5 entstanden.
- Ersatz beim Tiger: „Der Bengaltiger jagt gern Hirsche und Wildschweine. Ein großes Beutetier zieht er danach in ein Versteck. Davon frisst er dann mehrere Tage lang.“ (etwa 150)
- ⚠ Die Beutetiere müssen belegt sein, zum Beispiel im WWF-Artenlexikon. Fehlt der Beleg, als Satz 1: „Der Bengaltiger jagt meist allein.“

**M4. Großer Tümmler und Gepard, Tierdetektiv: „finden sich wieder“ (Grundsatz 6 und 5)**
- Sätze: Tümmler „So finden sich Tiere wieder, wenn die Gruppe getrennt war.“ und Gepard „Mit Zirpen finden sich Mutter und Junge wieder.“
- Problem 1: Das ist dieselbe Wendung im selben Spiel.
- Problem 2: Der Tümmler-Satz wiederholt außerdem den Rätselsatz „Meine Gruppe kann sich trennen und später neu zusammenfinden“.
- Ersatz: „Der Große Tümmler ist ein Delfin. Jedes Tier hat einen eigenen Pfiff, fast wie einen Namen.“ (etwa 92)
- Zwei Sätze reichen, das Aha steckt im Namen. Wer einen dritten Satz will, braucht einen Beleg (⚠), zum Beispiel: „Seinen Pfiff entwickelt es schon als Junges.“

**M5. Chamäleon und Papageitaucher, Zuhause: gleicher Satzbau (Grundsatz 6)**
- Sätze: Chamäleon „Zum Schlafen kehrt es oft in denselben Baum zurück.“ und Papageitaucher „… kehrt zum Brüten oft in dieselbe Erdhöhle zurück.“
- Problem: Beide Texte sind neu, beide nutzen „kehrt … oft in dieselbe(n) … zurück“. Beim Papageitaucher ist das der Kern, beim Chamäleon nur ein Nebensatz.
- Ersatz beim Chamäleon: „Das Chamäleon sitzt meist in Büschen und Bäumen. Zum Eierlegen klettert das Weibchen herunter und gräbt tiefe Gänge in die Erde.“ (etwa 130; „klettert herunter“ ist eine kleine Folgerung aus der Quelle)

---

## Soll

**S1. Rotfuchs und Gepard, Tierdetektiv: Der Schwanz lenkt zweimal**
- Sätze: Gepard „Der Gepard lenkt beim Rennen mit seinem langen Schwanz.“ und Rotfuchs „Der Rotfuchs steuert seinen Sprung mit dem buschigen Schwanz.“
- Problem: Dieselbe Tatsache bei zwei Tieren im selben Spiel. Das kam durch meine beiden eigenen Vorschläge (KR A Gepard, KR B S4), das war mein Fehler.
- Ersatz beim Rotfuchs: „Der Rotfuchs taucht in tiefen Schnee kopfüber ein, fast wie beim Kopfsprung. Nachts wärmt ihn sein buschiger Schwanz wie eine Decke.“ (etwa 135)

**S2. Grasfrosch und Bengaltiger, Tierdetektiv: „im Gras“ versteckt**
- Sätze: Grasfrosch „So ist er im Gras gut versteckt.“ und Tiger „… mit seinen Streifen im hohen Gras schwer zu sehen.“
- Problem: Der Grasfrosch-Text ist neu.
- Ersatz: „Der Grasfrosch kann seine Hautfarbe ein wenig an die Umgebung anpassen. Durch seine feuchte Haut kann er sogar atmen.“ (etwa 117)

**S3. Jaguar und Bengaltiger, Tierdetektiv: gleicher Satzrahmen bei zwei Großkatzen**
- Sätze: „Der Jaguar ist mit seinen Flecken gut getarnt.“ und „Der Bengaltiger ist mit seinen Streifen im hohen Gras schwer zu sehen.“
- Problem: Beim Okapi steht dazu „Im Wechsel von Licht und Schatten fällt es kaum auf“, und beim Jaguar heißt es „Zwischen Blättern und Schatten“.
- Ersatz beim Jaguar: „Der Jaguar hat besondere Flecken: Viele sind Ringe mit einem Punkt darin. Zwischen den Blättern sieht ihn seine Beute kaum.“ (etwa 125)

**S4. Grasfrosch und Axolotl, Zuhause: „versteckt sich gern“ und „Schlamm am Grund“**
- Sätze: Grasfrosch „versteckt sich gern im feuchten Gras … im Schlamm am Teichgrund“ und Axolotl „versteckt sich gern zwischen Wasserpflanzen und im Schlamm am Grund“.
- Ersatz beim Grasfrosch: „Der Grasfrosch lebt gern im feuchten Gras, dort findet er auch Futter. Den Winter verbringt er oft ganz unten im Teich.“ (etwa 118)

**S5. Elefant und Känguru, Zuhause: „Grasland, heiß und trocken“**
- Sätze: Elefant „lebt oft in weitem Grasland … Dort ist es meist heiß und trocken.“ und Känguru „lebt in trockenem Grasland, wo es oft sehr heiß ist.“
- Problem: Der Elefanten-Satz 2 ist laut Autor auch nicht wörtlich belegt.
- Ersatz beim Elefanten: „Der Afrikanische Savannenelefant lebt oft in weitem Grasland mit einzelnen Bäumen. Mit den Stoßzähnen gräbt er manchmal nach Wasser.“ (etwa 130)

**S6. Großer Panda und Orca, Zuhause: „hält ihn warm“**
- Sätze: Panda „Sein dichtes, wolliges Fell hält ihn warm.“ und Orca „Sie hält ihn warm wie eine Decke.“
- Problem: Beim Kaiserpinguin hat der Autor genau diese Dublette aufgelöst, beim Panda ist sie geblieben.
- Ersatz beim Panda, Satz 2: „Sein dichtes, wolliges Fell wärmt ihn.“ (gesamt etwa 172)

**S7. Hummer, Feuersalamander und Schnecke, Zuhause: tagsüber versteckt, nachts unterwegs**
- Diese Texte sind unverändert, gehören aber unter Grundsatz 6. Ich habe sie früher übersehen.
- Sätze: Hummer „Tagsüber bleibt er dort versteckt. Erst nachts geht er auf Futtersuche.“, Feuersalamander „Tagsüber versteckt er sich unter Holz und Steinen. Nachts und bei Regen kommt er heraus.“, Schnecke „ruht tagsüber gern unter Steinen“.
- Ersatz Hummer: „Der Hummer wohnt in Felsspalten und selbst gegrabenen Löchern zwischen Steinen. Erst wenn es dunkel wird, geht er auf Futtersuche.“ (etwa 132)
- Ersatz Schnecke, Satz 1: „Die Schnecke ruht gern an feuchten Plätzen, zum Beispiel im Kompost.“ (⚠ NHM nennt Kompost)

**S8. Erdmännchen, Zuhause: „sie“ ist doppeldeutig, und „Bauen“ klingt wie ein Verb**
- Satz: „Erdmännchen wohnen in Bauen mit vielen Gängen. Oft hat sie ein anderes Tier gegraben.“
- Problem 1: Ein Kind liest „Oft hat sie …“ so, dass die Erdmännchen das Subjekt sind.
- Problem 2: Vorgelesen klingt „in Bauen“ wie das Verb „bauen“. Beim Schnabeltier wurde „Baue“ schon durch „Höhlen“ ersetzt.
- Ersatz: „Erdmännchen wohnen in Höhlen mit vielen Gängen unter der Erde. Oft hat ein anderes Tier die Gänge gegraben. Dunkle Augenflecken wirken wie eine Sonnenbrille.“ (etwa 158)

**S9. Löwe, Tierdetektiv: Die Logik stimmt nicht**
- Satz: „Der Löwe ist gut zu erkennen: Meist haben nur Männchen eine Mähne.“
- Problem: Dass nur die Männchen eine Mähne haben, macht die Weibchen gerade nicht gut erkennbar.
- Ersatz, Satz 1: „Der Löwe trägt eine Mähne, aber meist nur als Männchen.“ (gesamt etwa 155)

**S10. Koala, Zuhause: „weiter außen“**
- Satz: „An kühlen Tagen sitzt er weiter außen in der Sonne.“
- Problem: Außen wovon? Die Quelle sagt „farther away from the trunk“.
- Ersatz: „An kühlen Tagen sitzt er weiter weg vom Stamm, in der Sonne.“ (gesamt etwa 171)

**S11. Teil D, Tierdetektiv: „im Hinweis“ besser als „im Rätsel“**
- Satz: „Passt dein Tier zu jedem Satz im Hinweis?“
- Problem: Im Personenspiel passt „Hinweis“, weil dort die Frage selbst „Wer passt zu diesem Hinweis?“ lautet. Im Tierdetektiv beginnt die Frage mit „Wer bin ich?“, und der Hilfeknopf heißt „Brauchst du einen Tipp?“. Ein Kind kann „Hinweis“ mit dem Tipp verwechseln.
- Ersatz: „Passt dein Tier zu jedem Satz im Rätsel?“
- Regel: Jedes Spiel nimmt das Wort, das in seiner eigenen Frage steht.

**S12. Licht, `more[0]` und `stages[2]`: „ein dünnes Stück Kohle“**
- Problem: Bei „Stück Kohle“ denken Kinder an einen Brocken Grillkohle. Die Variante von Fakten A ist genauer und genauso anschaulich.
- Ersatz, Satz 3: „Darin glühte ein dünner Stab aus Kohle.“

**S13. Licht: drei Wörter für dasselbe Teil**
- Problem: In `stages[3]` heißt das Teil neu „Glühfaden“. Im Bauplan (`parts[1].name`) steht weiter „Glühdraht“, in `surprise` „glühend heißen Draht“. Das Kind sieht im Modell ein anderes Wort als im Spiel „Früher oder heute?“.
- Ersatz:
  - `parts[1].name` „Glühfaden“
  - `parts[1].description` „Wird bei der klassischen Glühlampe heiß und leuchtet.“ (bleibt)
  - `surprise` „Heutige LED-Lampen leuchten ganz ohne glühend heißen Faden.“
- Bitte prüfen, ob der Bauplan „lamp“ die Beschriftung im Code selbst trägt (siehe Unsicher).

**S14. Aal, Rätsel: „Forschende glauben“ (Grundsatz 9)**
- Fundstelle: `app/animal-detective-clues.json`, Aal, Feld `clue`.
- Ersatz: „Forscher glauben: Ich schlüpfe weit draußen im Atlantik, in der Sargassosee. …“ (der Rest bleibt). Tests, die den Rätseltext lesen, mitprüfen.

---

## Kann

- **Kaiserpinguin, Zuhause:** „eisige Kälte … eiskalten Meer“. Beim Walross steht im selben Spiel auch „eiskalten Wasser“. Satz 3: „Sein Futter holt er sich aus dem Meer.“
- **Walross, Zuhause (Ehrlichkeit):** „…blass, weil weniger Blut hindurchfließt“ ist laut Quelle eine Vermutung. Ersatz: „Das Walross wird im eiskalten Wasser ganz blass. An Land in der Wärme wird es wieder rosa. Forscher vermuten: So verliert es im Wasser weniger Wärme.“ (etwa 150; Entscheidung beim `fakten-pruefer`)
- **Strauß und Okapi, Zuhause:** „entdeckt er Gefahr darum früh“ und „So merkt es früh, wenn …“. Ersatz beim Strauß: „Der Strauß hat große Augen und einen langen Hals. Damit sieht er über das offene Land sehr weit. Er lebt in Gruppen, das macht ihn sicherer.“
- **Katta, Zuhause:** Bei „Anders als viele Verwandte“ denken Kinder an die Familie. Ersatz: „Viele seiner Verwandten leben fast nur in Bäumen. Der Katta ist oft am Boden unterwegs.“ Davor bleibt Satz 1. Bitte nachzählen.
- **Echter Clownfisch, Zuhause:** „Dort trauen sich Feinde nicht heran.“ Ohne den Detektiv-Text fehlt das Warum. Ersatz: „Ihre Fangarme halten Feinde fern.“ (ohne „brennend“, so bleibt Stufen 1-S2 gewahrt)
- **Aufzug, `paragraphs[0]`:** Bei „Das macht dem Antrieb die Arbeit leichter.“ ist „Das“ unscharf. Ersatz: „Das Gegengewicht erleichtert dem Antrieb die Arbeit.“
- **Aufzug, `wrongReasons[2]`:** „so viel wie die Kabine und ein paar Fahrgäste“ ist ein anderes Bild als „halb voll“ im Absatz. Ersatz für Satz 1: „Das Gegengewicht wiegt so viel wie die halb volle Kabine.“
- **Licht, `stages[2]`:** Der Satz „In den USA bauten Thomas Edison und sein Team bessere Lampen und ein Kraftwerk.“ hat 14 Wörter, und „bessere“ bleibt ungenau. Ersatz: „In den USA bauten Thomas Edison und sein Team Lampen, die länger hielten. Dazu bauten sie ein Kraftwerk.“ (⚠ NPS)
- **Licht, `question.why`:** Ja, gleichziehen. Der alte Satz mit „Stromversorgung“ wiederholt außerdem `paragraphs` und `more`. Ersatz: „Elektrische Energie sollte einen Raum zuverlässig beleuchten. Viele Menschen arbeiteten daran, zum Beispiel Joseph Swan und Thomas Edison.“
- **Seeadler, Zuhause** (unverändert): Das Nest wird „oft wieder“ genutzt. Damit gibt es im selben Spiel drei Texte über Ortstreue (mit Papageitaucher und, vor M5, Chamäleon). Nach M5 ist das tragbar.
- **Wirbellos-Formel:** siehe unten, Frage 1.

---

## Offene Frage 1: Grundsatz 2 gegen Grundsatz 6 (wirbellos-Formel 4-mal im Futter-Spiel)

**Empfehlung: Die Formel bleibt wörtlich in allen vier Texten. In der Entscheidungsdatei als ausdrückliche Ausnahme zu Grundsatz 6 festhalten.**

Gründe:
1. Grundsatz 6 zielt auf Beschreibungen und Vergleiche, die wie abgeschrieben klingen (Strohhalm, Staubsauger). Die Formel ist etwas anderes: Sie erklärt ein Wort aus der Antwort, die das Kind gerade angetippt hat. Eine Worterklärung soll immer gleich lauten, wie ein Merksatz. Drei Fassungen hätten Kinder glauben lassen, es seien drei Dinge (mein früherer Befund B-M1).
2. Kinder hören die Formel selten doppelt. Eine Runde hat 5 (Entdecker) oder 8 (Profi) von 48 Tieren. Nach meiner Rechnung kommen zwei der vier Tiere in etwa 1 von 20 Entdecker-Runden und etwa 1 von 8 Profi-Runden zusammen.
3. Die Sätze um die Formel herum sind verschieden (Saugen, Milch, langsames Verfolgen, Schere). Die Texte klingen darum nicht gleich.

Vorschlag für die Ausnahme: „Feste Worterklärungen für ein Wort aus der richtigen Antwort gelten nicht als Dublette.“ So meldet auch das Zählskript sie nicht mehr.

Kann: Viele Fünf- bis Sechsjährige kennen „Wirbelsäule“ nicht sicher. Eine Fassung zum Fühlen am eigenen Körper wäre „Solche Tiere haben keine Wirbelsäule wie du: Sie sind wirbellos.“ (10 Wörter, je Text das einzige „du“). Das ändert die beschlossene Formel. Darum nur alle vier zusammen und nur, wenn der `fakten-pruefer` zustimmt.

## Offene Frage 2: „Deine Wahl“ gegen „Deine Antwort“ (Teil D)

**Empfehlung: vereinheitlichen. Als Hauptwort immer „Antwort“, für die festen Sätze das Verb „gewählt“, wie überall sonst im Spiel.**

Gründe:
- Im Spiel „Tier & Lebensraum“ kommen beide Satzarten vor, das Kind sähe also beide Wörter abwechselnd.
- „Deine Wahl ist eine trockene Wüste“ ist schief, denn eine Wahl ist keine Wüste. „Deine Antwort ist eine Wüste“ wäre genauso schief.
- „Du hast … gewählt“ steht schon bei Personen, Technik, Tierdetektiv und „Früher oder heute?“. Auch die alten festen Sätze waren so gebaut.

Ersatztexte:
- Wüste: „Du hast eine trockene Wüste gewählt. Dort gibt es kaum Wasser. Wie wichtig ist Wasser für dieses Tier?“
- Baumkronen: „Du hast einen Platz hoch oben in den Bäumen gewählt. Kommt dieses Tier dort hinauf?“
- Korallenriff: „Du hast ein warmes Korallenriff gewählt. Das liegt ganz unter Wasser. Lebt dieses Tier dort?“
- Meereis: „Du hast Meereis ganz im Süden der Erde gewählt. Lebt dieses Tier dort?“
- Fallensatz bleibt: „Deine Antwort passt zu einem anderen Tier: … Gesucht ist aber: … “

Prüfen, ob Tests den Wortlaut der festen Sätze lesen.

---

## Was in Ordnung ist

- **Meine früheren Muss-Befunde sind alle umgesetzt:** Walhai „winziges Futter“, Panda „schläft im Winter nicht durch“, Benz-`intro` ohne Einschub mit Karl in `more[0]`, Aufzug-`wrongReasons[2]` mit Warum und richtigem Bezug.
- **Fast alle Soll-Befunde sind umgesetzt:** „Wenn“-Sätze, Zahlen mit Bild, „Feinde“, „Forscher“, Zuhause/Futter, „zu allem in der Aufgabe“, Sonderform für den Monarchfalter, Südpol-Satz.
- **Abschnitt 5:** Alle 16 Abweichungen sind gut begründet, ich nehme sie an. Besonders gut sind diese neuen Inhalte:
  - Panda (Tafel Schokolade)
  - Hummer (blau, rot erst beim Kochen)
  - Aal (Gelbaal, silbern)
  - Seepferdchen (Vater)
  - Biene (Klimaanlage)
  - Strauß (zwei Zehen)
- **Aufzug:** Die Abweichungen in `paragraphs[0]` und `wrongReasons[2]`, die verhindern, dass derselbe Satz dreimal steht, sind richtig. Absatz, Beschreibung und Rückmeldung klingen jetzt verschieden.
- **Satzlänge:** Kein Satz über 13 Wörter in den geänderten Tiertexten. Die Wenn-Sätze sind sauber (Gorilla, Känguru, Eisbär, Sepia, Dromedar, Schnecke).
- **Fachwörter sind im Satz erklärt:** Larven, Silberrücken, Zooplankton, Gewölle, Nektar, Pollen („also Blütenstaub“), Lichtungen. Neue schwere Wörter gibt es nicht.
- **Ton:** warm, ehrlich, ohne Angstmache. Gut sind „Forscher vermuten“ (Giraffe), „Vielleicht“ (Okapi) und „Oft sieht es aus, als …“ (Waschbär). Das Eisbär-Fasten und die Larven, die gefressen werden, stehen ruhig da, ohne Drama.
- **Mitmach-Tipps:** zwei von 48 (Igel, Schleiereule), beide nach der Regel.
- **Kleine Zählwörter** wie „drei Herzen“, „zwei Zehen“, „zwei große Haken“ brauchen kein Alltagsbild.
- **Teil D:** „dein Tier“ (gewählt) gegen „dieses Tier“ (gesucht) ist klar. Die Schlussfragen je Stufe beim Futter passen: Entdecker einfach, Profi mit Größe und Ort. „Deine Antwort passt zu einem anderen Tier:“ liest sich flüssig, und der Technik-Satz ist kurz und klar.

## Unsicher

- Ob der Bauplan „lamp“ die Beschriftung „Glühdraht“ fest im Code hat oder aus `parts` liest (S13), habe ich nicht geprüft.
- **Für den `stufen-pruefer`:** Im Spiel „Früher oder heute?“ verrät die Zeitform die Lösung („wurde … leuchtete“ gegen „erzeugen … brauchen“). Das gab es schon vor dieser Änderung, vermutlich bei allen Aufgaben dieses Spiels.
- **Für den `stufen-pruefer`:** Seepferdchen, Zuhause: „hält es sich darum gut fest“ liegt nah am Rätsel („Greifschwanz … festhalten“), allerdings ohne Schwanz.
- Den Wortlaut der Hinweise in den Spielen Futter und Zuhause habe ich nicht gelesen, nur die Detektiv-Rätsel.
- Vorgelesen klingt der Titel „Karl (Carl) Benz“ wie „Karl Karl Benz“. Das bleibt bis Schritt 2 (Kartennamen).
- ⚠-Stellen in meinen Ersatztexten: Tiger (Hirsche und Wildschweine), Tümmler (Pfiff schon als Junges, nur falls ein dritter Satz kommt), Schnecke (feuchte Plätze, Kompost), Chamäleon („klettert herunter“), Licht („länger hielten“).
