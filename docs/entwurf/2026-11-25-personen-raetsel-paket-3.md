# Personen-Rätsel „Wer ist das?“, Paket 3 von 3 (Entwurf, ungeprüft)

Helfer: `karten-autor` (opus/high), 25.11.2026. Entwurf; prüfen danach `fakten-pruefer`, `kinder-redaktion`, `stufen-pruefer`.

Ich habe keine Dateien geändert. Die Rätsel sind ungeprüft: `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer` müssen noch darüberschauen.

**Nachgezählt mit einem Skript, das die Regeln aus `tests/world-game-learning-copy.test.mjs` Zeile 67 bis 70 nachbaut:**
- Alle 9 Rätsel haben genau 2 Sätze.
- Kein Rätsel enthält einen Namensteil, auch nicht mitten im Wort. Ich habe Wörter wie „erschien“ (enthält „chien“) und „Libelle“ (enthält „bell“) gemieden.
- Kein Rätsel enthält eines der verbotenen Fürwörter. Das gilt auch für das Mehrzahl-„sie“, das der Test genauso ablehnt.
- Es gibt auch keine Berufswörter, die das Geschlecht verraten (Forscherin, Gelehrter, Doktorandin, „erste Frau“).

Satz 1 enthält keinen Punkt, kein Fragezeichen und keine Abkürzung. Du kannst ihn also für den Entdecker-Hinweis am ersten „. “ abtrennen.

**Welche falschen Antworten das Spiel zeigt:** Ich habe sie mit der Logik aus `app/world-game-bank.ts` und `app/people-game-baseline.json` ermittelt. Sie stehen unten bei jeder Person.

---

### person-henrietta_swan_leavitt
- **Satz 1:** Diese Person verglich Fotos vom Sternenhimmel auf Glasplatten.
- **Satz 2:** Bei manchen Sternen wird das Licht in einem festen Takt heller und schwächer; dieser Takt hilft, Entfernungen im Weltall zu messen.
- **Fundstelle:** Einleitung („verglich Sternaufnahmen auf Glasplatten … Das hilft, Entfernungen im Weltall zu bestimmen“), Absatz 1 („fotografische Glasplatten des Himmels“), Absatz 2 („schwankt die Helligkeit regelmäßig“).
- ⚠ für den `fakten-pruefer`: Satz 2 lässt die Leuchtkraft als Zwischenschritt weg. Der Takt hängt mit der Leuchtkraft zusammen, erst daraus folgt die Entfernung. „Hilft“ entspricht dem „Das hilft“ der Einleitung.
- **Verwechslung:** Payne-Gaposchkin (Sternlicht) und Bell Burnell (regelmäßige Signale). Glasplatten mit Fotos gibt es nur auf dieser Karte. Satz 2 nennt Helligkeit und Entfernung, nicht woraus Sterne bestehen und keine Radiosignale. Falsche Antworten im Spiel: Karl Benz, al-Chwarizmi.

### person-cecilia_payne_gaposchkin
- **Satz 1:** Diese Person untersuchte das Licht der Sterne, um herauszufinden, woraus Sterne bestehen.
- **Satz 2:** In einer großen Forschungsarbeit von 1925 erklärte diese Person: Sterne bestehen vor allem aus Wasserstoff und Helium.
- **Fundstelle:** Einleitung, Absatz 1 („Woraus bestehen Sterne … untersuchte ihr Licht“), Absatz 2. „Große Forschungsarbeit“ steht für „Doktorarbeit“, damit kein Fachwort nötig ist.
- ⚠ Laut Absatz 2 wurde das Ergebnis damals „zunächst sehr vorsichtig dargestellt“. Bitte prüfen, ob „erklärte“ (so steht es in der Einleitung) reicht.
- **Verwechslung:** Leavitt (Sternfotos, Takt) und Ibn al-Haytham oder Einstein (Licht). Die Frage „woraus Sterne bestehen“ und das Wort Wasserstoff stehen nur auf dieser Karte. Falsche Antworten im Spiel: Bertha Benz, Tu Youyou.

