import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';

// Native browser zoom changes CSS viewport dimensions. Locator screenshots can
// use the wrong clip and return a cropped/blank image. Capture the real visible
// viewport directly. Absolute clips multiplied by DPR become invalid at deep
// scroll offsets in Chromium headless-shell, even when an early capture works.
export async function captureNativeViewport(page,file,{cdp:providedSession=null}={}){
 const dimensions=await page.evaluate(()=>({cssWidth:innerWidth,cssHeight:innerHeight,scale:devicePixelRatio,scrollY}));
 // A caller testing navigator.offline may retain one session until page close:
 // Chromium resets target-wide offline emulation when a CDP client detaches.
 // Every existing capture/size/content assertion applies to either ownership.
 const cdp=providedSession??await page.context().newCDPSession(page);
 try{
  const r=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false}),png=Buffer.from(r.data,'base64');
  await fs.writeFile(file,png); // Preserve the actual failed capture, too.
  assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  const pixelWidth=png.readUInt32BE(16),pixelHeight=png.readUInt32BE(20);
  assert.ok(Math.abs(pixelWidth-dimensions.cssWidth*dimensions.scale)<=1&&Math.abs(pixelHeight-dimensions.cssHeight*dimensions.scale)<=1,'native proof covers the full measured physical viewport');
  const sampledColors=await page.evaluate(async data=>{
   const bytes=Uint8Array.from(atob(data),c=>c.charCodeAt(0)),image=await createImageBitmap(new Blob([bytes],{type:'image/png'})),canvas=new OffscreenCanvas(image.width,image.height),ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);image.close();
   const {width,height}=canvas,pixels=ctx.getImageData(0,0,width,height).data,colors=new Set();
   // Ignore corners/borders: a blank crop with a rounded edge is still blank.
   for(let y=Math.floor(height*.1);y<height*.9;y+=Math.max(1,Math.floor(height/32)))for(let x=Math.floor(width*.1);x<width*.9;x+=Math.max(1,Math.floor(width/32))){const i=(y*width+x)*4;colors.add(pixels[i]+','+pixels[i+1]+','+pixels[i+2]+','+pixels[i+3]);}
   canvas.width=canvas.height=1;return colors.size;
  },r.data);
  assert.ok(sampledColors>1,'Native screenshot is uniform instead of showing the tested interface');
  return{...dimensions,pixelWidth,pixelHeight,sampledColors};
 }catch(error){
  await fs.mkdir('.qa-output',{recursive:true});
  try{await fs.copyFile(file,path.join('.qa-output','quality-failure-'+path.basename(file)));}catch{/* The original protocol error still fails the job. */}
  error.message+=' '+JSON.stringify({file,...dimensions});throw error;
 }finally{if(!providedSession)await cdp.detach();}
}
