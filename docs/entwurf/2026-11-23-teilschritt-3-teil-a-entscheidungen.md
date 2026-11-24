# Teilschritt 3, Teil A „Eine Stufe für alles“ – Entscheidungen beim Bauen

Stand: 23.11.2026. Grundlage: [Entwurf und Plan](2026-11-23-phase-1-teilschritt-3.md) (freigegeben, D1 bis D5 „wie empfohlen“).
Hier stehen die Entscheidungen, die Claude beim Bauen getroffen hat, jeweils mit Grund und dem, was es kostet, falls sie falsch sind.
Der Nutzer kann jede davon bei der Freigabe von Teil A ändern.

## Aufgabe 1: Stufe im Pass

- Ein kaputter Stufen-Eintrag zählt wie ein fehlender: Mit der alten Quiz-Stufe „Knifflig“ startet das Kind auf Profi, sonst auf Entdecker. Der Plan nannte für den Normalfall „Entdecker“; die alte Einstellung ist die bessere Auskunft. Falls falsch: Ein Kind mit „Knifflig“ und kaputtem Eintrag startet auf Profi; „Zurück zu Entdecker“ ist da.
- Dieselbe Stufe noch einmal wählen schreibt nichts (kein unnötiges Speichern).
- Muss der Pass beim Laden gekürzt werden (mehr als 2000 Spielstände), bleiben Kern-Einträge (`kern:stufe`) erhalten. Vorher wäre die Stufe dann verloren gegangen (Test mit 2000 Spielständen war rot).

## Aufgabe 2: Stufenwahl

- Das alte Quiz folgt schon jetzt der gemeinsamen Stufe (Entdecker spielt „Normal“, Profi und Experte „Knifflig“), weil seine eigene Wahl im Pass entfällt. „Einfach“ (zwei Antworten) gibt es im Quiz nicht mehr. Vorgezogen aus Aufgabe 9.
- Kein Schließen der Stufenknöpfe mit Escape: Das Pass-Fenster fängt Escape vorher ab und schlösse sich ganz. „Ändern“ öffnet und schließt.
- „Für Erwachsene“ auf der Pass-Seite sagt ehrlich, dass die Stufe zuerst für Karten und Quiz gilt und Spiele, Labore und Reisen folgen.

## Aufgabe 3: Vorschläge

- Nach einem gezeigten Vorschlag beginnt die Folge neu; ein Stufenwechsel leert sie. Sonst käme nach „Nein, ich bleibe“ gleich wieder einer.
- Der sichtbare Hinweis kam mit der Karte in Aufgabe 5 (erst dort gibt es einen Ort und einen ehrlichen Browser-Test).

## Aufgabe 4: Gemeinsame Wörter

- Rückmeldung überall „Richtig!“ und „Noch nicht ganz. Versuch es noch einmal!“, Hilfen heißen „Tipp“ („Brauchst du einen Tipp?“, „Noch ein Tipp“, „Zweiter Tipp“, „Tipp vorlesen“). Die Wörter stehen an einer Stelle (`app/kern/woerter.ts`).
- Ausnahme mit Absicht: Quiz und „Stimmt das wirklich?“ haben keinen zweiten Versuch; dort heißt es bei falsch „Nicht ganz. Hier ist die Erklärung:“ bzw. „Nicht ganz. So ist es:“.
- Neuer Name der „Wissens-Challenge“: „Kreuz und quer“ (Empfehlung der `kinder-redaktion`). Eingesetzt wird er laut Plan in Aufgabe 9 mit dem Umbau des Spiels.
- „Was das Bild nicht zeigt“ statt „Modellgrenzen“ im Erfinder-Weg; die zwölf Texte in der vom `fakten-pruefer` korrigierten Fassung (u. a. Lochkamera: sicheres Projizieren erlaubt, nie durch das Loch in die Sonne schauen; Generator: Magnet und Spule gegeneinander).
- Erfindungsfragen „Bei welchem Problem half …?“ (vom `fakten-pruefer` geprüft, auch beim Kompass).
- „Noch einmal raten“ zählt keine neue Wiederholung, außer die Frage ist wirklich fällig. Richtig nach falsch nimmt die Frage aus „Ein Gedanke zum Wiederholen“; am nächsten Tag ist sie wieder dran (K7).
- Verschoben: das Wissensbuch (Teilschritt 4), Wörter in den Daten der Labore und Reisen (Aufgabe 16).
- Der Browser-Runner setzt UTF-8, wenn der Container keine Spracheinstellung hat; sonst kam ein Testpass mit „ü“ im Dateinamen nicht an (alter Fehler der Testumgebung).

## Aufgabe 5: Karte mit Stufen

- Inhalte: Entwurf (`stufen-pruefer`), Sprachprüfung (`kinder-redaktion`), Faktencheck (`fakten-pruefer`), Endfassung (`karten-autor`), Endprüfung (`stufen-pruefer`, `fakten-pruefer`); alle Berichte in `docs/entwurf/2026-11-23-karte-stufen-*.md`.
- **IDs und gespeicherte Antworten:** Der erste Entwurf hatte bei 27 bestehenden Fragen gespeicherte Antworten verändert und drei Fragen ganz neu unter alter ID geschrieben. Entschieden: Ganz andere Fragen bekommen neue IDs (`science-water-cycle-5`, `science-moon-phases-5`, `science-seasons-5`, `person-jane_goodall:rate-4`); die alten ruhen (`ruht: true`, bleiben in den Daten, erscheinen nicht mehr). Die acht geschützten Wasser- und Fotosynthese-Fragen behalten Frage, Erklärung und alte Antworten. Umformulierte Challenge-Fragen: Die Liste früherer Fassungen kennt ihre ganze alte Frage, eine angefangene Runde endet mit der Frage von damals. Drei ersetzte falsche Antworten (Curie, Eiffelturm): Die Karte zeigt „Hier gibt es neue Antworten“.
- **Testregeln angepasst** (jede mit Grund im Test): Tipps ab 20 statt 45 Zeichen (kindgerecht kurz); Experte-Fragen bis 30 Wörter und Erklärung bis 3 Sätze (Denkweg); Pilot-Karten 2 bis 4 sichtbare Zusatzfragen; Ratemuster-Grenzen statt „nie die längste“; der Wasser-und-Fotosynthese-Test prüft Reihenfolgen für vier Antworten.
- **Nicht übernommen** (BACKLOG): Vorschläge, die gespeicherte Antworten ändern (Liste „Bestehend, nur mit Alias änderbar“ der `kinder-redaktion`, zwei Quatsch-Antworten auf Profi, Merian-Antwort); „Fast richtig“ bei Gizeh (neue Behauptung, mit den Bauwerken); neuer Tipp für `history-apollo11:mini`.
- Auf Entdecker zeigen Elefant und Eisbär nur ihre Hauptfrage (alle Zusatzfragen sind Profi oder Experte). Tests mit Elefanten-Zusatzfragen stellen dafür die Stufe auf Profi.
- Die Stufenwahl steht im Kopf von „Rate mal!“ statt in einem eigenen Kasten (Höhenbudget der Elefantenkarte am Handy).

