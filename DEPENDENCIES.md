# Abhängigkeiten

Historische Originalversionen und Installationsnachweise bleiben in Git erhalten. Aktueller Abgleich27.10.2026 gegen `package.json`, `pnpm-lock.yaml` und die tatsächlich installierten Paketmetadaten; Node24.19.0/pnpm11.25.0. Die folgende Tabelle belegt deklarierte und installierte Versionen, nicht die Aufnahme aller Pakete ins Browserbundle.

| Paket | Gruppe | Deklariert | Installiert |
| --- | --- | --- | --- |
| `@base-ui/react` | dependencies | `^1.7.0` | 1.7.0 |
| `@hookform/resolvers` | dependencies | `^5.7.1` | 5.7.1 |
| `@shadcn/react` | dependencies | `^0.3.0` | 0.3.0 |
| `class-variance-authority` | dependencies | `0.7.1` | 0.7.1 |
| `clsx` | dependencies | `2.1.1` | 2.1.1 |
| `cmdk` | dependencies | `^1.1.1` | 1.1.1 |
| `d3-geo` | dependencies | `^3.1.1` | 3.1.1 |
| `date-fns` | dependencies | `^4.4.0` | 4.4.0 |
| `drizzle-orm` | dependencies | `0.45.2` | 0.45.2 |
| `embla-carousel-react` | dependencies | `^8.6.0` | 8.6.0 |
| `input-otp` | dependencies | `^1.4.2` | 1.4.2 |
| `lucide-react` | dependencies | `^1.31.0` | 1.31.0 |
| `motion` | dependencies | `14.4.0` | 14.4.0 |
| `next` | dependencies | `16.3.8` | 16.3.8 |
| `next-themes` | dependencies | `^0.4.6` | 0.4.6 |
| `radix-ui` | dependencies | `^1.6.7` | 1.6.7 |
| `react` | dependencies | `19.2.8` | 19.2.8 |
| `react-day-picker` | dependencies | `^10.0.1` | 10.0.1 |
| `react-dom` | dependencies | `19.2.8` | 19.2.8 |
| `react-hook-form` | dependencies | `^7.85.0` | 7.85.0 |
| `react-resizable-panels` | dependencies | `^4.12.2` | 4.12.2 |
| `recharts` | dependencies | `^3.8.0` | 3.8.0 |
| `sonner` | dependencies | `^2.0.8` | 2.0.8 |
| `tailwind-merge` | dependencies | `3.6.0` | 3.6.0 |
| `three` | dependencies | `^0.186.1` | 0.186.1 |
| `vaul` | dependencies | `^1.1.2` | 1.1.2 |
| `zod` | dependencies | `^3.25.76` | 3.25.76 |
| `@cloudflare/vite-plugin` | devDependencies | `1.37.1` | 1.37.1 |
| `@cloudflare/workers-types` | devDependencies | `4.20260515.1` | 4.20260515.1 |
| `@tailwindcss/postcss` | devDependencies | `4.2.1` | 4.2.1 |
| `@types/d3-geo` | devDependencies | `^3.1.1` | 3.1.1 |
| `@types/node` | devDependencies | `22.19.19` | 22.19.19 |
| `@types/react` | devDependencies | `19.2.14` | 19.2.14 |
| `@types/react-dom` | devDependencies | `19.2.3` | 19.2.3 |
| `@types/three` | devDependencies | `^0.186.0` | 0.186.0 |
| `@vitejs/plugin-react` | devDependencies | `6.0.2` | 6.0.2 |
| `@vitejs/plugin-rsc` | devDependencies | `0.5.26` | 0.5.26 |
| `drizzle-kit` | devDependencies | `0.31.10` | 0.31.10 |
| `eslint` | devDependencies | `9.39.4` | 9.39.4 |
| `eslint-config-next` | devDependencies | `16.3.4` | 16.3.4 |
| `json-rpc-2.0` | devDependencies | `1.7.1` | 1.7.1 |
| `raw-body` | devDependencies | `3.0.2` | 3.0.2 |
| `react-server-dom-webpack` | devDependencies | `19.2.8` | 19.2.8 |
| `tailwindcss` | devDependencies | `4.2.1` | 4.2.1 |
| `tw-animate-css` | devDependencies | `^1.4.0` | 1.4.0 |
| `typescript` | devDependencies | `5.9.3` | 5.9.3 |
| `vinext` | devDependencies | `1.0.0-beta.5` | 1.0.0-beta.5 |
| `vite` | devDependencies | `8.0.16` | 8.0.16 |
| `wrangler` | devDependencies | `4.92.0` | 4.92.0 |

