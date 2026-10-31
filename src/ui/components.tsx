import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useGame, useReducedMotion } from '../game/GameContext';
import { Icon } from './Icon';
import { frenchTypo, inline } from './typography';

/* ------------------------------------------------------------------ */
/* Barres                                                              */
/* ------------------------------------------------------------------ */

export function ProgressBar({
  value,
  label,
  variant,
  className,
}: {
  value: number;
  label: string;
  variant?: 'xp' | 'hp';
  className?: string;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      className={['bar', variant ? `bar--${variant}` : '', className ?? ''].join(' ').trim()}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div className="bar__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Segments({ total, done, label, next }: { total: number; done: number; label: string; next?: boolean }) {
  return (
    <div className="segments" role="img" aria-label={label}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={[
            'segments__cell',
            i < done ? 'segments__cell--on' : '',
            next && i === done ? 'segments__cell--next' : '',
          ].join(' ')}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Texte qui s'écrit                                                   */
/* ------------------------------------------------------------------ */

const SPEED_MS = { instant: 0, fast: 14, normal: 30 } as const;

export function useTypewriter(text: string, onDone?: () => void): { shown: string; done: boolean; skip: () => void } {
  const { save } = useGame();
  const reduced = useReducedMotion();
  const delay = reduced ? 0 : SPEED_MS[save.settings.textSpeed];
  const [count, setCount] = useState(delay === 0 ? text.length : 0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    setCount(delay === 0 ? text.length : 0);
  }, [text, delay]);

  useEffect(() => {
    if (count >= text.length) {
      doneRef.current?.();
      return;
    }
    const id = window.setTimeout(() => setCount((c) => Math.min(text.length, c + 2)), delay * 2);
    return () => window.clearTimeout(id);
  }, [count, text, delay]);

  return { shown: text.slice(0, count), done: count >= text.length, skip: () => setCount(text.length) };
}

export function Typewriter({ text, onDone, className }: { text: string; onDone?: () => void; className?: string }) {
  const { shown, done, skip } = useTypewriter(text, onDone);
  return (
    <p className={className} onClick={done ? undefined : skip}>
      <span className="sr-only">{frenchTypo(text)}</span>
      <span aria-hidden="true">{done ? inline(text) : frenchTypo(shown)}</span>
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Boîte de dialogue (plaque de nom + texte)                           */
/* ------------------------------------------------------------------ */

export function DialogueBox({
  speaker,
  children,
  tone = 'bob',
  className,
}: {
  speaker: string;
  children: ReactNode;
  tone?: 'bob' | 'user' | 'narrator' | 'boss';
  className?: string;
}) {
  return (
    <div className={['dialogue', `dialogue--${tone}`, 'frame', className ?? ''].join(' ').trim()}>
      <span className="dialogue__name">{speaker}</span>
      <div className="dialogue__body">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export function Toasts() {
  const { toasts } = useGame();
  return (
    <div className="toasts" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.kind}`}>
          <Icon name={t.kind === 'rank' ? 'trophy' : 'star'} size={16} />
          {t.text}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Confirmation en ligne (sans fenêtre modale)                         */
/* ------------------------------------------------------------------ */

export function InlineConfirm({
  label,
  confirmLabel,
  message,
  onConfirm,
  danger,
  icon,
}: {
  label: string;
  confirmLabel: string;
  message: string;
  onConfirm: () => void;
  danger?: boolean;
  icon?: string;
}) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button type="button" className={`btn btn--small ${danger ? 'btn--danger' : 'btn--secondary'}`} onClick={() => setOpen(true)}>
        {icon ? <Icon name={icon} size={12} /> : null}
        {label}
      </button>
    );
  }
  return (
    <div className="inline-confirm" role="group" aria-label={label}>
      <p>{frenchTypo(message)}</p>
      <div className="inline-confirm__actions">
        <button
          type="button"
          className={`btn btn--small ${danger ? 'btn--danger' : ''}`}
          onClick={() => {
            onConfirm();
            setOpen(false);
          }}
        >
          {confirmLabel}
        </button>
        <button type="button" className="btn btn--small btn--ghost" onClick={() => setOpen(false)}>
          Annuler
        </button>
      </div>
    </div>
  );
}
