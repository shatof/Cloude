/**
 * Moteur de pixel art minimal.
 *
 * Un sprite est une grille de caractères : chaque caractère est une couleur de la
 * palette (Sweetie 16), « . » est transparent et « x » prend la couleur courante (CSS).
 * Les sprites sont construits une fois au chargement du module, de façon déterministe.
 */

export const PALETTE: Record<string, string> = {
  k: '#1a1c2c', // encre
  p: '#5d275d', // prune
  r: '#b13e53', // framboise
  o: '#ef7d57', // corail
  y: '#ffcd75', // or
  l: '#a7f070', // citron vert
  g: '#38b764', // vert
  t: '#257179', // sarcelle
  n: '#29366f', // marine
  b: '#3b5dc9', // bleu
  s: '#41a6f6', // ciel
  c: '#73eff7', // cyan
  w: '#f4f4f4', // blanc
  i: '#94b0c2', // acier
  m: '#566c86', // ardoise
  d: '#333c57', // nuit
  x: 'currentColor',
};

export interface Sprite {
  w: number;
  h: number;
  rows: string[];
}

export function spriteFromRows(rows: string[]): Sprite {
  const w = Math.max(...rows.map((r) => r.length));
  return { w, h: rows.length, rows: rows.map((r) => r.padEnd(w, '.')) };
}

export class PixelGrid {
  readonly w: number;
  readonly h: number;
  private cells: string[][];

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.cells = Array.from({ length: h }, () => new Array<string>(w).fill('.'));
  }

  get(x: number, y: number): string {
    return this.cells[y]?.[x] ?? '.';
  }

  set(x: number, y: number, c: string): this {
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) (this.cells[y] as string[])[x] = c;
    return this;
  }

  rect(x: number, y: number, w: number, h: number, c: string): this {
    for (let j = y; j < y + h; j += 1) for (let i = x; i < x + w; i += 1) this.set(i, j, c);
    return this;
  }

  hline(x0: number, x1: number, y: number, c: string): this {
    for (let i = Math.min(x0, x1); i <= Math.max(x0, x1); i += 1) this.set(i, y, c);
    return this;
  }

  vline(x: number, y0: number, y1: number, c: string): this {
    for (let j = Math.min(y0, y1); j <= Math.max(y0, y1); j += 1) this.set(x, j, c);
    return this;
  }

  /** Dessine une grille de caractères (« . » = transparent) à la position donnée. */
  stamp(rows: string[], x: number, y: number): this {
    rows.forEach((row, j) => {
      for (let i = 0; i < row.length; i += 1) {
        const c = row[i] as string;
        if (c !== '.' && c !== ' ') this.set(x + i, y + j, c);
      }
    });
    return this;
  }

  /**
   * Rectangle aux coins biseautés, avec contour, remplissage et relief.
   * `r` = taille du biseau (0 = angles droits).
   */
  bevelBox(
    x: number,
    y: number,
    w: number,
    h: number,
    opts: { fill: string; outline?: string; hi?: string; lo?: string; r?: number },
  ): this {
    const r = opts.r ?? 1;
    const outline = opts.outline ?? 'k';
    const inside = (i: number, j: number) => {
      if (i < 0 || j < 0 || i >= w || j >= h) return false;
      const cx = Math.min(i, w - 1 - i);
      const cy = Math.min(j, h - 1 - j);
      return cx + cy >= r;
    };
    for (let j = 0; j < h; j += 1) {
      for (let i = 0; i < w; i += 1) {
        if (!inside(i, j)) continue;
        const edge = !inside(i - 1, j) || !inside(i + 1, j) || !inside(i, j - 1) || !inside(i, j + 1);
        let c = edge ? outline : opts.fill;
        if (!edge) {
          const nearTop = !inside(i, j - 2) || !inside(i - 1, j - 1) || !inside(i + 1, j - 1);
          const nearLeft = !inside(i - 2, j);
          const nearBottom = !inside(i, j + 2) || !inside(i - 1, j + 1) || !inside(i + 1, j + 1);
          const nearRight = !inside(i + 2, j);
          if (opts.lo && (nearBottom || nearRight)) c = opts.lo;
          else if (opts.hi && (nearTop || nearLeft)) c = opts.hi;
        }
        this.set(x + i, y + j, c);
      }
    }
    return this;
  }

  /** Anneau (cercle épais) centré en (cx, cy), coordonnées continues. */
  ring(cx: number, cy: number, radius: number, thickness: number, c: string): this {
    for (let j = 0; j < this.h; j += 1) {
      for (let i = 0; i < this.w; i += 1) {
        const d = Math.hypot(i + 0.5 - cx, j + 0.5 - cy);
        if (d <= radius && d > radius - thickness) this.set(i, j, c);
      }
    }
    return this;
  }

  /** Disque plein. */
  disc(cx: number, cy: number, radius: number, c: string): this {
    for (let j = 0; j < this.h; j += 1) {
      for (let i = 0; i < this.w; i += 1) {
        if (Math.hypot(i + 0.5 - cx, j + 0.5 - cy) <= radius) this.set(i, j, c);
      }
    }
    return this;
  }

  /** Entoure de `c` tous les pixels opaques (contour extérieur). */
  outline(c = 'k'): this {
    const add: [number, number][] = [];
    for (let j = 0; j < this.h; j += 1) {
      for (let i = 0; i < this.w; i += 1) {
        if (this.get(i, j) !== '.') continue;
        const touches =
          this.isOpaque(i - 1, j) || this.isOpaque(i + 1, j) || this.isOpaque(i, j - 1) || this.isOpaque(i, j + 1);
        if (touches) add.push([i, j]);
      }
    }
    for (const [i, j] of add) this.set(i, j, c);
    return this;
  }

  private isOpaque(x: number, y: number): boolean {
    const v = this.get(x, y);
    return v !== '.' && v !== 'k';
  }

  /** Efface (rend transparent) les pixels d'une zone. */
  clear(x: number, y: number, w: number, h: number): this {
    return this.rect(x, y, w, h, '.');
  }

  toSprite(): Sprite {
    return { w: this.w, h: this.h, rows: this.cells.map((row) => row.join('')) };
  }
}

