# Master-Auftrag: Umsetzungs- und Prüfstand

> Historischer Prüfstand. Der fortgeführte Ausbau und die Prüfungen vom 9. Oktober 2026 stehen in [QA.md](QA.md). Aussagen über damals fehlende Offline-/Browserfunktionen sind keine Beschreibung des heutigen Stands.


Stand: 7. Oktober 2026. Ausgangspunkt ist die bestehende veröffentlichte Version 4, Commit `0168f1c791bb03aa4eb766a28efce7e34eb07f21`.

Dieser Bericht unterscheidet Implementierung von tatsächlichen Prüfnachweisen. Ein Abschnitt mit mehreren Vorschlägen ist nicht automatisch vollständig erfüllt. „Geprüft“ meint die unten beschriebenen automatisierten Abläufe; eine reale Geräteprüfung wird nur genannt, wenn sie stattgefunden hat.

## Bestand und Ergänzungen

Erhalten: 15 Kartenansichten, 242 Länder/Gebiete, 200 Hauptstadtpunkte, 40 Natur-/Tierorte, 52 Platten/54 Polygonteile, 16 Lernreisen/80 Kapitel, 22 Spielangebote, 76 Quizfragen, 90 Wissenswörter, 30 Warum-Fragen, zwölf Missionen und zwölf Abzeichen. Zehn bisherige Labore bleiben; das Sonnensystem ist das elfte. Sechs gemeinsame Versuche sind jetzt markierbar. Fortschritt und bestehende Speicher-Schlüssel werden erhalten.

## Nachweise

- Vor Änderung: vorhandener Funktionsstand in React/JSDOM erfolgreich geprüft.
- Erneute Regression: Globus-Alternative, Missionen, Vorlesen/Stoppen, Schichten, Tag/Nacht, klassische Spiele, Buch, Hilfe und strukturierte Lernaktionen.
- Elf Labore und 16 zusätzliche Spielvarianten einschließlich echter Länderumrisse, Weltreise, Sortierung und Memory.
- Alle 16 Lernreisen durch alle Kapitel und das wirkliche Abschlussrätsel.
- 44 strukturelle axe-core-Audits über Hauptansichten, Dialoge, elf Labore und 22 Spielangebote; keine verbliebenen Verstöße in den ausgeführten Regeln. Farbkontrast ist ausgenommen, weil JSDOM kein reales Layout berechnet.
- fake-indexeddb mit App-Neumount: Missionen, Kapitelstand, Ergebnisse, Einstellungen, Datenbank ohne Journal, alte Versionen, künftige Versionen, Importfehler und blockierter Speicher.
- Neue Zustände: Mondstellung, Viertelstunden, Versuchsmarkierung, tatsächlicher Schwierigkeitswahlschalter und eingefrorene laufende Runde.
- Export/Zurücksetzen/Import durch echte Oberflächenaktionen; Download und ausgewählte Datei im Test instrumentiert. Das belegt keine reale Übertragung oder echten Browser-Neustart.
- Gesten der SVG-Alternative: breite/schmale Darstellung, leere Ränder, zurückkehrender Drag, tatsächlicher Pinch-Zoom, Abbruch und Erholung.
- Echte Three.js-Kamera, Geometrie, Raycaster und OrbitControls mit instrumentiertem Renderer: Labels, Länderwahl, Gesten, Ruhe-/Hintergrund-/Sichtbarkeitspause, Kontextverlust und Ressourcenfreigabe. Kleine Grafikpolitik geprüft. Keine GPU-/Bildausgabe.
- TypeScript ohne inkrementelle Cacheänderung; produktiver Build und Archivierung über Sites.

## Unverändert offene Prüfgrenzen

Ein realer Browser ist im vorgesehenen Sites-Prüfweg nicht verfügbar. Deshalb sind GPU-Bildausgabe, echte iPhone-/Android-/Safari-Bedienung, visuelle Größenmatrix, Screenreader-Ausgabe und Core Web Vitals nicht als bestanden ausgewiesen. Vollständige Offline-Verfügbarkeit/PWA und automatische Gerätesynchronisierung sind nicht enthalten. Der Browserpass kann durch Browserdatenlöschung entfernt werden; dafür gibt es Export/Import.

