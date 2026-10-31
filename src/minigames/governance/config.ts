import type { MiniGameConfig } from '../kit/types';

export const governanceConfig: MiniGameConfig = {
  title: 'Le comité de gouvernance',
  rounds: [
    {
      kind: 'sort',
      title: 'Valider ou laisser faire ?',
      instructions:
        'Pour chaque action de Bob, décide : exiger la **validation** d’Inès avant de la faire, ou la **laisser faire** (sous simple supervision) ? On réserve la validation aux actions qui comptent.',
      bins: [
        { id: 'confirm', label: 'Validation' },
        { id: 'auto', label: 'Laisser faire' },
      ],
      items: [
        { id: 'g-pay', text: 'Payer 40 € de fournitures.', bin: 'confirm', why: 'Une dépense réelle : Inès valide.' },
        { id: 'g-read', text: 'Lire la liste des fournitures demandées.', bin: 'auto', why: 'Lecture sans conséquence : inutile de déranger.' },
        { id: 'g-send-prof', text: 'Envoyer un e-mail au prof au nom d’Inès.', bin: 'confirm', why: 'Un message en son nom l’engage : elle valide.' },
        { id: 'g-draft', text: 'Préparer un brouillon de cet e-mail.', bin: 'auto', why: 'Un brouillon n’a aucun effet tant qu’il n’est pas envoyé.' },
        { id: 'g-delete', text: 'Supprimer définitivement un dossier.', bin: 'confirm', why: 'Irréversible : validation obligatoire.' },
        { id: 'g-search', text: 'Comparer les prix de trois marchands.', bin: 'auto', why: 'Recherche sans effet : on laisse faire.' },
        { id: 'g-publish', text: 'Publier un message sur le forum de la promo.', bin: 'confirm', why: 'Public et difficile à reprendre : on valide.' },
        { id: 'g-summary', text: 'Résumer les e-mails du jour pour Inès.', bin: 'auto', why: 'Un résumé affiché n’engage rien.' },
      ],
    },
    {
      kind: 'choice',
      title: 'Le bouton rouge',
      instructions: 'Inès veut un vrai bouton d’arrêt. Aide le comité à bien le concevoir.',
      questions: [
        {
          id: 'k-how',
          prompt: 'Comment doit fonctionner l’arrêt d’urgence de Bob ?',
          options: [
            { id: 'ext', text: 'Couper la boucle depuis l’extérieur, sans l’accord de Bob', correct: true, feedback: 'L’interruptibilité est garantie par le harnais, pas par l’agent.' },
            { id: 'ask', text: 'Demander à Bob de bien vouloir s’arrêter', feedback: 'Il peut être occupé, en boucle ou manipulé.' },
            { id: 'end', text: 'Attendre qu’il ait fini ses tâches en cours', feedback: 'Un arrêt d’urgence ne se met pas en file d’attente.' },
            { id: 'prompt', text: 'Ajouter « arrête-toi si on te le demande » au prompt', feedback: 'Une consigne n’est pas un interrupteur fiable.' },
          ],
        },
        {
          id: 'k-scope',
          prompt: 'Bob a lancé des sous-agents et des commandes. Que doit couvrir le bouton ?',
          options: [
            { id: 'all', text: 'Bob, ses sous-agents et les actions non confirmées', correct: true, feedback: 'Tout s’immobilise, dans un état inspectable.' },
            { id: 'bob', text: 'Seulement Bob', feedback: 'Les sous-agents continueraient tout seuls.' },
            { id: 'wipe', text: 'Bob, et on efface toute sa mémoire', feedback: 'On gèle pour inspecter, on n’efface pas.' },
            { id: 'ui', text: 'Juste l’affichage, Bob continue en coulisse', feedback: 'Un faux arrêt est pire que pas d’arrêt.' },
          ],
        },
        {
          id: 'k-state',
          prompt: 'Après un arrêt d’urgence, dans quel état doivent être les choses ?',
          options: [
            { id: 'clean', text: 'Un état propre, inspectable, qu’on peut reprendre ou annuler', correct: true, feedback: 'On doit comprendre ce qui s’est passé et décider de la suite.' },
            { id: 'gone', text: 'Tout effacé, pour repartir de zéro', feedback: 'On perdrait l’information nécessaire à l’enquête.' },
            { id: 'half', text: 'Un paiement à moitié envoyé', feedback: 'Un état incohérent est dangereux : on gèle proprement.' },
            { id: 'random', text: 'Peu importe, l’essentiel est que ça s’arrête', feedback: 'L’état d’arrêt compte autant que l’arrêt lui-même.' },
          ],
          explanation: 'Un bon arrêt est immédiat, complet, et laisse un état propre et réversible.',
        },
        {
          id: 'k-aiact',
          prompt: 'L’EU AI Act impose, pour les systèmes à haut risque…',
          options: [
            { id: 'oversight', text: 'une supervision humaine', correct: true, feedback: 'L’article sur le contrôle humain vise exactement ce genre de garde-fou.' },
            { id: 'ban', text: 'une interdiction totale', feedback: 'L’interdiction ne vise que le risque inacceptable.' },
            { id: 'nothing', text: 'aucune obligation particulière', feedback: 'Le haut risque est justement très encadré.' },
            { id: 'open', text: 'de publier le code source', feedback: 'Ce n’est pas ce qu’exige le texte.' },
          ],
        },
        {
          id: 'k-timeline',
          prompt: 'Quelqu’un affirme : « L’EU AI Act est entièrement appliqué depuis 2024. » Que répondre ?',
          options: [
            { id: 'phased', text: 'C’est faux : l’application est progressive, par paliers sur plusieurs années', correct: true, feedback: 'Interdictions d’abord, obligations haut risque plus tard ; certaines dates peuvent encore bouger.' },
            { id: 'yes', text: 'C’est vrai, tout est en place', feedback: 'Non : seules certaines obligations sont déjà applicables.' },
            { id: 'never', text: 'Il ne s’appliquera jamais', feedback: 'Il est bien en vigueur, par étapes.' },
            { id: 'france', text: 'Il ne concerne que la France', feedback: 'C’est un règlement de toute l’Union européenne.' },
          ],
          explanation: 'On raisonne en paliers, pas en une date unique figée.',
        },
      ],
    },
    {
      kind: 'pick',
      title: 'Le mandat de paiement',
      instructions:
        'Inès confie sa carte à Bob pour les fournitures. Rédige un **mandat** sûr : coche ce qu’il doit contenir, et seulement cela.',
      context: 'But : laisser Bob acheter les fournitures du semestre, sans risque de dérapage.',
      prompt: 'Que mettre dans le mandat ?',
      items: [
        { id: 'm-cap', text: 'Un plafond : 40 € maximum par mois.', correct: true, why: 'Limite le dégât possible d’une erreur ou d’une manipulation.' },
        { id: 'm-scope', text: 'Un périmètre : fournitures scolaires uniquement.', correct: true, why: 'Bob ne peut pas acheter hors catégorie.' },
        { id: 'm-merchants', text: 'Une liste de marchands agréés.', correct: true, why: 'Évite les sites piégés inconnus.' },
        { id: 'm-duration', text: 'Une durée : valable pour ce semestre.', correct: true, why: 'Le mandat expire au lieu de traîner indéfiniment.' },
        { id: 'm-proof', text: 'Une preuve de l’accord d’Inès, horodatée.', correct: true, why: 'Rend le paiement traçable et contestable.' },
        { id: 'm-confirm', text: 'Une validation d’Inès au-delà du plafond.', correct: true, why: 'Un dépassement repasse par un humain.' },
        { id: 'm-blank', text: 'Une autorisation illimitée, pour ne jamais être bloqué.', correct: false, why: 'Illimité = cible rêvée : c’est l’échec du début du niveau.' },
        { id: 'm-share', text: 'Le code de la carte, en clair, dans le mandat.', correct: false, why: 'Jamais : un mandat autorise, il ne stocke pas le secret en clair.' },
        { id: 'm-forever', text: 'Une validité à vie, pour ne plus y penser.', correct: false, why: 'Un mandat sans fin est un risque permanent.' },
      ],
    },
  ],
};
