# „Wetter und Klima“: Endfassung des `karten-autor` (24.11.2026, Teil B, Aufgabe 10)

Entwurf, nicht selbst geprüft; danach prüfen `fakten-pruefer`, `kinder-redaktion`, `stufen-pruefer` unabhängig. Keine Projektdatei geändert. Ersetzt `extra:climate-detective` und `extra:weather-match`.

**Die Aufgaben (gültiges JSON):** [2026-11-24-wetter-klima-endfassung.json](2026-11-24-wetter-klima-endfassung.json). 22 Aufgaben: 9 Entdecker, 8 Profi, 5 Experte; mit den 3 Zonen auf Profi (`auchProfi`, `profiZusatz` mit vierter Antwort „Subtropen“) 11 Profi-Fragen. Felder: `richtig` = Text, `warumNicht` in Reihenfolge der `antworten` (`null` an der richtigen Stelle), `topic` (Karte oder `null`), `alt_id`. Entdecker 1 Tipp, Profi 1, Experte 2.

## Spieltexte

- Name: Wetter und Klima. Untertitel/Spieleliste: „Regen, Wind und Wolken: Was ist Wetter, was ist Klima?“
- Tipp-Satz (ersetzt `GAME_HINTS['climate-detective']`): „Frag dich: Was passiert heute am Himmel? Was gilt über viele Jahre?“
- Satz zur Klimazone, einmal je Runde vor der ersten Zonen-Frage: „Eine Klimazone ist ein breiter Streifen rund um die Erde. Überall darin ist das Klima ähnlich.“

## Vorrat je Stufe

| Stufe | Vorrat | Runde | Reicht? |
|---|---|---|---|
| Entdecker | 9 (regen, schnee, wind, sonnig, nebel, satz-heute, 3 Zonen) | 5 | ja |
| Profi | 11 (wolke, klima-wort, satz-klima, zone-subtropen, ein-tag, tau, regenbogen-wann, gewitterwolke + 3 Zonen) | 8 | ja; mit Ausschlussliste höchstens 9 gleichzeitig (knapp, Offen 5) |
| Experte | 5 (berg-eis, regenbogen-morgen, hagel-sommer, reif-nacht, donner-zaehlen) | höchstens 3, Rest Profi | ja (C1: mindestens 4) |

Regen, Schnee, Wind, Sonnig, Nebel nicht im Profi-Vorrat (Entscheidung A).

## Änderungen gegenüber dem ersten Entwurf (Kurzfassung)

Neu bei allen: `warumNicht` und `topic`; Format `antworten` + `richtig`. Regen (Tipp ohne „Schirm“, Hagel raus), Schnee (Hagel raus, warum nach NSIDC), Wind (Tau raus), Sonnig (warum nach `kinder-redaktion`), Nebel (jetzt Entdecker: Nebel, Hagel, Regen; Raureif raus), Klima-Wort (Profi; „Der Wind“ → „Die Jahreszeit“), Satz heute (neue Frage, Entdecker), Satz Klima (richtige Antwort mit Zeitwort, Sahara statt Spanien, Britannica raus), Zonen (gemäßigt „kühle Winter“; Tropen mit Äquator-Erklärung und NASA-Kids-Quelle; Polar ohne „Nahe den Polen“ und ohne „Pol“ in der Frage; Subtropen neue Frage und Tipp, Quellen NOAA/DWD), Wolke (Rauch-Falle umformuliert, Staubkörnchen im warum), Ein Tag (Profi, zwei Fallen ersetzt, ein neuer Tipp), Berg-Eis (Frage mit „noch“ und „Gipfel“, richtige Antwort ohne Wort der Frage, neue Fallen „Sonne schwächer“ (DWD: UV nimmt mit der Höhe zu) und „Wind macht kälter“ (NWS Wind Chill); „Schatten der Wolken“ bewusst nicht genommen). Neu: regenbogen-morgen (Experte), hagel-sommer (Experte), reif-nacht (Experte), donner-zaehlen (Experte), tau (Profi), regenbogen-wann (Profi), gewitterwolke (Profi).

## Besonders prüfen (`fakten-pruefer`, ⚠)

