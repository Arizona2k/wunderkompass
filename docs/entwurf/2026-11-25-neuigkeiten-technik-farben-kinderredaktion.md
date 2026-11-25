# Kinder-Redaktion: „Was ist neu?“ Technik und neue Farben

Helfer: `kinder-redaktion` (opus / high), 25.11.2026, zum [Entwurf](2026-11-25-neuigkeiten-technik-farben-entwurf.md).

**Gesamteindruck:** Beide Einträge sind kurz, freundlich und halten die Regeln ein: A hat etwa 128 Zeichen, B etwa 146, jeweils zwei Sätze. Das „!“ in „Richtig!“ zählt der Test nicht als Satzende, weil danach ein Anführungszeichen kommt. Ton und Länge passen zu den oberen Einträgen. Beide Texte haben je eine Stelle, die beim Vorlesen hakt. Note: geht so, mit den kleinen Änderungen unten gut.

**A – „Technik-Detektiv: kurz erklärt“**
- **Titel:** passt (30 Zeichen). Das Spiel heißt so (`app/world-games.tsx`, `app/game-index.json`).
- **Doppeltes:** Der Eintrag direkt darunter beginnt auch mit „Nach … „Richtig!““. Hintereinander vorgelesen klingt das wie eine Wiederholung. Es ist zwar nicht dieselbe Tatsache, aber derselbe Satzbeginn.
- **Missverständlich:** „Zur Rakete probierst du mit einem Luftballon etwas aus“ klingt so, als baue oder starte man eine Rakete. Der Bezug „zur Rakete“ ist für Kinder zu abstrakt.
- **Schwach:** „erfährst du jetzt kurz“. Das „kurz“ trägt nichts.
- **Vorschlag (129 Zeichen, zwei Sätze):**
  „Liegst du richtig, erfährst du jetzt, wie die Erfindung funktioniert. Bei der Rakete zeigt ein Luftballon, wie sie davonsaust.“
  Möglicher Ersatz für den Titel: „Technik-Detektiv: So geht das“ (29). Den alten Titel kannst du aber auch behalten.

**B – „Ruhige Farben, gleiche Knöpfe“**
- **Titel:** passt (29 Zeichen).
- **Verwechslung:** „blaugrün“ verstehen Kinder schon. Direkt danach heißt es aber „sieht nicht mehr grün aus“. Blaugrün und grün liegen beim Hören dicht beieinander. Das Kind fragt sich dann vielleicht, ob die Knöpfe nun grün sind oder nicht.
- **Zu abstrakt:** „Was du auswählst“. Gemeint ist „die Antwort, die du antippst“.
- **Besser:** die gute Nachricht andersherum sagen: Grün heißt jetzt nur noch „richtig“.
- **Vorschlag (125 Zeichen, zwei Sätze):**
  „Die Seite hat ruhigere Farben, und alle Knöpfe sehen gleich aus. Grün wird eine Antwort jetzt nur noch, wenn sie richtig ist.“

**Vorschlag für `more`:** entfällt, „Was ist neu?“ hat kein Feld „Mehr erfahren“.

**Unsicher:**
- Bei B bitte nachsehen, ob eine Antwort wirklich nur noch grün wird, wenn sie richtig ist. Das gilt auch für die Spiele, „Kreuz und quer“ und die Labore. Gibt es noch andere grüne Rückmeldungen, wäre der Satz zu stark. Dann besser: „Eine angetippte Antwort ist nicht mehr grün.“
- Bei A: Steht beim Luftballon-Versuch im Spiel ein Hinweis für Kleine? Nicht aufgeblasene Ballons und Ballonreste sind für Kinder unter 8 verschluckbar, darum vielleicht „mit einem Erwachsenen“. Das fällt eher dem `fakten-pruefer` zu. Den Eintrag selbst betrifft es nicht.

Gelesen habe ich `/home/user/wunderkompass/app/kern/neuigkeiten.ts` und `/home/user/wunderkompass/tests/neuigkeiten.test.mjs`. Geändert habe ich nichts. Die Zeichen habe ich von Hand gezählt, bitte mit `pnpm test` bestätigen.
