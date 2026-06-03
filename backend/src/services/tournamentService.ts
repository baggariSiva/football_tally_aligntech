import Tournament from '../models/Tournament';
import FileManager from './FileManager';
import Team from '../models/Team';


export const loadTournament = (): Tournament => {
  const t = new Tournament();
  if (FileManager.hasResults()) t.loadState(FileManager.loadResults() as Parameters<Tournament['loadState']>[0]);
  return t;
};

export const processAndSave = (inputString: string): Team[] => {
  const tournament = loadTournament();
  tournament.processInput(inputString);
  FileManager.saveResults(tournament.exportState());
  return tournament.getStandings();
};

export const getStandings = (): Team[] => loadTournament().getStandings();

export const resetStandings = (): boolean => FileManager.resetResults();
