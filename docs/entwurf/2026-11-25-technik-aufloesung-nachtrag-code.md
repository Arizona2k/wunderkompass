# Code-Prüfung Technik-PR (25.11.2026)

Helfer: `code-pruefer` (opus / high), Diff des Branchs gegen `origin/test-live`. Entscheidungen dazu: [Nachtrag, Abschnitt 7](2026-11-25-technik-aufloesung-nachtrag-entwurf.md#7-entscheidungen).

**Ergebnis:** Mit Änderungen bereit. App-Code, Pass und IDs sind in Ordnung, aber der neue Block in `spiel-fokus.mjs` ist wackelig: In 2 von 5 Läufen war er rot.

## Befunde

**Muss**

1. `tests/browser/spiel-fokus.mjs:150-158` (Runden n = 2 und 3 im neuen Block): Der Test ist nicht deterministisch.
   - Gemessen: 5 Läufe von `node tests/browser/run.mjs --suite ci spiel-fokus` in Chromium auf dem vorhandenen `dist` (gebaut nach dem letzten Commit). Zwei davon brachen ab mit: `world:technology, 320 × 400 px, große Schrift: neue Frage endet 2 px über dem Fensterrand: Testaufbau stimmt nicht (null)` (Zeile 173).
   - Wahrscheinliche Ursache (begründet, nicht einzeln nachgewiesen): Nach `antworte(...)` wartet der Test nur auf `> .primary-button`. Der Knopf steht schon da, wenn React rendert. `zurRueckmeldung` läuft aber erst danach in einem `requestAnimationFrame`. Der Kasten ist dort 394 px hoch, frei sind nur 336 px, also geht der Fokus auf die Überschrift „Richtig!“. Setzt der Test den Fokus auf „Nächste Aufgabe“, bevor dieses Bild kommt, nimmt `zurRueckmeldung` ihn danach weg. Das `Enter` trifft dann die Überschrift, es gibt keinen Klick, und `__neueFrage` bleibt `null`. Runde 1 ist sicher, weil vorher die Tab-Schleife wartet.
   - Vorschlag: In Runde 2 und 3 nach `antworte` so warten wie im ersten Antwortblock, also mit `waitForFunction` auf `__lage(kasten)` mit `!passt && titelHatFokus`. Erst danach den Knopf fokussieren. Dann die Suite mehrmals laufen lassen.

**Soll**

- Keine.

**Kann**

1. `app/kern/spiel-fokus.ts:57`: `zurFrage` rollt zum Anfang des Bretts. Ist Stufenzeile plus „Aufgabe … von …“ plus Frage höher als `innerHeight - leiste`, bleibt die Frage auch danach teilweise hinter der Leiste. Es gibt keinen zweiten Schritt.
   - Bei 320 × 400 und großer Schrift sind nur 336 px frei. Für die drei Testfragen hat es gereicht, für lange Fragen ist es nicht belegt. Auf normal hohen Handys ist es unwahrscheinlich.
   - Falls gewünscht: Danach prüfen, ob die Frage noch hinter der Leiste endet, und dann `h.scrollIntoView({block: 'nearest'})` aufrufen.
2. `tests/browser/spiel-fokus.mjs:150-154`: Das Warten auf den Pass-Index fragt 50 Mal mit `waitForTimeout(100)` nach. Begrenzt und unkritisch, aber `page.waitForFunction` wäre knapper.
3. `app/world-game-support.mjs:184-188`: `TECHNIK_FALSCH` und sein Kommentar stehen zwischen dem Kommentar „Auf Profi und Experte …“ und `PERSONEN_FALSCH_PROFI`. Der Personen-Kommentar steht dadurch nicht mehr bei seiner Konstante. Besser über Zeile 184 oder hinter Zeile 188.
4. Inhaltlich, nur am Rand: Der neue Tipp und `TECHNIK_FALSCH` enden fast gleich („… passt zu allem, was in der Aufgabe steht?“). Der Unit-Test prüft nur, dass der ganze Tipp nicht wörtlich vorkommt. Das ist eine Frage für die Kinder-Redaktion, kein Codefehler.

## Geprüft und in Ordnung

- **Pass und gespeicherte Antworten:**
  - In `world-game-bank.ts:55` ändert sich nur `why`. Antwortoptionen, `correct`, IDs und Reihenfolge der Fallen bleiben gleich.
  - Gespeicherte `orders` und `items` im Pass bleiben darum gültig. `invention-optics-game-bank.test.mjs` mit `retained-optical-game-banks.json` ist grün.
  - `gespeicherte-antworten*.json` enthält nur Kartenfragen aus `world-catalog.json`. Der Katalog ist nicht geändert, die Fixtures auch nicht.
  - Auflösung und Tipp sind keine Antwortoptionen.
- **`zurFrage`:**
  - Am Rechner ist `scroll-padding-bottom` nicht gesetzt. Der Wert ist dann „auto“ oder leer, `parseFloat` ergibt NaN, also 0. Damit gilt das alte Verhalten.
  - Auf dem Handy ergibt `calc(64px + env(...))` einen px-Wert.
  - Rollen geht nur nach unten und nur einmal, es gibt kein Springen oder Pendeln.
  - Der Kopf ist nicht fest oben, `scroll-margin-top: 12px` am Brett wird beachtet.
  - Die Aufrufer in `knowledge-challenge-game.tsx` und `classic-reason-game.tsx` laufen über GameShell mit `.game-board`.
- **Neuer Test, wenn er läuft:**
  - Er nimmt feste Aufgaben (`LANGE_RUNDE`) und prüft seinen Aufbau selbst (`neu`, `fehler ≤ 1`, `brett ≥ 0`).
  - Alle drei Abstände (62, 32 und 2 px) liegen hinter der 64-px-Leiste. Ohne die Korrektur würde `zurFrage` also nicht rollen, der Test zielt auf den richtigen Fehler.
  - Die Reihenfolge der beiden `requestAnimationFrame` (zuerst der Lauscher am Fenster in der Capture-Phase, danach React) ist schlüssig.
- **`max-width: 65ch` (`kern.css:479`):**
  - Trifft nur direkte `p` in `.lab-feedback` und `.game-feedback` innerhalb von `.game-room`.
  - `.game-room` setzt nur GameShell (Welt-Spiele, `learning-games.tsx`, `advanced-games.tsx`). Labore, Karten und das Wissensbuch sind nicht betroffen.
  - Es gibt keine Flex- oder Grid-Anordnung und keine zentrierte Rückmeldung. `.game-win p` ist kein direktes Kind.
  - Die Regel macht Absätze nur schmaler und bricht keine Anordnung.
- **`game-index.json` und `world-games.tsx`:**
  - Der Text ist in beiden gleich.
  - Verglichen werden die beiden Dateien nur über IDs (`linkwaechter.test.mjs:176ff`, `pass-spielstaende`).
  - `exports/content/games.json` und `index.json` (Bytes, sha256) passen zum neuen Text.
- **Alte Texte:** Die alten Tipp- und Kartentexte („Worum geht es im Text“, „Welches Problem löst …“) kommen in keinem Test mehr vor.
- **Browser-Suiten:** `world-game-offline-semantics` und `world-game-learning-copy` prüfen den Technik-Detektiv nicht über die alte Rückmeldung.
- **Läufe:** `pnpm test` (556 grün), `pnpm run typecheck` und `pnpm run lint` sauber. Die Suite `spiel-fokus` habe ich 5 Mal in Chromium laufen lassen: 3 grün, 2 rot.

## Nicht geprüft

- `spiel-fokus` in Firefox und WebKit.
- Ob die untere Leiste bei großer Schrift wirklich nur 64 px hoch ist. Das gilt für alle Hilfen, die `scroll-padding-bottom` nutzen, nicht nur für diesen PR.
- Die Höhe von Brett und Frage bei 320 × 400 für alle 24 Erfindungen.
- Fachlicher Inhalt der Auflösungen (das ist Sache von Fakten-Prüfer und Kinder-Redaktion).
- Offline und Service Worker: Es ist keine neue Datei dazugekommen, daher nicht nötig.
