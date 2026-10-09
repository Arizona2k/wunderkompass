# Weltentdecker-Ausbau: Umsetzungs- und Prüfmatrix

> Historischer Prüfstand. Der fortgeführte Ausbau und die Prüfungen vom 9. Oktober 2026 stehen in [QA.md](QA.md). Aussagen über damals fehlende Offline-/Browserfunktionen sind keine Beschreibung des heutigen Stands.


Stand: 7. Oktober 2026. Ausgangspunkt: veröffentlichte Version 5, Commit `42f85186eedb67c5bd43570c459e6f804e8c2deb`.

## Ergebnis und Reihenfolge

Phase 1 wurde vor dem Ausbau sichtbar und durch Bedienung geprüft und nachgebessert. Anschließend wurde Phase 2 umgesetzt und gegen den Erweiterungsauftrag geprüft. Automatisierte DOM-Prüfungen werden nicht als visuelle Browserprüfung ausgegeben. Das abschließende Speichern und Veröffentlichen erfolgt über Sites nach den unten dokumentierten Prüfungen.

Die Matrix verwendet die gewünschten Kategorien. „Vollständig umgesetzt“ bezieht sich auf das vorhandene Funktionsangebot und die jeweils genannten Nachweise, nicht auf eine pauschal bestandene Browser-/Geräteprüfung. Eine fehlende Prüfinfrastruktur wird nicht als „technisch nicht sinnvoll“ umetikettiert. Keiner der geforderten Browsernachweise ist grundsätzlich technisch sinnlos.

## Tatsächlich sichtbare Prüfung – Phase 1 abgeschlossen

Der direkte Testbrowser wurde nach ausdrücklicher Freigabe des Nutzers eingerichtet. Der vollständige Produktionsbuild läuft dabei in echtem Chrome 153 mit WebGL über SwiftShader; DOM-Nachbildungen werden nicht als Bildnachweis verwendet.

- 157 Ansichten aufgenommen und auf sichtbares Layout, kaputte Bilder, Überläufe und Anwendungsfehler geprüft: Startseite, Schichten, Tag/Nacht, 16 Reisen mit allen 80 Kapiteln, 20 konkrete Spiele plus Quiz/Mission, elf Labore, fünf Buchbereiche, Suche und Pass. Sechs Breiten: 360, 390, 768, 1024, 1366 und 1920 Pixel.
- Die komplette Reise wurde auch bedient: alle 16 Abschlussrätsel tatsächlich gelöst. Länderwahl, Mission und Favorit über Reload und Fortsetzen geprüft.
- Kontrastprobleme, mobile Header-Beschriftung und Tastaturzugang zur Weltreise-Leiste korrigiert; die betroffenen Ansichten separat erneut mit echten Farbkontrasten geprüft.
- Zu lange Länder-Seiten verbessert: ausführliches Porträt nutzt die breite Fläche, die Mission liegt direkt unter dem Globus. Zusätzliche Orientierungslinien sind aufklappbar.
- Neue präzise Lern-Grafiken für Erdschichten, Kontinente/Länder, Navigation, Klimagürtel, Jahreszeiten und Wasserzustände; keine dekorativen Fantasiekarten. Leere Wolkenmodell-Fläche hat einen verständlichen Ausgangshinweis.
- Echte Touch-Ereignisse im mobilen Chrome bewegen die gerenderte 3D-Kugel; Zwei-Finger-Eingaben und Elternbereich bedient. Keine Behauptung eines physischen iPhone-Tests.
- Manifest, lokale Icons und ausdrücklich aktivierbare, versionierte Offline-Vorbereitung ergänzt. Alle vier zuvor ungeöffneten sekundären Bereiche laden nach Offline-Reload. Tatsächlicher JSON-Download geprüft.
- Chrome vollständig geschlossen, mit demselben eigenen Prüfprofil ohne Internet neu gestartet: Mission, Lieblingsort, Schrift-Einstellung und Fortsetzen nach Deutschland erhalten.
- Der bekannte ID-Startfehler bleibt korrigiert. Produktionsbuild ohne Anwendungsfehler; Zurück/Vor in Chrome geprüft. TypeScript erfolgreich.

Prüfgrenzen: keine physischen iOS-/Android-Geräte, kein Safari/Firefox und kein echtes Screenreader-Gerät verfügbar. Software-WebGL ersetzt keinen Geräte-FPS-Test. Laborwerte sind keine repräsentativen Core Web Vitals echter Besucher. Diese Grenzen sind keine fehlenden Produktfunktionen.

## Vorheriger Master-Auftrag: alle 91 Punkte

