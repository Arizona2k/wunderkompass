'use client';
// Die neue Wissenskarte (Phase 1, Teilschritt 2). Von oben nach unten:
// Kopf (Bild, Titel, Einleitung, Vorlesen, Merken), „Rate mal!“, Kurz erklärt (Pilot-Karten: Häppchen und „Für Große“),
// „Stimmt das?“ (Pilot-Karten), Steckbrief, Schon gewusst?,
// Ausprobieren, Mehr erfahren, Für Erwachsene, Dazu passt, Bildnachweise auf dieser Seite.
// Pass-Kopplung wie bei der alten Karte: dieselbe Hülle (SavedGame 'topic:<id>'), dieselben Schlüssel,
// dieselben Aufrufe für Merken, „gelernt“ und Wiederholung.
import {Fragment, useCallback, useMemo, useState} from 'react';
import {ArrowRight, BookOpen, Check, Compass, Heart, Lightbulb, Users, Volume2} from 'lucide-react';
import {LearningDetails} from '../../learning-components';
import {LearningMotion} from '../../learning-motion';
import PhotosynthesisRolesDrawing from '../../photosynthesis-roles-drawing';
import {SavedGame, useSavedGame} from '../../saved-games';
import {connectionsFor} from '../../knowledge-connections';
import {displayTopicTitle} from '../../topic-title';
import HINTS from '../../challenge-hints.json';
import {WORLD_CATEGORIES, WORLD_INDEX} from '../../world-index';
import type {Activity} from '../../progress-storage';
import type {WorldActions, WorldTopic} from '../../world-types';
import Ausprobieren from './ausprobieren';
import BildnachweiseAufDieserSeite from './bildnachweise';
import DazuPasst from './dazu-passt';
import Kartenbild from './kartenbild';
import MehrErfahren from './mehr-erfahren';
import RateMal, {antwortReihe} from './rate-mal';
import StimmtDas from './stimmt-das';
import {dazuPasst, ersteFrage, hatAusprobieren, kartenFragen, weitereVerbindungen} from './karten-daten';
import './karte.css';

type WissenskarteProps = {
  topic: WorldTopic;
  actions: WorldActions;
  onTopic: (id: string) => void;
  activity?: Activity;
  // In einer Lernroute steht die Karte unter der Routen-Überschrift: Titel h2 statt h1.
  embedded?: boolean;
};

export default function Wissenskarte({topic, actions, onTopic, activity, embedded = false}: WissenskarteProps) {
  const {onSave} = actions;
  const save = useCallback(
    (id: string, key: string, value: unknown) => onSave(id, key, value, activity ?? {type: 'topic', id: topic.id}),
    [onSave, activity, topic.id],
  );
  return (
    <LearningMotion reducedMotion={actions.progress.settings.reducedMotion}>
      <SavedGame id={'topic:' + topic.id} family="world" sessions={actions.progress.gameSessions} onSave={save}>
        <Karteninhalt key={topic.id} topic={topic} actions={actions} onTopic={onTopic} embedded={embedded}/>
      </SavedGame>
    </LearningMotion>
  );
}

type InhaltProps = {topic: WorldTopic; actions: WorldActions; onTopic: (id: string) => void; embedded: boolean};

// Heikle Karten (z. B. Holocaust) fragen erst, ob das Kind das Thema ansehen möchte. Die Entscheidung bleibt gespeichert.
function Karteninhalt({topic: t, actions: a, onTopic, embedded}: InhaltProps) {
  const Titel = embedded ? 'h2' : 'h1';
  const [zugestimmt, setZugestimmt] = useSavedGame('sensitiveAccepted', false);
  if (t.history?.sensitive && !zugestimmt) {
    return (
      <article className="sensitive-intro">
        <Heart size={42} aria-hidden="true"/>
        <Titel tabIndex={-1} id="world-topic-title">{t.title}</Titel>
        <p>Dieses Thema handelt von einem traurigen Ereignis. Du entscheidest, ob du es ansehen möchtest.</p>
        <p>Du kannst es zusammen mit einem Erwachsenen anschauen. Hier gibt es ruhige Erklärungen und keine erschreckenden Bilder.</p>
        <div className="model-buttons">
          <button type="button" className="primary-button" onClick={() => setZugestimmt(true)}>Die Erklärung anschauen</button>
          <button type="button" className="secondary-button" onClick={() => onTopic('history-un')}>Lieber über Zusammenarbeit lernen</button>
        </div>
      </article>
    );
  }
  return <Kartenkoerper topic={t} actions={a} onTopic={onTopic} embedded={embedded}/>;
}

