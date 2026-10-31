import { useEffect, useState } from 'react';
import type { LevelDefinition } from '../../content/types';
import { useGame } from '../../game/GameContext';
import { Icon } from '../../ui/Icon';
import { RichText, T } from '../../ui/typography';
import { ILLUSTRATIONS } from '../illustrations';
import { goToPhase } from '../LevelPlayer';

export function ConceptPhase({ level }: { level: LevelDefinition }) {
  const { save, dispatch, sfx } = useGame();
  const screens = level.content!.concept;
  const seen = save.levels[level.id]?.conceptSeen ?? 0;
  const [index, setIndex] = useState(() => (seen >= screens.length ? 0 : Math.min(seen, screens.length - 1)));
  const screen = screens[index]!;
  const Illustration = screen.illustration ? ILLUSTRATIONS[screen.illustration] : undefined;
  const last = index === screens.length - 1;

  useEffect(() => {
    dispatch({ type: 'concept/seen', levelId: level.id, index, total: screens.length });
  }, [dispatch, level.id, index, screens.length]);

  const go = (i: number) => {
    sfx('page');
    setIndex(i);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="concept">
      <article className="concept__screen frame" aria-labelledby={`concept-${screen.id}`}>
        <h2 id={`concept-${screen.id}`}>
          <T>{screen.title}</T>
        </h2>
        <RichText text={screen.body} className="concept__body" />
        <div className="analogy">
          <p className="analogy__title">
            <Icon name="sparkle" size={14} /> Analogie : <T>{screen.analogy.title}</T>
          </p>
          <RichText text={screen.analogy.text} />
        </div>
        <p className="takeaway">
          <b>À retenir</b>
          <span>
            <T>{screen.takeaway}</T>
          </span>
        </p>
      </article>

      <aside className="concept__illus frame frame--dim" aria-label="Illustration interactive">
        {Illustration ? <Illustration /> : null}
      </aside>

      <nav className="concept__nav" aria-label="Écrans du concept">
        <button type="button" className="btn btn--secondary" onClick={() => go(index - 1)} disabled={index === 0}>
          <Icon name="arrow-left" size={12} /> Précédent
        </button>
        <ol className="dots">
          {screens.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                className={`dots__dot ${i === index ? 'dots__dot--on' : ''} ${i < Math.max(seen, index + 1) ? 'dots__dot--seen' : ''}`}
                onClick={() => go(i)}
                aria-label={`Écran ${i + 1} sur ${screens.length} : ${s.title}`}
                aria-current={i === index ? 'step' : undefined}
              />
            </li>
          ))}
        </ol>
        {last ? (
          <button type="button" className="btn" onClick={() => goToPhase(level.id, 'minigame')}>
            <Icon name="gamepad" size={12} /> Passer au mini-jeu
          </button>
        ) : (
          <button type="button" className="btn" onClick={() => go(index + 1)}>
            Suivant <Icon name="arrow-right" size={12} />
          </button>
        )}
      </nav>
    </div>
  );
}
