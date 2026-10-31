import { useMemo, useState } from 'react';
import { useGame } from '../../game/GameContext';
import { seededShuffle } from '../../game/random';
import { Icon } from '../../ui/Icon';
import { T } from '../../ui/typography';
import { RoundHeader, type MiniGameProps } from '../shared';
import { LOOP_ORDER, LOOP_TURNS, SORT_ITEMS, STAGE_INFO, orderScore, type LoopStage } from './data';

const ROUNDS = ['Assemble la boucle', 'Qui fait quoi ?', 'Fais tourner la boucle'];

/** Petit schéma de la boucle, réutilisé par les manches. */
export function LoopDiagram({ active, slots }: { active?: LoopStage; slots?: (LoopStage | null)[] }) {
  const order: (LoopStage | null)[] = slots ?? LOOP_ORDER;
  return (
    <div className="loop-diagram" aria-label="Boucle agentique">
      {order.map((stage, i) => (
        <div key={i} className={`loop-diagram__node loop-diagram__node--${i} ${stage && stage === active ? 'loop-diagram__node--on' : ''} ${stage ? '' : 'loop-diagram__node--empty'}`}>
          <span className="loop-diagram__num">{i + 1}</span>
          {stage ? (
            <>
              <b>{STAGE_INFO[stage].label}</b>
              <small>{STAGE_INFO[stage].who}</small>
            </>
          ) : (
            <small>{i === 0 ? 'Départ' : 'vide'}</small>
          )}
        </div>
      ))}
      <span className="loop-diagram__center" aria-hidden="true">
        <Icon name="review" size={36} />
      </span>
    </div>
  );
}

/* Manche 1 */
function AssembleRound({ onDone }: { onDone: (score: number) => void }) {
  const { sfx } = useGame();
  const cards = useMemo(() => seededShuffle(LOOP_ORDER, 'loop-cards-v1'), []);
  const [placed, setPlaced] = useState<LoopStage[]>([]);
  const [checked, setChecked] = useState<number | null>(null);
  const slots: (LoopStage | null)[] = LOOP_ORDER.map((_, i) => placed[i] ?? null);

  const place = (stage: LoopStage) => {
    if (checked !== null || placed.includes(stage)) return;
    sfx('click');
    setPlaced((p) => [...p, stage]);
  };

  return (
    <div className="mg-round mg-round--split">
      <div>
        <p className="mg-instructions">
          L’objectif d’Inès arrive en case 1. Clique sur les étapes <b>dans l’ordre</b> où un agent les enchaîne à chaque tour.
        </p>
        <div className="stage-cards">
          {cards.map((stage) => (
            <button key={stage} type="button" className="stage-card" onClick={() => place(stage)} disabled={placed.includes(stage) || checked !== null}>
              <b>{STAGE_INFO[stage].label}</b>
              <small>
                <T>{STAGE_INFO[stage].hint}</T>
              </small>
            </button>
          ))}
        </div>
        {checked === null ? (
          <div className="mg-actions">
            <button type="button" className="btn" onClick={() => { const s = orderScore(placed); sfx(s === 1 ? 'good' : 'bad'); setChecked(s); }} disabled={placed.length < 4}>
              <Icon name="check" size={12} /> Valider
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setPlaced([])} disabled={placed.length === 0}>
              Effacer
            </button>
          </div>
        ) : (
          <div className={`mg-feedback ${checked === 1 ? 'mg-feedback--good' : 'mg-feedback--bad'}`} role="status">
            <p>
              {checked === 1 ? 'Parfait !' : `${Math.round(checked * 4)} étape(s) sur 4 bien placée(s).`} L’ordre est : percevoir → raisonner → agir →
              observer, puis on recommence. Note qui fait quoi : le modèle ne fait que <b>raisonner</b> ; tout le reste, c’est le harnais.
            </p>
            <button type="button" className="btn" onClick={() => onDone(checked)} autoFocus>
              Manche suivante <Icon name="arrow-right" size={12} />
            </button>
          </div>
        )}
      </div>
      <LoopDiagram slots={checked === null ? slots : LOOP_ORDER} />
    </div>
  );
}

