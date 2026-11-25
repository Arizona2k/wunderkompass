# Stufen-Prüfung, letzte Runde Tier-PR (nur Änderungen seit 675f17b)

> Helferbericht (stufen-pruefer, opus), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

Ich habe nichts im Projekt geändert. Drei Rechenskripte liegen im Scratchpad (nur gelesen und gezählt):
- /tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/food.mjs
- /tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/inv.mjs
- /tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/rm.mjs

**Gesamturteil:** Ich finde nichts, was vor dem Merge geändert werden muss. Das Ratemuster bleibt weg: „Fleisch“ ist in 152 Profi-Aufgaben die einzige Fleisch-Antwort und davon 101-mal richtig (Quote 0,66). Bei „Pflanzen“ ist es 191 von 290, also auch 0,66. Die Grenze liegt bei 0,8; gerechnet mit den 120 festen Startwerten des Tests. Bei der Giraffe macht der Tausch gegen „Krill“ den Sinn von Vorschlag A aber wieder zunichte. Beim Aufzug ist ein Satz in `wrongReasons[2]` unlogisch.

### 1. Fallen `nahrung`
Alle Listen sind lang genug (Profi mindestens 4, Entdecker mindestens 3; ich habe alle 48 Tiere gezählt). Keine richtige Antwort fällt durch ihre Länge auf.

**Sollte**
- **Giraffe, Profi, „Krill“:** Für die Giraffe ist „Krill“ genauso Quatsch wie „Fleisch“. Dazu ist „Algen und Zooplankton“ schon eine Meeres-Falle. Ein Kind streicht also zwei Antworten weg und hat nur noch die Wahl zwischen „Pflanzen“, „Eukalyptusblätter“ und „Bambus“. Krill steht außerdem schon in 16 Profi-Listen.
  - Vorschlag: „Krill“ durch **„Ameisen und Termiten“** ersetzen. Denkanstoß: Die Giraffe hat eine sehr lange Zunge, wie ein Ameisenigel.
  - Nachteil: Die Falle steht schon in 24 Listen.
  - Ob sie für die Giraffe eindeutig falsch ist, muss der fakten-pruefer kurz bestätigen. Danach den Ratemuster-Test laufen lassen.
- **Koala, Profi:** „Kleine Beutetiere“ steht wortgleich auch in seiner Entdecker-Liste. Zusammen mit „Fleisch“ sind dann zwei von vier Profi-Fallen Tierfutter. In der Hälfte der Runden kommen beide zusammen, und das Kind streicht sie als Paar.
  - Vorschlag: „Kleine Beutetiere“ durch **„Ameisen und Termiten“** ersetzen. Der Ameisenigel lebt wie der Koala in Australien, also gleicher Kontinent.
  - Wenn ihr die Falle nicht bei Giraffe und Koala zugleich wollt, hat die Giraffe Vorrang.

**Kann**
- **Dromedar, Profi, „Vor allem kleine Tiere“:** Die Falle passt als beste vorhandene Lösung.
  - Durch „vor allem“ bleibt sie eindeutig falsch, auch wenn die Kartenquelle sagt, dass Kamele sogar Fisch fressen. Sie ist nicht wortgleich mit einer Entdecker-Falle.
  - Ein echter Irrglaube ist sie nicht. Dass auch das Erdmännchen ein Wüstentier ist, sieht das Kind nicht.
  - Eine bessere richtige Antwort eines anderen Tieres gibt es nicht. Die anderen Pflanzen-Antworten treffen auch auf das Dromedar zu („Blätter und andere Pflanzenteile“, „Vorwiegend Pflanzen“, „Pflanzen und Rinde“). Die Antworten mit Pflanzen und Tieren gemischt sind halb richtig, zum Beispiel beim Strauß oder Katta.
  - Also behalten.
- **Dromedar, Profi, „Bambus“ (war schon vorher drin):** Bambus ist botanisch ein Gras, und die richtige Antwort lautet „Gräser und andere Pflanzen“. Ein genaues Kind kann das einwenden.
  - Vorschlag: Bis BACKLOG Punkt 25 so lassen und den fakten-pruefer fragen, ob es ein Problem ist.
- **Dromedar, Entdecker:** „Je nach Gruppe verschiedene Beutetiere“ ist für ein 6-jähriges Kind beim Vorlesen sehr abstrakt. Mit vier Einträgen kommt es oft vor.
  - Vorschlag: später durch „Kleine Tiere“ ersetzen.
- **Honigbiene („Fleisch“ dazu) und Biber („Vor allem kleine Fische“ dazu):** gut. Beides sind echte Irrtümer (Verwechslung mit der Wespe, „Biber fressen Fisch“). Die Mischung ist gut, kein Ratemuster.
- **Giraffe und Biber, Muster „Pflanzen“:** Das allgemeinste Wort ist die richtige Antwort. Das ist der schon bekannte Befund e und gehört weiter ins BACKLOG (Punkt 25).

