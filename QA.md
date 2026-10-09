# WunderKompass – Abschlussprüfung und Umsetzungsstand

Stand: 9. Oktober 2026. Bestehendes Projekt „Erde entdecken“, bestehende URL und Speicherformat bleiben erhalten. Dieser Bericht beschreibt die fortgeführte Ausbaustufe und ihre tatsächlichen Prüfungen. Die früheren Berichte `MASTER-AUDIT.md` und `WORLD-AUDIT.md` dokumentieren ältere Stände; ihre damaligen offenen Punkte sind nicht automatisch heutige Fehler.

Die vollständige Originaldatei eines späteren WunderKompass-Masterprompts war in dieser Fortsetzung nicht wieder auffindbar. Deshalb ist dies keine unbelegte Bestätigung jedes Satzes aller früheren Prompts. Nachverfolgbar sind der vorhandene Projektstand, die erhaltenen Anforderungen und die 32 konkreten Maßnahmen des vorherigen Qualitätsaudits.

## Ergebnis für das Kind

Die Weltkugel bleibt der Einstieg. Sechs ergänzende Wissenswelten verbinden insgesamt 108 ausgewählte Karten: 24 Tiere, 31 historische Themen, 18 Menschen, zwölf Erfindungen, acht Bauwerke und 15 Wissenschaftsthemen. Alle ursprünglichen 90 Karten und ihre IDs bleiben erhalten. Neue Inhalte werden über dasselbe Fortschrittssystem gespeichert.

Die 16 Erd-Lernreisen behalten ihre 80 Kapitel. Die 64 zuvor bildarmen Folgekapitel haben jetzt erklärende, auswählbare SVG-Diagramme; die 16 Einstiege behalten ihre vorhandenen Visualisierungen. Kapitelgrafiken erklären Vorgänge oder räumliche Zusammenhänge und nennen Modellgrenzen.

Die zwölf Erfindungen haben anwählbare Bauteile in eigenen Funktionszeichnungen sowie unterschiedliche Darstellungen für früher und heute. Sechs Bauwerke haben gespeicherte Bauschritte; Brücken- und Schleusenmodelle bleiben erhalten. Bei sechs sensiblen Geschichtsthemen erklärt eine freiwillige Kontextfolge Davor – Ereignis – Danach den Zusammenhang ohne Schockbilder.

Neun zusätzliche Modelle behandeln Atmosphäre, Magnetfeld, Meeresströmungen, Motor, Nahrungsketten, Schall, Planetenmaße und -abstände, Solarenergie mit Speicher sowie einfache Musterregeln. Drei neue Wissensrouten ergänzen die ursprünglichen drei. Eine Beobachtung oder richtige Erklärung verdient einen Stempel; das bloße Öffnen eines Modells tut dies nicht.

## Abschließend gefundene und korrigierte Fehler

