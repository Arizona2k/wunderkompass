# Technik-Auflösungen, Nachtrag: Auto, Smartphone, Kamera und Tipp (Entwurf, 25.11.2026)

Helfer: `karten-autor` (opus/high), nach dem [Spieltest](2026-11-25-spieltest-technik-aufloesung.md) (Soll 1 bis 3) und der [Design-Prüfung](2026-11-25-technik-aufloesung-design.md) (Soll 2). Ungeprüfter Entwurf; geprüft wird unabhängig.

Ich habe keine Dateien geändert und meine Texte nicht selbst als geprüft eingestuft. Gelesen habe ich die Endfassung mit den Regeln unter „Nachgezählt“, den Spieltest, die Stufenprüfung und die Kinder-Redaktion dazu. Dazu kamen die drei Karten in `app/world-catalog.json` und der Aufgabenbau in `app/world-game-bank.ts` (Zeile 51). Die Grenzen der Endfassung habe ich mit einem eigenen Zählskript nachgezählt: `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/karten-autor/pruef.cjs`, Fassungen in `.../karten-autor/d4.json`.

## 1. Auflösungen (je A und B, Empfehlung zuerst)

```json
{
 "invention-car-A": "Das Auto hat oft einen Motor, in dem Benzin verbrennt. Heißes Gas drückt darin einen Stempel nach unten. Wie beim Treten in die Pedale wird daraus eine Drehung für die Räder.",
 "invention-car-B": "Das Auto hat oft einen Motor, in dem Benzin verbrennt. Heißes Gas braucht viel Platz und schiebt ein Metallteil weg. Das passiert viele Male pro Sekunde und dreht die Räder.",
 "invention-smartphone-A": "Das Smartphone verwandelt deine Stimme in unsichtbare Funkwellen, wie beim Radio. Ein naher Mast fängt sie auf und reicht sie weiter. Gehst du weg, übernimmt ein anderer Mast.",
 "invention-smartphone-B": "Das Smartphone merkt, wo dein Finger das Glas berührt. Darunter liegt ein Netz aus feinen Leitungen. Dein Finger leitet Strom und verändert es dort, ein Wollhandschuh nicht.",
 "invention-camera-A": "Die Kamera lenkt Licht mit einer Linse auf Millionen winziger Felder. Jedes Feld macht aus Licht etwas Strom: viel Licht, viel Strom. Gespeichert ergeben alle Werte das Foto.",
 "invention-camera-B": "Die Kamera lenkt Licht mit einer Linse auf einen Film. Licht verändert winzige Körnchen darin, wie Sonne ein Plakat ausbleicht. Heute messen meist elektronische Bauteile das Licht."
}
```

**Auto:**
- **Empfehlung A.** Das Bild mit den Pedalen zeigt, wie aus Auf und Ab eine Drehung wird.
- **B** bringt dafür etwas zum Staunen für Größere: „viele Male pro Sekunde“.
- **Benz:** Die Karte schreibt fünfmal „Karl Benz“. Ich lasse den Namen aber ganz weg, weil der Platz für das „Wie“ gebraucht wird.
- **Kein Strom und kein Elektroauto:** Die Stufenprüfung hatte „oder Strom“ gestrichen, weil es mit der Heute-Aufgabe in „Früher oder heute?“ kollidiert.
- **Keine Zeitwörter:** Beide Fassungen stehen in der Gegenwart. Sie widersprechen der Heute-Aufgabe („Verbrennungsmotor, Elektromotor oder beiden“) nicht.
- **„Stempel“** steht für „Kolben“, damit es ohne Fachwort geht.

**Smartphone:**
- **Empfehlung A.** Sie beantwortet direkt das Problem der Aufgabe: unterwegs telefonieren.
- „Funk“ ist jetzt erklärt („unsichtbare Funkwellen, wie beim Radio“). Das fehlte laut Kinder-Redaktion.
- **B** erklärt das Tippen auf dem Bildschirm, mit dem Handschuh als Alltagsbild. Sie passt zu „Informationen bearbeiten“.
- In beiden Fassungen steht weder „Telefon“ noch „Computer“, „Kamera“, „Internet“ oder „Satellit“.

**Kamera:**
- **Empfehlung A.** Sie gilt für fast alle Kameras von heute, auch die im Handy. Sie beantwortet die Frage der Karte: „viel Licht, viel Strom“, Feld für Feld, und das wird gespeichert.
- **B** zeigt am deutlichsten, dass Licht Stoffe verändert. Das Plakat ist dafür das Alltagsbild. Dafür gilt sie vor allem für Film.
- Beide nennen jetzt eine Linse statt eines kleinen Lochs.
- Die Kamera kommt in „Früher oder heute?“ nicht vor (Karte mit Walkthrough), deshalb schadet „Heute“ in B nicht.

## 2. Tipp für das ganze Spiel (Schlüssel `technology`)