### 2. `invention-light`
- **`question.why`: ok.** Der Satz erklärt die richtige Antwort, und das sogar besser als vorher. Er löst das unklare „andere Lampen“ auf: Auch Öl- und Gaslampen brannten mit Flammen.
  - Er verrät nichts Neues. Der Technik-Detektiv fragt mit dem Problem-Satz, der ohnehin wortgleich die Antwort der Karte ist. Seine Auflösung („ganz ohne Flamme“) passt dazu.
  - Kann: Ein kurzer Satz, *warum* Flammenlicht ein Problem war, würde den Gedanken schließen. Zum Beispiel: „Flammen gaben wenig Licht und machten Ruß.“ Das NPS nennt Ruß von Petroleumlampen; der fakten-pruefer müsste es bestätigen.
- **`stages[3]` „Glühfaden“: verrät nichts.** Das Wort ist neutral, genau wie vorher „Draht“.
  - Kann, schon vorher so und nicht durch den PR entstanden: Die Aufgabe in „Früher oder heute?“ löst schon die Vergangenheitsform „wurde“. Außerdem zeigt die Auflösung jeder der beiden Aufgaben den Satz der anderen (die „Früher“-Aufgabe erklärt mit dem LED-Satz und umgekehrt). Das Spiel ist ohnehin auf Entdecker-Niveau.
  - Kann (Einheitlichkeit): `app/technology-comparison.tsx` sagt noch „Glühlampe mit heißem Draht“. Vorschlag: „Glühlampe mit heißem Glühfaden“ oder „Glühlampe mit glühendem Faden“.

### 3. `invention-elevator`
- **`wrongReasons[2]`: verrät die Lösung nicht.** Das ist besser als vorher: Das alte „Eine Notbremse ist es nicht“ deutete auf die Lösung.
- **Sollte, zur Logik:** Die falsche Antwort lautet „Den Gewichtsunterschied zwischen Kabine und Gegengewicht ausgleichen“. Der Satz „Beim Ausgleichen hilft das Gegengewicht“ sagt dann, das Gegengewicht gleiche den Unterschied zu sich selbst aus. Ein genaues Kind stolpert darüber. Den Unterschied, der übrig bleibt, schafft der Antrieb.
  - Der Satz „etwa so schwer wie die halb volle Kabine“ hilft bei dieser Frage nicht weiter; er steht ja schon im Absatz.
  - Vorschlag: „Das Gegengewicht hängt am anderen Ende des Seils. So muss der Antrieb weniger heben. Die Fangvorrichtung hat eine andere Aufgabe.“
  - Den Wortlaut sollten danach fakten-pruefer und kinder-redaktion prüfen.
- **`paragraphs[0]`: verrät nichts.** Auf der Karte fragt keine Frage, keine Zusatzfrage, kein „Stimmt das?“ und keine Challenge nach dem Gewicht. Der Aufzug kommt nicht in „Früher oder heute?“ vor. Der Technik-Detektiv fragt nach der Forscherfrage, nicht nach dem Gegengewicht.

### Unsicher
- Ob „Fleisch“ beim Dromedar als Entdecker-Falle bleiben kann, obwohl die Kartenquelle Fisch nennt, hat der fakten-pruefer ausdrücklich nicht geprüft.
- Bei der Honigbiene enthält die Profi-Falle „Früchte, Blätter und auch Insekten“ das Wort Früchte. Honigbienen saugen manchmal Saft aus beschädigtem Obst; das sollte der fakten-pruefer kurz ansehen.
- Ob die neuen Fallen 8- bis 10-Jährige wirklich in die Irre führen, kann nur die Rückmeldung echter Kinder zeigen.

### Gelesen
- `git diff 675f17b..HEAD` für `app/world-game-tier-fallen.json`, `app/world-catalog.json`, `app/world-game-tier-aufloesung.json`, `app/world-game-support.mjs`
- `app/world-game-tier-fallen.json` (Abschnitt `nahrung`, alle Tiere gezählt)
- `app/world-catalog.json` (`invention-light`, `invention-elevator`)
- `app/challenge-hints.json` (beide `:mini`)
- `app/world-game-bank.ts`, `app/world-game-runde.ts`, `app/world-game-support.mjs`, `app/technology-comparison.tsx`
- `tests/ratemuster.test.mjs`
- /tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/wt-tier/docs/entwurf/2026-11-25-tier-aufloesung-nachtrag-fakten-2.md
- /home/user/wunderkompass/docs/entwurf/2026-11-25-tier-aufloesung-nachtrag-stufen.md
