import { HARNESS_PIECES } from '../game/harness';
import { BOB_FACES } from '../sprites/bob';
import { BobSprite } from '../sprites/BobSprite';
import { BOSS_SPRITES } from '../sprites/bosses';
import { ICONS, pieceIcon } from '../sprites/icons';
import { PixelArt } from '../sprites/PixelArt';
import type { BobMood } from '../content/types';

/**
 * Galerie des sprites (route cachée #/atelier-sprites).
 * Pratique pour dessiner les pièces et boss des prochains niveaux.
 */
export function SpriteGallery() {
  const all = HARNESS_PIECES.map((p) => p.id);
  return (
    <main className="gallery">
      <h1>Galerie des sprites</h1>
      <section>
        <h2>Bob : nu, à mi-parcours, complet</h2>
        <div className="gallery__row">
          <BobSprite pieces={[]} scale={8} idle={false} />
          <BobSprite pieces={all.slice(0, 7)} scale={8} idle={false} />
          <BobSprite pieces={all} scale={8} idle={false} />
        </div>
      </section>
      <section>
        <h2>Humeurs</h2>
        <div className="gallery__row">
          {(Object.keys(BOB_FACES) as BobMood[]).map((m) => (
            <figure key={m}>
              <BobSprite pieces={['context-gauge', 'loop-engine']} mood={m} scale={4} idle={false} />
              <figcaption>{m}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section>
        <h2>Une pièce à la fois</h2>
        <div className="gallery__row">
          {HARNESS_PIECES.map((p) => {
            const icon = pieceIcon(p.id);
            return (
              <figure key={p.id}>
                <BobSprite pieces={[p.id]} scale={4} idle={false} />
                {icon ? <PixelArt layers={[icon]} width={48} /> : null}
                <figcaption>{p.name}</figcaption>
              </figure>
            );
          })}
        </div>
      </section>
      <section>
        <h2>Boss</h2>
        <div className="gallery__row">
          {Object.entries(BOSS_SPRITES).map(([id, sprite]) => (
            <figure key={id}>
              <PixelArt layers={[sprite]} scale={8} />
              <figcaption>{id}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section>
        <h2>Icônes</h2>
        <div className="gallery__row">
          {Object.entries(ICONS).map(([id, sprite]) => (
            <figure key={id} style={{ color: '#ffcd75' }}>
              <PixelArt layers={[sprite]} scale={4} />
              <figcaption>{id}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
