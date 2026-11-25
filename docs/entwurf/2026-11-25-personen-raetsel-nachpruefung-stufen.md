# Personen-Rätsel: Nachprüfung der Neufassung (Stufen)

Helfer: stufen-pruefer (opus / high), 25.11.2026. Nur Befunde, ändert nichts.

Ich habe keine Dateien im Repository geändert. Gemessen habe ich mit node und den echten Daten aus `world-catalog.json`, `people-game-baseline.json` und `world-game-fallen.json`. Die Fallenwahl (`entdeckerAntworten`, `profiKandidaten`) habe ich dafür nachgebaut. Mess-Skripte und Ergebnisse liegen in /tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/nach/ (mess.mjs, gebiet.mjs, grep.mjs, alle36.json, runde.json). Alles, was nicht als „gemessen“ markiert ist, ist meine Einschätzung.

**Kurz:**
- Die 32 neuen oder neu gefassten Rätsel sind auf Entdecker mit Satz 1 allein lösbar.
- Die fünf Neufassungen beheben M2 und S1 aus meinem Vorbericht.
- Neu gefunden habe ich eine Doppeltreffer-Gefahr: Das unveränderte Einstein-Rätsel passt durch die neuen Sternen-Rätsel auch auf Leavitt. Leavitt kommt schon heute auf Profi als Falle vor.
- Die Gebietsregel aus Abschnitt 4 reicht für Entdecker nicht allein. Einige Satz-1-Treffer gehen über Gebietsgrenzen (Nobelpreis, „vor etwa 1000 Jahren“, „Licht“, „Rechte“). Dafür braucht es eine kleine zusätzliche Paarliste.

## Muss

**M1 Einstein und Leavitt (sowie Payne-Gaposchkin, Ibn al-Haytham): zwei Antworten passen.**
- Das Einstein-Rätsel beginnt „Diese Person untersuchte Licht, Raum und Zeit.“
- Leavitts neues Rätsel und ihre Karte decken genau diese drei Wörter ab:
  - Licht: Sterne werden heller und dunkler.
  - Raum: „Entfernungen im Weltall“.
  - Zeit: „fester Takt“, auf der Karte „Ein zeitlicher Rhythmus kann mehr verraten“.
- Nur Satz 2 trennt („im Kopf ganz genau durchspielen“), und der ist vage.
- Gemessen: Leavitt steht in Einsteins Profi-Vorrat. Bei 3 aus 5 kommt sie in 60 % der Profi-Fragen zu Einstein.
- Die Karten von Payne-Gaposchkin („untersuchte das Licht von Sternen“) und Ibn al-Haytham („untersuchte Licht und Sehen“) beginnen fast wortgleich wie Einsteins Satz 1.
- Vorschlag: neue Ausschlüsse in `world-game-fallen.json`, vorher vom fakten-pruefer zu bestätigen: `"person-albert_einstein": ["person-henrietta_swan_leavitt", "person-cecilia_payne_gaposchkin", "person-ibn_al_haytham"]`.
- Nur in diese Richtung nötig: Die Rätsel von Leavitt, Payne-Gaposchkin und Ibn al-Haytham passen nicht auf Einstein.
- Dazu Soll S1 unten.

## Soll

**S1 Einstein, Satz 1 schärfen.** Das Denken gehört nach vorn. Das ist für Kleine anschaulich und trennt vom Beobachten der Sternen-Personen:
- Satz 1: „Diese Person spielte im Kopf genau durch, was mit Licht, Raum und Zeit passiert.“ (13 Wörter). Beleg: Karte `more[3]` (Gedankenexperiment) und der geprüfte alte Satz 2.
- Satz 2 neu, Vorschlag: „Für eine Arbeit über Licht bekam diese Person 1921 den Nobelpreis.“ Beleg: `paragraphs[1]`. Den Wortlaut muss der fakten-pruefer prüfen. Auf Profi wird Curie damit zu einer guten Falle.
- Auch nach dem Umbau würde ich die Ausschlüsse aus M1 behalten.

