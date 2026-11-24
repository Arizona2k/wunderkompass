# Design-Prüfung Teil B, PR 2 (Vorschau, Stand b63ad2f)

Helfer: `design-pruefer` (sonnet / high), 24.11.2026. Bericht unverändert; Bewertung durch Claude folgt unten als Nachtrag. Die Bildpfade im Scratchpad gehen beim Chatwechsel verloren.

Geprüft in Chromium, direkt auf der Vorschau-Adresse. Breiten 320x700, 390x780, 768x1024, 1280x900 und 1440x900. Bis 768 px mit Touch.

Alle Bilder liegen in `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/dp/`. Namensschema: `<Breite>-<Nr>-<Spiel>-<Zustand>.png`.
- Nr 1 Übersicht, 2 offen, 3 falsch, 4 richtig, 5 nach „Nächste Aufgabe“.
- Nr 6 Stufenwahl, 7 Stufen-Vorschlag, 8 Fokus, 9 Kachel, 10 Startseite mit Vorschaubild, 11 „Was ist neu?“.
- Spielkürzel: `kq` ist Kreuz und quer, `stimmt` ist Stimmt das wirklich?, `wer` ist Wer lebt wo?.
- Zusammengesetzte Bilder zum schnellen Ansehen: `m320-a.png`, `m320-b.png`, `m390-a.png`, `m390-b.png`, `m390-stufe.png`.

Die Messwerte stammen aus `main.log` im Scratchpad-Ordner `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/`.

### 1. Gesamteindruck je Breite
- **320 px:** Kein waagerechtes Scrollen, alle Tippflächen mindestens 44 px. „Kreuz und quer“ öffnet sauber oben. „Stimmt das wirklich?“ und „Wer lebt wo?“ öffnen mit abgeschnittenem Kopf (Befund 1).
- **390 px:** Wie 320 px. „Nächste Aufgabe“ ist nach richtiger Antwort immer sichtbar, bei „Wer lebt wo?“ aber bündig an der unteren Leiste.
- **768 px:** Ruhig und lesbar. Das Vorschaubild auf der Startseite ist hier riesig (722x767 px) und unscharf (Befund 3).
- **1280 px:** Gut, aber das Brett von „Kreuz und quer“ ist 1000 px breit, das der anderen beiden 880 px. Der Kopf von „Stimmt“ und „Wer“ ist weggescrollt (Befund 1).
- **1440 px:** Wie 1280 px.

### 2. Befunde

#### Blockierend
Keine.

#### Wichtig (vor dem PR klären)

**1. „Stimmt das wirklich?“ und „Wer lebt wo?“ öffnen nicht oben.**
- Bilder: `320-2-stimmt-offen.png`, `320-2-wer-offen.png`, `390-2-wer-offen.png`, `768-2-stimmt-offen.png`, `1280-2-wer-offen.png`.
- Gemessen: scrollY ist 194 bis 247 px. Der Titel steht bei y=-134 bis -64, also weg. Bei 320 und 390 px ist die Stufenzeile bei y=-16 halb abgeschnitten. Bei 768 und 1280 px sitzt sie 1 px am oberen Rand.
- Nur „Kreuz und quer“ öffnet richtig (H1 bei y=12 bis 21).
- Aufgetreten bei allen fünf Breiten, mit Tippen, Klick und Enter. Der Weg war: neu laden, Spielen, Kachel antippen.
- Der Fokus bleibt nach dem Öffnen auf `BODY`. Das Scrollen scheint also nicht zurückgesetzt zu werden. Das ist eine Vermutung, ich habe nicht im Code gesucht.
- Nach „Nächste Aufgabe“ ist alles in Ordnung: Stufenzeile bei y=12, „Aufgabe x von y“ und die ganze Frage sichtbar, in allen Breiten und Spielen (z. B. `390-5-wer-naechste.png`).
- Vorschlag: Beim Öffnen jedes Spiels auf die Position scrollen, auf der „Kreuz und quer“ landet (Titel y≈12 bei 390 px).

