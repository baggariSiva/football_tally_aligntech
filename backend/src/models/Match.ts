export type MatchOutcome = 'win' | 'loss';

export default class Match {
  team1: string;
  team2: string;
  outcome: MatchOutcome;

  static toTitleCase(str: string): string {
    return str
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  constructor(team1: string, team2: string, outcome: MatchOutcome) {
    this.team1 = Match.toTitleCase(team1);
    this.team2 = Match.toTitleCase(team2);
    this.outcome = outcome;
  }

  static fromLine(line: string): Match {
    const parts = line.trim().split(';');
    if (parts.length !== 3) {
      throw new Error(`Invalid match line: "${line}"`);
    }

    const [team1, team2, outcome] = parts.map((p) => p.trim());

    if (!['win', 'loss'].includes(outcome.toLowerCase())) {
      throw new Error(`Invalid outcome "${outcome}" in line: "${line}"`);
    }

    return new Match(team1, team2, outcome.toLowerCase() as MatchOutcome);
  }

  getWinner(): string {
    return this.outcome === 'win' ? this.team1 : this.team2;
  }

  getLoser(): string {
    return this.outcome === 'win' ? this.team2 : this.team1;
  }
}
