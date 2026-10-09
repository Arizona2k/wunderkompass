# Verbindliche Qualität und Tests

## Technische Bestandsgarantien

Node 24 und pnpm 11.25.0 mit pnpm-lock.yaml verwenden; Installation mit `pnpm install --frozen-lockfile`. Abweichungen und Installationshindernisse ausdrücklich dokumentieren, keine stillen Lockfile-/Versionswechsel. Aktiver Einstieg: index.html → migration/main.tsx → vorhandene React-App, Vite, statischer dist/. Historische Sites-/Cloudflare-/D1-/Auth-Beispiele sind kein aktiver Lernserver.

Karten-, Fragen-, Reise-, Spiel-, Kapitel-, Modell- und Fortschritts-IDs sowie Hash-Navigation erhalten. Ein zentraler Schema-3-Pass mit Appkennung `earth-explorer`, IndexedDB `earth-explorer` Version 1 / Store `saves` / Schlüssel `main`, Journal `erde-entdecken:save:v3` und Legacy-Leseschlüssel `erde-entdecken:forscherpass:v2`. Kein zweiter Lernspeicher. Marken-/Domainwechsel migrieren diese Identität nicht automatisch. Speicheränderungen brauchen Nachweise für alte Schema-3-/Legacy-v2-Daten, future/defekte Daten, Import/Export, Reload und Tab-Konflikte.

Nur synthetische Prüfpässe verwenden. Persönliche Passdateien, Notizen, Browserprofile und Geheimnisse niemals versionieren. Bild-/Datenlizenzen, Quellen, Alt-Texte und Modellgrenzen erhalten. Offline-Updates dürfen vorhandenen Pass oder vollständigen vorherigen Cache nicht unbelegt verwerfen.

## Prüfbasis und risikogerechte Erweiterung

Für Code-/Inhaltsänderungen im Repository ausführen:

```bash
pnpm run typecheck
pnpm run lint
pnpm test
pnpm run build
pnpm run verify
```

Bei Änderungen an exportierten Inhalten erst `pnpm run export:data`, danach Integrität prüfen und den gewollten Export-Diff reviewen. Bei reinen Dokumentationsänderungen sind Link-/Regelkonsistenz, Diff und `git diff --check` erforderlich; vorhandene App-Prüfungen können zusätzlich den übernommenen Stand absichern. Keine neuen Tests schreiben, die lediglich Dokumentationsformulierungen spiegeln.

Browserwerkzeuge sind separat unter qa/package.json mit eigenem qa/pnpm-lock.yaml gebunden. GitHub Actions behandelt die portable Browserprobe als Pflichtprüfung; lokal müssen Playwright/Chromium tatsächlich installiert sein. Produktionsbuild statt bloßer DOM-Simulation bedienen:

```bash
pnpm --dir qa install --frozen-lockfile
pnpm --dir qa exec playwright install --with-deps chromium
pnpm run test:browser
```

Die Probe startet ihren eigenen lokalen Preview-Server und speichert isolierte Nachweise unter .qa-output/. QA_PORT und QA_PLAYWRIGHT_MODULE/QA_BROWSER_EXECUTABLE erlauben explizite Umgebungsanpassung. Historische Browser-Skripte zuerst auf alte absolute Pfade prüfen; nicht blind als portable Vollabnahme ausgeben.

## Kritische Nutzung wie ein echter Nutzer

- Mindestens Desktop 1440×900, Tablet 768×1024 und Smartphone 390×844; für veränderte enge Layouts zusätzlich 360 px. Ansichten visuell ansehen, Bilder dekodieren, Überläufe und Konsolen-/HTTP-Fehler prüfen.
- Start/Globus → Ort oder Karte → Modell/Frage → passendes Spiel → Pass → Reload/Fortsetzen. Global suchen, Tippfehler und leere Treffer prüfen; Direktlinks und Browser-Zurück/Vor bedienen.
- Spiele mit falscher und richtiger Antwort, gespeicherter Zufallsrunde, Reload und Abschluss prüfen. Ein bloßer Klick zählt nicht als Lernnachweis.
- Tastatur, Sprunglink, Dialogöffnung/-schließung und Fokusrückkehr, Touch-Alternativen, Kontrast und reduzierte Bewegung kontrollieren; relevante axe-Prüfungen ergänzen. Ein Axe-Ergebnis ersetzt keine Screenreader-Abnahme.
- Bei Speicherung/Offline: realer synthetischer Dateiexport, bestätigter Import/Reset, zwei Tabs, vollständiger Browser-Neustart und vorbereiteter Offlinebetrieb; für Workeränderungen explizites Update von altem Build mit Passerhalt.
- Für Inhalte Lernziel, Verständlichkeit, Fachquellen mit Prüfdatum, Maße/Jahre/Unsicherheit und passende Verbindungen kontrollieren. Keine pauschal als verifiziert bezeichneten ungeprüften Quellenlinks.

