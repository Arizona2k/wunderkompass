# Später Fund: Fokusrahmen in Firefox hinter der Leiste (25.11.2026)

Helfer: `technik-pruefer` (sonnet/high), nach der roten Engine-Schnellprüfung (Firefox) in PR #118. Nur Befunde, entschieden hat Claude (Abschnitt „Entscheidungen“ am Ende).

**Ergebnis:** Deine Ursache stimmt, die Korrektur ist richtig. Der Test hat die Lücke aber nur zufällig getroffen, weil er diesen Grenzfall nie gezielt herstellt. Gelesen und gerechnet habe ich nur. Es lief kein Build und kein Browser; `gh` habe ich nur lesend für die CI-Zeiten genutzt.

## Muss

**M1. Test `spiel-fokus` stellt den Grenzfall „Knopf endet 0–12 px über der Leiste“ nicht her.** (`/home/user/wunderkompass/tests/browser/spiel-fokus.mjs:107-126`)
- Der Test stellt das Fenster nur nach „Nächste Aufgabe“ ein (`unten + 4`, Zeile 112). Dieser Knopf liegt dann rund 60 px hinter der Leiste. Das ist der „weit hinter der Leiste“-Fall, den Firefox selbst holt.
- Der Fall, der kaputt war, ist ein anderer: Der Knopf liegt im Fenster, endet aber weniger als 12 px über der Leiste. Den prüft der Test nur zufällig, bei „Erklärung vorlesen“. Dessen Lage hängt an der Höhe von „Nächste Aufgabe“ plus Abstand, also an Schrift-Pixeln.
- Rechnung aus der CI-Meldung: 848 − 781,4 ≈ 66,6 px. Vorlesen endete bei 781,4 und damit 2,6 px über der Leiste (784). Lokal fiel der Wert vermutlich außerhalb des Fensters 772–784. Dann hat Firefox selbst gerollt, und der Test blieb grün. Das erklärt „lokal grün, CI rot“.
- Vorschlag: Nicht mehr das Fenster ändern, sondern vor jedem Tab die Seite so rollen, dass der Zielknopf genau an einer festen Stelle endet.
  - Vor jedem `Tab`: Fokus auf den Vorgänger setzen (`strong` bzw. Vorlesen-Knopf, `preventScroll`).
  - Dann `scrollTo({top, behavior:'instant'})` so, dass `ziel.bottom = unten − abstand` ist, für abstand ∈ {0, 6, 12, 13, −30}. −30 ist der „weit hinter der Leiste“-Fall.
  - Den Aufbau mit `assert` belegen (Abstand ±1 px, Fokus noch beim Vorgänger).
  - Nach `Tab` muss gelten: `bottom + 3 ≤ unten` (wie bisher) und `top ≥ 0`.
  - Das ist bei jeder Schrift gleich, braucht die 3-fache Größenanpassung (Zeile 112) nicht mehr, und es sind nur etwa 10 Tabs, also wenige Sekunden.
  - Der Fall abstand = 12 prüft die Grenze `>` gegen `≥` der Korrektur.
- Setzt du das nicht um, kann jede Schrift- oder Abstandsänderung den Fall wieder zufällig auslassen. Die Suite ist dann nur an manchen Pixelständen ein Wächter.
- Das ist eine Änderung an einer `set: 'ci'`-Suite. Lass sie vor dem Commit einmal in Firefox laufen: `node tests/browser/run.mjs --suite ci --browser firefox spiel-fokus` (in der CI 18,5 s). Die Gegenprobe ohne die Korrektur sollte rot sein.

## Soll

