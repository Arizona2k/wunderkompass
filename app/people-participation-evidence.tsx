// Own private WK053 authoring only; active PR90 does not import this source.
type Props = { selected: number; onSelect: (value: number) => void };
const INK = '#234e58', BLUE = '#467889', ORANGE = '#b7572f';

export function ParticipationRuleEvidenceFigure({ selected, onSelect }: Props) {
  const all = selected === 1;
  const counted = all ? 4 : 2;
  return <>
    <h4>Was bewirkt eine geschriebene Regel?</h4>
    <p>Ein erfundenes Lesebeispiel: Vier Mitglieder dürfen mitentscheiden. Regel A berücksichtigt trotzdem nur die Stimmen von Mitglied 1 und 2. Regel B berücksichtigt die Stimmen aller vier.</p>
    <svg viewBox="0 0 320 215" role="img" aria-label={'Vier eigene neutrale Stimmzettelsymbole für dieselben stimmberechtigten Mitglieder. Regel ' + (all ? 'B berücksichtigt alle vier Stimmen.' : 'A berücksichtigt nur die Stimmen von Mitglied 1 und 2.')} data-participation-rule={all ? 'all-four' : 'only-two'}>
      {[45, 122, 199, 276].map((x, i) => {
        const included = all || i < 2;
        return <g key={i}>
          <rect x={x - 28} y="38" width="56" height="83" rx="3" fill="#fff" stroke={included ? BLUE : INK} strokeWidth={included ? '3' : '2'} strokeDasharray={included ? undefined : '5 4'} />
          <path d={'M' + (x - 17) + ' 57H' + (x + 17) + 'M' + (x - 17) + ' 69H' + (x + 11)} fill="none" stroke={INK} strokeWidth="2" />
          {included ? <path d={'M' + (x - 12) + ' 94L' + (x - 3) + ' 103L' + (x + 14) + ' 85'} fill="none" stroke={BLUE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /> : <path d={'M' + (x - 13) + ' 98H' + (x + 13)} fill="none" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" />}
          <text x={x} y="154" fontSize="24" textAnchor="middle" fill={INK}>{i + 1}</text>
        </g>;
      })}
      <text x="160" y="198" fontSize="26" textAnchor="middle" fill={INK}>{counted} von 4 berücksichtigt</text>
    </svg>
    <ol className="people-evidence-legend">
      <li>Mitglied 1: in beiden Regeln berücksichtigt.</li>
      <li>Mitglied 2: in beiden Regeln berücksichtigt.</li>
      <li>Mitglied 3: nur in Regel B berücksichtigt.</li>
      <li>Mitglied 4: nur in Regel B berücksichtigt.</li>
    </ol>
    <div className="visual-choice" role="group" aria-label="Wirkung der zwei erfundenen Regeln vergleichen">
      {['Regel A: zwei Stimmen', 'Regel B: vier Stimmen'].map((label, i) => <button key={label} aria-pressed={selected === i} onClick={() => onSelect(i)}>{label}</button>)}
    </div>
    <p className="people-evidence-observation" role="status">{all ? 'Regel B berücksichtigt alle vier vorgegebenen stimmberechtigten Mitglieder.' : 'Regel A lässt die Stimmen von Mitglied 3 und 4 unberücksichtigt, obwohl sie im Beispiel mitentscheiden dürfen.'} Die Zahl der Mitglieder und ihre Berechtigung bleiben gleich; nur die berücksichtigten Stimmen wechseln.</p>
    <p className="small-note">Eigene Erklärzeichnung mit KI-Unterstützung. Eigene erfundene Stimmzettelsymbole, kein historisches Wahldokument und keine Nachstellung der Apartheid. Die Nummern kennzeichnen nur dieselben vier Mitglieder; sie stehen für keine rassistischen Kategorien. Häkchen bedeutet hier nur berücksichtigt, nicht Zustimmung zu einer bestimmten Sache. Niemand übernimmt eine historische Opfer- oder Täterrolle. Der Vergleich bewertet keine persönliche moralische Haltung und erklärt nicht den ganzen politischen Wandel Südafrikas.</p>
  </>;
}
