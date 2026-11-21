# Phase 1, Teilschritt 1 „Aussehen und Hülle“ – Bauplan

> **Für ausführende Agenten:** Pflicht-Skill: superpowers:executing-plans (gewählt: Claude baut selbst in dieser Sitzung) oder superpowers:subagent-driven-development. Schritte haben Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Die ganze Seite bekommt die neue Grundlage (Schrift Nunito, Farben, ruhiger Fokus). Dazu kommen eine neue Hülle (Kopfzeile, Bereichsleiste, Fuß) und eine neue, kurze „Was ist neu?“-Seite.

**Aufbau:** Die neuen Teile entstehen in `app/kern/`: kleine Dateien mit normaler Zeilenlänge und eine eigene Gestaltungsdatei `app/kern/kern.css`. Diese Datei wird als letzte in `app/globals.css` eingebunden. `app/earth-explorer.tsx` behält Zustand und Logik. Die Hülle schneiden wir dort heraus und setzen die neuen Bausteine ein. Alte Regeln und Dateien, die niemand mehr braucht, werden gelöscht. So bleibt das CSS im Budget.

**Technik:** React 19, Vite 8, Tailwind 4, lucide-react 1.31.0, `@fontsource-variable/nunito` 5.3.0 (neu), Node-Testrunner, eigener Playwright-Runner (`tests/browser/run.mjs`).

**Entwurf:** [2026-11-21-phase-1-entwurf.md](2026-11-21-phase-1-entwurf.md), vor allem 6.1, 6.2, 6.7, 9 und 10.

## Feste Vorgaben (gelten für jede Aufgabe)

- Pass bleibt unberührt: Schema 3, App-ID `earth-explorer`, Schlüssel `erde-entdecken:save:v3`, Altpass `erde-entdecken:forscherpass:v2`, IndexedDB `earth-explorer`.
- Hash-Links bleiben: `#home`, `#world/...`, `#games`, `#labs/...`, `#journeys/...`, `#book/...`, `#updates`; alte `#news/...` führen nach `#home`. Keine ID wird umbenannt.
- Der Pass-Knopf behält `aria-label="Entdeckerpass öffnen"` und bleibt `disabled`, bis der Pass geladen ist (rund 45 Testdateien warten darauf).
- Tippflächen mindestens 48 × 48 px, Abstand zwischen Tippzielen mindestens 8 px.
- Fließtext 18 px, Zeilenhöhe 1,5. Kleinster Text 14 px.
- Text erreicht WCAG AA (4,5 : 1).
- Kein Dunkelmodus (`color-scheme: light`).
- Schrift Nunito 5.3.0 (OFL-1.1), nur der lateinische Zeichensatz, offline mitgeliefert. Ersatzschriften: `"Trebuchet MS", Arial, sans-serif`.
- Bewegung 150–250 ms. Bei „Bewegung reduzieren“ (System oder `settings.reducedMotion`) gibt es keine Animation.
- Budgets: Einstiegs-CSS und Einstiegs-JS werden nicht größer als vor Aufgabe 1 (Ausgangswert in Schritt 0 messen).
- Neue Pakete: kostenlos, exakt gepinnt, mindestens 7 Tage alt.
- Tests: Keine Prüfung abschwächen oder überspringen. Tests auf entfernte Ansichten entfallen. Was sie geschützt haben, prüft ein Ersatztest an der neuen Ansicht.
- Commits: `git -c user.name=Claude -c user.email=noreply@anthropic.com commit …`, deutsche Betreffzeile, Abschlusszeilen laut Sitzung. Vor jedem Push `git diff --check` und Autor/Committer prüfen.
- Befehle im Container erst nach `export PATH=/opt/node24/bin:$PATH`.

## Abweichung vom Entwurf (Claudes Entscheidung, dem Nutzer mitgeteilt)

Die Bereichsleiste zeigt **auf allen Breiten dieselben kurzen Wörter**: Start, Welten, Spielen, Labor, Reisen, Buch. Laut Entwurf 6.2 sollte es ab Tablet die langen Namen geben. Gründe:

- Ein Kind findet auf Handy, Tablet und Rechner dieselben Wörter.
- Die kurzen Wörter passen überall in eine Zeile.
- Bildschirmleser und Tests hören auf allen Breiten denselben Namen.

## Worauf Prüfer besonders achten

Fünf Fälle, die der Entwurf nicht ausdrücklich nennt, die Kinder aber treffen würden (jeder hat einen Test in der zuständigen Aufgabe):

1. **Leiste verdeckt etwas.** Die feste Leiste unten darf weder das Seitenende noch ein fokussiertes Element verdecken, zum Beispiel den Knopf „Für Eltern“, nachdem der Dialog geschlossen wurde. → Aufgabe 3, Test `leisteVerdecktNichts`.
2. **Dialoge über der Leiste.** Suche, Pass und Eltern-Dialog liegen auf dem Handy vollständig über der Leiste. → Aufgabe 3, Test `dialogUeberLeiste`.
3. **Große Schrift bei 320 px.** Mit der Pass-Einstellung „Größere Schrift“ wird bei 320 px kein Wort der Leiste abgeschnitten, und jede Tippfläche bleibt mindestens 48 px groß. → Aufgabe 3, Test `grosseSchrift320`.
4. **Zurück im Browser.** Nach einem Tipp in der Leiste stellt „Zurück“ die Leseposition wieder her, und die Markierung des aktiven Bereichs stimmt. → Aufgabe 3, Test `zurueckNachLeiste`.
5. **Offline-Kaltstart.** Die Schrift kommt beim Kaltstart offline aus dem Vorrat, nicht aus dem Netz. → Aufgabe 1, Zusatz in `tests/browser/offline-cold.mjs`.

---

## Schritt 0: Ausgangswerte messen

- [ ] `pnpm install --frozen-lockfile && pnpm run build`. Die Werte für Einstiegs-JS, Einstiegs-JS gzip, Einstiegs-CSS und Einstiegs-CSS gzip aus der Ausgabe notieren (nur im Notizblock, nicht im Repository). Sie sind die Obergrenzen für Aufgabe 5.

