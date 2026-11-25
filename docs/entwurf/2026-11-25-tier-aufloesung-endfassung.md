## Bericht karten-autor: Endfassung der Tier-Auflösungen, Kartenkorrekturen und Sätze nach falscher Antwort

> Helferbericht (karten-autor, opus/high), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

Das ist ein Entwurf. Er ist nicht geprüft. Projektdateien habe ich nicht geändert. Laut Auftrag prüfen danach `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer` die geänderten Stellen.

**Wichtig vorab:** Die 144 Texte habe ich nicht noch einmal in diesen Bericht abgetippt, damit beim Kopieren kein Fehler hineinkommt. Sie liegen genau so, wie sie gezählt wurden, im Scratchpad. Bitte gleich in `docs/entwurf/` sichern, denn der Scratchpad kann geleert werden:
- `[Einbau-Datei](2026-11-25-tier-aufloesung-endfassung.json)`: zum direkten Einbau, Form `{id:{detektiv,zuhause,futter}}`.
- `[Texte mit Quellen](2026-11-25-tier-aufloesung-endfassung-texte.md)`: alle 144 Texte, je Text mit Zeichenzahl, Änderungsmarke (welcher Befund sie auslöste) und Quelle samt URL und wörtlichem Zitat.
- Quelle der beiden Dateien: `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/end/texte.mjs`. Zählskript: `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/end/pruefe.mjs`. Fallen-Rechnung: `fallen.mjs` und `fallen2.mjs` im selben Ordner.

---

## 1. Entwurf

### Teil A: 144 Tiertexte
- **102 Texte geändert, 42 unverändert.** Die 42 unveränderten stimmen Zeichen für Zeichen mit den Paketen 1 bis 4 überein. Das hat ein Skript gegen die Paketdateien geprüft.
- Jede Änderung ist in `teilA.md` markiert, zum Beispiel „Fakten A S7“, „Stufen 1-S1“, „KR A Soll“ oder „eigener Befund Grundsatz 5“.
- **Eigene Funde nach Grundsatz 5:** Ein Satz enthielt dieselbe Tatsache wie Hinweis, Hauptfrage oder Zusatzfrage. Ich habe ihn darum neu geschrieben, auch wo kein Prüfer es verlangt hatte:
  - Löwe d (why der Hauptfrage)
  - Kaiserpinguin f (why der Hauptfrage)
  - Tümmler d (Echo)
  - Orca d (Jagd mit der Familie)
  - Känguru d („hüpft schnell“)
  - Dromedar d (Fett im Höcker)
  - Waschbär d (Tasten)
  - Clownfisch d (Streifen, „lebt zwischen den Tentakeln“)
  - Weinbergschnecke d (nachts und bei Regen)
  - Aal d („durchsichtig wie Glas“)
  - Hummer d (zwei Scheren und Häutung)
  - Chamäleon d (Füße am Zweig)
  - Grasfrosch h (Wasser und Land)
  - Igel f (Regenwürmer)
  - Giraffe d (Zahl der Halswirbel)
- **Anfang der Texte:** Tierdetektiv beginnt mit Artikel und vollem Titel. Zuhause und Futter dürfen den Kurznamen nehmen. „Erdmännchen“ steht ohne Artikel.

### Teil B: Fallen (`app/world-game-tier-fallen.json`)

**Streichen** (wie in den Entscheidungen; per Skript geprüft, alle Einträge gefunden):

