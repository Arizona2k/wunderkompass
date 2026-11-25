# Stufen-Prüfung: kurze Auflösungen und Tipps

Helfer: stufen-pruefer (opus/high), 25.11.2026. Prüft docs/entwurf/2026-11-25-spiel-aufloesung-entwurf.md.

Ich habe nur gelesen und mit `node` gezählt, ohne etwas zu ändern. Gelesen habe ich den Entwurf, `app/world-game-support.mjs`, `app/world-game-bank.ts`, `app/world-game-runde.ts`, `app/kern/auswahl.ts`, `app/world-game-fallen.json`, `app/world-games.tsx:62–64`, die Endfassung der Personen-Rätsel und die betroffenen Tests. Simuliert habe ich 20.000 Personen-Runden je Stufe mit `neueWeltRunde`.

## 1. Gesamteindruck

Kein Tipp verrät eine Lösung, und keiner schafft ein neues Ratemuster. Die Tipps für then-now, food und technology lauten bei jeder Aufgabe gleich und tragen darum keine Information über die Lösung. Der Entdecker-Tipp bei `people` bleibt tatsächlich unverändert. Zwei Inhalte müssen vorher korrigiert werden: der Profi-Tipp bei `people` („forschten“) und Darwins Auflösung („Ein einzelnes Tier verwandelt sich nicht“). Ein Abstand zu Experte entsteht in den Welt-Spielen nicht: Experte spielt dort Profi (`app/world-game-runde.ts:13–19`). „Profi, Experte“ im Entwurf heißt also nur Profi.

## 2. Einstufung

| Baustein | Stufe | Begründung |
|---|---|---|
| Tipp `people` neu (Entwurf Z. 115) | Profi | Zeigt auf Satz 2 und 3. Die stehen nur auf Profi, Entdecker sieht nur Satz 1. |
| Tipp `habitats` (Z. 116) | alle, stark auf Entdecker | Nutzt das Foto. Auf Profi (Arktis gegen Antarktis, Flüsse gegen Küste) hilft er kaum, verrät aber nichts. |
| Tipp `food` (Z. 117) | alle | „Bis zum Ende lesen“ verstärkt kein Längenmuster (gemessen siehe Befund 6). |
| Tipp `technology` (Z. 118) | alle | Passt zu allen drei Frageformen. |
| Tipp `then-now` (Z. 119) | alle | Gleich für Früher- und Heute-Aufgaben, sagt nichts über die Zeitform. Richtig so. |
| Rückmeldung `people` Profi (Z. 131) | Profi | Sinnvoll: Sie lenkt auf die Einzelheiten, die die Fallen aus demselben Gebiet ausschließen. Sie unterscheidet sich klar von Entdecker. |
| Rückmeldung then-now „Erst in der Zukunft“ (Z. 137) | alle | Diese Antwort ist bei jeder Aufgabe falsch. Kleine Schieflage im Wort „gab“ (Befund 4). |
| 36 Auflösungen (Z. 25–60) | alle | Erscheinen erst nach „Richtig!“ und sind auch für Entdecker ohne Satz 2 verständlich. Ausnahmen: Befunde 2 und 3. |

## 3. Befunde

**1. Tipp `people` stimmt nicht für alle Personen.** Fundstelle: Entwurf Z. 115, später `hints.people` in `app/world-game-support.mjs:70`.
- „Einige Menschen hier forschten an ähnlichen Dingen“ ist falsch bei Mandela, Hokusai, Murasaki, Tagore, Butler, Hadid und Bertha Benz. Gebiete „schrift“ und „gesellschaft“: Dort forscht niemand.
- „Ort, Jahr oder Werkzeug“ fehlt in den Zusatzsätzen von Hopper, Butler, Tagore, Karl Benz und Tu Youyou.
- Die Lösung verrät der Tipp nicht.
- Vorschlag im Wortlaut (etwa 150 Zeichen): „Manche dieser Menschen machten Ähnliches. Achte auf Einzelheiten im Hinweis: einen Ort, ein Jahr oder ein Ding. Welchen Namen kannst du sicher ausschließen?“
- Das Ausschließen hilft immer, auch wenn das Kind die gesuchte Person nicht kennt.

