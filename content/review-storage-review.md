# WK-052 · PR62: identische PNG-Daten gemeinsam aufbewahren

Quality171/Run40217885387/Attempt2 am Kopf86ab652b12c6e4d4f522e06bb7ff3315c68ef8c5 bleibt **failure**. Die vollständigen Funktions-/Engine-/Handoffprüfungen bestanden; anschließend überschritten die tatsächlich aufbewahrten PNG-Dateien mit150.840.778Byte die unveränderte Grenze150.000.000Byte. Der neue Speicherweg macht diesen historischen Lauf nicht nachträglich grün.

Das originale GitHub-Artefakt12611112739 wurde am25.10.2026 tatsächlich heruntergeladen:145.937.696Byte, SHA256 `0a3e3c30968fff1626201fa12e364d9648be92203046dacc2869c8fbf810140e`. Alle1.538ausgewählten PNG-Identitäten wurden einzeln gegen Originalgröße undSHA geprüft. Das ursprüngliche Manifest enthält2.045Aufnahmen und80exakte Mehrfachdaten; unterschiedliche Aufnahmeidentitäten dürfen daraus nicht entfallen.

Die Ursache liegt in der mehrfachen physischen Ablage identischer Daten. Eine Entfernung von Breiten, Zuständen, Offline-/Onlineaufnahmen oder Belegen ist dafür nicht erforderlich. Der bestehende Sammler bewahrt jede Aufnahme mit ihrem unveränderten Namen, Ursprung, Maß, Hash und Auswahlentscheid. `storedAs` benennt die tatsächlich gespeicherte PNG-Datei. Mehrere Aufnahmeidentitäten können nur nach SHA-Prüfung **und vollständigem Bytevergleich** dieselbe Originaldatei verwenden. Jede Zuordnung wird vor Upload nochmals vollständig aufgelöst und geprüft. Es gibt keine Bildumkodierung, Größenänderung, neue Aufnahmeauswahl oder geänderte Pflichtliste.

Pflichtbilder sowie Fokus-/Fehleroriginale behalten zusätzlich ihre eigenen physischen Dateinamen. Bei fehlender aktueller Handoffbindung oder fehlgeschlagenem/unlesbarem tatsächlichem Enginebericht werden keine Daten geteilt. Diagnostische Originale und sämtliche Berichte bleiben separat. Ältere Manifeste ohne `storedAs` verwenden weiterhin `file`. Manifestversion2 unterscheidet ausdrücklich Aufnahmezahl, physische Dateizahl, `retainedCaptureBytes` und tatsächlich abgelegte `retainedBytes`.

Gezielte Speicherprobe am unveränderten Originalartefakt:

| Nachweis | Ergebnis |
| --- | --- |
| Aufnahmematrix | Alle2.045Datensätze unverändert, abgesehen vom zusätzlichen Speicherort; MatrixSHA `c536cf249625d1ec00d8549b12e24ab793e23b9a741a5c4f03f35fa12cb68a1a` erhalten. |
| Ausgewählte Originale | Alle1.538Identitäten auf bytegleiche Originaldaten zurückgeführt; kein Zustands-/Breiten-/Pflichtbild entfällt. |
| Physische PNG-Dateien |1.469Dateien;69gemeinsame Ablagen. |
| Tatsächliche PNG-Bytes |147.456.842 statt150.840.778;3.383.936Byte weniger physisch gespeichert. |
| Unveränderte Grenze |150.000.000Byte;2.543.158Byte Reserve in dieser gezielten Originalprobe. |
| Gegenprobe | Veränderter gemeinsamer Originalinhalt gleicher Größe wird abgewiesen; anschließend Original bytegleich wiederhergestellt. |

Neue Regressionen prüfen zusätzlich fehlende Daten, abweichende Hashes, unsichere Pfade und Symlinks, alle Pflichtdateien, physische Größenrechnung und unveränderte getrennte Diagnoseablage. Der bestehende Pflichtumfang, Fehlerassertions, Bildauswahl, Schutzklassifikation, Workflow,55-Minuten-Grenze,150-MB-Grenze und alle Freigabe-/Speicher-/Datenschutzregeln bleiben bestehen. Der tatsächliche Wartungsdiff betrifft den vorhandenen Sammler und seine Regressionen; die gezielte Doppelablagenwartung wird unter Auftrag24.10. und der konkreten PR62-Fortsetzung geprüft, nicht durch eine Schutzlistenänderung selbst freigegeben.

Diese Speicherprobe ist keine neue Browser-/native Endabnahme und kein Release. Aktueller vollständiger Prüf-, Kopf-/Basis-/Run-/Auslieferungsstand ausschließlich in PROJECT_STATE und PR62. Appbuild und alle167Laufzeitausgaben bleiben durch diese reine Sammleränderung unverändert; die neue Prüfquellbindung wird gesondert qualifiziert.

