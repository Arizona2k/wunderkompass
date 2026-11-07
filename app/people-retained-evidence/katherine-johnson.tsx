import {useSavedModel} from '../../app/saved-games';

// Private existing-article preparation only; not imported by the frozen product.
export function PeopleCalculationCheckFigure({selected:scene,onSelect:setScene}:{selected:number;onSelect:(scene:number)=>void}) {
  const [step, setStep] = useSavedModel<number>('peopleEvidenceCalculationStep',2,{min:0,max:4});
  const first = (t: number) => t * (4 - t);
  const second = (t: number) => scene === 0 ? 4 * t - t * t : 4 * t;
  const x = (t: number) => 50 + 60 * t;
  const y = (value: number) => 215 - 10 * value;
  const steps = [0, 1, 2, 3, 4];
  const firstValue = first(step);
  const secondValue = second(step);
  return <>
    <h4>Dieselben Eingaben, zwei Rechenwege</h4>
    <p>Unser erfundenes Zahlenbeispiel verwendet fünf Schritte. Rechnung A lautet t · (4 − t). Rechnung B wird entweder gleichwertig umgeformt oder enthält absichtlich einen fehlenden Term.</p>
    <svg viewBox="0 0 320 264" role="img" aria-label={`Eigener Zahlenvergleich auf gemeinsamer Skala von 0 bis 16. Schritt ${step}: A ergibt ${firstValue}, B ergibt ${secondValue}. Kein Raumflugmodell.`}>
      <path d="M50 40V215H300" fill="none" stroke="#234e58" strokeWidth="2" />
      {[0, 8, 16].map(value => <g key={value}><path d={`M44 ${y(value)}H50`} stroke="#234e58" /><text x="38" y={y(value) + 9} textAnchor="end" fontSize="28" fill="#234e58">{value}</text></g>)}
      {steps.map(t => <text key={t} x={x(t)} y="246" textAnchor="middle" fontSize="28" fill="#234e58">{t}</text>)}
      <polyline points={steps.map(t => `${x(t)},${y(first(t))}`).join(' ')} fill="none" stroke="#467889" strokeWidth="3" />
      <polyline points={steps.map(t => `${x(t)},${y(second(t))}`).join(' ')} fill="none" stroke="#b7572f" strokeWidth="3" strokeDasharray="8 5" />
      {steps.map(t => <g key={t}><circle cx={x(t)} cy={y(first(t))} r="4" fill="#467889" /><path d={`M${x(t)} ${y(second(t))-7}l7 7-7 7-7-7Z`} fill="none" stroke="#b7572f" strokeWidth="2" /></g>)}
    </svg>
    <ol className="people-evidence-legend"><li>Waagerecht: gedachter Schritt t von 0 bis 4, keine Sekunden.</li><li>Senkrecht: Rechenergebnis auf gemeinsamer Skala von 0 bis 16, keine Höhe.</li><li>Kreise und volle Linie: Rechnung A. Rauten und gestrichelte Linie: Rechnung B. Gleiche Ergebnisse liegen übereinander.</li></ol>
    <div className="visual-choice" role="group" aria-label="Zweite Rechnung wählen">
      <button aria-pressed={scene === 0} onClick={() => setScene(0)}>B: 4t − t²</button>
      <button aria-pressed={scene === 1} onClick={() => setScene(1)}>B: absichtlich nur 4t</button>
    </div>
    <div className="visual-choice" role="group" aria-label="Vergleichsschritt wählen">{steps.map(t => <button key={t} aria-pressed={step === t} onClick={() => setStep(t)}>Schritt {t}</button>)}</div>
    <p className="people-evidence-observation" role="status">Schritt {step}: A = {firstValue}; B = {secondValue}. {firstValue === secondValue ? 'An dieser Stelle stimmen die Ergebnisse überein. Prüfe auch andere Schritte.' : 'Hier unterscheiden sich die Ergebnisse. Prüfe Eingabe, Rechenregel und Übertragung.'}</p>
    <p className="small-note">Eigene Modellzeichnung mit KI-Unterstützung. Erfundenes Rechenbeispiel, keine NASA-Gleichung, Flugbahn, Messreihe oder Sicherheitsprüfung. Beide Rechenwege laufen in demselben kleinen Lernprogramm; das ist keine unabhängige technische Flugfreigabe. Übereinstimmung allein beweist weder richtige Ausgangsdaten noch ein passendes Modell der Wirklichkeit. Die Verbindungslinien helfen nur, die fünf Werte zu vergleichen.</p>
  </>;
}
