import type { Review } from './progress-storage';
import { istStufe, type Stufe } from './kern/stufe';
import { waehleAufgaben } from './kern/auswahl';
import { worldGameBank } from './world-game-bank';
import { personenEntdeckerFallen } from './world-game-support.mjs';
import { shuffle } from '../lib/shuffle';
import CATALOG from './world-catalog.json' with { type: 'json' };
import FALLEN from './world-game-fallen.json' with { type: 'json' };
import TIER_FALLEN from './world-game-tier-fallen.json' with { type: 'json' };
import type { WorldTopic } from './world-types';

// Welt-Spiel-Runden mit der gemeinsamen Stufe (Teil B, Aufgabe 8; Plan Teilschritt 3, E4).
// Entdecker spielt 5 Aufgaben, Profi 8. Experte-Aufgaben gibt es in den Welt-Spielen noch nicht (E3): Experte spielt Profi.
export const RUNDEN_GROESSE: Record<Stufe, number> = { entdecker: 5, profi: 8, experte: 8 };
// Spiele mit Stufen. Tierrekorde geht in Aufgabe 10 in „Rekorde“ auf und bleibt bis dahin, wie es ist.
export const STUFEN_SPIELE = ['animal-detective', 'habitats', 'food', 'people', 'technology', 'then-now'] as const;
export const hatStufen = (spiel: string) => (STUFEN_SPIELE as readonly string[]).includes(spiel);

export const weltSpielStufe = (gewaehlt: Stufe): Stufe => (gewaehlt === 'experte' ? 'profi' : gewaehlt);

export type WeltRunde = { items: string[]; stufe: Stufe; orders: Record<string, string[]> };
export type WeltRundeEingabe = { spiel: string; stufe: Stufe; review: Review; vorige: readonly string[]; zufall?: () => number; heute?: string };

// Profi-Fallen (Schritt 8.2, E5): Tierdetektiv aus derselben Tiergruppe (kleine Gruppen zusammengelegt), Technik aus
// derselben Zeit (die fünf nächsten Jahre), Personen aus demselben Gebiet und derselben Zeit (personenFallen). Paare, bei
// denen der Hinweis auch passt, stehen in world-game-fallen.json und kommen nie als Falle (geprüft vom fakten-pruefer).
const TOPICS = CATALOG as WorldTopic[];
const TIERGRUPPE: Record<string, string> = { Säugetiere: 'saeugetiere', Vögel: 'voegel', Fische: 'fische-amphibien-reptilien', Amphibien: 'fische-amphibien-reptilien', Reptilien: 'fische-amphibien-reptilien', Weichtiere: 'wirbellose', Insekten: 'wirbellose', Spinnentiere: 'wirbellose', Krebstiere: 'wirbellose' };
const AUSSCHLUSS = FALLEN.ausschluss as Record<string, Record<string, string[]>>;
const jahr = (t: WorldTopic) => Number((t.person ? t.person.lifespan : String(t.invention?.year ?? '')).match(/\d{3,4}/)?.[0]);

export function profiKandidaten(spiel: string, id: string): string[] {
  const t = TOPICS.find(x => x.id === id), nicht = AUSSCHLUSS[spiel]?.[id] ?? [];
  if (!t) return [];
  const frei = (x: WorldTopic) => x.id !== id && !nicht.includes(x.id);
  if (spiel === 'animal-detective' && t.animal) return TOPICS.filter(x => x.animal && frei(x) && TIERGRUPPE[x.animal.group] === TIERGRUPPE[t.animal!.group]).map(x => x.id);
  if (spiel === 'people' && GEBIETE[id]) { const { gebiet, zeit } = personenFallen(id); return [...new Set([...gebiet, ...zeit])]; }
  return zeitlichNaechste(spiel, id);
}
function zeitlichNaechste(spiel: string, id: string): string[] {
  const t = TOPICS.find(x => x.id === id), nicht = AUSSCHLUSS[spiel]?.[id] ?? [];
  const art = spiel === 'people' ? 'person' : spiel === 'technology' ? 'invention' : null;
  if (!t || !art || !t[art]) return [];
  return TOPICS.filter(x => x[art] && x.id !== id && !nicht.includes(x.id)).sort((a, b) => Math.abs(jahr(a) - jahr(t)) - Math.abs(jahr(b) - jahr(t)) || a.title.localeCompare(b.title, 'de')).slice(0, 5).map(x => x.id);
}

