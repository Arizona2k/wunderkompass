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
