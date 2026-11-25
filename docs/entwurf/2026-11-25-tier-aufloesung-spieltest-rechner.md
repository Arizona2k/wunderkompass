# Spieltest Tierspiele, Rolle 10 Jahre, Rechner, Profi (25.11.2026)

> Helferbericht (spieltester, sonnet), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

Kein Kindertest, nur Werkzeugbeobachtung durch den `spieltester`.

## 1. Auftrag
- **Rolle:** 10 Jahre, allein am Rechner, liest gut, mag es knifflig.
- **Ziel:** je eine ganze Profi-Runde in „Wer frisst was?“ und in „Tier & Lebensraum“. Wenn Zeit bleibt: „Wer frisst was?“ auf Experte.
- **Gerät:** Rechner 1280 × 800, Maus und Tastatur, Chromium.
- **Stand:** lokaler Build unter http://127.0.0.1:4200/.
- **Handlungen:** rund 88, gezählt vom Skript. Das ist deutlich über der Richtgröße von 30, weil zwei ganze Runden mit je einer absichtlich falschen Antwort pro Aufgabe nötig waren. Die Zeit lag unter 20 Minuten.
- **Hilfsskripte:** `/home/user/wunderkompass/.qa-output/spieltester/tier/` (`srv.mjs` hält eine Browser-Sitzung offen und nimmt Klick- und Tastenbefehle an).
- **Reihenfolge:** Aufgaben und Antworten werden bei jedem Start neu gemischt.

## 2. Ergebnis in einem Satz
Beide Profi-Runden bis zum Spielende gespielt (8/8 „Wer frisst was?“, 8/8 „Tier & Lebensraum“, jeweils „Eine ganze Runde gelöst!“). In jeder Aufgabe zuerst absichtlich falsch geantwortet. Die Experte-Runde nur angefangen (2 Aufgaben), weil es noch keine Experten-Aufgaben gibt. Keine Sackgasse, keine Browser-Fehler.

## 3. Ablauf
Bilder liegen in `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/spieltest-tier-rechner/`. Die Nummern sind teils doppelt, weil jedes Skript wieder bei 01 beginnt.

1. Spielplatz (`#games`, 31 Angebote). Die Karten „Wer frisst was?“ und „Tier & Lebensraum“ stehen weit unten in der Liste. Die Kacheln sind Knöpfe. Bild `01-spielen.png`.
2. „Wer frisst was?“ öffnet auf Entdecker (5 Aufgaben). „Ändern“ (Name für Bildschirmleser: „Stufe ändern“) → Profi, dann 8 Aufgaben. Bild `01-stufe.png`.
3. Profi-Runde „Wer frisst was?“: 8 Aufgaben, jede erst falsch, dann richtig.
   - Bilder: `02-p1-falsch.png` (falsche Antwort) und `03-p1-richtig.png` (richtige Antwort mit Auflösung).
   - Am Ende „Spielstempel sammeln“ (Enter) → „Eine ganze Runde gelöst!“, Bild `05-frisst-ende.png`.
4. Zurück mit „Alle Spiele“. Der Fokus landet dabei wieder auf der Kachel „Wer frisst was?“, das ist gut. Dann „Tier & Lebensraum“. Die Stufe Profi gilt dort schon (die Stufe wirkt über Spiele hinweg).
5. Profi-Runde „Tier & Lebensraum“: 8 Aufgaben, jede erst falsch, dann richtig. Danach Neuladen der Seite: Der Endstand der Runde bleibt stehen, mit „Neue Runde“ geht es weiter.
6. Zweite Runde „Tier & Lebensraum“ nur mit Tastatur: Tab, Shift+Tab und Enter. Bilder `08-fokus-antwort-A.png`, `09-fokus-nach-falsch.png`, `10-fokus-nach-richtig.png`.
7. „Wer frisst was?“ → Stufe Experte, 2 Aufgaben (Eisvogel, Waschbär). Bild `11-experte-start.png`.

## 4. Befunde

### Blockierend
Keine.

### Wichtig

**1. Ratemuster in „Wer frisst was?“: Die richtige Antwort ist oft die einzige, die kein Einzelfutter nennt.**
- Das wiederholt sich bei Orca, Strauß, Katta und Waschbär:
  - Orca: A Insekten / B Kleine Tiere im Plankton / **C Je nach Gruppe verschiedene Beutetiere** / D Krill
  - Strauß: A Eukalyptusblätter / **B Vor allem Pflanzen, auch kleine Tiere** / C Algen und Zooplankton / D Bambus
  - Katta: **A Früchte, Blätter und auch Insekten** / B Kleine Tiere im Plankton / C Kleine Wassertiere / D Eukalyptusblätter
  - Waschbär (Experte-Anzeige, Profi-Aufgabe): A Bambus / **B Verschiedene tierische und pflanzliche Nahrung** / C Algen und Zooplankton / D Krill
