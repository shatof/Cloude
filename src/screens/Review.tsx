import { useMemo, useState } from 'react';
import { CARDS, getCard } from '../content/levels';
import { useGame } from '../game/GameContext';
import {
  KIND_LABELS,
  MAX_BOX,
  QUICK_MIN_CARDS,
  boxDistribution,
  boxOf,
  buildFreeSession,
  buildQuickQuiz,
  buildSession,
  generateFlashcards,
  type Flashcard,
  type QuickQuestion,
} from '../game/review';
import { href } from '../router';
import { BobSprite } from '../sprites/BobSprite';
import { Icon } from '../ui/Icon';
import { RichText, T } from '../ui/typography';
import './Review.css';

type Mode =
  | { kind: 'menu' }
  | { kind: 'cards'; leitner: boolean; deck: Flashcard[]; index: number; flipped: boolean; known: number; missed: string[] }
  | { kind: 'quick'; questions: QuickQuestion[]; index: number; picked: string | null; score: number }
  | { kind: 'done'; title: string; lines: string[] };

const BOX_HINT = ['à chaque session', '1 session sur 2', '1 session sur 4', '1 session sur 8', 'maîtrisée'];

export function Review() {
  const { save, dispatch, sfx } = useGame();
  const cards = useMemo(() => CARDS.filter((c) => save.cards.includes(c.id)), [save.cards]);
  const flashcards = useMemo(() => generateFlashcards(cards), [cards]);
  const due = useMemo(() => buildSession(flashcards, save.review), [flashcards, save.review]);
  const distribution = boxDistribution(flashcards, save.review);
  const [mode, setMode] = useState<Mode>({ kind: 'menu' });
  const [freeRuns, setFreeRuns] = useState(0);

  if (cards.length === 0) {
    return (
      <div className="review">
        <div className="page-head">
          <div>
            <h1>Révision</h1>
            <p>Les flashcards sont générées à partir de tes cartes de glossaire.</p>
          </div>
        </div>
        <div className="review__empty frame panel">
          <BobSprite pieces={save.pieces} mood="thinking" scale={5} />
          <div>
            <h2>Pas encore de cartes à réviser</h2>
            <p className="muted">Termine le niveau 0 pour gagner tes trois premières cartes : elles deviendront neuf flashcards.</p>
            <a className="btn" href={href({ name: 'level', levelId: 'l0' })}>
              <Icon name="play" size={12} /> Jouer le niveau 0
            </a>
          </div>
        </div>
      </div>
    );
  }

  const startCards = (leitner: boolean) => {
    const deck = leitner ? due : buildFreeSession(flashcards, `libre:${save.review.session}:${freeRuns}`);
    if (!leitner) setFreeRuns((n) => n + 1);
    if (deck.length === 0) return;
    sfx('page');
    setMode({ kind: 'cards', leitner, deck, index: 0, flipped: false, known: 0, missed: [] });
  };

  const startQuick = () => {
    const questions = buildQuickQuiz(cards, `eclair:${save.review.session}:${save.review.mastered.length}`);
    if (questions.length === 0) return;
    sfx('page');
    setMode({ kind: 'quick', questions, index: 0, picked: null, score: 0 });
  };

  return (
    <div className="review">
      <div className="page-head">
        <div>
          <h1>Révision</h1>
          <p>
            {flashcards.length} flashcards générées à partir de tes {cards.length} cartes. Celles que tu connais reviennent de moins en moins
            souvent ; celles que tu rates reviennent tout de suite.
          </p>
        </div>
        {mode.kind !== 'menu' ? (
          <button type="button" className="btn btn--ghost" onClick={() => setMode({ kind: 'menu' })}>
            <Icon name="arrow-left" size={12} /> Retour
          </button>
        ) : null}
      </div>

      {mode.kind === 'menu' ? (
        <div className="review__menu">
          <section className="frame panel review__boxes" aria-labelledby="boxes-title">
            <h2 id="boxes-title">Tes boîtes de Leitner</h2>
            <ol className="boxes">
              {distribution.map((count, i) => (
                <li key={i} className={`boxes__box ${i === MAX_BOX - 1 ? 'boxes__box--last' : ''}`}>
                  <span className="boxes__stack" style={{ height: `${Math.max(6, Math.round((count / Math.max(1, flashcards.length)) * 120))}px` }} />
                  <b>{count}</b>
                  <span className="boxes__label">Boîte {i + 1}</span>
                  <span className="boxes__hint">{BOX_HINT[i]}</span>
                </li>
              ))}
            </ol>
            <p className="muted">
              Session n° {save.review.session + 1} · {save.review.mastered.length} flashcard{save.review.mastered.length > 1 ? 's' : ''} maîtrisée
              {save.review.mastered.length > 1 ? 's' : ''} (+5 XP chacune, une seule fois).
            </p>
          </section>

          <div className="review__modes">
            <section className="frame panel mode-card">
              <h2>
                <Icon name="review" size={16} /> Session du jour
              </h2>
              <p>
                {due.length > 0
                  ? `${due.length} flashcard${due.length > 1 ? 's' : ''} à revoir maintenant, des moins sues aux mieux sues.`
                  : 'Rien à revoir pour cette session : reviens plus tard, ou lance une session libre.'}
              </p>
              <button type="button" className="btn" onClick={() => startCards(true)} disabled={due.length === 0}>
                Commencer
              </button>
            </section>
            <section className="frame panel mode-card">
              <h2>
                <Icon name="cards" size={16} /> Session libre
              </h2>
              <p>Tout le paquet, mélangé. Pour t’entraîner sans changer tes boîtes.</p>
              <button type="button" className="btn btn--secondary" onClick={() => startCards(false)}>
                Mélanger et jouer
              </button>
            </section>
            <section className="frame panel mode-card">
              <h2>
                <Icon name="bolt" size={16} /> Défi éclair
              </h2>
              <p>
                {cards.length >= QUICK_MIN_CARDS
                  ? 'Un QCM généré : retrouve le terme à partir de sa définition.'
                  : `Il faut au moins ${QUICK_MIN_CARDS} cartes pour générer un QCM.`}
              </p>
              <button type="button" className="btn btn--cyan" onClick={startQuick} disabled={cards.length < QUICK_MIN_CARDS}>
                Relever le défi
              </button>
            </section>
          </div>
        </div>
      ) : null}

      {mode.kind === 'cards'
        ? (() => {
            const card = mode.deck[mode.index] as Flashcard;
            const source = getCard(card.cardId);
            const answer = (known: boolean) => {
              sfx(known ? 'good' : 'bad');
              if (mode.leitner) dispatch({ type: 'review/answer', flashcardId: card.id, known });
              const next = mode.index + 1;
              const knownCount = mode.known + (known ? 1 : 0);
              const missed = known ? mode.missed : [...mode.missed, source?.term ?? card.cardId];
              if (next >= mode.deck.length) {
                if (mode.leitner) dispatch({ type: 'review/sessionEnd' });
                setMode({
                  kind: 'done',
                  title: mode.leitner ? 'Session terminée' : 'Session libre terminée',
                  lines: [
                    `${knownCount} / ${mode.deck.length} flashcards sues.`,
                    missed.length ? `À retravailler : ${[...new Set(missed)].join(', ')}.` : 'Sans-faute ! Bob est fier de toi.',
                    mode.leitner ? 'Tes boîtes ont été mises à jour.' : 'Tes boîtes n’ont pas changé (session libre).',
                  ],
                });
              } else {
                setMode({ ...mode, index: next, flipped: false, known: knownCount, missed });
              }
            };
            return (
              <div className="session">
                <p className="session__progress">
                  Flashcard {mode.index + 1} / {mode.deck.length}
                  {mode.leitner ? ` · boîte ${boxOf(save.review, card.id)}` : ''}
                </p>
                <div className={`flash frame ${mode.flipped ? 'flash--back frame--lime' : 'frame--gold'}`}>
                  <span className="flash__kind">{KIND_LABELS[card.kind]}</span>
                  <RichText text={mode.flipped ? card.back : card.front} className="flash__text" />
                </div>
                <div className="session__actions">
                  {!mode.flipped ? (
                    <button type="button" className="btn" onClick={() => { sfx('page'); setMode({ ...mode, flipped: true }); }} autoFocus>
                      Retourner la carte
                    </button>
                  ) : (
                    <>
                      <button type="button" className="btn btn--lime" onClick={() => answer(true)} autoFocus>
                        <Icon name="check" size={12} /> Je savais
                      </button>
                      <button type="button" className="btn btn--danger" onClick={() => answer(false)}>
                        <Icon name="cross" size={12} /> À revoir
                      </button>
                    </>
                  )}
                </div>
                <p className="muted session__tip">Réponds de tête avant de retourner la carte, puis sois honnête : c’est toi que tu évalues.</p>
              </div>
            );
          })()
        : null}

      {mode.kind === 'quick'
        ? (() => {
            const q = mode.questions[mode.index] as QuickQuestion;
            const answered = mode.picked !== null;
            const pick = (id: string) => {
              if (answered) return;
              const good = id === q.answerId;
              sfx(good ? 'good' : 'bad');
              setMode({ ...mode, picked: id, score: mode.score + (good ? 1 : 0) });
            };
            const next = () => {
              if (mode.index + 1 >= mode.questions.length) {
                setMode({
                  kind: 'done',
                  title: 'Défi éclair terminé',
                  lines: [`Score : ${mode.score} / ${mode.questions.length}.`, 'Le défi éclair est un entraînement : il ne change pas tes boîtes.'],
                });
              } else setMode({ ...mode, index: mode.index + 1, picked: null });
            };
            return (
              <div className="session">
                <p className="session__progress">
                  Question {mode.index + 1} / {mode.questions.length} · score {mode.score}
                </p>
                <div className="flash frame frame--cyan">
                  <span className="flash__kind">Quel terme correspond à cette définition ?</span>
                  <p className="flash__text">
                    <T>{q.prompt}</T>
                  </p>
                </div>
                <div className="quick__options" role="group" aria-label="Réponses possibles">
                  {q.options.map((o) => {
                    const state = !answered ? '' : o.cardId === q.answerId ? 'quick__option--good' : o.cardId === mode.picked ? 'quick__option--bad' : '';
                    return (
                      <button key={o.cardId} type="button" className={`quick__option ${state}`} onClick={() => pick(o.cardId)} disabled={answered}>
                        <T>{o.label}</T>
                      </button>
                    );
                  })}
                </div>
                {answered ? (
                  <div className="session__actions">
                    <p className={mode.picked === q.answerId ? 'good-text' : 'bad-text'} role="status">
                      {mode.picked === q.answerId ? 'Bien joué !' : `Raté : c’était « ${getCard(q.answerId)?.term} ».`}
                    </p>
                    <button type="button" className="btn" onClick={next} autoFocus>
                      Suivant <Icon name="arrow-right" size={12} />
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })()
        : null}

      {mode.kind === 'done' ? (
        <div className="review__done frame panel">
          <BobSprite pieces={save.pieces} mood="proud" scale={5} />
          <div>
            <h2>{mode.title}</h2>
            {mode.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
            <button type="button" className="btn" onClick={() => setMode({ kind: 'menu' })}>
              Retour aux boîtes
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