---

### Aufgabe 1: Grundlage – Schrift, Farben, ruhiger Fokus

**Dateien:**
- Neu: `app/kern/kern.css`, `public/licenses/nunito-OFL.txt`, `tests/browser/kern-huelle.mjs`
- Ändern: `package.json`, `pnpm-lock.yaml`, `app/globals.css` (Import, `:root`-Werte, `--font-sans`, `body`), `app/article-atlas.css` (Regel `.article-atlas [tabindex="-1"]:focus` löschen), `app/parent-guide.tsx` (Lizenz-Link), `tests/browser/suites.mjs`, `tests/browser/offline-cold.mjs`

**Schnittstellen:**
- Erzeugt: CSS-Werte auf `:root` (siehe Schritt 3), die alle späteren Aufgaben nutzen; Suite `kern-huelle` (Satz `ci`) mit `export async function kernHuelle(ctx)`, die Aufgabe 3 und 4 erweitern.

- [ ] **Schritt 1: Prüfung schreiben.** Neue Suite `tests/browser/kern-huelle.mjs`, eingetragen in `suites.mjs` als `{name:'kern-huelle', set:'ci', run: kernHuelle}`. Sie nutzt `withPage` aus `harness.mjs`, läuft bei 320 × 568 (Touch) und 1440 × 900 und prüft:
  - `grundlage`: Nach `document.fonts.ready` ist eine Schrift mit `family` „Nunito Variable“ im Zustand `loaded`. `getComputedStyle(document.body)` hat `fontSize` „18px“ und `backgroundColor` `rgb(250, 248, 243)`. `fontFamily` beginnt mit `"Nunito Variable"`.
  - `ruhigerFokus`: Klick auf den Link „Was ist neu?“ im Fuß. Danach hat `#updates-title` den Fokus und `getComputedStyle(el).outlineStyle === 'none'`.
  - `tastaturFokus`: Bei 1440 px ab Seitenanfang `Tab` drücken, bis der Link „WunderKompass – Startseite“ den Fokus hat (höchstens 3-mal). Er hat dann `outlineStyle` „solid“, `outlineWidth` ≥ 2 px und die Farbe `rgb(14, 110, 114)`.
- [ ] **Schritt 2: Laufen lassen, muss scheitern.** `pnpm run build && node tests/browser/run.mjs --suite ci kern-huelle`. Erwartet: FAIL bei `grundlage` (Trebuchet, 16 px).
- [ ] **Schritt 3: Schrift und Werte einbauen.**
  - Paket: `pnpm add -E @fontsource-variable/nunito@5.3.0`. Den Lizenztext aus `node_modules/@fontsource-variable/nunito/LICENSE` unverändert nach `public/licenses/nunito-OFL.txt` kopieren. In `app/parent-guide.tsx` neben „Software-Lizenzen herunterladen“ einen Link „Schrift-Lizenz (Nunito)“ auf `/licenses/nunito-OFL.txt` setzen.
  - `app/kern/kern.css` beginnt mit einer eigenen `@font-face`: family `'Nunito Variable'`, `font-weight: 200 1000`, `font-display: swap`. Die Quelle ist `url('../../node_modules/@fontsource-variable/nunito/files/nunito-latin-wght-normal.woff2') format('woff2-variations')`. Dazu kommt der `unicode-range` `U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD`. Es gibt keine weiteren Schriftdateien. Im Build darf genau eine `nunito-*.woff2` entstehen.
  - Werte auf `:root` in `kern.css`:

    | Name | Wert | Zweck |
    |---|---|---|
    | `--kern-grund` | `#FAF8F3` | Seitenhintergrund |
    | `--kern-flaeche` | `#FFFFFF` | Kopf, Leiste, Karten |
    | `--kern-text` | `#15303A` | Text (13,05 : 1 auf Grund) |
    | `--kern-text-leise` | `#4A626B` | Nebentext, inaktive Leiste (6,09 : 1) |
    | `--kern-petrol` | `#0E6E72` | Links, Fokus (5,67 : 1) |
    | `--kern-petrol-dunkel` | `#0B5A5D` | Text auf zartem Petrol (6,88 : 1) |
    | `--kern-petrol-zart` | `#E3F1F1` | aktiver Bereich |
    | `--kern-orange` | `#E8742A` | Marke, Hauptknopf mit Text `--kern-text` (4,59 : 1) |
    | `--kern-orange-text` | `#B5531A` | Orange als Schrift oder mit weißer Schrift (4,98 : 1) |
    | `--kern-linie` | `#DDE5E3` | Trennlinien (Schmuck, kein Text) |
    | `--kern-rund` / `--kern-rund-gross` | `16px` / `24px` | Rundungen |
    | `--kern-tipp` | `48px` | kleinste Tippfläche |
    | `--kern-leiste-hoehe` | `64px` | Höhe der unteren Leiste ohne Sicherheitsrand |
    | `--kern-schatten` | `0 2px 10px rgb(21 48 58 / 8%)` | weicher Schatten |
  - `app/globals.css`:
    - `@import "./kern/kern.css";` als letzter Import.
    - Folgende Werte in `:root` neu setzen: `--background:#FAF8F3`, `--foreground:#15303A`, `--primary:#B5531A`, `--ring:#0E6E72`.
    - In `@theme inline` wird `--font-sans` zu `"Nunito Variable","Trebuchet MS",Arial,sans-serif`.
    - `body` bekommt dieselbe Schriftliste, `font-size:18px`, `line-height:1.5`, `font-weight:500`.
    - Die Überschriften `h1,h2,h3` bekommen `font-weight:800`. Ihr `letter-spacing` geht auf `-.01em`, weil Nunito breiter läuft.
  - Fokus in `kern.css`:
    - `:is(a,button,input,select,textarea,summary,[tabindex]):focus-visible{outline:3px solid var(--kern-petrol);outline-offset:3px}`.
    - Ziele, die nur das Programm fokussiert: `:is(h1,h2,h3,h4,main,section,article,aside,div,p)[tabindex="-1"]:is(:focus,:focus-visible){outline:none}`.
    - Danach mit `grep -n "focus" app/*.css` nach Regeln suchen, die einer Überschrift oder `main` mit `tabindex="-1"` einen Rahmen geben, und sie löschen. Bekannt: `.article-atlas [tabindex="-1"]:focus`.
    - Bedienelemente mit `tabindex="-1"` (z. B. Radix-Reiter beim Pfeiltasten-Wandern) behalten ihren Ring.
