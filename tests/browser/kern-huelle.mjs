// Neuer Kern: Grundlage (Schrift, Farben, Fokus) und Hülle (Kopf, Leiste, Fuß).
// Die Grundlage läuft schmal mit Touch (320 × 568) und breit (1440 × 900),
// die Hülle bei 320 und 390 px mit Touch sowie bei 768 und 1440 px.
import assert from 'node:assert/strict';
import {withPage, ready, ladeanfragen, klickNachRuhe} from './harness.mjs';
import {homeContrast} from './discovery-central.mjs';
import {BEREICHE} from '../../app/kern/bereiche.ts';
import {createSave, SAVE_KEY} from '../../app/progress-storage.ts';
import {NEUIGKEITEN, aufteilen, datumLesbar} from '../../app/kern/neuigkeiten.ts';
import {HOME_MOTIFS} from '../../app/discovery-selection.ts';
import {navigationsTempo} from '../../scripts/navigation-tempo.mjs';
import {prepareAxe} from './axe-loader.mjs';

const SCHMAL = {width: 320, height: 568, touch: true};
const BREIT = {width: 1440, height: 900};
const ANSICHTEN = [SCHMAL, {width: 390, height: 844, touch: true}, {width: 768, height: 1024}, BREIT];
const LEISTE = 'nav[aria-label="Bereiche"]';
const WARTEN = {timeout: 5000};

const leisteVon = page => page.getByRole('navigation', {name: 'Bereiche', exact: true});
const tippe = (ziel, touch) => (touch ? ziel.tap() : ziel.click());

export async function kernHuelle(ctx) {
  for (const view of ANSICHTEN) {
    const width = view.width;
    await withPage(ctx, view, async page => {
      await leiste(page, width);
      await kopfOhneZaehler(page, width);
      await fuss(page, width);
      await hilfeAufStart(page, width);
      if (width < 768) await leisteVerdecktNichts(page, width);
      if (width === 320) await dialogUeberLeiste(page);
      await updatesOhneMarkierung(page, width);
      await buchLeisteBleibtRuhig(page, width);
    });
    await withPage(ctx, view, page => leisteNavigiert(page, view));
    await withPage(ctx, view, page => zurueckNachLeiste(page, view, ctx.engine));
    if (width < 768) await withPage(ctx, view, page => zurueckOhneFokus(page, view));
    ctx.report.checks.push(`Hülle ${width}: sechs Bereiche lesbar und erreichbar, Kopf ohne Zähler, Fuß, Zurück stellt die Lesestelle her, Buchleiste springt nach Zurück nicht um`
      + (width < 768 ? ', auch nach einem Tipp ohne Fokus wie in Safari, Leiste verdeckt nichts' : '') + (width === 320 ? ', Dialoge liegen über der Leiste' : ''));
  }
  await withPage(ctx, {width: 390, height: 844, touch: true}, page => buchLeisteDrehen(page));
  if (ctx.engine === 'chromium') {
    await buchLeisteZiehen(ctx);
    ctx.report.checks.push('Buch am Rechner mit sichtbaren Scrollbalken (Chromium): Fenster von 900 auf 300 px und zurück gezogen, Bereichsleiste wechselt ohne ResizeObserver-Schleife');
  }
  ctx.report.checks.push('Buch am Handy gedreht (390 ↔ 844 px): Bereichsleiste wechselt ohne ResizeObserver-Schleife, Pfeile passen zur Leiste, gewählter Bereich (auch „Kleiner Atlas“) bleibt ganz sichtbar');
  await grosseSchrift320(ctx);
  ctx.report.checks.push('Hülle 320 mit größerer Schrift: Leiste lesbar, Beispieltexte passen, Suchfeld ganz sichtbar, Pass unverändert');
  for (const view of [SCHMAL, BREIT]) {
    await withPage(ctx, view, async page => {
      const width = view.width;
      await grundlage(page, width);
      await ruhigerFokus(page, width);
      await suchfeldRahmen(page, width);
      if (width === 320) await platzhalterPassen(page, '320');
      ctx.report.checks.push(`Kern ${width}: Schrift Nunito, Grundfarbe, ruhiger Fokus auf Überschriften, Suchfeld-Rahmen frei`
        + (width === 320 ? ', Beispieltexte passen in die Felder' : ''));
    });
    await withPage(ctx, view, async page => {
      await neuigkeiten(page, view.width);
      ctx.report.checks.push(`Was ist neu? ${view.width}: Titel ruhig fokussiert, neueste Einträge oben, „Früher“ eingeklappt, axe ohne Verstöße`);
    });
  }
  await withPage(ctx, BREIT, async page => {
    await tastaturFokus(page);
    ctx.report.checks.push('Kern 1440: sichtbarer Tastaturfokus in Petrol');
  });
}

