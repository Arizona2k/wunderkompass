# CHANGELOG

Was sich geändert hat, in einfachen Worten. Neueste Einträge oben.
Der Verlauf vor dem 21.11.2026 steht im alten Stand: `git show b53f75f:CHANGELOG.md`.

## 23.11.2026 – Arbeitsweise: Helfer laufen, nichts geht verloren, zwei WebKit-Fehler behoben

Für Kinder ändert sich nichts Sichtbares. Wir arbeiten sauberer und schneller.

- **Alle Helfer laufen:** `/weiter` prüft beim Start, ob jeder Helfer da ist. Fehlt einer, wird er von Hand eingesetzt, und der Nutzer erfährt es. Nach jedem Fehler, der erst spät auffällt, prüft der Technik-Prüfer, wie man ihn früher findet.
- **Nichts geht verloren:** Wünsche, Regeln und Ideen kommen gleich ins Repository. Vor einem neuen Chat ist alles hochgeladen, und die Entscheidungen stehen in einer Liste ([Teilschritt 2](docs/entwurf/2026-11-23-phase-1-teilschritt-2-entscheidungen.md)).
- **Aufräumen gilt auch fürs Arbeiten:** Tests, Werkzeuge und Unterlagen, die bremsen, werden einfacher oder fallen weg.
- **Technik-Prüfung festgehalten** ([Bericht](docs/entwurf/2026-11-23-technik-pruefung.md)): Die große Prüfung in der CI soll von rund 102 auf rund 35 bis 38 Minuten schrumpfen. Das kommt als Erstes in Teilschritt 3.
- **Zwei alte WebKit-Fehler behoben** (Safari auf iPhone und iPad): Ohne Netz fragt die Seite nicht mehr unnötig nach einer neuen Version, und der Sicherungs-Test findet seine Teststimme auch in WebKit. Seitdem prüft jeder PR Pass und Offline zusätzlich in WebKit (`pnpm run test:browser:webkit`, etwa zwei Minuten mehr).

## 23.11.2026 – Teilschritt 2, Teil B: Karten, die zusammenpassen

Jede Karte hat jetzt einen echten Nachbarn. Zwölf Karten sind schon ganz im neuen Stil, mit kleinen Häppchen und mehr zum Knobeln.

- **Jede Karte hat einen Nachbarn:** 30 neue Verbindungen für die 35 Karten, die noch keine hatten. Unter „Dazu passt“ steht immer, warum zwei Karten zusammengehören. Alle 226 Sätze wurden für Kinder durchgesehen und auf Tatsachen geprüft. Fünf schwache Verbindungen stehen zum Ersetzen im BACKLOG.
- **Karten aufgeräumt:** Was im Steckbrief steht, kommt nicht noch einmal im Text. „Schon gewusst?“ verrät nur noch Neues. Fragen sagen nicht mehr „wie im Text steht“. Viele Sätze für Erwachsene sind aus dem Kinderteil verschwunden. Bei den Karten über Krieg, Völkermord und Anschläge steht bewusst keine Überraschungs-Tatsache mehr.
- **Zwölf Karten im neuen Stil** (Elefant, Eisbär, Krake, Steinwerkzeuge, Apollo 11, Marie Curie, Jane Goodall, Pyramiden von Gizeh, Eiffelturm, Wasserkreislauf, Mondphasen, Fahrrad): „Kurz erklärt“ besteht aus kleinen Häppchen mit je einer Frage als Überschrift. Bei „Stimmt das?“ entscheidet man, ob ein Satz stimmt. Nach einer richtigen Antwort gibt es „Noch eine Frage“. Der längere Text steht unter „Für Große“.
- **Alte Antworten bleiben:** Wurde eine Frage neu geschrieben, bleibt die gespeicherte Antwort gewählt und richtig. Gibt es eine Antwort gar nicht mehr, sagt die Karte: „Hier gibt es neue Antworten. Früher hast du … gewählt.“ Pass-Einträge gehen nicht verloren.
- **Weiterdenken, wo man war:** Wer auf einer Karte mit mehreren Fragen falsch geraten hat und später zurückkommt (aus dem Wissensbuch, von einer Nachbarkarte oder nach dem Neuladen), bekommt wieder dieselbe Frage und keine neue.
- **Besser lesbar:** Getippte Antworten bleiben gut lesbar und werden nicht blass. Zeichnungen in „Dazu passt“ sind kompakt. Die Mondzeichnung oben auf der Karte ist am Handy kleiner. „Noch einmal raten“ hat jetzt die richtige Schriftgröße. Bei Marie Curie, Jane Goodall und dem Fahrrad steht „Ganz einfach“ jetzt oben in „Ausprobieren“.
- **„Was ist neu?“** hat einen neuen Eintrag.
- **Geprüft:** ganze Prüfkette, die große Prüfung in Chromium (alle 32 Teile grün; fünf davon nach Korrekturen noch einmal einzeln, nach der letzten Korrektur auch `core` und `offline-resilience`). Alle neuen Sätze von der Kinder-Redaktion und auf Tatsachen geprüft, die zwölf Pilot-Karten zweimal auf Bildern in fünf Breiten, dazu eine Code-Prüfung und eine Schlussprüfung durch einen frischen Prüfer auf dem stärksten Modell. Was dort gefunden und nicht gleich behoben wurde, steht mit Grund im BACKLOG (Punkt 23). Firefox und WebKit prüft die Vollprüfung in der CI.

