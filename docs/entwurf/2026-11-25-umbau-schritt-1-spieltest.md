## Spieltest Design-Umbau Schritt 1 („Farben, Fokus, Knöpfe“)

> Helferbericht (spieltester, sonnet), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

**Ehrlich vorab:** Das ist ein Spieltest in zwei Rollen, kein Kindertest. Ich habe nichts Verstecktes ausgelöst und nichts geändert. Ich habe die Seite wie die Rollen bedient, über sichtbare Knöpfe und Links, und danach Farben und Größen ausgelesen. Weil jeder Skriptlauf mit leerem Pass beginnt, habe ich viele Schritte neu abgespielt. Echte Einzelhandlungen waren etwa 45, mehr als die Richtgröße von 30. Die Seitenadresse `#journeys/water/1` habe ich nicht eingetippt, sondern über Reisen → „Die Reise eines Tropfens“ erreicht.

**Auftrag:** Stand `http://127.0.0.1:4180/`.
- Lena, 6 Jahre, Handy 390 px, Touch.
- Jonas, 9 Jahre, Tablet 768 px mit Touch, danach Rechner 1280 px mit Maus und Tastatur.

**Ergebnis:** Alle Ziele erreicht, keine Sackgasse.
- Lena: „Wer war das?“ (Entdecker) ganz gespielt, 5 von 5 Aufgaben, mit mehreren absichtlich falschen Tipps. Danach Elefanten-Karte mit Ratefrage und „Stimmt das?“.
- Jonas: Kapitel 1 der Reise „Die Reise eines Tropfens“ (`water`) geschafft. Er hat Wahlknöpfe und die Stufen Entdecken und Erklären probiert, falsch und richtig geantwortet, Vorlesen getippt und über „Weiter entdecken“ Kapitel 2 erreicht. Labor „Vulkan-Werkstatt“ ausprobiert. Am Globus (`classic:hunt`) zwischen Kontinente, Länder und Meere gewechselt. Auf dem Rechner mit Tab und Enter durch eine Spielfrage.

### Ablauf (Bilder in `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/spieltest-s1/`)
1. Start, dann „Spielen“, dann „Wer war das?“ (`handy-03-nach-tippen.png` aus a2, Stufe schon Entdecker).
2. Falsch getippt: `handy-01-antwort1A.png`, `handy-01-f3-falsch-A.png`. Richtig: `handy-02-f5-richtig-letzte.png`. Ende der Runde: `handy-04-ende-oben.png`.
3. Stufe-Dialog: `handy-01-stufe-dialog.png`.
4. Welten → Tierwelt → Elefant. Falsch: `handy-02-frage-falsch-B.png`. Richtig: `handy-04-frage-richtig-C.png`. „Stimmt das?“: `handy-02-stimmt-nach.png`.
5. Reise (Tablet): Wahlknopf `tablet-02-wahl-wasserdampf.png`; Frage falsch `tablet-02-frage-falsch-Eis.png`; richtig `tablet-03-frage-richtig-Wasserdampf.png`; Stufe Erklären `tablet-01-erklaeren.png`; Kapitelende `tablet-03-kapitelende.png`; Kapitel 2 `tablet-04-kapitel2.png`.
6. Labor Vulkan: `tablet-03-schalter-an.png`.
7. Globus: `tablet-02-meere.png`, `tablet-03-mission.png` (Kontinente: `tablet-01-kontinente.png`, nicht angesehen).
8. Rechner, Tastatur: `rechner-06-tab6.png` (Fokus auf Antwort A), `rechner-08-nach-enter.png`. Reise auf dem Rechner: `rechner-02-wahl-tastatur.png`, `rechner-03-antwort-falsch.png`.

