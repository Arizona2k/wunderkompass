# WUNDERKOMPASS – FINALER DAUERAUFTRAG FÜR ENTWICKLUNG, QUALITÄT, VERNETZUNG UND EFFIZIENZ

Bitte setze die unterbrochene Entwicklung von WunderKompass im bestehenden Entwicklungsbranch und Pull Request #27 fort.

**Dieser Auftrag ergänzt und präzisiert die bisherigen Masteraufträge. Er ersetzt, verkürzt oder streicht keine bestehenden Anforderungen. Er gilt dauerhaft für Paket 3.5, die Pakete 4–8 und sämtliche zukünftigen GO-Runden.**

Mein Ziel ist eine außergewöhnlich hochwertige, umfangreiche, moderne, interaktive und fachlich verlässliche Lernplattform, die sich mit maximal sinnvoller Geschwindigkeit weiterentwickelt. Technische Qualität, exzellente Inhalte, hochwertige Gestaltung und Entwicklungseffizienz müssen gemeinsam optimiert werden.

## 1. Sichere Wiederaufnahme – zuerst den tatsächlichen Stand feststellen

Lies vor jeder Fortsetzung die vorhandenen Projektregeln AGENTS.md, VISION.md und QUALITY.md, den einzigen BACKLOG.md, PROJECT_STATE.md sowie die drei vollständigen Originalaufträge für Paket 3.5.

Prüfe den tatsächlichen Git-Status, bestehende lokale Änderungen, Branch, Remote-Stand, PR #27, relevante Commits, Sicherungen und den neuesten GitHub-Quality-Lauf.

Der zuletzt verifizierte Remote-Commit war `77f1841e2f6ac18a1e44c8a183daba108ff283e9`. Dieser Wert ist lediglich ein Wiederaufnahme-Anhaltspunkt und darf nicht ungeprüft als neuester Stand angenommen werden.

GitHub Quality #71 war zuletzt nicht vollständig erfolgreich: Standardprüfungen, Firefox und WebKit bestanden; Chromium wurde abgebrochen, das abschließende Required-Gate schlug fehl. Kläre den tatsächlichen Abbruchgrund anhand der verfügbaren Laufdaten und Protokolle. Prüfe insbesondere den bekannten Engpass des Chromium-/Buchtests und das 35-Minuten-Joblimit. Behaupte weder einen Produktfehler noch einen erfolgreichen Gesamtlauf ohne Nachweis.

Schließe den aktuellen Prüfstand korrekt ab beziehungsweise behebe nachgewiesene Blocker. Führe die erforderliche vollständige Prüfung am maßgeblichen unveränderten Commit erneut durch. Behalte bereits bestandene Nachweise als historische Belege, aber verwende sie nicht als Freigabe für neuere Commits.

Prüfe und sichere außerdem alle noch nicht integrierten lokalen Arbeiten, insbesondere die zwölf vorbereiteten neuen und zwölf überarbeiteten bestehenden Erfindungsmanuskripte sowie sonstige nicht synchronisierte Inhalte. Bereits vorhandene Arbeit darf weder verloren gehen noch unnötig neu erzeugt werden.

## 2. Dauerhaftes Grundprinzip: ein vollständig vernetztes Lernsystem

**WunderKompass ist ein zusammenhängendes Wissens- und Lernsystem, keine Sammlung unabhängiger Seiten, Dateien und Spiele.**

Bei jeder neuen Funktion, jeder Änderung, jedem Inhalt und jeder technischen Anpassung musst du eigenständig die Auswirkungen auf das bestehende Gesamtsystem berücksichtigen.

Wenn beispielsweise ein neues Thema über Dinosaurier, Vulkane, Erfindungen oder historische Ereignisse entsteht, prüfe relevante Verbindungen zu älteren Artikeln, Wissenswörtern, Themenwelten, Globus/Karten, Lernreisen, Spielen, Quiz, Laboren, Missionen, Suchergebnissen und weiteren Lernfunktionen.

