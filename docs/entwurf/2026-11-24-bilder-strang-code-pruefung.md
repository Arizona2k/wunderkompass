# Code-Prüfung Bilder-Strang (24.11.2026)

Helfer: `code-pruefer`. Geprüft: alle Commits des Bilder-Strangs gegenüber `test-live` (Werkzeug `scripts/foto-einbau.mjs`, `scripts/foto-regeln.mjs`, Tests, Daten). Der Helfer hat nichts geändert. Läufe: `pnpm test` 517/517, `typecheck` und `lint` grün. Kein Build, keine Browser-Suiten, das Werkzeug selbst nicht ausgeführt (Befunde zum Werkzeug aus dem Lesen des Codes).

**Ergebnis:** Mit Änderungen bereit. Pass, Karten-IDs, Foto-IDs und Links unberührt, alle Nachweise vollständig.

## Fehler

1. **`scripts/foto-einbau.mjs:255-265` – Bilddateien bleiben halb geschrieben liegen.** `bildBauen` schreibt die WebP-Breiten direkt nach `public/world/<ordner>/`. Bricht ein späterer Schritt ab (`convert` bei 960, `vw !== breite`, Fehler in `eintrag()`), bleiben die schon geschriebenen Dateien liegen: in keiner JSON-Datei, aber im Offline-Paket (`build/learning-assets.mjs:6` nimmt alles unter `dist/`), und jeder weitere Lauf scheitert an „Datei gibt es schon“. Vorschlag: erst im Arbeitsordner bauen, nach Erfolg verschieben, sonst im `catch` löschen.

## Risiken

2. **`tests/wissenskarte.test.mjs:230` – Schutz der Foto-IDs schwächer.** Aus `=== 60` wurde `>= 60`; eine gelöschte Foto-ID fiele nicht mehr auf (Foto-IDs stehen nicht in `tests/fixtures/stable-ids.json`). Vorschlag: Schlüssel `photos` in `stable-ids.json` mit allen heutigen Foto-IDs, Liste wächst nur, Test prüft, dass jede ID in `world-photos.json` steht.
3. **`scripts/foto-einbau.mjs:106-113` – halber Stand, wenn der Export scheitert.** JSON-Dateien schon geschrieben, alte Dateien schon gelöscht, erst dann `export-content.mjs`. Scheitert er, passt `app/world-photo-integrity.json` nicht mehr, die App lehnt die Fotodaten ab. Werkzeug meldet den Fehler mit Exit 1. Vorschlag: alte Dateien erst nach erfolgreichem Export löschen, Rückweg `git checkout -- app public` nennen.
4. **Offline-Paket rund 6,6 MB größer** (neue WebP 7,51 MB, gelöschte Altdateien 0,88 MB, `public/` heute 23,4 MB). Neue Bilder sind automatisch in der Offline-Liste. Kein Budget für das Offline-Paket in `performance-budgets.json`. Mitgeladen, obwohl nicht mehr gezeigt: `/world/orca.webp` (108 KB), 24 Tier-Zeichnungen hinter Fotos (42 KB), doppelte Größen (Punkt 7). Vorschlag: entscheiden, ob ersetzte Bilder aus dem Offline-Paket heraus sollen; Budget für das Offline-Paket.
5. **`tests/browser/world-photos.mjs:14` – `ERSETZTE_FOTOS` von Hand gepflegt.** Prüfung nicht abgeschwächt, eher strenger. Aber die Liste lebt nur im Browser-Test; der nächste Ersatz fällt erst spät auf. Vorschlag: Ersatz in den Daten vermerken, Unit-Test „jede Foto-ID gezeigt oder ersetzt“, Browser-Test liest dasselbe.
6. **`scripts/foto-einbau.mjs:241` – Farbprofile gehen verloren.** `-strip` ohne vorheriges Umrechnen nach sRGB; bei Originalen mit Adobe-RGB-Profil (Museums-Scans) blasse Farben. Vorschlag: `-colorspace sRGB` vor `-strip`.