Die Aufgaben fangen alle mit einer von drei Fragen an:
- „Welche Erfindung hilft bei diesem Problem? …“ (12 Karten),
- „… passt zu dieser Forscherfrage? …“ (11 Karten),
- „… passt zu dieser Beschreibung? …“ (nur das Fernrohr).

Die Antworten sind 3 oder 4 Erfindungsnamen. Alle drei Fassungen funktionieren auch hinter „Du hast „X“ gewählt.“ und nennen keine Lösung.

- **T-A (Empfehlung):** „Welches Wort in der Frage ist das wichtigste? Überlege bei jeder Erfindung: Was macht sie genau?“ (96 Zeichen; 8/8 Wörter)
- **T-B:** „Stell dir jede Erfindung bei der Arbeit vor. Welche schafft genau das, was in der Frage steht?“ (94; 8/9)
- **T-C:** „Lies jede Antwort und frag dich: Wozu ist dieses Ding da? Passt das zur Frage?“ (78; 11/4)

**Vorschlag, braucht Code:** ein eigener Satz nach einer falschen Antwort, so wie bei den Menschen (`PERSONEN_FALSCH_PROFI`):
- „Du hast „X“ gewählt. Was macht diese Erfindung genau? Passt das zu dem, was gefragt ist?“ (67 Zeichen ohne Anfang; 5/7)

Das geht leichter als der doppelte Tipp-Satz. Ob der Satz eingebaut wird, entscheidest du.

## 3. Quellen (⚠ = `fakten-pruefer` bitte besonders prüfen)

**Auto:**
- Verbrennung im Zylinder, das Gas schiebt den Kolben, der dreht die Kurbelwelle und über Zahnräder die Räder: US Department of Energy, „Internal Combustion Engine Basics“, https://www.energy.gov/eere/vehicles/articles/internal-combustion-engine-basics. Selbst geöffnet: „The expanding combustion gases push the piston, which in turn rotates the crankshaft … drives the vehicle's wheels.“
- Gleicher Ablauf auf Deutsch, dazu Überdruck und Kurbelwelle: Uni Bamberg, Grundschuldidaktik, „Sachanalyse Ottomotor“, https://www.uni-bamberg.de/fileadmin/grundschuldidaktik/Unterrichtsvorschlaege_Ottomotor/Sachanalyse_Ottomotor.pdf. Selbst gelesen.
- ⚠ **Vergleich mit den Pedalen:** Gemeint ist das Prinzip der Kurbel (Tretkurbel und Kurbelwelle). Belegt habe ich ihn nur mit Ratgeberseiten (Haynes, Art of Manliness), nicht mit einem Museum.
- ⚠ **„oft“ Benzin:** Diesel ist mitgemeint, wird aber nicht genannt.
- ⚠ **„nach unten“ (A):** Das stimmt nur für stehende Zylinder.
- ⚠ **„viele Male pro Sekunde“ (B):** Das ist nachgerechnet, nicht zitiert. Im Leerlauf mit rund 800 Umdrehungen pro Minute und 4 Zylindern im Viertakt sind das etwa 27 Arbeitstakte pro Sekunde. Grundlage: zwei Umdrehungen je Arbeitsspiel (Uni Bamberg).

**Smartphone A:**
- Jede Funkzelle hat eine Antenne, die per Funk mit den Handys in der Nähe verbunden ist. Weiter geht es über Glasfaser oder Richtfunk: Bundesamt für Umwelt BAFU (Schweiz), „Mobil telefonieren: Wie funktioniert das?“, https://www.bafu.admin.ch/de/mobil-telefonieren-wie-funktioniert-das. Selbst geöffnet.
- ⚠ **Wechsel zum nächsten Mast:** Steht nicht auf der BAFU-Seite. Möglicher Beleg ist das Unterrichtsmaterial des BfS zum Mobilfunk (Archiv), https://archiv.bge.de/archiv/www.asse.bund.de/SharedDocs/Downloads/BfS/DE/broschueren/unterricht-mobilfunk/mobilfunk-unterricht1e808.pdf. Nicht geöffnet.
- ⚠ **„verwandelt deine Stimme in Funkwellen“:** stark vereinfacht. Eigentlich wird die Stimme erst ein elektrisches, digitales Signal und dann Funk.

**Smartphone B:**
- Ein Netz aus Elektroden liegt unter der Oberfläche, und Menschen leiten Strom gut: MIT School of Engineering, „How do touch-sensitive screens work?“, https://engineering.mit.edu/ask-an-engineer/how-do-touch-sensitive-screens-work. Selbst geöffnet.
- Wollhandschuhe leiten nicht, der Bildschirm reagiert nicht: Washington State University, Ask Dr. Universe, „How do touch screens work?“, https://askdruniverse.wsu.edu/2021/03/06/touch-screens-work/. Selbst geöffnet.
- ⚠ **„verändert es dort“:** Gemeint ist die Kapazität bzw. das elektrische Feld, also eine Vereinfachung.
- ⚠ **„Darunter“ (unter dem Glas):** Belegt nur durch eine Studentenzeitschrift der USC. Nicht geöffnet.

