import { getLevel } from '../content/levels';
import type { GlossaryCard } from '../content/types';
import { ICONS } from '../sprites/icons';
import { SpriteIcon } from './Icon';
import { T } from './typography';
import './GlossaryCardView.css';

const RARITY_LABEL: Record<GlossaryCard['rarity'], string> = {
  commune: 'Commune',
  rare: 'Rare',
  épique: 'Épique',
  légendaire: 'Légendaire',
};

const RARITY_CLASS: Record<GlossaryCard['rarity'], string> = {
  commune: 'commune',
  rare: 'rare',
  épique: 'epique',
  légendaire: 'legendaire',
};

/** Recto d'une carte de glossaire, façon carte à collectionner. */
export function GlossaryCardView({
  card,
  onClick,
  selected,
  size = 'normal',
}: {
  card: GlossaryCard;
  onClick?: () => void;
  selected?: boolean;
  size?: 'normal' | 'large';
}) {
  const icon = ICONS[card.icon];
  const level = getLevel(card.levelId);
  const content = (
    <>
      <span className="gcard__top">
        <span className="gcard__term">
          <T>{card.term}</T>
        </span>
        <span className="gcard__gem" aria-hidden="true" />
      </span>
      <span className="gcard__art">{icon ? <SpriteIcon sprite={icon} size={size === 'large' ? 72 : 48} /> : null}</span>
      <span className="gcard__def">
        <T>{card.definition}</T>
      </span>
      <span className="gcard__foot">
        <span>Niv. {level?.badge}</span>
        <span>{RARITY_LABEL[card.rarity]}</span>
      </span>
    </>
  );
  const className = ['gcard', `gcard--${RARITY_CLASS[card.rarity]}`, `gcard--${size}`, selected ? 'gcard--selected' : ''].join(' ');
  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick} aria-pressed={selected} aria-label={`Carte ${card.term}`}>
        {content}
      </button>
    );
  }
  return <div className={className}>{content}</div>;
}

/** Dos de carte (carte pas encore obtenue). */
export function CardBack({ label }: { label: string }) {
  return (
    <div className="gcard gcard--back" aria-label={label} role="img">
      <span className="gcard__back-mark">?</span>
      <span className="gcard__back-label">{label}</span>
    </div>
  );
}

/** Verso détaillé : définition, analogie, exemple, idée reçue. */
export function GlossaryCardDetail({ card }: { card: GlossaryCard }) {
  return (
    <div className="gcard-detail">
      <GlossaryCardView card={card} size="large" />
      <dl className="gcard-detail__list">
        <div>
          <dt>Définition</dt>
          <dd>
            <T>{card.definition}</T>
          </dd>
        </div>
        <div>
          <dt>Analogie</dt>
          <dd>
            <T>{card.analogy}</T>
          </dd>
        </div>
        <div>
          <dt>Exemple</dt>
          <dd>
            <T>{card.example}</T>
          </dd>
        </div>
        <div>
          <dt>Idée reçue</dt>
          <dd>
            <s>
              <T>{card.pitfall.myth}</T>
            </s>{' '}
            <T>{card.pitfall.truth}</T>
          </dd>
        </div>
      </dl>
    </div>
  );
}
