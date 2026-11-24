import {zaehleNavigationen} from './navigation-tempo.mjs';
import {beobachteAnfragen} from './seitenwechsel.mjs';
export const BROWSER_ERROR_FIELDS=['errors','consoleErrors','failedRequests','ownHttpErrors','externalRequests'];
export const browserErrorArrays=()=>Object.fromEntries(BROWSER_ERROR_FIELDS.map(key=>[key,[]]));
export const browserErrorsComplete=proof=>BROWSER_ERROR_FIELDS.every(key=>Array.isArray(proof?.[key])&&proof[key].length===0);
// Für Zusicherungen: nennt die gesammelten Fehler, damit ein Fehlschlag in der CI die Ursache zeigt.
export const browserErrorText=proof=>'Browserfehler: '+JSON.stringify(Object.fromEntries(BROWSER_ERROR_FIELDS.filter(key=>proof?.[key]?.length).map(key=>[key,proof[key].slice(0,5)])));

// Zwei Fälle, in denen Firefox eine Bildanfrage selbst abbricht (NS_BINDING_ABORTED), obwohl das Bild erscheint. Chromium und
// WebKit tun beides nicht. Jeder andere Bildabbruch bleibt ein Fehler.
//
// 1. Neustart: React 19.2 setzt bei jedem neu eingefügten <img> direkt nach dem Einfügen `src` noch einmal (commitHostMount in
// react-dom). Firefox bricht dann die laufende Anfrage ab und startet sofort eine neue. Gemessen am 23.11.2026 (Firefox, ein
// Prozessorkern, Bild 400 ms verzögert): in 6 von 10 Läufen ein Abbruch, die neue Anfrage derselben Adresse 2 bis 43 ms später,
// ohne Navigation dazwischen; sie gelingt, das Bild erscheint. Regel: Startet innerhalb von FIREFOX_BILD_NEUSTART_MS eine neue
// Anfrage derselben Bildadresse, ist der Abbruch erwartet. Die neue Anfrage bleibt voll überwacht.
//
// 2. Gespeicherte Kopie: Hat Firefox das Bild schon geladen, fragt es nach einem Neuladen der Seite beim nächsten Einhängen nach,
// ob seine Kopie noch gilt. Kommt die Antwort aus dem Speicher, bricht Firefox diese Nachfrage absichtlich ab und zeigt die Kopie
// (image/imgLoader.cpp, imgCacheValidator::OnStartRequest: CancelWithReason(NS_BINDING_ABORTED, ...)). Gemessen am 23.11.2026
// im Rauchtest (Riff-Foto der Startseite nach Neuladen und Umleitung von #news/... auf #home): keine neue Anfrage, das Bild
// steht fertig auf der Seite (Zahlen: docs/entwurf/2026-11-23-teilschritt-3-arbeitssystem-entscheidungen.md, Punkt 13). Regel: Die Seite hat dieselbe Adresse vorher erfolgreich geladen (Status unter 400), danach kommt
// keine neue Anfrage dafür, und innerhalb von FIREFOX_SPEICHERKOPIE_MS zeigt die Seite ein eingehängtes Bild mit dieser Adresse
// fertig geladen, ohne dass ein Bild mit dieser Adresse kaputt ist. Zeigt die Seite das Bild nicht (etwa weil die Ansicht
// gewechselt hat), antwortet sie nicht oder ist sie geschlossen, bleibt der Abbruch ein Fehler.
//
// Für beide gilt: Jedes Laden oder Neuladen eines Dokuments beginnt einen neuen Abschnitt (Navigationsanfrage). Liegt zwischen
// der abgebrochenen Anfrage und der Entscheidung eine Navigation, bleibt der Abbruch ein Fehler: Dann hat das Neuladen ihn
// verursacht.
export const FIREFOX_BILD_NEUSTART_MS=250;
export const FIREFOX_SPEICHERKOPIE_MS=1000;
const SPEICHERKOPIE_TAKT_MS=50;
const FIREFOX_BILD_NEUSTART_GRUND='React setzt src nach dem Einfügen erneut (commitHostMount); Firefox bricht die erste Bildanfrage ab und lädt dieselbe Adresse sofort neu.';
const FIREFOX_SPEICHERKOPIE_GRUND='Firefox hatte das Bild schon geladen; die Nachfrage, ob die Kopie noch gilt, bricht es selbst ab, weil die Antwort aus dem Speicher kommt (imgCacheValidator), und zeigt die Kopie.';
const offeneNeustarts=new WeakMap();
// Wartet, bis jeder offene Firefox-Bildabbruch entschieden ist (erwartet oder Fehler). Vor dem Umsortieren und vor der Schlussprüfung aufrufen.
export const browserErrorsSettled=proof=>Promise.all([...(offeneNeustarts.get(proof)??[])]);
// Schlussprüfung einer Suite: erst offene Entscheidungen abwarten, dann ohne Browserfehler bestehen oder die Fehler nennen.
// Suiten prüfen nur so (Wächter in tests/browser-suites.test.mjs); ein sofortiges browserErrorsComplete wäre rot, obwohl die Regel den Abbruch gleich streicht.
export async function browserErrorsAssert(proof,wo){await browserErrorsSettled(proof);if(!browserErrorsComplete(proof))throw Error((wo?wo+': ':'')+browserErrorText(proof));}
// Der Runner lässt jeden erwarteten Firefox-Bildabbruch ins Log schreiben, damit sichtbar bleibt, wie oft die Regeln greifen.
let bildabbruchMeldung=null;
export const meldeBildabbrueche=fn=>{bildabbruchMeldung=fn;};

