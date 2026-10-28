'use client';

import type {ReactNode} from 'react';
import {ArrowLeft,RotateCcw} from 'lucide-react';

/** Shared room orientation; individual games keep their own learning surface. */
export default function GameShell({title,onExit,onNewRound,newRoundLabel='Neue Runde',boardKey,className='',children}:{title:string;onExit:()=>void;onNewRound:()=>void;newRoundLabel?:string;boardKey:string;className?:string;children:ReactNode}){
 return <section className={'game-room '+className}>
  <header className="reader-toolbar game-room-header"><h1>{title}</h1><div className="game-room-actions">
   <button className="secondary-button" onClick={onExit}><ArrowLeft size={17} aria-hidden="true"/> Alle Spiele</button>
   <button className="secondary-button" onClick={onNewRound}><RotateCcw size={17} aria-hidden="true"/> {newRoundLabel}</button>
  </div></header>
  <article className="game-board" key={boardKey}>{children}</article>
 </section>;
}
