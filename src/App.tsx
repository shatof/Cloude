import { useEffect, useState } from 'react';
import { getLevel } from './content/levels';
import { GameProvider, useGame } from './game/GameContext';
import { useRoute, href, type Route } from './router';
import { Collection } from './screens/Collection';
import { Home } from './screens/Home';
import { LevelMap } from './screens/LevelMap';
import { LevelPlayer } from './levels/LevelPlayer';
import { Review } from './screens/Review';
import { Settings } from './screens/Settings';
import { SpriteGallery } from './screens/SpriteGallery';
import { TutorDrawer } from './ai/TutorDrawer';
import { Hud } from './ui/Hud';
import { Toasts } from './ui/components';
import { Icon } from './ui/Icon';

function Screen({ route }: { route: Route }) {
  switch (route.name) {
    case 'home':
      return <Home />;
    case 'map':
      return <LevelMap selectedId={route.levelId} />;
    case 'level':
      return getLevel(route.levelId) ? (
        <LevelPlayer key={route.levelId} levelId={route.levelId} phase={route.phase} />
      ) : (
        <NotFound />
      );
    case 'collection':
      return <Collection openCardId={route.cardId} />;
    case 'review':
      return <Review />;
    case 'settings':
      return <Settings />;
    case 'gallery':
      return <SpriteGallery />;
    default:
      return <NotFound />;
  }
}

function NotFound() {
  return (
    <div className="page-404">
      <h1>Page introuvable</h1>
      <p className="muted">Même avec un harnais complet, Bob ne trouve pas cette page.</p>
      <a className="btn" href={href({ name: 'home' })}>
        <Icon name="home" size={12} /> Retour à l’atelier
      </a>
    </div>
  );
}

function Shell() {
  const route = useRoute();
  const { loadNotice } = useGame();
  const [tutorOpen, setTutorOpen] = useState(false);
  const levelId = route.name === 'level' ? route.levelId : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [route.name, levelId]);

  return (
    <div className="app">
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <Hud route={route} tutorOpen={tutorOpen} onOpenTutor={() => setTutorOpen((open) => !open)} />
      <main id="contenu" className="main" tabIndex={-1}>
        {loadNotice ? (
          <p className="notice" role="status">
            <Icon name="warning" size={16} /> {loadNotice}
          </p>
        ) : null}
        <Screen route={route} />
      </main>
      {tutorOpen ? <TutorDrawer levelId={levelId} onClose={() => setTutorOpen(false)} /> : null}
      <Toasts />
    </div>
  );
}

export function App() {
  return (
    <GameProvider>
      <Shell />
    </GameProvider>
  );
}
