# Personen-Rätsel „Wer ist das?“, Paket 2 von 3 (Entwurf, ungeprüft)

Helfer: `karten-autor` (opus/high), 25.11.2026. Entwurf; prüfen danach `fakten-pruefer`, `kinder-redaktion`, `stufen-pruefer`.

Es gibt neun Entwürfe, je zwei Sätze. Ich habe keine Datei geändert. Die Texte sind **nicht geprüft**. Prüfen sollen danach `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer`.

**Was ich nachgezählt habe:** Ich habe alle neun Rätsel mit `node` gegen die Regeln aus `tests/world-game-learning-copy.test.mjs` laufen lassen (Zeile 67 bis 70: Namensteile und Fürwort-Regex). Ergebnis: 9 von 9 ohne Fund. Das war nur eine Teilprüfung mit einem eigenen Skript im Scratchpad, nicht der echte Test.

**Fallen beim Schreiben:**
- Die Regex trifft auch „sie“ und „ihren“, wenn sie sich auf Dinge oder mehrere beziehen. Sie trifft auch „er“ für den Computer. Ich habe all diese Wörter weggelassen.
- Weil `\b` nur ASCII kennt, gilt das Wortende auch nach ß, ä, ö oder ü. Ein Wort wie „größer“ oder „außer“ würde darum anschlagen.
- Berufswörter wie „Forscherin“ oder „Künstler“ kommen nicht vor.

Im Spiel stehen heute je zwei andere Personen als Antworten zur Wahl. Ich habe sie mit `worldGameBank('people')` ermittelt und unten unter „Im Spiel daneben“ notiert.

---

### person-maria_sibylla_merian
- **Satz 1:** Diese Person beobachtete lange, wie aus Raupen Schmetterlinge werden, und zeichnete das.
- **Satz 2:** 1699 reiste diese Person mit einer Tochter nach Suriname in Südamerika.
- **Fundstelle:** Einleitung (Insekten über längere Zeit beobachtet, Zeichnungen), Absatz 1 (Raupe und Falter), Absatz 2 (1699 mit der Tochter nach Suriname in Südamerika).
- ⚠ leicht: Die Karte sagt „Insekten“ und „Falter“, Satz 1 sagt „Schmetterlinge“. Belegt bei der Universität Heidelberg, „Metamorphosis insectorum Surinamensium“: https://digi.ub.uni-heidelberg.de/diglit/merian1705
- **Verwechslung:** Jane Goodall (beobachtete Tiere, aber Schimpansen), Charles Darwin (Veränderung über Generationen, nicht vom Ei zum Falter), Alexander von Humboldt (auch Pflanzen und Amerika, aber 1799 und Pflanzen nach Höhe). Raupe, Schmetterling und Zeichnen gibt es nur bei dieser Person.
- **Im Spiel daneben:** Katherine Johnson, Jane Goodall.

### person-johannes_gutenberg
- **Satz 1:** Diese Person druckte in Mainz Bücher mit einzelnen Buchstaben aus Metall.
- **Satz 2:** Die beweglichen Buchstaben ließen sich danach für einen anderen Text neu ordnen.
- **Fundstelle:** Einleitung (Mainz, bewegliche Metallzeichen), `person.method` (Metallbuchstaben), Absatz 2 (für einen anderen Text Zeichen neu ordnen), „Mehr“ 1 (was „beweglich“ heißt).
- Hinweis: Ich schreibe „einzelne“ statt „kleine“ Buchstaben, weil „kleine Buchstaben“ wie Kleinbuchstaben klingt. Die Karte betont die Arbeit der Werkstatt. „Diese Person druckte“ vereinfacht das (siehe Offen).
- **Verwechslung:** Katsushika Hokusai (auch Drucke, aber Bilder von Holzblöcken), Cai Lun (Papier, nicht Druck). Durch „Buchstaben aus Metall“ ist es eindeutig.
- **Im Spiel daneben:** Alexander von Humboldt, Marie Curie.

