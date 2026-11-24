"use client";
// Vorschläge statt Automatik (Teilschritt 3, E8): ein kleiner Hinweis in der Rückmeldung, kein Fenster.
// Die Folge der ersten Antworten lebt nur, solange die Seite offen ist (Modul-Variable), nie im Pass.
// Höchstens ein Vorschlag je Runde (Karte); die Seite stellt nie selbst um.
import {useCallback, useState} from 'react';
import {leereFolge, nachAntwort, STUFEN_NAME, type Stufe, type StufenVorschlag} from './stufe';

let folge = leereFolge();

// `stufe`: die Stufe, an der gemessen wird (Karte: die gewählte; Spiele: die, die die Runde wirklich spielt).
// `erlaubt`: nur Vorschläge zu diesen Zielen zeigen (Spiele, in denen Experte noch Profi spielt).
export function useStufenVorschlag(runde: string, stufe: Stufe, erlaubt?: (ziel: Stufe) => boolean) {
  const [vorschlag, setVorschlag] = useState<StufenVorschlag | null>(null);
  // Jede Antwort melden; nur die erste je Frage und nur Fragen der gemessenen Stufe zählen (mitErsterAntwort).
  const merke = useCallback((frage: string, richtig: boolean, frageStufe: Stufe) => {
    const neu = nachAntwort(folge, frage, richtig, stufe, frageStufe, runde, erlaubt);
    folge = neu.folge;
    if (neu.vorschlag) setVorschlag(neu.vorschlag);
  }, [runde, stufe, erlaubt]);
  const schliessen = useCallback(() => setVorschlag(null), []);
  return {vorschlag, merke, schliessen};
}

export function StufenVorschlagHinweis({vorschlag, onJa, onNein}: {vorschlag: StufenVorschlag; onJa: () => void; onNein: () => void}) {
  // Kein eigenes role="status": Der Hinweis steht in der Rückmeldung, und die meldet sich schon selbst an.
  return <div className="stufen-vorschlag">
    <p>{vorschlag.text}</p>
    <div className="stufen-vorschlag-knoepfe">
      <button type="button" className="kern-knopf stufen-vorschlag-ja" onClick={onJa}>{vorschlag.richtung === 'schwerer' ? `Ja, ${STUFEN_NAME[vorschlag.ziel]} probieren` : 'Ja, leichter spielen'}</button>
      <button type="button" className="kern-knopf" onClick={onNein}>Nein, ich bleibe</button>
    </div>
  </div>;
}
