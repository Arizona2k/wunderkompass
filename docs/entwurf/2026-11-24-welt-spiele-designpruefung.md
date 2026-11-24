# Teil B, Aufgabe 8: Design-Prüfung der Welt-Spiel-Runden

Stand: 24.11.2026. Bericht des `design-pruefer` zum Code-Stand `4b29615` (lokaler Build, Chromium), vollständig übernommen. Die Bilder lagen nur im Scratchpad des Chats (`design-b8/`) und sind nicht im Repository. Was Claude daraus gemacht hat, steht am Ende.

Geprüft habe ich den lokalen Build `dist/` in Chromium, ohne Neubau, über eine eigene Vorschau auf Port 4480. Die Vorschau ist beendet. Projektdateien habe ich nicht angefasst. `git status` zeigt zwei Änderungen (`app/knowledge-challenge-game.tsx`, `tests/browser/spiel-auswahl.mjs`); die stammen nicht von mir. Eine Vorschau auf Port 4490 war beim Aufräumen nicht erreichbar; ich habe sie nicht angefasst.

Alle Bilder liegen in `/tmp/claude-0/-home-user-wunderkompass/3a68ef24-47f6-5148-8204-dbed78581f5f/scratchpad/design-b8/` (ich nenne sie unten nur mit Dateinamen). Die Messprotokolle stehen in `log.txt` und `fokus-log.txt`. Die Skripte sind `shots.mjs` und `fokus.mjs`.

## Muss vor dem PR
1. **Abschlussbild bei Profi und Experte:** Über der Freude über die gelöste Runde steht „Zu schwer? Zurück zu Entdecker“ (`p6-profi-abschluss-390.png`). Der Satz entwertet die gerade geschaffte Runde. Ein Tipp darauf würde außerdem sofort eine neue Runde starten und den Abschluss wegwischen. Vorschlag: Auf dem Abschlussbild `.stufen-zurueck` nicht zeigen (`!done`). Das Ändern kann bleiben.
2. **Auf kleinen Handys liegen die Antworten unter der Falz:** Die Stufenzeile kostet 56 px, mit Hinweis und „Zu schwer?“ bis zu rund 130 px. Bei Foto und Profi oder Experte liegt Antwort A bei 390 px erst bei y=913 (`z2-profi-390.png`, Falz bei 844). Bei 320 px liegt sie bei y=935 (`z3-experte-320.png`). Auch bei Entdecker mit Foto liegt A bei 320 px erst bei y=847 (`z1-entdecker-320.png`). Das Foto ist zu sehen, das Handeln ist es nicht. Vorschläge: Das Foto bei Profi und Experte auf Handys etwas niedriger machen, oder „Zu schwer?“ in dieselbe Zeile wie „Stufe: Profi“ ziehen (siehe Feinschliff 3).

Nicht blockierend, aber vor dem PR bewusst entscheiden: der Fokus nach Antwort und die Inhaltsbeobachtung zu Koala (beide unter „Wichtig“).

## Gesamteindruck je Breite
- **320 px:** Alles passt ohne waagerechtes Scrollen. Die Stufenzeile bricht sauber um. Der Kopf der Runde ist aber hoch, und die Antworten rutschen nach unten (siehe oben).
- **390 px:** Sauber, Tippflächen gut, Stufen-Panel klar lesbar. Dasselbe Höhenproblem bei Foto und Profi.
- **768 px:** Ruhig und lesbar. Die Fotokarte ist schmaler als Brett und Antworten (650 gegen 722 px, siehe Feinschliff 4).
- **1280 px:** Gut lesbar, Brett 1000 px breit. Der Seitentitel steht bei x=30, die Stufenzeile bei x=140 (siehe Feinschliff 4).
- **1440 px:** Gleiches Bild wie bei 1280 px. Die Abschlusskarte lässt unten viel Leere.

Messwerte zu allen Breiten und Zuständen:
- Kein waagerechtes Scrollen (`scrollWidth` = `clientWidth`).
- Kein Bedienelement im Spielraum ist kleiner als 44 px.
- Ändern ist 81×48 px.
- Die Stufen-Knöpfe sind 76 px hoch.

## Befunde

### Blockierend
Keine.

### Wichtig
1. **Abschluss:** Die Stufenzeile steht über dem Abschluss, wie gewünscht. Der Abschluss selbst ist aber dünn (`z6-abschluss-320.png`, `z6-abschluss-1280.png`, `p6-profi-abschluss-390.png`).
   - Die einzige Handlung ist „Zu einer passenden Entdeckerkarte“ in kleiner Randoptik.
   - „Neue Runde“ steht nur weit oben, klein und gleich gewichtet wie „Alle Spiele“.
   - Es gibt keinen Vorschlag wie „Noch eine Runde“ oder „Probier Profi“.
   - Vorschlag: im Abschluss „Noch eine Runde“ als Hauptknopf, die Entdeckerkarte als zweiten Knopf. Bei 1280 px bleibt die Seite sonst halb leer.