// Liest aus der Seite, welche eingehängten Bilder die Adresse zeigen. Die Entscheidung fällt hier, nicht in der Seite.
const bilderMitAdresse=url=>[...document.images].filter(bild=>bild.isConnected&&(bild.currentSrc===url||bild.src===url)).map(bild=>({complete:bild.complete,naturalWidth:bild.naturalWidth}));
const zeigtFertigesBild=bilder=>Array.isArray(bilder)&&bilder.some(bild=>bild.complete&&bild.naturalWidth>0)&&!bilder.some(bild=>bild.complete&&bild.naturalWidth===0);

function firefoxBildAbbrueche(page,proof){
 const passt=(request,error)=>error==='NS_BINDING_ABORTED'&&request.resourceType?.()==='image';
 let abschnitt=0;const abschnittVon=new WeakMap();
 const letzte=new Map(),wartend=new Map(),geladen=new Set(),offen=offeneNeustarts.get(proof)??new Set();offeneNeustarts.set(proof,offen);
 const vermerke=(url,error,phase,reason)=>{(proof.expectedSyntheticErrors??=[]).push({kind:'failedRequests',url,error,engine:'firefox',phase,reason});bildabbruchMeldung?.({phase,url});};
 // Schon umsortiert (Aufrufer ohne browserErrorsSettled): Der Eintrag bleibt ein Fehler, also lieber rot als still grün.
 const streiche=(warten,phase,reason)=>{const stelle=proof.failedRequests.indexOf(warten.eintrag);if(stelle<0)return;proof.failedRequests.splice(stelle,1);vermerke(warten.url,warten.eintrag.error,phase,reason);};
 const gleicherAbschnitt=warten=>abschnitt===warten.abschnitt;
 // Fall 2: in kleinen Takten nachsehen, bis die Seite das Bild fertig zeigt oder die Wartezeit endet.
 const pruefeKopie=async warten=>{
  try{
   while(warten.offen){
    const zeigt=await page.evaluate(bilderMitAdresse,warten.url).then(zeigtFertigesBild,()=>false);
    if(!warten.offen||!gleicherAbschnitt(warten))break;
    if(zeigt){streiche(warten,'firefox-image-cache-copy',FIREFOX_SPEICHERKOPIE_GRUND);break;}
    await new Promise(resolve=>setTimeout(resolve,SPEICHERKOPIE_TAKT_MS));
   }
  }finally{warten.ende();}
 };
 return{
  // Jede Anfrage merken. Folgt sie auf einen offenen Bildabbruch derselben Adresse, endet das Warten: rechtzeitig ist das der
  // Neustart (Fall 1), später bleibt der Abbruch ein Fehler.
  anfrage(request){
   if(request.isNavigationRequest?.())abschnitt++;
   abschnittVon.set(request,abschnitt);
   const url=request.url(),jetzt=Date.now(),warten=wartend.get(url);letzte.set(url,{request,zeit:jetzt});
   if(!warten||warten.request===request)return;
   warten.ende();
   if(jetzt-warten.zeit<=FIREFOX_BILD_NEUSTART_MS&&gleicherAbschnitt(warten))streiche(warten,'firefox-image-restart',FIREFOX_BILD_NEUSTART_GRUND);
  },
  // Erfolgreich geladene Bildadressen merken (Voraussetzung für Fall 2).
  async fertig(request){
   if(request.resourceType?.()!=='image')return;
   const status=await Promise.resolve().then(()=>request.response()).then(antwort=>antwort?.status(),()=>undefined);
   if(typeof status==='number'&&status<400)geladen.add(request.url());
  },
  // Lief die neue Anfrage schon vor der Abbruchmeldung, ist der Abbruch sofort erledigt (true, Fall 1).
  erledigt(request,error){
   if(!passt(request,error))return false;
   const url=request.url(),neu=letzte.get(url);
   if(!neu||neu.request===request||Date.now()-neu.zeit>FIREFOX_BILD_NEUSTART_MS||abschnittVon.get(request)!==abschnitt)return false;
   vermerke(url,error,'firefox-image-restart',FIREFOX_BILD_NEUSTART_GRUND);return true;
  },
  // Sonst zählt der Abbruch erst als Fehler und wird gestrichen, falls einer der beiden Fälle rechtzeitig belegt ist.
  beobachte(request,error,eintrag){
   if(!passt(request,error))return;
   const url=request.url();wartend.get(url)?.ende();
   let fertig;const versprechen=new Promise(resolve=>{fertig=resolve;});
   const kopie=geladen.has(url);
   const warten={request,eintrag,url,zeit:Date.now(),abschnitt:abschnittVon.get(request),offen:true};
   warten.ende=()=>{if(!warten.offen)return;warten.offen=false;clearTimeout(uhr);if(wartend.get(url)===warten)wartend.delete(url);offen.delete(versprechen);fertig();};
   const uhr=setTimeout(warten.ende,kopie?FIREFOX_SPEICHERKOPIE_MS:FIREFOX_BILD_NEUSTART_MS);
   offen.add(versprechen);wartend.set(url,warten);
   if(kopie)pruefeKopie(warten).catch(()=>{});
  },
 };
}

