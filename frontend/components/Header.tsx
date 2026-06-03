'use client';

interface HeaderProps {
  onReset: () => void;
  loading: boolean;
}

export default function Header({ onReset, loading }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-950 to-blue-700 dark:from-slate-950 dark:to-blue-950 text-white py-6 px-8 shadow-lg border-b border-blue-900 dark:border-slate-800">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl flex items-center gap-2 font-mono">
            <span>⚽</span> Football Tally
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 dark:text-slate-400 mt-1 font-medium">
            Track match results and standings
          </p>
        </div>
        <button
          onClick={onReset}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-white/20 bg-white/10 dark:bg-slate-800/50 dark:border-slate-700 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-white/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          id="btn-reset-standings"
        >
          🗑️ Reset
        </button>
      </div>
    </header>
  );
}
