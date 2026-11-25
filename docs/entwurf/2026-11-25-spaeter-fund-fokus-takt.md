# Später Fund: Fokus nach dem Schließen eines Dialogs zu früh geprüft (PR #119)

Stand: 25.11.2026. Später Fund in der CI, Korrektur im Test, Technik-Prüfung nach CLAUDE.md.

## Der Fund

- CI auf PR #119, Head `5854918`: „Engine-Schnellprüfung (webkit)“ rot in `pass-atlas`, `AssertionError: Escape returns focus to pass opener / false !== true` (`tests/browser/pass-atlas.mjs`, Zeile 118). Alle anderen WebKit-Suiten grün, „Required quality checks“ und die Firefox-Schnellprüfung grün.
- Der Code-Diff von PR #119 berührt den Pass nicht. Der Test ist auf `test-live` derselbe; die Lücke ist älter als der PR.
- Lokal lief `pass-atlas` in WebKit sechsmal hintereinander grün.

## Ursache

- Radix (`radix-ui` 1.6.7, `@radix-ui/react-focus-scope` 1.1.16) gibt den Fokus beim Schließen eines Dialogs erst in einem `setTimeout(…, 0)` zurück, also einen Takt nach dem Entfernen des Dialogs (`FocusScope`, Rückgabe im Unmount). Die App lenkt den Fokus dort auf den Öffner (`onCloseAutoFocus` in `components/ui/dialog.tsx`, `returnGuideFocus` in `app/earth-explorer.tsx`).
- Der Test prüfte `document.activeElement` gleich nach `waitFor({state:'detached'})`. Meist ist der Takt bis dahin gelaufen. Für Kinder ist nichts kaputt: Der Fokus kommt nach einem Takt zurück.
- Warum gerade auf dem CI-Rechner in WebKit, ist eine Annahme (Last auf dem geteilten Rechner), nicht gemessen. Das Prüfskript unten zeigt nur: Kommt der Takt spät, wird die alte Prüfung rot.

## Beleg

Ein Prüfskript (nicht im Repository) verzögert alle 0-ms-Takte der Seite auf 400 ms, öffnet den Pass, schließt ihn mit Escape und prüft wie der Test:

| Browser | Verzögerung | sofortige Prüfung (alt) | Wartehilfe (neu) |
|---|---|---|---|
| WebKit | 0 ms | grün | grün |
| WebKit | 400 ms | rot, Fokus auf `BODY` | grün |
| Chromium | 400 ms | rot, Fokus auf `BODY` | grün |
| Firefox | 400 ms | rot, Fokus auf `BODY` | grün |

Gegenprobe: Der Fokus liegt nach dem Schließen absichtlich auf einem anderen Knopf. Die Wartehilfe wird rot. Die Prüfung ist also nicht schwächer geworden.

## Korrektur

- Neue Hilfe `fokusZurueck(ziel, nachricht, timeout = 5000)` in `tests/browser/harness.mjs`. Sie fragt alle 50 ms über den Locator, ob der Fokus auf `ziel` liegt, und prüft danach mit derselben Meldung wie vorher. Kommt der Fokus nicht an, bleibt der Test rot.
- Eingesetzt an allen sieben Stellen mit demselben Muster (Fokusprüfung gleich nach dem Schließen eines Radix-Dialogs):
  - `tests/browser/pass-atlas.mjs`: Escape und „Weiter entdecken“ (Suite `pass-atlas`, CI-Satz, alle drei Browser)
  - `tests/browser/research.mjs`: Suche mit Escape schließen (Suite `research`, Vollprüfung)
  - `tests/browser/discovery-central.mjs`: Suche mit Escape schließen, zweimal (Suiten `core` und `home`, Vollprüfung; die Stelle in `core` fand der technik-pruefer)
  - `tests/browser/audit-ui.mjs`: `closeAndFocus` und Pass schließen (Suite `journeys`, Vollprüfung; bisher nur zufällig durch drei Bildtakte gepuffert, fand der technik-pruefer)
- Unterlagen: Satz zu `fokusZurueck` in `CLAUDE.md` (Abschnitt „Seitenwechsel im Test“). In `CLAUDE.md`, `/pruefen` und im Kopf von `tests/browser/stresslauf.mjs` steht jetzt, dass der Stresslauf keine Takte bremst. Der BACKLOG ist nachgeführt.

## Technik-Prüfung (technik-pruefer, 25.11.2026)

Ergebnis: Die Ursache stimmt im Kern, die Korrektur ist richtig und schwächt nichts ab. Befunde, nach Wichtigkeit:

1. **Weitere Stelle, sicher betroffen:** `discovery-central.mjs:147-148` (Suite `core`), dieselbe Suche wie in `home`. Übernommen.
2. **Weitere Stellen, möglich:** `audit-ui.mjs:16` und `:109` (Suite `journeys`): erst Schließen, dann drei Bildtakte, dann die sofortige Prüfung. Bildtakte sind ein Puffer, aber keine Garantie gegenüber `setTimeout(0)`. Übernommen. Nur ein Hinweis: `audit-ui.mjs:39` und `:94` prüfen sofort, dass der Fokus *nicht* beim alten Öffner liegt, und sind darum schwach. `guides.mjs:31` prüft den Fokus ohne Dialog sofort; ob dort ein Takt im Spiel ist, ist nicht belegt. Beides steht im BACKLOG.
3. **Hilfe robuster:** `elementHandle()` hielt den Knoten fest; zeichnet React ihn neu, hätte die Wartezeit nie zugetroffen. Übernommen: Die Hilfe fragt jetzt jedes Mal über den Locator. Die Wartezeit ist jetzt 5 s statt 3 s, wie `WARTEN` in `tests/browser/kern-huelle.mjs`. Übernommen.
4. **Stresslauf deckt das nicht ab, belegt:** `tests/browser/stresslauf.mjs` ersetzt nur `requestAnimationFrame`; der Radix-Takt bleibt ungebremst. Den Stresslauf beschrieben die Unterlagen „wie auf einem ausgelasteten CI-Rechner“, das war zu weit gefasst. Unterlagen korrigiert. Vorschlag „zweiter Schalter für 0-ms-Takte“ steht mit Aufwand, Risiko und Vorgehen im BACKLOG („Stresslauf auch für Takte“), nicht in diesem PR.
5. **BACKLOG war zu eng:** Der Eintrag vom 24.11. nannte nur `research.mjs:83` und hieß „erst im nächsten Bild“; darum blieb `pass-atlas` unentdeckt. Nachgeführt.

Nicht geprüft (vom technik-pruefer offen benannt): keine eigenen Läufe; die Annahme zum CI-Rechner ist nicht gemessen; `components/ui/alert-dialog.tsx` und Popover-Verwendungen nicht gelesen (in `tests/browser/` keine Popover-Fokusprüfung gefunden).

## Läufe nach der Korrektur

Werden nach dem Abschlusslauf eingetragen.
