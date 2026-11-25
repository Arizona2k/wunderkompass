# Stufenprüfung Tier-Auflösungen, Fallen und Sätze nach falscher Antwort (25.11.2026)

> Helferbericht (stufen-pruefer, opus/high), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

`stufen-pruefer` (opus / high). Es ist eine Teilprüfung: Ich habe nur die Schwierigkeit geprüft, keine Fakten und keine Sprache. Ich habe nichts geändert. Gezählt habe ich mit Node-Skripten im Scratchpad: alle 144 Texte gegen alle Hinweise, Haupt- und Zusatzfragen, „Stimmt das?“-Sätze, Fallenlisten und Spieltiernamen (auch die Kurznamen aus `common`).

## Gesamteindruck

Die meisten der 144 Auflösungen bringen auch 10- bis 12-Jährigen etwas Neues: Walhai und Wal an der Schwanzflosse unterscheiden, Eisen im Biberzahn, Pandabauch für Fleisch, blasse Walrosshaut, Eisvogel schluckt den Fisch mit dem Kopf zuerst. Ein anderes Spieltier nennt keine Auflösung (einziger Skripttreffer „Orang“ in „Orange“, ein Fehlalarm).

Vier Probleme gibt es:
- Eine Auflösung verrät eine Experten-Zusatzfrage wörtlich (Krake).
- Etwa zehn Auflösungen beantworten die Hauptfrage der Karte fast wörtlich, gegen die eigene Regel der Autoren.
- Fünf Futter-Auflösungen machen eine angebotene Falle in derselben Aufgabe nachträglich „richtig“ (Krill).
- Die Profi-Fallen bei „Tier & Lebensraum“ sind bei 24 von 48 Tieren teilweise dieselben wie auf Entdecker.

Die Auflösungen gelten für alle Stufen. Das passt, weil Experte in den Welt-Spielen Profi spielt (`app/world-game-runde.ts:19`).

---

## 1. Tier-Auflösungen

### Muss (vor dem Einbau)

**1-M1 Krake, Tierdetektiv verrät die Experten-Zusatzfrage**
- **Problem:** „Der Krake hat keine Knochen. Sein weicher Körper quetscht sich durch erstaunlich enge Spalten.“ Die Experten-Frage fragt genau das: „Ein Krake quetscht sich durch einen Spalt … Wie geht das?“ Richtig ist „Er hat keine Knochen und macht sich schmal“. Das ist reines Wiederfinden.
- **Beleg:** `docs/entwurf/2026-11-25-tier-aufloesung-paket-2.md:54` gegen `app/world-catalog.json:1883`
- **Vorschlag:** „Der Krake hat drei Herzen. Sein Blut ist blau und nicht rot. Bei Gefahr spritzt er dunkle Tinte und verschwindet in der Wolke.“ Quelle nötig, `fakten-pruefer`. Die Sepia ist für den Kraken in beide Richtungen ausgeschlossen, „Tinte“ verrät also keine Falle.

**1-M2 Futter-Auflösungen machen die Falle „Krill“ in derselben Aufgabe richtig**
- **Problem:** Die Karte nennt Krill „kleine garnelenähnliche Krebstiere“. Die Auflösungen sagen dann:
  - Seepferdchen „winzige Garnele“
  - Krake „Schalen von Krebsen“
  - Hummer „kleinere Krebse“
  - Aal „kleine Krebse“
  - Sepia „Krabben“

  Bei allen fünf steht „Krill“ auf Profi unter den Antworten. Ein Profi-Kind liest nach „Richtig!“, dass Krill auch gepasst hätte. Dazu kommt: Krill ist ein Unterbegriff der richtigen Antwort („Meerestiere“, „Verschiedene wirbellose Meerestiere“, „Kleine Wassertiere“, „Kleine Beutetiere“, „Krebse, Fische und andere kleine Meerestiere“). Das ist der Fall M4 aus der Stufenprüfung vom 24.11.
