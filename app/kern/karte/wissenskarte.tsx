'use client';
// Die neue Wissenskarte (Phase 1, Teilschritt 2). Von oben nach unten:
// Kopf (Bild, Titel, Einleitung, Vorlesen, Merken), „Rate mal!“, Kurz erklärt, Steckbrief, Schon gewusst?, Für Erwachsene.
// Pass-Kopplung wie bei der alten Karte: dieselbe Hülle (SavedGame 'topic:<id>'), dieselben Schlüssel,
// dieselben Aufrufe für Merken, „gelernt“ und Wiederholung.
import {Fragment, useCallback, useState} from 'react';
import {ArrowRight, BookOpen, Check, Compass, Heart, Lightbulb, Users, Volume2} from 'lucide-react';
import {LearningDetails} from '../../learning-components';
import {LearningMotion} from '../../learning-motion';
import PhotosynthesisRolesDrawing from '../../photosynthesis-roles-drawing';
import {SavedGame, useSavedGame} from '../../saved-games';
import {displayTopicTitle} from '../../topic-title';
import HINTS from '../../challenge-hints.json';
import {WORLD_CATEGORIES, WORLD_INDEX} from '../../world-index';
import type {Activity} from '../../progress-storage';
import type {WorldActions, WorldTopic} from '../../world-types';
import Kartenbild from './kartenbild';
import RateMal, {useAntwortReihe} from './rate-mal';
import {ersteFrage, kartenFragen} from './karten-daten';
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
  return <Kartenkoerper topic={t} actions={a} embedded={embedded}/>;
}

const satz = (text: string) => (/[.!?…:]$/.test(text.trim()) ? text.trim() : text.trim() + '.');

function Kartenkoerper({topic: t, actions: a, embedded}: Omit<InhaltProps, 'onTopic'>) {
  const Titel = embedded ? 'h2' : 'h1';
  const Abschnitt = embedded ? 'h3' : 'h2';
  const Unterabschnitt = embedded ? 'h4' : 'h3';
  // Die Frage wird beim Öffnen einmal gewählt und wechselt nicht, während das Kind antwortet.
  const [frage] = useState(() => ersteFrage(kartenFragen(t, HINTS as Record<string, {steps: string[]}>), a.progress.review));
  const auswahl = useAntwortReihe(frage);
  const eintrag = WORLD_INDEX.find(e => e.id === t.id);
  const welt = WORLD_CATEGORIES.find(c => c.id === t.category);
  const kontext = t.history?.date ?? t.person?.field;
  const gemerkt = a.progress.favorites.includes('topic:' + t.id);
  const gelernt = a.progress.discoveries.includes('learned:' + t.id);
  const heikel = !!t.history?.sensitive;
  const vorlesen = () => a.onRead([t.title, t.intro, 'Rate mal!', frage.question.prompt, ...auswahl].map(satz).join(' '));

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
        frage={frage}
        auswahl={auswahl}
        ueberschrift={Abschnitt}
        onLearn={() => a.onLearn(t.id)}
        onReview={a.onReview}
        onRead={a.onRead}
      />

      <section className="world-short wissenskarte-abschnitt" tabIndex={-1}>
        <Abschnitt>Kurz erklärt</Abschnitt>
        {t.learning && (
          <LearningDetails summary="Ganz einfach · etwa 6–8 Jahre">
            <p>{t.learning.starter}</p>
          </LearningDetails>
        )}
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
      </section>

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
    </article>
  );
}
