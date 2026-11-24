# Welt-Spiele, neue Texte: Kinder-Redaktion

Stand: 24.11.2026. Bericht der `kinder-redaktion` zu den neuen Texten aus PR 1 von Teil B (neun eigene Personen-Rätsel, einheitliche dritte Antwort bei „Früher oder heute?“, Stufentext Profi, Neuigkeit), Code-Stand nach Commit „Helferbefunde eingearbeitet (Zwischenstand)“. Wörtlich übernommen. Was Claude daraus gemacht hat, steht am Ende.

Bash stand mir nicht zur Verfügung, darum konnte ich den node-Befehl nicht ausführen. Die automatischen Rätsel habe ich aus `personRecognitionClue` und den `intro`-Feldern in `/home/user/wunderkompass/app/world-catalog.json` hergeleitet.

### 1. Gesamteindruck
Note: **geht so, mit Tendenz zu gut.** Die neun eigenen Rätsel sind klarer und konkreter als die automatischen. „Diese Person“ liest sich meist flüssig. Vier Sätze sind aber noch zu schwer: Murasaki, Jemison, al-Chwarizmi und der Schluss bei Mandela. Beim Einstein-Rätsel gibt es einen Zweifel an der Quelle. „Nur ein Zukunftswunsch“ würde ich ersetzen. Stufentext und Neuigkeit sind fast fertig.

### 2. Befunde

**Punkt 1: Neun Personen-Rätsel** (`/home/user/wunderkompass/app/world-game-support.mjs`, `EIGENE_RAETSEL`)

- **Darwin: passt.** 11 und 14 Wörter, konkret, steht so auf der Karte. Es gibt nur eine kleine Holperstelle: zweimal „diese Person“. Wer möchte, nimmt diese Fassung: „Fünf Jahre lang reiste diese Person mit dem Schiff „Beagle“ um die Welt. Später erklärte diese Person, wie sich Tiere und Pflanzen über sehr lange Zeit verändern.“
- **Einstein: ändern.**
  - Zweifel an der Quelle: Weder „Zeit vergeht nicht überall gleich schnell“ noch „E = mc²“ steht in der Karte `person-albert_einstein`. Ich habe intro, paragraphs, more, surprise und question geprüft, und „mc²“ kommt im ganzen Katalog nicht vor. Damit verstößt das Rätsel gegen „nur aus der Karte“. Das Kind kann die Formel auf der Karte also nicht wiederfinden.
  - Sprache: „Von dieser Person stammt“ klingt steif. Die Formel wird vorgelesen etwa zu „E gleich m c hoch 2“.
  - Vorschlag mit Inhalt aus der Karte: „Diese Person erforschte Licht, Raum und Zeit. Dabei half ein Trick: sich etwas ganz genau vorstellen und überlegen, was dann passiert.“
  - Soll die Formel bleiben, muss sie erst auf die Karte (Sache des `fakten-pruefer`). Dann besser so: „Diese Person fand heraus: Die Zeit vergeht nicht überall gleich schnell. Diese Person schrieb auch eine berühmte, ganz kurze Formel auf: E = mc².“
- **Karl Benz: ändern.** „Benzinmotor“ enthält „Benz“. Der Test prüft nur ganze Wörter (`\b`), darum fällt das nicht auf. Ein Kind hört aber den Namen heraus. Außerdem ist „Wagen“ ohne Bild sehr blass. Vorschlag aus Karte und Stufen-Text: „Diese Person entwickelte einen frühen Motorwagen. Den musste kein Pferd mehr ziehen.“ (6 und 6 Wörter)
- **al-Chwarizmi: ändern.** „Algebra“ wird nicht erklärt. Die Karte erklärt das Wort selbst: „Algebra hilft, mit unbekannten Zahlen zu rechnen.“ Vorschlag: „Diese Person schrieb in Bagdad wichtige Bücher übers Rechnen. Darin geht es auch um Algebra, das Rechnen mit unbekannten Zahlen.“ Achtung: kein „sie“ für die Bücher verwenden, der Test schlägt sonst an.
- **Armstrong: kann bleiben, besser umstellen.** 13 Wörter, und „Apollo 11“ wird nicht erklärt. Das Spannende sollte vorn stehen: „Diese Person landete mit Buzz Aldrin auf dem Mond. Die Reise hieß Apollo 11.“ (9 und 4 Wörter)
- **Mandela: ändern.**
  - Gut: Das Fachwort wird gleich erklärt.
  - Für 5- bis 7-Jährige ist „staatliches System … rassistische Gesetze“ zu abstrakt. „An die Spitze des Landes kommen“ ist ein Bild, das Kinder wörtlich nehmen können.
  - Vorschlag: „Diese Person kämpfte in Südafrika gegen die Apartheid. So hießen Gesetze, die Menschen ungerecht behandelten und ihnen weniger Rechte gaben. 1994 wurde diese Person das Oberhaupt des Landes.“
  - „Weniger Rechte“ steht so auf der Karte: „gab ihnen ungleiche Rechte“. „Oberhaupt“ verrät kein Geschlecht, „Präsident“ würde es tun.
