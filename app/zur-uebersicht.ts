import {useEffect, useRef} from 'react';
// „Spielen“ in der Leiste bei offenem Spiel führt zur Spiele-Übersicht (BACKLOG Phase 1, Punkt 16; Teil B, Aufgabe 9).
// Die App zählt jeden solchen Tipp (`signal`). Ändert sich die Zahl, schließt sich ein offenes Spiel wie mit „Zur Übersicht“;
// der Spielstand bleibt im Pass und lässt sich fortsetzen. Beim ersten Aufbau passiert nichts.
export function useZurUebersicht(signal: number | undefined, offen: boolean, schliessen: () => void) {
  const zuletzt = useRef(signal);
  useEffect(() => {
    if (signal === zuletzt.current) return;
    zuletzt.current = signal;
    if (offen) schliessen();
  }, [signal, offen, schliessen]);
}
