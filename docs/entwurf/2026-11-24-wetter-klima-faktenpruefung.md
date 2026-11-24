# Faktenprüfung „Wetter und Klima“, Endfassung (24.11.2026)

Helfer: `fakten-pruefer`. Geprüft: `2026-11-24-wetter-klima-endfassung.json` und `.md`. Nichts geändert. **Ergebnis:** 3 nötige Änderungen (gewitterwolke, zone-subtropen, Klimazonen-Satz), 1 Quelle tauschen (zone-tropen). Neue Experte- und Profi-Aufgaben stimmen, auch alle Zahlen. Alle 20 `topic`-IDs existieren.

## Nötige Änderungen

1. **wetter-gewitterwolke** `warumNicht[3]` („höchstens leichter Nieselregen“) falsch: graue Schicht kann Nimbostratus mit Landregen sein (DWD Nimbostratus; NOAA Ten Basic Clouds). → „Aus so einer Wolkendecke kann es lange regnen. Blitz und Donner bringt sie nicht.“ Dazu NSSL „Thunderstorm Basics“ (https://www.nssl.noaa.gov/education/svrwx101/thunderstorms/, towering cumulus) als Quelle für `warumNicht[2]`.
2. **wetter-zone-subtropen**: ohne Ort ist „Tropen“ nicht eindeutig falsch (DWD: Tropen zwischen den Wendekreisen; Wendekreis läuft durch die Sahara; Ohio heißt „Tropical Desert“). → „Zwischen den Tropen und der gemäßigten Zone liegen viele große, heiße Wüsten. Welche Klimazone ist das?“; Ohio-Quelle durch NOAA „Köppen-Geiger Subdivisions“ ersetzen (https://www.noaa.gov/jetstream/global/climate-zones/jetstream-max-addition-k-ppen-geiger-climate-subdivisions, BWh „Subtropical desert“).
3. **Klimazonen-Satz**: „Überall darin ist das Klima ähnlich“ übertreibt (DWD: „wesentliche Züge“; Polarzone eher Kappe). → „Klimazonen liegen wie breite Gürtel um die Erde. In einer Zone ist es ähnlich warm oder kalt.“
4. **wetter-zone-tropen**: NASA Kids sagt nicht „savanna“; NOAA „Subdivisions“ (Aw „Equatorial savanna“) als Beleg eintragen.

## Freiwillig

berg-eis `warumNicht[3]` → „Wind kühlt die Luft nicht ab. Er fühlt sich auf der Haut nur kälter an.“; ein-tag `warumNicht[3]` → „Das Wetter kann sich schnell ändern. Sicher weiß man das nicht.“; donner-zaehlen ergänzen „Zähl am besten drinnen.“ (NWS: „you should be in a safe place while counting“).

## Bestätigt

tau (NWS Dew), regenbogen-wann (NWS Flagstaff; Bogen höchstens 42° hoch), regenbogen-morgen (DWD Gegenpunkt der Sonne; Osten vereinfacht, „Westen“ bleibt eindeutig), hagel-sommer (NSSL „falls when … heavy enough“, DWD Gewitter vor allem im Sommer), reif-nacht (DWD Reiferscheinungen, Ausstrahlung), donner-zaehlen (DWD 3 s ≈ 1 km; NWS Sicherheitssatz), berg-eis Sonne (DWD-PDF UV +8 bis 10 % je 1000 m), gewitterwolke richtige Antwort (DWD Cumulonimbus), ein-tag Juli warm vertretbar, satz-klima Sahara vertretbar, alle `profiZusatz`, alle schon bestätigten Aufgaben. Karten passen; Einschränkung: `science-sound` (donner) erklärt Tonhöhe, nicht Schallgeschwindigkeit; `science-seasons` als Ersatz für eine fehlende Klima-Karte; Regenbogen zweimal `null` richtig.

Nicht geprüft: NOAA-Seiten nur über WebFetch-Zusammenfassung (curl 403); USGS Condensation, NSIDC Schnee nicht neu geöffnet; keine Juli-Mitteltemperatur, keine Hagel-Statistik, kein Kilimandscharo-Messwert 2026.