| Tatsächlicher Fehler | Korrektur | Erneuter Nachweis |
| --- | --- | --- |
| „Wer frisst was?“ erwartete ausschließlich das bisherige Faktenlabel; neue Tierkarten verwendeten „Nahrung“. | Beide Datenvarianten werden gelesen; fehlende Fakten lassen die Runde nicht abstürzen. | Die Runde mit fünf Aufgaben tatsächlich abgeschlossen und nach Reload fortgesetzt. |
| Ein anderer offener Tab konnte nach Import durch unveränderte Initialwerte das Ziel von „Fortsetzen“ überschreiben. | Wiederhergestellte, unveränderte Modellfelder schreiben keine neue Lernaktivität. Bewusste Karten- und Routenauswahl merkt ihre Aktivität ausdrücklich. | Echter Download, Zurücksetzen, Import mit zwei Tabs, Reload und Rückkehr zum gespeicherten Schallmodell. |
| Der Sprunglink konnte den Hauptinhalt nicht fokussieren und teilte seinen Hash mit der internen Navigation. | Fokussierbarer Hauptinhalt; der Sprunglink setzt den Fokus unmittelbar. | Mit Tastatur bedient. |
| Ohne registrierten Dialog-Trigger ging der Fokus beim Schließen der Suche verloren. | Dialoge merken den öffnenden Fokus. Eine Suchauswahl behält die Zielnavigation. | Suche, Pass, Hilfe und Elternzugang mit Enter/Escape geprüft. |
| Der Footer-Link „Für Eltern & neugierige Köpfe“ öffnete die Hilfe; der eigentliche Elternbereich war unerreichbar. | Er öffnet jetzt den Elternbereich. Von dort führen echte Aktionen zu Hilfe, Lernreise und Pass. | Richtige Überschrift und Übergang zur Hilfe geprüft; zusätzliche Ansichten bei 360, 390, 768 und 1440 px. |
| Der nun erreichbare Elternbereich hatte ein zu kleines Schließen-Ziel und keine klare Absatz-/Listenhierarchie. | 44-px-Schließen-Ziel, sichtbare nummerierte Schritte, gegliederte Überschriften und Absätze. | Größen-, Überlauf-, Kontrast- und Screenshotprüfung. |
| Die Suche zeigte zu manchen Tieren sowohl die gleichnamige alte Naturstelle als auch die neue ausführliche Karte. | Inhaltlich identische Naturtreffer werden zusammengeführt; die Karte bietet weiterhin den Globus-Ort. | „Giraffe“ ergibt genau einen gleichnamigen Kartentreffer. |
| Der Hilfehinweis behauptete pauschal, dass keine persönlichen Daten eingegeben würden, obwohl das Notizbuch Freitext erlaubt. | Persönliche Daten sind nicht erforderlich; eigene Notizen bleiben lokal. Online-Systemstimmen werden im Elternbereich erklärt. | Textprüfung; eigene Notizen dürfen nur mit einer lokalen Stimme vorgelesen werden. |

## Tatsächlich ausgeführte Prüfungen

Die Browserprüfungen verwenden einen lokalen **Produktionsbuild** mit echtem Chromium 153 und Software-WebGL, nicht nur eine Codeinspektion oder JSDOM. Browserprofile und Lernstände sind isolierte Prüfdaten. Die vorliegenden Ergebnisse stammen aus mehreren Profilen und dürfen nicht zu einem angeblich einzigen Kinderpass addiert werden.

