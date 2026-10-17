// Frozen comparison: exact search-ranking.ts behavior from PR27 head7a86053, TypeScript types stripped. Test/measurement only.
export const foldSearch = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('de').replace(/ß/g, 'ss').replace(/[_-]+/g, ' ').trim();
function near(a, b) { if (Math.abs(a.length - b.length) > 1)
    return false; const row = Array.from({ length: b.length + 1 }, (_, i) => i); for (let i = 1; i <= a.length; i++) {
    let last = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
        const old = row[j];
        row[j] = Math.min(old + 1, row[j - 1] + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1));
        last = old;
    }
} return row[b.length] <= 1; }
export function searchScore(term, label, preview = '', keywords = '') { const q = foldSearch(term), name = foldSearch(label), aliases = foldSearch(keywords).split(/\s+/); if (!q)
    return 1; if (name === q)
    return 6; if (aliases.includes(q))
    return 5; if (name.includes(q))
    return 4; if (foldSearch(keywords).includes(q))
    return 3; if (foldSearch(preview).includes(q))
    return 2; return q.length >= 4 && [...name.split(/\s+/), ...aliases].some(w => w.length >= 4 && near(w, q)) ? 1 : 0; }
