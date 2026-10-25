# WK-024: redaktionelle Prüfung der Entdeckerzentrale

Prüfdatum: 9. Oktober 2026. Diese Stichprobe betrifft den geänderten Strömungseinstieg und die drei nun auf der Startseite sichtbaren Wissensbeziehungen. Keine erneute fachliche Vollabnahme des Katalogs, aller Zielkarten oder der Modelle.

## Tatsächlich gelesene Fachquellen

- [NASA: Moon Phases](https://science.nasa.gov/moon/moon-phases/): Mondlicht ist reflektiertes Sonnenlicht; sichtbare Phasen zeigen unterschiedliche Anteile der beleuchteten Hälfte. Gegen den vorhandenen Einstieg der Mondkarte und den ersten Teil der gespeicherten Verbindung Mondphasen ↔ Gezeiten geprüft.
- [NOAA: What are tides?](https://oceanservice.noaa.gov/facts/tides.html): Anziehung von Mond und Sonne und regelmäßiges Steigen/Fallen des Meeresspiegels. Gegen die Gezeitenkarte und den zweiten Teil der Verbindung geprüft. Phasen verursachen nicht durch ihr Licht die Gezeiten; der gespeicherte Erklärungstext benennt ausdrücklich zwei verschiedene Wirkungen.
- [NOAA: What is a current?](https://oceanservice.noaa.gov/facts/current.html): Wind, Gezeiten und Dichteunterschiede als drei Antriebe. Der vorherige Strömungseinstieg nannte nur Wind/Dichte; Gezeiten ergänzt. Vorhandene Verbindung Gezeiten ↔ Strömungen ist damit konsistent. NOAA beschreibt besonders starke Gezeitenströmungen an Küsten, in Buchten und Mündungen; keine pauschale Behauptung, alle Strömungen seien Gezeitenströmungen. Prüfgrenze sichtbar in sourceNote der Karte.
- [OpenStax Biology 2e, 31.3: Nutritional Adaptations of Plants](https://openstax.org/books/biology-2e/pages/31-3-nutritional-adaptations-of-plants): im Abschnitt Mycorrhizae erhält der Pilz Zucker von der Pflanze, die Pflanze unter anderem Mineralstoffe. Gegen die bereits gespeicherte Beziehung Fotosynthese ↔ Pilze geprüft. Keine Behauptung, sämtliche Pflanzen und Pilze gingen diese Partnerschaft ein; der Text beschränkt sich auf Mykorrhiza. Kein Quellentext oder Bild übernommen.

## Vernetzung und Lernwert

Der gesamte aktuelle Index mit 116 Karten und bestehende Kanten/Routen wurden gelesen. Betroffene Karten: Mondphasen, Gezeiten, Strömungen, Fotosynthese und Pilze. Die drei Startseitenspuren beziehen Erklärungstexte direkt aus world-connections.json, Titel aus WORLD_INDEX und verlinken bestehende Karten in beide Richtungen. Keine duplizierten Fachtexte, neuen Kanten oder neuen Fortschrittskennungen. Beim Strömungseinstieg bestehende Nachbarn Gezeiten, Korallenriff, Nahrungsnetz und Walhai geprüft; die vorhandenen Beziehungen passen weiterhin. Keine weitere künstliche Beziehung nötig.

Die zugehörigen Wege moon-to-sea, living-networks und ocean-life existieren, besitzen gültige Stationen und knüpfen an die gewählte Verbindung an. ocean-life startet bei Strömungen und führt zu Meeresleben, während moon-to-sea Mond/Gezeiten/Strömungen gemeinsam vertieft. Keine neue Route nötig. Integrität und reale Hin-/Rücknavigation werden durch vorhandene und ergänzte Tests geprüft.

Die Wissensspur ist eine freiwillige Orientierungshilfe, kein Lernleistungsnachweis: Anklicken verdient keinen neuen Stempel. Challenge-Aufgaben, Hinweise, drei Schwierigkeiten und Speicherschema bleiben erhalten; der neue Einstieg öffnet das bestehende Spiel und respektiert eine gespeicherte Runde. Die Hilfe zeigt aktuelle Spiel-/Routenzahlen aus den vorhandenen Daten statt veralteter Zahlen.

## Medien und Grenzen

DiscoveryVisual enthält selbst erstellte SVG-Zeichnungen einer Abenteuerlandschaft, eines Weltraummotivs und einer Technikillustration. Keine wissenschaftlichen Rekonstruktionen oder maßstabsgetreuen Diagramme; sichtbar als künstlerisch/nicht maßstabsgetreu gekennzeichnet und als Dekoration für assistive Technik ausgeblendet. Die Weltraumgrafik ist kein Lageplan des Sonnensystems. Keine aus diesen Motiven abgeleitete Sachaufgabe.

Vorhandene vier lokale Medien (Elefant, Pyramiden, Marie Curie, Golden Gate Bridge) mit vorhandenen Autoren-/Lizenzinformationen wiederverwendet. Credits bleiben an den Medien; spätere Darstellungen behalten ihre Kennzeichnung. Keine fremden Bilder heruntergeladen, keine erfundenen Rechte oder neue Medienanbieter. Ausführliche Nachweise bleiben in den vorhandenen photo-credits.json-Dateien und auf den Wissenskarten.

Unabhängige fachliche Prüfung, echte Kinderbeobachtung, physische Geräte, Screenreader und gehörte Stimme sind damit nicht ersetzt. Sichtbare Lesbarkeit, Tastatur, Bilder, kleine Browseransichten, axe und gespeicherte synthetische Pässe werden separat technisch geprüft.


## Gestaltung25.10.2026 · erste zusammenhängende Umsetzung in Arbeit

Kurze Gestaltungslinie: warme helle Flächen, dunkle Schrift, Petrol als tragende Farbe und ein gut lesbarer Orangeakzent; kompakter Einstieg mit sichtbarer gemeinsamer Suche und früh bebilderten sechs Welten. Die unveränderten Welt-/Themen-/Fragen-/Speicherkennungen bleiben. Eine konkrete Frage führt innerhalb der bestehenden Wissensspuren zu Erklärungen und einer passenden Aktivität. Spielen, Forschen und Reisen erläutern ihre unterschiedlichen Lernhandlungen. Der volle Globus bleibt unter `#globe` mit seinen bisherigen Modell-/Ortswegen erreichbar; Startseite und Entdecken erhalten `#home`, auch ohne Hash. Keine zweite Weltenübersicht oder neue Empfehlungsdatenbank.

Die erste Umsetzung betrifft Startseite, bestehende Themenübersichten, gemeinsame Artikelhülle mit vorhandenem Modell sowie Pass. Vorhandene Motive, Bildrechte, Quellen, Erklärtexte und Modellgrenzen werden weiterverwendet. Die vier Musteransichten stehen für die laufende erste Etappe, nicht für eine fachliche/gestalterische Modernisierung sämtlicher Inhalte. Neue zentrale Typografie-/Farb-/Abstandsregeln betreffen ihre tatsächlichen weiteren Verwendungen und benötigen entsprechend breite Regression; individuelle ältere Bild-/Inhalts-/Modelllücken bleiben im bestehenden BACKLOG.

Im Pass führen tatsächliche gespeicherte Aktivität, Gespeichertes und Notizen, Lernwege sowie Sicherung/Einstellungen direkt weiter. Eine kurze Ansicht vorhandener Notizen liest dieselben privaten Passdaten und speichert keine Kopie in einem neuen Schema. Keine neue Altersabfrage, Fremdübertragung oder neue Fortschrittskennung. Die sichtbare Speicheranzeige und Sicherung erklären den Gerätewechsel. Quizrückblick benennt richtig beantwortete Aufgaben statt unbeobachteter persönlicher Erklärungen.

### Tatsächlich zugängliche Angebotsfunktionen verglichen

Am25.10.2026 über die öffentlichen Originalseiten gelesen; keine angemeldeten Übungen, tatsächliche fremde Animationen oder Bildpixelabnahme behauptet, keine Medien kopiert:

- [Planet Schule](https://www.planet-schule.de/): gemeinsame Suche, Schulfächer, Medientypen und Zugänge zu Lernspielen/Erklärvideos sichtbar. Für WunderKompass werden vorhandene gemeinsame Suche und unterschiedliche Lernhandlungen früher erkennbar; keine zusätzliche Fach-/Medientypsuche parallel zur vorhandenen Navigation.
- [National Geographic Kids](https://kids.nationalgeographic.com/): Suchzugang sowie getrennte Tiere-/Spiele-/Videoangebote und konkrete Entdeckungsanlässe sichtbar. Eigene sechs Themenatmosphären und die bestehende Frage mit verbundenen Modellen bleiben selbstständig gestaltet. Die Textansicht belegt keine aktuelle Bildqualität oder tatsächliche Spielbedienung des fremden Angebots.
- [ANTON](https://anton.app/de/): öffentlich beschriebene Übungen/Erklärungen, Gerätezugänge und Lernlisten. WunderKompass verwendet seinen vorhandenen privaten lokalen Pass und freiwillige Denkwege; daraus wird weder eine überprüfte ANTON-Speicheranalyse noch eine behauptete Überlegenheit abgeleitet.
- [BrainPOP](https://www.brainpop.com/): hier nur Ladehinweis zugänglich. Keine weiteren aktuellen Funktionen oder Abnahme behauptet; früherer Vergleich bleibt historisch zugeordnet.

### Bisheriger tatsächlicher Prüfstand dieser Gestaltung

Frühe tatsächliche Home-/Themen-/Passprüfung anQuelle01de3b74/AppEc91 bestand sechs Ansichten:320normal/großeSchrift,768,1440 und echte native200%-Ansichten640/320. Erste echteWeltenfotografie im normalen320×720-Erstviewport vollständig sichtbar, sechsWelten/keinVollglobusaufHome, alterGlobuslink samtTastaturrückfokus, geteilteSuche, Tierseite3/Okapi-Rückweg und echtegespeicherteFortsetzung erhalten. Bronze-Artikel/Modell anQuelled703bb2a/Appd61 bestand fünfAnsichten,14Tastaturrückwege,dreiAufgaben/konkreteFehlantworten undvierGegenfehler; absichtlich wiederhergestelltes altes zweispaltiges20px-Artikelnavigationsraster wird vom striktenTextgrenzenguard abgewiesen. UrsprünglicheHeader-/Artikelüberläufe bleiben als roteOriginale erhalten. ÖffentlichePassprüfung mit fünf tatsächlichen Abschnittszielen bestand320/768/1440 anQuellef0291077/App19afc8f9, Notizen/Favoriten unverändert. AlterhellerHeaderfokusring hatte zuwenigKontrast; vorhandenenwk-focus-Token verwendet, forced-colorsHighlight erhalten. Zwei privateHelferfehler (fehlendeTouchoption undnichtkanonischeISO-Prüfzeit) getrennt korrigiert, keine Produktverluste daraus behauptet. Typ/Lint/Build bestanden,261Units bisher nuram nahen vorletztenZwischenstand; erneuteUnits und vollständigeQualifikation offen.

ErsterBuild überschritt unverändert325.000ByteCSS. Ungenutzte alteEinstiegsregeln und exakt überstimmteDeklarationen konsolidiert; gemeinsame bestehendeAbenteuerzugänge wiederverwendet. AktuellerBuild324.571Byte, keinBudget angehoben. Keine vollständige/nativeAbnahme oder tatsächlicheBereitstellung; PR62 bleibt eigenständiger Lieferabschnitt. RepräsentativeTeilansichten sind kein vollständigerBestandsabschluss.

Gezielter Rückwegbeleg: Der vollständige öffentlicheHomeoverview fand nach bestandenen Smartphonefällen bei768 einen realen abgeschnittenen Rückkehröffner (untereKante1024,453px bei1024Höhe, Fokus/2pxRingvorhanden). Exakter alter768-Fall mit unveränderten strengen Assertions rot reproduziert. DiscoveryIntro nutzt jetzt die vorhandene geschützte scheduleRouteRestore-Funktion statt sofortiger Wiederherstellung. Derselbe768-Ablauf besteht danach samt sichtbaremÖffner und allen lokalenChronik-/Pass-/Großschriftfällen (Quelleb75877e8/Appcc2c707b); ursprünglicheReports/DOM/PNG bleiben erhalten. GemeinsamerGuard und Prüfschwellen unverändert. Ganze siebenBreiten am endgültigenLieferstand noch nicht bestanden.