| Prüfung | Was tatsächlich ausgeführt wurde | Ergebnis / Grenze |
| --- | --- | --- |
| Inhalt und Medien | Alle 108 Karten geöffnet, Mini-Fragen und Vertiefungen kontrolliert, vorhandene Artikelbilder dekodiert; alle 80 Kapitel geöffnet; zwölf Erfindungsvergleiche bedient. | Keine festgestellten Seitenfehler, fehlgeschlagenen eigenen Medienanfragen oder horizontalen Überläufe in diesem Ablauf. Kein Nachweis, dass jeder externe Quellenlink dauerhaft erreichbar bleibt. |
| Alte und neue Spiele | Alle 30 Spielangebote gespielt: 22 bestehende Angebote einschließlich Quiz und Globussuche sowie acht Wissensspiele. Falsches Feedback, Abschlüsse und gespeicherte Runden geprüft. | Stempel werden verdient. Karten-, Fragen- und Antwortreihenfolge bleiben bei den geprüften Reloads erhalten. Ein Sortierangebot hat zwei Aufgabenvarianten; dadurch enthält das alte Protokoll 23 Abschluss-IDs für 22 Angebote. |
| Lernreisen und Labore | Alle 16 Reisen durch fünf Kapitel und Abschlussfrage; jede Reise in Kapitel 3 neu geladen und mit „Weiterlernen“ fortgesetzt. Alle elf Labore verändert, neu geladen und fortgesetzt; falsche und richtige Abschlussantworten. | Alle 16 Reise- und elf Laborabschlüsse gespeichert. Falsche Antworten verdienen keinen Laborstempel. |
| Neue Modelle und Wissensrouten | Alle neun neuen Modelle mit Beobachtungsbedingungen und Reload; alle sechs Wissensrouten mit fünf Stationen und einem Reload in der dritten Station vollständig abgeschlossen. | Zustände und Abschlüsse gespeichert; alle sechs Routen führen nach Reload zur richtigen dritten Station zurück. |
| Bestehende Modelle | Sechs Bauschrittfolgen, sechs historische Kontextfolgen, Schattenvergleich einschließlich flacher Sonne, Flügel-Luftstrom und gespeicherte Auswahl. | Keine festgestellten Anwendungsfehler. Qualitative Modelle bleiben als Vereinfachungen erklärt. |
| Abzeichen | Alle sieben neuen Abzeichen durch Kartenfragen, Spiele, Modelle und tatsächliche Globus-Orte verdient. | Neue Wissensspiele schalten das alte Spielplatz-Abzeichen nicht fälschlich allein frei. |
| Suche | Deutschland, Elefant, Elefamt, Einstein, Auto, Pyramiden, Pazifik, 9/11, Giraffe, Walhai, Internet und Länder-Memory gesucht und Treffer geöffnet; leere Trefferliste geprüft. | Passende Ziele erreichbar. Bei „Pyramiden“ ist die historische Karte ein sinnvoller erster Treffer; die Bauwerkskarte bleibt ebenfalls erreichbar. |
| Responsive und Accessibility | 152 Ansichten über elf Größen: 360×780, 375×812, 390×844, 430×932, 844×390, 768×1024, 1024×768, 1366×768, 1440×900, 1920×1080, 2560×1440. Zusätzlich vier Ansichten des korrigierten Elternbereichs. Axe-Prüfungen auf repräsentativen Ansichten; Tastatur, Sprunglink, Dialog-Rückkehr und SVG-Bauteil bedient. | Kein horizontaler Überlauf und keine verbliebenen Verstöße der ausgeführten Axe-Regeln. Die ersten „parents“-Protokolle prüften tatsächlich die damalige Footer-Hilfe; der richtige Elternbereich wurde gesondert geprüft. Die 24-px-Zielprüfung berücksichtigt Inline-Link-Ausnahmen; sie ist keine Behauptung, dass jedes Element 44×44 px groß ist. |
| Globus | Länderwahl, alle vier Erdschichten, Tag-/Nacht-Reset; native CDP-Touchereignisse zum Scrollen, Drehen und Zwei-Finger-Zoom; WebGL absichtlich deaktiviert und Länderwahl in der SVG-Alternative. | Inaktiver Globus erlaubt Seitenscrollen; aktiver Globus dreht ohne Seitenscrollen. Pinch verändert die gerenderte Kamera sichtbar. Kein physischer Touchscreen getestet. |
| Speicherung | Zwei gleichzeitig offene Tabs, Ergänzen/Entfernen, exakte Silhouettenrunde nach Reload, beschädigte Memory-Auswahl, echte Sicherungsdatei, bestätigtes Reset/Import und ungültige Datei. | Kein festgestellter Verlust der geprüften gültigen Daten. Beschädigte Memory-Auswahl wird repariert. Importziel und Modellwerte bleiben erhalten. |
| Offline und Update | Älteren veröffentlichten Build über den tatsächlichen Offline-Knopf installiert; echten Service-Worker-Wechsel zum neuen Build durchgeführt. Chromium vollständig geschlossen, dasselbe Profil ohne Internet neu gestartet. Neue, zuvor ungeöffnete Tierbilder, Porträt, Bauwerk, Hauptbereiche und Modell geöffnet. | Pass, Einstellungen und Modellzustand bleiben erhalten. Offline setzt erfolgreiche Vorbereitung voraus; externe Quellenlinks und Online-Stimmen sind hiervon nicht umfasst. |
| Vorlesen | Start/Stopp, korrekter Text, Seitenwechsel, gespeicherte deutsche Stimmwahl, Fehler-/Ende-Ereignisse, fehlende deutsche Stimme und lokale Notizen mit instrumentierter Sprach-Engine. | Steuerung bestanden; kein Autoplay und keine parallelen Stimmen. **Keine natürlich klingende deutsche Stimme tatsächlich gehört.** Der Prüf-Chromium meldet keine geeignete Stimme. |
| Quellcode und Build | 20 Node-Tests, TypeScript, ESLint für App und den geänderten Dialog; produktiver Sites-Build. | Erfolgreich. Die bekannte Build-Warnung zu größeren Chunks bleibt ein Messpunkt; sie ist kein festgestellter Laufzeitfehler. |

