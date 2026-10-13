# Paket 3.5: Grundlagenwelle 0–1 – Nachweise und Grenzen

Stand: 13. Oktober 2026. Operativer Auftrag ist der zuletzt eingefügte finale Nutzer-Master; Dauerauftrag, Roadmap und ausführlicher Excellence-Anhang sind ergänzende Referenzen. Dieser Bericht ist ein Nachweis zu BACKLOG WK-051/052, keine zweite Aufgabenverwaltung. Das gesamte Paket 3.5 bleibt offen.

## Tatsächliche Ausgangsbasis

PR #25 wurde durch Arizona2k übernommen: Merge `d0dc9a35857e896d45d35c7474640a58087b0ec5`, 13. Oktober um 01:52:06 MESZ. Vercel meldete für exakt diesen Merge Erfolg um 01:52:52 MESZ, Status 56182015032. Die unabhängige Prüfung aus dem beigefügten Master Abschnitt 0A bezieht sich auf Head `e5a89c561409295cd68294ff79bab3106781b825` und Quality 38322287711. Sie ersetzt keine Kinder-/Fach-/Geräteabnahme. Beim Start keine offenen PRs und keine fremde Reservierung; main unverändert. Aktuelle Belege: `excellence-history-evidence.json`.

Die vorhandene originale Sites-Git-Sicherung enthält 17 tatsächlich lesbare Commits einschließlich `d3a1ff703a71ed23f42367abf7e6f97b52b3aa8b` vor der ersten gespeicherten Version. Alle 14 Versions-Source-Commits sind lesbar. Sites-Archivdownloads scheiterten an der nativen Auflösung; Originalquellen wurden aus dem schon vorhandenen Bare-Git gelesen, ohne neuen Token. 97 erreichbare GitHub-Commits und alle 25 Merge-Checkpoints schließen Migration, unnummerierte Produkt- und Wartungsrunden ein. Source-Zeitpunkte sind keine Veröffentlichungszeitpunkte. Ungespeicherte frühere Chats/Prototypstände sind nicht rekonstruierbar und werden nicht erfunden. Die ursprünglichen Chronikeinträge und gesonderten Publikationsnachweise bleiben erhalten.

## Einmalige Fachbaseline

Die Baseline umfasst 1.955 stabile Ausgangsdatensätze aus 45 Beständen. Die zusätzliche aktuelle 3.5-Vorbereitungsnotiz in der Chronik ist ein Historieneintrag und kein neuer Fachinhalt. `content-inventory.mjs` prüft alte Identitäten und den eingefrorenen Fingerabdruck; die Baseline wird nach Übergabe nicht erneut verschoben. Derselbe Fachbestand darf nicht durch Mengenwachstum einer anderen Welt ausgeglichen werden.

| Geeigneter Fachbestand | Bestehend | Mindestziel | Tatsächlich neue abgenommene Themen dieser Welle |
| --- | ---: | ---: | ---: |
| `topics-animals` | 24 | 48 | 0 |
| `topics-history` | 31 | 62 | 0 |
| `topics-people` | 18 | 36 | 0 |
| `topics-inventions` | 12 | 24 | 0 |
| `topics-buildings` | 8 | 16 | 0 |
| `topics-science` | 23 | 46 | 0 |
| `words` | 90 | 180 | 0 |
| `why` | 30 | 60 | 0 |
| `nature-topics` | 34 | 68 | 0 |

34 Natur-/Geografieerklärungen sind ein eigenständiger kuratierter Bestand. Sechs zusätzliche Tierkarten-Projektionen werden nicht nochmals als neue Tiere gezählt. Wörter zählen echte Erklärbegriffe, Warum-Einträge eigenständige Erklärfragen; Synonyme, abgespaltene Kleinsttexte, Dateien, Drafts und bloße Aufgabenzahlen erfüllen keine Verdopplung.

Alle weiteren Bestände bleiben ausdrücklich im Prüf- und Verbesserungsumfang:

