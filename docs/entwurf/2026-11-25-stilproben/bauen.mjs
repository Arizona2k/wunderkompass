// Baut die Seiten der Stilproben A „Kartenwerk“, B „Sammelheft“ und C „Kompass“ (Mischung) aus echten Inhalten der App.
// Aufruf: node docs/entwurf/2026-11-25-stilproben/bauen.mjs  → a-start.html … c-spiel-falsch.html, index.html
// Symbole: lucide (ISC), Pfade in icons.json. Fotos: aus public/world, Nachweise wie in app/world-photos.json.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ICONS = JSON.parse(fs.readFileSync(path.join(DIR, 'icons.json'), 'utf8'));
const F = '../../../public/world/';

const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${Object.entries(ICONS)
  .map(([n, s]) => `<symbol id="i-${n}" viewBox="0 0 24 24">${s}</symbol>`).join('')}</svg>`;
const i = (n, cls = '') => `<svg class="ico${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#i-${n}"/></svg>`;

// Fotos mit Nachweis (Wortlaut aus app/world-photos.json)
const FOTO = {
  pinguin: {src: 'animals/emperor-penguin-640.webp', alt: 'Zwei Kaiserpinguine stehen auf einer Eisfläche in der Antarktis.', wer: 'Michael Van Woert / NOAA', lizenz: 'gemeinfrei'},
  elefant: {src: 'african-elephant.webp', alt: 'Ein Afrikanischer Savannenelefant mit Stoßzähnen steht im hohen Gras.', wer: 'Charles J. Sharp', lizenz: 'CC BY-SA 4.0'},
  panda: {src: 'giant-panda.webp', alt: 'Ein schwarz-weißer Großer Panda sitzt zwischen Felsen und hält Bambus.', wer: 'Clément Bardot', lizenz: 'CC BY-SA 4.0'},
  maathai: {src: 'people/wangari-maathai-320.webp', alt: 'Wangari Maathai mit gemusterter Kopfbedeckung hält eine Auszeichnung.', wer: 'Demosh', lizenz: 'CC BY 2.0'},
  gizeh: {src: 'giza-pyramids.webp', alt: 'Die Pyramiden von Gizeh vor blauem Himmel.', wer: 'KennyOMG', lizenz: 'CC BY-SA 4.0'},
  curie: {src: 'marie-curie.webp', alt: 'Historisches Schwarz-Weiß-Porträt von Marie Curie.', wer: 'Henri Manuel', lizenz: 'gemeinfrei'},
  bruecke: {src: 'golden-gate-bridge.webp', alt: 'Die rote Golden Gate Bridge überspannt eine Meerenge.', wer: 'Peter Craig (Carpaltnl)', lizenz: 'gemeinfrei'},
  kompass: {src: 'inventions/antique-pocket-compass-320.webp', alt: 'Ein alter, runder Kompass mit Ring zum Halten.', wer: 'Caroline Léna Becker', lizenz: 'CC BY 3.0'},
};
const img = (k, extra = '') => `<img src="${F}${FOTO[k].src}" alt="${FOTO[k].alt}"${extra}>`;
const deko = k => `<img src="${F}${FOTO[k].src}" alt="">`;
const nachweise = (...keys) => `<footer class="nachweise"><h3>Bildnachweise</h3><p>${keys
  .map(k => `${FOTO[k].alt.replace(/\.$/, '')}: ${FOTO[k].wer}, ${FOTO[k].lizenz}, Wikimedia Commons.`).join(' ')}</p><p>Stilprobe, nicht die echte Seite. Schriften: Andika, ${'$KOPF'} (SIL Open Font License).</p></footer>`;

const WELTEN = [
  {name: 'Die Tierwelt', n: 48, icon: 'paw-print', a: 'var(--w-tiere)', foto: 'panda'},
  {name: 'Zeitreise', n: 34, icon: 'hourglass', a: 'var(--w-zeit)', foto: 'gizeh'},
  {name: 'Große Köpfe', n: 36, icon: 'users', a: 'var(--w-koepfe)', foto: 'curie'},
  {name: 'Erfindungen', n: 24, icon: 'lightbulb', a: 'var(--w-erfind)', foto: 'kompass'},
  {name: 'Bauwerke', n: 16, icon: 'landmark', a: 'var(--w-bau)', foto: 'bruecke'},
  {name: 'Wissenschaft & Weltall', n: 46, icon: 'telescope', a: 'var(--w-wiss)', foto: null},
];
const NAV = [['Start', 'house'], ['Welten', 'earth'], ['Spielen', 'gamepad-2'], ['Labor', 'flask-conical'], ['Reisen', 'map'], ['Buch', 'book-open']];

// Inhalte (aus app/world-catalog.json und der Spielbank)
const K = {
  titel: 'Afrikanischer Savannen&shy;elefant',
  einstieg: 'Der Savannenelefant lebt in Afrika und ist das größte Tier an Land.',
  kurz: [['Was steckt im Rüssel?', 'Nase und Oberlippe bilden zusammen den Rüssel. Darin gibt es keine Knochen, nur Muskeln.'],
    ['Wozu die großen Ohren?', 'Seine großen, dünnen Ohren helfen ihm, sich abzukühlen.']],
  frage: 'Was kann ein Elefant mit seinem Rüssel tun?',
  antworten: ['Riechen und greifen', 'Unter Wasser atmen wie ein Fisch', 'Wie ein Vogel fliegen'],
  stimmt: 'Bei Savannenelefanten haben auch die Weibchen Stoßzähne.',
  steckbrief: [['Wie groß?', 'An der Schulter etwa 2,5 bis 4 Meter hoch.'], ['Was frisst es?', 'Gras, Blätter, Zweige, Früchte und Rinde.'],
    ['Wie alt?', 'Etwa 60 bis 70 Jahre.'], ['Tiergruppe', 'Säugetiere']],
  passt: [{foto: 'panda', name: 'Großer Panda', satz: 'Der Elefant greift Nahrung mit seinem Rüssel. Der Panda nutzt dafür einen besonderen Knochen an seinem Handgelenk.'},
    {foto: 'maathai', name: 'Wangari Maathai', satz: 'Maathai setzte sich in Kenia für Bäume ein, und dort leben auch Savannenelefanten in offenen Landschaften.'}],
};
const S = {
  frage: 'Woher kommt das Licht des Mondes?',
  // Wortlaut wie in der App: app/kern/woerter.ts und knowledge-challenge-game.tsx (Ersatztext ohne eigenen Falsch-Grund)
  nochNicht: 'Noch nicht ganz. Versuch es noch einmal!', ruhig: 'Vergleiche die Antworten in Ruhe. Ein Tipp hilft dir.',
  antworten: ['Von der Sonne', 'Aus einer Lampe im Mond', 'Von brennenden Wolken'],
  warum: 'Der Mond leuchtet nicht selbst. Er wirft das Licht der Sonne zurück.',
  karte: 'Warum verändert der Mond seine Form?',
};

function seite({stil, titel, aktiv, inhalt, marke}) {
  const kopfschrift = stil === 'b' ? 'Grandstander' : 'Bricolage Grotesque';
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titel}</title><link rel="stylesheet" href="${stil}.css"></head>
<body>${sprite}
<header class="kopf"><a class="marke" href="${stil}-start.html">${marke}WunderKompass</a>
<nav aria-label="Bereiche">${NAV.map(([w, n]) => `<a href="#"${w === aktiv ? ' aria-current="page"' : ''}>${i(n)}${w}</a>`).join('')}</nav>
<div class="rechts"><a class="rund" href="#" aria-label="Suchen">${i('search')}<span class="wort">Suchen</span></a><a class="rund" href="#" aria-label="Mein Entdeckerpass">${i('id-card')}<span class="wort">Mein Pass</span></a></div></header>
${inhalt.replace('$KOPF', kopfschrift)}
<nav class="fuss" aria-label="Bereiche">${NAV.map(([w, n]) => `<a href="#"${w === aktiv ? ' aria-current="page"' : ''}>${i(n)}${w}</a>`).join('')}</nav>
</body></html>
`;
}