Ergänze fachlich sinnvolle direkte und gegenseitige Verknüpfungen. Prüfe auch, ob ältere Inhalte durch den neuen Wissensstand ergänzt, korrigiert oder erweitert werden sollten.

Das gilt ebenso für Themen, die erst Monate oder Jahre später entwickelt werden.

Nicht jede Änderung muss jedes Modul berühren. Aktualisiere ausschließlich die tatsächlich betroffenen oder fachlich sinnvoll verbundenen Bereiche. Vermeide künstliche Beziehungen, doppelte Inhalte und unnötige Arbeit.

**Ein neuer Inhalt ist erst dann angemessen integriert, wenn seine relevanten Beziehungen, seine Auffindbarkeit, die Bedienung und seine technischen Abhängigkeiten berücksichtigt wurden.**

## 3. Intelligente Änderungsfolgenanalyse etablieren

Entwickle die bestehende Architektur gezielt zu einem System weiter, das Auswirkungen von Änderungen nachvollziehbar erkennen und prüfen kann.

Bevor du eine relevante Änderung implementierst, ermittle systematisch:

1. Welche Daten, Dateien, Komponenten und Funktionen werden unmittelbar geändert?
2. Welche anderen Komponenten oder Inhalte hängen technisch davon ab?
3. Welche älteren Inhalte sind fachlich damit verbunden?
4. Welche Suchindizes, Kategorien, Verweise, Lernaufgaben, Navigationselemente und Offline-Ressourcen benötigen Anpassungen?
5. Welche Nutzerfortschritte, Identitäten oder gespeicherten Daten könnten betroffen sein?
6. Welche gezielten Prüfungen sind erforderlich?
7. Ist wegen übergreifender Risiken zusätzlich eine umfassendere Systemprüfung nötig?

Nutze bestehende Datenmodelle, stabile IDs, Inhaltsbeziehungen, Import-Abhängigkeiten, Schemas und Testwerkzeuge.

Erweitere, wo wirtschaftlich sinnvoll, die maschinenprüfbare Abhängigkeits- und Verknüpfungsstruktur. Prüfe insbesondere ungültige Referenzen, doppelte Kennungen, verwaiste Inhalte, unvollständige Suchdaten und widersprüchliche fachliche Beziehungen.

Unterscheide zwischen automatisch feststellbaren technischen Abhängigkeiten und fachlichen Zusammenhängen, für die eine redaktionelle Prüfung erforderlich ist. Stelle keine vollständige automatische Erkennung in Aussicht, wenn die vorhandenen Daten sie nicht ermöglichen.

**Wichtig:** Baue kein unnötig komplexes neues Architektur-Framework. Die Änderungsfolgenanalyse muss konkrete Fehler verhindern und die Entwicklung beschleunigen. Sie darf nicht selbst zum unverhältnismäßigen Großprojekt werden.

## 4. Alte Inhalte bei neuen Entwicklungen mitverbessern

Bei fachlich relevanten Erweiterungen prüfe rückwirkend den bestehenden Wissensbestand.

Berücksichtige insbesondere:

- Inhalte und weiterführende Erklärungen
- Globale Suche, Suchbegriffe und Filter
- Wissensbuch und gegenseitige Verknüpfungen
- Lernwelten und thematische Übersichten
- Länder, Orte, Karten und Globus
- Lernreisen und Entdeckerpfade
- Quiz, Spiele, Missionen, Experimente und Labore
- Altersstufen, Lernhilfen und Antwortfeedback
- Navigation, Direktlinks und Rückwege
- Vorlesen, Medien und Barrierefreiheit
- Entdeckerpass, Favoriten und gespeicherte Fortschritte
- Vollständige Offline-Bereitstellung und sichere Updates

Passe ältere Komponenten dort an, wo das neue Thema tatsächlich einen Qualitäts- oder Lerngewinn ermöglicht.

