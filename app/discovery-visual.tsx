import {useId} from 'react';

/** Original decorative artwork, deliberately not a scientific scale model. */
export default function DiscoveryVisual({variant='landscape'}:{variant?:'landscape'|'space'|'invention'}){
 const id=useId().replaceAll(':','');
 return <svg className={'discovery-visual scene-'+variant} viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <defs>
   <linearGradient id={id+'sky'} x2="0" y2="1"><stop stopColor="#122943"/><stop offset="1" stopColor="#32646c"/></linearGradient>
   <linearGradient id={id+'moon'} x2="1" y2="1"><stop stopColor="#fff3d6"/><stop offset="1" stopColor="#b6cdc9"/></linearGradient>
   <linearGradient id={id+'sea'} x2="0" y2="1"><stop stopColor="#438890"/><stop offset="1" stopColor="#122f46"/></linearGradient>
  </defs>
  <path fill={'url(#'+id+'sky)'} d="M0 0h600v360H0z"/>
  <g fill="#e0eeee" opacity=".7">{[[35,48],[85,92],[165,34],[224,76],[315,24],[495,48],[552,105],[286,128],[87,166],[521,185]].map(([cx,cy])=><circle key={cx} cx={cx} cy={cy} r={cx%3===0?2:1.3}/>)}</g>
  {variant==='invention'?<g stroke="#d1e5dc" strokeWidth="3" fill="none">
   <path stroke="#88b4b0" strokeDasharray="4 7" d="M65 95h110v60h50M390 220h95v-60h50M160 265h130"/>
   <rect x="235" y="100" width="140" height="120" rx="18" fill="#254c5d"/>
   <path d="M275 220v25h60v-25M255 245h100M265 135h80v50h-80zM281 151h19m-19 19h42"/>
   <circle cx="175" cy="155" r="16" fill="#efbd79" stroke="none"/><circle cx="425" cy="220" r="16" fill="#81c6b4" stroke="none"/>
   <path d="m113 250 15-15 15 15-15 15zM440 80v30m-15-15h30"/>
  </g>:<>
   <circle cx="395" cy="111" r="83" fill="#80b2b7" opacity=".07"/>
   <circle cx="395" cy="111" r="64" fill="#a5c9c9" opacity=".1"/>
   <circle cx="395" cy="111" r="47" fill={'url(#'+id+'moon)'}/>
   <g fill="#90aba7" opacity=".35"><circle cx="379" cy="96" r="12"/><circle cx="414" cy="116" r="8"/><circle cx="388" cy="135" r="6"/></g>
   {variant==='space'?<g stroke="#89bcb7" fill="none" opacity=".65"><ellipse cx="305" cy="180" rx="230" ry="114" transform="rotate(-17 305 180)"/><ellipse cx="305" cy="180" rx="160" ry="78" transform="rotate(-17 305 180)"/><circle cx="154" cy="197" r="25" fill="#dbb081"/><circle cx="471" cy="232" r="16" fill="#69a89c"/></g>:<>
    <path fill="#39656b" d="m0 240 70-54 68 45 111-72 89 84 90-42 89 41 83-32v150H0z"/>
    <path fill="#234853" d="m0 262 74-41 63 42 76-30 66 52 82-62 87 47 71-37 81 36v91H0z"/>
    <path fill={'url(#'+id+'sea)'} d="M0 287q135-42 295 0t305 0v73H0z"/>
    <g stroke="#8ac5bf" fill="none" opacity=".45"><path d="M328 298h122m-151 12h188m-153 13h86M54 327h100m-60 14h130"/></g>
    <g fill="#112f39">{[[18,250,70],[63,255,95],[105,279,64],[532,275,77],[576,259,110]].map(([x,y,h])=><path key={x} d={`m${x} ${y-h} 24 ${h*.55}h-13l20 ${h*.25}h-19l24 ${h*.2}h-72l24-${h*.2}H${x-7}l20-${h*.25}H${x-24}z`}/>)}</g>
    <g transform="translate(230 257) rotate(-25)" stroke="#e1c08a" strokeWidth="4" strokeLinecap="round"><path fill="#a5c8bc" d="M0-14h66v25H0z"/><path d="M30 12v14m0 0-20 32m20-32 20 32"/><path fill="#e4ddc9" d="M63-19h12v35H63z"/></g>
   </>}
  </>}
 </svg>;
}
