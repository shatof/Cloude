import { useEffect, useState } from 'react';

/**
 * Routeur minimal par fragment d'URL (#/carte, #/niveau/l0/boss…).
 * Fonctionne sur n'importe quel hébergement statique, sans configuration serveur.
 */

export type Route =
  | { name: 'home' }
  | { name: 'map'; levelId?: string }
  | { name: 'level'; levelId: string; phase?: string }
  | { name: 'collection'; cardId?: string }
  | { name: 'review' }
  | { name: 'settings' }
  | { name: 'gallery' }
  | { name: 'not-found' };

export function parseHash(hash: string): Route {
  const parts = hash
    .replace(/^#\/?/, '')
    .split('/')
    .filter(Boolean)
    .map((p) => decodeURIComponent(p));
  const [head, a, b] = parts;
  switch (head) {
    case undefined:
    case 'atelier':
      return { name: 'home' };
    case 'carte':
      return { name: 'map', levelId: a };
    case 'niveau':
      return a ? { name: 'level', levelId: a, phase: b } : { name: 'map' };
    case 'collection':
      return { name: 'collection', cardId: a };
    case 'revision':
      return { name: 'review' };
    case 'reglages':
      return { name: 'settings' };
    case 'atelier-sprites':
      return { name: 'gallery' };
    default:
      return { name: 'not-found' };
  }
}

export function href(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/';
    case 'map':
      return route.levelId ? `#/carte/${route.levelId}` : '#/carte';
    case 'level':
      return route.phase ? `#/niveau/${route.levelId}/${route.phase}` : `#/niveau/${route.levelId}`;
    case 'collection':
      return route.cardId ? `#/collection/${route.cardId}` : '#/collection';
    case 'review':
      return '#/revision';
    case 'settings':
      return '#/reglages';
    case 'gallery':
      return '#/atelier-sprites';
    default:
      return '#/';
  }
}

export function navigate(route: Route, options: { replace?: boolean } = {}): void {
  const target = href(route);
  if (options.replace) {
    window.history.replaceState(null, '', target);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = target;
  }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
