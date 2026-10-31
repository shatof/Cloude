import { ICONS } from '../sprites/icons';
import { PixelArt } from '../sprites/PixelArt';
import type { Sprite } from '../sprites/pixel';

export interface IconProps {
  name: string;
  /** Taille en px CSS (arrondie à un multiple de la grille pour rester net). */
  size?: number;
  className?: string;
  title?: string;
}

export function Icon({ name, size = 24, className, title }: IconProps) {
  const sprite = ICONS[name];
  if (!sprite) return null;
  return <SpriteIcon sprite={sprite} size={size} className={className} title={title} />;
}

export function SpriteIcon({
  sprite,
  size = 24,
  className,
  title,
}: {
  sprite: Sprite;
  size?: number;
  className?: string;
  title?: string;
}) {
  const longest = Math.max(sprite.w, sprite.h);
  const scale = Math.max(1, Math.floor(size / longest));
  return (
    <PixelArt
      layers={[sprite]}
      scale={scale}
      title={title}
      className={['icon', className ?? ''].join(' ').trim()}
    />
  );
}