| Spiel | Tier | Liste | Eintrag |
|---|---|---|---|
| Nahrung | Braunbrustigel, Grasfrosch, Kurzschnabeligel, Feuersalamander, Chamäleon, Hummer, Walhai, Blauwal | profi | „Fleisch“ |
| Nahrung | Echter Clownfisch, Afrikanischer Strauß | entdecker | „Fleisch“ |
| Nahrung | Krake, Sepia, Hummer, Seepferdchen, Aal, Papageitaucher, Großer Tümmler, Axolotl | profi | „Krill“ |
| Nahrung | Papageitaucher | profi | „Kleine Tiere im Plankton“ |
| Lebensraum | Monarchfalter | entdecker und profi | „Flüsse und Feuchtgebiete“ |
| Lebensraum | Monarchfalter | profi | „Wüste“ |
| Lebensraum | Chamäleon | entdecker | „Flussufer und Stillgewässer“ |
| Lebensraum | Chamäleon | profi | „Savanne“, „Grasland“ |
| Lebensraum | Schleiereule, Katta | entdecker | „Flussufer und Stillgewässer“ |
| Lebensraum | Jaguar | profi | „Wüste“ |
| Nahrung | Erdmännchen | profi | „Fische, Vögel und auch tote Tiere“ |

**Ersetzen:** Lebensraum, Eisbär, entdecker: „Feuchte Wälder und Larvengewässer“ wird zu „Wüste“. „Wüste“ ist der Text eines anderen Tieres.

**Auffüllen:** Danach fallen 12 Profi-Listen auf 3 Einträge (Monarchfalter Lebensraum auf 2). Bis zur Bestätigung kommt je eine geprüfte Entdecker-Falle desselben Tieres dazu. Ein Skript hat geprüft: die Falle steht in Entdecker, ist nicht schon in Profi und ist nicht die richtige Antwort.

| Spiel | Tier | Jetzt dazu (aus Entdecker) | Neues Paar, später statt dessen | Quelle für „sicher falsch“ |
|---|---|---|---|---|
| Lebensraum | Jaguar | „Korallenriffe mit Seeanemonen“ | „Küstennaher Meeresboden“ | San Diego Zoo, Jaguar, https://animals.sandiegozoo.org/animals/jaguar (Landtier nah am Wasser) |
| Lebensraum | Chamäleon | „Felsiger Meeresboden“ | „Arktische Küsten und Meere“ | ADW, https://animaldiversity.org/accounts/Chamaeleo_chamaeleon/ (Bäume und Büsche, Mittelmeerraum) |
| Lebensraum | Monarchfalter | „Ozean“, „Antarktis“ (nicht „Küste“, siehe Offen) | „Korallenriffe mit Seeanemonen“, „Arktische Küsten und Meere“ | USFWS, https://www.fws.gov/species/monarch-danaus-plexippus |
| Nahrung | Großer Tümmler | „Pflanzliches Material“ | „Als erwachsenes Tier vor allem Pflanzen“ | NOAA, https://www.fisheries.noaa.gov/species/common-bottlenose-dolphin |
| Nahrung | Krake | „Pflanzen und Rinde“ | „Als erwachsenes Tier vor allem Pflanzen“ | ADW, https://animaldiversity.org/accounts/Octopus_vulgaris/ |
| Nahrung | Axolotl | „Gräser und andere Pflanzen“ | „Pflanzen und Rinde“ | San Diego Zoo, https://animals.sandiegozoo.org/animals/axolotl |
| Nahrung | Walhai | „Nektar und Pollen“ | „Raupen: Seidenpflanzen; Falter: Nektar“ | Georgia Aquarium, https://www.georgiaaquarium.org/animal/whale-shark/ (keine Pflanzen- oder Algenfalle gewählt ⚠, weil Walhaie Algen mit aufnehmen) |
| Nahrung | Feuersalamander | „Pflanzen und Rinde“ | „Fisch und Meerestiere“ | NABU Euskirchen, https://www.nabu-euskirchen.de/2026/06/03/feuersalamander-ein-portrait/ |
| Nahrung | Grasfrosch | „Bambus“ | keins (siehe Offen) | – |
| Nahrung | Aal | „Eukalyptusblätter“ | „Pflanzen und Rinde“ | WWT, https://www.wwt.org.uk/discover-wetlands/wetland-wildlife/species-factfiles/european-eel |
| Nahrung | Hummer | „Als erwachsenes Tier vor allem Pflanzen“ | „Nektar und Pollen“ | Wildlife Trusts, https://www.wildlifetrusts.org/wildlife-explorer/marine/crustaceans/lobster |
| Nahrung | Sepia | „Gräser und andere Pflanzen“ | „Als erwachsenes Tier vor allem Pflanzen“ | MarLIN, https://www.marlin.ac.uk/species/detail/1098 |

