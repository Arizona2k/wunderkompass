# Personen-Rätsel: Stufen-Prüfung

Helfer: `stufen-pruefer` (opus/high), 25.11.2026. Prüft die 27 neuen und die 9 vorhandenen Rätsel und die Fallenwahl der Runde. Mess-Skripte lagen nur im Scratchpad.

Ich habe keine Dateien geändert. Gemessen habe ich mit node. Die Skripte liegen nur im Scratchpad (/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/stufe/runde.mjs, Ergebnisse in runde.json und alle.json im selben Ordner). Sie bauen die Fallen-Logik aus `world-game-bank.ts` und `world-game-runde.ts` nach, also `entdeckerAntworten` und `profiKandidaten` samt Ausschlussliste. Alles, was nicht ausdrücklich als „gemessen“ markiert ist, ist meine Einschätzung.

### 1. Gesamteindruck

Die 27 Rätsel sind für das geplante Muster gut gebaut: Satz 1 sagt fast immer, wofür die Person bekannt ist, und reicht gegen die zwei Entdecker-Fallen. Die harten Wörter (Artemisinin, CERN, Betazerfall) stehen fast alle erst in Satz 2.

Die größeren Schwierigkeitsprobleme liegen aber nicht in den Texten, sondern im Aufbau der Runde:
- Auf Entdecker kommen 16 Personen nie als falsche Antwort vor.
- Auf Profi stammen die Fallen aus derselben Zeit, kaum aus demselben Fachgebiet. Dazu bekommt Profi mit Satz 2 mehr Hilfe als Entdecker.
- Experte spielt in diesem Spiel Profi (`weltSpielStufe`). Keines der Rätsel ist eine Experten-Aufgabe, und das muss es auch nicht sein.

### 2. Einstufung je Person

Gemessen: wer auf Entdecker und Profi als Falle erscheint.

**Paket 1**
- **Goodall: ok.** Schimpansen sind konkret. Entdecker-Fallen: Tu Youyou, Maathai.
- **Maathai: ok.** Entdecker: Armstrong, Lovelace. Auf Profi gibt es keine fachnahe Falle, weil Goodall ausgeschlossen ist. Profi ist hier also leicht.
- **Lovelace: Kann.** In Satz 1 steckt ein doppelter Gedanke („Maschine, die damals noch nicht gebaut war“), das ist für 6-Jährige schwer. Die Entdecker-Falle Berners-Lee (Computer) lockt etwas, ist aber eindeutig falsch. Vorschlag: „Diese Person schrieb genaue Schritte auf, wie eine geplante Rechenmaschine rechnen könnte.“
- **Bertha Benz: Soll (Profi).** Auf Entdecker sehr gut (Auto gegen al-Chwarizmi und Gutenberg). Auf Profi verrät Satz 1 schon alles: Im Vorrat stehen Tagore, Curie, Leavitt, Meitner, Einstein, keine einzige Auto-Person. Profi ist hier so leicht wie Entdecker. Das liegt an der Fallenwahl (siehe Befund M2), nicht am Text.
- **Cai Lun: ok.** Gute Profi-Fallen: Gutenberg, Murasaki, Ibn Sina, al-Chwarizmi. „Hof des Kaisers“ steht auch im Murasaki-Rätsel. Das ist eine echte Profi-Falle und trotzdem eindeutig (Papier, China).
- **Curie: ok.** Gute Profi-Falle: Einstein und Tagore haben auf ihren Karten je einen Nobelpreis. Wer „zwei“ genau liest, löst es. Das ist echtes genaues Lesen.
- **Carson: Kann.** Satz 1 hat 14 Wörter, das Wort „Schädlinge“ und einen Doppelpunkt. Satz 2 wiederholt fast nur Satz 1 (Gift, andere Tiere) und bringt Profi kaum Neues. Die Entdecker-Falle Darwin (Buch, Tiere) lockt, ist aber eindeutig falsch. Vorschlag für Satz 1: „Diese Person warnte in einem Buch: Gift gegen Schädlinge trifft auch andere Tiere.“ Das „warnte“ muss der fakten-pruefer prüfen.
- **Lehmann: ok.** Auf Profi lockt „Kern“ schön zu Meitner, Einstein ist auch im Vorrat. „Erde“ und „Erdbebenwellen“ trennen eindeutig.
- **Tu Youyou: ok.** Auf Entdecker trägt „Medizin“ den Satz, auch wenn ein Kind „Malaria“ nicht kennt. Auf Profi gibt es keine Medizin-Falle, darum ist es leicht.