### Deine Fragen
- **Sieht man, was man angetippt hat?** Ja. Die falsch getippte Antwort wird rosa-rot mit rotem Buchstaben, die richtige grün mit Haken. Nach „Richtig“ werden die übrigen Antworten gestrichelt und grau.
- **Ist richtig und falsch nicht nur über Farbe klar?** Teilweise. Die Texte „Richtig!“ und „Noch nicht ganz. Versuch es noch einmal!“ sagen es, und der Haken sitzt nur bei richtig. Die falsche Antwort hat kein eigenes Zeichen, nur die Farbe. Mehr dazu unter Soll 1 und 2.
- **Sind alle Knöpfe gut zu treffen?** Fast. Antworten sind 56 px hoch, Hauptknöpfe 48 px, Nav 65×63 px. Zu klein sind:
  - Lizenz-Links unter Bildern auf der Karte (38 px hoch und 36 px hoch).
  - Orts- und Meer-Namen am Globus (40 px hoch).
  - Die Schalter „Grenzen / Äquator & Pole / Namen“ (46×28 px). Ob das Textschild mit antippbar ist, habe ich nicht geprüft.
- **Verwechselt man „ausgewählt“ (blaugrün) mit „richtig“ (grün)?** Ja, an zwei Stellen (Soll 3 und 4).

### Befunde

**Muss: keine.** Kein Konsolenfehler, kein Seitenfehler, nichts, was nicht weitergeht.

**Soll**
1. **Verwirrend: Rückmeldung bei falsch und richtig sieht gleich aus.** Die Rückmeldebox hat bei „Noch nicht ganz“ und „Richtig!“ dieselbe Schriftfarbe `rgb(56,104,88)` (grün) und dieselbe Hintergrundfarbe `rgb(234,244,243)`. Ein falsch beantworteter Tipp bekommt also eine grüne Rückmeldung. Das kleine Kind sieht erst die Antwortzeile, dann den grünen Kasten. Zu sehen auf `handy-01-antwort1A.png`, `tablet-02-frage-falsch-Eis.png` und `rechner-03-antwort-falsch.png`. Vorschlag: Die Box bei falsch neutral lassen oder warm tönen, grün nur bei richtig, wie im Auftrag.
2. **Uneinheitlich: Falsch hat ein Zeichen oder nicht.** In „Stimmt das?“ stehen ein Haken und ein Kreuz (`handy-02-stimmt-nach.png`). Bei Mehrfachantworten (Spiele, Rate mal, Reise, Labor) hat die falsche Antwort kein Zeichen, nur Farbe und Text. Vorschlag: Auch hier ein kleines Zeichen, zum Beispiel ein Kreuz oder „?“, damit es ohne Farbe lesbar ist.
3. **Verwechslungsgefahr: Ausgewählt und richtig fast gleich hell.** Auswahl-Füllung `rgb(220,239,239)` mit Rand `rgb(11,107,115)`. Richtig-Füllung `rgb(226,240,231)` mit Rand `rgb(46,122,85)`. Das sind zwei sehr ähnliche Minztöne. In der Reise stehen sie direkt untereinander: Die gewählte Stufe „Entdecken“ und die richtige Antwort sehen fast gleich aus (`tablet-03-frage-richtig-Wasserdampf.png`). Vorschlag: Richtig deutlich kräftiger oder mit festerem Grün füllen, oder Auswahl nur mit Rand und Haken, ohne Füllung.
4. **Verwirrend: Derselbe Haken bedeutet zwei Dinge.** Im Stufe-Dialog markiert der Haken „ausgewählt“ (`handy-01-stufe-dialog.png`). In den Antworten markiert er „richtig“. Vorschlag: Für Auswahl einen anderen Marker (Punkt oder Ring) oder nur den Rand.
5. **Zu klein getippt:** Lizenz-Links unter Bildern (36 bis 38 px), Orts-Chips am Globus (40 px), Schalter am Globus (28 px hoch). Alles unter 44 px, auf dem Handy mit Kinderfingern schwierig.

