# Personen-Rätsel: letzte Prüfung der Kinder-Redaktion

Helfer: kinder-redaktion (opus / high), 25.11.2026. Nur Befunde, ändert nichts.

Gelesen habe ich `/home/user/wunderkompass/docs/entwurf/2026-11-25-personen-raetsel-endfassung.md` (Abschnitte 1, 3 und 6), meine Nachprüfung `/home/user/wunderkompass/docs/entwurf/2026-11-25-personen-raetsel-nachpruefung-kinderredaktion.md` und dazu die Namens- und Fürwortregel in `/home/user/wunderkompass/tests/world-game-learning-copy.test.mjs` (Z. 59–72). Dateien habe ich keine geändert. Die Wörter habe ich von Hand gezählt.

**Gesamteindruck: gut.** Fünf von sechs Stellen passen. Bei Einstein muss Satz 1 geändert werden: Er hat 14 Wörter und bricht damit die Regel „Satz 1 höchstens 13 Wörter“. Das Prüfskript aus Abschnitt 1 hätte das melden müssen, also bitte das Skript nachsehen. Bei Mandela ist eine Kleinigkeit freiwillig.

### Die einzelnen Stellen

- **Einstein, Satz 1: Muss.** „Diese Person spielte im Kopf genau durch, was mit Licht, Raum und Zeit passiert.“ hat 14 Wörter. Dazu kommt das trennbare Verb „spielte … durch“: Sechs Wörter stehen dazwischen, und ein kleines Kind hört zuerst „spielte im Kopf“.
  - Vorschlag: „Diese Person stellte sich vor, was mit Licht, Raum und Zeit passiert.“ (12 Wörter, mit „genau“ 13)
  - Grund: „Sich etwas vorstellen“ kennen Kinder aus dem Alltag, und gemeint ist dasselbe, nämlich Denken statt Messen. Der Satz enthält keinen Namensteil und kein Fürwort.
  - Bewusst nicht „Versuche im Kopf“: Ibn al-Haytham hat schon „Mit Versuchen … Licht“. Das würde die beiden wieder näher zusammenrücken, obwohl der stufen-pruefer sie trennen wollte.
- **Einstein, Satz 2: passt.** „Für eine Arbeit über Licht bekam diese Person den Nobelpreis des Jahres 1921.“ hat 13 Wörter. Den Satz lesen nur Profis (meist ab 8). Der Genitiv „des Jahres 1921“ klingt etwas steif, ist aber verständlich und stimmt in der Sache. „Für das Jahr 1921“ wäre ein Wort länger und nicht besser.
- **Mandela, Satz 3: passt, Teilen ist freiwillig.** „1994 durften zum ersten Mal alle Erwachsenen wählen, und danach führte diese Person das Land.“ hat 15 Wörter. Die Reihenfolge ist klar, und den Satz lesen nur Profis.
  - Kann: „1994 durften zum ersten Mal alle Erwachsenen wählen. Danach führte diese Person das Land.“ (8 und 6 Wörter)
  - Grund: Zwei kurze Sätze liest ein Kind leichter allein. „Danach“ steht dann vorn und macht die Abfolge deutlich. Das Rätsel hätte damit vier Sätze. Ich habe keine Regel gefunden, die das verbietet. Wenn es eine gibt, bleibt der Satz wie er ist.
- **Berners-Lee, Satz 1: passt.** „Diese Person entwickelte das Web: Seiten im Internet, die miteinander verbunden sind.“ hat 12 Wörter. Das englische „Web“ wird gleich danach erklärt, das ist in Ordnung. Der Stolperer „Links“ ist weg.
- **Murasaki, Satz 2: passt.** „Die Geschichte ist etwa 1000 Jahre alt und spielt am Hof des Kaisers.“ hat 13 Wörter. „Spielt“ im Sinn von „findet statt“ ergibt sich aus dem Zusammenhang. „Hof“ kennen Kleine eher als Bauernhof, aber „am Hof des Kaisers“ ist eine feste Wendung und passt zur Karte („Kaiserhof“).
  - Hinweis an den stufen-pruefer: Cai Lun hat in Satz 2 ebenfalls „an den Hof des Kaisers“. Auf Profi könnten beide nebeneinander stehen. Japan und China trennen sie klar, ich sehe darum kein Problem, nur ein Echo.
- **Cai Lun, „dieses Papier“: passt.** „Dieses“ zeigt eindeutig auf „besseres Papier“ in Satz 1. Es klingt nicht nach „neu erfunden“ und wiederholt kein Wort.
- **Entdecker-Tipp: passt.** „Kennst du einen der Namen? Überlege: Hat dieser Mensch so etwas gemacht?“ hat 12 Wörter, kurze Sätze und eine einzige Denkfrage. Er funktioniert vor der ersten Antwort (der Mensch ist dann der bekannte Name) und nach einer falschen (dann ist es die gewählte Person). Er verrät die Lösung nicht.

### Vorschlag für `more`

Nichts. Es geht hier um Rätseltexte, nicht um Karten.

### Unsicher

- Ob es eine Regel für die Zahl der Sätze je Rätsel gibt. Davon hängt der Kann-Vorschlag bei Mandela ab.
- Ob Einsteins neuer Satz 1 fachlich genauso trägt wie „spielte im Kopf genau durch“. Das soll der fakten-pruefer bestätigen. Ob er sich gegen Leavitt, Payne-Gaposchkin und Ibn al-Haytham abgrenzt, prüft der stufen-pruefer.
- Den echten `pnpm test` habe ich nicht laufen lassen.