Neue lokale Schlussabnahme am unveränderten Reparaturcode8d42c57/Prüfquelle1794406301fdf1d700989c0ae47fed944f6fc5d0ce272c491fe6c175fac14203: vollständiger bestehender Chromium154-Lauf mit allen10Pflichtgruppen/151Checks natürlich bestanden in1.681,593925Sekunden. OriginalreportSHA256 `aba77c2cc336da563666e8b0e53889e06888ab36ce10f06b8c6a53b29303a1d6`. Alle1.463Aufnahmedatensätze erfasst,956unverändert ausgewählt;48gemeinsameDatenablagen ergeben908physischePNG/96.838.105Byte statt99.475.559Byte für die956Identitäten. Die tatsächlichen Datei-Bytes und jede Identitätsauflösung sind geprüft. Dieser lokale Lauf hat einen anderen Umfang der erzeugten Aufnahmen als der originale kombinierte171-CI-Lauf; die beiden Bytewerte werden nicht als gleichartige Laufzeitmessung oder nachträgliches171-Grün verrechnet. Standards263App-/130Releasefälle/Typ/Lint/Build/Integrität bestanden. Neue vollständige nativeCI am endgültigenHead bleibt erforderlich.

## Tatsächlicher nativer Abschluss172 und Auslieferung

Die zuvor offene neue Qualifikation ist abgeschlossen: [Quality172](https://github.com/Arizona2k/wunderkompass/actions/runs/40236351211), Attempt1/Job121298664575, am exakten Head8bcae39 und seiner M63-Basis vollständig erfolgreich. Standards, zehn Pflichtgruppen, tatsächlicher Firefox157/WebKit27.2, Handoff, identischer Anfangs-/Endkontext und Sammler bestanden. Gesamtcheck3.058 Sekunden innerhalb unverändert3.300; Node24.21.0, Quelle1794406301fdf1d700989c0ae47fed944f6fc5d0ce272c491fe6c175fac14203.

Das tatsächlich heruntergeladene Originalartefakt12616687476 hat142.927.190Byte und stimmt mit Provider-SHA256 `bdc460794dc0cc646882fc0ce64ae7beac13eb81eadf241ae74f2a75241f1311` überein. Alle2.045Aufnahmeidentitäten und1.538ausgewählten Originale bleiben erhalten, Matrix `c536cf249625d1ec00d8549b12e24ab793e23b9a741a5c4f03f35fa12cb68a1a` identisch zu171/2. Tatsächlich1.471PNG/147.716.506Byte statt150.933.757Byte für sämtliche ausgewählten Identitäten,67gemeinsame Datenablagen und2.283.494Byte Reserve. Jede Identität wurde aus dem heruntergeladenen Artefakt byte-/maß-/hashgeprüft aufgelöst; alle Pflicht-/Fokus-/Fehleroriginale behalten ihre physischen Namen. Keine Aufnahme entfernt, keine neue Auswahl oder Budgeterhöhung.

Regulärer Merge52908ff15e3730ab6e29549e21901eb25dccd82e hat den getesteten Integrationsbaum. Passender jüngster Vercel-Erfolg und49tatsächliche TLS-Code-Dateien gegen unveränderte vorab versiegelte86-Referenz bestätigt; diese bleibt ein späterer lokaler Node24.19-Nachbau. Produkt-/Quellen-/Bild-/Modell-/Aufgaben-/Rückwegtests in fünf Ansichten einschließlich nativer200%, tatsächliche synthetische Passsicherung/Reset/Import/Reload und kalter Client-Offline-Neustart bestanden. [Vollständige Auslieferungsquittung](https://github.com/Arizona2k/wunderkompass/pull/62#issuecomment-6404472586). Original171/2 bleibt insgesamt rot;166-Ursache bleibt ungeklärt.

## Vorhandene Laufzeiten für kommende Änderungen nutzen

Der172-WebKitpfad dauerte1.243,104Sekunden: Tiere619,853, Reiselernhilfen221,625 und Offlinefehler318,227 bilden die großen Anteile. Firefox1.089,291Sekunden. Dies sind beobachtete Anteile, noch keine kausale Erklärung der Abweichung zu früheren Läufen; Laufzeitquellen unverändert, Node-/Umgebungsunterschiede gesondert erhalten. Vor weiteren Änderungen vorhandene Teiltests/Caches nutzen und relevante Aussagen, Fehlrückmeldungen, Bildrechte/Motive sowie Modellzustände früh zusammen in der betroffenen tatsächlichen Engine mit Mobile/Zoom prüfen. Nur belegte Doppelarbeit/Warteursachen im bestehenden autorisierten Ablauf optimieren.

Für die folgende Gestaltung ändern sich unter anderem Chronik und gemeinsame Oberflächen: vor dem langen Volltest passende neue Probeaufnahmen gegen dieses vollständige172-Manifest auswerten. Die Schätzung ersetzt keine endgültige Messung aller Aufnahmen und keine vorgeschriebene Schlussprüfung. Keine zusätzliche Pipeline, pauschale Komplettredaktion oder Prüfhürde; konkrete Arbeit bleibt in WK052/WK056/WK057 des einzigen BACKLOG.
