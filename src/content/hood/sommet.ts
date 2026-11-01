import type { UnderTheHood } from '../types';
import { claude, commun, hood, mistral, py } from './kit';

/** Boss final : le harnais complet. */
export const HOOD_SOMMET: Record<string, UnderTheHood> = {
  'final:recap': hood(
    'Le harnais complet, en une fonction',
    claude(
      py`
def agent(demande: str) -> str:      # les numéros renvoient aux niveaux
    messages = [{"role": "user", "content": charger_memoire() + demande}]  # 5
    for _ in range(MAX_TOURS):                                             # 7
        if arret.is_set():                                                 # 12
            break
        reponse = client.beta.messages.create(
            model=MODELE, max_tokens=16000,        # le SEUL endroit du modèle
            system=SYSTEM + index_competences(),                           # 6
            tools=OUTILS,                                                  # 2, 9
            output_config={"effort": choisir_effort(demande)},             # 3
            betas=["compact-2026-01-12", "server-side-fallback-2026-07-01"],
            context_management={"edits": [{"type": "compact_20260112"}]},  # 7
            fallbacks="default",           # autre modèle en cas de refus
            messages=messages,
        )
        messages.append({"role": "assistant", "content": reponse.content})
        if reponse.stop_reason == "tool_use":
            messages.append({"role": "user", "content": [                  # 7, 11
                executer_garde(b) for b in reponse.content if b.type == "tool_use"]})
        elif reponse.stop_reason == "refusal":
            return "Demande refusée."
        elif verifier():                                                   # 7
            return next(b.text for b in reponse.content if b.type == "text")
        else:
            messages.append({"role": "user", "content": "Les tests échouent."})
    return "Arrêt : limite de tours atteinte."
`,
      [
        'Chaque ligne renvoie à un niveau : mémoire (5), skills (6), effort (3), outils et MCP (2, 9), arrêt et compaction (7), garde-fous (7, 11, 12), vérification (7).',
        'Le modèle n’apparaît qu’à un seul endroit : `model=MODELE`. Tout le reste, c’est le harnais.',
        '`fallbacks="default"` (bêta) relance la requête sur un autre modèle si le premier refuse pour raison de sécurité : une pièce de harnais fournie par l’API.',
      ],
    ),
    mistral(
      py`
def agent(demande: str) -> str:      # les numéros renvoient aux niveaux
    messages = [{"role": "system", "content": SYSTEM + index_competences()},  # 6
                {"role": "user", "content": charger_memoire() + demande}]     # 5
    for _ in range(MAX_TOURS):                                                # 7
        if arret.is_set():                                                    # 12
            break
        reponse = client.chat.complete(
            model=MODELE,                       # le SEUL endroit du modèle
            tools=OUTILS,                                                     # 2
            reasoning_effort=choisir_effort(demande),                         # 3
            messages=messages,
        )
        choix = reponse.choices[0]
        messages.append(choix.message)
        if choix.finish_reason == "tool_calls":
            messages += [executer_garde(a) for a in choix.message.tool_calls]  # 7, 11
        elif verifier():                                                      # 7
            return texte(choix.message)
        else:
            messages.append({"role": "user", "content": "Les tests échouent."})
        if reponse.usage.prompt_tokens > SEUIL_TOKENS:
            messages = compacter(messages)                                    # 7
    return "Arrêt : limite de tours atteinte."
`,
      [
        'Même squelette qu’avec Claude, seuls les noms changent : `finish_reason`, messages `tool`, `reasoning_effort` (sur un modèle de raisonnement).',
        'La compaction est faite par le harnais (niveau 7), faute d’équivalent côté serveur.',
        'Le modèle n’apparaît qu’à un seul endroit : `model=MODELE`. Tout le reste, c’est le harnais.',
      ],
    ),
  ),

  'final:architect': hood(
    'Un harnais décrit comme une configuration',
    commun(
      'Python · harnais',
      py`
HARNAIS_VOYAGE = {
    "outils": ["chercher_trains", "chercher_hotels", "reserver", "payer"],
    "memoire": {"fichier": "preferences_ines.md"},
    "plan": True,
    "arret": {"max_tours": 40, "budget_euros": 2.0},
    "permissions": {"chercher_*": "autorise", "reserver": "sur_demande",
                    "payer": "sur_demande"},
    "paiement": {"mandat": {"plafond": 250, "marchands": ["rail", "hotels_agrees"]}},
    "bouclier": {"balisage": True, "lecteur_en_quarantaine": True},
    "arret_urgence": True,
    "sous_agents": False,                  # superflu pour un week-end
}
`,
      [
        'Concevoir un harnais, c’est surtout décider : chaque clé est une pièce, gardée ou écartée selon les risques du cas.',
        'Écrit comme une configuration, ce choix se relit, se teste et se versionne ; l’évaluation (niveau 10) dit s’il tient ses promesses.',
        'Cette configuration ne mentionne aucun modèle : on peut changer de fournisseur sans toucher au harnais.',
      ],
    ),
  ),
};
