import test from 'node:test';
import assert from 'node:assert/strict';
import source from '../app/planet-distance-source.json' with {type:'json'};
import {PLANET_DISTANCE_AU,MAX_PLANET_DISTANCE_AU,distanceNumber} from '../app/planet-distances.ts';
import {PLANETS} from '../app/solar-system-data.ts';

test('both solar displays use one defined eight-planet NASA distance table and the exact AU',()=>{
 assert.equal(source.astronomicalUnitKm,149597870.7);
 assert.deepEqual(source.distancesMillionKm,{mercury:57.9,venus:108.2,earth:149.6,mars:228,jupiter:778.5,saturn:1432,uranus:2867,neptune:4515});
 assert.equal(source.sourceUrl,'https://nssdc.gsfc.nasa.gov/planetary/factsheet/');assert.equal(source.sourceUpdatedOn,'2025-03-18');
 assert.deepEqual(PLANETS.map(p=>p.id),['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune']);
 assert.deepEqual(PLANETS.map(p=>distanceNumber(p.au)),['0,387','0,723','1','1,524','5,204','9,572','19,165','30,181']);
 for(const p of PLANETS){assert.equal(p.au,PLANET_DISTANCE_AU[p.id]);assert(Number.isFinite(p.au)&&p.au>0);}
 assert.equal(MAX_PLANET_DISTANCE_AU,PLANET_DISTANCE_AU.neptune);assert.equal(distanceNumber(MAX_PLANET_DISTANCE_AU),'30,181');
 assert(PLANET_DISTANCE_AU.earth!==1,'the rounded149.6million-km input is not falsely equated with the exact AU');
});

test('a shared distance conversion preserves all existing planet choices and orbital time approximations',()=>{
 assert.deepEqual(PLANETS.map(p=>p.name),['Merkur','Venus','Erde','Mars','Jupiter','Saturn','Uranus','Neptun']);
 assert.deepEqual(PLANETS.map(p=>p.days),[88,225,365.25,687,4333,10756,30687,60190]);
 assert.equal(new Set(PLANETS.map(p=>p.id)).size,8);assert(PLANETS.every(p=>p.fact&&p.color&&p.type));
 assert(PLANET_DISTANCE_AU.mercury<PLANET_DISTANCE_AU.venus&&PLANET_DISTANCE_AU.uranus<PLANET_DISTANCE_AU.neptune);
});