// ---------- Stil A: Kartenwerk ----------
function rose({klein = false, peilung = 225} = {}) {
  let striche = '';
  for (let k = 0; k < 32; k++) {
    if (klein && k % 4) continue;
    const len = k % 8 === 0 ? 14 : k % 4 === 0 ? 9 : 5;
    const a = (k * 11.25 - 90) * Math.PI / 180, r1 = 90, r2 = 90 - len;
    striche += `<line x1="${(r1 * Math.cos(a)).toFixed(1)}" y1="${(r1 * Math.sin(a)).toFixed(1)}" x2="${(r2 * Math.cos(a)).toFixed(1)}" y2="${(r2 * Math.sin(a)).toFixed(1)}"/>`;
  }
  const buchst = klein ? '' : [['N', 0, -58], ['O', 60, 0], ['S', 0, 60], ['W', -60, 0]]
    .map(([b, x, y]) => `<text x="${x}" y="${y}" dy="0.35em" text-anchor="middle">${b}</text>`).join('');
  return `<svg class="rose" viewBox="-100 -100 200 200" style="--peilung:${peilung}deg" aria-hidden="true">
<circle r="97" style="fill:var(--flaeche);stroke:var(--tinte)" stroke-width="${klein ? 9 : 3}"/>
${klein ? '' : '<circle r="74" style="fill:none;stroke:var(--linie)" stroke-width="1.5"/>'}
<g style="stroke:var(--tinte)" stroke-width="${klein ? 9 : 2.5}" stroke-linecap="round">${striche}</g>
<g style="fill:var(--tinte);font:760 19px var(--kopf)">${buchst}</g>
<g class="nadel"><path d="M0,${klein ? -70 : -50} L${klein ? 18 : 9},0 L-${klein ? 18 : 9},0Z" style="fill:var(--nadel)"/><path d="M0,${klein ? 70 : 50} L${klein ? 18 : 9},0 L-${klein ? 18 : 9},0Z" style="fill:var(--tinte)"/><circle r="${klein ? 12 : 6}" style="fill:var(--flaeche);stroke:var(--tinte)" stroke-width="${klein ? 7 : 2.5}"/></g>
</svg>`;
}
function hoehen(n = 9, seed = 1.3) {
  let p = '';
  for (let k = 1; k <= n; k++) {
    const r0 = k * 31; let d = '';
    for (let j = 0; j <= 64; j++) {
      const a = j / 64 * 2 * Math.PI;
      const r = r0 * (1 + 0.13 * Math.sin(3 * a + seed + k * 0.35) + 0.07 * Math.sin(5 * a + seed * 2 - k * 0.3) + 0.04 * Math.sin(7 * a + k));
      d += (j ? 'L' : 'M') + (r * Math.cos(a)).toFixed(1) + ',' + (r * Math.sin(a)).toFixed(1);
    }
    p += `<path d="${d}Z"/>`;
  }
  return `<svg class="hoehen" viewBox="-300 -300 600 600" aria-hidden="true"><g style="fill:none;stroke:var(--linie)" stroke-width="1.4">${p}</g></svg>`;
}
const markeA = rose({klein: true, peilung: 30});
const feld = (w, extra = '') => `<span class="feld"${extra} style="background:${w.a}">${i(w.icon)}</span>`;

