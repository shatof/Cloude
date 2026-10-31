import type { BobMood } from '../content/types';
import { PixelGrid, type Sprite } from './pixel';

/**
 * Bob Morris, 40 × 40 pixels.
 * Le cerveau (sous le dôme) ne change jamais ; chaque pièce de harnais est un calque.
 */

export const BOB_SIZE = 40;

function grid(): PixelGrid {
  return new PixelGrid(BOB_SIZE, BOB_SIZE);
}

/* ------------------------------------------------------------------ */
/* Corps de base                                                       */
/* ------------------------------------------------------------------ */

function buildBase(): Sprite {
  const g = grid();
  const steel = { fill: 'i', hi: 'w', lo: 'm' };

  // Jambes et pieds
  g.bevelBox(15, 30, 4, 6, { ...steel, r: 0 });
  g.bevelBox(21, 30, 4, 6, { ...steel, r: 0 });
  g.bevelBox(13, 34, 7, 3, { fill: 'm', hi: 'i', r: 1 });
  g.bevelBox(20, 34, 7, 3, { fill: 'm', hi: 'i', r: 1 });

  // Bras
  g.bevelBox(9, 21, 5, 8, { ...steel, r: 1 });
  g.bevelBox(26, 21, 5, 8, { ...steel, r: 1 });
  // Mains (pinces)
  g.bevelBox(8, 27, 5, 4, { fill: 'm', hi: 'i', r: 1 });
  g.bevelBox(27, 27, 5, 4, { fill: 'm', hi: 'i', r: 1 });

  // Torse
  g.bevelBox(12, 19, 16, 13, { ...steel, r: 2 });
  // Panneau de poitrine (vide : la jauge de contexte viendra s'y loger)
  g.bevelBox(15, 22, 10, 7, { fill: 'd', outline: 'k', r: 1 });
  g.set(16, 23, 'm').set(17, 23, 'm');

  // Cou
  g.rect(18, 18, 4, 2, 'm');
  g.hline(18, 21, 18, 'k');

  // Tête (plaque frontale)
  g.bevelBox(11, 8, 18, 11, { ...steel, r: 2 });
  // Écran du visage
  g.bevelBox(13, 10, 14, 7, { fill: 'n', outline: 'k', r: 1 });
  // Boulons latéraux
  g.rect(10, 12, 1, 3, 'm').set(10, 11, 'k').set(10, 15, 'k');
  g.rect(29, 12, 1, 3, 'm').set(29, 11, 'k').set(29, 15, 'k');

  // Dôme de verre
  g.bevelBox(14, 1, 12, 9, { fill: 't', outline: 'k', r: 3 });
  // Cerveau (le modèle) : il ne changera jamais
  g.stamp(
    [
      '.rorro.',
      'rorrorr',
      'orrpror',
      'rrorrpr',
      '.prrpr.',
    ],
    16,
    3,
  );
  // Reflet du verre
  g.set(16, 2, 'c').set(17, 2, 'c').set(15, 3, 'c').set(15, 4, 'c').set(15, 5, 's');
  g.set(24, 4, 's').set(24, 5, 's').set(23, 2, 's');
  // Base du dôme
  g.hline(13, 26, 8, 'k');
  g.hline(14, 25, 9, 'm');

  return g.toSprite();
}

export const BOB_BASE = buildBase();

/* ------------------------------------------------------------------ */
/* Visages                                                             */
/* ------------------------------------------------------------------ */

function face(draw: (g: PixelGrid) => void): Sprite {
  const g = grid();
  draw(g);
  return g.toSprite();
}

const EYE_L = 16;
const EYE_R = 22;

