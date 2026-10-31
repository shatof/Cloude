import { hotspotIllustration, toggleIllustration } from './kit';

export const LEVELFINAL_ILLUSTRATIONS = {
  'final-journey': hotspotIllustration({
    frame: 'Ton parcours',
    center: '**Agent = modèle + harnais**',
    spots: [
      { label: '0 · Modèle', desc: 'Prédire le token suivant dans une fenêtre de contexte.' },
      { label: '1-2 · Agir', desc: 'La boucle et les outils : percevoir, raisonner, agir, observer.' },
      { label: '3-4 · Penser', desc: 'Raisonnement, planification : réfléchir avant et pendant l’action.' },
      { label: '5-6 · Savoir', desc: 'Mémoire, RAG, contexte soigné : le bon savoir, au bon moment.' },
      { label: '7 · Encadrer', desc: 'Arrêts, compaction, permissions, sandbox, hooks, vérification.' },
      { label: '8-10 · Grandir', desc: 'Multi-agents, protocoles, endurance et évaluation.' },
      { label: '11-12 · Protéger', desc: 'Sécurité et gouvernance : garder l’humain aux commandes.' },
    ],
  }),
  'final-architect': toggleIllustration([
    {
      label: 'Le Double',
      lines: [
        { who: 'Modèle', tone: 'model', text: 'Le même cerveau que Bob.' },
        { who: 'Harnais', tone: 'bad', text: 'Une boucle, et rien d’autre.' },
        { who: 'Résultat', tone: 'bad', text: 'Se perd, se fait manipuler, dérape sur le paiement.' },
      ],
      caption: 'Même modèle, harnais vide : l’agent échoue.',
    },
    {
      label: 'Bob l’architecte',
      lines: [
        { who: 'Modèle', tone: 'model', text: 'Exactement le même cerveau.' },
        { who: 'Harnais', tone: 'good', text: 'Choisi pour le cas : mémoire, bouclier, vérification, mandat, arrêt.' },
        { who: 'Écartés', tone: 'note', text: 'Les pièces superflues, laissées de côté.' },
        { who: 'Résultat', tone: 'good', text: 'Fiable, sûr, et sobre.' },
      ],
      caption: 'Même modèle, harnais pensé pour le cas : l’agent réussit. Toute la différence est là.',
    },
  ]),
};