**S2 Ibn Sina und Murasaki: Die Sätze 2 sind fast gleich.**
- Ibn Sina: „Das Buch wurde viele hundert Jahre lang übersetzt und abgeschrieben.“
- Murasaki: „… und wurde jahrhundertelang von Hand abgeschrieben.“
- Beide stehen gegenseitig im Profi-Vorrat (gemessen). Satz 1 sagt bei beiden „schrieb vor etwa 1000 Jahren“. Beim Ibn-Sina-Rätsel trennt also nur das Wort „Medizin“, Satz 2 passt voll auf Murasaki. Eindeutig bleibt es, aber Satz 2 bringt dem Profi nichts, was die beiden unterscheidet.
- Vorschlag Ibn Sina Satz 2: „Darin ordnete diese Person, was man damals über Krankheiten und Heilung wusste.“ Beleg: Karten-`intro` „ordnete medizinisches Wissen seiner Zeit“.
- Alternative Murasaki Satz 2: „Die Geschichte erzählt von Menschen am Hof des Kaisers, wo diese Person selbst arbeitete.“ Beleg: `paragraphs[0]`.

**S3 Darwin und Merian: Ausschluss für die neuen Fallen-Listen.**
- Heute treffen sich die beiden nie (gemessen: 162 Jahre Abstand). Mit der Gebietsregel wird Merian aber eine wahrscheinliche Profi-Falle für Darwin.
- Darwins Satz 2 („Schiffsreise … sammelte Tiere und Pflanzen“) passt auch auf Merian: Sie fuhr per Schiff nach Suriname und sammelte dort.
- Satz 1 „wie sich Arten … verändern“ trifft genau das Missverständnis, vor dem der Autor warnt. Merians Karte spricht von „Entwicklungsstadien“, also Raupe und Schmetterling.
- Vorschlag: `"person-charles_darwin"` um `"person-maria_sibylla_merian"` ergänzen. Andersherum ist es nicht nötig: Raupen und Schmetterlinge passen nicht auf Darwin.
- Als fachnahe Profi-Fallen bleiben Darwin dann Goodall, Carson, Maathai und Lehmann.

**S4 Satz-1-Trennung nur zusammen mit den Fallen-Listen einbauen.**
- Mit den heutigen festen Fallen bleiben zwei Locken:
  - Bell Burnell: Die Entdecker-Fallen sind immer noch Einstein („Raum“) und Jemison („ins All“). Satz 1 sagt weiter „aus dem Weltall“. Das Werkzeug vorn hilft, aber zwei von drei Namen klingen nach Weltall.
  - Carson: Die Falle Darwin („Lebewesen“) lockt mit „andere Tiere“.
- Beides erledigt die Gebietsregel. Deshalb gehören beide Änderungen in denselben PR.

**S5 Entdecker-Tipp.**
- Der Vorschlag verrät nichts, nennt kein Geschlecht und lehrt eine brauchbare Strategie: Ausschließen hilft mehr als Vergleichen. Er hilft Kleinen also.
- Zwei Punkte:
  - Bei falscher Antwort setzt `worldGameWrongFeedback` den Tipp an „Du hast „Gutenberg“ gewählt.“. Dann ist „Was hat diese Person gemacht?“ doppeldeutig. Vorschlag: „Was hat die gesuchte Person gemacht? Lass zuerst die Namen weg, die sicher nicht passen.“
  - `worldGameWrongFeedback(game,item,answer)` ruft `worldGameHint(game,item)` ohne Stufe auf. Bekommt nur `worldGameHint` einen Stufen-Parameter, sehen Entdecker nach einem Fehler weiter den alten Profi-Tipp. Beide brauchen die Stufe.
- Den Ersatz („Kennst du einen der Namen? …“) halte ich für gleich gut. Der Hauptvorschlag passt besser zur Rückmeldung nach einem Fehler.

**S6 Zusätzliche Entdecker-Paarliste neben der Gebietsregel** (siehe Paarliste B). Der in Abschnitt 4 geplante Test sollte auch sie prüfen.

## Kann

