"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type {GeoPermissibleObjects} from "d3-geo";
type NatureFeature=GeoPermissibleObjects & {properties:{layer:string;id:string;name?:string}};
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { geoCircle, geoContains, geoEquirectangular, geoOrthographic, geoGraticule10, geoPath } from "d3-geo";
import { CONTINENTS, CONTINENT_MEMBERSHIPS, LAYERS, LINES, OCEANS, countryPlace, type Country, type Mode, type Place } from "./earth-data";

import { PLATE_POINTS, layerPlaces, type MapLayer } from "./nature-data";
import CAPITALS from "./capital-points.json";
import { oceanAt } from "./marine";

export type FocusTarget = {lat: number; lon: number; key: number};
type Props = {
  touchActive?:boolean; countries: Country[]; mode: Mode; kind: string; selected: Place | null;
  mapLayer:MapLayer; borders:boolean; equator: boolean; labels: boolean; spin: boolean; zoom: number; dayHour: number;
  focus: FocusTarget | null; reset: number; activeLayer: string; reducedMotion?:boolean;
  onPick: (p: Place) => void; onLayer: (id: string) => void; onZoom: (n: number) => void;
};

export function latLonVector(lat: number, lon: number, radius = 1): THREE.Vector3 {
  const a = THREE.MathUtils.degToRad(lat), b = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(Math.cos(a) * Math.cos(b), Math.sin(a), -Math.cos(a) * Math.sin(b)).multiplyScalar(radius);
}

type Label = {id: string; title: string; position: THREE.Vector3; place?: Place; layer?: string; tone: string};