2. **Fokus nach richtiger Antwort:** Die richtige Antwort wird deaktiviert, der Fokus fällt auf `BODY` (`fokus-log.txt`, Zeile „nach Antwort (Maus)“). Tastaturkinder müssen durch die ganze Seite tabben, um „Nächste Aufgabe“ zu erreichen. Das war schon vorher so (`quiz-answer`), gehört aber zur Fokus-Regel der Prüfliste. Vorschlag: Fokus beim Erscheinen von „Nächste Aufgabe“ auf diesen Knopf setzen. Ich habe dies nur mit der Maus gesehen, nicht mit einem reinen Tastaturlauf bis zur richtigen Antwort.
3. **Inhalt, nur gemeldet:** Beim Koala im Profi-Lauf stehen „Offene Landschaften“ und „Trockene offene Landschaften“ nebeneinander (`z2-profi-1280.png`). Das sieht für ein Kind fast gleich aus. Das ist Sache von `stufen-pruefer` oder `fakten-pruefer`. Ich habe keine fachliche Prüfung gemacht.

### Feinschliff
1. **Hinweis zur Rundenstufe** (Zustand 4, `z4-gemischt-320.png`, `z4-gemischt-1280.png`): Der Satz „Diese Runde spielst du noch als Entdecker …“ steht in 15 px mit nur etwa 8 px Abstand direkt über „AUFGABE 1 VON 5“. Beides fließt zusammen. Vorschlag: größerer Abstand darunter (mindestens 12 px) und 16 px Schrift.
2. **Hinweis bei Experte** (`z3-experte-320.png`): Der Hinweis steht in 15 px (Regel: Fließtext mindestens 16 px) und lässt „Profi.“ allein in der zweiten Zeile stehen. Auch hier hilft 16 px. Der Kontrast ist ausreichend.
3. **„Zu schwer? Zurück zu Entdecker“** hat 4 px Polster links (`.stufen-zurueck`, `padding: 0 4px`). Dadurch sitzt der Text 4 px weiter rechts als „Stufe:“ und die Aufgabe (`z2-profi-1280.png`). Vorschlag: `margin-left: -4px`. Zudem steht der Satz in einer eigenen Zeile. Bei Experte plus Hinweis stehen vier Zeilen Metatext vor der Frage (Stufe, Hinweis, Link, Aufgabe-Nummer, `z3-experte-320.png`). Ein Vorschlag: den Link rechts in die Stufenzeile setzen, wenn Platz ist.
4. **Fotokarte und Ausrichtung** (`z1-entdecker-768.png`, `z1-entdecker-1440.png`): Das Foto sitzt in einer 650 px breiten, linksbündigen Karte. Brett und Antworten sind 722 px (768) beziehungsweise 1000 px (1280 und 1440) breit. Hochformat-Fotos wie der Koala stehen als schmaler Streifen in einem grauen Kasten. Außerdem sitzt die Überschrift „Tier & Lebensraum“ bei 1280 px links bei x=30, das Brett bei x=140. Das ist vorhandenes `WorldPhoto`-Verhalten, kein neuer Fehler. Vorschlag: Foto auf Brettbreite oder zentrieren.
5. **Kleine Schrift im Brett:** „Brauchst du einen Tipp?“ hat 14 px, „Vorlesen“ und „Rückmeldung vorlesen“ ebenfalls klein. Der Kontrast ist ausreichend (Tipp 5,9:1).
6. **Escape im offenen Stufen-Panel** schließt es nicht (`fokus-log.txt`, „Kbd Escape: offen=1“). Das ist kein Dialog, sodass es nicht stören muss. Zum Schließen muss man „Ändern“ erneut bedienen.
7. **Falsche Antwort** (`z5-falsch-320.png`, `z5-falsch-1280.png`): Die Rückmeldung ist gut lesbar. Der Satz „Diese Wahl passt zum Beispiel zu: Kaiserpinguin. Gesucht ist aber: Gartenkreuzspinne. Wo findet dieses Tier Futter und Schutz?“ hat zwei Doppelpunkte und endet mit der wiederholten Frage. Für 5-Jährige ist das viel. Bei Personen sieht die Rückmeldung anders aus („Du hast „Cai Lun“ gewählt. Vergleiche …“, `p5-falsch-390.png`). Das ist Sache von `kinder-redaktion`.

