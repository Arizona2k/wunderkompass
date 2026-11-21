# AGENTS.md – Kurzregeln für KI-Werkzeuge

Stand: 21.11.2026. Das vollständige Arbeitshandbuch ist [CLAUDE.md](CLAUDE.md), der aktuelle Stand steht in [STATUS.md](STATUS.md).
Die frühere, lange Fassung dieser Datei liegt in [docs/archiv/AGENTS-alt-2026-11-21.md](docs/archiv/AGENTS-alt-2026-11-21.md); sie gilt nicht mehr.
Bei Widerspruch gilt eine spätere ausdrückliche Weisung des Nutzers.

WunderKompass ist eine kostenlose Lernseite für Kinder von 5 bis 10 Jahren (meist mit einem Elternteil).
React 19, Vite 8, Tailwind 4, Node 24, pnpm 11.25.0.

## Feste Regeln

1. **Kostenlos.** Keine bezahlten Dienste, Abos, Testzugänge oder Upgrades.
2. **IDs und Links bleiben.** Karten-, Fragen-, Kapitel-, Spiel-, Labor-, Missions- und Reise-IDs sowie Hash-Links (`#world/...`) ändern sich nicht. `tests/fixtures/stable-ids.json` darf nur wachsen.
3. **Ein Lernspeicher.** Der Entdeckerpass: Schema 3, `earth-explorer`, Schlüssel `erde-entdecken:save:v3`, Altpass `erde-entdecken:forscherpass:v2`, IndexedDB `earth-explorer`. Änderungen nur mit Nachweis (Altpass, Import/Export, Reload, Fehlerfall).
4. **Keine echten Daten** (Pässe, Notizen, Profile, Zugangsdaten) im Repository. Nur ausgedachte Testpässe.
5. **Bilder** nur mit geklärten Rechten und vollständigem Nachweis. Zuerst freie Originale, KI-Bilder nur gekennzeichnet und kostenlos.
6. **Git.** `main` nie direkt ändern, kein Force-Push. PRs nach `test-live`; gemergt wird nach grüner CI und „ok“ des Nutzers.
7. **Ehrlich berichten.** Keine Prüfung behaupten, die nicht stattfand.
8. **Datenschutz.** Name und E-Mail des Nutzers gehen nie an externe Dienste.
9. **Inhalte** mit geprüfter Quelle; Verbindungen zwischen Themen müssen fachlich echt sein. Keine Nachrichten.

## Prüfen

`pnpm install --frozen-lockfile`, dann `pnpm run check` (typecheck, lint, test, build, Browser-CI-Satz).
Große Prüfung am Phasenende: `pnpm run test:full`.