let geometryCache:NatureFeature[]|null=null;
function useGeographicFeatures(needed:boolean){
 const [features,setFeatures]=useState<NatureFeature[]>(geometryCache??[]),[status,setStatus]=useState(geometryCache?"ready":"loading"),[attempt,setAttempt]=useState(0);
// eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronize an explicit external navigation, saved pass, or browser-engine event; not derived render state.
 useEffect(()=>{if(!needed)return;if(geometryCache){setFeatures(geometryCache);setStatus("ready");return;}const abort=new AbortController();setStatus("loading");fetch("/geo-nature.json",{signal:abort.signal}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(value=>{if(abort.signal.aborted)return;const data=value as {features:NatureFeature[]};if(!Array.isArray(data.features)||!data.features.length)throw new Error();geometryCache=data.features;setFeatures(data.features);setStatus("ready");}).catch(()=>{if(!abort.signal.aborted)setStatus("error");});return()=>abort.abort();},[attempt,needed]);
 return {features,status,retry:()=>setAttempt(n=>n+1)};
}
export default function Globe(props: Props) {
  const container = useRef<HTMLDivElement>(null);
  const refs = useRef(props); useEffect(()=>{refs.current=props;},[props]);
  const labelRefs = useRef(new Map<string, HTMLButtonElement>());
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const paint=useRef(()=>{});
  const geo=useGeographicFeatures(["rivers","lakes","plates"].includes(props.mapLayer));const geometryLive=useRef(geo.features);useEffect(()=>{geometryLive.current=geo.features;},[geo.features]);

  const labels = useMemo<Label[]>(() => {
    if (props.mode === "layers") return LAYERS.map((l,i) => ({id:l.id, title:String(i+1), layer:l.id, tone:"layer", position:[new THREE.Vector3(-.983,.035,.014),new THREE.Vector3(-.62,.34,.02),new THREE.Vector3(.36,-.18,.025),new THREE.Vector3(0,0,.03)][i]}));
    const picked: Label[] = [];
    const add = (p: Place, tone: string) => { if (!picked.some(l=>l.id===p.id)) picked.push({id:p.id,title:p.label??p.name,position:latLonVector(p.lat,p.lon,1.015),place:p,tone}); };
    if (props.selected) add(props.selected, "selected");
    if(props.mode==="globe"&&props.mapLayer==="plain"&&props.zoom>=75&&props.selected?.kind==="country"&&props.selected.capital){const capital=(CAPITALS as Place[]).find(p=>p.name===props.selected?.capital);if(capital)add(capital,"nature");}
    if (props.mode === "day") {
      const germany = props.countries.find(c=>c.properties.iso === "DE");
      if (germany) add(countryPlace(germany), "selected");
      return picked;
    }
    if(props.mapLayer!=="plain"){(props.mapLayer==="capitals"?CAPITALS as Place[]:layerPlaces(props.mapLayer)).forEach(p=>add(p,"nature"));}
    if (props.mapLayer==="plain" && props.kind === "continents") CONTINENTS.forEach(p=>add(p,"continent"));
    if (props.mapLayer==="plain" && props.kind === "countries") {
      const prominent = ["DE","FR","IT","GB","US","BR","CN","IN","AU","CA","EG","IR","JP","AR","ZA","RU"];
      if(props.zoom<35)CONTINENTS.forEach(p=>add(p,"continent"));
      else [...props.countries].filter(c=>props.zoom>=65||prominent.includes(c.properties.iso)).sort((a,b)=>Number(prominent.includes(b.properties.iso))-Number(prominent.includes(a.properties.iso))).forEach(c=>add(countryPlace(c),"country"));
    }
    if(props.mapLayer==="plain") OCEANS.slice(0,props.zoom>=65?OCEANS.length:props.zoom>=35?8:5).forEach(p=>add(p,"ocean"));
    if (props.equator) LINES.filter(p=>["north-pole","south-pole"].includes(p.id)||props.mapLayer==="orientation"&&p.id!=="equator").forEach(p=>add(p,"pole"));
    return picked;
  },[props.countries,props.mode,props.kind,props.selected,props.zoom,props.equator,props.mapLayer]);
  const labelsLive = useRef(labels); useEffect(()=>{labelsLive.current=labels;},[labels]);
  useEffect(()=>{paint.current();},[props.selected,props.zoom,props.labels,props.equator,props.borders,props.mapLayer,props.spin,props.focus,props.reset,props.activeLayer,props.dayHour,props.reducedMotion,props.touchActive,labels,geo.features]);

  useEffect(() => {
    if (!container.current || props.countries.length === 0) return;
    setReady(false);setFailed(false);
    const host = container.current;
    const memory=(navigator as Navigator&{deviceMemory?:number}).deviceMemory;
    const lowGraphics=window.innerWidth<600||(typeof memory==="number"&&memory<=4)||(navigator.hardwareConcurrency>0&&navigator.hardwareConcurrency<=4);
    const textureWidth=lowGraphics?1024:2048,textureHeight=textureWidth/2;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" }); }
// eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronize an explicit external navigation, saved pass, or browser-engine event; not derived render state.
    catch { setFailed(true);return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth<600?1.5:2));
    renderer.setClearColor(0x000000,0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden","true");
    host.appendChild(renderer.domElement);
    let needsRender=true;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(37,1,.1,100);
    const root = new THREE.Group();scene.add(root);
    const controls = new OrbitControls(camera,renderer.domElement);
    controls.enablePan = false;controls.enableDamping = true;controls.dampingFactor = .09;
    controls.minDistance=2.55;controls.maxDistance=4.7;
    controls.rotateSpeed=.65;controls.zoomSpeed=.75;
    controls.minPolarAngle=.13;controls.maxPolarAngle=Math.PI-.13;
    const isLayers = props.mode === "layers", isDay = props.mode === "day";
    if (isLayers) { camera.position.set(1.12,.62,3.25);controls.minAzimuthAngle=-.85;controls.maxAzimuthAngle=.85;controls.minPolarAngle=.7;controls.maxPolarAngle=2.1; }
    else camera.position.copy(latLonVector(isDay?10:22,isDay?60:16,3.65));
    if(!isDay)camera.position.normalize().multiplyScalar(4.7-refs.current.zoom*2.15/100);
    camera.lookAt(0,0,0);
    if (isDay) {controls.enableRotate=false;controls.enableZoom=false;}
    scene.add(new THREE.AmbientLight(0xffffff,isDay?.16:2.0));
    const sun = new THREE.DirectionalLight(0xffffff,isDay?2.8:1.6);
    sun.position.copy(isDay?latLonVector(0,-30,6):new THREE.Vector3(-3,4,5));scene.add(sun);

    const textureCanvas=document.createElement("canvas");textureCanvas.width=textureWidth;textureCanvas.height=textureHeight;
    const maybeContext=textureCanvas.getContext("2d");if(!maybeContext){controls.dispose();renderer.dispose();renderer.domElement.remove();setFailed(true);return;}const context:CanvasRenderingContext2D=maybeContext;
    const texture=new THREE.CanvasTexture(textureCanvas);texture.colorSpace=THREE.SRGBColorSpace;
    texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),lowGraphics?2:8);
    const projection=geoEquirectangular().scale(textureWidth/(2*Math.PI)).translate([textureWidth/2,textureHeight/2]);
    const path=geoPath(projection,context);
    function drawTexture() {
      const state=refs.current;
      const ocean=context.createLinearGradient(0,0,0,textureHeight);ocean.addColorStop(0,"#8cc9d5");ocean.addColorStop(.38,"#4e9cae");ocean.addColorStop(.7,"#397f94");ocean.addColorStop(1,"#94cbd7");
      context.fillStyle=ocean;context.fillRect(0,0,textureWidth,textureHeight);
      for (const c of state.countries) {
        const continent=CONTINENTS.find(p=>p.id===c.properties.continent);
        const active=state.selected?.kind==="country" && state.selected.id===c.properties.id;
        context.beginPath();path(c);
        context.fillStyle=active?"#ffb667":continent?.color??"#96cfa7";
        context.fill();
        if(!active&&state.mapLayer==="plain"&&state.kind==="continents"&&CONTINENT_MEMBERSHIPS[c.properties.iso]){context.save();context.clip();context.strokeStyle="#e9f4ee";context.lineWidth=3;for(let x=-textureHeight;x<textureWidth;x+=14){context.beginPath();context.moveTo(x,0);context.lineTo(x+textureHeight,textureHeight);context.stroke();}context.restore();context.beginPath();path(c);}
        context.strokeStyle=active?"#fff6dc":"#f1fff0";context.lineWidth=active?2.5:.8;if(state.borders||active)context.stroke();
      }
      if(state.mapLayer==="climate"){
        context.save();context.globalAlpha=.38;
        for(const [lower,upper,color] of [[-90,-66.56,"#e5f6ff"],[-66.56,-40,"#72bb9a"],[-40,-23.4,"#eed088"],[-23.4,23.4,"#e9a747"],[23.4,40,"#eed088"],[40,66.56,"#72bb9a"],[66.56,90,"#e5f6ff"]] as [number,number,string][]){context.fillStyle=color;context.fillRect(0,(90-upper)/180*textureHeight,textureWidth,(upper-lower)/180*textureHeight);}context.restore();
      }
      if(state.mapLayer==="orientation"||state.mapLayer==="timezones"){
        context.beginPath();path(geoGraticule10());context.strokeStyle="#dbedf2";context.lineWidth=.8;context.stroke();
        const routes=state.mapLayer==="orientation"?[{lat:23.4},{lat:-23.4},{lat:66.6},{lat:-66.6},{lon:0}]:Array.from({length:24},(_,i)=>({lon:-180+i*15}));
        for(const line of routes){const coords="lat" in line?Array.from({length:361},(_,i)=>[i-180,line.lat??0]):Array.from({length:181},(_,i)=>[line.lon??0,i-90]);context.beginPath();path({type:"LineString",coordinates:coords});context.strokeStyle="#ed823a";context.lineWidth=2;context.stroke();}
      }
      if(state.mapLayer==="plates"){context.save();context.globalAlpha=.22;geometryLive.current.filter(f=>f.properties.layer==="plateAreas").forEach((f,i)=>{context.beginPath();path(f);context.fillStyle=state.selected?.id===f.properties.id?"#ffad48":`hsl(${i*67},48%,65%)`;context.fill();});context.restore();}
      for(const f of geometryLive.current.filter(f=>f.properties.layer===state.mapLayer)){context.beginPath();path(f);context.strokeStyle=state.mapLayer==="plates"?"#db593d":"#196590";context.lineWidth=state.mapLayer==="plates"?2.2:2.7;if(state.mapLayer==="lakes"){context.fillStyle="#237b9b";context.fill();}context.stroke();}
      texture.needsUpdate=true;
    }
    drawTexture();
    const surfaceMaterial = new THREE.MeshStandardMaterial({map:texture,roughness:.88,metalness:0});
    const segments=lowGraphics?[64,40]:[96,64];
    const surfaceGeometry = isLayers ? new THREE.SphereGeometry(1,segments[0],segments[1],Math.PI,Math.PI) : new THREE.SphereGeometry(1,segments[0],segments[1]);
    if (isLayers) {
      const uv=surfaceGeometry.attributes.uv;
      for(let i=0;i<uv.count;i++) uv.setX(i,.5+uv.getX(i)*.5);
    }
    const earth=new THREE.Mesh(surfaceGeometry,surfaceMaterial);earth.userData={surface:true};root.add(earth);
    const clickable: THREE.Object3D[]=[earth];
    const caps: THREE.Mesh[]=[];
    if (isLayers) LAYERS.forEach((l,i)=>{
      const mat=new THREE.MeshBasicMaterial({color:l.color,side:THREE.DoubleSide});
      const cap=new THREE.Mesh(new THREE.CircleGeometry(l.radius,96),mat);
      cap.position.z=.004+i*.004;cap.userData={layer:l.id};root.add(cap);caps.push(cap);clickable.push(cap);
    });
    const eqPoints=Array.from({length:129},(_,i)=>latLonVector(0,i/128*360,1.012));
    const equator=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(eqPoints),192,.0035,5,false),new THREE.MeshBasicMaterial({color:0xff9648}));
    root.add(equator);
    const axis=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-1.14,0),new THREE.Vector3(0,1.14,0)]),new THREE.LineBasicMaterial({color:0x74a5ab}));root.add(axis);
    const poles: THREE.Mesh[]=[];
    for (const y of [-1.009,1.009]) {const dot=new THREE.Mesh(new THREE.SphereGeometry(.012,10,10),new THREE.MeshBasicMaterial({color:0xff9648}));dot.position.y=y;root.add(dot);poles.push(dot);}

    const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();
    let down={x:0,y:0},dragging=false,multi=false,moved=false;const pointers=new Set<number>();
    const onDown=(e:PointerEvent)=>{if(pointers.size===0){down={x:e.clientX,y:e.clientY};multi=false;moved=false;}pointers.add(e.pointerId);if(pointers.size>1)multi=true;dragging=true;schedule();};
    const onMove=(e:PointerEvent)=>{if(pointers.has(e.pointerId)&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)moved=true;};
    const onCancel=()=>{pointers.clear();multi=true;dragging=false;};
    const onUp=(e:PointerEvent)=>{
      const wasSingle=pointers.size===1&&!multi;pointers.delete(e.pointerId);dragging=pointers.size>0;
      if(!wasSingle||moved||Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)return;
      const box=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-box.left)/box.width*2-1,-(e.clientY-box.top)/box.height*2+1);
      raycaster.setFromCamera(pointer,camera);
      const hit=raycaster.intersectObjects(clickable,false)[0];if(!hit)return;
      if(hit.object.userData.layer){refs.current.onLayer(hit.object.userData.layer);return;}
      const p=root.worldToLocal(hit.point.clone()).normalize();
      const lat=THREE.MathUtils.radToDeg(Math.asin(p.y));
      const lon=THREE.MathUtils.radToDeg(Math.atan2(-p.z,p.x));
      if(refs.current.mapLayer==="plates"){const plate=geometryLive.current.find(f=>f.properties.layer==="plateAreas"&&geoContains(f,[lon,lat]));const p=PLATE_POINTS.find(p=>p.id===plate?.properties.id);if(p){refs.current.onPick(p);return;}}
      const country=refs.current.countries.find(c=>geoContains(c,[lon,lat]));
      refs.current.onPick(country?countryPlace(country):oceanAt(lon,lat));
    };
    renderer.domElement.addEventListener("pointerdown",onDown);renderer.domElement.addEventListener("pointermove",onMove);renderer.domElement.addEventListener("pointerup",onUp);renderer.domElement.addEventListener("pointercancel",onCancel);
    const onControlsEnd=()=>{if(!isDay) refs.current.onZoom(Math.max(0,Math.min(100,(4.7-camera.position.length())/2.15*100)));};
    controls.addEventListener("end",onControlsEnd);
    const onKey=(e:KeyboardEvent)=>{
      if(isDay)return;
      let moved=true;const spherical=new THREE.Spherical().setFromVector3(camera.position);
      if(e.key==="ArrowLeft")spherical.theta-=.15;else if(e.key==="ArrowRight")spherical.theta+=.15;
      else if(e.key==="ArrowUp")spherical.phi-=.12;else if(e.key==="ArrowDown")spherical.phi+=.12;
      else if(e.key==="+"||e.key==="=")refs.current.onZoom(Math.min(100,refs.current.zoom+10));
      else if(e.key==="-")refs.current.onZoom(Math.max(0,refs.current.zoom-10));else moved=false;
      if(moved){e.preventDefault();spherical.phi=THREE.MathUtils.clamp(spherical.phi,controls.minPolarAngle,controls.maxPolarAngle);spherical.theta=isLayers?THREE.MathUtils.clamp(spherical.theta,-.85,.85):spherical.theta;camera.position.setFromSpherical(spherical);controls.update();}
    };
    host.addEventListener("keydown",onKey);
    const onContextLost=(e:Event)=>{e.preventDefault();cleanup();setFailed(true);};
    renderer.domElement.addEventListener("webglcontextlost",onContextLost);
    let frame=0,visible=true,cleaned=false;
    const resize=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<600?1.5:2));renderer.setSize(w,h);camera.aspect=w/h;camera.fov=camera.aspect<1?THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(37)/2)/camera.aspect)):37;camera.updateProjectionMatrix();needsRender=true;schedule();};
    const observer=new ResizeObserver(resize);observer.observe(host);
    let lastLabelTime=0,lastReset=refs.current.reset,lastFocus=0,lastZoom=refs.current.zoom,lastSelection=refs.current.selected?.kind==="country"?refs.current.selected.id:null,lastLayer="",lastMapLayer=refs.current.mapLayer,lastBorders=refs.current.borders;
    let goal: THREE.Vector3|null=null;
    const worldP=new THREE.Vector3(),projected=new THREE.Vector3(),cameraDir=new THREE.Vector3();
    let previousFrameTime=performance.now();
    let lastGeometry=geometryLive.current;
    let lastLabels=labelsLive.current,lastDay=refs.current.dayHour,lastEquator=refs.current.equator;
    const changed=()=>{needsRender=true;schedule();};controls.addEventListener("change",changed);
    const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
    const labelSizes=new Map<string,{w:number;h:number}>();
    let stageWidth=host.clientWidth,stageHeight=host.clientHeight;
    function schedule(){if(!frame&&!cleaned&&!document.hidden&&visible)frame=requestAnimationFrame(animate);}
    paint.current=()=>{needsRender=true;schedule();};
    const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else{previousFrameTime=performance.now();needsRender=true;schedule();}};document.addEventListener("visibilitychange",visibility);
    const intersection=typeof IntersectionObserver!=="undefined"?new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);if(visible){needsRender=true;schedule();}else{cancelAnimationFrame(frame);frame=0;}}):null;intersection?.observe(host);
    function animate(now:number) {
      frame=0;const dt=Math.min((now-previousFrameTime)/1000,.05);previousFrameTime=now;const state=refs.current;const enabled=!isDay&&(!window.matchMedia('(pointer:coarse)').matches||!!state.touchActive);controls.enabled=enabled;host.style.touchAction=renderer.domElement.style.touchAction=enabled?'none':'pan-y';
      if(document.hidden||!visible||cleaned)return;
      if(lastGeometry!==geometryLive.current){lastGeometry=geometryLive.current;drawTexture();needsRender=true;}
      const countrySelection=state.selected?.kind==="country"||state.mapLayer==="plates"?state.selected?.id??null:null;
      if(countrySelection!==lastSelection||state.mapLayer!==lastMapLayer||state.borders!==lastBorders){lastSelection=countrySelection;lastMapLayer=state.mapLayer;lastBorders=state.borders;drawTexture();needsRender=true;}
      if(state.activeLayer!==lastLayer){needsRender=true;lastLayer=state.activeLayer;caps.forEach((c,i)=>{const mat=c.material as THREE.MeshBasicMaterial;mat.color.set(LAYERS[i].color);if(LAYERS[i].id===lastLayer)mat.color.lerp(new THREE.Color("#ffffff"),.13);});}
      if(lastLabels!==labelsLive.current||lastDay!==state.dayHour||lastEquator!==state.equator){needsRender=true;lastLabels=labelsLive.current;lastDay=state.dayHour;lastEquator=state.equator;}
      equator.visible=!isLayers&&state.equator;axis.visible=!isLayers&&state.equator;poles.forEach(p=>p.visible=axis.visible);
      if(isDay)root.rotation.y=(state.dayHour-12)/24*Math.PI*2;
      if(lastReset!==state.reset){lastReset=state.reset;goal=isLayers?new THREE.Vector3(1.12,.62,3.25):latLonVector(22,16,3.65);}
      if(state.focus&&state.focus.key!==lastFocus&&!isLayers&&!isDay){lastFocus=state.focus.key;goal=latLonVector(THREE.MathUtils.clamp(state.focus.lat,-78,78),state.focus.lon,Math.max(2.55,camera.position.length()));}
      if(state.zoom!==lastZoom&&!isDay){lastZoom=state.zoom;camera.position.normalize().multiplyScalar(4.7-state.zoom/100*2.15);if(goal)goal.normalize().multiplyScalar(camera.position.length());}
      if(goal&&!dragging){const now=new THREE.Spherical().setFromVector3(camera.position),target=new THREE.Spherical().setFromVector3(goal);const alpha=reducedMotion.matches||state.reducedMotion?1:.12;const delta=((target.theta-now.theta+Math.PI*3)%(Math.PI*2))-Math.PI;now.theta+=delta*alpha;now.phi+=(target.phi-now.phi)*alpha;now.radius+=(target.radius-now.radius)*alpha;camera.position.setFromSpherical(now);if(camera.position.distanceTo(goal)<.005)goal=null;}
      controls.autoRotate=state.spin&&!isDay&&!isLayers&&!dragging&&!goal;controls.autoRotateSpeed=(reducedMotion.matches||state.reducedMotion)? .2 : .55;const moving=controls.update(dt);root.updateMatrixWorld();const rendered=needsRender;if(rendered){try{renderer.render(scene,camera);}catch{cleanup();setFailed(true);return;}needsRender=false;}
      if(rendered&&(performance.now()-lastLabelTime>32||!moving&&!goal&&!controls.autoRotate&&!dragging)){
        lastLabelTime=performance.now();
        if(stageWidth!==host.clientWidth||stageHeight!==host.clientHeight){stageWidth=host.clientWidth;stageHeight=host.clientHeight;labelSizes.clear();}
        const used:{x:number;y:number;w:number;h:number}[]=[];let visible=0;
        cameraDir.copy(camera.position).normalize();
        for(const label of labelsLive.current){
          const element=labelRefs.current.get(label.id);if(!element)continue;
          worldP.copy(label.position).applyMatrix4(root.matrixWorld);
          const front=isLayers||worldP.dot(cameraDir)/worldP.length()>.28;
          projected.copy(worldP).project(camera);
          const x=(projected.x*.5+.5)*stageWidth,y=(-projected.y*.5+.5)*stageHeight;
          let size=labelSizes.get(label.id+label.title);if(!size){size={w:element.offsetWidth||90,h:element.offsetHeight||30};labelSizes.set(label.id+label.title,size);}
          const {w,h}=size;
          const collision=used.some(b=>Math.abs(b.x-x)<(b.w+w)/2+5&&Math.abs(b.y-y)<(b.h+h)/2+5);
          const show=front&&projected.z<1&&x>w/2+6&&x<stageWidth-w/2-6&&y>h/2+4&&y<stageHeight-h/2-6&&(!collision||label.tone==="selected")&&(visible<13||label.tone==="selected")&&(state.labels||label.tone==="selected"||isLayers);
          const visibility=show?"visible":"hidden";if(element.style.visibility!==visibility){element.style.visibility=visibility;element.tabIndex=show?0:-1;}
          if(show){element.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;used.push({x,y,w,h});visible++;}
        }
      }
      setReadyOnce();if(moving||goal||controls.autoRotate||dragging||needsRender)schedule();
    }
    let notified=false;function setReadyOnce(){if(!notified){notified=true;setReady(true);}}
    resize();schedule();
    function cleanup(){
      if(cleaned)return;cleaned=true;paint.current=()=>{};intersection?.disconnect();document.removeEventListener("visibilitychange",visibility);controls.removeEventListener("change",changed);
      cancelAnimationFrame(frame);observer.disconnect();controls.dispose();
      host.removeEventListener("keydown",onKey);
      renderer.domElement.removeEventListener("pointerdown",onDown);renderer.domElement.removeEventListener("pointermove",onMove);renderer.domElement.removeEventListener("pointerup",onUp);renderer.domElement.removeEventListener("pointercancel",onCancel);renderer.domElement.removeEventListener("webglcontextlost",onContextLost);
      scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Line){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose());}});
      texture.dispose();renderer.dispose();renderer.domElement.remove();
    }
    return cleanup;
  },[props.countries,props.mode]);

  const showGeoStatus=["rivers","lakes","plates"].includes(props.mapLayer)&&geo.status!=="ready";
  const notice=showGeoStatus?<div className="geometry-status" role="status">{geo.status==="loading"?"Die Kartenspuren kommen gleich …":<>Die Kartenspuren brauchen noch einen Versuch. <button onClick={geo.retry}>Noch einmal laden</button></>}</div>:null;
  if(failed)return <><FallbackGlobe {...props} features={geo.features}/>{notice}</>;
  return <div ref={container} className="globe-render" tabIndex={0} role="group" aria-label={props.mode==="layers"?"Drehbarer Querschnitt der Erde. Nutze die Pfeiltasten oder wähle eine Schicht.":"Drehbare 3D-Weltkugel. Mit der Maus oder dem Finger ziehen. Pfeiltasten drehen, Plus und Minus vergrößern."}>
    {!ready&&<div className="globe-loading" role="status">Deine Erde kommt gleich …</div>}
    {notice}<div className="globe-labels" role="group" aria-label="Orte auf der Weltkugel">{labels.map(label=><button key={label.id} ref={e=>{if(e)labelRefs.current.set(label.id,e);else labelRefs.current.delete(label.id);}} className={`map-label label-${label.tone}`} style={{visibility:"hidden"}} aria-label={label.layer?LAYERS.find(l=>l.id===label.layer)?.name:label.title} onClick={()=>{if(label.layer)props.onLayer(label.layer);else if(label.place)props.onPick(label.place);}}>{label.tone==="selected"&&<span className="label-dot"/>}{label.title}</button>)}</div>
  </div>;
}