export const BOB_FACES: Record<BobMood, Sprite> = {
  neutral: face((g) => {
    g.rect(EYE_L, 12, 2, 2, 'c').rect(EYE_R, 12, 2, 2, 'c');
    g.hline(18, 21, 15, 'c');
  }),
  happy: face((g) => {
    g.set(EYE_L, 13, 'c').set(EYE_L + 1, 12, 'c').set(EYE_L + 2, 13, 'c');
    g.set(EYE_R - 1, 13, 'c').set(EYE_R, 12, 'c').set(EYE_R + 1, 13, 'c');
    g.set(17, 14, 'c').hline(18, 21, 15, 'c').set(22, 14, 'c');
  }),
  proud: face((g) => {
    g.hline(EYE_L, EYE_L + 2, 13, 'c').hline(EYE_R - 1, EYE_R + 1, 13, 'c');
    g.set(16, 14, 'c').hline(17, 22, 15, 'c').set(23, 14, 'c');
    g.hline(18, 21, 14, 'w');
  }),
  sad: face((g) => {
    g.rect(EYE_L, 13, 2, 1, 'c').rect(EYE_R, 13, 2, 1, 'c');
    g.set(EYE_L - 1, 12, 'c').set(EYE_R + 2, 12, 'c');
    g.set(17, 15, 'c').hline(18, 21, 14, 'c').set(22, 15, 'c');
  }),
  confused: face((g) => {
    g.rect(EYE_L, 12, 2, 2, 'c').rect(EYE_R, 13, 2, 1, 'c');
    g.set(EYE_R - 1, 11, 'c').set(EYE_R, 11, 'c');
    g.set(18, 15, 'c').set(19, 14, 'c').set(20, 15, 'c').set(21, 14, 'c');
  }),
  thinking: face((g) => {
    g.rect(EYE_L + 1, 11, 2, 2, 'c').rect(EYE_R + 1, 11, 2, 2, 'c');
    g.hline(19, 21, 15, 'c');
  }),
  surprised: face((g) => {
    g.rect(EYE_L, 11, 2, 3, 'c').rect(EYE_R, 11, 2, 3, 'c');
    g.rect(19, 14, 2, 2, 'c');
  }),
};

/** Yeux fermés, superposés brièvement pour le clignement. */
export const BOB_BLINK: Sprite = face((g) => {
  g.rect(14, 11, 12, 3, 'n');
  g.hline(EYE_L, EYE_L + 1, 13, 'c').hline(EYE_R, EYE_R + 1, 13, 'c');
});

/* ------------------------------------------------------------------ */
/* Pièces de harnais (calques)                                         */
/* ------------------------------------------------------------------ */

export interface PieceLayers {
  /** Dessiné derrière le corps. */
  back?: Sprite;
  /** Dessiné devant le corps. */
  front?: Sprite;
  /** Icône dédiée pour la fiche d'équipement (sinon : recadrage du calque). */
  icon?: Sprite;
}

function layer(draw: (g: PixelGrid) => void): Sprite {
  const g = grid();
  draw(g);
  return g.toSprite();
}

function iconGrid(size: number, draw: (g: PixelGrid) => void): Sprite {
  const g = new PixelGrid(size, size);
  draw(g);
  return g.toSprite();
}

const contextGauge: PieceLayers = {
  front: layer((g) => {
    g.rect(16, 24, 8, 4, 'k');
    g.rect(17, 25, 6, 2, 'd');
    g.rect(17, 25, 3, 2, 'l');
    g.rect(20, 25, 1, 2, 'y');
    g.set(21, 25, 'o');
    g.set(16, 23, 'k').set(23, 23, 'k');
  }),
  icon: iconGrid(12, (g) => {
    g.bevelBox(0, 3, 12, 6, { fill: 'd', outline: 'k', r: 0 });
    g.rect(1, 4, 5, 4, 'l').rect(6, 4, 2, 4, 'y').rect(8, 4, 1, 4, 'o');
    g.set(2, 4, 'w').set(3, 4, 'w');
  }),
};