// Die Seite nutzt Nunito, 18 px und den warmen Grundton.
async function grundlage(page, width) {
  const info = await page.evaluate(async () => {
    await document.fonts.ready;
    const style = getComputedStyle(document.body);
    return {
      nunito: [...document.fonts].some(face => face.family.replace(/["']/g, '') === 'Nunito Variable' && face.status === 'loaded'),
      fontSize: style.fontSize,
      background: style.backgroundColor,
      fontFamily: style.fontFamily,
    };
  });
  assert.ok(info.nunito, `grundlage ${width}: Schrift „Nunito Variable“ ist nicht geladen`);
  assert.equal(info.fontSize, '18px', `grundlage ${width}: Fließtext`);
  assert.equal(info.background, 'rgb(250, 248, 243)', `grundlage ${width}: Seitenhintergrund`);
  assert.match(info.fontFamily, /^"?Nunito Variable"?/, `grundlage ${width}: Schriftliste`);
  // Namen wie „Białowieża“ oder „Chișinău“ bleiben in einer Schrift: Nunito bringt den erweiterten lateinischen Satz mit.
  // („ō“ in „Hōryū-ji“ setzt schon der Grundsatz aus „o“ und Strich zusammen; „ł“, „ż“, „ș“ gehen nicht so.)
  const erweitert = await page.evaluate(async () => {
    const probe = document.createElement('p');
    probe.textContent = 'Wald von Białowieża, Chișinău';
    document.querySelector('main')?.append(probe);
    probe.getBoundingClientRect();
    await document.fonts.ready;
    const geladen = [...document.fonts].some(face => face.family.replace(/["']/g, '') === 'Nunito Variable' && /U\+0*100\b/i.test(face.unicodeRange) && face.status === 'loaded');
    probe.remove();
    return geladen;
  });
  assert.ok(erweitert, `grundlage ${width}: „Białowieża“ nutzt nicht die Nunito mit erweiterten Buchstaben`);
}

// Springt das Programm auf eine Überschrift, zeigt sie keinen Rahmen –
// auch wenn der Link per Tastatur geöffnet wurde (dann gilt sonst :focus-visible).
async function ruhigerFokus(page, width) {
  const link = page.getByRole('contentinfo').getByRole('link', {name: 'Was ist neu?', exact: true});
  await link.focus();
  await page.keyboard.press('Enter');
  const title = page.locator('#updates-title');
  await title.waitFor();
  await page.waitForFunction(() => document.activeElement?.id === 'updates-title', null, {polling: 100});
  const outline = await title.evaluate(el => getComputedStyle(el).outlineStyle);
  assert.equal(outline, 'none', `ruhigerFokus ${width}: Überschrift zeigt einen Fokusrahmen`);
  // Kopf des Spielplatzes: Sprungziel nach „Alle Spiele“, auch nach Tastaturbedienung ohne Rahmen.
  await page.evaluate(() => { location.hash = 'games'; });
  const kopf = page.locator('#playground-title');
  await kopf.waitFor();
  await page.keyboard.press('Tab');
  await kopf.evaluate(el => el.focus());
  const kopfRahmen = await kopf.evaluate(el => ({fokus: el === document.activeElement, rahmen: getComputedStyle(el).outlineStyle}));
  assert.deepEqual(kopfRahmen, {fokus: true, rahmen: 'none'}, `ruhigerFokus ${width}: Kopf des Spielplatzes zeigt einen Fokusrahmen`);
}

// Wer mit der Tastatur arbeitet, sieht einen deutlichen Rahmen.
async function tastaturFokus(page) {
  const brand = page.getByRole('link', {name: 'WunderKompass – Startseite', exact: true});
  let found = false;
  for (let i = 0; i < 3 && !found; i += 1) {
    await page.keyboard.press('Tab');
    found = await brand.evaluate(el => el === document.activeElement);
  }
  assert.ok(found, 'tastaturFokus: Markenlink nach drei Tab-Drücken nicht erreicht');
  const ring = await brand.evaluate(el => {
    const style = getComputedStyle(el);
    return {style: style.outlineStyle, width: parseFloat(style.outlineWidth), color: style.outlineColor};
  });
  assert.equal(ring.style, 'solid', 'tastaturFokus: Rahmenart');
  assert.ok(ring.width >= 2, `tastaturFokus: Rahmen zu dünn (${ring.width} px)`);
  assert.equal(ring.color, 'rgb(14, 110, 114)', 'tastaturFokus: Rahmenfarbe');
}

// Eine Leiste mit sechs Wörtern: groß genug, nicht abgeschnitten, gut lesbar, am richtigen Platz.
async function leiste(page, width, name = String(width)) {
  const nav = leisteVon(page);
  assert.equal(await nav.count(), 1, `leiste ${name}: genau eine Leiste „Bereiche“`);
  const daten = await nav.evaluate(el => {
    const box = el.getBoundingClientRect();
    return {
      oben: box.top,
      unten: box.bottom,
      mainOben: document.getElementById('learning-main').getBoundingClientRect().top,
      fensterHoehe: innerHeight,
      // clientWidth statt innerWidth: Chromium im Handy-Modus vergrößert innerWidth mit dem Überlauf.
      ueberlauf: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      links: [...el.querySelectorAll('a')].map(a => {
        const link = a.getBoundingClientRect(), span = a.querySelector('span');
        const wort = span ? span.getBoundingClientRect() : {width: Infinity, left: -Infinity, right: Infinity};
        return {
          wort: a.textContent.trim(),
          breite: link.width,
          hoehe: link.height,
          innen: a.clientWidth,
          wortScroll: span ? span.scrollWidth : Infinity,
          passt: wort.width <= a.clientWidth + 0.5 && wort.left >= link.left - 0.5 && wort.right <= link.right + 0.5,
          schrift: span ? parseFloat(getComputedStyle(span).fontSize) : 0,
        };
      }),
    };
  });
  assert.deepEqual(daten.links.map(link => link.wort), BEREICHE.map(b => b.wort), `leiste ${name}: Wörter und Reihenfolge`);
  for (const link of daten.links) {
    assert.ok(link.breite >= 48 && link.hoehe >= 48, `leiste ${name}: „${link.wort}“ ist kleiner als 48 × 48 px (${link.breite} × ${link.hoehe})`);
    assert.ok(link.wortScroll <= link.innen && link.passt, `leiste ${name}: „${link.wort}“ ist abgeschnitten`);
    assert.ok(link.schrift >= 14, `leiste ${name}: „${link.wort}“ hat nur ${link.schrift} px Schrift`);
  }
  assert.ok(daten.ueberlauf <= 0, `leiste ${name}: Seite läuft ${daten.ueberlauf} px waagerecht über`);
  assert.equal(await nav.locator('[aria-current="page"]').count(), 1, `leiste ${name}: genau ein aktiver Bereich`);
  for (const link of await nav.getByRole('link').all()) await homeContrast(link);
  if (width < 768) {
    assert.ok(Math.abs(daten.unten - daten.fensterHoehe) <= 1, `leiste ${name}: Leiste liegt nicht unten (${daten.unten} von ${daten.fensterHoehe})`);
  } else {
    assert.ok(daten.unten <= daten.mainOben + 0.5, `leiste ${name}: Leiste liegt nicht über dem Inhalt`);
  }
}

// Jeder Bereich öffnet sich, und genau sein Wort ist markiert. Start kommt zuletzt,
// weil die frische Seite schon auf dem Start steht.
async function leisteNavigiert(page, {width, touch}) {
  const nav = leisteVon(page);
  for (const {id, ziel, wort} of [...BEREICHE.slice(1), BEREICHE[0]]) {
    await tippe(nav.getByRole('link', {name: wort, exact: true}), touch);
    await page.waitForFunction(hash => location.hash === '#' + hash, ziel, WARTEN).catch(() => {});
    assert.equal(new URL(page.url()).hash, '#' + ziel, `leisteNavigiert ${width}: „${wort}“ führt nicht nach #${ziel}`);
    await page.waitForFunction(([auswahl, gesucht]) => {
      const aktiv = [...document.querySelectorAll(auswahl + ' [aria-current]')];
      return aktiv.length === 1 && aktiv[0].textContent.trim() === gesucht;
    }, [LEISTE, wort], WARTEN).catch(() => {});
    const aktiv = await nav.locator('[aria-current]').evaluateAll(els => els.map(el => [el.textContent.trim(), el.getAttribute('aria-current')]));
    assert.deepEqual(aktiv, [[wort, 'page']], `leisteNavigiert ${width}: Markierung nach „${wort}“`);
    if (id === 'world') {
      await page.waitForFunction(() => document.activeElement?.id === 'world-category-title', null, WARTEN).catch(() => {});
      const fokus = await page.evaluate(() => ({id: document.activeElement?.id, rahmen: getComputedStyle(document.activeElement).outlineStyle}));
      assert.deepEqual(fokus, {id: 'world-category-title', rahmen: 'none'}, `leisteNavigiert ${width}: Fokus nach „Welten“`);
    }
  }
}

// Der Kopf zeigt keine Zahlen und keinen Hilfe-Knopf; die Suche öffnet sich.
async function kopfOhneZaehler(page, width) {
  const pass = page.getByRole('button', {name: 'Entdeckerpass öffnen', exact: true});
  assert.doesNotMatch(await pass.innerText(), /\d/, `kopfOhneZaehler ${width}: Pass-Knopf zeigt einen Zähler`);
  assert.equal(await page.getByRole('button', {name: 'Hilfe öffnen', exact: true}).count(), 0, `kopfOhneZaehler ${width}: Kopf hat noch einen Hilfe-Knopf`);
  await page.getByRole('button', {name: 'Lernwelt durchsuchen', exact: true}).click();
  const suche = page.getByRole('dialog', {name: 'Lernwelt durchsuchen', exact: true});
  await suche.waitFor();
  await page.keyboard.press('Escape');
  await suche.waitFor({state: 'hidden'});
}

// Der Fuß ist ein echter Seitenfuß mit „Was ist neu?“ und „Für Eltern“.
async function fuss(page, width) {
  const fussZeile = page.getByRole('contentinfo');
  assert.equal(await fussZeile.count(), 1, `fuss ${width}: genau ein Seitenfuß`);
  const neu = fussZeile.getByRole('link', {name: 'Was ist neu?', exact: true});
  assert.equal(await neu.count(), 1, `fuss ${width}: Link „Was ist neu?“ fehlt`);
  assert.equal(await neu.getAttribute('aria-current'), null, `fuss ${width}: „Was ist neu?“ ist außerhalb der Seite als aktuell markiert`);
  const eltern = fussZeile.getByRole('button', {name: 'Für Eltern', exact: true});
  assert.equal(await eltern.count(), 1, `fuss ${width}: Knopf „Für Eltern“ fehlt`);
  // Erst klicken, wenn die Startseite fertig geladen hat (warum: siehe neuigkeiten).
  await klickNachRuhe(eltern);
  const dialog = page.locator('.parent-guide');
  await dialog.waitFor();
  await page.keyboard.press('Escape');
  await dialog.waitFor({state: 'hidden'});
}

// Auf dem Handy liegt die Leiste fest unten. Sie darf das Seitenende und den
// zurückgegebenen Fokus nicht verdecken.
async function leisteVerdecktNichts(page, width) {
  await page.evaluate(() => scrollTo({top: document.documentElement.scrollHeight, behavior: 'instant'}));
  await page.waitForFunction(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (Math.abs(scrollY - max) > 1) scrollTo({top: max, behavior: 'instant'});
    return Math.abs(scrollY - max) <= 1;
  }, null, WARTEN).catch(() => {});
  const fussZeile = page.getByRole('contentinfo');
  const ende = await fussZeile.evaluate((el, auswahl) => {
    const teile = [...el.querySelectorAll('*')].filter(teil => {
      const box = teil.getBoundingClientRect();
      return box.width > 0 && box.height > 0 && getComputedStyle(teil).visibility !== 'hidden';
    });
    return {unten: Math.max(...teile.map(teil => teil.getBoundingClientRect().bottom)), leisteOben: document.querySelector(auswahl).getBoundingClientRect().top};
  }, LEISTE);
  assert.ok(ende.unten <= ende.leisteOben + 0.5, `leisteVerdecktNichts ${width}: Fußende (${ende.unten}) liegt unter der Leiste (${ende.leisteOben})`);

  const eltern = fussZeile.getByRole('button', {name: 'Für Eltern', exact: true});
  await eltern.focus();
  await page.keyboard.press('Enter');
  const dialog = page.locator('.parent-guide');
  await dialog.waitFor();
  await page.keyboard.press('Escape');
  await dialog.waitFor({state: 'hidden'});
  await page.waitForFunction(() => document.activeElement?.textContent?.trim() === 'Für Eltern', null, WARTEN).catch(() => {});
  const lage = await eltern.evaluate((el, auswahl) => ({
    fokus: el === document.activeElement,
    unten: el.getBoundingClientRect().bottom,
    leisteOben: document.querySelector(auswahl).getBoundingClientRect().top,
  }), LEISTE);
  assert.ok(lage.fokus, `leisteVerdecktNichts ${width}: „Für Eltern“ hat nach dem Schließen keinen Fokus`);
  assert.ok(lage.unten <= lage.leisteOben + 0.5, `leisteVerdecktNichts ${width}: „Für Eltern“ (${lage.unten}) liegt unter der Leiste (${lage.leisteOben})`);
}

// Suche, Pass und Eltern-Dialog liegen auf dem Handy über der Leiste.
async function dialogUeberLeiste(page) {
  const dialoge = [
    ['Suche', page.getByRole('button', {name: 'Lernwelt durchsuchen', exact: true}), '.search-dialog'],
    ['Pass', page.getByRole('button', {name: 'Entdeckerpass öffnen', exact: true}), '.passport-dialog'],
    ['Eltern-Dialog', page.getByRole('contentinfo').getByRole('button', {name: 'Für Eltern', exact: true}), '.parent-guide'],
  ];
  for (const [name, knopf, auswahl] of dialoge) {
    await knopf.click();
    const dialog = page.locator(auswahl);
    await dialog.waitFor();
    const treffer = await page.evaluate(leisteAuswahl => {
      const box = document.querySelector(leisteAuswahl).getBoundingClientRect();
      const el = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      if (!el) return 'nichts';
      return el.closest(leisteAuswahl) ? 'leiste' : 'darüber';
    }, LEISTE);
    assert.equal(treffer, 'darüber', `dialogUeberLeiste: ${name} liegt nicht über der Leiste (${treffer})`);
    await page.keyboard.press('Escape');
    await dialog.waitFor({state: 'hidden'});
  }
}

// Mit „Größere Schrift“ im Pass bleibt die Leiste bei 320 px lesbar, und der Pass bleibt, wie er war.
async function grosseSchrift320(ctx) {
  const pass = createSave();
  pass.progress.settings.largeText = true;
  pass.progress.favorites = ['topic:animal-koala'];
  const context = await ctx.browser.newContext({
    viewport: {width: 320, height: 568},
    reducedMotion: 'reduce',
    hasTouch: true,
    ...(ctx.engine === 'chromium' ? {isMobile: true} : {}),
  });
  try {
    await context.addInitScript(({key, save}) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(save));
    }, {key: SAVE_KEY, save: pass});
    const page = await context.newPage();
    const anfragenFertig = ladeanfragen(page);
    ctx.monitor(page);
    await page.goto(ctx.base);
    await ready(page);
    await page.locator('.earth-app.large-reading').waitFor();
    await leiste(page, 320, '320 große Schrift');
    // Auf der Startseite, bevor die Platzhalter-Prüfung in andere Bereiche wechselt.
    await alleStartfragen(page, ctx.engine, anfragenFertig);
    await platzhalterPassen(page, '320 große Schrift');
    await suchfeldRahmen(page, '320 große Schrift');
    // „Was ist neu?“ mit großer Schrift: der engste Fall für ganze Wörter.
    await page.evaluate(() => { location.hash = 'updates'; });
    await page.locator('#updates-title').waitFor();
    await kurzeWoerterGanz(page, 'neuigkeiten 320 große Schrift');
    await page.locator('details[data-history-disclosure="neuigkeiten-frueher"] > summary').click();
    await kurzeWoerterGanz(page, 'neuigkeiten 320 große Schrift (Früher offen)');
    const gespeichert = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).progress, SAVE_KEY);
    for (const [schluessel, wert] of Object.entries(pass.progress.settings)) {
      assert.deepEqual(gespeichert.settings[schluessel], wert, `grosseSchrift320: Einstellung „${schluessel}“ hat sich verändert`);
    }
    assert.deepEqual(gespeichert.favorites, pass.progress.favorites, 'grosseSchrift320: Merkliste hat sich verändert');
  } finally {
    await context.close();
  }
}

// Nach einem Tipp in der Leiste bringt „Zurück“ die Lesestelle und die Markierung zurück.
async function zurueckNachLeiste(page, {width, touch}, engine) {
  const nav = leisteVon(page);
  await tippe(nav.getByRole('link', {name: 'Welten', exact: true}), touch);
  await page.locator('.world-view').waitFor();
  await page.waitForFunction(() => document.activeElement?.id === 'world-category-title', null, WARTEN).catch(() => {});
  // Handy: Leiste klebt unten, also mitten im Lesen tippen. Ab 768 px scrollt der Kopf mit;
  // dort liegt die Lesestelle so tief, dass „Spielen“ noch 16 px unter dem oberen Rand sichtbar ist
  // (die App rückt Fokus mit weniger als 8 px Abstand absichtlich zur Mitte).
  const ziel = await page.evaluate(breit => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (breit) {
      const spielen = [...document.querySelectorAll('nav[aria-label="Bereiche"] a')].find(a => a.textContent.trim() === 'Spielen');
      return Math.max(0, Math.min(max, Math.floor(spielen.getBoundingClientRect().top + scrollY - 16)));
    }
    return max >= 600 ? 600 : Math.floor(max / 2);
  }, width >= 768);
  await page.evaluate(y => scrollTo({top: y, behavior: 'instant'}), ziel);
  await page.waitForFunction(y => Math.abs(scrollY - y) <= 1, ziel, WARTEN);
  const gemerkt = await page.evaluate(() => scrollY);

  await tippe(nav.getByRole('link', {name: 'Spielen', exact: true}), touch);
  await page.waitForFunction(() => location.hash === '#games', null, WARTEN);
  await page.locator('.game-tile').first().waitFor();
  await page.goBack();
  await page.waitForFunction(() => location.hash === '#world', null, WARTEN);
  await page.locator('.world-view').waitFor();
  await page.waitForFunction(y => Math.abs(scrollY - y) <= 2, gemerkt, WARTEN).catch(() => {});
  const y = await page.evaluate(() => scrollY);
  assert.ok(Math.abs(y - gemerkt) <= 2, `zurueckNachLeiste ${width}: Lesestelle war ${gemerkt}, nach „Zurück“ ${y}`);
  const aktiv = await nav.locator('[aria-current="page"]').allTextContents();
  assert.deepEqual(aktiv.map(text => text.trim()), ['Welten'], `zurueckNachLeiste ${width}: Markierung nach „Zurück“`);
  if (engine === 'chromium') {
    await page.waitForFunction(() => document.activeElement?.dataset.routeFocus === 'home-nav-games', null, WARTEN).catch(() => {});
    assert.equal(await page.evaluate(() => document.activeElement?.dataset.routeFocus), 'home-nav-games', `zurueckNachLeiste ${width}: „Spielen“ hat nach „Zurück“ keinen Fokus`);
  }
}

