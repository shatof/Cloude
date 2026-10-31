import { useState } from 'react';
import { LEVELS, ZONES, getLevel } from '../content/levels';
import { PHASE_LABELS, type LevelDefinition, type ZoneId } from '../content/types';
import { useGame } from '../game/GameContext';
import { getPiece } from '../game/harness';
import { completedCount, currentLevel, levelStatus, progressOf, resumePhase, type LevelStatus } from '../game/state';
import { navigate } from '../router';
import { pieceIcon } from '../sprites/icons';
import { LANDMARKS } from '../sprites/landmarks';
import { PixelArt } from '../sprites/PixelArt';
import { silhouette } from '../sprites/pixel';
import { ProgressBar, Segments } from '../ui/components';
import { Icon, SpriteIcon } from '../ui/Icon';
import { T } from '../ui/typography';
import { BobSprite } from '../sprites/BobSprite';
import './LevelMap.css';

/** Coordonnées des nœuds dans un repère 1000 × 660 (trois rangées en serpentin, du bas vers le haut). */
const MAP_W = 1000;
const MAP_H = 660;
const ROW_Y = { top: 120, middle: 330, bottom: 540 };
const NODE_POS: [number, number][] = [
  [140, ROW_Y.bottom],
  [320, ROW_Y.bottom],
  [500, ROW_Y.bottom],
  [680, ROW_Y.bottom],
  [860, ROW_Y.bottom],
  [860, ROW_Y.middle],
  [680, ROW_Y.middle],
  [500, ROW_Y.middle],
  [320, ROW_Y.middle],
  [140, ROW_Y.middle],
  [140, ROW_Y.top],
  [320, ROW_Y.top],
  [500, ROW_Y.top],
  [760, ROW_Y.top],
];

const BAND_H = 190;
const band = (y: number) => y - BAND_H / 2;

const ZONE_RECTS: { zone: ZoneId; x: number; y: number; w: number; h: number; landmarkBottom?: boolean }[] = [
  { zone: 'fondations', x: 60, y: band(ROW_Y.bottom), w: 350, h: BAND_H },
  { zone: 'atelier', x: 410, y: band(ROW_Y.bottom), w: 530, h: BAND_H },
  { zone: 'archipel', x: 60, y: band(ROW_Y.middle), w: 350, h: BAND_H },
  { zone: 'forge', x: 410, y: band(ROW_Y.middle), w: 180, h: BAND_H },
  { zone: 'bibliotheque', x: 590, y: band(ROW_Y.middle), w: 350, h: BAND_H },
  { zone: 'observatoire', x: 60, y: band(ROW_Y.top), w: 170, h: BAND_H, landmarkBottom: true },
  { zone: 'citadelle', x: 230, y: band(ROW_Y.top), w: 360, h: BAND_H },
  { zone: 'sommet', x: 590, y: band(ROW_Y.top), w: 350, h: BAND_H },
];

function pathThrough(points: [number, number][]): string {
  const d: string[] = [];
  points.forEach(([x, y], i) => {
    if (i === 0) {
      d.push(`M${x} ${y}`);
      return;
    }
    const [px, py] = points[i - 1] as [number, number];
    if (py !== y) {
      // Virage en U au bout de la rangée
      const edge = px > 500 ? 975 : 25;
      d.push(`H${edge} V${y} H${x}`);
    } else {
      d.push(`H${x}`);
    }
  });
  return d.join(' ');
}

const STATUS_LABEL: Record<LevelStatus, string> = {
  completed: 'Terminé',
  'in-progress': 'En cours',
  available: 'Disponible',
  locked: 'Verrouillé',
  'coming-soon': 'Contenu à venir',
};

function LevelDetail({ level }: { level: LevelDefinition }) {
  const { save } = useGame();
  const status = levelStatus(save, level);
  const piece = getPiece(level.harnessPieceId);
  const icon = piece ? pieceIcon(piece.id) : undefined;
  const owned = piece ? save.pieces.includes(piece.id) : false;
  const progress = progressOf(save, level.id);
  const phase = resumePhase(save, level.id);

  let action: React.ReactNode;
  if (status === 'coming-soon') {
    action = (
      <p className="level-detail__soon">
        <Icon name="hammer" size={16} /> Ce niveau est en construction : son titre et son concept sont déjà là, le contenu arrive bientôt.
      </p>
    );
  } else if (status === 'locked') {
    const previous = LEVELS[level.order - 1];
    action = (
      <p className="level-detail__soon">
        <Icon name="lock" size={16} /> Termine d’abord le niveau {previous?.badge} pour débloquer celui-ci.
      </p>
    );
  } else {
    const label = status === 'completed' ? 'Rejouer' : status === 'in-progress' ? `Reprendre (${PHASE_LABELS[phase].toLowerCase()})` : 'Jouer';
    action = (
      <button type="button" className="btn btn--block" onClick={() => navigate({ name: 'level', levelId: level.id })}>
        <Icon name="play" size={12} /> {label}
      </button>
    );
  }

  return (
    <aside className="level-detail frame frame--raised" aria-live="polite">
      <div className="level-detail__head">
        <span className={`level-badge level-badge--${status}`}>{level.badge}</span>
        <div>
          <p className="level-detail__zone">{ZONES[level.zone].name}</p>
          <h2>
            <T>{level.title}</T>
          </h2>
        </div>
      </div>
      <p className="level-detail__concept">
        <T>{level.concept}</T>
      </p>
      <dl className="level-detail__facts">
        <div>
          <dt>Statut</dt>
          <dd className={`status status--${status}`}>{STATUS_LABEL[status]}</dd>
        </div>
        {level.content ? (
          <div>
            <dt>Étapes</dt>
            <dd>
              <Segments total={5} done={progress.rewardClaimed ? 5 : progress.reached} label={`${progress.reached} étapes sur 5`} />
            </dd>
          </div>
        ) : null}
        <div>
          <dt>Récompense</dt>
          <dd className="level-detail__reward">
            {icon ? <SpriteIcon sprite={owned ? icon : silhouette(icon, 'm')} size={36} /> : null}
            <span>{piece?.name}</span>
          </dd>
        </div>
      </dl>
      {action}
    </aside>
  );
}