function FallbackGlobe(props:Props&{features:NatureFeature[]}){
  const [center,setCenter]=useState({lat:22,lon:16});const features=props.features;
  const drag=useRef<{x:number;y:number;lat:number;lon:number;id:number;moved:boolean}|null>(null);const canceled=useRef(false);const pointers=useRef(new Map<number,{x:number;y:number}>());const pinch=useRef<{distance:number;zoom:number}|null>(null);const svgRef=useRef<SVGSVGElement>(null);const latest=useRef(props);useEffect(()=>{latest.current=props;},[props]);
// eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronize an explicit external navigation, saved pass, or browser-engine event; not derived render state.
  useEffect(()=>{if(props.focus)setCenter({lat:props.focus.lat,lon:props.focus.lon});},[props.focus]);
// eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronize an explicit external navigation, saved pass, or browser-engine event; not derived render state.
  useEffect(()=>setCenter({lat:22,lon:16}),[props.reset]);
  useEffect(()=>{if(!props.spin||props.mode!=="globe")return;const timer=setInterval(()=>{if(!document.hidden)setCenter(c=>({...c,lon:c.lon+.6}));},50);return()=>clearInterval(timer);},[props.spin,props.mode]);
  useEffect(()=>{const svg=svgRef.current;if(!svg)return;const wheel=(e:WheelEvent)=>{if(latest.current.mode!=="globe")return;e.preventDefault();latest.current.onZoom(Math.max(0,Math.min(100,latest.current.zoom-e.deltaY*.06)));};svg.addEventListener("wheel",wheel,{passive:false});return()=>svg.removeEventListener("wheel",wheel);},[]);
  function down(e:React.PointerEvent<SVGSVGElement>){if(e.pointerType==="touch"&&!props.touchActive)return;pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});if(props.mode!=="globe")return;e.currentTarget.setPointerCapture(e.pointerId);if(pointers.current.size>1){canceled.current=true;drag.current=null;const [a,b]=[...pointers.current.values()];pinch.current={distance:Math.hypot(a.x-b.x,a.y-b.y),zoom:props.zoom};return;}canceled.current=false;pinch.current=null;drag.current={x:e.clientX,y:e.clientY,...center,id:e.pointerId,moved:false};}
  function move(e:React.PointerEvent<SVGSVGElement>){if(!pointers.current.has(e.pointerId)||props.mode!=="globe")return;pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.current.size>1&&pinch.current){const [a,b]=[...pointers.current.values()],distance=Math.hypot(a.x-b.x,a.y-b.y);if(pinch.current.distance>0)props.onZoom(Math.max(0,Math.min(100,pinch.current.zoom+Math.log(Math.max(.1,distance/pinch.current.distance))*50)));return;}const d=drag.current;if(d&&d.id===e.pointerId){d.moved ||= Math.hypot(e.clientX-d.x,e.clientY-d.y)>7;setCenter({lon:d.lon-(e.clientX-d.x)*.4,lat:Math.max(-85,Math.min(85,d.lat+(e.clientY-d.y)*.4))});}}
  const angle=(props.dayHour-12)*15;const scale=170+props.zoom*1.05;
  const projection=geoOrthographic().translate([250,250]).scale(scale).rotate(props.mode==="day"?[-(60-angle),-10]:[-center.lon,-center.lat]);const path=geoPath(projection);
  const countryPaths=useMemo(()=>{const projection=geoOrthographic().translate([250,250]).scale(170+props.zoom*1.05).rotate(props.mode==="day"?[-(60-(props.dayHour-12)*15),-10]:[-center.lon,-center.lat]);const trace=geoPath(projection);return props.countries.map(c=>({c,d:trace(c)??""}));},[props.countries,center.lat,center.lon,props.zoom,props.mode,props.dayHour]);
  const places=props.mapLayer==="capitals"?CAPITALS as Place[]:props.mapLayer!=="plain"?layerPlaces(props.mapLayer):props.kind==="continents"?CONTINENTS:props.kind==="oceans"?OCEANS:props.countries.filter(c=>["DE","IT","FR","BR","US","JP","AU","EG","CN"].includes(c.properties.iso)).map(countryPlace);
  function key(e:React.KeyboardEvent){if(props.mode!=="globe")return;if(e.key.startsWith("Arrow")){e.preventDefault();setCenter(c=>({lon:c.lon+(e.key==="ArrowLeft"?-8:e.key==="ArrowRight"?8:0),lat:Math.max(-85,Math.min(85,c.lat+(e.key==="ArrowUp"?8:e.key==="ArrowDown"?-8:0)))}));}else if(["+","=","-"].includes(e.key)){e.preventDefault();props.onZoom(Math.max(0,Math.min(100,props.zoom+(e.key==="-"?-10:10))));}}
  function pick(e:React.PointerEvent<SVGSVGElement>){
    pointers.current.delete(e.pointerId);const d=drag.current;drag.current=null;
    if(canceled.current||d?.moved||props.mode!=="globe")return;
    const box=e.currentTarget.getBoundingClientRect();if(!box.width||!box.height)return;
    // SVG fits the square viewBox inside its element and centers any empty margins.
    const displayScale=Math.min(box.width,box.height)/500;
    const viewX=(e.clientX-box.left-(box.width-displayScale*500)/2)/displayScale;
    const viewY=(e.clientY-box.top-(box.height-displayScale*500)/2)/displayScale;
    if(Math.hypot(viewX-250,viewY-250)>scale)return;
    const point=projection.invert?.([viewX,viewY]);if(!point)return;
    if(props.mapLayer==="plates"){const plate=features.find(f=>f.properties.layer==="plateAreas"&&geoContains(f,point));const place=PLATE_POINTS.find(p=>p.id===plate?.properties.id);if(place){props.onPick(place);return;}}
    const c=props.countries.find(c=>geoContains(c,point));props.onPick(c?countryPlace(c):oceanAt(...point));
  }
  return <div className="fallback-globe" style={{touchAction:props.touchActive||!window.matchMedia("(pointer:coarse)").matches?"none":"pan-y"}} tabIndex={0} onKeyDown={key} role="group" aria-label="Drehbare Weltkarte. Pfeiltasten drehen, Plus und Minus vergrößern.">
    <svg ref={svgRef} style={{touchAction:props.touchActive||!window.matchMedia("(pointer:coarse)").matches?"none":"pan-y"}} viewBox="0 0 500 500" role="img" aria-label={props.mode==="layers"?"Schnittbild der vier Erdschichten":"Drehbare Weltkarte als Alternative zur 3D-Darstellung"} onPointerDown={down} onPointerMove={move} onPointerCancel={()=>{drag.current=null;pinch.current=null;canceled.current=true;pointers.current.clear();}} onPointerUp={pick}>
      <defs><pattern id="globe-shared-continent" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)"><rect width="8" height="8" fill="#96cfa7"/><rect width="3" height="8" fill="#e9f4ee"/></pattern></defs>
      {props.mode==="layers"?LAYERS.map(l=><circle key={l.id} cx="250" cy="250" r={l.radius*205} fill={l.color} onClick={()=>props.onLayer(l.id)} role="img" aria-label={l.name} />):<><circle cx="250" cy="250" r={scale} fill="#4e9cae"/>{countryPaths.map(({c,d})=><path key={c.properties.id} d={d} fill={props.selected?.id===c.properties.id?"#ffb667":props.mapLayer==="plain"&&props.kind==="continents"&&CONTINENT_MEMBERSHIPS[c.properties.iso]?"url(#globe-shared-continent)":CONTINENTS.find(x=>x.id===c.properties.continent)?.color??"#96cfa7"} stroke={props.borders?"#f1fff0":"none"} strokeWidth=".65"><title>{c.properties.name}</title></path>)}{props.equator&&<path d={path({type:"LineString",coordinates:Array.from({length:361},(_,i)=>[i-180,0])})??""} stroke="#ff9648" fill="none" strokeWidth="2"/>}{props.mapLayer==="climate"&&<g opacity=".4"><path d={path({type:"Sphere"})??""} fill="#e9a747"/>{[1,-1].map(sign=><g key={sign}>{[[23.4,"#eed088"],[40,"#72bb9a"],[66.56,"#e5f6ff"]].map(([lat,color])=><path key={lat} d={path(geoCircle().center([0,sign*90]).radius(90-Number(lat))())??""} fill={String(color)}/>)}</g>)}</g>}{["orientation","timezones"].includes(props.mapLayer)&&<path d={path(geoGraticule10())??""} stroke="#deedf0" fill="none" strokeWidth=".6"/>}{props.mapLayer==="timezones"&&Array.from({length:24},(_,i)=>-180+i*15).map(lon=><path key={lon} d={path({type:"LineString",coordinates:Array.from({length:181},(_,i)=>[lon,i-90])})??""} stroke="#eb7a39" fill="none" strokeWidth="1.5"/>)}{props.mapLayer==="orientation"&&[23.4,-23.4,66.6,-66.6].map(lat=><path key={lat} d={path({type:"LineString",coordinates:Array.from({length:361},(_,i)=>[i-180,lat])})??""} stroke="#eb7a39" fill="none" strokeWidth="1.5"/>)}{props.mapLayer==="orientation"&&<path d={path({type:"LineString",coordinates:Array.from({length:181},(_,i)=>[0,i-90])})??""} stroke="#eb7a39" fill="none" strokeWidth="1.5"/>}{props.mapLayer==="plates"&&features.filter(f=>f.properties.layer==="plateAreas").map((f,i)=><path key={f.properties.id+"-"+i} d={path(f)??""} fill={props.selected?.id===f.properties.id?"#ffad48":`hsl(${i*67},48%,65%)`} opacity=".25"/>)}{features.filter(f=>f.properties.layer===props.mapLayer).map((f,i)=><path key={i} d={path(f)??""} fill={props.mapLayer==="lakes"?"#237b9b":"none"} stroke={props.mapLayer==="plates"?"#db593d":"#196590"} strokeWidth="1.8"/>)}{props.mode==="day"&&<path d={path(geoCircle().center([150-angle,0]).radius(90)())??""} fill="#163143" opacity=".65"/>}</>}
    </svg>
    {props.mode==="globe"&&props.labels&&<div className="fallback-place-list">{places.map(p=><button key={p.id} className="secondary-button" onClick={()=>props.onPick(p)}>{p.name}</button>)}</div>}
    <p>Dein Gerät zeigt eine einfache Karte. Du kannst sie drehen, vergrößern und Orte auswählen.</p>
  </div>;
}
