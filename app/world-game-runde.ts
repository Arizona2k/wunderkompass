import type { Review } from './progress-storage';
import { istStufe, type Stufe } from './kern/stufe';
import { waehleAufgaben } from './kern/auswahl';
import { worldGameBank } from './world-game-bank';
import { shuffle } from '../lib/shuffle';

// Welt-Spiel-Runden mit der gemeinsamen Stufe (Teil B, Aufgabe 8; Plan Teilschritt 3, E4).
// Entdecker spielt 5 Aufgaben, Profi 8. Experte-Aufgaben gibt es in den Welt-Spielen noch nicht (E3): Experte spielt Profi.
export const RUNDEN_GROESSE: Record<Stufe, number> = { entdecker: 5, profi: 8, experte: 8 };
// Spiele mit Stufen. Tierrekorde geht in Aufgabe 10 in „Rekorde“ auf und bleibt bis dahin, wie es ist.
export const STUFEN_SPIELE = ['animal-detective', 'habitats', 'food', 'people', 'technology', 'then-now'] as const;
export const hatStufen = (spiel: string) => (STUFEN_SPIELE as readonly string[]).includes(spiel);

export const weltSpielStufe = (gewaehlt: Stufe): Stufe => (gewaehlt === 'experte' ? 'profi' : gewaehlt);

export type WeltRunde = { items: string[]; stufe: Stufe; orders: Record<string, string[]> };
export type WeltRundeEingabe = { spiel: string; stufe: Stufe; review: Review; vorige: readonly string[]; zufall?: () => number; heute?: string };

export function neueWeltRunde({ spiel, stufe, review, vorige, zufall = Math.random, heute }: WeltRundeEingabe): WeltRunde {
  const gespielt = hatStufen(spiel) ? weltSpielStufe(stufe) : 'entdecker';
  const pool = worldGameBank(spiel);
  const items = waehleAufgaben({ vorrat: pool.map(q => q.id), review, schluessel: id => 'world-game:' + spiel + ':' + id, anzahl: RUNDEN_GROESSE[gespielt], vorige, zufall, heute });
  const orders = Object.fromEntries(items.map(id => [id, shuffle(pool.find(q => q.id === id)!.answers, zufall)]));
  return { items, stufe: gespielt, orders };
}

// Die Stufe einer gespeicherten Runde. Runden aus der Zeit vor Teil B haben keine und spielen Entdecker (E1).
export function rundenStufe(sitzung: unknown): Stufe {
  const stufe = sitzung && typeof sitzung === 'object' && !Array.isArray(sitzung) ? (sitzung as Record<string, unknown>).stufe : undefined;
  return istStufe(stufe) ? stufe : 'entdecker';
}
