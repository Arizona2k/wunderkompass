# Teil B „Spiele kniffliger“ – Entscheidungen und verschobene Kleinigkeiten

Stand: 24.11.2026. Sammelt, was beim Bauen von Teil B entschieden oder verschoben wurde, damit ein neuer Chat nichts neu ausdenken muss. Plan: [Teil B je Aufgabe](2026-11-24-teil-b-plan.md).

## Aufgabe 7: Auswahl-Helfer

1. **Die vorige Runde kommt zuletzt** (Claude, 24.11.2026, technisch): In jeder Gruppe (falsch und fällig, ungesehen, fällig, Rest) stehen Aufgaben der vorigen Runde hinten. Grund: Eine falsche Antwort ist sofort wieder fällig; ohne diese Regel käme sie gleich in der nächsten Runde wieder statt mit Abstand. Zugleich ist damit „nie dieselbe Runde“ gesichert, sobald der Vorrat größer als eine Runde ist.
2. **„Neue Runde“ merkt sich die vorige Runde** (Claude, 24.11.2026): Bisher löschte „Neue Runde“ den ganzen Spielstand, und die nächste Runde wusste nichts von der vorigen. Jetzt bleibt die Auswahl als `vorige` im frischen Spielstand (`gameSessions['world:<spiel>'].vorige`). Kein neues Pass-Feld: `gameSessions` ist der freie Spielspeicher.

## Aufgabe 8: Welt-Spiele

3. **Stufenwechsel in einer Runde startet eine neue Runde der neuen Stufe** (Claude, 24.11.2026; übertragen von der Karte, dort vom Nutzer am 24.11.2026 so entschieden: „Nach einem Stufenwechsel kommt eine Frage der neuen Stufe“). Alle Wege:
   - Spiel im Spielebereich öffnen: neue Runde mit der Stufe aus dem Pass, oder die gespeicherte Runde mit ihrer Stufe.
   - In der Runde „Ändern“ oder „Zu schwer? Zurück zu Entdecker“: sofort eine neue Runde der neuen Stufe. Die vorige Runde wird gemerkt (kommt nicht gleich wieder), `geschafft` und Spielstempel bleiben. Gesammelte Wiederholungen (`review`) bleiben.
   - Stufe im Pass oder auf einer Karte ändern, dann zurück ins Spiel: Die angefangene Runde läuft mit ihrer Stufe zu Ende (E1). Über der Runde steht „Diese Runde spielst du noch als <Stufe>. Die neue Stufe gilt ab der nächsten Runde.“
   - Neuladen, „Fortsetzen“, Zurück im Browser: die gespeicherte Runde mit ihrer Stufe.
   - Fertige Runde: „Neue Runde“ beginnt mit der Stufe aus dem Pass.
   - Alte Runde aus der Zeit vor Teil B (ohne `stufe`): läuft als Entdecker mit ihren drei Antworten zu Ende.
   - Experte gewählt: Die Runde spielt Profi und sagt es („Experte gibt es hier noch nicht. Du spielst Profi.“, E3).
4. **Früher oder heute? ohne vierte Antwort** (Claude, 24.11.2026, nach D3): Die Antworten sind Kategorien („Früher“, „Heute“, „Noch keine wirkliche Entwicklung“). Eine vierte wäre erfunden. Profi heißt dort 8 statt 5 Aufgaben.
5. **Profi-Fallen nach Gruppe und Zeit** (Claude, 24.11.2026): Tierdetektiv aus derselben Tiergruppe (kleine Gruppen zusammengelegt), Personen und Technik aus derselben Zeit. Vorher prüft der `fakten-pruefer` jede mögliche Kombination; passt ein Hinweis auch auf eine falsche Antwort, kommt das Paar in eine Ausschlussliste.
6. **Lebensraum- und Nahrungs-Fallen über Merkmale** (Claude, 24.11.2026): Die Lebensraumtexte sind kurz und überschneiden sich („Savanne“, „Savannen und trockene offene Landschaften“, „Trockene offene Landschaften“). Darum bekommt jeder Text Merkmale und jedes Tier eine geprüfte Liste passender Merkmale. Ein Text ist als falsche Antwort nur erlaubt, wenn er kein Merkmal mit dem Tier teilt. So bleibt jede Aufgabe eindeutig, auch wenn die Fallen je Runde wechseln.
