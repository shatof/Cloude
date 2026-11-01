import { describe, expect, it } from 'vitest';
import { LEVELS } from '../levels';
import { HOOD, getHood } from '.';
import { LABEL_CLAUDE, LABEL_MISTRAL } from './kit';

const entries = Object.entries(HOOD);
const variants = entries.flatMap(([key, h]) => h.variants.map((v) => ({ key, ...v })));
const words = (s: string) => s.trim().split(/\s+/).length;

describe('Sous le capot', () => {
  it('chaque écran de concept de chaque niveau a son extrait', () => {
    for (const level of LEVELS) {
      for (const screen of level.content?.concept ?? []) {
        expect(getHood(level.id, screen.id), `${level.id}:${screen.id}`).toBeDefined();
      }
    }
  });

  it('chaque clé correspond à un écran existant', () => {
    const screens = new Set(LEVELS.flatMap((l) => (l.content?.concept ?? []).map((s) => `${l.id}:${s.id}`)));
    for (const [key] of entries) expect(screens.has(key), key).toBe(true);
  });

  it('une variante commune, ou exactement Claude et Mistral', () => {
    for (const [key, h] of entries) {
      const providers = h.variants.map((v) => v.provider).sort();
      expect([['commun'], ['claude', 'mistral']], key).toContainEqual(providers);
      expect(h.title.length, key).toBeGreaterThan(3);
      expect(h.title.length, key).toBeLessThanOrEqual(60);
    }
  });

  it('extraits courts et lisibles, notes concises', () => {
    for (const v of variants) {
      const lines = v.code.split('\n');
      expect(v.code.trim().length, v.key).toBeGreaterThan(0);
      expect(lines.length, v.key).toBeLessThanOrEqual(34);
      for (const line of lines) expect(line.length, `${v.key} : ${line}`).toBeLessThanOrEqual(92);
      expect(v.notes.length, v.key).toBeGreaterThanOrEqual(1);
      expect(v.notes.length, v.key).toBeLessThanOrEqual(4);
      for (const note of v.notes) expect(words(note), `${v.key} : ${note}`).toBeLessThanOrEqual(60);
    }
  });

  it('les étiquettes nomment le bon SDK', () => {
    for (const v of variants) {
      if (v.provider === 'claude') expect(v.label, v.key).toBe(LABEL_CLAUDE);
      if (v.provider === 'mistral') expect(v.label, v.key).toBe(LABEL_MISTRAL);
    }
  });

  it('Claude : pas de réglage refusé par les modèles récents, pas d’identifiant de modèle en dur', () => {
    for (const v of variants.filter((x) => x.provider === 'claude')) {
      expect(v.code, v.key).not.toMatch(/claude-[a-z]+-\d/);
      expect(v.code, v.key).not.toContain('budget_tokens');
      expect(v.code, v.key).not.toMatch(/\b(temperature|top_p|top_k)\s*=/);
      expect(v.code, v.key).not.toMatch(/"type":\s*"(any|tool)"/);
    }
  });

  it('Mistral : import et clés du SDK Python actuel', () => {
    for (const v of variants.filter((x) => x.provider === 'mistral')) {
      if (v.code.includes('import Mistral')) expect(v.code, v.key).toContain('from mistralai.client import Mistral');
      if (v.code.includes('json_schema')) {
        expect(v.code, v.key).toContain('schema_definition');
        expect(v.code, v.key).not.toMatch(/"schema":/);
      }
      expect(v.code, v.key).not.toContain('is_error');
      expect(v.code, v.key).not.toContain('stop_sequences');
    }
  });

  it('aucun extrait n’utilise un modèle fixe', () => {
    for (const v of variants) expect(v.code, v.key).not.toMatch(/model="[^"…]+"/);
  });
});
