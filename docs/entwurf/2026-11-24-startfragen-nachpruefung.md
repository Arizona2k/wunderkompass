# Nachprüfung der zwei Startfragen Katta und Feuersalamander (24.11.2026)

Anlass: Die Fragesätze wurden im Bilder-Strang gekürzt (Wortlänge bei 320 px). Antworten, Erklärung und Hinweise sind älter und waren nicht neu geprüft. Helfer melden nur, sie ändern nichts.

## `stufen-pruefer`

Gelesen: `app/world-catalog.json` (`question`, `intro`, `questionFeedback`, `paragraphs`), `app/challenge-hints.json` (`…:mini`), `tests/fixtures/gespeicherte-antworten*.json`. Beide Antwortsätze stehen schon in allen drei Listen; eine Änderung am Antworttext kostet einen neuen Listeneintrag. Die Startkachel (`app/discovery-central.tsx`) zeigt nur den Fragesatz. Beide Fragesätze halten die Wortgrenze ein („Feuer-Salamander“ bricht am Bindestrich).

### Katta – Fragesatz und Antworten können bleiben, Hinweis ändern

- **Wortanker:** „riechen“ in der Frage, „Duft“ in der richtigen Antwort. Lösbar über die Sprache allein; für Entdecker vertretbar (Sinne zuordnen), keine Knobelei. Leichtes Längenmuster (richtige Antwort die kürzeste), kaum auffällig.
- **Machbarkeit:** für 5- bis 7-Jährige mit Elternteil gut machbar.
- **Erklärung:** passt genau (Sehen, Hören, Riechen).
- **Hinweis (`challenge-hints.json` und `questionFeedback.hint`) – echter Befund:** „Überlege, welche Mitteilung auch ohne Licht wahrgenommen werden könnte …“ führt in die Irre (einen Ruf nimmt man im Dunkeln ebenso wahr) und ist zu schwer („wahrgenommen“, „Sinneswege“).
- **Einstieg:** `intro` spricht nur vom Schwanz, die Frage vom Duft – verschenkte Verbindung.
- **Vorschlag jetzt (kein Antworttext betroffen):** Hinweis an beiden Stellen „Zeig auf deine Nase. Welche Antwort passt zur Nase?“
- **Vorschlag später (mehr Denken):** Fragesatz „Welches Zeichen bleibt da, wenn der Katta weg ist?“ mit Erklärung „Schwanz und Ruf sind weg, wenn der Katta geht. Die Duftmarke bleibt am Ast. Andere Kattas riechen sie noch.“ – vorher `fakten-pruefer` (Duftmarke am Ast, Drüsen am Handgelenk).

### Feuersalamander – Fragesatz in Ordnung, Antworten später ändern

- **Starkes Ratemuster:** richtige Antwort 14 Zeichen, falsche 66 und 61, beginnen mit „Keine …“/„Schon alle …“ und übertreiben („genau wie“, „alle“, „ohne“). Gleiches Muster bei weiteren Tierkarten (Biber „ausschließlich“, „immer“; Grasfrosch „sofort“) – Befund für die ganze Tierwelt.
- **Machbarkeit:** richtige Antwort gut zu erinnern (Intro sagt fast dasselbe, für Entdecker erlaubt); falsche Antworten zu schwer zum Vorlesen („Merkmale“, „Verwandlung“, Semikolon, Nebensätze) – Kinder wählen nach Länge.
- **Erklärung:** passt nur halb; es fehlt, dass die Kiemen später verschwinden.
- **Hinweis:** „Achte auf das Entwicklungsstadium …“ zu abstrakt.
- **Vorschlag Antworten (später, mit der Tierwelt):** kurz und gleich gebaut, je ein Körperteil: „Äußere Kiemen.“ (bleibt) / „Eine harte Schale.“ / „Schwimmflossen wie ein Fisch.“ („Einen Schwanz mit Flosse.“ nur nach `fakten-pruefer`, Larven haben einen Flossensaum.)
- **Vorschlag Erklärung (sofort möglich):** „Die Larven atmen im Bach mit Kiemen außen am Körper. Später verschwinden die Kiemen. Dann leben die Tiere an Land.“ – `fakten-pruefer` bestätigen lassen.
- **Vorschlag Hinweis (sofort möglich):** „Schau dir die Larve an: Womit atmet ein Tier unter Wasser?“

### Dringlichkeit laut Helfer

1. Katta-Hinweis ersetzen (führt in die Irre) – der einzige Befund, der Kindern heute schadet.
2. Erklärung und Hinweis beim Feuersalamander – billig, nicht nötig.
3. Später mit der Tierwelt: Antworten beim Feuersalamander, in einem Durchgang alle Tierkarten auf „kurze richtige gegen lange übertriebene falsche Antwort“ prüfen; ggf. Katta-Fragesatz ohne Wortanker.

Unsicher: ob Kleine wirklich nach Länge raten (nur mit echten Kindern klärbar); Ton der neuen Hinweise soll die `kinder-redaktion` lesen.

## `kinder-redaktion`

**Gesamteindruck:** Katta gut (kurz, gleich gebaute Antworten, Erklärung passt genau). Feuersalamander „geht so“: richtige Antwort gut, beide falschen lang und sperrig, sagen fast dasselbe, Ratemuster „kurz = richtig“. Alle sechs Antworttexte stehen schon in `tests/fixtures/gespeicherte-antworten*.json`.

