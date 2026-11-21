// Die sechs Bereiche der Bereichsleiste. Ohne React, damit Node-Tests die Datei laden können.
// Die ids sind die alten Bereichsnamen und bleiben fest (Pass, Fokus-Schlüssel, Tests).

export type BereichId = 'explore' | 'world' | 'games' | 'labs' | 'journeys' | 'book';

export const BEREICHE: readonly {id: BereichId; ziel: string; wort: string}[] = [
  {id: 'explore', ziel: 'home', wort: 'Start'},
  {id: 'world', ziel: 'world', wort: 'Welten'},
  {id: 'games', ziel: 'games', wort: 'Spielen'},
  {id: 'labs', ziel: 'labs', wort: 'Labor'},
  {id: 'journeys', ziel: 'journeys', wort: 'Reisen'},
  {id: 'book', ziel: 'book', wort: 'Buch'},
];

const ZUM_START = ['home', 'globe', 'layers', 'day'];

// Welcher Bereich leuchtet in der Leiste? „Was ist neu?“ gehört zu keinem.
export function bereichFuerRoute(modus: string, route: string): BereichId | null {
  if (route === 'updates') return null;
  if (ZUM_START.includes(modus)) return 'explore';
  if (modus === 'quiz') return 'games';
  return BEREICHE.find(bereich => bereich.id === modus)?.id ?? null;
}
