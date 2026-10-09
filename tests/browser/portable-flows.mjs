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
  await page.getByText('Noch kein Treffer. Versuch ein kürzeres Wort.', { exact: true }).waitFor();
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
