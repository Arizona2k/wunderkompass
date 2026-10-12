# Kindernachrichten: geprüfte Ausgabe und ausgeschaltete tägliche Kette

Stand des 2B-Entwicklungsdiffs, 11. Oktober 2026; keine Veröffentlichungsfreigabe. Aufgaben/Abnahme bleiben ausschließlich im BACKLOG WK-043/044.

Die Website verwendet eigene kurze Erklärungen in app/news-content.json. Drei zeitnah geprüfte Erklärungen stehen zunächst in der Vorschau; ein älterer Marsbericht zeigt das tatsächlich befüllte Archiv. Alle Beiträge behalten Quellen-, Ereignis- und Prüfdaten. Nach 14 Tagen wandern Meldungen automatisch in die ältere Darstellung; ohne neu geprüfte Ausgabe steht eine ehrliche Leermeldung. Keine aktuelle Weltlage oder heutige Beobachtung aus alten Quellen ableiten. Originalquellen können für Erwachsene geschrieben sein. Keine fremden Bilder, Artikelkopien, Konten, Werbeeinbindungen oder Leseprofile.

## Was die vorhandene Kette tatsächlich tut

scripts/news/engine.mjs enthält erlaubte HTTPS-Hosts, begrenzten HTML-/RSS-/Atom-Abruf, Größen-/Inhaltstyp-/Umleitungsschutz, Timeout und maximal drei Wiederholungen, Kandidatenentdeckung, Datum/Alter/ID-/Duplikatprüfungen, gegenprüfbare Aussagenanker, Konfliktsperre, Formulierung aus redaktionell freigegebenen eigenen Briefs, Sprach-/Angst-/Werbeprüfungen, validierte Ausgabe und atomare Entwurfssicherung. Alte geprüfte Erklärungen bleiben bei Ausfall erhalten, ohne einen neuen Prüfzeitpunkt vorzutäuschen.

Die Quellenübersichten in discoverySources sind im Dry-Run mit der Kandidatenentdeckung verbunden. Absolute und relative erlaubte Artikel-Links sowie RSS/Atom-Einträge werden begrenzt eingelesen; doppelte URLs, Zukunfts-/Altmeldungen und ungültige Datumsangaben werden getrennt ausgewiesen. Höchstens drei aktuelle, neu geprüfte Briefs werden nach Quelldatum ausgewählt; zusätzliche Briefs bleiben zurückgestellt. Das Archiv und die letzte gültige Ausgabe bleiben erhalten. Die Tests bedienen die gesamte verbundene Kette mit synthetischen HTTP-Antworten einschließlich neuem unbekanntem Kandidaten. Die tatsächliche Richtlinie sperrt bereits den Abruf der Übersichten.

Für unbekannte neue Meldungen wird kein Text erfunden: ein eigener redaktionell geprüfter Brief und konkrete Aussagenanker sind erforderlich. Wortanker sind eine technische Änderungswarnung, keine selbständige Wahrheitsprüfung. Die manuelle Quellen-/Alters-/Fachprüfung bleibt verbindlich. NASA und JPL sind dieselbe Organisation; zwei URLs sind keine unabhängige Bestätigung. Der Feedparser übernimmt keine fremden Überschriften als Kindernachricht.

scripts/news/pipeline.mjs verbindet Quellenentdeckung, echten begrenzten HTTP-Abruf, Briefprüfung und atomaren Entwurf. scripts/news/check-daily.mjs verbindet diesen Ablauf mit dem Tagesadapter; ein realer Aufruf meldet mit der vorhandenen Richtlinie inactive und erzeugt keinen Abruf. Ein zusätzlicher durchgängiger Test führt den Tagesadapter bis zum gespeicherten Entwurf mit kontrollierten HTTP-Antworten aus, prüft den einmaligen Tag, das Archiv, unbekannte Kandidaten und die weiterhin gesperrte Veröffentlichung.

scripts/news/schedule.mjs ist der getestete, aufrufbare Tagesadapter: 12:30 Europe/Berlin, tatsächliche MEZ/MESZ-Umrechnung, reservierter Lauf, höchstens ein erfolgreicher Lauf je Berliner Tag, erneut versuchbarer Fehler. Er registriert keinen Timer und startet keinen Workflow. Eine nach einem Absturz vorhandene Reservierung wird nicht automatisch nach Alter gestohlen; Betreiber prüft den tatsächlichen Prozess und entfernt nur eine nachweislich verwaiste lokale Reservierung.

Der gesonderte Bereitstellungsadapter prüft ausgeschaltete Veröffentlichung, exakten freigegebenen Entwurfsfingerabdruck und Ausgabestruktur. Tests verwenden ausschließlich temporäre Dateien und synthetische Quellenantworten. Er ist kein Merge-/Vercel-/Produktionsfreigabeweg. news-source-policy.json lässt Scheduler, Veröffentlichung, externes KI-System und regelmäßigen Abruf ausdrücklich aus. Keine aktiven Actions/Cronjobs, Secrets, Schreibrechte oder neuen Dienste eingerichtet.

## Reproduzierbarer Dry-Run

`node scripts/news/dry-run.mjs` schreibt ausschließlich work/news-dry-run/draft.json und report.json. Mit der tatsächlichen ausgeschalteten Quellenrichtlinie meldet er die ausstehende Abruffreigabe und erhält die letzte geprüfte Ausgabe. Ausgabe unter app/ wird dabei nicht geändert. `pnpm test` enthält die Kette und ihre negativen Fälle; tests/news.test.mjs lässt sich zusätzlich direkt mit Node ausführen.

## Vor einer separat beauftragten Aktivierung

Pro Anbieter tatsächliche regelmäßige Beschaffungs-/Verarbeitungsbedingungen, Schnittstelle/Feed, Abrufhäufigkeit und erreichbare Hosts prüfen. logo! ist nur als mögliche Quelle dokumentiert und nicht angeschlossen; einzelne Artikel waren mit den vorhandenen Recherchewerkzeugen nicht erreichbar. Für nachrichtenleicht bestehen manuell gelesene Artikel, keine behauptete regelmäßige Abruffreigabe. Die aktuelle Shell-Netzrichtlinie erlaubt die benötigten Nachrichten-/NASA-Hosts nicht; ein direkter NASA-Leseversuch scheiterte tatsächlich. Die Rechercheverbindung konnte die in der Ausgabe bezeichneten Quellen lesen. Keine Proxy-/Host-Sperre umgehen.

Noch benötigt werden: separat freigegebener Laufkontext mit zulässigem Quellenzugriff, überprüfte Anbieterbedingungen, konkrete redaktionelle Zuständigkeit für neue Briefs/Konflikte, gewünschter kostenloser vorhandener Scheduler und ein ausdrücklich reviewter Bereitstellungsweg. Ohne diese Nachweise bleibt die produktive Kette aus. Vollständige technische Tests mit kontrollierten Eingaben ersetzen diese reale Betriebsabnahme nicht.

Bei Fehlern: letzte Ausgabe beibehalten, Report lesen, Quelle/Datum/Aussagenanker prüfen, Konflikte redaktionell klären, korrigierten Entwurf erneut prüfen. Niemals stillschweigend ein altes Datum auf heute setzen, Freigabefingerabdruck wiederverwenden oder unbestätigte Meldungen durchlassen.
