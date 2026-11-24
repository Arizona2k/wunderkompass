# Teil B, PR 1 (Aufgaben 7 und 8): Code-Prüfung

Stand: 24.11.2026. Bericht des `code-pruefer` zum Branch `claude/practical-cerf-av0jx4` gegen `origin/test-live` (Code-Stand `4b29615`), sinngemäß vollständig übernommen. Was Claude daraus gemacht hat, steht am Ende.

**Ergebnis des Helfers:** Bereit mit kleinen Änderungen. Kein Weg zu Pass-Datenverlust, Absturz oder einer Runde ohne richtige Antwort gefunden; eine Lücke in der Challenge und ein falscher Satz auf der Seite.

## Fehler

1. **Challenge, Weg „Eine andere Stufe wählen“ merkt die gespielte Runde nicht** (klein bis mittel). `app/knowledge-challenge-game.tsx` (`start`) mit dem Abschlussbildschirm (`setSession(emptyChallenge())`). Ablauf: Runde „Mittel“ A zu Ende spielen, eine Frage zuerst falsch (`correct:false`, fällig heute). „Eine andere Stufe wählen“ → Spielstand `ids: []`. `vorigeRunde({challenge:session, vorige:gemerkt})` liefert dann `snapshot.vorige` (leer, wenn nie „Neue Runde“ oben gedrückt wurde, sonst eine ältere Runde). Wieder „Mittel“ → die falsche Frage aus A hat Rang 0 und kommt sicher sofort wieder. Widerspricht Entscheidung 1; mit alter `vorige` wird sogar die falsche Runde nach hinten geschoben. Kein Test deckt den Weg ab. Vorschlag: vor `setSession(emptyChallenge())` die laufenden `session.ids` als `vorige` speichern.
2. **Der Text verspricht vier Antworten, „Früher oder heute?“ zeigt drei** (klein). `app/kern/neuigkeiten.ts` („Als Profi gibt es mehr Aufgaben und vier Antworten.“) und `app/kern/stufen-wahl.tsx` (`STUFEN_TEXT.profi`: „vier Antworten, kniffligere Fallen“). Für `then-now` gibt es weder Tier-Liste noch Kandidaten; `antworten()` fällt auf die drei festen Antworten zurück. Vorschlag: Text auf fünf Spiele einschränken oder den Unterschied ehrlich nennen.

## Risiken

- **Gespeicherte Stufe ohne gespeicherte Runde** (`app/world-games.tsx`): `alteRunde` prüft nur `saved.items`, die Stufe kommt aber aus dem Spielstand. Mit `stufe:'entdecker'`, aber ohne gültige `items` (kaputte Datei, zwei Tabs) entsteht eine neue Profi-Runde, die als „Entdecker“ läuft und den Hinweis zeigt. Vorschlag: gespeicherte `stufe` nur bei `alteRunde` übernehmen.
- **Fallen in Ersatz-Reihenfolgen:** Eine alte Entdecker-Runde mit fehlender oder ungültiger Reihenfolge bekommt den Ersatz aus `start.orders`; ist die Pass-Stufe Profi, kann das eine Reihenfolge mit 4 Antworten sein (gemischt 3 und 4 in einer Runde). Schönheitsfehler, die richtige Antwort bleibt drin.
- **Spätere Kürzungen der Fallenlisten:** Wird aus `world-game-tier-fallen.json` später eine Falle gestrichen, gelten gespeicherte Profi-Reihenfolgen mit dieser Falle als ungültig; `restoreWorldGameOrders` ersetzt sie durch 3 gemischte Antworten, eine gespeicherte Antwort erscheint als „frühere Auswahl“. Nichts geht verloren. Eine nur wachsende Liste wie `gespeicherte-antworten*.json` gibt es für Spiel-Antworten nicht.
- **Unbewachte Ausnahmen für Altantworten:** `compatibleLegacy` in `app/world-game-habitats.mjs` zählt bei Walross, Orca und Blauwal „Arktis“ oder „Antarktis“ als richtig; die Walross-Profi-Liste enthält „Antarktis“. Heute unschädlich, aber kein Test verhindert, dass eine solche Altantwort als Falle gezogen und dann als richtig gewertet wird.
- **Darwin und Einstein im Rätsel-Test:** `tests/world-game-learning-copy.test.mjs` nimmt beide aus der allgemeinen Prüfung, ohne Ersatz. Kein Test prüft mehr, dass ihr Rätsel dem festen Satz entspricht und keinen Namensteil verrät. Vorschlag: in die Benz/al-Chwarizmi-Schleife mit Namensteil-Prüfung aufnehmen. Sonst keine Abschwächung.
- **Kommentar und Code weichen ab:** `app/kern/auswahl.ts` und Entscheidung 1 sagen „in jeder Gruppe hinten“, der Code (`rang = 4 + gruppe`) stellt die vorige Runde hinter alle Gruppen. Der Code ist richtig (nur so trägt die Begründung); den Wortlaut anpassen.
- **Kreuz und quer ohne Oberfläche:** Ein Spielstand mit `challenge.stufe` zeigt heute die Auswahl Leicht/Mittel/Schwer, `playground-catalog.ts` meldet aber „Runde fortsetzen“. Heute erzeugt nichts so einen Spielstand; muss in Aufgabe 9 mitkommen.

