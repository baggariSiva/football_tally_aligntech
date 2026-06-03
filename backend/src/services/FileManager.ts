import fs from 'fs';
import path from 'path';


const RESULTS_FILE = path.join(__dirname, '..', '..', 'results.json');

type State = Record<string, unknown>;

export default class FileManager {
  static hasResults(): boolean {
    return fs.existsSync(RESULTS_FILE);
  }

  static loadResults(): State {
    return JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf-8')) as State;
  }

  static saveResults(state: State): void {
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(state, null, 2), 'utf-8');
  }

  static resetResults(): boolean {
    if (fs.existsSync(RESULTS_FILE)) {
      fs.unlinkSync(RESULTS_FILE);
      return true;
    }
    return false;
  }
}