const loopEngine: PieceLayers = {
  back: layer((g) => {
    g.ring(20, 26, 13, 1.6, 'y');
    g.ring(20, 26, 11.5, 0.5, 'o');
    // Têtes de flèche (sens de rotation)
    g.stamp(['.y.', 'yyy', 'yyy'], 6, 17);
    g.stamp(['yyy', 'yyy', '.y.'], 31, 33);
  }),
  icon: iconGrid(14, (g) => {
    g.ring(7, 7, 6, 2, 'y');
    g.ring(7, 7, 4.2, 0.5, 'o');
    g.clear(9, 0, 5, 4);
    g.stamp(['y...', 'yy..', 'yyy.', 'yy..', 'y...'], 9, 0);
    g.clear(0, 10, 5, 4);
    g.stamp(['...y', '..yy', '.yyy', '..yy', '...y'], 1, 9);
  }),
};

const toolBelt: PieceLayers = {
  front: layer((g) => {
    g.rect(12, 27, 16, 4, 'k');
    g.rect(12, 28, 16, 2, 'o');
    g.hline(12, 27, 28, 'y');
    // Boucle
    g.rect(18, 27, 4, 4, 'y').rect(19, 28, 2, 2, 'k');
    // Sacoche
    g.bevelBox(10, 28, 6, 6, { fill: 'r', hi: 'o', r: 1 });
    g.hline(11, 14, 30, 'k');
    // Clé à molette
    g.rect(25, 30, 2, 4, 'i').vline(26, 30, 33, 'm');
    g.stamp(['w..w', 'wwww', '.ww.'], 24, 34);
  }),
  icon: iconGrid(12, (g) => {
    g.rect(0, 3, 12, 4, 'k').rect(0, 4, 12, 2, 'o').hline(0, 11, 4, 'y');
    g.rect(4, 3, 4, 4, 'y').rect(5, 4, 2, 2, 'k');
    g.bevelBox(0, 5, 4, 5, { fill: 'r', hi: 'o', r: 1 });
    g.rect(9, 6, 2, 3, 'i');
    g.stamp(['w..w', 'wwww'], 8, 9);
  }),
};

function drawHourglass(g: PixelGrid, x: number, y: number): void {
  // Montants en bois
  g.rect(x, y, 9, 2, 'k').hline(x + 1, x + 7, y + 1, 'y');
  g.rect(x, y + 11, 9, 2, 'k').hline(x + 1, x + 7, y + 11, 'y');
  // Bulbe du haut (sable qui s'écoule)
  for (let i = 0; i < 4; i += 1) {
    const left = x + 1 + i;
    const right = x + 7 - i;
    g.set(left, y + 2 + i, 'k').set(right, y + 2 + i, 'k');
    g.hline(left + 1, right - 1, y + 2 + i, i === 0 ? 'c' : 'o');
  }
  g.set(x + 4, y + 6, 'o').set(x + 3, y + 6, 'k').set(x + 5, y + 6, 'k');
  // Bulbe du bas (tas de sable)
  for (let i = 0; i < 4; i += 1) {
    const left = x + 4 - (i + 1);
    const right = x + 4 + (i + 1);
    g.set(left, y + 7 + i, 'k').set(right, y + 7 + i, 'k');
    g.hline(left + 1, right - 1, y + 7 + i, i < 2 ? 'c' : 'o');
  }
  g.set(x + 4, y + 7, 'o').set(x + 4, y + 8, 'o');
}

const thinkingHourglass: PieceLayers = {
  front: layer((g) => drawHourglass(g, 0, 1)),
  icon: iconGrid(13, (g) => drawHourglass(g, 2, 0)),
};

const planBoard: PieceLayers = {
  front: layer((g) => {
    g.bevelBox(2, 23, 7, 9, { fill: 'w', outline: 'k', r: 0 });
    g.rect(4, 22, 3, 2, 'y').set(4, 22, 'k').set(6, 22, 'k');
    g.set(3, 25, 'g').hline(5, 7, 25, 'm');
    g.set(3, 27, 'g').hline(5, 7, 27, 'm');
    g.set(3, 29, 'r').hline(5, 6, 29, 'm');
  }),
};

