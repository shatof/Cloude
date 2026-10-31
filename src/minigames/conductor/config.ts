import type { MiniGameConfig } from '../kit/types';

export const conductorConfig: MiniGameConfig = {
  title: 'Le chef d’orchestre',
  rounds: [
    {
      kind: 'sort',
      title: 'Un ou plusieurs ?',
      instructions:
        'Pour chaque mission, décide : **un seul agent** suffit, ou faut-il un **orchestrateur avec des sous-agents** ? Pense indépendance des sous-tâches… et coût.',
      bins: [
        { id: 'single', label: 'Un seul agent' },
        { id: 'multi', label: 'Plusieurs agents' },
      ],
      items: [
        { id: 'w-articles', text: 'Résumer 30 articles indépendants.', bin: 'multi', why: 'Large et indépendant : chaque sous-agent prend un lot d’articles.' },
        { id: 'w-bug', text: 'Corriger un bug dans une fonction de 20 lignes.', bin: 'single', why: 'Petit et ciblé : la coordination coûterait plus que la tâche.' },
        { id: 'w-hosting', text: 'Comparer les offres de 12 hébergeurs Web.', bin: 'multi', why: 'Douze recherches indépendantes, faciles à paralléliser.' },
        { id: 'w-tokyo', text: 'Dire quelle heure il est à Tokyo.', bin: 'single', why: 'Une question simple : un seul agent, une seule réponse.' },
        { id: 'w-refactor', text: 'Réorganiser un module dont tous les fichiers dépendent les uns des autres.', bin: 'single', why: 'Très lié : plusieurs agents se marcheraient dessus.' },
        { id: 'w-sources', text: 'Chercher des sources dans 5 bases documentaires différentes.', bin: 'multi', why: 'Une base par sous-agent, en parallèle.' },
        { id: 'w-poem', text: 'Écrire un poème de quatre vers pour l’anniversaire de Léa.', bin: 'single', why: 'Court et créatif : rien à découper.' },
        { id: 'w-audit', text: 'Vérifier la sécurité de 40 dépôts de code séparés.', bin: 'multi', why: 'Quarante audits indépendants : idéal pour des sous-agents.' },
      ],
    },
    {
      kind: 'pick',
      title: 'Le brief parfait',
      instructions:
        'L’orchestrateur confie à un sous-agent les articles 13 à 18. Le sous-agent ne saura **que ce qui est écrit dans son brief**.',
      prompt: 'Coche ce qui doit figurer dans le brief, et seulement ça.',
      items: [
        { id: 'b-goal', text: 'L’objectif : résumer les articles 13 à 18.', correct: true, why: 'Sans objectif clair, le sous-agent improvise.' },
        { id: 'b-format', text: 'Le format : 5 lignes par article (question, méthode, résultat, limite).', correct: true, why: 'Des retours au même format s’assemblent facilement.' },
        { id: 'b-scope', text: 'Le périmètre : ces six articles, pas les autres.', correct: true, why: 'Évite que deux sous-agents traitent les mêmes articles.' },
        { id: 'b-tools', text: 'Les sources autorisées : les PDF fournis, pas le Web.', correct: true, why: 'Le sous-agent sait où chercher, et où ne pas chercher.' },
        { id: 'b-stop', text: 'Quand s’arrêter : dès les six résumés prêts, ou si un PDF est illisible.', correct: true, why: 'Une condition d’arrêt claire, même pour un sous-agent.' },
        { id: 'b-history', text: 'Tout l’historique de la conversation entre Inès et l’orchestrateur.', correct: false, why: 'Noierait le sous-agent : on lui donne seulement ce qui sert sa sous-tâche.' },
        { id: 'b-cheer', text: '« Fais de ton mieux ! »', correct: false, why: 'Un encouragement vide : aucune information utile.' },
        { id: 'b-others', text: 'La liste détaillée des 24 autres articles.', correct: false, why: 'Hors périmètre : invitation au travail en double.' },
      ],
    },
    {
      kind: 'choice',
      title: 'Les pièges',
      instructions: 'Les agents travaillent ensemble… et les ennuis commencent. Choisis la meilleure réaction.',
      questions: [
        {
          id: 'c-flood',
          prompt: 'Chaque sous-agent renvoie 50 000 tokens de notes brutes. Le contexte de l’orchestrateur déborde. Que corriger ?',
          options: [
            { id: 'format', text: 'Exiger dans le brief un retour condensé, au format fixé', correct: true, feedback: 'Les sous-agents lisent beaucoup et rendent peu : c’est tout l’intérêt.' },
            { id: 'bigger', text: 'Prendre un modèle avec une plus grande fenêtre', feedback: 'Ça repousse le problème : l’orchestrateur serait noyé quand même.' },
            { id: 'fewer', text: 'Lancer un seul sous-agent pour tout', feedback: 'On perdrait le parallélisme sans régler le format des retours.' },
            { id: 'ignore', text: 'Ignorer les retours des sous-agents', feedback: 'Alors à quoi bon les lancer ?' },
          ],
        },
        {
          id: 'c-duplicate',
          prompt: 'Deux sous-agents ont résumé les mêmes articles, et trois articles n’ont été traités par personne. Pourquoi ?',
          options: [
            { id: 'scope', text: 'Les périmètres des briefs n’étaient pas clairement découpés', correct: true, feedback: 'Chaque brief doit dire précisément ce qui est à lui, et rien d’autre.' },
            { id: 'model', text: 'Le modèle est trop petit', feedback: 'Le problème vient de la répartition, pas du modèle.' },
            { id: 'parallel', text: 'Les sous-agents ne doivent jamais travailler en parallèle', feedback: 'Le parallélisme n’est pas en cause : la répartition, si.' },
            { id: 'luck', text: 'C’est le hasard', feedback: 'Une répartition floue produit ce résultat à coup sûr.' },
          ],
          explanation: 'Découper sans trou ni chevauchement : c’est le travail de l’orchestrateur.',
        },
        {
          id: 'c-pingpong',
          prompt: 'Accueil → facturation → accueil → facturation… Les agents se renvoient le client. Que manque-t-il ?',
          options: [
            { id: 'rules', text: 'Des règles claires de qui traite quoi, et une limite au nombre de relais', correct: true, feedback: 'Avec une limite, le cas remonte à un humain ou à un orchestrateur au lieu de tourner en rond.' },
            { id: 'more', text: 'Plus d’agents dans la boucle', feedback: 'Plus de joueurs ne règle pas une partie de ping-pong.' },
            { id: 'faster', text: 'Des agents plus rapides', feedback: 'Ils tourneraient en rond plus vite.' },
            { id: 'nothing', text: 'Rien, ils finiront par trouver', feedback: 'Sans règle ni limite, rien ne garantit qu’ils s’arrêtent.' },
          ],
        },
        {
          id: 'c-central',
          prompt: 'Quand préférer un orchestrateur central plutôt qu’un essaim ?',
          options: [
            { id: 'overview', text: 'Quand il faut une vue d’ensemble, un résultat cohérent et un responsable clair', correct: true, feedback: 'Une synthèse de 30 articles a besoin de quelqu’un qui assemble.' },
            { id: 'never', text: 'Jamais : l’essaim est toujours meilleur', feedback: 'Chaque organisation a ses forces : aucune n’est toujours la meilleure.' },
            { id: 'cheap', text: 'Quand on veut dépenser le plus de tokens possible', feedback: 'Ce n’est jamais un objectif.' },
            { id: 'single', text: 'Quand il n’y a qu’une seule sous-tâche', feedback: 'Alors un seul agent suffit, sans orchestrateur.' },
          ],
        },
        {
          id: 'c-cost',
          prompt: 'Lancer 5 sous-agents pour répondre « Quelle heure est-il à Tokyo ? » : bonne idée ?',
          options: [
            { id: 'no', text: 'Non : cinq fois plus de tokens pour une réponse qu’un seul agent donne', correct: true, feedback: 'Le multi-agents se justifie par le gain, jamais par principe.' },
            { id: 'yes', text: 'Oui : cinq avis valent mieux qu’un', feedback: 'Pour une question aussi simple, ils diront tous la même chose.' },
            { id: 'vote', text: 'Oui, et on fait voter les sous-agents', feedback: 'Un vote coûte encore plus, pour rien.' },
            { id: 'swarm', text: 'Oui, mais en essaim', feedback: 'Ni orchestrateur ni essaim : un seul agent suffit.' },
          ],
          explanation: 'Plusieurs agents quand la tâche est large ; un seul quand elle est simple.',
        },
      ],
    },
  ],
};