| Nr. | Auftragspunkt | Kategorie | Befund und tatsächliche Prüfgrenze |
| --- | --- | --- | --- |
| 1 | DEINE ROLLE | vollständig umgesetzt | Bestehendes Produkt übernehmen; Technik, Lerninhalte und Zugänglichkeit gemeinsam berücksichtigen. |
| 2 | NUTZE DEN GESAMTEN BISHERIGEN CHAT | vollständig umgesetzt | Veröffentlichten Stand, sichtbaren Projektverlauf, bestehende Dokumentation und Master-Auftrag berücksichtigt. |
| 3 | ZUERST BESTANDSAUFNAHME – DANACH ÄNDERN | vollständig umgesetzt | Veröffentlichte Version 5 und unveränderten Checkout zuerst geöffnet. Danach echte Browser-Startseite und Länderbedienung sowie Funktionsregression geprüft. |
| 4 | REGRESSIONSSCHUTZ – NICHTS GUTES DARF VERLOREN GEHEN | vollständig umgesetzt | Bestehende Inhalte und Abläufe erhalten; erneut getestete Spiel-, Labor- und Lernreisewege. |
| 5 | KEINE SCHEINFUNKTIONEN | vollständig umgesetzt | Neue Bedienelemente haben konkrete Aktionen. Keine Coming-soon-Karten oder angekündigte Offline-Funktion. |
| 6 | VOLLAUDIT DER BESTEHENDEN WEBSITE | vollständig umgesetzt | 157 echte Browseransichten plus erneute Zielprüfungen; alle sechs geforderten Breiten. Visuelle und bedienbare Prüfung abgeschlossen. |
| 7 | DER 3D-GLOBUS IST DAS HERZSTÜCK | verbessert gegenüber der ursprünglichen Anforderung | Echte Three-Kugel im Chrome-Produktionsbuild gerendert; Touch-Drag und Pinch bedient, funktionale SVG-Alternative erhalten. |
| 8 | GLOBUS-LAYER | vollständig umgesetzt | 15 Themenansichten einschließlich Grenzen, Hauptstädten, Orientierung, Natur und Platten; gezielte Auswahl statt aller Ebenen zugleich. |
| 9 | INTELLIGENTE BESCHRIFTUNG | verbessert gegenüber der ursprünglichen Anforderung | Drei Zoomstufen, ausgewählter Ort zuerst, naher Hauptstadtpunkt, Rückseiten-/Kollisionsfilter und Begrenzung sichtbarer Namen. |
| 10 | WEBGL-/3D-FEHLER ABFANGEN | verbessert gegenüber der ursprünglichen Anforderung | Bedienbare SVG-Alternative und kontrollierter Kontextverlust/Ressourcenabbau geprüft; echte WebGL-Ausgabe zusätzlich vorhanden. |
| 11 | ADAPTIVE GRAFIKQUALITÄT | verbessert gegenüber der ursprünglichen Anforderung | Automatische kleinere Textur/Geometrie für kleine Bildschirme bzw. verfügbare geringe Gerätekapazität. Kein FPS-gesteuerter Qualitätsregler. |
| 12 | LÄNDER ALS RICHTIGE ENTDECKERKARTEN | vollständig umgesetzt | Kindgerechte Länderporträts mit seriösen Daten, Jahr und rund-Werten, Flaggen, Fakten und Globuswahl. Optionale Einzelporträts für jedes Gebiet nicht vorgeschrieben; breite Darstellung verbessert. |
| 13 | GEOGRAFISCHE UND WISSENSCHAFTLICHE KORREKTHEIT | verbessert gegenüber der ursprünglichen Anforderung | Bestehende Erd-/Reise-/Quiztexte redaktionell erneut gelesen; Primärquellen und Datenjahre erhalten. Kontinentübergreifende Länder korrigiert. Neue 90 Themen anhand offizieller Forschungs-, Museums-, Natur- und Technikquellen geprüft; Rekord-Messregeln und Modellgrenzen erklärt. Keine Behauptung einer Neuberechnung jeder alten Länderstatistik. |
| 14 | ERDSCHICHTEN | vollständig umgesetzt | Vier Erdschichten, feste/flüssige Zustände und Tiefenlabor; überhöhte Kruste als Modell erklärt. |
| 15 | PLATTENTEKTONIK | vollständig umgesetzt | Drei Plattenbewegungen, reale PB2002-Geometrien und beschleunigte Modelle mit korrektem Mantel-Hinweis. |
| 16 | VULKANLABOR | verbessert gegenüber der ursprünglichen Anforderung | Vulkanlabor mit Gas/Zähigkeit/Ausbruch und Teile-Auswahl; Zustand wird gespeichert, Vorhersagegrenzen klar. |
| 17 | TAG UND NACHT | vollständig umgesetzt | 24-Stunden-Modell, Sonnenlicht und Tag/Nacht; Abspielen/Stoppen/Reset und Hintergrundpause. |
| 18 | JAHRESZEITEN | verbessert gegenüber der ursprünglichen Anforderung | Jahreszeiten mit/ohne Achsneigung, Nord-/Südhalbkugel; Auswahl und Schalter gespeichert. |
| 19 | MOND | verbessert gegenüber der ursprünglichen Anforderung | Mondphasen mit Sonnenlichtmodell, gespeicherter Stellung, Krater-/Apollo-/Schwerkraftwissen. |
| 20 | WETTER UND WASSERKREISLAUF | verbessert gegenüber der ursprünglichen Anforderung | Wetter- und Wasserlabore erhalten; Zustandswechsel, Tröpfchen und qualitative Regler gespeichert. |
| 21 | KLIMA UND LEBENSRÄUME | vollständig umgesetzt | Vereinfachte Klimagürtel, Vegetationsbeispiele, Klima-Reise und Klima-Spiel mit Modellgrenzen. |
| 22 | TIERE UND LEBENSRÄUME | verbessert gegenüber der ursprünglichen Anforderung | Vorhandene Tierpunkte und Spiele erhalten; 20 ausführliche Tierkarten mit Lebensraum, Nahrung, Größenregel, Schutz, Beispielregion auf dem Globus und Mini-Frage ergänzt. |
| 23 | NATUR UND LANDSCHAFTEN | vollständig umgesetzt | 40 Natur-/Tierorte; echte ausgewählte Fluss-/See-Geometrien; Naturatlas und Landschaftsreisen. |
| 24 | REKORDE DER ERDE | vollständig umgesetzt | Naturrekorde mit Messregel, etwa Höhe über Meeresspiegel und größte heiße/kalte Wüste. |
| 25 | „WARUM IST DAS SO?“ | vollständig umgesetzt | 30 Warum-Fragen mit Erklärungen, Vorlesen und Wissensfavoriten. |
| 26 | SPIELE – NICHT NUR QUIZ | verbessert gegenüber der ursprünglichen Anforderung | 22 bisherige plus acht neue Spielangebote. Chronologisches Ordnen mit Auf/Ab, Tier-/Personen-/Technik-Detektive, Lebensräume, Nahrung, Rekorde und Damals/Heute. |
| 27 | SPIELDESIGN FÜR EIN 8-JÄHRIGES KIND | verbessert gegenüber der ursprünglichen Anforderung | Freundliche Wiederholungsversuche, keine negativen Punkte; sichtbare schrittweise Hilfe und kein Zeitdruck. |
| 28 | HINWEISSYSTEM | verbessert gegenüber der ursprünglichen Anforderung | Gestufte Missions-/Quiz-/Fragespiel-Hinweise; grobe Region zeigen löst keine Mission. Nicht jeder Sortierschritt hat drei eigene Hinweise. |
| 29 | LERNREISEN | verbessert gegenüber der ursprünglichen Anforderung | Alle 16 bestehenden Reisen mit 80 Kapiteln und Abschlussrätseln bedient. Zusätzlich drei neue fünfstufige Weltreisen; Mini-Fragen als Lernabschluss, exakte Station nach Reload erhalten. |
| 30 | WIEDERHOLUNG UND ECHTES LERNEN | vollständig umgesetzt | Falsche/fällige Fragen werden gespeichert, erklärt und wiederholt; Themen sind mit Reisen, Spielen und Globus verbunden. Keine schulische Leistungsdiagnose behauptet. |
| 31 | ADAPTIVE SCHWIERIGKEIT | verbessert gegenüber der ursprünglichen Anforderung | Frei wählbar Einfach/Normal/Knifflig, gespeichert und für laufende Runden eingefroren; keine automatische Leistungsklassifikation. |
| 32 | ENTDECKERPASS | verbessert gegenüber der ursprünglichen Anforderung | Zwölf bestehende plus sieben neue verdiente Abzeichen, fünf sanfte Stufen, Favoriten sowie Reise-/Spiel-/Labor-/Missionsübersicht. Alle sieben neuen Bedingungen durch echte Bedienung erreicht. |
| 33 | MOTIVATION OHNE SUCHTDESIGN | vollständig umgesetzt | Keine Streak-Strafe, Timer, öffentliche Konkurrenz oder manipulative Belohnungen; einmalige Aufgabenpunkte. |
| 34 | GANZ WICHTIG: SPIELSTAND DAUERHAFT SPEICHERN | verbessert gegenüber der ursprünglichen Anforderung | Zentrales Schema 3 erhalten, neue Themen/Runden/Modelle integriert. Reale alte Sicherung importiert; vollständiger Browser-Neustart offline mit altem und erweitertem Pass erfolgreich. |
| 35 | TECHNISCHE UMSETZUNG DES SPEICHERSTANDS | vollständig umgesetzt | Versioniertes Schema 3, IndexedDB plus synchrones Journal; additive Felder mit Standardwerten. |
| 36 | AUTOSAVE | vollständig umgesetzt | Journal nach Änderungen; gebündelte Datenbank-Schreibvorgänge plus pagehide/visibilitychange; Pause während Import. |
| 37 | FORTSCHRITT BEIM START WIEDERHERSTELLEN | vollständig umgesetzt | Wiederherstellung/Validierung vor fortschrittsabhängigen Bereichen; neuester gültiger Stand. |
| 38 | „WEITERSPIELEN“ | verbessert gegenüber der ursprünglichen Anforderung | Fortsetzen für bisherige Reisen, Quiz, Orte, Spiele und Labore sowie neue Entdeckerkarten, Weltreisen, Modelle und exakt gleiche zufällige Welt-Spielrunde. |
| 39 | UPDATES DÜRFEN SPIELSTÄNDE NICHT LÖSCHEN | verbessert gegenüber der ursprünglichen Anforderung | Alte Schema-3- und Legacy-v2-Daten kompatibel. Echtes explizites Service-Worker-Update mit Erhalt von Missionen, Favoriten, Einstellungen und erweiterten Spiel-/Modellzuständen. |
| 40 | DEFEKTE SPEICHERSTÄNDE | vollständig umgesetzt | Ungültige Felder begrenzen, beschädigte Einträge behandeln, ungültige/future Imports ablehnen; blockierte Speicher nutzbar melden. |
| 41 | SPIELSTAND ZURÜCKSETZEN | verbessert gegenüber der ursprünglichen Anforderung | Bestätigtes Zurücksetzen einschließlich Migrationsquelle und Exportmöglichkeit. Gefundene Race Condition beim noch offenen Thema korrigiert; realer Reset hat null Entdeckungen, anschließender Import reproduziert den Pass. |
| 42 | SPIELSTAND EXPORTIEREN UND IMPORTIEREN | vollständig umgesetzt | JSON-Export/Import mit Datei-Prüfung und Ersetzungsdialog; Fehler ersetzen weder aktiven Pass noch seinen Exportinhalt. Realer Download im Test abgefangen. |
| 43 | KEIN ACCOUNTZWANG | vollständig umgesetzt | Öffentliche Website, kein eigener Lern-Account; Fortschritt geräte-/browserbezogen. |
| 44 | DATENSCHUTZ UND KINDERSCHUTZ | vollständig umgesetzt | Kein Name, Chat, Werbung, eigenes Lernbackend oder öffentliche Profile; Hinweise auf Browserdatenlöschung. |
| 45 | FORSCHER-NOTIZBUCH | verbessert gegenüber der ursprünglichen Anforderung | Bestehende Notizen, Wörter, Warum-Fragen und Lieblingsorte erhalten; markierte neue Tiere, Ereignisse, Personen, Erfindungen, Bauwerke und Wissenschaftsthemen integriert. |
| 46 | ZUFALLSENTDECKER | verbessert gegenüber der ursprünglichen Anforderung | Zufällige möglichst neue Erdorte erhalten; Tagesentdeckung rotiert zusätzlich durch sechs neue Weltkategorien ohne tägliche Nutzungspflicht. |
| 47 | VERSTECKTE ENTDECKUNGEN | vollständig umgesetzt | Optionale Entdeckungen wie Everest, tiefste Meeresstelle und Pole vorhanden; keine zufällige Belohnung nötig. |
| 48 | MINI-EXPERIMENTE | verbessert gegenüber der ursprünglichen Anforderung | Sechs gemeinsame Offline-Versuche mit Erwachsenenhinweisen und gespeicherten Selbstauskunft-Markierungen. |
| 49 | WISSENSBUCH | verbessert gegenüber der ursprünglichen Anforderung | 90 Wörter, 30 Warum-Fragen, Natur-/Länderatlas und Notizen erhalten. Zentrale Merkliste und Wiederholungsfragen der neuen Weltkarten hinzugefügt. |
| 50 | SUCHFUNKTION | verbessert gegenüber der ursprünglichen Anforderung | Alle sechs neuen Kategorien und Such-Aliase integriert. Elefant, Einstein, Auto, 9/11, Pyramiden und Internet führen in echter Browserbedienung zu passenden Inhalten; sensible Vorschautexte bleiben ruhig. |
| 51 | VORLESEFUNKTION | verbessert gegenüber der ursprünglichen Anforderung | Vorlesen/Stoppen, gespeichertes Tempo, deutsche Stimme soweit verfügbar; einfacher Quiz-Modus spricht nur sichtbare Antworten. |
| 52 | SOUND | vollständig umgesetzt | Dezente optionale Erfolgstöne, global gespeichert, standardmäßig aus; keine Dauermusik. |
| 53 | DESIGN-SYSTEM | verbessert gegenüber der ursprünglichen Anforderung | Gemeinsame Farben, Abstände, Karten und lesbare Kontraste; visuelle Gesamtprüfung und gezielte Korrekturen. |
| 54 | VISUELLE HIERARCHIE | verbessert gegenüber der ursprünglichen Anforderung | Lernziel, Bild/Diagramm, Interaktion, optionale Vertiefung und Mini-Frage in einheitlichen Karten; neue Welten über einen zusätzlichen Hauptbereich erreichbar. |
| 55 | STARTSEITE | verbessert gegenüber der ursprünglichen Anforderung | Weltkugel bleibt der direkte Einstieg. Fünf bestehende Hauptbereiche plus Mehr entdecken; dort sechs Themenwelten, drei Reisen und aufklappbare Missionen statt 40 Menüpunkten. |
| 56 | DOPPELTE INHALTE UND UI-ELEMENTE | verbessert gegenüber der ursprünglichen Anforderung | Ein aktives Spiel statt zwei paralleler Spielbereiche; falsche Tabs durch Auswahlgruppen ersetzt; Inhalte erhalten. |
| 57 | MOBILE FIRST | vollständig umgesetzt | Sechs echte Chrome-Viewport-Breiten geprüft, Überläufe behoben und echte Touch-Eingaben bedient. Physische Geräte als zusätzliche Prüfmöglichkeit offen. |
| 58 | DRAG & DROP AUF MOBILGERÄTEN | vollständig umgesetzt | Sortieren/Puzzle per Antippen und Tastatur zusätzlich zum Ziehen; bestehende Abläufe durchgespielt. |
| 59 | BARRIEREFREIHEIT | verbessert gegenüber der ursprünglichen Anforderung | Strukturelle DOM-Audits plus reale axe-Prüfungen einschließlich Kontrast; gefundene Benennungs-/Fokus-/Kontrastbefunde behoben. Screenreader-Geräteprüfung nicht verfügbar. |
| 60 | REDUCED MOTION | verbessert gegenüber der ursprünglichen Anforderung | Systempräferenz und gespeicherter Weniger-Bewegung-Schalter; CSS/Globus berücksichtigen beide. |
| 61 | PERFORMANCE | verbessert gegenüber der ursprünglichen Anforderung | Schwere sekundäre Inhalte erst nach Öffnen, Geografiedaten nach Bedarf, adaptive Grafik. Kleine Reise-Weltkarte nutzt memoisiertes vereinfachtes SVG; Originalgeometrie für Globus und Länderwahl unverändert. Laborprüfung: große Weltartikel-/Spielmodule beim ersten Start nicht geladen. |
| 62 | LADEERLEBNIS | vollständig umgesetzt | Lade-/Fehlertexte, Kartendaten-Wiederholen, Erhalt des gespeicherten Passes; keine leere defekte Fläche. |
| 63 | CORE WEB VITALS | teilweise umgesetzt | PerformanceObserver misst LCP, CLS und Interaktionsereignisse im lokalen echten Chrome-Produktionsbuild. Diese Laborwerte sind keine repräsentativen Feld-Core-Web-Vitals auf Besuchergeräten; keine erfundenen INP-/FPS-Garantien. |
| 64 | OFFLINE/PWA PRÜFEN | verbessert gegenüber der ursprünglichen Anforderung | Opt-in-PWA mit lokalem Manifest/Icons, atomarem vollständigem Cache, Build-Fingerprint, explizitem Update und Erhalt des vorherigen Caches. Altes Profil auf neue Version aktualisiert und Chrome komplett geschlossen/neu offline gestartet; neue und bisherige sekundäre Inhalte nutzbar. |
| 65 | CODEQUALITÄT | verbessert gegenüber der ursprünglichen Anforderung | Eigene Speicher-/Modell-/Hilfen-/Pass-/Eltern-/Sonnensystemmodule; TypeScript und Build. Kein kompletter Code-Neubau. |
| 66 | ZENTRALES DATENMODELL | verbessert gegenüber der ursprünglichen Anforderung | Erde, Reisen, Quiz, Buch und Weltkarten in gemeinsamem Schema 3. Keine zweite Speicherlogik; zentrale gespeicherte Runden und additive Themen-/Modell-/Abzeichen-IDs. |
| 67 | FEHLERBEHANDLUNG | vollständig umgesetzt | Fehlergrenzen, Karten-Retry, Context-Loss-Fallback, Importvalidierung und Speicherstatus. |
| 68 | KEINE CONSOLE-FEHLER | vollständig umgesetzt | Keine Anwendungsfehler im vollständigen Chrome-Durchgang und den Offline-/Neustart-Tests. Gefundene Fehler vor dem Ausbau korrigiert. |
| 69 | BILDER UND ILLUSTRATIONEN | verbessert gegenüber der ursprünglichen Anforderung | Bestehende Bilder erhalten; 31 echte lizenzierte neue Fotos lokal, mit passendem Alt-Text und Bildnachweis. Zweckgebundene Karten, Zeitleisten, Maßstabsdiagramme und neun Modelle statt beliebiger Dekoration. |
| 70 | CONTENT DESIGN FÜR 8-JÄHRIGE | verbessert gegenüber der ursprünglichen Anforderung | Kurze Lernziele, konkrete Beobachtungsfragen, gestufte Hilfen und Modellgrenzen; redaktionelle Kontrolle statt zusätzlicher langer Textwände. |
| 71 | PÄDAGOGISCHE QUALITÄT | verbessert gegenüber der ursprünglichen Anforderung | Vermuten–ändern–beobachten–erklären, frei gewähltes Tempo, Wiederholung und Unterscheidung zwischen Besuch und verstandenem Abschluss. |
| 72 | ELTERN-/LEHRERBEREICH | verbessert gegenüber der ursprünglichen Anforderung | Eltern-/Lehrkräftedialog um Welt-Themen, sensible Geschichte und korrekte Offline-Anleitung ergänzt; mobiler Kontrast korrigiert. Keine physischen Geräte-/Stimmenprüfungen vorgetäuscht. |
| 73 | FORTSCHRITTSÜBERSICHT FÜR DAS KIND | verbessert gegenüber der ursprünglichen Anforderung | Bestehende Landkarte mit 16 Reisen erhalten; neue Weltreisen, fünf verständliche Missionen, Themen-/Modellfortschritt und sieben Abzeichen im gemeinsamen Pass sichtbar. |
| 74 | KEINE ÖFFENTLICHEN RANGLISTEN | vollständig umgesetzt | Keine Ranglisten oder öffentliche Leistungsprofile. |
| 75 | QUALITÄT DER ANIMATIONEN | vollständig umgesetzt | Zweckgebundene Animationen und Steuerelemente im echten Browser sichtbar geprüft; reduzierte Bewegung berücksichtigt. |
| 76 | PERFORMANCE DER ANIMATIONEN | teilweise umgesetzt | Idle-Render, Hintergrund-/Sichtbarkeitspause und Ressourcen-Cleanup instrumentiert geprüft. Echte Chrome-Software-WebGL-Ausgabe und native Touch-Eingaben zusätzlich geprüft; keine FPS-Messung auf physischem Mobilgerät. |
| 77 | TESTMATRIX | teilweise umgesetzt | Echtes Chrome 153 auf sechs Viewport-Breiten von 360 bis 1920; mobile Touch-Drag/Pinch, Tap-Sortierung und Dialoge bedient. Safari/Firefox/Edge, physisches iOS/Android und echtes Screenreader-Gerät hier nicht verfügbar. |
| 78 | BESONDERS WICHTIGE PERSISTENZTESTS | verbessert gegenüber der ursprünglichen Anforderung | Instrumentierte umfassende Speicherregression plus tatsächlicher Dateiexport/Reset/Import, alte Schema-3-Datei, explizites Offline-Update, vollständiger Chrome-Neustart offline und exakt erhaltene Zufallsrunde bei Frage 2. |
| 79 | BACK-/FORWARD-VERHALTEN | vollständig umgesetzt | Direktlink, Reload, Chrome-Neustart und echtes Browser-Zurück/Vor zusätzlich geprüft. |
| 80 | FOKUS AUF FLÜSSIGKEIT | teilweise umgesetzt | Bedingtes Laden/Rendern, kleinere Grafik und optimierte Kontinent-SVGs; tatsächliche Bedienung auf sechs Breiten ohne Anwendungsfehler. Subjektive Flüssigkeit und GPU-FPS auf physischen Endgeräten bleiben zusätzliche Prüfungen. |
| 81 | PRIORISIERUNG | vollständig umgesetzt | Baseline/Speicherung/Kernbedienung vor Ergänzungen; kein neues Backend oder Ersatzprodukt. |
| 82 | NICHT ÜBERLADEN | verbessert gegenüber der ursprünglichen Anforderung | Sekundäres erst öffnen, Details aufklappen, Hinweise schrittweise; Start bleibt Globus. |
| 83 | KEINE VERSCHLECHTERUNG DURCH „OPTIMIERUNG“ | vollständig umgesetzt | Inhaltszahlen erhalten; vorhandene Abläufe nach Erweiterung erneut geprüft; unveränderte Speicheridentität. |
| 84 | SELBSTSTÄNDIG NEUE IDEEN FINDEN | verbessert gegenüber der ursprünglichen Anforderung | Neun neue gespeicherte Modelle mit überprüfbaren Beobachtungsaufträgen: Stromkreis, Paketwege, Kräfte, Entfernungen, Bits, Schatten, Schleuse, Brücken und Höhenvergleich. Themen als Wissensnetz mit Globus verknüpft. |
| 85 | ABER KEIN FEATURE-CREEP | vollständig umgesetzt | Keine zusätzlichen Konten, Chats, Ranglisten, Cache-Risiken oder ungetesteten großen Spiele. |
| 86 | BESTEHENDE FUNKTIONEN VOR NEUEN FUNKTIONEN | vollständig umgesetzt | Funktionsregression vor Ergänzungen; nur sinnvolle und tatsächlich bedienbare neue Bereiche. |
| 87 | FERTIGSTELLUNG | vollständig umgesetzt | Sinnvolle Produktkorrekturen und Welt-Erweiterung implementiert; tatsächliche UI-/Speicher-/Offline-Regressionsprüfungen durchgeführt. Native Veröffentlichung ist der nachfolgende dokumentierte Abschluss, keine Browser-Testbehauptung. |
| 88 | NACH DER IMPLEMENTIERUNG: VOLLSTÄNDIGER REGRESSIONSTEST | vollständig umgesetzt | Alle bisherigen Reisen/Kapitel, Labore und Spiele erneut bedient; sichtbare Regression einschließlich sechs Größen, Speicher und Offline abgeschlossen. |
| 89 | DEFINITION OF DONE | teilweise umgesetzt | Produktumfang und sichtbare Chrome-, Touch-, Neustart- und Offline-Nachweise vorhanden. Physische Safari-/iOS-/Android-, Screenreader-, hörbare deutsche Stimme und Geräte-FPS-Nachweise können in dieser Umgebung nicht vollständig erbracht werden. |
| 90 | ABSCHLUSSBERICHT | vollständig umgesetzt | Konkreter Abschlussbericht anhand der realen Inhaltszahlen und Prüfungen vorbereitet; Veröffentlichungsergebnis und verfügbare Prüfgrenzen werden im abschließenden Nutzerbericht genannt. |
| 91 | LETZTE UND WICHTIGSTE ANWEISUNG | vollständig umgesetzt | Produktzusammenhang statt bloßer Featureliste: bestehende Lernwelt erhalten, echten Wiederkehrwert und kontrollierte Erweiterungen schaffen. |

