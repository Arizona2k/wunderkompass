# Kinder-Redaktion, letzte Runde Tier-PR

Neun Punkte Kann, dazu ein Muss und ein Sollte. Gesamturteil: **mit Änderungen**. Bei den Tier-Auflösungen gibt es nichts mehr zu ändern. Die Punkte betreffen die zwei neuen Clownfisch-Hinweise und den Einstieg der Benz-Karte.

> Helferbericht (kinder-redaktion, opus), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

`git diff 675f17b..HEAD` konnte ich nicht ausführen, weil ich keine Shell habe. Verglichen habe ich darum die aktuellen Dateien im Worktree mit meinem letzten Bericht und mit `2026-11-25-tier-aufloesung-endfassung-2.json`.

## 1. Tier-Auflösungen: sauber umgesetzt

- **Muss-Punkte:** T4 Giraffe, T22 Walross und T23 Feuersalamander stehen jetzt wörtlich in meiner Fassung. Bei T22 hat Satz 2 genau 13 Wörter, und das „es“ zeigt klar auf das Walross.
- **Sollte-Punkte:** T29 und T12 Rotfuchs sind wörtlich übernommen. Das Rätsel sagt „landen“, die Auflösung „taucht“, damit ist der Widerspruch weg.
- **Kann-Punkte:** T8, T27, T11, T17a, T6 und T26b sind umgesetzt. T9 und T21 haben die Fassung des fakten-pruefers bekommen, auch das passt.
- **Regeln:** Ich habe nachgezählt. Keine geänderte Auflösung hat mehr als 13 Wörter in einem Satz oder mehr als eine Zahl, keine nennt ein anderes Spieltier, und kein Rätselsatz kommt doppelt vor. Die Längen sind geschätzt, alle deutlich unter 180 Zeichen.
- **Kann, T21 Clownfisch:** In „Die haben Nesseln wie eine Qualle.“ erinnert das Wort „Nesseln“ an die Brennnessel. Das ist genau die Verwechslung mit einer Pflanze, die die Hauptfrage abbauen will. Weil Kinder „Nesseln“ als „brennt“ verstehen, ist es tragbar. Wenn ihr etwas ändern wollt: „Die können brennen, ähnlich wie bei einer Qualle.“ Das „können … ähnlich“ greift den Einwand des fakten-pruefers zur Stärke auf.

## 2. Kartenkorrekturen

**Sollte**
- **`person-karl_benz` intro:** „Übertragung des Antriebs“ ist ein Fachwort im Einstieg und wird nicht erklärt. Außerdem steht „Motor, Übertragung … zusammenpassen“ gleich danach noch einmal in `paragraphs[1]`. Beim Vorlesen hört das Kind es also zweimal. Der Einstieg weckt auch keine Neugier.
  → „Wie fährt ein Wagen ohne Pferd? Carl Benz baute eines der ersten Autos mit Benzinmotor.“
  Diese Tatsache steht schon geprüft in `world-connections.json`. Die Frage nach dem Pferd verknüpft die Karte mit dem Einstieg von `invention-car`.

**Kann**
- **`invention-light` more[0] und stages[2]:** In „In den USA bauten …“ ist USA eine Abkürzung. → „In Amerika bauten Thomas Edison und sein Team Lampen, die lange leuchteten.“
- **`invention-light` parts[1] „Glühfaden“:** Das Wort „klassischen“ ist für Kleine abstrakt. → „Wird in der alten Glühlampe heiß und leuchtet.“
- **Ohne Befund:** `invention-elevator` mit paragraphs[0], counterweight, stages[2] und wrongReasons[2] ist stimmig. „halb voll“ passt in allen drei Stellen zusammen. `invention-car` ist mit „Carl“ in Ordnung. Bei `invention-light` passen stages[3], die Überraschung mit dem Faden als Brücke zu „Glühfaden“ und das Kohlestück aus der Faktenvorgabe ohne Bruch zusammen.

## 3. Verbindungen und Spiel-Auflösung

- **Kann, Verbindung Benz → Auto:** Der erste Satz hat 14 Wörter. → „1886 bekam Carl Benz ein Patent für seinen Motorwagen. Das ist eine Art Schutzbrief für Erfindungen.“
- **Kann, Verbindung Benz → Bertha:** Satz 1 hat 15 Wörter, und „Entwicklung“ ist abstrakt. → „Bertha Benz gab Geld für den Motorwagen ihres Mannes Carl. Sie half auch bei der Arbeit daran. 1888 fuhr sie damit mit ihren zwei Söhnen von Mannheim nach Pforzheim.“
- **`world-game-support.mjs`, Benz-Auflösung:** Gut so. „Ingenieur, also ein Fachmann für Technik“ und „Andere durften … nicht einfach nachbauen“ erklären die Begriffe kindgerecht. Kein Satz hat mehr als 13 Wörter, es steht nur eine Zahl darin, und das Ganze hat etwa 167 Zeichen.