- [ ] **Schritt 4: Offline-Zusatz.** In `tests/browser/offline-cold.mjs` nach dem Offline-Neustart prüfen, ob eine Schrift mit `family` „Nunito Variable“ den Zustand `loaded` hat (`document.fonts.ready`, dann `[...document.fonts]`). Das prüft Punkt 5 aus „Worauf Prüfer besonders achten“.
- [ ] **Schritt 5: Laufen lassen, muss bestehen.** `pnpm run build && node tests/browser/run.mjs --suite ci kern-huelle offline-cold`. Erwartet: PASS. Dann `pnpm run check`, erwartet grün. Rote alte Tests werden einzeln angesehen (kein blindes Wiederholen). Schöner machen kommt in Aufgabe 5.
- [ ] **Schritt 6: Commit** „Neue Grundlage: Schrift Nunito, Farben, ruhiger Fokus“.

---

### Aufgabe 2: Testhelfer `bereich()` – Tests von der alten Navigation lösen

Damit nach jeder Aufgabe alle Tests grün sind, stellen wir die Tests zuerst auf einen Helfer um. Der Helfer findet in dieser Aufgabe noch die alten Reiter. Erst Aufgabe 3 stellt ihn auf die neuen Links um.

**Dateien:**
- Ändern: `tests/browser/harness.mjs` und alle erreichbaren Testdateien, die Bereichsreiter anklicken: `animal-game-saves.mjs`, `backup.mjs`, `core.mjs` (Liste `HUBS`), `discovery-central.mjs`, `foundation.mjs`, `habitat-answer-semantics.mjs`, `learning-tasks.mjs`, `playground.mjs`, `portable-flows.mjs`, `research.mjs`, `route-focus.mjs`, `world-game-learning-copy.mjs`, `world-game-offline-semantics.mjs`

**Schnittstellen:**
- Erzeugt: `export function bereich(page, id)` in `harness.mjs`. `id` ist eine von `'explore'|'world'|'games'|'labs'|'journeys'|'book'`. Rückgabe ist ein Playwright-Locator auf das Bedienelement des Bereichs.

- [ ] **Schritt 1:** `bereich(page,id)` in `harness.mjs` anlegen. Vorerst ordnet er so zu: explore → Entdecken, world → Wissenswelten, games → Spielplatz, labs → Forscherlabor, journeys → Lernreisen, book → Wissensbuch. Er gibt `page.getByRole('tab',{name, exact:true})` zurück.
- [ ] **Schritt 2:** In den genannten Dateien jedes `getByRole('tab',{name:'<Bereich>',exact:true})` für einen der sechs Bereiche durch `bereich(p,'<id>')` ersetzen. `core.mjs` speichert in `HUBS` künftig IDs statt Namen. Reiter *innerhalb* von Bereichen bleiben unverändert, z. B. „Notizbuch“, „Wörter“, „Naturatlas“ und die Buchreiter. Prüfen mit `grep -n "getByRole('tab',{name:'\(Entdecken\|Wissenswelten\|Spielplatz\|Forscherlabor\|Lernreisen\|Wissensbuch\)'" tests/browser/*.mjs`. Erwartet: keine Treffer außer in `discovery-central.mjs` an den Stellen, die Aufgabe 3 ohnehin neu schreibt (Reiterliste, Pfeiltasten, `aria-selected`).
- [ ] **Schritt 3:** `pnpm run check`. Erwartet: grün, ohne geänderte Erwartungen.
- [ ] **Schritt 4: Commit** „Tests: Bereiche über einen Helfer öffnen“.

---

### Aufgabe 3: Neue Hülle – Kopfzeile, Bereichsleiste, Fuß

**Dateien:**
- Neu: `app/kern/bereiche.ts`, `app/kern/kopfzeile.tsx`, `app/kern/bereichsleiste.tsx`, `app/kern/fusszeile.tsx`, `tests/kern-bereiche.test.mjs`
- Ändern: `app/earth-explorer.tsx` (Kopf, Navigation, Tabs-Hülle, Fuß), `app/kern/kern.css`, `tests/browser/harness.mjs`, `tests/browser/kern-huelle.mjs`, `tests/browser/discovery-central.mjs` (Navigationsteile), `tests/browser/audit-ui.mjs`, `tests/browser/guides.mjs`, `tests/browser/foundation.mjs`
- Löschen: `app/learning-navigation.tsx`. Aus `app/discovery.css` und `app/globals.css` alle Regeln für `.mode-tabs`, `.nav-tab`, `.learning-navigation`, `.site-header`, `.brand`, `.brand-mark`, `.brand-name`, `.header-right`, `.discovery-badge`, `.help-button` und `.site-footer`, auch in Media-Queries. Vor jedem Löschen mit `grep -rn "<klasse>" app components` prüfen, dass niemand sonst die Klasse nutzt. `app/learning-strip.ts` und `components/ui/tabs` bleiben, weil das Wissensbuch sie braucht.

**Schnittstellen:**
- `app/kern/bereiche.ts` (ohne React, damit Node-Tests es laden können):
  - `export type BereichId = 'explore'|'world'|'games'|'labs'|'journeys'|'book'`
  - `export const BEREICHE: readonly {id: BereichId; ziel: string; wort: string}[]` in genau dieser Reihenfolge:

    | id | ziel | wort |
    |---|---|---|
    | explore | home | Start |
    | world | world | Welten |
    | games | games | Spielen |
    | labs | labs | Labor |
    | journeys | journeys | Reisen |
    | book | book | Buch |
  - `export function bereichFuerRoute(modus: string, route: string): BereichId | null`
