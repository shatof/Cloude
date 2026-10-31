import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { LEVELS, getLevel } from '../content/levels';
import type { LevelId } from '../content/types';
import { useGame } from '../game/GameContext';
import { BOB_BASE, BOB_FACES } from '../sprites/bob';
import { cropSprite } from '../sprites/pixel';
import { PixelArt } from '../sprites/PixelArt';
import { Icon } from '../ui/Icon';
import { RichText } from '../ui/typography';
import { answerSuggestion, askTutor, tutorSuggestions, type TutorContext } from './tutor';
import { useAiStatus } from './useAi';
import type { ChatTurn } from './types';
import './TutorDrawer.css';

interface Message extends ChatTurn {
  id: number;
  source?: 'model' | 'fallback' | 'cours';
  notice?: string;
}

const FACE = [cropSprite(BOB_BASE, 10, 0, 20, 20), cropSprite(BOB_FACES.happy, 10, 0, 20, 20)];

export function TutorDrawer({ levelId, onClose }: { levelId?: string; onClose: () => void }) {
  const { save, sfx } = useGame();
  const ai = useAiStatus();
  const level = levelId ? getLevel(levelId) : undefined;
  const knownLevelIds = useMemo(
    () => LEVELS.filter((l) => save.levels[l.id] !== undefined).map((l) => l.id as LevelId),
    [save.levels],
  );
  const ctxBase = useMemo(
    () => ({ levelId: level?.id, knownLevelIds, cardIds: save.cards }),
    [level?.id, knownLevelIds, save.cards],
  );
  const greeting = level
    ? `Une question sur « ${level.title} » ? Je réponds avec ce que mon harnais me permet de savoir.`
    : 'Une question sur l’IA agentique ou sur le jeu ? Demande-moi !';
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: 'assistant', content: greeting, source: 'cours' }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const nextId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const suggestions = tutorSuggestions(ctxBase);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView?.({ block: "end" });
  }, [messages, busy]);

  const push = (m: Omit<Message, 'id'>) => setMessages((list) => [...list, { ...m, id: nextId.current++ }]);

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    sfx('click');
    push({ role: 'user', content: q });
    setInput('');
    setBusy(true);
    const ctx: TutorContext = {
      ...ctxBase,
      history: messages.filter((m) => m.id !== 0).map(({ role, content }) => ({ role, content })),
    };
    const result = await askTutor(q, ctx);
    push({ role: 'assistant', content: result.data.text, source: result.source, notice: result.notice });
    setBusy(false);
  };

  const askSuggested = (id: string, question: string) => {
    const reply = answerSuggestion(id, ctxBase);
    if (!reply) return;
    sfx('click');
    push({ role: 'user', content: question });
    push({ role: 'assistant', content: reply.text, source: 'cours' });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void ask(input);
  };

  return (
    <aside className="tutor frame frame--cyan" role="dialog" aria-modal="false" aria-labelledby="tutor-title">
      <header className="tutor__head">
        <PixelArt layers={FACE} scale={2} />
        <div>
          <h2 id="tutor-title">Bob, tuteur</h2>
          <p className={`tutor__mode ${ai.connected ? 'tutor__mode--on' : ''}`}>
            <Icon name="chip" size={12} />
            {ai.connected ? `IA réelle : ${ai.config.modelLabel || ai.config.model}` : 'Mode simulé : réponses du cours'}
          </p>
          {!ai.connected ? (
            <a className="tutor__link" href="#/reglages" onClick={onClose}>
              Connecter un vrai modèle
            </a>
          ) : null}
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer le tuteur">
          <Icon name="close" size={20} />
        </button>
      </header>

      <ol className="tutor__list" ref={listRef} aria-live="polite">
        {messages.map((m) => (
          <li key={m.id} className={`tutor__msg tutor__msg--${m.role}`}>
            <RichText text={m.content} />
            {m.role === 'assistant' && m.id !== 0 ? (
              <span className="tutor__tag">{m.source === 'model' ? 'Réponse du modèle' : 'Réponse du cours'}</span>
            ) : null}
            {m.notice ? <span className="tutor__notice">{m.notice}</span> : null}
          </li>
        ))}
        {busy ? (
          <li className="tutor__msg tutor__msg--assistant tutor__msg--busy">
            <span>Bob réfléchit…</span>
          </li>
        ) : null}
      </ol>

      <div className="tutor__suggestions" aria-label="Questions suggérées">
        {suggestions.map((s) => (
          <button key={s.id} type="button" className="chip" onClick={() => askSuggested(s.id, s.question)} disabled={busy}>
            {s.question}
          </button>
        ))}
      </div>

      <form className="tutor__form" onSubmit={onSubmit}>
        <label htmlFor="tutor-input" className="sr-only">
          Ta question
        </label>
        <input
          id="tutor-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question…"
          maxLength={500}
          autoComplete="off"
        />
        <button type="submit" className="btn btn--small" disabled={busy || !input.trim()}>
          Envoyer
        </button>
      </form>
    </aside>
  );
}
