import type { ChoiceQuestion, MiniGameConfig } from '../kit/types';
import { AssemblyRound } from './AssemblyRound';
import { ASSEMBLY_PIECES, missingPieceLog, type PieceId } from './logic';

type Candidate = Exclude<PieceId, 'loop'>;

/** Ce que chaque pièce empêche (pour expliquer chaque réponse). */
const PREVENTS: Record<Candidate, string> = {
  stop: 'les boucles sans fin et les factures qui s’envolent',
  compaction: 'les débordements de contexte',
  permissions: 'les commandes dangereuses lancées sans confirmation',
  sandbox: 'les dégâts en dehors du projet',
  hooks: 'les oublis de formatage et les secrets publiés',
  verification: 'les faux succès',
};

const CANDIDATES = ASSEMBLY_PIECES.filter((p) => p.id !== 'loop') as { id: Candidate; label: string }[];

function missingQuestion(missing: Candidate): ChoiceQuestion {
  return {
    id: `missing-${missing}`,
    code: missingPieceLog(missing),
    prompt: 'Quelle pièce manque à ce harnais ?',
    options: CANDIDATES.map((p) => ({
      id: p.id,
      text: p.label,
      correct: p.id === missing,
      feedback:
        p.id === missing
          ? `Oui : sans elle, rien n’empêche ${PREVENTS[p.id]}.`
          : `Elle était bien là : elle empêche ${PREVENTS[p.id]}, ce n’est pas ce que montre le journal.`,
    })),
  };
}

export const assemblyConfig: MiniGameConfig = {
  title: 'L’atelier de montage',
  rounds: [
    { kind: 'custom', title: 'Le montage', component: AssemblyRound },
    {
      kind: 'choice',
      title: 'La pièce manquante',
      instructions:
        'Chaque fois, il manque **une seule pièce** au harnais complet. Lis le journal des 20 essais et retrouve laquelle.',
      questions: (['verification', 'stop', 'permissions', 'compaction', 'hooks', 'sandbox'] as const).map(missingQuestion),
    },
    {
      kind: 'choice',
      title: 'Les réglages',
      instructions: 'Une pièce mal réglée peut gêner autant qu’une pièce absente. Choisis le meilleur réglage.',
      questions: [
        {
          id: 'set-perm',
          prompt: 'Faut-il demander la confirmation de Karim avant chaque commande, même `ls` ou `pytest` ?',
          options: [
            {
              id: 'tiers',
              text: 'Non : autoriser le sûr, demander pour le risqué, interdire le dangereux',
              correct: true,
              feedback: 'Trop de demandes, et Karim finit par tout valider sans lire : les confirmations perdent leur sens.',
            },
            { id: 'all', text: 'Oui, on n’est jamais trop prudent', feedback: 'Des dizaines de confirmations par mission : Karim cliquera « oui » machinalement.' },
            { id: 'none', text: 'Non : on n’en demande jamais, l’agent sait ce qu’il fait', feedback: 'C’est ainsi que `rm -rf ~/projets` est passé au début du niveau.' },
            { id: 'random', text: 'Une fois sur deux, au hasard', feedback: 'Une règle doit dépendre du risque de l’action, pas du hasard.' },
          ],
          explanation: 'Trois niveaux : autorisé, sur demande, interdit. Selon le risque de chaque action.',
        },
        {
          id: 'set-turns',
          prompt: 'Combien de tours maximum laisser à Bob pour cette mission ?',
          options: [
            { id: 'one', text: '1 tour', feedback: 'Impossible de corriger un bug en un seul pas : c’est retirer la boucle.' },
            { id: 'fit', text: 'Une limite adaptée à la tâche, par exemple 100 tours, avec un budget maximum', correct: true, feedback: 'Assez pour finir, pas assez pour ruiner Karim si ça tourne mal.' },
            { id: 'inf', text: 'Aucune limite : il s’arrêtera bien un jour', feedback: 'Sans limite, une boucle peut tourner toute la nuit.' },
            { id: 'ask', text: 'Le modèle choisit lui-même sa limite', feedback: 'Une limite qu’on fixe soi-même n’est pas un garde-fou.' },
          ],
        },
        {
          id: 'set-compact',
          prompt: 'Lors d’une compaction, que doit garder le résumé ?',
          options: [
            { id: 'keep', text: 'L’objectif, les décisions, les fichiers modifiés et la dernière erreur', correct: true, feedback: 'C’est ce qui permet de reprendre le travail sans repartir de zéro.' },
            { id: 'all', text: 'Tout, mot pour mot', feedback: 'Ce n’est plus un résumé : le contexte déborderait encore.' },
            { id: 'last', text: 'Seulement le dernier message', feedback: 'Bob oublierait l’objectif et ce qu’il a déjà essayé.' },
            { id: 'jokes', text: 'Les échanges les plus sympathiques', feedback: 'Le ton importe peu : ce sont les faits utiles qui comptent.' },
          ],
          explanation: 'Compacter, c’est perdre du détail : on choisit ce qui doit survivre.',
        },
        {
          id: 'set-hook',
          prompt: 'Pourquoi un hook plutôt qu’une consigne « pense à lancer le formateur » dans le prompt ?',
          options: [
            { id: 'sure', text: 'Le hook s’exécute à coup sûr ; une consigne peut être oubliée', correct: true, feedback: 'Un hook est du code lancé par le harnais : il ne dépend pas de la mémoire du modèle.' },
            { id: 'smart', text: 'Le hook rend le modèle plus intelligent', feedback: 'Le modèle ne change pas : c’est le harnais qui agit.' },
            { id: 'cheap', text: 'Le hook coûte plus de tokens, donc il est meilleur', feedback: 'Un hook ne coûte souvent aucun token : c’est un simple script.' },
            { id: 'same', text: 'Aucune différence', feedback: 'Si : l’un est garanti, l’autre seulement probable.' },
          ],
        },
        {
          id: 'set-verify',
          prompt: 'Quelle vérification est la plus fiable pour accepter « c’est corrigé » ?',
          options: [
            { id: 'tests', text: 'Lancer les tests et exiger qu’ils passent', correct: true, feedback: 'Une preuve indépendante de ce que dit le modèle.' },
            { id: 'ask', text: 'Demander au modèle s’il est sûr de lui', feedback: 'Il répondra souvent « oui », sûr de lui… et parfois à tort.' },
            { id: 'long', text: 'Vérifier que sa réponse est longue et détaillée', feedback: 'Une réponse longue n’est pas une réponse juste.' },
            { id: 'trust', text: 'Lui faire confiance : il a déjà réussi hier', feedback: 'Chaque mission se vérifie : hier ne prouve rien aujourd’hui.' },
          ],
          explanation: 'On vérifie le résultat avec quelque chose d’extérieur au modèle : tests, compilation, linter, capture d’écran.',
        },
      ],
    },
  ],
};
