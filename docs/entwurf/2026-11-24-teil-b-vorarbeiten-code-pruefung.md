# Teil B, Vorarbeiten: Code-Prüfung (24.11.2026)

Helfer `code-pruefer` (opus / high) auf dem Branch `claude/tender-mccarthy-qz5aob`, Stand des zweiten Zwischenstands.
Geprüft: Globus-Bedienung als nachgeladener Programmteil, Naturatlas-Knopf, „Wolke“, Linkwächter, Wartehilfe vor Seitenwechseln.
Ergebnis: kein Fehler bei Pass, IDs und Hash-Links. Zwei wichtige Risiken, sieben Kleinigkeiten.

## Befunde und was daraus wurde

| Nr. | Befund | Gewicht | Umgesetzt |
|---|---|---|---|
| 1 | Die drei `Suspense` um die nachgeladenen Globus-Knöpfe (`app/earth-explorer.tsx`) hatten keine Fehlergrenze. Scheitert `import("./globus-bedienung")` (kein Netz vor der Offline-Vorbereitung, neue Version ausgeliefert), entfernt React die ganze App: weiße Seite. Vorher lagen die Knöpfe im Startpaket. | wichtig | Jede der vier Stellen (Themenauswahl, Tag-Regler, Kartenauswahl, Ortssuche) hat jetzt eine `LearningBoundary`. Dieselbe Lücke gab es schon vorher bei Neuigkeiten, Tagesentdeckung, „Sichern & mitnehmen“ und „Deine Lernwege“: auch dort jetzt eine Fehlergrenze. Dazu ein letztes Auffangnetz um die ganze App (`migration/main.tsx`). Neue CI-Suite `globus-bedienung` (`tests/browser/globus-bedienung.mjs`): Programmteil absichtlich abgebrochen, Hinweis an der Stelle, Globus bleibt, „Seite neu laden“ bringt die Ortssuche zurück. Grün in Chromium, Firefox, WebKit. Gegenprobe ohne die neuen Grenzen: rot. |
| 2 | Vor dem Schließen fehlte die Ruhezeit (`ruhezeit: 0`). An 9 Stellen ersetzte das ein früheres Warten von 500 ms. Nach einem Hash-Wechsel ist der Programmteil fertig, React blendet aber bis zu 300 ms später ein, erst dann starten Bilder. Das Schließen kann sie abbrechen. | wichtig | Vor dem Schließen zählt die Ruhezeit jetzt ab der letzten Anfrage (`abAufruf: false` in `warteAufRuhe`). Eine lange ruhige Seite schließt sofort, nach frisch geladenem Programmteil wird gewartet. Unit-Test „Schließen kurz nach einem Programmteil wartet auch auf Bilder, die React erst danach einblendet“ (rot mit der alten Regel). |
| 3 | `vorWechsel` warf bei einer Seite ohne Bericht. Im `finally` hätte das den eigentlichen Testfehler verdeckt, und `context.close` wäre nie gelaufen. Heute ohne Folgen. | klein | Wirft nie mehr: ohne Bericht steht die Meldung in `console.error`, geschlossen wird trotzdem. Unit-Test dazu. |
| 4 | Linkwächter: Das `#`-Muster griff nur bei bekanntem Bereich, `'#jorneys/planet'` fiel durch. | klein | Jedes Wort nach `#` zählt; ausgenommen Farbcodes und die Sprungmarke `#learning-main`. Gegenprobe mit `'#jorneys/planet'`: rot. |
| 5 | Linkwächter: `book/why` und `book/atlas` galten als gültig, die App zeigt dort aber den Reiter Wörter. | klein | `BUCH_REITER` nur noch `words`, `notes`, `nature`; beide Adressen in der Gegenprobe. |
| 6 | Linkwächter: `journeys/planet/01` galt als gültig, die App lehnt führende Nullen ab. | klein | Dieselbe Regel wie `app/journey-routing.mjs` (`^[1-9]\d*$`); in der Gegenprobe. |
| 7 | Linkwächter: feste Labor-Liste `navigateHash('labs/'+['seasons',…][i])` (`app/research-labs.tsx`) ungeprüft; Globus-Test fast selbstbezüglich. | klein | Labor-Listen dieser Form werden jetzt geprüft (Gegenprobe mit `'mars'`: rot). Der Globus-Test bleibt als Schutz vor Rückfällen, wie vom Helfer empfohlen. |
| 8 | Jedes `page.reload()` wartet mindestens 500 ms; ein künftiger Test „sofort nach dem Tippen neu laden“ träfe den `pagehide`-Weg nicht mehr. Heute schwächt das keinen Test ab. | klein | Hinweis in `scripts/seitenwechsel.mjs`: solche Tests nehmen `page.evaluate(() => location.reload())`. |
| 9 | Fehlermeldungen ohne Browser-Name, wenn `ladeanfragen` vor der Überwachung läuft. | klein | War im aktuellen Stand schon behoben (der Helfer las eine ältere Fassung): Der Bericht samt Browser-Name kommt mit der Überwachung nach; Unit-Test „jede neue Seite wird gleich beobachtet …“. |

## Vom Helfer geprüft und in Ordnung (Auszug)

- Globus-Bedienung: Werte, Beschriftungen (`aria-labelledby`), Auswahl und Tests mit selbst wartenden Locators wie vorher.
- Naturatlas-Knopf: nur Orte aus `NATURE`; Hauptstädte, Plattenpunkte und Kartenorte führten vorher ins Leere. Alte Links `#book/nature/<id>` unverändert.
- „Wolke“ steht in keinem Wörterverzeichnis.
- Wartehilfe: kein Hängen, `route.fallback()` richtig gezählt, alle entfernten Wartestellen standen vor `reload`, `goto` oder `close`.

## Nicht geprüft (vom Helfer offen gelassen)

- Ob WebKit Abrufe des Service Workers der Seite zuordnet (dann warteten Schließen nach „Für offline vorbereiten“ länger). Die Läufe von `offline-cold` in WebKit sind grün.
- Ob die Seite beim Nachladen der Knöpfe springt (Platzhalter 48 px): nicht gemessen. Offen für den `design-pruefer` (BACKLOG).