**2. „Kreuz und quer“ sieht anders aus als „Stimmt das wirklich?“ und „Wer lebt wo?“.**
- Bilder: `m390-a.png` (links gegen rechts), `1280-2-kq-offen.png` gegen `1280-2-wer-offen.png`.
- Fortschrittsbalken: In „Kreuz und quer“ ist es ein ungestylter, grauer Balken (`<progress>`, 11 px, Browser-Standard). In den beiden anderen ist er schmal, hellblau (8 px) mit grüner Füllung. Das Welt-Quiz und der Foto-Forscher haben nochmal eigene Balken. Der graue Balken wirkt wie „gesperrt“ und ist das auffälligste Element der Seite.
- Tipp: In „Kreuz und quer“ ein großer oranger Block ohne ▸, der wie ein Hinweistext aussieht. In den anderen eine weiße, einklappbare Zeile mit ▸. Dort ist nicht erkennbar, dass man tippen kann.
- Fragetext: 23 px gegenüber 26 px. „Thema: …“ hat nur 13 px, also unter 16 px.
- Brettbreite am Rechner: 1000 px gegenüber 880 px.
- Knopfbeschriftung oben: „Neue Runde“ gegenüber „Neu mischen“.
- Auf der richtigen Antwort fehlt in „Kreuz und quer“ das „Passt“ der anderen beiden.
- Vorschlag: In „Kreuz und quer“ dieselben Bausteine wie in den anderen beiden Spielen nutzen (Fortschrittsbalken, Tipp-Zeile, Fragengröße, Breite 880 px, Knopfname).

**3. Vorschaubild „Kreuz und quer“ (Startseite, „Heute ausprobieren“, nach Wahl von „Biene & Blüte“).**
- Bilder: `768-10-start-vorschau-box.png`, `390-10-start-vorschau.png`, `1280-10-start-vorschau.png`, Datei `public/previews/kreuz-und-quer.png`.
- Es ist ein unveränderter Bildschirmfoto-Ausschnitt (564x599 px) ohne Rahmen, Rand oder Schatten und mit demselben Hintergrund wie die Seite. Er sieht aus wie ein echtes, bedienbares Spiel. „Ändern“, der Tipp und die Antworten sehen antippbar aus, tun aber nichts.
- Die Beschriftung „Bildschirmfoto: So sieht eine Aufgabe im Spiel aus.“ steht erst unter dem Bild. Auch auf dem Bild ist der graue Balken aus Befund 2 zu sehen.
- Größe: bei 768 px wird das Bild auf 722x767 px aufgezogen (Faktor 1,28, unscharf) und schiebt den Knopf „Kreuz und quer öffnen“ weit nach unten. Bei 1280 px sind es 478 px Breite (in Ordnung), bei 320 px 292 px (verkleinert).
- Zu den anderen Vorschauen (`ResearchPreview`, Lernreise-Folge: Zeichnungen auf Karten) passt es weder in Stil noch in Größe.
- Vorschläge:
  - Rahmen, Rundung und leichten Schatten geben.
  - Die Breite begrenzen (z. B. 420 px).
  - `aria-hidden` bzw. `pointer-events` setzen.
  - Ein Bild nehmen, das die Spielwelt zeigt (z. B. nur Frage und Antworten, ohne Stufenzeile).
  - Den Balken im Spiel neu stylen (Befund 2) und das Bild danach neu aufnehmen.
- Die Kachel „Kreuz und quer“ in der Spiele-Übersicht hat kein Bild und passt zu den Nachbarkacheln (`390-9-kachel-kq.png`).

#### Feinschliff
- **Rückmeldung nach falscher Antwort** liegt auf dem Handy unter der unteren Leiste (z. B. `390-3-kq-falsch.png`, Rückmeldung y=761 bis 882, Leiste ab 716). Der Stufen-Vorschlag steht auf 390 px bei y=915 bis 1146 (`390-7-stimmt-vorschlag.png`) und wird erst nach Scrollen sichtbar. Das ist im BACKLOG; hier nur zur Bestätigung, auch für den Vorschlag.
- **Fokus nach Öffnen eines Spiels:** Er bleibt auf `BODY`. Nach „Alle Spiele“ landet er richtig auf der Kachel. Für Tastaturnutzer wäre der Fokus auf dem Spieltitel besser. Ob ein sichtbarer Rahmen entsteht, hängt davon ab, wie er gesetzt wird (siehe „Was gut ist“).
- **„Nächste Aufgabe“ bei „Wer lebt wo?“ auf 390 px** sitzt bündig an der Leiste (y 668 bis 716, Leiste ab 716). Ein kleiner Abstand darunter wäre besser. Auf 320 px dagegen wird das Bild auf den Knopf zentriert (y=294 bis 342).
- **Fokusrahmen** der Knöpfe unterscheiden sich: 3 px Petrol bei `secondary-button`, 2 px Blau (rgb 37,99,132) bei `kern-knopf`. Beide sind klar sichtbar, aber uneinheitlich.
- **Stufenzeile bei 768 und 1280 px** sitzt nach dem Öffnen von „Stimmt“ und „Wer“ bei y=1 am Fensterrand. Das erledigt sich mit Befund 1.

