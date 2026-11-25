# Stufen-Prüfung: Nachtrag Technik-Auflösungen (25.11.2026)

Helfer: `stufen-pruefer` (opus / high), geprüft: [Nachtrag-Entwurf](2026-11-25-technik-aufloesung-nachtrag-entwurf.md). Entscheidungen folgen nach allen drei Prüfungen.

Geprüft habe ich `/home/user/wunderkompass/docs/entwurf/2026-11-25-technik-aufloesung-nachtrag-entwurf.md` am Code im Arbeitsordner `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/wt-tech/`. Dazu gehören `app/world-game-bank.ts` (Zeile 51 bis 59), `app/world-game-runde.ts`, `app/world-game-support.mjs`, `app/world-game-fallen.json` und `app/world-catalog.json`. Ich habe keine Datei geändert. Meine Vorschläge habe ich mit dem Zählskript des `karten-autor` nachgezählt (`.../scratchpad/karten-autor/pruef.cjs`). Die Eingaben liegen in `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/stufen/v.json`.

## 1. Gesamteindruck

Alle sechs Auflösungen erklären jetzt ein „Wie“. Keine verrät eine andere Technik-Aufgabe, und keine widerspricht einer Lösung aus „Früher oder heute?“. Die alte Auto-Fassung (Benz, Benzinmotor) zog eher zu „Früher“; die neue Fassung in der Gegenwart stützt die Lösung „Heute“. Beim Tipp ist T-A die beste Grundlage, braucht aber ein anderes Wort. Der eigene Satz nach einer falschen Antwort ist wichtiger als der Tipp selbst: Er sollte gebaut werden.

## 2. Wahl je Text

Alle Texte gelten für alle Stufen gleich (Experte spielt Profi).

**Auto: A, mit kleiner Änderung**
- Der Vergleich mit der Kurbel (Druck nach unten wird Drehung) ist für 10- bis 12-Jährige echtes Übertragen auf etwas Bekanntes.
- B lässt genau diesen Schritt aus: „schiebt ein Metallteil weg … und dreht die Räder“. Wie aus Schieben Drehen wird, bleibt offen. „Viele Male pro Sekunde“ ist zum Staunen, aber kein Verstehen.
- **Problem bei A:** Auch Autos haben Pedale (Gas, Bremse). „Wie beim Treten in die Pedale“ steht mitten in einem Auto-Text. Ein Kind kann es darum als „der Fahrer tritt aufs Gaspedal, und die Räder drehen sich“ lesen, dann ist der Vergleich weg. „Fahrradpedale“ geht nicht, weil das Wort einen anderen Titel enthält.
- **Vorschlag:** „Das Auto hat oft einen Motor, in dem Benzin verbrennt. Heißes Gas drückt darin einen Stempel nach unten. Wie beim Radfahren wird aus dem Drücken eine Drehung der Räder.“ (168 Zeichen; 10/8/11 Wörter; 0 Zahlen; Zählskript „ok“). „Aus dem Drücken eine Drehung“ nennt dazu den Kern des Vergleichs ausdrücklich. Ob „Stempel“ für Kolben trägt, entscheidet die `kinder-redaktion`.
- **Zur Frage „Pedale“ und Fahrrad: unbedenklich.**
  - Beim Auto ist das Fahrrad als Falle ausgeschlossen (`ausschluss.technology`).
  - Bei der Fahrrad-Frage („Wie erreicht die Kraft deiner Beine das Hinterrad?“) ist „Das Auto“ auf Profi eine der fünf Fallen. Die Lösung liegt dort schon durch „Kraft deiner Beine“ offen, denn keine Falle wird mit Muskelkraft betrieben. Der Auto-Text verrät also nichts zusätzlich.
  - Er macht das Auto höchstens zu einer etwas stärkeren Falle, und sie bleibt eindeutig falsch. Für Profi ist das eher gut.
- **„Früher oder heute?“:** Die Heute-Aufgabe („Verbrennungsmotor, Elektromotor oder beiden“) wird gestützt, nicht verraten. Das „oft“ lässt Platz für Elektroautos. Die Früher-Aufgabe (Benz-Motorwagen) wird nicht berührt.

