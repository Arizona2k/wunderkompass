"use client";
// Vorschläge statt Automatik (Teilschritt 3, E8): ein kleiner Hinweis unter der Rückmeldung, kein Fenster.
// Die Folge der ersten Antworten lebt nur, solange die Seite offen ist (Modul-Variable), nie im Pass.
// Höchstens ein Vorschlag je Runde (Karte); die Seite stellt nie selbst um.
import {useCallback, useState} from 'react';
import {leereFolge, mitErsterAntwort, nachVorschlag, stufenVorschlag, STUFEN_NAME, type Stufe, type StufenVorschlag} from './stufe';

let folge = leereFolge();

export function useStufenVorschlag(runde: string, stufe: Stufe) {
  const [vorschlag, setVorschlag] = useState<StufenVorschlag | null>(null);
  // Jede Antwort melden; nur die erste je Frage und nur Fragen der gewählten Stufe zählen (mitErsterAntwort).
  const merke = useCallback((frage: string, richtig: boolean, frageStufe: Stufe) => {
    const neu = mitErsterAntwort(folge, frage, richtig, stufe, frageStufe);
    if (neu === folge) return;
    const naechster = stufenVorschlag(neu, stufe, runde);
    folge = naechster ? nachVorschlag(neu, runde) : neu;
    if (naechster) setVorschlag(naechster);
  }, [runde, stufe]);
  const schliessen = useCallback(() => setVorschlag(null), []);
  return {vorschlag, merke, schliessen};
}

export function StufenVorschlagHinweis({vorschlag, onJa, onNein}: {vorschlag: StufenVorschlag; onJa: () => void; onNein: () => void}) {
  return <div className="stufen-vorschlag" role="status">
    <p>{vorschlag.text}</p>
    <div className="stufen-vorschlag-knoepfe">
      <button type="button" className="kern-knopf stufen-vorschlag-ja" onClick={onJa}>{vorschlag.richtung === 'schwerer' ? `Ja, ${STUFEN_NAME[vorschlag.ziel]} probieren` : 'Ja, leichter spielen'}</button>
      <button type="button" className="kern-knopf" onClick={onNein}>Nein, ich bleibe</button>
    </div>
  </div>;
}
