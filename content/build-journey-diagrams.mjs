// Reproducible learning diagrams. Maps use the existing Natural Earth geometry;
// cross sections show scientific relationships rather than decorative artwork.
import fs from 'node:fs/promises';
import { geoArea, geoEqualEarth, geoGraticule10, geoPath } from 'd3-geo';

const root = new URL('../', import.meta.url);
const folder = new URL('public/journeys/', root);
await fs.mkdir(folder, { recursive: true });
const world = JSON.parse(await fs.readFile(new URL('public/world.json', root), 'utf8'));
function ring(points) {
  const result = [points[0]];
  let previous = points[0];
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    if ((p[0] - previous[0]) ** 2 + (p[1] - previous[1]) ** 2 >= .25 ** 2) {
      result.push(p); previous = p;
    }
  }
  result.push(points.at(-1));
  if (result.length < 4) return points;
  const originalArea = geoArea({ type: 'Polygon', coordinates: [points] });
  const simplifiedArea = geoArea({ type: 'Polygon', coordinates: [result] });
  return (originalArea > 2 * Math.PI) !== (simplifiedArea > 2 * Math.PI) ? points : result;
}
const countries = world.features.map(f => {
  const simplified = f.geometry.type === 'Polygon'
    ? { ...f.geometry, coordinates: f.geometry.coordinates.map(ring) }
    : { ...f.geometry, coordinates: f.geometry.coordinates.map(p => p.map(ring)) };
  // Tiny islands can collapse into collinear rings. Spherical projections then
  // treat their reverse winding as the whole world: keep the original instead.
  const geometry = geoArea(simplified) > 2 * Math.PI ? f.geometry : simplified;
  return { ...f, geometry };
});
const projection = geoEqualEarth().fitExtent([[34, 32], [766, 365]], { type: 'Sphere' });
const path = geoPath(projection).digits(1);
const land = (fill = '#8bb9a7', boundaries = false) => countries.map(f => `<path d="${path(f)}" fill="${fill}"${boundaries ? ' stroke="#ffffff" stroke-width="1"' : ''}/>`).join('');
const text = (x, y, value, size = 28, fill = '#244653', anchor = 'start') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}">${value}</text>`;
const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450"><rect width="800" height="450" fill="#edf6f6"/><g font-family="system-ui, sans-serif">${body}</g></svg>`;
const save = (name, body) => fs.writeFile(new URL(name + '.svg', folder), svg(body));

// Unlabelled context for article/nature location markers. Keep the seven
// continent labels in the learning-journey image itself unchanged.
await fs.mkdir(new URL('public/maps/', root), { recursive: true });
const contextProjection = geoEqualEarth().fitExtent([[48, 48], [752, 370]], { type: 'Sphere' });
const contextPath = geoPath(contextProjection).digits(1);
const contextLand = countries.map(f => `<path d="${contextPath(f)}" fill="#8bb9a7"/>`).join('');
await fs.writeFile(new URL('public/maps/world-context.svg', root), svg(`<path d="${contextPath({ type: 'Sphere' })}" fill="#d7eaf2"/>` + contextLand));
if (process.argv.includes('--context-map-only')) process.exit(0);

await save('inside', `<g transform="translate(235 213)"><circle r="169" fill="#3fb5a0"/><circle r="159" fill="#ed8241"/><circle r="92" fill="#f4bc43"/><circle r="32" fill="#fff1a2"/></g>` +
  ['Erdkruste', 'Erdmantel', 'Äußerer Kern', 'Innerer Kern'].map((name, i) => `<circle cx="456" cy="${112 + i * 62}" r="10" fill="${['#3fb5a0', '#ed8241', '#f4bc43', '#fff1a2'][i]}" stroke="#244653" stroke-width="1"/>` + text(478, 122 + i * 62, name, 28)).join('') + text(400, 422, 'Querschnitt · Kruste vergrößert', 24, '#476675', 'middle'));