## Zuordnung aller Auftragspunkte

| Nr. | Auftragspunkt | Stand | Konkreter Befund |
| --- | --- | --- | --- |
| 1 | DEINE ROLLE | Vorgehen | Bestehendes Produkt übernehmen; Technik, Lerninhalte und Zugänglichkeit gemeinsam berücksichtigen. |
| 2 | NUTZE DEN GESAMTEN BISHERIGEN CHAT | Vorgehen | Veröffentlichten Stand, sichtbaren Projektverlauf, bestehende Dokumentation und Master-Auftrag berücksichtigt. |
| 3 | ZUERST BESTANDSAUFNAHME – DANACH ÄNDERN | Geprüft | Version 4 vor Änderungen geöffnet; bestehende Funktionsregression zuerst erfolgreich ausgeführt. |
| 4 | REGRESSIONSSCHUTZ – NICHTS GUTES DARF VERLOREN GEHEN | Geprüft | Bestehende Inhalte und Abläufe erhalten; erneut getestete Spiel-, Labor- und Lernreisewege. |
| 5 | KEINE SCHEINFUNKTIONEN | Geprüft | Neue Bedienelemente haben konkrete Aktionen. Keine Coming-soon-Karten oder angekündigte Offline-Funktion. |
| 6 | VOLLAUDIT DER BESTEHENDEN WEBSITE | Teilweise geprüft | Navigation, Dialoge und Kernaktionen automatisiert; visuelle Layoutmatrix und reale Geräte bleiben offen. |
| 7 | DER 3D-GLOBUS IST DAS HERZSTÜCK | Verbessert | Echte drehbare Three.js-Kugel mit Länderwahl, OrbitControls, Zoom, Fokus und Reset erhalten; GPU-Ausgabe nicht getestet. |
| 8 | GLOBUS-LAYER | Beibehalten | 15 Themenansichten einschließlich Grenzen, Hauptstädten, Orientierung, Natur und Platten; gezielte Auswahl statt aller Ebenen zugleich. |
| 9 | INTELLIGENTE BESCHRIFTUNG | Verbessert | Drei Zoomstufen, ausgewählter Ort zuerst, naher Hauptstadtpunkt, Rückseiten-/Kollisionsfilter und Begrenzung sichtbarer Namen. |
| 10 | WEBGL-/3D-FEHLER ABFANGEN | Geprüft | Kontextverlust, Pausen und Freigabe im instrumentierten Three-Test; interaktive SVG-Alternative. Echter GPU-Speicherverbrauch offen. |
| 11 | ADAPTIVE GRAFIKQUALITÄT | Verbessert | Automatische kleinere Textur/Geometrie für kleine Bildschirme bzw. verfügbare geringe Gerätekapazität. Kein FPS-gesteuerter Qualitätsregler. |
| 12 | LÄNDER ALS RICHTIGE ENTDECKERKARTEN | Teilweise | Vorhandene Länderporträts mit Bevölkerung/Jahr, Fläche/Jahr, Hauptstadt, Sprache, Währung, Flagge und Lerninfos; nicht für jedes Gebiet individuelle Tier-/Sehenswürdigkeitskarten. |
| 13 | GEOGRAFISCHE UND WISSENSCHAFTLICHE KORREKTHEIT | Geprüft | Primärquellen und Datensätze mit Modellgrenzen erhalten; neue Planetenwerte anhand NASA geprüft. Keine vollständige redaktionelle Prüfung jeder Zahl nachgewiesen. |
| 14 | ERDSCHICHTEN | Beibehalten | Vier Erdschichten, feste/flüssige Zustände und Tiefenlabor; überhöhte Kruste als Modell erklärt. |
| 15 | PLATTENTEKTONIK | Beibehalten | Drei Plattenbewegungen, reale PB2002-Geometrien und beschleunigte Modelle mit korrektem Mantel-Hinweis. |
| 16 | VULKANLABOR | Verbessert | Vulkanlabor mit Gas/Zähigkeit/Ausbruch und Teile-Auswahl; Zustand wird gespeichert, Vorhersagegrenzen klar. |
| 17 | TAG UND NACHT | Beibehalten | 24-Stunden-Modell, Sonnenlicht und Tag/Nacht; Abspielen/Stoppen/Reset und Hintergrundpause. |
| 18 | JAHRESZEITEN | Verbessert | Jahreszeiten mit/ohne Achsneigung, Nord-/Südhalbkugel; Auswahl und Schalter gespeichert. |
| 19 | MOND | Verbessert | Mondphasen mit Sonnenlichtmodell, gespeicherter Stellung, Krater-/Apollo-/Schwerkraftwissen. |
| 20 | WETTER UND WASSERKREISLAUF | Verbessert | Wetter- und Wasserlabore erhalten; Zustandswechsel, Tröpfchen und qualitative Regler gespeichert. |
| 21 | KLIMA UND LEBENSRÄUME | Beibehalten | Vereinfachte Klimagürtel, Vegetationsbeispiele, Klima-Reise und Klima-Spiel mit Modellgrenzen. |
| 22 | TIERE UND LEBENSRÄUME | Beibehalten | Tierpunkte, Lebensraum-Spiele, Sortierung und Hinweise zu Anpassungen; keine erfundenen weltweiten Verbreitungsflächen. |
| 23 | NATUR UND LANDSCHAFTEN | Beibehalten | 40 Natur-/Tierorte; echte ausgewählte Fluss-/See-Geometrien; Naturatlas und Landschaftsreisen. |
| 24 | REKORDE DER ERDE | Beibehalten | Naturrekorde mit Messregel, etwa Höhe über Meeresspiegel und größte heiße/kalte Wüste. |
| 25 | „WARUM IST DAS SO?“ | Beibehalten | 30 Warum-Fragen mit Erklärungen, Vorlesen und Wissensfavoriten. |
| 26 | SPIELE – NICHT NUR QUIZ | Beibehalten | 22 Spielangebote mit Memory, Sortierung, Puzzles, Suche, Weltreise und Frage-Spielen. |
| 27 | SPIELDESIGN FÜR EIN 8-JÄHRIGES KIND | Verbessert | Freundliche Wiederholungsversuche, keine negativen Punkte; sichtbare schrittweise Hilfe und kein Zeitdruck. |
| 28 | HINWEISSYSTEM | Ergänzt | Gestufte Missions-/Quiz-/Fragespiel-Hinweise; grobe Region zeigen löst keine Mission. Nicht jeder Sortierschritt hat drei eigene Hinweise. |
| 29 | LERNREISEN | Geprüft | 16 Reisen mit fünf Kapiteln, Experiment/Anwendung, Rätsel und Stempel; alle Kapitel/Abschlüsse tatsächlich durchlaufen. |
| 30 | WIEDERHOLUNG UND ECHTES LERNEN | Teilweise | Fällige und falsch beantwortete Fragen zur Wiederholung, Erklärung und Datum; keine wissenschaftlich validierte Mastery-Diagnostik. |
| 31 | ADAPTIVE SCHWIERIGKEIT | Ergänzt | Frei wählbar Einfach/Normal/Knifflig, gespeichert und für laufende Runden eingefroren; keine automatische Leistungsklassifikation. |
| 32 | ENTDECKERPASS | Verbessert | Pass mit zwölf Abzeichen, fünf sanften Stufen, Favoriten, Reise-/Spiel-/Labor-/Missionsübersicht. |
| 33 | MOTIVATION OHNE SUCHTDESIGN | Beibehalten | Keine Streak-Strafe, Timer, öffentliche Konkurrenz oder manipulative Belohnungen; einmalige Aufgabenpunkte. |
| 34 | GANZ WICHTIG: SPIELSTAND DAUERHAFT SPEICHERN | Verbessert | Local-first-Fortschritt, Spielrunden, Kapitel, Ergebnisse, Notizen, Einstellungen, Labore und gemeinsam markierte Versuche gespeichert. |
| 35 | TECHNISCHE UMSETZUNG DES SPEICHERSTANDS | Geprüft | Versioniertes Schema 3, IndexedDB plus synchrones Journal; additive Felder mit Standardwerten. |
| 36 | AUTOSAVE | Geprüft | Journal nach Änderungen; gebündelte Datenbank-Schreibvorgänge plus pagehide/visibilitychange; Pause während Import. |
| 37 | FORTSCHRITT BEIM START WIEDERHERSTELLEN | Geprüft | Wiederherstellung/Validierung vor fortschrittsabhängigen Bereichen; neuester gültiger Stand. |
| 38 | „WEITERSPIELEN“ | Verbessert | Fortsetzen für Reise, exakte zufällige Spielrunde, Quiz, Ort und jetzt Labormodell. |
| 39 | UPDATES DÜRFEN SPIELSTÄNDE NICHT LÖSCHEN | Geprüft | Alte Version-3-Sicherungen und Legacy-v2-Daten erhalten; künftiges Schema wird nicht überschrieben. |
| 40 | DEFEKTE SPEICHERSTÄNDE | Geprüft | Ungültige Felder begrenzen, beschädigte Einträge behandeln, ungültige/future Imports ablehnen; blockierte Speicher nutzbar melden. |
| 41 | SPIELSTAND ZURÜCKSETZEN | Geprüft | Bestätigtes Zurücksetzen einschließlich Migrationsquelle; Export vorher verfügbar. |
| 42 | SPIELSTAND EXPORTIEREN UND IMPORTIEREN | Geprüft | JSON-Export/Import mit Datei-Prüfung und Ersetzungsdialog; Fehler ersetzen weder aktiven Pass noch seinen Exportinhalt. Realer Download im Test abgefangen. |
| 43 | KEIN ACCOUNTZWANG | Beibehalten | Öffentliche Website, kein eigener Lern-Account; Fortschritt geräte-/browserbezogen. |
| 44 | DATENSCHUTZ UND KINDERSCHUTZ | Beibehalten | Kein Name, Chat, Werbung, eigenes Lernbackend oder öffentliche Profile; Hinweise auf Browserdatenlöschung. |
| 45 | FORSCHER-NOTIZBUCH | Beibehalten | Echte gespeicherte Notizen mit Entfernen/Vorlesen; Lieblingsorte, Wörter und Warum-Antworten. |
| 46 | ZUFALLSENTDECKER | Beibehalten | Zufällige möglichst neue Länder, Meere und Naturorte plus tägliche Entdeckung. |
| 47 | VERSTECKTE ENTDECKUNGEN | Teilweise | Naturrekorde/Entdeckungen und aus tatsächlichen Aufgaben abgeleitete Abzeichen; keine neue Geheimnis-Sammelmechanik. |
| 48 | MINI-EXPERIMENTE | Verbessert | Sechs gemeinsame Offline-Versuche mit Erwachsenenhinweisen und gespeicherten Selbstauskunft-Markierungen. |
| 49 | WISSENSBUCH | Beibehalten | 90 Wörter, 30 Warum-Fragen, Notizen, Naturatlas und Länderatlas; Suche und Vorlesen. |
| 50 | SUCHFUNKTION | Beibehalten | Bereichsübergreifende Suche mit einfachen Tippfehlerhilfen; passende Orte/Reisen/Wörter öffnen. |
| 51 | VORLESEFUNKTION | Verbessert | Vorlesen/Stoppen, gespeichertes Tempo, deutsche Stimme soweit verfügbar; einfacher Quiz-Modus spricht nur sichtbare Antworten. |
| 52 | SOUND | Geprüft | Dezente optionale Erfolgstöne, global gespeichert, standardmäßig aus; keine Dauermusik. |
| 53 | DESIGN-SYSTEM | Beibehalten | Bestehende Farben, Karten, Typografie und Komponenten weiterverwendet; keine neue Ersatzgestaltung. Visuelle Endprüfung offen. |
| 54 | VISUELLE HIERARCHIE | Verbessert | Lernziele, schrittweise Hilfe und aufklappbare Passübersicht; keine zusätzlichen Hauptnavigationsebenen. |
| 55 | STARTSEITE | Beibehalten | Weltkugel als direkter Einstieg, fünf Hauptbereiche, konkrete Mission und Fortsetzen-Angebot. |
| 56 | DOPPELTE INHALTE UND UI-ELEMENTE | Geprüft | Ein aktives Spiel statt zwei paralleler Spielbereiche; falsche Tabs durch Auswahlgruppen ersetzt; Inhalte erhalten. |
| 57 | MOBILE FIRST | Teilweise geprüft | Responsive Regeln, mindestens 44-px-Modellknöpfe, begrenzte Dialoghöhe und umbrochene Namen; echte Smartphone-/Tablet-Layouts offen. |
| 58 | DRAG & DROP AUF MOBILGERÄTEN | Geprüft | Sortieren/Puzzle per Antippen und Tastatur zusätzlich zum Ziehen; bestehende Abläufe durchgespielt. |
| 59 | BARRIEREFREIHEIT | Verbessert | Benannte Regler-Griffe und Auswahlknöpfe; 44 strukturelle axe-Audits ohne verbliebene Regelverstöße. Kontrast/Screenreader real offen. |
| 60 | REDUCED MOTION | Beibehalten | Systempräferenz und gespeicherter Weniger-Bewegung-Schalter; CSS/Globus berücksichtigen beide. |
| 61 | PERFORMANCE | Verbessert | Sekundäre Bereiche erst nach Öffnen, Geografiedaten nach Bedarf, kleinere Grafikvariante, begrenzte Atlas-/Suchlisten. |
| 62 | LADEERLEBNIS | Beibehalten | Lade-/Fehlertexte, Kartendaten-Wiederholen, Erhalt des gespeicherten Passes; keine leere defekte Fläche. |
| 63 | CORE WEB VITALS | Offen | Keine reale Browser-Messung von LCP/INP/CLS. Bundle/Build und Logik geprüft; keine erfundenen Kennzahlen. |
| 64 | OFFLINE/PWA PRÜFEN | Geprüft, nicht umgesetzt | Offline/PWA abgewogen: kein vollständiger Cache/Service Worker. Nur geladene Inhalte teils offline, klar in der Oberfläche erklärt. |
| 65 | CODEQUALITÄT | Verbessert | Eigene Speicher-/Modell-/Hilfen-/Pass-/Eltern-/Sonnensystemmodule; TypeScript und Build. Kein kompletter Code-Neubau. |
| 66 | ZENTRALES DATENMODELL | Beibehalten | Zentrale Datensätze für Erde, Lernreisen, Quiz, Wissensbuch und Natur; neues gespeichertes Schema bleibt zentral. |
| 67 | FEHLERBEHANDLUNG | Geprüft | Fehlergrenzen, Karten-Retry, Context-Loss-Fallback, Importvalidierung und Speicherstatus. |
| 68 | KEINE CONSOLE-FEHLER | Teilweise geprüft | Keine unerwarteten Anwendungs-/React-Fehler in geprüften Abläufen; reale Browser-/GPU-Konsole nicht verfügbar. |
| 69 | BILDER UND ILLUSTRATIONEN | Beibehalten | Drei echte NASA/NOAA-Fotos und zwölf lokale MIT-Flaggen; genaue Modelle als SVG/Geometrie, keine erfundenen Fotobelege. |
| 70 | CONTENT DESIGN FÜR 8-JÄHRIGE | Verbessert | Kurze Lernziele, konkrete Beobachtungsfragen, gestufte Hilfen und Modellgrenzen; redaktionelle Kontrolle statt zusätzlicher langer Textwände. |
| 71 | PÄDAGOGISCHE QUALITÄT | Verbessert | Vermuten–ändern–beobachten–erklären, frei gewähltes Tempo, Wiederholung und Unterscheidung zwischen Besuch und verstandenem Abschluss. |
| 72 | ELTERN-/LEHRERBEREICH | Ergänzt | Eigener Eltern-/Lehrkräftedialog mit kurzem Lernweg, Lernzielen, Einstellungen, Sicherheit und Grenzen. |
| 73 | FORTSCHRITTSÜBERSICHT FÜR DAS KIND | Ergänzt | Lernlandkarte mit 16 Reisen, erkundeten Kapiteln, nächster Reise und entdeckten Ländern. |
| 74 | KEINE ÖFFENTLICHEN RANGLISTEN | Beibehalten | Keine Ranglisten oder öffentliche Leistungsprofile. |
| 75 | QUALITÄT DER ANIMATIONEN | Beibehalten | Zweckgebundene Drehung, Jahreszeiten-/Mond-/Wellenmodelle; keine dauernde Belohnungsanimation. |
| 76 | PERFORMANCE DER ANIMATIONEN | Geprüft | Rendering erreicht Ruhe; Hintergrund-/Sichtbarkeitspause und cleanup im instrumentierten Three-Test. Geräte-FPS offen. |
| 77 | TESTMATRIX | Offen | Reale Chrome/Firefox/Edge/Safari-/iPhone-/Android- und Größenmatrix nicht verfügbar; DOM-Gesten und kleinere Grafikpolitik sind kein Ersatznachweis. |
| 78 | BESONDERS WICHTIGE PERSISTENZTESTS | Teilweise geprüft | A–G als App-Neumount/IndexedDB-/Journal-/UI-Backup-Prüfungen. Ein echter Browser-Neustart und reale Dateiübertragung nicht simuliert als bestanden. |
| 79 | BACK-/FORWARD-VERHALTEN | Beibehalten | Hash-Hauptbereiche und History-Back/Forward; keine absichtliche Browser-Zurück-Sperre. |
| 80 | FOKUS AUF FLÜSSIGKEIT | Verbessert | Bedingtes Laden/Rendern, Grafikreduktion und Kontext-Cleanup; subjektive Geräteflüssigkeit nicht vermessen. |
| 81 | PRIORISIERUNG | Vorgehen | Baseline/Speicherung/Kernbedienung vor Ergänzungen; kein neues Backend oder Ersatzprodukt. |
| 82 | NICHT ÜBERLADEN | Verbessert | Sekundäres erst öffnen, Details aufklappen, Hinweise schrittweise; Start bleibt Globus. |
| 83 | KEINE VERSCHLECHTERUNG DURCH „OPTIMIERUNG“ | Geprüft | Inhaltszahlen erhalten; vorhandene Abläufe nach Erweiterung erneut geprüft; unveränderte Speicheridentität. |
| 84 | SELBSTSTÄNDIG NEUE IDEEN FINDEN | Ergänzt | Speicherbare Modellzustände, eingefrorene Quiz-Stufe, Sonnensystem-Abstandsvergleich und gemeinsame Versuchsmarkierungen. |
| 85 | ABER KEIN FEATURE-CREEP | Vorgehen | Keine zusätzlichen Konten, Chats, Ranglisten, Cache-Risiken oder ungetesteten großen Spiele. |
| 86 | BESTEHENDE FUNKTIONEN VOR NEUEN FUNKTIONEN | Vorgehen | Funktionsregression vor Ergänzungen; nur sinnvolle und tatsächlich bedienbare neue Bereiche. |
| 87 | FERTIGSTELLUNG | Umgesetzt | Bestehendes Site-Projekt tatsächlich geändert; konkreter Build und Veröffentlichung über denselben Projektzugang. |
| 88 | NACH DER IMPLEMENTIERUNG: VOLLSTÄNDIGER REGRESSIONSTEST | Teilweise geprüft | Umfangreiche automatisierte Regression für vorhandene/neue Wege; visuelle, reale Geräte-/GPU-Prüfung bleibt offen. |
| 89 | DEFINITION OF DONE | Teilweise erfüllt | Implementierung und automatisierte Prüfungen erfüllt; echte GPU-/Geräte-/Browser-Neustart-/Performance-/Layout-Nachweise fehlen. Keine pauschale Vollerfüllung. |
| 90 | ABSCHLUSSBERICHT | Dokumentiert | Abschlussbericht nennt Beibehalten, Behoben, Verbessert, Neu, Spielstand, Performance, Mobile, Lernen, Tests und offene Grenzen. |
| 91 | LETZTE UND WICHTIGSTE ANWEISUNG | Vorgehen | Produktzusammenhang statt bloßer Featureliste: bestehende Lernwelt erhalten, echten Wiederkehrwert und kontrollierte Erweiterungen schaffen. |