## Erweiterungsauftrag: alle 56 Punkte

Das System enthält 90 sorgfältig ausgearbeitete Themen: 20 Tiere, 26 historische Themen, 18 Personen, zwölf Erfindungen, acht Bauwerke und sechs Wissenschaftsfragen. Aufzählungen mit „beispielsweise“, „mögliche“ und „optional“ wurden als Ausbauideen behandelt. Nicht jedes vorgeschlagene Einzeltier und nicht jeder Alltagsgegenstand wurden sofort aufgenommen. Es gibt keine leeren Kategorien oder angekündigten Scheinfunktionen.

| Nr. | Auftragspunkt | Kategorie | Umsetzung / bewusste Grenze |
| --- | --- | --- | --- |
| 1 | Die Tierwelt | vollständig umgesetzt | Großer eigener Bereich mit 20 Tierkarten, vorhandenen passenden Lebensraum-/Tiergruppenfiltern und sechs vernetzten Weltkategorien. |
| 2 | Tierkarten | vollständig umgesetzt | Lebensraum, Größe mit Messregel, Nahrung, Lebensweise, Fähigkeiten, Alter/Feinde/Schutz soweit fachlich sinnvoll; Foto, Größenvergleich, Mini-Frage und vertiefte Schutzinformation. Keine ungeprüften Tiergeräusche. |
| 3 | Tierwelt mit Globus verbinden | vollständig umgesetzt | Jede Tierkarte enthält auswählbare reale Beispielregionen. Eisbär → Arktis und weitere Orte drehen die bestehende Kugel; Rückweg zur Karte vorhanden. |
| 4 | Tier-Spiele | vollständig umgesetzt | Vier neue Tier-Spiele: Detektiv, Lebensraum, Nahrung, Rekorde. Bestehende Spiele erhalten. Tier-Silhouetten und lizenzierte echte Tiergeräusche sind optionale spätere Spiele. |
| 5 | Bedrohte Arten | vollständig umgesetzt | Schutz, Lebensraumverlust und hilfreiche Handlungen ohne Angsttexte; globale/regionale Bewertungen klar unterschieden. Fachlich geprüfter Stand Oktober 2026. |
| 6 | Zeitreise | vollständig umgesetzt | 26 historische Themen mit interaktivem Epochenfenster, Karten, Verknüpfungen und Mini-Fragen. |
| 7 | Interaktive Zeitleiste | vollständig umgesetzt | Schieberegler und direkt wählbare Stationen von frühen Menschen/Feuer über Hochkulturen bis Moderne. Nicht maßstabsgetreue Jahresabstände ausdrücklich erklärt; indigene Kulturen und Kolonialgeschichte berücksichtigt. |
| 8 | 20. und 21. Jahrhundert | vollständig umgesetzt | Weltkriege, Holocaust, UN, Berliner Mauer, Apollo, Mauerfall, Wiedervereinigung, Web, 9/11 und moderne Weltraumforschung; wenige zentrale altersgerechte Fakten. |
| 9 | Sensible historische Themen | vollständig umgesetzt | Freiwillige Einführungsseite mit Begleitperson-Hinweis, ruhige Erklärungen, Ausweichweg zur Zusammenarbeit; keine drastischen Bilder, Gewalt-Audios oder Opferzahlen-Spiele. |
| 10 | 11. September 2001 | vollständig umgesetzt | Historisch korrekte knappe Erklärung, Folgen und Erinnern; New York am Globus. Keine Schockfotos oder Verschwörungstheorien. Optionale Tages-Minutenzeitleiste bewusst weggelassen. |
| 11 | Damals und heute | vollständig umgesetzt | Alle zwölf Erfindungen mit Vorher/Heute-Umschaltung und erklärtem Entwicklungskontext; zusätzlich eigenes Frage-Spiel. |
| 12 | Große Köpfe | vollständig umgesetzt | 18 Personen aus Naturforschung, Mathematik, Medizin, Technik, Informatik, Raumfahrt und Umweltschutz; keine bloße Biografie-Textliste. |
| 13 | Personenauswahl | vollständig umgesetzt | Unter anderem Curie, Lovelace, Hopper, Katherine Johnson, Jemison, Goodall, Wangari Maathai, Tu Youyou, Cai Lun, al-Chwarizmi, Gutenberg, Darwin, Humboldt, Karl/Bertha Benz, Einstein, Berners-Lee und Armstrong. Edison und das Wright-Team werden in den entsprechenden Erfindungsgeschichten eingeordnet. |
| 14 | Keine falschen Einzelerfinder | vollständig umgesetzt | Licht, Auto, Computer, Flugzeug, Papier und Internet mit Vorläufern, Teams und mehreren Ländern; Zeitanker nicht als alleiniger Erfindungstag ausgegeben. |
| 15 | Wie wurde das erfunden? | vollständig umgesetzt | Zwölf ausgearbeitete Entwicklungen mit Quelle, visuellen Funktionsplänen, kleinen Fragen und weiterführenden Themen; kein Anspruch, jeden vorgeschlagenen Gegenstand bereits aufzunehmen. |
| 16 | Jede Erfindung als Geschichte | vollständig umgesetzt | Problem → Idee → Entwicklung → Früher → Heute → mögliche Zukunft, sechs interaktive Stationen je Karte. |
| 17 | Zerlege die Erfindung | vollständig umgesetzt | Alle zwölf Erfindungen haben auswählbare tatsächlich erklärte Bauteile/Funktionsschritte; vollständig erkundete Teile werden zentral gespeichert. |
| 18 | Erfindungs-Zeitleiste | vollständig umgesetzt | Eigene visuelle Erfindungsstationen mit geprüften Zeitankern und Entwicklungskontext. Frühe Schrift/Papier/Buchdruck vernetzt; keine zu genaue Scheindatierung von Feuer/Rad. |
| 19 | Forscher und Entdecker | vollständig umgesetzt | Forschungsreisen in Personen-/Geschichtskarten mit Globus, etwa Humboldt, Darwin und Goodall; moderne Raumforschung in eigener Reise. Kein zusätzlicher siebter Hauptbereich nötig. |
| 20 | Große Bauwerke | vollständig umgesetzt | Acht Bauwerke: Gizeh, Chinesische Mauer, Kolosseum, Taj Mahal, Eiffelturm, Golden Gate Bridge, Panamakanal und Burj Khalifa; alle mit Globus-Ort. |
| 21 | Bauwerk-Karten | vollständig umgesetzt | Ort, Bauzeit, Zweck, Größenregel, Bauweise und Besonderheit. Sieben echte Fotos; Burj als präzises Höhenmodell. Brücken- und Schleusenmodell zusätzlich interaktiv. |
| 22 | Geschichte und Geografie | vollständig umgesetzt | Ereignisse, Personen und Bauwerke öffnen die vorhandene Kugel am passenden Ort; Mondlandung verknüpft Florida, Mondreise und Raumfahrt. |
| 23 | Weltkarte der Erfindungen (optional) | teilweise umgesetzt | Einzelne Karten führen zu mehreren passenden realen Entwicklungsorten; internationales Zusammenwirken erklärt. Keine zusätzliche flächendeckende Erfindungs-Overlay-Karte gebaut. |
| 24 | Biografiekarten | vollständig umgesetzt | Kurze Einführung, Lebenszeit/Länder/Fachgebiet, Beitrag, Methode, Fakt, Mini-Frage und Wissensnetz; vier authentische Porträts mit Rechten. |
| 25 | Große Fragen | vollständig umgesetzt | Sechs neue Wissenschaftskarten und neun tatsächliche Modelle; Stromkreis, Internetpakete, Flugkräfte, Ortsbestimmung, Bits und Schattenvergleich. Vorhandene 30 Warum-Fragen erhalten. |
| 26 | Wissensvernetzung | vollständig umgesetzt | Passende Karten, Erd-Lernreisen, Labore, Spiele, Länder und Globus-Beispielorte gegenseitig erreichbar; keine künstlichen Alleinerfinder-Orte. |
| 27 | Ich will mehr wissen | vollständig umgesetzt | Das interessiert mich! speichert jedes neue Thema im zentralen Forscherbuch; Entfernen möglich. |
| 28 | Alle Bilder prüfen | vollständig umgesetzt | 157 Bestands- und 183 Erweiterungsansichten plus gezielte mobile Modellansichten aufgenommen; kaputte Bilder, Zuschnitt, Stil, Alt-Texte und Diagrammzweck geprüft. |
| 29 | Bilder mit Zweck | vollständig umgesetzt | Tiere/Bauwerke/Porträts als echte Fotos; Karten, Größenbalken, Zeitleisten und native Diagramme erklären konkrete Zusammenhänge. |
| 30 | Gemeinsamer Stil | vollständig umgesetzt | Gemeinsame Karten, Typografie, Abstände und Buttons; sechs passende Akzentfarben und Lucide-Symbole innerhalb derselben Gestaltung. |
| 31 | Textformatierung | vollständig umgesetzt | Kurze Absätze, Faktenboxen, gestufte Erfindungsgeschichten, Mehr-erfahren-Details, kleine Fragen; respektvolle Hinweisbox bei sensibler Geschichte. |
| 32 | Typografische Hierarchie | vollständig umgesetzt | Titel → Einführung → Foto/Diagramm und Fakten → Interaktion → optionale Tiefe → Mini-Frage; mobile Modellbeschriftungen vergrößert. |
| 33 | Informationsarchitektur | vollständig umgesetzt | Ein zusätzlicher Tab Mehr entdecken mit sechs Welt-Auswahlen. Bisherige fünf Bereiche erhalten, mobile Navigation in zwei übersichtlichen Reihen. |
| 34 | Startseite erhalten | vollständig umgesetzt | Echte drehbare Kugel, bestehende Missionen und Fortsetzen bleiben der Einstieg; neue Welten sekundär erreichbar. |
| 35 | Empfehlungen | vollständig umgesetzt | Manuell geprüfte thematische Verbindungen und passendes Spiel nach jeder Karte; keine algorithmische personenbezogene Sammlung. |
| 36 | Neue Missionen | vollständig umgesetzt | Fünf konkrete Aufgaben zu Afrika-Tieren, Zeitordnung, Erfindungen/Teilen, Personen und Bauwerken/Globus. Öffnen allein ersetzt erklärtes Wissen nicht. |
| 37 | Neue Abzeichen | vollständig umgesetzt | Sieben verdiente Abzeichen: Tierexperte, Zeitreisender, Erfindergeist, Nachwuchsforscher, Baumeister, Raumfahrtforscher und Geschichtsdetektiv; alle Bedingungen tatsächlich erreicht. |
| 38 | Zeitreise-Spiele | vollständig umgesetzt | Sortiere die Zeit, Wer war das? und Früher oder heute?; sinnvolle Zeitanker statt falscher einzelner Erfinderzuordnung. |
| 39 | Erfindungs-Spiele | vollständig umgesetzt | Technik-Detektiv mit fünf zufälligen Aufgaben und gespeicherter Runde; Funktionsbauteile aller zwölf Geschichten interaktiv erkunden. |
| 40 | Zentral speichern | vollständig umgesetzt | Besuche, erklärte Themen, Antworten, Modelle, Teile, Reisen, Missionen, Spiele und Merkliste in demselben Schema 3; Session-Kapazität erhöht, alte Daten bleiben kompatibel. |
| 41 | Suche | vollständig umgesetzt | Alle sechs Kategorien und Aliase enthalten. Die sechs ausdrücklich genannten Beispielabfragen durch echte UI-Bedienung geprüft. |
| 42 | Altersgerechte Tiefe | vollständig umgesetzt | Kurz erklärt und optionale Vertiefung, Quellen für Erwachsene, klar als vereinfacht bezeichnete Modelle und Vorleseaktionen. |
| 43 | Fachliche Prüfung | vollständig umgesetzt | Primäre Tier-, Museums-, Gedenkstätten-, Forschungs- und Technikquellen. Maße/Ranges, Daten, Schutzstatus, Erfinderteams, Zeitanker und sensible Texte redaktionell geprüft; Quellen stehen an den Karten. |
| 44 | Keine Heldenverklärung | vollständig umgesetzt | Bekannte Beiträge und Forschungsmethoden sachlich erklärt, Teamarbeit und Vorgeschichte genannt. Historische Macht-/Kolonialbeziehungen altersgerecht einbezogen. |
| 45 | Weltgeschichte | vollständig umgesetzt | Afrikanische Menschheitsgeschichte/Ägypten/Umweltschutz, Mesopotamien, asiatische Schrift/Papier/Buchdruck/Mathematik, Nahost-Optik sowie indigene Gesellschaften und globale Forschung. |
| 46 | Frauen selbstverständlich | vollständig umgesetzt | Curie, Lovelace, Katherine Johnson, Mae Jemison, Jane Goodall, Wangari Maathai und Bertha Benz regulär in denselben Kategorien und Spielen vertreten. |
| 47 | Heute in der Geschichte (optional) | noch nicht umgesetzt | Bewusst kein zusätzliches täglich datiertes Ereignissystem. Tagesentdeckung ist abwechslungsreich, ohne tägliche Nutzungspflicht; zuverlässiger späterer Ausbau möglich. |
| 48 | Tagesentdeckung erweitern | vollständig umgesetzt | Bestehende Entdeckung um Tiere, Personen, Erfindungen, Bauwerke, Geschichte und Wissenschaft erweitert; Rotation vermeidet unmittelbare tägliche Wiederholung. |
| 49 | Großes Ziel | vollständig umgesetzt | Globus, Lexikon, Tierwelt, Museum, Zeitreise, Erfindungswerkstatt, Spiele und Labor in einem vernetzten Produkt mit einfacher Hauptnavigation. |
| 50 | Qualität vor Menge | vollständig umgesetzt | 90 kuratierte Themen mit Frage/Verbindungen und sinnvollem Foto, Ablauf oder Modell. Erweiterbare typisierte Daten und portable Erstellung aus geprüften Forschungsdateien. |
| 51 | Interaktion statt Text-Datenbank | vollständig umgesetzt | Drehen/Zoomen, Zeitstationen, Filter, Größenvergleiche, Bauteile, neun Modelle, acht Spiele, drei Reisen, Mini-Fragen und Wiederholung. |
| 52 | Visueller QA-Durchgang | vollständig umgesetzt | Alle alten Bereiche und alle 90 neuen Karten tatsächlich geöffnet, beantwortet und aufgenommen. Zusätzlich sechs Kategorien/Breiten, mobile Modelle und sensible Einführungen. Kein Dark Mode neu zugesagt. |
| 53 | Bildqualität | vollständig umgesetzt | 31 lokale WebP-Fotos mit wahrer Zuordnung, Rechten, Bildnachweisen und Alt-Texten; kein Stretching oder kaputter Link in den UI-Prüfungen. Keine Schockbilder. |
| 54 | Formatierungsqualität | vollständig umgesetzt | Einheitliche Raster, lesbare Breiten, responsive Karte/Sidebar, klare Buttonfamilien; mobile Beschriftungen und Elternkontrast gezielt korrigiert. |
| 55 | Abschluss und Regression | vollständig umgesetzt | 157 Bestandsansichten, 183 Erweiterungsansichten, alle 90 Fragen/zwölf Teilegruppen, acht neue Spiele/alle sieben Abzeichen, drei Reisen, neun Modelle, Suchbeispiele und realer Export/Reset/Import. Alte Sicherung und echtes Offline-Update/-Neustart geprüft; physische Browsergrenzen separat genannt. |
| 56 | Abschlussbericht | vollständig umgesetzt | Inhalte, Bestandskorrekturen, Design, Spiele, Speicher und tatsächliche QA werden im finalen Nutzerbericht mit dem erfolgreichen Sites-Link kurz zusammengefasst. Optionale nächste Ausbauten klar von erledigter Arbeit unterschieden. |

