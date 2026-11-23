// Gruppen der Vollprüfung. Der CI-Job „Vollprüfung“ (quality.yml, matrix.include) startet je Browser
// jede Gruppe als eigenen Job, alle gleichzeitig. Jeder Browser hat zusätzlich die Gruppe „rest“ mit allen
// übrigen Suiten der Vollprüfung, auch neuen: So fällt keine Suite still weg.
// Ausgleichen nach den Zeiten-Dateien der CI (Artefakt „zeiten-<browser>-<gruppe>“, zeiten-*.json).
// Die Zeiten-Datei entsteht erst am Ende eines Laufs. Bricht ein Job ab (Zeitgrenze), fehlt sie: Dann stehen
// die Dauern je Suite im Job-Log (Zeilen „PASS name 12.3 s“).
// Zahlen: Sekunden nacheinander in CI-Lauf 262 (23.11.2026), ohne Aufbau des Jobs.
export const REST = 'rest';

export const SHARDS = {
  chromium: {
    // journeys allein (2082 s). Teilen erst, wenn klar ist, welcher Teil die Zeit braucht (BACKLOG).
    reisen: ['journeys'],
    kern: ['core', 'offline-resilience', 'animals'], // 718 + 594 + 462 s
    // rest: Rauchtest, CI-Satz, engine-journeys (741 s) und die kleinen Voll-Suiten, zusammen rund 1876 s.
  },
  firefox: {
    // Lauf 262 hatte Firefox noch ganz in „rest“: 3271 s, so nah an der Zeitgrenze wie keine andere Gruppe.
    'offline-tiere': ['offline-resilience', 'animals'], // 1080 + 526 s
    // rest: engine-journeys (1177 s) und alle übrigen Suiten, zusammen rund 1666 s.
  },
  webkit: {
    'offline-tiere': ['offline-resilience', 'animals'], // 969 + 458 s
    // rest: engine-journeys (899 s) und alle übrigen Suiten, zusammen rund 1307 s.
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
