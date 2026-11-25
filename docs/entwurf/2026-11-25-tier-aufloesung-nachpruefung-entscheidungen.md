# Tier-Auflösungen: Entscheidungen zur Nachprüfung (25.11.2026)

Claude entscheidet über die vier Nachprüfungen der [Endfassung](2026-11-25-tier-aufloesung-endfassung.md). Die Berichte:
- [Fakten, Paket 1 und Teil C](2026-11-25-tier-aufloesung-nachpruefung-fakten-1.md) (F1)
- [Fakten, Paket 2, Teil B und D](2026-11-25-tier-aufloesung-nachpruefung-fakten-2.md) (F2)
- [Kinder-Redaktion](2026-11-25-tier-aufloesung-nachpruefung-kinderredaktion.md) (KR)
- [Stufen](2026-11-25-tier-aufloesung-nachpruefung-stufen.md) (St)

Maßstab, wie am 24.11.: Im Zweifel fliegt eine Falle raus. Zu leicht ist besser als zweideutig. Ein Text braucht für jede Aussage eine Quelle.

## 1. Fallen (`app/world-game-tier-fallen.json`)

Teil B der Endfassung gilt. Dazu kommen diese Änderungen. Ein Skript hat sie probehalber angewendet. Ergebnis: jede Liste hat mindestens 3 Fallen für Entdecker und 4 für Profi, keine doppelt, alle sind Texte anderer Tiere (wie im Test `tests/world-game-runde.test.mjs`).

| Nr. | Spiel | Tier | Änderung | Grund |
|---|---|---|---|---|
| N1 | Lebensraum | Monarchfalter | Entdecker: „Küste“ streichen | F2-M1: Die Falter überwintern an der Küste Kaliforniens. |
| N2 | Nahrung | Axolotl | Profi: „Früchte, Blätter und auch Insekten“ streichen, dafür „Pflanzen und Rinde“ | F2-M2, St-S1: Der Axolotl frisst Insekten. Das neue Paar hat F2 als sicher falsch bestätigt. |
| N3 | Nahrung | Europäischer Aal | Entdecker: „Früchte, Blätter und auch Insekten“ streichen | F2-M3, St-M1: Junge Aale fressen Insektenlarven, und die Auflösung sagt das auch. |
| N4 | Nahrung | Großer Tümmler | Profi: „Kleine Tiere im Plankton“ streichen, dafür „Als erwachsenes Tier vor allem Pflanzen“ | F2-M4: ein Unterbegriff der Antwort. Das neue Paar ist von F2 bestätigt und nach St-S2 eine gute Profi-Falle. |
| N5 | Nahrung | Orca | Profi: „Kleine wirbellose Tiere“ streichen | F2-M5: Orcas fressen Tintenfische. |
| N6 | Nahrung | Erdmännchen | Profi: „Vor allem kleine Säugetiere“ streichen, dafür „Eukalyptusblätter“ aus Entdecker | F2-M6: Erdmännchen fressen auch Nagetiere. |
| N7 | Nahrung | Schnabeltier | Profi: „Krill“ und „Kleine Tiere im Plankton“ streichen, dafür „Bambus“ aus Entdecker. Entdecker: „Algen und Zooplankton“ streichen | F2-M7, St-S1: Die Antwort heißt wie beim Axolotl „Kleine Wassertiere“. Krill ist ein kleines Wassertier. Beide Tiere werden jetzt gleich behandelt. |
| N8 | Nahrung | Afrikanischer Strauß | Entdecker: „Vor allem kleine Säugetiere“ streichen | F2-M8: Strauße fressen auch Nagetiere. |
| N9 | Nahrung | Waschbär | Entdecker und Profi: „Vor allem kleine Säugetiere“ streichen, Profi dafür „Bambus“ aus Entdecker | F2-M9 |
| N10 | Nahrung | Walhai | Entdecker: „Als erwachsenes Tier vor allem Pflanzen“ streichen | F2-S1: Forscher streiten, ob Walhaie viel Pflanzliches fressen. |
| N11 | Nahrung | Braunbrustigel, Feuersalamander | Profi: „Krill“ streichen. Igel dafür „Nektar und Pollen“ aus Entdecker, Feuersalamander „Fisch und Meerestiere“ | F2-S2: Krill ist ein kleines wirbelloses Tier, also ein Unterbegriff der Antwort. Gleiche Regel wie N7. Beim Kurzschnabeligel bleibt Krill (Antwort „Ameisen und Termiten“). |
| N12 | Nahrung | Erdmännchen | Entdecker: „Pflanzen“ streichen | F2-S3: Erdmännchen fressen auch etwas Pflanzliches. |
| N13 | Nahrung | Katta | Entdecker: „Fische, Vögel und auch tote Tiere“ und „Vor allem kleine Säugetiere“ streichen | F2-S4: In der Trockenzeit fressen Kattas auch kleine Wirbeltiere. Beim Erdmännchen wurde dieselbe Falle aus demselben Grund gestrichen. |
| N14 | Nahrung | Krake, Sepia, Aal | Die Zwischenlösung durch das bestätigte neue Paar ersetzen: Krake und Sepia „Als erwachsenes Tier vor allem Pflanzen“, Aal „Pflanzen und Rinde“ | St-S2: Diese Fallen kommen vom selben Ort (Küste, Wasser) und haben eine andere Futterart, sind also echte Profi-Fallen. F2 hat sie bestätigt. |