- Die richtige Antwort ist jeweils die längste und enthält Wörter wie „je nach“, „vor allem“, „auch“ oder „verschiedene“. Sie ist die einzige Mischkost unter lauter Einzelfutter. Ein 10-Jähriges kommt hier ohne Tierwissen weiter, nur mit „nimm die lange mit ‚auch‘“.
- Umgekehrt (kein festes Muster): Bei Spinne und Elefant ist „Insekten“ bzw. „Pflanzen“ die kürzeste richtige Antwort, und die längste Antwort ist falsch („Fische, Vögel und auch tote Tiere“).
- Vorschlag: Mischkost-Fallen ergänzen, etwa bei Orca eine falsche Antwort wie „Je nach Jahreszeit verschiedene Früchte“. Bei Allesfressern auch ein langes falsches Gegenstück anbieten.

**2. Die Fallen kommen immer aus demselben kleinen Vorrat.**
- Gesehen in 8 Aufgaben „Wer frisst was?“: „Kleine Tiere im Plankton“ 4×, „Krill“ 3×, „Bambus“ 3×, „Eukalyptusblätter“ 3×, „Vor allem kleine Säugetiere“ 3×, „Algen und Zooplankton“ 2×. Jede dieser Antworten war immer falsch.
- Nach zwei Aufgaben streicht ein 10-Jähriges sie, ohne zu lesen. Das spart Denkarbeit und lässt Profi leichter wirken, als es ist.
- Vorschlag: Fallen näher am Tier wählen (siehe Auftrag „ähnlich, aber sicher falsch“) und den Vorrat größer machen. Dass ein Tier-Name nur zu einem Futter gehört, hilft sonst als Ausschlusstrick.

**3. „Tier & Lebensraum“, Grasfrosch ist per Muster lösbar.**
- A Regenwald / B Savanne / C Wüste / **D Gewässer, Wälder und Gärten**.
- Drei Ein-Wort-Lebensräume stehen gegen eine zusammengesetzte Antwort. Das ist die längste Antwort.
- Ähnlich, aber schwächer: Braunbrustigel, A Hecken, Gärten und Waldränder (29 Zeichen) gegen C Trockene offene Landschaften (27 Zeichen). Erdmännchen, C Trockene offene Landschaften, ist ebenfalls die längste Antwort.
- Dazu passt die Auflösung beim Grasfrosch nicht ganz zur Antwort. Sie sagt „lebt gern auf Wiesen mit hohem Gras … im Teich oder unter Holzstapeln“, die Antwort nennt „Gewässer, Wälder und Gärten“. Wiesen kommen in der Antwort nicht vor.

**4. Mögliche Halb-Richtig-Falle: Savannenelefant.**
- Antworten: A Nektar und Pollen / **B Pflanzen** / C Algen und Zooplankton / D **Eukalyptusblätter**.
- Eukalyptusblätter sind Pflanzen. Ein 10-Jähriges kann „Elefant frisst Blätter“ denken und D wählen. Die Rückmeldung sagt dann „passt zu einem anderen Tier: Koala“, das ist inhaltlich in Ordnung. Aber die Frage ist wegen der Enthaltungs-Beziehung („Pflanzen“ enthält „Eukalyptusblätter“) nicht eindeutig.
- Vorschlag: eine Falle nehmen, die keine Pflanze ist.

### Feinschliff

**5. Die Denkfrage ist immer derselbe Satz und passt nicht zur Frage.**
- „Wer frisst was?“: „Wie groß ist dieses Tier, und wo lebt es?“ (Biber, Orca, Spinne, Igel u. a.). Sie passt zur Futterfrage nur halb. „Wo lebt es?“ hilft, „Wie groß?“ kaum.
- „Tier & Lebensraum“: „Wo findet dieses Tier Futter und Schutz?“ ist immer gleich, aber sinnvoll.
- Die Rückmeldung nennt gut, welches andere Tier gemeint war („Deine Antwort passt zu einem anderen Tier: Kaiserpinguin …“). Das ist die eigentliche Hilfe.
- Vorschlag: bei „Wer frisst was?“ eine Futter-Denkfrage („Wie kommt das Tier an seine Nahrung?“ oder „Welche Zähne oder Schnabel hat es?“).

**6. Auflösungen: lehrreich bis nebensächlich.** Vollständig gelesen (alle 16 Profi-Aufgaben).
- **Stark** (erklären Wie und Warum):
  - Schnabeltier: Backentaschen, harte Platten statt Zähne.
  - Orca: Familien jagen verschieden, Lachsjäger nutzen Echo.
  - Biber: Wintervorrat.
  - Kurzschnabeligel: Nase, zerdrückt mit der Zunge.
  - Strauß: Steine im Magen.
  - Eisvogel: Fisch gegen Holz schlagen, Kopf zuerst.
  - Spinne: Beute einwickeln.
  - Dromedar, Känguru, Panda, Schleiereule.
