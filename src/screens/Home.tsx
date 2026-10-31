import { useState } from 'react';
import { LEVELS, getLevel } from '../content/levels';
import { PHASE_LABELS } from '../content/types';
import { useGame } from '../game/GameContext';
import { HARNESS_PIECES, getPiece, type HarnessPiece } from '../game/harness';
import { completedCount, currentLevel, isLevelCompleted, resumePhase } from '../game/state';
import { generateFlashcards } from '../game/review';
import { CARDS } from '../content/levels';
import { href, navigate } from '../router';
import { BobSprite } from '../sprites/BobSprite';
import { pieceIcon } from '../sprites/icons';
import { silhouette } from '../sprites/pixel';
import { DialogueBox, ProgressBar, Segments, Typewriter } from '../ui/components';
import { Icon, SpriteIcon } from '../ui/Icon';
import { T } from '../ui/typography';
import './Home.css';

const INTRO = [
  'Salut ! Moi, c’est Bob Morris. Mon cerveau est un grand modèle de langage, et il ne changera jamais, du premier au dernier niveau.',
  'Pour devenir un vrai agent, je n’ai pas besoin d’un cerveau plus gros : j’ai besoin d’un harnais. Des outils, une mémoire, une boucle, des garde-fous…',
  'À toi de me l’assembler, pièce par pièce. Chaque niveau commence par un de mes échecs. On commence ?',
];

