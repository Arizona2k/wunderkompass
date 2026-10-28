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

`editorial-contract.mjs` verlangt pro Akte stabile ID und aktuellen Datenhash, eigenes Lernziel, Erklärung/Beispiel/Nutzen, drei sinnvolle Alterszugänge, freiwilligen Hinweis, Rückmeldung, Modellgrenze, konkrete belegte Claims mit Source-Anker, Rechtebasis/Organisation/echtem Prüftag, Medienentscheidung oder vollständige Medienrechte/Alttext/Lernzweck, sinnvolle Wissensverbindungen oder eine begründete Isolation. UI-/Such-/Back-/Offlinefelder müssen den aktuellen Build und konkreten Einstieg nennen. Die Formprüfung ersetzt keine tatsächliche Report-/Screenshot- und Browserabnahme. Unbekannte IDs, Dubletten, kaputte Daten und veraltete Nachweise fallen durch.

Die Akten sind anfangs leer; keine alte Quelle wird dadurch still als geprüft erklärt. Der Report nennt alle fehlenden Einzelakten und mögliche Konzeptdubletten. `structurallyReady` ist ausschließlich Form-/Nachweiskonsistenz, nie automatische Wahrheit, menschliche Redaktion oder Kinderfreigabe. Daher in dieser Welle neue fachlich abgenommene Konzepte 0 und Verdopplung nicht erfüllt. Die tatsächliche Quellen-/Text-/Medien-/Lernarbeit folgt in den koordinierten Inhaltswellen WK-053–057.

## Engineering: nur nachgewiesene Änderungen

Die aktive Quality-Kette verwendet offiziell abgeglichene vollständige SHAs für checkout v7.0.1, setup-node v7.1.0, upload-artifact v7.0.2 und pnpm/action-setup v6.1.0. Die gelesenen action.yml-Dateien verwenden nativ Node 24; bisheriger Runner 2.337.0 genügt dafür. Node 24, pnpm 11.25.0, eingefrorene Locks, read-only-GitHub-Rechte, Isolation, 20-Minuten-Grenze und vollständige Schlussregression bleiben erhalten. Die deaktivierte Release-Kette wurde nicht aktiviert oder neu freigegeben.

Vorheriger tatsächlich gemessener P3-Quality-Lauf 38322287711: vollständiger Chromium-Teil 445,63 Sekunden, alle zehn Gruppen, 114 Prüfbezeichnungen; Browserartefakt 139.501.983 Bytes und sieben Tage Aufbewahrung. Die Node-20-Deprecation betraf die alten vier aktiven Prüfaktionen. Das ist eine konkrete historische Vergleichsprobe, keine p50/p95-Zuverlässigkeitsgarantie. Ein aktueller unveränderter d0-Basisbuild und eine separat isolierte Basisbrowser-Performanceprobe wurden erneut ausgeführt; eine zuvor überlappende Probe wurde verworfen und nicht als Vergleich verwendet.

Alle Prüfungen und Originalbilder werden weiterhin erzeugt. Der Upload enthält alle Berichte, SHA-/Build-/Quell-/Anforderungsnachweise, zwingende kritische Originalbilder und repräsentative Originale. Ein vollständiges Manifest nennt für jedes aktuelle PNG Hash, Abmessungen, Größe und Aufbewahrung; weitere Originale sind mit unveränderten Befehlen reproduzierbar. Alle sieben Breiten der gemeinsamen Grundlage und neuen Kapitelrückwege, mobile/Desktop-Langchronik, sämtliche News-Signaturproben, native Zoom-/Offline-/Fehlerbilder und echte Firefox-/WebKit-Belege bleiben enthalten. Bei fehlgeschlagenen Läufen werden sämtliche aktuellen Bilder behalten. Erfolgreiche Uploads prüfen die festen Pflichtbilder, aktuellen Code/Build und das 48-MiB-PNG-Budget fail-closed. Kein Bild wurde nachträglich manipuliert; keine Testgruppe wird gekürzt.