- **K1 „im Team“:** Das steht nur in Frauen-Rätseln (Curie, Tu Youyou, Hopper, Franklin, Wu; gemessen 5 von 22 Frauen, 0 von 14 Männern). Das ist ein schwacher Hinweis auf das Geschlecht, auf Profi in der Praxis kaum nutzbar. Beobachten. Wo eine Karte es trägt, darf auch ein Männer-Rätsel einmal eine Zusammenarbeit nennen.
- **K2 Gleich leicht auf Profi und Entdecker:** Karl Benz, Bertha Benz, Hadid, Berners-Lee, Hokusai, Butler und Goodall haben in Satz 1 ein einmaliges Stichwort (Auto, Gebäude, Web, Welle, Science-Fiction, Schimpansen). Profi bleibt dort auch mit einer Falle aus demselben Gebiet fast so leicht wie Entdecker. Das liegt an der Spielart, nicht an den Texten. Der eigentliche Abstand kommt erst mit dem Experten-Spiel (BACKLOG).
- **K3 Mandela:** Die Karten von Johnson und Jemison nennen „Schwarze Frau … Barrieren“. Auf Entdecker sollten sie nicht neben Mandela stehen. Auf Profi ist das eine gute Falle, „Südafrika“ und „1994“ trennen.
- **K4 Cai Lun:** Mit Tu Youyou oder Wu auf Entdecker würde nur der Namensklang zu „China“ entscheiden. Besser meiden.
- **K5 Rückmeldung nach richtiger Antwort:** Sie zeigt alle `paragraphs`. Für Entdecker, die nur Satz 1 lesen, ist das viel Text. Das ist eine Frage für die kinder-redaktion.
- **K6 Lovelace:** „vor etwa 180 Jahren“ in Satz 1 ist auf Profi der einzige Unterschied zu Hopper, Johnson und Berners-Lee. Das ist gutes Knobeln: Zeit und Tat verbinden. Die Zeitangabe bitte nicht streichen.

## Ergebnisse je Rätsel

**Entdecker (Satz 1, heutige feste Fallen, gemessen):**
- Lösbar und deutlich: Curie, Hopper, Johnson, Berners-Lee, Karl Benz, Bertha Benz, Goodall, Tu Youyou, Cai Lun, Jemison, Gutenberg, Maathai, Darwin, Humboldt, Anning, Ibn al-Haytham, Merian, Lehmann, Leavitt, Payne-Gaposchkin, Franklin, Hokusai, Murasaki, Butler, Mandela, Wu, Meitner, Hadid, Ibn Sina, Lovelace.
- Mit leichter Locke, aber eindeutig: Bell Burnell und Carson (S4); Lovelace (Berners-Lee), Hopper (al-Chwarizmi „Rechnen“), Merian (Goodall „beobachtete“).
- Antworten auf die Fragen des Autors:
  - Darwin: Die Ersatz-Falle für Anning kommt aus Lovelace, Karl Benz, Bertha Benz, Hokusai und Tagore (gemessen). Keiner davon passt zu „Lebewesen“ oder „Arten“, „über lange Zeit“ lockt also nicht. Die „Schiffsreise“ steht jetzt in Satz 2, Entdecker sehen sie nicht.
  - Murasaki: Text gut. Dass die Namen Tu Youyou und Maathai fremd sind, ist das Problem aus M1, nicht aus dem Text.
  - Jemison und Armstrong: Auf Entdecker sollen sie nie zusammen kommen (Gebiet Weltall). Auf Profi ist Armstrong eine gute Falle; „1992“, „Raumfähre“ und „Medizin“ trennen eindeutig.
  - Ibn Sina: steht in der Entscheidungsliste schon auf „vor etwa 1000 Jahren“, erledigt.

**Profi (ganzer Text, heute die fünf zeitlich nächsten):**
- Echt fordernd: Meitner, Curie, Cai Lun, Merian, Gutenberg, Ibn Sina, Ibn al-Haytham, al-Chwarizmi, Lehmann, Hopper, Johnson, Murasaki.
- Ohne fachnahe Falle im heutigen Vorrat (gemessen, nach meiner Tabelle): Darwin, Carson, Maathai, Leavitt, Bell Burnell, Lovelace, Berners-Lee, Karl Benz, Bertha Benz, Tagore, Tu Youyou, Mandela. Das sind 12 von 36. Die Fallen-Listen beheben das.
- Ratemuster: keines in den Texten, außer K1. Weder Satzlänge noch Jahreszahl verraten etwas, weil die Antworten Namen sind.