**Regel für Unterbegriffe**, damit es einheitlich bleibt: Eine Falle fliegt raus, wenn sie ganz in der richtigen Antwort steckt, zum Beispiel Krill in „Kleine Wassertiere“ oder „Kleine wirbellose Tiere“. Bei sehr weiten Antworten passt aber jede Tierfalle zum Teil („Kleine Tiere“, „Vor allem kleine Tiere“, „Je nach Gruppe verschiedene Beutetiere“, „Verschiedene tierische und pflanzliche Nahrung“). Dort hilft Streichen nicht, die Antwort selbst muss genauer werden. Das geht ins BACKLOG 25 (F2-S5, F2-S3).

**Nicht übernommen, mit Grund:**
- St-S1, Variante „Krill zurück beim Axolotl“: Krill ist ein kleines Wassertier. Ein Kind, das so denkt, hätte nicht falsch gedacht. Darum N7 statt dessen.
- St-S2: Bessere Fallen für Jaguar, Chamäleon, Monarchfalter und Walhai sind nur Vorschläge. Sie brauchen erst eine Faktenprüfung. Ebenso der Vorschlag, den Monarchfalter auf Profi aus „Tier & Lebensraum“ wegzulassen (dafür bräuchte es Code). Beides kommt ins BACKLOG 25. Hummer behält seine Falle, das neue Paar wäre schlechter (St-S2).
- F2-Kann „Ameisen und Termiten“ bei Axolotl, Waschbär und Aal: bleibt, F2 hält es für vertretbar.

**Was bleibt offen (BACKLOG 25, „Fallen schärfen“):**
- Bei Wassertieren ist das Futter auf Profi jetzt zu leicht. In 65 % der Runden hat nur die richtige Antwort einen Wasserbezug, vorher waren es 33 % (St-S1). N14 verbessert Krake, Sepia und Aal etwas. Zu leicht ist für den Übergang besser als zweideutig.
- Weite richtige Antworten genauer machen (F2-S5, Erdmännchen F2-S3).
- Andere Profi-Schlussfrage ausprobieren, „Wo lebt dieses Tier, und womit frisst es?“ (St-Kann 3), am besten mit dem `spieltester`.
- Entdecker-Ausnahmen Panda, Gorilla und Meeresschildkröte (St-Kann 4), Seepferdchen als kürzeste Antwort (St-Kann 6).
- Rätsel, die die Lösung verraten: Blauwal und Orang-Utan (St-Kann 7, 2-S4). Bleibt wie am 25.11. entschieden im BACKLOG, damit dieser PR überschaubar bleibt.

## 2. Texte: Nachtrag des karten-autors

Diese Texte schreibt der `karten-autor` neu, mit Quelle je Aussage. Danach prüfen `fakten-pruefer` und `kinder-redaktion` nur diese Stellen, dazu der `stufen-pruefer` T21 (Qualle). Wo ein Prüfer schon einen fertigen Satz vorschlägt, übernimmt der Autor ihn, wenn er die Regeln einhält.

**Tiere (Spiel / Text):**

