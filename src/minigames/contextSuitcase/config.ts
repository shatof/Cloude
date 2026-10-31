import type { MiniGameConfig } from '../kit/types';

const SKILLS = `Skills disponibles (seules ces lignes sont dans le contexte) :
fiche-revision      Crée une fiche de révision d’une page à partir d’un cours.
relecture-python    Relit du code Python, signale les bugs, propose des tests.
cv-universite       Met en forme un CV au format de l’université.
planning-revisions  Construit un planning de révision jusqu’à un examen.`;

const skill = {
  fiche: { id: 'fiche', text: '`fiche-revision`' },
  python: { id: 'python', text: '`relecture-python`' },
  cv: { id: 'cv', text: '`cv-universite`' },
  planning: { id: 'planning', text: '`planning-revisions`' },
  none: { id: 'none', text: 'Aucune skill' },
};

export const contextSuitcaseConfig: MiniGameConfig = {
  title: 'La valise de contexte',
  rounds: [
    {
      kind: 'budget',
      title: 'La valise',
      instructions:
        'Tu prépares le **contexte** de Bob avant qu’il réponde. Le budget est serré : choisis ce qui l’aidera le plus, sans dépasser la limite.',
      task: 'Inès : « Corrige l’exercice 3 de mon TD de réseaux. »',
      budget: 8000,
      unit: 'tokens',
      items: [
        { id: 'system', text: 'Les consignes de Bob (qui il est, comment il travaille)', cost: 800, value: 10, why: 'Indispensable à chaque tour.' },
        { id: 'statement', text: 'L’énoncé de l’exercice 3', cost: 600, value: 10, why: 'Sans l’énoncé, impossible de corriger.' },
        { id: 'answer', text: 'La réponse d’Inès à l’exercice 3', cost: 400, value: 10, why: 'C’est précisément ce qu’il faut corriger.' },
        { id: 'chapter', text: 'Le chapitre du poly sur ce sujet', cost: 3000, value: 7, why: 'Le passage utile du poly, retrouvé par la recherche.' },
        { id: 'tools3', text: 'Les 3 outils utiles : `chercher_cours`, `executer_code`, `lire_fichier`', cost: 900, value: 6, why: 'Les seuls outils dont la tâche a besoin.' },
        { id: 'summary', text: 'Le résumé de la dernière session', cost: 500, value: 4, why: 'Un résumé court vaut mieux que tout l’historique.' },
        { id: 'note', text: 'La note « Inès aime les schémas »', cost: 50, value: 3, why: 'Minuscule et utile : Bob ajoutera un schéma.' },
        { id: 'tools57', text: 'Les 57 autres outils de Bob', cost: 7000, value: 1, why: 'Énorme et inutile ici : il distrait Bob et évince l’essentiel.' },
        { id: 'karim', text: 'Les notes de Karim sur un autre chapitre', cost: 2500, value: 1, why: 'Hors sujet pour cet exercice.' },
        { id: 'groceries', text: 'La liste de courses d’Inès', cost: 100, value: 0, why: 'Aucun rapport : c’est du bruit.' },
        { id: 'history', text: 'Trois mois d’historique de conversation', cost: 40000, value: 2, why: 'Ne tient même pas dans la valise : on garde le résumé.' },
        { id: 'poly', text: 'Le poly entier (300 pages)', cost: 90000, value: 8, why: 'Trop gros : on ne charge que le chapitre utile.' },
      ],
    },
    {
      kind: 'choice',
      title: 'La bonne cartouche',
      instructions:
        'Bob a quatre **skills**. Seules leurs descriptions sont dans son contexte. Pour chaque demande d’Inès, laquelle doit-il charger en entier ?',
      questions: [
        {
          id: 's-fiche',
          code: SKILLS,
          prompt: '« Fais-moi une fiche sur le chapitre TCP. »',
          options: [
            { ...skill.fiche, correct: true, feedback: 'Sa description correspond exactement à la demande.' },
            { ...skill.planning, feedback: 'Inès ne demande pas de planning, mais une fiche.' },
            { ...skill.python, feedback: 'Il n’y a pas de code ici.' },
            { ...skill.none, feedback: 'Une skill existe pour ça : autant en profiter.' },
          ],
        },
        {
          id: 's-python',
          code: SKILLS,
          prompt: '« Pourquoi ma fonction tri_fusion plante-t-elle sur une liste vide ? »',
          options: [
            { ...skill.python, correct: true, feedback: 'Du code Python à relire et un bug à trouver : c’est sa spécialité.' },
            { ...skill.fiche, feedback: 'Une fiche de cours ne corrigera pas le bug.' },
            { ...skill.cv, feedback: 'Aucun rapport.' },
            { ...skill.none, feedback: 'La skill de relecture apporte une méthode et des tests : utile ici.' },
          ],
        },
        {
          id: 's-planning',
          code: SKILLS,
          prompt: '« Organise mes révisions jusqu’au 12 janvier. »',
          options: [
            { ...skill.planning, correct: true, feedback: 'Un planning jusqu’à un examen : c’est sa description.' },
            { ...skill.fiche, feedback: 'Les fiches viendront peut-être après, mais la demande porte sur le planning.' },
            { ...skill.cv, feedback: 'Aucun rapport.' },
            { ...skill.none, feedback: 'Une skill dédiée existe.' },
          ],
        },
        {
          id: 's-hello',
          code: SKILLS,
          prompt: '« Salut Bob, ça va ? »',
          options: [
            { ...skill.none, correct: true, feedback: 'Rien à charger : une réponse simple suffit.' },
            { ...skill.planning, feedback: 'Charger des instructions inutiles, c’est gaspiller du contexte.' },
            { ...skill.fiche, feedback: 'Aucune fiche n’est demandée.' },
            { ...skill.cv, feedback: 'Aucun rapport.' },
          ],
          explanation: 'Ne rien charger est souvent le meilleur choix.',
        },
        {
          id: 's-why',
          prompt: 'Pourquoi ne pas charger les quatre skills en entier dès le départ ?',
          options: [
            { id: 'cost', text: 'Des milliers de tokens à chaque tour, inutiles la plupart du temps', correct: true, feedback: 'C’est tout l’intérêt du chargement à la demande.' },
            { id: 'forbidden', text: 'C’est interdit par la loi', feedback: 'Aucune loi là-dessus : c’est une question d’efficacité.' },
            { id: 'model', text: 'Le modèle ne sait lire qu’une skill par jour', feedback: 'Aucune limite de ce genre.' },
            { id: 'same', text: 'Il n’y a aucune différence', feedback: 'Si : coût, lenteur et distraction.' },
          ],
          explanation: 'Une ligne par skill en permanence, le reste à la demande : c’est le principe des skills.',
        },
      ],
    },
    {
      kind: 'sort',
      title: 'Le diagnostic',
      instructions: 'Bob a des ratés. Pour chaque symptôme, diagnostique la **maladie du contexte** en cause.',
      bins: [
        { id: 'middle', label: 'Perdu au milieu' },
        { id: 'overload', label: 'Surchargé' },
        { id: 'poison', label: 'Empoisonné' },
      ],
      items: [
        { id: 'd-moodle', text: 'La consigne clé est page 40 d’un contexte de 80 pages, et Bob l’ignore.', bin: 'middle', why: 'Remède : la placer au début ou à la fin, et raccourcir le contexte.' },
        { id: 'd-date', text: 'Une date fausse, notée en mémoire il y a un mois, ressort dans chaque réponse.', bin: 'poison', why: 'Remède : corriger la note et vérifier avant d’écrire en mémoire.' },
        { id: 'd-tools', text: 'Avec 60 outils chargés, Bob appelle `chercher_web` au lieu de `chercher_cours`.', bin: 'overload', why: 'Remède : n’exposer que les outils utiles.' },
        { id: 'd-web', text: 'Une page Web lue par Bob contenait une info inventée ; il l’a recopiée dans ses notes.', bin: 'poison', why: 'Remède : traiter les contenus externes comme non fiables et vérifier.' },
        { id: 'd-chapter', text: 'Bob répond bien sur le début et la fin du poly collé, mal sur le chapitre 5.', bin: 'middle', why: 'Remède : ne charger que le passage utile, retrouvé par la recherche.' },
        { id: 'd-slow', text: 'Chaque réponse prend 40 secondes, même pour dire bonjour.', bin: 'overload', why: 'Remède : alléger le contexte de base, charger le reste à la demande.' },
        { id: 'd-hallu', text: 'Bob avait inventé un nom de fonction ; il le réutilise depuis, puisqu’il est dans l’historique.', bin: 'poison', why: 'Remède : corriger l’erreur dans le contexte, ou résumer en l’écartant.' },
        { id: 'd-poly', text: 'Les 300 pages du poly sont chargées pour une question sur une seule page.', bin: 'overload', why: 'Remède : le RAG, pour ne charger que la page utile.' },
      ],
    },
  ],
};