### person-rosalind_franklin
- **Satz 1:** Diese Person untersuchte mit Röntgenstrahlen, wie Stoffe aufgebaut sind.
- **Satz 2:** Mit Raymond Gosling entstand 1952 eine berühmte Aufnahme von DNA, dem Bauplan in Zellen; das Muster wies auf eine Schraubenform hin.
- **Fundstelle:** Einleitung (fast wörtlich), Absatz 2 („1952 … Photo 51 … wichtiger Beleg für eine schraubenförmige Struktur“). Gosling ist genannt, weil die Karte die Aufnahme als gemeinsame Arbeit beschreibt.
- ⚠ „dem Bauplan in Zellen“ steht nicht auf der Karte. Es ist die Erklärung für das Fachwort DNA. Quelle: NHGRI, „Deoxyribonucleic Acid (DNA) Fact Sheet“, https://www.genome.gov/about-genomics/fact-sheets/Deoxyribonucleic-Acid-Fact-Sheet. Prüfen, ob „Bauplan“ als Bild für Kinder fachlich genau genug ist.
- **Verwechslung:** Marie Curie (Strahlung) und Inge Lehmann (Muster in Aufzeichnungen). Röntgen und DNA kommen nur auf dieser Karte vor. Falsche Antworten im Spiel: Jane Goodall, Cai Lun.

### person-jocelyn_bell_burnell
- **Satz 1:** Diese Person fand auf langen Papierstreifen sehr regelmäßige Signale aus dem Weltall.
- **Satz 2:** Diese Person half in Cambridge, das Radioteleskop dafür zu bauen: eine große Anlage aus Antennen auf einem Feld.
- **Fundstelle:** Absatz 1 („In langen Papieraufzeichnungen … Radiosignale kehrten sehr regelmäßig wieder … in Cambridge am Aufbau und Betrieb eines Radioteleskops“), Absatz 2 (Pulsare, Neutronensterne, also aus dem All).
- ⚠ „große Anlage aus Antennen auf einem Feld“ und „Papierstreifen“ stehen nicht auf der Karte. Dort steht nur „Radioteleskop“ und „Papieraufzeichnungen“.
  - Quelle: University of Cambridge, „Journeys of Discovery: Pulsars“, https://www.cam.ac.uk/stories/journeysofdiscovery-pulsars. Dort steht: half zwei Jahre lang, die Antennen auf einem Feld zu verlöten und einzuschlagen.
  - Dazu: Science Museum Group, Teile des Cambridge Interplanetary Scintillation Array (etwa 4 bis 4,5 Acres groß), https://collection.sciencemuseumgroup.org.uk/objects/co8105496.
- ⚠ „aus dem Weltall“: Laut Absatz 3 verrät Regelmäßigkeit allein die Herkunft noch nicht. Das Ergebnis (Pulsare) ist aber gesichert.
- **Verwechslung:**
  - Leavitt (auch ein Rhythmus): Hier geht es um Signale auf Papier und ein Radioteleskop, nicht um Fotos von Sternen.
  - Inge Lehmann (Aufzeichnungen von Erdbeben): Hier kommen die Signale aus dem Weltall.
  - Mae Jemison (Weltall): Sie flog ins All, hier werden keine Signale gemessen.
  - Falsche Antworten im Spiel: Albert Einstein, Mae Jemison.

### person-octavia_butler
- **Satz 1:** Diese Person schrieb Geschichten über erfundene Welten und die Zukunft.
- **Satz 2:** Solche Geschichten heißen Science-Fiction, und diese Person stellte damit Fragen an unsere Gegenwart.
- **Fundstelle:** Einleitung („schrieb Science-Fiction. Mit erfundenen Welten stellte sie Fragen an die Gegenwart“), Absatz 1 („Zukunftsgeschichte“), „Schon gewusst?“.
- **Verwechslung:** Murasaki Shikibu (Erzählung vom Prinzen Genji), Tagore (Gedichte und Geschichten), Rachel Carson (Sachbuch). Erfundene Welten, Zukunft und Science-Fiction gibt es nur hier. Falsche Antworten im Spiel: Mae Jemison, Alexander von Humboldt.

### person-chien_shiung_wu
- **Satz 1:** Diese Person prüfte mit einem genauen Versuch, ob Vorgänge im Spiegelbild gleich ablaufen.
- **Satz 2:** 1956 zeigte diese Person mit einem Team: Beim Betazerfall, einem Zerfall von Atomkernen, gilt diese Spiegel-Regel nicht.
- **Fundstelle:** Einleitung („sehr genaue Experimente … mit einem Forschungsteam … Spiegelung physikalischer Vorgänge … Betazerfall“), Absatz 2 („1956 … Für diesen Vorgang gilt die zuvor angenommene Spiegelsymmetrie nicht“), Absatz 1 („radioaktiven Zerfällen“).
- **Hinweis:** Absatz 2 sagt genauer, die Spiegelsymmetrie gilt „für diesen Vorgang“ nicht, also für den Betazerfall von Cobalt-60. Das Rätsel nennt nur den Betazerfall allgemein. Fachlich stimmt das, aber bitte trotzdem prüfen.
- **Verwechslung:** Meitner und Curie (auch Atomkerne). Spiegelbild und Betazerfall stehen nur auf dieser Karte. Falsche Antworten im Spiel: Wangari Maathai, Mary Anning.