## Geprüft ohne Befund

Pass (nur `gameSessions` und `review`; Schema, Schlüssel, IndexedDB unverändert; alte und kaputte Runden werden abgefangen; die richtige Antwort steht nie fest oben; Export/Import-Test strenger). IDs und `review`-Schlüssel unverändert. `waehleAufgaben` (keine Doppelten, höchstens `min(anzahl, Vorrat)`, leerer Vorrat und `anzahl` 0 gehen, `due` als UTC-Datum). `antworten()` (richtige Antwort immer dabei, keine doppelten oder fast gleichen Texte, Ausschlüsse greifen, Jahreszahlen lesbar). `validWorldGameOrder`. Alle Wege (Öffnen, Neuladen, Fortsetzen, „Neue Runde“, Wechsel in und außerhalb der Runde, fertige Runde, Import). `pnpm test` 500/500, `typecheck` und `lint` sauber.

## Grenzen

Keine Browser-Suiten, kein Build. Fallenlisten nur technisch geprüft. Zwei Tabs nur im Code nachvollzogen. Größenbudget nicht geprüft (Fallenliste 36 KB, nur in Spiel-Modulen). `docs/` nicht geprüft.

## Umsetzung (Claude, 24.11.2026)

- **Fehler 1, Challenge „Eine andere Stufe wählen“:** behoben. `andereStufe` in `app/knowledge-challenge-game.tsx` merkt die laufende Runde als `vorige`, bevor der Spielstand geleert wird (Test in `tests/world-game-runde.test.mjs`).
- **Fehler 2, „vier Antworten“:** behoben. Stufentext Profi „etwas kniffliger“ (nach der `kinder-redaktion`), Neuigkeit „meist vier Antworten“, CHANGELOG nennt die Ausnahme „Früher oder heute?“.
- **Risiko 1, Stufe ohne Runde (R1):** behoben. Die gespeicherte Stufe gilt nur, wenn auch gültige Aufgaben gespeichert sind (`alteRunde` in `app/world-games.tsx`).
- **Risiko 2, gemischte Antwortzahl (R2):** behoben. Fehlt einer alten Runde eine Reihenfolge, kommt der Ersatz aus `rundenAntworten(spiel, rundenStufe, items)`, also passend zur Stufe der Runde (Test „rundenAntworten gibt jeder Aufgabe die Antworten ihrer Stufe …“).
- **Risiko 3, spätere Kürzungen (R3):** bewusst nicht geändert. Gestrichene Fallen sind meist unfaire (z. B. „Fleisch“ beim Axolotl); eine Reihenfolge damit soll neu gemischt werden. Nichts geht verloren. Im BACKLOG (Punkt 25) festgehalten.
- **Risiko 4, Altantworten als Falle:** Test „keine Tier-Falle wird als richtige Antwort gewertet“ in `tests/world-game-runde.test.mjs`. Die Walross-Liste enthält „Antarktis“, als Altantwort zählt dort nur „Arktis“; kein Konflikt.
- **Risiko 5, Darwin und Einstein im Rätsel-Test:** behoben. Alle eigenen Rätsel (jetzt neun) prüft der Test „eigene Personen-Rätsel verraten weder Namen noch Geschlecht“, lange Namensteile auch mitten im Wort.
- **Risiko 6, Kommentar zur Auswahl:** Wortlaut in `app/kern/auswahl.ts` und Entscheidung 1 an den Code angeglichen.
- **Risiko 7, Kreuz und quer ohne Oberfläche:** kommt mit Aufgabe 9 (PR 2); heute erzeugt nichts einen solchen Spielstand.