- `app/kern/bereichsleiste.tsx`: `export default function Bereichsleiste({bereich, onBereich}: {bereich: BereichId|null; onBereich: (ziel: string) => void})`
- `app/kern/kopfzeile.tsx`: `export default function Kopfzeile(props: {passBereit: boolean; bereich: BereichId|null; onStart: () => void; onSuche: () => void; onPass: (e: React.MouseEvent<HTMLButtonElement>) => void; onBereich: (ziel: string) => void})`. Sie enthält die `Bereichsleiste`.
- `app/kern/fusszeile.tsx`: `export default function Fusszeile({onEltern, children}: {onEltern: (e: React.MouseEvent<HTMLButtonElement>) => void; children?: React.ReactNode})`. `children` nimmt `<LearningOffline/>` auf.
- `tests/browser/harness.mjs`: `bereich(page,id)` gibt nun `page.getByRole('navigation',{name:'Bereiche',exact:true}).getByRole('link',{name:<wort>,exact:true})` zurück.

- [ ] **Schritt 1: Unit-Test schreiben** `tests/kern-bereiche.test.mjs`:
  - `BEREICHE.map(b=>b.id)` ist `['explore','world','games','labs','journeys','book']`.
  - `.map(b=>b.wort)` ist `['Start','Welten','Spielen','Labor','Reisen','Buch']`.
  - `.map(b=>b.ziel)` ist `['home','world','games','labs','journeys','book']`.
  - `bereichFuerRoute`:

    | modus | route | Ergebnis |
    |---|---|---|
    | home | home | explore |
    | globe | globe | explore |
    | layers | layers | explore |
    | day | day | explore |
    | quiz | quiz | games |
    | games | games | games |
    | world | world/topic/animal-polar-bear | world |
    | labs | labs/volcano | labs |
    | journeys | journeys/ocean | journeys |
    | book | book/words/Dichte | book |
    | home | updates | null |
    | xyz | xyz | null |
- [ ] **Schritt 2: Browser-Prüfungen schreiben** in `kern-huelle.mjs`, bei 320 × 568 Touch, 390 × 844 Touch, 768 × 1024 und 1440 × 900:
  - `leiste`:
    - Es gibt genau ein `nav` mit Namen „Bereiche“ und darin sechs Links mit den Wörtern aus `BEREICHE`, in dieser Reihenfolge.
    - Jeder Link ist mindestens 48 × 48 px groß. Kein Wort ist abgeschnitten: Das Wort ist nicht breiter als sein Link (`span.scrollWidth <= link.clientWidth`).
    - Die Seite läuft nicht waagerecht über: `document.documentElement.scrollWidth <= innerWidth`.
    - Der Kontrast von Wort zu Hintergrund ist mindestens 4,5 : 1, beim aktiven und beim inaktiven Link. Dafür `homeContrast` aus `discovery-central.mjs` exportieren und hier nutzen.
    - Unter 768 px liegt die Leiste unten: `Math.abs(rect.bottom - innerHeight) <= 1`. Ab 768 px liegt sie oberhalb von `#learning-main`.
  - `leisteNavigiert`: Jeden Link antippen (unter 768 px) oder klicken. Danach ist der Hash `#home`, `#world`, `#games`, `#labs`, `#journeys` bzw. `#book`. Genau dieser Link hat `aria-current="page"`, kein anderer. Nach dem Klick auf „Welten“ hat `#world-category-title` den Fokus und `outlineStyle` ist „none“.
  - `kopfOhneZaehler`: Der Knopf „Entdeckerpass öffnen“ enthält keine Ziffer (`/\d/` passt nicht auf `innerText`). Es gibt keinen Knopf „Hilfe öffnen“. Der Knopf „Lernwelt durchsuchen“ öffnet die Suche.
  - `fuss`: `getByRole('contentinfo')` enthält den Link „Was ist neu?“ und den Knopf „Für Eltern“. Der Knopf „Für Eltern“ öffnet `.parent-guide`.
  - `leisteVerdecktNichts` (nur unter 768 px):
    - Ganz nach unten scrollen. Der untere Rand des letzten sichtbaren Elements im Fuß liegt höchstens auf der Oberkante der Leiste.
    - „Für Eltern“ mit der Tastatur öffnen (Fokus, Enter) und mit Escape schließen. Der Knopf hat danach den Fokus, und sein unterer Rand liegt höchstens auf der Oberkante der Leiste.
  - `dialogUeberLeiste` (320 px): Erst die Suche öffnen, danach den Pass. Jedes Mal liefert `document.elementFromPoint` in der Mitte der Leiste ein Element, das nicht in `nav[aria-label="Bereiche"]` liegt.
  - `grosseSchrift320`:
    - Ausgedachter Testpass über `createSave` aus `app/progress-storage.ts` mit `settings.largeText = true`, vor dem Laden in `localStorage` unter `SAVE_KEY` gelegt.
    - Bei 320 px: alle Prüfungen aus `leiste`.
    - Danach liegt der Pass unverändert im Speicher: `settings` gleich, `favorites` gleich.
  - `zurueckNachLeiste`: `#world` öffnen und 600 px scrollen (wenn die Seite kürzer ist: halbe mögliche Höhe). Auf „Spielen“ tippen, dann `page.goBack()`. Danach weicht `scrollY` höchstens 2 px vom gemerkten Wert ab, und „Welten“ trägt `aria-current="page"`. In Chromium hat außerdem der Link „Spielen“ den Fokus (`data-route-focus="home-nav-games"`).
  - `updatesOhneMarkierung`: Auf `#updates` hat kein Link der Leiste `aria-current`.