/* Manche 2 */
function SortRound({ onDone }: { onDone: (score: number) => void }) {
  const { sfx } = useGame();
  const items = useMemo(() => seededShuffle(SORT_ITEMS, 'sort-items-v1'), []);
  const [answers, setAnswers] = useState<Record<string, 'modele' | 'harnais'>>({});
  const [checked, setChecked] = useState(false);
  const complete = items.every((it) => answers[it.id]);
  const score = items.filter((it) => answers[it.id] === it.owner).length / items.length;

  return (
    <div className="mg-round">
      <p className="mg-instructions">
        Pour chaque tâche, qui s’en charge : le <b>modèle</b> (le cerveau, qui écrit) ou le <b>harnais</b> (le code autour, qui exécute) ?
      </p>
      <ul className="sort-list">
        {items.map((it) => {
          const a = answers[it.id];
          const ok = checked ? a === it.owner : null;
          return (
            <li key={it.id} className={`sort-item ${ok === true ? 'sort-item--good' : ok === false ? 'sort-item--bad' : ''}`}>
              <span className="sort-item__text">
                <T>{it.text}</T>
              </span>
              <span className="sort-item__choices" role="group" aria-label={`Qui s’en charge : ${it.text}`}>
                {(['modele', 'harnais'] as const).map((owner) => (
                  <button
                    key={owner}
                    type="button"
                    className={`seg ${a === owner ? 'seg--on' : ''}`}
                    aria-pressed={a === owner}
                    disabled={checked}
                    onClick={() => {
                      sfx('click');
                      setAnswers((s) => ({ ...s, [it.id]: owner }));
                    }}
                  >
                    {owner === 'modele' ? 'Modèle' : 'Harnais'}
                  </button>
                ))}
              </span>
              {checked ? (
                <span className="sort-item__why">
                  <Icon name={ok ? 'check' : 'cross'} size={10} /> <T>{it.why}</T>
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
      {!checked ? (
        <div className="mg-actions">
          <button type="button" className="btn" disabled={!complete} onClick={() => { sfx(score === 1 ? 'good' : 'bad'); setChecked(true); }}>
            <Icon name="check" size={12} /> Valider
          </button>
        </div>
      ) : (
        <div className="mg-actions">
          <span className={score === 1 ? 'good-text' : 'muted'}>
            {Math.round(score * items.length)} / {items.length} bien classées.
          </span>
          <button type="button" className="btn" onClick={() => onDone(score)} autoFocus>
            Manche suivante <Icon name="arrow-right" size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

/* Manche 3 */
function RunRound({ onDone }: { onDone: (score: number) => void }) {
  const { sfx } = useGame();
  const [turn, setTurn] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [firstTry, setFirstTry] = useState<boolean[]>([]);
  const [context, setContext] = useState<string[]>([]);
  const current = LOOP_TURNS[turn]!;
  const choice = current.options.find((o) => o.id === picked);
  const solved = Boolean(choice?.correct);

  const pick = (id: string) => {
    if (solved) return;
    const option = current.options.find((o) => o.id === id)!;
    sfx(option.correct ? 'good' : 'bad');
    if (firstTry.length === turn) setFirstTry((f) => [...f, Boolean(option.correct)]);
    setPicked(id);
  };

  const proceed = () => {
    if (current.observation) setContext((c) => [...c, current.observation as string]);
    if (turn + 1 >= LOOP_TURNS.length) {
      const results = firstTry;
      onDone(results.filter(Boolean).length / LOOP_TURNS.length);
      return;
    }
    setTurn(turn + 1);
    setPicked(null);
  };

  const stage: LoopStage = picked && solved ? 'observer' : current.stage;

  return (
    <div className="mg-round">
      <p className="mg-instructions">
        Tu es le <b>harnais</b> de Bob. À chaque tour, Bob (le modèle) écrit une pensée et une action. À toi de décider quoi en faire. (Tour {turn + 1} /{' '}
        {LOOP_TURNS.length})
      </p>
      <div className="run">
        <section className="run__context" aria-labelledby="run-context">
          <h3 id="run-context">Contexte envoyé à Bob</h3>
          <ul>
            <li className="run__ctx run__ctx--goal">Objectif : réserver une salle libre jeudi à 14 h.</li>
            <li className="run__ctx">Outils : consulter_planning(jour, heure), reserver_salle(salle, jour, heure)</li>
            {context.map((c, i) => (
              <li key={i} className="run__ctx run__ctx--obs">
                Résultat : <T>{c}</T>
              </li>
            ))}
          </ul>
        </section>

        <section className="run__model" aria-labelledby="run-model">
          <h3 id="run-model">Ce qu’écrit le modèle</h3>
          <p className="run__thought">
            <span className="run__tag">PENSÉE</span> <T>{current.thought}</T>
          </p>
          <p className="run__action data">
            <span className="run__tag">{current.action.startsWith('RÉPONSE') ? 'FIN' : 'ACTION'}</span> {current.action}
          </p>
          <div className="run__options" role="group" aria-label="Décision du harnais">
            {current.options.map((o) => {
              const state = picked === o.id ? (o.correct ? 'opt--best' : 'opt--wrong') : solved && o.correct ? 'opt--best' : '';
              return (
                <button key={o.id} type="button" className={`opt ${state}`} onClick={() => pick(o.id)} disabled={solved}>
                  <T>{o.text}</T>
                </button>
              );
            })}
          </div>
          {choice ? (
            <div className={`mg-feedback ${choice.correct ? 'mg-feedback--good' : 'mg-feedback--bad'}`} role="status">
              <p>
                <T>{choice.feedback}</T>
              </p>
              {choice.correct ? (
                <>
                  {current.observation ? (
                    <p className="run__obs data">
                      <span className="run__tag">RÉSULTAT</span> {current.observation}
                    </p>
                  ) : null}
                  <button type="button" className="btn" onClick={proceed} autoFocus>
                    {turn + 1 < LOOP_TURNS.length ? 'Tour suivant' : 'Terminer'} <Icon name="arrow-right" size={12} />
                  </button>
                </>
              ) : (
                <p className="muted">Essaie une autre décision (seul le premier choix compte pour le score).</p>
              )}
            </div>
          ) : null}
        </section>

        <LoopDiagram active={stage} />
      </div>
    </div>
  );
}

export function LoopRunner({ onFinish }: MiniGameProps) {
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState<number[]>([]);

  const done = (score: number) => {
    const all = [...scores, score];
    if (round + 1 >= ROUNDS.length) {
      onFinish(all.reduce((a, b) => a + b, 0) / all.length);
      return;
    }
    setScores(all);
    setRound(round + 1);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="mg">
      <RoundHeader title="Tu es le harnais" rounds={ROUNDS} current={round} scores={scores} />
      {round === 0 ? <AssembleRound onDone={done} /> : null}
      {round === 1 ? <SortRound onDone={done} /> : null}
      {round === 2 ? <RunRound onDone={done} /> : null}
    </div>
  );
}
