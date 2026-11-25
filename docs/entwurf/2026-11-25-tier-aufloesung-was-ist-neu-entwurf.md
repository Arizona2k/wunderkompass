# Entwurf „Was ist neu?“ (Tier-PR, 25.11.2026)

> Helferbericht (karten-autor, opus), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

Ich habe keine Dateien geändert.

**Fassung A (Empfehlung), mit Beispiel wie bei `technik-kurz`:**
```ts
  {id: 'tier-aufloesung', datum: '2026-11-25', symbol: 'lupe', titel: 'Tierspiele: Darum stimmt es', text: 'In drei Tierspielen erfährst du jetzt, warum deine Antwort stimmt. Zum Beispiel: Schleim schützt den Clownfisch vor den Nesseln seiner Seeanemone.'},
```

**Fassung B (zur Wahl), sie nennt auch die Hilfe nach einer falschen Antwort:**
```ts
  {id: 'tierspiele-warum', datum: '2026-11-25', symbol: 'lupe', titel: 'Tierspiele sagen dir, warum', text: 'In drei Tierspielen erfährst du jetzt, warum deine Antwort stimmt. Liegst du daneben, hilft dir eine Frage beim Weiterdenken.'},
```

Der Eintrag kommt ganz oben in `NEUIGKEITEN` hin, über `neue-farben`.

## Warum diese Sätze

- **Titel A** „Tierspiele: Darum stimmt es“ (27 Zeichen): Er ist gebaut wie „Technik-Detektiv: So geht das“. Mit „Tierspiele sind klarer“ (`tierspiele-klarer`, Oktober) kann man ihn nicht verwechseln.
- **Satz 1** (A und B, 10 Wörter): Er sagt in Kindersprache, was neu ist: Nach einer richtigen Antwort kommt eine kurze Erklärung. „Drei Tierspiele“ ist ehrlich, denn es gilt nur für diese drei, nicht für alle Spiele. Ich habe ihn bewusst nicht mit „Liegst du richtig …“ begonnen. Sonst würden zwei Einträge direkt untereinander gleich anfangen.
- **A, Satz 2** (11 Wörter): Ein Beispiel macht die Neuerung greifbar, wie der Luftballon bei der Rakete. „Seeanemone“ steht so auf der Karte und in der Auflösung. „Nesseln“ kennen Kinder von der Brennnessel. Den Vergleich mit der Qualle habe ich weggelassen, damit der Satz kurz bleibt.
- **Titel B** „Tierspiele sagen dir, warum“ (27 Zeichen): Er beschreibt beide Neuerungen und verrät noch nichts.
- **B, Satz 2** (9 Wörter): Er nennt die zweite Neuerung, die Denkfrage nach einer falschen Antwort. „Weiterdenken“ statt „Denkfrage“, weil das Wort beim Vorlesen leichter ist.
- Die kniffligeren Fallen auf Profi stehen in keiner Fassung. Bei zwei Sätzen mit höchstens 13 Wörtern passen nur ein oder zwei Neuerungen hinein. Für Kinder sind die Erklärungen am deutlichsten zu spüren.

Nachgezählt mit `node -e`: Titel 27 und 27 Zeichen, Sätze 10, 11 und 9 Wörter. Kein Satz hat mehr als 13 Wörter.

## Quelle

- **Beispiel in A:** `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/wt-tier/app/world-game-tier-aufloesung.json`, Zeile 211, Feld `detektiv`. Dort steht wörtlich: „Der Echte Clownfisch hat eine Schleimschicht auf der Haut. Sie schützt ihn vor den Fangarmen seiner Seeanemone. Die haben Nesseln wie eine Qualle.“ Mein Satz fasst das zusammen und erfindet nichts dazu.
- **Fassung B, Satz 2:** `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/wt-tier/app/world-game-support.mjs`, Funktion `worldGameWrongFeedback` (ab Zeile 207). Zeile 215 enthält dein Wüsten-Beispiel wörtlich: „Du hast eine trockene Wüste gewählt. Dort gibt es kaum Wasser. Wie wichtig ist Wasser für dieses Tier?“ Auch die anderen Rückmeldungen enden mit einer Frage: bei „Wer frisst was?“ mit „Frisst dieses Tier Pflanzen, andere Tiere oder beides?“, beim Tierdetektiv mit „Passt dein Tier zu jedem Satz im Rätsel?“.
- **Zur Prüfung (⚠):** Der Satz zum Clownfisch ist auf Fassung A umformuliert. Der `fakten-pruefer` sollte kurz schauen, ob „Schleim schützt … vor den Nesseln“ die Auflösung richtig wiedergibt. Dort schützt der Schleim „vor den Fangarmen“, und die Fangarme „haben Nesseln“.

## Weitere Prüfpunkte

- **IDs:** `tier-aufloesung` und `tierspiele-warum` kommen in der Datei nicht vor. Ich habe alle 76 vorhandenen IDs mit `grep` durchgesehen.
- **Symbol:** `lupe`, wie bei `technik-kurz` und `tierspiele-klarer`.
- **Umformuliert:** keine.

## Offen

- Du entscheidest zwischen A und B. Ich empfehle A: Es ist anschaulicher und baugleich mit `technik-kurz`. B ist vollständiger, aber trockener.
- Die Länge prüft danach der Unit-Test, den Ton die `kinder-redaktion`. Ich habe beides nicht selbst als geprüft gewertet.
