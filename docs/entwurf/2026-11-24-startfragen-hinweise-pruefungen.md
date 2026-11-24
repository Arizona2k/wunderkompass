# Prüfung der neuen Startfragen-Texte (Katta, Feuersalamander), 24.11.2026

Geprüft: Entwurf des `karten-autor` in `2026-11-24-startfragen-hinweise-karten-autor.md`. Drei Prüfer haben unabhängig gelesen und nichts geändert: `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer`. Danach hat Claude die Befunde zusammengeführt und die Endfassung noch einmal der `kinder-redaktion` gezeigt (Ergebnis unten).

## fakten-pruefer

**Ergebnis:** Fachlich richtig. Ein Satz ist missverständlich. Statt Wikipedia gibt es eine bessere Quelle.

- **Katta, „aufgerichteter Schwanz“ als falsche Antwort auf „Welches Zeichen kann man riechen?“:** eindeutig falsch, die Begründung „sieht man mit den Augen“ stimmt.
  - Smithsonian National Zoo nennt den Schwanz bei den sichtbaren Zeichen: „they keep their tails raised in the air, like flags, to keep group members together“ (beim Wandern, „when ring-tailed troops travel“).
  - Den Duft auf dem Schwanz („rubbed on the tail and flicked at an opponent“) gibt es nur beim Streit, und dabei wird der Schwanz gewedelt, nicht aufgerichtet.
  - „Riechen kann man ihn nicht“ (alter Vorschlag) wäre falsch gewesen. Es war richtig, ihn nicht zu übernehmen.
  - Vorschlag (freiwillig): „Beim Wandern ist er wie eine Fahne für die Gruppe.“ So steht es in der Quelle, und es grenzt sauber vom Streit ab. Den Streit mit Duft nicht in die Begründung schreiben, das verwirrt Kleine.
- **„Wie eine Fahne“, Ruf, Duftdrüsen:** stimmen (Smithsonian). Kleinigkeit: Es gibt auch Duftdrüsen an der Brust.
- **Katta-Hinweis „Zeig auf deine Nase …“:** stimmt.
- **Feuersalamander, Kiemen außen, verschwinden später, Tiere verlassen das Wasser:** stimmt.
  - Belege: LfU Bayern, Steckbrief Feuersalamander: „Sie atmen durch äußere Kiemen“, „Die Kiemen bilden sich zurück und die nun lungenatmenden Tiere verlassen das Gewässer“. NABU Euskirchen sagt dasselbe. Wikipedia: „äußere Kiemenbüschel“.
  - Nie „nur mit Kiemen“ schreiben, denn größere Larven schnappen zeitweise auch Luft. Der Entwurf vermeidet das.
- **`wrongReasons[1]` „… anders als die Großen an Land“:** missverständlich, als würden die Großen auch unter Wasser atmen. Vorschlag: „… Damit atmen sie unter Wasser. Die Großen an Land haben keine Kiemen mehr.“
- **Hinweis „im Bach“:** vertretbar. Larven leben auch in Quelltümpeln, aber der Bach ist der typische Ort. Die `sourceNote` grenzt schon auf Mitteleuropa ein.
- **Quellen:** Statt Wikipedia das **LfU Bayern** als Behördenquelle (PDF von 2007, das Bezugsjahr gehört in den Nachweis).
- **Nebenbefund:** Smithsonian nennt Kattas „endangered“. In der nächsten Tierwelt-Runde gegen die Rote Liste der IUCN prüfen (BACKLOG Punkt 27).

## kinder-redaktion

**Ergebnis:** Kindgerecht. Beide Hinweise verraten die Lösung nicht. Eine Änderung ist nötig.

- **Feuersalamander, durchgehend:** „die Jungen“ hören Kinder als „die Jungs“, vor allem beim Vorlesen. Besser „junge Salamander“, wie im neuen Fragesatz. Das betrifft den Hinweis und beide „warum nicht“-Sätze.
- **Katta `wrongReasons[0]`:** Der Rückbezug zur Frage fehlt. Vorschlag: „Gesucht ist ein Zeichen für die Nase.“ anhängen, so ist der Satz gleich gebaut wie `[2]`.
- **In Ordnung:** Katta-Hinweis, Katta `wrongReasons[2]`, Feuersalamander-Fragesatz und `why`.
- **Gesehen, aber nicht Teil des Auftrags:** Die `paragraphs` des Feuersalamanders sind weiter schwer („strukturreichen“, „Larvengewässer“). Das gehört in den Tierwelt-Durchgang (BACKLOG Punkt 27).

