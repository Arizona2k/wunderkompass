'use client';
// Die Geschichte einer Erfindung: Stationen, damals und heute, Teile zerlegen
// (verschoben aus der alten Karte, Inhalt unverändert). Speichert unter dem Spielstand der Karte
// mit den alten Schlüsseln storyStage, selectedPart, partsSeen und compareToday.
import {Check} from 'lucide-react';
import {useSavedGame, useSavedModel} from '../../saved-games';
import {InventionExperiment} from '../../invention-discovery';
import InventionBlueprint from '../../invention-blueprint';
import TechnologyComparison from '../../technology-comparison';
import type {WorldTopic} from '../../world-types';

export default function InventionStory({topic: t, onParts}: {topic: WorldTopic; onParts: () => void}) {
  const data = t.invention!;
  const [stage, setStage] = useSavedModel<number>('storyStage', 0, {min: 0, max: 5});
  const [part, setPart] = useSavedGame<string | null>('selectedPart', null);
  const [seen, setSeen] = useSavedGame<string[]>('partsSeen', []);
  const [today, setToday] = useSavedGame('compareToday', false);
  const chosen = data.parts.find(p => p.id === part);
  function select(id: string) {
    setPart(id);
    const next = [...new Set([...seen, id])];
    setSeen(next);
    if (data.parts.every(p => next.includes(p.id))) onParts();
  }
  return (
    <section className="invention-story" data-walkthrough={data.walkthrough || undefined}>
      <h3>{data.walkthrough ? 'Technik Schritt für Schritt verstehen' : 'Eine Erfindung ist eine Geschichte'}</h3>
      <div className="story-stations" role="group" aria-label="Schritte der Erfindung">
        {data.stages.map((s, i) => (
          <button className="secondary-button" aria-pressed={stage === i} key={s.label} onClick={() => setStage(i)}>
            {data.walkthrough
              ? <>
                <span className="story-step-number">{i + 1}</span>
                <span className="story-step-label">{s.label}</span>
              </>
              : <><span>{i + 1}</span>{s.label}</>}
          </button>
        ))}
      </div>
      <div className="story-panel" aria-live="polite">
        <h4>{data.stages[stage].label}</h4>
        <p>{data.stages[stage].text}</p>
      </div>
      {!data.walkthrough && (
        <div className="then-now">
          <h4>Damals und heute vergleichen</h4>
          <div className="model-buttons">
            <button className="secondary-button" aria-pressed={!today} onClick={() => setToday(false)}>Damals</button>
            <button className="secondary-button" aria-pressed={today} onClick={() => setToday(true)}>Heute</button>
          </div>
          <TechnologyComparison topic={t} today={today}/>
          <p aria-live="polite">{data.stages[today ? 4 : 3].text}</p>
        </div>
      )}
      <h3>Zerlege die Erfindung</h3>
      <p>Tippe die Teile an. Welche Aufgabe erfüllt jedes Teil?</p>
      <div className="invention-blueprint">
        <div className="blueprint-center">
          <InventionBlueprint topic={t} selected={part} onSelect={select}/>
          <small>
            {data.walkthrough
              ? (t.id === 'invention-telescope'
                ? 'Beispiel: Linsenfernrohr · vereinfacht und nicht maßstabsgetreu. Andere Fernrohre nutzen Spiegel.'
                : 'Funktionsprinzip · vereinfacht, keine historische Rekonstruktion')
              : 'Funktionsplan · vereinfacht und nicht maßstabsgetreu'}
          </small>
        </div>
        <div className="blueprint-parts">
          {data.parts.map((p, i) => (
            <button className="part-button" aria-pressed={p.id === part} key={p.id} onClick={() => select(p.id)}>
              {data.walkthrough
                ? <>
                  <span className="part-number" aria-hidden="true">{i + 1}</span>
                  <span className="part-name">{p.name}</span>
                  {seen.includes(p.id) && <Check size={17} aria-hidden="true"/>}
                </>
                : <><span>{seen.includes(p.id) ? <Check size={17}/> : i + 1}</span>{p.name}</>}
            </button>
          ))}
        </div>
      </div>
      <div className="part-explanation" role="status">
        <h4>{chosen?.name ?? 'Welches Teil möchtest du untersuchen?'}</h4>
        <p>{chosen?.description ?? 'Wähle einen Namen im Funktionsplan. Du darfst jederzeit zurückgehen.'}</p>
        <span>{data.parts.filter(p => seen.includes(p.id)).length}/{data.parts.length} Teile erkundet</span>
      </div>
      {data.model && <InventionExperiment kind={data.model}/>}
    </section>
  );
}