- [ ] **Schritt 3: Laufen lassen, muss scheitern.** `pnpm test && pnpm run build && node tests/browser/run.mjs --suite ci kern-huelle`. Erwartet: Der Unit-Test scheitert, weil das Modul fehlt. Die Suite scheitert an `leiste`, weil es kein `nav` „Bereiche“ gibt.
- [ ] **Schritt 4: Bausteine bauen.**
  - `bereichFuerRoute`: `route === 'updates'` → `null`. home, globe, layers, day → `'explore'`. quiz → `'games'`. Ein Modus, der als `id` in `BEREICHE` vorkommt → dieser. Sonst `null`.
  - `Bereichsleiste`:
    - Aufbau: `<nav className="kern-leiste" aria-label="Bereiche"><ul>…</ul></nav>`.
    - Je Bereich `<li><a href={'#'+ziel} data-route-focus={'home-nav-'+id} aria-current={…'page'}>`, darin ein Symbol (`aria-hidden`) und `<span>{wort}</span>`.
    - Symbole aus lucide-react: Start `House`, Welten `Globe2`, Spielen `Gamepad2`, Labor `FlaskConical`, Reisen `Map`, Buch `BookOpen`.
    - `onClick`: Bei gedrückter Strg-, Cmd- oder Umschalttaste oder Mittelklick nichts tun, dann öffnet der Browser normal. Sonst `preventDefault()` und `onBereich(ziel)`.
    - `data-route-focus` behält die alten Schlüssel `home-nav-<id>`, damit „Zurück“ den Fokus findet.
  - `Kopfzeile`:
    - Aufbau: `<header className="kern-kopf">`. Darin die Marke als `<a href="#home" aria-label="WunderKompass – Startseite">` mit Kompass auf orangem Grund und dem Wort „WunderKompass“, ohne Unterzeile. `onClick` ruft `preventDefault()` und `onStart()`.
    - Danach `<Bereichsleiste/>`, dann die Knöpfe.
    - Knopf Suche: Symbol `Search`, `aria-label` und `title` „Lernwelt durchsuchen“.
    - Knopf Pass: Symbol `IdCard`, ab 768 px mit dem Wort „Entdeckerpass“, `aria-label="Entdeckerpass öffnen"`, `disabled={!passBereit}`, ohne Zähler.
  - `Fusszeile`:
    - Aufbau: `<footer className="kern-fuss">`.
    - Link „Was ist neu?“: `href="#updates"`, `data-route-focus="home-updates"`, `onClick` mit `preventDefault()` und `navigateHash('updates')`.
    - Knopf „Für Eltern“ ruft `onEltern(e)`.
    - Dann `children`, dann die Zeile „Wissen entdecken. Zusammenhänge verstehen.“
  - `app/earth-explorer.tsx`:
    - `<header className="site-header">…</header>` wird zu `<Kopfzeile passBereit={local.ready} bereich={bereichFuerRoute(mode, routePath)} onStart={()=>navigateHash('home')} onSuche={openSearch} onPass={e=>openGuide(e,setPassport)} onBereich={goMode}/>`.
    - `<Tabs value={area} …>` wird zu `<div className="learning-tabs">`, `<TabsContent value={area} className="learning-panel">` zu `<div className="learning-panel">`, `<LearningNavigation/>` entfällt.
    - Regeln, die an `[data-slot=tabs-content]` oder `role=tabpanel` hängen, mit grep suchen und auf `.learning-panel` umschreiben. Das Layout bleibt gleich.
    - `<LearningOffline …/>` und `<footer className="site-footer">…</footer>` werden zu `<Fusszeile onEltern={e=>openGuide(e,setParents)}><LearningOffline onBeforeReload={local.flush}/></Fusszeile>`.
    - Ungenutzte Importe entfernen (`Tabs`, `TabsContent`, `LearningNavigation`, `Award`, `HelpCircle`, `Link`, sofern nicht mehr genutzt). Die Variable `area` bleibt für die übrige Logik.
  - Gestaltung in `kern.css`, nur die festgelegten Werte:
    - **Unter 768 px:**
      - Kopf 64 px hoch: Marke links, Knöpfe rechts.
      - `.kern-leiste` ist `position:fixed`, unten, volle Breite, `z-index:30`, mit Hintergrund `--kern-flaeche`, oben `1px solid var(--kern-linie)`, `padding-bottom:env(safe-area-inset-bottom)`. Die Liste ist ein Raster mit sechs gleichen Spalten.
      - Ein Link ist mindestens 56 px hoch, Symbol 22 px über dem Wort. Wort 14 px, `font-weight:700`, `white-space:nowrap`. In `.large-reading` ist das Wort 15 px. Der seitliche Innenabstand darf dafür bis 2 px sinken, nie die Schrift unter 14 px.
      - `body` bekommt `padding-bottom` und `html` `scroll-padding-bottom`, beide `calc(var(--kern-leiste-hoehe) + env(safe-area-inset-bottom))`.
      - `.speech-player` bekommt `bottom: calc(var(--kern-leiste-hoehe) + env(safe-area-inset-bottom) + 12px)`.
    - **768–1199 px:** Kopf in zwei Reihen: Marke und Knöpfe oben, Leiste darunter über die volle Breite. Links liegen nebeneinander, Symbol neben dem Wort, mindestens 48 px hoch, Rundung `--kern-rund`.
    - **Ab 1200 px:** eine Reihe: Marke, Leiste in der Mitte, Knöpfe rechts.
    - **Aktiver Link** (`[aria-current=page]`): Hintergrund `--kern-petrol-zart`, Schrift `--kern-petrol-dunkel`, `font-weight:800`. Inaktiv: `--kern-text-leise`. Beim Darüberfahren (`@media (hover:hover)`) ein zarter Hintergrund und eine Übergangszeit von 150 ms. Bei „Bewegung reduzieren“ keine Übergänge.
    - **Knöpfe im Kopf:** mindestens 48 × 48 px, Rundung `--kern-rund`, Rahmen `1px solid var(--kern-linie)`, Hintergrund `--kern-flaeche`.
    - **Fuß:** Links und Knopf mindestens 48 px hoch, mindestens 8 px Abstand. Die Offline-Box liegt darunter.
    - **Erzwungene Farben** (`forced-colors:active`): Der aktive Link bekommt `outline:2px solid CanvasText` statt Farbe.
