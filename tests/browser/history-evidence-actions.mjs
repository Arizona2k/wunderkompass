// Specific real model actions and independent expectations for the selected history wave.
import assert from 'node:assert/strict';
export const HISTORY_REGION_NAMES={
 'history-khipu':'Geschichtsdetektiv: Zahl und Bedeutung unterscheiden','history-mohenjo-daro':'Geschichtsdetektiv','history-bronze':'Geschichtsdetektiv',
 'history-kilwa':'Geschichtsdetektiv: mögliche Handelswege','history-timbuktu':'Geschichtsdetektiv: Abschrift und Text','history-angkor':'Angkor untersuchen','history-polynesia':'Richtungshinweise untersuchen','history-caral':'Geschichtsdetektiv: Bauform, Bezugsfläche und Datierung','history-nalanda':'Geschichtsdetektiv: Lernen und historische Spuren in Nalanda','history-hattusha':'Geschichtsdetektiv: Schrift, Sprache und Material unterscheiden','history-paper':'Geschichtsdetektiv: Papier formen und Belege unterscheiden','history-writing':'Geschichtsdetektiv: Zeichen, Klang und Deutung','history-printing':'Geschichtsdetektiv: Druckform, Abzüge und Belege','history-rosetta':'Geschichtsdetektiv: Textfassungen als Hinweise','history-catalhoyuk':'Geschichtsdetektiv: Hauszugang und Hausphasen','history-cahokia':'Geschichtsdetektiv: Erdhügel, Bauabschnitte und Schätzungen'};
