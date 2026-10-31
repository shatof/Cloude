import { hotspotIllustration, stepsIllustration, toggleIllustration } from './kit';

export const LEVEL4_ILLUSTRATIONS = {
  'l4-decompose': hotspotIllustration({
    frame: 'Mission',
    center: '**Organiser la soirée de révisions**',
    spots: [
      { label: 'Date', desc: 'Sonder la promo. Ne dépend de rien : on peut commencer tout de suite.' },
      { label: 'Salle', desc: 'Réserver une salle libre. Dépend de la date.' },
      { label: 'Invitations', desc: 'Annoncer la date et la salle. Dépend des deux étapes précédentes.' },
      { label: 'Repas', desc: 'Commander pour le bon nombre. Dépend des réponses aux invitations.' },
      { label: 'Texte', desc: 'Rédiger le brouillon de l’invitation. Indépendant : peut avancer en parallèle du sondage.' },
    ],
  }),
  'l4-todo': stepsIllustration(
    [
      { who: 'Modèle', tone: 'model', text: 'ecrire_plan(["Sondage", "Salle", "Invitations", "Pizzas"])', code: true },
      { who: 'Plan', tone: 'harness', text: '[ ] Sondage  [ ] Salle  [ ] Invitations  [ ] Pizzas', code: true },
      { who: 'Modèle', tone: 'model', text: 'sonder_promo(options=["mardi", "jeudi"])', code: true },
      { who: 'Monde', tone: 'world', text: '« Jeudi 18 h : 11 votes sur 14. »' },
      { who: 'Plan', tone: 'harness', text: '[x] Sondage  [ ] Salle  [ ] Invitations  [ ] Pizzas', code: true },
      { who: 'Modèle', tone: 'model', text: '« Je relis le plan : prochaine étape, la salle. »' },
    ],
    'Le plan vit en dehors du « cerveau » : le harnais le garde et le remet sous les yeux du modèle à chaque tour.',
  ),
  'l4-replan': toggleIllustration([
    {
      label: 'Plan suivi à l’aveugle',
      lines: [
        { who: 'Observation', tone: 'world', text: '« La C204 est annulée par la scolarité. »' },
        { who: 'Modèle', tone: 'bad', text: '« Étape suivante du plan : rappel “Rendez-vous en C204”. »' },
        { who: 'Résultat', tone: 'bad', text: 'Treize personnes devant une porte fermée.' },
      ],
      caption: 'L’observation contredit le plan, mais personne ne s’en sert.',
    },
    {
      label: 'Plan révisé',
      lines: [
        { who: 'Observation', tone: 'world', text: '« La C204 est annulée par la scolarité. »' },
        { who: 'Modèle', tone: 'model', text: '« Le plan ne tient plus : il faut une autre salle. »' },
        { who: 'Plan', tone: 'harness', text: '[x] Sondage  [ ] Salle (à refaire)  [ ] Rappel avec la bonne salle', code: true },
        { who: 'Action', tone: 'model', text: 'reserver_salle(salle="B012", jour="jeudi", heure="18:00")', code: true },
        { who: 'Résultat', tone: 'good', text: 'B012 réservée, rappel envoyé avec la bonne salle.' },
      ],
      caption: 'On garde ce qui est fait, on refait seulement l’étape touchée.',
    },
  ]),
};
