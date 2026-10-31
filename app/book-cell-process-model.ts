// Own, explicitly invented drawing states, never measured cells or substances.
export type MembraneRoute = 'unavailable' | 'matching-protein';
export function membraneExample(route: MembraneRoute) {
  if (!['unavailable', 'matching-protein'].includes(route)) throw new TypeError('Unbekannter Transportfall.');
  return {
    route,
    crosses: route === 'matching-protein',
    statement: route === 'matching-protein'
      ? 'Für diesen gedachten Stoff ist hier ein passender Transportweg dargestellt. Das erlaubt keine Aussage über jeden anderen Stoff.'
      : 'Dieser gedachte Stoff kann im gewählten Beispiel nicht direkt durch die Lipiddoppelschicht. Ein passender Transportweg ist hier nicht dargestellt.',
  };
}
export type MitochondrialView = 'structure' | 'conversion';
export function mitochondrialExample(view: MitochondrialView) {
  if (!['structure', 'conversion'].includes(view)) throw new TypeError('Unbekannte Mitochondrienansicht.');
  return {
    view,
    showConversion: view === 'conversion',
    statement: view === 'conversion'
      ? 'Chemische Energie wird umgewandelt. Ein Teil wird für die Bildung von ATP nutzbar, ein Teil als Wärme abgegeben. Energie entsteht dabei nicht aus dem Nichts.'
      : 'Zwei Membranen und eigene DNA gehören zum vereinfachten Aufbau. Die Faltungen der inneren Membran sind schematisch; Zahlen und Größen sind nicht gemessen.',
  };
}
export const GENOME_COLLECTIONS = [
  {key: 'short', label: 'Kürzere Sammlung', nuclear: ['AT', 'CG'], mitochondrial: ['TA']},
  {key: 'long', label: 'Längere Sammlung', nuclear: ['AT', 'CG', 'AT', 'CG'], mitochondrial: ['TA']},
] as const;
export function genomeCollection(index: number) {
  if (!Number.isInteger(index) || index < 0 || index >= GENOME_COLLECTIONS.length) throw new TypeError('Unbekannte Zeichensammlung.');
  const collection = GENOME_COLLECTIONS[index];
  return {...collection, symbols: [...collection.nuclear, ...collection.mitochondrial].join('').length};
}
