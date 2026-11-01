import type { UnderTheHood } from '../types';
import { claude, commun, hood, mistral, py } from './kit';

/** Niveau 7 : harness engineering. */
export const HOOD_FORGE: Record<string, UnderTheHood> = {
  'l7:loop-control': hood(
    'Arrêts, compaction et boucles',
    claude(
      py`
MAX_TOURS, BUDGET_EUROS = 100, 5.0
cout, derniers = 0.0, []

for tour in range(MAX_TOURS):                    # arrêt : nombre de tours
    reponse = client.beta.messages.create(
        model=MODELE, max_tokens=16000, tools=OUTILS, messages=messages,
        betas=["compact-2026-01-12"],             # compaction côté serveur (bêta)
        context_management={"edits": [{"type": "compact_20260112"}]},
    )
    messages.append({"role": "assistant", "content": reponse.content})
    cout += estimer_cout(reponse.usage)
    if reponse.stop_reason != "tool_use" or cout > BUDGET_EUROS:
        break                                    # arrêt : fin ou budget épuisé
    resultats = executer_tous(reponse.content)   # une liste de tool_result
    appels = [(b.name, str(b.input)) for b in reponse.content if b.type == "tool_use"]
    derniers = (derniers + appels)[-3:]
    if len(derniers) == 3 and len(set(derniers)) == 1:     # détection de boucle
        resultats.append({"type": "text",
                          "text": "Trois fois le même appel : change d’approche."})
    messages.append({"role": "user", "content": resultats})
`,
      [
        'Trois arrêts : un nombre de tours maximum, un budget, et la fin normale (`stop_reason` différent de `"tool_use"`).',
        'La compaction côté serveur (bêta) résume l’historique quand il grossit ; on renvoie `reponse.content` en entier, car il contient le bloc de compaction.',
        'La détection de boucle est du code ordinaire : trois appels identiques, et le harnais glisse une consigne après les résultats.',
      ],
    ),
    mistral(
      py`
MAX_TOURS, SEUIL_TOKENS = 100, 100_000

def compacter(messages: list) -> list:
    """Remplace l’historique par un résumé écrit par le modèle lui-même."""
    resume = client.chat.complete(model=MODELE, messages=messages + [{
        "role": "user",
        "content": "Résume : objectif, décisions, fichiers modifiés, dernière erreur."}])
    return [{"role": "user", "content": "Reprends ce travail. Résumé :\n"
             + resume.choices[0].message.content}]

derniers = []
for tour in range(MAX_TOURS):                    # arrêt : nombre de tours
    reponse = client.chat.complete(model=MODELE, tools=OUTILS, messages=messages)
    choix = reponse.choices[0]
    messages.append(choix.message)
    if choix.finish_reason != "tool_calls":
        break                                    # arrêt : réponse finale
    messages += executer_tous(choix.message.tool_calls)   # messages « tool »
    derniers = (derniers + [str(a.function) for a in choix.message.tool_calls])[-3:]
    if len(derniers) == 3 and len(set(derniers)) == 1:     # détection de boucle
        messages.append({"role": "user",
                         "content": "Trois fois le même appel : change d’approche."})
    if reponse.usage.prompt_tokens > SEUIL_TOKENS:
        messages = compacter(messages)           # compaction par le harnais
`,
      [
        'Mêmes arrêts que chez Claude : un nombre de tours maximum, et la fin normale (`finish_reason` différent de `"tool_calls"`).',
        'Pas de compaction côté serveur : le harnais demande lui-même un résumé au modèle quand `usage.prompt_tokens` dépasse un seuil.',
        'Le résumé garde l’essentiel : objectif, décisions, fichiers modifiés, dernière erreur.',
      ],
    ),
  ),

  'l7:guardrails': hood(
    'Permissions, hooks et sandbox',
    commun(
      'Python · harnais',
      py`
AUTORISE = {"lire_fichier", "lancer_tests"}
SUR_DEMANDE = {"git_push", "installer_paquet"}
MOTIFS_INTERDITS = ["rm -rf", "~/.ssh"]

def avant_outil(nom: str, args: dict) -> str | None:        # hook « avant »
    if any(m in str(args) for m in MOTIFS_INTERDITS):
        return "Refusé : commande interdite."
    if nom in SUR_DEMANDE and input(f"Autoriser {nom} {args} ? [o/N] ") != "o":
        return "Refusé par Karim."
    if nom not in AUTORISE | SUR_DEMANDE:
        return f"Refusé : {nom} n’est pas autorisé."
    return None                                             # feu vert

def apres_outil(nom: str, args: dict) -> None:              # hook « après »
    if nom == "ecrire_fichier":
        subprocess.run(["ruff", "format", args["chemin"]])  # formateur, à coup sûr

# Sandbox : chaque commande tourne dans un conteneur jetable, sans réseau :
#   docker run --rm --network none -v "$PWD":/projet -w /projet image pytest
`,
      [
        'Les permissions sont une fonction appelée avant chaque outil : autorisé, sur demande (confirmation humaine) ou refusé.',
        'Les hooks sont du code déclenché à des moments précis : ils s’exécutent à chaque fois, sans dépendre de la mémoire du modèle.',
        'La sandbox isole l’exécution : ici un conteneur Docker jetable, sans réseau, qui ne voit que le dossier du projet.',
        'Rien ici ne dépend du fournisseur : c’est le même harnais avec Claude ou Mistral.',
      ],
    ),
  ),

  'l7:verify': hood(
    'Vérifier avant d’accepter',
    commun(
      'Python · harnais',
      py`
def verifier() -> tuple[bool, str]:
    r = subprocess.run(["pytest", "-q"], capture_output=True, text=True)
    return r.returncode == 0, r.stdout[-2000:]   # la fin du rapport suffit

for essai in range(5):                          # boucle bornée, elle aussi
    boucle_agent(messages)                      # tourne jusqu’à « c’est corrigé »
    ok, rapport = verifier()                    # le harnais vérifie, pas le modèle
    if ok:
        break                                   # succès prouvé : on accepte
    messages.append({"role": "user", "content":
        f"Les tests échouent encore :\n{rapport}\nCorrige avant de conclure."})
`,
      [
        'La vérification est extérieure au modèle : ici `pytest`, dont le code de retour ne ment pas.',
        'En cas d’échec, le rapport des tests revient dans le contexte : le modèle corrige avec des faits, pas avec une impression.',
        'Cette boucle est bornée elle aussi (5 essais) : on ne remplace pas une boucle sans fin par une autre.',
      ],
    ),
  ),
};
