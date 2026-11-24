# Entscheidungsliste: drei Spiel-Entwürfe (Rekorde, Wetter und Klima, Sortiere die Zeit)

Stand 24.11.2026, angelegt für den nächsten Chat (Teil B, Aufgaben 10 und 12). Noch nichts davon ist eingebaut.

**Grundlage (zuerst lesen, nicht neu ausdenken):**
- Entwürfe des `karten-autor`: `2026-11-24-rekorde-entwurf.json`, `2026-11-24-rekorde-karten-autor.md`, `2026-11-24-wetter-zeit-karten-autor.md`
- Prüfberichte: `2026-11-24-drei-spiele-kinder-redaktion.md` (13 nötige Änderungen), `2026-11-24-rekorde-fakten-pruefer.md` (11), `2026-11-24-wetter-zeit-fakten-pruefer.md` (13), `2026-11-24-drei-spiele-stufen-pruefer.md` (Einstufung, 26 Befunde, neue Experte-Aufgaben)
- Regeln: `2026-11-23-phase-1-teilschritt-3.md` (E3, E4, E14), `2026-11-23-phase-1-ergaenzung-stufen.md`, `2026-11-24-teil-b-entscheidungen.md`, Plan `2026-11-24-teil-b-plan.md`

## A. Unstrittig (alle Berichte einig oder nur einer betroffen) – so einbauen

- Alle „Nötigen Änderungen“ der beiden Faktenberichte (Zahlen, „heute lebende“, Quellen: Britannica raus, NPR/NASA EO/FAO/NatGeo Education/USGS/NOAA/DWD/ISAC/Peregrine Fund rein, neue DPMA-Adresse).
- Tipps, die die Lösung verraten, neu fassen (kinder-redaktion Punkt 6, stufen-pruefer Punkte 3–8, 13, 14). Die Vorschläge des stufen-pruefer sind die konkretesten.
- „Nahe den Polen“ ersetzen (alle drei Berichte).
- „World Wide Web“/„Web“ kindgerecht („Internetseiten“).
- Einstufung nach der Tabelle des stufen-pruefer (Abschnitt 2), vor allem: Ozean, Klima-Wort, Ein-Tag → Profi; Nebel → Entdecker; Wetter-Zeichen und Giraffe nicht in den Profi-Vorrat.
- Ausschlussliste „nie in derselben Runde“ (stufen-pruefer Punkt 11).
- Vergleiche zu den Zahlen in den warum-Sätzen (kinder-redaktion Punkt 8), Jahresangaben „v. Chr.“ kindgerecht.
- „Noch nicht ganz“ nicht doppeln (`WOERTER.nochNicht` schon vorhanden).
- Name des Spiels: „Rekorde der Natur“ (kinder-redaktion).

## B. Widersprüche zwischen den Berichten – Claude entscheidet beim Einbau, Empfehlung steht dabei