Vermeide es, dieselben Fakten unabhängig voneinander an vielen Stellen zu pflegen, wenn gemeinsame strukturierte Daten oder Verweise fachlich geeigneter sind.

Erhalte alle bisherigen stabilen IDs, korrekten Antworten, Nutzerfortschritte und Speicherformate beziehungsweise sichere erforderliche Migrationen zuverlässig ab.

## 5. Entwicklungsgeschwindigkeit und Prozessqualität deutlich verbessern

Arbeite mit maximal sinnvoller Effizienz, ohne Qualitätsanforderungen aufzugeben.

Untersuche wiederkehrende Zeitverluste und behebe nachgewiesene Engpässe, insbesondere:

- Lange Chromium-, Buch- und sonstige Browserprüfungen
- Vermeidbare Wiederholungen vollständiger Testläufe
- Instabile Testumgebungen, alte Prozesse und Portkonflikte
- Unnötige Datenaufbereitung und doppelte Arbeit
- Überflüssige Kontextwechsel zwischen unabhängigen Aufgaben
- Redundante Berichte, Sicherungen und Verwaltungsarbeiten
- Unnötig komplizierte Integrations- oder Buildprozesse

Bewerte Prozessverbesserungen nach ihrer gesamten wiederkehrenden Wirkung: tatsächlich eingesparte Zeit, Stabilität, Fehlerrisiko, Ressourcenverbrauch und Wartungsaufwand.

Eine Verbesserung, die bei vielen zukünftigen Entwicklungsrunden erhebliche Zeit spart, kann wichtiger sein als eine kleine Optimierung der Website.

Übernimm Änderungen der CI-Organisation nur mit nachvollziehbarer Bewertung von Gesamtlaufzeit, Runner-Minuten, Testabdeckung und Zuverlässigkeit. Keine blinde Parallelisierung, keine pauschalen Timeout-Erhöhungen und keine zusätzlichen Kosten.

## 6. Intelligente, risikobasierte Teststrategie

**Erkenne die Auswirkungen einer Änderung und teste während der Entwicklung zunächst gezielt die tatsächlich betroffenen Bereiche und ihre relevanten Abhängigkeiten.**

Bei übergreifenden Änderungen erweitere die Prüfung angemessen um Integrations- und Regressionstests.

An sinnvoll gebündelten, unveränderten Meilensteinen und vor jeder späteren Freigabe müssen sämtliche vorgeschriebenen vollständigen Qualitätsprüfungen erfolgreich durchgeführt werden.

Dadurch vermeiden wir unnötige vollständige Testwiederholungen nach jeder Kleinigkeit, ohne den abschließenden Qualitätsstandard zu senken.

Es ist ausdrücklich verboten, Prüfungen zu überspringen, Assertions abzuschwächen, Sicherheitsmechanismen zu entfernen, Fehler kosmetisch zu verdecken oder Ergebnisse anderer Commits als aktuelle Freigabe zu verwenden.

Die Schlussabnahme muss sich auf denselben tatsächlich geprüften Quellstand und Produktionsbuild beziehen. Chromium, Firefox, WebKit, Offline, Integrität, Barrierefreiheit, Fortschrittsspeicherung und alle bestehenden verbindlichen Prüfbereiche bleiben erhalten.

Bei echten Fehlern zuerst die Ursache gezielt untersuchen und korrigieren. Wiederhole anschließend die erforderlichen Prüfungen und die vollständige Abnahme am endgültigen Stand.

## 7. Technische Optimierungen anhand des tatsächlichen Nutzens priorisieren

Technische Exzellenz bedeutet nicht, jede mögliche Mikrooptimierung sofort umzusetzen.

Bewerte Nutzen und Aufwand anhand von:

