# Personen-Rätsel: Code-Prüfung beim Einbau

Helfer: code-pruefer (opus/high), 25.11.2026, Einbau im Arbeitsstand 3eb5d0b plus Änderungen danach

**Ergebnis:** Der Einbau ist mit Änderungen bereit. Im Code der App habe ich keinen Fehler gefunden, aber ein geänderter Browser-Test bricht ab.

**Befunde**

**Wichtig**
- `tests/browser/learning-tasks.mjs:81`: Beim Umbau wurde im Wissensquiz-Teil `q.prompt` durch `frage` ersetzt. `frage` gibt es aber nur in der Schleife in Zeile 47. Beim Neuladen nach der ersten Antwort (Zeile 28) wirft der Test darum `ReferenceError: frage is not defined`. Ein ESLint-Lauf mit der Regel `no-undef` meldet genau diese Stelle; das normale `pnpm run lint` ist trotzdem grün. Die Suite `journeys` gehört zum Vollsatz (`set:'full'`) und ruft den Test über `learning-corrections.mjs` auf. `pnpm run check` sieht den Fehler also nicht, erst die Vollprüfung. Vorschlag: Zeile 81 wieder auf `q.prompt` stellen, danach `node tests/browser/run.mjs --suite full journeys playground` laufen lassen (`playground` enthält `world-game-learning-copy.mjs`).

**Klein**
- **Laufende alte Runden** (`world-games.tsx:62` mit `validWorldGameOrder`): Gespeicherte Reihenfolgen bleiben gültig, Fortschritt, Wiederholung und Antworten gehen nicht verloren. Runden aus der Zeit vor Teil B und Entdecker-Runden von vor dem Update behalten aber die alten festen Fallen und zeigen jetzt nur noch Satz 1. Gemessen haben 13 von 36 Aufgaben dann eine Falle aus demselben Gebiet oder aus Liste A/B. Beispiele:
  - Bell Burnell zeigt Einstein (Liste B) und Jemison (gleiches Gebiet).
  - Carson zeigt Cai Lun und Darwin.
  - Darwin zeigt Anning (Liste A).
  - Gespeicherte Profi-Runden können bei Einstein noch Leavitt, Payne-Gaposchkin oder Ibn al-Haytham zeigen (neu in Liste A).

  Das endet mit der nächsten Runde, und der Plan nimmt es bewusst hin. Billige Abhilfe, falls gewünscht: den langen Hinweis zeigen, solange die Fallen der Aufgabe nicht in `personenFallen(id).entdecker` liegen.
- **Toter Rückfall:** Der neue Test verlangt für jede Person ein eigenes Rätsel. Damit wird der Rückfall in `personRecognitionClue` (Ersetzung aus der Karten-Einleitung, Namensvarianten) nie mehr erreicht. Der Kommentar in `world-game-runde.test.mjs:184` sagt aber „bleibt für neue Personen“. Entweder den Kommentar anpassen oder den Rückfall später streichen.
- **Veralteter Kommentar:** `world-game-runde.test.mjs:71` („Fallen aus derselben Gruppe oder Zeit“) stimmt für Personen nicht mehr.

**Geprüft und in Ordnung**
- **Richtige Antworten:** Es bleibt jeweils der Kartentitel. Die Antwort-Fixtures sind unverändert, sie betreffen die Kartenfragen und nicht das Spiel.
- **Stufe:** Frage, Tipp, Falsch-Rückmeldung und Vorlesen nutzen alle `gespielt`. Das hält auch nach Neuladen (gespeicherte `stufe`, ohne sie Entdecker), nach einem Stufenwechsel (`neueRunde`) und nach „Neue Runde“ (Neuaufbau mit `start.stufe`). Experte spielt Profi. Andere Aufrufer gibt es in `app/`, `components/` und `lib/` nicht, also auch nicht in Wissensbuch, Wiederholung oder Kern-Karten. `world-game-offline-semantics.mjs` ruft die Funktionen ohne Stufe auf, prüft aber kein Personenspiel.
- **Fallenwahl:**
  - Die richtige Antwort kommt nie doppelt vor, alle 36 Titel sind eindeutig.
  - Liste A wird auch zwischen zwei Fallen geprüft (`paarA`).
  - Liefert `personenAntworten` null, greift der alte Weg.
  - Der Zufall läuft nur über `zufall` und ist damit je Seed gleich.
  - Profi nimmt zwei Fallen aus dem Gebiet, die dritte aus den fünf zeitlich nächsten, wie in Abschnitt 7.
- **Satz-1-Trennung:** Ich habe alle 36 Satz-1-Texte gelesen; keiner wird falsch geschnitten (keine Abkürzungen, kein „?“).
- **Prüfläufe:** `pnpm test` 550/550 grün, `pnpm run typecheck` grün, `pnpm run lint` grün.

**Nicht geprüft**
- Keine Browser-Suite gelaufen, weder der CI-Satz (`people-learning`) noch `journeys` oder `playground` aus dem Vollsatz.
- Fachlicher Inhalt der Rätsel und der Gebietstabelle nicht geprüft.
- Kein Blick bei 320 px.

Worktree: /tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/wt
