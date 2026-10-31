import { useEffect } from 'react';
import { LEVELS, ZONES, getLevel } from '../content/levels';
import { PHASES, PHASE_LABELS, type LevelDefinition, type PhaseId } from '../content/types';
import { useGame } from '../game/GameContext';
import { getPiece } from '../game/harness';
import { canAccessPhase, isLevelUnlocked, progressOf, resumePhase } from '../game/state';
import { href, navigate } from '../router';
import { BobSprite } from '../sprites/BobSprite';
import { pieceIcon } from '../sprites/icons';
import { silhouette } from '../sprites/pixel';
import { DialogueBox } from '../ui/components';
import { Icon, SpriteIcon } from '../ui/Icon';
import { T } from '../ui/typography';
import { BossPhase } from './phases/BossPhase';
import { ConceptPhase } from './phases/ConceptPhase';
import { MiniGamePhase } from './phases/MiniGamePhase';
import { ProblemPhase } from './phases/ProblemPhase';
import { RewardPhase } from './phases/RewardPhase';
import './level.css';

const PHASE_ICONS: Record<PhaseId, string> = {
  problem: 'warning',
  concept: 'book',
  minigame: 'gamepad',
  boss: 'sword',
  reward: 'chest',
};

/** Pièces que Bob possédait AVANT ce niveau (pour la cohérence de l'histoire). */
export function piecesBefore(level: LevelDefinition, owned: readonly string[]): string[] {
  const earlier = new Set(LEVELS.filter((l) => l.order < level.order).map((l) => l.harnessPieceId));
  return owned.filter((id) => earlier.has(id));
}

function Stepper({ level, active }: { level: LevelDefinition; active: PhaseId }) {
  const { save } = useGame();
  const progress = progressOf(save, level.id);
  return (
    <ol className="stepper" aria-label="Étapes du niveau">
      {PHASES.map((phase, i) => {
        const accessible = canAccessPhase(save, level.id, phase);
        const done = i < progress.reached || (phase === 'reward' && progress.rewardClaimed);
        const state = phase === active ? 'current' : done ? 'done' : accessible ? 'open' : 'locked';
        const content = (
          <>
            <span className="stepper__icon">
              <Icon name={state === 'done' ? 'check' : state === 'locked' ? 'lock' : PHASE_ICONS[phase]} size={12} />
            </span>
            <span className="stepper__label">{PHASE_LABELS[phase]}</span>
          </>
        );
        return (
          <li key={phase} className={`stepper__step stepper__step--${state}`}>
            {accessible && phase !== active ? (
              <a href={href({ name: 'level', levelId: level.id, phase })}>{content}</a>
            ) : (
              <span aria-current={phase === active ? 'step' : undefined}>{content}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function ComingSoon({ level }: { level: LevelDefinition }) {
  const { save } = useGame();
  const piece = getPiece(level.harnessPieceId);
  const icon = piece ? pieceIcon(piece.id) : undefined;
  return (
    <div className="coming-soon">
      <div className="coming-soon__head">
        <span className="level-chip">Niveau {level.badge}</span>
        <h1>
          <T>{level.title}</T>
        </h1>
        <p className="muted">{ZONES[level.zone].name}</p>
      </div>
      <div className="coming-soon__body frame panel">
        <BobSprite pieces={save.pieces} mood="thinking" scale={6} />
        <div className="coming-soon__text">
          <h2>Le concept</h2>
          <p>
            <T>{level.concept}</T>
          </p>
          {piece ? (
            <p className="coming-soon__piece">
              {icon ? <SpriteIcon sprite={silhouette(icon, 'm')} size={32} /> : null}
              <span>
                Récompense prévue : <b>{piece.name}</b>. <T>{piece.role}</T>
              </span>
            </p>
          ) : null}
          <DialogueBox speaker="Bob Morris">
            <p>Cette zone est encore en chantier. Le contenu de ce niveau arrive bientôt : en attendant, révise tes cartes !</p>
          </DialogueBox>
          <div className="coming-soon__actions">
            <a className="btn" href={href({ name: 'map' })}>
              <Icon name="map" size={12} /> Retour à la carte
            </a>
            <a className="btn btn--secondary" href={href({ name: 'review' })}>
              <Icon name="review" size={12} /> Réviser
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Locked({ level }: { level: LevelDefinition }) {
  const previous = LEVELS[level.order - 1];
  return (
    <div className="coming-soon">
      <div className="coming-soon__head">
        <span className="level-chip">Niveau {level.badge}</span>
        <h1>
          <T>{level.title}</T>
        </h1>
      </div>
      <div className="frame panel coming-soon__locked">
        <Icon name="lock" size={32} />
        <p>
          Ce niveau se débloque en terminant le niveau {previous?.badge} : « <T>{previous?.title ?? ''}</T> ».
        </p>
        <a className="btn" href={href({ name: 'level', levelId: previous?.id ?? 'l0' })}>
          <Icon name="play" size={12} /> Aller au niveau {previous?.badge}
        </a>
      </div>
    </div>
  );
}

export function LevelPlayer({ levelId, phase }: { levelId: string; phase?: string }) {
  const { save } = useGame();
  const level = getLevel(levelId) as LevelDefinition;
  const requested = PHASES.includes(phase as PhaseId) ? (phase as PhaseId) : undefined;
  const playable = Boolean(level.content) && isLevelUnlocked(save, level);
  const active: PhaseId =
    requested && playable && canAccessPhase(save, level.id, requested) ? requested : resumePhase(save, level.id);

  // Garde l'adresse synchronisée avec la phase réellement affichée.
  useEffect(() => {
    if (playable && phase !== active) navigate({ name: 'level', levelId: level.id, phase: active }, { replace: true });
  }, [playable, phase, active, level.id]);

  if (!level.content) return <ComingSoon level={level} />;
  if (!isLevelUnlocked(save, level)) return <Locked level={level} />;

  return (
    <div className="level">
      <header className="level__head">
        <div className="level__title">
          <span className="level-chip">Niveau {level.badge}</span>
          <h1>
            <T>{level.title}</T>
          </h1>
        </div>
        <Stepper level={level} active={active} />
      </header>
      <div className="level__body">
        {active === 'problem' ? <ProblemPhase key={`${level.id}-problem`} level={level} /> : null}
        {active === 'concept' ? <ConceptPhase key={`${level.id}-concept`} level={level} /> : null}
        {active === 'minigame' ? <MiniGamePhase key={`${level.id}-minigame`} level={level} /> : null}
        {active === 'boss' ? <BossPhase key={`${level.id}-boss`} level={level} /> : null}
        {active === 'reward' ? <RewardPhase key={`${level.id}-reward`} level={level} /> : null}
      </div>
    </div>
  );
}

export function goToPhase(levelId: string, phase: PhaseId) {
  navigate({ name: 'level', levelId, phase });
}
