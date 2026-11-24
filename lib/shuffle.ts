// Mischt eine Liste (Fisher-Yates) und lässt das Original unverändert.
// `zufall` nur für feste Abläufe in Tests; die Seite nimmt Math.random.
export const shuffle = <T,>(a: readonly T[], zufall: () => number = Math.random) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
