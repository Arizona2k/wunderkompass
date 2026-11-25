# Bauplan Umbau-Schritt 1: Farben, Fokus, Knöpfe (25.11.2026)

Stand: Plan von Claude zum freigegebenen [Entwurf](2026-11-25-design-umbau.md), Abschnitt „Schritt 1“. Er nimmt die [Codeprüfung](2026-11-25-design-umbau-codepruefung.md) (M1, S5, S7, S8) und den [Bestand](2026-11-25-design-umbau-bestand.md) auf. Gebaut wird erst nach dem Merge von „Auflösung und Rückmeldung im Blick“, weil beide `app/kern/kern.css` ändern.

## Bestand (nachgezählt am 25.11.2026 mit postcss, Stand `9203b93`)

Die Listen liegen nicht im Repository. Das Skript zählt alle Regeln in `app/**/*.css` und `components/**/*.css`; `vendor/` war nicht dabei.

- **Haupt- und Nebenknopf** (`.primary-button`, `.secondary-button`): 48 Regeln.
  - Davon 25 in `globals.css`, 9 in `playground.css`, je 4 in `pass-atlas.css` und `discovery.css`, der Rest einzeln.
  - Der Hauptknopf ist heute an drei Stellen verschieden:
    - orange `#b95121` (`globals.css:176`);
    - Petrol `var(--wk-teal)` auf dem Start (`discovery.css:60`, `:71`) und im Pass (`pass-atlas.css:44`, `:72`);
    - Hover `#1d5143` oder `#9b421c`.
  - Die Grundform gibt es dreimal: `globals.css:17` (Radius 10 px, Schrift 14 px), `:29` (min. 46 px) und `:175` (Radius 12 px, min. 48 px).
- **Vorlesen** (`.speech-button`): 25 Regeln. Fünf davon setzen die Schrift mit `!important` (`globals.css:24`, `:29`, `:34`; `science-thinking.css:16`, `:17`; `article-workshop.css:7`, `:33`). Andere Dateien kämpfen mit eigenem `!important` dagegen an.
- **Antworten und Wahlknöpfe** (`.quiz-answer`, `.visual-choice`, `.model-choice`): 51 Regeln.
  - Die falsche Antwort ist heute orange-beige `#fff3e4` (`globals.css:17`), die richtige grün `#eaf8ef`.
  - Gewählte Wahlknöpfe sind grün `#d9efe4` (`globals.css:64`, `people-evidence.css:7`), also leicht mit „richtig“ zu verwechseln.
- **Fokus**: 46 Regeln mit `:focus-visible` oder `:focus`.
  - Varianten: 2 oder 3 px.
  - Farben: Petrol, `#256384`, `#245d70`, `#28627e`, `#1d6f86`, `#276c88`, `#386b80`, orange `#a84d19`, `#df773c` und `#ed7c40`.
  - Abstand 2 bis 4 px.
  - Dazu 12 Fokus-Ringe in `components/ui/*.tsx` (Tailwind `ring-ring`).
- **Große Schrift**: Die Pass-Einstellung setzt `.large-reading` an `.earth-app` und an die Dialoge (`earth-explorer.tsx:281`, `:349`, `:350`, `:352`). Die Größen stehen in 36 CSS-Dateien, oft mit `!important` (`globals.css:44`: `1.15rem!important`).

## Vorgehen

1. **Kern-Werte** (`app/kern/kern.css`, `:root`). Die alten Namen bleiben, die Werte werden Kompass-Werte:

   | Name | Wert |
   |---|---|
   | `--kern-grund` | `#EDF1EA` |
   | `--kern-text` | `#15314A` |
   | `--kern-text-leise` | `#4A5F70` |
   | `--kern-petrol` | `#0B6B73` |
   | `--kern-petrol-zart` | `#DCEFEF` |
   | `--kern-orange` | `#D9650A` |
   | `--kern-linie` | `#C6D1C8` |

   Neu dazu:

   | Name | Wert |
   |---|---|
   | `--kern-rand` | `#788A80` |
   | `--kern-richtig` | `#2E7A55` |
   | `--kern-richtig-zart` | `#E2F0E7` |
   | `--kern-falsch` | `#B5462F` |
   | `--kern-falsch-zart` | `#F8E7E1` |
   | Weltfarben `--kern-w-*` | aus `c.css` |
   | Radien | 22, 14 und 8 px |

   - Für Schrift und Abstände der Bausteine kommen eigene Größen dazu (`--kern-schrift-knopf` und andere). `.large-reading` setzt sie um rund 20 % höher (Codeprüfung S7).
   - `--kern-petrol-dunkel` (Hover) und `--kern-orange-text` werden neu ausgerechnet. Der Kontrast wird gemessen, nicht geschätzt.
2. **Doppelte Sätze verweisen auf den Kern:**
   - shadcn in `globals.css:15`: `--background`, `--foreground`, `--primary` (heute orange) → Petrol, `--ring`;
   - `--wk-focus` (zweimal), `--wk-teal`, `--wk-ink` in `discovery.css:2` und `foundation.css:2`.
3. **Bausteine im Kern**, je einmal festgelegt, mindestens 48 px hoch, Schrift mindestens 16 px:
   - `primary-button`: Petrol, weiße Schrift.
   - `secondary-button`: weiß mit Petrol-Rand.
   - `speech-button`: Petrol-Schrift, ohne Fläche.
   - `quiz-answer` mit Hover, gewählt, richtig (`--kern-richtig-zart`) und falsch (`--kern-falsch-zart`).
   - `.visual-choice button` und `model-choice`: gewählt in Petrol-zart, nicht grün, damit „gewählt“ nicht wie „richtig“ aussieht.
