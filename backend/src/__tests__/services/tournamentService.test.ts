import fs   from 'fs';
import path from 'path';
import * as service from '../../services/tournamentService';

// Resolves to <project-root>/backend/results.json
// (src/__tests__/services → services → __tests__ → src → backend/ = 3 levels up)
const RESULTS_FILE = path.join(__dirname, '..', '..', '..', 'results.json');

const MATCH_A = 'Germany;Spain;win';    // Germany wins
const MATCH_B = 'France;Germany;win';   // France wins
const TWO_MATCHES = [MATCH_A, MATCH_B].join('\n');

beforeEach(() => { if (fs.existsSync(RESULTS_FILE)) fs.unlinkSync(RESULTS_FILE); });
afterEach(()  => { if (fs.existsSync(RESULTS_FILE)) fs.unlinkSync(RESULTS_FILE); });

describe('tournamentService', () => {
  // ── loadTournament ────────────────────────────────────────────────────────
  describe('loadTournament', () => {
    it('returns an empty Tournament when no results file exists', () => {
      const t = service.loadTournament();
      expect(Object.keys(t.teams)).toHaveLength(0);
    });

    it('reloads previous state when results file exists', () => {
      service.processAndSave(MATCH_A);
      const t = service.loadTournament();
      expect(Object.keys(t.teams)).toHaveLength(2);
      expect(t.teams['Germany'].w).toBe(1);
    });
  });

  // ── processAndSave ────────────────────────────────────────────────────────
  describe('processAndSave', () => {
    it('saves tournament state to results.json and returns sorted standings', () => {
      const standings = service.processAndSave(TWO_MATCHES);

      // Germany: wins A, loses B → mp:2 w:1 l:1 p:3
      // Spain: loses A           → mp:1 w:0 l:1 p:0
      // France: wins B           → mp:1 w:1 l:0 p:3
      // Standings sorted by points descending (France, Germany, Spain)
      expect(standings).toHaveLength(3);
      expect(standings[0].name).toBe('France');
      expect(standings[1].name).toBe('Germany');
      expect(standings[2].name).toBe('Spain');
      expect(fs.existsSync(RESULTS_FILE)).toBe(true);
    });
  });

  // ── resetStandings ────────────────────────────────────────────────────────
  describe('resetStandings', () => {
    it('returns false when no results file exists', () => {
      expect(service.resetStandings()).toBe(false);
    });

    it('deletes results.json and returns true when it exists', () => {
      service.processAndSave(MATCH_A);
      expect(service.resetStandings()).toBe(true);
      expect(fs.existsSync(RESULTS_FILE)).toBe(false);
    });
  });

  // ── getStandings ──────────────────────────────────────────────────────────
  describe('getStandings', () => {
    it('returns empty array when results file does not exist', () => {
      expect(service.getStandings()).toEqual([]);
    });

    it('returns current standings when results file exists', () => {
      service.processAndSave(MATCH_A);
      const standings = service.getStandings();
      expect(standings).toHaveLength(2);
      expect(standings[0].name).toBe('Germany');
    });
  });
});