Nicht übernommen: neue Chromium-Cacheinfrastruktur ohne belegten Quota-/Kosten- und Laufzeitvorteil; weitere Parallelisierung ohne Isolations-/Laufzeitnutzen; Frameworkwechsel; blinde Entfernung historischer Abhängigkeiten; höhere Performancebudgets, pauschale Retries oder übersprungene Tests. Neue Dienste, Secrets, Tarife und API-Kosten 0. Die tatsächliche Artefaktgröße und finale Quality-Laufzeit werden nach dem neuen CI-Lauf im PR gegenübergestellt.

Erneutes aktuelles Audit: Produktionsabhängigkeiten 0 gemeldete Lücken. Drei verbleibende Entwicklungsbefunde (esbuild moderat/niedrig in historischen Dev-Werkzeugen, braces hoch ohne gemeldete Reparaturversion) bleiben dokumentiert. Die aktiven Build-Versionen bleiben unverändert; transitive `pnpm why`-Pfade wurden nachgesehen. Kein ungeprüfter Paketumbau zur kosmetischen Null.

## Prüfabnahme und Fortsetzung

Lokale 111 Unit-Tests bestanden; alle Pflichtprüfungen und volle Produktionsbrowserregression werden am finalen Code ausgeführt. Teiltests sind keine Ready-Freigabe. Exakter finaler Head, Quality-Lauf, gespeicherte Reports, tatsächliche Größe/Laufzeit und kritische Bildsichtung werden im PR/PROJECT_STATE quittiert. Vollständige Technical-Gates ersetzen keine individuelle Fach-/Kinder-/Geräteprüfung.

News bleibt tatsächlich disabled. Drei angeschlossene begrenzte Bereiche sind Erdbeobachtung, Exoplaneten und kuratierte Software-/Technik-Releases, nicht elf verfügbaren Quellengebiete. NASA/Caltech-Rechtefingerprints, zulässiges separates Hosting, dauerhafte Schlüssel/Trust/Berechtigungen, tatsächliche Publikation→Browser, Scheduler-Langzeit/DST und einmalige Betriebsfreigabe bleiben offen; keine Aktivierung in dieser Welle. Physische Apple-/Android-/schwache Geräte, VoiceOver/TalkBack, fünf wirklich gehörte deutsche Texte und unabhängige Personen ebenfalls offen. Headless Chromium stellt hier keine deutschen Stimmen bereit.

Nächste abhängige große Welle nach reviewter/übernommener Grundlage: alle vorhandenen sechs Artikelbestände individuell fachlich, pädagogisch und visuell nacharbeiten und je Bestand neue eigenständige vernetzte Themen liefern; insbesondere die kleinen Erfindungs-/Bauwerksbestände substanziell erweitern. Wörter/Warum/Natur, alle Reisen und Spiele/Labore bleiben ausdrücklich im vollständigen 3.5-Programm. Danach Pakete 4–8 unverändert. WK-038 Memory bleibt eine spätere Spezialaufgabe; der vorhandene Memory-Zustand ist trotzdem Teil der 3.5-Qualitätsprüfung. Kein automatisches Merge, main/test-live-Push oder Deployment.

## Tatsächlich ausgeführter Restore und aktuelle Warmbuild-Proben

Lokaler GitHub-Checkpoint `24b26aa211d517ae8d39118aa5e49196c88437d5` wurde aus einem echten Bundle in einen neuen Bare-Checkout zurückgespielt; `git fsck --full` und identische Trees für diesen Head, test-live d0 und unverändertes main bestanden. Ein zweites Original-Sites-Bundle wurde unabhängig zurückgespielt, mit gleichen Trees für den ersten Vorversions-Commit d3 und den letzten v14-Commit. Bundlegrößen 14332369 und 12195563 Bytes. Keine Zugangsdaten aus der Prozessumgebung oder persönlichen Pässe hinzugefügt; vorhandene versionierte Originalquellen erhalten; Dateien bleiben lokal unter dem ignorierten work/. Der spätere finale Dokumentationscommit ist kein erneuter ungeprüfter App-Code.

