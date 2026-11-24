# „Rekorde der Natur“: Endfassung des `karten-autor` (24.11.2026)

Entwurf, vom Helfer nicht selbst geprüft; danach prüfen `fakten-pruefer`, `kinder-redaktion`, `stufen-pruefer` unabhängig. Keine Projektdatei geändert.

**Die Aufgaben (gültiges JSON):** [2026-11-24-rekorde-endfassung.json](2026-11-24-rekorde-endfassung.json). 20 Aufgaben mit Hauptstufe: 7 Entdecker, 7 Profi, 6 Experte. Vorrat je Stufe: Entdecker 7, Profi 11, Experte 6 (C1 erfüllt: 6 echte Experte-Aufgaben). Neu: 4 Experte-Aufgaben (Everest im Graben, Amazonas und Nil, Eis-Wüste, langes Rennen) und 1 Entdecker-Aufgabe (kältester Ort). Ersetzt `world:records` und `extra:treasure`.

Neue Felder: `vorrat` (in welchen Stufen gezogen), `warum_nicht` (nur Experte, je falscher Antwort ein Satz ohne die Lösung), `karte` (oder `null`), `ort` (Globus-Ort aus `app/nature-data.ts`, damit „Auf der Weltkugel besuchen“ aus der Schatzsuche bleibt), oben `spiel`, `regeln`, `nie_zusammen` (Paare nie in derselben Runde). `tipp_2` nur auf Experte.

## Quellen: selbst gelesen, noch zu prüfen (⚠)

Selbst geöffnet: Smithsonian Gepard (96 bis 112 km/h, Höchsttempo nur etwa 274 m), San Diego Zoo Strauß (70 km/h Sprint, 50 km/h dauerhaft, 100 bis 130 kg), Hellabrunn (50 km/h etwa eine halbe Stunde), Smithsonian Strauß-Fakten, NASA EO Amazonas-Quelle (Amazonas 6.800 km, Nil 6.695 km), USGS längste Flüsse, NASA/JPL MISR (1,8 bis 3 m Regen im Jahr), NatGeo Nil (Süd nach Nord, 11 Länder, Wüste), USGS Flüsse (Wasser vor allem aus Niederschlag, fließt bergab), NSIDC Eisschilde (Schnee taut im Sommer nicht ganz, Schichten über Jahrtausende, dickste Stelle fast 4,9 km), Uni Hamburg (Vereisung seit etwa 34 Mio. Jahren, vorher Wälder), WWF.de Savannenelefant (Männchen im Schnitt 6 t). Schon vom `fakten-pruefer` bestätigt (Bericht 24.11.): NOAA, NPR, NASA EO, FAO, NatGeo Wüsten, AAP, USGS Baikal/Mauna Kea, NPS, Peregrine Fund, Georgia Aquarium, DFO, San Diego Zoo Giraffe.

Besonders prüfen:
1. Alltagsvergleiche ohne Quelle (Erwachsener etwa 75 kg und 1,75 m; Auto 4,5 bis 5 m; Sportplatzrunde 400 m; 25-Meter-Becken).
2. StVO § 3 (innerorts 50, Landstraße 100 km/h), Seite gab 503.
3. Eiffelturm 330 m (Seite gab 403): Everest etwa 27, Baikal fast fünf, Graben etwa sechs Eiffeltürme.
4. WMO-Tabelle (−89,2 °C, Wostok, 21.7.1983) nicht geöffnet, übernommen aus `app/precision-source-notes.ts`; „minus 89 Grad“, „vor über 40 Jahren“; URL heißt `Table_Records_25Jul2025`, die App schreibt „Stand 31. Juli 2025“.
5. Gefrierfach −18 °C (Verbraucherzentrale, nur Suchauszug).
6. „Dort kommt fast kein Wasser dazu“ (Nil in der Wüste) nicht selbst gelesen.
7. Länder im Flussgebiet: Nil 11 (gelesen), Amazonas 7 bis 9 (nur Suchauszug); „Nil über mehr Länder“ gilt in beiden Zählweisen.
8. „Etwa 80-mal so viel“: NASA ganzes Amazonasbecken (6.789 km³) gegen FAO Nil bei Assuan (84 km³), verschiedene Messpunkte.
9. Antarktis: „selbst im Sommer eiskalt“, „für Regen zu kalt“ (AAP, Zeitüberschreitung); „Meereis schwimmt“ ohne eigene Quelle; „in der Mitte … fast 5 km“ (NSIDC nennt die dickste Stelle, nicht den Ort).
10. Tiefseegräben „lange, schmale Rinnen“ (WHOI, NatGeo, nur Suchauszug).
11. Falke: „jagt kleinere Tiere als der Gepard“ ohne Quelle; „ein Vogel stürzt nicht schneller, weil er leicht ist“ (Wortlaut bestätigen).
12. Mauna Kea: „Der Everest ist der ältere Berg“ vermutlich wahr; `warum_nicht` erklärt, dass das Alter nichts zur Sache tut.
13. NASA Kids „Which pole is colder“ nicht geöffnet (betrifft nur `falsch[2]` „Nordpol“, Entdecker sieht sie nicht).

