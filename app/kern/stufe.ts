import type { Difficulty, LocalProgress } from '../progress-storage';

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

// Das alte Quiz kannte Einfach, Normal und Knifflig. Bis es in Teil B ganz umzieht, folgt es der gemeinsamen Stufe.
export const quizStufe = (stufe: Stufe): Difficulty => stufe === 'entdecker' ? 'normal' : 'tricky';

export const STUFEN_NAME: Record<Stufe, string> = { entdecker: 'Entdecker', profi: 'Profi', experte: 'Experte' };
// Nur für Zusammensetzungen mit Bindestrich, z. B. „Experten-Fragen“ (Fugen-n; kinder-redaktion 24.11.2026).
// Überall sonst steht der Name, wie er ist („Stufe: Experte“).
export const STUFEN_BINDEFORM: Record<Stufe, string> = { entdecker: 'Entdecker', profi: 'Profi', experte: 'Experten' };

// Gemeinsame Sätze der Stufenzeile für Karten und Spiele (kinder-redaktion, 24.11.2026): überall gleich, die Stufe beim Namen.
export const nochNichtSatz = (gewaehlt: Stufe, gespielt: Stufe) => `${STUFEN_BINDEFORM[gewaehlt]}-Aufgaben gibt es hier noch nicht. Du spielst ${STUFEN_NAME[gespielt]}.`;
export const rundeNochSatz = (gespielt: Stufe, naechste: Stufe) => `Diese Runde spielst du noch als ${STUFEN_NAME[gespielt]}. Ab der nächsten Runde spielst du ${STUFEN_NAME[naechste]}.`;

// Vorschläge statt Automatik (E8). Die Folge lebt nur, solange die Seite offen ist, nie im Pass.
// Gezählt wird je Frage nur die erste Antwort; nach einem Stufenwechsel beginnt die Folge neu.
// Es zählen nur Fragen genau der gewählten Stufe: Leichtere Fragen (z. B. die Hauptfrage auf einer Karte ohne Profi-Frage)
// sagen nichts darüber, ob Profi zu leicht oder zu schwer ist. Sie lassen die Folge, wie sie ist.
export type Folge = { stufe: Stufe | null; antworten: boolean[]; gezaehlt: string[]; gefragt: string[] };
export type StufenVorschlag = { richtung: 'schwerer' | 'leichter'; ziel: Stufe; text: string };
export const leereFolge = (): Folge => ({ stufe: null, antworten: [], gezaehlt: [], gefragt: [] });

export function mitErsterAntwort(folge: Folge, frage: string, richtig: boolean, stufe: Stufe, frageStufe: Stufe = stufe): Folge {
  if (frageStufe !== stufe || folge.gezaehlt.includes(frage)) return folge;
  const bisher = folge.stufe === stufe ? folge.antworten : [];
  return { ...folge, stufe, antworten: [...bisher, richtig].slice(-3), gezaehlt: [...folge.gezaehlt, frage] };
}

// Höchstens ein Vorschlag je Runde (oder Karte). Danach braucht es wieder eine neue Folge.
export function stufenVorschlag(folge: Folge, stufe: Stufe, runde: string): StufenVorschlag | null {
  if (folge.stufe !== stufe || folge.gefragt.includes(runde)) return null;
  const i = STUFEN.indexOf(stufe), letzte = (n: number) => folge.antworten.length >= n ? folge.antworten.slice(-n) : null;
  if (i < STUFEN.length - 1 && letzte(3)?.every(Boolean)) {
    const ziel = STUFEN[i + 1];
    return { richtung: 'schwerer', ziel, text: `Das war leicht für dich. Willst du ${STUFEN_NAME[ziel]} probieren?` };
  }
  if (i > 0 && letzte(2)?.every(r => !r)) return { richtung: 'leichter', ziel: STUFEN[i - 1], text: 'Ganz schön knifflig. Willst du eine Stufe leichter spielen?' };
  return null;
}

export const nachVorschlag = (folge: Folge, runde: string): Folge => ({ ...folge, antworten: [], gefragt: [...folge.gefragt, runde] });

// Spiele (Code-Nachprüfung PR 2, Befund 1): Ein Vorschlag kommt nur, wenn die Runde auf der gewählten Stufe läuft, wie auf
// der Karte. Läuft noch eine Runde einer anderen Stufe (eine alte Runde, oder die Stufe wurde gerade woanders geändert), hat
// das Kind schon gewählt; ein Vorschlag könnte die Stufe im Pass sonst in die falsche Richtung oder um zwei Stufen umstellen.
// Und nur zu einer Stufe, die das Spiel wirklich anders spielt (`spielStufe`: Experte spielt Profi, solange ein Spiel keine
// echten Experten-Aufgaben hat); das schließt die schon gewählte Stufe mit ein.
export const spielVorschlagErlaubt = (gewaehlt: Stufe, gespielt: Stufe, spielStufe: (s: Stufe) => Stufe = s => s) =>
  (ziel: Stufe): boolean => spielStufe(gewaehlt) === gespielt && spielStufe(ziel) !== gespielt;

// Eine Antwort verbuchen. `erlaubt` lässt nur Vorschläge zu einer Stufe zu, die das Spiel wirklich anders spielt; ein
// unterdrückter Vorschlag verbraucht den einen Vorschlag der Runde nicht (Code-Prüfung PR 2, Hinweis 6).
export function nachAntwort(folge: Folge, frage: string, richtig: boolean, stufe: Stufe, frageStufe: Stufe, runde: string, erlaubt: (ziel: Stufe) => boolean = () => true): { folge: Folge; vorschlag: StufenVorschlag | null } {
  const neu = mitErsterAntwort(folge, frage, richtig, stufe, frageStufe);
  if (neu === folge) return { folge, vorschlag: null };
  const kandidat = stufenVorschlag(neu, stufe, runde), vorschlag = kandidat && erlaubt(kandidat.ziel) ? kandidat : null;
  return { folge: vorschlag ? nachVorschlag(neu, runde) : neu, vorschlag };
}