Drei nacheinander ausgeführte warme Builds je Stand, gleiche Maschine/Node 24.19/pnpm 11.25, exakt gleicher Dependency-Lock und vorhandene Originalinstallation. P3 d0 p50 1.958 s / Stichprobenmaximum 2.06 s; aktuelle Welle p50 1.805 s / Maximum 2.0 s. Drei Proben sind keine belastbare Flake- oder p95-Langzeitstatistik und kein kausaler Beleg einer Buildbeschleunigung.

Komprimiertes Gesamt-JavaScript 1098546 → 1099231 Bytes; Einstieg 277897 → 277921 Bytes. Vorhandene Budgets bestanden unverändert. Der Gesamtbudgetspielraum liegt nur noch bei 769 Bytes: Die nächste große Inhaltswelle muss Datenladewege und ihre tatsächliche Nutzung gezielt messen/optimieren, bevor neuer Umfang hinzukommt; keine bloße Budgetanhebung.

## Erneute isolierte Browser-Performanceprobe

Gleiche aktuelle Maschine, Chromium 151, Produktionsvorschau, frische 390×844-Kontexte, drei Proben je Bereich, keine Drosselung und kein anderer Browser gleichzeitig. Vorher ist exakt P3-Merge d0; nachher derselbe Grundlagen-Code wie die aktuelle vollständige Regression. Laborwerte, keine Feld-Core-Web-Vitals oder Garantie für schwache Geräte. p95 wird bei drei Proben als Stichprobenmaximum geführt; keine belastbare Langzeitstatistik.

| Bereich | Bereit p50 vorher/nachher ms | Stichprobenmaximum vorher/nachher ms | CLS Maximum vorher/nachher |
| --- | ---: | ---: | ---: |
| home | 477 / 434 | 533 / 460 | 0.011 / 0.011 |
| world | 593 / 541 | 605 / 548 | 0.032 / 0.032 |
| games | 439 / 420 | 448 / 501 | 0.021 / 0.021 |
| labs | 616 / 575 | 666 / 607 | 0.028 / 0.028 |
| journeys | 604 / 607 | 683 / 639 | 0.028 / 0.028 |
| book | 505 / 438 | 574 / 480 | 0.031 / 0.031 |
| updates | 411 / 420 | 470 / 476 | 0.0 / 0.0 |

## Nachgeschärfter Quellen- und Fehlernachweis

Die alte Integritätsprobe konnte einen alten Export mit passendem altem Hash akzeptieren, auch wenn seine aktuelle Quelldatei inzwischen anders war. `verify` erzeugt deshalb alle 40 Exporte erneut aus den tatsächlich aktuellen Quellen in einem ausschließlich ignorierten Prüfverzeichnis und vergleicht vollständige Dateinamen-/Hash-/Source-Manifeste. Ein Integrationstest führt diese echte Extraktion in einer isolierten temporären Quellenkopie aus, verändert dort Länder-Metadaten bei unverändertem altem Export und weist die Sperre nach. Private Fortschritte werden weder kopiert noch exportiert. Die Fachbaseline bindet zusätzlich ihre vollständigen Identitäts-/Routen-/Quellmetadaten; die 1.955 Ausgangsidentitäten und alle Fachzahlen bleiben exakt gleich. Diagnoseberichte werden auch bei beschädigten Bildern vorab erhalten. Diese tatsächlichen Änderungen an Prüfcode begründen die erneute vollständige Schlussabnahme; kein stilles Weiterverwenden veralteter grüner Quittungen.

## Finale lokale Quittung dieser Welle

