# Messhilfen zu den Personen-Rätseln (25.11.2026)

Gesichert aus dem Scratchpad, damit sie beim Chatwechsel nicht verloren gehen. Sie sind keine Tests und laufen nicht in der Prüfkette.

- `runde.mjs` (vom `stufen-pruefer`): baut die Fallenwahl aus `world-game-bank.ts` und `world-game-runde.ts` nach (Entdecker: zwei feste Fallen aus `people-game-baseline.json`; Profi: die fünf zeitlich nächsten Personen ohne Ausschlussliste). Aufruf: `node runde.mjs ausgabe.json`. Ergebnis von heute: `runde.json`, `alle.json`.
- `regelpruefung.mjs` (vom `fakten-pruefer`): prüft Rätsel-Vorschläge gegen die Regeln aus `tests/world-game-learning-copy.test.mjs` (keine Namensteile, keine verbotenen Fürwörter, genau zwei Sätze). Bildet den Test nur nach; nach dem Einbau zählt `pnpm test`.

Berichte: [Kinder-Redaktion](../2026-11-25-personen-raetsel-kinderredaktion.md), [Stufen-Prüfung](../2026-11-25-personen-raetsel-stufenpruefung.md), [Fakten-Prüfung](../2026-11-25-personen-raetsel-faktenpruefung.md).
- `regel.mjs` (vom `stufen-pruefer`, letzte Prüfung): baut die Fallen-Regel aus der Endfassung nach (Gebiete, Paarliste A und B) und misst je Person die Entdecker-Kandidaten und auf Profi, wie oft man nur mit dem Gebiet richtig rät. `node docs/entwurf/2026-11-25-personen-raetsel-messung/regel.mjs` (mit `--extra`: Einstein ↔ Armstrong und Johnson in Liste B).
