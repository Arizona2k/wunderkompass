'use client';
// Was unter „Ausprobieren“ steht: Belege zu Personen und Geschichte, die Mitmach-Bausteine je Kartentyp
// und der Forscherblick. Reihenfolge und Inhalt wie auf der alten Karte.
// Eigenes Skript: Es lädt erst, wenn ein Kind „Ausprobieren“ öffnet (ausprobieren.tsx).
// Es hängt im SavedGame der Karte, damit jeder Baustein unter seinem alten Schlüssel speichert.
import {useCallback} from 'react';
import AnimalInquiry from '../../animal-inquiry';
import BuildingModel from '../../building-model';
import HistoryContext from '../../history-context';
import HistoryEvidence from '../../history-evidence';
import PeopleEvidence from '../../people-evidence';
import ScienceInvestigation from '../../science-investigation';
import ScienceThinking from '../../science-thinking';
import TideComparison from '../../tide-comparison';
import WorldModelView from '../../world-models';
import type {WorldActions, WorldTopic} from '../../world-types';
import AnimalMeasure from './tier-groesse';
import InventionStory from './erfindung-geschichte';
import {hatBaustein} from './karten-daten';
import '../../article-workshop.css';

export default function Bausteine({topic: t, actions: a}: {topic: WorldTopic; actions: WorldActions}) {
  const {onVisit, onRead} = a;
  const geloest = useCallback(() => onVisit('model:' + t.id), [onVisit, t.id]);
  return (
    <div className="wissenskarte-bausteine">
      <PeopleEvidence id={t.id} onRead={onRead}/>
      {t.history && <>
        <HistoryContext id={t.id}/>
        <HistoryEvidence key={t.id} id={t.id}/>
      </>}
      {hatBaustein(t) && (
        <div className="article-experiment">
          {t.animal && <>
            <AnimalMeasure topic={t}/>
            <AnimalInquiry id={t.id} onRead={onRead}/>
          </>}
          {t.invention && <InventionStory topic={t} onParts={() => onVisit('parts:' + t.id)}/>}
          {t.building && <BuildingModel topic={t} onSolved={geloest}/>}
          {t.model && <WorldModelView key={t.id + t.model} kind={t.model} onSolved={geloest}/>}
          {t.investigation && <ScienceInvestigation kind={t.investigation}/>}
          {t.id === 'science-tides' && <TideComparison/>}
        </div>
      )}
      <ScienceThinking key={t.id} id={t.id} onRead={onRead}/>
    </div>
  );
}
