'use client';
// „Mehr erfahren“: alles zum Weiterlesen, zu Beginn zugeklappt. Mehr Wissen, selbst beobachten,
// weitere erklärte Verbindungen, Orte auf der Karte, Lernrouten, Buch-, Labor- und Reise-Links.
// Nur erklärte Verbindungen (world-connections.json) mit Satz „warum“; `related` erscheint nicht (Entwurf 6.8).
// data-history-disclosure: Kommt ein Kind über einen Knopf hier drin zurück, ist der Bereich wieder offen
// und der Fokus liegt wieder auf dem Knopf (navigateHash/restoreRouteView).
import {ArrowRight, Compass, Volume2} from 'lucide-react';
import BookMeasurementLinks from '../../book-measurement-links';
import {navigateHash} from '../../hash-route';
import JourneyTopicLinks from '../../journey-topic-links';
import ResearchKnowledgeLinks from '../../research-knowledge-links';
import TopicMap from '../../topic-map';
import {WORLD_INDEX, WORLD_ROUTES, worldPlace} from '../../world-index';
import type {WorldActions, WorldTopic} from '../../world-types';

type Verbindung = {id: string; topic: string; why: string};

type MehrErfahrenProps = {
  topic: WorldTopic;
  actions: WorldActions;
  onTopic: (id: string) => void;
  verbindungen: readonly Verbindung[];
  ueberschrift: 'h3' | 'h4';
};

export default function MehrErfahren({topic: t, actions: a, onTopic, verbindungen, ueberschrift: Ueberschrift}: MehrErfahrenProps) {
  const eintrag = WORLD_INDEX.find(e => e.id === t.id);
  const routen = WORLD_ROUTES.filter(r => r.topics.includes(t.id)).slice(0, 2);
  // Der erste Link steht schon als Kachel unter „Dazu passt“.
  const links = t.links.slice(1);
  return (
    <details className="wissenskarte-mehr wissenskarte-aufklapper" data-history-disclosure={'mehr-erfahren-' + t.id}>
      <summary>Mehr erfahren</summary>
      <div className="wissenskarte-mehr-inhalt">
        {t.more.length > 0 && (
          <section>
            {t.more.map((absatz, i) => <p key={i}>{absatz}</p>)}
            <button type="button" className="speech-button" onClick={() => a.onRead(t.more.join('. '))}>
              <Volume2 size={17} aria-hidden="true"/> Mehr-Wissen vorlesen
            </button>
          </section>
        )}

        {t.learning?.observe && (
          <section>
            <Ueberschrift>Selbst beobachten</Ueberschrift>
            <p>{t.learning.observe}</p>
          </section>
        )}

        {verbindungen.length > 0 && (
          <section className="knowledge-network">
            <Ueberschrift>Das hängt auch damit zusammen</Ueberschrift>
            {verbindungen.map(v => (
              <div className="connection-card" key={v.id}>
                <button
                  type="button"
                  className="knowledge-link"
                  data-route-focus={`world-connection-${t.id}-${v.topic}`}
                  onClick={event => { event.currentTarget.focus({preventScroll: true}); onTopic(v.topic); }}
                >
                  <span>{WORLD_INDEX.find(e => e.id === v.topic)?.title}</span>
                  <ArrowRight size={17} aria-hidden="true"/>
                </button>
                <p>{v.why}</p>
              </div>
            ))}
          </section>
        )}

        {eintrag && t.locations.length > 0 && (
          <section>
            <Ueberschrift>Auf der Karte</Ueberschrift>
            <p>{t.category === 'animals' ? 'Besuche eine Beispielregion. Tiere leben oft in viel größeren Gebieten.' : 'Besuche einen Ort, der zu dieser Geschichte gehört.'}</p>
            <TopicMap entry={eintrag} onPlace={i => a.onPlace(worldPlace(eintrag, i))}/>
          </section>
        )}

        <BookMeasurementLinks topicId={t.id}/>
        <ResearchKnowledgeLinks topicId={t.id}/>
        <JourneyTopicLinks topicId={t.id} onReadStop={() => a.onRead('')}/>

        {(routen.length > 0 || links.length > 0) && (
          <section>
            <Ueberschrift>Weiterentdecken</Ueberschrift>
            {routen.length > 0 && (
              <div className="article-routes">
                <p className="eyebrow">AUF EINER LERNROUTE</p>
                {routen.map(r => (
                  <button
                    type="button"
                    className="knowledge-link"
                    data-route-focus={`world-article-route-${t.id}-${r.id}`}
                    key={r.id}
                    onClick={event => {
                      event.currentTarget.focus({preventScroll: true});
                      a.onRead('');
                      a.onActivity({type: 'route', id: r.id});
                      navigateHash('world/route/' + r.id);
                    }}
                  >
                    <span><Compass size={17} aria-hidden="true"/> {r.title}</span>
                    <ArrowRight size={17} aria-hidden="true"/>
                  </button>
                ))}
              </div>
            )}
            {links.map(l => (
              <button type="button" className="knowledge-link" key={l.label} onClick={() => a.onNavigate(l.mode, l.id, l.iso)}>
                <span>{l.label}</span>
                <ArrowRight size={17} aria-hidden="true"/>
              </button>
            ))}
          </section>
        )}
      </div>
    </details>
  );
}
