# CHANGELOG

Was sich geändert hat, in einfachen Worten. Neueste Einträge oben.
Der Verlauf vor dem 21.11.2026 steht im alten Stand: `git show b53f75f:CHANGELOG.md`.

## 24.11.2026 – Teil B, Vorarbeiten: keine toten Knöpfe, schnellerer Start, ruhigere Tests

Bevor die Spiele kniffliger werden (Teil B), drei Vorarbeiten. Für Kinder sichtbar:

- **Kein Knopf mehr ins Leere:** Auf dem Globus zeigten rund 390 Orte, zum Beispiel alle Hauptstädte, den Knopf „Im Naturatlas weiterdenken“. Das Wissensbuch kannte sie aber nicht und sagte nur „Diesen Naturort gibt es hier nicht.“ Jetzt steht der Knopf nur bei Orten, die der Naturatlas wirklich erklärt.
- **Schnellerer Start:** Beim ersten Öffnen lädt die Seite 58 KB weniger. Ortssuche, Auswahllisten und der Tag-Regler kommen erst, wenn man den Globus oder das Quiz öffnet; offline sind sie trotzdem da.
- **Keine weiße Seite mehr:** Lädt ein Teil der Seite einmal nicht (zum Beispiel weil das WLAN gerade weg ist), steht an der Stelle „… braucht noch einen Versuch“ mit einem Knopf zum Neuladen. Der Rest bleibt bedienbar. Vorher konnte in so einem Fall die ganze Seite weiß werden.

Hinter den Kulissen:

- **Linkwächter:** Ein neuer Test prüft bei jedem PR, dass jeder feste Verweis der Seite zu etwas Vorhandenem führt. Er fand den Globus-Knopf oben und einen toten Wortverweis im Wissensbuch („Wolke“). [Landkarte aller Verweise](docs/entwurf/2026-11-24-linkwaechter-landkarte.md).
- **Tests warten von selbst:** Lädt ein Test die Seite neu, ruft eine neue Adresse auf oder schließt sie, wartet er jetzt an einer zentralen Stelle, bis nichts mehr lädt. Bisher musste jeder Test selbst daran denken; das war fünfmal schiefgegangen und erst spät aufgefallen.
- **Suche im Test:** Alle Tests, die in die Suche tippen und einen Treffer wählen, nutzen jetzt denselben sicheren Baustein.
- **Geprüft von zwei Helfern:** Technik ([Bericht](docs/entwurf/2026-11-24-teil-b-vorarbeiten-technik-pruefung.md)) und Code ([Bericht](docs/entwurf/2026-11-24-teil-b-vorarbeiten-code-pruefung.md)). Der Code-Helfer fand die weiße Seite oben; ein neuer Test lässt das Nachladen absichtlich scheitern.
- **Ein Klick, der still verpuffte:** In der Firefox-Prüfung auf GitHub klickte ein Test auf „Was ist neu?“ im Fuß, kurz bevor nachgeladene Teile der Startseite den Fuß weit nach unten schoben. Das Loslassen traf dann ein Bild, und nichts passierte. Jetzt warten alle Klicks in den Fuß, bis die Seite fertig geladen hat (`klickNachRuhe`). Dass der Fuß überhaupt so springt, steht im BACKLOG ([Bericht](docs/entwurf/2026-11-24-teil-b-vorarbeiten-technik-pruefung-spaeter-fund.md)).
- **Messwerte:** Funde vor dem PR: 13 (Linkwächter: 2 tote Ziele auf der Seite; `technik-pruefer`: 4 von 7 Befunden waren Fehler; `code-pruefer`: 7 von 9, darunter die weiße Seite) · späte Funde: 1 (Engine-Schnellprüfung Firefox, CI-Lauf 45397127026, nur im Test; die Vollprüfung auf `c84d1e2` fand keinen) · Dauer: rund 2¼ Stunden (Beginn gegen 11:40 UTC; Merge direkt nach grüner CI dieses Unterlagen-Commits, gegen 14:00 UTC).

## 24.11.2026 – Stufen-Feinschliff: jede Stufe mit Ziel

Aus dem ersten Spieltest (Rolle am Handy, kein Kindertest). Für Kinder sichtbar:

