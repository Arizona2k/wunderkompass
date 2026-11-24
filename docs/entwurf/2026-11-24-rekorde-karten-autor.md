# Spiel „Rekorde“ (Teil B, Aufgabe 10, E14): Entwurf vom `karten-autor` (24.11.2026)

**Noch nicht geprüft.** Danach prüfen `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer` unabhängig.

Die 15 Aufgaben stehen maschinenlesbar in [`2026-11-24-rekorde-entwurf.json`](2026-11-24-rekorde-entwurf.json): 7 Entdecker, 6 Profi, 2 Experte.

Annahmen des Autors:
- In `falsch` sind die ersten beiden falschen Antworten für Entdecker gedacht, die dritte ist die Profi-Falle.
- `tipp_2` gibt es nur bei den Experte-Aufgaben (Regel S5, Entscheidung D5: zwei Tipps auf Experte, der erste verrät nichts).

Unten der übrige Bericht, wörtlich ohne das JSON.

---

### 2. Spielname, Untertitel, Tipp-Satz

- **Name:** „Rekorde der Natur“. Kürzer ginge „Rekorde“, wie in E14.
- **Untertitel:** „Groß, schnell, tief: Finde die Rekorde von Tieren und Natur.“
- **Tipp-Satz für das ganze Spiel:** „Lies genau, was gemessen wird: Größe, Tempo, Tiefe oder Wassermenge.“

### 3. Was aus den heutigen 9 Aufgaben wird

**Tierrekorde (`world:records`):** Die Aufgaben-IDs sind dort die Karten-IDs. Wiederholungen stehen im Pass unter `world-game:records:<Karten-ID>`.

| Heutige ID | Was passiert | Richtige Antwort |
|---|---|---|
| `animal-blue-whale` | bleibt, Frage wörtlich gleich; die alten Antworten bleiben, „Walhai“ kommt hinten dazu | gleich: „Blauwal“ |
| `animal-african-savanna-elephant` | umgeschrieben, Frage wörtlich gleich | gleiches Tier, kürzer geschrieben (siehe „Umformuliert“) |
| `animal-cheetah` | umgeschrieben, die Frage ist neu formuliert | gleich: „Gepard“ |
| `animal-giraffe` | bleibt, Frage wörtlich gleich, eine falsche Antwort getauscht | gleich: „Giraffe“ |
| `animal-common-octopus` | **gestrichen**: „acht Arme“ ist kein Rekord, das sagt schon die heutige Auflösung | – |

**Schatzsuche (`extra:treasure`):** Die 4 Aufgaben haben heute keine eigenen IDs. Sie stehen nur nach ihrer Reihenfolge in `questions()` in `app/advanced-games.tsx`. Darum bekommen alle vier neue IDs (`alt_id: null`).

| Heutige Aufgabe | Neue ID | Was passiert | Richtige Antwort |
|---|---|---|---|
| 1 Mount Everest | `rekord-hoechster-berg` | übernommen, Antworten sind jetzt alle Berge | gleich: „Mount Everest“ |
| 2 Kalte Wüste | `rekord-groesste-wueste` | umgeschrieben; die Frage erklärt jetzt, was eine Wüste ist | „Antarktische Wüste“ wird „Antarktis“ |
| 3 Marianengraben | `rekord-tiefste-stelle` | übernommen | gleich: „Marianengraben“ |
| 4 Amazonas | `rekord-wasserreichster-fluss` | übernommen, mit Nil als Falle | gleich: „Amazonas“ |

**Neu:** `rekord-groesster-ozean`, `rekord-groesster-vogel`, `rekord-tiefster-see`, `rekord-sturzflug`, `rekord-groesster-fisch`, `rekord-fairer-vergleich` (Experte) und `rekord-messregel-berg` (Experte).

Die beiden Experte-Aufgaben setzen die Idee aus dem BACKLOG um: Ein Rekord braucht eine Messregel, und die Art der Bewegung zählt (Sturzflug gegen Rennen).

### 4. Umformuliert (alt → neu)

Alte Spielstände der Welt-Spiele brauchen vermutlich keinen Alias: Passen die Antworten nicht mehr, nimmt `restoreWorldGameOrders` wieder die normale Reihenfolge. (Selbst prüfen.)

- `animal-african-savanna-elephant`: richtig „Afrikanischer Savannenelefant“ → „Savannenelefant“; falsch „Löwe“, „Koala“ → „Breitmaulnashorn“, „Flusspferd“, „Waldelefant“. Grund: Die alte richtige Antwort war fast dreimal so lang wie die anderen (Ratemuster).
- `animal-cheetah`: Frage „Welches Landtier ist besonders für den schnellsten Sprint bekannt?“ → „Welches Tier kann am schnellsten rennen?“; falsch „Panda“ → „Löwe“, dazu „Strauß“; „Giraffe“ bleibt.
- `animal-giraffe`: falsch „Löwe“ → „Dromedar“, dazu „Strauß“; „Elefant“ bleibt.
- `animal-blue-whale`: nur „Walhai“ angehängt.
- Alle vier `warum`-Texte und die vier Tipps in `recordHints` (`app/world-game-support.mjs`) neu.
- Schatzsuche: „Antarktische Wüste“ → „Antarktis“; falsche Antworten ersetzt: Alpen, Baikalsee, Atacama, Amazonas-Regenwald, Victoriasee; bleiben: Nordsee, Rhein, Nil.

