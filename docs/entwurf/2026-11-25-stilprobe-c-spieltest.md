# Spieltest der Stilprobe C

Helfer: `spieltester` (sonnet/high), 25.11.2026. Bilder in `/home/user/wunderkompass/.qa-output/stilproben/spieltest-c/` (nicht in Git). Skripte im Scratchpad, am Projekt wurde nichts geändert.

## Vorbemerkung (ehrlich)

Das ist kein Kindertest. Ich bin ein Testbrowser. Die Seiten sind statische Muster (file://). Ich habe die vier Seiten in 390 px (Touch) und 1280 px geladen, gescrollt, mit Tab durchgegangen, Tippflächen und Seitenbreite gemessen und rund 25 eigene Aufnahmen gemacht. Ich habe nichts angetippt oder gespielt, denn es gibt keine Logik. „Würde tippen“ ist Einschätzung, nicht Beobachtung. Ton, Bewegung (Rosenpendeln, Stempel-Aufschlag, Lichtschimmer) und echtes Antippen sind nicht geprüft. Die fertigen Aufnahmen `c-*-390.png` und `c-*-1280.png` habe ich nicht benutzt, sondern neu aufgenommen.

## Ergebnis in einem Satz

Beide Ziele gehen in C als „würde finden und tippen“ gut durch, ohne Sackgasse. Für Mia ist C klar besser als A und fast so gut wie B, und die Falsch-Antwort ist ermutigend. Jonas findet seinen Stand jetzt, nämlich „14 von 204 Karten“ und „Aufgabe 3 von 6“. Neue Schwächen sind ein Nächste-Aufgabe- und Tipp-Knopf unter der Bildschirmkante auf dem Handy und ein Fortschrittspunkt, der nach „Gelöst!“ noch „aktuell“ zeigt.

## Begehung Mia (390 × 844, Touch)

1. **Start, `mia-c-start-1.png`.** Zuerst fällt die große Frage auf, dann der petrolfarbene Knopf „Antwort suchen“ (218 × 56 px) und das Pinguinfoto. „Andere Frage“ ist jetzt ein Knopf, kein Textlink mehr (besser als A). Einschätzung: Mia würde „Antwort suchen“ oder das Foto tippen.
2. **Welten, `mia-c-start-2.png`, `mia-c-start-3.png`.** Die Welten sind Foto-Kacheln. Das Pandafoto steht für „Die Tierwelt“, die Beschriftung ist groß. Einschätzung: Mia tippt den Panda ohne Lesen, wie in B. Das ist der große Vorteil gegenüber A.
3. **Karte, `mia-c-karte-1.png`, `mia-c-karte-2.png`.** „Vorlesen“ steht mit Wort und Symbol gleich unter dem Titel, daneben „Merken“. Die „Rate mal!“-Antworten sind jetzt eindeutige Knöpfe mit Rand und Schatten, im gestrichelten Kasten. In A sahen sie noch wie Eingabefelder aus.
4. **Spiel, richtig, `mia-c-spiel-1.png`, `mia-c-spiel-2.png`, `mia-c-spiel-stempel-zoom.png`.** Die Fortschrittsleiste hat Häkchen, die Raute für „aktuell“ ist orange. Die richtige Antwort ist grün mit Haken. Darunter steht „Richtig!“ mit Erklärung und rechts der Stempel „Gelöst!“. Der Stempel liegt jetzt neben dem Text und nicht mehr über dem Antworttext. Der Fehler aus B ist behoben. „Vorlesen“ ist an der Spielfrage da, auf 390 px nur als Lautsprecher-Symbol (52 × 48 px, `aria-label` „Frage vorlesen“). Nicht angetippte Antworten sind gestrichelt und gut lesbar, nicht mehr halb durchsichtig.
5. **Spiel, falsch, `mia-c-spiel-falsch-1.png`, `mia-c-spiel-falsch-2.png`.**
   - Nur die getippte Antwort ist rot und hat ein Kreuz in rotem Kreis, hell hinterlegt.
   - Die zwei anderen Antworten bleiben weiß mit Schatten und sehen weiter antippbar aus.
   - Darunter steht ein ruhiger Kasten in Petrol-Tönung: „Noch nicht ganz. Versuch es noch einmal!“ und „Vergleiche die Antworten in Ruhe. Ein Tipp hilft dir.“
   - Das fühlt sich nicht beschämend an. Es gibt kein Rot-Alarm-Dreieck und keinen Stempel.
   - Einschätzung: Mia würde nach dem Vorlesen durch Mama eine andere Antwort tippen. Das ist der naheliegende Schritt, weil die Antworten unverändert wie Knöpfe aussehen.

## Begehung Jonas (1280 × 800, Maus und Tastatur)

1. **Start, `jonas-c-start-1.png`, `jonas-c-start-ganz.png`.** Das wirkt ruhig und erwachsen genug, die Schrift ist klar (kein „u“ wie „v“ mehr). Schon im ersten Bild steht links „Deine Route“ mit dem Balken „14 von 204 Karten entdeckt“. Das ist seine fehlende Zahl aus dem Test von A und B. Die drei Stationen (Zuletzt, Als Nächstes in Orange, Danach gestrichelt) folgen direkt darunter. Sie sind im ersten Bild nur angeschnitten und liegen darunter. Die Welten-Kacheln sind in den ersten 800 px nur angeschnitten. Die Kompassrose sitzt jetzt sauber unter der Kopfleiste und ist nicht mehr angeschnitten.
2. **Spiel, richtig, `jonas-c-spiel-1.png`, `jonas-c-spiel-ganz.png`.** Fast alles passt auf einen Bildschirm. Die Seite scrollt nur 41 px, „Nächste Aufgabe“ liegt bei y = 705 bis 761. Oben stehen die Häkchen-Leiste „Aufgabe 3 von 6“ und „Stufe Entdecker“ als schlichte Anzeige. Rechts liegt die blaue Karte „Warum verändert der Mond seine Form?“ als Verknüpfung. Das ist wie in A, nur klarer.
3. **Spiel, falsch, `jonas-c-spiel-falsch-1.png`.** Gleiche Anordnung, „Tipp ansehen“ und „Spiel beenden“ sind sichtbar. Die Seite scrollt nur 8 px.
4. **Tab, `jonas-c-spiel-tab14.png`.** Die Reihenfolge ist logisch. Der Fokus auf „Nächste Aufgabe“ hat einen dicken Rahmen mit weißem Innenring und ist gut sichtbar.
5. **Messung.** Auf allen vier Seiten und in beiden Größen ist keine Tippfläche unter 44 × 44 px. Auch die Textlinks „Spiel beenden“ und „Karte öffnen“ sind 48 px hoch. Die Seitenbreite entspricht der Fensterbreite, es gibt kein seitliches Scrollen.

## Befunde

### Muss

Keine blockierenden Fehler.

### Soll

- **Verwirrend / Sieht falsch aus, Handy, richtig und falsch.** Der Knopf „Nächste Aufgabe“ liegt bei 390 × 844 unter der Bildschirmkante, bei y ≈ 846 hinter der Menüleiste ab 776. Ohne Scrollen ist der Weg weiter nicht zu sehen. In A war er sofort sichtbar, in B war er verdeckt, in C ist es gleich wie in B. Auf echten Handys mit Browserleiste (ca. 700 px Höhe) ist es noch schlimmer. Der Stempel wird nur halb sichtbar (`mia-c-spiel-1.png`), erst nach dem Scrollen ganz (`mia-c-spiel-2.png`). Vorschlag: Erklärkasten kürzer oder Stempel kleiner, oder den Weiter-Knopf am unteren Rand festhalten, etwa über der Menüleiste.
- **Verwirrend, Handy, falsch.** Der Kasten sagt „Ein Tipp hilft dir“, aber „Tipp ansehen“ liegt darunter, bei y = 789 und im ersten Bild unter der Menüleiste (`mia-c-spiel-falsch-1.png`, erst in `mia-c-spiel-falsch-2.png` sichtbar). Mia kann den Hinweis lesen, aber nicht sehen, wo der Tipp ist. Vorschlag: „Tipp ansehen“ in den Kasten oder direkt unter die Antworten setzen.
- **Verwirrend, Stempel und „Richtig!“.** `mia-c-spiel-stempel-zoom.png`, `jonas-c-spiel-1.png`. Es sind jetzt drei Zeichen für dasselbe. Es gibt den Haken in der Antwort, den Haken vor „Richtig!“ und den Haken im Stempel, dazu zwei Wörter: „Richtig!“ und „Gelöst!“. Das ist nicht widersprüchlich: „Richtig!“ gilt der Antwort, „Gelöst!“ der Aufgabe. Ein 6-jähriges Kind liest beides ohne Mühe als „gut“. Für Jonas wirkt es doppelt. Dazu steht „Aufgabe 3 von 6“ mit noch orangefarbener Raute daneben. Ob jetzt 2 oder 3 Aufgaben gelöst sind, bleibt offen (siehe nächster Punkt). Vorschlag: Stempel nur mit Häkchen und „Gelöst!“ lassen und im Kasten „Richtig!“ ohne eigenes Häkchen schreiben. Oder der Stempel trägt „Richtig!“ und der Kasten ist nur die Erklärung. Welches der beiden Wörter bleibt, kann Mama oder Jonas im Gespräch entscheiden.
- **Verwirrend, Fortschrittsleiste, richtig.** `jonas-c-spiel-1.png`. Nach der richtigen Antwort zeigt Punkt 3 weiter die orange Raute („aktuell“) und kein Häkchen. Bei „Gelöst!“ wäre ein Häkchen stimmiger. Jonas sieht „Aufgabe 3 von 6“, aber die Leiste sagt „2 fertig“. Vorschlag: Punkt 3 wird beim Stempel zum Häkchen, Punkt 4 zur Raute.

### Kann

- **Sieht falsch aus, Vorlesen auf 390 px.** `mia-c-spiel-1.png`. Der Knopf an der Spielfrage ist nur ein Lautsprecher-Symbol, auf der Karte steht dagegen „Vorlesen“ mit Wort (`mia-c-karte-1.png`). Das Symbol ist bekannt (52 × 48 px, in Ordnung), aber uneinheitlich. Vorschlag: Auch auf dem Handy das Wort zeigen oder auf der Karte genauso beschriften.
- **Sieht falsch aus, Foto unscharf.** `jonas-c-start-1.png`. Das Pinguinfoto wirkt auf 1280 px weich und körnig, wohl vergrößert. Für den Hauptblickfang etwas schwach. Vorschlag: größere Fotodatei nehmen.
- **Verwirrend, Mondphasen-Kachel.** `mia-c-start-3.png`. „Wissenschaft & Weltall“ ist als einzige Kachel eine Zeichnung. Neben fünf Fotos fällt das auf. Das Mondthema passt gut zur Spielfrage, aber Mia sieht keine „echte“ Welt. Vorschlag: Das Stilbild bleibt, bis es ein freies Foto gibt. Im Muster ist es gekennzeichnet.
- **Verwirrend, Rateschema der Mondfrage.** Richtig ist die kürzeste Antwort („Von der Sonne“), eine falsche Antwort wiederholt das Wort „Mond“ aus der Frage („Aus einer Lampe im Mond“), die dritte ist offensichtlich unsinnig („brennenden Wolken“). Das Gleiche bei der Elefantenfrage: Die richtige Antwort „Riechen und greifen“ ist die kürzeste und die anderen zwei sind absurd. Das ist Sache des Inhalts, nicht des Stils, aber ein Mädchen von 6 kann ohne Wissen raten (zu leicht), und Jonas (10) würde es erkennen. Vorschlag: den `stufen-pruefer` darauf ansetzen.
- **Verwirrend, Falsch-Kasten.** „Vergleiche die Antworten in Ruhe“ ist für eine Erstleserin abstrakt. Mama liest es vor, dann geht es. Vorschlag: einfacher, etwa „Schau noch einmal genau hin.“
- **Verwirrend, Seitenkarte im Falsch-Zustand.** `jonas-c-spiel-falsch-1.png`. Die blaue Karte „Dazu gibt es eine Wissenskarte“ bleibt auch vor der richtigen Antwort stehen. „Karte öffnen“ führt Mia aus dem Spiel, bevor die Aufgabe gelöst ist. Das ist nicht falsch, aber vielleicht gewollt. Entscheiden, ob das so bleiben soll.
- **Sieht falsch aus, Desktop.** `jonas-c-spiel-1.png`. Die blaue Karte rechts beginnt tiefer als die Spielkarte links (y = 191 gegen 219 für die Karte, Überschrift bei 90). Darüber bleibt viel leerer Raum. Das ist rein Optik.

## Vergleich

**Mia, C gegen B**
- Besser:
  - Die Schrift ist ruhiger, das „u“ ist kein „v“ mehr.
  - Der Stempel verdeckt nichts mehr, ist deckend und lesbar.
  - Die große „Richtig!“-Zeile aus A ist da.
  - Der Teleskop-Text auf der blauen Karte ist nicht mehr überdeckt (vgl. B-Fehler).
  - Die Falsch-Antwort ist freundlich und deutlich.
  - Die „Vorlesen“-Taste ist an der Spielfrage vorhanden. In A und B fehlte sie dort.
  - Alle Tippflächen sind mindestens 48 px.
- Schlechter oder gleich:
  - Weniger knallige Wirkung. Der orange Hauptknopf aus B ist weg, der Hauptknopf ist Petrol. Ob das Mia weniger anspricht, kann ich nicht beurteilen. Sichtbar ist er trotzdem sofort.
  - Der „Nächste Aufgabe“-Knopf liegt wie in B unter der Bildschirmkante.
- Gleich gut: Die Foto-Kacheln führen Mia ohne Lesen zu „Tiere“.

**Jonas, C gegen A**
- Besser:
  - Es gibt eine Zahl für den Stand („14 von 204 Karten entdeckt“). Das fehlte in A und B.
  - Die Fortschrittsleiste hat Häkchen.
  - Die Welten sind Foto-Kacheln statt einer Textliste.
  - Die Kompassrose ist nicht mehr angeschnitten.
  - Der Stempel gibt einen Belohnungsmoment, den A nicht hatte.
- Gleich gut: Es wirkt erwachsen genug, nicht nach „Babykram“. Das Spiel passt auf einen Bildschirm, wenn auch mit 41 px Scroll. Die Route als Weg bleibt erhalten.
- Schlechter oder neu: Der Stempel wirkt neben „Richtig!“ doppelt. Die Raute bleibt nach „Gelöst!“ stehen.

**Gesamt:** C hält, was die Beschreibung verspricht. Die Muss-Punkte aus dem Test von A und B (angeschnittene Rose, überdeckter Text, fehlende Falsch-Antwort, kleine Textlinks, fehlendes Vorlesen, blasse Antworten) sind behoben. Offen sind die zwei Knöpfe unter der Bildschirmkante auf dem Handy und die Doppelung bei Stempel und Fortschritt.

## Was Spaß machen könnte (Einschätzung)

Die große Frage mit Kompassrose, die Foto-Kacheln und der Stempel „Gelöst!“ mit Häkchen sehen belohnend aus. Die Route mit der Zahl „14 von 204“ zeigt Jonas sofort, wo er steht.

## Browser-Meldungen

Keine (keine Konsolenfehler, keine Seitenfehler, keine gescheiterten Anfragen).

## Nicht geprüft

Ton und Vorlesen, Bewegung (Rosenpendeln, Stempel-Aufschlag, Lichtschimmer, „Bewegung reduzieren“), echtes Antippen und Weiterspielen, Kartenwechsel, 320, 768 und 1440 px (nur 390 und 1280), Firefox und Safari, echtes Touchgerät mit Browserleiste, Bildschirmleser, echte Kinder.

## Bilder (alle in `/home/user/wunderkompass/.qa-output/stilproben/spieltest-c/`)

`mia-c-start-1.png` bis `-4.png`, `mia-c-karte-1.png` bis `-4.png`, `mia-c-spiel-1.png`, `mia-c-spiel-2.png`, `mia-c-spiel-stempel-zoom.png`, `mia-c-spiel-falsch-1.png`, `mia-c-spiel-falsch-2.png`, `jonas-c-start-1.png`, `jonas-c-start-ganz.png`, `jonas-c-start-tab14.png`, `jonas-c-karte-1.png`, `jonas-c-karte-ganz.png`, `jonas-c-spiel-1.png`, `jonas-c-spiel-ganz.png`, `jonas-c-spiel-tab14.png`, `jonas-c-spiel-falsch-1.png`, `jonas-c-spiel-falsch-ganz.png`, `jonas-c-spiel-falsch-tab14.png`.
