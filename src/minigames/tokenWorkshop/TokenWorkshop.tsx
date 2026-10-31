import { useMemo, useState } from 'react';
import { useGame } from '../../game/GameContext';
import { createRng } from '../../game/random';
import { Icon } from '../../ui/Icon';
import { T } from '../../ui/typography';
import { RoundHeader, type MiniGameProps } from '../shared';
import {
  CUT_WORDS,
  NEXT_TOKEN_ROUNDS,
  TOY_VOCAB,
  WINDOW_MESSAGES,
  WINDOW_SIZE,
  applyTemperature,
  cutScore,
  cutsOf,
  pickScore,
  sampleIndex,
  toyTokenize,
  tokenId,
  visibleWindow,
} from './logic';

const ROUNDS = ['Découpe', 'Prédiction', 'Fenêtre'];
const CHIP_COLORS = ['tok-a', 'tok-b', 'tok-c', 'tok-d', 'tok-e'];

/* ------------------------------------------------------------------ */
/* Manche 1 : découper en tokens                                       */
/* ------------------------------------------------------------------ */

function CutRound({ onDone }: { onDone: (score: number) => void }) {
  const { sfx } = useGame();
  const [wordIndex, setWordIndex] = useState(0);
  const [cuts, setCuts] = useState<number[]>([]);
  const [checked, setChecked] = useState<number | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const word = CUT_WORDS[wordIndex] as string;
  const tokens = toyTokenize(word);
  const expected = cutsOf(tokens);
  const chars = [...word];

  const toggle = (pos: number) => {
    if (checked !== null) return;
    sfx('click');
    setCuts((c) => (c.includes(pos) ? c.filter((x) => x !== pos) : [...c, pos].sort((a, b) => a - b)));
  };

  const validate = () => {
    const s = cutScore(expected, cuts);
    sfx(s === 1 ? 'good' : 'bad');
    setChecked(s);
  };

  const next = () => {
    const all = [...scores, checked ?? 0];
    if (wordIndex + 1 >= CUT_WORDS.length) {
      onDone(all.reduce((a, b) => a + b, 0) / all.length);
      return;
    }
    setScores(all);
    setWordIndex(wordIndex + 1);
    setCuts([]);
    setChecked(null);
  };

  return (
    <div className="mg-round">
      <p className="mg-instructions">
        Voici un extrait du vocabulaire de Bob. Règle du tokeniseur : <b>de gauche à droite, on prend toujours le plus long morceau connu</b>.
        Clique entre les lettres pour placer les coupures. (Mot {wordIndex + 1} / {CUT_WORDS.length})
      </p>
      <div className="vocab" aria-label="Vocabulaire de Bob">
        {TOY_VOCAB.map((v) => (
          <span key={v} className="vocab__chip data">
            {v}
          </span>
        ))}
        <span className="vocab__more">+ toutes les lettres seules</span>
      </div>

      <div className="cutter" role="group" aria-label={`Mot à découper : ${word}`}>
        {chars.map((ch, i) => (
          <span key={i} className="cutter__unit">
            <span className={`cutter__letter ${checked !== null ? `cutter__letter--${CHIP_COLORS[tokenIndexAt(tokens, i) % CHIP_COLORS.length]}` : ''}`}>
              {ch}
            </span>
            {i < chars.length - 1 ? (
              <button
                type="button"
                className={`cutter__gap ${cuts.includes(i + 1) ? 'cutter__gap--on' : ''} ${checked !== null && expected.includes(i + 1) ? 'cutter__gap--expected' : ''}`}
                onClick={() => toggle(i + 1)}
                aria-pressed={cuts.includes(i + 1)}
                aria-label={`Couper entre « ${ch} » et « ${chars[i + 1]} »`}
                disabled={checked !== null}
              />
            ) : null}
          </span>
        ))}
      </div>

      {checked === null ? (
        <div className="mg-actions">
          <button type="button" className="btn" onClick={validate}>
            <Icon name="check" size={12} /> Valider la découpe
          </button>
          <span className="muted">
            {cuts.length} coupure{cuts.length > 1 ? 's' : ''} : {cuts.length + 1} token{cuts.length ? 's' : ''}. Aucune coupure, c’est permis.
          </span>
        </div>
      ) : (
        <div className={`mg-feedback ${checked === 1 ? 'mg-feedback--good' : 'mg-feedback--bad'}`} role="status">
          <p>
            {checked === 1 ? 'Découpe parfaite !' : `Pas tout à fait (${Math.round(checked * 100)} %).`} Bob voit{' '}
            <b>
              {tokens.length} token{tokens.length > 1 ? 's' : ''}
            </b>{' '}
            pour {chars.length} caractères :
          </p>
          <div className="token-row">
            {tokens.map((t, i) => (
              <span key={i} className={`token-chip ${CHIP_COLORS[i % CHIP_COLORS.length]}`}>
                <span>{t}</span>
                <small className="data">#{tokenId(t)}</small>
              </span>
            ))}
          </div>
          <p className="muted">
            {word === 'bonjour'
              ? 'Un mot très fréquent tient souvent en un seul token.'
              : word.startsWith('arri')
                ? 'Pour compter les « r », Bob devrait savoir ce que contient chaque numéro : #… ne dit rien des lettres !'
                : 'Un mot rare est découpé en morceaux plus courants.'}
          </p>
          <button type="button" className="btn" onClick={next} autoFocus>
            {wordIndex + 1 < CUT_WORDS.length ? 'Mot suivant' : 'Manche suivante'} <Icon name="arrow-right" size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

function tokenIndexAt(tokens: string[], charIndex: number): number {
  let pos = 0;
  for (let i = 0; i < tokens.length; i += 1) {
    pos += (tokens[i] as string).length;
    if (charIndex < pos) return i;
  }
  return tokens.length - 1;
}

/* ------------------------------------------------------------------ */
/* Manche 2 : être le modèle                                           */
/* ------------------------------------------------------------------ */

function PredictRound({ onDone }: { onDone: (score: number) => void }) {
  const { sfx } = useGame();
  const [roundIndex, setRoundIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [showTemp, setShowTemp] = useState(false);
  const round = NEXT_TOKEN_ROUNDS[roundIndex]!;
  const best = Math.max(...round.options.map((o) => o.p));

  const pick = (token: string) => {
    if (picked) return;
    const s = pickScore(round, token);
    sfx(s === 1 ? 'good' : s >= 0.5 ? 'click' : 'bad');
    setPicked(token);
    setScores((list) => [...list, s]);
  };

  const next = () => {
    if (roundIndex + 1 >= NEXT_TOKEN_ROUNDS.length) {
      setShowTemp(true);
      return;
    }
    setRoundIndex(roundIndex + 1);
    setPicked(null);
  };

  if (showTemp) {
    return <TemperatureLab onDone={() => onDone(scores.reduce((a, b) => a + b, 0) / scores.length)} />;
  }

  return (
    <div className="mg-round">
      <p className="mg-instructions">
        À toi d’être le LLM : choisis le token suivant <b>le plus probable</b>. Tu marques des points selon sa probabilité. (Phrase {roundIndex + 1} /{' '}
        {NEXT_TOKEN_ROUNDS.length})
      </p>
      <p className="sentence">
        <T>{round.context}</T> <span className="sentence__blank">{picked ?? ''}</span>
      </p>
      <div className="options-grid">
        {round.options.map((o) => {
          const state = picked ? (o.p === best ? 'opt--best' : o.token === picked ? 'opt--picked' : '') : '';
          return (
            <button key={o.token} type="button" className={`opt ${state}`} onClick={() => pick(o.token)} disabled={Boolean(picked)}>
              <span>{o.token}</span>
              {picked ? (
                <span className="opt__bar" aria-label={`probabilité ${Math.round(o.p * 100)} %`}>
                  <span style={{ width: `${Math.round((o.p / best) * 100)}%` }} />
                  <b>{Math.round(o.p * 100)} %</b>
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {picked ? (
        <div className="mg-feedback" role="status">
          <p>
            <T>{round.note}</T>
          </p>
          <p className="muted">Points : {Math.round(pickScore(round, picked) * 100)} / 100.</p>
          <button type="button" className="btn" onClick={next} autoFocus>
            {roundIndex + 1 < NEXT_TOKEN_ROUNDS.length ? 'Phrase suivante' : 'Jouer avec la température'} <Icon name="arrow-right" size={12} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function TemperatureLab({ onDone }: { onDone: () => void }) {
  const { sfx } = useGame();
  const round = NEXT_TOKEN_ROUNDS[1]!;
  const [temperature, setTemperature] = useState(1);
  const [draws, setDraws] = useState(0);
  const dist = useMemo(() => applyTemperature(round.options.map((o) => o.p), temperature), [round, temperature]);
  const sample = useMemo(() => {
    if (draws === 0) return null;
    const rng = createRng(`temperature:${temperature.toFixed(1)}:${draws}`);
    const counts = round.options.map(() => 0);
    for (let i = 0; i < 10; i += 1) counts[sampleIndex(dist, rng())]! += 1;
    return counts;
  }, [draws, temperature, dist, round]);

  return (
    <div className="mg-round">
      <p className="mg-instructions">
        Bonus sans points : la <b>température</b> règle le hasard du tirage. Bouge le curseur, puis fais tirer Bob 10 fois la suite de « <T>{round.context}</T> ».
      </p>
      <div className="temp">
        <label htmlFor="temp-slider" className="temp__label">
          Température : <b>{temperature <= 0.05 ? '0 (toujours le plus probable)' : temperature.toFixed(1)}</b>
        </label>
        <input
          id="temp-slider"
          type="range"
          min={0}
          max={2}
          step={0.1}
          value={temperature}
          onChange={(e) => {
            setTemperature(Number(e.target.value));
            setDraws(0);
          }}
        />
        <div className="temp__bars">
          {round.options.map((o, i) => (
            <div key={o.token} className="temp__row">
              <span className="temp__token">{o.token}</span>
              <span className="temp__bar">
                <span style={{ width: `${Math.round((dist[i] ?? 0) * 100)}%` }} />
              </span>
              <span className="temp__pct">{Math.round((dist[i] ?? 0) * 100)} %</span>
              <span className="temp__count">{sample ? `${sample[i]} tirage${(sample[i] ?? 0) > 1 ? 's' : ''}` : ''}</span>
            </div>
          ))}
        </div>
        <div className="mg-actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => {
              sfx('click');
              setDraws((d) => d + 1);
            }}
          >
            Tirer 10 fois
          </button>
          <button type="button" className="btn" onClick={onDone}>
            Manche suivante <Icon name="arrow-right" size={12} />
          </button>
        </div>
        <p className="muted">
          Basse température : réponses stables mais répétitives. Haute : plus de variété… et plus d’erreurs comme « Sydney ». Certaines API récentes ne laissent
          plus régler ce paramètre, mais le principe du tirage reste le même.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Manche 3 : la fenêtre qui glisse                                    */
/* ------------------------------------------------------------------ */

const WINDOW_QUESTIONS = [
  {
    prompt: 'Inès demande son prénom. Bob peut-il répondre « Inès » ?',
    options: ['Oui, c’est écrit dans la conversation', 'Non : le message 1 est sorti de sa fenêtre', 'Oui : il l’a mémorisé dans ses poids'],
    answer: 1,
    why: 'Le premier message ne tient plus dans les 40 tokens : pour Bob, il n’existe plus. Et le modèle n’apprend rien pendant une conversation.',
  },
  {
    prompt: 'Quel est le plus ancien message que Bob voit encore ?',
    options: ['« Bonjour Inès ! »', '« Je révise mon partiel de réseaux. »', '« Bon courage ! Que veux-tu revoir ? »'],
    answer: 2,
    why: 'En partant de la fin : 9 + 11 + 10 + 9 = 39 tokens. Le message suivant (9 tokens) ne rentre plus.',
  },
];

function WindowRound({ onDone }: { onDone: (score: number) => void }) {
  const { sfx } = useGame();
  const [sent, setSent] = useState(1);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const messages = WINDOW_MESSAGES.slice(0, sent);
  const { visible, used } = visibleWindow(messages, WINDOW_SIZE);
  const allSent = sent >= WINDOW_MESSAGES.length;
  const question = WINDOW_QUESTIONS[qIndex]!;

  const cells: { msg: number }[] = [];
  visible.forEach((m) => {
    for (let i = 0; i < (WINDOW_MESSAGES[m] as { tokens: number }).tokens; i += 1) cells.push({ msg: m });
  });

  const answer = (i: number) => {
    if (picked !== null) return;
    const ok = i === question.answer;
    sfx(ok ? 'good' : 'bad');
    setPicked(i);
    if (ok) setCorrect((c) => c + 1);
  };

  return (
    <div className="mg-round">
      <p className="mg-instructions">
        La fenêtre de Bob fait ici <b>{WINDOW_SIZE} tokens</b> (une vraie fenêtre en contient des centaines de milliers). Envoie les messages un par un et regarde
        ce qui reste visible.
      </p>
      <div className="window-game">
        <ol className="window-game__chat">
          {messages.map((m, i) => {
            const inside = visible.includes(i);
            return (
              <li key={i} className={`wmsg ${inside ? `wmsg--in ${CHIP_COLORS[i % CHIP_COLORS.length]}` : 'wmsg--out'}`}>
                <span className="wmsg__who">
                  {i + 1}. {m.who}
                </span>
                <span>
                  <T>{m.text}</T>
                </span>
                <span className="wmsg__tokens data">{m.tokens} tok.</span>
                {!inside ? <span className="wmsg__out">hors fenêtre</span> : null}
              </li>
            );
          })}
        </ol>
        <div className="window-game__window">
          <p className="window-game__label">
            Fenêtre de contexte : <b>{used}</b> / {WINDOW_SIZE} tokens
          </p>
          <div className="token-cells" role="img" aria-label={`${used} tokens sur ${WINDOW_SIZE} utilisés`}>
            {Array.from({ length: WINDOW_SIZE }, (_, i) => {
              const cell = cells[i];
              return <span key={i} className={`token-cell ${cell ? CHIP_COLORS[cell.msg % CHIP_COLORS.length] : ''}`} />;
            })}
          </div>
          {!allSent ? (
            <button
              type="button"
              className="btn"
              onClick={() => {
                sfx('click');
                setSent((s) => s + 1);
              }}
            >
              Envoyer le message suivant
            </button>
          ) : null}
        </div>
      </div>

      {allSent ? (
        <div className="mg-quiz">
          <p className="mg-quiz__prompt">
            <T>{question.prompt}</T>
          </p>
          <div className="options-grid options-grid--stack">
            {question.options.map((o, i) => {
              const state = picked === null ? '' : i === question.answer ? 'opt--best' : i === picked ? 'opt--wrong' : '';
              return (
                <button key={o} type="button" className={`opt ${state}`} onClick={() => answer(i)} disabled={picked !== null}>
                  <T>{o}</T>
                </button>
              );
            })}
          </div>
          {picked !== null ? (
            <div className={`mg-feedback ${picked === question.answer ? 'mg-feedback--good' : 'mg-feedback--bad'}`} role="status">
              <p>
                <T>{question.why}</T>
              </p>
              <button
                type="button"
                className="btn"
                autoFocus
                onClick={() => {
                  if (qIndex + 1 < WINDOW_QUESTIONS.length) {
                    setQIndex(qIndex + 1);
                    setPicked(null);
                  } else {
                    onDone(correct / WINDOW_QUESTIONS.length);
                  }
                }}
              >
                {qIndex + 1 < WINDOW_QUESTIONS.length ? 'Question suivante' : 'Terminer'} <Icon name="arrow-right" size={12} />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function TokenWorkshop({ onFinish }: MiniGameProps) {
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
      <RoundHeader title="L’atelier des tokens" rounds={ROUNDS} current={round} scores={scores} />
      {round === 0 ? <CutRound onDone={done} /> : null}
      {round === 1 ? <PredictRound onDone={done} /> : null}
      {round === 2 ? <WindowRound onDone={done} /> : null}
    </div>
  );
}