## Tatsächliche Nachweise und verbleibende Prüfgrenzen

- `phase1-report.json`: 157 vorhandene Ansichten; null Anwendungsfehler, axe-Befunde und Überläufe nach Korrekturen. 16 bestehende Abschlussrätsel gelöst. Frühere Baseline-Befunde wurden behoben, nicht als bestanden ausgegeben.
- `world-expansion-report.json`: 183 Aufnahmen; alle 90 Kartenfragen beantwortet und alle zwölf Erfindungs-Teilegruppen erkundet; null Anwendungs-/Konsolenfehler, axe-Befunde, Überläufe oder kaputte Bilder.
- `world-actions-report.json`: 15 tatsächliche Aktionen/Prüfungen, einschließlich neun Modelle, Globus-Rückweg, exakter Reise-Station, sechs Suchbeispielen und echtem Export → bestätigtem Reset → Dateiimport mit identischem Pass.
- `world-games-report.json`: 18 Prüfungen; alle acht Spiele tatsächlich abgeschlossen, falscher Versuch ohne Stempel, zufällige Frage/Antwortreihenfolge nach Reload erhalten; alle sieben neuen Abzeichen verdient und zwei weitere Weltreisen abgeschlossen.
- `world-offline-report.json`: Fünf tatsächliche Prüfungen: altes Offline-Profil manuell auf neue Release aktualisiert, alte Sicherung importiert, komplette Chrome-Schließung und Offline-Neustart, genaue zweite zufällige Aufgabe wiederhergestellt, neue und bestehende sekundäre Bereiche offline.
- `world-mobile-report.json`: 22 tatsächlich bediente mobile Ansichten (neun Modelle bei 360/390, Start, zwei Touch-Spiele und Elternbereich); null Anwendungsfehler, axe-Befunde und Überläufe. Im lokalen Chrome-Labor LCP 548 ms, CLS 0; keine schweren Weltartikel-/Spielmodule beim ersten Start. Diese Werte sind keine Feldmessung.
- `world-final-targets-report.json`: endgültiger Three/WebGL-Globus mit echten Touch-Drag-/Pinch-Ereignissen, Russland über zwei Kontinente, Europa-/Asien-SVGs und sensible Geschichte; null Anwendungsfehler und axe-Befunde. Nach der letzten Konturkorrektur zusätzlich Three-Logik/Cleanup instrumentiert erneut bestanden.
- `world-final-fallback-report.json`: WebGL absichtlich unzugänglich gemacht; echte SVG-Alternative mit Streifenmuster gerendert und Deutschland ausgewählt. Null Anwendungsfehler/axe-Befunde. Die absichtlich provozierte Three-Diagnose ist kein unerwarteter Anwendungsfehler.
- `world-final-offline-report.json`: aktiver Worker meldet exakt dieselbe Build-Version wie das HTML (`ada61d26fb40c2e4`) und vollständige Offline-Bereitschaft (108 Cache-Einträge). Chrome ganz geschlossen und offline neu gestartet: exakter gespeicherter Bit-Wert 43, Favoriten und Spiel-/Modellzustände erhalten; kalt geladene Tier-/Bauwerk-Karten, Fotos und Schleusenmodell nutzbar. Null Anwendungsfehler.
- Die explizite Aktivierung dieses endgültigen Updates hat die vor/nach geprüften Passfelder erhalten. Ein zunächst zu strenger Prüfvergleich der Cache-Namen wurde korrigiert: der wartende Worker legt seinen vollständigen Cache bereits vor der manuellen Aktivierung an. Nachweis ist deshalb der tatsächliche aktive Worker mit passendem HTML-Fingerprint und Ready-Marker, nicht ein vermeintlich neu erscheinender Cache-Name.
- Instrumentierte ergänzende Tests: umfassende Persistence-Fälle einschließlich beschädigter/future Daten, blockierter Speicher/IDB-only und Migration; echte Three-Geometrie/OrbitControls mit instrumentiertem Renderer, Cleanup/Kontextverlust; bisherige Spiele/Labore/Speech-Logik. TypeScript und Produktionsbuild erfolgreich.