Alle transitiven Versionen und Integritäten: `pnpm-lock.yaml`. Die bestehenden Browserprüfwerkzeuge Playwright1.64.0 und Axe4.11.0 stehen mit eigenem Frozen-Lockfile unter `qa/`; sie sind kein Teil des öffentlichen Lernbetriebs.

## Vorhandene Bausteine und zusätzliche Werkzeuge

Die Anwendung enthält bereits React/Radix-Komponenten, vorhandene shadcn-bezogene Quelldateien, Embla für steuerbare Bildfolgen, Lucide und Three für den Globus. Vor einer neuen Bibliothek die tatsächlich erreichbaren Komponenten und ihren Bedarf prüfen; installierte Paketnamen und Quelldateien allein belegen keine Integration oder Bündelgröße. Vorhandene geeignete Komponenten weiterverwenden.

Motion for React **14.4.0 (MIT)** wird tatsächlich in `app/learning-motion.tsx`, `world-view.tsx`, `world-topic.tsx`, `learning-journeys.tsx` und den Laborfragen verwendet: Themen und Reisen ordnen sich beim Filtern fließend neu; Aufgabenfeedback öffnet und schließt ruhig, anschließend kehrt der Tastaturfokus zu den Antworten zurück. `LazyMotion` mit `domMax` bleibt in den vorhandenen bedarfsweise geladenen Lernbereichen. System- und Pass-Einstellung für reduzierte Bewegung deaktivieren diese Übergänge; Inhalte bleiben sofort sichtbar. Für einfache Home-Effekte und native Details bleiben Browsertechniken passend. Die erste gerenderte Entwicklungsstufe ist beurteilt, der vollständige Design-Meilenstein und seine Schlussabnahme sind offen.

Die vorhandene Sieben-Tage-Lieferkettenregel bleibt unverändert: 14.7.1 erschien erst am27.10., daher wurde die neueste geeignete ausreichend alte offizielle Version14.4.0 vom19.10. ausgewählt und exakt gepinnt. Der Lockfile bindet `framer-motion14.4.0`, `motion-dom14.4.0` und `motion-utils14.1.1`; kein zusätzlich separat eingebautes Animationsframework. Unveränderte MIT-/0BSD-Lizenztexte einschließlich Framer-/Motion-/Microsoft-Namensnennung liegen in `public/licenses/learning-motion.json`, werden mit den vorhandenen Offline-Assets vorbereitet und sind über die Begleitpersonen-Hilfe erreichbar.

Magic UIs kostenloser **Animated Beam (MIT)** wurde anhand offizieller Dokumentation und Quelltext geprüft. Ein zusätzlicher dauerhaft pulsierender Verbindungsstrahl bringt dem gewählten Themen-/Aufgabenausschnitt keinen belegten Nutzen; die vorhandenen begründeten Verbindungen und eine eigene ruhige Darstellung bleiben. Aceternitys **Layout Grid** wurde als mögliche Aufklappinszenierung geprüft; die konkret erreichbare Lizenzseite klärt die kostenlose Übernahme dieses Quelltexts nicht ausreichend. Keine Übernahme dieses Bausteins oder eines Pro-Angebots: die eigene Motion-Integration erhält die vorhandene Navigation, Semantik und gespeicherten Zustände. Keine Pflicht, alle Kandidaten einzubauen.

Zusatzkosten0Euro: lokale Open-Source-Bibliothek ohne Konto, API oder laufenden externen Dienst. Die erste gemessene Einbindung erhöht das Einstieg-Gzip lediglich286.020→286.051Byte; Motion liegt außerhalb dieses Einstiegsbundles. Das gewachsene CSS liegt im frühen Vorbau noch über335.000/57.000Byte und wird im gemeinsamen Designabschnitt konsolidiert beziehungsweise nach tatsächlicher Messung begründet behandelt; keine bestandene Größenabnahme behauptet. ElevenLabs bleibt optional und keine Voraussetzung. Keine kostenpflichtigen Vorlagen, Abonnements, neuen Frameworks oder doppelte redaktionelle Datenpflege.

Die folgende tatsächliche Übertragung nutzt denselben Provider für Reise- und Laborfeedback. Normale sowie System-/Pass-ReducedMotion-Fälle wurden im gerenderten Produkt ausgeführt; keine zusätzliche Animationsabhängigkeit. Aktuelle frühe Einstiegmessung286139Byte gzip, CSS339108/57493gzip noch über der bisherigen Grenze. Vollständige Abnahme bleibt offen. Neue Inhalte verwenden vorhandene Typografie-/Leser-/Modell-/Legendenkomponenten und dieselben Bewegungseinstellungen; einfache freiwillige Details bleiben nativ.
