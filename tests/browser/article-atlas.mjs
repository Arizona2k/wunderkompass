import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const topics=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
const examples=['animal-polar-bear','history-maya','person-grace_hopper','invention-car','building-taj-mahal','science-moon-phases','science-tides','science-currents'];
const drawingAlts={
 'science-moon-phases':'Vier ausgewählte Mondphasen: Neumond, zunehmender Halbmond, Vollmond und abnehmender Halbmond.',
 'science-tides':'Dieselbe schematische Küste bei niedrigem und hohem Wasserstand.',
 'science-currents':'Drei Antriebe für Meeresströmungen: Wind, Gezeiten und Dichteunterschiede.'
};

async function readableLabels(labels){
 for(const label of await labels.all())assert.equal(await label.evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=16&&el.scrollWidth<=el.clientWidth+1),true,'HTML diagram label readable without clipping');
}

export async function articleAtlas(page,ready,report,width,shots){
 const open=async id=>{await page.evaluate(id=>location.hash='world/topic/'+id,id);await page.locator('#world-topic-title').filter({hasText:topics.find(t=>t.id===id).title}).waitFor();await page.locator('.article-wayfinder').waitFor();await page.waitForTimeout(100);};
 // This function is serialized in the page; do not rely on Node helpers there.
 const decode=async()=>{for(const image of await page.locator('.article-atlas img').all())await image.evaluate(async el=>{await el.decode();if(!el.naturalWidth)throw Error('Image not decoded')});};
 await page.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});
 for(const id of examples){
  await open(id);await decode();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'article overflow '+id+' / '+width);
  const art=page.locator('.article-atlas'),nav=art.getByRole('navigation',{name:'In dieser Entdeckerkarte'});
  if(drawingAlts[id]){
   await art.getByRole('img',{name:drawingAlts[id],exact:true}).waitFor();
   await readableLabels(art.locator('.topic-diagram-label'));
   if(id==='science-moon-phases'&&width<700)assert.equal(await art.locator('.moon-diagram').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),2,'mobile phases in two columns');
  }
  for(const [name,selector] of [['Kurz erklärt','.world-short'],['Mini-Frage','.world-mini-question'],['Weiterentdecken','.article-network']]){
   const button=nav.getByRole('button',{name:new RegExp(name+'$')});
   if(width===390)await button.tap();else {await button.focus();await page.keyboard.press('Enter')}
   assert.equal(await art.locator(selector).evaluate(el=>el===document.activeElement),true,id+' jump focus '+name);
   assert.equal(new URL(page.url()).hash,'#world/topic/'+id,'jump preserves direct link');
  }
  if(await nav.getByRole('button',{name:/Ausprobieren$/}).count()){
   await nav.getByRole('button',{name:/Ausprobieren$/}).click();assert.equal(await art.locator('.article-experiment').evaluate(el=>el===document.activeElement),true);
  }
  const violations=await page.evaluate(async()=>{const r=await window.axe.run('.article-atlas',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))});
  assert.deepEqual(violations,[],id+' axe '+width);
 }
 await open('science-tides');const tide=page.locator('.tide-comparison');
 await tide.getByRole('button',{name:'Hochwasser',exact:true}).click();await tide.getByText('Der hohe Wasserstand bedeckt hier mehr Küstenfläche.',{exact:true}).waitFor();assert.match(await tide.locator('svg').getAttribute('aria-label'),/Hochwasser/);
 await tide.getByRole('button',{name:'Niedrigwasser',exact:true}).focus();await page.keyboard.press('Enter');await tide.getByText('Beim niedrigen Wasserstand liegt hier mehr Küstenfläche frei.',{exact:true}).waitFor();assert.equal(await tide.getByRole('button',{name:'Niedrigwasser',exact:true}).getAttribute('aria-pressed'),'true');
 await readableLabels(tide.locator('.tide-diagram-label'));
 const skip=page.locator('.skip-link');
 assert.equal(await skip.evaluate(el=>el===document.activeElement),false,'comparison focus stays on water control');
 assert.equal(await skip.evaluate(el=>getComputedStyle(el).clipPath),'inset(50%)','unfocused skip link completely clipped, including element captures');
 await page.locator('.article-hero').screenshot({path:shots+'/article-tides-'+width+'.png'});await tide.screenshot({path:shots+'/tide-comparison-'+width+'.png'});
 if(width<700){
  await skip.focus();await page.waitForFunction(()=>getComputedStyle(document.querySelector('.skip-link')).clipPath==='none');
  await page.screenshot({path:shots+'/skip-navigation-focused-'+width+'.png'});
  await page.keyboard.press('Enter');assert.equal(await page.locator('#learning-main').evaluate(el=>el===document.activeElement),true,'skip Enter focuses main');
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.skip-link')).clipPath==='inset(50%)');
  assert.equal(new URL(page.url()).hash,'#world/topic/science-tides','skip preserves topic hash');
  await page.locator('.article-wayfinder').getByRole('button',{name:/Ausprobieren$/}).focus();await page.keyboard.press('Enter');
  await page.screenshot({path:shots+'/tide-comparison-viewport-'+width+'.png'});
 }
 await open('science-moon-phases');const topic=topics.find(t=>t.id==='science-moon-phases'),question=page.locator('.world-mini-question');
 const readPass=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress);
 // Fresh contexts start without solved article answers. Verify no solution or
 // earned learning mark on a wrong attempt, including reload and recovery.
 const wrong=topic.question.answers.find((_,i)=>i!==topic.question.correct);
 const answer=question.locator('.quiz-answer').filter({has:page.getByText(topic.question.answers[topic.question.correct],{exact:true})});
 if(!await answer.isDisabled()){
  const hint=question.locator('.world-game-hint');await hint.locator('summary').click();assert.equal(await hint.locator('p').count()>0,true);assert.equal(await question.getByText(topic.question.why,{exact:true}).count(),0);
  await question.locator('.quiz-answer').filter({has:page.getByText(wrong,{exact:true})}).click();
  await question.getByText('Überlege noch einmal.',{exact:true}).waitFor();assert.equal(await question.getByText(topic.question.why,{exact:true}).count(),0);assert.equal((await readPass()).discoveries.includes('learned:'+topic.id),false);
  await page.reload();await ready(page);await question.getByText('Überlege noch einmal.',{exact:true}).waitFor();assert.equal(await question.getByText(topic.question.why,{exact:true}).count(),0);
  await answer.click();assert.equal(await question.locator('.world-game-hint').count(),0);await question.getByText(topic.question.why,{exact:true}).waitFor();assert.ok((await readPass()).discoveries.includes('learned:'+topic.id));
  await page.reload();await ready(page);assert.equal(await answer.isDisabled(),true);
 }
 await page.locator('.article-wayfinder').getByRole('button',{name:/Weiterentdecken$/}).click();
 await page.locator('.article-routes').getByRole('button',{name:'Vom Mond bis zum Meer',exact:true}).click();await page.locator('.world-route-stations').waitFor();assert.equal(new URL(page.url()).hash,'#world/route/moon-to-sea');await page.locator('.article-atlas .article-wayfinder').getByRole('button',{name:/Ausprobieren$/}).click();assert.equal(await page.locator('.article-experiment').evaluate(el=>el===document.activeElement),true,'embedded route jump');
 await page.goBack();await page.locator('.article-hero').waitFor();assert.equal(new URL(page.url()).hash,'#world/topic/science-moon-phases');
 await page.locator('.article-hero').screenshot({path:shots+'/article-moon-'+width+'.png'});
 await page.locator('.topic-illustration').screenshot({path:shots+'/moon-diagram-'+width+'.png'});
 if(width===1440){
  for(const t of topics){await page.evaluate(id=>location.hash='world/topic/'+id,t.id);await page.getByRole('heading',{name:t.title,exact:true}).waitFor();if(t.history?.sensitive)await page.getByRole('button',{name:'Die Erklärung anschauen',exact:true}).click();await page.locator('.article-atlas').waitFor();await decode();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'catalog overflow '+t.id)}
  report.checks.push('All 116 article shells opened at 1440px including voluntary sensitive entry; images decoded and no horizontal overflow');
 }
 if(width===320){
  await open('science-moon-phases');await page.locator('.earth-app').evaluate(el=>el.classList.add('large-reading'));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'large reading 320');await page.locator('.article-wayfinder').getByRole('button',{name:/Mini-Frage$/}).click();await page.screenshot({path:shots+'/article-large-reading-320.png'});await page.locator('.earth-app').evaluate(el=>el.classList.remove('large-reading'));
 }
 report.checks.push('Article atlas '+width+': six categories and three scientific drawings with readable 16px HTML labels and original alternative texts, mobile two-column phases, clipped unfocused skip link and keyboard activation, keyboard/touch jumps and focus, unchanged hash, axe A/AA, wrong/right/reload mini question, coastal comparison, direct learning route and embedded focus');
}

export async function offlineArticleAtlas(page,report){
 await page.evaluate(()=>location.hash='world/topic/science-tides');await page.locator('.tide-comparison').waitFor();await page.locator('.article-wayfinder').getByRole('button',{name:/Ausprobieren$/}).click();assert.equal(await page.locator('.article-experiment').evaluate(el=>el===document.activeElement),true);await page.locator('.tide-comparison').getByRole('button',{name:'Hochwasser',exact:true}).click();await page.getByText('Der hohe Wasserstand bedeckt hier mehr Küstenfläche.',{exact:true}).waitFor();
 await page.evaluate(()=>location.hash='world/topic/science-moon-phases');await page.locator('.world-mini-question .world-game-hint').waitFor();await page.locator('.world-mini-question .world-game-hint summary').click();assert.ok(await page.locator('.world-mini-question .world-game-hint p').innerText());await page.getByRole('img',{name:drawingAlts['science-moon-phases'],exact:true}).waitFor();assert.equal(await page.locator('.topic-illustration svg').count(),4);await readableLabels(page.locator('.topic-diagram-label'));
 report.checks.push('New article drawings, wayfinder, individual mini hint and coastal comparison work after actual cold offline restart');
}
