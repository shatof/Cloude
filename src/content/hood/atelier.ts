import type { UnderTheHood } from '../types';
import { claude, commun, hood, mistral, py } from './kit';

/** Niveaux 3 et 4 : raisonner, planifier. */
export const HOOD_ATELIER: Record<string, UnderTheHood> = {
  'l3:cot': hood(
    'Du prompt à la réflexion native',
    claude(
      py`
# Hier : la chaîne de raisonnement, demandée dans le prompt
consigne = ("Réfléchis étape par étape entre <brouillon> et </brouillon>, "
            "puis donne seulement le résultat.")

# Aujourd’hui : le modèle réfléchit de lui-même, dans des blocs à part
reponse = client.messages.create(
    model=MODELE, max_tokens=16000,
    thinking={"type": "adaptive", "display": "summarized"},
    messages=[{"role": "user", "content": "Batte et balle : 1,10 € en tout…"}],
)
for bloc in reponse.content:
    if bloc.type == "thinking":
        print("Brouillon :", bloc.thinking)   # un résumé du raisonnement
    elif bloc.type == "text":
        print("Réponse :", bloc.text)
`,
      [
        'Hier, le CoT était une consigne. Aujourd’hui, les modèles sont entraînés à réfléchir avant de répondre, dans des blocs `thinking` séparés.',
        '`"adaptive"` : le modèle décide lui-même quand et combien réfléchir. `display: "summarized"` demande un résumé lisible ; le raisonnement brut n’est jamais exposé.',
        'Ce brouillon aide le modèle, mais ne prouve rien : on vérifie toujours le résultat (niveau 7).',
      ],
    ),
    mistral(
      py`
# Hier : la chaîne de raisonnement, demandée dans le prompt
consigne = ("Réfléchis étape par étape entre <brouillon> et </brouillon>, "
            "puis donne seulement le résultat.")

# Aujourd’hui : un modèle de raisonnement réfléchit de lui-même
reponse = client.chat.complete(
    model=MODELE_RAISONNEMENT,
    prompt_mode="reasoning",       # consignes système prévues pour le raisonnement
    messages=[{"role": "user", "content": "Batte et balle : 1,10 € en tout…"}],
)
for morceau in reponse.choices[0].message.content:   # une liste de morceaux
    if morceau.type == "thinking":
        print("Brouillon :", "".join(getattr(t, "text", "") for t in morceau.thinking))
    elif morceau.type == "text":
        print("Réponse :", morceau.text)
`,
      [
        'Chez Mistral, on passe par un modèle de raisonnement (Magistral, lancé en 2025, en est un) : sa réponse est une liste de morceaux, dont des morceaux `thinking`.',
        '`prompt_mode="reasoning"` active les consignes système prévues par Mistral pour ces modèles.',
        'Ce brouillon aide le modèle, mais ne prouve rien : on vérifie toujours le résultat (niveau 7).',
      ],
    ),
  ),

  'l3:react': hood(
    'ReAct « à l’ancienne »',
    claude(
      py`
# ReAct en 2022 : le format est dans le prompt,
# et le harnais coupe la génération avant l’observation.
trace = f"Question : {question}\n"
for _ in range(10):
    reponse = client.messages.create(
        model=MODELE, max_tokens=16000,
        system=CONSIGNES_REACT,              # « Pensée : … Action : outil[argument] »
        messages=[{"role": "user", "content": trace}],
        stop_sequences=["Observation :"],    # sinon il l’inventerait !
    )
    texte = next(b.text for b in reponse.content if b.type == "text")
    trace += texte
    action = re.search(r"Action : (\w+)\[(.*)\]", texte)
    if action is None:                       # plus d’action : réponse finale
        break
    trace += f"\nObservation : {executer(action[1], action[2])}\n"
`,
      [
        'La pensée et l’action sont écrites par le modèle ; l’observation est écrite par le harnais, après exécution de l’outil.',
        '`stop_sequences` arrête la génération dès « Observation : ». Sans ça, le modèle écrirait lui-même un résultat… inventé.',
        'Aujourd’hui, `tools` et les blocs `tool_use` remplacent ce format texte : c’est la boucle du niveau 1, avec réflexion entre les appels.',
      ],
    ),
    mistral(
      py`
# ReAct en 2022 : le format est dans le prompt,
# et le harnais coupe la génération avant l’observation.
trace = f"Question : {question}\n"
for _ in range(10):
    reponse = client.chat.complete(
        model=MODELE,
        messages=[{"role": "system", "content": CONSIGNES_REACT},
                  {"role": "user", "content": trace}],
        stop=["Observation :"],              # sinon il l’inventerait !
    )
    texte = reponse.choices[0].message.content
    trace += texte
    action = re.search(r"Action : (\w+)\[(.*)\]", texte)
    if action is None:                       # plus d’action : réponse finale
        break
    trace += f"\nObservation : {executer(action[1], action[2])}\n"
`,
      [
        'Même mécanique chez Mistral : le paramètre s’appelle simplement `stop`.',
        'La pensée et l’action sont écrites par le modèle ; l’observation, par le harnais, après exécution.',
        'Aujourd’hui, `tools` et `tool_calls` remplacent ce format texte : c’est la boucle du niveau 1.',
      ],
    ),
  ),

  'l3:test-time': hood(
    'Doser l’effort',
    claude(
      py`
def demander(question: str, effort: str) -> str:
    reponse = client.messages.create(
        model=MODELE, max_tokens=16000,
        output_config={"effort": effort},    # low, medium, high, xhigh ou max
        messages=[{"role": "user", "content": question}],
    )
    print(reponse.usage.output_tokens, "tokens de sortie, réflexion comprise")
    return next(b.text for b in reponse.content if b.type == "text")

demander("Traduis « merci » en espagnol.", effort="low")
demander("Pourquoi ce test échoue-t-il une fois sur dix ?", effort="high")
`,
      [
        'Le test-time compute se règle avec `effort` : plus il est élevé, plus le modèle peut réfléchir, et plus la réponse coûte.',
        'La réflexion est facturée comme de la sortie : `usage.output_tokens` montre le prix d’un effort élevé.',
        'Choisir l’effort avant l’appel, selon la question, c’est faire du routage (un `jauger_difficulte` en amont, par exemple).',
      ],
    ),
    mistral(
      py`
def demander(question: str, effort: str) -> str:
    reponse = client.chat.complete(
        model=MODELE_RAISONNEMENT,
        reasoning_effort=effort,             # de "none" à "max"
        messages=[{"role": "user", "content": question}],
    )
    print(reponse.usage.completion_tokens, "tokens de sortie")
    morceaux = reponse.choices[0].message.content
    return "".join(m.text for m in morceaux if m.type == "text")

demander("Traduis « merci » en espagnol.", effort="low")
demander("Pourquoi ce test échoue-t-il une fois sur dix ?", effort="high")
`,
      [
        'Le SDK Mistral expose `reasoning_effort`, de `"none"` à `"max"`, pour les modèles de raisonnement qui le prennent en charge.',
        'Autre levier : choisir le modèle lui-même, rapide pour le simple, de raisonnement pour le difficile.',
        'Choisir l’effort ou le modèle avant l’appel, selon la question, c’est faire du routage.',
      ],
    ),
  ),

  'l4:decomposition': hood(
    'Un plan en JSON',
    claude(
      py`
SCHEMA_PLAN = {
    "type": "object",
    "properties": {"etapes": {"type": "array", "items": {
        "type": "object",
        "properties": {"tache": {"type": "string"},
                       "depend_de": {"type": "array", "items": {"type": "integer"}}},
        "required": ["tache", "depend_de"],
        "additionalProperties": False,
    }}},
    "required": ["etapes"],
    "additionalProperties": False,
}

reponse = client.messages.create(
    model=MODELE, max_tokens=16000,
    output_config={"format": {"type": "json_schema", "schema": SCHEMA_PLAN}},
    messages=[{"role": "user", "content": "Découpe : la soirée de révisions."}],
)
plan = json.loads(next(b.text for b in reponse.content if b.type == "text"))
`,
      [
        '`output_config.format` impose une réponse JSON conforme au schéma : le plan devient une donnée que le harnais peut lire, ordonner et suivre.',
        '`depend_de` encode les dépendances : le harnais sait quelles étapes peuvent démarrer, et lesquelles attendent.',
      ],
    ),
    mistral(
      py`
SCHEMA_PLAN = {
    "type": "object",
    "properties": {"etapes": {"type": "array", "items": {
        "type": "object",
        "properties": {"tache": {"type": "string"},
                       "depend_de": {"type": "array", "items": {"type": "integer"}}},
        "required": ["tache", "depend_de"],
        "additionalProperties": False,
    }}},
    "required": ["etapes"],
    "additionalProperties": False,
}

reponse = client.chat.complete(
    model=MODELE,
    response_format={"type": "json_schema", "json_schema": {
        "name": "plan", "schema_definition": SCHEMA_PLAN, "strict": True}},
    messages=[{"role": "user", "content": "Découpe : la soirée de révisions."}],
)
plan = json.loads(reponse.choices[0].message.content)
`,
      [
        'Chez Mistral, c’est `response_format`, avec `"type": "json_schema"` et `"strict": True`.',
        'Dans le SDK Python, la clé du schéma s’écrit `schema_definition` (l’API REST l’appelle `schema`).',
        '`depend_de` encode les dépendances : le harnais sait quelles étapes peuvent démarrer.',
      ],
    ),
  ),

  'l4:todo': hood(
    'Le plan, tenu par le harnais',
    commun(
      'Python · harnais',
      py`
plan = []                                 # le plan vit dans le harnais

def ecrire_plan(taches: list[dict]) -> str:
    """Outil appelé par le modèle pour créer ou mettre à jour le plan."""
    plan[:] = taches
    lignes = [f"[{'x' if t['statut'] == 'fait' else ' '}] {t['tache']}" for t in plan]
    return "Plan enregistré :\n" + "\n".join(lignes)

# Le modèle l’appelle au début, puis à chaque avancée :
ecrire_plan([
    {"tache": "Sonder la promo", "statut": "fait"},
    {"tache": "Réserver une salle", "statut": "en_cours"},
    {"tache": "Envoyer les invitations", "statut": "a_faire"},
])
# -> [x] Sonder la promo / [ ] Réserver une salle / [ ] Envoyer les invitations
`,
      [
        'Le plan est stocké par le harnais, pas gardé « en tête » : l’outil le renvoie sous forme de liste à cocher, à chaque mise à jour.',
        'On le déclare comme n’importe quel outil (niveau 2) ; les agents de code ont tous un outil de ce genre pour leur liste de tâches.',
        'Même code avec Claude ou Mistral : seule la déclaration de l’outil change de format.',
      ],
    ),
  ),

  'l4:replan': hood(
    'Relancer la planification',
    claude(
      py`
resultats = []
for bloc in reponse.content:
    if bloc.type == "tool_use":
        sortie = executer(bloc.name, bloc.input)
        resultats.append({"type": "tool_result", "tool_use_id": bloc.id,
                          "content": sortie, "is_error": sortie.startswith("ERREUR")})
messages.append({"role": "user", "content": resultats})

if any(r["is_error"] for r in resultats):
    # Le harnais demande de revoir le plan, avec l’autorité du système
    messages.append({"role": "system", "content":
        "Une action a échoué. Ton plan tient-il encore ? "
        "Mets-le à jour avec ecrire_plan avant de continuer."})
`,
      [
        'Un échec d’outil est une observation : le harnais le marque (`is_error`) et peut ajouter une consigne de replanification.',
        'Un message `role: "system"` ajouté en cours de route porte l’autorité du harnais sans toucher au début du prompt, ce qui garde le cache valide (sur les modèles Claude qui le prennent en charge).',
      ],
    ),
    mistral(
      py`
message = reponse.choices[0].message
messages.append(message)
erreurs = 0
for appel in message.tool_calls:
    sortie = executer(appel.function.name, lire_args(appel))  # voir niveau 1
    erreurs += sortie.startswith("ERREUR")
    messages.append({"role": "tool", "tool_call_id": appel.id,
                     "name": appel.function.name, "content": sortie})

if erreurs:
    # Le harnais demande de revoir le plan avant de continuer
    messages.append({"role": "user", "content":
        "Une action a échoué. Ton plan tient-il encore ? "
        "Mets-le à jour avec ecrire_plan avant de continuer."})
`,
      [
        'Un échec d’outil est une observation : le harnais le compte et ajoute une consigne de replanification.',
        'La relance vient après les résultats d’outils : la boucle reprend avec cette consigne sous les yeux du modèle.',
      ],
    ),
  ),
};
