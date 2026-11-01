import type { UnderTheHood } from '../types';
import { claude, commun, hood, mistral, py } from './kit';

/** Niveaux 8 et 9 : multi-agents, protocoles. */
export const HOOD_ARCHIPEL: Record<string, UnderTheHood> = {
  'l8:orchestrator': hood(
    'Des sous-agents en parallèle',
    claude(
      py`
import asyncio
import anthropic

client = anthropic.AsyncAnthropic()

async def sous_agent(brief: str) -> str:
    reponse = await client.messages.create(
        model=MODELE, max_tokens=16000,
        output_config={"effort": "low"},             # tâche ciblée : effort bas
        messages=[{"role": "user", "content": brief}],  # contexte tout neuf
    )
    return next(b.text for b in reponse.content if b.type == "text")

async def orchestrer(lots: list[str]) -> list[str]:
    briefs = [("Résume chacun de ces articles en 5 lignes : question, méthode, "
               f"résultat, limite. Rends seulement les résumés.\n{lot}") for lot in lots]
    return await asyncio.gather(*(sous_agent(b) for b in briefs))  # en parallèle

resumes = asyncio.run(orchestrer(lots_de_six(articles)))
`,
      [
        'Un sous-agent, c’est un appel (ou une boucle) avec sa propre liste `messages` : il ne voit que son brief.',
        '`asyncio.gather` lance les sous-agents en parallèle ; l’orchestrateur ne reçoit que les résumés, pas les 30 articles.',
        'Dans un vrai harnais, l’orchestrateur lance ses sous-agents via un outil, et chacun peut avoir ses propres outils.',
      ],
    ),
    mistral(
      py`
import asyncio

async def sous_agent(brief: str) -> str:
    reponse = await client.chat.complete_async(
        model=MODELE,
        messages=[{"role": "user", "content": brief}],  # contexte tout neuf
    )
    return reponse.choices[0].message.content

async def orchestrer(lots: list[str]) -> list[str]:
    briefs = [("Résume chacun de ces articles en 5 lignes : question, méthode, "
               f"résultat, limite. Rends seulement les résumés.\n{lot}") for lot in lots]
    return await asyncio.gather(*(sous_agent(b) for b in briefs))  # en parallèle

resumes = asyncio.run(orchestrer(lots_de_six(articles)))
`,
      [
        'Le SDK Mistral a une version asynchrone de chaque appel : `chat.complete_async`.',
        '`asyncio.gather` lance les sous-agents en parallèle ; l’orchestrateur ne reçoit que les résumés.',
        'Chaque sous-agent a sa propre liste `messages` : il ne voit que son brief.',
      ],
    ),
  ),

  'l8:when': hood(
    'Compter ce que coûte l’équipe',
    commun(
      'Python · harnais',
      py`
total = {"entree": 0, "sortie": 0}

def compter(entree: int, sortie: int) -> None:   # après chaque appel, partout
    total["entree"] += entree
    total["sortie"] += sortie

# Claude  : compter(r.usage.input_tokens, r.usage.output_tokens)
# Mistral : compter(r.usage.prompt_tokens, r.usage.completion_tokens)

# Bilan : un agent seul contre cinq sous-agents, sur les mêmes 30 articles
print(f"{total['entree']:,} tokens lus, {total['sortie']:,} écrits")
`,
      [
        'Chaque sous-agent consomme ses propres tokens : on mesure le total de la mission, pas seulement sa durée.',
        'Les champs changent d’un fournisseur à l’autre (`input_tokens` ou `prompt_tokens`), l’idée reste la même.',
        'Le multi-agents se justifie quand le gain (temps, qualité) vaut le surcoût : on compare sur une même tâche.',
      ],
    ),
  ),

  'l8:swarm': hood(
    'Les passages de relais',
    claude(
      py`
TRANSFERT = {
    "name": "transferer", "description": "Passe la main à un collègue spécialisé.",
    "input_schema": {"type": "object", "properties": {
        "vers": {"type": "string", "enum": ["facturation", "remboursements"]},
        "resume": {"type": "string"}}, "required": ["vers", "resume"]},
}

actif, relais = "accueil", 0
while relais < 4:                                # limite de relais
    agent = AGENTS[actif]                        # consignes et outils propres
    reponse = client.messages.create(model=MODELE, max_tokens=16000,
                                     system=agent["system"], tools=agent["outils"],
                                     messages=messages)
    transfert = next((b for b in reponse.content
                      if b.type == "tool_use" and b.name == "transferer"), None)
    if transfert is None:
        break                                    # l’agent actif a terminé
    actif, relais = transfert.input["vers"], relais + 1
    messages = [{"role": "user", "content": transfert.input["resume"]}]
`,
      [
        'Un passage de relais (handoff) est un outil comme un autre : quand l’agent l’appelle, le harnais change d’agent actif.',
        'Le nouvel agent repart d’un résumé, pas de tout l’historique : chacun garde un contexte léger.',
        'La limite de relais évite que les agents se renvoient le client sans fin. (Les autres outils suivent la boucle habituelle, omise ici.)',
      ],
    ),
    mistral(
      py`
accueil = client.beta.agents.create(
    model=MODELE, name="accueil",
    instructions="Tu orientes les clients vers le bon service.",
)
facturation = client.beta.agents.create(
    model=MODELE, name="facturation",
    description="Vérifie les paiements et les prélèvements.",
    instructions="Tu vérifies les paiements du client.",
)
# L’accueil a le droit de passer la main à la facturation
client.beta.agents.update(agent_id=accueil.id, handoffs=[facturation.id])

reponse = client.beta.conversations.start(
    agent_id=accueil.id,
    inputs="On m’a prélevé deux fois mon abonnement !",
    handoff_execution="server",        # les relais se font côté Mistral
)
print(reponse.conversation_id)         # pour continuer avec conversations.append
`,
      [
        'L’API Agents de Mistral (bêta) gère les relais nativement : on déclare quels agents peuvent passer la main, avec `handoffs`.',
        'Avec `handoff_execution="server"`, les passages de relais se font côté Mistral, sans boucle à écrire soi-même.',
        'Même avec un relais natif, on garde des règles claires de qui traite quoi (`description`, `instructions`).',
      ],
    ),
  ),

  'l9:mcp': hood(
    'Un serveur MCP',
    commun(
      'Python · SDK MCP officiel',
      py`
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("moodle")

@mcp.tool()
def lister_devoirs(cours: str) -> list[str]:
    """Liste les devoirs à rendre pour un cours."""
    return moodle.devoirs(cours)

@mcp.resource("moodle://cours/{cours}/syllabus")
def syllabus(cours: str) -> str:
    """Le syllabus d’un cours."""
    return moodle.syllabus(cours)

mcp.run()   # n’importe quel client MCP peut maintenant s’y brancher
`,
      [
        '`@mcp.tool()` publie un outil : son nom, sa docstring (la description) et le typage Python deviennent le schéma JSON.',
        '`@mcp.resource` publie une donnée à lire ; `@mcp.prompt()` publie un modèle de consigne.',
        'Ce serveur sert tous les clients MCP, quel que soit le modèle derrière. L’API de Claude peut même s’y brancher directement (paramètres `mcp_servers` et `mcp_toolset`, en bêta).',
      ],
    ),
  ),

  'l9:a2a': hood(
    'Une Agent Card et une tâche A2A',
    commun(
      'JSON annoté · A2A (simplifié)',
      py`
// 1. L’Agent Card, publiée par l’agent de la scolarité (simplifiée)
{
  "name": "Agent de la scolarité",
  "description": "Réservations de salles et attestations.",
  "url": "https://agents.univ-exemple.fr/scolarite",
  "version": "1.0.0",
  "capabilities": {"streaming": true},
  "skills": [{"id": "reserver-salle", "name": "Réserver une salle",
              "description": "Réserve une salle ou un amphi."}]
}

// 2. Bob lui confie une tâche : requête JSON-RPC « message/send »
{"jsonrpc": "2.0", "id": 1, "method": "message/send",
 "params": {"message": {"role": "user", "messageId": "m-1",
   "parts": [{"kind": "text", "text": "Réserve l’amphi B jeudi à 14 h."}]}}}

// 3. La réponse : une tâche, avec un état à suivre
{"jsonrpc": "2.0", "id": 1, "result": {"kind": "task", "id": "812",
  "status": {"state": "input-required"}}}
`,
      [
        'L’Agent Card est un JSON public : identité, compétences (`skills`), adresse, et en pratique les méthodes d’authentification exigées.',
        'A2A passe par JSON-RPC sur HTTP : on envoie un message (`message/send`), on reçoit une tâche avec un état (`working`, `input-required`, `completed`…).',
        'Bob ne voit ni les outils ni la mémoire de l’agent de la scolarité, seulement la tâche et ses mises à jour, quel que soit le modèle de chacun.',
      ],
    ),
  ),

  'l9:security': hood(
    'Épingler les outils d’un serveur',
    commun(
      'Python · harnais',
      py`
import hashlib, json

def empreinte(outils: list[dict]) -> str:
    texte = json.dumps(outils, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(texte.encode()).hexdigest()

outils = serveur_mcp.lister_outils()
if empreinte(outils) != EMPREINTE_APPROUVEE:      # relue et validée une fois
    raise RuntimeError("Les outils du serveur ont changé : relecture requise.")

# Droits minimaux : le serveur météo n’a ni fichiers ni réseau, sauf son API
lancer_serveur("meteo", acces_fichiers=False, reseau=["api.meteo.example"])
`,
      [
        'Une description d’outil entre dans le contexte du modèle : on la relit avant d’approuver le serveur, puis on « épingle » son empreinte.',
        'Si le serveur modifie ses outils après coup, l’empreinte change et le harnais bloque jusqu’à une nouvelle relecture.',
        'Chaque serveur ne reçoit que les accès dont il a besoin : même trompé, il ne peut pas lire `~/.ssh`.',
      ],
    ),
  ),
};
