# Teil B, Aufgabe 8: Stufen-Prüfung der sechs Welt-Spiele

Stand: 24.11.2026. Bericht des `stufen-pruefer` zum Code-Stand `4b29615` (Branch `claude/practical-cerf-av0jx4`), vollständig übernommen. Die erwähnten Skripte lagen nur im Scratchpad des Chats und sind nicht im Repository. Was Claude daraus gemacht hat, steht am Ende.

**Gesamteindruck:** Die meisten Entdecker-Runden sind für 5- bis 7-Jährige machbar, wenn ein Elternteil vorliest und das Kind ausschließt. Personen ist die Ausnahme, dort bleibt Kleinen nur Raten. Profi ist bei Tierdetektiv (außer bei den Säugetieren), bei den Personen und bei Lebensraum für Landtiere spürbar schwerer. Bei Nahrung, Technik und „Früher oder heute?“ ist Profi oft nicht schwerer als Entdecker. Zwei Funde wiegen schwerer als der 45-%-Test zeigt. Bei „Früher oder heute?“ verrät die dritte Antwort die Lösung immer. Bei Nahrung auf Profi ist eine Antwort mit „Pflanze“ fast immer richtig.

Alle Zahlen stammen aus Simulationen mit 300 bis 400 Startwerten. Die Skripte liegen in `/tmp/claude-0/-home-user-wunderkompass/3a68ef24-47f6-5148-8204-dbed78581f5f/scratchpad/skripte/`: `fallen-reich.mjs`, `wortverrat.mjs`, `personen-geschlecht.mjs`, `pflanze.mjs`, `stufen-tabelle.mjs`, `detektiv.mjs`.

### Urteil je Spiel (Frage 1)
| Spiel | Entdecker (5–7) | Profi (für 10–12) |
|---|---|---|
| Tierdetektiv | machbar mit Vorlesen und Ausschließen; die Tipps sind oft zu abstrakt | gut bei Vögeln, Fischen/Amphibien/Reptilien und Wirbellosen. Bei 26 von 48 Tieren (Säugetiere) kommen zufällige Säugetiere als Fallen, dann ist Profi kaum schwerer |
| Lebensraum | machbar; aber Eisbär und Pinguin sind verdreht (siehe M2) | mittel: Bei 33 % der Profi-Aufgaben sind mindestens 2 von 3 Fallen auf den ersten Blick falsch (Wasser statt Land, Pol statt warm), bei 14 % alle drei |
| Nahrung | machbar | oft nicht schwerer: Bei 56 % sind mindestens 2 von 3 Fallen auf den ersten Blick falsch. Dazu kommen das Muster „Pflanze“ und Dauerfallen |
| Personen | für 5–7 praktisch nur Raten: lange, abstrakte Hinweise, unbekannte Namen | fordernd, aber durch Erinnern, nicht durch Denken. Das passt zu Profi. Ausnahme: das Pronomen-Muster (M5) |
| Technik | machbar | kaum schwerer: Fallen aus denselben Jahren haben nichts mit dem Hinweis zu tun, weil kein Hinweis eine Zeit nennt |
| Früher oder heute? | machbar über die Zeitform: Vergangenheit heißt früher, das ist für Kleine eine gute Hilfe | nicht schwerer: 23 von 24 Aufgaben gehen allein über die Zeitform; dazu M1 |

### Muss vor dem PR

