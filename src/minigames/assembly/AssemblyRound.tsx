import { useState } from 'react';
import { useGame } from '../../game/GameContext';
import { Icon } from '../../ui/Icon';
import { T } from '../../ui/typography';
import {
  ALL_PIECES,
  ASSEMBLY_PIECES,
  CAUSES,
  GOAL_RATE,
  assemblyScore,
  meetsGoal,
  simulate,
  type PieceId,
  type RunSummary,
} from './logic';

const pct = (x: number) => `${Math.round(x * 100)} %`;
const euros = (x: number) => `${x.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
const LABEL = Object.fromEntries(ASSEMBLY_PIECES.map((p) => [p.id, p.label])) as Record<PieceId, string>;

function RunView({ run }: { run: RunSummary }) {
  return (
    <>
      <dl className="assembly__metrics">
        <div className={run.successRate >= GOAL_RATE ? 'assembly__metric--good' : ''}>
          <dt>Réussite</dt>
          <dd>{pct(run.successRate)}</dd>
        </div>
        <div className={run.incidents > 0 ? 'assembly__metric--bad' : ''}>
          <dt>Dégâts réels</dt>
          <dd>{run.incidents}</dd>
        </div>
        <div>
          <dt>Coût</dt>
          <dd>{euros(run.cost)}</dd>
        </div>
        <div>
          <dt>Confirmations</dt>
          <dd>{run.asks}</dd>
        </div>
      </dl>
      <ol className="assembly__cells" aria-label="Résultat des 20 essais">
        {run.results.map((r) => {
          const incident = r.cause ? CAUSES[r.cause].incident : false;
          const state = r.ok ? 'ok' : incident ? 'incident' : 'fail';
          const label = r.ok ? 'réussi' : `${CAUSES[r.cause!].label.toLowerCase()}`;
          return (
            <li key={r.id} className={`assembly__cell assembly__cell--${state}`} title={`Essai ${r.id} : ${label}`} aria-label={`Essai ${r.id} : ${label}`}>
              <Icon name={r.ok ? 'check' : incident ? 'warning' : 'cross'} size={10} />
            </li>
          );
        })}
      </ol>
      {run.failures.length ? (
        <ul className="assembly__log" aria-label="Journal des échecs">
          {run.failures.map((f) => (
            <li key={f.cause} className={CAUSES[f.cause].incident ? 'assembly__log--incident' : ''}>
              <b>
                {CAUSES[f.cause].label} · {f.attempts.length > 1 ? `essais ${f.attempts.join(', ')}` : `essai ${f.attempts[0]}`}
              </b>
              <span>
                <T>{CAUSES[f.cause].log}</T>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="good-text">Aucun échec.</p>
      )}
    </>
  );
}

/** Manche 1 du niveau 7 : monter le harnais de Bob et lancer 20 essais de la même mission. */
export function AssemblyRound({ onDone }: { onDone: (score: number) => void }) {
  const { sfx } = useGame();
  const [pieces, setPieces] = useState<PieceId[]>(['loop']);
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const current = runs[runs.length - 1];
  const ordered = ALL_PIECES.filter((p) => pieces.includes(p));
  const unchanged = current !== undefined && current.pieces.join() === ordered.join();
  const reached = runs.some(meetsGoal);

  const toggle = (id: PieceId) => {
    sfx('click');
    setPieces((ps) => (ps.includes(id) ? ps.filter((p) => p !== id) : [...ps, id]));
  };

  const launch = () => {
    const run = simulate(pieces);
    setRuns((rs) => [...rs, run]);
    sfx(meetsGoal(run) ? 'good' : run.successRate > (current?.successRate ?? 0) ? 'click' : 'bad');
  };

  return (
    <div className="mg-round">
      <p className="mg-instructions">
        Mission : corriger la fonction <code>moyenne()</code> du projet de Karim, tests à l’appui. Le <b>modèle ne change jamais</b> : seul le harnais
        change. Active ou retire des pièces, puis lance 20 essais. <b>Objectif : au moins 90 % de réussite, sans aucun dégât réel.</b>
      </p>
      <div className="assembly">
        <section className="assembly__bench" aria-label="Pièces du harnais">
          <h3 className="assembly__title">Le harnais de Bob</h3>
          <ul className="assembly__pieces">
            {ASSEMBLY_PIECES.map((p) => {
              const on = pieces.includes(p.id);
              return (
                <li key={p.id}>
                  <button type="button" className={`assembly__piece ${on ? 'assembly__piece--on' : ''}`} aria-pressed={on} onClick={() => toggle(p.id)}>
                    <span className="assembly__switch" aria-hidden="true">
                      {on ? <Icon name="check" size={10} /> : null}
                    </span>
                    <span className="assembly__piece-text">
                      <b>{p.label}</b>
                      <small>
                        <T>{p.desc}</T>
                      </small>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button type="button" className="btn" onClick={launch} disabled={unchanged}>
            <Icon name="play" size={12} /> {unchanged ? 'Change une pièce pour relancer' : 'Lancer 20 essais'}
          </button>
        </section>
        <section className="assembly__results" aria-live="polite">
          <h3 className="assembly__title">
            {current ? `Montage n° ${runs.length} : ${current.pieces.length ? current.pieces.map((p) => LABEL[p]).join(', ') : 'aucune pièce'}` : 'Résultats'}
          </h3>
          {current ? (
            <RunView run={current} />
          ) : (
            <p className="muted">Pour commencer, Bob n’a que sa boucle. Lance les essais pour voir ce que ça donne.</p>
          )}
        </section>
      </div>
      {runs.length > 1 ? (
        <table className="assembly__history">
          <caption>Tes montages précédents (même modèle, même mission)</caption>
          <thead>
            <tr>
              <th scope="col">Pièces</th>
              <th scope="col">Réussite</th>
              <th scope="col">Dégâts</th>
            </tr>
          </thead>
          <tbody>
            {runs
              .slice(-6)
              .reverse()
              .map((r, i) => (
                <tr key={runs.length - i}>
                  <td>{r.pieces.length ? r.pieces.map((p) => LABEL[p]).join(', ') : 'aucune'}</td>
                  <td>{pct(r.successRate)}</td>
                  <td>{r.incidents}</td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : null}
      <div className="mg-actions">
        <span className={reached ? 'good-text' : 'muted'} role="status">
          {reached ? 'Objectif atteint : même modèle, harnais complet.' : 'Objectif : 90 % de réussite et zéro dégât.'}
        </span>
        <button type="button" className={reached ? 'btn' : 'btn btn--ghost'} disabled={runs.length === 0} onClick={() => onDone(assemblyScore(runs))}>
          Terminer la manche <Icon name="arrow-right" size={12} />
        </button>
      </div>
    </div>
  );
}
