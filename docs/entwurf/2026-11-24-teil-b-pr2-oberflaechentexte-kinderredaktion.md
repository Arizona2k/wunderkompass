# Kinder-Redaktion der Oberflächentexte Teil B, PR 2, 24.11.2026

Helfer: `kinder-redaktion`. Geprüft: die eingebauten Texte aus Commit `cf15116`. Claude hat die Vorschläge danach eingebaut (gemeinsame Sätze `nochNichtSatz`/`rundeNochSatz` in `app/kern/stufe.ts`, „Noch eine Runde“, neue Texte für Neuigkeit, Entdeckung, Bildunterschrift, Detektiv und Memory).

**Gesamteindruck:** geht so, nah an gut. Der Ton ist warm, lobt die Ausdauer und setzt das Kind nicht unter Druck. Probleme gibt es an drei Stellen: Ein Knopftext ist zu lang. Die Stufenzeile nennt die neue Stufe nicht beim Namen. Und zwei Sätze lassen sich falsch verstehen („startet gleich“, „Jedes Land hat seine Hauptstadt“). Ich habe die Texte über die Fundstellen in `app/` gelesen; `git show` konnte ich nicht ausführen.

**Befunde (je Satz)**

1. `app/kern/neuigkeiten.ts`, `kreuz-und-quer`
   - Titel „Kreuz und quer und neue Fragen“: Das doppelte „und“ stolpert. Vorschlag: **„Neuer Name, neue Fragen“**.
   - Text: Der erste Satz hat 15 Wörter und zwei Aussagen. „startet gleich“ kann auch „startet bald“ heißen. Vorschlag: **„Aus der Wissens-Challenge wird „Kreuz und quer“. Du spielst sofort auf deiner Stufe. „Stimmt das wirklich?“ hat neue Fragen zu Wetter, Meer und Pilzen.“** Das englische Wort „Challenge“ ist hier als alter Name in Ordnung.

2. `app/discovery-data.ts`, Startseite
   - Die Überschrift „Blüten und Bestäuber verbinden“ verspricht ein Zuordnungsspiel. Es kommen aber gemischte Fragen. Vorschlag Titel: **„Eine Frage zu Bienen und Blüten“** (passt zum Bildschirmfoto).
   - Text: Der erste Satz hat 16 Wörter. Vorschlag: **„Bei „Kreuz und quer“ kommen Fragen aus allen Welten. Zum Beispiel zu Bienen und Blüten. Du spielst auf deiner Stufe.“**
   - Knopf „Kreuz und quer öffnen“: kann bleiben. Aktiver wäre **„Kreuz und quer spielen“**, aber siehe Unsicher.

3. Bildunterschrift „Bildschirmfoto aus dem Spiel · So sieht eine Aufgabe aus.“ (`app/discovery-activity-preview.tsx` und `caption` in `app/knowledge-preview-image.json`): passt. Ohne Mittelpunkt wäre es glatter: **„Bildschirmfoto: So sieht eine Aufgabe im Spiel aus.“**

4. Knopf „Noch eine Runde auf deiner Stufe“ (`app/classic-reason-game.tsx` und `app/knowledge-challenge-game.tsx`): **Dieser Knopftext soll sich ändern.** Sechs Wörter sind zu lang für einen Knopf, und „deine Stufe“ steht ohnehin direkt darüber in der Stufenzeile („Stufe: Profi“). Vorschlag: **„Noch eine Runde“**. Wer die Stufe nennen will, nimmt die tatsächlich gespielte Stufe: „Noch eine Runde als Profi“. Bei gewähltem Experten sonst nicht „als Experte“ schreiben, wenn Profi gespielt wird. Vor dem Ändern Tests nach dem Wortlaut durchsuchen.

5. „Du hast alle {n} Aufgaben gelöst. Toll, wie du drangeblieben bist!“ (`app/classic-reason-game.tsx`): passt, gutes Lob für die Ausdauer.

6. „Oder mach eine Pause. Hier hetzt dich niemand.“: „hetzt“ klingt nach Stress und spricht ihn so erst an. Vorschlag: **„Oder mach eine Pause. Du kannst jederzeit weiterspielen.“** Am Ende von Kreuz und quer steht der Pausen-Satz anders („Mach gern eine Pause oder entdecke eine passende Karte.“). Beide Abschlussbilder sollten einheitlich sein.

