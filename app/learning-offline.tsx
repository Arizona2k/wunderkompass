"use client";
import { useEffect, useRef, useState } from 'react';
import { Download, Check, RefreshCw } from 'lucide-react';

declare global { const __EARTH_BUILD__: string; const __EARTH_PRODUCTION__: boolean; }
type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
type Preparation={verified:number;total:number;phase:'files'|'checking'|'complete'|'failed'};
function isPrepared(worker: ServiceWorker): Promise<boolean> {
  return new Promise(resolve => {
    const channel = new MessageChannel();
    const finish = (ready: boolean) => { clearTimeout(timer); channel.port1.close(); channel.port2.close(); resolve(ready); };
    const timer = setTimeout(() => finish(false), 3000);
    channel.port1.onmessage = event => finish(event.data?.ready === true);
    worker.postMessage({ type: 'LEARNING_STATUS' }, [channel.port2]);
  });
}
export default function LearningOffline({ onBeforeReload }: { onBeforeReload: () => Promise<void> }) {
  const [available, setAvailable] = useState(false), [busy, setBusy] = useState(false), [ready, setReady] = useState(false);
  const [failed,setFailed]=useState(false);
  const [progress,setProgress]=useState<Preparation|null>(null),trackers=useRef(new Set<()=>void>()),trackedWorkers=useRef(new WeakSet<ServiceWorker>());
  const [message, setMessage] = useState(''), [waiting, setWaiting] = useState<ServiceWorker | null>(null), [install, setInstall] = useState<InstallEvent | null>(null);
  const action = useRef(onBeforeReload); useEffect(()=>{action.current=onBeforeReload;},[onBeforeReload]);
  const firstController = useRef<ServiceWorker | null>(null);
  function observe(registration: ServiceWorkerRegistration) {
    if (registration.waiting) setWaiting(registration.waiting);
    const track = (worker: ServiceWorker | null) => {
      if (!worker||worker.state!=='installing'||trackedWorkers.current.has(worker)) return;
      trackedWorkers.current.add(worker);
      let live=true;
      const channels=new Map<MessageChannel,()=>void>();
      const sample=()=>{
        if(!live||worker.state!=='installing')return;
        const channel=new MessageChannel();
        const close=()=>{clearTimeout(timer);channel.port1.close();channel.port2.close();channels.delete(channel);};
        const timer=setTimeout(close,2000);channels.set(channel,close);
        channel.port1.onmessage=event=>{const p=event.data;close();if(live&&worker.state==='installing'&&Number.isInteger(p?.verified)&&Number.isInteger(p?.total)&&p.total>0&&p.verified>=0&&p.verified<=p.total&&['files','checking'].includes(p.phase))setProgress(p);};
        try{worker.postMessage({type:'LEARNING_PROGRESS'},[channel.port2]);}catch{close();}
      };
      const interval=setInterval(sample,750),stop=()=>{live=false;clearInterval(interval);for(const close of channels.values())close();channels.clear();trackers.current.delete(stop);trackedWorkers.current.delete(worker);};trackers.current.add(stop);sample();
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed') {
          stop();setProgress(null);
          setBusy(false); setFailed(false); setMessage('');
          if (navigator.serviceWorker.controller) setWaiting(registration.waiting ?? worker);
          else { setReady(true); setBusy(false); }
        }
        if (worker.state === 'redundant') { stop();setProgress(null);setBusy(false); setFailed(true); setMessage('Offline konnte nicht vollständig vorbereitet werden. Bitte online noch einmal versuchen.'); }
      });
    };
    track(registration.installing);
    registration.addEventListener('updatefound', () => track(registration.installing));
  }
  useEffect(() => {
    if (typeof __EARTH_PRODUCTION__ === 'undefined' || !__EARTH_PRODUCTION__ || !window.isSecureContext || !('serviceWorker' in navigator)) return;
// eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronize an explicit external navigation, saved pass, or browser-engine event; not derived render state.
    setAvailable(true); firstController.current = navigator.serviceWorker.controller;
    const prompt = (event: Event) => { event.preventDefault(); setInstall(event as InstallEvent); };
    const versionQuery = (event: MessageEvent) => {
      if (event.data?.type === 'LEARNING_QUERY_VERSION') event.ports[0]?.postMessage({ version: __EARTH_BUILD__ });
    };
    const changed = () => {
      if (!firstController.current) { firstController.current = navigator.serviceWorker.controller; setReady(true); setBusy(false); return; }
      void action.current().finally(() => window.location.reload());
    };
    window.addEventListener('beforeinstallprompt', prompt); navigator.serviceWorker.addEventListener('controllerchange', changed); navigator.serviceWorker.addEventListener('message', versionQuery);
    let live = true;
    navigator.serviceWorker.getRegistration('/').then(async registration => {
      if (!live || !registration || !registration.active?.scriptURL.endsWith('/learning-worker.js')) return;
      const prepared = await isPrepared(registration.active);
      if (live) setReady(prepared);
      observe(registration); void registration.update().catch(() => {});
    }).catch(() => {});
    const activeTrackers=trackers.current;
    return () => { live = false; for(const stop of activeTrackers)stop();window.removeEventListener('beforeinstallprompt', prompt); navigator.serviceWorker.removeEventListener('controllerchange', changed); navigator.serviceWorker.removeEventListener('message', versionQuery); };
  }, []);
  async function prepare() {
    if (busy) return; setBusy(true); setFailed(false); setMessage('Die Lernwelt wird heruntergeladen. Lass diese Seite kurz offen.');
    try {
      const previous = await navigator.serviceWorker.getRegistration('/');
      // Browser storage may have been cleared while a registration survived.
      if (previous?.active?.scriptURL.endsWith('/learning-worker.js') && !(await isPrepared(previous.active))) await previous.unregister();
      const registration = await navigator.serviceWorker.register('/learning-worker.js', { scope: '/', updateViaCache: 'none' });
      observe(registration);
      if (registration.active && !registration.installing) { setReady(await isPrepared(registration.active)); setBusy(false); }
    } catch { setBusy(false); setFailed(true); setMessage('Offline-Vorbereitung hat nicht geklappt. Prüfe die Verbindung und versuche es noch einmal.'); }
  }
  if (!available) return null;
  return <aside className="offline-learning" aria-label="Offline lernen"><div><strong>{ready ? 'Deine Lernwelt ist offline vorbereitet.' : 'Auch ohne Internet weiter entdecken'}</strong><p>{ready ? 'Die vorbereitete Version funktioniert auch nach einem Offline-Neustart. Quellenlinks brauchen Internet.' : 'Lade einmal die Lernwelt mit Bildern auf dieses Gerät. Dein Entdeckerpass bleibt im selben Browser.'}</p></div>{waiting ? <button className="secondary-button" onClick={async () => { await action.current(); waiting.postMessage({ type: 'ACTIVATE_LEARNING_RELEASE' }); }}><RefreshCw size={18}/> Neue Version laden</button> : !ready || failed ? <button className="secondary-button" disabled={busy} onClick={() => void prepare()}><Download size={18}/>{busy ? 'Wird vorbereitet …' : 'Für offline vorbereiten'}</button> : <span className="offline-ready"><Check size={20}/> Bereit</span>}{install && <button className="secondary-button" onClick={async () => { await install.prompt(); await install.userChoice; setInstall(null); }}>Auf dem Gerät installieren</button>}{progress&&<div className="offline-progress"><progress aria-label="Sicher gespeicherte Lernwelt-Dateien" value={progress.verified} max={progress.total}/><p role="status">{progress.verified} von {progress.total} Dateien sicher gespeichert. {progress.phase==='checking'?'Die vollständige Version wird abschließend geprüft.':'Lass diese Seite kurz offen.'}</p></div>}{message && !progress && (!ready || failed) && <p className="offline-message" role="status">{message}</p>}</aside>;
}
