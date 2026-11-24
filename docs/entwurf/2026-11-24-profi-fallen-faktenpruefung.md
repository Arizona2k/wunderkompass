# Profi-Fallen: Bericht des fakten-pruefer

Stand: 24.11.2026. Geprüft: [Kandidaten-Tabelle](2026-11-24-profi-fallen-kandidaten.md) (Teil B, Schritt 8.2). Auftrag: Passt der Hinweis auch auf einen Kandidaten? Im Zweifel ausschließen. Wortgetreu übernommen sind die Ausschlüsse; der Rest ist gekürzt.

## Ausschlüsse (umgesetzt in `app/world-game-fallen.json`)

„Grenzfall“ heißt: Der Hinweis passt zu zwei Dritteln oder bei genauem Wissen auch auf den Kandidaten; trotzdem ausgeschlossen.

| Spiel | Aufgabe | nie als Falle | Grund (gekürzt) |
|---|---|---|---|
| Tierdetektiv | Löwe | Orca, Großer Tümmler, Erdmännchen | Gruppenleben, gemeinsame Jagd, gemeinsame Jungenaufzucht, Rufe |
| Tierdetektiv | Bengaltiger | Rotfuchs | Grenzfall: Rotfüchse auch in Nepal und Nordindien, jagen allein, schwimmen |
| Tierdetektiv | Großer Tümmler | Orca | Zahnwal, Echoortung, Gruppen trennen sich und finden zusammen |
| Tierdetektiv | Orca | Großer Tümmler | Gruppen, lernen voneinander, jagen gemeinsam |
| Tierdetektiv | Schnabeltier | Kurzschnabeligel | legt Eier und säugt, „Schnabel“ im Namen |
| Tierdetektiv | Rotfuchs | Waschbär, Katta, Igel | Lebensraum, gemischte Nahrung, Rufe und Duftmarken |
| Tierdetektiv | Waschbär | Rotfuchs | Grenzfall: Lebensraum und Nahrung laut Karte wortgleich |
| Tierdetektiv | Igel | Kurzschnabeligel, Waschbär, Rotfuchs | Käfer, Regenwürmer, Laub, Winterschlaf/Winterruhe |
| Tierdetektiv | Axolotl | Feuersalamander | Larven mit äußeren Kiemen im Wasser |
| Tierdetektiv | Chamäleon | Seepferdchen | Grenzfall: Greifschwanz, unabhängige Augen, Farbwechsel |
| Tierdetektiv | Feuersalamander | Grasfrosch | Grenzfall: feuchter Wald, Larven im Gewässer |
| Tierdetektiv | Grasfrosch | Feuersalamander | Grenzfall: an Land im Wald, Larven im Gewässer |
| Tierdetektiv | Europäischer Aal | Grüne Meeresschildkröte | Grenzfall: Wanderung Mittelmeer–Atlantik, Jungtiere treiben mit Strömungen |
| Tierdetektiv | Gewöhnlicher Krake | Sepia | acht Arme, allein, Rückstoß |
| Tierdetektiv | Sepia | Gewöhnlicher Krake | Grenzfall: acht Arme, Farbwechsel |
| Wer war das? | Karl Benz | Bertha Benz | an der Entwicklung des Motorwagens beteiligt |
| Wer war das? | Bertha Benz | Karl Benz | dasselbe Fahrzeug |
| Wer war das? | Wangari Maathai | Jane Goodall | Grenzfall: Einsatz für Natur und Wälder in Ostafrika |
| Wer war das? | Charles Darwin | Alexander von Humboldt, Mary Anning | Satz 1 passt auch auf beide |
| Wer war das? | Alexander von Humboldt | Charles Darwin | große Reise, Aufzeichnungen, Pflanzen verglichen |
| Wer war das? | Mary Anning | Charles Darwin | auch Darwin fand Fossilien an Küsten |
| Technik | Auto | Fahrrad | auch das Fahrrad macht ohne Pferd beweglich |
| Technik | Flugzeug | Rakete | auch Raketen bringen Menschen durch die Luft |
| Technik | Computer | Transistor | Grenzfall: Transistoren machten Rechnen schnell |
| Technik | Internet | Satellit, Smartphone | Informationen zwischen fernen Orten; Grenzfall Smartphone |
| Technik | Kompass | Fernrohr | Navigationshilfe auf See |
| Technik | Rakete | Satellit | Grenzfall: Kinder verwechseln Gerät und Fahrzeug |
| Technik | Mikroskop | Fernrohr | Grenzfall: macht kleine Strukturen unterscheidbar |
| Technik | Batterie | Generator | Kurbel- und Dynamolampen |