## Kleinigkeiten

7. `scripts/foto-regeln.mjs:77` – fast doppelte Größen: `zielBreiten(650)` ergibt `[320, 640, 650]` (Gutenberg 640er 182 KB, 650er 193 KB). Vorschlag: dritte Breite weglassen unter etwa 1,15 × 640.
8. `scripts/foto-einbau.mjs:93, 99, 294-303` – Aufräumen unvollständig: `entferneWennUnbenutzt` löscht nur das alte `src`, nicht alte Größen mit anderen Namen; `app/world-photo-core.json` fehlt in der Ausnahmeliste; zweiter Neu-Export desselben Fotos scheitert an Namensgleichheit (sicher, aber nicht dokumentiert).
9. `scripts/foto-einbau.mjs:50` – Einträge ohne `foto_id` verschwinden still (Tippfehler `fotoid` fällt nicht auf).
10. `scripts/foto-regeln.mjs:65` – Urheber-Abgleich mit reinem Teilstring („Ann“ passt auf „Joanne“).
11. `scripts/foto-regeln.mjs:56-69` – `license_url` wird nicht gegen `license` geprüft (heute passen alle).
12. `scripts/foto-einbau.mjs:138-159` – Neu-Export verwirft unbekannte Felder still (bei den acht Neu-Exporten nichts verloren).
13. `tests/browser/animal-learning.mjs` – toter Zeichnungs-Zweig, seit alle 24 Tier-Zeichnungen hinter Fotos stehen.
14. `content/author-world-content.py:174` – veraltetes Skript liest `content/photo-manifest.json` mit gelöschten Dateien; ein Lauf bräche ab oder überschriebe `world-photos.json` (altes Problem, jetzt sichtbar).

## Geprüft und in Ordnung

- Katalog: weiter 204 Karten in derselben Reihenfolge, nur `image` bei 37 Karten geändert.
- Foto-IDs: keine weggefallen, 41 neu, 8 Neu-Exporte mit gleicher ID und unverändertem Urheber/Lizenz/Quelle; `orca` bleibt mit Nachweis und Datei, `animal-orca` zeigt `orca-jumping-pair`.
- Pass, Speicher, Worker, Routen: unverändert.
- Nachweise: alle 49 neuen oder geänderten Einträge vollständig (Urheber, Lizenz, passender Lizenz-Link, Commons-Quelle, Alt-Text, Bearbeitungshinweis); alle Dateien vorhanden; Breiten 320/640/960 bzw. begründet 320/640/650–742.
- `app/world-photo-integrity.json` passt; gelöschte Altdateien (`images/portraits/*`, `world/emperor-penguin.webp`, `world/eiffel-tower.webp`) nirgends mehr verwiesen außer im Skript aus Punkt 14.
- `public/world/photo-credits.json` jetzt aus `world-photos.json` erzeugt; behebt alte Abweichungen (4 fehlende Naturfotos, abweichende Urheber bei Gorilla, Jaguar, Walhai).
- `foto-regeln.mjs` lehnt NC/ND, KI-Bilder und vergebene IDs ab, prüft gleiches Original beim Neu-Export, skaliert nie hoch; `tests/foto-regeln.test.mjs` prüft echtes Verhalten.
- Kennwörter, Labels, `focus`, angepasste Tests, Tier-Browsertest, Werkzeug-Kennung ohne persönliche Daten, `.qa-output/foto-cache` in `.gitignore`.

## Nicht geprüft

Browser-Suiten, Build und Größenbudget (`app/world-index.json` rund 46 KB größer); Werkzeug nicht ausgeführt; Lizenzen/Urheber bei Commons und Bildinhalt (Sache von `bild-recherche`/`fakten-pruefer`); Wirkung bei 320 px (Sache des `design-pruefer`); `docs/` und `exports/` nur Stichproben.

## Umsetzung (Claude)

Siehe Commit „Befunde der Code-Prüfung zum Bilder-Strang umsetzen“ und den Abschnitt in `BACKLOG.md`, Punkt 26.