Fehler korrigieren und betroffene Prüfungen wiederholen. Browsergrößen und Software-WebGL ersetzen keine physischen Geräte. Hörprobe, Safari/Firefox, Screenreader und schwächere Hardware bleiben konkrete Aufgaben, bis Nachweise vorliegen.

## Abschluss und Freigabe

Ein Arbeitspaket ist abgeschlossen, wenn Akzeptanzkriterien erfüllt, relevante Prüfungen bestanden, offene Grenzen dokumentiert, Projektgedächtnis aktualisiert und beabsichtigte Änderungen in Git gesichert sind. Ein ungetesteter Zwischenstand darf als solcher in einem Draft-PR gesichert werden, erhält aber keine Qualitätsfreigabe. Pro Durchlauf in PROJECT_STATE.md festhalten: Datum, Basis-/getesteter Commit bzw. eindeutig bezeichneten Diff, Werkzeugversionen, Befehle, Exitcodes, tatsächlicher Umfang, Warnungen, Blocker, Branch/PR und nächster Schritt. Rohlogs lokal unter work/ oder .qa-output/; relevante sichere Ergebnisse dauerhaft dokumentieren.

main niemals direkt ändern; keine automatische Zusammenführung oder Veröffentlichung beim GO. Unabhängige Websiteänderungen nicht in einen Dokumentations-/Einrichtungsauftrag mischen.

## Vorbereitete automatische Testpersonen-Freigabe – ausgeschaltet

TEST-LIVE.md ist die aktuelle technische Betriebs- und Aktivierungsanleitung. Das private Repository besitzt keine aktive Branch Protection; die Rulesets-API fordert einen Tarifwechsel. Die deaktivierte Vorlage ist kein Schutz. Freiwillige CI verhindert weder direkten Push noch manuelles Merge durch Schreibberechtigte. main bleibt in dieser Kette vollständig getrennt.

Quality prüft weiterhin PR-Merge-Stände gegen main/test-live: Frozen-Installationen, typecheck, lint, Unit-Tests, build, verify, portable Chromium-Probe. Hinzu kommen `node --test tests/release/*.test.cjs` mit echter lokaler Git-Übernahme, serverseitiger Lease-Konkurrenz, Rückfallbaum und gemeinsamem Reservierungsprotokoll. Ein Fehler lässt den Job fehlschlagen.

Die vorbereitete Controlled-test-release-Kette ist zusätzlich durch eine feste false-Sperre deaktiviert und startet erst nach reviewter Entfernung dieser Sperre sowie späterer Aktivierung mit TEST_LIVE_AUTORELEASE=enabled und geeignetem PR-Label. Sie prüft den **exakten Headcommit** vollständig in einem Job ohne Schreibrechte/Secrets. Der Publisher läuft separat auf vertrauenswürdigem Zielbranchcode, wiederholt alle Zulässigkeits-/SHA-Prüfungen, sichert den Vorgänger und aktualisiert nur test-live mit serverseitiger Lease und geprüfter Fast-forward-Abstammung. Fehler, Abbruch, neue Zielbasis, geänderter Head oder zweite Entwicklung verhindern die reguläre Übernahme. Keine neue Merge-/Squash-SHA veröffentlichen. Wartungsänderungen an Tests, Workflows, Abhängigkeiten oder Regeln sind von automatischer Freigabe ausgeschlossen. Der sichere Labelzustand ist keine unabhängige menschliche Reviewpflicht.

Browsernachweis: drei Größen, Suche/Tippfehler/leere Treffer, Hashlinks/Zurück/Vor, Bilder, Hubs, Memory/Fortsetzen/Abschluss, Favoriten/Reload, vollständige Offline-Vorbereitung und kalter Browserneustart mit beendetem Server. Vollständiger Pass-Import/Reset/Tab-Konflikt-Browserweg bleibt WK-004; Geräte, Safari/Firefox, gehörte Stimme, Screenreader und fachliche Abnahme bleiben offen. Diese Einrichtungsaufgabe ändert keine Speicher-/Anwendungsfunktion.

Vor Aktivierung sind echte Actions-Schreibrechte, Restkontingent/Ausgabenlimit, Token→Vercel-Ereignis, konstanter geschützter Alias und Rückfall auf vorherigen funktionierenden Deploymentstand isoliert zu bestätigen. Keine bestehenden Zugangseinstellungen ändern oder Geheimlinks ausgeben. In diesem Auftrag keine Übernahme nach test-live/main und keine Testwebsite-Veröffentlichung. Git-Rückfall und Aktivierungsgrenzen siehe TEST-LIVE.md.
