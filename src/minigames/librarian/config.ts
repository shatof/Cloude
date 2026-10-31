import type { MiniGameConfig } from '../kit/types';

export const librarianConfig: MiniGameConfig = {
  title: 'Le bibliothécaire',
  rounds: [
    {
      kind: 'sort',
      title: 'Que retenir ?',
      instructions:
        'Pendant une session, Bob croise des dizaines d’informations. Range chacune : à garder dans le **contexte** le temps de la tâche, à noter en **mémoire long terme**, ou à **ne pas retenir** du tout.',
      bins: [
        { id: 'ctx', label: 'Contexte' },
        { id: 'long', label: 'Long terme' },
        { id: 'none', label: 'Ne pas retenir' },
      ],
      items: [
        { id: 'm-year', text: 'Inès est en L3 informatique.', bin: 'long', why: 'Stable et utile à chaque session.' },
        { id: 'm-question', text: 'La question qu’Inès vient de poser.', bin: 'ctx', why: 'Utile pour la tâche en cours, inutile à garder ensuite.' },
        { id: 'm-schema', text: 'Inès préfère les explications avec des schémas.', bin: 'long', why: 'Une préférence durable : elle améliore toutes les futures réponses.' },
        { id: 'm-password', text: 'Le mot de passe d’Inès, aperçu dans un mail.', bin: 'none', why: 'Donnée sensible : un agent ne la stocke pas, même « pour aider ».' },
        { id: 'm-calc', text: 'Le résultat intermédiaire d’un calcul en cours.', bin: 'ctx', why: 'Sert à finir la tâche, pas au-delà.' },
        { id: 'm-exam', text: 'Le partiel de réseaux a lieu le 12 janvier.', bin: 'long', why: 'Une échéance qui servira pendant des semaines (à effacer après le 12 janvier).' },
        { id: 'm-joke', text: 'Une blague racontée par Karim il y a trois semaines.', bin: 'none', why: 'Aucune utilité future : retenir trop de choses noie l’essentiel.' },
        { id: 'm-page', text: 'Le passage du poly consulté pour répondre à cette question.', bin: 'ctx', why: 'On pourra le retrouver par la recherche : inutile de le recopier en mémoire.' },
      ],
    },
    {
      kind: 'pick',
      title: 'Les bons passages',
      instructions:
        'Tu es le module de **recherche** du RAG. Le poly a été découpé en passages, et ta recherche en a remonté sept. Lesquels faut-il placer dans le contexte de Bob ?',
      context: 'Question d’Inès : « Selon le poly, quelle est la taille minimale d’un en-tête TCP, et pourquoi peut-elle varier ? »',
      prompt: 'Coche les passages qui aident vraiment à répondre.',
      items: [
        { id: 'c-min', text: '« L’en-tête TCP fait au minimum 20 octets, et jusqu’à 60 avec les options. »', meta: 'p. 112', correct: true, why: 'La réponse directe à la question.' },
        { id: 'c-offset', text: '« Le champ Data offset indique la longueur de l’en-tête TCP, en mots de 32 bits. »', meta: 'p. 114', correct: true, why: 'Explique pourquoi la taille varie.' },
        { id: 'c-capture', text: '« Capture : un en-tête TCP de 32 octets, soit 20 octets fixes et 12 d’options. »', meta: 'p. 115', correct: true, why: 'Un exemple concret qui illustre la réponse.' },
        { id: 'c-ip', text: '« L’en-tête IPv4 fait au minimum 20 octets. »', meta: 'p. 71', correct: false, why: 'Piège : même nombre, mais c’est le protocole IP, pas TCP.' },
        { id: 'c-udp', text: '« L’en-tête UDP fait 8 octets : ports, longueur, somme de contrôle. »', meta: 'p. 98', correct: false, why: 'Proche par les mots, mais c’est UDP.' },
        { id: 'c-history', text: '« TCP a été conçu dans les années 1970 par Vinton Cerf et Bob Kahn. »', meta: 'p. 110', correct: false, why: 'Bon sujet, mauvaise question : n’aide pas à répondre.' },
        { id: 'c-exam', text: '« Modalités d’examen : partiel le 12 janvier, documents interdits. »', meta: 'p. 3', correct: false, why: 'Sans rapport avec la question.' },
      ],
    },
    {
      kind: 'choice',
      title: 'Le classeur partagé',
      instructions: 'Dernière manche : organise la mémoire et le prompt de Bob pour qu’ils servent longtemps, vite et pas cher.',
      questions: [
        {
          id: 'k-file',
          prompt: 'Où Bob doit-il noter « Inès préfère les schémas » pour s’en souvenir la semaine prochaine ?',
          options: [
            { id: 'file', text: 'Dans son fichier de mémoire, rechargé à chaque session', correct: true, feedback: 'La mémoire long terme vit hors du modèle, et le harnais la relit.' },
            { id: 'chat', text: 'Dans la conversation actuelle', feedback: 'Elle s’effacera à la fin de la session.' },
            { id: 'weights', text: 'Dans ses poids', feedback: 'Un agent ne modifie pas ses poids en cours d’usage.' },
            { id: 'nowhere', text: 'Nulle part : il s’en souviendra', feedback: 'C’est l’échec du début du niveau !' },
          ],
        },
        {
          id: 'k-order',
          prompt: 'Lequel de ces deux prompts profite le mieux du cache ?',
          code: `Prompt A : [date et heure] [consignes] [outils] [poly] [question]
Prompt B : [consignes] [outils] [poly] [date et heure] [question]`,
          options: [
            { id: 'b', text: 'Le prompt B', correct: true, feedback: 'Le long début stable (consignes, outils, poly) est identique d’une requête à l’autre.' },
            { id: 'a', text: 'Le prompt A', feedback: 'La date change à chaque requête : placée au début, elle invalide tout le reste.' },
            { id: 'same', text: 'Les deux se valent', feedback: 'L’ordre compte : le cache porte sur un début identique.' },
            { id: 'none', text: 'Aucun : le cache ne marche pas avec un poly', feedback: 'Au contraire, un long document stable est le cas idéal.' },
          ],
          explanation: 'Le cache réutilise le plus long début identique : le stable d’abord.',
        },
        {
          id: 'k-comma',
          prompt: 'Bob corrige une virgule dans ses consignes, tout au début du prompt. Qu’arrive-t-il au cache ?',
          options: [
            { id: 'recompute', text: 'Tout ce qui suit la modification est recalculé une fois', correct: true, feedback: 'Le début n’est plus identique : on recalcule à partir de là, puis le nouveau début sera en cache.' },
            { id: 'nothing', text: 'Rien : une virgule ne compte pas', feedback: 'Le cache exige un début strictement identique, au token près.' },
            { id: 'broken', text: 'Le modèle ne peut plus répondre', feedback: 'Il répond, simplement sans profiter du cache cette fois-ci.' },
            { id: 'wrong', text: 'Les réponses deviennent fausses', feedback: 'Le cache n’influence pas le contenu des réponses.' },
          ],
        },
        {
          id: 'k-when',
          prompt: 'Dans quel cas le prompt caching rapporte-t-il le plus ?',
          options: [
            { id: 'reuse', text: 'Un long début (consignes, documents) réutilisé pour beaucoup de questions', correct: true, feedback: 'C’est le cas idéal : calculé une fois, réutilisé souvent.' },
            { id: 'unique', text: 'Des requêtes courtes et toutes différentes', feedback: 'Rien à réutiliser : le cache ne sert presque pas.' },
            { id: 'once', text: 'Une seule question, jamais répétée', feedback: 'Le cache ne paie qu’à partir de la réutilisation.' },
            { id: 'image', text: 'Uniquement pour les images', feedback: 'Il fonctionne sur le texte : consignes, outils, documents.' },
          ],
        },
        {
          id: 'k-forget',
          prompt: 'Le partiel du 12 janvier est passé. Que faire de cette note en mémoire ?',
          options: [
            { id: 'update', text: 'La mettre à jour ou la supprimer', correct: true, feedback: 'Une mémoire s’entretient : une note périmée peut induire Bob en erreur.' },
            { id: 'keep', text: 'La garder telle quelle, au cas où', feedback: 'Bob risquerait de préparer Inès à un partiel déjà passé.' },
            { id: 'copy', text: 'La dupliquer pour être sûr de ne pas l’oublier', feedback: 'Doublons et notes périmées rendent la mémoire confuse.' },
            { id: 'weights', text: 'La transférer dans les poids du modèle', feedback: 'Impossible en cours d’usage, et inutile.' },
          ],
          explanation: 'Bonne mémoire = écrire, mais aussi corriger et oublier ce qui ne sert plus.',
        },
      ],
    },
  ],
};