### person-lise_meitner
- **Satz 1:** Diese Person erklärte, wie sich der Kern eines Atoms in zwei kleinere Kerne teilen kann.
- **Satz 2:** Das gelang Anfang 1939 mit Otto Frisch, kurz nachdem diese Person aus Deutschland fliehen musste.
- **Fundstelle:** Absatz 2 („lieferten Anfang 1939 die physikalische Erklärung: Ein schwerer Atomkern kann sich in zwei kleinere Kerne teilen“), Absatz 1 („1938 musste sie … fliehen“).
- **Verwechslung:**
  - Einstein: Er hat auch in Berlin gearbeitet und ist 1933 in die USA ausgewandert. Darum steht die Flucht nur in Satz 2 und nicht als einziger Hinweis.
  - Curie und Wu (Atomkerne): Dass sich ein Kern teilt, steht nur auf dieser Karte.
  - Falsche Antworten im Spiel: Charles Darwin, Ibn al-Haytham.

### person-zaha_hadid
- **Satz 1:** Diese Person entwarf Gebäude mit ganz ungewöhnlichen Formen.
- **Satz 2:** Nach einem Entwurf dieser Person entstand zum Beispiel 1993 ein Feuerwehrhaus in Weil am Rhein.
- **Fundstelle:** Einleitung („entwarf Gebäude und Räume mit ungewöhnlichen Geometrien“), Absatz 1 und „Schon gewusst?“ („Vitra-Feuerwehrhaus in Weil am Rhein von 1993“).
- **Bewusst weggelassen:**
  - Bagdad: Das würde an das Rätsel von al-Chwarizmi erinnern.
  - Der Pritzker-Preis „als erste Frau“: Das verrät das Geschlecht.
- **Verwechslung:** Keine andere Person auf den Karten plant Gebäude. Hokusai entwarf Bilder, keine Gebäude. Falsche Antworten im Spiel: Alexander von Humboldt, Marie Curie.

### person-ibn_sina
- **Satz 1:** Diese Person schrieb vor rund 1000 Jahren ein großes Buch über Medizin.
- **Satz 2:** Das Buch heißt „Kanon der Medizin“ und wurde über Jahrhunderte übersetzt und abgeschrieben.
- **Fundstelle:**
  - Lebenszeit 980 bis 1037, das ist rund 1000 Jahre her.
  - Einleitung („Sein Kanon der Medizin wurde übersetzt und über Jahrhunderte abgeschrieben“).
  - Absatz 1 („fasste medizinisches Wissen seiner Zeit zusammen“).
- Den lateinischen Namen Avicenna habe ich bewusst weggelassen, er ist ein Name.
- **Verwechslung:**
  - Tu Youyou und Mae Jemison (auch Medizin): Beide leben heute, nicht vor 1000 Jahren.
  - Murasaki und al-Chwarizmi (auch rund 1000 Jahre her, auch Schriften): Bei ihnen geht es nicht um Medizin.
  - Falsche Antworten im Spiel: Mary Anning, Grace Hopper.

---

### Alles als JSON

```json
{
 "person-henrietta_swan_leavitt": "Diese Person verglich Fotos vom Sternenhimmel auf Glasplatten. Bei manchen Sternen wird das Licht in einem festen Takt heller und schwächer; dieser Takt hilft, Entfernungen im Weltall zu messen.",
 "person-cecilia_payne_gaposchkin": "Diese Person untersuchte das Licht der Sterne, um herauszufinden, woraus Sterne bestehen. In einer großen Forschungsarbeit von 1925 erklärte diese Person: Sterne bestehen vor allem aus Wasserstoff und Helium.",
 "person-rosalind_franklin": "Diese Person untersuchte mit Röntgenstrahlen, wie Stoffe aufgebaut sind. Mit Raymond Gosling entstand 1952 eine berühmte Aufnahme von DNA, dem Bauplan in Zellen; das Muster wies auf eine Schraubenform hin.",
 "person-jocelyn_bell_burnell": "Diese Person fand auf langen Papierstreifen sehr regelmäßige Signale aus dem Weltall. Diese Person half in Cambridge, das Radioteleskop dafür zu bauen: eine große Anlage aus Antennen auf einem Feld.",
 "person-octavia_butler": "Diese Person schrieb Geschichten über erfundene Welten und die Zukunft. Solche Geschichten heißen Science-Fiction, und diese Person stellte damit Fragen an unsere Gegenwart.",
 "person-chien_shiung_wu": "Diese Person prüfte mit einem genauen Versuch, ob Vorgänge im Spiegelbild gleich ablaufen. 1956 zeigte diese Person mit einem Team: Beim Betazerfall, einem Zerfall von Atomkernen, gilt diese Spiegel-Regel nicht.",
 "person-lise_meitner": "Diese Person erklärte, wie sich der Kern eines Atoms in zwei kleinere Kerne teilen kann. Das gelang Anfang 1939 mit Otto Frisch, kurz nachdem diese Person aus Deutschland fliehen musste.",
 "person-zaha_hadid": "Diese Person entwarf Gebäude mit ganz ungewöhnlichen Formen. Nach einem Entwurf dieser Person entstand zum Beispiel 1993 ein Feuerwehrhaus in Weil am Rhein.",
 "person-ibn_sina": "Diese Person schrieb vor rund 1000 Jahren ein großes Buch über Medizin. Das Buch heißt „Kanon der Medizin“ und wurde über Jahrhunderte übersetzt und abgeschrieben."
}
```