### person-katsushika_hokusai
- **Satz 1:** Diese Person zeichnete die Vorlage für ein berühmtes Bild mit einer riesigen Welle.
- **Satz 2:** Das Bild zeigt auch den Berg Fuji und wurde mit Holzblöcken gedruckt.
- **Fundstelle:** Einleitung (entwarf Bilder, Holzschnitte, Große Welle), Absatz 1 (Welle vorne, Fuji dahinter), Absatz 2 (lieferte Bildentwürfe, andere schnitten die Holzblöcke und druckten).
- „Vorlage“ statt „entwarf“, damit es Kleine verstehen. „wurde gedruckt“ steht in der Leideform, passend zur Karte: Andere haben gedruckt.
- **Verwechslung:** Johannes Gutenberg (Druck, aber Buchstaben aus Metall), Zaha Hadid (Entwürfe, aber Gebäude), Rabindranath Tagore (Bilder aus Linien), Murasaki Shikibu (Japan, aber Erzählung). Ein Bild mit Welle hat nur diese Person.
- **Im Spiel daneben:** al-Chwarizmi, Johannes Gutenberg.

### person-alexander_humboldt
- **Satz 1:** Diese Person verglich, welche Pflanzen unten und welche hoch oben am Berg wachsen.
- **Satz 2:** Von 1799 bis 1804 reiste diese Person dafür mit Aimé Bonpland durch Teile Amerikas.
- **Fundstelle:** Einleitung (Pflanzen und Höhen verglichen), Absatz 2 (Wo wachsen welche Pflanzen? Naturgemälde der Anden mit Höhenzonen), Absatz 1 (1799 bis 1804 mit Bonpland durch Teile Amerikas).
- **Verwechslung:** Maria Sibylla Merian (Pflanzen und Südamerika, aber Insekten und 1699), Charles Darwin (Reise, aber mit der „Beagle“ und Veränderung über Generationen). Pflanzen nach Höhe am Berg sind eindeutig.
- **Im Spiel daneben:** Ibn al-Haytham, Katherine Johnson.

### person-grace_hopper
- **Satz 1:** Diese Person half, Computern Anweisungen in Wörtern zu geben.
- **Satz 2:** Mit einem Team entwickelte diese Person frühe Übersetzungsprogramme für solche Anweisungen.
- **Fundstelle:** Absatz 1 (mit dem Team frühe Übersetzungsprogramme und FLOW-MATIC, „das Wörter für Anweisungen nutzte“), Einleitung (Programmieren einfacher machen).
- Ich schreibe nicht „Compiler“, sondern das Wort von der Karte. „Übersetzungsprogramm“ erklärt sich selbst.
- **Verwechslung:**
  - Ada Lovelace: Schrittfolgen für eine *geplante* Rechenmaschine 1843, nicht Wörter als Anweisungen.
  - Tim Berners-Lee: Web und Links.
  - Katherine Johnson: Rechnen von Flugbahnen.
  - Al-Chwarizmi: Rechenbücher.

  „Anweisungen in Wörtern“ und „Übersetzungsprogramme“ passen nur zu dieser Person.
- **Im Spiel daneben:** Karl Benz, al-Chwarizmi.

### person-katherine_johnson
- **Satz 1:** Diese Person rechnete aus, auf welchem Weg Raumschiffe durch den Weltraum fliegen.
- **Satz 2:** 1962 prüfte diese Person Computer-Rechnungen für John Glenns Flug um die Erde.
- **Fundstelle:** Einleitung (Flugbahnen für die Raumfahrt), Erklärung der Hauptfrage (Flugbahn = Weg eines Raumschiffs), Absatz 2 (1962 vor Glenns Erdumrundung elektronische Ergebnisse nachgeprüft).
- ⚠ leicht: Die Karte sagt „elektronische Ergebnisse“, der Satz sagt „Computer-Rechnungen“. Belegt bei der NASA, „Katherine Johnson Biography“: https://www.nasa.gov/people/katherine-johnson-biography/
- **Verwechslung:** Neil Armstrong und Mae Jemison (flogen selbst, rechneten nicht), Grace Hopper und Ada Lovelace (Programme, keine Flugbahnen). Weg von Raumschiffen ausrechnen und Glenn sind eindeutig.
- **Im Spiel daneben:** Bertha Benz, Tu Youyou.

