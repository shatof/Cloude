import type { LevelId } from '../content/types';

/**
 * Les pièces du harnais de Bob : une par niveau, plus la cape du boss final.
 * Le modèle (le « cerveau ») ne figure pas ici : il ne change jamais.
 */
export interface HarnessPiece {
  id: string;
  levelId: LevelId;
  name: string;
  /** Rôle en une ligne. */
  role: string;
  /** Ce que fait cette pièce dans un vrai harnais d'agent. */
  realWorld: string;
  /** Ce que Bob sait faire grâce à elle. */
  capability: string;
  /** Côté de l'emplacement sur la fiche d'équipement. */
  side: 'left' | 'right';
}

export const HARNESS_PIECES: HarnessPiece[] = [
  {
    id: 'context-gauge',
    levelId: 'l0',
    name: 'Jauge de contexte',
    role: 'Mesure le remplissage de la fenêtre de contexte.',
    realWorld:
      "Le harnais compte les tokens envoyés au modèle à chaque appel, garde l'historique de la conversation et prévient avant que la fenêtre ne déborde.",
    capability: 'Surveille le remplissage de sa fenêtre de contexte',
    side: 'left',
  },
  {
    id: 'loop-engine',
    levelId: 'l1',
    name: 'Moteur de boucle',
    role: 'Fait tourner percevoir → raisonner → agir → observer.',
    realWorld:
      "Le harnais appelle le modèle, exécute l'action demandée, réinjecte le résultat dans le contexte et s'arrête sur une réponse finale ou un garde-fou (tours, budget, temps).",
    capability: 'Enchaîne percevoir, raisonner, agir, observer',
    side: 'right',
  },
  {
    id: 'tool-belt',
    levelId: 'l2',
    name: 'Ceinture à outils',
    role: 'Déclare des outils et exécute leurs appels.',
    realWorld:
      'Le harnais décrit chaque outil (nom, rôle, paramètres) au modèle, valide les appels qu’il produit et les exécute.',
    capability: 'Utilise des outils avec les bons paramètres',
    side: 'left',
  },
  {
    id: 'thinking-hourglass',
    levelId: 'l3',
    name: 'Sablier de réflexion',
    role: 'Donne du temps pour raisonner avant d’agir.',
    realWorld:
      'Le harnais active la réflexion du modèle (chain of thought, ReAct) et règle le budget de calcul au moment de répondre (test-time compute).',
    capability: 'Prend le temps de raisonner avant d’agir',
    side: 'right',
  },
  {
    id: 'plan-board',
    levelId: 'l4',
    name: 'Carnet de plan',
    role: 'Découpe une mission en étapes.',
    realWorld: 'Le harnais tient une liste de tâches que le modèle crée, suit et met à jour au fil de la mission.',
    capability: 'Découpe une mission en étapes',
    side: 'left',
  },
  {
    id: 'memory-pack',
    levelId: 'l5',
    name: 'Sac à mémoire',
    role: 'Retient ce qui compte d’une session à l’autre.',
    realWorld:
      'Le harnais branche des mémoires : historique court terme, notes long terme, recherche documentaire (RAG), fichiers de mémoire et cache.',
    capability: 'Se souvient d’une session à l’autre',
    side: 'right',
  },
  {
    id: 'skill-cartridges',
    levelId: 'l6',
    name: 'Cartouches de skills',
    role: 'Charge le bon contexte au bon moment.',
    realWorld:
      'Le harnais gère le budget de tokens et ne charge les instructions spécialisées (skills) que lorsqu’elles servent.',
    capability: 'Charge le bon contexte au bon moment',
    side: 'left',
  },
  {
    id: 'harness-frame',
    levelId: 'l7',
    name: 'Armature de harnais',
    role: 'Encadre l’agent : arrêts, compaction, permissions, sandbox, hooks.',
    realWorld:
      'Le harnais fixe les conditions d’arrêt, résume l’historique trop long, demande des permissions, isole l’exécution et vérifie le travail.',
    capability: 'Travaille dans un cadre sûr et vérifié',
    side: 'right',
  },
  {
    id: 'drone-bay',
    levelId: 'l8',
    name: 'Baie à drones',
    role: 'Lance des sous-agents.',
    realWorld:
      'Le harnais d’un orchestrateur crée des sous-agents avec leur propre contexte, leur confie des tâches et rassemble leurs résultats.',
    capability: 'Délègue à des sous-agents',
    side: 'left',
  },
  {
    id: 'protocol-antenna',
    levelId: 'l9',
    name: 'Antenne protocoles',
    role: 'Parle MCP aux outils et A2A aux agents.',
    realWorld:
      'Le harnais se connecte à des serveurs d’outils standardisés (MCP) et dialogue avec d’autres agents décrits par leur Agent Card (A2A).',
    capability: 'Se branche aux outils et aux autres agents',
    side: 'right',
  },
  {
    id: 'eval-badge',
    levelId: 'l10',
    name: 'Badge d’évaluation',
    role: 'Tient la distance et mesure les résultats.',
    realWorld:
      'Le harnais fait persister l’agent sur des tâches de plusieurs heures ; un harnais d’évaluation, distinct, mesure ses performances.',
    capability: 'Tient la distance et mesure ses performances',
    side: 'left',
  },
  {
    id: 'prompt-shield',
    levelId: 'l11',
    name: 'Bouclier anti-injection',
    role: 'Un contenu non fiable n’hérite jamais de l’autorité de l’utilisateur.',
    realWorld:
      'Le harnais sépare instructions et données, limite les privilèges de l’agent et bloque les actions dictées par un contenu non fiable.',
    capability: 'Résiste aux injections de prompt',
    side: 'right',
  },
  {
    id: 'kill-switch',
    levelId: 'l12',
    name: 'Arrêt d’urgence',
    role: 'Garde un humain aux commandes.',
    realWorld:
      'Le harnais demande validation pour les actions sensibles, journalise tout et peut être interrompu à tout moment.',
    capability: 'Reste interruptible et sous contrôle humain',
    side: 'left',
  },
  {
    id: 'architect-cape',
    levelId: 'final',
    name: 'Cape d’architecte',
    role: 'Le harnais complet, conçu par toi.',
    realWorld: 'Toutes les pièces assemblées et réglées pour un cas réel.',
    capability: 'Porte un harnais complet, pensé pour un vrai cas',
    side: 'right',
  },
];

const BY_ID = new Map(HARNESS_PIECES.map((p) => [p.id, p]));

export function getPiece(id: string): HarnessPiece | undefined {
  return BY_ID.get(id);
}

export function pieceForLevel(levelId: LevelId): HarnessPiece | undefined {
  return HARNESS_PIECES.find((p) => p.levelId === levelId);
}
