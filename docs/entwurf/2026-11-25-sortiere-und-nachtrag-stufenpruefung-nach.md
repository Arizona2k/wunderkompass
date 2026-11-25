# Stufen-Nachprüfung der ⚠-Stellen: Sortiere die Zeit Fassung 3 und Experten-Nachtrag (25.11.2026)

Helfer: `stufen-pruefer` (opus/high), 25.11.2026. Ungeprüfte Helfermeinung; Claude entscheidet.

Ich habe keine Datei geändert. Die beiden Ratemuster-Prüfungen und die Zählungen zu Abschnitt 4 und 5 habe ich mit `node` direkt aus den JSON-Blöcken der Entwürfe nachgerechnet. Der Test `tests/ratemuster.test.mjs` selbst lief nicht. Zum Vergleich habe ich `app/classic-reason-game.tsx`, `app/kern/stufe.ts` und `app/kern/stufen-vorschlag.tsx` gelesen.

**Zusammenfassung:** Geprüft habe ich 24 Stellen: A1 bis A13 aus der Tabelle in Abschnitt 6 (die ⚠ in der Zeitwort-Tabelle ist A12) und B1 bis B11. Die übrigen ⚠-Zeichen in den Dateien sind nur Verweise im Text.
- **21 ok, 3 Befunde** zu den Stellen, dazu 3 kleine Zusatzpunkte zu den Ziehregeln und Tipp-Listen.
- **Muss (1):** B7, die Frage von pilze-3 verrät die Pilz-Hälfte der Lösung. Den Wortlaut hatte ich selbst vorgeschlagen. Das hätte ich in meinem letzten Bericht sehen müssen.
- **Soll (2):**
  - A13: Der Satz ohne Stempel kann gleichzeitig mit dem Vorschlag „leichter spielen“ erscheinen.
  - B11: Der erste Tipp von pilze-3 hilft nicht gegen die Hauptfalle.
- **Kann (3):**
  - Abschnitt 4, Offen 2: nur einen schon geprüften Tipp anhängen.
  - Abschnitt 5: eine weiche Regel gegen zu leichte Profi-Runden.
  - Endfassung B, Zeile 83: eine Behauptung richtigstellen.

---

## A) „Sortiere die Zeit“, Fassung 3

**Nachgezählt:** Die Tipp-Zuordnungen in Abschnitt 4 stimmen in allen 30 Ziehungen. Auch die Zahl der Nachbarpaare ohne Tipp stimmt: ganz-frueh 7, buch-bis-bahn 20, motoren 6, weltall-netz 7.