- **Murasaki Shikibu: ändern, das ist das schwerste Rätsel.**
  - Satz 1 hat 15 Wörter, dazu „Kaiserhof“ und „frühes 11. Jahrhundert“.
  - Satz 2 ist abstrakt („Werk“, „Generationen“, „neu gedeutet“) und hilft beim Erkennen nicht.
  - Vorschlag: „Diese Person lebte vor rund 1000 Jahren am Hof des Kaisers von Japan. Dort schrieb diese Person die Geschichte vom Prinzen Genji.“ (13 und 9 Wörter; die Zahl ist in einen Vergleich übersetzt)
- **Tagore: ändern, aber nur leicht.** „Auf den Bildern dieser Person konnten … entstehen“ ist steif und passiv. Vorschlag: „Diese Person schrieb Gedichte, Geschichten und Lieder. Außerdem malte diese Person Bilder: Aus frei gezogenen Linien wurden neue Formen.“
- **Jemison: ändern.**
  - „verband Medizin, Technik und Raumfahrt“ ist abstrakt.
  - „Endeavour“ ist ein englisches Wort ohne Erklärung.
  - „Weltraumlabor der Endeavour“ verstehen Kinder nicht.
  - Vorschlag: „Diese Person kannte sich mit Medizin und Technik aus. 1992 flog diese Person mit dem Raumschiff Endeavour ins All und forschte dort.“
- **Muster in den automatischen Rätseln: wichtig, gehört aber nicht zu den neun.** Die Fürwort-Regel gilt nur für die eigenen Rätsel. In den Rätseln aus den Karten-Einleitungen steht weiter, ob ein Mann oder eine Frau gesucht ist:
  - „ihre“: Curie, Goodall („Mit 26 Jahren begann diese Person ihre Forschung“, das sichert sogar ein Test in `tests/world-game-runde.test.mjs` ab)
  - „Sie“ oder „sie“: Lovelace, Carson, Lehmann
  - „Ihre“: Tu Youyou, Merian
  - „Seine“ oder „Sein“: Cai Lun, Gutenberg, Hokusai
  - „er“: Humboldt
  - Wangari Maathai: Die Einleitung beginnt ohne Namen mit „Sie setzte sich … gemeinsam mit vielen Frauen …“. Das Rätsel lautet also wörtlich „Wer passt zu diesem Hinweis? Sie setzte sich …“.
  - Auf Profi mit vier Namen schließt das oft Antworten aus.
  - Dazu sind einige Einleitungen viel schwerer als die neuen Rätsel, etwa Bertha Benz („Bedingungen sichtbar, die ein Test am selben Platz nicht erfasst“), Cai Lun, Gutenberg, Tu Youyou („Artemisinin“) und Tim Berners-Lee („CERN“, „World Wide Web“).
  - Vorschlag: Eigene Rätsel als nächsten Schritt auf diese Karten ausdehnen, zuerst Goodall, Maathai, Lovelace, Bertha Benz und Cai Lun.

**Punkt 2: „Früher oder heute?“** (`/home/user/wunderkompass/app/world-game-bank.ts`, `DRITTE_ANTWORT`)

Urteil: **ändern zu „Erst in der Zukunft“.**