**S1. Warum erst die CI, und die Arbeitsablauf-Lücke (Frage 1).**
- `pnpm run check` läuft in Chromium, dazu WebKit mit `offline-cold` und `backup` (`/home/user/wunderkompass/package.json:21`). Firefox läuft lokal nie.
- `spiel-fokus` hat `set: 'ci'` (`tests/browser/suites.mjs:55`). Die Regel in CLAUDE.md Arbeitsablauf 4 („Suite mit `set: 'full'` einmal laufen lassen“) greift also nicht.
- Der Code-Kommentar in `app/kern/spiel-fokus.ts:30-36` sagt selbst, dass es um ein Firefox-Sonderverhalten geht. Eine Firefox-Probe war trotzdem nirgends vorgeschrieben.
- Der CI-Satz in Firefox dauert in der CI rund 6 min 40 s (Lauf 45619604327, Schritt „CI-Satz in firefox“, 13:03:24 bis 13:10:02). Davon macht `spiel-fokus` nur 18,5 s. Die größten Suiten sind `wissenskarte` (147 s), `kern-huelle` (133 s) und `no-news` (84 s).
- Lokale Firefox-Zeiten gibt es nicht. `.qa-output/browser/zeiten-ci-firefox.json` enthält nur einen alten Teillauf (`backup`, `pass-spielstaende`, 53 s). Der ganze Firefox-Satz lokal dürfte ähnlich lang dauern wie Chromium (343 s).
- Den ganzen Firefox-Satz in `check` aufzunehmen lohnt nicht. Die Engine-Schnellprüfung läuft ohnehin gleichzeitig zum Pflichtjob und braucht gleich lang (beide starteten 13:02:46 bzw. 13:02:51). Der echte Verlust war eine CI-Runde von rund 10 Minuten plus Korrektur.
- Vorschlag (eine Zeile in CLAUDE.md Arbeitsablauf 4): Wer eine Suite oder den Code ändert, dessen Kommentar ein Engine-Sonderverhalten benennt (Firefox/WebKit), lässt genau diese Suite vor dem Commit einzeln in dieser Engine laufen (`--suite ci --browser firefox <name>`, meist unter 30 s). Das wäre hier der Fall gewesen.
- Keinen neuen Pflichtschritt, kein Wächter-Test: Die Regel ist eine Zeile, und die CI fängt den Rest.
- Als „späten Fund“ im CHANGELOG-Eintrag von PR #118 unter Messwerte zählen (späte Funde: 1, erst in der Engine-Schnellprüfung).

**S2. Prüfung in `zurFrage` hat dasselbe Muster.** (`/home/user/wunderkompass/app/kern/spiel-fokus.ts:54`)
- Dort steht `h.getBoundingClientRect().bottom > innerHeight`, die Leiste fehlt. Liegt die neue Frage in den untersten 64 px, steht sie hinter der Leiste, ohne dass die Seite rollt.
- Der Kommentar (Zeile 46-47) verspricht „die ganze Frage zu sehen“.
- Es ist seltener als der gefundene Fall, weil die Frage meist oben im Brett steht. Mit einem Fenster, das nach dem Muster aus M1 eingestellt wird, wäre es aber belegbar.
- Vorschlag: `innerHeight - leiste`, mit derselben `scrollPaddingBottom`-Lesung wie oben. Dazu ein Fall in `spiel-fokus` (Frage endet 0–64 px über dem Fensterrand).

## Kann

**K1.** `zurRueckmeldung` (`app/kern/spiel-fokus.ts:16-28`) ist in Ordnung. Es zieht Leiste und Rand ab (`height + luft <= innerHeight - leiste`) und rollt mit `scrollIntoView`, das den Rand selbst beachtet. Der Fokus geht mit `preventScroll`.

**K2.** Weitere Stellen mit „innerHeight minus fester Zahl“, ohne die 64-px-Leiste. Bei einem Ziel im untersten Streifen bleibt der Fokus dahinter. Nicht gemessen, die Fälle sind seltener, und manche sind absichtlich so gebaut, um Lesestellen zu erhalten:
- `app/earth-explorer.tsx:105` (`returnGuideFocus`, `box.bottom>innerHeight-8`)
- `app/hash-route.ts:44` (`r.bottom>innerHeight-margin`, margin 0 oder 8)
- `app/hash-route.ts:48` und `:52` (Überschriften bei `journeys` und `world`)
- Vorschlag: Eine gemeinsame kleine Hilfe `freierBodenRand()` (liest `scrollPaddingBottom`). Zuerst einen Messfall im Handy-Modus (320×568 mit der Leiste) anlegen, bevor etwas geändert wird. Beim Wechsel zu `center` wäre das Verhalten auf allen Wegen (Zurück, Neuladen, Hash-Link) mit zu prüfen (Regel „Alle Wege prüfen“).

**K3.** Die Rechnung selbst lässt sich ohne Browser prüfen. Das sind die 3 Zeilen aus `imKastenSichtbar` als reine Funktion, z. B. `mussRollen(bottom, rand, hoehe, leiste)`, mit einem Node-Test in `tests/*.test.mjs`. Der prüft `>` an der Grenze in Millisekunden. Das Firefox-Verhalten selbst bleibt beim Browser-Test aus M1.