**M1 „Früher oder heute?“: Die dritte Antwort verrät die Lösung in 100 % der Aufgaben.** In `app/world-game-bank.ts`, Zeile 51, stehen Früher-Aufgaben immer mit „Noch keine wirkliche Entwicklung“ und Heute-Aufgaben immer mit „Nur ein Zukunftswunsch“. Wer das einmal bemerkt, liest die Lösung an der Falle ab. Die 47 % „kürzeste Antwort“ sind dagegen kein echtes Muster: Die drei Antworten sind feste Kategorien, und „Heute“ ist nur deshalb die kürzeste, weil das Wort kurz ist. Der Kompass hat eigene Antworten („Früher und heute / Nur früher / Nur heute“), und „und“ ist dort zu 100 % richtig.
- **Vorschlag ohne vierte Antwort, sofort:** eine gleiche dritte Antwort für alle Aufgaben, z. B. „Gab es noch nie“.
- **Den Längentest für dieses Spiel ersetzen** durch zwei Prüfungen: (a) Jede Aufgabe hat dieselben drei Antworttexte. (b) Früher und Heute sind etwa gleich oft richtig.
- **Fürs BACKLOG, die bessere Lösung:** Die dritte Antwort heißt überall „Früher und heute“. Dazu bekommt jede Erfindung einen Satz, der zu beiden Zeiten gilt, so wie beim Kompass.
  - Entwürfe, vom `fakten-pruefer` zu prüfen: „Züge rollen auf Schienen.“ / „Flugzeuge fliegen, weil ihre Flügel sie tragen.“ / „Eine Rakete fliegt, weil sie Gas nach hinten ausstößt.“
  - Dann ist die dritte Antwort in etwa einem Drittel der Aufgaben richtig.
  - Die Gegenwart verrät nicht mehr automatisch „Heute“; das macht Profi echt.
  - Der Vorrat wächst von 24 auf 35, und der Längentest wird von selbst bestanden.
- **Achtung, gespeicherte Antworten:** Alte Runden enthalten die alten Texte. `validWorldGameOrder` verlangt, dass jede Antwort in `current.answers` steht. Darum braucht es eine Liste alter Texte (Fixture `gespeicherte-antworten*.json`).

**M2 Verdrehte Stufen: Entdecker ist schwerer als Profi** (`app/world-game-tier-fallen.json`):
- Lebensraum Eisbär: „Antarktis“ steht unter `entdecker`. Unter `profi` stehen nur Landschaften (Hecken, Wald, Wüste …), Profi ist also trivial. → „Antarktis“ nach `profi`.
- Lebensraum Kaiserpinguin: „Arktis“ steht unter `entdecker`, Profi ist trivial (Korallenriff, Flüsse …). → „Arktis“ nach `profi`.
  - Arktis gegen Antarktis ist genau die Falle für Große. Ein 6-jähriges Kind kann die zwei Wörter kaum unterscheiden.
- Nahrung Grüne Meeresschildkröte: Unter `entdecker` stehen „Vor allem wirbellose Bodentiere“ und „Vor allem kleine Fische“ (beides Meeresfutter), unter `profi` stehen Nektar, Bambus und Eukalyptus. → die zwei Meeresfallen nach `profi`, die Landpflanzen nach `entdecker`.

**M3 Feste Entdecker-Fallen stehen auf der Ausschlussliste.** Entdecker nutzt weiter die alten festen Antworten, und `world-game-fallen.json` wirkt dort nicht.
- `animal-common-chameleon`: Entdecker-Falle „Kurzschnäuziges Seepferdchen“, obwohl Greifschwanz, unabhängige Augen und Farbwechsel auch zum Seepferdchen passen.
- `invention-internet`: Entdecker-Falle „Das Smartphone“. Für heutige Kinder ist gerade das Smartphone das Gerät zum Informationen-Austauschen.
- → Den Ausschluss auch für die festen Entdecker-Fallen anwenden, oder diese zwei Fallen ersetzen. `person-charles_darwin`–Anning stammt noch aus dem alten Darwin-Hinweis und ist mit dem „Beagle“-Satz unkritisch.

