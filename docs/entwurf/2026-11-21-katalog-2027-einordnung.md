# Katalog „WunderKompass 2027“ – was wir übernehmen

Stand: 21.11.2026. Der Nutzer hat Claude den alten Anforderungskatalog aus der ChatGPT-Zeit gegeben. Der Auftrag: ihn kritisch ansehen und selbst entscheiden, was übernommen wird.
Der Katalog liegt unverändert in [docs/archiv/WunderKompass_2027_Anforderungen.md](../archiv/WunderKompass_2027_Anforderungen.md).

## Kurzfazit

Der Katalog will im Kern dasselbe wie wir: **besser statt größer**. Er fordert echte und geprüfte Inhalte, gute 3D-Modelle und einen starken Globus. Alles soll verknüpft sein, und nichts darf verloren gehen. Das übernehmen wir.

Zwei Dinge passen nicht mehr:

1. **Die Zielgruppe.** Der Katalog spricht von „Kindern und Jugendlichen“ und von „ausführlichen“ Inhalten. Unsere Zielgruppe sind Kinder von 5 bis 10 Jahren. Für sie kommt Kurzes zuerst, Tiefe gibt es freiwillig.
2. **Die Reihenfolge.** Er verlangt zuerst Paket 3.5, Audit V2 und dann die Pakete 4 bis 8. Diesen Weg haben wir am 21.11.2026 durch Weg C ersetzt (neuer kindgerechter Kern, Bewährtes zieht um).
   - Die echten offenen Fehler aus Paket 3.5 und Audit V2 gehen nicht verloren. Sie stehen im BACKLOG in der passenden Phase (unten).

Der Katalog sagt selbst: Er ist keine Freigabe, laufende Arbeit abzubrechen. Wir brechen nichts ab: Schritt 0 ist fertig, Phase 1 bleibt der nächste Schritt. Der Katalog ändert die Reihenfolge nicht, er schärft die Ziele.

## Entscheidung je Abschnitt

| Abschnitt | Entscheidung | Was das für uns heißt | Steht jetzt in |
|---|---|---|---|
| 1 Ziel | angepasst | Hochwertig, modern, zum Mitmachen: ja. Zielgruppe 5–10 statt „Jugendliche“; kurz zuerst, Vertiefung freiwillig. | VISION (Ziele, Für wen) |
| 2 3D-Modelle | angepasst | 3D nur, wo Drehen oder Bewegen etwas erklärt. Jede 3D-Ansicht hat eine 2D-Fassung. Vorhandenes Three.js weiter nutzen; React Three Fiber beim ersten neuen Modell prüfen. Kein Spline. | VISION (3D), BACKLOG Phase 4 |
| 3 Weltkugel | übernommen, in Phase 4 | Der Globus wird ein zentrales Erlebnis mit Themenebenen und Wegen zu Karten, Spielen und Laboren. Keine Tagespolitik und keine strittigen Grenzen. | VISION (Globus), BACKLOG Phase 4 |
| 4 Themenfelder | angepasst | Die zwölf Felder ziehen in unsere sieben Welten, Welt für Welt geprüft statt alle auf einmal. Jedes Thema in drei Tiefen. Sorgfaltsregeln für heikle Felder. | VISION (Themen), BACKLOG Phase 3 und Ideen |
| 5 Design und Barrierefreiheit | übernommen | Einheitliches Design-System, klare Startseite, gute Lesbarkeit, Tastatur und 2D-Ersatz für 3D. | BACKLOG Phase 1 |
| 6 Interaktivität | übernommen | Mitmachen statt Ankreuzen, Stufen, Warum-Fragen. Regel: Jede Interaktion hat einen erkennbaren Lernnutzen. | VISION (Mitmachen) |
| 7 Verknüpfung, Suche, Rückwege | übernommen | Ziel 6. Suche versteht auch Fragen aus mehreren Wörtern. Antworten auf Warum-Fragen kommen aus geprüften Texten, nicht von einer KI. Jeder Weg führt zurück. | VISION (Ziel 6), BACKLOG |
| 8 Bestandsschutz | gilt schon | Karten, Reisen, Spiele, Labore, Pass, Suche und Links bleiben. | CLAUDE.md (Feste Regeln), Tests |
| 9 Qualität | Kern übernommen | Geprüfte Quellen, richtige Bilder und Modelle, Tests für Handy und Rechner. Dazu immer echtes Ansehen, nicht nur grüne Tests. Kein Nachweis-Apparat. | CLAUDE.md (Arbeitsablauf, Helfer) |
| 10 Reihenfolge | nicht übernommen | Ersetzt durch Weg C. Audit V2 ist nachgeprüft: 18 von 19 Befunden behoben, der Rest steht im BACKLOG (unten). | BACKLOG |
| 11 Eigene Qualitätskontrolle | übernommen | Erst verstehen, Doppeltes vermeiden, Folgen prüfen, Schwächen offen sagen, keine unnötigen Schleifen. | CLAUDE.md |