**K4.** Der Test fordert `bottom + 3 ≤ unten` (Test Zeile 123), die App hält 12 px Rand. Beides ist stimmig, die 3 px sind nur der Fokusrahmen. Stärker wäre `+ 12`. Ob Firefox bei weit entfernten Knöpfen selbst so viel Platz lässt, ist nicht belegt, darum nur „Kann“.

## Geprüft und in Ordnung
- `app/kern/spiel-fokus.ts` ganz (Korrektur im Arbeitsordner, `git status`: nur diese Datei geändert) und `app/kern/kern.css:184` (Leiste 64 px, nur bis 767 px; darüber 0) sowie `:466-476` (Ränder).
- `onFocus={imKastenSichtbar}` hängt in allen drei Spielen (`world-games.tsx:64`, `classic-reason-game.tsx:39`, `knowledge-challenge-game.tsx:39`). Die Korrektur gilt also überall.
- Oben gibt es auf dem Handy keine feste Leiste, nur unten. Eine Entsprechung für „Rand oben“ ist darum nicht nötig.
- CI-Dauer: „Required quality checks“ in Lauf 45619604327 rund 8,7 min bei Grenze 20 (Puffer über 50 %); Engine-Schnellprüfung etwa 7 min bei Grenze 35 min. Beides ist in Ordnung.
- `package.json` (Skripte `check`, `test:browser:webkit`) stimmen mit CLAUDE.md überein.

## Nicht geprüft
- Lokale Firefox-Gesamtdauer, weil dort keine Messung liegt und ich keine Läufe starten sollte.
- Ob Firefox lokal bei 320×568 den Fall trifft: Der Wert hängt an Schrift-Pixeln und ließ sich ohne Browser nicht bestimmen.
- `.speech-player` (fest, `bottom: Leiste + 12 px`, `kern.css:185`) deckt nach „Erklärung vorlesen“ ebenfalls einen Streifen über der Leiste ab. Der zählt weder bei `scroll-padding` noch im Test mit. Ob er den Fokus eines Knopfs verdeckt, habe ich nicht gemessen.
- Pakete, Vercel-Namen, Modellnamen und Unterlagen-Abgleich: nicht Teil dieser Frage, nicht angesehen.

## Entscheidungen (Claude, 25.11.2026)

- **M1 umgesetzt** in PR #118: `tests/browser/spiel-fokus.mjs` rollt die Seite vor jedem Tab so, dass der Knopf genau 13, 12, 6, 0 oder −30 px über der Leiste endet, belegt den Aufbau mit `assert` und misst danach den ganzen Fokusrahmen (`outline-width` plus `outline-offset`, heute 6 px) statt pauschal 3 px. Das nimmt K4 zur Hälfte mit: Gefordert ist der echte Rahmen, nicht der volle Rand von 12 px, weil Firefox bei weit entfernten Knöpfen selbst rollt und das nicht belegt ist. Lauf mit Korrektur: grün in Chromium, Firefox und WebKit. Gegenprobe mit einem Build ohne den Rand in `imKastenSichtbar`: Firefox rot beim Fall 0 px („Erklärung vorlesen“ endet bei 504 px, Rahmen bis 510 px, Leiste ab 504 px); Chromium und WebKit grün, weil sie dort selbst rollen.
- **S1: Vorschlag an den Nutzer** (eine Zeile in `CLAUDE.md`, Arbeitsablauf 4). Steht als offene Frage in `STATUS.md`; `CLAUDE.md` ändert Claude erst nach seinem OK. Der späte Fund zählt im CHANGELOG (späte Funde: 1).
- **S2 im Technik-PR:** `zurFrage` zieht die Leiste ab, dazu ein Fall in `spiel-fokus`.
- **K1:** nichts zu tun.
- **K2 ins BACKLOG** (Eintrag „Fokus und Leiste, Rest“), zusammen mit `.speech-player` aus „Nicht geprüft“ und zwei Funden aus dem Spieltest Technik.
- **K3 nicht umgesetzt:** Der Browser-Test aus M1 trifft die Grenze jetzt in allen drei Engines; ein zusätzlicher Unit-Test der drei Zeilen brächte kaum mehr.