const aStart = seite({stil: 'a', titel: 'Kartenwerk: Start', aktiv: 'Start', marke: markeA, inhalt: `
<main>
<section class="buehne">${hoehen()}
  <div class="text"><h1 class="frage">Wo leben Kaiser&shy;pinguine in freier Natur?</h1>
  <div class="aktionen"><a class="knopf" href="a-karte.html">${i('compass')}Antwort suchen</a><a class="weg" href="#">Andere Frage</a></div></div>
  <figure class="foto">${img('pinguin')}<span class="pin">${i('map-pin')}Ostantarktis</span>${rose({peilung: 222})}</figure>
</section>
<div class="start-unten">
<section class="abschnitt"><h2>Deine Route</h2><ol class="route">
  <li><a href="a-karte.html"><span class="halt">${deko('elefant')}</span><span class="wegtext"><small>Zuletzt angesehen</small><b>Afrikanischer Savannenelefant</b><span class="unter">Die Tierwelt</span></span></a></li>
  <li><a href="a-spiel.html"><span class="halt jetzt">${i('gamepad-2')}</span><span class="wegtext"><small>Als Nächstes</small><b>Kreuz und quer</b><span class="unter">6 Aufgaben aus allen Welten</span></span></a></li>
  <li><a href="#"><span class="halt offen">${i('map')}</span><span class="wegtext"><small>Danach</small><b>Lebensräume voller Leben</b><span class="unter">Lernreise</span></span></a></li>
</ol></section>
<section class="abschnitt"><h2>Sechs Welten</h2><nav class="legende" aria-label="Welten">${WELTEN.map(w => `<a href="#">${feld(w)}<b>${w.name}</b><span class="zahl">${w.n} Karten</span></a>`).join('')}</nav></section>
</div>
${nachweise('pinguin', 'elefant')}
</main>`});