- **Beleg:**
  - Auflösungen: `paket-4.md:328`, `:275`, `:191`, `:299`, `paket-2.md:62`
  - Fallen: `app/world-game-tier-fallen.json:1449`, `:1418`, `:1374`, `:1434`, `:933`
  - Krill auf der Karte: `app/world-catalog.json:1372`
- **Vorschlag:** Nicht die Texte ändern, sondern die Fallen (siehe 2-M1).

### Soll (vor dem Einbau, kleine Umformulierungen)

**1-S1 Hauptfrage der Karte fast wörtlich beantwortet**

Das verstößt gegen die Regel der Autoren (Paket 1, Punkt 6). Auf Karten ohne Zusatzfrage bekommen auch Profi und Experte die Hauptfrage (S4); das wird dann Wiederfinden.

| Auflösung | Hauptfrage | Vorschlag |
|---|---|---|
| Axolotl, Tierdetektiv „behält seine Kiemen sein ganzes Leben lang“ (`paket-2.md:188`) | „Er behält seine äußeren Kiemen“ (`world-catalog.json:2572`) | „Der Axolotl kann ein verlorenes Bein wieder nachwachsen lassen. Ab und zu schwimmt er nach oben und schnappt Luft.“ (Quelle nötig; das Motiv steht auch beim Hummer-Tierdetektiv) |
| Großer Tümmler, Zuhause „muss auch im Schlaf zum Atmen auftauchen“ (`paket-1.md:169`) | „Er holt Luft an der Oberfläche“ (`:1580`) | „Der Große Tümmler schläft mit nur einer Hälfte seines Gehirns. Die andere Hälfte bleibt wach und passt auf.“ Das Warum bleibt offen, die Karte löst es auf. |
| Borneo-Orang-Utan, Zuhause „größten Teil seines Lebens in Bäumen“ (`paket-1.md:117`) | „In Bäumen“ (`:1030`) | „Der Borneo-Orang-Utan wird im Regenwald oft nass. Dann deckt er sich manchmal mit großen Blättern zu, wie mit einem Regenmantel.“ |
| Eisbär, Zuhause „braucht das Meereis … als Jagdgebiet“ (`paket-1.md:130`) | „Dort kann er nach Robben jagen“ (`:1141`) | „Der Eisbär lebt rund um den Nordpol. Schmilzt das Meereis im Sommer ganz, muss er an Land. Dort findet er oft wochenlang kaum Futter.“ Das Kind folgert selbst. |
| Jaguar, Zuhause „starker Schwimmer“ (`paket-2.md:145`) | „Er kann gut schwimmen“ (`:2342`) | Satz 2 streichen: „Der Jaguar lebt meist nah am Wasser, zum Beispiel an Flüssen im Regenwald. Viele seiner Beutetiere leben auch am Wasser.“ |
| Papageitaucher, Zuhause (`paket-4.md:58`): Futter im Meer, Brüten an der Küste. Das ist der Hinweis noch einmal und dazu die Lösung der Hauptfrage. | Brutplatz und Nahrungsraum (`:13216`) | „Der Papageitaucher kommt zum Brüten oft jedes Jahr in dieselbe Erdhöhle zurück. Nur zur Brutzeit ist sein Schnabel so bunt.“ (`fakten-pruefer`) |
| Sepia, Futter „zwei langen Fangarme … acht kürzeren Armen“ (`paket-4.md:299`) | „acht Arme und zusätzlich zwei längere Fangtentakel“ (`:14274`) | Zahlen weglassen: „Die Sepia jagt Krabben und kleine Fische. Ihre langen Fangarme schnellen blitzschnell nach vorn und packen zu.“ |
| Kurzschnäuziges Seepferdchen, Tierdetektiv und Zuhause, beide über den Greifschwanz (`paket-4.md:324`, `:326`) | „Mit seinem Greifschwanz“ (`:14392`) | Tierdetektiv: „Das Kurzschnäuzige Seepferdchen ist ein Fisch, der aufrecht schwimmt. Die Eier trägt der Vater in einer Tasche am Bauch. Dort schlüpfen auch die Jungen.“ Zuhause: „Das Seepferdchen lebt im flachen Wasser, oft bei Seegraswiesen. Es schwimmt schlecht. Bei starker Strömung hält es sich darum gut fest.“ |