**Kamera:**
- Linsen formen ein helles, scharfes Bild; heute zeichnet oft ein elektronischer Sensor auf: die Karte selbst (`stages[3]`, `paragraphs`) mit ihren Quellen vom Science and Media Museum.
- ⚠ **A, Felder:** Jedes Bildfeld wird je nach Lichtmenge elektrisch geladen. Beleg: Canon Science Lab, https://global.canon/en/technology/s_labo/light/003/04.html. Das ist eine Herstellerseite, nur über die Suche gesehen. Die Library of Congress (Everyday Mysteries, „How does a digital camera work?“) und Britannica gaben mir 403. „etwas Strom“ steht für „elektrische Ladung“.
- ⚠ **A, „Millionen“:** gilt für heutige Sensoren.
- ⚠ **B, Film:** Licht verändert Silbersalz-Körnchen im Film, sichtbar wird es erst beim Entwickeln. Möglicher Beleg: Britannica, „Technology of photography: Black-and-white films“, https://www.britannica.com/technology/technology-of-photography/Black-and-white-films. Nicht geöffnet (403).
- ⚠ **B, Plakat:** Der Vergleich mit dem Ausbleichen ist chemisch nicht derselbe Vorgang. Gemeinsam ist nur: Licht verändert Stoffe.

## 4. Zahlen (nachgezählt mit `node`)

| Fassung | Zeichen | Wörter je Satz | Zahlen | Titelanfang | Satz aus dem Hinweis | anderer Titel oder Alias | höchste Wortüberlappung mit der Karte |
|---|---|---|---|---|---|---|---|
| car-A | 174 | 10/8/13 | 0 | ok | nein | nein | 0,17 |
| car-B | 173 | 10/10/10 | 0 | ok | nein | nein | 0,30 |
| smartphone-A | 175 | 11/10/7 | 0 | ok | nein | nein | 0,22 |
| smartphone-B | 173 | 9/7/11 | 0 | ok | nein | nein | 0,18 |
| camera-A | 174 | 11/11/6 | 0 | ok | nein | nein | 0,50 * |
| camera-B | 180 | 10/10/7 | 0 | ok | nein | nein | 0,30 |

\* Bei camera-A teilt sich Satz 3 nur „Foto“, „gespeichert“ und „das“ mit dem Kartensatz „Das umgekehrte Bild darin ist noch kein Foto, denn es wird nicht gespeichert.“ Das ist kein fast wörtlicher Satz.

- „Motor“ ist erlaubt: Es gibt keine Erfindungskarte „Motor“.
- „Licht“ und „Strom“ sind erlaubt: Nur der volle Titel „Elektrisches Licht“ zählt, wie schon bei Fernrohr und 3D-Druck.

Alle Texte haben 3 Sätze. Gezählt sind sie bei den Grenzen der Endfassung, außer camera-B: Mit 180 Zeichen liegt sie genau auf der Grenze. Stufenzahlen und Ratemuster entfallen, weil es hier keine Antworten gibt.

## 5. Umformuliert

Keine gespeicherten Antworten betroffen: Auflösung und Tipp sind keine Antwortoptionen.

## 6. Offen

1. **„Pedale“ (car-A)** erinnert an das Fahrrad. Das ist kein Titel und kein Alias, nach der Regel also erlaubt. Ob es zu nah dran ist, soll die `stufen-pruefer` sagen.
2. **„Linse“** kann für 5- bis 7-Jährige an die Hülsenfrucht denken lassen. Die `kinder-redaktion` sollte entscheiden: „Linse“, „Glaslinse“ (stimmt nicht bei jeder Handykamera, viele haben Kunststofflinsen) oder „eine Art Lupe“.
3. **„Stempel“ für Kolben** und **„ein naher Mast“**: Klingen sie für Kinder natürlich? Das soll die `kinder-redaktion` prüfen.
4. **Nicht mein Auftrag, gesehen beim Lesen:**
   - Die Spielkarte in `app/world-games.tsx` (Zeile 33) verspricht „Welche Teile gehören dazu?“, aber keine Aufgabe fragt nach Teilen.
   - Die Forscherfrage beim Mikroskop („Wie werden kleine Strukturen unterscheidbar?“) ist für 7-Jährige schwer (Spieltest, „Kann“). Ein Vorschlag dafür könnte als eigenes Paket kommen.

Dateien:
- `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/wt-tech/app/world-game-support.mjs` (Objekt `TECHNIK_AUFLOESUNG`, ab Zeile 100; Tipp in Zeile 145, falsche Antwort in Zeile 224)
- `/home/user/wunderkompass/docs/entwurf/2026-11-25-technik-aufloesung-endfassung.md`
- `/home/user/wunderkompass/docs/entwurf/2026-11-25-spieltest-technik-aufloesung.md`