## Maßnahmen P01–P32 des vorherigen Audits

„Umgesetzt“ beschreibt die vorhandene Funktion und die oben bezeichneten Nachweise, keine allgemeine Zertifizierung.

| Maßnahme | Stand | Konkretes Ergebnis oder offene Grenze |
| --- | --- | --- |
| P01 Zwei Tabs / Speicherung | Umgesetzt | Gemeinsamer versionierter Store, Konfliktbehandlung, Reset-Epochen, echte Zwei-Tab-Prüfungen. |
| P02 Silhouettenrunden | Umgesetzt | Stabile Länder-IDs, Aufgaben-/Antwortfolge und kompatible Wiederherstellung. |
| P03 Prüfprozess / Lint | Umgesetzt | Gepflegte Browser- und Node-Skripte, bestandene TypeScript-/Lint-/Build-Prüfungen. Browser-Hilfspfade beziehen sich auf diese Prüfumgebung und benötigen bei einer anderen CI Anpassung. |
| P04 Touch-Scroll am Globus | Umgesetzt, Geräteabnahme offen | Ausdrückliches „Drehen & zoomen“ / „Seite scrollen“, geprüfte native Touchereignisse. |
| P05 Erfindungszeichnungen | Umgesetzt | Zwölf Bauteilzeichnungen mit Interaktion und unterschiedlichen Früher-/Heute-Darstellungen. |
| P06 Vertiefungen | Umgesetzt | Eigenständige Erklärungen statt generischer Wiederholungen, Alltagsbeispiele und Fachworterklärungen. |
| P07 Porträts / Kapitelgrafiken | Umgesetzt | Alle 18 Personen mit lokaler Darstellung; 64 neue Folgekapitelgrafiken. Spätere Porträts sind ausdrücklich als spätere Darstellungen gekennzeichnet. |
| P08 Globale Suche | Umgesetzt | Namen vor beiläufigen Erwähnungen, Aliase/Tippfehler, verständliche Vorschauen, weniger Dubletten. |
| P09 Mobile Kopfzone / Wissensbuch | Umgesetzt | Kompakter Kopf auf Unterseiten, Wörter in Portionen, erhaltenes Alphabet und Filter. |
| P10 Physische Geräte / Screenreader / gehörtes Audio | Noch offen | Kein iPhone, iPad, Android-Gerät, Safari, Firefox, VoiceOver oder TalkBack tatsächlich geprüft. Simulation ersetzt diese Abnahme nicht. |
| P11 Beschädigtes Memory | Umgesetzt | Semantische Rundenprüfung und sichere Reparatur statt TypeError. |
| P12 Tag-/Nacht-Reset mobil | Umgesetzt | Reset in schmalen Ansichten sichtbar und bedienbar. |
| P13 Vernetztes Wissensbuch | Umgesetzt | Themen-, Reise- und Laborverbindungen, Karten, ausgewählte Naturbilder und lokale Notizen. |
| P14 Tierauswahl | Umgesetzt | Walhai, Gartenkreuzspinne, Dromedar und Seeadler ergänzen Gruppen und Lebensräume gezielt. |
| P15 Größen-/Gewichtsregeln | Umgesetzt | Eindeutige Messlabels, Richtwerte und passende Größenvergleiche. |
| P16 Tierfragen / Schutz | Umgesetzt | Mehr Fragen zu Verhalten, Nahrung und Anpassung; konkrete, hoffnungsvolle Schutzinformationen. |
| P17 Weltregionen / Geschichte | Umgesetzt | Maya, polynesische Navigation und Timbuktu sowie griechische/römische Anker; bestehende Kulturen und Menschen werden nicht als „unentdeckte“ Welt dargestellt. |
| P18 Sensible Geschichte | Umgesetzt | Freiwilliger Einstieg und sechs Davor-/Ereignis-/Danach-Folgen; keine drastischen Medien. |
| P19 Menschen / Fachsprache | Umgesetzt | Verständliche Arbeitsbeispiele und Vertiefung; Beiträge im Zusammenhang statt falscher Einzelerfinder-Geschichten. |
| P20 Bauwerke | Umgesetzt | Überprüfte, qualifizierte Maße, Bauphasen und Modellgrenzen; heutige Orte am Globus. |
| P21 Schatten / Flügel | Umgesetzt | Sichtbarer Schattenvergleich und vereinfachte Luftablenkung; keine Gleichlauf-Behauptung über Luftteilchen. |
| P22 Doppelte Quizfragen | Umgesetzt | Semantische Doppelungen werden bei der Rundenauswahl zusammengeführt; vorhandene Fortschritts-IDs bleiben erhalten. |
| P23 Spiel-CTA | Anders umgesetzt | Ehrlicher Bereichsbutton „In dieser Welt spielen“ statt der Behauptung, die Runde frage genau die gerade gelesene Karte ab. |
| P24 Direktlinks / Zurück | Umgesetzt | Stabile Hashpfade für Kategorien, Karten und Routen; Browser-Zurück und Fokuswechsel geprüft. |
| P25 Vorlesestimmen | Umgesetzt, Hörprobe offen | `voiceschanged`, deutsche Auswahl, gespeichert, klares Feedback. Start/Stopp bleibt die bewusste Bedienung; keine ungeprüfte Pause-/Fortsetzen-Zusage. |
| P26 Privatsphäre-Texte | Umgesetzt | Eigene Notizen lokal, Sicherungen enthalten Freitext, Online-Systemstimmen erklärt. Keine pauschale Datenschutz-Zertifizierung. |
| P27 Touchziele / Fokus | Verbessert, Geräteabnahme offen | Größere Schalter, Regler und Dialog-Schließen; Tastatur- und Zielgrößenprüfung. |
| P28 Performance | Teilweise | Lokale angepasste Bilder, verzögertes Laden und vorhandene Grafikbegrenzung bleiben erhalten. Keine repräsentativen Core Web Vitals oder Hardware-FPS; keine riskante Geometrieverkleinerung ohne Messung. |
| P29 CSS / Komponenten | Teilweise | Eigene Komponenten für Kapitel, Karten, Bauphasen, Erfindungen und neue Modelle. Ein vollständiger Umbau der gewachsenen CSS-Kaskade wurde bewusst nicht mit dieser Abnahme vermischt. |
| P30 Canva | Optional bewertet | Kein zusätzlicher Laufzeitdienst. Eigene SVGs sind für genaue, interaktive Diagramme zweckmäßiger; geprüfte lokale Fotos für reales Aussehen. Canva bleibt optional für statische Arbeitsblätter. |
| P31 ElevenLabs | Optional bewertet | Kein kostenpflichtiger Audiobetrieb integriert. Erst gehörte Gerätestimmen vergleichen; bei echtem Vorteil wenige geprüfte, vorab erzeugte lokale Clips. Keine Kindereingaben oder Frontend-API-Schlüssel. |
| P32 Weitere fachliche Lücken | Umgesetzt für diese Ausbaustufe | Neun neue Modelle und drei Wissensrouten schließen ausgewählte Lücken. Keine Behauptung eines vollständigen Weltlexikons. |

