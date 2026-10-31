import { useState } from 'react';
import { useGame } from '../../game/GameContext';
import { Icon } from '../../ui/Icon';
import { T } from '../../ui/typography';
import { ratio } from '../kit/scoring';
import { CALL_TASKS, callPreview, intentErrors, validateArgs } from './logic';

/** Manche 2 du niveau 2 : remplir un appel d'outil, validé comme le ferait un harnais. */
export function ToolFormRound({ onDone }: { onDone: (score: number) => void }) {
  const { sfx } = useGame();
  const [index, setIndex] = useState(0);
  const [args, setArgs] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<{ schema: string[]; intent: string[] } | null>(null);
  const [firstTry, setFirstTry] = useState<boolean[]>([]);
  const task = CALL_TASKS[index]!;
  const solved = result !== null && result.schema.length === 0 && result.intent.length === 0;
  const last = index + 1 >= CALL_TASKS.length;

  const submit = () => {
    const schema = validateArgs(task.tool, args);
    const intent = schema.length ? [] : intentErrors(task, args);
    const ok = schema.length === 0 && intent.length === 0;
    if (attempts === 0) setFirstTry((f) => [...f, ok]);
    setAttempts((a) => a + 1);
    setResult({ schema, intent });
    sfx(ok ? 'good' : 'bad');
  };

  const next = () => {
    if (last) {
      onDone(ratio(firstTry.filter(Boolean).length, CALL_TASKS.length));
      return;
    }
    setIndex(index + 1);
    setArgs({});
    setAttempts(0);
    setResult(null);
  };

  return (
    <div className="mg-round">
      <p className="mg-instructions">
        Remplis l’appel d’outil comme le ferait Bob. Le <b>harnais</b> vérifie d’abord le schéma (formats, champs obligatoires), puis on vérifie que
        l’appel correspond bien à la demande d’Inès. Seul le premier essai compte pour le score. (Appel {index + 1} / {CALL_TASKS.length})
      </p>
      <p className="mg-context">
        <b>Inès :</b> <T>{task.request}</T>
      </p>
      <div className="toolform">
        <div className="toolform__fields">
          <p className="toolform__tool">
            <code>{task.tool.name}</code> : <T>{task.tool.description}</T>
          </p>
          {task.tool.fields.map((field) => (
            <div key={field.name} className="field">
              <label htmlFor={`f-${task.id}-${field.name}`}>
                <code>{field.label}</code>
                {field.required ? <span className="toolform__req"> obligatoire</span> : null}
              </label>
              {field.type === 'enum' ? (
                <select
                  id={`f-${task.id}-${field.name}`}
                  value={args[field.name] ?? ''}
                  disabled={solved}
                  onChange={(e) => setArgs((a) => ({ ...a, [field.name]: e.target.value }))}
                >
                  <option value="">Choisir…</option>
                  {field.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`f-${task.id}-${field.name}`}
                  value={args[field.name] ?? ''}
                  placeholder={field.placeholder}
                  disabled={solved}
                  inputMode={field.type === 'integer' ? 'numeric' : undefined}
                  autoComplete="off"
                  onChange={(e) => setArgs((a) => ({ ...a, [field.name]: e.target.value }))}
                />
              )}
            </div>
          ))}
        </div>
        <div className="toolform__preview">
          <p className="toolform__label">Appel produit</p>
          <pre className="mg-code">{callPreview(task.tool, args)}</pre>
          {result ? (
            <div className={`mg-feedback ${solved ? 'mg-feedback--good' : 'mg-feedback--bad'}`} role="status">
              {result.schema.length ? (
                <>
                  <p>
                    <b>Le harnais refuse l’appel :</b>
                  </p>
                  <ul className="toolform__errors">
                    {result.schema.map((e) => (
                      <li key={e} className="data">
                        {e}
                      </li>
                    ))}
                  </ul>
                  <p className="muted">C’est exactement le message qu’il renverrait au modèle pour qu’il corrige.</p>
                </>
              ) : result.intent.length ? (
                <>
                  <p>
                    <b>Le schéma est respecté… mais l’appel ne fait pas ce qu’Inès veut :</b>
                  </p>
                  <ul className="toolform__errors">
                    {result.intent.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                  <p className="muted">Un schéma garantit la forme, pas le sens : la validation ne remplace pas la bonne compréhension.</p>
                </>
              ) : (
                <p>
                  <b>Appel valide et conforme à la demande.</b> Le harnais l’exécute et renvoie le résultat à Bob.
                </p>
              )}
            </div>
          ) : null}
          <div className="mg-actions">
            {!solved ? (
              <button type="button" className="btn" onClick={submit}>
                <Icon name="check" size={12} /> {attempts ? 'Renvoyer l’appel' : 'Envoyer l’appel'}
              </button>
            ) : (
              <button type="button" className="btn" onClick={next} autoFocus>
                {last ? 'Terminer la manche' : 'Appel suivant'} <Icon name="arrow-right" size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
