import { PixelGrid, type Sprite } from './pixel';

/** Sprites des boss (32 × 32). */

/** Remplit un polygone (coordonnées continues, test au centre de chaque pixel). */
function fillPolygon(g: PixelGrid, points: [number, number][], c: string): void {
  for (let j = 0; j < 32; j += 1) {
    for (let i = 0; i < 32; i += 1) {
      const x = i + 0.5;
      const y = j + 0.5;
      let inside = false;
      for (let a = 0, b = points.length - 1; a < points.length; b = a, a += 1) {
        const [xa, ya] = points[a]!;
        const [xb, yb] = points[b]!;
        if (ya > y !== yb > y && x < ((xb - xa) * (y - ya)) / (yb - ya) + xa) inside = !inside;
      }
      if (inside) g.set(i, j, c);
    }
  }
}

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

function marteau(): Sprite {
  const g = new PixelGrid(32, 32);
  // Tête du marteau
  g.bevelBox(3, 3, 26, 11, { fill: 'i', hi: 'w', lo: 'm', r: 2 });
  g.rect(3, 5, 4, 7, 'm');
  g.rect(25, 5, 4, 7, 'm');
  // Visage colérique
  g.stamp(['kk...', '.kk..', '..kkk'], 9, 4);
  g.stamp(['...kk', '..kk.', 'kkk..'], 18, 4);
  g.rect(11, 7, 3, 3, 'k').set(12, 8, 'w');
  g.rect(18, 7, 3, 3, 'k').set(19, 8, 'w');
  g.hline(13, 18, 11, 'k').set(12, 10, 'k').set(19, 10, 'k');
  // Manche en bois
  g.bevelBox(13, 14, 6, 15, { fill: 'o', hi: 'y', lo: 'r', r: 1 });
  g.hline(14, 17, 19, 'r').hline(14, 17, 23, 'r');
  // Pieds
  g.rect(10, 29, 5, 2, 'm').rect(17, 29, 5, 2, 'm');
  // Traits d'impact
  g.stamp(['y.', '.y', 'y.'], 0, 5).stamp(['.y', 'y.', '.y'], 30, 5);
  g.outline('k');
  return g.toSprite();
}

function reflexe(): Sprite {
  const g = new PixelGrid(32, 32);
  const bolt: [number, number][] = [
    [14, 1],
    [28, 1],
    [22, 13],
    [28, 13],
    [8, 31],
    [13, 18],
    [6, 18],
  ];
  // Éclair : ombre corail décalée, puis corps doré
  fillPolygon(g, bolt, 'o');
  fillPolygon(
    g,
    bolt.map(([x, y]) => [x - 1, y]),
    'y',
  );
  g.vline(14, 2, 3, 'w').set(13, 4, 'w');
  // Sourcils froncés, regard tourné vers l'avant
  g.stamp(['kk..', '..kk'], 13, 3);
  g.stamp(['..kk', 'kk..'], 19, 3);
  g.rect(14, 5, 3, 3, 'w').rect(14, 6, 2, 2, 'k');
  g.rect(20, 5, 3, 3, 'w').rect(20, 6, 2, 2, 'k');
  // Sourire pressé
  g.stamp(['k........k', '.kwwwwwwk.', '..krrrrk..', '...kkkk...'], 12, 9);
  // Buzzer de quiz, déjà enfoncé
  g.stamp(['..rrrrr..', '.rrwrrrrr', 'rrrrrrrrr'], 21, 23);
  g.bevelBox(20, 26, 11, 5, { fill: 'm', hi: 'i', lo: 'd', r: 1 });
  // Traits de vitesse
  g.hline(28, 31, 4, 'w').hline(27, 31, 8, 's').hline(29, 31, 16, 'w');
  g.stamp(['.y.', 'yyy', '.y.'], 1, 4).set(3, 24, 'y').set(1, 27, 'y');
  g.outline('k');
  return g.toSprite();
}

function disperse(): Sprite {
  const g = new PixelGrid(32, 32);
  // Post-it empilés dans tous les sens
  g.bevelBox(2, 3, 13, 13, { fill: 'o', lo: 'r', r: 0 });
  g.bevelBox(18, 2, 12, 12, { fill: 'c', lo: 's', r: 0 });
  g.bevelBox(1, 16, 11, 11, { fill: 'l', lo: 'g', r: 0 });
  g.bevelBox(21, 15, 10, 10, { fill: 'w', lo: 'i', r: 0 });
  g.hline(4, 11, 6, 'r').hline(4, 9, 8, 'r');
  g.hline(20, 27, 5, 's').hline(20, 25, 7, 's');
  g.hline(3, 9, 19, 'g');
  // Post-it principal, coin corné
  g.bevelBox(8, 7, 17, 17, { fill: 'y', lo: 'o', r: 0 });
  g.stamp(['....k', '...kk', '..kok', '.kook', 'kkkkk'], 20, 19);
  g.clear(23, 20, 2, 4).clear(22, 22, 1, 2).clear(21, 23, 1, 1);
  // Yeux qui regardent chacun ailleurs
  g.rect(11, 10, 4, 4, 'w').rect(11, 10, 2, 2, 'k');
  g.rect(17, 10, 4, 4, 'w').rect(19, 12, 2, 2, 'k');
  // Bouche hésitante
  g.stamp(['.k...k.', 'k.k.k.k'], 12, 16);
  // Jambes
  g.rect(12, 24, 2, 4, 'm').rect(18, 24, 2, 4, 'm');
  g.rect(10, 28, 4, 2, 'm').rect(18, 28, 4, 2, 'm');
  // Notes qui s'envolent
  g.rect(28, 27, 3, 3, 'o').rect(14, 0, 3, 2, 'l').rect(0, 29, 3, 2, 'c');
  g.outline('k');
  return g.toSprite();
}

