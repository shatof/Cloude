import { useEffect, useRef, useState } from 'react';
import type { BobMood, LevelDefinition, ProblemStep } from '../../content/types';
import { useGame } from '../../game/GameContext';
import { BobSprite } from '../../sprites/BobSprite';
import { Typewriter } from '../../ui/components';
import { Icon } from '../../ui/Icon';
import { RichText, T } from '../../ui/typography';
import { goToPhase, piecesBefore } from '../LevelPlayer';

function moodAt(steps: ProblemStep[], shown: number): BobMood {
  let mood: BobMood = 'neutral';
  for (const step of steps.slice(0, shown)) {
    if (step.kind === 'say' && step.speaker === 'bob') mood = step.mood ?? 'neutral';
    if (step.kind === 'fail') mood = 'surprised';
  }
  return mood;
}

function Step({ step, latest }: { step: ProblemStep; latest: boolean }) {
  if (step.kind === 'fail') {
    return (
      <li className="chat__fail" role="alert">
        <span className="chat__stamp">{step.label}</span>
        <span>
          <T>{step.detail}</T>
        </span>
      </li>
    );
  }
  if (step.kind === 'gap') {
    return (
      <li className="chat__gap">
        <T>{step.text}</T>
      </li>
    );
  }
  if (step.speaker === 'narrator') {
    return (
      <li className="chat__narrator">
        <T>{step.text}</T>
      </li>
    );
  }
  const name = step.speaker === 'bob' ? 'Bob' : step.who ?? 'Utilisatrice';
  return (
    <li className={`chat__bubble chat__bubble--${step.speaker}`}>
      <span className="chat__name">{name}</span>
      {latest ? <Typewriter text={step.text} /> : <p><T>{step.text}</T></p>}
    </li>
  );
}

export function ProblemPhase({ level }: { level: LevelDefinition }) {
  const { save, dispatch, sfx } = useGame();
  const problem = level.content!.problem;
  const alreadyDone = (save.levels[level.id]?.reached ?? 0) > 0;
  const [shown, setShown] = useState(alreadyDone ? problem.steps.length : 1);
  const done = shown >= problem.steps.length;
  const listRef = useRef<HTMLOListElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (done) dispatch({ type: 'problem/done', levelId: level.id });
  }, [done, dispatch, level.id]);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView?.({ block: "nearest" });
  }, [shown]);

  const advance = () => {
    if (done) return;
    const next = problem.steps[shown];
    sfx(next?.kind === 'fail' ? 'bad' : 'click');
    setShown((s) => s + 1);
    nextRef.current?.focus();
  };

  return (
    <div className="problem">
      <aside className="problem__mission frame frame--gold">
        <h2>
          Mission : <T>{problem.mission.title}</T>
        </h2>
        <p>
          <T>{problem.mission.brief}</T>
        </p>
        <div className="problem__bob">
          <BobSprite pieces={piecesBefore(level, save.pieces)} mood={done ? 'sad' : moodAt(problem.steps, shown)} scale={6} />
        </div>
      </aside>

      <section className="problem__scene frame" aria-label="Scène">
        <ol className="chat" ref={listRef} aria-live="polite">
          {problem.steps.slice(0, shown).map((step, i) => (
            <Step key={i} step={step} latest={!alreadyDone && i === shown - 1} />
          ))}
        </ol>

        {done ? (
          <div className="problem__summary">
            <RichText text={problem.summary} />
            <p className="problem__question">
              <T>{problem.question}</T>
            </p>
            <button type="button" className="btn" onClick={() => goToPhase(level.id, 'concept')} autoFocus={!alreadyDone}>
              <Icon name="book" size={12} /> Découvrir le concept
            </button>
          </div>
        ) : (
          <div className="problem__controls">
            <button ref={nextRef} type="button" className="btn btn--secondary" onClick={advance} autoFocus>
              Suite <Icon name="arrow-right" size={12} />
            </button>
            <button type="button" className="btn btn--ghost btn--small" onClick={() => setShown(problem.steps.length)}>
              Tout afficher
            </button>
            <span className="muted problem__count">
              {shown} / {problem.steps.length}
            </span>
          </div>
        )}
      </section>
    </div>
  );
}