**Verräter:**
- Ländernamen in Satz 1: Kenia, China, Japan, Mainz, Südafrika, Bagdad. Auf Entdecker ist das in Ordnung, Wiedererkennen ist dort erwünscht. Auf Profi wird es zur Falle, wenn eine Person aus demselben Land dabei ist: Murasaki und Hokusai, Cai Lun und Tu Youyou oder Wu, die Gelehrten um 1000.
- Kein Hinweis auf das Geschlecht: „Oberhaupt“ statt „Präsident“, keine Berufswörter auf „-in“, keine Fürwörter (gemessen).
- „Apartheid“ und „Beagle“ verraten es nur Kindern, die die Person kennen. Sie stehen in Satz 2, das ist für Profi zulässig.

## Gebietstabelle (Vorschlag für die Fallen-Listen)

Regel, gemessen mit gebiet.mjs:
- Entdecker zieht nur aus Personen, die weder Erst- noch Zweitgebiet teilen und nicht in Paarliste A oder B stehen. Dann bleiben je Person mindestens 20 Kandidaten, und jede Person kommt als Entdecker-Falle vor.
- Profi braucht mindestens eine Person, die Erst- oder Zweitgebiet teilt. Das klappt bei allen 36 (Mandela nur über Maathai, Tu Youyou über Jemison und Ibn Sina).
- „Kunst und Schrift“ ist ein Gebiet.

| Person | Gebiet | Zweitgebiet |
|---|---|---|
| Charles Darwin | Natur und Erde | – |
| Alexander von Humboldt | Natur und Erde | – |
| Maria Sibylla Merian | Natur und Erde | Kunst und Schrift |
| Mary Anning | Natur und Erde | – |
| Jane Goodall | Natur und Erde | – |
| Rachel Carson | Natur und Erde | Kunst und Schrift (Buch) |
| Wangari Maathai | Natur und Erde | Gesellschaft |
| Inge Lehmann | Natur und Erde | Physik und Chemie |
| Neil Armstrong | Weltall und Raumfahrt | Technik |
| Mae Jemison | Weltall und Raumfahrt | Medizin |
| Katherine Johnson | Weltall und Raumfahrt | Rechnen und Computer |
| Henrietta Swan Leavitt | Weltall und Raumfahrt | – |
| Cecilia Payne-Gaposchkin | Weltall und Raumfahrt | Physik und Chemie |
| Jocelyn Bell Burnell | Weltall und Raumfahrt | – |
| Marie Curie | Physik und Chemie | – |
| Albert Einstein | Physik und Chemie | – |
| Lise Meitner | Physik und Chemie | – |
| Chien-Shiung Wu | Physik und Chemie | – |
| Rosalind Franklin | Physik und Chemie | – |
| Ibn al-Haytham | Physik und Chemie (Licht) | Rechnen und Computer |
| al-Chwarizmi | Rechnen und Computer | – |
| Ada Lovelace | Rechnen und Computer | – |
| Grace Hopper | Rechnen und Computer | – |
| Tim Berners-Lee | Rechnen und Computer | – |
| Karl Benz | Technik | – |
| Bertha Benz | Technik | – |
| Johannes Gutenberg | Technik | Kunst und Schrift |
| Cai Lun | Technik | Kunst und Schrift |
| Murasaki Shikibu | Kunst und Schrift | – |
| Rabindranath Tagore | Kunst und Schrift | – |
| Octavia Butler | Kunst und Schrift | – |
| Katsushika Hokusai | Kunst und Schrift | Technik (Druck) |
| Zaha Hadid | Kunst und Schrift (Bauen) | Technik |
| Tu Youyou | Medizin | – |
| Ibn Sina | Medizin | Kunst und Schrift (Buch) |
| Nelson Mandela | Gesellschaft | – |

Die Einteilung ist meine Einschätzung (`person.field` ist freier Text). Der fakten-pruefer sollte sie mitlesen.

## Paarliste

**A. Nie zusammen, auf keiner Stufe** (Ausschluss in `world-game-fallen.json`, Richtung: Rätsel → Falle):
- Karl Benz ↔ Bertha Benz (besteht). Ein Test soll prüfen, dass sie nie zusammen in einer Frage stehen.
- Darwin → Humboldt, Anning; Humboldt → Darwin; Anning → Darwin (besteht, bleibt nötig: Darwin „verglich Lebewesen, Fossilien“, Humboldt „sammelte Pflanzen“ auf der Reise).
- Maathai → Goodall (besteht).
- **Neu, Muss:** Einstein → Leavitt.
- **Neu, Soll:** Einstein → Payne-Gaposchkin, Ibn al-Haytham; Darwin → Merian.