**1-S2 Wenig Neues für 10- bis 12-Jährige (Hinweis oder Antwort noch einmal, oder Doppeltes)**
- Europäisches Chamäleon, Tierdetektiv: „Mit jedem Auge sucht es woanders“ steht schon im Hinweis. „Lauert still“ (Tierdetektiv) und „wartet still“ (Futter) sagen dasselbe (`paket-4.md:79`, `:83`). Vorschlag: Tierdetektiv nimmt die Zange aus Zuhause („Zehen greifen von zwei Seiten …“), Zuhause bekommt etwas Neues.
- Echter Clownfisch: „Brennende Fangarme“ steht im Tierdetektiv und in Zuhause (`paket-4.md:162`, `:164`). Futter erklärt nur die Wörter der Antwort. Vorschlag: In Zuhause statt der Fangarme „Nachts ruht er oft mitten auf der Seeanemone“ ausbauen. Futter darf für Entdecker so bleiben.
- Westliche Honigbiene, Zuhause (`paket-2.md:167`) und Koala, Zuhause: dünn, aber nicht falsch. Mit niedriger Priorität.

### Kann

- **1-K1 Hauptfrage nur angedeutet, die der Hinweis meist schon verrät.** Grasfrosch-Tierdetektiv (Entwicklung, `paket-4.md:135` gegen `:13567`), Aal-Tierdetektiv und -Zuhause (Wanderung, `:187`, `:189` gegen `:13807`), Biene-Tierdetektiv (Pollen, `:2460`), Walhai-Futter („Kiemen“), Clownfisch-Tierdetektiv („Fangarme“, also ein Tier). Dazu der Elefanten-Tierdetektiv „spritzt sich Wasser“ gegen die Profi-Frage „Wie trinkt …?“ (`world-catalog.json:142`). Das ist eher Wiederholen als Verraten. Ändern nur, wenn man die Regel streng nimmt.
- **1-K2 Fett hält warm.** Orca, Walross und Kaiserpinguin sagen das in Zuhause. Damit nehmen sie die Experten-Frage beim Eisbär vorweg („Was hält ihn jetzt vor allem warm?“, `world-catalog.json:1216`). Das ist Übertragen im Sinn von S5, also eher gewollt. Nur festhalten.
- **1-K3 Okapi, Futter „Zunge bis an die Ohren“** (`paket-3.md:67`). Damit wird das Okapi im Giraffen-Rätsel zur stärkeren Falle (kein Ausschluss, und „sieben Halswirbel“ stimmt auch für das Okapi). Eindeutig ist das Rätsel nur noch durch „sehr langer Hals“. Für Profi in Ordnung, beobachten.
- **1-K4 Kurzschnabeligel, Zuhause „sogar auf verschneiten Bergen“** (`paket-3.md:46`). Der Satz kommt direkt, nachdem das Kind auf Profi „Arktis“ oder „Antarktis“ abgewählt hat. Das erledigt sich mit 2-S3.

---

## 2. Fallen-Befunde der Autoren

Alle Änderungen hier betreffen nur Fallenlisten, keine richtigen Antworten. Folge für gespeicherte Runden: `validWorldGameOrder` lehnt die Reihenfolge dieser einen Aufgabe ab, und `restoreWorldGameOrders` mischt sie neu (`app/world-game-bank.ts:27`, `:36`). Der Pass und die Wiederholungs-Einträge (je Frage-ID) bleiben. `tests/fixtures/gespeicherte-antworten*.json` gehören zu den Karten und sind nicht betroffen. Den Randfall „gespeicherte `roundAnswer` ist genau die gestrichene Falle“ soll der `code-pruefer` ansehen. Mindestlängen laut Test: Entdecker mindestens 3, Profi mindestens 4 (`tests/world-game-runde.test.mjs:203`).

### Muss (mit dem Einbau, im selben PR)