Alle neuen Paare sind wörtlich `diet` oder `habitat` eines anderen Tieres. Keines ist doppelt in der Liste.

### Teil C: Kartenkorrekturen (fertige Feldwerte)

**Benz** (`person-karl_benz`). Der Titel „Karl (Carl) Benz“ bleibt.
- `intro`: „Carl Benz entwickelte einen Motorwagen. Dafür mussten Motor, Fahrzeug und die Übertragung des Antriebs zusammenpassen.“
- `more[0]`: „Carl Benz lebte von 1844 bis 1929. Sein Vorname wird manchmal auch Karl geschrieben. Er arbeitete in Mannheim an Motoren und an einem dafür ausgelegten Fahrzeug. Die Patentanmeldung von 1886 trug die Nummer 37435. Ein solches historisches Dokument ist etwas anderes als eine heutige Leistungs- oder Sicherheitsprüfung.“
- `aliases`: anhängen „Carl Benz“ und „Karl Benz“.
- `sources`: anhängen `{"label":"Deutsche Biographie · Benz, Carl Friedrich","url":"https://www.deutsche-biographie.de/gnd118509225.html"}`. Das Deutsche Museum steht schon drin.
- `invention-car`, Karl → Carl in:
  - `more[0]`: „Carl Benz entwickelte einen frühen Benzinwagen. …“
  - `surprise`: „Schon vor dem Benzinwagen von Carl Benz gab es …“
  - `invention.stages[2].text`
  - `question.why` (gleicher Satz; Empfehlung: mitziehen, damit es gleich bleibt)
- `app/world-connections.json:1777`: „… des Motorwagen ihres Mannes Carl …“. Dabei bitte gleich „des Motorwagens“ korrigieren.
- `app/world-connections.json:1785`: „1886 bekam Carl Benz ein Patent …“
- `app/world-game-support.mjs:87` (`AUFLOESUNG`): „Carl Benz war Ingenieur, also ein Fachmann für Technik. 1886 bekam er ein Patent: Andere durften seinen Motorwagen nicht einfach nachbauen. Seine Frau Bertha half ihm.“
- Freiwillig für den einheitlichen Namen: `app/world-photos.json:445/446` (alt und caption „Karl Benz …“).

**Aufzug** (`invention-elevator`). Fassung KR A, mit einer Abweichung:
- `paragraphs[0]`: „Bei einem typischen Seilaufzug bewegt ein Antrieb die Kabine über Seile und eine Treibscheibe. Am anderen Ende der Seile hängt ein Gegengewicht. Es ist so schwer wie die Kabine, wenn sie etwa halb voll ist. Das macht dem Antrieb die Arbeit leichter. Sicherheit entsteht durch mehrere zusammenarbeitende Einrichtungen, nicht allein durch einen starken Motor. Andere Aufzüge arbeiten beispielsweise hydraulisch.“
  - Abweichung von KR A: Satz 4 heißt bei KR A „Darum muss der Antrieb weniger heben“. Fast derselbe Satz stünde dann auch in der Beschreibung des Gegengewichts und in wrongReasons (Regel 9). Darum habe ich ihn umformuliert.
- `invention.parts[id=counterweight].description` und der Abschnitt „Gegengewicht: …“ in `invention.stages[2].text`: „Es zieht auf der anderen Seite am Seil. So muss der Antrieb weniger heben. Nicht alle Aufzüge verwenden diese Bauart.“
- `questionFeedback.wrongReasons[2]`: „Das Gegengewicht wiegt so viel wie die Kabine und ein paar Fahrgäste. Es hilft dem Antrieb beim Heben. Die Fangvorrichtung hat eine andere Aufgabe.“
  - Satz 2 weicht von KR A ab („So muss der Antrieb weniger heben“), weil er sonst wörtlich gleich wie in der Beschreibung wäre.