| Bestandsfamilie | Ausgangsanzahl | Einordnung |
| --- | ---: | --- |
| `journeys` | 16 | learning-content |
| `chapters` | 80 | learning-content |
| `journey-tasks` | 240 | learning-content |
| `journey-processes` | 10 | learning-content |
| `games` | 31 | learning-content |
| `labs` | 11 | learning-content |
| `experiments` | 6 | learning-content |
| `missions` | 12 | learning-content |
| `quiz` | 76 | learning-content |
| `routes` | 8 | learning-content |
| `countries` | 242 | fixed-geographical-inventory |
| `capitals` | 200 | geographical-or-model-inventory |
| `plate-places` | 52 | geographical-or-model-inventory |
| `continents` | 7 | geographical-or-model-inventory |
| `oceans` | 15 | geographical-or-model-inventory |
| `orientation` | 8 | geographical-or-model-inventory |
| `layers` | 4 | geographical-or-model-inventory |
| `planets` | 8 | geographical-or-model-inventory |
| `models` | 26 | projection |
| `news` | 4 | news-edition |
| `nature-animal-projections` | 6 | projection |
| `lab-tasks` | 33 | learning-content |
| `challenge-hints` | 142 | learning-content |
| `chapter-graphics` | 80 | inline-model |
| `knowledge-links` | 16 | relationship |
| `badges` | 12 | supporting-content |
| `map-layers` | 15 | supporting-content |
| `continent-portraits` | 7 | supporting-content |
| `marine-places` | 117 | supporting-content |
| `research-paths` | 11 | supporting-content |
| `world-photo-rights` | 49 | supporting-content |
| `journey-photo-rights` | 5 | supporting-content |
| `updates` | 30 | history |
| `media` | 84 | media |
| `climate-zones` | 4 | model-inventory |
| `surfaces` | 18 | ui-state-family |

Die 80 Kapitelgrafiken enthalten 16 bisherige Einstiegsmodelle und 64 bisherige Folgekapitelgrafiken. Die 240 Aufgaben und zehn Prozessspuren stammen aus Paket 3 und sind kein neuer 3.5-Lernumfang. Länder, Meeresgebiete und andere Geoinventare werden nicht durch erfundene Entitäten verdoppelt. Ihre Erklärungen und Lernmöglichkeiten bleiben in der fachlichen Qualitätsarbeit. Marine-Geometriesegmente mit derselben ID gehören zu einem Ort, nicht zu mehreren neuen Meeren.

Das maschinelle Quellmanifest erfasst die aktuellen App-, Komponenten-, Daten-, öffentlichen Medien-, Build-, Script-, Test-, GitHub- und Dokumentdateien mit Hash/Größe. 111 benannte Unterzustände einschließlich Fehler, Hint/Feedback, Backup, Großschrift, Fokus, Chronikarchiv und Offline bilden den gemeinsamen Prüfplan. Importgraph und Einzelkatalog sind Deckungsbelege, keine pauschale Behauptung, jeder Zustand sei bereits visuell/fachlich modernisiert. Nicht belegte Codeverwendung heißt `requires-use-review`; historische Server-/Sites-/UI-Vorlagen bleiben bis zur tatsächlichen Einzelprüfung erhalten. Aktuelle Reports entstehen durch `pnpm run verify`.

## Tatsächlich programmierte Produktkorrektur

Die frühere `indexOf`-Rückverknüpfung zeigte je Reise nur das erste passende Kapitel. Jetzt werden alle passenden Stationen aus derselben vorhandenen Verknüpfungstabelle verwendet, ohne zweite Wissensdatenbank. Beim Wasserkreislauf sind das acht eindeutige Kapitelziele in vier Reisen; vier davon gehören zur Tropfenreise. Die erste passende Station bleibt direkt sichtbar, weitere derselben Reise freiwillig aufklappbar. Überschrift, klare Vorschau aus den vorhandenen Kapiteltexten und dezente horizontale Trennlinien ordnen die Einträge. Keine dekorativen grünen Vertikalbalken.

