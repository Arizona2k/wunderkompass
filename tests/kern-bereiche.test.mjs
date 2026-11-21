// Die sechs Bereiche der neuen Leiste: Reihenfolge, Wörter, Ziele und welche Route zu welchem Bereich gehört.
import assert from 'node:assert/strict';
import test from 'node:test';
import {BEREICHE, bereichFuerRoute} from '../app/kern/bereiche.ts';

test('die Leiste hat sechs Bereiche in fester Reihenfolge', () => {
  assert.deepEqual(BEREICHE.map(b => b.id), ['explore', 'world', 'games', 'labs', 'journeys', 'book']);
  assert.deepEqual(BEREICHE.map(b => b.wort), ['Start', 'Welten', 'Spielen', 'Labor', 'Reisen', 'Buch']);
  assert.deepEqual(BEREICHE.map(b => b.ziel), ['home', 'world', 'games', 'labs', 'journeys', 'book']);
});

test('jede Route gehört zum richtigen Bereich', () => {
  const faelle = [
    ['home', 'home', 'explore'],
    ['globe', 'globe', 'explore'],
    ['layers', 'layers', 'explore'],
    ['day', 'day', 'explore'],
    ['quiz', 'quiz', 'games'],
    ['games', 'games', 'games'],
    ['world', 'world/topic/animal-polar-bear', 'world'],
    ['labs', 'labs/volcano', 'labs'],
    ['journeys', 'journeys/ocean', 'journeys'],
    ['book', 'book/words/Dichte', 'book'],
    ['home', 'updates', null],
    ['xyz', 'xyz', null],
  ];
  for (const [modus, route, erwartet] of faelle) {
    assert.equal(bereichFuerRoute(modus, route), erwartet, `${modus} + ${route}`);
  }
});