**2. Darwin: Die Auflösung widerspricht dem Merian-Rätsel.** Fundstelle: Entwurf Z. 52.
- Der Satz „Ein einzelnes Tier verwandelt sich nicht.“ stimmt so nicht: Raupe zu Falter, Kaulquappe zu Frosch.
- Er prallt direkt auf Merians Satz 1 „wie aus Raupen Schmetterlinge werden“ (`app/world-game-support.mjs:23`). Darwin kann auf Profi Falle in Merians Aufgabe sein: Liste A schließt nur Merian in Darwins Aufgabe aus.
- Die heutige Karte schränkt den Satz ein („verwandelt sich dabei nicht auf Wunsch“). Der Entwurf lässt die Einschränkung weg.
- Vorschlag: „Ein einzelnes Tier wird dabei nicht zu einer neuen Art.“ Bitte auch dem `fakten-pruefer` geben.

**3. Bertha Benz verrät Karl Benz.** Fundstellen: Entwurf Z. 28 und 56.
- Berthas Auflösung nennt „Motorwagen“ und „Karl Benz“ zusammen. Karls Satz 1 lautet „entwickelte einen Motorwagen“. Kommt Karl später in derselben Runde, findet das Kind die Lösung wieder statt sie zu wissen.
- Häufigkeit (Simulation): Bertha vor Karl in 0,8 % der Entdecker-Runden und 2,2 % der Profi-Runden.
- Neu ist nur diese Richtung. Karls heutiger `why` nennt Bertha schon (`paragraphs`), Berthas nennt Karl nicht.
- Als Falle stehen die beiden nie nebeneinander (Liste A, beide Richtungen; `world-game-runde.ts:73`).
- Andere Kartenpersonen nennt keine Auflösung. Otto Frisch, Collins, Bonpland und Joseph Anning haben keine Karte.
- Vorschlag für Bertha: „Bertha Benz zeigte mit ihrer Fahrt: Das neue Auto schafft auch weite Strecken. Sie gab auch Geld für die Arbeit ihres Mannes.“ So fehlen das Wort „Motorwagen“ (für Entdecker ohnehin unerklärt) und der Vorname. Wer dann auf Karl schließt, denkt nach statt wiederzufinden. Die Verknüpfung bleibt über Karls Satz „Bertha Benz half ihm.“

**4. then-now, Rückmeldung bei „Erst in der Zukunft“.** Fundstelle: Entwurf Z. 137.
- Inhaltlich stimmt sie: Die Antwort ist bei allen 23 Früher- und Heute-Aufgaben falsch (`world-game-bank.ts:60`). Die Kompass-Heute-Aufgabe hat eigene Antworten ohne diese Antwort, und der `comparison`-Zweig greift dort vorher.
- Aber „gab es“ steht in der Vergangenheit und schiebt bei einer Heute-Aufgabe zu „Früher“. Das ist kein Verrat, weil der Text überall gleich ist, aber eine Schieflage.
- Vorschlag ohne Zeitform: „Du hast „Erst in der Zukunft“ gewählt. Das hier ist keine Idee für später, es ist schon echt. War es früher, oder ist es heute so?“
- Gleichen Satz auch für die alten dritten Antworten aus `ALTE_DRITTE_ANTWORT` nehmen (`world-game-bank.ts:13`): „Noch keine wirkliche Entwicklung“ und „Nur ein Zukunftswunsch“. Gespeicherte Runden zeigen sie noch.

**5. Profi-Rückmeldung `people` (Z. 131): passt.** Sie ist auf Profi gut, weil Satz 2 und 3 die Fallen aus demselben Gebiet trennen. Einbau: als eigener Zweig nach der Entdecker-Zeile (`world-game-support.mjs:120`) und vor dem Rückfall in Z. 139. Dann bleibt Entdecker unberührt.

