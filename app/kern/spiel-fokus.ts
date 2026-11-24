// Gemeinsame Fokuswege der Spielrunden, für Welt-Spiele, Kreuz und quer und „Stimmt das wirklich?“/„Wer lebt wo?“ gleich
// (Spieltest PR 2, Befunde 2 bis 4).

// Nach einer richtigen Antwort geht der Fokus auf „Nächste Aufgabe“: Die Antwortknöpfe sind dann gesperrt, der Fokus fiele
// sonst auf die Seite. Der Knopf rollt dabei in den Blick, auf dem Handy auch unter dem Bildrand hervor.
export const zumWeiterKnopf = (knopf: { current: HTMLElement | null }) => requestAnimationFrame(() => knopf.current?.focus());

// Nach „Nächste Aufgabe“ oder „Noch eine Runde“ geht der Fokus auf die neue Frage. Liegt der Anfang des Spielbretts über dem
// Bildrand (oder die Frage darunter), rollt die Seite zum Brett, bis Stufenzeile, „Aufgabe … von …“ und die ganze Frage zu
// sehen sind. Sonst bleibt die Seite stehen.
export function zurFrage(frage: () => HTMLElement | null) {
  requestAnimationFrame(() => {
    const h = frage();
    if (!h) return;
    h.focus({ preventScroll: true });
    const brett = h.closest<HTMLElement>('.game-board') ?? h;
    if (brett.getBoundingClientRect().top < 0 || h.getBoundingClientRect().bottom > innerHeight) brett.scrollIntoView({ block: 'start' });
  });
}