**M4 Unfaire Nahrungs-Fallen** (Oberbegriff und Unterbegriff stehen nebeneinander):
- Eisbär: „Vor allem kleine Säugetiere“ neben „Fleisch“. Die Karte sagt „Vor allem Robben.“, und Robben sind Säugetiere, die kleiner sind als ein Eisbär. Wer die Karte gelesen hat, wählt richtig gedacht falsch. → aus `profi` streichen. Es bleiben 5.
- Axolotl: „Fleisch“ als Falle, obwohl die Karte „kleine Fische“ nennt. Beim Eisvogel hat der `fakten-pruefer` „Fleisch“ genau deshalb gestrichen. → streichen und auffüllen, sonst nur 3.
- Bewusst gut, nicht streichen: Löwe und Bengaltiger mit „Vor allem kleine Säugetiere“. Die Karte sagt „größere Tiere“ bzw. „große Tiere“; das ist eine echte Profi-Denkfalle.

**M5 Personen: Das Pronomen verrät die Lösung oder führt in die Irre** (`app/world-game-support.mjs`, `personRecognitionClue`).
- Zuerst eine Korrektur am Auftrag: Unter den Personenkarten sind **22 von 36 Frauen**, nicht wenige.
- Pronomen- und Berufswort-Hinweise haben 26 Hinweise. Auf Profi verrät das Geschlecht allein die Lösung in etwa 3 von 36 Aufgaben (rund 9 %). Es trifft aber wenige Personen:
  - Neil Armstrong („landete er“, „Ingenieur, Testpilot und Astronaut“) und Nelson Mandela („Er war“, „Präsident“): in **100 %** der Profi-Runden, weil alle Kandidaten aus der Nähe ihrer Jahre Frauen sind.
  - Murasaki Shikibu („Ihr Werk“) und Rabindranath Tagore („seinen Bildern“, „Künstler“): je 40 %.
- **Irreführend:** Darwin („Später erklärte sie“) und Einstein („Ihre berühmteste Formel“). Grammatisch ist das richtig, weil „sie“ sich auf „Diese Person“ bezieht. Andere Männer heißen aber „er“, und Kinder lesen „sie“ als Frau. In 90 % bzw. 100 % der Profi-Runden steht dann eine Frau als passende Falle da.
- Auf Entdecker verraten die festen Fallen 8 Aufgaben (Lovelace, Tu Youyou, Cai Lun, Jemison, Lehmann, Carson, Meitner, Ibn Sina). Das ist dort hinnehmbar.
- **Empfehlung: neutrale Hinweise, keine Fallen gleichen Geschlechts.** Gründe:
  - Gleiches Geschlecht und gleiche Zeit widersprechen sich: Vor 1600 gibt es fast nur Männer, nach 1900 vor allem Frauen.
  - Neutrale Hinweise beheben auch Entdecker und den Irrweg bei Darwin und Einstein.
- **Sofort diese vier**, eigene Sätze in `retained`, Fakten vom `fakten-pruefer` prüfen lassen:
  - Armstrong: „Bei Apollo 11 landete diese Person zusammen mit Buzz Aldrin auf dem Mond. Michael Collins blieb in der Mondumlaufbahn.“
  - Mandela: „… Diese Person war an einem langen politischen Wandel beteiligt und wurde 1994 Staatsoberhaupt von Südafrika.“
  - Darwin: „… Später erklärte diese Person, wie sich Tiere und Pflanzen über sehr lange Zeit verändern.“
  - Einstein: „… Die berühmteste Formel dieser Person ist ganz kurz: E = mc².“
- Der Rest steht unter S6.

### Sollte bald (BACKLOG)

**S1 Nahrung Profi: Muster „Pflanze“ und Dauerfallen.**
- Steht auf Profi genau eine Antwort mit „Pflanze“ (ohne „Seidenpflanzen“), ist sie in **94–95 %** richtig. Das betrifft 19 % der Profi-Aufgaben.
  - Grund: Allgemeine Pflanzentexte („Pflanzen“, „Pflanzliches Material“, „Gräser und andere Pflanzen“ …) kommen nie als Profi-Falle vor.
  - Pflanzenfresser bekommen dagegen die Spezialfutter berühmter Tiere: Eukalyptus heißt Koala, Bambus heißt Panda, Nektar heißt Biene. Kinder schließen dann über das andere Tier aus.
  - „Verschiedene … Nahrung“ (Rotfuchs, Waschbär) ist nie Falle und wiederholt das Wort „Nahrung“ aus der Frage. Ist es die einzige solche Antwort, ist sie zu 100 % richtig.