Ein im echten Browser reproduzierter Fokusfehler beim Wechsel aus einer Reise zurück zum zuvor verborgenen Wissensbereich wurde behoben: Fokuswiederherstellung erfolgt nochmals nach Sichtbarwerden des Bereichs. Zurück/Reload erhalten das aufgeklappte Kapitelangebot; Tastatur-Enter, echte Linkadressen und modifizierte Klicks bleiben bedienbar. Die persönlichen Lernstände/Schema-3-Daten werden dafür nicht geändert. Die persönliche erste Bildprüfung zeigte außerdem leere „Kapitel N:“-Vorschauen; sie wurden durch den vorhandenen Versuch oder den ersten vorhandenen Erklärsatz ersetzt. Finale Bilder werden nach der vollständigen Regression nochmals angesehen.

## Gemeinsame redaktionelle Grundlage

`editorial-contract.mjs` verlangt pro Akte stabile ID und aktuellen Datenhash, eigenes Lernziel, Erklärung/Beispiel/Nutzen, drei sinnvolle Alterszugänge, freiwilligen Hinweis, Rückmeldung, Modellgrenze, konkrete belegte Claims mit Source-Anker, Rechtebasis/Organisation/echtem Prüftag, Medienentscheidung oder vollständige Medienrechte/Alttext/Lernzweck, sinnvolle Wissensverbindungen oder eine begründete Isolation. UI-/Such-/Back-/Offlinebelege müssen zum aktuellen Build und dem konkreten Einstieg gehören. Unbekannte IDs, Dubletten, kaputte Daten und veraltete Nachweise fallen durch.

Die Akten sind anfangs leer; keine alte Quelle wird dadurch still als geprüft erklärt. Der Report nennt alle fehlenden Einzelakten und mögliche Konzeptdubletten. `structurallyReady` ist ausschließlich Form-/Nachweiskonsistenz, nie automatische Wahrheit, menschliche Redaktion oder Kinderfreigabe. Daher in dieser Welle neue fachlich abgenommene Konzepte 0 und Verdopplung nicht erfüllt. Die tatsächliche Quellen-/Text-/Medien-/Lernarbeit folgt in den koordinierten Inhaltswellen WK-053–057.

## Engineering: nur nachgewiesene Änderungen

Die aktive Quality-Kette verwendet offiziell abgeglichene vollständige SHAs für checkout v7.0.1, setup-node v7.1.0, upload-artifact v7.0.2 und pnpm/action-setup v6.1.0. Die gelesenen action.yml-Dateien verwenden nativ Node 24; bisheriger Runner 2.337.0 genügt dafür. Node 24, pnpm 11.25.0, eingefrorene Locks, read-only-GitHub-Rechte, Isolation, 20-Minuten-Grenze und vollständige Schlussregression bleiben erhalten. Die deaktivierte Release-Kette wurde nicht aktiviert oder neu freigegeben.

Vorheriger tatsächlich gemessener P3-Quality-Lauf 38322287711: vollständiger Chromium-Teil 445,63 Sekunden, alle zehn Gruppen, 114 Prüfbezeichnungen; Browserartefakt 139.501.983 Bytes und sieben Tage Aufbewahrung. Die Node-20-Deprecation betraf die alten vier aktiven Prüfaktionen. Das ist eine konkrete historische Vergleichsprobe, keine p50/p95-Zuverlässigkeitsgarantie. Ein aktueller unveränderter d0-Basisbuild und eine separat isolierte Basisbrowser-Performanceprobe wurden erneut ausgeführt; eine zuvor überlappende Probe wurde verworfen und nicht als Vergleich verwendet.

