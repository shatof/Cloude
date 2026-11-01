import type { HoodVariant, RichText, UnderTheHood } from '../types';

/**
 * Petits constructeurs pour écrire les extraits « Sous le capot ».
 *
 * `py` est un gabarit brut (comme String.raw) : les antislashs du code Python
 * (`\n`, expressions régulières…) restent tels quels. Ne jamais y mettre d'accent
 * grave (il fermerait le gabarit) ni la séquence dollar-accolade.
 */
export function py(strings: TemplateStringsArray, ...values: unknown[]): string {
  return String.raw({ raw: strings }, ...values)
    .replace(/^\n/, '')
    .replace(/\s+$/, '');
}

export const LABEL_CLAUDE = 'Python · SDK Anthropic';
export const LABEL_MISTRAL = 'Python · SDK Mistral';

export function claude(code: string, notes: RichText[]): HoodVariant {
  return { provider: 'claude', label: LABEL_CLAUDE, code, notes };
}

export function mistral(code: string, notes: RichText[]): HoodVariant {
  return { provider: 'mistral', label: LABEL_MISTRAL, code, notes };
}

export function commun(label: string, code: string, notes: RichText[]): HoodVariant {
  return { provider: 'commun', label, code, notes };
}

export function hood(title: string, ...variants: HoodVariant[]): UnderTheHood {
  return { title, variants };
}
