import { useEffect, useState, type ComponentType } from 'react';
import { useGame, useReducedMotion } from '../../game/GameContext';
import { createRng } from '../../game/random';
import { LoopDiagram } from '../../minigames/loopRunner/LoopRunner';
import { LOOP_ORDER, STAGE_INFO } from '../../minigames/loopRunner/data';
import { WINDOW_MESSAGES, WINDOW_SIZE, sampleIndex, toyTokenize, tokenId, visibleWindow } from '../../minigames/tokenWorkshop/logic';
import { BOB_BASE } from '../../sprites/bob';
import { cropSprite } from '../../sprites/pixel';
import { PixelArt } from '../../sprites/PixelArt';
import { Icon } from '../../ui/Icon';
import { T } from '../../ui/typography';
import { LEVEL2_ILLUSTRATIONS } from './level2';
import { LEVEL3_ILLUSTRATIONS } from './level3';
import { LEVEL4_ILLUSTRATIONS } from './level4';
import { LEVEL5_ILLUSTRATIONS } from './level5';
import './illustrations.css';

const CHIP_COLORS = ['tok-a', 'tok-b', 'tok-c', 'tok-d', 'tok-e'];

/* 1. Ce que tu vois / ce que voit Bob */
function TokenizerIllustration() {
  const word = 'arrière-grand-mère';
  const tokens = toyTokenize(word);
  const [view, setView] = useState<'human' | 'bob'>('human');
  const [count, setCount] = useState(false);
  const rCount = [...word].filter((c) => c === 'r').length;
  return (
    <div className="illus">
      <div className="seg-toggle" role="group" aria-label="Point de vue">
        <button type="button" className={`seg ${view === 'human' ? 'seg--on' : ''}`} aria-pressed={view === 'human'} onClick={() => setView('human')}>
          Ce que tu vois
        </button>
        <button type="button" className={`seg ${view === 'bob' ? 'seg--on' : ''}`} aria-pressed={view === 'bob'} onClick={() => setView('bob')}>
          Ce que voit Bob
        </button>
      </div>
      {view === 'human' ? (
        <div className="letters" aria-label={word}>
          {[...word].map((c, i) => (
            <span key={i} className={`letter ${count && c === 'r' ? 'letter--hit' : ''}`}>
              {c}
            </span>
          ))}
        </div>
      ) : (
        <div className="token-row token-row--big">
          {tokens.map((t, i) => (
            <span key={i} className={`token-chip ${CHIP_COLORS[i % CHIP_COLORS.length]}`}>
              <span className="data">#{tokenId(t)}</span>
            </span>
          ))}
        </div>
      )}
      <button type="button" className="btn btn--small btn--secondary" onClick={() => setCount((c) => !c)}>
        Compter les « r »
      </button>
      <p className="illus__caption" aria-live="polite">
        {!count
          ? '18 caractères pour toi, 6 numéros pour Bob.'
          : view === 'human'
            ? `Facile : ${rCount} « r », tu les vois tous.`
            : 'Bob ne voit que des numéros : il doit se rappeler l’orthographe de chacun. D’où son « 3 ».'}
      </p>
    </div>
  );
}

/* 2. Tirer le token suivant */
const NEXT = [
  { t: 'lundi', p: 0.16 },
  { t: 'mardi', p: 0.15 },
  { t: '1er', p: 0.09 },
  { t: '12', p: 0.07 },
  { t: 'samedi', p: 0.06 },
  { t: 'autre…', p: 0.47 },
];
const OTHERS = ['vendredi', '3', 'jeudi', '25', 'dimanche', '8', 'mercredi'];