## Hinweise mit Fehlern (nicht in Schritt 8.2 behoben, siehe Entscheidungsliste Teil B, Punkt 7)

- **Darwin**: Satz 2 sagt nicht, dass Darwin die Idee der natürlichen Auslese entwickelt hat; der Hinweis führt nicht sicher zu ihm. Vorschlag: „Er entwickelte die Idee der natürlichen Auslese: …“ (Beleg: Natural History Museum London; Darwin/Wallace 1858).
- **Jane Goodall**: „Mit 26 Jahren begann Diese Person …“: großes „Diese“ mitten im Satz (Ersetzung in `personRecognitionClue`).
- **Einstein**: „warum die Anzahl von Lichtquanten und ihre einzelne Energie verschieden sind“ ist schief. Vorschlag: „Er erklärte, dass Licht aus kleinen Energiepaketen besteht. Dafür bekam er den Nobelpreis.“ (nobelprize.org, Physik 1921).
- **Rotfuchs**: sehr schwacher Hinweis, alle drei Sätze passen auch auf den Waschbären. Besser ein Merkmal nur des Fuchses, z. B. der Mäusesprung.
- **Europäischer Aal**: schwach; die Sargassosee als Laichgebiet wäre eindeutig.
- **Wangari Maathai** und andere: „Sie“, „sein/ihr/er“ verraten das Geschlecht. Kein Sachfehler, auf Profi aber ein Ratemuster (für den `stufen-pruefer`).
- **Flugzeug**: „durch die Luft reisen“ ging seit 1783 mit dem Ballon; genauer „mit einer Maschine gesteuert fliegen“.
- **Elektrisches Licht**: „nur mit Feuerlicht oder anderen Lampen“ ungenau; die Antwort bleibt eindeutig.
- **Daten**: Cai Lun steht mit seinem Todesjahr 121 in der Zeitreihe, der Kühlschrank mit 1906 („kein Erfindungsdatum“). Die Kandidaten werden dadurch nicht falsch, die zeitliche Nähe ist bei beiden willkürlich.

## Ohne Befund und bewusst nicht ausgeschlossen

Ohne Befund: Tierdetektiv 33 von 48, Personen 30 von 36, Technik 16 von 24. Nicht ausgeschlossen, weil ein bekanntes Merkmal klar trennt: Giraffe–Okapi (langer Hals), Eisvogel–Seeadler (Blau), Seepferdchen–Chamäleon („Ich bin ein Fisch“), Gepard–Löwe/Jaguar (Zirplaute), Bengaltiger–Jaguar (Indien), Kurzschnabeligel–Schnabeltier/Igel, Erdmännchen–Katta, al-Chwarizmi–Ibn al-Haytham, Ibn al-Haytham–Ibn Sina, Meitner–Curie, Fernrohr–Mikroskop, Eisenbahn–Aufzug.

## Grenzen der Prüfung (ehrlich, vom Prüfer)

Kartentexte nur stichprobenhaft gelesen. Mit Quelle nachgesehen nur die Grenzfälle (englische Wikipedia mit den dort genannten Fachquellen; die IUCN-Seite zum Rotfuchs antwortete nicht). Die übrigen Urteile beruhen auf Fachwissen. Keine vollständige Faktenprüfung jedes Hinweises. Schwierigkeit und Ratemuster: `stufen-pruefer`; Satzbau: `kinder-redaktion`.