const aKarte = seite({stil: 'a', titel: 'Kartenwerk: Wissenskarte', aktiv: 'Welten', marke: markeA, inhalt: `
<main class="karte">
<div class="links">
  <a class="pfad" href="#">${feld(WELTEN[0])}Die Tierwelt</a>
  <figure class="foto">${img('elefant')}<span class="pin">${i('map-pin')}Nordbotswana</span></figure>
  <p class="nachweis">Foto: Charles J. Sharp, CC BY-SA 4.0, Wikimedia Commons</p>
</div>
<div class="rechts">
  <h1>${K.titel}</h1><p class="einstieg">${K.einstieg}</p>
  <div class="leiste"><button class="knopf zweit">${i('volume-2')}Vorlesen</button><button class="knopf zweit">${i('star')}Merken</button></div>
  <section class="abschnitt"><h2>Kurz erklärt</h2><div class="kurz">${K.kurz.map(([f, a], n) => `<details${n ? '' : ' open'}><summary>${f}</summary><p>${a}</p></details>`).join('')}</div></section>
  <section class="abschnitt ausschnitt"><h2>Rate mal!</h2><p class="fragezeile">${K.frage}</p><div class="antworten">${K.antworten.map(a => `<button class="antwort">${a}</button>`).join('')}</div></section>
  <section class="abschnitt"><h2>Stimmt das?</h2><p class="einstieg">${K.stimmt}</p><div class="stimmt"><button class="knopf zweit">Stimmt</button><button class="knopf zweit">Stimmt nicht</button></div></section>
  <section class="abschnitt"><h2>Steckbrief</h2><dl class="steckbrief">${K.steckbrief.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl></section>
  <section class="abschnitt"><h2>Dazu passt</h2><ul class="verbunden">${K.passt.map(p => `<li><span class="halt">${deko(p.foto)}</span><span><b>${p.name}</b><p>${p.satz}</p><a class="weg" href="#">Karte öffnen</a></span></li>`).join('')}</ul></section>
  ${nachweise('elefant', 'panda', 'maathai')}
</div>
</main>`});

const aSpiel = seite({stil: 'a', titel: 'Kartenwerk: Spiel', aktiv: 'Spielen', marke: markeA, inhalt: `
<main class="spiel">
<div class="haupt">
  <div class="spielkopf"><h1>Kreuz und quer</h1><span class="stufe">${i('compass')}Entdecker</span></div>
  <div class="fortschritt" role="img" aria-label="Aufgabe 3 von 6"><i class="da"></i><i class="da"></i><i class="jetzt"></i><i></i><i></i><i></i></div>
  <p class="zaehler">Aufgabe 3 von 6</p>
  <section class="aufgabe">
    <span class="welt-mark">${feld(WELTEN[5])}Wissenschaft &amp; Weltall</span>
    <h2>${S.frage}</h2>
    <div class="antworten"><button class="antwort richtig"><span class="marke-r">${i('check')}</span>${S.antworten[0]}</button>${S.antworten.slice(1).map(a => `<button class="antwort blass">${a}</button>`).join('')}</div>
    <div class="rueck" role="status"><b>${i('check')}Richtig!</b><p>${S.warum}</p></div>
  </section>
  <div class="weiter"><a class="knopf" href="#">Nächste Aufgabe</a><a class="weg" href="#">Spiel beenden</a></div>
</div>
<aside class="seite"><div class="ohnefoto">${hoehen(7, 2.1)}${i('telescope', 'gross')}<small>Dazu gibt es eine Wissenskarte</small><b>${S.karte}</b><a href="#">Karte öffnen</a></div></aside>
</main>`});

