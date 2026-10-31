import type { MiniGameConfig } from '../kit/types';

const replanOptions = {
  blind: { id: 'blind', text: 'Continuer le plan tel quel' },
  restart: { id: 'restart', text: 'Tout recommencer depuis le début' },
  cancel: { id: 'cancel', text: 'Annuler la soirée' },
};

export const projectLeadConfig: MiniGameConfig = {
  title: 'Le chef de projet',
  rounds: [
    {
      kind: 'pick',
      title: 'Les sous-tâches',
      instructions:
        'Nouvelle mission pour Bob : aider Inès, Léa et Karim à préparer leur **exposé de groupe** sur les protocoles réseau, à rendre dans 10 jours.',
      prompt: 'Coche les sous-tâches qui ont leur place dans le plan, et seulement celles-là.',
      items: [
        { id: 'split', text: 'Se répartir les trois parties entre Inès, Léa et Karim.', correct: true, why: 'Sans répartition, deux personnes risquent de traiter la même partie.' },
        { id: 'sources', text: 'Rassembler deux ou trois sources fiables par partie.', correct: true, why: 'Indispensable avant de rédiger, et le volume est raisonnable.' },
        { id: 'write', text: 'Rédiger chaque partie : 10 minutes d’oral chacune.', correct: true, why: 'Une sous-tâche claire, avec une taille précise.' },
        { id: 'merge', text: 'Assembler les diapositives dans un seul fichier.', correct: true, why: 'Sinon, trois styles et trois fichiers le jour J.' },
        { id: 'rehearse', text: 'Répéter l’exposé en entier, chronomètre en main.', correct: true, why: 'C’est la vérification finale : durée et enchaînements.' },
        { id: 'rfc', text: 'Lire l’intégralité des RFC sur TCP/IP.', correct: false, why: 'Disproportionné : des milliers de pages pour 30 minutes d’oral.' },
        { id: 'logo', text: 'Redessiner le logo de l’université pour la première diapo.', correct: false, why: 'Hors sujet : ça ne sert pas la mission.' },
        { id: 'prof', text: 'Faire valider chaque phrase par le prof.', correct: false, why: 'Irréaliste : on peut montrer le plan au prof, pas chaque phrase.' },
      ],
    },
    {
      kind: 'order',
      title: 'Les dépendances',
      instructions:
        'Retour à la soirée de révisions. Chaque étape a besoin du résultat d’une autre. Clique-les **dans un ordre qui respecte les dépendances**.',
      items: [
        { id: 'poll', text: 'Sonder la promo pour choisir une date.' },
        { id: 'room', text: 'Réserver une salle libre à cette date.' },
        { id: 'invite', text: 'Envoyer les invitations avec la date et la salle.' },
        { id: 'count', text: 'Compter les réponses « présent ».' },
        { id: 'food', text: 'Commander les pizzas pour ce nombre de personnes.' },
        { id: 'welcome', text: 'Accueillir tout le monde le jour J.' },
      ],
      explanation:
        'La date sert à réserver, la salle à inviter, les réponses à commander. C’est exactement l’ordre que Bob n’avait **pas** suivi au début du niveau.',
    },
    {
      kind: 'choice',
      title: 'Les imprévus',
      instructions:
        'Le plan de Bob est écrit et suivi. Mais la réalité s’en mêle : pour chaque observation, choisis la meilleure mise à jour du plan.',
      questions: [
        {
          id: 'r-room',
          code: `[x] Sondage : jeudi 18 h
[x] Salle C204 réservée
[ ] Invitations
[ ] Pizzas`,
          prompt: 'Observation : « La scolarité annule la réservation de la C204. »',
          options: [
            { id: 'fix', text: 'Réserver une autre salle pour jeudi 18 h, puis envoyer les invitations', correct: true, feedback: 'Seule l’étape « salle » est touchée : on la refait, le reste suit.' },
            { ...replanOptions.blind, feedback: 'Les invitations indiqueraient une salle qui n’est plus réservée.' },
            { ...replanOptions.restart, feedback: 'La date est toujours bonne : inutile de refaire le sondage.' },
            { ...replanOptions.cancel, feedback: 'Trop radical : d’autres salles sont sans doute libres.' },
          ],
          explanation: 'Replanifier, c’est modifier les étapes touchées, pas tout jeter.',
        },
        {
          id: 'r-count',
          code: `[x] Sondage : jeudi 18 h
[x] Salle B012 réservée
[x] Invitations envoyées
[ ] Pizzas (prévu : 8 personnes)`,
          prompt: 'Observation : « 13 réponses “présent”. »',
          options: [
            { id: 'fix', text: 'Mettre à jour l’étape : commander pour 13 personnes', correct: true, feedback: 'La donnée a changé : l’étape s’adapte, le reste du plan tient.' },
            { ...replanOptions.blind, feedback: 'Avec 8 pizzas pour 13, la soirée commence mal.' },
            { id: 'uninvite', text: 'Désinviter cinq personnes', feedback: 'On adapte le plan à la réalité, pas l’inverse !' },
            { ...replanOptions.restart, feedback: 'Rien d’autre n’est remis en cause.' },
          ],
        },
        {
          id: 'r-tool',
          code: `[x] Sondage · [x] Salle B012 · [x] Invitations
[ ] Pizzas pour 13 (Pizzeria du Campus)`,
          prompt: 'L’outil renvoie : « Erreur : Pizzeria du Campus fermée jeudi. »',
          options: [
            { id: 'retry', text: 'Relancer le même appel jusqu’à ce que ça marche', feedback: 'Le restaurant restera fermé : relancer ne change rien.' },
            { id: 'fix', text: 'Ajouter une étape : trouver un restaurant ouvert jeudi, puis commander', correct: true, feedback: 'L’erreur est une observation : elle fait apparaître une nouvelle sous-tâche.' },
            { id: 'lie', text: 'Annoncer à Inès que tout est commandé', feedback: 'Surtout pas : un agent ne doit jamais masquer un échec.' },
            { ...replanOptions.cancel, feedback: 'Il existe d’autres restaurants : le problème est réparable.' },
          ],
          explanation: 'Une erreur d’outil est une information : on ajuste le plan au lieu de s’acharner.',
        },
        {
          id: 'r-visio',
          code: `[x] Sondage · [x] Salle B012 · [x] Invitations
[x] Pizzas pour 13`,
          prompt: 'Inès : « Finalement, on fait la soirée en visio. »',
          options: [
            { ...replanOptions.blind, feedback: 'La demande a changé : le plan doit suivre.' },
            { id: 'keep', text: 'Garder la salle et les pizzas, au cas où', feedback: 'On gaspille une salle et 13 pizzas : il faut défaire ce qui ne sert plus.' },
            { id: 'fix', text: 'Libérer la salle, annuler les pizzas et renvoyer l’invitation avec un lien de visio', correct: true, feedback: 'Le but a changé : on défait ce qui ne sert plus et on ajoute ce qui manque.' },
            { ...replanOptions.restart, feedback: 'La date reste la même : seules la salle, les pizzas et l’invitation changent.' },
          ],
        },
        {
          id: 'r-maybe',
          code: `[x] Sondage · [x] Salle B012 · [x] Invitations (13 « présent »)
[ ] Pizzas pour 13`,
          prompt: 'Observation : « Un étudiant de plus répond : “Je viendrai peut-être.” »',
          options: [
            { id: 'note', text: 'Noter la réponse, sans changer le plan', correct: true, feedback: 'Cette observation ne contredit pas le plan : pas besoin de replanifier.' },
            { id: 'room', text: 'Chercher une salle plus grande', feedback: 'Une personne « peut-être » ne remplit pas une salle de 30 places.' },
            { ...replanOptions.restart, feedback: 'Bien trop pour un simple « peut-être ».' },
            { ...replanOptions.cancel, feedback: 'Aucune raison d’annuler.' },
          ],
          explanation: 'Replanifier quand le plan est contredit, pas à chaque nouvelle information.',
        },
      ],
    },
  ],
};
