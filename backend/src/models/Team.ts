export default class Team {
  name: string;
  mp: number;
  w: number;
  l: number;
  p: number;

  constructor(name: string) {
    this.name = name;
    this.mp = 0;
    this.w = 0;
    this.l = 0;
    this.p = 0;
  }

  recordWin(): void {
    this.mp++;
    this.w++;
    this.p += 3;
  }

  recordLoss(): void {
    this.mp++;
    this.l++;
  }
}
