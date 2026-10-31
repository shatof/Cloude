import { useRef, useState, type ChangeEvent } from 'react';
import { DEMO_CASE, DEMO_INJECTION, DEMO_SUBMISSION } from '../ai/examples';
import { evaluateFinalBoss } from '../ai/finalBoss';
import { runInjectionAttempt } from '../ai/injection';
import { askTutor } from '../ai/tutor';
import { listModels, testConnection } from '../ai/client';
import { EMPTY_AI_CONFIG, clearAiConfig, isAiConfigured, saveAiConfig, type AIConfig } from '../ai/config';
import { useAiConfig } from '../ai/useAi';
import { describeAiError, type ModelOption } from '../ai/types';
import { useGame } from '../game/GameContext';
import type { Settings as SettingsData, TextSpeed } from '../game/state';
import { exportSave, parseImport } from '../game/storage';
import { InlineConfirm } from '../ui/components';
import { Icon } from '../ui/Icon';
import './Settings.css';

function Choice<T extends string | number>({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="choice">
      <legend>{legend}</legend>
      <div className="choice__options">
        {options.map((o) => (
          <label key={String(o.value)} className={`choice__option ${o.value === value ? 'choice__option--on' : ''}`}>
            <input type="radio" name={name} checked={o.value === value} onChange={() => onChange(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle__box" aria-hidden="true">
        {checked ? <Icon name="check" size={12} /> : null}
      </span>
      <span className="toggle__text">
        {label}
        {hint ? <small>{hint}</small> : null}
      </span>
    </label>
  );
}

function AiSettings() {
  const stored = useAiConfig();
  const [draft, setDraft] = useState<AIConfig>(stored.provider === 'none' ? { ...EMPTY_AI_CONFIG, provider: 'anthropic' } : stored);
  const [enabled, setEnabled] = useState(stored.provider !== 'none');
  const [models, setModels] = useState<ModelOption[]>([]);
  const [status, setStatus] = useState<{ tone: 'ok' | 'error' | 'info'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const connected = isAiConfigured(stored);

  const update = (patch: Partial<AIConfig>) => setDraft((d) => ({ ...d, ...patch }));

  const loadModels = async () => {
    setBusy(true);
    setStatus({ tone: 'info', text: 'Chargement de la liste des modèles…' });
    try {
      const list = await listModels(draft.apiKey);
      setModels(list);
      const first = list[0];
      if (first && !list.some((m) => m.id === draft.model)) {
        update({ model: first.id, modelLabel: first.label, structured: first.structured, effort: first.effort });
      }
      setStatus({ tone: 'ok', text: `${list.length} modèle${list.length > 1 ? 's' : ''} disponible${list.length > 1 ? 's' : ''} pour cette clé.` });
    } catch (error) {
      setStatus({ tone: 'error', text: `${describeAiError(error)} Tu peux aussi saisir l’identifiant du modèle à la main.` });
    }
    setBusy(false);
  };

  const pickModel = (id: string) => {
    const m = models.find((x) => x.id === id);
    update({ model: id, modelLabel: m?.label ?? id, structured: m?.structured ?? false, effort: m?.effort ?? false });
  };

  const save = async () => {
    const config: AIConfig = { ...draft, provider: 'anthropic', apiKey: draft.apiKey.trim(), model: draft.model.trim() };
    if (!isAiConfigured(config)) {
      setStatus({ tone: 'error', text: 'Il faut une clé API et un modèle.' });
      return;
    }
    setBusy(true);
    setStatus({ tone: 'info', text: 'Test de la connexion…' });
    const result = await testConnection(config);
    if (result.ok) {
      saveAiConfig(config);
      setStatus({ tone: 'ok', text: `${result.message} Configuration enregistrée.` });
    } else {
      setStatus({ tone: 'error', text: `${result.message} Rien n’a été enregistré.` });
    }
    setBusy(false);
  };

  const disconnect = () => {
    clearAiConfig();
    setDraft({ ...EMPTY_AI_CONFIG, provider: 'anthropic' });
    setModels([]);
    setEnabled(false);
    setStatus({ tone: 'info', text: 'Modèle déconnecté : retour au mode simulé.' });
  };

  return (
    <div className="ai-settings">
      <p className="settings__lead">
        Le jeu est entièrement simulé et fonctionne sans IA. En option, un vrai modèle peut animer trois fonctions : <b>le tuteur</b>,{' '}
        <b>l’évaluation du boss final</b> et <b>le labo de prompt injection</b> (niveau 11). Les scores et l’XP ne dépendent jamais du modèle.
      </p>

      <p className={`ai-state ${connected ? 'ai-state--on' : ''}`} role="status">
        <Icon name="chip" size={16} />
        {connected ? `Connecté : ${stored.modelLabel || stored.model}` : 'Mode simulé : aucun modèle connecté.'}
      </p>

      <Toggle
        label="Connecter un modèle Anthropic (Claude)"
        hint="Avec ta propre clé API : les appels partent directement de ce navigateur."
        checked={enabled}
        onChange={(v) => {
          setEnabled(v);
          if (!v && connected) disconnect();
        }}
      />

      {enabled ? (
        <div className="ai-form">
          <div className="field">
            <label htmlFor="api-key">Clé API</label>
            <input
              id="api-key"
              type="password"
              value={draft.apiKey}
              onChange={(e) => update({ apiKey: e.target.value })}
              placeholder="sk-ant-…"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <Toggle
            label="Mémoriser la clé sur cet appareil"
            hint="Sinon, elle est oubliée à la fermeture de l’onglet. Elle n’est jamais incluse dans l’export de sauvegarde."
            checked={draft.remember}
            onChange={(v) => update({ remember: v })}
          />
          <div className="ai-form__row">
            <button type="button" className="btn btn--secondary btn--small" onClick={loadModels} disabled={busy || !draft.apiKey.trim()}>
              <Icon name="download" size={12} /> Charger les modèles
            </button>
          </div>
          {models.length > 0 ? (
            <div className="field">
              <label htmlFor="model-select">Modèle</label>
              <select id="model-select" value={draft.model} onChange={(e) => pickModel(e.target.value)}>
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label} ({m.id})
                  </option>
                ))}
              </select>
              <small className="muted">Pour l’évaluation du boss final, privilégie le modèle le plus capable de la liste.</small>
            </div>
          ) : (
            <div className="field">
              <label htmlFor="model-id">Identifiant du modèle</label>
              <input
                id="model-id"
                value={draft.model}
                onChange={(e) => update({ model: e.target.value, modelLabel: e.target.value, structured: false, effort: false })}
                placeholder="Charge la liste, ou saisis l’identifiant"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          )}
          <div className="ai-form__row">
            <button type="button" className="btn btn--small" onClick={save} disabled={busy}>
              <Icon name="check" size={12} /> Tester et enregistrer
            </button>
            {connected ? (
              <button type="button" className="btn btn--small btn--ghost" onClick={disconnect} disabled={busy}>
                Déconnecter
              </button>
            ) : null}
          </div>
          <p className="settings__warning">
            <Icon name="warning" size={12} /> La clé reste dans ce navigateur et sert uniquement à appeler l’API Anthropic. N’active pas
            « mémoriser » sur un ordinateur partagé. Les appels sont facturés sur ton compte.
          </p>
        </div>
      ) : null}

      {status ? (
        <p className={`ai-status ai-status--${status.tone}`} role="status">
          {status.text}
        </p>
      ) : null}

      <AiDiagnostics />
    </div>
  );
}

function AiDiagnostics() {
  const [output, setOutput] = useState<{ title: string; source: string; lines: string[] } | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async (kind: 'tutor' | 'judge' | 'injection') => {
    setBusy(true);
    if (kind === 'tutor') {
      const r = await askTutor('C’est quoi, un harnais ?', { levelId: 'l1', knownLevelIds: ['l0', 'l1'], cardIds: [], history: [] });
      setOutput({ title: 'Tuteur : « C’est quoi, un harnais ? »', source: r.source, lines: [r.data.text, r.notice ?? ''] });
    } else if (kind === 'judge') {
      const r = await evaluateFinalBoss(DEMO_CASE, DEMO_SUBMISSION);
      setOutput({
        title: `Juge du boss final : « ${DEMO_CASE.title} » (exemple)`,
        source: r.source,
        lines: [
          `Note (grille déterministe) : ${r.data.score}/100, rang ${r.data.grade}. ${r.data.summary}`,
          ...r.data.gaps.slice(0, 2),
          ...r.data.risks.slice(0, 2),
          r.data.judge ? `Avis du juge IA : ${r.data.judge.commentary}` : '',
          r.notice ?? '',
        ],
      });
    } else {
      const r = await runInjectionAttempt(DEMO_INJECTION);
      setOutput({
        title: 'Labo d’injection : e-mail piégé, sans aucune défense (exemple)',
        source: r.source,
        lines: [
          `Réponse de Bob : ${r.data.response}`,
          r.data.leaked ? 'Le secret a fuité.' : 'Le secret n’a pas fuité.',
          r.data.explanation,
          r.notice ?? '',
        ],
      });
    }
    setBusy(false);
  };

  return (
    <div className="diagnostics">
      <h3>Tester la couche IA</h3>
      <p className="muted">Lance un exemple pour chaque usage. Sans modèle connecté, tu vois la réponse prédéfinie.</p>
      <div className="ai-form__row">
        <button type="button" className="btn btn--small btn--secondary" onClick={() => run('tutor')} disabled={busy}>
          Tuteur
        </button>
        <button type="button" className="btn btn--small btn--secondary" onClick={() => run('judge')} disabled={busy}>
          Juge du boss final
        </button>
        <button type="button" className="btn btn--small btn--secondary" onClick={() => run('injection')} disabled={busy}>
          Labo d’injection
        </button>
      </div>
      {busy ? <p className="muted">Bob travaille…</p> : null}
      {output ? (
        <div className="diagnostics__out" aria-live="polite">
          <p className="diagnostics__title">
            {output.title}
            <span className={`diagnostics__source diagnostics__source--${output.source}`}>
              {output.source === 'model' ? 'Modèle réel' : 'Réponse prédéfinie'}
            </span>
          </p>
          {output.lines.filter(Boolean).map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Settings() {
  const { save, dispatch, pushToast } = useGame();
  const s = save.settings;
  const fileRef = useRef<HTMLInputElement>(null);
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const set = (patch: Partial<SettingsData>) => dispatch({ type: 'settings/update', patch });

  const doExport = () => {
    const blob = new Blob([exportSave(save)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gitgudai-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const data = parseImport(await file.text());
      dispatch({ type: 'save/replace', data });
      setImportMsg({ ok: true, text: 'Sauvegarde importée : ta progression a été restaurée.' });
    } catch (error) {
      setImportMsg({ ok: false, text: error instanceof Error ? error.message : 'Import impossible.' });
    }
  };

  return (
    <div className="settings">
      <div className="page-head">
        <div>
          <h1>Réglages</h1>
          <p>Affichage, sauvegarde et connexion optionnelle à un vrai modèle.</p>
        </div>
      </div>

      <div className="settings__grid">
        <section className="frame panel settings__section" aria-labelledby="set-display">
          <h2 id="set-display">Affichage</h2>
          <Choice
            legend="Police"
            name="font"
            value={s.readableFont ? 'readable' : 'pixel'}
            options={[
              { value: 'pixel', label: 'Pixel (rétro)' },
              { value: 'readable', label: 'Lisible (Atkinson Hyperlegible)' },
            ]}
            onChange={(v) => set({ readableFont: v === 'readable' })}
          />
          <Choice
            legend="Taille du texte"
            name="scale"
            value={s.textScale}
            options={[
              { value: 1, label: '100 %' },
              { value: 1.15, label: '115 %' },
              { value: 1.3, label: '130 %' },
            ]}
            onChange={(v) => set({ textScale: v })}
          />
          <Choice<TextSpeed>
            legend="Vitesse d’affichage des dialogues"
            name="speed"
            value={s.textSpeed}
            options={[
              { value: 'instant', label: 'Instantané' },
              { value: 'fast', label: 'Rapide' },
              { value: 'normal', label: 'Normal' },
            ]}
            onChange={(v) => set({ textSpeed: v })}
          />
          <Toggle label="Effet écran cathodique" hint="Fines lignes de balayage. Désactivé par défaut pour la lisibilité." checked={s.crt} onChange={(v) => set({ crt: v })} />
          <Toggle label="Réduire les animations" hint="Le réglage de ton système est aussi respecté." checked={s.reduceMotion} onChange={(v) => set({ reduceMotion: v })} />
          <Toggle label="Bruitages 8 bits" checked={s.sound} onChange={(v) => set({ sound: v })} />
        </section>

        <section className="frame panel settings__section" aria-labelledby="set-save">
          <h2 id="set-save">Progression et sauvegarde</h2>
          <p className="muted">
            Ta progression est sauvegardée automatiquement dans ce navigateur. Exporte-la pour la garder ou la transférer.
          </p>
          <Toggle
            label="Débloquer tous les niveaux disponibles"
            hint="Pratique pour réviser un niveau précis ou tester un niveau ajouté."
            checked={s.unlockAll}
            onChange={(v) => set({ unlockAll: v })}
          />
          <div className="settings__actions">
            <button type="button" className="btn btn--small btn--secondary" onClick={doExport}>
              <Icon name="download" size={12} /> Exporter
            </button>
            <button type="button" className="btn btn--small btn--secondary" onClick={() => fileRef.current?.click()}>
              <Icon name="upload" size={12} /> Importer
            </button>
            <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={doImport} />
            <InlineConfirm
              label="Réinitialiser"
              confirmLabel="Tout effacer"
              icon="trash"
              danger
              message="Effacer toute la progression (XP, pièces, cartes, révisions) ? Les réglages d’affichage sont conservés."
              onConfirm={() => {
                dispatch({ type: 'save/reset' });
                pushToast('info', 'Progression réinitialisée');
              }}
            />
          </div>
          {importMsg ? (
            <p className={importMsg.ok ? 'good-text' : 'bad-text'} role="status">
              {importMsg.text}
            </p>
          ) : null}
        </section>

        <section className="frame panel settings__section settings__section--wide" aria-labelledby="set-ai">
          <h2 id="set-ai">IA réelle (optionnelle)</h2>
          <AiSettings />
        </section>
      </div>
    </div>
  );
}