// ---------- Stil B: Sammelheft ----------
const markeB = `<span class="kreis">${i('compass')}</span>`;
const reiter = (w, text) => `<a class="reiter" href="#" style="--wf:${w.a}"><span class="rk">${i(w.icon)}</span>${text}</a>`;

const bStart = seite({stil: 'b', titel: 'Sammelheft: Start', aktiv: 'Start', marke: markeB, inhalt: `
<main>
<section class="buehne">
  <div><span class="gruss">${i('star')}Frage des Tages</span>
  <h1 class="frage">Wo leben Kaiser&shy;pinguine in freier Natur?</h1>
  <div class="aktionen"><a class="knopf" href="b-karte.html">${i('search')}Antwort finden</a><a class="knopf zweit" href="#">${i('rotate-ccw')}Andere Frage</a></div></div>
  <figure class="sticker" style="--dreh:-3deg">${img('pinguin')}<figcaption>${i('map-pin')}Ostantarktis</figcaption></figure>
</section>
<div class="start-unten">
<section class="abschnitt"><h2>Weiter in deinem Heft</h2>
  <a class="weiterheft" href="b-karte.html"><figure class="sticker">${deko('elefant')}</figure><span class="wegtext"><small>Zuletzt angesehen</small><b>Afrikanischer Savannenelefant</b><span class="unter">Weiter mit „Rate mal!“</span></span></a>
  <a class="weiterheft zwei" href="b-spiel.html"><span class="sticker spiel-sticker">${i('gamepad-2')}</span><span class="wegtext"><small>Als Nächstes</small><b>Kreuz und quer</b><span class="unter">6 Aufgaben aus allen Welten</span></span></a>
</section>
<section class="abschnitt"><h2>Sechs Welten</h2><nav class="welten" aria-label="Welten">${WELTEN.map((w, n) => `<a class="welt" href="#" style="--wf:${w.a};--dreh:${[-2, 1.5, -1, 2, -1.5, 1][n]}deg"><span class="punkt">${w.foto ? deko(w.foto) : i(w.icon)}</span><span class="etikett"><b>${w.name}</b><span class="zahl">${w.n} Karten</span></span></a>`).join('')}</nav></section>
</div>
${nachweise('pinguin', 'elefant', 'panda', 'gizeh', 'curie', 'kompass', 'bruecke')}
</main>`});

const bKarte = seite({stil: 'b', titel: 'Sammelheft: Wissenskarte', aktiv: 'Welten', marke: markeB, inhalt: `
<main class="karte">
<div class="links">
  ${reiter(WELTEN[0], 'Die Tierwelt')}
  <figure class="sticker" style="--dreh:-2deg">${img('elefant')}<figcaption>${i('map-pin')}Nordbotswana</figcaption></figure>
  <p class="nachweis">Foto: Charles J. Sharp, CC BY-SA 4.0, Wikimedia Commons</p>
</div>
<div class="rechts">
  <h1>${K.titel}</h1><p class="einstieg">${K.einstieg}</p>
  <div class="leiste"><button class="knopf zweit">${i('volume-2')}Vorlesen</button><button class="knopf zweit">${i('star')}Merken</button></div>
  <section class="abschnitt"><h2>Kurz erklärt</h2><div class="kurz">${K.kurz.map(([f, a], n) => `<details${n ? '' : ' open'}><summary>${f}</summary><p>${a}</p></details>`).join('')}</div></section>
  <section class="abschnitt raten"><h2>${i('lightbulb')}Rate mal!</h2><p class="fragezeile">${K.frage}</p><div class="antworten">${K.antworten.map(a => `<button class="antwort">${a}</button>`).join('')}</div></section>
  <section class="abschnitt"><h2>Stimmt das?</h2><p class="einstieg">${K.stimmt}</p><div class="stimmt"><button class="knopf">Stimmt</button><button class="knopf">Stimmt nicht</button></div></section>
  <section class="abschnitt"><h2>Steckbrief</h2><dl class="steckbrief">${K.steckbrief.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl></section>
  <section class="abschnitt"><h2>Dazu passt</h2><ul class="verbunden">${K.passt.map(p => `<li><span class="punkt">${deko(p.foto)}</span><span><b>${p.name}</b><p>${p.satz}</p><a href="#">Karte öffnen</a></span></li>`).join('')}</ul></section>
  ${nachweise('elefant', 'panda', 'maathai')}
</div>
</main>`});