export function LevelMap({ selectedId }: { selectedId?: string }) {
  const { save, xp, rank } = useGame();
  const current = currentLevel(save);
  const [selected, setSelected] = useState<string>(selectedId && getLevel(selectedId) ? selectedId : current.id);
  const done = completedCount(save);
  const selectedLevel = getLevel(selected) ?? current;
  const fullPath = pathThrough(NODE_POS);
  const donePath = pathThrough(NODE_POS.slice(0, Math.max(1, current.order + 1)));
  const [bobX, bobY] = NODE_POS[current.order] ?? NODE_POS[0]!;
  const hasUpcoming = LEVELS.some((l) => levelStatus(save, l) === 'coming-soon');

  return (
    <div className="map-screen">
      <div className="page-head">
        <div>
          <h1>Carte des niveaux</h1>
          <p>Du token à l’architecte : treize niveaux et un boss final. Chaque niveau terminé fixe une pièce sur le harnais de Bob.</p>
        </div>
        <div className="map-progress">
          <div className="map-progress__row">
            <span>
              Niveaux : <b>{done}</b> / {LEVELS.length}
            </span>
            <span className="muted">{xp} XP · {rank.title}</span>
          </div>
          <ProgressBar value={done / LEVELS.length} label="Niveaux terminés" />
        </div>
      </div>

      <div className="map-layout">
        <div className="map frame">
          <div className="map__canvas">
            <svg className="map__svg" viewBox={`0 0 ${MAP_W} ${MAP_H}`} aria-hidden="true" shapeRendering="crispEdges">
              {ZONE_RECTS.map((z) => (
                <g key={z.zone} className={`zone zone--${z.zone}`}>
                  <rect x={z.x} y={z.y} width={z.w} height={z.h} />
                  <text x={z.x + 12} y={z.y + 24}>
                    {ZONES[z.zone].name}
                  </text>
                </g>
              ))}
              <path d={fullPath} className="map__path" />
              <path d={donePath} className="map__path map__path--done" />
            </svg>
            {ZONE_RECTS.map((z) => (
              <div
                key={z.zone}
                className="map__landmark"
                style={{ left: `${((z.x + z.w - 12) / MAP_W) * 100}%`, top: `${((z.landmarkBottom ? z.y + z.h - 50 : z.y + 10) / MAP_H) * 100}%` }}
              >
                <PixelArt layers={[LANDMARKS[z.zone]]} scale={2} />
              </div>
            ))}
            {LEVELS.map((level, i) => {
              const [x, y] = NODE_POS[i] ?? [0, 0];
              const status = levelStatus(save, level);
              return (
                <button
                  key={level.id}
                  type="button"
                  className={['node', `node--${status}`, level.id === selected ? 'node--selected' : '', level.id === 'final' ? 'node--final' : ''].join(' ')}
                  style={{ left: `${(x / MAP_W) * 100}%`, top: `${(y / MAP_H) * 100}%` }}
                  onClick={() => setSelected(level.id)}
                  onDoubleClick={() => {
                    if (status !== 'locked' && status !== 'coming-soon') navigate({ name: 'level', levelId: level.id });
                  }}
                  aria-pressed={level.id === selected}
                  aria-label={`Niveau ${level.badge} : ${level.title} (${STATUS_LABEL[status]})`}
                >
                  <span className="node__badge">
                    {level.badge}
                    {status === 'completed' ? <Icon name="star" size={12} className="node__corner node__corner--star" /> : null}
                    {status === 'locked' ? <Icon name="lock" size={12} className="node__corner" /> : null}
                    {status === 'coming-soon' ? <Icon name="hammer" size={12} className="node__corner" /> : null}
                  </span>
                  <span className="node__label">{level.shortTitle}</span>
                </button>
              );
            })}
            <div className="map__bob" style={{ left: `${(bobX / MAP_W) * 100}%`, top: `${(bobY / MAP_H) * 100}%` }} aria-hidden="true">
              <BobSprite pieces={save.pieces} mood="happy" scale={2} title="" />
            </div>
          </div>
          <ul className="map__legend" aria-label="Légende">
            <li>
              <span className="legend-swatch legend-swatch--available" /> Disponible
            </li>
            <li>
              <span className="legend-swatch legend-swatch--completed" /> Terminé
            </li>
            <li>
              <Icon name="lock" size={12} /> Verrouillé
            </li>
            {hasUpcoming ? (
              <li>
                <Icon name="hammer" size={12} /> Contenu à venir
              </li>
            ) : null}
            <li className="muted">Double-clic sur un niveau pour le lancer.</li>
          </ul>
        </div>
        <LevelDetail level={selectedLevel} />
      </div>
    </div>
  );
}
