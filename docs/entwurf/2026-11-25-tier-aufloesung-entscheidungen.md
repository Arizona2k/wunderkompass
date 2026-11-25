# Tier-Auflösungen, Kartenkorrekturen, Sätze nach falscher Antwort: Entscheidungen (25.11.2026)

Claude entscheidet nach den fünf Prüfberichten. Grundlage für die Endfassung durch den `karten-autor`; danach prüfen `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer` nur die geänderten Stellen.

Berichte:
- Entwürfe: [Paket 1](2026-11-25-tier-aufloesung-paket-1.md), [Paket 2](2026-11-25-tier-aufloesung-paket-2.md), [Paket 3](2026-11-25-tier-aufloesung-paket-3.md), [Paket 4](2026-11-25-tier-aufloesung-paket-4.md), [Kartenkorrekturen und Sätze](2026-11-25-kartenkorrekturen-falsch-saetze-entwurf.md)
- Prüfungen: [Fakten A](2026-11-25-tier-aufloesung-faktenpruefung-a.md), [Fakten B](2026-11-25-tier-aufloesung-faktenpruefung-b.md), [Kinder-Redaktion A](2026-11-25-tier-aufloesung-kinderredaktion-a.md), [Kinder-Redaktion B](2026-11-25-tier-aufloesung-kinderredaktion-b.md), [Stufen](2026-11-25-tier-aufloesung-stufenpruefung.md)

## Grundsätze (gelten für alle 144 Texte)

1. **Alle Muss- und Soll-Befunde** der fünf Berichte werden umgesetzt. Kann-Befunde nach Urteil des Autors, wenn sie den Text klarer machen und die Regeln einhalten.
2. **„wirbellos“** (Widerspruch Fakten B, M1, gegen Kinder-Redaktion B, M1): Die Fakten gehen vor. „Ohne Knochen“ erklärt das Wort falsch (Haie haben auch keine echten Knochen). Feste Formel überall: **„Solche Tiere ohne Wirbelsäule nennt man wirbellos.“** Das Wort „Wirbel“ steckt in beiden, so verstehen Kinder den Namen.
3. **„Feinde“** statt „Räuber“ oder „Raubfische“, wenn Tiere gemeint sind, die andere fressen (Kinder-Redaktion B, S5).
4. **Bedingungssätze mit „Wenn“** statt Verb vorn (Kinder-Redaktion A, M1), in allen vier Paketen.
5. **Kein Satz derselben Tatsache wie Hinweis, Hauptfrage, Zusatzfrage oder Rätsel** (Stufen 1-M1, 1-S1; Kinder-Redaktion B, M2). Wo der Stufen-Prüfer und die Kinder-Redaktion verschiedene Ersatztexte vorschlagen (Seepferdchen, Orang-Utan, Eisbär), nimmt der Autor den, der etwas wirklich Neues bringt und belegt ist; beide Ideen dürfen verbunden werden.
6. **Fast gleiche Sätze bei verschiedenen Tieren im selben Spiel** werden aufgelöst (Kinder-Redaktion A, M2). Jeder Vergleich nur einmal im ganzen Spiel (Strohhalm, Staubsauger, Luftballon, Sieb).
7. **Zahlen** nur mit Bild aus dem Kinderalltag (Kinder-Redaktion A, M3). „fünf Fußballfelder“ ist eine zweite Zahl: darum ohne „500“ („tiefer, als fünf Fußballfelder lang sind“), wenn das Zählskript es verlangt.
8. **Mitmach-Tipps** nach der Regel der Kinder-Redaktion B (Abschnitt „Empfehlung“): höchstens ein Tipp je Tier, höchstens etwa jedes vierte Tier, nie Tiere anfassen oder stören, Schutz-Tipps nur mit Beleg einer Naturschutz-Stelle und als freundliche Tatsache.
9. **„Forscher“** (nicht „Forschende“) in allen Spieltexten, weil die Karten das so halten; ein Kind soll nicht zwei Formen lernen müssen. (Kinder-Redaktion B, K12)
10. **Neue Aussagen aus Prüfer-Vorschlägen** (z. B. drei Herzen beim Kraken, Halsknochen der Giraffe, Koala-Bauch und Gift) bekommen eine Quelle vom Autor; ohne Quelle wird ein anderer belegter Satz genommen.

## Fallen (`app/world-game-tier-fallen.json`)

Regel wie am 24.11.2026: Passt eine Falle laut Quelle ganz oder teilweise, oder ist sie ein Unterbegriff der richtigen Antwort, kommt sie in beiden Listen des Tieres weg.