Gründe:
- Die drei Antworten bilden dann eine Zeitreihe: Früher, Heute, Zukunft. Genau so heißen die Stufen auf der Erfindungskarte (`stages`: „Früher“, „Heute“, „Zukunft“). Das Kind kennt die dritte Schublade schon von der Karte.
- Die Antwort ist eine echte Falle. Die Zukunft-Texte der Karten („Licht könnte noch sparsamer werden“) beschreiben Wünsche, und das Kind muss unterscheiden: Gibt es das schon?
- „Zukunftswunsch“ ist ein langes zusammengesetztes Wort. Erstleser mit 6 oder 7 Jahren tun sich damit schwer, und „Nur ein …“ klingt etwas abwertend.

Gegen „Gab es noch nie“ spricht:
- Die Antwort ist doppeldeutig. Bei einem Heute-Satz („LED-Lampen …“) denkt ein Kind leicht: „Das gab es früher noch nie“, und wählt sie, obwohl der Gedanke stimmt.
- Sie fällt aus der Zeitreihe heraus und ist bei einem konkreten Satz leicht auszuschließen. Damit ist sie eine schwache Falle.

Zwei Hinweise für die Umsetzung:
- Gespeicherte Heute-Runden enthalten „Nur ein Zukunftswunsch“. `validWorldGameOrder` übersetzt im Moment nur bei Früher-Aufgaben eine alte Antwort, das müsste dann auch für Heute gelten. Außerdem gehören die alten Texte in die Fixtures `gespeicherte-antworten*.json`.
- Die Kompass-Aufgabe nutzt eine eigene `comparisonQuestion` mit „Früher und heute / Nur früher / Nur heute“. Dort gilt die einheitliche dritte Antwort also nicht.

**Punkt 3: Stufentext Profi** (`/home/user/wunderkompass/app/kern/stufen-wahl.tsx`)

Urteil: **kann bleiben, besser „etwas kniffliger“.**

Gründe:
- „Fallen“ klingt nach „wir wollen dich reinlegen“.
- Erstleser können „Fallen“ als Verb lesen (hinfallen).
- Mit 29 Zeichen ist der Text der längste der drei Untertitel.

„etwas kniffliger“ ist auf Karten und in Spielen immer wahr und zeigt eine klare Steigerung: „zum Reinkommen“, dann „etwas kniffliger“, dann „nachdenken und kombinieren“. Als Alternative mit Tätigkeitswort passt „genau hinschauen“, das ist ehrlich, weil man Fallen nur durch genaues Lesen erkennt.

**Punkt 4: „Was ist neu?“, Eintrag `spiele-mit-stufen`** (`/home/user/wunderkompass/app/kern/neuigkeiten.ts`)

Urteil: **ändern, aber nur leicht.**
- Das Kind weiß nicht, welche sechs Spiele gemeint sind.
- „gilt jetzt deine Stufe“ ist abstrakt.
- „Was du falsch hattest“ ist nicht schlimm, aber unnötig auf Fehler gerichtet.

Vorschlag:
- Titel: „Spiele mit Stufen“
- Text: „Sechs Wissensspiele haben jetzt Stufen, zum Beispiel „Wer war das?“. Als Profi gibt es mehr Aufgaben und meist vier Antworten. Schwierige Aufgaben kommen später noch einmal.“

Ob „Schwierige Aufgaben“ sachlich genau trifft (bisher hieß es „falsch beantwortete“), soll Claude prüfen. Sonst geht auch: „Was noch nicht geklappt hat, kommt später noch einmal.“

### 3. Vorschlag für „Mehr erfahren“
Das betrifft nur die Karten, die Spiele haben kein „Mehr erfahren“:
- Wenn „E = mc²“ und die Zeit-Aussage bleiben sollen, gehören sie in `more` der Einstein-Karte. Das Rätsel darf erst darauf zugreifen, wenn es dort steht.
- Der Murasaki-Satz über Generationen und Deutungen kann ganz aus dem Rätsel heraus, er steht ja schon auf der Karte.

### 4. Unsicher
- Ob „Oberhaupt“ (Mandela), „vor rund 1000 Jahren“ (Murasaki) und „Raumschiff“ für die Raumfähre (Jemison) fachlich so tragen, prüft der `fakten-pruefer`.
- Ein Ratemuster bei „Früher oder heute?“ gehört eher zum `stufen-pruefer`: Früher-Sätze stehen fast immer im Präteritum („hatte“, „wurde“, „nutzten“), Heute-Sätze im Präsens. Ältere Kinder lösen das über die Grammatik, egal wie die dritte Antwort heißt.
- Ob „kniffligere Fragen und Fallen“ bei 320 px auf dem Knopf umbricht, prüft der `design-pruefer`.