- 93 % der Profi-Aufgaben zeigen mindestens eine dieser Dauerfallen: Krill (in 26 Profi-Listen), „Vor allem kleine Säugetiere“ (28), „Ameisen und Termiten“ (24), Bambus, Eukalyptus.
- Vorschläge:
  - Für reine Pflanzenfresser „Vor allem Pflanzen, auch kleine Tiere“ und „Früchte, Blätter und auch Insekten“ als Profi-Fallen; der `fakten-pruefer` prüft das.
  - Jeden Text in höchstens etwa 8 Profi-Listen.
  - Die Frage „Was frisst dieses Tier?“ statt „…passt zur Nahrung?“, damit das Wort „Nahrung“ nicht wiederholt wird.

**S2 Lebensraum Profi: Fallen, die auf den ersten Blick falsch sind.**
- „Arktis“ steht in 18 Profi-Listen, oft bei Tieren aus warmen Gegenden (Elefant, Löwe, Gepard, Giraffe, Jaguar, Okapi, Strauß …). „Antarktis“ (18) und „Korallenriffe mit Seeanemonen“ (17) kommen ähnlich oft vor.
- 70 % der Profi-Aufgaben zeigen Antarktis, Arktis, Korallenriff oder „Felsiger Meeresboden“. Das ist fast das alte Muster fester Fallen, das E9 abschaffen wollte.

**S3 Profi ohne echte Profi-Fallen.**
- Lebensraum: Westliche Honigbiene und Feuersalamander haben auf Profi dieselbe Liste wie auf Entdecker. Kurzschnabeligel, Biber, Eisbär und Kaiserpinguin haben auf Profi nur Fallen, die auf den ersten Blick falsch sind.
- Nahrung: Kaiserpinguin (nur Landfutter), Meeresschildkröte (vor M2).
- Vorschlag: Profi lässt Aufgaben weg, die weniger als 3 ähnliche Fallen haben. Das ist ehrlicher als Entdecker unter dem Namen Profi, und der Vorrat bleibt groß (48 Tiere).

**S4 Tierdetektiv.**
- Säugetiere (26 Tiere, eine Gruppe mit 25 Kandidaten) in kleinere Gruppen teilen:
  - Raubtiere an Land: Löwe, Gepard, Tiger, Jaguar, Eisbär, Rotfuchs, Waschbär, Erdmännchen
  - Affen und Lemuren: Gorilla, Orang-Utan, Katta
  - Meeressäuger: Blauwal, Tümmler, Orca, Walross
  - große Pflanzenfresser: Elefant, Giraffe, Okapi, Dromedar, Panda
  - Australien: Känguru, Koala, Schnabeltier, Kurzschnabeligel
  - Igel, Biber
  - Fehlende Plätze aus allen Säugetieren auffüllen; neue Paare prüft vorher der `fakten-pruefer`.
- Der Name steht im Hinweis: Borneo-Orang-Utan („nur auf Borneo“), Schleiereule („Gesichtsschleier“), Schnabeltier („Schnabel“, weil der Kurzschnabeligel ausgeschlossen ist), Gartenkreuzspinne („Kreuz“), Monarchfalter („als Falter“). Auf Entdecker ist das eine willkommene Hilfe. Für Profi braucht es später einen zweiten Hinweis je Tier ohne das bekannteste Merkmal.

**S5 Technik.**
- Profi-Fallen aus denselben Jahren haben nichts mit dem Hinweis zu tun. Beispiele:
  - Kompass gegen Buchdruck, Mikroskop, Batterie
  - Eisenbahn gegen Generator, Kamera, Nähmaschine