| Nr. | Tier | Text | Auftrag | Aus |
|---|---|---|---|---|
| T1 | Savannenelefant | Zuhause | Satz „heiß und trocken“ streichen | KR-S5, F1-S1 |
| T2 | Großer Panda | Tierdetektiv | „rosa, blind und fast nackt“, San Diego Zoo als zweite Quelle | F1-S2 |
| T3 | Axolotl | Tierdetektiv | Satz 2: helle, fast weiße Tiere, Quelle Toronto Zoo | F1-S3 |
| T4 | Giraffe | Tierdetektiv | „Einer kann fast so lang sein wie ein langes Lineal.“ | F1-Kann |
| T5 | Kaiserpinguin | Zuhause | „mehrere Schichten“; „eisig“ nicht doppelt neben dem Walross | F1-Kann, KR-Kann |
| T6 | Bengaltiger | Zuhause | „Bei Flut stehen die Bäume dort im salzigen Wasser.“ | F1-Kann |
| T7 | Krake | Tierdetektiv | Satzbau „Tinte. Die verwirrt seine Feinde.“ | KR-M1 |
| T8 | Seepferdchen | Futter | ohne „keine Zähne“ (steht bei der Schildkröte); kein Vergleich, der im Futter-Spiel schon vorkommt (Strohhalm?) | KR-M2 |
| T9 | Bengaltiger | Futter | ohne „Dämmerung oder nachts“ (steht beim Löwen); Beutetiere nur mit Beleg | KR-M3 |
| T10 | Großer Tümmler | Tierdetektiv | ohne „finden sich wieder“ (Gepard, Rätsel) | KR-M4 |
| T11 | Chamäleon | Zuhause | ohne „kehrt … oft in denselben … zurück“ (Papageitaucher) | KR-M5 |
| T12 | Rotfuchs | Tierdetektiv | ohne Schwanz zum Lenken (Gepard) | KR-S1 |
| T13 | Grasfrosch | Tierdetektiv | ohne „im Gras versteckt“ (Tiger) | KR-S2 |
| T14 | Jaguar | Tierdetektiv | anderer Satzrahmen als der Tiger | KR-S3 |
| T15 | Grasfrosch | Zuhause | Winter: Teichgrund oder unter Holzstapeln; nicht „versteckt sich gern … Schlamm am Grund“ (Axolotl); „feuchtes Gras“ nur mit Beleg | F2-S6, KR-S4, F2-Kann |
| T16 | Großer Panda | Zuhause | nicht „hält ihn warm“ (Orca) | KR-S6 |
| T17 | Hummer, Weinbergschnecke | Zuhause | nicht dreimal „tagsüber versteckt, nachts unterwegs“ (mit Feuersalamander) | KR-S7 |
| T18 | Erdmännchen | Zuhause | „Höhlen“ statt „Bauen“, klarer Bezug | KR-S8 |
| T19 | Löwe | Tierdetektiv | Satz 1 mit stimmiger Logik | KR-S9 |
| T20 | Koala | Zuhause | „weiter weg vom Stamm“ | KR-S10 |
| T21 | Echter Clownfisch | Tierdetektiv | kein Vergleich mit einer Pflanze (Brennnessel), weil die Hauptfrage „Seeanemone ist eine Pflanze“ abbauen will; Qualle nur, wenn die Verwandtschaft belegt ist | St-S3 |
| T22 | Walross | Zuhause | Blutfluss als Vermutung („Forscher vermuten“) | F2-Kann, KR-Kann |
| T23 | Feuersalamander | Tierdetektiv | Satz 3 klar auf die Larven beziehen; „ohne große Fische“ genauer | F2-Kann, St-Kann 1 |
| T24 | Schleiereule | Tierdetektiv | „hohle Hände“ | F2-Kann |
| T25 | Weinbergschnecke | Tierdetektiv | kriecht auf dem Schleim, nicht „wie auf einer Rutsche“ | F2-Kann |
| T26 | Afrikanischer Strauß | Tierdetektiv und Zuhause | „kann kurz schneller rennen“; Zuhause nicht „entdeckt Gefahr früh“ wie das Okapi | F2-Kann, KR-Kann |
| T27 | Katta | Zuhause | nicht „Verwandte“ im Sinn von Familie | KR-Kann |
| T28 | Echter Clownfisch | Zuhause | das Warum ohne „brennend“ | KR-Kann |
| T29 | Rotfuchs | Zuhause | Satz 3 („mitten in Städten“) streichen, er steht schon in Rätsel und Hauptfrage | St-Kann 2 |
| T30 | Braunbrustigel | Tierdetektiv | wenn belegt: Herzschlag im Winterschlaf statt „Nest aus Laub“ (steht schon in Rätsel und Hauptfrage) | St-Kann 1 |