function NextTokenIllustration() {
  const { sfx } = useGame();
  const [draws, setDraws] = useState<string[]>([]);
  const draw = () => {
    const rng = createRng(`next-token:${draws.length}`);
    const i = sampleIndex(NEXT.map((n) => n.p), rng());
    const token = i === NEXT.length - 1 ? (OTHERS[Math.floor(rng() * OTHERS.length)] as string) : (NEXT[i] as { t: string }).t;
    sfx('click');
    setDraws((d) => [...d.slice(-5), token]);
  };
  const last = draws[draws.length - 1];
  return (
    <div className="illus">
      <p className="sentence sentence--small">
        Nous sommes le <span className="sentence__blank">{last ?? ''}</span>
      </p>
      <div className="prob-bars">
        {NEXT.map((n) => (
          <div key={n.t} className="prob-bars__row">
            <span>{n.t}</span>
            <span className="prob-bars__bar">
              <span style={{ width: `${Math.round((n.p / 0.47) * 100)}%` }} />
            </span>
            <b>{Math.round(n.p * 100)} %</b>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn--small btn--secondary" onClick={draw}>
        Tirer le token suivant
      </button>
      <p className="illus__caption" aria-live="polite">
        {draws.length ? `Tirages : ${draws.join(', ')}. Aucun n’est « vrai » : Bob n’a pas de calendrier.` : 'Chaque réponse est un tirage parmi des suites plausibles.'}
      </p>
    </div>
  );
}

/* 3. La fenêtre qui glisse */
function ContextWindowIllustration() {
  const [sent, setSent] = useState(3);
  const messages = WINDOW_MESSAGES.slice(0, sent);
  const { visible, used } = visibleWindow(messages, WINDOW_SIZE);
  const forgotName = !visible.includes(0);
  return (
    <div className="illus">
      <label className="illus__slider" htmlFor="window-slider">
        Messages échangés : <b>{sent}</b>
        <input id="window-slider" type="range" min={1} max={WINDOW_MESSAGES.length} value={sent} onChange={(e) => setSent(Number(e.target.value))} />
      </label>
      <ol className="mini-chat">
        {messages.map((m, i) => (
          <li key={i} className={visible.includes(i) ? 'mini-chat__in' : 'mini-chat__out'}>
            <b>{m.who}</b> <T>{m.text}</T>
          </li>
        ))}
      </ol>
      <p className="illus__caption" aria-live="polite">
        Fenêtre : {used} / {WINDOW_SIZE} tokens.{' '}
        {forgotName ? <strong>Le prénom d’Inès est sorti de la fenêtre !</strong> : 'Tout tient encore dans la fenêtre.'}
      </p>
    </div>
  );
}

/* 4. Modèle + harnais */
const PORTS = [
  { id: 'contexte', label: 'Contexte', desc: 'Le harnais assemble ce que le modèle voit : l’objectif, l’historique, les résultats des actions.' },
  { id: 'actions', label: 'Actions', desc: 'Le modèle écrit une demande d’action ; le harnais l’exécute dans le vrai monde.' },
  { id: 'resultats', label: 'Résultats', desc: 'Ce que l’action a donné revient dans le contexte du tour suivant.' },
  { id: 'arret', label: 'Arrêt', desc: 'Le harnais décide quand s’arrêter : réponse finale, ou garde-fou (tours, budget, temps).' },
];
const BRAIN = cropSprite(BOB_BASE, 13, 0, 14, 10);

function ModelHarnessIllustration() {
  const [port, setPort] = useState(PORTS[0]!.id);
  const current = PORTS.find((p) => p.id === port)!;
  return (
    <div className="illus">
      <div className="harness-diagram">
        <span className="harness-diagram__label">Harnais</span>
        {PORTS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className={`harness-diagram__port harness-diagram__port--${i} ${p.id === port ? 'harness-diagram__port--on' : ''}`}
            onClick={() => setPort(p.id)}
            aria-pressed={p.id === port}
          >
            {p.label}
          </button>
        ))}
        <div className="harness-diagram__model">
          <PixelArt layers={[BRAIN]} scale={4} />
          <span>Modèle</span>
        </div>
      </div>
      <p className="illus__caption" aria-live="polite">
        <b>{current.label} :</b> <T>{current.desc}</T>
      </p>
    </div>
  );
}

/* 5. La boucle qui tourne */
const LOOP_EXAMPLES: Record<string, string> = {
  percevoir: 'Le harnais met l’objectif et le planning des salles dans le contexte.',
  raisonner: 'Le modèle écrit : « Je consulte d’abord les salles libres. »',
  agir: 'Le harnais exécute consulter_planning(jeudi, 14 h).',
  observer: 'Le harnais ajoute « C101 libre, C102 libre » au contexte.',
};

function AgentLoopIllustration() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(!reduced);
  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => setStep((s) => s + 1), 1800);
    return () => window.clearInterval(id);
  }, [auto]);
  const stage = LOOP_ORDER[step % 4]!;
  return (
    <div className="illus">
      <LoopDiagram active={stage} />
      <p className="illus__caption" aria-live="polite">
        <b>
          Tour {Math.floor(step / 4) + 1} · {STAGE_INFO[stage].label} ({STAGE_INFO[stage].who})
        </b>{' '}
        <T>{LOOP_EXAMPLES[stage] ?? ''}</T>
      </p>
      <div className="illus__row">
        <button type="button" className="btn btn--small btn--secondary" onClick={() => { setAuto(false); setStep((s) => s + 1); }}>
          Étape suivante
        </button>
        <button type="button" className="btn btn--small btn--ghost" onClick={() => setAuto((a) => !a)}>
          {auto ? 'Pause' : 'Lecture auto'}
        </button>
      </div>
    </div>
  );
}

