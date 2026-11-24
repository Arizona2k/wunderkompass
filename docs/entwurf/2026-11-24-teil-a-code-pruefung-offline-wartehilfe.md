# Code-Prüfung der Offline-Wartehilfe (24.11.2026)

Bericht des Helfers `code-pruefer` vom 24.11.2026, wortgetreu gesichert. Auftrag: Commit `ae5810c` („Offline-Test wartet vor dem Neuladen; Fokus-Tests nach Nachprüfung“) prüfen. Darin: die Wartehilfe `ladeanfragen` vor dem Neuladen in `offlineRetainedAnswerWording` und in `karte-stufen.mjs`, das Leeren in der Capture-Phase in `FOKUS_NACH_KLICK`, Kommentare und Entscheidungsliste. Was daraus umgesetzt wurde, steht in der [Entscheidungsliste Teil A](2026-11-23-teilschritt-3-teil-a-entscheidungen.md), Abschnitt „Zeitweiser Fund in `pnpm run check`“.

---

**Ergebnis:** Bereit, mit einem offenen Punkt: Das Ergebnis des laufenden Firefox-Laufs von `offline-cold` muss noch abgewartet werden (siehe Befund 1). Keinen der Befunde musst du vor dem Merge beheben.

## Befunde

**Wichtig (beobachten, nicht ändern)**

1. **`ladeanfragen` läuft hier zum ersten Mal auf einer Seite, die der Service Worker bedient.** Fundstelle: `/home/user/wunderkompass/tests/browser/offline-cold.mjs:75`.
   - Online ist die Seite in den anderen Suiten nicht vom Worker gesteuert, denn der Worker registriert sich erst bei „Für offline vorbereiten“ (`app/learning-offline.tsx:60-74`).
   - Die Wartehilfe verlässt sich darauf, dass die Engine für jede Antwort aus dem Worker `requestfinished` oder `requestfailed` meldet. Für Chromium ist das belegt (dein grüner Lauf). Für WebKit spricht der Lastlauf mit 0 von 12 dafür.
   - Für Firefox ist das noch nicht belegt.
   - Konkreter Fall: Meldet Firefox das Ende einer Antwort aus dem Worker nicht, bleibt die Anfrage in `offen` stehen. `anfragenFertig()` bricht dann nach 20 s mit „Anfragen laufen noch vor dem gewollten Seitenwechsel: <URL>“ ab. Das wäre ein falscher roter Lauf, aber ein laut benannter.
   - Vorschlag: den laufenden Firefox-Lauf (und `offline-cold-full`) genau daraufhin ansehen. Kommt diese Meldung, liegt es an der Engine und nicht an der App.

**Klein**

2. **Der Standardwert `anfragenFertig=ladeanfragen(p)` schützt nur halb und verdeckt ein vergessenes Argument.** Fundstelle: `/home/user/wunderkompass/tests/browser/retained-answer-wording.mjs:62`.
   - Ein Lauscher, der erst beim Aufruf entsteht, sieht keine Anfrage, die schon läuft. Weil `offen.delete` dann `false` ergibt, verschiebt ihr Ende auch `zuletzt` nicht.
   - Das erste `reload()` kommt aber gleich am Anfang der Funktion. Mit dem Standardwert wartet es nur 500 ms Ruhe und zwei Bildwechsel; ein Bild, das schon vorher lud, zählt nicht mit.
   - Heute ungenutzt: Beide Aufrufer übergeben die Wartehilfe (`offline-cold.mjs:102`, `:106`). `offlineAnimals` reicht `undefined` nur durch, wenn sie jemand ohne drittes Argument aufruft (`animal-learning.mjs:194`).
   - Vorschlag: Standardwert weglassen und bei fehlendem Argument mit klarer Meldung abbrechen. Oder den Kommentar ergänzen: „Notlösung, sieht bereits laufende Anfragen nicht“.
