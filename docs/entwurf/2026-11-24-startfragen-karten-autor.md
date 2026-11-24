# Zwei Startbild-Fragen kürzer (karten-autor, 24.11.2026)

Anlass: Die Suite `kern-huelle` meldet bei 320 px mit großer Schrift, dass lange Wörter in zwei
Startbild-Fragen über zwei Zeilen laufen („Kommunikationsweg“, „Feuersalamanderlarven“). Seit den
neuen Fotos sind Katta und Feuersalamander Startbilder. Entwurf des `karten-autor`, ungeprüft.

## 1. animal-ring-tailed-lemur (Katta)
- Alt: „Welcher Kommunikationsweg eines Kattas wird gerochen?“
- **Neu:** „Welches Zeichen eines Kattas kann man riechen?“ (7 Wörter, längstes Wort 7 Buchstaben)
- Ausweich: „Welche Botschaft eines Kattas riecht man?“
- „Zeichen“ passt zu allen drei Antworten (Schwanz, Duftmarke, Ruf); nur die Duftmarke riecht man.
- why bleibt. Vorher schon: das why steht wörtlich auch in `learning.benefit`. Freiwilliger Ersatz:
  „Den Schwanz sieht man, den Ruf hört man. Eine Duftmarke riecht man.“

## 2. animal-fire-salamander (Feuersalamander)
- Alt: „Was tragen Feuersalamanderlarven?“
- **Neu:** „Was tragen die Larven des Feuer-Salamanders?“ (6 Wörter, längstes Wort 11 Buchstaben)
- Ausweich: „Was tragen die Larven dieses Salamanders?“ – nicht empfohlen: Die Karte ist Ausgangskarte
  einer Verbindung (`app/world-connections.json`), ihre Frage kann ohne Foto als Verbindungsfrage stehen.
- Bindestrich: amtliche Regel erlaubt ihn zur Gliederung; Duden schreibt sonst „Feuersalamander“.
- why bleibt.

## Fundstellen
- `app/world-catalog.json` (question.prompt), daraus per `pnpm run export:data`:
  `app/world-index.json` (homeQuestion), `exports/content/…`.
- `tests/discovery.test.mjs` verlangt homeQuestion = question.prompt; Browser-Tests lesen die Frage
  aus `world-index.json`, nicht fest im Code.

## Offen (Claude)
- Technische Alternative: `hyphens:auto` oder weiche Trennstriche statt neuer Frage.
- Ob „Feuer-Salamander“ für Kinder in Ordnung ist: `kinder-redaktion`.

## Prüfung kinder-redaktion und Umsetzung (24.11.2026)
- Katta: „Welches Zeichen eines Kattas kann man riechen?“ bestätigt („Zeichen“ kennen Kleine besser als „Botschaft“).
- Katta why neu (Vorschlag kinder-redaktion, erklärt alle drei Antworten, löst die Doppelung mit `learning.benefit`):
  „Den Schwanz sieht man. Den Ruf hört man. Die Duftmarke riecht man.“ – eingebaut.
- Feuersalamander: „Larven“ erklärt die Karte nirgends, „tragen“ klingt schief. Eingebaut:
  „Was haben junge Feuer-Salamander im Bach?“ (knüpft an den Einstieg an: junge Feuersalamander kommen im Bach
  zur Welt, Kiemen außen am Körper). Bindestrich für Kinder in Ordnung; weicher Trennstrich verworfen
  (Risiko bei Vorlesen, Suche, Prüfsuite). Antworten unverändert.
- `kern-huelle` mit der Zwischenfassung („Salamanders“, 11 Buchstaben) grün; die Endfassung hat höchstens 10.
- Weitere Funde auf beiden Karten (Hinweise, wrongReasons, lange Antworten beim Feuersalamander, „Kommunikationsweg“
  in `more`/`observe`): ins BACKLOG (Punkt 27, Durchgang über `questionFeedback` und `challenge-hints.json`).
