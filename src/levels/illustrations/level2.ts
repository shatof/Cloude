import { hotspotIllustration, stepsIllustration, toggleIllustration } from './kit';

export const LEVEL2_ILLUSTRATIONS = {
  'l2-tool-card': hotspotIllustration({
    frame: 'Définition d’outil',
    center: '`creer_evenement`',
    spots: [
      { label: 'Nom', desc: '« creer_evenement » : court, explicite, sans ambiguïté avec les autres outils.' },
      { label: 'Description', desc: '« Ajoute un événement à l’agenda d’Inès. À utiliser pour les examens et les rendus. »' },
      { label: 'Paramètres', desc: '`date` (texte AAAA-MM-JJ), `titre` (texte), `heure` (HH:MM, facultative).' },
      { label: 'Obligatoires', desc: '`date` et `titre` : un appel qui les oublie sera refusé par le harnais.' },
    ],
  }),
  'l2-call-flow': stepsIllustration(
    [
      { who: 'Modèle', tone: 'model', text: 'creer_evenement({"date": "2027-01-12", "titre": "Partiel de réseaux"})', code: true },
      { who: 'Harnais', tone: 'harness', text: 'Valide l’appel : outil connu, `date` au bon format, `titre` présent.' },
      { who: 'Monde', tone: 'world', text: 'L’agenda crée l’événement n° 88.' },
      { who: 'Harnais', tone: 'harness', text: 'Résultat renvoyé : {"ok": true, "id": 88}', code: true },
      { who: 'Modèle', tone: 'model', text: '« C’est noté : partiel de réseaux le 12 janvier 2027. »' },
    ],
    'Le modèle propose un appel, le harnais le valide et l’exécute, le résultat revient dans le contexte.',
  ),
  'l2-tool-design': toggleIllustration([
    {
      label: 'Outils flous',
      lines: [
        { who: 'Outil', tone: 'bad', text: 'faire_truc(x)', code: true },
        { who: 'Outils', tone: 'bad', text: 'chercher(q) · chercher2(q) · rechercher_v3(q)', code: true },
        { who: 'Modèle', tone: 'model', text: 'Hésite, puis choisit « chercher2 » au hasard.' },
        { who: 'Harnais', tone: 'bad', text: 'Erreur 500, sans explication.' },
      ],
      caption: 'Noms vagues, doublons, erreurs muettes : le modèle tâtonne.',
    },
    {
      label: 'Outils clairs',
      lines: [
        { who: 'Outil', tone: 'good', text: 'chercher_cours(requete, max_resultats)', code: true },
        { who: 'Description', tone: 'good', text: '« Cherche dans les supports de cours d’Inès. Pas pour le Web. »' },
        { who: 'Modèle', tone: 'model', text: 'Choisit chercher_cours du premier coup.' },
        { who: 'Harnais', tone: 'good', text: 'Erreur claire : « max_resultats doit être compris entre 1 et 10 ».' },
      ],
      caption: 'Peu d’outils, bien décrits, des erreurs utiles : le modèle choisit juste et se corrige seul.',
    },
  ]),
};