**B. Nur auf Entdecker nie** (Satz 1 passt halb auf beide, über Gebietsgrenzen hinweg, die Gebietsregel fängt das nicht):
- Curie → Einstein, Tagore, Maathai, Tu Youyou: alle haben auf ihrer Karte einen Nobelpreis, nur „zweimal“ trennt.
- Gelehrte um 1000 untereinander: Ibn Sina, Ibn al-Haytham, al-Chwarizmi, Murasaki („vor etwa 1000 Jahren“, „schrieb … Buch“, ähnliche Namen).
- Ibn Sina ↔ Gutenberg und Murasaki ↔ Gutenberg („Buch“).
- Einstein ↔ Ibn al-Haytham, Payne-Gaposchkin, Leavitt, Bell Burnell, Jemison („Licht“, „Raum“). Ibn al-Haytham ↔ Payne-Gaposchkin („untersuchte Licht“).
- Mandela ↔ Maathai („Rechte“, Afrika). Kann: Mandela ↔ Johnson und Jemison; Cai Lun ↔ Tu Youyou und Wu.
- Diese Paare fängt die Gebietsregel schon ab, sie stehen hier zur Kontrolle: Bell Burnell, Leavitt, Payne-Gaposchkin ↔ Jemison, Armstrong, Johnson; Butler ↔ Tagore, Murasaki („schrieb Geschichten“); Murasaki ↔ Hokusai (Japan); Franklin ↔ Meitner, Wu, Curie („winzig“, Atomkern); Lovelace ↔ Hopper, al-Chwarizmi; Carson ↔ Darwin, Goodall.

**C. Bewusst erlauben, gute Profi-Fallen** (ähnlich, mit ganzem Text eindeutig):
- Meitner ↔ Einstein, Curie, Lehmann, Wu („Kern“, „Zerfall“)
- Curie ↔ Einstein, Tagore, Tu Youyou, Maathai
- Ibn Sina ↔ Murasaki ↔ Ibn al-Haytham ↔ al-Chwarizmi
- Lovelace ↔ Hopper (die Zeit trennt)
- Johnson ↔ Hopper, Armstrong
- Leavitt ↔ Bell Burnell ↔ Payne-Gaposchkin: Die Werkzeuge trennen (Glasplatten, Antennenfeld, Lichtzerlegung). Bell Burnells Karte warnt selbst vor der Verwechslung mit Leavitt.
- Humboldt ↔ Merian (1799 und 1699, Südamerika)
- Hokusai ↔ Gutenberg („gedruckt“) und Murasaki (Fuji, Japan)
- Cai Lun ↔ Gutenberg und Murasaki („Hof des Kaisers“)
- Bertha Benz ↔ Merian, Humboldt (Reise)
- Mandela ↔ Maathai

## Unsicher

- Ob Kleine Satz 1 bei Lovelace („Rechenschritte“), Wu („Spiegelbild“), Franklin („winzige Dinge ganz innen“) und Darwin („Arten“) beim Vorlesen verstehen, ist meine Einschätzung. Das klären nur Rückmeldungen echter Kinder.
- Ob ein Profi-Kind das Einstein-Rätsel wirklich zu Leavitt zieht, ist eine Einschätzung. Gemessen sind nur die Wortüberschneidung und die 60 %.
- Fachliche Fragen gehen an den fakten-pruefer: die neuen Ausschlüsse, der Einstein-Vorschlag „Arbeit über Licht … 1921 Nobelpreis“ und der Ibn-Sina-Vorschlag „ordnete, was man damals über Krankheiten und Heilung wusste“.

**Dateien:**
- Entwürfe: /home/user/wunderkompass/docs/entwurf/2026-11-25-personen-raetsel-entscheidungen.md, /home/user/wunderkompass/docs/entwurf/2026-11-25-personen-raetsel-neufassung-alt.md, /home/user/wunderkompass/docs/entwurf/2026-11-25-personen-raetsel-stufenpruefung.md
- Code: /home/user/wunderkompass/app/world-game-runde.ts, /home/user/wunderkompass/app/world-game-support.mjs, /home/user/wunderkompass/app/world-game-fallen.json, /home/user/wunderkompass/app/world-game-bank.ts, /home/user/wunderkompass/app/world-games.tsx (Zeile 62: Tipp und Rückmeldung)