**Smartphone: A**
- A antwortet auf „unterwegs“ in der Aufgabe. Das ist genau der Unterschied zum alten Telefon mit Leitung, das auf Entdecker eine feste Falle ist.
- Der Wechsel zwischen den Masten ist auch für 10- bis 12-Jährige meist neu.
- B (Handschuh) ist ein starker Versuch für zu Hause. B hängt aber nicht an der Aufgabe, und „Informationen bearbeiten“ trifft es nur lose.
- **Andere Aufgaben:**
  - Das Smartphone ist bei der Telefon-Frage („Stimme … nur in der Nähe hörbar“) nie Falle, weder auf Entdecker noch auf Profi. Der Satz zur Stimme kann dort also nicht in die Irre führen.
  - Bei der Internet-Frage ist das Smartphone ausgeschlossen.
  - In „Früher oder heute?“ stützt A die Heute-Aufgaben zum Telefon („Kabel, Funk und Datennetze“) und zum Smartphone. Das geschieht ohne Zeitstempel. Nach meiner Regel aus der ersten Prüfung ist das erwünschtes Weiterlernen.
- **Optional (Sprache, `kinder-redaktion`):** „Gehst du weg“ statt „Gehst du weiter, übernimmt ein anderer Mast.“ (178 Zeichen; 11/10/7). „Weg“ klingt nach „vom Gerät weg“.

**Kamera: A, Satz 3 einfacher**
- A beantwortet die Forscherfrage für die Kameras, die Kinder kennen, auch die im Handy. Satz 3 schließt eine Lücke zur Karte: Dort steht „noch kein Foto, denn es wird nicht gespeichert“. Kinder verbinden so zwei Tatsachen.
- B trifft „Licht verändert Stoffe“ am direktesten, und das Plakat ist für Sechsjährige anschaulich. B steht aber genau auf 180 Zeichen, der Vergleich ist chemisch schief (⚠ im Entwurf), und B gilt vor allem für Film.
- **Problem bei A:** „Gespeichert ergeben alle Werte das Foto“ ist für Entdecker zu abstrakt („Werte“).
- **Vorschlag:** „Die Kamera lenkt Licht mit einer Linse auf Millionen winziger Felder. Jedes Feld macht aus Licht etwas Strom: viel Licht, viel Strom. Das wird gespeichert, so bleibt das Bild.“ (175 Zeichen; 11/11/7 Wörter; Zählskript „ok“). „So bleibt das Bild“ beantwortet „hinterlassen“ direkt.
  - Das Skript misst zum Kartensatz eine Überlappung von 0,67. Das liegt am kurzen Satz, und inhaltlich ist es die Gegenaussage („nicht gespeichert“). Ein fast wörtlicher Satz ist es nicht.
- **Andere Aufgaben:**
  - Die Kamera ist auf Profi Falle bei Mikroskop, Generator und Batterie. Durch „Linse“ und „aus Licht Strom“ wird sie dort etwas verlockender. Eindeutig falsch bleibt sie trotzdem: „klein“, „Drehbewegung“ und „Taschenlampe“ entscheiden.
  - Bei der Fernrohr-Frage ist die Kamera keine Falle.
  - In „Früher oder heute?“ kommt die Kamera nicht vor.

**Tipp: T-A, ein Wort geändert**
- **Vorschlag:** „Welches Wort in der Aufgabe ist das wichtigste? Überlege bei jeder Erfindung: Was macht sie genau?“ (98 Zeichen; 8/8). Begründung:
  - **„Aufgabe“ statt „Frage“:** Bei 12 Karten ist der Text ein Problem, keine Frage. Liest ein Kind „Frage“ wörtlich, findet es nur „Welche Erfindung hilft bei diesem Problem?“ mit dem wichtigsten Wort „Problem“. Das Spiel nennt die Schritte schon „Nächste Aufgabe“.
  - **Passt zu allen drei Arten:**
    - Problem: „Sonnenuntergang, sehen“ führt zu Licht.
    - Forscherfrage: „Hinterrad“ führt zum Fahrrad, „klein“ zum Mikroskop. Das hilft gerade bei der schweren Mikroskop-Frage.
    - Beschreibung: „weit entfernt“ führt zum Fernrohr.
  - **Entdecker:** Die Suche nach dem Schlüsselwort ist eine echte Hilfe beim Denken. Beim Vorlesen klappt sie mit Eltern gut. Eine Sechsjährige findet allein aber nicht immer das richtige Wort.
  - **Profi:** Der Tipp gibt eine Vorgehensweise, keine Lösung. Weil er erst auf Wunsch kommt, ist er nicht zu leicht.
