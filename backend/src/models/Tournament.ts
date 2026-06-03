import Team from './Team';
import Match from './Match';

interface TeamState {
  name: string;
  mp: number;
  w: number;
  l: number;
  p: number;
}

export default class Tournament {
  teams: Record<string, Team>;

  constructor() {
    this.teams = {};
  }

  getOrCreateTeam(name: string): Team {
    if (!this.teams[name]) {
      this.teams[name] = new Team(name);
    }
    return this.teams[name];
  }

  processMatch(match: Match): void {
    this.getOrCreateTeam(match.getWinner()).recordWin();
    this.getOrCreateTeam(match.getLoser()).recordLoss();
  }

  processInput(input: string): void {
    input
      .trim()
      .split('\n')
      .filter((l) => l.trim())
      .forEach((line) => this.processMatch(Match.fromLine(line)));
  }

  loadState(saved: Record<string, TeamState>): void {
    Object.values(saved).forEach((t) => {
      const team = new Team(t.name);
      team.mp = t.mp;
      team.w  = t.w;
      team.l  = t.l;
      team.p  = t.p;
      this.teams[t.name] = team;
    });
  }

  exportState(): Record<string, TeamState> {
    const state: Record<string, TeamState> = {};
    Object.values(this.teams).forEach((t) => {
      state[t.name] = { name: t.name, mp: t.mp, w: t.w, l: t.l, p: t.p };
    });
    return state;
  }

  getStandings(): Team[] {
    return Object.values(this.teams).sort((a, b) =>
      b.p !== a.p ? b.p - a.p : a.name.localeCompare(b.name)
    );
  }
}
