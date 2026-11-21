# CHANGELOG

Was sich geändert hat, in einfachen Worten. Neueste Einträge oben.
Der Verlauf vor dem 21.11.2026 steht im alten Stand: `git show b53f75f:CHANGELOG.md`.

## 21.11.2026 – Teilschritt 2, Schritt 0: Prüfungen in drei Browsern repariert

Für Kinder ändert sich fast nichts. Es geht vor allem um die Prüfungen vor dem Umbau der Wissenskarte.

- **Drei neue Fehler der großen Prüfung geklärt:** Keiner lag an der Seite selbst. Ein Chromium-Test wechselte die Seite, während noch Bilder luden; er wartet jetzt. Ein Firefox-Test stürzte wegen eines Fehlers im Testwerkzeug Playwright ab; er umgeht ihn. In WebKit (Safari) sprang ein Buch-Test so schnell zwischen Seiten hin und her, dass Safari weitere Sprünge sperrte. Ein Kind kommt nie so schnell. Der Test bremst jetzt in Safari, und die Sperre zählt künftig als Fehler.
- **Alter Safari-Fehler mitbehoben:** `engine-journeys` scheiterte in WebKit schon vor Teilschritt 1, aus demselben Grund.
- **Wissensbuch am Handy:** Beim Drehen des Handys meldete Safari einen Fehler in der Leiste oben im Buch, am Rechner Chrome beim Ziehen des Fensters. Die Leiste misst jetzt ihren Rahmen statt sich selbst und rückt den gewählten Bereich danach wieder ganz ins Bild. Neue Tests drehen das Handy hin und her und ziehen das Fenster schmal und breit.
- **Vorbereitung:** Größe der Startdateien gemessen (Obergrenze für den Umbau). Für die 58 Karten von Zeitreise und Erfindungen gibt es eine Liste freier Bildkandidaten mit Lizenz und Urheber; eingebaut wird später.

## 21.11.2026 – Phase 1, Teilschritt 1 „Aussehen und Hülle“

Die Seite bekommt ihre neue Grundlage. Startseite, Wissenskarte und Weltenseiten werden in den nächsten Teilschritten neu gebaut; hier bekommen sie nur Schrift, Farben und nötige Korrekturen.

- **Neue Schrift und Farben:** Nunito (rund, gut lesbar, freie Lizenz, offline dabei), helle Flächen mit Orange und Petrol. Auch Buchstaben wie in „Białowieża“ kommen jetzt aus einer Schrift.
- **Eine Leiste für alles:** Start, Welten, Spielen, Labor, Reisen, Buch. Am Handy steht sie unten, ab dem Tablet oben. Früher schnitt die Leiste am Handy Wörter ab.
- **Ruhiger Kopf:** nur noch Name, Suche und Entdeckerpass. Der Punkte-Zähler am Pass-Knopf ist weg.
- **Neuer Fuß:** „Was ist neu?“, „Für Eltern“ und der Kasten für das Offline-Lernen.
- **„Was ist neu?“ für Kinder:** kurze Einträge mit Symbol, neueste oben. Die alte Chronik steht in Kindersprache unter „Früher“ (Texte von Kinder-Redaktion und Faktenprüfer geprüft).
- **Kein großer Rahmen mehr** nach einem Seitenwechsel. Wer mit der Tastatur arbeitet, sieht den Fokus weiter deutlich.
- **Kleine Korrekturen aus der Design-Prüfung:** Das Suchfeld bleibt bei großer Schrift am kleinen Handy ganz sichtbar. Beispieltexte in Suchfeldern passen in die Felder. „So geht’s“ steht auf der Startseite in jeder Breite. Weitere Befunde stehen mit Grund im BACKLOG (Punkt 15).
- **Korrekturen aus der Schlussprüfung:** Auf dem iPhone bleibt die Lesestelle erhalten, wenn ein Kind unten in der Leiste oder im Fuß tippt und dann „Zurück“ geht (vorher sprang die Seite nach oben). Auf „Was ist neu?“ werden Wörter nicht mehr mitten durchgeschnitten, auch nicht bei großer Schrift. Beim Öffnen eines Bereichs springt die Seite nicht mehr: Vorher stand der Fuß kurz mitten im Bild und wurde dann weggeschoben. Kleinere Befunde stehen im BACKLOG (Punkt 16).
- **Hinter den Kulissen:** Tests öffnen Bereiche über einen eigenen Helfer statt über die alte Leiste. Viele alte Stilregeln sind gelöscht; die Startdateien sind kleiner als vorher. Zeichnungen behalten vorerst ihre bisherige Schrift, damit keine Beschriftung aus dem Bild rutscht.
- **Geprüft in drei Browsern:** Die Vollprüfung in der CI lief zum ersten Mal auch in Firefox und WebKit (Safari). Dabei fiel auf: Kam man aus einer Karte ins Wissensbuch zurück, sprang am Handy die Leiste oben im Buch einmal um, und Safari meldete das als Fehler. Das ist behoben. Ein Firefox-Test lud die Seite neu, während noch ein Bild lud; er wartet jetzt. Drei WebKit-Fehler gab es schon vorher; sie stehen im BACKLOG und kommen vor der nächsten Veröffentlichung für Freunde dran.
- **Werkzeug:** Das Browser-Testwerkzeug Playwright ist auf 1.65.1 (neueste Version, mindestens 7 Tage alt) und bleibt künftig immer aktuell. Chromium, Firefox und WebKit laufen jetzt auch im Arbeits-Container.