/* 6. Qui fait quoi */
const TRANSCRIPT: { who: 'Modèle' | 'Harnais' | 'Monde'; text: string }[] = [
  { who: 'Modèle', text: 'ACTION : reserver_salle(salle="C101")' },
  { who: 'Harnais', text: 'Lit la demande et appelle le vrai système de réservation.' },
  { who: 'Monde', text: 'Erreur : la C101 vient d’être prise.' },
  { who: 'Harnais', text: 'Renvoie au modèle : « RÉSULTAT : ERREUR, C101 indisponible ».' },
  { who: 'Modèle', text: 'ACTION : reserver_salle(salle="C102")' },
  { who: 'Harnais', text: 'Exécute, puis renvoie : « Confirmé, n° 4471 ».' },
  { who: 'Modèle', text: 'RÉPONSE FINALE : C102 réservée, confirmation n° 4471.' },
  { who: 'Harnais', text: 'Réponse finale détectée : fin de la boucle.' },
];

function WhoDoesWhatIllustration() {
  const [shown, setShown] = useState(1);
  const done = shown >= TRANSCRIPT.length;
  return (
    <div className="illus">
      <ol className="transcript">
        {TRANSCRIPT.slice(0, shown).map((line, i) => (
          <li key={i} className={`transcript__line transcript__line--${line.who === 'Modèle' ? 'model' : line.who === 'Harnais' ? 'harness' : 'world'}`}>
            <span className="transcript__who">{line.who}</span>
            <span className={line.text.startsWith('ACTION') || line.text.startsWith('RÉPONSE') ? 'data' : ''}>
              <T>{line.text}</T>
            </span>
          </li>
        ))}
      </ol>
      <button type="button" className="btn btn--small btn--secondary" onClick={() => setShown(done ? 1 : shown + 1)}>
        {done ? (
          'Recommencer'
        ) : (
          <>
            Étape suivante <Icon name="arrow-right" size={10} />
          </>
        )}
      </button>
    </div>
  );
}

export const ILLUSTRATIONS: Record<string, ComponentType> = {
  ...LEVEL2_ILLUSTRATIONS,
  ...LEVEL3_ILLUSTRATIONS,
  ...LEVEL4_ILLUSTRATIONS,
  ...LEVEL5_ILLUSTRATIONS,
  tokenizer: TokenizerIllustration,
  'next-token': NextTokenIllustration,
  'context-window': ContextWindowIllustration,
  'model-harness': ModelHarnessIllustration,
  'agent-loop': AgentLoopIllustration,
  'who-does-what': WhoDoesWhatIllustration,
};