- **T-B scheidet aus.** „Welche schafft genau das, was in der Frage steht?“ dreht bei vielen Problem-Texten die Logik um. Die Erfindung schafft dort nicht, was im Text steht, sie beendet es: „Ein Buch abzuschreiben dauerte lange“, „Große Rechnungen … kosteten viel Zeit“, „Stimme nur in der Nähe hörbar“.
- **T-C** ist am anschaulichsten („Wozu ist dieses Ding da?“). Ihm fehlt aber das Schlüsselwort, und nach einer falschen Wahl ist „dieses Ding“ zweideutig.

**Satz nach einer falschen Antwort: bauen, aber mit anderem Wortlaut**
- Hinter „Du hast „Das Telefon“ gewählt.“ schadet T-A sogar. Das Kind hat wegen „telefonieren“ gewählt, und „Welches Wort ist das wichtigste?“ bestätigt genau dieses Wort. Gebraucht wird ein Satz, der prüft, ob die gewählte Erfindung zu allen Teilen der Aufgabe passt, so wie `PERSONEN_FALSCH_PROFI`.
- **Vorschlag, für alle Stufen gleich:** „Du hast „X“ gewählt. Wozu ist diese Erfindung da? Passt das zu allem in der Aufgabe?“ (63 Zeichen ohne Anfang; 5/7).
  - „Zu allem“ trennt den schwersten Fall, Telefon und Smartphone („und gleichzeitig Informationen bearbeiten“).
  - „In der Aufgabe“ statt „was gefragt ist“, aus demselben Grund wie oben.
  - Der Satz beschämt nicht.

## 3. Befunde (kurz)

- `TECHNIK_AUFLOESUNG['invention-car']`, Fassung A: Das Wort „Pedale“ ist im Auto-Text doppeldeutig (Gaspedal). Vorschlag siehe oben („Wie beim Radfahren wird aus dem Drücken eine Drehung der Räder.“).
- `TECHNIK_AUFLOESUNG['invention-camera']`, Fassung A, Satz 3: „Werte“ ist für Entdecker zu abstrakt. Vorschlag: „Das wird gespeichert, so bleibt das Bild.“
- `hints.technology` (T-A): „in der Frage“ passt nicht zu den 12 Problem-Texten. Vorschlag: „in der Aufgabe“.
- `worldGameWrongFeedback`, Technik: Der doppelte Tipp-Satz lenkt nach einer Wahl wegen eines Signalworts zurück auf dieses Wort. Vorschlag: der eigene Satz oben.

## 4. Lücken

- **Profi ist im Technik-Detektiv kaum schwerer als Entdecker.** Die Profi-Fallen sind die fünf zeitlich nächsten Erfindungen und fast immer nach ihrem Zweck klar verschieden. Beispiel Fahrrad: Auto, Licht, Telefon, Flugzeug und Kühlschrank werden nicht mit Muskelkraft betrieben. Der Tipp „Was macht sie genau?“ reicht dort fast immer. Besser wären Fallen mit ähnlicher Aufgabe statt ähnlicher Zeit, zum Beispiel beim Fahrrad die Nähmaschine (früher mit Fußantrieb). Das gehört nicht in diesen PR; es ist ein Kandidat fürs BACKLOG und muss mit dem `fakten-pruefer` abgestimmt werden.
- **Keine Experten-Aufgaben** (wie schon gemeldet). Die neuen Auflösungen liefern Material für Aufgaben aus S5:
  - „Übertragen“: „Welche Erfindung macht aus einem Drücken nach unten eine Drehung, wie beim Radfahren?“ mit Auto, Fahrrad und Nähmaschine als ähnlichen Antworten.
  - „Fehler finden“: „Ein Handschuh aus Wolle funktioniert auf dem Bildschirm genauso gut wie der Finger. Stimmt das?“

## 5. Unsicher

- Ob „Radfahren“ den Vergleich für Fünf- bis Siebenjährige wirklich klarer macht als „Pedale“, und ob „Stempel“ oder „Mast“ verstanden werden, kann nur die Rückmeldung echter Kinder klären. Bei der Sprache entscheidet zuerst die `kinder-redaktion`.
- Ob Kinder den Tipp vor der Antwort überhaupt öffnen und ob die Suche nach dem Schlüsselwort ohne Eltern trägt, weiß ich nicht.
- Die neuen Sachaussagen in meinen Fassungen braucht der `fakten-pruefer`. Neu ist nur die Kurbel als Vergleich mit dem Radfahren; „gespeichert, so bleibt das Bild“ steht inhaltlich schon im Entwurf.
- Die Fallen habe ich aus dem Code nachgerechnet (feste Entdecker-Fallen, fünf zeitlich nächste auf Profi, Ausschlussliste). Echte Runden habe ich nicht im Browser gespielt.
