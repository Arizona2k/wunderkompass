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

- **Alte Antwortreihe im Pass bleibt** (Nachtrag aus der großen Prüfung von Aufgabe 5): Passt eine gespeicherte Reihenfolge nicht mehr (z. B. nach einer vierten Antwort), zeigt die Karte eine feste Mischung je Frage (`festGemischt`) und schreibt nichts in den Pass. Die erste Fassung hatte neu gemischt und gespeichert; der Schutztest „interpretation never overwrites original import evidence“ war dadurch rot. Falls falsch: Alle Kinder mit so einer alten Reihe sehen dieselbe Mischung, nicht jedes eine eigene.
- Öffnet ein Kind eine Karte mit Challenge-Fragen, nachdem es die Hauptfrage beantwortet hat, merkt sich die Karte die Antwortreihe der nächsten Frage (neuer Schlüssel im Kartenstand). Alte Einträge bleiben unverändert; der Test „existing round retained“ prüft das jetzt je Eintrag statt „nichts Neues“.

## Aufgabe 6: „Ganz einfach“ offen

- Karten ohne Häppchen zeigen „Ganz einfach“ offen und ohne Altersangabe, die Absätze zugeklappt unter „Für Große“ (wie geplant).
- **Abweichung vom Plan bei Personenkarten (36):** Dort ist der Satz meist die Anleitung zum Versuch („Vergleiche zwei erfundene Messbefunde …“), keine Erklärung. Er steht darum oben in „Ausprobieren“ (wie schon bei den Pilot-Karten mit Häppchen), und die Absätze bleiben offen in „Kurz erklärt“. Echte leichte Sätze für Personen kommen mit der Personenwelt (BACKLOG 24). Falls falsch: Personenkarten bleiben vorerst lang offen.
- **67 Karten bekommen „Ganz einfach“ neu** (Vorlage PR #27, neu geschrieben von der `kinder-redaktion`, geprüft vom `fakten-pruefer`). Die sechs Karten mit Häppchen aus der Vorlage (Steinwerkzeuge, Apollo 11, Pyramiden von Gizeh, Eiffelturm, Wasserkreislauf, Mondphasen) bekommen keinen Satz: Die Häppchen sind dort die einfache Fassung.
- Nur „Ganz einfach“ wird übernommen. „Selbst beobachten“ und Lernziel aus PR #27 sind ungeprüft und oft Erwachsenensprache; sie bleiben im Entwurf. Beide Felder sind deshalb freiwillig (Typ und Testhilfe `lesetexte`).
- **24 Tierkarten:** Einleitung und „Ganz einfach“ waren derselbe Satz, ein Lehrsatz für Erwachsene („Artwissen benötigt …“). Beide sind neu (Vorschlag der `kinder-redaktion`, Faktencheck). Die Inhaltsregel „Ganz einfach steht nicht in der Einleitung“ gilt jetzt ohne Ausnahmeliste.
- Heikle Karten: Der Satz nennt das Leid ehrlich und ohne Einzelheiten (Weltkriege: die Toten; 1492: das Leid der Menschen vor Ort; Mauerbau: der Zweck; Holocaust: der Grund war Hass).
- „Was ist neu?“: zwei Einträge („Drei Stufen: Entdecker, Profi, Experte“, „Erst ein leichter Satz“).
- **Endprüfung der Sätze:** Der `fakten-pruefer` fand keine falsche Zahl, aber 20 Sätze, die zu stark verkürzten (z. B. Buchdruck: „vorher alles mit der Hand“, obwohl in China und Korea schon gedruckt wurde; Fliegen: „Luft strömt vorbei und hebt“; Bestäubung: als ob alle Pflanzen Tiere bräuchten). Alle übernommen, dazu vier Vorschläge der `kinder-redaktion`; danach Nachprüfung durch beide (`2026-11-23-ganz-einfach-nachpruefung-*.md`). Beim Holocaust nennt der Satz jetzt auch den Mord („Millionen von ihnen wurden ermordet“), weil er für sich allein stimmen soll.

## Arbeitsweise

- Neuer Helfer `karten-autor` (Nutzer, 23.11.2026: „ja“). Wer einen Entwurf schreibt, prüft ihn nicht selbst.
- PR #95 und #27: Durchsicht durch einen Helfer, Brauchbares übernehmen, Rest löschen (Nutzer: „das entscheidest du“). Ergebnis folgt in `2026-11-23-pr-95-27-durchsicht.md`.
- Linkwächter als Test statt als Helfer, zu Beginn von Teil B.
