# Helfer-Einsatzplan

Entscheidet Claude (Nutzer, 25.11.2026: „wer welches Modell nimmt, musst du entscheiden“). Hier steht für jeden Helfer: welches Modell und warum, wann er anfängt und wann er wieder läuft. Claude passt den Plan an, sobald ein Helfer daneben liegt, und nennt die Änderung im nächsten Bericht. Die Tabelle in `CLAUDE.md` und die Kopfzeilen in `.claude/agents/*.md` folgen diesem Plan.

## Grundsätze

- **Stärke nach Folgen:** Wo ein Fehler Kinder trifft (falsche Fakten, unfaire Fragen, verlorener Pass, schwere Texte), nimmt der Helfer `opus`. Wo er viele Klicks oder Suchen macht und Claude das Ergebnis ohnehin prüft, reicht `sonnet`. `fable` prüft zuletzt das Ganze. `haiku` macht Massenprüfungen, bei denen nur ja oder nein zählt.
- **Höher stufen, wenn etwas durchrutscht:** Findet eine spätere Prüfung, was ein Helfer hätte sehen müssen, schärft Claude zuerst seine Anleitung (Abschnitt „Aus Fehlern lernen und vorausdenken“). Rutscht danach wieder etwas Gleichartiges durch, bekommt er ein stärkeres Modell oder eine höhere Stufe.
- **Herunterstufen, wenn es reicht:** Liefert ein Helfer über mehrere Einsätze nur Bestätigungen und keine Funde, prüft Claude, ob ein schwächeres Modell oder seltenere Einsätze genügen. Das spart Nutzungslimit für die Stellen, die zählen.
- **Gründlich in jedem Bestand:** Ein Helfer, der etwas anpackt, prüft das Neue und das Alte in der Nähe gleich gründlich, auch Themen, die bald kommen (Regel „Kein Bestandsschutz“).

## Je Helfer

| Helfer | Modell / Stufe | Warum | Fängt an | Läuft wieder |
|---|---|---|---|---|
| `karten-autor` | opus / high | Schreibt alle Kindertexte; Ton und Quellen müssen stimmen | Beim Entwurf jedes neuen oder geänderten Kindertexts, große Aufträge in Paketen | Nach Prüferfunden nur für die betroffenen Texte |
| `kinder-redaktion` | opus / high | Verständlichkeit für 5- bis 10-Jährige braucht Feingefühl | Jede Fassung eines Kindertexts, auch „Was ist neu?“ | Nach jeder Umschreibung, nur für die geänderten Texte |
| `fakten-pruefer` | opus / high | Falsche Aussagen sind der teuerste Fehler | Jede neue oder geänderte Aussage, Zahl oder Verbindung, in Paketen | Nach jeder inhaltlichen Korrektur, nur für die Korrektur |
| `stufen-pruefer` | opus / high | Ratemuster und unfaire Fallen sind schwer zu sehen | Jede neue oder geänderte Frage, Falle oder Stufe | Nach Änderungen an Fallen oder Fragen |
| `code-pruefer` | opus / high | Schützt Pass, IDs und Links | Jede Code-Änderung, vor dem PR | Nach Korrekturen an Code, nur der Diff seit seinem Bericht |
| `design-pruefer` | opus / high | Seit 25.11.2026 statt sonnet: Der Design-Umbau „Kompass“ ist der wichtigste sichtbare Schritt, und Stimmigkeit über viele Seiten braucht mehr Urteil | Jede sichtbare Änderung, vor dem PR | Nach sichtbaren Korrekturen, nur die betroffenen Ansichten |
| `spieltester` | sonnet / high | Viele Klicks im Browser; sein Urteil prüfen danach die Fach-Helfer | Sichtbare Änderung an Spiel, Karte, Labor, Reise oder Bedienung, mit genauem Namen, Weg, Rolle und Gerät | Nach Korrekturen am Ablauf; am Phasenende |
| `bild-recherche` | sonnet / medium | Suchen und Lizenzen lesen; Claude prüft jeden Nachweis vor dem Einbau | Für jede Karte ohne freies Original, in Paketen von etwa 8 | Wenn ein Kandidat abgelehnt wird |
| `ideen-scout` | opus / high | Seit 25.11.2026 statt sonnet: Er soll weiter denken als naheliegende Ideen; läuft selten | Vor jedem neuen Bereich oder Spiel und einmal je Phase | Wenn ein Entwurf hängt |
| `technik-pruefer` | opus / high | Seit 25.11.2026 statt sonnet: prüft, räumt auf, plant voraus und schlägt Verbesserungen vor | Nach jedem Merge im Hintergrund („Vorausdenken“), nach jedem späten Fund, am Phasenende | Wenn seine Vorschläge umgesetzt sind, prüft er sie beim nächsten Lauf mit |
| `schluss-pruefer` | fable / high, Phasenende xhigh | Letzter, unabhängiger Blick auf das Ganze | Jeder PR mit App-, Inhalts-, Test- oder Werkzeugänderung, vor PR-Link oder Auto-Merge | Nach blockierenden Funden, nur die Korrektur |

## Ablauf je Schritt

1. **Beim Einstieg** (`/weiter`): Helfer mit offener Aufgabe laut `STATUS.md` starten gleichzeitig im Hintergrund.
2. **Beim Bauen:** `karten-autor` schreibt; `kinder-redaktion`, `fakten-pruefer` und `stufen-pruefer` prüfen gleichzeitig, jeweils in Paketen.
3. **Vor dem PR:** `code-pruefer`, `design-pruefer`, `spieltester` gleichzeitig, während die Prüfkette läuft.
4. **Zuletzt:** `schluss-pruefer` auf dem fertigen Diff, parallel zu den großen Suiten.
5. **Nach dem Merge:** `technik-pruefer` „Vorausdenken“ im Hintergrund, während Claude den nächsten Schritt angeht.