TypeScript, ESLint, 111 Unit-Tests, 27 Release-Tests, Produktion/alle unveränderten Budgets und die aktuelle Vierzig-Quellen-Extraktion bestanden am finalen Code. Vollständige Chromium-Regressionsprobe: 579.9 s, alle zehn Pflichtgruppen, 114 Prüfbezeichnungen; keine Fehler und keine ignorierte/fehlende Gruppe. Native 200%-Probe, Großschrift, Pass-/Backup-/Zwei-Tab-/Altstand-/Worker-/kalte Offlinewege enthalten. Vollständiger Handoff enthält 24 Anforderungsmappings und aktuellen Code-/Build-/SHA-Nachweis.

Aktuelle lokale Bildbelege: 783 Original-PNGs / 133695595 Bytes erzeugt; 305 gezielte Originale / 43018119 Bytes für Review behalten, alle Hashes/Abmessungen und alle Reports vorhanden. Begrenzt und ohne fehlendes Pflichtbild bestanden. Dies ist der gemessene lokale PNG-Umfang; die tatsächliche neue GitHub-ZIP-Größe folgt in der PR-Quittung, nicht aus dieser Zahl abgeleitet.

Persönlich angesehen: finale Kapitelverknüpfungen bei 320/390/768/1440, gefüllte Vorschauen und sichtbarer Rückkehrfokus; Chronik-Teststand/echte PR-25-Zeit auf Smartphone und Desktop sowie getrennte unveröffentlichte Vorbereitung. Zusätzlich persönlich angesehen: echte native 200%-Wasser-/Großschriftbilder, Chronikarchiv als vollständige Übersicht und gut lesbare alte v1-Einzeldetails. Das sehr lange Gesamtarchiv wird beim Bildlesen heruntergerechnet; daraus wird keine persönliche Zeile-für-Zeile-Textprüfung behauptet. Keine persönliche Sichtung fremder Browserbilder oder physischen Geräte behauptet. Firefox/WebKit werden im bestehenden GitHub-Lauf tatsächlich ausgeführt; lokal fehlen die freigegeben herunterladbaren zusätzlichen Engine-Binaries.

Erneute Originalquellen-Bereitschaftsprobe im aktuellen Cloudkontext: blocked; operativ weiterhin false. NASA-EPIC, NASA-Exoplaneten und GitHub-Godot lieferten hier „fetch failed“, auch mit dem Sessionproxy. Das ist kein erfolgreicher aktueller Quellen-End-to-End-Lauf. Vorhandener P3-EPIC-Testnachweis bleibt historisch; Rechtefingerprints/Hosting/Trust/Aktivierung bleiben offen. Keine Liveaktivierung oder neuen Dienste/Keys.

## Gezielter Speichersicherheits- und Wartungsnachweis24.10.2026

Der neue Auftrag ist unter content/auftrag-2026-10-13 bytegleich archiviert (12.808Byte, SHA256bf6bf3e13078a2c88069873ea7c7a5eb5d5cd0eaaa7bf77f49a54d1f75a70691). Die ausdrücklich genehmigte Konsolidierung ersetzt widersprüchliche aktive Regel-/Statusschichten, erhält Originalentscheidungen über Archiv und unveränderte Git5529-Referenzen. Tatsächlicher Dokumentdiff geprüft: alle56vorhandenen WK-Aufgabenzeilen/24Anforderungsmappings/24Designzeilen und lokalen Links erhalten; Zukunftsideen bleiben bestehenden Paketen zugeordnet. Readiness-Schutzliste, Workflow, Kontextprüfung, Betriebserlaubnis und technische Budgetdateien unverändert. Diese konkrete Wartungsprüfung ist keine allgemeine Schutzfreigabe.

Tatsächliche Gegenbelege am unveränderten Wissenschaftsbuild3effeb74f79bd539/Commit5529:−34wird nach Wiederöffnen/Reload/gültigem Dateipassimport zu0; derselbe permanente Modellguard erkennt dies. Passapp3/progress:[]öffnet gewöhnliche Bestätigung und löscht danach synthetische Notizen/Favoriten/Modellstände. Originale samt fokussierten Produktbildern unverändert erhalten. Modellwiederherstellung nun vor allgemeiner Spielzählernormalisierung anhand deklarierter Grenzen, Integerregel/Enum;65Modellaufrufe überprüft. Echte Spielzähler/Indices bleiben unverändert geschützt. Dateiimport prüft aktuelle historische vollständige Struktur und unterstützte Legacyformen vor Normalisierung/gewöhnlicher Bestätigung; interne Journalreparatur bleibt gesondert.