- [ ] **Schritt 5: Alte Tests nachziehen.**
  - `harness.mjs`: `bereich()` auf die neuen Links umstellen (siehe Schnittstellen).
  - `discovery-central.mjs`: `compactAreaNavigation`, `assertCompactAreaGeometry` und `mainNavigation` mit ihrem Aufruf in `homepageOverview` löschen. Sie prüften die alte Reiterzeile mit Pfeilknöpfen. Ihren Schutz (sechs Bereiche, Lesbarkeit, Tippflächen, Kontrast, große Schrift, Fokus) übernimmt `kern-huelle`, jetzt in jeder Prüfung und in allen Browsern.
  - Dort außerdem: `aria-selected` an Bereichen → `aria-current="page"`. `.mode-tabs [data-state=active]` → `nav[aria-label="Bereiche"] [aria-current=page]` mit dem neuen Wort.
  - `audit-ui.mjs` und `guides.mjs`:
    - Den Fuß-Knopf über `page.getByRole('contentinfo').getByRole('button',{name:'Für Eltern',exact:true})` finden.
    - Für die Hilfe greift die vorhandene Ersatzlogik: „So geht’s“ auf der Startseite. Sie wird ausdrücklich so beschrieben: Der Kopf hat keinen Hilfe-Knopf mehr.
  - `foundation.mjs`: `.mode-tabs button:visible` → `nav[aria-label="Bereiche"] a:visible`.
- [ ] **Schritt 6: Laufen lassen, muss bestehen.** `pnpm test`, dann `pnpm run build && node tests/browser/run.mjs --suite ci kern-huelle`, dann `pnpm run check`. Erwartet: alles grün. Danach `node tests/browser/run.mjs --suite full home home-visits components core playground research`, erwartet grün.
- [ ] **Schritt 7: Commit** „Neue Hülle: Kopfzeile, Bereichsleiste, Fuß“.

---

### Aufgabe 4: „Was ist neu?“ neu, alte Chronik entfernen

**Dateien:**
- Neu: `app/kern/neuigkeiten.ts`, `app/kern/neuigkeiten-ansicht.tsx`, `tests/neuigkeiten.test.mjs`
- Ändern: `app/earth-explorer.tsx` (lazy Import und Ladetext), `app/kern/kern.css`, `tests/browser/kern-huelle.mjs`, `tests/browser/no-news.mjs` (Zeile mit `.update-history`), `tests/browser/research.mjs` (Zeile 85), `tests/browser/discovery-central.mjs` (Chronik-Teile, `historyEngineView`, `offlineDiscoveryCentral`), `tests/browser/engine-journeys.mjs`, `tests/browser/journey-zoom.mjs`, `CLAUDE.md` (Tabelle „Wo was liegt“)
- Löschen: `app/update-history.ts`, `app/update-history-view.tsx`, `content/update-history-evidence.json`, `app/update-history-test-evidence.json`, `tests/update-history.test.mjs`, alle Regeln mit `update-history`/`updates-` in `app/discovery.css`

**Schnittstellen:**
- `app/kern/neuigkeiten.ts`:
  - `export type NeuigkeitSymbol = 'kompass'|'globus'|'stern'|'buch'|'lupe'`
  - `export type Neuigkeit = {id: string; datum: string /* JJJJ-MM-TT */; symbol: NeuigkeitSymbol; titel: string; text: string}`
  - `export const NEUIGKEITEN: readonly Neuigkeit[]`, neueste zuerst
  - `export function datumLesbar(datum: string): string`
- `app/kern/neuigkeiten-ansicht.tsx`: `export default function NeuigkeitenAnsicht()`
- Ersetzt `historyEngineView` in `discovery-central.mjs` durch `export async function neuigkeitenAnsicht(page, width, shots, {engine='chromium', capture}={})` mit derselben Aufrufform. `engine-journeys.mjs` und `journey-zoom.mjs` rufen dann diese Funktion auf.

- [ ] **Schritt 1: Unit-Test schreiben** `tests/neuigkeiten.test.mjs`:
  - `NEUIGKEITEN.length >= 1`.
  - Jede `id` passt auf `/^[a-z0-9]+(-[a-z0-9]+)*$/`, und alle IDs sind verschieden.
  - Jedes `datum` passt auf `/^\d{4}-\d{2}-\d{2}$/` und ist ein echter Tag: `new Date(datum+'T00:00:00Z').toISOString().slice(0,10) === datum`.
  - Die Daten fallen von oben nach unten oder bleiben gleich (neueste zuerst).
  - `symbol` ist eines der fünf erlaubten.
  - `titel.length <= 40`. `text` hat höchstens zwei Sätze (Satzenden `/[.!?](\s|$)/`) und höchstens 160 Zeichen.
  - Kein Titel und kein Text enthält `/Nachrichten/i`.
  - `datumLesbar('2026-11-21') === '21. November 2026'` und `datumLesbar('2026-03-01') === '1. März 2026'`.
- [ ] **Schritt 2: Browser-Prüfung schreiben** in `kern-huelle.mjs` (`neuigkeiten`, bei 320 und 1440 px):
  - Klick auf „Was ist neu?“ im Fuß, dann `#updates-title` hat den Fokus, `outlineStyle` ist „none“, der Text ist „Was ist neu?“.
  - Die Liste `.kern-neuigkeiten li` hat `NEUIGKEITEN.length` Einträge.
  - Im ersten Eintrag steht das `h2` mit `NEUIGKEITEN[0].titel`. Sein `time[datetime]` ist `NEUIGKEITEN[0].datum`, sein Text `datumLesbar(NEUIGKEITEN[0].datum)`.
  - Die Überschrift des ersten Eintrags ist ohne Scrollen sichtbar.
  - axe ohne Verstöße für `.kern-neuigkeiten` (wcag2a, wcag2aa, wcag21aa, wcag22aa), wie bisher in `discovery-central.mjs`.