**Paket 2**
- **Merian: ok.** Die Entdecker-Falle Goodall lockt („beobachtete“), aber Raupe und Schmetterling sind Kindern vertraut. Profi stark: Humboldt, Anning, Darwin, Hokusai („zeichnete“).
- **Gutenberg: ok.** Profi stark: Hokusai (auch Druck), Murasaki und Merian.
- **Hokusai: ok.** Auf Profi gibt es keine Kunst-Falle, darum ist es leicht.
- **Humboldt: ok.** Profi: Anning, Hokusai („Berg“). Beide Benz stehen im Vorrat (siehe Befund S2).
- **Hopper: ok.** Auf Entdecker ist al-Chwarizmi („Rechnen“) eine kleine Locke. Auf Profi ist Katherine Johnson eine gute Falle.
- **Johnson: ok.** Auf Profi ist Hopper die einzige fachnahe Falle. Armstrong fällt nur wegen der alphabetischen Sortierung bei Gleichstand aus dem Vorrat.
- **Berners-Lee: ok.** „Seiten“ lockt auf Entdecker leicht zu Cai Lun (Papier). Auf Profi ist es leicht.
- **Anning: ok.** Beide Benz im Profi-Vorrat.
- **Ibn al-Haytham: ok.** Auf Profi kommen alle Fallen aus der Zeit vor rund 1000 Jahren (Ibn Sina, Murasaki, al-Chwarizmi). Die Zeitangabe verrät darum nichts, nur „Licht und Sehen“ trennt. Das ist gut so.
  - Kann: Die Zeitangaben vereinheitlichen. Heute heißt es „vor etwa tausend Jahren“, bei Ibn Sina „vor rund 1000 Jahren“ und bei Murasaki „vor über 1000 Jahren“ (das ist eine Frage für die kinder-redaktion).

**Paket 3**
- **Leavitt: ok.** Satz 2 hat 21 Wörter und ein Semikolon (Frage für die kinder-redaktion). Auf Profi gibt es keine Sternen-Falle, darum ist es leicht.
- **Payne-Gaposchkin: ok.** Auf Profi ist es leicht.
- **Franklin: Soll (Entdecker).** „Wie Stoffe aufgebaut sind“ ist abstrakt. Kleine hören „Stoff“ als Kleiderstoff, und die Entdecker-Falle Cai Lun (stellt Papier her, also ein Material) liegt dann ausgerechnet nahe. Vorschlag für Satz 1: „Diese Person nutzte Röntgenstrahlen, um ins Innere von Stoffen zu schauen.“ Satz 2 (21 Wörter) könnte man teilen (Kann).
- **Bell Burnell: Soll (Entdecker).** Der einzige konkrete Haken in Satz 1 ist „aus dem Weltall“. Die beiden festen Entdecker-Fallen sind ausgerechnet Mae Jemison (Astronautin) und Einstein („Raum“). In Kinderköpfen passen damit zwei von drei Namen zu „Weltall“. Fachlich ist es eindeutig, aber auf Entdecker sollen die Fallen deutlich anders sein.
  - Vorschlag: das Werkzeug nach vorn: „Diese Person fand mit einer riesigen Antennen-Anlage sehr regelmäßige Signale aus dem Weltall.“
  - Satz 2 bekommt dann Papierstreifen und Cambridge.
- **Butler: ok.** Auf Profi ist es leicht (keine Schreib-Falle).
- **Wu: Kann.** „Vorgänge im Spiegelbild“ verstehen 5- bis 7-Jährige kaum. Lösbar ist es über das Wiedererkennen von „Spiegel“ oder durch Ausschließen (Bäume, Fossilien). Vorschlag: „Diese Person prüfte mit einem sehr genauen Versuch: Läuft etwas im Spiegel genauso ab wie in echt?“
- **Meitner: ok, bester Profi-Fall.** Im Profi-Vorrat stehen Einstein, Curie (auf ihrer Karte stehen auch „Atomkerne“) und Lehmann („innerer Kern“). Das ist eine echte Profi-Falle, die durch „in zwei Kerne teilen“ eindeutig bleibt.
  - Die Flucht muss in Satz 2 bleiben: Einsteins Karte nennt Deutschland, und Einstein steht im Profi-Vorrat. Die Alternative des Autors (Berlin und Flucht in Satz 1) lehne ich ab.
  - Kann: Satz 1 auf 13 Wörter kürzen: „Diese Person erklärte, wie sich ein winziger Atomkern in zwei kleinere Kerne teilt.“
