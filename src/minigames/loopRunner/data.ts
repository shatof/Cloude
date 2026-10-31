/**
 * Données de « Tu es le harnais » (niveau 1).
 */

export type LoopStage = 'percevoir' | 'raisonner' | 'agir' | 'observer';

export const LOOP_ORDER: LoopStage[] = ['percevoir', 'raisonner', 'agir', 'observer'];

export const STAGE_INFO: Record<LoopStage, { label: string; who: 'Harnais' | 'Modèle'; hint: string }> = {
  percevoir: { label: 'Percevoir', who: 'Harnais', hint: 'rassembler l’objectif et les infos dans le contexte' },
  raisonner: { label: 'Raisonner', who: 'Modèle', hint: 'analyser et choisir la prochaine action' },
  agir: { label: 'Agir', who: 'Harnais', hint: 'exécuter l’action demandée' },
  observer: { label: 'Observer', who: 'Harnais', hint: 'remettre le résultat dans le contexte' },
};

/** Score d'ordonnancement : positions correctes / 4. */
export function orderScore(proposed: readonly LoopStage[]): number {
  return LOOP_ORDER.filter((stage, i) => proposed[i] === stage).length / LOOP_ORDER.length;
}

export interface SortItem {
  id: string;
  text: string;
  owner: 'modele' | 'harnais';
  why: string;
}

export const SORT_ITEMS: SortItem[] = [
  { id: 'choose', text: 'Choisir la prochaine action', owner: 'modele', why: 'Décider, c’est le travail du cerveau.' },
  { id: 'exec', text: 'Exécuter l’appel reserver_salle', owner: 'harnais', why: 'Le modèle n’a pas accès au système : le harnais l’appelle.' },
  { id: 'append', text: 'Ajouter le résultat de l’action au contexte', owner: 'harnais', why: 'C’est l’étape « observer », gérée par le harnais.' },
  { id: 'error', text: 'Interpréter un message d’erreur et changer de plan', owner: 'modele', why: 'Comprendre et réviser le plan demande du raisonnement.' },
  { id: 'limit', text: 'Arrêter la boucle après 10 tours', owner: 'harnais', why: 'Les garde-fous sont codés dans le harnais.' },
  { id: 'final', text: 'Rédiger la réponse finale pour Inès', owner: 'modele', why: 'Le modèle écrit ; le harnais transmet.' },
];

export interface LoopTurn {
  /** Ce que le modèle écrit à ce tour. */
  thought: string;
  action: string;
  options: { id: string; text: string; correct?: boolean; feedback: string }[];
  /** Résultat renvoyé au modèle si le harnais fait le bon choix. */
  observation?: string;
  /** Étape mise en avant sur le schéma de la boucle pendant la décision. */
  stage: LoopStage;
}

const EXECUTE = 'Exécuter l’action et renvoyer le résultat à Bob';

export const LOOP_TURNS: LoopTurn[] = [
  {
    thought: 'Je dois d’abord savoir quelles salles sont libres jeudi à 14 h.',
    action: 'consulter_planning(jour="jeudi", heure="14:00")',
    stage: 'agir',
    options: [
      { id: 'exec', text: EXECUTE, correct: true, feedback: 'Bien : le harnais exécute, puis l’observation revient dans le contexte.' },
      { id: 'show', text: 'Afficher ce texte à Inès et s’arrêter', feedback: 'C’est le comportement du chatbot : l’action n’est jamais exécutée.' },
      { id: 'blind', text: 'Exécuter l’action sans montrer le résultat à Bob', feedback: 'Bob ne saura jamais ce que dit le planning : il ne peut pas choisir de salle.' },
    ],
    observation: 'B204 : occupée (TD) · C101 : libre · C102 : libre',
  },
  {
    thought: 'C101 est libre. Je la réserve.',
    action: 'reserver_salle(salle="C101", jour="jeudi", heure="14:00")',
    stage: 'agir',
    options: [
      { id: 'refuse', text: 'Refuser : Bob n’a pas le droit de réserver', feedback: 'La réservation fait partie de la mission : rien ne justifie de bloquer ici.' },
      { id: 'exec', text: EXECUTE, correct: true, feedback: 'Exact. Et le monde réserve une surprise…' },
      { id: 'skip', text: 'Répondre « C’est fait ! » sans rien exécuter', feedback: 'C’est exactement l’erreur de Bob-chatbot !' },
    ],
    observation: 'ERREUR : C101 vient d’être réservée par quelqu’un d’autre.',
  },
  {
    thought: 'Raté, C101 n’est plus libre. C102 l’était aussi : je tente C102.',
    action: 'reserver_salle(salle="C102", jour="jeudi", heure="14:00")',
    stage: 'observer',
    options: [
      { id: 'stop', text: 'Arrêter la boucle : il y a eu une erreur', feedback: 'Une erreur n’est pas une fin : c’est une observation. Grâce à elle, Bob adapte son plan.' },
      { id: 'repeat', text: 'Relancer exactement la même action sur C101', feedback: 'Le harnais exécute ce que le modèle demande : Bob a déjà corrigé son plan.' },
      { id: 'exec', text: EXECUTE, correct: true, feedback: 'Oui : l’observation de l’erreur a permis à Bob de changer de plan.' },
    ],
    observation: 'Réservation confirmée : C102, jeudi 14:00, n° 4471.',
  },
  {
    thought: 'La réservation est confirmée, j’ai le numéro.',
    action: 'RÉPONSE FINALE : « C’est réservé : salle C102, jeudi à 14 h (confirmation n° 4471). »',
    stage: 'raisonner',
    options: [
      { id: 'loop', text: 'Continuer la boucle', feedback: 'Bob a donné sa réponse finale : continuer ferait tourner l’agent pour rien.' },
      { id: 'stop', text: 'Arrêter la boucle et transmettre la réponse à Inès', correct: true, feedback: 'Parfait : la réponse finale est une condition d’arrêt.' },
      { id: 'check', text: 'Relancer consulter_planning pour être sûr', feedback: 'La confirmation n° 4471 est déjà une vérification.' },
    ],
  },
  {
    thought: 'Variante, un autre jour : le système de réservation est en panne. Bob réessaie… pour la 12e fois.',
    action: 'reserver_salle(salle="C102", jour="vendredi", heure="10:00")  → ERREUR 503 (× 12)',
    stage: 'agir',
    options: [
      { id: 'wait', text: 'Laisser tourner : Bob finira par y arriver', feedback: 'Sans limite, l’agent peut tourner des heures et coûter cher.' },
      { id: 'hide', text: 'Effacer l’erreur du contexte pour que Bob ne la voie plus', feedback: 'Cacher les erreurs empêche Bob de comprendre ; le problème reste entier.' },
      { id: 'limit', text: 'Arrêter : limite de tentatives atteinte, prévenir Inès', correct: true, feedback: 'Oui : c’est un garde-fou. On rend la main à l’humain avec un message clair.' },
    ],
  },
];
