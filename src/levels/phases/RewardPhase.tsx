import { useEffect, useState } from 'react';
import { LEVELS, getCard } from '../../content/levels';
import type { LevelDefinition } from '../../content/types';
import { useGame, useReducedMotion } from '../../game/GameContext';
import { getPiece } from '../../game/harness';
import { isLevelUnlocked } from '../../game/state';
import { XP_RULES } from '../../game/xp';
import { href, navigate } from '../../router';
import { BobSprite } from '../../sprites/BobSprite';
import { pieceIcon } from '../../sprites/icons';
import { PixelArt } from '../../sprites/PixelArt';
import { CHEST_CLOSED, CHEST_OPEN } from '../../sprites/props';
import { DialogueBox, Typewriter } from '../../ui/components';
import { GlossaryCardView } from '../../ui/GlossaryCardView';
import { Icon, SpriteIcon } from '../../ui/Icon';
import { T } from '../../ui/typography';
import { piecesBefore } from '../LevelPlayer';

type Stage = 'chest' | 'opening' | 'done';

export function RewardPhase({ level }: { level: LevelDefinition }) {
  const { save, dispatch, sfx } = useGame();
  const reduced = useReducedMotion();
  const content = level.content!;
  const claimed = save.levels[level.id]?.rewardClaimed ?? false;
  const [stage, setStage] = useState<Stage>(claimed ? 'done' : 'chest');
  const [justClaimed, setJustClaimed] = useState(false);
  const piece = getPiece(level.harnessPieceId);
  const icon = piece ? pieceIcon(piece.id) : undefined;
  const cards = content.reward.cardIds.map((id) => getCard(id)).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const next = LEVELS[level.order + 1];
  const nextPlayable = next ? Boolean(next.content) && isLevelUnlocked(save, next) : false;

  const open = () => {
    sfx('unlock');
    dispatch({ type: 'reward/claim', levelId: level.id });
    setJustClaimed(true);
    setStage('opening');
  };

  useEffect(() => {
    if (stage !== 'opening') return;
    const id = window.setTimeout(() => setStage('done'), reduced ? 0 : 1100);
    return () => window.clearTimeout(id);
  }, [stage, reduced]);

  const ledger = save.xpLedger;
  const xpLines = [
    { label: 'Problème', value: ledger[`${level.id}:problem`] ?? 0, max: XP_RULES.problem },
    {
      label: 'Concept',
      value: content.concept.reduce((sum, _s, i) => sum + (ledger[`${level.id}:concept:${i}`] ?? 0), 0),
      max: XP_RULES.conceptScreen * content.concept.length,
    },
    { label: 'Mini-jeu', value: ledger[`${level.id}:minigame`] ?? 0, max: content.minigame.xp },
    { label: 'Boss', value: ledger[`${level.id}:boss`] ?? 0, max: content.boss.xp },
    { label: 'Récompense', value: ledger[`${level.id}:reward`] ?? 0, max: content.reward.xp },
  ];
  const levelXp = xpLines.reduce((s, l) => s + l.value, 0);
  const levelMax = xpLines.reduce((s, l) => s + l.max, 0);

  if (stage === 'chest') {
    return (
      <div className="reward reward--chest">
        <div className="reward__stage">
          <BobSprite pieces={piecesBefore(level, save.pieces)} mood="surprised" scale={7} />
          <button type="button" className="chest-btn" onClick={open} autoFocus aria-label="Ouvrir le coffre">
            <PixelArt layers={[CHEST_CLOSED]} scale={6} />
            <span className="btn">Ouvrir le coffre</span>
          </button>
        </div>
        <p className="muted reward__hint">Le boss est vaincu. Une pièce de harnais t’attend…</p>
      </div>
    );
  }

  return (
    <div className="reward">
      <div className="reward__stage">
        <div className="reward__bob">
          <BobSprite pieces={save.pieces} mood="proud" scale={7} highlight={stage === 'done' && justClaimed ? piece?.id : undefined} />
        </div>
        <div className="reward__chest">
          <PixelArt layers={[CHEST_OPEN]} scale={5} />
          {stage === 'opening' && icon ? (
            <span className="reward__rising">
              <SpriteIcon sprite={icon} size={64} />
            </span>
          ) : null}
        </div>
      </div>

      {stage === 'done' ? (
        <div className="reward__content">
          <section className="reward__piece frame frame--gold" aria-labelledby="reward-piece">
            {icon ? <SpriteIcon sprite={icon} size={64} /> : null}
            <div>
              <p className="muted">Nouvelle pièce de harnais</p>
              <h2 id="reward-piece">{piece?.name}</h2>
              <p>
                <T>{piece?.realWorld ?? ''}</T>
              </p>
            </div>
          </section>

          <DialogueBox speaker="Bob Morris">
            <Typewriter text={content.reward.message} />
          </DialogueBox>

          <section className="reward__cards" aria-labelledby="reward-cards">
            <h2 id="reward-cards">
              {cards.length} carte{cards.length > 1 ? 's' : ''} de glossaire
            </h2>
            <div className="reward__cards-row">
              {cards.map((card, i) => (
                <div key={card.id} className="reward__card" style={{ animationDelay: `${i * 160}ms` }}>
                  <GlossaryCardView card={card} onClick={() => navigate({ name: 'collection', cardId: card.id })} />
                </div>
              ))}
            </div>
          </section>

          <section className="reward__xp frame panel" aria-labelledby="reward-xp">
            <h2 id="reward-xp">
              XP du niveau : {levelXp} / {levelMax}
            </h2>
            <dl>
              {xpLines.map((l) => (
                <div key={l.label}>
                  <dt>{l.label}</dt>
                  <dd>
                    {l.value} / {l.max}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="reward__actions">
            {nextPlayable && next ? (
              <a className="btn" href={href({ name: 'level', levelId: next.id })}>
                <Icon name="play" size={12} /> Niveau {next.badge} : <T>{next.shortTitle}</T>
              </a>
            ) : (
              <a className="btn" href={href({ name: 'home' })}>
                <Icon name="home" size={12} /> Voir Bob équipé
              </a>
            )}
            <a className="btn btn--secondary" href={href({ name: 'map' })}>
              <Icon name="map" size={12} /> Carte
            </a>
            <a className="btn btn--secondary" href={href({ name: 'review' })}>
              <Icon name="review" size={12} /> Réviser mes cartes
            </a>
          </div>
          {!nextPlayable && next ? (
            <p className="muted">
              Prochain niveau : « <T>{next.title}</T> », en construction.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
