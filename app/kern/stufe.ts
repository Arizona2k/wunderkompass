import type { LocalProgress } from '../progress-storage';

// Eine Stufe für alles (Teilschritt 3, E1). Sie liegt im freien Spielspeicher des Passes,
// darum braucht es keine neue Schema-Version. settings.difficulty wird nur noch gelesen.
export const STUFEN = ['entdecker', 'profi', 'experte'] as const;
export type Stufe = typeof STUFEN[number];
export const STUFE_SCHLUESSEL = 'kern:stufe';

const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
export const istStufe = (v: unknown): v is Stufe => typeof v === 'string' && (STUFEN as readonly string[]).includes(v);

// Die Spiele hatten eigene Stufen: Leicht/Mittel/Schwer ('easy'/'medium'/'hard') oder 0 bis 2.
export function stufeAusAltwert(v: unknown): Stufe | null {
  if (v === 'easy' || v === 0) return 'entdecker';
  if (v === 'medium' || v === 1) return 'profi';
  if (v === 'hard' || v === 2) return 'experte';
  return null;
}

function gewaehlteStufe(progress: Pick<LocalProgress, 'gameSessions'>): Stufe | null {
  const eintrag = record(progress.gameSessions) ? progress.gameSessions[STUFE_SCHLUESSEL] : undefined;
  return record(eintrag) && istStufe(eintrag.stufe) ? eintrag.stufe : null;
}

// Ohne eigene Wahl gilt die alte Quiz-Stufe: Knifflig startet auf Profi, alles andere auf Entdecker.
export function leseStufe(progress: Pick<LocalProgress, 'gameSessions' | 'settings'>): Stufe {
  return gewaehlteStufe(progress) ?? (progress.settings?.difficulty === 'tricky' ? 'profi' : 'entdecker');
}

// Schreibt nur den Stufen-Eintrag. lastActivity bleibt, sonst zeigte „Weiter entdecken“ auf die Stufenwahl.
export function mitStufe(progress: LocalProgress, stufe: Stufe, heute = new Date()): LocalProgress {
  if (!istStufe(stufe) || leseStufe(progress) === stufe) return progress;
  return { ...progress, gameSessions: { ...progress.gameSessions, [STUFE_SCHLUESSEL]: { stufe, seit: heute.toISOString().slice(0, 10) } } };
}