// Safari (auch jeder Browser auf dem iPhone) fokussiert einen Link beim Antippen nicht.
// Auch dann bringt „Zurück“ die Lesestelle zurück: nach „Spielen“ in der Leiste mitten im Lesen
// und nach „Was ist neu?“ ganz unten im Fuß. HTMLElement.click() klickt wie Safari, ohne Fokus.
async function zurueckOhneFokus(page, {width, touch}) {
  const nav = leisteVon(page);
  await tippe(nav.getByRole('link', {name: 'Welten', exact: true}), touch);
  await page.locator('.world-view').waitFor();
  await page.waitForFunction(() => document.activeElement?.id === 'world-category-title', null, WARTEN).catch(() => {});
  const faelle = [
    ['Spielen', nav.getByRole('link', {name: 'Spielen', exact: true}), '#games', false],
    ['Was ist neu?', page.getByRole('contentinfo').getByRole('link', {name: 'Was ist neu?', exact: true}), '#updates', true],
  ];
  for (const [name, link, hash, ganzUnten] of faelle) {
    // Wie nach dem Ankommen: Der Fokus liegt auf der Überschrift, nicht auf dem Link.
    await page.evaluate(() => document.getElementById('world-category-title')?.focus({preventScroll: true}));
    const stelle = await page.evaluate(unten => {
      const max = document.documentElement.scrollHeight - innerHeight;
      return unten ? max : Math.min(600, Math.floor(max / 2));
    }, ganzUnten);
    await page.evaluate(y => scrollTo({top: y, behavior: 'instant'}), stelle);
    await page.waitForFunction(y => Math.abs(scrollY - y) <= 1, stelle, WARTEN);
    const gemerkt = await page.evaluate(() => scrollY);
    await link.evaluate(element => element.click());
    await page.waitForFunction(ziel => location.hash === ziel, hash, WARTEN);
    await page.goBack();
    await page.waitForFunction(() => location.hash === '#world', null, WARTEN);
    await page.locator('.world-view').waitFor();
    await page.waitForFunction(y => Math.abs(scrollY - y) <= 2, gemerkt, WARTEN).catch(() => {});
    const y = await page.evaluate(() => scrollY);
    assert.ok(Math.abs(y - gemerkt) <= 2, `zurueckOhneFokus ${width} (${name}): Lesestelle war ${gemerkt}, nach „Zurück“ ${y}`);
  }
}

