import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {countryPlace,currentGeographyPlace,currentGeographyPlaces} from '../app/earth-data.ts';
import metadata from '../app/country-metadata.json' with {type:'json'};
import capitals from '../app/capital-points.json' with {type:'json'};
import {createSave,restoreSave} from '../app/progress-storage.ts';
const countries=JSON.parse(fs.readFileSync('public/world.json','utf8')).features;

test('country facts distinguish territorial area, official capital and government seat',()=>{
 const place=id=>countryPlace(countries.find(c=>c.properties.id===id));
 assert.equal(place('CAN').area,9_984_670);assert.equal(place('CAN').areaYear,2025);
 assert.match(place('CAN').geographyNote,/Land und Binnengewässer/);
 assert.equal(place('BEN').capital,'Porto-Novo');assert.match(place('BEN').geographyNote,/Regierungssitz.*Cotonou/);
 assert.equal(place('BDI').capital,'Gitega');assert.match(place('BDI').geographyNote,/Bujumbura.*Wirtschaft/);
 for(const id of ['CAN','BEN','BDI']){
  assert.equal(place(id).geographyCheckedOn,'2026-10-21');
  assert(place(id).geographySources.length>0);
  assert(place(id).geographySources.every(s=>s.url.startsWith('https://')&&s.title));
 }
});

test('corrected capitals exist under stable IDs in the current data with their corrected names, positions and roles',()=>{
 assert.equal(new Set(capitals.map(p=>p.id)).size,capitals.length,'capital IDs are unique');
 const point=id=>capitals.find(p=>p.id===id);
 for(const [id,name,lat,lon,country] of [['capital-1159146001','Gitega',-3.426007,29.843594,'BDI'],['capital-1159150345','Porto-Novo',6.483311,2.616626,'BEN']]){
  const capital=point(id);assert.ok(capital,id);assert.deepEqual([capital.name,capital.category,capital.lat,capital.lon],[name,'capitals',lat,lon],id);
  assert.equal(capitals.filter(p=>p.name===name).length,1,name+' appears once');assert.equal(metadata[country].capital,name,country+' official capital');
 }
 const bujumbura=point('capital-1159150427'),cotonou=point('capital-1159151141');
 assert.equal(bujumbura?.name,'Bujumbura');assert.match(bujumbura.text,/Wirtschaftszentrum.*Gitega/);
 assert.equal(cotonou?.name,'Cotonou');assert.match(cotonou.text,/Regierungssitz.*Porto-Novo/);
 for(const id of ['capital-1159146001','capital-1159150345','capital-1159150427','capital-1159151141']){
  assert.equal(point(id).geographyCheckedOn,'2026-10-21');assert.ok(point(id).geographySources.length>0);assert.ok(point(id).geographySources.every(s=>s.url.startsWith('https://')&&s.title),id);
 }
});

test('old favorite snapshots open current facts without rewriting the imported pass or losing unknown places',()=>{
 const saved={schemaVersion:3,progress:{notes:[{id:'retained-note',text:'Vorhandene synthetische Notiz.'}],favorites:['BEN','BDI','CAN','capital-1159150427','capital-1159151141','old-custom-place'],favoritePlaces:{
  BEN:{id:'BEN',name:'Benin',kind:'country',lat:9.3,lon:2.3,capital:'Cotonou',text:'Vorhandene alte Beschreibung.',fact:'Vorhandene alte Angabe.'},
  BDI:{id:'BDI',name:'Burundi',kind:'country',lat:-3.3,lon:29.9,capital:'Bujumbura',text:'Vorhandene alte Beschreibung.',fact:'Vorhandene alte Angabe.'},
  CAN:{id:'CAN',name:'Kanada',kind:'country',lat:60,lon:-100,area:15_634_410,text:'Vorhandene alte Beschreibung.',fact:'Vorhandene alte Angabe.'},
  'capital-1159150427':{id:'capital-1159150427',name:'Bujumbura',kind:'nature',lat:-3.376087,lon:29.360006,text:'Bujumbura ist eine Hauptstadt von Burundi.',fact:'Alte gespeicherte Angabe.'},
  'capital-1159151141':{id:'capital-1159151141',name:'Cotonou',kind:'nature',lat:6.36298,lon:2.404355,text:'Cotonou ist eine Hauptstadt von Benin.',fact:'Alte gespeicherte Angabe.'},
  'old-custom-place':{id:'old-custom-place',name:'Mein alter Ort',kind:'nature',lat:1,lon:2,text:'Behaltene eigene Ansicht.',fact:'Unverändert.'}
 }}};
 const original=structuredClone(saved);for(const p of Object.values(saved.progress.favoritePlaces))Object.freeze(p);
 const current=id=>currentGeographyPlace(saved.progress.favoritePlaces[id],countries,capitals);
 assert.equal(current('BEN').capital,'Porto-Novo');assert.equal(current('BDI').capital,'Gitega');assert.equal(current('CAN').area,9_984_670);
 assert.match(current('capital-1159150427').text,/Wirtschaftszentrum/);assert.match(current('capital-1159151141').text,/Regierungssitz/);
 assert.equal(current('old-custom-place'),saved.progress.favoritePlaces['old-custom-place']);
 assert.deepEqual(saved,original,'stored old snapshots, notes and favorite identities remain untouched');
});

