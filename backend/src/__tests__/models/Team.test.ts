import Team from '../../models/Team';

describe('Team', () => {
  let team: Team;

  beforeEach(() => {
    team = new Team('France');
  });

  it('initialises with zero stats', () => {
    expect(team.name).toBe('France');
    expect(team.mp).toBe(0);
    expect(team.w).toBe(0);
    expect(team.l).toBe(0);
    expect(team.p).toBe(0);
  });

  it('recordWin increments mp, w, and adds 3 points', () => {
    team.recordWin();
    expect(team.mp).toBe(1);
    expect(team.w).toBe(1);
    expect(team.l).toBe(0);
    expect(team.p).toBe(3);
  });

  it('recordLoss increments mp and l only', () => {
    team.recordLoss();
    expect(team.mp).toBe(1);
    expect(team.w).toBe(0);
    expect(team.l).toBe(1);
    expect(team.p).toBe(0);
  });

  it('accumulates stats correctly over multiple matches', () => {
    team.recordWin();
    team.recordWin();
    team.recordLoss();
    expect(team.mp).toBe(3);
    expect(team.w).toBe(2);
    expect(team.l).toBe(1);
    expect(team.p).toBe(6);
  });
});
