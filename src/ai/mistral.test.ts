import { beforeEach, describe, expect, it } from 'vitest';
import { getProvider } from './client';
import { EMPTY_AI_CONFIG, isAiConfigured, loadAiConfig, saveAiConfig, type AIConfig } from './config';
import { JUDGE_SCHEMA } from './finalBoss';
import { createMistralProvider, listMistralModels, mistralErrorMessage, mistralText, selectChatModels } from './mistral';
import { MISTRAL_DEV_RELAY, resolveMistralBaseUrl } from './mistralUrl';
import { AIError } from './types';

const CONFIG: AIConfig = {
  ...EMPTY_AI_CONFIG,
  provider: 'mistral',
  apiKey: 'cle-de-test',
  model: 'modele-test',
  modelLabel: 'Modèle de test',
  structured: true,
};

interface Call {
  url: string;
  init: RequestInit;
  body: Record<string, unknown> | undefined;
}

function fakeFetch(status: number, payload: unknown) {
  const calls: Call[] = [];
  const impl = async (url: string, init: RequestInit = {}) => {
    calls.push({ url, init, body: init.body ? (JSON.parse(String(init.body)) as Record<string, unknown>) : undefined });
    return new Response(typeof payload === 'string' ? payload : JSON.stringify(payload), { status });
  };
  return { impl, calls };
}

const reply = (content: unknown, finish_reason = 'stop') => ({
  id: 'x',
  object: 'chat.completion',
  choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason }],
});

describe('Adresse de l’API Mistral', () => {
  it('utilise le relais local en développement, sinon l’adresse fournie', () => {
    expect(resolveMistralBaseUrl('')).toBe(MISTRAL_DEV_RELAY);
    expect(resolveMistralBaseUrl('https://relais.example/mistral/')).toBe('https://relais.example/mistral');
  });
});

describe('Fournisseur Mistral', () => {
  it('envoie une requête de conversation conforme et lit le texte', async () => {
    const { impl, calls } = fakeFetch(200, reply('Bonjour !'));
    const provider = createMistralProvider({ ...CONFIG, baseUrl: 'https://api.example' }, impl);
    const text = await provider.complete({
      system: 'Tu es Bob.',
      messages: [{ role: 'user', content: 'Salut' }],
      maxTokens: 500,
      effort: 'low',
    });
    expect(text).toBe('Bonjour !');
    expect(provider.name).toBe('Mistral AI');
    const [call] = calls;
    expect(call?.url).toBe('https://api.example/v1/chat/completions');
    expect(call?.init.method).toBe('POST');
    expect((call?.init.headers as Record<string, string>).Authorization).toBe('Bearer cle-de-test');
    expect(call?.body).toEqual({
      model: 'modele-test',
      messages: [
        { role: 'system', content: 'Tu es Bob.' },
        { role: 'user', content: 'Salut' },
      ],
      max_tokens: 500,
    });
  });

  it('ignore la réflexion des modèles de raisonnement et ne garde que le texte', async () => {
    const content = [
      { type: 'thinking', thinking: [{ type: 'text', text: 'Je réfléchis…' }] },
      { type: 'text', text: 'Réponse finale.' },
    ];
    const { impl } = fakeFetch(200, reply(content));
    const text = await createMistralProvider(CONFIG, impl).complete({ system: 's', messages: [{ role: 'user', content: 'q' }] });
    expect(text).toBe('Réponse finale.');
    expect(mistralText(null)).toBe('');
  });

  it('demande une sortie JSON contrainte par le schéma quand le modèle le permet', async () => {
    const { impl, calls } = fakeFetch(200, reply('{"commentaire":"ok","points_forts":[],"a_ameliorer":[],"question_bonus":"?"}'));
    const json = await createMistralProvider(CONFIG, impl).completeJson({
      system: 'Tu es juge.',
      messages: [{ role: 'user', content: 'Évalue.' }],
      schema: JUDGE_SCHEMA,
    });
    expect(json).toMatchObject({ commentaire: 'ok' });
    const format = calls[0]?.body?.response_format as Record<string, unknown>;
    expect(format.type).toBe('json_schema');
    expect(format.json_schema).toMatchObject({ name: 'reponse', schema: JUDGE_SCHEMA, strict: true });
    expect(String((calls[0]?.body?.messages as { content: string }[])[0]?.content)).toContain('schéma');
  });

  it('se contente du mode JSON simple sinon', async () => {
    const { impl, calls } = fakeFetch(200, reply('Voici : {"a": 1}'));
    const json = await createMistralProvider({ ...CONFIG, structured: false }, impl).completeJson({
      system: 's',
      messages: [{ role: 'user', content: 'q' }],
      schema: { type: 'object' },
    });
    expect(json).toEqual({ a: 1 });
    expect(calls[0]?.body?.response_format).toEqual({ type: 'json_object' });
  });

  it('traduit les erreurs HTTP en erreurs lisibles', async () => {
    const cases: [number, unknown, AIError['kind']][] = [
      [401, { message: 'Unauthorized' }, 'auth'],
      [429, { message: 'Requests rate limit exceeded' }, 'rate'],
      [422, { detail: [{ msg: 'Field required' }] }, 'bad-request'],
      [500, 'Internal Server Error', 'unknown'],
      [502, '', 'network'],
    ];
    for (const [status, payload, kind] of cases) {
      const { impl } = fakeFetch(status, payload);
      await expect(createMistralProvider(CONFIG, impl).complete({ system: 's', messages: [] })).rejects.toMatchObject({ kind });
    }
    expect(mistralErrorMessage({ message: { detail: [{ msg: 'a' }, { msg: 'b' }] } }, 'x')).toBe('a ; b');
  });

  it('signale un appel bloqué (réseau ou CORS) avec une piste de solution', async () => {
    const blocked = async () => {
      throw new TypeError('Failed to fetch');
    };
    await expect(createMistralProvider(CONFIG, blocked).complete({ system: 's', messages: [] })).rejects.toMatchObject({
      kind: 'network',
      message: expect.stringContaining('CORS'),
    });
  });

  it('considère une fin de génération en erreur comme un échec', async () => {
    const { impl } = fakeFetch(200, reply('', 'error'));
    await expect(createMistralProvider(CONFIG, impl).complete({ system: 's', messages: [] })).rejects.toBeInstanceOf(AIError);
  });
});

