import assert from 'node:assert/strict';

export async function assertGameNumberLabels(svg,count,minimum=16){
 const geometry=await svg.evaluate(svg=>{const v=svg.viewBox.baseVal;return{viewBox:{x:v.x,y:v.y,width:v.width,height:v.height},labels:[...svg.querySelectorAll('text')].map(el=>{const b=el.getBBox(),m=el.getScreenCTM();return{text:el.textContent,x:b.x,y:b.y,width:b.width,height:b.height,effectiveFont:parseFloat(getComputedStyle(el).fontSize)*Math.hypot(m.c,m.d)};})};});
 assert.equal(geometry.labels.length,count);
 for(const label of geometry.labels){assert(label.effectiveFont>=minimum-.1,'visible SVG number font is at least '+minimum+'CSS pixels: '+JSON.stringify(label));assert(label.x>=geometry.viewBox.x&&label.y>=geometry.viewBox.y&&label.x+label.width<=geometry.viewBox.x+geometry.viewBox.width&&label.y+label.height<=geometry.viewBox.y+geometry.viewBox.height,'number stays inside its actual SVG viewBox');}
 return geometry;
}

export async function gameNumberLabelView(page,report,{shots=null}={}){
 for(const [id,name,selector,count]of[['volcano-label','Vulkan beschriften','svg.science-figure',4],['continent-puzzle','Kontinente-Puzzle','svg.world-game-map',7],['ocean-find','Ozean-Navigator','svg.world-game-map',5]]){
  await page.locator('[data-game-key="extra:'+id+'"]').click();await page.locator('.game-room .reader-toolbar').getByText(name,{exact:true}).waitFor();const svg=page.locator('.game-board '+selector);await svg.waitFor();const normal=await assertGameNumberLabels(svg,count);if(shots)await svg.screenshot({path:shots+'/game-number-'+id+'-320.png'});
  const originalScale=await page.addStyleTag({content:'.game-board '+selector+' text{font-size:18px!important}'});try{
   // A locator screenshot can leave rendering paused until the next frame.
   // Establish the actual old scale before asking the same geometry guard.
   await page.waitForFunction(selector=>[...document.querySelectorAll('.game-board '+selector+' text')].every(el=>getComputedStyle(el).fontSize==='18px'),selector);
   await assert.rejects(()=>assertGameNumberLabels(svg,count),/visible SVG number font/,'equivalent original18unit labels remain detected as too small');
  }finally{await originalScale.evaluate(el=>el.remove());}
  await page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await page.getByRole('switch',{name:'Größere Schrift',exact:true}).check();await page.getByRole('button',{name:'Entdeckerpass schließen',exact:true}).click();const large=await assertGameNumberLabels(svg,count,20);if(shots)await svg.screenshot({path:shots+'/game-number-'+id+'-large-320.png'});(report.numberedGameDiagrams??=[]).push({id,normal,large,original18UnitCountercaseRejected:true});await page.getByRole('button',{name:'Entdeckerpass öffnen',exact:true}).click();await page.getByRole('switch',{name:'Größere Schrift',exact:true}).uncheck();await page.getByRole('button',{name:'Entdeckerpass schließen',exact:true}).click();await page.getByRole('button',{name:'Alle Spiele',exact:true}).click();await page.locator('.playground-grid').waitFor();
 }
 report.checks.push('All three actual numbered game diagrams retain16px mobile labels/20px large text, original18unit countercase rejected, SVG viewBox bounds preserved');
}
