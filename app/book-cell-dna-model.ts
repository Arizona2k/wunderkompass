// An original four-letter teaching example, not real genetic data or a genome.
// Pairing and sequence meaning were counterread against NHGRI on2026-10-30.
export const DNA_BASES = ['A', 'T', 'C', 'G'] as const;
export type DNABase = typeof DNA_BASES[number];
const PARTNER: Record<DNABase, DNABase> = {A: 'T', T: 'A', C: 'G', G: 'C'};

export function inspectDNASequence(sequence: string) {
  if (!sequence || !/^[ATCG]+$/.test(sequence)) {
    throw new TypeError('Das Zeichenmodell benötigt eine nicht leere Folge aus A, T, C und G.');
  }
  const bases = [...sequence] as DNABase[];
  const counts: Record<DNABase, number> = {A: 0, T: 0, C: 0, G: 0};
  for (const base of bases) counts[base] += 1;
  return {
    sequence,
    bases,
    counts,
    partner: bases.map(base => PARTNER[base]).join(''),
    length: bases.length,
  };
}

export function compareDNASequences(first: string, second: string) {
  const a = inspectDNASequence(first), b = inspectDNASequence(second);
  return {
    first: a,
    second: b,
    sameLength: a.length === b.length,
    sameCounts: DNA_BASES.every(base => a.counts[base] === b.counts[base]),
    sameOrder: a.sequence === b.sequence,
    differentPositions: Array.from({length: Math.max(a.length, b.length)}, (_, i) => i)
      .filter(i => a.bases[i] !== b.bases[i]),
  };
}