3. **Kommentar und Entscheidungsliste sind ungenau: Das erste der drei Neuladen läuft nicht auf der Seeadler-Karte.** Fundstellen: `retained-answer-wording.mjs:59` und `/home/user/wunderkompass/docs/entwurf/2026-11-23-teilschritt-3-teil-a-entscheidungen.md`, Abschnitt „Zeitweiser Fund“ („lädt dort dreimal neu“).
   - Das erste `reload()` läuft auf der Seite, die der Aufrufer hinterlässt: im CI-Satz `science-energy`, in der Vollprüfung das letzte Foto aus `offlineWorldPhotos`.
   - Die Seeadler-Karte wird erst danach per Hash geöffnet, also kamen die Seeadler- und Pinguin-Abbrüche aus dem zweiten oder dritten Neuladen.
   - Die Korrektur deckt alle drei ab; nur die Beschreibung stimmt nicht ganz.
4. **`mitKarte` schließt den Kontext ohne Wartehilfe.** Fundstelle: `/home/user/wunderkompass/tests/browser/karte-stufen.mjs:38`.
   - `fastRichtig` (`:185-189`) und `ordneRichtig` (`:230-234`) kehren direkt nach Neuladen und einem `waitFor` zurück. Danach folgt sofort `context.close()`, während Kartenbild und „Dazu passt“-Bilder noch laden können.
   - Ob die Überwachung Abbrüche beim Schließen überhaupt meldet, ist unklar; Playwright liefert nach dem Schließen meist keine Ereignisse mehr. Bisher ist es nicht aufgefallen.
   - Das gehört zur Klasse „Schließen“ im BACKLOG; heute keine Änderung nötig.
5. **Hinweis außerhalb des Auftragsbereichs, aber im selben CI-Lauf von `offline-cold`:**
   - `/home/user/wunderkompass/tests/browser/learning-task-offline.mjs:43` und `:45` laden offline je Fall ohne Wartehilfe neu, auf einer Reise-Seite, insgesamt 8 Mal.
   - Das ist dieselbe Klasse in derselben WebKit-Kurzprüfung. Der Lastlauf (0 von 12) spricht dafür, dass es dort ruhig ist.
   - Wenn `offline-cold` in WebKit wieder rot wird, zuerst hier nachsehen.
6. **Veraltete Zahlen im BACKLOG.** Der Punkt „Seitenwechsel im Test“ nennt noch „67 `reload` und 95 `close`“. Gezählt in `tests/browser` sind es jetzt 76 `.reload(` und 128 `.close()`. Das ist alter Text, aber der Punkt wurde in diesem Commit angefasst.

## Antworten auf deine Fragen

**1. Falscher roter Lauf durch die frühe Wartehilfe?** Keine Anfrage gefunden, die im kalten Offline-Kontext nie endet:
- Der Worker fragt offline nicht nach Updates (`if (navigator.onLine) registration.update()`, `app/learning-offline.tsx:73`).
- In `app/`, `lib/` und `components/` gibt es kein Abfragen im Takt, kein EventSource, kein WebSocket und keine Medien. Die zwei `setInterval` in der App laden nichts.
- Die eigenen Abrufe des Workers (Cache, Skriptabruf) zählen nicht zu den Seitenanfragen, die `page.on('request')` sieht. Die Schrift kommt aus dem Vorrat und endet.
- Die einzigen Anfragen, die Tests absichtlich festhalten (`page.route` in `world-photos.mjs:139/152`, `animal-learning.mjs:262`), liegen im Online-Teil und nicht im Offline-Pfad.

Zur langen Lebensdauer in `offline-cold-full`:
- Der Lauscher lebt bis `context.close()` und hält nur offene Anfragen. Gefährlich wäre nur eine einzige „verlorene“ Anfrage irgendwo in `offlineSolar`, den 48 Tierkarten oder `offlineWorldPhotos`: Dann bricht der erste Aufruf nach 20 s ab, mit der URL in der Meldung.
- Dasselbe Muster läuft online schon in `animalNavigation` über alle Karten (`animal-learning.mjs:208`). Neu ist nur die Offline-Lage (Befund 1).