### person-tim_berners_lee
- **Satz 1:** Diese Person entwickelte das Web: Seiten, die durch Links miteinander verbunden sind.
- **Satz 2:** Ende 1990 lief am Forschungszentrum CERN der erste Browser, der solche Seiten anzeigt.
- **Fundstelle:** Einleitung und Absatz 3 (entwickelte das Web), Absatz 2 und „Mehr“ 1 (Link verbindet Seiten, Browser zeigt die gewählte Seite), Absatz 1 (Ende 1990 liefen dort Webserver und Webbrowser).
- CERN steht erst in Satz 2 (Spieltest D) und wird dort als „Forschungszentrum“ erklärt.
- ⚠ Auf der Karte steht „sein erster Webbrowser“, im Satz „der erste Browser“. CERN, „A short history of the Web“, schreibt: „By the end of 1990, Tim Berners-Lee had the first Web server and browser up and running at CERN“. https://home.cern/science/computing/birth-web/short-history-web
- **Verwechslung:** Grace Hopper (Programmieren), Ada Lovelace (Rechenmaschine). Web und Links gibt es nur hier. Das Rätsel sagt bewusst nicht „Internet“: Die Karte unterscheidet Web und Internet.
- **Im Spiel daneben:** Jane Goodall, Cai Lun.

### person-mary_anning
- **Satz 1:** Diese Person fand an der Küste versteinerte Reste von Tieren aus uralter Zeit.
- **Satz 2:** Bei Lyme Regis legte diese Person solche Fossilien frei, etwa Teile eines ausgestorbenen Meeresreptils.
- **Fundstelle:** Einleitung (Fossilien an der Küste bei Lyme Regis), „Ganz einfach“ (versteinerte Spuren früherer Tiere), `person.method` (freilegen), Absatz 2 (weitere Teile dieses Meerestiers), „Mehr“ 1 (Ichthyosaurier = ausgestorbenes Meeresreptil).
- ⚠ leicht: Die Karte verbindet „Meerestier“ und „Ichthyosaurier“ nur mittelbar. Belegt beim Natural History Museum, „Mary Anning: the unsung hero of fossil discovery“: https://www.nhm.ac.uk/discover/mary-anning-unsung-hero.html
- **Verwechslung:** Charles Darwin verglich auch Fossilien. Das Rätsel nennt aber Finden an der Küste und Lyme Regis, Darwin bekannt für die „Beagle“. Eindeutig.
- **Im Spiel daneben:** Ada Lovelace, Karl Benz.

### person-ibn_al_haytham
- **Satz 1:** Diese Person erforschte vor etwa tausend Jahren, wie Licht und unser Sehen funktionieren.
- **Satz 2:** In Kairo prüfte diese Person Ideen über das Licht mit gezielten Versuchen und Mathematik.
- **Fundstelle:** Einleitung (Licht und Sehen mit Versuchen und Mathematik), Absatz 1 (vor etwa tausend Jahren, arbeitete unter anderem in Kairo, gezielte Untersuchungen).
- ⚠ leicht: Die Karte sagt „arbeitete unter anderem in Kairo“. Dass die Lichtforschung dort stattfand, ist eine Verknüpfung. Britannica, „Ibn al-Haytham“: https://www.britannica.com/biography/Ibn-al-Haytham
- **Verwechslung:**
  - Albert Einstein: Das Vorbild-Rätsel beginnt mit „untersuchte Licht, Raum und Zeit“, das ist die größte Gefahr. Hier trennen „vor etwa tausend Jahren“ und „Sehen“.
  - Ibn Sina und Murasaki Shikibu: auch etwa 1000 Jahre her, aber Medizin bzw. eine Erzählung.
  - Cecilia Payne-Gaposchkin: Licht von Sternen, 20. Jahrhundert.
- **Im Spiel daneben:** Grace Hopper, Bertha Benz.

---

### Zahlen (Wörter je Satz, nachgezählt mit node)

| Person | Satz 1 | Satz 2 |
|---|---|---|
| Merian | 12 | 11 |
| Gutenberg | 11 | 12 |
| Hokusai | 13 | 12 |
| Humboldt | 13 | 14 |
| Hopper | 9 | 11 |
| Johnson | 12 | 12 |
| Berners-Lee | 12 | 13 |
| Anning | 13 | 14 |
| Ibn al-Haytham | 13 | 14 |

Mehrere Sätze liegen knapp über der Faustregel von 12 Wörtern. Das soll die `kinder-redaktion` beurteilen. „Einzige längste oder kürzeste Antwort“ zählt hier nicht: Die Antworten sind Personennamen und kommen aus `world-game-bank.ts`.

### Umformuliert
Keine. Es gibt keine Hauptfragen und keine gespeicherten Antworttexte. Nur der Hinweis-Text ändert sich. Der Test in Zeile 55 bis 57 (Rätsel aus der Einleitung für Personen ohne eigenes Rätsel) muss für diese neun angepasst werden. Das tritt von selbst ein, sobald die neun in `EIGENE_RAETSEL` stehen.