// Auf „Was ist neu?“ ist kein Bereich markiert.
async function updatesOhneMarkierung(page, width) {
  await page.evaluate(() => { location.hash = 'updates'; });
  await page.locator('#updates-title').waitFor();
  assert.equal(await leisteVon(page).locator('[aria-current]').count(), 0, `updatesOhneMarkierung ${width}: ein Bereich ist markiert`);
  // Der Fuß-Link führt dorthin, wo man schon ist: Er zeigt das, statt wie ein Ziel auszusehen.
  const neu = page.getByRole('contentinfo').getByRole('link', {name: 'Was ist neu?', exact: true});
  assert.equal(await neu.getAttribute('aria-current'), 'page', `updatesOhneMarkierung ${width}: „Was ist neu?“ im Fuß ist nicht als aktuelle Seite markiert`);
}

// Das Buch bleibt versteckt geladen, während ein Kind eine Karte liest. Kommt es zurück,
// darf die Bereichsleiste im Buch nicht umspringen. Sonst meldet der Browser eine
// ResizeObserver-Schleife (WebKit wertet sie als Seitenfehler, Chromium nur leise).
async function buchLeisteBleibtRuhig(page, width) {
  await page.evaluate(() => {
    window.__roSchleifen = [];
    addEventListener('error', event => { if (/ResizeObserver loop/.test(event.message)) window.__roSchleifen.push(location.hash); });
  });
  await page.evaluate(() => { location.hash = 'book/words/Schwerkraft'; });
  const buchLeiste = page.locator('.book-navigation');
  await buchLeiste.waitFor(WARTEN);
  const vorher = await buchLeiste.getAttribute('data-strip-overflow');
  for (let runde = 0; runde < 2; runde++) {
    await page.evaluate(() => { location.hash = 'world/topic/science-tides'; });
    await page.locator('.wissenskarte').first().waitFor(WARTEN);
    await page.goBack();
    await buchLeiste.waitFor({state: 'visible', ...WARTEN});
    await page.evaluate(() => new Promise(ok => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(ok, 100)))));
  }
  assert.deepEqual(await page.evaluate(() => window.__roSchleifen), [], `buchLeisteBleibtRuhig ${width}: ResizeObserver-Schleife nach Zurück ins Buch`);
  assert.equal(await buchLeiste.getAttribute('data-strip-overflow'), vorher, `buchLeisteBleibtRuhig ${width}: Bereichsleiste im Buch hat ihre Form gewechselt`);
}

