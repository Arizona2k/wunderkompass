# Entscheidungen aus der Nachprüfung der ⚠-Stellen (25.11.2026)

Gilt für PR 3: „Sortiere die Zeit“ (Endfassung 2) und den Experten-Nachtrag „Stimmt das wirklich?“. Grundlage sind drei Berichte von heute:
- [Kinder-Redaktion](2026-11-25-sortiere-und-nachtrag-kinderredaktion-nachpruefung.md)
- [Stufen-Prüfung](2026-11-25-sortiere-und-nachtrag-stufenpruefung-nach.md)
- [Fakten-Prüfung](2026-11-25-sortiere-und-nachtrag-faktenpruefung-nach.md)

Claude hat entschieden. Beim Einbau gilt dieser Stand, nicht der Wortlaut in den Endfassungen.

## Stimmt das wirklich?, `pilze-3`

Drei Prüfer haben unabhängig voneinander Befunde gemeldet. Darum wird die Frage in einem Zug neu gefasst.

- **Frage** (Muss, Stufen B7 und Kinder B7): Beide Lebewesen werden gleich neutral eingeführt. Kein „wachsen“ und kein „er“ in der Frage:
  „In einem dunklen Keller steht ein Topf mit Basilikum. Daneben steht eine Kiste Kompost mit Champignons. Was passiert in den nächsten Wochen?“
  - „in den nächsten Wochen“ bleibt (Fakten B7).
  - Die Ausweichfrage „lange im Dunkeln“ wird nicht genommen: Nach langer Zeit wären auch die Pilze am Ende.
- **Antworten** (Muss, Fakten B8): „weiter“ wird zu „gut“. Pflanzen wachsen im Dunkeln nämlich zunächst weiter, nur lang, blass und schwach.
  - richtig: „Das Basilikum wird schwach, die Pilze wachsen gut“
  - „Die Pilze werden schwach, das Basilikum wächst gut“
  - „Das Basilikum und die Pilze werden beide schwach“
  - „Das Basilikum und die Pilze wachsen beide gut“
  - `correct` und `wrongReasons` werden mitgeändert. Danach `tests/ratemuster.test.mjs` laufen lassen.
- **`why`:**
  - Statt „Es wird blass und schwach“ steht: „Es wird schwach. Neue Triebe sind blass und dünn.“ (Fakten B10, fängt B8 auf.)
  - Dazu kommt der Satz der Kinder-Redaktion (B10): „Die feinen Pilzfäden darin zerlegen ihn und holen sich Nahrung.“
- **Tipps** (Soll, Stufen B11):
  - Tipp 1: „Überleg für jedes Lebewesen einzeln: Woher kommt seine Nahrung?“
  - Tipp 2: „Champignons haben keine grünen Blätter. Wovon leben sie dann?“

## Stimmt das wirklich?, `luft-3`

- **`why`, Satz 3** (Kinder B2): Die Kinder-Redaktion schlägt „Die Luft drinnen drückt nun stärker und dehnt sich aus.“ vor. Die Fakten-Prüfung lobt aber, dass der heutige Satz *nicht* behauptet, der Druck innen steige. Beim Einbau darum so fassen, dass der Vergleich mit draußen bleibt: „Die Luft drinnen drückt nun stärker als die Luft draußen und dehnt sich aus.“ Den Wortlaut gegen beide Berichte lesen.
- **Tipp 2:** Der Luftballon wird „sanft“ zusammengedrückt (Hinweis der Fakten-Prüfung B3: Fest gedrückt kann er platzen).
- **Unterlagen:** Den Satz in der Endfassung B, Zeile 83, richtigstellen (Stufen, Kann): „Umgekehrt nimmt `wasser-4` in `luft-3` höchstens die Wärme-Falle weg; das ist vertretbar.“

## Sortiere die Zeit

- **A2/A3 Tipps** (Kinder): „Flugzeuge flogen damals schon über 20 Jahre mit Benzin.“ und „Autos fuhren damals schon lange mit Benzin.“ Die Fakten-Prüfung hält beide Inhalte für richtig (23 und 40 Jahre).
- **A5** (Kinder, Kann): „Mikroskop-Bildern“ nur, wenn der Satz dadurch kürzer wird; sonst bleibt der Wortlaut.
- **A11 `vChrErklaerung`:** Den Vorlese-Hinweis der Kinder-Redaktion übernehmen.
- **A12 Zeitwort „vor weniger als 100 Jahren“:** bleibt. Der `spieltester` beobachtet es in der Rolle „6 Jahre, mit Vorlesen“.
- **A13 Ende der Runde:**
  - Wortlaut (Kinder): „Diese Runde ist zu Ende. Den Spielstempel gibt es, wenn du beide Rätsel ohne „Lösung zeigen“ schaffst. Willst du gleich noch eine Runde spielen?“
  - Einbau-Regel (Stufen, Soll): Kommt am Ende der Runde der Vorschlag „leichter“, erscheint zuerst nur er. Bei „Nein, ich bleibe“ folgt der Satz ohne Stempel. Bei „Ja, leichter spielen“ entfällt er, und eine neue Runde auf der leichteren Stufe startet.
- **Tipp 2 in der Ziehung ohne Fernrohr und Mikroskop** (Stufen, Kann): Der schon geprüfte Dampflok-Tipp kommt vor die Vorlage: `{"braucht":["zeit-dampfmaschine","zeit-eisenbahn"],"text":"Was musste es geben, damit eine Dampflok fahren kann?"}`. Den Hooke-Buch-Tipp hängen wir nicht an.
- **Profi-Ziehregel** (Stufen, Kann): weiche Regel „Je Runde hat mindestens ein Rätsel ein Paar unter 132 Jahren.“ So bestehen Runden nicht nur aus weit auseinanderliegenden Teilen.
- **Hinweis ohne Handlung:** Auch „vor 100 bis 200 Jahren“ altert (Aufzug 1854 fällt 2055 heraus). In die offenen Punkte der Endfassung schreiben.

## Offen für später

- Telefon/Auto (10 Jahre, ohne Tipp in 2 von 5 Ziehungen „motoren“) auf Experte: Der `spieltester` beobachtet, ob dort geknobelt oder geraten wird.