- `sources`: anhängen `{"label":"TK Elevator · Counterweights: Kabine plus 40 bis 50 % der Nutzlast","url":"https://tkelevator.com/us-en/tools/classroom-on-demand/counterweights.html"}`

**Licht** (`invention-light`)
- `more[0]` und `invention.stages[2].text` (beide gleich): „Viele Menschen arbeiteten daran. Um 1879 baute Joseph Swan in England frühe Glühlampen. Darin glühte ein dünnes Stück Kohle. In den USA bauten Thomas Edison und sein Team bessere Lampen und ein Kraftwerk.“
  - Fakten A bietet als genauere Variante an: „ein dünner Stab aus Kohle“.
- `invention.stages[3].text` („Früher“): „In einer Glühlampe wurde ein dünner Glühfaden so heiß, dass er leuchtete.“
- `sources`:
```json
[{"label":"National Park Service – elektrisches Licht","url":"https://home.nps.gov/edis/learn/kidsyouth/the-electric-light-system-phonograph-motion-pictures.htm"},
 {"label":"National Park Service · Thomas Edison: Lampe, Lichtsystem und Kraftwerk Pearl Street 1882","url":"https://www.nps.gov/edis/learn/historyculture/edison-biography.htm"},
 {"label":"Science Museum Group · Glühlampe von Joseph Swan, 1878–1879","url":"https://collection.sciencemuseumgroup.org.uk/objects/co42487/swan-electric-lamp"}]
```
- `question.why` bleibt (siehe Offen).

**Kühlschrank** (`invention-refrigerator`)
- `sources[1]`: `{"label":"Penn State · 2: EGEE 102, 6.4 Refrigerators (Kühlschrank als Wärmetransporter)","url":"https://courses.ems.psu.edu/egee102/node/2402"}`

### Teil D: Sätze nach falscher Antwort (`worldGameWrongFeedback` in `app/world-game-support.mjs`)

1. **Feste Lebensraum-Sätze (Zeilen 213–216).** Schlüssel ist der echte Antworttext im Code:
   - `'Trockene Sandwüste fern von Gewässern'` → „Deine Wahl ist eine trockene Wüste. Dort gibt es kaum Wasser. Wie wichtig ist Wasser für dieses Tier?“
   - `'Baumkronen im tropischen Regenwald'` → „Deine Wahl liegt hoch oben in den Bäumen. Kommt dieses Tier dort hinauf?“
   - `'Unter Wasser in einem warmen Korallenriff'` → „Deine Wahl liegt ganz unter Wasser, im warmen Meer. Lebt dieses Tier dort?“
   - `'Meereis der Antarktis'` → „Deine Wahl ist Meereis ganz im Süden der Erde. Lebt dieses Tier dort?“
2. **Lebensraum und Nahrung mit gezogener Falle (Zeile 222):**
   `'Deine Antwort passt zu einem anderen Tier: '+anderes.title+'. Gesucht ist aber: '+gesucht.title+'. '+schluss`
   - Lebensraum: `schluss` ist „Wo findet dieses Tier Futter und Schutz?“
   - Nahrung, wenn `stufe==='profi'||stufe==='experte'`: „Wie groß ist dieses Tier, und wo lebt es?“
   - Nahrung, sonst (Entdecker und alte Runden ohne Stufe): „Frisst dieses Tier Pflanzen, andere Tiere oder beides?“
3. **Tierdetektiv (Zeile 226):**
   `'Du hast „'+answer+'“ gewählt. Zuhause: '+selected.animal.habitat+'. Futter: '+futter+'. Passt dein Tier zu jedem Satz im Hinweis?'`
   - `futter` ist `selected.animal.diet`. Nur bei `selected.id==='animal-monarch-butterfly'` heißt es „Raupen fressen Seidenpflanzen, Falter Nektar“. Das Feld `diet` bleibt.
   - Ob „im Hinweis“ oder „im Rätsel“ hängt davon ab, wie die Seite den Text nennt. Beim Personenspiel heißt es schon „Satz im Hinweis“, darum empfehle ich „Hinweis“.