// Shared by actual Chromium/Firefox/WebKit pages. Controlled fixtures may name
// an exact initial asset503, or the confirmed stopped origin's registered worker
// update. Neither exception applies to ordinary app resources or real origins.
export function monitorBrowserErrors(page,base,proof,{engine,expectedHTTP503,expectedOfflineWorkerUpdate}={}){
 if(!BROWSER_ERROR_FIELDS.every(key=>Array.isArray(proof[key])))throw Error('Missing browser error evidence arrays');
 const origin=new URL(base).origin,tag=engine?'['+engine+'] ':'';
 if(expectedHTTP503&&(new URL(expectedHTTP503.url).origin!==origin||typeof expectedHTTP503.active!=='function'||!expectedHTTP503.reason?.trim()))throw Error('Invalid exact synthetic HTTP503 exception');
 const parsedOrigin=new URL(origin),workerURL=new URL('/learning-worker.js',origin).href;
 if(expectedOfflineWorkerUpdate&&(parsedOrigin.protocol!=='http:'||!['127.0.0.1','localhost'].includes(parsedOrigin.hostname)||!parsedOrigin.port||expectedOfflineWorkerUpdate.url!==workerURL||typeof expectedOfflineWorkerUpdate.active!=='function'||!expectedOfflineWorkerUpdate.reason?.trim()||expectedHTTP503?.url===workerURL))throw Error('Invalid exact verified offline worker-update exception');
 const refused='Could not connect to '+parsedOrigin.hostname+': Connection refused',workerFailures=[];let workerSequence=0;
 const expectedWorker=()=>engine==='webkit'&&expectedOfflineWorkerUpdate?.active()===true;
 const recordWorker=(kind,detail)=>{(proof.expectedSyntheticErrors??=[]).push({kind,...detail,phase:'confirmed-origin-stopped-worker-update',reason:expectedOfflineWorkerUpdate.reason});};
 const expected=(url,status)=>expectedHTTP503&&url===expectedHTTP503.url&&status===503&&expectedHTTP503.active()===true;
 const recordExpected=(kind,url)=>{(proof.expectedSyntheticErrors??=[]).push({kind,url,status:503,phase:'source-failure',reason:expectedHTTP503.reason});};
 const own=url=>{try{return new URL(url).origin===origin;}catch{return false;}};
 // WebKit blockiert nach 200 schnellen Navigationen weitere und meldet das nur als Warnung (navigation-tempo.mjs).
 // Als Fehler zählen, damit eine Suite die Ursache nennt statt in einem Zeitlimit zu enden.
 zaehleNavigationen(page);
 // Offene Anfragen merken: reload, goto und close warten vorher, bis die Seite ruhig ist (seitenwechsel.mjs).
 beobachteAnfragen(page,{proof,tag});
 // Chromium und Firefox melden eine ResizeObserver-Schleife nur als `error`-Ereignis im Fenster, das Playwright nicht sieht;
 // WebKit meldet sie als Seitenfehler. Als console.error weitergeben, damit sie in jeder Engine als Fehler zählt.
 // Das Skript gilt ab dem nächsten Dokument (Aufrufer überwachen vor dem ersten goto). Schließt sich die Seite vorher, gibt es nichts zu melden.
 // React meldet einen Renderfehler, den es selbst repariert hat (#520), nur als Hülle; die eigentliche Ursache steht in `error.cause`.
 // Ursache und Adresse als eigenen Eintrag mitschicken, damit ein Fehlschlag in der CI sie nennt. Der Seitenfehler zählt ohnehin.
 page.addInitScript(()=>addEventListener('error',event=>{if(/ResizeObserver loop/.test(event.message))console.error(event.message);const cause=event.error?.cause;if(cause!==undefined)console.debug('WK-URSACHE '+JSON.stringify({adresse:location.hash||'/',ursache:String(cause?.message??cause),stapel:String(cause?.stack??'').slice(0,1200)}));})).catch(()=>{});
 page.on('console',message=>{if(message.type()==='debug'&&message.text().startsWith('WK-URSACHE ')){proof.errors.push(tag+message.text());return;}if(message.type()==='warning'&&/Excessive navigation attempts blocked/.test(message.text())){proof.consoleErrors.push(tag+message.text());return;}if(message.type()!=='error')return;const url=message.location?.().url,text=message.text();if(url&&expected(url,503)&&/(?:status of 503|503 \(Service Unavailable\))/.test(text)){recordExpected('consoleErrors',url);return;}if(url===workerURL&&text==='Failed to load resource: '+refused&&expectedWorker()&&workerFailures.length){const paired=workerFailures.shift();recordWorker('consoleErrors',{url,message:text,pair:paired});return;}proof.consoleErrors.push(tag+text);});
 // Viele Suiten nennen den Browser nicht; für die Firefox-Ausnahme dann den Namen von der Seite lesen (nur dafür, die Kennzeichnung bleibt).
 const browserName=engine??page.context?.()?.browser?.()?.browserType?.()?.name?.();
 const bildAbbruch=browserName==='firefox'?firefoxBildAbbrueche(page,proof):null;
 page.on('requestfailed',request=>{const url=request.url(),error=request.failure()?.errorText;if(url===workerURL&&error===refused&&expectedWorker()&&request.resourceType?.()==='xhr'&&request.isNavigationRequest?.()===false){const pair=++workerSequence;workerFailures.push(pair);recordWorker('failedRequests',{url,error,pair,resourceType:'xhr',isNavigationRequest:false});return;}if(bildAbbruch?.erledigt(request,error))return;const eintrag={url,error,...(engine?{engine}:{})};proof.failedRequests.push(eintrag);bildAbbruch?.beobachte(request,error,eintrag);});
 page.on('requestfinished',request=>{bildAbbruch?.fertig(request);});
 page.on('pageerror',error=>proof.errors.push(tag+error.message));
 page.on('response',response=>{const url=response.url(),status=response.status();if(!own(url)||status<400)return;if(expected(url,status)){recordExpected('ownHttpErrors',url);return;}const parsed=new URL(url);proof.ownHttpErrors.push({path:parsed.pathname+parsed.search,status,...(engine?{engine}:{})});});
 page.on('request',request=>{bildAbbruch?.anfrage(request);const url=request.url();if(!own(url)&&!url.startsWith('data:')&&!url.startsWith('blob:'))proof.externalRequests.push(tag+url);});
}
