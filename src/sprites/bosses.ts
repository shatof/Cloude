import { PixelGrid, type Sprite } from './pixel';

/** Sprites des boss (32 × 32). */

function tokenivore(): Sprite {
  const g = new PixelGrid(32, 32);
  // Corps
  g.disc(16, 18, 12, 'p');
  g.disc(14.5, 16.5, 10, 'r');
  g.disc(11, 11, 2.2, 'o');
  // Cornes
  g.stamp(['..o', '.oo', 'oor', 'orr'], 6, 4);
  g.stamp(['o..', 'oo.', 'roo', 'rro'], 23, 4);
  // Œil unique
  g.disc(16, 11.5, 3.6, 'w');
  g.rect(16, 11, 2, 2, 'k');
  g.set(15, 10, 'c');
  g.hline(12, 20, 7, 'p');
  // Gueule
  g.bevelBox(7, 17, 18, 9, { fill: 'k', outline: 'k', r: 2 });
  const chips = ['y', 's', 'l', 'o', 'c'];
  chips.forEach((c, i) => g.rect(9 + i * 3, 18, 2, 2, c));
  chips
    .slice()
    .reverse()
    .forEach((c, i) => g.rect(9 + i * 3, 23, 2, 2, c));
  g.rect(13, 21, 6, 2, 'r');
  // Pieds
  g.rect(9, 29, 4, 2, 'p');
  g.rect(19, 29, 4, 2, 'p');
  // Lettres dévorées
  g.stamp(['ww.', 'w.w', 'ww.'], 1, 16); // « b »
  g.stamp(['.w.', 'w.w', 'www'], 2, 21); // « a »
  g.stamp(['ww', 'w.', 'w.'], 27, 22); // « r »
  g.outline('k');
  return g.toSprite();
}

function baratineur(): Sprite {
  const g = new PixelGrid(32, 32);
  // Bulle de dialogue
  g.bevelBox(2, 3, 28, 19, { fill: 'w', lo: 'i', r: 3 });
  g.stamp(['.kwwwk', '.kwwk.', 'kwwk..', 'kwk...', 'kk....'], 5, 21);
  g.hline(7, 9, 21, 'w');
  // Sourcils levés et yeux en coin
  g.stamp(['...kk', '.kk..', 'k....'], 8, 6);
  g.stamp(['kk...', '..kk.', '....k'], 19, 6);
  g.rect(10, 9, 3, 3, 'k').set(11, 9, 'w');
  g.rect(19, 9, 3, 3, 'k').set(20, 9, 'w');
  // Grand sourire satisfait
  g.stamp(
    [
      'k..............k',
      'kk............kk',
      '.kwwwwwwwwwwwwk.',
      '..krrrrrrrrrrk..',
      '...kkkkkkkkkk...',
    ],
    8,
    13,
  );
  g.vline(12, 15, 15, 'i').vline(16, 15, 15, 'i').vline(20, 15, 15, 'i');
  // Nœud papillon
  g.stamp(['kk...kk', 'krk.krk', 'krrkrrk', 'krk.krk', 'kk...kk'], 13, 22);
  // Petites jambes
  g.vline(22, 22, 27, 'i').vline(26, 22, 27, 'i');
  g.hline(20, 23, 28, 'w').hline(24, 27, 28, 'w');
  // Étincelles de vantardise
  g.stamp(['.y.', 'yyy', '.y.'], 27, 0);
  g.stamp(['.y.', 'yyy', '.y.'], 0, 0);
  g.set(30, 5, 'y');
  return g.toSprite();
}

export const BOSS_SPRITES: Record<string, Sprite> = {
  tokenivore: tokenivore(),
  baratineur: baratineur(),
};
