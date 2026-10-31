import { useMemo } from 'react';
import type { BobMood } from '../content/types';
import { BACK_ORDER, BOB_BASE, BOB_BLINK, BOB_FACES, FRONT_ORDER, PIECE_LAYERS } from './bob';
import { PixelArt } from './PixelArt';
import type { Sprite } from './pixel';

export interface BobSpriteProps {
  pieces: readonly string[];
  mood?: BobMood;
  scale?: number;
  width?: number;
  /** Pièce à faire briller (animation d'équipement). */
  highlight?: string;
  /** Petite animation de respiration + clignement. */
  idle?: boolean;
  className?: string;
  title?: string;
}

export function BobSprite({
  pieces,
  mood = 'neutral',
  scale = 6,
  width,
  highlight,
  idle = true,
  className,
  title = 'Bob Morris',
}: BobSpriteProps) {
  const { layers, classes } = useMemo(() => {
    const owned = new Set(pieces);
    const layers: Sprite[] = [];
    const classes: (string | undefined)[] = [];
    const push = (sprite: Sprite | undefined, cls?: string) => {
      if (!sprite) return;
      layers.push(sprite);
      classes.push(cls);
    };
    for (const id of BACK_ORDER) {
      if (owned.has(id)) push(PIECE_LAYERS[id]?.back, id === highlight ? 'piece-flash' : undefined);
    }
    push(BOB_BASE);
    push(BOB_FACES[mood]);
    for (const id of FRONT_ORDER) {
      if (owned.has(id)) push(PIECE_LAYERS[id]?.front, id === highlight ? 'piece-flash' : undefined);
    }
    push(BOB_BLINK, idle ? 'bob-blink' : 'bob-blink bob-blink--off');
    return { layers, classes };
  }, [pieces, mood, highlight, idle]);

  return (
    <PixelArt
      layers={layers}
      layerClassNames={classes}
      scale={scale}
      width={width}
      title={title}
      className={['bob-sprite', idle ? 'bob-sprite--idle' : '', className ?? ''].join(' ').trim()}
    />
  );
}