Nicht im Nachtrag: Tiger-Ohren (St-Kann 1, nur mit sicherer Quelle, sonst später), Clownfisch-Futter (St-Kann 1, für Entdecker in Ordnung), Walhai „Gern“ (F1-Kann, „Oft“ geht).

**Karten (Teil C), ebenfalls im Nachtrag, damit derselbe Prüfgang sie sieht:**
- K1 Benz `more[0]`: „Sein Patent von 1886 hat die Nummer 37435.“ (F1-Kann)
- K2 Aufzug `paragraphs[0]`, Satz 4: „Das Gegengewicht erleichtert dem Antrieb die Arbeit.“ `wrongReasons[2]`, Satz 1: „Das Gegengewicht wiegt so viel wie die halb volle Kabine.“ (F1-Kann und KR-Kann, beide gleich)
- K3 Licht `more[0]` und `stages[2]`: „Darin glühte ein dünner Stab aus Kohle.“ (KR-S12) und statt „bessere Lampen“: „In den USA bauten Thomas Edison und sein Team Lampen, die lange leuchteten. Dazu bauten sie ein Kraftwerk.“ (F1-S6 mit der Quelle „long lasting“, in zwei Sätzen wegen der Länge, KR-Kann)
- K4 Licht ein Wort für das Teil: `parts[1].name` „Glühfaden“, `surprise` „… ohne glühend heißen Faden.“ (KR-S13, F1-Kann). Der Bauplan liest die Beschriftung aus `parts` (`app/world-catalog.json`).
- K5 Licht `question.why`: gleichziehen, ohne „Stromversorgung“ (KR-Kann)

## 3. Sätze nach falscher Antwort (Teil D)

- **Feste Lebensraum-Sätze:** „Du hast … gewählt“ statt „Deine Wahl“, wie überall sonst im Spiel (KR, Offene Frage 2). Wortlaut aus dem KR-Bericht:
  - Wüste: „Du hast eine trockene Wüste gewählt. Dort gibt es kaum Wasser. Wie wichtig ist Wasser für dieses Tier?“
  - Baumkronen: „Du hast einen Platz hoch oben in den Bäumen gewählt. Kommt dieses Tier dort hinauf?“
  - Korallenriff: „Du hast ein warmes Korallenriff gewählt. Das liegt ganz unter Wasser. Lebt dieses Tier dort?“
  - Meereis: „Du hast Meereis ganz im Süden der Erde gewählt. Lebt dieses Tier dort?“
- **Fallensatz** bleibt: „Deine Antwort passt zu einem anderen Tier: … Gesucht ist aber: …“
- **Tierdetektiv:** „Passt dein Tier zu jedem Satz im Rätsel?“ (KR-S11, St-Kann 5). Regel: Jedes Spiel nimmt das Wort aus seiner eigenen Frage.
- **wirbellos-Formel:** bleibt wörtlich in allen vier Futter-Texten. Ausdrückliche Ausnahme zu Grundsatz 6: Eine feste Erklärung für ein Wort aus der richtigen Antwort gilt nicht als Dublette (KR, Offene Frage 1). Die Fassung „wie du“ kommt nicht, sie würde vier geprüfte Texte ändern, ohne dass der Nutzen klar ist.
- **Profi-Schlussfrage** bleibt „Wie groß ist dieses Tier, und wo lebt es?“. Die andere Fassung steht im BACKLOG 25 (siehe oben).

## 4. Kleinigkeiten, die Claude direkt einbaut