- Die Lösung steht schon im Wortlaut: Nähmaschine („Maschine … Naht“), Fahrrad („Hinterrad“), Elektrisches Licht („Feuerlicht … Lampen“).
- Vorschlag: Profi-Fallen aus demselben Bereich nehmen (Verkehr, Nachrichten, Licht und Optik, Energie). Das geht meist nur mit neuen Hinweisen, weil passende Paare sonst mehrdeutig sind (z. B. Auto und Eisenbahn: „ohne Pferd einen Wagen ziehen“). Die Jahreszahlen passen besser zu Experte: „Was wurde zuerst erfunden?“ (S5, Art 3).
- Auf Entdecker kommen die Fallen nur aus den 12 Erfindungen mit Früher/Heute. Aufzug, Generator, Batterie, Seismograf, Transistor, Fahrrad, Kamera und Kühlschrank sind darum nie Falle: Stehen sie da, sind sie zu 100 % richtig. → Entdecker-Fallen aus allen 24 Erfindungen ziehen, mit Ausschluss.

**S6 Personen, der Rest.**
- Alle übrigen Hinweise mit Fürwörtern (er, sie, sein, ihr) oder Berufswörtern, die ein Geschlecht zeigen, neutral fassen, zuerst Murasaki und Tagore. „Wissenschafts-Missionsspezialistin“ (Jemison) verrät das Geschlecht auch.
- Ein Test verbietet diese Fürwörter in den Hinweisen; Ausnahmen kommen auf eine kurze Liste.
- Entdecker für Kleine: nur den ersten Satz des Hinweises zeigen und, wo vorhanden, das Bild der Karte (25 von 36 Personen haben eines).

**S7 Rückmeldung nach falscher Antwort (Frage 5).**
- Auf Entdecker hilft sie. Sie zeigt die falsche Wahl als „richtig für ein anderes Tier“, das beschämt nicht und verbindet Wissen. Beispiel: „Antarktis … passt zu: Kaiserpinguin. Gesucht ist aber: Eisbär.“
- Bei Nahrung auf Profi führt die Schlussfrage „Frisst dieses Tier Pflanzen, andere Tiere oder beides?“ in die Irre. 81 % der Profi-Fallen gehören zur selben Art wie die Lösung (Entdecker: 1 %). Beispiel: Löwe, gewählt „Vor allem kleine Säugetiere“: Das sind auch „andere Tiere“.
- → Auf Profi eine andere Schlussfrage, z. B. „Wie groß ist die Beute, und wo sucht dieses Tier sie?“.
- Ein Text, der zu mehreren Tieren gehört („Savanne“, „Fleisch“), nennt immer das erste Tier. Das „zum Beispiel“ deckt das ab.

**S8 Stufen-Vorschläge fehlen in den Welt-Spielen.** `useStufenVorschlag` nutzt nur `app/kern/karte/wissenskarte.tsx`. Ein Entdecker-Kind, das fünfmal richtig liegt, bekommt kein „Willst du Profi probieren?“. → Wie auf der Karte unter der Rückmeldung in `app/world-games.tsx` einbauen; es zählt die erste Antwort je Aufgabe.

**S9 Tipps für Entdecker sind zu abstrakt.**
- Allgemeine Tipps in `world-game-support.mjs`:
  - Nahrung: „…Entwicklungsstadium…“ passt nur zu 3 Tieren.
  - Personen und Technik: „Vergleiche…“.
- Tierrätsel: z. B. Okapi („Ein ähnliches Muster bedeutet nicht automatisch die gleiche Verwandtschaft“), Katta.
- Vorschläge für Entdecker:
  - Lebensraum: „Lebt das Tier im Wasser, an Land oder auf dem Eis?“
  - Nahrung: „Frisst das Tier Pflanzen, andere Tiere oder beides?“
  - Technik: „Stell dir vor, du hast dieses Problem. Was würdest du benutzen?“

