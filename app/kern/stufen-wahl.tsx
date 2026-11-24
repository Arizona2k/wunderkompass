"use client";
// Die gemeinsame Stufenwahl (Teilschritt 3, E2): eine Zeile „Stufe: Profi“ mit „Ändern“.
// Ein Tipp öffnet die drei Stufen, ein zweiter stellt um. Auf Profi und Experte steht
// „Zu schwer? Zurück zu Entdecker“ dabei, außer die Karte spielt ohnehin Entdecker (Spieltest 24.11.2026, Befund 2).
// Kein Alter auf den Knöpfen; das steht nur für Erwachsene im Pass.
import {useEffect, useId, useRef, useState} from 'react';
import {flushSync} from 'react-dom';
import {Check} from 'lucide-react';
import {STUFEN, STUFEN_NAME, type Stufe} from './stufe';

const STUFEN_TEXT: Record<Stufe, string> = {
  entdecker: 'zum Reinkommen',
  // Nicht „vier Antworten“: „Früher oder heute?“ hat auch als Profi drei (Code-Prüfung Teil B, PR 1, Fehler 2).
  // Nicht „Fallen“: klingt nach Reinlegen und lässt sich als „hinfallen“ lesen (kinder-redaktion, 24.11.2026).
  profi: 'etwas kniffliger',
  experte: 'nachdenken und kombinieren',
};

// Stellt die Stufe um und setzt den Fokus gleich danach auf „Ändern“. Nach einem Wechsel baut die Karte „Rate mal!“
// mit neuer Frage neu auf (key={frage.id}); dann ist die alte Stufenwahl weg und mit ihr der Knopf (Code-Prüfung Teil A, Befund 2).
// flushSync baut alles noch im Klick auf, darum liegt der Fokus sofort auf „Ändern“ und nie ein Bild lang auf <body>
// oder dem Pass-Dialog (CI WebKit 24.11.2026; Technik-Prüfung WebKit-Fund, Befund 3a). Ist der alte Knopf noch da,
// bleibt der Fokus dort, sonst geht er an das neue „Ändern“ am selben Ort. `ort` steht schon vor dem Wechsel fest:
// Die Karte selbst darf beim Stufenwechsel nicht neu eingehängt werden (etwa mit der Stufe im key), sonst sucht
// querySelector im alten, abgehängten Element, und der Fokus fiele still auf <body> (Code-Prüfung flushSync, Befund 2).
export function stufeWechseln(wechsel: () => void, ort: ParentNode | null | undefined, knopf?: HTMLButtonElement | null) {
  flushSync(wechsel);
  (knopf?.isConnected ? knopf : ort?.querySelector<HTMLButtonElement>('.stufen-wahl .stufen-aendern'))?.focus();
}

// `hinweis`: ehrlicher Satz, wenn es die gewählte Stufe hier noch nicht gibt (E3), z. B. „Experten-Aufgaben gibt es hier noch nicht. Du spielst Profi.“ (nochNichtSatz in stufe.ts)
// `spielt`: die Stufe, die die Karte wirklich spielt (gespielteStufe); ohne Karte, etwa im Pass, die gewählte.
// `ohneZurueck`: kein „Zu schwer?“, etwa auf dem Abschlussbild einer geschafften Runde (Design-Prüfung Welt-Spiele, Muss 2).
export default function StufenWahl({stufe, spielt = stufe, onStufe, hinweis, ohneZurueck = false}: {stufe: Stufe; spielt?: Stufe; onStufe: (stufe: Stufe) => void; hinweis?: string | null; ohneZurueck?: boolean}) {
  const [offen, setOffen] = useState(false);
  const gruppe = useId(), titel = useId(), aendern = useRef<HTMLButtonElement>(null), gewaehlt = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (offen) gewaehlt.current?.focus(); }, [offen]);
  function waehle(neu: Stufe) {
    const knopf = aendern.current;
    stufeWechseln(() => { onStufe(neu); setOffen(false); }, knopf?.closest('article, dialog, [role="dialog"]') ?? knopf?.ownerDocument, knopf);
  }
  return <div className="stufen-wahl" data-stufe={stufe}>
    <div className="stufen-zeile">
      <p>Stufe: <strong>{STUFEN_NAME[stufe]}</strong></p>
      <button ref={aendern} type="button" className="kern-knopf stufen-aendern" aria-label="Stufe ändern" aria-expanded={offen} aria-controls={offen ? gruppe : undefined} onClick={() => setOffen(o => !o)}>Ändern</button>
    </div>
    {/* Offen ein eigener Kasten mit Titel, damit die drei Stufen nicht wie Antworten aussehen (Design-Prüfung Teil A,
        Befund 1). Der Titel ist zugleich der Name der Gruppe: Vorgelesen wird, was dasteht (Code-Nachprüfung Design, Befund 2). */}
    {offen && <div id={gruppe} className="stufen-knoepfe" role="group" aria-labelledby={titel}>
      <p id={titel} className="stufen-titel">Welche Stufe willst du spielen?</p>
      {STUFEN.map(s => <button key={s} ref={s === stufe ? gewaehlt : undefined} type="button" className="stufen-knopf" aria-pressed={s === stufe} onClick={() => waehle(s)}>
        <strong>{STUFEN_NAME[s]}</strong><span>{STUFEN_TEXT[s]}</span>{s === stufe && <Check size={22} aria-hidden="true"/>}
      </button>)}
    </div>}
    {hinweis && <p className="stufen-hinweis">{hinweis}</p>}
    {!offen && !ohneZurueck && stufe !== 'entdecker' && spielt !== 'entdecker' && <button type="button" className="stufen-zurueck" onClick={() => waehle('entdecker')}>Zu schwer? Zurück zu Entdecker</button>}
  </div>;
}
