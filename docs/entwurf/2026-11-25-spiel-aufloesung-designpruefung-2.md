# Nachprüfung Design „Auflösung und Rückmeldung im Blick“

Helfer: `design-pruefer` (sonnet / high), 25.11.2026, Stand nach den Korrekturen (lokaler Build, Chromium).

**Nachprüfung der drei Punkte (Chromium, Produktionsbuild unter http://127.0.0.1:4310/)**

Ergebnis: Soll 1 und Soll 2 aus der ersten Prüfung sind erledigt. Dazu gibt es keinen Muss-Befund. Die Gesamtbewertung bleibt unverändert.

Die Bilder liegen in `/home/user/wunderkompass/.qa-output/design-aufloesung-2/`. Namensschema: `<spiel>-<falsch|richtig>-<breite>.png` mit `people`, `kreuz`, `detektiv`. Zusätzlich liegt `technik` auf 320 bis 1280 px dabei, das war nicht verlangt. Zu 1440 px gibt es nur `people`, `kreuz` und `detektiv`. Der Serverhinweis traf zu: Bei 1440 px fehlten zuerst `detektiv-falsch` und `detektiv-richtig`. Beide habe ich nach dem Neustart wiederholt, sie sind jetzt vorhanden. Gemessen wurde per Skript im DOM, geschaut habe ich mir nur einzelne Bilder. Im Ordner liegen 46 Bilder.

**Soll 1: Überschrift „Richtig!“ / „Noch nicht ganz …“. Erledigt.**
- Normale Schrift: 18 px, Gewicht 700, Fließtext 16 px. Das gilt bei allen Spielen und Breiten.
- Große Schrift (320 px): 20,8 px, Fließtext 18,4 px. Die Überschrift ist also größer als der Text darunter. Auf diesem Weg gilt der Zielwert von 1,3 rem nicht. 18 px, also 1,125 rem, entspricht dem Soll, und bei großer Schrift gilt 20,8 px, also 1,3 rem.
- Bilder: `people-richtig-320.png`, `people-richtig-768.png`, `people-richtig-1280.png`, `technik-richtig-320x568-gross-keys-2.png`.

**Soll 2: Abstand „Erklärung vorlesen“ zu „Nächste Aufgabe“. Erledigt.**
- Nebeneinander, 768 bis 1440 px, in `people-richtig-768.png` und `people-richtig-1280.png`: genau 16 px Abstand (141 px breit von 43 bis 184, Weiter ab 200).
- Das gleiche Maß gilt bei 390 px, zum Beispiel `people-richtig-390.png`: 170 bis 186, also 16 px.
- Die Knopf-Anordnung „Nächste Aufgabe | Wissen vertiefen“ steht bei 1440 px mit 8 px Abstand nebeneinander (`detektiv-richtig-1440.png`, 451 bis 459). Das ist in Ordnung, weil beide echte Knöpfe sind.
- Der Fokusring von „Weiter“ überlappt den Vorlesen-Knopf nicht mehr.

**Dritter Punkt: lange Erklärung, 320×568, große Schrift (Technik). Wirkt wie gewünscht.**
- Das Kühlschrank-Beispiel kam in den Läufen nicht dran. Ich habe vier Läufe mit anderen Fragen aufgenommen und dabei zwei lange Erklärungen erzeugt.
- Lang war: ein Seilaufzug mit 780 px hohem Kasten (`technik-richtig-320x568-gross-touch-1.png`) und ein Fall mit 628 px (`technik-richtig-320x568-gross-keys-2.png`). Alle Aufnahmen: `technik-richtig-320x568-gross-keys-0..3.png` und `-touch-0..3.png`.
- Der Kasten beginnt bei hohem Kasten 12 px unter dem oberen Bildrand, „Richtig!“ steht fast ganz oben, der Anfang des Textes ist sichtbar.
- Der Fokus liegt dort auf der Überschrift (`STRONG`, `tabindex=-1`), nicht auf dem Knopf. Bei kürzeren Erklärungen, die in den Platz passen, liegt der Fokus weiterhin auf „Nächste Aufgabe“.
- Fokusrahmen per Tastatur (Enter auf eine Antwort): 3 px, durchgezogen, Petrol (14,110,114), 3 px Abstand. Er ist auf dem hellen Kasten gut zu sehen und nicht abgeschnitten (`technik-richtig-320x568-gross-keys-2.png`).
- Nach Tippen oder Mausklick (`...-touch-1.png`): kein Rahmen, `:focus-visible` ist false. Das entspricht der Regel „kein großer Rahmen nach Maus oder Finger“.
- Der Rest des Kastens ist bei hohem Kasten durch Rollen erreichbar. Beim Scrollen bis zum Seitenende lagen die Knöpfe oberhalb des Bildes und damit durch Rollen zugänglich. Ob „Nächste Aufgabe“ dabei knapp über der Leiste ankommt, habe ich nicht gesondert geprüft.
- Untere Kante des Kastens bei normalen Fällen auf 320 px: 492 px, die Leiste beginnt bei 504 px, also 12 px Abstand wie vorher.
- Auf 390 px: Kasten bis 768 px, Leiste ab 780 px, ebenfalls 12 px.

**Muss**
- Keine. Bei keiner Breite gibt es waagerechtes Scrollen, der Kasten wird nirgends von der Leiste verdeckt.

**Soll**
- Keine neuen. Soll 1 und 2 sind erledigt.

**Kann**
1. Bei 320 px (und großer Schrift) stehen „Erklärung vorlesen“ und „Nächste Aufgabe“ untereinander. Die Tippflächen der beiden Knöpfe berühren sich dort ohne Abstand (Vorlesen 383 bis 427, Weiter 427 bis 475, `people-richtig-320.png`). Optisch ist es in Ordnung, weil der Vorlesen-Knopf keine Fläche zeigt. Man könnte unter 768 px einen vertikalen Abstand von 8 bis 12 px ergänzen, damit die Zielflächen sich nicht berühren.
2. Der Text „Rückmeldung vorlesen“ bei falscher Antwort ist wie vorher 44 px hoch. Das ist am Minimum.
3. „Wissen vertiefen“ (`detektiv-richtig-390.png`): zweizeilig, Text zentriert, Symbol links. Es wirkt etwas schwer, bleibt aber klar nachrangig. Das war schon in der ersten Prüfung Kann.
4. Die nicht gewählten Antworten sind wie vorher blass (`people-richtig-768.png`, `people-richtig-1280.png`). Die Antwortkarte mit „Passt“ (`detektiv-richtig-390.png`) ist gut erkennbar.

**Was gut ist (erhalten)**
- Die Kasten-Hierarchie stimmt jetzt: Überschrift größer als der Text, mit etwas Abstand darunter.
- Der Kasten endet bei 320 und 390 px konsequent 12 px über der Leiste; bei 768, 1280 und 1440 px passt er in den Bildschirm.
- Die 16 px zwischen Vorlesen und Weiter bei Nebeneinander, 150 × 48 px für „Nächste Aufgabe“.
- Die Fokussteuerung: Überschrift bei hohem Kasten, Knopf bei kurzem Kasten, Ring nur bei Tastatur.

**Nicht geprüft**
- Echte Geräte, Safari oder WebKit (nur Chromium), Bildschirmleser.
- Das Kühlschrank-Beispiel selbst (stattdessen Seilaufzug und ein weiterer langer Fall).
- Fokus per Tastatur bei 768 px und bei „Kreuz und quer“ und „Stimmt das wirklich?“; die Fokusmessung beim Tippen und Klicken auf allen Breiten zeigte nur `focusVisible=false`.
- „Bewegung reduzieren“.
- Mehrere Aufgaben nacheinander, Stufenwechsel, Zurück und Neuladen.

Ich habe außer den Screenshots nichts im Repository geändert. Hilfsskripte liegen im Scratchpad unter `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/dp2/`. Eine neue, nicht von mir stammende Datei `docs/entwurf/2026-11-25-spiel-aufloesung-spieltest-2.md` erscheint in `git status`; sie ist nicht von mir.