4. **Technik:** `TECHNIK_FALSCH` wird „Was macht diese Erfindung? Passt das zu allem in der Aufgabe?“. Gesamter Satz: „Du hast „X“ gewählt. Was macht diese Erfindung? …“. Meine frühere Variante mit `{gewählt_klein}` lasse ich fallen, weil sie bei manchen Titeln nicht funktioniert. „diese Erfindung“ steht direkt hinter der Wahl, wie „dieser Mensch“ bei Personen.
5. **Personen:** keine Änderung. `PERSONEN_FALSCH_ENTDECKER` und `PERSONEN_FALSCH_PROFI` mit „dieser Mensch“ sind schon im Code und passen zu den Regeln. Meine früheren `{name}`-Vorlagen sind damit hinfällig.

Alle Sätze haben höchstens 13 Wörter.

---

## 2. Quellen
Die Quelle zu jedem Text mit Zitat steht in `teilA.md`. Diese Punkte soll der `fakten-pruefer` besonders ansehen (⚠):
- Elefant h: „heiß und trocken“ ist nicht wörtlich belegt. Elefant f: „rupft Gras“ ist aus „grab … pull“ gefolgert.
- Giraffe d: Lineal 30 cm gegen Halswirbel über 25 cm, also „fast so lang“.
- Panda d: 3 bis 5 Unzen sind 85 bis 142 g, eine Tafel Schokolade wiegt 100 g.
- Gorilla h: Der WWF beschreibt beide Unterarten zusammen.
- Orang-Utan d, Satz 2, und Kurzschnabeligel h, Satz 2: beides Folgerungen. Orang-Utan h: „oft nass“ ist Alltagswissen.
- Kaiserpinguin f: fünf Fußballfelder zu je etwa 105 m sind 525 m, der Rekord liegt bei 565 m.
- Krake d: Smithsonian Magazine. Die Seite habe ich selbst abgerufen, Teile kenne ich aber nur aus Suchergebnissen.
- Biene h und Gartenkreuzspinne h: Jahreszeit und „in Büschen“ sind Alltagswissen.
- Walross h: Dass die Haut wegen des Blutflusses blass wird, ist bei der University of Alaska eine Vermutung der Forscher.
- Schleiereule d: Der Versuch mit den Händen hinter den Ohren ist ein Alltagsversuch ohne eigene Quelle.
- Strauß d: Der Vergleich geht von 50 km/h in der Stadt aus.
- Papageitaucher: Dass er mit den Füßen lenkt, stand nur bei Audubon. Audubon (Futter) leitet laut Fakten B um.
- Chamäleon f: ADW sagt „Gliederfüßer“, der Text sagt „vor allem Insekten“ wie die Spielantwort.
- Hummer f: Dass die Knackschere Schalen knackt, ist aus „crushing“ gefolgert.
- **Neu, von mir selbst abgerufen:**
  - Hummer d: Wildlife Trusts, blau, rot erst beim Kochen
  - Aal d: WWT, Gelbaal, Blankaal
  - Koala, Axolotl, Okapi, Strauß, Chamäleon h, Seepferdchen, Papageitaucher h (NatGeo Kids und RSPB), Rotfuchs h, Walross h

## 3. Umformuliert
- **Keine Antworttexte.** Hauptfragen, `diet`/`habitat` und gespeicherte Antworten sind unverändert.
- Benz: Der Name ändert sich nur in Fließtexten (Karl → Carl). Titel und Hauptfrage „Wofür ist Karl (Carl) Benz besonders bekannt?“ bleiben.
- Licht `stages[3]` ist die Aufgabe in „Früher oder heute?“ (`app/world-game-bank.ts:59`). Sie ist keine gespeicherte Antwort, siehe aber Offen.