// Dreht ein Kind das Handy, wechselt die Bereichsleiste im Buch zwischen „mit Pfeilen“ (390 px) und
// „ohne Pfeile“ (844 px). Das darf keine ResizeObserver-Schleife auslösen (WebKit wertet sie als
// Seitenfehler). Danach passen die Pfeile zur Leiste („zurück“ ist nur ganz links aus, „weiter“ nur
// ganz rechts), und der gewählte Bereich steht ganz in der Leiste, auch der letzte („Kleiner Atlas“).
async function buchLeisteDrehen(page) {
  await page.evaluate(() => {
    window.__roSchleifen = [];
    addEventListener('error', event => { if (/ResizeObserver loop/.test(event.message)) window.__roSchleifen.push(innerWidth); });
  });
  await page.evaluate(() => { location.hash = 'book/words/Meter'; });
  const buchLeiste = page.locator('.book-navigation');
  await buchLeiste.waitFor(WARTEN);
  const drehen = async (width, height, pfeile) => {
    await page.setViewportSize({width, height});
    // Warten, bis die Leiste umgestellt hat; danach zwei Bilder Zeit für eine mögliche Schleifenmeldung.
    // Stellt sie nicht um, meldet das die Prüfung darunter.
    await page.waitForFunction(erwartet => document.querySelector('.book-navigation')?.dataset.stripOverflow === erwartet, pfeile, {timeout: 5000}).catch(() => {});
    await page.evaluate(() => new Promise(ok => requestAnimationFrame(() => requestAnimationFrame(ok))));
    const stand = await buchLeiste.evaluate(nav => {
      const liste = nav.querySelector('.book-tabs'), [zurueck, weiter] = nav.querySelectorAll(':scope > .area-scroll');
      const aktiv = liste.querySelector('[data-state=active]'), l = liste.getBoundingClientRect(), a = aktiv.getBoundingClientRect();
      return {
        pfeile: nav.dataset.stripOverflow, zurueck: zurueck.disabled, weiter: weiter.disabled,
        ganzLinks: liste.scrollLeft <= 1, ganzRechts: liste.scrollLeft + liste.clientWidth >= liste.scrollWidth - 1,
        aktiv: aktiv.textContent.trim(), aktivLinks: Math.round(a.left - l.left), aktivRechts: Math.round(l.right - a.right),
      };
    });
    const wo = `buchLeisteDrehen ${width} („${stand.aktiv}“)`;
    assert.equal(stand.pfeile, pfeile, `${wo}: Pfeile ${pfeile === 'true' ? 'fehlen' : 'stehen da'}, obwohl die Leiste ${pfeile === 'true' ? 'nicht ' : ''}hineinpasst`);
    if (pfeile === 'true') assert.deepEqual([stand.zurueck, stand.weiter], [stand.ganzLinks, stand.ganzRechts], `${wo}: Pfeile passen nicht zur Leiste ${JSON.stringify(stand)}`);
    assert(stand.aktivLinks >= -1 && stand.aktivRechts >= -1, `${wo}: gewählter Bereich ragt aus der Leiste ${JSON.stringify(stand)}`);
  };
  for (const [width, height, pfeile] of [[844, 390, 'false'], [390, 844, 'true'], [844, 390, 'false'], [390, 844, 'true']]) await drehen(width, height, pfeile);
  await drehen(844, 390, 'false');
  await buchLeiste.getByRole('tab', {name: 'Kleiner Atlas', exact: true}).click();
  await buchLeiste.locator('.book-tabs [data-state=active]', {hasText: 'Kleiner Atlas'}).waitFor(WARTEN);
  for (const [width, height, pfeile] of [[390, 844, 'true'], [844, 390, 'false'], [390, 844, 'true']]) await drehen(width, height, pfeile);
  assert.deepEqual(await page.evaluate(() => window.__roSchleifen), [], 'buchLeisteDrehen: ResizeObserver-Schleife beim Drehen');
}