// Personen-Rätsel (Endfassung 25.11.2026, Abschnitte 2 und 7): Jede Person hat ein Gebiet, höchstens zwei.
// Entdecker: Fallen aus anderen Gebieten, nie aus Liste A (ausschluss.people) oder Liste B (nichtAufEntdecker, beide Richtungen).
// Profi: Fallen aus demselben Gebiet, dazu die fünf zeitlich nächsten; nie aus Liste A. `erst` sind die Personen aus dem
// Erstgebiet der gesuchten Person (stufen-pruefer beim Einbau, 25.11.2026: sonst kam bei Franklin jede fünfte Runde ohne
// Physik-Falle, und „Röntgenstrahlen“ schloss alle Fallen sofort aus).
const GEBIETE = FALLEN.personen.gebiete as Record<string, string[]>;
const gleichesGebiet = (a: string, b: string) => (GEBIETE[a] ?? []).some(g => (GEBIETE[b] ?? []).includes(g));
export function personenFallen(id: string): { entdecker: string[]; erst: string[]; gebiet: string[]; zeit: string[] } {
  const nicht = AUSSCHLUSS.people?.[id] ?? [], andere = TOPICS.filter(x => x.person && x.id !== id && !nicht.includes(x.id)).map(x => x.id);
  const erstes = GEBIETE[id]?.[0];
  return {
    entdecker: personenEntdeckerFallen(id),
    erst: andere.filter(x => erstes !== undefined && (GEBIETE[x] ?? []).includes(erstes)),
    gebiet: andere.filter(x => gleichesGebiet(id, x)),
    zeit: zeitlichNaechste('people', id),
  };
}
// Profi: zwei Fallen aus dem Gebiet, die erste davon immer aus dem Erstgebiet (gibt es dort nur eine Person, eine), die
// übrigen aus der Zeit. Entdecker: zwei aus anderen Gebieten.
// Zwei Fallen, die ein Paar aus Liste A sind (beide Benz), kommen nie zusammen in eine Aufgabe.
function personenAntworten(stufe: Stufe, frage: { id: string; answers: string[]; correct: number }, zufall: () => number): string[] | null {
  const { entdecker, erst, gebiet, zeit } = personenFallen(frage.id), anzahl = stufe === 'profi' ? 3 : 2;
  const dazu = (fallen: string[], kandidaten: string[], bis: number) => { for (const x of shuffle(kandidaten, zufall)) if (fallen.length < bis && !fallen.some(f => f === x || paarA(f, x))) fallen.push(x); return fallen; };
  const fallen = stufe === 'profi' ? dazu(dazu(dazu([], erst, 1), gebiet, 2), zeit, 3) : dazu([], entdecker, 2);
  return fallen.length === anzahl ? shuffle([frage.answers[frage.correct], ...fallen.map(titel)], zufall) : null;
}
const paarA = (a: string, b: string) => (AUSSCHLUSS.people?.[a] ?? []).includes(b) || (AUSSCHLUSS.people?.[b] ?? []).includes(a);

// Lebensraum und Nahrung (Schritt 8.3, E9): Fallen je Runde aus einer geprüften Liste je Tier, Entdecker zwei deutlich andere,
// Profi drei ähnliche (world-game-tier-fallen.json; Entscheidungsliste Teil B, Punkt 6).
type TierFallen = Record<string, { entdecker: string[]; profi: string[] }>;
export const tierFallen = (spiel: string): TierFallen | null => spiel === 'habitats' ? TIER_FALLEN.lebensraum : spiel === 'food' ? TIER_FALLEN.nahrung : null;

function antworten(spiel: string, stufe: Stufe, frage: { id: string; answers: string[]; correct: number }, zufall: () => number): string[] {
  const liste = tierFallen(spiel)?.[frage.id]?.[stufe === 'profi' ? 'profi' : 'entdecker'];
  const anzahl = stufe === 'profi' ? 3 : 2;
  if (liste && liste.length >= anzahl) return shuffle([frage.answers[frage.correct], ...shuffle(liste, zufall).slice(0, anzahl)], zufall);
  const personen = spiel === 'people' && GEBIETE[frage.id] ? personenAntworten(stufe, frage, zufall) : null;
  if (personen) return personen;
  if (stufe !== 'profi') return entdeckerAntworten(spiel, frage, zufall);
  const kandidaten = profiKandidaten(spiel, frage.id);
  if (kandidaten.length < 3) return shuffle(frage.answers, zufall);
  const fallen = shuffle(kandidaten, zufall).slice(0, 3).map(titel);
  return shuffle([frage.answers[frage.correct], ...fallen], zufall);
}
const titel = (id: string) => TOPICS.find(x => x.id === id)!.title;

