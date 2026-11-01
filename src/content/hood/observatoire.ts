import type { UnderTheHood } from '../types';
import { commun, hood, py } from './kit';

/** Niveau 10 : long horizon et évaluation. */
export const HOOD_OBSERVATOIRE: Record<string, UnderTheHood> = {
  'l10:long': hood(
    'Le rituel de session',
    commun(
      'Python · harnais',
      py`
CONSIGNE_SESSION = """Avant toute chose :
1. Lis progression.md et la sortie de git log --oneline -20.
2. Lance les tests : tout ce qui passait doit encore passer.
3. Choisis UNE fonctionnalité non faite dans fonctionnalites.json.
Avant de terminer :
- committe ton travail avec un message clair ;
- mets à jour progression.md (fait, reste, bugs connus)."""

for session in range(nb_sessions):        # chaque session part d’un contexte vide…
    messages = [{"role": "user", "content": CONSIGNE_SESSION}]
    boucle_agent(messages, outils=[BASH, EDITEUR])   # …et relit les traces écrites
`,
      [
        'L’état du travail vit dans des fichiers et dans git, pas dans le contexte : chaque session part d’une fenêtre vide et relit ces traces.',
        'Une fonctionnalité par session, testée et committée : c’est plus fiable qu’une session géante qui déborde.',
        'Ce rituel est du harnais pur : il marche à l’identique avec Claude ou Mistral.',
      ],
    ),
  ),

  'l10:benchmarks': hood(
    'Le principe d’un benchmark',
    commun(
      'Python · banc d’essai',
      py`
def evaluer_tache(tache) -> bool:
    depot = cloner_propre(tache.depot, tache.commit)    # environnement neuf
    agent_corrige(depot, tache.ticket)                   # l’agent travaille
    ajouter_tests(depot, tache.tests_caches)             # tests jamais vus par l’agent
    r = subprocess.run(["pytest", *tache.tests_a_faire_passer],
                       cwd=depot, capture_output=True)
    return r.returncode == 0                             # réussi si les tests passent

score = sum(evaluer_tache(t) for t in taches) / len(taches)
print(f"{score:.0%} de tâches réussies")
`,
      [
        'Un benchmark comme SWE-bench Verified suit ce principe : un vrai ticket, un dépôt propre, et des tests cachés qui décident de la réussite.',
        'Les tests restent cachés à l’agent : sinon il pourrait viser les tests au lieu de corriger le bug.',
        'Contamination : si les tickets et leurs correctifs étaient dans les données d’entraînement, le score surestime le modèle.',
      ],
    ),
  ),

  'l10:eval': hood(
    'Fiabilité et juge',
    commun(
      'Python · banc d’essai',
      py`
def fiabilite(taches, k: int = 4) -> tuple[float, float]:
    resultats = [[evaluer_tache(t) for _ in range(k)] for t in taches]
    pass_at_k = sum(any(r) for r in resultats) / len(taches)   # au moins une fois
    pass_hat_k = sum(all(r) for r in resultats) / len(taches)  # les k fois
    return pass_at_k, pass_hat_k

def juger(question: str, a: str, b: str) -> str | None:
    grille = "Compare l’exactitude, les sources citées et la clarté. Réponds A ou B."
    v1 = demander_au_juge(grille, question, a, b)
    v2 = demander_au_juge(grille, question, b, a)     # même duel, ordre inversé
    if (v1, v2) == ("A", "B"):
        return "a"
    if (v1, v2) == ("B", "A"):
        return "b"
    return None                                       # verdict instable : écarté
`,
      [
        'pass@k : réussi au moins une fois sur k essais. pass^k : réussi les k fois. Pour un vrai service, c’est la fiabilité, pass^k, qui compte.',
        'Le juge est consulté deux fois, dans les deux ordres : on ne garde que les verdicts stables, ce qui neutralise le biais de position.',
        'On le calibre aussi : sur une centaine de cas notés par des humains, ses verdicts doivent concorder.',
      ],
    ),
  ),
};