## Umformuliert gegenüber dem, was heute live ist

In `tests/fixtures/gespeicherte-antworten*.json` steht keine Rekord- oder Schatzsuche-Antwort (grep). Tierrekorde: Savannenelefant („Afrikanischer Savannenelefant“ → „Savannenelefant“; falsch „Löwe“, „Koala“ → „Breitmaulnashorn“, „Flusspferd“, „Waldelefant“), Gepard (Frage einfacher; „Panda“ → „Löwe“, dazu „Strauß“), Giraffe („Löwe“ → „Dromedar“, dazu „Strauß“), Blauwal („Walhai“ dazu); `warum` und Tipps neu; `animal-common-octopus` gestrichen. Schatzsuche (bisher ohne IDs): „Antarktische Wüste“ → „Antarktis“, Fragen neu, Fallen ersetzt (geblieben „Rhein“, „Nil“).

## Zahlen

Entdecker-Vorrat 7 (Runde 5), Profi 11 (Runde 8; wegen Blauwal/Walhai höchstens 10 zusammen), Experte 6 (Runde 3 plus 5 Profi; in jedem der 20 Dreier bleiben mindestens 7 erlaubte Profi-Aufgaben). Längenmuster: Entdecker 0 % längste, 0 % kürzeste; Profi 0 %/18 % (Baikalsee, Walhai); Experte 0 %/0 %. Kein Tipp enthält die Lösung; keine Übertreibungswörter in Antworten; kein Satz über 12 Wörter.

## Änderungen gegenüber dem ersten Entwurf (Kurzfassung)

Alle nötigen Änderungen der drei Berichte und die Empfehlungen aus Abschnitt A und B der Entscheidungsliste: Tipps, die verrieten, neu (Blauwal, Gepard, Elefant, Giraffe, Berg, Fluss, Wüste, Tiefste Stelle); Zahlen und Einheiten nach dem `fakten-pruefer` (Blauwal, Gepard km/h, Giraffe „über 5 m“, „heute lebende“); Britannica überall ersetzt (NPR, NASA EO, FAO, NatGeo); Vergleiche zu Zahlen (Becken, Erwachsene, Eiffeltürme, Autos, Landstraße); Ozean nach Profi; „Mont Blanc“ → „Zugspitze“, „Nordsee“ → „Mittelmeer“; `rekord-fairer-vergleich` nach Entscheidung B („leichter“, „jagt kleinere Tiere“, Flügel-Antwort; nicht „fliegt lange so schnell“), Geradeausflug-Satz genauer; `rekord-messregel-berg` nach B; neue Aufgaben nach Stufenbericht Abschnitt 4 (Amazonas/Nil mit belegbar falschen Fallen statt „älter“, „mehr Kurven“); Ausschlussliste um neue Paare ergänzt (auch Blauwal/Walhai); Spieltexte nach `kinder-redaktion`, `experte_hinweis` neu.

## Offen

1. `stufen-pruefer`: (a) zwei Fallen beginnen mit „Der Gepard“ (Muster?); (b) „Der Nil fließt bergauf“ echte Fehlvorstellung oder Quatsch?; (c) Entdecker-Tipps führen stark zur Lösung; (d) Berg-Tipp ohne „Mount“ stark genug?; (e) Everest im Graben echt Experte oder Profi?
2. `kinder-redaktion`: drei Eiffelturm-Vergleiche zu oft?; „25-Meter-Becken“ klar?; `experte_hinweis` nötig?
3. `warum_nicht` für alle Profi-Fallen (etwa 33 Sätze) in einem nächsten Paket?
4. Entdecker-Aufgaben mit einer nie gezeigten Profi-Falle (Giraffe „Strauß“, Berg „K2“, Kälte „Nordpol“): behalten oder streichen?
5. Kälte-Aufgabe nur Entdecker (Profi-Fassung mit Sibirien/Grönland bräuchte WMO-Belege).
6. Experte-Aufgaben zuerst oder gemischt?
7. Code: alte Pass-Einträge `world-game:records:animal-common-octopus`, alte `gameSessions['extra:treasure']` (Weg ins neue Spiel, Stempel bleibt), `recordHints` in `app/world-game-support.mjs`, `GAME_HINTS.treasure` in `app/advanced-games.tsx`, betroffene Tests.
8. Paare mit Entdecker-Aufgabe in `nie_zusammen` greifen heute nicht (zur Sicherheit aufgenommen).
9. Bilder: Wanderfalke im Sturzflug und Pazifik ohne Karte/Bild (`bild-recherche`).