- **„Fleisch“** nur noch bei Tieren, die gar keine Tiere fressen. Streichen bei: Braunbrustigel, Grasfrosch, Kurzschnabeligel, Feuersalamander, Chamäleon, Hummer, Echter Clownfisch, Afrikanischer Strauß, Walhai, Blauwal (Fakten A, F; Fakten B, M2 und S5; Stufen 2-S1).
- **„Krill“** streichen, wo die richtige Antwort Krill mit umfasst oder die Auflösung kleine Krebse nennt: Krake, Sepia, Hummer, Seepferdchen, Aal, Papageitaucher, Großer Tümmler, Axolotl (Fakten A, F; Fakten B, M2; Stufen 2-M1). Bei Igel, Feuersalamander und Schnabeltier bleibt Krill (Meer gegen Land oder Süßwasser).
- **Papageitaucher** zusätzlich „Kleine Tiere im Plankton“ streichen (Fakten B, M2).
- **Lebensraum streichen:** Monarchfalter „Flüsse und Feuchtgebiete“ und „Wüste“; Chamäleon „Flussufer und Stillgewässer“, „Savanne“, „Grasland“; Schleiereule „Flussufer und Stillgewässer“; Katta „Flussufer und Stillgewässer“; Jaguar „Wüste“ (Fakten A, F; Fakten B, M2 und S4).
- **Nahrung streichen:** Erdmännchen „Fische, Vögel und auch tote Tiere“ (Fakten B, S4).
- **Eisbär, Entdecker:** „Feuchte Wälder und Larvengewässer“ ersetzen durch „Wüste“ (Stufen 2-M2).
- **Auffüllen:** Wo eine Liste unter die Mindestzahl fällt (Entdecker 3, Profi 4), schlägt der Autor neue Paare vor, die laut Kartenquelle sicher falsch sind und kein Unterbegriff der richtigen Antwort. Bis der `fakten-pruefer` sie bestätigt hat, wird mit geprüften Entdecker-Fallen desselben Tieres aufgefüllt (Vorgehen vom 24.11.).
- **Nicht in diesem Schritt** (BACKLOG 25, „Fallen schärfen“): Profi-Listen, die fast gleich wie Entdecker sind (Stufen 2-S3), Dauerfallen als Ratemuster (2-K1), doppelte Einträge (2-K2), zu weite richtige Antworten (2-K3), Hinweise für Profi (2-S4).

## Kartenkorrekturen

- **Benz:** „Carl“ (Fakten A, 1.4: Deutsches Museum, Deutsche Biographie). Die Schreibweise „Karl“ wandert in `more[0]` (Kinder-Redaktion A, Muss 3). Der Titel „Karl (Carl) Benz“ bleibt bis Schritt 2 (Kartennamen; Titel ändern heißt Kompatibilität prüfen).
- **Aufzug:** Fassung der Kinder-Redaktion A für `paragraphs[0]`, `parts[counterweight].description` und `wrongReasons[2]`. „etwa halb voll“ ist durch TK Elevator (40 bis 50 %) gedeckt. Die ganze Aufzug-Karte neu schreiben: ins BACKLOG.
- **Licht:** Fassung der Kinder-Redaktion A mit „Kraftwerk“ (Fakten A: NPS, Pearl Street 1882); „ein dünner Glühfaden“ in der Früher-Stufe (Fakten A, Kann).
- **Kühlschrank:** wie im Entwurf (Fakten A: stimmt).

## Sätze nach falscher Antwort

- **Wörter:** „Zuhause“ und „Futter“ (Kinder-Redaktion A, Teil 2). Spielfragen angleichen: BACKLOG.
- **Technik-Detektiv:** „… Passt das zu allem in der Aufgabe?“ (Kinder-Redaktion A und Stufen 3-S1, beide gleich).
- **Nahrung, Schlussfrage nach Stufe** (Stufen 3-M1): Entdecker „Frisst dieses Tier Pflanzen, andere Tiere oder beides?“, Profi und Experte „Wie groß ist dieses Tier, und wo lebt es?“.
- **Südpol-Satz:** „Deine Wahl ist Meereis ganz im Süden der Erde. Lebt dieses Tier dort?“ (Fakten A).
- **Fester Satz „Baumkronen“:** „Deine Wahl liegt hoch oben in den Bäumen. Kommt dieses Tier dort hinauf?“ (Kinder-Redaktion A, Kann).
- **„passt zum Beispiel zu:“** → „Deine Antwort passt zu einem anderen Tier: …“ (Kinder-Redaktion A, Kann), wenn die Tests es zulassen (`tests/world-game-runde.test.mjs`).
- **Monarchfalter-Futter** in der Rückmeldung: Sonderform „Futter: Raupen fressen Seidenpflanzen, Falter Nektar.“ nur in der Rückmeldung; das Feld `diet` bleibt (gespeicherte Antworten).

## Ins BACKLOG (nicht in diesem Schritt)

- Aufzug-Karte ganz neu in Kindersprache (Kinder-Redaktion A).
- Spielfragen auf „Zuhause“/„Futter“ angleichen (Kinder-Redaktion A).
- Schleiereule-Karte: Erdteil nur „Europa“ ist zu eng (Fakten B, Nebenbefund).
- Katta: Einstufung „stark gefährdet (Rote Liste der IUCN, 2020)“ auf der Karte zeigen? (Fakten B; BACKLOG 27).
- Experten-Aufgaben für die Welt-Spiele aus den Auflösungen (Stufen, „Lücken“).
- Fallen schärfen (siehe oben).
