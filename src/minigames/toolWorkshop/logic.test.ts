import { describe, expect, it } from 'vitest';
import { CALL_TASKS, TOOL_CHERCHER_COURS, TOOL_CREER_EVENEMENT, TOOL_ENVOYER_MESSAGE, callPreview, intentErrors, validateArgs } from './logic';

describe('Validateur d’appels d’outils', () => {
  it('accepte un appel conforme au schéma', () => {
    expect(validateArgs(TOOL_CREER_EVENEMENT, { date: '2027-01-12', titre: 'Partiel', heure: '09:00' })).toEqual([]);
  });

  it('signale champs manquants, formats, types et valeurs hors liste', () => {
    expect(validateArgs(TOOL_CREER_EVENEMENT, { titre: 'Partiel' })).toEqual(['date : paramètre obligatoire manquant']);
    expect(validateArgs(TOOL_CREER_EVENEMENT, { date: '12/01', titre: 'Partiel', heure: '9:00' })).toEqual([
      'date : format attendu AAAA-MM-JJ',
      'heure : format attendu HH:MM (ex. 09:00)',
    ]);
    expect(validateArgs(TOOL_CHERCHER_COURS, { requete: 'TCP', max_resultats: 'trois' })).toEqual(['max_resultats : un nombre entier est attendu']);
    expect(validateArgs(TOOL_CHERCHER_COURS, { requete: 'TCP', max_resultats: '40' })).toEqual(['max_resultats : valeur entre 1 et 10 attendue']);
    expect(validateArgs(TOOL_ENVOYER_MESSAGE, { destinataire: 'Léo', texte: 'Coucou' })[0]).toMatch(/hors liste/);
  });

  it('distingue un appel valide d’un appel conforme à la demande', () => {
    const task = CALL_TASKS[0]!;
    expect(intentErrors(task, { date: '2027-01-21', titre: 'Partiel', heure: '09:00' })).toEqual(['date : ce n’est pas ce qu’Inès a demandé']);
    expect(intentErrors(task, { date: '2027-01-12', titre: 'Partiel', heure: '09:00' })).toEqual([]);
  });

  it('chaque tâche a une solution valide', () => {
    const solutions: Record<string, Record<string, string>> = {
      agenda: { date: '2027-01-12', titre: 'Partiel de réseaux', heure: '09:00' },
      message: { destinataire: 'Léa Martin', texte: 'Le résumé du cours est sur le Drive.' },
      recherche: { requete: 'protocole TCP', max_resultats: '2' },
    };
    for (const task of CALL_TASKS) {
      const args = solutions[task.id]!;
      expect(validateArgs(task.tool, args), task.id).toEqual([]);
      expect(intentErrors(task, args), task.id).toEqual([]);
    }
  });

  it('produit un aperçu JSON avec les entiers typés', () => {
    expect(callPreview(TOOL_CHERCHER_COURS, { requete: 'TCP', max_resultats: '2' })).toBe('chercher_cours({"requete":"TCP","max_resultats":2})');
  });
});