**2. Weitere Seitenwechsel ohne Wartehilfe?**
- `offlineRetainedAnswerWording`: Alle drei `reload()` warten jetzt. Sonst gibt es dort keinen Seitenwechsel.
- `offlineAnimals`: `exerciseAnimal` (`animal-learning.mjs:83`) und `inspectCatalogPhoto` (`world-photos.mjs:101`) wechseln nur den Hash.
- `animalCompactOriginFlow` ruft `p.goBack()` auf (`animal-learning.mjs:64`). Das bleibt im selben Dokument, weil die App über den Hash navigiert; die Seite lädt dabei nicht neu und bricht keine Anfragen ab. Theoretisch bleibt nur React, das ein ladendes Bild entfernt; das gilt für alle Hash-Wechsel und ist mit Bildern aus dem Vorrat unwahrscheinlich.
- `karte-stufen.mjs`: Die drei Neuladestellen sind abgedeckt (`:81`, `:184`, `:229`). Offen bleibt nur das Schließen in `:38` (Befund 4).

**3. Standardwert:** Siehe Befund 2. Er ist harmlos, solange alle Aufrufer übergeben, verdeckt aber ein vergessenes Argument mit schwächerem Schutz.

**4. Leeren in der Capture-Phase** (`harness.mjs:151-154`): Das stimmt.
- `window` steht am Anfang des Capture-Wegs. Das Init-Skript meldet sich vor jedem Seitenskript an, also läuft das Leeren zuerst, auch wenn ein späterer Lauscher `stopImmediatePropagation` aufriefe.
- `click()`, `tap()` (der Browser erzeugt danach ein `click`) und Enter auf `<button>` lösen jeweils ein echtes `click` mit vollem Weg aus.
- Ein verschachtelter Klick (Label oder `el.click()` in einem Handler) endet mit dem Wert des äußeren Bubble-Lauschers, ist also richtig.
- Alle 9 Fokusprüfungen (`karte-stufen.mjs` über `fokusAuf`, `pass-spielstaende.mjs:149` und `:159`) folgen direkt auf einen Klick, Tipp oder Enter, nie auf ein Neuladen ohne Klick.
- Rot werden kann es nur, wenn ein späterer Klick unterwegs angehalten wird. Das ist so gewollt; in der App ruft niemand `stopPropagation` auf (laut voriger Nachprüfung).

**5. Kommentare und Entscheidungsliste:** Sie stimmen bis auf Befund 3.
- `karte-stufen.mjs:100` ist weicher gefasst, wie in der Liste beschrieben.
- `pass-spielstaende.mjs:151` sagt jetzt „Tab“; der Code drückt Tab, von Entdecker zu Profi.
- `harness.mjs:23` und `browser-warten.test.mjs:3` nennen die WebKit-Meldung.
- Die Aussagen „gleich nach dem Öffnen angelegt“ (`offline-cold.mjs:73-75`), „über `offlineAnimals`“ und „drei Neuladestellen“ stimmen.
- „Kein später Fund“ passt zur Regel in CLAUDE.md.
- Nicht nachprüfbar: dass `check-a17`, `check-a18` und die CI vorher grün waren.

## Geprüft
- `git show ae5810c` ganz.
- `harness.mjs:17-87` und `:146-154`, `offline-cold.mjs` ganz.
- In `animal-learning.mjs`: `offlineAnimals`, `exerciseAnimal` (nur Navigation), `animalCompactOriginFlow`, Vergleichsstellen `:150-155` und `:220-245`.
- `world-photos.mjs`: `inspectCatalogPhoto` und `offlineWorldPhotos`.
- `retained-answer-wording.mjs`: Kopf und Offline-Funktion.
- `karte-stufen.mjs` ganz, `karte-hilfen.mjs`: `stufeWaehlen`, `karteDa`.
- `pass-spielstaende.mjs:135-165`.
- `scripts/browser-errors.mjs`: Behandlung von `requestfailed`.
- `app/learning-offline.tsx:25-80`; Suche nach Takt-, Medien- und Socket-Anfragen in der App.
- Die Reload-Stellen in `learning-task-offline.mjs`; BACKLOG-Diff und Entscheidungsliste.

## Nicht geprüft
- Keine Tests, keine Browser-Suiten, kein Build gestartet (wie verlangt).
- Ob Firefox `requestfinished` für Antworten aus dem Worker meldet (Befund 1): nur durch den laufenden Lauf zu klären.
- Ob Playwright beim `context.close()` Abbrüche an die Überwachung meldet (Befund 4).
- Die übrigen `reload()`- und `close()`-Stellen außerhalb der genannten Pfade.