- **Hadid: ok.** Auf Profi ist es leicht.
- **Ibn Sina: ok.** Profi stark: Alle Fallen schrieben Bücher und lebten zur ungefähr gleichen Zeit. Nur „Medizin“ trennt.

### 3. Befunde

**M1 (Muss, Runde): 16 Namen sind auf Entdecker nie falsch.**
- Die Entdecker-Fallen kommen nur aus den 20 Namen in `people-game-baseline.json` (`retained[(index+3)%20]`, `[(index+7)%20]`).
- Gemessen: Merian, Lehmann, Leavitt, Payne-Gaposchkin, Franklin, Bell Burnell, Hokusai, Murasaki, Carson, Butler, Mandela, Wu, Meitner, Hadid, Tagore und Ibn Sina erscheinen auf Entdecker nie als Falle.
- Einzige Ausnahme: Hokusai und Tagore können je mit 1/5 Wahrscheinlichkeit als Ersatz-Falle bei Darwin kommen.
- Folge: Steht einer dieser Namen da, ist er die Lösung. Ein Kind merkt das nach wenigen Runden. Dazu hat jede Person auf Entdecker immer dieselben zwei Fallen.
- Vorschlag: `entdeckerAntworten` zieht für `people` zwei Fallen aus allen 36 Personen, aber aus einem deutlich anderen Gebiet (wie `TIER_FALLEN.entdecker`). `question.answers` bleibt, wie es ist.
- Zu Kompatibilität: `validWorldGameOrder` nimmt bei Erkennungsspielen schon jeden Namen aus dem Vorrat an. Trotzdem `tests/fixtures/gespeicherte-antworten*.json` und die legacy-people-Fixtures prüfen.

**M2 (Muss für den Plan, Mandela und Jemison): Satz 1 allein trägt nicht.**
- **Mandela** hat drei Sätze. Getrennt am ersten „. “ bleibt „setzte sich in Südafrika gegen die Apartheid ein.“ Das Wort Apartheid wird erst in Satz 2 erklärt. Vorschlag für Satz 1: „Diese Person kämpfte in Südafrika dafür, dass alle Menschen gleiche Rechte haben, egal welche Hautfarbe.“ Die Apartheid kommt dann in Satz 2.
- **Jemison:** „kannte sich mit Medizin und Technik aus“ trennt schwach von der Entdecker-Falle Ibn al-Haytham (Sehen, Versuche, Mathematik). Der Flug ins All steht erst in Satz 2. Vorschlag: die Sätze tauschen.

**S1 (Soll, Darwin und Murasaki): Satz 1 sagt nicht, wofür die Person bekannt ist.**
- Darwin: Nur „Beagle“ und eine Reise. Die mögliche Ersatz-Falle Bertha Benz lockt mit „lange Reise“.
- Murasaki: Nur „lebte am Hof“, die Erzählung steht erst in Satz 2.
- Vorschlag: Die Tat nach vorn, zum Beispiel „Diese Person schrieb vor über 1000 Jahren in Japan eine lange Erzählung über einen Prinzen.“
- Für Darwin den Wortlaut vom karten-autor mit Beleg auf der Karte schreiben lassen. „Generationen“ ist für Satz 1 zu schwer.

**S2 (Soll, Profi-Fallen): gleiche Zeit statt gleiches Gebiet.**
- `profiKandidaten` nimmt für `people` die fünf zeitlich nächsten Personen.
- Gemessen mit meiner groben Einteilung in Gebiete (Einschätzung): In 18 von 36 Profi-Vorräten steht keine Person aus demselben Gebiet. Beispiele: Bertha und Karl Benz, Tu Youyou, Hokusai, Leavitt, Bell Burnell, Carson, Hadid.
- Dort ist Profi nur durch die vierte Antwort schwerer. Satz 2 bringt sogar mehr Hilfe.
- Gut wirkt die Zeit nur bei den Gelehrten um 1000 (Ibn Sina, Ibn al-Haytham, al-Chwarizmi, Murasaki) und in der Physik um 1900 (Meitner, Einstein, Curie, Lehmann).
- Vorschlag: Profi mischt mindestens eine Falle aus demselben Gebiet (kleine Liste wie `TIERGRUPPE`) mit Fallen aus derselben Zeit. Neue Paare prüft der fakten-pruefer gegen die Ausschlussliste.

