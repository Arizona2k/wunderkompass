# Bildtexte für 40 Bilder: Entwurf vom `karten-autor` (24.11.2026)

Auftrag: Alt-Texte, Bildunterschriften und Kennwörter für die 24 Tiere (Paket 1), die 14 Bilder aus Paket 2 und die zwei Wal-Ersatzfotos. Der Entwurf ist **noch nicht geprüft**; danach prüfen `kinder-redaktion` und `fakten-pruefer` unabhängig.

Die Texte stehen maschinenlesbar in [`docs/bilder/texte-2026-11-24.json`](../bilder/texte-2026-11-24.json) (maßgebliche Fassung aus dem Bericht). Unten der übrige Bericht, wörtlich.

---

Alle 40 Bilder haben einen Entwurf: 24 aus Paket 1, 14 aus Paket 2 und die zwei Wal-Ersatzfotos. Ich habe keine Dateien geändert. Geprüft ist noch nichts, das machen danach `kinder-redaktion` und `fakten-pruefer`.

Ich habe mir alle 40 Bilder als Vorschau (480 px) selbst angesehen. Die Commons-Beschreibungen der heiklen Bilder habe ich über die API gelesen. Dadurch haben sich einige Vorschläge der Bild-Recherche geändert (siehe Auffälligkeiten). Die Vorschaubilder liegen nur im Arbeitsordner und nicht im Repository.

Jeder `alt_de` ist **ein Satz** mit 9 bis 20 Wörtern, wie im Auftrag verlangt; nachgezählt mit `node`. Ein Satz mit bis zu 20 Wörtern ist länger als die Kinder-Regel „meist unter 12 Wörtern“. Alt-Texte hört man aber über den Bildschirmleser, sie stehen nicht sichtbar auf der Karte. Will `kinder-redaktion` lieber zwei kurze Sätze, lässt sich jeder Alt-Text am Komma teilen. Die Bildunterschriften (`caption`) haben 2 bis 3 kurze Sätze mit höchstens 16 Wörtern je Satz.

### „Was ist neu?“ (zwei Fassungen)

Beide halten die Testgrenzen ein: Titel höchstens 40 Zeichen, Text höchstens 160 Zeichen, höchstens zwei Sätze, kein Wort „Nachrichten“. Nachgezählt mit `node`. Vorschlag: `id: 'echte-fotos'`, `symbol: 'lupe'`, Datum = Tag des Einbaus.

- **A:** Titel „Echte Fotos statt Zeichnungen“ (29 Zeichen). Text: „Viele Tierkarten zeigen jetzt echte Fotos, zum Beispiel Schnabeltier, Okapi und Seepferdchen. Auf Karten über Menschen siehst du alte Gemälde und Fotos.“ (152 Zeichen)
- **B:** Titel „Tiere und Menschen in echt“ (26 Zeichen). Text: „Neu sind echte Fotos von Schnabeltier, Okapi, Seepferdchen und vielen anderen Tieren. Bei Bildern von Menschen steht, ob sie erst viel später gemalt wurden.“ (156 Zeichen)

Ich empfehle **B**. A sagt nicht, dass manche Bilder erst viel später entstanden sind (Murasaki Shikibu, Ibn al-Haytham), und wirkt deshalb, als zeigten alle Bilder, wie die Menschen aussahen. Beide Fassungen stimmen erst, wenn die Bilder eingebaut sind.

### Auffälligkeiten

1. **Inge Lehmann:** Der Vorschlag sagte „junge Frau“. Auf dem Foto von 1932 ist sie 43 oder 44, darum habe ich das korrigiert.
2. **Feuer:** Die Bild-Recherche schreibt „Mittelsteinzeit-Neolithikum“. Laut Commons heißt es „Néolithique moyen“, also mittlere Jungsteinzeit. Ich nenne keine Jahreszahl. Die caption grenzt das Feuerzeug von den Feuerstellen der Karte ab (790.000 Jahre).
3. **Ibn al-Haytham:** Ich habe das Kennwort von „Historischer Druck“ auf „Spätere Darstellung“ geändert. Grund: Gutenbergs Kupferstich von 1584 trägt heute auch „Spätere Darstellung“. Für Kinder zählt, dass das Bild erfunden ist, nicht die Drucktechnik. Entscheidung bei Claude.
4. **Kennwort „Gemälde“:** neu für Anning und Merian. Es steht noch nicht in `app/kern/karte/foto-kennwoerter.json`.
5. **Namen wie auf der Karte:** „Ameisenigel“ heißt jetzt „Kurzschnabeligel“, „Gartenschnecke“ heißt jetzt „Gefleckte Weinbergschnecke“, wie in den Kartentiteln.
6. **Was man nicht sieht, ist gestrichen:** „Höhle“ beim Hummer, „schläft“ beim Hund von Anning, „Blatt mit geometrischer Zeichnung“ bei Ibn al-Haytham, „Messing“ beim Kompass, „gelbgrüne Flecken“ beim Chamäleon (sie sind dunkel), „Orange und Gelb“ beim Papageitaucher, „sitzt“ beim Biber.
7. **Clownfisch:** Ich schreibe nur „Fisch“, weil die Karte selbst vor vorschnellem Bestimmen warnt. Die Art ist nur von der iNaturalist-Gemeinschaft bestimmt. ⚠ fakten-pruefer.
8. **Wright Flyer:** Dass es der Flyer von 1903 ist, folgt nur aus Hinweisen. Eine vorsichtigere Fassung steht im JSON. ⚠
9. **Meitner und Mandela:** Bei Meitner nenne ich den Mann nicht, der sich zu ihr beugt. Ob es Sigvard Eklund ist, steht nicht sicher fest. Bei Mandela steht nicht „Präsident“, weil er es 1993 noch nicht war.
10. **Blauwal:** bekommt als einziges Tierfoto eine caption („von oben fotografiert“), weil man ihn so kaum erkennt. Die Datei ist nur 800×600 px groß.
11. **Personenfotos ohne caption:** Butler, Lehmann und Tagore haben nach Auftrag keine caption. Heute hat jedes Personenfoto eine. Fassungen für Einheitlichkeit stehen jeweils im `hinweis`.
12. **Nicht geprüft:** Die Bilder habe ich nur als Vorschau mit 480 px gesehen, nicht in voller Größe. Den LOC-Ausschnitt von Ibn al-Haytham habe ich nicht gesehen, nur den Commons-Ausschnitt.

**Zahlen:** 40 Bilder, alle `alt_de` je ein Satz mit 9 bis 20 Wörtern. 14 Bilder haben eine caption (Blauwal, 8 Personen, Feuer, Flugzeug, Kompass, Fahrrad; Mandela zusätzlich mit Fassung für den Zuschnitt). Die Prüfung auf Ratemuster entfällt, weil es keine Fragen gibt.

**Umformuliert:** keine. Gespeicherte Antworten sind nicht betroffen.