// Am Rechner mit klassischen Scrollbalken ändert die Bereichsleiste beim Umschalten der Pfeile auch ihre Höhe.
// Stellte die App die Pfeile im ResizeObserver um, meldete Chromium beim Fensterziehen eine Schleife.
// Playwright versteckt Scrollbalken in Chromium (--hide-scrollbars); dieser Fall startet deshalb einen eigenen
// Browser ohne den Schalter. Firefox und WebKit zeigen im Test keine klassischen Scrollbalken.
async function buchLeisteZiehen(ctx) {
  const browser = await ctx.browserType.launch({...ctx.launchOptions, ignoreDefaultArgs: ['--hide-scrollbars']});
  try {
    const page = await (await browser.newContext({viewport: {width: 900, height: 800}, reducedMotion: 'reduce'})).newPage();
    ctx.monitor(page);
    await page.goto(ctx.base + '/#book/words/Meter');
    await ready(page);
    const buchLeiste = page.locator('.book-navigation');
    await buchLeiste.waitFor(WARTEN);
    await page.evaluate(() => {
      window.__roSchleifen = [];
      addEventListener('error', event => { if (/ResizeObserver loop/.test(event.message)) window.__roSchleifen.push(innerWidth); });
    });
    const breiten = [];
    for (let width = 900; width >= 300; width -= 8) breiten.push(width);
    for (let width = 300; width <= 900; width += 8) breiten.push(width);
    const zustaende = new Set();
    let balken = 0;
    for (const width of breiten) {
      await page.setViewportSize({width, height: 800});
      await page.evaluate(() => new Promise(ok => requestAnimationFrame(() => requestAnimationFrame(ok))));
      const stand = await buchLeiste.evaluate(nav => {
        const liste = nav.querySelector('.book-tabs');
        return {pfeile: nav.dataset.stripOverflow, balken: liste.offsetHeight - liste.clientHeight};
      });
      zustaende.add(stand.pfeile);
      balken = Math.max(balken, stand.balken);
    }
    // Ohne Pfeilwechsel prüft der Fall nichts; ohne Scrollbalken ist es der falsche Fall.
    assert.deepEqual([...zustaende].sort(), ['false', 'true'], 'buchLeisteZiehen: Die Pfeile wechseln beim Ziehen nicht');
    assert(balken > 0, `buchLeisteZiehen: Die Leiste zeigt nie einen Scrollbalken, der Fall prüft so nichts`);
    assert.deepEqual(await page.evaluate(() => window.__roSchleifen), [], 'buchLeisteZiehen: ResizeObserver-Schleife beim Fensterziehen');
  } finally {
    await browser.close();
  }
}

// Die Hilfe „So geht’s“ steht auf der Startseite in jeder Breite (der alte Hilfe-Knopf im Kopf ist weg).
async function hilfeAufStart(page, width) {
  await page.evaluate(() => { location.hash = 'home'; });
  await page.locator('.discovery-hero').waitFor();
  const hilfe = page.getByRole('button', {name: 'So geht’s', exact: true});
  assert.equal(await hilfe.isVisible(), true, `hilfeAufStart ${width}: „So geht’s“ ist auf der Startseite nicht zu sehen`);
  const box = await hilfe.boundingBox();
  assert.ok(box.height >= 44, `hilfeAufStart ${width}: „So geht’s“ ist nur ${box.height} px hoch`);
  await hilfe.click();
  await page.locator('.help-start').waitFor();
  await page.keyboard.press('Escape');
  await page.locator('.help-dialog').waitFor({state: 'hidden'});
}

