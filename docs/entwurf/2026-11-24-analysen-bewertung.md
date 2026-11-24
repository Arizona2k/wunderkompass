# Bewertung zweier weitergeleiteter Analysen (24.11.2026)

Der Nutzer hat am 24.11.2026 abends zwei Analysen weitergeleitet („unabhängige GitHub-Analyse“ und „Ergänzende Analyse“, Stand test-live). Sie sind ausdrücklich keine nachgewiesenen Fehler; der Nutzer bittet um kritische Prüfung: „wir wollen es verbessern, nicht verschlechtern“. Diese Datei hält fest, was Claude daraus macht. Teil 1 ist Claudes erste Bewertung; Teil 2 ergänzt die Nachprüfung der technischen Behauptungen am Code durch den `technik-pruefer`.

## Teil 1: Erste Bewertung (Claude)

**Übernehmen (passt und fehlt noch):**
- *Einheitlicher Qualitätsmaßstab für alles* und *Bewährtes übertragen*: steht im Kern schon in „Kein Bestandsschutz“ und „Wachsen lassen“; kurz und ohne neue Bürokratie als eine Regel in `CLAUDE.md` ergänzt („Qualitätsmaßstab für Altes, Neues und Künftiges“), dazu die Regel „Einheitlich und stimmig, überall“ (Wunsch des Nutzers am selben Abend).
- *Unterlagen schlanker*: berechtigt. `STATUS.md` ist über die vereinbarten 60 Zeilen hinausgewachsen (lange Absätze je PR), `BACKLOG.md` hat viele erledigte Punkte. Vorschlag: beim nächsten Phasenschritt erledigte Punkte in eine Archivdatei verschieben und STATUS je PR auf zwei Zeilen kürzen (Messung durch `technik-pruefer`, Teil 2).
- *Technische Behauptungen* (Importgrenzen, Zeitzone, Speicherversuche, Sicherheitsheader, Offline-Speicher, Versionen): werden am Code nachgeprüft (Teil 2), erst dann umgesetzt.
- *Echte Kinder testen*: deckt sich mit der bestehenden Regel „echte Kinder bleiben die wichtigste Rückmeldung“. Konkreter Vorschlag an den Nutzer: nach jedem sichtbaren PR eine Frage an ein Kind (z. B. „Was war zu leicht, was zu schwer?“), Antwort kurz im Chat; Claude trägt sie ein.

**Schon geplant (Doppelungen, keine neue Aufgabe):**
- Abenteuerrouten über Welten → Lernrouten gibt es; Urzeit-Welt mit Dinosauriern und Fossilien ist im Katalog 2027 (Phase 3).
- Vermuten, ausprobieren, schließen → Teil C, Aufgabe 13 (Labore: erst ausprobieren, dann Frage; Experte mit Vermutung und Begründung).
- Neue 3D-Modelle nur mit echtem Lernnutzen → Phase 4, Punkt „3D-Modelle“ sagt genau das.
- Wissensdetektiv / Rätselgeschichten → Phase 2, „Knobelfälle und Schätzfragen“ (Detektivfälle mit Hinweisen aus drei Karten).
- Größere Dateien modularisieren „bei ohnehin anstehenden Änderungen“ → so arbeiten wir; konkrete Reihenfolge nach Teil 2.

**Vorsicht oder nicht jetzt:**
- *Lernerfolg messen* über „Verständnis und Übertragung“: ohne Konto und ohne Daten nur indirekt möglich (Experten-Fragen sind genau solche Übertragungsaufgaben). Kein Tracking, keine Auswertung über Kinder – das widerspräche der Datenschutz-Linie.
- *Innenwelten, Größenvergleich, Zeitmaschine, „Was wäre, wenn?“, Erfinderwerkstatt*: gute Richtungen, aber jede ist ein großes Vorhaben mit Inhalten, Bildern und Prüfungen. Erst nach Phase 1; ins BACKLOG (Ideen-Sammlung), je mit kritischem Blick auf Lernwert gegen Aufwand. Der Größenvergleich wurde in Teil A schon einmal bewusst gestrichen (Entscheidung zu Teil A); vor einer Neuauflage den Grund nachlesen.
- *„Automatisiert erkennen, wo Inhalte fehlen“*: teilweise schon da (Linkwächter, Inhaltswächter, Ratemuster-Test, Foto-Inventur). Ein weiterer Wächter lohnt nur, wo er etwas findet, das Kinder merken.

## Teil 2: Nachprüfung am Code (`technik-pruefer`)

Folgt.