**2-M1 „Krill“ bei Meerestieren, die kleine Krebse fressen** (bestätigt, verschärft durch 1-M2)
- **Wo:** Nahrung Profi bei Krake (`:933`), Sepia (`:1434`), Hummer (`:1418`), Seepferdchen (`:1449`), Aal (`:1374`).
- **Problem:** Die Faktenprüfung vom 24.11. ließ Krill stehen, weil keines dieser Tiere „nachweislich Krill frisst“ (`2026-11-24-tier-fallen-faktenpruefung.md:107`). Für die Schwierigkeit zählt aber: Krill ist ein Unterbegriff der richtigen Antwort, und die neuen Auflösungen nennen Krebse und Garnelen. Ein Kind kann die Falle nicht sicher ausschließen.
- **Vorschlag:** Streichen. Wo Profi dadurch unter 4 fällt (Krake, Sepia, Aal), bis zum Fallen-Schritt mit geprüften Entdecker-Fallen desselben Tieres auffüllen (Vorgehen vom 24.11., Zeile 125). Als echte Profi-Falle später „Als erwachsenes Tier vor allem Pflanzen“ (Meeresschildkröte: gleicher Ort, falsche Art), nach dem `fakten-pruefer`.
- Bei Tieren aus Süßwasser oder vom Land (Igel, Feuersalamander, Axolotl, Schnabeltier) bleibt „Krill“ eine gute Denkfalle: Krill lebt im Meer.

**2-M2 Eisbär-Entdecker „Feuchte Wälder und Larvengewässer“** (bestätigt)
- **Beleg:** `app/world-game-tier-fallen.json:128`
- **Problem:** Ein Wort, das ein 6-jähriges Kind weder lesen noch verstehen kann. Die Liste hat nur 3 Einträge.
- **Vorschlag:** Ersetzen durch „Wüste“ oder „Savanne“, beide eindeutig falsch. Die richtige Antwort des Feuersalamanders umbenennen ist ein eigener späterer Schritt (mit Alias, gespeicherte Runden).

### Soll

**2-S1 „Fleisch“ bei Tieren, die nur kleine Tiere fressen**
- **Wo:**
  - Profi: Kurzschnabeligel, Braunbrustigel (`:1238`), Chamäleon (`:1320`), Feuersalamander (`:1333`), Grasfrosch (`:1346`), Hummer (`:1421`), Blauwal, Walhai (`:1038`)
  - Entdecker: Strauß (`:1281`), Clownfisch (`:1354`)
- **Problem:** Die neuen Auflösungen betonen „kleine Tiere ohne Knochen“, „Insekten oder Eidechsen“, „winzige Tiere“. Kinder kennen „fleischfressende Pflanzen“, die Insekten fangen, und zählen Insekten deshalb zu „Fleisch“. Beim Kaiserpinguin, Tümmler und Eisvogel wurde „Fleisch“ am 24.11. aus demselben Grund gestrichen. Heute ist das uneinheitlich.
- **Vorschlag:** Mit dem `fakten-pruefer` entscheiden. Am besten mit dem Einbau, spätestens im Fallen-Schritt.

**2-S2 Entdecker-Fallen, die laut Quelle zum Teil passen**
- **Wo:** Chamäleon „Flussufer und Stillgewässer“ (ADW: „riparian“, Block `:574`), Schleiereule „Flussufer und Stillgewässer“ (Block `:514`), Monarchfalter „Flüsse und Feuchtgebiete“ (Entdecker und Profi, Block `:649`). Die Monarch-Quelle der Autoren nennt selbst „wet area“ (`paket-4.md:227`); dieser Fall ist neu und steht nicht in den Paketen.
- **Problem:** Auf Entdecker muss eine Falle eindeutig falsch sein.
- **Vorschlag:** Erst der `fakten-pruefer`, dann streichen (billig, wie oben).