// Both the search Map and the notebook find() must see the same current entry.
test('a single derived place list keeps current known facts and unknown old favorites for all readers',()=>{
 const old={id:'BEN',name:'Benin',kind:'country',lat:9,lon:2,capital:'Cotonou',text:'Alter Snapshot.',fact:'Alt.'};
 const unknown={id:'old-custom',name:'Eigener Ort',kind:'nature',lat:1,lon:2,text:'Erhalten.',fact:'Erhalten.'};
 const saved=Object.freeze([Object.freeze(old),Object.freeze(unknown)]),canonical=countryPlace(countries.find(c=>c.properties.id==='BEN'));
 const places=currentGeographyPlaces(saved,[canonical]);
 assert.equal(places.filter(p=>p.id==='BEN').length,1);assert.equal(places.find(p=>p.id==='BEN'),canonical);
 assert.equal(new Map(places.map(p=>[p.id,p])).get('BEN').capital,'Porto-Novo');
 assert.equal(places.find(p=>p.id==='old-custom'),unknown);assert.equal(old.capital,'Cotonou');
});

test('imported favorites cannot inject trusted geography sources or review notes',()=>{
 const save=createSave();
 save.progress.notes=[{id:'retained-note',text:'Meine unveränderte Notiz.',at:'2026-10-18T00:00:00.000Z'}];
 save.progress.gameSessions.memory={open:[0],matched:[]};
 const forged={geographyNote:'Fremde Behauptung.',geographyCheckedOn:'2099-01-01',geographySources:[{title:'Fremde Quelle',url:'javascript:alert(1)'}]};
 save.progress.favorites=['BEN','old-custom'];
 save.progress.favoritePlaces={
  BEN:{id:'BEN',name:'Benin',kind:'country',lat:9,lon:2,text:'Alter Snapshot.',fact:'Behalten.',capital:'Cotonou',...forged},
  'old-custom':{id:'old-custom',name:'Mein alter Ort',kind:'nature',lat:1,lon:2,text:'Eigene Ansicht.',fact:'Behalten.',...forged},
 };
 const before=structuredClone(save),restored=restoreSave(save,true);
 for(const place of Object.values(restored.progress.favoritePlaces)){
  for(const field of ['geographyNote','geographyCheckedOn','geographySources'])assert.equal(Object.hasOwn(place,field),false);
 }
 const known=currentGeographyPlace(restored.progress.favoritePlaces.BEN,countries,capitals);
 assert.equal(known.capital,'Porto-Novo');assert.notEqual(known.geographyNote,forged.geographyNote);
 assert.ok(known.geographySources.every(s=>s.url.startsWith('https://')));
 assert.deepEqual(currentGeographyPlace(restored.progress.favoritePlaces['old-custom'],countries,capitals),restored.progress.favoritePlaces['old-custom']);
 assert.deepEqual(restored.progress.notes,save.progress.notes);assert.deepEqual(restored.progress.favorites,save.progress.favorites);
 assert.deepEqual(restored.progress.gameSessions.memory,save.progress.gameSessions.memory);
 assert.deepEqual(save,before,'import and current view leave original input untouched');
});
