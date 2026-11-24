import type { Review } from '../progress-storage';

// Abwechslung in Spielrunden (Teilschritt 3, E7). Rein und ohne React, damit Node-Tests ihn prüfen können.
// Reihenfolge: falsch beantwortet und fällig, noch nie gesehen, fällig, der Rest.
// Aufgaben der vorigen Runde kommen hinter allen Gruppen (Rang 4 + Gruppe; Entscheidungsliste Teil B, Punkt 1): So kommt eine
// falsche Antwort eine Runde später wieder statt sofort, und ist der Vorrat größer als eine Runde, ist die neue
// Runde nie dieselbe wie die vorige.
export type AuswahlEingabe = {
  vorrat: readonly string[];
  review: Review;
  schluessel: (id: string) => string;
  anzahl: number;
  vorige?: readonly string[];
  zufall?: () => number;
  heute?: string;
};

function gemischt<T>(liste: readonly T[], zufall: () => number): T[] {
  const a = [...liste];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Höchstens so viele Experten-Aufgaben je Runde, der Rest kommt aus Profi (Entscheidung des Nutzers, 24.11.2026,
// Entscheidungsliste „drei Spiele“, C1): Bei wenigen Experten-Aufgaben wechseln die Runden sonst nie.
export const EXPERTEN_JE_RUNDE = 3;

export function waehleAufgaben({ vorrat, review, schluessel, anzahl, vorige = [], zufall = Math.random, heute = new Date().toISOString().slice(0, 10) }: AuswahlEingabe): string[] {
  const zuletzt = new Set(vorige);
  const gruppe = (id: string) => {
    const eintrag = review[schluessel(id)];
    if (!eintrag) return 1;
    if (eintrag.due <= heute) return eintrag.correct ? 2 : 0;
    return 3;
  };
  const rang = (id: string) => (zuletzt.has(id) ? 4 : 0) + gruppe(id);
  // Erst mischen, dann stabil nach Rang sortieren: Gleichstand bleibt zufällig.
  const geordnet = gemischt([...new Set(vorrat)], zufall).sort((a, b) => rang(a) - rang(b));
  return gemischt(geordnet.slice(0, Math.max(0, anzahl)), zufall);
}

const textliste = (v: unknown): v is string[] => Array.isArray(v) && v.length > 0 && v.every(x => typeof x === 'string');

// Die zuletzt gespielte Auswahl eines Spielstands: die Runde selbst (items, challenge.ids oder learningRound.ids der
// Klassik-Spiele), sonst die schon gemerkte vorige Runde (zweimal „Neue Runde“ ohne zu spielen).
export function vorigeRunde(sitzung: unknown): string[] {
  if (!sitzung || typeof sitzung !== 'object' || Array.isArray(sitzung)) return [];
  const s = sitzung as Record<string, unknown>;
  const ids = (v: unknown) => v && typeof v === 'object' ? (v as Record<string, unknown>).ids : undefined;
  for (const kandidat of [s.items, ids(s.challenge), ids(s.learningRound), s.vorige]) if (textliste(kandidat)) return [...kandidat];
  return [];
}