### Offen
1. **Gutenberg und die Werkstatt:** „Diese Person druckte“ vereinfacht die Werkstatt-Arbeit. Ginge auch: „In der Werkstatt dieser Person in Mainz wurden Bücher mit einzelnen Buchstaben aus Metall gedruckt.“ Das ist genauer, aber 16 Wörter lang. Entscheiden bitte `fakten-pruefer` und `kinder-redaktion`.
2. **Ibn al-Haytham, mehr Aha in Satz 2:** Möglich wäre „Dabei fand diese Person heraus: Licht kommt von den Dingen in unsere Augen.“ Das steht aber nicht ausdrücklich als seine Leistung auf der Karte. Absatz 2 erklärt es nur allgemein. Mit ⚠ und Britannica wäre es möglich. Ich habe die Fassung genommen, die nur auf der Karte steht.
3. **Wörter für Kleine:** „Web“ (Berners-Lee) und „Anweisungen“ (Hopper) kennen 5-Jährige vielleicht nicht. „Internetseiten“ wäre bekannter, widerspricht aber der Karte (Web ist nicht gleich Internet).
4. **Aufteilen nach Stufe:** Ein Anzeigen nur von Satz 1 für Entdecker gibt es im Code noch nicht. Alle neun Rätsel lassen sich am ersten „. “ sicher trennen: keine Abkürzungen, die Doppelpunkte stehen nur innerhalb der Sätze.
5. **Fürwort-Regex:** Sie meldet auch Wörter, die nach ß, ä, ö oder ü auf „er“, „sie“ und so weiter enden (Beispiel „größer“). Das sollten auch die Pakete 1 und 3 beachten.

### JSON
```json
{
 "person-maria_sibylla_merian": "Diese Person beobachtete lange, wie aus Raupen Schmetterlinge werden, und zeichnete das. 1699 reiste diese Person mit einer Tochter nach Suriname in Südamerika.",
 "person-johannes_gutenberg": "Diese Person druckte in Mainz Bücher mit einzelnen Buchstaben aus Metall. Die beweglichen Buchstaben ließen sich danach für einen anderen Text neu ordnen.",
 "person-katsushika_hokusai": "Diese Person zeichnete die Vorlage für ein berühmtes Bild mit einer riesigen Welle. Das Bild zeigt auch den Berg Fuji und wurde mit Holzblöcken gedruckt.",
 "person-alexander_humboldt": "Diese Person verglich, welche Pflanzen unten und welche hoch oben am Berg wachsen. Von 1799 bis 1804 reiste diese Person dafür mit Aimé Bonpland durch Teile Amerikas.",
 "person-grace_hopper": "Diese Person half, Computern Anweisungen in Wörtern zu geben. Mit einem Team entwickelte diese Person frühe Übersetzungsprogramme für solche Anweisungen.",
 "person-katherine_johnson": "Diese Person rechnete aus, auf welchem Weg Raumschiffe durch den Weltraum fliegen. 1962 prüfte diese Person Computer-Rechnungen für John Glenns Flug um die Erde.",
 "person-tim_berners_lee": "Diese Person entwickelte das Web: Seiten, die durch Links miteinander verbunden sind. Ende 1990 lief am Forschungszentrum CERN der erste Browser, der solche Seiten anzeigt.",
 "person-mary_anning": "Diese Person fand an der Küste versteinerte Reste von Tieren aus uralter Zeit. Bei Lyme Regis legte diese Person solche Fossilien frei, etwa Teile eines ausgestorbenen Meeresreptils.",
 "person-ibn_al_haytham": "Diese Person erforschte vor etwa tausend Jahren, wie Licht und unser Sehen funktionieren. In Kairo prüfte diese Person Ideen über das Licht mit gezielten Versuchen und Mathematik."
}
```

Gelesene Dateien:
- `/home/user/wunderkompass/app/world-game-support.mjs`
- `/home/user/wunderkompass/app/world-game-bank.ts`
- `/home/user/wunderkompass/tests/world-game-learning-copy.test.mjs`
- `/home/user/wunderkompass/app/world-catalog.json`

Das Prüfskript (nur im Scratchpad, ohne Gutenberg-Korrektur „einzelnen“; Ergebnis danach von Hand nachvollzogen): `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/r.mjs`
