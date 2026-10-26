import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
const read=path=>JSON.parse(fs.readFileSync(new URL(path,import.meta.url),'utf8'));
const topics=read('../app/world-catalog.json'),index=read('../app/world-index.json'),photos=read('../app/world-photos.json'),baseline=read('./fixtures/baseline-topics.json');
test('all original topics and categories survive editorial expansion',()=>{
 for(const old of baseline){const current=topics.find(t=>t.id===old.id);assert.ok(current,old.id);assert.equal(current.category,old.category);}
 assert.equal(new Set(topics.map(t=>t.id)).size,topics.length);assert.deepEqual(index.map(t=>t.id),topics.map(t=>t.id));
});
test('each topic has meaningful depth, a valid question and valid connections',()=>{
 for(const t of topics){assert.ok(t.more.length>=2,t.id+' depth');assert.ok(t.question.answers.length>=2,t.id);assert.equal(new Set(t.question.answers).size,t.question.answers.length);assert.ok(Number.isInteger(t.question.correct)&&t.question.correct>=0&&t.question.correct<t.question.answers.length);for(const id of t.related)assert.ok(topics.some(p=>p.id===id),t.id+' → '+id);assert.ok(t.sources.length>0);for(const s of t.sources)assert.ok(s.url.startsWith('https://'));}
});
test('every retained animal/person photo or individually authored registered own animal/person diagram has its own local rights evidence',()=>{
 const own=read('../app/animal-illustrations.json').entries,peopleOwn=read('../app/people-illustrations.json').entries,legacy=read('./fixtures/legacy-people18-before-two-biographies.json');assert.deepEqual(peopleOwn.map(e=>e.id),['person-mary_anning','person-ibn_al_haytham','person-maria_sibylla_merian','person-inge_lehmann']);assert.equal(Object.keys(legacy.photos).length,18);for(const[id,image]of Object.entries(legacy.photos))assert.equal(topics.find(t=>t.id===id).image,image,id+' old authentic photo retained');
 for(const t of topics.filter(t=>t.animal||t.person)){const diagram=own.find(e=>e.id===t.id);if(diagram){assert.equal(t.category,'animals');assert.equal(t.image,undefined);assert.ok(diagram.alt&&diagram.caption);assert.ok(fs.existsSync(new URL('../public'+diagram.src,import.meta.url)));continue;}const personDrawing=peopleOwn.find(e=>e.id===t.id);if(personDrawing){assert.equal(t.category,'people');assert.equal(t.image,undefined);assert.equal(personDrawing.rightsState,'own');assert.equal(personDrawing.notPhotograph,true);assert.ok(personDrawing.alt&&personDrawing.caption&&personDrawing.author&&personDrawing.modelLimits);assert.equal(personDrawing.sources.length,t.sources.length);assert.ok(personDrawing.sources.every(url=>t.sources.some(source=>source.url===url)));assert.equal(personDrawing.renderer,['person-maria_sibylla_merian','person-inge_lehmann'].includes(t.id)?'app/people-observation-drawings.tsx':'app/people-illustration.tsx');assert.ok(fs.existsSync(new URL('../'+personDrawing.renderer,import.meta.url)));continue;}const p=photos[t.image];assert.ok(p,t.id+' image');assert.ok(p.alt_de&&p.author&&p.license&&p.license_url);assert.ok(fs.existsSync(new URL('../public'+p.src,import.meta.url)),p.src);}
 for(const p of Object.values(photos)){assert.ok(p.width>0&&p.height>0);assert.ok(fs.existsSync(new URL('../public'+p.src,import.meta.url)),p.src);}
});
test('the geographical overview used by cards exists',()=>assert.ok(fs.existsSync(new URL('../public/journeys/continents.svg',import.meta.url))));
test('the Vostok station marker is near the registered station, rather than a lake or the inconsistent record-table coordinate',()=>{
 const station=read('../exports/content/nature-locations.json').find(place=>place.id==='vostok');assert.ok(station);
 // SCAR Composite Gazetteer/AADC gaz_id136400: station -78.46667,106.80000;
 // its precision is unspecified. Two kilometres accommodates a rounded marker.
 const radians=value=>value*Math.PI/180,distance=({lat,lon})=>{const dLat=radians(lat+78.46667),dLon=radians(lon-106.8),a=Math.sin(dLat/2)**2+Math.cos(radians(lat))*Math.cos(radians(-78.46667))*Math.sin(dLon/2)**2;return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));};
 assert.ok(distance(station)<2,'Station map marker must be within2km of the registered station');
 assert.ok(distance({lat:-77.5,lon:106.8})>100,'Historical misplaced latitude is a meaningful counterexample');
});