| Nr. | Ergebnis |
|---|---|
| A1 Römer/Null | **ok.** Durch „noch keine“ ordnet der Tipp Rom vor Null, also genau zwei Teile. Er kommt nur in Ziehungen ohne Schrift oder ohne Pyramide. Offen bleiben dort Papier/Null (523 Jahre) und ein leichtes Paar mit Schrift oder Pyramide. Für Experte passt das. Die Alternative aus Offen 1 („viel älter als“) ist noch direkter. Ich würde sie nicht nehmen. |
| A2 Flugzeug/Rakete | **ok.** Nur in der Ziehung ohne Auto. Danach bleibt Telefon/Flugzeug (27 Jahre) zum Denken. |
| A3 Auto/Rakete | **ok.** Nur in der Ziehung ohne Flugzeug. A2 und A3 kommen nie zusammen. Das ist nicht neu, aber zur Erinnerung: In den Ziehungen ohne Flugzeug und ohne Rakete bleibt das engste Paar des ganzen Spiels offen, Telefon/Auto mit 10 Jahren. Der Tipp „zehn Jahre vor dem Auto“ steht in `tipp2` hinter Aufzug/Telefon. Das ist schon als Wissens-Paar bekannt und bleibt beim `spieltester` zu beobachten. |
| A4 Kolumbus-Brief | **ok.** Denk-Tipp bleibt (E4). Die Aufteilung in zwei Sätze ändert an der Schwierigkeit nichts. |
| A5 Fernrohr/Hooke | **ok.** Ein Wissens-Tipp auf Tipp 2 ist in Ordnung. Im Aktiv nicht verräterischer als mein Wortlaut. |
| A6 Hooke/Newcomen | **ok.** Mein Wortlaut. Mikroskop/Dampfmaschine bleibt nur noch in 3 von 15 Ziehungen offen. |
| A7 Name Mikroskop | **ok.** Der Name gibt keinen Hinweis auf die Zeit. „Hookes Zeichnungen“ in den Tipps lässt sich über „Robert Hooke“ eindeutig zuordnen. |
| A8 Smartphone, `erklaerung` | **ok.** Erscheint erst nach dem Lösen und nur auf Profi, ändert also nichts an der Schwierigkeit. |
| A9 Patent | **ok.** Erscheint erst nach dem Lösen. |
| A10 Quelle Telefon | **ok.** Ändert nichts an der Schwierigkeit. Die Quelle selbst prüft der `fakten-pruefer`. |
| A11 `vChrErklaerung` | **ok.** Erscheint erst nach dem Lösen, also keine Lösehilfe. „Die größere Zahl ist früher“ ist für 8- bis 10-Jährige ein guter kleiner Gedanke. |
| A12 Zeitwort `spät` | **ok, mit Beobachtungs-Hinweis.** Für Entdecker ist „vor ein paar hundert Jahren“ gegen „vor weniger als 100 Jahren“ anspruchsvoller als „30 bis 70“: In beiden Zeitwörtern steckt „hundert“. Ein 5- oder 6-jähriges Kind muss verstehen, dass „ein paar hundert“ mehr ist als 100. Trotzdem tragbar, aus drei Gründen: Ein Elternteil liest meist mit. Die Namen helfen (Satellit, Mondlandung, Internetseiten klingen neu). Und mit den grünen festen Teilen ist das Rätsel nach höchstens drei Versuchen gelöst (D2). Beim `spieltester`-Lauf mit der Rolle „6 Jahre, Vorlesen“ gezielt beobachten. Einen besseren Wortlaut ohne „hundert“, der nicht altert und sachlich stimmt, habe ich nicht gefunden. |
| A13 `rundeOhneStempel` | **Befund (Soll), siehe unten.** Der Satz selbst tadelt nicht. Problematisch ist, dass er mit dem Vorschlag „leichter spielen“ zusammenfallen kann. |

**Befund A13 (Soll), Abschnitt 3, Einbau-Regeln „Ende der Runde“ und „Stufen-Vorschläge“:**
- **Problem:** Drückt ein Kind in beiden Rätseln „Lösung zeigen“, entstehen zwei falsche Antworten hintereinander. Nach `stufenVorschlag` in `app/kern/stufe.ts` erscheint dann genau beim zweiten Rätsel „Ganz schön knifflig. Willst du eine Stufe leichter spielen?“. Im selben Moment kommt `rundeOhneStempel` mit der eigenen Frage „Willst du gleich noch eine Runde spielen?“.
- Das Kind hat dann zwei Fragen und vier Knöpfe zugleich vor sich. Und zwei Sätze über das Nicht-Schaffen stehen direkt untereinander (Prüfpunkt 8: „ohne zu beschämen“).
- **Vorschlag**, als Einbau-Regel ergänzen:
  - „Kommt am Ende der Runde ein Vorschlag ‚leichter‘, erscheint zuerst nur er.
  - Bei ‚Nein, ich bleibe‘ folgt `rundeOhneStempel`.
  - Bei ‚Ja, leichter spielen‘ entfällt der Satz, und eine neue Runde auf der leichteren Stufe startet.“
- Am Wortlaut „selbst löst“ habe ich nichts auszusetzen. Ob „selbst“ nach „nicht selbst gemacht“ klingt, entscheidet die `kinder-redaktion`.

**Zusatzpunkt, Abschnitt 4 / Offen 2 (Kann):**
- Den Hooke-Buch-Tipp (Buchdruck/Mikroskop) anzuhängen hilft fast nicht.
  - In der Ziehung ohne Fernrohr+Dampfmaschine steht der Buchdruck nach Tipp 1 schon vorn.
  - Offen bleiben dort Karibik/Mikroskop (173 Jahre) und Mikroskop/Eisenbahn (160 Jahre).
- Der Dampflok-Tipp dagegen schließt in der Ziehung ohne Fernrohr+Mikroskop das Paar Dampfmaschine/Eisenbahn (113 Jahre). Dann bleibt nur Karibik/Dampfmaschine (220 Jahre) offen.
- **Vorschlag:** Nur `{"braucht":["zeit-dampfmaschine","zeit-eisenbahn"],"text":"Was musste es geben, damit eine Dampflok fahren kann?"}` vor die Vorlage in `tipp2` hängen. Der Satz ist schon geprüft.
- Nötig ist es nicht: Die offenen Paare dort liegen alle über 100 Jahre auseinander.