// Der Fokusrahmen des Suchfelds im Suchdialog liegt ganz frei, nichts schneidet ihn ab.
async function suchfeldRahmen(page, width) {
  await page.getByRole('button', {name: 'Lernwelt durchsuchen', exact: true}).click();
  const feld = page.getByRole('dialog').locator('input');
  await feld.waitFor();
  await page.waitForFunction(() => document.activeElement?.tagName === 'INPUT');
  // Die Trefferliste kann nach dem Öffnen noch rollen; erst danach messen.
  await page.evaluate(() => new Promise(fertig => requestAnimationFrame(() => requestAnimationFrame(fertig))));
  const rahmen = await page.evaluate(() => {
    const input = document.activeElement;
    const traeger = [input, input.parentElement].find(e => getComputedStyle(e).outlineStyle !== 'none');
    if (!traeger) return {rahmen: false, abgeschnitten: null};
    const s = getComputedStyle(traeger), rand = parseFloat(s.outlineWidth) + parseFloat(s.outlineOffset);
    const r = traeger.getBoundingClientRect();
    for (let a = traeger.parentElement; a; a = a.parentElement) {
      const o = getComputedStyle(a);
      if (o.overflowX === 'visible' && o.overflowY === 'visible') continue;
      const q = a.getBoundingClientRect();
      if (r.top - rand < q.top - .5 || r.left - rand < q.left - .5 || r.right + rand > q.right + .5 || r.bottom + rand > q.bottom + .5)
        return {rahmen: true, abgeschnitten: a.className || a.tagName};
    }
    return {rahmen: true, abgeschnitten: null};
  });
  assert.deepEqual(rahmen, {rahmen: true, abgeschnitten: null}, `suchfeldRahmen ${width}: Fokusrahmen des Suchfelds fehlt oder ist abgeschnitten`);
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({state: 'detached'});
}

// Beispieltexte in Suchfeldern enden nicht mitten im Wort: Suchdialog, Labore, Reisen, Wissensbuch.
async function platzhalterPassen(page, wo) {
  const zuLang = () => page.evaluate(() => [...document.querySelectorAll('input[placeholder]')].filter(i => i.offsetParent).flatMap(i => {
    const alt = i.value;
    i.value = i.placeholder;
    const ueber = i.scrollWidth > i.clientWidth;
    i.value = alt;
    return ueber ? [i.placeholder] : [];
  }));
  const gefunden = [];
  await page.getByRole('button', {name: 'Lernwelt durchsuchen', exact: true}).click();
  await page.getByRole('dialog').locator('input').waitFor();
  gefunden.push(...await zuLang());
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({state: 'detached'});
  for (const [ziel, feld] of [['labs', '.lab-search input'], ['journeys', '.journey-filters input'], ['book', '.book-search input']]) {
    await page.evaluate(hash => { location.hash = hash; }, ziel);
    await page.locator(feld).waitFor();
    gefunden.push(...await zuLang());
  }
  assert.deepEqual(gefunden, [], `platzhalterPassen ${wo}: Beispieltexte passen nicht ins Feld`);
}

// „Was ist neu?“: Titel ruhig fokussiert, neueste Einträge oben, ältere unter „Früher“ eingeklappt.
async function neuigkeiten(page, width) {
  // Erst klicken, wenn die Startseite fertig geladen hat. Kommen ihre nachgeladenen Teile, rutscht der Fuß um über
  // 1000 px nach unten. Fiel das zwischen Drücken und Loslassen, traf das Loslassen ein Bild, und der Klick verpuffte;
  // Playwright prüft nur, was beim Drücken unter dem Zeiger liegt (CI-Lauf 45397127026, Firefox, 24.11.2026;
  // nachgestellt mit verzögertem Nachladen: ohne dieses Warten 8 von 8 Klicks verpufft, mit Warten keiner).
  await klickNachRuhe(page.getByRole('contentinfo').getByRole('link', {name: 'Was ist neu?', exact: true}));
  const titel = page.locator('#updates-title');
  await titel.waitFor();
  await page.waitForFunction(() => document.activeElement?.id === 'updates-title', null, {polling: 100});
  assert.equal(await titel.evaluate(el => getComputedStyle(el).outlineStyle), 'none', `neuigkeiten ${width}: Titel zeigt einen Fokusrahmen`);
  assert.equal((await titel.innerText()).trim(), 'Was ist neu?', `neuigkeiten ${width}: Titel`);
  const ansicht = page.locator('.kern-neuigkeiten');
  assert.deepEqual(await ansicht.locator('li[data-neuigkeit]').evaluateAll(eintraege => eintraege.map(e => e.dataset.neuigkeit)),
    NEUIGKEITEN.map(e => e.id), `neuigkeiten ${width}: Einträge oder Reihenfolge stimmen nicht`);
  const {neu, frueher} = aufteilen();
  assert.equal(await ansicht.locator(':scope > ol > li').count(), neu.length, `neuigkeiten ${width}: Zahl der Einträge oben`);
  const erster = ansicht.locator('li[data-neuigkeit]').first();
  const ueberschrift = erster.getByRole('heading', {level: 2});
  assert.equal((await ueberschrift.innerText()).trim(), NEUIGKEITEN[0].titel, `neuigkeiten ${width}: Titel des ersten Eintrags`);
  const zeit = erster.locator('time');
  assert.equal(await zeit.getAttribute('datetime'), NEUIGKEITEN[0].datum, `neuigkeiten ${width}: datetime`);
  assert.equal((await zeit.innerText()).trim(), datumLesbar(NEUIGKEITEN[0].datum), `neuigkeiten ${width}: lesbares Datum`);
  await kurzeWoerterGanz(page, `neuigkeiten ${width}`);
  // Ohne Scrollen sichtbar, auch über der Leiste unten am Handy.
  const sichtbar = await ueberschrift.evaluate((el, leiste) => {
    const r = el.getBoundingClientRect(), nav = document.querySelector(leiste).getBoundingClientRect();
    const unten = nav.top > innerHeight / 2 ? nav.top : innerHeight;
    return r.top >= 0 && r.bottom <= unten;
  }, LEISTE);
  assert.ok(sichtbar, `neuigkeiten ${width}: erster Eintrag ist ohne Scrollen nicht zu sehen`);
  const frueherBox = ansicht.locator('details[data-history-disclosure="neuigkeiten-frueher"]');
  assert.equal((await frueherBox.locator(':scope > summary').innerText()).trim(), 'Früher', `neuigkeiten ${width}: Knopf „Früher“`);
  assert.equal(await frueherBox.evaluate(el => el.open), false, `neuigkeiten ${width}: „Früher“ ist zu Beginn offen`);
  assert.equal(await frueherBox.locator('li[data-neuigkeit]').count(), frueher.length, `neuigkeiten ${width}: Zahl der Einträge unter „Früher“`);
  await axeOhneVerstoss(page, `neuigkeiten ${width}`);
  await frueherBox.locator(':scope > summary').click();
  assert.equal(await frueherBox.evaluate(el => el.open), true, `neuigkeiten ${width}: „Früher“ öffnet nicht`);
  await axeOhneVerstoss(page, `neuigkeiten ${width} (Früher offen)`);
  await kurzeWoerterGanz(page, `neuigkeiten ${width} (Früher offen)`);
}

