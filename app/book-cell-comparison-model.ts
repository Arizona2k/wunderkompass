export type CellExample = 'nucleated-human' | 'bacterium' | 'mature-human-red-cell';

// Named examples, not a classifier inferred from the presence of one symbol.
// The specialized red cell belongs to a eukaryotic human even without a nucleus.
export const CELL_EXAMPLES = {
  'nucleated-human': {
    label: 'Typische menschliche Zelle',
    title: 'Ein Beispiel mit Zellkern',
    organismGroup: 'Eukaryot',
    nucleus: true,
    mitochondria: true,
    dna: true,
    dnaPlaces: ['Zellkern', 'Mitochondrium'],
    explanation: 'Dieses Beispiel zeigt eine menschliche Zelle mit Kern und Mitochondrien. Beide Bereiche enthalten DNA. Es ist kein Bauplan für jede menschliche Zelle.',
  },
  bacterium: {
    label: 'Bakterium',
    title: 'DNA ohne Kernhülle',
    organismGroup: 'Prokaryot',
    nucleus: false,
    mitochondria: false,
    dna: true,
    dnaPlaces: ['Zellinneres ohne membranumhüllten Zellkern'],
    explanation: 'Das Bakterium besitzt DNA, aber keinen membranumhüllten Zellkern. Ein fehlender Kern bedeutet hier keine fehlende Erbinformation.',
  },
  'mature-human-red-cell': {
    label: 'Reife rote Blutzelle',
    title: 'Eine spezialisierte Ausnahme',
    organismGroup: 'Eukaryot',
    nucleus: false,
    mitochondria: false,
    dna: false,
    dnaPlaces: [],
    explanation: 'Dieses Beispiel meint ein normales reifes menschliches rotes Blutkörperchen ohne Zellkern und Mitochondrien. Der Mensch gehört trotzdem zu den Eukaryoten. Das Schema ist kein medizinischer Test.',
  },
} as const;

export function cellExample(kind: CellExample) {
  if (!Object.hasOwn(CELL_EXAMPLES, kind)) throw new TypeError('Unbekanntes Zellenbeispiel.');
  return CELL_EXAMPLES[kind];
}
