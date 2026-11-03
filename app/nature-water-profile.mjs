/** @param {readonly {x:number,y:number}[]} profile @param {number} waterY @returns {{x:number,y:number}[][]} */
export function waterOverProfile(profile, waterY) {
  if (!Number.isFinite(waterY) || profile.length < 2 || profile.some((p, n) => !Number.isFinite(p.x) || !Number.isFinite(p.y) || (n > 0 && p.x <= profile[n - 1].x))) throw new RangeError('Invalid bed profile or water level');
  const segments = []; let active = [];
  for (let n = 0; n < profile.length - 1; n++) {
    const a = profile[n], b = profile[n + 1], aWet = a.y > waterY, bWet = b.y > waterY;
    if (!aWet && !bWet) continue;
    const crossing = () => ({x: a.x + (waterY - a.y) * (b.x - a.x) / (b.y - a.y), y: waterY});
    if (!active.length) active.push(aWet ? {...a} : crossing());
    active.push(bWet ? {...b} : crossing());
    if (!bWet) {segments.push(active); active = [];}
  }
  if (active.length) segments.push(active);
  return segments.map(ps => [{x: ps[0].x, y: waterY}, ...ps, {x: ps[ps.length - 1].x, y: waterY}]);
}
