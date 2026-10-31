import { barsIllustration, stepsIllustration, toggleIllustration } from './kit';

export const LEVEL3_ILLUSTRATIONS = {
  'l3-cot': toggleIllustration([
    {
      label: 'Au réflexe',
      lines: [
        { who: 'Inès', tone: 'user', text: 'Batte + balle = 1,10 €. La batte coûte 1 € de plus. Prix de la balle ?' },
        { who: 'Modèle', tone: 'bad', text: '« 0,10 €. »' },
        { who: 'Vérif', tone: 'note', text: 'Balle 0,10 € + batte 1,10 € = 1,20 €, pas 1,10 €.' },
      ],
      caption: 'Sans étapes, le modèle doit sauter directement à la réponse : il prend la plus « évidente ».',
    },
    {
      label: 'Étape par étape',
      lines: [
        { who: 'Modèle', tone: 'model', text: 'Soit x le prix de la balle. La batte coûte x + 1.' },
        { who: 'Modèle', tone: 'model', text: 'x + (x + 1) = 1,10, donc 2x = 0,10.' },
        { who: 'Modèle', tone: 'model', text: 'Donc x = 0,05 €.' },
        { who: 'Vérif', tone: 'good', text: 'Balle 0,05 € + batte 1,05 € = 1,10 €.' },
      ],
      caption: 'Chaque ligne s’appuie sur la précédente : le modèle a un brouillon, et on peut le relire.',
    },
  ]),
  'l3-react': stepsIllustration(
    [
      { who: 'Pensée', tone: 'model', text: '« Il me faut les salles libres jeudi à 14 h. »' },
      { who: 'Action', tone: 'model', text: 'consulter_planning(jour="jeudi", heure="14:00")', code: true },
      { who: 'Observation', tone: 'world', text: '« Libres : C101, C204, B012. »' },
      { who: 'Pensée', tone: 'model', text: '« Laquelle est la plus proche de l’amphi B ? »' },
      { who: 'Action', tone: 'model', text: 'plan_campus(depuis="amphi B")', code: true },
      { who: 'Observation', tone: 'world', text: '« B012 : 1 min, C101 : 4 min, C204 : 6 min. »' },
      { who: 'Pensée', tone: 'model', text: '« B012 est la plus proche : je la réserve. »' },
      { who: 'Action', tone: 'model', text: 'reserver_salle(salle="B012", jour="jeudi", heure="14:00")', code: true },
      { who: 'Observation', tone: 'world', text: '« Confirmé, n° 5120. »' },
      { who: 'Réponse', tone: 'good', text: '« B012 réservée jeudi à 14 h, à une minute de l’amphi B. »' },
    ],
    'Pensée, action, observation : chaque observation nourrit la pensée suivante, jusqu’à la réponse.',
  ),
  'l3-effort': barsIllustration({
    unit: '% de réussite',
    sets: [
      {
        label: 'Question simple',
        rows: [
          { label: 'Effort faible : 200 tokens', value: 97, tone: 'good' },
          { label: 'Effort moyen : 2 000 tokens', value: 97, tone: 'world' },
          { label: 'Effort élevé : 20 000 tokens', value: 98, tone: 'bad' },
        ],
        caption: 'Traduire « merci » : réfléchir cent fois plus ne change presque rien… sauf la facture. (Chiffres illustratifs.)',
      },
      {
        label: 'Problème difficile',
        rows: [
          { label: 'Effort faible : 200 tokens', value: 30, tone: 'bad' },
          { label: 'Effort moyen : 2 000 tokens', value: 55, tone: 'world' },
          { label: 'Effort élevé : 20 000 tokens', value: 78, tone: 'good' },
        ],
        caption: 'Débugger un test capricieux : chaque palier de réflexion fait gagner des points. (Chiffres illustratifs.)',
      },
    ],
  }),
};
