import { stepsIllustration, toggleIllustration } from './kit';

export const LEVEL8_ILLUSTRATIONS = {
  'l8-orchestra': stepsIllustration(
    [
      { who: 'Orchestrateur', tone: 'model', text: '« 30 articles indépendants : je lance 5 sous-agents, 6 articles chacun. »' },
      { who: 'Brief n° 3', tone: 'note', text: 'Articles 13 à 18 | 5 lignes chacun : question, méthode, résultat, limite | PDF fournis uniquement', code: true },
      { who: 'Sous-agents', tone: 'world', text: 'Les 5 sous-agents lisent en parallèle, chacun dans son propre contexte.' },
      { who: 'Retour n° 3', tone: 'good', text: '6 résumés de 5 lignes : 1 800 tokens rendus pour 60 000 lus.' },
      { who: 'Orchestrateur', tone: 'model', text: '« J’assemble les 30 résumés et je dégage les tendances. »' },
    ],
    'Chaque sous-agent lit beaucoup et rend peu : le contexte de l’orchestrateur reste léger.',
  ),
  'l8-when': toggleIllustration([
    {
      label: 'Tâche large',
      lines: [
        { who: 'Mission', tone: 'user', text: 'Résumer 30 articles indépendants.' },
        { who: 'Seul', tone: 'bad', text: 'Un agent : 3 heures, contexte compacté quatre fois, résumés mélangés.' },
        { who: 'À cinq', tone: 'good', text: 'Cinq sous-agents : 20 minutes, contextes légers.' },
        { who: 'Prix', tone: 'note', text: 'Nettement plus de tokens au total.' },
      ],
      caption: 'Gros gain de temps et de qualité : ici, le surcoût se justifie.',
    },
    {
      label: 'Tâche très liée',
      lines: [
        { who: 'Mission', tone: 'user', text: 'Renommer une fonction utilisée dans trois fichiers liés.' },
        { who: 'Agent A', tone: 'model', text: 'Renomme la fonction dans api.py.' },
        { who: 'Agent B', tone: 'bad', text: 'L’appelle encore sous l’ancien nom dans app.py.' },
        { who: 'Résultat', tone: 'bad', text: 'Le projet ne démarre plus.' },
      ],
      caption: 'Quand tout dépend de tout, plusieurs agents se marchent dessus : un seul garde une vue cohérente.',
    },
  ]),
  'l8-swarm': stepsIllustration(
    [
      { who: 'Client', tone: 'user', text: 'On m’a prélevé deux fois mon abonnement !' },
      { who: 'Accueil', tone: 'model', text: '« Problème de paiement : je passe le relais à la facturation. »' },
      { who: 'Relais', tone: 'harness', text: 'handoff(vers="facturation", resume="double prélèvement du 3/11, 9,99 €")', code: true },
      { who: 'Facturation', tone: 'model', text: '« Deux paiements identiques confirmés : relais aux remboursements. »' },
      { who: 'Remboursements', tone: 'good', text: '« Doublon remboursé : 9,99 €, sous trois jours. »' },
    ],
    'Pas de chef : chaque spécialiste passe la main avec le contexte utile. Règle d’or : limiter le nombre de relais.',
  ),
};
