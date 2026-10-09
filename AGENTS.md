# Anleitung für Codex

Dies ist die exportierte bestehende Lernwelt, kein Auftrag zum Neubau. Lies README.md, MIGRATION.md, INVENTAR.md, PRUEFBERICHT.md und PROJECT_STATE.md. Verwende Node 24 und pnpm 11.25.0 mit dem vorhandenen Lockfile. Standardprüfungen: `pnpm run typecheck`, `pnpm run lint`, `pnpm test`, `pnpm run build`.

Erhalte Karten-/Fragen-/Reise-IDs, Hash-Navigation und den zentralen Schema-3-Pass. Baue keinen zweiten Lernspeicher. Reale Passdateien und Notizen gehören nicht ins Repository. Bildnachweise und Modellgrenzen erhalten. Änderungen am Speicher brauchen Kompatibilitätsnachweise.

`original-site/` im externen Sicherungsarchiv ist die unveränderte Referenz; die GitHub-Wurzel ist `project/`. Historische Sites-/Cloudflare-Dateien werden vom portablen Vite-Einstieg nicht benutzt. Keine Sites-Veröffentlichung aus diesem Export auslösen. Externe Veröffentlichungen und neue Dienste nur im später ausdrücklich beauftragten Umfang.

Nach einer Aufgabe konkret dokumentieren: umgesetzt, getestet, offen, veröffentlicht oder nur lokal, nächster Schritt. Bei einer Unterbrechung zuerst Git-Status und PROJECT_STATE.md prüfen und an belegtem Stand fortsetzen. Keine Tests oder Hintergrundarbeit behaupten, die nicht stattfanden.
