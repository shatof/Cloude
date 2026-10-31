import { hotspotIllustration, toggleIllustration } from './kit';

export const LEVEL7_ILLUSTRATIONS = {
  'l7-loop-control': toggleIllustration([
    {
      label: 'Conditions d’arrêt',
      lines: [
        { who: 'Règles', tone: 'harness', text: 'réponse finale | 100 tours max | 5 € max | 3 commandes identiques = alerte', code: true },
        { who: 'Modèle', tone: 'model', text: 'pytest  ·  pytest  ·  pytest', code: true },
        { who: 'Harnais', tone: 'harness', text: '« Trois fois la même commande : tu tournes en rond, change d’approche. »' },
        { who: 'Modèle', tone: 'good', text: '« Je lis plutôt le message d’erreur du test. »' },
      ],
      caption: 'Le harnais borne la mission et repère les boucles : elle ne tourne jamais à vide.',
    },
    {
      label: 'Compaction',
      lines: [
        { who: 'Harnais', tone: 'harness', text: 'Tour 48 : contexte rempli à 92 %.' },
        { who: 'Harnais', tone: 'harness', text: 'Compaction : 40 tours résumés en 600 tokens.' },
        { who: 'Résumé', tone: 'note', text: 'But : moyenne([]) plante | modifié : stats.py | erreur : ZeroDivisionError l. 12', code: true },
        { who: 'Modèle', tone: 'good', text: '« Je reprends : il faut gérer la liste vide à la ligne 12. »' },
      ],
      caption: 'On garde l’objectif, les décisions, les fichiers touchés et la dernière erreur ; le reste part.',
    },
  ]),
  'l7-guardrails': hotspotIllustration({
    frame: 'Armature',
    center: '**Bob** au travail sur le projet de Karim',
    spots: [
      { label: 'Autorisé', desc: '`ls`, lire un fichier, lancer `pytest` : sans risque, Bob le fait seul.' },
      { label: 'Sur demande', desc: '`git push`, installer un paquet : Karim confirme d’abord.' },
      { label: 'Interdit', desc: '`rm -rf`, lire `~/.ssh` : refusé, quoi qu’il arrive.' },
      { label: 'Sandbox', desc: 'Un conteneur jetable : ni fichiers personnels ni réseau non autorisé.' },
      { label: 'Hooks', desc: 'Après chaque modification : formateur et linter. Avant chaque commit : recherche de secrets.' },
    ],
  }),
  'l7-verify': toggleIllustration([
    {
      label: 'Sur parole',
      lines: [
        { who: 'Modèle', tone: 'model', text: '« C’est corrigé ! »' },
        { who: 'Harnais', tone: 'bad', text: 'Accepte la réponse finale.' },
        { who: 'Karim', tone: 'bad', text: 'Lance pytest : 3 tests échouent.' },
      ],
      caption: 'Le modèle était sûr de lui. Personne n’a vérifié.',
    },
    {
      label: 'Vérifié',
      lines: [
        { who: 'Modèle', tone: 'model', text: '« C’est corrigé ! »' },
        { who: 'Harnais', tone: 'harness', text: 'Avant d’accepter, lance les tests.' },
        { who: 'Tests', tone: 'world', text: '2 échecs : test_moyenne_vide, test_arrondi.' },
        { who: 'Modèle', tone: 'model', text: '« Je corrige l’arrondi. »' },
        { who: 'Harnais', tone: 'good', text: '40 tests sur 40 : réponse acceptée.' },
      ],
      caption: 'Le résultat est contrôlé par quelque chose d’extérieur au modèle.',
    },
  ]),
};
