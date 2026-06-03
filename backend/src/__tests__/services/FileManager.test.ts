import fs   from 'fs';
import path from 'path';
import FileManager from '../../services/FileManager';

// src/__tests__/services → services → __tests__ → src → backend/ (3 levels up)
const RESULTS_FILE = path.join(__dirname, '..', '..', '..', 'results.json');

const SAMPLE_STATE = { Germany: { name: 'Germany', mp: 1, w: 1, l: 0, p: 3 } };

// Clean up any leftover file before and after every test.
beforeEach(() => { if (fs.existsSync(RESULTS_FILE)) fs.unlinkSync(RESULTS_FILE); });
afterEach(()  => { if (fs.existsSync(RESULTS_FILE)) fs.unlinkSync(RESULTS_FILE); });

describe('FileManager', () => {
  // ── hasResults ────────────────────────────────────────────────────────────
  describe('hasResults', () => {
    it('returns false when no results file exists', () => {
      expect(FileManager.hasResults()).toBe(false);
    });

    it('returns true after saveResults writes the file', () => {
      FileManager.saveResults(SAMPLE_STATE);
      expect(FileManager.hasResults()).toBe(true);
    });
  });

  // ── saveResults / loadResults ─────────────────────────────────────────────
  describe('saveResults / loadResults', () => {
    it('persists and retrieves the state correctly', () => {
      FileManager.saveResults(SAMPLE_STATE);
      const loaded = FileManager.loadResults();
      expect(loaded).toEqual(SAMPLE_STATE);
    });

    it('overwrites an existing file on a second save', () => {
      FileManager.saveResults(SAMPLE_STATE);
      const updated = { Spain: { name: 'Spain', mp: 2, w: 1, l: 1, p: 3 } };
      FileManager.saveResults(updated);
      expect(FileManager.loadResults()).toEqual(updated);
    });

    it('saves valid JSON with pretty-print formatting', () => {
      FileManager.saveResults(SAMPLE_STATE);
      const raw = fs.readFileSync(RESULTS_FILE, 'utf-8');
      expect(() => JSON.parse(raw)).not.toThrow();
      // Pretty-printed → must contain newlines
      expect(raw).toContain('\n');
    });
  });

  // ── resetResults ──────────────────────────────────────────────────────────
  describe('resetResults', () => {
    it('returns false and does nothing when no file exists', () => {
      expect(FileManager.resetResults()).toBe(false);
      expect(fs.existsSync(RESULTS_FILE)).toBe(false);
    });

    it('deletes the file and returns true when a file exists', () => {
      FileManager.saveResults(SAMPLE_STATE);
      expect(FileManager.resetResults()).toBe(true);
      expect(fs.existsSync(RESULTS_FILE)).toBe(false);
    });

    it('returns false on a second consecutive reset', () => {
      FileManager.saveResults(SAMPLE_STATE);
      FileManager.resetResults();
      expect(FileManager.resetResults()).toBe(false);
    });
  });
});