**2-S3 Profi so leicht wie Entdecker bei Tier & Lebensraum** (bestätigt, steht schon in BACKLOG 25 als S3)
- **Messung:** 24 von 48 Tieren haben Einträge in beiden Listen.
  - Honigbiene (`:275`) und Feuersalamander (`:589`): Profi ist eine Teilmenge von Entdecker. Mit Wahrscheinlichkeit 1,0 sind alle drei Profi-Fallen auch Entdecker-Fallen.
  - Kurzschnabeligel (`:378`), Biber (`:441`), Rotfuchs (`:471`): 3 von 4 gleich.
  - Bei 23 Landtieren steht auf Profi mindestens ein Wasser- oder Eis-Ort, meist „Arktis“.
- **Herkunft:** Das ist ein bewusster Kompromiss aus der Faktenprüfung (auffüllen statt einer Falle, die doch passt). Er ist ehrlich, aber Profi ist hier nicht Profi.
- **Vorschlag:** Eigener Schritt mit neuen Paaren. Ideen für den `fakten-pruefer`:
  - Feuersalamander: „Trockene offene Landschaften“, „Savanne“
  - Biber: „Arktische Küsten und Meere“, „Küstennaher Meeresboden“ (anderes Wasser)
  - Kurzschnabeligel: „Flüsse und Seen“ (die Antwort des Schnabeltiers, gleicher Erdteil)

  Wo es keine ähnlichen, sicher falschen Orte gibt (Honigbiene, Rotfuchs: die richtige Antwort ist zu weit), gilt S3 vom 24.11.: Profi lässt das Tier weg.

**2-S4 Hinweise, die die Lösung verraten** (bestätigt)
- Blauwal „Ich bin das größte heute lebende Tier“ (`app/animal-detective-clues.json:55`). Das ist wörtlich die Rekorde-Frage (`world-game-bank.ts:41`) und fehlte in S4 vom 24.11.
- Borneo-Orang-Utan „nur auf Borneo“ (`:40`).
- Auf Entdecker ist das eine willkommene Hilfe, auf Profi Wiederfinden.
- **Vorschlag:** Eigener Schritt „zweiter Hinweis für Profi ohne das bekannteste Merkmal“ (S4 vom 24.11.), zusammen mit dem BACKLOG-Punkt „Tierdetektiv in Kinderton“. Für jetzt reichen kleine Änderungen, denn Hinweise sind keine gespeicherten Antworten:
  - Blauwal: „Ich bin ein riesiges Säugetier im Meer.“ Die Barten trennen dann Orca und Tümmler.
  - Orang-Utan: „Ich lebe auf einer großen Insel in Südostasien.“
- Tiger „nur Länder“ (`:20`): verworfen als Muss. Satz 2 (allein, schleicht, schwimmt) trennt auf Profi gut, und „meist allein“ schließt den Löwen aus. Kommen später Streifen in den Hinweis, muss die Tiger-Auflösung (Streifen) mitgeändert werden.

### Kann (eigener späterer Schritt „Fallen schärfen“, BACKLOG 25)

- **2-K1 Dauerfallen werden zum Ratemuster.** Nahrung Profi: Krill in 26 Listen, „Vor allem kleine Säugetiere“ in 26, „Ameisen und Termiten“ in 24. Lebensraum Profi: Arktis und Antarktis je 19, „Korallenriffe mit Seeanemonen“ 17. Weil die Rückmeldung sagt „passt zum Beispiel zu: Echter Clownfisch“, lernen Kinder, das Futter oder den Ort eines bekannten Tiers auszuschließen, ohne nachzudenken. Neue Regel: höchstens eine solche besondere Falle je Profi-Liste (Krill, Bambus, Eukalyptus, Nektar, „Raupen: …“, Korallenriff, „Larvengewässer“, „Haltestrukturen“). Die übrigen sind allgemeine Texte.
- **2-K2 Doppelte Einträge in beiden Listen bei Nahrung** (16 Tiere), z. B.:
  - Gorilla „Fleisch“ und „Fisch und Meerestiere“
  - Orang-Utan und Elefant „Vor allem kleine Fische“
  - Panda „Eukalyptusblätter“ (Entdecker nur 3 Einträge)
  - Koala „Kleine Beutetiere“
  - Katta zwei Wasserfutter
  - Rotfuchs „Raupen …“ und Krill
  - Kaiserpinguin „Raupen …“

  Bestätigt. Kein Fehler im Test (der prüft nur innerhalb einer Liste), aber Profi wird leichter.
