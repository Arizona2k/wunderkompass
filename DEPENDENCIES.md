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

Für den zusammengeführten Redesignauftrag wurde bisher keine neue Projektabhängigkeit installiert, keine Konfiguration geändert und kein externer Kontodienst aktiviert. Motion for React wird nach der Werkzeugpräzisierung ausdrücklich als bevorzugter Kandidat am vorgesehenen tatsächlichen Redesign-Ausschnitt bewertet und bei konkretem Vorteil selbstständig integriert. Ausgewählte kostenlose MagicUI-/Aceternity-Komponenten werden auf passende Highlights geprüft; keine Pflicht für alle drei. Vorhandene UI/Carousel/3D-Bausteine allein begründen keine Ablehnung. Noch keine dieser Lösungen installiert oder im Produkt verwendet; die tatsächliche Auswahl folgt der gerenderten Gegenüberstellung. ElevenLabs bleibt optional und keine Voraussetzung. Vor konkreter Aufnahme aktuelle offizielle Herkunft, Lizenz, Sicherheit/Berechtigungen, Kompatibilität, Wartbarkeit, Offline-/Ladeauswirkung sowie echte Nutzungs-/Gratis-/Veröffentlichungsgrenzen prüfen und hier nur tatsächlich verwendete neue Werkzeuge mit Zweck, Version, Einrichtung, Codeverwendung und Funktionsnachweis nachtragen. Zusätzliches Kostenbudget0Euro; keine kostenpflichtig notwendige Nutzung, Zahlungsdaten, Testabos, Aufladungen oder Upgrades.
