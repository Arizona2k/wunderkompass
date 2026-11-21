---
name: weiter
description: Wiedereinstieg in WunderKompass in einer neuen Sitzung – Branch und Git-Stand prüfen, CLAUDE.md und STATUS.md lesen, Modell-Check, dann den nächsten Schritt in einfachen Worten nennen.
---

# /weiter – Wiedereinstieg

Führe diese Schritte der Reihe nach aus. Ändere dabei nichts außer dem Branch-Wechsel in Schritt 1.

1. **Branch prüfen.** Standardbranch auf GitHub ist `test-live` (seit 21.11.2026), `main` ist der ältere Stand für Freunde; gearbeitet wird auf dem Arbeitsbranch der Sitzung (`claude/...`) mit dem Stand von `test-live`. Diese Zeilen (wie in der Startnachricht in `STATUS.md`) stellen das sicher:
   ```bash
   git fetch origin main test-live
   B=$(git branch --show-current)
   if git merge-base --is-ancestor origin/test-live HEAD; then echo "Branch hat schon den test-live-Stand."
   elif [ "$B" != main ] && { [ -z "$(git log --oneline origin/main..HEAD)" ] || [ -z "$(git log --oneline origin/test-live..HEAD)" ]; }; then git checkout --no-track -B "$B" origin/test-live
   else echo "STOPP: Branch nicht automatisch umstellbar. Erst nachfragen."; fi
   ```
   - Umgestellt wird nur ein Branch ohne eigene Commits, es geht also nichts verloren.
   - Bei „STOPP“ (eigene Commits ohne `test-live`-Stand oder Sitzung direkt auf `main`) nichts erzwingen, sondern den Nutzer fragen.
2. **Lesen:** `CLAUDE.md` ganz, dann `STATUS.md` ganz. Bei Bedarf `BACKLOG.md` (nur den Abschnitt der aktuellen Phase).
3. **Git-Stand:** `git status --short`, `git log --oneline -5`, `git fetch origin` und Abstand zu `origin/test-live`. Gibt es offene PRs nach `test-live` (GitHub-Werkzeuge)? Gibt es unfertige eigene Arbeit (nicht committete Dateien, ungepushte Commits)? Die kommt zuerst.
4. **Werkzeuge:** Im Cloud-Container `export PATH=/opt/node24/bin:$PATH`, dann `node -v` (24) und `pnpm -v` (11.25.0). Nur wenn `node_modules` fehlt: `pnpm install --frozen-lockfile`.
   - **Playwright-Check:** `npm view playwright time --json` zeigt alle Versionen mit Datum. Ist die neueste Version, die mindestens 7 Tage alt ist, neuer als die in `package.json`: als ersten kleinen Schritt `pnpm add -D playwright@<version> --save-exact`, dann die Browser holen (nächster Punkt), `pnpm run check`, eigener Commit. Kein Vorab-Beta, kein Alpha.
   - **Browser:** Startet ein Browser nicht, weil seine Version fehlt (z. B. Chat in der falschen Umgebung gestartet): `pnpm exec playwright install --with-deps chromium firefox webkit`. Dem Nutzer sagen, dass neue Chats in der Umgebung „wunderkompass“ starten sollen.
5. **Modell-Check:** Vergleiche die heute verfügbaren Claude-Modelle mit dem „Modell-Stand“ in `CLAUDE.md`. Gibt es ein neueres oder stärkeres Modell, schlage dem Nutzer kurz vor, ob ein Wechsel lohnt, und trage nach seiner Antwort den neuen Stand in `CLAUDE.md` ein.
   - Lies in `STATUS.md` den Abschnitt „Vorübergehende Modell-Ausnahmen“. Ist ein Enddatum vorbei: wieder das Modell aus `CLAUDE.md` nehmen, den Eintrag löschen und es dem Nutzer im Bericht sagen. Läuft eine Ausnahme noch, die Helfer so lange mit dem Ersatzmodell beauftragen.
6. **Bericht an den Nutzer** in der festen Form, kurz und ohne Fachjargon:
   - Was ist fertig?
   - Was kannst du dir ansehen?
   - Was musst du entscheiden?
   - Was kommt als Nächstes? (ein konkreter Vorschlag)

Danach mit dem nächsten Schritt weitermachen, sofern nichts zu entscheiden ist.