Nicht geprüft: physische iPhone-/Android-Geräte, Safari/Firefox/Edge, hörbare deutsche Systemstimme, echtes Screenreader-Gerät und GPU-FPS auf Besucherhardware. Chrome-Software-WebGL und Viewport-/Touch-Prüfungen sind tatsächliche Browsernachweise, aber ersetzen diese Geräteprüfungen nicht. 133 Quellen-URLs werden nicht pauschal als einzeln HTTP-getestet behauptet; die Fachquellen wurden redaktionell geprüft und alle lokalen Bild-/Navigationswege im tatsächlichen UI getestet.

Sinnvolle nächste Inhalte: weitere sauber recherchierte Tiere und Erfindungen, echte lizenzierte Tiergeräusche, Tier-Silhouetten und optional Heute in der Geschichte. Keine leeren Buttons dafür eingebaut.

## Bildnachbesserung nach dem mobilen Nutzerfeedback · 8. Oktober 2026

Die ursprüngliche Lernreisen-Übersicht zeigte nur bei drei Reisen ein Foto. Das war trotz der 31 Fotos in den neuen Themenwelten eine sichtbare Medienlücke. Alle 16 Lernreisen haben jetzt aussagekräftige Bilder: zehn Fotos und sechs erklärende Karten/Diagramme. Neu recherchiert und lokal eingebunden wurden fünf USGS/NPS/NASA-Fotos für Wasser, Wetter, Jahreszeiten, Mond und Landschaften; Quelle, Lizenzbeleg und proportional erzeugte WebP-Dateien stehen in `content/journey-image-manifest.json`. Kleine Vorschaudateien vermeiden das Laden der großen Kapitelbilder in der Übersicht. Die Mobilkarten geben den Motiven die volle Kartenbreite; die ganze Mondscheibe bleibt mit `contain` erhalten. Bildtexte und Quellen ergänzen zehn erste Kapitel; beim Erdbeben wird die Bruchfläche mit Wellen anschaulich erklärt.

