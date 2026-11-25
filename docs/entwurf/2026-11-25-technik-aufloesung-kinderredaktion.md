# Kinder-Redaktion: kurze Auflösungen im Technik-Detektiv

Helfer: `kinder-redaktion` (opus/high), 25.11.2026, zum [Entwurf](2026-11-25-technik-aufloesung-entwurf.md).

Geprüft habe ich `/home/user/wunderkompass/docs/entwurf/2026-11-25-technik-aufloesung-entwurf.md` gegen das Vorbild `/home/user/wunderkompass/docs/entwurf/2026-11-25-spiel-aufloesung-endfassung.md`. Hinweise und Titel habe ich in `app/world-catalog.json` und `app/world-game-bank.ts` nachgelesen. Zeichen und Wörter habe ich von Hand gezählt, nicht mit Skript. Vor dem Einbau also bitte einmal durch `check.mjs` laufen lassen.

## 1. Gesamteindruck

**Note: gut.** Der Entwurf ist ein großer Schritt: Statt 316 bis 534 Zeichen mit Fachwörtern beantworten die Texte jetzt die Forscherfrage in Alltagssprache. Rakete, Satellit, Batterie, Kühlschrank und 3D-Druck sind richtig gut. Schwach sind drei Muster:
- Sätze, die verdreht anfangen („Ist das hintere klein, …“, „Bewegen sich beide …, kann“, „Den Unterschied zeichnet …“, „Feine Einzelheiten zeigt aber …“). Für Kinder, die gerade lesen lernen, sind sie schwerer als ihre Wortzahl vermuten lässt.
- Einzelne abstrakte Wörter („Signal“ beim Transistor, „gegeneinander“, „Unterschied“).
- Bei den kurzen Texten oft noch zu viel „wer“ und zu wenig „wie“.

## 2. Befunde zu den offenen Wörtern (Abschnitt 4, Punkt 4)

| Wort | Urteil | Begründung |
|---|---|---|
| „Chip“ | **ersetzen** | Bei 5- bis 7-Jährigen denkt man an Knabberzeug, die Mehrzahl „Chips“ (Smartphone) verwechselt man noch leichter. Ersatz: „elektronisches Bauteil“ bzw. „winzige Bauteile“. |
| „Akku“ | **bleibt** | Alltagswort („Der Akku ist leer“). Es vermeidet außerdem den Namen „Batterie“, der eine andere Erfindung im Spiel ist. |
| „Loks“ | **bleibt** | Kinder kennen „Lok“ besser als „Lokomotive“. |
| „Signal“ Telefon | **bleibt** | Der Ablauf Stimme → Signal → Ton erklärt das Wort im selben Text. |
| „Signal“ Transistor | **ersetzen** | Dort bleibt es abstrakt, dazu kommt „verstärken“. Besser: schwacher Strom schaltet starken Strom. |
| „Spule aus aufgewickeltem Draht“ | **vereinfachen** | Der Fachbegriff „Spule“ bringt im Spiel nichts. „viel aufgewickelter Draht“ reicht. |
| „Päckchen“ | **bleibt** | Gutes Bild und nah am echten Begriff „Datenpaket“. Ein Puzzle-Vergleich macht das „Zusammensetzen“ greifbar. |
| Seismograf | **umbauen** | „Den Unterschied zeichnet das Gerät …“ ist abstrakt und verdreht. Stattdessen den Stift zeigen. |
| „Kältemittel“ / „besonderer Stoff“ | **„besonderer Stoff“** | „Kältemittel“ würde der Kernaussage („keine Kälte hinein“) widersprechen und bräuchte eine Erklärung. |

## 3. Befunde je Text mit Vorschlag

Die Zahlen in Klammern sind von Hand gezählt: Zeichen, dann Wörter je Satz.

**Lange Texte (Abschnitt 1)**

- **`invention-camera`**: Ändern wegen „Chip“, „Öffnung“ und der vorsichtigen „Film“-Aussage.
  > Die Kamera ist ein dunkler Kasten mit einem kleinen Loch. Hinten entsteht ein Bild, das auf dem Kopf steht. Früher hielt es ein Film fest, heute ein elektronisches Bauteil. (172; 10/9/10)

  „Früher“ entschärft zugleich den Faktenpunkt Platte/Film.
