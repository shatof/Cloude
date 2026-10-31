import { barsIllustration, hotspotIllustration, stepsIllustration } from './kit';

export const LEVEL10_ILLUSTRATIONS = {
  'l10-checkpoints': stepsIllustration(
    [
      { who: 'Session 1', tone: 'model', text: '« Fonctionnalités 1 à 3 terminées et testées. »' },
      { who: 'Commit', tone: 'harness', text: 'git commit -m "quiz : questions aléatoires (tests OK)"', code: true },
      { who: 'Notes', tone: 'note', text: 'progression.md : fait 1-3 | reste 4-9 | bug connu : stats vides', code: true },
      { who: 'Harnais', tone: 'harness', text: 'Fin de la session.' },
      { who: 'Session 2', tone: 'model', text: '« Je lis progression.md et git log, je lance les tests : tout passe. »' },
      { who: 'Session 2', tone: 'good', text: '« Je reprends à la fonctionnalité 4. »' },
    ],
    'Rien n’est gardé « en tête » : tout l’état du travail est écrit, et la session suivante repart du dernier camp.',
  ),
  'l10-benchmarks': hotspotIllustration({
    frame: 'Benchmarks',
    center: 'Des examens pour agents',
    spots: [
      { label: 'SWE-bench Verified', desc: 'De vrais bugs de projets Python open source : réussi si les tests du projet passent.' },
      { label: 'Terminal-Bench', desc: 'Des tâches à accomplir dans un terminal : compiler, configurer, déboguer.' },
      { label: 'OSWorld', desc: 'Utiliser un ordinateur à la souris et au clavier, comme un humain.' },
      { label: 'tau-bench', desc: 'Servir des clients simulés en respectant des règles métier.' },
      { label: 'Contamination', desc: 'Si les questions ont fuité dans les données d’entraînement, le score ment.' },
    ],
  }),
  'l10-eval': barsIllustration({
    unit: '% de réussite',
    sets: [
      {
        label: 'Un seul essai',
        rows: [
          { label: 'Version A', value: 0, tone: 'bad' },
          { label: 'Version B', value: 100, tone: 'good' },
        ],
        caption: 'Sur une seule tâche, B réussit et A échoue. Verdict hâtif !',
      },
      {
        label: '50 tâches, 4 essais',
        rows: [
          { label: 'Version A', value: 78, tone: 'good' },
          { label: 'Version B', value: 64, tone: 'bad' },
        ],
        caption: 'Sur 200 essais corrigés par des tests, A est nettement plus fiable. (Chiffres illustratifs.)',
      },
    ],
  }),
};