- Häufigkeit und Bedeutung der betroffenen Nutzerinteraktion
- Wahrnehmbarer Reaktionsgeschwindigkeit
- Ladezeit, Rendering, Animationen und Bedienflüssigkeit
- Speicherbedarf, Energieverbrauch und Datenübertragung
- Stabilität, Sicherheit und Fehlertoleranz
- Wartbarkeit und langfristiger Skalierbarkeit
- Implementierungs-, Test- und Folgekosten
- Wiederkehrendem Nutzen für künftige Entwicklungsrunden

Eine Zeitersparnis von 0,1 Sekunden kann bei einer häufigen, relevanten Interaktion sinnvoll sein. Eine isolierte Verbesserung von 0,1 Prozent ohne erkennbaren Nutzen soll dagegen keine stundenlange Entwicklung verursachen.

Kritische Sicherheits-, Datenverlust-, Integritäts- und Stabilitätsprobleme werden weiterhin prioritär gelöst.

**Kleine, nicht dringliche technische Detailoptimierungen bleiben erhalten, aber werden zurückgestellt.** Dokumentiere sie knapp und nach Priorität ausschließlich im vorhandenen BACKLOG.md mit Problem, erwartetem Nutzen und gegebenenfalls sinnvoller späterer Umsetzung.

Wenn eine zurückgestellte Verbesserung später im Rahmen einer ohnehin passenden Änderung wirtschaftlich mit erledigt werden kann, prüfe sie erneut.

Keine zweite Roadmap, keine zusätzliche Optimierungsliste und keine künstlichen globalen Gesamtgrößenlimits.

## 8. Hochwertige Inhalte und sichtbare Produktfortschritte priorisieren

Sobald echte technische Blocker behoben sind, konzentriere die Entwicklungsarbeit verstärkt auf die vollständige Umsetzung und Integration der noch offenen Produkt- und Inhaltsaufgaben.

Dazu gehören insbesondere:

- Substanzielle Erweiterung und Verbesserung der Wissenswelten
- Fachlich sorgfältige und altersgerechte Erklärungen
- Sinnvolle Beziehungen zwischen alten und neuen Themen
- Moderne Lernspiele mit unterschiedlichen Denk- und Schwierigkeitsstufen
- Hochwertige interaktive Modelle, Simulationen und 3D-Erlebnisse
- Anschauliche Grafiken und funktional sinnvolle Animationen
- Spannende Lernreisen, Experimente und Missionen
- Verständliche Hilfen und individuelles Antwortfeedback
- Attraktive, konsistente Benutzeroberflächen
- Hervorragende mobile und Tablet-Bedienbarkeit

Bearbeite bestehende schwache Inhalte ebenso konsequent wie neue Inhalte. Wenn du einen Bereich anfasst, verbessere ihn möglichst ganzheitlich und nachhaltig.

Qualität hat Vorrang vor bloßer Mengensteigerung. Viele Dateien oder Codezeilen gelten nicht als Nachweis für hochwertige Produktentwicklung.

Primäre Zielgeräte sind aktuelle Smartphones, Tablets und Desktopgeräte. Hochwertige Animationen, Grafiken und Interaktionen sind ausdrücklich erwünscht. Grundlegende Kompatibilität, Accessibility und zuverlässige Bedienung dürfen dabei nicht verloren gehen.

## 9. Fachübergreifende Qualitätsverantwortung

Betrachte WunderKompass bei jeder größeren Entscheidung aus der gemeinsamen Perspektive eines professionellen Produktteams.

Berücksichtige die jeweils relevanten Kompetenzen aus Produktstrategie, Softwarearchitektur, Frontend, Daten- und Wissensarchitektur, UX, UI-Design, Animation, 3D, Spieleentwicklung, Didaktik, Fachredaktion, Accessibility, Sicherheit, Testing, DevOps und langfristiger Wartung.

Diese Bereiche sollen nicht unabhängig voneinander entwickelt werden. Ihre Auswirkungen auf das Gesamtprodukt müssen gemeinsam betrachtet werden.

Das bedeutet ausdrücklich nicht, für jede Rolle einen separaten Agenten, Prozess oder Bericht einzurichten. Es geht um fachübergreifende Qualität und Verantwortung, nicht um zusätzliche Bürokratie.

