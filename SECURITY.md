# Datenschutz und sichere Weiterarbeit

Die portable Lernanwendung benötigt keine API-Schlüssel und keinen Login.
Persönliche Pässe und Notizen bleiben im jeweiligen Browser; heruntergeladene
Passdateien enthalten persönliche Lernstände und gehören außerhalb des Projekts
aufbewahrt. Nur synthetische Prüfdaten verwenden. `.gitignore` und
`.vercelignore` schützen vor versehentlichen neuen Aufnahmen beziehungsweise
CLI-Uploads; sie entfernen keine bereits veröffentlichten Daten.

## Lokaler Start und Konfiguration

Node 24 und pnpm 11.25.0: `pnpm install --frozen-lockfile`, danach `pnpm run dev`.
Es muss keine `.env` angelegt werden. `.env.example` enthält ausschließlich
Hinweise. Bestehende lokale Geheimnisse nicht löschen oder durch Beispielwerte
ersetzen. `VITE_*`, `NEXT_PUBLIC_*` und Dateien unter `public/` sind öffentlich;
echte Geheimnisse dürfen dort auch als Umgebungsvariable nicht landen.

GitHub Actions verwendet kurzlebige Jobtokens. Die aktive Quality-Pipeline hat
nur Leserechte und keine persistierten Checkout-Zugangsdaten. Die alte
`pull_request_target`-Releasekette bleibt durch ihre feste false-Bedingung aus.
Keine Schlüssel für diese Prüfung anlegen. Der Newsbetrieb bleibt deaktiviert;
`NEWS_SIGNING_JWK` wäre ausschließlich ein serverseitiges Jobsecret, kein
erforderlicher Platzhalter für die Lernanwendung.

## Commit-Identität

Vor eigenen Commits `git config --show-origin --get user.email` lokal prüfen.
Die in GitHub → Settings → Emails angezeigte persönliche GitHub-Noreply-Adresse
mit `git config --local user.email ADRESSE` nur in diesem Checkout setzen.
Keine Adresse erraten, keine globale Konfiguration ändern. Auch der Autorname
kann personenbezogen sein; dafür bei Bedarf lokal den öffentlichen GitHub-Namen
verwenden. Unter GitHub → Settings → Emails können die Privatstellung der
E-Mail und das Blockieren von Pushes mit privater E-Mail aktiviert werden.

## Bestätigte verbleibende Veröffentlichung

Die Prüfung vom 17.10.2026 bestätigt eine private Autor-E-Mail in alten
Commit-Metadaten. Sie steht auch in älteren Actions-Laufmetadaten. Die aktuelle
Repository-Konfiguration dieses Prüfcheckouts wurde auf die bereits belegte
korrekte GitHub-Noreply-Adresse umgestellt. Keine globale oder Kontoänderung.
Ein neuer Klon übernimmt diese lokale Konfiguration nicht automatisch.

Ein lokaler, getrennter Rewrite wird vorbereitet und gegen die ursprünglichen
Dateibäume geprüft. **Keine Remote-Historie umgeschrieben.** Vor einer späteren
Übernahme alle laufenden Arbeiten sichern und abstimmen: neue Commit-SHAs
betreffen sämtliche Branches, offene PRs, Prüfnachweise und Deploymentbezüge.
Alte Actions-Metadaten, GitHub-PR-Refs, Caches und fremde Kopien verschwinden
dadurch nicht. GitHub Support kann zur Entfernung alter Referenzen/Caches
erforderlich sein; eine Entfernung außerhalb der eigenen Kontrolle ist nicht
garantiert. Die konkreten Prüfergebnisse und Grenzen stehen im aktuellen
Datenschutzabschnitt von PROJECT_STATE.md.

Es wurden keine echten offengelegten Zugangsdaten bestätigt und keine Schlüssel
rotiert oder gesperrt. Bei einem späteren bestätigten Fund zuerst betroffene
Provider-Zugangsdaten ersetzen und sperren; das Löschen der Fundstelle allein
stellt ihre Vertraulichkeit nicht wieder her. Sensible Funde weder in öffentlichen
Issues/PR-Kommentaren noch in unmaskierten Scannerberichten veröffentlichen.