## 21.11.2026 – Alter Katalog „WunderKompass 2027“ eingeordnet

An der Seite selbst ändert sich nichts. Es geht um die Pläne.

- **Geprüft:** der Anforderungskatalog aus der ChatGPT-Zeit (jetzt in `docs/archiv/`). Die Einordnung mit Gründen steht in `docs/entwurf/2026-11-21-katalog-2027-einordnung.md`.
- **Übernommen:** einheitliches Design mit Tastaturbedienung, Mitmachen mit echtem Lernnutzen, Verknüpfung und Rückwege, hohe Qualität mit echtem Ansehen statt nur Tests.
- **Kein Bestandsschutz** (Wunsch des Nutzers): Was nicht gut ist, wird geändert oder gestrichen, auch wenn es es schon gibt. Erhalten bleiben nur der Fortschritt der Kinder im Pass und ihre Links.
- **Angepasst:** Inhalte kurz zuerst, mit drei Tiefen bis „Für Große“. 3D nur, wo es etwas erklärt, immer mit 2D-Fassung. Der Globus wird in Phase 4 das Herzstück. Neue Themen wie Körper, Geld oder Religionen ziehen Welt für Welt ein, mit Sorgfaltsregeln.
- **Nicht übernommen:** Spline (Logo im kostenlosen Plan), die alte Paket-Reihenfolge, Nachweis-Dateien, Inhalte von einer KI, Tagespolitik.
- **Audit V2 nachgeprüft:** 18 von 19 alten Befunden sind behoben. Offen sind vor allem rohe Sprachkürzel in Länderansichten (BACKLOG).

## 21.11.2026 – Neuausrichtung, Schritt 0 „Großputz & Arbeitsweise“

Claude entwickelt WunderKompass ab jetzt weiter. Für Kinder sieht die Seite noch genauso aus wie vorher.

- **Weniger Ballast:** Prüfberichte, Vergleichsdateien, Release-Sperren und alte Datenbank- und Sites-Reste sind entfernt. Das Repository ist deutlich kleiner: 1021 statt 1284 Dateien, 42,2 statt 73,9 MB.
- **Schnellere Prüfung:** Ein Befehl (`pnpm run check`) prüft Typen, Code, Unit-Tests, Build und die wichtigsten Browserwege. Die große Prüfung in drei Browsern läuft am Ende einer Phase.
- **Was weiter geschützt ist:** Entdeckerpass und gespeicherte Antworten; die IDs von Karten, Kapiteln, Spielen, Laboren, Missionen und Reisen, die meisten Fragen-IDs und alte Links (Orts-IDs und zwei Fragenbanken kommen noch dazu, siehe BACKLOG); Bilder mit Nachweis; Offline-Betrieb.
- **Einmal „Neue Version laden“:** Wer die Seite offline vorbereitet hat, sieht einmal den Knopf „Neue Version laden“. Pass und Favoriten bleiben dabei erhalten (im Test geprüft).
- **Geprüft (Chromium):** `pnpm run check` grün, große Prüfung 28 von 28 Suiten grün. Der neue Build gleicht dem alten bis auf die Versionskennung. Firefox und WebKit prüft die CI vor der nächsten Veröffentlichung für Freunde.
- **Neue kurze Unterlagen:** `CLAUDE.md`, `STATUS.md`, `VISION.md`, `BACKLOG.md`. Die Originalaufträge liegen in `docs/archiv/`.
- **Helfer:** sechs Prüf-Helfer für Kindertexte, Fakten, Design, Code, Bildrechte und Ideen; Kurzbefehle `/weiter` und `/pruefen`.