const bSpiel = seite({stil: 'b', titel: 'Sammelheft: Spiel', aktiv: 'Spielen', marke: markeB, inhalt: `
<main class="spiel">
<div class="haupt">
  <div class="spielkopf"><h1>Kreuz und quer</h1><span class="stufe">Entdecker</span></div>
  <div class="fortschritt" role="img" aria-label="Aufgabe 3 von 6"><i class="da">${i('check')}</i><i class="da">${i('check')}</i><i class="jetzt"></i><i></i><i></i><i></i></div>
  <p class="zaehler">Aufgabe 3 von 6</p>
  <section class="aufgabe">
    <span class="welt-mark" style="--wf:var(--w-wiss)"><span class="rk">${i('telescope')}</span>Wissenschaft &amp; Weltall</span>
    <h2>${S.frage}</h2>
    <div class="antworten"><button class="antwort richtig"><span class="marke-r">${i('check')}</span>${S.antworten[0]}<span class="stempel" aria-hidden="true">Richtig!</span></button>${S.antworten.slice(1).map(a => `<button class="antwort blass">${a}</button>`).join('')}</div>
    <div class="rueck" role="status"><span class="unsichtbar">Richtig! </span><p>${S.warum}</p></div>
  </section>
  <div class="weiter"><a class="knopf" href="#">Nächste Aufgabe</a><a class="link" href="#">Spiel beenden</a></div>
</div>
<aside class="seite"><div class="ohnefoto"><span class="gross">${i('telescope')}</span><small>Dazu gibt es eine Wissenskarte</small><b>${S.karte}</b><a href="#">Karte öffnen</a></div></aside>
</main>`});