function Slot({
  piece,
  owned,
  selected,
  onSelect,
}: {
  piece: HarnessPiece;
  owned: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const level = getLevel(piece.levelId);
  const icon = pieceIcon(piece.id);
  const label = owned ? piece.name : `${piece.name} (niveau ${level?.badge}, à débloquer)`;
  return (
    <li>
      <button
        type="button"
        className={['slot', owned ? 'slot--owned' : 'slot--locked', selected ? 'slot--selected' : ''].join(' ')}
        aria-label={label}
        aria-pressed={selected}
        title={label}
        onClick={onSelect}
      >
        {icon ? <SpriteIcon sprite={owned ? icon : silhouette(icon)} size={40} /> : null}
        <span className="slot__badge">{level?.badge}</span>
      </button>
    </li>
  );
}

function PieceDetail({ piece, owned }: { piece: HarnessPiece; owned: boolean }) {
  const level = getLevel(piece.levelId);
  const icon = pieceIcon(piece.id);
  return (
    <div className={`piece-detail ${owned ? '' : 'piece-detail--locked'}`} aria-live="polite">
      <div className="piece-detail__icon">{icon ? <SpriteIcon sprite={owned ? icon : silhouette(icon, 'm')} size={56} /> : null}</div>
      <div className="piece-detail__text">
        <h2>
          <T>{piece.name}</T>
        </h2>
        <p className="muted">
          Niveau {level?.badge} · <T>{level?.title ?? ''}</T>
        </p>
        <p>
          <T>{piece.role}</T>
        </p>
        {owned ? (
          <p className="piece-detail__real">
            <b>Dans un vrai harnais :</b> <T>{piece.realWorld}</T>
          </p>
        ) : (
          <p className="piece-detail__real">
            <Icon name="lock" size={12} /> Se débloque en terminant le niveau {level?.badge}.
          </p>
        )}
      </div>
    </div>
  );
}

export function Home() {
  const { save, dispatch, xp, rank } = useGame();
  const owned = new Set(save.pieces);
  const lastOwned = save.pieces[save.pieces.length - 1];
  const [selectedId, setSelectedId] = useState<string>(lastOwned ?? HARNESS_PIECES[0]!.id);
  const [introStep, setIntroStep] = useState(0);
  const [lineDone, setLineDone] = useState(false);
  const selected = getPiece(selectedId) ?? HARNESS_PIECES[0]!;
  const current = currentLevel(save);
  const done = completedCount(save);
  const flashcards = generateFlashcards(CARDS.filter((c) => save.cards.includes(c.id)));
  const left = HARNESS_PIECES.filter((p) => p.side === 'left');
  const right = HARNESS_PIECES.filter((p) => p.side === 'right');
  const nextPiece = HARNESS_PIECES.find((p) => !owned.has(p.id));
  const showIntro = !save.flags.introSeen && Object.keys(save.levels).length === 0;

  const startLevel = (levelId: string) => {
    if (showIntro) dispatch({ type: 'intro/seen' });
    navigate({ name: 'level', levelId });
  };

  let dialogue: { text: string; actions: React.ReactNode };
  if (showIntro) {
    const last = introStep >= INTRO.length - 1;
    dialogue = {
      text: INTRO[introStep] ?? '',
      actions: last ? (
        <>
          <button type="button" className="btn" onClick={() => startLevel('l0')}>
            <Icon name="play" size={12} /> Commencer le niveau 0
          </button>
          <button type="button" className="btn btn--secondary" onClick={() => { dispatch({ type: 'intro/seen' }); navigate({ name: 'map' }); }}>
            Voir la carte
          </button>
        </>
      ) : (
        <button type="button" className="btn btn--secondary" onClick={() => { setIntroStep((s) => s + 1); setLineDone(false); }}>
          Suite <Icon name="arrow-right" size={12} />
        </button>
      ),
    };
  } else if (current.content && !isLevelCompleted(save, current.id)) {
    const phase = resumePhase(save, current.id);
    const started = (save.levels[current.id]?.reached ?? 0) > 0;
    dialogue = {
      text: started
        ? `On reprend ? Niveau ${current.badge} : « ${current.title} ». Prochaine étape : ${PHASE_LABELS[phase].toLowerCase()}.`
        : `Prochaine mission : niveau ${current.badge}, « ${current.title} ». Je vais encore me planter, c’est le principe !`,
      actions: (
        <button type="button" className="btn" onClick={() => startLevel(current.id)}>
          <Icon name="play" size={12} /> {started ? 'Continuer' : `Jouer le niveau ${current.badge}`}
        </button>
      ),
    };
  } else {
    dialogue = {
      text: `Mon harnais compte ${save.pieces.length} pièce${save.pieces.length > 1 ? 's' : ''}, et mon cerveau n’a pas changé d’un octet. La suite, le niveau ${current.badge} (« ${current.title} »), est en construction. En attendant, révise tes cartes !`,
      actions: (
        <>
          <a className="btn" href={href({ name: 'review' })}>
            <Icon name="review" size={12} /> Réviser
          </a>
          <a className="btn btn--secondary" href={href({ name: 'map' })}>
            Voir la carte
          </a>
        </>
      ),
    };
  }

  return (
    <div className="home">
      <section className="bay frame frame--raised" aria-labelledby="bay-title">
        <div className="bay__head">
          <h1 id="bay-title">L’atelier de Bob</h1>
          <p className="brain-plate">
            <Icon name="lock" size={12} />
            <span>
              Cerveau : <b>modèle B-1</b>, jamais modifié
            </span>
          </p>
        </div>

        <div className="bay__stage">
          <ul className="slots" aria-label="Emplacements de harnais, côté gauche">
            {left.map((p) => (
              <Slot key={p.id} piece={p} owned={owned.has(p.id)} selected={p.id === selected.id} onSelect={() => setSelectedId(p.id)} />
            ))}
          </ul>
          <div className="bay__bob">
            <BobSprite pieces={save.pieces} mood={save.pieces.length ? 'happy' : 'neutral'} scale={9} highlight={selected.id} />
            <div className="bay__platform" aria-hidden="true" />
          </div>
          <ul className="slots" aria-label="Emplacements de harnais, côté droit">
            {right.map((p) => (
              <Slot key={p.id} piece={p} owned={owned.has(p.id)} selected={p.id === selected.id} onSelect={() => setSelectedId(p.id)} />
            ))}
          </ul>
        </div>

        <div className="bay__meter">
          <span>
            Harnais : <b>{save.pieces.length}</b> / {HARNESS_PIECES.length} pièces
          </span>
          <Segments total={HARNESS_PIECES.length} done={save.pieces.length} next label={`${save.pieces.length} pièces sur ${HARNESS_PIECES.length}`} />
        </div>

        <PieceDetail piece={selected} owned={owned.has(selected.id)} />
      </section>

      <aside className="home__side">
        <DialogueBox speaker="Bob Morris">
          <Typewriter key={dialogue.text} text={dialogue.text} onDone={() => setLineDone(true)} />
          <div className={`dialogue__actions ${showIntro && !lineDone ? 'dialogue__actions--waiting' : ''}`}>{dialogue.actions}</div>
        </DialogueBox>

        <section className="frame panel stats" aria-labelledby="stats-title">
          <h2 id="stats-title">Progression</h2>
          <div className="stats__rank">
            <span>
              Rang : <b>{rank.title}</b>
            </span>
            <span className="muted">{rank.next ? `${xp} / ${rank.next.min} XP` : `${xp} XP`}</span>
          </div>
          <ProgressBar value={rank.progress} label="Progression vers le rang suivant" variant="xp" />
          <dl className="stats__list">
            <div>
              <dt>Niveaux terminés</dt>
              <dd>
                {done} / {LEVELS.length}
              </dd>
            </div>
            <div>
              <dt>Cartes de glossaire</dt>
              <dd>{save.cards.length}</dd>
            </div>
            <div>
              <dt>Flashcards maîtrisées</dt>
              <dd>
                {save.review.mastered.length} / {flashcards.length}
              </dd>
            </div>
          </dl>
        </section>

        <section className="frame panel skills" aria-labelledby="skills-title">
          <h2 id="skills-title">Ce que je sais faire</h2>
          {save.pieces.length === 0 ? (
            <p className="muted">Pour l’instant, je ne sais que prédire du texte. Équipe-moi !</p>
          ) : (
            <ul>
              {HARNESS_PIECES.filter((p) => owned.has(p.id)).map((p) => (
                <li key={p.id}>
                  <Icon name="check" size={12} className="skills__check" />
                  <T>{p.capability}</T>
                </li>
              ))}
            </ul>
          )}
          {nextPiece ? (
            <p className="skills__next">
              Prochaine pièce : <b>{nextPiece.name}</b> (niveau {getLevel(nextPiece.levelId)?.badge})
            </p>
          ) : null}
        </section>
      </aside>
    </div>
  );
}