const memoryPack: PieceLayers = {
  back: layer((g) => {
    g.bevelBox(10, 17, 20, 19, { fill: 'g', hi: 'l', lo: 't', r: 3 });
    g.rect(13, 33, 14, 2, 't');
  }),
  front: layer((g) => {
    g.rect(13, 19, 2, 10, 'g').vline(13, 19, 28, 'l');
    g.rect(25, 19, 2, 10, 'g').vline(25, 19, 28, 'l');
    g.rect(13, 24, 2, 2, 'y').rect(25, 24, 2, 2, 'y');
  }),
  icon: iconGrid(12, (g) => {
    g.bevelBox(1, 2, 10, 10, { fill: 'g', hi: 'l', lo: 't', r: 2 });
    g.rect(3, 0, 6, 3, 'k').rect(4, 1, 4, 2, '.');
    g.bevelBox(3, 6, 6, 4, { fill: 't', outline: 'k', r: 0 });
    g.set(5, 7, 'y').set(6, 7, 'y');
  }),
};

function cartridge(g: PixelGrid, x: number, y: number, color: string): void {
  g.rect(x, y, 6, 3, 'k');
  g.rect(x + 1, y, 5, 3, color);
  g.hline(x + 2, x + 4, y + 1, 'w');
  g.set(x + 5, y + 2, 'k');
}

const skillCartridges: PieceLayers = {
  front: layer((g) => {
    g.rect(29, 9, 2, 11, 'm').vline(29, 9, 19, 'i');
    cartridge(g, 31, 9, 'b');
    cartridge(g, 31, 13, 'r');
    cartridge(g, 31, 17, 'g');
  }),
  icon: iconGrid(12, (g) => {
    g.bevelBox(1, 0, 10, 12, { fill: 'b', hi: 's', lo: 'n', r: 1 });
    g.rect(3, 2, 6, 5, 'w').hline(4, 7, 3, 'm').hline(4, 6, 5, 'm');
    g.rect(2, 9, 8, 2, 'n');
    g.set(3, 10, 'y').set(5, 10, 'y').set(7, 10, 'y');
  }),
};

const harnessFrame: PieceLayers = {
  front: layer((g) => {
    g.bevelBox(7, 18, 8, 5, { fill: 'y', hi: 'w', lo: 'o', r: 1 });
    g.bevelBox(25, 18, 8, 5, { fill: 'y', hi: 'w', lo: 'o', r: 1 });
    g.rect(14, 32, 6, 2, 'o').hline(14, 19, 32, 'y');
    g.rect(20, 32, 6, 2, 'o').hline(20, 25, 32, 'y');
  }),
  icon: iconGrid(12, (g) => {
    g.bevelBox(0, 2, 12, 8, { fill: 'y', hi: 'w', lo: 'o', r: 2 });
    g.rect(5, 2, 2, 8, 'k').rect(5, 3, 2, 6, 'o');
  }),
};

const droneBay: PieceLayers = {
  front: layer((g) => {
    const drone = ['.kkkk.', 'mmkkmm', '.kiik.', 'kicwik', '.kiik.', '..kk..'];
    g.stamp(drone, 0, 14);
    g.stamp(drone, 34, 2);
  }),
  icon: iconGrid(12, (g) => {
    g.stamp(['.kkkkkk.', 'mmmkkmmm', '..kiik..', '.kiiiik.', 'kiccwiik', '.kiiiik.', '..kiik..', '...kk...'], 2, 2);
  }),
};

const protocolAntenna: PieceLayers = {
  front: layer((g) => {
    g.vline(26, 3, 8, 'k');
    g.vline(27, 3, 8, 'm');
    g.rect(25, 1, 3, 2, 'r').set(25, 1, 'o');
    g.set(29, 1, 'c').set(30, 2, 'c').set(29, 3, 'c');
    g.set(23, 1, 'c').set(22, 2, 'c').set(23, 3, 'c');
  }),
};

