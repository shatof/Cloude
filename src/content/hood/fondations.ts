import type { UnderTheHood } from '../types';
import { claude, commun, hood, mistral, py } from './kit';

/** Niveaux 0 à 2 : le modèle, la boucle, les outils. */
export const HOOD_FONDATIONS: Record<string, UnderTheHood> = {
  'l0:tokens': hood(
    'Compter les tokens',
    claude(
      py`
import anthropic

client = anthropic.Anthropic()        # clé lue dans ANTHROPIC_API_KEY
MODELE = "…"                          # identifiant d’un modèle Claude

reponse = client.messages.count_tokens(
    model=MODELE,
    messages=[{"role": "user", "content": "arrière-grand-mère"}],
)
print(reponse.input_tokens)           # tokens comptés en entrée
`,
      [
        'Le texte n’est jamais envoyé lettre par lettre : le tokenizer du modèle le découpe en tokens, et chaque token devient un numéro.',
        '`count_tokens` compte sans rien générer : pratique pour estimer un coût, ou vérifier qu’un document tient dans la fenêtre.',
        'Dans tous les extraits, `client` et `MODELE` sont créés ainsi ; la liste des modèles s’obtient avec `client.models.list()`.',
      ],
    ),
    mistral(
      py`
import os
from mistralai.client import Mistral

client = Mistral(api_key=os.environ["MISTRAL_API_KEY"])
MODELE = "…"                          # identifiant d’un modèle Mistral

reponse = client.chat.complete(
    model=MODELE,
    messages=[{"role": "user", "content": "arrière-grand-mère"}],
    max_tokens=1,                     # on ne veut que le compte, pas de texte
)
print(reponse.usage.prompt_tokens)    # tokens comptés en entrée
`,
      [
        'Même principe chez Mistral, avec son propre tokenizer : un même texte ne fait pas le même nombre de tokens chez deux fournisseurs.',
        'Chaque réponse indique sa consommation dans `usage` : `prompt_tokens` (entrée) et `completion_tokens` (sortie).',
        'Le tokenizer de Mistral est public (bibliothèque `mistral-common`) : on peut compter, et même afficher les tokens, sans appeler l’API.',
      ],
    ),
  ),

  'l0:next-token': hood(
    'Tirer le token suivant',
    commun(
      'Python · numpy',
      py`
import numpy as np

# Pour « Nous sommes le … », le modèle donne un score (logit) par token
tokens = ["lundi", "mardi", "1er", "12", "samedi"]
logits = np.array([2.1, 2.0, 1.5, 1.3, 1.1])

def tirer(logits, temperature=1.0):
    p = np.exp(logits / temperature)
    p = p / p.sum()                   # softmax : des scores aux probabilités
    return np.random.choice(len(p), p=p), p

i, probas = tirer(logits)
print(tokens[i], probas.round(2))     # « mardi », par exemple
`,
      [
        'À chaque token, le modèle produit un score pour chaque token possible ; le softmax les transforme en probabilités, puis on tire au sort.',
        'La température aplatit (au-dessus de 1) ou accentue (en dessous) les écarts. L’API Mistral la laisse régler (`temperature`) ; les modèles Claude récents n’acceptent plus ce réglage.',
        'Le token tiré est ajouté au texte, et on recommence : c’est toute la génération.',
      ],
    ),
  ),

  'l0:context-window': hood(
    'Renvoyer tout l’historique',
    claude(
      py`
historique = []

def discuter(message: str) -> str:
    historique.append({"role": "user", "content": message})
    reponse = client.messages.create(
        model=MODELE,
        max_tokens=16000,
        messages=historique,          # TOUT l’historique, à chaque appel
    )
    texte = next(b.text for b in reponse.content if b.type == "text")
    historique.append({"role": "assistant", "content": texte})
    return texte

discuter("Je m’appelle Inès.")
discuter("Comment je m’appelle ?")    # marche : le 1er message est renvoyé
`,
      [
        'L’API est sans état : le modèle ne garde rien d’un appel à l’autre. C’est ton code qui renvoie toute la conversation, à chaque fois.',
        'Tout ce qui est renvoyé occupe la fenêtre de contexte : quand l’historique grossit trop, il faut couper, résumer ou trier (niveaux 5 à 7).',
        'La « mémoire » d’un chatbot, c’est cette liste `historique`, et rien de plus.',
      ],
    ),
    mistral(
      py`
historique = []

def discuter(message: str) -> str:
    historique.append({"role": "user", "content": message})
    reponse = client.chat.complete(
        model=MODELE,
        messages=historique,          # TOUT l’historique, à chaque appel
    )
    texte = reponse.choices[0].message.content
    historique.append({"role": "assistant", "content": texte})
    return texte

discuter("Je m’appelle Inès.")
discuter("Comment je m’appelle ?")    # marche : le 1er message est renvoyé
`,
      [
        'L’API est sans état : le modèle ne garde rien d’un appel à l’autre. C’est ton code qui renvoie toute la conversation, à chaque fois.',
        'Même logique que chez Claude, autres noms : la réponse se lit dans `choices[0].message.content`.',
        'La « mémoire » d’un chatbot, c’est cette liste `historique`, et rien de plus.',
      ],
    ),
  ),

  'l1:model-plus-harness': hood(
    'Un appel, et tout le reste',
    claude(
      py`
reponse = client.messages.create(
    model=MODELE,
    max_tokens=16000,
    system="Tu es Bob, l’assistant d’Inès.",
    messages=[{"role": "user", "content": "Réserve une salle jeudi à 14 h."}],
)
print(next(b.text for b in reponse.content if b.type == "text"))
# « C’est fait ! »… mais rien n’a été réservé : aucun outil, aucune boucle.

# Tout le reste est à écrire autour de cet appel : c’est le harnais.
#  - choisir ce qu’on envoie (consignes, historique, outils) ;
#  - exécuter les actions que le modèle demande ;
#  - renvoyer les résultats et décider quand s’arrêter.
`,
      [
        'Un appel à l’API ne fait qu’une chose : produire une réponse. Il ne réserve rien, ne lit rien, ne se souvient de rien.',
        'Chez Claude, les consignes passent par le paramètre `system`, à part des messages.',
        'Tout ce qui transforme ce cerveau en agent, c’est du code ordinaire autour de l’appel : le harnais.',
      ],
    ),
    mistral(
      py`
reponse = client.chat.complete(
    model=MODELE,
    messages=[
        {"role": "system", "content": "Tu es Bob, l’assistant d’Inès."},
        {"role": "user", "content": "Réserve une salle jeudi à 14 h."},
    ],
)
print(reponse.choices[0].message.content)
# « C’est fait ! »… mais rien n’a été réservé : aucun outil, aucune boucle.

# Tout le reste est à écrire autour de cet appel : c’est le harnais.
#  - choisir ce qu’on envoie (consignes, historique, outils) ;
#  - exécuter les actions que le modèle demande ;
#  - renvoyer les résultats et décider quand s’arrêter.
`,
      [
        'Un appel à l’API ne fait qu’une chose : produire une réponse. Il ne réserve rien, ne lit rien, ne se souvient de rien.',
        'Chez Mistral, les consignes sont un message de rôle `system`, placé en tête de la liste.',
        'Tout ce qui transforme ce cerveau en agent, c’est du code ordinaire autour de l’appel : le harnais.',
      ],
    ),
  ),

  'l1:agent-loop': hood(
    'La boucle agentique',
    claude(
      py`
messages = [{"role": "user", "content": demande}]
while True:
    reponse = client.messages.create(
        model=MODELE, max_tokens=16000, tools=OUTILS, messages=messages,
    )
    messages.append({"role": "assistant", "content": reponse.content})
    if reponse.stop_reason != "tool_use":
        break                                   # réponse finale : fin de boucle
    resultats = []
    for bloc in reponse.content:
        if bloc.type == "tool_use":             # agir…
            resultats.append({"type": "tool_result", "tool_use_id": bloc.id,
                              "content": executer(bloc.name, bloc.input)})
    messages.append({"role": "user", "content": resultats})   # …observer
`,
      [
        'Percevoir : la liste `messages`. Raisonner : l’appel au modèle. Agir : `executer(...)`. Observer : les `tool_result`, renvoyés au tour suivant.',
        '`stop_reason` dit pourquoi le modèle s’est arrêté : `"tool_use"` s’il demande une action, `"end_turn"` s’il a terminé.',
        'On renvoie `reponse.content` en entier, pas seulement le texte : les blocs d’outil (et de réflexion) doivent revenir au tour suivant.',
      ],
    ),
    mistral(
      py`
messages = [{"role": "user", "content": demande}]
while True:
    reponse = client.chat.complete(model=MODELE, tools=OUTILS, messages=messages)
    choix = reponse.choices[0]
    messages.append(choix.message)              # appels d’outils compris
    if choix.finish_reason != "tool_calls":
        break                                   # réponse finale : fin de boucle
    for appel in choix.message.tool_calls:      # agir…
        args = appel.function.arguments
        if isinstance(args, str):
            args = json.loads(args)             # texte JSON ou dict, selon les cas
        messages.append({"role": "tool", "tool_call_id": appel.id,   # …observer
                         "name": appel.function.name,
                         "content": executer(appel.function.name, args)})
`,
      [
        'Même boucle qu’avec Claude, autres noms : `finish_reason == "tool_calls"` au lieu de `stop_reason == "tool_use"`.',
        'Chaque résultat est un message de rôle `tool`, relié à sa demande par `tool_call_id`.',
        'Les arguments d’un appel peuvent arriver sous forme de texte JSON : on les décode avant d’exécuter.',
      ],
    ),
  ),

  'l1:who-does-what': hood(
    'Le harnais exécute',
    commun(
      'Python · harnais',
      py`
def reserver_salle(salle: str, jour: str, heure: str) -> str:
    # Le vrai système de réservation : c’est le harnais qui l’appelle
    if not planning.est_libre(salle, jour, heure):
        return f"ERREUR : {salle} indisponible"
    numero = planning.reserver(salle, jour, heure)
    return f"Confirmé, n° {numero}"

ACTIONS = {"reserver_salle": reserver_salle}

def executer(nom: str, arguments: dict) -> str:
    if nom not in ACTIONS:
        return f"ERREUR : outil inconnu « {nom} »"
    return ACTIONS[nom](**arguments)  # le modèle a seulement DEMANDÉ l’action
`,
      [
        'Le modèle ne touche jamais au planning : il écrit une demande, et le harnais l’exécute avec du code normal.',
        'Une erreur est renvoyée au modèle comme un résultat : il peut corriger au tour suivant.',
        'Ce code est le même avec Claude ou Mistral : il fait partie du harnais, pas du modèle.',
      ],
    ),
  ),

  'l2:tool-definition': hood(
    'Le paramètre tools',
    claude(
      py`
OUTILS = [{
    "name": "creer_evenement",
    "description": "Ajoute un événement à l’agenda d’Inès. "
                   "À utiliser pour les examens et les rendus.",
    "input_schema": {                        # schéma JSON des paramètres
        "type": "object",
        "properties": {
            "date": {"type": "string", "description": "AAAA-MM-JJ"},
            "titre": {"type": "string"},
            "heure": {"type": "string", "description": "HH:MM"},
        },
        "required": ["date", "titre"],
    },
}]

reponse = client.messages.create(
    model=MODELE, max_tokens=16000,
    tools=OUTILS,                            # la liste des outils, à chaque appel
    messages=[{"role": "user", "content": "Note mon partiel le 12 janvier."}],
)
`,
      [
        'Oui : le paramètre `tools` reçoit la liste des outils, à chaque requête. Le harnais les décrit, le modèle les lit.',
        'Un outil = un nom, une description (c’est elle qui guide le choix) et un schéma JSON des paramètres, `input_schema`.',
        'Le modèle n’exécute rien : au mieux, sa réponse contient une demande d’appel, que le harnais traitera.',
      ],
    ),
    mistral(
      py`
OUTILS = [{
    "type": "function",
    "function": {
        "name": "creer_evenement",
        "description": "Ajoute un événement à l’agenda d’Inès. "
                       "À utiliser pour les examens et les rendus.",
        "parameters": {                      # schéma JSON des paramètres
            "type": "object",
            "properties": {
                "date": {"type": "string", "description": "AAAA-MM-JJ"},
                "titre": {"type": "string"},
                "heure": {"type": "string", "description": "HH:MM"},
            },
            "required": ["date", "titre"],
        },
    },
}]

reponse = client.chat.complete(
    model=MODELE,
    tools=OUTILS,                            # la liste des outils, à chaque appel
    tool_choice="auto",                      # le modèle décide d’appeler ou non
    messages=[{"role": "user", "content": "Note mon partiel le 12 janvier."}],
)
`,
      [
        'Même principe : `tools` reçoit la liste des outils. Chez Mistral, chaque outil est enveloppé dans `{"type": "function", "function": {...}}`.',
        'Le schéma s’appelle `parameters` (au lieu d’`input_schema` chez Claude) : c’est le même JSON Schema.',
        '`tool_choice` règle l’usage : `"auto"` (le modèle décide), `"none"` (interdit) ou `"any"` (au moins un appel obligatoire).',
      ],
    ),
  ),

  'l2:function-calling': hood(
    'La demande d’appel et son résultat',
    claude(
      py`
appel = next(b for b in reponse.content if b.type == "tool_use")
print(appel.name)    # "creer_evenement"
print(appel.input)   # {"date": "2027-01-12", "titre": "Partiel de réseaux"}

numero = agenda.creer(**appel.input)          # le harnais exécute
messages += [
    {"role": "assistant", "content": reponse.content},
    {"role": "user", "content": [{
        "type": "tool_result",
        "tool_use_id": appel.id,               # relie le résultat à la demande
        "content": json.dumps({"ok": True, "id": numero}),
    }]},
]
reponse = client.messages.create(model=MODELE, max_tokens=16000,
                                 tools=OUTILS, messages=messages)
`,
      [
        'Quand le modèle veut agir, la réponse s’arrête avec `stop_reason == "tool_use"` et contient un bloc `tool_use` : nom, arguments, identifiant.',
        'Le résultat repart dans un bloc `tool_result`, avec le même `tool_use_id`, côté `user` : c’est le harnais qui « parle ».',
        'Plusieurs `tool_use` dans une réponse ? On les exécute tous, et on renvoie tous les résultats dans un seul message.',
      ],
    ),
    mistral(
      py`
message = reponse.choices[0].message
appel = message.tool_calls[0]
print(appel.function.name)        # "creer_evenement"
args = appel.function.arguments   # texte JSON ou dict, selon les cas
args = json.loads(args) if isinstance(args, str) else args

numero = agenda.creer(**args)                 # le harnais exécute
messages += [
    message,                                  # la demande d’appel du modèle
    {"role": "tool", "tool_call_id": appel.id,
     "name": "creer_evenement",
     "content": json.dumps({"ok": True, "id": numero})},
]
reponse = client.chat.complete(model=MODELE, tools=OUTILS, messages=messages)
`,
      [
        'Quand le modèle veut agir, `finish_reason` vaut `"tool_calls"` et le message contient `tool_calls` : nom, arguments, identifiant.',
        'Le résultat repart dans un message de rôle `tool`, avec le même `tool_call_id`.',
        'Avec `parallel_tool_calls`, le modèle peut demander plusieurs appels d’un coup : on renvoie un message `tool` par appel.',
      ],
    ),
  ),

  'l2:tool-design': hood(
    'Schémas stricts et erreurs utiles',
    claude(
      py`
OUTIL = {
    "name": "chercher_cours",
    "description": "Cherche dans les supports de cours d’Inès. Pas pour le Web.",
    "strict": True,                       # arguments conformes au schéma, garanti
    "input_schema": {
        "type": "object",
        "properties": {
            "requete": {"type": "string"},
            "max_resultats": {"type": "integer", "enum": [1, 3, 5, 10]},
        },
        "required": ["requete", "max_resultats"],
        "additionalProperties": False,    # exigé par strict
    },
}

# Une erreur utile, renvoyée au modèle plutôt qu’un plantage muet :
erreur = {"type": "tool_result", "tool_use_id": appel.id, "is_error": True,
          "content": "Cours « reseau » introuvable. Cours : réseaux, BDD, système."}
`,
      [
        '`strict: True` garantit des arguments valides selon le schéma ; il exige `additionalProperties: False` et la liste `required`.',
        'Un `enum` restreint les valeurs possibles : moins d’erreurs, et moins de cas à valider.',
        '`is_error: True` signale un échec ; un message clair permet au modèle de se corriger seul.',
        'Les modèles Claude récents n’acceptent plus qu’on force un appel : on laisse `tool_choice` sur `auto` et on guide par le prompt.',
      ],
    ),
    mistral(
      py`
OUTIL = {
    "type": "function",
    "function": {
        "name": "chercher_cours",
        "description": "Cherche dans les supports de cours d’Inès. Pas pour le Web.",
        "strict": True,                   # arguments conformes au schéma
        "parameters": {
            "type": "object",
            "properties": {
                "requete": {"type": "string"},
                "max_resultats": {"type": "integer", "enum": [1, 3, 5, 10]},
            },
            "required": ["requete", "max_resultats"],
            "additionalProperties": False,
        },
    },
}

# Pas de champ « erreur » dédié : le message d’erreur va dans content.
erreur = {"role": "tool", "tool_call_id": appel.id, "name": "chercher_cours",
          "content": "ERREUR : cours « reseau » introuvable. Cours : réseaux, BDD."}
`,
      [
        'Chez Mistral aussi, `strict` se place dans la définition de la fonction.',
        'Un `enum` restreint les valeurs possibles : moins d’erreurs, et moins de cas à valider.',
        'Pas d’équivalent d’`is_error` : on écrit l’erreur, clairement, dans `content`, et le modèle se corrige au tour suivant.',
        '`tool_choice="any"` oblige à appeler au moins un outil : à réserver aux cas où une action est vraiment requise.',
      ],
    ),
  ),
};
