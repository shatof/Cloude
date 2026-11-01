import type { UnderTheHood } from '../types';
import { claude, commun, hood, mistral, py } from './kit';

/** Niveaux 5 et 6 : mémoire, RAG, cache, contexte. */
export const HOOD_BIBLIOTHEQUE: Record<string, UnderTheHood> = {
  'l5:short-long': hood(
    'Une mémoire qui survit à la session',
    claude(
      py`
# Outil mémoire fourni par Anthropic : Claude lit et écrit dans /memories,
# et c’est ton code qui stocke réellement les fichiers.
reponse = client.messages.create(
    model=MODELE, max_tokens=16000,
    tools=[{"type": "memory_20250818", "name": "memory"}],
    messages=[{"role": "user", "content":
               "Je suis en L3 info, et mon partiel de réseaux est le 12 janvier."}],
)
for bloc in reponse.content:
    if bloc.type == "tool_use" and bloc.name == "memory":
        print(bloc.input)
        # ex. {"command": "create", "path": "/memories/ines.md",
        #      "file_text": "- L3 info\n- partiel de réseaux : 12/01"}
        resultat = stockage.executer(bloc.input)   # écrit vraiment sur disque
`,
      [
        'Court terme : la liste `messages` de la session. Long terme : des fichiers hors du modèle, relus d’une session à l’autre.',
        'L’outil est défini par Anthropic (`memory_20250818`), mais exécuté par ton harnais : c’est toi qui décides où vivent les fichiers.',
        'Le SDK fournit une classe de base pour l’implémenter (`BetaAbstractMemoryTool`), avec les commandes view, create, str_replace, insert, delete et rename.',
      ],
    ),
    mistral(
      py`
# Pas d’outil mémoire tout fait : on déclare le sien, et le harnais
# range les notes dans un fichier, rechargé au début de chaque session.
NOTES = pathlib.Path("memoire_ines.md")

def lire_memoire() -> str:
    return NOTES.read_text() if NOTES.exists() else "(aucune note)"

def ecrire_memoire(note: str) -> str:          # outil appelé par le modèle
    with NOTES.open("a") as f:
        f.write(f"- {note}\n")
    return "Noté."

messages = [
    {"role": "system", "content": "Notes sur Inès :\n" + lire_memoire()},
    {"role": "user", "content": demande},
]
reponse = client.chat.complete(model=MODELE, tools=OUTILS_MEMOIRE, messages=messages)
`,
      [
        'Court terme : la liste `messages`. Long terme : un fichier hors du modèle, rechargé dans le contexte au début de chaque session.',
        'Mistral n’a pas d’outil mémoire prédéfini : on déclare le sien (`ecrire_memoire`), au format vu au niveau 2.',
        'Son API Agents (bêta) peut aussi garder l’historique d’une conversation côté serveur (`conversations.start`, puis `append`) : pratique, mais ce n’est pas une mémoire de long terme.',
      ],
    ),
  ),

  'l5:rag': hood(
    'Chercher, puis répondre',
    claude(
      py`
from sentence_transformers import SentenceTransformer
import numpy as np

encodeur = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
passages = decouper(poly, taille=800)             # ~600 passages
vecteurs = encodeur.encode(passages, normalize_embeddings=True)

def chercher(question: str, k: int = 3) -> list[str]:
    q = encodeur.encode([question], normalize_embeddings=True)[0]
    scores = vecteurs @ q                         # similarité cosinus
    return [passages[i] for i in np.argsort(-scores)[:k]]

question = "Quel exercice refaire avant le partiel ?"
reponse = client.messages.create(
    model=MODELE, max_tokens=16000,
    system="Réponds à partir de ces extraits du poly, en citant la page :\n"
           + "\n\n".join(chercher(question)),
    messages=[{"role": "user", "content": question}],
)
`,
      [
        'Un embedding transforme un texte en vecteur : deux textes au sens proche ont des vecteurs proches (produit scalaire élevé).',
        'On encode le poly une fois ; à chaque question, on ne garde que les k passages les plus proches.',
        'Anthropic ne fournit pas de modèle d’embeddings : on en prend un dédié, ici un modèle ouvert. L’API sait en revanche citer ses sources quand on lui passe des documents (`citations`).',
      ],
    ),
    mistral(
      py`
import numpy as np

def encoder(textes: list[str]) -> np.ndarray:
    reponse = client.embeddings.create(model=MODELE_EMBED, inputs=textes)
    v = np.array([d.embedding for d in reponse.data])
    return v / np.linalg.norm(v, axis=1, keepdims=True)   # vecteurs unitaires

passages = decouper(poly, taille=800)             # ~600 passages
vecteurs = encoder(passages)                      # (par lots, en vrai)

def chercher(question: str, k: int = 3) -> list[str]:
    scores = vecteurs @ encoder([question])[0]    # similarité cosinus
    return [passages[i] for i in np.argsort(-scores)[:k]]

question = "Quel exercice refaire avant le partiel ?"
reponse = client.chat.complete(model=MODELE, messages=[
    {"role": "system", "content": "Réponds à partir de ces extraits, en citant "
                                  "la page :\n" + "\n\n".join(chercher(question))},
    {"role": "user", "content": question},
])
`,
      [
        'Mistral fournit ses propres embeddings : `client.embeddings.create(model=..., inputs=[...])`, chaque vecteur dans `data[i].embedding`.',
        'On normalise les vecteurs : le produit scalaire devient alors la similarité cosinus.',
        'On encode le poly une fois ; à chaque question, on ne garde que les k passages les plus proches.',
      ],
    ),
  ),

  'l5:cache': hood(
    'Le cache de prompt',
    claude(
      py`
reponse = client.messages.create(
    model=MODELE, max_tokens=16000,
    system=[
        {"type": "text", "text": CONSIGNES},
        {"type": "text", "text": POLY_300_PAGES,
         "cache_control": {"type": "ephemeral"}},     # point de cache
    ],
    messages=[{"role": "user", "content": question}],  # le variable, à la fin
)
u = reponse.usage
print(u.cache_creation_input_tokens)  # 1er appel : écrit en cache (un peu plus cher)
print(u.cache_read_input_tokens)      # appels suivants : relu (environ 10 % du prix)
print(u.input_tokens)                 # le reste, au prix normal
`,
      [
        'Le cache porte sur le début du prompt, dans l’ordre `tools`, `system`, puis `messages` : tout ce qui précède le point `cache_control` est réutilisé s’il n’a pas changé d’un octet.',
        'Une date ou un identifiant placé au début, et `cache_read_input_tokens` reste à zéro : le cache ne sert jamais.',
        'Variante plus simple : passer `cache_control={"type": "ephemeral"}` directement à `messages.create`.',
      ],
    ),
    mistral(
      py`
# Même règle d’or que chez Claude : le stable d’abord, le variable à la fin.
messages = [
    {"role": "system", "content": CONSIGNES + "\n\n" + POLY_300_PAGES},  # stable
    {"role": "user", "content": question},                              # variable
]
reponse = client.chat.complete(model=MODELE, messages=messages)
print(reponse.usage.prompt_tokens)   # entrée facturée (pas de détail du cache)
`,
      [
        'Pas de point de cache à poser à la main chez Mistral : il n’y a pas d’équivalent de `cache_control`, et `usage` ne détaille pas de tokens lus en cache.',
        'La bonne pratique reste la même : un début de prompt stable, la partie variable à la fin.',
        'Le SDK récent mentionne un paramètre `prompt_cache_key` : vérifie dans la documentation de Mistral ce qu’il apporte avant de t’en servir.',
      ],
    ),
  ),

  'l6:budget': hood(
    'Remplir le contexte sous budget',
    commun(
      'Python · harnais',
      py`
BUDGET = 8000
pieces = [  # (priorité, texte) : le plus important d’abord
    (1, CONSIGNES), (1, ENONCE), (1, REPONSE_INES),
    (2, CHAPITRE_UTILE), (3, RESUME_SESSION), (4, NOTES_KARIM),
]

contexte, utilises = [], 0
for _, texte in sorted(pieces, key=lambda p: p[0]):
    n = compter_tokens(texte)          # voir ci-dessous
    if utilises + n <= BUDGET:
        contexte.append(texte)         # ça tient : on garde
        utilises += n

# compter_tokens :
#  - Claude : client.messages.count_tokens(...).input_tokens
#  - Mistral : le tokenizer public de la bibliothèque mistral-common
`,
      [
        'Le context engineering, c’est souvent du code tout simple : trier par importance, et ajouter tant que le budget le permet.',
        'Compter avant d’envoyer évite les mauvaises surprises : fenêtre dépassée, coût, lenteur.',
        'Ce tri fait partie du harnais : il ne dépend pas du fournisseur, seul le comptage des tokens change.',
      ],
    ),
  ),

  'l6:skills': hood(
    'Des skills chargées à la demande',
    commun(
      'Markdown + Python',
      py`
# competences/fiche-revision/SKILL.md :
# ---
# name: fiche-revision
# description: Crée une fiche de révision d’une page à partir d’un cours.
# ---
# (instructions complètes, modèle de fiche, exemples…)

import pathlib, yaml

def index_competences(dossier: str = "competences") -> str:
    lignes = []
    for f in sorted(pathlib.Path(dossier).glob("*/SKILL.md")):
        entete = yaml.safe_load(f.read_text().split("---")[1])
        lignes.append(f"- {entete['name']} : {entete['description']}")
    return "\n".join(lignes)          # une ligne par skill, rien de plus

SYSTEM = ("Compétences disponibles (lis le SKILL.md complet si besoin) :\n"
          + index_competences())
`,
      [
        'Une skill est un dossier avec un `SKILL.md` : un en-tête YAML (`name`, `description`), puis les instructions complètes.',
        'Seules les descriptions entrent dans le contexte ; le modèle lit le fichier complet, avec un outil de lecture, quand la tâche le demande.',
        'Cette approche marche avec tous les modèles. Claude propose aussi des skills intégrées à son API, et le chargement d’outils à la demande (`defer_loading`).',
      ],
    ),
  ),

  'l6:rot': hood(
    'Garder un contexte propre',
    claude(
      py`
# Côté API : effacer automatiquement les vieux résultats d’outils (bêta)
reponse = client.beta.messages.create(
    model=MODELE, max_tokens=16000,
    betas=["context-management-2025-06-27"],
    context_management={"edits": [{"type": "clear_tool_uses_20250919"}]},
    tools=OUTILS, messages=messages,
)

# Côté harnais : ne jamais écrire en mémoire sans connaître la source
def ecrire_memoire(fait: str, source: str) -> str:
    if source not in SOURCES_FIABLES:
        return "Refusé : source non vérifiée, demande confirmation à Inès."
    memoire.ajouter(fait, source=source)       # on garde la provenance
    return "Noté."
`,
      [
        'L’édition de contexte retire les anciens résultats d’outils : le contexte reste court, sans tout résumer.',
        'Contre l’empoisonnement : chaque fait garde sa source, et rien d’une source non fiable n’entre en mémoire sans accord.',
        'Contre « perdu au milieu » : les consignes clés au début (`system`) ou à la fin, jamais noyées au milieu.',
      ],
    ),
    mistral(
      py`
# Pas d’édition automatique : le harnais allège lui-même l’historique.
def alleger(messages: list[dict], garder: int = 3) -> list[dict]:
    outils = [i for i, m in enumerate(messages) if m["role"] == "tool"]
    for i in outils[:-garder]:                  # sauf les derniers résultats
        messages[i] = {**messages[i], "content": "[résultat effacé]"}
    return messages

# Côté harnais : ne jamais écrire en mémoire sans connaître la source
def ecrire_memoire(fait: str, source: str) -> str:
    if source not in SOURCES_FIABLES:
        return "Refusé : source non vérifiée, demande confirmation à Inès."
    memoire.ajouter(fait, source=source)       # on garde la provenance
    return "Noté."
`,
      [
        'Mistral n’a pas d’édition de contexte côté serveur : on remplace soi-même les vieux résultats d’outils par un court marqueur.',
        'Contre l’empoisonnement : chaque fait garde sa source, et rien d’une source non fiable n’entre en mémoire sans accord.',
        'Contre « perdu au milieu » : les consignes clés au début (message `system`) ou à la fin, jamais noyées au milieu.',
      ],
    ),
  ),
};
