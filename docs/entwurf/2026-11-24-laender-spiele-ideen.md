# Ideen für die Länder-Spiele (Teil B, Aufgabe 11), 24.11.2026

Helfer: `ideen-scout` (Auftrag von Claude, Vorarbeit für PR 4). Der Helfer hat nichts geändert. **Ehrlich:** Er hat `VISION.md` gelesen, die Ideen-Sammlung in `BACKLOG.md` nicht (Doppelungen dort gegenprüfen). Die Angebote kennt er als Prinzipien, die Links wurden in diesem Lauf nicht abgerufen; vor dem Einbau öffnen. Übernommen wird nur das Prinzip, nie Inhalt, Bild oder Figur.

## Ideen (beste zuerst)

1. **Erst Hinweis, dann Antwort („Hinweis-Leiter“, Entdecker bis Profi).** Das Kind sieht zuerst ein Bild (Tier, Bauwerk, Essen). Mit „Noch ein Hinweis“ kommt ein weiterer: Lage auf dem Globus, Form, Flagge. Keine Punkte, keine Uhr; die Rückmeldung erklärt am Ende, welcher Hinweis wohin führte. Warum: Raten wird zu Schlussfolgern; Bilder tragen die Arbeit („zu viel Text“, „zu leicht“). Aufwand mittel. Andocken: neues Spielmuster in `app/world-game-bank.ts`, Hinweisbilder aus `world-catalog.json`. Quelle: GeoGuessr-Prinzip https://www.geoguessr.com, Seterra https://www.seterra.com
2. **Fehler führen zu einer Lernschleife.** Eine falsche Antwort kommt später in der Runde noch einmal, mit kleinem Merkhinweis („Diese Flagge hat drei Streifen, oben Rot“); am Ende „Das übst du noch“ statt einer Zahl. Warum: Wiederholungsprinzip wie bei Duolingo, ohne Serien, Herzen, Ranglisten. Aufwand klein bis mittel; besser nur innerhalb einer Runde, ohne neue Speicherung (sonst Schema 3 und Nachweis nach `CLAUDE.md`). Andocken: Länder-Spiele in `app/learning-games.tsx`. Quelle: https://www.duolingo.com (nur das Prinzip)
3. **Experte: „Welches Land passt nicht?“ mit Begründung.** Vier Länder, eines passt nicht (einziges ohne Meerzugang, einziges auf der Südhalbkugel); das Kind wählt aus 2 bis 3 Begründungen; gibt es mehrere gültige Ordnungen, zeigt die Rückmeldung sie. Aufwand mittel: je Land geprüfte Merkmale (Binnenland, Insel, Halbkugel, Kontinent) in der gemeinsamen Liste. Quelle: BBC Bitesize https://www.bbc.co.uk/bitesize/subjects/zrw76sg
4. **Experte: Nachbarn über Grenzen erschließen.** „Dieses Land grenzt an A, B und C. Welches ist es?“ oder eine Kette aus Nachbarländern von Portugal nach Polen. Aufwand mittel (Nachbarliste für alle Länder geprüft). Andocken: „Nachbarn“, „Weltreise“. Quelle: https://www.seterra.com
5. **Experte: Steckbrief-Rätsel (Hinweise kombinieren).** Drei Hinweise gleichzeitig („liegt am Meer“, „Flagge hat ein Kreuz“, „Hauptstadt mit R“), die Auswahl wird sichtbar enger. Logik und Ausschließen. Aufwand mittel. Quelle: National Geographic Kids https://kids.nationalgeographic.com/games
6. **Flaggen-Merkmale begründen (Experte, leicht auch Profi).** „Was haben diese Flaggen gemeinsam?“ (Nordisches Kreuz, Streifen waagrecht oder senkrecht, Halbmond); Flaggen in Familien sortieren. Aufwand klein bis mittel. Andocken: Flaggen-Memory, `public/flags/`. Quelle: https://de.wikipedia.org/wiki/Skandinavisches_Kreuz
7. **Entdecker: Land über Tiere und Bauwerke („Wer wohnt wo?“).** Tier oder Bauwerk zeigen, Land auf großer, vereinfachter Karte oder aus 3 Bildern tippen, danach öffnet sich die Wissenskarte (Ziel 6). Nur eindeutige, typische Zuordnungen, Wortlaut „lebt unter anderem in“. Aufwand mittel. Quelle: https://www.planet-schule.de
8. **Entdecker: „Hallo“ und Essen als Mini-Entdeckung.** Wort in der Landessprache, typisches Essen als Foto, Flagge; „Das kenne ich“ oder „neu“, ohne Bewertung. Aufwand mittel bis groß (freie Fotos mit Nachweis; erst ohne Audio). Quelle: https://kids.nationalgeographic.com/geography
9. **Profi: „Fast gleiche Flaggen“ als Vergleich.** Zwei ähnliche Flaggen (Irland und Elfenbeinküste, Rumänien und Tschad) nebeneinander, Unterschied finden, dann zuordnen. Aufwand klein. Quelle: Seterra (Flaggen)
10. **Umriss und Lage zusammen.** Umriss sichtbar, Land auf stiller Karte oder dem 3D-Globus antippen. Aufwand mittel (Rückweg zum Spiel nötig). Quelle: https://www.seterra.com
11. **Reise mit Etappen („Weltreise“ als Geschichte).** Fünf Etappen mit je einer kleinen Frage, Ziel ein Stempel- oder Kartenbild, keine Zahl. Aufwand mittel. Andocken: „Weltreise“, Lernreisen. Quelle: https://www.kinderzeitmaschine.de
12. **Eine Frage pro Bildschirm, wenig Text, große Antworten.** Rückmeldung höchstens zwei kurze Sätze, „Mehr erfahren“ freiwillig. Aufwand klein. Quelle: BBC Bitesize Primary https://www.bbc.co.uk/bitesize/primary

