import Tournament from '../../models/Tournament';
import Team       from '../../models/Team';

const SAMPLE_INPUT = [
  'Germany;Spain;win',
  'France;Germany;win',
  'Poland;Spain;loss',
  'Spain;France;loss',
  'Germany;Poland;win',
].join('\n');

describe('Tournament', () => {
  let tournament: Tournament;

  beforeEach(() => {
    tournament = new Tournament();
  });

  // ── getOrCreateTeam ───────────────────────────────────────────────────────
  describe('getOrCreateTeam', () => {
    it('creates a new Team when the name is not yet registered', () => {
      const team = tournament.getOrCreateTeam('France');
      expect(team).toBeInstanceOf(Team);
      expect(team.name).toBe('France');
    });

    it('returns the same instance on subsequent calls', () => {
      const first  = tournament.getOrCreateTeam('France');
      const second = tournament.getOrCreateTeam('France');
      expect(first).toBe(second);
    });
  });

  // ── processMatch ──────────────────────────────────────────────────────────
  describe('processMatch', () => {
    it('records a win for the winner and a loss for the loser', () => {
      const { default: Match } = jest.requireActual('../../models/Match') as typeof import('../../models/Match');
      const match = Match.fromLine('Germany;Spain;win');
      tournament.processMatch(match);

      expect(tournament.teams['Germany'].w).toBe(1);
      expect(tournament.teams['Germany'].p).toBe(3);
      expect(tournament.teams['Spain'].l).toBe(1);
      expect(tournament.teams['Spain'].p).toBe(0);
    });
  });

  // ── processInput ──────────────────────────────────────────────────────────
  describe('processInput', () => {
    it('processes all valid lines from a multi-line string', () => {
      tournament.processInput(SAMPLE_INPUT);
      expect(Object.keys(tournament.teams)).toHaveLength(4);
    });

    it('ignores blank lines', () => {
      tournament.processInput('\nGermany;Spain;win\n\nFrance;Germany;win\n');
      expect(Object.keys(tournament.teams)).toHaveLength(3);
    });

    it('throws on malformed lines', () => {
      expect(() => tournament.processInput('BadLine')).toThrow();
    });
  });

  // ── loadState / exportState ───────────────────────────────────────────────
  describe('loadState / exportState', () => {
    it('round-trips state correctly', () => {
      tournament.processInput(SAMPLE_INPUT);
      const exported = tournament.exportState();

      const restored = new Tournament();
      restored.loadState(exported);

      expect(Object.keys(restored.teams)).toHaveLength(4);
      expect(restored.teams['Germany']).toMatchObject({ mp: 3, w: 2, l: 1, p: 6 });
    });

    it('exportState returns an empty object when no teams exist', () => {
      expect(tournament.exportState()).toEqual({});
    });

    it('loadState correctly hydrates mp, w, l, p for each team', () => {
      tournament.loadState({
        France: { name: 'France', mp: 2, w: 2, l: 0, p: 6 },
      });
      const t = tournament.teams['France'];
      expect(t.mp).toBe(2);
      expect(t.w).toBe(2);
      expect(t.l).toBe(0);
      expect(t.p).toBe(6);
    });
  });

  // ── getStandings ──────────────────────────────────────────────────────────
  describe('getStandings', () => {
    it('returns an empty array when no matches have been processed', () => {
      expect(tournament.getStandings()).toEqual([]);
    });

    it('sorts teams by points descending', () => {
      tournament.processInput(SAMPLE_INPUT);
      const standings = tournament.getStandings();
      for (let i = 0; i < standings.length - 1; i++) {
        expect(standings[i].p).toBeGreaterThanOrEqual(standings[i + 1].p);
      }
    });

    it('breaks ties alphabetically', () => {
      // France and Germany both end up with 6 pts → France comes first
      tournament.processInput(SAMPLE_INPUT);
      const standings = tournament.getStandings();
      expect(standings[0].name).toBe('France');
      expect(standings[1].name).toBe('Germany');
    });

    it('calculates correct stats for all four teams', () => {
      tournament.processInput(SAMPLE_INPUT);
      const standings = tournament.getStandings();
      const byName = Object.fromEntries(standings.map((t) => [t.name, t]));

      // France: wins games 2,4  → mp:2 w:2 l:0 p:6
      // Germany: wins games 1,5 loses game 2 → mp:3 w:2 l:1 p:6
      // Spain: wins game 3, loses games 1,4  → mp:3 w:1 l:2 p:3
      // Poland: loses games 3,5             → mp:2 w:0 l:2 p:0
      expect(byName['France']).toMatchObject({ mp: 2, w: 2, l: 0, p: 6 });
      expect(byName['Germany']).toMatchObject({ mp: 3, w: 2, l: 1, p: 6 });
      expect(byName['Spain']).toMatchObject({ mp: 3, w: 1, l: 2, p: 3 });
      expect(byName['Poland']).toMatchObject({ mp: 2, w: 0, l: 2, p: 0 });
    });
  });
});