4. **Ein Fokusrahmen**: 3 px Petrol, Abstand 2 px, als `outline`, nicht als `box-shadow` (Entwurf). Den weißen Innenring geben wir nur dort, wo der Rahmen auf einer dunklen oder farbigen Fläche liegt. Ob er überall nötig ist, entscheidet der `design-pruefer` an Bildern.
   - Eine gemeinsame Regel für erzwungene Farben.
   - Die Ringe der shadcn-Bausteine werden über `--ring` Petrol.
5. **Alte Regeln löschen** (Codeprüfung M1: `kern.css` steht im Bundle *vor* `globals.css`, Umlenken reicht nicht):
   - in `globals.css` die Grundformen von Knopf, Vorlesen, Antwort und Wahlknopf (`:17`, `:29`, `:53`, `:64`, `:114`, `:175`, `:176`) und den alten Fokus (`:53`, `:71`, `:177`);
   - die `!important`-Schriftregeln (`:24`, `:29`, `:34`, `:44`) samt ihren Gegenregeln (`science-thinking.css`, `article-workshop.css`, `karte.css:332`);
   - die Petrol-Sonderregeln in `discovery.css` und `pass-atlas.css`;
   - die 40 eigenen Fokusregeln (Liste oben, ohne `kern.css`).

   Bleiben dürfen Regeln, die nur Lage und Breite setzen (z. B. `.continue-card .primary-button{flex-shrink:0}`).
   - Weil `globals.css` minifiziert ist, löscht ein kleines postcss-Skript einzelne Regeln und Angaben. Die übrige Datei bleibt Byte für Byte gleich. Das Skript kommt nicht ins Repository.
6. **Tests im selben PR** auf die neuen Werte setzen, nicht abschwächen:
   - `kern-huelle.mjs` (Hintergrund `rgb(250, 248, 243)` → `rgb(237, 241, 234)`, Fokus `rgb(14, 110, 114)` → `rgb(11, 107, 115)`);
   - `karte-stufen.mjs:138` (falsche Antwort);
   - was die Suche nach `rgb(` und Hex-Werten in `tests/browser/` noch findet;
   - `lesbarkeit.mjs` prüft die Stufe der großen Schrift statt nur „größer“.

   **Neu:** Eine Prüfung mit `getComputedStyle` je Baustein (Farbe, Größe, Fokus) auf dem Start, in einer Karte (nachgeladen), in einer Reise (nachgeladen), im Pass-Dialog und in einem Spiel, bei normaler und großer Schrift. Die Prüfung kommt in die CI-Suite `kern-huelle`, damit Firefox und WebKit sie in der Engine-Schnellprüfung mitprüfen.
   **Aus der Design-Prüfung der Technik-Auflösungen** ([Bericht](2026-11-25-technik-aufloesung-design.md), Kann 3 bis 5), beim Bau der Bausteine mitnehmen:
   - „Richtig!“ im Rückmeldekasten deutlicher absetzen: etwa 20 px oder ein kleines Häkchen davor; „Noch nicht ganz“ passend dazu.
   - Knopfzeile im Kasten mittig ausrichten (`align-items: center`); „Erklärung vorlesen“ hat heute 14 px Schrift, mit dem neuen `speech-button` mindestens 16 px.
   - Nicht gewählte Antworten nach „Richtig!“ sind mit Deckkraft 0,65 blass (etwa 2,9:1); mit den neuen Antwortfarben auf etwa 0,8 oder eine eigene ruhige Farbe.
7. **Nebenbei:** `index.html`, Beschreibung „Kinder ab 8 Jahren“ → 5 bis 10. Dazu ein Eintrag in „Was ist neu?“ (`karten-autor` schreibt ihn).
8. **Prüfen:**
   - `pnpm run check`;
   - `node tests/browser/run.mjs --suite full core offline-cold-full home home-visits components journeys`;
   - die CI-„Vollprüfung“ von Hand auf dem Branch;
   - `design-pruefer` in 320, 390, 768, 1280 und 1440 px auf Start, Karte, Spiel, Pass, Labor und Reise, auch mit großer Schrift und erzwungenen Farben;
   - `code-pruefer` auf den Diff (Löschungen in `globals.css`, nachgeladene Teile);
   - `spieltester` mit einer Runde Spiel und einer Reise.

## Größe

- Die engste Grenze ist `entryCssGzipBytes` (60 000; zuletzt 45 684 gemessen).
- Weil Alt und Neu nicht nebeneinander stehen, soll das Einstiegs-CSS kleiner werden. Gemessen wird beim Bau.

## Wege (Regel „Alle Wege prüfen“)

- Schritt 1 ändert nur Darstellung: keine Änderung an Pass, IDs, Hash-Links oder Texten.
- Jeder Weg zeigt danach dieselben Knöpfe: Leiste, Start, Suche, Wissensbuch, Lernreise, Zurück, Neuladen, Stufenwechsel, alte Links.
- Die Tests oben prüfen das auf dem Start (sofort geladen) und in Karte und Reise (nachgeladen). Gerade bei den nachgeladenen Teilen kann ein altes CSS-Stück sonst noch gewinnen.
