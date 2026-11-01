import { useState } from 'react';
import { loadAiConfig } from '../ai/config';
import type { UnderTheHood } from '../content/types';
import { Icon } from '../ui/Icon';
import { T } from '../ui/typography';

type Choice = 'claude' | 'mistral';

const PREF_KEY = 'gitgudai.capot';
const NAMES: Record<Choice, string> = { claude: 'Claude', mistral: 'Mistral' };

/** Onglet par défaut : le dernier choisi, sinon le fournisseur connecté dans les Réglages. */
function initialChoice(): Choice {
  try {
    const saved = window.localStorage.getItem(PREF_KEY);
    if (saved === 'claude' || saved === 'mistral') return saved;
  } catch {
    /* stockage indisponible : on se rabat sur les réglages */
  }
  return loadAiConfig().provider === 'mistral' ? 'mistral' : 'claude';
}

/** Panneau repliable « Sous le capot » : comment le concept s'implémente, avec Claude ou Mistral. */
export function UnderTheHoodPanel({ hood }: { hood: UnderTheHood }) {
  const [choice, setChoice] = useState<Choice>(initialChoice);
  const tabs = hood.variants.filter((v): v is typeof v & { provider: Choice } => v.provider !== 'commun');
  const variant = tabs.find((v) => v.provider === choice) ?? hood.variants[0]!;

  const choose = (next: Choice) => {
    setChoice(next);
    try {
      window.localStorage.setItem(PREF_KEY, next);
    } catch {
      /* préférence non mémorisée : sans conséquence */
    }
  };

  return (
    <details className="hood frame">
      <summary className="hood__summary">
        <Icon name="wrench" size={12} />
        <span className="hood__kicker">Sous le capot</span>
        <span className="hood__title">
          <T>{hood.title}</T>
        </span>
      </summary>
      <div className="hood__body">
        {tabs.length > 1 ? (
          <div className="seg-toggle" role="group" aria-label="Fournisseur">
            {tabs.map((v) => (
              <button
                key={v.provider}
                type="button"
                className={`seg ${v.provider === variant.provider ? 'seg--on' : ''}`}
                aria-pressed={v.provider === variant.provider}
                onClick={() => choose(v.provider)}
              >
                {NAMES[v.provider]}
              </button>
            ))}
          </div>
        ) : (
          <p className="hood__common">Même code avec Claude ou Mistral : il fait partie du harnais.</p>
        )}
        <div className="hood__code-wrap">
          <span className="hood__label">{variant.label}</span>
          <pre className="hood__code">
            <code>{variant.code}</code>
          </pre>
        </div>
        <ul className="hood__notes">
          {variant.notes.map((note, i) => (
            <li key={i}>
              <T>{note}</T>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
