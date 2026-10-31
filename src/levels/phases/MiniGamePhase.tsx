import { useState } from 'react';
import type { LevelDefinition } from '../../content/types';
import { useGame } from '../../game/GameContext';
import { MINIGAMES } from '../../minigames/registry';
import { BobSprite } from '../../sprites/BobSprite';
import { DialogueBox } from '../../ui/components';
import { Icon } from '../../ui/Icon';
import { RichText, T } from '../../ui/typography';
import { goToPhase, piecesBefore } from '../LevelPlayer';

type Stage = { kind: 'intro' } | { kind: 'play'; run: number } | { kind: 'result'; score: number; run: number };

function verdict(score: number): string {
  if (score >= 0.95) return 'Sans-faute ! Tu penses déjà comme un harnais.';
  if (score >= 0.75) return 'Très bien joué : l’essentiel est acquis.';
  if (score >= 0.5) return 'Pas mal ! Relis les explications des erreurs avant le boss.';
  return 'Difficile, hein ? Les explications sont là pour ça : rejoue si tu veux.';
}

export function MiniGamePhase({ level }: { level: LevelDefinition }) {
  const { save, dispatch, sfx } = useGame();
  const spec = level.content!.minigame;
  const Game = MINIGAMES[spec.id];
  const best = save.levels[level.id]?.minigameBest ?? -1;
  const [stage, setStage] = useState<Stage>({ kind: 'intro' });

  const finish = (score: number, run: number) => {
    dispatch({ type: 'minigame/done', levelId: level.id, score, xpMax: spec.xp });
    sfx(score >= 0.5 ? 'victory' : 'defeat');
    setStage({ kind: 'result', score, run });
    window.scrollTo({ top: 0 });
  };

  if (!Game) {
    return <p className="notice">Mini-jeu introuvable : « {spec.id} ».</p>;
  }

  if (stage.kind === 'intro') {
    return (
      <div className="phase-intro">
        <BobSprite pieces={piecesBefore(level, save.pieces)} mood="happy" scale={6} />
        <div className="phase-intro__text">
          <h2>
            <Icon name="gamepad" size={16} /> <T>{spec.title}</T>
          </h2>
          <RichText text={spec.intro} />
          <p className="muted">
            Jusqu’à {spec.xp} XP selon ton score.{best >= 0 ? ` Meilleur score : ${Math.round(best * 100)} %.` : ''}
          </p>
          <div className="phase-intro__actions">
            <button type="button" className="btn" onClick={() => setStage({ kind: 'play', run: 1 })} autoFocus>
              <Icon name="play" size={12} /> Jouer
            </button>
            {best >= 0 ? (
              <button type="button" className="btn btn--secondary" onClick={() => goToPhase(level.id, 'boss')}>
                Passer au boss
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (stage.kind === 'play') {
    return (
      <div className="minigame">
        <Game key={stage.run} onFinish={(score) => finish(score, stage.run)} />
      </div>
    );
  }

  const pct = Math.round(stage.score * 100);
  return (
    <div className="phase-result">
      <BobSprite pieces={piecesBefore(level, save.pieces)} mood={stage.score >= 0.5 ? 'proud' : 'confused'} scale={6} />
      <div className="phase-result__text">
        <h2>Score : {pct} %</h2>
        <DialogueBox speaker="Bob Morris">
          <p>{verdict(stage.score)}</p>
        </DialogueBox>
        <p className="muted">
          XP du mini-jeu : {Math.round(spec.xp * Math.max(stage.score, best))} / {spec.xp} (seule l’amélioration de ton meilleur score rapporte de l’XP).
        </p>
        <div className="phase-intro__actions">
          <button type="button" className="btn" onClick={() => goToPhase(level.id, 'boss')} autoFocus>
            <Icon name="sword" size={12} /> Affronter le boss
          </button>
          <button type="button" className="btn btn--secondary" onClick={() => setStage({ kind: 'play', run: stage.run + 1 })}>
            Rejouer
          </button>
        </div>
      </div>
    </div>
  );
}
