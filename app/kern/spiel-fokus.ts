// Gemeinsame Fokuswege der Spielrunden, für Welt-Spiele, Kreuz und quer und „Stimmt das wirklich?“/„Wer lebt wo?“ gleich
// (Spieltest PR 2, Befunde 2 bis 4).

type Ref = { current: HTMLElement | null };

// Nach jeder Antwort rollt der Rückmeldekasten ins Bild, auf dem Handy über die untere Leiste (scroll-padding-bottom in
// kern.css): Kinder sehen „Noch nicht ganz“ mit der Denkfrage oder „Richtig!“ mit der Auflösung, ohne selbst zu suchen
// (Spieltest Personen-Rätsel, Muss 1, 25.11.2026). Steht er schon ganz im Bild, bleibt die Seite stehen.
// Nach einer richtigen Antwort sind die Antwortknöpfe gesperrt, der Fokus fiele sonst auf die Seite. Er geht darum ohne
// weiteres Rollen auf „Nächste Aufgabe“. Nach einer falschen bleibt er auf der gewählten Antwort.
// Passt der Kasten nicht ganz ins Bild (kleines Handy, große Schrift, lange Erklärung), steht sein Anfang oben, damit
// „Richtig!“ zu sehen ist, und der Fokus geht auf diese Überschrift (tabIndex -1 im Kasten), nicht auf den Knopf unter
// der Leiste. Mit Tab geht es von dort zu „Nächste Aufgabe“, in Welt-Spielen erst noch zu „Erklärung vorlesen“
// (code-pruefer, Soll 3).
// Der Abstand des Kastens zum Rand (scroll-margin in kern.css) zählt beim Platz mit, wie beim Rollen selbst.
export function zurRueckmeldung(kasten: Ref, weiter?: Ref) {
  requestAnimationFrame(() => {
    const k = kasten.current;
    if (!k) return void weiter?.current?.focus({ preventScroll: true });
    const leiste = parseFloat(getComputedStyle(document.documentElement).scrollPaddingBottom) || 0;
    const rand = getComputedStyle(k), luft = (parseFloat(rand.scrollMarginTop) || 0) + (parseFloat(rand.scrollMarginBottom) || 0);
    const passt = k.getBoundingClientRect().height + luft <= innerHeight - leiste;
    k.scrollIntoView({ block: passt ? 'nearest' : 'start' });
    if (!weiter) return;
    const ziel = passt ? weiter.current : k.querySelector<HTMLElement>('[tabindex="-1"]') ?? weiter.current;
    ziel?.focus({ preventScroll: true });
  });
}

// Geht der Fokus mit Tab von „Richtig!“ zu „Erklärung vorlesen“ und „Nächste Aufgabe“ und liegt der Knopf schon im
// Fenster, aber hinter der unteren Leiste, rollt Firefox gar nicht (Chromium und WebKit beachten die Leiste): Der Knopf
// bliebe samt Fokusrahmen dahinter (Spieltest-Nachprüfung, Muss 1; gemessen mit der Suite spiel-fokus). Darum rollt die
// Seite ihn dann selbst darüber (scrollIntoView beachtet scroll-padding-bottom und den scroll-margin
// der Knöpfe in kern.css). Der scroll-margin zählt auch beim Prüfen mit: Endet ein Knopf nur knapp über der Leiste,
// läge sonst sein Fokusrahmen dahinter (Fokus-Test mit 320 × 400 px in Firefox, 25.11.2026). Nur bei Wechseln innerhalb
// des Kastens: Den ersten Fokus nach der Antwort setzt zurRueckmeldung, mitten im Rollen zum Kasten.
export function imKastenSichtbar(e: { target: EventTarget; currentTarget: HTMLElement; relatedTarget: EventTarget | null }) {
  const ziel = e.target as HTMLElement, vorher = e.relatedTarget as Node | null;
  if (!vorher || ziel === e.currentTarget || !e.currentTarget.contains(vorher)) return;
  const leiste = parseFloat(getComputedStyle(document.documentElement).scrollPaddingBottom) || 0;
  const rand = parseFloat(getComputedStyle(ziel).scrollMarginBottom) || 0;
  if (ziel.getBoundingClientRect().bottom + rand > innerHeight - leiste) ziel.scrollIntoView({ block: 'nearest' });
}

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