// ---------- Stil C: Kompass (Mischung) ----------
// Grundlage A, dazu Welt-Kacheln und Stempel aus B, Korrekturen aus Design-Prüfung und Spieltest.
function mondphasen() {
  const x = [-124, -62, 0, 62, 124], r = 22, h = 'fill:#fff';
  const sterne = [[-140, -40], [-30, -44], [90, -42], [150, 40], [-90, 44], [40, 46]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="2" style="${h};opacity:.7"/>`).join('');
  return `<svg viewBox="-160 -64 320 128" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${sterne}
<circle cx="${x[0]}" r="${r}" style="fill:none;stroke:#fff" stroke-width="2.5"/>
<path d="M${x[1]},-${r} A${r},${r} 0 0 1 ${x[1]},${r} A${r * .55},${r} 0 0 0 ${x[1]},-${r}Z" style="${h}"/><circle cx="${x[1]}" r="${r}" style="fill:none;stroke:#fff" stroke-width="1.5" opacity=".6"/>
<path d="M${x[2]},-${r} A${r},${r} 0 0 1 ${x[2]},${r}Z" style="${h}"/><circle cx="${x[2]}" r="${r}" style="fill:none;stroke:#fff" stroke-width="1.5" opacity=".6"/>
<path d="M${x[3]},-${r} A${r},${r} 0 0 1 ${x[3]},${r} A${r * .55},${r} 0 0 1 ${x[3]},-${r}Z" style="${h}"/><circle cx="${x[3]}" r="${r}" style="fill:none;stroke:#fff" stroke-width="1.5" opacity=".6"/>
<circle cx="${x[4]}" r="${r}" style="${h}"/></svg>`;
}
const welt = (w, n) => `<a class="welt${n === 0 ? ' erste' : ''}" href="#" style="--wf:${w.a}"><span class="bild">${w.foto ? deko(w.foto) : mondphasen()}</span><span class="etikett">${feld(w)}<b>${w.name}</b><span class="zahl">${w.n} Karten</span></span></a>`;

const cStart = seite({stil: 'c', titel: 'Kompass: Start', aktiv: 'Start', marke: markeA, inhalt: `
<main>
<section class="buehne">${hoehen()}
  <div class="text"><h1 class="frage">Wo leben Kaiser&shy;pinguine in freier Natur?</h1>
  <div class="aktionen"><a class="knopf" href="c-karte.html">${i('compass')}Antwort suchen</a><a class="knopf zweit" href="#">${i('rotate-ccw')}Andere Frage</a></div></div>
  <figure class="foto">${img('pinguin')}<span class="pin">${i('map-pin')}Ostantarktis</span>${rose({peilung: 222})}</figure>
</section>
<div class="start-unten">
<section class="abschnitt"><h2>Deine Route</h2>
  <div class="stand"><p><b>14</b> von 204 Karten entdeckt</p><div class="balken" role="img" aria-label="14 von 204 Karten entdeckt"><i style="width:7%"></i></div></div>
  <ol class="route">
  <li><a href="c-karte.html"><span class="halt">${deko('elefant')}</span><span class="wegtext"><small>Zuletzt angesehen</small><b>Afrikanischer Savannenelefant</b><span class="unter">Die Tierwelt</span></span></a></li>
  <li><a href="c-spiel.html"><span class="halt jetzt">${i('gamepad-2')}</span><span class="wegtext"><small>Als Nächstes</small><b>Kreuz und quer</b><span class="unter">6 Aufgaben aus allen Welten</span></span></a></li>
  <li><a href="#"><span class="halt offen">${i('map')}</span><span class="wegtext"><small>Danach</small><b>Lebensräume voller Leben</b><span class="unter">Lernreise</span></span></a></li>
</ol></section>
<section class="abschnitt"><h2>Sechs Welten</h2><nav class="welten" aria-label="Welten">${WELTEN.map(welt).join('')}</nav></section>
</div>
${nachweise('pinguin', 'elefant', 'panda', 'gizeh', 'curie', 'kompass', 'bruecke')}
</main>`});

const cKarte = seite({stil: 'c', titel: 'Kompass: Wissenskarte', aktiv: 'Welten', marke: markeA, inhalt: `
<main class="karte">
<div class="links">
  <a class="pfad" href="#">${feld(WELTEN[0])}Die Tierwelt</a>
  <figure class="foto">${img('elefant')}<span class="pin">${i('map-pin')}Nordbotswana</span></figure>
  <p class="nachweis">Foto: Charles J. Sharp, CC BY-SA 4.0, Wikimedia Commons</p>
</div>
<div class="rechts">
  <h1>${K.titel}</h1><p class="einstieg">${K.einstieg}</p>
  <div class="leiste"><button class="knopf zweit">${i('volume-2')}Vorlesen</button><button class="knopf zweit">${i('star')}Merken</button></div>
  <section class="abschnitt"><h2>Kurz erklärt</h2><div class="kurz">${K.kurz.map(([f, a], n) => `<details${n ? '' : ' open'}><summary>${f}</summary><p>${a}</p></details>`).join('')}</div></section>
  <section class="abschnitt ausschnitt"><h2>Rate mal!</h2><p class="fragezeile">${K.frage}</p><div class="antworten">${K.antworten.map(a => `<button class="antwort">${a}</button>`).join('')}</div></section>
  <section class="abschnitt"><h2>Stimmt das?</h2><p class="einstieg">${K.stimmt}</p><div class="stimmt"><button class="knopf zweit">Stimmt</button><button class="knopf zweit">Stimmt nicht</button></div></section>
  <section class="abschnitt"><h2>Steckbrief</h2><dl class="steckbrief">${K.steckbrief.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl></section>
  <section class="abschnitt"><h2>Dazu passt</h2><ul class="verbunden">${K.passt.map(p => `<li><span class="halt">${deko(p.foto)}</span><span><b>${p.name}</b><p>${p.satz}</p><a class="weg" href="#">Karte öffnen</a></span></li>`).join('')}</ul></section>
  ${nachweise('elefant', 'panda', 'maathai')}
</div>
</main>`});

function cSpielSeite({falsch}) {
  const antworten = falsch
    ? `<button class="antwort">${S.antworten[0]}</button><button class="antwort falsch"><span class="marke-f">${i('x')}</span>${S.antworten[1]}</button><button class="antwort">${S.antworten[2]}</button>`
    : `<button class="antwort richtig"><span class="marke-r">${i('check')}</span>${S.antworten[0]}</button>${S.antworten.slice(1).map(a => `<button class="antwort erledigt">${a}</button>`).join('')}`;
  const rueck = falsch
    ? `<div class="rueck lernen" role="status"><b>${S.nochNicht}</b><p>${S.ruhig}</p></div>`
    : `<div class="rueck" role="status"><b>${i('check')}Richtig!</b><p>${S.warum}</p><span class="stempel" aria-hidden="true">${i('check')}Gelöst!</span></div>`;
  const weiter = falsch
    ? `<div class="weiter"><button class="knopf zweit">${i('lightbulb')}Tipp ansehen</button><a class="weg" href="#">Spiel beenden</a></div>`
    : `<div class="weiter"><a class="knopf" href="#">Nächste Aufgabe</a><a class="weg" href="#">Spiel beenden</a></div>`;
  return seite({stil: 'c', titel: falsch ? 'Kompass: Spiel, noch nicht richtig' : 'Kompass: Spiel', aktiv: 'Spielen', marke: markeA, inhalt: `
<main class="spiel">
<div class="haupt">
  <div class="spielkopf"><h1>Kreuz und quer</h1><span class="stufe">${i('compass')}Stufe Entdecker</span></div>
  <div class="fortschritt" role="img" aria-label="Aufgabe 3 von 6"><i class="da">${i('check')}</i><i class="da">${i('check')}</i><i class="jetzt"></i><i></i><i></i><i></i></div>
  <p class="zaehler">Aufgabe 3 von 6</p>
  <section class="aufgabe">
    <span class="welt-mark">${feld(WELTEN[5])}Wissenschaft &amp; Weltall</span>
    <div class="frage-kopf"><h2>${S.frage}</h2><button class="knopf zweit" aria-label="Frage vorlesen">${i('volume-2')}<span class="wort">Vorlesen</span></button></div>
    <div class="antworten">${antworten}</div>
    ${rueck}
  </section>
  ${weiter}
</div>
<aside class="seite"><div class="ohnefoto">${hoehen(7, 2.1)}${i('telescope', 'gross')}<small>Dazu gibt es eine Wissenskarte</small><b>${S.karte}</b><a class="weg" href="#">Karte öffnen</a></div></aside>
</main>`});
}
const cSpiel = cSpielSeite({falsch: false});
const cSpielFalsch = cSpielSeite({falsch: true});

const index = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Stilproben</title>
<style>body{font:18px/1.5 system-ui;margin:24px;max-width:640px}a{display:block;padding:8px 0}</style></head><body>
<h1>Stilproben vom 25.11.2026</h1><p>Entwurf, nicht die echte Seite. Beschreibung: <a href="../2026-11-25-stilproben.md">2026-11-25-stilproben.md</a></p>
<h2>A „Kartenwerk“</h2><a href="a-start.html">Start</a><a href="a-karte.html">Wissenskarte</a><a href="a-spiel.html">Spiel</a>
<h2>B „Sammelheft“</h2><a href="b-start.html">Start</a><a href="b-karte.html">Wissenskarte</a><a href="b-spiel.html">Spiel</a>
<h2>C „Kompass“ (Mischung)</h2><a href="c-start.html">Start</a><a href="c-karte.html">Wissenskarte</a><a href="c-spiel.html">Spiel: richtig</a><a href="c-spiel-falsch.html">Spiel: noch nicht richtig</a></body></html>
`;

const out = {'a-start': aStart, 'a-karte': aKarte, 'a-spiel': aSpiel, 'b-start': bStart, 'b-karte': bKarte, 'b-spiel': bSpiel, 'c-start': cStart, 'c-karte': cKarte, 'c-spiel': cSpiel, 'c-spiel-falsch': cSpielFalsch, index};
for (const [n, html] of Object.entries(out)) fs.writeFileSync(path.join(DIR, n + '.html'), html);
console.log('gebaut:', Object.keys(out).join(', '));