7. `EXPERTEN_HINWEIS` (`app/knowledge-challenge.ts`): passt für die Experten-Stufe (Ältere). Wahlweise etwas runder: **„Hier gibt es erst wenige Experten-Fragen. Du bekommst bis zu drei davon, dann Profi-Fragen.“**

8. Memory-Abschluss (`app/learning-games.tsx`): „Jedes Land hat seine Hauptstadt.“ liest sich wie eine allgemeine Weltregel. Die stimmt auch nicht überall, manche Länder haben mehrere Hauptstädte. Gemeint ist das gelöste Spiel. Vorschlag: **„Alle sechs Paare gefunden! Jedes Land hat jetzt seine Hauptstadt.“**

9. „Stimmt die Aussage oder nicht? Prüfe sie wie ein Detektiv.“ (`app/learning-games.tsx`, `app/game-index.json`): „die Aussage“ bezieht sich auf nichts. Viele der 32 Detektiv-Fragen sind außerdem keine Stimmt-Fragen, sondern „Warum …?“ oder „Welche Erklärung passt?“. Vorschlag: **„Was stimmt, was nicht? Prüfe es wie ein Detektiv.“** Nebenfund in derselben Zeile: Die Angabe `meta: "10 knifflige Aussagen"` ist bei 32 Detektiv-Fragen veraltet. „Wer lebt wo?“ mit „8 Entdeckungen“ bitte ebenfalls nachzählen.

10. Spielliste „Fragen aus allen Welten, bunt gemischt. Du spielst auf deiner Stufe.“ (`app/world-games.tsx`, `app/game-index.json`): passt.

11. Stufenzeile „Diese Runde spielst du noch als <Stufe>. Die neue Stufe gilt ab der nächsten Runde.“ (`app/classic-reason-game.tsx`, `app/knowledge-challenge-game.tsx`, `app/world-games.tsx`): Der erste Satz ist gut. Beim zweiten muss das Kind selbst herausfinden, welche Stufe „die neue“ ist. Vorschlag: **„Diese Runde spielst du noch als Entdecker. Ab der nächsten Runde spielst du Profi.“** Im zweiten Satz muss die Stufe stehen, die tatsächlich gespielt wird: `weltSpielStufe(stufe)` bzw. `klassikSpielStufe(game, stufe)`, in Kreuz und quer `stufe`. Sonst stünde bei gewähltem Experten fälschlich „Experte“.

12. „Experte gibt es hier noch nicht. Du spielst Profi.“: Der Stufenname ohne Artikel klingt holprig. Vorschlag, passend zu Satz 7: **„Experten-Aufgaben gibt es hier noch nicht. Du spielst Profi.“**

Nebenbei: Den letzten Antwort-Knopf gibt es in zwei Fassungen, „Spielstempel sammeln“ (Kreuz und quer) und „Runde abschließen“ (klassisch). Außerdem wechselt Kreuz und quer zwischen „Fragen“ (Texte) und „Aufgaben“ (Zähler, Abschluss). Beides vereinheitlichen.

**Vorschlag für `more`:** Entfällt, es sind Oberflächentexte. Der Teilsatz „Du spielst auf deiner Stufe“ steht viermal (Startseite, Spielliste, „Was ist neu?“, Knopf). Kürzt man den Knopf, ist er immer noch dreimal da; das ist vertretbar.

**Unsicher:**
- Der Knopf „Kreuz und quer öffnen“ führt auf `#games`, also zur Spielübersicht und nicht direkt ins Spiel. Ein Kind erwartet nach dem Knopf das Spiel. Bitte den Weg prüfen und dann „öffnen“ oder „spielen“ wählen.
- Ob „Stimmt das wirklich?“ wirklich neue Fragen zu genau Wetter, Meer und Pilzen bekommen hat, habe ich nur grob gesehen (Pilz-Fragen sind vorhanden). Das ist Sache des `fakten-pruefer`.
- Die Bildwirkung des Bildschirmfotos habe ich nicht angesehen.
