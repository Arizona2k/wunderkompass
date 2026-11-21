---
name: pruefen
description: Vor einer Übergabe in WunderKompass – komplette Prüfkette laufen lassen, passende Helfer je nach Änderung beauftragen und die Ergebnisse gesammelt und ehrlich berichten.
---

# /pruefen – Prüfen vor der Übergabe

1. **Was hat sich geändert?** `git diff origin/test-live...HEAD --stat` und `git status --short`. Ordne die Änderungen ein: Text, Fakten, Design, Code, Bilder.
2. **Prüfkette:** Im Cloud-Container `export PATH=/opt/node24/bin:$PATH`, dann `pnpm run check` (typecheck, lint, test, build, Browser-CI-Satz). Lange Ausgaben in eine Datei im Scratchpad umleiten und das Ende lesen. Bei Rot: Ursache klären und beheben, nicht blind wiederholen.
3. **Rauchtest-Bilder:** `pnpm run test:smoke` und die Bilder in `.qa-output/browser/chromium/smoke/` selbst ansehen.
4. **Helfer je nach Änderung** (parallel beauftragen, mit genauer Fundstelle und kleinem Auftrag):
   - Texte für Kinder → `kinder-redaktion`
   - neue oder geänderte Aussagen, Zahlen, Verbindungen → `fakten-pruefer`
   - sichtbare Änderungen → `design-pruefer` (Breiten 320, 390, 768, 1280, 1440 px)
   - Code, besonders Pass, IDs, Links, Offline → `code-pruefer`
   - neue Bilder → `bild-recherche` (Nachweis prüfen)
5. **Befunde behandeln:** Blockierendes sofort beheben und Schritt 2 wiederholen. Alles andere ins `BACKLOG.md`.
6. **Am Phasenende zusätzlich:** `pnpm run test:full` (Chromium lokal; Firefox und WebKit über den CI-Job „Vollprüfung“) und eine Schlussprüfung des ganzen Branches mit `fable`. Vorher „Vorübergehende Modell-Ausnahmen“ in `STATUS.md` lesen: Läuft eine Ausnahme noch, das dort genannte Ersatzmodell nehmen.
7. **Bericht** an den Nutzer, ehrlich und kurz:
   - Was wurde geprüft, mit welchem Ergebnis (grün / rot / nicht geprüft)?
   - Welche Helfer-Befunde gab es, was ist behoben, was steht im BACKLOG?
   - Was wurde nicht geprüft (zum Beispiel echte Geräte, Bildschirmleser, Firefox/WebKit lokal)?

Keine Prüfung als bestanden melden, die nicht gelaufen ist. Teilprüfungen heißen Teilprüfungen.