Prüfe bei Bedarf auch Migrationen, Wiederherstellbarkeit, technische Abhängigkeiten, Quellenrechte, Datenschutz, Kostenkontrolle und langfristige Erweiterbarkeit.

## 10. Größere, zusammenhängende Arbeitspakete vollständig abschließen

Bevorzuge sinnvoll gebündelte Entwicklungswellen mit einem klaren Ergebnis.

Der Standardablauf lautet:

**Bestand prüfen → Auswirkungen erkennen → zusammenhängend umsetzen → alle relevanten Bereiche integrieren → gezielt testen → vollständigen Meilenstein abnehmen → sichern und dokumentieren.**

Vermeide ständige Neuplanung, unnötig kleinteilige Einzelaufträge und dauerhaft anwachsende Prototypsammlungen.

Bereits vorbereitete, fachlich geeignete Inhalte sollen möglichst zielgerichtet in die eigentliche Anwendung übernommen, integriert und geprüft werden.

Wenn vollständige Qualitätsprüfungen auf einem bestimmten Commit laufen, bleibt dieser geprüfte Quellstand unverändert. Weitere vorbereitende Arbeiten dürfen die Integrität der laufenden Nachweise nicht beeinträchtigen.

## 11. Fortschritte zuverlässig sichern – auch bei Nutzungslimits

Sichere abgeschlossene und konsistente Entwicklungszwischenstände regelmäßig durch nachvollziehbare Commits und Pushes ausschließlich im bestehenden Entwicklungsbranch.

Wichtige Manuskripte, fachliche Quellenarbeit, Prototypen und andere relevante Ergebnisse dürfen nicht ausschließlich in flüchtigen lokalen Arbeitsverzeichnissen oder im aktuellen Gesprächskontext existieren.

Überführe langfristig benötigte Quellen gezielt in geeignete bestehende Projektstrukturen. Vermeide dabei unnötige Archive, Duplikate, generierte Prüfbilder, persönliche Daten und Geheimnisse im Repository.

Unfertige Arbeiten müssen ihren tatsächlichen Status behalten und dürfen nicht fälschlich als implementiert oder abgenommen erscheinen.

Halte vor möglichen Unterbrechungen den aktuellen Commit, lokalen Synchronisierungsstand, laufende beziehungsweise offene Prüfungen und die unmittelbar nächste Aufgabe in PROJECT_STATE.md nachvollziehbar fest.

Beim Neustart zuerst den tatsächlichen vorhandenen Zustand prüfen, statt aus früheren Chatmeldungen auf nicht mehr vorhandene Dateien zu schließen.

Bestehende Branch- und PR-Strukturen weiterverwenden. Kein Force-Push, kein zweiter paralleler Entwicklungsbranch oder PR und kein eigenständiger Merge beziehungsweise Deployment.

## 12. Fachliche Qualität und tatsächliche Freigabestatus ehrlich behandeln

Sämtliche bisherigen Sicherheits-, Integritäts-, Qualitäts-, Quellen-, Urheberrechts-, Datenschutz-, Offline-, Accessibility- und Testanforderungen bleiben verbindlich.

Unterscheide jederzeit klar zwischen:

- Manuskript beziehungsweise vorbereitetem Inhalt
- Tatsächlich implementierter Funktion
- Technisch geprüfter Umsetzung
- Fachlich geprüfter Umsetzung
- Unabhängig abgenommener Umsetzung
- Tatsächlich veröffentlichter Version

Behaupte keine unabhängige Kinder-, Fach-, Geräte- oder Hörprüfung, wenn sie nicht tatsächlich erfolgt ist.

Fehlende externe Prüfungen sind transparent als offen beziehungsweise extern blockiert zu dokumentieren. Sie dürfen nicht erfunden oder durch interne Tests umetikettiert werden.

## 13. Schlankes dauerhaftes Projektgedächtnis

