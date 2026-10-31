import { useState, type ComponentType } from 'react';
import { Icon } from '../../ui/Icon';
import { T } from '../../ui/typography';

/**
 * Illustrations configurables pour les écrans de concept.
 * Chaque fabrique renvoie un composant prêt à être enregistré dans ILLUSTRATIONS.
 */

export type Tone = 'model' | 'harness' | 'world' | 'user' | 'note' | 'good' | 'bad';

export interface Line {
  who?: string;
  tone?: Tone;
  text: string;
  /** Affiché en police « données » (code, appel d'outil, JSON…). */
  code?: boolean;
}

function LineView({ line }: { line: Line }) {
  return (
    <li className={`ill-line ill-line--${line.tone ?? 'note'}`}>
      {line.who ? <span className="ill-line__who">{line.who}</span> : null}
      <span className={line.code ? 'data ill-line__code' : undefined}>{line.code ? line.text : <T>{line.text}</T>}</span>
    </li>
  );
}

/** Déroulé pas à pas (transcript, trace d'agent…). */
export function stepsIllustration(lines: Line[], caption?: string): ComponentType {
  function StepsIllustration() {
    const [shown, setShown] = useState(1);
    const done = shown >= lines.length;
    return (
      <div className="illus">
        <ol className="ill-lines">
          {lines.slice(0, shown).map((l, i) => (
            <LineView key={i} line={l} />
          ))}
        </ol>
        <button type="button" className="btn btn--small btn--secondary" onClick={() => setShown(done ? 1 : shown + 1)}>
          {done ? (
            'Recommencer'
          ) : (
            <>
              Étape suivante <Icon name="arrow-right" size={10} />
            </>
          )}
        </button>
        {caption && done ? (
          <p className="illus__caption">
            <T>{caption}</T>
          </p>
        ) : null}
      </div>
    );
  }
  return StepsIllustration;
}

/** Comparaison entre deux ou trois situations (sans / avec…). */
export function toggleIllustration(states: { label: string; lines: Line[]; caption: string }[]): ComponentType {
  function ToggleIllustration() {
    const [index, setIndex] = useState(0);
    const state = states[index]!;
    return (
      <div className="illus">
        <div className="seg-toggle" role="group" aria-label="Situation">
          {states.map((s, i) => (
            <button key={s.label} type="button" className={`seg ${i === index ? 'seg--on' : ''}`} aria-pressed={i === index} onClick={() => setIndex(i)}>
              {s.label}
            </button>
          ))}
        </div>
        <ol className="ill-lines">
          {state.lines.map((l, i) => (
            <LineView key={`${index}-${i}`} line={l} />
          ))}
        </ol>
        <p className="illus__caption" aria-live="polite">
          <T>{state.caption}</T>
        </p>
      </div>
    );
  }
  return ToggleIllustration;
}

/** Schéma : un élément central et des points cliquables qui s'expliquent. */
export function hotspotIllustration(config: { frame: string; center: string; spots: { label: string; desc: string }[] }): ComponentType {
  function HotspotIllustration() {
    const [index, setIndex] = useState(0);
    const spot = config.spots[index]!;
    return (
      <div className="illus">
        <div className="hotspots">
          <span className="hotspots__frame">{config.frame}</span>
          <div className="hotspots__center">
            <T>{config.center}</T>
          </div>
          <div className="hotspots__spots">
            {config.spots.map((s, i) => (
              <button key={s.label} type="button" className={`hotspots__spot ${i === index ? 'hotspots__spot--on' : ''}`} aria-pressed={i === index} onClick={() => setIndex(i)}>
                <T>{s.label}</T>
              </button>
            ))}
          </div>
        </div>
        <p className="illus__caption" aria-live="polite">
          <b>
            <T>{spot.label}</T> :
          </b>{' '}
          <T>{spot.desc}</T>
        </p>
      </div>
    );
  }
  return HotspotIllustration;
}

/** Barres comparatives, avec bascule optionnelle entre plusieurs jeux de valeurs. */
export function barsIllustration(config: {
  unit: string;
  sets: { label: string; rows: { label: string; value: number; tone?: Tone }[]; caption: string }[];
}): ComponentType {
  function BarsIllustration() {
    const [index, setIndex] = useState(0);
    const set = config.sets[index]!;
    const max = Math.max(...config.sets.flatMap((s) => s.rows.map((r) => r.value)), 1);
    return (
      <div className="illus">
        {config.sets.length > 1 ? (
          <div className="seg-toggle" role="group" aria-label="Situation">
            {config.sets.map((s, i) => (
              <button key={s.label} type="button" className={`seg ${i === index ? 'seg--on' : ''}`} aria-pressed={i === index} onClick={() => setIndex(i)}>
                {s.label}
              </button>
            ))}
          </div>
        ) : null}
        <div className="ill-bars">
          {set.rows.map((r) => (
            <div key={r.label} className="ill-bars__row">
              <span>
                <T>{r.label}</T>
              </span>
              <span className="ill-bars__bar">
                <span className={`ill-bars__fill ill-bars__fill--${r.tone ?? 'world'}`} style={{ width: `${Math.round((r.value / max) * 100)}%` }} />
              </span>
              <b>
                {r.value.toLocaleString('fr-FR')} {config.unit}
              </b>
            </div>
          ))}
        </div>
        <p className="illus__caption" aria-live="polite">
          <T>{set.caption}</T>
        </p>
      </div>
    );
  }
  return BarsIllustration;
}
