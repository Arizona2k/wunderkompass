import fs from 'node:fs/promises';import assert from 'node:assert/strict';

// Native browser zoom changes CSS viewport dimensions. Locator screenshots can
// use the wrong clip and return a cropped/blank image. Capture the real visible
// viewport in device coordinates, as the established book/journey proofs do.
export async function captureNativeViewport(page,file){
 const dimensions=await page.evaluate(()=>({cssWidth:innerWidth,cssHeight:innerHeight,scale:devicePixelRatio,x:scrollX*devicePixelRatio,y:scrollY*devicePixelRatio}));
 const clip={x:dimensions.x,y:dimensions.y,width:dimensions.cssWidth*dimensions.scale,height:dimensions.cssHeight*dimensions.scale,scale:1};
 const cdp=await page.context().newCDPSession(page);
 try{
  const r=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip}),png=Buffer.from(r.data,'base64');
  assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  const pixelWidth=png.readUInt32BE(16),pixelHeight=png.readUInt32BE(20);
  assert.ok(Math.abs(pixelWidth-clip.width)<=1&&Math.abs(pixelHeight-clip.height)<=1,'native proof covers the full measured physical viewport');
  const sampledColors=await page.evaluate(async data=>{
   const bytes=Uint8Array.from(atob(data),c=>c.charCodeAt(0)),image=await createImageBitmap(new Blob([bytes],{type:'image/png'})),canvas=new OffscreenCanvas(image.width,image.height),ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);image.close();
   const {width,height}=canvas,pixels=ctx.getImageData(0,0,width,height).data,colors=new Set();
   // Ignore corners/borders: a blank crop with a rounded edge is still blank.
   for(let y=Math.floor(height*.1);y<height*.9;y+=Math.max(1,Math.floor(height/32)))for(let x=Math.floor(width*.1);x<width*.9;x+=Math.max(1,Math.floor(width/32))){const i=(y*width+x)*4;colors.add(pixels[i]+','+pixels[i+1]+','+pixels[i+2]+','+pixels[i+3]);}
   canvas.width=canvas.height=1;return colors.size;
  },r.data);
  assert.ok(sampledColors>1,'Native screenshot is uniform instead of showing the tested interface');
  await fs.writeFile(file,png);return{cssWidth:dimensions.cssWidth,cssHeight:dimensions.cssHeight,scale:dimensions.scale,pixelWidth,pixelHeight,sampledColors};
 }finally{await cdp.detach();}
}