// Entdecker behält die festen Antworten. Steht eine feste Falle auf der Ausschlussliste (der Hinweis passt auch dort,
// etwa Chamäleon und Seepferdchen), kommt statt ihr eine geprüfte Falle aus derselben Gruppe oder Zeit (Stufen-Prüfung Teil B, M3).
function entdeckerAntworten(spiel: string, frage: { id: string; answers: string[]; correct: number }, zufall: () => number): string[] {
  const nicht = new Set((AUSSCHLUSS[spiel]?.[frage.id] ?? []).map(id => TOPICS.find(x => x.id === id)?.title));
  if (!frage.answers.some((a, i) => i !== frage.correct && nicht.has(a))) return shuffle(frage.answers, zufall);
  const ersatz = shuffle(profiKandidaten(spiel, frage.id).map(titel).filter(t => !frage.answers.includes(t)), zufall);
  return shuffle(frage.answers.map((a, i) => (i !== frage.correct && nicht.has(a) ? ersatz.shift() ?? a : a)), zufall);
}

// Antworten für die Aufgaben einer Runde, passend zu ihrer Stufe. Auch für gespeicherte Runden, deren Reihenfolge fehlt
// oder nicht mehr gilt: Eine Entdecker-Runde bekommt dann drei Antworten, nicht vier (Code-Prüfung Teil B, PR 1).
export function rundenAntworten(spiel: string, stufe: Stufe, items: readonly string[], zufall: () => number = Math.random): Record<string, string[]> {
  const gespielt = hatStufen(spiel) ? weltSpielStufe(stufe) : 'entdecker';
  const pool = worldGameBank(spiel);
  return Object.fromEntries(items.flatMap(id => { const frage = pool.find(q => q.id === id); return frage ? [[id, antworten(spiel, gespielt, frage, zufall)]] : []; }));
}

export function neueWeltRunde({ spiel, stufe, review, vorige, zufall = Math.random, heute }: WeltRundeEingabe): WeltRunde {
  const gespielt = hatStufen(spiel) ? weltSpielStufe(stufe) : 'entdecker';
  const pool = worldGameBank(spiel);
  const items = waehleAufgaben({ vorrat: pool.map(q => q.id), review, schluessel: id => 'world-game:' + spiel + ':' + id, anzahl: RUNDEN_GROESSE[gespielt], vorige, zufall, heute });
  return { items, stufe: gespielt, orders: rundenAntworten(spiel, gespielt, items, zufall) };
}

// Die Stufe einer gespeicherten Runde. Runden aus der Zeit vor Teil B haben keine und spielen Entdecker (E1).
export function rundenStufe(sitzung: unknown): Stufe {
  const stufe = sitzung && typeof sitzung === 'object' && !Array.isArray(sitzung) ? (sitzung as Record<string, unknown>).stufe : undefined;
  return istStufe(stufe) ? stufe : 'entdecker';
}

// Höchste geschaffte Stufe (E13): unsichtbar bis zu den Belohnungen in Teilschritt 5. Gemerkt wird je Stufe das erste Datum,
// nur Profi und Experte. „Neue Runde“ und ein Stufenwechsel behalten den Eintrag (world-games.tsx).
export type Geschafft = Partial<Record<'profi' | 'experte', string>>;
const tag = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
export function leseGeschafft(wert: unknown): Geschafft {
  if (!wert || typeof wert !== 'object' || Array.isArray(wert)) return {};
  const w = wert as Record<string, unknown>, aus: Geschafft = {};
  for (const stufe of ['profi', 'experte'] as const) if (tag(w[stufe])) aus[stufe] = w[stufe] as string;
  return aus;
}
export function mitGeschafft(geschafft: unknown, stufe: Stufe, heute = new Date().toISOString().slice(0, 10)): Geschafft {
  const bisher = leseGeschafft(geschafft);
  return stufe === 'entdecker' || bisher[stufe] ? bisher : { ...bisher, [stufe]: heute };
}
