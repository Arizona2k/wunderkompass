import assert from 'node:assert/strict';

export async function searchAndHistory(page, report) {
  for (const [query, id] of [
    ['Elefant', 'topic:animal-african-savanna-elephant'],
    ['Elefamt', 'topic:animal-african-savanna-elephant'],
    ['Einstein', 'topic:person-albert_einstein'],
    ['Giraffe', 'topic:animal-giraffe'],
  ]) {
    await page.getByRole('button', { name: 'Lernwelt durchsuchen', exact: true }).click();
    await page.getByRole('dialog').locator('input').fill(query);
    const result = page.getByRole('option').first();
    await result.waitFor();
    assert.equal(await result.getAttribute('data-value'), id);
    await result.click();
    await page.locator('.world-mini-question').waitFor();
    assert.equal(new URL(page.url()).hash, '#world/topic/' + id.slice(6));
  }
  await page.getByRole('button', { name: 'Lernwelt durchsuchen', exact: true }).click();
  await page.getByRole('dialog').locator('input').fill('zzzzzz');
  await page.getByText('Dazu haben wir noch keinen passenden Treffer. Probiere ein kürzeres Wort.', { exact: true }).waitFor();
  assert.equal(await page.getByRole('option').count(), 0);
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'hidden' });
  await page.evaluate(() => { location.hash = 'world/topic/science-energy'; });
  await page.locator('.model-energy').waitFor();
  await page.goBack();
  await page.waitForFunction(() => location.hash === '#world/topic/animal-giraffe');
  await page.locator('.world-mini-question').waitFor();
  await page.goForward();
  await page.locator('.model-energy').waitFor();
  report.checks.push('Search, typo, empty results, Escape, hash links, Back/Forward');
  await geographyFacts(page, report);
}

export async function geographyFacts(page, report) {
  for (const [name, capital, note, language] of [
    ['Kanada', 'Ottawa', 'Land und Binnengewässer', null],
    ['Benin', 'Porto-Novo', 'Regierungssitz befindet sich in Cotonou', 'Französisch, Fon, Yoruba, Anii und weitere Sprachen'],
    ['Burundi', 'Gitega', 'Bujumbura bleibt ein wichtiges Wirtschaftszentrum', 'Rundi, Französisch, Englisch, Suaheli und weitere Sprachen'],
  ]) {
    await page.getByRole('button', {name:'Lernwelt durchsuchen', exact:true}).click();
    await page.getByRole('combobox', {name:'Lernwelt durchsuchen', exact:true}).fill(name);
    await page.getByRole('option').getByText(name, {exact:true}).click();
    await page.locator('.capital-line').getByText(capital, {exact:true}).waitFor();
    const details=page.locator('.place-portrait-wide .portrait-details');
    if (!await details.evaluate(e=>e.open)) await details.locator(':scope > summary').click();
    await details.locator('.geography-notes > p.small-note').first().filter({hasText:note}).waitFor();
    if (language) await details.getByText(language, {exact:true}).waitFor();
    if (name==='Kanada') {
      await details.getByText('Fläche · 2025', {exact:true}).waitFor();
      await details.getByText('Rund 9.984.670 km²', {exact:true}).waitFor();
    }
    await details.getByRole('link').first().waitFor();
    assert.ok(await details.getByRole('link').count()>0, name+' source remains visible');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,name+' geography overflow');
  }
  for (const [name, meaning] of [
    ['Bujumbura', 'Wirtschaftszentrum'], ['Cotonou', 'Regierungssitz'],
    ['Gitega', 'politische Hauptstadt'], ['Porto-Novo', 'offizielle Hauptstadt'],
  ]) {
    await page.getByRole('button', {name:'Lernwelt durchsuchen', exact:true}).click();
    await page.getByRole('combobox', {name:'Lernwelt durchsuchen', exact:true}).fill(name);
    await page.getByRole('option').getByText(name, {exact:true}).click();
    await page.locator('.info-card').getByRole('heading', {name,exact:true}).waitFor();
    await page.locator('.info-card').getByText(meaning,{exact:false}).first().waitFor();
  }
  await page.getByRole('combobox',{name:'Was möchtest du sehen?',exact:true}).getByText('Städte & Hauptstädte',{exact:true}).waitFor();
  report.checks.push('Geography: sourced Canada land/freshwater area, Benin/Burundi capitals, four retained/new cities and readable language names');
}

export async function memoryRound(page, ready, report) {
  await page.getByRole('tab', { name: 'Spielplatz', exact: true }).click();
  await page.locator('.game-tile').filter({
    has: page.getByRole('heading', { name: 'Länder-Memory', exact: true }),
  }).click();
  const cards = page.locator('.memory-card');
  await page.getByRole('button', { name: 'Karte 1 aufdecken', exact: true }).click();
  const first = await cards.nth(0).getAttribute('aria-label');
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('erde-entdecken:save:v3'))?.progress.gameSessions?.memory?.open?.length === 1);
  await page.reload();
  await ready(page);
  await page.getByRole('button', { name: 'Fortsetzen', exact: true }).click();
  await cards.first().waitFor();
  assert.equal(await cards.nth(0).getAttribute('aria-label'), first);
  // Learn the shuffled board through actual clicks, retaining only observed labels.
  const observed = new Map([[0, first.replace(/, Paar gefunden$/, '')]]);
  for (let i = 1; i < 12; i++) {
    if (await cards.nth(i).isDisabled()) continue;
    await cards.nth(i).click();
    observed.set(i, (await cards.nth(i).getAttribute('aria-label')).replace(/, Paar gefunden$/, ''));
    const cover = page.getByRole('button', { name: 'Karten wieder zudecken', exact: true });
    if (await cover.count()) {
      await cover.click();
      report.checks.push('Memory wrong pair rejected');
    }
  }
  const capitals = new Map([
    ['Deutschland', 'Berlin'], ['Frankreich', 'Paris'], ['Italien', 'Rom'],
    ['Spanien', 'Madrid'], ['Japan', 'Tokio'], ['Australien', 'Canberra'],
    ['Ägypten', 'Kairo'], ['Brasilien', 'Brasília'], ['Kanada', 'Ottawa'],
    ['Iran', 'Teheran'], ['Indien', 'Neu-Delhi'], ['Kenia', 'Nairobi'],
  ]);
  for (const [index, label] of observed) {
    if (!label.startsWith('Land: ') || await cards.nth(index).isDisabled()) continue;
    const target = 'Hauptstadt: ' + capitals.get(label.slice(6));
    const pair = [...observed].find(([, value]) => value === target);
    assert.ok(pair, 'Observed matching capital for ' + label);
    // One final card may still be open after exploring the board.
    const open = page.locator('.memory-card.flipped:not(.matched)');
    if (await open.count()) {
      const openLabel = await open.first().getAttribute('aria-label');
      const toClick = openLabel === label ? pair[0] : index;
      await cards.nth(toClick).click();
      const cover = page.getByRole('button', { name: 'Karten wieder zudecken', exact: true });
      if (await cover.count()) await cover.click();
      if (await cards.nth(index).isDisabled()) continue;
    }
    await cards.nth(index).click();
    await cards.nth(pair[0]).click();
  }
  await page.getByText(/Alle sechs Paare gefunden/).waitFor();
  assert.equal(await page.locator('.memory-card.matched').count(), 12);
  report.checks.push('Memory shuffled round survives reload and completes through UI');
}