describe('Liste des modèles Mistral', () => {
  const payload = {
    object: 'list',
    data: [
      { id: 'grand-2411', name: 'Grand', aliases: ['grand-latest'], capabilities: { completion_chat: true } },
      { id: 'grand-latest', name: 'Grand', aliases: ['grand-2411'], capabilities: { completion_chat: true } },
      { id: 'petit-latest', name: '', aliases: [], capabilities: { completion_chat: true } },
      { id: 'plongement', aliases: [], capabilities: { completion_chat: false } },
      { id: 'ancien', aliases: [], capabilities: { completion_chat: true }, deprecation: '2025-01-01T00:00:00Z' },
    ],
  };

  it('ne garde que les modèles de conversation, sans doublons ni modèles dépréciés', () => {
    expect(selectChatModels(payload)).toEqual([
      { id: 'grand-latest', label: 'Grand', structured: true, effort: false },
      { id: 'petit-latest', label: 'petit-latest', structured: true, effort: false },
    ]);
    expect(selectChatModels(null)).toEqual([]);
  });

  it('appelle GET /v1/models avec la clé', async () => {
    const { impl, calls } = fakeFetch(200, payload);
    const models = await listMistralModels('cle', 'https://api.example', impl);
    expect(models).toHaveLength(2);
    expect(calls[0]?.url).toBe('https://api.example/v1/models');
    expect(calls[0]?.init.method).toBe('GET');
  });
});

describe('Configuration', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('mémorise le fournisseur Mistral et l’adresse du relais', () => {
    saveAiConfig({ ...CONFIG, baseUrl: 'https://relais.example', remember: true });
    const loaded = loadAiConfig();
    expect(loaded.provider).toBe('mistral');
    expect(loaded.baseUrl).toBe('https://relais.example');
    expect(isAiConfigured(loaded)).toBe(true);
  });

  it('charge le module Mistral à la demande', async () => {
    const provider = await getProvider(CONFIG);
    expect(provider?.name).toBe('Mistral AI');
    expect(provider?.modelLabel).toBe('Modèle de test');
  });
});
