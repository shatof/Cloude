import { useState } from 'react';
import { CARDS, LEVELS, cardsForLevel, getCard } from '../content/levels';
import { useGame } from '../game/GameContext';
import { href } from '../router';
import { BobSprite } from '../sprites/BobSprite';
import { CardBack, GlossaryCardDetail, GlossaryCardView } from '../ui/GlossaryCardView';
import { Icon } from '../ui/Icon';
import { T } from '../ui/typography';
import './Collection.css';

export function Collection({ openCardId }: { openCardId?: string }) {
  const { save } = useGame();
  const owned = new Set(save.cards);
  const firstOwned = CARDS.find((c) => owned.has(c.id));
  const initial = openCardId && owned.has(openCardId) ? openCardId : firstOwned?.id;
  const [selectedId, setSelectedId] = useState<string | undefined>(initial);
  const selected = selectedId ? getCard(selectedId) : undefined;

  return (
    <div className="collection">
      <div className="page-head">
        <div>
          <h1>Collection</h1>
          <p>
            Une carte par concept débloqué. Clique sur une carte pour lire son verso : définition, analogie, exemple et idée reçue.
          </p>
        </div>
        <p className="collection__count">
          <b>{save.cards.length}</b> / {CARDS.length} cartes
          <span className="muted"> (d’autres arrivent avec les prochains niveaux)</span>
        </p>
      </div>

      <div className="collection__layout">
        <div className="binder">
          {LEVELS.map((level) => {
            const cards = cardsForLevel(level.id);
            return (
              <section key={level.id} className="binder__page" aria-labelledby={`binder-${level.id}`}>
                <h2 id={`binder-${level.id}`}>
                  <span className="binder__badge">{level.badge}</span>
                  <T>{level.title}</T>
                </h2>
                {cards.length === 0 ? (
                  <p className="binder__soon">
                    <Icon name="hammer" size={12} /> Cartes à venir avec le niveau.
                  </p>
                ) : (
                  <div className="binder__cards">
                    {cards.map((card) =>
                      owned.has(card.id) ? (
                        <GlossaryCardView
                          key={card.id}
                          card={card}
                          selected={card.id === selectedId}
                          onClick={() => setSelectedId(card.id)}
                        />
                      ) : (
                        <CardBack key={card.id} label={`Termine le niveau ${level.badge}`} />
                      ),
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <aside className="collection__detail frame frame--raised" aria-live="polite">
          {selected ? (
            <GlossaryCardDetail card={selected} />
          ) : (
            <div className="collection__empty">
              <BobSprite pieces={save.pieces} mood="thinking" scale={4} />
              <p>Ta collection est vide pour l’instant. Chaque niveau terminé t’offre de nouvelles cartes.</p>
              <a className="btn" href={href({ name: 'map' })}>
                <Icon name="map" size={12} /> Aller à la carte
              </a>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
