"use client";
import {useLayoutEffect} from 'react';
import {BookOpen, ChevronDown, Compass, Globe2, Search, Star, type LucideIcon} from 'lucide-react';
import {restoreRouteView} from '../hash-route';
import {aufteilen, datumLesbar, type Neuigkeit, type NeuigkeitSymbol} from './neuigkeiten';

const SYMBOLE: Record<NeuigkeitSymbol, LucideIcon> = {kompass: Compass, globus: Globe2, stern: Star, buch: BookOpen, lupe: Search};

// „Was ist neu?“ für Kinder: oben das Neueste, darunter eingeklappt „Früher“ mit der alten Chronik.
export default function NeuigkeitenAnsicht() {
  const {neu, frueher} = aufteilen();
  useLayoutEffect(() => {
    restoreRouteView('updates');
    // Nach Zurück die Lesestelle noch einmal setzen, wenn Schrift und Bilder fertig sind.
    const opener = history.state?.wunderFocus;
    if (!opener) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if ((document.activeElement as HTMLElement | null)?.dataset.routeFocus === opener) restoreRouteView('updates');
      });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return <article className="kern-neuigkeiten" aria-labelledby="updates-title">
    <h1 id="updates-title" tabIndex={-1}>Was ist neu?</h1>
    <p className="kern-neuigkeiten-einleitung">Hier siehst du, was es Neues zu entdecken gibt.</p>
    <ol>{neu.map(eintrag => <Eintrag key={eintrag.id} eintrag={eintrag}/>)}</ol>
    {frueher.length > 0 && <details className="kern-neuigkeiten-frueher" data-history-disclosure="neuigkeiten-frueher">
      <summary>Früher<ChevronDown className="kern-neuigkeiten-pfeil" size={22} aria-hidden="true"/></summary>
      <ol>{frueher.map(eintrag => <Eintrag key={eintrag.id} eintrag={eintrag}/>)}</ol>
    </details>}
  </article>;
}

function Eintrag({eintrag}: {eintrag: Neuigkeit}) {
  const Symbol = SYMBOLE[eintrag.symbol];
  return <li data-neuigkeit={eintrag.id}>
    <span className="kern-neuigkeiten-symbol" aria-hidden="true"><Symbol size={22} strokeWidth={2}/></span>
    <div>
      <time dateTime={eintrag.datum}>{datumLesbar(eintrag.datum)}</time>
      <h2>{eintrag.titel}</h2>
      <p>{eintrag.text}</p>
    </div>
  </li>;
}
