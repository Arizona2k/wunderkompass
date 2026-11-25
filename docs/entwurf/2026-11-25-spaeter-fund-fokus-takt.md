# Später Fund: Fokus nach dem Schließen eines Dialogs zu früh geprüft (PR #119)

Stand: 25.11.2026. Später Fund in der CI, Korrektur im Test, Technik-Prüfung nach CLAUDE.md.

## Der Fund

- CI auf PR #119, Head `5854918`: „Engine-Schnellprüfung (webkit)“ rot in `pass-atlas`, `AssertionError: Escape returns focus to pass opener / false !== true` (`tests/browser/pass-atlas.mjs`, Zeile 118). Alle anderen WebKit-Suiten grün, „Required quality checks“ und die Firefox-Schnellprüfung grün.
- Der Code-Diff von PR #119 berührt den Pass nicht. Der Test ist auf `test-live` derselbe; die Lücke ist älter als der PR.
- Lokal lief `pass-atlas` in WebKit sechsmal hintereinander grün.

## Ursache

- Radix (`radix-ui` 1.6.7, `@radix-ui/react-focus-scope` 1.1.16) gibt den Fokus beim Schließen eines Dialogs erst in einem `setTimeout(…, 0)` zurück, also einen Takt nach dem Entfernen des Dialogs (`FocusScope`, Rückgabe im Unmount). Die App lenkt den Fokus dort auf den Öffner (`onCloseAutoFocus` in `components/ui/dialog.tsx`, `returnGuideFocus` in `app/earth-explorer.tsx`).
- Der Test prüfte `document.activeElement` gleich nach `waitFor({state:'detached'})`. Meist ist der Takt bis dahin gelaufen; auf einem ausgelasteten CI-Rechner in WebKit kam die Prüfung manchmal davor. Für Kinder ist nichts kaputt: Der Fokus kommt nach einem Takt zurück.

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

- Neue Hilfe `fokusZurueck(ziel, nachricht, timeout = 3000)` in `tests/browser/harness.mjs`: wartet, bis der Fokus auf `ziel` liegt, und prüft dann mit derselben Meldung wie vorher. Kommt der Fokus nicht an, bleibt der Test rot.
- Eingesetzt an allen vier Stellen mit demselben Muster (sofortige Fokusprüfung nach dem Schließen eines Radix-Dialogs):
  - `tests/browser/pass-atlas.mjs`: Escape und „Weiter entdecken“ (Suite `pass-atlas`, CI-Satz)
  - `tests/browser/research.mjs`: Suche mit Escape schließen (Suite `research`, Vollprüfung)
  - `tests/browser/discovery-central.mjs`: Suche mit Escape schließen (Suite `home`, Vollprüfung)

## Technik-Prüfung

Der `technik-pruefer` läuft (Auftrag: Ursache und Korrektur kritisch prüfen, weitere Stellen suchen, warum erst in der CI, Stresslauf, Unterlagen). Sein Bericht kommt hier hinein, bevor die Korrektur gemeldet wird.