1. hagel-sommer: „Sind die Körner zu schwer, fallen sie als Hagel“ nicht wörtlich gesehen; `falsch[2]` halbe Wahrheit mit falschem Schluss; `falsch[1]` „im Winter zu kalt“ eindeutig falsch (Wintergewitter bringen Schnee)?
2. berg-eis: „Die Sonne ist oben sogar stärker“ als Schluss aus „UV nimmt mit der Höhe zu“; IOP-Fläche von 2021.
3. regenbogen-morgen: „Morgens steht die Sonne im Osten“ vereinfacht (Sommer Nordosten).
4. reif-nacht: „Der Mond kühlt nichts“ ohne Quelle.
5. donner-zaehlen: „Hörst du Donner, geh lieber ins Haus“ (NWS-Leitspruch, Seite nicht geöffnet).
6. gewitterwolke: Dass aus Haufenwolken ein Gewitter wachsen kann, sagt NOAA nicht wörtlich.
7. tau: „Kälte ist kein Stoff“ ohne Quelle.
8. zone-subtropen: „viele große, heiße Wüsten“ ohne Ortsangabe; ist „Tropen“ eindeutig falsch?
9. ein-tag: „Im Juli ist es bei uns meist warm“ ohne Quelle.
10. satz-klima: Ohio nennt Monatsmittel ohne „im Sommer“.
11. zone-tropen: NASA Kids „tropical grasslands“ = „Savanne“ gleichgesetzt.

Nicht erreichbar: DWD „Tau“ und „Nullgradgrenze“ (404), Met Office Regenbogen, NASA Space Place, Ohio Savanne (nicht verwendet); statt BfS das DWD-PDF von 2015 (Wortlaut gelesen).

## Ausschlussliste „nie in derselben Runde“

1. `wetter-regenbogen-wann` × `wetter-regenbogen-morgen` (Profi-Antwort löst die Experte-Aufgabe).
2. `wetter-tau` × `wetter-wolke` (Tau-Antwort ist bei der Wolke die Falle).
3. `wetter-gewitterwolke` × `wetter-hagel-sommer` (Tipps und warum verraten sich).
4. `wetter-klima-wort` × `wetter-ein-tag` (warum von klima-wort löst ein-tag; nur Empfehlung, Offen 5).

## Umformuliert (alt → neu)

Nichts davon in `tests/fixtures/gespeicherte-antworten*.json`. Wetter-Zeichen „Sonne“ → „Sonnig“, „Wolke“ → „Aus kleinen Tropfen oder Eis“ (neue Richtung). Klima-Detektiv `/1` bis `/4`: Fragetexte neu, richtige Antwortwörter gleich; Antwortsätze ändern sich bei `/2` und `/3`. Klima-Detektiv speichert ganze Frage-Objekte (`restoreQuestions`); ob alte Runden zu Ende laufen, entscheidet Claude.

## Zahlen

Entdecker (3 Antworten): richtige 2-mal einzige längste (22 %), 2-mal einzige kürzeste (22 %). Alle mit 4 Antworten (16): 1-mal längste (6 %), 2-mal kürzeste (13 %). Experte: 0 %/0 %. Kein Tipp mit der Lösung; kein Satz über 12 Wörter; keine Übertreibungswörter in richtigen Antworten; alle `topic`-IDs im Katalog außer zweimal `null`.

## Offen

1. Regenbogen-Aufgaben ohne passende Karte (`null`); Verweis aufs Labor „Wetterstation“? Regenbogen-Foto fehlt (`bild-recherche`).
2. `stufen-pruefer`: donner-zaehlen echt Experte oder Profi (dann trotzdem 4 Experte)?
3. `stufen-pruefer`: Fallen als echte Kinder-Vorstellungen (tau, reif-nacht, wolke)?
4. `wetter-wolke` gleicht der Hauptfrage der Karte `science-water-cycle`.
5. Ausschluss 4 nur Empfehlung (mit ihm höchstens 9 von 11 Profi-Fragen je Runde).
6. `kinder-redaktion`: „So alt sind manche Eltern“ (30 Jahre)? „Blech“, „Gartenschlauch“? Tropen-Frage mit drei Sätzen zu lang zum Vorlesen?
7. Polar-Tipp (Eisbären, Kaiserpinguine) auf Profi zu leicht?
8. Satz zur Klimazone („breiter Streifen rund um die Erde“) nur gegen DWD „großräumige Gebiete“ geprüft.