### Umformuliert
Keine. Es sind neue Einträge, gespeicherte Antworten ändern sich nicht. Die Antworten im Spiel bleiben die Namen der Personen.

### Zahlen
- **Wörter in Satz 1 / Satz 2:**
  - Leavitt 8 / 21
  - Payne-Gaposchkin 12 / 17
  - Franklin 9 / 21
  - Bell Burnell 12 / 18
  - Butler 10 / 13
  - Wu 13 / 17
  - Meitner 15 / 15
  - Hadid 8 / 15
  - Ibn Sina 12 / 13
- Satz 2 liegt oft über 12 Wörtern, weil genau zwei Sätze vorgegeben sind. Die Rätsel von Darwin und Mandela sind ähnlich lang.
- „Längste oder kürzeste Antwort“ zähle ich hier nicht: Ich schreibe keine Antworten, das Spiel zeigt nur Namen.

### Offen
1. **Suchwörter der Karten im Rätsel:** Bei Butler steht „Science-Fiction“, bei Meitner „Otto Frisch“, bei Ibn Sina „Kanon der Medizin“. Das sind keine Namen der Person, und der Test prüft das nicht. Das Mandela-Rätsel macht es mit „Apartheid“ schon so. Otto Frisch ist eine andere Person, wie Buzz Aldrin bei Armstrong.
2. **Satz 1 bei Meitner** hat ein Fachwort (Kern eines Atoms) und 15 Wörter. Die Karte bietet nichts Anschaulicheres, das nur zu dieser Person passt. Die Alternative „Diese Person arbeitete viele Jahre in Berlin und musste 1938 aus Deutschland fliehen“ wäre für Kleine leichter. Sie lässt aber an Einstein denken (Berlin, Auswanderung) und verrät nicht, warum die Person wichtig ist. Das sollte der `stufen-pruefer` entscheiden.
3. **Satz 1 bei Wu** braucht etwas Denkarbeit („Vorgänge im Spiegelbild“). Bitte prüfen, ob das für 5 bis 8 Jahre klappt.
4. **„Kanon“** kennen Kinder als Lied. Bitte von der `kinder-redaktion` prüfen lassen. Ich habe keine Erklärung erfunden, weil die Karte keine hat.
5. **Satz 1 als Hinweis für Entdecker:** Wie der Hinweis im Spiel je Stufe gekürzt wird, ist nicht meine Entscheidung. Die Rätsel lassen sich am ersten „. “ trennen, Satz 1 hat keine Abkürzung.

Dateien, die ich gelesen habe:
- /home/user/wunderkompass/app/world-game-support.mjs
- /home/user/wunderkompass/app/world-game-bank.ts
- /home/user/wunderkompass/app/people-game-baseline.json
- /home/user/wunderkompass/app/world-catalog.json
- /home/user/wunderkompass/tests/world-game-learning-copy.test.mjs

Mein Prüfskript liegt unter /tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/r.mjs (ein Notizordner, der verschwinden kann).

Sources:
- [University of Cambridge: Journeys of Discovery – Pulsars](https://www.cam.ac.uk/stories/journeysofdiscovery-pulsars)
- [Science Museum Group: Parts from the Cambridge Interplanetary Scintillation Array](https://collection.sciencemuseumgroup.org.uk/objects/co8105496)
- [NHGRI: Deoxyribonucleic Acid (DNA) Fact Sheet](https://www.genome.gov/about-genomics/fact-sheets/Deoxyribonucleic-Acid-Fact-Sheet)