- **`invention-telescope`**: „Je größer …, desto …“ ist für Kleine schwer. Ein Bild aus dem Alltag hilft.
  > Das Fernrohr hat vorn eine viel größere Öffnung als dein Auge. Wie ein großer Eimer im Regen fängt es mehr Licht auf. So siehst du auch ganz schwache Sterne. (157; 11/11/7)
- **`invention-microscope`**: Satz 3 fängt mit dem Objekt an und ist abstrakt.
  > Das Mikroskop vergrößert in zwei Schritten. Die untere Linse macht ein größeres Bild. Die obere vergrößert es noch einmal wie eine Lupe. (136; 6/7/9)
- **`invention-battery`**: taugt, so lassen.
- **`invention-generator`**: Satz 2 verdreht, „gegeneinander“ abstrakt.
  > Der Generator hat einen Magneten und viel aufgewickelten Draht. Wenn sich der Magnet neben dem Draht bewegt, fließt darin Strom. Ohne Bewegung gibt es keinen Strom. (164; 9/11/6)
- **`invention-transistor`**: Nötig. Hier ist die Erklärung am abstraktesten.
  > Der Transistor ist ein Schalter, den kein Finger drückt. Darin schaltet ein schwacher Strom einen starken an und aus. Viele sind heute kleiner als ein Staubkorn. (161; 9/10/7)

  Für den `fakten-pruefer`: Je nach Bauart steuert eine Spannung statt eines Stroms; das Staubkorn bitte prüfen.
- **`invention-refrigerator`**: taugt. Freiwillig mit glatterer Wortfolge:
  > Der Kühlschrank füllt keine Kälte hinein, er bringt Wärme hinaus. Ein besonderer Stoff in Rohren nimmt innen die Wärme auf. Außen gibt er sie wieder ab. (152; 10/10/6)
- **`invention-bicycle`**: Satz 2 verdreht. „Tritt“ kann auch „Fußtritt“ heißen. „vorn und hinten ein Zahnrad mit Kette“ klingt nach zwei Ketten.
  > Das Fahrrad hat vorn ein großes und hinten ein kleines Zahnrad. Die Kette verbindet sie. Bei jeder Pedalrunde dreht sich das Hinterrad darum mehrmals. (150; 11/4/9)

  Optional dazu „So kommst du schnell voran.“ (178). Für den `fakten-pruefer`: Je nach Gang ist das hintere Zahnrad nicht immer kleiner.
- **`invention-elevator`**: taugt. Die Wippe ist für Kinder ein gutes Bild: Geht die eine Seite hoch, geht die andere runter. Ob sie fachlich stört, entscheidet der `fakten-pruefer`.
- **`invention-seismograph`**: umbauen, siehe oben.
  > Der Seismograf steht auf dem Boden und wackelt bei einem Beben mit. Ein schweres Gewicht darin hängt frei und bleibt fast still. Ein Stift daran malt so eine Zickzacklinie. (170; 12/10/7)
- **`invention-3d-printing`** und **`invention-sewing-machine`**: taugen.

**Kurze Texte (Abschnitt 2)**

- **`invention-light`**: Der Vorschlag passt. „darunter“ ist steif, besser „zum Beispiel Joseph Swan und Thomas Edison“ (etwa 176; 11 Wörter).
- **`invention-car`**: Den Vorschlag übernehmen (160).
- **`invention-railway`**: „Stockton nach Darlington“ sagt Kindern nichts. Besser erklären, wie die Bahn funktioniert:
  > Die Eisenbahn rollt auf glatten Schienen. Darum kann eine Lok viele schwere Wagen ziehen. In England fuhr 1825 eine der ersten Bahnen mit Dampf. (144; 6/8/10)
- **`invention-airplane`**: Der Vorschlag erklärt nicht, wie Fliegen geht.
  > Das Flugzeug hat Flügel, die Luft nach unten lenken. Das drückt es nach oben. 1903 flogen die Brüder Wright mit Motor und konnten dabei lenken. (143; 9/5/11)

  Für den `fakten-pruefer`: Diese Erklärung des Auftriebs ist vereinfacht.
- **`invention-phone`**: „Das reist …, dort …“ sind zwei Hauptsätze nur mit Komma verbunden, und „Das“ ist nicht eindeutig.
  > Das Telefon macht aus deiner Stimme ein elektrisches Signal. Das andere Telefon macht daraus wieder Ton. Viele forschten daran, auch Alexander Graham Bell. (155; 9/7/7)