**6. Auflösungen machen manche Profi-Fallen stärker, alle bleiben eindeutig (beobachten).**
- Wie oft: Eine frühere gesuchte Person steht später in derselben Runde als Falle, in 45 % der Entdecker-Runden und 93 % der Profi-Runden. Das ist erwünscht (gerade Gelerntes anwenden) und war mit den langen `paragraphs` genauso. Dieselbe Person ist nie zweimal gesucht (`auswahl.ts:43`, `new Set`).
- Lovelace „eines der ersten Computerprogramme“ (Z. 27) lockt in der Hopper-Aufgabe („frühe Programme“).
- Cai Lun „am Hof des Kaisers“ (Z. 29) lockt bei Murasaki (Satz 2 „am Hof des Kaisers“).
- Einsteins „Licht“ (Z. 57) lockt bei Payne-Gaposchkin und Ibn al-Haytham. Nur in diese Richtung, Liste A wirkt einseitig.
- Bell Burnell „Sterne … drehen sich sehr schnell“ (Z. 46) lockt bei Leavitt („fester Takt“).
- Meitner „Atomkern“ (Z. 49) lockt bei Wu.
- Tu Youyou und Tagore „Nobelpreis“ locken bei Curie, Maathai und Einstein. Auf Entdecker schließt Liste B Curie–Tu und Curie–Tagore schon aus. Bei Maathai und Einstein steht der Nobelpreis nur in Satz 2, also nur auf Profi.
- Jedes Mal trennt Satz 1 der gesuchten Person. Für Profi ist das gewollte Ähnlichkeit, keine Änderung nötig.
- Zum Tipp `food`: Die richtige Antwort ist ungefähr so oft die längste wie per Zufall (Entdecker 35 % bei Zufall 33 %, Profi 31 % bei Zufall 25 %; Lebensraum 29 % und 26 %).

**7. Randnotiz für die `kinder-redaktion`:** Meitner Z. 49, der zweite Satz hat 14 Wörter, wenn der Doppelpunkt nicht als Satzende zählt. Der Entwurf sagt „höchstens 13“.

## 4. Lücken

- **Kein Experte in den Welt-Spielen** (`world-game-runde.ts:13`). Die Auflösungen liefern Stoff für S5-Aufgaben:
  - Stimmt das oder Fehler finden: „Gutenberg druckte als Erster der Welt mit Metall-Buchstaben“ (Korea, Z. 35), „Cai Lun erfand das allererste Papier“ (Z. 29), „Die Augen schicken Strahlen zu den Dingen“ (Z. 42), „Der innere Erdkern ist flüssig“ (Z. 32).
  - Ordnen: Cai Lun, Gutenberg, Benz.
  - Verbinden: Meitner und Wu (Atomkern), Johnson und Armstrong (Raumfahrt).
- **then-now hat keinen Abstand zwischen den Stufen.** Profi bekommt dieselben drei Antworten wie Entdecker, nur mehr Aufgaben (`world-game-runde.ts:87–88`: keine Kandidaten, also die festen Antworten). Gelöst werden alle 24 Aufgaben schon über die Zeitform der Hinweise: Früher-Texte stehen in der Vergangenheit, Heute-Texte in der Gegenwart. Dazu beginnen 5 der 12 Früher-Texte mit „Frühe…“. Das ist Entdecker-Niveau. Für Experte passt die Kompass-Art („Was gilt früher und heute?“, Prinzip statt Bauform), zum Beispiel Glühlampe und LED („Licht aus Strom“) oder Dampflok und E-Lok. Der Ratemuster-Test prüft nur Antworten, nicht die Wörter im Hinweis.

## 5. Unsicher

- Ob 8- bis 10-Jährige „Ort, Jahr, Ding“ nutzen können, ohne die Personen schon zu kennen, und ob sie „Passt jeder Satz …?“ verstehen, klären nur echte Kinder.
- Ob gerade Gelerntes als Falle in der nächsten Aufgabe (93 % der Profi-Runden) eher hilft oder eher wie ein Verraten wirkt, klärt auch nur echtes Spielen.
- Die Simulation zieht Runden zufällig und ohne Wiederholungsplan (`review:{}`). Mit gespeichertem Lernstand verschieben sich die Anteile.

