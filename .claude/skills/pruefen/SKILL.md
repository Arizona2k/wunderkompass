---
name: pruefen
description: Vor einer Übergabe in WunderKompass – komplette Prüfkette laufen lassen, passende Helfer je nach Änderung beauftragen und die Ergebnisse gesammelt und ehrlich berichten.
---

# /pruefen – Prüfen vor der Übergabe

1. **Was hat sich geändert?** `git diff origin/test-live...HEAD --stat` und `git status --short`. Ordne die Änderungen ein: Text, Fakten, Design, Code, Bilder.
2. **Prüfkette:** Im Cloud-Container `export PATH=/opt/node24/bin:$PATH`, dann `pnpm run check` (typecheck, lint, test, build, Browser-CI-Satz). Lange Ausgaben in eine Datei im Scratchpad umleiten und das Ende lesen. Bei Rot: Ursache klären und beheben, nicht blind wiederholen.
3. **Stresslauf** (vor jedem PR): `QA_FRAME_DELAY_MS=150 pnpm run test:browser -- --browser webkit` (rund 6 Minuten, ohne Bremse rund 5; gemessen am 24.11.2026). Jedes Bild der Seite kommt dabei 150 ms später, wie auf einem ausgelasteten CI-Rechner (`tests/browser/stresslauf.mjs`). Rot heißt meist: Die Seite setzt etwas erst im nächsten Bild, der Test fragt sofort. Erst die Ursache klären (Seite, Test oder Bremse), dann beheben; die Verzögerung nicht senken. Braucht den Build aus Schritt 2.
4. **Rauchtest-Bilder:** `pnpm run test:smoke` und die Bilder in `.qa-output/browser/chromium/smoke/` selbst ansehen.
5. **Helfer je nach Änderung** (parallel beauftragen, mit genauer Fundstelle und kleinem Auftrag). Vorher: Steht jeder nötige Helfer in der Helferliste dieses Chats? Fehlende von Hand einsetzen (`CLAUDE.md`, Abschnitt Helfer), nie still weglassen.
   - Texte für Kinder → `kinder-redaktion`
   - neue oder geänderte Aussagen, Zahlen, Verbindungen → `fakten-pruefer`
   - sichtbare Änderungen → `design-pruefer` (Breiten 320, 390, 768, 1280, 1440 px)
   - Code, besonders Pass, IDs, Links, Offline → `code-pruefer`
   - neue Bilder → `bild-recherche` (Nachweis prüfen)
   - am Phasenende und wenn ein Fehler erst spät auffiel (z. B. erst in der CI-Vollprüfung oder in `test:full`) → `technik-pruefer`, Pflicht, bevor die Korrektur gemeldet wird
6. **Befunde behandeln:** Blockierendes sofort beheben und Schritt 2 und 3 wiederholen. Alles andere ins `BACKLOG.md`.
7. **Am Phasenende zusätzlich:** `pnpm run test:full` (lokal mit `-- --browser all` oder gezielt `--browser webkit <suite>`; dazu der CI-Job „Vollprüfung“ in allen drei Engines) und eine Schlussprüfung des ganzen Branches mit `fable`. Vorher „Vorübergehende Modell-Ausnahmen“ in `STATUS.md` lesen: Läuft eine Ausnahme noch, das dort genannte Ersatzmodell nehmen.
8. **Bericht** an den Nutzer, ehrlich und kurz:
   - Was wurde geprüft, mit welchem Ergebnis (grün / rot / nicht geprüft)?
   - Welche Helfer-Befunde gab es, was ist behoben, was steht im BACKLOG?
   - Was wurde nicht geprüft (zum Beispiel echte Geräte, Bildschirmleser, Firefox oder WebKit, wenn sie nicht liefen)?

Keine Prüfung als bestanden melden, die nicht gelaufen ist. Teilprüfungen heißen Teilprüfungen.