## 22.11.2026 – Teilschritt 2, Teil A: Die neue Wissenskarte

Jede Wissenskarte ist neu gebaut: erst raten, dann kurz lesen, dann selbst ausprobieren. Die alte Karte ist weg. Ihre Links, Antworten und Pass-Einträge bleiben.

- **Oben auf der Karte:** großes Bild mit Bildnachweis, der Titel und gleich eine Frage: „Rate mal!“. Wer falsch rät, bekommt einen Hinweis und kann „Noch einmal raten“.
- **Kurz erklärt und Steckbrief:** ein paar kurze Sätze und die wichtigsten Zahlen auf einen Blick. Was nur Eltern brauchen (Lernziel, Quellen, Datum der Prüfung), steht zugeklappt unter „Für Erwachsene: Quellen und Lernziele“.
- **Ausprobieren:** Messen, Modelle, Zeichnungen und Belege stehen in einem Bereich, der erst beim Öffnen lädt. So ist die Karte schneller da. Bricht das Netz dabei ab, gibt es „Noch einmal versuchen“, ohne dass die Seite neu lädt.
- **Mehr erfahren:** die längeren Texte, weitere Verbindungen und Orte auf der Karte, freiwillig zum Aufklappen.
- **Dazu passt:** unten auf jeder Karte höchstens drei große Kacheln: eine echte Nachbarkarte mit dem Grund, warum sie passt, der Ort auf dem Globus und eine Reise, ein Labor oder das Spiel der Welt. Nach „Zurück“ steht man wieder bei der Kachel, auch in Safari.
- **Klarer Rückweg:** statt der langen Sprungleiste ein Link „← Zurück“. Wer direkt auf eine Karte kam, bekommt einen Link zu ihrer Welt, zum Beispiel „← Die Tierwelt“.
- **Lernreisen einfach zuerst:** Jedes Kapitel beginnt mit ein paar kurzen Sätzen, einer Tatsache und einem Beobachtungsauftrag. Der lange Text steht unter „Für Große“, der Satz für Eltern unter „Für Erwachsene“. „Kapitel vorlesen“ liest, was offen steht.
- **Am Handy:** lange Wörter (etwa bei Grace Hopper) schieben die Seite nicht mehr zur Seite. Beschriftungen in Zeichnungen sind am kleinen Handy mindestens 16 Pixel groß. Vier Erfindungs-Zeichnungen haben noch winzige Schrift; das steht im BACKLOG.
- **Leichter zu bedienen:** Jeder Bereich zum Aufklappen hat rechts einen Pfeil, der sich beim Öffnen dreht. „Größere Schrift“ im Entdeckerpass macht die Frage und die ersten Sätze jetzt wirklich größer. Knöpfe und Aufklapper sind mindestens 48 Pixel hoch, die Buchstaben A, B, C bei den Antworten größer und dunkler.
- **„Was ist neu?“** hat zwei neue Einträge.
- **Hinter den Kulissen:** Die Tempo-Prüfung läuft jetzt in jeder Prüfung mit. Tests warten vor einem Seitenwechsel kurz, bis die Bilder geladen sind. Ein neuer Helfer prüft technische Themen. Die Startdateien sind nicht größer geworden.
- **Geprüft:** ganze Prüfkette, die große Prüfung in Chromium (alle 31 Teile grün), Karte und Lernreise auch in Firefox und WebKit. Eine Schlussprüfung des ganzen Umbaus (mit einem anderen Modell als geplant, darum eine Teilprüfung) und eine Prüfung der Gestaltung auf Bildern; was dort gefunden und nicht gleich behoben wurde, steht im BACKLOG (Punkt 20).
- **Entdeckerpass repariert:** Wer sehr viel entdeckt hatte (mehr als 256 Karten, Spiele, Reisen und Labore), verlor beim Laden die zuletzt angefangenen Spielstände. Den Fehler gab es schon vorher. Jetzt bleiben alle erhalten, auch beim Sichern, Wiederherstellen und Neuladen.