- **„Noch eine Frage“ bleibt in deiner Stufe:** Wer Profi spielt, bekommt keine Entdecker-Fragen mehr dazwischen, auch nicht beim Öffnen der Karte. Eine falsch beantwortete Frage wartet in ihrer Stufe; „Noch einmal nachdenken“ im Wissensbuch bringt dich trotzdem genau zu ihr; ist sie nur wieder dran, beginnt sie leer, damit nicht gleich die Lösung dasteht. Nach der letzten Frage steht „Geschafft! Mehr Profi-Fragen hat diese Karte nicht.“ und ein Knopf „Weiter zu: …“ zur passenden Nachbarkarte (in Lernrouten nur der Satz, dort geht es mit der nächsten Station weiter). „Zurück“ führt wieder zu „Rate mal!“.
- **Zwei Fehler behoben:** Nach einem Stufenwechsel kommt sofort eine Frage der neuen Stufe, nicht die alte. „Zu schwer? Zurück zu Entdecker“ steht nur noch dort, wo es etwas ändert.
- **Falsch sieht falsch aus:** Am Handy sah eine falsch angetippte Antwort grünlich aus, fast wie eine richtige. Jetzt bleibt sie orange, auf der Karte und in den Spielen. Im Wissensbuch ist die gewählte Antwort einer Denkfrage jetzt auch am Handy markiert.
- **Elefant:** Eine Profi-Frage verriet die Experten-Frage; sie ruht jetzt. Neu ist eine Frage zu den Stoßzähnen. Ein paar Sätze sind genauer (geprüft von Sprache, Fakten und Stufen).
- Je Fehler ein Test; eine neue Liste schützt die gespeicherten Antworten.
- **Arbeitsweise:** Zwei neue Regeln (Wunsch des Nutzers). Bevor Claude eine Änderung am Verhalten empfiehlt, prüft es alle Wege dorthin (Wissensbuch, Lernrouten, Zurück, Neuladen). Und jeder PR bekommt drei Messwerte, damit sich zeigt, ob wir schneller werden und weniger spät finden.
- **Messwerte:** Funde vor dem PR: 10 (Helfer; dazu die geprüften Elefanten-Entwürfe) · späte Funde: 0 · Dauer: rund 3 Stunden (08:58 UTC bis zum Merge gegen 11:45 UTC). Dazu 4 Funde nach dem PR, aber vor dem Merge (3 vom `code-pruefer`, 1 von Claude); Einzelheiten in den [Entscheidungen](docs/entwurf/2026-11-24-stufen-feinschliff-entscheidungen.md).

## 24.11.2026 – Teil A ist auf der Testseite; Prüfungen verlässlicher