// Leseanfänger stolpern über getrennte Wörter („ei-ner“). Im Fließtext gibt es keine Silbentrennung,
// ein Bruch hätte dort nicht einmal einen Bindestrich: kein Wort darf über zwei Zeilen laufen.
// Überschriften trennen lange Wörter, aber keins unter 10 Buchstaben. Gemessen an jedem Buchstaben.
async function kurzeWoerterGanz(page, wo) {
  const geteilt = await page.evaluate(() => {
    const funde = [];
    for (const el of document.querySelectorAll('.kern-neuigkeiten li :is(h2, p)')) {
      if (!el.getClientRects().length) continue;
      const gang = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let knoten = gang.nextNode(); knoten; knoten = gang.nextNode()) {
        for (const wort of knoten.textContent.matchAll(/\p{L}+/gu)) {
          if (el.tagName === 'H2' && wort[0].length >= 10) continue;
          const zeilen = new Set(), bereich = document.createRange();
          for (let i = 0; i < wort[0].length; i++) {
            bereich.setStart(knoten, wort.index + i);
            bereich.setEnd(knoten, wort.index + i + 1);
            const r = bereich.getBoundingClientRect();
            if (r.width) zeilen.add(Math.round(r.top));
          }
          if (zeilen.size > 1) funde.push(wort[0]);
        }
      }
    }
    return funde;
  });
  assert.deepEqual(geteilt, [], `${wo}: Wörter über zwei Zeilen getrennt`);
}

// Die Startfrage wechselt bei jedem Besuch zufällig. Mit großer Schrift bei 320 px (dem engsten Fall)
// muss jede passen: kein Wort über zwei Zeilen getrennt, keine waagerecht verschiebbare Seite.
// Bis November 2026 ragte eine Frage mit langem Wort samt Pfeil 7 bis 10 px über den Rand;
// das fiel nur auf, wenn der Zufall sie traf. Jede Frage kommt über den echten Rückweg der App auf die
// Seite: Motiv im Verlaufseintrag der Startseite (history.state.wunderHero), kurz weg, dann Zurück.
// Neuladen taugt dafür nicht: Beim Verlassen (pagehide) schreibt die App das angezeigte Motiv zurück.
// Vor dem Weggehen lädt alles fertig (Abbrüche zählen sonst als Browserfehler, siehe ladeanfragen).
// Gemessen wird gegen documentElement.clientWidth, nicht innerWidth: Chromium im Handy-Modus (isMobile)
// vergrößert innerWidth mit dem Überlauf, die Prüfung wäre dort blind.
async function alleStartfragen(page, engine, anfragenFertig) {
  const funde = [];
  for (const motiv of HOME_MOTIFS) {
    await page.evaluate(id => history.replaceState({...history.state, wunderHero: id}, '', location.href), motiv.id);
    await anfragenFertig();
    await navigationsTempo(page, engine);
    await page.evaluate(() => { location.hash = 'updates'; });
    await page.locator('#updates-title').waitFor(WARTEN);
    await navigationsTempo(page, engine);
    await page.goBack();
    await page.locator('[data-discovery-hero] .discovery-feature > a').waitFor(WARTEN);
    const stand = await page.evaluate(() => {
      const link = document.querySelector('.discovery-feature > a');
      const geteilt = [];
      const gang = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
      for (let knoten = gang.nextNode(); knoten; knoten = gang.nextNode()) {
        for (const wort of knoten.textContent.matchAll(/\p{L}+/gu)) {
          const zeilen = new Set(), bereich = document.createRange();
          for (let i = 0; i < wort[0].length; i++) {
            bereich.setStart(knoten, wort.index + i);
            bereich.setEnd(knoten, wort.index + i + 1);
            const r = bereich.getBoundingClientRect();
            if (r.width) zeilen.add(Math.round(r.top));
          }
          if (zeilen.size > 1) geteilt.push(wort[0]);
        }
      }
      return {
        motiv: document.querySelector('[data-discovery-hero]')?.dataset.discoveryHero,
        ueberlauf: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        geteilt,
      };
    });
    assert.equal(stand.motiv, motiv.id, `alleStartfragen: Rückweg zeigt ${stand.motiv} statt ${motiv.id}`);
    if (stand.ueberlauf > 0 || stand.geteilt.length) funde.push(`${motiv.id}: ${stand.ueberlauf > 0 ? `${stand.ueberlauf} px Überlauf` : ''}${stand.geteilt.length ? ` getrennt: ${stand.geteilt.join(', ')}` : ''}`);
  }
  assert.deepEqual(funde, [], 'alleStartfragen 320 große Schrift: Startfragen passen nicht');
}

async function axeOhneVerstoss(page, wo) {
  await prepareAxe(page);
  const verstoesse = await page.evaluate(async () => (await window.axe.run('.kern-neuigkeiten', {runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']}}))
    .violations.map(v => ({id: v.id, ziele: v.nodes.map(n => n.target)})));
  assert.deepEqual(verstoesse, [], `${wo}: axe meldet Verstöße`);
}
