import Match from '../../models/Match';

describe('Match', () => {
  describe('fromLine', () => {
    it('parses a "win" line correctly', () => {
      const match = Match.fromLine('Germany;Spain;win');
      expect(match.team1).toBe('Germany');
      expect(match.team2).toBe('Spain');
      expect(match.outcome).toBe('win');
    });

    it('parses a "loss" line correctly', () => {
      const match = Match.fromLine('Spain;France;loss');
      expect(match.team1).toBe('Spain');
      expect(match.team2).toBe('France');
      expect(match.outcome).toBe('loss');
    });

    it('trims whitespace and normalizes team names to Title Case', () => {
      const match = Match.fromLine('  germany ; sPAIN ; WIN ');
      expect(match.team1).toBe('Germany');
      expect(match.team2).toBe('Spain');
      expect(match.outcome).toBe('win');
    });

    it('handles multiple internal spaces in team names correctly', () => {
      const match = Match.fromLine('real   madrid;spain;win');
      expect(match.team1).toBe('Real Madrid');
      expect(match.team2).toBe('Spain');
    });

    it('throws on invalid format (wrong number of parts)', () => {
      expect(() => Match.fromLine('Germany;Spain')).toThrow('Invalid match line');
    });

    it('throws on invalid outcome', () => {
      expect(() => Match.fromLine('Germany;Spain;draw')).toThrow('Invalid outcome');
    });
  });

  describe('getWinner / getLoser', () => {
    it('getWinner returns team1 when outcome is "win"', () => {
      const match = Match.fromLine('Germany;Spain;win');
      expect(match.getWinner()).toBe('Germany');
      expect(match.getLoser()).toBe('Spain');
    });

    it('getWinner returns team2 when outcome is "loss"', () => {
      const match = Match.fromLine('Spain;France;loss');
      expect(match.getWinner()).toBe('France');
      expect(match.getLoser()).toBe('Spain');
    });
  });
});
