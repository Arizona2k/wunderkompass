# Technik-PR: Hinweis bei sehr großer Sicherung (Kinder-Redaktion)

Helfer: kinder-redaktion (opus / high), 25.11.2026. Nur Befunde, ändert nichts.

**Gesamteindruck:** geht so, nah an gut. Der Entwurf ist ehrlich, ruhig und kurz. Es gibt zwei Schwächen: Das Wort „Lösche“ passt zu keinem Knopf, und der Anfang sieht anders aus als die normale Meldung.

**Befunde**

1. **Das Wort passt nicht zum Knopf.** In `app/progress-panel.tsx` gibt es keinen Knopf zum Zurücksetzen. Er liegt in `app/earth-explorer.tsx` (Zeile 350):
   - Abschnitt „Neu anfangen?“, Knopf **„Pass neu beginnen“**
   - danach ein Bestätigungsfenster mit dem Titel „… zurücksetzen?“ und dem Knopf „Pass zurücksetzen“

   Ein Kind, das allein ist, sieht zuerst „Pass neu beginnen“. „Lösche deinen Pass“ verbindet es nicht unbedingt mit diesem Knopf. Vorschlag: „Beginne deinen Pass auf diesem Gerät darum nicht neu.“
2. **Der Anfang weicht ab.** Normal heißt es „Sicherung heruntergeladen.“ Wenn der seltene Fall genauso beginnt, sieht das Kind sofort: Das Herunterladen hat geklappt. Erst danach kommt das „aber“. Das macht weniger Angst als ein langer Einstiegssatz.
3. **Ton und Ehrlichkeit sind gut.** „Vielleicht“ ist ehrlich und übertreibt nicht. „Nicht wieder öffnen“ passt zum Knopf „Sicherung öffnen“. Warum die Datei so groß ist, muss niemand wissen; das kann fehlen.
4. **Randnotiz zum Auftrag:** Der Knopf zum Herunterladen heißt im Code „Entdeckerpass sichern“, nicht „Sicherung herunterladen“. Für den Hinweis ist das egal.

**Empfohlene Fassung** (5, 7 und 9 Wörter):
„Sicherung heruntergeladen, aber sehr groß. Vielleicht lässt sie sich nicht wieder öffnen. Beginne deinen Pass auf diesem Gerät darum nicht neu.“

**Alternative** (spricht auch Eltern an, die Browserdaten löschen könnten; das Wort steht schon in der Speicher-Meldung in `earth-explorer.tsx`):
„Sicherung heruntergeladen, aber sehr groß. Vielleicht lässt sie sich nicht wieder öffnen. Behalte deinen Pass darum hier: nicht neu beginnen, keine Browserdaten löschen.“
Nachteil: „Browserdaten“ verstehen Kinder kaum, und der dritte Satz wird länger. Ich empfehle die erste Fassung. Dass Browserdaten löschen den Pass entfernt, steht schon in der Speicher-Meldung im Pass.

**Nebenbefund (nicht gefragt):** Versucht jemand später, so eine große Datei zu öffnen, zeigt `choose()` nur „Die Datei ist zu groß.“ Das klingt knapp und sagt nicht, dass dem Pass nichts passiert ist. Vorschlag: „Diese Sicherung ist zu groß zum Öffnen. Dein Pass auf diesem Gerät bleibt, wie er ist.“

**Unsicher:** Nicht geprüft habe ich, ob die Meldung auf dem Handy gut sichtbar ist und lange genug stehen bleibt. Sie steht unter den Knöpfen, mit `role="status"`.

Dateien: /home/user/wunderkompass/app/progress-panel.tsx (Zeile 13 und 14), /home/user/wunderkompass/app/earth-explorer.tsx (Zeile 350)
