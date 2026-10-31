import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { playSfx, type SfxName } from './sfx';
import { gameReducer, type GameAction, type SaveData } from './state';
import { loadSave, persistSave } from './storage';
import { rankFor, totalXp, type RankInfo } from './xp';

export interface Toast {
  id: number;
  kind: 'xp' | 'rank' | 'info';
  text: string;
}

interface GameContextValue {
  save: SaveData;
  dispatch: (action: GameAction) => void;
  xp: number;
  rank: RankInfo;
  sfx: (name: SfxName) => void;
  toasts: Toast[];
  pushToast: (kind: Toast['kind'], text: string) => void;
  loadNotice?: string;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children, initial }: { children: ReactNode; initial?: SaveData }) {
  const [boot] = useState(() => (initial ? { save: initial, notice: undefined } : loadSave()));
  const [save, dispatch] = useReducer(gameReducer, boot.save);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const xp = totalXp(save.xpLedger);
  const rank = useMemo(() => rankFor(xp), [xp]);

  const pushToast = useCallback((kind: Toast['kind'], text: string) => {
    const id = nextId.current++;
    setToasts((list) => [...list.slice(-3), { id, kind, text }]);
    window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 2600);
  }, []);

  // Sauvegarde automatique.
  useEffect(() => {
    if (!initial) persistSave(save);
  }, [save, initial]);

  // Notifications d'XP et de rang.
  const previous = useRef({ xp, rank: rank.index });
  useEffect(() => {
    const before = previous.current;
    if (xp > before.xp) pushToast('xp', `+${xp - before.xp} XP`);
    if (rank.index > before.rank) pushToast('rank', `Nouveau rang : ${rank.title}`);
    previous.current = { xp, rank: rank.index };
  }, [xp, rank.index, rank.title, pushToast]);

  // Réglages d'affichage appliqués à la racine du document.
  const { readableFont, textScale, crt, reduceMotion } = save.settings;
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('readable', readableFont);
    root.classList.toggle('crt', crt);
    root.classList.toggle('reduce-motion', reduceMotion);
    root.style.setProperty('--text-scale', String(textScale));
  }, [readableFont, textScale, crt, reduceMotion]);

  const soundOn = save.settings.sound;
  const sfx = useCallback(
    (name: SfxName) => {
      if (soundOn) playSfx(name);
    },
    [soundOn],
  );

  const value = useMemo<GameContextValue>(
    () => ({ save, dispatch, xp, rank, sfx, toasts, pushToast, loadNotice: boot.notice }),
    [save, xp, rank, sfx, toasts, pushToast, boot.notice],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame doit être utilisé dans <GameProvider>');
  return ctx;
}

/** Préférence « mouvement réduit » (réglage du jeu ou du système). */
export function useReducedMotion(): boolean {
  const { save } = useGame();
  const [system, setSystem] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
  );
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setSystem(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return save.settings.reduceMotion || system;
}