- [ ] **Schritt 3: Laufen lassen, muss scheitern.** `pnpm test` (Modul fehlt) und die Suite `kern-huelle` (`.kern-neuigkeiten` fehlt).
- [ ] **Schritt 4: Bauen.**
  - `neuigkeiten.ts` mit dem ersten Eintrag:
    - `id: 'neue-leiste'`, `symbol: 'kompass'`, `titel: 'Alles mit einem Tipp'`
    - `text: 'Alle Bereiche stehen jetzt in einer Leiste. Die Schrift ist runder und gut zu lesen.'`
    - `datum`: der Tag des Commits. `kinder-redaktion` prüft den Wortlaut in Aufgabe 5.
  - `datumLesbar` nutzt `Intl.DateTimeFormat('de-DE',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})`.
  - `NeuigkeitenAnsicht`:
    - Aufbau: `<article className="kern-neuigkeiten" aria-labelledby="updates-title">`, darin `<h1 id="updates-title" tabIndex={-1}>Was ist neu?</h1>`, ein kurzer Einleitungssatz „Hier siehst du, was es Neues zu entdecken gibt.“ und eine `<ol>`.
    - Je Eintrag ein `<li data-neuigkeit={id}>` mit Symbol (`aria-hidden`; kompass → `Compass`, globus → `Globe2`, stern → `Star`, buch → `BookOpen`, lupe → `Search`), `<time dateTime={datum}>{datumLesbar(datum)}</time>`, `<h2>{titel}</h2>` und `<p>{text}</p>`.
    - `useLayoutEffect(()=>restoreRouteView('updates'),[])`. Für `#updates` gibt es sonst keine Wiederherstellung, siehe `useHashRoute`.
  - `earth-explorer.tsx`:
    - `UpdateHistoryView` → `lazy(()=>import('./kern/neuigkeiten-ansicht'))`.
    - Ladetext „Die Neuigkeiten kommen gleich …“.
  - Gestaltung in `kern.css`:
    - Liste mit großen Karten (Rundung `--kern-rund-gross`, Hintergrund `--kern-flaeche`, `--kern-schatten`).
    - Symbol 40 px auf zartem Orange `#FDEBDD`. Datum 14 px in `--kern-text-leise`, Titel 22 px mit Gewicht 800.
    - Breite höchstens 720 px, mittig.
  - Alte Chronik-Dateien löschen (Liste oben). Dann `grep -rn "update-history\|UpdateHistory\|publicUpdates\|PREPARED_UPDATES" app tests scripts build` muss leer sein.
  - In `CLAUDE.md` aus der Zeile `content/research/`, `content/update-history-evidence.json` den zweiten Eintrag streichen.
- [ ] **Schritt 5: Alte Tests nachziehen.**
  - `no-news.mjs`: `.update-history` → `.kern-neuigkeiten`. Die Prüfung auf „Nachrichten“ bleibt.
  - `research.mjs:85`: `.update-history` → `.kern-neuigkeiten`. Der Link „Zur Startseite“ → `bereich(p,'explore')`. Die Prüfung, dass der Hash danach `#home` ist, bleibt.
  - `discovery-central.mjs`:
    - Die Chronik-Blöcke in `discoveryCentral` (Zeile ~230) und `homepageOverview` (Zeilen ~379–474) sowie `historyEngineView` löschen. Den Import aus `update-history.ts` streichen.
    - An ihre Stelle kommt `neuigkeitenAnsicht`:
      - Titel fokussiert und ohne Rahmen; Zahl und Reihenfolge der Einträge wie `NEUIGKEITEN`.
      - Bildschirmfoto `updates-<engine>-<width>.png`.
      - Zurück/Vor: von `#updates` über die Leiste zu „Start“, dann `goBack()`. Danach ist `#updates` wieder da, und der Fokus liegt auf dem Link „Start“.
      - axe ohne Verstöße.
    - `offlineDiscoveryCentral`: Statt `.updates-timeline` die neue Liste mit `NEUIGKEITEN.length` Einträgen prüfen. Statt „Zur Startseite“ `bereich(page,'explore')`. Statt des Reiters `bereich(page,'world')`. Statt `.mode-tabs [data-state=active]` prüfen, dass „Welten“ `aria-current="page"` trägt.
  - `engine-journeys.mjs` und `journey-zoom.mjs`: Import und Aufruf auf `neuigkeitenAnsicht` umstellen. Die Berichtsfelder heißen weiter `historyViews` bzw. `nativeHistory`.
- [ ] **Schritt 6: Laufen lassen, muss bestehen.**
  - `pnpm run check`: grün.
  - `node tests/browser/run.mjs --suite full home home-visits research engine-journeys offline-cold-full`: grün.
- [ ] **Schritt 7: Commit** „Was ist neu?: kurze Liste für Kinder statt alter Chronik“.

---

### Aufgabe 5: Alte Bereiche anpassen, Budgets, Helfer

**Dateien:** je nach Befund `app/kern/kern.css` und gezielt alte CSS-Dateien. Keine neuen Funktionen.

- [ ] **Schritt 1: Bilder machen.** Bildschirmfotos in 320, 390, 768, 1280 und 1440 px von diesen Seiten: `#home`, `#world`, eine Karte (`#world/topic/animal-polar-bear`), `#games`, ein Spielraum, `#labs`, ein Labor, `#journeys`, eine Reise, `#book`, `#globe`, `#updates`, Pass-Dialog, Suche, Eltern-Dialog. Dazu jeweils einmal mit großer Schrift bei 320 px. Ablage: `.qa-output/teilschritt-1/`.
- [ ] **Schritt 2: `design-pruefer`** mit diesen Bildern beauftragen: Lesbarkeit, Kontrast, Tippflächen, Abgeschnittenes, Zusammenstöße der neuen Schrift mit alten Bereichen.
- [ ] **Schritt 3: Befunde beheben.**
  - Die Regeln kommen in den Abschnitt „Anpassung alter Bereiche“ in `kern.css` oder direkt in die alte Datei.
  - Die Schrift wird nie als Notlösung kleiner.
  - Was in Teilschritt 2 bis 5 ohnehin ersetzt wird (Startseite, Karte, Weltenseiten), bekommt nur Korrekturen, die Kinder sonst stören würden. Der Rest kommt mit Grund ins BACKLOG.