## Zu den sieben Zuständen
1. **Entdecker** (`z1-*`): Stufenzeile oben, „AUFGABE 1 VON 5“, 3 Antworten, bei allen fünf Breiten wie gewünscht.
2. **Profi** (`z2-*`, `p2-profi-*`): „AUFGABE 1 VON 8“, 4 Antworten, wie gewünscht. Personen (`p2-*`) laufen ohne Umbruchprobleme.
3. **Experte** (`z3-*`): Hinweis „Experte gibt es hier noch nicht. Du spielst Profi.“ steht in der Stufenzeile und ist lesbar.
4. **Runde als Entdecker, dann Profi im Pass** (`z4-gemischt-*`): Der Hinweis erscheint wie vorgesehen. „Zu schwer?“ fehlt hier richtig, weil die Runde ohnehin Entdecker ist.
5. **Falsche Antwort** (`z5-*`, `p5-*`): Rückmeldung erscheint direkt unter den Antworten. Die falsche Antwort ist orange getönt, der Text bleibt lesbar. Das Orange ist sparsam, die Rückmeldung ruhig petrolfarbig.
6. **Abschluss** (`z6-*`, `p6-*`): Stufenzeile steht darüber, wie gewünscht (aber siehe „Muss vor dem PR“ 1).
7. **Fokus:**
   - Per Tipp oder Klick auf „Ändern“ öffnet sich das Panel (`f1-offen-320.png`, `f1-offen-390.png`, `f1-offen-1280.png`). Der Fokus liegt auf der aktuell gewählten Stufe.
   - Nach der Wahl liegt der Fokus auf „Ändern“. Das gilt bei 320 px, 390 px und 1280 px für Profi und Experte, mit Touch und mit Maus (`f2-nach-profi-*.png`, `f3-nach-experte-*.png`).
   - Nach Maus oder Touch erscheint kein Rahmen (`outline: none`, `:focus-visible` falsch).
   - Mit Tastatur ist der Ring 3 px petrol und klar sichtbar (`k2-tab-1280.png`, `k4-tab-1280.png`, `k12-nach-wahl-1280.png`).
   - Der Tab-Durchlauf bei 1280 px ist (`k1` bis `k9-tab-1280.png`) schlüssig: Neue Runde, Ändern, Vorlesen, Tipp, A, B, C, Was ist neu?, Für Eltern. Im Panel lief die Tastatur mit Enter und Tab stimmig (`k10-panel-fokus-1280.png`, `k11-panel-tab-1280.png`).
   - Nach „Neue Runde“ und nach „Zu schwer?“ mit der Maus blieb der Fokus ebenfalls an einem Bedienelement, nicht an einer Überschrift.
   - Bei „Bewegung reduzieren“ gab es in der Stufenzeile und bei den Antworten keine Übergänge oder Animationen (`fokus-log.txt`).

## Was gut ist
- Die Stufenzeile ist klein und zurückhaltend und stört die Aufgabe nicht. Ändern ist 48 px hoch.
- Das Stufen-Panel hat einen eigenen Titel und sieht nicht wie Antworten aus. Der gewählte Eintrag hat Haken und Rand.
- Der Fokus bleibt nach dem Stufenwechsel auf „Ändern“. Nach Maus gibt es keinen Rahmen, nach Tastatur einen klaren.
- Die Kontraste der geprüften Texte sind ausreichend. Gemessen wurden Eyebrow 5,1:1, Stufen-Beschreibung 6,5:1 und Panel-Titel 6,9:1.
- Lange Personentexte bei 390 px (`p1-entdecker-390.png`, `p5-falsch-390.png`) laufen sauber um.

## Nicht geprüft
- Echte Geräte und Touch-Gesten (nur Playwright-Emulation mit `isMobile` und `hasTouch`).
- Firefox und WebKit.
- Bildschirmleser (Vorlesen von Stufenzeile und Gruppen-Titel).
- „Bewegung reduzieren“ nur an einem Messwert (keine Übergänge), nicht gesehen bei einem Seitenwechsel.
- Das Glossy-Verhalten (Lichtschimmer) beim Zeigen und Antippen. Beim Tippen auf die Stufen-Knöpfe habe ich keinen Effekt beobachtet, aber das nicht gezielt geprüft.
- Eine Tastatur-Runde bis zur richtigen Antwort und das Verhalten beim Blättern in langen Runden.
- Hinweis zu den Bildern: Bei Vollseiten-Screenshots erscheint die feste untere Leiste („Start, Welten, …“) mitten im Bild. Das ist ein Messartefakt von `fullPage`, kein Fehler der Seite.

## Umsetzung (Claude, 24.11.2026)

- **Muss 1, „Zu schwer?“ auf dem Abschluss:** behoben. `StufenWahl` hat `ohneZurueck`; die Welt-Spiele setzen es auf dem Abschlussbild (Browser-Suite `spiel-auswahl` prüft, dass der Knopf dort fehlt).
- **Muss 2, Antworten unter der Falz:** gemildert. Auf Handys (bis 560 px) ist das Foto in der Runde 150 px hoch und hat 12 px statt 20 px Abstand; die Stufenzeile hat unten 12 px. Außerdem öffnet ein Spiel jetzt oben (Spieltest G). Den Link „Zu schwer?“ in die Stufenzeile zu ziehen (Feinschliff 3) ist nicht umgesetzt.
- **Wichtig 2, Fokus nach richtiger Antwort:** behoben. Der Fokus geht auf „Nächste Aufgabe“ bzw. „Spielstempel sammeln“, nach der letzten Aufgabe auf die Überschrift „Eine ganze Runde gelöst!“ (Browser-Suite `spiel-auswahl`).
- **Feinschliff 1 bis 3:** Hinweise in 16 px mit mehr Abstand, „Zu schwer?“ bündig (`margin-inline-start: -4px`).
- **Wichtig 1 (Abschluss), Wichtig 3 (Koala), Feinschliff 4 bis 7:** ins BACKLOG (Punkt 25).
