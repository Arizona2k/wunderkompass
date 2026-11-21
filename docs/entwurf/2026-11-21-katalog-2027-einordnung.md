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
| 10 Reihenfolge | nicht übernommen | Ersetzt durch Weg C. Offene Fehler aus Paket 3.5 und Audit V2 stehen im BACKLOG. | BACKLOG |
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

<!-- AUDIT-V2 -->

## Rückfragen

Keine nötig. Der Katalog verlangt nichts, was gegen die festen Regeln verstößt (kein Konto, keine Cloud, keine Kosten); das Einzige mit Kosten, Spline, lassen wir weg.
