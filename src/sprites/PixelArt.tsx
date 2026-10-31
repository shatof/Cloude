import { memo, type CSSProperties } from 'react';
import { spriteRuns, type PixelRun, type Sprite } from './pixel';

const RUN_CACHE = new WeakMap<Sprite, PixelRun[]>();

function runsOf(sprite: Sprite): PixelRun[] {
  let runs = RUN_CACHE.get(sprite);
  if (!runs) {
    runs = spriteRuns(sprite);
    RUN_CACHE.set(sprite, runs);
  }
  return runs;
}

export interface PixelArtProps {
  /** Calques superposés, du fond vers l'avant. Tous de la même taille que le premier. */
  layers: Sprite[];
  /** Taille d'un pixel à l'écran (en px CSS). Ignoré si `width` est fourni. */
  scale?: number;
  /** Largeur affichée en px CSS (la hauteur suit les proportions). */
  width?: number;
  className?: string;
  /** Classe CSS optionnelle par calque (ex. animation d'une pièce). */
  layerClassNames?: (string | undefined)[];
  /** Texte alternatif ; sans titre, l'image est décorative. */
  title?: string;
  style?: CSSProperties;
}

export const PixelArt = memo(function PixelArt({
  layers,
  scale = 4,
  width,
  className,
  layerClassNames,
  title,
  style,
}: PixelArtProps) {
  const first = layers[0];
  if (!first) return null;
  const w = first.w;
  const h = first.h;
  const displayW = width ?? w * scale;
  const displayH = (displayW / w) * h;
  return (
    <svg
      className={className}
      width={displayW}
      height={displayH}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      style={style}
    >
      {layers.map((sprite, i) => (
        <g key={i} className={layerClassNames?.[i]}>
          {runsOf(sprite).map((r, j) => (
            <rect key={j} x={r.x} y={r.y} width={r.w} height={1} fill={r.color} />
          ))}
        </g>
      ))}
    </svg>
  );
});