const evalBadge: PieceLayers = {
  front: layer((g) => {
    g.stamp(['bryb', 'bryb', '.yy.', 'yooy', 'yooy', '.yy.'], 13, 19);
  }),
  icon: iconGrid(12, (g) => {
    g.stamp(
      ['..bbrryy..', '..bbrryy..', '...brry...', '...kyyk...', '..kyyyyk..', '.kyyooyyk.', '.kyoooyyk.', '.kyyooyyk.', '..kyyyyk..', '...kkkk...'],
      1,
      1,
    );
  }),
};

const promptShield: PieceLayers = {
  front: layer((g) => {
    g.stamp(
      [
        'kkkkkkkk',
        'kwwwwwwk',
        'kwbbbbwk',
        'kwbyybwk',
        'kwbyybwk',
        'kwbbbbwk',
        '.kwbbwk.',
        '..kwwk..',
        '...kk...',
      ],
      30,
      24,
    );
  }),
};

const killSwitch: PieceLayers = {
  front: layer((g) => {
    g.stamp(['.kkkk.', 'krrrrk', 'krwrrk', 'kkkkkk', 'kykyky'], 6, 15);
  }),
  icon: iconGrid(12, (g) => {
    g.stamp(
      ['..kkkkkk..', '.krrrrrrk.', 'krrwwrrrrk', 'krwrrrrrrk', 'krrrrrrrrk', 'kkkkkkkkkk', 'kykykykyky', 'kykykykyky', 'kkkkkkkkkk'],
      1,
      1,
    );
  }),
};

const architectCape: PieceLayers = {
  back: layer((g) => {
    for (let y = 18; y <= 36; y += 1) {
      const spread = Math.min(14, 9 + Math.floor((y - 18) / 3));
      g.hline(20 - spread, 19 + spread, y, 'p');
    }
    // Ourlet dentelé et plis
    for (let x = 6; x <= 33; x += 2) g.set(x, 37, 'p');
    g.vline(8, 27, 36, 'r').vline(31, 27, 36, 'r');
    g.vline(7, 31, 36, 'r').vline(32, 31, 36, 'r');
    g.outline('k');
  }),
  front: layer((g) => {
    g.stamp(['rrr.', 'rrrr', '.rrr'], 11, 18);
    g.stamp(['.rrr', 'rrrr', 'rrr.'], 25, 18);
    g.rect(19, 18, 2, 2, 'y');
  }),
  icon: iconGrid(12, (g) => {
    for (let y = 1; y <= 10; y += 1) {
      const spread = Math.min(6, 2 + Math.floor(y / 2));
      g.hline(6 - spread, 5 + spread, y, y === 10 ? 'r' : 'p');
    }
    g.rect(5, 1, 2, 2, 'y');
    g.outline('k');
  }),
};

export const PIECE_LAYERS: Record<string, PieceLayers> = {
  'context-gauge': contextGauge,
  'loop-engine': loopEngine,
  'tool-belt': toolBelt,
  'thinking-hourglass': thinkingHourglass,
  'plan-board': planBoard,
  'memory-pack': memoryPack,
  'skill-cartridges': skillCartridges,
  'harness-frame': harnessFrame,
  'drone-bay': droneBay,
  'protocol-antenna': protocolAntenna,
  'eval-badge': evalBadge,
  'prompt-shield': promptShield,
  'kill-switch': killSwitch,
  'architect-cape': architectCape,
};

/** Ordre d'empilement des calques arrière (le premier est le plus au fond). */
export const BACK_ORDER = ['architect-cape', 'loop-engine', 'memory-pack'];
/** Ordre d'empilement des calques avant. */
export const FRONT_ORDER = [
  'architect-cape',
  'memory-pack',
  'context-gauge',
  'eval-badge',
  'tool-belt',
  'harness-frame',
  'kill-switch',
  'skill-cartridges',
  'plan-board',
  'prompt-shield',
  'protocol-antenna',
  'thinking-hourglass',
  'drone-bay',
];
