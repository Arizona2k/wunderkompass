# Hinweise und Erklärungen für Katta und Feuersalamander (Entwurf `karten-autor`, 24.11.2026)

Grundlage: [Nachprüfung](2026-11-24-startfragen-nachpruefung.md). Antworttexte bleiben unverändert (gespeicherte Antworten). Danach prüfen `fakten-pruefer`, `kinder-redaktion`, `stufen-pruefer`.

## Katta (`animal-ring-tailed-lemur`)

```json
"questionFeedback": {
  "hint": "Zeig auf deine Nase. Welches Zeichen kann deine Nase bemerken?",
  "wrongReasons": [
    "Einen aufgerichteten Schwanz sieht man mit den Augen. Er ist wie eine Fahne für die Gruppe.",
    null,
    "Einen Ruf hört man mit den Ohren. Gesucht ist ein Zeichen für die Nase."
  ]
}
```

- `why` bleibt. Hinweis auch in `app/challenge-hints.json` (`animal-ring-tailed-lemur:mini`).
- Hinweis führt über den Sinn zur Lösung, passt weder auf Schwanz (Augen) noch Ruf (Ohren).
- `wrongReasons[0]`: Vorschlag der `kinder-redaktion` („Riechen kann man ihn nicht“) bewusst nicht übernommen – sachlich falsch: Kattas reiben Duft aus Handgelenkdrüsen auf den Schwanz und wedeln ihn zum Gegner (Smithsonian).
- Quelle: Smithsonian National Zoo, „Ring-tailed lemur“, https://www.nationalzoo.si.edu/animals/ring-tailed-lemur (schon in `sources`): „tails raised in the air, like flags, to keep group members together“; „one of the most vocal primates“; „scent glands on their wrists … rubbed on the tail and flicked at an opponent“.

## Feuersalamander (`animal-fire-salamander`)

```json
"question": {
  "prompt": "Was haben junge Salamander im Bach?",
  "why": "Junge Feuersalamander atmen im Bach mit Kiemen. Die Kiemen sitzen außen, wie kleine Büschel. Später verschwinden die Kiemen. Dann verlassen die Tiere das Wasser."
},
"questionFeedback": {
  "hint": "Im Bach leben die Jungen unter Wasser. Womit kann ein Tier dort atmen?",
  "wrongReasons": [
    null,
    "Die Jungen haben Kiemen. Damit atmen sie unter Wasser, anders als die Großen an Land.",
    "Die Jungen sehen noch anders aus als die Großen. Später verwandeln sie sich und verlieren ihre Kiemen."
  ]
}
```

- Nur `prompt` und `why` ändern sich in `question`; Hinweis auch in `app/challenge-hints.json` (`animal-fire-salamander:mini`); `homeQuestion` über `pnpm run export:data`.
- Fragesatz „junge Salamander“: „Feuersalamander“ hat 15 Buchstaben (über der Grenze), Bindestrich wirkt uneinheitlich, weiches Trennzeichen ungeprüft; Titel steht direkt darüber.
- `wrongReasons[1]` bewusst ohne „ohne Kiemen könnten sie nicht atmen“ (Larven atmen wohl auch über die Haut).
- Quellen: NABU Euskirchen, „Feuersalamander – ein Portrait“, https://www.nabu-euskirchen.de/2026/06/03/feuersalamander-ein-portrait/ (schon in `sources`): „auffällige äußere Kiemen“, „Die Larven leben zunächst mehrere Monate im Wasser“, „kleine Bäche“, „Nach etwa 2 bis 6 Monaten erfolgt die Metamorphose zum Landsalamander“, „bilden sich die Kiemen zurück und die Tiere verlassen das Wasser“. Wikipedia „Feuersalamander“, https://de.wikipedia.org/wiki/Feuersalamander (neu vorgeschlagen): „äußere Kiemenbüschel“, „Metamorphose vom kiemenatmenden Wasserbewohner zum lungenatmenden Landtier“.
- Offen: genaue Lage der Kiemen nicht belegt (darum nur „außen“); Larven auch in Tümpeln und Teichen (Frage sagt „im Bach“, vertretbar); Ratemuster der Antwortlängen bleibt bis zum Tierwelt-Durchgang.
