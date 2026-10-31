/**
 * « L'atelier des appels » (niveau 2) : un mini validateur de schéma d'outil.
 * Il distingue deux niveaux d'erreur :
 * - la validation du harnais (le schéma : types, formats, champs obligatoires) ;
 * - l'intention de l'utilisatrice (un appel valide peut quand même viser la mauvaise date !).
 */

export interface FieldSpec {
  name: string;
  label: string;
  type: 'string' | 'integer' | 'enum';
  required: boolean;
  /** Format imposé, avec le message d'erreur que le harnais renverrait. */
  pattern?: { regex: RegExp; message: string };
  min?: number;
  max?: number;
  options?: string[];
  placeholder?: string;
}

export interface ToolSpec {
  name: string;
  description: string;
  fields: FieldSpec[];
}

export interface CallTask {
  id: string;
  request: string;
  tool: ToolSpec;
  /** Valeurs attendues par Inès (vérifiées après le schéma). */
  expected: Record<string, string>;
}

export const CONTACTS = ['Léa Martin', 'Karim Benali', 'Prof. Diallo'];

export const TOOL_CREER_EVENEMENT: ToolSpec = {
  name: 'creer_evenement',
  description: 'Ajoute un événement à l’agenda d’Inès (examens, rendus, rendez-vous).',
  fields: [
    {
      name: 'date',
      label: 'date',
      type: 'string',
      required: true,
      pattern: { regex: /^\d{4}-\d{2}-\d{2}$/, message: 'format attendu AAAA-MM-JJ' },
      placeholder: 'AAAA-MM-JJ',
    },
    { name: 'titre', label: 'titre', type: 'string', required: true, placeholder: 'Intitulé de l’événement' },
    {
      name: 'heure',
      label: 'heure (facultative)',
      type: 'string',
      required: false,
      pattern: { regex: /^([01]\d|2[0-3]):[0-5]\d$/, message: 'format attendu HH:MM (ex. 09:00)' },
      placeholder: 'HH:MM',
    },
  ],
};

export const TOOL_ENVOYER_MESSAGE: ToolSpec = {
  name: 'envoyer_message',
  description: 'Envoie un message privé à un contact d’Inès.',
  fields: [
    { name: 'destinataire', label: 'destinataire', type: 'enum', required: true, options: CONTACTS },
    { name: 'texte', label: 'texte', type: 'string', required: true, placeholder: 'Contenu du message' },
  ],
};

export const TOOL_CHERCHER_COURS: ToolSpec = {
  name: 'chercher_cours',
  description: 'Cherche un passage dans les supports de cours d’Inès.',
  fields: [
    { name: 'requete', label: 'requete', type: 'string', required: true, placeholder: 'Ce qu’on cherche' },
    { name: 'max_resultats', label: 'max_resultats (facultatif, de 1 à 10)', type: 'integer', required: false, min: 1, max: 10, placeholder: '3' },
  ],
};

export const CALL_TASKS: CallTask[] = [
  {
    id: 'agenda',
    request: 'Ajoute le partiel de réseaux le 12 janvier 2027 à 9 h.',
    tool: TOOL_CREER_EVENEMENT,
    expected: { date: '2027-01-12', heure: '09:00' },
  },
  {
    id: 'message',
    request: 'Écris à Léa : « Le résumé du cours est sur le Drive. »',
    tool: TOOL_ENVOYER_MESSAGE,
    expected: { destinataire: 'Léa Martin' },
  },
  {
    id: 'recherche',
    request: 'Trouve-moi les 2 meilleurs passages du cours sur le protocole TCP.',
    tool: TOOL_CHERCHER_COURS,
    expected: { max_resultats: '2' },
  },
];

/** Erreurs de schéma, telles qu'un harnais les renverrait au modèle. */
export function validateArgs(tool: ToolSpec, args: Record<string, string>): string[] {
  const errors: string[] = [];
  for (const field of tool.fields) {
    const raw = (args[field.name] ?? '').trim();
    if (!raw) {
      if (field.required) errors.push(`${field.name} : paramètre obligatoire manquant`);
      continue;
    }
    if (field.type === 'integer') {
      if (!/^-?\d+$/.test(raw)) {
        errors.push(`${field.name} : un nombre entier est attendu`);
        continue;
      }
      const n = Number(raw);
      if ((field.min !== undefined && n < field.min) || (field.max !== undefined && n > field.max)) {
        errors.push(`${field.name} : valeur entre ${field.min} et ${field.max} attendue`);
      }
    }
    if (field.type === 'enum' && field.options && !field.options.includes(raw)) {
      errors.push(`${field.name} : valeur hors liste (${field.options.join(', ')})`);
    }
    if (field.pattern && !field.pattern.regex.test(raw)) {
      errors.push(`${field.name} : ${field.pattern.message}`);
    }
  }
  return errors;
}

/** Écarts avec ce que demandait Inès (un appel peut être valide et pourtant faux). */
export function intentErrors(task: CallTask, args: Record<string, string>): string[] {
  const errors: string[] = [];
  for (const [name, value] of Object.entries(task.expected)) {
    if ((args[name] ?? '').trim() !== value) errors.push(`${name} : ce n’est pas ce qu’Inès a demandé`);
  }
  return errors;
}

/** Aperçu JSON de l'appel, comme le modèle l'écrirait. */
export function callPreview(tool: ToolSpec, args: Record<string, string>): string {
  const payload: Record<string, string | number> = {};
  for (const field of tool.fields) {
    const raw = (args[field.name] ?? '').trim();
    if (!raw) continue;
    payload[field.name] = field.type === 'integer' && /^-?\d+$/.test(raw) ? Number(raw) : raw;
  }
  return `${tool.name}(${JSON.stringify(payload)})`;
}