**Kann**
1. **Navigation zeigt falsch:** Auf dem Globus (`#globe`, aus „Spielen“ geöffnet) ist in der Nav „Start“ markiert, nicht „Spielen“ (`tablet-02-meere.png`).
2. **Zwei Stile für „ausgewählt“:** Oben am Globus (Weltkugel / Erdschichten / Tag & Nacht) ist die Auswahl eine weiße Kachel in grauer Leiste. Darunter (Kontinente / Länder / Meere) ist sie ein blaugrüner Chip mit Rand. Gleiche Art Knopf, zwei Looks.
3. **Zurück-Knopf uneinheitlich:** „← Zurück“ auf der Karte hat einen blassen Rand (`handy-02-filter-savanne.png`). „Alle Welten“ und „Alle Lernreisen“ haben einen kräftig teal Rand.
4. **Deaktiviert sieht wie bedienbar aus:** „Vorheriges Kapitel“ in Kapitel 1 ist deaktiviert und nur blass bei 65 % Deckkraft (`tablet-03-kapitelende.png`). Das wirkt wie „tipp mich“. Vorschlag: Bei Kapitel 1 ausblenden.
5. **Zwei Knöpfe nicht bündig:** „Auf der Erde nachschauen“ und „Im Forscherlabor ausprobieren“ stehen am Kapitelende 3 bis 4 px versetzt (y 2616 gegen 2619, `tablet-03-kapitelende.png`).
6. **Spielende:** Nach „Spielstempel sammeln“ steht nur ein Haken und viel Leerraum, ein Stempel ist nicht zu sehen (`handy-04-ende-oben.png`). Das passt zum Hinweis, dass der Stempel erst später kommt. Auf dem Handy bleibt die Seite beim Weiterscrollen mitten im Leeren stehen (`handy-02-ende.png`).
7. **Labor Vulkan: Text zum Schalter:** Bei Schalter „Zähes Magma“ an und wenig Gas steht „Das Gas kann leichter entweichen“. Das widerspricht der Schalterbeschriftung „Zähes Magma · Gas entweicht schwerer“. Es ist eine Modell-Grenzfall-Meldung, die sich beim ersten Lesen widerspricht.
8. **Stufe-Knopf zu blass:** In der Reise unterscheiden sich gewählte und nicht gewählte Stufen nur durch eine leichte Tönung, nicht durch Haken oder Rand (`tablet-01-erklaeren.png`).
9. **Ratemuster, Reise Wasser, Stufe Erklären:** Die richtige Antwort „Wir sehen viele kleine Tröpfchen“ ist die kürzeste. Die anderen beiden sind lang und eine ist offensichtlich unsinnig („zu einem einzigen großen Tropfen“). Stufe Entdecken: Die Antwort steht fast wörtlich im Text direkt darüber („unsichtbarer Wasserdampf“, `tablet-02-wahl-wasserdampf.png`), also für Jonas zu leicht.
10. **Spielzeit:** Bei Stufe Entdecker gibt es nach falschem Tipp sofort einen zweiten Versuch mit nur drei Antworten. Für Lena gut. Wer nur rät, kommt über Probieren immer durch.

### Was gut ist (erhalten)
- Fokus auf dem Rechner: 3 px teal Ring mit 2 px Abstand, auf jedem Knopf gut zu sehen (`rechner-06-tab6.png`). Nach Enter springt der Fokus von selbst auf „Nächste Aufgabe“. Das Spiel lässt sich ganz mit Tab und Enter spielen.
- Richtig-Zustand mit Haken und grünem Buchstaben, übrige Antworten gestrichelt und grau: klar.
- Rückmeldetexte bei falsch sind freundlich und ohne Vorwurf. „Du hast ‚X‘ gewählt“ nennt, was angetippt wurde.
- Hauptknöpfe („Nächste Aufgabe“, „Weiter entdecken“) sind kräftig gefüllt und gut zu finden.
- Globus: Wechsel zwischen Kontinente, Länder und Meere geht sofort, Beschriftungen ändern sich passend.

### Browser-Meldungen
Keine Konsolenfehler, keine Seitenfehler, keine gescheiterten Anfragen.

### Nicht geprüft
- Ton und Vorlesen: Die Knöpfe lassen sich tippen, aber ich höre nichts und sehe keine Änderung am Knopf. Der Zustand „läuft gerade“ ist also nicht beurteilt.
- 3D-Globus nur eingeschränkt: Antippen von Ländern und Mini-Missionen am Globus nicht gespielt.
- Kein echtes Gerät, kein Bildschirmleser, nur Chromium.
- Nicht nachgemessen: Kontrastwerte der blassen Zustände.
- Reise Kapitel 2 bis 5, andere Spiele und andere Labore nicht gespielt.
- Die Antworten „Stimmt das?“, Reise und Labor in anderen Stufen (Profi, Experte) nicht gespielt.

Hinweis: Skripte liegen im selben Ordner (z. B. `a5.mjs`, `c4.mjs`, `e1.mjs`) und lassen sich zum Nachstellen erneut laufen.
