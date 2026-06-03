'use client';

import { Team } from '../lib/types';

interface StandingsTableProps {
  standings: Team[];
}

export default function StandingsTable({ standings }: StandingsTableProps) {
  if (!standings || standings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm animate-slide-in">
        <span className="text-4xl mb-3">🏆</span>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">No Standings Yet</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          Submit some match results or upload a results file to view the competition leaderboard!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-xs tracking-wider uppercase">
              <th scope="col" className="px-6 py-4 w-16 text-center">#</th>
              <th scope="col" className="px-6 py-4">Team</th>
              <th scope="col" className="px-6 py-4 text-center" title="Matches Played">MP</th>
              <th scope="col" className="px-6 py-4 text-center" title="Wins">W</th>
              <th scope="col" className="px-6 py-4 text-center" title="Losses">L</th>
              <th scope="col" className="px-6 py-4 text-center font-bold text-slate-700 dark:text-slate-300" title="Points">P</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {standings.map((team, i) => {
              const isTop = i === 0;
              return (
                <tr
                  key={team.name}
                  className={`transition-colors duration-150 hover:bg-slate-50/50 dark:hover:bg-slate-850/30
                    ${isTop ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''}`}
                >
                  <td className="px-6 py-4 text-center font-semibold">
                    {isTop ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-900">
                        1
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 font-medium">
                        {i + 1}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                    {team.name}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400 font-mono">
                    {team.mp}
                  </td>
                  <td className="px-6 py-4 text-center text-emerald-600 dark:text-emerald-400 font-medium font-mono">
                    {team.w}
                  </td>
                  <td className="px-6 py-4 text-center text-rose-600 dark:text-rose-400 font-medium font-mono">
                    {team.l}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-base text-slate-900 dark:text-slate-100 font-mono">
                    {team.p}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
