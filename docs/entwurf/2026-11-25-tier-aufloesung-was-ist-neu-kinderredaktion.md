# Kinder-Redaktion: „Was ist neu?“ Tierspiele

**Urteil: passt mit einer Änderung (Fassung A, zweiter Satz anders).**

> Helferbericht (kinder-redaktion, opus), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

**Gesamteindruck:** Gut. Die Sätze sind kurz (10 und 11 Wörter), und der Eintrag ist gebaut wie `technik-kurz`: erst was neu ist, dann ein anschauliches Beispiel. Ein Problem gibt es: „Nesseln“.

**Befunde**

1. `app/kern/neuigkeiten.ts`, id `tier-aufloesung`, Satz 2, das Wort „Nesseln“: Hier besteht echte Verwechslungsgefahr. Kinder kennen „Nesseln“ fast nur von der Brennnessel, also von einer Pflanze. Die Karte bringt ihnen aber gerade bei, dass die Seeanemone ein Tier ist (`app/world-catalog.json`, um Zeile 13612–13720: „Seeanemonen sind ebenfalls Tiere, keine Pflanze“). „Die Nesseln seiner Seeanemone“ stützt also genau das Missverständnis, das die Karte ausräumen will. In der Auflösung im Spiel hilft der Zusatz „wie eine Qualle“. Der fehlt im Eintrag. „Fangarme“ dagegen klingt nach Tier, und das Wort steht auch in der Auflösung.
   Vorschlag: „Zum Beispiel: Schleim schützt den Clownfisch vor den brennenden Fangarmen seiner Seeanemone.“ (11 Wörter)

2. Satz 1: „In drei Tierspielen erfährst du jetzt, warum deine Antwort stimmt.“ Der Satz ist gut so. Es ist richtig, dass er nicht wie `technik-kurz` mit „Liegst du richtig“ anfängt; zwei Einträge so dicht beieinander würden sonst gleich klingen.

3. Ton im Vergleich zu `technik-kurz`: Beide sind gleich warm und gleich lang und haben dasselbe Muster mit Beispiel. „Zum Beispiel:“ ist eine Spur steifer als „Bei der Rakete …“, lässt sich beim Vorlesen aber klar sprechen. Kein Änderungsbedarf. „Schleim“ ist ein gutes Wort für Kinder: anschaulich und ein bisschen lustig.

**Fertige Fassung**
```ts
{id: 'tier-aufloesung', datum: '2026-11-25', symbol: 'lupe', titel: 'Tierspiele: Darum stimmt es', text: 'In drei Tierspielen erfährst du jetzt, warum deine Antwort stimmt. Zum Beispiel: Schleim schützt den Clownfisch vor den brennenden Fangarmen seiner Seeanemone.'},
```

**A oder B:** A, mit der Änderung oben. A zeigt die Neuerung an einem Beispiel, und so eins merken sich Kinder. B ist richtig, aber abstrakt („hilft dir eine Frage beim Weiterdenken“). Außerdem spricht schon der Eintrag direkt darunter (`neue-farben`) über falsche Antworten. Die Denkfrage nach einer falschen Antwort entdecken Kinder im Spiel auch ohne Ankündigung.

**Für „Mehr erfahren“:** entfällt, ein Eintrag in „Was ist neu?“ hat keinen solchen Teil.

**Unsicher**
- Welche drei Spiele gemeint sind, steht nicht im Eintrag. Ich halte das für in Ordnung, weil die Neuerung kurz bleiben soll. Wenn Eltern nachfragen, könnte man die Spielnamen nennen, aber dann wird der Text länger.
- Zum Inhalt (Sache des `fakten-pruefer`): Dass Schleim den Clownfisch schützt, ist die übliche vereinfachte Erklärung. In der Forschung ist noch nicht ganz geklärt, wie der Schutz genau funktioniert. Für diesen Eintrag ist die Erklärung vertretbar, weil sie wörtlich zur Auflösung im Spiel passt (`/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/wt-tier/app/world-game-tier-aufloesung.json`).

Geprüfte Dateien: `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/wt-tier/app/kern/neuigkeiten.ts`, `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/wt-tier/docs/entwurf/2026-11-25-tier-aufloesung-was-ist-neu-entwurf.md`, `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/wt-tier/app/world-catalog.json` (die Stellen zur Seeanemone). Ich habe keine Dateien geändert.