## 4. Zahlen
- Nachgezählt mit `pruefe.mjs` (Node 24). Geprüft wurden:
  - Länge
  - Wörter je Satz (Trennung an . ! ? :)
  - Zahlen als Ziffern und Zahlwörter
  - andere Spieltiere samt Kurznamen
  - Räuber und Raubfisch, „Forschende“, „ohne Knochen“
  - die wirbellos-Formel
  - „du“ je Text
  - 4-Wort-Folgen aus Hinweis, Hauptfrage, Zusatzfragen und Kartensätzen
  - gleiche 5-Wort-Folgen bei verschiedenen Tieren im selben Spiel
  - Vergleiche je Spiel
  - Bedingungssätze mit Verb vorn (nur als Hinweis)
- **Ergebnis: 142 von 144 „ok“. Die 2 übrigen sind Fehlalarme:**
  - Biber d: „orange“ enthält „orang“; „wachsen immer nach“ stimmt fachlich.
  - Meeresschildkröte d: „Ihren Namen …“ ist kein Bedingungssatz.
- Länge 104 bis 180 Zeichen. Kein Satz hat mehr als 13 Wörter. Kein Text hat mehr als eine Zahl. Kein Text nennt ein anderes Spieltier.
- Gleiche 5-Wort-Folgen gibt es nur bei der festen wirbellos-Formel (4-mal im Futter-Spiel: Walross, Igel, Feuersalamander, Hummer; alle vier richtigen Antworten enthalten „wirbellos“). Jeder Vergleich steht höchstens einmal je Spiel. „wie eine Decke“ steht zweimal, aber in verschiedenen Spielen (Orca Zuhause, Rotfuchs Tierdetektiv).
- Mitmach- und Schutz-Tipps: 2 von 48, nämlich Igel (Milch und Wasser) und Schleiereule (Hände hinter die Ohren). Das Skript meldet auch den Eisbär, das ist ein Fehlalarm („hilft ihm“).
- **Fragen je Stufe und Anteil „richtige Antwort ist die einzige längste oder kürzeste“:** entfällt. Es gibt keine neuen Fragen oder Antwortlisten. Neue Fallen sind fertige Texte anderer Tiere.

## 5. Offen für die Prüfer und für Claude

**Abweichungen von Prüfer-Vorschlägen (mit Grund):**
1. Panda d: neuer Inhalt (Junges wie eine Tafel Schokolade), denn auch der KR-A-Vorschlag wiederholte den Hinweis (Kiefer, Bambus).
2. Strauß d: eigene Fassung. Der KR-B-Vorschlag „kann nicht fliegen“ ist die Hauptfrage und beginnt mit dem Verb.
3. Seeadler d: ohne „Bett“, weil das nah an der Hauptfrage zur Spannweite liegt.
4. Okapi f: „bis an die Ohren“ statt „putzen“, denn die Quelle sagt nur „reach“.
5. Koala f: ohne „Bauch“, das ist nicht belegt.
6. Biene d: anderes Thema (Kühlen mit den Flügeln), weil die Haare nicht belegt sind und Pollen die Hauptfrage ist.
7. Axolotl d: ohne Nachwachsen, das steht schon beim Hummer.
8. Walross h: ohne Fett, und Rotfuchs h: ohne Bau, wegen Dubletten mit Orca und Erdmännchen.
9. Giraffe d: ohne „gleich viele wie du“, weil der Hinweis die sieben Halswirbel nennt.
10. Biene h: ohne „immer“ (KR A Kann).
11. Hummer d: KR B S8 entfällt (Hinweis).
12. Aal d: Fakten B Kann wird durch einen neuen Text ersetzt (Hinweis).
13. Waschbär d: ohne „tastet“ (Fakten B S3), wegen Hinweis und Hauptfrage.
14. Chamäleon d: ohne Zange (Hinweis).
15. Kaiserpinguin h: Satz 2 neu, weil er sonst fast gleich wie beim Orca klingt.
16. Aufzug: zwei Sätze anders als KR A (Regel 9, siehe Teil C).

