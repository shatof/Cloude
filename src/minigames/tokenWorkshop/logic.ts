import { hashString } from '../../game/random';

/**
 * Logique de « L'atelier des tokens » (niveau 0).
 * Tokeniseur jouet : de gauche à droite, on prend toujours le plus long morceau connu.
 */

export const TOY_VOCAB = [
  'bonjour',
  'bon',
  'jour',
  'arr',
  'ière',
  'grand',
  'mère',
  '-',
  'anti',
  'constitution',
  'nelle',
  'ment',
  'tion',
  'con',
  'stit',
];

export const CUT_WORDS = ['bonjour', 'arrière-grand-mère', 'anticonstitutionnellement'];

/** Découpe gloutonne (plus long préfixe connu), avec repli sur un caractère. */
export function toyTokenize(word: string, vocab: readonly string[] = TOY_VOCAB): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < word.length) {
    let best = word[i] as string;
    for (const piece of vocab) {
      if (piece.length > best.length && word.startsWith(piece, i)) best = piece;
    }
    tokens.push(best);
    i += best.length;
  }
  return tokens;
}

/** Positions des coupures (indice du caractère qui suit chaque coupure). */
export function cutsOf(tokens: readonly string[]): number[] {
  const cuts: number[] = [];
  let pos = 0;
  tokens.slice(0, -1).forEach((t) => {
    pos += t.length;
    cuts.push(pos);
  });
  return cuts;
}

/** Score de découpe : 1 si exact, sinon indice de Jaccard entre coupures attendues et proposées. */
export function cutScore(expected: readonly number[], proposed: readonly number[]): number {
  const a = new Set(expected);
  const b = new Set(proposed);
  const union = new Set([...a, ...b]);
  if (union.size === 0) return 1;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  return inter / union.size;
}

/** Numéro de token fictif mais stable (un vrai tokeniseur a son propre dictionnaire). */
export function tokenId(token: string): number {
  return 100 + (hashString(token) % 49_900);
}

/* ------------------------------------------------------------------ */
/* Prédiction du token suivant                                         */
/* ------------------------------------------------------------------ */

export interface NextTokenRound {
  context: string;
  options: { token: string; p: number }[];
  note: string;
}

export const NEXT_TOKEN_ROUNDS: NextTokenRound[] = [
  {
    context: 'Le chat dort sur le',
    options: [
      { token: 'toit', p: 0.12 },
      { token: 'canapé', p: 0.41 },
      { token: 'frigo', p: 0.02 },
      { token: 'lit', p: 0.27 },
    ],
    note: 'Facile : « canapé » est la suite la plus fréquente dans les textes que le modèle a lus.',
  },
  {
    context: 'La capitale de l’Australie est',
    options: [
      { token: 'Sydney', p: 0.3 },
      { token: 'Melbourne', p: 0.06 },
      { token: 'Canberra', p: 0.62 },
      { token: 'Paris', p: 0.01 },
    ],
    note: 'Le plus probable est juste… mais « Sydney » garde 30 % de chances d’être tiré : plausible, pas vrai.',
  },
  {
    context: 'Aujourd’hui, nous sommes le',
    options: [
      { token: 'mardi', p: 0.15 },
      { token: '1er', p: 0.09 },
      { token: 'vendredi', p: 0.08 },
      { token: 'lundi', p: 0.16 },
    ],
    note: 'Aucune option ne domine : sans calendrier, le modèle ne peut que deviner. D’où le « mardi 12 mars » de Bob.',
  },
];

/** Points d'un choix : sa probabilité rapportée à celle du meilleur choix. */
export function pickScore(round: NextTokenRound, token: string): number {
  const best = Math.max(...round.options.map((o) => o.p));
  const chosen = round.options.find((o) => o.token === token)?.p ?? 0;
  return best > 0 ? chosen / best : 0;
}

/** Distribution après température (T → 0 : tout sur le plus probable). */
export function applyTemperature(probabilities: readonly number[], temperature: number): number[] {
  if (temperature <= 0.05) {
    const max = Math.max(...probabilities);
    const idx = probabilities.indexOf(max);
    return probabilities.map((_, i) => (i === idx ? 1 : 0));
  }
  const logits = probabilities.map((p) => Math.log(Math.max(p, 1e-9)) / temperature);
  const top = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - top));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

/** Tirage selon une distribution, avec un nombre aléatoire fourni (déterministe). */
export function sampleIndex(distribution: readonly number[], r: number): number {
  let acc = 0;
  for (let i = 0; i < distribution.length; i += 1) {
    acc += distribution[i] as number;
    if (r < acc) return i;
  }
  return distribution.length - 1;
}

/* ------------------------------------------------------------------ */
/* Fenêtre de contexte                                                 */
/* ------------------------------------------------------------------ */

export interface ChatMessage {
  who: string;
  text: string;
  tokens: number;
}

export const WINDOW_SIZE = 40;

export const WINDOW_MESSAGES: ChatMessage[] = [
  { who: 'Inès', text: 'Salut, je m’appelle Inès.', tokens: 8 },
  { who: 'Bob', text: 'Bonjour Inès !', tokens: 5 },
  { who: 'Inès', text: 'Je révise mon partiel de réseaux.', tokens: 9 },
  { who: 'Bob', text: 'Bon courage ! Que veux-tu revoir ?', tokens: 9 },
  { who: 'Inès', text: 'Le modèle OSI, couche par couche.', tokens: 10 },
  { who: 'Bob', text: 'Il y a 7 couches, de la physique à l’application.', tokens: 11 },
  { who: 'Inès', text: 'Au fait, tu te souviens de mon prénom ?', tokens: 9 },
];

/** Messages visibles : les plus récents qui tiennent dans la fenêtre (le début est coupé). */
export function visibleWindow(messages: readonly ChatMessage[], size: number = WINDOW_SIZE): { visible: number[]; used: number } {
  const visible: number[] = [];
  let used = 0;
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const cost = (messages[i] as ChatMessage).tokens;
    if (used + cost > size) break;
    used += cost;
    visible.unshift(i);
  }
  return { visible, used };
}
