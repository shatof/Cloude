import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';
import { BOSS_SPRITES } from '../sprites/bosses';
import { BOB_BASE, BOB_BLINK, BOB_FACES, BOB_SIZE, PIECE_LAYERS } from '../sprites/bob';
import { ICONS, pieceIcon } from '../sprites/icons';
import { LANDMARKS } from '../sprites/landmarks';
import { PALETTE, type Sprite } from '../sprites/pixel';
import { HARNESS_PIECES } from '../game/harness';
import { createInitialSave, gameReducer, type SaveData } from '../game/state';
import { SAVE_KEY } from '../game/storage';
import { frenchTypo } from './typography';

function checkSprite(name: string, sprite: Sprite) {
  expect(sprite.rows, name).toHaveLength(sprite.h);
  for (const row of sprite.rows) {
    expect(row.length, name).toBe(sprite.w);
    for (const ch of row) expect(ch === '.' || ch in PALETTE, `${name} : « ${ch} »`).toBe(true);
  }
}

describe('Sprites', () => {
  it('ont des lignes de largeur égale et des couleurs de la palette', () => {
    checkSprite('bob', BOB_BASE);
    checkSprite('clignement', BOB_BLINK);
    for (const [k, s] of Object.entries(BOB_FACES)) checkSprite(`visage ${k}`, s);
    for (const [k, l] of Object.entries(PIECE_LAYERS)) {
      if (l.back) checkSprite(`${k} arrière`, l.back);
      if (l.front) checkSprite(`${k} avant`, l.front);
      if (l.icon) checkSprite(`${k} icône`, l.icon);
    }
    for (const [k, s] of Object.entries({ ...ICONS, ...BOSS_SPRITES, ...LANDMARKS })) checkSprite(k, s);
  });

  it('chaque pièce de harnais a un calque de la taille de Bob et une icône', () => {
    for (const piece of HARNESS_PIECES) {
      const layers = PIECE_LAYERS[piece.id];
      expect(layers, piece.id).toBeDefined();
      const sprite = layers?.front ?? layers?.back;
      expect(sprite?.w).toBe(BOB_SIZE);
      expect(pieceIcon(piece.id), piece.id).toBeDefined();
    }
  });
});

describe('Typographie française', () => {
  it('ajoute les espaces insécables et les apostrophes typographiques', () => {
    expect(frenchTypo("C'est quoi ?")).toBe('C’est quoi ?');
    expect(frenchTypo('« bonjour »')).toBe('« bonjour »');
    expect(frenchTypo('Note : 200 000 tokens')).toBe('Note : 200 000 tokens');
  });
});

function seed(save: SaveData) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

describe('Application', () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.hash = '';
  });

  it('affiche l’atelier, Bob et l’introduction au premier lancement', async () => {
    seed({ ...createInitialSave(), settings: { ...createInitialSave().settings, textSpeed: 'instant' } });
    render(<App />);
    expect(screen.getByRole('heading', { name: /atelier de Bob/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Bob Morris' })).toBeInTheDocument();
    expect(screen.getAllByText(/Moi, c’est Bob Morris/).length).toBeGreaterThan(0);
    expect(screen.getByRole('img', { name: '0 pièces sur 14' })).toBeInTheDocument();
  });

  it('montre la carte avec les 14 niveaux et les niveaux à venir', async () => {
    window.location.hash = '#/carte';
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Carte des niveaux' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Niveau / })).toHaveLength(14);
    expect(screen.getByRole('button', { name: /Niveau 2 : Les outils.*Contenu à venir/ })).toBeInTheDocument();
  });

  it('un niveau à venir affiche son titre et son concept', async () => {
    window.location.hash = '#/niveau/l7';
    render(<App />);
    expect(await screen.findByRole('heading', { name: 'Harness engineering' })).toBeInTheDocument();
    expect(screen.getByText(/Atelier de montage/)).toBeInTheDocument();
  });

  it('déroule la scène du problème puis débloque le concept', async () => {
    const user = userEvent.setup();
    seed({ ...createInitialSave(), settings: { ...createInitialSave().settings, textSpeed: 'instant' } });
    window.location.hash = '#/niveau/l0';
    render(<App />);
    expect(await screen.findByText(/Mission/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Tout afficher' }));
    expect(screen.getAllByText(/Échec n°/)).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: /Découvrir le concept/ }));
    expect(await screen.findByRole('heading', { name: /Bob lit des tokens/ })).toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) ?? '{}') as SaveData;
    expect(saved.levels.l0?.reached).toBeGreaterThanOrEqual(1);
  });

  it('le tuteur répond hors-ligne depuis la barre du haut', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Tuteur/ }));
    const input = await screen.findByLabelText('Ta question');
    await user.type(input, 'pourquoi ton cerveau ne change jamais ?');
    await user.click(screen.getByRole('button', { name: 'Envoyer' }));
    expect(await screen.findByText(/on lui construit un meilleur harnais/)).toBeInTheDocument();
  });

  it('les collections et révisions reflètent la progression', async () => {
    let save = createInitialSave();
    save = gameReducer(save, { type: 'settings/update', patch: { textSpeed: 'instant' } });
    save = { ...save, cards: ['token', 'next-token', 'context-window'] };
    seed(save);
    window.location.hash = '#/revision';
    render(<App />);
    expect(await screen.findByText(/9 flashcards générées/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Commencer' })).toBeEnabled();
  });
});
