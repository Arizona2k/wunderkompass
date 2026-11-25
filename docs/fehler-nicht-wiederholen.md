# Fehler nicht wiederholen

Wunsch des Nutzers (25.11.2026): „achtet drauf, dass die Fehler nicht immer wieder passieren, wie zum Beispiel die Limits oder Design-Fehler oder Text-Themen … dass wir so effizienter arbeiten“.

So benutzen wir die Liste:
- Jede Zeile nennt, was passiert ist, und das Gegenmittel. Das Gegenmittel ist möglichst ein Test oder eine Prüfung, die von selbst läuft. Geht das nicht, steht es als Satz in jedem passenden Helfer-Auftrag.
- Neue Zeilen kommen nach jedem späten Fund und nach jedem Helfer-Fund, der wiederkommen kann, im selben PR.
- Claude liest die Liste vor jedem Schritt. `schluss-pruefer` und `technik-pruefer` prüfen jeden Diff dagegen.

## Limits

- **Nutzungslimit des Nutzers:** Claude sieht es nicht. Darum nach jedem Teilschritt committen und pushen und Helferberichte sofort als Datei sichern. Helfer bekommen nur echte Aufgaben, große Aufgaben werden in Pakete geteilt. Nennt der Nutzer einen Stand ab etwa 90 %: nichts Neues mehr starten, alles sichern, `STATUS.md` nachführen, auf sein „Go“ warten.
- **Nur lokale Zweige** (25.11.2026): Der Tier-PR lag stundenlang nur lokal neben dem offenen PR #120. Beim Ende des Chats wäre er verloren gewesen. Gegenmittel: Ein Zweig, der neben einem offenen PR entsteht, wird gleich als `claude/...` gepusht (ohne PR, Vercel baut ihn nicht).
- **Hintergrund-Läufe enden nach 30 Minuten** (25.11.2026): `journeys` braucht lokal rund 44 Minuten und brach nach 29 Minuten ab, ohne Fehler der Seite. Gegenmittel: große Suiten immer mit `timeout: 7200000` starten.
- **Vercel-Tageslimit** (100 Builds in 24 Stunden): gebaut werden nur `test-live` und `vorschau` (`vercel.json`), die Vorschau nur einmal je Runde.

## Chat

- **Falsche Uhrzeiten** (25.11.2026): Claude nannte Uhrzeiten aus dem Container (UTC), der Nutzer liest deutsche Zeit (eine Stunde später, im Sommer zwei). Gegenmittel: Uhrzeiten im Chat immer mit `TZ=Europe/Berlin date` bestimmen (Regel in `CLAUDE.md`).

## Design

- **Neue Grundfarbe macht alte Farben zu blass** (später Fund, 25.11.2026): Das dunklere Papier schob zehn alte Grautöne unter 4,5:1. Gegenmittel: Suite `kontrast` im CI-Satz. Bei jeder Farbänderung zuerst `node tests/browser/run.mjs --suite ci kontrast` laufen lassen.
- **Gleiche Dinge verschieden gebaut** (Knöpfe, Fokus, Rückmeldekästen): nur die Kern-Bausteine aus `app/kern/kern.css` benutzen. Bei jeder sichtbaren Änderung die verwandten Seiten mitprüfen (Regel „Einheitlich und stimmig“). Die Suite `kern-huelle` misst die Bausteine in mehreren Bereichen.

## Texte

- **Verbindungssätze mit mehr als zwei Sätzen** (25.11.2026): Umschreibungen der `kinder-redaktion` brachen die Regel, gefunden erst vom Unit-Test `karten-inhalt`. Gegenmittel: Die Regel „höchstens zwei Sätze je Begründung“ steht in jedem Auftrag an `karten-autor` und `kinder-redaktion`.
- **Neue Kartenquelle bei einem Tier** (25.11.2026): Sie muss auch in `app/animal-inquiries.json` stehen (`sourceUrls` gleich den Kartenquellen, Unit-Test `animal-learning`).
- **Hinweise zeigen auf etwas, das zur falschen Antwort passt** (Clownfisch, 25.11.2026): Der alte Hinweis schickte Kinder zur Zeile „Tiergruppe: Fische“, die zum Clownfisch gehört. Gegenmittel: jeden Hinweis vor dem Einbau gegen die ganze Karte lesen. Ein Hinweis nennt die richtige Antwort nie wörtlich und hat 20 bis 350 Zeichen (Test `challenge`).
- **Wörter, die Kinder anders kennen** („Nesseln“ klingt nach Brennnessel, 25.11.2026): Bei Fachwörtern in Kindertexten fragt Claude die `kinder-redaktion`, bevor der Text eingebaut wird.
- **Fallen, die halb stimmen:** Keine falsche Antwort darf ganz oder halb in der richtigen stecken, und keine Antwort darf in mehr als 80 % ihrer Fälle richtig sein (Unit-Test Ratemuster).

## Tests und Abläufe

- **Text oder Aufbau geändert, Tests vergessen:** alle betroffenen Tests in einem Durchgang suchen, nach dem Wortlaut und nach dem Auslöser (`CLAUDE.md`, Arbeitsablauf Punkt 4).
- **Fokus nach dem Schließen eines Dialogs** kommt bei Radix erst einen Takt später: im Test `fokusZurueck` benutzen, nicht sofort `document.activeElement` (PR #119).
- **Klick auf etwas, das noch rutscht** (Fuß der Startseite): im Test `klickNachRuhe` benutzen.
