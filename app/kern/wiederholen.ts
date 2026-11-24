import type {LocalProgress} from '../progress-storage';

// Ob die Hauptfrage einer Karte im Wissensbuch unter „Ein Gedanke zum Wiederholen“ wartet: falsch beantwortet oder wieder
// fällig. Dieselbe Regel gilt für die Liste im Wissensbuch und für „Noch einmal nachdenken“ auf der Karte (frageZumNachdenken).
export const wartetZumWiederholen = (eintrag: LocalProgress['review'][string] | undefined, heute = new Date().toISOString().slice(0, 10)) =>
  !!eintrag && (!eintrag.correct || eintrag.due <= heute);
