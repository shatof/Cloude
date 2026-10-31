import type { ZoneId } from '../content/types';
import { PixelGrid, type Sprite } from './pixel';

/** Repères de la carte, un par zone (16 × 16). */

function make(draw: (g: PixelGrid) => void): Sprite {
  const g = new PixelGrid(16, 16);
  draw(g);
  g.outline('k');
  return g.toSprite();
}

export const LANDMARKS: Record<ZoneId, Sprite> = {
  fondations: make((g) => {
    g.rect(7, 10, 2, 5, 'o');
    g.disc(8, 6, 5.2, 'g');
    g.disc(6.5, 4.5, 2.6, 'l');
    g.set(11, 8, 't').set(10, 9, 't').set(12, 7, 't');
  }),
  atelier: make((g) => {
    for (let a = 0; a < 8; a += 1) {
      const angle = (a * Math.PI) / 4;
      const x = Math.round(8 + Math.cos(angle) * 6.2 - 1);
      const y = Math.round(8 + Math.sin(angle) * 6.2 - 1);
      g.rect(x, y, 2, 2, 'i');
    }
    g.ring(8, 8, 5.2, 2.6, 'i');
    g.ring(8, 8, 5.2, 0.8, 'm');
    g.disc(8, 8, 1.6, '.');
  }),
  bibliotheque: make((g) => {
    g.rect(1, 5, 3, 10, 'r').hline(1, 3, 7, 'w');
    g.rect(4, 2, 3, 13, 'b').hline(4, 6, 4, 'w').hline(4, 6, 12, 'w');
    g.rect(7, 6, 3, 9, 'g').hline(7, 9, 8, 'y');
    g.stamp(['..yy', '.yyy', 'yyyy', 'yyy.', 'yyy.', 'yy..', 'yy..', 'yy..', 'y...'], 10, 6);
    g.hline(0, 15, 15, 'm');
  }),
  forge: make((g) => {
    g.stamp(['..r.', '.ror', 'royo', 'oyyo', '.yy.'], 6, 1);
    g.rect(2, 8, 12, 3, 'm').hline(2, 13, 8, 'i');
    g.rect(1, 8, 2, 2, 'm');
    g.rect(6, 11, 4, 2, 'm');
    g.rect(4, 13, 8, 2, 'd');
  }),
  archipel: make((g) => {
    g.stamp(['.....ggg..', '..gggg.gg.', '.gg..oggg.', 'g....o..g.', '.....o....', '....o.....'], 4, 1);
    g.disc(8, 13, 4.5, 'y');
    g.clear(0, 14, 16, 2);
    g.hline(0, 15, 14, 's').hline(1, 4, 15, 'b').hline(7, 10, 15, 'b').hline(12, 15, 15, 'b');
  }),
  observatoire: make((g) => {
    g.stamp(['.....ii', '...iiww', '.iiiiw.', 'iiiii..', '.ii....'], 3, 3);
    g.vline(7, 8, 14, 'm');
    g.set(6, 13, 'm').set(5, 14, 'm').set(8, 13, 'm').set(9, 14, 'm');
    g.set(1, 1, 'y').set(13, 1, 'y').set(14, 7, 'y').set(1, 9, 'y');
  }),
  citadelle: make((g) => {
    g.rect(3, 5, 10, 10, 'm');
    g.vline(4, 6, 14, 'i');
    for (let x = 3; x <= 12; x += 3) g.rect(x, 3, 2, 2, 'm');
    g.rect(7, 10, 2, 5, 'k');
    g.rect(6, 7, 1, 1, 'd').rect(9, 7, 1, 1, 'd');
    g.vline(12, 0, 3, 'i');
    g.rect(13, 0, 2, 2, 'r');
  }),
  sommet: make((g) => {
    for (let y = 4; y <= 15; y += 1) {
      const half = Math.floor((y - 3) * 0.75);
      g.hline(8 - half, 8 + half, y, 'm');
    }
    for (let y = 4; y <= 7; y += 1) {
      const half = Math.floor((y - 3) * 0.75);
      g.hline(8 - half, 8 + half, y, 'w');
    }
    g.vline(8, 0, 4, 'i');
    g.rect(9, 0, 3, 2, 'y');
  }),
};
