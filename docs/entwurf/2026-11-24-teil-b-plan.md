# Teil B „Spiele kniffliger“ – Bauplan je Aufgabe

> **Für ausführende Agenten:** Pflicht-Skill: superpowers:executing-plans (Claude baut selbst in dieser Sitzung, wie bei Teil A). Schritte haben Kästchen (`- [ ]`) zum Abhaken.

Stand: 24.11.2026. Grundlage (freigegeben am 23.11.2026, nicht neu ausdenken): [Entwurf und Plan Teilschritt 3](2026-11-23-phase-1-teilschritt-3.md), Abschnitt 2 (E4, E5, E7, E9, E13, E14, E15) und Abschnitt 5 (Aufgaben 7 bis 12). Dieser Plan zerlegt die Aufgaben in kleine Schritte. Er wird je Aufgabe ergänzt, bevor sie gebaut wird. Entscheidungen beim Bauen stehen in der [Entscheidungsliste Teil B](2026-11-24-teil-b-entscheidungen.md).

**Ziel von Teil B:** Spielrunden wählen ihre Aufgaben klug (erst Wiederholen, dann Neues, nie dieselbe Runde), Welt-Spiele und Challenge folgen der gemeinsamen Stufe, kleine Spiele gehen in größeren auf, Länder-Spiele bekommen eine geprüfte Liste.

**Technik:** React 19, TypeScript, Node-Testrunner für reine Logik (`tests/*.test.mjs`), Browser-Suiten in `tests/browser/`.

## Feste Vorgaben (aus dem Plan Teilschritt 3, Abschnitt 4)

- Pass: Schema 3, App-ID `earth-explorer`, Schlüssel `erde-entdecken:save:v3`. Neues nur in `gameSessions` und `review`.
- IDs von Spielen und Fragen bleiben. Neue Fragen bekommen neue IDs.
- Gespeicherte Runden laufen mit ihren alten Aufgaben und Antworten zu Ende.
- Keine Punkte, Zähler oder Ranglisten. „Aufgabe 3 von 6“ bleibt.
- Tests zuerst suchen (nach Wortlaut und Auslöser), in einem Durchgang anpassen, betroffene große Suiten gleich laufen lassen.
- Sichtbare Änderungen bekommen einen Eintrag in „Was ist neu?“ (`app/kern/neuigkeiten.ts`).

---

## Aufgabe 7: Auswahl-Helfer (E7)