## stufen-pruefer (Entdecker)

**Ergebnis:** Beide Fassungen passen zu Entdecker. Kein Hinweis nennt die Lösung oder passt auf eine falsche Antwort. Nach dem Abgleich mit `tests/challenge.test.mjs` bestehen beide Hinweise den Test (der Test selbst lief beim Prüfer nicht).

- **Katta-Hinweis:** Er ist in Ordnung, wiederholt aber fast nur die Frage. Vorschlag: „Zeig auf deine Augen, dann auf deine Ohren, dann auf deine Nase. Welches Zeichen passt zur Nase?“ Das Kind ordnet so jede Antwort selbst einem Sinn zu. Der Vorschlag verrät nicht zu viel.
- **Feuersalamander-Hinweis:** gut. Auch die falsche Antwort „Keine Kiemen“ nennt Kiemen, das Kind muss also noch entscheiden.
- **Alle anderen Texte:** in Ordnung.
- **Unsicher:** Ob 5- bis 6-Jährige den Katta-Hinweis als Hilfe erleben, klären nur echte Kinder.

## Entscheidung (Claude)

Übernommen, weil sich die Vorschläge nicht widersprechen und keiner den Inhalt umbaut:

| Text | Endfassung | Grund |
|---|---|---|
| Katta `hint` (auch `animal-ring-tailed-lemur:mini`) | „Zeig auf deine Augen, dann auf deine Ohren, dann auf deine Nase. Welches Zeichen passt zur Nase?“ | stufen-pruefer: ordnet die Antworten den Sinnen zu |
| Katta `wrongReasons[0]` | „Einen aufgerichteten Schwanz sieht man mit den Augen. Beim Wandern ist er wie eine Fahne für die Gruppe. Gesucht ist ein Zeichen für die Nase.“ | fakten-pruefer („Beim Wandern“) und kinder-redaktion (Rückbezug) |
| Katta `wrongReasons[2]` | bleibt wie im Entwurf | alle einverstanden |
| Feuersalamander `prompt`, `why` | bleiben wie im Entwurf | alle einverstanden |
| Feuersalamander `hint` (auch `animal-fire-salamander:mini`) | „Junge Salamander leben im Bach unter Wasser. Womit kann ein Tier dort atmen?“ | kinder-redaktion („Jungen“ klingt wie „Jungs“) |
| Feuersalamander `wrongReasons[1]` | „Junge Salamander haben Kiemen. Damit atmen sie unter Wasser. Die Großen an Land haben keine Kiemen mehr.“ | kinder-redaktion und fakten-pruefer |
| Feuersalamander `wrongReasons[2]` | „Junge Salamander sehen noch anders aus als die Großen. Später verwandeln sie sich und verlieren ihre Kiemen.“ | kinder-redaktion |
| Feuersalamander `sources` | neu: „LfU Bayern · Feuersalamander (Steckbrief, 2007)“ | fakten-pruefer: Behörde statt Wikipedia |

Die Antworttexte bleiben unverändert (Kinder können sie gespeichert haben). Das Ratemuster „kurze richtige gegen lange falsche Antwort“ beim Feuersalamander bleibt bis zum Tierwelt-Durchgang offen (BACKLOG Punkt 27).

## Endfassung, Nachlese der kinder-redaktion

Alle sieben Texte der Endfassung sind in Ordnung, keine weiteren Änderungen. Das „Jungs“-Missverständnis ist in allen drei Texten behoben. Dass das Ende der Kiemen in `wrongReasons[1]`, `wrongReasons[2]` und `why` vorkommt, ist kein echtes Doppeltes: Nach einer falschen Antwort sieht das Kind nur eine dieser Zeilen und danach die Erklärung.

## Einbau

Eingebaut in `app/world-catalog.json`, `app/challenge-hints.json` (beide `:mini`-Hinweise wortgleich) und `app/animal-inquiries.json` (`sourceUrls` des Feuersalamanders, der Test verlangt dieselben Quellen wie auf der Karte), danach `pnpm run export:data`.
