// Gruppen der Vollprüfung. Der CI-Job „Vollprüfung“ (quality.yml, matrix.include) startet je Browser
// jede Gruppe als eigenen Job, alle gleichzeitig. Jeder Browser hat zusätzlich die Gruppe „rest“ mit allen
// übrigen Suiten der Vollprüfung, auch neuen: So fällt keine Suite still weg.
// Ausgleichen nach den Zeiten-Dateien der CI (Artefakt „zeiten-<browser>-<gruppe>“, zeiten-*.json).
// Die Zeiten-Datei entsteht erst am Ende eines Laufs. Bricht ein Job ab (Zeitgrenze), fehlt sie: Dann stehen
// die Dauern je Suite im Job-Log (Zeilen „PASS name 12.3 s“).
// Zahlen in Klammern: Sekunden nacheinander in CI-Lauf 252 (21.11.2026), ohne Aufbau des Jobs.
export const REST = 'rest';

export const SHARDS = {
  chromium: {
    // journeys allein (2078 s). Teilen erst, wenn klar ist, welcher Teil die Zeit braucht (BACKLOG).
    reisen: ['journeys'],
    kern: ['core', 'offline-resilience', 'animals'], // 821 + 738 + 484 s
    // rest: Rauchtest, CI-Satz, engine-journeys (855 s) und die kleinen Voll-Suiten, zusammen rund 1980 s.
  },
  // Firefox ganz in „rest“ (2263 s).
  firefox: {},
  webkit: {
    // Zusammen mit rest 3040 s; die Aufteilung zeigt erst die nächste Zeiten-Datei.
    'offline-tiere': ['offline-resilience', 'animals'],
  },
};

// Alle Gruppen eines Browsers, „rest“ zuletzt.
export function shardsOf(engine) {
  return [...Object.keys(SHARDS[engine] ?? {}), REST];
}

// Die Suiten einer Gruppe aus `suites` (schon nach Stufe gewählt), Reihenfolge wie in `suites`.
export function suitesInShard(engine, shard, suites) {
  const groups = SHARDS[engine] ?? {};
  if (shard === REST) {
    const named = Object.values(groups).flat();
    return suites.filter(suite => !named.includes(suite.name));
  }
  return suites.filter(suite => groups[shard].includes(suite.name));
}
