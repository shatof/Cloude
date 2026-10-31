import { useEffect, useMemo, useState } from 'react';
import type { LevelDefinition, QuizChoice } from '../../content/types';
import { useGame } from '../../game/GameContext';
import { seededShuffle } from '../../game/random';
import { BOSS_SPRITES } from '../../sprites/bosses';
import { BobSprite } from '../../sprites/BobSprite';
import { PixelArt } from '../../sprites/PixelArt';
import { DialogueBox, Typewriter } from '../../ui/components';
import { Icon } from '../../ui/Icon';
import { T } from '../../ui/typography';
import { goToPhase, piecesBefore } from '../LevelPlayer';

type Stage = 'intro' | 'fight' | 'end';

interface Answer {
  questionId: string;
  choiceId: string;
  correct: boolean;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function BossPhase({ level }: { level: LevelDefinition }) {
  const { save, dispatch, sfx } = useGame();
  const boss = level.content!.boss;
  const attempts = save.levels[level.id]?.bossAttempts ?? 0;
  const [attempt, setAttempt] = useState(attempts);
  const [stage, setStage] = useState<Stage>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [hit, setHit] = useState<'boss' | 'bob' | null>(null);

  const total = boss.questions.length;
  const required = Math.ceil(boss.passRatio * total - 1e-9);
  const correctCount = answers.filter((a) => a.correct).length;
  const bossHp = Math.max(0, required - correctCount);
  const question = boss.questions[index]!;
  const current = answers.find((a) => a.questionId === question.id);
  const remaining = total - answers.length;
  const lost = bossHp > remaining;

  // Ordre des choix mélangé de façon déterministe, différent à chaque tentative.
  const choices: QuizChoice[] = useMemo(
    () => seededShuffle(question.choices, `${level.id}:${question.id}:${attempt}`),
    [question, level.id, attempt],
  );

  const pick = (choice: QuizChoice) => {
    if (current) return;
    const correct = Boolean(choice.correct);
    sfx(correct ? 'good' : 'bad');
    setHit(correct ? 'boss' : 'bob');
    window.setTimeout(() => setHit(null), 450);
    setAnswers((list) => [...list, { questionId: question.id, choiceId: choice.id, correct }]);
  };

  const next = () => {
    if (index + 1 < total) {
      setIndex(index + 1);
      return;
    }
    const won = correctCount >= required;
    dispatch({ type: 'boss/done', levelId: level.id, ratio: correctCount / total, won, xpMax: boss.xp });
    sfx(won ? 'victory' : 'defeat');
    setStage('end');
    window.scrollTo({ top: 0 });
  };

  const restart = () => {
    setAttempt((a) => a + 1);
    setAnswers([]);
    setIndex(0);
    setStage('fight');
  };

  useEffect(() => {
    if (stage !== 'fight') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const n = Number.parseInt(e.key, 10);
      if (!current && n >= 1 && n <= choices.length) pick(choices[n - 1]!);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const sprite = BOSS_SPRITES[boss.sprite];
  const bobPieces = piecesBefore(level, save.pieces);

  const arena = (
    <div className="arena frame">
      <div className={`arena__fighter ${hit === 'bob' ? 'is-hit' : ''}`}>
        <BobSprite pieces={bobPieces} mood={stage === 'end' ? (correctCount >= required ? 'proud' : 'sad') : current ? (current.correct ? 'happy' : 'surprised') : 'thinking'} scale={5} />
        <span className="arena__name">Bob Morris</span>
      </div>
      <span className="arena__vs" aria-hidden="true">
        VS
      </span>
      <div className={`arena__fighter arena__fighter--boss ${hit === 'boss' ? 'is-hit' : ''} ${stage === 'end' && bossHp === 0 ? 'is-ko' : ''}`}>
        {sprite ? <PixelArt layers={[sprite]} scale={6} title={boss.name} /> : null}
        <span className="arena__name">{boss.name}</span>
        <div className="hp" role="img" aria-label={`Points de vie du boss : ${bossHp} sur ${required}`}>
          <span className="hp__label">PV</span>
          {Array.from({ length: required }, (_, i) => (
            <span key={i} className={`hp__cell ${i < bossHp ? 'hp__cell--on' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );

  if (stage === 'intro') {
    return (
      <div className="boss">
        {arena}
        <DialogueBox speaker={boss.name} tone="boss">
          <Typewriter text={boss.intro} />
          <p className="muted">
            {total} questions. Chaque bonne réponse lui retire 1 PV : il en a {required}. Chaque réponse est expliquée, juste ou fausse.
          </p>
          <div className="dialogue__actions">
            <button type="button" className="btn btn--danger" onClick={() => setStage('fight')} autoFocus>
              <Icon name="sword" size={12} /> Combattre
            </button>
          </div>
        </DialogueBox>
      </div>
    );
  }

  if (stage === 'end') {
    const won = correctCount >= required;
    const ratio = correctCount / total;
    return (
      <div className="boss">
        {arena}
        <DialogueBox speaker={boss.name} tone="boss">
          <p>
            <T>{won ? boss.victory : boss.defeat}</T>
          </p>
          <p className={won ? 'good-text' : 'bad-text'}>
            {won ? 'Victoire' : 'Défaite'} : {correctCount} / {total} bonnes réponses
            {won ? ` · ${Math.round(boss.xp * ratio)} XP de combat (meilleur score retenu)` : ` · il en fallait ${required}`}.
          </p>
          <div className="dialogue__actions">
            {won ? (
              <button type="button" className="btn" onClick={() => goToPhase(level.id, 'reward')} autoFocus>
                <Icon name="chest" size={12} /> Récupérer la récompense
              </button>
            ) : (
              <button type="button" className="btn" onClick={restart} autoFocus>
                <Icon name="sword" size={12} /> Réessayer
              </button>
            )}
            <button type="button" className="btn btn--secondary" onClick={() => goToPhase(level.id, 'concept')}>
              <Icon name="book" size={12} /> Revoir le concept
            </button>
            {won && ratio < 1 ? (
              <button type="button" className="btn btn--ghost" onClick={restart}>
                Viser le sans-faute
              </button>
            ) : null}
          </div>
        </DialogueBox>
      </div>
    );
  }

  const correctChoice = question.choices.find((c) => c.correct)!;
  const chosen = current ? question.choices.find((c) => c.id === current.choiceId) : undefined;

  return (
    <div className="boss">
      {arena}
      <section className="battle frame" aria-labelledby="battle-q">
        <p className="battle__meta">
          Question {index + 1} / {total} · {correctCount} bonne{correctCount > 1 ? 's' : ''} réponse{correctCount > 1 ? 's' : ''} · objectif : {required}
        </p>
        <h2 id="battle-q" className="battle__prompt">
          <T>{question.prompt}</T>
        </h2>
        <div className="battle__choices" role="group" aria-label="Réponses">
          {choices.map((choice, i) => {
            let state = '';
            if (current) {
              if (choice.correct) state = 'battle__choice--good';
              else if (choice.id === current.choiceId) state = 'battle__choice--bad';
              else state = 'battle__choice--dim';
            }
            return (
              <button key={choice.id} type="button" className={`battle__choice ${state}`} onClick={() => pick(choice)} disabled={Boolean(current)}>
                <span className="battle__letter">{LETTERS[i]}</span>
                <span>
                  <T>{choice.text}</T>
                </span>
              </button>
            );
          })}
        </div>

        {current && chosen ? (
          <div className={`feedback ${current.correct ? 'feedback--good' : 'feedback--bad'}`} role="status">
            <p className="feedback__verdict">
              <Icon name={current.correct ? 'check' : 'cross'} size={14} />
              {current.correct ? 'Coup critique !' : 'Aïe, le boss contre-attaque.'}
            </p>
            <p>
              <b>Ta réponse :</b> <T>{chosen.feedback}</T>
            </p>
            {!current.correct ? (
              <p>
                <b>Bonne réponse :</b> <T>{correctChoice.text}</T> <T>{correctChoice.feedback}</T>
              </p>
            ) : null}
            <p className="feedback__takeaway">
              <b>À retenir :</b> <T>{question.explanation}</T>
            </p>
            {lost ? <p className="muted">Le boss ne peut plus tomber cette fois-ci, mais termine pour lire toutes les explications.</p> : null}
            <button type="button" className="btn" onClick={next} autoFocus>
              {index + 1 < total ? (
                <>
                  Question suivante <Icon name="arrow-right" size={12} />
                </>
              ) : (
                'Voir le résultat'
              )}
            </button>
          </div>
        ) : (
          <p className="muted battle__hint">Clique sur une réponse ou tape 1 à {choices.length}.</p>
        )}
      </section>
    </div>
  );
}