- **`invention-computer`**: Der Vorschlag ist gut. Freiwillig Satz 3 ohne Verdrehung: „Es gibt nicht den einen Erfinder: Viele haben mitgeholfen.“ (gesamt 174)
- **`invention-internet`**: „Rechner“ halten Kinder leicht für einen Taschenrechner.
  > Das Internet verbindet Geräte auf der ganzen Welt. Eine Nachricht reist darin in vielen kleinen Päckchen. Am Ziel werden sie zusammengesetzt wie ein Puzzle. (156; 8/8/8)
- **`invention-compass`**, **`invention-satellite`**: taugen.
- **`invention-printing`**: taugt. „ließen sich … nutzen“ ist steif, besser „Danach konnte man sie für neue Seiten nutzen.“ (gesamt 176)
- **`invention-rocket`**: taugt. Freiwillig mit etwas zum Ausprobieren:
  > Die Rakete stößt hinten sehr schnell Gas aus. Das schiebt sie nach vorn. Lass mal einen aufgeblasenen Luftballon los: Er saust genauso davon. Das klappt sogar im Weltall. (170; 8/5/10/5)
- **`invention-smartphone`**: „Chips“, „Funk“ ohne Bezug und „vereint“ ändern.
  > Das Smartphone steckt voller Erfindungen. Ein Akku liefert den Strom, winzige Bauteile rechnen. Funk verbindet es ohne Kabel. Programme bestimmen, was es gerade tut. (165; 5/8/5/6)

  Hier stehen weder Zahl noch andere Erfindungsnamen. „Telefon“, „Kamera“ und „Computer“ habe ich bewusst vermieden.

## 4. Einordnung „nötig / empfohlen / taugt“

- **Grundsatz:** Ja, alle 24 sollten mit dem Titel beginnen. Das passt zu den Personen-Texten und zum Test, und es wirkt einheitlich. Wenn der Test alle 24 prüft, sind formal alle 12 alten Texte „nötig“, weil keiner mit dem Titel beginnt.
- **Inhaltlich** (falls nicht alle 24 übernommen werden):
  - `invention-airplane`: **nötig** statt „empfohlen“. Satz 2 hat 14 Wörter und verletzt damit dieselbe Regel, wegen der der Buchdruck „nötig“ ist.
  - `invention-car`: **empfohlen** statt „taugt“ („Teams“ ist Englisch, „Benzinwagen“, „erprobte“, kein Wie).
  - `invention-railway`: **empfohlen** statt „taugt knapp“ (unklare Ortsnamen, „schrittweise“, kein Wie).
  - Die übrigen Einordnungen stimmen.

## 5. Einheitlicher Ton

- Ob die Texte das Kind mit „du“ ansprechen, schwankt (Fernrohr, Fahrrad ja, sonst nein). Empfehlung: „du“ dort einsetzen, wo es natürlich ist (Telefon „deine Stimme“, Rakete „Lass mal …“). Pflicht ist es nicht.
- Muster für alle: verdrehte Satzanfänge in Wenn-Sätze oder Sätze mit Subjekt vorn umbauen, ein Vergleich aus dem Alltag je Text (Eimer, Lupe, Wippe, Puzzle, Luftballon).
- Das Mitmach-Angebot („Lass mal …“) gibt es nur einmal. Es ist nicht nötig, passt aber zum Ziel „schnell etwas tun“.

## 6. Unsicher

- Ich habe nicht mit Skript gezählt. Für meine Vorschläge fehlt noch der Abgleich gegen „Ganz einfach“ und `stages`. Vor dem Einbau bitte `check.mjs` laufen lassen.
- Faktenfragen (Auftrieb, Transistor-Strom, Staubkorn, Zahnradgrößen, „eine der ersten Bahnen mit Dampf“, Wippe) gehören zum `fakten-pruefer`.
- Ob der neue Eisenbahn-Satz mit Dampf „Früher oder heute?“ vorwegnimmt, soll der `stufen-pruefer` entscheiden.
- Ob die Texte bei 320 px und großer Schrift in den Kasten passen, habe ich nicht gemessen; das prüft `design-pruefer` oder `spieltester`.
