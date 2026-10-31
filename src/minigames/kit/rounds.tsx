import { useMemo, useState, type ComponentType } from 'react';
import { useGame } from '../../game/GameContext';
import { seededShuffle } from '../../game/random';
import { Icon } from '../../ui/Icon';
import { RichText, T } from '../../ui/typography';
import { RoundHeader, type MiniGameProps } from '../shared';
import { bestBudgetSelection, budgetScore, jaccard, pairwiseOrderScore, ratio } from './scoring';
import type {
  BudgetRoundSpec,
  ChoiceRoundSpec,
  MiniGameConfig,
  OrderRoundSpec,
  PickRoundSpec,
  RoundSpec,
  SortRoundSpec,
} from './types';

interface RoundProps<S> {
  spec: S;
  onDone: (score: number) => void;
}

function Code({ code }: { code?: string }) {
  if (!code) return null;
  return <pre className="mg-code">{code}</pre>;
}

function NextButton({ last, onClick, label }: { last: boolean; onClick: () => void; label?: string }) {
  return (
    <button type="button" className="btn" onClick={onClick} autoFocus>
      {label ?? (last ? 'Manche suivante' : 'Suivant')} <Icon name="arrow-right" size={12} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Choix : une question à la fois, chaque option est expliquée          */
/* ------------------------------------------------------------------ */

export function ChoiceRound({ spec, onDone }: RoundProps<ChoiceRoundSpec>) {
  const { sfx } = useGame();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [good, setGood] = useState(0);
  const question = spec.questions[index]!;
  const options = useMemo(
    () => (question.ordered ? question.options : seededShuffle(question.options, `choice:${question.id}`)),
    [question],
  );
  const chosen = question.options.find((o) => o.id === picked);
  const correct = question.options.find((o) => o.correct);
  const last = index + 1 >= spec.questions.length;

  const pick = (id: string) => {
    if (picked) return;
    const ok = Boolean(question.options.find((o) => o.id === id)?.correct);
    sfx(ok ? 'good' : 'bad');
    if (ok) setGood((g) => g + 1);
    setPicked(id);
  };

  const next = () => {
    if (last) {
      onDone(ratio(good, spec.questions.length));
      return;
    }
    setIndex(index + 1);
    setPicked(null);
  };

  return (
    <div className="mg-round">
      <RichText text={spec.instructions} className="mg-instructions" />
      <p className="mg-count">
        Question {index + 1} / {spec.questions.length}
      </p>
      {question.context ? <RichText text={question.context} className="mg-context" /> : null}
      <Code code={question.code} />
      <p className="mg-prompt">
        <T>{question.prompt}</T>
      </p>
      <div className="options-grid" role="group" aria-label="Réponses">
        {options.map((o) => {
          const state = !picked ? '' : o.correct ? 'opt--best' : o.id === picked ? 'opt--wrong' : 'opt--dim';
          return (
            <button key={o.id} type="button" className={`opt ${state}`} onClick={() => pick(o.id)} disabled={Boolean(picked)}>
              <T>{o.text}</T>
            </button>
          );
        })}
      </div>
      {chosen ? (
        <div className={`mg-feedback ${chosen.correct ? 'mg-feedback--good' : 'mg-feedback--bad'}`} role="status">
          <p>
            <b>{chosen.correct ? 'Exact.' : 'Raté.'}</b> <T>{chosen.feedback}</T>
          </p>
          {!chosen.correct && correct ? (
            <p>
              <b>Bonne réponse :</b> <T>{correct.text}</T> <T>{correct.feedback}</T>
            </p>
          ) : null}
          {question.explanation ? (
            <p className="mg-takeaway">
              <b>À retenir :</b> <T>{question.explanation}</T>
            </p>
          ) : null}
          <NextButton last={last} onClick={next} label={last ? 'Terminer la manche' : 'Question suivante'} />
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tri : ranger chaque élément dans la bonne case                       */
/* ------------------------------------------------------------------ */

export function SortRound({ spec, onDone }: RoundProps<SortRoundSpec>) {
  const { sfx } = useGame();
  const items = useMemo(() => seededShuffle(spec.items, `sort:${spec.title}`), [spec]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const complete = items.every((it) => answers[it.id]);
  const score = ratio(items.filter((it) => answers[it.id] === it.bin).length, items.length);

  return (
    <div className="mg-round">
      <RichText text={spec.instructions} className="mg-instructions" />
      <ul className="sort-list">
        {items.map((it) => {
          const a = answers[it.id];
          const ok = checked ? a === it.bin : null;
          return (
            <li key={it.id} className={`sort-item ${ok === true ? 'sort-item--good' : ok === false ? 'sort-item--bad' : ''}`}>
              <span className="sort-item__text">
                <T>{it.text}</T>
              </span>
              <span className="sort-item__choices" role="group" aria-label={`Classer : ${it.text}`}>
                {spec.bins.map((bin) => (
                  <button
                    key={bin.id}
                    type="button"
                    className={`seg ${a === bin.id ? 'seg--on' : ''}`}
                    aria-pressed={a === bin.id}
                    disabled={checked}
                    onClick={() => {
                      sfx('click');
                      setAnswers((s) => ({ ...s, [it.id]: bin.id }));
                    }}
                  >
                    {bin.label}
                  </button>
                ))}
              </span>
              {checked ? (
                <span className="sort-item__why">
                  <Icon name={ok ? 'check' : 'cross'} size={10} />
                  <span>
                    {ok ? null : <b>{spec.bins.find((b) => b.id === it.bin)?.label} : </b>}
                    <T>{it.why}</T>
                  </span>
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
      <div className="mg-actions">
        {!checked ? (
          <button
            type="button"
            className="btn"
            disabled={!complete}
            onClick={() => {
              sfx(score === 1 ? 'good' : 'bad');
              setChecked(true);
            }}
          >
            <Icon name="check" size={12} /> Valider
          </button>
        ) : (
          <>
            <span className={score === 1 ? 'good-text' : 'muted'}>
              {Math.round(score * items.length)} / {items.length} bien classés.
            </span>
            <NextButton last onClick={() => onDone(score)} label="Terminer la manche" />
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ordre : cliquer les étapes dans le bon ordre                        */
/* ------------------------------------------------------------------ */

export function OrderRound({ spec, onDone }: RoundProps<OrderRoundSpec>) {
  const { sfx } = useGame();
  const shuffled = useMemo(() => seededShuffle(spec.items, `order:${spec.title}`), [spec]);
  const [sequence, setSequence] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const expected = spec.items.map((i) => i.id);
  const label = (id: string) => spec.items.find((i) => i.id === id)?.text ?? id;

  return (
    <div className="mg-round mg-round--split">
      <div>
        <RichText text={spec.instructions} className="mg-instructions" />
        <div className="stage-cards stage-cards--single">
          {shuffled.map((it) => (
            <button
              key={it.id}
              type="button"
              className="stage-card"
              disabled={sequence.includes(it.id) || score !== null}
              onClick={() => {
                sfx('click');
                setSequence((s) => [...s, it.id]);
              }}
            >
              <span>
                <T>{it.text}</T>
              </span>
            </button>
          ))}
        </div>
        {score === null ? (
          <div className="mg-actions">
            <button
              type="button"
              className="btn"
              disabled={sequence.length < spec.items.length}
              onClick={() => {
                const s = pairwiseOrderScore(sequence, expected);
                sfx(s === 1 ? 'good' : 'bad');
                setScore(s);
              }}
            >
              <Icon name="check" size={12} /> Valider l’ordre
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setSequence([])} disabled={sequence.length === 0}>
              Effacer
            </button>
          </div>
        ) : (
          <div className={`mg-feedback ${score === 1 ? 'mg-feedback--good' : 'mg-feedback--bad'}`} role="status">
            <p>
              <b>{score === 1 ? 'Ordre parfait !' : `Ordre juste à ${Math.round(score * 100)} %.`}</b>
            </p>
            <RichText text={spec.explanation} />
            <NextButton last onClick={() => onDone(score)} label="Terminer la manche" />
          </div>
        )}
      </div>
      <ol className="sequence" aria-label="Ta séquence">
        {(score === null ? spec.items.map((_, i) => sequence[i] ?? null) : expected).map((id, i) => {
          const mine = sequence[i];
          const state = score === null ? '' : mine === id ? 'sequence__step--good' : 'sequence__step--fix';
          return (
            <li key={i} className={`sequence__step ${id ? '' : 'sequence__step--empty'} ${state}`}>
              <span className="sequence__num">{i + 1}</span>
              <span>{id ? <T>{label(id)}</T> : <span className="muted">…</span>}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sélection : cocher tout ce qui convient                             */
/* ------------------------------------------------------------------ */

export function PickRound({ spec, onDone }: RoundProps<PickRoundSpec>) {
  const { sfx } = useGame();
  const items = useMemo(() => seededShuffle(spec.items, `pick:${spec.title}`), [spec]);
  const [selected, setSelected] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const expected = spec.items.filter((i) => i.correct).map((i) => i.id);

  return (
    <div className="mg-round">
      <RichText text={spec.instructions} className="mg-instructions" />
      {spec.context ? <RichText text={spec.context} className="mg-context" /> : null}
      <Code code={spec.code} />
      <p className="mg-prompt">
        <T>{spec.prompt}</T> <span className="muted">(plusieurs réponses possibles)</span>
      </p>
      <ul className="pick-list">
        {items.map((it) => {
          const on = selected.includes(it.id);
          const state = score === null ? '' : it.correct ? 'pick--good' : on ? 'pick--bad' : 'pick--neutral';
          return (
            <li key={it.id} className={`pick ${on ? 'pick--on' : ''} ${state}`}>
              <button
                type="button"
                className="pick__btn"
                aria-pressed={on}
                disabled={score !== null}
                onClick={() => {
                  sfx('click');
                  setSelected((s) => (s.includes(it.id) ? s.filter((x) => x !== it.id) : [...s, it.id]));
                }}
              >
                <span className="pick__box" aria-hidden="true">
                  {on ? <Icon name="check" size={10} /> : null}
                </span>
                <span className="pick__text">
                  <T>{it.text}</T>
                  {it.meta ? <small className="pick__meta">{it.meta}</small> : null}
                </span>
              </button>
              {score !== null ? (
                <p className="pick__why">
                  <Icon name={it.correct ? 'check' : 'cross'} size={10} /> <T>{it.why}</T>
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
      <div className="mg-actions">
        {score === null ? (
          <button
            type="button"
            className="btn"
            disabled={selected.length === 0}
            onClick={() => {
              const s = jaccard(selected, expected);
              sfx(s === 1 ? 'good' : 'bad');
              setScore(s);
            }}
          >
            <Icon name="check" size={12} /> Valider
          </button>
        ) : (
          <>
            <span className={score === 1 ? 'good-text' : 'muted'}>Sélection juste à {Math.round(score * 100)} %.</span>
            <NextButton last onClick={() => onDone(score)} label="Terminer la manche" />
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Budget : choisir sous une contrainte (tokens, coût, temps…)         */
/* ------------------------------------------------------------------ */

export function BudgetRound({ spec, onDone }: RoundProps<BudgetRoundSpec>) {
  const { sfx } = useGame();
  const [selected, setSelected] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const used = spec.items.filter((i) => selected.includes(i.id)).reduce((s, i) => s + i.cost, 0);
  const best = useMemo(() => bestBudgetSelection(spec.items, spec.budget), [spec]);
  const pct = Math.min(100, Math.round((used / spec.budget) * 100));

  return (
    <div className="mg-round">
      <RichText text={spec.instructions} className="mg-instructions" />
      <RichText text={spec.task} className="mg-context" />
      <div className="budget">
        <p className="budget__label">
          Budget : <b>{used.toLocaleString('fr-FR')}</b> / {spec.budget.toLocaleString('fr-FR')} {spec.unit}
        </p>
        <div className="budget__bar" role="progressbar" aria-valuemin={0} aria-valuemax={spec.budget} aria-valuenow={used} aria-label="Budget utilisé">
          <span style={{ width: `${pct}%` }} className={pct > 85 ? 'budget__fill--high' : ''} />
        </div>
      </div>
      <ul className="pick-list">
        {spec.items.map((it) => {
          const on = selected.includes(it.id);
          const tooBig = !on && used + it.cost > spec.budget;
          const inBest = best.ids.includes(it.id);
          const state = score === null ? '' : inBest ? 'pick--good' : on ? 'pick--bad' : 'pick--neutral';
          return (
            <li key={it.id} className={`pick ${on ? 'pick--on' : ''} ${state}`}>
              <button
                type="button"
                className="pick__btn"
                aria-pressed={on}
                disabled={score !== null || tooBig}
                title={tooBig ? 'Dépasserait le budget' : undefined}
                onClick={() => {
                  sfx('click');
                  setSelected((s) => (s.includes(it.id) ? s.filter((x) => x !== it.id) : [...s, it.id]));
                }}
              >
                <span className="pick__box" aria-hidden="true">
                  {on ? <Icon name="check" size={10} /> : null}
                </span>
                <span className="pick__text">
                  <T>{it.text}</T>
                  <small className="pick__meta">
                    {it.cost.toLocaleString('fr-FR')} {spec.unit}
                    {score !== null ? ` · pertinence ${it.value}` : ''}
                  </small>
                </span>
              </button>
              {score !== null ? (
                <p className="pick__why">
                  <Icon name={inBest ? 'check' : 'cross'} size={10} /> <T>{it.why}</T>
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
      <div className="mg-actions">
        {score === null ? (
          <button
            type="button"
            className="btn"
            disabled={selected.length === 0}
            onClick={() => {
              const s = budgetScore(spec.items, spec.budget, selected);
              sfx(s >= 0.95 ? 'good' : 'bad');
              setScore(s);
            }}
          >
            <Icon name="check" size={12} /> Valider
          </button>
        ) : (
          <>
            <span className={score >= 0.95 ? 'good-text' : 'muted'}>
              Ta sélection atteint {Math.round(score * 100)} % de la meilleure pertinence possible (cases vertes).
            </span>
            <NextButton last onClick={() => onDone(score)} label="Terminer la manche" />
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Séquence de manches                                                 */
/* ------------------------------------------------------------------ */

function Round({ spec, onDone }: { spec: RoundSpec; onDone: (score: number) => void }) {
  switch (spec.kind) {
    case 'choice':
      return <ChoiceRound spec={spec} onDone={onDone} />;
    case 'sort':
      return <SortRound spec={spec} onDone={onDone} />;
    case 'order':
      return <OrderRound spec={spec} onDone={onDone} />;
    case 'pick':
      return <PickRound spec={spec} onDone={onDone} />;
    case 'budget':
      return <BudgetRound spec={spec} onDone={onDone} />;
    case 'custom': {
      const Custom = spec.component;
      return <Custom onDone={onDone} />;
    }
    default:
      return null;
  }
}

export function MiniGameSequence({ config, onFinish }: { config: MiniGameConfig } & MiniGameProps) {
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const spec = config.rounds[round]!;

  const done = (score: number) => {
    const all = [...scores, score];
    if (round + 1 >= config.rounds.length) {
      onFinish(all.reduce((a, b) => a + b, 0) / all.length);
      return;
    }
    setScores(all);
    setRound(round + 1);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="mg">
      <RoundHeader title={config.title} rounds={config.rounds.map((r) => r.title)} current={round} scores={scores} />
      <Round key={round} spec={spec} onDone={done} />
    </div>
  );
}

/** Fabrique un mini-jeu à partir d'une configuration (pour le registre). */
export function configuredMiniGame(config: MiniGameConfig): ComponentType<MiniGameProps> {
  function ConfiguredMiniGame({ onFinish }: MiniGameProps) {
    return <MiniGameSequence config={config} onFinish={onFinish} />;
  }
  return ConfiguredMiniGame;
}