Übernimm diese Grundsätze dauerhaft, aber knapp, widerspruchsfrei und ohne unnötige Wiederholungen in die vorhandenen Projektregeln:

- AGENTS.md: verbindliches Agentenverhalten und Entwicklungsabläufe
- VISION.md: Produktvision, Lernqualität und ganzheitliche Vernetzung
- QUALITY.md: Änderungsfolgenanalyse, Integrations- und Prüfstandards
- BACKLOG.md: einziger Aufgabenbestand einschließlich zurückgestellter Verbesserungen
- PROJECT_STATE.md: tatsächlicher Projektstand und Wiederaufnahme

Verweise zwischen den bestehenden Dokumenten, statt umfangreiche identische Regeln mehrfach zu kopieren.

Diese Regeln gelten für alle späteren Themen, Pakete 4–8 und zukünftigen GO-Durchläufe. Bei neuen Erkenntnissen sind sie gezielt zu verbessern, ohne bisherige Schutzvorgaben oder verbindliche Ziele stillschweigend aufzugeben.

## 14. Verständliche Berichterstattung statt unnötiger Verwaltung

Berichte nach jedem größeren abgeschlossenen Entwicklungsmeilenstein kurz, konkret und überprüfbar:

1. Was wurde tatsächlich neu entwickelt und integriert?
2. Welche vorhandenen Inhalte oder Funktionen wurden verbessert?
3. Welche neuen Verbindungen und Auswirkungen auf das gesamte Wissenssystem wurden berücksichtigt?
4. Was ist für Lernende konkret sichtbar oder funktional besser?
5. Welche technischen Probleme wurden behoben und welche Prozesse messbar beschleunigt?
6. Welche Prüfungen sind am genauen aktuellen Commit bestanden, fehlgeschlagen oder noch offen?
7. Was bleibt im bestehenden BACKLOG zu erledigen?

Unterscheide echten Produktfortschritt von reiner Vorbereitung, Testzeit und technischen Experimenten. Vermeide überlange Wiederholungen bereits bekannter Statusinformationen.

## 15. Unmittelbare Fortsetzung und Grenzen

Setze nach Sicherung und Klärung des aktuellen Quality-Status den vollständigen Masterauftrag von Paket 3.5 anhand der vorhandenen Originaldokumente und BACKLOG-Aufgaben WK-053–058 fort.

Die bereits integrierten 68 Naturthemen mit zehn interaktiven Modellen, die erweiterten Wissenswörter, Wissenschaftskarten, Warum-Fragen, Reisekapitel und Laborerklärungen bleiben erhalten.

Prüfe danach die vorbereiteten Erfindungsarbeiten und entwickle die übrigen offenen Wissenswelten, Spiele, Labore, Experimente, Missionen, Grafiken, Lernfunktionen und Designverbesserungen systematisch weiter.

Keine erneute umfangreiche Planungsphase und kein Neustart des Masterauftrags. Nach der notwendigen einmaligen Integration dieser dauerhaften Regeln soll der Schwerpunkt auf echter Umsetzung liegen.

Sämtliche ursprünglichen Pakete und Qualitätsanforderungen bleiben bestehen. Paket 4–8 folgt erst entsprechend dem vereinbarten Projektfortschritt.

Keine neuen kostenpflichtigen Dienste oder Upgrades, keine eigenständige Veröffentlichung, kein Auto-Merge, kein direkter Push auf main oder test-live, keine News-Liveaktivierung und keine unbefristete autonome Entwicklung ohne neuen Auftrag.

**Handle vorausschauend, ganzheitlich, effizient und mit außergewöhnlich hohem Qualitätsanspruch. Erkenne sinnvolle Verbesserungen selbstständig, aber beurteile deren tatsächlichen Nutzen kritisch. Das Ziel ist nicht möglichst viel Code oder möglichst viele Tests, sondern eine dauerhaft bessere, hochwertige und konsequent wachsende Lernplattform.**