Aktueller Vorprüfstand53dbe9a5d4c048f6d5165ee42a2100ffc779a8bd812c86aced1d692c9be12a40/Appf9563c257c416c27:224Units/130Release-Gitfälle, Typecheck/Lint/Buildbudgets bestanden. Reales Produkt320/1440undnative200%640/320:−34bleibt nach Wiederöffnen/Reload/echtemDownload/-Import erhalten; unabhängige Juniwerte9,7h/32,6°und Gegenhalbkugel14,3h passen zur tatsächlich gezeichneten Kurve und Speicherung. Fünf beschädigte Formen öffnen keinen gewöhnlichen Ersetzungsdialog und erhalten gesamten vorhandenen Fortschritt/Epoch. Tatsächlich exportierter bewusst leerer Pass und unterstützterv2-Pass weiter nutzbar. Bilder persönlich betrachtet. Dieselben Schutzhelfer in vorhandene Backup-/Research-Pflichtmodule integriert, keine neue Suite oder Plattform. Früherer2ffTeilgruppenbeleg115,502s bleibt auf seinen damaligen Stand begrenzt; neue vollständige Schlussabnahme/nativeCI/Deployment folgen separat im zugehörigen PR.

Lern-/Bediennutzen: Das Kind kann eine Südhalbkugel-Vermutung nach einer Pause verlässlich fortsetzen; eine beschädigte Datei führt vor Datenersatz zu einer verständlichen Ablehnung. Dies belegt funktionale Integrität, keine empirische Lernwirkung oder vollständige unabhängige Menschen-/Geräteabnahme. Andere Prozess-/Fachbefunde des Audits bleiben mit Status/Nächstschritt/Ergebnis ausschließlich unter vorhandenen WK052/053/056/057 im BACKLOG.


## Erhaltener Wasserabschnitt auf tatsächlich geliefertem M76 · Vorbereitung29.10.2026

Vier neue Begriffe (Kohäsion, Adhäsion, Oberflächenspannung, Kapillarwirkung), drei Warumfragen (Papiertuch, Grenzflächenkontakt einer Nadel, hohler Schiffsrumpf) und eine zusätzliche Dichte-Vertiefung. Vorhandene Dichte-Kurzdefinition, alle113Wörter/34Warumfragen und vollständige SI-/Wärme-/Lichtpakete bleiben exakt erhalten; keine zusätzliche Dichte-Zählung. Alle acht erhaltenen Manuskripte einzeln gegen aktuelle ausgewählte Fachbelegstellen gegengelesen. Neuer Kandidat117/37, acht neue Akten; keine unabhängige Menschen-/Kinderabnahme.