**Zusatzpunkt, Abschnitt 5, Profi-Ziehregel (Kann):**
- **Immer lösbar: ja.** Alle Paare liegen mindestens 50 Jahre auseinander, es gibt also keinen Gleichstand und genau eine richtige Reihenfolge. Der Tipp ist fest gewählt, und eine neue Reihe ist nie schon richtig.
- **Nie zu leicht: nicht ganz.**
  - Bei 1.033 von 2.815 Rätseln (37 %) liegen alle Teile mindestens 132 Jahre auseinander, so weit wie mindestens auf Entdecker.
  - Bei 315 Rätseln (11 %) sind es sogar mindestens 300 Jahre.
  - Mit vier Teilen und ohne Zeitwort ist das immer noch schwerer als Entdecker. Aber etwa jede siebte Runde (37 % × 37 %) besteht aus zwei solchen Rätseln.
- **Vorschlag:** weiche Regel „Je Runde hat mindestens ein Rätsel ein Paar unter 132 Jahren.“ Das trifft auf 1.782 Rätsel zu, an Abwechslung fehlt es also nicht.

---

## B) Experten-Nachtrag „Stimmt das wirklich?“

**Ratemuster nachgerechnet**, mit der Regel aus `tests/ratemuster.test.mjs`, Detektiv mit dem Nachtrag:
- Profi (12 Fragen): keine verräterischen Wörter. Die richtige Antwort ist 0-mal die einzige längste und 1-mal die einzige kürzeste.
- Experte (8 Fragen): keine verräterischen Wörter, 0-mal einzige längste, 0-mal einzige kürzeste.
- luft-3: 42* / 47 / 41 / 46 Zeichen (die richtige mit *).
- pilze-3: 52* / 53 / 48 / 48 Zeichen, je 8 Wörter.
- Einschränkung: Bei nur 8 Experten-Fragen schlägt die Regel (mindestens 3 Treffer) kaum an. Darum habe ich zusätzlich von Hand geprüft.

| Nr. | Ergebnis |
|---|---|
| B1 „prall wie ein Ballon“ | **ok.** Das Bild bereitet Tipp 2 vor und verrät nichts. |
| B2 `why`, 3. Satz | **ok.** Dass auch die Wärme-Falle „dehnt sich aus“ enthält, ist gut: Die Falle bleibt dadurch verlockend. |
| B3 Tipp 2, Luftballon | **ok.** Er führt stark, aber das Kind muss selbst „Hände = Luft von außen“ übertragen. Er nennt weder „außen“ noch „weniger“. „Ausdehnen“ kann sogar zur Wärme-Falle locken. Als zweiter Tipp auf Experte passt das. |
| B4 „warum nicht“ Wärme | **ok.** Die Lösung von wasser-4 ist nicht mehr verraten. Kleine Richtigstellung siehe unten. |
| B5 „warum nicht“ Loch | **ok.** Er hilft beim zweiten Versuch in Richtung Lösung. Das ist erwünscht und zählt nicht für den Stufen-Vorschlag, weil nur die erste Antwort zählt (`classic-reason-game.tsx`). |
| B6 „warum nicht“ Schwerkraft | **ok.** |
| B7 Frage pilze-3 | **Befund (Muss), siehe unten.** |
| B8 2×2-Feld | **ok.** Alle vier Antworten sind gleich gebaut und ähnlich lang. Das einzige Wort, das nur in einer Antwort steht („wächst“), steht in einer falschen. |
| B9 3 × „warum nicht“ | **ok.** Jede klärt nur eine Hälfte, danach bleiben zwei Antworten. Keine verrät die ganze Lösung. |
| B10 `why` | **ok.** Verrät keine andere Experten-Frage derselben Runde, denn pflanzen-3 steht in derselben Gruppe „nahrung“. |
| B11 Tipps | **Befund (Soll), siehe unten.** |

**Befund B7 (Muss), pilze-3, `prompt`:**
- **Problem:** „In einem dunklen Keller … Daneben **wachsen** Champignons auf Kompost.“ Die Frage sagt selbst, dass die Pilze im Dunkeln wachsen. Die schwerere Hälfte (Pilze brauchen kein Licht) steht damit in der Aufgabe.
- Übrig bleibt nur die leichte Hälfte (Pflanzen brauchen Licht). Die Frage fällt dadurch auf Profi zurück.
- Dazu verrät der Gegensatz „Basilikum *steht*“ und „Champignons *wachsen*“ etwas.
- **Vorschlag**, beide Lebewesen gleich neutral einführen:
  „Jemand bringt einen Topf Basilikum in einen dunklen Keller. Daneben stellt er eine Kiste Kompost mit Champignons. Was passiert in den nächsten Wochen?“ (9 / 8 / 6 Wörter).
  - Kurz an den `fakten-pruefer` (Kiste mit Kompost) und die `kinder-redaktion`.
  - „Der Kompost unter den Pilzen“ im `why` passt weiter.
