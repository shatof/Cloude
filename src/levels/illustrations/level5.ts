import { barsIllustration, stepsIllustration, toggleIllustration } from './kit';

export const LEVEL5_ILLUSTRATIONS = {
  'l5-memory': toggleIllustration([
    {
      label: 'Sans mémoire',
      lines: [
        { who: 'Harnais', tone: 'harness', text: 'Nouvelle session : contexte vide.' },
        { who: 'Inès', tone: 'user', text: 'Fais-moi un planning avant mon partiel.' },
        { who: 'Modèle', tone: 'bad', text: '« Quel partiel ? À quelle date ? »' },
      ],
      caption: 'Tout ce qui a été dit la veille a disparu avec l’ancien contexte.',
    },
    {
      label: 'Avec un fichier de mémoire',
      lines: [
        { who: 'Harnais', tone: 'harness', text: 'Nouvelle session : je charge memoire.md dans le contexte.' },
        { who: 'Fichier', tone: 'harness', text: '- L3 info  - partiel de réseaux le 12/01  - aime les schémas', code: true },
        { who: 'Inès', tone: 'user', text: 'Fais-moi un planning avant mon partiel.' },
        { who: 'Modèle', tone: 'good', text: '« Voici ton planning jusqu’au 12 janvier, avec un schéma par séance. »' },
        { who: 'Modèle', tone: 'model', text: 'ecrire_memoire("Planning de révision envoyé le 3/11")', code: true },
      ],
      caption: 'Les notes vivent hors du modèle : le harnais les relit, l’agent les tient à jour.',
    },
  ]),
  'l5-rag': stepsIllustration(
    [
      { who: 'Inès', tone: 'user', text: 'Quel exercice le prof conseille-t-il de refaire avant le partiel ?' },
      { who: 'Harnais', tone: 'harness', text: 'Cherche parmi les 600 passages du poly, déjà découpés et indexés.' },
      { who: 'Recherche', tone: 'world', text: 'Passages les plus proches : p. 214, p. 212, p. 37.' },
      { who: 'Harnais', tone: 'harness', text: 'Place ces trois passages dans le contexte, avec leur numéro de page.' },
      { who: 'Modèle', tone: 'good', text: '« D’après la page 214 : refais l’exercice 7, sur le contrôle de congestion. »' },
    ],
    'Le modèle répond à partir des passages retrouvés, et cite sa source : Inès peut vérifier.',
  ),
  'l5-cache': barsIllustration({
    unit: 's d’attente',
    sets: [
      {
        label: 'Sans cache',
        rows: [
          { label: 'Question 1', value: 12, tone: 'bad' },
          { label: 'Question 2', value: 12, tone: 'bad' },
          { label: 'Question 3', value: 12, tone: 'bad' },
        ],
        caption: 'Consignes et poly sont recalculés à chaque question. (Chiffres illustratifs.)',
      },
      {
        label: 'Avec cache',
        rows: [
          { label: 'Question 1', value: 12, tone: 'world' },
          { label: 'Question 2', value: 3, tone: 'good' },
          { label: 'Question 3', value: 3, tone: 'good' },
        ],
        caption: 'Le long début identique est calculé une fois, puis réutilisé : seule la question change. (Chiffres illustratifs.)',
      },
    ],
  }),
};