const satz = (text: string) => (/[.!?…:]$/.test(text.trim()) ? text.trim() : text.trim() + '.');

function Kartenkoerper({topic: t, actions: a, onTopic, embedded}: InhaltProps) {
  const Titel = embedded ? 'h2' : 'h1';
  const Abschnitt = embedded ? 'h3' : 'h2';
  const Unterabschnitt = embedded ? 'h4' : 'h3';
  // Die Frage wird beim Öffnen einmal gewählt (ersteFrage) und wechselt nur über „Noch eine Frage“,
  // nie von selbst, während das Kind antwortet. Danach kommt die nächste Frage der Karte, am Ende wieder die erste.
  const fragen = useMemo(() => kartenFragen(t, HINTS as Record<string, {steps: string[]}>), [t]);
  const [nummer, setNummer] = useState(() => fragen.indexOf(ersteFrage(fragen, a.progress.review)));
  const [weitergeblaettert, setWeitergeblaettert] = useState(false);
  const frage = fragen[nummer];
  // Dieselbe Reihenfolge wie in „Rate mal!“ (dort aus demselben Spielstand gelesen).
  const auswahl = antwortReihe(frage, a.progress.gameSessions['topic:' + t.id]?.[frage.itemsKey]);
  const weiter = fragen.length > 1 ? () => { setNummer(n => (n + 1) % fragen.length); setWeitergeblaettert(true); } : undefined;
  const eintrag = WORLD_INDEX.find(e => e.id === t.id);
  const welt = WORLD_CATEGORIES.find(c => c.id === t.category);
  const kontext = t.history?.date ?? t.person?.field;
  const gemerkt = a.progress.favorites.includes('topic:' + t.id);
  const gelernt = a.progress.discoveries.includes('learned:' + t.id);
  const heikel = !!t.history?.sensitive;
  const verbindungen = connectionsFor(t.id);
  const kacheln = dazuPasst(t, verbindungen);
  const nachbarKarte = kacheln.find(k => k.art === 'karte');
  const nachbar = nachbarKarte && WORLD_INDEX.find(e => e.id === nachbarKarte.topicId);
  const vorlesen = () => a.onRead([t.title, t.intro, 'Rate mal!', frage.question.prompt, ...auswahl].map(satz).join(' '));

  // Die Absätze von „Kurz erklärt“ (mit Fotosynthese-Zeichnung und Arbeitsweg der Personen).
  const absaetze = (
    <>
      {t.paragraphs.map((absatz, i) => (
        <Fragment key={i}>
          <p>{absatz}</p>
          {t.id === 'science-photosynthesis' && i === 0 && (
            <section className="photosynthesis-concept-section" aria-label="Lichtenergie und Stoffwege">
              <Unterabschnitt>Licht liefert Energie, Stoffe liefern Bausteine</Unterabschnitt>
              <figure>
                <PhotosynthesisRolesDrawing/>
                <figcaption>Eigene vereinfachte Erklärzeichnung · KI-unterstützt.</figcaption>
              </figure>
            </section>
          )}
        </Fragment>
      ))}
      {t.person && (
        <div className="contribution-flow">
          <div>
            <Compass size={23} aria-hidden="true"/>
            <strong>Das Arbeitsgebiet</strong>
            <p>{t.person.field}</p>
          </div>
          <ArrowRight size={23} aria-hidden="true"/>
          <div>
            <Users size={23} aria-hidden="true"/>
            <strong>So wurde geforscht</strong>
            <p>{t.person.method}</p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <article className={`wissenskarte wissenskarte-welt-${t.category}${embedded ? ' wissenskarte-eingebettet' : ''}`}>
      <header className="wissenskarte-kopf">
        {eintrag && <div className="wissenskarte-bild"><Kartenbild topic={eintrag} groesse="gross" nachweis/></div>}
        <div className="wissenskarte-kopftext">
          <p className="wissenskarte-welt">
            {welt?.title}
            {kontext && <span className="wissenskarte-kontext"> · {kontext}</span>}
          </p>
          <Titel id="world-topic-title" tabIndex={-1} aria-label={t.title}>{displayTopicTitle(t.title)}</Titel>
          <p className="wissenskarte-einleitung">{t.intro}</p>
          {gelernt && <p className="wissenskarte-gelernt"><Check size={20} aria-hidden="true"/> Gelernt</p>}
          <div className="wissenskarte-knoepfe">
            <button type="button" className="secondary-button" onClick={vorlesen}>
              <Volume2 size={20} aria-hidden="true"/> Vorlesen
            </button>
            <button type="button" className="secondary-button wissenskarte-merken" aria-pressed={gemerkt} onClick={() => a.onFavorite('topic:' + t.id)}>
              <Heart size={20} aria-hidden="true" fill={gemerkt ? 'currentColor' : 'none'}/> Merken
            </button>
          </div>
        </div>
      </header>

      <RateMal
        key={frage.id}
        frage={frage}
        ueberschrift={Abschnitt}
        onLearn={() => a.onLearn(t.id)}
        onReview={a.onReview}
        onRead={a.onRead}
        onWeiter={weiter}
        fokus={weitergeblaettert}
      />

      <section className="world-short wissenskarte-abschnitt" tabIndex={-1}>
        <Abschnitt>Kurz erklärt</Abschnitt>
        {t.chapters ? (
          <>
            {t.chapters.map(kapitel => (
              <Fragment key={kapitel.question}>
                <Unterabschnitt className="wissenskarte-haeppchen">{kapitel.question}</Unterabschnitt>
                <p>{kapitel.text}</p>
              </Fragment>
            ))}
            {/* Kein Wissen geht verloren: Die bisherigen Absätze stehen unverändert unter „Für Große“.
                „Ganz einfach“ entfällt hier, die Häppchen sind die einfache Fassung; der Satz steht oben in „Ausprobieren“. */}
            <LearningDetails className="wissenskarte-fuer-grosse" summary="Für Große">
              {absaetze}
            </LearningDetails>
          </>
        ) : (
          <>
            {t.learning && (
              <LearningDetails summary="Ganz einfach · etwa 6–8 Jahre">
                <p>{t.learning.starter}</p>
              </LearningDetails>
            )}
            {absaetze}
          </>
        )}
      </section>

      {t.claims?.[0] && <StimmtDas behauptung={t.claims[0]} ueberschrift={Abschnitt}/>}

      {t.facts.length > 0 && (
        <section className="wissenskarte-abschnitt wissenskarte-steckbrief">
          <Abschnitt>Steckbrief</Abschnitt>
          <dl className="world-facts">
            {t.facts.map(fakt => (
              <div key={fakt.label}>
                <dt>{fakt.label}</dt>
                <dd>{fakt.text}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {t.surprise && (
        <section className="wissenskarte-schon-gewusst">
          {heikel ? <BookOpen size={26} aria-hidden="true"/> : <Lightbulb size={26} aria-hidden="true"/>}
          <div>
            <Abschnitt>{heikel ? 'Erinnern und verstehen' : 'Schon gewusst?'}</Abschnitt>
            <p>{t.surprise}</p>
          </div>
        </section>
      )}

      {hatAusprobieren(t) && <Ausprobieren topic={t} actions={a}/>}

      <MehrErfahren topic={t} actions={a} onTopic={onTopic} verbindungen={weitereVerbindungen(verbindungen)} ueberschrift={Unterabschnitt}/>

      <details className="world-sources wissenskarte-erwachsene">
        <summary>Für Erwachsene: Quellen und Lernziele</summary>
        {t.learning?.benefit && <p><strong>Lernziel:</strong> {t.learning.benefit}</p>}
        {t.checkedAt && (
          <p className="world-source-date">
            Quellenabgleich am <time dateTime={t.checkedAt}>{new Date(t.checkedAt + 'T12:00:00Z').toLocaleDateString('de-DE', {timeZone: 'UTC'})}</time>.
          </p>
        )}
        <p>{t.sourceNote ?? 'Inhalte fachlich geprüft am 7. Oktober 2026. Ein Zeitanker ist nicht immer ein genauer Erfindungstag. Die kleinen Modelle sind ausdrücklich vereinfachte Lernhilfen.'}</p>
        <ul>
          {t.sources.map((quelle, i) => (
            <li key={i}><a href={quelle.url} target="_blank" rel="noreferrer">{quelle.label}</a></li>
          ))}
        </ul>
        <p>Originalquellen können zum Lesen eine Internetverbindung benötigen.</p>
      </details>

      <DazuPasst topic={t} actions={a} onTopic={onTopic} kacheln={kacheln} ueberschrift={Abschnitt}/>

      {/* Alle Fotos dieser Seite, auch das der Kachel; Kacheln zeigen selbst keine Nachweiszeile. */}
      <BildnachweiseAufDieserSeite photoIds={[t.image, nachbar?.image].filter((id): id is string => !!id)}/>
    </article>
  );
}