### Sofort ändern
1. Einstein: Inhalt aus der Karte nehmen oder erst die Karte ergänzen.
2. Karl Benz: „Benzinmotor“ ersetzen.
3. Murasaki, Jemison, al-Chwarizmi, Mandela: Fassungen wie oben.
4. `DRITTE_ANTWORT` auf „Erst in der Zukunft“ ändern, mit Altantwort für gespeicherte Heute-Runden.
5. Neuigkeit `spiele-mit-stufen`: Fassung wie oben.
6. Als nächster Schritt: eigene Rätsel ohne „ihre“, „seine“, „Sie“ und „er“ für die automatischen Personen-Rätsel, zuerst Maathai, Goodall, Lovelace, Bertha Benz und Cai Lun.

### Kann bleiben
- Darwin, eventuell mit der kleinen Umstellung.
- Armstrong; die Umstellung wird empfohlen, ist aber nicht nötig.
- Tagore, wenn auch steif.
- Profi-Stufentext; besser wäre „etwas kniffliger“.

## Nachprüfung der überarbeiteten Fassungen (kinder-redaktion, 24.11.2026)

Bericht des Helfers zu den Fassungen aus Commit `7fd9fd8`, wörtlich übernommen:

Kurz gesagt: Die Texte sind gut. Zwei Rätsel würde ich noch leicht ändern, alles andere passt. Ich habe nichts geändert.

**1. `EIGENE_RAETSEL`**

Alle neun Sätze halten die Regeln ein. Kein Satz enthält einen Teil des Namens, auch nicht mitten im Wort. Kein Wort verrät, ob ein Mann oder eine Frau gesucht ist. „Prinz“ und „Kaiser“ meinen andere Menschen, nicht die gesuchte Person. „Oberhaupt“ und „Raumfähre“ sind gut gewählt. Ein Grenzfall ist „Algebra“, weil das Wort mit „Al“ anfängt. Das ist aber nur ein Artikel und verrät beim Vorlesen nichts.

- **Darwin: passt.** „Generationen“ ist das einzige schwere Wort. Es steht so auf der Karte, und beim Vorlesen kann ein Elternteil es erklären.
- **Einstein: ändern, nur leicht.** Im zweiten Satz liegen zwischen „stellte“ und „vor“ fünf Wörter: „stellte sich diese Person Dinge ganz genau vor“. Wer vorliest, gerät da ins Stolpern, und der Satz hat 15 Wörter. Der Inhalt steht auf der Karte (Gedankenexperiment). Fassung: „Diese Person untersuchte Licht, Raum und Zeit. Oft spielte diese Person im Kopf ganz genau durch: Was passiert dann?“
- **Benz: ändern.** „So ein Wagen fährt mit einem Motor.“ sagt nur noch einmal, was in „Motorwagen“ schon steckt. Das Kind lernt nichts dazu und erkennt die Person dadurch nicht besser. Fassung nach der Karte (intro und paragraphs[1]): „Diese Person entwickelte einen frühen Motorwagen. Dafür mussten Motor, Lenkung und Bremsen gut zusammenpassen.“
- **al-Chwarizmi, Armstrong, Murasaki Shikibu, Tagore, Jemison: passt.** („Raumfähre“ erklärt das englische „Endeavour“ genug; durch „des Kaisers“ ist klar, dass „Hof“ keinen Bauernhof meint.)
- **Mandela: passt.** Wer mag, macht den ersten Satz glatter: „Diese Person kämpfte in Südafrika gegen die Apartheid.“ Nötig ist das nicht.

**2. „Erst in der Zukunft“: passt.** Die Antworten ergeben eine klare Zeitreihe, die das Kind schon von der Erfindungskarte kennt. Kurz, ehrlich, nicht abwertend.

**3. Profi-Text „etwas kniffliger“: passt.** Die drei Stufen steigern sich gut.

**4. Neuigkeit `spiele-mit-stufen`: passt.** „Wer war das?“ heißt im Spiel wirklich so; der Schlusssatz stellt keine Fehler in den Vordergrund.