Alle Prüfungen und Originalbilder werden weiterhin erzeugt. Der Upload enthält alle Berichte, SHA-/Build-/Quell-/Anforderungsnachweise, zwingende kritische Originalbilder und repräsentative Originale. Ein vollständiges Manifest nennt für jedes aktuelle PNG Hash, Abmessungen, Größe und Aufbewahrung; weitere Originale sind mit unveränderten Befehlen reproduzierbar. Alle sieben Breiten der gemeinsamen Grundlage und neuen Kapitelrückwege, mobile/Desktop-Langchronik, sämtliche News-Signaturproben, native Zoom-/Offline-/Fehlerbilder und echte Firefox-/WebKit-Belege bleiben enthalten. Bei fehlgeschlagenen Läufen werden sämtliche aktuellen Bilder behalten. Erfolgreiche Uploads prüfen die festen Pflichtbilder, aktuellen Code/Build und das 48-MiB-PNG-Budget fail-closed. Kein Bild wurde nachträglich manipuliert; keine Testgruppe wird gekürzt.

Nicht übernommen: neue Chromium-Cacheinfrastruktur ohne belegten Quota-/Kosten- und Laufzeitvorteil; weitere Parallelisierung ohne Isolations-/Laufzeitnutzen; Frameworkwechsel; blinde Entfernung historischer Abhängigkeiten; höhere Performancebudgets, pauschale Retries oder übersprungene Tests. Neue Dienste, Secrets, Tarife und API-Kosten 0. Die tatsächliche Artefaktgröße und finale Quality-Laufzeit werden nach dem neuen CI-Lauf im PR gegenübergestellt.

Erneutes aktuelles Audit: Produktionsabhängigkeiten 0 gemeldete Lücken. Drei verbleibende Entwicklungsbefunde (esbuild moderat/niedrig in historischen Dev-Werkzeugen, braces hoch ohne gemeldete Reparaturversion) bleiben dokumentiert. Die aktiven Build-Versionen bleiben unverändert; transitive `pnpm why`-Pfade wurden nachgesehen. Kein ungeprüfter Paketumbau zur kosmetischen Null.

## Prüfabnahme und Fortsetzung

Lokale 110 Unit-Tests bestanden; alle Pflichtprüfungen und volle Produktionsbrowserregression werden am finalen Code ausgeführt. Teiltests sind keine Ready-Freigabe. Exakter finaler Head, Quality-Lauf, gespeicherte Reports, tatsächliche Größe/Laufzeit und kritische Bildsichtung werden im PR/PROJECT_STATE quittiert. Vollständige Technical-Gates ersetzen keine individuelle Fach-/Kinder-/Geräteprüfung.

News bleibt tatsächlich disabled. Drei angeschlossene begrenzte Bereiche sind Erdbeobachtung, Exoplaneten und kuratierte Software-/Technik-Releases, nicht elf verfügbaren Quellengebiete. NASA/Caltech-Rechtefingerprints, zulässiges separates Hosting, dauerhafte Schlüssel/Trust/Berechtigungen, tatsächliche Publikation→Browser, Scheduler-Langzeit/DST und einmalige Betriebsfreigabe bleiben offen; keine Aktivierung in dieser Welle. Physische Apple-/Android-/schwache Geräte, VoiceOver/TalkBack, fünf wirklich gehörte deutsche Texte und unabhängige Personen ebenfalls offen. Headless Chromium stellt hier keine deutschen Stimmen bereit.

Nächste abhängige große Welle nach reviewter/übernommener Grundlage: alle vorhandenen sechs Artikelbestände individuell fachlich, pädagogisch und visuell nacharbeiten und je Bestand neue eigenständige vernetzte Themen liefern; insbesondere die kleinen Erfindungs-/Bauwerksbestände substanziell erweitern. Wörter/Warum/Natur, alle Reisen und Spiele/Labore bleiben ausdrücklich im vollständigen 3.5-Programm. Danach Pakete 4–8 unverändert. WK-038 Memory bleibt eine spätere Spezialaufgabe; der vorhandene Memory-Zustand ist trotzdem Teil der 3.5-Qualitätsprüfung. Kein automatisches Merge, main/test-live-Push oder Deployment.