## Gute Bestandteile erhalten

Der Globus bleibt Mittelpunkt. Die sieben Kontinente und fünf Ozeane bleiben als gewähltes Einteilungsmodell erklärt. Kleine Länder sind weiterhin über die Ortsauswahl erreichbar. Die bestehenden 16 Lernreisen, 30 Spielangebote, elf Labore, Wissenswörter, Warum-Fragen, zwölf Globusmissionen und sechs gemeinsamen Versuche bleiben erreichbar.

Rätsel haben freundliches Feedback, erneute Versuche und keinen Zeitdruck. Quellennachweise, Messregeln, sensible Einstiegshinweise und die Verbindung von Karten zu echten Orten bleiben erhalten. Fortschritt wird zentral gespeichert; es gibt keinen zweiten Tier-/Geschichts-Pass und keine automatische Übertragung auf einen eigenen Lernserver.

## Grenzen und pädagogische Einschätzung

Die erste Lernstufe ist kurz, die zweite erklärt zusätzliche Zusammenhänge. Bilder und Modelle dienen dem Lernziel. Mini-Fragen und Aufgaben lassen das Kind Wissen anwenden. Das ist eine fachlich begründete Produktgestaltung, **kein Nachweis einer Lernwirkung mit echten Kindern**. Eine kurze beobachtete Nutzung mit Kindern wäre der nächste pädagogische Nachweis.