## Tests (`tests/world-game-learning-copy.test.mjs`)

**Muss sich ändern:**
- Z. 49: `assert.equal(q.why, t.paragraphs.join(' '))` wird zu `assert.equal(q.why, AUFLOESUNG[id])`, mit Import von `AUFLOESUNG`.
- Z. 88: Für `profi` und `undefined` die neue Rückmeldung genau prüfen: `'Du hast „'+wrong+'“ gewählt. Passt jeder Satz im Hinweis zu diesem Menschen? Schau dir auch die anderen Namen an.'`. Dazu `assert.notEqual` gegen den Entdecker-Text.

**Bleibt und schützt weiter:**
- Z. 86–87 schützen „Entdecker unverändert“.
- Z. 32 (Tipp, Rückmeldung und Erklärung verschieden).
- Z. 116–117 (Kompass; der neue then-now-Zweig darf den `comparison`-Zweig nicht überholen).

Die Browser-Suiten (`tests/browser/world-game-learning-copy.mjs`, `world-game-offline-semantics.mjs`) rechnen Tipp, Rückmeldung und `why` über die Funktionen aus und ziehen von selbst mit. Den neuen then-now-Zweig erreichen sie nicht: In ihrer then-now-Aufgabe ist die gewählte falsche Antwort „Heute“.

**Neue Tests:**
1. **Auflösungen:**
   - Schlüssel gleich `EIGENE_RAETSEL` und gleich allen Personenkarten.
   - Jede höchstens 180 Zeichen.
   - Beginnt mit dem ersten Namensteil, ohne Groß- und Kleinschreibung zu beachten (wegen „Al-Chwarizmi“ und „Karl (Carl) Benz“).
   - Beginnt nicht mit „Richtig“ und enthält keinen Rätselsatz wörtlich.
   - `q.why === AUFLOESUNG[id]`.
2. **Stufen-Schutz:** Eine Auflösung nennt keine andere Kartenperson, außer einem Paar aus Liste A in beiden Richtungen (heute nur Bertha und Karl). So kann eine Auflösung nie eine Falle oder ein späteres Ziel benennen, ohne dass es auffällt.
3. **then-now:**
   - Für alle Aufgaben mit `DRITTE_ANTWORT`: `worldGameAnswerCorrect` ist falsch. Z. 136 prüft das heute nur für zwei Aufgaben.
   - Die Rückmeldung zu `DRITTE_ANTWORT` ist für Früher- und Heute-Aufgaben wörtlich gleich.
4. **Tipps ohne Information über die Aufgabe:**
   - `worldGameHint('then-now', q)` ist für alle Aufgaben außer `invention-compass-today` gleich.
   - `worldGameHint('people', q, 'profi')` ist für alle 36 gleich und enthält keinen Personennamen.

## Muss
- Befund 1: Profi-Tipp `people` ohne „forschten“ und mit breiteren Beispielen (Wortlaut oben).
- Befund 2: Darwins Auflösung: „Ein einzelnes Tier wird dabei nicht zu einer neuen Art.“
- Tests Z. 49 und Z. 88 anpassen, dazu die neuen Tests 1 und 3.

## Kann
- Befund 3: Berthas Auflösung ohne „Motorwagen“ und ohne „Karl Benz“ (empfohlen, kleiner Aufwand).
- Befund 4: then-now-Rückmeldung ohne Zeitform, auch für die alten dritten Antworten.
- Tipp `habitats` für Profi ergänzen: „Ist es dort eher warm oder kalt?“
- Neue Tests 2 und 4.
- BACKLOG: Experten-Aufgaben aus den Auflösungen, then-now-Abstand für Profi und Experte (Prinzip-Fragen nach Art des Kompass), Ratemuster-Test auch auf Wörter im Hinweis ausdehnen.
- Meitner-Satz mit 14 Wörtern an die `kinder-redaktion`.

Hilfsdateien (nur zum Messen): `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/sim.mts`, `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/A.json`.
