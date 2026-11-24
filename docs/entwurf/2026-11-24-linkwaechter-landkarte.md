# Linkwächter: Landkarte aller Verweise (24.11.2026)

Grundlage für `tests/linkwaechter.test.mjs` (Teilschritt 3, Teil B, Aufgabe 7). Erstellt von einem Lese-Helfer (Explore), danach von Claude gegengeprüft. Zeilennummern sind ungefähr.

## Ergebnis

- **Zwei echte Fehler gefunden und behoben:**
  1. **Globus, Naturatlas-Knopf:** Jeder Ort mit `kind: 'nature'` zeigte „Im Naturatlas weiterdenken →“. Das gilt auch für 202 Hauptstädte, 52 Plattenpunkte und 132 Kartenorte (`world-…`), die das Wissensbuch nicht als Naturort kennt. Das Buch meldete dann „Diesen Naturort gibt es hier nicht.“ Jetzt entscheidet `naturAtlasZiel` (`app/nature-data.ts`): nur Orte aus `NATURE` bekommen den Knopf.
  2. **Wissensbuch, `WORD_ROUTES["Wolke"]`:** „Wolke“ ist kein Wort im Wissensbuch, der Eintrag erschien nie. Gestrichen.
- Alle übrigen Verweise zeigen auf Vorhandenes (Stand 24.11.2026).
- Gegenprobe: Mit den alten Fehlern wird der Linkwächter rot.

## Was es gibt (Ziel-Arten)

| Ziel | Adresse | Maßgebliche Liste |
|---|---|---|
| Wissenskarte | `world/topic/<id>` | `WORLD_INDEX` (`app/world-index.ts`) |
| Welt | `world/<welt>`, `world/<welt>/page/<n>` | `WORLD_CATEGORIES` |
| Lernroute | `world/route/<id>` | `WORLD_ROUTES` |
| Reise, Kapitel | `journeys/<id>`, `journeys/<id>/<1..6>` (6 = Abschluss) | `JOURNEYS` (`app/learning-data.ts`) |
| Labor | `labs/<id>` | `LABS` (`app/research-labs.tsx`, per `sourceConstant`) |
| Versuch | `labs/experiment/<id>` | `EXPERIMENT_IDS` (`app/research-labs.tsx`) |
| Buchwort | `book/words/<Wort>` | `GLOSSARY` (`app/learning-data.ts`) |
| Warum-Frage | `book/why/<Frage>` | `WHY_QUESTIONS` |
| Naturort | `book/nature/<id>` | `NATURE` (`app/nature-data.ts`) |
| Buch sonst | `book`, `book/<words|why|notes|nature|atlas>` | `initialBookView` (`app/book-location.ts`) |
| Spiele | keine eigene Adresse (`games` + Zustand) | `GAMES`, `EXTRA_GAMES`, `WORLD_GAMES`; Suchindex `app/game-index.json` |
| Globus-Orte | keine eigene Adresse (`globe`) | `public/world.json`, `CONTINENTS`, `OCEANS`, `LINES`, `NATURE`, `PLATE_POINTS`, `capital-points.json`, `WORLD_PLACES` |
| Mini-Missionen | – | `MISSIONS` (`app/earth-explorer.tsx`), dazu `MISSION_RESEARCH` in gleicher Reihenfolge |
| Bereiche | `home globe layers day quiz journeys games book labs world`, dazu `updates` | `MODES` (`app/earth-explorer.tsx`), `BEREICHE` (`app/kern/bereiche.ts`) |

Alte Links: `#news/…` führt zur Startseite (`app/hash-route.ts`). Alte Spielstempel `order-layers`, `order-water` zählen als `classic:order` (`app/playground-catalog.ts`). Für Karten, Kapitel und Wörter gibt es keine Alias-Tabelle; `tests/fixtures/stable-ids.json` sorgt dafür, dass keine ID verschwindet.

Es gibt keinen zentralen Auflöser für Adressen; jede Ansicht wertet ihren Teil selbst aus und zeigt bei unbekanntem Ziel still die Übersicht oder „gibt es hier nicht“. Der Linkwächter bildet die Regeln in `adressFehler` nach.

## Verweis-Quellen und wo der Linkwächter sie prüft

| Quelle | Daten | Test im Linkwächter |
|---|---|---|
| Reise → Ziel | `CHAPTER_LINKS` (`app/journey-links.ts`) | Adressen |
| Startseite, Mitmachen | `DISCOVERY_ACTIVITIES[].hash` | Adressen |
| Bereichsleiste | `BEREICHE[].ziel` | Adressen |
| Feste Adressen im Code | `'#world/…'`, `navigateHash('…')`, `replaceHash('…')`, `goMode('…','…')` (nur ganze Adressen) | Adressen |
| Feste Karten-IDs im Code | `onTopic('…')`, `topic: '…'`, `world/topic/…`, Listen aus lauter Karten-IDs (z. B. `TIME_IDS`) | Karten-IDs |
| Verbindungen | `app/world-connections.json` | Karten |
| Katalog-Links | `world-catalog.json` `links[]` (Reise, Labor) | Karten |
| Lernrouten, Startfragen, Wissensspuren | `WORLD_ROUTES`, `HOME_MOTIFS`, `DISCOVERY_CONNECTIONS` | Karten |
| Spiele | `game-index.json` ↔ Spiel-Listen (beide Richtungen), `SPIEL_JE_WELT` (`dazu-passt.tsx`), `openWorldGame('…')`, Weltmissionen (`world-progress.tsx`) | Spiele |
| Suche | Startideen (`starters` in `global-search.tsx`), `LAB_SEARCH` ↔ `LABS`, `EXPERIMENT_SEARCH` ↔ `EXPERIMENT_IDS` | Suche |
| Labore | `RESEARCH_PATHS` (Karte, Wort, Reise, Versuch, nächstes Labor), `RESEARCH_LINK_REASONS`, `MISSION_RESEARCH` | Labore |
| Wissensbuch | `book-*-content.json` (Wörter, Warum-Fragen, `topic`, `word`, `relatedWords`, `relatedQuestions`), `book-*-topic-index.json`, `people-book-links.json`, `book-*-word-link-index.json`, `nature-word-links.json`, `nature-learning-content.json`, `nature-place-links.json`, `WORD_ROUTES` (`knowledge-book.tsx`) | Wissensbuch |
| Globus | `MISSIONS` (Land, Kontinent, Meer, Linie), `naturAtlasZiel` für alle Globus-Orte | Globus |

Bestehende Tests, die Teile davon tiefer prüfen (bleiben): `tests/content.test.mjs`, `tests/challenge.test.mjs`, `tests/karten-inhalt.test.mjs`, `tests/playground.test.mjs`, `tests/research.test.mjs`, `tests/journeys.test.mjs`, `tests/discovery.test.mjs`, `tests/nature-learning.test.mjs`, `tests/book-*.test.mjs`, `tests/content-integrity.test.mjs`, `tests/kern-bereiche.test.mjs`.

## Für später

- **E14 (kleine Spiele zusammenlegen):** Geht ein Spiel in einem anderen auf, braucht der Linkwächter eine Tabelle alter Spiel-IDs → neues Ziel, und der Test „Spiele“ prüft beide Richtungen.
- Zur Laufzeit entstehende Ziele (`lastActivity` für „Weiter entdecken“, Ergebnisse der Ortssuche) prüft der Linkwächter nicht; sie haben eigene Absicherungen (`app/activity-view.mjs`).
