import assert from 'node:assert/strict';import fs from 'node:fs/promises';import path from 'node:path';
import {RESEARCH_QUESTIONS} from '../../app/research-catalog.ts';
import {NEWS_ENTRIES} from '../../app/news-data.ts';
const labs=JSON.parse(await fs.readFile(new URL('../../exports/content/laboratories.json',import.meta.url),'utf8'));
const experiments=JSON.parse(await fs.readFile(new URL('../../exports/content/home-experiments.json',import.meta.url),'utf8'));
const saveKey='erde-entdecken:save:v3';
async function geometry(p,label){
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,label+' horizontal overflow');
 const clipped=await p.locator('.research-workbench h2,.research-workbench h3,.research-workbench h4,.research-workbench p,.research-workbench label,.research-workbench button,.research-workbench summary,.research-links a,.news-page p,.news-page h1,.news-page h2,.news-page a,.news-page summary,.lab-search label').evaluateAll(elements=>elements.flatMap(el=>{
  if(!el.getClientRects().length||el.closest('details:not([open])')&&!el.closest('summary'))return [];
  const walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),bad=[];
  while(walk.nextNode()){const node=walk.currentNode;if(!node.textContent.trim()||!node.parentElement.getClientRects().length||node.parentElement.closest('svg'))continue;
   const range=document.createRange();range.selectNodeContents(node);for(const r of range.getClientRects())if(r.width>0&&(r.left< -2||r.right>innerWidth+2))bad.push(node.textContent.trim().slice(0,70));
  }return bad;
 }));assert.deepEqual(clipped,[],label+' visible text stays within viewport');
}
async function axe(p,selector,label){
 await p.addScriptTag({path:new URL('../../qa/node_modules/axe-core/axe.min.js',import.meta.url).pathname});
 const errors=await p.evaluate(async selector=>{const result=await window.axe.run({include:[[selector]]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));},selector);assert.deepEqual(errors,[],label+' WCAG axe');
}
export async function researchNewsFlow(browser,base,ready,monitor,report,shots){
 for(const width of [320,360,390,768,1024,1440,1920]){
  const context=await browser.newContext({viewport:{width,height:width<768?844:1000},hasTouch:width<768,isMobile:width<768,reducedMotion:'reduce',acceptDownloads:true}),p=await context.newPage();monitor(p);p.setDefaultTimeout(20000);await p.goto(base+'/#labs');await ready(p);await p.locator('.research-tile').first().waitFor();
  assert.equal(await p.locator('.research-tile').count(),11);assert.equal(await p.locator('.experiment-card').count(),6);
  await p.locator('.lab-search input').fill('vulkan');assert.equal(await p.locator('.research-tile').count(),1);assert.equal(await p.locator('.experiment-card').count(),1);await p.locator('.lab-search input').fill('not-a-real-lab');await p.getByRole('button',{name:'Alle Labore zeigen',exact:true}).click();
  await p.screenshot({path:path.join(shots,'research-overview-'+width+'.png'),fullPage:true,animations:'disabled'});
  for(const lab of labs){
   const card=p.locator('[data-lab-id="'+lab.id+'"]');if(width<768)await card.tap();else{await card.focus();await p.keyboard.press('Enter');}
   await p.locator('#lab-heading').waitFor();assert.equal(new URL(p.url()).hash,'#labs/'+lab.id);await geometry(p,lab.id+' '+width);
   if([320,1440].includes(width)){
    await p.locator('.research-prediction>summary').click();await p.locator('.research-prediction textarea').fill('Synthetische Vermutung: Ich ändere nur eine Bedingung.');
    await p.getByRole('button',{name:'Beobachtung A merken',exact:true}).click();await p.waitForFunction(([key,id])=>!!JSON.parse(localStorage.getItem(key))?.progress.gameSessions['lab:'+id]?.researchCompareA,[saveKey,lab.id]);
    const before=await p.evaluate(([key,id])=>JSON.stringify(JSON.parse(localStorage.getItem(key)).progress.gameSessions['lab:'+id]),[saveKey,lab.id]);
    const slider=p.locator('.research-workbench').getByRole('slider').first();await slider.focus();await p.keyboard.press('End');
    await p.waitForFunction(([key,id,before])=>JSON.stringify(JSON.parse(localStorage.getItem(key)).progress.gameSessions['lab:'+id])!==before,[saveKey,lab.id,before]);
    await p.getByRole('button',{name:'Beobachtung B merken',exact:true}).click();await p.locator('.research-observations').getByText(/Modellbedingungen unterscheiden/).waitFor();
    for(const level of ['easy','medium','hard']){
     await p.locator('.research-levels button').nth(['easy','medium','hard'].indexOf(level)).click();const q=level==='easy'?{prompt:lab.q,...lab}:RESEARCH_QUESTIONS[lab.id][level],question=p.locator('.research-question');
     await question.locator('summary').click();assert.ok((await question.innerText()).includes(level==='easy'?'Ein Denkhinweis':q.hint));
     const answers=question.locator('.quiz-answer');await answers.nth((q.correct+1)%q.answers.length).click();await question.getByText('Schau noch einmal genau hin',{exact:true}).waitFor();assert.equal(await question.getByText(q.why,{exact:true}).count(),0,'wrong answer does not reveal full explanation');
     await answers.nth(q.correct).click();await question.getByText('Gut erklärt · Forscherstempel verdient',{exact:true}).waitFor();await question.getByText(q.why,{exact:true}).waitFor();
    }
    await p.locator('.research-next details').first().locator('summary').click();await p.locator('.research-mission-checks input').first().check();await p.locator('.research-next details').nth(1).locator('summary').click();await p.locator('.research-next textarea').fill('Synthetische Erklärung für die Prüfung.');
    await p.waitForFunction(([key,id])=>JSON.parse(localStorage.getItem(key))?.progress.gameSessions['lab:'+id]?.researchJournal==='Synthetische Erklärung für die Prüfung.',[saveKey,lab.id]);
    const saved=await p.evaluate(([key,id])=>JSON.parse(localStorage.getItem(key)).progress.gameSessions['lab:'+id],[saveKey,lab.id]);await p.reload();await ready(p);await p.locator('#lab-heading').waitFor();assert.deepEqual(await p.evaluate(([key,id])=>JSON.parse(localStorage.getItem(key)).progress.gameSessions['lab:'+id],[saveKey,lab.id]),saved,'all model/mission/answers/journal fields survive real reload');
    const next=p.locator('.research-links [data-route-focus="lab-next-'+lab.id+'"]');await next.focus();await p.keyboard.press('Enter');await p.locator('#lab-heading').waitFor();await p.goBack();await p.waitForFunction(id=>document.activeElement?.dataset.routeFocus==='lab-next-'+id&&document.activeElement.matches(':focus-visible'),lab.id);
    await axe(p,'.research-workbench',lab.id+' '+width);
   }
   if([320,360,390,768,1440].includes(width)){
    await p.locator('#lab-heading').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await p.screenshot({path:path.join(shots,'research-'+lab.id+'-'+width+'-top.png'),animations:'disabled'});
    await p.locator('.research-workbench').screenshot({path:path.join(shots,'research-'+lab.id+'-'+width+'-full.png'),animations:'disabled'});
    await p.locator('.research-model-stage').screenshot({path:path.join(shots,'research-'+lab.id+'-'+width+'-model.png'),animations:'disabled'});
    for(const [i,section] of (await p.locator('.research-measurements').all()).entries())await section.screenshot({path:path.join(shots,'research-'+lab.id+'-'+width+'-measurements-'+i+'.png'),animations:'disabled'});
   }
   await p.getByRole('button',{name:'Alle Experimente',exact:true}).click();await p.locator('.research-tile').first().waitFor();
  }
  for(let i=0;i<experiments.length;i++){
   const item=p.locator('.experiment-card').nth(i);await item.locator('summary').click();await item.getByText('Gemeinsam und sicher:',{exact:true}).waitFor();assert.ok((await item.innerText()).includes('Vermuten:')&&(await item.innerText()).includes('Modellgrenze:'));
   await item.getByRole('button',{name:'Als gemeinsam gemacht markieren',exact:true}).click();await item.getByRole('button',{name:'Markierung entfernen',exact:true}).waitFor();
   if(width===320||width===1440)await item.screenshot({path:path.join(shots,'research-experiment-'+i+'-'+width+'.png'),animations:'disabled'});
  }
  await p.evaluate(()=>location.hash='news');await p.locator('.news-page').waitFor();assert.equal(await p.locator('.news-page>section .news-article').count(),3);await p.locator('.news-archive>summary').click();assert.equal(await p.locator('.news-archive .news-article').count(),1);await p.locator('.news-article').first().locator('summary').click();await geometry(p,'news expanded '+width);await axe(p,'.news-page','news '+width);
  await p.screenshot({path:path.join(shots,'news-expanded-'+width+'.png'),fullPage:true,animations:'disabled'});
  const link=p.locator('.news-article').first().getByRole('heading').getByRole('link');await link.focus();await p.keyboard.press('Enter');await p.locator('#news-title').waitFor();await p.reload();await ready(p);await p.locator('.news-page .news-article').waitFor();assert.equal(await p.locator('.news-sources a').count(),NEWS_ENTRIES[0].sources.length);
  await p.locator('.news-article [data-route-focus^="news-topic-"]').click();await p.locator('.world-mini-question').waitFor();await p.goBack();await p.waitForFunction(()=>document.activeElement?.dataset.routeFocus?.startsWith('news-topic-'));
  if(width===320||width===1440){await p.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await p.getByRole('button',{name:'Pass sichern',exact:true}).click();await p.getByRole('switch',{name:'Größere Schrift',exact:true}).click();await p.keyboard.press('Escape');await p.getByRole('dialog').waitFor({state:'hidden'});await geometry(p,'news large '+width);await p.screenshot({path:path.join(shots,'news-large-'+width+'.png'),fullPage:true});await p.evaluate(()=>location.hash='labs/moon');await p.locator('#lab-heading').waitFor();await geometry(p,'moon large '+width);await p.locator('.research-workbench').screenshot({path:path.join(shots,'research-large-'+width+'.png')});}
  report.checks.push('2B '+width+': all eleven labs, real Touch/keyboard, search/filter, readable models, six safe practical experiments, news/details/archive/source/knowledge links and Back'+([320,1440].includes(width)?', all 33 inquiry questions with wrong/right/hints, A/B, actual model/mission/journal reload, visible opener focus, WCAG axe and large text':''));
  console.log('2B browser',width);await context.close();
 }
 // Real module latency: dialog and meaningful feedback appear before download.
 const context=await browser.newContext({viewport:{width:320,height:844},hasTouch:true,isMobile:true}),p=await context.newPage();monitor(p);await p.goto(base);await ready(p);
 let release;const hold=new Promise(resolve=>{release=resolve;});await p.route('**/global-search-*.js',async route=>{await hold;await route.continue();});
 const opener=p.getByRole('button',{name:'Was möchtest du entdecken?',exact:true});await opener.tap();await p.getByRole('dialog').waitFor();await p.getByRole('dialog').getByText(/Die Suche kommt gleich/).waitFor();await p.screenshot({path:path.join(shots,'search-immediate-loading-320.png')});release();await p.getByRole('dialog').locator('input').waitFor();await p.keyboard.press('Escape');await p.getByRole('dialog').waitFor({state:'hidden'});assert.equal(await opener.evaluate(el=>el===document.activeElement),true);
 for(const [term,type] of [['Vulkan-Werkstatt','lab:volcano'],['Tröpfchen am kalten Glas','experiment:condensation'],['Ein Wort für absichtliches Wütendmachen','news:ragebait-word-2026']]){await p.getByRole('button',{name:'Lernwelt durchsuchen',exact:true}).click();await p.getByRole('dialog').locator('input').fill(term);await p.getByRole('option').filter({hasText:term}).first().click();await p.waitForFunction(([type])=>location.hash.startsWith('#'+({lab:'labs/',experiment:'labs/experiment/',news:'news/'}[type.split(':')[0]])+type.split(':')[1]),[type]);await p.reload();await ready(p);}
 await context.close();report.checks.push('2B search: actual delayed-module dialog/loading feedback, touch, Escape/opener return, all new result types, direct navigation and reload');
}
export async function offlineResearchNews(page,report){
 await page.evaluate(()=>location.hash='labs/moon');await page.locator('#lab-heading').waitFor();await page.getByRole('button',{name:'Etwa einen Tag weiter',exact:true}).click();await page.locator('.research-measurements').waitFor();await geometry(page,'cold offline moon');
 await page.evaluate(()=>location.hash='news');await page.locator('.news-page').waitFor();await page.locator('.news-archive>summary').click();assert.equal(await page.locator('.news-archive .news-article').count(),1);await page.locator('.news-article').first().getByRole('heading').getByRole('link').click();await page.locator('.news-sources a').first().waitFor();
 report.checks.push('2B cold offline restart: interactive moon alignment/model, dated news explanations, archive, local navigation and retained original source links (external originals need network)');
}