Der Linkwächter aus Schritt 1 des alten Plans ist fertig (PR #110).

**Was der Bestand zeigt** (gelesen am 24.11.2026):
- Die Challenge wählt in `createChallenge` (`app/knowledge-challenge.ts`) zuerst Fragen, die nicht in der vorigen Runde waren, sonst zufällig. Sie liest `review` nicht, obwohl sie `challenge:<id>` schreibt.
- „Neue Runde“ oben im Spiel (`GameShell`) löscht den ganzen Spielstand (`clearGame`). Damit ist die vorige Runde weg. Nur der Knopf „Andere Aufgaben auf dieser Stufe“ nach einer Runde kennt sie noch.
- Eine falsche Antwort ist sofort wieder fällig (`review`: `due` = heute). Ohne Gegenmittel käme sie gleich in der nächsten Runde wieder.

**Entscheidung beim Planen (technisch, kein Nutzer-Thema):** Aufgaben der vorigen Runde kommen in jeder Gruppe zuletzt. So gibt es „Wiederholen mit Abstand“ (eine falsch beantwortete Frage kommt eine Runde später), und „nie dieselbe Runde“ folgt von selbst: Ist der Vorrat größer als eine Runde, bleibt mindestens eine Aufgabe außerhalb der vorigen Runde übrig, und sie wird vorgezogen. Das alte Verhalten der Challenge (keine Überschneidung, wenn genug Fragen da sind) bleibt damit erhalten.

### Schritt 7.1: Helfer `waehleAufgaben`

**Dateien:** neu `app/kern/auswahl.ts`, neu `tests/auswahl.test.mjs`.

**Schnittstelle:**
```ts
export type AuswahlEingabe = {
  vorrat: readonly string[];            // mögliche Aufgaben-IDs (doppelte zählen einmal)
  review: Review;                       // aus dem Pass
  schluessel: (id: string) => string;   // Aufgaben-ID → review-Schlüssel, z. B. id => 'challenge:' + id
  anzahl: number;
  vorige?: readonly string[];           // Auswahl der vorigen Runde
  zufall?: () => number;                // Standard Math.random
  heute?: string;                       // 'JJJJ-MM-TT', Standard: heutiges Datum wie in wartetZumWiederholen
};
export function waehleAufgaben(eingabe: AuswahlEingabe): string[];
export function vorigeRunde(sitzung: unknown): string[];
```

Rang je Aufgabe: zuerst „nicht in der vorigen Runde“ vor „in der vorigen Runde“, darin Gruppe 0 falsch und fällig, 1 noch nie gesehen (kein `review`-Eintrag), 2 fällig (richtig, `due` ≤ heute), 3 der Rest. Gleichstand wird zufällig gemischt. Die gewählten `anzahl` Aufgaben kommen am Ende in zufälliger Reihenfolge zurück.

`vorigeRunde(sitzung)` liest aus einem Welt-Spielstand die zuletzt gespielte Auswahl: `items` (Liste von Texten) oder `challenge.ids`, wenn sie nicht leer sind, sonst ein schon gemerktes `vorige`, sonst `[]`.

- [ ] Test zuerst (`tests/auswahl.test.mjs`), fester Zufall:
  - `falsch und fällig kommt vor ungesehen, ungesehen vor fällig, fällig vor dem Rest`: Vorrat aus vier Aufgaben je Gruppe, `anzahl` 1, 2, 3 …; die gewählte Menge ist jeweils genau die erwartete Gruppe.
  - `falsch, aber noch nicht fällig zählt zum Rest`.
  - `die vorige Runde kommt zuletzt, auch wenn sie falsch beantwortet ist` (Abstand).
  - `nie dieselbe Auswahl wie die vorige Runde, wenn der Vorrat größer ist`: 200 Zufallsfolgen, Vorrat 7, `anzahl` 6, jede neue Runde ≠ vorige als Menge; bei Vorrat = `anzahl` darf sie gleich sein.
  - `kleiner Vorrat, doppelte IDs und unbekannte vorige IDs`: `anzahl` > Vorrat gibt alle zurück, Doppelte zählen einmal, fremde IDs in `vorige` stören nicht.
  - `Reihenfolge ist gemischt`: Bei gleichem Rang ändert ein anderer Zufall die Reihenfolge.
  - `vorigeRunde liest items, challenge.ids und vorige`: auch `null`, Zahlen, leere Listen.
- [ ] Test laufen lassen: `node --test tests/auswahl.test.mjs` → rot (Datei fehlt).
- [ ] `app/kern/auswahl.ts` schreiben (rein, ohne React; Typ `Review` aus `../progress-storage`).
- [ ] Test grün, `pnpm run typecheck`, `pnpm run lint`.
- [ ] Commit „Teil B, Aufgabe 7: Auswahl-Helfer waehleAufgaben“, Push.

### Schritt 7.2: Challenge nutzt den Helfer

**Dateien:** `app/knowledge-challenge.ts`, `app/knowledge-challenge-game.tsx`, `app/world-games.tsx`, `app/earth-explorer.tsx`, `tests/challenge.test.mjs`, `tests/browser/challenge-hints.mjs`.

**Schnittstelle:** `createChallenge(difficulty, vorige = [], zufall = Math.random, review: Review = {}, heute?: string): ChallengeSession`. Gleiche Form der Runde wie heute (6 Aufgaben, `orders` gemischt), gespeicherte Runden laden wie bisher.

- [ ] Tests zuerst (`tests/challenge.test.mjs`):
  - `eine falsch beantwortete, fällige Frage kommt in die nächste Runde`: `review['challenge:<id>'] = {correct:false, seen:1, due:<gestern>}` → `ids` enthält die ID, für alle drei Stufen.
  - `schon gesehene, nicht fällige Fragen kommen erst nach allen ungesehenen`: 15 von 21 Profi-Fragen gesehen mit `due` morgen → die Runde enthält genau die 6 ungesehenen.
  - Der vorhandene Test „new rounds avoid the immediately previous six questions“ bleibt unverändert grün.
- [ ] Rot sehen, dann `createChallenge` auf `waehleAufgaben` umstellen (`schluessel: id => 'challenge:' + id`).
- [ ] Verdrahten: `WorldGames` bekommt `review` (aus `local.progress.review` in `earth-explorer.tsx`) und reicht es an `KnowledgeChallenge` weiter; `start(d)` ruft `createChallenge(d, vorige, Math.random, review)` mit `vorige` = `session.ids`, wenn vorhanden, sonst dem gemerkten `vorige` aus dem Spielstand (`useGameSnapshot()`).
- [ ] „Neue Runde“ merkt die vorige Runde: In `WorldGames` liest `onNewRound` vor dem Löschen `vorigeRunde(sessions[full])` und schreibt sie danach als `vorige` in den frischen Spielstand (`onSave(full, 'vorige', …, 'world')`). Das gilt für alle Welt-Spiele; Aufgabe 8 nutzt es für die Runden.
- [ ] Browser (`tests/browser/challenge-hints.mjs`, Suite `challenge`): ein Pass mit einer falsch beantworteten, fälligen Profi-Frage → Profi starten → sie ist in der Runde; „Neue Runde“ oben → `vorige` steht im Pass, Profi starten → keine Überschneidung mit der vorigen Runde; Neuladen ändert die neue Runde nicht.
- [ ] Tests, die die Challenge-Auswahl voraussetzen, durchgesehen (24.11.2026): `tests/browser/connected-discoveries.mjs` (keine Überschneidung nach „Andere Aufgaben auf dieser Stufe“, bleibt gültig), `learning-tasks.mjs` und `challenge-hints.mjs` (bauen ihre Runden selbst mit `createChallenge(…, [], zufall)`, ohne `review` wie bisher).
- [ ] `pnpm run check`, dann `node tests/browser/run.mjs --suite full challenge core`.
- [ ] Commit, Push.

**Prüffokus** (Fälle, die kein Schritt von selbst abdeckt; jeder hat oben einen Test):
1. Alter Pass ohne `vorige` und ohne passende `review`-Einträge: Runde wie bisher.
2. Gespeicherte, angefangene Runde: lädt unverändert (vorhandene Tests in `challenge.test.mjs`).
3. „Neue Runde“ zweimal hintereinander ohne zu spielen: `vorige` geht nicht verloren (`vorigeRunde` fällt auf `vorige` zurück).
4. Sicherung und Einlesen behalten `vorige` (freier Spielstand, wie jeder andere Eintrag in `gameSessions`).
5. Ruhende Fragen (`ruht`) kommen nie in eine Runde, auch wenn sie in `review` stehen.

## Aufgabe 8: Welt-Spiele (E4, E5, E9, E13)

Betrifft die Rundenspiele in `app/world-games.tsx` (`Rounds`): Tierdetektiv (`world:animal-detective`), Tier & Lebensraum (`world:habitats`), Wer frisst was? (`world:food`), Wer war das? (`world:people`), Technik-Detektiv (`world:technology`), Früher oder heute? (`world:then-now`). Tierrekorde geht in Aufgabe 10 in „Rekorde“ auf, „Sortiere die Zeit“ kommt in Aufgabe 12.

**Was der Bestand zeigt** (24.11.2026):
- Eine Runde sind 5 zufällige Aufgaben (`items`), `orders` mischt die Antworten aller Aufgaben des Vorrats einmal. Gültig ist eine gespeicherte Reihenfolge nur, wenn sie genau die drei festen Antworten enthält; bei Tierdetektiv, Personen und Technik auch andere Namen aus dem Vorrat (`validWorldGameOrder`).
- Die falschen Antworten sind fest: Tierdetektiv, Personen und Technik nehmen Nachbarn nach Listenplatz (z. B. `i+5`, `i+9`), Lebensraum und Nahrung je Vergleichsgruppe immer dieselben zwei Sätze (`habitatDistractors`, `foodDistractors`).
- Gruppen, die es schon gibt: Tiere haben `animal.group` (26 Säugetiere, 6 Vögel, 4 Fische, je 3 Weichtiere und Amphibien, je 2 Reptilien und Insekten, je 1 Spinnen- und Krebstier), Erfindungen ein Jahr, Personen Lebensdaten.
- Rund 20 Test-Dateien setzen die Welt-Spiele voraus (Liste unten, Schritt 8.5).

**Entscheidungen beim Planen** (Claude, 24.11.2026; Begründung und alle Wege in der Entscheidungsliste, Punkte 3 bis 6):
- Stufenwechsel mitten in einer Runde startet sofort eine neue Runde der neuen Stufe (wie auf der Karte: nach einem Wechsel kommt eine Frage der neuen Stufe). Eine Runde, die mit einer anderen Stufe gespeichert ist (Wechsel im Pass oder auf einer Karte, Neuladen, alte Runde), läuft mit ihrer Stufe zu Ende.
- Früher oder heute? bekommt auf Profi keine vierte Antwort: Die Antworten sind Kategorien („Früher“, „Heute“, …), eine vierte wäre erfunden (D3). Profi heißt dort 8 Aufgaben.
- Profi-Fallen: Tierdetektiv aus derselben Tiergruppe, Personen und Technik aus derselben Zeit (nächste Jahre). Jede Kombination prüft vorher der `fakten-pruefer` auf Mehrdeutigkeit; Paare, bei denen der Hinweis auch passt, kommen in eine Ausschlussliste.

### Schritt 8.1: Runden mit Stufe und Auswahl-Helfer

**Dateien:** neu `app/world-game-runde.ts` (rein), neu `tests/world-game-runde.test.mjs`; `app/world-games.tsx`.

**Schnittstelle:**
```ts
export const RUNDEN_GROESSE: Record<Stufe, number> = { entdecker: 5, profi: 8, experte: 8 };
export function weltSpielStufe(gewaehlt: Stufe): Stufe;               // experte → profi (E3), sonst gleich
export type WeltRunde = { items: string[]; stufe: Stufe; orders: Record<string, string[]> };
export function neueWeltRunde(e: { spiel: string; review: Review; vorige: readonly string[]; stufe: Stufe; zufall?: () => number; heute?: string }): WeltRunde;
export function rundenStufe(sitzung: unknown): Stufe;                  // gespeicherte stufe, fehlt sie: 'entdecker'
```
- `neueWeltRunde` wählt mit `waehleAufgaben` (`schluessel: id => 'world-game:' + spiel + ':' + id`, `anzahl: RUNDEN_GROESSE[stufe]`) und legt `orders` nur für die gewählten Aufgaben an. Auf Entdecker drei Antworten wie heute; Profi-Fallen kommen in 8.2 und 8.3, bis dahin drei Antworten auch auf Profi.
- `Rounds` startet eine neue Runde mit `neueWeltRunde` (Stufe aus dem Pass über `weltSpielStufe`), speichert `stufe` im Spielstand und zeigt die `StufenWahl` über „Aufgabe 1 von …“. Auf Experte steht „Experte gibt es hier noch nicht. Du spielst Profi.“ Spielt eine gespeicherte Runde eine andere Stufe als gewählt: „Diese Runde spielst du noch als <Stufe>. Die neue Stufe gilt ab der nächsten Runde.“
- Wechsel in der Runde: neue Runde (vorige Runde und `geschafft` bleiben, wie bei „Neue Runde“).
- Abschluss: „Die fünf Aufgaben sind gelöst.“ wird „Alle {n} Aufgaben sind gelöst.“
- [ ] Tests zuerst (`tests/world-game-runde.test.mjs`): Entdecker 5 und Profi 8 Aufgaben je Spiel; Experte spielt Profi; die Auswahl liest `world-game:<spiel>:<id>`; `orders` enthält genau die gewählten Aufgaben mit der richtigen Antwort; `rundenStufe` liest alte Runden ohne `stufe` als Entdecker.
- [ ] Bauen, Unit-Tests grün.
- [ ] Browser (`spiel-auswahl`): Profi-Runde hat 8 Aufgaben; Wechsel auf Entdecker in der Runde gibt eine neue Runde mit 5; Neuladen behält Runde und Stufe; Stufe im Pass ändern lässt die laufende Runde weiterlaufen und zeigt den Satz.

### Schritt 8.2: Vier Antworten im Tierdetektiv, bei Personen und Technik (E5)

**Dateien:** `app/world-game-runde.ts`, neu `app/world-game-fallen.json` (Ausschlussliste), `app/world-game-bank.ts` (`validWorldGameOrder` nimmt auf Profi vier Antworten an).
- Profi zieht drei falsche Antworten: Tierdetektiv aus derselben Tiergruppe (zu kleine Gruppen werden ergänzt: Wirbellose = Weichtiere, Insekten, Spinnen- und Krebstiere; Fische, Amphibien und Reptilien zusammen), Personen die nächsten nach Geburtsjahr, Technik die nächsten nach Erfindungsjahr. Ausgeschlossen ist, was in `world-game-fallen.json` steht.
- Vorher: Tabelle aller möglichen Kombinationen erzeugen (Skript im Scratchpad, Ergebnis als Datei in `docs/entwurf/`), `fakten-pruefer` meldet, wo der Hinweis auch auf eine falsche Antwort passt; `stufen-pruefer` prüft eine Stichprobe auf Schwierigkeit und Ratemuster.
- [ ] Tests zuerst: Profi hat vier verschiedene Antworten, die richtige ist dabei; keine ausgeschlossene Kombination; gespeicherte Profi-Runde lädt nach Neuladen mit denselben vier Antworten (`validWorldGameOrder`); alte Drei-Antworten-Runden bleiben gültig.

### Schritt 8.3: Fallen je Runde bei Lebensraum und Nahrung (E9)

**Dateien:** neu `app/world-game-tier-fallen.json` (Merkmale je Lebensraum- und Nahrungstext, erlaubte Bereiche je Tier), `app/world-game-habitats.mjs`, `app/world-game-food.mjs`, `app/world-game-support.mjs` (Rückmeldung).
- Statt fester Sätze zieht jede Runde die falschen Antworten aus den Lebensraum- bzw. Nahrungstexten anderer Tiere. Erlaubt ist nur ein Text, der sicher nicht passt: Jeder Text hat Merkmale (z. B. Savanne, Regenwald, Ozean, Süßwasser, Arktis; Fleisch, Fisch, Pflanzen, Nektar), jedes Tier eine geprüfte Liste passender Merkmale; teilen sie ein Merkmal, ist der Text gesperrt. Entdecker zieht zwei aus einer anderen Vergleichsgruppe (Land, Wasser, Ufer; wie heute deutlich verschieden), Profi drei aus derselben Gruppe (ähnlich).
- Rückmeldung zu einer falschen Wahl: „Du hast „Arktis“ gewählt. So lebt der Eisbär. …“ (Satz mit `kinder-redaktion`).
- Alte Runden mit den bisherigen festen Sätzen laufen weiter (die alten Texte bleiben als gültige Reihenfolge und behalten ihre Rückmeldung).
- Vorher: Merkmale und Listen entwirft Claude aus den Karten; `fakten-pruefer` prüft jede Tierliste mit Quelle (Karte), `stufen-pruefer` die Fallen je Gruppe, `kinder-redaktion` die Rückmeldung.
- [ ] Tests zuerst: keine Falle teilt ein Merkmal mit dem Tier; jedes Tier hat auf Entdecker mindestens 3 und auf Profi mindestens 4 mögliche Fallen; zwei Runden mit anderem Zufall ziehen nicht immer dieselben Fallen; die Tests `world-game-habitat-semantics` und `world-game-learning-copy` in einem Durchgang angepasst.

### Schritt 8.4: Höchste geschaffte Stufe merken (E13)

- [ ] Beim Spielstempel schreibt die Runde `geschafft[stufe] = 'JJJJ-MM-TT'` (nur `profi` und `experte`, nur wenn noch nicht da) in den Spielstand. „Neue Runde“ und ein Stufenwechsel behalten `geschafft` (wie `vorige`). Unsichtbar in Teilschritt 3.
- [ ] Test: Profi-Runde schaffen → `geschafft.profi`; neue Runde → bleibt; Sicherung und Einlesen → bleibt.

### Schritt 8.5: Tests nachziehen und prüfen

Gefunden am 24.11.2026 (Wortlaut und Auslöser: `worldGameBank`, `habitatDistractors`, `foodDistractors`, `validWorldGameOrder`, `restoreWorldGameOrders`, `world:<spiel>`, „Die fünf Aufgaben“, `world-game-room`): `tests/animal-game-save-compatibility.test.mjs`, `world-game-habitat-semantics.test.mjs`, `world-game-learning-copy.test.mjs`, `playground.test.mjs`, `people-two-continuation.test.mjs`, `invention-optics-game-bank.test.mjs`, `content-integrity.test.mjs`, `activity-view.test.mjs`, `animal-learning.test.mjs`, `retained-answer-wording.test.mjs`, `stufe.test.mjs`; Browser: `animal-game-saves.mjs`, `habitat-answer-semantics.mjs`, `world-game-learning-copy.mjs`, `world-game-offline-semantics.mjs`, `learning-tasks.mjs`, `people-learning.mjs`, `animal-learning.mjs`, `retained-answer-wording.mjs`.
- [ ] Je Schritt die betroffenen Tests in einem Durchgang anpassen, danach `pnpm run check` und die großen Suiten `playground`, `animals`, `core`.
- [ ] „Was ist neu?“-Eintrag, Commit, Push.

## Aufgaben 9 bis 12

Werden hier je Aufgabe in kleinen Schritten ergänzt, bevor sie gebaut werden (Reihenfolge wie im Plan Teilschritt 3, Abschnitt 5).