const continents = [
  [-105, 43], [-59, -19], [20, 51], [20, 4], [88, 42], [135, -25], [0, -77],
];
await save('continents', `<path d="${path({ type: 'Sphere' })}" fill="#d7eaf2"/>` + land() + continents.map((point, i) => {
  const [x, y] = projection(point);
  return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="19" fill="#244653" stroke="white" stroke-width="3"/>` + text(x.toFixed(1), (y + 8).toFixed(1), i + 1, 25, 'white', 'middle');
}).join('') + text(400, 417, 'Sieben Kontinente · eine Erde', 29, '#244653', 'middle'));

const africa = countries.filter(f => f.properties.continent === 'Africa');
const africaProjection = geoEqualEarth().fitExtent([[50, 32], [453, 415]], { type: 'FeatureCollection', features: africa });
const africaPath = geoPath(africaProjection).digits(1);
const kenya = africa.find(f => f.properties.iso === 'KE');
const [kx, ky] = africaProjection([kenya.properties.lon, kenya.properties.lat]);
await save('countries', `<rect x="20" y="20" width="760" height="410" rx="22" fill="#e2f0f5"/>` + africa.map(f => `<path d="${africaPath(f)}" fill="${f.properties.iso === 'KE' ? '#d77439' : '#93c5ae'}" stroke="#fff" stroke-width="1.3"/>`).join('') +
  `<path d="M${kx.toFixed(1)} ${ky.toFixed(1)}H493" stroke="#a94c22" stroke-width="3"/><circle cx="${kx.toFixed(1)}" cy="${ky.toFixed(1)}" r="6" fill="#a94c22"/>` + text(504, ky + 10, 'Kenia', 35, '#a94c22') + text(504, ky + 51, 'ein Land in Afrika', 24) + text(585, 98, 'Afrika', 34, '#244653', 'middle') + text(585, 136, 'ein Kontinent', 24, '#476675', 'middle'));

const equator = { type: 'LineString', coordinates: Array.from({ length: 73 }, (_, i) => [-180 + i * 5, 0]) };
await save('navigation', `<path d="${path({ type: 'Sphere' })}" fill="#d7eaf2"/>` + land() + `<path d="${path(geoGraticule10())}" fill="none" stroke="#496d7a" stroke-width=".9" opacity=".5"/><path d="${path(equator)}" fill="none" stroke="#a94c22" stroke-width="5"/>` + text(400, 417, 'Äquator · 0° Breite', 30, '#a94c22', 'middle'));

// A schematic of broad latitude belts, not a map of local climate types.
const climateFill = `<defs><clipPath id="sphere"><path d="${path({ type: 'Sphere' })}"/></clipPath></defs><g clip-path="url(#sphere)">` +
  [[90, 66.6, '#dbeaf2'], [66.6, 23.4, '#9cc8ad'], [23.4, -23.4, '#efc979'], [-23.4, -66.6, '#9cc8ad'], [-66.6, -90, '#dbeaf2']].map(([north, south, color]) => {
    const top = projection([0, north])[1], bottom = projection([0, south])[1];
    return `<rect x="0" y="${top.toFixed(1)}" width="800" height="${(bottom - top).toFixed(1)}" fill="${color}"/>`;
  }).join('') + '</g>';
await save('climate', climateFill + countries.map(f => `<path d="${path(f)}" fill="none" stroke="#244653" stroke-width="1" opacity=".65"/>`).join('') + `<path d="${path(equator)}" fill="none" stroke="#a94c22" stroke-width="2.5" stroke-dasharray="9 6"/>` + text(400, 417, 'Klimagürtel · stark vereinfacht', 27, '#244653', 'middle'));

// Fault slip and wave propagation: positions and distances are schematic.
await save('quakes', `<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#244653"/></marker><clipPath id="ground"><rect x="40" y="128" width="720" height="240" rx="10"/></clipPath></defs><rect x="40" y="128" width="720" height="240" rx="10" fill="#dfc5a2"/><path d="M40 128H760" stroke="#7da38c" stroke-width="14"/><g clip-path="url(#ground)"><path d="M382 115L448 383" stroke="#a94c22" stroke-width="5"/>` + [44, 90, 139].map(r => `<circle cx="415" cy="258" r="${r}" fill="none" stroke="#a94c22" stroke-width="3" opacity=".6"/>`).join('') + `</g><circle cx="415" cy="258" r="11" fill="#a94c22"/><path d="M318 282L299 203" stroke="#244653" stroke-width="7" marker-end="url(#arrow)"/><path d="M515 204L534 283" stroke="#244653" stroke-width="7" marker-end="url(#arrow)"/>` + text(400, 70, 'Gestein rutscht an einer Bruchfläche', 28, '#244653', 'middle') + text(400, 420, 'Die Erschütterung breitet sich als Wellen aus.', 25, '#244653', 'middle'));

console.log('Six journey diagrams generated from existing map data and scientific schematics.');