Tatsächlich am28.10. gelesene Quellen: USGS Water Science School [surface tension](https://www.usgs.gov/water-science-school/science/surface-tension-and-water), [capillary action](https://www.usgs.gov/water-science-school/science/capillary-action-and-water), [density](https://www.usgs.gov/water-science-school/science/water-density); NOAA [Build a boat](https://www.noaa.gov/office-education/outreach-communication/hands-on-science-activities/build-a-boat); OpenStax College Physics2e [11.8](https://openstax.org/books/college-physics-2e/pages/11-8-cohesion-and-adhesion-in-liquids-surface-tension-and-capillary-action) und [11.7](https://openstax.org/books/college-physics-2e/pages/11-7-archimedes-principle). Konkrete Belegstellen und Abrufdatum je Eintrag. Masse nicht mit Gewicht gleichgesetzt, kein unbegrenzter Kapillaraufzug oder vollständiger hoher Baumtransport behauptet. Keine aus Oberflächenkontakt abgeleitete geringere Materialdichte oder feste Haut. Schiffserklärung betrachtet gesamte Form, verdrängtes Wasser und Grenzen durch Lage/Wassereintritt. Tatsächliche OpenStax-NC-SA4.0-/KI-Hinweise berücksichtigt; nur Faktenabgleich, keine Texte, Aktivitäten, Tabellen, Grafiken, Fotos oder Code kopiert, keine CC-BY-Medienlizenz unterstellt.

Fünf eigene SVG-/HTML-Zeichnungsarten nutzen die vorhandene Buchgestaltung: Paarungen bei unveränderten Wassersymbolen, dasselbe Gedankenobjekt an/unter einer Grenzfläche, begrenzte Stände zweier benetzbarer Röhrchen, drei Masse-/Volumenvergleiche und kompakte/hohle Form ohne zugesicherte Schwimmlage. Lesbare normale HTML-Legenden statt kleiner SVG-Schrift, sichtbare KI-Herkunft und konkrete Modellgrenzen. Zahlen sind erfundene Verhältnisbeispiele; Felder zählen Volumeneinheiten, nicht Moleküle oder reale Stoffeigenschaften. Dichte-Aufgabe6/2gegen8/4 prüft den Quotienten statt bloßer Gesamtmasse. Plausible Fehlantworten erhalten spezifische Rückmeldungen; eigene Erklärungen werden nicht automatisch bewertet.

Kanonische Verknüpfungen verbinden die drei vorhandenen Fachkarten und alte Wörter mit neuen Inhalten. Dichte→Kilogramm erzeugt denselben erklärten Gegenverweis am Kilogramm-Eintrag. Zusammenführung ergänzt alle bisherigen Lichtbeziehungen, kein zweiter manueller Graph, keine neue Empfehlungsebene oder Speicherstruktur. Native eigene Zeichnungen mit React bleiben für diese kontrollierten Zustände ausreichend; vorhandene Motion-Übergänge und gemeinsame Komponenten werden weiterverwendet, keine neue Bibliothek oder Zusatzkosten.

Früher aktueller statischer Stand:48vollständige Exporte/134Dossiers, alte126Objekte unverändert. Keine vorzeitige UI-Bindung; tatsächliche frühe Browserprobe und vollständige Schlussqualifikation folgen. Die erste neue Prüfroutine hatte die beiden benötigten Wörter irrtümlich in der ersten24erSeite gesucht; vorhandene Pagination wird jetzt tatsächlich bedient. Produkt und bestehende Prüfgrenzen unverändert; ursprünglicher Teilfehler bleibt erhalten.

Frühe aktuelle integrierte Darstellung tatsächlich geprüft: alle acht Einträge/alle Antwortoptionen/Hinweise/Rückmeldungen/Modellzustände/Quellen und Artikel-Rückwege in Chromium156, Firefox157 und WebKit27.2 bei320groß und1440normal. Alle acht zusätzlich über globale echte Tastatursuche erreicht; fünf bestehende/neue Gegenverweise einschließlich Kilogramm→Dichte mit sichtbarem Tastaturfokus und Zurück geprüft. Fünf Modellarten in tatsächlichen gerenderten Bildern persönlich beurteilt. Echter synthetischer M76-Dateipass, zwei Wasser-Favoriten, Download/Reset/Import/Reload sowie kalter neuer Browser ohne Neueinsaat bei gestopptem und nachweislich unerreichbarem eigenem Ursprung bestanden; normale Darstellung und native200Prozent320/640mit Großschrift. Alle alten gesicherten Zustände erhalten. Diese Teilbelege ersetzen keine vollständige Schlussabnahme;134aktuelle UI-Bindungen bleiben bis danach ausstehend. Aktuelle vollständige311Unit-/130Release-Gitfälle, Typ/Lint und Buildbudgets bestehen.