- **Eher Fun-Fact ohne Antwortbezug:** Elefant „frisst etwa 16 Stunden“. Das ist unterhaltsam, sagt aber nichts über Gras. Erdmännchen: „Dunkle Augenflecken wirken wie eine Sonnenbrille“ hat mit dem Lebensraum nichts zu tun.
- **Erklärt nicht den Kern der Falle:** Kaiserpinguin (Antarktis). Der Text spricht über Federn, nicht über Antarktis oder Arktis. Genau diese Verwechslung steht in der Rückmeldung zur falschen Antwort „Arktis“ („passt zu … Eisbär“), aber nicht in der Auflösung.
- Nichts davon ist nur Wiederholung der Antwort. Die Texte sind kurz (zwei bis drei Sätze) und wirken nicht kindisch.

**7. Schreibweise der Antworten uneinheitlich:** „Wiesen und Gärten“ (Dromedar) und „Wiesen & Gärten“ (Erdmännchen) stehen als gleiche Art Antwort mit unterschiedlichem Zeichen. Außerdem „Flüsse & Seen“ gegen „Flüsse, Küsten und Atlantik“.

**8. „Ganz schön knifflig. Willst du eine Stufe leichter spielen?“ erscheint auch direkt nach einem „Richtig!“ und bleibt dort stehen** (Bild `04-p2-richtig-mit-angebot.png`).
- Es kommt schon nach der ersten falschen Antwort (Tier & Lebensraum, Dromedar und Panda), in „Wer frisst was?“ erst nach der zweiten. Wann genau es erscheint, habe ich nicht herausbekommen.
- Für ein 10-Jähriges, das es knifflig mag, wirkt es bei Profi bevormundend. Auch nach „Richtig!“ passt „knifflig“ schlecht. Der Hinweis nimmt außerdem Platz weg und schiebt „Nächste Aufgabe“ nach unten (bis y=766 bei 800 px Höhe).
- Vorschlag: erst nach mindestens zwei falschen Antworten in Folge zeigen und nicht in der Richtig-Rückmeldung.

**9. Spielende:** Der Bildschirm ist auf die Überschrift gerollt, der Kopf („Stufe“, „Neue Runde“) ist weg und darunter bleibt viel Leere. Die Überschrift liegt bei y=0 und ist oben angeschnitten (`05-frisst-ende.png`). Das ist derselbe Befund wie beim Technik-Spieltest (Stempel-Gestaltung, schon im BACKLOG).

**10. Experte:** In „Wer frisst was?“ steht „Stufe: Experte … Experten-Aufgaben gibt es hier noch nicht. Du spielst Profi.“ Gleichzeitig zeigt die Seite „Zu schwer? Zurück zu Entdecker“. Das ist ehrlich, aber die Stufe sieht wählbar aus (wie schon im Technik-Test, steht im BACKLOG).

**11. Nur Maus-Klick, Fokus:** Nach einem Maus-Klick zeigt der Fokus keinen Rahmen. Das ist normal und richtig. Mit der Tastatur ist der Rahmen immer sichtbar.

## Ihre Fragen

**Lernt man bei der Auflösung etwas?** Ja, in 12 von 16 Fällen etwas, das über die Antwort hinausgeht (siehe Befund 6, stark). Bei Elefant, Erdmännchen und Kaiserpinguin fehlt der Bezug zur Frage.

**Falsche Antwort: Rückmeldung und Denkfrage.** Der Satz „Du hast … gewählt“ steht nicht wörtlich da. Gesehen habe ich: „Noch nicht ganz. Versuch es noch einmal! Deine Antwort passt zu einem anderen Tier: X. Gesucht ist aber: Y. [Denkfrage]“. Das sagt klar, was gewählt wurde. Die falsche Antwort ist rot markiert (mit Kreuz), die anderen bleiben bedienbar, und man kann sofort neu wählen. Nach der richtigen Antwort sind die übrigen gestrichelt und grau, die richtige grün mit Haken (`03-p1-richtig.png`).

**Fallen, ähnlich aber sicher falsch.**
- Sehr gut: Kaiserpinguin, „Arktis“ gegen „Antarktis“ (die Rückmeldung nennt den Eisbär). Eisvogel, „Antarktis“ (Eis-Name). Känguru, „Blütenreiche Landschaften“. Panda, „Savanne“. Eule, „Küstennaher Meeresboden“ ist dagegen zu offensichtlich.
- Keine Falle war halb richtig, außer Befund 4 (Elefant/Eukalyptus).