### Katta – kann so bleiben

- Fragesatz klar, ohne Fachwort. Antworten kurz und gleich gebaut; die erste ist eine gute Falle (das Intro zeigt den hochgestreckten Schwanz). Keine Änderung nötig.
- `why` sehr gut. Freiwillig (nach `fakten-pruefer`): „… Kattas reiben ihren Duft an Zweige.“
- **`questionFeedback.hint` (jetzt):** „Überlege, welche Mitteilung auch ohne Licht wahrgenommen werden könnte …“ führt in die Irre (Ruf hört man auch im Dunkeln), schwere Wörter. Vorschlag: „Sehen, hören, riechen: Welcher Sinn passt zu welchem Zeichen?“
- `wrongReasons[0]` „Der Geruchssinn benötigt andere Informationen.“ steif → „Den Schwanz kann man sehen. Riechen kann man ihn nicht.“
- `wrongReasons[2]` → „Einen Ruf hört man. Gefragt ist, was man riecht.“

### Feuersalamander – geht so

- Fragesatz gut. **Schreibweise:** Bindestrich erlaubt, wirkt neben dem Titel „Feuersalamander“ uneinheitlich. Wege: (a) weiches Trennzeichen `Feuer­salamander` (vorher Vorlesen, Suche, Tests prüfen) oder (b) „Was haben junge Salamander im Bach?“.
- **Antworten:** Ratemuster (2 gegen 10 und 8 Wörter), Semikolon, „Merkmale“, „Verwandlung“, „ohne spätere …“ abstrakt und verneint; beide falschen Antworten sagen „wie die Erwachsenen“ (nur eine falsche Idee); Antwort 2 setzt Wissen voraus, das nirgends steht. „Äußere Kiemen“ darf bleiben (Intro erklärt es).
- **Vorschlag Antworten:** „Äußere Kiemen.“ / „Keine Kiemen. Sie atmen wie die Großen.“ / „Schon alles wie die Großen.“ – oder mit echter zweiter Idee: „Äußere Kiemen.“ / „Schon Lungen wie die Großen.“ / „Ein dickes Fell.“ (Lunge vom `fakten-pruefer` prüfen). **Dringlichkeit:** später mit der Tierwelt.
- **`why` (jetzt, leicht):** „Larven“ im Intro nicht erklärt, „überwiegend“ schwer, Satz über den Wald antwortet nicht auf die Frage. Vorschlag: „Junge Feuersalamander atmen im Bach mit Kiemen. Die Kiemen sitzen außen am Kopf, wie kleine Büschel. Später verlieren sie die Kiemen und gehen an Land.“ Freiwillig für Große: „Man nennt die Jungen Larven.“
- **`questionFeedback.hint`:** „Achte auf das Entwicklungsstadium: Ein Merkmal der im Wasser lebenden Larve …“ zu schwer. Vorschlag: „Junge Salamander sehen anders aus als die Großen. Was brauchen sie unter Wasser?“
- `wrongReasons[1]` → „Im Bach brauchen die Jungen Kiemen. Ohne Kiemen könnten sie dort nicht atmen.“; `wrongReasons[2]` → „Die Jungen sehen noch anders aus als die Großen. Erst später verlieren sie ihre Kiemen.“
- Fundstellen: `app/world-catalog.json` Katta ab Zeile 12114, Feuersalamander ab 13382; `app/challenge-hints.json` Zeile 933 und 988 (wortgleich mit `questionFeedback.hint`, beide Stellen zusammen ändern).
- Unsicher: Sachfragen für den `fakten-pruefer` (Kiemen „außen am Kopf, wie kleine Büschel“, Lunge bei Larven, Duftreiben der Kattas); weiches Trennzeichen nicht geprüft; ob die richtige Antwort oft an erster Stelle steht (Frage für den `stufen-pruefer`).

## Entscheidung (Claude)

**Nachtrag (24.11.2026, auf Wunsch des Nutzers):** Katta-Hinweis und Feuersalamander (`why`, Hinweis, `wrongReasons`, Fragesatz) sind doch noch in diesem PR behoben: Der `karten-autor` hat neu geschrieben ([Entwurf](2026-11-24-startfragen-hinweise-karten-autor.md)), drei Prüfer haben gelesen ([Prüfungen und Endfassung](2026-11-24-startfragen-hinweise-pruefungen.md)). Offen bleiben die Antworttexte (Ratemuster) und der Durchgang über alle Tierkarten.

Ursprüngliche Entscheidung: Alle Befunde betreffen ältere Texte (Antworten, Erklärung, Hinweise), nicht die Änderung dieses PR. Sie kommen nicht mehr in den Bilder-Strang-PR, sondern als erstes Paket in BACKLOG Phase 1, Punkt 27 (Hinweise und Rückmeldungen auf Tierkarten zu schwer): dort schreibt der `karten-autor` die Fassungen (Regel: ein Schreib-Helfer für alle Kindertexte), danach `fakten-pruefer`, `kinder-redaktion`, `stufen-pruefer`. Zuerst der Katta-Hinweis (führt in die Irre), dann Feuersalamander (`why`, Hinweis, `wrongReasons`), dann in einem Durchgang alle Tierkarten auf das Muster „kurze richtige gegen lange übertriebene falsche Antwort“ (Biber, Grasfrosch u. a.).