Teil A „Eine Stufe für alles“ ist seit 24.11.2026 auf der Testseite (PR #107). Für Kinder ändert sich danach nichts Sichtbares. Die Prüfungen fallen seltener grundlos aus und finden Zeitfehler früher.

- **Browser schneller geladen:** Die Prüfung auf GitHub holt die Pakete für die Test-Browser zuerst von der offiziellen Ubuntu-Quelle. Ein langsamer Spiegel hatte sie bis knapp an ihre Zeitgrenze von 20 Minuten gebracht.
- **Stresslauf:** Ein Schalter bremst im Test jedes Bild der Seite. So zeigen sich Fehler, bei denen etwas erst einen Augenblick später erscheint, schon vor dem PR. Er gehört jetzt zu `/pruefen`.
- **Aufgeräumt:** Der veraltete Größenvergleich im Build ist weg; die festen Größengrenzen gelten weiter.
- **Arbeitsregel genauer:** Wer Karten ändert, prüft danach auch alle Karten offline, und betroffene Tests werden auch über ihren Auslöser gesucht.
- **Zwei Testfehler, die nur manchmal kamen, behoben:** In Safari (WebKit) war im Test einmal das Suchfeld leer, als beim Tippen die Kapiteltexte kamen; ein eigener Test prüft jetzt genau diesen Moment mit echtem Tippen. In Firefox war der Rauchtest rot, wenn die Startseite zufällig das Riff-Foto zeigte; jetzt wartet er, bis die Startseite fertig ist. Auf der Seite selbst war beides kein Fehler.
- **Neuer Helfer „Spieltester“ (Pilot):** Er benutzt die Seite im echten Browser in einer Rolle, z. B. „6 Jahre, mit einem Elternteil, am Handy“, und meldet, wo man hängen bleibt. Kein Kindertest. Sein erster Lauf an den Stufen fand zwei Fehler (nach einem Stufenwechsel bleibt manchmal die alte Frage stehen; „Zu schwer?“ steht auch dort, wo man schon Entdecker spielt). Sie stehen im BACKLOG und sind noch nicht behoben.

## 23.11.2026 – Teil A „Eine Stufe für alles“: drei Stufen, leichter Satz oben

Kinder wählen jetzt eine Stufe: Entdecker, Profi oder Experte. Die Karten zeigen Fragen passend zur Stufe.

- **Eine Stufe für alles:** Die Stufe steht im Entdeckerpass und gilt für Karten und Quiz (Spiele, Labore und Reisen folgen). Gewählt wird oben bei „Rate mal!“ oder im Pass. Wer drei Fragen hintereinander gleich richtig hat, bekommt eine schwerere Stufe vorgeschlagen; wer zweimal danebenliegt, eine leichtere. Nichts wechselt von selbst.
- **Mehr Fragen auf den Karten:** 12 neue Zusatzfragen, dazu die 42 Fragen der Wissens-Challenge auf ihren 13 Karten (drei davon neu), alle mit Tipps und „warum nicht“. Vier alte Fragen ruhen (sie bleiben in den Daten, damit alte Einträge im Pass lesbar bleiben). Profi und Experte haben vier Antworten. Neu sind „Fast richtig“ (Marie Curie: Welches Wort stimmt nicht?) und „Ordne richtig“ (Steinwerkzeuge, ab Experte). Alle Inhalte sind geprüft (Entwurf, Sprache, Fakten, Endprüfung).
- **Gleiche Wörter überall:** „Richtig!“, „Noch nicht ganz. Versuch es noch einmal!“ und „Tipp“ heißen jetzt überall gleich. „Noch einmal raten“ zählt nicht doppelt.
- **Erst ein leichter Satz:** Auf Karten ohne Häppchen steht „Ganz einfach“ jetzt offen oben, die langen Absätze stehen unter „Für Große“. 67 Karten haben dafür neue Sätze bekommen, 24 Tierkarten eine neue Einleitung. Bei Personen bleibt der Satz oben in „Ausprobieren“, weil er dort den Versuch anleitet.
- **Nichts geht verloren:** Alte Antworten im Pass bleiben lesbar, auch wenn eine Frage neue Antworten bekam; angefangene Runden der Wissens-Challenge laufen mit ihrer alten Frage weiter. Eine feste Liste aller gespeicherten Antworten wacht darüber.
- **Vorschläge fair, Tastatur besser** (nach der Code-Prüfung): Vorschläge zählen nur Fragen der gewählten Stufe. Nach einem Stufenwechsel und bei „Ordne richtig“ bleibt der Fokus an seinem Platz, der neue Platz wird angesagt. Alte Challenge-Runden mit der früheren Frage zeigen keine unpassenden Tipps. Eine zweite Liste schützt auch die neuen Antworten. Seit 24.11.2026 springt der Fokus nach einem Stufenwechsel auch nicht mehr kurz weg: Er steht sofort wieder auf „Ändern“, im Pass wie auf der Karte (Fund der CI in Safari/WebKit).
- **Klarer zu sehen** (nach der Design-Prüfung, 24.11.2026): Die offene Stufenwahl steht in einem eigenen Kasten mit der Frage „Welche Stufe willst du spielen?“ und sieht nicht mehr aus wie Antworten. Der Vorschlag für eine andere Stufe steht direkt nach der Erklärung, vor „Noch eine Frage“. „Prüfen“ bei „Ordne richtig“ ist größer. Offene Punkte zu Texten stehen im BACKLOG.
- **Neuer Helfer** `karten-autor`: schreibt Entwürfe für Karteninhalte; geprüft wird unabhängig.
- **Alte PRs aufgeräumt:** PR #95 und #27 sind durchgesehen und geschlossen. Brauchbares (Aufträge, „Ganz einfach“-Vorlagen, Funde) ist übernommen ([Durchsicht](docs/entwurf/2026-11-23-pr-95-27-durchsicht.md)).

## 23.11.2026 – Teilschritt 3 beginnt: schnellere Prüfungen, aufgeräumt, Entwurf „Kniffliger spielen“

Für Kinder ändert sich fast nichts Sichtbares. Fehler fallen jetzt früher auf, und die große Prüfung ist schneller.

- **Ein doppelter Satz weniger:** Bei 21 Karten aus Natur und Wissenschaft stand „Schon gewusst?“ wörtlich wie „Ganz einfach“. Der doppelte Satz ist weg. Neue Überraschungen mit Quelle kommen mit der Wissenschaftswelt.
- **Firefox und Safari früher prüfen:** Jeder PR prüft die wichtigsten Abläufe jetzt auch in Firefox und WebKit (Safari), nicht erst die große Prüfung am Phasenende. Das Sonnensystem mit seinen Beschriftungen ist dazugekommen.
- **Große Prüfung in Gruppen:** Statt drei langer Läufe (der längste rund 102 Minuten) laufen jetzt sieben kürzere gleichzeitig. Jeder Lauf schreibt auf, wie lange jeder Teil braucht. Mit den ersten Zeiten hat Firefox eine zweite Gruppe bekommen (vorher 55 Minuten in einer).
- **Gemeinsame Test-Bausteine:** Alle Browser-Tests beantworten Fragen und lesen „Ganz einfach“ über denselben Baustein. Ein Wächter verbietet eigene Wege dafür. Ein neuer Datentest prüft alle Karten in Sekunden darauf, dass „Ganz einfach“ nicht doppelt dasteht. Er fand 24 Tierkarten, die mit „Kniffliger spielen“ neu geschrieben werden.
- **Aufgeräumt:** 61 alte Dateien und 14 Pakete, die die Seite nicht mehr braucht, sind weg, darunter zwei mit bekannten Sicherheitslücken (eines davon bringt ein Lint-Baustein noch mit, ohne gemeldete Lücke). Die Lücken waren für Besucher nicht erreichbar. Die Lint-Regeln kommen jetzt direkt aus ihren Bausteinen statt aus einem Next-Paket; dabei prüft der Lint erstmals auch unsere Vite-Plugins in `build/`.
- **Zwei Firefox-Funde:** Firefox lädt ein Foto manchmal ein zweites Mal, weil React die Bildadresse nach dem Einfügen noch einmal setzt. Und nach dem Neuladen zeigt Firefox ein schon geladenes Foto aus seinem Speicher und bricht die Nachfrage dazu selbst ab. Beide Male erscheint das Bild; Kinder merken nichts. Die Tests hielten das für Fehler. Jetzt erkennen sie genau diese zwei Fälle und melden jeden anderen abgebrochenen Download weiter.
- **Entwurf „Kniffliger spielen“** ([Entwurf und Plan](docs/entwurf/2026-11-23-phase-1-teilschritt-3.md), [Entscheidungen zum Arbeitssystem](docs/entwurf/2026-11-23-teilschritt-3-arbeitssystem-entscheidungen.md)): drei Stufen (Entdecker, Profi, Experte), schwerere Fragen ohne Ratemuster, Labore mit echten Aufgaben. Gebaut wird nach der Freigabe.

## 23.11.2026 – Arbeitsweise: Helfer laufen, nichts geht verloren, zwei WebKit-Fehler behoben

Für Kinder ändert sich nichts Sichtbares. Wir arbeiten sauberer und schneller.

- **Alle Helfer laufen:** `/weiter` prüft beim Start, ob jeder Helfer da ist. Fehlt einer, wird er von Hand eingesetzt, und der Nutzer erfährt es. Nach jedem Fehler, der erst spät auffällt, prüft der Technik-Prüfer, wie man ihn früher findet.
- **Nichts geht verloren:** Wünsche, Regeln und Ideen kommen gleich ins Repository. Vor einem neuen Chat ist alles hochgeladen, und die Entscheidungen stehen in einer Liste ([Teilschritt 2](docs/entwurf/2026-11-23-phase-1-teilschritt-2-entscheidungen.md)).
- **Aufräumen gilt auch fürs Arbeiten:** Tests, Werkzeuge und Unterlagen, die bremsen, werden einfacher oder fallen weg.
- **Technik-Prüfung festgehalten** ([Bericht](docs/entwurf/2026-11-23-technik-pruefung.md)): Die große Prüfung in der CI soll von rund 102 auf rund 35 bis 38 Minuten schrumpfen. Das kommt als Erstes in Teilschritt 3.
- **Zwei alte WebKit-Fehler behoben** (Safari auf iPhone und iPad): Ohne Netz fragt die Seite nicht mehr unnötig nach einer neuen Version, und der Sicherungs-Test findet seine Teststimme auch in WebKit. Seitdem prüft jeder PR Pass und Offline zusätzlich in WebKit (`pnpm run test:browser:webkit`, etwa zwei Minuten mehr).

## 23.11.2026 – Teilschritt 2, Teil B: Karten, die zusammenpassen

Jede Karte hat jetzt einen echten Nachbarn. Zwölf Karten sind schon ganz im neuen Stil, mit kleinen Häppchen und mehr zum Knobeln.

- **Jede Karte hat einen Nachbarn:** 30 neue Verbindungen für die 35 Karten, die noch keine hatten. Unter „Dazu passt“ steht immer, warum zwei Karten zusammengehören. Alle 226 Sätze wurden für Kinder durchgesehen und auf Tatsachen geprüft. Fünf schwache Verbindungen stehen zum Ersetzen im BACKLOG.
- **Karten aufgeräumt:** Was im Steckbrief steht, kommt nicht noch einmal im Text. „Schon gewusst?“ verrät nur noch Neues. Fragen sagen nicht mehr „wie im Text steht“. Viele Sätze für Erwachsene sind aus dem Kinderteil verschwunden. Bei den Karten über Krieg, Völkermord und Anschläge steht bewusst keine Überraschungs-Tatsache mehr.
- **Zwölf Karten im neuen Stil** (Elefant, Eisbär, Krake, Steinwerkzeuge, Apollo 11, Marie Curie, Jane Goodall, Pyramiden von Gizeh, Eiffelturm, Wasserkreislauf, Mondphasen, Fahrrad): „Kurz erklärt“ besteht aus kleinen Häppchen mit je einer Frage als Überschrift. Bei „Stimmt das?“ entscheidet man, ob ein Satz stimmt. Nach einer richtigen Antwort gibt es „Noch eine Frage“. Der längere Text steht unter „Für Große“.
- **Alte Antworten bleiben:** Wurde eine Frage neu geschrieben, bleibt die gespeicherte Antwort gewählt und richtig. Gibt es eine Antwort gar nicht mehr, sagt die Karte: „Hier gibt es neue Antworten. Früher hast du … gewählt.“ Pass-Einträge gehen nicht verloren.
- **Weiterdenken, wo man war:** Wer auf einer Karte mit mehreren Fragen falsch geraten hat und später zurückkommt (aus dem Wissensbuch, von einer Nachbarkarte oder nach dem Neuladen), bekommt wieder dieselbe Frage und keine neue.
- **Besser lesbar:** Getippte Antworten bleiben gut lesbar und werden nicht blass. Zeichnungen in „Dazu passt“ sind kompakt. Die Mondzeichnung oben auf der Karte ist am Handy kleiner. „Noch einmal raten“ hat jetzt die richtige Schriftgröße. Bei Marie Curie, Jane Goodall und dem Fahrrad steht „Ganz einfach“ jetzt oben in „Ausprobieren“.
- **„Was ist neu?“** hat einen neuen Eintrag.
- **Geprüft:** ganze Prüfkette, die große Prüfung in Chromium (alle 32 Teile grün; fünf davon nach Korrekturen noch einmal einzeln, nach der letzten Korrektur auch `core` und `offline-resilience`). Alle neuen Sätze von der Kinder-Redaktion und auf Tatsachen geprüft, die zwölf Pilot-Karten zweimal auf Bildern in fünf Breiten, dazu eine Code-Prüfung und eine Schlussprüfung durch einen frischen Prüfer auf dem stärksten Modell. Was dort gefunden und nicht gleich behoben wurde, steht mit Grund im BACKLOG (Punkt 23). Firefox und WebKit prüft die Vollprüfung in der CI.

## 22.11.2026 – Teilschritt 2, Teil A: Die neue Wissenskarte

Jede Wissenskarte ist neu gebaut: erst raten, dann kurz lesen, dann selbst ausprobieren. Die alte Karte ist weg. Ihre Links, Antworten und Pass-Einträge bleiben.

- **Oben auf der Karte:** großes Bild mit Bildnachweis, der Titel und gleich eine Frage: „Rate mal!“. Wer falsch rät, bekommt einen Hinweis und kann „Noch einmal raten“.
- **Kurz erklärt und Steckbrief:** ein paar kurze Sätze und die wichtigsten Zahlen auf einen Blick. Was nur Eltern brauchen (Lernziel, Quellen, Datum der Prüfung), steht zugeklappt unter „Für Erwachsene: Quellen und Lernziele“.
- **Ausprobieren:** Messen, Modelle, Zeichnungen und Belege stehen in einem Bereich, der erst beim Öffnen lädt. So ist die Karte schneller da. Bricht das Netz dabei ab, gibt es „Noch einmal versuchen“, ohne dass die Seite neu lädt.
- **Mehr erfahren:** die längeren Texte, weitere Verbindungen und Orte auf der Karte, freiwillig zum Aufklappen.
- **Dazu passt:** unten auf jeder Karte höchstens drei große Kacheln: eine echte Nachbarkarte mit dem Grund, warum sie passt, der Ort auf dem Globus und eine Reise, ein Labor oder das Spiel der Welt. Nach „Zurück“ steht man wieder bei der Kachel, auch in Safari.
- **Klarer Rückweg:** statt der langen Sprungleiste ein Link „← Zurück“. Wer direkt auf eine Karte kam, bekommt einen Link zu ihrer Welt, zum Beispiel „← Die Tierwelt“.
- **Lernreisen einfach zuerst:** Jedes Kapitel beginnt mit ein paar kurzen Sätzen, einer Tatsache und einem Beobachtungsauftrag. Der lange Text steht unter „Für Große“, der Satz für Eltern unter „Für Erwachsene“. „Kapitel vorlesen“ liest, was offen steht.
- **Am Handy:** lange Wörter (etwa bei Grace Hopper) schieben die Seite nicht mehr zur Seite. Beschriftungen in Zeichnungen sind am kleinen Handy mindestens 16 Pixel groß. Vier Erfindungs-Zeichnungen haben noch winzige Schrift; das steht im BACKLOG.
- **Leichter zu bedienen:** Jeder Bereich zum Aufklappen hat rechts einen Pfeil, der sich beim Öffnen dreht. „Größere Schrift“ im Entdeckerpass macht die Frage und die ersten Sätze jetzt wirklich größer. Knöpfe und Aufklapper sind mindestens 48 Pixel hoch, die Buchstaben A, B, C bei den Antworten größer und dunkler.
- **„Was ist neu?“** hat zwei neue Einträge.
- **Hinter den Kulissen:** Die Tempo-Prüfung läuft jetzt in jeder Prüfung mit. Tests warten vor einem Seitenwechsel kurz, bis die Bilder geladen sind. Ein neuer Helfer prüft technische Themen. Die Startdateien sind nicht größer geworden.
- **Geprüft:** ganze Prüfkette, die große Prüfung in Chromium (alle 31 Teile grün), Karte und Lernreise auch in Firefox und WebKit. Eine Schlussprüfung des ganzen Umbaus (mit einem anderen Modell als geplant, darum eine Teilprüfung) und eine Prüfung der Gestaltung auf Bildern; was dort gefunden und nicht gleich behoben wurde, steht im BACKLOG (Punkt 20).
- **Entdeckerpass repariert:** Wer sehr viel entdeckt hatte (mehr als 256 Karten, Spiele, Reisen und Labore), verlor beim Laden die zuletzt angefangenen Spielstände. Den Fehler gab es schon vorher. Jetzt bleiben alle erhalten, auch beim Sichern, Wiederherstellen und Neuladen.

## 21.11.2026 – Teilschritt 2, Schritt 0: Prüfungen in drei Browsern repariert

Für Kinder ändert sich fast nichts. Es geht vor allem um die Prüfungen vor dem Umbau der Wissenskarte.

- **Drei neue Fehler der großen Prüfung geklärt:** Keiner lag an der Seite selbst. Ein Chromium-Test wechselte die Seite, während noch Bilder luden; er wartet jetzt. Ein Firefox-Test stürzte wegen eines Fehlers im Testwerkzeug Playwright ab; er umgeht ihn. In WebKit (Safari) sprang ein Buch-Test so schnell zwischen Seiten hin und her, dass Safari weitere Sprünge sperrte. Ein Kind kommt nie so schnell. Der Test bremst jetzt in Safari, und die Sperre zählt künftig als Fehler.
- **Alter Safari-Fehler mitbehoben:** `engine-journeys` scheiterte in WebKit schon vor Teilschritt 1, aus demselben Grund.
- **Wissensbuch am Handy:** Beim Drehen des Handys meldete Safari einen Fehler in der Leiste oben im Buch, am Rechner Chrome beim Ziehen des Fensters. Die Leiste misst jetzt ihren Rahmen statt sich selbst und rückt den gewählten Bereich danach wieder ganz ins Bild. Neue Tests drehen das Handy hin und her und ziehen das Fenster schmal und breit.
- **Startfrage am kleinen Handy:** Mit großer Schrift ragte eine Startfrage mit langem Wort („Radioaufzeichnung“) am kleinen Handy ein paar Pixel über den Rand, und die Seite ließ sich seitlich schieben. Die große Schrift ist dort jetzt etwas kleiner (31 statt 34 Pixel, normal sind 27). Ist ein Wort doch einmal zu lang, bricht es um, statt die Seite zu verschieben. Ein Test prüft jetzt alle 56 Startfragen, nicht nur die, die der Zufall gerade zeigt.
- **Drei weitere Testfehler in Chrome:** Drei Tests luden die Seite neu, während noch Bilder oder Programmteile nachluden. Der langsame Prüfrechner brach sie ab, und das zählte als Fehler. Die Tests warten jetzt vorher. Scheitert so ein Test künftig, nennt er den genauen Fehler.
- **Vorbereitung:** Größe der Startdateien gemessen (Obergrenze für den Umbau). Für die 58 Karten von Zeitreise und Erfindungen gibt es eine Liste freier Bildkandidaten mit Lizenz und Urheber; eingebaut wird später.

## 21.11.2026 – Phase 1, Teilschritt 1 „Aussehen und Hülle“

Die Seite bekommt ihre neue Grundlage. Startseite, Wissenskarte und Weltenseiten werden in den nächsten Teilschritten neu gebaut; hier bekommen sie nur Schrift, Farben und nötige Korrekturen.

- **Neue Schrift und Farben:** Nunito (rund, gut lesbar, freie Lizenz, offline dabei), helle Flächen mit Orange und Petrol. Auch Buchstaben wie in „Białowieża“ kommen jetzt aus einer Schrift.
- **Eine Leiste für alles:** Start, Welten, Spielen, Labor, Reisen, Buch. Am Handy steht sie unten, ab dem Tablet oben. Früher schnitt die Leiste am Handy Wörter ab.
- **Ruhiger Kopf:** nur noch Name, Suche und Entdeckerpass. Der Punkte-Zähler am Pass-Knopf ist weg.
- **Neuer Fuß:** „Was ist neu?“, „Für Eltern“ und der Kasten für das Offline-Lernen.
- **„Was ist neu?“ für Kinder:** kurze Einträge mit Symbol, neueste oben. Die alte Chronik steht in Kindersprache unter „Früher“ (Texte von Kinder-Redaktion und Faktenprüfer geprüft).
- **Kein großer Rahmen mehr** nach einem Seitenwechsel. Wer mit der Tastatur arbeitet, sieht den Fokus weiter deutlich.
- **Kleine Korrekturen aus der Design-Prüfung:** Das Suchfeld bleibt bei großer Schrift am kleinen Handy ganz sichtbar. Beispieltexte in Suchfeldern passen in die Felder. „So geht’s“ steht auf der Startseite in jeder Breite. Weitere Befunde stehen mit Grund im BACKLOG (Punkt 15).
- **Korrekturen aus der Schlussprüfung:** Auf dem iPhone bleibt die Lesestelle erhalten, wenn ein Kind unten in der Leiste oder im Fuß tippt und dann „Zurück“ geht (vorher sprang die Seite nach oben). Auf „Was ist neu?“ werden Wörter nicht mehr mitten durchgeschnitten, auch nicht bei großer Schrift. Beim Öffnen eines Bereichs springt die Seite nicht mehr: Vorher stand der Fuß kurz mitten im Bild und wurde dann weggeschoben. Kleinere Befunde stehen im BACKLOG (Punkt 16).
- **Hinter den Kulissen:** Tests öffnen Bereiche über einen eigenen Helfer statt über die alte Leiste. Viele alte Stilregeln sind gelöscht; die Startdateien sind kleiner als vorher. Zeichnungen behalten vorerst ihre bisherige Schrift, damit keine Beschriftung aus dem Bild rutscht.
- **Geprüft in drei Browsern:** Die Vollprüfung in der CI lief zum ersten Mal auch in Firefox und WebKit (Safari). Dabei fiel auf: Kam man aus einer Karte ins Wissensbuch zurück, sprang am Handy die Leiste oben im Buch einmal um, und Safari meldete das als Fehler. Das ist behoben. Ein Firefox-Test lud die Seite neu, während noch ein Bild lud; er wartet jetzt. Drei WebKit-Fehler gab es schon vorher; sie stehen im BACKLOG und kommen vor der nächsten Veröffentlichung für Freunde dran.
- **Werkzeug:** Das Browser-Testwerkzeug Playwright ist auf 1.65.1 (neueste Version, mindestens 7 Tage alt) und bleibt künftig immer aktuell. Chromium, Firefox und WebKit laufen jetzt auch im Arbeits-Container.

## 21.11.2026 – Alter Katalog „WunderKompass 2027“ eingeordnet

An der Seite selbst ändert sich nichts. Es geht um die Pläne.

- **Geprüft:** der Anforderungskatalog aus der ChatGPT-Zeit (jetzt in `docs/archiv/`). Die Einordnung mit Gründen steht in `docs/entwurf/2026-11-21-katalog-2027-einordnung.md`.
- **Übernommen:** einheitliches Design mit Tastaturbedienung, Mitmachen mit echtem Lernnutzen, Verknüpfung und Rückwege, hohe Qualität mit echtem Ansehen statt nur Tests.
- **Kein Bestandsschutz** (Wunsch des Nutzers): Was nicht gut ist, wird geändert oder gestrichen, auch wenn es es schon gibt. Erhalten bleiben nur der Fortschritt der Kinder im Pass und ihre Links.
- **Angepasst:** Inhalte kurz zuerst, mit drei Tiefen bis „Für Große“. 3D nur, wo es etwas erklärt, immer mit 2D-Fassung. Der Globus wird in Phase 4 das Herzstück. Neue Themen wie Körper, Geld oder Religionen ziehen Welt für Welt ein, mit Sorgfaltsregeln.
- **Nicht übernommen:** Spline (Logo im kostenlosen Plan), die alte Paket-Reihenfolge, Nachweis-Dateien, Inhalte von einer KI, Tagespolitik.
- **Audit V2 nachgeprüft:** 18 von 19 alten Befunden sind behoben. Offen sind vor allem rohe Sprachkürzel in Länderansichten (BACKLOG).

## 21.11.2026 – Neuausrichtung, Schritt 0 „Großputz & Arbeitsweise“

Claude entwickelt WunderKompass ab jetzt weiter. Für Kinder sieht die Seite noch genauso aus wie vorher.

- **Weniger Ballast:** Prüfberichte, Vergleichsdateien, Release-Sperren und alte Datenbank- und Sites-Reste sind entfernt. Das Repository ist deutlich kleiner: 1021 statt 1284 Dateien, 42,2 statt 73,9 MB.
- **Schnellere Prüfung:** Ein Befehl (`pnpm run check`) prüft Typen, Code, Unit-Tests, Build und die wichtigsten Browserwege. Die große Prüfung in drei Browsern läuft am Ende einer Phase.
- **Was weiter geschützt ist:** Entdeckerpass und gespeicherte Antworten; die IDs von Karten, Kapiteln, Spielen, Laboren, Missionen und Reisen, die meisten Fragen-IDs und alte Links (Orts-IDs und zwei Fragenbanken kommen noch dazu, siehe BACKLOG); Bilder mit Nachweis; Offline-Betrieb.
- **Einmal „Neue Version laden“:** Wer die Seite offline vorbereitet hat, sieht einmal den Knopf „Neue Version laden“. Pass und Favoriten bleiben dabei erhalten (im Test geprüft).
- **Geprüft (Chromium):** `pnpm run check` grün, große Prüfung 28 von 28 Suiten grün. Der neue Build gleicht dem alten bis auf die Versionskennung. Firefox und WebKit prüft die CI vor der nächsten Veröffentlichung für Freunde.
- **Neue kurze Unterlagen:** `CLAUDE.md`, `STATUS.md`, `VISION.md`, `BACKLOG.md`. Die Originalaufträge liegen in `docs/archiv/`.
- **Helfer:** sechs Prüf-Helfer für Kindertexte, Fakten, Design, Code, Bildrechte und Ideen; Kurzbefehle `/weiter` und `/pruefen`.
