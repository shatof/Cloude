import { useState } from 'react';
import { evaluateFinalBoss, type FinalBossCase, type FinalBossFeedback } from '../../ai/finalBoss';
import { useAiStatus } from '../../ai/useAi';
import { HARNESS_PIECES } from '../../game/harness';
import { useGame } from '../../game/GameContext';
import { Icon } from '../../ui/Icon';
import { T } from '../../ui/typography';
import { FINAL_CASES } from './cases';

/** Pièces proposées : toutes sauf la cape d'architecte (la récompense du niveau). */
const PIECES = HARNESS_PIECES.filter((p) => p.id !== 'architect-cape');

const GRADE_TONE: Record<FinalBossFeedback['grade'], string> = { S: 'good', A: 'good', B: 'mid', C: 'bad', D: 'bad' };

function FeedbackView({ feedback, source }: { feedback: FinalBossFeedback; source: 'fallback' | 'model' }) {
  return (
    <div className={`arch-feedback arch-feedback--${GRADE_TONE[feedback.grade]}`}>
      <div className="arch-score">
        <span className="arch-score__grade">{feedback.grade}</span>
        <span className="arch-score__num">{feedback.score}/100</span>
      </div>
      <p className="arch-feedback__summary">
        <T>{feedback.summary}</T>
      </p>
      {feedback.risks.length ? (
        <div className="arch-list arch-list--risk">
          <h4>
            <Icon name="warning" size={12} /> Risques
          </h4>
          <ul>
            {feedback.risks.map((r, i) => (
              <li key={i}>
                <T>{r}</T>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {feedback.strengths.length ? (
        <div className="arch-list arch-list--good">
          <h4>
            <Icon name="check" size={12} /> Points forts
          </h4>
          <ul>
            {feedback.strengths.map((r, i) => (
              <li key={i}>
                <T>{r}</T>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {feedback.gaps.length ? (
        <div className="arch-list">
          <h4>Manques</h4>
          <ul>
            {feedback.gaps.map((r, i) => (
              <li key={i}>
                <T>{r}</T>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {feedback.advice.length ? (
        <div className="arch-list">
          <h4>Conseils</h4>
          <ul>
            {feedback.advice.map((r, i) => (
              <li key={i}>
                <T>{r}</T>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {feedback.judge ? (
        <div className="arch-judge">
          <h4>
            <Icon name="scales" size={12} /> Le juge (modèle connecté)
          </h4>
          <p>
            <T>{feedback.judge.commentary}</T>
          </p>
          {feedback.judge.improvements.length ? (
            <ul>
              {feedback.judge.improvements.map((r, i) => (
                <li key={i}>
                  <T>{r}</T>
                </li>
              ))}
            </ul>
          ) : null}
          {feedback.judge.question ? (
            <p className="arch-judge__q">
              <b>Pour aller plus loin :</b> <T>{feedback.judge.question}</T>
            </p>
          ) : null}
        </div>
      ) : (
        <p className="muted">{source === 'fallback' ? 'Retour de la grille automatique. Connecte un modèle (Réglages) pour un retour personnalisé.' : ''}</p>
      )}
    </div>
  );
}

export function ArchitectRound({ onDone }: { onDone: (score: number) => void }) {
  const { sfx } = useGame();
  const { connected } = useAiStatus();
  const [caseDef, setCaseDef] = useState<FinalBossCase>(FINAL_CASES[0]!);
  const [pieces, setPieces] = useState<Set<string>>(new Set(['loop-engine']));
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [justification, setJustification] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ data: FinalBossFeedback; source: 'fallback' | 'model'; notice?: string } | null>(null);
  const [best, setBest] = useState(0);

  const chooseCase = (c: FinalBossCase) => {
    sfx('click');
    setCaseDef(c);
    setPieces(new Set(['loop-engine']));
    setSettings({});
    setJustification('');
    setResult(null);
  };

  const togglePiece = (id: string) => {
    sfx('click');
    setPieces((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setResult(null);
  };

  const allSettingsChosen = caseDef.settings.every((s) => settings[s.id]);
  const ready = allSettingsChosen && justification.trim().length >= 40;

  const submit = async () => {
    setBusy(true);
    const res = await evaluateFinalBoss(caseDef, {
      caseId: caseDef.id,
      pieces: [...pieces],
      settings,
      justification,
    });
    sfx(res.data.grade === 'S' || res.data.grade === 'A' ? 'good' : 'bad');
    setResult({ data: res.data, source: res.source, notice: res.notice });
    setBest((b) => Math.max(b, res.data.score));
    setBusy(false);
  };

  return (
    <div className="mg-round">
      <p className="mg-instructions">
        Épreuve d’architecte : **conçois le harnais complet** de Bob pour un cas réel. Choisis les pièces, règle-les, et **justifie tes choix**. Un
        bon architecte met l’essentiel, évite le superflu, et ne laisse aucune faille de sécurité.
      </p>

      <div className="arch-cases" role="group" aria-label="Choix du cas">
        {FINAL_CASES.map((c) => (
          <button key={c.id} type="button" className={`arch-case ${c.id === caseDef.id ? 'arch-case--on' : ''}`} aria-pressed={c.id === caseDef.id} onClick={() => chooseCase(c)}>
            {c.title}
          </button>
        ))}
      </div>

      <p className="mg-context">
        <b>{caseDef.title}.</b> <T>{caseDef.brief}</T>
      </p>

      <div className="arch">
        <section className="arch__build" aria-label="Construction du harnais">
          <h3 className="assembly__title">Les pièces du harnais</h3>
          <ul className="arch__pieces">
            {PIECES.map((p) => {
              const on = pieces.has(p.id);
              return (
                <li key={p.id}>
                  <button type="button" className={`assembly__piece ${on ? 'assembly__piece--on' : ''}`} aria-pressed={on} onClick={() => togglePiece(p.id)}>
                    <span className="assembly__switch" aria-hidden="true">
                      {on ? <Icon name="check" size={10} /> : null}
                    </span>
                    <span className="assembly__piece-text">
                      <b>{p.name}</b>
                      <small>
                        <T>{p.capability}</T>
                      </small>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <h3 className="assembly__title">Les réglages</h3>
          {caseDef.settings.map((setting) => (
            <div key={setting.id} className="arch-setting">
              <p className="arch-setting__label">{setting.label}</p>
              <div className="arch-setting__options" role="group" aria-label={setting.label}>
                {setting.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className={`seg ${settings[setting.id] === o.id ? 'seg--on' : ''}`}
                    aria-pressed={settings[setting.id] === o.id}
                    onClick={() => {
                      sfx('click');
                      setSettings((s) => ({ ...s, [setting.id]: o.id }));
                      setResult(null);
                    }}
                  >
                    <T>{o.label}</T>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <label className="arch-just">
            <span className="arch-setting__label">Justifie tes choix (quels risques chaque pièce couvre-t-elle ?)</span>
            <textarea
              className="arch-just__input"
              rows={4}
              value={justification}
              onChange={(e) => {
                setJustification(e.target.value);
                setResult(null);
              }}
              placeholder="Ex. : je garde un contenu non fiable comme donnée (bouclier), je limite les tours, je demande une confirmation humaine avant tout paiement…"
            />
          </label>

          <button type="button" className="btn" disabled={!ready || busy} onClick={submit}>
            <Icon name="trophy" size={12} /> {busy ? 'Évaluation…' : result ? 'Réévaluer le harnais' : 'Soumettre le harnais'}
          </button>
          {!ready ? <p className="muted">Choisis tous les réglages et écris quelques phrases de justification pour soumettre.</p> : null}
        </section>

        <section className="arch__result" aria-live="polite">
          <h3 className="assembly__title">Évaluation {connected ? '(modèle connecté)' : '(grille automatique)'}</h3>
          {result ? (
            <>
              <FeedbackView feedback={result.data} source={result.source} />
              {result.notice ? <p className="muted">{result.notice}</p> : null}
            </>
          ) : (
            <p className="muted">
              Monte ton harnais, règle-le, justifie, puis soumets. La note vient d’une grille fixe ; un modèle connecté y ajoute un retour
              personnalisé.
            </p>
          )}
        </section>
      </div>

      <div className="mg-actions">
        <span className={best >= 75 ? 'good-text' : 'muted'} role="status">
          {best > 0 ? `Meilleure note : ${best}/100.` : 'Vise au moins le rang A (75/100).'}
        </span>
        <button type="button" className={best >= 75 ? 'btn' : 'btn btn--ghost'} disabled={best === 0} onClick={() => onDone(Math.min(1, best / 100))}>
          Terminer l’épreuve <Icon name="arrow-right" size={12} />
        </button>
      </div>
    </div>
  );
}