- [ ] **Schritt 4: Budgets.** `pnpm run build`. Einstiegs-CSS, Einstiegs-CSS gzip, Einstiegs-JS und Einstiegs-JS gzip liegen höchstens auf den Werten aus Schritt 0. Wenn nicht: tote alte Regeln weiter abbauen, nie das Budget erhöhen.
- [ ] **Schritt 5: `kinder-redaktion`** prüft alle neuen Wörter:
  - Leiste: Start, Welten, Spielen, Labor, Reisen, Buch
  - Fuß: „Was ist neu?“, „Für Eltern“, Kurzzeile
  - Kopf: „Entdeckerpass“
  - „Was ist neu?“: Einleitungssatz und erster Eintrag
  - Ladetext

  Befunde einarbeiten.
- [ ] **Schritt 6: `code-pruefer`** prüft den ganzen Unterschied zu `origin/test-live`: Pass, IDs, Hash-Links, Fokus-Wiederherstellung, Offline-Liste (genau eine Nunito-Datei im Vorrat), gelöschte Dateien ohne Restverweise. Befunde einarbeiten.
- [ ] **Schritt 7: Große Prüfung.** `pnpm run check`, dann `pnpm run test:full` (Chromium). Erwartet: alles grün. Firefox und WebKit laufen im CI-Job „Vollprüfung“, wenn der Nutzer ihn von Hand startet oder am Phasenende.
- [ ] **Schritt 8: Commit** „Alte Bereiche an die neue Grundlage angepasst“.

---

### Aufgabe 6: Zeigen, Freigabe, Nachführen

- [ ] **Schritt 1:** `STATUS.md` (Stand, nächster Schritt), `BACKLOG.md` (Phase 1 Punkt 9 „großer Fokusrahmen“ erledigt, neue Befunde) und `CHANGELOG.md` (Teilschritt 1) nachführen. Commit „Teilschritt 1: Unterlagen nachgeführt“.
- [ ] **Schritt 2:** `git diff --check`, Autor und Committer prüfen, `git push -u origin claude/sweet-ramanujan-gl9yhc`.
- [ ] **Schritt 3:** Vercel-Vorschau über das Vercel-MCP finden (`list_deployments`, Branch-Alias) und mit `node tests/browser/run.mjs --suite smoke --base <Vorschau-URL>` gegenprüfen.
- [ ] **Schritt 4:** Dem Nutzer berichten, in der festen Form (fertig, ansehen, entscheiden, als Nächstes), mit Vorschau-Link und drei bis vier Bildern: Handy mit Leiste, Tablet, Rechner, „Was ist neu?“.
- [ ] **Schritt 5:** Nach dem „ok“: PR nach `test-live`, CI abwarten, Auto-Merge einschalten (laut CLAUDE.md erlaubt nach dem „ok“), nach dem Merge die Testseite kurz prüfen.

---

## Nicht in Teilschritt 1

- Glanz-Schimmer auf Kacheln: kommt mit den Kacheln in Teilschritt 4.
- Der Pass-Dialog selbst (Punkte, Stufen, Abzeichen darin): Teilschritt 5. In Teilschritt 1 fällt nur der Zähler am Pass-Knopf weg.
- Startseite, Karte, Weltenseiten: Teilschritte 2, 4 und 5. Hier bekommen sie nur Schrift, Farben und nötige Korrekturen.
- Der Rauchtest (`smoke.mjs`) zieht mit der neuen Startseite in Teilschritt 5 um.

## Ausblick auf die Teilschritte 2 bis 6

Die Pläne dafür entstehen jeweils, wenn der Teilschritt ansteht, weil sie auf der Hülle aus Teilschritt 1 aufbauen. Seit der freigegebenen Ergänzung `2026-11-21-phase-1-ergaenzung-spannung.md` (21.11.2026) gibt es einen neuen Teilschritt 3 „Kniffliger spielen“; die alten Teilschritte 3 bis 5 heißen jetzt 4 bis 6.

- **Teilschritt 2 „Wissenskarte“:**
  - neue Karte nach 6.3 in `app/kern/`: Foto, „Rate mal!“, kurze Abschnitte, „Dazu passt“
  - Verbindungen nach 6.8: 35 Karten ohne Verbindung, Prüfung der 196 Sätze durch `fakten-pruefer` und `kinder-redaktion`
  - `article-atlas.mjs` zieht um
  - `bild-recherche` beginnt parallel mit den rund 55 Bildern
  - aus der Ergänzung A1 bis A5: Längen-Budget, Aufräumen über alle Karten, Häppchen für etwa 12 Pilot-Karten, „Stimmt das?“, Reisen einfach zuerst
- **Teilschritt 3 „Kniffliger spielen“ (neu):**
  - „Entdecker“ und „Profi“ in jedem Frage-Spiel, Wahl in `gameSessions` (B1)
  - mehr Aufgaben und Zufall, bessere falsche Antworten (B3)
  - Ratemuster abstellen, Reise-Antworten mischen (B4)
  - Labor-Stempel erst nach dem Ausprobieren (B5)
- **Teilschritt 4 „Weltenseiten und Bilder“:**
  - Übersicht und Weltenseite nach 6.4
  - Motivkacheln mit Kennzeichnung, Glanz-Schimmer
  - Block „Bildnachweise auf dieser Seite“ (6.11)
  - Bilder für Zeitreise und Erfindungen einbauen (6.10)
- **Teilschritt 5 „Startseite und Sammlung“:**
  - „Rate mal!“ auf der Startseite (6.5)
  - Sammlung im Pass ohne Zahlen (6.6), Punkte, Stufen und Abzeichen aus der Ansicht
  - Rauchtest umstellen
  - alte `discovery-*`-Bausteine löschen
  - goldenes Bild für „Profi“ in der Sammlung (B2)
- **Teilschritt 6 „Feinschliff und Abschluss“:**
  - `design-pruefer` in allen Breiten
  - `test:full` in drei Browsern
  - große Schlussprüfung (mit `fable`, sofern die Ausnahme vorbei ist)
  - Frage an den Nutzer zum Veröffentlichen