**S10 Den Ratemuster-Test erweitern.** Er soll Wörter finden, die verraten: Steht ein Wort in mindestens 5 % der Aufgaben nur in einer Antwort und ist diese Antwort in mindestens 80 % richtig, schlägt der Test an. Er hätte M1, S1 („Pflanze“, „Verschiedene“) und S5 (Entdecker-Technik) gefunden. Vorlage: `wortverrat.mjs`.

**Kleinkram:** Der Name verrät die Antwort bei Afrikanischer Savannenelefant („Savanne“), Seeadler („Küsten und Seen“), Gartenkreuzspinne („Wiesen und Gärten“) und Monarchfalter („Falter: Nektar“). Auf Entdecker ist das eine Hilfe, auf Profi trivial. Umstellen lohnt erst mit S3.

### Geprüft ohne Befund
- Die Längentests (14 bis 42 %) stimmen mit meinen Läufen überein. Bei Tierdetektiv und Personen fand die Wortsuche nichts Auffälliges.
- Gute, faire Profi-Fallen, weil die Karte das Wissen vermittelt:
  - Koala: „Wald“ gegen „Regenwald“ (Karte: Eukalyptuswälder)
  - Panda: „Gebirge“ gegen „Regenwald“ (kühle Bergwälder)
  - Löwe und Tiger: „Vor allem kleine Säugetiere“
  - Tierdetektiv bei Vögeln (Seeadler, Eisvogel, Papageitaucher) und Sepia gegen Gartenkreuzspinne
  - Personen mit Jahreszahl im Hinweis (1843, 1925, 1967, 11. Jahrhundert) und Kandidaten aus derselben Zeit
- Keine Uhr. Falsche Antworten kann man erneut versuchen (der Knopf sperrt erst bei richtig). „Zu schwer? Zurück zu Entdecker“ steht auf Profi und Experte.
- Experte sagt ehrlich: „Experte gibt es hier noch nicht. Du spielst Profi.“ Mischen und neue Runden mit dem Auswahl-Helfer funktionieren.
- Lücke für Experte: Passend wären „Was wurde zuerst erfunden?“ für Technik und Personen (S5, Art 3, Jahreszahlen sind schon da) und „Warum hätte Tier X in Lebensraum Y ein Problem?“ für Lebensraum (S5, Art 1).

### Grenzen der Prüfung
- Kein Kindertest. Ob 6-Jährige mit Vorlesen durch Tierdetektiv und Technik kommen und ob 11-Jährige Profi als knifflig erleben, zeigt nur ihre Rückmeldung.
- „Auf den ersten Blick falsch“ ist meine eigene Einteilung: Wasser, Land oder Pol; Pflanzen, Tiere oder beides. Sie ist grob; bei Allesfressern (Katta, Waschbär) ist sie ungenau.
- Fakten habe ich nicht geprüft. Neue Fallen und neue Hinweise aus M2 bis M5 und S1 bis S6 brauchen zuerst den `fakten-pruefer`, Formulierungen die `kinder-redaktion`.
- Nicht im Browser gespielt; nur Daten, Code und simulierte Runden. Ob ein Kind die Muster aus M1 und S1 wirklich bemerkt, kann ich nicht sagen; sie sind aber durchgehend und damit erlernbar.

Fundstellen: `/home/user/wunderkompass/app/world-game-bank.ts`, `/home/user/wunderkompass/app/world-game-runde.ts`, `/home/user/wunderkompass/app/world-game-support.mjs`, `/home/user/wunderkompass/app/world-game-tier-fallen.json`, `/home/user/wunderkompass/app/world-game-fallen.json`, `/home/user/wunderkompass/app/animal-detective-clues.json`, `/home/user/wunderkompass/app/world-games.tsx`.

## Umsetzung (Claude, 24.11.2026)

Folgt.