- Challenge-Fragen ohne Einstufung gelten auf der Karte als Profi (Entdecker sehen sie nicht).
- Gibt es die gewählte Stufe auf einer Karte nicht, sagt ein Satz, welche Stufe das Kind spielt, auch für Profi („Profi gibt es hier noch nicht. Du spielst Entdecker.“). E3 nannte nur Experte; auf 192 Karten gibt es bisher nur die Hauptfrage.
- Eine gespeicherte Antwortreihe, die nicht mehr passt (z. B. nach einer vierten Antwort), wird beim Öffnen neu gemischt statt in der Reihenfolge der Daten gezeigt (dort stand die Lösung oft vorn).
- Eine Challenge-Frage darf mehrere frühere Antwortsätze haben; jede alte Runde zeigt ihre eigenen Antworten weiter, solange Frage, Lösung und Erklärung gleich bleiben.
- Pflicht aus BACKLOG 23 erfüllt: feste Liste aller gespeicherten Antworten (`tests/fixtures/gespeicherte-antworten.json`) und Test „gleich oder Alias vorhanden“.
- „Ordne richtig“ (Steinwerkzeuge) wird ein eigener kleiner Abschnitt ab Experte, nicht Teil des Fragenkreislaufs.

- **Alte Antwortreihe im Pass bleibt** (Nachtrag aus der großen Prüfung von Aufgabe 5): Passt eine gespeicherte Reihenfolge nicht mehr (z. B. nach einer vierten Antwort), zeigt die Karte eine feste Mischung je Frage (`festGemischt`) und schreibt nichts in den Pass. Die erste Fassung hatte neu gemischt und gespeichert; der Schutztest „interpretation never overwrites original import evidence“ war dadurch rot. Falls falsch: Alle Kinder mit so einer alten Reihe sehen dieselbe Mischung, nicht jedes eine eigene. Genau genommen (Code-Prüfung Teil A, Befund 6): Der Schutz greift, wenn die alte Reihe eine nicht leere Liste aus Texten ist, und das ist sie bei allen Reihen, die die Seite je gespeichert hat. Bei einer kaputten Reihe (leere Liste, Zahlen) legt das Speichern beim Öffnen (`app/saved-games.tsx`) wie schon vor Teil A eine neue Mischung an.
- Öffnet ein Kind eine Karte mit Challenge-Fragen, nachdem es die Hauptfrage beantwortet hat, merkt sich die Karte die Antwortreihe der nächsten Frage (neuer Schlüssel im Kartenstand). Alte Einträge bleiben unverändert; der Test „existing round retained“ prüft das jetzt je Eintrag statt „nichts Neues“.

## Aufgabe 6: „Ganz einfach“ offen