Beim tatsächlichen visuellen Prüfen wurde außerdem ein Fehler der vereinfachten Kartenkonturen gefunden: zusammengefallene Inselringe konnten eine weltweite Füllung auslösen. Die Kontinent-/Länderkarten behalten in diesem Fall gültige Originalgeometrie. Eine missverständliche Äquatorbeschriftung im Jahreszeitenbild wurde berichtigt. Keine Reise-ID, kein Speicherschema und kein Foto-Forscher-Spielinhalt wurden ersetzt.

Tatsächliche Nachweise dieser Korrektur:

- `journey-images-report.json`: 32 im Produktionsbuild bediente Ansichten, einschließlich aller 16 ersten Kapitel, vier Übersichten bei 1366/768/390/360 Pixeln sowie zwölf mobilen Kapitelansichten. Reale Touch-Taps, Wasser-Teilcheninteraktion, Kapitelwechsel und Reload/Weiterlernen geprüft. Null JavaScript-/Konsolenfehler, axe-Befunde, horizontale Überläufe oder kaputte Bilder. Die Aufnahmen wurden zusätzlich visuell gelesen; dabei gefundene Konturfehler vor dem letzten Prüflauf korrigiert.
- `journey-images-offline-report.json`: drei tatsächliche Prüfungen. Vorhandenes Offline-Profil auf den neuen Build `c88ddfbfb9f5684e` aktualisiert, geprüfte Passfelder unverändert. Chrome vollständig geschlossen und ohne Netzwerk neu gestartet. Alle 16 Vorschaubilder sowie fünf kalt geladene Kapitelbilder/Diagramme verfügbar. Null Anwendungs-/Konsolenfehler.
- TypeScript und Produktionsbuild erfolgreich. Physische iPhones und Safari sind durch diese Chrome-Viewport-Prüfungen weiterhin nicht als getestet behauptet.
