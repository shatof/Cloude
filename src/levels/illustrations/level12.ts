import { hotspotIllustration, stepsIllustration, toggleIllustration } from './kit';

export const LEVEL12_ILLUSTRATIONS = {
  'l12-hitl': toggleIllustration([
    {
      label: 'Action à fort enjeu',
      lines: [
        { who: 'Bob', tone: 'model', text: '« Prêt à payer 40 € de fournitures. »' },
        { who: 'Harnais', tone: 'harness', text: 'Action sensible : demande de validation à Inès.' },
        { who: 'Inès', tone: 'user', text: '« Je vérifie le panier… c’est bon, je valide. »' },
        { who: 'Bob', tone: 'good', text: 'Paiement effectué, après le feu vert.' },
      ],
      caption: 'Payer, envoyer, supprimer, publier : l’humain valide avant.',
    },
    {
      label: 'Action à faible enjeu',
      lines: [
        { who: 'Bob', tone: 'model', text: '« Je compare les prix de trois marchands. »' },
        { who: 'Harnais', tone: 'harness', text: 'Sans conséquence : on laisse faire, Inès supervise.' },
        { who: 'Bob', tone: 'good', text: '« Le moins cher est à 38 €, chez un marchand agréé. »' },
      ],
      caption: 'Pour le reste, l’humain supervise sans valider chaque geste : pas de fatigue d’approbation.',
    },
  ]),
  'l12-killswitch': stepsIllustration(
    [
      { who: 'Bob', tone: 'model', text: 'Lance 12 commandes et délègue à des sous-agents.' },
      { who: 'Inès', tone: 'user', text: 'Appuie sur le bouton « Tout arrêter ».' },
      { who: 'Harnais', tone: 'harness', text: 'Coupe la boucle de Bob, immédiatement.' },
      { who: 'Harnais', tone: 'harness', text: 'Suspend les sous-agents et gèle les paiements non confirmés.' },
      { who: 'État', tone: 'good', text: 'Tout est arrêté, rien n’est à moitié fait : Inès peut inspecter et reprendre.' },
    ],
    'L’arrêt vient de l’extérieur, couvre toute l’arborescence, et laisse un état propre.',
  ),
  'l12-rules': hotspotIllustration({
    frame: 'Règles du jeu',
    center: 'L’autonomie, mais **bornée**',
    spots: [
      { label: 'Risque inacceptable', desc: 'Certains usages sont interdits : l’EU AI Act les proscrit (applicables depuis début 2025).' },
      { label: 'Haut risque', desc: 'Obligations lourdes, dont une supervision humaine ; échéances par paliers, parfois ajustées.' },
      { label: 'Mandat', desc: 'Pour payer à ta place : plafond, périmètre, durée, preuve de ton accord.' },
      { label: 'Protocoles', desc: 'AP2 (Google), Agentic Commerce Protocol (OpenAI, Stripe), présentés en 2025.' },
      { label: 'Traçabilité', desc: 'Qui a décidé, qui a payé, dans quelles limites : tout se retrouve et se conteste.' },
    ],
  }),
};