Offen bleiben physische Geräte, gehörte Audioqualität, manuelle Screenreader-Abnahme, 200-%-Browserzoom auf Geräten und repräsentative Leistungswerte. Die Namensänderung ist technisch umgesetzt; eine rechtliche Markenfreigabe ist nicht nachgewiesen. Die App wurde nicht pauschal als vollständig barrierefrei, überall offline oder unabhängig von Browserdatenlöschung zertifiziert.

Zusätzliche Plugins sind für den aktuellen Ausbau nicht erforderlich. Canva und ElevenLabs bleiben optionale Produktionshilfen, keine Pflicht für die Lernwelt. Es wurden keine kostenpflichtigen Dienste oder geheimen Frontend-Schlüssel ergänzt.

## DIESE VERBESSERUNGEN WÜRDE ICH ALS VERANTWORTLICHER ENTWICKLER ZUERST UMSETZEN

Die früher kritischen Speicher-, Runden-, Such- und Medienfehler sind in dieser Ausbaustufe korrigiert. Die verbleibende Reihenfolge betrifft konkrete Prüfgrenzen und Wartbarkeit:

| Reihenfolge | Problem | Verbesserung und Begründung | Priorität | Aufwand | Risiko | Werkzeug |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | iOS-/Android- und Screenreader-Verhalten ist noch nicht tatsächlich abgenommen. | Gespeicherte Reise, Globus-Scroll/Pinch, Suche, Pass, 200-%-Zoom und Vorlesen auf iPhone/iPad und Android bedienen; Fehler gezielt korrigieren. Schließt die größte Evidenzlücke. | Hoch | Mittel | Niedrig für die Prüfung; abhängig vom Befund für Korrekturen | Safari, Chrome, VoiceOver, TalkBack |
| 2 | Die deutsche Stimme wurde nicht gehört. | Ein Kind und ein Erwachsener vergleichen die vorhandenen lokalen Stimmen an fünf kurzen Texten. Erst dann über vorab erzeugte Audioclips entscheiden. | Hoch | Klein | Niedrig | Bestehende Browserstimmen; ElevenLabs nur bei nachgewiesenem Vorteil |
| 3 | Kein repräsentatives Leistungsprofil auf schwächerem Gerät. | Kaltstart, sichtbaren Globus, Long Tasks und Energiebedarf messen. Nur den nachgewiesenen Engpass optimieren; kleine Länder/Labels schützen. | Mittel | Mittel | Mittel bei Änderungen an Geodaten | Browser-Profiler |
| 4 | Gewachsene CSS-Datei erschwert weitere Änderungen. | Stile abschnittsweise an Komponenten und gemeinsame Tokens binden, mit den vorhandenen Ansichten vergleichen. Kein vollständiges Redesign. | Mittel | Mittel | Mittel: Kaskade und Breakpoints | Bestehendes CSS und Screenshotregression |
| 5 | Lernwirksamkeit wurde noch nicht mit Kindern beobachtet. | Drei kurze Aufgaben mit Achtjährigen beobachten: Einstieg verstehen, Ursache im Modell erklären, später wiederfinden. Texte oder Feedback nur anhand konkreter Schwierigkeiten anpassen. | Mittel | Klein–Mittel | Niedrig | Beobachtung ohne zusätzliche Datensammlung |

Die Qualitätsfrage bleibt pro Seite: Hat ein neugieriges achtjähriges Kind nach dem Besuch etwas verstanden und gelernt – und Lust auf die nächste Entdeckung bekommen?