| Stelle | Vorschläge | Empfehlung |
|---|---|---|
| `rekord-fairer-vergleich`, falsche Antworten | fakten: Himmel/Boden ersetzen durch „Der Falke schlägt im Sturzflug ganz schnell mit den Flügeln.“; kinder: Federn-Antwort ersetzen, Himmel/Boden im warum auflösen; stufen: drei neue falsche, darunter „Der Falke fliegt lange so schnell, der Gepard nur kurz.“ | Satz des stufen-pruefer **nicht** ungeprüft nehmen: laut Peregrine Fund kann der Falke im Geradeausflug einem Gepard nahekommen, dann wäre „fliegt lange so schnell“ nicht eindeutig falsch. Die zwei Fehlvorstellungen „leichter“ und „jagt kleinere Tiere“ nehmen, als dritte die Flügel-Antwort des fakten-pruefer; danach fakten-pruefer kurz gegenlesen lassen. |
| `rekord-messregel-berg`, `falsch[2]` | fakten: „Unter Wasser kann man Berge nicht messen.“; stufen: „Auch der Everest ist vom Fuß aus höher.“ | Fakten-Vorschlag (sicher falsch, keine neue Zahl). Tipp 1 und `falsch[1]` wie stufen-pruefer. |
| Gruppe `motoren`, Tipp 1 | kinder: „schwerer“ → „schwieriger“; fakten: „Erst auf der Straße, dann in der Luft, dann in Richtung Weltall.“; stufen: „Das erste Flugzeug flog mit einem Motor, wie er auch in Autos steckt.“ (ungeprüft) | Fakten-Satz (geprüft, echte Reihenfolge). |
| Gruppe `weltall-netz`, Tipp 2 | kinder: „Internetseiten“ statt „Web“; fakten: „Der Plan für das Web kam ungefähr 20 Jahre nach der Mondlandung.“ | Zusammen: „Der Plan für die Internetseiten kam ungefähr 20 Jahre nach der Mondlandung.“ |
| `zeit-auto`, `zeit-telefon` (Namen) | kinder: „Benz zeigt sein erstes Auto“, „Bell stellt sein Telefon vor“; fakten: „… bekommt ein Patent …“ | Fakten bestimmt das Ereignis (die Jahre 1886/1876 sind die Patentjahre). „Patent“ ist für Kleine ein Fachwort: einmal kurz erklären oder „Benz darf sein Auto als Erfindung schützen lassen“ – `kinder-redaktion` gegenlesen. |
| `wetter-nebel` | fakten: „Reif“ statt „Raureif“; stufen: Raureif ganz raus, Entdecker Hagel und Regen, Profi-Falle Tau | stufen-pruefer (Nebel wird Entdecker). |
| `wetter-berg-eis` | fakten Punkt 3 (Präzisierung), stufen: Tipps und zwei falsche Antworten neu („Oben scheint die Sonne schwächer.“ ungeprüft) | Fakten-Präzisierung übernehmen, stufen-Tipps übernehmen; die neue Falle zur Sonne vom fakten-pruefer prüfen lassen. |

## C. Größere Entscheidungen (betreffen Code und Umfang)

1. **Experte-Regel** (stufen-pruefer Punkt 22): Experte erst ab mindestens 4 echten Experte-Aufgaben je Spiel, bis dahin E3 („Experte gibt es hier noch nicht. Du spielst Profi.“), höchstens 3 Experte-Aufgaben je Runde über `waehleAufgaben`, aufgefüllt nur mit Profi. Empfehlung: so übernehmen, gleiche Regel wie Kreuz und quer.
2. **Neue Experte-Aufgaben** (stufen-pruefer Abschnitt 4: Everest im Graben, Amazonas und Nil, Regenbogen am Morgen, Hagel im Sommer): vom `karten-autor` fertig schreiben lassen, dann drei Prüfer. Danach hat Rekorde 4 und Wetter 4 (mit Hagel) Experte-Aufgaben. Wetter-Profi braucht 2–3 neue Aufgaben (Punkt 20).
3. **Sortiere die Zeit** (Punkte 23–26): 2 Rätsel je Runde (3/4/4 Teile), Jahreszahlen bis zum Prüfen verstecken, Zeitwort-Hinweis für Entdecker (neues Feld je Teil), Rückmeldung je Stufe, `Chronology` in `app/world-games.tsx` bekommt Stufen, Stufenzeile und „Zurück zu Entdecker“; Experte-Gruppen auf 5–6 Teile, vierte Gruppe „ganz früh“. Das ist der größte Brocken von Aufgabe 12 – im Plan als eigene Schritte zerlegen.
4. **„Fast richtig“** als neue Aufgabenart: nur ins BACKLOG (Ideen-Sammlung), nicht jetzt.

## D. Offen für echte Kinder (kein Helfer kann das klären)

- Kennen 6-Jährige „Mount Everest“, 8- bis 10-Jährige den Baikalsee?
- Macht Sortieren mit versteckten Jahreszahlen Kleinen Spaß?
- Ärgern die Experte-Denkfragen als „Trickfragen“?
