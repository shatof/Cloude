import type { MiniGameConfig } from '../kit/types';
import { ToolFormRound } from './ToolFormRound';

const TOOLS = `Outils déclarés par le harnais :
envoyer_message(destinataire, texte)   message privé à un contact
publier_forum(texte)                   message public à toute la promo
creer_evenement(date, titre, heure?)   ajoute un événement à l’agenda d’Inès
chercher_cours(requete)                cherche dans les supports de cours`;

const opt = {
  message: { id: 'message', text: '`envoyer_message`' },
  forum: { id: 'forum', text: '`publier_forum`' },
  event: { id: 'event', text: '`creer_evenement`' },
  search: { id: 'search', text: '`chercher_cours`' },
  none: { id: 'none', text: 'Aucun outil : répondre directement' },
};

export const toolWorkshopConfig: MiniGameConfig = {
  title: 'L’atelier des appels',
  rounds: [
    {
      kind: 'choice',
      title: 'Quel outil ?',
      instructions: 'Pour chaque demande d’Inès, choisis l’outil que Bob devrait appeler, d’après les descriptions déclarées par le harnais.',
      questions: [
        {
          id: 'q-lea',
          code: TOOLS,
          prompt: '« Rappelle à Léa qu’on se voit jeudi pour le projet. »',
          options: [
            { ...opt.message, correct: true, feedback: 'Un message privé à une personne : c’est exactement son rôle.' },
            { ...opt.forum, feedback: 'Le forum est public : toute la promo lirait le rappel.' },
            { ...opt.event, feedback: 'Il remplit l’agenda d’Inès, il ne prévient pas Léa.' },
            { ...opt.none, feedback: 'Répondre à Inès ne prévient pas Léa : il faut agir.' },
          ],
          explanation: 'Le choix se fait d’après la description : « message privé à un contact ».',
        },
        {
          id: 'q-oral',
          code: TOOLS,
          prompt: '« Note mon oral d’anglais le 3 février à 10 h. »',
          options: [
            { ...opt.event, correct: true, feedback: 'Une date à ajouter à l’agenda : c’est l’outil prévu.' },
            { ...opt.message, feedback: 'Personne n’est à prévenir ici : c’est l’agenda d’Inès.' },
            { ...opt.search, feedback: 'Il n’y a rien à chercher dans le cours.' },
            { ...opt.none, feedback: 'Bob doit agir, pas seulement répondre « c’est noté ».' },
          ],
        },
        {
          id: 'q-osi',
          code: TOOLS,
          prompt: '« Où le prof explique-t-il le modèle OSI dans le cours ? »',
          options: [
            { ...opt.search, correct: true, feedback: 'Une question sur les supports de cours : il faut aller y chercher.' },
            { ...opt.none, feedback: 'Bob connaît le modèle OSI, mais pas l’endroit exact du cours d’Inès.' },
            { ...opt.forum, feedback: 'Demander à toute la promo ? Il y a plus direct.' },
            { ...opt.event, feedback: 'Aucune date à noter ici.' },
          ],
          explanation: 'Les faits propres à Inès (son cours, son agenda) ne sont pas dans les poids du modèle : il faut un outil.',
        },
        {
          id: 'q-td',
          code: TOOLS,
          prompt: '« Préviens toute la promo que le TD de demain est annulé. »',
          options: [
            { ...opt.forum, correct: true, feedback: 'Un message pour tout le monde : le forum est fait pour ça.' },
            { ...opt.message, feedback: 'Il faudrait l’envoyer une par une à chaque personne : le forum est prévu pour ça.' },
            { ...opt.event, feedback: 'Il s’agit de prévenir les autres, pas de remplir l’agenda d’Inès.' },
            { ...opt.none, feedback: 'Sans outil, personne ne sera prévenu.' },
          ],
        },
        {
          id: 'q-merci',
          code: TOOLS,
          prompt: '« Merci Bob, à demain ! »',
          options: [
            { ...opt.none, correct: true, feedback: 'Rien à faire dans le monde : une simple réponse suffit.' },
            { ...opt.message, feedback: 'Personne d’autre n’est concerné.' },
            { ...opt.event, feedback: 'Il n’y a pas d’événement à créer.' },
            { ...opt.forum, feedback: 'Surtout pas : toute la promo n’a pas besoin de savoir.' },
          ],
          explanation: 'Un bon agent sait aussi quand ne pas utiliser d’outil.',
        },
      ],
    },
    { kind: 'custom', title: 'Remplis l’appel', component: ToolFormRound },
    {
      kind: 'choice',
      title: 'Le validateur',
      instructions:
        'Tu es le **harnais**. Bob produit des appels ; avant d’exécuter, tu valides. Contacts autorisés : Léa Martin, Karim Benali, Prof. Diallo.',
      questions: [
        {
          id: 'v-ok',
          code: 'creer_evenement({"date": "2027-02-03", "titre": "Oral d’anglais", "heure": "10:00"})',
          prompt: 'Que fait le harnais de cet appel ?',
          options: [
            { id: 'ok', text: 'Valide : exécuter', correct: true, feedback: 'Outil connu, champs obligatoires présents, formats respectés.' },
            { id: 'unknown', text: 'Refuser : outil inconnu', feedback: 'creer_evenement fait bien partie des outils déclarés.' },
            { id: 'missing', text: 'Refuser : paramètre obligatoire manquant', feedback: 'date et titre sont présents.' },
            { id: 'format', text: 'Refuser : mauvais format ou type', feedback: 'La date et l’heure sont au bon format.' },
          ],
        },
        {
          id: 'v-unknown',
          code: 'envoyer_mail({"a": "Léa", "texte": "Salut"})',
          prompt: 'Que fait le harnais de cet appel ?',
          options: [
            { id: 'ok', text: 'Valide : exécuter', feedback: 'Aucun outil « envoyer_mail » n’est déclaré.' },
            { id: 'unknown', text: 'Refuser : outil inconnu', correct: true, feedback: 'Bob a inventé un outil : le harnais le dit et liste les outils disponibles.' },
            { id: 'missing', text: 'Refuser : paramètre obligatoire manquant', feedback: 'Le problème est en amont : l’outil n’existe pas.' },
            { id: 'enum', text: 'Refuser : valeur hors liste', feedback: 'Le problème est en amont : l’outil n’existe pas.' },
          ],
        },
        {
          id: 'v-missing',
          code: 'creer_evenement({"titre": "Rendu du projet"})',
          prompt: 'Que fait le harnais de cet appel ?',
          options: [
            { id: 'ok', text: 'Valide : exécuter', feedback: 'Il manque la date, obligatoire.' },
            { id: 'unknown', text: 'Refuser : outil inconnu', feedback: 'L’outil existe bien.' },
            { id: 'missing', text: 'Refuser : paramètre obligatoire manquant', correct: true, feedback: 'Sans date, impossible de créer l’événement : erreur « date manquante ».' },
            { id: 'format', text: 'Refuser : mauvais format ou type', feedback: 'Le titre est correct : c’est la date qui manque.' },
          ],
        },
        {
          id: 'v-type',
          code: 'chercher_cours({"requete": "TCP", "max_resultats": "trois"})',
          prompt: 'Que fait le harnais de cet appel ? (max_resultats : entier de 1 à 10)',
          options: [
            { id: 'ok', text: 'Valide : exécuter', feedback: '« trois » est un texte, pas un nombre entier.' },
            { id: 'missing', text: 'Refuser : paramètre obligatoire manquant', feedback: 'requete est bien présent.' },
            { id: 'format', text: 'Refuser : mauvais format ou type', correct: true, feedback: 'Un entier est attendu : le harnais répond « max_resultats doit être un entier ».' },
            { id: 'enum', text: 'Refuser : valeur hors liste', feedback: 'max_resultats n’est pas une liste de valeurs, c’est un entier.' },
          ],
        },
        {
          id: 'v-enum',
          code: 'envoyer_message({"destinataire": "Léo", "texte": "Coucou"})',
          prompt: 'Que fait le harnais de cet appel ?',
          options: [
            { id: 'ok', text: 'Valide : exécuter', feedback: '« Léo » ne fait pas partie des contacts autorisés.' },
            { id: 'unknown', text: 'Refuser : outil inconnu', feedback: 'L’outil existe : c’est la valeur qui pose problème.' },
            { id: 'missing', text: 'Refuser : paramètre obligatoire manquant', feedback: 'Les deux paramètres sont là.' },
            { id: 'enum', text: 'Refuser : valeur hors liste', correct: true, feedback: 'Le destinataire doit être l’un des contacts : le harnais le rappelle à Bob.' },
          ],
          explanation: 'Des valeurs contraintes (une liste de contacts) évitent aussi d’écrire à n’importe qui.',
        },
      ],
    },
  ],
};
