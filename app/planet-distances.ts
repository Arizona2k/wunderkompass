import source from './planet-distance-source.json' with {type:'json'};

export type PlanetDistanceId=keyof typeof source.distancesMillionKm;
/** Convert the same approximate NASA table values for both existing models.
 * The AU is an exact unit; the input distances remain rounded teaching values.
 * Do not treat these as today's distances or substitute a different epoch's fit.
 */
export const PLANET_DISTANCE_AU=Object.fromEntries(
 Object.entries(source.distancesMillionKm).map(([id,millionKm])=>[id,millionKm*1_000_000/source.astronomicalUnitKm])
) as Record<PlanetDistanceId,number>;
export const MAX_PLANET_DISTANCE_AU=Math.max(...Object.values(PLANET_DISTANCE_AU));
export const distanceNumber=(value:number)=>value.toLocaleString('de-DE',{maximumFractionDigits:3});