**Noch nah am Hinweis, bewusst gelassen:**
- Kaiserpinguin d: Vater und Ei, Gruppe. Neu ist die Hautfalte und das Abwechseln in der Mitte.
- Papageitaucher h: Erdhöhle. Neu ist, dass er in dieselbe Höhle zurückkehrt.
- Feuersalamander d: Larven. Neu sind kühle Bäche ohne Fische und die gelben Flecken.
- Walross d: Stoßzähne. Neu ist, dass sie ihm helfen, sich aufs Eis zu ziehen.
- Tiger d: Wasser zum Abkühlen, der Hinweis sagt „kann gut schwimmen“.
- Igel d: Winter.
- Clownfisch f: „Algen und winzige Tiere“ steht so ähnlich im Hinweis. Es ist aber ein Futter-Text, der das Futter nennen muss.

Bitte der `stufen-pruefer`.

**Grundsatz 2 gegen Grundsatz 6:** Die wirbellos-Formel steht 4-mal im Futter-Spiel. Die Entscheidung verlangt sie, aber sie wiederholt sich. Claude entscheidet.

**Tests und Daten:**
- `tests/world-game-runde.test.mjs` 248–254: Die Regel muss `Tier: [^.]*\.` lauten statt `zu: [^.]*\.`.
- `tests/world-game-learning-copy.test.mjs:157`: Die Auflösung muss mit „karl“ beginnen. Mit „Carl“ muss der Test Titel oder Aliase zulassen.
- `app/world-index.json` (Titel, intro) wird erzeugt: Bitte neu erzeugen und dann `pnpm run export:data`.
- Licht: `tests/fixtures/retained-optical-game-banks.json:151,170` enthält noch die alte Früher-Aufgabe „dünner Draht“ (genutzt von `tests/invention-optics-game-bank.test.mjs`). Bitte prüfen, ob das ein fester Altstand ist oder angepasst werden muss.
- Licht `question.why` enthält noch den alten Satz zu Swan und Edison. Er bleibt richtig, ist aber anders als `stages[2]`. Gleichziehen?
- Gestrichene Fallen: Eine gespeicherte Runde mit so einer Falle prüft `validWorldGameOrder` als ungültig. `restoreWorldGameOrders` repariert dann nur die Reihenfolge dieser Aufgabe. Bitte auf allen Wegen (Pass, Neuladen) prüfen, ob dabei sonst nichts verloren geht.

**Fallen, eigene Funde (nicht entschieden, Regel vom 24.11.):**
- Axolotl „Früchte, Blätter und auch Insekten“ passt teilweise (San Diego Zoo: insects) und müsste dann aus beiden Listen. Zum Auffüllen ginge „Nektar und Pollen“.
- Aal „Früchte, Blätter und auch Insekten“ (Entdecker) ist grenzwertig, weil junge Aale Insektenlarven fressen.
- Monarchfalter „Küste“ (Entdecker): Die westlichen Monarchfalter überwintern an der Küste Kaliforniens.
- Tümmler „Kleine Tiere im Plankton“ ist ein Unterbegriff von „Fisch und Meerestiere“.
- Grasfrosch: „Kleine Tiere“ ist so weit, dass jede Tierfalle teilweise passt. Darum kein neues Paar. Besser die richtige Antwort schärfen (BACKLOG „Fallen schärfen“).
- Erdmännchen: Krill, Meerestiere und „Vor allem kleine Säugetiere“ prüfen.
- Orca: Krill und Plankton prüfen.
- Schnabeltier, Igel, Kurzschnabeligel: Krill ist laut Entscheidung bewusst geblieben.

**Sonst:**
- Der Hinweis zum Aal beginnt mit „Forschende glauben“ (Grundsatz 9). Das ist nicht mein Text, betrifft aber den Ton.
- Teil D mischt „Deine Wahl“ (feste Sätze, so in der Entscheidung) und „Deine Antwort“ (Fallensatz). Vereinheitlichen?
- Ein Kartentitel mit Punkt würde den Fallensatz und die Testregel stören. Heute hat keiner einen.
