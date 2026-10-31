import { PixelGrid, type Sprite } from './pixel';

/** Accessoires : coffre de récompense. */

function chest(open: boolean): Sprite {
  const g = new PixelGrid(24, 20);
  // Base
  g.bevelBox(1, 9, 22, 11, { fill: 'o', hi: 'y', lo: 'r', r: 1 });
  g.rect(1, 13, 22, 2, 'k');
  g.rect(2, 13, 20, 1, 'p');
  if (open) {
    // Couvercle ouvert (vu de l'intérieur) + lueur
    g.bevelBox(2, 1, 20, 8, { fill: 'p', hi: 'r', lo: 'k', r: 1 });
    g.rect(4, 7, 16, 3, 'y');
    g.rect(6, 6, 12, 2, 'w');
  } else {
    g.bevelBox(1, 3, 22, 8, { fill: 'o', hi: 'y', lo: 'r', r: 2 });
    g.rect(1, 9, 22, 2, 'k');
  }
  // Serrure
  g.rect(10, open ? 12 : 9, 4, 5, 'y');
  g.rect(11, open ? 14 : 11, 2, 2, 'k');
  return g.toSprite();
}

export const CHEST_CLOSED = chest(false);
export const CHEST_OPEN = chest(true);