- Aal-Rätsel in `app/animal-detective-clues.json`: „Forscher glauben“ statt „Forschende glauben“ (KR-S14, Grundsatz 9).
- Quellen in der Textdatei der Endfassung nachtragen: Orca, Echoortung (NOAA, „Sound Strategy“; F1-S4), Krake, Krebse (Monterey Bay Aquarium; F1-S5), Papageitaucher, Lenken mit den Füßen (National Geographic Kids; F2).
- Der Titel „Karl (Carl) Benz“ klingt vorgelesen wie „Karl Karl Benz“. Das gehört zu Design-Umbau Schritt 2 (Kartennamen).
- Für den `stufen-pruefer` beim nächsten Durchgang durch „Früher oder heute?“: Die Zeitform verrät dort oft die Lösung (KR, Unsicher). Kommt ins BACKLOG.
- Ideen für Experten-Aufgaben aus St („Lücken“) kommen in die Ideen-Sammlung im BACKLOG.

## 5. Nach den Prüfungen des Nachtrags (25.11.2026, abends)

Berichte: [Fakten](2026-11-25-tier-aufloesung-nachtrag-fakten.md), [Fakten 2](2026-11-25-tier-aufloesung-nachtrag-fakten-2.md), [Kinder-Redaktion](2026-11-25-tier-aufloesung-nachtrag-kinderredaktion.md), [Stufen](2026-11-25-tier-aufloesung-nachtrag-stufen.md).

- **N15 nach Vorschlag A der Stufen-Prüfung:** „Fleisch“ als Profi-Falle nur noch beim Okapi; neu bei Honigbiene und Koala. Giraffe und Dromedar bekommen kein „Fleisch“ mehr, weil das schon ein 6-jähriges Kind ausschließt.
- **Giraffe Profi:** dafür „Krill“ (Faktenprüfung 2: sicher falsch, die Giraffe frisst Blätter und junge Triebe).
- **Biber Profi:** „Vor allem kleine Fische“ (Stufen d; Faktenprüfung: Fisch beim Biber ist ein verbreiteter Irrtum).
- **„Nektar und Pollen“ (Profi):** beim Koala und beim Dromedar gestrichen (Koalas fressen auch Blüten; beim Dromedar im Zweifel). Beim Okapi und beim Biber bleibt es, dort fand die Faktenprüfung keinen Beleg für Blüten.
- **Dromedar:** Entdecker ohne „Meerestiere“, weil die eigene Kartenquelle sagt, dass Kamele sogar Fisch fressen. Profi braucht vier Fallen, darum neu „Vor allem kleine Tiere“ (richtige Antwort des Erdmännchens, auch ein Wüstentier). Der Stufen-Prüfer sieht sich die Wahl in der letzten Runde an.
- **K3 Licht:** „Darin glühte ein dünnes Stück Kohle.“ Die Kinder-Redaktion wollte „Faden“, damit neben „Glühfaden“ kein zweites Wort steht. Swans Lampe von 1879 hatte aber einen Kohle-Stab (Science Museum Group). „Stück“ ist richtig und nennt kein zweites Bauteil. Letzter Satz nach der Faktenprüfung: „Ihr Kraftwerk in New York lieferte Strom für viele Lampen.“
- **K5 Licht:** Mischfassung „Früher brannten abends meist Kerzen, Öl- und Gaslampen. Ihr Licht kam aus Flammen. Dann bauten Erfinder wie Joseph Swan und Thomas Edison elektrische Glühlampen.“ (Faktenprüfung 2: stimmt).
- **K2 Aufzug:** `wrongReasons[2]` in der Fassung der Kinder-Redaktion („Beim Ausgleichen hilft das Gegengewicht. …“), weil sie die gewählte Antwort aufgreift.
- **Benz:** In den Verbindungen bleibt „Geld für den Motorwagen ihres Mannes Carl“. Der Satz war schon richtig (Akkusativ); „des Motorwagens“ aus der Endfassung wäre falsch gewesen.
- **Tests:** Die Satzlänge zählt nur noch bis . ! ?, nicht bis zum Doppelpunkt (Kinder-Redaktion: Wer vorliest, liest darüber hinweg). Eine Personen-Auflösung darf auch mit dem Namen in Klammern beginnen („Karl (Carl) Benz“ → „Carl Benz …“).
- **Clownfisch-Hinweise** (Stufen f und g): Der alte Hinweis schickt Kinder zur Zeile „Tiergruppe: Fische“, die zum Clownfisch gehört. Das führt in die Irre, darum kommt die Korrektur in diesen PR, nach Faktenprüfung und Kinder-Redaktion.