**S3 (Soll, Ratemuster Benz): beide Benz in einer Profi-Frage.**
- Gemessen: Beide Benz stehen in 5 Profi-Vorräten (Lovelace, Darwin, Humboldt, Anning, Tagore). Werden 3 aus 5 gezogen, kommen beide mit 3/10 Wahrscheinlichkeit zusammen.
- Dann gilt: Zwei Namen derselben Familie können nicht beide richtig sein, also bleiben zwei Antworten.
- Vorschlag: höchstens einen Benz je Frage ziehen.
- Kann: beide Ibn genauso behandeln. Sie stehen zusammen in 3 Vorräten (al-Chwarizmi, Cai Lun, Murasaki), auch mit 3/10. Das ist eher eine echte Verwechslungsfalle als ein Ratemuster.

**Verwechslungspaare (gemessen):**
- **Bertha und Karl Benz** treffen sich nie. Auf Profi schließen sie sich gegenseitig aus, und ihre festen Entdecker-Fallen sind andere.
- **Leavitt, Bell Burnell und Payne-Gaposchkin** treffen sich auf keiner Stufe. Ihre sorgfältigen Abgrenzungen sind heute ungenutzt, sichern aber spätere Änderungen ab.
- **Meitner und Einstein** stehen gegenseitig im Profi-Vorrat. Eindeutig, weil Einsteins Karte keinen Atomkern nennt.
- **Ibn Sina und Ibn al-Haytham** stehen gegenseitig im Profi-Vorrat. Eindeutig über Medizin gegen Licht. Die ähnlichen Namen sind eine echte Gedächtnisprobe auf Profi, das ist in Ordnung.
- **Einstein und Ibn al-Haytham** („Licht“) begegnen sich nie.

**Namen im Rätsel (gemessen):**
- Kein Rätsel enthält als ganzes Wort einen Namensteil irgendeiner der 36 Personen. Ausnahme ist das Füllwort „von“.
- Nur in Wortinnern stecken „lun“ (in „Erzählung“) und „inge“ (in „Schädlinge“, „Schmetterlinge“). Das sieht kein Kind als Hinweis.
- Gosling, Frisch, Bonpland, Glenn und Aldrin haben keine eigene Karte.

**Hinweis (Kann):** Der Tipp ist für alle Personen gleich: „Vergleiche die genannte Tätigkeit … mit dem, was du über die angebotenen Personen weißt.“ Einem Entdecker hilft er kaum. Mehr dazu unter Frage 4.

### 4. Antworten auf die fünf Fragen

1. **Reicht Satz 1?** Ja, bei 22 der 27 neuen Rätsel ohne Einschränkung. Bei Franklin und Bell Burnell gibt es eine Locke gegen genau die festen Entdecker-Fallen (Soll). Lovelace, Wu und Meitner sind eher abstrakt, aber eindeutig (Kann). Kein Satz 1 verrät zu viel: Entdecker soll ja wiedererkennen.

2. **Profi zu leicht?** Nicht wegen Jahreszahlen oder Orten. Gegen Fallen aus derselben Zeit helfen 1888, 1962 oder Pforzheim nicht. Profi ist aber oft leicht, weil die Fallen fachfremd sind (S2) und Satz 2 zusätzliche Hilfe bringt. Echte Profi-Fälle sind Meitner, Curie, Cai Lun, Merian, Gutenberg, Ibn Sina, Ibn al-Haytham, Lehmann und Hopper.

3. **Ratemuster:** Die beiden wichtigen stehen oben unter M1 (16 Namen nie falsch) und S3 (beide Benz). Der „längste Name“ ist kein Muster: Gemessen ist die richtige Antwort in 14 von 35 Entdecker-Fragen der längste Name, Zufall wäre etwa 12.