function poisson(): Sprite {
  const g = new PixelGrid(32, 32);
  // Queue et nageoires
  fillPolygon(
    g,
    [
      [1, 9],
      [10, 15],
      [10, 19],
      [1, 25],
      [4, 17],
    ],
    'r',
  );
  fillPolygon(
    g,
    [
      [11, 10],
      [17, 5],
      [22, 9],
    ],
    'r',
  );
  g.rect(14, 24, 4, 3, 'r');
  // Corps et ventre
  g.disc(17.5, 17, 9, 'o');
  g.disc(18, 21, 5, 'y');
  g.disc(17.5, 17, 9, 'o');
  g.rect(13, 20, 9, 3, 'y').rect(15, 23, 5, 1, 'y');
  // Écailles
  g.stamp(['r.r', '.r.'], 12, 14).stamp(['r.r', '.r.'], 15, 11);
  // Grand œil perdu
  g.disc(21.5, 14, 3.6, 'w');
  g.rect(20, 14, 2, 2, 'k').set(20, 14, 'w');
  // Bouche en « o »
  g.stamp(['.k.', 'k.k', '.k.'], 25, 17);
  // Bulles et point d'interrogation
  g.ring(28, 8, 2.5, 1, 'c').ring(25, 3, 1.6, 1, 'c');
  g.stamp(['.sss.', 's...s', '...s.', '..s..', '.....', '..s..'], 3, 1);
  g.outline('k');
  return g.toSprite();
}

function entasseur(): Sprite {
  const g = new PixelGrid(32, 32);
  // Ce qui déborde de la valise
  g.rect(5, 3, 8, 10, 'w').hline(6, 11, 5, 'i').hline(6, 10, 7, 'i').hline(6, 11, 9, 'i');
  g.rect(13, 1, 5, 12, 'b').vline(14, 2, 11, 's');
  g.stamp(['.ii.', 'i..i', '.ii.', '..i.', '..i.', '..i.', '..i.'], 19, 2);
  g.stamp(['.lll', '.lll', '.lll', 'llll', 'lll.'], 23, 7);
  g.rect(2, 9, 4, 3, 'c');
  // Valise
  g.bevelBox(3, 11, 26, 17, { fill: 'o', hi: 'y', lo: 'r', r: 2 });
  g.vline(9, 12, 26, 'p').vline(22, 12, 26, 'p');
  for (let x = 5; x < 27; x += 2) g.set(x, 13, 'y');
  // Visage crispé
  g.stamp(['k..', '.k.', 'k..'], 11, 16).stamp(['..k', '.k.', '..k'], 18, 16);
  g.bevelBox(11, 20, 10, 5, { fill: 'w', r: 1 });
  g.vline(14, 21, 23, 'k').vline(17, 21, 23, 'k').hline(12, 19, 22, 'k');
  // Roulettes et goutte de sueur
  g.rect(6, 28, 3, 3, 'm').rect(23, 28, 3, 3, 'm');
  g.stamp(['.c.', 'ccc', '.c.'], 28, 15);
  g.outline('k');
  return g.toSprite();
}

function bulldozer(): Sprite {
  const g = new PixelGrid(32, 32);
  // Fumée et pot d'échappement
  g.disc(25.5, 3, 2.2, 'i').disc(29, 1.5, 1.5, 'i');
  g.rect(22, 4, 2, 6, 'm');
  // Cabine et moteur
  g.bevelBox(11, 8, 17, 14, { fill: 'y', hi: 'w', lo: 'o', r: 2 });
  // Pare-brise et regard furieux
  g.bevelBox(13, 10, 11, 6, { fill: 's', lo: 'b', r: 1 });
  g.stamp(['kkk..', '..kk.'], 14, 11).stamp(['..kkk', '.kk..'], 18, 11);
  g.rect(15, 13, 2, 2, 'k').rect(20, 13, 2, 2, 'k');
  // Dents serrées
  g.stamp(['kkkkkkkkk', 'kwkwkwkwk', 'kkkkkkkkk'], 14, 17);
  // Lame et bras
  g.bevelBox(1, 10, 6, 16, { fill: 'i', hi: 'w', lo: 'm', r: 1 });
  g.rect(7, 14, 4, 2, 'm').rect(7, 20, 4, 2, 'm');
  // Chenilles
  g.bevelBox(8, 22, 22, 8, { fill: 'd', lo: 'k', r: 3 });
  g.disc(12.5, 26, 2.2, 'm').disc(19, 26, 2.2, 'm').disc(25.5, 26, 2.2, 'm');
  g.set(12, 25, 'i').set(18, 25, 'i').set(25, 25, 'i');
  // Débris poussés
  g.stamp(['.oo', 'ooo'], 0, 28).rect(4, 27, 3, 3, 'w').set(5, 28, 'i');
  g.outline('k');
  return g.toSprite();
}

export const BOSS_SPRITES: Record<string, Sprite> = {
  tokenivore: tokenivore(),
  baratineur: baratineur(),
  marteau: marteau(),
  reflexe: reflexe(),
  disperse: disperse(),
  poisson: poisson(),
  entasseur: entasseur(),
  bulldozer: bulldozer(),
};