- **2-K3 Zu weite richtige Antworten** („Kleine Tiere“, „Kleine Beutetiere“, „Meerestiere“, „Fleisch“). Sie machen fast jede Tierfalle zum Teil-Treffer, z. B. Grasfrosch „Kleine Tiere“ gegen „Vor allem kleine Säugetiere“. Schärfen nur mit Alias, später.
- **2-K4 Spielfrage „in freier Natur“** passt schlecht zu „Wiesen & Gärten“ und zum Dromedar (Paket 2). Das ist eine Sache der Fakten und der Sprache, nicht der Schwierigkeit.

---

## 3. Sätze nach falscher Antwort (Entwurf Teil 2)

### Muss

**3-M1 Nahrung, Schlussfrage auf Profi (Offen-Punkt 3)** (bestätigt)
- **Beleg:** `app/world-game-support.mjs:222`, Entwurf `2026-11-25-kartenkorrekturen-falsch-saetze-entwurf.md:197` und `:252`
- **Problem:** „Frisst dieses Tier Pflanzen, andere Tiere oder beides?“ führt auf Profi in die Irre. 81 % der Profi-Fallen gehören zur selben Art wie die Lösung (Stufenprüfung 24.11., S7). Giraffe gegen Bambus oder Eukalyptus: beides Pflanzen. Löwe gegen „Vor allem kleine Säugetiere“: beides Tiere.
- **Vorschlag, nach Stufe getrennt** (der Parameter `stufe` ist schon da, eine Tabelle zur Art des Futters braucht es nicht):
  - **Entdecker:** wie heute „Frisst dieses Tier Pflanzen, andere Tiere oder beides?“ Dort ist nur 1 % der Fallen von derselben Art.
  - **Profi und Experte:** „Wie groß ist dieses Tier, und wo lebt es?“ (8 Wörter, verrät nichts, kein Satz aus dem Tipp).
- **Durchgespielt** (passt bei allen Paaren derselben Art, die ich angesehen habe):
  - Giraffe gegen Bambus oder Eukalyptus (wo?) und gegen Nektar (wie groß?)
  - Panda gegen Eukalyptus (wo?)
  - Löwe und Eisbär gegen kleine Säugetiere, Insekten oder Krill (wie groß?)
  - Igel gegen Meerestiere (wo?)
  - Clownfisch gegen „Früchte, Blätter und auch Insekten“ (wo?)
  - Rotfuchs gegen „Algen und Zooplankton“ (wo?)
- **Wo der Satz nicht hilft,** taugt die Falle selbst nichts. Beispiel: Seepferdchen gegen Krill (beide klein, beide im Meer). Das ist ein Prüfstein für 2-M1.
- Der Test `tests/world-game-runde.test.mjs:252` schneidet alles hinter „Gesucht ist aber:“ ab und bleibt grün.

### Soll

**3-S1 Technik-Detektiv:** „zu allem“ beibehalten
- **Beleg:** Entwurf `:167`, heute `world-game-support.mjs:188`
- **Problem:** „Passt das zur Aufgabe?“ verliert den Kern des heutigen Satzes. Profi-Fallen kommen aus derselben Zeit und passen oft zu einem Teil der Aufgabe.
- **Vorschlag:** „Du hast „Der Buchdruck“ gewählt. Was macht der Buchdruck? Passt das zu allem in der Aufgabe?“ (höchstens 7 Wörter je Satz).

### Kann