## 4. Zusatzauftrag: Hinweise zum Clownfisch

**Muss, für beide Vorschläge:** „Eine Blume kann nichts fangen“ stimmt so nicht, und „Kann das eine Blume?“ führt zur selben Frage. Ein 9-Jähriger, der die Venusfliegenfalle oder den Sonnentau kennt, sagt sofort „doch!“. Der Hinweis stimmt dann nicht mehr. Ein Kind, das die Ausnahme kennt, wird eher verwirrt als geführt.

Besser ist ein Merkmal ohne Ausnahme: Die Seeanemone hat in der Mitte einen Mund. Eine Pflanze hat das nie. Diese neue Tatsache muss der fakten-pruefer kurz bestätigen.

Dazu ein **Sollte:** Beide Vorschläge sagen fast dasselbe, nämlich „fängt“ und „Fangarme“. Sie sollten sich unterscheiden und im zweiten Schritt etwas deutlicher werden. Beide Fassungen unten verraten die Lösung nicht. Sie sprechen nur gegen die Pflanze, zwischen „Teil des Fisches“ und „anderes Tier“ muss das Kind weiter selbst wählen.

- **`questionFeedback.hint`:** „Eine Seeanemone sieht aus wie eine Blüte. Doch in ihrer Mitte hat sie einen Mund. Hat eine Blume einen Mund?“
- **`challenge-hints.json`, steps[0]:** „Die Seeanemone fängt mit ihren Fangarmen kleine Tiere. Dann schiebt sie das Futter in ihren Mund.“

**Abstand zur Tier-Auflösung:** Der ist ausreichend. Die Auflösung spricht über Schleim, Nesseln und die Qualle, die Hinweise über Mund und Fangen. Die Qualle bitte nicht in die Hinweise übernehmen, sonst doppelt es sich.

Am Rande, unverändert: Das Intro der Karte („und die ist auch ein Tier“) und paragraphs[0] verraten die Lösung schon. Das hat der stufen-pruefer bereits festgehalten.

## 5. Unsicher und für später

- **Doppelter Text bei Licht:** more[0] und stages[2] sind wortgleich. Ob beide auf derselben Ansicht stehen und das Kind den Text zweimal liest, konnte ich nicht sehen.
- **Licht, Problemsatz:** Das intro und Antwort 0 sagen „nur mit Feuerlicht oder anderen Lampen“. Das klingt, als gäbe es Lampen ohne Flamme, während `why` sagt: „Ihr Licht kam aus Flammen.“ Vorschlag für den BACKLOG-Schritt „Erfindungs- und Personenkarten kindgerecht“: „Nach Sonnenuntergang gab es nur Licht von Flammen.“ Dabei muss der Antworttest mit angepasst werden.
- **Benz `question.prompt`:** Dort steht noch „Karl (Carl) Benz“ wie im Titel. Ich nehme an, das hängt an derselben Design-Entscheidung, und melde es darum nicht als Befund.
- **Clownfisch-Hinweise:** Der fakten-pruefer prüft „Mund in der Mitte“ und „fängt kleine Tiere“.

## Gelesene Dateien (nichts geändert)

- `/home/user/wunderkompass/docs/entwurf/2026-11-25-tier-aufloesung-nachtrag-kinderredaktion.md`
- `/home/user/wunderkompass/docs/entwurf/2026-11-25-tier-aufloesung-endfassung-2.json`, per Suche
- `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/wt-tier/docs/entwurf/2026-11-25-tier-aufloesung-nachtrag-fakten-2.md`
- Im Worktree `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/wt-tier/app/`:
  - `world-game-tier-aufloesung.json`, ganz
  - `animal-detective-clues.json`, per Suche
  - `world-catalog.json`: person-karl_benz, invention-light, invention-car, invention-elevator, animal-eastern-clown-anemonefish
  - `world-connections.json`, die Benz-Stellen
  - `world-game-support.mjs`, die Benz-Stelle
  - `challenge-hints.json`, die Clownfisch-Stelle
- Im Worktree `world-index.json`, nur per Suche nach „Karl“. `world-photos.json` habe ich nicht gelesen, weil dort keine Kindertexte stehen.