- Karten ohne Häppchen zeigen „Ganz einfach“ offen und ohne Altersangabe, die Absätze zugeklappt unter „Für Große“ (wie geplant).
- **Abweichung vom Plan bei Personenkarten (36):** Dort ist der Satz meist die Anleitung zum Versuch („Vergleiche zwei erfundene Messbefunde …“), keine Erklärung. Er steht darum oben in „Ausprobieren“ (wie schon bei den Pilot-Karten mit Häppchen), und die Absätze bleiben offen in „Kurz erklärt“. Echte leichte Sätze für Personen kommen mit der Personenwelt (BACKLOG 24). Falls falsch: Personenkarten bleiben vorerst lang offen.
- **67 Karten bekommen „Ganz einfach“ neu** (Vorlage PR #27, neu geschrieben von der `kinder-redaktion`, geprüft vom `fakten-pruefer`). Die sechs Karten mit Häppchen aus der Vorlage (Steinwerkzeuge, Apollo 11, Pyramiden von Gizeh, Eiffelturm, Wasserkreislauf, Mondphasen) bekommen keinen Satz: Die Häppchen sind dort die einfache Fassung.
- Nur „Ganz einfach“ wird übernommen. „Selbst beobachten“ und Lernziel aus PR #27 sind ungeprüft und oft Erwachsenensprache; sie bleiben im Entwurf. Beide Felder sind deshalb freiwillig (Typ und Testhilfe `lesetexte`).
- **24 Tierkarten:** Einleitung und „Ganz einfach“ waren derselbe Satz, ein Lehrsatz für Erwachsene („Artwissen benötigt …“). Beide sind neu (Vorschlag der `kinder-redaktion`, Faktencheck). Die Inhaltsregel „Ganz einfach steht nicht in der Einleitung“ gilt jetzt ohne Ausnahmeliste.
- Heikle Karten: Der Satz nennt das Leid ehrlich und ohne Einzelheiten (Weltkriege: die Toten; 1492: das Leid der Menschen vor Ort; Mauerbau: der Zweck; Holocaust: Ausgrenzung, Verfolgung und Mord an Millionen, der Grund war Hass; nach der Nachprüfung nennt der Satz den Mord ausdrücklich).
- „Was ist neu?“: zwei Einträge („Drei Stufen: Entdecker, Profi, Experte“, „Erst ein leichter Satz“).
- **Endprüfung der Sätze:** Der `fakten-pruefer` fand keine falsche Zahl, aber 20 Sätze, die zu stark verkürzten (z. B. Buchdruck: „vorher alles mit der Hand“, obwohl in China und Korea schon gedruckt wurde; Fliegen: „Luft strömt vorbei und hebt“; Bestäubung: als ob alle Pflanzen Tiere bräuchten). Alle übernommen, dazu vier Vorschläge der `kinder-redaktion`; danach Nachprüfung durch beide (`2026-11-23-ganz-einfach-nachpruefung-*.md`). Beim Holocaust nennt der Satz jetzt auch den Mord („Millionen von ihnen wurden ermordet“), weil er für sich allein stimmen soll.

## Code-Prüfung Teil A (Bericht `2026-11-23-teil-a-code-pruefung.md`)

- **1 Vorschläge:** Es zählen nur Antworten auf Fragen genau der gewählten Stufe. Leichtere Fragen (auf Profi oft die Entdecker-Hauptfrage) lassen die Folge, wie sie ist. Sonst bekäme ein Profi-Kind nach drei Entdecker-Fragen „Willst du Experte probieren?“. Unit-Test und Browser-Test mit zwei echten Profi-Fragen.
- **2 Fokus nach Stufenwechsel:** Nach dem Umstellen (Wahl, „Zurück zu Entdecker“, „Ja“ im Vorschlag) steht der Fokus auf „Ändern“ der neuen Stufenwahl; nach „Nein, ich bleibe“ auf „Rate mal!“. Fokus-Prüfungen im Browser-Test `karte-stufen`.
- **3 HEAD rot:** mit dem Katalog-Einbau erledigt.
- **4 Antwortlisten wachsen nur:** Zweite datierte Liste `tests/fixtures/gespeicherte-antworten-teil-a.json` (287 Fragen: Hauptfragen, Zusatzfragen, Challenge-Fragen auf der Karte), erzeugt mit `scripts/antworten-stand.mjs`. **Vor dem Merge nach test-live neu erzeugen, falls sich bis dahin Antworten ändern; danach nie mehr ändern.** Jeder spätere Schritt mit neuen Antworten legt eine eigene Liste an.
- **5 Alte Challenge-Runden:** Eine Runde mit der ganzen früheren Frage zeigt keine Tipps mehr, weil die heutigen Tipps zur neuen Fassung gehören. Solche Runden sind selten und enden nach sechs Aufgaben. Falls falsch: Einzelne Kinder sehen in einer alten Runde einmal keinen Tipp.
- **6 Feste Mischung:** Entscheidung bei Aufgabe 5 enger gefasst (siehe dort).
- **7 Kommentare:** berichtigt (`ordne-richtig.tsx`, `karte-stufen.test.mjs`).
- **8 „Ordne richtig“:** Nach dem Verschieben bleibt der Fokus beim selben Teil (ganz oben oder unten auf dem anderen Pfeil), und ein unsichtbarer Satz sagt „‚…‘ steht jetzt an Platz N.“ an. Browser-Test prüft beides.
- **9 Spielstand-Prüfung im Wörterbuch-Test:** Neue Schlüssel nur mit den erwarteten Präfixen (`items:`, `topicAnswer:`, `claimWort:`, `ordnen:`).
- **10 Nachbarländer-Spiel:** Der Satz nutzt jetzt `WOERTER.nochNicht` („Noch nicht ganz. Versuch es noch einmal! Spanien hat keine gemeinsame Grenze mit Deutschland.“ statt umgekehrt).
- **Dazu:** Regel in `kartenFeldFehler`: Lernhilfen brauchen „Ganz einfach“; „Selbst beobachten“ und Lernziel sind freiwillig, aber nicht leer.
- **Später Fund in der großen Prüfung:** Die Gezeiten-Prüfung im Wörterbuch-Test suchte einen Absatz, der jetzt unter „Für Große“ liegt. Sie klappt „Für Große“ jetzt erst auf und prüft dann sichtbar (nicht abgeschwächt). Die Fotosynthese-Zeichnung steht offen unter dem Satz.

## Code-Nachprüfung Teil A (Bericht `2026-11-23-teil-a-code-nachpruefung.md`)

Alle zehn Befunde bestätigt behoben. Neue Befunde, alle umgesetzt:

- **M1 Challenge-Runden:** Die Teil-A-Liste prüft jetzt auch, dass eine angefangene Runde der Wissens-Challenge mit den Antworten von Teil A weiterläuft (Hauptfragen als `<karte>:mini`, Challenge-Fragen unter ihrer ID; heikle Karten sind nicht im Challenge). Gegenprobe: Eine zusätzliche Antwort bei einer Haupt- oder Challenge-Frage macht den Test rot.
- **N1:** Der Tipp-Test verlangt, dass eine Runde mit den heutigen Antworten lesbar ist, statt still zu überspringen.
- **N2:** Der Browser-Test schiebt bei „Ordne richtig“ einmal nach unten (dabei verschiebt React das fokussierte Teil selbst) und prüft Fokus und Ansage.
- **N3:** Beispiel in Punkt 10 berichtigt (Frankreich ist Nachbarland).

## Später Fund im Nachlauf (`full-a7`, `core` bei 320 px)

- **Befund:** „„Mehr erfahren“ is open again after returning from the route“ war rot (Mondkarte, Lernroute, Zurück). Einzeln und unter vierfacher bis sechsfacher CPU-Bremse grün.
- **Ursache:** Die Seite stellt offene Bereiche und den Fokus mit Absicht erst im nächsten Bild wieder her (`scheduleRouteRestore` in `app/hash-route.ts`). Unter echter Last (drei Suiten gleichzeitig) kommt dieses Bild spät. Der Test prüfte sofort, wenn die Karte erschien. Nachgestellt mit künstlich um 150 ms verzögertem `requestAnimationFrame`: sofort zu, 150 ms später offen, Fokus wieder auf dem Routen-Knopf (sechs von sechs Runden). Kein Fehler der Seite und keiner von Teil A.
- **Korrektur:** Der Test wartet wie `journeys.mjs`, `people-fourteen-connected-routes.mjs` und `discovery-central.mjs` erst auf den Fokus am Routen-Knopf und prüft dann (strenger als vorher: Fokus und offener Bereich). Mit verzögertem Bild sechs von sechs grün.
- **Nachprüfung** durch den `technik-pruefer` ([Bericht](2026-11-23-teil-a-technik-pruefung-core-fund.md)): Analyse bestätigt, keine weiteren Stellen mit diesem Muster. `core` läuft nur in Chromium und nur in der Vollprüfung. Umgesetzt: Der Weg „Mehr erfahren offen, Lernroute, Zurück“ steht jetzt zusätzlich als kurzer Schritt im CI-Satz (`wissenskarte.mjs`, `mehrErfahrenNachRouteOffen`, 390 und 1440 px, per Tastatur geöffnet). Er läuft damit bei jedem PR, in der Engine-Schnellprüfung auch in Firefox und WebKit. `core` behält seine Prüfung. Keine neue Regel (der Fund kam von Last, nicht von einer Kartenänderung).

## Zweiter später Fund im Nachlauf (`full-a7`, `offline-cold-full`)

- **Befund:** „cold offline duplicate alias order also displays all three canonical choices“ war rot. Erwartet: die Antworten des Seeadlers in der Reihenfolge der Daten. Angezeigt: `Höhe, Länge, Abstand`.
- **Ursache:** Mit Aufgabe 6 (Commit `e95756f`) zeigt die Karte bei einer kaputten gespeicherten Reihe die feste Mischung je Frage (`festGemischt` in `app/kern/karte/karten-daten.ts`), nicht mehr die Reihenfolge der Daten (dort stand die Lösung oft vorn). Den Online-Fall in `tests/browser/retained-answer-wording.mjs` hatte ich angepasst, die Offline-Fassung in derselben Datei (eine lange Zeile, nur in `offline-cold-full`, nur Vollprüfung) nicht. `festGemischt` für diese Frage ergibt genau die angezeigte Reihenfolge. Kein Fehler der Seite; der Test erwartete das alte Verhalten.
- **Korrektur:** Beide Fälle erwarten jetzt genau `festGemischt(HAUPT)` (strenger als vorher: Der Online-Fall prüfte nur, dass alle drei Antworten da sind). Der Online-Fall steht im CI-Satz (`retained-answer-wording`) und läuft damit bei jedem PR, auch in Firefox und WebKit.
- **Lehre:** Bei einer Verhaltensänderung nicht nur nach Testtexten suchen, sondern nach allen Tests, die die betroffene Funktion auslösen (hier: jede gespeicherte, ungültige `items`-Reihe). `technik-pruefer` beauftragt.
- **Nachprüfung** durch den `technik-pruefer` ([Bericht](2026-11-24-teil-a-technik-pruefung-offline-fund.md)): Analyse bestätigt, keine weiteren Tests mit altem Verhalten. Umgesetzt: (1) Der Offline-Fall prüft auch, dass die alte Reihe im Pass bleibt. (2) Kommentar und Meldung im Online-Fall sagen „feste Mischung“. (3) `offlineRetainedAnswerWording` läuft zusätzlich im CI-Teil von `offline-cold.mjs` (bei jedem PR, auch in Firefox und WebKit); die Vollprüfung behält ihre Stelle in `offlineAnimals`, damit sich dort nichts verschiebt. Gegenprobe: ein absichtlicher Fehler im Schritt macht `offline-cold` rot. (4) Kommentare in `rate-mal.tsx` und `karten-daten.ts` genauer (eine gespeicherte Wortliste bleibt; was keine Wortliste ist, ersetzt `useSavedGame` wie bei allen Spielständen). Nicht umgesetzt: Vorschlag 2 (eigene Hilfe über `antwortReihe`, bringt hier nichts zusätzlich). Vorschlag 3 (Regel in `CLAUDE.md`: betroffene Tests nach dem Auslöser suchen, `offline-cold-full` nach Kartenänderungen mitlaufen lassen) geht als Frage an den Nutzer.
- Vor der Meldung „Teil A fertig“ laufen `core`, `offline-cold-full`, `home-visits`, `animal-native-zoom` und `research` noch einmal ganz (Empfehlung des Berichts).

## Schlusslauf (24.11.2026, nach Commit `b04aa69`)

- `full-a9` (Chromium): `home-visits`, `research`, `animal-native-zoom` grün. `core` brach nach 718 s ab: Der Container wurde mitten im Lauf neu gestartet und hat Chromium dabei beendet (Fehler beim Schließen des kleinen Fensters, `core.mjs:95`). Ursache die Umgebung, kein Testbefund; darum ein neuer Lauf, kein blindes Wiederholen.
- `full-a10` (Chromium): `core` grün (923 s), `offline-cold-full` grün (180 s).
- `engines-a11`: die drei geänderten CI-Suiten `offline-cold`, `wissenskarte`, `retained-answer-wording` in Firefox und WebKit grün. Damit laufen die beiden neuen CI-Schritte auch dort.
- Damit ist jede große Suite nach den letzten Code-Änderungen mindestens einmal in Chromium ganz grün (`full-a6` bis `full-a10`, `check-a8`). Firefox und WebKit der Vollprüfung kommen wie immer am Phasenende.

## Design-Prüfung (Bericht `2026-11-24-teil-a-design-pruefung.md`)

Umgesetzt (nur Aussehen und Ort, keine Texte der Karten):
- **Befund 1, Stufenwahl offen:** Die drei Stufen stehen jetzt in einem eigenen Kasten mit gestricheltem Rand und dem Titel „Welche Stufe willst du spielen?“, volle Breite, mit Abstand zur Frage. Die gewählte Stufe hat nur noch einen kräftigen Rand und ein Häkchen, keinen farbigen Grund wie eine richtige Antwort. Der Kopf von „Rate mal!“ ist auf allen Breiten untereinander gesetzt; damit steht auf 1280/1440 nichts mehr verrutscht daneben, und „Zu schwer? Zurück zu Entdecker“ steht bündig links. Der Titel ist nur zum Sehen (`aria-hidden`), vorgelesen wird weiter der Gruppenname „Stufe wählen“.
- **Befund 2, Vorschlag:** steht jetzt in der Rückmeldung direkt nach der Erklärung, also vor „Noch eine Frage“. Beide Knöpfe haben denselben Rand, auf dem Handy volle Breite, 12 px Abstand; Innenabstand 16 px. Das eigene `role="status"` des Vorschlags ist weg, weil die Rückmeldung sich schon selbst ansagt (sonst doppelt).
- **Befund 3, „Prüfen“:** 48 px hoch, 18 px Schrift, auf dem Handy volle Breite.
- **Befund 8, Pass (Abstände):** Absätze unter „Für Erwachsene“ mit 8 px Abstand, darüber und darunter mehr Luft.
- **Befund 9:** Zweitzeilen der Stufen 16 px.
- Nachher-Bilder (320, 390, 1280; Stufenwahl zu und offen, Profi mit Zurück-Link, Vorschlag, „Ordne richtig“, Pass) selbst angesehen: keine Tippfläche unter 44 px, kein waagrechtes Scrollen. Die Bilder liegen nicht im Repository.

Nicht umgesetzt, mit Grund:
- **Frage dimmen, solange die Stufenwahl offen ist** (Befund 1): senkt den Kontrast des Fragetexts unter das, was wir für Kinder wollen; der eigene Kasten mit Titel trennt schon deutlich.
- **„Noch eine Frage“ zurücknehmen, solange ein Vorschlag steht** (Befund 2): Der Vorschlag steht jetzt davor; ein fehlender Knopf würde Kinder blockieren, die gar nicht wechseln wollen.
- **Befunde 4, 5 und 6** („Ordne richtig“: Hinweis „oben = zuerst“, Fehlermeldung im Kasten, Auflösung als Reihe; „Fast richtig“: doppelte Erklärung, Leerraum, Symbol am falschen Wort; Fotosynthese: Bildlegende kürzer und an die Zeichnung): Das sind Texte und Aufbau, die über `karten-autor`, `kinder-redaktion` und `fakten-pruefer` laufen müssen. BACKLOG, Phase 1, Teilschritt 3.
- **Befund 7** („Modellkörper“ bricht bei 320 px im Steckbrief): stammt nicht aus Teil A, betrifft den Steckbrief aller Karten. BACKLOG.
- **Befund 8, Ort und Pfeil:** Die Stufenwahl steht im Pass mit Absicht unter „Spielen & Vorlesen“, bei den anderen Spiel-Einstellungen. Falsch waren STATUS und der PR-Entwurf („Sichern & mitnehmen“), beide berichtigt. Das Standard-Dreieck an „Für Erwachsene“ teilt sich der Pass mit seinen anderen aufklappbaren Feldern; ein einheitlicher Pfeil gehört zum Feinschliff des Passes (BACKLOG).

Code-Nachprüfung des Design-Commits `00feeff` ([Bericht](2026-11-24-teil-a-code-nachpruefung-design.md)): nichts Hohes oder Mittleres.
- **Befund 2 umgesetzt:** Der Titel „Welche Stufe willst du spielen?“ ist jetzt der Name der Gruppe (`aria-labelledby`), nicht mehr versteckt; vorgelesen wird, was dasteht. `pass-spielstaende` und `karte-hilfen` suchen die Gruppe unter dem neuen Namen.
- **Befund 3 umgesetzt:** `karte-stufen` (in der CI-Suite `wissenskarte`) prüft jetzt, dass der Vorschlag in der Rückmeldung und vor „Noch eine Frage“ steht. Gegenprobe: ein Build mit dem Vorschlag unter der Rückmeldung macht den Test rot („der Vorschlag steht in der Rückmeldung“, 0 statt 1).
- **Befund 1 so gelassen:** Die Rückmeldung liest bei jeder Änderung alles neu vor, jetzt mit dem Vorschlag. Das betrifft nur Bildschirmleser und nur, wenn nach dem Vorschlag noch einmal geantwortet wird; nicht mit einem echten Bildschirmleser geprüft. Ansehen bei der nächsten Teilprüfung mit Bildschirmleser (BACKLOG); falls es stört, Rückmeldungstext und Vorschlag in eigene Bereiche trennen.
- Der erste `core`-Lauf nach `00feeff` (`core-a13`) wurde von mir nach 201 s abgebrochen, weil beide Befunde ohnehin einen neuen Lauf brauchten; vorher stand kein Fehler im Log.
- Prüfung auf dem Endstand `01bf03a` (24.11.2026): `pnpm run check` grün (`check-a14`: 437 Unit-Tests, CI-Satz in Chromium, WebKit-Kurzprüfung), danach `--suite full core` grün (`core-a15`, 927 s), dazu die zwei geänderten Suiten `wissenskarte` und `pass-spielstaende` in Firefox und WebKit grün (`engines-a16`). Die Antwortliste `gespeicherte-antworten-teil-a.json` ist unverändert aktuell (neu erzeugt und verglichen: gleich, 287 Fragen).

## Dritter später Fund: CI von PR #107, Engine-Schnellprüfung WebKit (`pass-spielstaende`)

- **Befund:** Im ersten CI-Lauf von PR #107 (Lauf 45311674318, Commit `5ff3cec`) war „Engine-Schnellprüfung (webkit)“ rot: „der Fokus bleibt in der Stufenwahl“ (`pass-spielstaende.mjs:145`, nach „Zu schwer? Zurück zu Entdecker“ im Pass). Pflicht-Check und Firefox waren grün. Hier in WebKit vorher einmal (`engines-a16`) und jetzt sechsmal allein grün; der Fokus stand dabei jedes Mal sofort auf „Ändern“.
- **Ursache:** `waehle` in `app/kern/stufen-wahl.tsx` setzte den Fokus auf „Ändern“ nur im nächsten Bild (`requestAnimationFrame`). Der Speicher meldet die neue Stufe sofort, also verschwindet „Zurück zu Entdecker“ noch im Tipp. Der Fokus fiel mit dem Knopf weg, und die Fokusfalle des Pass-Dialogs (Radix) setzte ihn auf den Dialog. Erst im nächsten Bild kam er auf „Ändern“. Der Test prüft direkt danach; in der CI (zwei Suiten gleichzeitig) kam das Bild zu spät. Nachgestellt mit künstlich um 150 ms verzögertem `requestAnimationFrame`: derselbe Fehler nach rund 3 s, in WebKit und Chromium.
- **Korrektur auf der Seite, nicht im Test:** Anders als beim ersten späten Fund (dort stellt die Seite mit Absicht erst im nächsten Bild wieder her) war der kurze Sprung auf den Dialog ein echter kleiner Mangel; ein Bildschirmleser kann dabei den Dialog vorlesen. `waehle` setzt den Fokus jetzt zuerst auf „Ändern“, solange der gedrückte Knopf noch da ist. Der Schritt im nächsten Bild bleibt als Rückfall für die Karte, die beim Wechsel neu aufbauen kann. Der Test bleibt unverändert streng. Gegenprobe mit verzögertem Bild: jetzt grün in WebKit, Chromium und Firefox.
- **Prüfung:** `check-a17` auf `9b74f99` grün (437 Unit-Tests, 19 Chromium-Suiten, 2 WebKit-Suiten). Danach die Nachprüfung durch den `technik-pruefer` (Regel nach spätem Fund, [Bericht](2026-11-24-teil-a-technik-pruefung-webkit-fund.md)).
- **Bewertung der Technik-Prüfung:**
  - Befund 2a (der Test soll warten): nicht übernommen. Die sofortige Prüfung ist jetzt verlässlich und erkennt gerade den Sprung auf den Dialog; ein Warten würde ihn verdecken. Stattdessen steht an beiden Stellen in `pass-spielstaende.mjs` ein Kommentar, warum dort nicht gewartet wird.
  - Befund 2b: bleibt so (geringes Risiko, im Bericht begründet).
  - Befunde 3a/3b (dieselbe Lücke auf der Karte nach „Ja …“ und „Nein, ich bleibe“): umgesetzt, siehe nächster Punkt.
  - Befunde 3c, 2c und 1 (Stresslauf) sowie die lange WebKit-Installation: ins BACKLOG. Den Stresslauf als Schritt in `/pruefen` entscheidet der Nutzer (STATUS, Frage 5).
- **Karte (3a/3b):** Gemessen mit verzögertem Bild, wo der Fokus direkt nach dem Tipp liegt. Vorher lag er nach allen drei Vorschlagsknöpfen auf `<body>` (WebKit, Chromium); die Tests waren trotzdem grün, weil sie warteten. Der erste Versuch (`614d027`: Fokus sofort, im nächsten Bild noch einmal) half nur bei „Nein“. Bei „Ja“ baut die Karte „Rate mal!“ mit neuer Frage neu auf (`key={frage.id}`), und das alte „Ändern“ verschwindet. Jetzt stellt `stufeWechseln` (`app/kern/stufen-wahl.tsx`) die Stufe mit `flushSync` noch im Klick um; danach steht die neue Karte schon, und der Fokus geht sofort auf „Ändern“. Das gilt auch für die Stufenwahl im Pass; der Schritt im nächsten Bild entfällt. „Nein“ schließt ebenso mit `flushSync` und setzt den Fokus dann auf „Rate mal!“. Radix greift nur ein, wenn der Fokus nach dem Klick noch auf `<body>` liegt (`handleMutations` in `@radix-ui/react-focus-scope`), was jetzt nie passiert. Ergebnis der Messung: sofort richtig in WebKit, Chromium und Firefox, auch mit verzögertem Bild.
- **Tests strenger:** `fokusAuf` in `karte-stufen.mjs` prüft jetzt sofort statt zu warten, nach demselben Muster wie im Pass (erst auf die sichtbare Änderung warten, dann den Fokus sofort prüfen). Stressprobe mit verzögertem Bild (`wissenskarte` und `pass-spielstaende`): grün in Chromium, WebKit und Firefox. Gegenprobe mit dem alten Seitencode (`614d027`) und den strengen Tests unter Stress, Chromium: rot bei „nach dem Umstellen (neue Frage) steht der Fokus auf „Ändern“; der Fokus liegt auf BODY“. Der strenge Test findet die Lücke also. Sie betraf auch das Umstellen über „Ändern“ auf der Karte, nicht nur die Vorschlagsknöpfe; `flushSync` behebt beides.
- **Nebenbefund:** Ein Messlauf in Chromium mit verzögertem Bild war einmal rot; seine Ausgabe hatte ich weggefiltert. Drei weitere Messläufe und der Lauf ohne Verzögerung waren grün. Nicht nachgestellt; die künstliche Verzögerung bremst die ganze Seite. Das bleibt eine offene Beobachtung.
- **CI auf `614d027`:** Pflicht-Check und Firefox grün. WebKit rot, aber ohne Test: „Install webkit“ brach nach 20 Minuten ab, weil der Ubuntu-Paketspiegel hing (Lauf 45317972918). Kein Seitenfehler; Vorschlag im BACKLOG, Frage an den Nutzer (STATUS, Frage 6). Der nächste Push startet einen neuen Lauf.
- **Prüfung auf `0322422`:** `check-a18` grün (437 Unit-Tests, 19 Chromium-Suiten, 2 WebKit-Suiten), `--suite full core` grün (902 s), `wissenskarte` und `pass-spielstaende` in Firefox und WebKit grün. CI auf `f849a5a` grün (Pflicht-Check, Engine-Schnellprüfung Firefox und WebKit).
- **Code-Prüfung zu `flushSync`** ([Bericht](2026-11-24-teil-a-code-pruefung-flushsync.md)): kein Fehler, drei niedrige Befunde.
  - Befund 1 (der strenge Test kann den alten Fehler auf einem schnellen Rechner übersehen): übernommen. `FOKUS_NACH_KLICK` in `tests/browser/harness.mjs` ist ein Init-Skript mit einem Lauscher auf `window`, der am Ende jedes Klicks festhält, wo der Fokus liegt. `fokusAuf` in `karte-stufen.mjs` und die beiden strengen Stellen in `pass-spielstaende.mjs` prüfen das zusätzlich zum Fokus danach. Den Stresslauf braucht es dafür nicht mehr.
  - Befund 2 (der Ort für die Fokussuche steht vor dem Wechsel fest): nur ein Kommentarsatz in `stufen-wahl.tsx`, dass die Karte beim Stufenwechsel nicht neu eingehängt werden darf. Eine Funktion als `ort` hilft bei `waehle` nicht: Dort hängt der Ort am alten Knopf, der beim Neuaufbau selbst verschwindet.
  - Befund 3 (Zweig „alter Knopf bleibt“ auf der Karte ungeprüft): übernommen, aber an der richtigen Stelle. Die Testkarte des Experten-Schritts hat eine eigene Experte-Frage, trifft also den Zweig mit Neuaufbau; die Prüfung dort bleibt trotzdem. Den Zweig „alter Knopf bleibt“ trifft die Karte ohne Zusatzfragen auf Profi (`profiOhneProfiFragen`, die Frage bleibt); dort steht jetzt eine Fokus-Prüfung.
- **Prüfung und Gegenprobe ohne Verzögerung** (Commit `1b87dd8`): typecheck, lint, 437 Unit-Tests; `wissenskarte` und `pass-spielstaende` in Chromium, Firefox und WebKit grün. Gegenprobe ohne künstliche Verzögerung: Mit dem Kartencode von `614d027` fällt `wissenskarte` in Chromium und WebKit durch („nach dem Umstellen (neue Frage) steht der Fokus auf „Ändern“ (am Ende des Klicks); der Fokus lag auf BODY“). Mit dem Pass-Code von `5ff3cec` (der Stand des CI-Funds) fällt `pass-spielstaende` in Chromium und WebKit durch („der Fokus bleibt schon am Ende des Tipps in der Stufenwahl“). Die Tests finden diese Fehlerklasse jetzt also auch auf einem schnellen Rechner, nicht erst in der CI.

## Code-Nachprüfung der Fokus-Tests (Bericht `2026-11-24-teil-a-code-nachpruefung-fokus-tests.md`)

- **Ergebnis:** bereit. Kein falscher roter oder grüner Lauf, der heute eintreten kann.
- Befund 1 (ein unterwegs angehaltener Klick ließe den alten Wert stehen): übernommen. `FOKUS_NACH_KLICK` leert den Wert zu Beginn jedes Klicks (Capture-Phase auf `window`); dann wird der Test rot statt still grün.
- Befund 2 (der Kommentar sagt „alter Knopf“, der Test prüft nur „ein ‚Ändern‘“): Kommentar weicher gefasst. Kein Vergleich auf dasselbe Element: Für Kinder ist es gleich, auf welchem „Ändern“ der Fokus liegt.
- Befund 3 (alter Kommentar „Umschalt+Tab“, der Test drückt Tab): berichtigt.

## Zeitweiser Fund in `pnpm run check`: WebKit bricht in `offline-cold` Bilder ab

- **Befund:** `check-a20` (Stand `2b3376a`) war in der WebKit-Kurzprüfung rot, Suite `offline-cold`: „Load request cancelled“ für `white-tailed-eagle.webp` und `emperor-penguin.webp`. Dieselbe Suite war vorher in `check-a17`, `check-a18` und in der CI grün.
- **Ursache:** nicht die Startseite. Seit Teil A läuft im CI-Satz offline die Prüfung alter Antworten auf der Seeadler-Karte (`offlineRetainedAnswerWording`, zweiter später Fund). Sie lädt dreimal neu, ohne vorher auf die Ladeanfragen zu warten: einmal auf der Seite davor (im CI-Satz `science-energy`), zweimal auf der Seeadler-Karte. Kommt eines der zwei späteren Neuladen, bevor Seeadler- und Pinguinbild da sind, bricht WebKit sie ab (berichtigt nach der Code-Prüfung, Befund 3). Belegt mit einem Diagnose-Lauf, der jede Anfrage mit Zeit protokolliert: Im ruhigen Lauf lagen nur 46 ms zwischen dem fertigen Bild und dem Neuladen. Unter Last (vier Läufe gleichzeitig) gab es mit dem alten Test in 4 von 12 Läufen einen Abbruch: dreimal die Bilder, einmal die Fotodaten `world-photos-….json`. Ein weiterer Lauf endete mit „Target page … has been closed“; vermutlich hielt WebKit die künstliche Last nicht aus. Nicht weiter verfolgt; mit dem neuen Test kam es nicht vor.
- **Korrektur im Test:** `offlineRetainedAnswerWording` wartet vor jedem Neuladen mit `ladeanfragen` (`tests/browser/harness.mjs`), wie die Online-Prüfungen daneben schon. `offline-cold` legt die Wartehilfe gleich nach dem Öffnen der kalten Seite an und reicht sie weiter, in der Vollprüfung über `offlineAnimals`. Gleiche Last mit dem neuen Test: 0 von 12 Läufen mit Abbruch.
- **Dieselbe Lücke in den neuen Stufen-Tests:** Die drei gewollten Neuladestellen in `karte-stufen.mjs` warten jetzt auch mit `ladeanfragen`. Dort war noch nichts aufgefallen; die Regel in `harness.mjs` gilt aber für jedes gewollte Neuladen. Der Kommentar dort nennt jetzt auch die WebKit-Meldung.
- Kein später Fund im Sinn der Regel (er kam in `pnpm run check`, nicht erst in der CI-Vollprüfung oder `test:full`). Nachgeführt im BACKLOG beim Punkt „Seitenwechsel im Test“: Der dort geplante zentrale Schritt ist noch offen.

## Code-Prüfung der Offline-Wartehilfe (Bericht `2026-11-24-teil-a-code-pruefung-offline-wartehilfe.md`)

Ergebnis des `code-pruefer` zu `ae5810c`: bereit, kein Befund vor dem Merge nötig. Bewertung:

1. **Meldet Firefox das Ende von Antworten aus dem Service Worker?** Geklärt: `offline-cold` lief auf `ae5810c` in Firefox grün (wie in Chromium und WebKit), die Wartehilfe brach nicht ab. `offline-cold-full` in Chromium grün (185 s).
2. **Standardwert in `offlineRetainedAnswerWording`:** umgesetzt. Ohne Wartehilfe bricht die Funktion jetzt mit klarer Meldung ab, statt still nur halb zu schützen.
3. **Erstes Neuladen nicht auf der Seeadler-Karte:** stimmt. Kommentar und Abschnitt oben berichtigt.
4. **`mitKarte` schließt ohne Wartehilfe:** bleibt; gehört zur Klasse „Schließen“ im BACKLOG (dort vermerkt).
5. **`learning-task-offline.mjs` lädt offline achtmal ohne Wartehilfe neu:** umgesetzt für `offline-cold` (dieselbe WebKit-Kurzprüfung bei jedem PR). Die Wartehilfe ist ein freiwilliger Parameter; `offline-resilience` und `journey-zoom` übergeben sie noch nicht, damit sich dort nichts ändert, ohne dass ihre langen Läufe neu nötig werden. Vermerkt im BACKLOG beim zentralen Schritt.
6. **Zahlen im BACKLOG:** nachgezählt und berichtigt (76 `.reload(`, 128 `.close()`).

Prüfungen auf `7900f38` (danach nur Unterlagen): `pnpm run check` grün (437 Unit-Tests, CI-Satz in Chromium, WebKit-Kurzprüfung mit `offline-cold`), `offline-cold` in Firefox grün, `offline-cold-full` in Chromium grün (202 s).

## Arbeitsweise

- Neuer Helfer `karten-autor` (Nutzer, 23.11.2026: „ja“). Wer einen Entwurf schreibt, prüft ihn nicht selbst.
- PR #95 und #27: Durchsicht durch einen Helfer, Brauchbares übernehmen, Rest löschen (Nutzer: „das entscheidest du“). Ergebnis folgt in `2026-11-23-pr-95-27-durchsicht.md`.
- Linkwächter als Test statt als Helfer, zu Beginn von Teil B.

## Antworten des Nutzers und Merge (24.11.2026, morgens)

Nutzer, 24.11.2026: „Du kannst alles ändern und auch mergen“. Damit sind die offenen Fragen (1) bis (6) aus STATUS und PR #107 so entschieden, wie Claude es empfohlen hat. PR #107 ist am 24.11.2026 gemergt (`36c8fdd`). Die CI auf dem Endstand `9741ee7` war ganz grün (Lauf 45330432651: Pflicht-Check, Engine-Schnellprüfung in Firefox und WebKit).

Umsetzung im Folge-PR (Branch `claude/trusting-galileo-ck3o23`):

1. **Personenkarten:** bleibt so, „Ganz einfach“ steht dort in „Ausprobieren“. Echte leichte Sätze kommen mit der Personenwelt (BACKLOG, Teil A, Punkt „Personenkarten (36)“).
2. **„Selbst beobachten“ und Lernziel aus PR #27:** nicht übernommen. Die Entwürfe bleiben in `docs/entwurf/2026-11-23-ganz-einfach-entwurf.json` und werden erst mit den Welten geprüft (BACKLOG).
3. **`CLAUDE.md`, Arbeitsablauf Punkt 4:** übernommen (Commit `474a825`). Betroffene Tests auch nach dem Auslöser suchen; nach Kartenänderungen `--suite full core offline-cold-full`.
4. **Größenvergleich im Build:** gestrichen (Commit `c84f513`). Beim Nachmessen fiel auf: Das Startpaket hat komprimiert nur noch rund 750 Byte Luft bis zur festen Grenze (292.253 von 293.000 Byte). Neuer BACKLOG-Punkt „Startpaket fast an seiner festen Grenze“, Vorschlag: zu Beginn von Teil B.
5. **Stresslauf:** gebaut (`tests/browser/stresslauf.mjs`, Schalter `QA_FRAME_DELAY_MS` in `tests/browser/run.mjs`). Er bremst jedes Bild in jedem Kontext, den die Suiten öffnen (`newContext`, darüber auch `newPage`, und `launchPersistentContext`). Von Hand gemessen: Ein Bild kommt in Chromium, Firefox und WebKit rund 150 ms später, Abbrechen wirkt. Gemessen am 24.11.2026: CI-Satz in WebKit ohne Bremse 5 Minuten (alle 18 Suiten grün), mit `QA_FRAME_DELAY_MS=150` 6¼ Minuten, ebenfalls alle grün; am meisten Zeit kosten `kern-huelle` (94 → 126 s), `wissenskarte` (96 → 114 s) und `no-news` (80 → 107 s). Aufgenommen als Schritt 3 in `/pruefen` (vor jedem PR, in WebKit) und in `CLAUDE.md` beim Browser-Runner. Code-Prüfung ohne Blockierendes, drei Kleinigkeiten behoben bzw. vermerkt ([Bericht](2026-11-24-folge-pr-teil-a-code-pruefung.md)): falsche Werte für den Schalter brechen jetzt mit Meldung ab; das Spiegel-Skript lässt Einträge ohne Priorität unverändert und hält die Reihenfolge der anderen genau; Grenze der Bremse im Kopfkommentar.
6. **Browser-Installation in der CI:** `scripts/ci-paketspiegel.sh` in allen drei Installationsschritten (Commit `e159182`). Ursache im Protokoll belegt: Die Spiegelliste (152 Byte) hatte den AWS-Spiegel mit Priorität 1. Der alte `sed` hob den offiziellen Spiegel ebenfalls auf 1, und apt verteilte die Pakete auf beide (102 und 100 Pakete, 126 MB in 12:24 min). Jetzt hat nur der offizielle Spiegel Priorität 1. Ob es wirkt, zeigt die CI des Folge-PR (das Skript gibt die Liste aus).

## Vierter später Fund: CI von PR #108, Engine-Schnellprüfung WebKit (`portable-flows`)

Lauf 45344729398 auf `d510807`. Pflicht-Check und Engine-Schnellprüfung Firefox waren grün, WebKit rot. Ursache und Antwort:

- **Was rot war:** `portable-flows` tippte gleich nach dem Öffnen der Suche „Elefant“ und las den ersten Treffer. Erwartet: der Elefant. Bekommen: `lab:moon`, die erste Startidee bei leerer Suche.
- **Was dahinter steckt:** Das Getippte war weg, das Suchfeld leer. Lokal kam das 1-mal in rund 1000 WebKit-Probeläufen vor, und nur, wenn die Kapiteltexte genau beim Tippen ankamen. Mit Ereignisprotokoll kam es nie vor. Warum der Text dann verloren geht, ist offen (Verdacht: Playwrights `fill` arbeitet in zwei Schritten, erst Fokus, dann Text). Kommen die Kapiteltexte nach dem Tippen, bleibt die Eingabe. Das prüft `journey-content` eigens. Kein Zusammenhang mit den Änderungen dieses PRs: Der Test und die Suche sind unverändert.
- **Was geändert ist:** Neuer Baustein `inSucheTippen` in `tests/browser/harness.mjs`. Er öffnet die Suche, wartet auf die Kapiteltexte, tippt und wartet auf die Überschrift „Passende Entdeckungen“. Erst dann liest der Test die Treffer, und er prüft, dass die Eingabe im Feld steht. Genutzt in `portable-flows` und in der Bronzezeit-Suche (`history-learning.mjs`, läuft in `core`, `offline-resilience` und `offline-cold-full`). Diese beiden lasen die Liste sofort nach dem Tippen; alle anderen Suchtests warten schon auf einen bestimmten Treffer.
- **Nicht abgeschwächt:** Die Rangfolge wird weiter streng geprüft (erster Treffer). Geht das Getippte verloren, wird der Test rot mit einer klaren Meldung, statt still grün.
- **Offen:** BACKLOG „Suche: Getipptes war einmal weg“: beobachten. Der Stresslauf fängt so etwas nicht, er bremst nur Bilder.