- **Zum Zeitraum (Offen 2):** Für die Stufe ist „in den nächsten Wochen“ besser als „lange im Dunkeln“. Bei „lange“ kann ein kluges Experten-Kind einwenden, dass auch die Pilze irgendwann den Kompost aufbrauchen. Dann wäre „beide schwach“ vertretbar und die Frage nicht mehr eindeutig. Wenn der Zeitraum fachlich hält, sollte er so bleiben.

**Befund B11 (Soll), pilze-3, `hints[0]`:**
- **Problem:** Die verbreitetste Fehlvorstellung ist „Dunkelheit schadet allen“, also die Falle „beide werden schwach“. Tipp 1 („Was brauchen grüne Blätter …?“) hilft genau diesem Kind nicht, denn es hält das Basilikum schon für schwach. Er klärt nur die leichte Hälfte.
  - Das war mein eigener Vorschlag. Mit der Korrektur aus B7 wiegt das schwerer, denn dann ist die Pilz-Hälfte die eigentliche Denkarbeit.
- **Vorschlag:**
  - Tipp 1 wird der neutrale Satz aus Offen 4: „Überleg für jedes Lebewesen einzeln: Woher kommt seine Nahrung?“ Er bricht das „beide gleich“-Denken auf und verrät keine Hälfte.
  - Tipp 2 bleibt „Champignons haben keine grünen Blätter. Wovon leben sie dann?“. Er deckt über „grüne Blätter“ auch die Basilikum-Hälfte mit ab.

**Richtigstellung zu B4 (Kann), Endfassung B, Abschnitt 1, Zeile 83 („… und `wasser-4` verrät es nicht“):**
- Das stimmt nur in eine Richtung. Das `why` von wasser-4 („Oben wird die Luft kälter, nicht wärmer“) nimmt in luft-3 weiterhin die Wärme-Falle weg, wenn wasser-4 in derselben Runde vorher kommt.
- Das kommt in etwa jeder sechsten Runde vor: wasser-4 wird in einem Drittel der Runden gezogen, und nur in der Hälfte davon kommt es zuerst. Danach bleiben drei Antworten. Wie entschieden: vertretbar.
- Nur den Satz in den Unterlagen richtigstellen, zum Beispiel: „Umgekehrt nimmt wasser-4 in luft-3 höchstens die Wärme-Falle weg; das ist vertretbar.“

---

## Unsicher
- **pilze-3 und die Gegensatz-Erwartung:** Wer zwei Lebewesen nebeneinander sieht, erwartet oft, dass sie sich verschieden verhalten. Ein geübtes Kind tippt darum eher auf eine der beiden gemischten Antworten und braucht dann nur noch eine Tatsache. Das liegt am 2×2-Feld selbst (wie bei meer-4) und lässt sich nicht ganz vermeiden. Ob 10- bis 12-Jährige so raten, zeigen nur echte Kinder oder ein `spieltester`-Lauf.
- Ob Entdecker „weniger als 100“ und „ein paar hundert“ ohne Elternteil auseinanderhalten (A12), kann ich nicht beurteilen.
- Ob Telefon/Auto (10 Jahre, ohne Tipp in 2 von 5 motoren-Ziehungen) auf Experte Knobeln oder Raten ist, bleibt offen wie bisher.

**Dateien**
- /home/user/wunderkompass/docs/entwurf/2026-11-24-sortiere-die-zeit-endfassung-2.md
- /home/user/wunderkompass/docs/entwurf/2026-11-24-stimmt-das-experte-nachtrag-endfassung.md
- /home/user/wunderkompass/docs/entwurf/2026-11-24-sortiere-und-nachtrag-stufenpruefung.md (mein voriger Bericht)
- /home/user/wunderkompass/app/kern/stufe.ts (`stufenVorschlag`, zu A13)
- /home/user/wunderkompass/app/classic-reason-game.tsx (nur die erste Antwort zählt, zu B5)
- /home/user/wunderkompass/tests/ratemuster.test.mjs