### 5. Zahlen

- Je Stufe: 7 Entdecker, 6 Profi, 2 Experte.
- Längen: mit 3 Antworten (13 Aufgaben) ist die richtige in 1 von 13 die einzige längste (8 %), in 2 von 13 die einzige kürzeste (15 %); mit 4 Antworten (alle 15) 0 von 15 einzige längste, 2 von 15 einzige kürzeste (13 %). Alles unter 45 %. Hinweis: Die richtige ist kaum je die einzige längste (viele gleich lange Antworten); der `stufen-pruefer` soll sagen, ob das stört.
- Kein Tipp enthält die richtige Antwort wörtlich. Keine Antwort enthält „nur“, „immer“, „allein“, „nie“.
- Kein Satz über 12 Wörter (Ausnahme: Mauna-Kea-Frage, drei Sätze, je unter 12).

### 6. Für den `fakten-pruefer` (⚠)

- Wanderfalke „über 300 km/h, kein Tier schneller“: NPS nennt „mehr als 200 mph“ bzw. 160–320 km/h; 389 km/h umstritten; sicher gemessen evtl. nur 184 km/h. Darum „Forschende schätzen“, „nach heutigem Wissen“. Normaler Flug laut Zion-Seite 40–55 km/h.
- Gepard „etwa 100 km/h“: Smithsonian nennt 96–112 km/h und „schnellstes Landsäugetier“, nicht „Landtier“.
- Britannica war nicht abrufbar (403): Amazonas, Baikalsee, größte Wüsten, K2, Everest-Höhe nur aus Suchauszügen. Baikal 1.620–1.642 m → „über 1.600 Meter“.
- Waldelefant kleiner als Savannenelefant: WWF-Seite nicht abrufbar.
- „Nil führt viel weniger Wasser“: hergeleitet aus USGS 1967 (Amazonas > 4× Kongo, Kongo Zweiter). Quelle alt.
- Everest 8.849 m (NPR, 8.12.2020: 8.848,86 m); NOAA nennt noch 8.848 m.
- Marianengraben: NOAA 10.935 m; „Everest hätte darin Platz“ folgt aus 10.935 > 8.849.
- Mauna Kea: NOAA „mehr als 10.210 m“ vom Fuß; USGS 4.207 m über dem Meer.
- Antarktis größte Wüste, Sahara größte heiße: Britannica nur Suchauszug; Australian Antarctic Program nicht selbst geöffnet.
- Pazifik größer als alle Kontinente zusammen: NOAA laut Suchauszug.
- Falsche Antworten der Experte-Aufgaben sind als Begründung falsch, auch wenn sie für sich stimmen (Falke ist leichter). Besonders „Der Falke jagt am Himmel, der Gepard am Boden“ liegt bewusst nah; der `stufen-pruefer` soll sie beurteilen.
- Sicher belegt (selbst geöffnet): Strauß (San Diego Zoo), Walhai (Georgia Aquarium), Riesenhai zweitgrößter Fisch (DFO Canada).

### 7. Offen

1. Wie das Spiel die zwei Entdecker-Antworten wählt (Annahme: die ersten zwei aus `falsch`).
2. Bezug zu Karten und Orten: `rekord-groesster-vogel` → `animal-ostrich`; `rekord-groesster-fisch` → `animal-whale-shark`; `rekord-fairer-vergleich` → `animal-cheetah`; Globus-Orte (`app/nature-data.ts`): `everest`, `mariana`, `amazon`, `baikal`, `antarctic-desert`. Für Wanderfalke und Pazifik keine Karte.
3. Gestrichener Oktopus: alte Pass-Einträge `world-game:records:animal-common-octopus` dürfen den Auswahl-Helfer nicht stören. Alte Spielstände `gameSessions['extra:treasure']` brauchen einen Weg ins neue Spiel. Der Stempel bleibt (D4).
4. Betroffene Stellen: `tests/world-game-runde.test.mjs` (Z. 31, 136), `tests/animal-game-save-compatibility.test.mjs:42`, `tests/world-game-learning-copy.test.mjs:31`, `recordHints` in `app/world-game-support.mjs`, `app/playground-catalog.ts:29`, `app/game-index.json` (`treasure`, `records`), `GAME_HINTS.treasure` in `app/advanced-games.tsx:53`.
5. Ersatz-Aufgaben (nicht ausgeschrieben): Wanderalbatros (Spannweite, Falle Andenkondor); kältester gemessener Ort Wostok, etwa −89 °C (1983, WMO).