**Ratemuster (immer gleiche Buchstabe).** Nein. Die richtige Antwort stand in meinen 16 Profi-Aufgaben an verschiedenen Buchstaben (A bis D gemischt). Ein Muster gibt es bei der Länge und beim Falschen-Vorrat (Befund 1 bis 3).

**Ist Profi fordernd, aber machbar für ein 10-Jähriges?**
- Machbar ja. Wer ein Tier kennt, löst es sofort. Fordernd nur teilweise, weil der Falschen-Vorrat und die Mischkost-Länge viel verraten (Befund 1 bis 3). Wirklich knifflig waren Schnabeltier (Süßwasser, nicht Meer), Orca (je nach Gruppe), Schleiereule (offene Landschaft) und Strauß (kleine Tiere dazu). Weniger fordernd: Kaiserpinguin, Dromedar, Panda, Känguru.
- Das 10-Jährige, das gern knifflig spielt, würde Profi in beiden Spielen ohne einen Fehler durchrattern, sobald es die Fallen-Muster kennt.

**Tastatur.**
- Tab-Reihenfolge nach „Neue Runde“: Ändern, „Zu schwer? Zurück zu Entdecker“, Vorlesen, „Brauchst du einen Tipp?“, dann A bis D. Das sind 5 Tabs bis zur ersten Antwort.
- Enter wählt, bei Richtig springt der Fokus von selbst auf „Nächste Aufgabe“, am Rundenende auf „Spielstempel sammeln“. Nach „Nächste Aufgabe“ liegt der Fokus auf der neuen Frage (H2), nach Spielende auf der H2 „Eine ganze Runde gelöst!“.
- Der Fokusrahmen ist immer sichtbar und ganz zu sehen: auf Antworten, nach falsch (`09-fokus-nach-falsch.png`), auf „Nächste Aufgabe“ (`10-fokus-nach-richtig.png`). Auf „Brauchst du einen Tipp?“ liegt die Fläche bei y=752–796 am unteren Rand (800 px), gerade noch sichtbar.
- Beim Öffnen eines Spiels liegt der Fokus auf `body` (derselbe Befund 5 aus dem Technik-Test, im BACKLOG „Fokus und Leiste, Rest“). Ausnahme: Nach „Neue Runde“ liegt der Fokus auf dem Knopf selbst und nicht auf der neuen Frage.

**Tippflächen.** „Ändern“ 81 × 48, „Alle Spiele“ 154 × 50, „Neue Runde“ 166 × 50, „Nächste Aufgabe“ 180 × 48, „Antwort“ 58 hoch, „Brauchst du einen Tipp?“ 44 hoch. Alles mindestens 44 px.

## 5. Was Spaß machte
- „Passt zu einem anderen Tier: Eisbär / Kaiserpinguin“: Die falsche Antwort wird ein Tier, das man kennt. Das ist eine gute Brücke.
- Auflösungen mit einem Bild im Kopf: „Wie ein Hamster sammelt es alles in den Backen“ (Schnabeltier), „Fischkopf zuerst, so bleibt keine Flosse im Hals“ (Eisvogel), „Erdmännchen wohnen in Höhlen anderer Tiere“, „länger, als du wach bist“ (Elefant), Strauß mit den Steinen im Magen.
- Sofortige Rückmeldung, der Fokus springt von selbst weiter, die Fotos mit Nachweis passen zu den Tieren.

## 6. Browser-Meldungen
Keine (weder Konsolenfehler noch Seitenfehler noch gescheiterte Anfragen, Chromium, gesamter Lauf).

## 7. Nicht geprüft
- Ton und Vorlesen (nur die Knöpfe sind sichtbar).
- Der Inhalt des Tipps („Brauchst du einen Tipp?“): Mein Klick darauf hat nichts Sichtbares gezeigt, ich habe ihn nicht weiter verfolgt.
- Handy und Tablet, Firefox und WebKit, Offline, echte Geräte, Bildschirmleser.
- Die Experte-Runde bis zum Ende (nur 2 Aufgaben, und die Seite spielt dort Profi).
- Nur eine Zufallsreihenfolge je Runde, nicht alle Tiere gesehen. Nicht erfasst: Entdecker-Stufe der beiden Tierspiele (außer eine Aufgabe).
- Die Fakten der Auflösungen habe ich nicht gegen Quellen geprüft. Das ist Aufgabe des `fakten-pruefer`. Auffällig zur Prüfung: Elefant „etwa 16 Stunden am Tag“, Schnabeltier „Backen“ und „harte Platten“, Strauß „kleine Steine“, Orca „Lachsjäger finden ihre Beute mit Klicklauten und Echo“.
