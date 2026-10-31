import { barsIllustration, stepsIllustration, toggleIllustration } from './kit';

export const LEVEL6_ILLUSTRATIONS = {
  'l6-budget': barsIllustration({
    unit: 'tokens',
    sets: [
      {
        label: 'Tout charger',
        rows: [
          { label: 'Consignes', value: 800, tone: 'harness' },
          { label: 'Outils (60)', value: 12000, tone: 'bad' },
          { label: 'Historique', value: 40000, tone: 'bad' },
          { label: 'Poly entier', value: 90000, tone: 'bad' },
          { label: 'Question', value: 50, tone: 'user' },
        ],
        caption: 'Près de 143 000 tokens : lent, cher, et la question d’Inès pèse à peine 50 tokens dans le lot.',
      },
      {
        label: 'Contexte choisi',
        rows: [
          { label: 'Consignes', value: 800, tone: 'harness' },
          { label: 'Outils (3 utiles)', value: 900, tone: 'good' },
          { label: 'Résumé de l’historique', value: 500, tone: 'good' },
          { label: 'Chapitre utile', value: 3000, tone: 'good' },
          { label: 'Question', value: 50, tone: 'user' },
        ],
        caption: '5 250 tokens : tout ce qui compte est là, et rien ne noie la question.',
      },
    ],
  }),
  'l6-skills': stepsIllustration(
    [
      { who: 'Contexte', tone: 'harness', text: 'Skills : fiche-revision, relecture-python, planning-revisions (une ligne chacune)' },
      { who: 'Inès', tone: 'user', text: 'Fais-moi une fiche sur le chapitre TCP.' },
      { who: 'Modèle', tone: 'model', text: '« Ça correspond à la skill fiche-revision : je l’ouvre. »' },
      { who: 'Harnais', tone: 'harness', text: 'Charge fiche-revision/SKILL.md : 1 200 tokens d’instructions et un modèle de fiche.' },
      { who: 'Modèle', tone: 'good', text: '« Voici ta fiche TCP d’une page, au format demandé. »' },
    ],
    'Les descriptions sont toujours là ; le contenu complet n’arrive que quand il sert.',
  ),
  'l6-rot': toggleIllustration([
    {
      label: 'Perdu au milieu',
      lines: [
        { who: 'Début', tone: 'good', text: 'Consignes de Bob' },
        { who: 'Milieu', tone: 'bad', text: '… page 40 sur 80 : « Rendu sur Moodle avant vendredi 18 h » …' },
        { who: 'Fin', tone: 'good', text: 'Question d’Inès : « Comment rendre le projet ? »' },
        { who: 'Modèle', tone: 'bad', text: '« Par mail, je crois. »' },
      ],
      caption: 'L’information était là, mais noyée au milieu d’un très long contexte.',
    },
    {
      label: 'Empoisonné',
      lines: [
        { who: 'Note', tone: 'bad', text: 'partiel réseaux : 21/01   (erreur notée il y a un mois)', code: true },
        { who: 'Modèle', tone: 'bad', text: '« Ton partiel est le 21 janvier ! »' },
        { who: 'Modèle', tone: 'bad', text: '« Planning jusqu’au 21 janvier, comme prévu. »' },
      ],
      caption: 'Une erreur entrée en mémoire est relue et répétée à chaque tour.',
    },
    {
      label: 'Contexte soigné',
      lines: [
        { who: 'Début', tone: 'good', text: 'Consignes, puis la règle clé : « Rendu sur Moodle avant vendredi 18 h »' },
        { who: 'Note', tone: 'good', text: 'partiel réseaux : 12/01   (vérifié sur l’ENT)', code: true },
        { who: 'Modèle', tone: 'good', text: '« Rendu sur Moodle avant vendredi 18 h. Et ton partiel est le 12 janvier. »' },
      ],
      caption: 'Court, ordonné, vérifié : les informations clés sont au bon endroit, et justes.',
    },
  ]),
};
