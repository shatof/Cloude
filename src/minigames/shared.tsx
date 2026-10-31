import { Icon } from '../ui/Icon';

export interface MiniGameProps {
  /** À appeler une seule fois, avec un score entre 0 et 1. */
  onFinish: (score: number) => void;
}

/** En-tête commun : titre + manches (avec le score des manches terminées). */
export function RoundHeader({
  title,
  rounds,
  current,
  scores,
}: {
  title: string;
  rounds: string[];
  current: number;
  scores: number[];
}) {
  return (
    <header className="mg__head">
      <h2>{title}</h2>
      <ol className="mg__rounds" aria-label="Manches">
        {rounds.map((r, i) => {
          const state = i < current ? 'done' : i === current ? 'current' : 'todo';
          return (
            <li key={r} className={`mg__round mg__round--${state}`} aria-current={i === current ? 'step' : undefined}>
              <span className="mg__round-num">{i < current ? <Icon name="check" size={10} /> : i + 1}</span>
              <span>
                {r}
                {i < current && scores[i] !== undefined ? <small> · {Math.round((scores[i] as number) * 100)} %</small> : null}
              </span>
            </li>
          );
        })}
      </ol>
    </header>
  );
}