### 3. Was gut ist (erhalten)
- Stufenzeile, „Aufgabe x von y“, Fragetext, vorlesen, Antwortkarten mit Buchstaben-Chip und die Rückmeldung mit orangem „Nächste Aufgabe“ sind in allen drei Spielen gleich aufgebaut.
- Tippflächen: kein Bedienelement im Spiel unter 44 px (gemessen in allen Zuständen und Breiten). Kein waagerechtes Scrollen, nirgends etwas abgeschnitten.
- Fokus nach Maus oder Finger: Nach Antwort, „Nächste Aufgabe“ und „Alle Spiele“ steht der Fokus auf dem passenden Element (Knopf, Überschrift oder Kachel), aber `:focus-visible` ist falsch und es gibt keinen Rahmen. Kein großer Rahmen um Überschriften oder Blöcke.
- Fokus mit Tab: klarer Rahmen (z. B. `1280-8-tab5.png`).
- Nach „Nächste Aufgabe“ sind Stufenzeile, Aufgabenzähler und die ganze Frage im Bild (bei allen Breiten).
- Stufen-Vorschlag erscheint sauber (zwei Fehler hintereinander auf Profi, „Ja, leichter spielen“ / „Nein, ich bleibe“, je 294x48 px; `390-7-stimmt-vorschlag-mitte.png`).
- „Was ist neu?“: Der Eintrag „Neuer Name, neue Fragen“ steht oben, die Schrift ist 18 px, kein Scrollproblem (`390-11-neu.png`).
- Bei „Bewegung reduzieren“ keine laufenden Animationen und `scroll-behavior: auto`.

### 4. Nicht geprüft
- Tippen auf echten Geräten und Bildschirmleser.
- Firefox und WebKit.
- Kontrast nach WCAG nicht gemessen, nur Sichtprüfung. Auffällig klein ist nur der „Thema:“-Text mit 13 px.
- Stufen-Vorschlag „schwerer“ (drei richtige in Folge): nicht ausgelöst, nur „leichter“ auf Profi. Das Layout ist dasselbe.
- Stufen-Vorschlag und die weiteren Spielzustände nur bei 390 px (Stufe Profi und Experte nur dort angesehen). Die Experten-Stufe in den Spielen habe ich nicht durchgespielt.
- Die Welt-Spiele (z. B. „Wer frisst was?“, Welt-Quiz, Foto-Forscher) habe ich nur per Messwerte verglichen (Fortschrittsbalken, Schriftgrößen), nicht komplett durchgespielt.
- Vorschaubild auf der Startseite: nur sichtbar, wenn die Wissensspur „Biene & Blüte“ gewählt ist. Zufällig angezeigt wird sie nur an manchen Tagen oder Besuchen.
- Der Glanz auf Kacheln beim Zeigen (Gestaltungslinie) wurde nicht gesondert angesehen.

## Nachtrag Claude (Bewertung und Umsetzung)

- **Befund 1 echt, behoben.** Nachgestellt: Ohne „Bewegung reduzieren“ und mit der Karte „Weiter entdecken“ für ein anderes Spiel über den Spielen landete der Titel bei −134 px. Ursache: Die Karte verschwand erst, nachdem das neue Spiel gespeichert hatte, also während die Seite weich zum Spiel rollte; alles rückte um ihre Höhe nach oben. „Kreuz und quer“ war im Bericht nur richtig, weil es als erstes Spiel ohne diese Karte geöffnet wurde; betroffen waren alle Spiele. Die Karte ist jetzt weg, solange im Spielbereich ein Spiel offen ist (`app/earth-explorer.tsx`, wie „Quiz fortsetzen“); in der Übersicht und in anderen Bereichen bleibt sie. Neuer Test in `spiel-auswahl` (CI-Satz) ohne „Bewegung reduzieren“, am alten Stand rot (−134 px), jetzt grün. Der Spieltest `playground` lief mit „Bewegung reduzieren“ und konnte das nicht sehen.
- **Befund 2 teils umgesetzt:** Kreuz und quer hat jetzt denselben Fortschrittsbalken wie die Klassik-Spiele. Der Rest (Tipp-Stil, Fragengröße, Brettbreite, Knopfname, „Passt“, Fokusrahmen, kleine Schrift) ist ein Unterschied zwischen Welt-Spielen und Klassik-Spielen, nicht nur bei Kreuz und quer, und kommt in den Design-Schritt (BACKLOG „Ein Spielbrett für alle Spiele“).
- **Befund 3 teils umgesetzt:** Rahmen, Schatten und Höchstbreite 420 px für das Bildschirmfoto. Neu aufnehmen erst nach dem neuen Spielbrett (BACKLOG).
- **Feinschliff:** Rückmeldung und Stufen-Vorschlag unter dem Bildrand stehen schon im BACKLOG; Abstand von „Nächste Aufgabe“, Fokus nach dem Öffnen und Fokusrahmen sind im BACKLOG-Punkt zum Spielbrett ergänzt.