## Was wir bewusst nicht machen, und warum

- **Spline.** Im kostenlosen Plan tragen exportierte Szenen das Spline-Logo, ohne Logo braucht es einen Bezahlplan ([Spline-Hilfe](https://docs.spline.design/doc/faq/docJF3WvgXVz), [Preise](https://www.spline.design/pricing)). Die Modelle entstünden außerdem in einem fremden Online-Werkzeug, Größe und Offline-Betrieb hätten wir schlechter im Griff. Das widerspricht „alles kostenlos“.
- **„Ausführliche“ Inhalte für alle.** Lange Texte schrecken 5- bis 10-Jährige ab. Deshalb gibt es drei Tiefen: kurz für alle, „Mehr erfahren“ für Neugierige und Eltern, „Für Große“ (12–14) freiwillig.
- **Zwölf Themenfelder auf einmal.** Masse ohne Prüfung war das Problem der alten Zeit. Wir bauen Welt für Welt, jede mit `kinder-redaktion`, `fakten-pruefer` und `bild-recherche`.
- **3D als Schmuck.** Ein 3D-Modell, das nichts erklärt, kostet Ladezeit und Akku und hilft beim Lernen nicht. Dann ist ein gutes Foto oder eine klare Zeichnung besser.
- **„Dokumentierte Abnahme“ als Nachweis-Dateien.** Diesen Apparat haben wir in Schritt 0 entfernt. Er kostete viel Arbeit, und die sichtbaren Fehler blieben trotzdem (Audit V2 hat sie gefunden). Abnahme heißt bei uns: Prüfkette grün, Vorschau-Link, Screenshots, ehrlicher Bericht, „ok“ des Nutzers.
- **Antworten von einer KI.** Kinder bekommen keine Chat-Antworten. „Direkte Antworten auf Warum-Fragen“ kommen aus geprüften Texten (Wissensbuch, Karten), die die Suche findet.
- **Politische Zusammenhänge und strittige Grenzen.** Für 5- bis 10-Jährige erklären wir, wie Menschen leben, was sie feiern und welche Sprachen sie sprechen. Tagespolitik gibt es nicht. Auf dem Globus stehen Natur, Klima und Orte im Vordergrund; Ländergrenzen zeigen wir, wo sie zum Thema gehören, ohne Streitfälle zu bewerten.

## Sorgfaltsregeln für die neuen Themenfelder

| Feld | Wohin | Regel |
|---|---|---|
| Weltraum und Astronomie | Weltall | Gut für 3D (Sonnensystem, Tag und Nacht, Mondphasen). Schwarze Löcher und Galaxien „Für Große“. |
| Dinosaurier und Urzeit | Tiere, Erde (eigene Welt „Urzeit“ in Phase 3 prüfen) | Bilder heißen „Rekonstruktion“. Erdzeitalter mit kindgerechter Zeitleiste. |
| Ozeane und Natur | Natur, Tiere | Tiefsee und Nahrungsnetze als Mitmach-Modelle. Klima sachlich, ohne Angst. |
| Mensch und Medizin | Menschen | Den Körper erklären (Knochen, Herz, Sinne). Krankheiten nur allgemein und ohne Angst, keine Gesundheitsratschläge; bei Beschwerden Erwachsene fragen. |
| Robotik und KI | Erfindungen | Wie ein Roboter Befehle befolgt, zeitlos erklärt. Keine Produkte, keine Nachrichten. |
| Physik und Chemie | Forscherlabor, Erfindungen | Regler-Modelle mit Forschungsfrage und ehrlicher Modellgrenze. Atome „Für Große“. |
| Geschichte | Geschichte | Auf 31 vorhandenen Themen und PR #95 aufbauen. |
| Religionen und Weltanschauungen | Menschen | Neutral und respektvoll, zum Beispiel über Feste der Welt. Kein Werten, kein Vergleichen nach „richtig“ und „falsch“. |
| Finanzen und Wirtschaft | Menschen, Forscherlabor | Tauschen, Geld, Sparen und Zinsen mit Spielgeld zum Ausprobieren. Keine Banken- oder Produktwerbung. |
| Sport und Bewegung | Menschen | Muskeln, Herzschlag, warum Bewegung guttut. Keine Körperideale, kein Wettbewerb gegen andere Kinder. |
| Geografie und Gesellschaft | Erde, Globus, Menschen | Länder, Kulturen und Sprachen. Keine Tagespolitik. |
| Biologie | Natur, Tiere | Pflanzen, Tiere, Lebenskreisläufe. Zellen und Genetik „Für Große“. |

## Was aus Audit V2 noch offen ist

Abschnitt 10 verlangt, Audit V2 abzuschließen. Darum hat ein Helfer am 21.11.2026 alle 19 Befunde aus [Audit V2 vom 29.10.2026](../archiv/auftrag-2026-10-13/WunderKompass_Audit_Ergaenzung_V2_2026-10-29.md) am heutigen Code nachgeprüft. Das ist eine Teilprüfung: Code gelesen, Spielfragen in Node erzeugt, im Browser nur Chromium bei 1280 px.

**Ergebnis:** 18 von 19 Befunden sind behoben, einer nur teilweise.
- Behoben und im Browser bestätigt: Rückwege im Wissensbuch (A1, A2), Plus und Minus bei den Erdschichten (B), Mehrwortsuche und weicher Trennstrich (D1, D2), doppelte Filter (E), Laborknopf, Tierwelt Seite 2 und Vulkan-Kapitel (F1–F3).
- Behoben, am Code und an den erzeugten Fragen geprüft: Hinweise verraten die Lösung nicht mehr (C1–C5).
- Behoben, nur am Code geprüft: „Stationen erneut ansehen“, Notizen bearbeiten, Zählung der Wiederholungen (H1–H3).
- Kaputte Quellenadressen werden nicht mehr ausgeliefert (G1). Zwei Ersatzquellen sperren automatische Abrufe (Antwort 403); ob sie tragen, prüft der `fakten-pruefer`, wenn das Thema dran ist.
- **Teilweise behoben:** In Länderansichten stehen die sechs gemeldeten Sprach- und Währungscodes jetzt als Namen da. Rund 100 weitere Codes erscheinen aber weiter roh, zum Beispiel „bem“ und „toi“ bei Sambia, „ff“ und „srr“ beim Senegal, die Währung „XCG“ (G2). Das merken Kinder; es steht im BACKLOG.

Kleine Reste aus der Nachprüfung stehen ebenfalls im BACKLOG: Der Verweis „Mit ‚Reflexion‘ weiterdenken“ steckt in zwei Klappen (Phase 3). Die Zoom-Knöpfe heißen auch in der Schichtenansicht „Weltkugel vergrößern“ (Phase 4). In den Tierdaten stehen weiter beide Schreibweisen „Wiesen & Gärten“ und „Wiesen und Gärten“ (Phase 2).

Paket 3.5 (WK-051 bis WK-058) bestand vor allem aus Bestandslisten und Nachweisen. Die inhaltlichen Punkte daraus stehen schon seit Schritt 0 im BACKLOG (WK-Nummern in Klammern).

## Rückfragen

Keine nötig. Der Katalog verlangt nichts, was gegen die festen Regeln verstößt (kein Konto, keine Cloud, keine Kosten); das Einzige mit Kosten, Spline, lassen wir weg.
