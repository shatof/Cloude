import { useGame } from '../game/GameContext';
import { BOB_BASE, BOB_FACES } from '../sprites/bob';
import { cropSprite } from '../sprites/pixel';
import { PixelArt } from '../sprites/PixelArt';
import { href, type Route } from '../router';
import { useAiStatus } from '../ai/useAi';
import { ProgressBar } from './components';
import { Icon } from './Icon';

const HEAD_LAYERS = [cropSprite(BOB_BASE, 10, 0, 20, 20), cropSprite(BOB_FACES.happy, 10, 0, 20, 20)];

const LINKS: { route: Route; label: string; icon: string; match: Route['name'][] }[] = [
  { route: { name: 'home' }, label: 'Atelier', icon: 'home', match: ['home'] },
  { route: { name: 'map' }, label: 'Carte', icon: 'map', match: ['map', 'level'] },
  { route: { name: 'collection' }, label: 'Collection', icon: 'cards', match: ['collection'] },
  { route: { name: 'review' }, label: 'Révision', icon: 'review', match: ['review'] },
  { route: { name: 'settings' }, label: 'Réglages', icon: 'settings', match: ['settings'] },
];

export function Hud({ route, tutorOpen, onOpenTutor }: { route: Route; tutorOpen: boolean; onOpenTutor: () => void }) {
  const { save, dispatch, xp, rank } = useGame();
  const ai = useAiStatus();
  const nextLabel = rank.next ? `${xp} / ${rank.next.min} XP` : `${xp} XP`;

  return (
    <header className="hud">
      <a className="hud__brand" href={href({ name: 'home' })}>
        <PixelArt layers={HEAD_LAYERS} scale={2} />
        <span>
          GitGud<em>AI</em>
        </span>
      </a>

      <nav className="hud__nav" aria-label="Navigation principale">
        {LINKS.map((link) => (
          <a
            key={link.label}
            className="hud__link"
            href={href(link.route)}
            aria-current={link.match.includes(route.name) ? 'page' : undefined}
          >
            <Icon name={link.icon} size={12} />
            {link.label}
          </a>
        ))}
      </nav>

      <div className="hud__status">
        <button
          type="button"
          className={`tutor-btn ${tutorOpen ? 'tutor-btn--open' : ''}`}
          onClick={onOpenTutor}
          aria-expanded={tutorOpen}
          title={ai.description}
        >
          <Icon name="chat" size={12} />
          <span>Tuteur</span>
          <span className={`tutor-btn__mode ${ai.connected ? 'tutor-btn__mode--on' : ''}`}>{ai.connected ? 'IA réelle' : 'simulé'}</span>
        </button>
        <a className="hud__xp" href={href({ name: 'home' })} aria-label={`Rang ${rank.title}, ${nextLabel}`}>
          <span className="hud__rank">
            <b>{rank.title}</b>
            <span>{nextLabel}</span>
          </span>
          <ProgressBar value={rank.progress} label="Progression vers le rang suivant" variant="xp" />
        </a>
        <button
          type="button"
          className="icon-btn"
          aria-pressed={save.settings.sound}
          aria-label={save.settings.sound ? 'Couper les bruitages' : 'Activer les bruitages'}
          title={save.settings.sound ? 'Couper les bruitages' : 'Activer les bruitages'}
          onClick={() => dispatch({ type: 'settings/update', patch: { sound: !save.settings.sound } })}
        >
          <Icon name={save.settings.sound ? 'sound-on' : 'sound-off'} size={24} />
        </button>
      </div>
    </header>
  );
}
