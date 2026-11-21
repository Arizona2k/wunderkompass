# CHANGELOG

Was sich geändert hat, in einfachen Worten. Neueste Einträge oben.
Der Verlauf vor dem 21.11.2026 steht im alten Stand: `git show b53f75f:CHANGELOG.md`.

## 21.11.2026 – Alter Katalog „WunderKompass 2027“ eingeordnet

An der Seite selbst ändert sich nichts. Es geht um die Pläne.

- **Geprüft:** der Anforderungskatalog aus der ChatGPT-Zeit (jetzt in `docs/archiv/`). Die Einordnung mit Gründen steht in `docs/entwurf/2026-11-21-katalog-2027-einordnung.md`.
- **Übernommen:** einheitliches Design mit Tastaturbedienung, Mitmachen mit echtem Lernnutzen, Verknüpfung und Rückwege, Schutz des Bestands, hohe Qualität mit echtem Ansehen statt nur Tests.
- **Angepasst:** Inhalte kurz zuerst, mit drei Tiefen bis „Für Große“. 3D nur, wo es etwas erklärt, immer mit 2D-Fassung. Der Globus wird in Phase 4 das Herzstück. Neue Themen wie Körper, Geld oder Religionen ziehen Welt für Welt ein, mit Sorgfaltsregeln.
- **Nicht übernommen:** Spline (Logo im kostenlosen Plan), die alte Paket-Reihenfolge, Nachweis-Dateien, Inhalte von einer KI, Tagespolitik.
- **Audit V2 nachgeprüft:** 18 von 19 alten Befunden sind behoben. Offen sind vor allem rohe Sprachkürzel in Länderansichten (BACKLOG).

## 21.11.2026 – Neuausrichtung, Schritt 0 „Großputz & Arbeitsweise“

Claude entwickelt WunderKompass ab jetzt weiter. Für Kinder sieht die Seite noch genauso aus wie vorher.

- **Weniger Ballast:** Prüfberichte, Vergleichsdateien, Release-Sperren und alte Datenbank- und Sites-Reste sind entfernt. Das Repository ist deutlich kleiner: 1021 statt 1284 Dateien, 42,2 statt 73,9 MB.
- **Schnellere Prüfung:** Ein Befehl (`pnpm run check`) prüft Typen, Code, Unit-Tests, Build und die wichtigsten Browserwege. Die große Prüfung in drei Browsern läuft am Ende einer Phase.
- **Was weiter geschützt ist:** Entdeckerpass und gespeicherte Antworten; die IDs von Karten, Kapiteln, Spielen, Laboren, Missionen und Reisen, die meisten Fragen-IDs und alte Links (Orts-IDs und zwei Fragenbanken kommen noch dazu, siehe BACKLOG); Bilder mit Nachweis; Offline-Betrieb.
- **Einmal „Neue Version laden“:** Wer die Seite offline vorbereitet hat, sieht einmal den Knopf „Neue Version laden“. Pass und Favoriten bleiben dabei erhalten (im Test geprüft).
- **Geprüft (Chromium):** `pnpm run check` grün, große Prüfung 28 von 28 Suiten grün. Der neue Build gleicht dem alten bis auf die Versionskennung. Firefox und WebKit prüft die CI vor der nächsten Veröffentlichung für Freunde.
- **Neue kurze Unterlagen:** `CLAUDE.md`, `STATUS.md`, `VISION.md`, `BACKLOG.md`. Die Originalaufträge liegen in `docs/archiv/`.
- **Helfer:** sechs Prüf-Helfer für Kindertexte, Fakten, Design, Code, Bildrechte und Ideen; Kurzbefehle `/weiter` und `/pruefen`.