## Faire und unfaire Fallen auf Profi

- **Fair:** ähnliche Flaggen vom selben Kontinent, wenn danach der Unterschied erklärt wird; Nachbarländer bei eindeutigem Hinweis; bekannte Hauptstadt-Verwechslungen (Canberra/Sydney, Ankara/Istanbul, Bern/Zürich) mit Grund in der Rückmeldung.
- **Unfair:** zwei Antworten, die beide richtig sein können (mehrere Tiere in einem Land, im kleinen Bild ununterscheidbare Flaggen); Länder mit wechselnden Namen oder Grenzen ohne Hinweis; winzige Staaten und Inseln, die auf der Karte nicht sichtbar sind; Antworten, die nur über Muster (längste Antwort) zu finden sind.

## Vermeiden

- Strittige Gebiete (z. B. Kosovo, Taiwan, Palästina, Westsahara, Krim, Kaschmir) bleiben für die ersten 50 Länder draußen.
- Krieg und Konflikte nicht als Rätselthema, keine Nachrichten.
- Klischees („In Land X essen alle …“); „oft“, „typisch für“, „viele“ verwenden.
- Flaggen mit religiösen oder politischen Symbolen nur sachlich erklären.
- Grenzen auf Karten als vereinfacht kennzeichnen; Flaggen aus freien Quellen mit Nachweis.

## Abraten

1. Punkte, Serien, Herzen, Ranglisten oder Timer aus Seterra, GeoGuessr und Duolingo übernehmen (widerspricht den festen Regeln).
2. Experte nur als „mehr Länder“ oder kleinere Länder; dann lieber keine Experten-Stufe, bis echte Denkaufgaben da sind (Ideen 3 bis 6).
3. Alle 50 Länder auf einmal in jedes Spiel; besser eine kleine, sehr gut geprüfte Kern-Liste und je Spiel nur die Merkmale, die es braucht.

## Was Claude daraus macht

Wird beim Planen von PR 4 (Aufgabe 11) gegen E15 abgewogen und in der Entscheidungsliste Teil B festgehalten.
