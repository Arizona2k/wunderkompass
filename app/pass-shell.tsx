'use client';
import {useRef,type ReactNode} from 'react';
import {Award,X,Compass,Download,Map,LayoutGrid,Bookmark} from 'lucide-react';
import {DialogTitle,DialogDescription,DialogClose} from '@/components/ui/dialog';

export default function PassShell({children}:{children:ReactNode}){
 const body=useRef<HTMLDivElement>(null);
 function jump(id:string){
  const target=body.current?.querySelector<HTMLElement>(`[data-pass-section="${id}"]`);
  if(!target)return;
  (target.querySelector<HTMLElement>('h3')??target).focus({preventScroll:true});body.current?.scrollTo({top:target.offsetTop-16,behavior:'auto'});
 }
 return <>
  <header className="pass-header"><div><p className="eyebrow"><Award size={17} aria-hidden="true"/> DEINE ENTDECKUNGEN</p><DialogTitle>Entdeckerpass</DialogTitle></div><DialogClose className="icon-button" aria-label="Entdeckerpass schließen"><X size={20}/></DialogClose></header>
  <div className="pass-body" ref={body}>
   <DialogDescription>Deine gespeicherten Wege, Notizen und Einstellungen an einem Ort. Zum Gerätewechsel nimmst du eine Sicherungsdatei mit.</DialogDescription>
   <nav className="pass-wayfinder" aria-label="Im Entdeckerpass"><button onClick={()=>jump('overview')}><LayoutGrid size={18}/> Überblick</button><button onClick={()=>jump('learning')}><Map size={18}/> Lernwege</button><button onClick={()=>jump('saved')}><Bookmark size={18}/> Gespeichertes & Notizen</button><button onClick={()=>jump('backup')}><Download size={18}/> Sichern & Einstellungen</button><button onClick={()=>jump('badges')}><Award size={18}/> Abzeichen</button></nav>
   {children}
  </div>
  <footer className="pass-footer"><span>Dein Tempo. Deine Entdeckungen.</span><DialogClose className="primary-button"><Compass size={18}/> Weiter entdecken</DialogClose></footer>
 </>;
}
