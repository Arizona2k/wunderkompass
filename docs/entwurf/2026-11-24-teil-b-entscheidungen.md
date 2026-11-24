# Teil B „Spiele kniffliger“ – Entscheidungen und verschobene Kleinigkeiten

Stand: 24.11.2026. Sammelt, was beim Bauen von Teil B entschieden oder verschoben wurde, damit ein neuer Chat nichts neu ausdenken muss. Plan: [Teil B je Aufgabe](2026-11-24-teil-b-plan.md).

## Aufgabe 7: Auswahl-Helfer

1. **Die vorige Runde kommt zuletzt** (Claude, 24.11.2026, technisch): In jeder Gruppe (falsch und fällig, ungesehen, fällig, Rest) stehen Aufgaben der vorigen Runde hinten. Grund: Eine falsche Antwort ist sofort wieder fällig; ohne diese Regel käme sie gleich in der nächsten Runde wieder statt mit Abstand. Zugleich ist damit „nie dieselbe Runde“ gesichert, sobald der Vorrat größer als eine Runde ist.
2. **„Neue Runde“ merkt sich die vorige Runde** (Claude, 24.11.2026): Bisher löschte „Neue Runde“ den ganzen Spielstand, und die nächste Runde wusste nichts von der vorigen. Jetzt bleibt die Auswahl als `vorige` im frischen Spielstand (`gameSessions['world:<spiel>'].vorige`). Kein neues Pass-Feld: `gameSessions` ist der freie Spielspeicher.