- **3-K1 Nahrung, „oder beides?“ auf Entdecker:** Bei Rotfuchs, Waschbär, Strauß, Katta und Clownfisch zeigt das Wort fast auf die Lösung, weil die richtige Antwort „tierische und pflanzliche“ oder „auch kleine Tiere“ enthält. Beim zweiten Versuch mit zwei übrigen Antworten ist das auf Entdecker in Ordnung, nur festhalten.
- **3-K2 Tierdetektiv:** „Zuhause: … Futter: …“ des gewählten Tiers hilft, wenn das Kind das Tier nicht kennt (Begründung im Entwurf, `:189`). Bei rund 7 % der Profi-Paare (56 von 773) sind Zuhause oder Futter gleich wie beim gesuchten Tier, z. B. Gepard gegen Löwe (beide Savanne, beide Fleisch). Dort bestätigen die Angaben scheinbar die falsche Wahl. Die Schlussfrage „Passt dein Tier zu jedem Satz im Rätsel?“ fängt das auf. Vorgelesen sind bis zu 179 Zeichen viel für Entdecker; das entscheidet die `kinder-redaktion`.
- **3-K3 Wer war das?, Tier & Lebensraum und die vier festen Sätze:** Kein Befund. Keiner verrät die Lösung. „Deine Wahl“ statt „Diese Wahl“ ist klarer. Der Meereis-Satz („rund um den Südpol“) führt beim Eisbär nicht zu einem falschen „Ja“.

---

## Lücken (Experte)

Die Welt-Spiele haben noch keine Experten-Aufgaben. Die Auflösungen liefern dafür Stoff, ohne dass ein Satz wiederholt wird:
- **S5 Art 1, Übertragen:**
  - „Ein Tier schlägt die Schwanzflosse auf und ab. Hai oder Wal?“ (aus dem Walhai-Tierdetektiv)
  - „Warum frisst der Große Panda so viele Stunden am Tag?“ (aus Panda-Futter)
  - Lebensraum: „Welches Tier hätte in der Savanne ein Problem: Feuersalamander oder Strauß?“ (Haut darf nicht austrocknen)
- **S5 Art 5, Knobelfall über mehrere Karten:**
  - „Welche Tiere müssen kaum trinken, weil ihr Futter Wasser enthält?“ (Giraffe, Strauß, Rotes Riesenkänguru)
  - „Was hält Orca, Walross und Kaiserpinguin warm?“

## Unsicher

- Ob Kinder „Fleisch“ für Insekten gelten lassen (2-S1) und ob eine Hauptfrage, die sie aus dem Spiel kennen, für sie Wiederholen oder Wiederfinden ist (1-K1), klären nur echte Kinder über den Nutzer.
- Ob Kinder die Auflösungen nach „Richtig!“ überhaupt lesen, zeigt eher der `spieltester`.
- Ob die Fallen in 2-S2 laut Quelle wirklich passen und ob meine Ersatztexte stimmen (drei Herzen, Nachwachsen, Bruthöhle, Schnabelfarbe, aufrecht schwimmen), habe ich nicht geprüft: `fakten-pruefer`.
- Sprache und Wortwahl (z. B. „Winterruhe“, „Mangroven“, „Gewölle“) habe ich nicht bewertet: `kinder-redaktion`.

**Dateien:** `/home/user/wunderkompass/docs/entwurf/2026-11-25-tier-aufloesung-paket-1.md` bis `-paket-4.md`, `/home/user/wunderkompass/docs/entwurf/2026-11-25-kartenkorrekturen-falsch-saetze-entwurf.md`, `/home/user/wunderkompass/app/world-game-tier-fallen.json`, `/home/user/wunderkompass/app/world-game-support.mjs`, `/home/user/wunderkompass/app/world-game-bank.ts`, `/home/user/wunderkompass/app/world-game-runde.ts`, `/home/user/wunderkompass/app/animal-detective-clues.json`, `/home/user/wunderkompass/app/world-catalog.json`, `/home/user/wunderkompass/tests/world-game-runde.test.mjs`, frühere Berichte `/home/user/wunderkompass/docs/entwurf/2026-11-24-welt-spiele-stufenpruefung.md` und `/home/user/wunderkompass/docs/entwurf/2026-11-24-tier-fallen-faktenpruefung.md`.