const click=(root,name)=>root.getByRole('button',{name,exact:true}).click();
export async function exerciseSelectedHistoryModel(page,root,id,level){
 switch(id){
 case'history-kilwa':{
  const route=root.getByRole('list',{name:'Ein möglicher Weg der gedachten Schale'});if(await root.getByRole('button',{name:'Möglichkeit ohne Zwischenhalt zeigen',exact:true}).count())await click(root,'Möglichkeit ohne Zwischenhalt zeigen');assert.equal(await route.locator('li').count(),2);await click(root,'Möglichen Zwischenhalt zeigen');assert.equal(await route.locator('li').count(),3);assert.match(await route.innerText(),/Ort A · Herstellungsort/);assert.match(await route.innerText(),/Ort C · Fundort/);
  if(level===2){if(await root.getByRole('button',{name:'Erfundene Zusatznotiz schließen',exact:true}).count())await click(root,'Erfundene Zusatznotiz schließen');await click(root,'Erfundene Zusatznotiz öffnen');assert.match(await root.locator('.kilwa-evidence-note').innerText(),/noch ungeklärt/);}break;
 }
 case'history-timbuktu':{
  if(level===0){if(await root.getByRole('button',{name:'Abschrift B zurückändern',exact:true}).count())await click(root,'Abschrift B zurückändern');assert.equal(await root.locator('[data-timbuktu-copy=B] [data-copy-content]').innerText(),'3 + 4 = 7');await click(root,'Abschrift B ändern');assert.equal(await root.locator('[data-timbuktu-copy=B] [data-copy-content]').innerText(),'3 + 4 = 8');assert.equal(await root.locator('[data-timbuktu-copy=A] [data-copy-content]').innerText(),'3 + 4 = 7');}
  if(level===1){if(await root.getByRole('button',{name:'Abschriftjahre ausblenden',exact:true}).count())await click(root,'Abschriftjahre ausblenden');for(const card of await root.locator('[data-timbuktu-copy]').all())assert.match(await card.innerText(),/Abschriftjahr im Lernbild: ausgeblendet/);await click(root,'Erfundene Abschriftjahre zeigen');assert.match(await root.locator('[data-timbuktu-copy=A]').innerText(),/1690/);assert.match(await root.locator('[data-timbuktu-copy=B]').innerText(),/1760/);}break;
 }
 case'history-angkor':{
  if(level<2){const select=root.getByRole('combobox',{name:'Weitergeleitete Marken',exact:true});await select.selectOption(level===0?'2':'6');assert.match(await root.locator('figcaption').innerText(),level===0?/Im Becken: 4[\s\S]*Weitergeleitet: 2[\s\S]*Zusammen: 6 Marken/:/Im Becken: 0[\s\S]*Weitergeleitet: 6[\s\S]*Zusammen: 6 Marken/);if(level===1){await select.selectOption('3');assert.match(await root.locator('figcaption').innerText(),/Im Becken: 3[\s\S]*Weitergeleitet: 3[\s\S]*Zusammen: 6 Marken/);}}
  else{await click(root,'Nur die Bildspur');assert.match(await root.getByRole('status').innerText(),/Deutung bleibt offen/);await click(root,'Eine Untersuchung ergänzen');assert.match(await root.getByRole('status').innerText(),/bestätigt hier einen gebauten Wasserweg/);}break;
 }
 case'history-polynesia':{
  if(level===0){for(const [direction,relative]of[['Norden','rechts'],['Osten','vorne'],['Süden','links'],['Westen','hinten']]){await click(root,'Blick nach '+direction);assert.match(await root.getByRole('img').getAttribute('aria-label'),new RegExp('Boot blickt nach '+direction+'.*Sicht '+relative));}}
  if(level===1){await click(root,'Wellenmuster unklar');assert.match(await root.getByRole('status').innerText(),/nicht mehr klar zu erkennen/);await click(root,'Geprüfter Dünungshinweis');assert.match(await root.getByRole('status').innerText(),/weiterhin beständig/);}break;
 }
 case'history-caral':{
  if(level===0){await click(root,'Plattform wählen');assert.match(await root.getByRole('img').getAttribute('aria-label'),/über die Bodenlinie/);await click(root,'Abgesenkten Platz wählen');assert.match(await root.getByRole('img').getAttribute('aria-label'),/unter der Bodenlinie/);}
  else if(level===1){assert.match(await root.locator('.caral-evidence-areas').innerText(),/65 Hektar[\s\S]*626 Hektar/);const widths=await root.locator('.caral-evidence-bar span').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().width));assert.equal(widths.length,2);assert(Math.abs(widths[0]/widths[1]-65/626)<0.002,'actual different reference areas, no invented city plan');}
  else{const group=root.getByRole('group',{name:'Fragen zum gedachten Fundfall'});const feedbacks=[/datiert nicht die ganze Stadt/,/Nähe allein reicht nicht/,/Gehört die Spur tatsächlich zum Bau/];for(let i=0;i<3;i++){await group.getByRole('button').nth(i).click();assert.match(await root.getByRole('status').innerText(),feedbacks[i]);}}break;
 }
 case'history-nalanda':{
  if(level===0){await click(root,'Wohnen zeigen');assert.match(await root.getByRole('img').getAttribute('aria-label'),/Funktion Wohnen/);await click(root,'Lernen zeigen');assert.match(await root.getByRole('img').getAttribute('aria-label'),/Funktion Lernen/);}
  else if(level===1){if(await root.getByRole('button',{name:'Ältere Fundspur ausblenden',exact:true}).count())await click(root,'Ältere Fundspur ausblenden');assert.equal(await root.locator('.nalanda-evidence-periods li').count(),1);await click(root,'Ältere Fundspur einblenden');assert.equal(await root.locator('.nalanda-evidence-periods li').count(),2);assert.match(await root.locator('.nalanda-evidence-periods').innerText(),/3. Jahrhundert vor Christus[\s\S]*5. bis ins 13. Jahrhundert nach Christus/);}
  else{if(await root.getByRole('button',{name:'Schutzlage im Schema ausblenden',exact:true}).count())await click(root,'Schutzlage im Schema ausblenden');assert.match(await root.getByRole('img').getAttribute('aria-label'),/Schutzlage ist ausgeblendet/);await click(root,'Spätere Schutzlage im Schema zeigen');assert.match(await root.getByRole('img').getAttribute('aria-label'),/Zwei ältere Ziegellagen.*spätere Schutzlage/);}break;
 }
 case'history-hattusha':{
  await root.getByRole('combobox',{name:'Heutiges Wortpaar',exact:true}).selectOption('2');assert.deepEqual(await root.locator('.hattusha-language-word').allTextContents(),['Buch','Book']);
  if(level===1){if(await root.getByRole('button',{name:'Sprachnamen zeigen',exact:true}).count())await click(root,'Sprachnamen zeigen');await click(root,'Sprachnamen ausblenden');assert.equal(await root.getByText('Sprachname ausgeblendet',{exact:true}).count(),2);assert.equal(await root.getByText('Schrift: lateinisch',{exact:true}).count(),2);}
  if(level===2){if(await root.getByRole('button',{name:'Auf Papier zeigen',exact:true}).count())await click(root,'Auf Papier zeigen');await click(root,'Auf Bildschirm zeigen');assert.equal(await root.locator('[data-hattusha-medium]').getAttribute('data-hattusha-medium'),'screen');assert.deepEqual(await root.locator('.hattusha-language-word').allTextContents(),['Buch','Book']);}break;
 }
 case'history-paper':{
  const steps=root.getByRole('group',{name:'Gezeigter Arbeitsschritt'});
  if(level===0){for(let i=0;i<3;i++){await steps.getByRole('button').nth(i).click();assert.equal(await root.locator('[data-paper-step]').getAttribute('data-paper-step'),String(i));assert((await root.getByRole('img').getAttribute('aria-label')).length>100);}}
  if(level===1){await steps.getByRole('button').nth(1).click();await click(root,'Sieb mit Öffnungen');assert.equal(await root.locator('[data-paper-base]').getAttribute('data-paper-base'),'sieve');await click(root,'Geschlossene Platte');assert.equal(await root.locator('[data-paper-base]').getAttribute('data-paper-base'),'closed');assert.match(await root.locator('figcaption').innerText(),/Verdunstung.*nicht ausgeschlossen/);}
  if(level===2){if(await root.getByRole('button',{name:'Verbesserungsbericht zeigen',exact:true}).count())await click(root,'Verbesserungsbericht zeigen');await click(root,'Älteren Fundbeleg zeigen');assert.match(await root.locator('.paper-forming-source-case').innerText(),/140 bis 86 v. Chr/);await click(root,'Verbesserungsbericht zeigen');assert.match(await root.locator('.paper-forming-source-case').innerText(),/Für 105.*verbesserten Verfahrens/);}break;
 }
 case'history-writing':{
  if(level===0){for(const [name,key,meaning]of[['Schlüssel offenlassen','0',/nicht sicher drei bestimmte Dinge/],['Beispiel: Getreidesäcke','1',/drei Getreidesäcke/],['Beispiel: Personen','2',/drei Personen/]]){await click(root,name);assert.equal(await root.locator('[data-writing-placeholder]').count(),3);assert.equal(await root.locator('[data-writing-key]').getAttribute('data-writing-key'),key);assert.match(await root.locator('[data-writing-key]').innerText(),meaning);}}
  else if(level===1){await click(root,'Das Bild benennen');assert.equal(await root.locator('[data-writing-rebus]').getAttribute('data-writing-rebus'),'picture');await click(root,'Den Wortklang nutzen');assert.equal(await root.locator('[data-writing-rebus]').getAttribute('data-writing-rebus'),'word');assert.match(await root.locator('[data-writing-rebus]').innerText(),/^BEIN:/);}
  else{if(await root.getByRole('button',{name:'Wieder die Beobachtung zeigen',exact:true}).count())await click(root,'Wieder die Beobachtung zeigen');await click(root,'Museumstext und Grenze vergleichen');assert.match(await root.locator('.writing-source-case').innerText(),/1988.433.1 vermutlich/);}break;
 }
 case'history-printing':{
  if(level===0){await click(root,'Modellabzüge zurücksetzen');const word=await root.locator('[data-printing-template]').getAttribute('data-printing-template');assert(['BAD','DAB'].includes(word));for(let i=1;i<=3;i++){await click(root,'Einen Modellabzug hinzufügen');assert.equal(await root.locator('[data-printing-impression]').count(),i);assert.deepEqual(await root.locator('[data-printing-impression]').allTextContents(),Array(i).fill(word));}assert.equal(await root.getByRole('button',{name:'Einen Modellabzug hinzufügen',exact:true}).getAttribute('aria-disabled'),'true');}
  else if(level===1){await click(root,'Anordnung BAD');assert.equal(await root.locator('[data-printing-template]').getAttribute('data-printing-template'),'BAD');await click(root,'Anordnung DAB');assert.equal(await root.locator('[data-printing-template]').getAttribute('data-printing-template'),'DAB');assert.deepEqual(await root.locator('.printing-type-pool li').allTextContents(),['B','A','D']);}
  else{await click(root,'Vorlage BDA');for(let i=0;i<3;i++)await click(root,'Einen Modellabzug hinzufügen');assert.deepEqual(await root.locator('[data-printing-impression]').allTextContents(),['BDA','BDA','BDA']);await click(root,'Vorlage BAD');assert.equal(await root.locator('[data-printing-impression]').count(),0);await click(root,'Einen Modellabzug hinzufügen');assert.deepEqual(await root.locator('[data-printing-impression]').allTextContents(),['BAD']);}break;
 }
 case'history-rosetta':{
  if(await root.getByRole('button',{name:'Vergleichsfassung schließen',exact:true}).count())await click(root,'Vergleichsfassung schließen');await click(root,'Vergleichsfassung ansehen');assert.equal(await root.locator('[data-rosetta-comparison] blockquote').innerText(),level===1?'Mira erhält von der Stadt Korn.':'Die Stadt erhält Korn von Mira.');
  if(level===1){await click(root,'Den Namenshinweis ansehen');assert.match(await root.locator('.rosetta-name-clue').innerText(),/Mira/);}if(level===2)assert.equal(await root.locator('.rosetta-gap').getAttribute('aria-label'),'Beschädigte Stelle, Wörter unbekannt');break;
 }
 case'history-catalhoyuk':{
  await click(root,['Zugangsweg markieren','Spätere Hausphase ergänzen','Vermuteten Aufbau wechseln'][level]);const attr=['data-catalhoyuk-roof-path','data-catalhoyuk-later-phase','data-catalhoyuk-hypothetical-height'][level];assert.equal(await root.locator('svg').getAttribute(attr),level===2?'higher':'true');break;
 }
 case'history-cahokia':{
  await click(root,['Gedachten Schnitt öffnen','Weitere Lernlagen zeigen','Anderes Ende der Schätzung markieren'][level]);if(level<2){assert.equal(await root.locator('svg').getAttribute('data-cahokia-cutaway'),'true');assert.equal(await root.locator('svg').getAttribute('data-cahokia-layers'),'three');}else{assert.equal(await root.locator('.cahokia-estimate-labels strong[data-current=true]').innerText(),'20.000');assert.deepEqual(await root.locator('.cahokia-estimate-labels strong').allTextContents(),['10.000','20.000']);}break;
 }
 default:throw Error('No independently authored action contract for '+id);
 }
 if(!(id==='history-caral'&&level===2))await click(root,'Meine Überlegung vergleichen');const status=root.getByRole('status').last();await status.waitFor();assert((await status.innerText()).length>80,'specific meaningful feedback, not a bare success label');
 const current=await page.evaluate(()=>history.state.wunderHistoryEvidence);assert.equal(current.id,id);assert.equal(current.level,level);return {id,level,actualState:current,meaningfulModelAction:true,specificReflection:true};
}
