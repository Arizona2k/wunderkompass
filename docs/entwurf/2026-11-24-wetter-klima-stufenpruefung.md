# Stufen-Prüfung „Wetter und Klima“, Endfassung (24.11.2026)

Helfer: `stufen-pruefer`. Gemessen mit `node -e`. Nichts geändert. Entdecker passt, Profi meist. Probleme: `donner-zaehlen` ist kein Experte; `wetter-wolke` doppelt die Hauptfrage der Karte `science-water-cycle`; Profi-Vorrat dünn (mit Ausschluss 4 höchstens 9 bei Runde 8). Vier echte Experte-Aufgaben: berg-eis, regenbogen-morgen, reif-nacht, hagel-sommer (schwächste). Längen unauffällig (Antworten beim Einbau mischen: richtige steht im JSON vorn).

## Einstufung

Entdecker: regen, schnee, wind, sonnig, nebel, satz-heute; zone-gemaessigt und zone-tropen auch Profi; **zone-polar nur Entdecker** (auf Profi löst die Frage sich selbst). Profi: klima-wort, satz-klima, ein-tag, zone-subtropen, tau, regenbogen-wann, gewitterwolke; wolke nur umgebaut; **donner-zaehlen Profi**. Experte: berg-eis (unteres Ende), regenbogen-morgen, reif-nacht, hagel-sommer (knapp).

## Befunde

- **B1** donner-zaehlen → Profi. Neue Experte-Aufgabe `wetter-donner-naeher`: „Der Donner braucht etwa 3 Sekunden für einen Kilometer. Beim ersten Blitz zählst du 12 Sekunden. Beim nächsten nur noch 6. Was passiert?“ richtig „Es kommt näher, jetzt etwa 2 Kilometer entfernt.“; Fallen „Es zieht davon, jetzt etwa 2 Kilometer entfernt.“ / „Es kommt näher, jetzt etwa 6 Kilometer entfernt.“ / „Es zieht davon, jetzt etwa 4 Kilometer entfernt.“; Tipps „Weniger Sekunden heißt: Der Donner hat einen kürzeren Weg.“ / „Wie oft passen 3 Sekunden in 6 Sekunden?“; Sicherheitssatz übernehmen.
- **B2** wolke durch `wetter-atem` (Profi) ersetzen: „An einem kalten Tag siehst du deinen Atem. Warum?“ richtig „Der Dampf im Atem wird zu winzigen Tröpfchen.“; Fallen „Der Dampf im Atem wird in der Kälte weiß.“ / „Im Winter ist mehr Staub in der Luft.“ / „Dein Atem ist im Winter wärmer als sonst.“; Tipp „Denk an den Badspiegel nach dem Duschen.“ (Ausschluss 2 entfällt).
- **B3** Fallen: kein Quatsch; schwach: hagel-sommer falsch[3] → „Im Sommer ist es oben in den Wolken kälter als im Winter.“ (prüfen); regenbogen-wann falsch[2] → „Seitlich zur Sonne, Regen vor dir“.
- **B4** reif-nacht richtige Antwort → „Die Wolken schicken Wärme zum Boden zurück.“ (Tipp „Bettdecke“ bleibt); hagel-sommer richtig → „Er wächst in Gewittern, und die gibt es vor allem an warmen Tagen.“, falsch[1] „Im Winter ist es für Hagel zu kalt.“; ein-tag falsch[3] → „Dieser Sommer wird also kalt und nass.“
- **B5** tau doppelt Karte `science-water-cycle:rate-4` (dort Experte) → Tipp „Das Wasser sitzt nur außen. Was ist rund um das Auto?“; rate-4 später auf Profi.
- **B6** zone-polar `auchProfi: false`.
- **B7** zur Kenntnis: berg-eis und regenbogen-morgen: beide Tipps zusammen fast die Lösung (auf Experte in Ordnung); zone-subtropen Tipp schließt drei Antworten aus (gerade noch).

## Vorrat

Mit den Vorschlägen: zone-polar raus, donner-zaehlen als Profi rein, atem statt wolke, Ausschluss 4 streichen, neu `wetter-wind-fahne` (Profi: „Eine Fahne weht nach Osten. Woher kommt der Wind?“ richtig „Aus dem Westen“; Fallen Osten, Norden, Süden; Tipp „Zeigt eine Fahne zum Wind hin oder vom Wind weg?“) → **12 Profi-Fragen**, Experte 5 (mit donner-naeher). Ausschlüsse 1 und 3 bleiben.

Empfehlungen: 2 donner-zaehlen Profi + donner-naeher; 3 nur zwei Fallen tauschen; 4 wolke → atem; 5 Ausschluss 4 streichen, Vorrat auf 12; 7 zone-polar aus Profi. Neue Fakten (Hagel-Falle, Atem, Fahne, 3-Sekunden-Regel) prüfen `fakten-pruefer` und `kinder-redaktion`.