export interface PixelRun {
  x: number;
  y: number;
  w: number;
  color: string;
}

/** Fusionne les pixels consécutifs de même couleur sur une ligne (moins de rectangles SVG). */
export function spriteRuns(sprite: Sprite): PixelRun[] {
  const runs: PixelRun[] = [];
  sprite.rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x] as string;
      if (c === '.' || c === ' ') {
        x += 1;
        continue;
      }
      let end = x + 1;
      while (end < row.length && row[end] === c) end += 1;
      runs.push({ x, y, w: end - x, color: PALETTE[c] ?? '#ff00ff' });
      x = end;
    }
  });
  return runs;
}

/** Boîte englobante des pixels opaques d'un sprite (null si vide). */
export function spriteBounds(sprite: Sprite): { x: number; y: number; w: number; h: number } | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -1;
  let maxY = -1;
  sprite.rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x += 1) {
      if (row[x] !== '.' && row[x] !== ' ') {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  });
  return maxX < 0 ? null : { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

/** Recadre un sprite sur une zone. */
export function cropSprite(sprite: Sprite, x: number, y: number, w: number, h: number): Sprite {
  const rows: string[] = [];
  for (let j = y; j < y + h; j += 1) {
    let row = '';
    for (let i = x; i < x + w; i += 1) row += sprite.rows[j]?.[i] ?? '.';
    rows.push(row);
  }
  return { w, h, rows };
}

/** Version « silhouette » d'un sprite (pièces pas encore débloquées). */
export function silhouette(sprite: Sprite, color = 'd'): Sprite {
  return { ...sprite, rows: sprite.rows.map((r) => r.replace(/[^. ]/g, color)) };
}
