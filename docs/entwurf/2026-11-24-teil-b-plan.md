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

## Aufgaben 8 bis 12

Werden hier je Aufgabe in kleinen Schritten ergänzt, bevor sie gebaut werden (Reihenfolge wie im Plan Teilschritt 3, Abschnitt 5).