**Unsicher:** Bei Benz steht Bertha Benz vielleicht als Antwort zur Wahl, und die Karte nennt sie auch beim Motorwagen. „Entwickelte“ trennt die beiden zwar, aber ob das jüngeren Kindern reicht, sollte der `stufen-pruefer` ansehen.

## Umsetzung (Claude, 24.11.2026)

Erster Bericht (umgesetzt in `7fd9fd8`):
- **Einstein:** ohne E = mc² und ohne die Zeit-Aussage, nur aus der Karte (Licht, Raum und Zeit, Gedankenexperiment).
- **Benz:** „Benzinmotor“ ersetzt. Der Test prüft lange Namensteile jetzt auch mitten im Wort (`tests/world-game-learning-copy.test.mjs`).
- **al-Chwarizmi, Armstrong, Tagore, Jemison:** Fassungen übernommen. Bei Jemison „Raumfähre“ statt „Raumschiff“ (genauer, die Karte sagt „Space Shuttle“).
- **Murasaki:** „vor über 1000 Jahren“ statt „vor rund 1000 Jahren“ (fakten-pruefer: das Genji entstand bis etwa 1012), „Erzählung“ statt „Geschichte“.
- **Mandela:** Die Erklärung der Apartheid folgt der Karte („teilte Menschen in Gruppen ein und gab ihnen ungleiche Rechte“) statt „Gesetze, die Menschen ungerecht behandelten“. „Oberhaupt des Landes“ übernommen.
- **Darwin:** „Lebewesen über viele Generationen“ (fakten-pruefer), „Fast fünf Jahre“; „um die Welt“ fehlt, weil es nicht auf der Karte steht.
- **Fürwörter:** Alle neun eigenen Rätsel kommen ohne „er“, „sie“, „sein“ und „ihr“ aus; ein Test sichert das.
- **Automatische Rätsel mit Fürwörtern** (Curie, Goodall, Lovelace, Maathai und andere): nicht in diesem PR. Steht im `BACKLOG.md`, Punkt 25 („Personen-Hinweise verraten das Geschlecht“).
- **„Erst in der Zukunft“:** übernommen. Gespeicherte Runden mit „Noch keine wirkliche Entwicklung“ (Früher) oder „Nur ein Zukunftswunsch“ (Heute) laufen weiter (`ALTE_DRITTE_ANTWORT` in `app/world-game-bank.ts`, eigener Test). Die Antwortlisten unter `tests/fixtures/` decken nur Kartenfragen ab, darum gibt es dort keinen Eintrag.
- **Profi-Text:** „etwas kniffliger“.
- **Neuigkeit:** „Was noch nicht geklappt hat, kommt später noch einmal“, denn so arbeitet die Wiederholung wirklich (falsch beantwortete Aufgaben). Danach auf 150 Zeichen und zwei Sätze gekürzt, weil der Test für „Was ist neu?“ das verlangt: „Sechs Wissensspiele wie „Wer war das?“ haben jetzt Stufen. Als Profi gibt es mehr Aufgaben, und was noch nicht geklappt hat, kommt später noch einmal.“ Gestrichen ist dabei „meist vier Antworten“.
- **Präteritum/Präsens bei „Früher oder heute?“:** Das ist ein Ratemuster und steht im `BACKLOG.md`, Punkt 25 („Früher oder heute? neu fassen“).

Nachprüfung:
- **Einstein:** „Dabei spielte diese Person im Kopf ganz genau durch: Was passiert dann?“ Das ist die Fassung der Redaktion ohne „Oft“: Wie häufig, steht auf keiner Karte. Der fakten-pruefer hat bestätigt, dass die Methode (Gedankenexperiment) gedeckt ist.
- **Benz:** Fassung übernommen. Sie ist durch die Karte gedeckt: „Bei einem brauchbaren Motorwagen mussten Motor, Übertragung, Fahrwerk, Lenkung und Bremsen zusammenpassen.“ Bertha Benz bleibt bei Benz als Antwort ausgeschlossen (`AUSSCHLUSS`), auch auf Entdecker. Die Frage aus „Unsicher“ ist damit erledigt.
- **Mandela:** „setzte sich … ein“ bleibt, so steht es auch auf der Karte. Neu ist auf Rat des fakten-pruefers „nach der Hautfarbe“. Das Wort „ihrer“ fällt weg, weil der Fürwort-Test es zu Recht nicht von „ihr“ für eine Person unterscheidet.
