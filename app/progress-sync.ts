import type { Save } from './progress-storage';

const equal = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const collections = new Set(['discoveries', 'journeys', 'games', 'missions', 'labs', 'experiments', 'favorites', 'notes', 'quizResults']);
const identity = (v: unknown) => record(v) && typeof v.id === 'string' ? v.id : JSON.stringify(v);

// Three-way merging applies changes relative to the tab's last shared baseline.
// Set removals are intentional; unrelated stale writes cannot resurrect them.
function mergeValue(base: unknown, local: unknown, remote: unknown, path: string[]): unknown {
  if (equal(local, base)) return remote;
  if (equal(remote, base) || equal(local, remote)) return local;
  if (Array.isArray(local) && Array.isArray(remote) &&
      (collections.has(path.at(-1) ?? '') || path.includes('completedChapters'))) {
    const before = new Set((Array.isArray(base) ? base : []).map(identity));
    const left = new Map(local.map(v => [identity(v), v]));
    const right = new Map(remote.map(v => [identity(v), v]));
    const result: unknown[] = [];
    for (const id of new Set([...right.keys(), ...left.keys()])) {
      if (before.has(id) && (!left.has(id) || !right.has(id))) continue;
      result.push(left.get(id) ?? right.get(id));
    }
    return result;
  }
  if (record(local) && record(remote)) {
    const previous = record(base) ? base : {};
    const result: Record<string, unknown> = {};
    for (const key of new Set([...Object.keys(previous), ...Object.keys(remote), ...Object.keys(local)])) {
      const value = mergeValue(previous[key], local[key], remote[key], [...path, key]);
      if (value !== undefined) result[key] = value;
    }
    return result;
  }
  // Round arrays are atomic: their order must never be merged as a set.
  return local;
}

export function mergeSaves(base: Save, local: Save, remote: Save): Save {
  const epoch = (s: Save) => s.epoch ?? 'legacy-v3';
  if (epoch(local) !== epoch(remote)) {
    if ((local.epochAt ?? 0) !== (remote.epochAt ?? 0)) return (local.epochAt ?? 0) > (remote.epochAt ?? 0) ? local : remote;
    return epoch(local) !== epoch(base) ? local : remote;
  }
  return { ...remote, progress: mergeValue(base.progress, local.progress, remote.progress, []) as Save['progress'],
    updatedAt: local.updatedAt > remote.updatedAt ? local.updatedAt : remote.updatedAt,
    revision: Math.max(local.revision ?? 0, remote.revision ?? 0) };
}

export function mergeDatabaseSave(base: Save, local: Save, persisted: Save): Save {
  let remote = persisted;
  // Reload can happen before the delayed database write. The synchronous journal
  // is authoritative even at the SAME revision as the older database snapshot.
  if ((remote.epoch ?? 'legacy-v3') === (base.epoch ?? 'legacy-v3') &&
      (remote.revision ?? 0) <= (base.revision ?? 0)) remote = mergeSaves(remote, base, remote);
  const result = mergeSaves(base, local, remote);
  return { ...result, revision: Math.max(result.revision ?? 0, local.revision ?? 0, remote.revision ?? 0) + 1 };
}