4. **Nur Satz 1 für Entdecker: sinnvoll, ich empfehle es.**
   - Gemessen: Satz 1 hat im Mittel 10,9 Wörter (6 bis 15), das ganze Rätsel 24,2 (14 bis 33). Das halbiert die Last beim Vorlesen, und die Fachwörter bleiben draußen.
   - Den umgekehrten Weg (Profi nur Satz 2) gibt es nicht: Nach meiner groben Stichwortsuche bezieht sich Satz 2 in mindestens 21 von 36 Rätseln auf Satz 1 („dafür“, „solche“, „Das Buch“ …).
   - Satz 2 als Tipp für Entdecker rate ich nur als Kann. Er enthält gerade die harten Wörter, die Kleinen nicht weiterhelfen.
   - Bedingungen: M2 und S1 vorher erledigen. Den Tipp für Entdecker gegebenenfalls einfacher fassen.
   - Für den Einbau: Getrennt wird nach der Stufe der Runde (`gespielt`), nicht nach der gewählten Stufe. Der Text der Frage wird nicht gespeichert, der Wechsel ist für gespeicherte Runden also sicher. Alte Runden ohne Stufe spielen Entdecker und zeigen dann nur Satz 1. Auch „Vorlesen“ (`onRead(current.prompt…)`) muss den gekürzten Text lesen.
   - Andere Stellen gibt es nicht: `personRecognitionClue` und `worldGameBank` werden nur in `world-game-bank.ts`, `world-game-runde.ts` und `world-games.tsx` benutzt.

5. **Die neun vorhandenen Rätsel:**
   - Armstrong, al-Chwarizmi, Tagore: ok.
   - Karl Benz: ok. Kann: „Motorwagen, also ein frühes Auto“.
   - Einstein: ok. Abstrakt, aber die Fallen Cai Lun und Darwin sind weit weg, Ausschließen klappt. Schwer ist eher Satz 2. In diesem Punkt bin ich anderer Meinung als der Autor.
   - Mandela und Jemison: Muss (M2).
   - Darwin und Murasaki: Soll (S1).

**Stufen-Vorschläge:** Sie passen. Profi wird nach drei richtigen vorgeschlagen, Entdecker nach zwei falschen. Experte wird hier nicht angeboten (`spielVorschlagErlaubt` mit `weltSpielStufe`), und „Zurück zu Entdecker“ bleibt über die Stufenwahl erreichbar.

### 5. Lücken

Ein echtes Experten-Personenspiel fehlt. Passend aus S5 wären:
- **Art 3 (Reihenfolge):** vier Personen auf dem Zeitstrahl ordnen, mit Bezug „wer baute auf wem auf“, zum Beispiel Lovelace, Hopper, Johnson, Berners-Lee.
- **Art 5 (Knobelfall):** zwei Hinweise aus zwei Karten verbinden, zum Beispiel „Welche zwei Personen untersuchten Kerne, aber ganz verschiedene?“ (Lehmann und Meitner).
- **Art 2 (Fast richtig):** ein vertauschtes Detail im Rätsel finden, zum Beispiel „Diese Person bekam einen Nobelpreis für Polonium.“

### 6. Unsicher

- Ob Kleine Satz 1 bei Lovelace, Wu, Meitner, Franklin und Einstein beim Vorlesen verstehen, ist meine Einschätzung. Klären kann das nur die Rückmeldung echter Kinder.
- Meine Einteilung in Gebiete für S2 ist grob und selbst gemacht (`person.field` ist freier Text).
- Ob Wörter wie „warnte“ (Carson) oder „ins Innere schauen“ (Franklin) fachlich passen, prüft der fakten-pruefer. Satzlänge und Ton prüft die kinder-redaktion.

**Dateien:**
- Entwürfe: /home/user/wunderkompass/docs/entwurf/2026-11-25-personen-raetsel-paket-1.md, /home/user/wunderkompass/docs/entwurf/2026-11-25-personen-raetsel-paket-2.md, /home/user/wunderkompass/docs/entwurf/2026-11-25-personen-raetsel-paket-3.md
- Code: /home/user/wunderkompass/app/world-game-support.mjs, /home/user/wunderkompass/app/world-game-bank.ts, /home/user/wunderkompass/app/world-game-runde.ts, /home/user/wunderkompass/app/people-game-baseline.json, /home/user/wunderkompass/app/world-game-fallen.json, /home/user/wunderkompass/app/world-games.tsx
