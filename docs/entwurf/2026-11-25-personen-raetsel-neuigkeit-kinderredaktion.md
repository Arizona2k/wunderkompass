# „Was ist neu?“ zu den neuen Rätseln: Prüfung der Kinder-Redaktion (25.11.2026)

Helfer: `kinder-redaktion`. Eingebaut wird die Neufassung unten.

**Gesamteindruck:** A ist nah dran (Note: gut bis geht so). Ohne kleine Änderung passt aber weder A noch B. A nennt das Spiel nur im Titel, und „das ganze Rätsel“ klingt nach mehr Hilfe statt nach schwerer. Bei B ist der Text besser, der Titel aber nicht. Mein Vorschlag nimmt den Titel von A und einen Text aus beiden.

**Befunde**

1. **Titel von B, „Jeder Mensch hat sein Rätsel“:** Allein gelesen ist der Satz mehrdeutig. Ein Kind versteht ihn so, als ginge es um alle Menschen. Genau das ist das Risiko, das du nennst. Nicht nehmen.
2. **Text von A, „Alle 36 Menschen …“:** Der Titel nennt das Spiel, darum lässt sich der Satz gerade noch verstehen. Der Text selbst sagt aber nicht, wo die Menschen sind. Wer zuerst den Text liest oder ihn vorgelesen bekommt, versteht ihn falsch. Vorschlag: „Jeder der 36 Menschen im Spiel …“.
3. **Text von A, „als Profi das ganze Rätsel“:** Für Kinder ist das unklar und führt in die falsche Richtung. Mehr Text klingt nach mehr Hilfe, also nach leichter. Schwerer wird es aber wegen der falschen Namen aus demselben Gebiet. B sagt das ehrlich mit „als Profi wird es kniffliger“. Diese Wendung übernehmen.
4. **Text von B, „hilft dir ein neuer Tipp“:** „Tipp“ gibt es auf der Seite schon als eigene Hilfe, siehe den Eintrag `tipp-statt-loesung` („Steckst du fest, gibt es einen Tipp“). Kinder suchen dann womöglich einen Tipp-Knopf. „Ein leichter Satz“ aus A beschreibt genau, was das Kind auf dem Bildschirm sieht. Den also behalten.
5. **Experte:** Dass die Stufe fehlt, ist in Ordnung. Der Eintrag `spiele-mit-stufen` nennt auch nur „Profi“, und Experte spielt hier wie Profi. Wer es ganz genau will, schreibt „als Profi und Experte“. Das passt noch in die Grenze (147 Zeichen), macht den Satz aber schwerer.

**Neufassung (empfohlen)**

- Titel: „Neue Rätsel bei „Wer war das?““ (30 Zeichen, unverändert aus A)
- Text: „Jeder der 36 Menschen im Spiel hat jetzt ein eigenes Rätsel. Als Entdecker liest du einen leichten Satz, als Profi wird es kniffliger.“ (134 Zeichen, 2 Sätze)

Die Regeln aus `tests/neuigkeiten.test.mjs` sind eingehalten. Das „?“ in „das?“ steht direkt vor dem schließenden Anführungszeichen. Der Test zählt es darum nicht als Satzende, das gilt auch für den Titel. Zum Vergleich: A hat 120 Zeichen, der erste Satz von B 70.

Ton und Länge passen zu den Einträgen vom 24.11. Zum Symbol: `stern` würde zu `spiele-mit-stufen` passen. Das ist nur eine Anregung.

**Für „Mehr erfahren“:** Entfällt, die Einträge in „Was ist neu?“ haben kein Feld dafür.

**Unsicher:** Ich habe nicht nachgesehen, ob das Spiel auf der Stufe Entdecker irgendwo selbst „Tipp“ oder „Hinweis“ für diesen Satz sagt. Falls ja, sollte der Eintrag dasselbe Wort benutzen. Die Fakten (36 Menschen, Aufbau der Stufen) habe ich so aus deinem Hintergrund übernommen. Gelesen habe ich nur /home/user/wunderkompass/app/kern/neuigkeiten.ts und /home/user/wunderkompass/tests/neuigkeiten.test.mjs.