## 21.11.2026 – Teilschritt 2, Schritt 0: Prüfungen in drei Browsern repariert

Für Kinder ändert sich fast nichts. Es geht vor allem um die Prüfungen vor dem Umbau der Wissenskarte.

- **Drei neue Fehler der großen Prüfung geklärt:** Keiner lag an der Seite selbst. Ein Chromium-Test wechselte die Seite, während noch Bilder luden; er wartet jetzt. Ein Firefox-Test stürzte wegen eines Fehlers im Testwerkzeug Playwright ab; er umgeht ihn. In WebKit (Safari) sprang ein Buch-Test so schnell zwischen Seiten hin und her, dass Safari weitere Sprünge sperrte. Ein Kind kommt nie so schnell. Der Test bremst jetzt in Safari, und die Sperre zählt künftig als Fehler.
- **Alter Safari-Fehler mitbehoben:** `engine-journeys` scheiterte in WebKit schon vor Teilschritt 1, aus demselben Grund.
- **Wissensbuch am Handy:** Beim Drehen des Handys meldete Safari einen Fehler in der Leiste oben im Buch, am Rechner Chrome beim Ziehen des Fensters. Die Leiste misst jetzt ihren Rahmen statt sich selbst und rückt den gewählten Bereich danach wieder ganz ins Bild. Neue Tests drehen das Handy hin und her und ziehen das Fenster schmal und breit.
- **Startfrage am kleinen Handy:** Mit großer Schrift ragte eine Startfrage mit langem Wort („Radioaufzeichnung“) am kleinen Handy ein paar Pixel über den Rand, und die Seite ließ sich seitlich schieben. Die große Schrift ist dort jetzt etwas kleiner (31 statt 34 Pixel, normal sind 27). Ist ein Wort doch einmal zu lang, bricht es um, statt die Seite zu verschieben. Ein Test prüft jetzt alle 56 Startfragen, nicht nur die, die der Zufall gerade zeigt.
- **Drei weitere Testfehler in Chrome:** Drei Tests luden die Seite neu, während noch Bilder oder Programmteile nachluden. Der langsame Prüfrechner brach sie ab, und das zählte als Fehler. Die Tests warten jetzt vorher. Scheitert so ein Test künftig, nennt er den genauen Fehler.
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
